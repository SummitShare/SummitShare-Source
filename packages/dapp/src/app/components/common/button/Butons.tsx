import React, { ReactNode } from 'react';
interface ButtonProps{
  children: ReactNode;
  type?: 'primary' | 'secondary';
  size?: 'large' | 'small';
  active?: boolean;
}

const Buttons: React.FC<ButtonProps> = ({ children, type = 'primary', size = 'large', active = false, ...props }) => {
  const baseClass = 'h-[3rem] w-full px-[1rem] rounded-[0.25rem] transition duration-300';
  const activeClass = active ? 'opacity-100' : '';
  const sizeClass = size === 'small' ? 'h-[2rem] px-[0.5rem] text-sm' : '';

  const primaryClass = `bg-primary-400 text-white ${activeClass}`;
  const secondaryClass = `border border-primary-400 text-primary-400 ${activeClass}`;

  const className = `${baseClass} ${sizeClass} ${type === 'primary' ? primaryClass : secondaryClass}`;

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Buttons;
