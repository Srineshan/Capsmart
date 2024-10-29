import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CommonTextField from "../CommonFields/CommonTextField";
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import ESignature from "../ESignature";
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';

const ApprovalWithNotesDialog = ({ getIsOpen, dateFormat }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [isChecked, setIsChecked] = useState({ isChecked1: false, isChecked2: false, isChecked3: false });
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
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
  
  // useEffect(() => {
  //   if (dateFormat) {
  //     setCurrentDate(format(new Date(), dateFormat));
  //   }
  // }, [dateFormat]);

  const onClicksignFunction = () => {
    setTodayDate();
    handleSignatureClick();
  };
  

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

  useEffect(() => {
    checkApproveEnabled();
  }, [isChecked, userRoleComments, isSigned]);

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

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';
    const hasValidSignature = formDetails?.esignatureRequired ? isSigned : true;

    if (userRole.includes('Chief Of Staff')) {
      setIsApproveEnabled(isChecked.isChecked1 && hasValidComments && hasValidSignature);
    } else if (userRole.includes('Credentialing Committee')) {
      setIsApproveEnabled(isChecked.isChecked2 && isChecked.isChecked3 && hasValidComments && hasValidSignature);
    }
  };

  const handleApplicationApprove = async () => {
    try {
      const payload = {
        role: userRole,
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
              {userRole} Review & Approval
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
            <div className={`${style.cardStyle} ${style.marginTop10}`}>
              <div className={`${style.namefontstyle} ${style.marginTop10}`}>
                {formDetails?.basicDetails?.applicant?.name?.firstName
                  ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                  : ""}{", "}
                {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{" "}
                <span className={`${style.displayIdFontStyle}`}>{formDetails?.displayId}</span>
              </div>
              <div className={`${style.applicantTypeFontStyle}`}>
                {formDetails?.providerType?.category}
              </div>
              <div className={`${style.grid}`}>
                <div>
                  <div>Department:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.department}</span></div>
                  <div>Speciality:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty}</span></div>
                </div>
                <div>
                  <div>Staff Manager:<span className={`${style.rightSideFontStyle}`}>{formDetails?.createdBy?.name?.firstName}{""}{formDetails?.createdBy?.name?.lastName}</span></div>
                  <div>Site Name:<span className={`${style.rightSideFontStyle}`}>Only If Multisite</span></div>
                </div>
              </div>
            </div>
            <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
              Notes From {userRole} for Consideration
            </div>
            {/* <div className={`${style.notesBorderStyle}`}>
              <div className={`${style.commentsNotesFontStyle}`}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam minima facere vitae fugiat aspernatur amet ab sequi nam doloribus quaerat exercitationem ducimus nostrum illo consectetur vel possimus molestias explicabo iusto iste officia est repudiandae, eum autem aut! Odio quia accusantium eum dignissimos, molestias delectus consequatur voluptatibus cum, quod animi voluptatum vero nemo blanditiis consequuntur tempora. Ipsa nihil hic earum voluptates nostrum. Facilis aspernatur rerum at voluptatum deleniti nam culpa praesentium sunt architecto, ducimus debitis impedit neque ad sapiente fugiat veniam molestiae doloremque quae natus, sequi soluta! Porro sapiente ex inventore voluptatem ea recusandae rerum doloribus qui id possimus, iure odit?
              </div>
            </div> */}
              {/* <div className={`${style.notesBorderStyle}`}> */}
              <CommonTextField
                className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle}`}
                value={userRoleComments}
                onChange={(e) => setUserRoleComments(e.target.value)}
                placeholder="Enter comments and notes here"
              />
            {/* </div> */}
            {userRole.includes('Chief Of Staff') && (
                <CommonCheckBox
              className={`${style.marginTop}`}
              label={formatLabel("I as the chief of staff approves the appointment of {ApplicantName} as per the criteria and standards established by {EntityName}’s bylaws and policies. This approval is contingent upon the fulfillment of all required qualifications and obligations as outlined in the medical staff bylaws.",dynamicValues)}
              checked={isChecked.isChecked1}
              onChange={handleCheckboxChange('isChecked1')}
            />
            )}
            {userRole.includes('Credentialing Committee') && (
                <>
                <CommonCheckBox
                className={`${style.marginTop}`}
                label={formatLabel("The undersigned medical staff committee hereby approves the appointment of {ApplicantName} as per the criteria and standards established by {EntityName}’s bylaws and policies. This approval is contingent upon the fulfillment of all required qualifications and obligations as outlined in the medical staff bylaws.",dynamicValues)}
                checked={isChecked.isChecked2}
                onChange={handleCheckboxChange('isChecked2')}
                />
                <div className={`${style.marginTop10} ${style.disclaimer}`}>Committee Disclaimer for Staff Appointments</div>
                <CommonCheckBox
                className={`${style.marginTop10}`}
                label="The medical staff committee and the institution do not assume liability for the individual actions or clinical decisions made by the approved appointed staff member. The staff member will retain full responsibility for their professional conduct and patient care activities."
                checked={isChecked.isChecked3}
                onChange={handleCheckboxChange('isChecked3')}
                />
                </>
            )} 
             {/* <ESignature/> */}
             {/* {formDetails?.esignatureRequired && ( */}
                    <div className={style.twoCol}>
                    <div 
                        onClick={onClicksignFunction}
                        className={!checkRequirements() ? style.disabled : style.signatureContainer}
                    >
                        <ESignature
                        userName={isSigned ? name : ""}
                        encData={isSigned ? encryptedText : ''}
                        showData={isSigned}
                        showDatais={true}
                        />
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <div className={style.displayInRow} onClick= {setTodayDate}>
                        <div className={style.dateTitle}>Date: </div>
                        <div className={`${style.date} ${style.marginLeft}`}>
                        {isSigned
                          ?  currentDate
                          : ""}
                        </div>
                        </div>
                    </div>
                    </div>
                 {/* )}  */}
            <div className={`${style.marginTop} ${style.reviewButtonContainer}`}>
            <div  onClick={() => getIsOpen(false)}>
              <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div>
            </div>
            {/* <div 
                className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`} 
                onClick= {handleApplicationApprove}
              >
                <div className={style.reviewButton}>APPROVE</div>
              </div> */}
               <div
                className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`}
                onClick={handleApplicationApprove}
                style={{ pointerEvents: isApproveEnabled ? 'auto' : 'none', opacity: isApproveEnabled ? 1 : 0.5 }}
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
