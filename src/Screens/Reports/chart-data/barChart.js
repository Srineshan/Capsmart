import React from 'react';
import Chart from 'react-apexcharts';

const ApexBarChart = ({ series, categories, reportingPeriod, yAxisTitle, xAxisTitle }) => {

    const chartData = {
        series: series,
        options: {
            chart: {
                type: 'bar',
                height: 300,
                toolbar: {
                    show: false,
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                    endingShape: 'rounded'
                },
            },
            colors: ["#06617A"],
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                title: {
                    text: xAxisTitle,
                    style: {
                        color: '#b3b3b3',
                        fontSize: '15px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
                categories: categories,
                labels: {
                    show: true,
                    rotate: 0,
                    trim: true,
                    hideOverlappingLabels: false,
                    style: {
                        colors: [],
                        fontSize: '10px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                },
            },
            yaxis: {
                title: {
                    text: yAxisTitle,
                    style: {
                        color: '#b3b3b3',
                        fontSize: '15px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400,
                        cssClass: 'apexcharts-xaxis-label',
                    },
                }
            },
            legend: {
                show: true,
                onItemClick: {
                    toggleDataSeries: false
                }
            },
            title: {
                // text: `Time Period Selected - ${reportingPeriod}`,
                align: 'center',
                style: {
                    color: '#b3b3b3',
                    fontWeight: 400,
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                show: false,
            }
        },


    };
    return (
        <Chart {...chartData} type="bar" height={300} />
    )
}

export default ApexBarChart;