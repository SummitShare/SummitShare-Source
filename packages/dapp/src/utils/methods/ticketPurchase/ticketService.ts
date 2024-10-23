// ticketService.ts

import { CONTRACT_ADDRESSES } from '@/utils/dev/contractInit';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/router';
import React from 'react';

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
  // Early return if no userAddress
  if (!userAddress) {
    setHasTicket(false);
    setButtonType('primary');
    return;
  }

  try {
    const response = await axios.post('/api/v1/events/tickets/validate', {
      userAddress,
      eventId,
      user_id,
    });
    if (response.data.hasTicket) {
      setHasTicket(true);
      setButtonType('secondary'); // Valid value
      setButtonText('View Exhibit');
    } else {
      // Handle case where user doesn't have a ticket
      setHasTicket(false);
      setButtonType('primary'); // Valid value
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
  router: ReturnType<typeof useRouter>,
  session: ReturnType<typeof useSession>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> => {
  setIsLoading(true);
  
  if (!userAddress) {
    router.push('/401');
    setIsLoading(false);
    return false;
  }

  try {
    const response = await axios.post('/api/v1/events/tickets/validate', {
      userAddress,
      eventId: CONTRACT_ADDRESSES.eventId,
      user_id: session.data?.token.id || '',
    });
    
    setIsLoading(false);
    
    if (!response.data.hasTicket) {
      router.push('/401');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating ticket:', error);
    setIsLoading(false);
    router.push('/401');
    return false;
  }
};