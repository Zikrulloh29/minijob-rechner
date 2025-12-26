interface ProgressBarProps {
  percentage: number;
  isNearLimit: boolean;
  isOverLimit: boolean;
}

export const ProgressBar = ({ percentage, isNearLimit, isOverLimit }: ProgressBarProps) => {
  const displayPercentage = Math.min(percentage, 100);

  const getColor = () => {
    if (isOverLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getBackgroundColor = () => {
    if (isOverLimit) return 'bg-red-100';
    if (isNearLimit) return 'bg-amber-100';
    return 'bg-gray-200';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Verdienstgrenze</span>
        <span className={`text-sm font-bold ${isOverLimit ? 'text-red-700' : isNearLimit ? 'text-amber-700' : 'text-gray-700'}`}>
          {displayPercentage.toFixed(1)}%
        </span>
      </div>
      <div className={`w-full h-4 ${getBackgroundColor()} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
    </div>
  );
};
