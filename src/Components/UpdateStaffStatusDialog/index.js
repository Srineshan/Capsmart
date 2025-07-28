import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, TenantID,DELETE } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import { format, sub, add } from 'date-fns';
import TextField from "@mui/material/TextField";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import Dropzone from "react-dropzone";
import DescriptionIcon from '@mui/icons-material/Description';
import { ErrorToaster2, SuccessToaster2 } from "../../utils/toaster";
import CommonInputField from "../CommonFields/CommonInputField";
import axios from "axios";
import { Tooltip } from "@mui/material";
import DeleteIcon from './../../images/deleteHcRow.png';
import DeleteConfirmationDialog from './../../Components/DeleteConfirmation';
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import CommonDateField from "../CommonFields/CommonDateField";
// import { WProofreader } from '@webspellchecker/wproofreader-ckeditor5';

const NotesDialog = ({ getIsOpen, getActiveApplicationView, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [inactiveStaffReason, setInactiveStaffReason] = useState('');
  const [logDetails, setLogDetails] = useState([]);
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const [entity, setEntity] = useState([]);
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadFileData, setUploadFileData] = useState([]);
  const [documentDesc, setDocumentDesc] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fileToDeleteId, setFileToDeleteId] = useState(null);
  const [notesVisible, setNotesVisible] = useState(true);
  const [calendarStart, setCalendarStart] = useState(false);
  const [staffInactiveDate, setStaffInactiveDate] = useState(null);
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
  };
  const [errors, setErrors] = useState([]);
  const [isChecked, setIsChecked] = useState("Inactive");
  const workModeType = sessionStorage.getItem('workModeType')

 const handleCheckboxChange = (option) => () => {
    setIsChecked(option);
  };
    const handleDateChange = (date , type) => {
      const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00")
      
    setStaffInactiveDate (formattedDate);
      setCalendarStart(false)
    };

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
  }, [applicationType]);


  useEffect(() => {
    checkApproveEnabled();
    console.log("uploadFileData", uploadFileData)
  }, [inactiveStaffReason, documentTitle, uploadFileData,staffInactiveDate]);

  // useEffect(() => {
  //   getActiveApplicationView();
  //   getApplication();
  // }, []);


  useEffect(() => {
    setUserDetails();
  }, [users?.id])


  const changeHandler = async (event) => {
    console.log("Event received:", event);
  
    const newFilesArray = Array.from(event);
    console.log("Converted files array:", newFilesArray);
  
    const existingFileNames = (files || []).map(file => file.name);
    const seenInCurrentSelection = new Set();
    const filteredNewFiles = [];
  
    newFilesArray.forEach(file => {
      if (existingFileNames.includes(file.name)) {
        ErrorToaster2(`File "${file.name}" already exists`);
      } else if (seenInCurrentSelection.has(file.name)) {
        ErrorToaster2(`Duplicate file "${file.name}" selected in this upload`);
      } else {
        seenInCurrentSelection.add(file.name);
        filteredNewFiles.push(file);
      }
    });
  
    if (filteredNewFiles.length === 0) {
      return; 
    }
  
    const updatedFiles = [...(files || []), ...filteredNewFiles];
    setFiles(updatedFiles);
  


    const formData = new FormData();
    let fileNameArray = [];

    filteredNewFiles.forEach(file => {
      const fileInfo = {
        "filePath": file.path || '',
        "fileName": file.name,
        "fileURL": "",
        "fileType": file.type,
        "classification": "",
        "verified": true,
        "valid": true,
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
      SuccessToaster2('File Uploaded Successfully');
      console.log("Response data:", response?.data);
      setUploadFileData(prevData => {
        // Merge previous data with new data
        return [...(prevData || []), ...(response?.data || [])];
      });
      setIsLoadingImageDocs(false);
      console.log("Responseupload:", uploadFileData);
      return response?.data;
    } catch (error) {
      ErrorToaster2('File Upload Failed');
      console.error("Error:", error);
      setIsLoading(false);
      return null;
    }
  };


   const handleDeleteFile = async (fileId) => {
    try {
      setIsLoadingImageDocs(true);
          const requestBody = [fileId];
        const { data: response } = await DELETE(
          'document-management-service/document', requestBody);
  
      SuccessToaster2("File deleted successfully");
  
      // Filter out from local state
      setUploadFileData(prev => prev.filter(file => file.id !== fileId));
  
      setFileToDeleteId(null);
      setShowDeleteConfirmation(false);
      setIsLoadingImageDocs(false);
    } catch (error) {
      ErrorToaster2("File deletion failed");
      console.error("Delete error:", error);
      setShowDeleteConfirmation(false);
      setIsLoadingImageDocs(false);
    }
  };

  const getDeleteConfirmation = (value) => {
  if (value) {
    handleDeleteFile(fileToDeleteId); 
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
    console.log("basicLog" + JSON.stringify(basicLog));
    setIsLoadingImage(false)
  };

  const checkApproveEnabled = () => {
    const hasValidComments = inactiveStaffReason.trim() !== '';

    // Check if there are any uploaded files
    if (uploadFileData.length > 0) {
      // For files, check if all documents have titles
      const allFilesHaveTitles = uploadFileData.every((_, index) =>
        documentTitle[index] && documentTitle[index].trim() !== ''
      );

      setIsApproveEnabled(staffInactiveDate && hasValidComments && allFilesHaveTitles);
    } else {
      setIsApproveEnabled(staffInactiveDate && hasValidComments);
    }
  };

  const onClose = () => {
    // getActiveApplicationView(false);
    getIsOpen(false);
  };

  const getApplicationNotes = async () => {

    const files = (uploadFileData || []).map((item, index) => ({
      ...item.file,
      description: documentDesc[index] || "",
      title: documentTitle[index] || "",
    }));

    let temp = {
      notes: inactiveStaffReason,
      files: files,
      private: notesVisible ? false : true,
    };
    const title = `${workModeType}${" "}Notes/Comments`

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
  const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), dateFormat) : "-";
  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
  const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
  const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), dateFormat) : "-";

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
        <div className={style.loadingOverlay}>
          <LoadingScreen />
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
            <div>
              <div className={style.spaceBetween}>
                <div className={`${style.heading}`}>
                 Update Staff Status
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
                <div className={`${style.marginTop10} ${style.displayInRowCenter}`}>
                  <div className={`${style.gridContainer} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                    <div className={`${style.gridRow}`}>
                      <div className={style.gridItem1}><span className={style.rejectionHeadingTextStyle}>
                        {formDetails?.basicDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() +
                          formDetails?.basicDetails?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
                        {formDetails?.basicDetails?.applicant?.name?.firstName
                          ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                          formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                          : ""}
                      </span>
                        <span className={`${style.rejectionTextStyle} ${style.marginLeft4}`}>
                        {" "} {applicationType === "LOCUM" ? "Locum":""} {formDetails?.providerType?.serviceProviderType}
                        </span>
                      </div>
                      <div className={`${style.gridItem2}`}>
                        <span className={`${style.rejectionHeadingTextStyle}`}>
                          {formDetails?.basicDetails?.departmentSpecialty?.department || ""}
                          {formDetails?.basicDetails?.departmentSpecialty?.specialty
                            ? ` - ${formDetails.basicDetails.departmentSpecialty.specialty}`
                            : ""}
                        </span>
                      </div>
                      <div className={`${style.twoColumnGridInner2} `}>
                        <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
                        <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}</span>
                      </div>
                    </div>
                    <div className={style.gridRow}>
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
                      <div className={`${style.twoColumnGridInner}`}>
                        <span className={`${style.rejectionTextStyle}`}>Submission Date:</span>
                        <span className={`${style.rejectionTextStyle1}`}>{formattedSubmissionDate}</span>
                      </div>
                      <div className={`${style.twoColumnGridInner}`}>
                        <span className={`${style.rejectionTextStyle}`}>Last Updated :</span>
                        <span className={`${style.rejectionTextStyle1}`}>{formattedDate}</span>
                      </div>
                      <div className={`${style.twoColumnGridInner2}`}>
                        <span className={`${style.rejectionTextStyle}`}>Last Updated by:</span>
                        <span className={`${style.rejectionTextStyle1}`}>
                          {formDetails?.basicDetails?.applicant?.name?.firstName
                            ? formDetails?.updatedBy?.name?.firstName.charAt(0).toUpperCase() +
                            formDetails?.updatedBy?.name?.firstName.slice(1).toLowerCase()
                            : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()} {formDetails?.updatedBy?.title?.title  ? `, ${formDetails?.updatedBy?.title?.title}`: ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.marginTop10} ${style.flexCenter}`}>
              <CommonCheckBox
                    //   className={`${style.marginTop10}`}
                      label="Change From Privilege Staff To Inactive Staff"
                      checked={isChecked === 'Inactive'}
                      onChange={handleCheckboxChange('Inactive')}
                    />
            </div>
            <div className={style.twoColumnGrid}>
                <div>
                    <div className={style.labelTextStyle}>Inactive Status Effective Date</div>
                    <div className={style.marginTopLess}>
                    <CommonDateField
                    onChange={(date) => handleDateChange(date)}
                    open={calendarStart}
                    onOpen={() => setCalendarStart(true)}
                    onClose={() => setCalendarStart(false)}
                    minDate={sub(new Date(), { years: 3 })}
                    maxDate={add(new Date(), { years: 3 })}
                    value={staffInactiveDate}
                    // label={"Inactive Status Effective Date"}
                        InputProps={{
                        style: {
                            fontSize: 14,
                            height: 30,
                            margin: 0,
                        },
                        }}
                    renderInput={(params) => (
                        
                                        <TextField
                        {...params}
                        inputProps={{
                            ...params.inputProps,
                            placeholder: 'DD/MM/YYYY',
                            readOnly: true
                        }}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        />
                    )}
                    />
                    </div>
                </div>
                <div></div>

            </div>
            <div className={`${style.marginTop5} ${style.commentsNotesHeadingFontStyle}`}>
               Reason To Change Staff Status (Mandatory)*
            </div>
            <div className={`${style.marginTop10}`}>
              <CKEditor
                editor={ClassicEditor}
                data={inactiveStaffReason}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setInactiveStaffReason(data);
                }}
                // onChange={(event, editor) => handleTextChange(editor)}
                config={{
                  placeholder: "Enter Notes / Comments",
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
                      <div className={`${style.displayInRow}`}>
                        <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => {
    setFileToDeleteId(file?.id);
    setShowDeleteConfirmation(true);
  }}/>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={`${style.marginTop} ${style.marginBottom} ${style.reviewButtonContainer}`}>
            <div className={`${style.cursorPointer}`} onClick={() => getIsOpen(false)}>
              <Tooltip title={"Click to Cancel"} arrow>
                <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div></Tooltip>
            </div>
            <div
              className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined} ${style.marginLeft}`}
            //   onClick={getApplicationNotes}
              style={{
                pointerEvents: isApproveEnabled ? 'auto' : 'none',
                opacity: isApproveEnabled ? 1 : 0.5
              }}
            >
              <Tooltip title={isApproveEnabled ? "Click to Submit Notes and Comments" : ""} arrow>
                <div className={style.reviewButton}>SUBMIT</div></Tooltip>
            </div>
          </div>
        </Dialog>
      )}
           {showDeleteConfirmation && (
        <DeleteConfirmationDialog
          getShowDeleteConfirmation={(val) => setShowDeleteConfirmation(val)}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this uploaded Document?"
        />
      )}
    </>
  );
};

export default NotesDialog;
