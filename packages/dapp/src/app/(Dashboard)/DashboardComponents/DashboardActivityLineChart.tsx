"use client";

import React from "react";
import Chart from "react-google-charts";

export const options = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" },
  chartArea: { right: 4, width: "90%", height: "70%" },
  colors: ["black", "#f97316"],
  tooltip: {
    backgroundColor: "black",
  },

  vAxis: {
    textStyle: { color: "#3f3f46" },
    gridlines: { color: "#d4d4d8", count: -1 },
  },

  hAxis: {
    textStyle: { color: "#3f3f46" },
    minorGridlines: { color: "" },

    gridlines: { color: "red", count: -1 },
  },
  lineWidth: 3,
  animation: {
    startup: true,
    duration: 500, // Animation duration in milliseconds
    easing: "cubic-bezier(0.645, 0.045, 0.355, 1)", // Cubic bezier for ease-in
    trigger: "both",
  },
};

interface Props {
  data?: any;
}
const DashboardActivityLineChart: React.FC<Props> = ({ data }) => {
  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="350px"
      data={data}
      options={options}
      legendToggle
    />
  );
};

export default DashboardActivityLineChart;
