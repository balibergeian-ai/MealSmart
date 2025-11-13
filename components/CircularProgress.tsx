
import React from 'react';

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, size, strokeWidth }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        className="text-slate-200"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className="text-green-500"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 0.35s', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
    </svg>
  );
};

export default CircularProgress;
