"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";
import TicketCard from "./TicketCard";

function TabsMenu() {
  return (
    <div className="">
      <Tabs defaultValue="1W" className="">
        <TabsList className="w-full lg:w-fit  ">
          <TabsTrigger value="1D" className="w-full">
            1D
          </TabsTrigger>
          <TabsTrigger value="1W" className="w-full">
            1W
          </TabsTrigger>
          <TabsTrigger value="1M" className="w-full">
            1M
          </TabsTrigger>
          <TabsTrigger value="1Y" className="w-full">
            1Y
          </TabsTrigger>
        </TabsList>
        <TabsContent value="1D">
          <TicketCard />
        </TabsContent>
        <TabsContent value="1W">
          <TicketCard />
        </TabsContent>
        <TabsContent value="1M">
          <TicketCard />
        </TabsContent>
        <TabsContent value="1Y">
          <TicketCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TabsMenu;
