import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import LoadingScreen from "../LoadingScreen";
import CommonInputField from "../CommonFields/CommonInputField";
import CommonDivider from "../CommonFields/CommonDivider";
import CommonSelectField from '../CommonFields/CommonSelectField';
import { SuccessToaster, ErrorToaster, ErrorToaster2 } from "../../utils/toaster";
import DescriptionIcon from '@mui/icons-material/Description';
import Dropzone from "react-dropzone";
import { fileLoadingURL } from "../../utils/formatting";
import { Tooltip } from "@mui/material";

const ClarificationDialog = ({ getIsOpen, data, form, dateFormat, getActiveApplicationView, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userNotes, setUserNotes] = useState('');
  const [responseNotes, setResponseNotes] = useState('');
  const [logDetails, setLogDetails] = useState([]);
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const id = sessionStorage.getItem("applicationId");
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [clarificationSubject, setClarificationSubject] = useState("");
  const [respondentName, setRespondentName] = useState("");
  const [selectedCommunicationMethod, setSelectedCommunicationMethod] = useState('');
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
  const [uploadFileData, setUploadFileData] = useState([]);
  const [files, setFiles] = useState([]);
  const [documentDesc, setDocumentDesc] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [clarificationType, setClarificationType] = useState("");
  const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
  };

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getLog();
    console.log("fromApplicant", data, form)
  }, [applicationType, data]);

  useEffect(() => {
    // if (data?.clarificationRequest) {
    setClarificationSubject(data?.clarificationRequest?.clarificationTitle);
    setClarificationType(data?.clarificationRequest?.clarificationRequestType)
    const sanitizedUserNotes = (data?.clarificationRequest?.clarificationDescription);
    setUserNotes(sanitizedUserNotes);
    // }
  }, [applicationType, data]);

  useEffect(() => {
    checkApproveEnabled();
  }, [responseNotes, respondentName, selectedCommunicationMethod, documentTitle, uploadFileData]);

  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const changeHandler = async (event) => {
    console.log("Event received:", event);
    const filesArray = Array.from(event);


    const existingFileNames = files.map(file => file.name);
    const existingUploadedFileNames = uploadFileData.map(file => file?.file?.fileName);
    console.log("UploadedFiles:",uploadFileData);
    const duplicateFiles = filesArray.filter(file => 
      existingFileNames.includes(file.name) || 
      existingUploadedFileNames.includes(file.name)
    );
  
      if (duplicateFiles.length > 0) {
      ErrorToaster2(`File "${duplicateFiles[0].name}" already exists. Please upload a different file.`);
      return;
    }
  
    // If no duplicates, proceed with upload
    setFiles(prevFiles => [...prevFiles, ...filesArray]);

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
      const response = await POST(`application-management-service/application/${id}/files/bulk?isLLMRequired=${(clarificationType === "REQUEST_ADDITIONAL_DOCUMENTS" || clarificationType === 'NA') ? false : true}`, formData);
      console.log("API Response:", response);
      SuccessToaster('File Uploaded Successfully');
      console.log("Response data:", response?.data);
      setUploadFileData(prevData => {
        // Merge previous data with new data
        return [...(prevData || []), ...(response?.data || [])];
      });
      setIsLoadingImageDocs(false);
      console.log("Responseupload:", uploadFileData);
      return response?.data;
    } catch (error) {
      ErrorToaster('File Upload Failed');
      console.error("Error:", error);
      return null;
    }
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
    const hasValidComments = responseNotes.trim() !== '';
    const hasValidName = respondentName.trim() !== '';
    if (uploadFileData.length > 0) {
      // For files, check if all documents have titles
      const allFilesHaveTitles = uploadFileData.every((_, index) =>
        documentTitle[index] && documentTitle[index].trim() !== ''
      );

      setIsApproveEnabled(hasValidComments && allFilesHaveTitles && hasValidName && selectedCommunicationMethod);
    } else {
      // If no files are uploaded, only check for valid comments
      setIsApproveEnabled(hasValidComments && hasValidName && selectedCommunicationMethod);
    }
    // setIsApproveEnabled(hasValidComments && hasValidName && selectedCommunicationMethod);
  };

  const onClose = () => {
    // getActiveApplicationView(false);
    getIsOpen(false);
  };

  const getClarificationResponse = async () => {

    const files = (uploadFileData || []).map((item, index) => ({
      ...item.file,
      description: documentDesc[index] || "",
      title: documentTitle[index] || "",
    }));

    let temp = {
      clarificationResponseBy: "APPLICANT",
      responseMethod: selectedCommunicationMethod,
      title: respondentName,
      clarificationDescription: responseNotes,
      attachedDocuments: files
    };

    if (clarificationType !== undefined && clarificationType !== "" && clarificationType !== null && clarificationType !== 'NA') {
      if (clarificationType === "REQUEST_ADDITIONAL_DOCUMENTS") {
        temp["clarificationResponseType"] = "ADD_ADDITIONAL_DOCUMENTS";
      } else {
        temp["clarificationResponseType"] = "REPLACE_ORIGINAL_DOCUMENT";
      }
      temp["documents"] = uploadFileData;
    }

    await PUT(`application-management-service/application/${id}/form/${form?.id}/clarification/${data?.id}/response`, temp)
      .then(response => {
        console.log('successfull notes added');
        onClose();
        getApplication();
      })
      .catch((error) => {
        console.log(error);
      });
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
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div className={`${style.heading}`}>
                  Document Clarification Required for {data?.clarificationRequest?.clarificationRequiredFor} from {formDetails?.basicDetails?.applicant?.name?.firstName}{" "}{formDetails?.basicDetails?.applicant?.name?.lastName.toLowerCase()}
                </div>
                <div className={style.displayInRow}>
                  <Tooltip arrow title={"Click to Close"}>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                    onClick={() => {
                      getIsOpen(false);
                    }}
                  />
                  </Tooltip>
                </div>
              </div>
              {/* <div className={`${style.marginTop10} ${style.detailsTextStyle}`}>License / Certification Details</div>
          <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
              <div className={style.spaceBetween}>
                <div>
                    <div className={style.subHeadingtextStyle}>License/Certification Issued By</div>
                    <div className={style.subAnswerTextStyle}>Queen's University</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>License/Registration Number</div>
                    <div className={style.subAnswerTextStyle}>13578656</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>Licensure Type</div>
                    <div className={style.subAnswerTextStyle}>Independent</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>Expiry Date</div>
                    <div className={style.subAnswerTextStyle}>MM-DD-YYYY</div>
                </div>
                <div>
                    <div className={style.subHeadingtextStyle}>First Issued</div>
                    <div className={style.subAnswerTextStyle}>MM-DD-YYYY</div>
                </div>
              </div>
            </div> */}
              <div className={`${style.marginTop10}`}>
                <div className={`${style.textBoxTextStyle}`}>
                  Clarification Subject*
                </div>
                <CommonInputField
                  value={clarificationSubject}
                  // onChange={(e) => setClarificationSubject(e.target.value)}
                  className={style.marginTop5}
                  placeholder="Enter Subject"
                />
              </div>

              <div className={`${style.marginTop10} ${style.marginBottom5}`}>
                <div className={`${style.textBoxTextStyle}`}>
                  Specify the clarification that is needed*
                </div>
                <CKEditor
                  editor={ClassicEditor}
                  data={userNotes}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setUserNotes(data);
                  }}
                  config={{
                    placeholder: "Enter a Clarification You Needed",
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
                    const editorElement = editor.editing.view.document.getRoot();
                    editor.editing.view.change(writer => {
                      writer.setStyle(
                        'min-height',
                        '100px',
                        editorElement
                      );
                    });
                  }}
                  disabled
                />
              </div>
              <CommonDivider />

              <div className={`${style.marginTop10} ${style.clarificationHeadingTextStyle}`}>Clarification Response Documentation</div>
              <div className={`${style.textBoxTextStyle} ${style.marginTop5}`}>Response Method*</div>
              <div>
                <CommonSelectField
                  value={selectedCommunicationMethod}
                  onChange={(e) => setSelectedCommunicationMethod(e.target.value)}
                  className={style.fullWidth}
                  firstOptionLabel={'Select Responsive Method'}
                  firstOptionValue={''}
                  valueList={["Call Received", "Placed", "Fax Received", "In-Person Meeting", "External Email"]}
                  labelList={['Call Received', 'Placed', "Fax Received", "In-Person Meeting", "External Email"]}
                  disabledList={false}
                  required={false}
                // label={"Response Method*"}
                />
              </div>
              <div className={`${style.textBoxTextStyle} ${style.marginTop10}`}>Respondent Name*</div>
              <CommonInputField
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                className={style.marginTop5}
                placeholder="Enter Name"
              />
              <div className={`${style.textBoxTextStyle} ${style.marginTop10} ${style.marginBottom5}`}>Clarification Response*</div>
              <div>
                <CKEditor
                  editor={ClassicEditor}
                  data={responseNotes}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setResponseNotes(data);
                  }}
                  config={{
                    placeholder: "Document Clarification",
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
              <div className={`${style.marginTop10}`}>
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
                        <div className={`${style.uploadBorderStyle} ${style.cursorPointer}`}>
                          <div className={`${style.displayInRowCenter}`}>
                            <div className={style.uploadTextStyle}>
                              Upload Clarification Documents
                            </div>
                            <div className={`${style.textBoxTextStyle1}`}>
                              Upload files or drag & drop from your cabinet
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
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

              <div className={`${style.marginTop10} ${style.spaceBetween}`}>
                <div className={`${style.cursorPointer}`} onClick={() => getClarificationResponse()}>
                <Tooltip title="Click to Save Your Progress" arrow>
                  <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>SAVE IN PROGRESS</div>
                  </Tooltip>
                </div>
                <div
                  className={`${style.reviewButtonStyle} ${isApproveEnabled ? undefined : style.cursorPointer}`}
                  onClick={isApproveEnabled ? () => getClarificationResponse() : undefined}
                  style={{
                    cursor: isApproveEnabled ? 'pointer' : 'default',
                    opacity: isApproveEnabled ? 1 : 0.5
                  }}
                >
                  <Tooltip title={isApproveEnabled ? "Click to Save" : ""} arrow>
                  <div className={style.reviewButton}>SAVE</div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

        </Dialog>
      )}
    </>
  );
};

export default ClarificationDialog;
