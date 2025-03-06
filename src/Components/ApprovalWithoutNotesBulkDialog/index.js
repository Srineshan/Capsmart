import React, { useState, useEffect } from "react";
import { GET, PUT,POST, TenantID } from "../../Screens/dataSaver";
import { Dialog } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import { format } from "date-fns";
import { ErrorToaster, SuccessToaster } from "../../utils/toaster";
import style from "./index.module.scss";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Dropzone from "react-dropzone";
import DescriptionIcon from '@mui/icons-material/Description';
import CommonInputField from "../CommonFields/CommonInputField";
import { fileLoadingURL } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import { TRUE } from "sass";

const BulkApproveDialog = ({ checkedIds, getBulkApproveDialogOpen, onClose }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const temp = Array.isArray(checkedIds) ? checkedIds : [checkedIds];
  const [multiFormDetails, setMultiFormDetails] = useState([]);
  const [multiLogDetails, setMultiLogDetails] = useState([]);
  const [entity, setEntity] = useState([]);
  const [userRoleComments, setUserRoleComments] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
  const [uploadFileData, setUploadFileData] = useState('');
  const [documentDesc, setDocumentDesc] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
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
    getApplicationLog();
    getApplicationEntity();
  }, [checkedIds]);

   useEffect(() => {
      checkApproveEnabled();
      console.log("uploadFileData",uploadFileData)
    }, [userRoleComments, documentTitle, uploadFileData]);

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
    const uploadPromises = checkedIds.map(async (id) => {
        return POST(`application-management-service/application/${id}/files/bulk?isLLMRequired=${false}`, formData);
    });
    const response = await Promise.all(uploadPromises);
    console.log("API Response:", response);
    SuccessToaster('File Uploaded Successfully');
    console.log("Response data:", response?.data);
    setUploadFileData(prevData => {
        // Merge previous data with new data
        return [...(prevData || []), ...(response[0]?.data || [])];
    });
    console.log("...........11",uploadFileData)
    setIsLoadingImageDocs(false);
    console.log("...........11",uploadFileData)
    return response?.data;
    } catch (error) {
    ErrorToaster('File Upload Failed');
    console.error("Error:", error);
    return null;
    }
};  

  const getApplication = async () => {
    try {
      setIsLoadingImage(true);
      const applicationPromises = temp.map(async (id) => {
        const { data: basicForm } = await GET(`application-management-service/application/${id}`);
        return basicForm;
      });

      const applications = await Promise.all(applicationPromises);
      setMultiFormDetails(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      ErrorToaster("Error fetching applications.");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const getApplicationLog = async () => {
    try {
      setIsLoadingImage(true);
      const logPromises = temp.map(async (id) => {
        const { data: logData } = await GET(`application-management-service/application/${id}/logs`);
        return logData;
      });

      const logs = await Promise.all(logPromises);
      setMultiLogDetails(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      ErrorToaster("Error fetching application logs.");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const getApplicationEntity = async () => {
    try {
      const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
      setEntity(basicFormEntity);
    } catch (error) {
      console.error("Error fetching entity:", error);
    }
  };

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';
    
    if (uploadFileData.length > 0) {
      const allFilesHaveTitles = uploadFileData.every((_, index) => 
        documentTitle[index] && documentTitle[index].trim() !== ''
      );
      
      setIsApproveEnabled(hasValidComments && allFilesHaveTitles);
    } else {
      setIsApproveEnabled(hasValidComments);
    }
  };

 const handleApplicationApprove = async () => {
     let role;
     let title;
     const files = (uploadFileData || []).map((item, index) => ({
       ...item.file,              
       description: documentDesc[index] || "",
       title: documentTitle[index] || "", 
     }));
     let notesComments = userRoleComments;
     let isDelegate = true;
     let applicationIdsParam = checkedIds?.length
    ? checkedIds.map(id => `&applicationIds=${id}`).join("")
    : "";
 
     // Prepare the payload
     let temp = {
       role: "Credentialing Committee",
       notes: {
         notes: notesComments
       },
       approvedDate: new Date().toISOString(),
       title: "Credentialing Committee User Review",
       files: files
     };
 
     await PUT(`application-management-service/application/workflow/completeAndMove/bulk/APPROVED?isDelegate=${isDelegate}&approvalType=RECOMMENDED_WITH_NOTES${applicationIdsParam}`, temp)
       .then(response => {
         console.log('success');
         onClose();
       })
       .catch((error) => {
         console.log(error);
       });
   };

  const renderApplicationDetails = () => {
    return multiFormDetails.map((formDetails, index) => {
      const logDetails = multiLogDetails[index] || {};
      const lastModifiedDate = formDetails?.lastModifiedDate;
      const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
      const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
      const lastSubmittedDate = lastSubmittedLog?.lastModifiedDate;
      const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MMM dd, yyyy") : "-";

      return (
        <div key={formDetails?.displayId} className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
          <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
            <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
              <span className={style.rejectionHeadingTextStyle}>
              {formDetails?.basicDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() + formDetails?.basicDetails?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
              {formDetails?.basicDetails?.applicant?.name?.firstName
              ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
              : ""}{", "}
                {/* {formDetails?.basicDetails?.applicant?.name?.firstName}{" "}
                {formDetails?.basicDetails?.applicant?.name?.lastName?.toLowerCase()},{" "} */}
              </span>
              <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>
                {formDetails?.providerType?.serviceProviderType}
              </div>
            </div>
            <div>
              <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>
                {formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || "-"}
              </span>
            </div>
          </div>
          <div className={style.marginTop10}>
            <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Department:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.basicDetails?.departmentSpecialty?.department || "-"}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Application ID:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.displayId || "-"}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Division / Specialty:</span>
                <span className={style.rejectionTextStyle1}>{formDetails?.basicDetails?.departmentSpecialty?.specialty || "-"}</span>
              </div>
              {entity?.multiSiteEntity && (
                <div className={style.twoColumnGridInner}>
                  <span className={style.rejectionTextStyle}>Site Name:</span>
                  <span className={style.rejectionTextStyle1}>{entity?.multiSiteEntity?.[0]?.name || "-"}</span>
                </div>
              )}
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Submission Date:</span>
                <span className={style.rejectionTextStyle1}>{formattedSubmissionDate}</span>
              </div>
              <div className={style.twoColumnGridInner}>
                <span className={style.rejectionTextStyle}>Last Updated:</span>
                <span className={style.rejectionTextStyle1}>{formattedDate}</span>
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
      );
    });
  };

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
        <div  className={style.loadingOverlay}>
          <LoadingScreen/>
        </div>
      )}
      {!isLoadingImage && (
    <Dialog
      isOpen={getBulkApproveDialogOpen}
      onClose={onClose}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={style.templateHeader}>
          <div className={style.templateHeadertext}>Staff Reappointments Approved by the Cred. Comm.</div>
          <img src={CrossPink} alt="close" className={`${style.crossStyle} ${style.cursorPointer}`} onClick={onClose} />
        </div>
        {renderApplicationDetails()}
        <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
           Notes /Comments By The Cred Comm*
        </div>
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
                    <>
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
                    </>
                )}
                </Dropzone>
            </>
            </div>
            {uploadFileData?.length > 0 && (
            <div>
                {uploadFileData?.map((file, index) => (
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
        <div className={`${style.actionButtons} ${style.marginTop}`}>
          <div className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined}`}
          style={{ 
            pointerEvents: isApproveEnabled ? 'auto' : 'none', 
            opacity: isApproveEnabled ? 1 : 0.5 
            }}
           onClick={handleApplicationApprove}>
            <div className={style.reviewButton}>Save</div>
          </div>
        </div>
      </div>
    </Dialog>
      )}
    </>
  );
};

export default BulkApproveDialog;
