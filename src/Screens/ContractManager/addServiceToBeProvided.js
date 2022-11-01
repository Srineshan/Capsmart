import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, EditableText, RadioGroup, Radio, Checkbox, Tag, TextArea } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import DatalistInput from 'react-datalist-input';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import {PUT, GET, TenantID, POST} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import Calculator from './../../Components/Calculator';
import ReactStickyNotes from '@react-latest-ui/react-sticky-notes';

import style from './index.module.scss';
import SendEmailUserList from './mailUser';
import SiteDepartmentField from '../../Components/ReusableSmallComponents/siteDepartmentField';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import ClinicBlocksFields from './clinicBlocksField';
import OnCallCoverageFields from './onCallCoverageFields';
import SupplementalFields from './supplementalFields';
import AddonClinicFields from './addonClinicFields';
import AdministrativeFields from './administrativeFields';
import SurgerySessionFields from './surgerySessionFields';

const AddServiceProvided = ({ getAddServiceDialog, getAddOn, contractId, selectContractInfo, selectedService, editService, getEditServiceDialog }) => {
    console.log('selectedservice', selectedService);
    const serviceTypeList = ['Clinic Blocks','Surgery Session','On Call Coverage Duty Days','Supplemental Clinical Services','Add-On Clinical Services','Administrative / Miscellaneous Services'];
    const siteTypeId = sessionStorage.getItem('entityTypeId');
    const [serviceType, setServiceType] = useState('Clinic Blocks');
    const [siteList, setSiteList] = useState([]);
    const [siteData, setSiteData] = useState([]);
    const [activity, setActivity] = useState([]);
    const [newActivity, setNewActivity] = useState('');
    const [selectedActivity, setSelectedActivity] = useState([]);
    const [item, setItem] = useState();
    const [locationList, setLocationList] = useState([]);
    const [newLocation,setNewLocation] = useState('');
    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [metadata, setMetadata] = useState();
    //old useStates
    const [activityType, setActivityType] = useState('OutPatient Surgery Clinic Session');
    const [activityContractedFor, setActivityContractedFor] = useState('');
    const [isDesignatedSpecificContractor, setIsDesignatedSpecificContractor] = useState(true);
    const [addOnService, setAddOnService] = useState('');
    const [sessionRate, setSessionRate] = useState(0);
    const [sessionDuration, setSessionDuration] = useState(0);
    const [fractureClinicalSessionRate, setFractureClinicalSessionRate] = useState(0);
    const [fractureClinicalSessionDuration, setFractureClinicalSessionDuration] = useState(0);
    const [sessionExtension, setSessionExtension] = useState(0);
    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [contractedServiceProvider, setContractedServiceProvider] = useState('');
    const [activityOrServiceType, setActivityOrServiceType] = useState('Medical / Surgical Care Contracted Services');
    const [regularClinicSchedule, setRegularClinicSchedule] = useState(0);
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [regularClinicScheduleFrequency, setRegularClinicScheduleFrequency] = useState('WEEK');
    const [allActivities, setAllActivities] = useState(false);
    const [additionalCompensationTitle, setAdditionalCompensationTitle] = useState('');
    const [additionalCompensationPerMonth, setAdditionalCompensationPerMonth] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [frequency, setFrequency] = useState('WEEK');
    const [duration, setDuration] = useState(0);
    const [payment, setPayment] = useState(0);
    const [withNurse, setWithNurse] = useState(0);
    const [withoutNurse, setWithoutNurse] = useState(0);
    const [noTargetApplicable, setNoTargetApplicable] = useState(false);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);
    const [totalContractedServiceFrequency, setTotalContractedServiceFrequency] = useState('WEEK');
    const [dutyDays, setDutyDays] = useState([]);
    const [coverageCallDutyType, setCoverageCallDutyType] = useState('All On Call Service Duty');
    const [contractedServices, setContractedServices] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [helpTool, setHelpTool] = useState({calculator:false,textArea:false});
    const [selectedUsers, setSelectedUsers] = useState([]);
    const limit = 3;
    const limit5 = 5;

    useEffect(()=>{
      if(editService){
        getSelectedSites(selectedService?.sites);
        getNewLocation(selectedService?.locations);
        setServiceType(selectedService?.activityType?.activityType);
        let temp = [];
        selectedService?.activities?.map(data=>{
          temp.push({activity:data})
        });
        setSelectedActivity(temp);
        setShowLocation(selectedService?.locations?.length !== 0 ? true : false);
        setSelectedLocation(selectedService?.locations?.map(data=>data));
      }
    },[selectedService])

    let rightHelpArea = helpTool?.calculator || helpTool?.textArea;

    const getSelectedSites = (value) => {
      setSiteData(value);
    }

    const getNewLocation = (value) => {
      setNewLocation(value);
    }

    const leftElementButton = (text) => {
        return (
            <button className={`${style.minMaxLeftElement}`} >{text}</button>
        )
    }

    const removeFriendlyName = (index) => {
      setSelectedActivity(selectedActivity?.filter((data,indexValue)=>index !== indexValue)?.map(data=>data));
    }

    const removeLocation = (index) => {
      setSelectedLocation(selectedLocation?.filter((data, indexValue)=> index !== indexValue)?.map(data=>data));
    }

    useEffect(()=>{
      getLocations();
    }, [siteData])

    useEffect(()=> {
        getContractedServices();
        getUserData();
        getSites();
        getActivityList();
        getLocations();
    }, [])

    useEffect(()=> {
        if(selectContractInfo === "INDIVIDUAL"){
            setSelectedUser(users);
            setContractedServiceProvider(users[0]?.id);
        }
    }, [selectContractInfo, users])

    const getMetaData = (value) => {
      setMetadata(value);
    }

    const getActivityList = async() => {
      const {data: activityList} = await GET(`contract-managment-service/contracts/siteType/${siteTypeId}/activity`);
      setActivity(activityList);
    }

    const getLocations = async() => {
      const {data: location} = await GET(`contract-managment-service/contracts/site/${siteData?.map(data=>data?.id)[0]}/location`);
      setLocationList(location);
    }

    const getContractedServices = async() => {
        const {data: contractedServices} = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
        setContractedServices(contractedServices?.contractedServices)
    }

    const getUserData = async() => {
        const {data: userData} = await GET(`user-management-service/user?contractID=${contractId}`);
        if(userData){
          setUsers(userData);
        }
    }

    const activityToAdd = async() => {
      let data = {
          "activity": {
            "activity": newActivity
          },
          "siteTypeId": siteTypeId,
          "tenant": {
            "id": TenantID
          }
        }
      await POST(`contract-managment-service/contracts/siteType/${siteTypeId}/activity`, data)
      .then(response=>{
        getActivityList();
      })
      .catch(error=>{
        console.log('Error');
      })
    }

    const locationToAdd = async() => {
      let siteId = siteData?.map(data=>data?.id)[0];
      console.log('id',siteId);
      let data = {
          "location": newLocation,
          "siteId": siteId,
          "tenant": {
            "id": TenantID
          }
        }
      await POST(`contract-managment-service/contracts/site/${siteId}/location`, data)
      .then(response=>{
        getLocations();
      })
      .catch(error=>{
        console.log('Error');
      })
    }

    const getSites = async () => {
      const {data: contractData} = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
      let contractDetail = contractData?.contractDetail;
      let sites = contractDetail?.site?.sites;
      if(sites && siteList?.length === 0){
        setSiteList(sites);
      }
    }

    const handleDutyDays = (value) => {
        if(!dutyDays.includes(value)){
            setDutyDays([...dutyDays, value])
        } else {
            setDutyDays(dutyDays?.filter(data => data !== value)?.map(data => data))
        }
    }

    // let performingActivity = selectedActivity?.map(data=>data?.activity?.activity)?.join('-');

    const handleSave = async() => {
        let performingActivity = '';
        let activities = [];
        if(serviceType !== 'Supplemental Clinical Services'){
          performingActivity = selectedActivity?.map(data=>data?.activity?.activity)?.join('-')
          selectedActivity?.map(data=>{
            activities?.push({"activity":data?.activity?.activity})
          })
        }else{
          performingActivity = metadata?.supplementServiceName?.map(data=>data)?.join('-') || '';
          metadata?.supplementServiceName?.map(data=>(
            activities.push({"activity":data})
          ));
        }

            const data = {
                  "sites": siteData,
                  "activityType": {
                    "activityType": serviceType
                  },
                  "users": selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers,
                  "performingActivity": {
                    "activity": performingActivity
                  },
                  "activities": activities,
                  ...(serviceType === 'Supplemental Clinical Services' && {"hoursBorrowed": {
                      "activityType": {
                        "activityType": metadata?.dedicatedHoursActivityType || ''
                      },
                      "performingActivity": {
                        "activity": metadata?.dedicatedHoursPerformingActivity || ''
                      }
                    }}),
                  "locations": selectedLocation,
                  "contractedSchedule": {
                    "minimum": {
                      "value": parseInt(metadata?.min || '0')
                    },
                    "maximum": {
                      "value": parseInt(metadata?.max || '0')
                    },
                    "frequency": metadata?.frequency
                  },
                  "patientsSeenTarget": {
                    "withNurse": {
                      "value": parseInt(metadata?.withNurse || '0')
                    },
                    "withoutNurse": {
                      "value": parseInt(metadata?.withoutNurse || "0")
                    },
                    "noTargetApplicable": metadata?.noTargetApplicable
                  },
                  "scheduledPatientsTarget": {
                    "withNurse": {
                      "value": parseInt(metadata?.targetWithNurse || '0')
                    },
                    "withoutNurse": {
                      "value": parseInt(metadata?.targetWithoutNurse || '0')
                    },
                    "noTargetApplicable": true
                  },
                  "additionalSchedule": {
                    "value": parseInt(metadata?.additionalScheduleValue),
                    "frequency": metadata?.additionalScheduleFrequency,
                    "scheduleRequired": metadata?.additionalScheduleRequired
                  },
                  "rateType": metadata?.rateType,
                  "activityResponse": {
                    "dataMap": {
                      ...(serviceType === 'On Call Coverage Duty Days' && {
                        'onCallCoverageFor' : metadata?.onCallCoverageFor,
                      }
                    ),
                    }
                  },
                  "duration": {
                    "hours": parseInt(metadata?.sessionDuration)
                  },
                  "payableAmount": {
                    "value": parseInt(metadata?.sessionAmount)
                  },
                  "totalSessions": {
                    "value": parseInt(metadata?.totalSession),
                    "frequency": metadata?.totalSessionFrequency
                  },
                  "serviceDays": metadata?.serviceDays,
                  "workingPeriod": {
                    "from": metadata?.workingTimeFrom,
                    "to": metadata?.workingTimeTo
                  },
                  "workingHours": {
                    "normalWorkingHours": true,
                    "afterWorkingHours": true
                  },
                  "activityApprovalWFRequired": true,
                  "designateSpecificContractor": isDesignatedSpecificContractor,
                  "locationSpecified": showLocation,
                  "dedicatedHoursSpecified": serviceType === 'Supplemental Clinical Services' ? metadata?.dedicatedHoursSpecified : false,
                  "billableService": metadata?.billableService
                }
            let services = contractedServices || [];
            if(editService){
              let temp = services?.filter(data=>data?.activityType?.activityType !== serviceType || data?.performingActivity?.activity !== performingActivity)?.map(data=>data);
              temp.push(data);
              services = temp;
            }else{
              services.push(data);
            }
            let formattedData = {
                contractedServices: services
            }

            const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
            if(response){
                SuccessToaster('Contracted Service Updated Successfully');
                getContractedServices();
            }
            else {
                ErrorToaster('Unexpected Error');
            }
        // getContractedServices()
    }

    console.log('type', activityType);

    const reset = () => {
        setMin(0);
        setMax(0);
        setWithNurse(0);
        setWithoutNurse(0);
        setAdditionalClinicSchedule(0);
        setAdditionalSchedule(false);
        setDuration(0);
        setPayment(0);
        setTotalContractedService(0);
        setWorkingPeriodFrom('');
        setWorkingPeriodTo('');
    }

    const resetAll = () => {
        setMin(0);
        setMax(0);
        setWithNurse(0);
        setWithoutNurse(0);
        setAdditionalClinicSchedule(0);
        setAdditionalSchedule(false);
        setDuration(0);
        setPayment(0);
        setTotalContractedService(0);
        setWorkingPeriodFrom('');
        setWorkingPeriodTo('');
        setActivityContractedFor('');
        setContractedServiceProvider('');
        if(selectContractInfo !== "INDIVIDUAL"){
            setSelectedUsers([]);
        }
    }

    const handleUsers = (value) => {
        if (value !== '0') {
          const selectedValue = users?.filter(data => data?.id === value)?.map(data => data)[0];
          if (!selectedUsers?.map(data => data?.id)?.includes(value)) {
            setSelectedUsers([...selectedUsers, selectedValue]);
          }
        }
      }

    const usersTags = selectedUsers
    ?.filter(data => users?.map(user => user.id === data?.id))
    .map((tag, index) => {
      const onRemove = () => {
        setSelectedUsers(selectedUsers.filter((user) => user?.id !== tag?.id)?.map(data=>data));
      };
      return (
        <Tag key={index} onRemove={onRemove} large={true} className={style.tagStyle}>
          {tag?.name?.firstName} {tag?.name?.lastName}
        </Tag>
      );
    });

    const inputElementText = (text) => {
        return (
            <button className={`${style.textElement}`} >{text}</button>
        )
    }

    const activityItems = useMemo(
      () =>
        activity?.map((data) => ({
          id: data.id,
          value: data?.activity?.activity,
          ...data,
        })),
      [activity],
    );

    const locationItems = useMemo(
      () =>
        locationList?.map((data) => ({
          // id: data.id,
          value: data?.location,
          location: data?.location
        })),
      [locationList],
    )

    const onActivitySelect = (selectedItem) => {
      setItem(selectedItem);
      if(!selectedActivity?.map(data=>data?.id)?.includes(selectedItem?.id)){
        delete selectedItem["value"];
        let temp = selectedActivity;
        temp.push(selectedItem);
        setSelectedActivity(temp);
      }
    }

    const onLocationSelect = (selectedItem) => {
      setItem(selectedItem);
      if(!selectedLocation?.map(data=>data)?.includes(selectedItem)){
        delete selectedItem["value"];
        let temp = selectedLocation;
        temp.push(selectedItem);
        setSelectedLocation(temp);
      }
    }

    console.log('selectedActivity', selectedActivity);

    return (
        <div>
            <Dialog isOpen={getAddServiceDialog} onClose={() => {getAddServiceDialog(false);getEditServiceDialog(false);}} className={rightHelpArea ? `${style.addServiceDialog} ${style.addManagerDialogBackground}` : `${style.manageServiceDialog} ${style.addManagerDialogBackground}`}>
                <div className={`${Classes.DIALOG_BODY} `}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Add Services To Be Provided As Per Contract</p>
                        <div>
                          <Icon icon="edit" size={20} className={`${style.crossStyle} ${style.calculatorIconColor} ${style.marginRight}`} onClick={() => setHelpTool({...helpTool, textArea:!helpTool?.textArea})} />
                          <Icon icon="calculator" size={20} className={`${style.crossStyle} ${style.calculatorIconColor} ${style.marginRight}`} onClick={() => setHelpTool({...helpTool, calculator:!helpTool?.calculator})} />
                          <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => {getAddServiceDialog(false);getEditServiceDialog(false);}} />
                        </div>
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={rightHelpArea ? style.addServiceGrid : ''}>
                    <div className={style.proofBorder}>
                        <div className={`${style.addManagerGrid} `}>
                            <div className={style.extentionLableStyle}>Primary Sites/ Department Affiliation</div>
                            <SiteDepartmentField sites={siteList} getSelectedSites={getSelectedSites} selectedSites={siteData}/>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Activity /Service Type Contracted for*</div>
                            <div>
                                <Select
                                    displayEmpty
                                    value={serviceType}
                                    onChange={(e) => {setServiceType(e.target.value)}}
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                    className={`${style.fullWidth}`}
                                >
                                <MenuItem value="">Select Activity /Service Type</MenuItem>
                                {serviceTypeList?.map(data=>(
                                  <MenuItem value={data}>{data}</MenuItem>
                                ))}
                                </Select>
                            </div>
                        </div>
                        {selectContractInfo !== "INDIVIDUAL" && (
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Designate Specific Contractor*</div>
                                <div>
                                    <div className={`${style.displayInRow} `}>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={isDesignatedSpecificContractor} disabled={(selectContractInfo === "INDIVIDUAL") && true} className={`${style.textAlignLeft}`} onChange={() => setIsDesignatedSpecificContractor(!isDesignatedSpecificContractor)} />
                                            }
                                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                                            label={isDesignatedSpecificContractor ? 'YES' : 'NO'}
                                        />

                                        {isDesignatedSpecificContractor && (
                                            <Select
                                                displayEmpty
                                                onChange={(e) => handleUsers(e.target.value)}
                                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                                className={`${style.fullWidth}`}
                                            >
                                                <MenuItem value="">Select Contracted Services Provided</MenuItem>
                                                {users?.map((data, index) => (
                                                    <MenuItem value={data?.id} key={index}> {data?.name?.firstName} {data?.name?.lastName}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    </div>
                                    {usersTags?.length !== 0 && (
                                        <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                                            {usersTags}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Activities To Be Performed*</div>
                                <div>
                                    <div className={style.addGrid}>
                                        <DatalistInput items={activityItems || []} onSelect={onActivitySelect} className={style.fullWidth} onChange={(e)=>setNewActivity(e.target.value)}/>
                                        <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                            <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={activityToAdd} />
                                        </div>
                                    </div>
                                    {
                                      selectedActivity?.length !== 0 &&
                                      <MultiSelectDisplay values={selectedActivity?.map(data=>data?.activity?.activity)} removeItem={removeFriendlyName}/>
                                    }
                                </div>
                            </div>
                        </div>

                        {serviceType !== 'Add-On Clinical Services' && <div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                                <div>
                                    <div className={`${style.displayInRow} `}>
                                        <FormControlLabel
                                            control={
                                                <Switch className={`${style.textAlignLeft}`} />
                                            }
                                            checked={showLocation}
                                            onChange={()=>setShowLocation(!showLocation)}
                                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                                            label={showLocation ? 'YES' : 'NO'}
                                        />
                                        {showLocation &&
                                          <div className={`${style.addGrid} ${style.fullWidth}`}>
                                              <DatalistInput items={locationItems || []} onSelect={onLocationSelect} className={style.fullWidth} onChange={(e)=>setNewLocation(e.target.value)}/>
                                              <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                  <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd}/>
                                              </div>
                                          </div>
                                        }

                                    </div>
                                    {
                                      showLocation && selectedLocation?.length !== 0 &&
                                       <MultiSelectDisplay values={selectedLocation?.map(data=>data?.location)} removeItem={removeLocation}/>
                                    }
                                </div>
                            </div>
                        </div>}

                        {serviceType === 'Clinic Blocks'
                        ? <ClinicBlocksFields getMetaData={getMetaData} serviceSelected={selectedService} editService={editService}/>
                        : serviceType === 'Surgery Session'
                        ? <SurgerySessionFields getMetaData={getMetaData} serviceSelected={selectedService} editService={editService}/>
                        : serviceType === 'On Call Coverage Duty Days'
                        ? <OnCallCoverageFields getMetaData={getMetaData} serviceSelected={selectedService} editService={editService}/>
                        : serviceType === 'Supplemental Clinical Services'
                        ? <SupplementalFields getMetaData={getMetaData} services={contractedServices} serviceSelected={selectedService} editService={editService}/>
                        : serviceType === 'Add-On Clinical Services'
                        ? <AddonClinicFields getMetaData={getMetaData} services={contractedServices} locationItems={locationItems} getNewLocation={getNewLocation} locationToAdd={locationToAdd} serviceSelected={selectedService} editService={editService}/>
                        : <AdministrativeFields />}
                    </div>
                  </div>
                </div>
                <div>
                    <div className={`${style.floatRight}`}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {handleSave();resetAll()}}>ADD MORE</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=> {handleSave();resetAll();getAddServiceDialog(false);}}>SAVE & EXIT</button>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default AddServiceProvided;
