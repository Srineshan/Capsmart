import React, { useState, useEffect } from 'react';
import { TextArea, InputGroup, Icon, Dialog, Classes, Intent, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToolBar from './toolbar';
import { POST, GET, PUT } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ReviewerApproverField from './reviewerApproverField';

import style from './index.module.scss';

const RequestProcessingWorkflow = ({getViewPage9, getCurrentPage, selectContractInfo, contractId, contractName }) => {
    const [addOn, setAddOn] = useState({ id: '', reviewer: '', approver: '' });
    const [absence, setAbsence] = useState({ id: '', reviewer: '', approver: '' });
    const [timesheet, setTimesheet] = useState({ id: '', reviewer: '', approver: '' });
    const [workFlowList, setWorkFlowList] = useState([]);
    // const [applyWorkflowToAll, setApplyWorkflowToAll] = useState(true);
    // const [viewWorkflowDialog, setViewWorkflowDialog] = useState(false);
    // const [workflowName, setWorkflowName] = useState('');
    // const [workflowDescription, setWorkflowDescription] = useState('');
    const [activeTab, setActiveTab] = useState('requests');
    const [selectTimesheetToDefineProcess, setSelectTimesheetToDefineProcess] = useState('');
    const [customWorkFlow, setCustomWorkFlow] = useState(false);
    const [workflowTemplateToUse, setWorkflowTemplateToUse] = useState('');
    const [timesheetProcessingWorkflow, setTimesheetProcessingWorkflow] = useState([]);
    const [timeSheetTabs, setTimeSheetTabs] = useState([]);
    const [timesheetWorkFlow, setTimeSheetWorkFlow] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedTimeSheet, setSelectedTimeSheet] = useState({ id: '', reviewer: '', approver: '' });

    useEffect(() => {
        setSelectTimesheetToDefineProcess(timesheetProcessingWorkflow[0]?.timesheetLabel?.label);
        setWorkflowTemplateToUse(timesheetProcessingWorkflow[0]?.workFlowTemplate?.name?.name);
        // setWorkflowDescription(timesheetProcessingWorkflow[0]?.workFlowDescription?.value);
        // setWorkflowName(timesheetProcessingWorkflow[0]?.workFlow?.workFlowName?.name);
        setCustomWorkFlow(timesheetProcessingWorkflow[0]?.customWorkFlow);
        setWorkFlowList(timesheetProcessingWorkflow?.map(data => data?.workFlow?.id));
    }, [timesheetProcessingWorkflow]);

    useEffect(() => {
        if (activeTab === 'requests') {
            getAddOnRequestWorkFlow();
            getAbsenceRequestWorkFlow();
        } else {
            setTimesheet({ id: '', approver: '', reviewer: '' });
            getTimeSheetSubmissionTerms();
        }
    }, [activeTab])

    useEffect(() => {
        getUserData();
        getTimeSheetSubmissionTerms();
        getTimeSheetValues();
        getTimeSheetWorkFlow();
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
            console.log('userData', userList);
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
            let workflowData = timesheetWorkFlow?.filter(data => data?.id === addOnWorkflow?.workFlow?.id)?.map(data => data?.workFlowMap?.workflow)[0];
            let workFlowValues = Object.values(workflowData);
            let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
            let approver = workFlowValues?.[1]?.workFlowUser?.id;
            setAddOn({ ...addOn, id: addOnWorkflow?.workFlow?.id, reviewer: reviewer, approver: approver });
        }
    }

    const getAbsenceRequestWorkFlow = async () => {
        const { data: absenceWorkFlow } = await GET(`contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`);
        if (absenceWorkFlow) {
            let workflowData = timesheetWorkFlow?.filter(data => data?.id === absenceWorkFlow?.workFlow?.id)?.map(data => data?.workFlowMap?.workflow)[0];
            let workFlowValues = Object.values(workflowData);
            let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
            let approver = workFlowValues?.[1]?.workFlowUser?.id;
            setAbsence({ ...absence, id: absenceWorkFlow?.workFlow?.id, reviewer: reviewer, approver: approver });
        }
    }

    const getTimeSheetValues = async () => {
        const { data: timesheetSubmissionTerms } = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
        setTimeSheetTabs(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data => data.timesheetLabel?.label) || []);
        setActiveTab(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data => data.timesheetLabel?.label)?.[0] || '')
    }

    const updateTimeSheetWorkflow = async (data, workFlowName, type) => {
        let id = type === 'AddOn' ? addOn?.id : type === 'Absence' ? absence?.id : timesheet?.id;
        if (id === '') {
            await POST(`timesheet-management-service/workflow`, JSON.stringify(data))
                .then(response => {
                    console.log('response', response, response?.data, type);
                    if (type === 'AddOn' || type === 'Absence') {
                        console.log('inside If', type);
                        updateWorkflow(response?.data, workFlowName, type);
                    } else {
                        handleContinue(response?.data)
                    }
                    SuccessToaster('Workflow Updated Successfully');
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
                    SuccessToaster('AddOn Request Workflow Updated Successfully');
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error');
                })
        } else {
            await PUT(`contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`, data)
                .then(response => {
                    SuccessToaster('Absence Request Workflow Updated Successfully');
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error');
                })
        }
    }

    const getSelectedUserDetails = (id) => {
        let user = users?.filter(user => user?.id === id)?.map(data => data)[0];
        return user;
    }


    const handleTimeSheetWorkFlow = (name, reviewer, approver, activeTab) => {
        let data = {};
        if (activeTab === 'requests') {
            data = {
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
                                "status": "REVIEWED"
                            }
                        },
                        "2": {
                            "workFlowUser": {
                                "id": approver,
                                "title": {
                                    "title": getSelectedUserDetails(approver)?.title?.title || '',
                                    "id": null,
                                },
                                "name": {
                                    "name": getSelectedUserDetails(approver)?.name?.firstName || '',
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

    const submit = async () => {
        if (activeTab === 'requests') {
            let addOnData = handleTimeSheetWorkFlow(`AddOn-${contractName}`, addOn.reviewer, addOn.approver, activeTab);
            let absenceData = handleTimeSheetWorkFlow(`Absence-${contractName}`, absence.reviewer, absence.approver, activeTab);
            await updateTimeSheetWorkflow(addOnData, `AddOn-${contractName}`, 'AddOn');
            await updateTimeSheetWorkflow(absenceData, `Absence-${contractName}`, 'Absence');
        } else {
            let data = handleTimeSheetWorkFlow(activeTab, timesheet?.reviewer, timesheet?.approver, activeTab);
            updateTimeSheetWorkflow(data, activeTab, 'Timesheet');
        }
    }

    const handleContinue = async (workflowId) => {

        let temp = timesheetProcessingWorkflow;
        temp?.push({
            "timesheetLabel": {
                "label": activeTab
            },
            "workFlowTemplate": {},
            "workFlowDescription": {},
            "workFlow": {
                "id": workflowId,
                "workFlowName": {
                    "name": activeTab
                }
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
        let id = timesheetFlow?.workFlowDetails?.filter(data => data?.workFlow?.workFlowName?.name === activeTab)?.map(data => data?.workFlow?.id)[0];
        if (timesheetFlow) {
            let workflowData = timesheetWorkFlow?.filter(data => data?.id === id)?.map(data => data?.workFlowMap?.workflow)[0];
            let workFlowValues = Object.values(workflowData);
            let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
            let approver = workFlowValues?.[1]?.workFlowUser?.id;
            setTimesheet({ ...timesheet, id: id, reviewer: reviewer, approver: approver });
        }
    };


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
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Timesheet Processing Workflow') }}>BACK</button>
                <div>
                    <button className={style.newContractOutlinedButton}
                        onClick={() => {
                            submit();
                        }
                        }
                    >SAVE IN-PROGRESS</button>
                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                        onClick={() => {
                            submit();
                            getViewPage9(true);
                            getCurrentPage('Request Processing Workflow')
                        }}
                    >CONTINUE</button>
                </div>
            </div>

        </div>
    )
}

export default RequestProcessingWorkflow;
