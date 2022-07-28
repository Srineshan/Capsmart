import React, { useState, useRef, useEffect, Fragment } from 'react';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import style from './index.module.scss';
import { Checkbox } from '@material-ui/core';
import SideBar from '../../Components/Sidebar';
import Navbar from '../../Components/Navbar';

const TerminatedCustomers = ({getSelectedCustomer, getAddContract}) => {
    return(
        <Fragment>
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
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>4</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.red}>1 </span> RENEWAL PAST DUE</span>
                                        <span><span className={style.yellow}>1 </span> AUTO RENEWED</span>
                                        <span><span className={style.red}>1 </span> RENEWAL IN 30 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.cardStyle} onClick={() => getSelectedCustomer('IN-PROGESS / TRIAL CUSTOMERS')}>
                                <h5 className={`${style.headingForContracts}`}>IN-PROGESS / TRIAL CUSTOMERS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>3</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> ON TRIAL</span>
                                        <span><span className={style.yellow}>1 </span> OVER 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> OVER 60 DAYS</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.cardStyle} ${style.selectedContractBackground}`} onClick={() => getSelectedCustomer('ON HOLD / TERMINATED CUSTOMERS')}>
                                <h5 className={style.headingForContracts}>ON HOLD / TERMINATED CUSTOMERS</h5>
                                <div className={`${style.spaceBetween}`}>
                                    <p className={`${style.headingCountForCustomers}`}>2</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.yellow}>1 </span> ON HOLD FOR 30 DAYS</span>
                                        <span><span className={style.red}>1 </span> SUBSCRIPTION EXPIRED</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.cardStyle} onClick={() => getSelectedCustomer('FEEDBACK TICKETS')}>
                                <h5 className={`${style.headingForContracts}`}>FEEDBACK TICKETS</h5>
                                <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                                    <p className={`${style.headingCountForCustomers} ${style.displayInColRev}`}>5</p>
                                    <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                        <span><span className={style.green}>1 </span> NEW</span>
                                        <span><span className={style.yellow}>1 </span> HIGH PRIORITY</span>
                                        <span><span className={style.red}>1 </span> PASS DUE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.bigCardStyle}>
                                <div className={style.spaceBetween}>
                                    <div className={`${style.displayInRow} ${style.marginTop20} ${style.marginLeft30}`}>
                                        <p className={`${style.blue} ${style.activeContractsWidth}`}>LIST OFON-HOLD/ TERMINATED CUSTOMER</p>
                                    </div>
                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                        <div className={style.searchBarStyle}>
                                            <p>Search here</p>
                                            <p className={style.marginRight}>&#128269;</p>
                                        </div>
                                        <img src={Envelope} alt="Envelope" className={style.smallIcons} />
                                        <img src={Bell} alt="Bell" className={style.smallIcons} />
                                        <img src={Filter} alt="Filter" className={style.filterIcon} />
                                    </div>
                                </div>
                                <div>
                                    <div className={`${style.tableHeaderTerminatedCustomer} ${style.marginTop20}`}>
                                        <Checkbox />
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>CUSTOMER</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>TYPE OF CUSTOMER</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>CITY</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>STATE</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>TYPE</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>REASON</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>LAST UPDATED/ TERMINATION DATE</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>LAST UPDATED BY</p>
                                        <p className={style.tableHeaderFontStyleActiveCustomer}>PARTNER</p>
                                    </div>
                                    <div className={`${style.tableDataTerminatedCustomer}`}>
                                        <div className={`${style.displayInRow}`}>
                                            <Checkbox />
                                            <div className={`${style.red} ${style.redDotStyle} ${style.marginTop20}`}></div>
                                        </div>
                                        <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>lorem Ipsum</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Healthcare</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>lorem</p>
                                        <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>NY</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>terminated</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Subscription Expired</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>07/19/2019</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Lorem</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Lorem</p>
                                    </div>
                                    <div className={`${style.tableDataTerminatedCustomer}`}>
                                        <div className={`${style.displayInRow}`}>
                                            <Checkbox />
                                            <div className={`${style.yellow} ${style.yellowDotStyle} ${style.marginTop20}`}></div>
                                        </div>
                                        <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>lorem Ipsum</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Healthcare</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>lorem</p>
                                        <p className={`${style.tableDataFontStyleActiveCustomers} ${style.marginLeft30}`}>NY</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>terminated</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Subscription Expired</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>07/19/2019</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Lorem</p>
                                        <p className={style.tableDataFontStyleActiveCustomers}>Lorem</p>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                        <div className={style.displayInRow}>
                                        <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                        <img src={ChevronRight} className={style.roundChevron} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.spaceBetween}>                        
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
            </div>
        </Fragment>
    )
}

export default TerminatedCustomers;