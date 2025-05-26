import React, { useState, useEffect, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
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

const ApplicantDetailsViewScreen = ({ getApplicantDetailsViewScreen, isLoading}) => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const [form, setForm] = useState();
    const applicationId = sessionStorage.getItem("applicationId");
    const applicationType = sessionStorage.getItem('applicationCreationType') ?? 'REAPPOINTMENT';
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const workModeType = sessionStorage.getItem('workModeType')
    const [expandStates, setExpandStates] = useState({
        section1: false,
        section2: false,
        section3: false,
        section4: false,
        section5: false,
        section6: false,
        section7: false,
      });

    const documentHeaderValues = ["Document Type", "Document Name", "Requirement", "Expiration Date", "Last Updated", "Action"];
    const documentColSortValues = [false, false, false, false, false, , false];
    const appointmentHeaderValues = ["Appointment Cycle", <img src={CAPManagerSmallLogo} alt="img" className={style.LogoIcon} />, "Privilege Category", "Approved Privileges", "Notes","Doc","Approval Date", "Action"];
    const appointmentColSortValues = [false, false, false, false, false, , false, false, false];
    const MDHeaderValues = ["","Title", "", "MD ID", "Attestation Due Date", "Last Updated", "Action"];
    const MDColSortValues = [false, false, false, false, false, , false];

    const tableDataAppointment = [
    {
        appointmentCycle: "2025 - 2026",
        capManagerStatus: "IN_PROGRESS",
        privilegeCategory: "Active",
        approvedPrivileges: "1",
        notes: "2",
        docs: "1",
        approvalDate: "Apr 21, 2025"
    },
        {
        appointmentCycle: "2024 - 2025",
        capManagerStatus: "COMPLETED",
        privilegeCategory: "InActive",
        approvedPrivileges: "1",
        notes: "2",
        docs: "1",
        approvalDate: "Apr 21, 2025"
    },
        {
        appointmentCycle: "New Staff Appointment",
        capManagerStatus: "REJECTED",
        privilegeCategory: "Active",
        approvedPrivileges: "1",
        notes: "2",
        docs: "1",
        approvalDate: "Apr 21, 2025"
    },
    ];

    const MDtableData = [
    {
        status: "REJECTED",
        mdtitle: "Paediatric Emergency Department Asthma Care Pathway",
        currentStatus: "Revised",
        mdID: "650",
        AttestationDate: "Apr 21, 2025",
         lastUpdateDate: "Apr 21, 2025",
    },
    {
        status: "REJECTED",
        mdtitle: "Paediatric Emergency Department Asthma Care Pathway",
        currentStatus: "New",
        mdID: "654",
        AttestationDate: "Apr 21, 2025",
         lastUpdateDate: "Apr 21, 2025",
    },
    {
        status: "REJECTED",
        mdtitle: "Paediatric Emergency Department Asthma Care Pathway",
        currentStatus: "Revised",
        mdID: "658",
        AttestationDate: "Apr 21, 2025",
        lastUpdateDate: "Apr 29, 2025",
    },
    {
        status: "IN_PROGRESS",
        mdtitle: "Paediatric Emergency Department Asthma Care Pathway",
        currentStatus: "Revised",
        mdID: "658",
        AttestationDate: "Apr 10, 2025",
        lastUpdateDate: "Apr 10, 2025",
    },
    {
        status: "COMPLETED",
        mdtitle: "Paediatric Emergency Department Asthma Care Pathway",
        currentStatus: "New",
        mdID: "658",
        AttestationDate: "Apr 10, 2025",
        lastUpdateDate: "Apr 10, 2025",
    }
    ];

     const tableData = [
    {
        DocumentType: "Approval Letter",
        DocumentName: "BOD Approval Letter for 2025 - 2026 Reappointment",
        Requirement: "Required",
        ExpirationDate: "Apr 21, 2025",
        LastUpdated: "Apr 21, 2025"
    },
    {
        DocumentType: "Certificate",
        DocumentName: "N 95 Respiratory Fit",
        Requirement: "Required",
        ExpirationDate: "Apr 21, 2025",
        LastUpdated: "Apr 21, 2025"
    },
    {
        DocumentType: "Insurance",
        DocumentName: "Available",
        Requirement: "Required",
        ExpirationDate: "Apr 21, 2025",
        LastUpdated: "Apr 21, 2025"
    }
    ];

    const documentActionsData = [
    {
      data: "ViewDocs",
      requiredValue: "boolean",
    },
    {
      data: "EditDocs",
      requiredValue: "boolean",
    },
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

    const appointmentActionsData = [
    {
      data: "View Application",
      requiredValue: "boolean",
    },
    {
      data: "Print Application Details",
      requiredValue: "boolean",
    },
     {
      data: "Share Application Details",
      requiredValue: "boolean",
    },
     {
      data: "Download Details",
      requiredValue: "boolean",
    },
  ];

  let documentType = [];
  let expireDate = [];
  let requirementType = [];
  let documentName = [];
  let action = [];
  let lastUpdateDate =[];
  let appointmentCycle = [];
  let dot = [];
  let privilegeCategory = [];
  let approvedPrivileges = [];
  let notes = [];
  let notesIcon = [];
  let docs = [];
  let approvalDate = [];
  let title = [];
  let mdStatus = [];
  let mdID = [];
  let attestationDate = [];
  let dotTooltipValues = [];

  const getDocsTableValues = () => {
    documentType = [];
    expireDate = [];
    requirementType = [];
    documentName = [];
    action = [];
    lastUpdateDate =[];

    tableData?.map((data, index) => {
      documentType.push(`${data?.DocumentType}` || "Dentist");
      documentName.push(data?.DocumentName || "dd")
      requirementType.push(data?.Requirement)
      expireDate.push(
        format(new Date(data?.ExpirationDate), "MMM dd, yyyy")
      );
      lastUpdateDate.push(
        format(new Date(data?.LastUpdated), "MMM dd, yyyy")
      );
      action.push(true);
    });

    return [
      { type: "text", value: documentType },
      { type: "text", value: documentName },
      { type: "text", value: requirementType },
      { type: "text", value: expireDate },
      { type: "text", value: lastUpdateDate},
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

    tableDataAppointment?.map((data, index) => {
      appointmentCycle.push(`${data?.appointmentCycle}` || "Dentist");
      const color = data?.capManagerStatus === "IN_PROGRESS" ? "yellow"
          : data?.capManagerStatus === "COMPLETED" ? "green"
          : data?.capManagerStatus === "REJECTED" ? "red"
            : "grey";
        dot.push(color);
        dotTooltipValues.push(color === "yellow" ? "Application completed on CAPManager" : color === "green" ? "Application was manually entered by MSO" : color === "red" ? "Application not in CAPManager" :"" )
      privilegeCategory.push(data?.privilegeCategory)
      approvedPrivileges.push(data?.approvedPrivileges)
      notes.push(data?.notes)
      notesIcon.push(<NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />)
      docs.push(data?.docs)
      approvalDate.push(
        format(new Date(data?.approvalDate), "MMM dd, yyyy")
      );
      action.push(true);
    });

    return [
      { type: "text", value: appointmentCycle },
      { type: "dot", value: dot ,tooltipValue: dotTooltipValues},
      { type: "text", value: privilegeCategory },
      { type: "text", value: approvedPrivileges },
      { type: "iconWithCount", value: notes,icon: notesIcon, },
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
    lastUpdateDate =[];
    action = [];

    MDtableData?.map((data, index) => {
      const color = data?.status === "IN_PROGRESS" ? "yellow"
          : data?.status === "COMPLETED" ? "green"
          : data?.status === "REJECTED" ? "red"
            : "grey";
        dot.push(color);
        title.push(data?.mdtitle)
        mdStatus.push(data?.currentStatus)
      mdID.push(data?.mdID)
      attestationDate.push(
        format(new Date(data?.AttestationDate), "MMM dd, yyyy")
      );
        lastUpdateDate.push(
        format(new Date(data?.lastUpdateDate), "MMM dd, yyyy")
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
      { type: "action", value: action },
    ];
  };



    useEffect(() => {
        getPreApplication();
    }, [applicationId]);

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
    
    const setUserDetails = async () => {
        try {
          const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
          console.log("userdataaaa", JSON.stringify(userData));
          sessionStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      const onClose = () => {
      getApplicantDetailsViewScreen(false);
    };

     const lastModifiedDate = form?.lastModifiedDate;
     const lastModifiedDateFormat = lastModifiedDate ? format(new Date(lastModifiedDate), "MMM dd, yyyy") : "-";
     const ExpireDate = form?.tenure?.to
    ? new Date(form?.tenure?.to).toISOString().split('T')[0] + 'T00:00'
    : null;
    const formattedExpiringDate = ExpireDate ? format(new Date(ExpireDate), "MMM dd, yyyy") : "-";

     let tableHeaderValues = documentHeaderValues;
     let tableSortValues = documentColSortValues;
     let tableDataValues = getDocsTableValues();
     let actions = documentActionsData;
     let gridStyle = style.documentViewGrid;
     let tableAppointmentHeaderValues = appointmentHeaderValues;
     let tableAppointmentSortValues = appointmentColSortValues;
     let tableAppointmentDataValues = getAppointmentTableValues();
     let actionsAppointment = appointmentActionsData;
     let gridStyleAppointment = style.appointmntViewGrid;
     let tableMDHeaderValues = MDHeaderValues;
     let tableMDSortValues = MDColSortValues;
     let tableMDDataValues = getMDTableValues();
     let actionsMD = mDActionsData;
     let gridStyleMD = style.medicalDirectiveViewGrid;

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
            title={"Credentialing & Privileging Locum Staff Details"}
            close={true}
            closeClick={onClose}
            />
            <div className={`${style.marginLeftRight50} ${style.marginTop10}`}>
            <div
                className={`${style.headerTextStyle}`}
            >{`${workModeType} ${applicationType} DASHBOARD > APPLICATIONS >> ${
                form?.applicant?.name?.firstName !== undefined &&
                form?.applicant?.name?.lastName !== undefined
                ? formatFirstNameLastName(
                    form?.applicant?.name?.firstName,
                    form?.applicant?.name?.lastName,
                    )
                : "{First Name} {Last Name}"
            }`}</div>
            <div className={style.grid2to1}>
                <div>
                <div
                    className={`${style.cardLeftStyle}`}
                >
                    <div className={style.flex}>
                    <div className={`${style.photoBorderStyle}`}>
                        <img
                        src={form?.applicant?.profilePicture?.fileURL || UserLogo}
                        alt="Profile Picture"
                        className={style.profileImage}
                        />
                    </div>
                    <div className={`${style.spaceBetween} ${style.textAlignLeft}`}>
                        <div className={style.marginTop10}>
                        <span className={`${style.cardTextBoldStyle}`}>
                            {form?.applicant?.name?.firstName !== undefined &&
                            form?.applicant?.name?.lastName !== undefined
                            ? formatFirstNameLastName(
                                form?.applicant?.name?.firstName,
                                form?.applicant?.name?.lastName,
                                )
                            : "{First Name} {Last Name}"}{" "}
                        </span>
                        <div
                            className={`${style.cardTextNormalStyle} ${style.marginTop10}`}
                        >
                            {applicationType === "LOCUM" ? "Locum" : ""}{" "}
                            {form?.basicDetailReferences?.applicantType
                            ?.serviceProviderType || ""}
                            <span
                            className={`${style.cardTextNormalStyle} ${style.marginLeft10}`}
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
                            className={`${style.emailTextBoldStyle} ${style.marginTop10}`}
                        >
                            {form?.applicant?.mobileNumber
                            ? `+1 ${form?.applicant?.mobileNumber}`
                            : ""}
                            <span
                            className={`${style.emailTextBoldStyle} ${style.marginLeft10}`}
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
                        <div
                            className={`${style.marginTop10} ${style.twoColumnGridInner2}`}
                        >
                            <span className={style.rightAlignTextStyle}>
                            Last Updated:
                            </span>
                            <span
                            className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}
                            >
                            {lastModifiedDateFormat}
                            </span>
                        </div>
                        <div
                            className={`${style.twoColumnGridInner2} ${style.marginTop10}`}
                        >
                            <span className={style.rightAlignTextStyle}>
                            Expiration Date:
                            </span>
                            <span
                            className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}
                            >
                            {formattedExpiringDate}
                            </span>
                        </div>
                        <div
                            className={`${style.twoColumnGridInner2} ${style.marginTop10}`}
                        >
                            <span className={style.rightAlignTextStyle}>
                            Last Approved By BOD:
                            </span>
                            <span
                            className={`${style.leftAlignTextStyle} ${style.marginLeft10}`}
                            >
                            {formattedExpiringDate}
                            </span>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className={`${style.marginTop20}`}>
                  <div className={`${style.cardLeftStyle} ${style.padding30}`}>
                    <div className={`${style.spaceBetween} ${style.alignItemCenter}`}>
                    <div className={`${style.documentTextStyle}`}>
                        Document Vault
                        <span className={`${style.marginLeft10} ${style.documentSubHeadingStyle}`}>Only includes documents that have verified by the MSO</span>
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
                <CommonDivider />
                <div className={`${style.grip3} ${style.marginTop20}`}>
                    <div className={`${style.documentCurrentBackGround} ${style.spaceBetweenCol}`}>
                       <div className={`${style.innerTextDocumentStyle}`}>Current Documents </div>
                       <div className={`${style.countStyle}`}>5</div>
                    </div>
                    <div className={`${style.documentCurrentBackGround} ${style.spaceBetweenCol}`}>
                        <div className={`${style.innerTextDocumentStyle}`}>To Be Renewed  </div>
                        <div className={`${style.spaceBetween} ${style.alignSelfEnd}`}>
                          <div className={`${style.countStyleRed}`}>8</div>
                            <div>
                                <div className={`${style.requiredTextStyle}`}>Required <span className={`${style.marginLeft10} ${style.countStyleYellow}`}>3</span></div>
                                <div className={`${style.requiredTextStyle}`}>Recommended <span className={`${style.marginLeft10}  ${style.countStyleRed}`}>5</span></div>
                            </div>
                       </div>
                    </div>
                    <div className={`${style.documentCurrentBackGround} ${style.spaceBetweenCol}`}>
                        <div className={`${style.innerTextDocumentStyle}`}>Expired </div>
                        <div className={`${style.countStyleRed}`}>5</div>
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
                            tableData={tableData}
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
                </div>
                 <div className={`${style.marginTop20}`}>
                  <div className={`${style.cardLeftStyle} ${style.padding30}`}>
                    <div className={`${style.spaceBetween} ${style.alignItemCenter}`}>
                    <div className={`${style.documentTextStyle}`}>
                        <img src={CAPManagerSmallLogo} alt="img" className={style.LogoIcon} /> <span>Appointment History</span>
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
                            tableData={tableDataAppointment}
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
                </div>
                <div className={`${style.marginTop20}`}>
                  <div className={`${style.cardLeftStyle} ${style.padding30}`}>
                    <div className={`${style.spaceBetween} ${style.alignItemCenter}`}>
                    <div className={`${style.documentTextStyle}`}>
                        <img src={MDManager} alt="img" className={style.LogoIcon} /> <span>Medical Directives</span>
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
                <CommonDivider />
                <div className={`${style.grip3} ${style.marginTop20}`}>
                    <div className={`${style.documentCurrentBackGround} ${style.spaceBetweenCol}`}>
                       <div className={`${style.innerTextDocumentStyle}`}>Attested </div>
                       <div className={`${style.countStyle}`}>45</div>
                    </div>
                    <div className={`${style.documentCurrentBackGround} ${style.spaceBetweenCol}`}>
                        <div className={`${style.innerTextDocumentStyle}`}>To Review & Attest </div>
                        <div className={`${style.countStyleYellow}`}>5</div>
                    </div>
                    <div className={`${style.documentCurrentBackGround} ${style.spaceBetweenCol}`}>
                        <div className={`${style.innerTextDocumentStyle}`}>Attestations Past Due </div>
                        <div className={`${style.countStyleRed}`}>3</div>
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
                            tableData={MDtableData}
                            gridStyle={gridStyleMD}
                            actions={actionsMD}
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
                </div>
                </div>
                <div>
                    <div className={`${style.cardLeftStyle}`}>
                        <div className={`${style.displayInRow}${style.marginTop20}`}>
                            <div
                            className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20} ${style.alignItemCenter}`}
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
        </>
      )
}

export default ApplicantDetailsViewScreen;
