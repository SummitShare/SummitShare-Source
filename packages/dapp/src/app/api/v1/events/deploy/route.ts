/*
Category: API Layer
Purpose: Facilitates the deployment of event data to the blockchain, preparing events for live interaction. It transforms event data into parameters suitable for smart contract integration, marking the transition from proposal to active event status.
*/

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import prisma from '../../../../../../config/db';
import {
   EmailStatus,
   IPropsal,
   IStakes,
   ExhibitParams,
} from '@/utils/dev/typeInit';

/**
 * POST handler for deploying event data.
 *
 * This endpoint retrieves event data from the database based on a provided event ID, formats this data into
 * parameters suitable for a smart contract, and returns these parameters for further blockchain-based processing.
 * This step is crucial for transitioning an event from its planning stage to being live and interactable within the dApp.
 *
 * @param req - The incoming HTTP POST request containing the event ID.
 * @returns A JSON response containing formatted event parameters for blockchain deployment or an error message.
 */

export async function POST(req: Request) {
   try {
      //console.log("Received request in deploy route");
      const requestBody = await req.json();
      //console.log("Request Body:", requestBody);
      const { event_id }: { event_id: string } = requestBody;

      // Retrieve the event data along with its stakeholders
      const eventData = await prisma.events.findUnique({
         where: { id: event_id },
         include: { stakeholders: true },
      });

      if (!eventData) {
         throw new Error('Event not found');
      }

      // Formatting the event data into parameters(exhibitParams) suitable for smart contract interaction
      const exhibitParams: ExhibitParams = {
         // Hardcoded for Dev
         name: eventData.event_name || 'Default Name',
         symbol: eventData.symbol || 'Default Symbol',
         ticketPrice: eventData.cost?.toString() || '0',
         beneficiaries: eventData.stakeholders.map(
            (stakeholder: { wallet_address: any }) =>
               stakeholder.wallet_address || 'Default Wallet ID'
         ),
         shares: eventData.stakeholders.map(
            (stakeholder: { stake: any }) => stakeholder.stake || 0
         ),
         baseURI: 'http://localhost:3000/api/ticket/',
         location: eventData.event_location || 'Default Location',
         artifactNFT: '0x5851195868fdc91585cc2308595c2b8c992c06f2',
         details: eventData.description || 'Default Details',
         id: eventData.id,
      };

      //console.log("Returning exhibitParams:", exhibitParams);
      return NextResponse.json(exhibitParams, { status: 200 });
   } catch (error) {
      console.error('Error in deploy POST endpoint:', error);
      return NextResponse.json(
         { error: 'An error occurred while processing your request.' },
         { status: 500 }
      );
   }
}
