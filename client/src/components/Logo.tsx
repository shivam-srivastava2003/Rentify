import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', light = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-md shadow-teal-500/20 group-hover:shadow-teal-500/40 group-hover:scale-105 transition-all duration-200 ${iconSizes[size]}`}>
        {/* House / Key Roof Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5 text-white"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
        {/* Amber Dot Accent */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
      </div>
      <div className="flex flex-col">
        <span className={`font-black tracking-tight ${textSizes[size]} ${light ? 'text-white' : 'text-slate-900'}`}>
          Rent<span className="text-teal-600">ify</span>
        </span>
      </div>
    </Link>
  );
};

export default Logo;
