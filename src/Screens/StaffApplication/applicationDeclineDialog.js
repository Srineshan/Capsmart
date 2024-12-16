// import React, { useState } from 'react';
// import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
// import style from './index.module.scss';
// import DeclineMailTemplate from './declineMailTemplate';

// const ApplicationDecline = ({ getApplicationDeclineDialog }) => {
//   const [showDeclineMailDialog, setShowDeclineMailDialog] = useState(false);

//   const getDeclineMailDialog = (value) => {
//     setShowDeclineMailDialog(value);
//     getApplicationDeclineDialog(false)
//   }

//   return (
//     <div>
//       <Dialog isOpen={getApplicationDeclineDialog} onClose={() => getApplicationDeclineDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
//         <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
//           <div className={style.spaceBetween}>
//             <p className={style.extensionStyle1}>{"Decline Application For {Name} {Doctor}"}</p>
//             <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getApplicationDeclineDialog(false)} />
//           </div>
//           <div>
//             <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle}`}>
//               <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//                 <div className={style.displayInRow}>
//                   <span className={style.rejectionHeadingTextStyle}>LAST, First MI</span>
//                   <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>7837428</span>
//                 </div>
//               </div>
//               <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{"{Doctor}"}</div>
//               <div className={style.marginTop10}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Department:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"{Department}"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Staff Manager:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"{Staff Manager Name}"}</span>
//                   </div>
//                 </div>
//               </div>
//               <div className={style.marginTop5}>
//                 <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Speciality:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"{Speciality}"}</span>
//                   </div>
//                   <div className={`${style.twoColumnGridInner}`}>
//                     <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
//                     <span className={`${style.rejectionTextStyle}`}>{"Only If Multisite"}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={`${style.marginTop20} ${style.rejectionTextStyle}`}>Reasons For Declining Applicant*
//               <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
//                 <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
//                   <div className={style.displayInRow} style={{ height: "90px" }}>
//                     <div className={`${style.rejectionTextStyle}`}>Text</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={`${style.displayInRow} ${style.alignCenter} ${style.marginTop10}`}>
//               <button className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer}`} onClick={() => setShowDeclineMailDialog(true)}>DECLINE APPLICATION</button>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//       {
//         showDeclineMailDialog && (
//           <DeclineMailTemplate getDeclineMailDialog={getDeclineMailDialog} />
//         )
//       }
//     </div>
//   )
// }

// export default ApplicationDecline;


import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';
import DeclineMailTemplate from './declineMailTemplate';
import { GET, PUT,POST,TenantID } from "../../Screens/dataSaver";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import ESignature from '../../Components/ESignature';
import CryptoJS from 'crypto-js';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { format } from "date-fns";
import Dropzone from "react-dropzone";
import { SuccessToaster,ErrorToaster } from "../../utils/toaster";
import DescriptionIcon from '@mui/icons-material/Description';

const ApplicationDecline = ({ getIsOpen,selectedTab,applicationType, getApplicationDeclineDialog, getActiveApplicationView }) => {
  const [showDeclineMailDialog, setShowDeclineMailDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const id = sessionStorage.getItem("applicationId");
  const [isChecked, setIsChecked] = useState({ isChecked: false });
  const [currentDate, setCurrentDate] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [encryptedText, setEncryptedText] = useState('');
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const [logDetails, setLogDetails] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [name, setName] = useState('')
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [dateTime] = useState(new Date().toISOString());
  const [isCheckedSign, setIsCheckedSign] = useState(false);
  const [entity, setEntity] = useState([]);
  const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dropzoneStyle = {
        width: "100%",
        height: "auto",
        borderWidth: 2,
        borderColor: "rgb(102, 102, 102)",
        borderStyle: "dashed",
        borderRadius: 5,
      };

  const getDeclineMailDialog = (value) => {
    setShowDeclineMailDialog(value);
    getApplicationDeclineDialog(false);
  }
  

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
  }, [applicationType]);

  useEffect(() => {
    checkApproveEnabled();
  }, [isChecked, notes, isSigned]);

  useEffect(() => {
    setIsCheckedSign(formDetails?.forms?.[19]?.acknowledged || true);
    setIsSigned(
      formDetails?.forms?.[19]?.esign?.esign !== undefined &&
      formDetails?.forms?.[19]?.acknowledged
    );
  }, [formDetails]);

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

  const getApplicationEntity = async () => {
    const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
    setEntity(basicFormEntity);
  };

   const changeHandler = async (event) => {
        setIsLoading(true);
        const filesArray = Array.from(event);
        setFiles(filesArray);
        console.log(event, 'Test');
    
    
        const formData = new FormData();
        let fileNameArray = [];
        filesArray?.forEach(file => {
          fileNameArray.push({ "fileName": file?.name });
          formData.append('documents', file);
        });
    
    
    
    
        formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
          type: "application/json"
        }));
    
        fileNameArray.forEach(file => {
          console.log("File name:", file.fileName);
        });
    
        console.log("file?.name" + JSON.stringify(fileNameArray));
        console.log(fileNameArray)
        console.log(event?.name);
    
        try {
          const response = await POST(`application-management-service/application/${id}/files/bulk?isLLMRequired=${false}`, formData);
          SuccessToaster('File Uploaded Successfully');
          console.log(response?.data?.fileName);
    
    
    
          setIsLoading(false);
          return response?.data;
        } catch (error) {
          ErrorToaster('File Upload Failed');
          console.error(error);
          setIsLoading(false);
          return null;
        }
      };

  useEffect(() => {
    if (name && dateTime) {
      setEncryptedText(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    }
  }, [name, dateTime, publicKey]);

  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const getApplication = async () => {
    try {
      const { data: basicForm } = await GET(`application-management-service/application/${id}`);
      setFormDetails(basicForm);
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

   const getLog = async () => {
          const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
          setLogDetails(basicLog);
          console.log("basicLog" +JSON.stringify(basicLog));
          
        };

  const handleApplicationReject = async () => {
    try {
      const payload = {
        notes: {
            notes: notes
               },
        approvedDate: new Date().toISOString(),
      };

      await PUT(
        `application-management-service/application/${id}/workflow/complete/REJECTED?isDelegate=false`,
        payload
      );

      await getApplication();
      onClose();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const formatLabel = (template, values) =>
    template.replace(/{(.*?)}/g, (_, key) => values[key] || '');

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

  const onClicksignFunction = () => {
    setTodayDate();
    handleSignatureClick();
  };

  const setTodayDate = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  };

  const handleSignatureClick = () => {
    {
      setIsSigned(!isSigned);
      setIsEdited(true);
    }
  };

  const checkApproveEnabled = () => {
    const hasValidComments = notes.trim() !== '';
    // const hasValidSignature = formDetails?.esignatureRequired ? isSigned : true;
    // setIsApproveEnabled(isChecked.isChecked && hasValidComments && isSigned);
    setIsApproveEnabled(hasValidComments);
    
  };

  const checkRequirements = () => {
      return isChecked.isChecked
  };

  const getUserRole = (selectedTab) => {
    switch (selectedTab) {
      case "level-1":
        return "Staff Manager";
      case "level-2":
        return "Department Head";
      case "level-3":
        if (userRole?.includes("Credentialing Committee")) {
          return "Credentialing Committee";
        }
        if (userRole === "Chief Of Staff") {
          return "Chief Of Staff";
        }
        return "Credentialing Committee";
      case "level-4":
        return "Advisory Committee";
      case "level-5":
        return "Board";
      default:
        return "";
    }
  };

  const userRoleTab = getUserRole(selectedTab);
  const lastModifiedDate = formDetails?.lastModifiedDate;
  const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
  const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
  const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MMM dd, yyyy") : "-";

  return (
    <div>
      <Dialog isOpen={getApplicationDeclineDialog} onClose={() => getApplicationDeclineDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle1}>Staff Not Recommended for Reappointment</p>
            <Icon icon="cross" size={20} className={style.crossStyle} onClick={() => getApplicationDeclineDialog(false)} />
          </div>
          <div>
            {/* <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle}`}>
              <div className={`${style.displayInRow} ${style.marginLeft10} ${style.marginTop10}`}>
                <div className={style.displayInRow}>
                  <span className={style.rejectionHeadingTextStyle}> {formDetails?.basicDetails?.applicant?.name?.firstName
                    ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                    : ""}{", "}
                    {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}</span>
                  <div className={`${style.rejectionTextStyle} ${style.marginLeft10} `}>{formDetails?.providerType?.serviceProviderType}</div>

                </div>
                <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft10} ${style.alignCenter}`}>({formDetails?.displayId})</span>
              </div>
                  <div className={`${style.marginBothText}`}>Department:<span className={`${style.rightSideFontStyle} ${style.marginLeft10}`}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span></div>
                  <div className={`${style.marginBothText}`}>Division Or Specialty:<span className={`${style.rightSideFontStyle} ${style.marginLeft10}`}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span></div>
                
                  <div className={`${style.marginBothText} ${style.marginBottom}`}>Privilege Category:<span className={`${style.rightSideFontStyle} ${style.marginLeft10}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span></div>
                
            </div> */}
             <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
              <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
                <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                  <span className={style.rejectionHeadingTextStyle}> 
                  {formDetails?.basicDetails?.applicant?.name?.firstName
                  ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                    formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                  : ""}{", "}
                  {formDetails?.basicDetails?.applicant?.name?.lastName?.toUpperCase()}{", "}
                  {/* {formDetails?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
                  </span>
                <div className={`${style.rejectionTextStyle}`}>{formDetails?.providerType?.serviceProviderType}</div>
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
                    <span className={`${style.rejectionTextStyle1}`}>Only If Multisite</span>
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
            <div className={`${style.marginTop20} ${style.commentsNotesHeadingFontStyle}`}>Enter your Notes / Comments *</div>
              <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
                {/* <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
                  <textarea
                    className={`${style.rejectionTextStyle} ${style.textAreaStyle}`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', height: '90px' }}
                  />
                </div> */}
                <div className={`${style.marginTop10}`}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={notes}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setNotes(data);
                    }}
                    config={{
                      placeholder: "Enter comments / notes ",
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
              <div className={`${style.marginTop} ${style.cursorPointer}`}>
                  <>
                    <Dropzone
                      style={dropzoneStyle}
                      onDrop={(acceptedFiles) => changeHandler(acceptedFiles)}
                      accept={{
                        'image/jpeg': [],
                        'image/png': [],
                        'image/jpg': [],
                        'application/pdf': []
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className={style.uploadBorderStyle1}>
                              <p className={style.uploadTextStyle1}>
                                Upload any supporting documents
                              </p>
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </>
                  </div>
                  {files.length > 0 && (
                  <div className={`${style.displayInRow} ${style.referenceCardStyle1} ${style.alignItem} ${style.marginTop10} ${style.marginBottom20}`}>
                    <DescriptionIcon className={`${style.docsIcon}`} />
                    {files.length > 0 ? (
                      files.map((file, index) => (
                        <div key={index} className={`${style.marginLeft20}`}>{file.name}</div>
                      ))
                    ) : (
                      <div className={`${style.marginLeft20}`}>No documents uploaded</div>
                    )}
                  </div>
                  )}
              {/* <div className={`${style.marginTop10}`}>
              <CommonCheckBox
                  className={`${style.marginTop}`}
                  label={formatLabel("The undersigned medical staff committee hereby doesn't approves the appointment of {ApplicantName} as per the criteria and standards established by {EntityName}’s bylaws and policies.", dynamicValues)}
                  checked={isChecked.isChecked}
                  onChange={handleCheckboxChange('isChecked')}
                />
                </div> */}
                {/* <div className={style.twoCol}>
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
            </div> */}
            {/* </div> */}
            <div className={`${style.displayInRow} ${style.alignCenter} ${style.marginTop10}`}>
              <button
                className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.floatRight} ${style.cursorPointer}`}
                // onClick={handleApplicationReject}
                disabled={!notes}
                // style={{
                //   opacity: notes ? 1 : 0.5,
                //   pointerEvents: notes ? 'auto' : 'none',
                // }}
                onClick={isApproveEnabled ? () => handleApplicationReject() : () => { }}
                style={{ pointerEvents: isApproveEnabled ? 'auto' : 'none', opacity: isApproveEnabled ? 1 : 0.5 }}
              >
                CONTINUE
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {
        showDeclineMailDialog && (
          <DeclineMailTemplate getDeclineMailDialog={getDeclineMailDialog} />
        )
      }
    </div>
  );
}

export default ApplicationDecline;
