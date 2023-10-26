"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

function SelectorCountry() {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Zambia</SelectItem>
          <SelectItem value="dark">SouthAfrica</SelectItem>
          <SelectItem value="system">Zimbabwe</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectorCountry;
