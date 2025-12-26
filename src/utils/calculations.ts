import { WorkEntry, UserSettings } from '../types/database';

export interface MonthlyStats {
  totalEarnings: number;
  totalHours: number;
  remainingEarnings: number;
  remainingHours: number;
  percentageUsed: number;
  isNearLimit: boolean;
  isOverLimit: boolean;
}

export const calculateEarnings = (
  entry: WorkEntry,
  settings: UserSettings
): number => {
  const { normal_hours, late_hours, night_hours, additional_payment } = entry;
  const { hourly_wage, late_shift_percentage, night_shift_percentage } = settings;

  const normalEarnings = normal_hours * hourly_wage;
  const lateSurcharge = late_hours * hourly_wage * (late_shift_percentage / 100);
  const nightSurcharge = night_hours * hourly_wage * (night_shift_percentage / 100);

  return normalEarnings + lateSurcharge + nightSurcharge + additional_payment;
};

export const calculateMonthlyStats = (
  entries: WorkEntry[],
  settings: UserSettings,
  selectedMonth: string
): MonthlyStats => {
  const filteredEntries = entries.filter(entry => {
    const entryMonth = entry.work_date.substring(0, 7);
    return entryMonth === selectedMonth;
  });

  const totalEarnings = filteredEntries.reduce((sum, entry) => {
    return sum + calculateEarnings(entry, settings);
  }, 0);

  const totalHours = filteredEntries.reduce((sum, entry) => {
    return sum + entry.normal_hours;
  }, 0);

  const remainingEarnings = Math.max(0, settings.monthly_limit - totalEarnings);
  const averageHourlyRate = totalHours > 0 ? totalEarnings / totalHours : settings.hourly_wage;
  const remainingHours = averageHourlyRate > 0 ? remainingEarnings / averageHourlyRate : 0;

  const percentageUsed = (totalEarnings / settings.monthly_limit) * 100;
  const isNearLimit = percentageUsed >= 80;
  const isOverLimit = percentageUsed >= 100;

  return {
    totalEarnings,
    totalHours,
    remainingEarnings,
    remainingHours,
    percentageUsed,
    isNearLimit,
    isOverLimit,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

export const formatHours = (hours: number): string => {
  return `${hours.toFixed(2)} Std.`;
};

export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const formatMonthDisplay = (month: string): string => {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });
};
