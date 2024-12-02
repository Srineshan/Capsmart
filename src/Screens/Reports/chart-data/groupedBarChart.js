import React from 'react';
import Chart from 'react-apexcharts';

const ApexGroupedBarChart = ({ series, categories }) => {

  const chartData = {
    series: series,
    options: {
      chart: {
        type: 'bar',
        height: 300,
        toolbar: {
          show: false,
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
          endingShape: 'rounded'
        },
      },
      colors: ["#1DD174", "#FFD950", "#F46044", '#06617A', '#AE3CEA'],
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
          trim: true,
          rotate: 0,
          hideOverlappingLabels: false,
          style: {
            colors: [],
            fontSize: '12px',
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
  return (
    <Chart {...chartData} type="bar" height={300} />
  )
}

export default ApexGroupedBarChart;