import React, {useEffect, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import Select from '@mui/material/Select';
import {GET} from './../dataSaver';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import Box from '@mui/material/Box';
import SaveReport from './saveReport';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import { useParams } from 'react-router-dom';

import style from './index.module.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const SampleReportLeftCard = ({getDataToUseInReport}) => {
    const [showSaveReport, setShowSaveReport] = useState(false);
    const {reportType} = useParams();
    const [activityType, setActivityType] = useState('Outpatient Clinic Service');
    const [activityPerformed, setActivityPerformed] = useState('Half Day Clinic Session');
    const [renewalTimeFrame, setRenewalTimeFrame] = useState(30);
    const [contractContinuationPolicy, setContractContinuationPolicy] = useState('');
    const [contractStatus, setContractStatus] = useState('ACTIVE');
    const [podType, setPodType] = useState('Medical Staff Membership & Privileges');
    const [reportingTimePeriod, setReportingTimePeriod] = useState('');
    const [selectedSites, setSelectedSites] = useState([]);
    const [selectedSitesToSend, setSelectedSitesToSend] = useState([]);
    const [selectedContractsToSend, setSelectedContractsToSend] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedDepartmentsToSend, setSelectedDepartmentsToSend] = useState([]);
    const [sites, setSites] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [selectedContractedServiceProvider, setSelectedContractedServiceProvider] = useState([]);
    const [selectedContractedServiceProviderToSend, setSelectedContractedServiceProviderToSend] = useState([]);
    const [user,setUsers] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);


    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);

    let dataToUseInReport = {
        renewalTimeFrame: renewalTimeFrame,
        selectedSites: selectedSites,
        selectedSitesToSend: selectedSitesToSend,
        selectedDepartments: selectedDepartments,
        selectedDepartmentsToSend: selectedDepartmentsToSend,
        contractContinuationPolicy: contractContinuationPolicy,
        sites: sites,
        contractStatus: contractStatus,
        selectedContracts: selectedContracts,
        selectedContractsToSend: selectedContractsToSend,
        podType: podType,
        reportingTimePeriod: reportingTimePeriod,
        selectedContractedServiceProvider: selectedContractedServiceProvider,
        selectedContractedServiceProviderToSend: selectedContractedServiceProviderToSend,
    };

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
        getSites();
        getContracts();
        getUsersData();
    }, []) 

    useEffect(() => {
        getDataToUseInReport(dataToUseInReport);
    }, [renewalTimeFrame, selectedSites, selectedDepartments, contractContinuationPolicy, selectedContracts,
    podType, contractStatus, reportingTimePeriod, selectedContractedServiceProvider, 
    selectedContractedServiceProviderToSend])

    const handleChange = (event) => {
        setActivityType(event.target.value);
    };

    const handleChangeActivityPerformed = (event) => {
        setActivityPerformed(event.target.value);
    };

    const getSaveReportDialog = (value) => {
        setShowSaveReport(value);
    }

    const getSites = async () => {
        const {data:sites} = await GET('entity-service/sites');
        if(sites){
          setSites(sites);
      }
    }

    const getContracts = async() => {
        const {data: contracts} = await GET(`contract-managment-service/contracts`);
        setContracts(contracts?.contractList);
    };

    const getUsersData = async() => {
        const {data: user} = await GET('user-management-service/user');
        if(user){
          setUsers(user);
        }
    }

    const handleChangeSites = (event) => {
        const {
          target: { value },
        } = event;

        setSelectedSites(
          typeof value === 'string' ? value.split(',') : value
        );
        setSelectedSitesToSend(
            typeof value === 'string' ? sites?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : sites?.filter(data => value?.includes(data?.id))?.map(data => data),
          );
    };

    const handleChangeContracts = (event) => {
        const {
          target: { value },
        } = event;

        setSelectedContracts(
          typeof value === 'string' ? value.split(',') : value
        );
        setSelectedContractsToSend(
            typeof value === 'string' ? contracts?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : contracts?.filter(data => value?.includes(data?.id))?.map(data => data),
          );
    };

    const handleChangeContractedServiceProviders = (event) => {
        const {
          target: { value },
        } = event;

        setSelectedContractedServiceProvider(
          typeof value === 'string' ? value.split(',') : value
        );
        setSelectedContractedServiceProviderToSend(
            typeof value === 'string' ? user?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : user?.filter(data => value?.includes(data?.id))?.map(data => data),
          );
    };

    return(
        <div>
            <div className={style.cardStyle}>
                <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                    <div className={style.displayInRow}>
                        <img src={UserLogo} className={style.userLogo} />
                        <div className={`${style.marginLeft10} ${style.marginTop}`}>
                            <div className={style.userNameStyle}>
                                Hi, {userDetail?.userName}
                            </div>
                            <div className={style.loginStatus}>
                                last login SEP 7,21 11:48 am
                            </div>
                        </div>
                    </div>
                    <img src={ChevronRight} className={style.roundChevronForUser} />
                </div>
            </div>
            <div className={`${style.leftCard} ${style.marginTop20}`}>
                <div className={style.reportTypeTextStyle}>Reporting Parameter Selection For This Report</div>
                {(reportType === "upcomingContractRenewals" || reportType === "oneTimeContract") ? (
                <>
                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                        <InputLabel id="demo-simple-select-standard-label1">Renewal Time Frame</InputLabel>
                        <Select
                        labelId="demo-simple-select-standard-label1"
                        id="demo-simple-select-standard1"
                        value={renewalTimeFrame}
                        onChange={(e) => setRenewalTimeFrame(e.target.value)}
                        label="Renewal Time Frame"
                        >
                            <MenuItem value={30}>Renewal within Next 30 days</MenuItem>
                            <MenuItem value={60}>Renewal within Next 60 days</MenuItem>
                            <MenuItem value={90}>Renewal within Next 90 days</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px'  }}>
                        <InputLabel id="demo-multiple-name-label2">Site</InputLabel>
                        <Select
                        labelId="demo-multiple-name-label2"
                        id="demo-multiple-name2"
                        multiple
                        value={selectedSites}
                        onChange={handleChangeSites}
                        MenuProps={MenuProps}
                        >
                        {sites.map((data) => (
                            <MenuItem
                            key={data?.id}
                            value={data?.id}
                            >
                            {data?.siteName?.siteName}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                        <InputLabel id="demo-multiple-name-label3">Departments</InputLabel>
                        <Select
                        labelId="demo-multiple-name-label3"
                        id="demo-multiple-name3"
                        multiple
                        value={selectedSites}
                        onChange={handleChangeSites}
                        MenuProps={MenuProps}
                        >
                        {sites.map((data) => (
                            <MenuItem
                            key={data?.id}
                            value={data?.id}
                            >
                            {data?.siteName?.siteName}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    {reportType !== "oneTimeContract" && (
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label4">Contract Continuation Policy</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label4"
                            id="demo-simple-select-standard4"
                            value={contractContinuationPolicy}
                            onChange={(e) => setContractContinuationPolicy(e.target.value)}
                            label="Contract Continuation Policy"
                            MenuProps={MenuProps}
                            >
                                <MenuItem value={'AUTORENEWAL'}>Auto Renewal</MenuItem>
                                <MenuItem value={'WRITTENCONTRACTEXTENSIONFORFIXEDTERM'}>Written Contract Extension For Fixed Term</MenuItem>
                                <MenuItem value={'NEWCONTRACTONEXPIRATION'}>New Contract On Expiration</MenuItem>
                                <MenuItem value={'ONETIMECONTRACTTERMINATEONEXPIRATION'}>One Time Contract - Terminate On Expiration</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </>
                ) : reportType === "activitiesOrServices" ? (
                    <>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px'  }}>
                            <InputLabel id="demo-multiple-name-label1">Reporting Time Period</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label1"
                            id="demo-multiple-name1"
                            MenuProps={MenuProps}
                            value={reportingTimePeriod}
                            onChange={(e) => setReportingTimePeriod(e.target.value)}
                            >
                                <MenuItem value={'Current Week'}>Current Week</MenuItem>
                                <MenuItem value={'Last Week'}>Last Week</MenuItem>
                                <MenuItem value={'Current Month'}>Current Month</MenuItem>
                                <MenuItem value={'Last Month'}>Last Month</MenuItem>
                                <MenuItem value={'Current Qtr'}>Current Qtr</MenuItem>
                                <MenuItem value={'Last Qtr'}>Last Qtr</MenuItem>
                                <MenuItem value={'Current Year'}>Current Year</MenuItem>
                                <MenuItem value={'Last Year'}>Last Year</MenuItem>
                                <MenuItem value={'Custom'}>Custom</MenuItem>
                            </Select>
                        </FormControl>
                        {/* {reportingTimePeriod === "Custom" && (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div>
                              <Typography sx={{ mt: 2, mb: 1 }}>1 calendar </Typography>
                              <DateRangePicker
                                calendars={1}
                                value={dateRange}
                                onChange={(newValue) => {
                                  setDateRange(newValue);
                                }}
                                renderInput={(startProps, endProps) => (
                                  <React.Fragment>
                                    <TextField {...startProps} />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps} />
                                  </React.Fragment>
                                )}
                              />
                            </div>
                          </LocalizationProvider>
                        )} */}
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px'  }}>
                            <InputLabel id="demo-multiple-name-label2">Site</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label2"
                            id="demo-multiple-name2"
                            multiple
                            value={selectedSites}
                            onChange={handleChangeSites}
                            MenuProps={MenuProps}
                            >
                            {sites.map((data) => (
                                <MenuItem
                                key={data?.id}
                                value={data?.id}
                                >
                                {data?.siteName?.siteName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2">Departments</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label2"
                            id="demo-multiple-name2"
                            multiple
                            value={selectedSites}
                            onChange={handleChangeSites}
                            MenuProps={MenuProps}
                            >
                            {sites.map((data) => (
                                <MenuItem
                                key={data?.id}
                                value={data?.id}
                                >
                                {data?.siteName?.siteName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label5">Contracts</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label5"
                            id="demo-multiple-name5"
                            multiple
                            value={selectedContracts}
                            onChange={handleChangeContracts}
                            MenuProps={MenuProps}
                            >
                            {contracts.map((data) => (
                                <MenuItem
                                key={data?.id}
                                value={data?.id}
                                >
                                {data?.contractName?.contractName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label5"
                            id="demo-multiple-name5"
                            multiple
                            value={selectedContractedServiceProvider}
                            onChange={handleChangeContractedServiceProviders}
                            MenuProps={MenuProps}
                            >
                            {user.map((data) => (
                                <MenuItem
                                key={data?.id}
                                value={data?.id}
                                >
                                {data?.name?.firstName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </>
                    ) : reportType === "nonCompliant" ? (
                    <>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px'  }}>
                            <InputLabel id="demo-multiple-name-label1">Site</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label1"
                            id="demo-multiple-name1"
                            multiple
                            value={selectedSites}
                            onChange={handleChangeSites}
                            MenuProps={MenuProps}
                            >
                            {sites.map((data) => (
                                <MenuItem
                                key={data?.id}
                                value={data?.id}
                                >
                                {data?.siteName?.siteName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2">Departments</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label2"
                            id="demo-multiple-name2"
                            multiple
                            value={selectedSites}
                            onChange={handleChangeSites}
                            MenuProps={MenuProps}
                            >
                            {sites.map((data) => (
                                <MenuItem
                                key={data?.id}
                                value={data?.id}
                                >
                                {data?.siteName?.siteName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label5">Contracts</InputLabel>
                            <Select
                            labelId="demo-multiple-name-label5"
                            id="demo-multiple-name5"
                            multiple
                            value={selectedContracts}
                            onChange={handleChangeContracts}
                            MenuProps={MenuProps}
                            >
                            {contracts.map((data) => (
                                <MenuItem
                                key={data?.id}
                                value={data?.id}
                                >
                                {data?.contractName?.contractName}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label3">Contract Status</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label3"
                            id="demo-simple-select-standard3"
                            value={contractStatus}
                            onChange={(e) => setContractStatus(e.target.value)}
                            label="Contract Continuation Policy"
                            MenuProps={MenuProps}
                            >
                                <MenuItem value={'ACTIVE'}>Active</MenuItem>
                                <MenuItem value={'DRAFT'}>Draft</MenuItem>
                                <MenuItem value={'EXPIRED'}>Expired</MenuItem>
                                <MenuItem value={'TERMINATED'}>Terminated</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label4">Proof of Documentation</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label4"
                            id="demo-simple-select-standard4"
                            value={podType}
                            onChange={(e) => setPodType(e.target.value)}
                            label="Proof of Documentation"
                            MenuProps={MenuProps}
                            >
                                {podTypes?.map((data, index) => (
                                    <MenuItem value={data} key={index}>{data}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                    ) : (
                    <>
                        <div className={`${style.darkLabel} ${style.marginTop20}`}>Time Range:</div>
                        <select
                            name="action"
                            id="action"
                            className={`${style.fullWidth} ${style.marginTop}`}>
                            <option value="Feb 12, 2022 - Mar 13, 2022" >
                            Feb 12, 2022 - Mar 13, 2022
                            </option>
                        </select>
                        <FormControl variant="standard" sx={{ m: 1, maxWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Type</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityType}
                            onChange={handleChange}
                            label="Activity Type"
                            >
                            <MenuItem value={'Outpatient Clinic Service'}>Outpatient Clinic Service</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Performed</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityPerformed}
                            onChange={handleChangeActivityPerformed}
                            label="Activity Performed"
                            >
                            <MenuItem value={'Half Day Clinic Session'}>Half Day Clinic Session</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Type</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityType}
                            onChange={handleChange}
                            label="Activity Type"
                            >
                            <MenuItem value={'Outpatient Clinic Service'}>Outpatient Clinic Service</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Performed</InputLabel>
                            <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activityPerformed}
                            onChange={handleChangeActivityPerformed}
                            label="Activity Performed"
                            >
                            <MenuItem value={'Half Day Clinic Session'}>Half Day Clinic Session</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}
                <button className={`${style.primaryButtonStyle} ${style.marginTop20}`} onClick={()=> setShowSaveReport(true)} >Save Parameter Selection As My Report</button>
            </div>
            {showSaveReport && (
                <SaveReport getSaveReportDialog={getSaveReportDialog} />
            )}
        </div>
    )
}

export default SampleReportLeftCard;