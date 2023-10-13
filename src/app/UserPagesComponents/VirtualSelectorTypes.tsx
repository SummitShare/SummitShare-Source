"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

function VirtualSelector() {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Museums</SelectItem>
          <SelectItem value="dark">Art Galleries</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default VirtualSelector;
