'use client'

import { sendData } from '@/functonality/eventData';
import EventEscrowComponent from '@/functonality/eventEscrowComponent';
import React, { useEffect, useState } from 'react';

const event_id = 'a65306ad-571f-484e-9985-929a4a0310ba';
const user_id = "227a4cbb-e8c0-40c3-91d1-db44116cf9eb";

const Page: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    if (user_id) {
      sendData(user_id, event_id).then(data => setEventData(data));
    }
  }, [user_id]);

  return (
    <div>
      {eventData ? (
        <div>
          <p>Total: {eventData.total}</p>
          <p>Tickets Sold: {eventData.ticketsSold}</p>
          <h3>Stakeholder Data:</h3>
          <ul>
            {eventData.stekholderData.map((stakeholder: any) => (
              <li key={stakeholder.user_id}>
                <p>User ID: {stakeholder.user_id}</p>
                <p>Username: {stakeholder.username || 'N/A'}</p>
                <p>Share Percentage: {stakeholder.sharePercentage}%</p>
                <p>Distributed Amount: {stakeholder.distributedAmount}</p>
              </li>
            ))}

<EventEscrowComponent userAddress="" provider="" exhibitId="0xe405b9c97656336ab949401bcd41ca3f50114725"/>

          </ul>
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;