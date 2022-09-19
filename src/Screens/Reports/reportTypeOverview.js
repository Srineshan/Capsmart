import React, { Fragment, useState, useEffect } from 'react';
import SampleReportLeftCard from './sampleReportLeftCard';
import Navbar from '../../Components/Navbar';
import {GET} from './../dataSaver';
import ReportPerformanceAndOptions from './reportPerformanceAndOptions';
import ReportHeader from './reportHeader';
import ReportFooter from './reportFooter';
import { useParams } from 'react-router-dom';
import {format} from 'date-fns';
// import PieChart from './d3-chart/pieChart';
import Pie from './d3-chart/pieGraph';
// import LineChart from './d3-chart/lineChart';
// import BarChart from './d3-chart/BarChart';
import Watermark from 'react-awesome-watermark';
import styled from 'styled-components';
// import Chart from 'react-apexcharts'
// import chartData5 from './chart-data/line-chart-2';
// import StackedBarChartBaseLayout1 from './d3-chart/BarChart/stackedBarChartBaseLayout';
import StackedBarChartBaseLayout2 from './d3-chart/BarChart/stackedBarChartBaseLayout2';
import StackedBarChartBaseLayout3 from './d3-chart/BarChart/stackedBarChartBaseLayout3';
import ApexPieChart from './chart-data/pie-chart';
import ApexGroupedBarChart from './chart-data/groupedBarChart';
import ApexStackedBarChart from './chart-data/stackedBarChart';
import ApexLineChart from './chart-data/lineChart';

import style from './index.module.scss';
import ApexBoxChart from './chart-data/boxChart';

const WatermarkWrapper = styled.div`
  text-align: center;

  .space-props-test {
    display: inline-block;
    margin: 10px;
  }
`;

const StyledWatermark = styled(Watermark)`
  margin: 0 auto;

  .inner-watermark {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    font-size: 20px;
    text-align: center;
    line-height: 2;
  }
`;

const ReportTypeOverview = () => {
    const data = [{ label: 'Done', value: 60 }, { label: 'To Do', value: 20 }, { label: 'Not Done', value: 20 }];
    const pieSampleData = [{ key: 'Done', value: 60 }, { key: 'To Do', value: 20 }, { key: 'Not Done', value: 20 }];
    const {reportType} = useParams();
    const [contractRenewalReport, setContractRenewalReport] = useState([]);
    const [oneTimeContract, setOneTimeContract] = useState([]);
    const [nonCompliantContract, setNonCompliantContract] = useState([]);
    const [selectedPodTypeFromTile, setSelectedPodTypeFromTile] = useState('');
    const [nonCompliantContractTile, setNonCompliantContractTile] = useState([]);
    const [individualContract, setIndividualContract] = useState([]);
    const [multipleContract, setMultipleContract] = useState([]);
    const [user,setUsers] = useState([]);
    const [dataToUseInReport, setDataToUseInReport] = useState({});
    const [showExpandedView, setShowExpandedView] = useState(false);
    const [pieData,setPieData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [barData,setBarData] = useState();
    const [stackedData, setStackedData] = useState([]);
    const [stackedKeys, setStackedKeys] = useState([]);
    const [reportLog,setReportLog] = useState([]);
    const [series,setSeries] = useState([]);
    const [categories,setCategories] = useState([]);
    const [stackedSeries,setStackedSeries] = useState([]);
    const [stackedCategories,setStackedCategories] = useState([]);
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

    useEffect(()=>{
        if(reportType === 'upcomingContractRenewals') {
            getContractRenewalReport();
        }
        if(reportType === 'oneTimeContract') {
            getOneTimeContract();
        }
        if(reportType === 'nonCompliant') {
            getNonCompliantContractReportTile();
        }
        if(reportType === 'activitiesOrServices'){
          getAcvityAndServices();
        }
        getUsersData();
      },[])

    useEffect(() => {
        if(reportType === 'upcomingContractRenewals') {
            getContractRenewalReportWithParameters();
        }
        if(reportType === 'oneTimeContract') {
            getOneTimeContractWithParameters();
        }
        if(reportType === 'nonCompliant') {
            getNonCompliantContractReportTile();
        }
        if(reportType === 'activitiesOrServices'){
            getAcvityAndServicesWithParameter();
          }
        if(reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
            setSelectedPodTypeFromTile(dataToUseInReport?.podType)
            getNonCompliantContractReport();
        }
    }, [dataToUseInReport, selectedPodTypeFromTile])

    useEffect(()=> {
        setIndividualContract(contractRenewalReport?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(contractRenewalReport?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [contractRenewalReport]);

    useEffect(()=> {
        setIndividualContract(oneTimeContract?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(oneTimeContract?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [oneTimeContract]);

    useEffect(()=> {
        if(reportType === 'nonCompliant') {
            getNonCompliantContractReport();
        }
    }, [isNonCompliantReportTileClicked]);

    const getAcvityAndServices = async() => {
    const {data:chartData} = await GET('timesheet-management-service/report/activityServiceReport?startDate=2022-06-07&endDate=2022-09-07');
    const {data:reportLogData} = await GET('timesheet-management-service/report/activityServiceLog?startDate=2022-06-07&endDate=2022-09-07');
    setReportLog(reportLogData);
    if(chartData){
      let temp = [];
      chartData?.activityServiceReports?.map((pie,index)=>{
        temp[index] = {key:pie.activityStatus, value:pie.count}
      })
      setPieData(temp);
      let lineTemp = [];
      chartData?.completedActivitiesByDate?.map((line,index)=>{
        lineTemp[index] = {date:line.statedate, value:line.count};
      })
      lineTemp.sort((a,b)=>new Date(a.date)-new Date(b.date));
      setLineData(lineTemp);

    //   let barTemp = [];
    //   chartData?.activityStatusByCategorys?.map((bar,index)=>{
    //     let arr = [{name:bar.activityType,type:1,Done:bar.done},{name:bar.activityType,type:2,ToDo:bar.todo},{name:bar.activityType,type:3,NotDone:bar.notdone}]
    //     arr.map(data=>{
    //       barTemp.push(data);
    //         })
    //     })
            setSeries([{'data':chartData?.activityStatusByCategorys?.map(data=>data?.done),
                'name': 'Done'},
                {'data':chartData?.activityStatusByCategorys?.map(data=>data?.todo),
                'name': 'To Do'},
                {'data':chartData?.activityStatusByCategorys?.map(data=>data?.notdone),
                'name': 'Not Done'},
                ])
            setCategories(chartData?.activityStatusByCategorys?.map(data=>data?.activityType));

        setBarData({
            'series' : series,
            'categories' : categories
        });


      let stackedTemp = [];
      let keysForChart = [];
      let months = {'1':'Jan','2':'Feb','3':'March','4':'April','5':'May','6':'June','7':'July','8':'Aug','9':'Sep','10':'Oct','11':'Nov','12':'Dec'};
      chartData?.completedActivitiesBycategoryAndMonth?.map((stack,index)=>{
       let values = stack.types;
       keysForChart = Object.keys(stack.types);
       setStackedKeys(keysForChart);
       values['name'] = months[stack?.month];
       values['type'] = 1;
       stackedTemp.push(values);
      })
      let tempStackedSeries = [];
      keysForChart?.map((data, index) => {
        tempStackedSeries.push({'data':stackedTemp?.map(stackedData=>stackedData?.[data]),
        'name': data})
        setStackedSeries(tempStackedSeries);
      })
      setStackedData(stackedTemp);
      setStackedCategories(stackedTemp?.map(stackedData=>stackedData?.name));
    }
  }


    const getAcvityAndServicesWithParameter = async() => {
        const {data:chartData} = await GET(`timesheet-management-service/report/activityServiceReport?startDate=2022-06-07&endDate=2022-09-07&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
        const {data:reportLogData} = await GET('timesheet-management-service/report/activityServiceLog?startDate=2022-06-07&endDate=2022-09-07');
        setReportLog(reportLogData);
        if(chartData){
        let temp = [];
        chartData?.activityServiceReports?.map((pie,index)=>{
            temp[index] = {key:pie.activityStatus, value:pie.count}
        })
        setPieData(temp);
        let lineTemp = [];
        chartData?.completedActivitiesByDate?.map((line,index)=>{
            lineTemp[index] = {date:line.statedate, value:line.count};
        })
        lineTemp.sort((a,b)=>new Date(a.date)-new Date(b.date));
        setLineData(lineTemp);
        // let barTemp = [];
        // chartData?.activityStatusByCategorys?.map((bar,index)=>{
        //     let arr = [{name:bar.activityType,type:1,Done:bar.done},{name:bar.activityType,type:2,ToDo:bar.todo},{name:bar.activityType,type:3,NotDone:bar.notdone}]
        //     arr.map(data=>{
        //     barTemp.push(data);
        //     })
        // })
        // setBarData(barTemp);
        setSeries([{'data':chartData?.activityStatusByCategorys?.map(data=>data?.done)},
                {'data':chartData?.activityStatusByCategorys?.map(data=>data?.notdone)},
                {'data':chartData?.activityStatusByCategorys?.map(data=>data?.todo)}])
        setCategories(chartData?.activityStatusByCategorys?.map(data=>data?.activityType));

        setBarData({
            'series' : series,
            'categories' : categories
        });
        let stackedTemp = [];
        let keysForChart = [];
        let months = {'1':'Jan','2':'Feb','3':'March','4':'April','5':'May','6':'June','7':'July','8':'Aug','9':'Sep','10':'Oct','11':'Nov','12':'Dec'};
        chartData?.completedActivitiesBycategoryAndMonth?.map((stack,index)=>{
         let values = stack.types;
         keysForChart = Object.keys(stack.types);
         setStackedKeys(keysForChart);
         values['name'] = months[stack?.month];
         values['type'] = 1;
         stackedTemp.push(values);
        })
        let tempStackedSeries = [];
        keysForChart?.map((data, index) => {
            tempStackedSeries.push({'data':stackedTemp?.map(stackedData=>stackedData?.[data]),
            'name': data})
            setStackedSeries(tempStackedSeries);
        })
        setStackedData(stackedTemp);
        setStackedCategories(stackedTemp?.map(stackedData=>stackedData?.name));
    }
  }

  console.log(stackedSeries, stackedCategories)
    const getUsersData = async() => {
        const {data: user} = await GET('user-management-service/user');
        if(user){
          setUsers(user);
        }
    }

    const getDataToUseInReport = (value) => {
        setDataToUseInReport(value);
    }

    const getContractRenewalReport = async() => {
        const {data: contractRenewalReport} = await GET('contract-managment-service/reports/contractRenewalReport');
        if(contractRenewalReport){
            setContractRenewalReport(contractRenewalReport);
        }
    }

    const getContractRenewalReportWithParameters = async() => {
        const {data: contractRenewalReport} = await GET(`contract-managment-service/reports/contractRenewalReport?sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}&renewalDays=${dataToUseInReport?.renewalTimeFrame}&contractPolicyType=${dataToUseInReport?.contractContinuationPolicy}`);
        if(contractRenewalReport){
            setContractRenewalReport(contractRenewalReport);
        }
    }

    const getOneTimeContract = async() => {
        const {data: oneTimeContract} = await GET(`contract-managment-service/reports/oneTimeContractReport`);
        if(oneTimeContract){
            setOneTimeContract(oneTimeContract);
        }
    }

    const getOneTimeContractWithParameters = async() => {
        const {data: oneTimeContract} = await GET(`contract-managment-service/reports/oneTimeContractReport?renewalDays=${dataToUseInReport?.renewalTimeFrame}`);
        if(oneTimeContract){
            setOneTimeContract(oneTimeContract);
        }
    }

    const getNonCompliantContractReportTile = async() => {
        const {data: nonCompliantContract} = await GET(`contract-managment-service/reports/documentProofReport`);
        if(nonCompliantContract){
            setNonCompliantContractTile(nonCompliantContract);
        }
    }

    const getNonCompliantContractReport = async() => {
        const {data: nonCompliantContract} = await GET(`contract-managment-service/reports/nonCompliantContractReport?podType=${encodeURIComponent(selectedPodTypeFromTile)}&contractStatus=${dataToUseInReport?.contractStatus}&contractNames=${dataToUseInReport?.selectedContracts}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
        if(nonCompliantContract){
            setNonCompliantContract(nonCompliantContract);
        }
    }

    const getShowExpandedView = (value) => {
        setShowExpandedView(value);
    }

    return(
        <Fragment>
            <Navbar />
            <div className={`${!showExpandedView && style.bigCardGrid} ${style.margin20WithoutTop} ${style.marginTop10}`}>
                {!showExpandedView && (
                    <SampleReportLeftCard getDataToUseInReport={getDataToUseInReport} />
                )}
                <StyledWatermark
                    text="CONFIDENTIAL"
                    style={{
                    width: '100%',
                    height: '100%'
                    }}
                    multiple
                >
                    <div>
                        <ReportPerformanceAndOptions getShowExpandedView={getShowExpandedView} showExpandedView={showExpandedView} />
                        <div className={`${style.reportBackgroundCard} ${style.marginTop20}`}>
                            <ReportHeader />
                            <div className={style.justifyCenter}>
                                <div className={style.marginTop20}>
                                    <div className={`${style.entityNameHeaderStyle} ${style.textAlignCenter} ${style.marginTop5}`}>
                                        {reportType === "upcomingContractRenewals" ? 'Upcoming Contract Renewals'
                                        : reportType === "oneTimeContract" ? "List of One Time Contracts that will Terminate on Expiration"
                                        : reportType === "scheduledActivity" ? "Scheduled Activity/ Services - Forcasted To Actual"
                                        : reportType === "scheduledActivityByContract" ? "Scheduled Activity/ Services - Forcasted To Actual By Contract"
                                        : reportType === "complianceStatus" ? "Proof Of Documentation Status By Contractor"
                                        : reportType === "nonCompliant" ? 'List of Contracts that are non compliant with proof of documentation requirement'
                                        : 'Activities/ Services Log Status Summary'}
                                    </div>
                                    {dataToUseInReport?.reportingTimePeriod !== "" && (
                                        <div className={`${style.reportRunByTextStyle} ${style.textAlignCenter} ${style.marginTop5}`}>Reporting Period used for this report : {dataToUseInReport?.reportingTimePeriod} </div>
                                    )}
                                </div>
                            </div>
                            <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                            <div className={style.marginTop20}>
                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Reporting Parameters Applied</div>
                                {(reportType === "upcomingContractRenewals" || reportType === "oneTimeContract" ) ? (
                                    <div className={`${style.grid3} ${style.marginTop20}`}>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Renewal Time Frame </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{`Renewal within Next ${dataToUseInReport?.renewalTimeFrame} days`}</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Sites </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Departments</div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>All Departments</div>
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
                                    <div className={`${style.grid3} ${style.marginTop20}`}>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Reporting Time Period </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.reportingTimePeriod}</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Sites </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Departments</div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>All Departments</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracts </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ') || 'All Contracts'}</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracted Service Provider </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedContractedServiceProviderToSend?.map(data => data?.name?.firstName).join(', ') || 'All'}</div>
                                        </div>
                                    </div>
                                ) : (reportType === "nonCompliant") ? (
                                    <div className={`${style.grid3} ${style.marginTop20}`}>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Sites </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Departments</div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>All Departments</div>
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
                                            : dataToUseInReport?.contractStatus === 'TERMINATED' ? 'Terminated' : '' }</div>
                                        </div>
                                        <div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Proof Of Documentation </div>
                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{dataToUseInReport?.podType || 'Select One'}</div>
                                        </div>
                                    </div>
                                ) : (
                                <div className={`${style.grid3} ${style.marginTop20}`}>
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
                                            <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Activity / Services Status</div>
                                            {/* <Pie data={pieData} width={250} height={250} innerRadius={0} outerRadius={100} /> */}
                                            <ApexPieChart pieData={pieData} />
                                        </div>

                                        <div>
                                            <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop20}`}>Activity / Services Status</div>
                                            <div className={style.marginTop20}>
                                                {/* <BarChart data={barData}/> */}
                                                <ApexGroupedBarChart series={series} categories={categories} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
                                    <div className={style.marginTop40}>
                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Trend For Activities / Services Completed</div>
                                        {/* <LineChart /> */}
                                        <ApexLineChart lineData={lineData} />
                                    </div>
                                    <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
                                    <div className={style.marginTop40}>
                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Percentage Of Activities / Services Completed By Category Type</div>
                                        {/* <StackedBarChartBaseLayout1 chartData={stackedData}/> */}
                                        <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />
                                    </div>
                                    <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                    <div className={style.marginTop20}>
                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Completed Activity / Service Log</div>
                                        <div className={`${style.grid5} ${style.marginTop20}`}>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Activity/ Services</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Scheduled Date/ Time</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Completion Date/ Time</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracted Provider</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Site</div>
                                        </div>
                                        {
                                          reportLog?.filter(data=>data?.activityStatus === "DONE")?.map(data=>(
                                            <div className={`${style.grid5} ${style.marginTop20}`}>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityPerformed?.activity}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityTimeFrame?.stateDate}, {data?.activityTimeFrame?.startTime}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityTimeFrame?.endDate}, {data?.activityTimeFrame?.endTme}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(user=>user?.id === data?.user?.id)?.map(data=>data?.name?.firstName)[0]}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>-</div>
                                            </div>
                                          ))
                                        }
                                    </div>
                                    <div className={style.marginTop40}>
                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>To Do Activity/ Services</div>
                                        <div className={`${style.grid5} ${style.marginTop20}`}>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Activity/ Services</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Scheduled Date/ Time</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracted Provider</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Site</div>
                                            <div></div>
                                        </div>
                                        {
                                          reportLog?.filter(data=>data?.activityStatus === "TODO")?.map(data=>(
                                            <div className={`${style.grid5} ${style.marginTop20}`}>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityPerformed?.activity}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityTimeFrame?.stateDate}, {data?.activityTimeFrame?.startTime}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(user=>user?.id === data?.user?.id)?.map(data=>data?.name?.firstName)[0]}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>-</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}></div>
                                            </div>
                                          ))
                                        }
                                    </div>
                                    <div className={style.marginTop40}>
                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Not Done Activity / Service Log</div>
                                        <div className={`${style.grid5} ${style.marginTop20}`}>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Activity/ Services</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Scheduled Date/ Time</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracted Provider</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Site</div>
                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Reason Not Done</div>
                                        </div>
                                        {
                                          reportLog?.filter(data=>data?.activityStatus === "NOTDONE")?.map(data=>(
                                            <div className={`${style.grid5} ${style.marginTop20}`}>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityPerformed?.activity}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityTimeFrame?.stateDate}, {data?.activityTimeFrame?.startTime}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(user=>user?.id === data?.user?.id)?.map(data=>data?.name?.firstName)[0]}</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>-</div>
                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.activityNotes?.notes}</div>
                                            </div>
                                          ))
                                        }
                                    </div>
                                </>
                                ) : (reportType === "scheduledActivity" || reportType === "scheduledActivityByContract") ? (
                                    <>
                                        <div className={style.grid2}>
                                            <div>
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Hours Completed Summary</div>
                                                <div className={style.marginTop20}>
                                                    <StackedBarChartBaseLayout2 />
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20}`}>Dollars Paid Summary</div>
                                                <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                            </div>
                                        </div>
                                        <div className={`${style.headerBorderStyle}`}></div>
                                        <div className={style.contractNameCardStyle}>Contract Name 1 - Individual Contractor Contract</div>
                                        <div className={`${style.grid2} ${style.marginTop40}`}>
                                            <div>
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Hours Completed Summary</div>
                                                <div className={style.marginTop20}>
                                                    <StackedBarChartBaseLayout2 />
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20}`}>Dollars Paid Summary</div>
                                                <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                            </div>
                                        </div>
                                        <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                        <div className={style.marginTop40}>
                                            <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Scheduled Activity/ Services Completion Status</div>
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
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20}`}>Hours Completed Summary</div>
                                                <div className={style.marginTop20}>
                                                    <StackedBarChartBaseLayout2 />
                                                </div>
                                            </div>
                                            <div>
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20}`}>Dollars Paid Summary</div>
                                                <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                            </div>
                                        </div>
                                        <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                        <div className={style.marginTop40}>
                                            <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Scheduled Activity/ Services Completion Status</div>
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
                                            <div className={style.marginTop40}>
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Individual Service Provider Contract Renewal</div>
                                                <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`}>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Name</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract ID</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Expiration Date</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracting Entity</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact Number</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Email Address</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}></div>
                                                </div>
                                                {individualContract?.map((data, index) => (
                                                    <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`} key={index}>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractName?.contractName}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractDetail?.contractId?.id}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{format(new Date(data?.contractDetail?.contractTerm?.endDate), 'MM-dd-yyyy')}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-'}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber)}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail)}</div>
                                                        <div></div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {multipleContract?.length !== 0 && (
                                            <div className={style.marginTop40}>
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Multiple Service Provider Contract Renewal</div>
                                                <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`}>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Name</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract ID</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Expiration Date</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracting Entity</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact Number</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Email Address</div>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Service Providers</div>
                                                </div>
                                                {multipleContract?.map((data, index) => (
                                                    <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`} key={index}>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractName?.contractName}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractDetail?.contractId?.id}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{format(new Date(data?.contractDetail?.contractTerm?.endDate), 'MM-dd-yyyy')}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-'}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber)}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail)}</div>
                                                        <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>6</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : reportType === "complianceStatus" ? (
                                    <>
                                        <div className={style.marginTop40}>
                                            <StackedBarChartBaseLayout3 />
                                        </div>
                                        <div className={`${style.mildBorderStyle} ${style.marginTop20}`}></div>
                                        <div className={style.marginTop40}>
                                            <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Non Compliant Providers With Required Documents</div>
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
                                                <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Providers With Required Documents Needing Compliance Within Next 30 Days</div>
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
                                                    <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Providers In Compliance With Required Documents</div>
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
                                                    <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Contracts With No {selectedPodTypeFromTile} Proof Of Documentation</div>
                                                        <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`}>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Name</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract ID</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Manager</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Effective Date</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracting Entity</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Phone Number</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Email Address</div>
                                                        </div>
                                                        {nonCompliantContract?.documentNotUploadedContracts?.map((data, index) => (
                                                            <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`} key={index}>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractName?.contractName}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractDetail?.contractId?.id}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy')}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-'}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {nonCompliantContract?.expiredContracts?.length !== 0 && (
                                                <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Contracts With Expired {selectedPodTypeFromTile}</div>
                                                        <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`}>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Name</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract ID</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Manager</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Liability Insurance Exploration</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracting Entity</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Phone Number</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Email Address</div>
                                                        </div>
                                                        {nonCompliantContract?.expiredContracts?.map((data, index) => (
                                                            <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`} key={index}>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractName?.contractName}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractDetail?.contractId?.id}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy')}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-'}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {nonCompliantContract?.renewalContracts?.length !== 0 && (
                                                <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Contracts With Renewals in next 30 days {selectedPodTypeFromTile}</div>
                                                        <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`}>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Name</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract ID</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Manager</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Effective Date</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracting Entity</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Phone Number</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Email Address</div>
                                                        </div>
                                                        {nonCompliantContract?.renewalContracts?.map((data, index) => (
                                                            <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`} key={index}>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractName?.contractName}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractDetail?.contractId?.id}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy')}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-'}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {nonCompliantContract?.notExpiredContracts?.length !== 0 && (
                                                <div className={style.marginTop40}>
                                                        <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>Contracts With Not Expired {selectedPodTypeFromTile}</div>
                                                        <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`}>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Name</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract ID</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Manager</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contract Effective Date</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Contracting Entity</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Point of Contact</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Phone Number</div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`}>Email Address</div>
                                                        </div>
                                                        {nonCompliantContract?.notExpiredContracts?.map((data, index) => (
                                                            <div className={`${style.individualServiceReportGrid} ${style.marginTop20}`} key={index}>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractName?.contractName}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractDetail?.contractId?.id}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy')}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-'}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} {user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber)}</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                </>
                                            ) : (
                                                <div className={`${style.complianceGrid2} ${style.marginTop20}`}>
                                                    {podTypes?.map((data, index) => (
                                                    <div className={`${style.complianceCardStyle} ${style.cursorPointer}`} key={index} onClick={() => {setIsNonCompliantReportTileClicked(true);setSelectedPodTypeFromTile(data)}}>
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
                            <ReportFooter />
                        </div>
                    </div>
                </StyledWatermark>
            </div>
        </Fragment>
    )
}

export default ReportTypeOverview;
