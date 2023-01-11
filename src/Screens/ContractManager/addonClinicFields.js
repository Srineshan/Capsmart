import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash.clonedeep';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DatalistInput from 'react-datalist-input';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import { ErrorToaster,SuccessToaster } from './../../utils/toaster';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';
import { POST, GET, PUT } from './../dataSaver';
import ReviewerApproverField from './reviewerApproverField';


import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

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
  let additionalDetails = ['Require Patient Data', 'Prior Pre-Authorisation Required', 'Administrative Approval For Payment Required', 'Require Reason For Add-On Service'];
  const [fields, setFields] = useState();
  const [showNewService, setShowNewService] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [newServices, setNewServices] = useState({
    name: '',
    rate: '',
    duringNormalWorkingHours: false,
    afterWorkingHours: false,
    showLocation: false,
    locations: [],
    additionalDetails: []
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

  useEffect(()=>{
    getUserData();
  }, [])

  useEffect(() => {
    setSelectedValues();
  }, [serviceSelected]);
  const setSelectedValues = async () => {
    if (editService) {
      let temp = [];
      temp.push({
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
        locations: newServices?.locations,
        locationSpecified: newServices?.showLocation,
        workingHours: {
          normalWorkingHours: serviceSelected?.workingHours?.normalWorkingHours,
          afterWorkingHours: serviceSelected?.workingHours?.afterWorkingHours,
        },
        activityResponse: {
          dataMap: {
            additionalDetails: serviceSelected?.activityResponse?.dataMap?.additionalDetails || [],
            selectedActivityId: serviceSelected?.activityResponse?.dataMap?.selectedActityId || undefined,
          }
        },
        activityApprovalWFRequired: serviceSelected?.activityApprovalWFRequired
      });
      setMetadata(temp);
      let selectedServiceTemp = selectedServices;
      selectedServiceTemp?.push(serviceSelected?.performingActivity?.activity);
      setSelectedServices(selectedServiceTemp);
    }
  }

  const resetNewServices = () => {
    setNewServices({
      name: '',
      rate: '',
      duringNormalWorkingHours: false,
      afterWorkingHours: false,
      showLocation: false,
      locations: [],
      additionalDetails: []
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
      selectedData.selectedActityId = selectedData?.refId;
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
    temp?.filter(data => getServiceName(data?.activityType?.activityType, data?.activities?.map(data => data?.activity)) === name)?.map(data => {
      data.activityApprovalWFRequired = !data.activityApprovalWFRequired;
    })

    setMetadata(temp);
    getFields();
  }

  const handleSessionAmountChange = (name, value) => {
    let temp = metadata;
    temp?.filter(data => data?.allowableAddOnWorkingHours === name)?.map(data => {
      data.sessionAmount = value;
    })
    setMetadata(temp);
    getFields();
  }

  const handleNewServiceChange = (name, value) => {
    setNewServices({ ...newServices, [name]: value });
  }

  const handleNewServiceLocation = (selectedItem) => {
    let temp = newServices?.locations;
    temp.push({ 'location': selectedItem?.location });
    setNewServices({ ...newServices, locations: temp });
  }

  const handleAdditionalDetailSelection = (data) => {
    let temp = newServices?.additionalDetails || [];
    if(data === 'Administrative Approval For Payment Required' && !temp?.includes('Prior Pre-Authorisation Required')){
      return;
    }
    if (temp?.includes(data)) {
      temp = temp?.filter(detail => detail !== data)?.map(data => data);
    } else {
      temp?.push(data);
    }
    setNewServices({ ...newServices, 'additionalDetails': temp });
  }

  const addToMetaData = () => {
    let temp = metadata;
    temp.push({
      sites: [],
      activities: [{ activity: newServices?.name }],
      activityType: { activityType: 'Add-On Services' },
      performingActivity: newServices?.name,
      payableAmount: { value: newServices?.rate },
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
      activityApprovalWFRequired: true
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
      data.payableAmount = { 'value': value };
    });
    setMetadata(temp);
    getFields();
  }

  const handleWorkingHoursChange = (serviceName, value, name) => {
    let temp = metadata;
    temp?.filter(data => data?.performingActivity === serviceName)?.map(data => {
      data.workingHours = { ...data.workingHours, [name]: value };
    });
    setMetadata(temp);
    getFields();
  }

  console.log('metadata', metadata?.[0]?.performingActivity);

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
                <div className={style.extentionLableStyle}>Only Allow Upon Request Approval</div>
                <ThemeProvider theme={switchTheme}>
                  <FormControlLabel
                    control={
                      <Switch className={`${style.textAlignLeft}`} onChange={() => handleRequestApprovalChange(service)} checked={metadata?.filter(item => getServiceName(item?.activityType?.activityType, item?.activities?.map(item => item?.activity)) === service)?.map(item => item)[0]?.activityApprovalWFRequired} />
                    }
                    color='primary'
                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                    label={metadata?.filter(item => getServiceName(item?.activityType?.activityType, item?.activities?.map(item => item?.activity)) === service)?.map(item => item)[0]?.activityApprovalWFRequired === true ? 'YES' : 'NO'}
                  />
                </ThemeProvider>
              </div>
              <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => {}} />
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                <div>
                  <div className={`${style.displayInRow} `}>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch className={`${style.textAlignLeft}`} onChange={() => switchShowLocation(service)} checked={metadata?.filter(item => getServiceName(item?.activityType?.activityType, item?.activities?.map(item => item?.activity)) === service)?.map(item => item)[0]?.locationSpecified === true ? true : false} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                        label={metadata?.filter(data => data?.performingActivity === service)?.map(item => item)[0]?.locationSpecified === true ? 'YES' : 'NO'}
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
        editService && metadata?.[0]?.activityResponse?.dataMap?.selectedActivityId && (
          <div className={style.marginTop20}>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={true} label={<Typography variant="body2">{metadata?.[0]?.performingActivity?.activity || metadata?.[0]?.performingActivity}</Typography>} /> } />
            </FormGroup>
            <div className={`${style.addonBoxStyle}`}>
              <div className={`${style.addManagerGrid}`}>
                <div className={style.extentionLableStyle}>Only Allow Upon Request Approval</div>
                <ThemeProvider theme={switchTheme}>
                  <FormControlLabel
                    control={
                      <Switch className={`${style.textAlignLeft}`} />
                    }
                    color='primary'
                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                    label={'YES'}
                  />
                </ThemeProvider>
              </div>
              <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => {}} />
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                <div>
                  <div className={`${style.displayInRow} `}>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch className={`${style.textAlignLeft}`} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                        label={'YES'}
                      />
                    </ThemeProvider>
                    <div className={`${style.addGrid} ${style.fullWidth}`}>
                      <DatalistInput items={locationItems} className={style.fullWidth} />
                      <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                        <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd} />
                      </div>
                    </div>
                  </div>
                  {
                    // getSelectedLocation(service)?.length !== 0 &&
                    // <MultiSelectDisplay values={getSelectedLocation(service)} removeItem={removeLocation} />
                  }
                </div>
              </div>
            </div>
          </div>
        )
      }
      {
        !metadata?.[0]?.activityResponse?.dataMap?.selectedActivityId && metadata?.filter(data => !serviceList?.map(service => service)?.includes(data?.performingActivity) || editService)?.map(data => (
          <div className={style.marginTop20} onClick={() => setSelectedService(data?.performingActivity)}>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={selectedServices?.includes(data?.performingActivity)} onChange={(e) => selectService(data?.performingActivity, e.target.checked)} />} label={<Typography variant="body2">{data?.performingActivity?.activity || data?.performingActivity}</Typography>} />
            </FormGroup>
            <div className={`${style.addonBoxStyle}`}>
              <div className={`${style.addManagerGrid}`}>
                <div className={style.extentionLableStyle}>ADD-ON Payment Rate*</div>
                <div className={`${style.displayInRow}`}>
                  <div className={`${style.threeFieldWidth}`}>
                    <TextField
                      size="small"
                      InputProps={{
                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                      }}
                      value={data?.payableAmount?.value}
                      onChange={(e) => updateRate(data?.performingActivity, e.target.value)}
                    />
                  </div>
                  <div className={style.verticalAlignCenter}>
                    <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Per Hour</p>
                  </div>
                </div>
              </div>
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
                <div>
                  {
                    data?.activityResponse?.dataMap?.additionalDetails?.map(detail => (
                      <FormGroup className={`${style.marginLeft10}`}>
                        <FormControlLabel control={<Checkbox checked value={detail} />} label={<Typography variant="body2" color="textSecondary">{detail}</Typography>} />
                      </FormGroup>
                    ))
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
                  <div className={`${style.additionalDetails} ${newServices?.additionalDetails?.includes(data) ? style.additionalDetailsSelected : ''} ${style.cursorPointer} ${index !== 0 ? style.marginTop10 : ''}`} onClick={() => handleAdditionalDetailSelection(data)}>
                    <div className={style.alignCenter}>
                      <TaskAltIcon sx={{ color: newServices?.additionalDetails?.includes(data) ? '#7165E3' : '#E4E4E4' }} />
                    </div>
                    <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>{data}</div>
                  </div>
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
