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

const ApprovalWithNotesDeptDialog = ({ getIsOpen, getActiveApplicationView, dateFormat, selectedTab }) => {
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
  }, [userRoleComments, documentTitle, selectedDateForDept, selectedRoleCred, selectedRoleDept, uploadFileData]);

  const checkApproveEnabled = () => {
    const hasValidComments = userRoleComments.trim() !== '';
    const hasValidMember = selectedRoleCred !== '';
    const hasValidMemberDept = selectedRoleDept !== '';

    // Check if there are any uploaded files
    if (uploadFileData.length > 0) {
      // For files, check if all documents have titles
      const allFilesHaveTitles = uploadFileData.every((_, index) =>
        documentTitle[index] && documentTitle[index].trim() !== ''
      );

      setIsApproveEnabled(hasValidMember && hasValidMemberDept && allFilesHaveTitles);
    } else {
      // If no files are uploaded, only check for valid comments
      setIsApproveEnabled(hasValidMember && hasValidMemberDept);
    }
  };

  const onClose = () => {
    getActiveApplicationView(false);
    getIsOpen(false);
  };

  // const onClickApproveMoveFunction = () => {
  //   handleApplicationApprove(true);
  //   getApplicationMoveToNext(true);
  //   // handleApplicationApproveDate(true);
  // }
  const onClickApproveMoveFunction = () => {
    handleApplicationApprove(true)
      .then(() => {
        return getApplicationMoveToNext(true);
      })
      .then(() => {
        console.log('Application successfully moved to next step.');
      })
      .catch((error) => {
        console.error('Error processing application:', error);
      });
  };

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
    let role;
    let title;
    const files = (uploadFileData || []).map((item, index) => ({
      ...item.file,
      description: documentDesc[index] || "",
      title: documentTitle[index] || "",
    }));
    let isDelegate = true;
    if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        title = "Dept. Head / Chief Review";
      } else {
        title = "Dept. Head / Chief Review";
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        title = "Credentialing Committee Review";
      } else if (workModeType === "Chief Of Staff") {
        title = "Chief Of Staff Review";
      }
    } else if (selectedTab === 'level-4') {
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      if (workModeType === "Staff Manager") {
        role = "Staff Manager";
        isDelegate = false;
        title = "Staff Manager Verification";
      } else {
        role = "Staff Manager";
        title = "Staff Manager Verification";
      }
    }

    const payload = {
      // notes: userRoleComments,
      role: isDelegate ? role : "",
      notes: {
        notes: userRoleComments
      },
      title: title,
      approvedDate: new Date().toISOString(),
      // userDetail:{
      //   id: selectedRoleCred,
      //   role: "Credentialing Committee"
      // } 
      userDetail: [
        {
          id: selectedRoleCred,
          name: {
            firstName: firstName,
            lastName: lastName,
            middleName: middleName
          },
          role: "Credentialing Committee"
        },
        {
          id: selectedRoleDept,
          name: {
            firstName: firstNameDept,
            lastName: lastNameDept,
            middleName: middleNameDept
          },
          role: "Department Head"
        }
      ],
      files: files || [],
      // upcomingCredCommitteeMeetingDate: selectedDateForDept || ''
    };

    await PUT(
      `application-management-service/application/${id}/workflow/complete/APPROVED?isDelegate=${isDelegate}&approvalType=VERIFIED_AND_ACCEPTED`,
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
    let role;
    let title;
    const files = (uploadFileData || []).map((item, index) => ({
      ...item.file,
      description: documentDesc[index] || "",
      title: documentTitle[index] || "",
    }));
    let isDelegate = true;
    if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        title = "Dept. Head / Chief Review";
      } else {
        title = "Dept. Head / Chief Review";
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        title = "Credentialing Committee Review";
      } else if (workModeType === "Chief Of Staff") {
        title = "Chief Of Staff Review";
      }
    } else if (selectedTab === 'level-4') {
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      if (workModeType === "Staff Manager") {
        role = "Staff Manager";
        isDelegate = false;
        title = "Staff Manager Verification";
      } else {
        role = "Staff Manager";
        title = "Staff Manager Verification";
      }
    }


    const payload = {
      // notes: userRoleComments,
      role: isDelegate ? role : "",
      notes: {
        notes: userRoleComments
      },
      title: title,
      approvedDate: new Date().toISOString(),
      userDetail: [
        {
          id: selectedRoleCred,
          name: {
            firstName: firstName,
            lastName: lastName,
            middleName: middleName
          },
          role: "Credentialing Committee"
        },
        {
          id: selectedRoleDept,
          name: {
            firstName: firstNameDept,
            lastName: lastNameDept,
            middleName: middleNameDept
          },
          role: "Department Head"
        }
      ],
      files: files,
      //  upcomingCredCommitteeMeetingDate: selectedDateForDept || ""
    };

    await PUT(`application-management-service/application/${id}/workflow/move?workflowAction=APPROVED&isDelegate=${isDelegate}`, payload)
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
              <span className={`${style.Subheading}`}>{isUser ? "Applicant is designated as Department Head" : ""}</span>
              <div className={style.spaceBetween}>
                <div className={`${style.heading}`}>
                  {isUser ? "SEND TO CHIEF / DEP COS FOR REVIEW" : "SEND TO DEPARTMENT HEAD FOR REVIEW"}
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
                            : ""}
                        </span>
                          <span className={`${style.rejectionTextStyle}`}>
                            {", "}{formDetails?.providerType?.serviceProviderType}
                          </span>
                        </div>
                        <div>
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
                  {isUser ? " Provide notes, if any, for the Chief / Deputy COS regarding this application(Optional)" : " Provide notes, if any, for the Department Head regarding this application(Optional)"}
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
                <div className={`${style.twoColumnGridDropDown} ${style.marginTop10}`}>
                  <div>
                    <CommonSelectField
                      value={selectedRoleDept}
                      onChange={(e) => setSelectedRoleDept(e.target.value)}
                      className={style.fullWidth}
                      firstOptionLabel={''}
                      firstOptionValue={''}
                      // valueList={["HIGH", "NO"]}
                      // labelList={['High Priority', 'No Priority']}
                      valueList={userSelectRoleDept?.map(data => data?.id)}
                      // labelList={userSelectRoleDept?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`)}
                      labelList={userSelectRoleDept?.map(data => {
                        const primaryTitle = data?.title?.title || "";
                        const secondaryTitle = data?.secondaryTitle?.title || "";
                        const combinedTitle = secondaryTitle
                          ? `${primaryTitle} & ${secondaryTitle}`
                          : primaryTitle;
                        // const departmentName = data?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.departmentName?.name;
                        const departmentName = data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                          department => department?.departmentName?.name
                        ).join(', ');
                        let label = `${data?.name?.firstName} ${data?.name?.lastName}, ${combinedTitle}`;

                        if (departmentName) {
                          label += `- ${departmentName}`;
                        }

                        return label;
                      })}
                      disabledList={false}
                      required={false}
                      // label="Assign a Department Head to Review & Approve*"
                      label={isUser ? "Assign a Chief / Dep COS to Review & Approve*" : "Assign a Department Head to Review & Approve*"}
                    />
                  </div>
                  {/* <div>
              <CommonDateField
                className={style.fullWidth}
                onChange={(date) => handleDateChange(date)}
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
              </div> */}
                  <div>
                    <CommonSelectField
                      value={selectedRoleCred}
                      onChange={(e) => setSelectedRoleCred(e.target.value)}
                      className={style.fullWidth}
                      firstOptionLabel={''}
                      firstOptionValue={''}
                      valueList={userSelectRole?.map(data => data?.id)}
                      // labelList={userSelectRole?.map(data => `${data.name.firstName} ${data.name.lastName}`)}
                      labelList={userSelectRole?.map(data => {
                        const primaryTitle = data?.title?.title || "";
                        const secondaryTitle = data?.secondaryTitle?.title || "";
                        const combinedTitle = secondaryTitle
                          ? `${primaryTitle} & ${secondaryTitle}`
                          : primaryTitle;
                        const departmentName = data?.sites?.sites?.[0]?.departmentList?.departments?.map(
                          department => department?.departmentName?.name
                        ).join(', ');
                        let label = `${data?.name?.firstName} ${data?.name?.lastName}, ${combinedTitle}`;

                        if (departmentName) {
                          label += `- ${departmentName}`;
                        }

                        return label;
                      })}
                      disabledList={false}
                      required={false}
                      label="Assign a Credentialing Committee Member to Review & Approve*"
                    />
                  </div>

                </div>

                <div className={`${style.marginTop}  ${style.reviewButtonContainer}`}>
                  <div className={` ${style.cursorPointer}`} onClick={() => getIsOpen(false)}>
                    <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div>
                  </div>
                  <div
                    className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined} ${style.marginLeft}`}
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
