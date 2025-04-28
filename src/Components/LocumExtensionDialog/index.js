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
import { format, differenceInDays ,addDays, addMonths, subDays, parseISO, addYears} from "date-fns";
import { fileLoadingURL } from "../../utils/formatting";
import LoadingScreen from "../LoadingScreen";
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonTextField from "../CommonFields/CommonTextField";
import TextField from "@mui/material/TextField";
import CommonRadio from "../CommonFields/CommonRadio";
import CommonDateField from "../CommonFields/CommonDateField";
import CommonDivider from "../CommonFields/CommonDivider";
import DeleteIcon from "./../../images/deleteHcRow.png";
import { useNavigate, useParams } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import DatalistInput from "react-datalist-input";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ESignature from "../../Components/ESignature";
import CancelIcon from '@mui/icons-material/Cancel';
import AdditionalPrivilegesDialog from "../../Screens/ReappointmentApplicationForm/PrivilegeSelection/AdditionalPrivilegesDialog";

const LocumExtensiveDialog = ({ getIsOpen,selectedTab }) => {
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
 const [selectedMonth, setSelectedMonth] = useState("");
 const [calendarStart, setCalendarStart] = useState(false);
 const [customEndDate, setCustomEndDate] = useState(null);
 const [customDate, setCustomDate] = useState(null);
//  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
 const [showSelectedPrivilegeLocum, setShowSelectedPrivilegeLocum] = useState(false);
 const [selectedPrivilege, setSelectedPrivilege] = useState(false);
 const { step } = useParams();
 const [privilegeChangeYesOrNo, setPrivilegeChangeYesOrNo] = useState("Yes");
 const [departmentChangeYesOrNo, setDepartmentChangeYesOrNo] = useState("");
 const [privilegeSetChangeYesOrNo, setPrivilegeSetChangeYesOrNo] = useState("");
 const [showCurrentPrivileges, setShowCurrentPrivileges] = useState(false);
 const [hospitalPrivilegeSet, setHospitalPrivilegeSet] = useState([]);
 const [additionalPrivilegeChangeYesOrNo, setAdditionalPrivilegeChangeYesOrNo] = useState("No");
 const [privilegeAtOtherHospitalYesOrNo, setPrivilegeAtOtherHospitalYesOrNo] = useState("");
 const [currentPrivilegesCategory, setCurrentPrivilegesCategory] = useState(false);
 const [isPrivilegeCategoryChanging, setIsPrivilegeCategoryChanging] = useState(false);
 const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] = useState("");
 const [showPrivilegeResetError, setShowPrivilegeResetError] = useState(false);
 const [privilegeCategories, setPrivilegeCategories] = useState([]);
 const [selectDataLocum, setSelectDataLocum] = useState([]);
 const [privilegeCategoriesAtOtherHospitals, setPrivilegeCategoriesAtOtherHospitals] = useState([]);
 const [selectedPrivilegesForCourtesy, setSelectedPrivilegesForCourtesy] = useState("");
 const [isEdit, setIsEdit] = useState(true);
 const [departmentList, setDepartmentList] = useState([]);
 const [selectedDepartment, setSelectedDepartment] = useState("");
 const [selectedSpeciality, setSelectedSpeciality] = useState("");
 const [isDepartmentChanging, setIsDepartmentChanging] = useState(false);
 const [selectedValue, setSelectedValue] = useState("NA");
 const [formData, setFormData] = useState();
 const [selectedAdditionalPrivilegesForDisplayMultiple, setSelectedAdditionalPrivilegesForDisplayMultiple] = useState([]);
 const [selectedPrivilegesForDisplayMultiple, setSelectedPrivilegesForDisplayMultiple] = useState([]);
 const [selectedAdditionalPrivilegeForDisplay, setSelectedAdditionalPrivilegeForDisplay] = useState([]);
 const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] = useState([]);
 const [additionalStaffPrivilege, setAdditionalStaffPrivilege] = useState([]);
 const [showAdditionalPrivileges, setShowAdditionalPrivileges] = useState(false);
 const [selectedAdditionalDepartment, setSelectedAdditionalDepartment] = useState("");
 const [selectedAdditionalSpeciality, setSelectedAdditionalSpeciality] = useState("");
 const [isEditAdditionalPrivileges, setIsEditAdditionalPrivileges] = useState(true);
 const [staffPrivilege, setStaffPrivilege] = useState([]);
 const [isEditPrivilege, setIsEditPrivilege] = useState(true);
 const [isPrivilegeSetChanging, setIsPrivilegeSetChanging] = useState(false);
 const [showPrivileges, setShowPrivileges] = useState(false);
 const [allStaffPrivilege, setAllStaffPrivilege] = useState([]);
 const [isAdditionalPrivilegeCategoryChanging, setIsAdditionalPrivilegeCategoryChanging] = useState(false);
 const [showInfo, setShowInfo] = useState(false);
 const [privilegeAtOtherHospitalIndex, setPrivilegeAtOtherHospitalIndex] = useState();
const [
    selectedAdditionalPrivilegeForEdit,
    setSelectedAdditionalPrivilegeForEdit,
] = useState();
const [isPrivilegeAtOtherHospitalEdited, setIsPrivilegeAtOtherHospitalEdited] = useState(false);
const [privilegesMaintainedInOtherHositals, setPrivilegesMaintainedInOtherHositals] = useState(false);
const [hospitalPrivilege, setHospitalPrivilege] = useState("");
 const [isOpenAdd, setIsOpenAdd] = useState(false);
 const [indexForSign, setIndexForSign] = useState(0);
 const [hospitalName, setHospitalName] = useState("");
const [showAdditionalPrivilegesForSign, setShowAdditionalPrivilegesForSign] = useState(false);
const [hospitalPrivilegeCategory, setHospitalPrivilegeCategory] = useState("");
const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
const [formSchema, setFormSchema] = useState();
const [selectApplicant, setSelectApplicant] = useState([]);
const [applicantOptions, setApplicantOptions] = useState([]);
const [covererNameList, setCovererNameList] = useState([]);
const [covererName, setCovererName] = useState("");
const [covererId, setCovererId] = useState("");
 const prevDepartment = formDetails?.basicDetailReferences?.department?.id;
 const prevSpeciality = formDetails?.basicDetailReferences?.specialty?.id;
 const [currentDate, setCurrentDate] = useState(
     format(new Date(), "dd-MM-yyyy")
   );
   const [isLoadingPage, setIsLoadingPage] = useState(false);
 const publicKey =
    "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
 const workModeType = sessionStorage.getItem("workModeType");
 let staffLocumId;
 let name = `${formDetails?.basicDetails?.applicant?.name?.firstName} ${formDetails?.basicDetails?.applicant?.name?.lastName} `;


 console.log("tableDataValue",selectApplicant,covererNameList,covererId,selectedTab)
 useEffect(() => {
  sessionStorage.setItem("fromSummary", false);
  // getApplication();
  getApplicationEntity();
  getActiveUserData();
 }, [applicationType, id]);

 useEffect(() => {
  const index = formDetails?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection");
  setFormIndex(index);
  console.log("Found index:", index);
}, [formDetails?.forms]);


 useEffect(() => {
  sessionStorage.setItem("fromSummary", false);
  getApplication();
 }, [selectDataLocum]);


 useEffect(() => {
  getActiveUserData();
  setSelectedPrivilegesForDisplayMultiple(
    formDetails?.privileges?.obligatedPrivileges
  );
  staffLocumId = selectDataLocum?.onGoingApplication?.id
  console.log("staffLocumId",staffLocumId)
 }, []);

 useEffect(() => {
  getStaffPrivilege();
  const staffLocumId = selectDataLocum?.onGoingApplication?.id
  console.log("staffLocumIdssssss",staffLocumId)
 }, [showSelectedPrivilegeLocum,privilegeSetChangeYesOrNo,selectedDepartment,selectedSpeciality]);

 useEffect(() => {
   const coveredDetails = covererNameList?.map((data) => {
    const applicantData = selectApplicant?.find(optionData => optionData?.id === data);
    const fullName = `${applicantData?.applicant?.name?.firstName || ''} ${applicantData?.applicant?.name?.middleName || ''} ${applicantData?.applicant?.name?.lastName || ''}`.trim();
    return {
      id: data,
      name: fullName,
    };
   })
   console.log("fullName",coveredDetails)
 }, [covererNameList]);

 useEffect(() => {
  getPrivilegeCategory();
  getDepartmentList();
  getformDetails();
  getFormSchema();
  setSelectedAdditionalPrivilegeForDisplay(
    formDetails?.privileges?.additionalPrivileges
  );
  setSelectedPrivilegesForDisplayMultiple(
    formDetails?.privileges?.obligatedPrivileges
  );
  console.log("selectDataLocum",selectDataLocum)
 }, []);

   useEffect(() => {
     getFields();
   }, [selectedPrivilegeForDisplay]);

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
  console.log("setSelectedDepartment",selectedDepartment)
 }, [formDetails]);

useEffect(() => {
    getAdditionalStaffPrivilege();
}, [formDetails, selectedAdditionalDepartment, selectedAdditionalSpeciality]);

let userDepartmentList;
  let userSpecialty;
  const userDetailsFetchOption = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
      userDepartmentList = userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.id;
      userSpecialty = userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.serviceAreas[0]?.id;
      console.log("userSpecialty",userDepartmentList,userSpecialty)
    }, [])

     useEffect(() => {
      const fetchDepartmentStaffs = async () => {
        try {
          const currentApplicantId = selectDataLocum?.applicant?.id;
          const departmentId = selectDataLocum?.basicDetailReferences?.department?.id;
          const applicantTypeId = selectDataLocum?.basicDetailReferences?.applicantType?.id;
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

    const getStaffPrivilege = async () => {
        if (selectedDepartment !== undefined) {
          if (selectedSpeciality !== undefined) {
            const { data: privilege } = await GET(
              `entity-service/staffPrivilege/departmentAndServiceArea?departmentId=${selectedDepartment !== ""
                ? selectedDepartment
                : selectDataLocum?.basicDetailReferences?.department?.id
              }&serviceAreaId=${selectedSpeciality !== "" ? selectedSpeciality : selectDataLocum?.basicDetailReferences?.specialty?.id}`
            );
            setStaffPrivilege(privilege);
          } else {
            const { data: privilege } = await GET(
              `entity-service/staffPrivilege/departmentAndServiceArea?departmentId=${selectedDepartment !== ""
                ? selectedDepartment
                : selectDataLocum?.basicDetailReferences?.department?.id
              }`
            );
            setStaffPrivilege(privilege);
          }
          const { data: allPrivilege } = await GET(
            `entity-service/staffPrivilege`
          );
          setAllStaffPrivilege(allPrivilege)
        }
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

    const onClickExtensiveRequest = async () => {
      setIsLoadingImage(true);
      
      try {
        await reappointmentApplication();
        await  getActiveUserData();
        // await getApplication();
        // await handleSubmitPrivilegeSet();
        // await handleSubmitAdditionalPrivilegeSet();
        setShowSelectedPrivilegeLocum(true);
      } catch (error) {
        console.error("Error in onClickExtensiveRequest:", error);
      } finally {
        setIsLoadingImage(false);
      }
    };
    
    

const getActiveUserData = async () => {
    try {
      const url = `application-management-service/staff?status=ACTIVE&type=LOCUM&isExpired=${selectedTab === "ACTIVELOCUM" ? "false" : "true"}&noOfDays=30`;
      const response = await GET(url);
      const staffs = response?.data?.staffs || [];

      const filteredData = staffs.find(item => item?.id === id);
      console.log("Filtered Application Data", filteredData);
      setSelectDataLocum(filteredData);
      console.log("applicationmanage",selectDataLocum)
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const reappointmentApplication = async () => {
    const fromDate = selectedTab === "ACTIVELOCUM"
    ? format(addDays(new Date(selectDataLocum?.tenure?.to), 1), 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');
    const toDate = selectedMonth === "Custom"
    ? format(new Date(customEndDate), 'yyyy-MM-dd')
    : format(new Date(selectedMonth), 'yyyy-MM-dd');
    const coveredDetails = covererNameList?.map((data) => {
    const applicantData = selectApplicant?.find(optionData => optionData?.id === data);
    const fullName = `${applicantData?.applicant?.name?.firstName || ''} ${applicantData?.applicant?.name?.middleName || ''} ${applicantData?.applicant?.name?.lastName || ''}`.trim();
  
      return {
        id: data,
        name: fullName,
      };
    });
  
  
    let temp = {
      tenure:{
      from: fromDate,
      to: toDate,
    },
    coveredDetails: coveredDetails,
    };
  
    await POST(`application-management-service/staff/${selectDataLocum?.id}/reappoint?positionType=LOCUM&reappointmentType=${selectedTab === "ACTIVELOCUM" ? "EXTENSION" : "RENEWAL"}`, temp)
      .then((response) => {
        console.log(response?.data);
        getActiveUserData();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

const getIsOpenAdditional = (value) => {
    setIsOpenAdd(value);
  };

  const handleDateChange = (date, field) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd'T'00:00")
    setCustomEndDate(formattedDate);
    setCalendarStart(false);
    console.log("handleDateChange",customEndDate)
  };
  // const handleDateChange = (date) => {
  //   setCustomDate(date);
  //   const formattedDate = format(date, 'yyyy-MM');
  //   setSelectedMonth(formattedDate);
  // };

const handleSelectedAdditionalPrivilegesForDisplayMultiple = (data) => {
let temp = selectedAdditionalPrivilegesForDisplayMultiple;
temp.push(data);
setSelectedAdditionalPrivilegesForDisplayMultiple(temp);
handleSubmitAdditionalPrivilegeSet(true, temp)
};

  const handleRestrictedSelection = (
    index,
    categoriesIndex,
    privilegesIndex,
    value,
    key,
    basicOrAdditional
  ) => {
    console.log(
      index,
      categoriesIndex,
      privilegesIndex,
      value,
      key,
      "onChange"
    );
    if (basicOrAdditional === 'Additional') {
      setSelectedAdditionalPrivilegeForDisplay((prevData) => {
        const temp = [...prevData];

        temp[index] = {
          ...temp[index],
          privilegeDetails: {
            ...temp[index].privilegeDetails,
            restrictedPrivileges: {
              ...temp[index].privilegeDetails.restrictedPrivileges,
              privilegesByCategories: [
                ...temp[index].privilegeDetails.restrictedPrivileges
                  .privilegesByCategories,
              ],
            },
          },
        };

        temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[
          categoriesIndex
        ] = {
          ...temp[index].privilegeDetails.restrictedPrivileges
            .privilegesByCategories[categoriesIndex],
          privileges: [
            ...temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges,
          ],
        };
        if (key === "file") {
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].file = value;
          console.log(index, categoriesIndex, privilegesIndex, value, key);
        } else if (key === "removeFile") {
          handleDeleteFile([
            temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
              .file,
          ]);
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].file = value;
          console.log(index, categoriesIndex, privilegesIndex, value, key);
        } else if (key === "response") {
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].response = value;
        } else if (key === "notes") {
          if (
            temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
              .notes === undefined ||
            temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
              .notes === null
          ) {
            temp[
              index
            ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
              categoriesIndex
            ].privileges[privilegesIndex].notes = {};
          }
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].notes.notes = value;
        }

        return temp;
      });
      getFieldsAdditional();
    } else {
      setSelectedPrivilegeForDisplay((prevData) => {
        const temp = [...prevData];

        temp[index] = {
          ...temp[index],
          privilegeDetails: {
            ...temp[index].privilegeDetails,
            restrictedPrivileges: {
              ...temp[index].privilegeDetails.restrictedPrivileges,
              privilegesByCategories: [
                ...temp[index].privilegeDetails.restrictedPrivileges
                  .privilegesByCategories,
              ],
            },
          },
        };

        temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[
          categoriesIndex
        ] = {
          ...temp[index].privilegeDetails.restrictedPrivileges
            .privilegesByCategories[categoriesIndex],
          privileges: [
            ...temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges,
          ],
        };
        if (key === "file") {
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].file = value;
          console.log(index, categoriesIndex, privilegesIndex, value, key);
        } else if (key === "removeFile") {
          handleDeleteFile([
            temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
              .file,
          ]);
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].file = value;
          console.log(index, categoriesIndex, privilegesIndex, value, key);
        } else if (key === "response") {
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].response = value;
        } else if (key === "notes") {
          if (
            temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
              .notes === undefined ||
            temp[index].privilegeDetails.restrictedPrivileges
              .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
              .notes === null
          ) {
            temp[
              index
            ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
              categoriesIndex
            ].privileges[privilegesIndex].notes = {};
          }
          temp[
            index
          ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
            categoriesIndex
          ].privileges[privilegesIndex].notes.notes = value;
        }

        return temp;
      });
      getFields();
    }
  };

  const getIsRestrictedValuesFilled = (set) => {
    console.log(set, 'enteredCheck')
    const allHaveResponse = set?.every(
      item => {
        const hasValidResponse = typeof item?.response === 'string' && item?.response?.trim() !== '' && item?.response !== null;
        const isResponseYes = item?.response === 'YES';
        const hasAdditionalData = isResponseYes ? item?.notes?.notes && item?.notes?.notes?.trim() !== '' && item?.notes?.notes !== null : true;
        return hasValidResponse && hasAdditionalData;
      }
    );
    return (set?.length === 0 || set === undefined) ? true : allHaveResponse;
  }

   const getFields = () => {
      if (selectedPrivilege !== "" && selectedPrivilegeForDisplay?.length !== 0) {
        console.log(
          selectedPrivilegeForDisplay,
          selectedAdditionalPrivilegeForDisplay,
          "entered",
          selectedPrivilege,
          staffPrivilege?.filter((data) => data?.id === selectedPrivilege),
          staffPrivilege,
          selectedPrivilegesForDisplayMultiple
        );
        return (
          <>
            <div className={style.padding}>
              <div className={style.cardTitle}>{`${allStaffPrivilege
                ?.filter((data) => data?.id === selectedPrivilege)
                ?.map((data) => data?.privilegeSetTitle)[0] !== undefined
                ? allStaffPrivilege
                  ?.filter((data) => data?.id === selectedPrivilege)
                  ?.map((data) => data?.privilegeSetTitle)[0]
                  ?.toUpperCase()
                : ""
                }`}</div>
  
              {selectedPrivilegeForDisplay?.map((data) =>
                data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map(
                  (categories, index) => (
                    <div>
                      <div className={style.categoryGrid}>
                        <div className={style.itemLeft}>
                          <strong>
                            {categories?.category === null
                              ? ""
                              : categories?.category}
                          </strong>
                        </div>
                      </div>
                      <>
                        {categories?.privileges?.map((privileges) => (
                          <div className={style.privilegeCodeGrid}>
                            <div className={style.itemLeft}>
                              <strong>{privileges?.privilegeId || ""}</strong>
                            </div>
                            <div className={style.itemLeft}>
                              {privileges?.title || ""}
                            </div>
                          </div>
                        ))}
                      </>
                    </div>
                  )
                )
              )}
              {/* {selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
                selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
                  ?.privilegesByCategories?.[0]?.privileges?.length !==
                undefined && (
                  <div className={style.twoCol}>
                    <div onClick={() => handleSign("Core", "Basic")}>
                      <ESignature
                        userName={
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.esign?.name
                            : ""
                        }
                        encData={
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.esign?.esign
                            : ""
                        }
                        showData={
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== null &&
                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.esign !== undefined
                            ? true
                            : false
                        }
                        showDatais={true}
                      />
                    </div>
                    <div className={style.verticalAlignCenter}>
                      <div className={style.displayInRow}>
                        <div className={style.dateTitle}>Date: </div>
                        <div className={`${style.date} ${style.marginLeft}`}>
                          {selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.esign?.signedDate
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
            </div>
  
            {selectedPrivilegeForDisplay?.[0]?.privilegeDetails
             ?.restrictedPrivileges?.privilegesByCategories?.length > 0 && selectedPrivilegeForDisplay?.[0]?.privilegeDetails
              ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
              ?.length !== 0 &&
              selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                ?.length !== undefined && (
                <div className={style.padding}>
                  <div className={style.cardDescription}>
                    {
                      "The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below."
                    }
                  </div>
  
                  {selectedPrivilegeForDisplay?.map((data, index) =>
                    data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map(
                      (categories, categoriesIndex) => (
                        <div key={`${index}${categoriesIndex}`}>
                          <div className={style.categoryGrid}></div>
                          <>
                            {categories?.privileges?.map(
                              (privileges, privilegesIndex) => (
                                <div
                                  className={`${style.restrictedPrivilegeGrid} ${privilegesIndex === 0 ? style.marginTop : ""
                                    }`}
                                  key={`${index}${privilegesIndex}`}
                                >
                                  <div className={style.itemLeft}>
                                    <strong>
                                      {privileges?.privilegeId || ""}
                                    </strong>
                                  </div>
                                  <div className={style.itemLeft}>
                                    {privileges?.title || ""}
                                  </div>
                                  <div className={style.floatRight}>
                                    <CommonRadio
                                      value={privileges?.response || ""}
                                      onChange={(e) =>
                                        handleRestrictedSelection(
                                          index,
                                          categoriesIndex,
                                          privilegesIndex,
                                          e.target.value,
                                          "response"
                                        )
                                      }
                                      radioValue={["NO", "YES"]}
                                      label={["No", "Yes"]}
                                    />
                                  </div>
                                  {privileges?.response === "YES" &&
                                    (privileges?.isevidenceRequired ||
                                      privileges?.isevidenceRequired ===
                                      undefined) && (
                                      <>
                                        <div className={style.marginTop}>
                                          <CKEditor
                                            editor={ClassicEditor}
                                            data={privileges?.notes?.notes || ""}
                                            onChange={(event, editor) => {
                                              const data = editor.getData();
                                              handleRestrictedSelection(
                                                index,
                                                categoriesIndex,
                                                privilegesIndex,
                                                data,
                                                "notes"
                                              );
                                            }}
                                            onReady={(editor) => {
                                              editor.editing.view.change(
                                                (writer) => {
                                                  writer.setStyle(
                                                    "height",
                                                    "150px",
                                                    editor.editing.view.document.getRoot()
                                                  );
                                                }
                                              );
                                            }}
                                            config={{
                                              placeholder:
                                                "Please provide details of your qualification and competence for this privilege (Mandatory)",
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
                                          />
                                        </div>
  
                                        <div className={style.marginTop10}>
                                          <div
                                            className={`${style.uploadButton}`}
                                          >
                                            <div className={style.uploadGrid}>
                                              {privileges?.file !== undefined &&
                                                privileges?.file !== null ? (
                                                <img
                                                  src={VerifiedImage}
                                                  alt=""
                                                  className={`${style.imgIcon} `}
                                                />
                                              ) : (
                                                <img
                                                  src={ToBeVerifiedImage}
                                                  alt=""
                                                  className={style.imgIcon}
                                                />
                                              )}
                                              <div
                                                className={`${style.uploadText} ${style.verticalAlignCenter}`}
                                              >
                                                Upload any supporting documents
                                                for evidence of qualification and
                                                competence (Optional)
                                              </div>
                                              <div>
                                                <label
                                                  for={`file-upload-dynamic-basic${privilegesIndex}`}
                                                  className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                                >
                                                  Click to upload
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <input
                                            id={`file-upload-dynamic-basic${privilegesIndex}`}
                                            type="file"
                                            accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                            onChange={(e) => {
                                              handleRestrictedFileSelection(
                                                index,
                                                categoriesIndex,
                                                privilegesIndex,
                                                e.target.files[0],
                                                "file"
                                              );
                                            }}
                                          />
                                        </div>
                                        {privileges?.file !== null &&
                                          privileges?.file?.fileName !==
                                          undefined && (
                                            <div
                                              className={`${style.fileDisplay} ${style.fileDisplayText} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                            >
                                              <div className={style.displayInRow}>
                                                <div
                                                  onClick={() => {
                                                    window.open(
                                                      privileges?.file?.fileURL,
                                                      "_blank"
                                                    );
                                                  }}
                                                >
                                                  {privileges?.file?.fileType ===
                                                    "application/pdf" ? (
                                                    <img
                                                      src={PdfDoc}
                                                      alt=""
                                                      className={
                                                        style.docTypeImgStyle
                                                      }
                                                    />
                                                  ) : privileges?.file?.fileType?.startsWith(
                                                    "image/"
                                                  ) ? (
                                                    <img
                                                      src={ImgDoc}
                                                      alt=""
                                                      className={
                                                        style.docTypeImgStyle
                                                      }
                                                    />
                                                  ) : (
                                                    <TextSnippetOutlinedIcon
                                                      style={{
                                                        fontSize: 20,
                                                        color: `${data?.subStatus}`,
                                                      }}
                                                    />
                                                  )}
                                                </div>
                                                <div className={style.marginLeft}>
                                                  {privileges?.file?.fileName}
                                                </div>
                                              </div>
                                              <div>
                                                <img
                                                  src={DeleteIcon}
                                                  alt=""
                                                  className={
                                                    style.docTypeImgStyle
                                                  }
                                                  onClick={() => {
                                                    handleRestrictedSelection(
                                                      index,
                                                      categoriesIndex,
                                                      privilegesIndex,
                                                      null,
                                                      "removeFile"
                                                    );
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        <br />
                                      </>
                                    )}
                                </div>
                              )
                            )}
                          </>
                        </div>
                      )
                    )
                  )}
                  {/* <div className={style.twoCol}>
                    <div
                      onClick={getIsRestrictedValuesFilled(selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                        ?.privileges) ? () => {
                          handleSign("Restricted", "Basic");
                        } : () => { }}
                    >
                      <ESignature
                        userName={
                          selectedPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay[0]?.privilegeDetails
                              ?.restrictedPrivileges?.esign?.name
                            : ""
                        }
                        encData={
                          selectedPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay[0]?.privilegeDetails
                              ?.restrictedPrivileges?.esign?.esign
                            : ""
                        }
                        showData={
                          selectedPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign !== null &&
                            selectedPrivilegeForDisplay[0]?.privilegeDetails
                              ?.restrictedPrivileges?.esign !== undefined
                            ? true
                            : false
                        }
                        showDatais={true}
                      />
                    </div>
                    <div className={style.verticalAlignCenter}>
                      <div className={style.displayInRow}>
                        <div className={style.dateTitle}>Date: </div>
                        <div className={`${style.date} ${style.marginLeft}`}>
                          {selectedPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay[0]?.privilegeDetails
                              ?.restrictedPrivileges?.esign?.signedDate
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              )}
          </>
        );
      }
    };

  const handleSign = (type, basicOrAdditional, index = 0) => {
    if (basicOrAdditional === "Basic") {
      setSelectedPrivilegeForDisplay((prevData) => {
        const temp = [...prevData];
        if (
          type === "Core" &&
          (temp[index].privilegeDetails.corePrivileges.esign === null ||
            temp[index].privilegeDetails.corePrivileges.esign === undefined)
        ) {
          temp[index].privilegeDetails.corePrivileges.esign = {
            esign: CryptoJS.AES.encrypt(
              name + new Date().toISOString(),
              publicKey
            ).toString(),
            name: name,
            signedDate: currentDate,
          };
        } else if (
          type === "Restricted" &&
          (temp[index].privilegeDetails.restrictedPrivileges.esign === null ||
            temp[index].privilegeDetails.restrictedPrivileges.esign === undefined)
        ) {
          temp[index].privilegeDetails.restrictedPrivileges.esign = {
            esign: CryptoJS.AES.encrypt(
              name + new Date().toISOString(),
              publicKey
            ).toString(),
            name: name,
            signedDate: currentDate,
          };
        }

        return temp;
      });
    } else {
      setSelectedAdditionalPrivilegeForDisplay((prevData) => {
        const temp = [...prevData];
        if (
          type === "Core" &&
          (temp[index].privilegeDetails.corePrivileges.esign === null ||
            temp[index].privilegeDetails.corePrivileges.esign === undefined)
        ) {
          temp[index].privilegeDetails.corePrivileges.esign = {
            esign: CryptoJS.AES.encrypt(
              name + new Date().toISOString(),
              publicKey
            ).toString(),
            name: name,
            signedDate: currentDate,
          };
        } else if (
          type === "Restricted" &&
          (temp[index].privilegeDetails.restrictedPrivileges.esign === null ||
            temp[index].privilegeDetails.restrictedPrivileges.esign ===
            undefined)
        ) {
          temp[index].privilegeDetails.restrictedPrivileges.esign = {
            esign: CryptoJS.AES.encrypt(
              name + new Date().toISOString(),
              publicKey
            ).toString(),
            name: name,
            signedDate: currentDate,
          };
        }

        return temp;
      });
    }
  };

    const handleDeleteFile = async (files) => {
      await DELETE(
        `application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/files`,
        files
      )
        .then((response) => {
        //   SuccessToaster("File Deleted Successfully");
          handleSubmit();
        })
        .catch((error) => {
        //   ErrorToaster("Unexpected Error Deleting File");
        });
    };

     const addNewDocument = async (file) => {
        console.log(file, file?.name, "Test");
        let fileName = {
          fileName: file?.name,
        };
        const formData = new FormData();
    
        if (file !== null) {
          formData.append(
            "files",
            new Blob([JSON.stringify(fileName)], {
              type: "application/json",
            })
          );
          formData.append("documents", file);
          try {
            const response = await POST(
              `application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/files?isLLMRequired=${formSchemaWholeObject?.requiredDocuments?.length !== 0
                ? true
                : false
              }&schemaId=${formSchemaWholeObject?.id}`,
              formData
            );
            // SuccessToaster("File Uploaded Successfully");
            try {
              if (
                response?.data?.classification !== null &&
                formSchemaWholeObject?.requiredDocuments?.length !== 0
              ) {
                await PUT(
                  `application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/form/updateData`,
                  {
                    documentType:
                      response?.data?.classification !== null
                        ? response?.data?.classification
                        : "",
                    fileSize: `${(file?.size / (1024 * 1024)).toFixed(2)} Mb`,
                    fileURL: response?.data?.fileURL,
                    fileType: response?.data?.fileType,
                    fileUploaded: file?.name,
                    requirement:
                      response?.data?.classification !== null
                        ? formDetails?.documentsRequired?.filter(
                          (data) =>
                            data?.document?.name ===
                            response?.data?.classification
                        )?.[0]?.required
                          ? "Required"
                          : "Recommended"
                        : "",
                    valid: response?.data?.valid,
                    verified: response?.data?.verified,
                  }
                );
              }
              console.log(response);
            } catch (error) {
              console.log(error);
            }
            console.log(response?.data);
            return response?.data;
          } catch (error) {
            // ErrorToaster("File Upload Failed");
            console.error(error);
            return null;
          }
        }
      };

    const handleRestrictedFileSelection = async (
        index,
        categoriesIndex,
        privilegesIndex,
        value,
        type,
        basicOrAdditional
      ) => {
        let file = await addNewDocument(value);
        handleRestrictedSelection(
          index,
          categoriesIndex,
          privilegesIndex,
          file,
          type,
          basicOrAdditional
        );
      };

 const getFieldsAdditional = () => {
    if (selectedPrivilege !== "" && selectedAdditionalPrivilegeForDisplay?.length !== 0) {
      console.log(
        selectedPrivilegeForDisplay,
        selectedAdditionalPrivilegeForDisplay,
        "entered",
        selectedPrivilege,
        staffPrivilege?.filter((data) => data?.id === selectedPrivilege),
        staffPrivilege,
        selectedPrivilegesForDisplayMultiple
      );
      return (
        <>
          <div className={style.padding}>
            <div className={style.cardTitle}>{`${allStaffPrivilege
              ?.filter((data) => data?.id === selectedPrivilege)
              ?.map((data) => data?.privilegeSetTitle)[0] !== undefined
              ? allStaffPrivilege
                ?.filter((data) => data?.id === selectedPrivilege)
                ?.map((data) => data?.privilegeSetTitle)[0]
                ?.toUpperCase()
              : ""
              }`}</div>
            {selectedAdditionalPrivilegeForDisplay?.map((data) =>
              data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map(
                (categories, index) => (
                  <div>
                    <div className={style.categoryGrid}>
                      <div className={style.itemLeft}>
                        <strong>
                          {categories?.category === null
                            ? ""
                            : categories?.category}
                        </strong>
                      </div>
                    </div>
                    <>
                      {categories?.privileges?.map((privileges) => (
                        <div className={style.privilegeCodeGrid}>
                          <div className={style.itemLeft}>
                            <strong>{privileges?.privilegeId || ""}</strong>
                          </div>
                          <div className={style.itemLeft}>
                            {privileges?.title || ""}
                          </div>
                        </div>
                      ))}
                    </>
                  </div>
                )
              )
            )}
            {/* {selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !==
              undefined && (
                <div className={style.twoCol}>
                  <div onClick={() => handleSign("Core", "Additional")}>
                    <ESignature
                      userName={
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign?.esign
                          : ""
                      }
                      showData={
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== undefined
                          ? true
                          : false
                      }
                      showDatais={true}
                    />
                  </div>
                  <div className={style.verticalAlignCenter}>
                    <div className={style.displayInRow}>
                      <div className={style.dateTitle}>Date: </div>
                      <div className={`${style.date} ${style.marginLeft}`}>
                        {selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign?.signedDate
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )} */}
          </div>

          {selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
            ?.restrictedPrivileges?.privilegesByCategories?.length > 0 && 
          selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
            ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
            ?.length !== 0 &&
            selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
              ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
              ?.length !== undefined && (
              <div className={style.padding}>
                <div className={style.cardDescription}>
                  {
                    "The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below."
                  }
                </div>

                {selectedAdditionalPrivilegeForDisplay?.map((data, index) =>
                  data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map(
                    (categories, categoriesIndex) => (
                      <div key={`${index}${categoriesIndex}`}>
                        <div className={style.categoryGrid}></div>
                        <>
                          {categories?.privileges?.map(
                            (privileges, privilegesIndex) => (
                              <div
                                className={`${style.restrictedPrivilegeGrid} ${privilegesIndex === 0 ? style.marginTop : ""
                                  }`}
                                key={`${index}${privilegesIndex}`}
                              >
                                <div className={style.itemLeft}>
                                  <strong>
                                    {privileges?.privilegeId || ""}
                                  </strong>
                                </div>
                                <div className={style.itemLeft}>
                                  {privileges?.title || ""}
                                </div>
                                <div className={style.floatRight}>
                                  <CommonRadio
                                    value={privileges?.response || ""}
                                    onChange={(e) =>
                                      handleRestrictedSelection(
                                        index,
                                        categoriesIndex,
                                        privilegesIndex,
                                        e.target.value,
                                        "response",
                                        'Additional'
                                      )
                                    }
                                    radioValue={["NO", "YES"]}
                                    label={["No", "Yes"]}
                                  />
                                </div>
                                {privileges?.response === "YES" &&
                                  (privileges?.isevidenceRequired ||
                                    privileges?.isevidenceRequired ===
                                    undefined) && (
                                    <>
                                      <div className={style.marginTop}>
                                        <CKEditor
                                          editor={ClassicEditor}
                                          data={privileges?.notes?.notes || ""}
                                          onChange={(event, editor) => {
                                            const data = editor.getData();
                                            handleRestrictedSelection(
                                              index,
                                              categoriesIndex,
                                              privilegesIndex,
                                              data,
                                              "notes",
                                              'Additional'
                                            );
                                          }}
                                          onReady={(editor) => {
                                            editor.editing.view.change(
                                              (writer) => {
                                                writer.setStyle(
                                                  "height",
                                                  "150px",
                                                  editor.editing.view.document.getRoot()
                                                );
                                              }
                                            );
                                          }}
                                          config={{
                                            placeholder:
                                              "Please provide details of your qualification and competence for this privilege (Mandatory)",
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
                                        />
                                      </div>

                                      <div className={style.marginTop10}>
                                        <div
                                          className={`${style.uploadButton}`}
                                        >
                                          <div className={style.uploadGrid}>
                                            {privileges?.file !== undefined &&
                                              privileges?.file !== null ? (
                                              <img
                                                src={VerifiedImage}
                                                alt=""
                                                className={`${style.imgIcon} `}
                                              />
                                            ) : (
                                              <img
                                                src={ToBeVerifiedImage}
                                                alt=""
                                                className={style.imgIcon}
                                              />
                                            )}
                                            <div
                                              className={`${style.uploadText} ${style.verticalAlignCenter}`}
                                            >
                                              Upload any supporting documents
                                              for evidence of qualification and
                                              competence (Optional)
                                            </div>
                                            <div>
                                              <label
                                                for={`file-upload-dynamic-basic${privilegesIndex}`}
                                                className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                              >
                                                Click to upload
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <input
                                          id={`file-upload-dynamic-basic${privilegesIndex}`}
                                          type="file"
                                          accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                          onChange={(e) => {
                                            handleRestrictedFileSelection(
                                              index,
                                              categoriesIndex,
                                              privilegesIndex,
                                              e.target.files[0],
                                              "file",
                                              'Additional'
                                            );
                                          }}
                                        />
                                      </div>
                                      {privileges?.file !== null &&
                                        privileges?.file?.fileName !==
                                        undefined && (
                                          <div
                                            className={`${style.fileDisplay} ${style.fileDisplayText} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                          >
                                            <div className={style.displayInRow}>
                                              <div
                                                onClick={() => {
                                                  window.open(
                                                    privileges?.file?.fileURL,
                                                    "_blank"
                                                  );
                                                }}
                                              >
                                                {privileges?.file?.fileType ===
                                                  "application/pdf" ? (
                                                  <img
                                                    src={PdfDoc}
                                                    alt=""
                                                    className={
                                                      style.docTypeImgStyle
                                                    }
                                                  />
                                                ) : privileges?.file?.fileType?.startsWith(
                                                  "image/"
                                                ) ? (
                                                  <img
                                                    src={ImgDoc}
                                                    alt=""
                                                    className={
                                                      style.docTypeImgStyle
                                                    }
                                                  />
                                                ) : (
                                                  <TextSnippetOutlinedIcon
                                                    style={{
                                                      fontSize: 20,
                                                      color: `${data?.subStatus}`,
                                                    }}
                                                  />
                                                )}
                                              </div>
                                              <div className={style.marginLeft}>
                                                {privileges?.file?.fileName}
                                              </div>
                                            </div>
                                            <div>
                                              <img
                                                src={DeleteIcon}
                                                alt=""
                                                className={
                                                  style.docTypeImgStyle
                                                }
                                                onClick={() => {
                                                  handleRestrictedSelection(
                                                    index,
                                                    categoriesIndex,
                                                    privilegesIndex,
                                                    null,
                                                    "removeFile",
                                                    'Additional'
                                                  );
                                                }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      <br />
                                    </>
                                  )}
                              </div>
                            )
                          )}
                        </>
                      </div>
                    )
                  )
                )}
                {/* <div className={style.twoCol}>
                  <div
                    onClick={getIsAdditionalRestrictedValuesFilled(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      ?.restrictedPrivileges?.privilegesByCategories?.[0]
                      ?.privileges) ? () => {
                        handleSign("Restricted", "Additional");
                      } : () => { }}
                  >
                    <ESignature
                      userName={
                        selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign?.esign
                          : ""
                      }
                      showData={
                        selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null &&
                          selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign !== undefined
                          ? true
                          : false
                      }
                      showDatais={true}
                    />
                  </div>
                  <div className={style.verticalAlignCenter}>
                    <div className={style.displayInRow}>
                      <div className={style.dateTitle}>Date: </div>
                      <div className={`${style.date} ${style.marginLeft}`}>
                        {selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
                            ?.restrictedPrivileges?.esign?.signedDate
                          : ""}
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            )
            }
        </>
      );
    }
  };
  

  const getIsAdditionalRestrictedValuesFilled = (set) => {
    console.log(set, 'enteredCheck')
    const allAdditionalHaveResponse = set?.every(
      item => {
        const hasValidResponse = typeof item?.response === 'string' && item?.response?.trim() !== '' && item?.response !== null;
        const isResponseYes = item?.response === 'YES';
        const hasAdditionalData = isResponseYes ? item?.notes?.notes && item?.notes?.notes?.trim() !== '' && item?.notes?.notes !== null : true;
        return hasValidResponse && hasAdditionalData;
      }
    );
    return (set?.length === 0 || set === undefined) ? true : allAdditionalHaveResponse;
  }

 const handleSubmit = async () => {
     // let mergedArray = [
     //   ...formDetails?.privileges?.obligatedPrivileges,
     //   ...selectedPrivilegesForDisplayMultiple,
     // ].reduce((unique, current) => {
     //   console.log(unique, current, 'unique')
     //   if (!unique.some((obj) => obj.id === current.id)) {
     //     unique.push(current);
     //   }
     //   console.log(unique, 'unique')
     //   return unique;
     // }, []);
 
     // let temp = {
     //   obligatedPrivileges: isPrivilegeSetChanging ? (showPrivilegeResetError || privilegeSetChangeYesOrNo === 'No') ? selectedPrivilegesForDisplayMultiple : mergedArray : formDetails?.privileges?.obligatedPrivileges,
     //   additionalPrivileges: isAdditionalPrivilegeCategoryChanging ? selectedAdditionalPrivilegeForDisplay : formDetails?.privileges?.additionalPrivileges,
     //   priorAdditionalPrivileges:
     //     formDetails?.privileges?.priorAdditionalPrivileges?.length === 0
     //       ? formDetails?.privileges?.additionalPrivileges !== null ? formDetails?.privileges?.additionalPrivileges : []
     //       : formDetails?.privileges?.priorAdditionalPrivileges !== null ? formDetails?.privileges?.priorAdditionalPrivileges : [],
     //   priorObligatedPrivileges:
     //     formDetails?.privileges?.priorObligatedPrivileges?.length === 0
     //       ? formDetails?.privileges?.obligatedPrivileges !== null ? formDetails?.privileges?.obligatedPrivileges : []
     //       : formDetails?.privileges?.priorObligatedPrivileges !== null ? formDetails?.privileges?.priorObligatedPrivileges : [],
     // };
     // console.log("data", temp);
     // setIsPrivilegeSetChanging(false);
     // setIsAdditionalPrivilegeCategoryChanging(false);
     // await POST(
     //   `application-management-service/application/${applicationId}/privileges`,
     //   temp
     // )
     //   .then((response) => {
     //     SuccessToaster("Application Updated Successfully");
     //   })
     //   .catch((error) => {
     //     ErrorToaster("Unexpected Error Updating Application");
     //   });
     // if (isPrivilegeCategoryChanging) {
     //   let data = formDetails;
     //   if (data?.basicDetails?.priorPrivilegeCategory === null || data.basicDetails.priorPrivilegeCategory.name === null || data.basicDetails.priorPrivilegeCategory.name === undefined) {
     //     data.basicDetails.priorPrivilegeCategory = {
     //       id: privilegeCategories?.filter(
     //         (data) =>
     //           data?.privilegeCategory?.category ===
     //           formDetails?.basicDetails?.credentialingPrivilegeCategory
     //             ?.credentialingCategory
     //       )?.[0]?.privilegeCategory?.id,
     //       name: formDetails?.basicDetails?.credentialingPrivilegeCategory
     //         ?.credentialingCategory,
     //       type: privilegeCategories?.filter(
     //         (data) =>
     //           data?.privilegeCategory?.category ===
     //           formDetails?.basicDetails?.credentialingPrivilegeCategory
     //             ?.credentialingCategory
     //       )?.[0]?.privilegeCategory?.type,
     //     };
     //   }
     //   if (selectedPrivilegeCategory !== "") {
     //     data.basicDetails.credentialingPrivilegeCategory.credentialingCategory =
     //       privilegeCategories?.filter(
     //         (data) => data?.privilegeCategory?.id === selectedPrivilegeCategory
     //       )?.[0]?.privilegeCategory?.category;
     //   }
     //   data.basicDetails.departmentSpecialty.department = departmentList?.filter(
     //     (data) => data?.id === selectedDepartment
     //   )?.[0]?.departmentName?.name;
     //   data.basicDetails.existingCredentialingPrivilegeCategory = {
     //     hasExistingPrivilege:
     //       privilegeAtOtherHospitalYesOrNo === "Yes" ? true : false,
     //     credentialingPrivilegeCategory: {
     //       id: selectedPrivilegeCategoryAtPrevHospital,
     //       name: privilegeCategories?.filter(
     //         (data) => data?.privilegeCategory?.id === selectedPrivilegeCategoryAtPrevHospital
     //       )?.[0]?.privilegeCategory?.category,
     //       type: privilegeCategories?.filter(
     //         (data) => data?.privilegeCategory?.id === selectedPrivilegeCategoryAtPrevHospital
     //       )?.[0]?.privilegeCategory?.type,
     //     },
     //     hospitalName:
     //       privilegeAtOtherHospitalYesOrNo === "Yes"
     //         ? prevHospitalName
     //         : false,
     //     privileges:
     //       privilegeAtOtherHospitalYesOrNo === "Yes"
     //         ? selectedPrivilegesForCourtesy
     //         : false,
     //     hospitalPrivileges: data?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges,
     //     priorHospitalPrivileges: data?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges
     //   };
     //   console.log(data);
     //   await PUT(
     //     `application-management-service/application/${applicationId}`,
     //     data
     //   )
     //     .then((response) => {
     //       console.log(response);
     //       // setFormDetails(response?.data);
     //       SuccessToaster("Staff Member Application Updated Successfully");
     //     })
     //     .catch((error) => {
     //       console.log(error);
     //       ErrorToaster("Unexpected Error Updating Staff Member Application");
     //     });
     // }
     if (privilegesMaintainedInOtherHositals) {
       let tempHospitalPrivilegeSet;
       if (privilegeAtOtherHospitalIndex !== undefined && isPrivilegeAtOtherHospitalEdited) {
         tempHospitalPrivilegeSet = hospitalPrivilegeSet;
         tempHospitalPrivilegeSet[privilegeAtOtherHospitalIndex] = { hospitalName: hospitalName, privileges: hospitalPrivilege, privilegeCategory: hospitalPrivilegeCategory };
       } else {
         if (hospitalName !== "") {
           tempHospitalPrivilegeSet = [...(hospitalPrivilegeSet || []), { hospitalName: hospitalName, privileges: hospitalPrivilege, privilegeCategory: hospitalPrivilegeCategory }];
         } else {
           console.log('updatedP', hospitalPrivilegeSet)
           tempHospitalPrivilegeSet = hospitalPrivilegeSet;
         }
       }
       setHospitalName('');
       setHospitalPrivilege('');
       setHospitalPrivilegeCategory('')
       setIsPrivilegeAtOtherHospitalEdited(false);
       setSelectedPrivilegesForDisplayMultiple([]);
       setPrivilegeAtOtherHospitalIndex();
       let data = formDetails;
 
       data.basicDetails.existingCredentialingPrivilegeCategory = {
         hasExistingPrivilege: data.basicDetails.existingCredentialingPrivilegeCategory?.hasExistingPrivilege,
         credentialingPrivilegeCategory: data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory?.id !== "" ? data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory : null,
         hospitalName: data.basicDetails.existingCredentialingPrivilegeCategory?.hospitalName,
         privileges: data.basicDetails.existingCredentialingPrivilegeCategory?.privileges,
         hospitalPrivileges: tempHospitalPrivilegeSet,
         priorHospitalPrivileges: data?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges === null ? data?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges : data?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges
       };
       console.log(data);
       await PUT(
         `application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`,
         data
       )
         .then((response) => {
           console.log(response);
           setFormDetails(response?.data);
        //    SuccessToaster("Staff Member Application Updated Successfully");
         })
         .catch((error) => {
           console.log(error);
        //    ErrorToaster("Unexpected Error Updating Staff Member Application");
         });
     }
     if (
       isPrivilegeSetChanging &&
       formDetails?.basicDetails?.credentialingPrivilegeCategory
         ?.credentialingCategory === "Courtesy Staff With Admitting Privileges"
     ) {
       let data = formDetails;
       data.basicDetails.existingCredentialingPrivilegeCategory = {
         hasExistingPrivilege:
           data?.basicDetails?.existingCredentialingPrivilegeCategory
             ?.hasExistingPrivilege,
         credentialingPrivilegeCategory:
           data?.basicDetails?.existingCredentialingPrivilegeCategory
             ?.credentialingPrivilegeCategory,
         hospitalName:
           data?.basicDetails?.existingCredentialingPrivilegeCategory
             ?.hospitalName,
         privileges: selectedPrivilegesForCourtesy,
       };
       console.log(data);
       await PUT(
         `application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`,
         data
       )
         .then((response) => {
           console.log(response);
           setFormDetails(response?.data);
        //    SuccessToaster("Staff Member Application Updated Successfully");
         })
         .catch((error) => {
           console.log(error);
        //    ErrorToaster("Unexpected Error Updating Staff Member Application");
         });
     }
     handleSubmitAcknowledgement()
   };
 
   const handleSubmitAcknowledgement = async (isNavigate) => {
     let temp = {
       schemaId: formDetails?.forms?.[formIndex]?.schemaId,
       data: {
         privilegeChangeYesOrNo: privilegeChangeYesOrNo,
         departmentChangeYesOrNo: departmentChangeYesOrNo,
         privilegeSetChangeYesOrNo: privilegeSetChangeYesOrNo,
         additionalPrivilegeChangeYesOrNo: additionalPrivilegeChangeYesOrNo,
         privilegeAtOtherHospitalYesOrNo: privilegeAtOtherHospitalYesOrNo,
         privilegeChangeUpdated: formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined ? formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated : false,
         departmentChangeUpdated: formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined ? formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated : false,
         privilegeSetChangeUpdated: formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined ? formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated : false,
         additionalPrivilegeChangeUpdated: formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined ? formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated : false,
         privilegeAtOtherHospitalUpdated: formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated : false,
       },
       unFilledFields: formDetails?.forms?.[formIndex]?.unFilledFields,
       acknowledged: true,
     };
     await PUT(
       `application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/form/${formDetails?.forms?.[formIndex]?.id}`,
       temp
     )
       .then((response) => {
         console.log(response);
         setFormDetails(response?.data);
        //  SuccessToaster("Application Updated Successfully");
       })
       .catch((error) => {
         console.log(error);
        //  ErrorToaster("Unexpected Error Updating Application");
       });
   }; 

 const getAdditionalStaffPrivilege = async () => {
    if (selectedAdditionalDepartment !== "" && selectedAdditionalDepartment !== undefined) {
      if (selectedAdditionalSpeciality !== undefined && selectedAdditionalSpeciality !== "") {
        const { data: privilege } = await GET(
          `entity-service/staffPrivilege?department=${selectedAdditionalDepartment}&serviceArea=${selectedAdditionalSpeciality}`
        );
        setAdditionalStaffPrivilege(privilege);
      } else {
        const { data: privilege } = await GET(
          `entity-service/staffPrivilege?department=${selectedAdditionalDepartment}`
        );
        setAdditionalStaffPrivilege(privilege);
      }
      const { data: allPrivilege } = await GET(
        `entity-service/staffPrivilege`
      );
      setAllStaffPrivilege(allPrivilege)
    }
  };

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
  //  setIsLoadingImage(true);
   const { data: formDetails } = await GET(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`);
   setFormDetails(formDetails);
  //  setIsLoadingImage(false);
  } catch (error) {
   console.error("Error fetching application:", error);
  }
 };

 const getFormSchema = async () => {
     if (formDetails?.forms?.[formIndex]?.schemaId !== undefined) {
       const { data: form } = await GET(
         `application-management-service/formSchema/${formDetails?.forms?.[formIndex]?.schemaId}`
       );
       setFormSchema(form?.schema);
       setFormSchemaWholeObject(form);
     }
   };

 const getDepartmentList = async () => {
  const { data: department } = await GET(`entity-service/department`);
  setDepartmentList(department);
 };

 const getformDetails = async () => {
  const { data: basicForm } = await GET(`application-management-service/application/basicForm`);
  if (basicForm) {
   // if (!isNextpage) {
   const { data: form } = await GET(`application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`);
   let temp = form?.schema;
   if (temp.properties.applicant.properties !== null) {
    delete temp.properties.applicant.properties["letterOfInterest"];
    delete temp.properties.applicant.properties["curriculumVitae"];
   }
   setFormData(form?.schema);
   // setFormSchemaWholeObject(form);
   console.log("formData", formData);
  }
 };

 const getSelectedPrivilegeList = (value) => {
    let temp = selectedAdditionalPrivilegeForDisplay;
    if (selectedAdditionalPrivilegeForEdit?.id !== undefined) {
      let index = selectedAdditionalPrivilegeForDisplay?.findIndex(
        (data) => data?.id === selectedAdditionalPrivilegeForEdit?.id
      );
      temp[index] = value[0];
      setSelectedAdditionalPrivilegeForDisplay(temp);
    } else {
      temp.push(value[0]);
      setSelectedAdditionalPrivilegeForDisplay(temp);
    }
    setSelectedAdditionalPrivilegeForEdit({});
  };

  //  useEffect(() => {
  //     // if (formDetails !== undefined && formIndex !== undefined) {
  //     //   // setIsLoadingPage(false)
  //     //   // if (basicForm && !formSchema) {
  //     //   //   getFormSchema();
  //     //   //   getUploadFormSchema();
  //     //   //   getPrivilegeCategory();
  //     //   // }
  //     //   // if (basicForm?.privileges?.obligatedPrivileges?.[0]?.id) {
  //     //   //   setSelectedPrivilege(basicForm?.privileges?.obligatedPrivileges?.[0]?.id);
  //     //   // }
  //     //   // // if (basicForm?.privileges?.priorObligatedPrivileges?.length === 0 &&
  //     //   // //   basicForm?.privileges?.obligatedPrivileges?.length === 0) {
  //     //   // //   setIsPrivilegeSetChanging(true);
  //     //   // //   setPrivilegeSetChangeYesOrNo('No');
  //     //   // // }
  //     //   // setSelectedAdditionalPrivilegeForDisplay(
  //     //   //   basicForm?.privileges?.additionalPrivileges
  //     //   // );
  //     //   // setSelectedPrivilegesForDisplayMultiple(
  //     //   //   basicForm?.privileges?.obligatedPrivileges
  //     //   // );
  //     //   // if (!dontUpdatePrivilegeState && !isShowESignDialog && !isShowESignConfirmationDialog) {
  //     //   //   setSelectedAdditionalPrivilegesForDisplayMultiple(
  //     //   //     basicForm?.privileges?.additionalPrivileges
  //     //   //   );
  //     //   //   setSelectedPrivilegeForDisplay(basicForm?.privileges?.obligatedPrivileges);
  //     //   // }
  //     //   // setHospitalPrivilegeSet(basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges === null ? [] : basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges)
  //     //   // setSelectedValue(basicForm?.basicDetails?.regionalCallResponsibilities?.regionalCallResponsibilities !== undefined ? basicForm?.basicDetails?.regionalCallResponsibilities?.regionalCallResponsibilities : 'NA')
  //     //   // setNavigateURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`);
  //     //   // if ((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL === undefined && basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text === undefined)) {
  //     //   //   setDontUpdatePrivilegeState(true)
  //     //   //   setIsShowESignDialog(true)
  //     //   // }
  //     //   if (formDetails?.forms[formIndex]?.data !== null) {
  //     //     setPrivilegeChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo);
  //     //     setDepartmentChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo);
  //     //     setPrivilegeSetChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo);
  //     //     setAdditionalPrivilegeChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo)
  //     //     setPrivilegeAtOtherHospitalYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo)
  //     //   }
  //     // } else {
  //     //   setIsLoadingPage(true);
  //     // }
  //     setPrivilegeChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo);
  //     setPrivilegeSetChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo);
  //     setAdditionalPrivilegeChangeYesOrNo(formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo)
  //   }, [formDetails, formIndex]);

  useEffect(() => {
    const data = formDetails?.forms?.[formIndex]?.data;
  
    setPrivilegeChangeYesOrNo(data ? data.privilegeChangeYesOrNo : "");
    setPrivilegeSetChangeYesOrNo(data ? data.privilegeSetChangeYesOrNo : "");
    setAdditionalPrivilegeChangeYesOrNo(data ? data.additionalPrivilegeChangeYesOrNo : "");
  }, [formDetails, formIndex]);

 const handleSubmitPrivilegeSet = async (isUpdated, privileges, isDelete) => {
  if (isUpdated) {
   let mergedArray = [...formDetails?.privileges?.obligatedPrivileges, ...privileges].reduce((unique, current) => {
    console.log(unique, current, "unique");
    if (!unique.some((obj) => obj.id === current.id)) {
     unique.push(current);
    }
    console.log(unique, "unique");
    return unique;
   }, []);

   let temp = {
    obligatedPrivileges: isDelete ? privileges : mergedArray,
    additionalPrivileges: formDetails?.privileges?.additionalPrivileges,
    priorAdditionalPrivileges: formDetails?.privileges?.priorAdditionalPrivileges,
    priorObligatedPrivileges: !formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated
     ? formDetails?.privileges?.obligatedPrivileges
     : formDetails?.privileges?.priorObligatedPrivileges,
   };
   console.log("data", temp);
   await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/privileges`, temp);
  } else {
   if (!formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated) {
    let temp = {
     obligatedPrivileges: formDetails?.privileges?.obligatedPrivileges,
     additionalPrivileges: formDetails?.privileges?.additionalPrivileges,
     priorAdditionalPrivileges: formDetails?.privileges?.priorAdditionalPrivileges,
     priorObligatedPrivileges: formDetails?.privileges?.obligatedPrivileges,
    };
    console.log("data", temp);
    await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/privileges`, temp);
   } else {
    let temp = {
     obligatedPrivileges: formDetails?.privileges?.priorObligatedPrivileges,
     additionalPrivileges: formDetails?.privileges?.additionalPrivileges,
     priorAdditionalPrivileges: formDetails?.privileges?.priorAdditionalPrivileges,
     priorObligatedPrivileges: formDetails?.privileges?.priorObligatedPrivileges,
    };
    console.log("data", temp);
    await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/privileges`, temp);
   }
  }
  let temp = {
   schemaId: formDetails?.forms?.[formIndex]?.schemaId,
   data: {
    privilegeChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo
      : "",
    departmentChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo
      : "",
    privilegeSetChangeYesOrNo: isUpdated ? privilegeSetChangeYesOrNo : "Yes",
    additionalPrivilegeChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo
      : "",
    privilegeAtOtherHospitalYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo
      : "",
    privilegeChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated
      : false,
    departmentChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated
      : false,
    privilegeSetChangeUpdated: true,
    additionalPrivilegeChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated
      : false,
    privilegeAtOtherHospitalUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated
      : false,
   },
   unFilledFields: formDetails?.forms?.[formIndex]?.unFilledFields,
   acknowledged: true,
  };
  await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/form/${formDetails?.forms?.[formIndex]?.id}`, temp).then(
   (response) => {
    getApplication();
   },
  );
 };

 const handleSubmitAdditionalPrivilegeSet = async (isUpdated, privileges, isDelete) => {
  if (isUpdated) {
   let mergedArray = [...formDetails?.privileges?.additionalPrivileges, ...privileges].reduce((unique, current) => {
    console.log(unique, current, "unique");
    if (!unique.some((obj) => obj.id === current.id)) {
     unique.push(current);
    }
    console.log(unique, "unique");
    return unique;
   }, []);

   let temp = {
    obligatedPrivileges: formDetails?.privileges?.obligatedPrivileges,
    additionalPrivileges: isDelete ? privileges : mergedArray,
    priorAdditionalPrivileges: !formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated
     ? formDetails?.privileges?.additionalPrivileges
     : formDetails?.privileges?.priorAdditionalPrivileges,
    priorObligatedPrivileges: formDetails?.privileges?.priorObligatedPrivileges,
   };
   console.log("data", temp);
   await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/privileges`, temp);
  } else {
   if (!formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated) {
    let temp = {
     obligatedPrivileges: formDetails?.privileges?.obligatedPrivileges,
     additionalPrivileges: [],
     priorAdditionalPrivileges: formDetails?.privileges?.additionalPrivileges,
     priorObligatedPrivileges: formDetails?.privileges?.priorObligatedPrivileges,
    };
    console.log("data", temp);
    await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/privileges`, temp);
   } else {
    let temp = {
     obligatedPrivileges: formDetails?.privileges?.obligatedPrivileges,
     additionalPrivileges: [],
     priorAdditionalPrivileges: formDetails?.privileges?.priorAdditionalPrivileges,
     priorObligatedPrivileges: formDetails?.privileges?.priorObligatedPrivileges,
    };
    console.log("data", temp);
    await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/privileges`, temp);
   }
  }
  let temp = {
   schemaId: formDetails?.forms?.[formIndex]?.schemaId,
   data: {
    privilegeChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo
      : "",
    departmentChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo
      : "",
    privilegeSetChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo
      : "Yes",
    additionalPrivilegeChangeYesOrNo: isUpdated ? additionalPrivilegeChangeYesOrNo : "No",
    privilegeAtOtherHospitalYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo
      : "",
    privilegeChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated
      : false,
    departmentChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated
      : false,
    privilegeSetChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated
      : false,
    additionalPrivilegeChangeUpdated: true,
    privilegeAtOtherHospitalUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated
      : false,
   },
   unFilledFields: formDetails?.forms?.[formIndex]?.unFilledFields,
   acknowledged: true,
  };
  await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/form/${formDetails?.forms?.[formIndex]?.id}`, temp).then(
   (response) => {
    getApplication();
   },
  );
 };

//  const handleSelectedPrivilegesForDisplayMultiple = (data) => {
//     let temp = selectedPrivilegesForDisplayMultiple;
//     temp.push(data);
//     setSelectedPrivilegesForDisplayMultiple(temp);
//     handleSubmitPrivilegeSet(true, temp)
// };

const handleSelectedPrivilegesForDisplayMultiple = (data) => {
  let temp = selectedPrivilegesForDisplayMultiple ? [...selectedPrivilegesForDisplayMultiple] : [];
  temp.push(data);
  setSelectedPrivilegesForDisplayMultiple(temp);
  handleSubmitPrivilegeSet(true, temp);
};

 const handleDeleteSelectedPrrivilege = (id) => {
  let filteredData = selectedPrivilegesForDisplayMultiple?.filter((data) => data?.id !== id);
  setSelectedPrivilegesForDisplayMultiple(filteredData);
  handleSubmitPrivilegeSet(true, filteredData, true);
 };

 const handleDeleteSelectedAdditionalPrrivilege = (id) => {
  let filteredData = selectedAdditionalPrivilegesForDisplayMultiple?.filter((data) => data?.id !== id);
  setSelectedAdditionalPrivilegesForDisplayMultiple(filteredData);
  handleSubmitAdditionalPrivilegeSet(true, filteredData, true);
  setShowAdditionalPrivileges(false)
 };

//  const handleKeepYourPrivilegeNo = () => {
//   // if (((formDetails?.forms?.[formDetails?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL !== undefined || formDetails?.forms?.[formDetails?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text !== undefined))) {
//   //   setDontUpdatePrivilegeState(true)
//   //   setIsShowESignConfirmationDialog(true)
//   // } else {
//   //   setDontUpdatePrivilegeState(true)
//   //   setIsShowESignDialog(true)
//   // }
//   setIsPrivilegeSetChanging(true);
//   setPrivilegeSetChangeYesOrNo("No");
//  };

const handleKeepYourPrivilegeNo = () => {
  setIsPrivilegeSetChanging(true);
  setPrivilegeSetChangeYesOrNo("No");

  staffPrivilege?.forEach((data) => {
    const isSelected = selectedPrivilegesForDisplayMultiple
      ?.map((item) => item?.id)
      ?.includes(data?.id);

    if (isSelected) {
      handleDeleteSelectedPrrivilege(data?.id);
      // setPrivilegeSetChangeYesOrNo("");
    }
  });
};


 const handleChange = (privilegeId) => {
  setSelectedPrivilege(privilegeId);
  setSelectedPrivilegeForDisplay(allStaffPrivilege?.filter((data) => data?.id === privilegeId));
 };

 const handleChangeAdditional = (privilegeId) => {
  setSelectedPrivilege(privilegeId);
  setSelectedAdditionalPrivilegeForDisplay(allStaffPrivilege?.filter((data) => data?.id === privilegeId));
  setIsOpenAdd(true)
 };

 const getAdditionalDeptItems = (departmentList) => {
  let temp = [];
  let processedDepartments = new Set();

  departmentList?.forEach((department) => {
   let departmentValue = department?.departmentName?.name;
   let hasSpecialities = department?.serviceAreas?.length > 0;

   // Access formDetails directly from state
   if (
    !processedDepartments.has(department?.id) &&
    !(
     formDetails?.basicDetails?.departmentSpecialty?.department === departmentValue &&
     (formDetails?.basicDetails?.departmentSpecialty?.specialty === "" ||
      formDetails?.basicDetails?.departmentSpecialty?.specialty === null)
    )
   ) {
    let deptItem = {
     id: department?.id,
     value: departmentValue,
     specialityId: "",
     key: `dept-${department?.id}`,
    };
    temp.push(deptItem);
    processedDepartments.add(department?.id);
   }

   if (hasSpecialities) {
    department?.serviceAreas?.forEach((specialityData) => {
     if (
      !(
       formDetails?.basicDetails?.departmentSpecialty?.department === specialityData?.department?.departmentName?.name &&
       formDetails?.basicDetails?.departmentSpecialty?.specialty === specialityData?.name
      )
     ) {
      let specialityItem = {
       id: specialityData?.id,
       departmentId: specialityData?.department?.id,
       value: `${specialityData?.department?.departmentName?.name} - ${specialityData?.name}`,
       specialityId: specialityData?.id,
       key: `speciality-${specialityData?.department?.id}-${specialityData?.id}`,
      };

      temp.push(specialityItem);
     }
    });
   }
  });

  return temp;
 };

 const getDeptItems = (departmentList) => {
  let temp = [];
  let processedDepartments = new Set();

  departmentList?.forEach((department) => {
   let departmentValue = department?.departmentName?.name;
   let hasSpecialities = department?.serviceAreas?.length > 0;

   // Add department first (if not already added)
   if (!processedDepartments.has(department?.id)) {
    let deptItem = {
     id: department?.id,
     value: departmentValue,
     specialityId: "",
     key: `dept-${department?.id}`,
    };
    temp.push(deptItem);
    processedDepartments.add(department?.id);
   }

   // If serviceAreas exist, process and add them as specialities
   if (hasSpecialities) {
    department?.serviceAreas?.forEach((specialityData) => {
     let specialityItem = {
      id: specialityData?.id,
      departmentId: specialityData?.department?.id, // department.id from speciality
      value: `${specialityData?.department?.departmentName?.name} - ${specialityData?.name}`, // Department name followed by speciality name
      specialityId: specialityData?.id, // Speciality ID
      key: `speciality-${specialityData?.department?.id}-${specialityData?.id}`, // Unique key for speciality
     };

     temp.push(specialityItem);
    });
   }
  });

  return temp;
 };

 const handleSubmitDepartment = async (isUpdated) => {
  let data = formDetails;
  console.log(data, "data");
  if (isUpdated) {
   console.log(data, "data");
   if (data?.basicDetails?.priorDepartmentSpecialty === null && !formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated) {
    console.log(data, "data");
    data.basicDetails.priorDepartmentSpecialty = { ...formDetails?.basicDetails?.departmentSpecialty };
   }
   data.basicDetails.departmentSpecialty = { ...data.basicDetails.departmentSpecialty };
   data.basicDetails.departmentSpecialty.department = departmentList?.filter(
    (data) => data?.id === selectedDepartment,
   )?.[0]?.departmentName?.name;
   data.basicDetails.departmentSpecialty.specialty = departmentList
    ?.filter((data) => data?.id === selectedDepartment)?.[0]
    ?.serviceAreas?.filter((data) => data?.id === selectedSpeciality)?.[0]?.name;
   if (!data?.basicDetails?.regionalCallResponsibilities) {
    data.basicDetails.regionalCallResponsibilities = {};
   }
   data.basicDetails.regionalCallResponsibilities.regionalCallResponsibilities = selectedValue || "NA";
   console.log(data, "data");
   await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`, data)
    .then((response) => {
     console.log(response);
    })
    .catch((error) => {
     console.log(error);
    });
  } else {
   if (!formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated) {
    data.basicDetails.priorDepartmentSpecialty = formDetails?.basicDetails?.departmentSpecialty;
   } else {
    if (
     data?.basicDetails?.priorDepartmentSpecialty !== null &&
     data?.basicDetails?.priorDepartmentSpecialty?.department !== undefined
    ) {
     data.basicDetails.departmentSpecialty = data?.basicDetails?.priorDepartmentSpecialty;
    }
   }
   if (!data?.basicDetails?.regionalCallResponsibilities) {
    data.basicDetails.regionalCallResponsibilities = {};
   }
   data.basicDetails.regionalCallResponsibilities.regionalCallResponsibilities = selectedValue || "NA";
   await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`, data)
    .then((response) => {
     console.log(response);
    })
    .catch((error) => {
     console.log(error);
    });
   console.log(data, "data");
  }
  let temp = {
   schemaId: formDetails?.forms?.[formIndex]?.schemaId,
   data: {
    privilegeChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo
      : "",
    departmentChangeYesOrNo: isUpdated ? "No" : "Yes",
    privilegeSetChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo
      : "",
    additionalPrivilegeChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo
      : "",
    privilegeAtOtherHospitalYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo
      : "",
    privilegeChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated
      : false,
    departmentChangeUpdated: true,
    privilegeSetChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated
      : false,
    additionalPrivilegeChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated
      : false,
    privilegeAtOtherHospitalUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated
      : false,
   },
   unFilledFields: formDetails?.forms?.[formIndex]?.unFilledFields,
   acknowledged: true,
  };
  await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/form/${formDetails?.forms?.[formIndex]?.id}`, temp)
   .then((response) => {
    console.log(response);
    getApplication();
   })
   .catch((error) => {
    console.log(error);
   });
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

 const handleSubmitPrivilegeCategoryNo = async () => {
    let temp = {
     obligatedPrivileges: [],
    //  additionalPrivileges: formDetails?.privileges?.additionalPrivileges,
    //  priorAdditionalPrivileges: formDetails?.privileges?.priorAdditionalPrivileges,
    //  priorObligatedPrivileges: formDetails?.privileges?.priorObligatedPrivileges,
    };
    await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`, temp)
    .then((response) => {
     getApplication();
    });
   }

 const handleSubmitPrivilegeCategory = async (isUpdated) => {
  let data = formDetails;
  if (isUpdated) {
   if (
    (data?.basicDetails?.priorPrivilegeCategory === null ||
     data.basicDetails.priorPrivilegeCategory.name === null ||
     data.basicDetails.priorPrivilegeCategory.name === undefined) &&
    !formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated
   ) {
    data.basicDetails.priorPrivilegeCategory = data?.basicDetailReferences?.credentialingAndPrivilegingCategory;
   }
   if (selectedPrivilegeCategory !== "") {
    data.basicDetails.credentialingPrivilegeCategory.credentialingCategory = privilegeCategories?.filter(
     (data) => data?.privilegeCategory?.id === selectedPrivilegeCategory,
    )?.[0]?.privilegeCategory?.category;
   }
   await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`, data)
    .then((response) => {
     console.log(response);
    })
    .catch((error) => {
     console.log(error);
    });
   if (showPrivilegeResetError) {
    let temp = {
     obligatedPrivileges: [],
     additionalPrivileges: formDetails?.privileges?.additionalPrivileges,
     priorAdditionalPrivileges: formDetails?.privileges?.priorAdditionalPrivileges,
     priorObligatedPrivileges: formDetails?.privileges?.priorObligatedPrivileges,
    };
    await POST(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/privileges`, temp).then((response) => {
     getApplication();
    });
   }
  } else {
   if (!formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated) {
    data.basicDetails.priorPrivilegeCategory = data?.basicDetailReferences?.credentialingAndPrivilegingCategory;
   } else {
    if (
     data?.basicDetails?.priorPrivilegeCategory?.name !== null &&
     data?.basicDetails?.priorPrivilegeCategory?.name !== undefined
    ) {
     data.basicDetails.credentialingPrivilegeCategory.credentialingCategory = data?.basicDetails?.priorPrivilegeCategory?.name;
    }
   }
   await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}`, data)
    .then((response) => {
     console.log(response);
    })
    .catch((error) => {
     console.log(error);
    });
  }
  let temp = {
   schemaId: formDetails?.forms?.[formIndex]?.schemaId,
   data: {
    privilegeChangeYesOrNo: isUpdated ? privilegeChangeYesOrNo : "Yes",
    departmentChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo
      : "",
    privilegeSetChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo
      : "",
    additionalPrivilegeChangeYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo
      : "",
    privilegeAtOtherHospitalYesOrNo:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo
      : "",
    privilegeChangeUpdated: true,
    departmentChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.departmentChangeUpdated
      : false,
    privilegeSetChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated
      : false,
    additionalPrivilegeChangeUpdated:
     formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated
      : false,
    privilegeAtOtherHospitalUpdated:
     formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined
      ? formDetails?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated
      : false,
   },
   unFilledFields: formDetails?.forms?.[formIndex]?.unFilledFields,
   acknowledged: true,
  };
  await PUT(`application-management-service/application/${selectDataLocum?.onGoingApplication?.id}/form/${formDetails?.forms?.[formIndex]?.id}`, temp)
   .then((response) => {
    console.log(response);
    getApplication();
   })
   .catch((error) => {
    console.log(error);
   });
 };

 const getPrivilegeCategory = async () => {
  const { data: privilege } = await GET(
   `entity-service/privilege/${formDetails?.basicDetails?.priorPrivilegeCategory?.id !== null && formDetails?.basicDetails?.priorPrivilegeCategory?.id !== undefined ? formDetails?.basicDetails?.priorPrivilegeCategory?.id : formDetails?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id}?applicantTypeId=${formDetails?.basicDetailReferences?.applicantType?.id}`,
  );
  setPrivilegeCategories(privilege?.allowedPrivilegeCategories);
  const { data: privilegeAtOtherHospital } = await GET(
   `entity-service/privilege/${formDetails?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id !== null && formDetails?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id !== undefined ? formDetails?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id : formDetails?.basicDetailReferences?.priorPrivilegeCategory?.id}?applicantTypeId=${formDetails?.basicDetailReferences?.applicantType?.id}`,
  );
  setPrivilegeCategoriesAtOtherHospitals(privilegeAtOtherHospital?.otherHospitalPrivilegeCategories);
 };

 const onClose = () => {
  getIsOpen(false);
 };


const getNext12MonthsFromCreatedDate = (createdDateStr) => {
  const months = [];
  const createdDate = new Date(createdDateStr);

  for (let i = 1; i <= 12; i++) {
    const futureDate = addMonths(createdDate, i);
    // const oneDayBefore = subDays(futureDate, 1); // Go one day before the future "same day"

    const label = `${i} ${i === 1 ? 'month' : 'months'}`;
    const value = format(futureDate, 'yyyy-MM-dd');

    months.push({ label, value });
  }

  // Add "Custom End Date" option
  const now = new Date();
  months.push({
    label: 'Custom End Date',
    value: 'Custom'
  });

  return months;
};

 const monthOptions = selectDataLocum?.tenure?.to ? getNext12MonthsFromCreatedDate(selectDataLocum?.tenure?.to) : [];

 const lastModifiedDate = formDetails?.lastModifiedDate;
 const formattedDate = lastModifiedDate ? format(new Date(lastModifiedDate), "dd/MM/yyyy") : "-";
 const ExpireDate = selectDataLocum?.tenure?.to 
   ? parseISO(selectDataLocum.tenure.to) 
   : null;
 const formattedExpiringDate = ExpireDate ? format(new Date(ExpireDate), "dd/MM/yyyy") : "-";
 const daysRemaining = ExpireDate ? differenceInDays(new Date(ExpireDate), new Date()) : null;
//  const monthsList = getNext12MonthsFromCreatedDate(format(new Date(selectDataLocum?.tenure?.to), "dd/MM/yyyy"));
  // const selectedMonthLabel = selectedMonth === "Custom"
  // ? "Custom End Date"
  // : monthsList.find(month => month?.value === selectedMonth)?.label || '';
  // const selectedMonthLabel = selectedMonth !== "Custom"
  // ? monthsList.find(month => month.value === selectedMonth)?.label
  // : "Custom End Date";


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
       <div className={`${style.heading}`}>
          {selectedTab === "ACTIVELOCUM"
            ? "Locum Period & Privileges Extension"
            : "Reactivate Locum Staff"}
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
           </span>
           <div className={`${style.rejectionTextStyle} ${style.marginLeft2}`}>
            {selectDataLocum?.basicDetailReferences?.applicantType?.serviceProviderType}
           </div>
          </div>
          <div className={`${style.twoColumnGridInner} ${style.displayInRowCenter}`}>
           <span className={`${style.rejectionTextStyle}`}>Department / Division:</span>
           <span className={`${style.rejectionHeadingTextStyle}`}>
           {selectDataLocum?.basicDetailReferences?.department?.name || ""}
            {selectDataLocum?.basicDetailReferences?.specialty
              ? ` - ${selectDataLocum?.basicDetailReferences?.specialty?.name}`
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
           <span className={`${style.rejectionTextStyle}`}>Days From Expiration :</span>
           <span className={`${style.rejectionTextStyle1}`}>{daysRemaining}</span>
          </div>
          {/* <div className={`${style.twoColumnGridInner}`}>
           <span className={`${style.rejectionTextStyle}`}>OHIP Number :</span>
           <span className={`${style.rejectionTextStyle1}`}>-</span>
          </div> */}
         </div>
        </div>
       </div>
       {showSelectedPrivilegeLocum === false && (
        <div className={`${style.marginTop10}`}>
         <div className={`${style.rejectionHeadingTextStyle}`}>
          {selectedTab === "ACTIVELOCUM" ? `Locum Period Expiring On ${formattedExpiringDate} (${daysRemaining} Days)` : "New Locum Period"}
         </div>
         <div className={`${style.rejectionTextStyle}`}>
          {selectedTab === "ACTIVELOCUM"
            ? "Extend the Period and Privileges for "
            : "Indicate the Period and Privileges for "}
          <span className={style.rejectionHeadingTextStyle}>
            {selectDataLocum?.applicant?.name?.lastName
              ? selectDataLocum.applicant.name.lastName.charAt(0).toUpperCase() +
                selectDataLocum.applicant.name.lastName.slice(1).toLowerCase()
              : ""}
            {", "}
            {selectDataLocum?.applicant?.name?.firstName
              ? selectDataLocum.applicant.name.firstName.charAt(0).toUpperCase() +
                selectDataLocum.applicant.name.firstName.slice(1).toLowerCase()
              : ""}
          </span>
          {/* {selectedMonthLabel && <span> By {selectedMonthLabel}</span>} */}
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
            {/* </div> */}
           <div className={`${style.marginLeft} ${style.rejectionHeadingTextStyle}`}>
            Start Date <br />
            <span className={`${style.rejectionTextStyle}`}>
              {selectedTab === "ACTIVELOCUM"
                ? (ExpireDate
                    ? format(addDays(new Date(ExpireDate), 1), "dd/MM/yyyy")
                    : "N/A")
                : format(new Date(), "dd/MM/yyyy")}
            </span>
           </div>
           <div className={`${style.marginLeft} ${style.rejectionTextStyle}`}> To </div>
           <div className={`${style.marginLeft} ${style.rejectionHeadingTextStyle}`}>
            End Date <br />
            <span className={`${style.dateTextStyle}`}>
              {selectedMonth && selectedMonth !== "Custom" 
                ? format(new Date(selectedMonth), "dd/MM/yyyy") 
                : selectedMonth === "Custom" 
                  ? '' // Leave blank since the CommonDateField will appear
                  : "dd/MM/yyyy"}
            </span>

            {selectedMonth === "Custom" && (
              <div className={`${style.marginTopLess}`}>
                <CommonDateField
                  className={`${style.fullWidth}`}
                  onChange={(date) => handleDateChange(date)}
                  open={calendarStart}
                  onOpen={() => setCalendarStart(true)}
                  onClose={() => setCalendarStart(false)}
                  minDate={ExpireDate}
                  maxDate={ExpireDate ? addYears(new Date(ExpireDate), 1) : null}
                  value={customEndDate ? new Date(customEndDate) : null}
                  InputProps={{
                    style: {
                      fontSize: 14,
                      height: 30,
                    },
                  }}
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
          </div>
          </div>
          {/* <CommonRadio
           className={style.leftAlign}
           value={processReappointment}
           onChange={(e) => setProcessReappointment(e.target.value)}
           radioValue={["No"]}
           label={["No, I do not want to have Privileges Extended for this Locum staff"]}
          /> */}
         </div>
         <div className={`${style.marginTop10} ${style.noteHeadingTextStyle}`}>The maximum duration for a Locum Staff is 12 months</div>
         <div className={`${style.flexCenter} ${style.marginTop10}`}>
          <div className={`${style.fullWidth}`}>
          <div className={`${style.fieldWrapper}`}>
            <div className={`${style.lableStyle}`}>
              {'Coverage Required For (Optional)'}
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
              className={`${style.fullWidth} ${style.marginTop10}`}
              maxLength={50}
              placeholder={'Select from privileged staff'}
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
        </div>
       )}
      </div>
      {showSelectedPrivilegeLocum === true && (
       <div>
        <div className={`${style.privilegeCard} ${style.marginTop10}`}>
         <div>
          {/* <div className={style.privilegeHeading}>
           <strong>Privilege Category</strong>
          </div>
          <div className={style.twoCol}>
           <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
            <div className={style.privilegeHeadingCurrent}>Current</div>
            <div className={style.privilegeHeading}>
             {formDetails?.basicDetails?.priorPrivilegeCategory !== null &&
             formDetails?.basicDetails?.priorPrivilegeCategory?.name !== null
              ? formDetails?.basicDetails?.priorPrivilegeCategory?.name
              : formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}
            </div>
           </div>
           {formDetails?.forms?.[formIndex]?.data?.privilegeChangeUpdated && (
            <div className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}>
             <div className={style.privilegeHeadingReappointment}>Change for Reappointment</div>
             <div className={style.privilegeHeading}>
              {privilegeChangeYesOrNo === "Yes" ? (
               <div className={style.privilegeHeading}>Same as Before</div>
              ) : (
               <div className={style.privilegeHeading}>
                {formDetails?.basicDetails?.priorPrivilegeCategory?.name ===
                formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory
                 ? "Same as Before"
                 : formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}
               </div>
              )}
             </div>
            </div>
           )}
          </div> */}
          {/* <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
           <strong>Department</strong>
          </div>
          <div className={style.twoCol}>
           <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
            <div className={style.privilegeHeadingCurrent}>Current</div>
            <div className={style.privilegeHeading}>
             {formDetails?.basicDetails?.priorDepartmentSpecialty !== null &&
             formDetails?.basicDetails?.priorDepartmentSpecialty?.department !== null
              ? formDetails?.basicDetails?.priorDepartmentSpecialty?.department
              : formDetails?.basicDetails?.departmentSpecialty !== null &&
                  formDetails?.basicDetails?.departmentSpecialty?.department !== null
                ? formDetails?.basicDetails?.departmentSpecialty?.department
                : "None"}
            </div>
           </div>
           {formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== "" &&
            formDetails?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined && (
             <div className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}>
              <div className={style.privilegeHeadingReappointment}>Change for Reappointment</div>
              <div className={style.privilegeHeading}>
               {departmentChangeYesOrNo === "No" ? (
                <div className={style.privilegeHeading}>{formDetails?.basicDetails?.departmentSpecialty?.department}</div>
               ) : (
                <div className={style.privilegeHeading}>
                 {formDetails?.basicDetails?.priorDepartmentSpecialty?.department !== null
                  ? formDetails?.basicDetails?.priorDepartmentSpecialty?.department ===
                    formDetails?.basicDetails?.departmentSpecialty?.department
                    ? "Same as Before"
                    : formDetails?.basicDetails?.departmentSpecialty?.department
                  : formDetails?.basicDetails?.departmentSpecialty?.department}
                </div>
               )}
              </div>
             </div>
            )}
          </div> */}
         {(formDetails?.privileges?.priorObligatedPrivileges?.length !== 0 || formDetails?.privileges?.obligatedPrivileges?.length !== 0) && (
            <>
              <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                <strong>Privilege Sets</strong>
              </div>
              <div className={style.twoCol}>
                <div
                  className={`${style.privilegeContentCard} ${style.marginTop10}`}
                >
                  <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                  {formDetails?.privileges?.priorObligatedPrivileges?.length === 0 ?
                    // basicForm?.privileges?.obligatedPrivileges?.length === 0 ? 
                    (
                      <div className={style.privilegeHeading}>Not Available</div>
                    )
                    //  : (
                    //   <>
                    //     {basicForm?.privileges?.obligatedPrivileges?.map(
                    //       (data) => (
                    //         <div className={style.privilegeHeading}
                    //         // className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                    //         // onClick={() => {
                    //         //   setShowCurrentPrivileges(true);
                    //         //   setCurrentPrivilegesCategory('Basic')
                    //         //   handleChange(data?.id);
                    //         // }}
                    //         >
                    //           {data?.privilegeSetTitle}
                    //         </div>
                    //       )
                    //     )}
                    //   </>
                    // )
                    : (
                      <>
                        {formDetails?.privileges?.priorObligatedPrivileges?.map(
                          (data) => (
                            <div className={style.privilegeHeading}
                            // className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                            // onClick={() => {
                            //   setShowCurrentPrivileges(true);
                            //   setCurrentPrivilegesCategory('Basic')
                            //   handleChange(data?.id);
                            // }}
                            >
                              {data?.privilegeSetTitle}
                            </div>
                          )
                        )}
                      </>
                    )}
                </div>
                {privilegeSetChangeYesOrNo !== "" && (
                  <div
                    className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                  >
                    <div className={`${style.privilegeHeadingReappointment}`}>
                      Change for Locum {selectedTab === "ACTIVELOCUM" ? "Extension" : "Renewals"}
                    </div>
                    {privilegeSetChangeYesOrNo === "Yes" ? (
                      <>
                        <div className={style.privilegeHeading}>
                          Same Privileges Requested
                        </div>
                        {/* {basicForm?.privileges?.obligatedPrivileges?.map(
                          (data) => (
                            <div
                              className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                              onClick={() => {
                                setShowCurrentPrivileges(true);
                                setCurrentPrivilegesCategory('Basic')
                                setSelectedPrivilege(data?.id);
                              }}
                            >
                              {data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}
                            </div>
                          )
                        )} */}
                      </>
                    ) : (
                      <>
                        {formDetails?.privileges?.obligatedPrivileges?.map(
                          (data) => (
                            <div
                              className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                              // onClick={() => {
                              //   setShowCurrentPrivileges(true);
                              //   setCurrentPrivilegesCategory('Basic')
                              //   setSelectedPrivilege(data?.id);
                              // }}
                            >
                              {data?.privilegeSetTitle}
                            </div>
                          )
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          {(formDetails?.privileges?.priorAdditionalPrivileges?.length !== 0 || formDetails?.privileges?.additionalPrivileges?.length !== 0) && (
          <div>
            <div className={`${style.privilegeHeading} ${style.marginTop10}`}><strong>Additional Privileges</strong></div>
            <div className={style.twoCol}>
              <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                {formDetails?.privileges?.priorAdditionalPrivileges?.length === 0 ? (
                  <>
                    {formDetails?.privileges?.additionalPrivileges?.length === 0 ? (
                      <div className={style.privilegeHeading}>None</div>
                    ) : (
                      <>
                        {formDetails?.privileges?.additionalPrivileges?.map(data => (
                          <div
                            className={`${style.privilegeHeading} `}
                          // onClick={() => { setShowCurrentPrivileges(true); handleChangeAdditional(data?.id); setCurrentPrivilegesCategory('Additional') }}
                          >{data?.privilegeSetTitle}</div>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {formDetails?.privileges?.priorAdditionalPrivileges?.map(data => (
                      <div
                        className={`${style.privilegeHeading} `}
                      // onClick={() => { setShowCurrentPrivileges(true); setCurrentPrivilegesCategory('Additional') }}
                      >{data?.privilegeSetTitle}</div>
                    ))}
                  </>
                )}
              </div>
              {formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== '' && formDetails?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined && (
                <div className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}>
                  <div className={`${style.privilegeHeadingReappointment}`}>{additionalPrivilegeChangeYesOrNo === 'No' ? 'Privileges Requested' : `Change for Locum ${selectedTab === 'ACTIVELOCUM' ? 'Extension' : 'Renewal'}`}</div>
                  {additionalPrivilegeChangeYesOrNo === 'No' ? (
                    <div className={`${style.privilegeHeading}`}>None</div>
                  ) : (
                    <>
                      <div className={style.privilegeHeading}>
                        Additional Privilege Requested
                      </div>
                      {formDetails?.privileges?.additionalPrivileges?.map(data => (
                        <div
                          className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`} 
                          // onClick={() => { setShowCurrentPrivileges(true); setCurrentPrivilegesCategory('Additional'); setSelectedPrivilege(data?.id) }}
                        >{data?.privilegeSetTitle}</div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
         </div>
        </div>
        {/* <div className={`${style.cardTitle} ${style.marginTop10}`}>Do you want the locum Staff to keep their current Privilege Category?</div>
        <>
         {privilegeChangeYesOrNo === "" ? (
          <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}>
           <div
            className={`${style.reappointmentButtonOutlined}`}
            onClick={() => {
             setPrivilegeChangeYesOrNo("Yes");
             handleSubmitPrivilegeCategory();
            }}
           >
            YES
           </div>
           <div
            className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
            onClick={() => {
             setIsPrivilegeCategoryChanging(true);
             setPrivilegeChangeYesOrNo("No");
             getPrivilegeCategory();
            }}
           >
            NO
           </div>
          </div>
         ) : (
          <>
           {!isPrivilegeCategoryChanging && (
            <>
             <div className={`${style.markedAsText} ${style.marginTop10}`}>
              <strong>
               Marked as{" "}
               <span className={privilegeChangeYesOrNo === "Yes" ? style.yesText : style.noText}>{privilegeChangeYesOrNo}</span>
              </strong>{" "}
             </div>
             <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}>
              <div
               className={`${style.reappointmentButtonEdit}`}
               onClick={() => {
                setPrivilegeChangeYesOrNo("");
               }}
              >
               VIEW TO MODIFY
              </div>
             </div>
            </>
           )}
          </>
         )}
         {isPrivilegeCategoryChanging && (
          <div className={`${style.privilegeCardWithBorder} ${style.marginTop}`}>
           <CommonTextField
            value={
             privilegeCategories?.filter((data) => data?.privilegeCategory?.id === selectedPrivilegeCategory)?.[0]
              ?.privilegeCategory?.category
            }
            className={style.fullWidth}
            maxLength={50}
            placeholder={""}
            label={"What would you like to change your current Privilege Category to?"}
            required={true}
           />
           <div className={`${style.chipsContainer} ${style.marginTop10}`}>
            {privilegeCategories?.map((data) => {
             let conditionBasedOnRoles =
              formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ===
              ("Courtesy Staff With Admitting Privileges" || "Courtesy Staff Without Admitting Privileges")
               ? ["Active"]
               : formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === "Active"
                 ? ["Affiliate", "Associate", "Extended Class Nursing"]
                 : [];
             // let isDisabled = (data?.privilegeCategory?.category === formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || conditionBasedOnRoles?.includes(data?.privilegeCategory?.category));
             return (
              <div
               className={`${style.privilegeCategoryChips} ${selectedPrivilegeCategory === data?.privilegeCategory?.id ? style.privilegeCategoryChipsSelected : ""} ${style.cursorPointer}
                        `}
               onClick={() => {
                setShowPrivilegeResetError(data?.inheritExistingPrivilegeSets ? false : true);
                setSelectedPrivilegeCategory(data?.privilegeCategory?.id);
               }}
              >
               {data?.privilegeCategory?.category}
              </div>
             );
            })}
           </div>
           {showPrivilegeResetError && (
            <div className={`${style.privilegeWarningPart} ${style.marginTop}`}>
             <div className={style.privilegeWarningText}>
              Changing of the privilege category removes your current granted set of privileges.
             </div>
             <div className={`${style.marginTop10} ${style.privilegeWarningText}`}>
              You will need to request the set of privileges you would like to have for the category you are changing to.
             </div>
            </div>
           )}
           {selectedPrivilegeCategory !== "" && (
            <>
             {privilegeCategories?.filter((data) => data?.privilegeCategory?.id === selectedPrivilegeCategory)[0]
              ?.privilegeCategory?.category === "Courtesy Staff With Admitting Privileges" && (
              <div className={style.marginTop}>
               <div className={`${style.lableStyle}`}>List the Privileges you would like to request*</div>
               <TextArea
                value={selectedPrivilegesForCourtesy}
                className={`${style.fullWidth} ${style.marginTop10}`}
                onChange={(e) => setSelectedPrivilegesForCourtesy(e.target.value)}
                placeholder={"Enter here"}
                rows={4}
               />
              </div>
             )}
            </>
           )}
           <div className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}>
            <div
             className={`${style.reappointmentButton} ${style.marginLeft}`}
             onClick={() => {
              setPrivilegeSetChangeYesOrNo("No");
              setIsPrivilegeCategoryChanging(false);
              handleSubmitPrivilegeCategory(true);
              setIsEdit(false);
             }}
            >
             UPDATE
            </div>
            <div
             className={`${style.reappointmentButtonOutlined}`}
             onClick={() => {
              setIsPrivilegeCategoryChanging(false);
              setPrivilegeChangeYesOrNo("");
             }}
            >
             CANCEL
            </div>
           </div>
          </div>
         )}
        </> */}
         {formDetails?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory !== ('Courtesy Staff With Admitting Privileges' || 'Courtesy Staff Without Admitting Privileges') && (
          <>
            {(
              //   basicForm?.privileges?.priorObligatedPrivileges?.length === 0 &&
              //   basicForm?.privileges?.obligatedPrivileges?.length === 0) ? (
              //   <>
              //     <div className={`${style.cardTitle} ${style.marginTop}`}>
              //       Select and confirm the Privileges you would like to request.
              //     </div>
              //     <div
              //       className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
              //     >
              //       <div className={style.displayInRow}>
              //         <div className={style.lableStyle}>Your Department / Division or Speciality : </div>
              //         <div className={`${style.lableStyle} ${style.marginLeft}`}><strong>{`${departmentList?.filter((data) => data?.id === selectedDepartment)?.[0]?.departmentName?.name} ${(basicForm?.basicDetails?.departmentSpecialty?.specialty !== "" && basicForm?.basicDetails?.departmentSpecialty?.specialty !== undefined && basicForm?.basicDetails?.departmentSpecialty?.specialty !== null) ? '-' : ''} ${(basicForm?.basicDetails?.departmentSpecialty?.specialty !== "" && basicForm?.basicDetails?.departmentSpecialty?.specialty !== undefined && basicForm?.basicDetails?.departmentSpecialty?.specialty !== null) ? basicForm?.basicDetails?.departmentSpecialty?.specialty : ''}`}</strong></div>
              //       </div>
              //       <>
              //         {staffPrivilege !== undefined && staffPrivilege?.map((data, index) => (
              //           <>
              //             <Tooltip title={selectedPrivilegesForDisplayMultiple?.map((data) => data?.id)?.includes(data?.id) ? "Click to Remove" : "Click to Request and Sign"} arrow>
              //               <div
              //                 className={`${style.privilegeConfirmationGrid} ${style.marginTop}`}
              //                 onClick={selectedPrivilegesForDisplayMultiple
              //                   ?.map((data) => data?.id)
              //                   ?.includes(data?.id) ? () => {
              //                     handleDeleteSelectedPrrivilege(data?.id)
              //                   } : () => {
              //                     setIsHistoricalSign(true);
              //                     setShowPrivileges(true);
              //                     handleChange(data?.id);
              //                     ((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL !== undefined || basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text !== undefined) ? !isHistoricalSign ? setIsShowESignConfirmationDialog(true) : setIsShowESignConfirmationDialog(false) : setIsShowESignDialog(true))
              //                   }}
              //               >
              //                 {selectedPrivilegesForDisplayMultiple
              //                   ?.map((data) => data?.id)
              //                   ?.includes(data?.id) ? (
              //                   <div
              //                     className={`${style.iconBackgroundColorSelected} ${style.verticalAlignCenter} ${style.justifyCenter}`}
              //                   >
              //                     <CheckCircleOutlineIcon
              //                       sx={{ fontSize: 15, color: "#FFFFFF" }}
              //                     />
              //                   </div>
              //                 ) : (
              //                   <div>
              //                   </div>
              //                 )}
              //                 <div className={style.privilegeHeading}>
              //                   {data?.privilegeSetTitle}
              //                 </div>
              //                 {selectedPrivilegesForDisplayMultiple
              //                   ?.map((data) => data?.id)
              //                   ?.includes(data?.id) ? (
              //                   <div className={`${style.displayInRow} ${style.floatRight}`}>
              //                     <span className={style.signedOnText}>signed on {selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>
              //                     <div>
              //                       <img
              //                         src={DeleteIcon}
              //                         alt=""
              //                         className={`${style.docTypeImgStyle} ${style.marginLeft} ${style.floatRight}`}
              //                       />
              //                     </div>
              //                   </div>
              //                 ) : (
              //                   <button
              //                     className={`${style.addButton} ${style.marginLeft}`}
              //                   >  SELECT
              //                   </button>
              //                 )}
              //               </div>
              //             </Tooltip>
              //             {index !== staffPrivilege?.length - 1 && (
              //               <CommonDivider />
              //             )}
              //           </>
              //         ))}
              //       </>

              //       <div
              //         className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
              //       >
              //         <div
              //           className={`${style.reappointmentButton} ${style.marginLeft}`}
              //           onClick={() => {
              //             setIsEditPrivilege(false);
              //             setIsUpdateClicked(true);
              //             handleSubmit();
              //           }}
              //         >
              //           SAVE
              //         </div>
              //       </div>
              //     </div>
              //   </>
              // ) : (
              <>
              {(formDetails?.privileges?.priorObligatedPrivileges?.length !== 0 && formDetails?.privileges?.obligatedPrivileges?.length !== 0) ? (
                <>
                <div className={`${style.cardTitle} ${style.marginTop}`}>
                Would you like to have the same Privilege Set(s) currently assigned to this Locum Staff from your Department?
                </div>
                {privilegeSetChangeYesOrNo === '' ? (
                  <div
                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                  >
                    <Tooltip title={"Click to mark as Yes"} arrow>
                      <div
                        className={`${style.reappointmentButtonOutlined}`}
                        onClick={() => handleSubmitPrivilegeSet()}
                      >
                        YES
                      </div>
                    </Tooltip>
                    <Tooltip title={"Click to mark as No"} arrow>
                      <div
                        className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                        onClick={() =>{ handleKeepYourPrivilegeNo()}}
                      >
                        NO
                      </div>
                    </Tooltip>
                  </div>
                ) : (
                  <>
                    {!isPrivilegeSetChanging && (
                      <>
                        <div
                          className={`${style.markedAsText} ${style.marginTop10}`}
                        >
                          <strong>
                            Marked as{" "}
                            <span className={privilegeSetChangeYesOrNo === 'Yes' ? style.yesText : style.noText}>{privilegeSetChangeYesOrNo}</span>
                          </strong>{" "}
                        </div>
                        <div
                          className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                        >
                          <Tooltip title={"Click to View & Modify"} arrow>
                            <div
                              className={`${style.reappointmentButtonEdit}`}
                              onClick={() => { setIsEditPrivilege(true); setPrivilegeSetChangeYesOrNo('') }}
                            >
                              VIEW TO MODIFY
                            </div>
                          </Tooltip>
                        </div>
                      </>
                    )}
                  </>
                )}
                </>
              ) : (
                <div>
                <div className={`${style.cardTitle} ${style.marginTop}`}>
                 Indicate the privilege set that you would like to assign to this Locum Staff from your department?
                </div>
                <>
                  {/* <div className={`${style.cardTitle} ${style.marginTop}`}>
                    What would you like to change your current Privilege Set
                    to?
                  </div> */}
                  {/* {basicForm?.basicDetails?.credentialingPrivilegeCategory
                    ?.credentialingCategory === "Courtesy Staff With Admitting Privileges" ? (
                    <div
                      className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                    >
                      <div className={style.marginTop}>
                        <div className={`${style.lableStyle}`}>
                          List the Privileges you would like to request*
                        </div>
                        <TextArea
                          value={selectedPrivilegesForCourtesy}
                          className={`${style.fullWidth} ${style.marginTop10}`}
                          onChange={(e) =>
                            setSelectedPrivilegesForCourtesy(e.target.value)
                          }
                          placeholder={"Enter here"}
                          rows={4}
                        />
                      </div>
                      <div
                        className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                      >
                        <button
                          className={`${style.reappointmentButton} ${style.marginLeft
                            } ${selectedPrivilegesForCourtesy !== ""
                              ? ""
                              : style.disabledButton
                            }`}
                          onClick={
                            selectedPrivilegesForCourtesy === ""
                              ? () => { }
                              : () => {
                                handleSubmit();
                                setIsEditPrivilege(false);
                                setIsUpdateClicked(true);
                              }
                          }
                          disabled={selectedPrivilegesForCourtesy === ""}
                        >
                          SAVE
                        </button>
                        <div
                          className={`${style.reappointmentButtonOutlined}`}
                          onClick={() => { setIsPrivilegeSetChanging(false); setPrivilegeSetChangeYesOrNo('') }}
                        >
                          CANCEL
                        </div>
                      </div>
                    </div>
                  ) : ( */}
                  <div
                    className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                  >
                    <div className={style.displayInRow}>
                      <div className={style.lableStyle}>Your Department / Division or Speciality : </div>
                      <div className={`${style.lableStyle} ${style.marginLeft}`}><strong>{`${departmentList?.filter((data) => data?.id === selectedDepartment)?.[0]?.departmentName?.name} ${(formDetails?.basicDetails?.departmentSpecialty?.specialty !== "" && formDetails?.basicDetails?.departmentSpecialty?.specialty !== undefined && formDetails?.basicDetails?.departmentSpecialty?.specialty !== null) ? '-' : ''} ${(formDetails?.basicDetails?.departmentSpecialty?.specialty !== "" && formDetails?.basicDetails?.departmentSpecialty?.specialty !== undefined && formDetails?.basicDetails?.departmentSpecialty?.specialty !== null) ? formDetails?.basicDetails?.departmentSpecialty?.specialty : ''}`}</strong></div>
                    </div>
                    <>
                      {staffPrivilege?.map((data, index) => (
                        <>
                          <Tooltip title={selectedPrivilegesForDisplayMultiple?.map((data) => data?.id)?.includes(data?.id) ? "Click to Remove" : "Click to Request"} arrow>
                            <div
                              className={`${style.privilegeConfirmationGrid} ${style.marginTop}`}
                              onClick={selectedPrivilegesForDisplayMultiple
                                ?.map((data) => data?.id)
                                ?.includes(data?.id) ? () => {
                                  handleDeleteSelectedPrrivilege(data?.id)
                                  setPrivilegeSetChangeYesOrNo("")
                                } : () => {
                                  setShowPrivileges(true);
                                  handleChange(data?.id);
                                  setPrivilegeSetChangeYesOrNo("No")
                                }}
                            >
                              {selectedPrivilegesForDisplayMultiple
                                ?.map((data) => data?.id)
                                ?.includes(data?.id) ? (
                                <div
                                  className={`${style.iconBackgroundColorSelected} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                                >
                                  <CheckCircleOutlineIcon
                                    sx={{ fontSize: 15, color: "#FFFFFF" }}
                                  />
                                </div>
                              ) : (
                                <div>
                                  {/* <div
                            className={`${style.iconBackgroundColor} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                          >
                            <WarningAmberIcon
                              sx={{ fontSize: 15, color: "#FFFFFF" }}
                            />
                          </div> */}
                                </div>
                              )}
                              <div className={style.privilegeHeading}>
                                {data?.privilegeSetTitle}
                              </div>
                              {selectedPrivilegesForDisplayMultiple
                                ?.map((data) => data?.id)
                                ?.includes(data?.id) ? (
                                // <Tooltip title="Click To Remove">
                                <div className={`${style.displayInRow} ${style.floatRight}`}>
                                  {/* <span className={style.signedOnText}>signed on {selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span> */}
                                  <div>
                                    <img
                                      src={DeleteIcon}
                                      alt=""
                                      className={`${style.docTypeImgStyle} ${style.marginLeft} ${style.floatRight}`}
                                    />
                                  </div>
                                </div>
                                // </Tooltip>
                              ) : (
                                // <Tooltip title="Click To Request">
                                <button
                                  className={`${style.addButton} ${style.marginLeft}`}
                                // onClick={() => {
                                //   setShowPrivileges(true);
                                //   handleChange(data?.id);
                                // }}
                                >  SELECT
                                </button>
                                // </Tooltip>
                              )}
                            </div>
                          </Tooltip>
                          {index !== staffPrivilege?.length - 1 && (
                            <CommonDivider />
                          )}
                        </>
                      ))}
                    </>
                    {/* )} */}

                    <div
                      className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                    >
                      {/* <div
                        className={`${style.reappointmentButton} ${style.marginLeft}`}
                        onClick={() => {
                          setIsPrivilegeSetChanging(false);
                          handleSubmit();
                          setIsEditPrivilege(false);
                          setIsUpdateClicked(true);
                          setPrivilegeSetChangeYesOrNo('Yes')
                        }}
                      >
                        SAVE
                      </div> */}
                      {/* <Tooltip title={"Click to Cancel"} arrow>
                        <div
                          className={`${style.reappointmentButtonOutlined}`}
                          onClick={() => { setIsPrivilegeSetChanging(false); setPrivilegeSetChangeYesOrNo('') }}
                        >
                          CANCEL
                        </div>
                      </Tooltip> */}
                    </div>
                  </div>
                  {/* )} */}
                </>
                </div>
              )}
                {(isPrivilegeSetChanging && formDetails?.privileges?.priorObligatedPrivileges?.length !== 0 && formDetails?.privileges?.obligatedPrivileges?.length !== 0) && (
                  <>
                    <div className={`${style.cardTitle} ${style.marginTop}`}>
                      What would you like to change your current Privilege Set
                      to?
                    </div>
                    {/* {basicForm?.basicDetails?.credentialingPrivilegeCategory
                      ?.credentialingCategory === "Courtesy Staff With Admitting Privileges" ? (
                      <div
                        className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                      >
                        <div className={style.marginTop}>
                          <div className={`${style.lableStyle}`}>
                            List the Privileges you would like to request*
                          </div>
                          <TextArea
                            value={selectedPrivilegesForCourtesy}
                            className={`${style.fullWidth} ${style.marginTop10}`}
                            onChange={(e) =>
                              setSelectedPrivilegesForCourtesy(e.target.value)
                            }
                            placeholder={"Enter here"}
                            rows={4}
                          />
                        </div>
                        <div
                          className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                        >
                          <button
                            className={`${style.reappointmentButton} ${style.marginLeft
                              } ${selectedPrivilegesForCourtesy !== ""
                                ? ""
                                : style.disabledButton
                              }`}
                            onClick={
                              selectedPrivilegesForCourtesy === ""
                                ? () => { }
                                : () => {
                                  handleSubmit();
                                  setIsEditPrivilege(false);
                                  setIsUpdateClicked(true);
                                }
                            }
                            disabled={selectedPrivilegesForCourtesy === ""}
                          >
                            SAVE
                          </button>
                          <div
                            className={`${style.reappointmentButtonOutlined}`}
                            onClick={() => { setIsPrivilegeSetChanging(false); setPrivilegeSetChangeYesOrNo('') }}
                          >
                            CANCEL
                          </div>
                        </div>
                      </div>
                    ) : ( */}
                    <div
                      className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                    >
                      <div className={style.displayInRow}>
                        <div className={style.lableStyle}>Your Department / Division or Speciality : </div>
                        <div className={`${style.lableStyle} ${style.marginLeft}`}><strong>{`${departmentList?.filter((data) => data?.id === selectedDepartment)?.[0]?.departmentName?.name} ${(formDetails?.basicDetails?.departmentSpecialty?.specialty !== "" && formDetails?.basicDetails?.departmentSpecialty?.specialty !== undefined && formDetails?.basicDetails?.departmentSpecialty?.specialty !== null) ? '-' : ''} ${(formDetails?.basicDetails?.departmentSpecialty?.specialty !== "" && formDetails?.basicDetails?.departmentSpecialty?.specialty !== undefined && formDetails?.basicDetails?.departmentSpecialty?.specialty !== null) ? formDetails?.basicDetails?.departmentSpecialty?.specialty : ''}`}</strong></div>
                      </div>
                      <>
                        {staffPrivilege?.map((data, index) => (
                          <>
                            <Tooltip title={selectedPrivilegesForDisplayMultiple?.map((data) => data?.id)?.includes(data?.id) ? "Click to Remove" : "Click to Request"} arrow>
                              <div
                                className={`${style.privilegeConfirmationGrid} ${style.marginTop}`}
                                onClick={selectedPrivilegesForDisplayMultiple
                                  ?.map((data) => data?.id)
                                  ?.includes(data?.id) ? () => {
                                    handleDeleteSelectedPrrivilege(data?.id)
                                  } : () => {
                                    setShowPrivileges(true);
                                    handleChange(data?.id);
                                  }}
                              >
                                {selectedPrivilegesForDisplayMultiple
                                  ?.map((data) => data?.id)
                                  ?.includes(data?.id) ? (
                                  <div
                                    className={`${style.iconBackgroundColorSelected} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                                  >
                                    <CheckCircleOutlineIcon
                                      sx={{ fontSize: 15, color: "#FFFFFF" }}
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    {/* <div
                              className={`${style.iconBackgroundColor} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                            >
                              <WarningAmberIcon
                                sx={{ fontSize: 15, color: "#FFFFFF" }}
                              />
                            </div> */}
                                  </div>
                                )}
                                <div className={style.privilegeHeading}>
                                  {data?.privilegeSetTitle}
                                </div>
                                {selectedPrivilegesForDisplayMultiple
                                  ?.map((data) => data?.id)
                                  ?.includes(data?.id) ? (
                                  // <Tooltip title="Click To Remove">
                                  <div className={`${style.displayInRow} ${style.floatRight}`}>
                                    {/* <span className={style.signedOnText}>signed on {selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span> */}
                                    <div>
                                      <img
                                        src={DeleteIcon}
                                        alt=""
                                        className={`${style.docTypeImgStyle} ${style.marginLeft} ${style.floatRight}`}
                                      />
                                    </div>
                                  </div>
                                  // </Tooltip>
                                ) : (
                                  // <Tooltip title="Click To Request">
                                  <button
                                    className={`${style.addButton} ${style.marginLeft}`}
                                  // onClick={() => {
                                  //   setShowPrivileges(true);
                                  //   handleChange(data?.id);
                                  // }}
                                  >  SELECT
                                  </button>
                                  // </Tooltip>
                                )}
                              </div>
                            </Tooltip>
                            {index !== staffPrivilege?.length - 1 && (
                              <CommonDivider />
                            )}
                          </>
                        ))}
                      </>
                      {/* )} */}

                      <div
                        className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                      >
                        {/* <div
                          className={`${style.reappointmentButton} ${style.marginLeft}`}
                          onClick={() => {
                            setIsPrivilegeSetChanging(false);
                            handleSubmit();
                            setIsEditPrivilege(false);
                            setIsUpdateClicked(true);
                            setPrivilegeSetChangeYesOrNo('Yes')
                          }}
                        >
                          SAVE
                        </div> */}
                        <Tooltip title={"Click to Cancel"} arrow>
                          <div
                            className={`${style.reappointmentButtonOutlined}`}
                            onClick={() => { setIsPrivilegeSetChanging(false); setPrivilegeSetChangeYesOrNo('') }}
                          >
                            CANCEL
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                    {/* )} */}
                  </>
                )}
              </>
            )}
            <div className={`${style.cardTitle} ${style.marginTop}`}>
            Would you like to add any Additional Privilege Set(s) for this Locum Staff?
            </div>
            {additionalPrivilegeChangeYesOrNo === '' ? (
              <div
                className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
              >
                <Tooltip title={"Click to mark as Yes"} arrow>
                  <div
                    className={`${style.reappointmentButtonOutlined}`}
                    onClick={() => { setIsAdditionalPrivilegeCategoryChanging(true); setAdditionalPrivilegeChangeYesOrNo('Yes') }}
                  >
                    YES
                  </div>
                </Tooltip>
                <Tooltip title={"Click to mark as No"} arrow>
                  <div
                    className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                    onClick={() => { handleSubmitAdditionalPrivilegeSet() }}
                  >
                    NO
                  </div>
                </Tooltip>
              </div>
            ) : (
              <>
                {!isAdditionalPrivilegeCategoryChanging && (
                  <>
                    <div
                      className={`${style.markedAsText} ${style.marginTop10}`}
                    >
                      <strong>
                        Marked as{" "}
                        <span className={additionalPrivilegeChangeYesOrNo === 'Yes' ? style.yesText : style.noText}>{additionalPrivilegeChangeYesOrNo}</span>
                      </strong>{" "}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                    >
                      <Tooltip title={"Click to View & Modify"} arrow>
                        <div
                          className={`${style.reappointmentButtonEdit}`}
                          onClick={() => { setIsEditAdditionalPrivileges(true); setAdditionalPrivilegeChangeYesOrNo('') }}
                        >
                          VIEW TO MODIFY
                        </div>
                      </Tooltip>
                    </div>
                  </>
                )}
              </>
            )}
            {isAdditionalPrivilegeCategoryChanging && (
              <div className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}>
                <>
                  <div>
                    {/* <CommonSelectField
                  // value={selectedDepartment}
                  onChange={(e) => setSelectedAdditionalDepartment(e.target.value)}
                  className={style.fullWidth}
                  // firstOptionLabel={''}
                  // firstOptionValue={''}
                  valueList={departmentList?.filter(data => data?.id !== applicationData?.basicDetailReferences?.department?.id)?.map(data => data?.id)}
                  labelList={departmentList?.filter(data => data?.id !== applicationData?.basicDetailReferences?.department?.id)?.map(data => data?.departmentName?.name)}
                  disabledList={departmentList?.filter(data => data?.id !== applicationData?.basicDetailReferences?.department?.id)?.map((data) => false)}
                  label={'Department / Division or Specialty'}
                  required={false}
                /> */}
                    <div>
                      <div className={`${style.lableStyle}`}>
                        {'Department / Division or Specialty'}
                      </div>
                      {/* <DatalistInput
                        items={getAdditionalDeptItems(departmentList) || []}
                        onSelect={(item) => {
                          setSelectedAdditionalDepartment(item.id)
                          setSelectedAdditionalSpeciality(item.specialityId)
                        }}
                        className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                        maxLength={50}
                        onChange={(e) => {
                          setSelectedAdditionalDepartment(e.target.value);
                        }}
                        placeholder={'Enter Department Name'}
                        value={getAdditionalDeptItems(departmentList)?.filter(data => data?.departmentId ? data?.departmentId === selectedAdditionalDepartment : data?.id === selectedAdditionalDepartment)?.[0]?.data?.value}
                        required={true}
                      /> */}
                      <DatalistInput
                        items={getAdditionalDeptItems(departmentList) || []}
                        onSelect={(item) => {
                          console.log('Selected item:', item);
                          if (item.specialityId !== "") {
                            setSelectedAdditionalDepartment(item.departmentId);
                            setSelectedAdditionalSpeciality(item.specialityId);
                          } else {
                            setSelectedAdditionalDepartment(item.id);
                            setSelectedAdditionalSpeciality(item.specialityId);
                          }
                        }}
                        className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                        maxLength={50}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const matchedItem = getAdditionalDeptItems(departmentList)?.find(item => item.value === inputValue);

                          if (matchedItem) {
                            // If user types a valid department/speciality name, set corresponding IDs
                            if (matchedItem.specialityId !== "") {
                              setSelectedAdditionalDepartment(matchedItem.departmentId);
                              setSelectedAdditionalSpeciality("")
                            } else {
                              setSelectedAdditionalDepartment(matchedItem.id);
                              setSelectedAdditionalSpeciality(matchedItem.specialityId)
                            }
                          }
                        }}

                        placeholder={'Enter Department Name'}
                        value={getAdditionalDeptItems(departmentList)?.find(data =>
                        (data?.specialityId !== ""
                          ? data?.departmentId === selectedAdditionalDepartment && data?.specialityId === selectedAdditionalSpeciality
                          : data?.id === selectedAdditionalDepartment && data.specialityId === selectedAdditionalSpeciality)
                        )?.value || ''}
                        required={true}
                      />

                    </div>
                  </div>
                  {selectedAdditionalDepartment !== '' && (
                    <>
                      {additionalStaffPrivilege?.map((data, index) => (
                        <>
                          <Tooltip title={selectedAdditionalPrivilegesForDisplayMultiple?.map(data => data?.id)?.includes(data?.id) ? "Click to Remove" : "Click to Request"} arrow>
                            <div className={`${style.privilegeConfirmationGrid} ${style.verticalAlignCenter} ${style.marginTop}`}
                              onClick={selectedAdditionalPrivilegesForDisplayMultiple?.map(data => data?.id)?.includes(data?.id) ? () => { handleDeleteSelectedAdditionalPrrivilege(data?.id) } : () => { setShowAdditionalPrivileges(true); handleChangeAdditional(data?.id) }}
                            >
                              {selectedAdditionalPrivilegesForDisplayMultiple?.map(data => data?.id)?.includes(data?.id) ? (
                                <div className={`${style.iconBackgroundColorSelected} ${style.verticalAlignCenter} ${style.justifyCenter}`}><CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#FFFFFF' }} /></div>
                              ) : (
                                <div>
                                  {/* <div className={`${style.iconBackgroundColor} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 15, color: '#FFFFFF' }} /></div> */}
                                </div>
                              )}
                              <div className={style.privilegeHeading}>{data?.privilegeSetTitle}</div>
                              {selectedAdditionalPrivilegesForDisplayMultiple?.map(data => data?.id)?.includes(data?.id) ? (
                                <div className={`${style.displayInRow} ${style.floatRight}`}>
                                  {/* <span className={style.signedOnText}>signed on {selectedAdditionalPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span> */}
                                  <div>
                                    <img
                                      src={DeleteIcon}
                                      alt=""
                                      className={`${style.docTypeImgStyle} ${style.marginLeft} ${style.floatRight}`}
                                    />
                                  </div>
                                </div>
                              ) : (

                                <button
                                  className={`${style.addButton} ${style.marginLeft}`}
                                  onClick={() => { setShowAdditionalPrivileges(true); handleChangeAdditional(data?.id) }}
                                >  SELECT
                                </button>
                              )}
                            </div>
                          </Tooltip>
                          {(index !== additionalStaffPrivilege?.length - 1) && (
                            <CommonDivider />
                          )}
                        </>
                      ))}
                    </>
                  )}
                </>
                <div
                  className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                >
                  {/* <div
                    className={`${style.reappointmentButton} ${style.marginLeft}`}
                    onClick={() => { handleSubmit() }}
                  >
                    SAVE
                  </div> */}
                  <Tooltip title={"Click to Cancel"} arrow>
                    <div
                      className={`${style.reappointmentButtonOutlined}`}
                      onClick={() => { setAdditionalPrivilegeChangeYesOrNo(''); setIsAdditionalPrivilegeCategoryChanging(false); }}
                    >
                      CANCEL
                    </div>
                  </Tooltip>
                </div>
              </div>
            )}
          </>
        )}
       </div>
      )}
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
         pointerEvents: selectedMonth ? "auto" : "none",
         opacity: selectedMonth ? 1 : 0.5,
        }}
        onClick={() => {
          if (!showSelectedPrivilegeLocum) {
            if (selectedMonth) {
              onClickExtensiveRequest();
              // handleSubmitPrivilegeSet();
              // handleSubmitAdditionalPrivilegeSet();
            }
          } else {
            getIsOpen(false);
          }
        }}
       >
       <div className={`${style.reviewButton}`}>
        Continue
      </div>
       </div>
      </div>
     </div>
    </Dialog>
   )}
   <Dialog
    isOpen={showAdditionalPrivilegesForSign}
    onClose={() => setShowAdditionalPrivilegesForSign(false)}
    className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
    canOutsideClickClose={false}
    canEscapeKeyClose={false}
    >
    <div>
        <div className={Classes.DIALOG_BODY}>
        <div className={style.spaceBetween}>
            <div className={style.heading}>Sign Off On Your Current Privileges For Your Reappointment Period</div>
            <div className={style.displayInRow}>
            <img
                src={CrossPink}
                alt="cross"
                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                onClick={() => {
                setShowAdditionalPrivilegesForSign(false);
                setAdditionalPrivilegeChangeYesOrNo('')
                setIndexForSign(0);
                }}
            />
            </div>
        </div>
        {/* {formDetails?.privileges?.obligatedPrivileges?.map((data, index) => ( */}
        {/* <div>{getFieldsForSign(selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.id, indexForSign, selectedAdditionalPrivilegeForDisplay?.[indexForSign])}</div> */}
        {/* ))} */}
        <div
            className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop10}`}
        >
            <button
            className={`${style.reappointmentButton} ${style.marginLeft} 
            ${((selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                ?.restrictedPrivileges?.esign !== null &&
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.esign !== undefined) ||
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.length ===
                0 ||
                (selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                    ?.privileges?.length === 0 &&
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                    ?.privileges?.length !== undefined)) &&
                ((selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.esign !== null &&
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.esign !== undefined) ||
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                    (selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                    ?.length === 0 &&
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.privilegesByCategories?.[0]
                        ?.privileges?.length !== undefined))
                ? ""
                : style.disabledButton
                }`}
            onClick={
                ((selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                ?.restrictedPrivileges?.esign !== null &&
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.esign !== undefined) ||
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.length ===
                0 ||
                (selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                    ?.privileges?.length === 0 &&
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                    ?.privileges?.length !== undefined)) &&
                ((selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.esign !== null &&
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.esign !== undefined) ||
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                    (selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                    ?.length === 0 &&
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.privilegesByCategories?.[0]
                        ?.privileges?.length !== undefined))
                ? selectedAdditionalPrivilegeForDisplay?.length === indexForSign + 1 ? () => {
                    setShowAdditionalPrivilegesForSign(false);
                    // handleSelectedPrivilegesForDisplayMultiple(
                    //   selectedPrivilegeForDisplay[indexForSign]
                    // );
                    handleSubmit();
                    setIndexForSign(0)
                } : () => {
                    setIndexForSign(indexForSign + 1)
                }
                : () => { }
            }
            disabled={!(((selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                ?.restrictedPrivileges?.esign !== null &&
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                ?.restrictedPrivileges?.esign !== undefined) ||
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                ?.restrictedPrivileges?.privilegesByCategories?.length ===
                0 ||
                (selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                ?.restrictedPrivileges?.privilegesByCategories?.[0]
                ?.privileges?.length === 0 &&
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                    ?.privileges?.length !== undefined)) &&
                ((selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                ?.corePrivileges?.esign !== null &&
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.esign !== undefined) ||
                selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                (selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                    ?.length === 0 &&
                    selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.privilegesByCategories?.[0]
                    ?.privileges?.length !== undefined))
            )}
            >
            {selectedAdditionalPrivilegeForDisplay?.length === indexForSign + 1 ? `CONTINUE` : 'NEXT'}
            </button>
        </div>
        </div>
    </div>
    </Dialog>
    <Dialog
            isOpen={showAdditionalPrivileges}
            onClose={() => setShowAdditionalPrivileges(false)}
            className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
          >
            <div>
              <div className={Classes.DIALOG_BODY}>
                <div className={style.spaceBetween}>
                  <div className={style.heading}>Privilege Set To Request</div>
                  <div className={style.displayInRow}>
                    <img
                      src={CrossPink}
                      alt="cross"
                      className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                      onClick={() => {
                        setShowAdditionalPrivileges(false);
                      }}
                    />
                  </div>
                </div>
                <div>{getFieldsAdditional()}</div>
                <div
                  className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop10}`}
                >
                  <Tooltip title={"Click to Continue"} arrow>
                    <button
                      className={`${style.reappointmentButton} ${style.marginLeft}`}
                      // onClick={
                      //   (((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //     ?.restrictedPrivileges?.esign !== null &&
                      //     selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //       ?.restrictedPrivileges?.esign !== undefined) ||
                      //     selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //       ?.restrictedPrivileges?.privilegesByCategories?.length ===
                      //     0 ||
                      //     (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //       ?.restrictedPrivileges?.privilegesByCategories?.[0]
                      //       ?.privileges?.length === 0 &&
                      //       selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //         ?.restrictedPrivileges?.privilegesByCategories?.[0]
                      //         ?.privileges?.length !== undefined)) &&
                      //     ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //       ?.corePrivileges?.esign !== null &&
                      //       selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //         ?.corePrivileges?.esign !== undefined) ||
                      //       selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //         ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                      //       (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //         ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                      //         ?.length === 0 &&
                      //         selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //           ?.corePrivileges?.privilegesByCategories?.[0]
                      //           ?.privileges?.length !== undefined)) && getIsAdditionalRestrictedValuesFilled(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      //             ?.restrictedPrivileges?.privilegesByCategories?.[0]
                      //             ?.privileges))
                      //     ? () => {
                      //       setShowAdditionalPrivileges(false);
                      //       handleSelectedAdditionalPrivilegesForDisplayMultiple(
                      //         selectedAdditionalPrivilegeForDisplay[0]
                      //       );
                      //     }
                      //     : () => { }
                      // }
                      onClick={() => {
                            setShowAdditionalPrivileges(false);
                            handleSelectedAdditionalPrivilegesForDisplayMultiple(
                              selectedAdditionalPrivilegeForDisplay[0]
                            );
                          }
                      }
                    >
                      CONTINUE
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Dialog>
        <Dialog
                isOpen={showPrivileges}
                onClose={() => setShowPrivileges(false)}
                className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
              >
                <div>
                  <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                      <div className={style.heading}>Privilege Set To Request</div>
                      <div className={style.displayInRow}>
                        <img
                          src={CrossPink}
                          alt="cross"
                          className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                          onClick={() => {
                            setShowPrivileges(false);
                          }}
                        />
                      </div>
                    </div>
                    <div>{getFields()}</div>
                    <div
                      className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop10}`}
                    >
                      <Tooltip title={"Click to Continue"} arrow>
                        <button
                          className={`${style.reappointmentButton} ${style.marginLeft} `}
                          onClick={
                             () => {
                                setShowPrivileges(false);
                                handleSelectedPrivilegesForDisplayMultiple(
                                  selectedPrivilegeForDisplay[0]
                                );
                              }
                          }
                          // disabled={
                          //   !((((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null &&
                          //     selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) ||
                          //     selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length === 0 ||
                          //     (selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                          //       selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) &&
                          //     ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== null &&
                          //       selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) ||
                          //       selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.length === 0 ||
                          //       (selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                          //         selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined))) &&
                          //     getIsRestrictedValuesFilled(selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          //       ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          //       ?.privileges))
                          // }
                        >
                          CONTINUE
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Dialog>
         <Dialog
            isOpen={showCurrentPrivileges}
            onClose={() => setShowCurrentPrivileges(false)}
            className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
            canOutsideClickClose={false}
            canEscapeKeyClose={false}
          >
            <div>
              <div className={Classes.DIALOG_BODY}>
                <div className={style.spaceBetween}>
                  <div className={style.heading}>Selected Privilege Set</div>
                  <div className={style.displayInRow}>
                    <img
                      src={CrossPink}
                      alt="cross"
                      className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                      onClick={() => {
                        setShowCurrentPrivileges(false);
                      }}
                    />
                  </div>
                </div>
                <div>{currentPrivilegesCategory === 'Basic' ? getFields() : getFieldsAdditional()}</div>
              </div>
            </div>
          </Dialog>
    {/* {
    isOpenAdd && (
        <AdditionalPrivilegesDialog
        getIsOpen={getIsOpenAdditional}
        primaryPrivilege={selectedPrivilege}
        getSelectedPrivilegeList={getSelectedPrivilegeList}
        formDetails={formDetails}
        selectedAdditionalPrivilegeForEdit={
            selectedAdditionalPrivilegeForEdit
        }
        applicationId={id}
        />
    )
    } */}
  </>
 );
};

export default LocumExtensiveDialog;
