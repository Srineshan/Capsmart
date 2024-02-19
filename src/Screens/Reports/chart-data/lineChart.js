import React from 'react';
import Chart from 'react-apexcharts';

const ApexLineChart = ({ lineData, lineCategory }) => {

    const chartData = {
        series: [
            {
                name: lineCategory,
                data: lineData?.map(data => data?.value)
            }
        ],
        options: {
            chart: {
                height: 300,
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
                categories: lineData?.map(data => data?.date),
            },
        }
    };
    return (
        <Chart {...chartData} type="line" height={300} />
    )
}

export default ApexLineChart;