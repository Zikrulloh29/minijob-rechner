import { useState } from 'react';
import { WorkEntry, UserSettings } from '../../types/database';
import { calculateEarnings, formatCurrency, formatHours } from '../../utils/calculations';
import { Trash2, Calendar, Clock } from 'lucide-react';

interface WorkEntryListProps {
  entries: WorkEntry[];
  settings: UserSettings;
  selectedMonth: string;
  onUpdateEntry: (id: string, updates: Partial<WorkEntry>) => Promise<{ error?: Error }>;
  onDeleteEntry: (id: string) => Promise<{ error?: Error }>;
}

export const WorkEntryList = ({ entries, settings, selectedMonth, onDeleteEntry }: WorkEntryListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredEntries = entries.filter(entry => {
    const entryMonth = entry.work_date.substring(0, 7);
    return entryMonth === selectedMonth;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Eintrag wirklich löschen?')) return;

    setDeletingId(id);
    await onDeleteEntry(id);
    setDeletingId(null);
  };

  if (filteredEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-1">
          Keine Einträge vorhanden
        </h3>
        <p className="text-gray-500 text-sm">
          Fügen Sie Ihren ersten Arbeitseintrag für diesen Monat hinzu.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Arbeitseinsätze</h2>
        <p className="text-sm text-gray-600 mt-1">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'Eintrag' : 'Einträge'}
        </p>
      </div>

      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {filteredEntries.map((entry) => {
          const earnings = calculateEarnings(entry, settings);
          const totalHours = entry.normal_hours + entry.late_hours + entry.night_hours;
          const date = new Date(entry.work_date + 'T00:00:00');
          const formattedDate = date.toLocaleDateString('de-DE', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });

          return (
            <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 text-gray-700">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatHours(totalHours)}</span>
                    </div>
                    {entry.start_time && entry.end_time && (
                      <div className="text-sm text-gray-500">
                        {entry.start_time} - {entry.end_time}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                    {entry.normal_hours > 0 && (
                      <div>Normal: {formatHours(entry.normal_hours)}</div>
                    )}
                    {entry.late_hours > 0 && (
                      <div>Spät: {formatHours(entry.late_hours)}</div>
                    )}
                    {entry.night_hours > 0 && (
                      <div>Nacht: {formatHours(entry.night_hours)}</div>
                    )}
                    {entry.additional_payment > 0 && (
                      <div>Zusatz: {formatCurrency(entry.additional_payment)}</div>
                    )}
                  </div>

                  {entry.notes && (
                    <p className="text-sm text-gray-500 italic">{entry.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">
                      {formatCurrency(earnings)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
