'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { ConnectKitButton } from 'connectkit';

// Interface for ButtonProps defining the properties that can be passed to the Buttons component
interface ButtonProps {
   children?: ReactNode; // The content to be displayed inside the button
   type?: 'primary' | 'secondary' | 'tartary' | 'subTartary'; // The style type of the button, default is 'primary'
   size?: 'large' | 'small'; // The size of the button, default is 'small'
   active?: boolean; // The state of the button, default is false (inactive)
   isConnectButton?: boolean;
   onClick?: any; // Indicates if this button should be the Connect Wallet button
   disabled?: boolean;
}

/**
 * @function Buttons
 * @description A functional component that renders a customizable button with different styles, sizes, and states.
 * @param {ButtonProps} props - The properties passed to the button component.
 * @returns {JSX.Element} The rendered button element.
 */
const Buttons: React.FC<ButtonProps> = ({
   children,
   type = 'primary',
   size = 'small',
   active = true,
   isConnectButton = false,

   ...props
}) => {
   // Base class for all buttons
   const baseClass = 'w-full px-[1rem] rounded-[0.25rem] transition duration-300';

   // Class for inactive buttons
   const activeClass = active ? '' : 'bg-stone-100 text-stone-400 border-none';

   // Class for small-sized buttons
   const sizeClass = size === 'small' ? 'h-[38px] p2-m' : 'h-[48px] p1-m';

   // Class for primary-type buttons
   const primaryClass = `bg-primary-600 hover:bg-primary-600/95 text-white ${activeClass}`;

   // Class for secondary-type buttons
   const secondaryClass = `border border-primary-600 hover:text-white hover:bg-primary-600 text-primary-600 ${activeClass}`;

   const tartaryClass = `bg-white text-primary-900 hover:bg-white/95 ${activeClass}`;
   const subTartaryClass = `bg-primary-900 text-white hover:bg-primary-900/95 ${activeClass}`;

   // Final class combining base class and type/size-specific classes
   const className = `${baseClass} ${type === 'primary' && primaryClass} ${
      type === 'tartary' && tartaryClass
   } ${type === 'secondary' && secondaryClass} ${
      type === 'subTartary' && subTartaryClass
   } ${sizeClass} ${sizeClass}`;

   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true);
   }, []);

   return (
      <button className={className} {...props}>
         {isConnectButton && isClient ? <ConnectKitButton /> : children}
      </button>
   );
};

export default Buttons;
