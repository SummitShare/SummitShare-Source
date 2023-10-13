"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

function TourismEvents() {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Activates" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Game Parks</SelectItem>
          <SelectItem value="dark">Natural Wonder</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TourismEvents;
