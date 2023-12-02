"use client";
import React from "react";
import Chart from "react-google-charts";

const options = {
  title: "Ticket Sales Over Time",
  curveType: "function",
  legend: { position: "top" },
  pointSize: 6,
  chartArea: { right: 4, width: "90%", height: "70%" },
  series: {
    0: { areaOpacity: 0.5, color: "#4285F4" },
  },
  vAxis: {
    title: "Total tickets",
    textStyle: { color: "#3f3f46", italic: false, bold: true },
    gridlines: { color: "#d4d4d8", count: -1 },
  },
  hAxis: {
    title: "Time",
    textStyle: { color: "#3f3f46" },
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
const TicketSalesAreaChart: React.FC<Props> = ({ data }) => {
  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
      legendToggle
    />
  );
};

export default TicketSalesAreaChart;
