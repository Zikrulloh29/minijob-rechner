import { useState } from 'react';
import { Plus } from 'lucide-react';
import { UserSettings } from '../../types/database';
import { calculateEarnings, formatCurrency } from '../../utils/calculations';

interface WorkEntryFormProps {
  settings: UserSettings;
  onAddEntry: (entry: {
    work_date: string;
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
  const [normalHours, setNormalHours] = useState('');
  const [lateHours, setLateHours] = useState('');
  const [nightHours, setNightHours] = useState('');
  const [additionalPayment, setAdditionalPayment] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewEarnings = calculateEarnings(
    {
      normal_hours: parseFloat(normalHours) || 0,
      late_hours: parseFloat(lateHours) || 0,
      night_hours: parseFloat(nightHours) || 0,
      additional_payment: parseFloat(additionalPayment) || 0,
    } as any,
    settings
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await onAddEntry({
      work_date: workDate,
      normal_hours: parseFloat(normalHours) || 0,
      late_hours: parseFloat(lateHours) || 0,
      night_hours: parseFloat(nightHours) || 0,
      additional_payment: parseFloat(additionalPayment) || 0,
      notes: notes.trim(),
    });

    if (result.error) {
      setError('Fehler beim Hinzufügen des Eintrags.');
    } else {
      setNormalHours('');
      setLateHours('');
      setNightHours('');
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

        <div>
          <label htmlFor="normalHours" className="block text-sm font-medium text-gray-700 mb-1">
            Normale Stunden
          </label>
          <input
            id="normalHours"
            type="number"
            step="0.01"
            min="0"
            value={normalHours}
            onChange={(e) => setNormalHours(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Stundenlohn: {formatCurrency(settings.hourly_wage)}
          </p>
        </div>

        <div>
          <label htmlFor="lateHours" className="block text-sm font-medium text-gray-700 mb-1">
            Spätstunden
          </label>
          <input
            id="lateHours"
            type="number"
            step="0.01"
            min="0"
            value={lateHours}
            onChange={(e) => setLateHours(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            +{settings.late_shift_percentage}% Zuschlag = {formatCurrency(settings.hourly_wage * (settings.late_shift_percentage / 100))}/Std.
          </p>
        </div>

        <div>
          <label htmlFor="nightHours" className="block text-sm font-medium text-gray-700 mb-1">
            Nachtstunden
          </label>
          <input
            id="nightHours"
            type="number"
            step="0.01"
            min="0"
            value={nightHours}
            onChange={(e) => setNightHours(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            +{settings.night_shift_percentage}% Zuschlag = {formatCurrency(settings.hourly_wage * (settings.night_shift_percentage / 100))}/Std.
          </p>
        </div>

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
