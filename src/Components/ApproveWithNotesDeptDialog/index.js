import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST } from "../../Screens/dataSaver";
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
import { format ,sub,add} from 'date-fns';
import TextField from "@mui/material/TextField";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Dropzone from "react-dropzone";
import { SuccessToaster,ErrorToaster } from "../../utils/toaster";
import DescriptionIcon from '@mui/icons-material/Description';
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";

const ApprovalWithNotesDeptDialog = ({ getIsOpen,getActiveApplicationView, dateFormat,selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userSelectRole, setUserSelectRole] = useState([]);
  const [selectedRoleCred, setSelectedRoleCred] = useState('');
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
    // const [userSelectRole, setSelectedApplicantTypeRole] = useState('');
    const [calendarStart, setCalendarStart] = useState(false);
    const [selectedDateForDept, setSelectedDateForDept] = useState(null);
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
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const isApproveEnabled = 
    userRoleComments.trim() !== '' && 
    selectedDateForDept !== null && 
    selectedRoleCred !== '';

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
    getApplicationUserRole();
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

  const getApplicationUserRole = async () => {
    try {
      const { data: basicFormRole } = await GET(`user/role?role=Credentialing Committee`);
      setUserSelectRole(basicFormRole);
    } catch (error) {
      console.error('Error fetching application:', error);
    }
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

  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const onClickApproveMoveFunction = () => {
    handleApplicationApprove(true);
    getApplicationMoveToNext(true);
    handleApplicationApproveDate(true);
  }

  const handleApplicationApproveDate = async () => {
    try {
      // const payload = {
      //   upcomingCredCommitteeMeetingDate: selectedDateForDept,
      // };

      // const temp = formDetails
      // const payload = temp?.upcomingCredCommitteeMeetingDate
      formDetails.upcomingCredCommitteeMeetingDate = selectedDateForDept;

      await PUT(
        `application-management-service/application/${id}`,
        formDetails
      );
      
      await getApplication();
      onClose();
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleApplicationApprove = async () => {
            let title;
            if (selectedTab === 'level-2') {
            if (userRole?.includes("Department Head")) {
              title = "Dept. Head / Chief Review";
            } else {
              title = "Dept. Head / Chief Review";
            }
            }else if (selectedTab === 'level-3') {
            if (userRole?.includes("Credentialing Committee")) {
              title = "Credentialing Committee Review";
            } else if (userRole?.includes("chief of staff")) {
              title = "Chief Of Staff Review";
            }
          } else if (selectedTab === 'level-4') {
            title = "MAC Review";
          } else if (selectedTab === 'level-5') {
            title = "BOD Approval";
          } else if (selectedTab === 'level-1') {
            title = "Staff Manager Verification";
          }

        const payload = {
          // notes: userRoleComments,
          notes: {
            notes: userRoleComments
          },
          title: title,
          approvedDate: new Date().toISOString(),
          userDetail:{
            id: selectedRoleCred,
            role: "Credentialing Committee"
          } 
        };
  
      await PUT(
        `application-management-service/application/${id}/workflow/complete/APPROVED?isDelegate=false&approvalType=VERIFIED_AND_ACCEPTED`,
        payload
      ) 
      .then(response => {
        console.log('successfull');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getApplicationMoveToNext = async () => {

   let title;
       if (selectedTab === 'level-2') {
        if (userRole?.includes("Department Head")) {
          title = "Dept. Head / Chief Review";
        } else {
          title = "Dept. Head / Chief Review";
        }
       }else if (selectedTab === 'level-3') {
        if (userRole?.includes("Credentialing Committee")) {
          title = "Credentialing Committee Review";
        } else if (userRole?.includes("chief of staff")) {
          title = "Chief Of Staff Review";
        }
      } else if (selectedTab === 'level-4') {
        title = "MAC Review";
      } else if (selectedTab === 'level-5') {
        title = "BOD Approval";
      } else if (selectedTab === 'level-1') {
        title = "Staff Manager Verification";
      }


    const payload = {
      // notes: userRoleComments,
      notes: {
        notes: userRoleComments
      },
      title: title,
      approvedDate: new Date().toISOString(),
      userDetail:{
        id: selectedRoleCred,
        role: "Credentialing Committee"
      } 
    };

    await PUT(`application-management-service/application/${id}/workflow/move?isDelegate=false`, payload)
      .then(response => {
        console.log('successfull');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
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

  // if (!userRole?.includes('Credentialing Committee') && !userRole?.includes('Chief Of Staff')) {
  //   return null;
  // }

  return (
    <>
    {isLoadingImage && (
         <div
           className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
         >
           <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
         </div>
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
              SEND TO DEPARTMENT HEAD FOR REVIEW
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
            Provide notes, if any, for the Department Head regarding this application
            </div>
              {/* <CommonTextField
                className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle}`}
                value={userRoleComments}
                onChange={(e) => setUserRoleComments(e.target.value)}
                placeholder="Enter comments and notes here"
              /> */}
              <div className={`${style.marginTop10}`}>
              <CKEditor
                editor={ClassicEditor}
                data={userRoleComments}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setUserRoleComments(data);
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
                              <div className={style.uploadBorderStyle}>
                                <p className={style.uploadTextStyle}>
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
                  <div className={`${style.displayInRow} ${style.referenceCardStyle} ${style.alignItem}  ${style.marginTop10} ${style.marginBottom20}`}>
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
            <div className={`${style.twoColumnGrid}`}>
              <div>
                <CommonDateField
                className={style.fullWidth}
                onChange={(date) => handleDateChange(date, 'MAC')}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={sub(new Date(), { years: 3 })}
                maxDate={add(new Date(), { years: 3 })}
                value={selectedDateForDept}
                label=" Upcoming Credentialing Committee Meeting Date"
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
                    value={selectedRoleCred}
                    onChange={(e) => setSelectedRoleCred(e.target.value)}
                    className={style.fullWidth}
                    firstOptionLabel={''}
                    firstOptionValue={''}
                    // valueList={["HIGH", "NO"]}
                    // labelList={['High Priority', 'No Priority']}
                    valueList={userSelectRole?.map(data => data?.id)}
                    labelList={userSelectRole?.map(data => `${data.name.firstName} ${data.name.lastName}`)}
                    disabledList={false}
                    required={false}
                    label="Assign a Credentialing Committee Member to Review & Approve"
                  />
              </div>
      
              </div>
             
            <div className={`${style.marginTop}  ${style.reviewButtonContainer} ${style.cursorPointer}`}>
            <div  onClick={() => getIsOpen(false)}>
              <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div>
            </div>
            <div
            className={`${style.reviewButtonStyle} ${isApproveEnabled ? undefined : style.cursorPointer} ${style.marginLeft}`}
            onClick={onClickApproveMoveFunction}
            style={{ 
              pointerEvents: isApproveEnabled ? 'auto' : 'none', 
              opacity: isApproveEnabled ? 1 : 0.5 
            }}
          >
            <div className={style.reviewButton}>SEND FOR REVIEW</div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
    )}
</>
  );
};

export default ApprovalWithNotesDeptDialog;
