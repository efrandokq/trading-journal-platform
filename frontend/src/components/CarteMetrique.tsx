import React from 'react';

interface CarteMetriqueProps {
  label: string;
  value: string | number;
  change?: number;
  color: 'green' | 'blue' | 'purple' | 'red' | 'amber';
  icon?: React.ReactNode;
}

const CarteMetrique: React.FC<CarteMetriqueProps> = ({
  label,
  value,
  change,
  color,
  icon,
}) => {
  const colorClasses = {
    green: 'border-l-green-500 bg-green-50',
    blue: 'border-l-blue-500 bg-blue-50',
    purple: 'border-l-purple-500 bg-purple-50',
    red: 'border-l-red-500 bg-red-50',
    amber: 'border-l-amber-500 bg-amber-50',
  };

  const textColorClasses = {
    green: 'text-green-700',
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    red: 'text-red-700',
    amber: 'text-amber-700',
  };

  return (
    <div
      className={`${colorClasses[color]} border-l-4 rounded-lg p-6 shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-600">{label}</h3>
        {icon && <div className={textColorClasses[color]}>{icon}</div>}
      </div>
      <p className={`text-3xl font-bold ${textColorClasses[color]} mb-2`}>{value}</p>
      {change !== undefined && (
        <p
          className={`text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% par rapport au mois dernier
        </p>
      )}
    </div>
  );
};

export default CarteMetrique;