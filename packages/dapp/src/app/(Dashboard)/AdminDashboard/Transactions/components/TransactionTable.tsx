import Table from "@/components/reusebaeComponents/Table";
import React from "react";

function ParentComponent() {
  // Define your data
  const tableData = {
    name: "Transactions",
    rowNames: ["Ticket ID", "Transaction ID", "Amount", "Date", "Type"],
    dataRows: [
      ["***** 2468", "***** 2468", "Jan 12, 2023", "000.25ETH", "Deposit"],

      // Add more rows as needed
    ],
  };

  return (
    <div>
      <Table
        name={tableData.name}
        rowNames={tableData.rowNames}
        dataRows={tableData.dataRows}
        gridColumnString="grid-cols-5"
      />
    </div>
  );
}

export default ParentComponent;
