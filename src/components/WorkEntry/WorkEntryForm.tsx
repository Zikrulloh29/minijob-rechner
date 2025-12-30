import { useState } from 'react';
import { Plus } from 'lucide-react';
import { UserSettings } from '../../types/database';
import { calculateEarnings, formatCurrency, categorizeHoursByTime } from '../../utils/calculations';

interface WorkEntryFormProps {
  settings: UserSettings;
  onAddEntry: (entry: {
    work_date: string;
    start_time: string | null;
    end_time: string | null;
    normal_hours: number;
    late_hours: number;
    night_hours: number;
    additional_payment: number;
    notes: string;
  }) => Promise<{ error?: Error }>;
  selectedMonth: string;
}

export const WorkEntryForm = ({ settings, onAddEntry, selectedMonth }: WorkEntryFormProps) => {
  const today = new Date().toISOString().split('T')[0];
  const [workDate, setWorkDate] = useState(today);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [additionalPayment, setAdditionalPayment] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categorized = startTime && endTime ? categorizeHoursByTime(startTime, endTime) : { normalHours: 0, lateHours: 0, nightHours: 0 };

  const previewEarnings = calculateEarnings(
    {
      normal_hours: categorized.normalHours,
      late_hours: categorized.lateHours,
      night_hours: categorized.nightHours,
      additional_payment: parseFloat(additionalPayment) || 0,
    } as any,
    settings
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startTime || !endTime) {
      setError('Bitte geben Sie Start- und Endzeit ein.');
      return;
    }

    setLoading(true);

    const result = await onAddEntry({
      work_date: workDate,
      start_time: startTime,
      end_time: endTime,
      normal_hours: categorized.normalHours,
      late_hours: categorized.lateHours,
      night_hours: categorized.nightHours,
      additional_payment: parseFloat(additionalPayment) || 0,
      notes: notes.trim(),
    });

    if (result.error) {
      setError('Fehler beim Hinzufügen des Eintrags.');
    } else {
      setStartTime('');
      setEndTime('');
      setAdditionalPayment('');
      setNotes('');
      setWorkDate(today);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Neuer Eintrag</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="workDate" className="block text-sm font-medium text-gray-700 mb-1">
            Datum
          </label>
          <input
            id="workDate"
            type="date"
            value={workDate}
            onChange={(e) => setWorkDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
              Startzeit
            </label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
              Endzeit
            </label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {startTime && endTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Normal</p>
                <p className="font-semibold text-gray-900">{categorized.normalHours.toFixed(2)} Std.</p>
                <p className="text-xs text-gray-500">{formatCurrency(categorized.normalHours * settings.hourly_wage)}</p>
              </div>
              <div>
                <p className="text-gray-600">Spät (18:30+)</p>
                <p className="font-semibold text-gray-900">{categorized.lateHours.toFixed(2)} Std.</p>
                <p className="text-xs text-gray-500">+{settings.late_shift_percentage}%</p>
              </div>
              <div>
                <p className="text-gray-600">Nacht (20:00+)</p>
                <p className="font-semibold text-gray-900">{categorized.nightHours.toFixed(2)} Std.</p>
                <p className="text-xs text-gray-500">+{settings.night_shift_percentage}%</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="additionalPayment" className="block text-sm font-medium text-gray-700 mb-1">
            Zusätzliche Zahlungen
          </label>
          <input
            id="additionalPayment"
            type="number"
            step="0.01"
            min="0"
            value={additionalPayment}
            onChange={(e) => setAdditionalPayment(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            z.B. Bonus, Trinkgeld, Sonderzuschläge
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notizen (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Optionale Notizen..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {previewEarnings > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              Voraussichtlicher Verdienst: <span className="font-bold">{formatCurrency(previewEarnings)}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {loading ? 'Wird hinzugefügt...' : 'Eintrag hinzufügen'}
        </button>
      </form>
    </div>
  );
};
