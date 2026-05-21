import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  onClick,
  type = 'button'
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'border-2 border-ibm-blue text-ibm-blue hover:bg-ibm-blue hover:text-white',
    ghost: 'text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]}
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </button>
  );
};

// Made with Bob
