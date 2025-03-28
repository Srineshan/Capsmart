
import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Icon, Intent, Dialog, Classes } from "@blueprintjs/core";
import FileImg from "./../../images/fileImg.png";
import WritingFile from "./../../images/writingFile.png";
import CompletedIcon from "./../../images/completedIcon.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import RedWarning from "./../../images/redWarning.png";
import Verified from "./../../images/verifiedImage.png";
import CrossPink from "./../../images/crossPink.png";
import ToBeVerified from "./../../images/toBeVerifiedImage.png";
import DeleteIcon from "./../../images/deleteHcRow.png";
import Tooltip from "@mui/material/Tooltip";
import { DELETE, TenantID, GET, PUT, POST } from "../../Screens/dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { formatFirstNameLastName } from "./../../utils/formatting";
import "react-datalist-input/dist/styles.css";
import Alert from "../../Components/AlertPopUp";
// import PdfDoc from './../../images/pdfDoc.png';
import PdfDoc from './../../images/PDFDocs.png';
// import ImgDoc from './../../images/imgDoc.png';
import ImgDoc from './../../images/imgDocs.png';
import BlueSign from "./../../images/blueSign.png";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DataStatusIcon from "./../../images/dqStatus.png";
import UserLogo from "../../images/defaultUserLogo.jpg";
import DocumentIcon from "../../images/document.png";
import EditBlue from "../../images/editBlue.png";
import CryptoJS from "crypto-js";
import OutGoing from "../../images/Outgoing.png";
import VerifiedImage from "./../../images/verifiedImage.png";
import ToBeVerifiedImage from "./../../images/toBeVerifiedImage.png";
import Popover from "@mui/material/Popover";
import style from "./index.module.scss";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ApplicationDecline from "../../Screens/StaffApplication/applicationDeclineDialog";
import ApplicationHeader from "../../Components/ApplicationHeader";
import ApplicationFieldCard from "../../Components/ApplicationFieldCard";
import CommonDivider from "../../Components/CommonFields/CommonDivider";
import ESignature from "../../Components/ESignature";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import CommonDateField from "../../Components/CommonFields/CommonDateField";
import { add, format, isValid, parse, sub, differenceInDays } from 'date-fns';
import TextField from "@mui/material/TextField";
import CommonDropZone from '../../Components/CommonFields/CommonDropZone';
import DescriptionIcon from '@mui/icons-material/Description';
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WarningIcon from "@mui/icons-material/Warning";
import Dropzone from "react-dropzone";
import TableTwo from "../../Components/TableDesignTwo";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import FileDisplayDialog from "../../Components/fileDisplayDialog";
import EditNotesDialog from "../../Components/NotesEditDialog";
import FileVerifyDialog from "../../Components/fileVerifyDialog";
import CommonRadio from "../../Components/CommonFields/CommonRadio";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate, useParams } from "react-router-dom";
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CommonCheckBox from "../CommonFields/CommonCheckBox";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import LoadingScreen from "../LoadingScreen";
const NewActiveApplication = ({
  contracts,
  getNewContract,
  contractType,
  selectedContract,
  selectedContractType,
  contractIdFromActive,
  getContractIdFromActive,
  method,
  isEditable,
  selectedTab,
  getActiveApplicationView,
  getApprovalNotesCommentBox,
  getApprovalwithoutNotesCommentBox,
  getApprovalNotesCommentBoxDept,
  getActiveApplicationTask,
  getEmailDialogBox,
  emailDialogBox,
  approvalnotesCommentsBoxDept,
  approvalwithoutnotesCommentsBox,
  approvalnotesCommentsBox,
  reappointmentChangesCommentsBox,
  notesCommentsBox,
  getNotesDialog,
  getEditNotesDialog,
  showNotesDialog,
  getClarificationRequestFromApplicantDialog,
  showClarificationRequestFromApplicantDialog,
  getDocumentClarificationDialog,
  showDocumentClarificationDialog,
  getResolveDialog,
  showResolveDialog,
  getRequestOverrideDialog,
  staffView,
  getPaymentDisplayBox,
  dataLevel

}) => {
  console.log("contract Type", contractType);
  const [applicationId, setApplicationId] = useState(
    sessionStorage.getItem("applicationId")
  );
  const [form, setForm] = useState();
  const { step } = useParams();
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  const [selectContractInfo, setSelectContractInfo] = useState(
    contractType?.value
  );
  const [deleteExecutedContractDialog, setDeleteExecutedContractDialog] =
    useState(false);
  const [newServiceProviderDialog, setNewServiceProviderDialog] =
    useState(false);
  const [allFormSchemas, setAllFormSchemas] = useState();
  const [formSchema, setFormSchema] = useState();
  const [formSchemaId, setFormSchemaId] = useState();
  const [addOn, setAddOn] = useState(false);
  const [viewPage1, setViewPage1] = useState(true);
  const [viewPage2, setViewPage2] = useState(false);
  const [viewPage3, setViewPage3] = useState(false);
  const [viewPage4, setViewPage4] = useState(false);
  const [viewPage5, setViewPage5] = useState(false);
  const [viewPage6, setViewPage6] = useState(false);
  const [viewPage7, setViewPage7] = useState(false);
  const [viewPage8, setViewPage8] = useState(false);
  const [viewPage9, setViewPage9] = useState(false);
  const [viewPage10, setViewPage10] = useState(false);
  const [currentPage, setCurrentPage] = useState("Contract ID & Term Limit");
  const [isMultipleContract, setIsMultipleContract] = useState(false);
  const [contractId, setContractId] = useState(contractIdFromActive);
  const [fileFields, setFileFields] = useState([]);
  const [contractName, setContractName] = useState("");
  const [fileDeletionIndex, setFileDeletionIndex] = useState();
  const [fileItems, setFileItems] = useState([]);
  const [isMultiSiteEntity, setIsMultiSiteEntity] = useState(false);
  const [helpTextData, setHelpTextData] = useState();
  const [form1, setForm1] = useState();
  const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
  const [showEditNotesDialog, setShowEditNotesDialog] = useState(false);
  const [showEditNotesID, setShowEditNotesID] = useState('');
  const [showEditNotes, setShowEditNotes] = useState('');
  const [showEditNotesFile, setShowEditNotesFile] = useState('');
  const [showEditNotesPrivate, setShowEditNotesPrivate] = useState(false);
  const [showFileVerifyDialog, setShowFileVerifyDialog] = useState(false);
  const [selectedFile, setselectedFile] = useState(false);
  const [medicalDirectives, setMedicalDirectives] = useState([])
  const [selectedField, setSelectedField] = useState({
    fieldName: "",
    empty: false,
  });
  const [selectedFileURL, setSelectedFileURL] = useState("");
  const [priorContractId, setPriorContractId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showPrevContractDataAlert, setShowPrevContractDataAlert] =
    useState(false);
  const [isTabsValid, setIsTabsValid] = useState([]);
  const [expand, setExpand] = useState({ status: false, index: 0 });
  const [expandStates, setExpandStates] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
    section7: false,
  });
  const [isOpenToggle, setIsOpenToggle] = useState(false);
  const toggleDropdown = (index) => {
    setIsOpenToggle(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  const [expandAcknowledgement, setExpandAcknowledgement] = useState({
    status: false,
    index: 0,
  });
  const [contractSelected, setContractSelected] = useState(
    contracts
      ?.filter((contract) => contract?.id === contractId)
      ?.map((data) => data)[0]
  );
  const [showDocVerifyDialog, setShowDocVerifyDialog] = useState(false);
  const [file, setFile] = useState();
  const [selectedRow, setSelectedRow] = useState();
  const [selectedRowTableName, setSelectedRowTableName] = useState();
  const [selectedFormId, setSelectedFormId] = useState();
  const [credApproval, setCredApproval] = useState();
  const [calendarStart, setCalendarStart] = useState(false);
  const [calendarEnd, setCalendarEnd] = useState(false);
  const [selectedDateForBod, setSelectedDateForBod] = useState(null);
  const [selectedDateForCC, setSelectedDateForCC] = useState(null);
  const [selectedDateForReappoint, setSelectedDateForReappoint] = useState(null);
  const [selectedDateForMac, setSelectedDateForMac] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isButtonDisabled1, setIsButtonDisabled1] = useState(true);
  const [files, setFiles] = useState([]);
  const [selectedPrivilege, setSelectedPrivilege] = useState('');
  const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] = useState([]);
  const [showCurrentPrivileges, setShowCurrentPrivileges] = useState(false);
  const [currentPrivilegesCategory, setCurrentPrivilegesCategory] = useState(false);
  const [staffPrivilege, setStaffPrivilege] = useState([]);
  const [allStaffPrivilege, setAllStaffPrivilege] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const [userRole, setUserRole] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isApprovedStaff, setIsApprovedStaff] = useState(false);
  const [logDetails, setLogDetails] = useState([]);
  const [statusStyle, setStatusStyle] = useState();
  const [showCurrentPrivilegesReappointment, setShowCurrentPrivilegesReappointment] = useState(false);
  const [currentPrivilegesCategoryReappointment, setCurrentPrivilegesCategoryReappointment] = useState(false);
  const [
    selectedAdditionalPrivilegeForDisplay,
    setSelectedAdditionalPrivilegeForDisplay,
  ] = useState([]);
  const [
    selectedPrivilegesForDisplayMultiple,
    setSelectedPrivilegesForDisplayMultiple,
  ] = useState([]);
  const [indexForSign, setIndexForSign] = useState(0);
  const [hospitalPrivilegeSet, setHospitalPrivilegeSet] = useState([])
  const [privilegeChangeYesOrNo, setPrivilegeChangeYesOrNo] = useState("");
  const [privilegeSetChangeYesOrNo, setPrivilegeSetChangeYesOrNo] = useState("");
  const [additionalPrivilegeChangeYesOrNo, setAdditionalPrivilegeChangeYesOrNo] = useState("");
  const [privilegeAtOtherHospitalYesOrNo, setPrivilegeAtOtherHospitalYesOrNo] = useState("");
  const [formIndex, setFormIndex] = useState();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [fileArray, setFileArray] = useState([]);
  const [expandedIcon, setExpandedIcon] = useState(false);
  const [isApproverDept, setIsApproverDept] = useState("");
  const [isApproverCred, setIsApproverCred] = useState("");
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  // const userData = JSON.parse(sessionStorage.getItem('user'));
  // const userFirstName = userData?.name?.firstName || "No First Name";
  // const userLastName = userData?.name?.lastName || "No Last Name";
  const [hasVerificationAttempted, setHasVerificationAttempted] = useState(false);
  const [approvalType, setApprovalType] = useState(false);
  const canadaData =
    sessionStorage.getItem("canadaData") !== "undefined"
      ? JSON.parse(sessionStorage.getItem("canadaData"))
      : {};
  let user =
    sessionStorage.getItem("user") !== undefined
      ? JSON.parse(sessionStorage.getItem("user"))
      : {};
  const publicKey =
    "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [encryptedText, setEncryptedText] = useState(
    CryptoJS.AES.encrypt(
      `${user?.name?.firstName} ${user?.name?.lastName}` +
      new Date().toISOString(),
      publicKey
    ).toString()
  );
  const [currentDate, setCurrentDate] = useState();
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const workModeType = sessionStorage.getItem('workModeType')
  const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
  };

  console.log("dataLevel", users?.id)

  useEffect(() => {
    getPreApplication();
    // getPreApplicationTask();
    console.log("staffview", staffView)
  }, [applicationId]);

  useEffect(() => {
    if (!showClarificationRequestFromApplicantDialog || !showDocumentClarificationDialog || !showNotesDialog || !showResolveDialog) {
      getPreApplication();
    }
  }, [showClarificationRequestFromApplicantDialog, showDocumentClarificationDialog, showResolveDialog, showNotesDialog]);

  useEffect(() => {
    getMedicalDirectives()
    getAllFormSchemas();
  }, [applicationId])

  useEffect(() => {
    if ( workModeType === "Staff Manager" && selectedTab === "level-3" && form?.upcomingCredCommitteeMeetingDate) {
      setSelectedDateForReappoint(new Date(`${form?.upcomingCredCommitteeMeetingDate}T00:00`), "MMM dd, yyyy");
      setSelectedDateForCC(new Date(`${form?.upcomingCredCommitteeMeetingDate}T00:00`), "MMM dd, yyyy");
      setIsButtonDisabled(false);
    }
  }, [workModeType,selectedTab,form?.upcomingCredCommitteeMeetingDate]);
  

  // const handleDateChange = (date, field) => {
  //   const formattedDate = date
  //     ? format(new Date(date), "yyyy-MM-dd'T'HH:mm:ss'Z'")
  //     : format(new Date(date), 'yyyy-MM-dd');


  //   if (field === 'BOD') {
  //     setSelectedDateForBod(formattedDate);
  //   } else if (field === 'Reappoint') {
  //     setSelectedDateForReappoint(formattedDate);
  //   } else if (field === 'MAC') {
  //     setSelectedDateForMac(formattedDate);
  //   } else if (field === 'CC') {
  //     setSelectedDateForCC(formattedDate);
  //   }

  //   setCalendarStart(false);
  //   setIsButtonDisabled(false);

  // };

  const handleDateChange = (date, field) => {
    const formattedDate = date
      ? format(new Date(date), "yyyy-MM-dd'T'00:00")
      : format(new Date(date), 'yyyy-MM-dd');


    if (field === 'CC') {
      setSelectedDateForCC(formattedDate);
    } else if (field === "ApprovedDate") {
      setSelectedDateForReappoint(formattedDate);
    } else if (field === "ApprovedDateMac") {
      setSelectedDateForMac(formattedDate);
    } else if (field === "ApprovedDateBod") {
      setSelectedDateForBod(formattedDate);
    }

    setCalendarStart(false);
    setIsButtonDisabled(false);

  };

  const handleExpandClick = (catIndex) => {
    setExpandedIcon(prev => ({
      ...prev,
      [catIndex]: !prev[catIndex]
    }));
  };

  const handleExpandClickAdvance = (Index) => {
    setExpandedIcon(prev => ({
      ...prev,
      [Index]: !prev[Index]
    }));
  };

  const getJune30thOfCurrentYear = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() + 1;
    return new Date(currentYear, 5, 30);
  };

  const handleVerifyClickDocs = (files, index) => {
    setFileArray(files);
    setSelectedFileIndex(index);
    setShowFileVerifyDialog(true);
    setSelectedRow(files);
    setSelectedRowTableName("table");
    setSelectedFormId(form?.forms?.[1]?.id);
  };

  const handleVerifyClickMD = (files, index) => {
    setFileArray(files);
    setSelectedFileIndex(index);
    setShowFileVerifyDialog(true);
    setSelectedRow(files);
    setSelectedRowTableName("table");
    setSelectedFormId(form?.forms?.[9]?.id);
  };


  useEffect(() => {
    if (canadaData) {
      setCurrentDate(
        format(new Date(), canadaData?.dateFormat || "dd/MM/yyyy")
      );
    }
  }, [canadaData]);

  const [providerDetails, setProviderDetails] = useState();
  const [prevContractData, setPrevContractData] = useState();
  const [showApplicationDeclineDialog, setShowApplicationDeclineDialog] =
    useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  // const getPreApplication = async () => {
  //   const { data: basicForm } = await GET(
  //     `application-management-service/application/${applicationId}`
  //   );
  //   setForm(basicForm);
  //   console.log("basicFormmmm" + JSON.stringify(basicForm));

  // };

  const getPreApplication = async (isReplace) => {
    try {
      setIsLoadingImage(true);
      const { data: basicForm } = await GET(`application-management-service/application/${applicationId}`);
      setForm(basicForm);
      setIsLoadingImage(false)
      // if (isReplace) {
      console.log('enteredFromReplace', form?.forms?.[form?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc")]?.data?.table)
      setFileArray(form?.forms?.[form?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc")]?.data?.table)
      // }
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };
  // const isApproved = form?.forms[index]?.status === "APPROVED";

  useEffect(() => {
    setFormIndex(
      form?.forms?.findIndex((data) => data?.schemaCategory)
    );
  }, [form, step]);

  // useEffect(() => {
  //   setSelectedPrivilegeForDisplay(form?.privileges?.obligatedPrivileges);
  //   console.log("selectedPrivilegeForDisplay", JSON.stringify(selectedPrivilegeForDisplay, null, 2));
  //   console.log("selectedPrivilege" , JSON.stringify(selectedPrivilege, null, 2));
  //   console.log(
  //     "1111111111111",selectedPrivilegeForDisplay,
  //     "2222222222222",selectedAdditionalPrivilegeForDisplay,
  //     "entered",
  //     "3333333333333",selectedPrivilege,
  //     "4444444444444",staffPrivilege?.filter((data) => data?.id === selectedPrivilege),
  //     "5555555555555",staffPrivilege,
  //     "6666666666666",selectedPrivilegesForDisplayMultiple
  //   );

  // }, [selectedPrivilegeForDisplay,selectedPrivilege]);

  // useEffect(() => {
  //   setSelectedPrivilegeForDisplay(form?.privileges?.obligatedPrivileges);
  //   console.log("selectedPrivilegeForDisplay", JSON.stringify(selectedPrivilegeForDisplay, null, 2));
  //   console.log("selectedPrivilege" , JSON.stringify(selectedPrivilege, null, 2));
  //   console.log(
  //     "1111111111111",selectedPrivilegeForDisplay,
  //   );

  // }, [selectedPrivilegeForDisplay,selectedPrivilege]);


  useEffect(() => {
    if (form?.forms[formIndex]?.data !== null) {
      setSelectedPrivilegeForDisplay(form?.privileges?.obligatedPrivileges);
      setSelectedAdditionalPrivilegeForDisplay(
        form?.privileges?.additionalPrivileges
      );
      setPrivilegeChangeYesOrNo(form?.forms[formIndex]?.data?.privilegeChangeYesOrNo);
      setPrivilegeSetChangeYesOrNo(form?.forms[formIndex]?.data?.privilegeSetChangeYesOrNo);
      setAdditionalPrivilegeChangeYesOrNo(form?.forms[formIndex]?.data?.additionalPrivilegeChangeYesOrNo)
      setPrivilegeAtOtherHospitalYesOrNo(form?.forms[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo)
      setHospitalPrivilegeSet(form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges === null ? [] : form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges)
      console.log("selectedPrivilegeForDisplay", JSON.stringify(selectedPrivilegeForDisplay, null, 2));
    }
  }, [form, formIndex]);

  console.log("selectedPrivilegeForDisplay", selectedAdditionalPrivilegeForDisplay);

  useEffect(() => {
    if (form?.completedWorkflows) {
      const approvalStatuses = form?.completedWorkflows?.map((workflow, index) => {
        const isStaffManager = workflow?.role === "Staff Manager";
        const allFormsApproved = isStaffManager && workflow.allFormsApproved;
        console.log(`Workflow ${index} role:`, workflow.role);
        console.log(`Workflow ${index} allFormsApproved:`, workflow.allFormsApproved);
        return allFormsApproved;
      });

      setIsApprovedStaff(approvalStatuses.some(status => status));
    }
  }, [form]);

  useEffect(() => {
    if (form?.formSchemas) {

      const relevantSchemas = form?.forms?.filter(schema => schema?.schemaCategory);

      console.log("relevantSchemas" + JSON.stringify(relevantSchemas));

      // Check if all forms are approved
      const areAllFormsApproved = relevantSchemas.every((index) =>

        form?.forms[index]?.status === "APPROVED"
      );

      //   setIsApproved(areAllFormsApproved);

      console.log("areAllFormsApproved" + areAllFormsApproved)

      // Debug logging
      relevantSchemas.forEach((_, index) => {
        console.log(`Form ${index} status:`, form?.forms[index]?.status);
        console.log(`Form ${index} isApproved:`, form?.forms[index]?.status === "APPROVED");
      });

      const approvalStatuses = form.formSchemas.map((_, index) =>
        form?.forms[index]?.status === "APPROVED"
      );


      // Check if any form is approved
      const hasAnyApproved = approvalStatuses.some(status => status);
      // Check if all forms are approved
      const hasAllApproved = approvalStatuses.every(status => status);

      if (hasAllApproved) {
        setStatusStyle(style.greenBigDotStyle);
        // setIsApproved(hasAllApproved)
      } else if (hasAnyApproved) {
        setStatusStyle(style.yellowBigDotStyle);
      } else {
        setStatusStyle(style.greyBigDotStyle);
      }
    }
  }, [form]);

  useEffect(() => {
    if (form?.completedWorkflows) {
      const staffManagerWorkflow = form.completedWorkflows.find(workflow => workflow.role === "Staff Manager");

      if (staffManagerWorkflow?.allFormsApproved) {
        setIsApproved(true);
      } else {
        setIsApproved(false);
      }
    }
  }, [form]);

  // const filteredSchemas = form.formSchemas.filter(data =>
  //   (data?.formCategory === "Form" || data?.formCategory === "Disclosure") &&
  //   data?.schemaCategory !== "UploadYourDoc"
  // );

  // console.log('Filtered Schemas:', filteredSchemas);


  // const getPreApplicationTask = async () => {
  //   const { data: tasks } = await GET(`application-management-service/application/${applicationId}/tasks`);
  //   const pendingTasks = tasks.filter(task => task.taskStatus !== 'COMPLETED');
  //   setTaskCount(pendingTasks.length);
  // };

  const allTasksCompleted = taskCount !== 0;


  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getFormSchema(formSchemaId);
  }, [formSchemaId]);

  const open = Boolean(anchorEl);

  const [anchorTextEl, setAnchorTextEl] = React.useState(null);

  const handlePopoverTextOpen = (event) => {
    setAnchorTextEl(event.currentTarget);
  };

  const handlePopoverTextClose = () => {
    setAnchorTextEl(null);
  };

  const openTextWithHover = Boolean(anchorTextEl);

  const getApplicationDeclineDialog = (value) => {
    setShowApplicationDeclineDialog(value);
  };

  console.log(contractSelected, prevContractData, "selected contract");



  useEffect(() => {
    getFileData();
    getEntityData();
    getBasicForm();
    helpText();
  }, []);

  useEffect(() => {
    helpText();
  }, [currentPage]);

  useEffect(() => {
    getStaffPrivilege();
  }, [form]);

  useEffect(() => {
    getFileData();
    console.log("entered");
  }, [fileFields]);

  useEffect(() => {
    setContractSelected(
      contracts
        ?.filter((contract) => contract?.id === contractId)
        ?.map((data) => data)[0]
    );
  }, [contractId]);

  useEffect(() => {
    if (
      contractSelected?.contractDetail?.priorContractRefId?.id !== undefined
    ) {
      getPrevContractData();
    }
  }, [contractSelected]);

  // useEffect(() => {
  //   approveView(userRole);
  //   getLog();
  // }, []);

  useEffect(() => {
    approveView(workModeType);
    getLog();
    // checkApproverDept();
  }, []);

  useEffect(() => {
    console.log("Updated firstnameuser", userFirstName);
    console.log("Updated firstnameuser", userLastName);

    let departmentHeadApproverDetails = form?.completedWorkflows?.find(
      (workflow) => workflow?.role === "Department Head"
    );

    let firstName = departmentHeadApproverDetails?.approverDetail?.name?.firstName || "";
    let lastName = departmentHeadApproverDetails?.approverDetail?.name?.lastName || "";

    console.log(`Approver dept: ${firstName} ${lastName}`);
    console.log("workModeType:", workModeType);
    // console.log("selectedTab:", selectedTab,(workModeType === 'Chief Of Staff' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "Approve"),workModeType === 'Chief Of Staff' , selectedTab === 'level-2' , applicationType === "REAPPOINTMENT" , isApproverDept);
    console.log("applicationType:", applicationType);

    if (firstName === userFirstName && lastName === userLastName) {
      setIsApproverDept("Approve");
      console.log("levelofApprovaltrue:", isApproverDept);
    } else {
      setIsApproverDept("NotApproved");
      console.log("levelofApprovalfalse:", isApproverDept);
    }

    console.log("selectedTab:", selectedTab, (workModeType === 'Chief Of Staff' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "Approve"), workModeType === 'Chief Of Staff', selectedTab === 'level-2', applicationType === "REAPPOINTMENT", isApproverDept);
  }, [form, applicationId, userFirstName, userLastName, workModeType, applicationType, isApproverDept]);

  useEffect(() => {
    console.log("Updated firstnameuser", userFirstName);
    console.log("Updated firstnameuser", userLastName);

    let CredCommApproverDetails = form?.completedWorkflows?.find(
      (workflow) => workflow?.role === "Credentialing Committee"
    );

    let firstName = CredCommApproverDetails?.approverDetail?.name?.firstName;
    let lastName = CredCommApproverDetails?.approverDetail?.name?.lastName;
    let approvalType = CredCommApproverDetails?.approvalType

    console.log(`Approver cred: ${firstName} ${lastName}`);
    console.log("workModeType:", workModeType);
    // console.log("selectedTab:", selectedTab,(workModeType === 'Chief Of Staff' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "Approve"),workModeType === 'Chief Of Staff' , selectedTab === 'level-2' , applicationType === "REAPPOINTMENT" , isApproverDept);
    console.log("applicationType:", applicationType);
    console.log("approvalType:", approvalType);

    if (firstName === userFirstName && lastName === userLastName) {
      setIsApproverCred("Approve");
      console.log("levelofApprovaltrue:", isApproverCred);
      if (!approvalType) {
        setApprovalType(false);
      } else {
        setApprovalType(true);
      }
    } else {
      setIsApproverCred("NotApproved");
      console.log("levelofApprovalfalse:", isApproverCred);
    }

    console.log("selectedTab:", selectedTab, (workModeType === 'Chief Of Staff' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverCred === "Approve"), workModeType === 'Chief Of Staff', selectedTab === 'level-2', applicationType === "REAPPOINTMENT", isApproverCred);
  }, [form, applicationId, userFirstName, userLastName, workModeType, applicationType, isApproverCred]);

  console.log("Is Approver:", isApproverDept);

  useEffect(() => {
    if (!showNotesDialog || !showEditNotesDialog) {
      getPreApplication();
    }
  }, [showNotesDialog, showEditNotesDialog]);


  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const setUserDetails = async () => {
    try {
      const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
      console.log("userdataaaa", JSON.stringify(userData));
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
      setUserFirstName(`${userData?.name?.firstName}`);
      setUserLastName(`${userData?.name?.lastName}`);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const isLableEmpty = (data) => {
    if (data === "" || data === null) {
      return true;
    } else {
      return false;
    }
  };


  const getPrevContractData = async () => {
    const { data: contractData } = await GET(
      `contract-managment-service/contracts/${contractSelected?.contractDetail?.priorContractRefId?.id}/contractDetail`
    );
    if (contractData) {
      setPrevContractData(contractData);
    }
  };

  const sendEmail = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const getFormSchema = async (id) => {
    if (
      id !== "" &&
      id !== undefined &&
      id !== null
    ) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${id}`
      );
      setFormSchema(form?.schema);
    }
  };


  const getPriorContractId = (value) => {
    console.log("prior contract id", value);
    setPriorContractId(value);
  };

  const checkFieldAndPopAlert = (value, fieldName) => {
    if (
      value === null ||
      value === 0 ||
      value === "" ||
      value === undefined ||
      value === "0"
    ) {
      console.log("inside");
      setSelectedField({ fieldName: fieldName, empty: false });
    } else {
      setSelectedField({ fieldName: fieldName, empty: true });
    }
  };

  const changeHandler = async (event) => {
    setIsLoading(true);
    const filesArray = Array.from(event);
    setFiles(filesArray);
    console.log(event, 'Test');


    const formData = new FormData();
    let fileNameArray = [];
    filesArray?.forEach(file => {
      fileNameArray.push({ "fileName": file?.name });
      formData.append('documents', file);
    });




    formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
      type: "application/json"
    }));

    fileNameArray.forEach(file => {
      console.log("File name:", file.fileName);
    });

    console.log("file?.name" + JSON.stringify(fileNameArray));
    console.log(fileNameArray)
    console.log(event?.name);

    try {
      const response = await POST(`application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${false}`, formData);
      SuccessToaster('File Uploaded Successfully');
      console.log(response?.data?.fileName);



      setIsLoading(false);
      return response?.data;
    } catch (error) {
      ErrorToaster('File Upload Failed');
      console.error(error);
      setIsLoading(false);
      return null;
    }
  };



  const helpText = async () => {
    const { data: data } = await GET(
      `contract-managment-service/helpText?tabName=${encodeURIComponent(
        currentPage
      )}`
    );
    setHelpTextData(data?.dataElement);
  };

  const getEntityData = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setIsMultiSiteEntity(data?.multiSiteEntity);
  };

  const getShowPrevContractDataAlert = (value) => {
    console.log(value, "test");
    setShowPrevContractDataAlert(value === false ? true : false);
  };

  const getBasicForm = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/basicForm`
    );
    if (basicForm) {
      const { data: form1 } = await GET(
        `application-management-service/formSchema/${basicForm?.generalSchemas?.[1]?.id}`
      );
      let temp = form1?.schema;
      if (temp.properties.applicant.properties !== null) {
        delete temp.properties.applicant.properties["applicantType"];
        delete temp.properties.applicant.properties["startDate"];
      }
      setForm1(form1?.schema);
    }
  };

  const getFileData = () => {
    let temp = [];
    console.log("entered", fileFields);
    for (let i = 0; i < fileFields?.length || 0; i++) {
      temp[i] = (
        <div className={`${style.documentCard} ${style.marginTop10}`} key={i}>
          <div className={`${style.documentGrid}`}>
            <a href={fileFields?.[i]?.fileURL} target="_blank">
              <Tooltip title={"Preview"} arrow>
                <ArticleOutlinedIcon
                  sx={{ color: "#06617A", fontSize: 35 }}
                  onClick={() => {
                    setSelectedFileURL(fileFields?.[i]?.fileURL);
                  }}
                />
              </Tooltip>
            </a>
            <div className={style.marginTop}>
              <a href={fileFields?.[i]?.fileURL} target="_blank">
                <Tooltip title={"Preview"} arrow>
                  <p
                    className={`${style.documentText} ${style.leftAlign} ${style.removeUnderline}`}
                    onClick={() => {
                      setSelectedFileURL(fileFields?.[i]?.fileURL);
                    }}
                  >
                    <strong>{fileFields?.[i]?.documentType}</strong>
                  </p>
                </Tooltip>
              </a>

              <div className={style.spaceBetween}>
                <p className={`${style.documentText} ${style.leftAlign}`}>
                  <strong>{fileFields?.[i]?.fileName}</strong>
                </p>
                <div
                  onClick={() => {
                    getDeleteExecutedContractDialog(true);
                    setFileDeletionIndex(i);
                  }}
                  className={`${style.floatRight} ${style.cursorPointer}`}
                >
                  <DeleteOutlineIcon sx={{ color: "#F94848" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    setFileItems(temp);
  };

  const handleVerify = async (formId) => {
    await PUT(
      `application-management-service/application/${applicationId}/APPROVED`
    )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const handleStepsVerify = async (formId) => {
    // let role;
    // let notes;

    // if (selectedTab === 'level-2') {
    //   role = "Department Head";
    //   notes = "Send"
    // } else if (selectedTab === 'level-3') {
    //   role = "Credentialing Committee";
    //   notes = "Send"
    // } else if (selectedTab === 'level-4') {
    //   role = "Advisory Committee";
    //   notes = "Send"
    // } else if (selectedTab === 'level-5') {
    //   role = "Board";
    //   notes = "Send"
    // } 

    // let temp = {
    //   role: role,
    //   notes: notes
    // };

    let role;

    switch (selectedTab) {
      case 'level-2':
        role = "Department Head";
        break;
      case 'level-3':
        role = "Chief Of Staff";
        break;
      case 'level-4':
        role = "Advisory Committee";
        break;
      case 'level-5':
        role = "Board";
        break;
      case 'level-1':
        role = "Staff Manager";
        break;
      default:
        role = "";
    }

    // const isDelegate = selectedTab === 'level-2' || selectedTab === 'level-3' || selectedTab === 'level-4' || selectedTab === 'level-5' ? true : false;
    // const requestData = isDelegate === true ? temp : {};

    const isDelegate = (workModeType === role) ? false : true;
    const requestData = isDelegate ? { role: role } : {};
    await PUT(
      `application-management-service/application/${applicationId}/form/${formId}/APPROVED?isDelegate=${isDelegate}`, requestData
    )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
    getLog();
  };

  const handleStepsVerifyRevoke = async (formId) => {
    let role;

    switch (selectedTab) {
      case 'level-2':
        role = "Department Head";
        break;
      case 'level-3':
        role = "Chief Of Staff";
        break;
      case 'level-4':
        role = "Advisory Committee";
        break;
      case 'level-5':
        role = "Board";
        break;
      case 'level-1':
        role = "Staff Manager";
        break;
      default:
        role = "";
    }

    const isDelegate = (workModeType === role) ? false : true;
    const requestData = isDelegate ? { role: role } : {};
    await PUT(
      `application-management-service/application/${applicationId}/form/${formId}/WorkflowAction/revoke?isDelegate=${isDelegate}`, requestData
    )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
    getLog();
  };

  const handleStaffEsign = async (formId) => {
    console.log("entered");
    let index = form?.forms?.findIndex((row) => row?.id === formId);
    console.log("entered", index, formId, form);
    let tempData =
      form?.forms?.[index]?.staffEsign === null
        ? {
          name: `${user?.name?.firstName} ${user?.name?.lastName}`,
          esign: encryptedText,
          signedDate: currentDate,
        }
        : form?.forms?.[index]?.staffEsign;
    let temp = {
      schemaId: formSchemaId,
      data: form?.forms?.[index]?.data,
      acknowledged: form?.forms?.[index]?.acknowledged,
      esign: form?.forms?.[index]?.esign,
      staffEsign: tempData,
    };
    console.log("entered", tempData, index, formId);
    await PUT(
      `application-management-service/application/${applicationId}/form/${formId}`,
      temp
    )
      .then((response) => {
        getPreApplication();
        SuccessToaster("Signed Successfully");
      })
      .catch((error) => {
        console.log(error);
        ErrorToaster("Unexpected Error");
      });
  };

  const handleDocVerify = async (rowId) => {
    let temp = {
      formId: selectedFormId,
      contentToVerify: "DOCUMENT",
      tableName: selectedRowTableName,
      rowId: rowId,
    };
    await PUT(
      `application-management-service/application/${applicationId}/verifyForm`,
      temp
    )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const approveView = async () => {
    const roleMap = {
      'level-1': "Staff Manager",
      'level-2': "Department Head",
      'level-3': "Credentialing Committee",
      'level-4': "Advisory Committee",
      'level-5': "Board",
      'clarificationsRequired': "Staff Manager"
    };
    console.log("roleMap" + roleMap);


    const role = roleMap[selectedTab];
    // const role = userRole;
    // console.log("roleeeeee1" + userRole);

    console.log("roleApproval" + role)


    const { data: basicApproval } = await GET(
      `application-management-service/application/${applicationId}/approvalRequiredForms?role=${role}`
    );
    setCredApproval(basicApproval)
    console.log("basicApproval" + JSON.stringify(credApproval));
  }


  const getLog = async () => {
    const { data: basicLog } = await GET(`application-management-service/application/${applicationId}/logs`);
    setLogDetails(basicLog);
  };

  const onClickNotesFunction = () => {
    getNotesDialog(true);
  };

  const onClickDocumentClarificationFunction = (clarificationId, formId) => {
    getDocumentClarificationDialog(true, clarificationId, formId);
  };

  const onClickDocumentClarificationRequestFunction = (formId, type) => {
    getClarificationRequestFromApplicantDialog(true, formId, type);
  };

  const onClickResolveDialogFunction = (mode, clarificationId, formId) => {
    getResolveDialog(true, mode, clarificationId, formId);
  };

  const onClickRequestOverrideDialogFunction = () => {
    getRequestOverrideDialog(true);
  };

  const onClickNotesEditFunction = (logID, notesEdit, privateKey, File) => {
    // getEditNotesDialog(true);
    setShowEditNotesDialog(true)
    setShowEditNotesID(logID)
    setShowEditNotes(notesEdit)
    setShowEditNotesPrivate(privateKey)
    setShowEditNotesFile(File)
  };

  const onClickPaymentFunction = () => {
    getPaymentDisplayBox(true);
  };

  const onClickApprovalFunction = () => {
    getApprovalNotesCommentBox(true);
  };

  const onClickApprovalwithoutnotesFunction = () => {
    getApprovalwithoutNotesCommentBox(true, selectedDateForReappoint);
  };

  const onClickApprovalwithoutnotesMACFunction = () => {
    getApprovalwithoutNotesCommentBox(true, selectedDateForMac);
  };

  const onClickApprovalDeptFunction = () => {
    getApprovalNotesCommentBoxDept(true);
  };
  const onClickCheckListFunction = () => {
    getActiveApplicationTask(true);
  };

  const onClickEmailDialogFunction = () => {
    getEmailDialogBox(true);
  };

  const onClickApproveMoveFunction = () => {
    handleApplicationAccept(true);
    getApplicationMoveToNext(true)
  };

  const onClickCCDateSetFunction = () => {
    getApplicationDateForCC(true);
    getActiveApplicationView(false);
  };

  const onClickRejectFunction = () => {
    handleApplicationReject(true);
  };

  const handleDeleteNote = async (noteID) => {

    await DELETE(`application-management-service/application/${applicationId}/note/${noteID}`)
      .then((response) => {
        getPreApplication()
        SuccessToaster("Notes Deleted Successfully");
      })
      .catch((error) => {
        ErrorToaster("Unexpected Error Deleting File");
      });
  }


  const getApplicationDateForCC = async () => {
    let meetingDate = format(new Date(selectedDateForCC), 'yyyy-MM-dd');
    let temp = [applicationId];

    await PUT(`application-management-service/application/updateMeetingDate/bulk?meetingDate=${meetingDate}`, temp)
      .then(response => {
        console.log('successfull')
        onClose();
      })
      .catch((error) => {
        console.log(error)
      });
    getPreApplication();
  }

  const handleApplicationAccept = async () => {
    let role;
    let title;
    let notes = "";
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        role = "Department Head";
        isDelegate = false;
        title = "Dept. Head / Chief Review"
      } else {
        role = "Department Head";
        title = "Dept. Head / Chief Review"
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
        isDelegate = false;
      } else if (workModeType === "Chief Of Staff") {
        role = "Chief Of Staff";
        isDelegate = false;
        title = "Chief Of Staff Review";
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
      isDelegate = false;
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: notes,
      // approvedDate: new Date().toISOString(),
      approvedDate: format(new Date(selectedDateForBod), 'yyyy-MM-dd'),
      title: title
    };


    // const isDelegate = selectedTab === 'level-2' || selectedTab === 'level-3' || selectedTab === 'level-4' || selectedTab === 'level-5';
    // const requestData = { ...temp, notes: "" };
    await PUT(`application-management-service/application/${applicationId}/workflow/complete/APPROVED?isDelegate=${isDelegate}&approvalType=RECOMMENDED`, temp)
      .then(response => {
        console.log('success')
        onClose()
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const handleApplicationReject = async () => {
    let role;
    let notes = "";
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-1') {
      if (workModeType === "Staff Manager") {
        role = "Staff Manager";
        isDelegate = false;
      } else if (workModeType === "Chief Of Staff") {
        role = "Chief Of Staff";
      }
    } else if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        role = "Department Head";
        isDelegate = false;
      } else {
        role = "Department Head";
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        role = "Credentialing Committee";
        isDelegate = false;
      } else if (workModeType === "Chief Of Staff") {
        role = "Chief Of Staff";
        isDelegate = false;
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
    } else if (selectedTab === 'level-5') {
      role = "Board";
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: isDelegate ? notes : "",
    };

    await PUT(`application-management-service/application/${applicationId}/workflow/complete/REJECTED?isDelegate=${isDelegate}`, temp)
      .then(response => {
        console.log('success')
        onClose()
      })
      .catch((error) => {
        console.log(error);
      });
    getPreApplication();
  };

  const getApplicationApproveAndMoveToNext = async () => {
    let role;
    let title;
    let notes = "";
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        role = "Department Head";
        isDelegate = false;
        title = "Dept. Head / Chief Review"
      } else {
        role = "Department Head";
        title = "Dept. Head / Chief Review"
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
        isDelegate = false;
      } else if (workModeType === "Chief Of Staff") {
        role = "Credentialing Committee";
        isDelegate = true;
        title = "Credentialing Committee Review";
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
      isDelegate = false
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: notes,
      approvedDate: format(new Date(selectedDateForReappoint), 'yyyy-MM-dd'),
      title: title
    };

    await PUT(`application-management-service/application/${applicationId}/workflow/completeAndMove/APPROVED?isDelegate=${isDelegate}&approvalType=RECOMMENDED`, temp)
      .then(response => {
        console.log('successfull')
        onClose()
      })
      .catch((error) => {
        console.log(error)
      });
    // getPreApplication();
  }

  const getApplicationMoveToNext = async () => {
    let role;
    let title;
    let notes = "";
    let isDelegate = true;

    // Determine role based on selectedTab and applicationType
    if (selectedTab === 'level-2') {
      if (workModeType === "Department Head") {
        role = "Department Head";
        isDelegate = false;
        title = "Dept. Head / Chief Review"
      } else {
        role = "Department Head";
        title = "Dept. Head / Chief Review"
      }
    } else if (selectedTab === 'level-3') {
      if (workModeType === "Credentialing Committee") {
        role = "Credentialing Committee";
        title = "Credentialing Committee Review";
        isDelegate = false;
      } else if (workModeType === "Chief Of Staff") {
        role = "Credentialing Committee";
        isDelegate = true;
        title = "Credentialing Committee Review";
      }
    } else if (selectedTab === 'level-4') {
      role = "Advisory Committee";
      title = "MAC Review";
    } else if (selectedTab === 'level-5') {
      role = "Board";
      title = "BOD Approval";
    } else if (selectedTab === 'level-1') {
      role = "Staff Manager";
      title = "Staff Manager Verification";
    }

    // Prepare the payload
    let temp = {
      role: isDelegate ? role : "",
      notes: notes,
      approvedDate: new Date().toISOString(),
      title: title
    };

    await PUT(`application-management-service/application/${applicationId}/workflow/move?isDelegate=${isDelegate}`, temp)
      .then(response => {
        console.log('successfull')
        onClose()
      })
      .catch((error) => {
        console.log(error)
      });
    // getPreApplication();
  }

  // const getUserRole = (selectedTab) => {
  //   switch (selectedTab) {
  //     case "level-1":
  //       return "Staff Manager";
  //     case "level-2":
  //       return "Dept Head";
  //     case "level-3":
  //       if (userRole?.includes("Credentialing Committee")) {
  //         return "Cred Comm";
  //       }
  //       if (userRole?.includes("Chief Of Staff")) {
  //         return "Chief Of Staff";
  //       }
  //       return "Cred Comm";
  //     case "level-4":
  //       return "MAC";
  //     case "level-5":
  //       return "BOD";
  //     default:
  //       return "";
  //   }
  // };

  // const userRoleTab = getUserRole(selectedTab);

  const getContractId = (value) => {
    setContractId(value);
  };

  const getNewServiceProviderDialog = (value) => {
    setNewServiceProviderDialog(value);
  };

  const getDeleteExecutedContractDialog = (value) => {
    setDeleteExecutedContractDialog(value);
  };

  const getAddOn = (value) => {
    setAddOn(value);
  };

  const getIsShowFileDialog = (value) => {
    setShowFileDisplayDialog(value);
  }

  const getIsShowEditNoteDialog = (value) => {
    setShowEditNotesDialog(value);
  }

  const getIsShowFileVerifyDialog = (value) => {
    setShowFileVerifyDialog(value);
  }

  const getValueByPath = (obj, path) => {
    const keys = path.split(/[\.\[\]]+/).filter(Boolean);
    console.log(
      path,
      keys.reduce(
        (acc, key) => acc && acc[isNaN(key) ? key : Number(key)],
        form
      ),
      form,
      "if"
    );
    return keys.reduce(
      (acc, key) => acc && acc[isNaN(key) ? key : Number(key)],
      form
    );
  };



  const toggleExpand = (section) => {
    setExpandStates((prevStates) => ({
      ...prevStates,
      [section]: !prevStates[section],
    }));
  };

  const getShowAlert = (value, type = "cross") => {
    setShowAlert(value);
    if (!value && type === "ok") {
      getNewContract(false);
      getContractIdFromActive("");
    }
  };

  const getViewPage1 = (value) => {
    setViewPage1(value);
  };

  const getViewPage2 = (value) => {
    setViewPage2(value);
  };

  const getViewPage3 = (value) => {
    setViewPage3(value);
  };

  const getViewPage4 = (value) => {
    setViewPage4(value);
  };

  const getViewPage5 = (value) => {
    setViewPage5(value);
  };

  const getViewPage6 = (value) => {
    setViewPage6(value);
  };

  const getViewPage7 = (value) => {
    setViewPage7(value);
  };

  const getViewPage8 = (value) => {
    setViewPage8(value);
  };

  const getViewPage9 = (value) => {
    setViewPage9(value);
  };

  const getViewPage10 = (value) => {
    setViewPage10(value);
  };

  const getCurrentPage = (value) => {
    setCurrentPage(value);
  };

  const getAllFormSchemas = async () => {
    if (applicationId !== undefined) {
      const { data: allFormSchemas } = await GET(
        `application-management-service/application/${applicationId}/getSchemas`
      );
      setAllFormSchemas(allFormSchemas);
    }
  }

  const getMedicalDirectives = async () => {
    if (applicationId !== undefined) {
      const { data: medicalDirectives } = await GET(
        `medical-directive-service/medicalDirectives/application/${applicationId}?isNewAppointment=${form?.creationType !== 'REAPPOINTMENT'}&isReAppointment=${form?.creationType === 'REAPPOINTMENT'}`
      );
      let temp = [...medicalDirectives?.completed, ...medicalDirectives?.pending, ...medicalDirectives?.reviewInprogress, ...medicalDirectives?.pastDue]
      setMedicalDirectives(temp)
      console.log(medicalDirectives, 'medicalDirectives')
    }
  }

  //   const getApplicantValues = (array, index,staffView) => {
  //     let schema = applicationType === "NEW" ? formSchema : allFormSchemas?.[index]?.formSchema?.schema
  //     let temp = [];
  //     console.log(array, 'arrayyyyyy')
  //     Object.keys(schema?.properties?.table?.tableHeaders || {})?.map((data, index) => {
  //       if (data === "file") {
  //         temp.push({
  //           "type": "icon", "icon": array?.map(innerData => innerData?.fileType === 'application/pdf' ?
  //             <img src={PdfDoc} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} />
  //             : innerData?.fileType?.startsWith("image/") ?
  //               <img src={ImgDoc} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} /> : <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.fileURL, '_blank'); }} />), 'isShowHoverText': false
  //         });
  //       } else {
  //         if (data === "valid") {
  //           temp.push({ "type": "icon", "icon": array?.map(innerData => innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562` }} />), 'isShowHoverText': false });
  //         } else if (data === "verified") {
  //           temp.push({
  //             "type": "icon",
  //             "icon": array?.map((innerData, index) => (
  //                 innerData?.isVerified === true 
  //                 ? (
  //                     <div className={`${style.greenButton} ${style.cursorPointer}`}> 
  //                         <div
  //                             className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
  //                             // onClick={() => handleVerifyClickDocs(array, index)}
  //                         >
  //                             Verified 
  //                         </div>
  //                     </div>
  //                 ) : (
  //                     <div className={`${style.purpleButton} ${style.cursorPointer}`}> 
  //                         <div
  //                             className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
  //                             onClick={() => handleVerifyClickDocs(array, index)}
  //                         >
  //                             Verify 
  //                         </div>
  //                     </div>
  //                 )
  //             ))
  //         });        
  //       }  else {
  //           temp.push({
  //               "type": "text",
  //               "value": array.map(innerData => 
  //                   <div onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData); }}>
  //                       {innerData[data]}
  //                   </div>
  //               )
  //           });
  //         }
  //       }
  //       // if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
  //       //   // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
  //       //   temp.push({
  //       //     "type": "icon", "icon": array?.map(innerData =>
  //       //       <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { handleDelete(innerData) }} />
  //       //     ), 'isShowHoverText': false
  //       //   });
  //       // }
  //     })
  //     return temp;
  //   }

  const getApplicantValues = (array, index) => {
    if (!array || !Array.isArray(array)) {
      console.error("Array is undefined or not an array:", array);
      return [];
    }
    let schema = applicationType === "NEW" ? formSchema : allFormSchemas?.[index]?.formSchema?.schema
    let temp = [];
    console.log(array, 'arrayyyyyy')
    console.log("allFormSchemas?.[index]?.formSchema?.schema", allFormSchemas?.[index]?.formSchema?.schema);

    Object.keys(schema?.properties?.table?.tableHeaders || {})?.map((data, index) => {
      if (data === "file") {
        temp.push({
          "type": "icon",
          "icon": array?.map(innerData => innerData?.fileType === 'application/pdf' ?
            <img src={PdfDoc} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} />
            : innerData?.fileType?.startsWith("image/") ?
              <img src={ImgDoc} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} />
              : <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.fileURL, '_blank'); }} />),
          'isShowHoverText': false
        });
      } else {
        if (data === "valid") {
          temp.push({
            "type": "icon",
            "icon": array?.map(innerData => innerData[data] ?
              <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} />
              : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562` }} />),
            'isShowHoverText': false
          });
        } else if (data === "verified") {
          // Check if staffView is true
          if (!staffView) {
            console.log("staffView is true");
            console.log("StaffView", staffView)
            // If staffView is true, push the CheckCircleRoundedIcon
            temp.push({
              "type": "icon",
              "icon": array?.map((innerData, index) => (
                innerData?.isVerified === true
                  ? (
                    <div className={`${style.greenButton} ${style.cursorPointer}`}>
                      <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                        onClick={() => handleVerifyClickDocs(array, index)}
                      >
                        Verified
                      </div>
                    </div>
                  ) : (
                    <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                      <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                        onClick={() => handleVerifyClickDocs(array, index)}
                      >
                        Verify
                      </div>
                    </div>
                  )
              ))
            });

          }
          else {
            temp.push({
              "type": "icon",
              "icon": array?.map((innerData, index) => (
                <CheckCircleRoundedIcon style={{ fontSize: 20, color: '#25BF6A' }} />
              )),
              'isShowHoverText': false
            });
          }
        }
        else {
          temp.push({
            "type": "text",
            "value": array.map(innerData =>
              <div className={style.cursorPointer} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData); }}>
                {innerData[data]}
              </div>
            )
          });
        }
      }
    })
    return temp;
  }

  // const getMedicalDirectiveTable = () => {
  //   let temp = [];
  //   temp.push({
  //     "type": "icon", "icon": medicalDirectives?.map(innerData =>
  //       <div
  //       //  className={`${innerData?.status === 'COMPLETED' ? style.iconBackgroundColorGreen : innerData?.status === 'INPROGRESS' ? style.iconBackgroundColorYellow : innerData?.status === 'PAST_DUE' ? style.iconBackgroundColorRed : style.iconBackgroundColor} 
  //       // ${style.verticalAlignCenter} ${style.justifyCenterReappointment}`}
  //       >
  //         {innerData?.status === 'COMPLETED' ? (
  //           <CheckCircleRoundedIcon sx={{ fontSize: 20, color: `#25BF6A` }} />
  //         ) : (
  //           <WarningAmberRoundedIcon sx={{ fontSize: 20, color: `#FF6562` }} />
  //         )}
  //       </div>
  //       // <img src={BlueSign} alt="" className={style.blueSignImgStyle} onClick={() => { }} />
  //     ), 'isShowHoverText': false
  //   });
  //   temp.push({ "type": "text", "value": medicalDirectives?.map(innerData => innerData?.medicalDirective?.title), 'onClickFunction': () => { } });
  //   temp.push({ "type": "text", "value": medicalDirectives?.map(innerData => innerData?.medicalDirective?.mdID), 'onClickFunction': () => { } });
  //   temp.push({ "type": "text", "value": medicalDirectives?.map(innerData => innerData?.medicalDirective?.creationType), 'onClickFunction': () => { } });
  //   temp.push({ "type": "text", "value": medicalDirectives?.map(innerData => format(new Date(innerData?.dueDate), 'dd/MM/yyyy')), 'onClickFunction': () => { } });

  //   temp.push({
  //     "type": "icon", "icon": medicalDirectives?.map(innerData =>
  //       <img src={BlueSign} alt="" className={style.blueSignImgStyle} onClick={() => { }} />
  //     ), 'isShowHoverText': false
  //   });

  //   // temp.push({
  //   //   "type": "icon",
  //   //   "icon": medicalDirectives?.map((innerData, index) => (
  //   //     innerData?.isVerified === true
  //   //       ? (
  //   //         <div className={`${style.greenButton} ${style.cursorPointer}`}>
  //   //           <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
  //   //             Verified
  //   //           </div>
  //   //         </div>
  //   //       ) : (
  //   //         <div className={`${style.purpleButton} ${style.cursorPointer}`}>
  //   //           <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
  //   //             onClick={() => handleVerifyClickDocs(medicalDirectives, index)}
  //   //           >
  //   //             Verify
  //   //           </div>
  //   //         </div>
  //   //       )
  //   //   ))
  //   // });
  //   return temp;
  // }


  const getMedicalDirectiveTable = (array, index) => {
    if (!array || !Array.isArray(array)) {
      console.error("Array is undefined or not an array:", array);
      return [];
    }
    let schema = applicationType === "NEW" ? formSchema : allFormSchemas?.[index]?.formSchema?.schema
    let temp = [];
    console.log(array, 'arrayyyyyy1233')
    // console.log(array[data],"@@@@@@@@@");

    console.log("allFormSchemas?.[index]?.formSchema?.schema", allFormSchemas?.[index]?.formSchema?.schema);

    Object.keys(schema?.properties?.medicalDirectives?.tableHeaders || {})?.map((data, index) => {
      // temp.push({
      //     "type": "icon",
      //     "icon": array?.map(innerData =>
      //        <CheckCircleRoundedIcon style={{ fontSize: 20,color: `#25BF6A` }}  onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData?.file) }} />),
      //     'isShowHoverText': false
      //   });
      if (data === "file") {
        temp.push({
          "type": "icon",
          "icon": array?.map(innerData =>
            // <img src={PdfDoc} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} />),
            <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData?.file) }} />),
          'isShowHoverText': false
        });
      } else {
        if (data === "valid") {
          temp.push({
            "type": "icon",
            "icon": array?.map(innerData => innerData[data] ?
              <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} />
              : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562` }} />),
            'isShowHoverText': false
          });
        }
        //  else if (data === "verified") {
        //   // Check if staffView is true
        //   if (!staffView) {
        //     console.log("staffView is true");
        //     console.log("StaffView", staffView)
        //     // If staffView is true, push the CheckCircleRoundedIcon
        //     // temp.push({
        //     //   "type": "icon",
        //     //   "icon": array?.map((innerData, index) => (
        //     //     innerData?.isVerified === true
        //     //       ? (
        //     //         <div className={`${style.greenButton} ${style.cursorPointer}`}>
        //     //           <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
        //     //             Verified
        //     //           </div>
        //     //         </div>
        //     //       ) : (
        //     //         <div className={`${style.purpleButton} ${style.cursorPointer}`}>
        //     //           <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
        //     //             onClick={() => handleVerifyClickMD(array, index)}
        //     //           >
        //     //             Verify
        //     //           </div>
        //     //         </div>
        //     //       )
        //     //   ))
        //     // });
        //        temp.push({
        //         "type": "icon", "icon": medicalDirectives?.map(innerData =>
        //           <img src={BlueSign} alt="" className={style.blueSignImgStyle} onClick={() => { }} />
        //         ), 'isShowHoverText': false
        //       });
        //   }
        //   else {
        //     temp.push({
        //       "type": "icon",
        //       "icon": array?.map((innerData, index) => (
        //         <CheckCircleRoundedIcon style={{ fontSize: 20, color: '#25BF6A' }} />
        //       )),
        //       'isShowHoverText': false
        //     });
        //   }
        // }
        else {
          temp.push({
            "type": "text",
            "value": array.map(innerData =>
              <div className={style.cursorPointer} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData); }}>
                {innerData[data]}
              </div>
            )
          });
        }
      }
      // temp.push({
      //   "type": "text",
      //   "value": array.map(innerData =>
      //     <div onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData); }}>
      //       {innerData[data]}
      //     </div>
      //   )
      // });
    })
    return temp;
  }



  const getFileFields = (value) => {
    console.log(value);
    setFileFields(value);
    if (value?.[value?.length - 1]?.id === "" && value?.length !== 0) {
      getFileData();
    }
  };

  const getContractName = (value) => {
    setContractName(value);
  };

  useEffect(() => {
    setIsMultipleContract(selectContractInfo === "MULTIPLE" ? true : false);
  }, [selectContractInfo]);

  const handleFileDeletion = async () => {
    let fileIdToDelete = fileFields
      ?.filter((data, index) => index === fileDeletionIndex)
      ?.map((data) => data?.id)[0];
    setFileFields(
      fileFields
        ?.filter((data, index) => index !== fileDeletionIndex)
        ?.map((data) => data)
    );
    if (fileIdToDelete) {
      await DELETE(
        `contract-managment-service/contracts/contractFile/${fileIdToDelete}`
      ).then((response) => {
        SuccessToaster("Document Deleted Successfully");
      });
    }
    getDeleteExecutedContractDialog(false);
    setFileDeletionIndex();
  };

  const onClose = () => {
    getActiveApplicationView(false);
  };

  const filteredData = form?.formSchemas?.filter((data) => data?.formCategory === "Acknowledgement");
  console.log("filteredDataaaaaaaaaaa" + JSON.stringify(filteredData));

  const relevantForm = form?.forms?.filter(schema => schema?.schemaCategory !== "UploadYourDoc");

  console.log("relevantForm" + JSON.stringify(relevantForm))

  const lastSubmittedLog = logDetails?.logs?.find((log) => log.workflowStatus === "SUBMITTED");
  const lastSubmittedDate = lastSubmittedLog ? lastSubmittedLog.lastModifiedDate : null;
  const formattedSubmissionDate = lastSubmittedDate ? format(new Date(lastSubmittedDate), "MM/dd/yyyy") : "-";
  const reappointmentDate = form?.createdDate;
  const reappointmentStartDate = reappointmentDate ? format(new Date(reappointmentDate), "MM/dd/yyyy") : "-";
  const paymentmentDate = form?.payment?.paidDateTime;
  const paymentmentPaidDate = paymentmentDate ? format(new Date(paymentmentDate), "MM/dd/yyyy 'at' h:mm a") : "-";
  const isUploadYourDoc = form?.forms[1]?.schemaCategory === 'UploadYourDoc';
  const isMedicalDirectives = form?.forms[9]?.schemaCategory === 'MEDICAL_DIRECTIVES';
  const allVerified = form?.forms[1]?.data?.table?.every(item => item.isVerified === true);
  const allVerifiedMD = form?.forms[9]?.data?.table?.every(item => item.isVerified === true);

  const buttonStyle = (isUploadYourDoc && !allVerified) ? { opacity: 0.5, pointerEvents: 'none' } : {};


  const getButtonStyle = () => {
    if (isUploadYourDoc && !allVerified) {
      return { opacity: 0.5, pointerEvents: 'none' };
    }
    return {};
  };

  // const buttonStyle = getButtonStyle();
  // const approvalDate = logDetails?.approvedDate;
  // const approvalDateLog = logDetails?.logs?.map((log,index) => log.approvedDate);
  // console.log("approvalDate" + approvalDateLog);

  // const approvalFromDate = approvalDateLog ? format(new Date(approvalDateLog), "MMM dd, yyyy") : "-";
  //   const approvalDateLog = logDetails?.logs?.map((log, index) => log.approvedDate);

  // const approvalFromDate = approvalDateLog && approvalDateLog[0] 
  //   ? format(new Date(approvalDateLog[0]), "MMM dd, yyyy") 
  //   : "-";
  const approvalFromDate = logDetails?.logs?.map((log) => {
    try {
      // Safely format each log's approved date
      return log?.createdDate
        ? format(new Date(log.createdDate), "MMM dd, yyyy, H.mm")
        : "-";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  });
  const createNoteDate = form?.noteDetails?.map((log) => {
    try {
      // Safely format each log's approved date
      return log?.createdDate
        ? format(new Date(log?.createdDate), "MMM dd, yyyy")
        : "-";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  });
  const finishTime = new Date("05/01/2020");

  // const submissionDate = finishTime ? new Date(finishTime) : null;
  const submissionDate = lastSubmittedDate ? new Date(lastSubmittedDate) : null;

  // Get the current date
  const currentDatenow = new Date();

  let daysDifference;
  if (submissionDate) {
    // Calculate the difference in days
    daysDifference = differenceInDays(currentDatenow, submissionDate) + 1;

  } else {
    daysDifference = "-";
  }

  console.log(daysDifference);

  // Check if logDetails.logs is an array before calling forEach
  // if (logDetails?.logs && Array.isArray(logDetails?.logs)) {
  //   logDetails.logs.forEach(log => {
  //     if (log.form && log.form.id) {
  //       console.log("form id: " + log.form.id);
  //       const isMatch = form?.forms?.some(f => f.id === log.form.id);
  //       console.log(isMatch ? "true" : "false");

  //       if (isMatch) {
  //         console.log("Rolesssss: " + userRole?.includes(log?.role));

  //         // Define role based on selectedTab
  //         let selectedTabRole;
  //         if (selectedTab === 'level-2') {
  //           selectedTabRole = "Department Head";
  //         } else if (selectedTab === 'level-3') {
  //           selectedTabRole = "Chief Of Staff";
  //         } else if (selectedTab === 'level-4') {
  //           selectedTabRole = "Advisory Committee";
  //         } else if (selectedTab === 'level-5') {
  //           selectedTabRole = "Board";
  //         } else if (selectedTab === 'level-1') {
  //           selectedTabRole = "Staff Manager";
  //         }

  //         // Check if selectedTabRole matches log.role
  //         if (selectedTabRole === log.role) {
  //           console.log("Selected tab role matches log role: " + log.role);
  //         } else {
  //           console.log("Selected tab role does NOT match log role");
  //         }
  //       }
  //     }
  //   });
  // } else {
  //   console.error("logDetails.logs is not an array or is undefined.");
  // }

  // logDetails?.logs?.forEach((log, index) => {
  //   console.log(`Role at index ${index}: ${log?.role}`);
  // });

  // const checkApprovalAndLogMatch = (data, index) => {
  //   // Check if the expand status and index match
  //   if (!(expand?.status && expand?.index === index + 1)) {
  //     console.log("expand" + expand?.status)
  //     return false;

  //   }

  //   // Check if any newData requires approval
  //   const approvalRequired = credApproval?.some((newData) => {
  //     console.log("newData.approvalRequired:", newData?.approvalRequired);
  //     return newData.schemaId === data?.id && newData?.approvalRequired;
  //   });

  //   if (!approvalRequired) return false;

  //   // Check if logDetails.logs is an array and has elements
  //   if (logDetails?.logs && Array.isArray(logDetails.logs)) {
  //     return logDetails.logs.some((log) => {
  //       if (log?.form?.id === form?.forms[index]?.id) {
  //         console.log("Checking log.form.id === form.forms[index].id:", log?.form?.id, form?.forms[index]?.id);

  //         // Check if userRole includes log.role
  //         const roleMatch = userRole?.includes(log?.role);
  //         if (roleMatch) {
  //           console.log("Role matches user role: " + log?.role);
  //         }

  //         // Determine selectedTabRole based on selectedTab
  //         const selectedTabRole = getSelectedTabRole(selectedTab);

  //         // Check if selectedTabRole matches log.role
  //         if (selectedTabRole === log.role) {
  //           console.log("Selected tab role matches log role: " + log?.role);
  //           return true;
  //         }
  //       }
  //       return false;
  //     });
  //   }

  //   return false;
  // };

  const getStaffPrivilege = async () => {
    if (form) {
      const { data: privilege } = await GET(
        `entity-service/staffPrivilege?department=${form?.basicDetailReferences?.department?.id}`
      );
      setStaffPrivilege(privilege);
      const { data: allPrivilege } = await GET(
        `entity-service/staffPrivilege`
      );
      setAllStaffPrivilege(allPrivilege)
    }
  }

  const handleChange = (privilegeId) => {
    setSelectedPrivilege(privilegeId);
    setSelectedPrivilegeForDisplay(staffPrivilege?.filter(data => data?.id === privilegeId))
  }

  const handleChangeAdditional = (privilegeId) => {
    setSelectedPrivilege(privilegeId);
    setSelectedAdditionalPrivilegeForDisplay(
      allStaffPrivilege?.filter((data) => data?.id === privilegeId)
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
            {selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
              ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
              selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges
                ?.privilegesByCategories?.[0]?.privileges?.length !==
              undefined && (
                <div className={style.twoCol}>
                  <div
                  // onClick={() => handleSign("Core", "Additional")}
                  >
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
                                    // onChange={(e) =>
                                    //   handleRestrictedSelection(
                                    //     index,
                                    //     categoriesIndex,
                                    //     privilegesIndex,
                                    //     e.target.value,
                                    //     "response",
                                    //     'Additional'
                                    //   )
                                    // }
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
                                          // onChange={(event, editor) => {
                                          //   const data = editor.getData();
                                          //   handleRestrictedSelection(
                                          //     index,
                                          //     categoriesIndex,
                                          //     privilegesIndex,
                                          //     data,
                                          //     "notes",
                                          //     'Additional'
                                          //   );
                                          // }}
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
                                              "Insert any privilege competency and qualification information...",
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
                                              competence
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
                                        // onChange={(e) => {
                                        //   handleRestrictedFileSelection(
                                        //     index,
                                        //     categoriesIndex,
                                        //     privilegesIndex,
                                        //     e.target.files[0],
                                        //     "file",
                                        //     'Additional'
                                        //   );
                                        // }}
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
                                              // onClick={() => {
                                              //   handleRestrictedSelection(
                                              //     index,
                                              //     categoriesIndex,
                                              //     privilegesIndex,
                                              //     null,
                                              //     "removeFile",
                                              //     'Additional'
                                              //   );
                                              // }}
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
                  // onClick={() => {
                  //   handleSign("Restricted", "Additional");
                  // }}
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


  const getFields = () => {
    console.log(selectedPrivilegeForDisplay, 'valueCheck')
    if (selectedPrivilege !== "" && selectedPrivilegeForDisplay?.length !== 0) {
      return (
        <>
          <div className={style.padding}>
            <div className={style.cardTitle}>{`${staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeSetTitle)[0] !== undefined ? staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeSetTitle)[0]?.toUpperCase() : ''}`}</div>

            {
              selectedPrivilegeForDisplay?.map((data) => data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, index) => (
                <div>
                  <div className={style.categoryGrid}>
                    <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                  </div>
                  <>{
                    categories?.privileges?.map(privileges => (
                      <div className={style.privilegeCodeGrid}>
                        <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                        <div className={style.itemLeft}>{privileges?.title || ''}</div>
                      </div>

                    ))
                  }
                  </>
                </div>
              )

              )

              )
            }

          </div>
          {selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== 0 && selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined && (
            <div className={style.padding}>
              <div className={style.cardDescription}>{'The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below.'}</div>

              {
                selectedPrivilegeForDisplay?.map((data, index) => data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories, categoriesIndex) => (
                  <div key={`${index}${categoriesIndex}`}>
                    <>
                      {
                        categories?.privileges?.map((privileges, privilegesIndex) => (
                          <div className={`${style.restrictedPrivilegeGrid} ${privilegesIndex === 0 ? style.marginTop : ''}`} key={`${index}${privilegesIndex}`}>
                            <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                            <div className={style.itemLeft}>{privileges?.title || ''}</div>
                            <div className={style.floatRight}>
                              <CommonRadio
                                value={privileges?.response || ''}
                                onChange={(e) => { }}
                                radioValue={['NO', 'YES']}
                                label={['No', 'Yes']}
                              />
                            </div>
                            {privileges?.response === 'YES' && (privileges?.isevidenceRequired || privileges?.isevidenceRequired === undefined) && (
                              <>
                                <div className={style.marginTop20}>
                                  <CKEditor
                                    editor={ClassicEditor}
                                    data={privileges?.notes?.notes || ''}
                                    onChange={(event, editor) => {
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
                                    config={{
                                      placeholder: 'Insert any privilege competency and qualification information...',
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
                                {/* <div className={style.marginTop10}>
                                                                <div className={`${style.uploadButton}`}>
                                                                    <div className={style.uploadGrid}>
                                                                        <label for={`file-upload-dynamic-basic${privilegesIndex}`} className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>
                                                                            Upload any supporting documents for evidence of qualification and competence
                                                                        </label>
                                                                        <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />

                                                                    </div>
                                                                </div>
                                                                <input id={`file-upload-dynamic-basic${privilegesIndex}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                                                    onChange={(e) => { handleRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }}
                                                                />
                                                            </div> */}
                                {/* <div className={style.marginTop10}>
                                  <div className={`${style.uploadButton}`}>
                                    <div className={style.uploadGrid}>
                                      {(privileges?.file !== undefined && privileges?.file !== null) ? (
                                        <img src={VerifiedImage} alt="" className={`${style.imgIcon} `} />
                                      ) : (
                                        <img src={ToBeVerifiedImage} alt="" className={style.imgIcon} />
                                      )}
                                      <div className={`${style.uploadText} ${style.verticalAlignCenter}`}>
                                        Upload any supporting documents for evidence of qualification and competence
                                      </div>
                                      <div>
                                        <label for={`file-upload-dynamic-basic${privilegesIndex}`} className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}>Click to upload</label>
                                      </div>
                                    </div>
                                  </div>
                                  <input id={`file-upload-dynamic-basic${privilegesIndex}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }} />
                                </div> */}
                                {privileges?.file !== null && privileges?.file?.fileName !== undefined && (
                                  <div className={`${style.fileDisplay} ${style.fileDisplayText} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                    <div className={style.displayInRow}>
                                      <div onClick={() => { window.open(privileges?.file?.fileURL, '_blank'); }}>
                                        {privileges?.file?.fileType === 'application/pdf' ?
                                          <img src={PdfDoc} alt="" className={style.docTypeImgStyle} />
                                          : privileges?.file?.fileType?.startsWith("image/") ?
                                            <img src={ImgDoc} alt="" className={style.docTypeImgStyle} /> : <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} />}
                                      </div>
                                      <div className={style.marginLeft}>{privileges?.file?.fileName}</div>
                                    </div>
                                    {/* <div>
                                      <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { handleRestrictedSelection(index, categoriesIndex, privilegesIndex, null, 'removeFile') }} />
                                    </div> */}
                                  </div>
                                )}
                                <br />
                              </>
                            )}
                          </div>

                        ))
                      }
                    </>
                  </div>
                )

                )

                )
              }

            </div>
          )}
        </>
      )
    }
  }

  // Helper function to get the selectedTab role
  const getSelectedTabRole = (selectedTab) => {
    switch (selectedTab) {
      case 'level-2': return "Department Head";
      case 'level-3': return "Chief Of Staff";
      case 'level-4': return "Advisory Committee";
      case 'level-5': return "Board";
      case 'level-1': return "Staff Manager";
      default: return "";
    }
  };

  // const showDot = checkApprovalAndLogMatch();

  // console.log("showDot" + checkApprovalAndLogMatch())

  const renderFieldsBasedOnStep = (data) => {
    let formIndex = form?.forms?.findIndex(formData => formData?.schemaCategory === data?.schemaCategory);
    switch (data?.schemaCategory) {
      case "UploadYourDoc":
        console.log("UploadYourDoc Table Data:", form?.forms?.[formIndex]?.data?.table);
        return (
          <>
            {form?.forms?.[formIndex]?.data?.table?.length !== 0 && (
              <TableTwo
                tableHeaderValues={[
                  "",
                  "File Uploaded",
                  "Size",
                  "Document Type",
                  "Requirement",
                  "Verified",
                  "Valid",
                  "",
                ]}
                tableDataValues={getApplicantValues(form?.forms?.[formIndex]?.data?.table)}
                tableData={form?.forms?.[formIndex]?.data?.table || []}
                gridStyle={style.uploadYourDocGrid}
                actions={[]}
                // scrollStyle={style.contractScrollStyle}
                tableSortValues={[]}
                heading={"There are no Record for you to manage"}
                onClickFunction={() => { }}
                isUploadYourDocTable={isUploadYourDoc}
              />
            )}
          </>
        );
      case "CME":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              'education' in formSchema?.properties && (
                <ApplicationFieldCard object={formSchema?.properties?.education} baseKey={'education'} basicForm={form} setBasicForm={setForm} addMoreType={true} formId={form?.forms?.[formIndex]?.id} applicationId={applicationId} tableGrid={style.tableGridCME} isPOD={true}
                  heading={'Information Requirement Alert'}
                  subHeading={'For this application you are required to provide information on all of the different undergraduate / graduate qualifications you have.'}
                  subHeading2={'You will not be able to submit your application if this is not provided.'} />
              )}
          </>
        );
      case "MEDICAL_DIRECTIVES":
        return (
          <>
            <TableTwo
              tableHeaderValues={[
                "",
                "Title",
                "MD ID",
                "Type",
                "Attestation Due Date",
                "",
              ]}
              tableDataValues={getMedicalDirectiveTable()}
              tableData={medicalDirectives}
              gridStyle={style.medicalDirectivesGridStyle}
              actions={[]}
              // scrollStyle={style.contractScrollStyle}
              tableSortValues={[]}
              heading={"There are no Record for you to manage"}
              onClickFunction={() => { }}
            />
          </>
        );
      case "MISCELLANEOUS_QUESTIONS":
        return (
          <>
            <div>
              <div>
                <div className={style.cardTitle}>
                  {formSchema?.properties?.isModulesForReAppointmentCompleted?.label}
                </div>
                {form?.forms?.[formIndex]?.data?.lms?.yesOrNo !== undefined && (
                  <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={form?.forms?.[formIndex]?.data?.lms?.yesOrNo === 'Yes' ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.lms?.yesOrNo}</span></strong> on {format(new Date(form?.forms?.[formIndex]?.data?.lms?.updatedDate), "MMM dd, yyyy")}</div>
                )}
              </div>
              <div className={`${style.marginTop20}`}>
                <div className={style.cardTitle}>
                  {formSchema?.properties?.doYouPrescribeSuboxone?.label}
                </div>
                {form?.forms?.[formIndex]?.data?.suboxone?.yesOrNo !== undefined && (
                  <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={form?.forms?.[formIndex]?.data?.suboxone?.yesOrNo === 'Yes' ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.suboxone?.yesOrNo}</span></strong> on {format(new Date(form?.forms?.[formIndex]?.data?.suboxone?.updatedDate), "MMM dd, yyyy")}</div>
                )}
              </div>
              {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') && (
                <div className={`${style.marginTop20}`}>
                  <div className={style.cardTitle}>
                    {formSchema?.properties?.wishToBeMRP?.label}
                  </div>
                  {form?.forms?.[formIndex]?.data?.mrp?.yesOrNo !== undefined && (
                    <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={form?.forms?.[formIndex]?.data?.mrp?.yesOrNo === 'Yes' ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.mrp?.yesOrNo}</span></strong> on {format(new Date(form?.forms?.[formIndex]?.data?.mrp?.updatedDate), "MMM dd, yyyy")}</div>
                  )}
                </div>
              )}
            </div>
          </>
        );
      case "HOSPITAL_COVERAGE":
        return (
          <>
            <div className={`${style.warningCard} ${style.marginTop10}`}>
              <div className={style.cardTitle}>24 hours coverage of hospital patients, including those in the ER, is a requirement of Professional Staff responsibilities. The physician must provide an acceptable method to respond to hospital calls.</div>
            </div>
            <div className={style.marginTop20}>
              <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.forms?.[formIndex]?.data?.whoCovers !== undefined ? form?.forms?.[formIndex]?.data?.whoCovers : ''}</strong></div>
            </div>
            {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Obstetrics & Gynecology') && (
              <div className={style.marginTop20}>
                <div className={`${style.cardTitle}`}>
                  {`If you are practicing obstetrics, who covers your patients when you are not available?*`}
                </div>
                <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.forms?.[formIndex]?.data?.whoCoversObstetrics !== undefined ? form?.forms?.[formIndex]?.data?.whoCoversObstetrics : ''}</strong></div>
              </div>
            )}
          </>
        );
      case "DemographicData":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined && 'applicant' in formSchema?.properties && (
                <ApplicationFieldCard object={formSchema?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
              )}
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress1" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress1}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.homeMailingAddressGrid}
                  baseKey={"contactAddress1"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress2" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress2}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.mailingAddressGrid}
                  baseKey={"contactAddress2"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress3" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress3}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.businessMailingAddressGrid}
                  baseKey={"contactAddress3"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "ApplicantAcknowledgement":
        return (
          <>
            <iframe
              src={
                form?.forms?.[formIndex]?.uploadedFiles[
                  form?.forms?.[formIndex]?.uploadedFiles?.length - 1
                ]?.fileURL
              }
              width="100%"
              height="600px"
            ></iframe>
          </>
        );
      case "ContactAddress":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress1" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress1}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.homeMailingAddressGrid}
                  baseKey={"contactAddress1"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress2" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress2}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.mailingAddressGrid}
                  baseKey={"contactAddress2"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "contactAddress3" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.contactAddress3}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.businessMailingAddressGrid}
                  baseKey={"contactAddress3"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "Qualification":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "certifications" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.certifications}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.licenseGrid}
                  baseKey={"certifications"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "MalpracticeInfo":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "insuranceCarrierInformation" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.insuranceCarrierInformation}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.insuranceGrid}
                  baseKey={"insuranceCarrierInformation"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "Education":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "graduation" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.graduation}
                  basicForm={form}
                  gridStyle={style.EducationGrid}
                  baseKey={"graduation"}
                  addMoreType={true}
                  formId={form?.forms?.[formIndex]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridGraduation}
                  isPOD={true}
                  heading={"Information Requirement Alert"}
                  subHeading={
                    "For this application you are required to provide information on all of the different undergraduate / graduate qualifications you have."
                  }
                  subHeading2={
                    "You will not be able to submit your application if this is not provided."
                  }
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[formIndex]?.data?.graduation?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div
                    className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                    key={index}
                  >
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.fileName}
                    </div>
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.classification !== null
                        ? data?.file?.classification
                        : "-"}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.cursorPointer}`}
                      onClick={() => {
                        setFile(data?.file);
                        setShowDocVerifyDialog(true);
                        setSelectedRow(data);
                        setSelectedRowTableName("graduation");
                        setSelectedFormId(form?.forms?.[4]?.id);
                      }}
                    >
                      {data?.file?.isVerified !== undefined &&
                        data?.file?.isVerified ? (
                        <>
                          <img
                            src={Verified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={ToBeVerified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verify
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </>
        );
      case "WorkExperience":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "trainingAndWorkingExperience" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.trainingAndWorkingExperience}
                  basicForm={form}
                  gridStyle={style.trainingGrid}
                  baseKey={"trainingAndWorkingExperience"}
                  addMoreType={true}
                  formId={form?.forms?.[formIndex]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridTrainingAndExperience}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[formIndex]?.data?.trainingAndWorkingExperience?.map(
                (data, index) =>
                  data?.file?.fileURL !== undefined ? (
                    <div
                      className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                      key={index}
                    >
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.fileName}
                      </div>
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.classification !== null
                          ? data?.file?.classification
                          : "-"}
                      </div>
                      <div
                        className={`${style.displayInRow} ${style.cursorPointer}`}
                        onClick={() => {
                          setFile(data?.file);
                          setShowDocVerifyDialog(true);
                          setSelectedRow(data);
                          setSelectedRowTableName(
                            "trainingAndWorkingExperience"
                          );
                          setSelectedFormId(form?.forms?.[formIndex]?.id);
                        }}
                      >
                        {data?.file?.isVerified !== undefined &&
                          data?.file?.isVerified ? (
                          <>
                            <img
                              src={Verified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verified
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={ToBeVerified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verify
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )
              )}
            </div>
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "healthcareFacilityAppointments" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={
                    formSchema?.properties?.healthcareFacilityAppointments
                  }
                  basicForm={form}
                  gridStyle={style.healthCareGrid}
                  baseKey={"healthcareFacilityAppointments"}
                  addMoreType={true}
                  formId={form?.forms?.[formIndex]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridTrainingAndExperience}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[5]?.data?.healthcareFacilityAppointments?.map(
                (data, index) =>
                  data?.file?.fileURL !== undefined ? (
                    <div
                      className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                      key={index}
                    >
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.fileName}
                      </div>
                      <div
                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                      >
                        {data?.file?.classification !== null
                          ? data?.file?.classification
                          : "-"}
                      </div>
                      <div
                        className={`${style.displayInRow} ${style.cursorPointer}`}
                        onClick={() => {
                          setFile(data?.file);
                          setShowDocVerifyDialog(true);
                          setSelectedRow(data);
                          setSelectedRowTableName(
                            "healthcareFacilityAppointments"
                          );
                          setSelectedFormId(form?.forms?.[formIndex]?.id);
                        }}
                      >
                        {data?.file?.isVerified !== undefined &&
                          data?.file?.isVerified ? (
                          <>
                            <img
                              src={Verified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verified
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={ToBeVerified}
                              alt=""
                              className={style.verifyImage}
                            />
                            <div
                              className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                            >
                              <div
                                className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                              >
                                Verify
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )
              )}
            </div>
          </>
        );
      case "References":
        console.log(formSchema);
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "references" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.references}
                  basicForm={form}
                  gridStyle={style.twoCol}
                  baseKey={"references"}
                  setBasicForm={setForm}
                  addMoreType={true}
                  formId={form?.forms?.[formIndex]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridReferences}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[7]?.data?.references?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div
                    className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                    key={index}
                  >
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.fileName}
                    </div>
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.classification !== null
                        ? data?.file?.classification
                        : "-"}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.cursorPointer}`}
                      onClick={() => {
                        setFile(data?.file);
                        setShowDocVerifyDialog(true);
                        setSelectedRow(data);
                        setSelectedRowTableName("references");
                        setSelectedFormId(form?.forms?.[formIndex]?.id);
                      }}
                    >
                      {data?.file?.isVerified !== undefined &&
                        data?.file?.isVerified ? (
                        <>
                          <img
                            src={Verified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={ToBeVerified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verify
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
            <CommonDivider />
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "privilegeReferences" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.privilegeReferences}
                  basicForm={form}
                  gridStyle={style.twoCol}
                  baseKey={"privilegeReferences"}
                  setBasicForm={setForm}
                  addMoreType={true}
                  formId={form?.forms?.[formIndex]?.id}
                  applicationId={applicationId}
                  tableGrid={style.tableGridReferences}
                  isPOD={true}
                />
              )}
            <div className={style.marginTop20}>
              {form?.forms?.[formIndex]?.data?.privilegeReferences?.map((data, index) =>
                data?.file?.fileURL !== undefined ? (
                  <div
                    className={`${style.documentBackground} ${style.documentCardGrid} ${style.marginTop10}`}
                    key={index}
                  >
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.fileName}
                    </div>
                    <div
                      className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                    >
                      {data?.file?.classification !== null
                        ? data?.file?.classification
                        : "-"}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.cursorPointer}`}
                      onClick={() => {
                        setFile(data?.file);
                        setShowDocVerifyDialog(true);
                        setSelectedRow(data);
                        setSelectedRowTableName("privilegeReferences");
                        setSelectedFormId(form?.forms?.[formIndex]?.id);
                      }}
                    >
                      {data?.file?.isVerified !== undefined &&
                        data?.file?.isVerified ? (
                        <>
                          <img
                            src={Verified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.greenButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={ToBeVerified}
                            alt=""
                            className={style.verifyImage}
                          />
                          <div
                            className={`${style.purpleButtonSmall} ${style.cursorPointer} ${style.marginLeft20}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyleSmall} ${style.alignCenter}`}
                            >
                              Verify
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </>
        );
      case "ProfessionalConduct":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "conductDisclosure1" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.conductDisclosure1}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"conductDisclosure1"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "conductDisclosure2" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.conductDisclosure2}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"conductDisclosure2"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "CriminalHistory":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "criminalData1" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.criminalData1}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"criminalData1"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "criminalData2" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.criminalData2}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"criminalData2"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "MedicalHistory":
        return (
          <>
            {formSchema !== undefined &&
              formSchema?.properties !== null &&
              formSchema?.properties !== undefined &&
              "impactingPractice" in formSchema?.properties && (
                <ApplicationFieldCard
                  object={formSchema?.properties?.impactingPractice}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"impactingPractice"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "PrivilegeSelection":
        return (
          <>
            <div className={style.padding}>
              <div className={style.cardTextBoldStyle}>Selected Privileges</div>
              {form?.privileges?.obligatedPrivileges?.map((data, index) => (
                <div
                  className={`${style.documentTextStyle} ${style.marginLeft} ${style.marginTop10}`}
                  key={index}
                >
                  <div className={`${style.privilegeTitleStyle} ${style.cursorPointer}`} onClick={() => { setShowCurrentPrivileges(true); handleChange(data?.id) }}>{data?.privilegeSetTitle}</div>
                </div>
              ))}
              {form?.privileges?.additionalPrivileges?.length !== 0 && (
                <div className={`${style.cardTextBoldStyle} ${style.marginTop20}`}>Selected Additional Privileges</div>
              )}
              {form?.privileges?.additionalPrivileges?.map((data, index) => (
                <div
                  className={`${style.documentTextStyle} ${style.marginLeft} ${style.marginTop10}`}
                  key={index}
                >
                  <div className={`${style.privilegeTitleStyle} ${style.cursorPointer}`} onClick={() => { setShowCurrentPrivileges(true); handleChange(data?.id) }}>{data?.privilegeSetTitle}</div>
                </div>
              ))}
            </div>
          </>
        );
      default:
        return <></>;
    }
  };

  const renderFieldsBasedOnStepReappointment = (data, index) => {
    let formIndex = form?.forms?.findIndex(formData => formData?.schemaCategory === data?.schemaCategory);
    switch (data?.schemaCategory) {
      case "UploadYourDoc":
        return (
          <>
            {form?.forms?.[formIndex]?.data?.table?.length !== 0 && (
              <TableTwo
                tableHeaderValues={[
                  "",
                  "File Uploaded",
                  "Document Type",
                  "Requirement",
                  "Verified",
                  "Valid",
                  "",
                ]}
                tableDataValues={getApplicantValues(form?.forms?.[formIndex]?.data?.table, index)}
                tableData={form?.forms?.[formIndex]?.data?.table || []}
                gridStyle={style.uploadYourDocGrid}
                actions={[]}
                // scrollStyle={style.contractScrollStyle}
                tableSortValues={[]}
                heading={"There are no Record for you to manage"}
                onClickFunction={() => { }}
                isUploadYourDocTable={isUploadYourDoc}
                hasVerificationAttempted={hasVerificationAttempted}
              />
            )}
          </>
        );
      case "CME":
        return (
          <>
            <>
              {form?.forms?.[formIndex]?.data?.cmeTranscripts?.length !== 0 && form?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName !== undefined && (
                <div className={`${style.fileDisplayGrid} ${style.fileDisplayCME} ${style.marginTop} ${style.verticalAlignCenter}`}>
                  <div><strong>CME / CEU Transcript</strong></div>
                  <div className={style.leftAlign}>{form?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName}</div>
                  <img
                    src={VerifiedImage}
                    alt=""
                    className={`${style.imgIcon} ${style.cursorPointer}`}
                    onClick={() => {
                      setShowFileDisplayDialog(true); setselectedFile(form?.forms?.[formIndex]?.data?.cmeTranscripts?.file);
                    }
                    }
                  />
                </div>
              )}
              <div className={`${style.cmeCreditsGrid} ${style.marginTop}`}>
                <div>
                  <div className={style.cmeCard}>
                    <div className={style.creditsHeading}>CME CREDITS / HOURS</div>
                    <div className={`${style.twoCol} ${style.marginTop}`}>
                      {/* <Tooltip
                        title="Click Here to Edit"
                        arrow
                        {...(!form?.forms?.[formIndex]?.data?.cmeTranscripts?.file && { open: false })}
                      > */}
                      <div className={`${style.cmeHourCard} `}
                      // onClick={() => {
                      //   const fileData = form?.forms?.[formIndex]?.data?.cmeTranscripts?.file;
                      //   const rowId = form?.forms?.[formIndex]?.data?.cmeTranscripts?.rowId;
                      //   if (!fileData) {
                      //     setShowFileWithFields(false);
                      //   } else {
                      //     setShowFileWithFields(true);
                      //     getDocument(rowId);
                      //   }
                      // }}
                      >
                        <div className={style.totalText}>Your Total</div>
                        <div className={style.hourText}>{form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours}</div>
                        <div className={style.totalText}>Credits / Hours</div>
                        {(25 - form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours) > 0 && (
                          <div className={style.hourRemainingText}>{25 - form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours} more needed</div>
                        )}
                      </div>
                      {/* </Tooltip> */}
                      <div className={style.cmeHourCard}>
                        <div className={style.totalText}>Required</div>
                        <div className={style.hourText}>25</div>
                        <div className={style.totalText}>Credits / Hours</div>
                      </div>
                    </div>
                  </div>
                </div>
                {form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? (
                  <div>
                    <div className={style.lableStyle}>Indicate why you were not able to complete the required number of Credits / Hours*</div>
                    <div className={style.marginTop10}>
                      <CKEditor
                        editor={ClassicEditor}
                        data={form?.forms?.[formIndex]?.data?.notes !== undefined ? form?.forms?.[formIndex]?.data?.notes : ''}
                        // onChange={(event, editor) => {
                        //   const data = editor.getData();
                        //   setNotes(data);
                        // }}
                        onReady={(editor) => {
                          editor.editing.view.change((writer) => {
                            writer.setStyle(
                              "height",
                              "150px",
                              editor.editing.view.document.getRoot()
                            );
                          });
                        }}
                        disabled
                        config={{
                          placeholder: "Type your content here...",
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
                  </div>
                ) : (
                  <div className={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? style.disabled : ''}>
                    <div className={`${style.checkGrid}`}>
                      {allFormSchemas?.[index]?.formSchema?.disclaimer?.content !== undefined && (
                        <span>
                          <CommonCheckBox checked={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? false : form?.forms?.[formIndex]?.acknowledged}
                            // onChange={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? () => { } : (e) => handleIsChecked(e.target.checked)} 
                            bigCheckbox={true} />
                        </span>
                      )}
                      <div
                        className={`${style.leftAlign} ${style.marginTop10}`}
                        dangerouslySetInnerHTML={{ __html: allFormSchemas?.[index]?.formSchema?.disclaimer?.content }}
                      />
                    </div>
                    {form?.forms?.[formIndex]?.esign?.name !== undefined && (
                      <div className={style.eSignGrid}>
                        <div
                        >
                          <ESignature
                            userName={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? '' : form?.forms?.[formIndex]?.esign?.name !== undefined ? form?.forms?.[formIndex]?.esign?.name : ""}
                            encData={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? "" : form?.forms?.[formIndex]?.esign?.esign !== undefined ? form?.forms?.[formIndex]?.esign?.esign : ""}
                            showData={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? false : form?.forms?.[formIndex]?.esign?.esign !== undefined}
                            showDatais={true}
                          />
                        </div>
                        <div className={style.verticalAlignCenter}>
                          <div className={style.displayInRow}>
                            <div className={style.dateTitle}>Date: </div>
                            <div className={`${style.date} ${style.marginLeft}`}>{form?.forms?.[formIndex]?.esign?.signedDate ? (form?.forms?.[formIndex]?.esign?.signedDate !== '' && form?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? form?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </>
            {/* <CommonDivider /> */}
            {allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              'cmeCertificates' in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.cmeCertificates} baseKey={'cmeCertificates'} basicForm={form} setBasicForm={setForm} addMoreType={true} formId={form?.forms?.[formIndex]?.id} applicationId={applicationId} tableGrid={style.tableGridCME} isPOD={true}
                  heading={'No Documents Uploaded.'}
                // subHeading={'For this application you are required to provide information on the CME certificates.'}
                // subHeading2={'You will not be able to submit your application if this is not provided.'} 
                />
              )}
          </>
        );
      case "MEDICAL_DIRECTIVES":
        return (
          <>
            <div className={`${style.totalText} ${style.leftAlign}`}>
              All Medical Directives that required Attestation for this reappointment period for this Medical Staff have been attested.
            </div>
            <div className={style.marginTop}>
              <TableTwo
                tableHeaderValues={[
                  "",
                  "Title",
                  "MD ID",
                  "Type",
                  "Attestation Date",
                  "",
                ]}
                tableDataValues={getMedicalDirectiveTable(form?.forms?.[formIndex]?.data?.table, index)}
                tableData={form?.forms?.[formIndex]?.data?.table || []}
                gridStyle={style.medicalDirectivesGridStyle}
                actions={[]}
                // scrollStyle={style.contractScrollStyle}
                tableSortValues={[]}
                heading={"There are no Record for you to manage"}
                onClickFunction={() => { }}
                hidePagination={true}
              />
            </div>
          </>
        );
      case "MISCELLANEOUS_QUESTIONS":
        return (
          <>
            <div>
              <div>
                <div className={style.cardTitle}>
                  {allFormSchemas?.[index]?.formSchema?.schema?.properties?.isModulesForReAppointmentCompleted?.properties?.response?.label}
                </div>
                {form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response !== undefined && (
                  <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={(form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === 'Yes' || form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === true) ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === true ? 'Yes' : form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === false ? "No" : form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response}</span></strong> on {(form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date !== '' && form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date !== undefined) ? format(new Date(form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date), "MMM dd, yyyy") : ''}</div>
                )}
              </div>
              <div className={`${style.marginTop20}`}>
                <div className={style.cardTitle}>
                  {allFormSchemas?.[index]?.formSchema?.schema?.properties?.doYouPrescribeSuboxone?.properties?.response?.label}
                </div>
                {form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response !== undefined && (
                  <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={(form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === 'Yes' || form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === true) ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === true ? 'Yes' : form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === false ? "No" : form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response}</span></strong> on {(form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date !== '' && form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date !== undefined) ? format(new Date(form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date), "MMM dd, yyyy") : ''}</div>
                )}
              </div>
              {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') && (
                <div className={`${style.marginTop20}`}>
                  <div className={style.cardTitle}>
                    {allFormSchemas?.[index]?.formSchema?.schema?.properties?.wishToBeMRP?.properties?.response?.label}
                  </div>
                  {form?.forms?.[formIndex]?.data?.wishToBeMRP?.response !== undefined && (
                    <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={(form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === true || form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === 'Yes') ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === true ? "Yes" : form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === false ? 'No' : form?.forms?.[formIndex]?.data?.wishToBeMRP?.response}</span></strong> on {(form?.forms?.[formIndex]?.data?.wishToBeMRP?.date !== '' && form?.forms?.[formIndex]?.data?.wishToBeMRP?.date !== undefined) ? format(new Date(form?.forms?.[formIndex]?.data?.wishToBeMRP?.date), "MMM dd, yyyy") : ''}</div>
                  )}
                </div>
              )}
              <div className={`${style.warningCard} ${style.marginTop20}`}>
                <div className={style.cardTitle}>24 hours coverage of hospital patients, including those in the ER, is a requirement of Professional Staff responsibilities. The physician must provide an acceptable method to respond to hospital calls.</div>
              </div>
              <div className={style.marginTop20}>
                <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.coverageDetails?.providerType !== undefined ? form?.coverageDetails?.providerType : ''} : {form?.coverageDetails?.providerType !== "Department / Specialty Group" ? form?.coverageDetails?.providerDetails?.length !== 0 ? form?.coverageDetails?.providerDetails?.map(data => data?.name)?.join(', ') : '' : `${form?.basicDetails?.departmentSpecialty?.department} ${(form?.basicDetails?.departmentSpecialty?.specialty !== null && form?.basicDetails?.departmentSpecialty?.specialty !== undefined) ? `- ${form?.basicDetails?.departmentSpecialty?.specialty}` : ''}`}</strong></div>
              </div>
              {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Obstetrics & Gynecology') && (
                <div className={style.marginTop20}>
                  <div className={`${style.cardTitle}`}>
                    {`If you are practicing obstetrics, who covers your patients when you are not available?*`}
                  </div>
                  <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.coverageDetails?.obstetricsProviderType !== undefined ? form?.coverageDetails?.obstetricsProviderType : ''} : {form?.coverageDetails?.obstetricsProviderType !== "Department / Specialty Group" ? form?.coverageDetails?.obstetricsProviderDetails?.length !== 0 ? form?.coverageDetails?.obstetricsProviderDetails?.map(data => data?.name)?.join(', ') : '' : `${form?.basicDetails?.departmentSpecialty?.department} ${(form?.basicDetails?.departmentSpecialty?.specialty !== null && form?.basicDetails?.departmentSpecialty?.specialty !== undefined) ? `- ${form?.basicDetails?.departmentSpecialty?.specialty}` : ''}`}</strong></div>
                </div>
              )}
            </div>
          </>
        );
      case "HOSPITAL_COVERAGE":
        return (
          <>
            <div className={`${style.warningCard} ${style.marginTop10}`}>
              <div className={style.cardTitle}>24 hours coverage of hospital patients, including those in the ER, is a requirement of Professional Staff responsibilities. The physician must provide an acceptable method to respond to hospital calls.</div>
            </div>
            <div className={style.marginTop20}>
              <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.forms?.[formIndex]?.data?.specificProviderGroup !== undefined ? form?.forms?.[formIndex]?.data?.specificProviderGroup : ''} : {form?.forms?.[formIndex]?.data?.whoCovers !== undefined ? form?.forms?.[formIndex]?.data?.whoCovers : ''}</strong></div>
            </div>
            {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Obstetrics & Gynecology') && (
              <div className={style.marginTop20}>
                <div className={`${style.cardTitle}`}>
                  {`If you are practicing obstetrics, who covers your patients when you are not available?*`}
                </div>
                <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.forms?.[formIndex]?.data?.whoCoversObstetrics !== undefined ? form?.forms?.[formIndex]?.data?.whoCoversObstetrics : ''}</strong></div>
              </div>
            )}
          </>
        );
      case "DemographicData":
        return (
          <>
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined && 'applicant' in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
              )}
            <CommonDivider />
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "contactAddress1" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.contactAddress1}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.homeMailingAddressGrid}
                  baseKey={"contactAddress1"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "contactAddress3" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.contactAddress3}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.businessMailingAddressGrid}
                  baseKey={"contactAddress3"}
                  isPOD={true}
                />
              )}
            <CommonDivider />
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "contactAddress2" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.contactAddress2}
                  basicForm={form}
                  setBasicForm={setForm}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.mailingAddressGrid}
                  baseKey={"contactAddress2"}
                  isPOD={true}
                />
              )}
          </>
        );
      case "ApplicantAcknowledgement":
        const fileURL = form?.forms?.[formIndex]?.uploadedFiles?.[
          form?.forms?.[formIndex]?.uploadedFiles?.length - 1
        ]?.fileURL;
        return fileURL ? (
          <>
            <iframe
              src={`${form?.forms?.[formIndex]?.uploadedFiles[
                form?.forms?.[formIndex]?.uploadedFiles?.length - 1
              ]?.fileURL}#toolbar=0&view=FitH`
              }
              width="100%"
              height="600px"
            // style={{ width: "100%", height: "600px", objectFit: "cover }}
            ></iframe>
          </>
        ) : (
          <div className={style.acknowledgmentErrorTextStyle}>No Data To Show</div>
        );
      case "ScheduleA":
        const fileURLScheduleA = form?.forms?.[formIndex]?.uploadedFiles?.[
          form?.forms?.[formIndex]?.uploadedFiles?.length - 1
        ]?.fileURL;
        return fileURLScheduleA ? (
          <>
            <iframe
              src={`${form?.forms?.[formIndex]?.uploadedFiles[
                form?.forms?.[formIndex]?.uploadedFiles?.length - 1
              ]?.fileURL}#toolbar=0&view=FitH`
              }
              width="100%"
              height="600px"
            // style={{ width: "100%", height: "600px", objectFit: "cover }}
            ></iframe>
          </>
        ) : (
          <div className={style.acknowledgmentErrorTextStyle}>No Data To Show</div>
        );
      case "ScheduleB":
        const fileURLScheduleB = form?.forms?.[formIndex]?.uploadedFiles?.[
          form?.forms?.[formIndex]?.uploadedFiles?.length - 1
        ]?.fileURL;
        return fileURLScheduleB ? (
          <>
            <iframe
              src={`${form?.forms?.[formIndex]?.uploadedFiles[
                form?.forms?.[formIndex]?.uploadedFiles?.length - 1
              ]?.fileURL}#toolbar=0&view=FitH`
              }
              width="100%"
              height="600px"
            // style={{ width: "100%", height: "600px", objectFit: "cover }}
            ></iframe>
          </>
        ) : (
          <div className={style.acknowledgmentErrorTextStyle}>No Data To Show</div>
        );
      case "ProfessionalConduct":
        return (
          <>
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "disclosures" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.disclosures}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"disclosures"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
            {/* {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "conductDisclosure2" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.conductDisclosure2}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"conductDisclosure2"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )} */}
          </>
        );
      case "CriminalHistory":
        return (
          <>
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "disclosures" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.disclosures}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"disclosures"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
            {/* {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "criminalData2" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.criminalData2}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"criminalData2"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )} */}
          </>
        );
      case "MedicalHistory":
        return (
          <>
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "disclosures" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.disclosures}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.medicalHistoryGrid}
                  baseKey={"disclosures"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "PRIVILEGE_STATUS_AT_HOSPITAL":
        return (
          <>
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "disclosures" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.disclosures}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"disclosures"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "PATIENT_CONCERN_DISCLOSURE":
        return (
          <>
            {allFormSchemas?.[index]?.formSchema?.schema !== undefined &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== null &&
              allFormSchemas?.[index]?.formSchema?.schema?.properties !== undefined &&
              "disclosures" in allFormSchemas?.[index]?.formSchema?.schema?.properties && (
                <ApplicationFieldCard
                  object={allFormSchemas?.[index]?.formSchema?.schema?.properties?.disclosures}
                  basicForm={form}
                  stepPath={`forms[${formIndex}].data`}
                  gridStyle={style.conductGrid}
                  baseKey={"disclosures"}
                  collapsableQuestionCard={true}
                  isPOD={true}
                />
              )}
          </>
        );
      case "PrivilegeSelection":
        return (
          <>
            <div className={`${style.applicationCardStyleReappointment} ${style.marginTop10}`}>
              <div className={`${style.privilegeCard} ${style.marginTop10}`}>
                <div>
                  <div className={style.privilegeHeading}>
                    <strong>Privilege Category</strong>
                  </div>
                  <div className={style.twoCol}>
                    <div
                      className={`${style.privilegeContentCard} ${style.marginTop10}`}
                    >
                      <div className={style.privilegeHeadingCurrent}>Current</div>
                      <div className={style.privilegeHeading}>
                        {(form?.basicDetails?.priorPrivilegeCategory !== null && form?.basicDetails?.priorPrivilegeCategory?.name !== null)
                          ? form?.basicDetails?.priorPrivilegeCategory
                            ?.name
                          : form?.basicDetails
                            ?.credentialingPrivilegeCategory
                            ?.credentialingCategory}
                      </div>
                    </div>
                    {form?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo !== undefined && (
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
                                form?.basicDetails
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
                        {(form?.basicDetails?.priorDepartmentSpecialty !== null && form?.basicDetails?.priorDepartmentSpecialty?.department !== null) ? form?.basicDetails?.priorDepartmentSpecialty?.department : (form?.basicDetails?.departmentSpecialty !== null && form?.basicDetails?.departmentSpecialty?.department !== null) ? form?.basicDetails?.departmentSpecialty?.department : 'None'}
                      </div>
                    </div>
                    {form?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined && (
                      <div
                        className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                      >
                        <div className={style.privilegeHeadingReappointment}>
                          Change for Reappointment
                        </div>
                        <div className={style.privilegeHeading}>
                          {form?.forms?.[formIndex]?.data?.departmentChangeYesOrNo === "No" ? (
                            <div className={style.privilegeHeading}>
                              {form?.basicDetails?.departmentSpecialty?.department}
                            </div>
                          ) : (
                            <div className={style.privilegeHeading}>
                              {form?.basicDetails?.priorDepartmentSpecialty?.department !== null ? form?.basicDetails?.priorDepartmentSpecialty?.department === form?.basicDetails?.departmentSpecialty?.department ? 'Same as Before' : form?.basicDetails?.departmentSpecialty?.department : form?.basicDetails?.departmentSpecialty?.department}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {(form?.privileges?.priorObligatedPrivileges?.length !== 0 || form?.privileges?.obligatedPrivileges?.length !== 0) && (
                    <>
                      <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                        <strong>Privilege Sets</strong>
                      </div>
                      <div className={style.twoCol}>
                        <div
                          className={`${style.privilegeContentCard} ${style.marginTop10}`}
                        >
                          <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                          {form?.privileges?.priorObligatedPrivileges?.length === 0 ?
                            // form?.privileges?.obligatedPrivileges?.length === 0 ? 
                            (
                              <div className={style.privilegeHeading}>None</div>
                            )
                            //  : (
                            //   <>
                            //     {form?.privileges?.obligatedPrivileges?.map(
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
                                {form?.privileges?.priorObligatedPrivileges?.map(
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
                        {form?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined && (
                          <div
                            className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                          >
                            <div className={`${style.privilegeHeadingReappointment}`}>
                              Change for Reappointment
                            </div>
                            {privilegeSetChangeYesOrNo === "Yes" ? (
                              <>
                                <div className={style.privilegeHeading}>
                                  Same Privileges Requested
                                </div>
                                {form?.privileges?.obligatedPrivileges?.map(
                                  (data) => (
                                    <div
                                      className={`${style.privilegeHeading} `}
                                    // onClick={() => {
                                    //   setShowCurrentPrivileges(true);
                                    //   setCurrentPrivilegesCategory('Basic')
                                    //   setSelectedPrivilege(data?.id);
                                    // }}
                                    >
                                      {data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}
                                    </div>
                                  )
                                )}
                              </>
                            ) : (
                              <>
                                {form?.privileges?.obligatedPrivileges?.map(
                                  (data) => (
                                    <div
                                      className={`${style.privilegeHeading} `}
                                    // onClick={() => {
                                    //   setShowCurrentPrivileges(true);
                                    //   setCurrentPrivilegesCategory('Basic')
                                    //   setSelectedPrivilege(data?.id);
                                    // }}
                                    >
                                      {data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}
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
                  {(form?.privileges?.priorAdditionalPrivileges?.length !== 0 || form?.privileges?.additionalPrivileges?.length !== 0) && (
                    <div>
                      <div className={`${style.privilegeHeading} ${style.marginTop10}`}><strong>Additional Privileges</strong></div>
                      <div className={style.twoCol}>
                        <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                          <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                          {form?.privileges?.priorAdditionalPrivileges?.length === 0 ? (
                            <>
                              {form?.privileges?.additionalPrivileges?.length === 0 ? (
                                <div className={style.privilegeHeading}>None</div>
                              ) : (
                                <>
                                  {form?.privileges?.additionalPrivileges?.map(data => (
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
                              {form?.privileges?.priorAdditionalPrivileges?.map(data => (
                                <div
                                  className={`${style.privilegeHeading} `}
                                // onClick={() => { setShowCurrentPrivileges(true); setCurrentPrivilegesCategory('Additional') }}
                                >{data?.privilegeSetTitle}</div>
                              ))}
                            </>
                          )}
                        </div>
                        {form?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined && (
                          <div className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}>
                            <div className={`${style.privilegeHeadingReappointment}`}>{additionalPrivilegeChangeYesOrNo === 'No' ? 'Privileges Requested' : 'Change for Reappointment'}</div>
                            {additionalPrivilegeChangeYesOrNo === 'No' ? (
                              <div className={`${style.privilegeHeading}`}>None</div>
                            ) : (
                              <>
                                <div className={style.privilegeHeading}>
                                  Additional Privilege Requested
                                </div>
                                {form?.privileges?.additionalPrivileges?.map(data => (
                                  <div
                                    className={`${style.privilegeHeading}`}
                                  // onClick={() => { setShowCurrentPrivileges(true); setCurrentPrivilegesCategory('Additional'); setSelectedPrivilege(data?.id) }}
                                  >{data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}</div>
                                ))}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {((form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges !== null) && (form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.length !== 0)) && (
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
                            {(form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.length !== 0)
                              ? form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.map(data => (
                                <div>{data?.privileges}</div>
                              )) : (form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.length !== 0)
                                ? form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.map(data => (
                                  <div>{data?.privileges}</div>
                                ))
                                : 'None'}
                          </div>
                        </div>
                        {form?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== '' && form?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined && (
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
                                      <div className={style.privilegeHeading}>{`${form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.map(priorData => priorData?.privileges)?.includes(data?.privileges) ? 'Existing: ' : 'New: '} ${data?.hospitalName} - ${data?.privileges}`}</div>
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
            </div>
            <div className={`${style.cardTitle} ${style.marginTop30}`}>
              Do you want to keep your current Privilege Category?
            </div>
            <div className={`${style.borderStyleTiles}`}></div>
            {privilegeChangeYesOrNo !== '' && (
              <div
                className={`${style.marginTop10} ${style.marginLeft30}`}
              >
                <div className={style.privilegeHeading}>
                  {privilegeChangeYesOrNo === "Yes" ? (
                    <div className={`${style.fontSize}`}>
                      {`Same as Before - ${form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}`}
                    </div>
                  ) : (
                    <div className={`${style.privilegeHeading} ${style.marginTop10} ${style.fontSize}`}>
                      Changed From {(form?.basicDetails?.priorPrivilegeCategory !== null && form?.basicDetails?.priorPrivilegeCategory?.name !== null)
                        ? form?.basicDetails?.priorPrivilegeCategory
                          ?.name
                        : form?.basicDetails
                          ?.credentialingPrivilegeCategory
                          ?.credentialingCategory} To {" "}
                      {
                        form?.basicDetails
                          ?.credentialingPrivilegeCategory
                          ?.credentialingCategory
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* <div className={`${style.cardTitle}  ${style.marginTop30}`}>
                    Requested Privilege Set(s) for Reappointment
                  </div> */}
            {(selectedPrivilegeForDisplay?.length > 0 ||
              selectedPrivilegeForDisplay?.privilegeDetails?.corePrivileges) && (
                <>
                  <div className={`${style.cardTitle} ${style.marginTop30}`}>
                    Requested Privilege Sets for Reappointment
                  </div>
                  <div className={`${style.borderStyleTiles}`}></div>
                </>
              )}
            {/* <div className={`${style.borderStyleTiles}`}></div> */}

            {selectedPrivilegeForDisplay?.map((data, dataIndex) => (
              <div key={dataIndex}>
                <div
                  className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                >
                  {data?.privilegeSetTitle}
                </div>
                {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, catIndex) => (
                  <div key={catIndex} >
                    <div className={`${style.flex}`}>
                      <div className={style.itemLeft}>
                        <strong>{categories?.category || ""}</strong>
                      </div>
                    </div>
                    {categories?.privileges?.map((privilege, privIndex) => (
                      <div key={privIndex} className={style.privilegeCodeGrid}>
                        <div className={style.itemLeft}>
                          <strong>{privilege?.privilegeId || ""}</strong>
                        </div>
                        <div className={style.itemLeft}>{privilege?.title || ""}</div>
                      </div>
                    ))}

                  </div>
                ))}
                <div className={style.twoCol}>
                  {selectedPrivilegeForDisplay?.[0] && (
                    <>
                      <div>
                        <ESignature
                          userName={
                            selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.name || ""
                          }
                          encData={
                            selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.esign || ""
                          }
                          showData={!!selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign}
                          showDatais={true}
                        />
                      </div>
                      <div className={style.verticalAlignCenter}>
                        <div className={style.displayInRow}>
                          <div className={style.dateTitle}>Date:</div>
                          <div className={`${style.date} ${style.marginLeft}`}>
                            {
                              selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate ||
                              ""
                            }
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {(data?.privilegeDetails
                  ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                  ?.length !== 0 &&
                  data?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                    ?.length !== undefined) && (
                    <div>
                      <div className={`${style.cardTitle} ${style.advanceBoxStyle} ${style.marginTop30}`}>
                        Advanced Privileges
                      </div>
                      <div key={dataIndex}>
                        <div
                          className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                        >
                          {data?.privilegeSetTitle}
                        </div>
                        {data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories) => {
                          return (
                            <div>
                              <div className={style.flex}>
                                <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                              </div>
                              <>{
                                categories?.privileges?.map(privileges => (
                                  <div className={style.privilegeCodeGrid}>
                                    <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                    <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                  </div>

                                ))
                              }
                              </>
                            </div>
                          )
                        })}
                        <div className={style.twoCol}>
                          <>
                            <div>
                              <ESignature
                                userName={
                                  data?.privilegeDetails
                                    ?.restrictedPrivileges?.esign !== null
                                    ? data?.privilegeDetails
                                      ?.restrictedPrivileges?.esign?.name
                                    : ""
                                }
                                encData={
                                  data?.privilegeDetails
                                    ?.restrictedPrivileges?.esign !== null
                                    ? data?.privilegeDetails
                                      ?.restrictedPrivileges?.esign?.esign
                                    : ""
                                }
                                showData={
                                  data?.privilegeDetails
                                    ?.restrictedPrivileges?.esign !== null &&
                                    data?.privilegeDetails
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
                                  {data?.privilegeDetails
                                    ?.restrictedPrivileges?.esign !== null
                                    ? data?.privilegeDetails
                                      ?.restrictedPrivileges?.esign?.signedDate
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </>
                        </div>
                      </div>
                    </div>
                  )}

                {dataIndex !== selectedPrivilegeForDisplay.length - 1 && (
                  <div className={`${style.borderStyleTiles} ${style.marginTop10}`}></div>
                )}
              </div>
            ))}
            <>
              {(selectedAdditionalPrivilegeForDisplay?.length > 0 ||
                selectedAdditionalPrivilegeForDisplay?.privilegeDetails?.corePrivileges) && (
                  <>
                    <div className={`${style.cardTitle} ${style.marginTop30}`}>
                      Requested Additional Privilege Sets for Reappointment
                    </div>
                    <div className={`${style.borderStyleTiles}`}></div>
                  </>
                )}
              {/* <div className={`${style.borderStyleTiles}`}></div> */}

              {selectedAdditionalPrivilegeForDisplay?.map((data, dataIndex) => (
                <div key={dataIndex}>
                  <div
                    className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                  >
                    {data?.privilegeSetTitle}
                  </div>
                  {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, catIndex) => (
                    <div key={catIndex} >
                      <div className={`${style.flex}`}>
                        <div className={style.itemLeft}>
                          <strong>{categories?.category || ""}</strong>
                        </div>
                      </div>
                      {categories?.privileges?.map((privilege, privIndex) => (
                        <div key={privIndex} className={style.privilegeCodeGrid}>
                          <div className={style.itemLeft}>
                            <strong>{privilege?.privilegeId || ""}</strong>
                          </div>
                          <div className={style.itemLeft}>{privilege?.title || ""}</div>
                        </div>
                      ))}

                    </div>
                  ))}
                  <div className={style.twoCol}>
                    {data && (
                      <>
                        <div>
                          <ESignature
                            userName={
                              data?.privilegeDetails?.corePrivileges?.esign?.name || ""
                            }
                            encData={
                              data?.privilegeDetails?.corePrivileges?.esign?.esign || ""
                            }
                            showData={!!data?.privilegeDetails?.corePrivileges?.esign}
                            showDatais={true}
                          />
                        </div>
                        <div className={style.verticalAlignCenter}>
                          <div className={style.displayInRow}>
                            <div className={style.dateTitle}>Date:</div>
                            <div className={`${style.date} ${style.marginLeft}`}>
                              {
                                data?.privilegeDetails?.corePrivileges?.esign?.signedDate ||
                                ""
                              }
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {(data?.privilegeDetails
                    ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                    ?.length !== 0 &&
                    data?.privilegeDetails
                      ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                      ?.length !== undefined) && (
                      <div>
                        <div className={`${style.cardTitle} ${style.advanceBoxStyle} ${style.marginTop30}`}>
                          Advanced Privileges
                        </div>
                        <div key={dataIndex}>
                          <div
                            className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                          >
                            {data?.privilegeSetTitle}
                          </div>
                          {data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories) => {
                            return (
                              <div>
                                <div className={style.flex}>
                                  <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                                </div>
                                <>{
                                  categories?.privileges?.map(privileges => (
                                    <div className={style.privilegeCodeGrid}>
                                      <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                      <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                    </div>

                                  ))
                                }
                                </>
                              </div>
                            )
                          })}
                          <div className={style.twoCol}>
                            <>
                              <div>
                                <ESignature
                                  userName={
                                    data?.privilegeDetails
                                      ?.restrictedPrivileges?.esign !== null
                                      ? data?.privilegeDetails
                                        ?.restrictedPrivileges?.esign?.name
                                      : ""
                                  }
                                  encData={
                                    data?.privilegeDetails
                                      ?.restrictedPrivileges?.esign !== null
                                      ? data?.privilegeDetails
                                        ?.restrictedPrivileges?.esign?.esign
                                      : ""
                                  }
                                  showData={
                                    data?.privilegeDetails
                                      ?.restrictedPrivileges?.esign !== null &&
                                      data?.privilegeDetails
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
                                    {data?.privilegeDetails
                                      ?.restrictedPrivileges?.esign !== null
                                      ? data?.privilegeDetails
                                        ?.restrictedPrivileges?.esign?.signedDate
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </>
                          </div>
                        </div>
                      </div>
                    )}
                  {dataIndex !== selectedAdditionalPrivilegeForDisplay?.length - 1 && (
                    <div className={`${style.borderStyleTiles} ${style.marginTop10}`}></div>
                  )}
                </div>
              ))}
              {/* {(selectedAdditionalPrivilegeForDisplay?.length > 0 ||
                selectedAdditionalPrivilegeForDisplay?.privilegeDetails?.restrictedPrivileges) && (
                  <div className={`${style.cardTitle} ${style.advanceBoxStyle} ${style.marginTop30}`}>
                    Advanced Privileges
                  </div>
                )}
              {
                selectedAdditionalPrivilegeForDisplay?.map((data, dataIndex) =>
                (<div key={dataIndex}>
                  <div
                    className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                  >
                    {data?.privilegeSetTitle}
                  </div>
                  {data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories) => {
                    return (
                      <div>
                        <div className={style.flex}>
                          <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                        </div>
                        <>{
                          categories?.privileges?.map(privileges => (
                            <div className={style.privilegeCodeGrid}>
                              <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                              <div className={style.itemLeft}>{privileges?.title || ''}</div>
                            </div>

                          ))
                        }
                        </>
                      </div>
                    )
                  })}
                  <div className={style.twoCol}>
                    {data && (
                      <>
                        <div>
                          <ESignature
                            userName={
                              data?.privilegeDetails
                                ?.restrictedPrivileges?.esign !== null
                                ? data?.privilegeDetails
                                  ?.restrictedPrivileges?.esign?.name
                                : ""
                            }
                            encData={
                              data?.privilegeDetails
                                ?.restrictedPrivileges?.esign !== null
                                ? data?.privilegeDetails
                                  ?.restrictedPrivileges?.esign?.esign
                                : ""
                            }
                            showData={
                              data?.privilegeDetails
                                ?.restrictedPrivileges?.esign !== null &&
                                data?.privilegeDetails
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
                              {data?.privilegeDetails
                                ?.restrictedPrivileges?.esign !== null
                                ? data?.privilegeDetails
                                  ?.restrictedPrivileges?.esign?.signedDate
                                : ""}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {dataIndex !== selectedAdditionalPrivilegeForDisplay.length - 1 && (
                    <div className={`${style.borderStyleTiles}  ${style.marginTop10}`}></div>
                  )}
                </div>)
                )} */}
              {/* <div className={`${style.cardTitle} ${style.advanceBoxStyle}  ${style.marginTop10}`}>
                Application Payment Status
                <span className={`${style.marginLeft30}  ${form?.payment?.paymentCompleted ? style.paidTextStyle : style.unpaidTextStyle}`}>
                  {form?.payment?.paymentCompleted ? 'Paid' : 'Unpaid'}
                </span>
                </div>
                <div className={`${style.threeColumnGrid}`}>
                <div className={`${style.alignStart} ${style.marginTop10}`}>
                  <div>Amount</div>
                  <div className={`${style.borderStyleTiles}`}></div>
                  <div  className={`${style.marginLeft30} ${style.marginTop10}`}>{form?.payment?.currency || ""} {form?.payment?.fee || ""}</div>
                </div>
                <div className={`${style.alignStart} ${style.marginTop10}`}>
                  <div>Transaction ID / Confirmation Number</div>
                  <div className={`${style.borderStyleTiles}`}></div>
                  <div className={`${style.marginLeft30} ${style.marginTop10} `}>{form?.payment?.receiptId || ""}</div>
                </div>
                <div className={`${style.alignStart} ${style.marginTop10}`}>
                  <div>Payment Date & Time</div>
                  <div className={`${style.borderStyleTiles}`}></div>
                  <div className={`${style.marginLeft30} ${style.marginTop10}`}>{paymentmentPaidDate || ""}</div>
                </div>

                </div> */}
            </>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {/* {isLoadingImage && (
      <div  className={style.loadingOverlay}>
        <LoadingScreen/>
      </div>
    )} */}
      {/* {!isLoadingImage && ( */}
      <div style={{
        maxHeight: 'calc(100vh - 10px)',
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "gray transparent",
      }}
      // className={style.calcHeight}
      >

        {/* <ApplicationHeader
        title={`${form?.creationType === "NEW" ? "New Application For" : "Reappointment Application For"}  
         ${form?.basicDetails?.applicant?.name?.firstName !== undefined
          ? form?.basicDetails?.applicant?.name?.firstName
          : "{First Name}"
          } ${form?.basicDetails?.applicant?.name?.lastName !== undefined
            ? form?.basicDetails?.applicant?.name?.lastName.toLowerCase()
            : "{Last Name}"
          }, ${form?.basicDetails?.applicant?.applicantType !== undefined
            ? form?.basicDetails?.applicant?.applicantType
            : "{Applicant Type}"
          }`
        }
        close={true}
        closeClick={onClose}
      /> */}
        <ApplicationHeader
          title={`${form?.creationType === "NEW" ? "New Application For" : "Reappointment Application For"} ${form?.basicDetails?.applicant?.name?.firstName !== undefined &&
            form?.basicDetails?.applicant?.name?.lastName !== undefined
            ? formatFirstNameLastName(
              form?.basicDetails?.applicant?.name?.firstName,
              form?.basicDetails?.applicant?.name?.lastName
            )
            : "{First Name} {Last Name}"
            }, ${form?.basicDetails?.applicant?.applicantType !== undefined
              ? form?.basicDetails?.applicant?.applicantType
              : "{Applicant Type}"
            }`}
          close={true}
          closeClick={onClose}
        />

        {/* <div className={style.marginBottom10}></div> */}

        <div className={`${style.marginLeftRight50} ${style.marginTop10}`}>
          {/* <div
          className={`${style.displayInRow} ${style.spaceBetween} ${style.topHeadingTextStyle} ${style.marginTop20}`}
        >
          {applicationType === "NEW" ?
            `CAP MANAGER > APPLICATIONS >> ${form?.basicDetails?.applicant?.name?.firstName || ""} ${form?.basicDetails?.applicant?.name?.lastName || ""}`
            : `${userRoleTab} DASHBOARD > REAPPOINTMENT APPLICATIONS >>  ${form?.basicDetails?.applicant?.name?.firstName || ""} ${form?.basicDetails?.applicant?.name?.lastName || ""}`}

        </div> */}
          <div className={style.grid2to1}>
            <>
              {(workModeType === 'Staff Manager') || (workModeType === 'Chief Of Staff') || (workModeType === 'Credentialing Committee') || (workModeType === 'Credentialing Committee User') || (workModeType === 'Department Head') ? (
                <>
                  <div>
                    {(selectedTab === "level-1" && applicationType === "REAPPOINTMENT") ? (
                      <div className={style.grid5and2}>
                        <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}>
                          <div className={style.flex}>
                            {/* <div className={style.displayInRow}> */}
                            <div className={`${style.photoBorderStyle}`}>

                              <img
                                src={form?.basicDetails?.applicant?.profilePicture?.fileURL || UserLogo}
                                alt="Profile Picture"
                                className={style.profileImage}
                              />

                            </div>
                            <div className={`${style.twoColumnGrid1} ${style.textAlignLeft}`}>
                              <div className={style.marginTop10}>
                                <span className={`${style.cardTextBoldStyle}`}>
                                  {
                                    form?.basicDetails?.applicant?.name?.firstName !== undefined &&
                                      form?.basicDetails?.applicant?.name?.lastName !== undefined
                                      ? formatFirstNameLastName(
                                        form?.basicDetails?.applicant?.name?.firstName,
                                        form?.basicDetails?.applicant?.name?.lastName
                                      )
                                      : "{First Name} {Last Name}"
                                  },{" "}
                                  {/* {`${formatFirstNameLastName(form?.basicDetail?.applicant?.name?.firstName, form?.basicDetail?.applicant?.name?.lastName)}`} */}
                                  {/* {form?.basicDetails?.applicant?.name?.lastName?.charAt(0).toUpperCase() + form?.basicDetails?.applicant?.name?.lastName?.slice(1).toLowerCase() }{", "}
                                {form?.basicDetails?.applicant?.name?.firstName
                                  ? form?.basicDetails?.applicant?.name?.firstName.charAt(0).toUpperCase() +
                                  form?.basicDetails?.applicant?.name?.firstName.slice(1).toLowerCase()
                                  : ""}{", "} */}
                                  {/* {form?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
                                </span>
                                <span className={`${style.cardTextNormalStyle}`}>
                                  {/* {form?.displayId || ""} */}
                                  {form?.basicDetailReferences?.applicantType?.serviceProviderType || ""}
                                </span>
                              </div>
                              <div className={`${style.marginTop10} ${style.twoColumnGridInner2}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Reappointment Date:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {/* {form?.createdDate} */}
                                  {reappointmentStartDate}
                                </span>
                              </div>
                              {/* <div className={`${style.cardTextNormalStyle} ${style.marginTop10}`}>
                              {form?.providerType?.serviceProviderType || ""} Applying As {form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || ""}
                            </div> */}
                              <div className={`${style.cardTextNormalStyle}`}>
                                {form?.basicDetailReferences?.department?.name ? `${form.basicDetailReferences.department.name}` : ""}
                                {form?.basicDetailReferences?.specialty?.name
                                  ? `${form?.basicDetailReferences?.department?.name ? ", " : ""}${form.basicDetailReferences.specialty.name}`
                                  : ""}
                              </div>
                              <div className={`${style.twoColumnGridInner2}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Application Submitted:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {formattedSubmissionDate} <span className={style.rightAlignTextStyle1}>({daysDifference} Days)</span>
                                </span>
                              </div>
                              {/* <div className={style.spaceBetween}> */}
                              <div className={`${style.emailTextBoldStyle}`}>
                                {form?.basicDetails?.applicant?.cellPhone ? `+1 ${form?.basicDetails?.applicant?.cellPhone}` : ""}
                              </div>
                              <div className={`${style.emailTextBoldStyle}`}>
                                <span className={style.cursorPointer} onClick={() => sendEmail(form?.basicDetails?.applicant?.email?.officialEmail || "")}>{form?.basicDetails?.applicant?.email?.officialEmail || ""}</span>
                              </div>
                              {/* <div className={`${style.emailTextBoldStyle} ${style.marginTop10}`}>
                                {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                              </div> */}
                              {/* </div> */}
                            </div>
                            {/* </div> */}
                            {/* <div className={`${style.displayInRow} ${style.marginRight20}`}>
                            <div className={style.displayInCol}>
                              <div className={`${style.marginTop10} ${style.twoColumnGridInner1}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Reappointment Date:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  
                                  {reappointmentStartDate}
                                </span>
                              </div>
                              <div className={`${style.marginTop10} ${style.twoColumnGridInner1}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Application Submitted:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {formattedSubmissionDate} <span className={style.rightAlignTextStyle1}>({daysDifference} Days)</span>
                                </span>
                              </div>
                              <div className={`${style.emailTextBoldStyle} ${style.marginTop10}`}>
                                {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                              </div> */}
                            {/* <div className={`${style.marginTop5} ${style.twoColumnGridInner1}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Days Since Submission:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {daysDifference} Days
                                </span>
                              </div> */}
                            {/* </div>
                          </div> */}
                          </div>
                        </div>
                        <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.statusCardHeight} ${style.displayInCol}`}>
                          <div className={`${form?.payment?.paymentCompleted ? style.greenBigDotStyle : style.greyBigDotStyle} ${style.marginCenter}`}></div>
                          <div className={style.greyDotTextStyle}>
                            Application Payment Status
                          </div>
                          <div className={style.cursorPointer}> Transaction ID:{" "}
                            <Tooltip title="View Transaction Details" arrow>
                              <span className={`${style.marginTop10} ${style.paymentIDStyle}`} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(form?.payment?.invoice) }}>{form?.payment?.receiptId || "-"}</span>
                            </Tooltip>
                          </div>
                        </div>
                        <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.statusCardHeight} ${style.displayInCol}`}>
                          <div className={`${statusStyle} ${style.marginCenter}`}></div>
                          <div className={style.greyDotTextStyle}>
                            MSO Verification & Acceptance Status
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={style.grid5and1}>
                        <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}>
                          <div className={style.flex}>
                            {/* <div className={style.displayInRow}> */}
                            <div className={`${style.photoBorderStyle}`}>

                              <img
                                src={form?.basicDetails?.applicant?.profilePicture?.fileURL || UserLogo}
                                alt="Profile Picture"
                                className={style.profileImage}
                              />

                            </div>
                            <div className={`${style.twoColumnGrid1} ${style.textAlignLeft}`}>
                              <div className={style.marginTop10}>
                                <span className={`${style.cardTextBoldStyle}`}>
                                  {/* {form?.basicDetails?.applicant?.name?.firstName || ""} {form?.basicDetails?.applicant?.name?.lastName.toLowerCase() || ""},{" "} */}
                                  {
                                    form?.basicDetails?.applicant?.name?.firstName !== undefined &&
                                      form?.basicDetails?.applicant?.name?.lastName !== undefined
                                      ? formatFirstNameLastName(
                                        form?.basicDetails?.applicant?.name?.firstName,
                                        form?.basicDetails?.applicant?.name?.lastName
                                      )
                                      : "{First Name} {Last Name}"
                                  },{" "}
                                  {/* {form?.basicDetails?.applicant?.name?.middleName?.toUpperCase()}{","} */}
                                </span>
                                <span className={`${style.cardTextNormalStyle}`}>
                                  {/* {form?.displayId || ""} */}
                                  {form?.basicDetailReferences?.applicantType?.serviceProviderType || ""}
                                </span>
                              </div>
                              <div className={`${style.marginTop10} ${style.twoColumnGridInner2}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Reappointment Date:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {/* {form?.createdDate} */}
                                  {reappointmentStartDate}
                                </span>
                              </div>
                              {/* <div className={`${style.cardTextNormalStyle} ${style.marginTop10}`}>
                              {form?.providerType?.serviceProviderType || ""} Applying As {form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || ""}
                            </div> */}
                              <div className={`${style.cardTextNormalStyle}`}>
                                {form?.basicDetailReferences?.department?.name ? `${form.basicDetailReferences.department.name}` : ""}
                                {form?.basicDetailReferences?.specialty?.name
                                  ? `${form?.basicDetailReferences?.department?.name ? ", " : ""}${form.basicDetailReferences.specialty.name}`
                                  : ""}
                              </div>
                              <div className={`${style.twoColumnGridInner2}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Application Submitted:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {formattedSubmissionDate} <span className={style.rightAlignTextStyle1}>({daysDifference} Days)</span>
                                </span>
                              </div>
                              {/* <div className={style.spaceBetween}> */}
                              <div className={`${style.emailTextBoldStyle}`}>
                                {form?.basicDetails?.applicant?.cellPhone ? `+1 ${form?.basicDetails?.applicant?.cellPhone}` : ""}
                              </div>
                              <div className={`${style.emailTextBoldStyle}`} onClick={() => sendEmail(form?.basicDetails?.applicant?.email?.officialEmail || "")} style={{ cursor: form?.basicDetails?.applicant?.email?.officialEmail ? 'pointer' : 'default' }}>
                                {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                              </div>
                              {/* <div className={`${style.emailTextBoldStyle} ${style.marginTop10}`}>
                                {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                              </div> */}
                              {/* </div> */}
                            </div>
                            {/* </div> */}
                            {/* <div className={`${style.displayInRow} ${style.marginRight20}`}>
                            <div className={style.displayInCol}>
                              <div className={`${style.marginTop10} ${style.twoColumnGridInner1}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Reappointment Date:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  
                                  {reappointmentStartDate}
                                </span>
                              </div>
                              <div className={`${style.marginTop10} ${style.twoColumnGridInner1}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Application Submitted:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {formattedSubmissionDate} <span className={style.rightAlignTextStyle1}>({daysDifference} Days)</span>
                                </span>
                              </div>
                              <div className={`${style.emailTextBoldStyle} ${style.marginTop10}`}>
                                {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                              </div> */}
                            {/* <div className={`${style.marginTop5} ${style.twoColumnGridInner1}`}>
                                <span className={style.rightAlignTextStyle}>
                                  Days Since Submission:
                                </span>
                                <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                  {daysDifference} Days
                                </span>
                              </div> */}
                            {/* </div>
                          </div> */}
                          </div>
                        </div>
                        <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.statusCardHeight} ${style.displayInCol}`}>
                          <div className={`${style.greenBigDotStyle} ${style.marginCenter}`}></div>
                          <div className={style.greyDotTextStyle}>
                            Overall Review Status
                          </div>
                        </div>
                      </div>
                    )}

                    <>
                      {((workModeType === 'Staff Manager' && selectedTab === "level-1") || (workModeType === 'Chief Of Staff' && selectedTab === "level-1") || (workModeType === 'Staff Manager' && selectedTab === "clarificationsRequired")) ? (
                        <div
                          className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}
                        >

                          <div>
                            {applicationType === "REAPPOINTMENT" && (
                              <div
                                className={`${style.tableHeaderStyle} ${style.tableHeaderStyleCred} ${style.marginTop20} `}
                              >
                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                >
                                  <div
                                    className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                                  ></div>
                                </div>
                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                >
                                  <div className={`${style.tableHeaderTextStyle} ${style.marginLeft20}`}>
                                    Required Reappointment data and Proof of Documentation for July 1, 2025 and June 30, 2026
                                  </div>
                                </div>
                              </div>
                            )}
                            {applicationType === "NEW" && (
                              <div
                                className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle} `}
                              >
                                <>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div
                                      className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                                    ></div>
                                  </div>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div className={`${style.tableHeaderTextStyle}`}>
                                      Required Reappointment data and Proof of Documentation for July 1, 2025 and June 30, 2026
                                    </div>
                                  </div>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div
                                      className={`${style.tableHeaderTextStyle}`}
                                      aria-owns={open ? "mouse-over-popover" : undefined}
                                      aria-haspopup="true"
                                      onMouseEnter={handlePopoverOpen}
                                      onMouseLeave={handlePopoverClose}
                                    >
                                      <img
                                        src={DataStatusIcon}
                                        alt=""
                                        style={{
                                          width: "18px",
                                          height: "20px",
                                        }}
                                      />
                                      <Popover
                                        id={"mouse-over-popover"}
                                        sx={{
                                          pointerEvents: "none",
                                        }}
                                        open={open}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                          vertical: "bottom",
                                          horizontal: "center",
                                        }}
                                        transformOrigin={{
                                          vertical: "top",
                                          horizontal: "center",
                                        }}
                                        onClose={handlePopoverClose}
                                        PaperProps={{
                                          style: {
                                            backgroundColor: "transparent",
                                            boxShadow: "none",
                                            borderRadius: 0,
                                          },
                                        }}
                                        disableRestoreFocus
                                      >
                                        <div className={style.multipleOptionsCard}>
                                          <div
                                            className={`${style.specificActionCard} ${style.cursorPointer}`}
                                          >
                                            Data Quality Status
                                          </div>
                                        </div>
                                      </Popover>
                                    </div>
                                  </div>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div
                                      className={`${style.tableHeaderTextStyle}`}
                                      aria-owns={
                                        openTextWithHover ? "mouse-over-popover" : undefined
                                      }
                                      aria-haspopup="true"
                                      onMouseEnter={handlePopoverTextOpen}
                                      onMouseLeave={handlePopoverTextClose}
                                    >
                                      <img
                                        src={DocumentIcon}
                                        alt=""
                                        style={{
                                          width: "18px",
                                          height: "20px",
                                        }}
                                      />
                                      <Popover
                                        id={"mouse-over-popover"}
                                        sx={{
                                          pointerEvents: "none",
                                        }}
                                        open={openTextWithHover}
                                        anchorEl={anchorTextEl}
                                        anchorOrigin={{
                                          vertical: "bottom",
                                          horizontal: "center",
                                        }}
                                        transformOrigin={{
                                          vertical: "top",
                                          horizontal: "center",
                                        }}
                                        onClose={handlePopoverTextClose}
                                        PaperProps={{
                                          style: {
                                            backgroundColor: "transparent",
                                            boxShadow: "none",
                                            borderRadius: 0,
                                          },
                                        }}
                                        disableRestoreFocus
                                      >
                                        <div className={style.multipleOptionsCard}>
                                          <div
                                            className={`${style.specificActionCard} ${style.cursorPointer}`}
                                          >
                                            Document Status
                                          </div>
                                        </div>
                                      </Popover>
                                    </div>
                                  </div>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div className={`${style.tableHeaderTextStyle}`}>
                                      Documents
                                    </div>
                                  </div>
                                </>
                              </div>
                            )}
                            {/* </div> */}
                            <div>
                              <>
                                {applicationType === "NEW" && (
                                  <div
                                    className={` ${style.marginTop5} ${expand?.status && expand?.index === 0
                                      ? style.tableDataStyle1
                                      : style.tableDataStyle
                                      }`}
                                  >
                                    <div
                                      className={` ${expand?.status && expand?.index === 0
                                        ? style.tableHeaderGridStyleForm
                                        : style.tableHeaderGridStyle
                                        } ${style.marginTop10}`}
                                    >
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.justifySpaceAround
                                            } ${form?.basicInformationStatus
                                              ? style.greenDotStyle
                                              : style.greyDotStyle
                                            }`}
                                        ></div>
                                      </div>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${expand?.status && expand?.index === 0
                                            ? style.tableHeaderTextStyle
                                            : style.tableDataFontStyle1
                                            }`}
                                        >
                                          Applicant Profile Information
                                        </div>
                                      </div>
                                      {expand?.status && expand?.index === 0 ? (
                                        <>
                                          {!form?.basicInformationStatus ? (
                                            <div
                                              className={`${style.purpleButton} ${style.cursorPointer} `}
                                            >
                                              <div
                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                onClick={() => handleVerify()}
                                              >
                                                Verify
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              className={`${style.greenButton}  ${style.cursorPointer} `}
                                            >
                                              <div
                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                              >
                                                Verified
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                                            ></div>
                                          </div>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                                            ></div>
                                          </div>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                            >
                                              -
                                            </div>
                                          </div>
                                        </>
                                      )}

                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                        >
                                          {expand?.status && expand?.index === 0 ? (
                                            <RemoveIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                setExpand({ status: false, index: 0 })
                                              }
                                            />
                                          ) : (
                                            <AddIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                setExpand({ status: true, index: 0 })
                                              }
                                            />
                                          )}{" "}
                                        </div>
                                      </div>
                                    </div>
                                    {expand?.status && expand?.index === 0 && (
                                      <div
                                        className={`${style.marginTop} ${style.screenPadding}`}
                                      >

                                        {form1 !== undefined &&
                                          "applicant" in form1?.properties && (
                                            <ApplicationFieldCard
                                              object={form1?.properties?.applicant}
                                              gridStyle={style.applicantGrid}
                                              baseKey={"applicant"}
                                              basicForm={form}
                                              setBasicForm={setForm}
                                              isBasicPath={true}
                                              isPOD={true}
                                            />
                                          )}
                                        {form1 !== undefined &&
                                          "credentialingPrivilegeCategory" in
                                          form1?.properties && (
                                            <ApplicationFieldCard
                                              object={
                                                form1?.properties?.credentialingPrivilegeCategory
                                              }
                                              gridStyle={style.credentialingGrid}
                                              baseKey={"credentialingPrivilegeCategory"}
                                              basicForm={form}
                                              setBasicForm={setForm}
                                              isBasicPath={true}
                                              isPOD={true}
                                            />
                                          )}
                                        {form1 !== undefined &&
                                          "departmentSpecialty" in form1?.properties && (
                                            <ApplicationFieldCard
                                              object={form1?.properties?.departmentSpecialty}
                                              gridStyle={style.twoCol}
                                              baseKey={"departmentSpecialty"}
                                              basicForm={form}
                                              setBasicForm={setForm}
                                              isBasicPath={true}
                                              isPOD={true}
                                            />
                                          )}
                                        {form1 !== undefined &&
                                          getValueByPath(
                                            form,
                                            "basicDetails.departmentSpecialty.department"
                                          ) ===
                                          form1?.if?.properties?.departmentSpecialty?.properties?.department?.const &&
                                          form1?.if?.properties?.departmentSpecialty?.properties?.specialty?.enum?.includes(
                                            getValueByPath(
                                              form,
                                              "basicDetails.departmentSpecialty.specialty"
                                            )
                                          ) &&
                                          form1 !== undefined &&
                                          "regionalCallResponsibilities" in form1?.properties && (
                                            <ApplicationFieldCard
                                              object={
                                                form1?.properties?.regionalCallResponsibilities
                                              }
                                              gridStyle={""}
                                              baseKey={"regionalCallResponsibilities"}
                                              basicForm={form}
                                              setBasicForm={setForm}
                                              isBasicPath={true}
                                              isPOD={true}
                                            />
                                          )}
                                        {form1 !== undefined &&
                                          "billingNumber" in form1?.properties && (
                                            <ApplicationFieldCard
                                              object={form1?.properties?.billingNumber}
                                              gridStyle={style.twoCol}
                                              baseKey={"billingNumber"}
                                              basicForm={form}
                                              setBasicForm={setForm}
                                              isBasicPath={true}
                                              isPOD={true}
                                            />
                                          )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>

                              {form?.formSchemas
                                ?.filter(
                                  (data) => {
                                    if (form?.creationType === "NEW") {
                                      return (
                                        (data?.formCategory === "Form" || data?.formCategory === "Disclosure") &&
                                        data?.schemaCategory !== "UploadYourDoc"
                                      );
                                    } else {
                                      // Default filter when form?.creationType is not "NEW"
                                      return (
                                        (data?.formCategory === "Form" || data?.formCategory === "Disclosure" || data?.formCategory === "Acknowledgement")
                                        // data?.schemaCategory !== "UploadYourDoc"
                                      );
                                    }
                                  })
                                ?.map((data, index) => (
                                  <div
                                    className={` ${style.marginTop5} ${expand?.status && expand?.index === index + 1
                                      ? style.tableDataStyle1
                                      : style.tableDataStyle
                                      }`}
                                  >
                                    <div
                                      className={` ${applicationType !== "NEW" ? style.tableHeaderGridStyleFormReappointmentForStaff : expand?.index === index + 1
                                        ? style.tableHeaderGridStyleForm
                                        : style.tableHeaderGridStyle
                                        } ${style.marginTop10} ${style.backgroundColorStyle} ${style.paddingTopBottom10}`}
                                    >
                                      {/* <div  className={`${style.backgroundColorStyle}`}> */}
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                      >
                                        <>
                                          <div
                                            className={`${style.marginLeft10} ${style.justifySpaceAround
                                              } ${form?.forms[index]?.status !== "APPROVED"
                                                ? style.greyDotStyle
                                                : style.greenDotStyle
                                              }`}
                                          ></div>
                                        </>
                                      </div>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div className={`${applicationType === "NEW" ? style.tableDataFontStyle1 : style.tableDataFontStyleCredReappointment}`}>
                                          {data?.title}
                                        </div>
                                        {/* <div>
                                        {data?.title}
                                      </div> */}
                                      </div>
                                      {/* </div> */}
                                      {/* {((expand?.status && expand?.index === index + 1) || applicationType !== "NEW") ? (
                                      <>
                                        {credApproval?.some((newData) => {
                                          console.log("newData.approvalRequired:", newData.approvalRequired);
                                          return newData.schemaId === data.id && newData.approvalRequired;
                                        }) && (
                                            <>
                                              {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                (() => {
                                                  const isMatch = logDetails.logs.some((log) => {
                                                    if (log.form && log.form.id) {
                                                      const match = log.form.id === form?.forms[index]?.id;
                                                      console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                      if (match) {
                                                        let Match = false;

                                                        // Check if userRole includes log.role
                                                        if (userRole?.includes(log.role)) {
                                                          console.log("Role matches user role: " + log.role);
                                                          Match = true;
                                                        }

                                                        // Determine selectedTabRole based on selectedTab
                                                        let selectedTabRole;
                                                        if (selectedTab === 'level-2') {
                                                          selectedTabRole = "Department Head";
                                                        } else if (selectedTab === 'level-3') {
                                                          selectedTabRole = "Chief Of Staff";
                                                        } else if (selectedTab === 'level-4') {
                                                          selectedTabRole = "Advisory Committee";
                                                        } else if (selectedTab === 'level-5') {
                                                          selectedTabRole = "Board";
                                                        } else if (selectedTab === 'level-1') {
                                                          selectedTabRole = "Staff Manager";
                                                        }

                                                        // Check if selectedTabRole matches log.role
                                                        if (selectedTabRole === log.role) {
                                                          console.log("Selected tab role matches log role: " + log.role);
                                                          Match = true;
                                                        }

                                                        return Match;
                                                      }
                                                    }
                                                    return false;
                                                  });

                                                  return (
                                                    <div>
                                                      {isMatch ? (
                                                        <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                          <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                            Verified
                                                          </div>
                                                        </div>
                                                      ) : (
                                                        form?.forms[index]?.status !== "APPROVED" ? (
                                                          <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                            <div
                                                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                              onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                            >
                                                              Verify
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                              Verified
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  );
                                                })()
                                              )}
                                            </>
                                          )}
                                      </>
                                    )
                                      : (
                                        <>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10}${style.justifySpaceAround
                                                } ${form?.forms[index]?.status !== "APPROVED"
                                                  ? style.greyDotStyle
                                                  : style.greenDotStyle
                                                }`}
                                            ></div>
                                          </div>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10}${style.justifySpaceAround
                                                } ${form?.forms[index]?.status !== "APPROVED"
                                                  ? style.greyDotStyle
                                                  : style.greenDotStyle
                                                }`}
                                            ></div>
                                          </div>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                            >
                                              {form?.forms
                                                ?.filter(
                                                  (formData, formIndex) => formIndex === index
                                                )
                                                ?.map(
                                                  (data) => data?.uploadedFiles?.length || 0
                                                )}
                                            </div>
                                          </div>
                                        </>
                                      )} */}
                                      {/* {expand?.status && expand?.index === index + 1 ? (
                       <>
                          {credApproval?.filter((newData) => {
                              console.log("newData.schema:", newData.schemaId);
                              console.log("data.id:", data.id);
                              return newData.schemaId === data.id;
                          })[0]?.approvalRequired === true && (
                          <>
                          {logDetails?.logs && Array.isArray(logDetails?.logs) ? (
                            (() => {
                              let Match = false;

                              logDetails.logs.forEach((log) => {
                                if (log.form && log.form.id) {
                                  console.log("form id: " + log.form.id);
                                  
                                  if (form?.forms?.some(f => f.id === log.form.id)) {
                                    console.log("form match found, setting isMatch to true");
                                    Match = true;
                              
                                    // Check if userRole includes log.role
                                    if (userRole?.includes(log?.role)) {
                                      console.log("Role matches user role: " + log.role);
                                      Match = true;
                                    } 
                              
                                    // Determine selectedTabRole
                                    let selectedTabRole;
                                    if (selectedTab === 'level-2') {
                                      selectedTabRole = "Department Head";
                                    } else if (selectedTab === 'level-3') {
                                      selectedTabRole = "Chief Of Staff";
                                    } else if (selectedTab === 'level-4') {
                                      selectedTabRole = "Advisory Committee";
                                    } else if (selectedTab === 'level-5') {
                                      selectedTabRole = "Board";
                                    } else if (selectedTab === 'level-1') {
                                      selectedTabRole = "Staff Manager";
                                    }
                              
                                    // Check if selectedTabRole matches log.role
                                    if (selectedTabRole === log.role) {
                                      console.log("Selected tab role matches log role: " + log.role);
                                      Match = true;
                                    }
                                  } else {
                                    Match = false;
                                  }
                                }
                              });

                              return Match && (
                                <div>
                                  {form?.forms[index]?.status !== "APPROVED" ? (
                                    <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                        onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                      >
                                        Verify
                                      </div>
                                    </div>
                                  ) : (
                                    <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                      <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        Verified
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()
                          ) : null}
                        </>
                      )}

                     </>
                        ) : (
                          <>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                              >
                                {form?.forms
                                  ?.filter(
                                    (formData, formIndex) => formIndex === index
                                  )
                                  ?.map(
                                    (data) => data?.uploadedFiles?.length || 0
                                  )}
                              </div>
                            </div>
                          </>
                        )} */}

                                      {/* {expand?.status && expand?.index === index + 1 ? (
                                <>
                                  {credApproval?.filter((newData) => {
                                    console.log("newData.schema:", newData.schemaId);
                                    console.log("data.id:", data.id);
                                    return newData.schemaId === data.id;
                                  })[0]?.approvalRequired === true && (
                                    <>
                                      {logDetails?.logs && Array.isArray(logDetails?.logs) ? (
                                        (() => {
                                          let isMatch = false;
                                          let selectedTabRole;

                                          logDetails.logs.forEach((log) => {
                                            if (log.form && log.form.id) {
                                              console.log("form id: " + log.form.id);

                                              if (form?.forms?.some(f => f.id === log.form.id)) {
                                                console.log("form match found, setting isMatch to true");
                                                isMatch = true;

                                                // Check if userRole includes log.role
                                                if (userRole?.includes(!log?.role)) {
                                                  console.log("Role matches user role: " + log.role);
                                                  isMatch = false;
                                                } else if (selectedTabRole === log.role) {
                                                  
                                                  if (selectedTab === 'level-2') {
                                                    selectedTabRole = "Department Head";
                                                  } else if (selectedTab === 'level-3') {
                                                    selectedTabRole = "Chief Of Staff";
                                                  } else if (selectedTab === 'level-4') {
                                                    selectedTabRole = "Advisory Committee";
                                                  } else if (selectedTab === 'level-5') {
                                                    selectedTabRole = "Board";
                                                  } else if (selectedTab === 'level-1') {
                                                    selectedTabRole = "Staff Manager";
                                                  }
                                                  isMatch = true;
                                                }
                                              }
                                            }
                                          });

                                          return isMatch && (
                                            <div>
                                              {form?.forms[index]?.status !== "APPROVED" ? (
                                                <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                  <div
                                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                    onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                  >
                                                    Verify
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                  <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                    Verified
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })()
                                      ) : null}
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                    <div
                                      className={`${style.marginLeft10} ${style.justifySpaceAround} ${form?.forms[index]?.status !== "APPROVED" ? style.greyDotStyle : style.greenDotStyle}`}
                                    ></div>
                                  </div>
                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                    <div
                                      className={`${style.marginLeft10} ${style.justifySpaceAround} ${form?.forms[index]?.status !== "APPROVED" ? style.greyDotStyle : style.greenDotStyle}`}
                                    ></div>
                                  </div>
                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                      {form?.forms
                                        ?.filter(
                                          (formData, formIndex) => formIndex === index
                                        )
                                        ?.map(
                                          (data) => data?.uploadedFiles?.length || 0
                                        )}
                                    </div>
                                  </div>
                                </>
                              )} */}


                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        {applicationType === "NEW" && (
                                          <div
                                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                          >
                                            {expand?.status && expand?.index === index + 1 ? (
                                              <RemoveIcon
                                                sx={{
                                                  fontSize: 20,
                                                  color: "#94979A",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                  setExpand({ status: false, index: 0 });
                                                  setFormSchemaId("");
                                                }}
                                              />
                                            ) : (
                                              <AddIcon
                                                sx={{
                                                  fontSize: 20,
                                                  color: "#94979A",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                  setExpand({ status: true, index: index + 1 });
                                                  setFormSchemaId(data?.id);
                                                }}
                                              />
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {applicationType === "NEW" ? (
                                      <>
                                        {expand?.status && expand?.index === index + 1 &&
                                          <div className={`${style.marginTop} ${style.screenPadding}`}>
                                            {renderFieldsBasedOnStep(data)}
                                          </div>
                                        }
                                      </>
                                    ) : (
                                      <>
                                        <div className={`${style.marginTop} ${style.screenPadding}`}>
                                          {renderFieldsBasedOnStepReappointment(data, index)}
                                        </div>
                                      </>
                                    )}
                                    {/* </div> */}
                                    {applicationType === "NEW" ? (
                                      <>
                                        {expand?.status && expand?.index === index + 1 && (
                                          <>
                                            {credApproval?.some((newData) => {
                                              console.log("newData.approvalRequired:", newData.approvalRequired);
                                              return newData.schemaId === data.id && newData.approvalRequired;
                                            }) ? (
                                              <>
                                                {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                  (() => {
                                                    const isMatch = logDetails?.logs?.some((log) => {
                                                      if (log?.form && log?.form?.id) {
                                                        const match = log.form.id === form?.forms[index]?.id;
                                                        console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                        if (match) {
                                                          let Match = false;

                                                          // Check if userRole includes log.role
                                                          if (workModeType === log.role) {
                                                            console.log("Role matches user role: " + log.role);
                                                            Match = true;
                                                          }

                                                          // Determine selectedTabRole based on selectedTab
                                                          let selectedTabRole;
                                                          if (selectedTab === 'level-2') {
                                                            selectedTabRole = "Department Head";
                                                          } else if (selectedTab === 'level-3') {
                                                            selectedTabRole = "Chief Of Staff";
                                                          } else if (selectedTab === 'level-4') {
                                                            selectedTabRole = "Advisory Committee";
                                                          } else if (selectedTab === 'level-5') {
                                                            selectedTabRole = "Board";
                                                          } else if (selectedTab === 'level-1') {
                                                            selectedTabRole = "Staff Manager";
                                                          }

                                                          // Check if selectedTabRole matches log.role
                                                          if (selectedTabRole === log.role) {
                                                            console.log("Selected tab role matches log role: " + log.role);
                                                            Match = true;
                                                          }

                                                          return Match;
                                                        }
                                                      }
                                                      return false;
                                                    });

                                                    return (
                                                      <div>
                                                        {isMatch ? (
                                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                              Approved
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          form?.forms[index]?.status !== "APPROVED" ? (
                                                            <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                              <div
                                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                              >
                                                                Approve
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Approved
                                                              </div>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    );
                                                  })()
                                                )}
                                              </>
                                            ) : (
                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                  Approved
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        {credApproval?.some((newData) => {
                                          console.log("newData.approvalRequired:", newData.approvalRequired);
                                          console.log("newData id:", data.id);
                                          return newData.schemaId === data.id && newData.approvalRequired;
                                        }) ? (
                                          <>
                                            {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                              (() => {
                                                const isMatch = logDetails.logs.some((log) => {
                                                  if (log?.form && log?.form?.id) {
                                                    const match = log?.form?.id === form?.forms[index]?.id;
                                                    console.log("Checking log.form.id === form.forms[index].id:", log?.form?.id, form?.forms[index]?.id, match);

                                                    if (match) {
                                                      let Match = false;

                                                      // Check if userRole includes log.role
                                                      if (workModeType === log?.role) {
                                                        console.log("Role matches user role: " + log.role);
                                                        Match = true;
                                                      }

                                                      // Determine selectedTabRole based on selectedTab
                                                      let selectedTabRole;
                                                      switch (selectedTab) {
                                                        case 'level-2':
                                                          selectedTabRole = "Department Head";
                                                          break;
                                                        case 'level-3':
                                                          selectedTabRole = "Chief Of Staff";
                                                          break;
                                                        case 'level-4':
                                                          selectedTabRole = "Advisory Committee";
                                                          break;
                                                        case 'level-5':
                                                          selectedTabRole = "Board";
                                                          break;
                                                        case 'level-1':
                                                          selectedTabRole = "Staff Manager";
                                                          break;
                                                        default:
                                                          selectedTabRole = null;
                                                      }

                                                      // Check if selectedTabRole matches log.role
                                                      if (selectedTabRole === log.role) {
                                                        console.log("Selected tab role matches log role: " + log.role);
                                                        Match = true;
                                                      }

                                                      return Match;
                                                    }
                                                  }
                                                  return false;
                                                });

                                                return (
                                                  <div key={form?.id}>
                                                    <div className={`${style.flexEnd}`}>
                                                      <div>
                                                        {form?.forms[index]?.schemaCategory === 'UploadYourDoc' ? null : (
                                                          isMatch ? (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <Tooltip title="Click To Revert Verification" arrow>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                  onClick={() => {
                                                                    handleStepsVerifyRevoke(form?.forms[index]?.id);
                                                                  }}
                                                                >
                                                                  Verified <RestartAltOutlinedIcon sx={{
                                                                    fontSize: 20,
                                                                    color: "#ffffff",
                                                                    marginLeft: "10px",
                                                                  }} />
                                                                </div>
                                                              </Tooltip>
                                                            </div>
                                                          ) :
                                                            (
                                                              form?.forms[index]?.status !== "APPROVED" ? (
                                                                <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                  <Tooltip title="Click To Verify">
                                                                    <div
                                                                      className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                      onClick={() => {
                                                                        handleStepsVerify(form?.forms[index]?.id);
                                                                      }}
                                                                    >
                                                                      Verify
                                                                    </div>
                                                                  </Tooltip>
                                                                </div>
                                                              ) : (
                                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                  <Tooltip title="Click To Revert Verification">
                                                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                      onClick={() => {
                                                                        handleStepsVerifyRevoke(form?.forms[index]?.id);
                                                                      }}
                                                                    >
                                                                      Verified <RestartAltOutlinedIcon sx={{
                                                                    fontSize: 20,
                                                                    color: "#ffffff",
                                                                    marginLeft: "10px",
                                                                  }} />
                                                                    </div>
                                                                  </Tooltip>
                                                                </div>
                                                              )
                                                            )
                                                        )}
                                                        {/* {form?.forms[index]?.schemaCategory === 'UploadYourDoc' ? (
                                                    // isMatch ? (
                                                    //   <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                    //     <Tooltip title="Click To Revert Verification">
                                                    //     <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                    //      onClick={() => {
                                                    //       handleStepsVerifyRevoke(form?.forms[index]?.id);
                                                    //   }}
                                                    //     >
                                                    //       Verified
                                                    //     </div>
                                                    //     </Tooltip>
                                                    //   </div>
                                                    // ) : 
                                                    (
                                                      form?.forms[index]?.status !== "APPROVED" ? (
                                                        <div className={`${style.purpleButton} ${style.cursorPointer}`} style={buttonStyle}>
                                                          <Tooltip title="Click To Verify">
                                                            <div
                                                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                              onClick={() => {
                                                                if (
                                                                  !(isUploadYourDoc && !allVerified)
                                                                ) {
                                                                  handleStepsVerify(form?.forms[index]?.id);
                                                                }
                                                              }}
                                                            >
                                                              Verify
                                                            </div>
                                                          </Tooltip>
                                                        </div>
                                                      ) : (
                                                        <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                          <Tooltip title="Click To Revert Verification">
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                              onClick={() => {
                                                                handleStepsVerifyRevoke(form?.forms[index]?.id);
                                                              }}
                                                            >
                                                              Verified
                                                            </div>
                                                          </Tooltip>
                                                        </div>
                                                      )
                                                    )
                                                  ): null} */}
                                                      </div>
                                                      <div className={`${style.whiteButton} ${style.cursorPointer}`} onClick={() => toggleDropdown(index)}>
                                                        <div className={`${style.spaceEvenly}`}>
                                                          <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>
                                                            RFC
                                                          </div>
                                                          {isOpenToggle[index] ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
                                                        </div>
                                                      </div>

                                                    </div>
                                                    {isOpenToggle[index] && (
                                                      <div className={`${style.dropdownContainer}`}>
                                                        <div className={`${style.dropdownItem}`}>Request for Clarification</div>
                                                        <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`} onClick={() => {
                                                          onClickDocumentClarificationRequestFunction(form?.forms[index], "APPLICANT");
                                                        }}>From Applicant</div>
                                                        {/* <div className={`${style.dropDownTextStyle} ${style.marginLeft30} ${style.cursorPointer}`}>From Internal Staff</div> */}
                                                        {/* <div className={`${style.dropDownTextStyle} ${style.marginLeft30}`}>From Institution</div> */}
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })()
                                            )}
                                          </>
                                        ) : (
                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                              Verified
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}

                                  </div>))}
                              {/* {userRole?.includes('Staff Manager') && selectedTab === 'level-1' && applicationType === "REAPPOINTMENT" ? (
                              
                              <div className={`${style.margin20}`}>
                                  <div className={`${style.fourColumnGrid}`}>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        onClick={() => {
                                          onClose();
                                        }}
                                      >
                                        SAVE IN PROGRESS
                                      </div>
                                    </div>
                                    <div
                                      className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                                    >
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                       
                                        onClick={() => {
                                          setShowApplicationDeclineDialog(true);
                                        }}
                                      >
                                        REJECT
                                      </div>
                                    </div>
                                  
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                        // onClick={onClickApproveFunction}
                                        onClick={() => {
                                          ""
                                        }}
                                      >
                                       SEND LATER
                                      </div>
                                    </div>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        onClick={onClickApprovalDeptFunction}
                                        // onClick={onClickApproveMoveFunction}
                                      >
                                        Verified, Send to Dept. Chief
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            ) : ("")} */}
                            </div>
                            {applicationType === "NEW" ? (
                              <div>
                                <div
                                  className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}
                                >
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div
                                      className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}
                                    ></div>
                                  </div>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div className={`${style.tableHeaderTextStyle}`}>
                                      Requested Form Completeness Check
                                    </div>
                                  </div>
                                </div>
                                {form?.formSchemas
                                  ?.filter((data) => data?.formCategory === "Acknowledgement")
                                  ?.map((data, index) => (
                                    <div
                                      className={` ${style.marginTop5} ${expandAcknowledgement?.status &&
                                        expandAcknowledgement?.index === index
                                        ? style.tableDataStyle1
                                        : style.tableDataStyle
                                        }`}
                                    >
                                      <div
                                        className={` ${style.marginTop10} ${expandAcknowledgement?.status &&
                                          expandAcknowledgement?.index === index
                                          ? style.tableHeaderGridStyleForm
                                          : style.tableHeaderGridStyle1
                                          }`}
                                      >
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                        >
                                          <div
                                            className={`${style.marginLeft10} ${style.justifySpaceAround
                                              } ${form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory === "Acknowledgement"
                                              )[index]?.status !== "APPROVED"
                                                ? style.greyDotStyle
                                                : style.greenDotStyle
                                              }`}
                                          ></div>
                                        </div>
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                        >
                                          <div className={`${style.tableDataFontStyle1}`}>
                                            {data?.title}
                                          </div>
                                        </div>
                                        {/* {expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index && (
                            <>
                              {form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED" ? (
                                <div
                                  className={`${style.purpleButton} ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                    onClick={() =>
                                      handleStepsVerify(
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.id
                                      )
                                    }
                                  >
                                    Verify
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`${style.greenButton}  ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  >
                                    Verified
                                  </div>
                                </div>
                              )}
                            </>
                          )} */}
                                        {/* working without credapproval false */}
                                        {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                                          <>
                                            {form?.forms?.filter((data) => data?.formCategory === "Acknowledgement")[index]?.status !== "APPROVED" && (
                                              <>
                                                {credApproval?.some((newData) => newData.schemaId === data.id && newData.approvalRequired) && (
                                                  <>
                                                    {logDetails?.logs && Array.isArray(logDetails.logs) && (() => {
                                                      const isMatch = logDetails.logs.some((log) => {
                                                        if (log.form && log.form.id) {
                                                          const match = log.form.id === form?.forms[index]?.id;
                                                          console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                          if (match) {
                                                            let Match = false;

                                                            // Check if userRole includes log.role
                                                            if (workModeType === log.role) {
                                                              console.log("Role matches user role: " + log.role);
                                                              Match = true;
                                                            }

                                                            // Determine selectedTabRole based on selectedTab
                                                            let selectedTabRole;
                                                            switch (selectedTab) {
                                                              case 'level-1':
                                                                selectedTabRole = "Staff Manager";
                                                                break;
                                                              case 'level-2':
                                                                selectedTabRole = "Department Head";
                                                                break;
                                                              case 'level-3':
                                                                selectedTabRole = "Chief Of Staff";
                                                                break;
                                                              case 'level-4':
                                                                selectedTabRole = "Advisory Committee";
                                                                break;
                                                              case 'level-5':
                                                                selectedTabRole = "Board";
                                                                break;
                                                              default:
                                                                selectedTabRole = "";
                                                            }

                                                            // Check if selectedTabRole matches log.role
                                                            if (selectedTabRole === log.role) {
                                                              console.log("Selected tab role matches log role: " + log.role);
                                                              Match = true;
                                                            }

                                                            return Match;
                                                          }
                                                        }
                                                        return false;
                                                      });

                                                      return (
                                                        <div>
                                                          {isMatch ? (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Verified
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            form?.forms[index]?.status !== "APPROVED" ? (
                                                              <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                <div
                                                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                  onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                                >
                                                                  Verify
                                                                </div>
                                                              </div>
                                                            ) : (
                                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                  Verified
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                        </div>
                                                      );
                                                    })()}
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </>
                                        )}
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                        >
                                          <div
                                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                          >
                                            {expandAcknowledgement?.status &&
                                              expandAcknowledgement?.index === index ? (
                                              <RemoveIcon
                                                sx={{
                                                  fontSize: 20,
                                                  color: "#94979A",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                  setExpandAcknowledgement({
                                                    status: false,
                                                    index: 0,
                                                  });
                                                  setFormSchemaId("");
                                                }}
                                              />
                                            ) : (
                                              <AddIcon
                                                sx={{
                                                  fontSize: 20,
                                                  color: "#94979A",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                  setExpandAcknowledgement({
                                                    status: true,
                                                    index: index,
                                                  });
                                                  setFormSchemaId(data?.id);
                                                }}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {expandAcknowledgement?.status &&
                                        expandAcknowledgement?.index === index && (
                                          <div
                                            className={`${style.marginTop} ${style.screenPadding}`}
                                          >
                                            {form?.forms?.filter(
                                              (data) => data?.formCategory === "Acknowledgement"
                                            )[index]?.uploadedFiles?.length !== 0 && (
                                                <>
                                                  <iframe
                                                    src={
                                                      form?.forms?.filter(
                                                        (data) =>
                                                          data?.formCategory === "Acknowledgement"
                                                      )[index]?.uploadedFiles[
                                                        form?.forms?.filter(
                                                          (data) =>
                                                            data?.formCategory ===
                                                            "Acknowledgement"
                                                        )[index]?.uploadedFiles?.length - 1
                                                      ]?.fileURL
                                                    }
                                                    width="100%"
                                                    height="600px"
                                                  ></iframe>
                                                  {(data?.description ===
                                                    "Statement of Confidentiality and Non-Disclosure" ||
                                                    data?.description ===
                                                    "Conflict Of Interest Policy") && (
                                                      <div className={style.grid2}>
                                                        <div
                                                          onClick={
                                                            form?.forms[index]?.staffEsign === null
                                                              ? () =>
                                                                handleStaffEsign(
                                                                  form?.forms?.filter(
                                                                    (data) =>
                                                                      data?.formCategory ===
                                                                      "Acknowledgement"
                                                                  )[index]?.id
                                                                )
                                                              : () => { }
                                                          }
                                                        >
                                                          <ESignature
                                                            userName={
                                                              form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? form?.forms?.filter(
                                                                  (data) =>
                                                                    data?.formCategory ===
                                                                    "Acknowledgement"
                                                                )[index]?.staffEsign?.name
                                                                : ""
                                                            }
                                                            encData={
                                                              form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? form?.forms?.filter(
                                                                  (data) =>
                                                                    data?.formCategory ===
                                                                    "Acknowledgement"
                                                                )[index]?.staffEsign?.esign
                                                                : ""
                                                            }
                                                            showData={
                                                              form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? true
                                                                : false
                                                            }
                                                            showDatais={true}
                                                          />
                                                        </div>
                                                        <div className={style.verticalAlignCenter}>
                                                          <div className={style.displayInRow}>
                                                            <div className={style.dateTitle}>
                                                              Date:{" "}
                                                            </div>
                                                            <div
                                                              className={`${style.date} ${style.marginLeft}`}
                                                            >
                                                              {form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? format(
                                                                  new Date(
                                                                    form?.forms?.filter(
                                                                      (data) =>
                                                                        data?.formCategory ===
                                                                        "Acknowledgement"
                                                                    )[
                                                                      index
                                                                    ]?.staffEsign?.signedDate
                                                                  ),
                                                                  canadaData?.dateFormat ||
                                                                  "dd/MM/yyyy"
                                                                )
                                                                : ""}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                </>
                                              )}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                              </div>
                            ) : (" ")}
                            <div className={style.marginBottom20}></div>
                          </div>
                        </div>
                      ) : (
                        <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop10}`}>
                          <div>


                            <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyleCred1} `}>

                              <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableHeaderTextStyleCred}`}> Required Reappointment data and Proof of Documentation for July 1, 2025 and June 30, 2026 </div>
                              </div>

                            </div>
                            <div>
                              <>
                                {applicationType === "NEW" && (
                                  <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === 0) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                                    <div className={` ${(expand?.status && expand?.index === 0) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1} ${style.marginTop10}`}>

                                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                        <div className={`${(expand?.status && expand?.index === 0) ? style.tableHeaderTextStyleCred : style.tableDataFontStyleCred}`}>Applicant Profile Information</div>
                                      </div>


                                      {(expand?.status && expand?.index === 0) ? (
                                        <>
                                          {!form?.basicInformationStatus ? (
                                            <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleVerify()}>Approve</div>
                                            </div>
                                          ) : (
                                            <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        " "
                                      )}

                                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                        <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                          {
                                            (expand?.status && expand?.index === 0) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: false, index: 0 })} />)
                                              : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: true, index: 0 })} />)
                                          }                    </div>
                                      </div>
                                    </div>
                                    {expand?.status && expand?.index === 0 &&
                                      <div className={`${style.marginTop} ${style.screenPadding}`}>

                                        {form1 !== undefined && 'applicant' in form1?.properties && (
                                          <ApplicationFieldCard object={form1?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                        )}
                                        {form1 !== undefined && 'credentialingPrivilegeCategory' in form1?.properties && (
                                          <ApplicationFieldCard object={form1?.properties?.credentialingPrivilegeCategory} gridStyle={style.credentialingGrid} baseKey={'credentialingPrivilegeCategory'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                        )}
                                        {form1 !== undefined && 'departmentSpecialty' in form1?.properties && (
                                          <ApplicationFieldCard object={form1?.properties?.departmentSpecialty} gridStyle={style.twoCol} baseKey={'departmentSpecialty'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                        )}
                                        {form1 !== undefined && (getValueByPath(form, 'basicDetails.departmentSpecialty.department') === form1.if.properties.departmentSpecialty.properties.department.const && form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(getValueByPath(form, 'basicDetails.departmentSpecialty.specialty'))) && (
                                          form1 !== undefined && 'regionalCallResponsibilities' in form1?.properties && (
                                            <ApplicationFieldCard object={form1?.properties?.regionalCallResponsibilities} gridStyle={''} baseKey={'regionalCallResponsibilities'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                          )
                                        )}
                                        {form1 !== undefined && 'billingNumber' in form1?.properties && (
                                          <ApplicationFieldCard object={form1?.properties?.billingNumber} gridStyle={style.twoCol} baseKey={'billingNumber'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                        )}
                                      </div>
                                    }


                                  </div>
                                )}
                              </>
                              <>
                                {
                                  form?.formSchemas?.filter(
                                    (data) => {
                                      if (form?.creationType === "NEW") {
                                        return (
                                          (data?.formCategory === "Form" || data?.formCategory === "Disclosure") &&
                                          data?.schemaCategory !== "UploadYourDoc"
                                        );
                                      } else {
                                        // Default filter when form?.creationType is not "NEW"
                                        return (
                                          (data?.formCategory === "Form" || data?.formCategory === "Disclosure" || data?.formCategory === "Acknowledgement")
                                          // data?.schemaCategory !== "UploadYourDoc"
                                        );
                                      }
                                    })?.map((data, index) => (

                                      <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === index + 1) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                                        {/* <div className={` ${applicationType !== "NEW" ? style.tableHeaderGridStyleFormReappointment : (expand?.index === index + 1) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred} ${style.marginTop10}`}> */}
                                        <div>
                                          <div className={`${style.tableHeaderGridStyleCred1} ${style.backgroundColorStyle} ${style.paddingTopBottom10}`} >
                                            <div className={`${applicationType !== "NEW" ? style.tableDataFontStyleCredReappointment : style.tableDataFontStyleCred}`}>{data?.title}</div>
                                            {/* <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} > */}
                                            {applicationType === "NEW" ? (
                                              <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                                {
                                                  (expand?.status && expand?.index === index + 1) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                                    : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: true, index: index + 1 }); setFormSchemaId(data?.id) }} />)
                                                }

                                              </div>
                                            ) : ''}
                                            {/* </div> */}
                                          </div>
                                          {/* {!(expand?.status && expand?.index === index + 1) && (
                          <>
                            {form?.forms[index]?.status === "APPROVED" ? (
                              <div className={`${style.approvedButtonStyle} ${style.ApprovedTextStyle}`}>Approved</div>
                            ) : (
                              <div className={`${style.assessInCred} ${style.assessTextStyle}`}>4 to Assess</div>
                            )}
                          </>
                        )} */}
                                          {/* {applicationType === "NEW" ? (
                                          <>
                                            {expand?.status && expand?.index === index + 1 && (
                                              <>
                                                {credApproval?.some((newData) => {
                                                  console.log("newData.approvalRequired:", newData.approvalRequired);
                                                  return newData.schemaId === data.id && newData.approvalRequired;
                                                }) ? (
                                                  <>
                                                    {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                      (() => {
                                                        const isMatch = logDetails.logs.some((log) => {
                                                          if (log.form && log.form.id) {
                                                            const match = log.form.id === form?.forms[index]?.id;
                                                            console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                            if (match) {
                                                              let Match = false;

                                                              // Check if userRole includes log.role
                                                              if (userRole?.includes(log.role)) {
                                                                console.log("Role matches user role: " + log.role);
                                                                Match = true;
                                                              }

                                                              // Determine selectedTabRole based on selectedTab
                                                              let selectedTabRole;
                                                              if (selectedTab === 'level-2') {
                                                                selectedTabRole = "Department Head";
                                                              } else if (selectedTab === 'level-3') {
                                                                selectedTabRole = "Chief Of Staff";
                                                              } else if (selectedTab === 'level-4') {
                                                                selectedTabRole = "Advisory Committee";
                                                              } else if (selectedTab === 'level-5') {
                                                                selectedTabRole = "Board";
                                                              } else if (selectedTab === 'level-1') {
                                                                selectedTabRole = "Staff Manager";
                                                              }

                                                              // Check if selectedTabRole matches log.role
                                                              if (selectedTabRole === log.role) {
                                                                console.log("Selected tab role matches log role: " + log.role);
                                                                Match = true;
                                                              }

                                                              return Match;
                                                            }
                                                          }
                                                          return false;
                                                        });

                                                        return (
                                                          <div>
                                                            {isMatch ? (
                                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                  Approved
                                                                </div>
                                                              </div>
                                                            ) : (
                                                              form?.forms[index]?.status !== "APPROVED" ? (
                                                                <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                  <div
                                                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                    onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                                  >
                                                                    Approve
                                                                  </div>
                                                                </div>
                                                              ) : (
                                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                  <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                    Approved
                                                                  </div>
                                                                </div>
                                                              )
                                                            )}
                                                          </div>
                                                        );
                                                      })()
                                                    )}
                                                  </>
                                                ) : (
                                                  <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                      Approved
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {credApproval?.some((newData) => {
                                              console.log("newData.approvalRequired:", newData.approvalRequired);
                                              return newData.schemaId === data.id && newData.approvalRequired;
                                            }) ? (
                                              <>
                                                {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                  (() => {
                                                    const isMatch = logDetails.logs.some((log) => {
                                                      if (log.form && log.form.id) {
                                                        const match = log.form.id === form?.forms[index]?.id;
                                                        console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                        if (match) {
                                                          let Match = false;

                                                          // Check if userRole includes log.role
                                                          if (userRole?.includes(log.role)) {
                                                            console.log("Role matches user role: " + log.role);
                                                            Match = true;
                                                          }

                                                          // Determine selectedTabRole based on selectedTab
                                                          let selectedTabRole;
                                                          if (selectedTab === 'level-2') {
                                                            selectedTabRole = "Department Head";
                                                          } else if (selectedTab === 'level-3') {
                                                            selectedTabRole = "Chief Of Staff";
                                                          } else if (selectedTab === 'level-4') {
                                                            selectedTabRole = "Advisory Committee";
                                                          } else if (selectedTab === 'level-5') {
                                                            selectedTabRole = "Board";
                                                          } else if (selectedTab === 'level-1') {
                                                            selectedTabRole = "Staff Manager";
                                                          }

                                                          // Check if selectedTabRole matches log.role
                                                          if (selectedTabRole === log.role) {
                                                            console.log("Selected tab role matches log role: " + log.role);
                                                            Match = true;
                                                          }

                                                          return Match;
                                                        }
                                                      }
                                                      return false;
                                                    });

                                                    return (
                                                      <div>
                                                        {isMatch ? (
                                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                              Approved
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          form?.forms[index]?.status !== "APPROVED" ? (
                                                            <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                              <div
                                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                              >
                                                                Approve
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Approved
                                                              </div>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    );
                                                  })()
                                                )}
                                              </>
                                            ) : (
                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                  Verified
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )} */}

                                          {/* {expand?.status && expand?.index === index + 1 && (
                              <>
                                {credApproval?.filter(
                                  (newData) => {
                                    console.log("newData.schema:", newData.schemaId);
                                    console.log("data.id:", data.id);
                                    return newData.schemaId === data.id;
                                  }
                                )[0]?.approvalRequired === true && (
                                  <>
                                    {logDetails?.logs && Array.isArray(logDetails?.logs) && (() => {
                                      let isMatch = false;

                                      logDetails.logs.forEach((log) => {
                                        if (log.form && log.form.id) {
                                          console.log("form id: " + log.form.id);

                                          if (form?.forms?.some(f => f.id === log.form.id)) {
                                            console.log("form match found, setting isMatch to true");
                                            isMatch = true;

                                            // Check if userRole includes log.role
                                            if (userRole?.includes(log?.role)) {
                                              console.log("Role matches user role: " + log.role);
                                              isMatch = true;
                                            } else {
                                              console.log("Role does NOT match user role: " + log.role);
                                              isMatch = false;
                                            }

                                            // Determine selectedTabRole
                                            let selectedTabRole;
                                            switch (selectedTab) {
                                              case 'level-2':
                                                selectedTabRole = "Department Head";
                                                break;
                                              case 'level-3':
                                                selectedTabRole = "Chief Of Staff";
                                                break;
                                              case 'level-4':
                                                selectedTabRole = "Advisory Committee";
                                                break;
                                              case 'level-5':
                                                selectedTabRole = "Board";
                                                break;
                                              case 'level-1':
                                                selectedTabRole = "Staff Manager";
                                                break;
                                              default:
                                                selectedTabRole = "";
                                            }

                                            // Check if selectedTabRole matches log.role
                                            if (selectedTabRole === log.role) {
                                              console.log("Selected tab role matches log role: " + log.role);
                                              isMatch = true;
                                            } else {
                                              console.log("Selected tab role does NOT match log role: " + log.role);
                                              isMatch = false;
                                            }
                                          } else {
                                            console.log("form match NOT found, setting isMatch to false");
                                            isMatch = false;
                                          }
                                        }
                                      });

                                      return isMatch && (
                                        <div>
                                          {form?.forms[index]?.status !== "APPROVED" ? (
                                            <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                              <div
                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                              >
                                                Approve
                                              </div>
                                            </div>
                                          ) : (
                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                Approved
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </>
                                )}
                              </>
                            )} */}
                                          {/* <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                          {applicationType === "NEW" ? (
                                            <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                              {
                                                (expand?.status && expand?.index === index + 1) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                                  : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: true, index: index + 1 }); setFormSchemaId(data?.id) }} />)
                                              }

                                            </div>
                                          ) : ''}
                                        </div> */}
                                        </div>

                                        {applicationType === "NEW" ? (
                                          <>
                                            {expand?.status && expand?.index === index + 1 &&
                                              <div className={`${style.marginTop} ${style.screenPadding}`}>
                                                {renderFieldsBasedOnStep(data)}
                                              </div>
                                            }
                                          </>
                                        ) : (
                                          <>
                                            <div className={`${style.marginTop} ${style.screenPadding}`}>
                                              {renderFieldsBasedOnStepReappointment(data, index)}
                                            </div>

                                          </>
                                        )}
                                        {applicationType === "NEW" ? (
                                          <>
                                            {expand?.status && expand?.index === index + 1 && (
                                              <>
                                                {credApproval?.some((newData) => {
                                                  console.log("newData.approvalRequired:", newData.approvalRequired);
                                                  return newData.schemaId === data.id && newData.approvalRequired;
                                                }) ? (
                                                  <>
                                                    {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                      (() => {
                                                        const isMatch = logDetails.logs.some((log) => {
                                                          if (log.form && log.form.id) {
                                                            const match = log.form.id === form?.forms[index]?.id;
                                                            console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                            if (match) {
                                                              let Match = false;

                                                              // Check if userRole includes log.role
                                                              if (workModeType === log.role) {
                                                                console.log("Role matches user role: " + log.role);
                                                                Match = true;
                                                              }

                                                              // Determine selectedTabRole based on selectedTab
                                                              let selectedTabRole;
                                                              if (selectedTab === 'level-2') {
                                                                selectedTabRole = "Department Head";
                                                              } else if (selectedTab === 'level-3') {
                                                                selectedTabRole = "Chief Of Staff";
                                                              } else if (selectedTab === 'level-4') {
                                                                selectedTabRole = "Advisory Committee";
                                                              } else if (selectedTab === 'level-5') {
                                                                selectedTabRole = "Board";
                                                              } else if (selectedTab === 'level-1') {
                                                                selectedTabRole = "Staff Manager";
                                                              }

                                                              // Check if selectedTabRole matches log.role
                                                              if (selectedTabRole === log.role) {
                                                                console.log("Selected tab role matches log role: " + log.role);
                                                                Match = true;
                                                              }

                                                              return Match;
                                                            }
                                                          }
                                                          return false;
                                                        });

                                                        return (
                                                          <div>
                                                            {isMatch ? (
                                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                  Approved
                                                                </div>
                                                              </div>
                                                            ) : (
                                                              form?.forms[index]?.status !== "APPROVED" ? (
                                                                <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                  <div
                                                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                    onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                                  >
                                                                    Approve
                                                                  </div>
                                                                </div>
                                                              ) : (
                                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                  <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                    Approved
                                                                  </div>
                                                                </div>
                                                              )
                                                            )}
                                                          </div>
                                                        );
                                                      })()
                                                    )}
                                                  </>
                                                ) : (
                                                  <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                      Approved
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                          </>
                                        ) : (
                                          <>
                                            {credApproval?.some((newData) => {
                                              console.log("newData.approvalRequired:", newData.approvalRequired);
                                              return newData.schemaId === data.id && newData.approvalRequired;
                                            }) ? (
                                              <>
                                                {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                  (() => {
                                                    const isMatch = logDetails.logs.some((log) => {
                                                      if (log.form && log.form.id) {
                                                        const match = log.form.id === form?.forms[index]?.id;
                                                        console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                        if (match) {
                                                          let Match = false;

                                                          // Check if userRole includes log.role
                                                          if (workModeType === log.role) {
                                                            console.log("Role matches user role: " + log.role);
                                                            Match = true;
                                                          }

                                                          // Determine selectedTabRole based on selectedTab
                                                          let selectedTabRole;
                                                          if (selectedTab === 'level-2') {
                                                            selectedTabRole = "Department Head";
                                                          } else if (selectedTab === 'level-3') {
                                                            selectedTabRole = "Chief Of Staff";
                                                          } else if (selectedTab === 'level-4') {
                                                            selectedTabRole = "Advisory Committee";
                                                          } else if (selectedTab === 'level-5') {
                                                            selectedTabRole = "Board";
                                                          } else if (selectedTab === 'level-1') {
                                                            selectedTabRole = "Staff Manager";
                                                          }

                                                          // Check if selectedTabRole matches log.role
                                                          if (selectedTabRole === log.role) {
                                                            console.log("Selected tab role matches log role: " + log.role);
                                                            Match = true;
                                                          }

                                                          return Match;
                                                        }
                                                      }
                                                      return false;
                                                    });

                                                    return (
                                                      <div>
                                                        {isMatch ? (
                                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                              Approved
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          form?.forms[index]?.status !== "APPROVED" ? (
                                                            <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                              <div
                                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                              >
                                                                Approve
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Approved
                                                              </div>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    );
                                                  })()
                                                )}
                                              </>
                                            ) : (
                                              <>
                                                {!staffView && (
                                                  <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                      Verified <LockOutlinedIcon sx={{
                                                        fontSize: 20,
                                                        color: "#ffffff",
                                                        marginLeft: "10px",
                                                      }} />
                                                    </div>
                                                  </div>
                                                )}
                                              </>
                                            )}
                                            {/* {form?.forms[index]?.schemaCategory === 'PrivilegeSelection' && (
                                                    <div className={style.padding20}>
                                                      <div className={`${style.cardTitle} ${style.advanceBoxStyle}  ${style.marginTop10}`}>
                                                        Application Payment Status
                                                        <span className={`${style.marginLeft30}  ${form?.payment?.paymentCompleted ? style.paidTextStyle : style.unpaidTextStyle}`}>
                                                          {form?.payment?.paymentCompleted ? 'Paid' : 'Unpaid'}
                                                        </span>
                                                      </div>
                                                      <div className={`${style.threeColumnGrid}`}>
                                                        <div className={`${style.alignStart} ${style.marginTop10}`}>
                                                          <div>Amount</div>
                                                          <div className={`${style.borderStyleTiles}`}></div>
                                                          <div className={`${style.marginLeft30} ${style.marginTop10}`}>{form?.payment?.currency || ""} {form?.payment?.fee || "-"}</div>
                                                        </div>
                                                        <div className={`${style.alignStart} ${style.marginTop10}`}>
                                                          <div>Transaction ID / Confirmation Number</div>
                                                          <div className={`${style.borderStyleTiles}`}></div>
                                                          <div className={`${style.marginLeft30} ${style.marginTop10}`}>{form?.payment?.receiptId || "-"}</div>
                                                        </div>
                                                        <div className={`${style.alignStart} ${style.marginTop10}`}>
                                                          <div>Payment Date & Time</div>
                                                          <div className={`${style.borderStyleTiles}`}></div>
                                                          <div className={`${style.marginLeft30} ${style.marginTop10}`}>{paymentmentPaidDate || ""}</div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )} */}
                                          </>
                                        )}
                                      </div>))}
                                {/* {(userRole?.includes("Department Head") && selectedTab === "level-2" && applicationType === "REAPPOINTMENT") || (userRole?.includes("Credentialing Committee") && selectedTab === "level-3" && applicationType === "REAPPOINTMENT") ? (
                                <div className={`${style.margin20}`}>
                                  <div className={`${style.fourColumnGrid}`}>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        onClick={() => {
                                          onClose();
                                        }}
                                      >
                                        SAVE IN PROGRESS
                                      </div>
                                    </div>
                                    <div
                                      className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                                    >
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                      
                                        onClick={() => {
                                          setShowApplicationDeclineDialog(true);
                                        }}
                                      >
                                        NOT RECOMMENDED
                                      </div>
                                    </div>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                        // onClick={onClickApproveFunction}
                                        onClick={() => {
                                          onClickApprovalFunction();
                                        }}
                                      >
                                        RECOMMENDED WITH COMMENTS
                                      </div>
                                    </div>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        onClick={onClickApprovalwithoutnotesFunction}
                                      >
                                        RECOMMEND
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (" ")} */}
                                {/* {(userRole?.includes("Staff Manager") && selectedTab === "level-4" && applicationType === "REAPPOINTMENT")  ? (
                                <div className={`${style.margin20}`}>
                                  <div className={`${style.twoColumnGrid1}`}>
                                    <div
                                      className={`${style.buttonCardStyle2} ${style.cursorPointer}`}
                                    >
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        
                                        onClick={() => {
                                          setShowApplicationDeclineDialog(true);
                                        }}
                                      >
                                        NOT RECOMMENDED BY MAC
                                      </div>
                                    </div>
                                   
                                    <div
                                     className={`${style.bigButtonStyle2} ${style.cursorPointer}`}
                                     style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                                     onClick={isButtonDisabled ? undefined : onClickEmailDialogFunction}
                                    >
                                      <div
                                        className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                       
                                      >
                                        RECOMMENDED BY MAC
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (" ")} */}
                                {/* {(userRole?.includes("Staff Manager") && selectedTab === "level-5" && applicationType === "REAPPOINTMENT")  ? (
                                <div className={`${style.margin20}`}>
                                  <div className={`${style.twoColumnGrid1}`}>
                                    <div
                                      className={`${style.buttonCardStyle2} ${style.cursorPointer}`}
                                    >
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        
                                        onClick={() => {
                                          setShowApplicationDeclineDialog(true);
                                        }}
                                      >
                                        REJECTED BY BOD
                                      </div>
                                    </div>
                                   
                                    <div
                                     className={`${style.bigButtonStyle2} ${style.cursorPointer}`}
                                     style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                                     onClick={isButtonDisabled ? undefined : onClickEmailDialogFunction}
                                    >
                                      <div
                                        className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                        
                                      >
                                        APPROVED BY BOD
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (" ")} */}
                                {/* {(userRole?.includes("Credentialing Committee") && selectedTab === "level-2" && applicationType === "REAPPOINTMENT") ? (
                                <div className={`${style.margin20}`}>
                                  <div className={`${style.fourColumnGrid}`}>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        onClick={() => {
                                          onClose();
                                        }}
                                      >
                                        SAVE IN PROGRESS
                                      </div>
                                    </div>
                                    <div
                                      className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                                    >
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        onClick={() => {
                                          setShowApplicationDeclineDialog(true);
                                        }}
                                      >
                                        NOT RECOMMENDED
                                      </div>
                                    </div>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                        onClick={() => {
                                          onClickApprovalFunction();
                                        }}
                                      >
                                        RECOMMENDED WITH COMMENTS
                                      </div>
                                    </div>
                                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                                      <div
                                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                        onClick={onClickApprovalwithoutnotesFunction}
                                      >
                                        RECOMMENDED
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (" ")} */}
                                {/* {userRole?.includes('Staff Manager') && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && (<>
                                    <div className={${style.margin20}}>
                                      <div className={${style.textCardStyle} ${style.buttonTextStyle} ${style.alignCenter}}>
                                      Pending Cred. Comm. Verification
                                      </div>
                                    </div>
                                  </>)} */}
                              </>

                            </div >
                            {applicationType === "NEW" ? (
                              <div>
                                <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderStyleCred} `}>
                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                    <div className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}></div>
                                  </div>
                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                    <div className={`${style.tableHeaderTextStyleCred}`}>Requested Form Completeness Check</div>
                                  </div>
                                </div>
                                {form?.formSchemas?.filter(data => data?.formCategory === 'Acknowledgement')?.map((data, index) => (
                                  <div className={` ${style.marginTop5} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                                    <div className={` ${style.marginTop10} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1}`}>

                                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                        <div className={`${style.tableDataFontStyleCred}`}>{data?.title}</div>
                                      </div>
                                      {/* {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                        <>
                          {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.status !== "APPROVED" ? (
                            <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleStepsVerify(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id)}>Approve</div>
                            </div>
                          ) : (
                            <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                            </div>
                          )}
                        </>
                      )} */}
                                      {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                                        <>
                                          {form?.forms?.filter((data) => data?.formCategory === "Acknowledgement")[index]?.status !== "APPROVED" && (
                                            <>
                                              {credApproval?.some((newData) => {

                                                return newData.schemaId === data.id && newData.approvalRequired;

                                              }) ? (
                                                <>
                                                  <>
                                                    {logDetails?.logs && Array.isArray(logDetails.logs) && (() => {
                                                      const isMatch = logDetails.logs.some((log) => {
                                                        if (log.form && log.form.id) {
                                                          const match = log.form.id === form?.forms[index]?.id;
                                                          console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                          if (match) {
                                                            let Match = false;

                                                            // Check if userRole includes log.role
                                                            if (workModeType === log.role) {
                                                              console.log("Role matches user role: " + log.role);
                                                              Match = true;
                                                            }

                                                            // Determine selectedTabRole based on selectedTab
                                                            let selectedTabRole;
                                                            switch (selectedTab) {
                                                              case 'level-1':
                                                                selectedTabRole = "Staff Manager";
                                                                break;
                                                              case 'level-2':
                                                                selectedTabRole = "Department Head";
                                                                break;
                                                              case 'level-3':
                                                                selectedTabRole = "Chief Of Staff";
                                                                break;
                                                              case 'level-4':
                                                                selectedTabRole = "Advisory Committee";
                                                                break;
                                                              case 'level-5':
                                                                selectedTabRole = "Board";
                                                                break;
                                                              default:
                                                                selectedTabRole = "";
                                                            }

                                                            // Check if selectedTabRole matches log.role
                                                            if (selectedTabRole === log.role) {
                                                              console.log("Selected tab role matches log role: " + log.role);
                                                              Match = true;
                                                            }

                                                            return Match;
                                                          }
                                                        }
                                                        return false;
                                                      });

                                                      return (
                                                        <div>
                                                          {isMatch ? (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Approved
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            form?.forms[index]?.status !== "APPROVED" ? (
                                                              <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                <div
                                                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                  onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                                >
                                                                  Approve
                                                                </div>
                                                              </div>
                                                            ) : (
                                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                  Approved
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                        </div>
                                                      );
                                                    })()}
                                                  </>

                                                </>
                                              ) : (
                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                  <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                    Approved
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                        <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                          {
                                            (expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                              : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: true, index: index }); setFormSchemaId(data?.id) }} />)
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    {expandAcknowledgement?.status && expandAcknowledgement?.index === index &&
                                      <div className={`${style.marginTop} ${style.screenPadding}`}>
                                        {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length !== 0 && (
                                          <>
                                            <iframe src={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles[form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length - 1]?.fileURL} width="100%" height="600px"></iframe>
                                            {(data?.description === 'Statement of Confidentiality and Non-Disclosure' || data?.description === 'Conflict Of Interest Policy') && (
                                              <div className={style.grid2}>
                                                <div onClick={form?.forms[index]?.staffEsign === null ? () => handleStaffEsign(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id) : () => { }} >
                                                  <ESignature
                                                    userName={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.name : ""}
                                                    encData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.esign : ''}
                                                    showData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? true : false}
                                                    showDatais={true}
                                                  />
                                                </div>
                                                <div className={style.verticalAlignCenter}>
                                                  <div className={style.displayInRow}>
                                                    <div className={style.dateTitle}>Date: </div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>{form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? format(new Date(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.signedDate), canadaData?.dateFormat || 'dd/MM/yyyy') : ""}</div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    }
                                  </div>))}
                              </div>
                            ) : (" ")}
                            <div className={style.marginBottom20}></div>
                          </div >
                        </div >
                      )}
                    </>
                  </div >
                </>
              ) : (
                <>
                  <div className={`${style.displayInCol}`}>
                    <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}>
                      <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                          <div className={`${style.photoBorderStyle}`}>

                            <img
                              src={form?.basicDetails?.applicant?.profilePicture?.fileURL || UserLogo}
                              alt="Profile Picture"
                              className={style.profileImage}
                            />

                          </div>
                          <div className={`${style.displayInCol} ${style.textAlignLeft}`}>
                            <div className={style.marginTop10}>
                              <span className={`${style.cardTextBoldStyle} ${style.marginTop10}`}>
                                {form?.basicDetails?.applicant?.name?.firstName || ""} {form?.basicDetails?.applicant?.name?.middleName || ""} {form?.basicDetails?.applicant?.name?.lastName || ""}
                              </span>
                              <span className={`${style.cardTextNormalStyle} ${style.marginTop10} ${style.marginLeft10}`}>
                                {form?.displayId || ""}
                              </span>
                            </div>
                            <div className={`${style.cardTextNormalStyle} ${style.marginTop10}`}>
                              {form?.providerType?.serviceProviderType || ""} Applying As {form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory || ""}
                            </div>
                            <div className={style.spaceBetween}>
                              <span className={`${style.cardTextBoldStyle} ${style.marginTop30}`}>
                                {form?.basicDetails?.applicant?.cellPhone ? `+1 ${form?.basicDetails?.applicant?.cellPhone}` : ""}
                              </span>
                              <span className={`${style.emailTextBoldStyle} ${style.marginTop30} ${style.marginLeft20}`}>
                                {form?.basicDetails?.applicant?.email?.officialEmail || ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={`${style.displayInRow} ${style.marginRight20}`}>
                          <div className={style.displayInCol}>
                            <div className={style.marginTop15}>
                              <span className={style.rightAlignTextStyle}>
                                Days To Complete:
                              </span>
                              <span className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}>
                                15
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <>
                      {(workModeType === 'Staff Manager') ? (
                        <div
                          className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}
                        >

                          <div>
                            <div
                              className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle} `}
                            >
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                              >
                                <div
                                  className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                                ></div>
                              </div>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                              >
                                <div className={`${style.tableHeaderTextStyle}`}>
                                  Required Reappointment data and Proof of Documentation for July 1, 2025 and June 30, 2026
                                </div>
                              </div>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                              >
                                <div
                                  className={`${style.tableHeaderTextStyle}`}
                                  aria-owns={open ? "mouse-over-popover" : undefined}
                                  aria-haspopup="true"
                                  onMouseEnter={handlePopoverOpen}
                                  onMouseLeave={handlePopoverClose}
                                >
                                  <img
                                    src={DataStatusIcon}
                                    alt=""
                                    style={{
                                      width: "18px",
                                      height: "20px",
                                    }}
                                  />
                                  <Popover
                                    id={"mouse-over-popover"}
                                    sx={{
                                      pointerEvents: "none",
                                    }}
                                    open={open}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "center",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "center",
                                    }}
                                    onClose={handlePopoverClose}
                                    PaperProps={{
                                      style: {
                                        backgroundColor: "transparent",
                                        boxShadow: "none",
                                        borderRadius: 0,
                                      },
                                    }}
                                    disableRestoreFocus
                                  >
                                    <div className={style.multipleOptionsCard}>
                                      <div
                                        className={`${style.specificActionCard} ${style.cursorPointer}`}
                                      >
                                        Data Quality Status
                                      </div>
                                    </div>
                                  </Popover>
                                </div>
                              </div>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                              >
                                <div
                                  className={`${style.tableHeaderTextStyle}`}
                                  aria-owns={
                                    openTextWithHover ? "mouse-over-popover" : undefined
                                  }
                                  aria-haspopup="true"
                                  onMouseEnter={handlePopoverTextOpen}
                                  onMouseLeave={handlePopoverTextClose}
                                >
                                  <img
                                    src={DocumentIcon}
                                    alt=""
                                    style={{
                                      width: "18px",
                                      height: "20px",
                                    }}
                                  />
                                  <Popover
                                    id={"mouse-over-popover"}
                                    sx={{
                                      pointerEvents: "none",
                                    }}
                                    open={openTextWithHover}
                                    anchorEl={anchorTextEl}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "center",
                                    }}
                                    transformOrigin={{
                                      vertical: "top",
                                      horizontal: "center",
                                    }}
                                    onClose={handlePopoverTextClose}
                                    PaperProps={{
                                      style: {
                                        backgroundColor: "transparent",
                                        boxShadow: "none",
                                        borderRadius: 0,
                                      },
                                    }}
                                    disableRestoreFocus
                                  >
                                    <div className={style.multipleOptionsCard}>
                                      <div
                                        className={`${style.specificActionCard} ${style.cursorPointer}`}
                                      >
                                        Document Status
                                      </div>
                                    </div>
                                  </Popover>
                                </div>
                              </div>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                              >
                                <div className={`${style.tableHeaderTextStyle}`}>
                                  Documents
                                </div>
                              </div>
                            </div>
                            <div>
                              <div
                                className={` ${style.marginTop5} ${expand?.status && expand?.index === 0
                                  ? style.tableDataStyle1
                                  : style.tableDataStyle
                                  }`}
                              >
                                <div
                                  className={` ${expand?.status && expand?.index === 0
                                    ? style.tableHeaderGridStyleForm
                                    : style.tableHeaderGridStyle
                                    } ${style.marginTop10}`}
                                >
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div
                                      className={`${style.marginLeft10} ${style.justifySpaceAround
                                        } ${form?.basicInformationStatus
                                          ? style.greenDotStyle
                                          : style.greyDotStyle
                                        }`}
                                    ></div>
                                  </div>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                  >
                                    <div
                                      className={`${expand?.status && expand?.index === 0
                                        ? style.tableHeaderTextStyle
                                        : style.tableDataFontStyle1
                                        }`}
                                    >
                                      Applicant Profile Information
                                    </div>
                                  </div>
                                  {expand?.status && expand?.index === 0 ? (
                                    <>
                                      {!form?.basicInformationStatus ? (
                                        <div
                                          className={`${style.purpleButton} ${style.cursorPointer} `}
                                        >
                                          <div
                                            className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                            onClick={() => handleVerify()}
                                          >
                                            Verify
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          className={`${style.greenButton}  ${style.cursorPointer} `}
                                        >
                                          <div
                                            className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                          >
                                            Verified
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                                        ></div>
                                      </div>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                                        ></div>
                                      </div>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                        >
                                          -
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                  >
                                    <div
                                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                    >
                                      {expand?.status && expand?.index === 0 ? (
                                        <RemoveIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            setExpand({ status: false, index: 0 })
                                          }
                                        />
                                      ) : (
                                        <AddIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                          onClick={() =>
                                            setExpand({ status: true, index: 0 })
                                          }
                                        />
                                      )}{" "}
                                    </div>
                                  </div>
                                </div>
                                {expand?.status && expand?.index === 0 && (
                                  <div
                                    className={`${style.marginTop} ${style.screenPadding}`}
                                  >

                                    {form1 !== undefined &&
                                      "applicant" in form1?.properties && (
                                        <ApplicationFieldCard
                                          object={form1?.properties?.applicant}
                                          gridStyle={style.applicantGrid}
                                          baseKey={"applicant"}
                                          basicForm={form}
                                          setBasicForm={setForm}
                                          isBasicPath={true}
                                          isPOD={true}
                                        />
                                      )}
                                    {form1 !== undefined &&
                                      "credentialingPrivilegeCategory" in
                                      form1?.properties && (
                                        <ApplicationFieldCard
                                          object={
                                            form1?.properties?.credentialingPrivilegeCategory
                                          }
                                          gridStyle={style.credentialingGrid}
                                          baseKey={"credentialingPrivilegeCategory"}
                                          basicForm={form}
                                          setBasicForm={setForm}
                                          isBasicPath={true}
                                          isPOD={true}
                                        />
                                      )}
                                    {form1 !== undefined &&
                                      "departmentSpecialty" in form1?.properties && (
                                        <ApplicationFieldCard
                                          object={form1?.properties?.departmentSpecialty}
                                          gridStyle={style.twoCol}
                                          baseKey={"departmentSpecialty"}
                                          basicForm={form}
                                          setBasicForm={setForm}
                                          isBasicPath={true}
                                          isPOD={true}
                                        />
                                      )}
                                    {form1 !== undefined &&
                                      getValueByPath(
                                        form,
                                        "basicDetails.departmentSpecialty.department"
                                      ) ===
                                      form1.if.properties.departmentSpecialty.properties
                                        .department.const &&
                                      form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(
                                        getValueByPath(
                                          form,
                                          "basicDetails.departmentSpecialty.specialty"
                                        )
                                      ) &&
                                      form1 !== undefined &&
                                      "regionalCallResponsibilities" in form1?.properties && (
                                        <ApplicationFieldCard
                                          object={
                                            form1?.properties?.regionalCallResponsibilities
                                          }
                                          gridStyle={""}
                                          baseKey={"regionalCallResponsibilities"}
                                          basicForm={form}
                                          setBasicForm={setForm}
                                          isBasicPath={true}
                                          isPOD={true}
                                        />
                                      )}
                                    {form1 !== undefined &&
                                      "billingNumber" in form1?.properties && (
                                        <ApplicationFieldCard
                                          object={form1?.properties?.billingNumber}
                                          gridStyle={style.twoCol}
                                          baseKey={"billingNumber"}
                                          basicForm={form}
                                          setBasicForm={setForm}
                                          isBasicPath={true}
                                          isPOD={true}
                                        />
                                      )}
                                  </div>
                                )}
                              </div>

                              {form?.formSchemas
                                ?.filter(
                                  (data) => {
                                    if (form?.creationType === "NEW") {
                                      return (
                                        (data?.formCategory === "Form" || data?.formCategory === "Disclosure") &&
                                        data?.schemaCategory !== "UploadYourDoc"
                                      );
                                    } else {
                                      // Default filter when form?.creationType is not "NEW"
                                      return (
                                        (data?.formCategory === "Form" || data?.formCategory === "Disclosure" || data?.formCategory === "Acknowledgement")
                                        // data?.schemaCategory !== "UploadYourDoc"
                                      );
                                    }
                                  })
                                ?.map((data, index) => (
                                  <div
                                    className={` ${style.marginTop5} ${expand?.status && expand?.index === index + 1
                                      ? style.tableDataStyle1
                                      : style.tableDataStyle
                                      }`}
                                  >
                                    <div
                                      className={` ${expand?.index === index + 1
                                        ? style.tableHeaderGridStyleForm
                                        : style.tableHeaderGridStyle
                                        } ${style.marginTop10}`}
                                    >
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.justifySpaceAround
                                            } ${form?.forms[index]?.status !== "APPROVED"
                                              ? style.greyDotStyle
                                              : style.greenDotStyle
                                            }`}
                                        ></div>
                                      </div>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div className={`${style.tableDataFontStyle1}`}>
                                          {data?.title}
                                        </div>
                                      </div>
                                      {/* {expand?.status && expand?.index === index + 1 ? ( 
                          <>
                            {form?.forms[index]?.status !== "APPROVED" ? (
                              <div
                                className={`${style.purpleButton} ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  onClick={() =>
                                    handleStepsVerify(form?.forms[index]?.id)
                                  }
                                >
                                  Verify
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`${style.greenButton}  ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                >
                                  Verified
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                              >
                                {form?.forms
                                  ?.filter(
                                    (formData, formIndex) => formIndex === index
                                  )
                                  ?.map(
                                    (data) => data?.uploadedFiles?.length || 0
                                  )}
                              </div>
                            </div>
                          </>
                        )} */}
                                      {expand?.status && expand?.index === index + 1 ? (
                                        <>
                                          {credApproval?.some((newData) => {
                                            console.log("newData.approvalRequired:", newData.approvalRequired);
                                            return newData.schemaId === data.id && newData.approvalRequired;
                                          }) && (
                                              <>
                                                {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                  (() => {
                                                    const isMatch = logDetails.logs.some((log) => {
                                                      if (log.form && log.form.id) {
                                                        const match = log.form.id === form?.forms[index]?.id;
                                                        console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                        if (match) {
                                                          let Match = false;

                                                          // Check if userRole includes log.role
                                                          if (workModeType === log.role) {
                                                            console.log("Role matches user role: " + log.role);
                                                            Match = true;
                                                          }

                                                          // Determine selectedTabRole based on selectedTab
                                                          let selectedTabRole;
                                                          if (selectedTab === 'level-2') {
                                                            selectedTabRole = "Department Head";
                                                          } else if (selectedTab === 'level-3') {
                                                            selectedTabRole = "Chief Of Staff";
                                                          } else if (selectedTab === 'level-4') {
                                                            selectedTabRole = "Advisory Committee";
                                                          } else if (selectedTab === 'level-5') {
                                                            selectedTabRole = "Board";
                                                          } else if (selectedTab === 'level-1') {
                                                            selectedTabRole = "Staff Manager";
                                                          }

                                                          // Check if selectedTabRole matches log.role
                                                          if (selectedTabRole === log.role) {
                                                            console.log("Selected tab role matches log role: " + log.role);
                                                            Match = true;
                                                          }

                                                          return Match;
                                                        }
                                                      }
                                                      return false;
                                                    });

                                                    return (
                                                      <div>
                                                        {isMatch ? (
                                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                              Verified
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          form?.forms[index]?.status !== "APPROVED" ? (
                                                            <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                              <div
                                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                              >
                                                                Verify
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Verified
                                                              </div>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    );
                                                  })()
                                                )}
                                              </>
                                            )}
                                        </>
                                      ) : (
                                        <>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10}${style.justifySpaceAround
                                                } ${form?.forms[index]?.status !== "APPROVED"
                                                  ? style.greyDotStyle
                                                  : style.greenDotStyle
                                                }`}
                                            ></div>
                                          </div>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10}${style.justifySpaceAround
                                                } ${form?.forms[index]?.status !== "APPROVED"
                                                  ? style.greyDotStyle
                                                  : style.greenDotStyle
                                                }`}
                                            ></div>
                                          </div>
                                          <div
                                            className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                          >
                                            <div
                                              className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                            >
                                              {form?.forms
                                                ?.filter(
                                                  (formData, formIndex) => formIndex === index
                                                )
                                                ?.map(
                                                  (data) => data?.uploadedFiles?.length || 0
                                                )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                        >
                                          {expand?.status && expand?.index === index + 1 ? (
                                            <RemoveIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setExpand({ status: false, index: 0 });
                                                setFormSchemaId("");
                                              }}
                                            />
                                          ) : (
                                            <AddIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setExpand({ status: true, index: index + 1 });
                                                setFormSchemaId(data?.id);
                                              }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {expand?.status && expand?.index === index + 1 && (
                                      <div
                                        className={`${style.marginTop} ${style.screenPadding}`}
                                      >
                                        {renderFieldsBasedOnStep(data)}
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                            {applicationType === "NEW" ? (
                              <div>
                                <div
                                  className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}
                                >
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div
                                      className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}
                                    ></div>
                                  </div>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                  >
                                    <div className={`${style.tableHeaderTextStyle}`}>
                                      Requested Form Completeness Check
                                    </div>
                                  </div>
                                </div>
                                {form?.formSchemas
                                  ?.filter((data) => data?.formCategory === "Acknowledgement")
                                  ?.map((data, index) => (
                                    <div
                                      className={` ${style.marginTop5} ${expandAcknowledgement?.status &&
                                        expandAcknowledgement?.index === index
                                        ? style.tableDataStyle1
                                        : style.tableDataStyle
                                        }`}
                                    >
                                      <div
                                        className={` ${style.marginTop10} ${expandAcknowledgement?.status &&
                                          expandAcknowledgement?.index === index
                                          ? style.tableHeaderGridStyleForm
                                          : style.tableHeaderGridStyle1
                                          }`}
                                      >
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                        >
                                          <div
                                            className={`${style.marginLeft10} ${style.justifySpaceAround
                                              } ${form?.forms?.filter(
                                                (data) =>
                                                  data?.formCategory === "Acknowledgement"
                                              )[index]?.status !== "APPROVED"
                                                ? style.greyDotStyle
                                                : style.greenDotStyle
                                              }`}
                                          ></div>
                                        </div>
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                        >
                                          <div className={`${style.tableDataFontStyle1}`}>
                                            {data?.title}
                                          </div>
                                        </div>
                                        {/* {expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index && (
                            <>
                              {form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED" ? (
                                <div
                                  className={`${style.purpleButton} ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                    onClick={() =>
                                      handleStepsVerify(
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.id
                                      )
                                    }
                                  >
                                    Verify
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`${style.greenButton}  ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  >
                                    Verified
                                  </div>
                                </div>
                              )}
                            </>
                          )} */}
                                        {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                                          <>
                                            {form?.forms?.filter((data) => data?.formCategory === "Acknowledgement")[index]?.status !== "APPROVED" && (
                                              <>
                                                {credApproval?.some((newData) => newData.schemaId === data.id && newData.approvalRequired) && (
                                                  <>
                                                    {logDetails?.logs && Array.isArray(logDetails.logs) && (() => {
                                                      const isMatch = logDetails.logs.some((log) => {
                                                        if (log.form && log.form.id) {
                                                          const match = log.form.id === form?.forms[index]?.id;
                                                          console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                          if (match) {
                                                            let Match = false;

                                                            // Check if userRole includes log.role
                                                            if (workModeType === log.role) {
                                                              console.log("Role matches user role: " + log.role);
                                                              Match = true;
                                                            }

                                                            // Determine selectedTabRole based on selectedTab
                                                            let selectedTabRole;
                                                            switch (selectedTab) {
                                                              case 'level-1':
                                                                selectedTabRole = "Staff Manager";
                                                                break;
                                                              case 'level-2':
                                                                selectedTabRole = "Department Head";
                                                                break;
                                                              case 'level-3':
                                                                selectedTabRole = "Chief Of Staff";
                                                                break;
                                                              case 'level-4':
                                                                selectedTabRole = "Advisory Committee";
                                                                break;
                                                              case 'level-5':
                                                                selectedTabRole = "Board";
                                                                break;
                                                              default:
                                                                selectedTabRole = "";
                                                            }

                                                            // Check if selectedTabRole matches log.role
                                                            if (selectedTabRole === log.role) {
                                                              console.log("Selected tab role matches log role: " + log.role);
                                                              Match = true;
                                                            }

                                                            return Match;
                                                          }
                                                        }
                                                        return false;
                                                      });

                                                      return (
                                                        <div>
                                                          {isMatch ? (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Approved
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            form?.forms[index]?.status !== "APPROVED" ? (
                                                              <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                <div
                                                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                  onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                                >
                                                                  Approve
                                                                </div>
                                                              </div>
                                                            ) : (
                                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                  Approved
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                        </div>
                                                      );
                                                    })()}
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </>
                                        )}
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                        >
                                          <div
                                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                          >
                                            {expandAcknowledgement?.status &&
                                              expandAcknowledgement?.index === index ? (
                                              <RemoveIcon
                                                sx={{
                                                  fontSize: 20,
                                                  color: "#94979A",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                  setExpandAcknowledgement({
                                                    status: false,
                                                    index: 0,
                                                  });
                                                  setFormSchemaId("");
                                                }}
                                              />
                                            ) : (
                                              <AddIcon
                                                sx={{
                                                  fontSize: 20,
                                                  color: "#94979A",
                                                  cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                  setExpandAcknowledgement({
                                                    status: true,
                                                    index: index,
                                                  });
                                                  setFormSchemaId(data?.id);
                                                }}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {expandAcknowledgement?.status &&
                                        expandAcknowledgement?.index === index && (
                                          <div
                                            className={`${style.marginTop} ${style.screenPadding}`}
                                          >
                                            {form?.forms?.filter(
                                              (data) => data?.formCategory === "Acknowledgement"
                                            )[index]?.uploadedFiles?.length !== 0 && (
                                                <>
                                                  <iframe
                                                    src={
                                                      form?.forms?.filter(
                                                        (data) =>
                                                          data?.formCategory === "Acknowledgement"
                                                      )[index]?.uploadedFiles[
                                                        form?.forms?.filter(
                                                          (data) =>
                                                            data?.formCategory ===
                                                            "Acknowledgement"
                                                        )[index]?.uploadedFiles?.length - 1
                                                      ]?.fileURL
                                                    }
                                                    width="100%"
                                                    height="600px"
                                                  ></iframe>
                                                  {(data?.description ===
                                                    "Statement of Confidentiality and Non-Disclosure" ||
                                                    data?.description ===
                                                    "Conflict Of Interest Policy") && (
                                                      <div className={style.grid2}>
                                                        <div
                                                          onClick={
                                                            form?.forms[index]?.staffEsign === null
                                                              ? () =>
                                                                handleStaffEsign(
                                                                  form?.forms?.filter(
                                                                    (data) =>
                                                                      data?.formCategory ===
                                                                      "Acknowledgement"
                                                                  )[index]?.id
                                                                )
                                                              : () => { }
                                                          }
                                                        >
                                                          <ESignature
                                                            userName={
                                                              form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? form?.forms?.filter(
                                                                  (data) =>
                                                                    data?.formCategory ===
                                                                    "Acknowledgement"
                                                                )[index]?.staffEsign?.name
                                                                : ""
                                                            }
                                                            encData={
                                                              form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? form?.forms?.filter(
                                                                  (data) =>
                                                                    data?.formCategory ===
                                                                    "Acknowledgement"
                                                                )[index]?.staffEsign?.esign
                                                                : ""
                                                            }
                                                            showData={
                                                              form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? true
                                                                : false
                                                            }
                                                            showDatais={true}
                                                          />
                                                        </div>
                                                        <div className={style.verticalAlignCenter}>
                                                          <div className={style.displayInRow}>
                                                            <div className={style.dateTitle}>
                                                              Date:{" "}
                                                            </div>
                                                            <div
                                                              className={`${style.date} ${style.marginLeft}`}
                                                            >
                                                              {form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign !== null
                                                                ? format(
                                                                  new Date(
                                                                    form?.forms?.filter(
                                                                      (data) =>
                                                                        data?.formCategory ===
                                                                        "Acknowledgement"
                                                                    )[
                                                                      index
                                                                    ]?.staffEsign?.signedDate
                                                                  ),
                                                                  canadaData?.dateFormat ||
                                                                  "dd/MM/yyyy"
                                                                )
                                                                : ""}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                </>
                                              )}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                              </div>
                            ) : (" ")}
                            <div className={style.marginBottom20}></div>
                          </div>
                        </div>
                      ) : (
                        <div className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop10}`}>
                          <div>


                            <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyleCred1} `}>

                              <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                <div className={`${style.tableHeaderTextStyleCred}`}> Required Reappointment data and Proof of Documentation for July 1, 2025 and June 30, 2026 </div>
                              </div>

                            </div>
                            <div>
                              <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === 0) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                                <div className={` ${(expand?.status && expand?.index === 0) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1} ${style.marginTop10}`}>

                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                    <div className={`${(expand?.status && expand?.index === 0) ? style.tableHeaderTextStyleCred : style.tableDataFontStyleCred}`}>Applicant Profile Information</div>
                                  </div>


                                  {(expand?.status && expand?.index === 0) ? (
                                    <>
                                      {!form?.basicInformationStatus ? (
                                        <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                                          <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleVerify()}>Approve</div>
                                        </div>
                                      ) : (
                                        <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                                          <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    " "
                                  )}

                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                    <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                      {
                                        (expand?.status && expand?.index === 0) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: false, index: 0 })} />)
                                          : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => setExpand({ status: true, index: 0 })} />)
                                      }                    </div>
                                  </div>
                                </div>
                                {expand?.status && expand?.index === 0 &&
                                  <div className={`${style.marginTop} ${style.screenPadding}`}>

                                    {form1 !== undefined && 'applicant' in form1?.properties && (
                                      <ApplicationFieldCard object={form1?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                    )}
                                    {form1 !== undefined && 'credentialingPrivilegeCategory' in form1?.properties && (
                                      <ApplicationFieldCard object={form1?.properties?.credentialingPrivilegeCategory} gridStyle={style.credentialingGrid} baseKey={'credentialingPrivilegeCategory'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                    )}
                                    {form1 !== undefined && 'departmentSpecialty' in form1?.properties && (
                                      <ApplicationFieldCard object={form1?.properties?.departmentSpecialty} gridStyle={style.twoCol} baseKey={'departmentSpecialty'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                    )}
                                    {form1 !== undefined && (getValueByPath(form, 'basicDetails.departmentSpecialty.department') === form1.if.properties.departmentSpecialty.properties.department.const && form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(getValueByPath(form, 'basicDetails.departmentSpecialty.specialty'))) && (
                                      form1 !== undefined && 'regionalCallResponsibilities' in form1?.properties && (
                                        <ApplicationFieldCard object={form1?.properties?.regionalCallResponsibilities} gridStyle={''} baseKey={'regionalCallResponsibilities'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                      )
                                    )}
                                    {form1 !== undefined && 'billingNumber' in form1?.properties && (
                                      <ApplicationFieldCard object={form1?.properties?.billingNumber} gridStyle={style.twoCol} baseKey={'billingNumber'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                                    )}
                                  </div>
                                }


                              </div>

                              {
                                form?.formSchemas?.filter(
                                  (data) => {
                                    if (form?.creationType === "NEW") {
                                      return (
                                        (data?.formCategory === "Form" || data?.formCategory === "Disclosure") &&
                                        data?.schemaCategory !== "UploadYourDoc"
                                      );
                                    } else {
                                      // Default filter when form?.creationType is not "NEW"
                                      return (
                                        (data?.formCategory === "Form" || data?.formCategory === "Disclosure" || data?.formCategory === "Acknowledgement")
                                        // data?.schemaCategory !== "UploadYourDoc"
                                      );
                                    }
                                  })?.map((data, index) => (

                                    <div className={` ${style.marginTop5} ${(expand?.status && expand?.index === index + 1) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                                      <div className={` ${expand?.index === index + 1 ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred} ${style.marginTop10}`}>

                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                          <div className={`${style.tableDataFontStyleCred}`}>{data?.title}</div>
                                        </div>
                                        {/* {!(expand?.status && expand?.index === index + 1) && (
                          <>
                            {form?.forms[index]?.status === "APPROVED" ? (
                              <div className={`${style.approvedButtonStyle} ${style.ApprovedTextStyle}`}>Approved</div>
                            ) : (
                              <div className={`${style.assessInCred} ${style.assessTextStyle}`}>4 to Assess</div>
                            )}
                          </>
                        )} */}
                                        {/* {expand?.status && expand?.index === index + 1 && (
                            <>
                                {credApproval?.filter(
                                (newData) =>{console.log("newData.schema:", newData.schemaId);
                                    console.log("data.id:", data.id);
                                   return newData.schemaId === data.id
                                }
                                )[0]?.approvalRequired === true ? (
                                <>
                                    {form?.forms[index]?.status !== "APPROVED" ? (
                                    <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                        <div
                                        className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                        onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                        >
                                        Approve
                                        </div>
                                    </div>
                                    ) : (
                                    <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        Approved
                                        </div>
                                    </div>
                                    )}
                                </>
                                ) : (""
                                )}
                            </>
                            )} */}

                                        {/* working with log details without credapproval false */}
                                        {/* {expand?.status && expand?.index === index + 1 && (
                            <>
                                {credApproval?.some((newData) => {
                          console.log("newData.approvalRequired:", newData.approvalRequired);
                          return newData.schemaId === data.id && newData.approvalRequired;
                        }) && (
                          <>
                            {logDetails?.logs && Array.isArray(logDetails.logs) && (
                              (() => {
                                const isMatch = logDetails.logs.some((log) => {
                                  if (log.form && log.form.id) {
                                    const match = log.form.id === form?.forms[index]?.id;
                                    console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                    if (match) {
                                      let Match = false;

                                      // Check if userRole includes log.role
                                      if (userRole?.includes(log.role)) {
                                        console.log("Role matches user role: " + log.role);
                                        Match = true;
                                      }

                                      // Determine selectedTabRole based on selectedTab
                                      let selectedTabRole;
                                      if (selectedTab === 'level-2') {
                                        selectedTabRole = "Department Head";
                                      } else if (selectedTab === 'level-3') {
                                        selectedTabRole = "Chief Of Staff";
                                      } else if (selectedTab === 'level-4') {
                                        selectedTabRole = "Advisory Committee";
                                      } else if (selectedTab === 'level-5') {
                                        selectedTabRole = "Board";
                                      } else if (selectedTab === 'level-1') {
                                        selectedTabRole = "Staff Manager";
                                      }

                                      // Check if selectedTabRole matches log.role
                                      if (selectedTabRole === log.role) {
                                        console.log("Selected tab role matches log role: " + log.role);
                                        Match = true;
                                      }

                                      return Match;
                                    }
                                  }
                                  return false;
                                });

                                return (
                                  <div>
                                    {isMatch ? (
                                      <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        Approved
                                        </div>
                                    </div>
                                    ) : (
                                    form?.forms[index]?.status !== "APPROVED" ? (
                                    <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                        <div
                                        className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                        onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                        >
                                        Approve
                                        </div>
                                    </div>
                                    ) : (
                                    <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        Approved
                                        </div>
                                    </div>
                                    )
                                    )}
                                  </div>
                                );
                              })()
                            )}
                          </>
                        )}
                            </>
                            )} */}
                                        {/* woking with credapproval false  */}
                                        {expand?.status && expand?.index === index + 1 && (
                                          <>
                                            {credApproval?.some((newData) => {
                                              console.log("newData.approvalRequired:", newData.approvalRequired);
                                              return newData.schemaId === data.id && newData.approvalRequired;
                                            }) ? (
                                              <>
                                                {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                  (() => {
                                                    const isMatch = logDetails.logs.some((log) => {
                                                      if (log.form && log.form.id) {
                                                        const match = log.form.id === form?.forms[index]?.id;
                                                        console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                        if (match) {
                                                          let Match = false;

                                                          // Check if userRole includes log.role
                                                          if (workModeType === log.role) {
                                                            console.log("Role matches user role: " + log.role);
                                                            Match = true;
                                                          }

                                                          // Determine selectedTabRole based on selectedTab
                                                          let selectedTabRole;
                                                          if (selectedTab === 'level-2') {
                                                            selectedTabRole = "Department Head";
                                                          } else if (selectedTab === 'level-3') {
                                                            selectedTabRole = "Chief Of Staff";
                                                          } else if (selectedTab === 'level-4') {
                                                            selectedTabRole = "Advisory Committee";
                                                          } else if (selectedTab === 'level-5') {
                                                            selectedTabRole = "Board";
                                                          } else if (selectedTab === 'level-1') {
                                                            selectedTabRole = "Staff Manager";
                                                          }

                                                          // Check if selectedTabRole matches log.role
                                                          if (selectedTabRole === log.role) {
                                                            console.log("Selected tab role matches log role: " + log.role);
                                                            Match = true;
                                                          }

                                                          return Match;
                                                        }
                                                      }
                                                      return false;
                                                    });

                                                    return (
                                                      <div>
                                                        {isMatch ? (
                                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                              Approved
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          form?.forms[index]?.status !== "APPROVED" ? (
                                                            <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                              <div
                                                                className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                              >
                                                                Approve
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Approved
                                                              </div>
                                                            </div>
                                                          )
                                                        )}
                                                      </div>
                                                    );
                                                  })()
                                                )}
                                              </>
                                            ) : (
                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                  Approved
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}

                                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                          <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                            {
                                              (expand?.status && expand?.index === index + 1) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                                : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpand({ status: true, index: index + 1 }); setFormSchemaId(data?.id) }} />)
                                            }

                                          </div>
                                        </div>
                                      </div>
                                      {expand?.status && expand?.index === index + 1 &&
                                        <div className={`${style.marginTop} ${style.screenPadding}`}>
                                          {renderFieldsBasedOnStep(data)}
                                        </div>
                                      }
                                    </div>))}

                            </div>
                            {applicationType === "NEW" ? (
                              <div>
                                <div className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderStyleCred} `}>
                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                    <div className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}></div>
                                  </div>
                                  <div className={`${style.displayInRow} ${style.verticalAlignCenter} `} >
                                    <div className={`${style.tableHeaderTextStyleCred}`}>Requested Form Completeness Check</div>
                                  </div>
                                </div>
                                {form?.formSchemas?.filter(data => data?.formCategory === 'Acknowledgement')?.map((data, index) => (
                                  <div className={` ${style.marginTop5} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableDataStyle1 : style.tableDataStyle}`}>
                                    <div className={` ${style.marginTop10} ${(expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? style.tableHeaderGridStyleFormCred : style.tableHeaderGridStyleCred1}`}>

                                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                        <div className={`${style.tableDataFontStyleCred}`}>{data?.title}</div>
                                      </div>
                                      {/* {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                        <>
                          {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.status !== "APPROVED" ? (
                            <div className={`${style.purpleButton} ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`} onClick={() => handleStepsVerify(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id)}>Approve</div>
                            </div>
                          ) : (
                            <div className={`${style.greenButton}  ${style.cursorPointer} `}>
                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>Approved</div>
                            </div>
                          )}
                        </>
                      )} */}
                                      {/* {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                              <>
                                {form?.forms?.filter((data) => data?.formCategory === "Acknowledgement")[index]?.status !== "APPROVED" && (
                                  <>
                                    {credApproval?.some((newData) => newData.schemaId === data.id && newData.approvalRequired) && (
                                      <>
                                        {logDetails?.logs && Array.isArray(logDetails.logs) && (() => {
                                          const isMatch = logDetails.logs.some((log) => {
                                            if (log.form && log.form.id) {
                                              const match = log.form.id === form?.forms[index]?.id;
                                              console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                              if (match) {
                                                let Match = false;

                                                // Check if userRole includes log.role
                                                if (userRole?.includes(log.role)) {
                                                  console.log("Role matches user role: " + log.role);
                                                  Match = true;
                                                }

                                                // Determine selectedTabRole based on selectedTab
                                                let selectedTabRole;
                                                switch (selectedTab) {
                                                  case 'level-1':
                                                    selectedTabRole = "Staff Manager";
                                                    break;
                                                  case 'level-2':
                                                    selectedTabRole = "Department Head";
                                                    break;
                                                  case 'level-3':
                                                    selectedTabRole = "Chief Of Staff";
                                                    break;
                                                  case 'level-4':
                                                    selectedTabRole = "Advisory Committee";
                                                    break;
                                                  case 'level-5':
                                                    selectedTabRole = "Board";
                                                    break;
                                                  default:
                                                    selectedTabRole = "";
                                                }

                                                // Check if selectedTabRole matches log.role
                                                if (selectedTabRole === log.role) {
                                                  console.log("Selected tab role matches log role: " + log.role);
                                                  Match = true;
                                                }

                                                return Match;
                                              }
                                            }
                                            return false;
                                          });

                                          return (
                                            <div>
                                                                                            {isMatch ? (
                                      <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                          Approved
                                        </div>
                                      </div>
                                    ) : (
                                      form?.forms[index]?.status !== "APPROVED" ? (
                                        <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                          <div
                                            className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                            onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                          >
                                            Approve
                                          </div>
                                        </div>
                                      ) : (
                                        <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                          <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                            Approved
                                          </div>
                                        </div>
                                      )
                                    )}
                                            </div>
                                          );
                                        })()}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )} */}
                                      {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                                        <>
                                          {form?.forms?.filter((data) => data?.formCategory === "Acknowledgement")[index]?.status !== "APPROVED" && (
                                            <>
                                              {credApproval?.some((newData) => {

                                                return newData.schemaId === data.id && newData.approvalRequired;

                                              }) ? (
                                                <>
                                                  <>
                                                    {logDetails?.logs && Array.isArray(logDetails.logs) && (() => {
                                                      const isMatch = logDetails.logs.some((log) => {
                                                        if (log.form && log.form.id) {
                                                          const match = log.form.id === form?.forms[index]?.id;
                                                          console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                          if (match) {
                                                            let Match = false;

                                                            // Check if userRole includes log.role
                                                            if (workModeType === log.role) {
                                                              console.log("Role matches user role: " + log.role);
                                                              Match = true;
                                                            }

                                                            // Determine selectedTabRole based on selectedTab
                                                            let selectedTabRole;
                                                            switch (selectedTab) {
                                                              case 'level-1':
                                                                selectedTabRole = "Staff Manager";
                                                                break;
                                                              case 'level-2':
                                                                selectedTabRole = "Department Head";
                                                                break;
                                                              case 'level-3':
                                                                selectedTabRole = "Chief Of Staff";
                                                                break;
                                                              case 'level-4':
                                                                selectedTabRole = "Advisory Committee";
                                                                break;
                                                              case 'level-5':
                                                                selectedTabRole = "Board";
                                                                break;
                                                              default:
                                                                selectedTabRole = "";
                                                            }

                                                            // Check if selectedTabRole matches log.role
                                                            if (selectedTabRole === log.role) {
                                                              console.log("Selected tab role matches log role: " + log.role);
                                                              Match = true;
                                                            }

                                                            return Match;
                                                          }
                                                        }
                                                        return false;
                                                      });

                                                      return (
                                                        <div>
                                                          {isMatch ? (
                                                            <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                              <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                Approved
                                                              </div>
                                                            </div>
                                                          ) : (
                                                            form?.forms[index]?.status !== "APPROVED" ? (
                                                              <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                <div
                                                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                  onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                                >
                                                                  Approve
                                                                </div>
                                                              </div>
                                                            ) : (
                                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                  Approved
                                                                </div>
                                                              </div>
                                                            )
                                                          )}
                                                        </div>
                                                      );
                                                    })()}
                                                  </>

                                                </>
                                              ) : (
                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                  <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                    Approved
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`} >
                                        <div className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}>
                                          {
                                            (expandAcknowledgement?.status && expandAcknowledgement?.index === index) ? (<RemoveIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: false, index: 0 }); setFormSchemaId('') }} />)
                                              : (<AddIcon sx={{ fontSize: 20, color: '#94979A', cursor: 'pointer' }} onClick={() => { setExpandAcknowledgement({ status: true, index: index }); setFormSchemaId(data?.id) }} />)
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    {expandAcknowledgement?.status && expandAcknowledgement?.index === index &&
                                      <div className={`${style.marginTop} ${style.screenPadding}`}>
                                        {form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length !== 0 && (
                                          <>
                                            <iframe src={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles[form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.uploadedFiles?.length - 1]?.fileURL} width="100%" height="600px"></iframe>
                                            {(data?.description === 'Statement of Confidentiality and Non-Disclosure' || data?.description === 'Conflict Of Interest Policy') && (
                                              <div className={style.grid2}>
                                                <div onClick={form?.forms[index]?.staffEsign === null ? () => handleStaffEsign(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.id) : () => { }} >
                                                  <ESignature
                                                    userName={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.name : ""}
                                                    encData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.esign : ''}
                                                    showData={form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? true : false}
                                                    showDatais={true}
                                                  />
                                                </div>
                                                <div className={style.verticalAlignCenter}>
                                                  <div className={style.displayInRow}>
                                                    <div className={style.dateTitle}>Date: </div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>{form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign !== null ? format(new Date(form?.forms?.filter(data => data?.formCategory === 'Acknowledgement')[index]?.staffEsign?.signedDate), canadaData?.dateFormat || 'dd/MM/yyyy') : ""}</div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    }
                                  </div>))}
                              </div>
                            ) : (" ")}
                            <div className={style.marginBottom20}></div>
                          </div>
                        </div>
                      )}
                    </>
                  </div>
                  <>
                    {(workModeType === 'Staff Manager') ? (
                      <div
                        className={`${style.cardLeftStyle} ${style.bigCalendarLeftCardWidth}`}
                      >

                        <div>
                          <div
                            className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle} `}
                          >
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                            >
                              <div
                                className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                            >
                              <div className={`${style.tableHeaderTextStyle}`}>
                                Required Reappointment data and Proof of Documentation for July 1, 2025 and June 30, 2026
                              </div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                            >
                              <div
                                className={`${style.tableHeaderTextStyle}`}
                                aria-owns={open ? "mouse-over-popover" : undefined}
                                aria-haspopup="true"
                                onMouseEnter={handlePopoverOpen}
                                onMouseLeave={handlePopoverClose}
                              >
                                <img
                                  src={DataStatusIcon}
                                  alt=""
                                  style={{
                                    width: "18px",
                                    height: "20px",
                                  }}
                                />
                                <Popover
                                  id={"mouse-over-popover"}
                                  sx={{
                                    pointerEvents: "none",
                                  }}
                                  open={open}
                                  anchorEl={anchorEl}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                  }}
                                  onClose={handlePopoverClose}
                                  PaperProps={{
                                    style: {
                                      backgroundColor: "transparent",
                                      boxShadow: "none",
                                      borderRadius: 0,
                                    },
                                  }}
                                  disableRestoreFocus
                                >
                                  <div className={style.multipleOptionsCard}>
                                    <div
                                      className={`${style.specificActionCard} ${style.cursorPointer}`}
                                    >
                                      Data Quality Status
                                    </div>
                                  </div>
                                </Popover>
                              </div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                            >
                              <div
                                className={`${style.tableHeaderTextStyle}`}
                                aria-owns={
                                  openTextWithHover ? "mouse-over-popover" : undefined
                                }
                                aria-haspopup="true"
                                onMouseEnter={handlePopoverTextOpen}
                                onMouseLeave={handlePopoverTextClose}
                              >
                                <img
                                  src={DocumentIcon}
                                  alt=""
                                  style={{
                                    width: "18px",
                                    height: "20px",
                                  }}
                                />
                                <Popover
                                  id={"mouse-over-popover"}
                                  sx={{
                                    pointerEvents: "none",
                                  }}
                                  open={openTextWithHover}
                                  anchorEl={anchorTextEl}
                                  anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "center",
                                  }}
                                  transformOrigin={{
                                    vertical: "top",
                                    horizontal: "center",
                                  }}
                                  onClose={handlePopoverTextClose}
                                  PaperProps={{
                                    style: {
                                      backgroundColor: "transparent",
                                      boxShadow: "none",
                                      borderRadius: 0,
                                    },
                                  }}
                                  disableRestoreFocus
                                >
                                  <div className={style.multipleOptionsCard}>
                                    <div
                                      className={`${style.specificActionCard} ${style.cursorPointer}`}
                                    >
                                      Document Status
                                    </div>
                                  </div>
                                </Popover>
                              </div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                            >
                              <div className={`${style.tableHeaderTextStyle}`}>
                                Documents
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              className={` ${style.marginTop5} ${expand?.status && expand?.index === 0
                                ? style.tableDataStyle1
                                : style.tableDataStyle
                                }`}
                            >
                              <div
                                className={` ${expand?.status && expand?.index === 0
                                  ? style.tableHeaderGridStyleForm
                                  : style.tableHeaderGridStyle
                                  } ${style.marginTop10}`}
                              >
                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                >
                                  <div
                                    className={`${style.marginLeft10} ${style.justifySpaceAround
                                      } ${form?.basicInformationStatus
                                        ? style.greenDotStyle
                                        : style.greyDotStyle
                                      }`}
                                  ></div>
                                </div>
                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                >
                                  <div
                                    className={`${expand?.status && expand?.index === 0
                                      ? style.tableHeaderTextStyle
                                      : style.tableDataFontStyle1
                                      }`}
                                  >
                                    Applicant Profile Information
                                  </div>
                                </div>
                                {expand?.status && expand?.index === 0 ? (
                                  <>
                                    {!form?.basicInformationStatus ? (
                                      <div
                                        className={`${style.purpleButton} ${style.cursorPointer} `}
                                      >
                                        <div
                                          className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                          onClick={() => handleVerify()}
                                        >
                                          Verify
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className={`${style.greenButton}  ${style.cursorPointer} `}
                                      >
                                        <div
                                          className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                        >
                                          Verified
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                    >
                                      <div
                                        className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                                      ></div>
                                    </div>
                                    <div
                                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                    >
                                      <div
                                        className={`${style.marginLeft10}${style.justifySpaceAround} ${style.greyDotStyle}`}
                                      ></div>
                                    </div>
                                    <div
                                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                    >
                                      <div
                                        className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                      >
                                        -
                                      </div>
                                    </div>
                                  </>
                                )}

                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                >
                                  <div
                                    className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                  >
                                    {expand?.status && expand?.index === 0 ? (
                                      <RemoveIcon
                                        sx={{
                                          fontSize: 20,
                                          color: "#94979A",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          setExpand({ status: false, index: 0 })
                                        }
                                      />
                                    ) : (
                                      <AddIcon
                                        sx={{
                                          fontSize: 20,
                                          color: "#94979A",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          setExpand({ status: true, index: 0 })
                                        }
                                      />
                                    )}{" "}
                                  </div>
                                </div>
                              </div>
                              {expand?.status && expand?.index === 0 && (
                                <div
                                  className={`${style.marginTop} ${style.screenPadding}`}
                                >

                                  {form1 !== undefined &&
                                    "applicant" in form1?.properties && (
                                      <ApplicationFieldCard
                                        object={form1?.properties?.applicant}
                                        gridStyle={style.applicantGrid}
                                        baseKey={"applicant"}
                                        basicForm={form}
                                        setBasicForm={setForm}
                                        isBasicPath={true}
                                        isPOD={true}
                                      />
                                    )}
                                  {form1 !== undefined &&
                                    "credentialingPrivilegeCategory" in
                                    form1?.properties && (
                                      <ApplicationFieldCard
                                        object={
                                          form1?.properties?.credentialingPrivilegeCategory
                                        }
                                        gridStyle={style.credentialingGrid}
                                        baseKey={"credentialingPrivilegeCategory"}
                                        basicForm={form}
                                        setBasicForm={setForm}
                                        isBasicPath={true}
                                        isPOD={true}
                                      />
                                    )}
                                  {form1 !== undefined &&
                                    "departmentSpecialty" in form1?.properties && (
                                      <ApplicationFieldCard
                                        object={form1?.properties?.departmentSpecialty}
                                        gridStyle={style.twoCol}
                                        baseKey={"departmentSpecialty"}
                                        basicForm={form}
                                        setBasicForm={setForm}
                                        isBasicPath={true}
                                        isPOD={true}
                                      />
                                    )}
                                  {form1 !== undefined &&
                                    getValueByPath(
                                      form,
                                      "basicDetails.departmentSpecialty.department"
                                    ) ===
                                    form1.if.properties.departmentSpecialty.properties
                                      .department.const &&
                                    form1.if.properties.departmentSpecialty.properties.specialty.enum?.includes(
                                      getValueByPath(
                                        form,
                                        "basicDetails.departmentSpecialty.specialty"
                                      )
                                    ) &&
                                    form1 !== undefined &&
                                    "regionalCallResponsibilities" in form1?.properties && (
                                      <ApplicationFieldCard
                                        object={
                                          form1?.properties?.regionalCallResponsibilities
                                        }
                                        gridStyle={""}
                                        baseKey={"regionalCallResponsibilities"}
                                        basicForm={form}
                                        setBasicForm={setForm}
                                        isBasicPath={true}
                                        isPOD={true}
                                      />
                                    )}
                                  {form1 !== undefined &&
                                    "billingNumber" in form1?.properties && (
                                      <ApplicationFieldCard
                                        object={form1?.properties?.billingNumber}
                                        gridStyle={style.twoCol}
                                        baseKey={"billingNumber"}
                                        basicForm={form}
                                        setBasicForm={setForm}
                                        isBasicPath={true}
                                        isPOD={true}
                                      />
                                    )}
                                </div>
                              )}
                            </div>

                            {form?.formSchemas
                              ?.filter(
                                (data) => {
                                  if (form?.creationType === "NEW") {
                                    return (
                                      (data?.formCategory === "Form" || data?.formCategory === "Disclosure") &&
                                      data?.schemaCategory !== "UploadYourDoc"
                                    );
                                  } else {
                                    // Default filter when form?.creationType is not "NEW"
                                    return (
                                      (data?.formCategory === "Form" || data?.formCategory === "Disclosure" || data?.formCategory === "Acknowledgement")
                                      // data?.schemaCategory !== "UploadYourDoc"
                                    );
                                  }
                                })
                              ?.map((data, index) => (
                                <div
                                  className={` ${style.marginTop5} ${expand?.status && expand?.index === index + 1
                                    ? style.tableDataStyle1
                                    : style.tableDataStyle
                                    }`}
                                >
                                  <div
                                    className={` ${expand?.index === index + 1
                                      ? style.tableHeaderGridStyleForm
                                      : style.tableHeaderGridStyle
                                      } ${style.marginTop10}`}
                                  >
                                    <div
                                      className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                    >
                                      <div
                                        className={`${style.marginLeft10} ${style.justifySpaceAround
                                          } ${form?.forms[index]?.status !== "APPROVED" &&
                                            form?.forms[index]?.schemaCategory !== "UploadYourDoc"
                                            ? style.greyDotStyle
                                            : style.greenDotStyle
                                          }`}
                                      ></div>
                                    </div>
                                    <div
                                      className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                    >
                                      <div className={`${style.tableDataFontStyle1}`}>
                                        {data?.title}
                                      </div>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                        >
                                          {expand?.status && expand?.index === index + 1 ? (
                                            <RemoveIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setExpand({ status: false, index: 0 });
                                                setFormSchemaId("");
                                              }}
                                            />
                                          ) : (
                                            <AddIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setExpand({ status: true, index: index + 1 });
                                                setFormSchemaId(data?.id);
                                              }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {/* {expand?.status && expand?.index === index + 1 ? (
                          <>
                            {form?.forms[index]?.status !== "APPROVED" &&
                             form?.forms[index]?.schemaCategory !== "UploadYourDoc" ? (
                              <div
                                className={`${style.purpleButton} ${style.cursorPointer} `}
                              >
                               {form?.forms[index]?.schemaCategory !== "UploadYourDoc" && (
                                    <div
                                      className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                      onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                    >
                                      Verify
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <div
                                className={`${style.greenButton}  ${style.cursorPointer} `}
                              >
                                <div
                                  className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                >
                                  Verified
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED" &&
                                      form?.forms[index]?.schemaCategory !== "UploadYourDoc"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10}${style.justifySpaceAround
                                  } ${form?.forms[index]?.status !== "APPROVED" &&
                                      form?.forms[index]?.schemaCategory !== "UploadYourDoc"
                                    ? style.greyDotStyle
                                    : style.greenDotStyle
                                  }`}
                              ></div>
                            </div>
                            <div
                              className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                            >
                              <div
                                className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                              >
                                {form?.forms
                                  ?.filter(
                                    (formData, formIndex) => formIndex === index
                                  )
                                  ?.map(
                                    (data) => data?.uploadedFiles?.length || 0
                                  )}
                              </div>
                            </div>
                          </>
                        )} */}
                                    {expand?.status && expand?.index === index + 1 ? (
                                      <>
                                        {credApproval?.some((newData) => {
                                          console.log("newData.approvalRequired:", newData.approvalRequired);
                                          return newData.schemaId === data.id && newData.approvalRequired;
                                        }) && (
                                            <>
                                              {logDetails?.logs && Array.isArray(logDetails.logs) && (
                                                (() => {
                                                  const isMatch = logDetails.logs.some((log) => {
                                                    if (log.form && log.form.id) {
                                                      const match = log.form.id === form?.forms[index]?.id;
                                                      console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                      if (match) {
                                                        let Match = false;

                                                        // Check if userRole includes log.role
                                                        if (workModeType === log.role) {
                                                          console.log("Role matches user role: " + log.role);
                                                          Match = true;
                                                        }

                                                        // Determine selectedTabRole based on selectedTab
                                                        let selectedTabRole;
                                                        if (selectedTab === 'level-2') {
                                                          selectedTabRole = "Department Head";
                                                        } else if (selectedTab === 'level-3') {
                                                          selectedTabRole = "Chief Of Staff";
                                                        } else if (selectedTab === 'level-4') {
                                                          selectedTabRole = "Advisory Committee";
                                                        } else if (selectedTab === 'level-5') {
                                                          selectedTabRole = "Board";
                                                        } else if (selectedTab === 'level-1') {
                                                          selectedTabRole = "Staff Manager";
                                                        }

                                                        // Check if selectedTabRole matches log.role
                                                        if (selectedTabRole === log.role) {
                                                          console.log("Selected tab role matches log role: " + log.role);
                                                          Match = true;
                                                        }

                                                        return Match;
                                                      }
                                                    }
                                                    return false;
                                                  });

                                                  return (
                                                    <div>
                                                      {isMatch ? (
                                                        <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                          <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                            Verified
                                                          </div>
                                                        </div>
                                                      ) : (
                                                        form?.forms[index]?.status !== "APPROVED" ? (
                                                          <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                            <div
                                                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                              onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                            >
                                                              Verify
                                                            </div>
                                                          </div>
                                                        ) : (
                                                          <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                              Verified
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  );
                                                })()
                                              )}
                                            </>
                                          )}
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                        >
                                          <div
                                            className={`${style.marginLeft10}${style.justifySpaceAround
                                              } ${form?.forms[index]?.status !== "APPROVED"
                                                ? style.greyDotStyle
                                                : style.greenDotStyle
                                              }`}
                                          ></div>
                                        </div>
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                        >
                                          <div
                                            className={`${style.marginLeft10}${style.justifySpaceAround
                                              } ${form?.forms[index]?.status !== "APPROVED"
                                                ? style.greyDotStyle
                                                : style.greenDotStyle
                                              }`}
                                          ></div>
                                        </div>
                                        <div
                                          className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                        >
                                          <div
                                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                          >
                                            {form?.forms
                                              ?.filter(
                                                (formData, formIndex) => formIndex === index
                                              )
                                              ?.map(
                                                (data) => data?.uploadedFiles?.length || 0
                                              )}
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {/* <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                  >
                                    <div
                                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                    >
                                      {expand?.status && expand?.index === index + 1 ? (
                                        <RemoveIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setExpand({ status: false, index: 0 });
                                            setFormSchemaId("");
                                          }}
                                        />
                                      ) : (
                                        <AddIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            setExpand({ status: true, index: index + 1 });
                                            setFormSchemaId(data?.id);
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div> */}
                                  </div>
                                  {expand?.status && expand?.index === index + 1 && (
                                    <div
                                      className={`${style.marginTop} ${style.screenPadding}`}
                                    >
                                      {renderFieldsBasedOnStep(data)}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                          {applicationType === "NEW" ? (
                            <div>
                              <div
                                className={`${style.tableHeaderStyle} ${style.marginTop20} ${style.tableHeaderGridStyle1} `}
                              >
                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                >
                                  <div
                                    className={`${style.marginLeft10} ${style.tableHeaderTextStyle}`}
                                  ></div>
                                </div>
                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                >
                                  <div className={`${style.tableHeaderTextStyle}`}>
                                    Requested Form Completeness Check
                                  </div>
                                </div>
                              </div>
                              {form?.formSchemas
                                ?.filter((data) => data?.formCategory === "Acknowledgement")
                                ?.map((data, index) => (
                                  <div
                                    className={` ${style.marginTop5} ${expandAcknowledgement?.status &&
                                      expandAcknowledgement?.index === index
                                      ? style.tableDataStyle1
                                      : style.tableDataStyle
                                      }`}
                                  >
                                    <div
                                      className={` ${style.marginTop10} ${expandAcknowledgement?.status &&
                                        expandAcknowledgement?.index === index
                                        ? style.tableHeaderGridStyleForm
                                        : style.tableHeaderGridStyle1
                                        }`}
                                    >
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.justifySpaceAround
                                            } ${form?.forms?.filter(
                                              (data) =>
                                                data?.formCategory === "Acknowledgement"
                                            )[index]?.status !== "APPROVED"
                                              ? style.greyDotStyle
                                              : style.greenDotStyle
                                            }`}
                                        ></div>
                                      </div>
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div className={`${style.tableDataFontStyle1}`}>
                                          {data?.title}
                                        </div>
                                      </div>
                                      {/* {expandAcknowledgement?.status &&
                          expandAcknowledgement?.index === index && (
                            <>
                              {form?.forms?.filter(
                                (data) =>
                                  data?.formCategory === "Acknowledgement"
                              )[index]?.status !== "APPROVED" ? (
                                <div
                                  className={`${style.purpleButton} ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                    onClick={() =>
                                      handleStepsVerify(
                                        form?.forms?.filter(
                                          (data) =>
                                            data?.formCategory ===
                                            "Acknowledgement"
                                        )[index]?.id
                                      )
                                    }
                                  >
                                    Verify
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`${style.greenButton}  ${style.cursorPointer} `}
                                >
                                  <div
                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                  >
                                    Verified
                                  </div>
                                </div>
                              )}
                            </>
                          )} */}
                                      {/* wokring credapproval without false */}
                                      {/* {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                              <>
                                {form?.forms?.filter((data) => data?.formCategory === "Acknowledgement") && (
                                  <>
                                    {credApproval?.some((newData) => newData.schemaId === data.id && newData.approvalRequired) && (
                                      <>
                                        {logDetails?.logs && Array.isArray(logDetails.logs) && (() => {
                                          const isMatch = logDetails.logs.some((log) => {
                                            if (log.form && log.form.id) {
                                              const match = log.form.id === form?.forms[index]?.id;
                                              console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                              if (match) {
                                                let Match = false;

                                                // Check if userRole includes log.role
                                                if (userRole?.includes(log.role)) {
                                                  console.log("Role matches user role: " + log.role);
                                                  Match = true;
                                                }

                                                // Determine selectedTabRole based on selectedTab
                                                let selectedTabRole;
                                                switch (selectedTab) {
                                                  case 'level-1':
                                                    selectedTabRole = "Staff Manager";
                                                    break;
                                                  case 'level-2':
                                                    selectedTabRole = "Department Head";
                                                    break;
                                                  case 'level-3':
                                                    selectedTabRole = "Chief Of Staff";
                                                    break;
                                                  case 'level-4':
                                                    selectedTabRole = "Advisory Committee";
                                                    break;
                                                  case 'level-5':
                                                    selectedTabRole = "Board";
                                                    break;
                                                  default:
                                                    selectedTabRole = "";
                                                }

                                                // Check if selectedTabRole matches log.role
                                                if (selectedTabRole === log.role) {
                                                  console.log("Selected tab role matches log role: " + log.role);
                                                  Match = true;
                                                }

                                                return Match;
                                              }
                                            }
                                            return false;
                                          });

                                          return (
                                            <div>
                                               {isMatch ? (
                                      <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                          Approved
                                        </div>
                                      </div>
                                    ) : (
                                      form?.forms[index]?.status !== "APPROVED" ? (
                                        <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                          <div
                                            className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                            onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                          >
                                            Approve
                                          </div>
                                        </div>
                                      ) : (
                                        <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                          <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                            Approved
                                          </div>
                                        </div>
                                      )
                                    )}
                                            </div>
                                          );
                                        })()}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )} */}
                                      {/* working with cred Approval */}
                                      {expandAcknowledgement?.status && expandAcknowledgement?.index === index && (
                                        <>
                                          {form?.forms?.filter((data) => data?.formCategory === "Acknowledgement")[index]?.status !== "APPROVED" && (
                                            <>
                                              {credApproval?.some((newData) => {
                                                if (newData.schemaId === data.id && newData.approvalRequired) {
                                                  return true;
                                                }
                                                return false;
                                              }) ? (
                                                <>
                                                  {credApproval?.some((newData) => newData.schemaId === data.id && newData.approvalRequired) && (
                                                    <>
                                                      {logDetails?.logs && Array.isArray(logDetails.logs) && (() => {
                                                        const isMatch = logDetails.logs.some((log) => {
                                                          if (log.form && log.form.id) {
                                                            const match = log.form.id === form?.forms[index]?.id;
                                                            console.log("Checking log.form.id === form.forms[index].id:", log.form.id, form?.forms[index]?.id, match);

                                                            if (match) {
                                                              let Match = false;

                                                              // Check if userRole includes log.role
                                                              if (workModeType === log.role) {
                                                                console.log("Role matches user role: " + log.role);
                                                                Match = true;
                                                              }

                                                              // Determine selectedTabRole based on selectedTab
                                                              let selectedTabRole;
                                                              switch (selectedTab) {
                                                                case 'level-1':
                                                                  selectedTabRole = "Staff Manager";
                                                                  break;
                                                                case 'level-2':
                                                                  selectedTabRole = "Department Head";
                                                                  break;
                                                                case 'level-3':
                                                                  selectedTabRole = "Chief Of Staff";
                                                                  break;
                                                                case 'level-4':
                                                                  selectedTabRole = "Advisory Committee";
                                                                  break;
                                                                case 'level-5':
                                                                  selectedTabRole = "Board";
                                                                  break;
                                                                default:
                                                                  selectedTabRole = "";
                                                              }

                                                              // Check if selectedTabRole matches log.role
                                                              if (selectedTabRole === log.role) {
                                                                console.log("Selected tab role matches log role: " + log.role);
                                                                Match = true;
                                                              }

                                                              return Match;
                                                            }
                                                          }
                                                          return false;
                                                        });

                                                        return (
                                                          <div>
                                                            {isMatch ? (
                                                              <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                  Approved
                                                                </div>
                                                              </div>
                                                            ) : (
                                                              form?.forms[index]?.status !== "APPROVED" ? (
                                                                <div className={`${style.purpleButton} ${style.cursorPointer}`}>
                                                                  <div
                                                                    className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                                                    onClick={() => handleStepsVerify(form?.forms[index]?.id)}
                                                                  >
                                                                    Approve
                                                                  </div>
                                                                </div>
                                                              ) : (
                                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                                  <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                                    Approved
                                                                  </div>
                                                                </div>
                                                              )
                                                            )}
                                                          </div>
                                                        );
                                                      })()}
                                                    </>
                                                  )}
                                                </>
                                              ) : (
                                                <div className={`${style.greenButton} ${style.cursorPointer}`}>
                                                  <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                                    Approved
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          )}
                                        </>
                                      )}
                                      <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                      >
                                        <div
                                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                        >
                                          {expandAcknowledgement?.status &&
                                            expandAcknowledgement?.index === index ? (
                                            <RemoveIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setExpandAcknowledgement({
                                                  status: false,
                                                  index: 0,
                                                });
                                                setFormSchemaId("");
                                              }}
                                            />
                                          ) : (
                                            <AddIcon
                                              sx={{
                                                fontSize: 20,
                                                color: "#94979A",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                setExpandAcknowledgement({
                                                  status: true,
                                                  index: index,
                                                });
                                                setFormSchemaId(data?.id);
                                              }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {expandAcknowledgement?.status &&
                                      expandAcknowledgement?.index === index && (
                                        <div
                                          className={`${style.marginTop} ${style.screenPadding}`}
                                        >
                                          {form?.forms?.filter(
                                            (data) => data?.formCategory === "Acknowledgement"
                                          )[index]?.uploadedFiles?.length !== 0 && (
                                              <>
                                                <iframe
                                                  src={
                                                    form?.forms?.filter(
                                                      (data) =>
                                                        data?.formCategory === "Acknowledgement"
                                                    )[index]?.uploadedFiles[
                                                      form?.forms?.filter(
                                                        (data) =>
                                                          data?.formCategory ===
                                                          "Acknowledgement"
                                                      )[index]?.uploadedFiles?.length - 1
                                                    ]?.fileURL
                                                  }
                                                  width="100%"
                                                  height="600px"
                                                ></iframe>
                                                {(data?.description ===
                                                  "Statement of Confidentiality and Non-Disclosure" ||
                                                  data?.description ===
                                                  "Conflict Of Interest Policy") && (
                                                    <div className={style.grid2}>
                                                      <div
                                                        onClick={
                                                          form?.forms[index]?.staffEsign === null
                                                            ? () =>
                                                              handleStaffEsign(
                                                                form?.forms?.filter(
                                                                  (data) =>
                                                                    data?.formCategory ===
                                                                    "Acknowledgement"
                                                                )[index]?.id
                                                              )
                                                            : () => { }
                                                        }
                                                      >
                                                        <ESignature
                                                          userName={
                                                            form?.forms?.filter(
                                                              (data) =>
                                                                data?.formCategory ===
                                                                "Acknowledgement"
                                                            )[index]?.staffEsign !== null
                                                              ? form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign?.name
                                                              : ""
                                                          }
                                                          encData={
                                                            form?.forms?.filter(
                                                              (data) =>
                                                                data?.formCategory ===
                                                                "Acknowledgement"
                                                            )[index]?.staffEsign !== null
                                                              ? form?.forms?.filter(
                                                                (data) =>
                                                                  data?.formCategory ===
                                                                  "Acknowledgement"
                                                              )[index]?.staffEsign?.esign
                                                              : ""
                                                          }
                                                          showData={
                                                            form?.forms?.filter(
                                                              (data) =>
                                                                data?.formCategory ===
                                                                "Acknowledgement"
                                                            )[index]?.staffEsign !== null
                                                              ? true
                                                              : false
                                                          }
                                                          showDatais={true}
                                                        />
                                                      </div>
                                                      <div className={style.verticalAlignCenter}>
                                                        <div className={style.displayInRow}>
                                                          <div className={style.dateTitle}>
                                                            Date:{" "}
                                                          </div>
                                                          <div
                                                            className={`${style.date} ${style.marginLeft}`}
                                                          >
                                                            {form?.forms?.filter(
                                                              (data) =>
                                                                data?.formCategory ===
                                                                "Acknowledgement"
                                                            )[index]?.staffEsign !== null
                                                              ? format(
                                                                new Date(
                                                                  form?.forms?.filter(
                                                                    (data) =>
                                                                      data?.formCategory ===
                                                                      "Acknowledgement"
                                                                  )[
                                                                    index
                                                                  ]?.staffEsign?.signedDate
                                                                ),
                                                                canadaData?.dateFormat ||
                                                                "dd/MM/yyyy"
                                                              )
                                                              : ""}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                              </>
                                            )}
                                        </div>
                                      )}
                                  </div>
                                ))}
                            </div>
                          ) : (" ")}
                          <div className={style.marginBottom20}></div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                </>
              )}
            </>
            <div>
              {(workModeType === 'Staff Manager') || (workModeType === 'Chief Of Staff') || (workModeType === 'Credentialing Committee') || (workModeType === 'Credentialing Committee User') || (workModeType === 'Department Head') ? (
                <>
                  {/* {selectedTab !== "level-4" && selectedTab !== "level-5" && !(applicationType === "REAPPOINTMENT" && selectedTab === "level-1") && !(userRole.includes('Staff Manager') && applicationType === "REAPPOINTMENT" && selectedTab === "level-2") && !(userRole.includes('Credentialing Committee') && applicationType === "REAPPOINTMENT" && selectedTab === "level-4") && (
                  <div className={`${style.twoColumnGrid}`}>
                    <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                      <div
                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                        onClick={() => {
                          onClose();
                        }}
                      >
                        SAVE IN PROGRESS
                      </div>
                    </div>
                    <div
                      className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                    >
                      <div
                        className={`${style.buttonTextStyle} ${style.alignCenter}`}
                        // onClick={() => {
                        //   setShowApplicationDeclineDialog(true);
                        // }}
                        onClick={() => {
                          setShowApplicationDeclineDialog(true);
                        }}
                      >
                        NOT RECOMMENDED
                      </div>
                    </div>
                  </div>
                )} */}
                  {((workModeType === 'Staff Manager' && applicationType === "REAPPOINTMENT" && selectedTab === "level-1") || (workModeType === 'Chief Of Staff' && applicationType === "REAPPOINTMENT" && selectedTab === "level-1")) ? (
                    // <div className={`${style.twoColumnGrid}`}>
                    //   <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                    //     <div
                    //       className={`${style.buttonTextStyle} ${style.alignCenter}`}
                    //       onClick={() => {
                    //         onClose();
                    //       }}
                    //     >
                    //       SAVE IN PROGRESS
                    //     </div>
                    //   </div>
                    //   <div
                    //     className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                    //     // className={`${style.buttonCardStyle} ${isApproved ? style.cursorPointer : ''}`}
                    //     // style={{ opacity: isApproved ? 1 : 0.5 }}
                    //   >
                    //     <div
                    //       className={`${style.buttonTextStyle} ${style.alignCenter}`}
                    //       // onClick={() => {
                    //       //   onClickApprovalDeptFunction();
                    //       // }}
                    //       // onClick={isApproved ? onClickApprovalDeptFunction : undefined}
                    //       onClick={() => {
                    //         onClickApproveMoveFunction();
                    //       }}

                    //     >
                    //       Verified, Send to Dept. Chief
                    //     </div>
                    //   </div>
                    // </div>
                    <div className={`${style.fixedBottom} ${approvalwithoutnotesCommentsBox || approvalnotesCommentsBox || approvalnotesCommentsBoxDept || showApplicationDeclineDialog || notesCommentsBox || reappointmentChangesCommentsBox ? style.hiddenStickyContainer : " "} ${style.marginBottom20}`}>
                      <div className={`${style.twoColumnGrid}`}>
                        <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter}`}
                            onClick={() => {
                              onClose();
                            }}
                          >
                            SAVE IN PROGRESS
                          </div>
                        </div>
                        <div
                          className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                        >
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter}`}
                            // onClick={() => {
                            //   setShowApplicationDeclineDialog(true);
                            // }}
                            onClick={() => {
                              setShowApplicationDeclineDialog(true);
                            }}
                          >
                            REJECT
                          </div>
                        </div>
                      </div>
                      <div className={`${style.marginTop20}`}>
                        <div
                          // className={`${style.bigButtonStyle1} ${style.cursorPointer}`}
                          className={`${style.buttonCardStyle} ${isApproved ? style.cursorPointer : ''}`}
                          style={{ opacity: isApproved ? 1 : 0.5 }}>
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter}`}
                            // onClick={onClickApprovalDeptFunction}
                            onClick={isApproved ? onClose : undefined}
                          >
                            Verified, send later to Department Head
                          </div>
                        </div>
                      </div>
                      <div className={`${style.marginTop20}`}>
                        <div
                          // className={`${style.bigButtonStyle1} ${style.cursorPointer}`}
                          className={`${style.bigButtonStyle1} ${isApproved ? style.cursorPointer : ''}`}
                          style={{ opacity: isApproved ? 1 : 0.5 }}>
                          <div
                            className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                            // onClick={onClickApprovalDeptFunction}
                            onClick={isApproved ? onClickApprovalDeptFunction : undefined}
                          >
                            Verified, Send to Department Head
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ("")}
                  {(applicationType === "NEW" && (selectedTab === "level-1" || selectedTab === "level-2" || selectedTab === "level-3")) ? (
                    <>
                      <div className={`${style.twoColumnGrid}`}>
                        <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter}`}
                            onClick={() => {
                              onClose();
                            }}
                          >
                            SAVE IN PROGRESS
                          </div>
                        </div>
                        <div
                          className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                        // className={`${style.buttonCardStyle} ${isApproved ? style.cursorPointer : ''}`}
                        // style={{ opacity: isApproved ? 1 : 0.5 }}
                        >
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          // onClick={() => {
                          //   onClickApprovalDeptFunction();
                          // }}
                          // onClick={isApproved ? onClickApprovalDeptFunction : undefined}
                          >
                            Reject
                          </div>
                        </div>
                      </div>
                    </>
                  ) : ("")}

                  {(applicationType === "NEW" && selectedTab === "level-1") ? (
                    <div className={`${style.bigButtonStyle1} ${style.cursorPointer} ${style.marginTop20}`}>
                      <div
                        className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                        onClick={onClickApproveMoveFunction}
                      >
                        VERIFY & SEND FOR DEPARTMENT HEAD
                      </div>
                    </div>
                  ) : ("")}

                  {(applicationType === "NEW" && selectedTab === "level-2") ? (
                    <div className={`${style.bigButtonStyle1} ${style.cursorPointer} ${style.marginTop20}`}>
                      <div
                        className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                        onClick={onClickApproveMoveFunction}
                      >
                        VERIFY & SEND FOR CRED. COMM.
                      </div>
                    </div>
                  ) : ("")}

                  {(applicationType === "NEW" && selectedTab === "level-3") ? (
                    <div
                      className={`${style.bigButtonStyle1} ${style.cursorPointer} ${style.marginTop20} ${(workModeType === "Chief Of Staff") ? style.disabledButton : ""}`}
                      style={{ opacity: (workModeType === "Chief Of Staff") ? 0.5 : 1 }}
                      onClick={() => {
                        if (!(workModeType === "Chief Of Staff")) {
                          // Call your approve move function here
                          onClickApproveMoveFunction();
                        }
                      }}
                    >
                      <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>
                        APPROVE APPLICANT
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* <div className={`${style.marginBottom20}`}> */}

                  {/* {userRole?.includes('Staff Manager') && selectedTab !== "level-4" && selectedTab !== "level-5" && (!(applicationType === "REAPPOINTMENT" && userRole?.includes('Staff Manager'))) && (
                    <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                      <div
                        className={`${style.buttonCardStyle} ${style.cursorPointer}`}                      
                      >
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                          onClick={() => {
                            onClickApprovalFunction();
                          }}
                        >
  
                          RECOMMENDED WITH COMMENTS
                        </div>
                      </div>
                      <div
                        className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                  
                      >
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          
                          onClick={onClickApprovalFunction}
                        >
                          RECOMMENDED
                        </div>
                      </div>
                    </div>
                  )} */}
                  {/* 
                  {userRole?.includes('Department Head') && selectedTab === 'level-2' && (
                    <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                          // onClick={onClickApproveFunction}
                          onClick={() => {
                            onClickApprovalFunction();
                          }}
                        >
                          RECOMMENDED WITH COMMENTS
                        </div>
                      </div>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          onClick={onClickApprovalwithoutnotesFunction}
                        >
                          RECOMMENDED
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* {userRole?.includes('Credentialing Committee') && selectedTab === 'level-2' && (
                    <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                          // onClick={onClickApproveFunction}
                          onClick={() => {
                            onClickApprovalFunction();
                          }}
                        >
                          RECOMMENDED WITH COMMENTS
                        </div>
                      </div>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          onClick={onClickApprovalwithoutnotesFunction}
                        >
                          RECOMMENDED
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* {userRole?.includes('Staff Manager') && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && (
                    <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                          // onClick={onClickApproveFunction}
                          onClick={() => {
                            onClickApprovalFunction();
                          }}
                        >
                          RECOMMENDED WITH COMMENTS
                        </div>
                      </div>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          onClick={onClickApprovalFunction}
                        >
                          RECOMMENDED
                        </div>
                      </div>
                    </div>
                  )} */}
                  {/* 
                  {(userRole?.includes('Staff Manager') && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") && (
                    <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                          // onClick={onClickApproveFunction}
                          onClick={() => {
                            onClickApprovalFunction();
                          }}
                        >
                          RECOMMENDED WITH COMMENTS
                        </div>
                      </div>
                      <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          onClick={onClickApproveMoveFunction}
                        >
                          RECOMMENDED
                        </div>
                      </div>
                    </div>
                  )} */}

                  {(workModeType === 'Department Head' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "Approve") ? (
                    <div className={`${style.fixedBottom} `}>
                      {/* <div className={`${style.twoColumnGrid}`}> */}
                      <div className={`${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div className={`${style.marginLeft10} ${style.alignItem} ${style.yellowDotStyle}`} />
                        <div
                          className={`${style.buttonTextStyle} ${style.alignItem} ${style.marginLeft10}`}
                          onClick={() => {
                            onClose();
                          }}
                        >
                          SAVE IN PROGRESS
                        </div>
                      </div>
                      <div
                        className={` ${style.gridDot} ${style.buttonCardStyle} ${style.marginTop20} ${style.cursorPointer}`}
                      >
                        <div className={`${style.marginLeft10} ${style.alignItem} ${style.redDotStyle}`} />
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.marginLeft10}`}
                          // onClick={() => {
                          //   setShowApplicationDeclineDialog(true);
                          // }}
                          onClick={() => {
                            setShowApplicationDeclineDialog(true);
                          }}
                        >
                          NOT RECOMMENDED
                        </div>
                      </div>
                      {/* </div> */}
                      <div className={`${style.marginTop20}`}>
                        <div className={` ${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer}`}>
                          <div className={`${style.marginLeft10} ${style.alignItem} ${style.lightGreenDotStyle}`} />
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft10}`}
                            // onClick={onClickApproveFunction}
                            onClick={() => {
                              onClickApprovalFunction();
                            }}
                          >
                            RECOMMENDED WITH COMMENTS
                          </div>
                        </div>
                        <div className={` ${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer} ${style.marginTop20} ${style.marginBottom20}`}>
                          <div className={`${style.marginLeft10} ${style.alignItem} ${style.greenDotStyle}`} />
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter} ${style.marginLeft10}`}
                            onClick={onClickApprovalwithoutnotesFunction}
                          >
                            RECOMMEND
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (" ")}
                  {(workModeType === 'Chief Of Staff' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "Approve") ? (
                    <div className={`${style.fixedBottom}`}>
                      {/* <div className={`${style.twoColumnGrid}`}> */}
                      <div className={`${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div className={`${style.marginLeft10} ${style.alignItem} ${style.yellowDotStyle}`} />
                        <div
                          className={`${style.buttonTextStyle} ${style.alignItem} ${style.marginLeft10}`}
                          onClick={() => {
                            onClose();
                          }}
                        >
                          SAVE IN PROGRESS
                        </div>
                      </div>
                      <div
                        className={` ${style.gridDot} ${style.buttonCardStyle} ${style.marginTop20} ${style.cursorPointer}`}
                      >
                        <div className={`${style.marginLeft10} ${style.alignItem} ${style.redDotStyle}`} />
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.marginLeft10}`}
                          // onClick={() => {
                          //   setShowApplicationDeclineDialog(true);
                          // }}
                          onClick={() => {
                            setShowApplicationDeclineDialog(true);
                          }}
                        >
                          NOT RECOMMENDED
                        </div>
                      </div>
                      {/* </div> */}
                      <div className={`${style.marginTop20}`}>
                        <div className={` ${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer}`}>
                          <div className={`${style.marginLeft10} ${style.alignItem} ${style.lightGreenDotStyle}`} />
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft10}`}
                            // onClick={onClickApproveFunction}
                            onClick={() => {
                              onClickApprovalFunction();
                            }}
                          >
                            RECOMMENDED WITH COMMENTS
                          </div>
                        </div>
                        <div className={` ${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer} ${style.marginTop20} ${style.marginBottom20}`}>
                          <div className={`${style.marginLeft10} ${style.alignItem} ${style.greenDotStyle}`} />
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter} ${style.marginLeft10}`}
                            onClick={onClickApprovalwithoutnotesFunction}
                          >
                            RECOMMEND
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (" ")}
                  {(workModeType === 'Credentialing Committee' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT" && isApproverCred === "Approve") ? (
                    <div className={`${style.fixedBottom} ${approvalwithoutnotesCommentsBox || approvalnotesCommentsBox || approvalnotesCommentsBoxDept || showApplicationDeclineDialog || notesCommentsBox || reappointmentChangesCommentsBox ? style.hiddenStickyContainer : " "}`}>
                      {/* <div className={`${style.twoColumnGrid}`}> */}
                      <div className={`${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer}`}>
                        <div className={`${style.marginLeft10} ${style.alignItem} ${style.yellowDotStyle}`} />
                        <div
                          className={`${style.buttonTextStyle} ${style.alignItem} ${style.marginLeft10}`}
                          onClick={() => {
                            onClose();
                          }}
                        >
                          SAVE IN PROGRESS
                        </div>
                      </div>
                      <div
                        className={` ${style.gridDot} ${style.buttonCardStyle} ${style.marginTop20} ${style.cursorPointer}`}
                      >
                        <div className={`${style.marginLeft10} ${style.alignItem} ${style.redDotStyle}`} />
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.marginLeft10}`}
                          // onClick={() => {
                          //   setShowApplicationDeclineDialog(true);
                          // }}
                          onClick={() => {
                            setShowApplicationDeclineDialog(true);
                          }}
                        >
                          NOT RECOMMENDED
                        </div>
                      </div>
                      {/* </div> */}
                      <div className={`${style.marginTop20}`}>
                        <div className={` ${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer}`}>
                          <div className={`${style.marginLeft10} ${style.alignItem} ${style.lightGreenDotStyle}`} />
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft10}`}
                            // onClick={onClickApproveFunction}
                            onClick={() => {
                              onClickApprovalFunction();
                            }}
                          >
                            RECOMMENDED WITH COMMENTS
                          </div>
                        </div>
                        <div className={` ${style.gridDot} ${style.buttonCardStyle} ${style.cursorPointer} ${style.marginTop20} ${style.marginBottom20}`}>
                          <div className={`${style.marginLeft10} ${style.alignItem} ${style.greenDotStyle}`} />
                          <div
                            className={`${style.buttonTextStyle} ${style.alignCenter} ${style.marginLeft10}`}
                            onClick={onClickApprovalwithoutnotesFunction}
                          >
                            RECOMMEND
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (" ")}
                  {((workModeType === 'Staff Manager' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT") || (workModeType === 'Department Head' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "NotApproved") || (workModeType === 'Chief Of Staff' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "NotApproved")) ? (<>
                    <div>
                      <div className={`${style.textCardStyle} ${style.pendingTextStyle} ${style.alignCenter} ${style.padding30} ${style.marginBottom20}`}>
                        Pending Dept. Head. Recommendation
                      </div>
                    </div>
                  </>) : ("")}
                  {/* {((workModeType === 'Chief Of Staff' && selectedTab === 'level-2' && applicationType === "REAPPOINTMENT" && isApproverDept === "NotApproved"))  && (<>
                  <div>
                    <div className={`${style.textCardStyle} ${style.pendingTextStyle} ${style.alignCenter} ${style.padding30} ${style.marginBottom20}`}>
                      Pending Dept. Head. Recommendation
                    </div>
                  </div>
                </>)} */}

                  {/* {((workModeType === 'Staff Manager' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") || (workModeType === 'Department Head' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") || (workModeType === 'Chief Of Staff' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT") || (workModeType === 'Credentialing Committee' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT" && isApproverCred === "NotApproved")) ? (<>
                  <div>
                    <div className={`${style.textCardStyle} ${style.pendingTextStyle} ${style.alignCenter} ${style.padding30} ${style.marginBottom20}`}>
                      Pending Cred. Comm. Recommendation
                    </div>
                  </div>
                </>) : ("")} */}

                  {((workModeType === 'Credentialing Committee' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT" && isApproverCred === "NotApproved")) ? (<>
                    <div>
                      <div className={`${style.textCardStyle} ${style.pendingTextStyle} ${style.alignCenter} ${style.padding30} ${style.marginBottom20}`}>
                        Pending Cred. Comm. Recommendation
                      </div>
                    </div>
                  </>) : ("")}

                  {/* {((workModeType === 'Credentialing Committee' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT" && isApproverCred === "Approve" && approvalType === true)) ? (<>
                  <div>
                    <div className={`${style.textCardStyle} ${style.reviewTextStyle} ${style.alignCenter} ${style.padding30} ${style.marginBottom20}`}>
                      You Reviewed this Application
                    </div>
                  </div>
                </>) : ("")} */}

                  {(workModeType === 'Credentialing Committee' && selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") || (workModeType === 'Department Head' && selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") || (workModeType === 'Advisory Committee' && selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") ? (<>
                    <div>
                      <div className={`${style.textCardStyle} ${style.pendingTextStyle} ${style.alignCenter} ${style.padding30} ${style.marginBottom20}`}>
                        Pending MAC Recommendation
                      </div>
                    </div>
                  </>) : (" ")}

                  {(workModeType === 'Credentialing Committee' && selectedTab === 'level-5' && applicationType === "REAPPOINTMENT") || (workModeType === 'Department Head' && selectedTab === 'level-5' && applicationType === "REAPPOINTMENT") || (workModeType === 'Advisory Committee' && selectedTab === 'level-5' && applicationType === "REAPPOINTMENT") || (workModeType === 'Board' && selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") ? (<>
                    <div>
                      <div className={`${style.textCardStyle} ${style.pendingTextStyle} ${style.alignCenter} ${style.padding30} ${style.marginBottom20}`}>
                        Pending BOD Recommendation
                      </div>
                    </div>
                  </>) : (" ")}
                  {((workModeType === 'Staff Manager' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT" && dataLevel === "ReviewFromCC")) ? (
                    <div className={`${style.fixedBottom1} ${emailDialogBox ? style.hiddenStickyContainer : " "} ${style.marginBottom20}`}>
                      <div className={`${style.cardLeftStyle2}`}>
                        <div className={`${style.displayInCol}`}>
                          <div
                            className={`${style.spaceBetween} ${style.marginLeftRight20}`}
                          >
                            <span className={`${style.tableHeaderHeadingTextStyle} ${style.marginTop20}`}>
                              CC Approval Date*
                            </span>
                          </div>
                          <CommonDateField
                            className={style.dateWidth}
                            onChange={(date) => handleDateChange(date, 'ApprovedDate')}
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}

                            // minDate={sub(new Date(), { years: 3 })}
                            // maxDate={add(new Date(), { years: 3 })}
                            minDate={form?.upcomingCredCommitteeMeetingDate ? new Date(form?.upcomingCredCommitteeMeetingDate) : sub(new Date(), { years: 3 })}
                            maxDate={getJune30thOfCurrentYear()}
                            value={selectedDateForReappoint}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: 'Enter CC Approval Date',
                                  readOnly: true
                                }}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </div>
                        <>
                          <div className={`${style.buttonCardStyle2} ${style.cursorPointer} ${style.marginTop10}`}>
                            <div className={`${style.buttonTextStyle} ${style.alignCenter}`}
                              onClick={() => {
                                setShowApplicationDeclineDialog(true);
                              }}>REJECTED BY CRED COMM</div>
                          </div>
                          <div
                            className={`${style.bigButtonStyle2} ${isButtonDisabled ? undefined : style.cursorPointer}`}
                            style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                            onClick={isButtonDisabled ? undefined : () => onClickApprovalwithoutnotesFunction()}
                          >
                            <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop10} ${style.marginBottom10}`}>
                              APPROVED BY CRED COMM
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  ) : (" ")
                  }
                  {((workModeType === 'Staff Manager' && selectedTab === 'level-3' && applicationType === "REAPPOINTMENT" && dataLevel === "DateSetForCC")) ? (
                    <div className={`${style.fixedBottom1} ${emailDialogBox ? style.hiddenStickyContainer : " "} ${style.marginBottom20}`}>
                      <div className={`${style.cardLeftStyleSaveButton}`}>
                        <div className={`${style.displayInCol}`}>
                          <div
                            className={`${style.spaceBetween} ${style.marginLeftRight20}`}
                          >
                            <span className={`${style.tableHeaderHeadingTextStyle} ${style.marginTop20}`}>
                              CC Meeting Date*
                            </span>
                          </div>
                          <CommonDateField
                            className={style.dateWidth}
                            onChange={(date) => handleDateChange(date, 'CC')}
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}

                            // minDate={sub(new Date(), { years: 3 })}
                            // maxDate={add(new Date(), { years: 3 })}
                            minDate={lastSubmittedDate ? new Date(lastSubmittedDate) : sub(new Date(), { years: 3 })}
                            maxDate={getJune30thOfCurrentYear()}
                            value={selectedDateForCC}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: 'Enter CC Meeting Date',
                                  readOnly: true
                                }}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </div>
                        <div
                          className={`${style.bigButtonStyle2} ${isButtonDisabled ? undefined : style.cursorPointer}`}
                          style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                          onClick={isButtonDisabled ? undefined : onClickCCDateSetFunction}
                        >
                          <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop10} ${style.marginBottom10}`}>
                            SAVE
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (" ")
                  }
                  {((workModeType === 'Staff Manager' && selectedTab === 'level-4' && applicationType === "REAPPOINTMENT") || (workModeType === 'Chief Of Staff' && selectedTab === 'level-4' && applicationType === "REAPPOINTMENT")) ? (
                    <div className={`${style.fixedBottom1} ${emailDialogBox ? style.hiddenStickyContainer : " "} ${style.marginBottom20}`}>
                      <div className={`${style.cardLeftStyle2}`}>
                        <div className={`${style.displayInRow}${style.marginTop20}`}>
                          <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20}`}>
                            <span className={`${style.tableHeaderHeadingTextStyle}`}>MAC Meeting Date*</span>
                          </div>
                          <CommonDateField
                            className={style.dateWidth}
                            onChange={(date) => handleDateChange(date, "ApprovedDateMac")}
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}
                            minDate={sub(new Date(), { years: 3 })}
                            // maxDate={add(new Date(), { years: 3 })}                        
                            maxDate={getJune30thOfCurrentYear()}
                            value={selectedDateForMac}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: 'Enter MAC Meeting Date To Continue',
                                  readOnly: true
                                }}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </div>
                        <div>
                          <div className={`${style.buttonCardStyle2} ${style.cursorPointer} ${style.marginTop10}`}>
                            <div className={`${style.buttonTextStyle} ${style.alignCenter}`}
                              onClick={() => {
                                setShowApplicationDeclineDialog(true);
                              }}>NOT RECOMMENDED BY MAC</div>
                          </div>
                          <div
                            className={`${style.bigButtonStyle2} ${isButtonDisabled ? undefined : style.cursorPointer}`}
                            style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                            onClick={isButtonDisabled ? undefined : onClickApprovalwithoutnotesMACFunction}
                          >
                            <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}>
                              RECOMMENDED BY MAC
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (" ")
                  }
                  {((workModeType === 'Staff Manager' && selectedTab === 'level-5' && applicationType === "REAPPOINTMENT") || (workModeType === 'Chief Of Staff' && selectedTab === 'level-5' && applicationType === "REAPPOINTMENT")) ? (
                    <div className={`${style.fixedBottom1} ${emailDialogBox ? style.hiddenStickyContainer : " "} ${style.marginBottom20}`}>
                      <div className={`${style.cardLeftStyle2}`}>
                        <div className={`${style.displayInCol}`}>
                          <div
                            className={`${style.spaceBetween} ${style.marginLeftRight20}`}
                          >
                            <span className={`${style.tableHeaderHeadingTextStyle} ${style.marginTop20}`}>
                              BOD Approval Date*
                            </span>
                          </div>
                          <CommonDateField
                            className={style.dateWidth}
                            onChange={(date) => handleDateChange(date, "ApprovedDateBod")}
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}

                            minDate={sub(new Date(), { years: 3 })}
                            // maxDate={add(new Date(), { years: 3 })}
                            maxDate={getJune30thOfCurrentYear()}
                            value={selectedDateForBod}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...params.inputProps,
                                  placeholder: 'Enter BOD Approval Date To Continue',
                                  readOnly: true
                                }}
                                variant="outlined"
                                margin="normal"
                                fullWidth
                              />
                            )}
                          />
                        </div>
                        <>
                          <div className={`${style.buttonCardStyle2} ${style.cursorPointer} ${style.marginTop10}`}>
                            <div className={`${style.buttonTextStyle} ${style.alignCenter}`}
                              onClick={() => {
                                setShowApplicationDeclineDialog(true);
                              }}>REJECTED BY BOD</div>
                          </div>
                          <div
                            className={`${style.bigButtonStyle2} ${isButtonDisabled ? undefined : style.cursorPointer}`}
                            style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                            onClick={isButtonDisabled ? undefined : getApplicationApproveAndMoveToNext}
                          >
                            <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}>
                              APPROVED BY BOD
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                  ) : (" ")
                  }
                  {(workModeType === 'Chief Of Staff') && (
                    <>
                      {selectedTab === "level-3" && (
                        <>
                          {/* <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                            <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                              <div
                                className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                // onClick={onClickApprovalFunction}
                                onClick={() => {
                                  onClickApprovalFunction();
                                }}
                              >
                                RECOMMENDED WITH COMMENTS
                              </div>
                            </div>
                            <div className={`${style.buttonCardStyle} ${style.cursorPointer}`}>
                              <div
                                className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                onClick={onClickApprovalFunction}
                              >
                                RECOMMEND
                              </div>
                            </div>
                          </div> */}
                          {applicationType === "NEW" && (
                            <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                              <div
                                className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                                onClick={onClickApproveMoveFunction}
                              >
                                OVERRIDE FOR TEMPORARY PRIVILEGES
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {(selectedTab === "level-1" && applicationType === "NEW") && (
                        <>
                          <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                            <div
                              className={`${style.buttonCardStyle} ${isApproved ? style.cursorPointer : ''}`}
                            //  style={{ opacity: isApproved ? 1 : 0.5 }}
                            >
                              <div
                                className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                // onClick={isApproved ? onClickApproveFunction : undefined}
                                onClick={() => {
                                  onClickApprovalFunction();
                                }}
                              >
                                RECOMMENDED WITH COMMENTS
                              </div>
                            </div>
                            <div
                              className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                            // className={`${style.bigButtonStyle} ${isApproved ? style.cursorPointer : ''}`}
                            //  style={{ opacity: isApproved ? 1 : 0.5 }}
                            >
                              <div
                                className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                // onClick={isApproved ? onClickApproveMoveFunction : undefined}
                                onClick={onClickApprovalFunction}
                              >
                                RECOMMEND
                              </div>
                            </div>
                          </div>
                          {applicationType === "NEW" && (
                            <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                              <div
                                className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                              // onClick={onClickApprovalFunction}
                              >
                                OVERRIDE FOR TEMPORARY PRIVILEGES
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {(selectedTab === "level-2") && (
                        <>
                          {/* <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                            <div
                              className={`${style.buttonCardStyle} ${isApproved ? style.cursorPointer : ''}`}
                            //  style={{ opacity: isApproved ? 1 : 0.5 }}
                            >
                              <div
                                className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                                // onClick={isApproved ? onClickApproveFunction : undefined}
                                onClick={() => {
                                  onClickApprovalFunction();
                                }}
                              >
                                RECOMMENDED WITH COMMENTS
                              </div>
                            </div>
                            <div
                              className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                            // className={`${style.bigButtonStyle} ${isApproved ? style.cursorPointer : ''}`}
                            //  style={{ opacity: isApproved ? 1 : 0.5 }}
                            >
                              <div
                                className={`${style.buttonTextStyle} ${style.alignCenter}`}
                                onClick={onClickApprovalFunction}
                              >
                                RECOMMEND
                              </div>
                            </div>
                          </div> */}
                          {applicationType === "NEW" && (
                            <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                              <div
                                className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                              // onClick={onClickApprovalFunction}
                              >
                                OVERRIDE FOR TEMPORARY PRIVILEGES
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* {((userRole?.includes('Credentialing Committee') && selectedTab === 'level-3' && applicationType === "NEW")) && (
                    <div className={`${style.twoColumnGrid} ${style.marginTop20}`}>
                      <div
                        className={`${style.buttonCardStyle} ${isApproved ? style.cursorPointer : ''}`}
                      //  style={{ opacity: isApproved ? 1 : 0.5 }}
                      >
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter} ${style.cursorPointer}`}
                          // onClick={isApproved ? onClickApproveFunction : undefined}
                          onClick={() => {
                            onClickApprovalFunction();
                          }}
                        >
                          RECOMMENDED WITH COMMENTS
                        </div>
                      </div>
                      <div
                        className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                      // className={`${style.bigButtonStyle} ${isApproved ? style.cursorPointer : ''}`}
                      //  style={{ opacity: isApproved ? 1 : 0.5 }}
                      >
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          onClick={onClickApprovalFunction}
                        >
                          RECOMMEND
                        </div>
                      </div>
                    </div>
                  )} */}
                  {applicationType === "NEW" ? (
                    ((workModeType === 'Credentialing Committee' && selectedTab === 'level-3') ||
                      (workModeType === 'Chief Of Staff' && selectedTab === "level-3") ||
                      (workModeType === 'Staff Manager' && selectedTab === "level-3") ||
                      (workModeType === 'Department Head' && selectedTab === "level-3")) ? (
                      <div className={`${style.statusCard} ${style.marginTop20} ${style.marginBottom20}`}>
                        <div className={`${style.statusCardTextStyle1} ${style.marginTop20}`}>
                          Review and Approval Status
                        </div>
                        <div className={`${style.spaceEvenly} ${style.marginTop20}`}>
                          <div className={style.displayInCol}>
                            <div className={style.statusStartTextStyle}>
                              Not Started Yet
                            </div>
                            <div className={style.statusRoleTextStyle}>
                              CHIEF OF STAFF / DEPUTY
                            </div>
                          </div>
                          <div className={style.displayInCol}>
                            <div className={style.statusStartTextStyle}>
                              Not Started Yet
                            </div>
                            <div className={style.statusRoleTextStyle}>
                              CREDENTIALING COMMITTEE
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null
                  ) : null}

                  {/* {((userRole?.includes('Credentialing Committee')&& selectedTab === 'level-3') || (userRole?.includes('Chief Of Staff') && selectedTab === "level-3") || (userRole?.includes('Staff Manager') && selectedTab === "level-3") || (userRole?.includes('Department Head') && selectedTab === "level-3")) ? (
                      <div className={`${style.statusCard} ${style.marginTop20} ${style.marginBottom20}`}>
                      <div className={`${style.statusCardTextStyle1} ${style.marginTop20}`}>Review and Approval Status</div>
                      <div className={`${style.spaceEvenly} ${style.marginTop20}`}>
                      <div className={`${style.displayInCol}`}>
                        <div className={`${style.statusStartTextStyle}`}>Not Started Yet</div>
                        <div className={`${style.statusRoleTextStyle}`}>CHIEF OF STAFF / DEPUTY</div>
                      </div>
                      <div className={`${style.displayInCol}`}>
                        <div className={`${style.statusStartTextStyle}`}>Not Started Yet</div>
                        <div className={`${style.statusRoleTextStyle}`}>CREDENTIALING COMMITTEE</div>
                      </div>
                      </div>
                    </div>
                    ) : null } */}
                  {/* <div
                  className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                  onClick={handleApplicationAccept}
                >
                  ACCEPT APPLICATION
                </div> */}

                  {/* </div> */}
                  <>
                    {selectedTab !== "level-4" && selectedTab !== "level-5" && applicationType === "NEW" && (
                      <>
                        <div className={style.cardLeftStyle}>
                          <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div
                              className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                            >
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                <span className={`${style.tableHeaderHeadingTextStyle}`}>
                                  Notes
                                </span>
                                <div
                                  className={`${style.marginTop5} ${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                >
                                  <img
                                    src={EditBlue}
                                    alt="EditBlue"
                                    className={style.colorFileStyle}
                                  />
                                </div>
                              </div>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                <div
                                  className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                >
                                  <AddIcon
                                    sx={{
                                      fontSize: 20,
                                      color: "#94979A",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
                          <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div
                              className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                            >
                              <span className={`${style.tableHeaderHeadingTextStyle}`}>
                                RFCs & Doc Clarification
                              </span>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                <div
                                  className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section1")}
                                >
                                  {expandStates.section1 ? (
                                    <RemoveIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#94979A",
                                        cursor: "pointer",
                                      }}
                                    />
                                  ) : (
                                    <AddIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#94979A",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {expandStates.section1 && (
                              <>
                                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                                  <div>Proof of Qualifications</div>
                                  <RemoveIcon
                                    sx={{
                                      fontSize: 20,
                                      color: "#94979A",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>
                                <div className={`${style.marginBottom20} ${style.clarificationCardStyle}`}>
                                  <div className={`${style.gridGap3}`}>
                                    <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                                    <div className={`${style.sideHeadingFontStyle}`}>Queen's University Clarification Title To Address</div>
                                    <AddIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#94979A",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          <div className={style.marginBottom20}></div>
                        </div>
                        {applicationType === "NEW" && (
                          <>
                            <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
                              <div className={`${style.displayInRow}${style.marginTop20}`}>
                                <div
                                  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                                >
                                  <span className={`${style.tableHeaderHeadingTextStyle}`}>
                                    Reference Feedback Status
                                  </span>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                  >
                                    <div
                                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section2")}
                                    >
                                      {expandStates.section2 ? (
                                        <RemoveIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                        />
                                      ) : (
                                        <AddIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {expandStates.section2 && (
                                  <>
                                    {form?.references?.privilegeReference?.map((reference, index) => (
                                      <div className={`${style.marginBottom20} ${style.referenceCardStyle}`}>
                                        <div className={`${style.gridGap}`}>
                                          <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                                          <div>
                                            <div className={`${style.displayInRow} ${style.spaceBetweenOnly}`}>
                                              <div>
                                                <div className={`${style.sideHeadingFontStyle}`}>{`${reference?.firstName} ${reference?.lastName} - Special Privilege`}</div>
                                                <div className={`${style.sideHeadingRefFrontStyle}`}>Reference Questionnaire Sent On Oct 11, 2024</div>
                                              </div>
                                              <div className={`${style.viewTextStyle} ${style.viewButton} ${style.alignItem} ${style.cursorPointer}`} onClick={onClickEmailDialogFunction}>Send</div>
                                            </div>
                                            <CommonDivider />
                                          </div>
                                        </div>
                                        <div className={`${style.gridGap1}`}>
                                          <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                                          <div className={`${style.sideHeadingFontStyle}`}>Marked As Favourable By Dept. Head On Oct 12, 2024</div>
                                          <div className={`${style.viewTextStyle} ${style.viewButton}`}>Review</div>
                                        </div>
                                      </div>
                                    ))}

                                    {form?.references?.reference?.map((reference, index) => (
                                      <div className={`${style.marginBottom20} ${style.referenceCardStyle}`}>
                                        <div className={`${style.gridGap}`}>
                                          <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                                          <div>
                                            <div className={`${style.displayInRow} ${style.spaceBetweenOnly}`}>
                                              <div>
                                                <div className={`${style.sideHeadingFontStyle}`}>{`${reference?.firstName} ${reference?.lastName}`}</div>
                                                <div className={`${style.sideHeadingRefFrontStyle}`}>Reference Questionnaire Sent On Oct 11, 2024</div>
                                              </div>
                                              <div className={`${style.viewTextStyle} ${style.viewButton} ${style.alignItem} ${style.cursorPointer}`} onClick={onClickEmailDialogFunction}>Send</div>
                                            </div>
                                            <CommonDivider />
                                          </div>
                                        </div>
                                        <div className={`${style.gridGap1}`}>
                                          <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                                          <div className={`${style.sideHeadingFontStyle}`}>Marked As Favourable By Dept. Head On Oct 12, 2024</div>
                                          <div className={`${style.viewTextStyle} ${style.viewButton}`}>Review</div>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                              <div className={style.marginBottom20}></div>
                            </div>
                            <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
                              <div className={`${style.displayInRow}${style.marginTop20}`}>
                                <div
                                  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                                >
                                  <span className={`${style.tableHeaderHeadingTextStyle}`}>
                                    Immunization History Review
                                  </span>
                                  <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                  >
                                    <div
                                      className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section3")}
                                    >
                                      {expandStates.section3 ? (
                                        <RemoveIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                        />
                                      ) : (
                                        <AddIcon
                                          sx={{
                                            fontSize: 20,
                                            color: "#94979A",
                                            cursor: "pointer",
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {expandStates.section3 && (
                                  <>
                                    <div className={`${style.marginBottom20} ${style.referenceCardStyle}`}>

                                      <div className={`${style.gridGap}`}>
                                        <div className={`${style.greenDotStyle} ${style.buttonCenter}`}></div>
                                        <div>
                                          <div className={`${style.sideHeadingFontStyle}`}>Immunization History</div>
                                          <div className={`${style.sideHeadingRefFrontStyle}`}>Approved By Safety & Wellness On Oct 11, 2024</div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className={style.marginBottom20}></div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {applicationType === "REAPPOINTMENT" ? (
                      <>
                        {selectedTab === "level-4" || selectedTab === "level-5" ? (
                          <div className={`${style.cardLeftStyle} ${style.marginBottom20}`}>
                            <div className={`${style.displayInRow}${style.marginTop20}`}>
                              <div
                                className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                              >
                                <span className={`${style.tableHeaderHeadingTextStyle1}`}>
                                  Verification & Review History
                                </span>
                                <div
                                  className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                >
                                  <div
                                    className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section4")}
                                  >
                                    {expandStates.section4 ? (
                                      <RemoveIcon
                                        sx={{
                                          fontSize: 20,
                                          color: "#94979A",
                                          cursor: "pointer",
                                        }}
                                      />
                                    ) : (
                                      <AddIcon
                                        sx={{
                                          fontSize: 20,
                                          color: "#94979A",
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                              {expandStates.section4 && (
                                <>
                                  {/* <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationTextStyle} ${style.marginTop10}`}>
                                VERIFICATION
                              </div> */}
                                  {logDetails?.logs
                                    ?.filter((log) =>
                                      log?.workflowStatus !== "SUBMITTED"
                                      && !(log?.approvalType === null || log?.approvalType === "")
                                    ).reverse()
                                    .map((log, index) => (
                                      <div key={index}>
                                        <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationTextStyle} ${style.marginTop10}`}>
                                          {log?.title}
                                        </div>
                                        <div
                                          className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${log?.approvalType === 'RECOMMENDED_WITH_NOTES' ? style.verificationMethodTextStyle1 : style.verificationMethodTextStyle
                                            }`}
                                        >
                                          {log?.approvalType ? log.approvalType.replace(/_/g, ' ') : "-"}
                                        </div>
                                        {log?.approvalType === "RECOMMENDED_WITH_NOTES" && log?.notes && (
                                          <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationRoleTextStyle}`}>
                                            <div dangerouslySetInnerHTML={{ __html: log.notes }} />
                                          </div>
                                        )}
                                        <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationRoleTextStyle}`}>
                                          {log?.workflowUser?.name?.firstName}{log?.workflowUser?.name?.lastName}, {log?.role} on {log?.createdDate ? format(new Date(log.createdDate), "MMM dd, yyyy, H.mm") : ""}
                                        </div>
                                      </div>
                                    ))}
                                </>
                              )}
                            </div>
                            <div className={style.marginBottom20}></div>
                          </div>
                        ) : (" ")}
                        <div className={`${style.cardLeftStyle}`}>
                          <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div
                              className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                            >
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                <span className={`${style.tableHeaderHeadingTextStyle1}`}>
                                  Notes
                                </span>
                                <div
                                  className={`${style.marginTop5} ${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                >
                                  <Tooltip title="Create a note" arrow>
                                    <CreateOutlinedIcon
                                      className={`${style.notesIcon} ${style.cursorPointer}`}
                                      onClick={onClickNotesFunction}
                                    />
                                  </Tooltip>
                                </div>
                              </div>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                <div
                                  className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section5")}
                                >
                                  {expandStates.section5 ? (
                                    <RemoveIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#94979A",
                                        cursor: "pointer",
                                      }}
                                    />
                                  ) : (
                                    <AddIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#94979A",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {expandStates.section5 && (
                              // <>
                              //   {logDetails?.logs
                              //     ?.filter((log) => log.workflowStatus !== "SUBMITTED" && log?.approvalType === null && log?.approvalType === "")
                              //     .map((log, index) => (
                              //       <div key={index}>
                              //         <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationTextStyle} ${style.marginTop10}`}>
                              //           Staff Manager Comments / Notes
                              //         </div>
                              //         <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationRoleTextStyle}`}>{log?.workflowUser?.name?.firstName}{log?.workflowUser?.name?.lastName}, {log?.role} on {approvalFromDate[index]} </div>
                              //         {/* <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.notesTextStyle}`}>
                              //     Specify the clarification that is needed tur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
                              //     </div> */}
                              //         <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.notesTextStyle}`}>
                              //           {log.notes || "-"}
                              //         </div>
                              //       </div>
                              //     ))}

                              // </>
                              <>
                                {form?.notesDetails
                                  ?.filter(log => {
                                    if (!log?.notes?.notes) return false;
                                    if (log?.private && log?.user?.id !== users?.id) return false;
                                    return true;
                                  })
                                  .reverse()
                                  .map((log, index) => (
                                    <div key={index}>
                                      <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationTextStyle} ${style.marginTop10}`}>
                                        {log?.private && <span className={style.privateBorderText}>Private</span>}{" "}{log?.title}
                                      </div>
                                      <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.verificationRoleTextStyle}`}>
                                        {log?.user?.name?.firstName}{log?.user?.name?.lastName}, on {format(new Date(log?.createdDate), 'MMM d, yyyy, H.mm')}
                                      </div>
                                      <div className={`${style.gridNotes3}`}>
                                        <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingBottom5} ${style.notesTextStyle} ${style.marginBottom0}`}>
                                          <div dangerouslySetInnerHTML={{ __html: log.notes.notes }} />
                                        </div>
                                        {log?.user?.id === users?.id && (
                                          <div>
                                            <Tooltip title="Edit a note" arrow>
                                              <EditOutlinedIcon
                                                sx={{ fontSize: 20 }}
                                                className={`${style.notesIcon} ${style.cursorPointer}`}
                                                onClick={() => onClickNotesEditFunction(log?.id, log?.notes?.notes, log?.private, log?.files)}
                                              />
                                            </Tooltip>
                                          </div>
                                        )}
                                        {log?.user?.id === users?.id && (
                                          <div>
                                            <Tooltip title="Delete a note" arrow>
                                              <DeleteOutlineIcon
                                                sx={{ fontSize: 20 }}
                                                className={`${style.notesIconDelete} ${style.cursorPointer}`}
                                                onClick={() => handleDeleteNote(log?.id)}
                                              />
                                            </Tooltip>
                                          </div>
                                        )}
                                      </div>

                                      {/* Check if there are files */}
                                      {log?.files && log?.files?.length > 0 && (
                                        <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingTop5}`}>
                                          {log?.files?.map((file, fileIndex) => {
                                            return (
                                              <div key={fileIndex}>
                                                <div className={`${style.threeColGrid} ${style.backgroundColorStyle} ${style.marginBottom10}`}>
                                                  {/* Display Material UI PDF icon and link */}
                                                  <div
                                                    className={style.cursorPointer}
                                                    onClick={() => {
                                                      setShowFileDisplayDialog(true);
                                                      setselectedFile(file);
                                                    }}
                                                  >
                                                    <PictureAsPdfIcon
                                                      className={style.docsIcon}
                                                      style={{ marginRight: '8px' }}
                                                    />
                                                  </div>
                                                  <div
                                                    className={`${style.cursorPointer} ${style.notesTitle}`}
                                                    onClick={() => {
                                                      setShowFileDisplayDialog(true);
                                                      setselectedFile(file);
                                                    }}
                                                  >
                                                    {file?.fileName}
                                                  </div>
                                                  <div>
                                                    <DescriptionOutlinedIcon
                                                      style={{ marginRight: '8px' }}
                                                    />
                                                  </div>
                                                </div>
                                                {file?.title && (
                                                  <div
                                                    className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingTop5} ${style.marginBottom10}`}
                                                  >
                                                    <div>{file?.title}</div>
                                                  </div>
                                                )}
                                                {/* Optional description */}
                                                {file?.description && (
                                                  <div
                                                    className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingTop5} ${style.marginBottom20}`}
                                                  >
                                                    <div>{file?.description}</div>
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </>
                            )}
                          </div>
                          <div className={style.marginBottom20}></div>
                        </div>
                        {/* <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
                          <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div
                              className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                            >
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                <span className={`${style.tableHeaderHeadingTextStyle1}`}>
                                  Notes
                                </span>
                                <div
                                  className={`${style.marginTop5} ${style.marginLeft10} ${style.tableDataFontStyle1}`}
                                >
                                </div>
                              </div>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                 <div
                              className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section5")}
                            >
                              {expandStates.section5 ? (
                                <RemoveIcon
                                  sx={{
                                    fontSize: 20,
                                    color: "#94979A",
                                    cursor: "pointer",
                                  }}
                                />
                              ) : (
                                <AddIcon
                                  sx={{
                                    fontSize: 20,
                                    color: "#94979A",
                                    cursor: "pointer",
                                  }}
                                />
                              )}
                            </div>
                              </div>
                            </div>
                          </div>
                        </div> */}
                        <div className={`${style.cardLeftStyle} ${style.marginTop20}`}>
                          <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div
                              className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                            >
                              <span className={`${style.tableHeaderHeadingTextStyle1}`}>
                                RFCs & Doc Clarification
                              </span>
                              <div
                                className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                              >
                                <div
                                  className={`${style.marginLeft10} ${style.tableDataFontStyle1}`} onClick={() => toggleExpand("section1")}
                                >
                                  {expandStates.section1 ? (
                                    <RemoveIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#94979A",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => setExpandStates((prev) => ({ ...prev, section6: false }))}
                                    />
                                  ) : (
                                    <AddIcon
                                      sx={{
                                        fontSize: 20,
                                        color: "#94979A",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            {expandStates.section1 && (
                              <>
                                {form?.forms
                                  ?.filter((data) => data?.clarifications?.length > 0)
                                  .map((data) => {
                                    const isExpanded = expandStates[`section6_${data.id}`] || false;

                                    return (
                                      <div key={data.id} className={`${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}>
                                        <div className={`${style.spaceBetween}`}>
                                          <div className={`${style.headingRFCtextStyle}`}>{data?.title}</div>
                                          {isExpanded ? (
                                            <RemoveIcon
                                              sx={{ fontSize: 20, color: "#94979A", cursor: "pointer" }}
                                              onClick={() =>
                                                setExpandStates((prev) => ({ ...prev, [`section6_${data.id}`]: false }))
                                              }
                                            />
                                          ) : (
                                            <AddIcon
                                              sx={{ fontSize: 20, color: "#94979A", cursor: "pointer" }}
                                              onClick={() =>
                                                setExpandStates((prev) => ({ ...prev, [`section6_${data.id}`]: true }))
                                              }
                                            />
                                          )}
                                        </div>

                                        {/* Show clarifications when expanded */}
                                        {isExpanded &&
                                          data?.clarifications?.map((clarification, index) => {
                                            const isExpandedData = expandStates[`section7_${data.id}_${index}`] || false;
                                            return (
                                              <div key={`${data.id}-${index}`} className={`${style.marginBottom10} ${style.marginTop10} ${style.clarificationCardStyle}`}>
                                                <div className={`${style.gridGap3}`}>
                                                  <Tooltip title={clarification?.clarificationStatus === "RESPONDED" ? "Clarification Responded" : clarification?.clarificationStatus === "ACCEPTED" ? "Clarification Resolved" : clarification?.clarificationStatus === "REJECTED" ? "Clarification Unresolved" : "Clarification Not Initiated"} arrow>
                                                    <div className={`${style.buttonCenter} ${clarification?.clarificationStatus === "RESPONDED" ? style.yellowDotStyle : clarification?.clarificationStatus === "REJECTED" ? style.redDotStyle : clarification?.clarificationStatus === "ACCEPTED" ? style.greenDotStyle : style.greyDotStyle}`}></div>
                                                  </Tooltip>
                                                  <div className={`${style.sideHeadingFontStyle}`}>
                                                    {clarification?.clarificationRequest?.clarificationTitle}
                                                  </div>
                                                  {isExpandedData ? (
                                                    <RemoveIcon
                                                      sx={{ fontSize: 20, color: "#94979A", cursor: "pointer" }}
                                                      onClick={() =>
                                                        setExpandStates((prev) => ({ ...prev, [`section7_${data.id}_${index}`]: false }))
                                                      }
                                                    />
                                                  ) : (
                                                    <AddIcon
                                                      sx={{ fontSize: 20, color: "#94979A", cursor: "pointer" }}
                                                      onClick={() =>
                                                        setExpandStates((prev) => ({ ...prev, [`section7_${data.id}_${index}`]: true }))
                                                      }
                                                    />
                                                  )}
                                                </div>

                                                {isExpandedData && (
                                                  <div>
                                                    <div className={`${style.rfcSubHeadingTextStyle} ${style.marginTop10}`}>
                                                      Clarification requested from {clarification?.clarificationRequest?.clarificationRequiredFrom.toLowerCase()}
                                                    </div>
                                                    <div className={`${style.marginTop10} ${style.rfcResponseTextStyle}`}>
                                                      <div dangerouslySetInnerHTML={{ __html: clarification?.clarificationRequest?.clarificationDescription }} />
                                                    </div>
                                                    <div className={`${style.rfcDateTextStyle} ${style.marginTop5}`}>
                                                      {clarification?.clarificationRequest?.createdDate
                                                        ? `Created on ${format(new Date(clarification?.clarificationRequest?.createdDate), 'MMM d, yyyy, HH.mm')}`
                                                        : 'N/A'}
                                                    </div>
                                                    {clarification?.clarificationStatus === 'NA' && (
                                                      // <div className={style.twoColumnGrid}>
                                                      <div>
                                                        <div
                                                          className={`${style.buttonCardStyleDoc} ${style.cursorPointer}`}
                                                          onClick={() => onClickDocumentClarificationFunction(clarification, data)}
                                                        >
                                                          <div className={`${style.buttonTextStyleDocs} ${style.alignCenter}`}>
                                                            Document Clarification
                                                          </div>
                                                        </div>
                                                        {/* <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                                                          <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>
                                                            Send by Email
                                                          </div>
                                                        </div> */}
                                                      </div>
                                                    )}
                                                    {clarification?.clarificationStatus !== "NA" && (
                                                      <div>
                                                        <div className={`${style.rfcSubHeadingTextStyle} ${style.marginTop10}`}>
                                                          Response from {clarification?.clarificationResponse?.title}
                                                        </div>
                                                        <div className={`${style.marginTop10} ${style.rfcResponseTextStyle}`}>
                                                          <div dangerouslySetInnerHTML={{ __html: clarification?.clarificationResponse?.clarificationDescription }} />
                                                        </div>
                                                        {clarification?.clarificationResponse?.attachedDocuments && clarification?.clarificationResponse?.attachedDocuments?.length > 0 && (
                                                          <div className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingTop5}`}>
                                                            {clarification?.clarificationResponse?.attachedDocuments?.map((file, fileIndex) => {
                                                              return (
                                                                <div key={fileIndex}>
                                                                  <div className={`${style.threeColGrid} ${style.backgroundColorStyle} ${style.marginBottom10}`}>
                                                                    <div
                                                                      className={style.cursorPointer}
                                                                      onClick={() => {
                                                                        setShowFileDisplayDialog(true);
                                                                        setselectedFile(file);
                                                                      }}
                                                                    >
                                                                      <PictureAsPdfIcon
                                                                        className={style.docsIcon}
                                                                        style={{ marginRight: '8px' }}
                                                                      />
                                                                    </div>
                                                                    <div
                                                                      className={`${style.cursorPointer} ${style.notesTitle}`}
                                                                      onClick={() => {
                                                                        setShowFileDisplayDialog(true);
                                                                        setselectedFile(file);
                                                                      }}
                                                                    >
                                                                      {file?.fileName}
                                                                    </div>
                                                                    <div>
                                                                      <img src={Verified} className={style.verifyImage} alt="img" />
                                                                    </div>
                                                                  </div>
                                                                  {/* {file?.title && (
                                                      <div
                                                        className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingTop5} ${style.marginBottom10}`}
                                                      >
                                                        <div>{file?.title}</div>
                                                      </div>
                                                    )} */}
                                                                  {/* Optional description */}
                                                                  {/* {file?.description && (
                                                      <div
                                                        className={`${style.marginLeftRight20} ${style.alignStart} ${style.paddingTop5} ${style.marginBottom20}`}
                                                      >
                                                        <div>{file?.description}</div>
                                                      </div>
                                                    )} */}
                                                                </div>
                                                              );
                                                            })}
                                                          </div>
                                                        )}
                                                        <div className={`${style.rfcDateTextStyle} ${style.marginTop5}`}>
                                                          {clarification?.clarificationResponse?.createdDate
                                                            ? `Created on ${format(new Date(clarification?.clarificationResponse?.createdDate), 'MMM d, yyyy, HH.mm')}`
                                                            : 'N/A'}
                                                        </div>
                                                        {clarification?.clarificationStatus === "RESPONDED" && (
                                                          <div>
                                                            <div className={`${style.twoColumnGrid}`}>
                                                              <div
                                                                className={`${style.buttonCardStyle} ${style.cursorPointer}`}
                                                                onClick={() => onClickResolveDialogFunction("unresolve", clarification, data)}
                                                              >
                                                                <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>Un-Resolved</div>
                                                              </div>
                                                              <div
                                                                className={`${style.bigButtonStyle1} ${style.cursorPointer}`}
                                                                onClick={() => onClickResolveDialogFunction("resolve", clarification, data)}
                                                              >
                                                                <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>Resolve</div>
                                                              </div>
                                                            </div>

                                                            {/* <div
                                                              className={`${style.bigButtonStyle1} ${style.cursorPointer} ${style.marginTop10}`}
                                                              onClick={onClickRequestOverrideDialogFunction}
                                                            >
                                                              <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>Request Override</div>
                                                            </div> */}
                                                          </div>
                                                        )}
                                                        {(clarification?.clarificationStatus === "REJECTED" || clarification?.clarificationStatus === "ACCEPTED") && (
                                                          <div>
                                                            <div className={`${style.rfcSubHeadingTextStyle} ${style.marginTop10}`}>
                                                              {clarification?.clarificationStatus === "REJECTED"
                                                                ? `Clarification Marked As Unresolved by ${clarification?.workflowUser?.name?.firstName}`
                                                                : `Clarification Required resolved by ${clarification?.workflowUser?.name?.firstName}`}
                                                            </div>
                                                            <div className={`${style.marginTop10} ${style.rfcResponseTextStyle}`}>
                                                              <div dangerouslySetInnerHTML={{ __html: clarification?.notes?.notes }} />
                                                            </div>
                                                            <div className={`${style.rfcDateTextStyle} ${style.marginTop5}`}>
                                                              {clarification?.workflowActionDate
                                                                ? clarification?.clarificationStatus === "REJECTED"
                                                                  ? `Unresolved on ${format(new Date(clarification?.workflowActionDate), 'dd/MM/yyyy, HH:mm')}`
                                                                  : `Resolved on ${format(new Date(clarification?.workflowActionDate), 'dd/MM/yyyy, HH:mm')}`
                                                                : 'Date not available'}
                                                            </div>
                                                          </div>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                      </div>
                                    );
                                  })}
                              </>
                            )}
                          </div>

                          <div className={style.marginBottom20}></div>
                        </div>
                      </>
                    ) : (" ")}

                  </>
                </>
              ) : null
              }
              {selectedTab === 'level-4' && applicationType === "NEW" ? (
                <>
                  <div className={`${style.cardLeftStyle2}`}>
                    <div className={`${style.displayInRow}${style.marginTop20}`}>
                      <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20}`}>
                        <span className={`${style.tableHeaderHeadingTextStyle}`}>MAC Meeting Date*</span>
                      </div>
                      <CommonDateField
                        className={style.dateWidth}
                        onChange={(date) => handleDateChange(date, 'MAC')}
                        open={calendarStart}
                        onOpen={() => setCalendarStart(true)}
                        onClose={() => setCalendarStart(false)}
                        minDate={sub(new Date(), { years: 3 })}
                        maxDate={add(new Date(), { years: 3 })}
                        value={selectedDateForMac}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              placeholder: 'Start Date',
                            }}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                    <div className={style.marginBottom20}></div>
                    <>
                      <div className={`${style.buttonCardStyle2} ${style.cursorPointer}`}>
                        <div className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          onClick={() => { onClose(); }}>REJECT</div>
                      </div>
                      <div
                        className={`${style.bigButtonStyle2} ${style.cursorPointer}`}
                        style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                        onClick={isButtonDisabled ? undefined : onClickApproveMoveFunction}
                      >
                        <div className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}>
                          MAC APPROVED
                        </div>
                      </div>
                    </>
                    {(workModeType === 'Chief Of Staff') && (
                      <>
                        {applicationType === "NEW" && (
                          <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                            <div
                              className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                            // onClick={onClickApprovalFunction}
                            >
                              OVERRIDE FOR TEMPORARY PRIVILEGES
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (selectedTab === 'level-5' && applicationType === "NEW") ? (
                <>
                  <div className={`${style.cardLeftStyle2}`}>
                    <div className={`${style.displayInCol}`}>
                      <div
                        className={`${style.spaceBetween} ${style.marginLeftRight20}`}
                      >
                        <span className={`${style.tableHeaderHeadingTextStyle} ${style.marginTop10}`}>
                          BOD Approval Date
                        </span>
                      </div>
                      <CommonDateField
                        className={style.dateWidth}
                        onChange={(date) => handleDateChange(date, 'BOD')}
                        open={calendarStart}
                        onOpen={() => setCalendarStart(true)}
                        onClose={() => setCalendarStart(false)}

                        minDate={sub(new Date(), { years: 3 })}
                        maxDate={add(new Date(), { years: 3 })}
                        value={selectedDateForBod}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              placeholder: 'Start Date',
                            }}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                    <div className={style.marginBottom20}></div>
                    <div className={`${style.displayInRow}${style.marginTop20}`}>
                      <div
                        className={`${style.spaceBetween} ${style.marginLeftRight20}`}
                      >
                        <span className={`${style.tableHeaderHeadingTextStyle}`}>
                          Reappointment Credentialing Application Creation Date
                        </span>
                      </div>
                      <CommonDateField
                        className={style.dateWidth}
                        onChange={(date) => handleDateChange(date, 'Reappoint')}
                        open={calendarStart}
                        onOpen={() => setCalendarStart(true)}
                        onClose={() => setCalendarStart(false)}

                        minDate={sub(new Date(), { years: 3 })}
                        maxDate={add(new Date(), { years: 3 })}
                        value={selectedDateForReappoint}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              placeholder: 'Start Date',
                            }}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                    <div
                      className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                    >
                      <span className={`${style.tableHeaderHeadingTextStyle}`}>
                        Upload Privilege request Approval from BOD
                      </span>
                    </div>
                    <div className={`${style.twoColFile} ${style.marginTop} ${style.cursorPointer}`}>

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
                                  <p className={style.uploadTextStyle}>
                                    Upload Your Documents
                                  </p>
                                  <p className={style.uploadDescriptionText}>
                                    Upload your files or drag & drop from your file cabinet (Computer / Online Drive)
                                  </p>
                                </div>
                              </div>
                            </section>
                          )}
                        </Dropzone>


                        <Dropzone
                          style={dropzoneStyle}
                          onDrop={(acceptedFiles) => changeHandler(acceptedFiles)}
                          accept="image/*"
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className={style.uploadBorderStyle}>
                                  <p className={style.uploadTextStyle}>
                                    Upload A Photo
                                  </p>
                                  <p className={style.uploadDescriptionText}>
                                    Click a picture of the document with your camera and Upload or Upload from your photo gallery.
                                  </p>
                                </div>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </>

                    </div>
                    <div className={`${style.displayInRow} ${style.referenceCardStyle} ${style.alignItem}  ${style.marginTop10}`}>
                      <DescriptionIcon className={`${style.docsIcon}`} />
                      {files.length > 0 ? (
                        files.map((file, index) => (
                          <div key={index} className={`${style.marginLeft20}`}>{file.name}</div>
                        ))
                      ) : (
                        <div className={`${style.marginLeft20}`}>No documents uploaded</div>
                      )}
                    </div>
                    <>
                      {taskCount > 0 ? (
                        <>
                          <div className={`${style.displayInRow} ${style.alignContent} ${style.marginTop10}`}>
                            <WarningIcon className={style.warning} />
                            <div className={`${style.marginLeft20} ${style.alignItem}`}>ChecklistList Item Pending Completion <span className={style.checkListitem}> {taskCount} items </span></div>
                          </div>

                        </>
                      ) : (
                        <>
                          <div className={`${style.displayInRow} ${style.alignContent} ${style.marginTop10}`}>
                            <TaskAltIcon className={style.correcticon} />
                            <div className={`${style.marginLeft20} ${style.alignItem}`}>All checklist items are completed</div>
                          </div>
                        </>
                      )}
                      <div
                        className={`${style.bigButtonStyle2} ${style.cursorPointer}`}
                      >
                        <div
                          className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20} ${style.paddingButton}`}
                          onClick={onClickCheckListFunction}
                        >
                          SAVE & VIEW CHECKLIST
                        </div>
                        <div className={`${style.marginTop20} ${style.marginBottom20}`}></div>
                      </div>
                      <div
                        className={`${style.buttonCardStyle2} ${style.cursorPointer} ${style.marginTop20} ${style.paddingButton}`}
                      >
                        <div
                          className={`${style.buttonTextStyle} ${style.alignCenter}`}
                          onClick={() => { onClose(); }}>
                          REJECT
                        </div>
                      </div>
                      <div
                      >
                        {/* <div
                                        className={`${allTasksCompleted  ? style.bigButtonGreyStyle2 : style.bigButtonStyle2} ${style.cursorPointer}`}
                                      > */}
                        <div
                          className={` ${style.bigButtonStyle2} ${style.cursorPointer}`}
                          style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                          onClick={isButtonDisabled ? undefined : onClickApproveMoveFunction}
                        >
                          <div
                            className={`${style.bigButtonTextStyle} ${style.alignCenter} ${style.marginTop20} ${style.marginBottom20}`}
                          //  onClick={allTasksCompleted ? handleApplicationAccept : null}
                          // onClick={onClickApproveMoveFunction}
                          // style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
                          // onClick={isButtonDisabled ? undefined : onClickApproveMoveFunction}
                          >
                            BOD APPROVED
                          </div>
                        </div>
                        <div className={style.marginBottom20}></div>
                      </div>
                    </>
                    {(workModeType === 'Chief Of Staff') && (
                      <>
                        {applicationType === "NEW" && (
                          <div className={`${style.bigButtonStyle1} ${style.cursorPointer}`}>
                            <div
                              className={`${style.bigButtonTextStyle} ${style.alignCenter}`}
                            // onClick={onClickApprovalFunction}
                            >
                              OVERRIDE FOR TEMPORARY PRIVILEGES
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) :
                ""
              }
            </div>
          </div >
          <div className={style.marginTop50}></div>
          {
            showApplicationDeclineDialog && (
              <ApplicationDecline
                getApplicationDeclineDialog={getApplicationDeclineDialog}
                getActiveApplicationView={getActiveApplicationView}
                selectedTab={selectedTab}
              />
            )
          }
          {
            showDocVerifyDialog && (
              <Dialog
                isOpen={showDocVerifyDialog}
                onClose={() => setShowDocVerifyDialog(false)}
                className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
              >
                <div>
                  <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                      <div
                        className={style.heading}
                      >{`${form?.basicDetails?.applicant?.name?.firstName} ${form?.basicDetails?.applicant?.name?.lastName} ${file?.fileName} Preview`}</div>
                      <div className={style.displayInRow}>
                        {file?.isVerified !== undefined && file?.isVerified ? (
                          <div
                            className={`${style.greenButton} ${style.cursorPointer} `}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                            >
                              Verified
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`${style.purpleButton} ${style.cursorPointer}`}
                          >
                            <div
                              className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}
                              onClick={() => {
                                handleDocVerify(selectedRow?.rowId);
                                setShowDocVerifyDialog(false);
                              }}
                            >
                              Verify
                            </div>
                          </div>
                        )}
                        <img
                          src={CrossPink}
                          alt="cross"
                          className={`${style.crossStyleImg} ${style.cursorPointer} ${style.marginLeft20} `}
                          onClick={() => {
                            setShowDocVerifyDialog(false);
                          }}
                        />
                      </div>
                    </div>
                    <div className={style.marginTop20}>
                      <iframe
                        src={file?.fileURL}
                        width="100%"
                        height="600px"
                      ></iframe>
                    </div>
                    <div
                      className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}
                    >
                      <div
                        className={`${style.continue} ${style.marginLeft}`}
                        onClick={() => {
                          setShowDocVerifyDialog(false);
                        }}
                      >
                        CLOSE
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog>
            )
          }
          {
            showFileDisplayDialog && (
              <FileDisplayDialog
                getIsOpen={getIsShowFileDialog}
                file={selectedFile}
              />
            )
          }
          {
            showEditNotesDialog && (
              <EditNotesDialog
                getIsOpen={getIsShowEditNoteDialog}
                showEditNotesID={showEditNotesID}
                showEditNotes={showEditNotes}
                showEditNotesPrivate={showEditNotesPrivate}
                showEditNotesFile={showEditNotesFile}
              />
            )
          }
          {showFileVerifyDialog && (
            <FileVerifyDialog
              getIsOpen={setShowFileVerifyDialog}
              file={fileArray[selectedFileIndex]}
              fileArray={fileArray}
              setFileArray={setFileArray}
              selectedFileIndex={selectedFileIndex}
              setSelectedFileIndex={setSelectedFileIndex}
              selectedRow={selectedRow}
              selectedRowTableName={selectedRowTableName}
              selectedFormId={selectedFormId}
              form={form}
              setForm={setForm}
              handleStepsVerify={handleStepsVerify}
              setHasVerificationAttempted={setHasVerificationAttempted}
              getPreApplicationForReplace={getPreApplication}
            />
          )}
          {/* <Dialog isOpen={showCurrentPrivileges} onClose={() => setShowCurrentPrivileges(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
          <div>
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div className={style.heading}>Selected Privilege Set</div>
                <div className={style.displayInRow}>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyleImg} ${style.cursorPointer} ${style.marginLeft} `}
                    onClick={() => { setShowCurrentPrivileges(false) }}
                  />
                </div>
              </div>
              <div>{getFields()}</div>
            </div>
          </div>
        </Dialog> */}
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
                      className={`${style.crossStyleImg} ${style.cursorPointer} ${style.marginLeft} `}
                      onClick={() => {
                        setShowCurrentPrivileges(false);
                      }}
                    />
                  </div>
                </div>
                <div>{currentPrivilegesCategoryReappointment === 'Basic' ? getFields() : getFieldsAdditional()}</div>
              </div>
            </div>
          </Dialog>
        </div >
      </div>
      {/* // )} */}
    </>
  );
};
export default NewActiveApplication;