import { QrCodeIcon } from '@heroicons/react/24/outline';
import React from 'react';

// Create an array of objects conforming to the Props interface
const tickets = [
   {
      title: 'Lusaka Art Gallery',
      details: 'Expressing the word with color',
      dateTime: '2024-03-26 10:00 AM',
   },
   {
      title: 'Women’s History Museum',
      details: 'Those who walked before us and those to come.',
      dateTime: '2024-03-27 08:00 AM',
   },
   {
      title: 'Alliance Francaise Lusaka',
      details: 'Those who walked before us and those to come.',
      dateTime: '2024-03-28 06:00 PM',
   },
];

const Page = () => {
   return (
      <div className="w-full">
         <div className="py-6 text-center md:text-left  md:px-6">
            <h2 className="text-lg font-semibold text-gray-950">Tickets</h2>
         </div>

         <div>
            {tickets.map((ticket, index) => (
               <div
                  key={index}
                  className="flex flex-row w-full items-center justify-between border-b border-gray-100 px-6 py-3 hover:bg-gray-100/50 cursor-pointer"
               >
                  <div className="space-y-2">
                     <h3 className="font-medium text-gray-950">{ticket.title}</h3>
                     <p className="text-sm text-gray-700">{ticket.details}</p>
                     <p className="text-xs text-gray-700">{ticket.dateTime}</p>
                  </div>
                  <QrCodeIcon className="w-6" />
               </div>
            ))}
         </div>
      </div>
   );
};

export default Page;
