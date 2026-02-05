// ticketService.ts

import { calculateTimeLeft } from '@/features/countdownTimer';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React from 'react';
import { useAccount } from 'wagmi';

// Helper function to get userId from session
const getUserIdFromSession = (
   session: ReturnType<typeof useSession>
): string | null => {
   return session.data?.user?.id || null;
};

const ENABLE_VALIDATION = false;

export const validateTicket = async (
   userAddress: string | undefined,
   eventId: string,
   user_id: string,
   setHasTicket: React.Dispatch<React.SetStateAction<boolean>>,
   setButtonType: React.Dispatch<
      React.SetStateAction<'primary' | 'secondary' | 'tartary' | 'subTartary'>
   >,
   setButtonText: React.Dispatch<React.SetStateAction<string>>
) => {
   if (!userAddress || !eventId || !user_id) {
      console.warn('Missing required parameters for ticket validation');
      return;
   }
   if (!ENABLE_VALIDATION) {
      console.log('Ticket validation is currently disabled');
      setHasTicket(false);
      setButtonType('primary');
      setButtonText('Validation Disabled'); // Optional: Indicate disabled state
      return;
   }

   try {
      const response = await axios.post('/api/v1/events/tickets/validate', {
         userAddress,
         eventId,
         user_id,
      });

      // console.log('Validate response:', response.data);
      if (response.data.hasTicket) {
         setHasTicket(true);
         setButtonType('secondary');

         // countdown check
         const isCountdownOver = calculateTimeLeft();
         setButtonText(isCountdownOver ? 'View Exhibit' : 'Read Insights');

         // Store validation result
         localStorage.setItem(`ticket_${eventId}_${userAddress}`, 'true');
      } else {
         setHasTicket(false);
         setButtonType('primary');
         setButtonText('Purchase Ticket');
      }
   } catch (error) {
      console.error('Error validating ticket:', error);
      // Handle error state
      setHasTicket(false);
      setButtonType('primary'); // Valid value
      setButtonText('Purchase Ticket');
   }
};

export const validatePageAccess = async (
   userAddress: string | undefined,
   router: AppRouterInstance,
   session: ReturnType<typeof useSession>
): Promise<{ isLoading: boolean; hasAccess: boolean }> => {
   let isLoading = true;

   if (!ENABLE_VALIDATION) {
      console.log('Page access validation is currently disabled');
      isLoading = false;
      return { isLoading: false, hasAccess: true }; // Grant access without validation
   }
   // Handle signed-out users
   if (session?.status === 'unauthenticated') {
      console.warn('User is not signed in. Redirecting to login.');
      router.push('/auth-sign-in');
      isLoading = false;
      return { isLoading: false, hasAccess: false };
   }

   // Get user_id from session
   const user_id = getUserIdFromSession(session);

   // Check for missing userId
   if (!user_id) {
      console.warn('User ID is missing. Redirecting.');
      router.push('/auth-sign-in');
      isLoading = false;
      return { isLoading: false, hasAccess: false };
   }

   console.log('Validating page access with:', {
      userAddress,
      eventId: '419a0b2d-dee9-4782-9cff-341c5f8343a6',
      user_id,
      sessionStatus: session.status,
      fullSession: session.data,
   });

   // Check for missing userAddress
   if (!userAddress) {
      router.push('/401');
      return { isLoading: false, hasAccess: false };
   }

   try {
      // Make API call to validate the ticket
      const response = await axios.post('/api/v1/events/tickets/validate', {
         userAddress,
         eventId: '419a0b2d-dee9-4782-9cff-341c5f8343a6',
         user_id,
      });

      console.log(response.data.message);

      // If the API returns status 200, user has access
      if (response.status === 200) {
         router.push('/exhibit');
         return { isLoading: false, hasAccess: true }; // End function here with successful state
      }

      // For any other status, redirect to 401
      router.push('/401');
      return { isLoading: false, hasAccess: false };
   } catch (error) {
      // Handle any errors and redirect to 401 page
      console.error('Error validating ticket:', error);
      router.push('/401');
      return { isLoading: false, hasAccess: false };
   }
};
