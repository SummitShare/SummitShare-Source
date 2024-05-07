import React from "react";
import Hero from "../components/common/hero/hero";
import AdminRegisterCard from "../components/common/adminRegisterCard/adminRegisterCard";
import BlogCard from "../components/common/blogCard/blogCard";
const data = [
  {
    name: "Mountain View",
    date: "2024.05.15",
    country: "Swiss",
    price: "Free",
    eventType: "Nature Photography",
    image:
      "https://images.unsplash.com/photo-1574367157590-3454fe866961?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "City Lights",
    date: "2024.06.20",
    country: "america",
    price: "$200",
    eventType: "Urban Photography",
    image:
      "https://images.unsplash.com/photo-1637680298164-74342b63a61a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Seaside Sunrise",
    date: "2024.09.10",
    country: "Maldives",
    price: "$150",
    eventType: "Landscape Photography",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Forest Trail",
    date: "2024.08.05",
    country: "Amazon",
    price: "Free",
    eventType: "Wildlife Photography",
    image:
      "https://images.unsplash.com/photo-1621886292650-520f76c747d6?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Night Sky",
    date: "2024.01.15",
    country: "Sahara ",
    price: "$300",
    eventType: "Astrophotography",
    image:
      "https://images.unsplash.com/photo-1534235826754-0a3572d1d6d5?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Architecture",
    date: "2024.12.30",
    country: "Rome",
    price: "Free",
    eventType: "Cultural Photography",
    image:
      "https://images.unsplash.com/photo-1526285849717-482456cd7436?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];


function Page() {
  return (
    <div className="space-y-12">
      <Hero />
      <div className="  w-full flex justify-between items-center h-[260px] ">
      
           {data.map((event, index) => (
            <BlogCard
              key={index}
              author={"mario jere"}
              title={event.name}
              valueOne={event.date}
           
            />
          ))}
  
      </div>

     
   

      <AdminRegisterCard />
    </div>
  );
}

export default Page;
