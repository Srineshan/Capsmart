import React, { useEffect, useState } from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import Reject from './../../images/reject-report.png';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import Request from './../../images/request-report.png';
import Popover from '@mui/material/Popover';
import TemplateIcon from './../../images/templateIcon.png';
import style from './index.module.scss';
import { Link, useParams } from 'react-router-dom';
import { GET } from '../dataSaver';
import { format } from 'date-fns';

export const Run = ({link}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        console.log('entered')
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        console.log('leave')
        setAnchorEl(null);
    };

    return(
        <div onMouseEnter={(e) => handleClick(e)} onMouseLeave={() => handleClose()} aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true">
            <Link to={link} className={style.linkStyle}>
                <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`}>Run</div>
                <Popover
                    id={'mouse-over-popover'}
                    sx={{
                        pointerEvents: 'none',
                      }}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    disableRestoreFocus
                >
                    <div className={style.popoverStyle}>Click to Generate this Report</div>
                </Popover>
            </Link>
        </div>
    )
}

const TimeSheetReports = ({getShowSampleReport}) => {
    const [tabName, setTabName] = useState('Standard Report Templates');
    const {reportType} = useParams();
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(user?.id);

    useEffect(() => {
        setUserId(user?.id);
        setUserDetails();
    }, [])

    const setUserDetails = async() => {
        const {data: user} = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
    }
    return(
        <div className={style.margin20}>
            <div className={style.bigCardGrid}>
                <div>
                    <div className={style.cardStyle}>
                        <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                            <div className={style.displayInRow}>
                                <img src={DoctorAnime} className={style.userLogo} />
                                <div className={`${style.marginLeft10} ${style.marginTop}`}>
                                    <div className={style.userNameStyle}>
                                        Hi, {user?.userName}
                                    </div>
                                    <div className={style.loginStatus}>
                                        last login {format(new Date(currentUserDetails?.lastLogin || new Date()), 'MMM d,yy h:mm a')}
                                    </div>
                                </div>
                            </div>
                            <img src={ChevronRight} className={style.roundChevronForUser} />
                        </div>
                    </div>
                </div>
                <div className={style.bigCardStyle}>
                    <div className={style.paginationCol}>
                        <div className={` ${style.titleStyle} ${style.margin20}`}>
                        {reportType === 'servicesOrActivities' ? 'Services / Activities Log Reports'
                        : reportType === 'timesheets' ? 'Timesheets'
                        : reportType === 'reviewsAndApprovals' ? 'Reviews & Approval'
                        : reportType === 'taskManagement' ? 'Task Management'
                        : reportType === 'payments' ? 'Payments'
                        : reportType === 'contractManagement' ? 'Contract Management'
                        : reportType === 'contractCompliance' ? 'Contract Compliance'
                        : reportType === 'contractPerformance' ? 'Contract Performance'
                        : reportType === 'systemAdministration' ? 'System Administration'
                        : ""}
                        </div>
                        {/* <div className={`${style.spaceBetween} ${style.margin20}`}>
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
                        </div> */}
                    </div>
                    <div className={style.reportsBorderStyle}></div>
                    <div className={`${style.reportsMargin20} ${style.spaceBetween} ${style.borderBottomReportsStyle}`}>
                        <div className={`${style.reportsTabWidth} ${tabName === "Standard Report Templates" && style.selectedReportsTab}`}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => setTabName('Standard Report Templates')}>
                                    <img src={TemplateIcon} alt="template" className={style.iconStyle} />
                                    <p className={`${style.taskFontStyle} ${tabName === "Standard Report Templates" && style.selectedStyle}`}>Standard Report Templates</p>
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
                    {tabName === "Standard Report Templates" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            <div className={style.reportsTableGrid}>
                                <p className={style.headingStyle}>No.</p>
                                <p className={style.headingStyle}>Report Title</p>
                                <p className={style.headingStyle}>Description</p>
                                <p className={style.headingStyle}>Last Run Date/ Time</p>
                                <p className={style.headingStyle}>Last Updated By</p>
                                {/* <p className={style.headingStyle}>Owner</p> */}
                                <p className={style.headingStyle}>Updated</p>
                            </div>
                            {reportType === 'servicesOrActivities' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/activitiesOrServices" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Run link={"/reportTypeOverview/activitiesOrServices"} />
                                    </div>
                                    {/* <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/addOnActivities" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022, 18:09 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022</div>
                                        <Run link={"/reportTypeOverview/addOnActivities"} />
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>3</div>
                                        <Link to="/reportTypeOverview/scheduledActivity" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forcasted to actual</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forcasted to actual</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 15 2022, 03:40 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 15 2022</div>
                                        <Run link={"/reportTypeOverview/scheduledActivity"} />
                                    </div> */}
                                </div>
                            ) : reportType === 'contractManagement' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/upcomingContractRenewals" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Upcoming Contract Renewals</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Upcoming Contract Renewals</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Run link={"/reportTypeOverview/upcomingContractRenewals"} />
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/oneTimeContract" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>List of One Time Contracts that will Terminate on Expiration</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>List of One Time Contracts that will Terminate on Expiration</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Run link={"/reportTypeOverview/oneTimeContract"} />
                                    </div>
                                </div>
                            ) : reportType === 'contractCompliance' ? (
                                <div className={style.scrollStyle}>
                                    {/* <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/complianceStatus" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Contract Based Proof of Documentation Compliance Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Contract Based Proof of Documentation Compliance Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Run link={"/reportTypeOverview/complianceStatus"} />
                                    </div> */}
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/nonCompliant" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>List Of Contracts That Are Non Compliant With Proof Of Documentation Requirement</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>List Of Contracts That Are Non Compliant With Proof Of Documentation Requirement</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022, 18:09 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022</div>
                                        <Run link={"/reportTypeOverview/nonCompliant"} />
                                    </div>
                                </div>
                            ) : reportType === 'contractPerformance' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        {/* <Link to="/reportTypeOverview/complianceStatus" className={style.linkStyle}> */}
                                            <div className={style.tableDataReportsFontStyle}>Paid Consulting Hours & Billing Productivity Index by Contractor</div>
                                        {/* </Link> */}
                                        <div className={style.tableDataReportsFontStyle}>Paid Consulting Hours & Billing Productivity Index by Contractor</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Run link={"/reportTypeOverview/complianceStatus"} />
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/scheduledActivityByContract" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forecasted to actual by contract</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forecasted to actual by contract</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20  </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Run link={"/reportTypeOverview/scheduledActivityByContract"} />
                                    </div>
                                </div>
                            ) : (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/activitiesOrServices" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Run link={"/reportTypeOverview/activitiesOrServices"} />
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/addOnActivities" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022, 18:09 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022</div>
                                        <Run link={"/reportTypeOverview/addOnActivities"} />
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>3</div>
                                        <Link to="/reportTypeOverview/scheduledActivity" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forcasted to actual</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forcasted to actual</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 15 2022, 03:40 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 15 2022</div>
                                        <Run link={"/reportTypeOverview/scheduledActivity"} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : tabName === "My Reports" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            <div className={style.timeSheetTableGrid}>
                                <p className={style.headingStyle}>No.</p>
                                <p className={style.headingStyle}>Report Title</p>
                                <p className={style.headingStyle}>Description</p>
                                <p className={style.headingStyle}>Last Run Date</p>
                                <p className={style.headingStyle}>Schedule</p>
                                <p className={style.headingStyle}>Owner</p>
                                <p className={style.headingStyle}>Last Updated</p>
                            </div>
                            <div className={style.scrollStyle}>
                                <div className={`${style.timeSheetTableGrid} ${style.marginTop20}`}>
                                    <div className={style.tableDataReportsFontStyle}>1</div>
                                    <div className={style.tableDataReportsFontStyle}>Report Title 1</div>
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
                            <div className={style.savedReportTableGrid}>
                                <p className={style.headingStyle}>No.</p>
                                <p className={style.headingStyle}>Report Output Name</p>
                                <p className={style.headingStyle}>Notes</p>
                                <p className={style.headingStyle}>Run Date</p>
                            </div>
                            <div className={style.scrollStyle}>
                                <div className={`${style.savedReportTableGrid} ${style.marginTop20}`}>
                                    <div className={style.tableDataReportsFontStyle}>1</div>
                                    <div className={style.tableDataReportsFontStyle}>Report Name</div>
                                    <div className={style.tableDataReportsFontStyle}>Notes</div>
                                    <div className={style.tableDataReportsFontStyle}>30 Dec 2021</div>
                                    <div className={`${style.reportStyle} ${style.redCard} ${style.cursorPointer}`}>Delete</div>
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
