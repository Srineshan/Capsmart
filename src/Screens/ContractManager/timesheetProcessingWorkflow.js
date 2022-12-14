import React, { useState, useEffect } from 'react';
import { TextArea, InputGroup, Icon, Dialog, Classes, Intent, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToolBar from './toolbar';
import {POST, GET, PUT} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ReviewerApproverField from './reviewerApproverField';

import style from './index.module.scss';

const TimesheetProcessingWorkflow = ({ getViewPage9, getCurrentPage, selectContractInfo, contractId, contractName }) => {
    const [addOn, setAddOn] = useState({id:'', reviewer:'', approver:''});
    const [absence, setAbsence] = useState({id:'', reviewer:'', approver:''});
    const [timesheet, setTimesheet] = useState({id:'', reviewer:'', approver:''});
    const [workFlowList,setWorkFlowList] = useState([]);
    // const [applyWorkflowToAll, setApplyWorkflowToAll] = useState(true);
    // const [viewWorkflowDialog, setViewWorkflowDialog] = useState(false);
    // const [workflowName, setWorkflowName] = useState('');
    // const [workflowDescription, setWorkflowDescription] = useState('');
    const [activeTab, setActiveTab] = useState('');
    const [selectTimesheetToDefineProcess, setSelectTimesheetToDefineProcess] = useState('');
    const [customWorkFlow, setCustomWorkFlow] = useState(false);
    const [workflowTemplateToUse, setWorkflowTemplateToUse] = useState('');
    const [timesheetProcessingWorkflow, setTimesheetProcessingWorkflow] = useState([]);
    const [timeSheetTabs, setTimeSheetTabs] = useState([]);
    const [timesheetWorkFlow, setTimeSheetWorkFlow] = useState([]);
    const [users,setUsers] = useState([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedTimeSheet,setSelectedTimeSheet] = useState({id:'',reviewer:'',approver:''});

    useEffect(()=>{
        setSelectTimesheetToDefineProcess(timesheetProcessingWorkflow[0]?.timesheetLabel?.label);
        setWorkflowTemplateToUse(timesheetProcessingWorkflow[0]?.workFlowTemplate?.name?.name);
        // setWorkflowDescription(timesheetProcessingWorkflow[0]?.workFlowDescription?.value);
        // setWorkflowName(timesheetProcessingWorkflow[0]?.workFlow?.workFlowName?.name);
        setCustomWorkFlow(timesheetProcessingWorkflow[0]?.customWorkFlow);
        setWorkFlowList(timesheetProcessingWorkflow?.map(data=>data?.workFlow?.id));
    },[timesheetProcessingWorkflow]);

    useEffect(()=>{
      if(activeTab === 'requests'){
        getAddOnRequestWorkFlow();
        getAbsenceRequestWorkFlow();
      }else{
        setTimesheet({id:'',approver:'',reviewer:''});
        getTimeSheetSubmissionTerms();
    }
    setTabIndex(timeSheetTabs?.indexOf(activeTab));
  },[activeTab])

    useEffect(()=>{
      getUserData();
      getTimeSheetValues();
      getTimeSheetWorkFlow();
    },[])

   useEffect(()=>{
     getAddOnRequestWorkFlow();
     getAbsenceRequestWorkFlow();
     getTimeSheetSubmissionTerms();
   }, [timesheetWorkFlow])

    const refresh = () => {
      getTimeSheetWorkFlow();
    }

    console.log('timesheet', timesheet, users);
    const getUserData = async() => {
      const {data:userList} = await GET(`contract-managment-service/contracts/workFlowUser`)
      if(userList){
        setUsers(userList);
        console.log('userData',userList);
      }
    }

    const getTimeSheetWorkFlow = async() => {
      const {data:timesheetWorkFlow} = await GET('timesheet-management-service/workflow');
      if(timesheetWorkFlow){
        setTimeSheetWorkFlow(timesheetWorkFlow);
      }
    }

    const getAddOnRequestWorkFlow = async() => {
      const {data:addOnWorkflow} = await GET(`contract-managment-service/contracts/${contractId}/addOnRequestWorkFlow`);
      if(addOnWorkflow){
        let workflowData = timesheetWorkFlow?.filter(data=>data?.id === addOnWorkflow?.workFlow?.id)?.map(data=>data?.workFlowMap?.workflow)[0];
        let workFlowValues = Object.values(workflowData);
        let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
        let approver = workFlowValues?.[1]?.workFlowUser?.id;
        setAddOn({...addOn, id:addOnWorkflow?.workFlow?.id, reviewer: reviewer, approver: approver});
      }
    }

    const getAbsenceRequestWorkFlow = async() => {
      const {data:absenceWorkFlow} = await GET(`contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`);
      if(absenceWorkFlow){
        let workflowData = timesheetWorkFlow?.filter(data=>data?.id === absenceWorkFlow?.workFlow?.id)?.map(data=>data?.workFlowMap?.workflow)[0];
        let workFlowValues = Object.values(workflowData);
        let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
        let approver = workFlowValues?.[1]?.workFlowUser?.id;
        setAbsence({...absence, id:absenceWorkFlow?.workFlow?.id, reviewer: reviewer, approver: approver});
      }
    }

    const getTimeSheetValues = async() => {
      const {data: timesheetSubmissionTerms} = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
      setTimeSheetTabs(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data=>data.timesheetLabel?.label) || []);
      setActiveTab(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data=>data.timesheetLabel?.label)?.[0] || '')
    }

    const updateTimeSheetWorkflow = async(data, workFlowName, type) => {
      let id = timesheet?.id;
      if(id === ''){
        await POST(`timesheet-management-service/workflow`, JSON.stringify(data))
         .then(response=>{
           handleContinue(response?.data)
           SuccessToaster('Workflow Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error');
         })
      }
      else{
          await PUT(`timesheet-management-service/workflow/${id}`, data)
           .then(response=>{
            SuccessToaster('Workflow Updated Successfully');
           })
           .catch(error=>{
             ErrorToaster('Unexpected Error');
           })
     }
     refresh();
    }

    const updateWorkflow = async(workflowId, workFlowName, type) => {
      let data = {
        "workFlow": {
          "id": workflowId,
          "workFlowName": {
            "name": workFlowName,
          }
        }
      }
      if(type === 'AddOn'){
        await PUT(`contract-managment-service/contracts/${contractId}/addOnRequestWorkFlow`, data)
         .then(response=>{
          SuccessToaster('AddOn Request Workflow Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error');
         })
       }else{
         await PUT(`contract-managment-service/contracts/${contractId}/absenceRequestWorkFlow`, data)
          .then(response=>{
           SuccessToaster('Absence Request Workflow Updated Successfully');
          })
          .catch(error=>{
            ErrorToaster('Unexpected Error');
          })
      }
    }

    const getSelectedUserDetails = (id) => {
      let user = users?.filter(user=>user?.userId === id)?.map(data=>data)[0];
      return user;
    }


    const handleTimeSheetWorkFlow = (name, reviewer, approver, activeTab) => {
      let data;
      if(reviewer === approver){
        data = {
          "name": {
            "name": name
          },
          "workFlowMap": {
            "workflow": {
              "1": {
                "workFlowUser": {
                  "id": reviewer,
                  "title":{
                    "title":getSelectedUserDetails(reviewer)?.title?.title || '',
                    "id":null,
                  },
                  "name":{
                    "name":getSelectedUserDetails(reviewer)?.name?.firstName || '',
                  },
                  "suffix":{
                    "id":getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                    "suffix":getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
                  }
                },
                "workFlowStatus": {
                  "status": "APPROVED"
                }
              }}}}
      }else{
        data = {
          "name": {
            "name": name
          },
          "workFlowMap": {
            "workflow": {
              "1": {
                "workFlowUser": {
                  "id": reviewer,
                  "title":{
                    "title":getSelectedUserDetails(reviewer)?.title?.title || '',
                    "id":null,
                  },
                  "name":{
                    "name":getSelectedUserDetails(reviewer)?.name?.firstName || '',
                  },
                  "suffix":{
                    "id":getSelectedUserDetails(reviewer)?.name?.suffix?.id || '',
                    "suffix":getSelectedUserDetails(reviewer)?.name?.suffix?.suffix || '',
                  }
                },
                "workFlowStatus": {
                  "status": "REVIEWED"
                }
              },
              "2": {
                "workFlowUser": {
                  "id": approver,
                  "title":{
                    "title":getSelectedUserDetails(approver)?.title?.title || '',
                    "id":null,
                  },
                  "name":{
                    "name":getSelectedUserDetails(approver)?.name?.firstName || '',
                  },
                  "suffix":{
                    "id":getSelectedUserDetails(approver)?.name?.suffix?.id || '',
                    "suffix":getSelectedUserDetails(approver)?.name?.suffix?.suffix || '',
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

    const submit = async() => {
        let data = handleTimeSheetWorkFlow(activeTab, timesheet?.reviewer, timesheet?.approver, activeTab );
        updateTimeSheetWorkflow(data, activeTab, 'Timesheet');
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
        const {data: timesheetFlow} = await GET(`contract-managment-service/contracts/${contractId}/timesheetProcessingWorkFlow`);
        let id = timesheetFlow?.workFlowDetails?.filter(data=>data?.workFlow?.workFlowName?.name === activeTab)?.map(data=>data?.workFlow?.id)[0];
        if(timesheetFlow){
          let workflowData = timesheetWorkFlow?.filter(data=>data?.id === id)?.map(data=>data?.workFlowMap?.workflow)[0];
          let workFlowValues = Object.values(workflowData);
          if(workFlowValues?.length === 1){
            let approver = workFlowValues?.[0]?.workFlowUser?.id;
            setTimesheet({...timesheet, id:id, reviewer: approver, approver: approver});
          }else{
            let reviewer = workFlowValues?.[0]?.workFlowUser?.id;
            let approver = workFlowValues?.[1]?.workFlowUser?.id;
            setTimesheet({...timesheet, id:id, reviewer: reviewer, approver: approver});
          }

        }
    };

    const getNextTab = () => {
      let tabIndexValue = timeSheetTabs?.indexOf(activeTab);
      setActiveTab(timeSheetTabs[tabIndexValue+1]);
      setTabIndex(tabIndexValue+1);
    }


    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.flexLeft} ${style.reduce10Left} ${style.horizontalScroll} ${style.fullWidth}`}>
            {
              timeSheetTabs?.map(data=>(
                <button className={`${style.timesheetButtonStyle} ${activeTab === data && style.selectedTimesheetButton}`} onClick={() => setActiveTab(data)}>{data}</button>
              ))
            }
            </div>
            <div className={`${style.timeSheetBoxStyle} ${style.verticalSpaceBetween}`}>
              <div>
                  <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Timesheet To Define Process*</div>
                    <div className={style.displayInRow}>
                      <InputGroup className={style.fullWidth} placeholder={activeTab}
                        value={activeTab} readOnly />
                    </div>
                  </div>
                  <ReviewerApproverField data={users} label="Timesheet Reviewer*" onValueChange={(value)=>{setTimesheet({...timesheet, reviewer:value})}} selectLabel="Select Reviewer" value={timesheet?.reviewer || '0'}/>
                  <ReviewerApproverField data={users} label="Timesheet Approver*" onValueChange={(value)=>{setTimesheet({...timesheet, approver:value})}} selectLabel="Select Approver" value={timesheet?.approver || '0'}/>
              </div>
              {
                tabIndex < timeSheetTabs?.length-1 &&
                <div>
                  <button className={`${style.timesheetNextButtonStyle} ${style.floatRight}`} onClick={()=> {submit();getNextTab();}}>NEXT</button>
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
                {
                  // <button className={style.newContractOutlinedButton}
                  // onClick={() =>{
                  //   submit();
                  // }
                  // }
                  // >SAVE IN-PROGRESS</button>
                }

                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                    onClick={() => {
                      submit();
                      getViewPage9(true);
                       getCurrentPage('Request Processing Workflow') }}
                       >CONTINUE</button>
                </div>
            </div>
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
    )
}

export default TimesheetProcessingWorkflow;
