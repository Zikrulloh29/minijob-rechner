import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { UserSettings } from '../../types/database';
import { formatCurrency } from '../../utils/calculations';

interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => Promise<{ error?: Error }>;
  onClose: () => void;
}

export const SettingsPanel = ({ settings, onUpdate, onClose }: SettingsPanelProps) => {
  const [monthlyLimit, setMonthlyLimit] = useState(settings.monthly_limit.toString());
  const [hourlyWage, setHourlyWage] = useState(settings.hourly_wage.toString());
  const [lateShiftPercentage, setLateShiftPercentage] = useState(settings.late_shift_percentage.toString());
  const [nightShiftPercentage, setNightShiftPercentage] = useState(settings.night_shift_percentage.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const result = await onUpdate({
      monthly_limit: parseFloat(monthlyLimit),
      hourly_wage: parseFloat(hourlyWage),
      late_shift_percentage: parseFloat(lateShiftPercentage),
      night_shift_percentage: parseFloat(nightShiftPercentage),
    });

    if (result?.error) {
      setError('Fehler beim Speichern der Einstellungen.');
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  const lateSurcharge = parseFloat(hourlyWage) * (parseFloat(lateShiftPercentage) / 100);
  const nightSurcharge = parseFloat(hourlyWage) * (parseFloat(nightShiftPercentage) / 100);

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Einstellungen</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="monthlyLimit" className="block text-sm font-medium text-gray-700 mb-1">
            Monatliche Verdienstgrenze (€)
          </label>
          <input
            id="monthlyLimit"
            type="number"
            step="0.01"
            min="0"
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Standard für Minijobs: 600,00 €
          </p>
        </div>

        <div>
          <label htmlFor="hourlyWage" className="block text-sm font-medium text-gray-700 mb-1">
            Stundenlohn (€)
          </label>
          <input
            id="hourlyWage"
            type="number"
            step="0.01"
            min="0"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ihr regulärer Stundenlohn
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Zuschläge</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="lateShiftPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Spätstundenzuschlag (%)
              </label>
              <input
                id="lateShiftPercentage"
                type="number"
                step="0.01"
                min="0"
                value={lateShiftPercentage}
                onChange={(e) => setLateShiftPercentage(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Zuschlag pro Stunde: {formatCurrency(isNaN(lateSurcharge) ? 0 : lateSurcharge)}
              </p>
            </div>

            <div>
              <label htmlFor="nightShiftPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Nachtstundenzuschlag (%)
              </label>
              <input
                id="nightShiftPercentage"
                type="number"
                step="0.01"
                min="0"
                value={nightShiftPercentage}
                onChange={(e) => setNightShiftPercentage(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Zuschlag pro Stunde: {formatCurrency(isNaN(nightSurcharge) ? 0 : nightSurcharge)}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            Einstellungen erfolgreich gespeichert!
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
};
