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
      <nav className="w-full flex flex-row justify-between items-center">
        <p className="text-p2-m">
        Distrbution
        </p>
        <p>Exit</p>
      </nav>
      <header className="text-center space-y-2">
        <h2>Create account</h2>
        <p>Learn about the history you love!</p>
      </header>
    </div>
  );
};

export default Page;