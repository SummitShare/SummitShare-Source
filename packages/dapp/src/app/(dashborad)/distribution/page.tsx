'use client'

import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
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
    <div className='min-h-screen flex flex-col justify-between mx-6 mt-6 mb-[48px]'>
      <nav className="w-full flex flex-row justify-between items-center">
        <p className="text-p2-m">
          Distrbution
        </p>
        <p>Exit</p>
      </nav>
      <header className="text-center space-y-2">
        <h2>Leading ladies</h2>
        <p>Learn about the history you love!</p>
      </header>

      <div className='flex flex-row justify-between w-full'><p className='text-2xl font-medium '>Beneficiaries</p>
        <div className=' flex items-center justify-center w-[30px] h-[30px] p-2 bg-ge-100 text-p2-m text-ge-500 rounded-full'>3</div></div>
      <Inputs type="select" label="Beneficiarie" state="active" options={['Eth', 'Bitcoin', 'Base']} />
      <div className='space-y-4 pb-[48px] border-b border-primary-50' >
       
          <Inputs type="input" label="username" state="inactive" defaultValue="Latoya Nienow" />
          <Inputs type="input" label="Wallet address" state="inactive" defaultValue="0x94b008aA00579c1307B0E"/>
          <Inputs type="input" label="Share" state="inactive" defaultValue="20%" />
      
      </div>

<div className="sapce-y-4 text-p2-r">
  <div className='flex felx-row justify-between '><p>Tickets sold</p>   <p className="text-p2-m font-semibold">
          100<span className='font-normal'> of 300</span>
        </p></div>
  <div className='flex felx-row justify-between '><p>Distribution Amount</p> <p className="text-p2-m font-semibold text-ge-500">
          ETh 20
        </p></div>
</div>
<Buttons type="primary" size="large">Distrbute</Buttons>
    </div>


  );
};

export default Page;