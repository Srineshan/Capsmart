import React, { useState, useRef, useEffect, Fragment } from 'react';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import style from './index.module.scss';
import { Checkbox } from '@material-ui/core';
import SideBar from '../../Components/Sidebar';
import SearchBar from './../../Components/SearchBar';
import Navbar from '../../Components/Navbar';

const FeedbackCustomers = ({ getSelectedCustomer, getAddContract, entityList }) => {
    return (
        <>
            {/* <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={`${style.bigCardGrid2}`}>
                    <SideBar />
                    <div>
                        <div className={style.displayInRow}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                CUSTOMER MANAGEMENT
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                        </div>
                        <div className={`${style.grid4} ${style.marginTop20}`}>
                            <div className={`${style.cardStyle}`} onClick={() => getSelectedCustomer('ACTIVE CUSTOMERS')}>
                                <h5 className={`${style.headingForContracts}`}>ACTIVE CUSTOMERS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>{entityList?.filter(data => data?.subscriptionPlan?.subscriptionStatus === 'ACTIVE')?.map(data => data)?.length || 0}</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.red}>1 </span> RENEWAL PAST DUE</span>
                                        <span><span className={style.yellow}>1 </span> AUTO RENEWED</span>
                                        <span><span className={style.red}>1 </span> RENEWAL IN 30 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.cardStyle} onClick={() => getSelectedCustomer('IN-PROGRESS / TRIAL CUSTOMERS')}>
                                <h5 className={`${style.headingForContracts}`}>IN-PROGRESS / TRIAL CUSTOMERS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>{entityList?.filter(data => data?.subscriptionPlan?.subscriptionStatus !== 'ACTIVE')?.map(data => data)?.length || 0}</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> ON TRIAL</span>
                                        <span><span className={style.yellow}>1 </span> OVER 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> OVER 60 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.cardStyle} onClick={() => getSelectedCustomer('ON HOLD / TERMINATED CUSTOMERS')}>
                                <h5 className={style.headingForContracts}>ON HOLD / TERMINATED CUSTOMERS</h5>
                                <div className={`${style.spaceBetween}`}>
                                    <p className={`${style.headingCountForCustomers}`}>2</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.yellow}>1 </span> ON HOLD FOR 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> SUBSCRIPTION EXPIRED</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.cardStyle} ${style.selectedContractBackground}`} onClick={() => getSelectedCustomer('FEEDBACK TICKETS')}>
                                <h5 className={`${style.headingForContracts}`}>FEEDBACK TICKETS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>3</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> NEW</span>
                                        <span><span className={style.yellow}>1 </span> HIGH PRIORITY</span>
                                        <span><span className={style.red}>1 </span> PASS DUE</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
            {/* <div className={style.marginTop20}> */}
            {/* <div className={style.bigCardStyle}>
                    <div className={style.spaceBetween}>
                        <div className={`${style.displayInRow} ${style.marginTop20} ${style.marginLeft30}`}>
                            <p className={`${style.blue} ${style.activeContractsWidth}`}>LIST OF FEEDBACK TICKET</p>
                        </div>
                        <div className={`${style.displayInRow} ${style.marginTop20}`}>
                            <SearchBar />
                            <img src={Envelope} alt="Envelope" className={style.smallIcons} />
                            <img src={Bell} alt="Bell" className={style.smallIcons} />
                            <img src={Filter} alt="Filter" className={style.filterIcon} />
                            <button className={style.contractButton} onClick={() => getAddContract(true)} >ADD TICKET</button>
                        </div>
                    </div> */}
            <div>
                <div className={`${style.tableHeaderFeedbackCustomer} ${style.marginTop20}`}>
                    <Checkbox />
                    <p className={style.tableHeaderFontStyleActiveCustomer}>TICKET ID</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>ISSUE/ SUBJECT</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>CUSTOMER</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>TYPE</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>SUBMITTED ON</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>RESOLUTION STATUS</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>LAST UPDATED</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>LAST UPDATED BY</p>
                    <p className={style.tableHeaderFontStyleActiveCustomer}>PARTNER</p>
                </div>
                <div className={`${style.tableDataFeedbackCustomer}`}>
                    <div className={`${style.displayInRow}`}>
                        <Checkbox />
                        <div className={`${style.green} ${style.greenDotStyle} ${style.marginTop20}`}></div>
                    </div>
                    <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>23676587</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>Exception error</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>02-23-2022</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Open</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>02-23-2022</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                </div>
                <div className={`${style.tableDataFeedbackCustomer}`}>
                    <div className={`${style.displayInRow}`}>
                        <Checkbox />
                        <div className={`${style.green} ${style.greenDotStyle} ${style.marginTop20}`}></div>
                    </div>
                    <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>23676587</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>Bug</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>02-23-2022</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Open</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>02-23-2022</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                </div>
                <div className={`${style.tableDataFeedbackCustomer}`}>
                    <div className={`${style.displayInRow}`}>
                        <Checkbox />
                        <div className={`${style.green} ${style.greenDotStyle} ${style.marginTop20}`}></div>
                    </div>
                    <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>23676587</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>Enhancement Request</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>02-23-2022</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Open</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>02-23-2022</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                    <p className={style.tableDataFontStyleActiveCustomers}>Lorem Ipsum</p>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                    <div className={style.displayInRow}>
                        <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                        <img src={ChevronRight} className={style.roundChevron} />
                    </div>
                </div>
            </div>
            {/* </div> */}
            {/* </div> */}
            {/* </div>
                </div>
                <div className={style.spaceBetween}>
                    <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
                    <p className={style.poweredBy}>© TimeSmartAI</p>
                </div>
            </div>
        </Fragment> */}
        </>
    )
}

export default FeedbackCustomers;
