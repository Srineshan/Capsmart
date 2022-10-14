const chartData = {
    type: 'area',
    height: 240,
    options: {
        chart: {
            id: 'support-chart',
            sparkline: {
                enabled: true
            }
        },
        colors: ['#B3B8BD', '#8A8C8D', '#707070', '#52575D'],
        fill: {
            type: "solid",
          },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'straight',
            width: 2
        },
        legend: {
            show: true,
            position: 'top',
        },
        tooltip: {
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: 'Ticket '
            },
            marker: {
                show: false
            }
        }
    },

    series: [
        {
            name: "Laptops",
            data: [30, 60, 30, 70, 20 ]
        },
        {
            name: "Headsets",
            data: [25, 50, 27, 60, 20 ]
        },
        {
            name: "Monitors",
            data: [20, 25, 23, 25, 20 ]
        },
        {
            name: "Phones",
            data: [10, 15, 20, 15, 10 ]
        },
    ]
};

export default chartData;