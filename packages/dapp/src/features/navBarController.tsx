'use client';
import { useState } from 'react';

export const useToggle = (): [boolean, () => void] => {
   const [isOpen, setIsOpen] = useState<boolean>(false);

   const handleClick = () => {
      setIsOpen((prevIsOpen) => !prevIsOpen);
   };

   return [isOpen, handleClick];
};
