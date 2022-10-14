import React from 'react';
import Chart from 'react-apexcharts';

const ApexPieChart = ({pieData}) => {
    const chartData = {
        options: {
            theme: {
              monochrome: {
                enabled: false
              }
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                marker: {
                    show: true
                }
            },
            stroke: {
                curve: 'smooth',
                width: 0
            },
            colors: ["#1DD174", "#FFD950", "#F46044"],
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: true,
            },
            labels: pieData?.map(data=>data?.key),
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: "100%"
                  }
                }
              }
            ],
            chart: {
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  console.log(config.w.config.labels[config.dataPointIndex]);
                }
              }
            }
        },
        series: pieData?.map(data=>data?.value)
    }
    return(
        <Chart {...chartData} type="pie" height={250}  />
    )
}

export default ApexPieChart;