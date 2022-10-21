import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ApexGroupedBarChart = ({series, categories}) => {

    const chartData = {      
      series: series,
      options: {
        chart: {
          type: 'bar',
          height: 300
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '25%',
            endingShape: 'rounded'
          },
        },
        colors: ["#1DD174", "#FFD950", "#F46044"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: categories,
          labels: {
            show: true,
            rotate: 0,
            style: {
                colors: [],
                fontSize: '10px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        },
        legend: {
          show: true,
          onItemClick: {
            toggleDataSeries: false
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          show: false,
        }
      },
    
    
    };
    return(
        <Chart {...chartData}  type="bar" height={300} />
    )
}

export default ApexGroupedBarChart;