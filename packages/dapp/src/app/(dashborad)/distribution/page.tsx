'use client'

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
} from "@/components/ui/table"

const event_id = 'a65306ad-571f-484e-9985-929a4a0310ba';
const user_id = "227a4cbb-e8c0-40c3-91d1-db44116cf9eb";

const Page: React.FC = () => {
  const [eventData, setEventData] = useState<any>(null);

  useEffect(() => {
    if (user_id) {
      sendData(user_id, event_id).then(data => setEventData(data));
    }
  }, [user_id]);

  const community = {
    name: "Community Name",
    linked_exhibit: "Leading ladies exhibit",
    description: "Description of the relationship between SummitShare and the goal in the community"
  };

  const tableData = [
    {
      id_no: 1,
      date: "YYYY-MM-DD",
      goal: "Exhibit Held",
      status: "yellow",
      transaction_id: "Transaction ID 1"
    },
    {
      id_no: 2,
      date: "YYYY-MM-DD",
      goal: "Funds distributed into community Escrow",
      status: "yellow",
      transaction_id: "Transaction ID 2"
    },
    {
      id_no: 3,
      date: "YYYY-MM-DD",
      goal: "Voting on SDG development",
      status: "yellow",
      transaction_id: "Transaction ID 3"
    },
    {
      id_no: 4,
      date: "YYYY-MM-DD",
      goal: "Funding/disbursement of escrow",
      status: "yellow",
      transaction_id: "Transaction ID 4"
    },
    {
      id_no: 5,
      date: "YYYY-MM-DD",
      goal: "Completion of funded goal being implemented",
      status: "yellow",
      transaction_id: "Transaction ID 5"
    }
  ];

  return (
    <div className='flex flex-col  mx-6 mt-6 mb-[48px] lg:mx-[15%] space-y-10'>
      
      <header className="space-y-2">

        <h2>{community.name}</h2>
        <p>{community.linked_exhibit}</p>
        <p>{community.description}</p>
       

      </header>
        <section className='w-full space-y-6'>
          <Table className='border '>
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
                <TableRow key={row.id_no} className='hover:bg-stone-50'>
                  <TableCell className="font-medium">{row.id_no}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.goal}</TableCell>
                  <TableCell>
                    <span className={`status-indicator status-${row.status} ${row.status === 'green' && 'text-green-500'}  ${row.status === 'yellow' && 'text-yellow-500'}  ${row.status === 'blank' && 'text-stone-500'} `}>
                      {row.status === "green" && "Done"}
                      {row.status === "yellow" && "In Progress"}
                      {row.status === "blank" && "Not Done"}
                    </span>
                  </TableCell>
                  <TableCell>{row.transaction_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='w-fit'>
        <Buttons type='primary' size='small'>Distribute</Buttons>
        </div>
        </section>

       
      </div>
  );
};

export default Page;
