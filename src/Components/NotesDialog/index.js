import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT , TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import { format } from 'date-fns';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";

const ApprovalWithNotesDialog = ({ getIsOpen, dateFormat, getActiveApplicationView, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userNotes, setUserNotes] = useState('');
  const [logDetails, setLogDetails] = useState([]);
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const [dateTime] = useState(new Date().toISOString());
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState('');
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [name, setName] = useState('')
  const [entity, setEntity] = useState([]);
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
  }, [applicationType]);


  useEffect(() => {
    checkApproveEnabled();
  }, [userNotes]);

  useEffect(() => {
    getActiveApplicationView(true);
    // getApplication();
  }, [userNotes]);


  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const getApplicationEntity = async () => {
      const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
      setEntity(basicFormEntity);
  };

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserRole(userData?.roles?.map((data) => data?.roleName));
  }

  const getApplication = async () => {
    try {
      setIsLoadingImage(true);
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
      setIsLoadingImage(false)
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

     const getLog = async () => {
        setIsLoadingImage(true);
        const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
        setLogDetails(basicLog);
        console.log("basicLog" +JSON.stringify(basicLog));
        setIsLoadingImage(false)
      };

  const checkApproveEnabled = () => {
    const hasValidComments = userNotes.trim() !== '';
      setIsApproveEnabled(hasValidComments);
  };

  const onClose = () => {
    // getActiveApplicationView(false);
    getIsOpen(false);
  };

  const getApplicationNotes = async () => {
   
    let temp = {
      notes: userNotes,
    };
    const title = `${userRole}${" "}Notes/Comments`

    await PUT(`application-management-service/application/${id}/addNote?title=${title}`, temp)
      .then(response => {
        console.log('successfull notes added');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
};

 const lastModifiedDate = formDetails?.lastModifiedDate;
 const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
   const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
   const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MMM dd, yyyy") : "-";

  return (
<>
{isLoadingImage && (
      // <div
      //   className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
      // >
      //   <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
      // </div>
      <LoadingScreen />
    )}
{!isLoadingImage && (
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
              Create A Note
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
          <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
              <div className={`${style.spaceBetween} ${style.marginLeftRight20}`}>
                <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                  <span className={style.rejectionHeadingTextStyle}>
                  {formDetails?.basicDetails?.applicant?.name?.firstName
                  ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                  : ""}{", "}
                  {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}        
                  {/* {formDetails?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
                  </span>
                <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>{formDetails?.providerType?.serviceProviderType}</div>
                  {/* <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.displayId}</span> */}
                </div>
                <div>
                <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
                </div>
              </div>
              {/* <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{formDetails?.providerType?.serviceProviderType}</div> */}
              <div className={style.marginTop10}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Department:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Application ID:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.displayId}</span>
                  </div>
                {/* </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Division / Speciality:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
                  </div>
                  {/* <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetailReferences?.site || "-"}</span>
                  </div> */}
                    {
                    entity?.multiSiteEntity && (
                        <div className={`${style.twoColumnGridInner}`}>
                        <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                        <span className={`${style.rejectionTextStyle1}`}>
                            {entity?.multiSiteEntity?.[0]?.name || "-"}
                        </span>
                        </div>
                    )
                    }
                {/* </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
                     <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Submission Date:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formattedSubmissionDate}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Last Updated :</span>
                    {/* <span className={`${style.rejectionTextStyle1}`}>{format(new Date(formDetails?.lastModifiedDate), "MMM dd, yyyy")}</span> */}
                    <span className={`${style.rejectionTextStyle1}`}>{formattedDate}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
                    <span className={`${style.rejectionTextStyle1}`}>
                      {formDetails?.basicDetails?.applicant?.name?.firstName
                      ? formDetails?.updatedBy?.name?.firstName.charAt(0).toUpperCase() +
                      formDetails?.updatedBy?.name?.firstName.slice(1).toLowerCase()
                      : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.marginTop10}`}>
              <CKEditor
                editor={ClassicEditor}
                data={userNotes}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setUserNotes(data);
                }}
                config={{
                  placeholder: "Enter comments / notes",
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
        </div>
        <div className={`${style.marginTop} ${style.marginBottom} ${style.reviewButtonContainer} ${style.cursorPointer}`}>
            <div  onClick={() => getIsOpen(false)}>
              <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div>
            </div>
            <div
            className={`${style.reviewButtonStyle} ${isApproveEnabled ? undefined : style.cursorPointer} ${style.marginLeft}`}
            onClick={getApplicationNotes}
            style={{ 
              pointerEvents: isApproveEnabled ? 'auto' : 'none', 
              opacity: isApproveEnabled ? 1 : 0.5 
            }}
          >
            <div className={style.reviewButton}>SUBMIT</div>
          </div>
            </div>
      </div>
    </Dialog>
    )}
</>
  );
};

export default ApprovalWithNotesDialog;
