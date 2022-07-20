import React, {useState} from 'react';
import { TextArea, InputGroup, RadioGroup, Radio, Icon, Dialog, Classes, Intent } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToolBar from './toolbar';
import style from './index.module.scss';

const TimesheetProcessingWorkflow = ({getViewPage8, getCurrentPage, selectContractInfo}) => {
    const [applyWorkflowToAll, setApplyWorkflowToAll] = useState(true);
    const [viewWorkflowDialog, setViewWorkflowDialog] = useState(false);

    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.floatLeft} ${style.reduce10Left}`}>
                <button className={`${style.timesheetButtonStyle} ${style.selectedTimesheetButton}`}>Timesheet name 1</button>
                <button className={style.timesheetButtonStyle}>Timesheet name 2</button>
            </div>
            <div className={`${style.timeSheetBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Select Timesheet To Define Process*</div>
                    <div className={style.displayInRow}>
                        <InputGroup className={style.twoFieldWidth} placeholder="Timesheet name 1" />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Workflow Template To Use*</div>
                    <div className={style.twoCol}>
                        <div className={style.reduce10Left}>
                            <select
                                name="class"
                                id="Class"
                                className={`${style.fullWidth} ${style.marginLeft20} `}>
                                <option value="default saves template select" >
                                    default saves template select
                                </option>
                            </select>
                        </div>
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop15} ${style.marginLeft20}`}
                            selectedValue={"Custom Creation"}
                        >
                            <Radio label="Custom Creation" value="Custom Creation" checked />
                        </RadioGroup>
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
                                <InputGroup className={style.twoFieldWidth} placeholder="Workflow name 1" />
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Workflow Description</div>
                            <TextArea className={style.fullWidth} placeholder="Workflow Description" />
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
                <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { getViewPage8(true); getCurrentPage('Timesheet Processing Workflow') }}>CONTINUE</button>
            </div>
            <Dialog isOpen={viewWorkflowDialog} onClose={() => setViewWorkflowDialog(false)} className={`${style.toolbarDialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                    <div className={style.reduceTop10}>
                        <p className={style.extensionStyle}>View / Creat Workflow</p>
                        <p>Note: To Draw Arrow or Line, click on its element and draw on the screen.</p>
                        </div>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setViewWorkflowDialog(false)}  />
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