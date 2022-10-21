const chartData = {
    series: [
        {
          name: "Time Period Selected - Aug 28 - Sep 20",
          data: [25, 42, 35, 42, 25]
        }
      ],
      options: {
            chart: {
            height: 150,
            type: 'line',
            toolbar: {
                show: false
            }
            },
            colors: ['#02BC77'],
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
            categories: ['08-22-2022', '08-24-2022', '08-25-2022', '08-26-2022', '08-27-2022'],
            },
            yaxis: {
            min: 0,
            max: 60
            },
        }
};

export default chartData;
