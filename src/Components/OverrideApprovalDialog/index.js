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
import { format, sub, add } from 'date-fns';
import TextField from "@mui/material/TextField";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Dropzone from "react-dropzone";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DescriptionIcon from '@mui/icons-material/Description';
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import { Tooltip } from "@mui/material";

const OverRideApprovalDialog = ({ getIsOpen, getActiveApplicationView, dateFormat, selectedTab }) => {
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
    // getApplicationChief();
    getApplicationUserRoleDept();
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


  // useEffect(() => {
  //   checkApproveEnabled();
  // }, [isChecked, userRoleComments, isSigned]);

  const getApplicantType = async () => {
    const { data: applicant } = await GET(
      `entity-service/applicantType`
    );
    setApplicantType(applicant);
  }
  
  const checkRequirements = () => {
  return isChecked
};


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


  // const getApplicationUserRoleDept = async () => {
  //   const applicantfirstName = formDetails?.basicDetails?.applicant?.name?.firstName
  //   const applicantlastName = formDetails?.basicDetails?.applicant?.name?.lastName
  //   const applicantDepartmentId = formDetails?.basicDetailReferences?.department?.id
  //   // const applicantDepartmentId = "66dc4b370e34d3372e43f009"
  //   const applicantSpecialtyId = formDetails?.basicDetailReferences?.specialty?.id
  //   try {
  //     const { data: basicFormRole } = await GET(`user/role?role=Department Head`);

  //     const filteredRoles = basicFormRole.filter(
  //       (user) => !(user?.name?.firstName === applicantfirstName && user?.name?.lastName === applicantlastName)
  //     );
  //     setUserSelectRoleDept(filteredRoles);
  //   } catch (error) {
  //     console.error('Error fetching application:', error);
  //   }
  // };

  // const getApplicationUserRoleDept = async () => {
  //   try {
  //     const applicantfirstName = formDetails?.basicDetails?.applicant?.name?.firstName
  //     const applicantlastName = formDetails?.basicDetails?.applicant?.name?.lastName
  //     const applicantDepartmentId = formDetails?.basicDetailReferences?.department?.id
  //     const applicantSpecialtyId = formDetails?.basicDetailReferences?.specialty?.id
  //     const applicantEmailId = formDetails?.basicDetails?.applicant?.email?.officialEmail

  //     const { data: basicFormRole } = await GET(`user/role?role=Department Head`);

  //     const filteredRoles = basicFormRole.filter((user) => {
  //       const departmentList = user?.sites?.sites?.[0]?.departmentList?.departments || [];
  //       console.log("departmentList1111", departmentList);

  //       return departmentList.some((department) => {
  //         const isDepartmentMatch = department?.id === applicantDepartmentId;
  //         console.log("matchedId", isDepartmentMatch);
  //         console.log("applicantDepartmentId",applicantDepartmentId)

  //         if (!isDepartmentMatch) return false;

  //         if (department?.serviceAreaSpecific) {
  //           return department?.serviceAreas?.some(
  //             (area) => area?.id === applicantSpecialtyId
  //           );
  //         }
  //         return true;
  //       });
  //     });

  //     console.log("filteredRolessss", filteredRoles);
  //     console.log("applicantName",applicantfirstName)
  //     console.log("applicantName",applicantlastName)
  //     const deptDataMember = filteredRoles.filter(
  //             (user) => !(user?.name?.firstName === applicantfirstName && user?.name?.lastName === applicantlastName)
  //           );
  //     const { data: basicFormRoleCos } = await GET(`user/role?role=Chief Of Staff`);
  //     const { data: basicRole } = await GET(`user?email=${applicantEmailId}`);
  //     const combinedData = [...deptDataMember, ...basicFormRoleCos];
  //     // return setUserSelectRoleDept(deptDataMember);

  //     const uniqueUsers = combinedData?.filter((user, index, self) => 
  //       index === self.findIndex((u) => u?.id === user?.id)
  //     );
  //     setUserSelectRoleDept(uniqueUsers);
  //     // setUserSelectRoleDept(combinedData);

  //   } catch (error) {
  //     console.error("Error fetching application user role:", error);
  //     return [];
  //   }
  // };  

  const getApplicationUserRoleDept = async () => {
    try {
      setIsLoadingImage(true);
      const applicantFirstName = formDetails?.basicDetails?.applicant?.name?.firstName;
      const applicantLastName = formDetails?.basicDetails?.applicant?.name?.lastName;
      const applicantDepartmentId = formDetails?.basicDetailReferences?.department?.id;
      const applicantSpecialtyId = formDetails?.basicDetailReferences?.specialty?.id;
      const applicantEmailId = formDetails?.basicDetails?.applicant?.email?.officialEmail;

      const { data: basicFormRole } = await GET(`user/role?role=Department Head`);
      const { data: basicFormRoleCos } = await GET(`user/role?role=Chief Of Staff`);

      const { data: basicRole } = await GET(`user?email=${applicantEmailId}`);
      const user = basicRole?.[0];

      const isDepartmentHead = user?.roles?.some(role => role?.roleName === "Department Head");

      console.log("isDepartmentHead:", isDepartmentHead);

      let userRolesData = [];

      if (isDepartmentHead) {
        // const { data: basicFormRoleCos } = await GET(`user/role?role=Chief Of Staff`);
        userRolesData = basicFormRoleCos.filter(
          user => !(
            user?.name?.firstName?.toLowerCase() === applicantFirstName?.toLowerCase() &&
            user?.name?.lastName?.toLowerCase() === applicantLastName?.toLowerCase()
          )
        );
        setIsUser(true)
      } else {
        userRolesData = basicFormRole;

        userRolesData = userRolesData.filter(user => {
          const departmentList = user?.sites?.sites?.[0]?.departmentList?.departments || [];
          return departmentList.some(department => {
            const isDepartmentMatch = department?.id === applicantDepartmentId;
            if (!isDepartmentMatch) return false;
            if (department?.serviceAreaSpecific) {
              return department?.serviceAreas?.some(
                (area) => area?.id === applicantSpecialtyId
              );
            }
            return true;
          });
        });

        userRolesData = [...userRolesData, ...basicFormRoleCos];

        userRolesData = userRolesData?.filter((user, index, self) =>
          index === self.findIndex((u) => u?.id === user?.id)
        );

        userRolesData = userRolesData.filter(
          user => !(
            user?.name?.firstName?.toLowerCase() === applicantFirstName?.toLowerCase() &&
            user?.name?.lastName?.toLowerCase() === applicantLastName?.toLowerCase()
          )
        );
        setIsUser(false)
      }

      setUserSelectRoleDept(userRolesData);
      setIsLoadingImage(false);
    } catch (error) {
      console.error("Error fetching application user role:", error);
    }
  };

  // const getApplicationChief = async () => {
  //   try {
  //     setIsLoadingImage(true);
  //     const { data: basicFormRoleCos } = await GET(`user/role?role=Chief Of Staff`);
  //     console.log(basicFormRoleCos)
  //   } catch (error) {
  //     console.error('Error fetching application:', error);
  //   }
  // };

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

  // const checkRequirements = () => {
  //   return userRole.includes('Chief Of Staff')
  //     ? isChecked.isChecked1
  //     : (isChecked.isChecked2 && isChecked.isChecked3);
  // };

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
  }, [userRoleComments, documentTitle, uploadFileData, isChecked, isSigned]);

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';
    const isLocum = applicationType === "LOCUM";

    if (uploadFileData.length > 0) {
      const allFilesHaveTitles = uploadFileData.every((_, index) =>
        documentTitle[index] && documentTitle[index].trim() !== ''
      );

      if (isLocum) {
        setIsApproveEnabled(hasValidComments && allFilesHaveTitles && isSigned);
      } else {
        setIsApproveEnabled(hasValidComments && allFilesHaveTitles);
      }
    } else {
      if (isLocum) {
        setIsApproveEnabled(hasValidComments && isSigned);
      } else {
        setIsApproveEnabled(hasValidComments);
      }
    }
  };

  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  const reappointmentRequestApplication = async () => {
    const temp = {
          notes: {
            notes: userRoleComments
          },
          staffEsign: {
            esign: encryptedText,
            name : name,
            signedDate : currentDate
          }
        }

    const newFormData = new FormData();
    newFormData.append(
      "response",
      new Blob([JSON.stringify({temp})], {
        type: "application/json",
      })
    );
    newFormData.append("documents", []);
    await PUT(`application-management-service/application/request/${requestId}/response?workflowAction=APPROVED`, newFormData
    )
      .then((response) => {
        console.log(response?.data);
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
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
                  } Override Approval by Chief Of Staff`}
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
                  <div className={`${style.marginTop10} ${style.displayInRowCenter}`}>
                    <div className={`${style.gridContainer2} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                      <div className={`${style.gridRow}`}>
                        <div className={style.gridItem1}><span className={style.rejectionHeadingTextStyle}>
                          {formDetails?.basicDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() +
                            formDetails?.basicDetails?.applicant?.name?.lastName?.slice(1).toLowerCase()}{", "}
                          {formDetails?.basicDetails?.applicant?.name?.firstName
                            ? formDetails.basicDetails.applicant.name.firstName.charAt(0).toUpperCase() +
                            formDetails.basicDetails.applicant.name.firstName.slice(1).toLowerCase()
                            : ""}{" "}
                        </span>
                          <span className={`${style.rejectionTextStyle} ${style.marginLeft4}`}>
                          {applicationType === "LOCUM" ? "Locum":""} {formDetails?.providerType?.serviceProviderType}
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
                              : ""}{formDetails?.updatedBy?.name?.lastName?.toUpperCase()}, {formDetails?.updatedBy?.title?.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
            Provide notes, if any, for the Department Head regarding this application(Optional)
            </div> */}
                <div className={`${style.marginTop} ${style.commentsNotesHeadingFontStyle}`}>
                  Notes for Override Approval *
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
                <CommonCheckBox
                    className={`${style.marginTop}`}
                    label={formatLabel("I as the Chief of Staff recommend the Privilege Extension for {ApplicantName} as per the criteria and standards established by {EntityName}’s bylaws and policies. This Recommendation is contingent upon the fulfillment of all required qualifications and obligations as outlined in the medical staff bylaws.", dynamicValues)}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <div className={style.twoCol}>
              <div
                onClick={!checkRequirements() ? () => { } : onClicksignFunction}
                className={!checkRequirements() ? style.disabled : style.signatureContainer}
              >
                <ESignature
                  // userName={isSigned ? name : ""}
                  encData={isSigned ? encryptedText : ''}
                  showData={isSigned}
                  showDatais={true}
                  alternateSignature={isSigned ? `${name}` : ""}
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
                <div className={`${style.marginTop}  ${style.reviewButtonContainer}`}>
                  <div className={` ${style.cursorPointer}`} onClick={() => getIsOpen(false)}>
                  <Tooltip title="Click to Close" arrow>
                    <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div></Tooltip>
                  </div>
                  <div
                    className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined} ${style.marginLeft}`}
                    onClick={reappointmentRequestApplication}
                    style={{
                      pointerEvents: isApproveEnabled ? 'auto' : 'none',
                      opacity: isApproveEnabled ? 1 : 0.5
                    }}
                  >
                    <Tooltip title={isApproveEnabled ? "Click to Send Application for Review" : ""}arrow>
                    <div className={style.reviewButton}>OVERRIDE</div>
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

export default OverRideApprovalDialog;
