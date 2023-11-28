"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type FundDistribution = {
  eventname: string;
  event_address: string;
  distribution_id: string;
  distribution_caller: string;
  amount: number;
  date: string;
};

export const columns: ColumnDef<FundDistribution>[] = [
  {
    accessorKey: "EventName",
    header: ({ column }) => {
      return (
        <Button
          className="text-left px-0 gap-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Eventname
          <ArrowUpDown className=" h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "eventAddress",
    header: "EventAddress",
  },
  {
    accessorKey: "distributionId",
    header: "DistributionId",
  },
  {
    accessorKey: "distributioncaller",
    header: "Distributioncaller",
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];
