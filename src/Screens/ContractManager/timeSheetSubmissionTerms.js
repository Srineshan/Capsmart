import React, { useState, useEffect, useRef } from 'react';
import { EditableText } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SiteDepartmentField from '../../Components/ReusableSmallComponents/siteDepartmentField';
import Typography from '@mui/material/Typography';
import { POST, GET, PUT, TenantID } from './../dataSaver';
import ReviewerApproverField from './reviewerApproverField';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonLabel from '../../Components/CommonFields/CommonLabel';

import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const TimeSheetSubmissionTerms = ({ getViewPage7, getCurrentPage, contractId, isMultiSiteEntity, getShowAlert, isEditable, getTabDataStatus }) => {
  const [timeSheetCount, setTimeSheetCount] = useState(0);
  const [absence, setAbsence] = useState({ id: '', reviewer: '', approver: '' });
  const [timesheetWorkFlow, setTimeSheetWorkFlow] = useState([]);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [selectBoxIndex, setSelectBoxIndex] = useState(-1);
  const [contractedTimeCommitment, setContractedTimeCommitment] = useState(false);
  const [contractedActivityTags, setContractedActivityTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeSheetLabelOne, setTimeSheetLabelOne] = useState('');
  const [servicePeriod, setServicePeriod] = useState('');
  const [contractedTimeCommitmentHour, setContractedTimeCommitmentHour] = useState('');
  const [contractedTimeCommitmentFrequency, setContractedTimeCommitmentFrequency] = useState('WEEK');
  const [plannedAbsence, setPlannedAbsence] = useState(0);
  const [maxUnplannedAbsence, setMaxUnplannedAbsence] = useState(0);
  const [invoiceProcessingDay, setInvoiceProcessingDay] = useState(0);
  const [invoiceProcessingDayThreshold, setInvoiceProcessingDayThreshold] = useState(0);
  const [invoiceProcessingDayGoal, setInvoiceProcessingDayGoal] = useState(0);
  const [dayLimitForSubmissionBasedOnActivityServiceDate, setDayLimitForSubmissionBasedOnActivityServiceDate] = useState(0);
  const [dayLimitForSubmissionBasedOnContractEndDate, setDayLimitForSubmissionBasedOnContractEndDate] = useState(0);
  const [timesheetSubmissionTerms, setTimesheetSubmissionTerms] = useState({});
  const [timesheetFields, setTimesheetFields] = useState([]);
  const [contractedServices, setContractedServices] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [selectedItems, setSelectedItems] = useState();
  const limit = 3;
  const [timeSheetLabelData, setTimeSheetLabelData] = useState([]);
  const [timesheetValues, setTimesheetValues] = useState([]);
  const [timesheetActivity, setTimesheetActivity] = useState([{
    activityType: '', performingActivity: ''
  }]);
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const [paymentSource, setPaymentSource] = useState(new Array(timeSheetCount || 0));
  const [contractName, setContractName] = useState('');
  const [continueLoading, setContinueLoading] = useState(false);

  const menuRef = useRef(null);
  useOptionsHide(menuRef);

  const getContractedServices = async () => {
    const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
    setContractedServices(contractedServices?.contractedServices);
    setActivityTypes(Array.from(new Set(contractedServices?.contractedServices?.map(data => data?.activityType?.activityType))));
  }

  const getContractSites = async () => {
    const { data: contractData } = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
    setSites(contractData?.contractDetail?.site?.sites);
    setContractName(contractData?.contractName?.contractName);
  }

  useEffect(() => {
    getContractedServices();
    getTimeSheetSubmissionTerms();
    getTimesheetFields();
    getContractSites();
    getUserData();
    getTimeSheetWorkFlow();
    getAbsenceRequestWorkFlow();
    setPaymentSource(new Array(timeSheetCount || 0));
  }, [])

  useEffect(() => {
    getTimesheetFields();
    setContractedActivityTags([]);
    setTimeSheetLabelData([]);
    setPaymentSource(new Array(timeSheetCount || 0));
  }, [timeSheetCount])

  useEffect(() => {
    formatActivities();
    getTimesheetFields();
  }, [contractedActivityTags?.length, timeSheetLabelData, contractedServices, showSelectBox, sites])

  useEffect(() => {
    getAbsenceRequestWorkFlow();
  }, [timesheetWorkFlow])

  // useEffect(() => {
  //   if (selectedIndex !== undefined) {
  //     let temp = paymentSource;
  //     temp[selectedIndex] = selectedSites;
  //     setPaymentSource(temp);
  //     formatActivities();
  //   }
  // }, [selectedSites])

  // useEffect(() => {

  // }, [paymentSource])

  console.log('paymentSource', paymentSource);

  const getTimeSheetWorkFlow = async () => {
    const { data: timesheetWorkFlow } = await GET('timesheet-management-service/workflow');
    if (timesheetWorkFlow) {
      setTimeSheetWorkFlow(timesheetWorkFlow);
    }
  }

  const getAbsenceRequestWorkFlow = async () => {
    const { data: absenceWorkFlow } = await GET(`contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`);
    if (absenceWorkFlow) {
      let workflowData = timesheetWorkFlow?.filter(data => data?.id === absenceWorkFlow?.workFlow?.id)?.map(data => data?.workFlowMap?.workflow)[0] || {};
      let workFlowValues = Object.values(workflowData);
      let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
      let approver = workFlowValues?.[1]?.workFlowUser?.id;
      setAbsence({ ...absence, id: absenceWorkFlow?.workFlow?.id, reviewer: reviewer, approver: approver });
    }
  }

  const getUserData = async () => {
    const { data: userList } = await GET(`contract-managment-service/contracts/workFlowUser`)
    if (userList) {
      setUsers(userList);
    }
  }

  function useOptionsHide(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSelectBox(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }


  const handleContractedActivityTagsAdd = (type, values, i) => {
    if (values === 'all' && type === 'all') {
      let temp = [];
      contractedServices?.map(data => {
        temp?.push({ index: i, type: data?.activityType?.activityType, activity: data?.performingActivity?.activity });
      });
      setContractedActivityTags(temp);
    } else if (values === 'all') {
      let temp = contractedActivityTags?.filter(data => data?.type !== type)?.map(data => data);
      contractedServices?.filter(data => data?.activityType?.activityType === type)?.map(data => {
        temp?.push({ index: i, type: type, activity: data?.performingActivity?.activity });
      });
      setContractedActivityTags(temp);
    } else {
      let temp = contractedActivityTags;
      setSelectedItems(values);
      temp.push({ index: i, type: type, activity: values });
      setContractedActivityTags(temp);
    }
  };

  console.log('check check check', contractedActivityTags);

  const handleClick = (index) => {
    setSelectBoxIndex(index);
    setShowSelectBox(!showSelectBox);
  };

  const formatActivities = () => {
    let timeSheetValueData = [];
    for (let i = 0; i < timeSheetCount; i++) {
      timeSheetValueData[i] = {
        "timesheetLabel": {
          "label": ""
        },
        "activities": [
          {
            "activityType": {
              "activityType": ""
            },
            "performingActivity": {
              "activity": ""
            }
          }
        ],
        "paymentSource": {
          "site": {}
        },
        "servicePeriod": {
          "value": ""
        }
      }
    }
    timeSheetValueData?.map((data, index) => {
      let temp = [];
      contractedActivityTags?.filter(innerData => innerData?.index === index)?.map((activityData) => {
        temp.push({
          activityType: {
            activityType: activityData?.type
          }, performingActivity: {
            activity: activityData?.activity
          }
        })
      })
      let tempFor1TimeSheet = [];
      contractedServices?.map((data) => {
        tempFor1TimeSheet.push({
          activityType: {
            activityType: data?.activityType?.activityType
          }, performingActivity: {
            activity: data?.performingActivity?.activity
          }
        })
      })
      let value = Array.isArray(paymentSource?.[index]) ? paymentSource?.[index]?.[0] : paymentSource?.[index];
      let site = value !== null ? { "site": value } : undefined;
      if (timeSheetCount > 1) {
        data.activities = temp;
        data.paymentSource = site;
        data.timesheetLabel = timeSheetLabelData?.[index]?.label;
        data.servicePeriod = timeSheetLabelData?.[index]?.value;
      } else {
        data.activities = tempFor1TimeSheet;
        data.paymentSource = site;
        data.timesheetLabel = timeSheetLabelData?.[index]?.label;
        data.servicePeriod = timeSheetLabelData?.[index]?.value;
      }
    })
    setTimesheetValues(timeSheetValueData);
  }

  const handleTimesheetValue = (i, name, value) => {
    let temp = timeSheetLabelData;
    if (name === 'label') {
      temp[i] = { label: value, value: temp[i]?.value }
    } else {
      temp[i] = { label: temp[i]?.label, value: value }
    }
    setTimeSheetLabelData(temp);
    formatActivities();
    getTimesheetFields();
  }

  const handleContractedActivityTagsRemove = (index) => {
    setContractedActivityTags(contractedActivityTags?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
  }

  const isGroupChecked = (type) => {
    let originalArrayLength = contractedServices?.filter(service => service?.activityType?.activityType === type)?.map(data => data)?.length;
    let selectedArrayLength = contractedActivityTags?.filter(data => data?.type === type)?.map(data => data)?.length;
    if (originalArrayLength === selectedArrayLength) {
      return true;
    } else {
      return false;
    }
  }

  const onSelectSite = (value, index) => {
    let temp = paymentSource;
    temp[index] = value;
    setPaymentSource(temp);
    formatActivities();
    getTimesheetFields();
  }

  const getTimesheetFields = () => {
    let temp = [];
    for (let i = 0; i < timeSheetCount; i++) {
      console.log('data check', timeSheetLabelData?.[i]?.value);
      temp[i] = (
        <div key={`${i}temp${timeSheetCount + 1}`} className={`${timeSheetCount > 1 && style.contractedBorderStyle} ${style.marginTop20}`}>
          <div className={`${style.extentionGrid}`}>
            <CommonLabel value={`Timesheets label ${i + 1} for processing`} />
            <CommonInputField className={style.fullWidth} value={timeSheetLabelData?.[i]?.label}
              onChange={(e) => handleTimesheetValue(i, 'label', e.target.value)}
            />
          </div>
          {timeSheetCount > 1 && (
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <CommonLabel value={`Contracted Activity to include for timesheet ${i + 1}*`} />
              <div>
                {
                  // <select
                  //     name="class"
                  //     id="Class"
                  //     onChange={(e) => {handleContractedActivityTagsAdd(e.target.value, i)}}
                  //     className={`${style.fullWidth} `}>
                  //     <option value="0" >
                  //         Select Contracted Services Provided
                  //     </option>
                  //     {contractedServices?.map((data, index) => (
                  //         <option value={data?.performingActivity?.activity} key={index}
                  //         disabled={contractedActivityTags?.map(data => data?.activity)?.includes(data?.performingActivity?.activity)} >
                  //             {`${data?.activityType?.activityType} - ${data?.performingActivity?.activity}`}
                  //         </option>
                  //     ))}
                  // </select>
                }
                <div className={`${style.selectBoxStyle} ${style.fullWidth} ${style.verticalAlignCenter} ${style.spaceBetween}`}
                  onClick={() => handleClick(i)}>
                  <div></div>
                  <img src={ArrowDown} className={`${style.marginRight} ${style.arrowDownStyle}`} />
                </div>
                {(showSelectBox && i === selectBoxIndex) && (
                  <div className={style.selectOptionsBox} ref={menuRef}>
                    <div className={`${style.selectOptionsMenuStyle}`}>
                      <CommonCheckBox disabled={contractedServices?.length === contractedActivityTags?.length} checked={contractedServices?.length === contractedActivityTags?.length} onChange={() => handleContractedActivityTagsAdd('all', 'all', i)} label="All Activities" />
                    </div>
                    {activityTypes?.map(data => (
                      <>
                        <div className={`${style.selectOptionsMenuStyle} ${style.selectedOptionstyle}`}>
                          <CommonCheckBox onChange={() => handleContractedActivityTagsAdd(data, 'all', i)} disabled={isGroupChecked(data)} checked={isGroupChecked(data)} label={data} />
                        </div>
                        {
                          contractedServices?.filter(service => service?.activityType?.activityType === data)?.map(service => (
                            <div className={`${style.selectOptionsMenuStyle} ${style.marginLeft30}`}>
                              <FormGroup>
                                <FormControlLabel control={<Checkbox onChange={() => handleContractedActivityTagsAdd(data, service?.performingActivity?.activity, i)} disabled={contractedActivityTags?.map(data => data?.activity)?.includes(service?.performingActivity?.activity)} checked={contractedActivityTags?.map(data => data?.activity)?.includes(service?.performingActivity?.activity)} />} label={<Typography variant="body2" className={style.disabledView}>{service?.performingActivity?.activity}</Typography>} />
                              </FormGroup>
                            </div>
                          ))
                        }
                      </>
                    ))
                    }
                  </div>
                )}
                {contractedActivityTags?.filter((data, index) => data?.index === i)?.map(data => data)?.length !== 0 &&
                  <div className={`${style.siteDeptFieldCard} ${style.marginTop10}`}>
                    {
                      contractedActivityTags?.filter((data, index) => data?.index === i)?.map((data, index) => (
                        <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}>
                          <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>{data?.type}-{data?.activity}</div>
                          <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} onClick={() => handleContractedActivityTagsRemove(index)} />
                        </div>
                      ))
                    }
                  </div>
                }
              </div>
            </div>
          )}
          <div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`} key={`sites${i}`}>
              <CommonLabel value='Payment Source*' />
              <SiteDepartmentField sites={sites} getSelectedSites={(value) => onSelectSite(value, i)} selectedSites={Array.isArray(paymentSource?.[i]) ? paymentSource?.[i] : paymentSource?.[i] ? new Array(1).fill(paymentSource?.[i]) : []} isMultiSiteEntity={isMultiSiteEntity} />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Service log Period for timesheet submission*' />
            <CommonSelectField
              value={timeSheetLabelData?.[i]?.value ? timeSheetLabelData?.[i]?.value : ''}
              onChange={(e) => handleTimesheetValue(i, 'value', e.target.value)}
              firstOptionLabel={''} firstOptionValue={''}
              valueList={['ENDOFMONTH', 'ENDOFEVERYWEEK', 'EVERY2WEEKS', 'EVERY4WEEKS', 'ONDAYOFSERVICE']}
              labelList={['End of the month', 'End of Every Week', 'Every 2 Weeks', 'Every 4 Weeks', 'On Day of Service']}
              disabledList={[false, false, false, false, false]} />
          </div>
        </div>
      )
    }
    setTimesheetFields(temp);
  }

  const getTimeSheetSubmissionTerms = async () => {
    const { data: timesheetSubmissionTerms } = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
    if (timesheetSubmissionTerms) {
      setTimesheetSubmissionTerms(timesheetSubmissionTerms);
      let labelTemp = [];
      let temp = [];
      let paymentSourceTemp = [];
      timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map((data, index) => {
        labelTemp.push({ label: data?.timesheetLabel?.label, value: data?.servicePeriod?.value });
        data?.activities?.map(activityData => {
          temp.push({ index: index, type: activityData?.activityType?.activityType, activity: activityData?.performingActivity?.activity });
        })
        paymentSourceTemp?.push(data?.paymentSource?.site !== null ? data?.paymentSource?.site : undefined);
      });
      setTimeSheetLabelData(labelTemp);
      setContractedActivityTags(temp);
      setPaymentSource(paymentSourceTemp);
    }
    getTimesheetFields();
  };

  const getSelectedUserDetails = (id) => {
    let user = users?.filter(user => user?.userId === id)?.map(data => data)[0];
    return user;
  }


  const handleTimeSheetWorkFlow = (name, reviewer, approver, activeTab) => {
    let data = {
      "name": {
        "name": name
      },
      "workFlowMap": {
        "workflow": {
          "1": {
            "workFlowUser": {
              "id": reviewer,
              "title": {
                "title": getSelectedUserDetails(reviewer)?.title?.title || '',
                "id": null,
              },
              "name": {
                "name": getSelectedUserDetails(reviewer)?.name?.firstName || '',
              },
              "suffix": {
                "id": getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                "suffix": getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
              }
            },
            "workFlowStatus": {
              "status": "APPROVED"
            }
          },
        }
      }
    }
    return data;
  }

  const updateWorkflow = async (workflowId, workFlowName, type) => {
    let data = {
      "workFlow": {
        "id": workflowId,
        "workFlowName": {
          "name": workFlowName,
        }
      }
    }
    if (type === 'AddOn') {
      await PUT(`contract-managment-service/contracts/${contractId}/addOnRequestWorkFlow`, data)
        .then(response => {
          console.log('Workflow Updated Successfully');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error');
        })
    } else {
      await PUT(`contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`, data)
        .then(response => {
          console.log('Workflow Updated Successfully');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error');
        })
    }
  }

  const refresh = () => {
    getTimeSheetWorkFlow();
  }


  const updateTimeSheetWorkflow = async (data, workFlowName, type) => {
    let id = absence?.id;
    if (id === '') {
      await POST(`timesheet-management-service/workflow`, JSON.stringify(data))
        .then(response => {
          updateWorkflow(response?.data, workFlowName, type);
        })
        .catch(error => {
          ErrorToaster('Unexpected Error');
        })
    }
    else {
      await PUT(`timesheet-management-service/workflow/${id}`, data)
        .then(response => {
          console.log('Success!');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error');
        })
    }
    getTabDataStatus();
    refresh();
  }



  const handleContinue = async (buttonType) => {
    setContinueLoading(true);
    if (absence?.reviewer === null || absence?.reviewer === '0') {
      ErrorToaster('Select Approver for Absence Request');
      return;
    }
    let absenceData = handleTimeSheetWorkFlow(`Absence-${contractName}`, absence.reviewer, absence.approver, 'requests');
    await updateTimeSheetWorkflow(absenceData, `Absence-${contractName}`, 'Absence');

    let data = {
      "timesheetSubmissionServicesCount": {
        "count": timeSheetCount
      },
      "timesheetActivitiesPeriods": timesheetValues,
      "contractorBusinessContact": {
        "hours": contractedTimeCommitmentHour,
        "frequency": contractedTimeCommitmentFrequency,
        "contractedTimeCommitment": contractedTimeCommitment
      },
      "plannedAbsenceLimit": {
        "days": plannedAbsence
      },
      "maximumAbsenceAllowed": {
        "days": maxUnplannedAbsence
      },
      "invoiceProcessing": {
        "days": invoiceProcessingDay,
        "threshold": invoiceProcessingDayThreshold,
        "goal": invoiceProcessingDayGoal
      },
      "dayLimit": {
        "activityServiceDate": {
          "days": dayLimitForSubmissionBasedOnActivityServiceDate
        },
        "contractEndDate": {
          "days": dayLimitForSubmissionBasedOnContractEndDate
        }
      }
    }

    const response = await PUT(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`, JSON.stringify(data));
    if (response) {
      SuccessToaster('Timesheet Submission Terms Updated Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }
    setContinueLoading(false);
    if (buttonType !== 'Continue') {
      getShowAlert(true);
    } else {
      getViewPage7(true);
      getCurrentPage('Payment & Compensation');
    }
  }


  useEffect(() => {
    setTimeSheetCount(timesheetSubmissionTerms?.timesheetSubmissionServicesCount?.count);
    setContractedTimeCommitment(timesheetSubmissionTerms?.contractorBusinessContact?.contractedTimeCommitment);
    setContractedTimeCommitmentHour(timesheetSubmissionTerms?.contractorBusinessContact?.hours);
    setContractedTimeCommitmentFrequency(timesheetSubmissionTerms?.contractorBusinessContact?.frequency);
    setPlannedAbsence(timesheetSubmissionTerms?.plannedAbsenceLimit?.days);
    setMaxUnplannedAbsence(timesheetSubmissionTerms?.maximumAbsenceAllowed?.days);
    setInvoiceProcessingDay(timesheetSubmissionTerms?.invoiceProcessing?.days);
    setInvoiceProcessingDayThreshold(timesheetSubmissionTerms?.invoiceProcessing?.threshold);
    setInvoiceProcessingDayGoal(timesheetSubmissionTerms?.invoiceProcessing?.goal);
    setDayLimitForSubmissionBasedOnActivityServiceDate(timesheetSubmissionTerms?.dayLimit?.activityServiceDate?.days);
    setDayLimitForSubmissionBasedOnContractEndDate(timesheetSubmissionTerms?.dayLimit?.contractEndDate?.days);
    setTimesheetValues(timesheetSubmissionTerms?.timesheetActivitiesPeriods);
  }, [timesheetSubmissionTerms]);


  return (
    <div className={style.cloneBlockStyle}>
      <div className={`${style.newContractFromCloneBoxStyle}`}>
        <div className={`${style.extentionGrid}`}>
          <CommonLabel value='Number of Timesheets to Submit for Services Performed' />
          <CommonInputField className={style.fourFieldWidth} type="number" min="0" value={timeSheetCount} onChange={(e) => setTimeSheetCount(parseInt(e.target.value))} />
        </div>
        <div>
          {timesheetFields}
        </div>
        {timeSheetCount <= 1 &&
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Contracted Activity to include for timesheet*' />
            <CommonInputField placeholder="All Activities" className={style.fullWidth} readOnly />
          </div>
        }

        <hr classname={style.marginTop20} />

        <div>
          <div className={style.purpleTitle}>
            PLANNED ABSENCE REQUESTS
          </div>
          <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { setAbsence({ ...absence, reviewer: value }) }} value={absence?.reviewer} />
        </div>

        {/* <div className={`${style.welcomeBorder} ${style.marginTop20}`}></div> */}

        < div className={`${style.addManagerGrid} ${style.marginTop20}`}>
          <CommonLabel value='Planned Absence Notification Days limit*' />
          <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
            <EditableText value={plannedAbsence} placeholder="0" type='number' onChange={(e) => setPlannedAbsence(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div>
        </div>
        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
          <CommonLabel value='Maximum Unplanned Absence Days Allowed *' />
          <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
            <EditableText value={maxUnplannedAbsence} placeholder="0" type='number' onChange={(e) => setMaxUnplannedAbsence(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div>
        </div>
        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
          <CommonLabel value='Invoice Processing Day Range Goal*' />
          <div className={style.displayInRow}>
            <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
              <EditableText value={invoiceProcessingDay} placeholder="0" type='number' onChange={(e) => setInvoiceProcessingDay(e.slice(0, limit))} className={style.editableTextStyleDays} />
              <div className={style.textElementWithoutBackgroundDays}>Days</div>
            </div>
            <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} `}>
              <div className={style.textElementWithNurse}>Threshold</div>
              <EditableText value={invoiceProcessingDayThreshold} placeholder="0" type='number' onChange={(e) => setInvoiceProcessingDayThreshold(e.slice(0, limit))} className={style.editableTextThresholdStyle} />
            </div>
            <div className={`${style.displayInRow} ${style.editableTextOuterBorder}`}>
              <div className={style.textElementWithNurse}>Goal</div>
              <EditableText value={invoiceProcessingDayGoal} placeholder="0" type='number' onChange={(e) => setInvoiceProcessingDayGoal(e.slice(0, limit))} className={style.editableTextThresholdStyle} />
            </div>
          </div>
        </div>

        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
          <CommonLabel value='Day limit for submission of timesheet based on activity service date *' />
          <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
            <EditableText value={dayLimitForSubmissionBasedOnActivityServiceDate} placeholder="0" type='number' min="0" onChange={(e) => setDayLimitForSubmissionBasedOnActivityServiceDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div>
        </div>
        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
          <CommonLabel value='Day limit for submission of timesheet based on contract end date *' />
          <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
            <EditableText value={dayLimitForSubmissionBasedOnContractEndDate} placeholder="0" type='number' min="0" onChange={(e) => setDayLimitForSubmissionBasedOnContractEndDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
            <div className={style.textElementWithoutBackgroundDays}>Days</div>
          </div>
        </div>
      </div>
      {
        isEditable &&
        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
          <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Contracted Services Specification') }}>BACK</button>
          <div>
            <button className={`${style.newContractOutlinedButton} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => handleContinue('Save In Progress') : {}}>SAVE IN-PROGRESS</button>
            <button className={`${style.newContractButtonStyle} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => { handleContinue('Continue') } : {}}>CONTINUE</button>
          </div>
        </div>
      }
    </div >
  )
}

export default TimeSheetSubmissionTerms;