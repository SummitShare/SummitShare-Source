"use client";
import AdminRegisterCard from "@/app/components/common/adminRegisterCard/adminRegisterCard";
import PaginationControls from "@/app/components/common/functonal/pagination/pagination";
import EventHero from "@/app/components/common/hero/eventHero/eventHero";
import Hero from "@/app/components/common/hero/hero";
import ProductCard from "@/app/components/common/productCards/productCard";
import useExhibit from "@/lib/useGetExhibitById";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface EventData {
  name: string;
  date: string;
  country: string;
  price: string;
  eventType: string;
  image: string;
}

const dummyData: EventData[] = [
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

const images = [
  {
    Image:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    Image:
      "https://images.unsplash.com/photo-1558865869-c93f6f8482af?q=80&w=2631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    Image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    Image:
      "https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGFydHxlbnwwfHwwfHx8MA%3D%3D",
  },
];

const page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop() as string;
  const exhibit = useExhibit(id);
  const [currentPage, setCurrentPage] = useState(0);

  const [recordsPerPage, setRecordsPerPage] = useState(2);

  // Helper function to determine the number of records based on window width
  const calculateRecordsPerPage = () => {
    if (window.innerWidth > 768) {
      // Assuming 768px is the breakpoint for mobile devices
      return 6; // Number of items for PC
    } else {
      return 2; // Number of items for mobile
    }
  };
  useEffect(() => {
    // Function to update the state based on window width
    const handleResize = () => {
      setRecordsPerPage(calculateRecordsPerPage());
    };

    // Set initial state based on current window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(dummyData.length / recordsPerPage);
  const startIndex = currentPage * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  return (
    <div className="space-y-12">
      <EventHero />
      <section className="w-full space-y-6 ">
        <div className="space-y-2 w-full ">
          <h3 className="text-xl font-semibold text-gray-950">
            {exhibit?.exhibitDetails[0].name}
          </h3>
          <p className="text-sm text-gray-700">
            {" "}
            {exhibit?.exhibitDetails[0].details}
          </p>
        </div>
        <div className="w-full flex flex-row gap-2 overflow-x-scroll items-start py-2">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative  w-[45%] md:w-[30%] flex-shrink-0 h-[150px] md:h-[300px]"
              style={{ maxWidth: "45%" }}
            >
              <Image
                className="rounded-xl absolute inset-0 w-full h-full  object-cover"
                src={image.Image}
                alt={`Image ${index}`}
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
          ))}
        </div>
      </section>
      <AdminRegisterCard />
      <div className="space-y-6 w-full">
        <div className="space-y-2 w-full ">
          <h3 className="text-xl font-semibold text-gray-950">
            You might also like
          </h3>
        </div>
        <div className="  w-full flex justify-between items-center h-[260px] ">
          {dummyData.slice(startIndex, endIndex).map((event, index) => (
            <ProductCard
              key={index}
              author={"mario jere"}
              title={event.name}
              price={event.price}
              detailOne="Date"
              valueOne={event.date}
              detailTwo="Location"
              valueTwo={event.country}
              // image={event.image}
            />
          ))}
        </div>

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default page;
