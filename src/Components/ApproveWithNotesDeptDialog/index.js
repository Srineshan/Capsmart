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
import CommonInputField from "../CommonFields/CommonInputField";
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
import LoadingScreen from "../LoadingScreen";

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [uploadFileData, setUploadFileData]= useState('');
  const [documentDesc, setDocumentDesc] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
   const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const dropzoneStyle = {
      width: "100%",
      height: "auto",
      borderWidth: 2,
      borderColor: "rgb(102, 102, 102)",
      borderStyle: "dashed",
      borderRadius: 5,
    };
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  // const isApproveEnabled = 
  //   // userRoleComments.trim() !== '' && 
  // selectedDateForDept !== null && 
  // selectedRoleCred !== '' &&
  // documentTitle !== '';

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
    console.log("selectedRoleCred" + JSON.stringify(selectedRoleCred))
}, [])

useEffect(() => {
  console.log('userSelectRole:', userSelectRole);
  console.log('selectedRoleCred:', selectedRoleCred);

  // Find the matched role by ID
  const matchedRole = userSelectRole?.find(role => role?.id === selectedRoleCred);
  console.log('matchedRole:', matchedRole);

  // If a role is found, extract the name properties
  if (matchedRole) {
    const { firstName, lastName, middleName } = matchedRole?.name || {};
    console.log('firstName:', firstName);
    console.log('lastName:', lastName);

    // Set the state with the extracted values
    setFirstName(firstName || '');
    setLastName(lastName || '');
    setMiddleName(middleName || '');;
  }
}, [userSelectRole, selectedRoleCred]);


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
                  console.log("Event received:", event);
                  const filesArray = Array.from(event);
                  console.log("Converted files array:", filesArray);
                  setFiles(filesArray);
                
                  const formData = new FormData();
                  let fileNameArray = [];
                
                  filesArray.forEach(file => {
                    const fileInfo = {
                      "filePath": file.path || '', 
                      "fileName": file.name,
                      "fileURL": "",  
                      "fileType": file.type,
                      "classification": "",  
                      "verified": true,     
                      "valid": true ,     
                    };
                    fileNameArray.push(fileInfo);
                    formData.append('documents', file);
                  });
                
                  const blob = new Blob([JSON.stringify(fileNameArray)], {
                    type: "application/json"
                  });
                  formData.append('files', blob);
                
                  try {
                    setIsLoadingImageDocs(true);
                    const response = await POST(`application-management-service/application/${id}/files/bulk?isLLMRequired=${false}`, formData);
                    console.log("API Response:", response);
                    SuccessToaster('File Uploaded Successfully');
                    console.log("Response data:", response?.data);
                    setUploadFileData(prevData => {
                      // Merge previous data with new data
                      return [...(prevData || []), ...(response?.data || [])];
                    });
                    setIsLoadingImageDocs(false);
                    return response?.data;
                  } catch (error) {
                    ErrorToaster('File Upload Failed');
                    console.error("Error:", error);
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

  useEffect(() => {
    checkApproveEnabled();
  }, [userRoleComments, documentTitle, selectedDateForDept, selectedRoleCred, uploadFileData]);

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';
    const hasValidDate = selectedDateForDept !== null ; 
    const hasValidMember = selectedRoleCred !== '';
    
    // Check if there are any uploaded files
    if (uploadFileData.length > 0) {
      // For files, check if all documents have titles
      const allFilesHaveTitles = uploadFileData.every((_, index) => 
        documentTitle[index] && documentTitle[index].trim() !== ''
      );
      
      setIsApproveEnabled(hasValidComments && hasValidMember && hasValidDate && allFilesHaveTitles);
    } else {
      // If no files are uploaded, only check for valid comments
      setIsApproveEnabled(hasValidComments && hasValidMember && hasValidDate);
    }
  };

  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const onClickApproveMoveFunction = () => {
    handleApplicationApprove(true);
    getApplicationMoveToNext(true);
    // handleApplicationApproveDate(true);
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
            const files = (uploadFileData || []).map((file, index) => ({
              ...file,              
              description: documentDesc[index] || "",
              title: documentTitle[index] || "", 
            }));
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
          // userDetail:{
          //   id: selectedRoleCred,
          //   role: "Credentialing Committee"
          // } 
          userDetail: {
              id: selectedRoleCred,
              name: {
                firstName: firstName,
                lastName: lastName,
                middleName: middleName
              },
              role: "Credentialing Committee"
            },
          files: files || [],
          upcomingCredCommitteeMeetingDate: selectedDateForDept || ''
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
      userDetail: {
        id: selectedRoleCred,
        name: {
          firstName: firstName,
          lastName: lastName,
          middleName: middleName
        },
        role: "Credentialing Committee"
      },
       files: uploadFileData || [],
       upcomingCredCommitteeMeetingDate: selectedDateForDept || ""
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
    {isLoadingImageDocs && (
         <div
           className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
         >
           <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
         </div>
       )}
    {isLoadingImage && (
        //  <div
        //    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
        //  >
        //    <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
        //  </div>
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
            Provide notes, if any, for the Department Head regarding this application (Optional)
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
                  toolbar: {
                    shouldNotGroupWhenFull: true,
                    sticky: true
                  },
                  autoGrow: false,
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
                              <div className={`${style.spaceBetween} ${style.displayInRowCenter}`}>
                                <div className={style.uploadTextStyle}>
                                  Upload any supporting documents
                                </div>
                                <div className={`${style.marginLeftRight20}`}>
                                  Click To Upload
                                </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                    </>

                  </div>
                  {uploadFileData.length > 0 && (
                <div>
                  {uploadFileData.map((file, index) => (
                    <div key={index} className={`${style.alignItem} ${style.marginTop10}`}>
                      <div className={`${style.threeColumnGrid}`}>
                      <div className={`${style.displayInRow} ${style.referenceCardStyle}`}>
                        <DescriptionIcon className={style.docsIcon} />
                        <div className={style.marginLeft20}>{file.fileName}</div>
                      </div>
                      <div>
                      <CommonInputField
                        value={documentTitle[index] || ""}
                        onChange={(e) => {
                          const newDocumentTitle = [...documentTitle];
                          newDocumentTitle[index] = e.target.value;
                          setDocumentTitle(newDocumentTitle);
                        }}
                        type="text"
                        placeholder="Title*"
                        className={style.referenceCardStyleDescription}
                      />
                      </div>
                      <div>
                      <CommonInputField
                        value={documentDesc[index] || ""}
                        onChange={(e) => {
                          const newDocumentDesc = [...documentDesc];
                          newDocumentDesc[index] = e.target.value;
                          setDocumentDesc(newDocumentDesc);
                        }}
                        type="text"
                        placeholder="Description (Optional)"
                        className={style.referenceCardStyleDescription}
                      />
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              )}
            <div className={`${style.twoColumnGrid} ${style.marginTop10}`}>
              <div>
              <CommonDateField
                className={style.fullWidth}
                onChange={(date) => handleDateChange(date, 'MAC')}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}
                minDate={add(new Date(), { days: 1 })}
                maxDate={add(new Date(), { years: 3 })}
                value={selectedDateForDept}
                label=" Upcoming Credentialing Committee Meeting Date*"
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
              <CommonSelectField
                    value={selectedRoleCred}
                    onChange={(e) => setSelectedRoleCred(e.target.value)}
                    className={style.fullWidth1}
                    firstOptionLabel={''}
                    firstOptionValue={''}
                    // valueList={["HIGH", "NO"]}
                    // labelList={['High Priority', 'No Priority']}
                    valueList={userSelectRole?.map(data => data?.id)}
                    labelList={userSelectRole?.map(data => `${data.name.firstName} ${data.name.lastName}`)}
                    disabledList={false}
                    required={false}
                    label="Assign a Credentialing Committee Member to Review & Approve*"
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
