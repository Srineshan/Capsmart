import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ApexStackedBarChart = ({stackedSeries, stackedCategories}) => {
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
        color: ['#02BC77', '#D7DADB'],
        options: {
            chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            },
            color: ['#02BC77', '#D7DADB'],
          },
          dataLabels: {
            enabled: false,
          },
          color: ['#02BC77', '#D7DADB'],
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '25%',
              backgroundBarColors: ['#02BC77', '#D7DADB'],
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
    return(
        <Chart {...chartData}  type="bar" height={300} />
    )
}

export default ApexStackedBarChart;