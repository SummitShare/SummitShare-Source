'use client';

import Buttons from '@/app/components/button/Butons';
import Inputs from '@/app/components/inputs/Inputs';
import { sendData } from '@/functonality/eventData';
import EventEscrowComponent from '@/functonality/eventEscrowComponent';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CONTRACT_ADDRESSES } from '@/utils/dev/contractInit';
import { EVENTS } from 'react-hook-form/dist/constants';

const event_id = CONTRACT_ADDRESSES.exhibitId;
const user_id = '227a4cbb-e8c0-40c3-91d1-db44116cf9eb';

const Page: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    if (user_id) {
      sendData(user_id, event_id).then((data) => setEventData(data));
    }
  }, [user_id]);

  const community = {
    name: '1. Gwembe Valley',
    linked_exhibit: 'The Leading Ladies Exhibit',
    description:
      "Our goal is to create a new value addition cycle through the exhibits on our platform. Through the Women's History Museum of Zambia, we connected with A heritage community, the Gwembe Valley community in the Southern Province of Zambia. Proceeds from the exhibits and your donations will fund community-voted SDG development projects within these communities, starting with Gwembe Valley. If you would like to make a donation, please visit our Support Us page.",
  };

  const tableData = [
    {
      id_no: 1,
      date: 'TBA',
      goal: 'Exhibit Held',
      status: 'yellow',
      transaction_id: 'Transaction ID 1',
    },
    {
      id_no: 2,
      date: 'TBA',
      goal: 'Funds distributed into community Escrow',
      status: 'yellow',
      transaction_id: 'Transaction ID 2',
    },
    {
      id_no: 3,
      date: 'TBA',
      goal: 'Voting on SDG development',
      status: 'yellow',
      transaction_id: 'Transaction ID 3',
    },
    {
      id_no: 4,
      date: 'TBA',
      goal: 'Funding/disbursement of escrow',
      status: 'yellow',
      transaction_id: 'Transaction ID 4',
    },
    {
      id_no: 5,
      date: 'TBA',
      goal: 'Completion of funded goal being implemented',
      status: 'yellow',
      transaction_id: 'Transaction ID 5',
    },
  ];

  return (
    <div className="flex flex-col  mx-6 mt-6 mb-[48px] lg:mx-[15%] space-y-10">
      <header className="space-y-2">
        <h2>{community.name}</h2>
        <p>{community.linked_exhibit}</p>
        <p>{community.description}</p>
      </header>
      <section className="w-full space-y-6">
        <Table className="border ">
          <TableHeader>
            <TableRow>
              <TableHead>ID No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id_no} className="hover:bg-stone-50">
                <TableCell className="font-medium">{row.id_no}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.goal}</TableCell>
                <TableCell>
                  <span
                    className={`status-indicator status-${row.status} ${
                      row.status === 'green' && 'text-green-500'
                    }  ${row.status === 'yellow' && 'text-yellow-500'}  ${
                      row.status === 'blank' && 'text-stone-500'
                    } `}
                  >
                    {row.status === 'green' && 'Done'}
                    {row.status === 'yellow' && 'In Progress'}
                    {row.status === 'blank' && 'Not Done'}
                  </span>
                </TableCell>
                <TableCell>{row.transaction_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="w-fit">
          <EventEscrowComponent userAdress="" />
        </div>
      </section>
    </div>
  );
};

export default Page;
