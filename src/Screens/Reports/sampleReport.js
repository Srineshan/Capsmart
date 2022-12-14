import React from 'react';
import Chart from 'react-apexcharts'
import straightAreaChart from './chart-data/straight-area-chart';
import SettingsIcon from '@mui/icons-material/Settings';
import SampleReportLeftCard from './sampleReportLeftCard';
import ReportPerformanceAndOptions from './reportPerformanceAndOptions';

import style from './index.module.scss';

const SampleReport = () => {
    const donutChart = {
        series: [4, 6, 10],
        chartOptions: {
        labels: ["Electronics", "Furniture", "Toys"],
        },
        options: {
            chart: {
                type: 'donut',
            },
            colors: ['#8A8C8D', '#707070', '#52575D'],
            legend: {
                show: true,
                position: 'top'
            },
            stroke: {
                curve: 'smooth',
                width: 10,
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val
                },
            },
            plotOptions: {
                pie: {
                  size: 20
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                chart: {
                    width: 300,
                    height: 300
                },
                }
            }]
        }
    }

    const getDataToUseInReport = (value) => {
    }

    return(
        <div className={style.margin20}>
            <div className={style.bigCardGrid}>
                <SampleReportLeftCard  getDataToUseInReport={getDataToUseInReport} />
                <div className={style.bigCardStyle}>
                    <ReportPerformanceAndOptions />
                    <div className={style.graphBox}>
                        <div className={style.chartGrid}>
                            <div className={style.individualBox}>
                                <div className={style.spaceBetween}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>SALES PERFORMANCE</div>
                                    <div className={`${style.settingBackground} ${style.alignCenter} ${style.justifyCenter}`}>
                                        <SettingsIcon style={{color:"#707070"}} />
                                    </div>
                                </div>
                                <div className={style.performanceBorder}></div>
                                <div className={`${style.chartMargin}`}>
                                    <Chart {...straightAreaChart} className={style.marginTop20} />
                                </div>
                            </div>
                            <div className={style.individualBox}>
                                <div className={style.spaceBetween}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>TOP CATEGORIES</div>
                                </div>
                                <div className={`${style.performanceBorder} ${style.marginTop20}`}></div>
                                <div className={`${style.chartMargin}`}>
                                    <Chart {...donutChart}  type="donut" height={270} className={style.marginTop20} />
                                </div>
                            </div>
                        </div>
                        <div className={style.margin20}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>RECENT CUSTOMERS</div>
                                <div className={`${style.settingBackground} ${style.alignCenter} ${style.justifyCenter}`}>
                                    <SettingsIcon style={{color:"#707070"}} />
                                </div>
                            </div>
                            <div className={`${style.individualBox} ${style.marginTop10}`}>
                                <div className={style.recentCustomerGrid}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>Jerry Mattedi</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>13 aug 2018 <br />Joined</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>251-661-5362 <br /> Phone Number</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>New York <br /> Location</div>
                                    <div className={style.optionsButton}>Options</div>
                                    <div className={`${style.detailsButton}`}>Details</div>
                                </div>
                                <div className={style.recentCustomerGrid}>
                                    <div className={`${style.performanceTextStyle} ${style.alignCenter}`}>ElianoraVasilov</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>13 aug 2018 <br />Joined</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>351-661-3252 <br /> Phone Number</div>
                                    <div className={`${style.chartTitleStyle3} ${style.alignCenter}`}>Ontario <br /> Location</div>
                                    <div className={style.optionsButton}>Options</div>
                                    <div className={`${style.detailsButton}`}>Details</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SampleReport;
