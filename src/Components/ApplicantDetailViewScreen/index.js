import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
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
import MDManager from "./../../images/MDManager.png";
import CAPManagerSmallLogo from "./../../images/CAPManagerSmallLogo.png";
import CrossPink from "./../../images/crossPink.png";
import ToBeVerified from "./../../images/toBeVerifiedImage.png";
import DeleteIcon from "./../../images/deleteHcRow.png";
import Tooltip from "@mui/material/Tooltip";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import ApplicationDecline from "../../Screens/CAPManager/StaffApplication/applicationDeclineDialog";
import ApplicationHeader from "../../Components/ApplicationHeader";
import ApplicantDetailNotesView from '../../Components/ApplicantDetailNotesView';
import ApplicantDetailEditDialog from '../../Components/EditApplicantInfoDialog';
import ViewandVerifyScreen from '../../Components/ViewVerifyScreen';
import ApplicationFieldCard from "../../Components/ApplicationFieldCard";
import CommonDivider from "../../Components/CommonFields/CommonDivider";
import ESignature from "../../Components/ESignature";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import CommonDateField from "../../Components/CommonFields/CommonDateField";
import CommonSelectField from "../CommonFields/CommonSelectField";
import { format, differenceInDays, parseISO } from 'date-fns';
import TableTwo from "../../Components/TableDesignTwo";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import LoadingScreen from "../LoadingScreen";
import FileVerifyDialog from "../../Components/fileVerifyDialog";
import FileDisplayDialog from "../../Components/fileDisplayDialog";
import FileWithFieldsForStaff from "./fileWithFields";

const ApplicantDetailsViewScreen = ({ getApplicantDetailsViewScreen, isLoading, getActiveApplicationView }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);
  const fileInputRef = useRef(null);
  const fileInputRefForNew = useRef(null);
  const [form, setForm] = useState();
  const [documentDetails, setDocumentDetails] = useState();
  const [selectedFile, setselectedFile] = useState(false);
  const [selectedFileId, setselectedFileId] = useState('');
  const [selectedDocsFilter, setSelectedDocsFilter] = useState(null);
  const [currentDocumentCount, setCurrentDocumentCount] = useState();
  const [renewedDocumentRequired, setRenewedDocumentRequired] = useState();
  const [expireDocumentCount, setExpireDocumentCount] = useState();
  const [applicationsDetails, setApplicationsDetails] = useState();
  const [LMSDetails, setLMSDetails] = useState();
  const [notesDetails, setNotesDetails] = useState(null);
  const [applicationsMedicalDirectives, setApplicationsMedicalDirectives] = useState();
  const [attestedMDCount, setAttestedMDCount] = useState();
  const [reviewMDCount, setReviewMDCount] = useState();
  const [pastDueMDCount, setPastDueMDCount] = useState();
  const [selectedMDFilter, setSelectedMDFilter] = useState(null);
  const applicationId = sessionStorage.getItem("applicationId");
  const applicationType = sessionStorage.getItem('applicationCreationType') ?? 'REAPPOINTMENT';
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const workModeType = sessionStorage.getItem('workModeType')
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  const [selectedEditField, setSelectedEditField] = useState('');
  const [expandStates, setExpandStates] = useState({
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    section5: false,
    section6: false,
    section7: false,
  });
  const [showNotesDetailsDialog, setShowNotesDetailsDialog] = useState(false);
  const [showEditInfoDialog, setShowEditInfoDialog] = useState(false);
  const [showViewAndVerifyScreen, setShowViewAndVerifyScreen] = useState(false);
  const [fileArray, setFileArray] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [showFileVerifyDialog, setShowFileVerifyDialog] = useState(false);
  const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
  const [showFileWithFieldsDisplayDialog, setShowFileWithFieldsDisplayDialog] = useState(false);
  const [showViewOnly, setShowViewOnly] = useState(false);
  const [hasReviewInProgress, setHasReviewInProgress] = useState(false);
  const [replaceFileIndex, setReplaceFileIndex] = useState();
  const documentHeaderValues = ["", "Document Type", "Document Name", "Requirement", "Expiration Date", "Last Updated", "Action"];
  const documentColSortValues = [false, false, false, false, false, false, , false];
  const appointmentHeaderValues = ["Appointment Cycle", <img src={CAPManagerSmallLogo} alt="img" className={style.LogoIcon} />, "Privilege Category", "Approved Privileges", "Notes", "Docs", "Approval Date", "Action"];
  const appointmentColSortValues = [false, false, false, false, false, , false, false, false];
  const MDHeaderValues = ["", "Title", "", "MD ID", "Attestation Due Date", "Last Updated"];
  const MDColSortValues = [false, false, false, false, false, , false];
  const eduSmartHeaderValues = ["Course Name", "Times Completed", "Last Completed", "Action"];
  const eduSmartColSortValues = [false, false, false, false];
  const eduSmartCompletionHeaderValues = ["Course Name", "Status", "Completion Date", "Certificate"];
  const eduSmartCompletionColSortValues = [false, false, false, false];
  const [showEduSmartDialog, setShowEduSmartDialog] = useState(false);
  const [selectedEduSmartCourse, setSelectedEduSmartCourse] = useState(null);
  const toggleMDFilter = (filterType) => {
    setSelectedMDFilter((prevFilter) => prevFilter === filterType ? null : filterType);
  };
  const toggleDocsFilter = (filterType) => {
    setSelectedDocsFilter((prevFilter) => prevFilter === filterType ? null : filterType);
  };
  const [isOpenToggle, setIsOpenToggle] = useState(false);
  const toggleDropdown = () => setIsOpenToggle((prev) => !prev);

  const valueList = ["NAME", "CONTACT_DETAILS", "HOME_ADDRESS", "DEPARTMENT_DIVISION", "PRIVILEGE_CATEGORY"];
  const labelList = ["Name", "Contact Details", "Home Address", "Department / Division", "Privilege Category"];

  const onClickViewDocDialog = (data) => {
    setShowFileDisplayDialog(true);
    setselectedFile(data?.file)
  };

  const onClickEditDocDialog = (data) => {
    setShowFileWithFieldsDisplayDialog(true);
    setselectedFile(data?.file)
    setselectedFileId(data?.rowId);
  };

  const onclickViewAndVerifyFunction = (id) => () => {
    getActiveApplicationView(true);
    sessionStorage.setItem("applicationId", id);
  };

  const onclickViewAndVerifyDataFunction = (data) => {
    getActiveApplicationView(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const handleReplace = (data) => {
    // let index = tempValue?.table?.findIndex(fileData => fileData?.documentType === data?.documentType);
    // setReplaceFileIndex(index);
    // console.log(data)
    setselectedFileId(data?.rowId);
    fileInputRef.current.click();
  }

  const handleAddNewDoc = (data) => {
    fileInputRefForNew.current.click();
  }

  const documentActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: onClickViewDocDialog,
    },
    {
      data: "Edit",
      requiredValue: "boolean",
      onClick: onClickEditDocDialog,
    },
    {
      data: "Replace",
      requiredValue: "boolean",
      onClick: handleReplace,
    },
  ];

  const appointmentActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: onclickViewAndVerifyDataFunction,
    },
    // {
    //   data: "View Application",
    //   requiredValue: "boolean",
    // },
    // {
    //   data: "Print Application Details",
    //   requiredValue: "boolean",
    // },
    // {
    //   data: "Share Application Details",
    //   requiredValue: "boolean",
    // },
    // {
    //   data: "Download Details",
    //   requiredValue: "boolean",
    // },
  ];

  const mDActionsData = [
    {
      data: "ViewMD",
      requiredValue: "boolean",
    },
    {
      data: "EditMD",
      requiredValue: "boolean",
    },
  ];

  const eduSmartCourseActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: (row) => {
        setSelectedEduSmartCourse(row);
        setShowEduSmartDialog(true);
      },
    },
  ];

  const getEditInfoDetailsDialogOpen = (value) => {
    setShowEditInfoDialog(value)
  };

  useEffect(() => {
    if (showEditInfoDialog === false) {
      setSelectedEditField("")
    }
    getPreApplication()
  }, [showEditInfoDialog])


  useEffect(() => {
    if (renewedDocumentRequired?.documentsExpiringSoon?.length > 0 || expireDocumentCount > 0) {
      setExpandStates(prev => ({
        ...prev,
        section1: true,
      }));
    }
    if (
      Array.isArray(applicationsDetails)
    ) {
      const hasReviewInProgressStatus = applicationsDetails.some(app => app.status === "REVIEW_INPROGRESS");
      setExpandStates(prev => ({
        ...prev,
        section2: hasReviewInProgressStatus,
      }));

      setHasReviewInProgress(hasReviewInProgressStatus);
    }

    if ((reviewMDCount > 1) || (pastDueMDCount > 1)) {
      setExpandStates(prev => ({
        ...prev,
        section3: true,
      }));
    }
  }, [currentDocumentCount, applicationsDetails, reviewMDCount, pastDueMDCount]);

  const getNotesDetailsDialogOpen = (value, details = null) => {
    setShowNotesDetailsDialog(value);
    if (value && details) {
      setNotesDetails(details);
    }
  };

  // const getActiveApplicationView = () => {
  //   setShowViewAndVerifyScreen(true)
  //   sessionStorage.setItem("applicationId", form?.onGoingApplication?.id);
  // };


  let documentType = [];
  let expireDate = [];
  let requirementType = [];
  let documentName = [];
  let action = [];
  let lastUpdateDate = [];
  let appointmentCycle = [];
  let dot = [];
  let privilegeCategory = [];
  let approvedPrivileges = [];
  let PrivilegesHoverText = [];
  let notes = [];
  let notesIcon = [];
  let docs = [];
  let approvalDate = [];
  let title = [];
  let mdStatus = [];
  let mdID = [];
  let attestationDate = [];
  let dotTooltipValues = [];
  let status = [];
  let textTooltipValues = [];
  let allMedicalDirectives = [];
  let allDocumentDetails = [];
  let eduSmartCourseNames = [];
  let eduSmartCompletionCounts = [];
  let eduSmartLastCompletedDates = [];
  let eduSmartActions = [];

  const getDocsTableValues = () => {
    documentType = [];
    expireDate = [];
    requirementType = [];
    documentName = [];
    action = [];
    lastUpdateDate = [];
    status = [];
    allDocumentDetails = [];
    if (selectedDocsFilter === "allDocuments") {
      allDocumentDetails = documentDetails?.allDocuments || [];
    } else if (selectedDocsFilter === "documentsExpiringSoon") {
      allDocumentDetails = documentDetails?.documentsExpiringSoon?.documentsExpiringSoon || [];
    } else if (selectedDocsFilter === "expiredDocuments") {
      allDocumentDetails = documentDetails?.expiredDocuments || [];
    } else {
      allDocumentDetails = documentDetails?.allDocuments || [];
    }

    console.log("allDocumentDetails", allDocumentDetails)
    allDocumentDetails?.map((data, index) => {
      const expiryDateFormat = data?.expiryDate
        ? new Date(data?.expiryDate).toISOString().split('T')[0] + 'T00:00'
        : null;
      status.push(
        data?.hasExpiry === false ? (
          <WarningOutlinedIcon style={{ fontSize: 20, color: "#737575" }} />
        ) : data?.hasExpiry === true ? (
          (() => {
            if (!data?.expiryDate) return null;
            const expiryDateLevel = parseISO(data?.expiryDate);
            const currentDate = new Date();
            const daysDiff = differenceInDays(expiryDateLevel, currentDate);

            if (daysDiff < 0) {
              return <WarningOutlinedIcon style={{ fontSize: 20, color: "#ED2939" }} />;
            } else if (daysDiff <= 90) {
              return <WarningOutlinedIcon style={{ fontSize: 20, color: "#FFD700" }} />;
            } else {
              return <WarningOutlinedIcon style={{ fontSize: 20, color: "#737575" }} />;
            }
          })()
        ) : null
      );
      documentType.push(data?.documentType || data?.file?.fileName);
      documentName.push(data?.shortName || "-")
      requirementType.push(data?.required)
      expireDate.push(
        expiryDateFormat ? format(new Date(expiryDateFormat), dateFormat) : "-"
      );
      lastUpdateDate.push(
        // format(new Date(data?.LastUpdated), "MMM dd, yyyy") || '-'
        "-"
      );
      action.push(true);
    });

    return [
      { type: "text", value: '' },
      { type: "text", value: documentType },
      { type: "text", value: documentName },
      { type: "text", value: requirementType },
      { type: "text", value: expireDate },
      { type: "text", value: lastUpdateDate },
      { type: "action", value: action },
    ];
  };

  const getAppointmentTableValues = () => {
    appointmentCycle = [];
    dot = [];
    dotTooltipValues = [];
    privilegeCategory = [];
    approvedPrivileges = [];
    notes = [];
    notesIcon = [];
    docs = [];
    approvalDate = [];
    action = [];
    textTooltipValues = [];
    PrivilegesHoverText = [];

    applicationsDetails?.map((data, index) => {

      const startDateFormat = data?.cyclePeriod?.from
        ? new Date(data?.cyclePeriod?.from).toISOString().split('T')[0] + 'T00:00'
        : null;
      const endDateFormat = data?.cyclePeriod?.to
        ? new Date(data?.cyclePeriod?.to).toISOString().split('T')[0] + 'T00:00'
        : null;
      const approvalDateFormat = data?.approvedDate
        ? new Date(data?.approvedDate).toISOString().split('T')[0] + 'T00:00'
        : null;
      const privilegeData = [
        ...(data?.privileges?.obligatedPrivileges || []),
        ...(data?.privileges?.additionalPrivileges || [])
      ];
      appointmentCycle.push(
        <span
          key={index}
          onClick={onclickViewAndVerifyFunction(data?.id)}
          style={{ cursor: "pointer", color: "#2C2C2C" }}
        >
          {startDateFormat && endDateFormat
            ? `${format(new Date(startDateFormat), dateFormat)} - ${format(new Date(endDateFormat), dateFormat)}`
            : data?.appointmentCycle || "-"}
        </span>
      );
      textTooltipValues.push("Click to View Applicant Details")
      const color = data?.status === "IN_PROGRESS" ? "yellow"
        : data?.status === "COMPLETED" ? "green"
          : data?.status === "REJECTED" ? "red"
            : "grey";
      dot.push(color);
      dotTooltipValues.push(color === "yellow" ? "Application completed on CAPManager" : color === "green" ? "Application was manually entered by MSO" : color === "red" ? "Application not in CAPManager" : color === "grey" ? "Application Created" : "")
      privilegeCategory.push(data?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name)
      approvedPrivileges.push(privilegeData?.length);
      const PrivilegesHoverTitle = privilegeData?.length > 0
        ? privilegeData.map((priv, index) => {
          return (
            <div key={index} style={{ width: '100%' }}>
              <span>{priv?.privilegeSetTitle}</span>
            </div>
          );
        })
        : ['-'];

      PrivilegesHoverText.push(PrivilegesHoverTitle)
      notes.push(
        data?.notesDetails?.length > 0 ? (
          <Tooltip title="Click to View Notes" arrow>
            <span
              key={index}
              onClick={() => getNotesDetailsDialogOpen(true, data?.notesDetails)}
              style={{ cursor: "pointer", color: "#2C2C2C" }}
            >
              {data?.notesDetails?.length}
            </span>
          </Tooltip>
        ) : (
          <span key={index} style={{ color: "#2C2C2C" }}>-</span>
        )
      );

      notesIcon.push(
        data?.notesDetails?.length > 0 ? (
          <Tooltip title="Click to View Notes" arrow>
            <NoteAltOutlinedIcon
              style={{ fontSize: 20, color: "#2C2C2C", cursor: "pointer" }}
              onClick={() => getNotesDetailsDialogOpen(true, data?.notesDetails)}
            />
          </Tooltip>
        ) : null
      );
      // docs.push(data?.documents?.documentDetails?.length)
      docs.push(
        data?.documents?.documentDetails?.length > 0 ? (
          <Tooltip title="Click to View Docs" arrow>
            <span
              key={index}
              onClick={() => handleViewClickDocs(data?.documents?.documentDetails)}
              style={{ cursor: "pointer", color: "#2C2C2C" }}
            >
              {data?.documents?.documentDetails?.length}
            </span>
          </Tooltip>
        ) : (
          <span key={index} style={{ color: "#2C2C2C" }}>-</span>
        )
      );
      approvalDate.push(
        approvalDateFormat ? format(new Date(approvalDateFormat), dateFormat) : "-"
      );
      action.push(true);
    });

    return [
      { type: "text", value: appointmentCycle, tooltipValueText: textTooltipValues },
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: privilegeCategory },
      {
        type: "countWithHover",
        value: approvedPrivileges,
        hoverText: PrivilegesHoverText,
        isShowHoverText: true,
      },
      { type: "iconWithCount", value: notes, icon: notesIcon, },
      { type: "text", value: docs },
      { type: "text", value: approvalDate },
      { type: "action", value: action },
    ];
  };

  const getMDTableValues = () => {
    dot = [];
    title = [];
    mdStatus = [];
    mdID = [];
    attestationDate = [];
    lastUpdateDate = [];
    action = [];
    if (selectedMDFilter === "completed") {
      allMedicalDirectives = applicationsMedicalDirectives?.completed || [];
    } else if (selectedMDFilter === "pending") {
      allMedicalDirectives = applicationsMedicalDirectives?.pending || [];
    } else if (selectedMDFilter === "pastDue") {
      allMedicalDirectives = applicationsMedicalDirectives?.pastDue || [];
    } else {
      allMedicalDirectives = [
        ...(applicationsMedicalDirectives?.completed || []),
        ...(applicationsMedicalDirectives?.pending || []),
        ...(applicationsMedicalDirectives?.pastDue || [])
      ];
    }
    // allMedicalDirectives = [
    //     ...(applicationsMedicalDirectives?.completed || []),
    //     ...(applicationsMedicalDirectives?.pending || []),
    //     ...(applicationsMedicalDirectives?.pastDue || [])
    //   ];

    //  const allDirectives = [
    //     ...(applicationsMedicalDirectives || [])
    //   ];

    console.log("applicationsMedicalDirectives", allMedicalDirectives)
    allMedicalDirectives?.forEach((data, index) => {
      const directive = data?.medicalDirective;
      const attestationDueDateFormat = data?.attestationDueDate
        ? new Date(data?.attestationDueDate).toISOString().split('T')[0] + 'T00:00'
        : null;
      const lastModifiedDate = directive?.lastModifiedDate
        ? new Date(directive.lastModifiedDate)
        : null;
      const color = data?.status === "IN_PROGRESS" ? "yellow"
        : data?.status === "COMPLETED" ? "green"
          : data?.status === "REJECTED" ? "red"
            : "grey";
      dot.push(color);
      title.push(directive?.title)
      mdStatus.push(directive?.creationType)
      mdID.push(directive?.mdID)
      attestationDate.push(
        attestationDueDateFormat ? format(new Date(attestationDueDateFormat), dateFormat) : "-"
      );
      lastUpdateDate.push(
        lastModifiedDate ? format(lastModifiedDate, dateFormat) : "-"
      );
      action.push(true);
    });

    return [
      { type: "dot", value: dot },
      { type: "text", value: title },
      { type: "text", value: mdStatus },
      { type: "text", value: mdID },
      { type: "text", value: attestationDate },
      { type: "text", value: lastUpdateDate },
      // { type: "action", value: action },
    ];
  };

  const getEduSmartTableValues = () => {
    eduSmartCourseNames = [];
    eduSmartCompletionCounts = [];
    eduSmartLastCompletedDates = [];
    eduSmartActions = [];

    const courseItems = LMSDetails?.courseAndCompletions || [];

    courseItems.forEach((item) => {
      const name = item?.course?.course_name || "-";
      const completions = Array.isArray(item?.completions)
        ? item.completions
        : [];

      const completionsCount = completions.length;

      // Find last completed date among completions
      const completedDates = completions
        .filter(
          (c) =>
            c?._course_completed === true ||
            c?.is_course_completed === true ||
            c?.course_status === "completed"
        )
        .map((c) => c?.course_completion_date)
        .filter(Boolean);

      let lastCompletedFormatted = "-";
      if (completedDates.length > 0) {
        const latest = completedDates
          .map((d) => new Date(d))
          .filter((d) => !Number.isNaN(d.getTime()))
          .sort((a, b) => b.getTime() - a.getTime())[0];
        if (latest) {
          lastCompletedFormatted = format(latest, dateFormat);
        }
      }

      eduSmartCourseNames.push(name);
      eduSmartCompletionCounts.push(completionsCount);
      eduSmartLastCompletedDates.push(lastCompletedFormatted);
      eduSmartActions.push(true);
    });

    return [
      {
        type: "text",
        value: eduSmartCourseNames,
        onClickFunction: (row) => {
          setSelectedEduSmartCourse(row);
          setShowEduSmartDialog(true);
        },
      },
      { type: "text", value: eduSmartCompletionCounts },
      { type: "text", value: eduSmartLastCompletedDates },
      { type: "action", value: eduSmartActions },
    ];
  };

  useEffect(() => {
    getPreApplication();
    getPreApplicationDocuments();
    getPreApplicationDetails();
    getLMSHistory()
  }, [applicationId]);

  useEffect(() => {
    if (form?.applicant?.id) {
      getPreApplicationMedicalDirectives();
    }
  }, [form?.applicant?.id]);


  useEffect(() => {
    setUserDetails();
  }, [users?.id])

  const sendEmail = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const toggleExpand = (section) => {
    setExpandStates((prevStates) => ({
      ...prevStates,
      [section]: !prevStates[section],
    }));
  };

  const handleViewClickDocs = (files) => {
    setFileArray(files);
    setSelectedFileIndex(0);
    setShowFileVerifyDialog(true);
    setShowViewOnly(true)
  };

  const getPreApplication = async () => {
    try {
      setIsLoadingImage(true);
      const { data: basicForm } = await GET(`application-management-service/staff/${applicationId}`);
      setForm(basicForm);
      setIsLoadingImage(false)
    } catch (error) {
      console.error('Error fetching application:', error);
    }
  };

  const getPreApplicationDocuments = async () => {
    try {
      const { data: basicDocuments } = await GET(`application-management-service/staff/${applicationId}/documents?noOfDays=20`);
      setDocumentDetails(basicDocuments || []);
      setCurrentDocumentCount(basicDocuments?.allDocuments?.length || 0)
      setRenewedDocumentRequired(basicDocuments?.documentsExpiringSoon || [])
      setExpireDocumentCount(basicDocuments?.expiredDocuments?.length || 0)
    } catch (error) {
      console.error('Error fetching application Documents:', error);
    }
  };

  const getPreApplicationDetails = async () => {
    try {
      const { data: applicationDetails } = await GET(`application-management-service/staff/${applicationId}/applications`);
      setApplicationsDetails(applicationDetails);
    } catch (error) {
      console.error('Error fetching application Documents:', error);
    }
  };

  const getLMSHistory = async () => {
    try {
      const { data: lmsHistory } = await GET(`application-management-service/staff/${applicationId}/lmsHistory`);
      setLMSDetails(lmsHistory);
    } catch (error) {
      console.error('Error fetching application Documents:', error);
    }
  }

  const getPreApplicationMedicalDirectives = async () => {
    try {
      const { data: applicationsMedicalDirectivesDetails } = await GET(`medical-directive-service/medicalDirectives/byUser?userId=${form?.applicant?.id}`);
      setApplicationsMedicalDirectives(applicationsMedicalDirectivesDetails);
      setAttestedMDCount(applicationsMedicalDirectivesDetails?.completed?.length || 0)
      setPastDueMDCount(applicationsMedicalDirectivesDetails?.pastDue?.length || 0)
      setReviewMDCount(applicationsMedicalDirectivesDetails?.pending?.length || 0)
    } catch (error) {
      console.error('Error fetching application Documents:', error);
    }
  };

  const setUserDetails = async () => {
    try {
      const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
      console.log("userdataaaa", JSON.stringify(userData));
      sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleFileChange = async (event) => {
    setIsLoadingImage(true)
    const file = event.target.files[0];

    let fileName = {
      "file": { fileName: file?.name }
    };
    const formData = new FormData();
    formData.append('documentDetail', new Blob([JSON.stringify(fileName)], {
      type: "application/json"
    }));
    formData.append('document', file);
    if (file) {
      let url = `application-management-service/staff/${applicationId}/documents/${selectedFileId}/replace`;
      await PUT(url, formData)
        .then(response => {
          setIsLoadingImage(false)
          console.log(response)
          getPreApplication()
          getPreApplicationDocuments()
        })
        .catch((error) => {
          setIsLoadingImage(false)
          console.log(error)
        })
    } else {
      setIsLoadingImage(false)
    }
    console.log(file, file?.name, 'Test')
  };

  const handleFileUpload = async (event) => {
    setIsLoadingImage(true)
    const file = event.target.files[0];

    let fileName = {
      "file": { fileName: file?.name }
    };
    const formData = new FormData();
    formData.append('documentDetail', new Blob([JSON.stringify(fileName)], {
      type: "application/json"
    }));
    formData.append('document', file);
    if (file) {
      let url = `application-management-service/staff/${applicationId}/documents`;
      await PUT(url, formData)
        .then(response => {
          setIsLoadingImage(false)
          console.log(response)
          getPreApplication()
          getPreApplicationDocuments()
        })
        .catch((error) => {
          setIsLoadingImage(false)
          console.log(error)
        })
    } else {
      setIsLoadingImage(false)
    }
    console.log(file, file?.name, 'Test')
  };

  const onClose = () => {
    getApplicantDetailsViewScreen(false);
  };

  const lastModifiedDate = form?.lastModifiedDate;
  const lastModifiedDateFormat = lastModifiedDate ? format(new Date(lastModifiedDate), dateFormat) : "-";
  const ExpireDate = form?.tenure?.to
    ? new Date(form?.tenure?.to).toISOString().split('T')[0] + 'T00:00'
    : null;
  const formattedExpiringDate = ExpireDate ? format(new Date(ExpireDate), dateFormat) : "-";
  const LastApprovedDate = form?.lastApprovedDate
    ? new Date(form?.lastApprovedDate).toISOString().split('T')[0] + 'T00:00'
    : null;
  const formattedLastApprovedDate = LastApprovedDate ? format(new Date(LastApprovedDate), dateFormat) : "-";

  let tableHeaderValues = documentHeaderValues;
  let tableSortValues = documentColSortValues;
  let tableDataValues = getDocsTableValues();
  let actions = documentActionsData;
  let gridStyle = style.documentViewGrid;
  let tableAppointmentHeaderValues = appointmentHeaderValues;
  let tableAppointmentSortValues = appointmentColSortValues;
  let tableAppointmentDataValues = getAppointmentTableValues();
  let actionsAppointment = appointmentActionsData;
  let gridStyleAppointment = style.appointmentViewGrid;
  let tableMDHeaderValues = MDHeaderValues;
  let tableMDSortValues = MDColSortValues;
  let tableMDDataValues = getMDTableValues();
  // let actionsMD = mDActionsData;
  let gridStyleMD = style.medicalDirectiveViewGrid;
  let tableEduSmartHeaderValues = eduSmartHeaderValues;
  let tableEduSmartSortValues = eduSmartColSortValues;
  let tableEduSmartDataValues = getEduSmartTableValues();
  let gridStyleEduSmart = style.eduSmartGrid;
  const getEduSmartCompletionTableValues = () => {
    const courseItem = selectedEduSmartCourse;
    const rows = courseItem?.completions || [];

    const courseNames = [];
    const statusList = [];
    const completionDates = [];
    const certificateField = [];

    rows.forEach((c, idx) => {
      courseNames.push(c?.course_name || "-");

      const isCompleted =
        c?._course_completed === true ||
        c?.is_course_completed === true ||
        c?.course_status === "completed";
      const statusText = isCompleted
        ? "Completed"
        : c?.course_status || "Not Completed";
      statusList.push(statusText);

      const completionDate =
        c?.course_completion_date &&
          !Number.isNaN(new Date(c.course_completion_date))
          ? format(new Date(c.course_completion_date), dateFormat)
          : "-";
      completionDates.push(completionDate);

      const hasCertificate = !!(
        c?.certificate_details?.view_url ||
        c?.certificate_details?.download_url
      );

      if (isCompleted && hasCertificate) {
        certificateField.push(
          <div
            key={idx}
            className={style.verticalAlignCenter}
            style={{ width: "100%", minHeight: "100%" }}
          >
            <Tooltip title="View certificate" arrow>
              <CardMembershipIcon
                sx={{
                  fontSize: 22,
                  color: "#06617A",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const url =
                    c?.certificate_details?.view_url ||
                    c?.certificate_details?.download_url;
                  if (url) window.open(url, "_blank");
                }}
              />
            </Tooltip>
          </div>
        );
      } else {
        certificateField.push(
          <div
            key={idx}
            className={style.verticalAlignCenter}
            style={{ width: "100%" }}
          >
            <span />
          </div>
        );
      }
    });

    return [
      { type: "text", value: courseNames },
      { type: "text", value: statusList },
      { type: "text", value: completionDates },
      { type: "field", field: certificateField },
    ];
  };

  return (
    <>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      <div
        style={{
          maxHeight: "calc(100vh - 10px)",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "gray transparent",
        }}
      >
        <ApplicationHeader
          // title={`${form?.creationType === "NEW" ? "New Application For" : applicationType === "LOCUM" ? `Locum Application ${form?.reappointmentType === "EXTENSION" ? "Extension" : "Renewal"} For` : "Reappointment Application For"} ${
          //     form?.applicant?.name?.firstName !== undefined &&
          //     form?.applicant?.name?.lastName !== undefined
          //     ? formatFirstNameLastName(
          //         form?.applicant?.name?.firstName,
          //         form?.applicant?.name?.lastName,
          //         )
          //     : "{First Name} {Last Name}"
          // } ${applicationType === "LOCUM" ? "Locum" : ""} ${
          //     form?.basicDetailReferences?.applicantType?.serviceProviderType !==
          //     undefined
          //     ? form?.basicDetailReferences?.applicantType?.serviceProviderType
          //     : "{Applicant Type}"
          // }`}
          title={`Credentialing & Privileging ${form?.basicDetailReferences?.credentialingAndPrivilegingCategory?.type === "LOCUM" ? 'Locum' : 'Permanent'} Staff Details`}
          close={true}
          closeClick={onClose}
          isNotLogout={true}
        />
        <div className={`${style.marginLeftRight50} ${style.marginTop10}`}>
          <div
            className={`${style.headerTextStyle}`}
          >{`${workModeType} ${applicationType} DASHBOARD > APPLICATIONS >> ${form?.applicant?.name?.firstName !== undefined &&
            form?.applicant?.name?.lastName !== undefined
            ? formatFirstNameLastName(
              form?.applicant?.name?.firstName,
              form?.applicant?.name?.lastName,
            )
            : "{First Name} {Last Name}"
            }`}</div>
          <div className={`${style.grid2to1} ${style.marginTop10}`}>
            <div>
              <div
                className={`${style.cardLeftStyle}`}
              >
                <div className={style.gridView}>
                  <div className={`${style.photoBorderStyle}`}>
                    <img
                      src={form?.applicant?.profilePicture?.fileURL || UserLogo}
                      alt="Profile Picture"
                      className={style.profileImage}
                    />
                  </div>
                  <div className={`${style.grid2} ${style.textAlignLeft}`}>
                    <div className={style.marginTop10}>
                      <div>
                        <span className={`${style.cardTextBoldStyle}`}>
                          {form?.applicant?.name?.firstName !== undefined &&
                            form?.applicant?.name?.lastName !== undefined
                            ? formatFirstNameLastName(
                              form?.applicant?.name?.firstName,
                              form?.applicant?.name?.lastName,
                            )
                            : "{First Name} {Last Name}"}{" "}
                        </span>
                        <span className={`${style.serviceAreaType} ${style.marginLeft10}`}>{applicationType === "LOCUM" ? "Locum" : ""}{" "}
                          {form?.basicDetailReferences?.applicantType
                            ?.serviceProviderType || ""}</span>
                      </div>
                      <div
                        className={`${style.cardTextNormalStyle} ${style.marginTop10}`}
                      >
                        <span
                          className={`${style.cardTextNormalStyle}`}
                        >
                          {form?.basicDetailReferences?.department?.name
                            ? `${form.basicDetailReferences.department.name}`
                            : ""}
                          {form?.basicDetailReferences?.specialty?.name
                            ? `${form?.basicDetailReferences?.department?.name ? ", " : ""}${form.basicDetailReferences.specialty.name}`
                            : ""}
                        </span>
                      </div>
                      <div
                        className={`${style.cardTextNormalStyle} ${style.marginTop10}`}
                      >
                        <span
                          className={`${style.cardTextNormalStyle}`}
                        >
                          {form?.applicant?.licenseNumber
                            ? `CPSO number : ${form.applicant.licenseNumber}`
                            : ""}
                          <span className={`${form?.applicant?.ohipNumber ? style.marginLeft10 : ""}`}>
                            {form?.applicant?.ohipNumber
                              ? `OHIP number : ${form.applicant?.ohipNumber}`
                              : ""}
                          </span>
                        </span>
                      </div>
                      <div
                        className={`${style.emailTextBoldStyle} ${style.marginTop10}`}
                      >
                        {form?.applicant?.mobileNumber
                          ? `+1 ${form?.applicant?.mobileNumber}`
                          : ""}
                        <span
                          className={`${style.emailTextBoldStyle} ${form?.applicant?.mobileNumber ? style.marginLeft10 : ""}`}
                        >
                          <span
                            className={style.cursorPointer}
                            onClick={() =>
                              sendEmail(form?.applicant?.email?.officialEmail || "")
                            }
                          >
                            {form?.applicant?.email?.officialEmail || ""}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div>

                      {/* <div className={`${style.marginTop10} ${style.editInfo}`}>
                        <span className={style.cursorPointer} onClick={() => getEditInfoDetailsDialogOpen(true)}>
                        <Tooltip title="Click to Edit Info" arrow>
                        Edit Profile Info 
                        </Tooltip>
                        </span>
                        <span>   
                           <Tooltip title="Click to Edit Info" arrow>
                          <CreateOutlinedIcon
                            style={{ fontSize: 20, color: "#06617A", cursor: "pointer" }}
                            className={`${style.marginLeft10} ${style.cursorPointer}`}
                          // onClick={onClickNotesFunction}
                          />
                          </Tooltip>  
                        </span> 
                      </div> */}
                      {/* <div>
                        <CommonSelectField
                            value={selectedEditField}
                            onChange={(e) => {
                              setSelectedEditField(e.target.value);
                              if(e.target.value !== ""){
                              getEditInfoDetailsDialogOpen(true);
                              }
                            }}
                            className={style.colorCode}
                            firstOptionLabel={'Modify Staff Data'}
                            firstOptionValue={''}
                            valueList={["NAME", "CONTACT_DETAILS", "HOME_ADDRESS","DEPARTMENT_DIVISION","PRIVILEGE_CATEGORY"]}
                            labelList={['Name', 'Contact Details', "Home Address","Department / Division","Privilege Category"]}
                            disabledList={false}
                            required={false}
                          />
                      </div> */}
                      {/* <Tooltip title="Click Here to See Option" arrow> */}
                      <div className={`${style.whiteButton} ${style.cursorPointer}`} onClick={() => toggleDropdown()}>
                        <div className={`${style.spaceEvenly}`}>
                          <div className={`${style.buttonTextStyle} ${style.alignCenter}`}>
                            {selectedEditField ? labelList[valueList.indexOf(selectedEditField)] : "Modify Staff Data"}
                          </div>
                          {isOpenToggle ? <KeyboardArrowUpOutlinedIcon sx={{
                            fontSize: 20,
                            color: "#ffffff",
                            cursor: "pointer",
                          }} /> : <KeyboardArrowDownOutlinedIcon sx={{
                            fontSize: 20,
                            color: "#ffffff",
                            cursor: "pointer",
                          }} />}
                        </div>
                      </div>
                      {/* </Tooltip> */}

                      {/* Dropdown Menu */}
                      {isOpenToggle && (
                        <div className={style.dropdownMenu}>
                          {valueList.map((value, index) => (
                            <div
                              key={value}
                              className={`${style.dropdownItem} ${selectedEditField === value ? style.selectedItem : ""}`}
                              onClick={() => {
                                setSelectedEditField(value);
                                getEditInfoDetailsDialogOpen(true);
                                toggleDropdown(); // Close after selection
                              }}
                            >
                              {labelList[index]}
                            </div>
                          ))}
                        </div>
                      )}
                      <div
                        className={`${style.marginTop10}`}
                      >
                        <span className={style.rightAlignTextStyle}>
                          Last Updated on {lastModifiedDateFormat}
                        </span>
                        {/* <span
                          className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}
                        >
                          {lastModifiedDateFormat}
                        </span> */}
                      </div>
                      <div
                        className={`${style.marginTop10}`}
                      >
                        <span className={style.rightAlignTextStyle}>
                          Expiration Date on {formattedExpiringDate}
                        </span>
                        {/* <span
                          className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}
                        >
                          {formattedExpiringDate}
                        </span> */}
                      </div>
                      <div
                        className={`${style.marginTop10}`}
                      >
                        {formattedLastApprovedDate !== "-" && (
                          <span className={style.rightAlignTextStyle}>
                            Last Approved By BOD on {formattedLastApprovedDate}
                          </span>
                        )}
                        {/* <span
                          className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}
                        >
                          {formattedExpiringDate}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className={`${style.marginTop20}`}>
                  <div className={`${style.cardLeftStyle} ${style.padding30}`}>
                    <div className={`${style.spaceBetween} ${style.alignItemCenter}`}>
                      <div className={`${style.documentTextStyle}`}>
                        Document Vault
                        <span className={`${style.marginLeft10} ${style.documentSubHeadingStyle}`}>
                          Only includes documents that have been verified by the MSO.
                          {(currentDocumentCount > 1 && expireDocumentCount < 1 && renewedDocumentRequired?.documentsExpiringSoon?.length < 1) && (
                            <strong className={style.greenTextStyle}> (All documents are up to date.)</strong>
                          )}
                        </span>
                      </div>
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                        {expandStates.section1 && (
                          <Tooltip title={"Click to Upload New Document"} arrow>
                            <AddCircleOutlineIcon
                              sx={{ fontSize: 20, color: "#94979A", cursor: "pointer" }}
                              onClick={() => { handleAddNewDoc() }}
                            />
                          </Tooltip>
                        )}
                        <div
                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          onClick={() => toggleExpand("section1")}
                        >
                          {expandStates.section1 ? (
                            <Tooltip title={"Click to Minimize"} arrow>
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title={"Click to Expand"} arrow>
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                    {expandStates.section1 && (
                      <div>
                        <CommonDivider />
                        <div className={`${style.grip3} ${style.marginTop20}`}>
                          <div className={` ${selectedDocsFilter === "allDocuments" ? style.selectedBackgroundCard : ""} ${style.documentCurrentBackGround} ${style.spaceBetweenCol} ${style.cursorPointer}`} onClick={() => toggleDocsFilter("allDocuments")}>
                            <div className={`${style.innerTextDocumentStyle}`}>Current Documents </div>
                            <div className={`${currentDocumentCount > 0 ? style.countStyleGreen : style.countStyleGrey}`}> {currentDocumentCount} </div>
                          </div>
                          <div className={` ${selectedDocsFilter === "documentsExpiringSoon" ? style.selectedBackgroundCard : ""} ${style.documentCurrentBackGround} ${style.spaceBetweenCol} ${style.cursorPointer}`} onClick={() => toggleDocsFilter("documentsExpiringSoon")}>
                            <div className={`${style.innerTextDocumentStyle}`}>To Be Renewed  </div>
                            <div className={`${style.spaceBetween} ${style.alignSelfEnd}`}>
                              <div className={`${style.countStyleRed}`}>{renewedDocumentRequired?.documentsExpiringSoon?.length}</div>
                              <div>
                                <div className={`${style.requiredTextStyle}`}>Required <span className={`${style.marginLeft10} ${style.countStyleYellow}`}>{renewedDocumentRequired?.requiredDocumentsCount}</span></div>
                                <div className={`${style.requiredTextStyle}`}>Recommended <span className={`${style.marginLeft10}  ${style.countStyleRed}`}>{renewedDocumentRequired?.recommendedDocumentsCount}</span></div>
                              </div>
                            </div>
                          </div>
                          <div className={` ${selectedDocsFilter === "expiredDocuments" ? style.selectedBackgroundCard : ""} ${style.documentCurrentBackGround} ${style.spaceBetweenCol} ${style.cursorPointer}`} onClick={() => toggleDocsFilter("expiredDocuments")}>
                            <div className={`${style.innerTextDocumentStyle}`}>Expired </div>
                            <div className={`${style.countStyleRed}`}>{expireDocumentCount}</div>
                          </div>
                        </div>
                        <div className={`${style.bigCardStyle}`}>
                          {isLoading ? (
                            <div
                              className={`${style.verticalAlignCenter} ${style.justifyCenter}`}
                            >
                              <CircularProgress sx={{ color: "#06617A" }} />
                            </div>
                          ) : (
                            <div>
                              <div
                                className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}
                              >
                                <TableTwo
                                  tableHeaderValues={tableHeaderValues}
                                  tableDataValues={tableDataValues}
                                  tableData={allDocumentDetails}
                                  gridStyle={gridStyle}
                                  actions={actions}
                                  scrollStyle={style.contractScrollStyle}
                                  tableSortValues={tableSortValues}
                                  heading={"There are no Record for you to manage"}
                                  onClickFunction={() => { }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`${style.marginTop20}`}>
                  <div className={`${style.cardLeftStyle} ${style.padding30}`}>
                    <div className={`${style.spaceBetween} ${style.alignItemCenter}`}>
                      <div className={`${style.documentTextStyle}`}>
                        <img src={CAPManagerSmallLogo} alt="img" className={style.LogoIcon} /> <span>Appointment History {!hasReviewInProgress && (<strong className={style.greenTextStyle}> - No Current Application</strong>)}</span>
                      </div>
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                        <div
                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          onClick={() => toggleExpand("section2")}
                        >
                          {expandStates.section2 ? (
                            <Tooltip title={"Click to Minimize"} arrow>
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title={"Click to Expand"} arrow>
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                    {expandStates.section2 && (
                      <div>
                        <CommonDivider />
                        <div className={`${style.bigCardStyle}`}>
                          {isLoading ? (
                            <div
                              className={`${style.verticalAlignCenter} ${style.justifyCenter}`}
                            >
                              <CircularProgress sx={{ color: "#06617A" }} />
                            </div>
                          ) : (
                            <div>
                              <div
                                className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}
                              >
                                <TableTwo
                                  tableHeaderValues={tableAppointmentHeaderValues}
                                  tableDataValues={tableAppointmentDataValues}
                                  tableData={applicationsDetails}
                                  gridStyle={gridStyleAppointment}
                                  actions={actionsAppointment}
                                  scrollStyle={style.contractScrollStyle}
                                  tableSortValues={tableSortValues}
                                  heading={"There are no Record for you to manage"}
                                  onClickFunction={() => { }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className={`${style.marginTop20}`}>
                  <div className={`${style.cardLeftStyle} ${style.padding30}`}>
                    <div className={`${style.spaceBetween} ${style.alignItemCenter}`}>
                      <div className={`${style.documentTextStyle}`}>
                        <img src={MDManager} alt="img" className={style.LogoIcon} /> <span>Medical Directives {(attestedMDCount > 1 && reviewMDCount < 1 && pastDueMDCount < 1) && (<strong className={style.greenTextStyle}> - All Medical Directives are Attested </strong>)}</span>
                      </div>
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                        <div
                          className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                          onClick={() => toggleExpand("section3")}
                        >
                          {expandStates.section3 ? (
                            <Tooltip title={"Click to Minimize"} arrow>
                              <RemoveIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title={"Click to Expand"} arrow>
                              <AddIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#94979A",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                    {expandStates.section3 && (
                      <div>
                        <CommonDivider />
                        <div className={`${style.grip3} ${style.marginTop20}`}>
                          <div className={` ${selectedMDFilter === "completed" ? style.selectedBackgroundCard : ""} ${style.documentCurrentBackGround} ${style.spaceBetweenCol} ${style.cursorPointer}`} onClick={() => toggleMDFilter("completed")}>
                            <div className={`${style.innerTextDocumentStyle}`}>Attested </div>
                            <div className={`${attestedMDCount > 0 ? style.countStyleGreen : style.countStyleGrey}`}> {attestedMDCount} </div>
                          </div>
                          <div className={` ${selectedMDFilter === "pending" ? style.selectedBackgroundCard : ""} ${style.documentCurrentBackGround} ${style.spaceBetweenCol} ${style.cursorPointer}`} onClick={() => toggleMDFilter("pending")}>
                            <div className={`${style.innerTextDocumentStyle}`}>To Review & Attest </div>
                            <div className={`${style.countStyleYellow}`}>{reviewMDCount}</div>
                          </div>
                          <div className={` ${selectedMDFilter === "pastDue" ? style.selectedBackgroundCard : ""} ${style.documentCurrentBackGround} ${style.spaceBetweenCol} ${style.cursorPointer}`} onClick={() => toggleMDFilter("pastDue")}>
                            <div className={`${style.innerTextDocumentStyle}`}>Attestations Past Due </div>
                            <div className={`${style.countStyleRed}`}>{pastDueMDCount}</div>
                          </div>
                        </div>
                        <div className={`${style.bigCardStyle}`}>
                          {isLoading ? (
                            <div
                              className={`${style.verticalAlignCenter} ${style.justifyCenter}`}
                            >
                              <CircularProgress sx={{ color: "#06617A" }} />
                            </div>
                          ) : (
                            <div>
                              <div
                                className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}
                              >
                                <TableTwo
                                  tableHeaderValues={tableMDHeaderValues}
                                  tableDataValues={tableMDDataValues}
                                  tableData={allMedicalDirectives}
                                  gridStyle={gridStyleMD}
                                  // actions={actionsMD}
                                  scrollStyle={style.contractScrollStyle}
                                  tableSortValues={tableMDSortValues}
                                  heading={"There are no Record for you to manage"}
                                  onClickFunction={() => { }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {LMSDetails?.courseAndCompletions?.length > 0 && (
                  <div className={`${style.marginTop20}`}>
                    <div className={`${style.cardLeftStyle} ${style.padding30}`}>
                      <div className={`${style.spaceBetween} ${style.alignItemCenter}`}>
                        <div className={`${style.documentTextStyle}`}>
                          <img src={CAPManagerSmallLogo} alt="img" className={style.LogoIcon} />{" "}
                          <span>EduSmart Course History</span>
                        </div>
                        <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                          <div
                            className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                            onClick={() => toggleExpand("section4")}
                          >
                            {expandStates.section4 ? (
                              <Tooltip title={"Click to Minimize"} arrow>
                                <RemoveIcon
                                  sx={{
                                    fontSize: 20,
                                    color: "#94979A",
                                    cursor: "pointer",
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title={"Click to Expand"} arrow>
                                <AddIcon
                                  sx={{
                                    fontSize: 20,
                                    color: "#94979A",
                                    cursor: "pointer",
                                  }}
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                      {expandStates.section4 && (
                        <div>
                          <CommonDivider />
                          <div className={`${style.bigCardStyle}`}>
                            {isLoading ? (
                              <div
                                className={`${style.verticalAlignCenter} ${style.justifyCenter}`}
                              >
                                <CircularProgress sx={{ color: "#06617A" }} />
                              </div>
                            ) : (
                              <div>
                                <div
                                  className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}
                                >
                                  <TableTwo
                                    tableHeaderValues={tableEduSmartHeaderValues}
                                    tableDataValues={tableEduSmartDataValues}
                                    tableData={LMSDetails?.courseAndCompletions || []}
                                    gridStyle={gridStyleEduSmart}
                                    scrollStyle={style.contractScrollStyle}
                                    tableSortValues={tableEduSmartSortValues}
                                    heading={"There are no EduSmart courses to display"}
                                    onClickFunction={() => { }}
                                    actions={eduSmartCourseActionsData}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className={`${style.cardLeftStyle}`}>
                <div className={`${style.displayInRow}${style.marginTop20}`}>
                  <div
                    className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.alignItemCenter}`}
                  >
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                      <span className={`${style.tableHeaderHeadingTextStyle1}`}>Notes</span>
                      <div
                        className={`${style.marginTop5} ${style.marginLeft10} ${style.tableDataFontStyle1}`}
                      >
                        <Tooltip title="Create a Note" arrow>
                          <CreateOutlinedIcon
                            className={`${style.notesIcon} ${style.cursorPointer}`}
                          // onClick={onClickNotesFunction}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                      <div
                        className={`${style.marginLeft10} ${style.tableDataFontStyle1}`}
                        onClick={() => toggleExpand("section5")}
                      >
                        {expandStates.section5 ? (
                          <Tooltip title={"Click to Minimize"} arrow>
                            <RemoveIcon
                              sx={{
                                fontSize: 20,
                                color: "#94979A",
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title={"Click to Expand"} arrow>
                            <AddIcon
                              sx={{
                                fontSize: 20,
                                color: "#94979A",
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        showNotesDetailsDialog && (
          <ApplicantDetailNotesView
            getIsOpen={getNotesDetailsDialogOpen}
            notesDetails={notesDetails}
          // onClose={() => { setShowCCDateDialog(false); setCheckedIds([]); }}
          />
        )
      }
      {
        showEditInfoDialog && (
          <ApplicantDetailEditDialog
            getIsOpen={getEditInfoDetailsDialogOpen}
            applicationId={applicationId}
            selectedEditField={selectedEditField}
          // notesDetails={notesDetails}
          // onClose={() => { setShowCCDateDialog(false); setCheckedIds([]); }}
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
          showViewOnly={showViewOnly}
        />
      )}
      {showFileDisplayDialog && (
        <FileDisplayDialog
          getIsOpen={setShowFileDisplayDialog}
          file={selectedFile}
        />
      )}

      {showFileWithFieldsDisplayDialog && (
        <FileWithFieldsForStaff
          getIsOpen={setShowFileWithFieldsDisplayDialog}
          file={selectedFile}
          rowId={selectedFileId}
          staffId={users?.id}
          // fields={fields} metadata={metaData}
          // applicationDocumentId={file?.rowId} 
          getPreApplication={getPreApplicationDocuments}
          applicationIdFromEdit={applicationId}
        />
      )}
      {showEduSmartDialog && selectedEduSmartCourse && (
        <Dialog
          isOpen={showEduSmartDialog}
          onClose={() => setShowEduSmartDialog(false)}
          className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
          canOutsideClickClose={true}
          canEscapeKeyClose={true}
        >
          <div>
            <div className={Classes.DIALOG_BODY}>
              <div className={style.spaceBetween}>
                <div className={style.heading}>
                  EduSmart Course Completions –{" "}
                  {selectedEduSmartCourse?.course?.course_name ||
                    selectedEduSmartCourse?.course?.course_id}
                </div>
                <Tooltip title={"Click to Close"} arrow>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft10}`}
                    onClick={() => setShowEduSmartDialog(false)}
                  />
                </Tooltip>
              </div>
              <div className={`${style.marginTop10}`}>
                <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                  <div
                    className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}
                  >
                    <TableTwo
                      tableHeaderValues={eduSmartCompletionHeaderValues}
                      tableDataValues={getEduSmartCompletionTableValues()}
                      tableData={selectedEduSmartCourse?.completions || []}
                      gridStyle={style.eduSmartStaffAndDeptGrid}
                      tableSortValues={eduSmartCompletionColSortValues}
                      heading={
                        "There are no completion records available for this course"
                      }
                      onClickFunction={() => { }}
                      actions={[]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the actual file input
      />
      <input
        type="file"
        ref={fileInputRefForNew}
        onChange={handleFileUpload}
        style={{ display: "none" }} // Hide the actual file input
      />
      {/* {
            showViewAndVerifyScreen && (
            <ViewandVerifyScreen
                getActiveApplicationView={getActiveApplicationView}
            />
            )
        } */}
    </>
  )
}

export default ApplicantDetailsViewScreen;
