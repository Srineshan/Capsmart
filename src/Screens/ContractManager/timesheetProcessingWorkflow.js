import React, { useState, useEffect } from 'react';
import { TextArea, InputGroup, Icon, Dialog, Classes, Intent, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToolBar from './toolbar';
import {POST, GET, PUT} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ReviewerApproverField from './reviewerApproverField';

import style from './index.module.scss';

const TimesheetProcessingWorkflow = ({ getViewPage8, getCurrentPage, selectContractInfo, contractId }) => {
    const [applyWorkflowToAll, setApplyWorkflowToAll] = useState(true);
    const [viewWorkflowDialog, setViewWorkflowDialog] = useState(false);
    const [workflowName, setWorkflowName] = useState('');
    const [workflowDescription, setWorkflowDescription] = useState('');
    const [activeTab, setActiveTab] = useState('Timesheet name 1');
    const [selectTimesheetToDefineProcess, setSelectTimesheetToDefineProcess] = useState('');
    const [customWorkFlow, setCustomWorkFlow] = useState(false);
    const [workflowTemplateToUse, setWorkflowTemplateToUse] = useState('');
    const [timesheetProcessingWorkflow, setTimesheetProcessingWorkflow] = useState([]);
    const [reviewerApproverCount,setReviewerApproverCount] = useState();
    const [absenceRequestFields,setAbsenceRequestFields] = useState([]);
    const [addOnRequestFields, setAddOnRequestFields] = useState([]);
    const [timeSheetTabs, setTimeSheetTabs] = useState([]);
    const [timesheetWorkFlow, setTimeSheetWorkFlow] = useState([]);
    const [users,setUsers] = useState([]);
    const [workFlowList,setWorkFlowList] = useState([]);
    const [selectedTimeSheet,setSelectedTimeSheet] = useState({id:'',reviewer:'',approver:''})

    useEffect(()=>{
      getApproverReviewerFields();
    },[reviewerApproverCount])

    useEffect(()=>{
        setSelectTimesheetToDefineProcess(timesheetProcessingWorkflow[0]?.timesheetLabel?.label);
        setWorkflowTemplateToUse(timesheetProcessingWorkflow[0]?.workFlowTemplate?.name?.name);
        setWorkflowDescription(timesheetProcessingWorkflow[0]?.workFlowDescription?.value);
        setWorkflowName(timesheetProcessingWorkflow[0]?.workFlow?.workFlowName?.name);
        setCustomWorkFlow(timesheetProcessingWorkflow[0]?.customWorkFlow);
        setWorkFlowList(timesheetProcessingWorkflow?.map(data=>data?.workFlow?.id));
    },[timesheetProcessingWorkflow]);

    useEffect(()=>{
      console.log('active tab changes');
      if(timesheetWorkFlow?.filter(data=>workFlowList?.map(workflow=>workflow).includes(data?.id) && data?.name?.name === activeTab)?.map(data=>data)?.length !== 0){
        timesheetWorkFlow?.filter(data=>workFlowList?.map(data=>data).includes(data?.id) && data?.name?.name === activeTab)?.map(data=>{
          let workFlowValues = Object.values(data?.workFlowMap?.workflow);
          console.log('inside objects test',workFlowValues);
          let reveiwer = workFlowValues?.[0]?.workFlowUser?.id;
          let approver = workFlowValues?.[1]?.workFlowUser?.id;
          setSelectedTimeSheet({...selectedTimeSheet,id:data?.id, reviewer:reveiwer, approver:approver});
        })
      }else{
        resetApproverReviewer();
      }
    },[activeTab])

    useEffect(()=>{
      getUserData();
      getTimeSheetSubmissionTerms();
      getTimeSheetValues();
      getTimeSheetWorkFlow();
    },[])

    const getTimeSheetWorkFlow = async() => {
      const {data:timesheetWorkFlow} = await GET('timesheet-management-service/workflow');
      if(timesheetWorkFlow){
        setTimeSheetWorkFlow(timesheetWorkFlow);
      }
    }
    console.log('data',timesheetWorkFlow);
    const getUserData = async() => {
      const {data: user} = await GET('user-management-service/user');
      if(user){
        setUsers(user);
      }
    }

    const getTimeSheetValues = async() => {
      const {data: timesheetSubmissionTerms} = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
      setTimeSheetTabs(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data=>data.timesheetLabel?.label) || []);
      setActiveTab(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data=>data.timesheetLabel?.label)?.[0] || '')
    }


    const handleTimeSheetWorkFlow = async() => {
      let data =   {
          "name": {
            "name": activeTab
          },
          "workFlowMap": {
            "workflow": {
              "1": {
                "workFlowUser": {
                  "id": selectedTimeSheet?.reviewer
                },
                "workFlowStatus": {
                  "status": "REVIEWER"
                }
              },
              "2": {
                "workFlowUser": {
                  "id": selectedTimeSheet?.approver
                },
                "workFlowStatus": {
                  "status": "APPROVER"
                }
              }
            }
          }
        }
      console.log('data',data);
      if(selectedTimeSheet?.id === ''){
        await POST(`timesheet-management-service/workflow`, JSON.stringify(data))
         .then(response=>{
           console.log('response',response,response?.data);
           handleContinue(response?.data);
            SuccessToaster('Timesheet Processing Workflow Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error');
         })
      }else{
        await PUT(`timesheet-management-service/workflow/${selectedTimeSheet?.id}`, data)
         .then(response=>{
          SuccessToaster('Timesheet Processing Workflow Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error');
         })
      }
      getTimeSheetWorkFlow();
      getTimeSheetSubmissionTerms();
    }

    const handleContinue = async (workflowId) => {
    //     let data = {
    //       "workFlowDetails": [{
    //         "timesheetLabel": {
    //             "label": selectTimesheetToDefineProcess
    //         },
    //         "workFlowTemplate": {
    //             "id": "",
    //             "name": {
    //                 "name": workflowTemplateToUse
    //             }
    //         },
    //         "workFlowDescription": {
    //             "value": workflowDescription
    //         },
    //         "workFlow": {
    //             "id": "",
    //             "workFlowName": {
    //                 "name": workflowName
    //             }
    //         },
    //         "customWorkFlow": customWorkFlow
    //     }]
    // }

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
          let data = {"workFlowDetails":temp}
          await PUT(`contract-managment-service/contracts/${contractId}/timesheetProcessingWorkFlow`, data)
          .then(response=>{
                SuccessToaster('Timesheet Processing Workflow Updated Successfully');
            })
          .catch(error=>{
            ErrorToaster('Unexpected Error');
          })

    }

    const getTimeSheetSubmissionTerms = async() => {
        const {data: workFlowDetails} = await GET(`contract-managment-service/contracts/${contractId}/timesheetProcessingWorkFlow`);
        setTimesheetProcessingWorkflow(workFlowDetails?.workFlowDetails || []);
    };

    const getApproverReviewerFields = () => {
      let fields = [];
      let tabValue = activeTab === 'Absence Request' ? absenceRequestFields : addOnRequestFields;
      for(let i=0;i<reviewerApproverCount;i++){
        fields[i] = (
          <>
            <ReviewerApproverField data={users} label="Timesheet Reviewer*" onValueChange={(value)=>{console.log('value',value);setSelectedTimeSheet({...selectedTimeSheet, reviewer:value})}} selectLabel="Select Reviewer"/>
            <ReviewerApproverField data={users} label="Timesheet Approver*" onValueChange={(value)=>{console.log('value',value);setSelectedTimeSheet({...selectedTimeSheet, approver:value})}} selectLabel="Select Approver"/>
          </>
        )
      }
      if(activeTab === 'Absence Request'){
        setAbsenceRequestFields(fields);
      }else{
        setAddOnRequestFields(fields);
      }
    }

    const resetApproverReviewer = () => {
      setSelectedTimeSheet({...selectedTimeSheet,id:'', reviewer:0, approver:0})
    }


    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.floatLeft} ${style.reduce10Left} ${style.horizontalScroll} ${style.fullWidth}`}>
            {
              timeSheetTabs?.map(data=>(
                <button className={`${style.timesheetButtonStyle} ${activeTab === data && style.selectedTimesheetButton}`} onClick={() => setActiveTab(data)}>{data}</button>
              ))
            }
                <button className={`${style.timesheetButtonStyle} ${activeTab === "Absence Request" && style.selectedTimesheetButton}`} onClick={() => setActiveTab('Absence Request')}>Absence Request</button>
                <button className={`${style.timesheetButtonStyle} ${activeTab === "Add On Request" && style.selectedTimesheetButton}`} onClick={() => setActiveTab('Add On Request')}>Add On Request</button>
            </div>
            <div className={`${style.timeSheetBoxStyle}`}>
            {activeTab !== 'Absence Request' && activeTab !== 'Add On Request' ?
                <div>
                  <div className={`${style.extentionGrid}`}>
                      <div className={style.extentionLableStyle}>Select Timesheet To Define Process*</div>
                      <div className={style.displayInRow}>
                          <InputGroup className={style.twoFieldWidth} placeholder={activeTab}
                              value={activeTab} onChange={(e) => setSelectTimesheetToDefineProcess(e.target.value)} />
                      </div>
                  </div>
                  <ReviewerApproverField data={users?.filter(data=>data?.roles?.map(role=>role?.roleName).includes('Reviewer') && data?.id !== selectedTimeSheet?.approver)?.map(data=>data)} label="Timesheet Reviewer*" onValueChange={(value)=>{console.log('value',value);setSelectedTimeSheet({...selectedTimeSheet, reviewer:value})}} selectLabel="Select Reviewer" value={selectedTimeSheet?.reviewer || '0'}/>
                  <ReviewerApproverField data={users?.filter(data=>data?.roles?.map(role=>role?.roleName).includes('Approver') && data?.id !== selectedTimeSheet?.reviewer)?.map(data=>data)} label="Timesheet Approver*" onValueChange={(value)=>{console.log('value',value);setSelectedTimeSheet({...selectedTimeSheet, approver:value})}} selectLabel="Select Approver" value={selectedTimeSheet?.approver || '0'}/>
              </div>
              :<div>
              <div className={`${style.extentionGrid}`}>
                  <div className={style.extentionLableStyle}>Number of Approver/Reviewer*</div>
                  <div className={style.displayInRow}>
                      <InputGroup className={style.twoFieldWidth} placeholder="Approver/Reviewer Level" value={reviewerApproverCount} onChange={(e)=>setReviewerApproverCount(e.target.value)}/>
                  </div>
              </div>
              {absenceRequestFields}
              </div>
            }
            </div>
                {
                  /////        Do Not DELETE THIS CODE      ////////
              //     <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              //         <div className={style.extentionLableStyle}>Workflow Template To Use*</div>
              //         <div className={style.twoCol}>
              //             <div className={style.reduce10Left}>
              //                 <select
              //                     name="class"
              //                     id="Class"
              //                     value={workflowTemplateToUse}
              //                     onChange={(e) => setWorkflowTemplateToUse(e.target.value)}
              //                     className={`${style.fullWidth} ${style.marginLeft20} `}>
              //                     <option value="Template 1" >
              //                     Template 1
              //                     </option>
              //                     <option value="Template 2" >
              //                     Template 2
              //                     </option>
              //                 </select>
              //             </div>
              //             <Checkbox label="Custom Creation" className={`${style.marginTop10}`} checked={customWorkFlow} onChange={() => setCustomWorkFlow(!customWorkFlow)} />
              //         </div>
              //     </div>
              //     {selectContractInfo === "Multiple Contractor" && (
              //         <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              //             <div className={style.extentionLableStyle}>Apply Workflow To All Contractor*</div>
              //             <div className={style.displayInRow}>
              //                 <FormControlLabel
              //                     control={
              //                         <Switch checked={applyWorkflowToAll} className={` ${style.textAlignLeft} ${style.fourFieldWidth}`} onChange={() => setApplyWorkflowToAll(!applyWorkflowToAll)} />
              //                     }
              //                     className={`${style.switchFontStyle}`}
              //                     label={applyWorkflowToAll ? 'YES' : "NO"}
              //                 />
              //                 {!applyWorkflowToAll && (
              //                     <div className={`${style.displayInRow} ${style.fullWidth}`}>
              //                         <div className={style.threeFieldWidth}>
              //                             <select
              //                                 name="class"
              //                                 id="Class"
              //                                 className={`${style.fullWidth} `}>
              //                                 <option value="2" >
              //                                     2
              //                                 </option>
              //                             </select>
              //                         </div>
              //                         <div className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.fullWidth} ${style.marginTop15}`}>Workflow Template To Use*</div>
              //                     </div>
              //                 )}
              //             </div>
              //         </div>
              //     )}
              //     {applyWorkflowToAll && (
              //         <div className={style.fullWidth}>
              //             <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              //                 <div className={style.extentionLableStyle}>Workflow Name</div>
              //                 <div className={style.displayInRow}>
              //                     <InputGroup className={style.twoFieldWidth} placeholder="Enter Workflow name"
              //                         value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
              //                 </div>
              //             </div>
              //             <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              //                 <div className={style.extentionLableStyle}>Workflow Description</div>
              //                 <TextArea className={style.fullWidth} placeholder="Enter Workflow Description"
              //                     value={workflowDescription} onChange={(e) => setWorkflowDescription(e.target.value)} />
              //             </div>
              //             {/* <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
              //                             <ToolBar />
              //                         </div> */}
              //             <div className={`${style.floatRight} ${style.marginTop20}`}>
              //                 <button className={style.newContractOutlinedButton} onClick={() => setViewWorkflowDialog(true)}>View / Create Workflow</button>
              //             </div>
              //         </div>
              //     )}
              //     {!applyWorkflowToAll && (
              //         <div className={style.marginTop20}>
              //             <div className={`${style.floatLeft} ${style.reduce10Left} ${style.displayInRow}`}>
              //                 <div className={`${style.workFlowButtonStyle} ${style.selectedWorkFlowButton}`}>
              //                     Workflow em
              //                     <Icon icon="trash" size={10} color="#7165E3" />
              //                 </div>
              //                 <div className={style.workFlowButtonStyle}>
              //                     Workflow 2
              //                     <Icon icon="trash" size={10} color="#52575D" />
              //                 </div>
              //             </div>
              //             <div className={`${style.workflowBoxStyle}`}>
              //                 <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              //                     <div className={style.extentionLableStyle}>Workflow Variant 1</div>
              //                     <div className={style.displayInRow}>
              //                         <InputGroup className={style.twoFieldWidth} placeholder="Workflow em" />
              //                     </div>
              //                 </div>
              //                 <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              //                     <div className={style.extentionLableStyle}>Workflow Description</div>
              //                     <TextArea className={style.fullWidth} placeholder="Description" />
              //                 </div>
              //                 {/* <div className={`${style.flowChartBoxStyle} ${style.marginTop20}`}>
              //                                 <ToolBar />
              //                             </div> */}
              //                 <div className={`${style.floatRight} ${style.marginTop20}`}>
              //                     <button className={style.newContractOutlinedButton} onClick={() => setViewWorkflowDialog(true)}>View / Create Workflow</button>
              //                 </div>
              //             </div>
              //         </div>
              //     )}
              // </div>
                }

            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Timesheet Submission Terms')}}>BACK</button>
                <div>
                    <button className={style.newContractOutlinedButton}
                    onClick={() =>{
                        handleTimeSheetWorkFlow();
                        // handleContinue()
                    }
                    }
                    >SAVE IN-PROGRESS</button>
                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                    onClick={() => {
                      handleTimeSheetWorkFlow();
                      // handleContinue();
                      getViewPage8(true);
                       getCurrentPage('Timesheet Processing Workflow') }}
                       >CONTINUE</button>
                </div>
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
