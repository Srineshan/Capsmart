import React, { Fragment, useState, useEffect, cloneElement } from 'react';
import Navbar from './../../Components/Navbar';
import SideBar from '../../Components/Sidebar';
import DataGrid from 'react-data-grid';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import { GET } from '../dataSaver';
import { useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { format } from 'date-fns';
import Select from '@mui/material/Select';
import 'react-data-grid/lib/styles.css';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

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
    const columns = [
        { key: 'id', name: 'ID' },
        { key: 'title', name: 'Title' }
    ];

    const rows = [
        { id: 0, title: 'Example' },
        { id: 1, title: 'Demo' }
    ];

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
    }, [])

    useEffect(() => {
        setContracts(currentUserDetails?.contracts);
    }, [currentUserDetails])

    useEffect(() => {
        getContractTrackValues();
    }, [selectedContractedServiceProvider])

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
                    balanceUnits?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.balance?.units), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.redBigNumber : style.yellowBigNumber) })
                    balanceHours?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.balance?.hours), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.redBigNumber : style.yellowBigNumber) })
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
                                </div>
                                <div className={`${style.trackTableBackgroudcard} ${style.marginTop20}`}>
                                    <DataGrid columns={columns} rows={rows} className='rdg-light' />;
                                </div>
                                <div>

                                </div>
                            </>
                        ) : (
                            <>
                                <div className={style.spaceBetween}>
                                    <div className={style.trackServiceProviderName}>STATUS OF ACTIVITIES/ SERVICES BY SERVICE PROVIDER FOR NOVEMBER 2023</div>
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