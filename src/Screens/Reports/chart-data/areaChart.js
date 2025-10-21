import React from "react";
import Chart from "react-apexcharts";

const AreaChart = () => {
    const chartOptions = {
        chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        xaxis: {
            type: "category",
            // categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            labels: {
                style: {
                    colors: "#6B7280", // gray-500
                    fontSize: "12px",
                },
                show: false
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#6B7280",
                    fontSize: "12px",
                },
            },
        },
        grid: {
            borderColor: "#E5E7EB", // gray-200
            strokeDashArray: 4,
        },
        tooltip: {
            theme: "light",
        },
        colors: ["#0ea5e9", "#22c55e"], // blue & green
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 90, 100],
            },
        },
        legend: {
            position: "top",
            horizontalAlign: "right",
        },
    };

    const chartSeries = [
        {
            name: "Revenue",
            data: [31, 40, 28, 51, 42, 55, 60],
        },
    ];

    return (
        <div className="w-full bg-white p-4 rounded-2xl shadow-md">
            <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={200}
            />
        </div>
    );
};

export default AreaChart;