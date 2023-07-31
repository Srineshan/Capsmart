import React from 'react';
import Chart from 'react-apexcharts';

const ApexPieChart = ({ pieData }) => {

  const getLabel = (data) => {
    if (data === "DONE")
      return 'Done';
    else if (data === "TODO")
      return 'To Do';
    else if (data === "NOTDONE")
      return 'Not Done';
    if (data === "paidOnTime")
      return 'Paid On Time';
    else if (data === "paidDelayed")
      return 'Payments Delayed';
    else if (data === "rejected")
      return 'Rejected';
    else if (data === "paidNotDone")
      return 'Payment Not Made';
    else if (data === "paidPastDue")
      return 'Payment Past Due';
    else if (data === "ONHOLD")
      return 'On Hold';
    else if (data === "SUBMITTED")
      return 'Submitted';
    else if (data === "REJECTED")
      return 'Rejected';
    else if (data === "NA")
      return 'NA';
    else if (data === "SUBMITTED")
      return 'Submitted';
    else if (data === "APPROVED")
      return 'Approved';
    else if (data === "REVIEWED")
      return 'Reviewed';
    else if (data === "paid")
      return 'Paid';
    else if (data === "unpaid")
      return 'Not Paid';
    else return '';
  }

  const getPieChartLabels = () => {
    let pieChartLabels = [];
    pieData?.map(data => {
      pieChartLabels.push(getLabel(data?.key));
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
      colors: ["#1DD174", "#FFD950", "#F46044", '#7165E3', '#AE3CEA'],
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
    series: pieData?.map(data => data?.value)
  }
  return (
    <Chart {...chartData} type="pie" height={300} />
  )
}

export default ApexPieChart;