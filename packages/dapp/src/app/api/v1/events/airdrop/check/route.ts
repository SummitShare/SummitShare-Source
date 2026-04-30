import { NextResponse } from 'next/server';
import prisma from '../../../../../../../config/db';

// GET handler to fetch all airdrops with user details
export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const code = searchParams.get('code');
      const claimed = searchParams.get('claimed');
      let airdrops: any;

      // Check for authorization code
      if (code !== process.env.AD_CODE) {
         return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
      }

      if (claimed == 'true') {
         airdrops = await prisma.airdrops.findMany({
            where: {
               user_id: {
                  not: null,
               },
               claimed: true,
            },
            include: {
               // Include the related user data
               users: {
                  select: {
                     id: true,
                     email: true,
                     username: true,
                  },
               },
            },
         });

         return NextResponse.json(airdrops, { status: 200 });
      } else if (claimed == 'false') {
      }
      // Query all airdrops with associated user details
      airdrops = await prisma.airdrops.findMany({
         where: {
            user_id: {
               not: null,
            },
            claimed: false,
         },
         include: {
            // Include the related user data
            users: {
               select: {
                  id: true,
                  email: true,
                  username: true,
               },
            },
         },
      });

      if (!airdrops || airdrops.length === 0) {
         return NextResponse.json(
            { message: 'No airdrops found' },
            { status: 404 }
         );
      }

      return NextResponse.json(airdrops, { status: 200 });
   } catch (error) {
      console.error('Error fetching airdrops:', error);
      return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
      );
   }
}

export async function POST(req: Request) {
   try {
      const body = await req.json();
      const { email, code } = body;

      if (!code) {
         return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
      }

      if (code != process.env.AD_PASS) {
         return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
      }

      if (!email) {
         return NextResponse.json(
            { error: 'Email is required' },
            { status: 400 }
         );
      }

      // Check if user exists with this email
      const user = await prisma.users.findUnique({
         where: { email },
      });

      if (!user) {
         return NextResponse.json(
            { error: 'No account found with this email' },
            { status: 404 }
         );
      }

      // Check if user already has an unclaimed airdrop
      const existingAirdrop = await prisma.airdrops.findFirst({
         where: {
            user_id: user.id,
            claimed: false,
         },
      });

      if (existingAirdrop) {
         return NextResponse.json(
            { error: 'User already has an unclaimed airdrop' },
            { status: 409 }
         );
      }

      // Create new airdrop
      const newAirdrop = await prisma.airdrops.create({
         data: {
            user_id: user.id,
            claimed: false,
         },
         include: {
            users: {
               select: {
                  id: true,
                  email: true,
                  username: true,
               },
            },
         },
      });

      return NextResponse.json(
         {
            message: 'Airdrop created successfully',
            data: newAirdrop,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating airdrop:', error);
      return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
      );
   }
}

export async function PUT(req: Request) {
   try {
      const body = await req.json();
      const { email, claimed, code } = body;

      if (code != process.env.AD_PASS) {
         return NextResponse.json({ error: 'unauthorised' }, { status: 401 });
      }

      // Validate input
      if (!email) {
         return NextResponse.json(
            { error: 'Email is required' },
            { status: 400 }
         );
      }

      if (typeof claimed !== 'boolean') {
         return NextResponse.json(
            { error: 'Claimed status must be a boolean' },
            { status: 400 }
         );
      }

      // Find user by email
      const user = await prisma.users.findUnique({
         where: { email },
      });

      if (!user) {
         return NextResponse.json(
            { error: 'No account found with this email' },
            { status: 404 }
         );
      }

      // Find and update the airdrop
      const updatedAirdrop = await prisma.airdrops.updateMany({
         where: {
            user_id: user.id,
         },
         data: {
            claimed,
            claimed_at: claimed ? new Date() : null,
         },
      });

      // Fetch the updated record with user details
      const updatedRecord = await prisma.airdrops.findFirst({
         where: {
            user_id: user.id,
         },
         include: {
            users: {
               select: {
                  id: true,
                  email: true,
                  username: true,
                  type: true,
                  bio: true,
                  email_verified: true,
               },
            },
         },
      });

      if (!updatedRecord) {
         return NextResponse.json(
            { error: 'Airdrop not found after update' },
            { status: 404 }
         );
      }

      return NextResponse.json(
         {
            message: 'Airdrop status updated successfully',
            data: updatedRecord,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error updating airdrop:', error);
      return NextResponse.json(
         { error: 'Internal Server Error' },
         { status: 500 }
      );
   }
}
