"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

function SelectorEvents() {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Museum</SelectItem>
          <SelectItem value="dark">ArtGallery</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectorEvents;
