import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT ,POST, TenantID } from "../../Screens/dataSaver";
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
import Dropzone from "react-dropzone";
import DescriptionIcon from '@mui/icons-material/Description';
import { SuccessToaster,ErrorToaster } from "../../utils/toaster";
import CommonInputField from "../CommonFields/CommonInputField";
import axios from "axios";
// import { WProofreader } from '@webspellchecker/wproofreader-ckeditor5';

const NotesDialog = ({ getIsOpen, dateFormat, getActiveApplicationView, selectedTab }) => {
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
   const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadFileData, setUploadFileData]= useState([]);
  const [documentDesc, setDocumentDesc] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
  };
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
  }, [applicationType]);


  useEffect(() => {
    checkApproveEnabled();
  }, [userNotes, documentTitle, uploadFileData]);

  // useEffect(() => {
  //   getActiveApplicationView();
  //   getApplication();
  // }, []);


  useEffect(() => {
    setUserDetails();
  }, [users?.id])
  

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
        
        // Check if there are any uploaded files
        if (uploadFileData.length > 0) {
          // For files, check if all documents have titles
          const allFilesHaveTitles = uploadFileData.every((_, index) => 
            documentTitle[index] && documentTitle[index].trim() !== ''
          );
          
          setIsApproveEnabled(hasValidComments && allFilesHaveTitles);
        } else {
          // If no files are uploaded, only check for valid comments
          setIsApproveEnabled(hasValidComments);
        }
      };

  const onClose = () => {
    // getActiveApplicationView(false);
    getIsOpen(false);
  };

  const getApplicationNotes = async () => {

    const files = (uploadFileData || []).map((file, index) => ({
      ...file,              
      description: documentDesc[index] || "",
      title: documentTitle[index] || "", 
    }));
   
    let temp = {
      notes: userNotes,
      files: files
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

const handleTextChange = async (editor) => {
  const data = editor.getData();
  setUserNotes(data);

  // Call LanguageTool API
  try {
    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      new URLSearchParams({
        text: data.replace(/<[^>]+>/g, ""), // Remove HTML tags
        language: "en-US",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    setErrors(response.data.matches); // Extract errors from API response
  } catch (error) {
    console.error("Error with LanguageTool API:", error);
  }
};
 const lastModifiedDate = formDetails?.lastModifiedDate;
 const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
   const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
   const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MMM dd, yyyy") : "-";

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
                  : ""}{" "}
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
                      : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()}, {formDetails?.updatedBy?.title?.title}
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
                // onChange={(event, editor) => handleTextChange(editor)}
                config={{
                  placeholder: "Enter comments / notes",
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
                  // disableNativeSpellChecker: false,        
                  // extraPlugins: [WProofreader],
                  // wproofreader: {
                  //   // serviceId: 'your-service-id', // Replace with your service ID
                  //   srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js',
                  // },
                }}
                onReady={(editor) => {
                  const editorElement = editor.editing.view.document.getRoot();
                    editor.editing.view.change(writer => {
                      writer.setStyle(
                        'min-height',
                        '150px',
                        editorElement
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
                            Upload any Supporting Documents
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
                        <div className={style.marginLeft20}>{file?.file?.fileName}</div>
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

export default NotesDialog;
