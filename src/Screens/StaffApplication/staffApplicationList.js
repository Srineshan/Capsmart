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
import CapSmartTransparent from "./../../images/capSmartTransparent.png";
import SearchIcon from "./../../images/search.png";
import HapiCare from "./../../images/PoweredHapiCare.png";
import StaffApplicationTiles from "./staffApplicationTiles";
import StaffApplicationTopTiles from "./staffApplicationTopTiles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
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
import ApplicationApprovedDeclined from "./applicationApprovedDecline";
import CCDateDialog from "../../Components/CCDateDialog";
import ApprovalBulkDialog from "../../Components/ApprovalWithoutNotesBulkDialog";
import { useNavigate, useParams } from "react-router-dom";
import { GET, PUT, POST, TenantID } from "../dataSaver";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import CheckListDialog from "./checkListDialog";
import CircleIcon from '@mui/icons-material/Circle';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import LoadingScreen from "../../Components/LoadingScreen";
// import Checkbox from '@mui/material/Checkbox';
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CommonDivider from "../../Components/CommonFields/CommonDivider";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
// import SearchIcon from '@mui/icons-material/Search';
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode, formatFirstNameLastName } from "../../utils/formatting";
import CommonSearchField from "../../Components/CommonFields/CommonSearchField";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Tooltip } from "@material-ui/core";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const StaffApplicationList = ({
  isLoading,
  getSelectedTab,
  selectedTab,
  // applicationCreationType,
  // getApplicationCreationType,
  getActiveApplicationView,
  getActiveApplicationTask,
  getNotesCommentBox,
  getNotesDialog,
  getClarificationRequestFromApplicantDialog,
  getReappointmentChangesCommentBox,
  getApprovalNotesCommentBoxDept,
  approvalnotesCommentsBoxDept,
  activeApplicationTask,
  getTitleCounts,
  showNotesDialog,
  getDeptTrackerDialog,
}) => {
  const PDFRef = createRef();
  const navigate = useNavigate();
  const componentRef = useRef(null);
  const { applicationTypeFromUrl, applicationId } = useParams()
  const [applicationIdToUse, setApplicationIdToUse] = useState(sessionStorage.getItem('applicationId'));
  const [rejectionTab, setRejectionTab] = useState("rejected");
  const [requestAppointment, setRequestAppointment] = useState(null);
  const [sentCompletion, setSentCompletion] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCardAppointment, setShowCardAppointment] = useState(false);
  const [showCardCompletion, setShowCardCompletion] = useState(false);
  const [showDepartmentCardStatus, setShowDepartmentCardStatus] = useState(false);
  const [applicationRejected, setApplicationRejected] = useState({
    totalRejections: 0,
    appointmentRequestsDenied: 0,
    applicationsRejected: 0,
    applicationsApprovedButDenied: 0,
  });
  const [tableData, setTableData] = useState([]);
  const [rejectionListData, setRejectionListData] = useState([]);
  const [declineListData, setDeclineListData] = useState([]);
  const [sortField, setSortField] = useState('SUBMITTED_DATE');
  const [sortValue, setSortValue] = useState('DESCENDING');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountDept, setTotalCountDept] = useState(0);
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const [users, setUsers] = useState();
  const [userRole, setUserRole] = useState('');
  const [applicationCreationType, setApplicationCreationType] = useState('NEW');
  const [checkedIds, setCheckedIds] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [applicationIsLocum, setApplicationIsLocum] = useState(() =>
    sessionStorage.getItem('isLocum') || false
  );
  const [workModeType, setWorkModeType] = useState(() =>
    sessionStorage.getItem("workModeType") || ''
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [filteredIds, setFilteredIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchTermForTable, setSearchTermForTable] = useState('');
  const [searchCount, setSearchount] = useState(0);
  const [reappointCount, setReappointCount] = useState(0);
  const [limit, setLimit] = useState(9999);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedServiceArea, setSelectedServiceArea] = useState("");
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartment)?.departmentName?.name;
  const selectedServiceAreaName =
    departmentList?.serviceAreas?.find(serviceArea =>
      serviceArea?.id === selectedServiceArea
    )?.name || "";

  // const handleSelectAllClick = () => {
  //   if (checkedIds?.length === tableData?.length) {
  //     // If all are already selected, deselect all
  //     setCheckedIds([]);
  //   } else {
  //     // Select all IDs
  //     const allIds = tableData.map(data => data.id);
  //     setCheckedIds(allIds);
  //   }
  //   // console.log("allIdsall" + checkedIds)
  // };
  console.log("SelectedDepartmentSplt", selectedDepartment, "service", selectedServiceArea, "name", selectedServiceAreaName)
  const handleSelectAllClick = () => {
    if (checkedIds?.length === tableData?.length) {
      setCheckedIds([]);
    } else {
      const allIds = tableData
        .filter(data =>
          data?.completedWorkflows?.some(workflow =>
            workflow?.role === "Credentialing Committee" && workflow?.status === "COMPLETED"
          )
        )
        .map(data => data.id);

      setCheckedIds(allIds);
    }
  };

  // const handleSelectAllClick = () => {
  //   if (checkedIds?.length === tableData?.length) {
  //     setCheckedIds([]);
  //   } else {
  //     let allIds = [];
  //     const currentDate = new Date(); // Get current date

  //     if (selectedTab === "level-3") {
  //       allIds = tableData
  //         ?.filter((data) =>
  //           data?.completedWorkflows?.some(
  //             (workflow) =>
  //               workflow?.role === "Credentialing Committee" &&
  //               workflow?.status === "COMPLETED"
  //           )
  //         )
  //         .map((data) => data.id);
  //     } else if (selectedTab === "level-4") {
  //       allIds = tableData
  //         ?.filter((data) =>
  //           data?.completedWorkflows?.some(
  //             (workflow) => {
  //               // If meetingDate exists, check if it's in the future; if null, also include
  //               if (workflow?.role === "Advisory Committee") {
  //                 if (!workflow.meetingDate) {
  //                   return true; // Include items with null meetingDate
  //                 }
  //                 const meetingDate = new Date(workflow.meetingDate);
  //                 return meetingDate < currentDate; 
  //               }
  //               return false;
  //             }
  //           )
  //         )
  //         .map((data) => data.id);
  //     } else if (selectedTab === "level-5") {
  //       allIds = tableData
  //         ?.filter((data) =>
  //           data?.completedWorkflows?.some(
  //             (workflow) => {
  //               // If meetingDate exists, check if it's in the future; if null, also include
  //               if (workflow?.role === "Board") {
  //                 if (!workflow.meetingDate) {
  //                   return true; // Include items with null meetingDate
  //                 }
  //                 const meetingDate = new Date(workflow.meetingDate);
  //                 return meetingDate < currentDate;
  //               }
  //               return false;
  //             }
  //           )
  //         )
  //         .map((data) => data.id);
  //     }   
  //     setCheckedIds(allIds);
  //   }
  // };

  const applicantHeaderValues = applicationType === "NEW" ? [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    // "Department",
    "Docs",
    // "Data & Disclosures",
    "CRs",
    "Notes",
    "Task list",
    "Last Updated",
    "",
  ] : [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    "Dept / Division & Specialty",
    // "Department",
    "Docs",
    // "Data & Disclosures",
    "CRs",
    "Notes",
    // "Task list",
    "Submitted",
    // "Last Updated",
    "",
  ]
  const departmentHeadHeaderValues = [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    "Dept / Division & Specialty",
    "Assign To",
    "Docs",
    "CRs",
    "Notes",
    // "Task list",
    // "Last Updated",
    ""
  ];

  const applicationHeaderValues = applicationType === "NEW" ? [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff Application ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type", ,
    // "Department",
    // "Commitee",
    // "Board",
    // "CEO",
    "CR",
    "COS",
    "CC",
    "CC Date",
    "Last Updated",
    "",
  ] : [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type", ,
    "Dept / Division & Specialty",
    // "Commitee",
    // "Board",
    // "CEO",
    "Assign To",
    "Docs",
    "CRs",
    "Notes",
    // "Dept. Head",
    // "Submitted",
    // "Last Updated",
    "",
  ];

  const credUserHeaderValues = [
    <CommonCheckBox
      size="medium"
      checked={checkedIds?.length === tableData?.length}
      onChange={handleSelectAllClick}
    />,
    // "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type", ,
    "Dept / Division & Specialty",
    // "Commitee",
    // "Board",
    // "CEO",
    "Assigned CC Member",
    "Review Status",
    "Notes",
    // "Dept. Head",
    // "Submitted",
    "Reviewed On",
    "CC Meeting Date",
    "",
  ];
  const macHeaderValues = applicationType === "NEW" ? [
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff Application ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    "CC Approval",
    "COS Approval",
    "Tasklist Status",
    "Last Updated",
    "",
  ] : [
    <CommonCheckBox
      size="medium"
      checked={checkedIds?.length === tableData?.length}
      onChange={handleSelectAllClick}
    />,
    // " ",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    "Dept / Division & Specialty",
    // "Ref",
    // "Docs",
    // "CRs",
    "Notes",
    "MAC Meeting Date",
    // "Task List",
    // "CC Status",
    "",
  ];
  const bodHeaderValues = applicationType === "NEW" ? [
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff Application ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    // "Ref",
    "MAC Approval",
    "Task list Status",
    "Last Updated",
    "",
  ] : [
    <CommonCheckBox
      size="medium"
      checked={checkedIds?.length === tableData?.length}
      onChange={handleSelectAllClick}
    />,
    // " ",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    "Dept / Division & Specialty",
    // "Docs",
    // "Ref",
    // "CRs",
    "Notes",
    "BOD Meeting Date",
    // "Task List",
    // "CC Status",
    // "MAC Status",
    "",
  ]
  const clarificationHeaderValues = applicationType === "NEW" ? [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    // "Department",
    "Docs",
    // "Data & Disclosures",
    "CRs",
    "Notes",
    "Task list",
    "Last Updated",
    "",
  ] : [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    // applicationType === "NEW" ? "Applicant ID" : "Staff ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    "Dept / Division & Specialty",
    // "Department",
    "Docs",
    // "Data & Disclosures",
    "CRs",
    "Notes",
    // "Task list",
    "Last Clarification Updated on",
    // "Last Updated",
    "",
  ];

  const rejectedHeaderValues = [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    applicationType === "NEW" ? "Applicant ID" : "Staff Application ID",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    // "Department",
    "Docs",
    // "Data & Disclosures",
    "CRs",
    "Notes",
    "Task list Status",
    "Last Updated",
    "Action",
  ];


  const locumHeaderValues = [
    "Locum Staff",
    "Locum ID",
    "Locum Type",
    "Privilege Category",
    "Expiration Date",
    "Days to Expiration",
    "Action",
  ];
  const approvedHeaderValues = [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    "Type",
    "Notes",
    "Last Updated On",
    "Actions",
  ];
  const reappointmentValues = [
    "",
    applicationType === "NEW" ? "Applicant Name" : "Staff for Reappointment",
    applicationType === "NEW" ? "Applicant Type" : "Staff Type",
    "Department",
    "Docs",
    "Data & Disclosures",
    "CRs",
    "Notes",
    "Last Updated",
    "Actions",
  ];

  const applicantColSortValues = applicationType === "NEW" ? [
    false,
    true,
    // true,
    true,
    false,
    false,
    false,
    false,
    true,
    false,
  ] : [
    false,
    true,
    // true,
    true,
    true,
    false,
    false,
    false,
    true,
    false
  ]

  const departmentHeadColSortValues = [
    false,
    true,
    // true,
    true,
    true,
    false,
    false,
    false,
    false,
    false
  ]

  const credUserColSortValues = [
    false,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    true,
    true,
    false
  ]
  const applicationColSortValues = applicationType === "NEW" ? [
    false,
    true,
    // true,
    true,
    false,
    false,
    false,
    false,
    false,
    true,
    false
  ] : [
    false,
    true,
    // true,
    true,
    true,
    true,
    false,
    false,
    false,
    false
  ];
  const macColSortValues = applicationType === "NEW" ? [
    true,
    // true,
    true,
    false,
    false,
    false,
    true,
    false
  ] : [
    false,
    true,
    // true,
    true,
    true,
    false,
    true,
    false,
    false
  ]
  const bodColSortValues = applicationType === "NEW" ? [
    true,
    // true,
    true,
    false,
    false,
    true,
    false,
  ] : [
    false,
    true,
    // true,
    true,
    true,
    false,
    true,
    false
  ]
  const clarificationColSortValues  = applicationType === "NEW" ? [
    false,
    true,
    // true,
    true,
    false,
    false,
    false,
    false,
    true,
    false,
  ] : [
    false,
    true,
    // true,
    true,
    true,
    false,
    false,
    false,
    false,
    false
  ];
  const rejectedColSortValues = [
    false,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    true,
    false,
  ];

  const locumColSortValues = [
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
  const [form, setForm] = useState();
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] =
    useState(false);
  const [showApplicationApprovedDeclineDialog, setShowApplicationApprovedDeclineDialog] =
    useState(false);
  const [showCCDateDialog, setShowCCDateDialog] = useState(false);
  const [showBulkApproveDialog, setShowBulkApproveDialog] = useState(false);
  const [showCheckListDialog, setShowCheckListDialog] = useState(false);
  const [reFetchMetaData, setReFetchMetaData] = useState(false);
  const [isApproved, setIsApproved] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showAssignee, setShowAssignee] = useState(true);
  // const [applicationCreationType, setApplicationCreationType] = useState('NEW');
  // const [applicationType, setApplicationType] = useState(() => 
  //   sessionStorage.getItem('applicationCreationType') || 'NEW'
  // );
  // const [counts, setCounts] = useState({
  //   chiefOfStaff: 0,
  //   credentialingCommittee: 0,
  //   mac: 0,
  //   bod: 0,
  //   'level-1' :0,
  //   'level-2' :0,
  // });

  const transformedOptions = departmentList?.flatMap((department) => {
    const departmentEntry = {
      value: department?.id,
      label: department?.departmentName?.name, // Department name without indentation
      type: 'department'
    };

    const serviceAreaEntries = department.serviceAreas?.map((serviceArea) => ({
      value: `${department.id}|${serviceArea.id}`,
      label: (
        <span className={style.marginLeft20}>
          {serviceArea?.name}
        </span>
      ),
      type: 'serviceArea'
    })) || [];

    return [departmentEntry, ...serviceAreaEntries]; // Include department first, then service areas
  }) || [];

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const [departmentId, serviceAreaId] = selectedValue.split("|");

    setSelectedDepartment(departmentId || "");
    setSelectedServiceArea(serviceAreaId || "");

    console.log("selectedDept", selectedValue)
  }

  useEffect(() => {
    sessionStorage.removeItem("applicationIdForDialog");
    getPreApplication();
  }, [])

  useEffect(() => {
    if (applicationId) {
      console.log(applicationId, 'applicationIdFromURL')
      sessionStorage.setItem("applicationId", applicationId);
      sessionStorage.setItem("applicationCreationType", applicationTypeFromUrl)
      showApplicationById(applicantId);
    }
  }, [applicationId])

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationIdToUse}`
    );
    setForm(basicForm)
  }

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const currentValue = sessionStorage.getItem('applicationCreationType');
  //     if (currentValue !== applicationType) {
  //       setApplicationType(currentValue);
  //     }
  //   }, 500);

  // }, [applicationType]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentValue = sessionStorage.getItem('applicationCreationType');
      const currentValue1 = sessionStorage.getItem('isLocum');
      if (currentValue !== applicationType) {
        setApplicationType(currentValue);
      }
      if (currentValue1 !== applicationIsLocum) {
        setApplicationIsLocum(currentValue1);
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [applicationType, applicationIsLocum]);

  useEffect(() => {
    if (isDataLoaded) {
      // Once data is loaded, set all IDs as checked
      const allIds = tableData
        .filter(data =>
          data?.completedWorkflows?.some(workflow =>
            workflow?.role === "Credentialing Committee" && workflow?.status === "COMPLETED"
          )
        )
        .map(data => data.id);
      setCheckedIds(allIds);
    }
  }, [isDataLoaded, tableData]);

  useEffect(() => {
    getWorkflowUserData().then(() => {
      setIsDataLoaded(false); // Mark data as loaded
    });
    setCheckedIds([]);
  }, [sortField, sortValue, searchTermForTable, limit]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchData([]); // Clear results if input is empty
      return;
    }

    const controller = new AbortController(); // Create an AbortController instance
    const signal = controller.signal;

    getWorkflowUserDataSearch(signal); // Call API function with signal

    return () => controller.abort(); // Cleanup: Cancel previous request if a new one starts
  }, [searchTerm, selectedTab]);

  //Debug for allformapproved
  useEffect(() => {
    console.log("Debug: tableData", JSON.stringify(tableData));

    const newApprovedStatus = [];

    tableData?.forEach((item, index) => {
      console.log(`Debug: Processing item at index ${index}`, item);
      const staffManagerWorkflow = item?.completedWorkflows?.find(
        (workflow) => workflow?.role === "Staff Manager"
      );
      console.log("Debug: staffManagerWorkflow for item", staffManagerWorkflow);
      if (staffManagerWorkflow?.allFormsApproved) {
        console.log(`Debug: staffManagerWorkflow.allFormsApproved is true for item at index ${index}`);
        newApprovedStatus[index] = true;
      } else {
        console.log(`Debug: staffManagerWorkflow.allFormsApproved is false or undefined for item at index ${index}`);
        newApprovedStatus[index] = false;
      }
    });
    setIsApproved(newApprovedStatus);
  }, [tableData]);

  useEffect(() => {
    if (applicationType) {
      getWorkflowUserData();
      getSentConfirmationCount();
      getRejectionCounts();
      getDeclineData();
    }
  }, [applicationType, showNotesDialog]);

  useEffect(() => {
    if (applicationIsLocum) {
      getWorkflowUserData();
    }
  }, [applicationIsLocum]);

  useEffect(() => {
    if (userDetails !== undefined) {
      setUsers(jwt(userDetails));
    }
  }, [userDetails])

  useEffect(() => {
    setUserDetails();
  }, [users?.id, workModeType])

  const getDepartmentList = async () => {
    const { data: department } = await GET(
      `entity-service/department`
    );
    setDepartmentList(department);
  }

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    // setUserRole(userData?.roles?.map((data) => data?.roleName));
    const roles = userData?.roles?.map((data) => data?.roleName) || [];
    setUserRole(roles);
    setUserFirstName(`${userData?.name?.firstName}`);
    setUserLastName(`${userData?.name?.lastName}`);

    // Automatically set the work mode type if there's only one role
    if (roles.length === 1) {
      const singleRole = roles[0];
      setWorkModeType(singleRole);
      sessionStorage.setItem("workModeType", singleRole);
    }
  }

  const getReFetchMetaData = (value) => {
    setReFetchMetaData(value);
  }

  const getApplicationCreationType = (value) => {
    setApplicationCreationType(value);
  }

  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected");
  };

  const getApplicationApprovedDeclineDialog = (value) => {
    setShowApplicationApprovedDeclineDialog(value);
    // setRejectionTab("rejected");
  };

  const getCCDateDialogOpen = (value) => {
    // // getCCDateDialog(true,checkedIds);
    setShowCCDateDialog(value)
  };

  const getBulkApproveDialogOpen = (value) => {
    // // getCCDateDialog(true,checkedIds);
    setShowBulkApproveDialog(value)
  };

  const getCheckListDialog = (value) => {
    setShowCheckListDialog(value);
  };

  const onClickNotesDialog = (data) => {
    getNotesDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickClarificationRequrstFromApplicantDialog = (data) => {
    getClarificationRequestFromApplicantDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
  }

  const onClickDeptReviewDialog = (data) => {
    getApprovalNotesCommentBoxDept(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickDepttrackerDialog = (data) => {
    getDeptTrackerDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyFunction = (data) => {
    getActiveApplicationView(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyDateSetMACFunction = (data) => {
    getActiveApplicationView(true, "DateSetForMAC");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyApproveFromMACFunction = (data) => {
    getActiveApplicationView(true, "ReviewFromMAC");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyDateSetBODFunction = (data) => {
    getActiveApplicationView(true, "DateSetForBOD");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyApproveFromBODFunction = (data) => {
    getActiveApplicationView(true, "ReviewFromBOD");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyDateSetFunction = (data) => {
    getActiveApplicationView(true, "DateSetForCC");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyApproveFromCCFunction = (data) => {
    getActiveApplicationView(true, "ReviewFromCC");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickViewAndVerifyLevelFunction = (data) => {
    sessionStorage.setItem("applicationId", data?.id);
    getNotesCommentBox(true);
    getActiveApplicationView(true);
  };

  const onClickViewAndVerifyDeptFunction = (data) => {
    sessionStorage.setItem("applicationId", data?.id);

    const isDepartmentHead = data?.completedWorkflows?.find(
      (wf) => wf?.role === "Department Head"
    )?.approverDetail?.name;

    const isAuthorized =
      isDepartmentHead?.firstName === userFirstName &&
      isDepartmentHead?.lastName === userLastName;

    getNotesCommentBox(isAuthorized);
    getActiveApplicationView(true);
  };

  const onClickViewAndVerifyCredFunction = (data) => {
    sessionStorage.setItem("applicationId", data?.id);

    const isCredComm = data?.completedWorkflows?.find(
      (wf) => wf?.role === "Credentialing Committee"
    )?.approverDetail?.name;

    const isAuthorized =
      isCredComm?.firstName === userFirstName &&
      isCredComm?.lastName === userLastName;

    getNotesCommentBox(isAuthorized);
    getActiveApplicationView(true);
  };

  const showApplicationById = (id) => {
    getActiveApplicationView(true);
    getReappointmentChangesCommentBox(true);
    // sessionStorage.setItem("applicationId", id);
  };

  const onClickViewAndVerifyLevel1Function = (data) => {
    getActiveApplicationView(true);
    getReappointmentChangesCommentBox(true);
    sessionStorage.setItem("applicationId", data?.id);
  };
  // const onClickViewAndApproveCredCommFunction = (data) => {
  //   getCredCommApplicationView(true);
  //   sessionStorage.setItem("applicationId", data?.id);
  // };
  const onClickProcessingTaskFunction = (data) => {
    getActiveApplicationTask(true);
    sessionStorage.setItem("applicationId", data?.id)
  };

  const onClickMoveToNextFunction = (data) => {
    getApplicationMoveToNext(data?.id);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickStartTheWorkFlowFunction = (data) => {
    getApplicationStart(data?.id);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickMoveToActiveStaffFunction = (data) => {
    ActiveStaffApplication(data?.id)
    sessionStorage.setItem("applicationId", data?.id);
  };


  console.log("selectedTab", selectedTab)

  const getApplicationStart = async (id) => {
    await PUT(`application-management-service/application/${id}/workflow/start`)
      .then(response => {
        console.log('successfullllllll')
        getWorkflowUserData();
        setReFetchMetaData(true);
        getTitleCounts();
      })
      .catch((error) => {
        console.log("errorrrrrrrrr")
      });
    // getPreApplication();
  }
  const getApplicationMoveToNext = async (id) => {
    // let role;
    let notes;

    // if (selectedTab === 'level-2'); {
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
    // } else {
    //   role = "Chief Of Staff";
    //   notes = "Send"
    // }

    let temp = {
      // role: Array.isArray(userRole) ? userRole[0] : userRole,
      role: workModeType,
      notes: notes
    };

    const isDelegate = selectedTab === 'level-2' || selectedTab === 'level-3' || selectedTab === 'level-4' || selectedTab === 'level-5' ? true : false;
    const requestData = isDelegate === true ? temp : {};
    await PUT(`application-management-service/application/${id}/workflow/move?isDelegate=${isDelegate}`, requestData)
      .then(response => {
        console.log('successfull')
        getWorkflowUserData();
        setReFetchMetaData(true)
      })
      .catch((error) => {
        console.log(error)
      });
    // getPreApplication();
  }

  // const approveView = async (id) => {
  //   let role;

  //   if(selectedTab === 'level-2') {
  //     role = "Department Head";
  //   } else if (selectedTab === 'level-1') {
  //     role = "Credentialing Committee";
  //   } else if (selectedTab === 'mac') {
  //     role = "Advisory Committee";
  //   } else if (selectedTab === 'bod') {
  //     role = "Board";
  //   } else {
  //     role = "Chief Of Staff";
  //   }

  //       const { data: basicApproval } = await GET(
  //         `application-management-service/application/${id}/approvalRequiredForms?role=${role}`
  //       );
  //       setForm2(basicApproval)  
  //       console.log("basicApprovalllllllllllll" + JSON.stringify(form2));     
  // }

  const ActiveStaffApplication = async (id) => {
    await POST(`application-management-service/application/${id}/appointStaff`)
      .then(response => {
        // SuccessToaster('Reappoint Application Send as Email Successfully');
        console.log(response?.data);
        getWorkflowUserData();
        getTitleCounts();
        // window.location.reload();
      })
      .catch(error => {
        // ErrorToaster('Sending Email is Failed');
        console.log(error);

      })
  }

  useEffect(() => {
    getDepartmentList();
  }, [showFilter])

  useEffect(() => {
    const allIds = tableData
      ?.filter((data) =>
        data?.completedWorkflows?.some(
          (workflow) =>
            workflow?.role === "Credentialing Committee" &&
            workflow?.status !== "COMPLETED"
        )
      )
      .map((data) => data.id);

    setFilteredIds(allIds);
    console.log("Filtered IDs:", allIds);
  }, [tableData]);

  // useEffect(() => {
  //   let allIds = [];
  //   const currentDate = new Date(); // Get current date

  //   if (selectedTab === "level-3") {
  //     allIds = tableData
  //       ?.filter((data) =>
  //         data?.completedWorkflows?.some(
  //           (workflow) =>
  //             workflow?.role === "Credentialing Committee" &&
  //             workflow?.status !== "COMPLETED"
  //         )
  //       )
  //       .map((data) => data.id);
  //   } else if (selectedTab === "level-4") {
  //     allIds = tableData
  //       ?.filter((data) =>
  //         data?.completedWorkflows?.some(
  //           (workflow) => {
  //             if (workflow?.role === "Advisory Committee") {
  //               if (!workflow.meetingDate) {
  //                 return true; // Include items with null meetingDate
  //               }
  //               const meetingDate = new Date(workflow.meetingDate);
  //               return meetingDate > currentDate; // Include past meeting dates
  //             }
  //             return false;
  //           }
  //         )
  //       )
  //       .map((data) => data.id);
  //   } else if (selectedTab === "level-5") {
  //     allIds = tableData
  //       ?.filter((data) =>
  //         data?.completedWorkflows?.some(
  //           (workflow) => {
  //             if (workflow?.role === "Board") {
  //               if (!workflow.meetingDate) {
  //                 return true; // Include items with null meetingDate
  //               }
  //               const meetingDate = new Date(workflow.meetingDate);
  //               return meetingDate > currentDate; // Include past meeting dates
  //             }
  //             return false;
  //           }
  //         )
  //       )
  //       .map((data) => data.id);
  //   }

  //   setFilteredIds(allIds);
  //   console.log("Filtered IDs:", allIds);
  // }, [tableData, selectedTab]);

  const handleCheckboxClick = (id) => {
    if (filteredIds?.includes(id)) return;

    setCheckedIds((prevCheckedIds) => {
      return prevCheckedIds?.includes(id)
        ? prevCheckedIds?.filter((checkedId) => checkedId !== id)
        : [...prevCheckedIds, id];
    });
    console.log("Idscheckedss" + checkedIds)
  };

  // const handleCheckboxClick = (id) => {
  //   setCheckedIds(prevCheckedIds => {
  //     // Toggle the ID in the array
  //     return prevCheckedIds?.includes(id)
  //       ? prevCheckedIds?.filter(checkedId => checkedId !== id)
  //       : [...prevCheckedIds, id];
  //   });
  //   // console.log("Idschecked" + checkedIds)
  // };


  console.log("Idscheckedsssssssssss" + checkedIds)

  useEffect(() => {
    getSentConfirmationCount();
    // getRequestAppointmentCount();
    getRejectionCounts();
  }, []);

  // useEffect(() => {
  //   getActiveUserData()
  // }, [ sortField, sortValue,page,totalCountDept]);

  useEffect(() => {
    getWorkflowUserData(selectedTab);
    setCheckedIds([]);
  }, [selectedTab, sortField, sortValue, page, totalCount, showAssignee, selectedDepartment, selectedServiceArea]);

  useEffect(() => {
    getWorkflowUserData();
    // getNotesDialog();
    getReFetchMetaData(true);
    console.log("getReFetchMetaData", reFetchMetaData)
  }, [showNotesDialog, showCCDateDialog, approvalnotesCommentsBoxDept, showBulkApproveDialog, activeApplicationTask]);

  // useEffect(() => {
  //   getApplicationCreationType();
  // }, [applicationCreationType]);


  useEffect(() => {
    getRejectionData(rejectionTab);
  }, [rejectionTab, showApplicationRejectionDialog]);

  useEffect(() => {
    getActiveUserDataReappointment();
  }, []);

  useEffect(() => {
    getDeclineData();
  }, [showApplicationApprovedDeclineDialog]);


  const handleIconClick = () => {
    setShowCardDetails((prev) => !prev);
  };

  const getSelectedPage = (value) => {
    setPage(value);
  }

  useEffect(() => {
    setPage(1);
  }, [selectedTab]);

  const getActiveUserDataReappointment = async () => {
    try {
      const queryParams = new URLSearchParams({
        status: 'ACTIVE'
      });

      const types = ['PERMANENT', 'LOCUM'];
      types.forEach(type => queryParams.append('type', type));
      // queryParams.append('applicantTypeId', "6398687f95164c0bb67ff4b2");
      queryParams.append('applicationStatus', "CREATED");


      const response = await GET(
        `application-management-service/staff?${queryParams.toString()}&sendForReappointment=false`
      );

      // Filter out any data that might have 'type' as 'PROVISIONAL' in case backend returns it
      // const filteredData = response?.data?.staffs?.filter(item => item?.type !== 'PROVISIONAL') || [];

      // setTableData(response?.data?.staffs);
      // setTotalCount(response?.data?.numberOfElements);
      setReappointCount(response?.data?.numberOfElements);
      return response?.data?.staffs;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getActiveUserData = async () => {
    try {

      const response = await GET(
        `application-management-service/application?sortBy=${sortValue}&sortByField=${sortField}&limit=${10}&offset=${page - 1}`
      );

      setTableData(response?.data?.applications);
      setTotalCountDept(response?.data?.numberOfElements);
      return response?.data?.applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getWorkflowUserData = async () => {
    try {
      let response;
      if (applicationType === "LOCUM") {
        response = await GET(`application-management-service/staff`);
        console.log("LOCUM data", response?.data.staffs);
        setTableData(response?.data?.staffs);
        setTotalCount(response?.data?.numberOfElements);
        console.log("LOCUM data length", response?.data?.numberOfElements);
        return response?.data.staffs || [];
      } else {
        let role = workModeType === "Credentialing Committee User" ? "Staff Manager" : workModeType;
        const shouldIncludeAssignee = showAssignee &&
          (workModeType === "Department Head" ||
            workModeType === "Chief Of Staff" ||
            workModeType === "Credentialing Committee");
        const assignedUserIdsParam = shouldIncludeAssignee ? `&assignedUserIds=${users?.id}` : "";
        const departmentParam = selectedDepartment || selectedServiceArea ? `&departmentSpecialties=${selectedDepartment}%23${selectedServiceArea}` : "";
        setIsLoadingImage(true);
        response = await GET(
          `application-management-service/application/workflowUser?tab=${selectedTab}&sortBy=${sortValue}&sortByField=${sortField}&applicationCreationType=${applicationType}&limit=${limit}&offset=${page - 1}&role=${role}&searchText=${searchTermForTable}&isPaginationRequired=${limit === 9999 ? false : true}${departmentParam}${assignedUserIdsParam}`
        );
        console.log("Application data", response?.data?.applications);
        setTableData(response?.data?.applications);
        setTotalCount(response?.data?.numberOfElements);
        setSearchount(response?.data?.numberOfElements)
        setReFetchMetaData(true);
        setIsLoadingImage(false);
        console.log("Application data length", response?.data?.numberOfElements);
        return response?.data?.applications || [];
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getWorkflowUserDataSearch = async (signal) => {
    try {
      let response;
      if (applicationType === "LOCUM") {
        response = await GET(`application-management-service/staff`);
        console.log("LOCUM data", response?.data.staffs);
        setTableData(response?.data?.staffs);
        setTotalCount(response?.data?.numberOfElements);
        console.log("LOCUM data length", response?.data?.numberOfElements);
        return response?.data.staffs || [];
      } else {
        let role = workModeType === "Credentialing Committee User" ? "Staff Manager" : workModeType;
        // setIsLoadingImage(true);
        response = await GET(
          `application-management-service/application/workflowUser?tab=${selectedTab}&sortBy=${sortValue}&sortByField=${sortField}&applicationCreationType=${applicationType}&limit=${limit}&offset=${page - 1}&role=${role}&searchText=${searchTerm}&isPaginationRequired=${false}`, { signal }
        );
        console.log("Application data", response?.data?.applications);
        setSearchData(response?.data?.applications.map(item => ({
          id: item.id,
          name: `${formatFirstNameLastName(item?.applicant?.name?.firstName, item?.applicant?.name?.lastName)}` || " ",
          desc: `${item?.basicDetails?.departmentSpecialty?.department} | ${item?.basicDetails?.applicant?.applicantType}`
        })));
        // setTotalCount(response?.data?.numberOfElements);
        // setReFetchMetaData(true);
        // setIsLoadingImage(false);
        console.log("Application data length", response?.data?.numberOfElements);
        return response?.data?.applications || [];
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  console.log("0000000000000000000000" + JSON.stringify(tableData));

  const getHandleSort = (value, sortBy) => {
    if (sortBy === 'ASCENDING') {
      setSortField(value)
      setSortValue('DESCENDING')
    } else if (sortBy === 'DESCENDING') {
      setSortField('DEFAULT')
      setSortValue('ASCENDING')
    } else if (sortBy === 'NONE') {
      setSortField(value)
      setSortValue('ASCENDING')
    }
  }
  console.log("rejectionTab", rejectionTab);

  const getRejectionData = async () => {
    if (applicationType === "LOCUM") {
      return;
    }
    try {
      const response = await GET(
        `application-management-service/application/workflowUser?tab=${rejectionTab}&applicationCreationType=${applicationType}&role=${workModeType}`
      );
      console.log("Rejection data", response?.data?.applications);
      setRejectionListData(response?.data?.applications);
      return response?.data?.applications || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getDeclineData = async () => {
    if (applicationType === "LOCUM") {
      return;
    }
    try {
      const response = await GET(
        `application-management-service/application?tenantId=${TenantID}&applicationStatus=DECLINED&applicationCreationType=${applicationType}`
        // `application-management-service/application/workflowUser?tab=${rejectionTab}&applicationCreationType=${applicationType}`
      );
      console.log("Rejection data", response?.data?.applications);
      setDeclineListData(response?.data?.applications);
      return response?.data?.applications || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const handleClick = async () => {
    // await getDeclineData();
    setShowApplicationRejectionDialog(true);
  };

  // useEffect(() => {
  //   if (showApplicationRejectionDialog) {
  //     getDeclineData();
  //   }
  // }, [showApplicationRejectionDialog]);

  const getSentConfirmationCount = async () => {
    if (applicationType === "LOCUM") {
      return;
    }
    await GET(
      `application-management-service/application/sentToApplicant/status?applicationCreationType=${applicationType}`
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

  const getDepartmentCount = async () => {
    if (applicationType === "LOCUM") {
      return;
    }
    await GET(
      `application-management-service/application/sentToApplicant/status?applicationCreationType=${applicationType}`
    )
      .then((response) => {
        setSentCompletion(response?.data || null);
        setShowDepartmentCardStatus(
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

  const handleNavigate = () => {
    navigate("/reportTypeOverview/oneTimeContract", { state: { tableData } });
  };

  const handleNavigateNotes = () => {
    navigate("/reportTypeOverview/upcomingContractRenewals", { state: { tableData } });
  };

  const getRejectionCounts = async () => {
    if (applicationType === "LOCUM") {
      return;
    }
    await GET(`application-management-service/application/rejected/meta?applicationCreationType=${applicationType}`)
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


  // const userWorkflow = tableData?.completedWorkflows.find(workflow => workflow.role === userRole);
  // console.log("userWorkflowwwwwwwwwwwwwwwwwwwwwwww" + userWorkflow)


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
  let mac = [];
  let ccapproval = [];
  let cosapproval = [];
  let ref = [];
  let taskListStatus = [];
  let macapproval = [];
  let taskListDotColor = [];
  let ccdate = [];
  let macdate = [];
  let boddate = [];
  let submitted = [];
  let deptHead = [];
  let checkbox = [];
  let ccMember = [];
  let dhMember = [];

  const getApplicantValues = applicationType === "NEW" ? () => {
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
    taskListDotColor = [];
    action = [];

    tableData?.map((data) => {
      // dot.push(
      //   data?.currentLevelCompleted === false
      //     ? "yellow"
      //     : data?.currentLevelCompleted === true
      //       ? "green"
      //       : "grey"
      // );

      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Staff Manager"));

      // For debugging the userRole
      // data?.completedWorkflows?.forEach((workflow, index) => {
      //     const isRoleMatch = userRole?.includes(workflow.role);
      //     console.log(`Workflow ${index}:`, {
      //         workflowRole: workflow.role,
      //         hasMatchingRole: isRoleMatch,
      //         status: isRoleMatch ? workflow.currentLevelStatus : 'N/A'
      //     });
      // });

      // Check currentLevelStatus and set color if workflow is found
      if (workflow) {
        const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
          : workflow?.currentLevelStatus === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.currentLevelStatus,
          assignedColor: color
        });
      }
      applicantName.push(
        `${data?.applicant?.name?.lastName.toUpperCase()}, ${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()}` ||
        " "
      );
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      docs.push(data?.documents?.uploadedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      const docHoverTextArray = documentDetails?.length > 0 ? documentDetails?.map(doc => doc.documentType) : ["-"];
      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === data?.documents?.uploadedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }} />);
      }
      // else if (data?.documents?.verifiedCount === 0) {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#94979A` }} />);
      // } else {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#FEC106` }} />);
      // }
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      crs.push(data?.clarificationRequiredFor || "-");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      const notesDetails = data?.notes || [];
      const notesHoverTextArray = notesDetails?.length > 0 ? notesDetails?.map(note => note?.notes) : ["-"];
      // notesHoverText.push([
      //   "June 13 00:00, Nina Grealy",
      //   "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      // ]);
      notesHoverText.push(notesHoverTextArray);

      if (data?.tasks?.completedCount === 0) {
        taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }} />);
      } else if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
        taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }} />);
      } else {
        taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }} />);
      }

      taskListStatus.push(data?.tasks?.completedCount + "/" + data?.tasks?.totalCount);
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
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department },
      {
        type: "iconWithCount",
        // value: docs,
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
      {
        type: "iconWithCount",
        value: taskListStatus,
        icon: taskListDotColor
      },
      // { type: "dot", value: taskListDotColor, tooltipValue: dotTooltipValues },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  } : () => {
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
    taskListDotColor = [];
    submitted = [];
    action = [];

    tableData?.map((data) => {
      // dot.push(
      //   data?.currentLevelCompleted === false
      //     ? "yellow"
      //     : data?.currentLevelCompleted === true
      //       ? "green"
      //       : "grey"
      // );

      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Staff Manager"));

      // For debugging the userRole
      // data?.completedWorkflows?.forEach((workflow, index) => {
      //     const isRoleMatch = userRole?.includes(workflow.role);
      //     console.log(`Workflow ${index}:`, {
      //         workflowRole: workflow.role,
      //         hasMatchingRole: isRoleMatch,
      //         status: isRoleMatch ? workflow.currentLevelStatus : 'N/A'
      //     });
      // });

      // Check currentLevelStatus and set color if workflow is found
      if (workflow) {
        const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
          : workflow?.currentLevelStatus === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.currentLevelStatus,
          assignedColor: color
        });
      }
      // applicantName.push(
      //   ` ${data?.applicant?.name?.lastName.toUpperCase()}, ${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()}` ||
      //   " "
      // );
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );
      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails?.length > 0 ? documentDetails?.map(doc => doc?.shortName) : ["-"];
      const docHoverTextArray = documentDetails?.length > 0
        ? documentDetails?.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />;

          return (
            <div key={index} className={style.fullWidth}>
              <span>
                {verifiedIndicator} {doc?.shortName}
              </span>
              {index !== documentDetails.length - 1 && (
                <hr style={{ margin: '5px 0 -10px 0px' }} />
              )}
            </div>
          );
        })
        : ["-"];

      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount > data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }

      // else if (data?.documents?.verifiedCount === 0) {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#94979A` }} />);
      // } else {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#FEC106` }} />);
      // }
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      // crs.push(data?.clarificationRequiredFor || "0");
      // crsHoverText.push(["Ontario Medical Society"]);
      crs.push(data?.clarificationCount?.closedCount + "/" + data?.clarificationCount?.totalCount || "");
      const validNotes = data?.notesDetails?.filter(
        log => log?.notes?.notes && (!log?.private || log?.user?.id === users?.id)
      ) || [];
      notes.push(validNotes?.length || "-");
      notesIcon.push(
        validNotes.length > 0 ? (
          <NoteAltOutlinedIcon style={{ fontSize: 20, color: "#2C2C2C" }} />
        ) : ("")
      );
      const notesHoverTextArray = validNotes?.length > 0
        ? validNotes.map((note, index) => {
          const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
          const firstName = note?.user?.name?.firstName || '';
          const title = note?.title;
          const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy 'at' h:mm a") || '';
          const noteContent = `${firstName}, ${title} ${createdDate}`;
          return (
            <div key={index}>
              {note?.private && <span className={style.privateBorderText}>Private</span>}
              {" "}{noteContent}
              <div>{text}</div>
              {/* { validNotes?.length  && <hr style={{ borderColor: '#E0E0E0' }} />} */}
              {index !== validNotes.length && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        }).reverse()
        : ["-"];
      notesHoverText.push(notesHoverTextArray);
      // if (data?.tasks?.completedCount === 0) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }} />);
      // } else if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }} />);
      // }  else {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }} />);
      // }

      // taskListStatus.push(data?.tasks?.completedCount + "/" + data?.tasks?.totalCount);

      data?.logs?.forEach((log) => {
        if (log?.workflowStatus === "SUBMITTED") {
          submitted.push(format(new Date(log?.lastModifiedDate), "MM/dd/yyyy"));
        }
      });
      // lastUpdated.push(
      //   format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      // );
      // lastUpdatedBy.push(["Last Updated By", data?.updatedBy?.name?.firstName]);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: department },
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
        // type: "countWithHover",
        type: "text",
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
      // {
      //   type: "iconWithCount",
      //   value: taskListStatus,
      //   icon: taskListDotColor
      // },
      // { type: "dot", value: taskListDotColor, tooltipValue: dotTooltipValues },
      {
        type: "text",
        value: submitted,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      // {
      //   type: "iconWithCount",
      //   value: lastUpdated,
      //   hoverText: lastUpdatedBy,
      //   isShowHoverText: true,
      // },
      { type: "action", value: action },
    ];
  }

  const getDepartmentHeadValues = () => {
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    department = [];
    dhMember = []
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
    taskListDotColor = [];
    action = [];

    tableData?.map((data) => {
      // dot.push(
      //   data?.currentLevelCompleted == false
      //     ? "yellow"
      //     : data?.currentLevelCompleted == true
      //       ? "green"
      //       : "grey"
      // );

      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Department Head"));
      if (workflow) {
        const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
          : workflow?.currentLevelStatus === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.currentLevelStatus,
          assignedColor: color
        });
      }

      console.log("data?.currentLevelCompleted" + data?.currentLevelCompleted);

      // applicantName.push(
      //   `  ${data?.applicant?.name?.firstName} ${data?.applicant?.name?.lastName.toLowerCase()}` ||
      //   " "
      // );
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );

      const DeptHead = data?.completedWorkflows?.find(
        (workflow) => workflow?.role === "Department Head"
      );

      if (DeptHead?.approverDetail) {
        dhMember.push(
          `${DeptHead.approverDetail.name?.firstName || ""} ${DeptHead.approverDetail.name?.lastName || ""}`
        );
      }
      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails?.length > 0 ? documentDetails?.map(doc => doc?.documentType) : ["-"];
      const docHoverTextArray = documentDetails?.length > 0
        ? documentDetails?.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />
          return (
            <div key={index} className={style.fullWidth}>
              <span>
                {verifiedIndicator} {doc?.shortName}
              </span>
              {index !== documentDetails.length - 1 && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        })
        : ["-"];
      docsHoverText.push(docHoverTextArray);
      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount > data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      // crs.push(data?.clarificationRequiredFor || "0");
      crs.push(data?.clarificationCount?.closedCount + "/" + data?.clarificationCount?.totalCount || "");
      // crsHoverText.push(["Ontario Medical Society"]);
      // const validNotes = data?.notesDetails?.filter(note => note?.notes?.notes) || [];
      const validNotes = data?.notesDetails?.filter(
        log => log?.notes?.notes && (!log?.private || log?.user?.id === users?.id)
      ) || [];
      notes.push(validNotes?.length || "-");
      notesIcon.push(
        validNotes.length > 0 ? (
          <NoteAltOutlinedIcon style={{ fontSize: 20, color: "#2C2C2C" }} />
        ) : ("")
      );
      // const notesHoverTextArray = validNotes?.length > 0
      //   ? validNotes.map(note => {
      //     const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
      //     const firstName = note?.user?.name?.firstName || '';
      //     const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy") || '';
      //     return `${firstName} on ${createdDate}: ${text}`;
      //   }).reverse()
      //   : ["-"];
      const notesHoverTextArray = validNotes?.length > 0
        ? validNotes.map((note, index) => {
          const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
          const firstName = note?.user?.name?.firstName || '';
          const title = note?.title;
          const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy 'at' h:mm a") || '';
          const noteContent = `${firstName}, ${title} ${createdDate}`;
          return (
            <div key={index}>
              {note?.private && <span className={style.privateBorderText}>Private</span>}
              {" "}{noteContent}
              <div>{text}</div>
              {/* { validNotes?.length  && <hr style={{ borderColor: '#E0E0E0' }} />} */}
              {index !== validNotes.length && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        }).reverse()
        : ["-"];
      notesHoverText.push(notesHoverTextArray);
      // if (data?.tasks?.completedCount === 0) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }} />);
      // } else if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }} />);
      // }  else {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }} />);
      // }

      // taskListStatus.push(data?.tasks?.completedCount + "/" + data?.tasks?.totalCount);
      // lastUpdated.push(
      //   format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      // );
      // // lastUpdatedBy.push(["-"]);
      // lastUpdatedBy.push(["Last Updated By", data?.updatedBy?.name?.firstName]);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: department },
      {
        type: "text",
        value: dhMember,
      },
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
        type: "text",
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
      // {
      //   type: "iconWithCount",
      //   value: taskListStatus,
      //   icon: taskListDotColor
      // },
      // { type: "dot", value: taskListDotColor, tooltipValue: dotTooltipValues },
      // {
      //   type: "iconWithCount",
      //   value: lastUpdated,
      //   hoverText: lastUpdatedBy,
      //   isShowHoverText: true,
      // },
      { type: "action", value: action },
    ];
  }

  const getApplicationValues = applicationType === "NEW" ? () => {
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
      // dot.push(
      //   data?.status === "REVIEW_INPROGRESS"
      //     ? "yellow"
      //     : data?.status === "APPROVED"
      //       ? "green"
      //       : "grey"
      // );

      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Credentialing Committee"));
      if (workflow) {
        const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
          : workflow?.currentLevelStatus === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.currentLevelStatus,
          assignedColor: color
        });
      }

      applicantName.push(
        `${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " "
      );
      applicantType.push(data?.providerType.serviceProviderType);
      // applicantId.push(data?.displayId);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );
      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      const docHoverTextArray = documentDetails?.length > 0 ? documentDetails?.map(doc => doc?.documentType) : ["-"];
      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount < data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }
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
      if (data?.logs[data?.logs?.length - 1]?.role === "Chief Of Staff") {
        if (data?.logs[data?.logs?.length - 1]?.workflowAction === "SUBMITTED") {
          cos.push("yellow");
        } else if (data?.logs[data?.logs?.length - 1]?.workflowAction === "APPROVED") {
          cos.push("green");
        }
      }
      else {
        cos.push("grey"); // If the role is not "Chief of Staff"
      }
      // cc.push(data?.ceoStatus || "grey");
      if (data?.logs[data?.logs?.length - 2]?.role === "Credentialing Committee") {
        if (data?.logs[data?.logs?.length - 2]?.workflowAction === "SUBMITTED") {
          cc.push("yellow");
        } else if (data?.logs[data?.logs?.length - 2]?.workflowAction === "APPROVED") {
          cc.push("green");
        }
      }
      else {
        cc.push("grey"); // If the role is not "Chief of Staff"
      }
      if (data?.logs[data?.logs?.length - 2]?.role === "Credentialing Committee") {
        ccdate.push(
          format(new Date(data?.logs[data.logs?.length - 2].createdDate), "MMM dd, yyyy")
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
      // { type: "text", value: applicantId },
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
  } : () => {
    dot = [];
    applicantName = [];
    applicantType = [];
    applicantId = [];
    // commiteeStatus = [];
    // boardStatus = [];
    // ceoStatus = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    crs = [];
    notes = [];
    docsHoverText = [];
    deptHead = [];
    submitted = [];
    cos = [];
    cc = [];
    ccdate = [];
    ccMember = [];
    lastUpdatedOn = [];

    action = [];

    tableData?.map((data) => {
      // dot.push(
      //   data?.status === "REVIEW_INPROGRESS"
      //     ? "yellow"
      //     : data?.status === "APPROVED"
      //       ? "green"
      //       : "grey"
      // );


      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Credentialing Committee"));
      // const workflowDeptRole = data?.completedWorkflows?.find(workflow => workflow.role === "Department Head");
      if (workflow) {
        const color = workflow?.status === "IN_PROGRESS" ? "yellow"
          : workflow?.status === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.status,
          assignedColor: color
        });
      }

      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      applicantType.push(data?.providerType.serviceProviderType);
      // applicantId.push(data?.displayId);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );
      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails?.length > 0 ? documentDetails.map(doc => doc.documentType) : ["-"];
      const docHoverTextArray = documentDetails?.length > 0
        ? documentDetails?.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />
          return (
            <div key={index} className={style.fullWidth}>
              <span>
                {verifiedIndicator} {doc?.shortName}
              </span>
              {index !== documentDetails.length - 1 && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        })
        : ["-"];
      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount > data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }
      // commiteeStatus.push(data?.commiteeStatus || "yellow");
      // boardStatus.push(data?.boardStatus || "green");
      // ceoStatus.push(data?.ceoStatus || "grey");
      // crs.push(data?.clarificationRequiredFor || "0");
      // crsHoverText.push(["Ontario Medical Society"]);
      crs.push(data?.clarificationCount?.closedCount + "/" + data?.clarificationCount?.totalCount || "");
      // const validNotes = data?.notesDetails?.filter(note => note?.notes?.notes) || [];
      const validNotes = data?.notesDetails?.filter(
        log => log?.notes?.notes && (!log?.private || log?.user?.id === users?.id)
      ) || [];
      notes.push(validNotes?.length || "-");
      notesIcon.push(
        validNotes.length > 0 ? (
          <NoteAltOutlinedIcon style={{ fontSize: 20, color: "#2C2C2C" }} />
        ) : ("")
      );
      const notesHoverTextArray = validNotes?.length > 0
        ? validNotes.map((note, index) => {
          const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
          const firstName = note?.user?.name?.firstName || '';
          const title = note?.title;
          const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy 'at' h:mm a") || '';
          const noteContent = `${firstName}, ${title} ${createdDate}`;
          return (
            <div key={index}>
              {note?.private && <span className={style.privateBorderText}>Private</span>}
              {" "}{noteContent}
              <div>{text}</div>
              {/* { validNotes?.length  && <hr style={{ borderColor: '#E0E0E0' }} />} */}
              {index !== validNotes.length && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        }).reverse()
        : ["-"];
      notesHoverText.push(notesHoverTextArray);

      const credCommittee = data?.completedWorkflows?.find(
        (workflow) => workflow?.role === "Credentialing Committee"
      );

      if (credCommittee?.approverDetail) {
        ccMember.push(
          `${credCommittee.approverDetail.name?.firstName || ""} ${credCommittee.approverDetail.name?.lastName || ""}`
        );
      }
      // cr.push(data?.logs[data.logs.length - 1]?.role)
      // cos.push(data?.boardStatus || "green");
      // cos.push(data?.logs[data.logs.length - 1].workflowAction === "SUBMITTED"
      //   ? "yellow"
      //   : data?.logs[data.logs.length - 1].workflowAction === "APPROVED"
      //   ? "green"
      //   : "grey");
      // if (data?.logs[data.logs.length - 1]?.role === "Chief Of Staff") {
      //   if (data.logs[data.logs.length - 1].workflowAction === "SUBMITTED") {
      //     cos.push("yellow");
      //   } else if (data.logs[data.logs.length - 1].workflowAction === "APPROVED") {
      //     cos.push("green");
      //   }
      // }
      // else {
      //   cos.push("grey"); // If the role is not "Chief of Staff"
      // }
      // cc.push(data?.ceoStatus || "grey");
      // if (data?.logs[data.logs.length - 2]?.role === "Credentialing Committee") {
      //   if (data.logs[data.logs.length - 2].workflowAction === "SUBMITTED") {
      //     cc.push("yellow");
      //   } else if (data.logs[data.logs.length - 2].workflowAction === "APPROVED") {
      //     cc.push("green");
      //   }
      // }
      // else {
      //   cc.push("grey"); // If the role is not "Chief of Staff"
      // }
      // deptHead.push("grey")
      // if (workflowDeptRole) {
      //   const color = workflowDeptRole.currentLevelStatus === "IN_PROGRESS" ? "yellow"
      //     : workflowDeptRole.currentLevelStatus === "COMPLETED" ? "green"
      //       : "grey";
      //       deptHead.push(color);
      //   console.log("Matching workflow found:", {
      //     role: workflowDeptRole.role,
      //     status: workflowDeptRole.currentLevelStatus,
      //     assignedColor: color
      //   });
      // }
      // if (data?.logs[data.logs.length - 2]?.role === "Credentialing Committee") {
      //   ccdate.push(
      //     format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
      //   )
      // } else { ccdate.push("-") }
      data?.logs?.forEach((log) => {
        if (log.workflowStatus === "SUBMITTED") {
          submitted.push(format(new Date(log.lastModifiedDate), "MMM dd, yyyy"));
        }
      });
      lastUpdatedOn.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      lastUpdatedBy.push(["Last Updated By", data?.updatedBy?.name?.firstName]);
      action.push(true);
    });

    return [
      { type: "dot", value: dot },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },

      { type: "text", value: department },
      {
        type: "text",
        value: ccMember,
      },
      {
        type: "iconWithCount",
        value: docs,
        hoverText: docsHoverText,
        isShowHoverText: true,
        icon: docsIcon,
      },
      // { type: "dot", value: commiteeStatus },
      // { type: "dot", value: boardStatus },
      // { type: "dot", value: ceoStatus },

      {
        type: "text",
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
      // { type: "dot", value: cos },
      // { type: "dot", value: deptHead },
      // {
      //   type: "iconWithCount",
      //   value: ccdate,
      //   // hoverText: lastUpdatedBy,
      //   // isShowHoverText: true,
      // },
      // {
      //   type: "iconWithCount",
      //   value: submitted,
      //   // hoverText: lastUpdatedBy,
      //   // isShowHoverText: true,
      // },
      // {
      //   type: "iconWithCount",
      //   value: lastUpdatedOn,
      //   hoverText: lastUpdatedBy,
      //   isShowHoverText: true,
      // },
      { type: "action", value: action },
    ]
  };

  const getCredUserValues = () => {
    dot = [];
    checkbox = [];
    applicantName = [];
    applicantType = [];
    applicantId = [];
    // commiteeStatus = [];
    // boardStatus = [];
    // ceoStatus = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    crs = [];
    notes = [];
    docsHoverText = [];
    deptHead = [];
    submitted = [];
    cos = [];
    cc = [];
    ccdate = [];
    lastUpdatedOn = [];
    ccMember = [];
    dotTooltipValues = [];
    action = [];

    tableData?.map((data) => {
      // dot.push(
      //   data?.status === "REVIEW_INPROGRESS"
      //     ? "yellow"
      //     : data?.status === "APPROVED"
      //       ? "green"
      //       : "grey"
      // );
      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Credentialing Committee"));
      const workflowCCDate = data?.logs
        ?.filter(workflowCC => workflowCC?.role === "Credentialing Committee")
        ?.sort((a, b) => {
          console.log("Comparing:", a.approvedDate, "with", b.approvedDate);
          return new Date(b.approvedDate) - new Date(a.approvedDate);
        })[0];
      const isDisabled = !workflow?.approvalType;
      checkbox.push(
        <CommonCheckBox
          checked={checkedIds?.includes(data?.id)}
          onChange={() => handleCheckboxClick(data?.id, data)}
          color="primary"
          inputProps={{ 'aria-label': `Select ${data?.name}` }}
          disabled={isDisabled}
        />
      );
      if (workflow) {
        const color = workflow?.status === "IN_PROGRESS" ? "yellow"
          : workflow?.status === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.currentLevelStatus,
          assignedColor: color,
          assignedType: workflow?.approvalType
        });
      }

      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );

      applicantType.push(data?.providerType?.serviceProviderType);
      // applicantId.push(data?.displayId);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );
      const credCommittee = data?.completedWorkflows?.find(
        (workflow) => workflow?.role === "Credentialing Committee"
      );

      if (credCommittee) {
        ccdate.push(
          credCommittee?.meetingDate
            ? format(new Date(`${credCommittee?.meetingDate}T00:00`), "MM/dd/yyyy")
            : "-"
        );
      }
      if (credCommittee?.approverDetail) {
        ccMember.push(
          `${credCommittee.approverDetail.name?.firstName || ""} ${credCommittee.approverDetail.name?.lastName || ""}`
        );
      }

      if (credCommittee) {
        if (credCommittee?.approvalType === "RECOMMENDED_WITH_NOTES") {
          cc.push('green');
          dotTooltipValues.push("Recommended with Notes")
        } else if (credCommittee?.approvalType === "NOT_RECOMMENDED") {
          cc.push('red');
          dotTooltipValues.push("Not Recommended")
        } else if (credCommittee?.approvalType === "RECOMMENDED") {
          cc.push('darkgreen');
          dotTooltipValues.push("Recommended")
        } else {
          cc.push('grey');
          dotTooltipValues.push("Not yet Started")
        }
      }

      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails?.length > 0 ? documentDetails.map(doc => doc.documentType) : ["-"];
      const docHoverTextArray = documentDetails?.length > 0
        ? documentDetails?.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />
          return (
            <div key={index} className={style.fullWidth}>
              <span>
                {verifiedIndicator} {doc?.shortName}
              </span>
              {index !== documentDetails.length - 1 && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        })
        : ["-"];
      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount > data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }
      // commiteeStatus.push(data?.commiteeStatus || "yellow");
      // boardStatus.push(data?.boardStatus || "green");
      // ceoStatus.push(data?.ceoStatus || "grey");
      crs.push(data?.clarificationRequiredFor || "0");
      crsHoverText.push(["Ontario Medical Society"]);
      const validNotes = data?.notesDetails?.filter(note => note?.notes?.notes) || [];
      notes.push(validNotes?.length || "-");
      notesIcon.push(
        validNotes.length > 0 ? (
          <NoteAltOutlinedIcon style={{ fontSize: 20, color: "#2C2C2C" }} />
        ) : ("")
      );
      const notesHoverTextArray = validNotes?.length > 0
        ? validNotes.map((note, index) => {
          const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
          const firstName = note?.user?.name?.firstName || '';
          const title = note?.title;
          const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy 'at' h:mm a") || '';
          const noteContent = `${firstName}, ${title} ${createdDate}`;
          return (
            <div key={index}>
              {note?.private && <span className={style.privateBorderText}>Private</span>}
              {" "}{noteContent}
              <div>{text}</div>
              {/* { validNotes?.length  && <hr style={{ borderColor: '#E0E0E0' }} />} */}
              {index !== validNotes.length && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        }).reverse()
        : ["-"];
      notesHoverText.push(notesHoverTextArray);
      // if (workflowCCDate) {
      //   const reviewDate = workflowCCDate?.approvedDate
      //     ? format(new Date(`${workflowCCDate?.approvedDate}T00:00`), "MM/dd/yyyy")
      //     : 'Data Issue';

      //   submitted.push(reviewDate);
      // } else {
      //   submitted.push('-');
      // }
      if (credCommittee) {
        const reviewDate = credCommittee?.reviewedDate
          ? format(new Date(`${credCommittee?.reviewedDate}T00:00`), "MM/dd/yyyy")
          : '-';

        submitted.push(reviewDate);
      } else {
        submitted.push('-');
      }
      lastUpdatedOn.push(
        format(new Date(data?.lastModifiedDate), "MM/dd/yyyy")
      );
      lastUpdatedBy.push(["Last Updated By", data?.updatedBy?.name?.firstName]);
      action.push(true);
    });

    return [
      // { type: "dot", value: dot },
      { type: "checkbox", value: checkbox },
      { type: "text", value: applicantName },
      { type: "text", value: applicantType },

      { type: "text", value: department },
      {
        type: "text",
        value: ccMember,
      },
      { type: "dot", value: cc, tooltipValue: dotTooltipValues },
      {
        type: "iconWithCount",
        value: notes,
        hoverText: notesHoverText,
        isShowHoverText: true,
        icon: notesIcon,
      },
      {
        type: "text",
        value: submitted,
      },
      {
        type: "text",
        value: ccdate,
      },
      { type: "action", value: action },
    ]
  };

  const getMacValues = applicationType === "NEW" ? () => {
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
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      // ccapproval.push(data?.ccapproval || "05/05/2024");
      // ccapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      if (data?.logs[data?.logs?.length - 1]?.role === "Credentialing Committee") {
        ccapproval.push(
          format(new Date(data?.logs[data?.logs?.length - 1]?.createdDate), "MMM dd, yyyy")
        )
      } else { ccapproval.push("-") }
      // cosapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      if (data?.logs[data?.logs?.length - 2]?.role === "Chief Of Staff") {
        cosapproval.push(
          format(new Date(data?.logs[data?.logs?.length - 2]?.createdDate), "MMM dd, yyyy")
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
      // { type: "text", value: applicantId },
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
  } : () => {
    // checkbox= [];
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    crs = [];
    crsHoverText = [];
    notes = [];
    notesHoverText = [];
    notesIcon = [];
    // cosapproval = [];
    taskListStatus = [];
    taskListDotColor = [];
    cc = [];
    action = [];
    macdate = [];

    tableData?.map((data) => {
      // const workflowCredRole = data?.completedWorkflows?.find(workflow => workflow.role === "Credentialing Committee");
      checkbox.push(
        <CommonCheckBox
          checked={checkedIds.includes(data.id)}
          onChange={() => handleCheckboxClick(data.id)}
          color="primary"
          inputProps={{ 'aria-label': `Select ${data.name}` }}
        />
      );
      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Advisory Committee"));
      // if (workflow) {
      //   const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
      //     : workflow?.currentLevelStatus === "COMPLETED" ? "green"
      //       : "grey";
      //   dot.push(color);
      //   console.log("Matching workflow found:", {
      //     role: workflow?.role,
      //     status: workflow?.currentLevelStatus,
      //     assignedColor: color
      //   });
      // }
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );
      // ccapproval.push(data?.ccapproval || "05/05/2024");
      // ccapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 1]?.role === "Credentialing Committee") {
      //   ccapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      //   )
      // } else { ccapproval.push("-") }
      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails?.length > 0 ? documentDetails.map(doc => doc?.documentType) : ["-"];
      const docHoverTextArray = documentDetails?.length > 0
        ? documentDetails?.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />
          return (
            <div key={index} className={style.fullWidth}>
              <span>
                {verifiedIndicator} {doc?.shortName}
              </span>
              {index !== documentDetails.length - 1 && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        })
        : ["-"];
      docsHoverText.push(docHoverTextArray);

      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount > data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }

      crs.push(data?.clarificationRequiredFor || "0");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      // const validNotes = data?.notesDetails?.filter(note => note?.notes?.notes) || [];
      const validNotes = data?.notesDetails?.filter(
        log => log?.notes?.notes && (!log?.private || log?.user?.id === users?.id)
      ) || [];
      notes.push(validNotes?.length || "-");
      notesIcon.push(
        validNotes.length > 0 ? (
          <NoteAltOutlinedIcon style={{ fontSize: 20, color: "#2C2C2C" }} />
        ) : ("")
      );
      const notesHoverTextArray = validNotes?.length > 0
        ? validNotes.map((note, index) => {
          const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
          const firstName = note?.user?.name?.firstName || '';
          const title = note?.title;
          const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy 'at' h:mm a") || '';
          const noteContent = `${firstName}, ${title} ${createdDate}`;
          return (
            <div key={index}>
              {note?.private && <span className={style.privateBorderText}>Private</span>}
              {" "}{noteContent}
              <div>{text}</div>
              {/* { validNotes?.length  && <hr style={{ borderColor: '#E0E0E0' }} />} */}
              {index !== validNotes.length && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        }).reverse()
        : ["-"];
      notesHoverText.push(notesHoverTextArray);
      if (workflow) {
        macdate.push(
          workflow?.meetingDate
            ? format(new Date(`${workflow?.meetingDate}T00:00`), "MM/dd/yyyy")
            : "-"
        );
      }
      // notesHoverText.push([
      //   "June 13 00:00, Nina Grealy",
      //   "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      // ]);
      // cosapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 2]?.role === "Chief Of Staff") {
      //   cosapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
      //   )
      // } else { cosapproval.push("-") }
      // if (data?.tasks?.completedCount === 0) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }} />);
      // } else if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }} />);
      // }  else {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }} />);
      // }

      // taskListStatus.push(data?.tasks.completedCount + "/" + data?.tasks.totalCount);
      // if (workflowCredRole) {
      //   const color = workflowCredRole.currentLevelStatus === "IN_PROGRESS" ? "yellow"
      //     : workflowCredRole.currentLevelStatus === "COMPLETED" ? "green"
      //       : "grey";
      //       cc.push(color);
      //   console.log("Matching workflow found:", {
      //     role: workflowCredRole.role,
      //     status: workflowCredRole.currentLevelStatus,
      //     assignedColor: color
      //   });
      // }
      // cc.push("green");
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "checkbox", value: checkbox },
      // { type: "dot", value: dot },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: department },
      // {
      //   type: "iconWithCount",
      //   value: docs,
      //   hoverText: docsHoverText,
      //   isShowHoverText: true,
      //   icon: docsIcon,
      // },
      // {
      //   type: "text",
      //   value: crs,
      //   hoverText: crsHoverText,
      //   isShowHoverText: true,
      // },
      {
        type: "iconWithCount",
        value: notes,
        hoverText: notesHoverText,
        isShowHoverText: true,
        icon: notesIcon,
      },
      // { type: "text", value: ccapproval },
      // { type: "text", value: cosapproval },
      // { type: "iconWithCount", value: taskListStatus,icon: taskListDotColor },
      // {
      //   type: "dot",
      //   value: cc
      // },
      {
        type: "text",
        value: macdate,
      },
      { type: "action", value: action },
    ];
  }

  const getBodValues = applicationType === "NEW" ? () => {
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
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      ref.push(data?.ref || "-");
      // macapproval.push(data?.macapproval || "05/05/2024");
      // macapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      if (data?.logs[data?.logs?.length - 1]?.role === "Advisory Committee") {
        macapproval.push(
          format(new Date(data?.logs[data?.logs?.length - 1].createdDate), "MMM dd, yyyy")
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
      // { type: "text", value: applicantId },
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
  } : () => {
    // checkbox= [];
    dot = [];
    applicantName = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    crs = [];
    crsHoverText = [];
    notes = [];
    notesHoverText = [];
    notesIcon = [];
    // cosapproval = [];
    taskListStatus = [];
    taskListDotColor = [];
    cc = [];
    mac = [];
    boddate = [];
    action = [];

    tableData?.map((data) => {
      // const workflowCredRole = data?.completedWorkflows?.find(workflow => workflow.role === "Credentialing Committee");
      // const workflowMacRole = data?.completedWorkflows?.find(workflow => workflow.role === "Advisory Committee");
      checkbox.push(
        <CommonCheckBox
          checked={checkedIds.includes(data.id)}
          onChange={() => handleCheckboxClick(data.id)}
          color="primary"
          inputProps={{ 'aria-label': `Select ${data.name}` }}
        />
      );
      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Board"));
      // if (workflow) {
      //   const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
      //     : workflow?.currentLevelStatus === "COMPLETED" ? "green"
      //       : "grey";
      //   dot.push(color);
      //   console.log("Matching workflow found:", {
      //     role: workflow?.role,
      //     status: workflow?.currentLevelStatus,
      //     assignedColor: color
      //   });
      // }
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );

      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );
      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails?.length > 0 ? documentDetails.map(doc => doc.documentType) : ["-"];
      const docHoverTextArray = documentDetails?.length > 0
        ? documentDetails?.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />
          return (
            <div key={index} className={style.fullWidth}>
              <span>
                {verifiedIndicator} {doc?.shortName}
              </span>
              {index !== documentDetails.length - 1 && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        })
        : ["-"];
      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount > data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }
      // ccapproval.push(data?.ccapproval || "05/05/2024");
      // ccapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 1]?.role === "Credentialing Committee") {
      //   ccapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      //   )
      // } else { ccapproval.push("-") }

      crs.push(data?.clarificationRequiredFor || "0");
      crsHoverText.push(["Ontario Medical Society"]);
      // const validNotes = data?.notesDetails?.filter(note => note?.notes?.notes) || [];
      const validNotes = data?.notesDetails?.filter(
        log => log?.notes?.notes && (!log?.private || log?.user?.id === users?.id)
      ) || [];
      notes.push(validNotes?.length || "-");
      notesIcon.push(
        validNotes.length > 0 ? (
          <NoteAltOutlinedIcon style={{ fontSize: 20, color: "#2C2C2C" }} />
        ) : ("")
      );
      const notesHoverTextArray = validNotes?.length > 0
        ? validNotes.map((note, index) => {
          const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
          const firstName = note?.user?.name?.firstName || '';
          const title = note?.title;
          const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy 'at' h:mm a") || '';
          const noteContent = `${firstName}, ${title} ${createdDate}`;
          return (
            <div key={index}>
              {note?.private && <span className={style.privateBorderText}>Private</span>}
              {" "}{noteContent}
              <div>{text}</div>
              {/* { validNotes?.length  && <hr style={{ borderColor: '#E0E0E0' }} />} */}
              {index !== validNotes.length && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        }).reverse()
        : ["-"];
      notesHoverText.push(notesHoverTextArray);
      if (workflow) {
        boddate.push(
          workflow?.meetingDate
            ? format(new Date(`${workflow?.meetingDate}T00:00`), "MM/dd/yyyy")
            : "-"
        );
      }
      // notesHoverText.push([
      //   "June 13 00:00, Nina Grealy",
      //   "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      // ]);
      // cosapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 2]?.role === "Chief Of Staff") {
      //   cosapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
      //   )
      // } else { cosapproval.push("-") }
      // if (data?.tasks?.completedCount === 0) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }} />);
      // } else if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }} />);
      // }  else {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }} />);
      // }

      // taskListStatus.push(data?.tasks.completedCount + "/" + data?.tasks.totalCount);
      // if (workflowCredRole) {
      //   const color = workflowCredRole?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
      //     : workflowCredRole?.currentLevelStatus === "COMPLETED" ? "green"
      //       : "grey";
      //       cc.push(color);
      //   console.log("Matching workflow found:", {
      //     role: workflowCredRole.role,
      //     status: workflowCredRole?.currentLevelStatus,
      //     assignedColor: color
      //   });
      // }
      // if (workflowMacRole) {
      //   const color = workflowMacRole?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
      //     : workflowMacRole?.currentLevelStatus === "COMPLETED" ? "green"
      //       : "grey";
      //       mac.push(color);
      //   console.log("Matching workflow found:", {
      //     role: workflowMacRole.role,
      //     status: workflowMacRole.currentLevelStatus,
      //     assignedColor: color
      //   });
      // }
      // mac.push("green");
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "checkbox", value: checkbox },
      // { type: "dot", value: dot },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: department },
      // {
      //   type: "iconWithCount",
      //   value: docs,
      //   hoverText: docsHoverText,
      //   isShowHoverText: true,
      //   icon: docsIcon,
      // },
      // {
      //   type: "text",
      //   value: crs,
      //   hoverText: crsHoverText,
      //   isShowHoverText: true,
      // },
      {
        type: "iconWithCount",
        value: notes,
        hoverText: notesHoverText,
        isShowHoverText: true,
        icon: notesIcon,
      },
      // { type: "text", value: ccapproval },
      // { type: "text", value: cosapproval },
      // { type: "iconWithCount", value: taskListStatus,icon: taskListDotColor },
      // {
      //   type: "dot",
      //   value: cc
      // },
      // {
      //   type: "dot",
      //   value: mac
      // },
      {
        type: "text",
        value: boddate,
      },
      { type: "action", value: action },
    ];
  }

  const getClarificationValues = applicationType === "NEW" ? () => {
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
    taskListDotColor = [];
    action = [];

    tableData?.map((data) => {
      // dot.push(
      //   data?.currentLevelCompleted === false
      //     ? "yellow"
      //     : data?.currentLevelCompleted === true
      //       ? "green"
      //       : "grey"
      // );

      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Staff Manager"));
      if (workflow) {
        const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
          : workflow?.currentLevelStatus === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.currentLevelStatus,
          assignedColor: color
        });
      }
      applicantName.push(
        `${data?.applicant?.name?.lastName.toUpperCase()}, ${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()}` ||
        " "
      );
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      docs.push(data?.documents?.uploadedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      const docHoverTextArray = documentDetails?.length > 0 ? documentDetails?.map(doc => doc.documentType) : ["-"];
      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === data?.documents?.uploadedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }} />);
      }
      // else if (data?.documents?.verifiedCount === 0) {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#94979A` }} />);
      // } else {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#FEC106` }} />);
      // }
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      crs.push(data?.clarificationRequiredFor || "-");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      const notesDetails = data?.notes || [];
      const notesHoverTextArray = notesDetails?.length > 0 ? notesDetails?.map(note => note?.notes) : ["-"];
      // notesHoverText.push([
      //   "June 13 00:00, Nina Grealy",
      //   "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      // ]);
      notesHoverText.push(notesHoverTextArray);

      if (data?.tasks?.completedCount === 0) {
        taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }} />);
      } else if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
        taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }} />);
      } else {
        taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }} />);
      }

      taskListStatus.push(data?.tasks?.completedCount + "/" + data?.tasks?.totalCount);
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
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department },
      {
        type: "iconWithCount",
        // value: docs,
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
      {
        type: "iconWithCount",
        value: taskListStatus,
        icon: taskListDotColor
      },
      // { type: "dot", value: taskListDotColor, tooltipValue: dotTooltipValues },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  } : () => {
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
    taskListDotColor = [];
    submitted = [];
    action = [];

    tableData?.map((data) => {
      // dot.push(
      //   data?.currentLevelCompleted === false
      //     ? "yellow"
      //     : data?.currentLevelCompleted === true
      //       ? "green"
      //       : "grey"
      // );

      const workflow = data?.completedWorkflows?.find(workflow => (workflow?.role === "Staff Manager"));

      // For debugging the userRole
      // data?.completedWorkflows?.forEach((workflow, index) => {
      //     const isRoleMatch = userRole?.includes(workflow.role);
      //     console.log(`Workflow ${index}:`, {
      //         workflowRole: workflow.role,
      //         hasMatchingRole: isRoleMatch,
      //         status: isRoleMatch ? workflow.currentLevelStatus : 'N/A'
      //     });
      // });

      // Check currentLevelStatus and set color if workflow is found
      if (workflow) {
        const color = workflow?.currentLevelStatus === "IN_PROGRESS" ? "yellow"
          : workflow?.currentLevelStatus === "COMPLETED" ? "green"
            : "grey";
        dot.push(color);
        console.log("Matching workflow found:", {
          role: workflow?.role,
          status: workflow?.currentLevelStatus,
          assignedColor: color
        });
      }
      // applicantName.push(
      //   ` ${data?.applicant?.name?.lastName.toUpperCase()}, ${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()}` ||
      //   " "
      // );
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantId.push(data?.displayId);
      applicantType.push(data?.providerType?.serviceProviderType);
      department.push(
        `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
      );
      docs.push(data?.documents?.verifiedCount + "/" + data?.documents?.uploadedCount || "");
      // docsHoverText.push([
      //   "Immunization History Verification From PCP pending",
      // ]);
      const documentDetails = data?.documents?.documentDetails || [];
      // const docHoverTextArray = documentDetails?.length > 0 ? documentDetails?.map(doc => doc?.shortName) : ["-"];
      const docHoverTextArray = documentDetails?.length > 0
        ? documentDetails?.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />;

          return (
            <div key={index} className={style.fullWidth}>
              <span>
                {verifiedIndicator} {doc?.shortName}
              </span>
              {index !== documentDetails.length - 1 && (
                <hr style={{ margin: '5px 0 -10px 0px' }} />
              )}
            </div>
          );
        })
        : ["-"];

      docsHoverText.push(docHoverTextArray);
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon
      //     style={{ fontSize: 20, color: `#2C2C2C` }}
      //   />
      // );

      if (data?.documents?.uploadedCount === 0 || data?.documents?.verifiedCount === 0) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#b0a6a6' }} />);
      } else if (data?.documents?.uploadedCount > data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#FEC106' }} />);
      } else if (data?.documents?.uploadedCount === data?.documents?.verifiedCount) {
        docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: '#00C07F' }} />);
      }

      // else if (data?.documents?.verifiedCount === 0) {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#94979A` }} />);
      // } else {
      //   docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#FEC106` }} />);
      // }
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      // crs.push(data?.clarificationRequiredFor || "0");
      // crsHoverText.push(["Ontario Medical Society"]);
      crs.push(data?.clarificationCount?.closedCount + "/" + data?.clarificationCount?.totalCount || "");
      const validNotes = data?.notesDetails?.filter(
        log => log?.notes?.notes && (!log?.private || log?.user?.id === users?.id)
      ) || [];
      notes.push(validNotes?.length || "-");
      notesIcon.push(
        validNotes.length > 0 ? (
          <NoteAltOutlinedIcon style={{ fontSize: 20, color: "#2C2C2C" }} />
        ) : ("")
      );
      const notesHoverTextArray = validNotes?.length > 0
        ? validNotes.map((note, index) => {
          const text = note?.notes?.notes ? note?.notes?.notes.replace(/<[^>]*>/g, '') : '-';
          const firstName = note?.user?.name?.firstName || '';
          const title = note?.title;
          const createdDate = format(new Date(note?.createdDate), "MMM dd, yyyy 'at' h:mm a") || '';
          const noteContent = `${firstName}, ${title} ${createdDate}`;
          return (
            <div key={index}>
              {note?.private && <span className={style.privateBorderText}>Private</span>}
              {" "}{noteContent}
              <div>{text}</div>
              {/* { validNotes?.length  && <hr style={{ borderColor: '#E0E0E0' }} />} */}
              {index !== validNotes.length && (
                <hr style={{ margin: '5px 0px -10px 0' }} />
              )}
            </div>
          );
        }).reverse()
        : ["-"];
      notesHoverText.push(notesHoverTextArray);
      // if (data?.tasks?.completedCount === 0) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }} />);
      // } else if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#00C07F` }} />);
      // }  else {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FEC106` }} />);
      // }

      // taskListStatus.push(data?.tasks?.completedCount + "/" + data?.tasks?.totalCount);

      // data?.logs?.forEach((log) => {
      //   if (log?.workflowStatus === "SUBMITTED") {
      //     submitted.push(format(new Date(log?.lastModifiedDate), "MM/dd/yyyy"));
      //   }
      // });
      lastUpdated.push(
        data?.clarificationUpdatedDate 
          ? format(new Date(data?.clarificationUpdatedDate), "MMM dd, yyyy") 
          : "-"
      );
      // lastUpdatedBy.push(["Last Updated By", data?.updatedBy?.name?.firstName]);
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      // capManager.push(data?.interviewDetails?.interviewedBy || '- ');
      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      { type: "text", value: department },
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
        // type: "countWithHover",
        type: "text",
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
      // {
      //   type: "iconWithCount",
      //   value: taskListStatus,
      //   icon: taskListDotColor
      // },
      // { type: "dot", value: taskListDotColor, tooltipValue: dotTooltipValues },
      // {
      //   type: "text",
      //   value: submitted,
      //   // hoverText: lastUpdatedBy,
      //   // isShowHoverText: true,
      // },
      {
        type: "text",
        value: lastUpdated,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      { type: "action", value: action },
    ];
  }

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
      applicantType.push(data?.providerType?.serviceProviderType);
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
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
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

  const getLocumValues = () => {
    applicantName = [];
    applicantType = [];
    clarificationTitle = [];
    raisedBy = [];
    createdOn = [];
    lastUpdatedOn = [];
    action = [];

    tableData?.map((data) => {
      applicantName.push(`${data?.applicant?.name?.firstName.charAt(0).toUpperCase() + data?.applicant?.name?.firstName.slice(1).toLowerCase()},  ${data?.applicant?.name?.lastName.toUpperCase()}` ||
        " ");
      applicantType.push(data?.staffId || "-");
      clarificationTitle.push(data?.type || "-");
      raisedBy.push(data?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name || "-");
      createdOn.push(data?.expiryDate || "-");
      lastUpdatedOn.push("lastUpdatedOn");
      action.push(true);
    });

    return [
      { type: "text", value: applicantName },
      { type: "text", value: applicantType },
      { type: "text", value: clarificationTitle },
      { type: "text", value: raisedBy },
      { type: "text", value: createdOn },
      { type: "text", value: lastUpdatedOn },
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
      applicantType.push(data?.providerType?.serviceProviderType);
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

  const applicantActionsData = applicationType === "NEW" ? [
    {
      data: "View & Verify",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyLevelFunction,
    },
    // {
    //   data: "Send for Dept Head Review",
    //   requiredValue: "boolean",
    //   onClick: onClickMoveToNextFunction,
    // },
    {
      data: applicationType === "NEW" ? "Applicant Processing Tasks" : "Staff Processing Tasks",
      requiredValue: "boolean",
      onClick: onClickProcessingTaskFunction,
    },
    {
      data: "Request For Clarification",
      requiredValue: "boolean",
      isParagraph: true,
    },
    { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true },
  ] : [
    {
      data: "View & Verify",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyLevel1Function,
    },
    {
      data: "Send for Dept Head Review",
      requiredValue: "boolean",
      onClick: onClickDeptReviewDialog,
      conditionToShow: `!data?.completedWorkflows?.find(wf => wf?.role === "Staff Manager")?.allFormsApproved === false`,
    },
    {
      data: "Create Note",
      requiredValue: "boolean",
      onClick: onClickNotesDialog,
    },
    // {
    //   data: "Go to Task List",
    //   requiredValue: "boolean",
    //   onClick: onClickProcessingTaskFunction,
    // },
    // {
    //   data: "Update Staff Status",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Request For Clarification",
    //   requiredValue: "boolean",
    //   isParagraph: true,
    // },
    // { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: onClickClarificationRequrstFromApplicantDialog, isIndent: true },
    // { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true },
    // { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true },
  ]

  const departmentHeadActionsData = [
    {
      data: workModeType === "Staff Manager" ? "View" : "Review to Recommend",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyDeptFunction,
      // conditionToShow: `data?.completedWorkflows?.find(wf => wf?.role === "Department Head")?.approverDetail?.name?.firstName === ${userFirstName}`,
    },
    // {
    //   data: "Send for Dept Head Review",
    //   requiredValue: "boolean",
    //   // onClick: onClickDeptReviewDialog,
    //   conditionToShow: `data?.completedWorkflows?.find(wf => wf?.role === "Department Head")?.approverDetail?.name?.firstName === ${userFirstName}`,
    // },
    { data: "Create Note", requiredValue: "boolean", onClick: onClickNotesDialog, hideForRoles: "Staff Manager" },
    // {
    //   data: applicationType === "NEW" ? "Applicant Processing Tasks" : "Staff Processing Tasks",
    //   requiredValue: "boolean",
    //   onClick: onClickProcessingTaskFunction,
    //   hideForRoles: "Staff Manager",
    //   showForRoles: "Chief Of Staff",
    //   showForRoles2: "Department Head",
    // },
    // {
    //   data: "Send for Cred Comm Review",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Move To Cred Comm for Review",
    //   requiredValue: "boolean",
    //   onClick: onClickMoveToNextFunction,
    //   //  onClick: onClickViewAndVerifyFunction,
    //   hideForRoles: userRole,
    // },
    // {
    //   data: "Request For Clarification",
    //   requiredValue: "boolean",
    //   isParagraph: true,
    //   hideForRoles: "Staff Manager",
    //   hideForRoles2: "Chief Of Staff",
    //   showForRoles: "Department Head",
    // },
    // { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager",hideForRoles2: "Chief Of Staff", showForRoles: "Department Head", },
    // { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Chief Of Staff", showForRoles: "Department Head", },
    // { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Chief Of Staff", showForRoles: "Department Head", },
  ];

  const credUserActionsData = [
    {
      data: "Modify CC Meeting Date",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyDateSetFunction,
      conditionToShow: `data?.completedWorkflows?.find((wf) => wf?.role === "Credentialing Committee")?.meetingDate`,
    },
    {
      data: "Designate CC Meeting Date",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyDateSetFunction,
      conditionToShow: `!data?.completedWorkflows?.find((wf) => wf?.role === "Credentialing Committee")?.meetingDate`,
    },
    {
      data: "Update CC Approval Status",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyApproveFromCCFunction,
      conditionToShow: `data?.completedWorkflows?.find((wf) => wf?.role === "Credentialing Committee")?.approvalType && data?.completedWorkflows?.find((wf) => wf?.role === "Credentialing Committee")?.meetingDate`,
    },
    // { data: "Create Note", requiredValue: "boolean", onClick: onClickNotesDialog },
  ];

  const applicationActionsData = applicationType === "NEW" ? [
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
    // {
    //   data: "Send for Cred Comm Review",
    //   requiredValue: "boolean",
    //   onClick: onClickMoveToNextFunction,
    // },
    { data: (workModeType === "Staff Manager") || (workModeType === "Department Head") ? "View" : "Review & Approve", requiredValue: "boolean", onClick: onClickViewAndVerifyLevelFunction },
    // { data: "Move to MAC", requiredValue: "boolean", onClick: onClickMoveToNextFunction, hideForRoles: userRole, },
    // { data: "Review & Approve", requiredValue: "boolean", onClick: "" },
    // { data: "Move to MAC", requiredValue: "boolean", onClick: "" },
    {
      data: "Request For Clarification",
      requiredValue: "boolean",
      isParagraph: true,
      hideForRoles: "Staff Manager",
      hideForRoles2: "Department Head",
      // showForRoles: "Chief Of Staff",
      // showForRoles2: "Credentialing Committee",
    },
    {
      data: `From ${workModeType}`,
      requiredValue: "boolean",
      onClick: "",
      isIndent: true,
      hideForRoles: "Staff Manager",
      hideForRoles2: "Department Head",
      // showForRoles: "Chief Of Staff",
      // showForRoles: ["Chief Of Staff","Credentialing Committee"],
    },
    { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Department Head", },
    { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Department Head", },
    { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Department Head", },
  ] : [
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
    // {
    //   data: "Send for Cred Comm Review",
    //   requiredValue: "boolean",
    //   onClick: onClickMoveToNextFunction,
    // },
    { data: (workModeType === "Staff Manager") || (workModeType === "Department Head") || (workModeType === "Chief Of Staff") ? "View" : "Review to Recommend", requiredValue: "boolean", onClick: onClickViewAndVerifyCredFunction },
    { data: "Create Note", requiredValue: "boolean", onClick: onClickNotesDialog, hideForRoles: "Staff Manager", hideForRoles2: "Department Head", hideForRoles3: "Chief Of Staff" },
    // { data: "Go to Task List", requiredValue: "boolean", onClick: "",hideForRoles: "Staff Manager", hideForRoles2: "Department Head"},
    // { data: "Move to MAC", requiredValue: "boolean", onClick: "" },
    // {
    //   data: "Request For Clarification",
    //   requiredValue: "boolean",
    //   isParagraph: true,
    //   hideForRoles: "Staff Manager",
    //   hideForRoles2: "Department Head",
    //   hideForRoles3: "Chief Of Staff",
    //   // showForRoles: "Chief Of Staff",
    //   // showForRoles2: "Credentialing Committee",
    // },
    // // {
    // //   data: `From ${userRole}`,
    // //   requiredValue: "boolean",
    // //   onClick: "",
    // //   isIndent: true,
    // //   hideForRoles: "Staff Manager",
    // //   hideForRoles2: "Department Head",
    // //   // showForRoles: "Chief Of Staff",
    // //   // showForRoles: ["Chief Of Staff","Credentialing Committee"],
    // // },
    // { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Department Head",hideForRoles3: "Chief Of Staff" },
    // { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Department Head",hideForRoles3: "Chief Of Staff" },
    // { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Staff Manager", hideForRoles2: "Department Head",hideForRoles3: "Chief Of Staff" },
  ]

  const macActionsData = applicationType === "NEW" ? [
    // {
    //   data: "View & Verify",
    //   requiredValue: "boolean",
    //   onClick: onClickViewAndVerifyFunction,
    // },
    // {
    //   data: "Send for board Review",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Request for Clarification",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // { data: "Move to BOD", requiredValue: "boolean", onClick: onClickMoveToNextFunction, },
    // { data: "Move to BOD", requiredValue: "boolean", onClick: "" },
    // {
    //   data: "Request For Clarification",
    //   requiredValue: "boolean",
    //   isParagraph: true,
    // },
    // { data: "MAC Approval", requiredValue: "boolean", onClick: "", isIndent: true },
    // { data: "Print Summary For MAC", requiredValue: "boolean", onClick: "", isIndent: true },
    // { data: "Applicant Processing Tasks", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: (workModeType === "Department Head") || (workModeType === "Credentialing Committee") ? "View" : "MAC Review", requiredValue: "boolean", onClick: onClickViewAndVerifyFunction, },
    { data: "Print Summary For MAC", requiredValue: "boolean", onClick: "", hideForRoles: "Department Head", hideForRoles2: "Credentialing Committee" },
    { data: applicationType === "NEW" ? "Applicant Processing Tasks" : "Staff Processing Tasks", requiredValue: "boolean", onClick: onClickProcessingTaskFunction, hideForRoles: "Department Head", hideForRoles2: "Credentialing Committee" },
  ] : [
    // { data: (workModeType === "Department Head") || (workModeType === "Credentialing Committee") ? "View" : "MAC Review", requiredValue: "boolean", onClick: onClickViewAndVerifyFunction, },
    {
      data: "Modify MAC Meeting Date",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyDateSetMACFunction,
      conditionToShow: `data?.completedWorkflows?.find((wf) => wf?.role === "Advisory Committee")?.meetingDate`,
    },
    {
      data: "Designate MAC Meeting Date",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyDateSetMACFunction,
      conditionToShow: `!data?.completedWorkflows?.find((wf) => wf?.role === "Advisory Committee")?.meetingDate`,
    },
    {
      data: (workModeType === "Department Head") || (workModeType === "Credentialing Committee") || (workModeType === "Chief Of Staff") ? "View" : "Update MAC Approval Status",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyApproveFromMACFunction,
      conditionToShow: `data?.completedWorkflows?.find((wf) => wf?.role === "Advisory Committee")?.meetingDate`,
    },
    { data: "Create Note", requiredValue: "boolean", onClick: onClickNotesDialog, hideForRoles: "Department Head", hideForRoles2: "Credentialing Committee" },
    // { data:  "Go to Task List", requiredValue: "boolean", onClick: onClickProcessingTaskFunction, hideForRoles: "Department Head", hideForRoles2: "Credentialing Committee" },
    // {
    //   data: "Request For Clarification",
    //   requiredValue: "boolean",
    //   isParagraph: true,
    //   hideForRoles: "Credentialing Committee",
    //   hideForRoles2: "Department Head",
    // },
    // { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Credentialing Committee", hideForRoles2: "Department Head", },
    // { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Credentialing Committee", hideForRoles2: "Department Head", },
    // { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Credentialing Committee", hideForRoles2: "Department Head", },
  ]

  const bodActionsData = applicationType === "NEW" ? [
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
    // { data: "BOD Move Approval Status", requiredValue: "boolean", onClick: onClickMoveToNextFunction },
    { data: (workModeType === "Department Head") || (workModeType === "Credentialing Committee") ? "View" : "BOD Approval Status", requiredValue: "boolean", onClick: onClickViewAndVerifyFunction },
    { data: "Print Summary For BOD", requiredValue: "boolean", onClick: "", hideForRoles: "Department Head", hideForRoles2: "Credentialing Committee" },
    { data: applicationType === "NEW" ? "Applicant Processing Tasks" : "Staff Processing Tasks", requiredValue: "boolean", onClick: onClickProcessingTaskFunction, hideForRoles: "Department Head", hideForRoles2: "Credentialing Committee" },
  ] : [
    // { data: (workModeType === "Department Head") || (workModeType === "Credentialing Committee") ? "View" : "BOD Approval", requiredValue: "boolean", onClick: onClickViewAndVerifyFunction, },
    {
      data: "Modify BOD Meeting Date",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyDateSetBODFunction,
      conditionToShow: `data?.completedWorkflows?.find((wf) => wf?.role === "Board")?.meetingDate`,
    },
    {
      data: "Designate BOD Meeting Date",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyDateSetBODFunction,
      conditionToShow: `!data?.completedWorkflows?.find((wf) => wf?.role === "Board")?.meetingDate`,
    },
    {
      data: (workModeType === "Department Head") || (workModeType === "Credentialing Committee") || (workModeType === "Chief Of Staff") ? "View" : "Update BOD Approval Status",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyApproveFromBODFunction,
      conditionToShow: `data?.completedWorkflows?.find((wf) => wf?.role === "Board")?.meetingDate`,
    },
    {
      data: "Go to Task List",
      requiredValue: "boolean",
      onClick: onClickProcessingTaskFunction,
      hideForRoles: "Department Head",
      hideForRoles2: "Credentialing Committee",
      conditionToShow: `data?.completedWorkflows?.find(wf => wf?.role === "Board")?.approvalType`,
    },
    { data: "Create Note", requiredValue: "boolean", onClick: onClickNotesDialog, hideForRoles: "Department Head", hideForRoles2: "Credentialing Committee" },
    // {
    //   data: "Request For Clarification",
    //   requiredValue: "boolean",
    //   isParagraph: true,
    //   hideForRoles: "Credentialing Committee",
    //   hideForRoles2: "Department Head",
    // },
    // { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Credentialing Committee", hideForRoles2: "Department Head" },
    // { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Credentialing Committee", hideForRoles2: "Department Head" },
    // { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true, hideForRoles: "Credentialing Committee", hideForRoles2: "Department Head" },
  ]

  const clarificationActionsData = applicationType === "NEW" ? [
    {
      data: "View & Verify",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyLevelFunction,
    },
    {
      data: applicationType === "NEW" ? "Applicant Processing Tasks" : "Staff Processing Tasks",
      requiredValue: "boolean",
      onClick: onClickProcessingTaskFunction,
    },
    {
      data: "Request For Clarification",
      requiredValue: "boolean",
      isParagraph: true,
    },
    { data: applicationType === "NEW" ? "From Applicant" : "From Staff", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Internal Approver", requiredValue: "boolean", onClick: "", isIndent: true },
    { data: "From Institution", requiredValue: "boolean", onClick: "", isIndent: true },
  ] : [
    {
      data: "View & Verify",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyLevel1Function,
    },
    {
      data: "Create Note",
      requiredValue: "boolean",
      onClick: onClickNotesDialog,
    },
  ]

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
    { data: applicationType === "NEW" ? "Applicant Processing Tasks" : "Staff Processing Tasks", requiredValue: "boolean", onClick: "" },
  ];

  const approvedActionsData = [
    {
      data: "Add as active staff",
      requiredValue: "boolean",
      onClick: ""
    },
    // {
    //   data: "Send follow up disclosures",
    //   requiredValue: "boolean",
    //   onClick: () => { },
    // },
  ];

  const reappointmentActionsData = [];

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleShowForSearch = () => {
    console.log('search', searchTerm)
    setSearchTermForTable(searchTerm)
  }

  let tableHeaderValues =
    selectedTab === "level-1"
      ? applicantHeaderValues
      : selectedTab === "level-2"
        ? departmentHeadHeaderValues
        : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Credentialing Committee"
          ? applicationHeaderValues
          : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Staff Manager"
            ? credUserHeaderValues
            : selectedTab === "level-4"
              ? macHeaderValues
              : selectedTab === "level-5"
                ? bodHeaderValues
                : selectedTab === "LocumRenewals"
                  ? locumHeaderValues
                  : selectedTab === "clarificationsRequired"
                    ? clarificationHeaderValues
                    : selectedTab === "rejected"
                      ? rejectedHeaderValues
                      // :[];

                      // : approvedHeaderValues;
                      : applicantHeaderValues;
  let tableSortValues =
    selectedTab === "level-1"
      ? applicantColSortValues
      : selectedTab === "level-2"
        ? departmentHeadColSortValues
        : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Credentialing Committee"
          ? applicationColSortValues
          : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Staff Manager"
            ? credUserColSortValues
            : selectedTab === "level-4"
              ? macColSortValues
              : selectedTab === "level-5"
                ? bodColSortValues
                : selectedTab === "LocumRenewals"
                  ? locumColSortValues
                  : selectedTab === "clarificationsRequired"
                    ? clarificationColSortValues
                    : selectedTab === "rejected"
                      ? rejectedColSortValues
                      // :[];

                      // : approvedColSortValues;
                      : applicantColSortValues;
  let tableDataValues =
    selectedTab === "level-1"
      ? getApplicantValues()
      : selectedTab === "level-2"
        ? getDepartmentHeadValues()
        : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Credentialing Committee"
          ? getApplicationValues()
          : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Staff Manager"
            ? getCredUserValues()
            : selectedTab === "level-4"
              ? getMacValues()
              : selectedTab === "level-5"
                ? getBodValues()
                : selectedTab === "LocumRenewals"
                  ? getLocumValues()
                  : selectedTab === "clarificationsRequired"
                    ? getClarificationValues()
                    : selectedTab === "rejected"
                      ? getRejectedValues()
                      // :[];

                      // : getApprovedValues();
                      : getApplicantValues();
  let actions =
    selectedTab === "level-1"
      ? applicantActionsData
      : selectedTab === "level-2"
        ? departmentHeadActionsData
        : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Credentialing Committee"
          ? applicationActionsData
          : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Staff Manager"
            ? credUserActionsData
            : selectedTab === "level-4"
              ? macActionsData
              : selectedTab === "level-5"
                ? bodActionsData
                : selectedTab === "LocumRenewals"
                  ? departmentHeadActionsData
                  : selectedTab === "clarificationsRequired"
                    ? clarificationActionsData
                    : selectedTab === "rejected"
                      ? rejectedActionsData
                      // :[];

                      : applicantActionsData;
  // : applicantActionsData;
  let gridStyle =
    selectedTab === "level-1" && applicationType === "NEW"
      ? style.applicantStaffGrid
      : selectedTab === "level-1" && applicationType === "REAPPOINTMENT"
        ? style.applicantStaffReappointGrid
        : selectedTab === "level-2"
          ? style.departmentHeadStaffGrid
          : selectedTab === "level-3" && applicationType === "NEW"
            ? style.applicationStaffGrid
            : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Credentialing Committee"
              ? style.applicationStaffReappointGrid
              : selectedTab === "level-3" && applicationType === "REAPPOINTMENT" && workModeType === "Staff Manager"
                ? style.credUserStaffReappointGrid
                : selectedTab === "level-4" && applicationType === "NEW"
                  ? style.macStaffGrid
                  : selectedTab === "level-4" && applicationType === "REAPPOINTMENT"
                    ? style.macStaffReappointGrid
                    : selectedTab === "level-5" && applicationType === "NEW"
                      ? style.bodStaffGrid
                      : selectedTab === "level-5" && applicationType === "REAPPOINTMENT"
                        ? style.bodStaffReappointGrid
                        : selectedTab === "LocumRenewals"
                          ? style.locumStaffGrid
                          : selectedTab === "clarificationsRequired" && applicationType === "NEW"
                            ? style.applicantStaffGrid
                            : selectedTab === "clarificationsRequired" && applicationType === "REAPPOINTMENT"
                              ? style.applicantStaffReappointGrid
                              : selectedTab === "rejected"
                                ? style.rejectedStaffGrid
                                // :[];

                                // : style.approvedStaffGrid;
                                : style.applicantStaffReappointGrid;

  return (
    <>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}

      {/* {!isLoadingImage && ( */}

      <div className={style.margin20}>
        <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
              <>
                {applicationType === "REAPPOINTMENT" && (
                  <div className={style.searchFieldAlignment}>
                    <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={true} onClickFunc={onClickViewAndVerifyLevel1Function} />
                  </div>
                )}
                {!(applicationType === "REAPPOINTMENT" && ((workModeType === "Department Head") || (workModeType === "Credentialing Committee") || (workModeType === "Advisory Committee") || (workModeType === "Board"))) ? (
                  <div
                    className={`${style.addStyle} ${style.displayInRow} ${style.applicationButton} ${style.marginTop10} ${style.alignCenter} ${style.cursorPointer} ${style.cardStyle}`}
                  >
                    <div className={`${style.displayInRow} ${style.alignCenter}`}>
                      {applicationType === "NEW" && (
                        <AddCircleOutlineIcon
                          sx={{ fontSize: 20, color: "white" }}
                          onClick={() =>
                            applicationType === "NEW"
                              ? navigate("/createStaffMemberApplication")
                              : navigate("/createStaffReapplication")
                          }
                        />
                      )}
                      <div
                        className={`${style.alignCenter} ${style.marginLeft10}`}
                        onClick={() =>
                          applicationType === "NEW"
                            ? navigate("/createStaffMemberApplication")
                            : navigate("/createStaffReapplication")
                          // : navigate("/ApplicantPortalRFC")


                        }
                      >
                        {applicationType === "REAPPOINTMENT"
                          ? `Staff for Reappointment (${reappointCount})`
                          : "Create New Application"}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* {!(applicationType === "REAPPOINTMENT" && ((workModeType === "Department Head") || (workModeType === "Credentialing Committee") || (workModeType === "Advisory Committee") || (workModeType === "Board"))) ? (
                  <div
                    className={`${style.addStyle} ${style.displayInRow} ${style.applicationButton} ${style.marginTop10} ${style.alignCenter} ${style.cursorPointer} ${style.cardStyle}`}
                  >
                    {(applicationType === "NEW" || applicationType === "REAPPOINTMENT") && (
                      <div className={`${style.displayInRow} ${style.alignCenter}`}>
                        <div
                          className={`${style.displayInRow} ${style.alignCenter}`}
                          onClick={() => navigate("/historicalData")}
                        >
                          Fill Historical Data
                        </div>
                      </div>
                    )}
                  </div>
                ) : null} */}
                {/* <div className={`${style.searchContainer}`}>
                  <SearchOutlinedIcon className={`${style.searchIcon}`} 
                    sx={{
                      fontSize: 25,
                      // color: isPrintClicked ? "#fff" : "#06617A",
                    }}
                  />
                  <CommonInputField
                    type="text"
                    placeholder="Search By Staff Name"
                    className=`${style.searchInput}`}
                  />
                </div> */}

                {(applicationType === "REAPPOINTMENT" && ((workModeType === "Staff Manager") || (workModeType === "Department Head") || (workModeType === "Credentialing Committee"))) ? (
                  <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
                    <div className={`${style.spaceBetween} ${style.marginLeftRight10}`}>
                      <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                        Reappointments Status Tracker
                        {/* (
                          {totalCountDept || 0}) */}
                        {/* <span
                            className={`${style.numberBackground} ${style.marginLeft} ${style.yellowSmallNumberSelected}`}
                          >
                            {sentCompletion?.totalApplicationsSent || 0}
                          </span> */}
                      </div>
                      {/* <div className={`${style.marginLeft10}`}>
                          <RemoveIcon
                            sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }}
                            onClick={() => setShowDepartmentCardStatus(!showDepartmentCardStatus)}
                          />
                        </div> */}
                    </div>

                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "gray transparent",
                      }}
                    >
                      <div
                        className={`${style.displayInCol} ${style.marginTop}`}
                      >
                        <div className={`${style.warningTextAlign} ${style.staffTextStyle}`}>
                          <div className={style.progressbarStyle}>
                            <div className={style.spaceBetween}>
                              <div className={style.DepartmentHeadingTextStyle}>
                                All Department
                                {/* (
                                  {totalCountDept || 0}) */}
                              </div>
                              <KeyboardArrowRightIcon
                                sx={{ fontSize: 20, color: "#06617A" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`${style.viewCurrentStatusText} ${style.marginTop10} ${style.cursorPointer}`} onClick={() => onClickDepttrackerDialog()}>VIEW CURRENT STATUS</div>
                    </div>
                  </div>
                ) : null}

                {!(applicationType === "REAPPOINTMENT" && ((workModeType === "Department Head") || (workModeType === "Credentialing Committee") || (workModeType === "Advisory Committee") || (workModeType === "Board"))) ? (
                  <div
                    className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}
                  >
                    <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                      <div
                        className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}
                      >
                        Sent for Completion (
                        {sentCompletion?.totalApplicationsSent || 0})
                        {/* <span
                        className={`${style.numberBackground} ${style.marginLeft} ${style.yellowSmallNumberSelected}`}
                      >
                        {sentCompletion?.totalApplicationsSent || 0}
                      </span> */}
                      </div>
                      <div className={`${style.marginLeft10} `}>
                        {!showCardCompletion ? (
                          <AddIcon
                            sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }}
                            onClick={() => setShowCardCompletion(!showCardCompletion)}
                          />
                        ) : (
                          <RemoveIcon
                            sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }}
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
                          <div key={index} className={`${style.displayInCol} ${style.marginTop}`}>
                            <div className={`${style.warningTextAlign} ${style.staffTextStyle}`}>
                              <div className={style.progressbarStyle}>
                                <div className={style.spaceBetween}>
                                  <div className={style.statisticsProgress}>
                                    <div
                                      className={
                                        status?.dueStatus === "PastDue"
                                          ? style.redDotStyle
                                          : status?.remainingCompletionPercentage === 0
                                            ? style.greenDotStyle
                                            : status?.remainingCompletionPercentage === 100
                                              ? style.greyDotStyle
                                              : style.yellowDotStyle
                                      }
                                    ></div>
                                    <div className={style.marginLeft10}>
                                      {/* {status?.basicDetail?.applicant?.name?.lastName.toUpperCase() || "-"},{" "}
                                      {status?.basicDetail?.applicant?.name?.firstName.charAt(0).toUpperCase() +
                                        status?.basicDetail?.applicant?.name?.firstName.slice(1).toLowerCase() || "-"} */}
                                      {formatFirstNameLastName(status?.basicDetail?.applicant?.name?.firstName, status?.basicDetail?.applicant?.name?.lastName)}
                                      {/* {status?.basicDetail?.applicant?.name?.firstName}{" "} {status?.basicDetail?.applicant?.name?.lastName.toLowerCase()} */}
                                    </div>
                                  </div>
                                  <div className={`${style.smallTextStyle} ${style.justifyCenter}`}>
                                    {status?.createdDate
                                      ? format(new Date(status?.createdDate), "MM/dd/yyyy")
                                      : "-"}
                                  </div>
                                </div>
                                <ProgressBar
                                  completed={100 - status?.remainingCompletionPercentage}
                                  isLabelVisible={false}
                                  height="5px"
                                  bgColor="#06617A"
                                  baseBgColor="#9AAFB5"
                                  className={style.marginLeft20}
                                />
                                <div className={style.spaceBetween}>
                                  <span className={style.textStyleProgress}>
                                    {status?.providerType?.serviceProviderType}{" "}
                                  </span>
                                  <p className={style.progressTopText}>
                                    {status?.dueStatus === "Due"
                                      ? `Due in ${status.dueDays} Days`
                                      : `${status?.dueDays} days past due`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
                {!(applicationType === "REAPPOINTMENT" && ((workModeType === "Department Head") || (workModeType === "Credentialing Committee") || (workModeType === "Advisory Committee") || (workModeType === "Board"))) ? (
                  <div
                    className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}
                  >
                    <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                      <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                        Rejected / Declined{" "}({applicationRejected?.totalRejections})
                        {/*<span
      className={`${style.numberBackground} ${style.marginLeft} ${style.redSmallNumberSelected}`}
    >
      {applicationRejected?.totalRejections}
    </span> */}
                      </div>
                      <div className={`${style.marginLeft10} `}>
                        {!showCardDetails ? (
                          <AddIcon
                            sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }}
                            onClick={() => setShowCardDetails(!showCardDetails)}
                          />
                        ) : (
                          <RemoveIcon
                            sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }}
                            onClick={() => setShowCardDetails(!showCardDetails)}
                          />
                        )}
                      </div>
                    </div>
                    {
                      showCardDetails && (
                        <>
                          <div
                            className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                            onClick={() => {
                              handleClick();
                            }}
                          >
                            {/* Staff Rejected ({applicationRejected?.appointmentRequestsDenied}) */}
                            Approved But Declined ({applicationRejected?.applicationsRejected})
                          </div>
                          <div
                            className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                            onClick={() => {
                              setShowApplicationApprovedDeclineDialog(true);
                            }}
                          >
                            Staff Rejected ({applicationRejected?.appointmentRequestsDenied})
                            {/* Approved But Declined ({applicationRejected?.applicationsRejected}) */}
                          </div>
                        </>
                      )
                    }
                  </div >
                ) : null}
              </>
            </SideBar >

          </div >
          <div>
            {/* <div
            className={`${style.displayInRow} ${style.spaceBetween} ${style.headingForStaffs} ${style.bottomTextStyle}`}
          >
            {applicationType === "NEW" ? "STAFF APPLICATIONS" : "STAFF REAPPOINTMENTS"}
          </div> */}
            <div className={`${style.marginLeft20} ${style.spaceBetween}`}>
              <StaffApplicationTopTiles
                getSelectedTab={getSelectedTab}
                selectedTab={selectedTab}
                applicationCreationType={applicationCreationType}
                getApplicationCreationType={getApplicationCreationType}
                searchTermForTable={searchTermForTable}
              />
              <div className={`${style.spaceBetween} ${style.marginLeft} ${style.textAlign} `}>
                {workModeType === "Credentialing Committee" || workModeType === "Department Head" || workModeType === "Chief Of Staff" ? (
                  <>
                    {showAssignee && (
                      <div className={`${style.filterBackground} ${style.displayInRow}`}>
                        <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Assigned to Me</div>
                        <Tooltip title="Remove" arrow>
                          <CancelOutlinedIcon
                            sx={{
                              fontSize: 15,
                              color: "#06617A",
                            }}
                            className={style.cursorPointer}
                            onClick={() => setShowAssignee(false)}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </>
                ) : ""}
                {selectedDepartment && (
                  <div className={`${style.filterBackground} ${style.displayInRow}`}>
                    <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                    <Tooltip title="Remove" arrow>
                      <CancelOutlinedIcon
                        sx={{
                          fontSize: 15,
                          color: "#06617A",
                        }}
                        className={style.cursorPointer}
                        onClick={() => { setSelectedDepartment(); setSelectedServiceArea() }}
                      />
                    </Tooltip>
                  </div>
                )}
                {((workModeType === "Staff Manager" && selectedTab === "level-3") || (workModeType === "Staff Manager" && selectedTab === "level-4") || (workModeType === "Staff Manager" && selectedTab === "level-5")) && (
                  <>
                    <div
                      className={`${style.alignCenter} ${style.cursorPointer} ${style.marginRight20}`}
                      style={{
                        pointerEvents: checkedIds?.length > 0 ? "auto" : "none",
                        opacity: checkedIds?.length > 0 ? 1 : 0.5,
                      }}
                      onClick={() => {
                        setShowBulkApproveDialog(true);
                      }}
                    >
                      <Tooltip title={selectedTab === "level-3" ? "Update CC Approval Status" : selectedTab === "level-4" ? "Update MAC Approval Status" : "Update BOD Approval Status"} arrow>
                        <PeopleOutlinedIcon
                          sx={{
                            fontSize: 25,
                            color: "#06617A",
                          }}
                        />
                      </Tooltip>
                    </div>
                    {/* {!(workModeType === "Staff Manager" && selectedTab === "level-5") && ( */}
                    <div
                      className={` ${style.alignCenter} ${style.cursorPointer} ${style.marginRight20}`}
                      style={{
                        pointerEvents: checkedIds?.length > 0 ? "auto" : "none",
                        opacity: checkedIds?.length > 0 ? 1 : 0.5,
                      }}
                      onClick={() => {
                        setShowCCDateDialog(true);
                      }}
                    >
                      <Tooltip title={selectedTab === "level-3" ? "Designate CC Meeting Date" : selectedTab === "level-4" ? "MAC Approval Date" : "BOD Approval Date"} arrow>
                        <EventAvailableOutlinedIcon
                          sx={{
                            fontSize: 25,
                            color: "#06617A",
                          }}
                        />
                      </Tooltip>
                    </div>
                    {/* )} */}
                  </>
                )}
                {
                  workModeType === "Credentialing Committee" || workModeType === "Department Head" || workModeType === "Chief Of Staff" || workModeType === "Staff Manager" ? (
                    <div
                      className={`${style.alignCenter} ${style.cursorPointer
                        } ${style.marginRight20}`}
                      style={{
                        opacity: 1,
                      }}
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      <Tooltip title="Filter" arrow>
                        <FilterAltOutlinedIcon
                          sx={{
                            fontSize: 25,
                            color: "#06617A",
                          }}

                        />
                      </Tooltip>
                    </div>
                  ) : ""
                }
                {/* <div
                  className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                    } ${style.cursorPointer} ${style.marginRight20}`}
                >
                  <Tooltip title="Print Notes" arrow>
                    <NoteAltOutlinedIcon
                      sx={{
                        fontSize: isPrintClicked ? 20 : 25,
                        color: isPrintClicked ? "#fff" : "#06617A",
                      }}
                      // onClick={handlePrintClick}
                      onClick={handleNavigateNotes}
                    />
                  </Tooltip>
                </div>
                <div
                  className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                    } ${style.cursorPointer} ${style.marginRight}`}
                >
                  <Tooltip title="Print Data" arrow>
                    <PrintOutlinedIcon
                      sx={{
                        fontSize: isPrintClicked ? 20 : 25,
                        color: isPrintClicked ? "#fff" : "#06617A",
                      }}
                      onClick={handleNavigate}
                    />
                  </Tooltip>
                </div> */}
              </div >
            </div >
            <div className={`${style.borderStyleTiles} ${style.marginLeft20}`}></div>
            {
              showFilter && (
                <div className={style.filterContainer}>
                  {workModeType !== "Staff Manager" && (
                    <div>
                      <div className={`${style.marginTop10} ${style.flexCenter}`}>
                        <CommonSwitch label={showAssignee ? 'YES' : 'NO'} checked={showAssignee} onChange={(e) => setShowAssignee(e.target.checked)} labelName={'See Only Assigned to Me'} />
                      </div>
                    </div>
                  )}
                  <div>
                    <CommonSelectField
                      // value={
                      //   selectedServiceArea 
                      //     ? `${selectedDepartment}|${selectedServiceArea}` 
                      //     : selectedDepartment
                      // }  
                      value={selectedDepartment}
                      onChange={handleChange}
                      className={style.fullWidth}
                      firstOptionLabel={'All'}
                      firstOptionValue={''}
                      valueList={transformedOptions.map(option => option?.value)}
                      labelList={transformedOptions.map(option => option?.label)}
                      disabledList={transformedOptions.map(() => false)}
                      label={'Dept / Division & Specialty'}
                      required={false}
                    />
                  </div>
                </div>
              )
            }
            {/* <CommonDivider /> */}
            {/* <CommonDivider /> */}
            {/* <StaffApplicationTopTiles
              getSelectedTab={getSelectedTab}
              selectedTab={selectedTab}
            /> */}
            <div
              className={`${style.spaceBetween} ${style.marginTop10} ${style.marginLeft20}`}
            >
              <StaffApplicationTiles
                getSelectedTab={getSelectedTab}
                selectedTab={selectedTab}
                reFetchMetaData={reFetchMetaData}
                getReFetchMetadata={getReFetchMetaData}
                approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept}
                showBulkApproveDialog={showBulkApproveDialog}
                searchTermForTable={searchTermForTable}
                activeApplicationTask={activeApplicationTask}
              // applicationCreationType={applicationCreationType}
              // getApplicationCreationType = {getApplicationCreationType}
              />
            </div>
            <div className={`${style.bigCardStyle}`}>
              {isLoading ? (
                <div
                  className={`${style.verticalAlignCenter} ${style.justifyCenter}`}
                >
                  <CircularProgress sx={{ color: "#06617A" }} />
                </div>
              ) : (
                <div ref={componentRef} className={`${style.pagebreak}`}>
                  <div
                    className={`${style.reduceMarginTop10} ${style.marginLeftRight20} staffApplicationList`}
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
                      heading={selectedTab === "level-4" ? "At this time, there are no applications for MAC recommendation." : selectedTab === "level-5" ? "At this time, there are no applications for BOD Approval." : selectedTab === "clarificationsRequired" ? "At this time, there are no applications with clarification for you to work on." : "There are no Record for you to manage"}
                      onClickFunction={() => { }}
                      getHandleSort={getHandleSort}
                      sortValue={{ sortBy: sortValue, sortByField: sortField }}
                      getSelectedPage={getSelectedPage}
                      totalCount={totalCount}
                      page={page}
                      checkedIds={checkedIds}
                      filteredIds={filteredIds}
                      // Optional: pass the checkbox click handler if TableTwo needs it
                      handleCheckboxClick={handleCheckboxClick}
                      searchTermForTable={searchTermForTable}
                      searchCount={searchCount}
                      setSearchTermForTable={setSearchTermForTable}
                      onLimitChange={handleLimitChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div >
        </div >
        <div className={style.spaceBetween}>
          <div className={`${style.displayInRow}`}>
            {/* <p className={`${style.poweredBy} ${style.marginTop10}`}>
            Powered by
          </p> */}
            <img
              src={HapiCare}
              alt="footer"
              className={`${style.footerIconStyle} ${style.marginLeft10}`}
            />
          </div>
          <p className={style.poweredBy}>© {new Date().getFullYear()} HapiCare</p>
        </div>


        {
          showApplicationRejectionDialog && (
            <ApplicationRejection
              getApplicationRejectionDialog={getApplicationRejectionDialog}
              rejectionListData={rejectionListData}
              // rejectedCount={applicationRejected?.appointmentRequestsDenied}
              declineCount={applicationRejected?.applicationsRejected}
            />
          )
        }
        {
          showApplicationApprovedDeclineDialog && (
            <ApplicationApprovedDeclined
              getApplicationApprovedDeclineDialog={getApplicationApprovedDeclineDialog}
              declineListData={declineListData}
              // declineCount={applicationRejected?.applicationsRejected}
              rejectedCount={applicationRejected?.appointmentRequestsDenied}
            />
          )
        }
        {
          showCCDateDialog && (
            <CCDateDialog
              getCCDateDialogOpen={getCCDateDialogOpen}
              checkedIds={checkedIds}
              selectedTab={selectedTab}
              onClose={() => { setShowCCDateDialog(false); setCheckedIds([]); }}
            />
          )
        }
        {
          showBulkApproveDialog && (
            <ApprovalBulkDialog
              getBulkApproveDialogOpen={getBulkApproveDialogOpen}
              checkedIds={checkedIds}
              selectedTab={selectedTab}
              onClose={() => { setShowBulkApproveDialog(false); setCheckedIds([]); }}
            />
          )
        }
        {
          showCheckListDialog && (
            <CheckListDialog getCheckListDialog={getCheckListDialog} />
          )
        }
      </div >

      {/* )} */}
    </>
  );
};

export default StaffApplicationList;
