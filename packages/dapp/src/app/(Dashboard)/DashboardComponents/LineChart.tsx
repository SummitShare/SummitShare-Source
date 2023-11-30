"use client";

import React from "react";
import Chart from "react-google-charts";
export const data = [
  ["Day", "Sold Tickets", "Earnings"],
  ["Monday", 1000, 500],
  ["Tuesday", 1170, 600],
  ["Wedesday", 660, 700],
  ["Thursday", 1030, 900],
  ["Friday", 1030, 900],
];

export const options = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" },

  chartArea: { right: 4, width: "90%", height: "60%" },
  colors: ["black", "#f97316"],
  tooltip: {
    backgroundColor: "black",
  },

  vAxis: {
    title: "Total",
  },

  lineWidth: 3,
  animation: {
    startup: true,
    duration: 500, // Animation duration in milliseconds
    easing: "cubic-bezier(0.645, 0.045, 0.355, 1)", // Cubic bezier for ease-in
    trigger: "both",
  },
};

const LineChart = () => {
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

export default LineChart;
