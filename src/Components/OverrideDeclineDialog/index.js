import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from "./index.module.scss";
import CommonSwitch from "../CommonFields/CommonSwitch";
import CommonDateField from "../CommonFields/CommonDateField";
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonInputField from "../CommonFields/CommonInputField";
import ESignature from "../ESignature";
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import CryptoJS from 'crypto-js';
import { format, parseISO, differenceInDays } from 'date-fns';
import TextField from "@mui/material/TextField";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Dropzone from "react-dropzone";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DescriptionIcon from '@mui/icons-material/Description';
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import { Tooltip } from "@mui/material";

const OverRideDeclineDialog = ({ getIsOpen, getActiveApplicationView, dateFormat, selectedTab }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [formDetails, setFormDetails] = useState([]);
  const [userSelectRole, setUserSelectRole] = useState([]);
  const [selectedRoleCred, setSelectedRoleCred] = useState('');
  const [userSelectRoleDept, setUserSelectRoleDept] = useState([]);
  const [selectedRoleDept, setSelectedRoleDept] = useState('');
  const [userRoleComments, setUserRoleComments] = useState('');
  const [isChecked, setIsChecked] = useState(false);
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
  const [firstNameDept, setFirstNameDept] = useState('');
  const [lastNameDept, setLastNameDept] = useState('');
  const [middleNameDept, setMiddleNameDept] = useState('');
  const [uploadFileData, setUploadFileData] = useState('');
  const [documentDesc, setDocumentDesc] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
  const [isApproveEnabled, setIsApproveEnabled] = useState(false);
  const [entity, setEntity] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
  };
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const workModeType = sessionStorage.getItem('workModeType');
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const requestId = sessionStorage.getItem('requestId');
  const [logDetails, setLogDetails] = useState([]);
  const rawExpireDate = formDetails?.priorCyclePeriod?.to ?? null;
  const ExpireDate = rawExpireDate ? parseISO(rawExpireDate) : null;
  const formattedExpiringDate = ExpireDate ? format(new Date(ExpireDate), "MMM dd, yyyy") : "-";
  const daysRemaining = ExpireDate ? Math.abs(differenceInDays(new Date(ExpireDate), new Date())) : null

  useEffect(() => {
    getApplicantType();
    getApplicationUserRole();
    console.log("selectedRoleCred" + JSON.stringify(selectedRoleCred))
    console.log("selectedRoleDept" + JSON.stringify(selectedRoleDept))
  }, [formDetails])

  useEffect(() => {
    console.log('userSelectRole:', userSelectRole);
    console.log('userSelectRoleDept:', userSelectRoleDept);
    console.log('selectedRoleCred:', selectedRoleCred);
    console.log('selectedRoleDept:', selectedRoleDept);

    // Find the matched role by ID
    const matchedRole = userSelectRole?.find(role => role?.id === selectedRoleCred);
    const matchedRoleDept = userSelectRoleDept?.find(role => role?.id === selectedRoleDept);
    console.log('matchedRole:', matchedRole);
    console.log('matchedRoleDept:', matchedRoleDept);

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

    if (matchedRoleDept) {
      const { firstName, lastName, middleName } = matchedRoleDept?.name || {};
      console.log('firstNameDept:', firstName);
      console.log('lastNameDept:', lastName);

      // Set the state with the extracted values
      setFirstNameDept(firstName || '');
      setLastNameDept(lastName || '');
      setMiddleNameDept(middleName || '');
    }
  }, [userSelectRole, userSelectRoleDept, selectedRoleCred, selectedRoleDept]);

  useEffect(() => {
    if (userSelectRoleDept?.length === 1) {
      const singleUser = userSelectRoleDept[0];
      setSelectedRoleDept(singleUser?.id);
    }
  }, [userSelectRoleDept]);

  useEffect(() => {
    if (userSelectRole?.length === 1) {
      const singleUser = userSelectRole[0];
      setSelectedRoleCred(singleUser?.id);
    }
  }, [userSelectRole]);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    getApplication();
    getApplicationEntity();
    getLog();
  }, [applicationType]);


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

  // const getApplicationUserRole = async () => {
  //   try {
  //     const { data: basicFormRole } = await GET(`user/role?role=Credentialing Committee`);
  //     setUserSelectRole(basicFormRole);
  //   } catch (error) {
  //     console.error('Error fetching application:', error);
  //   }
  // };

  const getApplicationEntity = async () => {
    const { data: basicFormEntity } = await GET(`entity-service/entity/${TenantID}`);
    setEntity(basicFormEntity);
  };

  const getLog = async () => {
    const { data: basicLog } = await GET(`application-management-service/application/${id}/logs`);
    setLogDetails(basicLog);
    console.log("basicLog" + JSON.stringify(basicLog));

  };

  const getApplicationUserRole = async () => {
    try {
      const applicantfirstName = formDetails?.basicDetails?.applicant?.name?.firstName
      const applicantlastName = formDetails?.basicDetails?.applicant?.name?.lastName
      const applicantDepartmentId = formDetails?.basicDetailReferences?.department?.id
      // const applicantDepartmentId = "66dc4b370e34d3372e43f009"
      const applicantSpecialtyId = formDetails?.basicDetailReferences?.specialty?.id
      const { data: basicFormRole } = await GET(`user/role?role=Credentialing Committee`);

      const filteredRoles = basicFormRole.filter((user) => {
        const departmentList = user?.sites?.sites?.[0]?.departmentList?.departments || [];
        console.log("departmentList1111", departmentList);

        return departmentList.every((department) => {
          const isDepartmentMatch = department?.id !== applicantDepartmentId;
          console.log("matchedId", !isDepartmentMatch);
          console.log("applicantDepartmentId", applicantDepartmentId);

          return isDepartmentMatch;
        });
      });

      console.log("filteredRoles", filteredRoles);
      console.log("applicantNameCC", applicantfirstName)
      console.log("applicantNameCC", applicantlastName)
      const ccDataMember = filteredRoles.filter(
        (user) => !(user?.name?.firstName === applicantfirstName && user?.name?.lastName === applicantlastName)
      );

      return setUserSelectRole(ccDataMember);
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

  useEffect(() => {
    checkApproveEnabled();
  }, [userRoleComments, documentTitle, uploadFileData, isChecked, isSigned]);

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';
    const isLocum = applicationType === "LOCUM";

    if (files.length > 0) {
      const allFilesHaveTitles = files.every((_, index) =>
        documentTitle[index] && documentTitle[index].trim() !== ''
      );

      if (isLocum) {
        setIsApproveEnabled(hasValidComments && allFilesHaveTitles);
      } else {
        setIsApproveEnabled(hasValidComments && allFilesHaveTitles);
      }
    } else {
      if (isLocum) {
        setIsApproveEnabled(hasValidComments);
      } else {
        setIsApproveEnabled(hasValidComments);
      }
    }
  };

  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const OverRideRequestApplication = async () => {
    const temp = {
          notes: {
            notes: userRoleComments
          }
        }

    const newFormData = new FormData();
    files.forEach(file => {
      console.log(file.name);
      newFormData.append('documents', file);
    });
    newFormData.append(
      "response",
      new Blob([JSON.stringify({temp})], {
        type: "application/json",
      })
    );
    // newFormData.append("documents", []);
    await PUT(`application-management-service/application/request/${requestId}/response?workflowAction=REJECTED`, newFormData
    )
      .then((response) => {
        console.log(response?.data);
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const lastModifiedDate = formDetails?.lastModifiedDate;
  const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MM/dd/yyyy") : "-";
  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
  const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
  const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MM/dd/yyyy") : "-";
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
                  {`Locum Privileges ${
                    applicationType === "LOCUM"
                      ? `${formDetails?.reappointmentType === "EXTENSION" ? "Extension" : "Renewal"}`
                      : "Reappointment"
                  } Override Rejection By Chief Of Staff`}
                </div>
                <div className={style.displayInRow}>
                <Tooltip title="Click to Close" arrow>
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
              <div ref={componentRef} className={`${style.pagebreak}`}>
                <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle} ${style.marginTop10}`}>
                    <div className={style.marginTop10}>
                    <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                        <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                        <span className={style.rejectionHeadingTextStyle}>
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
                        <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
                          <span className={`${style.rejectionHeadingTextStyle}`}>
                            {formDetails?.basicDetails?.departmentSpecialty?.department || ""}
                            {formDetails?.basicDetails?.departmentSpecialty?.specialty
                              ? ` - ${formDetails.basicDetails.departmentSpecialty.specialty}`
                              : ""}
                          </span>
                        </div>
                        {entity?.multiSiteEntity && (
                        <div className={`${style.twoColumnGridInner}`}>
                            <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                            <span className={`${style.rejectionTextStyle1}`}>{entity?.multiSiteEntity?.[0]?.name || "-"}</span>
                        </div>
                        )}
                        <div className={`${style.twoColumnGridInner}`}>
                        <span className={`${style.rejectionTextStyle}`}>Expiration Date:</span>
                        <span className={`${style.rejectionTextStyle1}`}>{formattedExpiringDate}</span>
                        </div>
                        <div className={`${style.twoColumnGridInner}`}>
                        <span className={`${style.rejectionTextStyle}`}>{formDetails?.reappointmentType === "EXTENSION" ? "Days From Expiration :" : "Days Since Expiration :"}</span>
                        <span className={`${style.rejectionTextStyle1}`}> {formDetails?.reappointmentType === "EXTENSION" ? `${daysRemaining} days` : `${daysRemaining} days`}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
                  Enter your Notes / Comments for declining this Override Request *
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
                {files?.length > 0 && (
                <div>
                    {files?.map((file, index) => (
                    <div key={index} className={`${style.alignItem} ${style.marginTop10}`}>
                        <div className={`${style.threeColumnGrid}`}>
                        <div className={`${style.displayInRow} ${style.referenceCardStyle}`}>
                            <DescriptionIcon className={style.docsIcon} />
                            <div className={style.marginLeft20}>{file?.name}</div>
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
                <div className={`${style.marginTop}  ${style.reviewButtonContainer}`}>
                  <div className={` ${style.cursorPointer}`} onClick={() => getIsOpen(false)}>
                  <Tooltip title="Click to Close" arrow>
                    <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div></Tooltip>
                  </div>
                  <div
                    className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined} ${style.marginLeft}`}
                    onClick={OverRideRequestApplication}
                    style={{
                      pointerEvents: isApproveEnabled ? 'auto' : 'none',
                      opacity: isApproveEnabled ? 1 : 0.5
                    }}
                  >
                    <Tooltip title={isApproveEnabled ? "Click to reject Application from Override" : ""}arrow>
                    <div className={style.reviewButton}>Continue</div>
                    </Tooltip>
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

export default OverRideDeclineDialog;
