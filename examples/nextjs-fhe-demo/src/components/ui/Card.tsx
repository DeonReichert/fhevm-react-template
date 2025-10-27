import { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const Card: FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
}) => {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-300">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
