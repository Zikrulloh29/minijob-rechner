import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const StatCard = ({ title, value, icon: Icon, subtitle, variant = 'default' }: StatCardProps) => {
  const colorClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    danger: 'bg-red-50 border-red-200 text-red-700',
  };

  const iconBgClasses = {
    default: 'bg-blue-100',
    success: 'bg-green-100',
    warning: 'bg-amber-100',
    danger: 'bg-red-100',
  };

  return (
    <div className={`${colorClasses[variant]} border-2 rounded-lg p-6 transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <p className="text-2xl font-bold mb-1">{value}</p>
          {subtitle && <p className="text-sm opacity-70">{subtitle}</p>}
        </div>
        <div className={`${iconBgClasses[variant]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
