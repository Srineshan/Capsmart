import React, { Fragment, useState, useEffect, cloneElement } from 'react';
import Navbar from './../../Components/Navbar';
import SideBar from '../../Components/Sidebar';
// import DataGrid from 'react-data-grid';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import { GET } from '../dataSaver';
import { useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { format } from 'date-fns';
import Select from '@mui/material/Select';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

import 'react-data-grid/lib/styles.css';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import style from './index.module.scss';
import TrackTable from '../../Components/TrackTable';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const TrackYourContracts = () => {
    const { trackType } = useParams();
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedContractedServiceProvider, setSelectedContractedServiceProvider] = useState('');
    const [contractedServiceProviders, setContractedServiceProviders] = useState([]);
    const [contracts, setContracts] = useState([]);
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(userDetail?.id);
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [activityTrackServices, setActivityTrackServices] = useState([]);
    const [contractTrackCompensationValues, setContractTrackCompensationValues] = useState([]);
    let months = { 1: 'Jan', 2: 'Feb', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
    // const columns = [
    //     { key: 'id', name: 'ID' },
    //     { key: 'title', name: 'Title' }
    // ];

    // const rows = [
    //     { id: 0, title: 'Example' },
    //     { id: 1, title: 'Demo' }
    // ];

    console.log(trackType)


    const getColumns = () => {
        let tempCol = [
            { field: 'service', headerName: '', width: 280 },
            { field: 'hourlyRate', headerName: 'Pro-Rata Hourly Rate', width: 140 },
            { field: 'cyExpectedHours', headerName: 'Expected (Hours)', width: 140 },
            { field: 'cyExpectedAmount', headerName: 'Expected (Amount)', width: 140 },
            { field: 'cy1m1ExpectedHours', headerName: 'Expected (Hours)', width: 140 },
            { field: 'cy1m1ExpectedAmount', headerName: 'Expected (Amount)', width: 140 },
        ];

        contractTrackCompensationValues?.map((data, index) => {
            data?.timesheetActivitiesWithActualValuesList?.map((actualValue, actualIndex) => {
                tempCol.push({ field: `cy${index + 1}m${actualIndex + 2}ActualHours`, headerName: `Actual (Hours)`, width: 140 })
                tempCol.push({ field: `cy${index + 1}m${actualIndex + 2}ActualAmount`, headerName: `Actual (Amount)`, width: 140 })
            })
        })

        return tempCol;
    }

    const getRows = () => {
        let tempRow = [];

        contractTrackCompensationValues?.map((data, index) => {
            console.log(data)
            data?.activityWithExpectedValuesList?.map((expectedValue, expectedIndex) => {
                tempRow.push({
                    id: `${expectedIndex}`,
                    service: `${expectedValue?.activityType} - ${expectedValue?.performingActivity}`,
                    hourlyRate: `${expectedValue?.hourlyRate}`,
                    cyExpectedHours: expectedValue?.expectedHoursInYear,
                    cyExpectedAmount: expectedValue?.expectedAmountInYear,
                    cy1m1ExpectedHours: expectedValue?.expectedHoursInMonth,
                    cy1m1ExpectedAmount: expectedValue?.expectedAmountInMonth
                })
            })
            data?.timesheetActivitiesWithActualValuesList?.map((timesheetData, timesheetIndex) => {
                timesheetData?.activityWithActualValuesList?.map((actualValue, actualIndex) => {
                    tempRow[actualIndex][`cy${index + 1}m${timesheetIndex + 2}ActualHours`] = actualValue?.actualHours
                    tempRow[actualIndex][`cy${index + 1}m${timesheetIndex + 2}ActualAmount`] = `$ ${actualValue?.actualAmount?.toLocaleString()}`
                })
            })
        });

        return tempRow;
    }

    const getColumnGroupingModel = () => {
        if (contractTrackCompensationValues?.length !== 0) {
            console.log(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate)
            let columnGroupingModel = [
                {
                    groupId: `Service Name`,
                    headerName: '',
                    headerClassName: style.groupBorderTop,
                    description: '',
                    children: [{ field: 'service' }],
                },
                {
                    groupId: `Hourly Rate`,
                    headerName: '',
                    description: '',
                    children: [{ field: 'hourlyRate' }],
                },
                {
                    groupId: `CY ${format(new Date(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate), 'yyyy')}`,
                    description: '',
                    children: [{ field: 'cyExpectedHours' }, { field: 'cyExpectedAmount' }],
                },
                {
                    groupId: `CY1 M1 (${format(new Date(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate), 'yyyy')})`,
                    description: '',
                    children: [{ field: 'cy1m1ExpectedHours' }, { field: 'cy1m1ExpectedAmount' }],
                },
            ];
            contractTrackCompensationValues?.map((data, index) => {
                data?.timesheetActivitiesWithActualValuesList?.length !== 0 &&
                    data?.timesheetActivitiesWithActualValuesList?.map((actualValue, actualIndex) => {
                        columnGroupingModel?.push({
                            groupId: `CY${index + 1} M${actualIndex + 2} (${months[actualValue?.month]} ${actualValue?.year})`,
                            description: '',
                            children: [{ field: `cy${index + 1}m${actualIndex + 2}ActualHours` }, { field: `cy${index + 1}m${actualIndex + 2}ActualAmount` }],
                        })
                    })
            })
            return columnGroupingModel;
        }
    }

    const customToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    console.log(getColumns(), getRows(), getColumnGroupingModel())


    const compensationPolicy = {
        ACTIVITY_BASED: 'Activity Based',
        SHIFT_OR_PER_DAY_BASED: 'Shift Or Per Day Based',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET: 'Fixed Amount For Timesheet Period With Offset',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET: 'Fixed Amount For Timesheet Period Without Offset',
    }

    useEffect(() => {
        setUserId(userDetail?.id);
        setUserDetails();
        getActivityLogger();
        getContractAndUserList();
    }, [])

    const getContractAndUserList = async () => {
        const { data: contractAndUserList } = await GET(`contract-managment-service/reports/filter/usersAndContracts?reportCategory=TIMESHEET`);
        console.log(contractAndUserList)
        setContracts(contractAndUserList?.contracts);
    }

    // useEffect(() => {
    //     setContracts(currentUserDetails?.contracts);
    // }, [currentUserDetails])

    useEffect(() => {
        getContractTrackValues();
    }, [selectedContractedServiceProvider])

    useEffect(() => {
        if (selectedContracts?.length !== 0) {
            getContractTrackCompensation();
        }
    }, [selectedContracts])

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const getActivityLogger = async () => {
        const { data: user } = await GET(`user-management-service/user?userType=CONTRACTED_SERVICE_PROVIDER_USER`);
        setContractedServiceProviders(user);
    }

    const getContractTrackValues = async () => {
        const { data: data } = await GET(`timesheet-management-service/activity/track/services?userIds=${[selectedContractedServiceProvider]}`);
        setActivityTrackServices(data);
        console.log(data)
    }

    const getContractTrackCompensation = async () => {
        const { data: data } = await GET(`timesheet-management-service/timesheet/track/compensation?contractId=${selectedContracts}`);
        setContractTrackCompensationValues(data);
        console.log(data)
    }

    const setUserDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
    }

    const handleChangeContracts = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedContracts(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    let service = [];
    let expectedUnits = [];
    let expectedHours = [];
    let completedUnits = [];
    let completedHours = [];
    let toBeProposedUnits = [];
    let toBeProposedHours = [];
    let balanceUnits = [];
    let balanceHours = [];
    let nteValues = [];
    const getTrackTableValue = (serviceValues) => {
        console.log(serviceValues);

        service = [];
        expectedUnits = [];
        expectedHours = [];
        completedUnits = [];
        completedHours = [];
        toBeProposedUnits = [];
        toBeProposedHours = [];
        balanceUnits = [];
        balanceHours = [];
        nteValues = [];
        serviceValues?.activityStatsByContract?.map((data, index) => {
            let typesToFilter = ['array']
            let filteredServiceValues = Object.fromEntries(
                Object.entries(data?.activityStatsMeta).filter(([key, value]) => {
                    const valueType = Array.isArray(value) ? 'array' : typeof value;
                    return typesToFilter.includes(valueType);
                })
            )
            console.log(filteredServiceValues)
            Object.keys(filteredServiceValues)?.map(data => {
                if (filteredServiceValues?.[data]?.length !== 0) {
                    service?.push({ type: 'parentChildService', name: data, values: filteredServiceValues?.[data]?.map(data => `${data?.activityType} (${data?.timeBlock})`) })
                    expectedUnits?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.contractYearExpected?.units) })
                    expectedHours?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.contractYearExpected?.hours) })
                    completedUnits?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.complated?.units) })
                    completedHours?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.complated?.hours) })
                    toBeProposedUnits?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.inprogress?.units) })
                    toBeProposedHours?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.inprogress?.hours) })
                    balanceUnits?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.balance?.units), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.yellowBigNumber : style.redBigNumber) })
                    balanceHours?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.balance?.hours), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.yellowBigNumber : style.redBigNumber) })
                }
            })

        })
        nteValues?.push({ type: 'nteAmount', values: serviceValues?.activityStatsByContract?.[0]?.activityStatsMeta?.contractBalancePaymentSummary })


        return [service,
            expectedUnits,
            expectedHours,
            completedUnits,
            completedHours,
            toBeProposedUnits,
            toBeProposedHours,
            balanceUnits,
            balanceHours,
            nteValues]

    }

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth} ${style.padding20}`}>
                                <CommonSelectField
                                    value={selectedContractedServiceProvider || ""}
                                    onChange={(e) => setSelectedContractedServiceProvider(e.target.value)}
                                    firstOptionLabel={"Select a service provider"}
                                    firstOptionValue={""}
                                    valueList={contractedServiceProviders?.map(data => data?.id)}
                                    labelList={contractedServiceProviders?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`)}
                                    disabledList={contractedServiceProviders?.map(data => false)}
                                />
                            </div>
                        </SideBar>
                    </div>
                    <div className={`${style.bigCardFullHeightStyle} ${style.excelTable} ${style.padding20}`}>
                        {trackType === 'compensationTracker' ? (
                            <>
                                <div className={style.displayInRow}>
                                    <div className={style.trackServiceProviderName}>{selectedContractedServiceProvider !== '' ? `${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.firstName} ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.lastName}, ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.suffix?.suffix}` : '-'}</div>
                                    <div className={`${style.trackTableContractCountHeading} ${style.marginLeft20}`}>Contracts</div>
                                    <div className={`${style.trackTableContractCount} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginLeft20}`}>{selectedContracts?.length}</div>
                                </div>
                                <div className={style.displayInRow}>
                                    <div className={style.trackTableContractLabel}>Services Compensation Tracking & Monitoring For</div>
                                    <FormControl sx={{ m: 1, width: '250px' }}>
                                        <Select
                                            labelId="demo-multiple-name-label5"
                                            id="demo-multiple-name5"
                                            multiple
                                            value={selectedContracts}
                                            onChange={handleChangeContracts}
                                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                        >
                                            {contracts?.map((data) => (
                                                <MenuItem
                                                    key={data?.id}
                                                    value={data?.id}
                                                >
                                                    {data?.contractName?.contractName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <PrintOutlinedIcon sx={{ color: '#857AEF' }} />
                                    <DownloadIcon sx={{ color: '#857AEF' }} />
                                </div>
                                <div className={`${style.trackTableBackgroudcard} ${style.marginTop20}`}>
                                    {/* <DataGrid columns={columns} rows={rows} className='rdg-light' />; */}
                                    {contractTrackCompensationValues?.length !== 0 && (
                                        <DataGrid
                                            rows={getRows()}
                                            columns={getColumns()}
                                            // initialState={{
                                            //     pagination: {
                                            //         paginationModel: {
                                            //             pageSize: 5,
                                            //         },
                                            //     },
                                            // }}
                                            // pageSizeOptions={[5]}
                                            sx={{
                                                "& .MuiDataGrid-withBorderColor": {
                                                    borderColor: '#646D82'
                                                }
                                            }}
                                            experimentalFeatures={{ columnGrouping: true }}
                                            className={`${style.whiteBackground} ${style.muiDataGridWithBorderColor}`}
                                            columnGroupingModel={getColumnGroupingModel()}
                                            slots={{
                                                toolbar: customToolbar,
                                            }}
                                            showCellVerticalBorder={true}
                                            showColumnVerticalBorder={true}
                                            rowHeight={35}
                                            columnHeaderHeight={35}
                                        />
                                    )}
                                </div>
                                <div>

                                </div>
                            </>
                        ) : (
                            <>
                                <div className={style.spaceBetween}>
                                    <div className={style.trackServiceProviderName}>{`STATUS OF ACTIVITIES/ SERVICES BY SERVICE PROVIDER FOR ${format(new Date(), 'MMMM yyyy')}`}</div>
                                    <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} style={{ color: "#7165E3" }} />
                                </div>
                                {selectedContractedServiceProvider !== '' && (
                                    <div className={`${style.trackPeriodCard} ${style.marginTop20} ${style.spaceBetween} ${style.padding20}`}>
                                        <div className={style.trackContractUserAndPeriod}>{`${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.firstName} ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.lastName}, ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.suffix?.suffix} - ${format(new Date(), 'MMMM yyyy')}`}</div>
                                        <div className={style.trackContractOrAgreementCount}>{activityTrackServices?.length} Contracts/ Service Agreements</div>
                                    </div>
                                )}
                                {activityTrackServices?.map(data => (
                                    <TrackTable
                                        heading={`${data?.activityStatsByContract?.[0]?.contract?.contractName?.contractName} - ${data?.activityStatsByContract?.[0]?.contract?.contractId?.id}`}
                                        columnHeading={[
                                            `Compensation Policy: ${compensationPolicy[data?.activityStatsByContract?.[0]?.contract?.compensationPolicy]}`,
                                            `Contract Period: ${format(new Date(data?.activityStatsByContract?.[0]?.contract?.contractTerm?.startDate), 'MMM d, yyyy')} - ${format(new Date(data?.activityStatsByContract?.[0]?.contract?.contractTerm?.endDate), 'MMM d, yyyy')}`,
                                            'San Mateo Medical Center'
                                        ]}
                                        tableHead={['CONTRACTED ACTIVITY / SERVICES', 'EXPECTED', 'COMPLETED', 'TO BE PROCESSED', 'BALANCE', '']}
                                        tableHeadTop={['', `Contract Year: ${format(new Date(data?.activityStatsByContract?.[0]?.activityStatsMeta?.contractYearInterval?.startDate), 'MMM d, yyyy')} - ${format(new Date(data?.activityStatsByContract?.[0]?.activityStatsMeta?.contractYearInterval?.endDate), 'MMM d, yyyy')}`]}
                                        tableHeadBottom={['', 'UNITS', 'HOURS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', '']}
                                        tableData={getTrackTableValue(data)}
                                        headerGrid={style.trackTableHeaderGrid}
                                        dataGrid={style.trackTableDataGrid}
                                        tableHeadGrid={style.trackTableHeaderMiddleGrid}
                                        tableHeadTopGrid={style.trackTableHeaderTopGrid}
                                        tableHeadBottomGrid={style.trackTableHeaderBottomGrid}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default TrackYourContracts;