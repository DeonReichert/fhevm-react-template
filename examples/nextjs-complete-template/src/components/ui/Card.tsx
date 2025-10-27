import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
};
