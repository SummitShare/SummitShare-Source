import {
  columns,
  FundDistribution,
} from "@/app/(Dashboard)/AdminDashboard/FundDistribution/components/columns";
import { DataTable } from "@/app/(Dashboard)/AdminDashboard/FundDistribution/components/data-table.tsx";

async function getData(): Promise<FundDistribution[]> {
  const res = await fetch(
    "https://654a2cb1e182221f8d52a88e.mockapi.io/summitshare/eventdat"
  );
  const got = await res.json();
  console.log(got);

  return [];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
