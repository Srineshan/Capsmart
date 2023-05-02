import React, { Fragment, useState, useEffect, useRef, useCallback, createRef } from 'react';
import SampleReportLeftCard from './sampleReportLeftCard';
import Navbar from '../../Components/Navbar';
import { GET } from './../dataSaver';
import ReportPerformanceAndOptions from './reportPerformanceAndOptions';
import ReportHeader from './reportHeader';
import ReportFooter from './reportFooter';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import { format } from 'date-fns';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { toPDF } from '../../Components/ConvertToPdf';
import Pie from './d3-chart/pieGraph';
import Watermark from 'react-awesome-watermark';
import styled from 'styled-components';
import SideBar from '../../Components/Sidebar';
import StackedBarChartBaseLayout2 from './d3-chart/BarChart/stackedBarChartBaseLayout2';
import StackedBarChartBaseLayout3 from './d3-chart/BarChart/stackedBarChartBaseLayout3';
import ApexPieChart from './chart-data/pie-chart';
import ApexGroupedBarChart from './chart-data/groupedBarChart';
import ApexStackedBarChart from './chart-data/stackedBarChart';
import ApexLineChart from './chart-data/lineChart';
import ApexBarChart from './chart-data/barChart';

import style from './index.module.scss';
import ApexBoxChart from './chart-data/boxChart';
import ReportsTable from '../../Components/ReportsTable';
import ReportNoDataBox from '../../Components/ReusableSmallComponents/reportNoDataBox';

const ReportTypeOverview = () => {
    const data = [{ label: 'Done', value: 60 }, { label: 'To Do', value: 20 }, { label: 'Not Done', value: 20 }];
    const pieSampleData = [{ key: 'Done', value: 60 }, { key: 'To Do', value: 20 }, { key: 'Not Done', value: 20 }];
    const { reportType } = useParams();
    const handle = useFullScreenHandle();
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const onBeforeGetContentResolve = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isNoData, setIsNoData] = useState(false);
    const [contractRenewalReport, setContractRenewalReport] = useState([]);
    const [oneTimeContract, setOneTimeContract] = useState([]);
    const [nonCompliantContract, setNonCompliantContract] = useState([]);
    const [selectedPodTypeFromTile, setSelectedPodTypeFromTile] = useState('');
    const [nonCompliantContractTile, setNonCompliantContractTile] = useState([]);
    const [individualContract, setIndividualContract] = useState([]);
    const [multipleContract, setMultipleContract] = useState([]);
    const [user, setUsers] = useState([]);
    const [dataToUseInReport, setDataToUseInReport] = useState({});
    const [pieData, setPieData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [barData, setBarData] = useState();
    const [stackedData, setStackedData] = useState([]);
    const [stackedKeys, setStackedKeys] = useState([]);
    const [reportLog, setReportLog] = useState([]);
    const [paymentsReportLog, setPaymentsReportLog] = useState();
    const [series, setSeries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [barChartSeries, setBarChartSeries] = useState([]);
    const [barChartCategories, setBarChartCategories] = useState([]);
    const [stackedSeries, setStackedSeries] = useState([]);
    const [stackedCategories, setStackedCategories] = useState([]);
    const [isDownloadClicked, setIsDownloadClicked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isNonCompliantReportTileClicked, setIsNonCompliantReportTileClicked] = useState(false);
    const podTypes = ['Medical Staff Membership & Privileges',
        'Primary Speciality Board Certification',
        'Secondary Specialty Board Certification',
        'Liability Insurance Certificate',
        'Workers Compensation Insurance Certificate',
        'Tail Insurance Coverage Certificate',
        'Medical license Certificate',
        'Drug Enforcement Administration (DEA) License',
        'Controlled Substance DEA Registration Certificate'];

    useEffect(() => {
        if (reportType === 'upcomingContractRenewals') {
            getContractRenewalReport();
        }
        if (reportType === 'oneTimeContract') {
            getOneTimeContract();
        }
        if (reportType === 'nonCompliant') {
            getNonCompliantContractReportTile();
        }
        if (reportType === 'activitiesOrServices') {
            getAcvityAndServices();
        }
        if (reportType === 'paymentsProcessingSummary') {
            getPayments();
        }
        getUsersData();
    }, [])

    useEffect(() => {
        // if (!isUpdated) {
        if (reportType === 'upcomingContractRenewals') {
            getContractRenewalReportWithParameters();
        }
        if (reportType === 'oneTimeContract') {
            getOneTimeContractWithParameters();
        }
        if (reportType === 'nonCompliant') {
            getNonCompliantContractReportTile();
        }
        if (reportType === 'activitiesOrServices') {
            getAcvityAndServicesWithParameter();
        }
        if (reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
            setSelectedPodTypeFromTile(dataToUseInReport?.podType)
            getNonCompliantContractReport();
        }
        if (reportType === 'paymentsProcessingSummary') {
            getPayments();
        }
        // }
    }, [dataToUseInReport, selectedPodTypeFromTile])

    const getIsRefresh = (value) => {
        if (value) {
            setIsLoading(true);
            setIsUpdated(false);
            if (reportType === 'upcomingContractRenewals') {
                getContractRenewalReportWithParameters();
            }
            if (reportType === 'oneTimeContract') {
                getOneTimeContractWithParameters();
            }
            if (reportType === 'nonCompliant') {
                getNonCompliantContractReportTile();
            }
            if (reportType === 'activitiesOrServices') {
                getAcvityAndServicesWithParameter();
            }
            if (reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
                setSelectedPodTypeFromTile(dataToUseInReport?.podType)
                getNonCompliantContractReport();
            }
            if (reportType === 'paymentsProcessingSummary') {
                getPayments();
            }
        }
    }

    useEffect(() => {
        setIndividualContract(contractRenewalReport?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(contractRenewalReport?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [contractRenewalReport]);

    useEffect(() => {
        setIndividualContract(oneTimeContract?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(oneTimeContract?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [oneTimeContract]);

    useEffect(() => {
        if (reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
            getNonCompliantContractReport();
        }
    }, [isNonCompliantReportTileClicked]);

    useEffect(() => {
        setIsNoData(paymentsReportLog?.paymentContracts?.length !== 0 ? false : true);
    }, [paymentsReportLog])

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Report",
        // onBeforeGetContent: handleOnBeforeGetContent,
        // onBeforePrint: handleBeforePrint,
        // onAfterPrint: handleAfterPrint,
        removeAfterPrint: true
    });

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const getIsDownloadClicked = (value) => {
        setIsDownloadClicked(value);
        console.log('entered')
        if (value) {
            toPDF(".Report");
        }
    }

    const getAcvityAndServices = async () => {
        const { data: chartData } = await GET(`timesheet-management-service/report/activityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
        const { data: reportLogData } = await GET(`timesheet-management-service/report/activityServiceLog?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
        setReportLog(reportLogData);
        if (chartData) {
            let temp = [];
            chartData?.activityServiceReports?.map((pie, index) => {
                temp[index] = { key: pie.activityStatus, value: pie.count }
            })
            setPieData(temp);
            let lineTemp = [];
            chartData?.completedActivitiesByDate?.map((line, index) => {
                lineTemp[index] = { date: format(new Date(line.statedate), 'MM-dd'), value: line.count };
            })
            lineTemp.sort((a, b) => new Date(a.date) - new Date(b.date));
            setLineData(lineTemp);

            //   let barTemp = [];
            //   chartData?.activityStatusByCategorys?.map((bar,index)=>{
            //     let arr = [{name:bar.activityType,type:1,Done:bar.done},{name:bar.activityType,type:2,ToDo:bar.todo},{name:bar.activityType,type:3,NotDone:bar.notdone}]
            //     arr.map(data=>{
            //       barTemp.push(data);
            //         })
            //     })
            setSeries([{
                'data': chartData?.activityStatusByCategorys?.map(data => data?.done),
                'name': 'Done'
            },
            {
                'data': chartData?.activityStatusByCategorys?.map(data => data?.todo),
                'name': 'To Do'
            },
            {
                'data': chartData?.activityStatusByCategorys?.map(data => data?.notdone),
                'name': 'Not Done'
            },
            ])
            setCategories(chartData?.activityStatusByCategorys?.map(data => data?.activityType));

            setBarData({
                'series': series,
                'categories': categories
            });


            let stackedTemp = [];
            let keysForChart = [];
            let months = { '1': 'Jan', '2': 'Feb', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
            chartData?.completedActivitiesBycategoryAndMonth?.map((stack, index) => {
                let values = stack.types;
                keysForChart = Object.keys(stack.types);
                setStackedKeys(keysForChart);
                values['name'] = months[stack?.month];
                values['type'] = 1;
                stackedTemp.push(values);
            })
            let tempStackedSeries = [];
            keysForChart?.map((data, index) => {
                tempStackedSeries.push({
                    'data': stackedTemp?.map(stackedData => stackedData?.[data]),
                    'name': data
                })
                setStackedSeries(tempStackedSeries);
            })
            setStackedData(stackedTemp);
            setStackedCategories(stackedTemp?.map(stackedData => stackedData?.name));
        }
    }

    const getAcvityAndServicesWithParameter = async () => {
        const { data: chartData } = await GET(`timesheet-management-service/report/activityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
        const { data: reportLogData } = await GET(`timesheet-management-service/report/activityServiceLog?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
        setReportLog(reportLogData);
        // setIsLoading(false);
        if (chartData) {
            let temp = [];
            chartData?.activityServiceReports?.map((pie, index) => {
                temp[index] = { key: pie.activityStatus, value: pie.count }
            })
            setPieData(temp);
            let lineTemp = [];
            chartData?.completedActivitiesByDate?.map((line, index) => {
                lineTemp[index] = { date: format(new Date(line.statedate), 'MM-dd'), value: line.count };
            })
            lineTemp.sort((a, b) => new Date(a.date) - new Date(b.date));
            setLineData(lineTemp);
            // let barTemp = [];
            // chartData?.activityStatusByCategorys?.map((bar,index)=>{
            //     let arr = [{name:bar.activityType,type:1,Done:bar.done},{name:bar.activityType,type:2,ToDo:bar.todo},{name:bar.activityType,type:3,NotDone:bar.notdone}]
            //     arr.map(data=>{
            //     barTemp.push(data);
            //     })
            // })
            // setBarData(barTemp);
            setSeries([{
                'data': chartData?.activityStatusByCategorys?.map(data => data?.done),
                'name': 'Done'
            },
            {
                'data': chartData?.activityStatusByCategorys?.map(data => data?.notdone),
                'name': 'Not Done'
            },
            {
                'data': chartData?.activityStatusByCategorys?.map(data => data?.todo),
                'name': 'To Do'
            }])
            setCategories(chartData?.activityStatusByCategorys?.map(data => data?.activityType));

            setBarData({
                'series': series,
                'categories': categories
            });
            let stackedTemp = [];
            let keysForChart = [];
            let months = { '1': 'Jan', '2': 'Feb', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
            chartData?.completedActivitiesBycategoryAndMonth?.map((stack, index) => {
                let values = stack.types;
                keysForChart = Object.keys(stack.types);
                setStackedKeys(keysForChart);
                values['name'] = months[stack?.month];
                values['type'] = 1;
                stackedTemp.push(values);
            })
            let tempStackedSeries = [];
            keysForChart?.map((data, index) => {
                tempStackedSeries.push({
                    'data': stackedTemp?.map(stackedData => stackedData?.[data]),
                    'name': data
                })
                setStackedSeries(tempStackedSeries);
            })
            setStackedData(stackedTemp);
            setStackedCategories(stackedTemp?.map(stackedData => stackedData?.name));
        }
    }

    const getPayments = async () => {
        const { data: chartData } = await GET(`timesheet-management-service/report/paymentProcessingSummary?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}`);
        setPaymentsReportLog(chartData);
        if (chartData?.paymentStats?.minPayment !== 0) {
            let temp = [];
            console.log(chartData)
            Object?.keys(chartData?.timesheetProcessingStatus)?.map((data, index) => {
                temp[index] = { key: data, value: Object?.values(chartData?.timesheetProcessingStatus)?.[index] }
            })
            setPieData(temp);
            setBarChartSeries([{
                'data': chartData?.paymentContracts?.map(data => data?.payment),
                'name': 'Dollars Paid'
            }])
            setBarChartCategories(chartData?.paymentContracts?.map(data => data?.contractId));
        } else {
            setPieData([]);
            setBarChartSeries([]);
            setBarChartCategories([]);
        }
        // setIsLoading(false);
    }

    const getUsersData = async () => {
        const { data: user } = await GET('user-management-service/user');
        if (user) {
            setUsers(user);
        }
    }

    const getDataToUseInReport = (value) => {
        setDataToUseInReport(value);
    }

    const getContractRenewalReport = async () => {
        const { data: contractRenewalReport } = await GET('contract-managment-service/reports/contractRenewalReport');
        if (contractRenewalReport) {
            setContractRenewalReport(contractRenewalReport);
        }
    }

    const getContractRenewalReportWithParameters = async () => {
        const { data: contractRenewalReport } = await GET(`contract-managment-service/reports/contractRenewalReport?sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}&renewalDays=${dataToUseInReport?.renewalreportingTimePeriod}&contractPolicyType=${dataToUseInReport?.contractContinuationPolicy}`);
        if (contractRenewalReport) {
            setContractRenewalReport(contractRenewalReport);
        }
        // setIsLoading(false);
    }

    const getOneTimeContract = async () => {
        const { data: oneTimeContract } = await GET(`contract-managment-service/reports/oneTimeContractReport`);
        if (oneTimeContract) {
            setOneTimeContract(oneTimeContract);
        }
    }

    const getOneTimeContractWithParameters = async () => {
        const { data: oneTimeContract } = await GET(`contract-managment-service/reports/oneTimeContractReport?renewalDays=${dataToUseInReport?.renewalreportingTimePeriod}`);
        if (oneTimeContract) {
            setOneTimeContract(oneTimeContract);
        }
        // setIsLoading(false);
    }

    const getNonCompliantContractReportTile = async () => {
        const { data: nonCompliantContract } = await GET(`contract-managment-service/reports/documentProofReport?contractNames=${dataToUseInReport?.selectedContracts}&contractStatus=${dataToUseInReport?.contractStatus}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
        if (nonCompliantContract) {
            setNonCompliantContractTile(nonCompliantContract);
        }
        // setIsLoading(false);
    }

    const getNonCompliantContractReport = async () => {
        const { data: nonCompliantContract } = await GET(`contract-managment-service/reports/nonCompliantContractReport?podType=${encodeURIComponent(selectedPodTypeFromTile)}&contractStatus=${dataToUseInReport?.contractStatus}&contractNames=${dataToUseInReport?.selectedContracts}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
        if (nonCompliantContract) {
            setNonCompliantContract(nonCompliantContract);
        }
        // setIsLoading(false);
    }

    const getPaymentStatus = (value) => {
        if (value === 'PAYMENT')
            return 'Payment';
        else if (value === 'REJECTED_BY_APPROVER')
            return 'Rejected By Approver';
        else if (value === 'COMPLETED')
            return 'Completed';
    }

    let activityPerformed = [];
    let startDateTime = [];
    let endDateTime = [];
    let contractProvider = [];
    let reasonNotDone = [];

    const getActivitiesServicesValues = (value) => {
        activityPerformed = [];
        startDateTime = [];
        endDateTime = [];
        contractProvider = [];
        reasonNotDone = [];
        reportLog?.filter(data => data?.activityStatus === value)?.map(data => {
            activityPerformed.push(data?.activityPerformed?.activity);
            startDateTime.push(`${format(new Date(data?.activityTimeFrame?.stateDate), 'MM-dd-yyyy')}, ${data?.activityTimeFrame?.startTime}`)
            endDateTime.push(`${format(new Date(data?.activityTimeFrame?.endDate), 'MM-dd-yyyy')}, ${data?.activityTimeFrame?.endTme}`)
            user?.filter(user => user?.id === data?.user?.id)?.map(data => {
                contractProvider.push(data?.name?.firstName)
            });
            reasonNotDone.push(data?.activityNotes?.notes);
        })

        return value === "DONE" ? [
            activityPerformed,
            startDateTime,
            endDateTime,
            contractProvider,
            ''
        ] : value === "TODO" ? [
            activityPerformed,
            startDateTime,
            contractProvider,
            ''
        ] : [
            activityPerformed,
            startDateTime,
            contractProvider,
            '',
            reasonNotDone
        ];
    }

    let timeSheet = [];
    let period = [];
    let serviceProvider = [];
    let deptAndSite = [];
    let paidAmount = [];
    let invoiceAmount = [];

    const getPaymentsValues = (value) => {
        timeSheet = [];
        period = [];
        serviceProvider = [];
        deptAndSite = [];
        paidAmount = [];
        invoiceAmount = [];
        if (value === 'paidOnTime') {
            paymentsReportLog?.paidOnTime?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')}` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push('-');
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment}` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment}` : '-');
            })
        }
        if (value === 'timesheetNotPaid') {
            paymentsReportLog?.paymentNotDone?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')}` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push('-');
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment}` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment}` : '-');
            })
        }
        if (value === 'rejectedTimesheetPayments') {
            paymentsReportLog?.rejected?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')}` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push('-');
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment}` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment}` : '-');
            })
        }
        if (value === 'delayedTimesheetPayments') {
            paymentsReportLog?.paymentDelayed?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push('-');
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')}` : '-')
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment}` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment}` : '-');
            })
        }
        if (value === 'paymentPastDue') {
            paymentsReportLog?.paymentPastDue?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')}` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push('-');
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment}` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment}` : '-');
            })
        }

        return [
            timeSheet,
            period,
            serviceProvider,
            deptAndSite,
            paidAmount,
            invoiceAmount
        ];
    }

    let contractManagementContractName = [];
    let contractManagementContractId = [];
    let contractManagementExpirationDate = [];
    let contractManagementContractingEntity = [];
    let contractManagementPointOfContact = [];
    let contractManagementPointOfContactNumber = [];
    let contractManagementEmail = [];
    let contractManagementServiceProvider = [];

    const getContractManagementUpcomingValues = (value) => {
        contractManagementContractName = [];
        contractManagementContractId = [];
        contractManagementExpirationDate = [];
        contractManagementContractingEntity = [];
        contractManagementPointOfContact = [];
        contractManagementPointOfContactNumber = [];
        contractManagementEmail = [];
        contractManagementServiceProvider = [];

        let mapValue = value === "INDIVIDUAL" ? individualContract : multipleContract;

        mapValue?.map(data => {
            contractManagementContractName.push(data?.contractName?.contractName);
            contractManagementContractId.push(data?.contractDetail?.contractId?.id)
            contractManagementExpirationDate.push(format(new Date(data?.contractDetail?.contractTerm?.endDate), 'MM-dd-yyyy'))
            contractManagementContractingEntity.push(data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-');
            contractManagementPointOfContact.push(`${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} ${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}`);
            contractManagementPointOfContactNumber.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber));
            contractManagementEmail.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail));
        })

        return [
            contractManagementContractName,
            contractManagementContractId,
            contractManagementExpirationDate,
            contractManagementContractingEntity,
            contractManagementPointOfContact,
            contractManagementPointOfContactNumber,
            contractManagementEmail
        ];
    }

    let contractCompliaceContractName = [];
    let contractCompliaceContractId = [];
    let contractCompliaceContractManager = [];
    let contractCompliaceExpirationDate = [];
    let contractCompliaceContractingEntity = [];
    let contractCompliacePointOfContact = [];
    let contractCompliacePointOfContactNumber = [];
    let contractCompliaceEmail = [];


    const getContractComplianceValues = (value) => {
        contractCompliaceContractName = [];
        contractCompliaceContractId = [];
        contractCompliaceContractManager = [];
        contractCompliaceExpirationDate = [];
        contractCompliaceContractingEntity = [];
        contractCompliacePointOfContact = [];
        contractCompliacePointOfContactNumber = [];
        contractCompliaceEmail = [];

        let mapValue = value === "documentNotUploadedContracts" ? nonCompliantContract?.documentNotUploadedContracts :
            value === "expiredContracts" ? nonCompliantContract?.expiredContracts :
                value === "renewalContracts" ? nonCompliantContract?.renewalContracts :
                    nonCompliantContract?.notExpiredContracts;

        mapValue?.map(data => {
            contractCompliaceContractName.push(data?.contractName?.contractName);
            contractCompliaceContractId.push(data?.contractDetail?.contractId?.id)
            contractCompliaceContractManager.push(`${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} ${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}`)
            contractCompliaceExpirationDate.push(format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy'))
            contractCompliaceContractingEntity.push(data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-');
            contractCompliacePointOfContact.push(`${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} ${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}`);
            contractCompliacePointOfContactNumber.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber));
            contractCompliaceEmail.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail));
        })

        return [
            contractCompliaceContractName,
            contractCompliaceContractId,
            contractCompliaceContractManager,
            contractCompliaceExpirationDate,
            contractCompliaceContractingEntity,
            contractCompliacePointOfContact,
            contractCompliacePointOfContactNumber,
            contractCompliaceEmail
        ];
    }

    return (
        <Fragment>
            <Navbar />
            <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20WithoutTop} ${style.marginTop10}`}>
                <div>
                    <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                        <SampleReportLeftCard getDataToUseInReport={getDataToUseInReport} />
                    </SideBar>
                </div>
                <div>
                    <ReportPerformanceAndOptions handle={handle} getIsRefresh={getIsRefresh} handlePrint={handlePrint} isLoading={isLoading} dataToUseInReport={dataToUseInReport} refToUse={PDFRef} getIsDownloadClicked={getIsDownloadClicked} isNoData={isNoData} />
                    <FullScreen handle={handle}>
                        <div className={`Report`} ref={PDFRef}>
                            <div className={`${style.reportBackgroundCard} ${style.marginTop20}`} ref={componentRef}>
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <ReportHeader />
                                    </thead>
                                    <tbody>
                                        <div className={style.justifyCenter}>
                                            <div className={style.marginTop20}>
                                                {reportType === "paymentsProcessingSummary" && (
                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop5}`}>
                                                        {dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ')}
                                                    </div>
                                                )}
                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop5}`}>
                                                    {reportType === "upcomingContractRenewals" ? 'Upcoming Contract Renewals'
                                                        : reportType === "oneTimeContract" ? "List of One Time Contracts that will Terminate on Expiration"
                                                            : reportType === "scheduledActivity" ? "Scheduled Activity/ Services - Forcasted To Actual"
                                                                : reportType === "scheduledActivityByContract" ? "Scheduled Activity/ Services - Forcasted To Actual By Contract"
                                                                    : reportType === "complianceStatus" ? "Proof Of Documentation Status By Contractor"
                                                                        : reportType === "nonCompliant" ? 'List of Contracts that are non compliant with proof of documentation requirement'
                                                                            : reportType === "paymentsProcessingSummary" ? 'Payments Processing Summary'
                                                                                : 'Activities/ Services Log Status Summary'}
                                                </div>
                                                {dataToUseInReport?.reportingTimePeriod !== "" && (
                                                    <div className={`${style.reportRunByTextStyle} ${style.textAlignCenter} ${style.marginTop5}`}>Reporting Period used for this report : {dataToUseInReport?.reportingTimePeriod} ({dataToUseInReport?.fromToDisplay} to {dataToUseInReport?.toToDisplay}) </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                        <div className={style.marginTop20}>
                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Reporting Parameters Applied</div>
                                            {(reportType === "upcomingContractRenewals" || reportType === "oneTimeContract") ? (
                                                <div className={`${style.grid2} ${style.marginTop20}`}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Renewal Time Frame </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{`Renewal within Next ${dataToUseInReport?.renewalreportingTimePeriod} days`}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Sites </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                    {reportType === "upcomingContractRenewals" && (
                                                        <div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Continuation Policy</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.contractContinuationPolicy === 'AUTORENEWAL' ? "Auto Renewal"
                                                                : dataToUseInReport?.contractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM" ? "Written Contract Extension For Fixed Term"
                                                                    : dataToUseInReport?.contractContinuationPolicy === "NEWCONTRACTONEXPIRATION" ? "New Contract On Expiration"
                                                                        : dataToUseInReport?.contractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION" ? "One Time Contract - Terminate On Expiration" : 'All'}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (reportType === "activitiesOrServices") ? (
                                                <div className={`${style.grid2} ${style.marginTop20}`}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Sites </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ') || 'All Contracts'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracted Service Provider </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedContractedServiceProviderToSend?.name?.firstName}</div>
                                                    </div>
                                                </div>
                                            ) : (reportType === "paymentsProcessingSummary") ? (
                                                <div className={`${style.grid2} ${style.marginTop20}`}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                </div>
                                            ) : (reportType === "nonCompliant") ? (
                                                <div className={`${style.grid2} ${style.marginTop20}`}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Sites </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracts </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ') || 'All Contracts'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Status</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.contractStatus === 'ACTIVE' ? 'Active'
                                                            : dataToUseInReport?.contractStatus === 'DRAFT' ? 'Draft'
                                                                : dataToUseInReport?.contractStatus === 'EXPIRED' ? 'Expired'
                                                                    : dataToUseInReport?.contractStatus === 'TERMINATED' ? 'Terminated' : ''}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Proof Of Documentation </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.podType || 'Select One'}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`${style.grid2} ${style.marginTop20}`}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Service Site </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Site 1, Site 2, Site 3</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Department/ Service Area </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>All Departments</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracted Service Provider</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Doctor 1, Doctor 2, Doctor 3</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracted Service/ Activity Category</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Medical/ Surgical Care Services</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Type of Service/ Activity Performed</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Medical/ Surgical Care Services</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Completion Status</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Medical/ Surgical Care Services</div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
                                            {reportType === "activitiesOrServices" ? (
                                                <>
                                                    <div className={style.grid2}>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Activity / Services Status</div>
                                                            <ApexPieChart pieData={pieData} />
                                                        </div>

                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20}`}>By Category Of Service Performed</div>
                                                            <div className={style.marginTop20}>
                                                                <ApexGroupedBarChart series={series} categories={categories} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
                                                    <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Trend For Activities / Services Completed</div>
                                                        <div className={style.reportWidthToFitFullScreen}>
                                                            <ApexLineChart lineData={lineData} />
                                                        </div>
                                                    </div>
                                                    <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
                                                    <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Percentage Of Activities / Services Completed By Category Type</div>
                                                        <div className={style.reportWidthToFitFullScreen}>
                                                            <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />
                                                        </div>
                                                    </div>
                                                    <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                                    {reportLog?.filter(data => data?.activityStatus === "DONE")?.length !== 0 && (
                                                        <>
                                                            <ReportsTable
                                                                tableType={'Completed Activity / Service Log'}
                                                                tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Completion Date/ Time', 'Contracted Provider', 'Site']}
                                                                tableValue={reportLog?.filter(data => data?.activityStatus === "DONE")}
                                                                activitiesServicesValues={getActivitiesServicesValues('DONE')}
                                                                styleName={style.grid5}
                                                            />
                                                            <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                                        </>
                                                    )}
                                                    {reportLog?.filter(data => data?.activityStatus === "TODO")?.length !== 0 && (
                                                        <>
                                                            <ReportsTable
                                                                tableType={'To Do Activity/ Services'}
                                                                tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Contracted Provider', 'Site']}
                                                                tableValue={reportLog?.filter(data => data?.activityStatus === "TODO")}
                                                                activitiesServicesValues={getActivitiesServicesValues('TODO')}
                                                                styleName={style.grid5}
                                                            />
                                                            <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                                        </>
                                                    )}
                                                    {reportLog?.filter(data => data?.activityStatus === "NOTDONE")?.length !== 0 && (
                                                        <>
                                                            <ReportsTable
                                                                tableType={'Not Done Activity / Service Log'}
                                                                tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Contracted Provider', 'Site', 'Reason Not Done']}
                                                                tableValue={reportLog?.filter(data => data?.activityStatus === "NOTDONE")}
                                                                activitiesServicesValues={getActivitiesServicesValues('NOTDONE')}
                                                                styleName={style.grid5}
                                                            />
                                                        </>
                                                    )}
                                                </>
                                            ) : reportType === "paymentsProcessingSummary" ? (
                                                paymentsReportLog?.paymentContracts?.length !== 0 ? (
                                                    <>
                                                        <div className={style.grid2}>
                                                            <div>
                                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Timesheets Processing Status</div>
                                                                <ApexPieChart pieData={pieData} />
                                                            </div>
                                                            <div>
                                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Payments Made Summary Statistics</div>
                                                                <div className={`${style.summaryGrid} ${style.marginTop40}`}>
                                                                    <div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Minimum Payment</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Maximum Payment</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Average Payment Per Timesheet</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Median Payment ( 50TH Percentile )</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20}`}>$ {paymentsReportLog?.paymentStats?.minPayment}</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20}`}>$ {paymentsReportLog?.paymentStats?.maxPayment}</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20}`}>$ {paymentsReportLog?.paymentStats?.avgPayment}</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20}`}>$ {paymentsReportLog?.paymentStats?.medianPayment}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Payment For Services Performed By Contract</div>
                                                            <div className={style.marginTop20}>
                                                                <ApexBarChart series={barChartSeries} categories={barChartCategories} reportingPeriod={`${format(new Date(dataToUseInReport?.from || new Date()), 'MMM d')} to ${format(new Date(dataToUseInReport?.to || new Date()), 'MMM d')}`} yAxisTitle="Dollars Paid" />
                                                            </div>
                                                        </div>
                                                        <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
                                                        {/* <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Percentage Of Activities / Services Completed By Category Type</div>
                                                        <div className={style.reportWidthToFitFullScreen}>
                                                            <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />
                                                        </div>
                                                    </div> */}
                                                        {/* <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div> */}
                                                        {paymentsReportLog?.paymentPastDue?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Payment Past Due'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paymentPastDue}
                                                                    activitiesServicesValues={getPaymentsValues('paymentPastDue')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.paymentDelayed?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Delayed Payments'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paymentDelayed}
                                                                    activitiesServicesValues={getPaymentsValues('delayedTimesheetPayments')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.rejected?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Rejected Payments'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.rejected}
                                                                    activitiesServicesValues={getPaymentsValues('rejectedTimesheetPayments')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.paymentNotDone?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets Without Payment'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paymentNotDone}
                                                                    activitiesServicesValues={getPaymentsValues('timesheetNotPaid')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.paidOnTime?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Payment On Time'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paidOnTime}
                                                                    activitiesServicesValues={getPaymentsValues('paidOnTime')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                )
                                            ) : (reportType === "scheduledActivity" || reportType === "scheduledActivityByContract") ? (
                                                <>
                                                    <div className={style.grid2}>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Hours Completed Summary</div>
                                                            <div className={style.marginTop20}>
                                                                <StackedBarChartBaseLayout2 />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20}`}>Dollars Paid Summary</div>
                                                            <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                                        </div>
                                                    </div>
                                                    <div className={`${style.headerBorderStyle}`}></div>
                                                    <div className={style.contractNameCardStyle}>Contract Name 1 - Individual Contractor Contract</div>
                                                    <div className={`${style.grid2} ${style.marginTop40}`}>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Hours Completed Summary</div>
                                                            <div className={style.marginTop20}>
                                                                <StackedBarChartBaseLayout2 />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20}`}>Dollars Paid Summary</div>
                                                            <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                                        </div>
                                                    </div>
                                                    <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                                    <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Scheduled Activity/ Services Completion Status</div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div></div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Total To do</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Completed</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Not Verified</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Not Completed</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Yet to Complete</div>
                                                        </div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5}`}>Medical Services</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>12 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>1</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>7 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2 ($ xxx)</div>
                                                        </div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5}`}>Administrative Services</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>12 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>1</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>7 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2 ($ xxx)</div>
                                                        </div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5}`}>Supplemental Services</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>12 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>1</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>7 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2 ($ xxx)</div>
                                                        </div>
                                                    </div>
                                                    <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                                    <div className={style.contractNameCardStyle}>Contract Name 2 - Multiple Contractor Contract - 5 Service Providers</div>
                                                    <div className={`${style.grid2} ${style.marginTop20}`}>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Hours Completed Summary</div>
                                                            <div className={style.marginTop20}>
                                                                <StackedBarChartBaseLayout2 />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20}`}>Dollars Paid Summary</div>
                                                            <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                                        </div>
                                                    </div>
                                                    <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                                    <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Scheduled Activity/ Services Completion Status</div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div></div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Total To do</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Completed</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Not Verified</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Not Completed</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Yet to Complete</div>
                                                        </div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5}`}>Medical Services</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>12 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>1</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>7 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2 ($ xxx)</div>
                                                        </div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5}`}>Administrative Services</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>12 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>1</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>7 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2 ($ xxx)</div>
                                                        </div>
                                                        <div className={`${style.grid6} ${style.marginTop20}`}>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5}`}>Supplemental Services</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>12 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>1</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>7 ($ xxx)</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>2 ($ xxx)</div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (reportType === "upcomingContractRenewals" || reportType === "oneTimeContract") ? (
                                                <>
                                                    {individualContract?.length !== 0 && (
                                                        <ReportsTable
                                                            tableType={'Individual Service Provider Contract Renewal'}
                                                            tableHeader={['Contract Name', 'Contract ID', 'Contract Expiration Date', 'Contracting Entity', 'Point of Contact', 'Point of Contact Number', 'Email Address']}
                                                            tableValue={individualContract}
                                                            activitiesServicesValues={getContractManagementUpcomingValues('INDIVIDUAL')}
                                                            styleName={style.individualServiceReportGrid}
                                                        />
                                                    )}
                                                    {multipleContract?.length !== 0 && (
                                                        <ReportsTable
                                                            tableType={'Multiple Service Provider Contract Renewal'}
                                                            tableHeader={['Contract Name', 'Contract ID', 'Contract Expiration Date', 'Contracting Entity', 'Point of Contact', 'Point of Contact Number', 'Email Address', 'Service Providers']}
                                                            tableValue={multipleContract}
                                                            activitiesServicesValues={getContractManagementUpcomingValues('MULTIPLE')}
                                                            styleName={style.individualServiceReportGrid}
                                                        />
                                                    )}
                                                </>
                                            ) : reportType === "complianceStatus" ? (
                                                <>
                                                    <div className={style.marginTop40}>
                                                        <StackedBarChartBaseLayout3 />
                                                    </div>
                                                    <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                                    <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Non Compliant Providers With Required Documents</div>
                                                        <div className={`${style.grid7} ${style.marginTop20}`}>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Service Provider Name</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Title</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Department</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Site</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Non Compliant PODs</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Non Compliant days</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Open Tasks</div>
                                                        </div>
                                                        <div className={`${style.grid7} ${style.marginTop20}`}>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>John Doe</div>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Chief Medical Officer</div>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>--</div>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Good Samaritan Hospital</div>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>3</div>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>20</div>
                                                            <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className={style.marginTop40}>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Providers With Required Documents Needing Compliance Within Next 30 Days</div>
                                                            <div className={`${style.grid7} ${style.marginTop20}`}>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Service Provider Name</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Title</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Department</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Site</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Non Compliant PODs</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Non Compliant days</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Open Tasks</div>
                                                            </div>
                                                            <div className={`${style.grid7} ${style.marginTop20}`}>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>John Doe</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Chief Medical Officer</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>--</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Good Samaritan Hospital</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>3</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>20</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>2</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={style.marginTop40}>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Providers In Compliance With Required Documents</div>
                                                            <div className={`${style.grid7} ${style.marginTop20}`}>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Service Provider Name</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Title</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Department</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Site</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Non Compliant PODs</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Non Compliant days</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Open Tasks</div>
                                                            </div>
                                                            <div className={`${style.grid7} ${style.marginTop20}`}>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>John Doe</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Chief Medical Officer</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>--</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Good Samaritan Hospital</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>3</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>20</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>2</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : reportType === "nonCompliant" ? (
                                                <>
                                                    {isNonCompliantReportTileClicked ? (
                                                        <>
                                                            {nonCompliantContract?.documentNotUploadedContracts?.length !== 0 && (
                                                                <ReportsTable
                                                                    tableType={`Contracts With No ${selectedPodTypeFromTile} Proof Of Documentation`}
                                                                    tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                    tableValue={nonCompliantContract?.documentNotUploadedContracts}
                                                                    activitiesServicesValues={getContractComplianceValues('documentNotUploadedContracts')}
                                                                    styleName={style.individualServiceReportGrid}
                                                                />
                                                            )}
                                                            {nonCompliantContract?.expiredContracts?.length !== 0 && (
                                                                <ReportsTable
                                                                    tableType={`Contracts With Expired ${selectedPodTypeFromTile}`}
                                                                    tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                    tableValue={nonCompliantContract?.expiredContracts}
                                                                    activitiesServicesValues={getContractComplianceValues('expiredContracts')}
                                                                    styleName={style.individualServiceReportGrid}
                                                                />
                                                            )}
                                                            {nonCompliantContract?.renewalContracts?.length !== 0 && (
                                                                <ReportsTable
                                                                    tableType={`Contracts With Renewals in next 30 days ${selectedPodTypeFromTile}`}
                                                                    tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                    tableValue={nonCompliantContract?.renewalContracts}
                                                                    activitiesServicesValues={getContractComplianceValues('renewalContracts')}
                                                                    styleName={style.individualServiceReportGrid}
                                                                />
                                                            )}
                                                            {nonCompliantContract?.notExpiredContracts?.length !== 0 && (
                                                                <ReportsTable
                                                                    tableType={`Contracts With Not Expired ${selectedPodTypeFromTile}`}
                                                                    tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                    tableValue={nonCompliantContract?.notExpiredContracts}
                                                                    activitiesServicesValues={getContractComplianceValues('notExpiredContracts')}
                                                                    styleName={style.individualServiceReportGrid}
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className={`${style.complianceGrid2} ${style.marginTop20}`}>
                                                            {podTypes?.map((data, index) => (
                                                                <div className={`${style.complianceCardStyle} ${style.cursorPointer}`} key={index} onClick={() => { setIsNonCompliantReportTileClicked(true); setSelectedPodTypeFromTile(data) }}>
                                                                    <div className={style.complianceLeftCardStyle}>
                                                                        <div className={style.complianPercentageStyle}>
                                                                            {`${nonCompliantContractTile?.podTypePercentage?.[data] || 0}%`}
                                                                        </div>
                                                                    </div>
                                                                    <div className={style.complianceRightCardStyle}>
                                                                        <div className={style.fullWidth}>
                                                                            <div className={style.complianceHeadingStyle}>{data}</div>
                                                                            <div className={`${style.complianceListGrid} ${style.marginTop20}`}>
                                                                                <div className={style.redDotStyle}></div>
                                                                                <div className={`${style.reportRunByTextStyle}`}>Expired</div>
                                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft}`}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.expiredDocumentCount}</div>
                                                                            </div>
                                                                            <div className={`${style.complianceListGrid} ${style.marginTop10}`}>
                                                                                <div className={style.yellowDotStyle}></div>
                                                                                <div className={`${style.reportRunByTextStyle}`}>Renewals in next 30 days</div>
                                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft}`}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.renewalIn30DaysDocumentCount}</div>
                                                                            </div>
                                                                            <div className={`${style.complianceListGrid} ${style.marginTop10}`}>
                                                                                <div className={style.greenDotStyle}></div>
                                                                                <div className={`${style.reportRunByTextStyle}`}>Not expired</div>
                                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft}`}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.notExpiredDocumentCount}</div>
                                                                            </div>
                                                                            <div className={`${style.complianceListGrid} ${style.marginTop10}`}>
                                                                                <div className={style.blueDotStyle}></div>
                                                                                <div className={`${style.reportRunByTextStyle}`}>Document copy not on file</div>
                                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft}`}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.documentFileNotFoundCount}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                </>
                                            )}
                                        </div>
                                    </tbody>
                                    <tfoot>
                                        <ReportFooter />
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </FullScreen>
                </div>
            </div>
        </Fragment>
    )
}

export default ReportTypeOverview;
