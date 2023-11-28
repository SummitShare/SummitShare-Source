import Table from "@/components/reusebaeComponents/Table";
import React from "react";

const tableData = {
  name: "Event List",
  rowNames: [
    "Event name",
    "Event Date",
    "Event Time",
    "Event Location",
    "Ticket Cost",
    "Available tickets",
  ],
  dataRows: [
    ["Museum", "1/11/2023", "13:30PM", "lusaka,zambia", "000.23Eth", "100/150"],
  ],
};

function TableList() {
  return (
    <Table
      gridColumnString="grid-cols-6"
      name={tableData.name}
      rowNames={tableData.rowNames}
      dataRows={tableData.dataRows}
    />
  );
}

export default TableList;
