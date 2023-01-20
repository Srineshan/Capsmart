import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DatalistInput from 'react-datalist-input';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';
import { POST, GET, PUT } from './../dataSaver';
import ReviewerApproverField from './reviewerApproverField';
import { workFlowDataGenerator } from './workflowDataGenerator';

import style from './index.module.scss';

const switchTheme = createTheme({
  palette: {
    primary: {
      main: '#7165E3',
    },
  },
});

const AddonClinicFields = ({ getMetaData, services, locationItems, getNewLocation, locationToAdd, editService, serviceSelected }) => {
  const limit5 = 5;
  let additionalDetails = ['Require Patient Data', 'Prior Pre-Authorization Required', 'Administrative Approval For Payment Required', 'Require Reason For Add-On Service'];
  const [fields, setFields] = useState();
  const [showNewService, setShowNewService] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [addOnWorkFlow, setAddOnWorkFlow] = useState();
  const [newServices, setNewServices] = useState({
    name: '',
    rate: '',
    duringNormalWorkingHours: false,
    afterWorkingHours: false,
    showLocation: false,
    locations: [],
    additionalDetails: [],
    approver: undefined,
    paymentApprover: undefined,
    billableService: false,
  });
  const [currentServiceData, setCurrentServiceData] = useState();
  const [metadata, setMetadata] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getFields();
  }, [locationItems])

  useEffect(() => {
    getMetaData(metadata);
  }, [metadata])

  useEffect(() => {
    getUserData();
    getTimeSheetWorkFlow();
  }, [])

  useEffect(() => {
    setSelectedValues();
  }, [serviceSelected, addOnWorkFlow]);

  const getTimeSheetWorkFlow = async () => {
    const { data: timesheetWorkFlow } = await GET('timesheet-management-service/workflow');
    if (timesheetWorkFlow) {
      setAddOnWorkFlow(timesheetWorkFlow);
    }
  }

  console.log('add-on ', serviceSelected);

  const setSelectedValues = async () => {
    if (editService) {
      let temp = [];
      let data = {
        refId: serviceSelected?.refId,
        activities: serviceSelected?.activities,
        min: serviceSelected?.contractedSchedule?.minimum?.value,
        max: serviceSelected?.contractedSchedule?.maximum?.value,
        frequency: serviceSelected?.contractedSchedule?.frequency,
        sessionDuration: serviceSelected?.duration?.hours,
        sessionAmount: serviceSelected?.payableAmount?.value,
        totalSession: serviceSelected?.totalSessions?.value,
        totalSessionFrequency: serviceSelected?.totalSessions?.frequency,
        workingTimeFrom: serviceSelected?.workingPeriod?.from,
        workingTimeTo: serviceSelected?.workingPeriod?.to,
        serviceDays: serviceSelected?.serviceDays,
        activityType: { activityType: 'Add-On Services' },
        performingActivity: serviceSelected?.performingActivity?.activity,
        payableAmount: { value: serviceSelected?.payableAmount?.value },
        locations: serviceSelected?.locations,
        locationSpecified: serviceSelected?.locationSpecified,
        workingHours: {
          normalWorkingHours: serviceSelected?.workingHours?.normalWorkingHours,
          afterWorkingHours: serviceSelected?.workingHours?.afterWorkingHours,
        },
        billableService: serviceSelected?.billableService,
        activityApprovalWFRequired: serviceSelected?.activityApprovalWFRequired,
        activityResponse: serviceSelected?.activityResponse,
        activityApprovalWFRequired: serviceSelected?.activityApprovalWFRequired,
        workflowId: serviceSelected?.workFlow?.id,
        workflowName: serviceSelected?.workFlow?.workFlowName?.name,
        billableService: serviceSelected?.billableService,
      };
      let workflowData = addOnWorkFlow?.filter(data => data?.id === serviceSelected?.workFlow?.id)?.map(data => data?.workFlowMap?.workflow)[0] || {};
      let workFlowValues = Object?.values(workflowData);
      console.log('workflowdata', workFlowValues);

      data.approver = users?.filter(data => data?.userId === workFlowValues?.[0]?.workFlowUser?.id)?.map(data => data)[0];
      console.log('approver', data.approver, workFlowValues);
      data.paymentApprover = users?.filter(data => data?.userId === workFlowValues?.[1]?.workFlowUser?.id)?.map(data => data)[0];
      console.log('paymentApprover', data.paymentApprover);

      temp.push(data);
      setMetadata(temp);
      let selectedServiceTemp = selectedServices;
      selectedServiceTemp?.push(serviceSelected?.performingActivity?.activity);
      setSelectedServices(selectedServiceTemp);
    }
  }

  const resetNewServices = () => {
    setNewServices({
      name: '',
      rate: '0',
      duringNormalWorkingHours: false,
      afterWorkingHours: false,
      showLocation: false,
      locations: [],
      additionalDetails: [],
      approver: undefined,
      paymentApprover: undefined,
      billableService: false
    })
  }

  const getUserData = async () => {
    const { data: userList } = await GET(`contract-managment-service/contracts/workFlowUser`)
    if (userList) {
      setUsers(userList);
    }
  }

  const getSelectedLocation = (serviceName) => {
    let location = metadata?.filter(data => data?.performingActivity === serviceName)?.map(data => data?.locations)?.[0];
    let locationList = location?.map(location => location?.location) || [];
    return locationList;
  }

  const removeLocation = (locationIndex) => {
    let locationTemp = metadata?.filter(data => data?.performingActivity === selectedService)?.map(data => data?.locations)[0] || [];
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === selectedService)?.map(data => {
      data.locations = locationTemp?.filter((location, index) => locationIndex !== index)?.map(data => data);
    })
    setMetadata(temp)
    getFields();
  }

  const currentService = (name) => {
    let serviceData = metadata?.filter(data => getServiceName(data?.activityType?.activityType, data?.activities?.map(data => data?.activity)) === name)?.map(data => data)[0];
    return serviceData;
    setCurrentServiceData(serviceData);
  }

  const switchShowLocation = (name) => {
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === name)?.map(data => {
      data.locationSpecified = !data.locationSpecified;
    });
    setMetadata(temp);
    getFields();
  }

  const onApproverSelected = (value, serviceName) => {
    console.log(' Inside approval selection value', value, serviceName)
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === serviceName)?.map(data => {
      data.approver = value;
    })
    setMetadata(temp);
    getFields();
  }

  const getFields = () => {
    let serviceFields = [];
    setFields(serviceFields);
  }

  let serviceList = [];
  let temp = services;
  temp?.filter(data => ['Clinic Blocks', 'Surgery Session']?.includes(data?.activityType?.activityType))?.map(data => {
    let activityName = data?.activityType?.activityType;
    let activities = data?.activities?.map(data => data?.activity);
    let result = `${activityName} (${activities?.map(data => data)?.join(', ')})`
    let alreadyExist = services?.filter(data => data?.activityType?.activityType === 'Add-On Services' && data?.performingActivity?.activity === result)?.map(data => data);
    if (alreadyExist?.length === 0) {
      serviceList.push(result);
    }
  });

  const selectLocation = (location, name) => {
    let locationTemp = metadata?.filter(data => data?.performingActivity === name)?.map(data => data?.locations)[0] || [];
    if (!locationTemp.map(data => data?.location)?.includes(location?.location)) {
      let temp = metadata;
      temp?.filter(data => data?.performingActivity === name)?.map(data => {
        locationTemp.push({ 'location': location?.location });
        data.locations = locationTemp;
      })
      setMetadata(temp)
    }
    getFields();
  }

  const getServiceName = (activityName, activities) => {
    let result = `${activityName} (${activities?.map(data => data)?.join(', ')})` || '';
    return result;
  }

  const selectService = (name, checked) => {
    if (checked) {
      let temp = metadata;
      const selectedData = cloneDeep(services?.filter(data => getServiceName(data?.activityType?.activityType, data?.activities?.map(data => data?.activity)) === name)?.map(data => data)[0]);
      selectedData.performingActivity = name;
      selectedData.activityType = { activityType: 'Add-On Services' };
      selectedData.selectedActivityId = selectedData?.refId;
      selectedData.refId = null;
      temp.push(selectedData);
      setSelectedServices(temp?.map(data => data?.performingActivity));
      setMetadata(temp);
    } else {
      let temp = metadata?.filter(data => data?.performingActivity !== name)?.map(data => data);
      setMetadata(temp);
      setSelectedServices(temp?.map(data => data?.performingActivity));
    }
    getFields();
  }

  const handleRequestApprovalChange = (name) => {
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === name)?.map(data => {
      data.activityApprovalWFRequired = !data.activityApprovalWFRequired;
      data.approver = undefined;
      data.paymentApprover = undefined;
    })

    setMetadata(temp);
    getFields();
  }

  console.log('metadata', metadata);

  const handleSessionAmountChange = (name, value) => {
    let temp = metadata;
    temp?.filter(data => data?.allowableAddOnWorkingHours === name)?.map(data => {
      data.sessionAmount = value;
    })
    setMetadata(temp);
    getFields();
  }

  const handleNewServiceChange = (name, value) => {
    if (name === 'billableService' && !value) {
      setNewServices({ ...newServices, billableService: value, rate: '0' })
    } else {
      setNewServices({ ...newServices, [name]: value });
    }
  }

  const handleNewServiceLocation = (selectedItem) => {
    if (newServices?.locations?.map(data => data?.location)?.includes(selectedItem?.location)) {
      ErrorToaster('Location Already Exists');
      return;
    }
    let temp = newServices?.locations;
    temp.push({ 'location': selectedItem?.location });
    setNewServices({ ...newServices, locations: temp });
  }

  const handleAdditionalDetailSelection = (data) => {
    let temp = newServices?.additionalDetails || [];
    if (temp?.includes(data)) {
      if (data === 'Prior Pre-Authorization Required') {
        temp = temp?.filter(detail => detail !== 'Administrative Approval For Payment Required')?.map(data => data);
      }
      temp = temp?.filter(detail => detail !== data)?.map(data => data);
    } else {
      if (data === 'Administrative Approval For Payment Required' && !temp?.includes('Prior Pre-Authorization Required')) {
        return;
      }
      temp?.push(data);
    }
    setNewServices({ ...newServices, 'additionalDetails': temp });
  }

  const addToMetaData = () => {
    if (newServices?.billableService && newServices?.rate === '0') {
      ErrorToaster('Payment Rate Cannot be 0 if Billable');
      return;
    }
    let temp = metadata;
    console.log('new services', newServices?.additionalDetails)
    temp.push({
      sites: [],
      activities: [{ activity: newServices?.name }],
      activityType: { activityType: 'Add-On Services' },
      performingActivity: newServices?.name,
      sessionAmount: newServices?.rate,
      locations: newServices?.locations,
      locationSpecified: newServices?.showLocation,
      workingHours: {
        normalWorkingHours: newServices?.duringNormalWorkingHours,
        afterWorkingHours: newServices?.afterWorkingHours,
      },
      activityResponse: {
        dataMap: {
          additionalDetails: newServices?.additionalDetails
        }
      },
      activityApprovalWFRequired: newServices?.additionalDetails?.includes('Prior Pre-Authorization Required'),
      approver: newServices?.approver,
      paymentApprover: newServices?.paymentApprover,
      billableService: newServices?.billableService,
    });

    setMetadata(temp);
    let selectedServiceTemp = selectedServices;
    selectedServiceTemp?.push(newServices?.name);
    setSelectedServices(selectedServiceTemp);
    resetNewServices();
    setShowNewService(false);
  }

  const handleNewServiceName = () => {
    if (newServices?.name === '') {
      ErrorToaster('New Service Name is Mandatory');
      return;
    }
    if (selectedServices?.includes(newServices?.name)) {
      ErrorToaster('Service Name cannot be duplicated');
      return;
    }
    setShowNewService(true);
  }

  const updateRate = (serviceName, value) => {
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === serviceName)?.map(data => {
      data.sessionAmount = value;
    });
    setMetadata(temp);
    getFields();
  }

  const UpdateBillable = (serviceName, value) => {
    console.log('inside func', value, serviceName)
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === serviceName)?.map(data => {
      console.log('inside filter', data?.billableService, data?.sessionAmount, value)
      data.billableService = value;
      if (!value) {
        data.sessionAmount = '0';
      }
    });
    setMetadata(temp);
    getFields();
  }

  console.log('metadata', metadata, newServices);


  const handleWorkingHoursChange = (serviceName, value, name) => {
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === serviceName)?.map(data => {
      data.workingHours = { ...data.workingHours, [name]: value };
    });
    setMetadata(temp);
    getFields();
  }

  const onAdditionalServiceApproverChange = (name, value) => {
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === name)?.map(data => {
      data.approver = value;
    });
    setMetadata(temp);
    getFields();
  }

  const onAdditionalServicePaymentApproverChange = (name, value) => {
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === name)?.map(data => {
      data.paymentApprover = value;
    });
    setMetadata(temp);
    getFields();
  }

  console.log('location', locationItems);

  return (
    <div>
      {
        !editService && serviceList?.map((service, i) => (
          <div className={style.marginTop20} onClick={() => setSelectedService(service || '')}>
            <FormGroup>
              <FormControlLabel control={<Checkbox onChange={(e) => selectService(service, e.target.checked)} checked={selectedServices?.filter(data => data === service)?.map(data => data)?.length !== 0 ? true : false} />} label={<Typography variant="body2">{service}</Typography>} />
            </FormGroup>
            <div className={`${style.addonBoxStyle}`}>
              <div className={`${style.addManagerGrid}`}>
                <div className={style.extentionLableStyle}>Only Allow Upon Request / Notification Approval</div>
                <ThemeProvider theme={switchTheme}>
                  <FormControlLabel
                    control={
                      <Switch className={`${style.textAlignLeft}`} onChange={() => handleRequestApprovalChange(service)} checked={metadata?.filter(item => item?.performingActivity === service)?.map(item => item)[0]?.activityApprovalWFRequired} />
                    }
                    color='primary'
                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                    label={metadata?.filter(item => item?.performingActivity === service)?.map(item => item)[0]?.activityApprovalWFRequired ? 'YES' : 'NO'}
                  />
                </ThemeProvider>
              </div>
              {metadata?.filter(item => item?.performingActivity === service)?.map(item => item)[0]?.activityApprovalWFRequired &&
                <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { onApproverSelected(users?.filter(data => data?.userId === value)?.map(data => data)[0], service) }} value={metadata?.filter(data => data?.performingActivity === service)?.map(data => data?.approver?.userId)[0]} />
              }
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                <div>
                  <div className={`${style.displayInRow} `}>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch className={`${style.textAlignLeft}`} onChange={() => switchShowLocation(service)} checked={metadata?.filter(item => item?.performingActivity === service)?.map(item => item)[0]?.locationSpecified} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                        label={metadata?.filter(data => data?.performingActivity === service)?.map(item => item)[0]?.locationSpecified ? 'YES' : 'NO'}
                      />
                    </ThemeProvider>
                    <div className={`${style.addGrid} ${style.fullWidth}`}>
                      <DatalistInput items={locationItems} onSelect={(location) => selectLocation(location, service)} className={style.fullWidth} onChange={(e) => getNewLocation(e.target.value)} />
                      <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                        <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd} />
                      </div>
                    </div>
                  </div>
                  {getSelectedLocation(service)?.length !== 0 &&
                    <MultiSelectDisplay values={getSelectedLocation(service)} removeItem={removeLocation} />
                  }
                </div>
              </div>
            </div>
          </div>
        ))
      }

      {
        metadata?.[0]?.activityResponse?.dataMap?.selectedActivityId === undefined && metadata?.filter(data => !serviceList?.map(service => service)?.includes(data?.performingActivity) || editService)?.map(data => (
          <div className={style.marginTop20} onClick={() => setSelectedService(data?.performingActivity)}>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={selectedServices?.includes(data?.performingActivity)} onChange={(e) => selectService(data?.performingActivity, e.target.checked)} />} label={<Typography variant="body2">{data?.performingActivity?.activity || data?.performingActivity}</Typography>} />
            </FormGroup>
            <div className={`${style.addonBoxStyle} ${style.marginTop20}`}>
              <div className={`${style.addManagerGrid}`}>
                <div className={style.extentionLableStyle}>Billable Service*</div>
                <ThemeProvider theme={switchTheme}>
                  <FormControlLabel
                    control={
                      <Switch className={`${style.textAlignLeft}`} checked={data?.billableService} onChange={() => UpdateBillable(data?.performingActivity, !data?.billableService)} />
                    }
                    color='primary'
                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                    label={data?.billableService ? 'YES' : 'NO'}
                  />
                </ThemeProvider>
              </div>
              {
                data?.billableService &&
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>ADD-ON Payment Rate*</div>
                  <div className={`${style.displayInRow}`}>
                    <div className={`${style.threeFieldWidth}`}>
                      <TextField
                        size="small"
                        InputProps={{
                          startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                        }}
                        defaultValue={data?.sessionAmount}
                        onChange={(e) => updateRate(data?.performingActivity, e.target.value)}
                      />
                    </div>
                    <div className={style.verticalAlignCenter}>
                      <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Per Hour</p>
                    </div>
                  </div>
                </div>
              }

              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Add-On Working Hours*</div>
                <div className={style.twoCol}>
                  <FormGroup className={`${style.marginLeft10}`}>
                    <FormControlLabel control={<Checkbox checked={data?.workingHours?.normalWorkingHours} onChange={(e) => handleWorkingHoursChange(data?.performingActivity, e.target.checked, 'normalWorkingHours')} />} label={<Typography variant="body2" color="textSecondary">During Normal Working Hours</Typography>} />
                  </FormGroup>
                  <FormGroup className={`${style.marginLeft10}`}>
                    <FormControlLabel control={<Checkbox checked={data?.workingHours?.afterWorkingHours} onChange={(e) => handleWorkingHoursChange(data?.performingActivity, e.target.checked, 'afterWorkingHours')} />} label={<Typography variant="body2" color="textSecondary">After Working Hours</Typography>} />
                  </FormGroup>
                </div>
              </div>
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                <div>
                  <div className={`${style.displayInRow} `}>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch className={`${style.textAlignLeft}`} checked={data?.locationSpecified} onChange={() => switchShowLocation(data?.performingActivity)} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                        label={data?.locationSpecified ? 'YES' : 'NO'}
                      />
                    </ThemeProvider>
                    {
                      data?.locationSpecified &&
                      <div className={`${style.addGrid} ${style.fullWidth}`}>
                        <DatalistInput items={locationItems} onSelect={(location) => selectLocation(location, data?.performingActivity)} className={style.fullWidth} onChange={(e) => getNewLocation(e.target.value)} />
                        <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                          <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd} />
                        </div>
                      </div>
                    }

                  </div>
                  {data?.locationSpecified && data?.locations?.length !== 0 &&
                    <MultiSelectDisplay values={data?.locations?.map(data => data?.location)} removeItem={removeLocation} />
                  }
                </div>
              </div>
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional Details*</div>
                <div >
                  {
                    additionalDetails?.map((details, index) => (
                      <>
                        <div className={`${style.additionalDetails} ${data?.activityResponse?.dataMap?.additionalDetails?.includes(details) ? style.additionalDetailsSelected : ''} ${style.cursorPointer} ${index !== 0 ? style.marginTop10 : ''}`} onClick={() => handleAdditionalDetailSelection(details)}>
                          <div className={style.alignCenter}>
                            <TaskAltIcon sx={{ color: data?.activityResponse?.dataMap?.additionalDetails?.includes(details) ? '#7165E3' : '#E4E4E4' }} />
                          </div>
                          <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>{details}</div>
                        </div>
                        {
                          data?.activityResponse?.dataMap?.additionalDetails?.includes('Prior Pre-Authorization Required') && details === 'Prior Pre-Authorization Required' &&
                          <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { onAdditionalServiceApproverChange(data?.performingActivity, users?.filter(user => user?.userId === value)?.map(user => user)[0]) }} value={data?.approver?.userId} />
                        }
                        {
                          data?.activityResponse?.dataMap?.additionalDetails?.includes('Administrative Approval For Payment Required') && details === 'Administrative Approval For Payment Required' &&
                          <ReviewerApproverField data={users} label="Designate Payment Approver*" selectLabel="Select Payment Approver" onValueChange={(value) => { onAdditionalServicePaymentApproverChange(data?.performingActivity, users.filter(user => user?.userId === value)?.map(user => user)[0]) }} value={data?.paymentApprover?.userId} />
                        }
                      </>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        ))
      }


      {
        editService && metadata?.filter(data => data?.activityResponse?.dataMap?.selectedActivityId)?.map(data => (
          <div className={style.marginTop20}>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={true} />} label={<Typography variant="body2">{data?.performingActivity}</Typography>} />
            </FormGroup>
            <div className={`${style.addonBoxStyle}`}>
              <div className={`${style.addManagerGrid}`}>
                <div className={style.extentionLableStyle}>Only Allow Upon Request / Notification Approval</div>
                <ThemeProvider theme={switchTheme}>
                  <FormControlLabel
                    control={
                      <Switch className={`${style.textAlignLeft}`} checked={data?.activityApprovalWFRequired} onChange={() => handleRequestApprovalChange(data?.performingActivity)} />
                    }
                    color='primary'
                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                    label={data?.activityApprovalWFRequired ? 'YES' : 'NO'}
                  />
                </ThemeProvider>
              </div>
              {data?.activityApprovalWFRequired &&
                <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { onApproverSelected(users?.filter(data => data?.userId === value)?.map(data => data)[0], data?.performingActivity) }} value={metadata?.[0]?.approver?.userId} />
              }
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                <div>
                  <div className={`${style.displayInRow} `}>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch className={`${style.textAlignLeft}`} checked={data?.locationSpecified} onChange={() => switchShowLocation(data?.performingActivity)} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                        label={data?.locationSpecified ? 'YES' : 'NO'}
                      />
                    </ThemeProvider>
                    <div className={`${style.addGrid} ${style.fullWidth}`}>
                      <DatalistInput items={locationItems} onSelect={(location) => selectLocation(location, data?.performingActivity)} className={style.fullWidth} onChange={(e) => getNewLocation(e.target.value)} />
                      <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                        <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd} />
                      </div>
                    </div>
                  </div>
                  {
                    getSelectedLocation(data?.performingActivity)?.length !== 0 &&
                    <MultiSelectDisplay values={getSelectedLocation(data?.performingActivity)} removeItem={removeLocation} />
                  }
                </div>
              </div>
            </div>
          </div>
        ))
      }


      {!editService && <div className={`${style.marginTop20} ${style.addAddonGrid}`}>
        <InputGroup className={style.fullWidth} placeholder="Enter Add-On Service" value={newServices?.name} onChange={(e) => setNewServices({ ...newServices, 'name': e.target.value })} />
        <div className={`${style.addAddonServiceButton} ${style.alignCenter}`} onClick={handleNewServiceName}>ADD ADD-ON SERVICES</div>
      </div>}

      {showNewService &&
        <div className={`${style.addonAddBox} ${style.marginTop20}`}>
          <div className={`${style.addManagerGrid}`}>
            <div className={style.extentionLableStyle}>Add-On Service Name*</div>
            <InputGroup value={newServices?.name} className={style.fullWidth} onChange={(e) => { handleNewServiceChange('name', e.target.value) }} />
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Billable Service*</div>
            <ThemeProvider theme={switchTheme}>
              <FormControlLabel
                control={
                  <Switch className={`${style.textAlignLeft}`} checked={newServices?.billableService} onChange={() => handleNewServiceChange('billableService', !newServices?.billableService)} />
                }
                color='primary'
                className={`${style.switchFontStyle} ${style.flexLeft} `}
                label={newServices?.billableService ? 'YES' : 'NO'}
              />
            </ThemeProvider>
          </div>
          {
            newServices?.billableService &&
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>ADD-ON Payment Rate*</div>
              <div className={`${style.displayInRow}`}>
                <div className={`${style.threeFieldWidth}`}>
                  <TextField
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                    }}
                    value={newServices?.rate}
                    onChange={(e) => { handleNewServiceChange('rate', e.target.value) }}
                  />
                </div>
                <div className={style.verticalAlignCenter}>
                  <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Per Hour</p>
                </div>
              </div>
            </div>
          }


          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Allowable Add-On Working Hours*</div>
            <div className={style.twoCol}>
              <FormGroup className={`${style.marginLeft10}`}>
                <FormControlLabel control={<Checkbox checked={newServices?.duringNormalWorkingHours} onChange={(e) => { handleNewServiceChange('duringNormalWorkingHours', e.target.checked) }} />} label={<Typography variant="body2" color="textSecondary">During Normal Working Hours</Typography>} />
              </FormGroup>
              <FormGroup className={`${style.marginLeft10}`}>
                <FormControlLabel control={<Checkbox checked={newServices?.afterWorkingHours} onChange={(e => handleNewServiceChange('afterWorkingHours', e.target.checked))} />} label={<Typography variant="body2" color="textSecondary">After Working Hours</Typography>} />
              </FormGroup>
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
            <div>
              <div className={`${style.displayInRow} `}>
                <ThemeProvider theme={switchTheme}>
                  <FormControlLabel
                    control={
                      <Switch className={`${style.textAlignLeft}`} checked={newServices?.showLocation} onChange={e => handleNewServiceChange('showLocation', !newServices?.showLocation)} />
                    }
                    color='primary'
                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                    label={newServices?.showLocation ? 'YES' : 'NO'}
                  />
                </ThemeProvider>
                {
                  newServices?.showLocation &&
                  <div className={`${style.addGrid} ${style.fullWidth}`}>
                    <DatalistInput items={locationItems || []} onSelect={handleNewServiceLocation} className={style.fullWidth} onChange={(e) => getNewLocation(e.target.value)} clearInputOnSelect={true} />
                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                      <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd} />
                    </div>
                  </div>
                }
              </div>
              {
                newServices?.locations?.length !== 0 && newServices?.showLocation &&
                <MultiSelectDisplay values={newServices?.locations?.map(data => data?.location)} removeItem={(index) => setNewServices({ ...newServices, locations: newServices?.locations?.filter((data, indexValue) => index !== indexValue)?.map(data => data) })} />
              }
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.extentionLableStyle}>Additional Details*</div>
            <div >
              {
                additionalDetails?.map((data, index) => (
                  <>
                    <div className={`${style.additionalDetails} ${newServices?.additionalDetails?.includes(data) ? style.additionalDetailsSelected : ''} ${style.cursorPointer} ${index !== 0 ? style.marginTop10 : ''}`} onClick={() => handleAdditionalDetailSelection(data)}>
                      <div className={style.alignCenter}>
                        <TaskAltIcon sx={{ color: newServices?.additionalDetails?.includes(data) ? '#7165E3' : '#E4E4E4' }} />
                      </div>
                      <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>{data}</div>
                    </div>
                    {
                      newServices?.additionalDetails?.includes('Prior Pre-Authorization Required') && data === 'Prior Pre-Authorization Required' &&
                      <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { setNewServices({ ...newServices, approver: users?.filter(data => data?.userId === value)?.map(data => data)[0] }) }} />
                    }
                    {
                      newServices?.additionalDetails?.includes('Administrative Approval For Payment Required') && data === 'Administrative Approval For Payment Required' &&
                      <ReviewerApproverField data={users} label="Designate Payment Approver*" selectLabel="Select Payment Approver" onValueChange={(value) => { setNewServices({ ...newServices, paymentApprover: users.filter(data => data?.userId === value)?.map(data => data)[0] }) }} />
                    }
                  </>
                ))
              }
            </div>
          </div>
          <div>


            <div className={`${style.twoCol} ${style.marginTop20}`}>
              <button className={`${style.outlinedButton} ${style.fullWidth}`} onClick={() => { resetNewServices(); setShowNewService(false); }}>CANCEL</button>
              <button className={`${style.buttonStyle} ${style.fullWidth}`} onClick={addToMetaData}>SAVE</button>
            </div>
            <br />
          </div>
        </div>
      }

    </div>
  )
}

export default AddonClinicFields;
