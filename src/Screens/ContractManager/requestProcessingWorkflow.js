import React, { useState, useEffect } from 'react';
import { TextArea, InputGroup, Icon, Dialog, Classes, Intent, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToolBar from './toolbar';
import { POST, GET, PUT } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ReviewerApproverField from './reviewerApproverField';

import style from './index.module.scss';
import ContractValidationCheckSummary from './contractValidationCheckSummary';

const RequestProcessingWorkflow = ({ getViewPage9, getCurrentPage, selectContractInfo, contractId, contractName, isEditable, contract }) => {
    const [addOn, setAddOn] = useState({ id: '', reviewer: '', approver: '' });
    const [absence, setAbsence] = useState({ id: '', reviewer: '', approver: '' });
    const [timesheet, setTimesheet] = useState({ id: '', reviewer: '', approver: '' });
    const [workFlowList, setWorkFlowList] = useState([]);
    const [activeTab, setActiveTab] = useState('requests');
    const [selectTimesheetToDefineProcess, setSelectTimesheetToDefineProcess] = useState('');
    const [customWorkFlow, setCustomWorkFlow] = useState(false);
    const [isShowValidationCheck, setIsShowValidationCheck] = useState(false);
    const [workflowTemplateToUse, setWorkflowTemplateToUse] = useState('');
    const [timesheetProcessingWorkflow, setTimesheetProcessingWorkflow] = useState([]);
    const [timeSheetTabs, setTimeSheetTabs] = useState([]);
    const [timesheetWorkFlow, setTimeSheetWorkFlow] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTimeSheet, setSelectedTimeSheet] = useState({ id: '', reviewer: '', approver: '' });

    console.log('contractDta', contract);

    useEffect(() => {
        setSelectTimesheetToDefineProcess(timesheetProcessingWorkflow[0]?.timesheetLabel?.label);
        setWorkflowTemplateToUse(timesheetProcessingWorkflow[0]?.workFlowTemplate?.name?.name);
        setCustomWorkFlow(timesheetProcessingWorkflow[0]?.customWorkFlow);
        setWorkFlowList(timesheetProcessingWorkflow?.map(data => data?.workFlow?.id));
    }, [timesheetProcessingWorkflow]);

    // useEffect(() => {
    //     if (activeTab === 'requests') {
    //         getAddOnRequestWorkFlow();
    //         getAbsenceRequestWorkFlow();
    //     }
    // }, [activeTab])

    useEffect(() => {
        getUserData();
        getTimeSheetWorkFlow();
        getAddOnRequestWorkFlow();
        getAbsenceRequestWorkFlow();
    }, [])

    useEffect(() => {
        getAddOnRequestWorkFlow();
        getAbsenceRequestWorkFlow();
    }, [timesheetWorkFlow])

    const refresh = () => {
        getTimeSheetWorkFlow();
    }

    const getUserData = async () => {
        const { data: userList } = await GET(`contract-managment-service/contracts/workFlowUser`)
        if (userList) {
            setUsers(userList);
        }
    }

    const getTimeSheetWorkFlow = async () => {
        const { data: timesheetWorkFlow } = await GET('timesheet-management-service/workflow');
        if (timesheetWorkFlow) {
            setTimeSheetWorkFlow(timesheetWorkFlow);
        }
    }

    const getAddOnRequestWorkFlow = async () => {
        const { data: addOnWorkflow } = await GET(`contract-managment-service/contracts/${contractId}/addOnRequestWorkFlow`);
        if (addOnWorkflow) {
            let workflowData = timesheetWorkFlow?.filter(data => data?.id === addOnWorkflow?.workFlow?.id)?.map(data => data?.workFlowMap?.workflow)[0] || {};
            let workFlowValues = Object?.values(workflowData);
            let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
            let approver = workFlowValues?.[1]?.workFlowUser?.id;
            setAddOn({ ...addOn, id: addOnWorkflow?.workFlow?.id, reviewer: reviewer, approver: approver });
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

    const getContractValidationDialog = (value) => {
        setIsShowValidationCheck(value);
    }

    const updateTimeSheetWorkflow = async (data, workFlowName, type) => {
        let id = type === 'AddOn' ? addOn?.id : type === 'Absence' ? absence?.id : '';
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
        refresh();
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

    const submit = async () => {
        let addOnData = handleTimeSheetWorkFlow(`AddOn-${contractName}`, addOn.reviewer, addOn.approver, activeTab);
        let absenceData = handleTimeSheetWorkFlow(`Absence-${contractName}`, absence.reviewer, absence.approver, activeTab);
        await updateTimeSheetWorkflow(addOnData, `AddOn-${contractName}`, 'AddOn');
        await updateTimeSheetWorkflow(absenceData, `Absence-${contractName}`, 'Absence');
        SuccessToaster('Workflow Updated Successfully');
        setIsShowValidationCheck(true);
    }

    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.timeSheetBoxStyle}`}>
                <div>
                    <div>
                        <div className={style.purpleTitle}>
                            ADD-ON ACTIVITY / SERVICE REQUESTS
                        </div>
                        <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { setAddOn({ ...addOn, reviewer: value }) }} value={addOn?.reviewer} />
                    </div>
                    <div className={style.marginTop50}>
                        <div className={style.purpleTitle}>
                            PLANNED ABSENCE REQUESTS
                        </div>
                        <ReviewerApproverField data={users} label="Designate Request Approver*" selectLabel="Select Approver" onValueChange={(value) => { setAbsence({ ...absence, reviewer: value }) }} value={absence?.reviewer} />
                    </div>
                </div>
            </div>
            {!isEditable &&
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                  <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Timesheet Processing Workflow') }}>BACK</button>
                  <div>
                      <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                          onClick={() => {
                              submit();
                          }}
                      >CONTINUE</button>
                  </div>
              </div>
            }
            {isShowValidationCheck && (
                <ContractValidationCheckSummary getContractValidationDialog={getContractValidationDialog} contract={contract} />
            )}
        </div>
    )
}

export default RequestProcessingWorkflow;
