import React from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { pink, yellow } from '@mui/material/colors';
import chartData from './chart-data/small-chart-data';
import chartData2 from './chart-data/chart-2';
import chartData3 from './chart-data/chart-3';
import chartData4 from './chart-data/area-chart2';
import chartData5 from './chart-data/line-chart-1';
import chartData6 from './chart-data/column-chart-1';
import stackedColumn from './chart-data/stacked-column-chart';
import barChart1 from './chart-data/bar-chart-1';
import UserLogo from './../../images/userLogo.jpg';
import Checkbox from '@mui/material/Checkbox';
import Chart from 'react-apexcharts'
import style from './index.module.scss';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ChartPage = () => {
    const pieChart = {
        options: {
            theme: {
              monochrome: {
                enabled: false
              }
            },
            tooltip: {
                fixed: {
                    enabled: false
                },
                marker: {
                    show: false
                }
            },
            stroke: {
                curve: 'smooth',
                width: 0
            },
            colors: ['#FFD950', '#4791FF'],
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: "100%"
                  },
                  legend: {
                    show: false
                  }
                }
              }
            ],
            chart: {
              events: {
                dataPointSelection: (event, chartContext, config) => {
                  console.log(config.w.config.labels[config.dataPointIndex]);
                }
              }
            }
        },
        series: [15, 45]
    }
    return(
        <div className={style.chartBackground}>
            <div className={style.grid4}>
                <div className={`${style.chartCardStyle1} ${style.spaceBetween} ${style.alignCenter}`}>
                    <div className={style.displayInRow}>
                        <div className={`${style.iconBackgroundBlue} ${style.alignCenter} ${style.justifyCenter}`}>
                            <AssignmentIcon color="primary"/>
                        </div>
                        <div className={style.marginLeft10}>
                            <div className={style.chartTitleStyle}>Total Tasks</div>
                            <h1 className={style.chartValueStyle}>34</h1>
                        </div>
                    </div>
                    <div className={style.percentageStyleRed}>-25%</div>
                </div>
                <div className={`${style.chartCardStyle1} ${style.spaceBetween} ${style.alignCenter}`}>
                    <div className={style.displayInRow}>
                        <div className={`${style.iconBackgroundYellow} ${style.alignCenter} ${style.justifyCenter}`}>
                            <AssignmentIcon sx={{ color: yellow[800] }} />
                        </div>
                        <div className={style.marginLeft10}>
                            <div className={style.chartTitleStyle}>Tasks to do</div>
                            <h1 className={style.chartValueStyle}>14</h1>
                        </div>
                    </div>
                    <div className={style.percentageStyleGreen}>+10%</div>
                </div>
                <div className={`${style.chartCardStyle1} ${style.spaceBetween} ${style.alignCenter}`}>
                    <div className={style.displayInRow}>
                        <div className={`${style.iconBackgroundRed} ${style.alignCenter} ${style.justifyCenter}`}>
                            <AssignmentIcon sx={{ color: pink[500] }} />
                        </div>
                        <div className={style.marginLeft10}>
                            <div className={style.chartTitleStyle}>Tasks Overdue</div>
                            <h1 className={style.chartValueStyle}>5</h1>
                        </div>
                    </div>
                    <div className={style.percentageStyleRed}>-10%</div>
                </div>
                <div className={`${style.chartCardStyle1} ${style.spaceBetween} ${style.alignCenter}`}>
                    <div className={style.displayInRow}>
                        <div className={`${style.iconBackgroundGreen} ${style.alignCenter} ${style.justifyCenter}`}>
                            <AssignmentIcon color="success" />
                        </div>
                        <div className={style.marginLeft10}>
                            <div className={style.chartTitleStyle}>Completed Tasks</div>
                            <h1 className={style.chartValueStyle}>7</h1>
                        </div>
                    </div>
                    <div className={style.percentageStyleGreen}>+20%</div>
                </div>
            </div>
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <div className={style.chartCardStyle2}>
                    <div className={style.chartTitleStyle2}>Total Sales</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={style.spaceBetween}>
                        <div className={style.marginTop20}>
                            <h1 className={style.chartValueStyle}>$1.2M</h1> 
                            <div className={style.percentageStyleRed}>-25%</div>
                        </div>
                        <Chart {...chartData2} />
                    </div>
                </div>
                <div className={style.chartCardStyle2}>
                    <div className={style.chartTitleStyle2}>Total Balance</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={style.spaceBetween}>
                        <div className={style.marginTop20}>
                            <h1 className={style.chartValueStyle}>$1,534</h1> 
                            <div className={style.percentageStyleGreen}>+7%</div>
                        </div>
                        <Chart {...chartData3} />
                    </div>
                </div>
                <div className={style.chartCardStyle2}>
                    <div className={style.chartTitleStyle2}>Total Visitors</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={style.spaceBetween}>
                        <div className={style.marginTop20}>
                            <h1 className={style.chartValueStyle}>$155K</h1> 
                            <div className={style.percentageStyleGreen}>+25%</div>
                        </div>
                        <Chart {...chartData3} />
                    </div>
                </div>
                <div className={style.chartCardStyle2}>
                    <div className={style.chartTitleStyle2}>Total Users</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={style.spaceBetween}>
                        <div className={style.marginTop20}>
                            <h1 className={style.chartValueStyle}>4234</h1> 
                            <div className={style.percentageStyleGreen}>+19%</div>
                        </div>
                        {/* <Chart {...barChart1} height={80} className={`${style.marginTop20} ${style.marginLeft20}`} /> */}
                        <Chart {...barChart1} color="#02BC77" height={100} />
                    </div>
                </div>
            </div>
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <div className={style.chartCardStyle3}>
                    <div className={style.chartTitleStyle2}>Total Sales</div>
                    <h1 className={`${style.chartValueStyle} ${style.reduceMarginTop10}`}>$1.2M</h1>
                    <div className={style.chartMargin}>
                        <Chart {...chartData} className={style.marginTop20} />
                    </div>
                </div>
                <div className={style.chartCardStyle3}>
                    <div className={style.spaceBetween}>
                        <div>
                            <div className={style.chartTitleStyle2}>Total Balance</div>
                            <h1 className={`${style.chartValueStyle} ${style.reduceMarginTop10}`}>$1,534</h1>
                        </div>
                        <div className={`${style.percentageStyleGreen} ${style.marginTop10}`}>+7%</div>
                    </div>
                    <div className={style.chartMargin}>
                        <Chart {...chartData4} className={style.marginTop20} />
                    </div>
                </div>
                <div className={style.chartCardStyle3}>
                    <div className={style.chartTitleStyle2}>Total Visitors</div>
                    <h1 className={`${style.chartValueStyle} ${style.reduceMarginTop10}`}>155K</h1>
                    <div className={style.chartMargin}>
                        <Chart {...pieChart} type="pie" height={170} className={style.marginTop20} />
                    </div>
                </div>
                <div className={style.chartCardStyle3}>
                    <div className={style.chartTitleStyle2}>Total Users</div>
                    <h1 className={`${style.chartValueStyle} ${style.reduceMarginTop10}`}>4234</h1>
                    <div className={style.chartMargin}>
                        <Chart {...stackedColumn} height={170} className={style.marginTop20} />
                    </div>
                </div>
            </div>
            <div className={`${style.grid2} ${style.marginTop20}`}>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>Tasks</div>
                    <div className={style.chartTitleBorder}></div>
                    <Chart {...chartData6} />
                </div>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>RECENT REPORT</div>
                    <div className={style.chartTitleBorder}></div>
                    <Chart {...chartData5} />
                </div>
            </div>
            <div className={`${style.grid2} ${style.marginTop20}`}>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>Best Sellers</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={style.bestSellerImgStyle} />
                        <div className={style.sellerContent}>
                            <div className={style.bestSellerTitle}>Bathing Shampoo</div>
                            <div className={style.sellerProgress1}></div>
                            <div className={style.chartTitleStyle2}>80,451 sales</div>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={style.bestSellerImgStyle} />
                        <div className={style.sellerContent}>
                            <div className={style.bestSellerTitle}>Bathing Shampoo</div>
                            <div className={style.sellerProgress2}></div>
                            <div className={style.chartTitleStyle2}>15,451 sales</div>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={style.bestSellerImgStyle} />
                        <div className={style.sellerContent}>
                            <div className={style.bestSellerTitle}>Running Shoes</div>
                            <div className={style.sellerProgress3}></div>
                            <div className={style.chartTitleStyle2}>11,451 sales</div>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={style.bestSellerImgStyle} />
                        <div className={style.sellerContent}>
                            <div className={style.bestSellerTitle}>Toilet papers</div>
                            <div className={style.sellerProgress4}></div>
                            <div className={style.chartTitleStyle2}>11,451 sales</div>
                        </div>
                    </div>
                </div>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>Best Sellers</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={style.marginTop20}>
                        <div className={`${style.spaceBetween}`}>
                            <div className={style.bestSellerTitle}>Bathing Shampoo</div>
                            <div className={style.chartTitleStyle2}>80,451 sales</div>
                        </div>
                        <div className={style.sellerProgress1}></div>
                    </div><br />
                    <div className={style.marginTop10}>
                        <div className={`${style.spaceBetween}`}>
                            <div className={style.bestSellerTitle}>Bathing Shampoo</div>
                            <div className={style.chartTitleStyle2}>15,451 sales</div>
                        </div>
                        <div className={style.sellerProgress2}></div>
                    </div><br />
                    <div className={style.marginTop10}>
                        <div className={`${style.spaceBetween}`}>
                            <div className={style.bestSellerTitle}>Running Shoes</div>
                            <div className={style.chartTitleStyle2}>11,451 sales</div>
                        </div>
                        <div className={style.sellerProgress3}></div>
                    </div><br />
                    <div className={style.marginTop10}>
                        <div className={`${style.spaceBetween}`}>
                            <div className={style.bestSellerTitle}>Toilet papers</div>
                            <div className={style.chartTitleStyle2}>11,451 sales</div>
                        </div>
                        <div className={style.sellerProgress4}></div>
                    </div><br />
                    <div className={style.marginTop10}>
                        <div className={`${style.spaceBetween}`}>
                            <div className={style.bestSellerTitle}>Handsanitizer</div>
                            <div className={style.chartTitleStyle2}>11,451 sales</div>
                        </div>
                        <div className={style.sellerProgress4}></div>
                    </div>
                </div>
            </div>
            <div className={style.marginTop20}>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>Products</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={`${style.productGrid} ${style.marginTop20}`}>
                        <div className={style.chartTitleStyleMedium}>ID</div>
                        <div className={style.chartTitleStyleMedium}>Product</div>
                        <div className={style.chartTitleStyleMedium}>In Stock</div>
                        <div className={style.chartTitleStyleMedium}>Price</div>
                        <div className={style.chartTitleStyleMedium}>Sales</div>
                        <div className={style.chartTitleStyleMedium}>Views</div>
                    </div>
                    <div className={style.chartTitleBorder}></div><br />
                    <div className={`${style.productGrid} ${style.marginTop20}`}>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>356121</div>
                        <div className={`${style.displayInRow} ${style.alignCenter}`}>
                            <img src={UserLogo} className={style.productImgStyle} />
                            <div className={`${style.chartTitleStyle2} ${style.marginLeft10}`}>Bathing Shampoo</div>
                        </div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>451</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>$654</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>822</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>80,451</div>
                        <div className={`${style.chartTitleStyleMedium} ${style.alignCenter} ${style.viewOutline}`}> View</div>
                    </div>
                    <div className={`${style.productGrid} ${style.marginTop20}`}>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>356122</div>
                        <div className={`${style.displayInRow} ${style.alignCenter}`}>
                            <img src={UserLogo} className={style.productImgStyle} />
                            <div className={`${style.chartTitleStyle2} ${style.marginLeft10}`}>Bathing Shampoo</div>
                        </div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>420</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>$654</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>812</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>15,451</div>
                        <div className={`${style.chartTitleStyleMedium} ${style.alignCenter} ${style.viewOutline}`}> View</div>
                    </div>
                    <div className={`${style.productGrid} ${style.marginTop20}`}>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>356132</div>
                        <div className={`${style.displayInRow} ${style.alignCenter}`}>
                            <img src={UserLogo} className={style.productImgStyle} />
                            <div className={`${style.chartTitleStyle2} ${style.marginLeft10}`}>Running Shoes</div>
                        </div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>100</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>$654</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>700</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>11,451</div>
                        <div className={`${style.chartTitleStyleMedium} ${style.alignCenter} ${style.viewOutline}`}> View</div>
                    </div>
                    <div className={`${style.productGrid} ${style.marginTop20}`}>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>356782</div>
                        <div className={`${style.displayInRow} ${style.alignCenter}`}>
                            <img src={UserLogo} className={style.productImgStyle} />
                            <div className={`${style.chartTitleStyle2} ${style.marginLeft10}`}>Toilet papers</div>
                        </div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>560</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>$654</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>500</div>
                        <div className={`${style.chartTitleStyle2} ${style.alignCenter}`}>11,451</div>
                        <div className={`${style.chartTitleStyleMedium} ${style.alignCenter} ${style.viewOutline}`}> View</div>
                    </div>
                </div>
            </div>
            <div className={`${style.grid3} ${style.marginTop20}`}>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>Activity Feed</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop10}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p><span className={style.chartTitleStyleMedium}>Peter</span> <span className={style.chartTitleStyle2}>ordered</span> <span className={style.chartTitleStyleMedium}>Toilet Paper</span> </p>
                            <p className={style.chartTitleStyle2}>2 hours ago</p>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop10}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p><span className={style.chartTitleStyleMedium}>Tom</span> <span className={style.chartTitleStyle2}> disliked and commented . . .</span> </p>
                            <p className={style.chartTitleStyle2}>5 hours ago</p>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop10}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p><span className={style.chartTitleStyleMedium}>John</span> <span className={style.chartTitleStyle2}> added 12 new products . . .</span> </p>
                            <p className={style.chartTitleStyle2}>4 hours ago</p>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop10}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p className={style.textAlignLeft}><span className={style.chartTitleStyleMedium}>Tom</span> <span className={style.chartTitleStyle2}> commented on Peter's . . .</span> </p>
                            <p className={style.chartTitleStyle2}>4 hours ago</p>
                            <p className={style.chartTitleStyle2}>
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
                            </p>
                        </div>
                    </div>
                </div>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>New Users</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop5}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p className={style.chartTitleStyleMedium}> Peter Orangatan</p>
                            <p className={style.chartTitleStyle2}>2 hours ago</p>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop5}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p className={style.chartTitleStyleMedium}>Tommy Delware</p>
                            <p className={style.chartTitleStyle2}>3 hours ago</p>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop5}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p className={style.chartTitleStyleMedium}> John Dale</p>
                            <p className={style.chartTitleStyle2}>4 hours ago</p>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop5}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p className={style.chartTitleStyleMedium}> Jim Halpert</p>
                            <p className={style.chartTitleStyle2}>4 hours ago</p>
                        </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                        <img src={UserLogo} className={`${style.productImgStyle} ${style.marginTop5}`} />
                        <div className={`${style.marginTop10} ${style.marginLeft20}`}>
                            <p className={style.chartTitleStyleMedium}> Michael Smith</p>
                            <p className={style.chartTitleStyle2}>4 hours ago</p>
                        </div>
                    </div>
                </div>
                <div className={style.chartCardStyle4}>
                    <div className={style.chartTitleStyle2}>Tasks</div>
                    <div className={style.chartTitleBorder}></div>
                    <div className={`${style.taskStyle1} ${style.displayInRow} ${style.marginTop20}`}>
                        <Checkbox
                        {...label}
                        defaultChecked
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                        <p className={`${style.chartTitleStyle2} ${style.alignCenter}`}>Lorem ipsum is some dummy text generator</p>
                    </div>
                    <div className={`${style.taskStyle2} ${style.displayInRow} ${style.marginTop10}`}>
                        <Checkbox
                        {...label}
                        defaultChecked
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                        <p className={`${style.chartTitleStyle2} ${style.alignCenter}`}>Lorem ipsum is some dummy text generator</p>
                    </div>
                    <div className={`${style.taskStyle3} ${style.displayInRow} ${style.marginTop10}`}>
                        <Checkbox
                        {...label}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                        <p className={`${style.chartTitleStyle2} ${style.alignCenter}`}>Lorem ipsum is some dummy text generator, lorem ipsum is some dummy text generator</p>
                    </div>
                    <div className={`${style.taskStyle4} ${style.displayInRow} ${style.marginTop10}`}>
                        <Checkbox
                        {...label}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                        <p className={`${style.chartTitleStyle2} ${style.alignCenter}`}>Lorem ipsum is some dummy text generator</p>
                    </div>
                    <div className={`${style.taskStyle5} ${style.displayInRow} ${style.marginTop10}`}>
                        <Checkbox
                        {...label}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                        <p className={`${style.chartTitleStyle2} ${style.alignCenter}`}>Lorem ipsum is some dummy text generator</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartPage;