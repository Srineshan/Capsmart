import React from "react";
import Chart from "react-apexcharts";

export default function SemiCircleGauge({ value = 35, maxValue = 60, width = 400, height = 300 }) {
    // Clamp and convert to percentage for ApexCharts
    const clamped = Math.max(0, Math.min(value, maxValue));
    const pct = (clamped / maxValue) * 100;

    const options = {
        chart: {
            type: "radialBar",
            offsetY: -20,
            sparkline: { enabled: true }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: "#e7e7e7",
                    strokeWidth: "0%",   // thinner stroke
                    margin: 10
                },
                hollow: {
                    size: "65%"          // reduce hollow if you want a bolder arc
                },
                dataLabels: {
                    name: { show: false },
                    value: {
                        fontSize: "20px",
                        offsetY: -2,
                        formatter: () => `${clamped} Mins` // show real value instead of pct
                    }
                }
            }
        },
        stroke: {
            lineCap: "round"   // <-- rounded arc edges
        },
        colors: ["#73D035"], // solid color (can also use gradient like before)
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                shadeIntensity: 0.4,
                inverseColors: false,
                gradientToColors: ["#73D035"],
                stops: [0, 100]
            }
        },
        labels: ["Progress"]
    };

    const series = [pct]; // Apex needs percentage!

    return (
        <div>
            <Chart
                options={options}
                series={series}
                type="radialBar"
                width={width}
                height={height}
            />
        </div>
    );
}
