import { NextResponse } from 'next/server';
import prisma from '../../../../../config/db';

export async function POST(req: Request, res: NextResponse) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { message: 'no user id sent or email' },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'no user sent' }, { status: 400 });
    }

    if (user.type != 'exhibitor') {
      return NextResponse.json({ message: 'unauthorised' }, { status: 401 });
    }

    const eventIds = await prisma.stakeholders.findMany({
      where: {
        user_id,
      },
      select: {
        event_id: true,
      },
    });

    const events = eventIds.filter((event) => event.event_id);

    if (!eventIds) {
      return NextResponse.json({ message: 'no event ids' }, { status: 401 });
    }

    return NextResponse.json(
      { message: 'success', events: events },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
