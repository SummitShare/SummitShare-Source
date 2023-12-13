import EventCard from "@/app/(UserPages)/UserPagecomponents/EventCard";
import { EventData } from "../../../../../../../types";

const dummyData: EventData[] = [
  {
    name: "Mountain View",
    date: "2023-05-15",
    country: "Swiss Alps",
    price: "Free",
    eventType: "Nature Photography",
    image:
      "https://images.unsplash.com/photo-1574367157590-3454fe866961?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "City Lights",
    date: "2023-03-20",
    country: "New York City",
    price: "$200",
    eventType: "Urban Photography",
    image:
      "https://images.unsplash.com/photo-1637680298164-74342b63a61a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Seaside Sunrise",
    date: "2023-09-10",
    country: "Maldives",
    price: "$150",
    eventType: "Landscape Photography",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Night Sky",
    date: "2023-01-15",
    country: "Sahara Desert",
    price: "$300",
    eventType: "Astrophotography",
    image:
      "https://images.unsplash.com/photo-1534235826754-0a3572d1d6d5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Old Architecture",
    date: "2023-12-30",
    country: "Rome, Italy",
    price: "Free",
    eventType: "Cultural Photography",
    image:
      "https://images.unsplash.com/photo-1526285849717-482456cd7436?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];


function OtherEvents() {
  return (
    <div className="space-y-5">
      <div className="space-y-5 w-full  ">
        <div className="w-full flex-row  ">
          <p className="font-poppins text-2xl text-blue-950 font-bold">You  Might Also Like </p>
        </div>
        <div className=" flex flex-row  gap-3 w-full  mt-6">
        {dummyData.map((event, index) => (
          <EventCard event={event} key ={index}/>
        ))}
      </div>
      </div>
    </div>
  );
}

export default OtherEvents;
