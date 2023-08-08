import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ApexStackedBarChart = ({ stackedSeries, stackedCategories }) => {
  const [series, setSeries] = useState(stackedSeries);
  const [categories, setCategories] = useState(stackedCategories);
  useEffect(() => {
    setSeries(stackedSeries);
    setCategories(stackedCategories);
  }, [stackedSeries, stackedCategories])
  const chartData = {
    series: series,
    type: 'bar',
    color: ["#1DD174", "#FFD950", "#F46044"],
    options: {
      chart: {
        type: 'bar',
        height: 300,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        color: ["#1DD174", "#FFD950", "#F46044"],
      },
      dataLabels: {
        enabled: false,
      },
      color: ["#1DD174", "#FFD950", "#F46044"],
      responsive: [{
        breakpoint: 580,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          },
          chart: {
            width: "100%"
          }
        }
      }],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
          backgroundBarColors: ["#1DD174", "#FFD950", "#F46044"],
          endingShape: 'rounded',
        },
      },
      xaxis: {
        show: true,
        categories: categories
      },
      yaxis: {
        show: true,
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 10,
        onItemClick: {
          toggleDataSeries: false
        }
      },
      fill: {
        opacity: 1
      },
      grid: {
        show: true
      }
    }
  };
  return (
    <Chart {...chartData} type="bar" height={300} />
  )
}

export default ApexStackedBarChart;