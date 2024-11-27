import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CommonTextField from "../CommonFields/CommonTextField";
import CommonDateField from "../CommonFields/CommonDateField";
import CommonSelectField from '../CommonFields/CommonSelectField';
import ESignature from "../ESignature";
import CryptoJS from 'crypto-js';
import { format ,sub} from 'date-fns';
import TextField from "@mui/material/TextField";

const ApprovalWithNotesDialog = ({ getIsOpen, dateFormat }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [isChecked, setIsChecked] = useState({ isChecked1: false, isChecked2: false, isChecked3: false });
  // const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const componentRef = useRef(null);
  const [isSigned, setIsSigned] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [dateTime] = useState(new Date().toISOString());
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState('');
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [name, setName] = useState('')
   const [applicantType, setApplicantType] = useState([]);
    const [selectedApplicantType, setSelectedApplicantType] = useState('');
    const [calendarStart, setCalendarStart] = useState(false);
    const [selectedDateForDept, setSelectedDateForDept] = useState(null);

    const isApproveEnabled = 
    userRoleComments.trim() !== '' && 
    selectedDateForDept !== null && 
    selectedApplicantType !== '';

  // useEffect(() => {
  //   if (dateFormat) {
  //     setCurrentDate(format(new Date(), dateFormat));
  //   }
  // }, [dateFormat]);

  const onClicksignFunction = () => {
    setTodayDate();
    handleSignatureClick();
  };
  
  useEffect(() => {
    getApplicantType();
}, [])


  const setTodayDate = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  };

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
  }, []);

  useEffect(() => {
    setIsCheckedSign(formDetails?.forms?.[19]?.acknowledged || true);
    setIsSigned(
      formDetails?.forms?.[19]?.esign?.esign !== undefined && 
      formDetails?.forms?.[19]?.acknowledged
    );
  }, [formDetails]);

  useEffect(() => {
    if (name && dateTime) {
      setEncryptedText(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    }
  }, [name, dateTime, publicKey]);

  // useEffect(() => {
  //   checkApproveEnabled();
  // }, [isChecked, userRoleComments, isSigned]);

  const getApplicantType = async () => {
    const { data: applicant } = await GET(
        `entity-service/applicantType`
    );
    setApplicantType(applicant);
  }
  

    useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
    setName(`${userData?.name?.firstName} ${userData?.name?.lastName}`);
  }

  const getApplication = async () => {
    try {
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const checkRequirements = () => {
    return userRole.includes('Chief Of Staff')
      ? isChecked.isChecked1
      : (isChecked.isChecked2 && isChecked.isChecked3);
  };

  const handleSignatureClick = () => {
     {
      setIsSigned(!isSigned);
      setIsEdited(true);
    }
  };

  // const checkApproveEnabled = () => {
  //   const hasValidComments = userRoleComments.trim() !== '';

 
  //     setIsApproveEnabled(isChecked.isChecked1 && hasValidComments);
 
  // };

  const handleApplicationApprove = async () => {
    try {
      const payload = {
        role: Array.isArray(userRole) ? userRole[0] : userRole,
        notes: userRoleComments,
      };

      await PUT(
        `application-management-service/application/${id}/workflow/complete/APPROVED?isDelegate=true`,
        payload
      );
      
      await getApplication();
      getIsOpen(false);
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleDateChange = (date, field) => {
    const formattedDate = date
    ? format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    : format(new Date(date), 'yyyy-MM-dd');

      setSelectedDateForDept(formattedDate);
  
  
    setCalendarStart(false);
    // setIsButtonDisabled(false); 
   
  };

const handleCheckboxChange = (checkboxName) => (event) => {
    const newIsChecked = {
      ...isChecked,
      [checkboxName]: event.target.checked,
    };
    setIsChecked(newIsChecked);
  };

  const dynamicValues = {
    ApplicantName: `${formDetails?.basicDetails?.applicant?.name?.firstName || ''} ${formDetails?.basicDetails?.applicant?.name?.lastName || ''}`,
    EntityName: "Cambridge memorial Hospital",
  };

  const formatLabel = (template, values) =>
    template.replace(/{(.*?)}/g, (_, key) => values[key] || '');

  if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Chief Of Staff')) {
    return null;
  }

  return (
  
    
    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={Classes.DIALOG_BODY}>
          <div className={style.spaceBetween}>
            <div className={`${style.heading}`}>
              SEND TO DEPARTMENT HEAD FOR REVIEW?
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
          <div ref={componentRef} className={`${style.pagebreak}`}>
            <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
              Provide notes, if any, for the Department Head
            </div>
              <CommonTextField
                className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle}`}
                value={userRoleComments}
                onChange={(e) => setUserRoleComments(e.target.value)}
                placeholder="Enter comments and notes here"
              />
              <div className={`${style.twoColumnGrid}`}>
              <div>
             <div className={`${style.marginTop10}`}>
                <div className={`${style.filterType}`}>
                Upcoming Credentialing Committee Meeting Date
                </div>
                {/* <CommonDateField
                              className={style.dateWidth}
                              onChange={(date) => handleDateChange(date, 'MAC')}
                              open={calendarStart}
                              onOpen={() => setCalendarStart(true)}
                              onClose={() => setCalendarStart(false)}
                              minDate={sub(new Date(), { years: 3 })}
                              maxDate={new Date()}
                              value={selectedDateForDept}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    placeholder: 'Start Date',
                                  }}
                                  variant="outlined"
                                  margin="normal"
                                  fullWidth
                                />
                              )}
                            /> */}
              </div>
              
            </div>
            <div>
             <div className={`${style.marginTop10}`}>
            <div className={`${style.filterType}`}>
            Review Priority
            </div>
            {/* <CommonSelectField
                value={selectedApplicantType}
                onChange={(e) => setSelectedApplicantType(e.target.value)}
                className={style.fullWidth}
                // firstOptionLabel={''}
                // firstOptionValue={''}
                valueList={applicantType?.map(data => data?.id)}
                labelList={applicantType?.map(data => data?.applicantType)}
                disabledList={applicantType?.map(data => false)}
                required={false}
            /> */}
                  </div>
            </div>
            </div>
            <div className={`${style.twoColumnGrid}`}>
              <div>
                                <CommonDateField
                              className={style.dateWidth}
                              onChange={(date) => handleDateChange(date, 'MAC')}
                              open={calendarStart}
                              onOpen={() => setCalendarStart(true)}
                              onClose={() => setCalendarStart(false)}
                              minDate={sub(new Date(), { years: 3 })}
                              maxDate={new Date()}
                              value={selectedDateForDept}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    placeholder: 'Start Date',
                                  }}
                                  variant="outlined"
                                  margin="normal"
                                  fullWidth
                                />
                              )}
                            />
              </div>
              <div>
                  <CommonSelectField
                value={selectedApplicantType}
                onChange={(e) => setSelectedApplicantType(e.target.value)}
                className={style.fullWidth}
                // firstOptionLabel={''}
                // firstOptionValue={''}
                valueList={applicantType?.map(data => data?.id)}
                labelList={applicantType?.map(data => data?.applicantType)}
                disabledList={applicantType?.map(data => false)}
                required={false}
            />
              </div>
              </div>
            <div className={`${style.marginTop} ${style.reviewButtonContainer}`}>
            <div  onClick={() => getIsOpen(false)}>
              <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div>
            </div>
            <div
            className={`${style.reviewButtonStyle} ${style.cursorPointer} ${style.marginLeft}`}
            onClick={handleApplicationApprove}
            style={{ 
              pointerEvents: isApproveEnabled ? 'auto' : 'none', 
              opacity: isApproveEnabled ? 1 : 0.5 
            }}
          >
            <div className={style.reviewButton}>APPROVE</div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
    
  );
};

export default ApprovalWithNotesDialog;
