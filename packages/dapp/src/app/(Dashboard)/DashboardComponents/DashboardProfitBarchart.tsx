"use client";

import React from "react";
import { Chart } from "react-google-charts";

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

interface Props {
  data?: any; // to be changed to the required type
}
const DashboardProfitBarchart: React.FC<Props> = ({ data }) => {
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
