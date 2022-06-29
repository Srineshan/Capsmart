const chartData = {
  series: [{
    name: 'PRODUCT A',
    data: [44, 55, 41, 67, 22]
  }],
  type: 'bar',
  options: {
      chart: {
      type: 'bar',
      height: 60,
      stacked: false,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
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
    grid: {
      show: false
    },
    legend: {
      show: false,
      position: 'right',
      offsetY: 10
    },
    fill: {
      opacity: 1
    }
  }
};

export default chartData;