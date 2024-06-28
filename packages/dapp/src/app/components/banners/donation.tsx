'use client';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';

export const Banner = () => {
  const [open, setOpen] = useState(true);
  return (
    <div
      className={`w-full inset-0 flex relative justify-center bg-ge-500 text-p3-r text-whote underline  ${
        open === false ? 'hidden' : 'bock'
      }`}
    >
      Donate and help us support more counties{' '}
      <XMarkIcon
        onClick={() => {
          setOpen(!open);
        }}
        className="absolute right-5 top-[2px] w-4 "
      />
    </div>
  );
};
