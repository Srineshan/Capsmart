import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Navbar from '../../../Components/Navbar';
import style from './index.module.scss';
import SideBar from '../../../Components/Sidebar';
import { format } from 'date-fns';
import LeftCard from './leftCard';
import FunnelChart from '../../Reports/chart-data/funnelChart';
import ApexStackedBarChart from '../../Reports/chart-data/stackedBarChart';
import DonutChart from '../../Reports/chart-data/donutChart';
import ApexBarChart from '../../Reports/chart-data/barChart';
import CalendarIcon from './../../../images/calendar.svg'
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import GaugeWithNeedle from '../../Reports/chart-data/gaugeChart';
import SemiCircleGauge from '../../Reports/chart-data/semiCircleGauge';
import { GET } from '../../dataSaver';
import SpeedometerChart from '../../Reports/chart-data/speedometerChart';
import { Tooltip } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import { dataLoadingGIF } from '../../../utils/formatting';


const MDDashboard = () => {
    const componentRef = useRef(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [dataToUseInReport, setDataToUseInReport] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [applicationDashboard, setApplicationDashboard] = useState();
    const [funnelSeries, setFunnelSeries] = useState([])
    const [funnelSeriesPercentage, setFunnelSeriesPercentage] = useState([])
    const [stackedSeries, setStackedSeries] = useState([]);
    const [stackedCategories, setStackedCategories] = useState([]);
    const [barChartSeries, setBarChartSeries] = useState([]
    );
    const [barChartCategories, setBarChartCategories] = useState(['']);
    const mapping = {
        completed: "Completed",
        inProgress: "In - Progress",
        pastDue: "Past Due",
        rejected: "Declined / Rejected / Not Recommended",
        notYetStarted: "Not Yet Started"
    };

    const roleLabels = {
        applicant: "Completed Application",
        staffManager: "MSO Verified",
        departmentHead: "Departmental Review",
        chiefOfStaff: "Chief Of Staff Review",
        credentialingCommittee: "Cred. Comm. Review",
        advisoryCommittee: "MAC Approval",
        board: "BOD Approval"
    };

    const transformed = Object.values(mapping).map(label => ({
        name: label,
        data: []
    }));

    useEffect(() => {
        setIsLoading(true)
        if (dataToUseInReport?.initialValueSet && ((dataToUseInReport?.selectedDepartments?.length !== 1 ? !dataToUseInReport?.selectedDepartments?.includes('') : true) && (dataToUseInReport?.selectedStaffType?.length !== 1 ? !dataToUseInReport?.selectedStaffType?.includes('') : true) && (dataToUseInReport?.selectedPrivilegeCategory?.length !== 1 ? !dataToUseInReport?.selectedPrivilegeCategory?.includes('') : true))) {
            const controller = new AbortController(); // Create an AbortController instance
            const signal = controller.signal;
            getDashboard(signal);
            return () => controller.abort();
        }
    }, [dataToUseInReport?.selectedPrivilegeCategory, dataToUseInReport?.selectedStaffType, dataToUseInReport?.selectedDepartments, dataToUseInReport?.initialValueSet])


    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const getDataToUseInReport = (value) => {
        setDataToUseInReport(value);
    }

    const getDashboard = async (signal) => {
        setIsLoading(true);
        const { data: dashboard } = await GET(`application-management-service/report/staffReappointment/dashboard?applicantTypeId=${dataToUseInReport?.selectedStaffType}&privilegingCategoryId=${dataToUseInReport?.selectedPrivilegeCategory}&departmentSpecialties=${dataToUseInReport?.selectedDepartments}`, { signal });
        let tempFunnel = [{
            name: 'Reappointments',
            data: [
                { x: 'Permanent Staff Eligible', y: dashboard?.reappointmentMetrics?.eligibleForReappointment?.count, z: dashboard?.reappointmentMetrics?.eligibleForReappointment?.percentage },
                { x: 'Reappointment Applications', y: dashboard?.staffReappointmentStats?.applicationsCreated?.count, z: dashboard?.staffReappointmentStats?.applicationsCreated?.percentage },
                { x: 'Completed Application', y: dashboard?.staffReappointmentStats?.applicationsSubmitted?.count, z: dashboard?.staffReappointmentStats?.applicationsSubmitted?.percentage },
                { x: 'MSO Verified', y: dashboard?.staffReappointmentStats?.staffManager?.count, z: dashboard?.staffReappointmentStats?.staffManager?.percentage },
                { x: 'Departmental Review', y: dashboard?.staffReappointmentStats?.departmentHead?.count, z: dashboard?.staffReappointmentStats?.departmentHead?.percentage },
                { x: 'Cred. Comm. Review', y: dashboard?.staffReappointmentStats?.credentialingCommittee?.count, z: dashboard?.staffReappointmentStats?.credentialingCommittee?.percentage },
                { x: 'MAC Approval', y: dashboard?.staffReappointmentStats?.advisoryCommittee?.count, z: dashboard?.staffReappointmentStats?.advisoryCommittee?.percentage },
                { x: 'BOD Approval', y: dashboard?.staffReappointmentStats?.board?.count, z: dashboard?.staffReappointmentStats?.board?.percentage }
            ]
        }]
        let tempStackedBar = Object?.keys(dashboard?.reviewAndVerificationStats || {});

        tempStackedBar?.forEach(data => {
            const roleData = dashboard?.reviewAndVerificationStats[data]?.countByStatus;

            Object?.entries(mapping).forEach(([key, label]) => {
                const series = transformed.find(s => s.name === label);
                const value = roleData?.[key]?.count ?? 0; // fallback to 0 if null
                series.data.push(value);
            });
        });
        const categories = tempStackedBar?.map(data => roleLabels[data] || data);
        setFunnelSeries(tempFunnel);
        setApplicationDashboard(dashboard)
        console.log(tempStackedBar, transformed)
        setStackedSeries(transformed)
        setStackedCategories(categories)
        let barTemp = {
            name: "Completed",
            data: dashboard?.workingDaysPerSubmittedApplications?.workingDaysPerSubmittedApplication?.map(data => data?.workingDays)
        }
        setBarChartSeries([barTemp])
        setIsLoading(false);
    }

    const getApplicationStatusSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.applicationStatus?.accepted?.count || 0, applicationDashboard?.applicationStatus?.notYetStarted?.count || 0, applicationDashboard?.applicationStatus?.declined?.count || 0]
        } else return []
    }

    const getApplicationStatusLabels = () => {
        if (applicationDashboard) {
            return ['Submitted', 'Not Yet Started', 'Declined']
        } else return []
    }

    const getMSOReviewSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.reviewAndVerificationStats?.staffManager?.countByStatus?.completed?.count || 0, applicationDashboard?.reviewAndVerificationStats?.staffManager?.countByStatus?.rejected?.count || 0, applicationDashboard?.reviewAndVerificationStats?.staffManager?.countByStatus?.notYetStarted?.count || 0, applicationDashboard?.reviewAndVerificationStats?.staffManager?.countByStatus?.inProgress?.count || 0, applicationDashboard?.reviewAndVerificationStats?.staffManager?.countByStatus?.pastDue?.count || 0]
        } else return []
    }

    const getDeptHeadReviewSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.reviewAndVerificationStats?.departmentHead?.countByStatus?.completed?.count || 0, applicationDashboard?.reviewAndVerificationStats?.departmentHead?.countByStatus?.rejected?.count || 0, applicationDashboard?.reviewAndVerificationStats?.departmentHead?.countByStatus?.notYetStarted?.count || 0, applicationDashboard?.reviewAndVerificationStats?.departmentHead?.countByStatus?.inProgress?.count || 0, applicationDashboard?.reviewAndVerificationStats?.departmentHead?.countByStatus?.pastDue?.count || 0]
        } else return []
    }

    const getCCReviewSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.reviewAndVerificationStats?.credentialingCommittee?.countByStatus?.completed?.count || 0, applicationDashboard?.reviewAndVerificationStats?.credentialingCommittee?.countByStatus?.rejected?.count || 0, applicationDashboard?.reviewAndVerificationStats?.credentialingCommittee?.countByStatus?.notYetStarted?.count || 0, applicationDashboard?.reviewAndVerificationStats?.credentialingCommittee?.countByStatus?.inProgress?.count || 0, applicationDashboard?.reviewAndVerificationStats?.credentialingCommittee?.countByStatus?.pastDue?.count || 0]
        } else return []
    }

    const getMACReviewSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.reviewAndVerificationStats?.advisoryCommittee?.countByStatus?.completed?.count || 0, applicationDashboard?.reviewAndVerificationStats?.advisoryCommittee?.countByStatus?.rejected?.count || 0, applicationDashboard?.reviewAndVerificationStats?.advisoryCommittee?.countByStatus?.notYetStarted?.count || 0, applicationDashboard?.reviewAndVerificationStats?.advisoryCommittee?.countByStatus?.inProgress?.count || 0, applicationDashboard?.reviewAndVerificationStats?.advisoryCommittee?.countByStatus?.pastDue?.count || 0]
        } else return []
    }

    const getBODReviewSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.reviewAndVerificationStats?.board?.countByStatus?.completed?.count || 0, applicationDashboard?.reviewAndVerificationStats?.board?.countByStatus?.rejected?.count || 0, applicationDashboard?.reviewAndVerificationStats?.board?.countByStatus?.notYetStarted?.count || 0, applicationDashboard?.reviewAndVerificationStats?.board?.countByStatus?.inProgress?.count || 0, applicationDashboard?.reviewAndVerificationStats?.board?.countByStatus?.pastDue?.count || 0]
        } else return []
    }

    const getReviewLabels = () => {
        if (applicationDashboard) {
            return ['Completed', 'Rejected', 'Not Yet Started', 'In-Progress', 'Past Due']
        } else return []
    }

    const getRequestForClarificationSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.requestForClarificationStats?.summary?.applicant?.count || 0, 0, 0]
        } else return []
    }

    const getRequestLabels = () => {
        if (applicationDashboard) {
            return ['Applicants', 'Institutes', 'Staffs']
        } else return []
    }

    const getRequestForDocumentsSeries = () => {
        if (applicationDashboard) {
            return [applicationDashboard?.requestForDocumentStats?.summary?.applicant?.count || 0, 0, 0]
        } else return []
    }

    const getDocumentLabels = () => {
        if (applicationDashboard) {
            return ['Applicants', 'Institutes', 'Staffs']
        } else return []
    }

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: `Dashboard_${format(new Date(), 'MM_dd_yy_HH_mm_ss')}`,
        removeAfterPrint: true,
    });

    return (
        <div>
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            <Fragment>
                <Navbar />
                <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20WithoutTop} `}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <LeftCard getDataToUseInReport={getDataToUseInReport} isLoading={isLoading} />
                        </SideBar>
                    </div>
                    <div className={`${style.marginTop20} `}>
                        <div className={style.spaceBetween}>
                            <div></div>
                            <Tooltip title="Click to Print" arrow>
                                <div className={`${style.cursorPointer} ${style.marginRight20}`} onClick={handlePrint}>
                                    <LocalPrintshopOutlinedIcon />
                                </div>
                            </Tooltip>
                        </div>
                        <div ref={componentRef} className={style.margin20WithoutTop}>
                            <div className={`${style.selectedFilterCard}`}>
                                <div className={style.selectedFiltersHeadingText}>{`Medical Directives Dashboard for ${dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}`}</div>
                                <div className={`${style.grid4} ${style.marginTop20}`}>
                                    <div className={style.selectedFiltersText}>Current Date: {format(new Date(), 'MMM dd, yyyy')}</div>
                                    <div className={style.selectedFiltersText}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                    <div className={style.selectedFiltersText}>{dataToUseInReport?.selectedStaffTypeToSend?.map(data => data?.applicantType).join(', ') || 'All Staff Types'}</div>
                                    <div className={style.selectedFiltersText}>{dataToUseInReport?.selectedPrivilegeCategoryToSend?.map(data => data?.category).join(', ') || 'All Privilege Categories'}</div>
                                </div>
                            </div>
                            <div className={`${style.grid4} ${style.marginTop20}`}>
                                <div className={`${style.dashboardTile}`}>
                                    <div className={style.dashboardTileText}>Active Medical Directives</div>
                                    <div className={style.dashboardTileCount}>{applicationDashboard?.reappointmentMetrics?.eligibleForReappointment?.count}</div>
                                </div>
                                <div className={`${style.dashboardTile} ${style.grid2}`}>
                                    <div>
                                        <div className={style.dashboardTileText}>New</div>
                                        <div className={style.topPeriodRangeText}>In Last 30 Days</div>
                                        <div className={`${style.dashboardTileCount}`}>{`${applicationDashboard?.reappointmentMetrics?.applicationsSentOut?.percentage || 0}`}</div>
                                    </div>
                                    <div>
                                        <div className={style.dashboardTileText}>Updates</div>
                                        <div className={style.topPeriodRangeText}>In Last 30 Days</div>
                                        <div className={`${style.dashboardTileCount} `}>{`${applicationDashboard?.reappointmentMetrics?.applicationsSentOut?.percentage || 0}`}</div>
                                    </div>
                                </div>
                                <div className={`${style.dashboardTile}`}>
                                    <div className={style.dashboardTileText}>Medical Directive Update Status</div>
                                    <div className={style.grid3}>
                                        <div>
                                            <div className={`${style.dashboardTileCount}`}>{`${applicationDashboard?.reappointmentMetrics?.applicationsSentOut?.percentage || 0}`}</div>
                                            <div className={style.topPeriodRangeText}>Authoring</div>
                                        </div>
                                        <div>
                                            <div className={`${style.dashboardTileCount} `}>{`${applicationDashboard?.reappointmentMetrics?.applicationsSentOut?.percentage || 0}`}</div>
                                            <div className={style.topPeriodRangeText}>Acknowledgement</div>
                                        </div>
                                        <div>
                                            <div className={`${style.dashboardTileCount} `}>{`${applicationDashboard?.reappointmentMetrics?.applicationsSentOut?.percentage || 0}`}</div>
                                            <div className={style.topPeriodRangeText}>In Review</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style.dashboardTile}`}>
                                    <div className={style.dashboardTileText}>Medical Directives Fully Attested</div>
                                    <div className={style.displayInRow}>
                                        <div className={style.dashboardTileCount}>{applicationDashboard?.reappointmentMetrics?.underReview?.count}</div>
                                        <div className={`${style.dashboardTilePercentage} ${style.marginLeft10}`}>{`${applicationDashboard?.reappointmentMetrics?.applicationsSentOut?.percentage || 0}%`}</div>
                                        <ArrowDropDownIcon sx={{ color: '#FF6562', marginRight: '5px' }} />
                                        <div className={`${style.countChangeRed} ${style.marginLeftReduce10}`}>10</div>
                                        <div className={`${style.topPeriodRangeText} ${style.marginLeft10}`}>From Last week</div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.grid2} ${style.marginTop20}`}>
                                <div className={style.fullHeight}>
                                    <div className={style.chartHeader}>
                                        <div className={style.chartHeaderText}>Medical Directive Authoring Status</div>
                                    </div>
                                    <div className={`${style.chartBody} ${style.fullHeight}`}>
                                        {(stackedSeries?.length > 0 && stackedCategories?.length > 0) && (
                                            <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} horizontal={true} />
                                        )}
                                    </div>
                                </div>
                                <div className={style.fullHeight}>
                                    <div className={`${style.chartHeader} ${style.spaceBetween}`}>
                                        <div className={style.chartHeaderText}>Working Days Per Medical Directive Creation / Authoring</div>
                                        <div className={style.chartHeaderText}>Average days: <span className={style.chartHeaderRightText}>{applicationDashboard?.workingDaysPerSubmittedApplications?.averageWorkingDays}</span></div>
                                    </div>
                                    <div className={`${style.chartBody} ${style.fullHeight}`}>
                                        <ApexBarChart series={barChartSeries} categories={barChartCategories} reportingPeriod={``} yAxisTitle="DAYS" xAxisTitle="Submitted Applications" fullWidth={true} />
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.dashboardTileText} ${style.marginTop20}`}>Medical Directive Attestation</div>

                            <div className={style.marginTop20}>
                                <div className={style.chartHeader}>
                                    <div className={style.chartHeaderText}>Time & Number of Attestations by Staff Type </div>
                                </div>
                                <div className={`${style.chartBody} ${style.reviewGrid}`}>
                                    <div>
                                        <div className={`${style.chartBodyText} ${style.textAlignCenter}`}>Avg. Time To Attestation</div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                position: "relative",
                                                width: "100px",
                                                height: "100px",
                                                margin: "20px auto" // ensures it stays centered even on print
                                            }}
                                            className={style.marginTop20}
                                        >
                                            <img src={CalendarIcon} alt="calendar" width="100" />

                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "55%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    fontSize: "40px",
                                                    fontWeight: "bold",
                                                    color: "black",
                                                    marginTop: "10px"
                                                }}
                                            >
                                                {applicationDashboard?.reviewAndVerificationStats?.staffManager?.averageWorkingDays || 0}
                                            </span>
                                        </div>
                                        <div className={`${style.chartBodyText} ${style.textAlignCenter}`}>Days</div>
                                    </div>
                                    <div>
                                        <div className={`${style.chartBodyText} ${style.textAlignCenter}`}>Avg. Working Days by Staff Type</div>
                                        <ApexBarChart series={barChartSeries} categories={barChartCategories} reportingPeriod={``} yAxisTitle="DAYS" xAxisTitle="Submitted Applications" fullWidth={true} />
                                    </div>
                                    <div>
                                        <div className={`${style.chartBodyText} ${style.textAlignCenter}`}>Medical Directive Fully Attested By Staff Type</div>
                                        <DonutChart height={200} legendPosition={'right'} series={getMSOReviewSeries()} labels={getReviewLabels()} colors={['#73D035', '#FF6562', '#3F8ADF', '#FFC100', '#FF851C']} size={'0%'} />
                                    </div>
                                </div>
                            </div>

                            <div className={style.marginTop20}>
                                <div className={style.chartHeader}>
                                    <div className={style.chartHeaderText}>Time to Attestation by Department</div>
                                </div>
                                <div className={`${style.chartBody}`}>
                                    <div className={`${style.chartBodyText} ${style.textAlignCenter}`}>Avg. Working Days by Department</div>
                                    <ApexBarChart series={barChartSeries} categories={barChartCategories} reportingPeriod={``} yAxisTitle="DAYS" xAxisTitle="Submitted Applications" fullWidth={true} />
                                </div>
                            </div>

                            <div className={style.marginTop20}>
                                <div className={style.chartHeader}>
                                    <div className={style.chartHeaderText}>Attestation Status by Department</div>
                                </div>
                                <div className={`${style.chartBody}`}>
                                    <div className={`${style.chartBodyText} ${style.textAlignCenter}`}>Attestation Status by Department</div>
                                    {(stackedSeries?.length > 0 && stackedCategories?.length > 0) && (
                                        <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} horizontal={false} />
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div >
            </Fragment >
        </div>
    )
}

export default MDDashboard;