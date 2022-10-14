const chartData = {
    series: [
        {
          name: "2018 Report",
          data: [25, 42, 35, 42, 25, 18, 25, 42]
        },
        {
          name: "2019 Report",
          data: [8, 25, 18, 32, 42, 28, 25, 18]
        }
      ],
      options: {
            chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false
            }
            },
            colors: ['#4791FF', '#02BC77'],
            dataLabels: {
            enabled: false,
            },
            stroke: {
            curve: 'smooth',
            width: 2
            },
            grid: {
            borderColor: '#e7e7e7',
            },
            markers: {
            size: 5
            },
            xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            },
            yaxis: {
            min: 0,
            max: 60
            },
        }
};

export default chartData;