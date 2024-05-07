import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/db';




export async function GET(req: Request, res: NextResponse) {
    try {
      const host = req.headers.get('host');
      const url = new URL(req.url!, `http://${host}`);
      const queryParams = new URLSearchParams(url.search);
      const event_id = queryParams.get('eventId');
  
      if (!event_id) {
        return NextResponse.json({ message: "Event ID is required", }, { status: 400 });
      }
  
      // Fetch collections linked to the event and include their artifacts
      const collections = await prisma.event_collections.findMany({
        where: {
          event_id: event_id,
        },
        include: {
          collections: {
            include: {
              artifacts: true // Ensures that artifacts linked to each collection are fetched
            }
          }
        }
      });
  
      if (!collections.length) {
        return NextResponse.json({ message: "No collections found for this event" }, { status: 404 });
      }
  
      // Formatting response to make it more readable and focused on required data
      const formattedResponse = collections.map(item => ({
        collectionId: item.collections.id,
        collectionName: item.collections.name,
        artifacts: item.collections.artifacts
      }));
  
      return NextResponse.json({ collections: formattedResponse }, { status: 200 });
  
    } catch (error) {
      console.error('An error occurred:', error);
      return NextResponse.json({ message: "Internal Server Error", error: error }, { status: 500 });
    }
  }