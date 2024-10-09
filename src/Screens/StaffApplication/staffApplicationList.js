import React, {
  useState,
  useEffect,
  createRef,
  useCallback,
  useRef,
} from "react";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import TimeSmartLogo from "./../../images/timeSmartAI-logo-withoutbg.png";
import StaffApplicationTiles from "./staffApplicationTiles";
import StaffApplicationTopTiles from "./staffApplicationTopTiles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import TableTwo from "../../Components/TableDesignTwo";
import PublicIcon from "@mui/icons-material/Public";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import style from "./index.module.scss";
import SideBar from "../../Components/Sidebar";
import ProgressBar from "@ramonak/react-progress-bar";
import ApplicationRejection from "./applicationRejectionDialog";
import { useNavigate } from "react-router-dom";
import { GET, PUT, POST, TenantID } from "../dataSaver";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import CheckListDialog from "./checkListDialog";

const StaffApplicationList = ({
  isLoading,
  getSelectedTab,
  selectedTab,
  getActiveApplicationView,
  getActiveApplicationTask,
}) => {
  const PDFRef = createRef();
  const navigate = useNavigate();
  const componentRef = useRef(null);

  const [rejectionTab, setRejectionTab] = useState("rejected");
  const [requestAppointment, setRequestAppointment] = useState(null);
  const [sentCompletion, setSentCompletion] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCardAppointment, setShowCardAppointment] = useState(false);
  const [showCardCompletion, setShowCardCompletion] = useState(false);

  const [applicationRejected, setApplicationRejected] = useState({
    totalRejections: 0,
    appointmentRequestsDenied: 0,
    applicationsRejected: 0,
    applicationsApprovedButDenied: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [rejectionListData, setRejectionListData] = useState([]);

  const applicantHeaderValues = [
    "",
    "Applicant Name",
    "Applicant ID",
    "Applicant Type",
    // "Department",
    "DOCS",
    // "Data & Disclosures",
    "CRs",
    "Notes",
    "Task list Status",
    "Last Updated",
    "Action",
  ];
  const applicationHeaderValues = [
    "",
    "Applicant Name",
    "Applicant Id",
    "Applicant Type",
    // "Department",
    // "Commitee",
    // "Board",
    // "CEO",
    "CR",
    "COS",
    "CC",
    "CC Date",
    "Last Updated",
    "Action",
  ];
  const macHeaderValues = [
    "Applicant Name",
    "Applicant ID",
    "Applicant Type",
    "CC Approval",
    "COS Approval",
    "Tasklist Status",
    "Last Updated",
    "Action",
  ];
  const bodHeaderValues = [
    "Applicant Name",
    "Applicant ID",
    "Applicant Type",
    // "Ref",
    "MAC Approval",
    "Task list Status",
    "Last Updated",
    "Action",
  ];
  const clarificationHeaderValues = [
    "",
    "Applicant Name",
    "Type",
    "Clarification Title",
    "Raised By",
    "Created On",
    "Last Updated On",
    "Action",
  ];

  const rejectedHeaderValues = [
    "",
    "Applicant Name",
    "Applicant ID",
    "Applicant Type",
    // "Department",
    "Docs",
    // "Data & Disclosures",
    "CRs",
    "Notes",
    "Task list Status",
    "Last Updated",
    "Action",
  ];
  const approvedHeaderValues = [
    "",
    "Applicant Name",
    "Type",
    "Notes",
    "Last Updated On",
    "Actions",
  ];
  const reappointmentValues = [
    "",
    "Applicant Name",
    "Applicant Type",
    "Department",
    "Docs",
    "Data & Disclosures",
    "CRs",
    "Notes",
    "Last Updated",
    "Actions",
  ];

  const applicantColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const applicationColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const macColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const bodColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const clarificationColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const rejectedColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const approvedColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  const reappointmentColSortValues = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] =
    useState(false);
  const [showCheckListDialog, setShowCheckListDialog] = useState(false);

  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected");
  };

  const getCheckListDialog = (value) => {
    setShowCheckListDialog(value);
  };

  const onClickViewAndVerifyFunction = (data) => {
    getActiveApplicationView(true);
    sessionStorage.setItem("applicationId", data?.id);
  };
  const onClickProcessingTaskFunction = (data) => {
    getActiveApplicationTask(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  useEffect(() => {
    getSentConfirmationCount();
    // getRequestAppointmentCount();
    getRejectionCounts();
  }, []);

  useEffect(() => {
    getWorkflowUserData(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    getRejectionData(rejectionTab);
  }, [rejectionTab, showApplicationRejectionDialog]);

  const handleIconClick = () => {
    setShowCardDetails((prev) => !prev);
  };

  const getWorkflowUserData = async () => {
    try {
      const response = await GET(
        `application-management-service/application/workflowUser?tab=${selectedTab}`
      );
      console.log("Application data", response?.data.applications);
      setTableData(response?.data?.applications);
      return response?.data.applications || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  console.log("rejectionTab", rejectionTab);

  const getRejectionData = async () => {
    try {
      const response = await GET(
        `application-management-service/application/workflowUser?tab=${rejectionTab}`
      );
      console.log("Rejection data", response?.data?.applications);
      setRejectionListData(response?.data?.applications);
      return response?.data.applications || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getSentConfirmationCount = async () => {
    await GET(
      "application-management-service/application/sentToApplicant/status"
    )
      .then((response) => {
        setSentCompletion(response?.data || null);
        setShowCardCompletion(
          response?.data?.applicationsStatus?.length > 0 ? true : false
        );
        console.log("sentCompletion", response?.data);
      })
      .catch((error) => {
        console.error("Error fetching request appointment count:", error);
      });
  };

  // const getRequestAppointmentCount = async () => {
  //   await GET("application-management-service/preApplication")
  //     .then((response) => {
  //       setRequestAppointment(response?.data.numberOfElements || 0);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching request appointment count:", error);
  //     });
  // };

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrintClick = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Staff Application",
    removeAfterPrint: true,
  });

  const getRejectionCounts = async () => {
    await GET("application-management-service/application/rejected/meta")
      .then((response) => {
        setApplicationRejected(response?.data);
        setShowCardDetails(
          response?.data?.applicationsRejected > 0 ||
            response?.data?.applicationsApprovedButDenied > 0
            ? true
            : false
        );
      })
      .catch((error) => {
        console.error("Error fetching rejection counts:", error);
      });
  };

  let dot = [];
  let dotTooltipValues = [];
  let lastUpdated = [];
  let action = [];
  let applicantName = [];
  let applicantId = [];
  let applicantType = [];
  let docs = [];
  let docsHoverText = [];
  let docsIcon = [];
  let dataStatus = [];
  let disclosures = [];
  let crs = [];
  let crsHoverText = [];
  let notes = [];
  let notesHoverText = [];
  let notesIcon = [];
  let capManager = [];
  let department = [];
  let commiteeStatus = [];
  let boardStatus = [];
  let ceoStatus = [];
  let lastUpdatedOn = [];
  let lastUpdatedBy = [];
  let clarificationTitle = [];
  let raisedBy = [];
  let createdOn = [];
  let approvedNotes = [];
  let cr = [];
  let cos = [];
  let cc = [];
  let ccapproval = [];
  let cosapproval = [];
  let ref = [];
  let taskListStatus = [];
  let macapproval = [];
  let checkListStatus = [];
  let ccdate = [];

  const getApplicantValues = () => {
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
    // disclosures = [];
    crs = [];
    crsHoverText = [];
    notes = [];
    notesHoverText = [];
    notesIcon = [];
    lastUpdated = [];
    lastUpdatedBy = [];
    capManager = [];
    taskListStatus = [];
    action = [];

    tableData?.map((data) => {
      dot.push(
        data?.status === "SUBMITTED"
          ? "yellow"
          : data?.status === "APPROVED"
            ? "green"
            : "grey"
      );
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      docs.push(data?.documents?.uploadedCount|| "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      const docHoverTextArray = documentDetails.length > 0 ? documentDetails.map(doc => doc.documentType): ["-"];
      docsHoverText.push(docHoverTextArray);
      docsIcon.push(
        <TextSnippetOutlinedIcon
          style={{ fontSize: 20, color: `${data?.subStatus}` }}
        />
      );
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      crs.push(data?.clarificationRequiredFor || "-");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      // notes.push(data?.clarificationRequiredFor || "1");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#52575D` }} />
      );
      const notesDetails = data?.notes || [];
      const notesHoverTextArray = notesDetails.length > 0 ? notesDetails.map(note => note.notes): ["-"];
      // notesHoverText.push([
      //   "June 13 00:00, Nina Grealy",
      //   "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      // ]);
      notesHoverText.push(notesHoverTextArray);
      taskListStatus.push(data?.tasks.completedCount + "/" + data?.tasks.totalCount);
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      lastUpdatedBy.push(["-"]);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department },
      {
        type: "iconWithCount",
        value: docs,
        hoverText: docsHoverText,
        isShowHoverText: true,
        icon: docsIcon,
      },
      // { type: "dot", value: dataStatus },
      // { "type": "iconWithCount", "value": disclosures, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
      {
        type: "countWithHover",
        value: crs,
        hoverText: crsHoverText,
        isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        // value: notes,
        hoverText: notesHoverText,
        isShowHoverText: true,
        icon: notesIcon,
      },
      { type: "iconWithCount", value: taskListStatus },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getApplicationValues = () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    applicantId = [];
    // department = [];
    // commiteeStatus = [];
    // boardStatus = [];
    // ceoStatus = [];
    cr = [];
    cos = [];
    cc = [];
    ccdate = [];
    lastUpdatedOn = [];

    action = [];

    tableData?.map((data) => {
      dot.push(
        data?.status === "REVIEW_INPROGRESS"
          ? "yellow"
          : data?.status === "APPROVED"
            ? "green"
            : "grey"
      );
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      applicantType.push(data?.providerType.serviceProviderType);
      applicantId.push(data?.displayId);
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      // commiteeStatus.push(data?.commiteeStatus || "yellow");
      // boardStatus.push(data?.boardStatus || "green");
      // ceoStatus.push(data?.ceoStatus || "grey");
      cr.push(data?.clarificationRequiredFor || "-");
      // cr.push(data?.logs[data.logs.length - 1]?.role)
      // cos.push(data?.boardStatus || "green");
      // cos.push(data?.logs[data.logs.length - 1].workflowAction === "SUBMITTED"
      //   ? "yellow"
      //   : data?.logs[data.logs.length - 1].workflowAction === "APPROVED"
      //   ? "green"
      //   : "grey");
      if (data?.logs[data.logs.length - 1]?.role === "Chief Of Staff") {
        if (data.logs[data.logs.length - 1].workflowAction === "SUBMITTED") {
          cos.push("yellow");
        } else if (data.logs[data.logs.length - 1].workflowAction === "APPROVED") {
          cos.push("green");
        }
      }
      else {
        cos.push("grey"); // If the role is not "Chief of Staff"
      }
      // cc.push(data?.ceoStatus || "grey");
      if (data?.logs[data.logs.length - 2]?.role === "Credentialing Committee") {
        if (data.logs[data.logs.length - 2].workflowAction === "SUBMITTED") {
          cc.push("yellow");
        } else if (data.logs[data.logs.length - 2].workflowAction === "APPROVED") {
          cc.push("green");
        }
      }
      else {
        cc.push("grey"); // If the role is not "Chief of Staff"
      }
      if (data?.logs[data.logs.length - 2]?.role === "Credentialing Committee") {
        ccdate.push(
          format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
        )
      } else { ccdate.push("-") }
      lastUpdatedOn.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      // lastUpdatedBy.push([data?.updatedBy || "-"]);
      action.push(true);
    });

    return [
      { type: "dot", value: dot },
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },

      // { type: "text", value: department },
      // { type: "dot", value: commiteeStatus },
      // { type: "dot", value: boardStatus },
      // { type: "dot", value: ceoStatus },

      { type: "text", value: cr },
      { type: "dot", value: cos },
      { type: "dot", value: cc },
      {
        type: "iconWithCount",
        value: ccdate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        value: lastUpdatedOn,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getMacValues = () => {
    applicantName = [];
    applicantId = [];
    applicantType = [];
    ccapproval = [];
    cosapproval = [];
    taskListStatus = [];
    lastUpdated = [];
    action = [];

    tableData?.map((data) => {
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      // ccapproval.push(data?.ccapproval || "05/05/2024");
      // ccapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      if (data?.logs[data.logs.length - 1]?.role === "Credentialing Committee") {
        ccapproval.push(
          format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
        )
      } else { ccapproval.push("-") }
      // cosapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      if (data?.logs[data.logs.length - 2]?.role === "Chief Of Staff") {
        cosapproval.push(
          format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
        )
      } else { cosapproval.push("-") }
      taskListStatus.push(data?.tasks.completedCount + "/" + data?.tasks.totalCount);
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      lastUpdatedBy.push(["-"]);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: ccapproval },
      { type: "text", value: cosapproval },
      { type: "text", value: taskListStatus },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getBodValues = () => {
    applicantName = [];
    applicantId = [];
    applicantType = [];
    // ref = [];
    macapproval = [];
    taskListStatus = [];
    lastUpdated = [];
    action = [];

    tableData?.map((data) => {
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      applicantId.push(data?.displayId);
      applicantType.push(data?.providerType.serviceProviderType);
      ref.push(data?.ref || "-");
      // macapproval.push(data?.macapproval || "05/05/2024");
      // macapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      if (data?.logs[data.logs.length - 1]?.role === "Advisory Committee") {
        macapproval.push(
          format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
        )
      } else { macapproval.push("-") }
      taskListStatus.push(data?.tasks.completedCount + "/" + data?.tasks.totalCount);
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: ref },
      { type: "text", value: macapproval },
      { type: "text", value: taskListStatus },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getClarificationValues = () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    clarificationTitle = [];
    raisedBy = [];
    createdOn = [];
    lastUpdatedOn = [];
    action = [];

    tableData?.map((data) => {
      dot.push(data?.subStatus || "green");
      applicantName.push(
        `${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` ||
        ""
      );
      applicantType.push(data?.providerType.serviceProviderType);
      clarificationTitle.push(data?.title);
      raisedBy.push(data?.raisedBy);
      createdOn.push(data?.createdOn);
      lastUpdatedOn.push(data?.lastUpdatedOn);
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      { type: "text", value: applicantType },
      { type: "text", value: clarificationTitle },
      { type: "text", value: raisedBy },
      { type: "text", value: createdOn },
      { type: "text", value: lastUpdatedOn },
      { type: "action", value: action },
    ];
  };

  const getRejectedValues = () => {
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
    // disclosures = [];
    crs = [];
    crsHoverText = [];
    notes = [];
    notesHoverText = [];
    notesIcon = [];
    lastUpdated = [];
    lastUpdatedBy = [];
    capManager = [];
    taskListStatus = [];
    action = [];

    tableData?.map((data) => {
      dot.push(
        data?.status === "REVIEW_INPROGRESS"
          ? "yellow"
          : data?.status === "APPROVED"
            ? "green"
            : "grey"
      );
      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      applicantId.push(data?.applicant?.id);
      applicantType.push(data?.providerType.serviceProviderType);
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      docs.push(data?.documents?.uploadedCount || "2/8");
      docsHoverText.push([
        "Immunization History Verification From PCP pending",
      ]);
      docsIcon.push(
        <TextSnippetOutlinedIcon
          style={{ fontSize: 20, color: `${data?.subStatus}` }}
        />
      );
      // dataStatus.push(data?.dataStatus || "green");
      // disclosures.push(data?.disclosures || '7/9');
      crs.push(data?.clarificationRequiredFor || "-");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push(data?.notes || "1");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#52575D` }} />
      );
      notesHoverText.push([
        "June 13 00:00, Nina Grealy",
        "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      ]);
      taskListStatus.push(data?.taskListStatus || "2/10");
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      lastUpdatedBy.push([data?.updatedBy?.name?.firstName || '-']);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department },
      {
        type: "iconWithCount",
        value: docs,
        hoverText: docsHoverText,
        isShowHoverText: true,
        icon: docsIcon,
      },
      // { type: "dot", value: dataStatus },
      // { "type": "iconWithCount", "value": disclosures, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
      {
        type: "countWithHover",
        value: crs,
        hoverText: crsHoverText,
        isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        value: notes,
        hoverText: notesHoverText,
        isShowHoverText: true,
        icon: notesIcon,
      },
      { type: "text", value: taskListStatus },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  };

  const getApprovedValues = () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    approvedNotes = [];
    lastUpdatedOn = [];
    action = [];

    tableData?.map((data) => {
      dot.push(data?.subStatus);
      applicantName.push(
        `${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` ||
        ""
      );
      applicantType.push(data?.providerType.serviceProviderType);
      approvedNotes.push(data?.approvedNotes);
      lastUpdatedOn.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      { type: "text", value: applicantType },
      { type: "text", value: approvedNotes },
      { type: "text", value: lastUpdatedOn },
      { type: "action", value: action },
    ];
  };

  const applicantActionsData = [
    {
      data: "View & Verify",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyFunction,
    },
    {
      data: "Send for Cred Comm Review",
      requiredValue: "boolean",
      onClick: "",
    },
    {
      data: "Applicant Processing Tasks",
      requiredValue: "boolean",
      onClick: onClickProcessingTaskFunction,
      //  onClick: onClickViewAndVerifyFunction,
    },
    {
      data: "Request For Clarification",
      requiredValue: "boolean",
      isParagraph: true,
    },
    { data: "From Applicant", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true },
  ];

  const applicationActionsData = [
    // { data: "View & Verify", requiredValue: "boolean", onClick: "" },
    // {
    //   data: "Send for Committee Review",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Request for Clarification",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // { data: "From Applicant", requiredValue: "boolean", onClick: "" },
    // { data: "From Internal Approver", requiredValue: "boolean", onClick: "" },
    // { data: "From Institution", requiredValue: "boolean", onClick: "" },
    { data: "Review & Approve", requiredValue: "boolean", onClick: "" },
    { data: "Move to MAC", requiredValue: "boolean", onClick: "" },
    {
      data: "Request For Clarification",
      requiredValue: "boolean",
      isParagraph: true,
    },
    {
      data: "From staff manager",
      requiredValue: "boolean",
      onClick: "",
      isIndent: true
    },
    { data: "From Applicant", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true },
  ];

  const macActionsData = [
    // {
    //   data: "View & Verify",
    //   requiredValue: "boolean",
    //   onClick: onClickViewAndVerifyFunction,
    // },
    // {
    //   data: "Send for Committee Review",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Request for Clarification",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    { data: "Move to BOD", requiredValue: "boolean", onClick: "" },
    {
      data: "Request For Clarification",
      requiredValue: "boolean",
      isParagraph: true,
    },
    { data: "MAC Approval", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "Print Summary For MAC", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "Applicant Processing Tasks", requiredValue: "boolean", onClick: "", isIndent: true },
  ];

  const bodActionsData = [
    // {
    //   data: "View & Verify",
    //   requiredValue: "boolean",
    //   onClick: onClickViewAndVerifyFunction,
    // },
    // {
    //   data: "Send for Committee Review",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Request for Clarification",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    { data: "BOD Approval Status", requiredValue: "boolean", onClick: "" },
    { data: "Print Summary For BOD", requiredValue: "boolean", onClick: "" },
    { data: "Applicant Processing Tasks", requiredValue: "boolean", onClick: "" },
  ];
  const clarificationActionsData = [
    { data: "View & Verify", requiredValue: "boolean", onClick: "" },
    {
      data: "Send for Committee Review",
      requiredValue: "boolean",
      onClick: "",
    },
    {
      data: "Request for Clarification",
      requiredValue: "boolean",
      onClick: "",
    },
    { data: "From Applicant", requiredValue: "boolean", onClick: "" },
    { data: "From Internal Approver", requiredValue: "boolean", onClick: "" },
    { data: "From Institution", requiredValue: "boolean", onClick: "" },
  ];

  const rejectedActionsData = [
    // {
    //   data: "View & Verify",
    //   requiredValue: "boolean",
    //   onClick: onClickViewAndVerifyFunction,
    // },
    // {
    //   data: "Send for Committee Review",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Request for Clarification",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    { data: "MAC Approval", requiredValue: "boolean", onClick: "" },
    { data: "Print Summary For MAC", requiredValue: "boolean", onClick: "" },
    { data: "Applicant Processing Tasks", requiredValue: "boolean", onClick: "" },
  ];

  const approvedActionsData = [
    {
      data: "Add as active staff",
      requiredValue: "boolean",
      onClick: () => {
        setShowCheckListDialog(true);
      },
    },
    {
      data: "Send follow up disclosures",
      requiredValue: "boolean",
      onClick: () => { },
    },
  ];

  const reappointmentActionsData = [];

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  let tableHeaderValues =
    selectedTab === "applicantsToProcess"
      ? applicantHeaderValues
      : selectedTab === "level-1"
        ? applicationHeaderValues
        : selectedTab === "mac"
          ? macHeaderValues
          : selectedTab === "bod"
            ? bodHeaderValues
            : selectedTab === "clarifications"
              ? clarificationHeaderValues
              : selectedTab === "rejected"
                ? rejectedHeaderValues
                // :[];

                // : approvedHeaderValues;
                : applicantHeaderValues;
  let tableSortValues =
    selectedTab === "applicantsToProcess"
      ? applicantColSortValues
      : selectedTab === "level-1"
        ? applicationColSortValues
        : selectedTab === "mac"
          ? macColSortValues
          : selectedTab === "bod"
            ? bodColSortValues
            : selectedTab === "clarifications"
              ? clarificationColSortValues
              : selectedTab === "rejected"
                ? rejectedColSortValues
                // :[];

                // : approvedColSortValues;
                : applicantColSortValues;
  let tableDataValues =
    selectedTab === "applicantsToProcess"
      ? getApplicantValues()
      : selectedTab === "level-1"
        ? getApplicationValues()
        : selectedTab === "mac"
          ? getMacValues()
          : selectedTab === "bod"
            ? getBodValues()
            : selectedTab === "clarifications"
              ? getClarificationValues()
              : selectedTab === "rejected"
                ? getRejectedValues()
                // :[];

                // : getApprovedValues();
                : getApplicantValues();
  let actions =
    selectedTab === "applicantsToProcess"
      ? applicantActionsData
      : selectedTab === "level-1"
        ? applicationActionsData
        : selectedTab === "mac"
          ? macActionsData
          : selectedTab === "bod"
            ? bodActionsData
            : selectedTab === "clarifications"
              ? clarificationActionsData
              : selectedTab === "rejected"
                ? rejectedActionsData
                // :[];

                // : approvedActionsData;
                : applicantActionsData;
  let gridStyle =
    selectedTab === "applicantsToProcess"
      ? style.applicantStaffGrid
      : selectedTab === "level-1"
        ? style.applicationStaffGrid
        : selectedTab === "mac"
          ? style.macStaffGrid
          : selectedTab === "bod"
            ? style.bodStaffGrid
            : selectedTab === "clarifications"
              ? style.clarificationStaffGrid
              : selectedTab === "rejected"
                ? style.rejectedStaffGrid
                // :[];

                // : style.approvedStaffGrid;
                : style.applicantStaffGrid;

  return (
    <div className={style.margin20}>
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <div
              className={`${style.addStyle}  ${style.applicationButton} ${style.spaceBetween} ${style.marginTop10} ${style.alignCenter} ${style.cursorPointer} ${style.cardStyle}`}
            >
              <div
                className={`${style.displayInRow} ${style.marginLeftRight10} `}
                onClick={() => navigate("/createStaffMemberApplication")}
              >
                CREATE NEW APPLICATION
              </div>
              <div className={`${style.displayInRow} ${style.marginLeft20} `}>
                <AddCircleOutlineIcon sx={{ fontSize: 20, color: "white" }} />
              </div>
            </div>

            {/* <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Requests For Appointment ({requestAppointment})
                </div>
                <div className={`${style.marginLeft10} `} >
                  {!showCardAppointment ? (
                    <AddIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardAppointment(!showCardAppointment)} />
                  ) : (
                    <RemoveIcon sx={{ fontSize: 20, color: '#7165E3', cursor: 'pointer' }} onClick={() => setShowCardAppointment(!showCardAppointment)} />
                  )}
                </div>
              </div>
              {showCardAppointment && (<>
                <div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Dave FILIP <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px proxima-nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #14B15A",
                          color: "#14B15A"
                        }}> +1 Day</span> </p> <span>
                        <PermIdentityIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Dave FILIP <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px proxima-nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #FEC106",
                          color: "#FEC106"
                        }}> +1 Day</span> </p> <span>
                        <PublicIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                  <div className={`${style.displayInCol} ${style.marginTop}`}>
                    <div className={`${style.warningTextAlign} ${style.staffTextStyle} ${style.marginRight10}`}>
                      <p className={style.staffPragraphStyle}>Anna KARIN <span style={{
                        color: "#52575D",
                        font: "normal normal bold 16px/24px proxima-nova"
                      }}> (Doctor) </span> <span className={style.dayTextStyle}
                        style={{
                          border: "0.4px solid #F94848",
                          color: "#F94848"
                        }}> +1 Day</span> </p> <span>
                        <PublicIcon sx={{ fontSize: 20, color: '#7165E3', marginRight: "5px" }} />
                      </span>
                    </div>
                  </div>
                </div>
              </>)}
            </div> */}

            <div
              className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}
            >
              <div
                className={`${style.spaceBetween}  ${style.marginLeftRight10}`}
              >
                <div
                  className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}
                >
                  Sent for Completion{" "}
                  <span
                    className={`${style.numberBackground} ${style.marginLeft} ${style.yellowSmallNumberSelected}`}
                  >
                    {sentCompletion?.totalApplicationsSent || 0}
                  </span>
                </div>
                <div className={`${style.marginLeft10} `}>
                  {!showCardCompletion ? (
                    <AddIcon
                      sx={{ fontSize: 20, color: "#7165E3", cursor: "pointer" }}
                      onClick={() => setShowCardCompletion(!showCardCompletion)}
                    />
                  ) : (
                    <RemoveIcon
                      sx={{ fontSize: 20, color: "#7165E3", cursor: "pointer" }}
                      onClick={() => setShowCardCompletion(!showCardCompletion)}
                    />
                  )}
                </div>
              </div>

              {showCardCompletion && (
                <div
                  style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "gray transparent",
                  }}
                >
                  {sentCompletion?.applicationsStatus?.map((status, index) => (
                    <div
                      key={index}
                      className={`${style.displayInCol} ${style.marginTop}`}
                    >
                      <div
                        className={`${style.warningTextAlign} ${style.staffTextStyle}`}
                      >
                        <div className={style.progressbarStyle}>
                          <div className={style.spaceBetween}>
                            <div className={style.statisticsProgress}>
                            <div className={status?.status === "SUBMITTED" ? style.yellowDotStyle : status?.status === "APPROVED" ? style.greenDotStyle : style.greyDotStyle}></div>

                              <div
                                className={style.marginLeft10}>
                                  {/* {`${status?.basicDetail?.applicant?.name?.firstName} ${status.basicDetail.applicant.name.lastName}`} */}
                                  {status?.basicDetail?.applicant?.name?.firstName.charAt(0).toUpperCase() + status?.basicDetail?.applicant?.name?.firstName.slice(1).toLowerCase()}, {status.basicDetail.applicant.name.lastName.toUpperCase()}
                                  </div>

                              {/* <span className={style.textStyleProgress}> ({status.providerType.serviceProviderType}) </span> */}

                            </div>
                            <div
                              className={`${style.smallTextStyle} ${style.justifyCenter}`}
                            >

                              {/* {`${status.basicDetail.applicant.startDate}`} */}
                              {status.basicDetail.applicant.startDate
                                ? format(
                                  new Date(
                                    status.basicDetail.applicant.startDate
                                  ),
                                  "MMM dd, yyyy"
                                )
                                : "N/A"}

                            </div>
                            {/* <p className={style.progressTopText}>
                              {" "}
                              Due in {status.dueDays} Days{" "}
                            </p> */}
                          </div>
                          <ProgressBar
                            completed={
                              100 - status.remainingCompletionPercentage
                            }
                            isLabelVisible={false}
                            height="5px"
                            bgColor="#7165E3"
                            baseBgColor="#E9E9F0"
                            className={style.marginLeft20}
                          />
                          <div className={style.spaceBetween}>
                            <span className={style.textStyleProgress}>
                              {/* <span className={style.textalign}> */}{" "}
                              {status?.providerType?.serviceProviderType}{" "}
                            </span>
                            {/* <div className={style.progressBottomText}>
                              {status.remainingCompletionPercentage}% remaining
                            </div> */}
                            <p className={style.progressTopText}>
                              {" "}
                              Due in {status.dueDays} Days{" "}
                            </p>
                          </div>
                          {/* <div className={style.progressBottomText}>{status.remainingCompletionPercentage}% remaining</div> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}
            >
              <div
                className={`${style.spaceBetween}  ${style.marginLeftRight10}`}
              >
                <div
                  className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}
                >
                  Rejected / Declined{" "}
                  <span
                    className={`${style.numberBackground} ${style.marginLeft} ${style.redSmallNumberSelected}`}
                  >
                    {applicationRejected.totalRejections}
                  </span>
                </div>
                <div className={`${style.marginLeft10} `}>
                  {!showCardDetails ? (
                    <AddIcon
                      sx={{ fontSize: 20, color: "#7165E3", cursor: "pointer" }}
                      onClick={() => setShowCardDetails(!showCardDetails)}
                    />
                  ) : (
                    <RemoveIcon
                      sx={{ fontSize: 20, color: "#7165E3", cursor: "pointer" }}
                      onClick={() => setShowCardDetails(!showCardDetails)}
                    />
                  )}
                </div>
              </div>
              {showCardDetails && (
                <>
                  {/* <div className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}>
                    Appointment Requests Denied ({applicationRejected.appointmentRequestsDenied})
                  </div> */}
                  <div
                    className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                    onClick={() => {
                      setShowApplicationRejectionDialog(true);
                    }}
                  >
                    Applicants Rejected (
                    {applicationRejected.applicationsRejected})
                  </div>
                  <div
                    className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                  >
                    Approved But Declined (
                    {applicationRejected.applicationsApprovedButDenied})
                  </div>
                </>
              )}
            </div>
          </SideBar>
        </div>
        <div>
          <div
            className={`${style.displayInRow} ${style.spaceBetween} ${style.headingForStaffs} ${style.bottomTextStyle}`}
          >
            {`STAFF MANAGER >> APPLICATIONS`}
          </div>
          <div className={`${style.marginTop20}`}>
            <StaffApplicationTopTiles
              getSelectedTab={getSelectedTab}
              selectedTab={selectedTab}
            />
          </div>
          <div className={`${style.borderStyleTiles}`}></div>
          {/* <StaffApplicationTopTiles
              getSelectedTab={getSelectedTab}
              selectedTab={selectedTab}
            /> */}
          <div
            className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} `}
          >
            <StaffApplicationTiles
              getSelectedTab={getSelectedTab}
              selectedTab={selectedTab}
            />

            <div className={`${style.spaceBetween} ${style.marginLeft} `}>
              <div
                className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                  } ${style.cursorPointer} ${style.marginRight20}`}
              >
                <SearchOutlinedIcon
                  sx={{
                    fontSize: isPrintClicked ? 20 : 25,
                    color: isPrintClicked ? "#fff" : "#857AEF",
                  }}
                />
              </div>
              <div
                className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                  } ${style.cursorPointer} ${style.marginRight}`}
              >
                <PrintOutlinedIcon
                  sx={{
                    fontSize: isPrintClicked ? 20 : 25,
                    color: isPrintClicked ? "#fff" : "#857AEF",
                  }}
                  onClick={handlePrintClick}
                />
              </div>
            </div>
          </div>

          <div className={`${style.bigCardStyle}`}>
            {isLoading ? (
              <div
                className={`${style.verticalAlignCenter} ${style.justifyCenter}`}
              >
                <CircularProgress sx={{ color: "#7165E3" }} />
              </div>
            ) : (
              <div ref={componentRef} className={`${style.pagebreak}`}>
                <div
                  className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}
                  ref={PDFRef}
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
      <div className={style.spaceBetween}>
        <div className={`${style.displayInRow}`}>
          <p className={`${style.poweredBy} ${style.marginTop10}`}>
            Powered by - CAPSmart
          </p>
          {/* <img src={TimeSmartLogo} alt="footer" className={`${style.footerIconStyle} ${style.marginLeft10}`} /> */}
        </div>
        <p className={style.poweredBy}>© {new Date().getFullYear()} CAPSmart</p>
      </div>

      {showApplicationRejectionDialog && (
        <ApplicationRejection
          getApplicationRejectionDialog={getApplicationRejectionDialog}
          rejectionListData={rejectionListData}
          rejectedCount={applicationRejected.applicationsRejected}
        />
      )}
      {showCheckListDialog && (
        <CheckListDialog getCheckListDialog={getCheckListDialog} />
      )}
    </div>
  );
};

export default StaffApplicationList;
