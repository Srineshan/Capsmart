import React, { useRef, useEffect, useState } from "react";
import Chart from "react-apexcharts";

export default function GaugeWithNeedle({ value = 50, maxValue = 60, width = 360 }) {
    const wrapperRef = useRef(null);
    const [size, setSize] = useState(width); // square size used by chart + overlay

    // responsive: track container size
    useEffect(() => {
        if (!wrapperRef.current) return;
        const ro = new ResizeObserver((entries) => {
            const r = entries[0].contentRect;
            const s = Math.min(r.width, r.height);
            setSize(Math.max(140, Math.round(s))); // min size safeguard
        });
        ro.observe(wrapperRef.current);
        return () => ro.disconnect();
    }, []);

    const clamped = Math.max(0, Math.min(value, maxValue));
    const pct = (clamped / maxValue) * 100;
    const angle = -90 + (clamped / maxValue) * 180; // -90..+90 mapping

    const options = {
        chart: {
            type: "radialBar",
            height: 150,
            offsetY: 0,
            toolbar: { show: false },
            animations: { enabled: false },
        },
        grid: {
            padding: {
                top: -30,
                bottom: -30,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    size: '60%',
                    margin: 0,
                },
                track: {
                    background: '#e7e7e7',
                    strokeWidth: '100%',
                    margin: 15
                },
                dataLabels: {
                    name: {
                        show: true,
                        offsetY: -10,
                        color: '#111',
                        fontSize: '16px',
                    },
                    value: {
                        show: true,
                        fontSize: '20px',
                        offsetY: 50,
                        formatter: function (val) {
                            return clamped.toFixed(0) + " Mins";
                        }
                    }
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "horizontal",
                shadeIntensity: 0.4,
                gradientToColors: ["#FF8A65"],
                inverseColors: false,
                stops: [0, 50, 100],
                colorStops: [
                    { offset: 0, color: "#C3EBA8", opacity: 1 },
                    { offset: 55, color: "#73D035", opacity: 1 },
                    { offset: 100, color: "#539924", opacity: 1 },
                ],
            },
        },
        stroke: { lineCap: "round" },
        labels: [""],
    };

    const series = [pct];

    return (
        <div style={{ width, fontFamily: "system-ui, Arial" }}>
            <h3 style={{ textAlign: "center", marginBottom: 0 }}>Actual Time Spent on Application</h3>

            {/* chart container (square) */}
            <div
                ref={wrapperRef}
                style={{
                    position: "relative",
                    width: "100%",
                    height: size, // square so chart center and SVG center match
                }}
            >
                <Chart options={options} series={series} type="radialBar" height={size} />

                {/* overlay (centered via flex) */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                    }}
                >
                    {/* SVG viewBox is 200x200; center = (100,100). We rotate the group about the center. */}
                    <svg width={size} height={size} viewBox="0 30 200 140" style={{ overflow: "visible" }}>
                        {/* rotate the needle group around center (100,100) */}
                        <g transform={`rotate(${angle} 100 100)`}>
                            {/* needle (vertical before rotation: from center up) */}
                            <line
                                x1="100"
                                y1="100"
                                x2="100"
                                y2="36"            // needle length - tune as needed
                                stroke="#555"
                                strokeWidth="6"
                                strokeLinecap="round"
                            />
                        </g>

                        {/* center ring and dot (drawn after needle so dot is on top) */}
                        <circle cx="100" cy="100" r="9" fill="#fff" stroke="#e6e6e6" strokeWidth="3" />
                        <circle cx="100" cy="100" r="5.5" fill="#555" />
                    </svg>
                </div>
            </div>

            {/* <div style={{ textAlign: "center", marginTop: 0, fontSize: 22, color: "#16324a" }}>
                {clamped} Mins
            </div> */}
        </div>
    );
}