import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Classes, Icon, Intent, Tag } from '@blueprintjs/core';
import cloneDeep from 'lodash.clonedeep';

import AddIcon from '@mui/icons-material/Add';
import DatalistInput, { useComboboxControls } from 'react-datalist-input';
import { PUT, GET, TenantID, POST } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import Calculator from './../../Components/Calculator';
import NotesNotOpen from './../../images/notesNotOpen.png';
import DocumentNotOpen from './../../images/documentNotOpen.png';
import CalculatorNotOpen from './../../images/calculatorNotOpen.png';
import NotesOpen from './../../images/notesOpen.png';
import DocumentOpen from './../../images/documentOpen.png';
import CalculatorOpen from './../../images/calculatorOpen.png';
import Popover from '@mui/material/Popover';
import SiteDepartmentField from '../../Components/ReusableSmallComponents/siteDepartmentField';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';
import ClinicBlocksFields from './clinicBlocksField';
import ProcedureReading from './procedureReading';
import OnCallCoverageFields from './onCallCoverageFields';
import SupplementalFields from './supplementalFields';
import AddonClinicFields from './addonClinicFields';
import AdministrativeFields from './administrativeFields';
import SurgerySessionFields from './surgerySessionFields';
import { workFlowDataGenerator } from './workflowDataGenerator';
import { CLINIC, SURGERY, ONCALL, SUPPLEMENTAL, ADDON, ADMINISTRATIVE, PROCEDUREREADING } from '../../Constants';
import Notes from '../../Components/Notes';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import ServiceConflict from './serviceConflict';
import { checkActivityChange } from './checkDependentData';

import style from './index.module.scss';
import { weekdays } from 'moment';

const AddServiceProvided = ({ getAddServiceDialog, getAddOn, contractId, selectContractInfo, selectedService, editService, getEditServiceDialog, isMultiSiteEntity, selectedIndex, isEditable, getTabDataStatus }) => {
  const [serviceTypeList, setServiceTypeList] = useState([]);
  const [serviceTypeId, setServiceTypeId] = useState('');
  const siteTypeId = sessionStorage.getItem('entityTypeId');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState([]);
  const [serviceType, setServiceType] = useState(CLINIC);
  const [serviceTypeTemplate, setServiceTypeTemplate] = useState(CLINIC);
  const [addOnButton, setAddOnButton] = useState('');
  const [siteList, setSiteList] = useState([]);
  const [allLocation, setAllLocation] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [isReset, setIsReset] = useState(false);
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
  const [isWorkFlowUpdated, setIsWorkFlowUpdated] = useState(false);
  const [timeCommitment, setTimeCommitment] = useState({ value: 0, frequency: '' });
  const [contractTermPeriod, setContractTermPeriod] = useState({ start: null, end: null });
  const [isShowPDF, setIsShowPDF] = useState(false);
  const [pdfToOpen, setPdfToOpen] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [anchorElDoc, setAnchorElDoc] = useState(null);
  const openDoc = Boolean(anchorElDoc);
  const idDoc = openDoc ? 'simple-popover' : undefined;
  const [isShowNotesList, setIsShowNotesList] = useState(false);
  const [isShowDocumentsList, setIsShowDocumentsList] = useState(false);
  const [contractDocumentList, setContractDocumentList] = useState([]);
  const [continueLoading, setContinueLoading] = useState(false);
  const { setValue, value } = useComboboxControls({ initialValue: '' });
  const [location, setLocation] = useState('');
  const [conflict, setConflict] = useState({ isPresent: false, data: [] });
  const [activityUpdated, setActivityUpdated] = useState(false);
  const [activityItems, setActivityItems] = useState([]);
  const [reducedOffsetApplicable, setReducedOffsetApplicable] = useState(false);
  const [compensationPolicy, setCompensationPolicy] = useState('');

  useEffect(() => {
    getContractedServices();
    getUserData();
    getSites();
    getServiceList();
    // getActivityList();
    getLocations();
    getContractNotes();
  }, [])

  useEffect(() => {
    if (editService) {
      setSiteData(selectedService?.sites);
      getSelectedSites(selectedService?.sites);
      getNewLocation(selectedService?.locations);
      setServiceType(selectedService?.activityType?.activityType);
      setServiceTypeTemplate(selectedService?.activityTypeTemplate?.activityTypeTemplate);
      setIsDesignatedSpecificContractor(selectedService?.designateSpecificContractor);
      setSelectedUsers(selectedService?.users || []);
      let temp = [];
      selectedService?.activities?.map(data => {
        temp.push({ activity: data })
      });
      setSelectedActivity(temp);
      setShowLocation(selectedService?.locationSpecified);
      setReducedOffsetApplicable(selectedService?.compensationReductionApplicable);
      setSelectedLocation(selectedService?.serviceLocations?.map(data => data));
      removeSelectedLocationFromList();
      setServiceTypeId(serviceTypeList?.filter(type => type?.serviceType === selectedService?.activityType?.activityType)?.map(data => data?.id)[0]);
    }
  }, [selectedService, serviceTypeList]);

  useEffect(() => {
    if (siteData?.length !== 0) {
      let temp = [];
      siteData?.map(data => data?.departmentList?.departments?.map(dept => {
        temp.push(dept?.id);
      }))
      setSelectedDeptId(temp);
    }
  }, [siteData])

  useEffect(() => {
    getActivityItems();
  }, [activity, usedActivity?.length])

  const removeSelectedLocationFromList = () => {
    setLocationList(allLocation?.filter(data => !selectedLocation?.map(location => location?.location).includes(data?.location))?.map(data => data));
  }

  useEffect(() => {
    removeSelectedLocationFromList();
  }, [selectedLocation])

  useEffect(() => {
    if (newActivity !== '') {
      setActivityUpdated(true);
      onActivitySelect(activity?.filter(data => data?.activity?.activity === newActivity)?.map(data => data)[0]);
    }
  }, [activity])

  useEffect(() => {
    if (isWorkFlowUpdated) {
      setIsWorkFlowUpdated(false);
      handleSave(addOnButton);

    }
  }, [metadata, isWorkFlowUpdated])

  const getServiceList = async () => {
    const { data: serviceList } = await GET(`entity-service/contractedServiceType`);
    setServiceTypeList(serviceList);
    if (!editService) {
      setServiceType(serviceList?.filter(data => data?.serviceTypeTemplate === CLINIC)?.map(data => data?.serviceType)[0]);
      setServiceTypeId(serviceList?.filter(data => data?.serviceTypeTemplate === CLINIC)?.map(data => data?.id)[0]);
    }
  }

  let rightHelpArea = helpTool?.calculator || helpTool?.textArea;

  const getSelectedSites = (value) => {
    setSiteData(value);
  }

  const getNewLocation = (value) => {
    setNewLocation(value);
  }

  const removeFriendlyName = (index) => {
    setActivityUpdated(true);
    setSelectedActivity(selectedActivity?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
    setUsedActivity(usedActivity?.filter((data, indexValue) => indexValue !== index)?.map(data => data));
  }

  const removeLocation = (index) => {
    setSelectedLocation(selectedLocation?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
  }

  useEffect(() => {
    getLocations();
  }, [selectedDeptId])

  useEffect(() => {
    if (serviceTypeId !== '') {
      setNewActivity('');
      getActivityList();
    }
  }, [serviceTypeId, siteData])

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
    let dept = [];
    siteData?.map(data => data?.departmentList?.departments?.map(deptData => {
      dept.push(deptData?.id)
    }))
    const { data: activityList } = await GET(`contract-managment-service/contracts/activities?siteTypeId=${siteTypeId}&&contractedServiceTypeId=${serviceTypeId}&&departments=${dept}`);
    setActivity(activityList);
  }

  const getLocations = async () => {
    let deptId = ''
    selectedDeptId?.map((data, index) => {
      if (index === 0) {
        deptId = deptId + `departments=${data}`
      } else {
        deptId = deptId + `&departments=${data}`
      }
    })

    const { data: location } = await GET(`entity-service/servicelocation?${deptId}&isContractView=true`);
    setAllLocation(location);
    setLocationList(location?.filter(data => !selectedLocation?.map(location => location?.location).includes(data?.location))?.map(data => data));
  }

  const getContractedServices = async () => {
    if (contractedServices?.length === 0) {
      const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
      setContractedServices(contractedServices?.contractedServices);
      setExistingServices(contractedServices?.contractedServices);
    }
  }

  const getContractNotes = async () => {
    const { data: contractNotes } = await GET(`contract-managment-service/contracts/notes?contractId=${contractId}&&referenceId=${selectedService?.refId}`);
  }

  const getUserData = async () => {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    if (userData) {
      let user = userData?.filter(user => !user?.contracts?.map(data => data?.id)?.includes(''))?.map(data => data);
      setUsers(user?.filter(userData => userData?.roles?.map(role => role?.roleName)?.includes('Activity Logger'))?.map(data => data));
    }
  }

  console.log('conflict Data testing', conflict);
  const activityToAdd = async () => {
    setActivityUpdated(true);
    let dept = [];
    siteData?.map(site => site?.departmentList?.departments?.map(deptData => {
      dept.push(deptData.id);
    }))
    if (activity?.some(data => data?.activity?.activity?.replace(' ', '')?.toLowerCase()?.includes(newActivity?.replace(' ', '')?.toLowerCase()))) {
      return;
    }
    if (newActivity === '') {
      ErrorToaster('Enter valid Acitivty name');
      return;
    }
    if (activity?.map(data => data?.activity?.activity)?.includes(newActivity)) {
      ErrorToaster('Activity Already Exists');
      return;
    }
    let data = {
      "activity": {
        "activity": newActivity,
      },
      "contractedServiceTypeId": serviceTypeId,
      "siteTypeId": siteTypeId,
      "tenant": {
        "id": TenantID
      },
      "departments": dept,
    }
    await POST(`contract-managment-service/contracts/activities`, data)
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
    setCompensationPolicy(contractDetail?.compensationPolicy ?? '')
    setContractTermPeriod({ start: contractDetail?.contractTerm?.effectiveDate, end: contractDetail?.contractTerm?.endDate });
    let temp = [];
    contractDetail?.contractFiles?.map(data => {
      temp.push({ name: data?.documentName, url: data?.fileURL });
    })
    setContractDocumentList(temp);
    let sites = contractDetail?.site?.sites;
    if (sites && siteList?.length === 0) {
      setSiteList(sites);
    }
  }

  console.log('metadata', metadata);

  const addOnWorkFlow = async (buttonType) => {
    setContinueLoading(true);
    setAddOnButton(buttonType);
    if (serviceTypeTemplate === ADDON && editService && metadata?.[0]?.approver !== undefined) {
      let dataValue = [];
      let temp = metadata;
      console.log('temp', temp);
      temp?.map((data, index) => {
        data.serviceLocations = data?.locationSpecified ? data?.locations : locationItems;
        data.performingActivity = data?.activities?.map(data => data?.activity)?.join('-');
        data.addOnActivityType = data?.addOnActivityType;
        console.log('performing Activity and addOnActivityType', data.performingActivity, data.addOnActivityType);
        if (data?.approver !== undefined) {
          let workFlowData;
          data.activityType.activityType = serviceType;
          // data.activityType.id = serviceTypeId;
          data.activityTypeTemplate = { activityTypeTemplate: serviceTypeTemplate };
          if (data?.approver?.id === data?.paymentApprover?.id || data?.paymentApprover === undefined) {
            let name = `${data?.approver?.name?.firstName} ${data?.approver?.name?.lastName}`
            workFlowData = workFlowDataGenerator(data?.performingActivity, [{ step: 1, userId: data?.approver?.id, userName: name, userTitle: { title: data?.approverTitle?.title, id: data?.approverTitle?.id }, userSuffix: data?.approver?.name?.suffix, status: 'APPROVED' }]);
          } else {
            let approverName = `${data?.approver?.name?.firstName} ${data?.approver?.name?.lastName}`
            let paymentApproverName = `${data?.paymentApprover?.name?.firstName} ${data?.paymentApprover?.name?.lastName}`
            workFlowData = workFlowDataGenerator(data?.performingActivity, [{ step: 1, userId: data?.approver?.id, userName: approverName, userTitle: { title: data?.approverTitle?.title, id: data?.approverTitle?.id }, userSuffix: data?.approver?.name?.suffix, status: 'PRE_AUTHORIZED' }, { step: 2, userId: data?.paymentApprover?.id, userName: paymentApproverName, userTitle: data?.paymentApprover?.title, userSuffix: data?.paymentApprover?.name?.suffix, status: 'APPROVED' }]);
          }
          if (data.workflowId === undefined || data.workflowId === null || data.workflowId === '') {
            POST(`timesheet-management-service/workflow`, JSON.stringify(workFlowData)).
              then(response => {
                data.workFlow = {
                  id: response?.data,
                  workFlowName: {
                    name: data?.performingActivity,
                  }
                }
                dataValue.push(data);
                if (temp?.length - 1 === index) {
                  setMetadata(dataValue);
                  setIsWorkFlowUpdated(true);
                }
              }).catch(error => {
                ErrorToaster('Unexpected Error');
              })
          } else {
            PUT(`timesheet-management-service/workflow/${data.workflowId}`, workFlowData)
              .then(response => {
                data.workFlow = {
                  id: data?.workflowId,
                  workFlowName: {
                    name: data?.workflowName,
                  }
                }
                dataValue.push(data);
                setMetadata(dataValue);
                setIsWorkFlowUpdated(true);
              })
              .catch(error => {
                ErrorToaster('Unexpected Error');
              })
          }
        } else {
          data.workFlow = null;
          data.activityType.activityType = serviceType;
          // data.activityType.id = serviceTypeId;
          data.activityTypeTemplate.activityTypeTemplate = { activityTypeTemplate: serviceTypeTemplate };
        }
      })
    }
    else if (serviceTypeTemplate === ADDON && !editService) {
      let dataValue = [];
      let data = [];
      let temp = metadata;
      data = temp;
      temp?.map((data, index) => {
        data.serviceLocations = data?.locationSpecified ? data?.locations : locationItems;
        data.refId = (new Date()).getTime()?.toString();
        let dataMap = {
          selectedActivityId: data?.selectedActivityId,
          additionalDetails: data?.activityResponse?.dataMap?.additionalDetails,
        }
        if (!data?.selectedActivityId) {
          data.payableAmount = { value: parseFloat(data?.sessionAmount) };
        }
        data.activityResponse = { dataMap: dataMap };
        data.sites = siteData;
        data.activityType.activityType = serviceType;
        if (data?.selectedActivityId) {
          data.addOnActivityType = data?.addOnActivityType;
        }
        // data.activityType.id = serviceTypeId;
        data.activityTypeTemplate = { activityTypeTemplate: serviceTypeTemplate };
        data.performingActivity = data?.activities?.map(data => data?.activity)?.join('-');
        // typeof data.performingActivity !== 'object' ? { activity: data?.performingActivity?.split('(')?.[1]?.split(')')?.[0] } : data?.performingActivity?.split('(')?.[1]?.split(')')?.[0]
        // ;
        data.users = selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers;
        if (data?.approver !== undefined) {
          let workFlowData;
          if (data?.approver?.id === data?.paymentApprover?.id || data?.paymentApprover === undefined) {
            let name = `${data?.approver?.name?.firstName} ${data?.approver?.name?.lastName}`
            workFlowData = workFlowDataGenerator(data?.performingActivity?.activity, [{ step: 1, userId: data?.approver?.id, userName: name, userTitle: { title: data?.approverTitle?.title, id: data?.approverTitle?.id }, userSuffix: data?.approver?.name?.suffix, status: 'APPROVED' }]);
          } else {
            let approverName = `${data?.approver?.name?.firstName} ${data?.approver?.name?.lastName}`
            let paymentApproverName = `${data?.paymentApprover?.name?.firstName} ${data?.paymentApprover?.name?.lastName}`
            workFlowData = workFlowDataGenerator(data?.performingActivity?.activity, [{ step: 1, userId: data?.approver?.id, userName: approverName, userTitle: { title: data?.approverTitle?.title, id: data?.approverTitle?.id }, userSuffix: data?.approver?.name?.suffix, status: 'PRE_AUTHORIZED' }, { step: 2, userId: data?.paymentApprover?.id, userName: paymentApproverName, userTitle: data?.paymentApprover?.title, userSuffix: data?.paymentApprover?.name?.suffix, status: 'APPROVED' }]);
          }

          if (data.workflowId === undefined || data.workflowId === null || data.workflowId === '') {
            POST(`timesheet-management-service/workflow`, JSON.stringify(workFlowData)).
              then(response => {
                data.workFlow = {
                  id: response?.data,
                  workFlowName: {
                    name: data?.performingActivity?.activity,
                  }
                }
                dataValue.push(data);
                if (temp?.length - 1 === index) {
                  setMetadata(dataValue);
                  setIsWorkFlowUpdated(true);
                }
              }).catch(error => {
                ErrorToaster('Unexpected Error');
              })
          }
        } else {
          data.workFlow = null;
          handleSave(buttonType);
        }
      });

    } else if (serviceTypeTemplate === ONCALL) {
      let data = metadata;
      if (data?.approver !== undefined) {
        let workFlowData;
        let name = `${data?.approver?.name?.firstName} ${data?.approver?.name?.lastName}`
        workFlowData = workFlowDataGenerator("On-Call Additional Activity Workflow", [{ step: 1, userId: data?.approver?.id, userName: name, userTitle: { title: data?.approverTitle?.title, id: data?.approverTitle?.id }, userSuffix: data?.approver?.name?.suffix, status: 'APPROVED' }]);
        if (data.workflowId === undefined || data.workflowId === null || data.workflowId === '') {
          POST(`timesheet-management-service/workflow`, JSON.stringify(workFlowData)).
            then(response => {
              data.workFlow = {
                id: response?.data,
                workFlowName: {
                  name: data?.performingActivity?.activity,
                }
              }
              setMetadata(data);
              setIsWorkFlowUpdated(true);

            }).catch(error => {
              ErrorToaster('Unexpected Error');
            })
        } else {
          PUT(`timesheet-management-service/workflow/${data.workflowId}`, workFlowData)
            .then(response => {
              data.workFlow = {
                id: data?.workflowId,
                workFlowName: {
                  name: data?.workflowName,
                }
              }
              setMetadata(data);
              setIsWorkFlowUpdated(true);
            })
            .catch(error => {
              ErrorToaster('Unexpected Error');
            })
        }
      } else {
        handleSave(buttonType);
      }
    } else if (serviceTypeTemplate === ADMINISTRATIVE) {
      let data = metadata;
      if (data?.approver !== undefined) {
        let workFlowData;
        let name = `${data?.approver?.name?.firstName} ${data?.approver?.name?.lastName}`
        workFlowData = workFlowDataGenerator("Administrative Service Workflow", [{ step: 1, userId: data?.approver?.id, userName: name, userTitle: { title: data?.approverTitle?.title, id: data?.approverTitle?.id }, userSuffix: data?.approver?.name?.suffix, status: 'APPROVED' }]);
        if (data.workflowId === undefined || data.workflowId === null || data.workflowId === '') {
          POST(`timesheet-management-service/workflow`, JSON.stringify(workFlowData)).
            then(response => {
              data.workFlow = {
                id: response?.data,
                workFlowName: {
                  name: data?.performingActivity?.activity,
                }
              }
              setMetadata(data);
              setIsWorkFlowUpdated(true);

            }).catch(error => {
              ErrorToaster('Unexpected Error');
            })
        } else {
          PUT(`timesheet-management-service/workflow/${data.workflowId}`, workFlowData)
            .then(response => {
              data.workFlow = {
                id: data?.workflowId,
                workFlowName: {
                  name: data?.workflowName,
                }
              }
              setMetadata(data);
              setIsWorkFlowUpdated(true);
            })
            .catch(error => {
              ErrorToaster('Unexpected Error');
            })
        }
      } else {
        handleSave(buttonType);
      }
    } else {
      handleSave(buttonType);
    }
    setContinueLoading(false);
  }

  const handleSave = async (buttonType) => {
    if (serviceType === '') {
      ErrorToaster('Activity Type Selection is Mandatory');
      return;
    }
    // if ((serviceTypeTemplate === ADDON && metadata?.[0]?.locationSpecified && metadata?.[0]?.locations?.length === 0)) {
    //   ErrorToaster('Atleast one location has to be selected if yes');
    //   return;
    // }
    if ((serviceTypeTemplate !== ADDON && showLocation && selectedLocation?.length === 0)) {
      ErrorToaster('Atleast one location has to be selected if yes');
      return;
    }
    if ((serviceTypeTemplate === CLINIC || serviceTypeTemplate === PROCEDUREREADING) && (metadata?.contractedSchedules?.[0]?.startDate !== contractTermPeriod?.start || metadata?.contractedSchedules?.[metadata?.contractedSchedules?.length - 1]?.endDate !== contractTermPeriod?.end)) {
      ErrorToaster('Target Applicable Period Should cover contract effective date and contract end date range');
      return;
    }
    if (selectContractInfo !== "INDIVIDUAL" && isDesignatedSpecificContractor && selectedUsers?.length === 0) {
      ErrorToaster('Atleast one User has to be selected if Specific Contractor is Yes');
      return;
    }
    if (metadata?.[0]?.additionalScheduleRequired && (parseInt(metadata?.[0]?.additionalScheduleValue) === 0 || metadata?.[0]?.additionalScheduleFrequency === null)) {
      ErrorToaster('Additional Schedule value and frequency required');
      return;
    }
    if (serviceTypeTemplate !== ADDON && metadata?.[0]?.billableService && parseInt(metadata?.[0]?.sessionAmount) === 0) {
      ErrorToaster('Payment Amount field is mandatory if the service is Billable');
      return;
    }
    var performingActivity = '';
    var parentActivity = '';
    let activities = [];
    let dependentActivities = [];
    if (serviceTypeTemplate !== SUPPLEMENTAL && serviceTypeTemplate !== ADDON && serviceTypeTemplate !== ADMINISTRATIVE) {
      performingActivity = selectedActivity?.map(data => data?.activity?.activity)?.join('-')
      selectedActivity?.map(data => {
        activities?.push({ "activity": data?.activity?.activity })
      })
    }
    if (serviceTypeTemplate === ADMINISTRATIVE) {
      performingActivity = metadata?.selectedActivities?.map(data => data?.activity)?.join('-')
      metadata?.selectedActivities?.map(data => {
        activities?.push({ "activity": data?.activity })
      })
    }
    if (serviceTypeTemplate === ONCALL) {
      let temp = metadata?.additionalActivity;
      activities = [];
      metadata?.serviceDaysArray?.map(serviceDays => {
        if (serviceDays === 'Weekdays' && metadata?.customizedSchedule) {
          if (metadata?.weekdayMin || metadata?.weekdayMax || metadata?.weekdayPayment !== 0) {
            activities?.push({ "activity": 'Weekday Days' })
          }
          if (metadata?.weekdayNightsMin || metadata?.weekdayNightsMax || metadata?.weekdayNightsPayment !== 0) {
            activities?.push({ "activity": 'Weekday Nights' })
          }
        } else {
          activities?.push({ "activity": serviceDays })
        }
      })
      performingActivity = activities?.map(activity => activity?.activity)?.join('-')
      temp?.map(activity => {
        dependentActivities.push({
          "activity": {
            "activity": activity?.activity
          },
          "weekday": {
            "from": activity?.weekdayFrom?.toLocaleTimeString('it-IT').toString(),
            "to": activity?.weekdayTo?.toLocaleTimeString('it-IT').toString(),
          },
          "weekend": {
            "from": activity?.weekendFrom?.toLocaleTimeString('it-IT').toString(),
            "to": activity?.weekendTo?.toLocaleTimeString('it-IT').toString()
          },
          "holiday": {
            "from": activity?.holidayFrom?.toLocaleTimeString('it-IT').toString(),
            "to": activity?.holidayTo?.toLocaleTimeString('it-IT').toString(),
          },
          "patientMRNRequired": activity?.patientMRNRequired,
          "attendingDocRequired": activity?.attendingDocRequired,
        }
        )
      })
    }


    if (serviceTypeTemplate === SUPPLEMENTAL) {
      performingActivity = metadata?.supplementServiceName?.map(data => data)?.join('-') || '';
      metadata?.supplementServiceName?.map(data => (
        activities.push({ "activity": data })
      ));
    }
    let data = [];
    if (serviceTypeTemplate === ADDON && !editService) {
      data = metadata;
      data.map((item, index) => {
        item.workingPeriod = metadata?.[index]?.workingPeriod;
        item.serviceLocations = metadata?.[index]?.serviceLocations ? metadata?.[index]?.serviceLocations : metadata?.[index]?.locations;
        item.duration = {
          "hours": parseInt(item?.sessionDuration)
        };
        console.log('performing Activity', metadata?.[index]?.parentActivity);
        item.addOnActivityType = {
          "activityType": metadata?.[index]?.parentActivity
        }
        item.performingActivity = {
          "activity": metadata?.[index]?.activities?.map(data => data?.activity)?.join('-')
        }
      })
      // data.workingPeriod = {
      //   "from": metadata?.workingTimeFrom?.toLocaleTimeString('it-IT').toString(),
      //   "to": metadata?.workingTimeTo?.toLocaleTimeString('it-IT').toString()
      // };
      // data.serviceLocations = data?.locationSpecified ? data?.locations : locationItems;
    }
    else {
      let dataValues = metadata;
      if (serviceTypeTemplate === ADDON) {
        dataValues = metadata?.[0];
        parentActivity = dataValues?.addOnActivityType;
        performingActivity = dataValues?.activities?.map(data => data?.activity)?.join('-');
      }
      if (activities?.length === 0 && serviceTypeTemplate !== ADDON) {
        let message = serviceTypeTemplate === SUPPLEMENTAL ? 'Supplement Services' : serviceTypeTemplate === ADMINISTRATIVE ? 'Allowable Administrative Duties' : 'Activity To Be Performed';
        ErrorToaster(`Atleast One ${message} needs to be added to create a service`);
        return;
      }

      console.log('Activities On call', activities)

      data = [{
        "refId": dataValues?.refId?.toString() ? dataValues?.refId?.toString() : (new Date()).getTime()?.toString(),
        "sites": siteData,
        "activityType": {
          "activityType": serviceType
        },
        "activityTypeTemplate": {
          "activityTypeTemplate": serviceTypeTemplate,
        },
        ...((serviceTypeTemplate === ADDON && dataValues?.activityResponse?.dataMap?.selectedActivityId !== null) && {
          "addOnActivityType": {
            "activityType": parentActivity,
          }
        }),
        "users": selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers,
        "performingActivity": {
          "activity": performingActivity
        },
        "activities": activities,
        ...(((serviceTypeTemplate === SUPPLEMENTAL && !dataValues?.dedicatedHoursSpecified) || (serviceTypeTemplate === ADMINISTRATIVE && !dataValues?.dedicatedHoursSpecified)) &&
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
        "baseServices": serviceTypeTemplate === SUPPLEMENTAL ? dataValues?.baseServices : [],
        "serviceLocations": serviceTypeTemplate === ADDON ? dataValues?.locationSpecified ? dataValues?.locations : locationItems : showLocation ? selectedLocation : locationItems,
        ...(((serviceTypeTemplate === CLINIC || serviceTypeTemplate === PROCEDUREREADING) && {
          "contractedSchedules": metadata?.contractedSchedules,
          "patientsSeenTargets": metadata?.patientsSeenTargets,
          "scheduledPatientsTargets": metadata?.scheduledPatientsTargets
        })),
        ...(((serviceTypeTemplate !== CLINIC && serviceTypeTemplate !== PROCEDUREREADING) && {
          "contractedSchedules": [{
            "minimum": {
              "value": parseFloat(dataValues?.min || '0')
            },
            "maximum": {
              "value": parseFloat(dataValues?.max || '0')
            },
            "frequency": dataValues?.frequency,
            "startDate": contractTermPeriod?.start,
            "endDate": contractTermPeriod?.end,
          }],
          "patientsSeenTargets": [{
            "withNurse": {
              "value": parseInt(dataValues?.withNurse || '0')
            },
            "withoutNurse": {
              "value": parseInt(dataValues?.withoutNurse || "0")
            },
            "noTargetApplicable": dataValues?.noTargetApplicable,
            "startDate": contractTermPeriod?.start,
            "endDate": contractTermPeriod?.end,
          }],
          "scheduledPatientsTargets": [{
            "withNurse": {
              "value": parseInt(dataValues?.targetWithNurse || '0')
            },
            "withoutNurse": {
              "value": parseInt(dataValues?.targetWithoutNurse || '0')
            },
            "noTargetApplicable": dataValues?.targetNoTargetApplicable,
            "startDate": contractTermPeriod?.start,
            "endDate": contractTermPeriod?.end,
          }]
        })),
        ...(serviceTypeTemplate !== SUPPLEMENTAL && {
          "additionalSchedule": {
            "value": parseFloat(dataValues?.additionalScheduleValue),
            "frequency": dataValues?.additionalScheduleFrequency,
            "scheduleRequired": dataValues?.additionalScheduleRequired
          }
        }),
        "rateType": dataValues?.rateType,
        "activityResponse": {
          "dataMap": {
            ...(serviceTypeTemplate === ONCALL && {
              'onCallCoverageFor': dataValues?.onCallCoverageFor,
            }
            ),
            ...(serviceTypeTemplate === ADMINISTRATIVE && {
              'adminActivities': dataValues?.selectedActivities,
            }),
            ...(serviceTypeTemplate === ADDON && {
              'selectedActivityId': dataValues?.activityResponse?.dataMap?.selectedActivityId,
              'additionalDetails': dataValues?.activityResponse?.dataMap?.additionalDetails || [],
            })
          }
        },
        "duration": {
          "hours": parseFloat(dataValues?.sessionDuration)
        },
        "payableAmount": {
          "value": parseFloat(dataValues?.sessionAmount)
        },
        ...((serviceTypeTemplate === SUPPLEMENTAL || serviceTypeTemplate === ADMINISTRATIVE) && dataValues?.dedicatedHoursSpecified && {
          "hourlyRate": {
            "value": serviceTypeTemplate === SUPPLEMENTAL && dataValues?.totalSession === 0 ? Number(dataValues?.sessionAmount)?.toFixed(2) : Number(dataValues?.sessionAmount / dataValues?.totalSession)?.toFixed(2)
          },
        }),
        ...((serviceTypeTemplate === SUPPLEMENTAL || serviceTypeTemplate === ADMINISTRATIVE) && !dataValues?.dedicatedHoursSpecified && {
          "hourlyRate": {
            "value": dataValues?.hourlyRate,
          },
        }),
        ...(serviceTypeTemplate === ADDON && {
          "hourlyRate": dataValues?.hourlyRate,
        }),
        ...([CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(serviceTypeTemplate) && {
          "hourlyRate": {
            "value": isNaN((dataValues?.sessionAmount / dataValues?.sessionDuration)?.toFixed(2)) ? 0 : (dataValues?.sessionAmount / dataValues?.sessionDuration)?.toFixed(2)
          },
        }),
        "totalSessions": {
          "value": parseFloat(dataValues?.totalSession),
          "frequency": dataValues?.totalSessionFrequency
        },
        "sessionsAsNeeded": dataValues?.sessionsAsNeeded || false,
        "serviceDays": dataValues?.serviceDays,
        ...(serviceTypeTemplate === ONCALL && {
          "dependentService": {
            "payableAmount": {
              "value": parseInt(dataValues?.dependencyPayableAmount)
            },
            "frequency": dataValues?.dependencyFrequency,
            "additionalServices": dependentActivities,
            "workFlow": dataValues?.workFlow,
            "billableService": dataValues?.additionalActivityBillable,
            "paymentApprovalRequired": dataValues?.additionalActivityPaymentApprovalRequired,
          },
          ...(!dataValues?.customizeSchedule && {
            "customschedule": {
              "weekdayDay": {
                "from": dataValues?.weekdayFrom?.toLocaleTimeString('it-IT').toString(),
                "to": dataValues?.weekdayTo?.toLocaleTimeString('it-IT').toString(),
                "target": {
                  "minimum": {
                    "value": parseInt(dataValues?.weekdayMin)
                  },
                  "maximum": {
                    "value": parseInt(dataValues?.weekdayMax)
                  },
                  "frequency": dataValues?.weekdayFrequency,
                },
                "duration": {
                  "hours": parseInt(dataValues?.weekdayDuration)
                },
                "payableAmount": {
                  "value": parseFloat(dataValues?.weekdayPayment)
                },
                "hourlyRate": {
                  "value": (dataValues?.weekdayPayment / dataValues?.weekdayDuration)?.toFixed(2)
                },
                "paymentNotApplicable": dataValues?.weekdayPaymentNa
              },
              "weekdayNight": {
                "from": dataValues?.weekdayNightsFrom?.toLocaleTimeString('it-IT').toString(),
                "to": dataValues?.weekdayNightsTo?.toLocaleTimeString('it-IT').toString(),
                "target": {
                  "minimum": {
                    "value": parseInt(dataValues?.weekdayNightsMin)
                  },
                  "maximum": {
                    "value": parseInt(dataValues?.weekdayNightsMax)
                  },
                  "frequency": dataValues?.weekdayNightsFrequency,
                },
                "duration": {
                  "hours": parseInt(dataValues?.weekdayNightsDuration)
                },
                "payableAmount": {
                  "value": parseFloat(dataValues?.weekdayNightsPayment)
                },
                "hourlyRate": {
                  "value": (dataValues?.weekdayNightsPayment / dataValues?.weekdayNightsDuration)?.toFixed(2)
                },
                "paymentNotApplicable": dataValues?.weekdayNightsPaymentNa
              },
              "weekend": {
                "from": dataValues?.weekendFrom?.toLocaleTimeString('it-IT').toString(),
                "to": dataValues?.weekendTo?.toLocaleTimeString('it-IT').toString(),
                ... (dataValues?.weekendStartday !== "" && { "startDay": dataValues?.weekendStartday }),
                ...(dataValues?.weekendEndday !== "" && { "endDay": dataValues?.weekendEndday }),
                "target": {
                  "minimum": {
                    "value": parseInt(dataValues?.weekendMin)
                  },
                  "maximum": {
                    "value": parseInt(dataValues?.weekendMax)
                  },
                  "frequency": dataValues?.weekendFrequency,
                },
                "duration": {
                  "hours": parseInt(dataValues?.weekendDuration)
                },
                "payableAmount": {
                  "value": parseFloat(dataValues?.weekendPayment)
                },
                "hourlyRate": {
                  "value": (dataValues?.weekendPayment / dataValues?.weekendDuration)?.toFixed(2)
                },
                "paymentNotApplicable": dataValues?.weekendPaymentNa
              },
              "holiday": {
                "from": dataValues?.holidayFrom?.toLocaleTimeString('it-IT').toString(),
                "to": dataValues?.holidayTo?.toLocaleTimeString('it-IT').toString(),
                "holidayTerm": dataValues?.holidayTerm,
                "target": {
                  "minimum": {
                    "value": parseInt(dataValues?.holidayMin)
                  },
                  "maximum": {
                    "value": parseInt(dataValues?.holidayMax)
                  },
                  "frequency": dataValues?.holidayFrequency,
                },
                "duration": {
                  "hours": parseInt(dataValues?.holidayDuration)
                },
                "payableAmount": {
                  "value": parseFloat(dataValues?.holidayPayment)
                },
                "hourlyRate": {
                  "value": (dataValues?.holidayPayment / dataValues?.holidayDuration)?.toFixed(2)
                },
                "paymentNotApplicable": dataValues?.holidayPaymentNa
              }
            }
          })
        }),
        "workingPeriod": {
          "from": dataValues?.workingTimeFrom?.toLocaleTimeString('it-IT').toString(),
          "to": dataValues?.workingTimeTo?.toLocaleTimeString('it-IT').toString()
        },
        ...((serviceTypeTemplate === ADDON || serviceTypeTemplate === ADMINISTRATIVE) && {
          workFlow: dataValues?.workFlow,
        }),
        "patientMRNRequired": dataValues?.patientMRNRequired || false,
        "attendingDocRequired": dataValues?.attendingDocRequired || false,
        "activityApprovalWFRequired": dataValues?.activityApprovalWFRequired || false,
        "designateSpecificContractor": isDesignatedSpecificContractor,
        "locationSpecified": serviceTypeTemplate === ADDON ? dataValues?.locationSpecified : showLocation,
        "dedicatedHoursSpecified": [SUPPLEMENTAL, ADMINISTRATIVE].includes(serviceTypeTemplate) ? dataValues?.dedicatedHoursSpecified : false,
        "billableService": dataValues?.billableService,
        "dependantServiceIncluded": dataValues?.dependantServiceIncluded || false,
        "customizedSchedule": dataValues?.customizedSchedule || false,
        ...((serviceTypeTemplate !== ADDON && !(serviceTypeTemplate === ADMINISTRATIVE && !metadata?.dedicatedHoursSpecified) && !(serviceTypeTemplate === SUPPLEMENTAL && !metadata?.dedicatedHoursSpecified)) && {
          "compensationReductionApplicable": reducedOffsetApplicable
        }),
      }]
    }
    if (editService && serviceTypeTemplate === ADDON) {
      data[0].activities = metadata?.[0]?.activities;
      data[0].workingHours = metadata?.[0]?.workingHours;
    }
    let services = existingServices || [];
    if (editService) {
      let temp = services?.filter((data, index) => index !== selectedIndex)?.map(data => data);
      temp.push(...data);
      services = temp;
    } else {
      if (existingServices?.length === services?.length) {
        data?.map(data => {
          if (!services?.map(service => service?.refId)?.includes(data?.refId)) {
            services.push(data);
          }
        })

      }
    }

    const dataChange = () => {
      let conflictedData = checkActivityChange(existingServices, selectedService);
      console.log('conflicted Data', conflictedData);
      conflictedData?.map(conflictData => {
        let conflictedIndex = services?.indexOf(services?.filter(data => data?.refId === conflictData?.id)?.map(data => data)[0]);
        let currentServiceIndex = services?.indexOf(services?.filter(data => data?.refId === selectedService?.refId)?.map(data => data)[0]);
        let conflictedAddOn = cloneDeep(services[conflictedIndex])
        if (conflictData?.type === ADDON) {
          console.log('conflictData is add on data', conflictedIndex, currentServiceIndex);
          services[conflictedIndex] = cloneDeep(services[currentServiceIndex]);
          services[conflictedIndex].activityResponse = conflictedAddOn?.activityResponse;
          services[conflictedIndex].activityTypeTemplate = conflictedAddOn?.activityTypeTemplate;
          services[conflictedIndex].activityType = conflictedAddOn?.activityType;
          services[conflictedIndex].refId = conflictedAddOn.refId;
          services[conflictedIndex].workFlow = conflictedAddOn.workFlow;
          services[conflictedIndex].contractedSchedules = [];
          services[conflictedIndex].patientsSeenTargets = [];
          services[conflictedIndex].scheduledPatientsTargets = [];
          services[conflictedIndex].performingActivity.activity = `${selectedActivity?.map(data => data?.activity?.activity)?.join(', ')}`
        }
        if (conflictData?.type === SUPPLEMENTAL || conflictData?.type === ADMINISTRATIVE) {
          services[conflictedIndex].hoursBorrowed = {
            activityType: {
              activityType: services[currentServiceIndex].activityType?.activityType,

            },
            performingActivity: {
              activity: services[currentServiceIndex]?.activities?.map(activity => activity?.activity)?.join(', '),
            }
          };
          services[conflictedIndex].billableService = services[currentServiceIndex]?.billableService;
          services[conflictedIndex].rateType = services[currentServiceIndex]?.rateType;
          services[conflictedIndex].payableAmount = services[currentServiceIndex]?.payableAmount;
          services[conflictedIndex].duration = services[currentServiceIndex]?.duration;
          services[conflictedIndex].totalSessions = services[currentServiceIndex]?.totalSessions;
          services[conflictedIndex].hourlyRate = services[currentServiceIndex]?.hourlyRate;
        }
      })
      updateTimesheet(services)
      return services;
    }

    const updateTimesheet = async (serviceData) => {
      const { data: timesheetSubmissionTerms } = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
      let temp = [];
      if (timesheetSubmissionTerms?.timesheetActivitiesPeriods?.length === 1) {
        serviceData?.map(data => {
          temp.push({ activityType: { activityType: data?.activityType?.activityType }, performingActivity: { activity: data?.activities?.map(data => data?.activity)?.join('-') } })
        })
        timesheetSubmissionTerms.timesheetActivitiesPeriods[0].activities = temp;
      } else {
        timesheetSubmissionTerms.timesheetActivitiesPeriods?.map(data => {
          data.activities = [];
        })
      }
      if (!editService || activityUpdated) {
        const response = await PUT(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`, JSON.stringify(timesheetSubmissionTerms));
        if (response) {
          console.log('Successfully Updated Timesheet Activities')
        }
        else {
          console.log('Unexpected Error');
        }
      }
    }

    console.log('datachanged', dataChange());

    let formattedData = {
      contractedServices: dataChange()
    }

    const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
    if (response) {
      SuccessToaster('Contracted Service Updated Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }
    getContractedServices();
    if (buttonType === 'SAVE AND EXIT') {
      getAddServiceDialog(false);
      getEditServiceDialog(false);
    }
    else {
      reset();
      getIsReset(true);
    }
    getTabDataStatus();
  }

  const getIsReset = (value) => {
    setIsReset(value);
  }

  const reset = () => {
    setMetadata([]);
    setSelectedLocation([]);
    setSelectedActivity([]);
    setSiteData([]);
  }

  const handleUsers = (value) => {
    if (value !== '') {
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

  const getActivityItems = () => {
    let temp = [];
    activity?.filter(data => !usedActivity?.includes(data?.activity?.activity))?.map((data) => (
      temp.push({
        id: data.id,
        value: data?.activity?.activity,
        ...data,
      })))
    setActivityItems(temp);
  }


  console.log('activit Items', activityItems, activity, usedActivity);

  const locationItems = useMemo(
    () =>
      locationList?.map((data) => data?.location && ({
        ...data,
        value: data?.location,
        location: data?.location
      })),
    [locationList],
  )

  const updateConflict = (value) => {
    setConflict({ ...conflict, isPresent: value });
  }


  const onActivitySelect = (selectedItem) => {
    console.log('selectedItem', selectedItem);
    setItem(selectedItem);
    if (!selectedActivity?.map(data => data?.id)?.includes(selectedItem?.id)) {
      delete selectedItem["value"];
      let temp = selectedActivity;
      temp.push(selectedItem);
      let usedActivityTemp = usedActivity;
      usedActivityTemp.push(selectedItem?.activity?.activity);
      setUsedActivity(usedActivityTemp);
      setSelectedActivity(temp);
    }
    setValue('');
    if (editService) {
      let conflictedData = checkActivityChange(existingServices, selectedService);
      setConflict({ isPresent: conflictedData?.length !== 0, conflict: conflictedData });
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
    setLocation('');
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
    if (!value) {
      setSelectedLocation([]);
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleClickDoc = (event) => {
    setAnchorElDoc(event.currentTarget);
  };

  const handleClosePopoverDoc = () => {
    setAnchorElDoc(null);
  };

  return (
    <>
      <div>
        <Dialog isOpen={getAddServiceDialog} onClose={() => { getAddServiceDialog(false); getEditServiceDialog(false); }} className={`${style.manageServiceDialog} ${style.addManagerDialogBackground} ${rightHelpArea && style.moveDialogPosition}`}
          canOutsideClickClose={false}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
              <p className={style.extensionStyle}>Add Services To Be Provided As Per Contract</p>
              <div className={style.displayInRow}>
                <div className={`${style.cursorPointer} ${style.marginRight20} `}>
                  <div onClick={(e) => { handleClick(e); setIsShowNotesList(!isShowNotesList) }} aria-describedby={id} >
                    {helpTool?.textArea ? (
                      <img src={NotesOpen} alt="" className={style.addServiceNotesImgStyle} />
                    ) : (
                      <img src={NotesNotOpen} alt="" className={style.addServiceNotesImgStyle} />
                    )}
                    <div className={`${style.addServiceCountStyle} ${style.alignCenter} ${style.marginNotes} `}>4</div>
                  </div>
                  {isShowNotesList && (
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClosePopover}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <div className={style.actionsCard}>
                        <div className={`${style.specificActionCard} ${style.cursorPointer} `} onClick={() => setHelpTool({ ...helpTool, textArea: !helpTool?.textArea })}>Notes 1</div>
                        <div className={`${style.specificActionCard} ${style.cursorPointer} `} onClick={() => setHelpTool({ ...helpTool, textArea: !helpTool?.textArea })}>Notes 2</div>
                        <div className={`${style.specificActionCard} ${style.cursorPointer} `} onClick={() => setHelpTool({ ...helpTool, textArea: !helpTool?.textArea })}>Notes 3</div>
                      </div>
                    </Popover>
                  )}
                </div>
                <div className={`${style.cursorPointer} ${style.marginRight20} `}>
                  <div onClick={(e) => { handleClickDoc(e); setIsShowDocumentsList(!isShowDocumentsList) }} aria-describedby={idDoc}>
                    {isShowPDF ? (
                      <img src={DocumentOpen} alt="" className={style.addServiceImgStyle} />
                    ) : (
                      <img src={DocumentNotOpen} alt="" className={style.addServiceImgStyle} />
                    )}
                    <div className={`${style.addServiceCountStyle} ${style.alignCenter} ${style.marginDocument} `}>{contractDocumentList?.length}</div>
                  </div>
                  {isShowDocumentsList && (
                    <Popover
                      id={idDoc}
                      open={openDoc}
                      anchorEl={anchorElDoc}
                      onClose={handleClosePopoverDoc}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <div className={style.actionsCard}>
                        {contractDocumentList?.map(doc => (
                          <div className={`${style.specificActionCard} ${style.cursorPointer} `} onClick={() => { setIsShowPDF(!isShowPDF); setPdfToOpen(doc?.url) }}>{doc?.name}</div>
                        ))
                        }
                      </div>
                    </Popover>
                  )}
                </div>
                <div className={`${style.cursorPointer} ${style.marginRight20} `} onClick={() => setHelpTool({ ...helpTool, calculator: !helpTool?.calculator })}>
                  {/* <CalculateIcon style={{ fontSize: 30, color: '#bfbfbf' }} /> */}
                  <div>
                    {helpTool?.calculator ? (
                      <img src={CalculatorOpen} alt="" className={style.addServiceImgStyle} />
                    ) : (
                      <img src={CalculatorNotOpen} alt="" className={style.addServiceImgStyle} />
                    )}
                  </div>
                </div>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => handleClose()} />
              </div>
            </div>
            <div className={style.extensionBorder}></div>
            {!isShowPDF ? (
              <div>
                <div className={style.proofBorder}>
                  <div className={`${style.addManagerGrid} `}>
                    <CommonLabel value='Primary Sites / Department Affiliation' />
                    <SiteDepartmentField sites={siteList} getSelectedSites={getSelectedSites} selectedSites={siteData} isMultiSiteEntity={isMultiSiteEntity} />
                  </div>
                  <div className={`${style.addManagerGrid} ${style.marginTop20} `}>
                    <CommonLabel value='Activity / Service Type Contracted for*' />
                    <div>
                      <CommonSelectField value={serviceType}
                        onChange={(e) => {
                          setServiceType(e.target.value);
                          setServiceTypeTemplate(serviceTypeList?.filter(type => type?.serviceType === e.target.value)?.map(data => data?.serviceTypeTemplate)?.[0]);
                          setSelectedActivity([]);
                          setServiceTypeId(serviceTypeList?.filter(data => data?.serviceType === e.target.value)?.map(data => data?.id)[0]);
                        }}
                        className={`${style.fullWidth} `}
                        firstOptionLabel={'Select Activity /Service Type'} firstOptionValue={''}
                        valueList={serviceTypeList?.map(data => data?.serviceType)}
                        labelList={serviceTypeList?.map(data => data?.serviceType)}
                        disabledList={serviceTypeList?.map(data => false)} />
                    </div>
                  </div>
                  {selectContractInfo !== "INDIVIDUAL" && (
                    <div className={`${style.addManagerGrid} ${style.marginTop20} `}>
                      <CommonLabel value='Designate Specific Contractor*' />
                      <div>
                        <div className={`${style.displayInRow} `}>
                          <CommonSwitch checked={isDesignatedSpecificContractor} disabled={(selectContractInfo === "INDIVIDUAL") && true} className={`${style.switchFontStyle} ${style.textAlignLeft} ${style.flexLeft}`} onChange={() => handleDesignateContractor()} label={isDesignatedSpecificContractor ? 'YES' : 'NO'} />
                          {isDesignatedSpecificContractor ? (
                            <CommonSelectField onChange={(e) => handleUsers(e.target.value)}
                              className={`${style.fullWidth} `}
                              firstOptionLabel={'Select Contractors for Services to be Provided'} firstOptionValue={''}
                              valueList={users?.map(data => data?.id)}
                              labelList={users?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`)}
                              disabledList={users?.map(data => false)} />
                          ) : <p className={` ${style.marginTop10} `}>Any Contractor</p>
                          }
                        </div>
                        {usersTags?.length !== 0 && (
                          <div className={`${style.marginTop20} ${style.marginLeft20} `}>
                            {usersTags}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {['FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET', 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET']?.includes(compensationPolicy) && (serviceTypeTemplate !== ADDON && !(serviceTypeTemplate === ADMINISTRATIVE && !metadata?.dedicatedHoursSpecified) && !(serviceTypeTemplate === SUPPLEMENTAL && !metadata?.dedicatedHoursSpecified)) && (
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                      <CommonLabel value='Reduced offset applicable' />
                      <CommonSwitch checked={reducedOffsetApplicable} className={`${style.switchFontStyle} ${style.flexLeft} `} onChange={() => setReducedOffsetApplicable(!reducedOffsetApplicable)} label={reducedOffsetApplicable ? 'YES' : 'NO'} />
                    </div>
                  )}
                  {
                    serviceTypeTemplate !== ADMINISTRATIVE && serviceTypeTemplate !== ADDON && serviceTypeTemplate !== SUPPLEMENTAL && serviceTypeTemplate !== ONCALL &&
                    <div>
                      <div className={`${style.addManagerGrid} ${style.marginTop20} `}>
                        <CommonLabel value='Activities To Be Performed*' />
                        <div>
                          <div className={style.addGrid}>
                            <DatalistInput
                              value={value}
                              setValue={setValue}
                              items={activityItems || []} onSelect={onActivitySelect} className={style.fullWidth} onChange={(e) => setNewActivity(e.target.value)} />
                            <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${(newActivity === '' || activity?.some(data => data?.activity?.activity?.replace(' ', '')?.toLowerCase()?.includes(newActivity?.replace(' ', '')?.toLowerCase()))) ? style.disabledUploadButton : ''}`}>
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


                  {serviceTypeTemplate !== ADDON && <div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20} `}>
                      <CommonLabel value='Specify Service Facility / Location (Cost Center)*' />
                      <div>
                        <div className={`${style.displayInRow} `}>
                          <CommonSwitch checked={showLocation} className={`${style.switchFontStyle} ${style.flexLeft} `} onChange={() => setShowLocation(!showLocation)} label={showLocation ? 'YES' : 'NO'} />

                          {/* <ThemeProvider theme={switchTheme}>
                          <FormControlLabel
                            control={
                              <Switch className={`${style.textAlignLeft}`} />
                            }
                            color='primary'
                            checked={showLocation}
                            onChange={() => setShowLocation(!showLocation)}
                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                            label={showLocation ? 'YES' : 'NO'}
                          />
                        </ThemeProvider> */}

                          {/* <div className={`${style.addGrid} ${style.fullWidth} `}> */}
                          {showLocation && <div className={style.fullWidth}>
                            <DatalistInput
                              value={location}
                              setValue={setLocation} items={locationItems || []} onSelect={onLocationSelect} className={style.fullWidth} onChange={(e) => setNewLocation(e.target.value)} />
                          </div>}
                        </div>
                        {
                          showLocation && selectedLocation?.length !== 0 &&
                          <MultiSelectDisplay values={selectedLocation?.map(data => data?.location)} removeItem={removeLocation} />
                        }
                      </div>
                    </div>
                  </div>}

                  {serviceTypeTemplate === CLINIC
                    ? <ClinicBlocksFields getMetaData={getMetaData} serviceSelected={selectedService} timeCommitment={timeCommitment} contractTermPeriod={contractTermPeriod} isReset={isReset} getIsReset={getIsReset} />
                    : serviceTypeTemplate === SURGERY
                      ? <SurgerySessionFields getMetaData={getMetaData} serviceSelected={selectedService} timeCommitment={timeCommitment} isReset={isReset} getIsReset={getIsReset} />
                      : serviceTypeTemplate === ONCALL
                        ? <OnCallCoverageFields getMetaData={getMetaData} serviceSelected={selectedService} timeCommitment={timeCommitment} isReset={isReset} getIsReset={getIsReset} sites={siteList} contractId={contractId} />
                        : serviceTypeTemplate === SUPPLEMENTAL
                          ? <SupplementalFields getMetaData={getMetaData} services={contractedServices} serviceSelected={selectedService} editService={editService} isReset={isReset} getIsReset={getIsReset} />
                          : serviceTypeTemplate === ADDON
                            ? <AddonClinicFields getMetaData={getMetaData} services={contractedServices} locationItems={locationItems} getNewLocation={getNewLocation} locationToAdd={locationToAdd} serviceSelected={selectedService} editService={editService} isReset={isReset} getIsReset={getIsReset} sites={siteList} contractId={contractId} />
                            : serviceTypeTemplate === PROCEDUREREADING
                              ? <ProcedureReading getMetaData={getMetaData} serviceSelected={selectedService} timeCommitment={timeCommitment} contractTermPeriod={contractTermPeriod} isReset={isReset} getIsReset={getIsReset} />
                              : <AdministrativeFields getMetaData={getMetaData} services={contractedServices} serviceSelected={selectedService} editService={editService} isReset={isReset} getIsReset={getIsReset} sites={siteList} contractId={contractId} />}
                </div>
              </div>
            ) : (
              <div className={`${style.pdfViewStyle} ${style.marginTop} `}>
                <iframe src={pdfToOpen} allowfullscreen height="500px" width="100%" title='Document' />
              </div>
            )}
            {helpTool?.calculator ? (
              <div className={style.calculatorDisplayStyle}>
                <Calculator />
              </div>
            ) : helpTool?.textArea ? (
              <div className={style.calculatorDisplayStyle}>
                {
                  //  notes={notesData} contractId={contractId}
                }
                <Notes />
              </div>
            ) : ''}
          </div>
          <div>
            {
              <ServiceConflict conflict={conflict} updateConflict={updateConflict} />
            }
            {isEditable && !isShowPDF &&
              <div className={`${style.floatRight} `}>
                {!editService && <button className={`${style.buttonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => addOnWorkFlow('ADD MORE') : null}>ADD MORE</button>}
                <button className={`${style.buttonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => addOnWorkFlow('SAVE AND EXIT') : null}>SAVE & EXIT</button>
              </div>
            }

          </div>
        </Dialog >

      </div >
    </>
  )
}

export default AddServiceProvided;
