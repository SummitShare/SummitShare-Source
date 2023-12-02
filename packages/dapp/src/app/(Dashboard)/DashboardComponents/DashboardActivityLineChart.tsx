"use client";

import React from "react";
import Chart from "react-google-charts";

export const options = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" },
  chartArea: { right: 4, width: "90%", height: "70%" },
  colors: ["#3f3f46", "#fdba74"],

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
    duration: 1000,
    easing: "inAndOut",
  },
};

interface Props {
  data?: any; // to be changed to the required type
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
