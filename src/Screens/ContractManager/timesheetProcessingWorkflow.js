import React, { useState, useEffect } from 'react';
import { POST, GET, PUT } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ReviewerApproverField from './reviewerApproverField';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import ContractValidationCheckSummary from './contractValidationCheckSummary';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import { valueCheck } from "./../../utils/valueCheck";

import style from './index.module.scss';
import MissedMandatoryFieldAlert from './missedMandatoryFieldAlert';

const TimesheetProcessingWorkflow = ({ getViewPage9, getCurrentPage, selectContractInfo, contractId, contractName, isEditable, getTabDataStatus, contract, getShowAlert }) => {
  const [timesheet, setTimesheet] = useState({ id: '', aggregator: '', aggregatorTitle: {}, reviewer: '', reviewerTitle: {}, approver: '', approverTitle: {} });
  const [workFlowList, setWorkFlowList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [selectTimesheetToDefineProcess, setSelectTimesheetToDefineProcess] = useState('');
  const [customWorkFlow, setCustomWorkFlow] = useState(false);
  const [workflowTemplateToUse, setWorkflowTemplateToUse] = useState('');
  const [timesheetProcessingWorkflow, setTimesheetProcessingWorkflow] = useState([]);
  const [timeSheetTabs, setTimeSheetTabs] = useState([]);
  const [timesheetWorkFlow, setTimeSheetWorkFlow] = useState([]);
  const [users, setUsers] = useState([]);
  const [workflowExisting, setWorkflowExisting] = useState([]);
  const [provider, setProvider] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isShowValidationCheck, setIsShowValidationCheck] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);
  const [isAggregationNeeded, setIsAggregationNeeded] = useState(true);

  const [selectedTimeSheet, setSelectedTimeSheet] = useState({ id: '', reviewer: '', reviewerTitle: {}, approver: '', approverTitle: {} });
  const [unassignedKeys, setUnassignedKeys] = useState([]);
  const [showSaveInProgress, setShowSaveInProgress] = useState(false);
  const [buttonName, setButtonName] = useState("");
  const contractStatus = sessionStorage.getItem('Selected Contract Status');

  useEffect(() => {
    setSelectTimesheetToDefineProcess(timesheetProcessingWorkflow[0]?.timesheetLabel?.label);
    setWorkflowTemplateToUse(timesheetProcessingWorkflow[0]?.workFlowTemplate?.name?.name);
    setCustomWorkFlow(timesheetProcessingWorkflow[0]?.customWorkFlow);
    setWorkFlowList(timesheetProcessingWorkflow?.map(data => data?.workFlow?.id));
  }, [timesheetProcessingWorkflow]);

  useEffect(() => {
    setTimesheet({ id: '', approver: '', approverTitle: {}, reviewer: '', reviewerTitle: {}, aggregator: '', aggregatorTitle: {} });
    getTimeSheetSubmissionTerms();
    setTabIndex(timeSheetTabs?.indexOf(activeTab));
  }, [activeTab])

  useEffect(() => {
    getContractSites();
    getProviderData();
    getTimeSheetValues();
    getTimeSheetWorkFlow();
  }, [])

  useEffect(() => {
    getUserData();
    getProviderData();
  }, [sites])

  useEffect(() => {
    getTimeSheetSubmissionTerms();
  }, [timesheetWorkFlow])

  const refresh = () => {
    getTimeSheetWorkFlow();
  }

  const getUserData = async () => {
    let siteId = sites?.map(data => data?.id);
    let deptId = [];
    sites?.map(data => data?.departmentList?.departments?.map(dept => {
      deptId.push(`${data?.id}#${dept?.id}`);
    }))
    let encodedDept = encodeURIComponent(deptId);
    let uri = `user-management-service/user/workFlowUser?sites=${siteId}&sitedepartments=${encodedDept}&contractIdToIgnore=${contractId}`;
    const { data: userList } = await GET(uri)
    if (userList) {
      setUsers(userList);
    }
  }

  const getContractValidationDialog = (value) => {
    setIsShowValidationCheck(value);
  }

  const getContractSites = async () => {
    const { data: contractData } = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
    setIsAggregationNeeded(contractData?.contractDetail?.aggregationNeeded)
    setSites(contractData?.contractDetail?.site?.sites);
  }

  const getProviderData = async () => {
    if (contractId !== '' && (selectContractInfo === 'MULTIPLE' && isAggregationNeeded)) {
      const { data: providerData } = await GET(`user-management-service/user?contractID=${contractId}`);
      if (providerData) {
        let aggregatorUser = providerData?.filter(user => user?.roles?.map(role => role?.roleName)?.includes('Aggregator'))?.map(data => data);
        console.log('aggregatorUser', aggregatorUser);
        setProvider(aggregatorUser);
      }
    }
  }

  const getTimeSheetWorkFlow = async () => {
    const { data: timesheetWorkFlow } = await GET('timesheet-management-service/workflow');
    if (timesheetWorkFlow) {
      setTimeSheetWorkFlow(timesheetWorkFlow);
    }
  }


  const getTimeSheetValues = async () => {
    setIsLoading(true);
    const { data: timesheetSubmissionTerms } = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
    setTimeSheetTabs(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data => data.timesheetLabel?.label) || []);
    setActiveTab(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data => data.timesheetLabel?.label)?.[0] || '');
    setIsLoading(false);
  }

  const updateTimeSheetWorkflow = async (data, workFlowName, type) => {
    let id = timesheet?.id;
    if (id === '' || id === undefined) {
      await POST(`timesheet-management-service/workflow`, JSON.stringify(data))
        .then(response => {
          handleContinue(response?.data, data?.workFlowMap, 'post');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error');
        })
    }
    else {
      await PUT(`timesheet-management-service/workflow/${id}`, data)
        .then(response => {
          handleContinue(id, data?.workFlowMap, 'put');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error');
        })
    }
    getTabDataStatus();
    refresh();
  }

  const getSelectedUserDetails = (id) => {
    let user = users?.filter(user => user?.id === id)?.map(data => data)[0];
    return user;
  }

  const handleTimeSheetWorkFlow = (name, reviewer, approver, aggregator, activeTab) => {
    let data;
    let aggregatorFirstName = provider?.filter(data => data?.id === aggregator)?.map(data => data)?.[0]?.name?.firstName + " ";
    let aggregatorMiddleName = provider?.filter(data => data?.id === aggregator)?.map(data => data)?.[0]?.name?.middleName + " ";
    let aggregatorLastName = provider?.filter(data => data?.id === aggregator)?.map(data => data)?.[0]?.name?.lastName || '';
    let approverFirstName = getSelectedUserDetails(approver)?.name?.firstName + " ";
    let approverLastName = getSelectedUserDetails(approver)?.name?.lastName;
    let approverMiddleName = getSelectedUserDetails(approver)?.name?.middleName + " ";
    let reviewerFirstName = getSelectedUserDetails(reviewer)?.name?.firstName + " ";
    let reviewerLastName = getSelectedUserDetails(reviewer)?.name?.lastName;
    let reviewerMiddleName = getSelectedUserDetails(reviewer)?.name?.middleName + " ";
    if ((selectContractInfo === 'MULTIPLE' && isAggregationNeeded) && reviewer === approver) {
      data = {
        "name": {
          "name": name
        },
        "workFlowMap": {
          "workflow": {
            "1": {
              "workFlowUser": {
                "id": aggregator,
                "title": { id: timesheet?.aggregatorTitle?.id, title: timesheet?.aggregatorTitle?.title },
                "name": {
                  "name": aggregatorFirstName + aggregatorMiddleName + aggregatorLastName,
                  "firstName": aggregatorFirstName,
                  "middleName": aggregatorMiddleName,
                  "lastName": aggregatorLastName,
                },
                "suffix": {
                  "id": provider?.filter(data => data?.id === aggregator)?.map(data => data)?.[0]?.name?.suffix?.id || '',
                  "suffix": provider?.filter(data => data?.id === aggregator)?.map(data => data)?.[0]?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "AGGREGATOR"
              }
            },
            "2": {
              "workFlowUser": {
                "id": reviewer,
                "title": { id: timesheet?.reviewerTitle?.id, title: timesheet?.reviewerTitle?.title },
                "name": {
                  "name": reviewerFirstName + reviewerMiddleName + reviewerLastName,
                  "firstName": reviewerFirstName,
                  "middleName": reviewerMiddleName,
                  "lastName": reviewerLastName,
                },
                "suffix": {
                  "id": getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                  "suffix": getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "APPROVED"
              }
            }
          }
        }
      }
    }
    else if ((selectContractInfo === 'MULTIPLE' && isAggregationNeeded) && approver !== reviewer) {
      data = {
        "name": {
          "name": name
        },
        "workFlowMap": {
          "workflow": {
            "1": {
              "workFlowUser": {
                "id": aggregator,
                "title": { id: timesheet?.aggregatorTitle?.id, title: timesheet?.aggregator?.title },
                "name": {
                  "name": aggregatorFirstName + aggregatorMiddleName + aggregatorLastName,
                  "firstName": aggregatorFirstName,
                  "middleName": aggregatorMiddleName,
                  "lastName": aggregatorLastName,
                },
                "suffix": {
                  "id": provider?.filter(data => data?.id === aggregator)?.map(data => data)?.[0]?.name?.suffix?.id || '',
                  "suffix": provider?.filter(data => data?.id === aggregator)?.map(data => data)?.[0]?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "AGGREGATOR"
              }
            },
            "2": {
              "workFlowUser": {
                "id": reviewer,
                "title": { id: timesheet?.reviewerTitle?.id, title: timesheet?.reviewerTitle?.title },
                "name": {
                  "name": reviewerFirstName + reviewerMiddleName + reviewerLastName,
                  "firstName": reviewerFirstName,
                  "middleName": reviewerMiddleName,
                  "lastName": reviewerLastName,
                },
                "suffix": {
                  "id": getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                  "suffix": getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "REVIEWED"
              }
            },
            "3": {
              "workFlowUser": {
                "id": approver,
                "title": { id: timesheet?.approverTitle?.id, title: timesheet?.approverTitle?.title },
                "name": {
                  "name": approverFirstName + approverMiddleName + approverLastName,
                  "firstName": approverFirstName,
                  "middleName": approverMiddleName,
                  "lastName": approverLastName,
                },
                "suffix": {
                  "id": getSelectedUserDetails(approver)?.name?.suffix?.id || '',
                  "suffix": getSelectedUserDetails(approver)?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "APPROVED"
              }
            }
          }
        }
      }
    }
    else if ((!isAggregationNeeded) && reviewer === approver) {
      data = {
        "name": {
          "name": name
        },
        "workFlowMap": {
          "workflow": {
            "1": {
              "workFlowUser": {
                "id": reviewer,
                "title": { id: timesheet?.reviewerTitle?.id, title: timesheet?.reviewerTitle?.title },
                "name": {
                  "name": reviewerFirstName + reviewerMiddleName + reviewerLastName,
                  "firstName": reviewerFirstName,
                  "middleName": reviewerMiddleName,
                  "lastName": reviewerLastName,
                },
                "suffix": {
                  "id": getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                  "suffix": getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "APPROVED"
              }
            }
          }
        }
      }
    } else if ((isAggregationNeeded) && reviewer === approver) {
      data = {
        "name": {
          "name": name
        },
        "workFlowMap": {
          "workflow": {
            "1": {
              "workFlowUser": {
                "id": reviewer,
                "title": { id: timesheet?.reviewerTitle?.id, title: timesheet?.reviewerTitle?.title },
                "name": {
                  "name": reviewerFirstName + reviewerMiddleName + reviewerLastName,
                  "firstName": reviewerFirstName,
                  "middleName": reviewerMiddleName,
                  "lastName": reviewerLastName,
                },
                "suffix": {
                  "id": getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                  "suffix": getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "APPROVED"
              }
            }
          }
        }
      }
    }
    else {
      data = {
        "name": {
          "name": name
        },
        "workFlowMap": {
          "workflow": {
            "1": {
              "workFlowUser": {
                "id": reviewer,
                "title": { id: timesheet?.reviewerTitle?.id, title: timesheet?.reviewerTitle?.title },
                "name": {
                  "name": reviewerFirstName + reviewerMiddleName + reviewerLastName,
                  "firstName": reviewerFirstName,
                  "middleName": reviewerMiddleName,
                  "lastName": reviewerLastName,
                },
                "suffix": {
                  "id": getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                  "suffix": getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "REVIEWED"
              }
            },
            "2": {
              "workFlowUser": {
                "id": approver,
                "title": { id: timesheet?.approverTitle?.id, title: timesheet?.approverTitle?.title },
                "name": {
                  "name": approverFirstName + approverMiddleName + approverLastName,
                  "firstName": approverFirstName,
                  "middleName": approverMiddleName,
                  "lastName": approverLastName,
                },
                "suffix": {
                  "id": getSelectedUserDetails(approver)?.name?.suffix?.id || '',
                  "suffix": getSelectedUserDetails(approver)?.name?.suffix?.suffix || '',
                }
              },
              "workFlowStatus": {
                "status": "APPROVED"
              }
            }
          }
        }
      }
    }
    return data;
  }

  const mandatoryFieldCheck = (buttonType) => {
    setContinueLoading(true);
    if (buttonType === "SaveInProgress" || buttonType === "Continue") {
      saveInProgresscheck(buttonType);
      setButtonName(buttonType)
    } else {
      handleSubmit('Next')
    }
  };

  const saveInProgresscheck = (buttonType) => {
    var keys = [];
    if (valueCheck(timesheet?.reviewer)) {
      keys.push("Select Reviewer");
    }
    if (valueCheck(timesheet?.approver)) {
      keys.push("Select Approver");
    }

    // if (selectContractInfo === 'MULTIPLE' && valueCheck(timesheet?.aggregator)) {
    //   keys.push("Select Aggregator");
    // }

    setUnassignedKeys(keys);
    if (keys?.length !== 0) {
      setShowSaveInProgress(true);
      setContinueLoading(true)
    } else {
      handleSubmit(buttonType);
    }
  };

  const saveInProgressFunction = (type) => {
    handleSubmit(type);
    setShowSaveInProgress(false)
  };

  const getSaveInProgressAlert = (value) => {
    setShowSaveInProgress(value);
    setContinueLoading(value)
  };

  const handleSubmit = async (buttontext) => {
    setContinueLoading(true);

    if (valueCheck(timesheet?.reviewer) || valueCheck(timesheet?.approver)) {
      ErrorToaster('Select both Approver and Reviewer to save');
      setContinueLoading(false);
      return;
    }
    // if (selectContractInfo === 'MULTIPLE' && valueCheck(timesheet?.aggregator)) {
    //   ErrorToaster('Select Aggregator to save');
    //   setContinueLoading(false);
    //   return;
    // }

    let data = handleTimeSheetWorkFlow(activeTab, timesheet?.reviewer, timesheet?.approver, timesheet?.aggregator, activeTab);
    await updateTimeSheetWorkflow(data, activeTab, 'Timesheet');

    setContinueLoading(false);
    if (buttontext === 'Continue') {
      getViewPage9(true);
      // getCurrentPage('Request Processing Workflow')
    } else if (buttontext === 'SaveInProgress') {
      getShowAlert(true);
    } else {
      getNextTab();
    }
    setIsShowValidationCheck(true);
  }

  const handleContinue = async (workflowId, workFlowMap, method) => {
    let temp = workflowExisting;;
    if (method === 'post') {
      temp?.push({
        "timesheetLabel": {
          "label": activeTab
        },
        "workFlowTemplate": {},
        "workFlowDescription": {},
        "workFlow": {
          "id": workflowId,
          "name": { 'name': activeTab },
          "workFlowMap": workFlowMap,
        },
        "customWorkFlow": false
      })
    } else {
      let index = temp.findIndex(data => data?.workFlow?.id === workflowId);
      console.log('index value', index)
      temp[index] = {
        "timesheetLabel": {
          "label": activeTab
        },
        "workFlowTemplate": {},
        "workFlowDescription": {},
        "workFlow": {
          "id": workflowId,
          "name": { 'name': activeTab },
          "workFlowMap": workFlowMap,
        },
        "customWorkFlow": false
      }
    }
    let data = { "workFlowDetails": temp }
    await PUT(`contract-managment-service/contracts/${contractId}/timesheetProcessingWorkFlow`, data)
      .then(response => {
        SuccessToaster('Timesheet Processing Workflow Updated Successfully');
      })
      .catch(error => {
        ErrorToaster('Unexpected Error');
      })


  }

  const getTimeSheetSubmissionTerms = async () => {
    const { data: timesheetFlow } = await GET(`contract-managment-service/contracts/${contractId}/timesheetProcessingWorkFlow`);
    setWorkflowExisting(timesheetFlow?.workFlowDetails);
    let id = timesheetFlow?.workFlowDetails?.filter(data => data?.workFlow?.name?.name === activeTab)?.map(data => data?.workFlow?.id)[0];
    if (timesheetFlow) {
      let workflowData = timesheetWorkFlow?.filter(data => data?.id === id)?.map(data => data?.workFlowMap?.workflow)[0];
      let workFlowValues = (workflowData !== undefined && workflowData !== null) ? Object.values(workflowData) : [];
      if (workFlowValues?.length === 1) {
        let approver = workFlowValues?.[0]?.workFlowUser?.id;
        setTimesheet({ ...timesheet, id: id, reviewer: approver, reviewerTitle: workFlowValues?.[0]?.workFlowUser?.title, approver: approver, approverTitle: workFlowValues?.[0]?.workflowUser?.title });
      }
      else if (workFlowValues?.length === 3) {
        let aggregator = workFlowValues?.[0]?.workFlowUser?.id;
        let reviewer = workFlowValues?.[1]?.workFlowUser?.id;
        let approver = workFlowValues?.[2]?.workFlowUser?.id;
        setTimesheet({ ...timesheet, id: id, aggregator: aggregator, aggregatorTitle: workFlowValues?.[0]?.workFlowUser?.title, reviewer: reviewer, reviewerTitle: workFlowValues?.[1]?.workFlowUser?.title, approver: approver, approverTitle: workFlowValues?.[2]?.workFlowUser?.title });
      }
      else if ((selectContractInfo === 'MULTIPLE' && isAggregationNeeded) && workFlowValues?.length === 2) {
        let aggregator = workFlowValues?.[0]?.workFlowUser?.id;
        let approver = workFlowValues?.[1]?.workFlowUser?.id;
        setTimesheet({ ...timesheet, id: id, reviewer: approver, reviewerTitle: workFlowValues?.[1]?.workFlowUser?.title, approver: approver, approverTitle: workFlowValues?.[1]?.workFlowUser?.title, aggregator: aggregator, aggregatorTitle: workFlowValues?.[0]?.workFlowUser?.title });
      } else {
        let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
        let approver = workFlowValues?.[1]?.workFlowUser?.id;
        setTimesheet({ ...timesheet, id: id, reviewer: reviewer, reviewerTitle: workFlowValues?.[0]?.workFlowUser?.title, approver: approver, approverTitle: workFlowValues?.[1]?.workFlowUser?.title });
      }

    }
  };

  const getNextTab = () => {
    let tabIndexValue = timeSheetTabs?.indexOf(activeTab);
    setActiveTab(timeSheetTabs[tabIndexValue + 1]);
    setTabIndex(tabIndexValue + 1);
  }

  if (isLoading) {
    return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
  }

  const dataCheck = (value) => {
    if (timesheetProcessingWorkflow) {
      return valueCheck(value);
    } else {
      return false
    }
  }

  return (
    <>
      {
        timeSheetTabs?.length !== 0 ?
          <div className={style.cloneBlockStyle}>
            <div className={`${style.flexLeft} ${style.reduce10Left} ${style.horizontalScroll} ${style.fullWidth}`}>
              {
                timeSheetTabs?.map(data => (
                  <button className={`${style.timesheetButtonStyle} ${activeTab === data && style.selectedTimesheetButton}`} onClick={() => setActiveTab(data)}>{data}</button>
                ))
              }
            </div>
            <div className={`${style.timeSheetBoxStyle} ${style.verticalSpaceBetween}`}>
              <div>
                <div className={`${style.addManagerGrid}`}>
                  <CommonLabel value='Timesheet To Define Process*' />
                  <div className={style.displayInRow}>
                    <CommonInputField className={style.fullWidth} placeholder={activeTab}
                      value={activeTab} readOnly={true} />
                  </div>
                </div>
                {(selectContractInfo === 'MULTIPLE' && isAggregationNeeded) &&
                  <ReviewerApproverField data={provider} label="Timesheet Aggregator*" onValueChange={(value, title) => { setTimesheet({ ...timesheet, aggregator: value, aggregatorTitle: title }) }} selectLabel="Select Aggregator" value={timesheet?.aggregator || '0'} />
                }
                <ReviewerApproverField data={users} label="Timesheet Reviewer*" onValueChange={(value, title) => { setTimesheet({ ...timesheet, reviewer: value, reviewerTitle: title }) }} selectLabel="Select Reviewer" value={timesheet?.reviewer || '0'} approverReviewer='reviewer' />
                <ReviewerApproverField data={users} label="Timesheet Approver*" onValueChange={(value, title) => { setTimesheet({ ...timesheet, approver: value, approverTitle: title }) }} selectLabel="Select Approver" value={timesheet?.approver || '0'} approverReviewer='approver' />
              </div>
              {
                tabIndex < timeSheetTabs?.length - 1 && contractStatus === "DRAFT" &&
                <div>
                  <button className={`${style.timesheetNextButtonStyle}  ${style.cursorPointer} ${style.floatRight}`}
                    // onClick={() => { submit('Next') }}
                    onClick={!continueLoading ? () => { mandatoryFieldCheck('Next') } : {}}
                  >NEXT</button>
                </div>
              }
            </div>
            {contractStatus === "DRAFT" &&
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle} ${style.cursorPointer} `} onClick={() => { getCurrentPage('Payment & Compensation') }}>BACK</button>
                <div>
                  <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                    onClick={!continueLoading ? () => mandatoryFieldCheck('SaveInProgress') : {}}
                  >SAVE IN PROGRESS</button>
                  <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                    onClick={!continueLoading ? () => { mandatoryFieldCheck('Continue') } : {}}
                  >CONTINUE</button>
                </div>
              </div>
            }

            {
              // <Dialog isOpen={viewWorkflowDialog} onClose={() => setViewWorkflowDialog(false)} className={`${style.toolbarDialogStyle} ${style.dialogPaddingBottom}`}>
              //     <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
              //         <div className={style.spaceBetween}>
              //             <div className={style.reduceTop10}>
              //                 <p className={style.extensionStyle}>View / Creat Workflow</p>
              //                 <p>Note: To Draw Arrow or Line, click on its element and draw on the screen.</p>
              //             </div>
              //             <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setViewWorkflowDialog(false)} />
              //         </div>
              //         <div className={`${style.flowChartBoxStyle}`}>
              //             <ToolBar />
              //         </div>
              //     </div>
              // </Dialog>
            }

            <MissedMandatoryFieldAlert
              alert={showSaveInProgress}
              getSaveInProgressAlert={getSaveInProgressAlert}
              fieldData={unassignedKeys}
              saveInProgressFunction={saveInProgressFunction}
              setContinueLoading={setContinueLoading}
              buttonName={buttonName}
            />

          </div>
          :
          <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Timesheet Submission Terms'} title={'NO TIMESHEET FOUND'} description={'No Timesheet Is Found.'} buttonText={'ADD TIMESHEET'} />
      }
      {isShowValidationCheck && (
        <ContractValidationCheckSummary getContractValidationDialog={getContractValidationDialog} contract={contract} />
      )}
    </>
  )
}

export default TimesheetProcessingWorkflow;
