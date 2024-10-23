import React from 'react';
import { notificationProps } from '@/utils/dev/frontEndInterfaces';

// Create an array of objects conforming to the Props interface
const notifications: notificationProps[] = [
   {
      title: 'Event Invitation',
      message:
         "You have been added to the 'Annual Developer Conference'. Please approve your participation.",
      dateTime: '2024-03-26 10:00 AM',
   },
   {
      title: 'Event Reminder',
      message:
         "Reminder: You are attending the 'Web3 Innovators Meetup' tomorrow. Click to see more details.",
      dateTime: '2024-03-27 08:00 AM',
   },
   {
      title: 'Art Exhibition Opening',
      message:
         "Explore the latest in contemporary art at the 'Visionaries 2024' exhibition opening this Friday.",
      dateTime: '2024-03-28 06:00 PM',
   },
   {
      title: 'Art Workshop Enrollment',
      message:
         "Unlock your creativity: Enroll in our 'Digital Art Mastery' workshop now. Limited spots available!",
      dateTime: '2024-03-29 01:00 PM',
   },
   {
      title: 'Event Confirmation',
      message:
         "Your attendance for the 'Global Tech Symposium' has been confirmed. See you there!",
      dateTime: '2024-03-30 09:00 AM',
   },
];

const Page = () => {
   return (
      <div className="w-full">
         <div className="py-6 text-center md:text-left  md:px-6">
            <h2 className="text-lg font-semibold text-gray-950">Notifications</h2>
         </div>

         <div>
            {notifications.map((note, index) => (
               <div
                  key={index}
                  className="border-b border-gray-100 p-6 space-y-2 hover:bg-gray-100/50 cursor-pointer"
               >
                  <h3 className="font-medium text-gray-950">{note.title}</h3>
                  <p className="text-sm text-gray-700">{note.message}</p>
                  <p className="text-xs text-gray-700">{note.dateTime}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default Page;
