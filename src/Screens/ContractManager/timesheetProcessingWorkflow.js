import React, { useState, useEffect } from 'react';
import { TextArea, InputGroup, Icon, Dialog, Classes, Intent, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ToolBar from './toolbar';
import {POST, GET, PUT} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ReviewerApproverField from './reviewerApproverField';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';

import style from './index.module.scss';

const TimesheetProcessingWorkflow = ({ getViewPage9, getCurrentPage, selectContractInfo, contractId, contractName, isEditable }) => {
    const [timesheet, setTimesheet] = useState({id:'', reviewer:'', approver:''});
    const [workFlowList,setWorkFlowList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
        setCustomWorkFlow(timesheetProcessingWorkflow[0]?.customWorkFlow);
        setWorkFlowList(timesheetProcessingWorkflow?.map(data=>data?.workFlow?.id));
    },[timesheetProcessingWorkflow]);

    useEffect(()=>{
        setTimesheet({id:'',approver:'',reviewer:''});
        getTimeSheetSubmissionTerms();
        setTabIndex(timeSheetTabs?.indexOf(activeTab));
  },[activeTab])

    useEffect(()=>{
      getUserData();
      getTimeSheetValues();
      getTimeSheetWorkFlow();
    },[])

   useEffect(()=>{
     getTimeSheetSubmissionTerms();
   }, [timesheetWorkFlow])

    const refresh = () => {
      getTimeSheetWorkFlow();
    }

    const getUserData = async() => {
      const {data:userList} = await GET(`contract-managment-service/contracts/workFlowUser`)
      if(userList){
        setUsers(userList);
      }
    }

    const getTimeSheetWorkFlow = async() => {
      const {data:timesheetWorkFlow} = await GET('timesheet-management-service/workflow');
      if(timesheetWorkFlow){
        setTimeSheetWorkFlow(timesheetWorkFlow);
      }
    }

    const getTimeSheetValues = async() => {
      setIsLoading(true);
      const {data: timesheetSubmissionTerms} = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
      setTimeSheetTabs(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data=>data.timesheetLabel?.label) || []);
      setActiveTab(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data=>data.timesheetLabel?.label)?.[0] || '');
      setIsLoading(false);
    }

    const updateTimeSheetWorkflow = async(data, workFlowName, type) => {
      let id = timesheet?.id;
      if(id === ''){
        await POST(`timesheet-management-service/workflow`, JSON.stringify(data))
         .then(response=>{
           handleContinue(response?.data);
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

    if(isLoading){
      return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
    }


    return (
      <>
      {
        timeSheetTabs?.length !== 0 ?
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
                tabIndex < timeSheetTabs?.length-1 && isEditable &&
                <div>
                  <button className={`${style.timesheetNextButtonStyle} ${style.floatRight}`} onClick={()=> {submit();getNextTab();}}>NEXT</button>
                </div>
              }
            </div>
            {isEditable &&
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                  <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Payment & Compensation')}}>BACK</button>
                  <div>
                      <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                      onClick={() => {
                        submit();
                        getViewPage9(true);
                         getCurrentPage('Request Processing Workflow') }}
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
        <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Timesheet Submission Terms'} title={'NO TIMESHEET FOUND'} description={'No Timesheet Is Found.'} buttonText={'ADD TIMESHEET'}/>
      }
      </>
    )
}

export default TimesheetProcessingWorkflow;
