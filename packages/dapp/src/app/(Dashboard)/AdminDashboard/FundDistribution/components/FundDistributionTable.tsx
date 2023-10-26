import React from "react";
import Table from "../../../../../reusebaeComponents/Table";

const tableData = {
  name: "Fund Distribution",
  rowNames: [
    "Date",
    "Event Name",
    "Participant",
    "Wallet",
    "Distribution-Id",
    "Split",
    "Credited",
    "Time",
  ],
  dataRows: [
    [
      "11/11/2023",
      "superSoft",
      "Nosizwe Otobong",
      "***** 2468",
      "***** 2468",
      "20%",
      "1.5Eth",
      "13:40PM",
    ],
  ],
};

function FundDistributionTable() {
  return (
    <Table
      name={tableData.name}
      rowNames={tableData.rowNames}
      dataRows={tableData.dataRows}
      gridColumnString="grid-cols-8"
    />
  );
}

export default FundDistributionTable;
