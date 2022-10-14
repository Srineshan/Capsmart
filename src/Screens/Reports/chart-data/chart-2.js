const chartData = {
    type: 'line',
    height: 90,
    width: 70,
    options: {
        chart: {
            sparkline: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#FF2366'],
        fill: {
            type: 'solid',
            opacity: 1
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        yaxis: {
            min: 0,
            max: 100
        },
        tooltip: {
            theme: 'dark',
            fixed: {
                enabled: false
            },
            x: {
                show: false
            },
            y: {
                title: 'Total Order'
            },
            marker: {
                show: false
            }
        }
    },
    series: [
        {
            name: 'Total Sales',
            data: [45, 30, 46, 42, 45, 28, 42, 26, 29, 26]
        }
    ]
};

export default chartData;