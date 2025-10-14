import React from 'react';
import Chart from 'react-apexcharts';

const FunnelChart = ({ series, total = 0 }) => {
    // const series = [
    //     {
    //         name: 'Reappointments',
    //         data: [
    //             { x: 'Permanent Staff Eligible', y: 280 },
    //             { x: 'Reappointment Applications with Applicants', y: 200 },
    //             { x: 'Completed Reappointment Application', y: 140 },
    //             { x: 'Verified by MSO', y: 100 },
    //             { x: 'Departmental Review', y: 50 },
    //             { x: 'Cred. Comm.', y: 40 },
    //             { x: 'MAC', y: 30 },
    //             { x: 'BOD', y: 20 }
    //         ]
    //     }
    // ];

    const options = {
        chart: {
            type: 'bar',
            height: 600,
            toolbar: { show: false },
            background: 'transparent',
        },
        legend: { show: false },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 0,
                distributed: true,
                isFunnel: true, // Ensure funnel shape
                dataLabels: {
                    position: 'center',
                    formatter: function (val) {
                        return val; // Show count
                    },
                    style: {
                        colors: ['#fff'], // White text
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }
                }
            },
            funnel: {
                neckHeightRatio: 0.05, // Narrow neck
                neckWidthRatio: 0.1
            }
        },
        colors: [
            '#D8FF8A',
            '#C7F47C',
            '#B7EB6F',
            '#A7E162',
            '#96D854',
            '#86CE47',
            '#76C43A',
            '#66BB2D'
        ],
        dataLabels: {
            enabled: true,
            textAnchor: 'middle',
            offsetX: 0,
            style: {
                fontSize: '12px',
                fontWeight: 'normal',
                colors: ['#333'] // Dark text for labels
            },
            formatter: function (val, opts) {
                const percent = opts.w.config.series[0].data[opts.dataPointIndex].z;
                return `${opts.w.globals.labels[opts.dataPointIndex]} ${val} (${percent}%)`;
            },
        },
        // colors: ['#73D035'], // One color per stage
        fill: {
            type: 'solid', // Ensure solid fill per color
            opacity: 1
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'] // White border
        },
        xaxis: {
            categories: [],
            labels: { show: false }
        },
        yaxis: {
            labels: { show: false }
        },
        annotations: {
            yaxis: [
                // No additional annotations needed
            ]
        },
        tooltip: {
            enabled: true,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                // Access category (e.g., "Sourced") and value (e.g., 138)
                const category = w.globals.labels[dataPointIndex];
                const value = series[seriesIndex][dataPointIndex];
                // Return custom HTML with styled text
                return `
                  <div style="padding: 10px; background: #333; color: #fff; font-size: 16px; border-radius: 4px;">
                    Applications: ${value}
                  </div>
                `;
            }
        }
    };

    return (
        <div style={{ background: 'transparent' }}>
            <Chart options={options} series={series} type='bar' height={600} />
        </div>
    );
};

export default FunnelChart;