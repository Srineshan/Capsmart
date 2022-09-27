const chartData = {
    type: 'area',
    height: 174,
    options: {
        chart: {
            id: 'support-chart',
            sparkline: {
                enabled: true
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
            data: [28, 32, 30, 45, 43, 33, 48, 46, 23, 28, 33 ]
        },
        {
            data: [25, 25, 28, 22, 33, 28, 35, 23, 37, 40, 42 ]
        }
    ]
};

export default chartData;