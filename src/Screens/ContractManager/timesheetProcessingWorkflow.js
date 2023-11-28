import React, { useState, useEffect } from 'react';
import { POST, GET, PUT } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ReviewerApproverField from './reviewerApproverField';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import ContractValidationCheckSummary from './contractValidationCheckSummary';
import CommonLabel from '../../Components/CommonFields/CommonLabel';

import style from './index.module.scss';

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
  const [provider, setProvider] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isShowValidationCheck, setIsShowValidationCheck] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  const [selectedTimeSheet, setSelectedTimeSheet] = useState({ id: '', reviewer: '', reviewerTitle: {}, approver: '', approverTitle: {} });

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
    setSites(contractData?.contractDetail?.site?.sites);
  }


  const getProviderData = async () => {
    if (contractId !== '' && selectContractInfo === 'MULTIPLE') {
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
          handleContinue(response?.data, data?.workFlowMap);
        })
        .catch(error => {
          ErrorToaster('Unexpected Error');
        })
    }
    else {
      await PUT(`timesheet-management-service/workflow/${id}`, data)
        .then(response => {
          SuccessToaster('Workflow Updated Successfully');
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
    let firstName = getSelectedUserDetails(reviewer)?.name?.firstName + " ";
    let lastName = getSelectedUserDetails(reviewer)?.name?.lastName;
    let middleName = getSelectedUserDetails(reviewer)?.name?.middleName + " ";
    if (selectContractInfo === 'MULTIPLE' && reviewer === approver) {
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
                  "name": firstName + middleName + lastName,
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
    else if (selectContractInfo === 'MULTIPLE' && approver !== reviewer) {
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
                  "name": firstName + middleName + lastName,
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
                  "name": firstName + middleName + lastName,
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
    else if (selectContractInfo !== 'MULTIPLE' && reviewer === approver) {
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
                  "name": firstName + middleName + lastName,
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
    } else {
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
                  "name": firstName + middleName + lastName,
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
                  "name": firstName + middleName + lastName,
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

  const submit = async (buttontext) => {
    if (timesheet.reviewer !== '' || timesheet.approver !== '') {
      setContinueLoading(true);
      // if (timesheet?.reviewer === '' || timesheet?.approver === '') {
      //   ErrorToaster('Select both Approver and Reviewer to save');
      //   setContinueLoading(false);
      //   return;
      // }
      // if (selectContractInfo === 'MULTIPLE' && timesheet?.aggregator === '') {
      //   ErrorToaster('Select Aggregator to save');
      //   setContinueLoading(false);
      //   return;
      // }
      let data = handleTimeSheetWorkFlow(activeTab, timesheet?.reviewer, timesheet?.approver, timesheet?.aggregator, activeTab);
      updateTimeSheetWorkflow(data, activeTab, 'Timesheet');
      setContinueLoading(false);
      if (buttontext === 'Continue') {
        getViewPage9(true);
        // getCurrentPage('Request Processing Workflow')
      } else if (buttontext === 'Save In Progress') {
        getShowAlert(true);
      } else {
        getNextTab();
      }
      setIsShowValidationCheck(true);
    }
  }

  const handleContinue = async (workflowId, workFlowMap) => {
    let temp = timesheetProcessingWorkflow;
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
      else if (selectContractInfo === 'MULTIPLE' && workFlowValues?.length === 2) {
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
                {selectContractInfo === 'MULTIPLE' &&
                  <ReviewerApproverField data={provider} label="Timesheet Aggregator*" onValueChange={(value, title) => { setTimesheet({ ...timesheet, aggregator: value, aggregatorTitle: title }) }} selectLabel="Select Aggregator" value={timesheet?.aggregator || '0'} />
                }
                <ReviewerApproverField data={users} label="Timesheet Reviewer*" onValueChange={(value, title) => { setTimesheet({ ...timesheet, reviewer: value, reviewerTitle: title }) }} selectLabel="Select Reviewer" value={timesheet?.reviewer || '0'} approverReviewer='reviewer' />
                <ReviewerApproverField data={users} label="Timesheet Approver*" onValueChange={(value, title) => { setTimesheet({ ...timesheet, approver: value, approverTitle: title }) }} selectLabel="Select Approver" value={timesheet?.approver || '0'} approverReviewer='approver' />
              </div>
              {
                tabIndex < timeSheetTabs?.length - 1 && isEditable &&
                <div>
                  <button className={`${style.timesheetNextButtonStyle}  ${style.cursorPointer} ${style.floatRight}`} onClick={() => { submit('Next') }}>NEXT</button>
                </div>
              }
            </div>
            {isEditable &&
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle} ${style.cursorPointer} `} onClick={() => { getCurrentPage('Payment & Compensation') }}>BACK</button>
                <div>
                  <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                    onClick={() => {
                      submit('Save In Progress')
                    }}
                  >SAVE IN PROGRESS</button>
                  <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                    onClick={() => {
                      submit('Continue')
                    }}
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
