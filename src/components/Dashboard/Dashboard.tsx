import { useState } from 'react';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Target,
  AlertCircle,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserSettings } from '../../hooks/useUserSettings';
import { useWorkEntries } from '../../hooks/useWorkEntries';
import { calculateMonthlyStats, formatCurrency, formatHours, getCurrentMonth, formatMonthDisplay } from '../../utils/calculations';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';
import { WorkEntryForm } from '../WorkEntry/WorkEntryForm';
import { WorkEntryList } from '../WorkEntry/WorkEntryList';
import { SettingsPanel } from '../Settings/SettingsPanel';

export const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showSettings, setShowSettings] = useState(false);
  const { signOut } = useAuth();
  const { settings, loading: settingsLoading, updateSettings } = useUserSettings();
  const { entries, loading: entriesLoading, addEntry, updateEntry, deleteEntry } = useWorkEntries();

  if (settingsLoading || entriesLoading || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Lädt...</p>
        </div>
      </div>
    );
  }

  const stats = calculateMonthlyStats(entries, settings, selectedMonth);

  const handlePreviousMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 2);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(getCurrentMonth());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Minijob Rechner</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <SettingsIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Einstellungen</span>
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showSettings ? (
          <SettingsPanel
            settings={settings}
            onUpdate={updateSettings}
            onClose={() => setShowSettings(false)}
          />
        ) : (
          <>
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {formatMonthDisplay(selectedMonth)}
                  </h2>
                  {selectedMonth !== getCurrentMonth() && (
                    <button
                      onClick={handleCurrentMonth}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                    >
                      Aktueller Monat
                    </button>
                  )}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {(stats.isNearLimit || stats.isOverLimit) && (
              <div className={`mb-6 ${stats.isOverLimit ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border-2 rounded-lg p-4 flex items-start gap-3`}>
                <AlertCircle className={`w-6 h-6 flex-shrink-0 ${stats.isOverLimit ? 'text-red-600' : 'text-amber-600'}`} />
                <div>
                  <h3 className={`font-bold ${stats.isOverLimit ? 'text-red-800' : 'text-amber-800'} mb-1`}>
                    {stats.isOverLimit ? 'Verdienstgrenze überschritten!' : 'Achtung: Verdienstgrenze fast erreicht!'}
                  </h3>
                  <p className={`text-sm ${stats.isOverLimit ? 'text-red-700' : 'text-amber-700'}`}>
                    {stats.isOverLimit
                      ? `Sie haben die monatliche Grenze um ${formatCurrency(stats.totalEarnings - settings.monthly_limit)} überschritten.`
                      : `Sie haben bereits ${stats.percentageUsed.toFixed(1)}% Ihrer monatlichen Grenze erreicht.`
                    }
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
              <ProgressBar
                percentage={stats.percentageUsed}
                isNearLimit={stats.isNearLimit}
                isOverLimit={stats.isOverLimit}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Monatliche Grenze"
                value={formatCurrency(settings.monthly_limit)}
                icon={Target}
                variant="default"
              />
              <StatCard
                title="Bereits verdient"
                value={formatCurrency(stats.totalEarnings)}
                icon={DollarSign}
                subtitle={`${stats.percentageUsed.toFixed(1)}% der Grenze`}
                variant={stats.isOverLimit ? 'danger' : stats.isNearLimit ? 'warning' : 'success'}
              />
              <StatCard
                title="Noch verfügbar"
                value={formatCurrency(stats.remainingEarnings)}
                icon={TrendingUp}
                variant={stats.remainingEarnings <= 0 ? 'danger' : 'success'}
              />
              <StatCard
                title="Gearbeitete Stunden"
                value={formatHours(stats.totalHours)}
                icon={Clock}
                subtitle={stats.remainingHours > 0 ? `Noch ~${formatHours(stats.remainingHours)} möglich` : 'Limit erreicht'}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WorkEntryForm
                  settings={settings}
                  onAddEntry={addEntry}
                  selectedMonth={selectedMonth}
                />
              </div>
              <div className="lg:col-span-2">
                <WorkEntryList
                  entries={entries}
                  settings={settings}
                  selectedMonth={selectedMonth}
                  onUpdateEntry={updateEntry}
                  onDeleteEntry={deleteEntry}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
