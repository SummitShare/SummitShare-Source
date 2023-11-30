"use client";

import React from "react";
import { Chart } from "react-google-charts";
const data = [
  ["Product", "Views", { role: "style" }],
  ["Etherem", 3000, "#ef4444"],
  ["Dai", 2500, "#22c55e"],
  ["Shiba Inu", 2000, "#030712"],
  ["Arbitrum", 2800, "#0ea5e9"],
];

const options = {
  title: "Product Sales Comparison",
  chartArea: { right: 0, width: "90%", height: "65%" },

  legend: { position: "bottom" },
  hAxis: {
    textStyle: { color: "#3f3f46" },

    gridlines: { color: "red", count: -1, minValue: 0 },
  },

  animation: {
    startup: true,
    duration: 500,
    trigger: "both",
  },
};
const DashboardProfitBarchart = () => {
  return (
    <Chart
      chartType="ColumnChart"
      width="100%"
      height="240px"
      data={data}
      options={options}
    />
  );
};

export default DashboardProfitBarchart;
