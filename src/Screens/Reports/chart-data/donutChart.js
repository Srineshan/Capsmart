import React from 'react';
import Chart from 'react-apexcharts';

const DonutChart = ({ height, legendPosition, series = [], labels = [] }) => {
    // const series = [280, 200, 140, 100, 50]; // Raw counts for each stage
    const options = {
        chart: {
            type: 'donut',
            height: height,
            background: 'transparent', // Transparent background
            animations: {
                enabled: true // Animations enabled as per your code
            },
            dropShadow: {
                enabled: false,
            },
        },
        labels: labels,
        colors: [
            '#3F8ADF',
            '#FF6562',
            '#FF851C',
            '#73D035',
            '#FFC100',
            '#FF669C',
            '#9B43DE',
            '#973283'
        ],
        fill: {
            type: 'solid',
            opacity: 1
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
                return `(${val?.toFixed(0)}%)`;
            },
            style: {
                colors: ['#fff'],
                fontSize: '12px',
                textShadow: 'none' // Explicitly remove shadow
            },
            dropShadow: {
                enabled: false,
            },
        },
        legend: {
            position: legendPosition,
            horizontalAlign: 'center',
            fontSize: '12px',
            labels: {
                colors: '#333',
                formatter: function (seriesName, opts) {
                    const total = series?.reduce((sum, num) => sum + num, 0);
                    const percentage = ((opts.w.globals.series[opts.seriesIndex] / total) * 100).toFixed(0);
                    return `${seriesName} (${percentage}%)`;
                },
                style: {
                    textShadow: 'none' // Remove shadow from legend labels
                }
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%', // Hole size as per requirement
                    labels: {
                        show: true,
                        name: {
                            show: false
                        },
                        value: {
                            show: false,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#333',
                            formatter: function () {
                                return 'Total: 100%';
                            }
                        },
                        total: {
                            show: false // Hide default total to use custom value
                        }
                    }
                }
            }
        },
        stroke: {
            show: true, // Enable stroke to create gaps
            width: 2,   // Adjust width for gap size
            colors: ['#fff'] // White color for visible separation
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 300
                    },
                    legend: {
                        position: legendPosition
                    }
                }
            }
        ]
    };

    return (
        <div style={{ background: 'transparent' }}>
            <Chart options={options} series={series} type="donut" height={height} />
        </div>
    );
};

export default DonutChart;