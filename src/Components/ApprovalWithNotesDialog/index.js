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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const ApprovalWithNotesDialog = ({ getIsOpen, dateFormat, getActiveApplicationView, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [isChecked, setIsChecked] = useState({ isChecked1: false, isChecked2: false });
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
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );

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
  }, [applicationType]);

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
      : (isChecked.isChecked2);
  };

  const handleSignatureClick = () => {
    {
      setIsSigned(!isSigned);
      setIsEdited(true);
    }
  };

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';

    if (userRole.includes('Chief Of Staff')) {
      setIsApproveEnabled(isChecked.isChecked1 && hasValidComments && isSigned);
    } else if (userRole.includes('Credentialing Committee')) {
      setIsApproveEnabled(isChecked.isChecked2 && hasValidComments && isSigned);
    }
  };
  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const onClickApproveMoveFunction = () => {
    handleApplicationApprove(true);
    getApplicationMoveToNext(true);
  }

  const handleApplicationApprove = async () => {
    let role;
    let notes = { userRoleComments }
    let isDelegate = true; // Default value for isDelegate
    // notes = { userRoleComments }

    if (selectedTab === 'level-2' && applicationType === "NEW") {
      role = "Department Head";
      // notes = { userRoleComments };
    } else if (selectedTab === 'level-2' && applicationType === "REAPPOINTMENT") {
      role = "Credentialing Committee";
      // notes = { userRoleComments };
    } else if (selectedTab === 'level-3' && applicationType === "NEW") {
      role = "Credentialing Committee";
      // notes = { userRoleComments };
    } else if (selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") {
      role = "Advisory Committee";
      // notes = { userRoleComments };
    } else if (selectedTab === 'level-4' && applicationType === "NEW") {
      role = "Advisory Committee";
      // notes = { userRoleComments };
    } else if (selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") {
      role = "Board";
      // notes = { userRoleComments };
    } else if (selectedTab === 'level-5' && applicationType === "NEW") {
      role = "Board";
      // notes = { userRoleComments };
    }

    if (selectedTab === 'level-2' && userRole?.includes("Credentialing Committee")) {
      isDelegate = false;
    }
    else if (selectedTab === 'level-1' && userRole?.includes("Staff Manager")) {
      isDelegate = false;
    }
    else if (selectedTab === 'level-3' && userRole?.includes("Credentialing Committee") && applicationType === "NEW") {
      isDelegate = false;
    } else {
      notes = { userRoleComments: '' }
    }

    let temp = {
      role: isDelegate ? role : "",
      notes: notes,
    };

    await PUT(`application-management-service/application/${id}/workflow/complete/APPROVED?isDelegate=${isDelegate}`, temp)
      .then(response => {
        console.log('success');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getApplicationMoveToNext = async () => {

    let role;
    let notes;
    let isDelegate = true; // Default value for isDelegate

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2' && applicationType === "NEW") {
      role = "Department Head";
      // notes = {userRoleComments};
    } else if (selectedTab === 'level-2' && applicationType === "REAPPOINTMENT") {
      role = "Credentialing Committee";
      // notes = {userRoleComments};
    } else if (selectedTab === 'level-3' && applicationType === "NEW") {
      role = "Credentialing Committee";
      // notes = {userRoleComments};
    } else if (selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") {
      role = "Advisory Committee";
      // notes = {userRoleComments};
    } else if (selectedTab === 'level-4' && applicationType === "NEW") {
      role = "Advisory Committee";
      // notes = {userRoleComments};
    } else if (selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") {
      role = "Board";
      // notes = {userRoleComments};
    } else if (selectedTab === 'level-5' && applicationType === "NEW") {
      role = "Board";
      // notes = {userRoleComments};
    }

    // Override isDelegate logic for specific conditions
    if (selectedTab === 'level-2' && userRole?.includes("Credentialing Committee")) {
      isDelegate = false;
    }
    if (selectedTab === 'level-1' && userRole?.includes("Staff Manager")) {
      isDelegate = false;
    }
    if (selectedTab === 'level-3' && userRole?.includes("Credentialing Committee") && applicationType === "NEW") {
      isDelegate = false;
    }

    let temp = {
      role: isDelegate ? role : " ",
      notes: notes,
    };

    await PUT(`application-management-service/application/${id}/workflow/move?isDelegate=${isDelegate}`, temp)
      .then(response => {
        console.log('successfull');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
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

  const getUserRole = (selectedTab, applicationType) => {
    if (applicationType === "REAPPOINTMENT") {
      switch (selectedTab) {
        case "level-1":
          return "Staff Manager";
        case "level-2":
          return "Credentialing Committee";
        case "level-3":
          return "Advisory Committee";
        case "level-4":
          return "Board";
        default:
          return "";
      }
    }
    return "";
  };

  const userRoleTab = getUserRole(selectedTab, applicationType);

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
              {userRoleTab} Review & Approval
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
              <div className={`${style.displayInRow}`}>
                <div className={`${style.namefontstyle} ${style.marginTop10}`}>
                  {formDetails?.basicDetails?.applicant?.name?.firstName
                    ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                    : ""}{", "}
                  {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}
                  <span className={`${style.applicantTypeFontStyle}`}>
                    {formDetails?.providerType?.category}
                  </span>
                </div>
                <div className={`${style.displayIdFontStyle} ${style.marginBoth}`}>({`${formDetails?.displayId}` || "-"})</div>
              </div>
              {/* <div className={`${style.grid}`}>
                <div> */}
                  <div className={`${style.marginBothText}`}>Department:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span></div>
                  <div className={`${style.marginBothText}`}>Division Or Specialty:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span></div>
                {/* </div>
                <div> */}
                  <div className={`${style.marginBothText} ${style.marginBottom}`}>Privilege Category:<span className={`${style.rightSideFontStyle}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span></div>
                {/* </div>
              </div> */}
            </div>
            <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
              Comments*
            </div>
            {/* <div className={`${style.notesBorderStyle}`}>
              <div className={`${style.commentsNotesFontStyle}`}>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam minima facere vitae fugiat aspernatur amet ab sequi nam doloribus quaerat exercitationem ducimus nostrum illo consectetur vel possimus molestias explicabo iusto iste officia est repudiandae, eum autem aut! Odio quia accusantium eum dignissimos, molestias delectus consequatur voluptatibus cum, quod animi voluptatum vero nemo blanditiis consequuntur tempora. Ipsa nihil hic earum voluptates nostrum. Facilis aspernatur rerum at voluptatum deleniti nam culpa praesentium sunt architecto, ducimus debitis impedit neque ad sapiente fugiat veniam molestiae doloremque quae natus, sequi soluta! Porro sapiente ex inventore voluptatem ea recusandae rerum doloribus qui id possimus, iure odit?
              </div>
            </div> */}
            {/* <div className={`${style.notesBorderStyle}`}> */}
            <div className={`${style.marginTop10}`}>
              <CKEditor
                editor={ClassicEditor}
                data={userRoleComments}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setUserRoleComments(data);
                }}
                config={{
                  placeholder: "Enter comments and notes here",
                }}
                onReady={(editor) => {
                  editor.editing.view.change((writer) => {
                    writer.setStyle(
                      "height",
                      "150px",
                      editor.editing.view.document.getRoot()
                    );
                  });
                }}
              />
            </div>
            {/* </div> */}
            {userRole.includes('Chief Of Staff') && (
              <CommonCheckBox
                className={`${style.marginTop}`}
                label={formatLabel("I as the chief of staff approves the appointment of {ApplicantName} as per the criteria and standards established by {EntityName}’s bylaws and policies. This approval is contingent upon the fulfillment of all required qualifications and obligations as outlined in the medical staff bylaws.", dynamicValues)}
                checked={isChecked.isChecked1}
                onChange={handleCheckboxChange('isChecked1')}
              />
            )}
            {userRole.includes('Credentialing Committee') && (
              <>
                <CommonCheckBox
                  className={`${style.marginTop}`}
                  label={formatLabel("The undersigned medical staff committee hereby approves the appointment of {ApplicantName} as per the criteria and standards established by {EntityName}’s bylaws and policies. This approval is contingent upon the fulfillment of all required qualifications and obligations as outlined in the medical staff bylaws.", dynamicValues)}
                  checked={isChecked.isChecked2}
                  onChange={handleCheckboxChange('isChecked2')}
                />
                {/* <div className={`${style.marginTop10} ${style.disclaimer}`}>{applicationType === "NEW" ? "Committee Disclaimer for Applicant Appointments" : "Committee Disclaimer for Staff Reappointments" }</div> */}
                {/* <CommonCheckBox
                className={`${style.marginTop10}`}
                label="The medical staff committee and the institution do not assume liability for the individual actions or clinical decisions made by the approved appointed staff member. The staff member will retain full responsibility for their professional conduct and patient care activities."
                checked={isChecked.isChecked3}
                onChange={handleCheckboxChange('isChecked3')}
                /> */}
              </>
            )}
            {/* <ESignature/> */}
            {/* {formDetails?.esignatureRequired && ( */}
            <div className={style.twoCol}>
              <div
                onClick={!checkRequirements() ? () => { } : onClicksignFunction}
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
                <div className={style.displayInRow} onClick={setTodayDate}>
                  <div className={style.dateTitle}>Date: </div>
                  <div className={`${style.date} ${style.marginLeft}`}>
                    {isSigned
                      ? currentDate
                      : ""}
                  </div>
                </div>
              </div>
            </div>
            {/* )}  */}
            <div className={`${style.marginTop} ${style.reviewButtonContainer} ${style.cursorPointer}`}>
              <div onClick={() => getIsOpen(false)}>
                <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div>
              </div>
              {/* <div 
                className={`${style.reviewButtonStyle} ${style.reviewButtonStyle} ${style.cursorPointer}`} 
                onClick= {handleApplicationApprove}
              >
                <div className={style.reviewButton}>APPROVE</div>
              </div> */}
              <div
                className={`${style.reviewButtonStyle} ${style.cursorPointer}`}
                onClick={isApproveEnabled ? () => onClickApproveMoveFunction() : () => { }}
                style={{ pointerEvents: isApproveEnabled ? 'auto' : 'none', opacity: isApproveEnabled ? 1 : 0.5 }}
              >
                <div className={style.reviewButton}>SUBMIT</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>

  );
};

export default ApprovalWithNotesDialog;
