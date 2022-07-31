import React, { useState, useEffect } from 'react';
import { TextArea, InputGroup, RadioGroup, Radio, Icon, Dialog, Classes, Intent, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToolBar from './toolbar';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const TimesheetProcessingWorkflow = ({ getViewPage8, getCurrentPage, selectContractInfo }) => {
    const contractId = 'e96eca5e-40cd-47b8-b1cc-c5cb4be9fdbf';
    const [applyWorkflowToAll, setApplyWorkflowToAll] = useState(true);
    const [viewWorkflowDialog, setViewWorkflowDialog] = useState(false);
    const [workflowName, setWorkflowName] = useState('');
    const [workflowDescription, setWorkflowDescription] = useState('');
    const [activeTimesheet, setActiveTimesheet] = useState('Timesheet name 1');
    const [selectTimesheetToDefineProcess, setSelectTimesheetToDefineProcess] = useState('');
    const [customWorkFlow, setCustomWorkFlow] = useState(false);
    const [workflowTemplateToUse, setWorkflowTemplateToUse] = useState('');
    const [timesheetProcessingWorkflow, setTimesheetProcessingWorkflow] = useState([]);
    console.log(timesheetProcessingWorkflow)
    const handleContinue = async () => {
        let data = {
          "workFlowDetails": [{
            "timesheetLabel": {
                "label": selectTimesheetToDefineProcess
            },
            "workFlowTemplate": {
                "id": "",
                "name": {
                    "name": workflowTemplateToUse
                }
            },
            "workFlowDescription": {
                "value": workflowDescription
            },
            "workFlow": {
                "id": "",
                "workFlowName": {
                    "name": workflowName
                }
            },
            "customWorkFlow": customWorkFlow
        }]
    }

        const response = await PUT(`contract-managment-service/contracts/${contractId}/timesheetProcessingWorkFlow`, JSON.stringify(data));
        if (response) {
            SuccessToaster('Timesheet Processing Workflow Updated Successfully');
        }
        else {
            ErrorToaster('Unexpected Error');
        }
        console.log(data)
    }

    const getTimeSheetSubmissionTerms = async() => {
        const {data: workFlowDetails} = await GET(`contract-managment-service/contracts/${contractId}/timesheetProcessingWorkFlow`);
        setTimesheetProcessingWorkflow(workFlowDetails?.workFlowDetails);
    };

    useEffect(()=>{
        setSelectTimesheetToDefineProcess(timesheetProcessingWorkflow[0]?.timesheetLabel?.label);
        setWorkflowTemplateToUse(timesheetProcessingWorkflow[0]?.workFlowTemplate?.name?.name);
        setWorkflowDescription(timesheetProcessingWorkflow[0]?.workFlowDescription?.value);
        setWorkflowName(timesheetProcessingWorkflow[0]?.workFlow?.workFlowName?.name);
        setCustomWorkFlow(timesheetProcessingWorkflow[0]?.customWorkFlow);
    },[timesheetProcessingWorkflow]);

    useEffect(()=>{
        getTimeSheetSubmissionTerms();
    },[])
    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.floatLeft} ${style.reduce10Left}`}>
                <button className={`${style.timesheetButtonStyle} ${activeTimesheet === "Timesheet name 1" && style.selectedTimesheetButton}`} onClick={() => setActiveTimesheet('Timesheet name 1')}>Timesheet name 1</button>
                <button className={`${style.timesheetButtonStyle} ${activeTimesheet === "Timesheet name 2" && style.selectedTimesheetButton}`} onClick={() => setActiveTimesheet('Timesheet name 2')}>Timesheet name 2</button>
            </div>
            <div className={`${style.timeSheetBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Select Timesheet To Define Process*</div>
                    <div className={style.displayInRow}>
                        <InputGroup className={style.twoFieldWidth} placeholder="Timesheet name 1"
                            value={selectTimesheetToDefineProcess} onChange={(e) => setSelectTimesheetToDefineProcess(e.target.value)} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Workflow Template To Use*</div>
                    <div className={style.twoCol}>
                        <div className={style.reduce10Left}>
                            <select
                                name="class"
                                id="Class"
                                value={workflowTemplateToUse}
                                onChange={(e) => setWorkflowTemplateToUse(e.target.value)}
                                className={`${style.fullWidth} ${style.marginLeft20} `}>
                                <option value="Template 1" >
                                Template 1
                                </option>
                                <option value="Template 2" >
                                Template 2
                                </option>
                            </select>
                        </div>
                        <Checkbox label="Custom Creation" className={`${style.marginTop10}`} checked={customWorkFlow} onChange={() => setCustomWorkFlow(!customWorkFlow)} />
                    </div>
                </div>
                {selectContractInfo === "Multiple Contractor" && (
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Apply Workflow To All Contractor*</div>
                        <div className={style.displayInRow}>
                            <FormControlLabel
                                control={
                                    <Switch checked={applyWorkflowToAll} className={` ${style.textAlignLeft} ${style.fourFieldWidth}`} onChange={() => setApplyWorkflowToAll(!applyWorkflowToAll)} />
                                }
                                className={`${style.switchFontStyle}`}
                                label={applyWorkflowToAll ? 'YES' : "NO"}
                            />
                            {!applyWorkflowToAll && (
                                <div className={`${style.displayInRow} ${style.fullWidth}`}>
                                    <div className={style.threeFieldWidth}>
                                        <select
                                            name="class"
                                            id="Class"
                                            className={`${style.fullWidth} `}>
                                            <option value="2" >
                                                2
                                            </option>
                                        </select>
                                    </div>
                                    <div className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.fullWidth} ${style.marginTop15}`}>Workflow Template To Use*</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {applyWorkflowToAll && (
                    <div className={style.fullWidth}>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Workflow Name</div>
                            <div className={style.displayInRow}>
                                <InputGroup className={style.twoFieldWidth} placeholder="Enter Workflow name"
                                    value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Workflow Description</div>
                            <TextArea className={style.fullWidth} placeholder="Enter Workflow Description"
                                value={workflowDescription} onChange={(e) => setWorkflowDescription(e.target.value)} />
                        </div>
                        {/* <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
                                        <ToolBar />
                                    </div> */}
                        <div className={`${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.newContractOutlinedButton} onClick={() => setViewWorkflowDialog(true)}>View / Create Workflow</button>
                        </div>
                    </div>
                )}
                {!applyWorkflowToAll && (
                    <div className={style.marginTop20}>
                        <div className={`${style.floatLeft} ${style.reduce10Left} ${style.displayInRow}`}>
                            <div className={`${style.workFlowButtonStyle} ${style.selectedWorkFlowButton}`}>
                                Workflow em
                                <Icon icon="trash" size={10} color="#7165E3" />
                            </div>
                            <div className={style.workFlowButtonStyle}>
                                Workflow 2
                                <Icon icon="trash" size={10} color="#52575D" />
                            </div>
                        </div>
                        <div className={`${style.workflowBoxStyle}`}>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Workflow Variant 1</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.twoFieldWidth} placeholder="Workflow em" />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Workflow Description</div>
                                <TextArea className={style.fullWidth} placeholder="Description" />
                            </div>
                            {/* <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
                                            <ToolBar />
                                        </div> */}
                            <div className={`${style.floatRight} ${style.marginTop20}`}>
                                <button className={style.newContractOutlinedButton} onClick={() => setViewWorkflowDialog(true)}>View / Create Workflow</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton} onClick={() => handleContinue()}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { getViewPage8(true); getCurrentPage('Timesheet Processing Workflow') }}>CONTINUE</button>
            </div>
            <Dialog isOpen={viewWorkflowDialog} onClose={() => setViewWorkflowDialog(false)} className={`${style.toolbarDialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <div className={style.reduceTop10}>
                            <p className={style.extensionStyle}>View / Creat Workflow</p>
                            <p>Note: To Draw Arrow or Line, click on its element and draw on the screen.</p>
                        </div>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setViewWorkflowDialog(false)} />
                    </div>
                    <div className={`${style.flowChartBoxStyle}`}>
                        <ToolBar />
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default TimesheetProcessingWorkflow;
