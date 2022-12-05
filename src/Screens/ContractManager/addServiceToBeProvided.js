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

const AddServiceProvided = ({ getAddServiceDialog, getAddOn, contractId, selectContractInfo, selectedService, editService, getEditServiceDialog, isMultiSiteEntity, selectedContractServiceIndex }) => {
    const serviceTypeList = ['Clinic Blocks','Surgery Session','On Call Coverage Duty Days','Supplemental Services','Add-On Services','Administrative / Miscellaneous Services'];
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
    const [existingServices, setExistingServices] = useState([]);
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
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
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
    const [usedActivity, setUsedActivity] = useState([]);
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

    useEffect(()=>{
      let temp = [];
      contractedServices?.filter(data=>data?.activityType?.activityType === serviceType)?.map(data=>data?.activities?.map(activity=>{
        temp.push(activity?.activity);
      }));
      setUsedActivity(temp);
    }, [serviceType, contractedServices])

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
        setContractedServices(contractedServices?.contractedServices);
        setExistingServices(contractedServices?.contractedServices);
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

    const handleSave = async(buttonType) => {
        let performingActivity = '';
        let activities = [];
        if(serviceType !== 'Supplemental Services' && serviceType !== 'Add-On Services'){
          performingActivity = selectedActivity?.map(data=>data?.activity?.activity)?.join('-')
          selectedActivity?.map(data=>{
            activities?.push({"activity":data?.activity?.activity})
          })
        }
        if(serviceType === 'Administrative / Miscellaneous Services'){
          performingActivity = metadata?.selectedActivities?.map(data=>data?.activity)?.join('-')
          metadata?.selectedActivities?.map(data=>{
            activities?.push({"activity":data?.activity})
          })
        }
        if(serviceType === 'Supplemental Services'){
          performingActivity = metadata?.supplementServiceName?.map(data=>data)?.join('-');
          metadata?.supplementServiceName?.map(data=>(
            activities.push({"activity":data})
          ));
        }
        let data = [];
        if(serviceType === 'Add-On Services'){
          let temp = metadata;
          temp?.map(data=>{
            data.sites = siteData;
            data.performingActivity = {activity:data?.performingActivity};
            data.users = selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers;
          });
          data = temp;
        }
        else{
             data = [{
                  "sites": siteData,
                  "activityType": {
                    "activityType": serviceType
                  },
                  "users": selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers,
                  "performingActivity": {
                    "activity": performingActivity
                  },
                  "activities": activities,
                  ...((serviceType === 'Supplemental Services' || serviceType === 'Administrative / Miscellaneous Services') &&
                  {"hoursBorrowed": {
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
                    "noTargetApplicable": metadata?.noTargetApplicable || false
                  },
                  "scheduledPatientsTarget": {
                    "withNurse": {
                      "value": parseInt(metadata?.targetWithNurse || '0')
                    },
                    "withoutNurse": {
                      "value": parseInt(metadata?.targetWithoutNurse || '0')
                    },
                    "noTargetApplicable": metadata?.targetNoTargetApplicable || false
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
                    ...(serviceType === 'Administrative / Miscellaneous Services' && {
                      'adminActivities' : metadata?.selectedActivities,
                    }),
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
                  "dedicatedHoursSpecified": serviceType === 'Supplemental Services' ? metadata?.dedicatedHoursSpecified : false,
                  "billableService": metadata?.billableService
                }]
              }
            let services = existingServices || [];
            if(editService){
              console.log('selected', selectedService);
              // console.log('in edit',services?.filter(data=>data?.activityType?.activityType === serviceType && data?.performingActivity === selectedService?.performingActivity)?.map(data=>data));
              // existingServices?.map(data=>{
              //   console.log('serviceType', data?.activityType?.activityType, serviceType);
              //   console.log('performingActivity', data?.performingActivity, selectedService?.performingActivity);
              // })
              let temp = existingServices?.filter((data, index)=>index !== selectedContractServiceIndex)?.map(data=>data);
              temp.push(...data);
              services = temp;
              // existingServices?.map(service=>{
              //   if(service?.activityType?.activityType !== serviceType && service?.performingActivity !== selectedService?.performingActivity){
              //     // console.log('selected if', service?.activityType?.activityType, service?.performingActivity, data);
              //     temp.push(...data);
              //   }
              // })
              // let temp = services?.filter(data=>data?.activityType?.activityType !== serviceType && data?.performingActivity !== selectedService?.performingActivity)?.map(data=>data);
              // console.log('temp', temp, data);
              // temp.push(...data);
              // services = temp;
            }else{
              services.push(...data);
            }
            let formattedData = {
                contractedServices: services
            }

            const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
            if(response){
                SuccessToaster('Contracted Service Updated Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }
          if(buttonType === 'SAVE AND EXIT'){
            getAddServiceDialog(false);
            getEditServiceDialog(false);
          }
          reset();
    }

    const reset = () => {
      setMetadata([]);
      setSelectedLocation([]);
      setSelectedActivity([]);
      setSiteData([]);
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
            <button className={`${style.textElement}`}>{text}</button>
        )
    }

    const activityItems = useMemo(
      () =>
        activity?.filter(data=>!usedActivity?.includes(data?.activity?.activity))?.map((data) => ({
          id: data.id,
          value: data?.activity?.activity,
          ...data,
        })),
      [activity, usedActivity],
    );

    const locationItems = useMemo(
      () =>
        locationList?.map((data) => ({
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


    return (
        <div>
            <Dialog isOpen={getAddServiceDialog} onClose={() => {getAddServiceDialog(false);getEditServiceDialog(false);}} className={rightHelpArea ? `${style.addServiceDialog} ${style.addManagerDialogBackground}` : `${style.manageServiceDialog} ${style.addManagerDialogBackground}`}>
                <div className={`${Classes.DIALOG_BODY} `}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Add Services To Be Provided As Per Contract</p>
                        <div>
                        {
                          // <Icon icon="edit" size={20} className={`${style.crossStyle} ${style.calculatorIconColor} ${style.marginRight}`} onClick={() => setHelpTool({...helpTool, textArea:!helpTool?.textArea})} />
                          // <Icon icon="calculator" size={20} className={`${style.crossStyle} ${style.calculatorIconColor} ${style.marginRight}`} onClick={() => setHelpTool({...helpTool, calculator:!helpTool?.calculator})} />
                        }
                          <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => {getAddServiceDialog(false);getEditServiceDialog(false);}} />
                        </div>
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={rightHelpArea ? style.addServiceGrid : ''}>
                    <div className={style.proofBorder}>
                    <div className={`${style.addManagerGrid}`}>
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
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Primary Sites/ Department Affiliation</div>
                            <SiteDepartmentField sites={siteList} getSelectedSites={getSelectedSites} selectedSites={siteData} isMultiSiteEntity={isMultiSiteEntity}/>
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
                        {
                          serviceType !== 'Administrative / Miscellaneous Services' && serviceType !== 'Add-On Services' && serviceType !== 'Supplemental Services' &&
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
                        }


                        {serviceType !== 'Add-On Services' && <div>
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
                        : serviceType === 'Supplemental Services'
                        ? <SupplementalFields getMetaData={getMetaData} services={contractedServices} serviceSelected={selectedService} editService={editService}/>
                        : serviceType === 'Add-On Services'
                        ? <AddonClinicFields getMetaData={getMetaData} services={contractedServices} locationItems={locationItems} getNewLocation={getNewLocation} locationToAdd={locationToAdd} serviceSelected={selectedService} editService={editService}/>
                        : <AdministrativeFields getMetaData={getMetaData} services={contractedServices} serviceSelected={selectedService} editService={editService}/>}
                    </div>
                  </div>
                </div>
                <div>
                    <div className={`${style.floatRight}`}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {handleSave('ADD MORE');reset()}}>ADD MORE</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=> {handleSave('SAVE AND EXIT');reset()}}>SAVE & EXIT</button>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default AddServiceProvided;
