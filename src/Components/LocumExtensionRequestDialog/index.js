import React, { useState, useEffect, useCallback, useRef } from "react";
import { GET, PUT, POST, DELETE, TenantID } from "../../Screens/dataSaver";
import CryptoJS from "crypto-js";
import { Dialog, Classes, TextArea } from "@blueprintjs/core";
import CrossPink from "../../images/crossPink.png";
import VerifiedImage from "../../images/verifiedImage.png";
import ToBeVerifiedImage from "../../images/toBeVerifiedImage.png";
import ImgDoc from "../../images/imgDoc.png";
import PdfDoc from "../../images/pdfDoc.png";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import { Tooltip } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Cookie from "universal-cookie";
import jwt from "jwt-decode";
import style from "./index.module.scss";
import { format, differenceInDays ,addDays, sub, add} from "date-fns";
import { fileLoadingURL } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonInputField from "../CommonFields/CommonInputField";
import TextField from "@mui/material/TextField";
import CommonRadio from "../CommonFields/CommonRadio";
import CommonDateField from "../CommonFields/CommonDateField";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Dropzone from "react-dropzone";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DescriptionIcon from '@mui/icons-material/Description';
import CancelIcon from '@mui/icons-material/Cancel';
import DatalistInput from 'react-datalist-input';

const LocumExtensiveRequestDialog = ({ getIsOpen,tableDataValue }) => {
 let cookie = new Cookie();
 let userDetails = cookie.get("user");
 const users = jwt(userDetails);
 const [userRole, setUserRole] = useState("");
 const [formDetails, setFormDetails] = useState([]);
 const [formIndex, setFormIndex] = useState(0);
 const [isApproveEnabled, setIsApproveEnabled] = useState(false);
 const id = sessionStorage.getItem("applicationId");
 const [entity, setEntity] = useState([]);
 const [applicationType, setApplicationType] = useState(() => sessionStorage.getItem("applicationCreationType") || "NEW");
 const [isLoadingImage, setIsLoadingImage] = useState(false);
 const [processReappointment, setProcessReappointment] = useState("Yes");
 const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "dd MMMM yyyy"));
 const [calendarStart, setCalendarStart] = useState(false);
 const [customEndDate, setCustomEndDate] = useState(null);
 const [customDate, setCustomDate] = useState(null);
//  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
 const [showSelectedPrivilegeLocum, setShowSelectedPrivilegeLocum] = useState(false);
 const [selectDataLocum, setSelectDataLocum] = useState([]);
 const [selectedDepartment, setSelectedDepartment] = useState("");
 const [selectedSpeciality, setSelectedSpeciality] = useState("");
 const [userRoleComments, setUserRoleComments] = useState('');
 const [uploadFileData, setUploadFileData] = useState('');
 const [documentDesc, setDocumentDesc] = useState("");
 const [documentTitle, setDocumentTitle] = useState("");
 const [files, setFiles] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
 const [selectApplicant, setSelectApplicant] = useState([]);
 const [applicantOptions, setApplicantOptions] = useState([]);
 const [covererNameList, setCovererNameList] = useState([]);
 const [covererName, setCovererName] = useState("");
 const [covererId, setCovererId] = useState("");
 const [isChecked, setIsChecked] = useState("departmentHead");
 const workModeType = sessionStorage.getItem("workModeType");
 let name = `${formDetails?.basicDetails?.applicant?.name?.firstName} ${formDetails?.basicDetails?.applicant?.name?.lastName} `;
 const dropzoneStyle = {
  width: "100%",
  height: "auto",
  borderWidth: 2,
  borderColor: "rgb(102, 102, 102)",
  borderStyle: "dashed",
  borderRadius: 5,
};

 console.log("tableDataValue",tableDataValue)
 useEffect(() => {
  sessionStorage.setItem("fromSummary", false);
  getApplication();
  getApplicationEntity();
  getActiveUserData();
 }, [applicationType, id]);

 useEffect(() => {
  getActiveUserData();
 }, []);

   useEffect(() => {
    if (selectedMonth === 'custom') {
      setCustomDate(new Date());
      console.log("selectedMonth",selectedMonth)
    } else {
      setCustomDate(null);
      console.log("selectedMonthssssss",selectedMonth)
    }
  }, [selectedMonth]);

 useEffect(() => {
  setSelectedDepartment(formDetails?.basicDetailReferences?.department?.id);
  setSelectedSpeciality(formDetails?.basicDetailReferences?.specialty?.id);
 }, [formDetails]);

let userDepartmentList;
  let userSpecialty;
  const userDetailsFetchOption = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
      userDepartmentList = userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.id;
      userSpecialty = userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.serviceAreas[0]?.id;
      console.log("userSpecialty",userDepartmentList,userSpecialty)
    }, [])

const getActiveUserData = async () => {
    try {
      const url = `application-management-service/staff?status=ACTIVE&type=LOCUM`;
      const response = await GET(url);
      const staffs = response?.data?.staffs || [];

      const filteredData = staffs.find(item => item?.currentApplication?.id === id);
      console.log("Filtered Application Data", filteredData);
      setSelectDataLocum(filteredData);
      console.log("applicationmanage",selectDataLocum)
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

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
        console.log("...........11",uploadFileData)
        setIsLoadingImageDocs(false);
        console.log("...........11",uploadFileData)
        return response?.data;
      } catch (error) {
        ErrorToaster('File Upload Failed');
        console.error("Error:", error);
        setIsLoading(false);
        return null;
      }
    }; 

    // const handleCheckboxChange = (checkboxName) => (event) => {
    //   const newIsChecked = {
    //     ...isChecked,
    //     [checkboxName]: event.target.checked,
    //   };
    //   setIsChecked(newIsChecked);
    // };

    const handleCheckboxChange = (option) => () => {
      setIsChecked(option);
    };

    const getItemsSingle = (data) => {
      let temp = [];
      data?.map((data) => {
        temp.push({ id: data?.id, label: data?.label, value: data?.value });
      });
      console.log("getItems", temp, data)
      return temp;
  
    };

    const handleRemoveChip = (index) => {
      const updatedList = covererNameList.filter((_, i) => i !== index);
      setCovererNameList(updatedList);
    };

    useEffect(() => {
        const fetchDepartmentStaffs = async () => {
          try {
            const currentApplicantId = formDetails?.applicant?.id;
            const departmentId = formDetails?.basicDetailReferences?.department?.id;
            const applicantTypeId = formDetails?.basicDetailReferences?.applicantType?.id;
            const response = await GET(
              `application-management-service/staff?status=ACTIVE&departmentId=${departmentId}&applicantTypeId=${applicantTypeId}&sortByField=STAFF_NAME`
            );
            console.log(response.data);
    
            const filteredStaffs = response.data.staffs.filter(
              (staff) => staff.applicant.id !== currentApplicantId
            );
            setSelectApplicant(filteredStaffs)
            console.log("appselect", selectApplicant)
            const options = filteredStaffs.map((staff) => ({
              id: `${staff.id}`,
              value: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName} ${staff?.basicDetailReferences?.specialty?.name !== undefined ? `- ${staff?.basicDetailReferences?.specialty?.name}` : ''}`,
              label: `${staff.applicant.name.firstName} ${staff.applicant.name.middleName} ${staff.applicant.name.lastName} ${staff?.basicDetailReferences?.specialty?.name !== undefined ? `- ${staff?.basicDetailReferences?.specialty?.name}` : ''}`,
            }));
            setApplicantOptions(options);
            console.log(options)
          } catch (error) {
            console.error("Error fetching department staffs:", error);
          }
        };
    
        fetchDepartmentStaffs();
      }, [formDetails]);

      const reappointmentRequestApplication = async () => {
        const ExpireDate = selectDataLocum?.tenure?.to;
        const fromDate = format(addDays(new Date(ExpireDate), 1), 'yyyy-MM-dd');
        const toDate = format(new Date(selectedMonth), 'yyyy-MM-dd');
        const DepartmentId = selectDataLocum?.basicDetailReferences?.department?.id || "" ;
        const speciltyId = selectDataLocum?.basicDetailReferences?.specialty?.id || "" ;
      
        const coveredDetails = covererNameList?.map((data) => {
          const applicantData = selectApplicant?.find(optionData => optionData?.id === data);
          const fullName = `${applicantData?.applicant?.name?.firstName || ''} ${applicantData?.applicant?.name?.middleName || ''} ${applicantData?.applicant?.name?.lastName || ''}`.trim();
      
          return {
            id: data,
            name: fullName,
          };
        });
      
        const files = (uploadFileData || []).map((item, index) => ({
          ...item.file,
          description: documentDesc[index] || "",
          title: documentTitle[index] || "",
        }));
      
        const temp = {
          requestType: 'LOCUM_RENEWAL_REQUEST',
          staff: {
            id: selectDataLocum?.id
          },
          locumRenewalDetails: {
            tenure: {
              from: fromDate,
              to: toDate,
            },
            coveredDetails: coveredDetails,
          },
          notes: [
            {
              notes: {
                notes: userRoleComments
              },
              files: files
            }
          ],
          requestedTo: [
            {
              role: isChecked === "departmentHead" ? "Department Head" : "Chief Of Staff",
              ...(isChecked === "departmentHead" && {
                departments: [
                  {
                    id: DepartmentId,
                    serviceAreaIds: [speciltyId],
                    serviceAreaSpecific: true
                  }
                ],
                departmentSpecific: true
              }),
            }
          ],
        };
      
        await POST(`application-management-service/application/request`, temp)
          .then((response) => {
            console.log(response?.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      
      
  
  const handleDateChange = (date, field) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00")
    setCustomEndDate(formattedDate);
    setSelectedMonth(formattedDate);

    setCalendarStart(false);

  };
  // const handleDateChange = (date) => {
  //   setCustomDate(date);
  //   const formattedDate = format(date, 'yyyy-MM');
  //   setSelectedMonth(formattedDate);
  // };

 //   useEffect(() => {
 //     checkApproveEnabled();
 //     console.log("uploadFileData", uploadFileData)
 //   }, [userNotes, documentTitle, uploadFileData]);

 // useEffect(() => {
 //   getActiveApplicationView();
 //   getApplication();
 // }, []);

 useEffect(() => {
  setUserDetails();
 }, [users?.id]);

 const getApplicationEntity = async () => {
  const { data: formDetailsEntity } = await GET(`entity-service/entity/${TenantID}`);
  setEntity(formDetailsEntity);
 };

 const setUserDetails = async () => {
  const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
  console.log("userdataaaa" + JSON.stringify(userData));
  sessionStorage.setItem("user", JSON.stringify(userData));
  setUserRole(userData?.roles?.map((data) => data?.roleName));
 };

 const getApplication = async () => {
  try {
   setIsLoadingImage(true);
   const { data: formDetails } = await GET(`application-management-service/application/${id}`);
   setFormDetails(formDetails);
   setIsLoadingImage(false);
  } catch (error) {
   console.error("Error fetching application:", error);
  }
 };


 //   const checkApproveEnabled = () => {
 //     const hasValidComments = userNotes.trim() !== '';

 //     // Check if there are any uploaded files
 //     if (uploadFileData.length > 0) {
 //       // For files, check if all documents have titles
 //       const allFilesHaveTitles = uploadFileData.every((_, index) =>
 //         documentTitle[index] && documentTitle[index].trim() !== ''
 //       );

 //       setIsApproveEnabled(hasValidComments && allFilesHaveTitles);
 //     } else {
 //       // If no files are uploaded, only check for valid comments
 //       setIsApproveEnabled(hasValidComments);
 //     }
 //   };

 //  useEffect(() => {
 //     if (formDetails !== undefined && formIndex !== undefined) {
 //       setIsLoadingPage(false)
 //       if (formDetails && !formSchema) {
 //         getFormSchema();
 //         getUploadFormSchema();
 //         getPrivilegeCategory();
 //       }
 //       if (formDetails?.privileges?.obligatedPrivileges?.[0]?.id) {
 //         setSelectedPrivilege(formDetails?.privileges?.obligatedPrivileges?.[0]?.id);
 //       }
 //       // if (formDetails?.privileges?.priorObligatedPrivileges?.length === 0 &&
 //       //   formDetails?.privileges?.obligatedPrivileges?.length === 0) {
 //       //   setIsPrivilegeSetChanging(true);
 //       //   setPrivilegeSetChangeYesOrNo('No');
 //       // }
 //       setSelectedAdditionalPrivilegeForDisplay(
 //         formDetails?.privileges?.additionalPrivileges
 //       );
 //       setSelectedPrivilegesForDisplayMultiple(
 //         formDetails?.privileges?.obligatedPrivileges
 //       );
 //       if (!dontUpdatePrivilegeState && !isShowESignDialog && !isShowESignConfirmationDialog) {
 //         setSelectedAdditionalPrivilegesForDisplayMultiple(
 //           formDetails?.privileges?.additionalPrivileges
 //         );
 //         setSelectedPrivilegeForDisplay(formDetails?.privileges?.obligatedPrivileges);
 //       }
 //       setHospitalPrivilegeSet(formDetails?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges === null ? [] : formDetails?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges)
 //       setSelectedValue(formDetails?.basicDetails?.regionalCallResponsibilities?.regionalCallResponsibilities !== undefined ? formDetails?.basicDetails?.regionalCallResponsibilities?.regionalCallResponsibilities : 'NA')
 //       setNavigateURL(`/reappointmentApplicationForm/${id}/${formDetails?.forms[formIndex + 1]?.formCategory}/${btoa(formDetails?.forms[formIndex + 1]?.schemaCategory)}`);
 //       if ((formDetails?.forms?.[formDetails?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL === undefined && formDetails?.forms?.[formDetails?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text === undefined)) {
 //         setDontUpdatePrivilegeState(true)
 //         setIsShowESignDialog(true)
 //       }
 //       if (formDetails?.forms[formIndex]?.data !== null) {
 //         setPrivilegeChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo);
 //         setDepartmentChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo);
 //         setPrivilegeSetChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo);
 //         setAdditionalPrivilegeChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo)
 //         setPrivilegeAtOtherHospitalYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo)
 //       }
 //     } else {
 //       setIsLoadingPage(true);
 //     }
 //   }, [formDetails, formIndex]);


 const onClose = () => {
  getIsOpen(false);
 };


const getNext12MonthsFromCreatedDate = (createdDateStr) => {
  const months = [];
  const createdDate = new Date(createdDateStr);

  // Start from the month after the createdDate
  createdDate.setMonth(createdDate.getMonth() + 1);

  for (let i = 0; i < 12; i++) {
    const date = new Date(createdDate.getFullYear(), createdDate.getMonth() + i, 1);
    const label = format(date, 'MMMM yyyy');
    const value = format(date, 'yyyy-MM');
    months.push({ label, value });
  }

  // Add "Custom End Date" option
  const now = new Date();
  months.push({
    label: 'Custom End Date',
    value: format(now, 'yyyy-MM') // this is now a valid date value
  });
  return months;
};

 const monthOptions = selectDataLocum?.tenure?.to ? getNext12MonthsFromCreatedDate(selectDataLocum?.tenure?.to) : [];

 const lastModifiedDate = formDetails?.lastModifiedDate;
 const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "MM/dd/yyyy") : "-";
 const ExpireDate = selectDataLocum?.tenure?.to;
 const formattedExpiringDate = ExpireDate ? format(new Date(ExpireDate), "MM/dd/yyyy") : "-";
 const daysRemaining = ExpireDate ? differenceInDays(new Date(ExpireDate), new Date()) : null;

 return (
  <>
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
        <div className={`${style.heading}`}>Request for Locum Period & Privileges Extension</div>
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
        <div className={style.marginTop10}>
         <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
          <div className={`${style.displayInRow} ${style.displayInRowCenter}`}>
           <span className={style.rejectionHeadingTextStyle}>
            {selectDataLocum?.applicant?.name?.lastName?.charAt(0).toUpperCase() +
             selectDataLocum?.applicant?.name?.lastName?.slice(1).toLowerCase()}
            {", "}
            {selectDataLocum?.applicant?.name?.firstName
             ? selectDataLocum?.applicant?.name?.firstName.charAt(0).toUpperCase() +
             selectDataLocum?.applicant?.name?.firstName.slice(1).toLowerCase()
             : ""}
            {", "}
            {/* {`${formatFirstNameLastName(formDetails?.basicDetail?.applicant?.name?.firstName, formDetails?.basicDetail?.applicant?.name?.lastName)}`} */}
            {/* {formDetails?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
           </span>
           <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>
            {selectDataLocum?.basicDetailReferences?.applicantType?.serviceProviderType}
           </div>
           {/* <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>{formDetails?.displayId}</span> */}
          </div>
          <div className={`${style.twoColumnGridInner} ${style.displayInRowCenter}`}>
           <span className={`${style.rejectionTextStyle}`}>Privilege Category:</span>
           <span className={`${style.rejectionTextStyle1}`}>
            {selectDataLocum?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name || "-"}
           </span>
          </div>
          <div className={`${style.twoColumnGridInner}`}>
           <span className={`${style.rejectionTextStyle}`}>Department:</span>
           <span className={`${style.rejectionTextStyle1}`}>
            {selectDataLocum?.basicDetailReferences?.department?.name || "-"}
           </span>
          </div>
          {/* <div className={`${style.twoColumnGridInner}`}>
                      <span className={`${style.rejectionTextStyle}`}>Application ID:</span>
                      <span className={`${style.rejectionTextStyle1}`}>{formDetails?.displayId || "-"}</span>
                    </div> */}
          {/* </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
          <div className={`${style.twoColumnGridInner}`}>
           <span className={`${style.rejectionTextStyle}`}>Division / Speciality:</span>
           <span className={`${style.rejectionTextStyle1}`}>
            {selectDataLocum?.basicDetailReferences?.specialty?.name || "-"}
           </span>
          </div>
          {/* <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                    <span className={`${style.rejectionTextStyle1}`}>{formDetails?.basicDetailReferences?.site || "-"}</span>
                  </div> */}
          {entity?.multiSiteEntity && (
           <div className={`${style.twoColumnGridInner}`}>
            <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
            <span className={`${style.rejectionTextStyle1}`}>{entity?.multiSiteEntity?.[0]?.name || "-"}</span>
           </div>
          )}
          {/* </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}> */}
          <div className={`${style.twoColumnGridInner}`}>
           <span className={`${style.rejectionTextStyle}`}>Expiration Date:</span>
           <span className={`${style.rejectionTextStyle1}`}>{formattedExpiringDate}</span>
          </div>
          <div className={`${style.twoColumnGridInner}`}>
           <span className={`${style.rejectionTextStyle}`}>Days From Expiration :</span>
           {/* <span className={`${style.rejectionTextStyle1}`}>{format(new Date(formDetails?.lastModifiedDate), "MMM dd, yyyy")}</span> */}
           <span className={`${style.rejectionTextStyle1}`}>{daysRemaining}</span>
          </div>
          <div className={`${style.twoColumnGridInner}`}>
           <span className={`${style.rejectionTextStyle}`}>CPSO Number :</span>
           {/* <span className={`${style.rejectionTextStyle1}`}>{format(new Date(formDetails?.lastModifiedDate), "MMM dd, yyyy")}</span> */}
           <span className={`${style.rejectionTextStyle1}`}>-</span>
          </div>
          <div className={`${style.twoColumnGridInner}`}>
           <span className={`${style.rejectionTextStyle}`}>OHIP Number :</span>
           {/* <span className={`${style.rejectionTextStyle1}`}>{format(new Date(formDetails?.lastModifiedDate), "MMM dd, yyyy")}</span> */}
           <span className={`${style.rejectionTextStyle1}`}>-</span>
          </div>
         </div>
        </div>
       </div>
       {showSelectedPrivilegeLocum === false && (
        <div className={`${style.marginTop10}`}>
         <div className={`${style.rejectionHeadingTextStyle}`}>
          Locum Period Expiring On {formattedExpiringDate}, {daysRemaining} Days
         </div>
         <div className={`${style.rejectionTextStyle}`}>
         This is a request to extend the Period and Privileges for :{" "}
          <span className={style.rejectionHeadingTextStyle}>
          {selectDataLocum?.applicant?.name?.lastName?.charAt(0).toUpperCase() +
             selectDataLocum?.applicant?.name?.lastName?.slice(1).toLowerCase()}
            {", "}
            {selectDataLocum?.applicant?.name?.firstName
             ? selectDataLocum?.applicant?.name?.firstName.charAt(0).toUpperCase() +
             selectDataLocum?.applicant?.name?.firstName.slice(1).toLowerCase()
             : ""}
          </span>
         </div>
         <div>
          {/* <CommonRadio
           className={style.leftAlign}
           value={processReappointment}
           onChange={(e) => setProcessReappointment(e.target.value)}
           radioValue={["Yes"]}
           label={["Yes, I would like to have this Locum Staff Privileges to be extended"]}
          /> */}
          <div className={`${style.flexCenter}`}>
           {/* <div className={`${style.halfWidth}`}> */}
           {selectedMonth !== format(new Date(), 'yyyy-MM') && (
            <div className={`${style.halfWidth}`}>
            <CommonSelectField
             value={selectedMonth}
             onChange={(e) => setSelectedMonth(e.target.value)}
            // onChange={(e) => {
            //   if (e.target.value === "Custom end Date") {
            //     setSelectedMonth("Custom end Date");
            //     setCustomEndDate(new Date()); // Set a default date when selecting custom
            //   } else {
            //     setSelectedMonth(e.target.value);
            //     setCustomEndDate(null); // Reset custom date when selecting a month
            //   }
            // }}
             className={style.fullWidth}
            //  firstOptionLabel={""}
            //  firstOptionValue={""}
             valueList={monthOptions.map((month) => month.value)}
             labelList={monthOptions.map((month) => month.label)}
             disabledList={monthOptions.map(() => false)}
             required={false}
            />
            </div>
           )}
           {/* </div> */}
           {/* <div> */}
           {selectedMonth === format(new Date(), 'yyyy-MM') && (
            <div className={`${style.marginTopLess}`}>
             <CommonDateField
                className={`${style.dateWidth} ${style.fullWidth}`}
                onChange={(date) => handleDateChange(date)}
                open={calendarStart}
                onOpen={() => setCalendarStart(true)}
                onClose={() => setCalendarStart(false)}

                minDate={sub(new Date(), { years: 3 })}
                maxDate={add(new Date(), { years: 3 })}
                // minDate={lastSubmittedDate ? new Date(lastSubmittedDate) : sub(new Date(), { years: 3 })}
                // maxDate={getJune30thOfCurrentYear()}
                value={customDate ? format(customDate, 'yyyy-MM') : ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      placeholder: 'Enter Extend Date',
                      readOnly: true
                    }}
                    variant="outlined"
                    margin="normal"
                    
                  />
                 
                )}
              />
               </div>
            )}
            {/* </div> */}
           <div className={`${style.marginLeft} ${style.rejectionHeadingTextStyle}`}>
            Start Date <br />
            <span className={`${style.rejectionTextStyle}`}>
              {ExpireDate ? format(addDays(new Date(ExpireDate), 1), "dd MMM yyyy") : "N/A"}
            </span>
           </div>
           <div className={`${style.marginLeft} ${style.rejectionTextStyle}`}> To </div>
           <div className={`${style.marginLeft} ${style.rejectionHeadingTextStyle}`}>
            End Date <br />
            <span className={`${style.rejectionTextStyle}`}>
             {" "}
             {ExpireDate ? format(new Date(selectedMonth), "dd MMM yyyy") : "N/A"}{" "}
            </span>
           </div>
          </div>
          <div className={`${style.flexCenter}`}>
          <div className={`${style.fullWidth}`}>
          <div className={`${style.fieldWrapper}`}>
            <div className={`${style.lableStyle}`}>
              {'Coverage required for'}
            </div>
            {/* <CommonSelectField
              value={covererName}
              onChange={(e) => setCovererName(e.target.value)}
              className={style.fullWidth}
              valueList={applicantOptions?.map((option) => option?.value)}
              labelList={applicantOptions?.map((option) => option?.label)}
              disabledList={[]}
              disabledSelect={false}
              error={!covererName}
              label={"Select Named Covering Providers"}
              required={true}
              warning={warningFields
                ?.map((data) => data?.label)
                ?.includes(
                  `Who covers your hospital patients when you are not available?`
                )}
            /> */}
            <DatalistInput
              items={getItemsSingle(applicantOptions) || []}
              onSelect={(item) => {
                setCovererName(item.label);
                setCovererId(item.id);
                setCovererNameList(prevCheckedIds => {
                  // return prevCheckedIds?.includes(item.id)
                  //   ? prevCheckedIds.filter(checkedId => checkedId !== item.id)
                  //   : [...prevCheckedIds, item.id];
                  const filteredIds = (Array.isArray(prevCheckedIds) ? prevCheckedIds : []).filter((id) => id !== item.id);
                  return [...filteredIds, item.id];
                });
              }}
              className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
              maxLength={50}
              placeholder={'Select from privilege staff'}
              value={covererName}
              required={true}
              error={!covererName}
              // warning={warningFields
              //   ?.map((data) => data?.label)
              //   ?.includes(
              //     `Who covers your hospital patients when you are not available?`
              //   )}
            />
          </div>
         </div>
           <div className={`${style.chipsContainer} ${style.marginTop30} ${style.marginLeft10}`}>
              {covererNameList?.map ? (
                covererNameList.map((data, index) => (
                  <div key={index} className={`${style.privilegeCategoryChips} ${style.displayInRow}`}>
                    {/* <div>{name}</div> */}
                    {/* <div>{selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.firstName}</div>   */}
                    <div>
                      {selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.firstName}{" "}
                      {selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.middleName}{" "}
                      {selectApplicant?.filter(optionData => optionData?.id === data)?.[0]?.applicant?.name?.lastName}
                    </div>

                    <div
                      className={`${style.verticalAlignCenter} ${style.marginLeft} ${style.cursorPointer}`}
                      onClick={() => handleRemoveChip(index)} // Optional: Add a remove handler
                    >
                      <CancelIcon sx={{ color: '#06617A', fontSize: 20 }} />
                    </div>
                  </div>
                ))
              ) : null}
            </div>
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
          <div className={`${style.flexCenter}`}>
          <CommonCheckBox
            className={`${style.marginTop10}`}
            label="Send to Department Head / Chief"
            checked={isChecked === 'departmentHead'}
            onChange={handleCheckboxChange('departmentHead')}
            /> 

           <CommonCheckBox
            className={`${style.marginTop10}`}
            label="Send to COS / Deputy COS"
            checked={isChecked === 'cos'}
            onChange={handleCheckboxChange('cos')}
            /> 
            </div>
          {/* <CommonRadio
           className={style.leftAlign}
           value={processReappointment}
           onChange={(e) => setProcessReappointment(e.target.value)}
           radioValue={["No"]}
           label={["No, I do not want to have Privileges Extended for this Locum staff"]}
          /> */}
         </div>
        </div>
       )}
      </div>
      <div className={`${style.marginTop} ${style.marginBottom} ${style.reviewButtonContainer}`}>
       {/* <div className={`${style.cursorPointer}`} onClick={() => getIsOpen(false)}>
                <div className={`${style.cancelButton} ${style.cancelButtonTextStyle}`}>Cancel</div>
              </div> */}
       <div
        className={`${style.reviewButtonStyle}
                 ${style.cursorPointer}
                  ${style.marginLeft}`}
        // onClick={getApplicationNotes}
        // style={{
        //   pointerEvents: isApproveEnabled ? 'auto' : 'none',
        //   opacity: isApproveEnabled ? 1 : 0.5
        // }}
        style={{
         pointerEvents: "auto",
         opacity: 1,
        }}
        onClick={() => {
          // if (!showSelectedPrivilegeLocum) {
            // setShowSelectedPrivilegeLocum(true);
            // reappointmentApplication();
          // } else {
            getIsOpen(false);
            reappointmentRequestApplication();
          // }
        }}
       >
        <div className={style.reviewButton}>Continue</div>
       </div>
      </div>
     </div>
    </Dialog>
   )}
  </>
 );
};

export default LocumExtensiveRequestDialog;
