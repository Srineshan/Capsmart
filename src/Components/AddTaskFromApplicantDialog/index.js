import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CommonTextField from "../CommonFields/CommonTextField";
import CommonDateField from "../CommonFields/CommonDateField";
import CommonSelectField from '../CommonFields/CommonSelectField';
import CryptoJS from 'crypto-js';
import { format ,sub,add} from 'date-fns';
import TextField from "@mui/material/TextField";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SuccessToaster,ErrorToaster } from "../../utils/toaster";
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";

const AddtaskDialog = ({ getIsOpen }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userSelectSubject, setUserSelectSubject] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMeetingType, setSelectedMeetingType] = useState('');
  const id = sessionStorage.getItem("applicationId");
  const [calendarStart, setCalendarStart] = useState(false);
  const [selectedDateForTask, setSelectedDateForTask] = useState(null);
  const [selectedTimeForTask, setSelectedTimeForTask] = useState(null);
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
   const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [applicationType, setApplicationType] = useState(() => 
      sessionStorage.getItem('applicationCreationType') || 'NEW'
    );
  const [logDetails, setLogDetails] = useState([]);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
  }, [applicationType]);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
  }, []);

    useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

    const getLog = async () => {
        const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
        setLogDetails(basicLog);
        console.log("basicLog" +JSON.stringify(basicLog));
        
      };

  const getApplication = async () => {
    try {
      setIsLoadingImage(true);
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
      setIsLoadingImage(false);
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };


  useEffect(() => {
    checkApproveEnabled();
  }, [userSelectSubject,userRoleComments, selectedDateForTask, selectedTimeForTask,selectedPriority,selectedCategory, selectedMeetingType]);

  const checkApproveEnabled = () => {
    const hasValidSubject = userSelectSubject !== '';
    const hasValidComments = userRoleComments.trim() !== '';
    const hasValidDate = selectedDateForTask !== null ; 
    const hasValidTime = selectedTimeForTask !== null ; 
    const hasValidMemberDept = selectedMeetingType !== '';
    const hasValidPriority = selectedPriority !== '';
    const hasValidCategory = selectedCategory !== '';
    
      setIsApproveEnabled(hasValidSubject && hasValidComments && hasValidTime &&  hasValidMemberDept  && hasValidDate && hasValidPriority && hasValidCategory);

  };

  const onClose = () => {
    getIsOpen(false);
  };

//   const handleDateChange = (date, field) => {
//     const formattedDate = date
//     ? format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'")
//     : format(new Date(date), 'yyyy-MM-dd');

//       setSelectedDateForTask(formattedDate);
//       setSelectedTimeForTask(formattedDate);
//       setCalendarStart(false);
   
//   };

  const handleDateChange = (date, field) => {
      const formattedDate = date
        ? format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'")
        : format(new Date(date), 'yyyy-MM-dd');
  
  
      if (field === 'date') {
        setSelectedDateForTask(formattedDate);
      } else if (field === 'time') {
        setSelectedTimeForTask(formattedDate);
      }
      setCalendarStart(false);
  
    };
  return (
    <>
    {isLoadingImageDocs && (
         <div
           className={`${style.loadingOverlay}`}
         >
           <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
         </div>
       )}
    {isLoadingImage && (
        <div  className={style.loadingOverlay}>
          <LoadingScreen/>
        </div>
       )}
   
    {!isLoadingImage && (
        <div className={`${style.taskBoardShadow}`}>
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={Classes.DIALOG_BODY}>
          <div className={`${style.spaceBetween} ${style.marginBottom10}`}>
            <div className={`${style.heading}`}>
              Create Task
            </div>
            <div className={style.displayInRow}>
              <img
                src={CrossPink}
                alt="cross"
                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                onClick={() => {
                  getIsOpen(false);
                }}
              />
            </div>
          </div>
          <div className={`${style.pagebreak}`}>
          {/* <div className={`${style.marginTop5} ${style.commentsNotesHeadingFontStyle}`}>
                Task Title
                </div> */}
              <CommonTextField
                className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle}`}
                value={userSelectSubject}
                onChange={(e) => setUserSelectSubject(e.target.value)}
                placeholder="Enter Task Title Here"
                label={"Task Title*"}
              />
              <div className={`${style.marginTop10} ${style.lableStyle}`}>
                Task Description*
                </div>
              <div className={`${style.marginTop10}`}>
              <CKEditor
                editor={ClassicEditor}
                data={userRoleComments}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setUserRoleComments(data);
                }}
                config={{
                  placeholder: "Enter Description",
                  toolbar: {
                    shouldNotGroupWhenFull: true,
                    sticky: true,
                    items: [
                      'undo', 'redo',
                      '|',
                      'heading',
                      '|',
                      'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                      '|',
                      'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                      '|',
                      'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                  ],
                  },
                  autoGrow: false,
                }}
                onReady={(editor) => {
                  editor.editing.view.change((writer) => {
                    writer.setStyle(
                      "height",
                      "100px",
                      editor.editing.view.document.getRoot()
                    );
                  });
                }}
              />
            </div>
            <div  className={`${style.twoColumnGrid} ${style.marginTop10}`}>
                <div className={`${style.twoColumnGrid}`}>
                <div>
              <CommonDateField
                className={style.fullWidth}
                onChange={(date) => handleDateChange(date,'date')}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={add(new Date(), { days: 1 })}
                maxDate={add(new Date(), { years: 3 })}
                value={selectedDateForTask}
                label="Task Date*"
                 InputProps={{
                  style: {
                      fontSize: 14,
                      height: 34,
                  },
              }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'Start Date',
                      readOnly: true
                    }}
                    variant="outlined"
                    margin="normal"
                    
                    // fullWidth
                  />
                )}
              />
              </div>
              <div>
              <CommonDateField
                className={style.fullWidth}
                onChange={(date) => handleDateChange(date,'time')}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={add(new Date(), { days: 1 })}
                maxDate={add(new Date(), { years: 3 })}
                value={selectedTimeForTask}
                label="Task Time*"
                 InputProps={{
                  style: {
                      fontSize: 14,
                      height: 34,
                  },
              }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'Start Date',
                      readOnly: true
                    }}
                    variant="outlined"
                    margin="normal"
                    
                    // fullWidth
                  />
                )}
              />
              </div>
            </div>
            <div>
            <CommonSelectField
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className={style.fullWidth1}
                  firstOptionLabel={'Select Priority'}
                  firstOptionValue={''}
                  valueList={["Low", "Medium", "High"]}
                  labelList={["Low", "Medium", "High"]}
                  disabledList={false}
                  required={false}
                  label={"Select Priority*"}
                />
              </div>
            </div>
            <div  className={`${style.twoColumnGrid} ${style.marginTop10}`}>
            <div>
            <CommonSelectField
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={style.fullWidth1}
                  firstOptionLabel={'Select Category'}
                  firstOptionValue={''}
                  valueList={["Staff Meeting", "HOD Meeting", "CC Meeting"]}
                  labelList={["Staff Meeting", "HOD Meeting", "CC Meeting"]}
                  disabledList={false}
                  required={false}
                  label={"Select Category*"}
                />
              </div>
              <div>
              <CommonSelectField
                  value={selectedMeetingType}
                  onChange={(e) => setSelectedMeetingType(e.target.value)}
                  className={style.fullWidth1}
                  firstOptionLabel={'Select Staff Meeting Type'}
                  firstOptionValue={''}
                  valueList={["Social", "In-Person", "Mail"]}
                  labelList={["Social", "In-Person", "Mail"]}
                  disabledList={false}
                  required={false}
                  label={"Staff Meeting Type*"}
                />
              </div>
            </div>
            <div
            className={`${style.reviewButtonStyle} ${style.marginTop} ${isApproveEnabled ? undefined : style.cursorPointer} ${style.marginLeft}`}
            // onClick={onClickApproveMoveFunction}
            style={{ 
              pointerEvents: isApproveEnabled ? 'auto' : 'none', 
              opacity: isApproveEnabled ? 1 : 0.5 
            }}
          >
            <div className={style.reviewButton}>Save</div>
          </div>
          </div>
        </div>
      </div>
    </Dialog>
    </div>
    )}
</>
  );
};

export default AddtaskDialog;
