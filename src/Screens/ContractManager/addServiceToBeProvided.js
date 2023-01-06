import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, EditableText, RadioGroup, Radio, Checkbox, Tag, TextArea } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import DatalistInput from 'react-datalist-input';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import CalculateIcon from '@mui/icons-material/Calculate';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import { PUT, GET, TenantID, POST } from './../dataSaver';
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

const switchTheme = createTheme({
  palette: {
    primary: {
      main: '#7165E3',
    },
  },
});

const AddServiceProvided = ({ getAddServiceDialog, getAddOn, contractId, selectContractInfo, selectedService, editService, getEditServiceDialog, isMultiSiteEntity, selectedIndex, isEditable, getTabDataStatus }) => {
  const serviceTypeList = ['Clinic Blocks', 'Surgery Session', 'On Call Coverage Duty Days', 'Supplemental Services', 'Add-On Services', 'Administrative / Miscellaneous Services'];
  const siteTypeId = sessionStorage.getItem('entityTypeId');
  const [serviceType, setServiceType] = useState('Clinic Blocks');
  const [siteList, setSiteList] = useState([]);
  const [allLocation, setAllLocation] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [selectedActivity, setSelectedActivity] = useState([]);
  const [item, setItem] = useState();
  const [locationList, setLocationList] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [metadata, setMetadata] = useState();
  const [existingServices, setExistingServices] = useState([]);
  const [isDesignatedSpecificContractor, setIsDesignatedSpecificContractor] = useState(true);
  const [contractedServiceProvider, setContractedServiceProvider] = useState('');
  const [contractedServices, setContractedServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [usedActivity, setUsedActivity] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [helpTool, setHelpTool] = useState({ calculator: false, textArea: false });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [timeCommitment, setTimeCommitment] = useState({ value: 0, frequency: '' });
  const [isShowPDF, setIsShowPDF] = useState(false);
  const limit = 3;
  const limit5 = 5;

  useEffect(() => {
    if (editService) {
      getSelectedSites(selectedService?.sites);
      getNewLocation(selectedService?.locations);
      setServiceType(selectedService?.activityType?.activityType);
      setIsDesignatedSpecificContractor(selectedService?.designateSpecificContractor);
      setSelectedUsers(selectedService?.users || []);
      let temp = [];
      selectedService?.activities?.map(data => {
        temp.push({ activity: data })
      });
      setSelectedActivity(temp);
      setShowLocation(selectedService?.locationSpecified);
      setSelectedLocation(selectedService?.locations?.map(data => data));
      removeSelectedLocationFromList();
    }
  }, [selectedService]);

  const removeSelectedLocationFromList = () => {
    setLocationList(allLocation?.filter(data => !selectedLocation?.map(location => location?.location).includes(data?.location))?.map(data => data));
  }

  useEffect(() => {
    removeSelectedLocationFromList();
  }, [selectedLocation])

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
    setSelectedActivity(selectedActivity?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
  }

  const removeLocation = (index) => {
    setSelectedLocation(selectedLocation?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
  }

  useEffect(() => {
    getLocations();
  }, [siteData])

  useEffect(() => {
    getContractedServices();
    getUserData();
    getSites();
    getActivityList();
    getLocations();
  }, [])

  useEffect(() => {
    if (selectContractInfo === "INDIVIDUAL") {
      setSelectedUser(users);
      setContractedServiceProvider(users[0]?.id);
    }
  }, [selectContractInfo, users])

  useEffect(() => {
    let temp = [];
    contractedServices?.filter(data => data?.activityType?.activityType === serviceType)?.map(data => data?.activities?.map(activity => {
      temp.push(activity?.activity);
    }));
    setUsedActivity(temp);
  }, [serviceType, contractedServices])

  const getMetaData = (value) => {
    setMetadata(value);
  }

  const getActivityList = async () => {
    const { data: activityList } = await GET(`contract-managment-service/contracts/siteType/${siteTypeId}/activity`);
    setActivity(activityList);
  }

  const getLocations = async () => {
    const { data: location } = await GET(`contract-managment-service/contracts/site/${siteData?.map(data => data?.id)[0]}/location`);
    setAllLocation(location);
    setLocationList(location?.filter(data => !selectedLocation?.map(location => location?.location).includes(data?.location))?.map(data => data));
  }

  const getContractedServices = async () => {
    const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
    setContractedServices(contractedServices?.contractedServices);
    setExistingServices(contractedServices?.contractedServices);
  }

  const getUserData = async () => {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    if (userData) {
      setUsers(userData);
    }
  }

  const activityToAdd = async () => {
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
      .then(response => {
        getActivityList();
      })
      .catch(error => {
        console.log('Error');
      })
  }

  const locationToAdd = async () => {
    if (allLocation?.some(data => data?.location === newLocation)) {
      ErrorToaster('Location already exists');
      return;
    }
    if (newLocation !== '') {
      let siteId = siteData?.map(data => data?.id)[0];
      let data = {
        "location": newLocation,
        "siteId": siteId,
        "tenant": {
          "id": TenantID
        }
      }
      await POST(`contract-managment-service/contracts/site/${siteId}/location`, data)
        .then(response => {
          getLocations();
        })
        .catch(error => {
          console.log('Error');
        })
    }
  }

  const getSites = async () => {
    const { data: contractData } = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
    let contractDetail = contractData?.contractDetail;
    setTimeCommitment(contractDetail?.timeCommitment);
    let sites = contractDetail?.site?.sites;
    if (sites && siteList?.length === 0) {
      setSiteList(sites);
    }
  }
  console.log('metadata', metadata?.selectedActivities);

  const handleSave = async (buttonType) => {
    if (serviceType === '') {
      ErrorToaster('Activity Type Selection is Mandatory');
      return;
    }
    if(showLocation && selectedLocation?.length === 0){
      ErrorToaster('Atleast one location has to be selected if yes');
      return;
    }
    if(selectContractInfo !== "INDIVIDUAL" && isDesignatedSpecificContractor && selectedUsers?.length === 0){
      ErrorToaster('Atleast one User has to be selected if Specific Contractor is Yes');
      return;
    }
    if(metadata?.additionalScheduleRequired && (parseInt(metadata?.additionalScheduleValue) === 0 || metadata?.additionalScheduleFrequency === null)){
      ErrorToaster('Additional Schedule value and frequency required');
      return;
    }
    if(metadata?.billableService && parseInt(metadata?.sessionAmount) === 0)
    {
      ErrorToaster('Payment Amount field is mandatory if the service is Billable');
      return;
    }
    let performingActivity = '';
    let activities = [];
    if (serviceType !== 'Supplemental Services' && serviceType !== 'Add-On Services' && serviceType !== 'Administrative / Miscellaneous Services') {
      performingActivity = selectedActivity?.map(data => data?.activity?.activity)?.join('-')
      selectedActivity?.map(data => {
        activities?.push({ "activity": data?.activity?.activity })
      })
    }
    if (serviceType === 'Administrative / Miscellaneous Services') {
      performingActivity = metadata?.selectedActivities?.map(data => data?.activity)?.join('-')
      metadata?.selectedActivities?.map(data => {
        activities?.push({ "activity": data?.activity })
      })
    }
    if (serviceType === 'Supplemental Services') {
      performingActivity = metadata?.supplementServiceName?.map(data => data)?.join('-') || '';
      metadata?.supplementServiceName?.map(data => (
        activities.push({ "activity": data })
      ));
    }
    let data = [];
    if (serviceType === 'Add-On Services' && !editService) {
      let temp = metadata;
      data = temp;
      temp?.map(data => {
        data.sites = siteData;
        data.performingActivity = { activity: data?.performingActivity };
        data.users = selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers;
      });
    }
    else {
      let dataValues = metadata;
      if (serviceType === 'Add-On Services') {
        dataValues = metadata?.[0];
      }
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
        {
          "hoursBorrowed": {
            "activityType": {
              "activityType": dataValues?.dedicatedHoursActivityType || ''
            },
            "performingActivity": {
              "activity": dataValues?.dedicatedHoursPerformingActivity || ''
            }
          }
        }),
        "locations": selectedLocation,
        "contractedSchedule": {
          "minimum": {
            "value": parseInt(dataValues?.min || '0')
          },
          "maximum": {
            "value": parseInt(dataValues?.max || '0')
          },
          "frequency": dataValues?.frequency
        },
        "patientsSeenTarget": {
          "withNurse": {
            "value": parseInt(dataValues?.withNurse || '0')
          },
          "withoutNurse": {
            "value": parseInt(dataValues?.withoutNurse || "0")
          },
          "noTargetApplicable": dataValues?.noTargetApplicable
        },
        "scheduledPatientsTarget": {
          "withNurse": {
            "value": parseInt(dataValues?.targetWithNurse || '0')
          },
          "withoutNurse": {
            "value": parseInt(dataValues?.targetWithoutNurse || '0')
          },
          "noTargetApplicable": dataValues?.targetNoTargetApplicable
        },
        ...(serviceType === 'Supplemental Services' && {"additionalSchedule": {
          "value": parseInt(dataValues?.additionalScheduleValue),
          "frequency": dataValues?.additionalScheduleFrequency,
          "scheduleRequired": dataValues?.additionalScheduleRequired
        }}),
        "rateType": dataValues?.rateType,
        "activityResponse": {
          "dataMap": {
            ...(serviceType === 'On Call Coverage Duty Days' && {
              'onCallCoverageFor': dataValues?.onCallCoverageFor,
            }
            ),
            ...(serviceType === 'Administrative / Miscellaneous Services' && {
              'adminActivities': dataValues?.selectedActivities,
            }),
          }
        },
        "duration": {
          "hours": parseInt(dataValues?.sessionDuration)
        },
        "payableAmount": {
          "value": parseInt(dataValues?.sessionAmount)
        },
        "totalSessions": {
          "value": parseInt(dataValues?.totalSession),
          "frequency": dataValues?.totalSessionFrequency
        },
        "serviceDays": dataValues?.serviceDays,
        "workingPeriod": {
          "from": dataValues?.workingTimeFrom?.toLocaleTimeString('it-IT').toString(),
          "to": dataValues?.workingTimeTo?.toLocaleTimeString('it-IT').toString()
        },
        "workingHours": {
          "normalWorkingHours": true,
          "afterWorkingHours": true
        },
        "activityApprovalWFRequired": true,
        "designateSpecificContractor": isDesignatedSpecificContractor,
        "locationSpecified": showLocation,
        "dedicatedHoursSpecified": ['Supplemental Services', 'Administrative / Miscellaneous Services'].includes(serviceType) ? dataValues?.dedicatedHoursSpecified : false,
        "billableService": dataValues?.billableService
      }]
    }
    if (editService && serviceType === 'Add-On Services') {
      data[0].activities = metadata?.[0]?.activities;
      data[0].performingActivity = { activity: metadata?.[0]?.performingActivity };
    }
    let services = existingServices || [];
    if (editService) {
      let temp = services?.filter((data, index) => index !== selectedIndex)?.map(data => data);
      temp.push(...data);
      services = temp;
    } else {
      services.push(...data);
    }
    let formattedData = {
      contractedServices: services
    }

    const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
    if (response) {
      SuccessToaster('Contracted Service Updated Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }
    if (buttonType === 'SAVE AND EXIT') {
      getAddServiceDialog(false);
      getEditServiceDialog(false);
    }
    getTabDataStatus();
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
        setSelectedUsers(selectedUsers.filter((user) => user?.id !== tag?.id)?.map(data => data));
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
      activity?.filter(data => !usedActivity?.includes(data?.activity?.activity))?.map((data) => ({
        id: data.id,
        value: data?.activity?.activity,
        ...data,
      })),
    [activity, usedActivity],
  );

  const locationItems = useMemo(
    () =>
      locationList?.map((data) => data?.location && ({
        value: data?.location,
        location: data?.location
      })),
    [locationList],
  )

  const onActivitySelect = (selectedItem) => {
    setItem(selectedItem);
    if (!selectedActivity?.map(data => data?.id)?.includes(selectedItem?.id)) {
      delete selectedItem["value"];
      let temp = selectedActivity;
      temp.push(selectedItem);
      setSelectedActivity(temp);
    }
  }

  const onLocationSelect = (selectedItem) => {
    setItem(selectedItem);
    if (!selectedLocation?.map(data => data)?.includes(selectedItem)) {
      delete selectedItem["value"];
      let temp = selectedLocation;
      temp.push(selectedItem);
      setSelectedLocation(temp);
    }
    removeSelectedLocationFromList();
  }

  const handleDesignateContractor = () => {
    setIsDesignatedSpecificContractor(!isDesignatedSpecificContractor);
    if (isDesignatedSpecificContractor) {
      setSelectedUsers(users);
    } else {
      setSelectedUsers([]);
    }
  }

  const handleClose = () => {
    if (!isShowPDF) {
      getAddServiceDialog(false);
      getEditServiceDialog(false);
    } else {
      setIsShowPDF(!isShowPDF);
    }
  }

  const onShowLocationChange = (value) => {
    setShowLocation(value);
    if(!value){
      setSelectedLocation([]);
    }
  }

  return (
    <div>
      <Dialog isOpen={getAddServiceDialog} onClose={() => { getAddServiceDialog(false); getEditServiceDialog(false); }} className={`${style.manageServiceDialog} ${style.addManagerDialogBackground} ${rightHelpArea && style.moveDialogPosition}`}>
        <div className={`${Classes.DIALOG_BODY} `}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle}>Add Services To Be Provided As Per Contract</p>
            <div className={style.displayInRow}>
              <div className={`${style.cursorPointer} ${style.marginRight}`} onClick={() => setHelpTool({ ...helpTool, textArea: !helpTool?.textArea })}>
                <StickyNote2Icon style={{ fontSize: 30, color: '#bfbfbf' }} />
              </div>
              <div className={`${style.cursorPointer} ${style.marginRight}`} onClick={() => setIsShowPDF(!isShowPDF)}>
                <TextSnippetIcon style={{ fontSize: 30, color: '#bfbfbf' }} />
              </div>
              <div className={`${style.cursorPointer} ${style.marginRight}`} onClick={() => setHelpTool({ ...helpTool, calculator: !helpTool?.calculator })}>
                <CalculateIcon style={{ fontSize: 30, color: '#bfbfbf' }} />
              </div>
              <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => handleClose()} />
            </div>
          </div>
          <div className={style.extensionBorder}></div>
          {!isShowPDF ? (
            <div className={style.displayInRow}>
              <div className={style.proofBorder}>
                <div className={`${style.addManagerGrid} `}>
                  <div className={style.extentionLableStyle}>Primary Sites/ Department Affiliation</div>
                  <SiteDepartmentField sites={siteList} getSelectedSites={getSelectedSites} selectedSites={siteData} isMultiSiteEntity={isMultiSiteEntity} />
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Activity /Service Type Contracted for*</div>
                  <div>
                    <Select
                      displayEmpty
                      value={serviceType}
                      onChange={(e) => { setServiceType(e.target.value) }}
                      SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                      className={`${style.fullWidth}`}
                    >
                      <MenuItem value="">Select Activity /Service Type</MenuItem>
                      {serviceTypeList?.map(data => (
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
                        <ThemeProvider theme={switchTheme}>
                          <FormControlLabel
                            control={
                              <Switch checked={isDesignatedSpecificContractor} disabled={(selectContractInfo === "INDIVIDUAL") && true} className={`${style.textAlignLeft}`} onChange={() => handleDesignateContractor()} />
                            }
                            color='primary'
                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                            label={isDesignatedSpecificContractor ? 'YES' : 'NO'}
                          />
                        </ThemeProvider>

                        {isDesignatedSpecificContractor ? (
                          <Select
                            displayEmpty
                            onChange={(e) => handleUsers(e.target.value)}
                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                            className={`${style.fullWidth}`}
                          >
                            <MenuItem value="">Select Contractors for Services to be Provided</MenuItem>
                            {users?.map((data, index) => (
                              <MenuItem value={data?.id} key={index}> {data?.name?.firstName} {data?.name?.lastName}</MenuItem>
                            ))}
                          </Select>
                        ) : <p className={` ${style.marginTop10}`}>Any Contractor</p>
                        }
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
                          <DatalistInput items={activityItems || []} onSelect={onActivitySelect} className={style.fullWidth} onChange={(e) => setNewActivity(e.target.value)} />
                          <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                            <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={activityToAdd} />
                          </div>
                        </div>
                        {
                          selectedActivity?.length !== 0 &&
                          <MultiSelectDisplay values={selectedActivity?.map(data => data?.activity?.activity)} removeItem={removeFriendlyName} />
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
                        <ThemeProvider theme={switchTheme}>
                          <FormControlLabel
                            control={
                              <Switch className={`${style.textAlignLeft}`} />
                            }
                            color='primary'
                            checked={showLocation}
                            onChange={() => onShowLocationChange(!showLocation)}
                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                            label={showLocation ? 'YES' : 'NO'}
                          />
                        </ThemeProvider>
                        {showLocation &&
                          <div className={`${style.addGrid} ${style.fullWidth}`}>
                            <DatalistInput items={locationItems || []} onSelect={onLocationSelect} className={style.fullWidth} onChange={(e) => setNewLocation(e.target.value)} />
                            <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                              <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={locationToAdd} />
                            </div>
                          </div>
                        }

                      </div>
                      {
                        showLocation && selectedLocation?.length !== 0 &&
                        <MultiSelectDisplay values={selectedLocation?.map(data => data?.location)} removeItem={removeLocation} />
                      }
                    </div>
                  </div>
                </div>}

                {serviceType === 'Clinic Blocks'
                  ? <ClinicBlocksFields getMetaData={getMetaData} serviceSelected={selectedService} timeCommitment={timeCommitment} />
                  : serviceType === 'Surgery Session'
                    ? <SurgerySessionFields getMetaData={getMetaData} serviceSelected={selectedService} timeCommitment={timeCommitment} />
                    : serviceType === 'On Call Coverage Duty Days'
                      ? <OnCallCoverageFields getMetaData={getMetaData} serviceSelected={selectedService} timeCommitment={timeCommitment} />
                      : serviceType === 'Supplemental Services'
                        ? <SupplementalFields getMetaData={getMetaData} services={contractedServices} serviceSelected={selectedService} editService={editService} />
                        : serviceType === 'Add-On Services'
                          ? <AddonClinicFields getMetaData={getMetaData} services={contractedServices} locationItems={locationItems} getNewLocation={getNewLocation} locationToAdd={locationToAdd} serviceSelected={selectedService} editService={editService} />
                          : <AdministrativeFields getMetaData={getMetaData} services={contractedServices} serviceSelected={selectedService} editService={editService} />}
              </div>
              {helpTool?.calculator ? (
                <div className={style.calculatorDisplayStyle}>
                  <Calculator />
                </div>
              ) : helpTool?.textArea ? (
                <div className={style.calculatorDisplayStyle}>
                  <Calculator />
                </div>
              ) : ''}
            </div>
          ) : (
            <div className={`${style.pdfViewStyle} ${style.marginTop}`}>
              <iframe src='https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' allowfullscreen height="500px" width="100%" title='Document' />
            </div>
          )}
        </div>
        <div>
          {isEditable &&
            <div className={`${style.floatRight}`}>
              <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => { handleSave('ADD MORE'); reset() }}>ADD MORE</button>
              <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => { handleSave('SAVE AND EXIT'); reset() }}>SAVE & EXIT</button>
            </div>
          }

        </div>
      </Dialog>

    </div>
  )
}

export default AddServiceProvided;
