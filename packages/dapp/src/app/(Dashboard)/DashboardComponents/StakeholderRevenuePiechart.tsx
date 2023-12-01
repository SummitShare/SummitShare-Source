

"use client"
import React from 'react'
import { Chart } from "react-google-charts";


export const data = [
    ["stakeholders", "revenue"],
    ["Zamtel", 300],
    ["Airtel", 400],
    ["Brown Tech", 900],
    ["Zambia BOZ", 1000],
  ];



 const options = {
    title: "Stakeholder Revenue Share",
    colors: ["#fdba74", '#4ade80', '#2dd4bf', '#818cf8', '#f472b6'], // Custom colors for each segment
    legend: "labeled",
    animation: {
        duration: 1000, // Animation duration in milliseconds
        easing: 'out', // Animation easing function ('in', 'out', or 'inAndOut')
      },
   

  };
const StakeholderRevenuePiechart = () => {
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"320px"}
    />
  )
}

export default StakeholderRevenuePiechart