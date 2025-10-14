import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ApexStackedBarChart = ({ stackedSeries, stackedCategories, horizontal }) => {
  const [series, setSeries] = useState(stackedSeries);
  const [categories, setCategories] = useState(stackedCategories);
  useEffect(() => {
    setSeries(stackedSeries);
    setCategories(stackedCategories);
  }, [stackedSeries, stackedCategories])
  console.log(series, categories)
  const chartData = {
    series: series,
    type: 'bar',
    color: ["#73D035", "#FFC100", "#FF851C", '#FF6562', '#3F8ADF'],
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
        color: ["#73D035", "#FFC100", "#FF851C", '#FF6562', '#3F8ADF'],
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#73D035", "#FFC100", "#FF851C", '#FF6562', '#3F8ADF'],
      responsive: [{
        breakpoint: 480,
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
          horizontal: horizontal ? true : false,
          columnWidth: '25%',
          backgroundBarColors: ["#73D035", "#FFC100", "#FF851C", '#FF6562', '#3F8ADF'],
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
        offsetY: 0,
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