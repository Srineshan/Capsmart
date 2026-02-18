import React, { useEffect, useState } from "react";
import ProgressCard from "../../../../Components/ProgressCard";
import AdditionalPrivilegesDialog from "./AdditionalPrivilegesDialog";
import ApplicationUserCard from "../../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../../Components/ApplicationAssistanceCard";
import CommonDivider from "../../../../Components/CommonFields/CommonDivider";
import ApplicationFieldCard from "../../../../Components/ApplicationFieldCard";
import ApplicationReferenceDocuments from "../../../../Components/ApplicationReferenceDocuments";
import { Dialog, Classes, TextArea } from "@blueprintjs/core";
import { DELETE, GET, POST, PUT } from "../../../dataSaver";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from "@blueprintjs/core";
import { format } from "date-fns";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { ErrorToaster, SuccessToaster } from "../../../../utils/toaster";
import PdfDoc from "./../../../../images/pdfDoc.png";
import WordDoc from "./../../../../images/wordDoc.png";
import CrossPink from "./../../../../images/crossPink.png";
import ImgDoc from "./../../../../images/imgDoc.png";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import CryptoJS from "crypto-js";
import style from "./index.module.scss";
import BlueSign from "./../../../../images/blueSign.png";
import JourneyStep1 from "./../../../../images/journeyStep1.png";
import DeleteIcon from "./../../../../images/deleteHcRow.png";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import VerifiedImage from "./../../../../images/verifiedImage.png";
import ToBeVerifiedImage from "./../../../../images/toBeVerifiedImage.png";
import CommonSelectField from "../../../../Components/CommonFields/CommonSelectField";
import ESignature from "../../../../Components/ESignature";
import CommonRadio from "../../../../Components/CommonFields/CommonRadio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AlertDialog from "../../../../Components/AlertDialog";
import ReappointmentProgressCard from "../../../../Components/ReappointmentProgressCard";
import ReappointmentJourneyDialog from "../../../../Components/reappointmentJourneyDialog";
import CommonTextField from "../../../../Components/CommonFields/CommonTextField";
import PaymentDialog from "../../../../Components/paymentDialog";
import AdditionalPrivilegeSelection from "../AdditionalPrivilegeSelection";
import SaveInProgressDialog from "../../../../Components/SaveInProgressDialog";
import { fileLoadingURL } from "../../../../utils/formatting";
import LoadingScreen from "../../../../Components/LoadingScreen";
import ESignConfirmationDialog from "../../../../Components/ESignConfirmation";
import ESignDialog from "../../../../Components/ESignDialog";
import { Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Close from './../../../../images/close.png';
import { FamilyRestroomOutlined } from "@mui/icons-material";

const PrivilegeSelection = ({ basicForm, setBasicForm, getPreApplication, dateFormat }) => {
  const [isSigned, setIsSigned] = useState(false);
  const { applicationId, section, step } = useParams();
  const [isRestrictedSigned, setIsRestrictedSigned] = useState(false);
  const [isAdditionalSigned, setIsAdditionalSigned] = useState(false);
  const [formSchema, setFormSchema] = useState();
  const [formData, setFormData] = useState();
  const [uploadFormSchema, setUploadFormSchema] = useState();
  const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
  const [staffPrivilege, setStaffPrivilege] = useState([]);
  const [additionalStaffPrivilege, setAdditionalStaffPrivilege] = useState([]);
  const [allStaffPrivilege, setAllStaffPrivilege] = useState([]);
  const [selectedPrivilege, setSelectedPrivilege] = useState("");
  const [isShowESignConfirmationDialog, setIsShowESignConfirmationDialog] = useState(false);
  const [isShowESignDialog, setIsShowESignDialog] = useState(false);
  const [applicantProfile, setApplicantProfile] = useState();
  const [hospitalMaster, setHospitalMaster] = useState([]);
  const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] =
    useState([]);
  const [
    selectedAdditionalPrivilegeForDisplay,
    setSelectedAdditionalPrivilegeForDisplay,
  ] = useState([]);
  const [
    selectedAdditionalPrivilegeForEdit,
    setSelectedAdditionalPrivilegeForEdit,
  ] = useState();
  const [selectedprivilegeList, setSelectedPrivilegeList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  let name = `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `;
  const publicKey =
    "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [dateTime, setDateTime] = useState(new Date().toISOString());
  const [collapsibleIndexes, setCollapsibleIndexes] = useState([]);
  const [encryptedText, setEncryptedText] = useState(
    CryptoJS.AES.encrypt(name + dateTime, publicKey).toString()
  );
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), dateFormat)
  );
  const [applicationData, setApplicationData] = useState();
  const [openIndex, setOpenIndex] = useState();
  const [selectedPrivilegeData, setSelectedprivilegeData] = useState([]);
  const [isPrivilegeCategoryChanging, setIsPrivilegeCategoryChanging] = useState(false);
  const [isDepartmentChanging, setIsDepartmentChanging] = useState(false);
  const [isPrivilegeSetChanging, setIsPrivilegeSetChanging] = useState(false);
  const [privilegesMaintainedInOtherHositals, setPrivilegesMaintainedInOtherHositals] = useState(false);
  const [
    doYouHavePrivilegeAtAnyOtherHospital,
    setDoYouHavePrivilegeAtAnyOtherHospital,
  ] = useState("");
  const [privilegeCategories, setPrivilegeCategories] = useState([]);
  const [privilegeCategoriesAtOtherHospitals, setPrivilegeCategoriesAtOtherHospitals] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] =
    useState("");
  const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  const [
    selectedPrivilegeCategoryAtPrevHospital,
    setSelectedPrivilegeCategoryAtPrevHospital,
  ] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedAdditionalDepartment, setSelectedAdditionalDepartment] = useState("");
  const [selectedAdditionalSpeciality, setSelectedAdditionalSpeciality] = useState("");
  const navigate = useNavigate();
  const [formIndex, setFormIndex] = useState();
  const [navigateURL, setNavigateURL] = useState();
  const [showPrivileges, setShowPrivileges] = useState(false);
  const [showAdditionalPrivileges, setShowAdditionalPrivileges] = useState(false);
  const [showPrivilegesForSign, setShowPrivilegesForSign] = useState(false);
  const [showAdditionalPrivilegesForSign, setShowAdditionalPrivilegesForSign] = useState(false);
  const [showCurrentPrivileges, setShowCurrentPrivileges] = useState(false);
  const [currentPrivilegesCategory, setCurrentPrivilegesCategory] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [isEditAdditionalPrivileges, setIsEditAdditionalPrivileges] = useState(true);
  const [isEditPrivilege, setIsEditPrivilege] = useState(true);
  const [isEditPrivilegeAtOtherHospitals, setIsEditPrivilegeAtOtherHospitals] = useState(true);
  const [hospitalPrivilegeSet, setHospitalPrivilegeSet] = useState([]);
  const [showPrivilegeResetError, setShowPrivilegeResetError] = useState(false);
  const [
    selectedPrivilegesForDisplayMultiple,
    setSelectedPrivilegesForDisplayMultiple,
  ] = useState([]);
  const [
    selectedAdditionalPrivilegesForDisplayMultiple,
    setSelectedAdditionalPrivilegesForDisplayMultiple,
  ] = useState([]);
  const [showJourneyDialog, setShowJourneyDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const title = sessionStorage.getItem("title");
  const [selectedPrivilegesForCourtesy, setSelectedPrivilegesForCourtesy] =
    useState("");
  const [prevHospitalName, setPrevHospitalName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalPrivilege, setHospitalPrivilege] = useState("");
  const [hospitalPrivilegeCategory, setHospitalPrivilegeCategory] = useState("");
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  const [privilegeChangeYesOrNo, setPrivilegeChangeYesOrNo] = useState("");
  const [departmentChangeYesOrNo, setDepartmentChangeYesOrNo] = useState("");
  const [privilegeSetChangeYesOrNo, setPrivilegeSetChangeYesOrNo] = useState("");
  const [additionalPrivilegeChangeYesOrNo, setAdditionalPrivilegeChangeYesOrNo] = useState("");
  const [privilegeAtOtherHospitalYesOrNo, setPrivilegeAtOtherHospitalYesOrNo] = useState("");
  const [isAdditionalPrivilegeCategoryChanging, setIsAdditionalPrivilegeCategoryChanging] = useState(false)
  const [indexForSign, setIndexForSign] = useState(0);
  const [paymentListData, setPaymentListData] = useState();
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const [isPrivilegeAtOtherHospitalEdited, setIsPrivilegeAtOtherHospitalEdited] = useState(false);
  const [privilegeAtOtherHospitalIndex, setPrivilegeAtOtherHospitalIndex] = useState();
  const [isHistoricalSign, setIsHistoricalSign] = useState(false);
  const [selectedValue, setSelectedValue] = useState("NA");
  const [dontUpdatePrivilegeState, setDontUpdatePrivilegeState] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const theme = createTheme({
    palette: {
      error: {
        main: "#FF6562", // Customize your error color here
      },
      warning: {
        main: "#f57c00", // Customize your error color here
      },
    },
  });
  const prevDepartment = applicationData?.basicDetailReferences?.department?.id;
  const prevSpeciality = applicationData?.basicDetailReferences?.specialty?.id;
  useEffect(() => {
    getApplication();
    getDepartmentList();
    getApplicantProfile();
    getHospitalMaster();
  }, []);

  // useEffect(() => {
  //   if (privilegeChangeYesOrNo !== '' && privilegeSetChangeYesOrNo !== '' && additionalPrivilegeChangeYesOrNo !== '' && privilegeAtOtherHospitalYesOrNo !== '' && departmentChangeYesOrNo !== '') {
  //     setIsContinueEnabled(true);
  //   } else {
  //     setIsContinueEnabled(false);
  //   }
  //   if (privilegeChangeYesOrNo === 'No' && isPrivilegeSetChanging && basicForm?.privileges?.obligatedPrivileges?.length > 0) {
  //     setIsContinueEnabled(true);
  //   }
  //   if (additionalPrivilegeChangeYesOrNo === 'Yes' && 
  //     isAdditionalPrivilegeCategoryChanging && 
  //     selectedAdditionalDepartment != null && 
  //     typeof selectedAdditionalDepartment === 'string' && 
  //     selectedAdditionalDepartment.trim() !== '' && 
  //     basicForm?.privileges?.additionalPrivileges?.length > 0) {
  //   setIsContinueEnabled(true);
  // }
  //   if (basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === ('Courtesy Staff With Admitting Privileges' || 'Courtesy Staff Without Admitting Privileges') && privilegeChangeYesOrNo !== '' && privilegeAtOtherHospitalYesOrNo === 'Yes' && departmentChangeYesOrNo !== '') {
  //     setIsContinueEnabled(true);
  //   }
  // }, [privilegeChangeYesOrNo, privilegeSetChangeYesOrNo,isPrivilegeSetChanging,isAdditionalPrivilegeCategoryChanging, additionalPrivilegeChangeYesOrNo, privilegeAtOtherHospitalYesOrNo, departmentChangeYesOrNo,selectedAdditionalDepartment,basicForm?.privileges?.additionalPrivileges ])


  useEffect(() => {
    let shouldEnable = false;

    // ===== 1. BASE REQUIREMENTS (ALWAYS NEEDED) =====
    const baseRequirementsMet = (
      privilegeChangeYesOrNo !== '' &&
      privilegeSetChangeYesOrNo !== '' &&
      privilegeAtOtherHospitalYesOrNo !== '' &&
      departmentChangeYesOrNo !== ''
    );

    // ===== 2. CHECK ADDITIONAL PRIVILEGE CASES =====
    if (additionalPrivilegeChangeYesOrNo === 'No') {
      // CASE A: User said NO to additional privileges
      shouldEnable = baseRequirementsMet;
    }
    else if (additionalPrivilegeChangeYesOrNo === 'Yes') {
      // CASE B: User said YES to additional privileges
      const hasValidDepartment = (
        selectedAdditionalDepartment != null &&
        typeof selectedAdditionalDepartment === 'string' &&
        selectedAdditionalDepartment.trim() !== ''
      );
      const hasAdditionalPrivileges = basicForm?.privileges?.additionalPrivileges?.length > 0;

      shouldEnable = (
        baseRequirementsMet &&
        isAdditionalPrivilegeCategoryChanging &&
        hasValidDepartment &&
        hasAdditionalPrivileges
      );
    }

    // ===== 3. SPECIAL OVERRIDE CASES =====
    // Case 1: No privilege change but has obligated privileges
    if (!shouldEnable && privilegeChangeYesOrNo === 'No' && isPrivilegeSetChanging &&
      basicForm?.privileges?.obligatedPrivileges?.length > 0) {
      shouldEnable = true;
    }

    // Case 2: Courtesy Staff exception
    if (!shouldEnable &&
      (basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === 'Courtesy Staff With Admitting Privileges' ||
        basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === 'Courtesy Staff Without Admitting Privileges') &&
      privilegeChangeYesOrNo !== '' &&
      privilegeAtOtherHospitalYesOrNo === 'Yes' &&
      departmentChangeYesOrNo !== '') {
      shouldEnable = true;
    }

    setIsContinueEnabled(shouldEnable);
  }, [
    // All dependencies
    privilegeChangeYesOrNo,
    privilegeSetChangeYesOrNo,
    isPrivilegeSetChanging,
    additionalPrivilegeChangeYesOrNo,
    isAdditionalPrivilegeCategoryChanging,
    privilegeAtOtherHospitalYesOrNo,
    departmentChangeYesOrNo,
    selectedAdditionalDepartment,
    basicForm?.privileges?.additionalPrivileges,
    basicForm?.privileges?.obligatedPrivileges,
    basicForm?.basicDetails?.credentialingPrivilegeCategory
  ]);

  // useEffect(() => {
  //   const hasObligatedPrivileges = basicForm?.privileges?.obligatedPrivileges?.length > 0;
  //   const hasAdditionalPrivileges = basicForm?.privileges?.additionalPrivileges?.length > 0;
  //   const selectedDepartmentValid = !!selectedAdditionalDepartment?.trim();

  //   const category = basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory;

  //   let shouldEnable = false;

  //   if (
  //     privilegeChangeYesOrNo !== '' &&
  //     privilegeSetChangeYesOrNo !== '' &&
  //     additionalPrivilegeChangeYesOrNo !== '' &&
  //     privilegeAtOtherHospitalYesOrNo !== '' &&
  //     departmentChangeYesOrNo !== ''
  //   ) {
  //     shouldEnable = true;
  //   }

  //   if (
  //     privilegeChangeYesOrNo === 'No' &&
  //     isPrivilegeSetChanging &&
  //     hasObligatedPrivileges
  //   ) {
  //     shouldEnable = true;
  //   }

  //   if (
  //     additionalPrivilegeChangeYesOrNo === 'Yes' &&
  //     isAdditionalPrivilegeCategoryChanging === true &&
  //     selectedDepartmentValid &&
  //     hasAdditionalPrivileges
  //   ) {
  //     shouldEnable = true;
  //   }


  //   if (
  //     (category === 'Courtesy Staff With Admitting Privileges' ||
  //       category === 'Courtesy Staff Without Admitting Privileges') &&
  //     privilegeChangeYesOrNo !== '' &&
  //     privilegeAtOtherHospitalYesOrNo === 'Yes' &&
  //     departmentChangeYesOrNo !== ''
  //   ) {
  //     shouldEnable = true;
  //   }

  //   setIsContinueEnabled(shouldEnable);
  // }, [
  //   privilegeChangeYesOrNo,
  //   privilegeSetChangeYesOrNo,
  //   isPrivilegeSetChanging,
  //   isAdditionalPrivilegeCategoryChanging,
  //   additionalPrivilegeChangeYesOrNo,
  //   privilegeAtOtherHospitalYesOrNo,
  //   departmentChangeYesOrNo,
  //   selectedAdditionalDepartment,
  //   basicForm
  // ]);

  useEffect(() => {
    if (isSubmit) {
      handleSubmitPrivilegesAtOtherHospital(true);
      setIsSubmit(false);
    }
  }, [isSubmit])

  // useEffect(() => {
  //   if (departmentChangeYesOrNo !== '') {
  //     handleSubmitAcknowledgement();
  //   }
  // }, [departmentChangeYesOrNo])

  useEffect(() => {
    getFields();
  }, [selectedPrivilegeForDisplay]);

  useEffect(() => {
    getStaffPrivilege();
  }, [applicationData, selectedDepartment, selectedSpeciality]);

  useEffect(() => {
    getAdditionalStaffPrivilege();
  }, [applicationData, selectedAdditionalDepartment, selectedAdditionalSpeciality]);

  useEffect(() => {
    setSelectedDepartment(
      applicationData?.basicDetailReferences?.department?.id
    );
    setSelectedSpeciality(
      applicationData?.basicDetailReferences?.specialty?.id
    );
  }, [applicationData]);

  // useEffect(() => {
  //   if (basicForm !== undefined && basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc') !== undefined) {
  //     console.log((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL === undefined && basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text === undefined), 'sig')
  //     if ((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL === undefined && basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text === undefined)) {
  //       setDontUpdatePrivilegeState(true)
  //       setIsShowESignDialog(true)
  //     }
  //   }
  // }, [basicForm])

  useEffect(() => {
    if (basicForm !== undefined && formIndex !== undefined) {
      setIsLoadingPage(false)
      if (basicForm && !formSchema) {
        getFormSchema();
        getUploadFormSchema();
        getPrivilegeCategory();
      }
      if (basicForm?.privileges?.obligatedPrivileges?.[0]?.id) {
        setSelectedPrivilege(basicForm?.privileges?.obligatedPrivileges?.[0]?.id);
      }
      // if (basicForm?.privileges?.priorObligatedPrivileges?.length === 0 &&
      //   basicForm?.privileges?.obligatedPrivileges?.length === 0) {
      //   setIsPrivilegeSetChanging(true);
      //   setPrivilegeSetChangeYesOrNo('No');
      // }
      setSelectedAdditionalPrivilegeForDisplay(
        basicForm?.privileges?.additionalPrivileges
      );
      setSelectedPrivilegesForDisplayMultiple(
        basicForm?.privileges?.obligatedPrivileges
      );
      if (!dontUpdatePrivilegeState && !isShowESignDialog && !isShowESignConfirmationDialog) {
        setSelectedAdditionalPrivilegesForDisplayMultiple(
          basicForm?.privileges?.additionalPrivileges
        );
        setSelectedPrivilegeForDisplay(basicForm?.privileges?.obligatedPrivileges);
      }
      setHospitalPrivilegeSet(basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges === null ? [] : basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges)
      setSelectedValue(basicForm?.basicDetails?.regionalCallResponsibilities?.regionalCallResponsibilities !== undefined ? basicForm?.basicDetails?.regionalCallResponsibilities?.regionalCallResponsibilities : 'NA')
      setNavigateURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`);
      if ((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL === undefined && basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text === undefined)) {
        setDontUpdatePrivilegeState(true)
        setIsShowESignDialog(true)
      }
      if (basicForm?.forms[formIndex]?.data !== null) {
        setPrivilegeChangeYesOrNo(basicForm?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo);
        setDepartmentChangeYesOrNo(basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo);
        setPrivilegeSetChangeYesOrNo(basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo);
        setAdditionalPrivilegeChangeYesOrNo(basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo)
        setPrivilegeAtOtherHospitalYesOrNo(basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo)
      }
    } else {
      setIsLoadingPage(true);
    }
  }, [basicForm, formIndex]);

  useEffect(() => {
    setFormIndex(
      basicForm?.forms?.findIndex((data) => data?.schemaCategory === atob(step))
    );
    fetchPaymentListData();
  }, [basicForm, step, selectedValue]);

  useEffect(() => {
    fetchPaymentListData();
  }, [selectedDepartment, selectedSpeciality])

  useEffect(() => {
    sessionStorage.removeItem("hasReloaded");
  }, []);

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

  console.log(selectedAdditionalPrivilegeForDisplay, privilegeSetChangeYesOrNo, 'check1');

  const getFormSchema = async () => {
    if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
      );
      setFormSchema(form?.schema);
      setFormSchemaWholeObject(form);
    }
  };

  useEffect(() => {
    getBasicForm();
  }, [])

  const getBasicForm = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/basicForm`
    );
    if (basicForm) {
      // if (!isNextpage) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
      );
      let temp = form?.schema;
      if (temp.properties.applicant.properties !== null) {
        delete temp.properties.applicant.properties["letterOfInterest"];
        delete temp.properties.applicant.properties["curriculumVitae"];
      }
      setFormData(form?.schema);
      // setFormSchemaWholeObject(form);
      console.log("formData", formData)

    }
  };

  const getUploadFormSchema = async () => {
    const { data: form } = await GET(
      `application-management-service/formSchema/${basicForm?.formSchemas?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.id}`
    );
    setUploadFormSchema(form?.schema)
  }

  const getStaffPrivilege = async () => {
    if (applicationData && selectedDepartment !== undefined) {
      if (selectedSpeciality !== undefined) {
        const { data: privilege } = await GET(
          `entity-service/staffPrivilege/departmentAndServiceArea?departmentId=${selectedDepartment !== ""
            ? selectedDepartment
            : applicationData?.basicDetailReferences?.department?.id
          }&serviceAreaId=${selectedSpeciality !== "" ? selectedSpeciality : applicationData?.basicDetailReferences?.specialty?.id}`
        );
        setStaffPrivilege(privilege);
      } else {
        const { data: privilege } = await GET(
          `entity-service/staffPrivilege/departmentAndServiceArea?departmentId=${selectedDepartment !== ""
            ? selectedDepartment
            : applicationData?.basicDetailReferences?.department?.id
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

  const getHospitalMaster = async () => {
    const { data: masterData } = await GET(
      `entity-service/hospitalMaster`
    );
    setHospitalMaster(masterData)
  };

  const getApplicantProfile = async () => {
    const { data: profile } = await GET(
      `application-management-service/application/${applicationId}/profile`
    );
    setApplicantProfile(profile)
  }

  const getApplication = async () => {
    const { data: form } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setApplicationData(form);
  };

  const getPrivilegeCategory = async () => {
    const { data: privilege } = await GET(`entity-service/privilege/${(basicForm?.basicDetails?.priorPrivilegeCategory?.id !== null && basicForm?.basicDetails?.priorPrivilegeCategory?.id !== undefined) ? basicForm?.basicDetails?.priorPrivilegeCategory?.id : basicForm?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id}?applicantTypeId=${basicForm?.basicDetailReferences?.applicantType?.id}`);
    setPrivilegeCategories(privilege?.allowedPrivilegeCategories);
    const { data: privilegeAtOtherHospital } = await GET(`entity-service/privilege/${(basicForm?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id !== null && basicForm?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id !== undefined) ? basicForm?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id : basicForm?.basicDetailReferences?.priorPrivilegeCategory?.id}?applicantTypeId=${basicForm?.basicDetailReferences?.applicantType?.id}`);
    setPrivilegeCategoriesAtOtherHospitals(privilegeAtOtherHospital?.otherHospitalPrivilegeCategories)
  };

  const getDepartmentList = async () => {
    const { data: department } = await GET(`entity-service/department`);
    setDepartmentList(department);
  };

  const getIsOpenESignConfirmation = (value) => {
    setIsShowESignConfirmationDialog(value);
  }

  const getIsOpenESignDialog = (value) => {
    setIsShowESignDialog(value);
  }

  const updateFunc = () => {
    setIsShowESignDialog(true);
  }

  const confirmESign = async () => {
    let data = applicantProfile;
    data.signature.updated = true
    console.log(data)
    await PUT(`application-management-service/application/${applicationId}/profile`, data)
      .then(response => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      });
    // if (!isHistoricalSign) {
    //   setShowPrivilegesForSign(true);
    // }
  }

  const getIsShowReappointmentJourneyDialog = (value) => {
    setShowJourneyDialog(value);
  };

  const getIsSaveInProgressOpen = (value) => {
    handleSubmitAcknowledgement(false);
    setIsSaveInProgressOpen(value);
  };

  const getIsShowPaymentDialog = (value) => {
    setShowPaymentDialog(value);
  };

  const startsWithVowel = (str) => /^[aeiouAEIOU]/.test(str);

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
          `application-management-service/application/${applicationId}/files?isLLMRequired=${formSchemaWholeObject?.requiredDocuments?.length !== 0
            ? true
            : false
          }&schemaId=${formSchemaWholeObject?.id}`,
          formData
        );
        SuccessToaster("File Uploaded Successfully");
        try {
          if (
            response?.data?.classification !== null &&
            formSchemaWholeObject?.requiredDocuments?.length !== 0
          ) {
            await PUT(
              `application-management-service/application/${applicationId}/form/updateData`,
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
                    ? basicForm?.documentsRequired?.filter(
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
        ErrorToaster("File Upload Failed");
        console.error(error);
        return null;
      }
    }
  };

  const fetchPaymentListData = async () => {
    try {
      const regionalCallResponsibility = selectedValue || 'NA';
      const response = await GET(`entity-service/paymentAndFeeDetails/getFeeDetail?privilegeCategoryId=${basicForm?.basicDetailReferences?.credentialingAndPrivilegingCategory?.id}&applicantTypeId=${basicForm?.basicDetailReferences?.applicantType?.id}&applicantCreationType=${basicForm?.creationType}&regionalCallResponsibility=${regionalCallResponsibility}&departmentId=${selectedDepartment !== ""
        ? selectedDepartment : applicationData?.basicDetailReferences?.department?.id}&specialtyId=${selectedSpeciality !== "" ? selectedSpeciality : applicationData?.basicDetailReferences?.specialty?.id}`);
      setPaymentListData(response.data);
    } catch (error) {
      console.error("Error fetching payment list data:", error);
    }
  };

  const handleDeptSubmit = async () => {
    let data = basicForm;
    if (data?.basicDetails?.priorDepartmentSpecialty === null) {
      data.basicDetails.priorDepartmentSpecialty = basicForm?.basicDetails?.departmentSpecialty
    }
    data.basicDetails.departmentSpecialty.department = departmentList?.filter(
      (data) => data?.id === selectedDepartment
    )?.[0]?.departmentName?.name;
    data.basicDetails.departmentSpecialty.specialty = departmentList?.filter(
      (data) => data?.id === selectedDepartment
    )?.[0]?.serviceAreas?.filter(data => data?.id === selectedSpeciality)?.[0]?.name;
    if (!data?.basicDetails?.regionalCallResponsibilities) {
      data.basicDetails.regionalCallResponsibilities = {};
    }
    data.basicDetails.regionalCallResponsibilities.regionalCallResponsibilities = selectedValue || 'NA';
    console.log(data);
    await PUT(
      `application-management-service/application/${applicationId}`,
      data
    )
      .then((response) => {
        getPreApplication()
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    fetchPaymentListData()
  };

  const handleSubmitPrivilegeCategory = async (isUpdated) => {
    let data = basicForm;
    if (isUpdated) {
      if ((data?.basicDetails?.priorPrivilegeCategory === null || data.basicDetails.priorPrivilegeCategory.name === null || data.basicDetails.priorPrivilegeCategory.name === undefined) && !basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated) {
        data.basicDetails.priorPrivilegeCategory = data?.basicDetailReferences?.credentialingAndPrivilegingCategory;
      }
      if (selectedPrivilegeCategory !== "") {
        data.basicDetails.credentialingPrivilegeCategory.credentialingCategory =
          privilegeCategories?.filter(
            (data) => data?.privilegeCategory?.id === selectedPrivilegeCategory
          )?.[0]?.privilegeCategory?.category;
      }
      await PUT(
        `application-management-service/application/${applicationId}`,
        data
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      if (showPrivilegeResetError) {
        let temp = dedupePrivilegePayload({
          obligatedPrivileges: [],
          additionalPrivileges: basicForm?.privileges?.additionalPrivileges,
          priorAdditionalPrivileges: basicForm?.privileges?.priorAdditionalPrivileges,
          priorObligatedPrivileges: basicForm?.privileges?.priorObligatedPrivileges,
        });
        await POST(`application-management-service/application/${applicationId}/privileges`, temp)
          .then((response) => {
            getPreApplication();
          })
      }
    } else {
      if (!basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated) {
        data.basicDetails.priorPrivilegeCategory = data?.basicDetailReferences?.credentialingAndPrivilegingCategory;
      } else {
        if (data?.basicDetails?.priorPrivilegeCategory?.name !== null && data?.basicDetails?.priorPrivilegeCategory?.name !== undefined) {
          data.basicDetails.credentialingPrivilegeCategory.credentialingCategory = data?.basicDetails?.priorPrivilegeCategory?.name;
        }
      }
      await PUT(
        `application-management-service/application/${applicationId}`,
        data
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: {
        privilegeChangeYesOrNo: isUpdated ? privilegeChangeYesOrNo : 'Yes',
        departmentChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo : '',
        privilegeSetChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo : '',
        additionalPrivilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo : '',
        privilegeAtOtherHospitalYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo : '',
        privilegeChangeUpdated: true,
        departmentChangeUpdated: basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated : false,
        privilegeSetChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated : false,
        additionalPrivilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated : false,
        privilegeAtOtherHospitalUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated : false,
      },
      unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
      acknowledged: true,
    };
    await PUT(
      `application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`,
      temp
    )
      .then((response) => {
        console.log(response);
        getPreApplication();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmitDepartment = async (isUpdated) => {
    let data = basicForm;
    console.log(data, 'data');
    if (isUpdated) {
      console.log(data, 'data');
      if (data?.basicDetails?.priorDepartmentSpecialty === null && !basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated) {
        console.log(data, 'data');
        data.basicDetails.priorDepartmentSpecialty = { ...basicForm?.basicDetails?.departmentSpecialty }
      }
      data.basicDetails.departmentSpecialty = { ...data.basicDetails.departmentSpecialty };
      data.basicDetails.departmentSpecialty.department = departmentList?.filter(
        (data) => data?.id === selectedDepartment
      )?.[0]?.departmentName?.name;
      data.basicDetails.departmentSpecialty.specialty = departmentList?.filter(
        (data) => data?.id === selectedDepartment
      )?.[0]?.serviceAreas?.filter(data => data?.id === selectedSpeciality)?.[0]?.name;
      if (!data?.basicDetails?.regionalCallResponsibilities) {
        data.basicDetails.regionalCallResponsibilities = {};
      }
      data.basicDetails.regionalCallResponsibilities.regionalCallResponsibilities = selectedValue || 'NA';
      console.log(data, 'data');
      await PUT(
        `application-management-service/application/${applicationId}`,
        data
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (!basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated) {
        data.basicDetails.priorDepartmentSpecialty = basicForm?.basicDetails?.departmentSpecialty;
      } else {
        if (data?.basicDetails?.priorDepartmentSpecialty !== null && data?.basicDetails?.priorDepartmentSpecialty?.department !== undefined) {
          data.basicDetails.departmentSpecialty = data?.basicDetails?.priorDepartmentSpecialty;
        }
      }
      if (!data?.basicDetails?.regionalCallResponsibilities) {
        data.basicDetails.regionalCallResponsibilities = {};
      }
      data.basicDetails.regionalCallResponsibilities.regionalCallResponsibilities = selectedValue || 'NA';
      await PUT(
        `application-management-service/application/${applicationId}`,
        data
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(data, 'data');
    }
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: {
        privilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo : '',
        departmentChangeYesOrNo: isUpdated ? 'No' : 'Yes',
        privilegeSetChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo : '',
        additionalPrivilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo : '',
        privilegeAtOtherHospitalYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo : '',
        privilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated : false,
        departmentChangeUpdated: true,
        privilegeSetChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated : false,
        additionalPrivilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated : false,
        privilegeAtOtherHospitalUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated : false,
      },
      unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
      acknowledged: true,
    };
    await PUT(
      `application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`,
      temp
    )
      .then((response) => {
        console.log(response);
        getPreApplication();
      })
      .catch((error) => {
        console.log(error);
      });
    fetchPaymentListData()
  }

  const uniquePrivilegesById = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.reduce((unique, current) => {
      if (!unique.some((obj) => obj.id === current.id)) {
        unique.push(current);
      }
      return unique;
    }, []);
  };

  const dedupePrivilegePayload = (payload) => ({
    ...payload,
    obligatedPrivileges: uniquePrivilegesById(payload.obligatedPrivileges),
    priorObligatedPrivileges: uniquePrivilegesById(payload.priorObligatedPrivileges),
    additionalPrivileges: uniquePrivilegesById(payload.additionalPrivileges),
    priorAdditionalPrivileges: uniquePrivilegesById(payload.priorAdditionalPrivileges),
  });

  const handleSubmitPrivilegeSet = async (isUpdated, privileges, isDelete) => {
    const currentObligatedForForm = basicForm?.privileges?.obligatedPrivileges;
    const currentPriorObligatedForForm = basicForm?.privileges?.priorObligatedPrivileges;
    const bothObligatedEmptyForForm =
      (!Array.isArray(currentObligatedForForm) || currentObligatedForForm.length === 0) &&
      (!Array.isArray(currentPriorObligatedForForm) || currentPriorObligatedForForm.length === 0);
    const isFirstPrivilegeSetSubmitForForm =
      !basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated && isUpdated;

    if (isUpdated) {
      let mergedArray = [
        ...basicForm?.privileges?.obligatedPrivileges,
        ...privileges,
      ].reduce((unique, current) => {
        console.log(unique, current, 'unique')
        if (!unique.some((obj) => obj.id === current.id)) {
          unique.push(current);
        }
        console.log(unique, 'unique')
        return unique;
      }, []);

      const currentObligated = basicForm?.privileges?.obligatedPrivileges;
      const currentPriorObligated = basicForm?.privileges?.priorObligatedPrivileges;
      const bothObligatedEmpty =
        (!Array.isArray(currentObligated) || currentObligated.length === 0) &&
        (!Array.isArray(currentPriorObligated) || currentPriorObligated.length === 0);
      const isFirstPrivilegeSetSubmit =
        !basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated && isUpdated;
      const hasCurrentObligated = Array.isArray(currentObligated) && currentObligated.length > 0;
      const priorObligatedPrivileges =
        bothObligatedEmpty || isFirstPrivilegeSetSubmit
          ? []
          : !basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated
            ? (hasCurrentObligated ? currentObligated : [])
            : basicForm?.privileges?.priorObligatedPrivileges;

      let temp = dedupePrivilegePayload({
        obligatedPrivileges: isDelete ? privileges : mergedArray,
        additionalPrivileges: basicForm?.privileges?.additionalPrivileges,
        priorAdditionalPrivileges: basicForm?.privileges?.priorAdditionalPrivileges,
        priorObligatedPrivileges,
      });
      console.log("data", temp);
      await POST(`application-management-service/application/${applicationId}/privileges`, temp)
    } else {
      // Yes flow: keep existing obligated; set priorObligated only if not already updated
      const currentObligated = basicForm?.privileges?.obligatedPrivileges;
      const currentPrior = basicForm?.privileges?.priorObligatedPrivileges;
      const privilegeSetChangeUpdated = basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated;

      if (!privilegeSetChangeUpdated) {
        // Not yet updated: obligated stays as is, move a copy of current obligated to priorObligated
        const obligatedCopy = Array.isArray(currentObligated) ? [...currentObligated] : [];
        const priorObligatedCopy = Array.isArray(currentObligated) ? [...currentObligated] : [];
        let temp = dedupePrivilegePayload({
          obligatedPrivileges: obligatedCopy,
          additionalPrivileges: basicForm?.privileges?.additionalPrivileges,
          priorAdditionalPrivileges: basicForm?.privileges?.priorAdditionalPrivileges,
          priorObligatedPrivileges: priorObligatedCopy
        });
        console.log("data", temp);
        await POST(`application-management-service/application/${applicationId}/privileges`, temp)
      } else {
        // Already updated and Yes: prior (last year's) data should become current obligated; send copies so backend gets two distinct arrays
        const priorCopy = Array.isArray(currentPrior) ? [...currentPrior] : [];
        let temp = dedupePrivilegePayload({
          obligatedPrivileges: priorCopy,
          additionalPrivileges: basicForm?.privileges?.additionalPrivileges,
          priorAdditionalPrivileges: basicForm?.privileges?.priorAdditionalPrivileges,
          priorObligatedPrivileges: Array.isArray(currentPrior) ? [...currentPrior] : []
        });
        console.log("data", temp);
        await POST(`application-management-service/application/${applicationId}/privileges`, temp)
      }
    }
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: {
        privilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo : '',
        departmentChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo : '',
        privilegeSetChangeYesOrNo: isUpdated ? (isFirstPrivilegeSetSubmitForForm ? 'No' : privilegeSetChangeYesOrNo) : 'Yes',
        // privilegeSetChangeYesOrNo: '',
        additionalPrivilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo : '',
        privilegeAtOtherHospitalYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo : '',
        privilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated : false,
        departmentChangeUpdated: basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated : false,
        privilegeSetChangeUpdated: true,
        // privilegeSetChangeUpdated: false,
        additionalPrivilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated : false,
        privilegeAtOtherHospitalUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated : false,
      },
      unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
      acknowledged: true,
    };
    await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
      .then((response) => {
        getPreApplication();
      })
  }

  const handleSubmitAdditionalPrivilegeSet = async (isUpdated, privileges, isDelete) => {
    const currentAdditionalForForm = basicForm?.privileges?.additionalPrivileges;
    const currentPriorAdditionalForForm = basicForm?.privileges?.priorAdditionalPrivileges;
    const bothAdditionalEmptyForForm =
      (!Array.isArray(currentAdditionalForForm) || currentAdditionalForForm.length === 0) &&
      (!Array.isArray(currentPriorAdditionalForForm) || currentPriorAdditionalForForm.length === 0);
    const isFirstAdditionalPrivilegeSubmitForForm =
      !basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated && isUpdated;

    if (isUpdated) {
      let mergedArray = [
        ...basicForm?.privileges?.additionalPrivileges,
        ...privileges,
      ].reduce((unique, current) => {
        console.log(unique, current, 'unique')
        if (!unique.some((obj) => obj.id === current.id)) {
          unique.push(current);
        }
        console.log(unique, 'unique')
        return unique;
      }, []);

      const currentAdditional = basicForm?.privileges?.additionalPrivileges;
      const currentPriorAdditional = basicForm?.privileges?.priorAdditionalPrivileges;
      const bothAdditionalEmpty =
        (!Array.isArray(currentAdditional) || currentAdditional.length === 0) &&
        (!Array.isArray(currentPriorAdditional) || currentPriorAdditional.length === 0);
      const isFirstAdditionalPrivilegeSubmit =
        !basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated && isUpdated;
      const hasCurrentAdditional = Array.isArray(currentAdditional) && currentAdditional.length > 0;
      const priorAdditionalPrivileges =
        bothAdditionalEmpty
          ? []
          : !basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated
            ? (hasCurrentAdditional ? currentAdditional : [])
            : basicForm?.privileges?.priorAdditionalPrivileges;

      let temp = dedupePrivilegePayload({
        obligatedPrivileges: basicForm?.privileges?.obligatedPrivileges,
        additionalPrivileges: isDelete ? privileges : mergedArray,
        priorAdditionalPrivileges,
        priorObligatedPrivileges: basicForm?.privileges?.priorObligatedPrivileges
      });
      console.log("data", temp);
      await POST(`application-management-service/application/${applicationId}/privileges`, temp)
    } else {
      if (!basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated) {
        let temp = dedupePrivilegePayload({
          obligatedPrivileges: basicForm?.privileges?.obligatedPrivileges,
          additionalPrivileges: [],
          priorAdditionalPrivileges: basicForm?.privileges?.additionalPrivileges,
          priorObligatedPrivileges: basicForm?.privileges?.priorObligatedPrivileges
        });
        console.log("data", temp);
        await POST(`application-management-service/application/${applicationId}/privileges`, temp)
      } else {
        let temp = dedupePrivilegePayload({
          obligatedPrivileges: basicForm?.privileges?.obligatedPrivileges,
          additionalPrivileges: [],
          priorAdditionalPrivileges: basicForm?.privileges?.priorAdditionalPrivileges,
          priorObligatedPrivileges: basicForm?.privileges?.priorObligatedPrivileges
        });
        console.log("data", temp);
        await POST(`application-management-service/application/${applicationId}/privileges`, temp)
      }
    }
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: {
        privilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo : '',
        departmentChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo : '',
        privilegeSetChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo : '',
        additionalPrivilegeChangeYesOrNo: isUpdated ? (isFirstAdditionalPrivilegeSubmitForForm ? 'Yes' : additionalPrivilegeChangeYesOrNo) : 'No',
        // additionalPrivilegeChangeYesOrNo: '',
        privilegeAtOtherHospitalYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo : '',
        privilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated : false,
        departmentChangeUpdated: basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated : false,
        privilegeSetChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated : false,
        additionalPrivilegeChangeUpdated: true,
        // additionalPrivilegeChangeUpdated: false,
        privilegeAtOtherHospitalUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated : false,
      },
      unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
      acknowledged: true,
    };
    await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
      .then((response) => {
        getPreApplication();
      })
  }

  const handleSubmitPrivilegesAtOtherHospital = async (isUpdated) => {
    let data = basicForm;
    if (isUpdated) {
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
      setPrivilegeAtOtherHospitalIndex();
      data.basicDetails.existingCredentialingPrivilegeCategory = {
        hasExistingPrivilege: data.basicDetails.existingCredentialingPrivilegeCategory?.hasExistingPrivilege,
        credentialingPrivilegeCategory: data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory?.id !== "" ? data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory : null,
        hospitalName: data.basicDetails.existingCredentialingPrivilegeCategory?.hospitalName,
        privileges: data.basicDetails.existingCredentialingPrivilegeCategory?.privileges,
        hospitalPrivileges: tempHospitalPrivilegeSet,
        priorHospitalPrivileges: !basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated ? data?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges : data?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges
      };
      console.log(data);
      await PUT(
        `application-management-service/application/${applicationId}`,
        data
      )
    } else {
      if (!basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated) {
        data.basicDetails.existingCredentialingPrivilegeCategory = {
          hasExistingPrivilege: data.basicDetails.existingCredentialingPrivilegeCategory?.hasExistingPrivilege,
          credentialingPrivilegeCategory: data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory?.id !== "" ? data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory : null,
          hospitalName: data.basicDetails.existingCredentialingPrivilegeCategory?.hospitalName,
          privileges: data.basicDetails.existingCredentialingPrivilegeCategory?.privileges,
          hospitalPrivileges: [],
          priorHospitalPrivileges: data.basicDetails.existingCredentialingPrivilegeCategory?.hospitalPrivileges
        };
        await PUT(`application-management-service/application/${applicationId}`, data)
      } else {
        data.basicDetails.existingCredentialingPrivilegeCategory = {
          hasExistingPrivilege: data.basicDetails.existingCredentialingPrivilegeCategory?.hasExistingPrivilege,
          credentialingPrivilegeCategory: data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory?.id !== "" ? data.basicDetails.existingCredentialingPrivilegeCategory?.credentialingPrivilegeCategory : null,
          hospitalName: data.basicDetails.existingCredentialingPrivilegeCategory?.hospitalName,
          privileges: data.basicDetails.existingCredentialingPrivilegeCategory?.privileges,
          hospitalPrivileges: [],
          priorHospitalPrivileges: data.basicDetails.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges
        };
        await PUT(`application-management-service/application/${applicationId}`, data)
      }
    }
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: {
        privilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo : '',
        departmentChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo : '',
        privilegeSetChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo : '',
        additionalPrivilegeChangeYesOrNo: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo : '',
        privilegeAtOtherHospitalYesOrNo: isUpdated ? 'Yes' : 'No',
        privilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated : false,
        departmentChangeUpdated: basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated : false,
        privilegeSetChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated : false,
        additionalPrivilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated : false,
        privilegeAtOtherHospitalUpdated: true,
      },
      unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
      acknowledged: true,
    };
    await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
      .then((response) => {
        getPreApplication();
      })
  }

  const handleSubmit = async () => {
    // let mergedArray = [
    //   ...basicForm?.privileges?.obligatedPrivileges,
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
    //   obligatedPrivileges: isPrivilegeSetChanging ? (showPrivilegeResetError || privilegeSetChangeYesOrNo === 'No') ? selectedPrivilegesForDisplayMultiple : mergedArray : basicForm?.privileges?.obligatedPrivileges,
    //   additionalPrivileges: isAdditionalPrivilegeCategoryChanging ? selectedAdditionalPrivilegeForDisplay : basicForm?.privileges?.additionalPrivileges,
    //   priorAdditionalPrivileges:
    //     basicForm?.privileges?.priorAdditionalPrivileges?.length === 0
    //       ? basicForm?.privileges?.additionalPrivileges !== null ? basicForm?.privileges?.additionalPrivileges : []
    //       : basicForm?.privileges?.priorAdditionalPrivileges !== null ? basicForm?.privileges?.priorAdditionalPrivileges : [],
    //   priorObligatedPrivileges:
    //     basicForm?.privileges?.priorObligatedPrivileges?.length === 0
    //       ? basicForm?.privileges?.obligatedPrivileges !== null ? basicForm?.privileges?.obligatedPrivileges : []
    //       : basicForm?.privileges?.priorObligatedPrivileges !== null ? basicForm?.privileges?.priorObligatedPrivileges : [],
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
    //   let data = basicForm;
    //   if (data?.basicDetails?.priorPrivilegeCategory === null || data.basicDetails.priorPrivilegeCategory.name === null || data.basicDetails.priorPrivilegeCategory.name === undefined) {
    //     data.basicDetails.priorPrivilegeCategory = {
    //       id: privilegeCategories?.filter(
    //         (data) =>
    //           data?.privilegeCategory?.category ===
    //           basicForm?.basicDetails?.credentialingPrivilegeCategory
    //             ?.credentialingCategory
    //       )?.[0]?.privilegeCategory?.id,
    //       name: basicForm?.basicDetails?.credentialingPrivilegeCategory
    //         ?.credentialingCategory,
    //       type: privilegeCategories?.filter(
    //         (data) =>
    //           data?.privilegeCategory?.category ===
    //           basicForm?.basicDetails?.credentialingPrivilegeCategory
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
    //       // setBasicForm(response?.data);
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
      let data = basicForm;

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
        `application-management-service/application/${applicationId}`,
        data
      )
        .then((response) => {
          console.log(response);
          setBasicForm(response?.data);
          SuccessToaster("Staff Member Application Updated Successfully");
        })
        .catch((error) => {
          console.log(error);
          ErrorToaster("Unexpected Error Updating Staff Member Application");
        });
    }
    if (
      isPrivilegeSetChanging &&
      basicForm?.basicDetails?.credentialingPrivilegeCategory
        ?.credentialingCategory === "Courtesy Staff With Admitting Privileges"
    ) {
      let data = basicForm;
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
        `application-management-service/application/${applicationId}`,
        data
      )
        .then((response) => {
          console.log(response);
          setBasicForm(response?.data);
          SuccessToaster("Staff Member Application Updated Successfully");
        })
        .catch((error) => {
          console.log(error);
          ErrorToaster("Unexpected Error Updating Staff Member Application");
        });
    }
    handleSubmitAcknowledgement()
  };

  const handleSubmitAcknowledgement = async (isNavigate) => {
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: {
        privilegeChangeYesOrNo: privilegeChangeYesOrNo,
        departmentChangeYesOrNo: departmentChangeYesOrNo,
        privilegeSetChangeYesOrNo: privilegeSetChangeYesOrNo,
        additionalPrivilegeChangeYesOrNo: additionalPrivilegeChangeYesOrNo,
        privilegeAtOtherHospitalYesOrNo: privilegeAtOtherHospitalYesOrNo,
        privilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated : false,
        departmentChangeUpdated: basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated : false,
        privilegeSetChangeUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated : false,
        additionalPrivilegeChangeUpdated: basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated : false,
        privilegeAtOtherHospitalUpdated: basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated !== undefined ? basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalUpdated : false,
      },
      unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
      acknowledged: true,
    };
    await PUT(
      `application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`,
      temp
    )
      .then((response) => {
        console.log(response);
        setBasicForm(response?.data);
        SuccessToaster("Application Updated Successfully");
        if ((paymentListData?.fee === 0 || paymentListData?.fee === undefined) || basicForm?.payment?.paymentCompleted) {
          handleContinue(isNavigate);
        }
      })
      .catch((error) => {
        console.log(error);
        ErrorToaster("Unexpected Error Updating Application");
      });
  };

  const handleContinue = async (isNavigate) => {
    getPreApplication();
    if (isNavigate) {
      if (sessionStorage.getItem("fromSummary") === "true") {
        navigate(-1);
      } else {
        if (isContinueEnabled) {
          navigate(navigateURL);
        }
      }
    }
  };

  const handleContinueClick = () => {
    if (paymentListData?.fee !== 0 && paymentListData?.fee !== undefined && !basicForm?.payment?.paymentCompleted) {
      setShowPaymentDialog(true);
    }
    handleSubmitAcknowledgement(true);
  }

  const handleDeleteFile = async (files) => {
    await DELETE(
      `application-management-service/application/${applicationId}/files`,
      files
    )
      .then((response) => {
        SuccessToaster("File Deleted Successfully");
        handleSubmit();
      })
      .catch((error) => {
        ErrorToaster("Unexpected Error Deleting File");
      });
  };

  const getIsOpen = (value) => {
    setIsOpen(value);
  };

  const getIsAlertOpen = (value, string) => {
    if (string === "OKAY") {
      setIsAlertOpen(value);
      setIsOpen(true);
    } else {
      setIsAlertOpen(value);
    }
  };

  const handleChange = (privilegeId) => {
    setSelectedPrivilege(privilegeId);
    setSelectedPrivilegeForDisplay(
      allStaffPrivilege?.filter((data) => data?.id === privilegeId)
    );
  };

  const handleChangeAdditional = (privilegeId) => {
    setSelectedPrivilege(privilegeId);
    setSelectedAdditionalPrivilegeForDisplay(
      allStaffPrivilege?.filter((data) => data?.id === privilegeId)
    );
  };

  const handlePrivilegeSetChangeYes = () => {
    setIsEdit(false);
    setPrivilegeChangeYesOrNo('Yes');
    setIsPrivilegeCategoryChanging(false)
  }

  const handleKeepYourPrivilegeYes = () => {
    // if (selectedPrivilegeForDisplay?.length !== 0 && ((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL !== undefined || basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text !== undefined))) {
    //   setDontUpdatePrivilegeState(true)
    //   setIsShowESignConfirmationDialog(true)
    // } else {
    //   setDontUpdatePrivilegeState(true)
    //   setIsShowESignDialog(true)
    // }
    setIsEditPrivilege(false);
    setPrivilegeSetChangeYesOrNo('Yes');
    setIsPrivilegeSetChanging(false);
    // setShowPrivilegesForSign(true);
  }

  const handleKeepYourPrivilegeNo = () => {
    // if (((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL !== undefined || basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text !== undefined))) {
    //   setDontUpdatePrivilegeState(true)
    //   setIsShowESignConfirmationDialog(true)
    // } else {
    //   setDontUpdatePrivilegeState(true)
    //   setIsShowESignDialog(true)
    // }
    setIsPrivilegeSetChanging(true);
    setPrivilegeSetChangeYesOrNo('No');
  }

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

  const handleAdditionalRestrictedFileSelection = async (
    index,
    categoriesIndex,
    privilegesIndex,
    value
  ) => {
    let file = await addNewDocument(value);
    handleAdditionalRestrictedSelection(
      index,
      categoriesIndex,
      privilegesIndex,
      file,
      "file"
    );
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

  const handleSign = (type, basicOrAdditional, index = 0, isPrivilegeSpecificationType) => {
    console.log(selectedPrivilegeForDisplay)
    if (basicOrAdditional === "Basic") {
      if (isPrivilegeSpecificationType) {
        setSelectedPrivilegeForDisplay((prevData) => {
          const temp = [...prevData];
          if ((temp?.[index]?.descriptiveContent === null || temp?.[index]?.descriptiveContent?.esign === null ||
            temp?.[index]?.descriptiveContent?.esign === undefined)
          ) {
            temp[index].descriptiveContent.esign = {
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
          } else if (
            type === "NonCore" &&
            (temp[index].privilegeDetails.nonCorePrivileges?.esign === null ||
              temp[index].privilegeDetails.nonCorePrivileges?.esign === undefined)
          ) {
            temp[index].privilegeDetails.nonCorePrivileges = temp[index].privilegeDetails.nonCorePrivileges || {};
            temp[index].privilegeDetails.nonCorePrivileges.esign = {
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
    } else {
      if (isPrivilegeSpecificationType) {
        setSelectedAdditionalPrivilegeForDisplay((prevData) => {
          const temp = [...prevData];
          if ((temp?.[index]?.descriptiveContent === null || temp?.[index]?.descriptiveContent?.esign === null ||
            temp?.[index]?.descriptiveContent?.esign === undefined)
          ) {
            temp[index].descriptiveContent.esign = {
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
          } else if (
            type === "NonCore" &&
            (temp[index].privilegeDetails.nonCorePrivileges?.esign === null ||
              temp[index].privilegeDetails.nonCorePrivileges?.esign === undefined)
          ) {
            temp[index].privilegeDetails.nonCorePrivileges = temp[index].privilegeDetails.nonCorePrivileges || {};
            temp[index].privilegeDetails.nonCorePrivileges.esign = {
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
    }
  };

  const handleAdditionalRestrictedSelection = (
    index,
    categoriesIndex,
    privilegesIndex,
    value,
    key
  ) => {
    console.log(index, categoriesIndex, privilegesIndex, value, key);
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
    getFields();
  };

  const handleDeleteSelectedPrrivilege = (id) => {
    let filteredData = selectedPrivilegesForDisplayMultiple?.filter(
      (data) => data?.id !== id
    );
    setSelectedPrivilegesForDisplayMultiple(filteredData);
    handleSubmitPrivilegeSet(true, filteredData, true)
  };

  const handleDeleteSelectedAdditionalPrrivilege = (id) => {
    let filteredData = selectedAdditionalPrivilegesForDisplayMultiple?.filter(
      (data) => data?.id !== id
    );
    setSelectedAdditionalPrivilegesForDisplayMultiple(filteredData);
    handleSubmitAdditionalPrivilegeSet(true, filteredData, true)
  };

  const handleCollapse = (value, index) => {
    console.log("value", value, index);

    let temp = collapsibleIndexes;
    if (value === "open") {
      console.log("inside if_");
      temp.push(index);
      setCollapsibleIndexes(temp);
    } else {
      setCollapsibleIndexes(
        temp?.filter((data) => data !== index)?.map((data) => data)
      );
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
            {/* <div className={style.cardTitle}>{`${allStaffPrivilege
              ?.filter((data) => data?.id === selectedPrivilege)
              ?.map((data) => data?.privilegeSetTitle)[0] !== undefined
              ? allStaffPrivilege
                ?.filter((data) => data?.id === selectedPrivilege)
                ?.map((data) => data?.privilegeSetTitle)[0]
                ?.toUpperCase()
              : ""
              }`}</div> */}

            {selectedPrivilegeForDisplay?.map((data) =>
              data?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                (
                  <div
                    className={` ${style.marginTop} ${style.descriptionStyle}`}
                    dangerouslySetInnerHTML={{ __html: data?.descriptiveContent?.content }}
                  />
                )
                :
                <>
                  <div className={style.cardTitle}>{data?.privilegeSetTitle}</div>
                  {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map(
                    (categories, index) => (
                      <>
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
                        {categories?.subCategories?.map((subCategory, subIndex) => (
                          <div className={style.marginLeft20}>
                            <div className={style.categoryGrid}>
                              <div className={style.itemLeft}><strong>{subCategory?.subCategory === null ? '' : subCategory?.subCategory}</strong></div>
                            </div>
                            <>{
                              subCategory?.privileges?.map(privileges => (
                                <div className={style.privilegeCodeGrid}>
                                  <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                  <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                </div>

                              ))
                            }
                            </>
                          </div>
                        ))}
                      </>
                    )
                  )}
                </>
            )}
            {(selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !==
              undefined || (selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" && selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.content)) && (
                <div className={style.twoCol}>
                  <div onClick={() => handleSign("Core", "Basic", 0, selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT")}>
                    <ESignature
                      userName={selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign !== null ? selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign?.name : "" :
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign !== null ? selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign?.esign : "" :
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.esign?.esign
                            : ""
                      }
                      showData={
                        selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign ? true : false :
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
                        {selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign ? selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign?.signedDate : "" :
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== null
                            ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.esign?.signedDate
                            : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {selectedPrivilegeForDisplay?.map((data) =>
              data?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.map(
                (categories, index) => (
                  <>
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
                    {categories?.subCategories?.map((subCategory, subIndex) => (
                      <div className={style.marginLeft20}>
                        <div className={style.categoryGrid}>
                          <div className={style.itemLeft}><strong>{subCategory?.subCategory === null ? '' : subCategory?.subCategory}</strong></div>
                        </div>
                        <>{
                          subCategory?.privileges?.map(privileges => (
                            <div className={style.privilegeCodeGrid}>
                              <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                              <div className={style.itemLeft}>{privileges?.title || ''}</div>
                            </div>

                          ))
                        }
                        </>
                      </div>
                    ))}
                  </>
                )
              )
            )}
            {(selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !==
              undefined) && (
                <div className={style.twoCol}>
                  <div onClick={() => handleSign("NonCore", "Basic", 0, false)}>
                    <ESignature
                      userName={
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null
                          ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null
                          ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.esign
                          : ""
                      }
                      showData={
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign !== undefined
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
                          ?.nonCorePrivileges?.esign != null
                          ? selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.signedDate
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div >

          {
            selectedPrivilegeForDisplay?.[0]?.privilegeDetails
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
                <div className={style.twoCol}>
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
                </div>
              </div>
            )
          }
        </>
      );
    }
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
              data?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                (
                  <div
                    className={` ${style.marginTop} ${style.descriptionStyle}`}
                    dangerouslySetInnerHTML={{ __html: data?.descriptiveContent?.content }}
                  />
                )
                :
                <>
                  {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map(
                    (categories, index) => (
                      <>
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
                        {categories?.subCategories?.map((subCategory, subIndex) => (
                          <div className={style.marginLeft20}>
                            <div className={style.categoryGrid}>
                              <div className={style.itemLeft}><strong>{subCategory?.subCategory === null ? '' : subCategory?.subCategory}</strong></div>
                            </div>
                            <>{
                              subCategory?.privileges?.map(privileges => (
                                <div className={style.privilegeCodeGrid}>
                                  <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                  <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                </div>

                              ))
                            }
                            </>
                          </div>
                        ))}
                      </>
                    )
                  )}
                </>
            )}
            {(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !==
              undefined || (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" && selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.content)) && (
                <div className={style.twoCol}>
                  <div onClick={() => handleSign("Core", "Additional", 0, selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT")}>
                    <ESignature
                      userName={selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign !== null ? selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign?.name : "" :
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign?.name
                          : ""
                      }
                      encData={selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign !== null ? selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign?.esign : "" :
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign?.esign
                          : ""
                      }
                      showData={selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign ? true : false :
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
                        {selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign ? selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign?.signedDate : "" :
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== null
                            ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.esign?.signedDate
                            : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {selectedAdditionalPrivilegeForDisplay?.map((data) =>
              data?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.map(
                (categories, index) => (
                  <>
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
                    {categories?.subCategories?.map((subCategory, subIndex) => (
                      <div className={style.marginLeft20}>
                        <div className={style.categoryGrid}>
                          <div className={style.itemLeft}><strong>{subCategory?.subCategory === null ? '' : subCategory?.subCategory}</strong></div>
                        </div>
                        <>{
                          subCategory?.privileges?.map(privileges => (
                            <div className={style.privilegeCodeGrid}>
                              <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                              <div className={style.itemLeft}>{privileges?.title || ''}</div>
                            </div>

                          ))
                        }
                        </>
                      </div>
                    ))}
                  </>
                )
              )
            )}
            {(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !== undefined) && (
                <div className={style.twoCol}>
                  <div onClick={() => handleSign("NonCore", "Additional", 0, false)}>
                    <ESignature
                      userName={
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.esign
                          : ""
                      }
                      showData={
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign !== undefined
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
                          ?.nonCorePrivileges?.esign != null
                          ? selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.signedDate
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {selectedAdditionalPrivilegeForDisplay[0]?.privilegeDetails
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
                <div className={style.twoCol}>
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
                </div>
              </div>
            )}
        </>
      );
    }
  };

  const getFieldsForSign = (id, privilegeSetIndex, privilegeData) => {
    console.log(selectedPrivilegeForDisplay, 'entered')
    if (id !== "" && selectedPrivilegeForDisplay?.length !== 0) {
      console.log(
        privilegeData,
        selectedPrivilegeForDisplay,
        selectedAdditionalPrivilegeForDisplay,
        "entered",
        id,
        staffPrivilege?.filter((data) => data?.id === id),
        staffPrivilege,
        selectedPrivilegesForDisplayMultiple
      );
      return (
        <>
          <div className={style.marginTop}>
            <div className={style.cardTitle}>{`${privilegeData?.privilegeSetTitle?.toUpperCase()}`}</div>

            {privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
              (
                <div
                  className={` ${style.marginTop} ${style.descriptionStyle}`}
                  dangerouslySetInnerHTML={{ __html: privilegeData?.descriptiveContent?.content }}
                />
              )
              : (
                <>
                  {privilegeData?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map(
                    (categories, index) => (
                      <>
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
                        {categories?.subCategories?.map((subCategory, subIndex) => (
                          <div className={style.marginLeft20}>
                            <div className={style.categoryGrid}>
                              <div className={style.itemLeft}><strong>{subCategory?.subCategory === null ? '' : subCategory?.subCategory}</strong></div>
                            </div>
                            <>{
                              subCategory?.privileges?.map(privileges => (
                                <div className={style.privilegeCodeGrid}>
                                  <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                  <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                </div>

                              ))
                            }
                            </>
                          </div>
                        ))}
                      </>
                    )
                  )}
                </>
              )}
            {privilegeData?.privilegeDetails?.corePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              privilegeData?.privilegeDetails?.corePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !==
              undefined && (
                <div className={style.twoCol}>
                  <div onClick={() => handleSign("Core", "Basic", privilegeSetIndex, privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT")}>
                    <ESignature
                      userName={
                        privilegeData?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? privilegeData?.privilegeDetails
                            ?.corePrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        privilegeData?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? privilegeData?.privilegeDetails
                            ?.corePrivileges?.esign?.esign
                          : ""
                      }
                      showData={
                        privilegeData?.privilegeDetails
                          ?.corePrivileges?.esign !== null &&
                          privilegeData?.privilegeDetails
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
                        {privilegeData?.privilegeDetails
                          ?.corePrivileges?.esign !== null
                          ? privilegeData?.privilegeDetails
                            ?.corePrivileges?.esign?.signedDate
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {privilegeData?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.map(
              (categories, index) => (
                <>
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
                  {categories?.subCategories?.map((subCategory, subIndex) => (
                    <div className={style.marginLeft20}>
                      <div className={style.categoryGrid}>
                        <div className={style.itemLeft}><strong>{subCategory?.subCategory === null ? '' : subCategory?.subCategory}</strong></div>
                      </div>
                      <>{
                        subCategory?.privileges?.map(privileges => (
                          <div className={style.privilegeCodeGrid}>
                            <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                            <div className={style.itemLeft}>{privileges?.title || ''}</div>
                          </div>

                        ))
                      }
                      </>
                    </div>
                  ))}
                </>
              )
            )}
            {privilegeData?.privilegeDetails?.nonCorePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              privilegeData?.privilegeDetails?.nonCorePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !== undefined && (
                <div className={style.twoCol}>
                  <div onClick={() => handleSign("NonCore", "Basic", privilegeSetIndex, false)}>
                    <ESignature
                      userName={
                        privilegeData?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null
                          ? privilegeData?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        privilegeData?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null
                          ? privilegeData?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.esign
                          : ""
                      }
                      showData={
                        privilegeData?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null &&
                          privilegeData?.privilegeDetails
                            ?.nonCorePrivileges?.esign !== undefined
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
                        {privilegeData?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null
                          ? privilegeData?.privilegeDetails
                            ?.nonCorePrivileges?.esign?.signedDate
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {privilegeData?.privilegeDetails
            ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
            ?.length !== 0 &&
            privilegeData?.privilegeDetails
              ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
              ?.length !== undefined && (
              <div className={style.padding}>
                <div className={style.cardDescription}>
                  {
                    "The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below."
                  }
                </div>

                {privilegeData?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map(
                  (categories, categoriesIndex) => (
                    <div key={`${privilegeSetIndex}${categoriesIndex}`}>
                      <div className={style.categoryGrid}></div>
                      <>
                        {categories?.privileges?.map(
                          (privileges, privilegesIndex) => (
                            <div
                              className={`${style.restrictedPrivilegeGrid} ${privilegesIndex === 0 ? style.marginTop : ""
                                }`}
                              key={`${privilegeSetIndex}${privilegesIndex}`}
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
                                      privilegeSetIndex,
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
                                            privilegeSetIndex,
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
                                            privilegeSetIndex,
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
                                                    color: `${privilegeData?.subStatus}`,
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
                                                  privilegeSetIndex,
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
                )}
                <div className={style.twoCol}>
                  <div
                    onClick={() => {
                      handleSign("Restricted", "Basic", privilegeSetIndex, privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT");
                    }}
                  >
                    <ESignature
                      userName={
                        privilegeData?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null
                          ? privilegeData?.privilegeDetails
                            ?.restrictedPrivileges?.esign?.name
                          : ""
                      }
                      encData={
                        privilegeData?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null
                          ? privilegeData?.privilegeDetails
                            ?.restrictedPrivileges?.esign?.esign
                          : ""
                      }
                      showData={
                        privilegeData?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null &&
                          privilegeData?.privilegeDetails
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
                        {privilegeData?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== null
                          ? privilegeData?.privilegeDetails
                            ?.restrictedPrivileges?.esign?.signedDate
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
      );
    }
  };

  const handleSelectedPrivilegesForDisplayMultiple = (data) => {
    console.log('PrivilegeCheck')
    let temp = selectedPrivilegesForDisplayMultiple;
    temp.push(data);
    setSelectedPrivilegesForDisplayMultiple(temp);
    if (privilegeSetChangeYesOrNo === 'Yes') {
      console.log('PrivilegeCheck')
      handleSubmitPrivilegeSet()
    } else {
      console.log('PrivilegeCheck')
      handleSubmitPrivilegeSet(true, temp)
    }
  };

  const handleSelectedAdditionalPrivilegesForDisplayMultiple = (data) => {
    let temp = selectedAdditionalPrivilegesForDisplayMultiple;
    temp.push(data);
    setSelectedAdditionalPrivilegesForDisplayMultiple(temp);
    handleSubmitAdditionalPrivilegeSet(true, temp)
  };

  const getItems = (data) => {
    let temp = [];
    data?.map((data) => {
      temp.push({ id: data?.id, value: data?.name });
    });
    return temp;
  };

  // const getDeptItems = (data) => {
  //   let temp = [];
  //   data?.map((data) => {
  //     // if (!(basicForm?.basicDetails?.departmentSpecialty?.department === data?.departmentName?.name && basicForm?.basicDetails?.departmentSpecialty?.specialty === "")) {
  //     temp.push({ id: data?.id, value: data?.departmentName?.name });
  //     // }
  //     data?.serviceAreas?.map((specialityData => {
  //       // if (!(basicForm?.basicDetails?.departmentSpecialty?.department === data?.departmentName?.name && basicForm?.basicDetails?.departmentSpecialty?.specialty === specialityData?.name)) {
  //       temp.push({ id: data?.id, value: `${data?.departmentName?.name} - ${specialityData?.name}`, specialityId: specialityData?.id });
  //       // }
  //     }))
  //   });
  //   return temp;
  // };


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
          key: `dept-${department?.id}`
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
            key: `speciality-${specialityData?.department?.id}-${specialityData?.id}` // Unique key for speciality
          };

          temp.push(specialityItem);
        });
      }
    });

    return temp;
  };

  // const getAdditionalDeptItems = (data) => {
  //   let temp = [];
  //   data?.map((data) => {
  //     console.log('Dept Check', data, basicForm?.basicDetails?.departmentSpecialty?.department, data?.departmentName?.name, basicForm?.basicDetails?.departmentSpecialty?.specialty)
  //     if (!(basicForm?.basicDetails?.departmentSpecialty?.department === data?.departmentName?.name && (basicForm?.basicDetails?.departmentSpecialty?.specialty === "" || basicForm?.basicDetails?.departmentSpecialty?.specialty === null))) {
  //       temp.push({ id: data?.id, value: data?.departmentName?.name });
  //     }
  //     data?.serviceAreas?.map((specialityData => {
  //       console.log('Dept Check', specialityData, basicForm?.basicDetails?.departmentSpecialty?.specialty, specialityData?.name)
  //       if (!(basicForm?.basicDetails?.departmentSpecialty?.department === data?.departmentName?.name && basicForm?.basicDetails?.departmentSpecialty?.specialty === specialityData?.name)) {
  //         temp.push({ id: data?.id, value: `${data?.departmentName?.name} - ${specialityData?.name}`, specialityId: specialityData?.id });
  //       }
  //     }))
  //   });
  //   return temp;
  // };

  const getAdditionalDeptItems = (departmentList) => {
    let temp = [];
    let processedDepartments = new Set();

    departmentList?.forEach((department) => {
      let departmentValue = department?.departmentName?.name;
      let hasSpecialities = department?.serviceAreas?.length > 0;

      // Access basicForm directly from state
      if (!processedDepartments.has(department?.id) &&
        !(basicForm?.basicDetails?.departmentSpecialty?.department === departmentValue &&
          (basicForm?.basicDetails?.departmentSpecialty?.specialty === "" || basicForm?.basicDetails?.departmentSpecialty?.specialty === null))) {

        let deptItem = {
          id: department?.id,
          value: departmentValue,
          specialityId: "",
          key: `dept-${department?.id}`
        };
        temp.push(deptItem);
        processedDepartments.add(department?.id);
      }

      if (hasSpecialities) {
        department?.serviceAreas?.forEach((specialityData) => {
          if (!(basicForm?.basicDetails?.departmentSpecialty?.department === specialityData?.department?.departmentName?.name &&
            basicForm?.basicDetails?.departmentSpecialty?.specialty === specialityData?.name)) {

            let specialityItem = {
              id: specialityData?.id,
              departmentId: specialityData?.department?.id,
              value: `${specialityData?.department?.departmentName?.name} - ${specialityData?.name}`,
              specialityId: specialityData?.id,
              key: `speciality-${specialityData?.department?.id}-${specialityData?.id}`
            };

            temp.push(specialityItem);
          }
        });
      }
    });

    return temp;
  };

  const handleEditPrivilegesAtOtherHospital = (data, index) => {
    setIsPrivilegeAtOtherHospitalEdited(true);
    setPrivilegeAtOtherHospitalIndex(index);
    setHospitalName(data?.hospitalName);
    setHospitalPrivilege(data?.privileges);
  }

  console.log(
    "collapsibleIndexes",
    openIndex,
    selectedPrivilegeForDisplay,
    selectedPrivilege,
    getDeptItems(departmentList),
    selectedDepartment, selectedSpeciality,
    getDeptItems(departmentList)?.filter(data => data?.id === selectedDepartment && data?.specialityId === selectedSpeciality)?.[0]?.value
  );

  return (
    <div>
      {isLoading && (
        <div
          className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
        >
          <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
        </div>
      )}
      {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
      <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
        <div>
          <ReappointmentProgressCard
            step={"STEP 6"}
            title={formSchema?.title}
            dataType={formSchema?.description}
            timeNumber={20}
            timeText={"Min"}
            progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
            basicForm={basicForm}
          />
          <div className={`${style.applicationCardStyle} ${style.marginTop10}`}>
            <div className={`${style.privilegeCard} ${style.marginTop10}`}>
              <div>
                <div className={style.twoCol}>
                  <div className={`${style.privilegeTopHeading}`}>
                    <strong>2025 - 2026 Privileges</strong>
                  </div>
                  <div className={`${style.privilegeTopHeading}`}>
                    <strong>2026 - 2027 Privileges</strong>
                  </div>
                </div>
                <div className={`${style.privilegeHeading} ${style.marginTop}`}>
                  <strong>Privilege Category</strong>
                </div>
                <div className={style.twoCol}>
                  <div
                    className={`${style.privilegeContentCard} ${style.marginTop10}`}
                  >
                    <div className={style.privilegeHeadingCurrent}>Current</div>
                    <div className={style.privilegeHeading}>
                      {(basicForm?.basicDetails?.priorPrivilegeCategory !== null && basicForm?.basicDetails?.priorPrivilegeCategory?.name !== null)
                        ? basicForm?.basicDetails?.priorPrivilegeCategory
                          ?.name
                        : basicForm?.basicDetails
                          ?.credentialingPrivilegeCategory
                          ?.credentialingCategory}
                    </div>
                  </div>
                  {basicForm?.forms?.[formIndex]?.data?.privilegeChangeUpdated && (
                    <div
                      className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                    >
                      <div className={style.privilegeHeadingReappointment}>
                        Change for Reappointment
                      </div>
                      <div className={style.privilegeHeading}>
                        {privilegeChangeYesOrNo === "Yes" ? (
                          <div className={style.privilegeHeading}>
                            Same as Before
                          </div>
                        ) : (
                          <div className={style.privilegeHeading}>
                            {
                              basicForm?.basicDetails?.priorPrivilegeCategory
                                ?.name === basicForm?.basicDetails
                                  ?.credentialingPrivilegeCategory
                                  ?.credentialingCategory ? 'Same as Before' : basicForm?.basicDetails
                                    ?.credentialingPrivilegeCategory
                                ?.credentialingCategory
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                  <strong>Department</strong>
                </div>
                <div className={style.twoCol}>
                  <div
                    className={`${style.privilegeContentCard} ${style.marginTop10}`}
                  >
                    <div className={style.privilegeHeadingCurrent}>Current</div>
                    <div className={style.privilegeHeading}>
                      {(basicForm?.basicDetails?.priorDepartmentSpecialty !== null && basicForm?.basicDetails?.priorDepartmentSpecialty?.department !== null) ? basicForm?.basicDetails?.priorDepartmentSpecialty?.department : (basicForm?.basicDetails?.departmentSpecialty !== null && basicForm?.basicDetails?.departmentSpecialty?.department !== null) ? basicForm?.basicDetails?.departmentSpecialty?.department : 'None'}
                    </div>
                  </div>
                  {basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== '' && basicForm?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined && (
                    <div
                      className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                    >
                      <div className={style.privilegeHeadingReappointment}>
                        Change for Reappointment
                      </div>
                      <div className={style.privilegeHeading}>
                        {departmentChangeYesOrNo === "No" ? (
                          <div className={style.privilegeHeading}>
                            {basicForm?.basicDetails?.departmentSpecialty?.department}
                          </div>
                        ) : (
                          <div className={style.privilegeHeading}>
                            {basicForm?.basicDetails?.priorDepartmentSpecialty?.department !== null ? basicForm?.basicDetails?.priorDepartmentSpecialty?.department === basicForm?.basicDetails?.departmentSpecialty?.department ? 'Same as Before' : basicForm?.basicDetails?.departmentSpecialty?.department : basicForm?.basicDetails?.departmentSpecialty?.department}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {(basicForm?.privileges?.priorObligatedPrivileges?.length !== 0 || basicForm?.privileges?.obligatedPrivileges?.length !== 0) && (
                  <>
                    <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                      <strong>Privilege Sets</strong>
                    </div>
                    <div className={style.twoCol}>
                      <div
                        className={`${style.privilegeContentCard} ${style.marginTop10}`}
                      >
                        <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                        {basicForm?.privileges?.priorObligatedPrivileges?.length === 0 ?
                          basicForm?.forms?.[formIndex]?.data?.privilegeSetChangeUpdated ?
                            (
                              <div className={style.privilegeHeading}>Not Available</div>
                            )
                            : (
                              <>
                                {basicForm?.privileges?.obligatedPrivileges?.map(
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
                            )
                          : (
                            <>
                              {basicForm?.privileges?.priorObligatedPrivileges?.map(
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
                            Signed Privileges
                          </div>
                          {privilegeSetChangeYesOrNo === "Yes" ? (
                            <>
                              {/* <div className={style.privilegeHeading}>
                                Same Privileges Requested
                              </div> */}
                              {basicForm?.privileges?.obligatedPrivileges?.map(
                                (data) => (
                                  <div
                                    className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                                    onClick={() => {
                                      setShowCurrentPrivileges(true);
                                      setCurrentPrivilegesCategory('Basic')
                                      setSelectedPrivilege(data?.id);
                                    }}
                                  >
                                    {data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>Signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}
                                  </div>
                                )
                              )}
                            </>
                          ) : (
                            <>
                              {basicForm?.privileges?.obligatedPrivileges?.map(
                                (data) => (
                                  <div
                                    className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                                    onClick={() => {
                                      setShowCurrentPrivileges(true);
                                      setCurrentPrivilegesCategory('Basic')
                                      setSelectedPrivilege(data?.id);
                                    }}
                                  >
                                    {data?.privilegeSetTitle} {(data?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? data?.descriptiveContent?.esign?.signedDate : (data?.privilegeDetails?.corePrivileges?.esign?.signedDate || data?.privilegeDetails?.nonCorePrivileges?.esign?.signedDate)) && (<span className={style.signedOnText}>Signed on {data?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? data?.descriptiveContent?.esign?.signedDate : (data?.privilegeDetails?.corePrivileges?.esign?.signedDate || data?.privilegeDetails?.nonCorePrivileges?.esign?.signedDate)}</span>)}
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
                {(basicForm?.privileges?.priorAdditionalPrivileges?.length !== 0 || basicForm?.privileges?.additionalPrivileges?.length !== 0) && (
                  <div>
                    <div className={`${style.privilegeHeading} ${style.marginTop10}`}><strong>Additional Privileges</strong></div>
                    <div className={style.twoCol}>
                      <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                        <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                        {basicForm?.privileges?.priorAdditionalPrivileges?.length === 0 ?
                          basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeUpdated ?
                            (
                              <div className={style.privilegeHeading}>Not Available</div>
                            )
                            : (
                              <>
                                {basicForm?.privileges?.additionalPrivileges?.map(
                                  (data) => (
                                    <div className={style.privilegeHeading}
                                    // className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                                    // onClick={() => {
                                    //   setShowCurrentPrivileges(true);
                                    //   handleChangeAdditional(data?.id);
                                    //   setCurrentPrivilegesCategory('Additional')
                                    // }}
                                    >
                                      {data?.privilegeSetTitle}
                                    </div>
                                  )
                                )}
                              </>
                            )
                          : (
                            <>
                              {basicForm?.privileges?.priorAdditionalPrivileges?.map(data => (
                                <div
                                  className={`${style.privilegeHeading} `}
                                // onClick={() => { setShowCurrentPrivileges(true); setCurrentPrivilegesCategory('Additional') }}
                                >{data?.privilegeSetTitle}</div>
                              ))}
                            </>
                          )}
                      </div>
                      {basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== '' && basicForm?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined && (
                        <div className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}>
                          <div className={`${style.privilegeHeadingReappointment}`}>{additionalPrivilegeChangeYesOrNo === 'No' ? 'Privileges Requested' : 'Additional Privileges Requested'}</div>
                          {additionalPrivilegeChangeYesOrNo === 'No' ? (
                            <div className={`${style.privilegeHeading}`}>None</div>
                          ) : (
                            <>
                              {/* <div className={style.privilegeHeading}>
                                Additional Privilege Requested
                              </div> */}
                              {basicForm?.privileges?.additionalPrivileges?.map(data => (
                                <div
                                  className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`} onClick={() => { setShowCurrentPrivileges(true); setCurrentPrivilegesCategory('Additional'); setSelectedPrivilege(data?.id) }}
                                >{data?.privilegeSetTitle} {(data?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? data?.descriptiveContent?.esign?.signedDate : (data?.privilegeDetails?.corePrivileges?.esign?.signedDate || data?.privilegeDetails?.nonCorePrivileges?.esign?.signedDate)) && (<span className={style.signedOnText}>Signed on {data?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? data?.descriptiveContent?.esign?.signedDate : (data?.privilegeDetails?.corePrivileges?.esign?.signedDate || data?.privilegeDetails?.nonCorePrivileges?.esign?.signedDate)}</span>)}</div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {((basicForm?.basicDetails?.existingCredentialingPrivilegeCategory !== null && basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges !== null) && (basicForm?.basicDetails?.existingCredentialingPrivilegeCategory !== null && basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges !== null && basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.length !== 0)) && (
                  <>
                    <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                      <strong>Privileges at Other Hospitals</strong>
                    </div>
                    <div className={style.twoCol}>
                      <div
                        className={`${style.privilegeContentCard} ${style.marginTop10}`}
                      >
                        <div className={style.privilegeHeadingCurrent}>Current</div>
                        <div className={style.privilegeHeading}>
                          {(basicForm?.basicDetails?.existingCredentialingPrivilegeCategory !== null && basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges !== null && basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.length !== 0)
                            ? basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.map(data => (
                              <div>{data?.privileges}</div>
                            )) : (basicForm?.basicDetails?.existingCredentialingPrivilegeCategory !== null && basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges !== null && basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.length !== 0)
                              ? basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.map(data => (
                                <div>{data?.privileges}</div>
                              ))
                              : 'None'}
                        </div>
                      </div>
                      {basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== '' && basicForm?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined && (
                        <div
                          className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                        >
                          <div className={style.privilegeHeadingReappointment}>
                            Change for Reappointment
                          </div>
                          <div className={style.privilegeHeading}>
                            <div>
                              {privilegeAtOtherHospitalYesOrNo === 'No' ? (
                                <div className={style.privilegeHeading}>None</div>
                              ) : (
                                <div>
                                  {hospitalPrivilegeSet?.map(data => (
                                    <div className={style.privilegeHeading}>{`${basicForm?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.map(priorData => priorData?.privileges)?.includes(data?.privileges) ? 'Existing: ' : 'New: '} ${data?.hospitalName} - ${data?.privileges}`}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={`${style.cardTitle} ${style.marginTop10}`}>
              Do you want to keep your current Privilege Category?
            </div>
            <>
              {privilegeChangeYesOrNo === '' ? (
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                >
                  <Tooltip title={"Click to mark as Yes"} arrow>
                    <div
                      className={`${style.reappointmentButtonOutlined}`}
                      onClick={() => { setPrivilegeChangeYesOrNo('Yes'); handleSubmitPrivilegeCategory() }}
                    >
                      YES
                    </div>
                  </Tooltip>
                  <Tooltip title={"Click to mark as No"} arrow>
                    <div
                      className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                      onClick={() => { setIsPrivilegeCategoryChanging(true); setPrivilegeChangeYesOrNo('No') }}
                    >
                      NO
                    </div>
                  </Tooltip>
                </div>
              ) : (
                <>
                  {!isPrivilegeCategoryChanging && (
                    <>
                      <div
                        className={`${style.markedAsText} ${style.marginTop10}`}
                      >
                        <strong>
                          Marked as <span className={privilegeChangeYesOrNo === 'Yes' ? style.yesText : style.noText}>{privilegeChangeYesOrNo}</span>
                        </strong>{" "}
                      </div>
                      <div
                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                      >
                        <Tooltip title={"Click to View & Modify"} arrow>
                          <div
                            className={`${style.reappointmentButtonEdit}`}
                            onClick={() => { setPrivilegeChangeYesOrNo('') }}
                          >
                            VIEW TO MODIFY
                          </div>
                        </Tooltip>
                      </div>
                    </>
                  )}
                </>
              )}
              {isPrivilegeCategoryChanging && (
                <div className={`${style.privilegeCardWithBorder} ${style.marginTop}`}>
                  <CommonTextField
                    value={privilegeCategories?.filter(data => data?.privilegeCategory?.id === selectedPrivilegeCategory)?.[0]?.privilegeCategory?.category}
                    className={style.fullWidth}
                    maxLength={50}
                    placeholder={""}
                    label={"What would you like to change your current Privilege Category to?"}
                    required={true}
                  />
                  <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                    {privilegeCategories?.map(data => {
                      let conditionBasedOnRoles = basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === ('Courtesy Staff With Admitting Privileges' || 'Courtesy Staff Without Admitting Privileges') ? ['Active'] : basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === ('Active') ? ['Affiliate', 'Associate', 'Extended Class Nursing'] : [];
                      // let isDisabled = (data?.privilegeCategory?.category === basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || conditionBasedOnRoles?.includes(data?.privilegeCategory?.category));
                      return (
                        <div className={`${style.privilegeCategoryChips} ${selectedPrivilegeCategory === data?.privilegeCategory?.id ? style.privilegeCategoryChipsSelected : ''} ${style.cursorPointer}
                      `}
                          onClick={() => {
                            setShowPrivilegeResetError(data?.inheritExistingPrivilegeSets ? false : true)
                            setSelectedPrivilegeCategory(data?.privilegeCategory?.id);
                          }}>{data?.privilegeCategory?.category}</div>
                      )
                    })}
                  </div>
                  {showPrivilegeResetError && (
                    <div
                      className={`${style.privilegeWarningPart} ${style.marginTop}`}
                    >
                      <div className={style.privilegeWarningText}>
                        Changing of the privilege category removes your current
                        granted set of privileges.
                      </div>
                      <div
                        className={`${style.marginTop10} ${style.privilegeWarningText}`}
                      >
                        You will need to request the set of privileges you would
                        like to have for the category you are changing to.
                      </div>
                    </div>
                  )}
                  {selectedPrivilegeCategory !== "" && (
                    <>
                      {privilegeCategories?.filter(
                        (data) => data?.privilegeCategory?.id === selectedPrivilegeCategory
                      )[0]?.privilegeCategory?.category === "Courtesy Staff With Admitting Privileges" && (
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
                        )}
                    </>
                  )}
                  <div
                    className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                  >
                    <Tooltip title={"Click to Update"} arrow>
                      <div
                        className={`${style.reappointmentButton} ${style.marginLeft}`}
                        onClick={() => {
                          setPrivilegeSetChangeYesOrNo('No');
                          setIsPrivilegeCategoryChanging(false);
                          handleSubmitPrivilegeCategory(true);
                          setIsEdit(false);
                        }}
                      >
                        UPDATE
                      </div>
                    </Tooltip>
                    <Tooltip title={"Click to Cancel"} arrow>
                      <div
                        className={`${style.reappointmentButtonOutlined}`}
                        onClick={() => { setIsPrivilegeCategoryChanging(false); setPrivilegeChangeYesOrNo('') }}
                      >
                        CANCEL
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </>
            <>
              <div className={`${style.cardTitle} ${style.marginTop}`}>
                Confirm your Department / Division or Specialty for this Reappointment?
              </div>
              {(departmentChangeYesOrNo === '' || !basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated) ? (
                // <div
                //   className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                // >
                //   <div
                //     className={`${style.reappointmentButtonOutlined}`}
                //     onClick={() => { setDepartmentChangeYesOrNo('Yes'); setIsDepartmentChanging(true) }}
                //   >
                //     YES
                //   </div>
                //   <div
                //     className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                //     onClick={() => setDepartmentChangeYesOrNo('No')}
                //   >
                //     NO
                //   </div>
                // </div>
                <>
                  <div
                    className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                  >
                    <div>
                      <div className={`${style.lableStyle}`}>
                        {'Department / Division or Specialty'}
                      </div>
                      {/* <DatalistInput
                        items={getDeptItems(departmentList) || []}
                        onSelect={(item) => {
                          console.log('setDept', item.id, item.specialityId, item)
                          setSelectedDepartment(item.id)
                          setSelectedSpeciality(item.specialityId)
                          setSelectedValue('NA');
                        }}
                        className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                        maxLength={50}
                        // onChange={(e) => {
                        //   console.log(e.target.value, 'setDept')
                        //   setSelectedDepartment(e.target.value);
                        // }}
                        placeholder={'Enter Department Name'}
                        value={getDeptItems(departmentList)?.filter(data => data?.id === selectedDepartment && data?.specialityId === selectedSpeciality)?.[0]?.value}
                        // value={
                        //   getDeptItems(departmentList)?.find(
                        //     (data) => data?.id === selectedDepartment || data?.departmentId === selectedDepartment
                        //   )?.value || ''
                        // }
                        required={true}
                      /> */}

                      <DatalistInput
                        items={getDeptItems(departmentList) || []}
                        onSelect={(item) => {
                          console.log('Selected item:', item);
                          if (item.specialityId !== "") {
                            setSelectedDepartment(item.departmentId);
                            setSelectedSpeciality(item.specialityId);
                          } else {
                            setSelectedDepartment(item.id);
                            setSelectedSpeciality("");
                          }
                        }}
                        className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                        maxLength={50}
                        placeholder={'Enter Department Name'}
                        value={getDeptItems(departmentList)?.find(data =>
                        (data?.specialityId !== "" ? data?.id === selectedDepartment && data?.specialityId === selectedSpeciality
                          : data?.id === selectedDepartment)
                        )?.value || ''}
                        required={true}
                      />
                      {departmentList?.some(department => department.id === selectedDepartment) && (
                        departmentList.find(department => department.id === selectedDepartment)?.serviceAreas?.some(
                          (serviceArea) => serviceArea.id === selectedSpeciality && serviceArea.regionalCallResponsibilitiesApplicable
                        ) ? (
                          <div className={`${style.alignLeft} ${style.marginTop}`}>
                            <div className={`${style.lableStyle}`}>
                              {formData?.properties?.regionalCallResponsibilities?.description}
                            </div>
                            <div className={`${style.marginTop10}`}>
                              <CommonRadio
                                value={selectedValue}
                                onChange={(e) => setSelectedValue(e.target.value)}
                                radioValue={['YES', 'NO']}
                                label={['Yes', 'No']}
                              />
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>
                    <div className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}>
                      <Tooltip title={(!basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated ? (selectedDepartment === prevDepartment && selectedSpeciality === prevSpeciality) : (selectedDepartment === departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.id && selectedSpeciality === (basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty !== null ? departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.serviceAreas?.filter(specialtyData => specialtyData?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty)?.[0]?.id : undefined))) ? "Click to Confirm" : "Click to Update"} arrow>
                        <div
                          className={`${style.reappointmentButton} ${style.marginLeft}
                        ${(departmentList?.some(department => department.id === selectedDepartment) && (
                              departmentList.find(department => department.id === selectedDepartment)?.serviceAreas?.some(
                                (serviceArea) => serviceArea.id === selectedSpeciality && serviceArea.regionalCallResponsibilitiesApplicable
                              )) && selectedValue === "NA") ? style.disabled : ''}`}
                          onClick={
                            (departmentList?.some(department => department.id === selectedDepartment) && (
                              departmentList.find(department => department.id === selectedDepartment)?.serviceAreas?.some(
                                (serviceArea) => serviceArea.id === selectedSpeciality && serviceArea.regionalCallResponsibilitiesApplicable
                              )) && selectedValue === "NA") ? () => { } :
                              () => {
                                setDepartmentChangeYesOrNo((!basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated ? (selectedDepartment === prevDepartment && selectedSpeciality === prevSpeciality) : (selectedDepartment === departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.id && selectedSpeciality === (basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty !== null ? departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.serviceAreas?.filter(specialtyData => specialtyData?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty)?.[0]?.id : undefined))) ? 'Yes' : 'No');
                                setIsDepartmentChanging(false);
                                if ((!basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated ? (selectedDepartment === prevDepartment && selectedSpeciality === prevSpeciality) : (selectedDepartment === departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.id && selectedSpeciality === (basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty !== null ? departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.serviceAreas?.filter(specialtyData => specialtyData?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty)?.[0]?.id : undefined)))) {
                                  handleSubmitDepartment()
                                } else {
                                  handleSubmitDepartment(true)
                                }
                              }}
                        >
                          {(!basicForm?.forms?.[formIndex]?.data?.departmentChangeUpdated ? (selectedDepartment === prevDepartment && selectedSpeciality === prevSpeciality) : (selectedDepartment === departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.id && selectedSpeciality === (basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty !== null ? departmentList?.filter(data => data?.departmentName?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.department)?.[0]?.serviceAreas?.filter(specialtyData => specialtyData?.name === basicForm?.basicDetails?.priorDepartmentSpecialty?.specialty)?.[0]?.id : undefined))) ? 'CONFIRM' : 'UPDATE'}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* {!isDepartmentChanging ? ( */}
                  <>
                    <div
                      className={`${style.markedAsText} ${style.marginTop10}`}
                    >
                      <strong>
                        Marked as{" "}
                        <span className={departmentChangeYesOrNo === 'Yes' ? style.yesText : style.noText}>{departmentChangeYesOrNo === 'Yes' ? 'Same as Before' : 'Changed'}</span>
                      </strong>{" "}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                    >
                      <Tooltip title={"Click to View & Modify"} arrow>
                        <div
                          className={`${style.reappointmentButtonEdit}`}
                          onClick={() => setDepartmentChangeYesOrNo('')}
                        >
                          VIEW TO MODIFY
                        </div>
                      </Tooltip>
                    </div>
                  </>
                  {/* ) : (
                    <>
                      <div
                        className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                      >
                        <div>
                          <div className={`${style.lableStyle}`}>
                            {'Department / Division or Specialty'}
                          </div>
                          <DatalistInput
                            items={getDeptItems(departmentList) || []}
                            onSelect={(item) => {
                              setSelectedDepartment(item.id)
                              setSelectedSpeciality(item.specialityId)
                            }}
                            className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                            maxLength={50}
                            onChange={(e) => {
                              setSelectedDepartment(e.target.value);
                            }}
                            placeholder={'Enter Department Name'}
                            // value={getDeptItems(departmentList)?.filter(data => data?.departmentId ? data?.departmentId === selectedDepartment : data?.id === selectedDepartment)?.[0]?.data?.value}
                            value={
                              getDeptItems(departmentList)?.find(
                                (data) => data?.id === selectedDepartment || data?.departmentId === selectedDepartment
                              )?.value || ''
                            }
                            required={true}
                          />
                          {departmentList?.some(department => department.id === selectedDepartment && department.regionalCallResponsibilitiesApplicable) && (
                            <div className={`${style.alignLeft} ${style.marginTop10}`}>
                              <div className={`${style.lableStyle}`}>{formData?.properties?.regionalCallResponsibilities?.label}</div>
                              <div className={`${style.marginTop10}`}>
                                <CommonRadio
                                  value={selectedValue}
                                  onChange={(e) => setSelectedValue(e.target.value)}
                                  radioValue={['NO', 'YES']}
                                  label={formData?.properties?.regionalCallResponsibilities?.properties?.regionalCallResponsibilities?.enum}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                        >
                          <div
                            className={`${style.reappointmentButton} ${style.marginLeft}`}
                            onClick={() => {
                              setIsDepartmentChanging(false);
                              handleDeptSubmit();
                            }}
                          >
                            UPDATE
                          </div>
                          <div
                            className={`${style.reappointmentButtonOutlined}`}
                            onClick={() => { setIsDepartmentChanging(false); setDepartmentChangeYesOrNo('') }}
                          >
                            CANCEL
                          </div>
                        </div>
                      </div>
                    </>
                  )} */}
                </>
              )}
            </>
            {basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory !== ('Courtesy Staff With Admitting Privileges' || 'Courtesy Staff Without Admitting Privileges') && (
              <>
                {(
                  basicForm?.privileges?.priorObligatedPrivileges?.length === 0 &&
                  basicForm?.privileges?.obligatedPrivileges?.length === 0) ? (
                  <>
                    <div className={`${style.cardTitle} ${style.marginTop}`}>
                      Select and confirm the Privileges you would like to request.
                    </div>
                    <div
                      className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                    >
                      <div className={style.displayInRow}>
                        <div className={style.lableStyle}>Your Department / Division or Speciality : </div>
                        <div className={`${style.lableStyle} ${style.marginLeft}`}><strong>{`${departmentList?.filter((data) => data?.id === selectedDepartment)?.[0]?.departmentName?.name} ${(basicForm?.basicDetails?.departmentSpecialty?.specialty !== "" && basicForm?.basicDetails?.departmentSpecialty?.specialty !== undefined && basicForm?.basicDetails?.departmentSpecialty?.specialty !== null) ? '-' : ''} ${(basicForm?.basicDetails?.departmentSpecialty?.specialty !== "" && basicForm?.basicDetails?.departmentSpecialty?.specialty !== undefined && basicForm?.basicDetails?.departmentSpecialty?.specialty !== null) ? basicForm?.basicDetails?.departmentSpecialty?.specialty : ''}`}</strong></div>
                      </div>
                      <>
                        {staffPrivilege !== undefined && staffPrivilege?.map((data, index) => (
                          <>
                            <Tooltip title={selectedPrivilegesForDisplayMultiple?.map((data) => data?.id)?.includes(data?.id) ? "Click to Remove" : "Click to Request and Sign"} arrow>
                              <div
                                className={`${style.privilegeConfirmationGrid} ${style.marginTop}`}
                                onClick={selectedPrivilegesForDisplayMultiple
                                  ?.map((data) => data?.id)
                                  ?.includes(data?.id) ? () => {
                                    handleDeleteSelectedPrrivilege(data?.id)
                                  } : () => {
                                    setIsHistoricalSign(true);
                                    setShowPrivileges(true);
                                    handleChange(data?.id);
                                    ((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL !== undefined || basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text !== undefined) ? !isHistoricalSign ? setIsShowESignConfirmationDialog(true) : setIsShowESignConfirmationDialog(false) : setIsShowESignDialog(true))
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
                                  </div>
                                )}
                                <div className={style.privilegeHeading}>
                                  {data?.privilegeSetTitle}
                                </div>
                                {selectedPrivilegesForDisplayMultiple
                                  ?.map((data) => data?.id)
                                  ?.includes(data?.id) ? (
                                  <div className={`${style.displayInRow} ${style.floatRight}`}>
                                    <span className={style.signedOnText}>Signed on {selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate || selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.nonCorePrivileges?.esign?.signedDate}</span>
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
                                  >  SELECT
                                  </button>
                                )}
                              </div>
                            </Tooltip>
                            {index !== staffPrivilege?.length - 1 && (
                              <CommonDivider />
                            )}
                          </>
                        ))}
                      </>

                      <div
                        className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                      >
                        <div
                          className={`${style.reappointmentButton} ${style.marginLeft}`}
                          onClick={() => {
                            setIsEditPrivilege(false);
                            setIsUpdateClicked(true);
                            handleSubmit();
                          }}
                        >
                          SAVE
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`${style.cardTitle} ${style.marginTop}`}>
                      Do you want to keep your current Privilege Set(s)?
                    </div>
                    {privilegeSetChangeYesOrNo === '' ? (
                      <div
                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                      >
                        <Tooltip title={"Click to mark as Yes"} arrow>
                          <div
                            className={`${style.reappointmentButtonOutlined}`}
                            // onClick={() => handleSubmitPrivilegeSet()}
                            onClick={() => {
                              setShowPrivileges(true);
                              setPrivilegeSetChangeYesOrNo('Yes');
                              // handleChange(data?.id);
                            }}
                          >
                            YES
                          </div>
                        </Tooltip>
                        <Tooltip title={"Click to mark as No"} arrow>
                          <div
                            className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                            onClick={() => handleKeepYourPrivilegeNo()}
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
                    {isPrivilegeSetChanging && (
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
                            <div className={`${style.lableStyle} ${style.marginLeft}`}><strong>{`${departmentList?.filter((data) => data?.id === selectedDepartment)?.[0]?.departmentName?.name} ${(basicForm?.basicDetails?.departmentSpecialty?.specialty !== "" && basicForm?.basicDetails?.departmentSpecialty?.specialty !== undefined && basicForm?.basicDetails?.departmentSpecialty?.specialty !== null) ? '-' : ''} ${(basicForm?.basicDetails?.departmentSpecialty?.specialty !== "" && basicForm?.basicDetails?.departmentSpecialty?.specialty !== undefined && basicForm?.basicDetails?.departmentSpecialty?.specialty !== null) ? basicForm?.basicDetails?.departmentSpecialty?.specialty : ''}`}</strong></div>
                          </div>
                          <>
                            {staffPrivilege?.map((data, index) => (
                              <>
                                <Tooltip title={selectedPrivilegesForDisplayMultiple?.map((data) => data?.id)?.includes(data?.id) ? "Click to Remove" : "Click to Request and Sign"} arrow>
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
                                        <span className={`${style.signedOnText} ${style.verticalAlignCenter}`}>Signed on {selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.descriptiveContent?.esign?.signedDate : (selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate || selectedPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.nonCorePrivileges?.esign?.signedDate)}</span>
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
                            <Tooltip title={"Click to Close"} arrow>
                              <div
                                className={`${style.reappointmentButtonOutlined}`}
                                onClick={() => { setIsPrivilegeSetChanging(false); setPrivilegeSetChangeYesOrNo('') }}
                              >
                                CLOSE
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
                  Would you like to request any additional set of Privileges?
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
                                if (matchedItem.specialityId !== "") {
                                  setSelectedAdditionalDepartment(matchedItem.departmentId);
                                  setSelectedAdditionalSpeciality("");
                                } else {
                                  setSelectedAdditionalDepartment(matchedItem.id);
                                  setSelectedAdditionalSpeciality(matchedItem.specialityId);
                                }
                              } else {
                                setSelectedAdditionalDepartment("");
                                setSelectedAdditionalSpeciality("");
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
                              <Tooltip title={selectedAdditionalPrivilegesForDisplayMultiple?.map(data => data?.id)?.includes(data?.id) ? "Click to Remove" : "Click to Request and Sign"} arrow>
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
                                      <span className={`${style.signedOnText} ${style.verticalAlignCenter}`}>Signed on {selectedAdditionalPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? selectedAdditionalPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.descriptiveContent?.esign?.signedDate : (selectedAdditionalPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate || selectedAdditionalPrivilegesForDisplayMultiple?.filter((privilegeSet) => privilegeSet?.id === data?.id)?.[0]?.privilegeDetails?.nonCorePrivileges?.esign?.signedDate)}</span>
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
                      <Tooltip title={"Click to Close"} arrow>
                        <div
                          className={`${style.reappointmentButtonOutlined}`}
                          onClick={() => { setAdditionalPrivilegeChangeYesOrNo(''); setIsAdditionalPrivilegeCategoryChanging(false); }}
                        >
                          CLOSE
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                )}
              </>
            )}
            <div>
              <div className={`${style.cardTitle} ${style.marginTop}`}>
                Do you maintain Privileges at Other Hospital(s)?
              </div>
              <div className={style.twoCol}>
                <div>
                  <div>
                    {(privilegeAtOtherHospitalYesOrNo === '') ? (
                      <div
                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                      >
                        <Tooltip title={"Click to mark as Yes"} arrow>
                          <div
                            className={`${style.reappointmentButtonOutlined}`}
                            onClick={() => { setPrivilegesMaintainedInOtherHositals(true); setPrivilegeAtOtherHospitalYesOrNo('Yes') }}
                          >
                            YES
                          </div>
                        </Tooltip>
                        <Tooltip title={"Click to mark as No"} arrow>
                          <div
                            className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                            onClick={() => { setIsEditPrivilegeAtOtherHospitals(false); setPrivilegeAtOtherHospitalYesOrNo('No'); handleSubmitPrivilegesAtOtherHospital() }}
                          >
                            NO
                          </div>
                        </Tooltip>
                      </div>
                    ) : (
                      <>
                        {!privilegesMaintainedInOtherHositals && (
                          <>
                            <div
                              className={`${style.markedAsText} ${style.marginTop10}`}
                            >
                              <strong>
                                Marked as{" "}
                                <span className={privilegeAtOtherHospitalYesOrNo === 'Yes' ? style.yesText : style.noText}>{privilegeAtOtherHospitalYesOrNo}</span>
                              </strong>{" "}
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                            >
                              <Tooltip title={"Click to View & Modify"} arrow>
                                <div
                                  className={`${style.reappointmentButtonEdit}`}
                                  onClick={() => { setIsEditPrivilegeAtOtherHospitals(true); setPrivilegesMaintainedInOtherHositals(false); setPrivilegeAtOtherHospitalYesOrNo('') }}
                                >
                                  VIEW TO MODIFY
                                </div>
                              </Tooltip>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  {privilegeAtOtherHospitalYesOrNo === "No" && (basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === "Courtesy Staff With Admitting Privileges" || basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory === "Courtesy Staff Without Admitting Privileges") && (
                    <div className={`${style.privilegeWarningPart}`}>
                      <div className={style.privilegeWarningText}>
                        You cannot hold courtesy privileges at {title}{" "}
                        without having privileges at another
                        hospital.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {privilegesMaintainedInOtherHositals && (
              <>
                <div
                  className={`${style.privilegeCardWithBorder} ${style.marginTop10}`}
                >
                  <div className={style.marginTop}>
                    {/* <CommonTextField
                      value={hospitalName}
                      className={style.fullWidth}
                      onChange={(e) =>
                        setHospitalName(e.target.value)
                      }
                      maxLength={50}
                      placeholder={"Enter Hospital Name"}
                      label={"Hospital Name"}
                      required={true}
                    /> */}
                    <div>
                      <div className={`${style.lableStyle}`}>
                        {'Hospital Name*'}
                      </div>
                      <DatalistInput
                        items={getItems(hospitalMaster) || []}
                        onSelect={(item) => {
                          setHospitalName(item.value)
                        }}
                        className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                        maxLength={50}
                        onChange={(e) => {
                          setHospitalName(e.target.value);
                        }}
                        placeholder={'Enter Hospital Name'}
                        value={hospitalName}
                        required={true}
                      />
                    </div>
                    <div className={`${style.lableStyle} ${style.marginTop}`}>
                      Privilege Category you have at the Other Hospital
                    </div>
                    <CommonSelectField
                      value={hospitalPrivilege}
                      onChange={(e) => {
                        let selectedPrivilegeCategoriesAtOtherHospitals = privilegeCategoriesAtOtherHospitals?.filter(data => e?.target?.value === data?.category)?.[0];
                        setHospitalPrivilege(selectedPrivilegeCategoriesAtOtherHospitals?.category);
                        setHospitalPrivilegeCategory({
                          "id": selectedPrivilegeCategoriesAtOtherHospitals?.id,
                          "name": selectedPrivilegeCategoriesAtOtherHospitals?.category,
                          "type": selectedPrivilegeCategoriesAtOtherHospitals?.type
                        })
                      }}
                      className={style.fullWidth}
                      valueList={privilegeCategoriesAtOtherHospitals?.map(data => data?.category)}
                      labelList={privilegeCategoriesAtOtherHospitals?.map(data => data?.category)}
                      disabledList={privilegeCategoriesAtOtherHospitals?.map(data => false)}
                      disabledSelect={false}
                      label={""}
                    // required={true}
                    />
                    <div className={`${style.chipsContainer} ${style.marginTop}`}>
                      {privilegeCategoriesAtOtherHospitals?.map(data => (
                        <div className={`${style.privilegeCategoryChips} ${hospitalPrivilege === data?.category ? style.privilegeCategoryChipsSelected : ''} 
                        ${style.cursorPointer}
                         `}
                          onClick={() => {
                            setHospitalPrivilege(data?.category);
                            setHospitalPrivilegeCategory({
                              "id": data?.id,
                              "name": data?.category,
                              "type": data?.type
                            })
                          }}
                        >{data?.category}</div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                  >
                    <Tooltip title={"Click to Save and Close"} arrow>
                      <button
                        className={`${style.reappointmentButton} ${style.marginLeft
                          } ${(hospitalName === "" || hospitalPrivilege === "")
                            ? style.disabledButton
                            : ''
                          }`}
                        onClick={
                          (hospitalName === "" || hospitalPrivilege === "")
                            ? () => { }
                            : () => {
                              setIsPrivilegeSetChanging(false);
                              setIsEditPrivilegeAtOtherHospitals(true);
                              setPrivilegesMaintainedInOtherHositals(false)
                              setIsUpdateClicked(true);
                              handleSubmitPrivilegesAtOtherHospital(true)
                            }
                        }
                        disabled={hospitalName === "" || hospitalPrivilege === ""}
                      >
                        SAVE & CLOSE
                      </button>
                    </Tooltip>
                    <Tooltip title={"Click to Save and Addmore"} arrow>
                      <button
                        className={`${style.reappointmentButton} ${style.marginLeft
                          } ${(hospitalName === "" || hospitalPrivilege === "")
                            ? style.disabledButton
                            : ''
                          }`}
                        onClick={
                          (hospitalName === "" || hospitalPrivilege === "")
                            ? () => { }
                            : () => {
                              setIsPrivilegeSetChanging(false);
                              setIsEditPrivilegeAtOtherHospitals(false);
                              setIsUpdateClicked(true);
                              handleSubmitPrivilegesAtOtherHospital(true)
                            }
                        }
                        disabled={hospitalName === "" || hospitalPrivilege === ""}
                      >
                        SAVE & ADD MORE
                      </button>
                    </Tooltip>
                    <Tooltip title={"Click to Cancel"} arrow>
                      <div
                        className={`${style.reappointmentButtonOutlined}`}
                        onClick={() => { setPrivilegesMaintainedInOtherHositals(false); setIsEditPrivilegeAtOtherHospitals(false); setHospitalName(''); setHospitalPrivilege(''); setHospitalPrivilegeCategory(''); setPrivilegeAtOtherHospitalYesOrNo(hospitalPrivilegeSet?.length !== 0 ? 'Yes' : '') }}
                      >
                        CANCEL
                      </div>
                    </Tooltip>
                  </div>
                  {hospitalPrivilegeSet?.length > 0 && (
                    <CommonDivider />
                  )}
                  {hospitalPrivilegeSet?.map((data, index) => (
                    <div className={`${style.hospitalPrivilegeSetGrid} ${style.marginTop}`}>
                      <div className={`${style.lableStyle} ${style.cursorPointer}`} onClick={() => { handleEditPrivilegesAtOtherHospital(data, index) }}>{data?.hospitalName}</div>
                      <div className={`${style.lableStyle} ${style.cursorPointer} ${style.primaryColor}`}>{data?.privileges}</div>
                      <img
                        src={DeleteIcon}
                        alt=""
                        className={`${style.docTypeImgStyle} ${style.marginLeft}`}
                        onClick={() => {
                          setHospitalPrivilegeSet(hospitalPrivilegeSet?.filter(privilegeData => data?.hospitalName !== privilegeData?.hospitalName));
                          setIsSubmit(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className={style.threeColForButton}>
            <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
              <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div></Tooltip>
            <Tooltip title={isContinueEnabled ? "Click to Proceed to the Next Step" : ""} arrow>
              <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleContinue()}>CONTINUE</div></Tooltip>
          </div>
        </div>
        <div>

          <div>
            {!showInfo && (
              <div>
                <div className={`${style.toggleButton} ${isShowESignDialog || isShowESignConfirmationDialog || isOpen || isAlertOpen || isSaveInProgressOpen || showJourneyDialog
                  || showPaymentDialog || showAdditionalPrivilegesForSign || showPrivilegesForSign || showCurrentPrivileges ||
                  showAdditionalPrivileges || showPrivileges ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                  <MenuIcon className={style.toggleIcon} />
                </div>
                <div className={`${style.headerData} ${isShowESignDialog || isShowESignConfirmationDialog || isOpen || isAlertOpen || isSaveInProgressOpen || showJourneyDialog
                  || showPaymentDialog || showAdditionalPrivilegesForSign || showPrivilegesForSign || showCurrentPrivileges ||
                  showAdditionalPrivileges || showPrivileges ? style.hidden : ""}`}>
                  <span style={{ marginLeft: '20px' }}>Confirm Your Privilege Category</span>
                </div>
              </div>
            )}

            <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
              <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
              <ApplicationUserCard
                user={"First Mi Last"}
                applyingFor={"{Doctor} Applying As {Associate}"}
              />
              <div className={style.marginTop}>
                <ApplicationAssistanceCard
                  user={"Neena Greenly"}
                  designation={"{Designation}"}
                  contactNumber={"{Contact Number}"}
                  email={"{Email}"}
                />
              </div>
            </div>
          </div>

          <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showJourneyDialog
            ? style.hiddenStickyContainer : ""}`}>
            <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
              <div
                className={`${style.saveInProgress} ${style.marginTop}`}
                onClick={() => getIsSaveInProgressOpen(true)}
              >
                SAVE IN PROGRESS
              </div>
            </Tooltip>
            {/* <div className={style.twoColForButton}>
              <div
                className={`${style.continue} ${style.marginTop10}`}
                onClick={() => navigate(-1)}
              >
                BACK
              </div> */}
            <Tooltip title={"Click to Proceed to the Next Step"} arrow>
              <div
                className={`${style.continue} ${style.marginTop10} ${!isContinueEnabled ? style.disabledButton : ''}`}
                onClick={isContinueEnabled ? () => {
                  handleContinueClick()
                } : () => { }}
              >
                CONTINUE
              </div>
            </Tooltip>
            {/* </div> */}
          </div>
        </div>
      </div >
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
              <div className={style.heading}>Privilege Set Requested</div>
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
                  className={`${style.reappointmentButton} ${style.marginLeft} ${(
                    selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                      (selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign)
                      : (((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.esign !== null &&
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== undefined) ||
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.length ===
                        0 ||
                        (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges?.length === 0 &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.restrictedPrivileges?.privilegesByCategories?.[0]
                            ?.privileges?.length !== undefined)) &&
                        ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== undefined) ||
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                          (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                            ?.length === 0 &&
                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.privilegesByCategories?.[0]
                              ?.privileges?.length !== undefined)) &&
                        ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign !== undefined) ||
                          !selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.length ||
                          (selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) &&
                        getIsRestrictedValuesFilled(selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges)))
                    ? ""
                    : style.disabledButton
                    }`}
                  onClick={
                    (selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                      (selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign)
                      : (((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.esign !== null &&
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== undefined) ||
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.length ===
                        0 ||
                        (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges?.length === 0 &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.restrictedPrivileges?.privilegesByCategories?.[0]
                            ?.privileges?.length !== undefined)) &&
                        ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== undefined) ||
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                          (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                            ?.length === 0 &&
                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.privilegesByCategories?.[0]
                              ?.privileges?.length !== undefined)) &&
                        ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign !== undefined) ||
                          !selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.length ||
                          (selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) &&
                        getIsRestrictedValuesFilled(selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges)))
                      ? () => {
                        setShowPrivileges(false);
                        handleSelectedPrivilegesForDisplayMultiple(
                          selectedPrivilegeForDisplay[0]
                        );
                      }
                      : () => { }
                  }
                  disabled={
                    !(selectedPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                      (selectedPrivilegeForDisplay?.[0]?.descriptiveContent?.esign)
                      : ((((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null &&
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) ||
                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length === 0 ||
                        (selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) &&
                        ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== null &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) ||
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.length === 0 ||
                          (selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) &&
                        ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.esign != null &&
                          selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.esign !== undefined) ||
                          !selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.length ||
                          (selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined))) &&
                        getIsRestrictedValuesFilled(selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges)))
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
        isOpen={showAdditionalPrivileges}
        onClose={() => setShowAdditionalPrivileges(false)}
        className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div>
          <div className={Classes.DIALOG_BODY}>
            <div className={style.spaceBetween}>
              <div className={style.heading}>Privilege Set Requested</div>
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
                  className={`${style.reappointmentButton} ${style.marginLeft}
                 ${(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                      (selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign)
                      : (((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.esign !== null &&
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== undefined) ||
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.length ===
                        0 ||
                        (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges?.length === 0 &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.restrictedPrivileges?.privilegesByCategories?.[0]
                            ?.privileges?.length !== undefined)) &&
                        ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== undefined) ||
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                          (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                            ?.length === 0 &&
                            selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.privilegesByCategories?.[0]
                              ?.privileges?.length !== undefined)) &&
                        ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign !== undefined) ||
                          !selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.length ||
                          (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                            selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) &&
                        getIsAdditionalRestrictedValuesFilled(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges)))
                      ? ""
                      : style.disabledButton
                    }`}
                  onClick={
                    (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                      (selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign)
                      : (((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.esign !== null &&
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.esign !== undefined) ||
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.length ===
                        0 ||
                        (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges?.length === 0 &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.restrictedPrivileges?.privilegesByCategories?.[0]
                            ?.privileges?.length !== undefined)) &&
                        ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== null &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.esign !== undefined) ||
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                          (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                            ?.length === 0 &&
                            selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                              ?.corePrivileges?.privilegesByCategories?.[0]
                              ?.privileges?.length !== undefined)) &&
                        ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign != null &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.nonCorePrivileges?.esign !== undefined) ||
                          !selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.length ||
                          (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                            selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) &&
                        getIsAdditionalRestrictedValuesFilled(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges)))
                      ? () => {
                        setShowAdditionalPrivileges(false);
                        handleSelectedAdditionalPrivilegesForDisplayMultiple(
                          selectedAdditionalPrivilegeForDisplay[0]
                        );
                      }
                      : () => { }
                  }
                  disabled={!(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                    (selectedAdditionalPrivilegeForDisplay?.[0]?.descriptiveContent?.esign)
                    : ((((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                      ?.restrictedPrivileges?.esign !== null &&
                      selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.esign !== undefined) ||
                      selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.privilegesByCategories?.length ===
                      0 ||
                      (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                        ?.privileges?.length === 0 &&
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.restrictedPrivileges?.privilegesByCategories?.[0]
                          ?.privileges?.length !== undefined)) &&
                      ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.corePrivileges?.esign !== null &&
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.esign !== undefined) ||
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                        (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                          ?.length === 0 &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                            ?.corePrivileges?.privilegesByCategories?.[0]
                            ?.privileges?.length !== undefined)) &&
                      ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.nonCorePrivileges?.esign != null &&
                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                          ?.nonCorePrivileges?.esign !== undefined) ||
                        !selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.length ||
                        (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 &&
                          selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined))) &&
                      getIsAdditionalRestrictedValuesFilled(selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                        ?.privileges)))
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
      <Dialog
        isOpen={showPrivilegesForSign}
        onClose={() => setShowPrivilegesForSign(false)}
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
                    setShowPrivilegesForSign(false);
                    setPrivilegeSetChangeYesOrNo('')
                    setIndexForSign(0);
                  }}
                />
              </div>
            </div>
            {/* {basicForm?.privileges?.obligatedPrivileges?.map((data, index) => ( */}
            <div>{getFieldsForSign(selectedPrivilegeForDisplay?.[indexForSign]?.id, indexForSign, selectedPrivilegeForDisplay?.[indexForSign])}</div>
            {/* ))} */}
            <div
              className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop10}`}
            >
              <button
                className={`${style.reappointmentButton} ${style.marginLeft} 
                ${((selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.esign !== null &&
                    selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.restrictedPrivileges?.esign !== undefined) ||
                    selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.restrictedPrivileges?.privilegesByCategories?.length ===
                    0 ||
                    (selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.restrictedPrivileges?.privilegesByCategories?.[0]
                      ?.privileges?.length === 0 &&
                      selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                        ?.privileges?.length !== undefined)) &&
                    ((selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.corePrivileges?.esign !== null &&
                      selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.esign !== undefined) ||
                      selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                      (selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                        ?.length === 0 &&
                        selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                          ?.corePrivileges?.privilegesByCategories?.[0]
                          ?.privileges?.length !== undefined))
                    ? ""
                    : style.disabledButton
                  }`}
                onClick={
                  ((selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.esign !== null &&
                    selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.restrictedPrivileges?.esign !== undefined) ||
                    selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.restrictedPrivileges?.privilegesByCategories?.length ===
                    0 ||
                    (selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.restrictedPrivileges?.privilegesByCategories?.[0]
                      ?.privileges?.length === 0 &&
                      selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                        ?.privileges?.length !== undefined)) &&
                    ((selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.corePrivileges?.esign !== null &&
                      selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.esign !== undefined) ||
                      selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                      (selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                        ?.length === 0 &&
                        selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                          ?.corePrivileges?.privilegesByCategories?.[0]
                          ?.privileges?.length !== undefined))
                    ? selectedPrivilegeForDisplay?.length === indexForSign + 1 ? () => {
                      setShowPrivilegesForSign(false);
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
                disabled={!(((selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                  ?.restrictedPrivileges?.esign !== null &&
                  selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.esign !== undefined) ||
                  selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.length ===
                  0 ||
                  (selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                    ?.privileges?.length === 0 &&
                    selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.restrictedPrivileges?.privilegesByCategories?.[0]
                      ?.privileges?.length !== undefined)) &&
                  ((selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                    ?.corePrivileges?.esign !== null &&
                    selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.corePrivileges?.esign !== undefined) ||
                    selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                    (selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                      ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                      ?.length === 0 &&
                      selectedPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                        ?.corePrivileges?.privilegesByCategories?.[0]
                        ?.privileges?.length !== undefined))
                )}
              >
                {selectedPrivilegeForDisplay?.length === indexForSign + 1 ? `CONTINUE` : 'NEXT'}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
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
            {/* {basicForm?.privileges?.obligatedPrivileges?.map((data, index) => ( */}
            <div>{getFieldsForSign(selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.id, indexForSign, selectedAdditionalPrivilegeForDisplay?.[indexForSign])}</div>
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
      {
        showPaymentDialog && (
          <PaymentDialog
            getIsOpen={getIsShowPaymentDialog}
            continueClickFunc={handleContinue}
            paymentListData={paymentListData}
            applicantName={`${basicForm?.applicant?.name?.firstName}_${basicForm?.applicant?.name?.lastName}`}
          />
        )
      }
      {
        showJourneyDialog && (
          <ReappointmentJourneyDialog
            getIsOpen={getIsShowReappointmentJourneyDialog}
            title={`You've Started Your Reappointment Journey. Let's See How Long It Takes You!`}
            img={JourneyStep1}
            formIndex={formIndex}
            basicForm={basicForm}
            continueClick={handleContinue}
          />
        )
      }
      {
        isSaveInProgressOpen && (
          <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
        )
      }
      {
        isAlertOpen && (
          <AlertDialog
            isOpen={isAlertOpen}
            getIsOpen={getIsAlertOpen}
            title={"Are you sure?"}
            description={"Do you want to really change the privilege set?"}
          />
        )
      }
      {
        isOpen && (
          <AdditionalPrivilegesDialog
            getIsOpen={getIsOpen}
            primaryPrivilege={selectedPrivilege}
            getSelectedPrivilegeList={getSelectedPrivilegeList}
            basicForm={basicForm}
            selectedAdditionalPrivilegeForEdit={
              selectedAdditionalPrivilegeForEdit
            }
            applicationId={applicationId}
          />
        )
      }
      {
        isShowESignConfirmationDialog && (
          <ESignConfirmationDialog
            getIsOpen={getIsOpenESignConfirmation}
            tempValue={basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data === null ? { setUpYourSignature: {}, table: [] } : basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data}
            baseKey={"setUpYourSignature"}
            applicationId={applicationId}
            basicForm={basicForm}
            setBasicForm={setBasicForm}
            updateFunc={updateFunc}
            confirmFunc={confirmESign}
            hideCross={true}
          />
        )
      }
      {
        isShowESignDialog && (
          <ESignDialog
            getIsOpen={getIsOpenESignDialog}
            tempValue={basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data === null ? { setUpYourSignature: {}, table: [] } : basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data}
            baseKey={"setUpYourSignature"}
            applicationId={applicationId}
            basicForm={basicForm}
            setBasicForm={setBasicForm}
            getPreApplication={getPreApplication}
            hideCross={true}
          >
            {uploadFormSchema !== undefined &&
              "setUpYourSignature" in uploadFormSchema?.properties && (
                <ApplicationFieldCard
                  object={uploadFormSchema?.properties?.setUpYourSignature}
                  gridStyle={style.twoCol}
                  baseKey={"setUpYourSignature"}
                  basicForm={basicForm}
                  setBasicForm={setBasicForm}
                  stepPath={`forms[${basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')}].data`}
                  setIsEdited={() => { }}
                />
              )}
          </ESignDialog>
        )
      }
    </div >
  );
};

export default PrivilegeSelection;
