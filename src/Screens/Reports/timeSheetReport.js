import React, { useState } from 'react';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Reject from './../../images/reject-report.png';
import Request from './../../images/request-report.png';
import TemplateIcon from './../../images/templateIcon.png';
import style from './index.module.scss';

const TimeSheetReports = ({getShowSampleReport}) => {
    const [tabName, setTabName] = useState('Standard Templates');
    return(
        <div className={style.margin20}>
            <div className={style.bigCardGrid}>
                <div>
                    <div className={style.cardStyle}>
                        <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                            <div className={style.displayInRow}>
                                <img src={UserLogo} className={style.userLogo} />
                                <div className={`${style.marginLeft10} ${style.marginTop}`}>
                                    <div className={style.userNameStyle}>
                                        Hi, Ronald Jones, MD
                                    </div>
                                    <div className={style.loginStatus}>
                                        last login DEC 4,21 11:48 am
                                    </div>
                                </div>
                            </div>
                            <img src={ChevronRight} className={style.roundChevronForUser} />
                        </div>
                    </div>
                </div>
                <div className={style.bigCardStyle}>
                    <div className={style.paginationCol}>
                        <div className={` ${style.titleStyle} ${style.margin20}`}>{tabName === "Standard Templates" ? 'Services / Activities Log Reports' : "Timesheet Management Reports"}</div>
                        <div className={`${style.spaceBetween} ${style.margin20}`}>
                            <div className={style.displayInRow}>
                                <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                <img src={ChevronRight} className={style.roundChevron} />
                            </div>
                            <select
                                name="sort"
                                id="sort"
                                className={style.selectFieldWidth}>
                                <option value="Sort By" >
                                    Sort By
                                </option>
                            </select>
                            <select
                                name="action"
                                id="action"
                                className={style.selectFieldWidth}>
                                <option value="Action" >
                                    Action
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className={style.reportsBorderStyle}></div>
                    <div className={`${style.reportsMargin20} ${style.spaceBetween} ${style.borderBottomReportsStyle}`}>
                        <div className={`${style.reportsTabWidth} ${tabName === "Standard Templates" && style.selectedReportsTab}`}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => setTabName('Standard Templates')}>
                                    <img src={TemplateIcon} alt="template" className={style.iconStyle} />
                                    <p className={`${style.taskFontStyle} ${tabName === "Standard Templates" && style.selectedStyle}`}>Standard Templates</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.reportsTabWidth} ${tabName === "My Reports" && style.selectedReportsTab} `}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => setTabName('My Reports')}>
                                    <img src={Reject} alt="reject" className={style.iconStyle} />
                                    <p className={`${style.taskFontStyle} ${tabName === "My Reports" && style.selectedStyle}`}>My Reports</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.reportsTabWidth} ${tabName === "Saved Report Outputs" && style.selectedReportsTab}`}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => setTabName('Saved Report Outputs')}>
                                    <img src={Reject} alt="req" className={style.iconStyle} />
                                    <p className={`${style.taskFontStyle} ${tabName === "Saved Report Outputs" && style.selectedStyle}`}>Saved Report Outputs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {tabName === "Standard Templates" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            <div className={style.reportsTableGrid}>
                                <p className={style.headingStyle}>S.No</p>
                                <p className={style.headingStyle}>Report Type</p>
                                <p className={style.headingStyle}>Description</p>
                                <p className={style.headingStyle}>Last Run Date/ Time</p>
                                {/* <p className={style.headingStyle}>Schedule</p>
                                <p className={style.headingStyle}>Owner</p> */}
                                <p className={style.headingStyle}>Last Updated</p>
                            </div>
                            <div className={style.scrollStyle}>
                                <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                    <div className={style.tableDataReportsFontStyle}>1</div>
                                    <div className={style.tableDataReportsFontStyle}>Contracted Services/ activities performed summary statistics</div>
                                    <div className={style.tableDataReportsFontStyle}>Contracted Services/ activities performed summary statistics</div>
                                    <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                    <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                    <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`} onClick={() => getShowSampleReport(true)}>Run</div>
                                </div>
                                <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                    <div className={style.tableDataReportsFontStyle}>2</div>
                                    <div className={style.tableDataReportsFontStyle}>Services/ Activities Completion status summary</div>
                                    <div className={style.tableDataReportsFontStyle}>Services/ Activities Completion status summary</div>
                                    <div className={style.tableDataReportsFontStyle}>Feb 11 2022, 18:09 </div>
                                    <div className={style.tableDataReportsFontStyle}>Feb 11 2022</div>
                                    <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`} onClick={() => getShowSampleReport(true)}>Run</div>
                                </div>
                                <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                    <div className={style.tableDataReportsFontStyle}>3</div>
                                    <div className={style.tableDataReportsFontStyle}>Add-on services/ activity request summary</div>
                                    <div className={style.tableDataReportsFontStyle}>Add-on services/ activity request summary</div>
                                    <div className={style.tableDataReportsFontStyle}>Feb 15 2022, 03:40 </div>
                                    <div className={style.tableDataReportsFontStyle}>Feb 15 2022</div>
                                    <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`} onClick={() => getShowSampleReport(true)}>Run</div>
                                </div>
                            </div>
                        </div>
                    ) : tabName === "My Reports" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            <div className={style.timeSheetTableGrid}>
                                <p className={style.headingStyle}>S.No</p>
                                <p className={style.headingStyle}>Report Type</p>
                                <p className={style.headingStyle}>Description</p>
                                <p className={style.headingStyle}>Last Run Date</p>
                                <p className={style.headingStyle}>Schedule</p>
                                <p className={style.headingStyle}>Owner</p>
                                <p className={style.headingStyle}>Last Updated</p>
                            </div>
                            <div className={style.scrollStyle}>
                                <div className={`${style.timeSheetTableGrid} ${style.marginTop20}`}>
                                    <div className={style.tableDataReportsFontStyle}>1</div>
                                    <div className={style.tableDataReportsFontStyle}>Report Type 1</div>
                                    <div className={style.tableDataReportsFontStyle}>Description</div>
                                    <div className={style.tableDataReportsFontStyle}>Jan 1 - Jan 31 </div>
                                    <div className={style.tableDataReportsFontStyle}>Schedule</div>
                                    <div className={style.tableDataReportsFontStyle}>Martin Tindale, MD</div>
                                    <div className={style.tableDataReportsFontStyle}>30 Dec 2021</div>
                                    <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`} onClick={() => getShowSampleReport(true)}>Run</div>
                                </div>
                            </div>
                        </div>
                    ) : tabName === "Saved Report Outputs" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            <div className={style.timeSheetTableGrid}>
                                <p className={style.headingStyle}>S.No</p>
                                <p className={style.headingStyle}>Report Type</p>
                                <p className={style.headingStyle}>Description</p>
                                <p className={style.headingStyle}>Last Run Date</p>
                                <p className={style.headingStyle}>Schedule</p>
                                <p className={style.headingStyle}>Owner</p>
                                <p className={style.headingStyle}>Last Updated</p>
                            </div>
                            <div className={style.scrollStyle}>
                                <div className={`${style.timeSheetTableGrid} ${style.marginTop20}`}>
                                    <div className={style.tableDataReportsFontStyle}>1</div>
                                    <div className={style.tableDataReportsFontStyle}>Report Type 1</div>
                                    <div className={style.tableDataReportsFontStyle}>Description</div>
                                    <div className={style.tableDataReportsFontStyle}>Jan 1 - Jan 31 </div>
                                    <div className={style.tableDataReportsFontStyle}>Schedule</div>
                                    <div className={style.tableDataReportsFontStyle}>Martin Tindale, MD</div>
                                    <div className={style.tableDataReportsFontStyle}>30 Dec 2021</div>
                                    <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`} onClick={() => getShowSampleReport(true)}>Run</div>
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </div>
        </div>
    )
}

export default TimeSheetReports;