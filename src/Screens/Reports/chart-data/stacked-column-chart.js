const chartData = {
    series: [{
        data: [44, 55, 41, 67, 22, 43, 45, 34, 54, 34, 23]
      }, {
        data: [13, 23, 20, 8, 13, 27, 24, 21, 13, 12, 23]
      }
    ],
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
          columnWidth: '10%',
          backgroundBarColors: ['#02BC77', '#D7DADB'],
          endingShape: 'rounded',
        },
      },
      xaxis: {
        show: false,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false,
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      legend: {
        show: false,
        position: 'right',
        offsetY: 10
      },
      fill: {
        opacity: 1
      },
      grid: {
        show: false
    }
    }
};

export default chartData;