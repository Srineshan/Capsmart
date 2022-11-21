import React from 'react';
import Chart from 'react-apexcharts';

const ApexPieChart = ({pieData}) => {

    const getPieChartLabels = () => {
      let pieChartLabels = [];
      pieData?.map(data=>{
        pieChartLabels.push(data?.key === "DONE" ? 'Done' : data?.key === "TODO" ? 'To Do' : data?.key === "NOTDONE" ? 'Not Done' : '')
      })
      return pieChartLabels;
    }

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
                onItemClick: {
                  toggleDataSeries: false
                },
                position: 'bottom',
            },
            labels: getPieChartLabels(),
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
        <Chart {...chartData} type="pie" height={300}  />
    )
}

export default ApexPieChart;