'use client';
import React from 'react';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Users,
   Ticket,
   TrendingUp,
   HelpCircle,
   ExternalLink,
} from 'lucide-react';

type StatItem = {
   value: string | number;
   label: string;
   subtext: string;
   icon: React.ReactNode;
};

// Previously pulled from the SummitShare subgraph. Exhibit ticketing is not a
// priority by default now, so keep the report stable with the last recorded count.
const RECORDED_TICKET_COUNT = 71;

const InfoTooltip = ({
   children,
   iconClassName = 'w-4 h-4 text-stone-400',
   label = 'More information',
}: {
   children: React.ReactNode;
   iconClassName?: string;
   label?: string;
}) => (
   <span className="group/tooltip relative inline-flex items-center align-middle">
      <button
         type="button"
         aria-label={label}
         className="inline-flex cursor-help items-center text-stone-400 transition-colors hover:text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
         <HelpCircle className={iconClassName} />
      </button>
      <span
         role="tooltip"
         className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg bg-black px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-md transition-opacity group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
      >
         {children}
         <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black" />
      </span>
   </span>
);

const InsightsPage = () => {
   const ticketCount = RECORDED_TICKET_COUNT;

   const BASE_FUNDS = 10240;
   const TICKET_PRICE = 5;
   const totalFunds = BASE_FUNDS + ticketCount * TICKET_PRICE;

   const stats: StatItem[] = [
      {
         value: totalFunds.toLocaleString(),
         label: 'PROJECT FUNDS RAISED (USD)',
         subtext:
            'Total from grants towards exhibit facilitation, donations, and ticket sales',
         icon: <TrendingUp className="w-6 h-6" />,
      },
      {
         value: ticketCount,
         label: 'TICKETS SOLD',
         subtext: 'Combined digital & physical exhibit attendance',
         icon: <Ticket className="w-6 h-6" />,
      },
      {
         value: '300',
         label: 'COMMUNITY REACH',
         subtext: 'Direct beneficiaries in Gwembe Valley',
         icon: <Users className="w-6 h-6" />,
      },
   ];

   const tableData = [
      {
         id_no: 1,
         date: '10-11-2024',
         goal: 'Exhibit Deployment',
         tooltip:
            'Digital launch of the exhibit on SummitShare platform, including tokenized artifacts and interactive gallery access',
         status: 'green',
         transaction_id:
            '0x92070685274364f98963c09dd193e8ad01ba1973e4914edbd1a15a4b78c06443',
      },
      {
         id_no: 2,
         date: '13-12-2024',
         goal: 'Physical Exhibit/Launch',
         tooltip:
            'Live exhibition event in Lusaka, Zambia featuring physical artifacts and community engagement',
         status: 'green',
         transaction_id: 'https://summitshare.co/blog/rkAQd7hB1l',
      },
      {
         id_no: 3,
         date: '01-04-2025',
         goal: 'Funds distributed into community Escrow',
         tooltip:
            'Transfer of collected funds to a secure escrow contract for community benefit (80%) and administrative costs (20%)',
         status: 'green',
         transaction_id:
            '0x277a0d27f696ab6c87de39a88cd7c9546834963a1ba548b9c54125880037f4e3',
      },
      {
         id_no: 4,
         date: '12-04-2025',
         goal: 'Voting on Community Funding Proposal',
         tooltip:
            'Community members participate in selecting development projects aligned with SDG goals',
         status: 'yellow',
         transaction_id: 'Transaction ID 4',
      },
      {
         id_no: 5,
         date: 'TBA',
         goal: 'Funding/Disbursement of Funds in Escrow',
         tooltip: 'Release of funds from escrow for approved community projects',
         status: 'orange',
         transaction_id: 'Transaction ID 5',
      },
      {
         id_no: 6,
         date: 'TBA',
         goal: 'Implementation of Community Funding Proposal',
         tooltip:
            'The IRL stage which involves the actual implementation of community voted proposal + Data collection',
         status: 'orange',
         transaction_id: 'Transaction ID 5',
      },
   ];

   const SmartLink = ({ transactionId }: { transactionId: string }) => {
      const isBlog = transactionId.includes('summitshare.co/blog');

      const linkProps = isBlog
         ? {
              href: transactionId,
              className:
                 'inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200',
           }
         : {
              href: `https://optimistic.etherscan.io/tx/${transactionId}`,
              className:
                 'inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200',
           };

      return (
         <a {...linkProps} target="_blank" rel="noopener noreferrer">
            <span>{isBlog ? 'Read' : 'View'}</span>
            <ExternalLink className="w-3 h-3" />
         </a>
      );
   };

   return (
      <div className="flex flex-col space-y-8 mx-6 mb-12 lg:mx-[15%] pb-16 pt-28 md:pt-32">
         {/* Header Section */}
         <div className="space-y-4">
            <div className="flex items-center space-x-2">
               <h1 className="text-3xl font-bold text-stone-800">
                  1. Gwembe Valley
               </h1>
            </div>

            <div className="flex items-center space-x-2 text-stone-600">
               <h2 className="text-xl">The Leading Ladies Exhibit</h2>

               <InfoTooltip>
                  An interactive exhibition showcasing tokenized African artifacts
               </InfoTooltip>
            </div>
            <p className="text-stone-600 leading-relaxed">
               Our goal is to create a new value addition cycle through the
               exhibits on our platform. Through the Women&apos;s History Museum
               of Zambia, we connected with the Gwembe Valley community in the
               Southern Province of Zambia. Proceeds support community-voted SDG
               development projects.
            </p>
         </div>

         {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
               <Card
                  key={index}
                  className="relative overflow-hidden hover:bg-stone-50 transition-colors"
               >
                  <CardContent className="pt-6">
                     <div className="absolute top-3 right-3 text-stone-400">
                        {stat.icon}
                     </div>
                     <div className="space-y-2">
                        <p className="text-4xl font-bold text-stone-800">
                           {stat.value}
                        </p>
                        <p className="text-sm font-medium text-stone-600">
                           {stat.label}
                        </p>
                        <p className="text-xs text-stone-500">{stat.subtext}</p>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Progress Table */}
         <Card>
            <CardHeader>
               <CardTitle className="text-xl text-stone-800">
                  Project Milestones
               </CardTitle>
            </CardHeader>
            <CardContent>
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead>Phase</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {tableData.map((row) => (
                        <TableRow key={row.id_no} className="group">
                           <TableCell className="font-medium">
                              {row.id_no}
                           </TableCell>
                           <TableCell>{row.date}</TableCell>
                           <TableCell className="flex items-center space-x-1">
                              <span>{row.goal}</span>

                              <InfoTooltip>{row.tooltip}</InfoTooltip>
                           </TableCell>
                           <TableCell>
                              <span
                                 className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    row.status === 'green'
                                       ? 'bg-green-100 text-green-800'
                                       : row.status === 'yellow'
                                       ? 'bg-yellow-100 text-yellow-800'
                                       : row.status === 'orange'
                                       ? 'bg-orange-100 text-orange-800'
                                       : 'bg-stone-100 text-stone-800'
                                 }`}
                              >
                                 {row.status === 'green'
                                    ? 'Completed'
                                    : row.status === 'yellow'
                                    ? 'In Progress'
                                    : row.status === 'orange'
                                    ? 'Pending'
                                    : 'Unknown'}
                              </span>
                           </TableCell>
                           <TableCell>
                              <SmartLink transactionId={row.transaction_id} />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>
         {/* Fund Distribution Section */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
               <CardHeader>
                  <CardTitle className="text-xl text-stone-800">
                     Fund Distribution Scheme
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="relative h-4 bg-stone-100 rounded-full overflow-hidden">
                        <div className="absolute left-0 top-0 h-full w-4/5 bg-stone-800" />
                     </div>
                     <div className="grid grid-cols-2 text-sm">
                        <div>
                           <p className="font-medium text-stone-800">80%</p>
                           <p className="text-stone-600">Community Fund</p>
                        </div>
                        <div className="text-right">
                           <p className="font-medium text-stone-800">20%</p>
                           <p className="text-stone-600">Administrative</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle className="text-xl text-stone-800">
                     Next Steps
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-3">
                     <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                           <span className="text-sm font-medium text-stone-800">
                              1
                           </span>
                        </div>
                        <span className="text-stone-600">
                           Community voting on development objectives
                        </span>
                     </li>
                     <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                           <span className="text-sm font-medium text-stone-800">
                              2
                           </span>
                        </div>
                        <span className="text-stone-600">
                           Project implementation planning
                        </span>
                     </li>
                     <li className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                           <span className="text-sm font-medium text-stone-800">
                              3
                           </span>
                        </div>
                        <span className="text-stone-600">
                           Fund disbursement and project execution
                        </span>
                     </li>
                  </ul>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default InsightsPage;
