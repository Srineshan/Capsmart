const chartData = {
  type: 'bar',
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          // colors: ['#4791FF', '#FF2366', '#02BC77', '#FFD950']
        },
        xaxis: {
          categories: ['2015', '2016', '2017', '2018', '2019'],
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val
            }
          }
        }
    },
    series: [{
        name: 'Total',
        data: [50, 65, 75, 85, 98]
      }, {
        name: 'To do',
        data: [10, 18, 20, 20, 10]
      }, {
        name: 'Completed',
        data: [18, 15, 57, 65, 85]
      }, {
        name: 'Overdue',
        data: [25, 17, 20, 30, 18]
      }],
};

export default chartData;