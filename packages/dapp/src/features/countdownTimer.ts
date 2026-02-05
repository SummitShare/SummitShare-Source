// utils/countdown.ts
export interface TimeLeft {
   days: number;
   hours: number;
   minutes: number;
   seconds: number;
}

export const calculateTimeLeft = (): TimeLeft | null => {
   const targetDate = new Date('2024-12-13T00:00:00Z'); // TZ UTC 0
   const currentDate = new Date();
   const difference = targetDate.getTime() - currentDate.getTime();

   if (difference > 0) {
      return {
         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
         minutes: Math.floor((difference / 1000 / 60) % 60),
         seconds: Math.floor((difference / 1000) % 60),
      };
   }

   return null; // Countdown complete
};

export const isCountdownComplete = (): boolean => {
   const targetDate = new Date('2024-12-13T00:00:00Z');
   const currentDate = new Date();
   return currentDate >= targetDate;
};
