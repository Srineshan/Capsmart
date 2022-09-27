import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Checkbox } from '@blueprintjs/core';
import Navbar from './../../Components/Navbar';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import {Link} from 'react-router-dom';
import PrintIcon from './../../images/printIcon.png';
import Filter from './../../images/filter.png';
import Bell from './../../images/bell.png';
import Terminate from './../../images/terminate.png';
import Clone from './../../images/clone.png';
import RedPage from './../../images/redPage.png';
import YellowPage from './../../images/yellowPage.png';
import ThreeDot from './../../images/threeDot.png';
import GreenPage from './../../images/greenPage.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';
import RedWarning from './../../images/redWarning.png';
import ContractExtension from './../../images/contractExtension.png';
import ProgressBar from "@ramonak/react-progress-bar";
import style from './index.module.scss';

const TasksAndAlerts = () => {
    const [viewToDo, setViewToDo] = useState(true);

    return(
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={`${style.grid5}`}>
                    <div className={style.cardStyle}>
                        <div className={`${style.displayInRow} ${style.alignCenter}`}>
                            <img src={UserLogo} className={style.userLogo} />
                            <div className={style.marginLeft20}>
                                <div className={style.userNameStyle}>
                                    User
                                </div>
                                <div className={style.loginStatus}>
                                    last login DEC 4,21 11:48 am
                                </div>
                            </div>
                            <img src={ChevronRight} className={style.chevronRightStyle}/>
                        </div>
                    </div>
                    <Link to={'/activeCustomers'} className={style.linkStyle}>
                        <div className={`${style.cardStyle} ${style.selectedContractBackground}`}>
                            <h5 className={`${style.headingForContracts}`}>CUSTOMERS & PROSPECTS</h5>
                            <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}>
                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                    <span className={style.displayInRow}><p className={style.headingCountForContracts}>110 </p> ACTIVE CUSTOMERS</span>
                                    <span className={style.displayInRow}><p className={`${style.yellow} ${style.headingCountForContracts}`}>12 </p> ON GOING TRIALS</span>
                                </div>
                                <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
                                    <span><span className={style.red}>1 </span> TRIAL EXPIRING</span>
                                    <span><span className={style.red}>1 </span> UPCOMING RENEWAL</span>
                                    <span><span className={style.green}>1 </span> AUTO RENEWED</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <Link to={'/user'} className={style.linkStyle}>
                        <div className={style.cardStyle} >
                            <h5 className={`${style.headingForContracts}`}>REGISTERED USERS</h5>
                            <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}>
                                <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                    <span className={style.displayInRow}><p className={style.headingCountForContracts}>22376 </p> REGISTERED USERS</span>
                                    <span className={style.displayInRow}><p className={`${style.yellow} ${style.headingCountForContracts}`}>14 </p> TRIAL USERS</span>
                                </div>
                                <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
                                    <span className={style.displayInRow}><span className={`${style.red} ${style.marginRight}`}>1 </span> BLOCKED</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <div className={style.cardStyle} >
                        <h5 className={style.headingForContracts}>AT RISK SUBSCRIPTIONS</h5>
                        <div className={`${style.spaceBetween} ${style.marginTop20} ${style.marginRight}`}>
                            <div className={`${style.optionsStyle} ${style.displayInCol}`}>
                                <span className={style.displayInRow}><p className={`${style.headingCountForContracts} ${style.red}`}>5 </p> EXPIRED</span>
                                <span className={style.displayInRow}><p className={`${style.yellow} ${style.headingCountForContracts}`}>14 </p>NO ACTIVITY IN LAST 30 DAYS</span>
                            </div>
                            <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
                                <span>AT RISK</span>
                                <span className={`${style.red} ${style.displayInRow}`}><span className={style.marginRight}>$ </span>30,050</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.cardStyle}>
                        <h5 className={`${style.headingForContracts}`}>PRIORITY FEEDBACK TICKETS</h5>
                        <div className={`${style.spaceBetween} ${style.marginTop30}`}>
                            <div className={`${style.optionsStyle} ${style.displayInColRev}`}>
                                <span className={style.displayInRow}><p className={style.headingCountForContracts}>25 </p> TOTAL TICKETS</span>
                            </div>
                            <div className={`${style.optionsStyle} ${style.displayInColRev} ${style.marginLeft30}`}>
                                <span><span className={style.red}>8 </span> PAST DUE</span>
                                <span><span className={style.red}>9 </span> HIGH PRIORITY</span>
                                <span><span className={style.red}>13 </span> EXCEPTION ERRORS</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.bigCardGrid}>
                    <div className={`${style.bigCardStyleEntryPage} ${style.bigCalendarLeftCardWidth}`}>
                        <h5 className={style.statisticsHeading}>February 2022 Summary Statistics</h5>
                        <div className={style.scrollStyle}>
                            <h5 className={`${style.textAlignLeft} ${style.sideBarHeadingStyle}`}>To Do Status</h5>
                            <div className={style.progressbarStyle}>
                                <div className={style.spaceBetween}>
                                    <p className={style.statisticsProgress}><strong>13</strong> <span className={style.marginLeft20}>NEW</span></p>
                                    <p className={style.viewStyle}>View</p>
                                </div>
                                <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#948BEA' baseBgColor="#ebe9fb" className={style.progressMargin} />
                            </div>
                            <div className={style.progressbarStyle}>
                                <div className={style.spaceBetween}>
                                    <p className={style.statisticsProgress}><strong>32</strong> <span className={style.marginLeft20}>IN-PROGRESS</span></p>
                                    <p className={style.viewStyle}>View</p>
                                </div>
                                <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FEC106' baseBgColor="#fff2cc" className={style.progressMargin} />
                            </div>
                            <div className={style.progressbarStyle}>
                                <div className={style.spaceBetween}>
                                    <p className={style.statisticsProgress}><strong>50</strong> <span className={style.marginLeft20}>PAST DUE</span></p>
                                    <p className={style.viewStyle}>View</p>
                                </div>
                                <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                            </div>
                            <h5 className={`${style.textAlignLeft} ${style.sideBarHeadingStyle}`}>Priority Status</h5>
                            <div className={style.progressbarStyle}>
                                <div className={style.spaceBetween}>
                                    <p className={style.statisticsProgress}><strong>13</strong> <span className={style.marginLeft20}>HIGH</span></p>
                                    <p className={style.viewStyle}>View</p>
                                </div>
                                <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                            </div>
                            <div className={style.progressbarStyle}>
                                <div className={style.spaceBetween}>
                                    <p className={style.statisticsProgress}><strong>32</strong> <span className={style.marginLeft20}>LOW</span></p>
                                    <p className={style.viewStyle}>View</p>
                                </div>
                                <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FEC106' baseBgColor="#fff2cc" className={style.progressMargin} />
                            </div>
                            <div className={style.progressbarStyle}>
                                <div className={style.spaceBetween}>
                                    <p className={style.statisticsProgress}><strong>50</strong> <span className={style.marginLeft20}>MEDIUM</span></p>
                                    <p className={style.viewStyle}>View</p>
                                </div>
                                <ProgressBar completed={60} isLabelVisible={false} height='5px' bgColor='#FF6562' baseBgColor="#ffcdcc" className={style.progressMargin} />
                            </div>
                        </div>
                        <img src={PageFooterIcon} alt="footer" className={style.footerIconStyle} />
                    </div>
                    <div className={style.bigCardStyleEntryPage}>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <p className={`${style.marginLeft30} ${style.activeContractsWidth}`}>{`{{Today Date}}`}</p>
                            <div className={`${style.displayInRow}`}>
                                <div className={style.searchBarStyle}>
                                    <p>Search here</p>
                                    <p className={style.marginRight}>&#128269;</p>
                                </div>
                                <img src={Bell} alt="Bell" className={style.smallIcons} />
                                <img src={Filter} alt="Filter" className={style.filterIcon} />
                            </div>
                        </div>
                        <div className={style.buttonGroupUsers}>
                            <button className={viewToDo && style.registeredButton} onClick={() => setViewToDo(true)}>To Do Tasks ( 8 )</button>
                            <button className={!viewToDo ? style.registeredButton : style.redText} onClick={() => setViewToDo(false)}>Alerts ( 16 )</button>
                        </div>
                        {viewToDo ? (
                        <div>
                            <div className={`${style.tableHeaderToDo} ${style.marginTop40}`}>
                                <p className={`${style.checkBoxHeader} ${style.marginLeft30}`}></p>
                                <p className={`${style.tableHeaderFontStyleToDo}`}> Task Id</p>
                                <p className={style.tableHeaderFontStyleToDo}> Task Type</p>
                                <p className={`${style.tableHeaderFontStyleToDo} ${style.width20Percent}`}>Subject / Reference</p>
                                <p className={style.tableHeaderFontStyleToDo}>Action Required</p>
                                <p className={style.tableHeaderFontStyleToDo}>Due Date</p>
                                <p className={style.tableHeaderFontStyleToDo}> Assign To</p>
                                <p className={style.tableHeaderFontStyleToDo}>Last Updated</p>
                                <p className={style.tableHeaderFontStyleToDo}>Last Updated By</p>
                            </div>
                            <div className={`${style.tableDataToDo} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription Renewal</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Customer Contract Ref ID and Name </p>
                                <p className={style.tableDataFontStyleToDo}>Renew Contract</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ryan Jung</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={`${style.tableData} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.width10} ${style.marginLeft30}`}>
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                    <img src={RedWarning} alt="warning" className={style.colorIconsStyle} />
                                </div>
                                <p className={style.tableDataFontStyleToDo}>1243532</p>
                                <p className={style.tableDataFontStyleToDo}>Subscription</p>
                                <p className={`${style.tableDataFontStyleToDo} ${style.width20Percent}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleToDo}>Lorem Ipsum</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                                <p className={style.tableDataFontStyleToDo}>07/19/2019</p>
                                <p className={style.tableDataFontStyleToDo}>Ronald Jones, MD</p>
                            </div>
                            <div className={style.spaceBetween}>
                                <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                <div className={style.displayInRow}>
                                <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                <img src={ChevronRight} className={style.roundChevron} />
                                </div>
                            </div>
                        </div>
                        ) : (
                          <div>
                            <div className={`${style.tableHeaderToDo} ${style.marginTop40}`}>
                                <Checkbox className={`${style.checkBoxHeader} ${style.marginTop20}`} />
                                <p className={`${style.tableHeaderFontStyleToDo} ${style.width15Percent}`}> Alert Type</p>
                                <p className={`${style.tableHeaderFontStyleToDo} ${style.width15Percent}`}> Subject</p>
                                <p className={`${style.tableHeaderFontStyleToDo} ${style.width30Percent}`}>Description</p>
                                <p className={style.tableHeaderFontStyleToDo}>Action</p>
                            </div>
                            <div className={`${style.tableDataToDo} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.marginLeft30} ${style.marginTop20}`}>
                                    <Checkbox className={`${style.checkBoxHeader}`} />
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                </div>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width15Percent} ${style.marginLeft30}`}>Timesheet </p>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width15Percent} ${style.marginLeft30}`}>Rejected</p>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width30Percent} ${style.marginLeft30}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleAlerts}></p>
                            </div>
                            <div className={`${style.tableDataToDo} ${style.displayInRow} ${style.alternativeBackgroundStyle}`}>
                                <div className={`${style.displayInRow} ${style.marginLeft30} ${style.marginTop20}`}>
                                    <Checkbox className={`${style.checkBoxHeader}`} />
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                </div>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width15Percent} ${style.marginLeft30}`}>Timesheet </p>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width15Percent} ${style.marginLeft30}`}>Rejected</p>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width30Percent} ${style.marginLeft30}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleAlerts}></p>
                            </div>
                            <div className={`${style.tableDataToDo} ${style.displayInRow}`}>
                                <div className={`${style.displayInRow} ${style.marginLeft30} ${style.marginTop20}`}>
                                    <Checkbox className={`${style.checkBoxHeader}`} />
                                    <div className={`${style.green} ${style.greenDotStyle}`}></div>
                                </div>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width15Percent} ${style.marginLeft30}`}>Timesheet </p>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width15Percent} ${style.marginLeft30}`}>Rejected</p>
                                <p className={`${style.tableDataFontStyleAlerts} ${style.width30Percent} ${style.marginLeft30}`}>Lorem Ipsum </p>
                                <p className={style.tableDataFontStyleAlerts}></p>
                            </div>
                          </div>
                        )}
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

export default TasksAndAlerts;
