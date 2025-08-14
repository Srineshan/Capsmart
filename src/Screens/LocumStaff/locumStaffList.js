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
import HapiCare from "./../../images/PoweredHapiCare.png";
import Renewed from "./../../images/Renewed.png";
import NotRenewed from "./../../images/NotRenewed.png";
import RequestSend from "./../../images/requestSend.png";
import RequestSendApplicationDelay from "./../../images/requestSendApplicationDelay.png";
import LocumStaffTiles from "./locumStaffTiles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { format, differenceInDays } from "date-fns";
import TableTwo from "../../Components/TableDesignTwo";
import PublicIcon from "@mui/icons-material/Public";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import style from "./index.module.scss";
import SideBar from "../../Components/Sidebar";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import { GET, PUT, POST, TenantID } from "../dataSaver";
import CircleIcon from "@mui/icons-material/Circle";
import { SuccessToaster } from "../../utils/toaster";
import { ErrorToaster } from "../../utils/toaster";
import Tooltip from "@mui/material/Tooltip";
import { formatFirstNameLastName } from "../../utils/formatting";
import CommonSearchField from "../../Components/CommonFields/CommonSearchField";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import LoadingScreen from "../../Components/LoadingScreen";
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const LocumStaffList = ({
  isLoading,
  getSelectedTab,
  selectedTab,
  getTitleCounts,
  getApplicantDetailsViewScreen,
  getStaffView,
  getDeptTrackerDialog,
  getLocumExtensiveDialog,
  getLocumExtensiveRequestDialog,
  getLocumRequestDialog,
  getNotesDialog,
  getSummaryDialog,
  showLocumExtensiveDialog,
  showLocumRequestDialog,
  showLocumExtensiveRequestDialog

}) => {
  const PDFRef = createRef();
  const navigate = useNavigate();
  const componentRef = useRef(null);
  let cookie = new Cookie();
  let userDetails = cookie.get('user');
  const users = jwt(userDetails);

  const [rejectionTab, setRejectionTab] = useState("rejected");
  const [requestAppointment, setRequestAppointment] = useState(null);
  const [sentCompletion, setSentCompletion] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCardAppointment, setShowCardAppointment] = useState(false);
  const [showCardCompletion, setShowCardCompletion] = useState(false);
  const [applicantTypeFilter, setApplicantTypeFilter] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState('');

  const [applicationRejected, setApplicationRejected] = useState({
    totalRejections: 0,
    appointmentRequestsDenied: 0,
    applicationsRejected: 0,
    applicationsApprovedButDenied: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [rejectionListData, setRejectionListData] = useState([]);
  const [sortField, setSortField] = useState('TENURE_END_DATE');
  const [sortValue, setSortValue] = useState("ASCENDING");
  const userDetailsFetchOption = (sessionStorage.getItem('user') !== "undefined" && sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : {};
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchTermForTable, setSearchTermForTable] = useState('');
  const [applicationType, setApplicationType] = useState(() =>
    sessionStorage.getItem('applicationCreationType') || 'NEW'
  );
  const workModeType = sessionStorage.getItem("workModeType")
  const [userDepartmentList, setUserDepartmentList] = useState('');
  const [searchCount, setSearchCount] = useState(0);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");
  const [selectedServiceArea, setSelectedServiceArea] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [limit, setLimit] = useState(9999);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  // let userDepartmentList;
  let userSpecialty;

  const activeLocumHeaderValues = ["Staff Name", "", "Staff Type", workModeType !== "Department Head" ? "Department" : "Division", "Docs", "Start Date", "Expiry Date", "Days to Expiration", "Action"];
  const expiredLocumHeaderValues = ["Staff Name", "", "Staff Type", workModeType !== "Department Head" ? "Department" : "Division", "Docs", "Last End Date", "Days Since Expired", "Action"];
  const requestLocumHeaderValues = ["Staff Name", "", "Staff Status", "Staff Type", workModeType !== "Department Head" ? "Department" : "Division", "Request By", "Expiry Date", "Days to Expiration", ""];
  const tempPrivilegedLocumHeaderValues = ["Staff Name", "", "Staff Type", workModeType !== "Department Head" ? "Department" : "Division", "Start Date", "Expiry Date", "Override Date", "Override By"];


  const activeLocumColSortValues = [true, false, true, workModeType !== "Department Head" ? true : false, false, true, true, true, false];
  const expiredLocumColSortValues = [true, false, true, workModeType !== "Department Head" ? true : false, false, true, true, false];
  const requestLocumColSortValues = [false, false, false, false, false, false, true, true, false];
  const tempPrivilegedLocumColSortValues = [true, false, true, workModeType !== "Department Head" ? true : false, true, true, false, false];

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] =
    useState(false);
  const [reFetchMetaData, setReFetchMetaData] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalExpireCount, setTotalExpireCount] = useState(0);
  const [totalTempPrivilegeCount, setTotalTempPrivilegeCount] = useState(0);
  const [totalRequestCount, setTotalRequestCount] = useState(0);
  const selectedDepartmentName = departmentList?.find(data => data?.id === selectedDepartmentFilter)?.departmentName?.name;
  const selectedApplicantTypeName = applicantTypeFilter?.find(data => data?.id === selectedApplicantType)?.applicantType;

  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected");
  };

  useEffect(() => {
    // setUserDepartmentList (userDetailsFetchOption?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id);
    userSpecialty = userDetailsFetchOption?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.[0]?.id;
    console.log("userSpecialty", userDepartmentList, userSpecialty)
    console.log("userDetailsFetchOption", userDetailsFetchOption);
    getDepartmentList();
    getApplicantType();

  }, [])

  useEffect(() => {
    sessionStorage.setItem('applicationCreationType', 'LOCUM')
    getRequestUserDataCount();
    getTitleCountsStaff();
  }, [])

  useEffect(() => {
    setApplicationType(sessionStorage.getItem('applicationCreationType') || 'NEW')
  }, [sessionStorage.getItem('applicationCreationType')])

  // const onClickViewAndVerifyFunction = (data) => {
  //   getActiveApplicationView(true);
  // }

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchData([]); // Clear results if input is empty
      return;
    }

    const controller = new AbortController(); // Create an AbortController instance
    const signal = controller.signal;

    // getActiveUserDataSearch(signal); // Call API function with signal
    console.log("Triggering search with:", searchTerm, selectedTab);
    getActiveUserDataSearch(signal, searchTerm);

    return () => controller.abort(); // Cleanup: Cancel previous request if a new one starts
  }, [searchTerm, selectedTab]);

  useEffect(() => {
    setUserDetails();
  }, [users?.id, selectedTab, applicationType, selectedDepartment])

  useEffect(() => {
    setPage(1);
  }, [selectedTab, selectedDepartment]);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserDepartmentList(userData?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id)
    setSelectedDepartment(userData?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id);
    console.log("setUserDetails", userDepartmentList)
  }

  const onClickViewAndVerifyFunction = (id) => {
    getApplicantDetailsViewScreen(true);
    sessionStorage.setItem("applicationId", id);
    console.log("id", id)
  };

  const onClickReappointmentFunction = (data) => {
    reappointmentApplication(data?.id);
    sessionStorage.setItem("applicationId", data?.id);
  };

  // useEffect(() => {
  //   getSentConfirmationCount();
  //   getRequestAppointmentCount();
  //   getRejectionCounts();
  // }, []);

  useEffect(() => {
    getRejectionCounts();
  }, [applicationType]);

  // useEffect(() => {
  //   setSortField("DEFAULT");
  // }, [selectedTab]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getActiveUserData(signal);

    return () => controller.abort();
  }, [selectedTab, sortField, sortValue, page, totalCount, showLocumExtensiveDialog, searchTermForTable, limit, showLocumExtensiveRequestDialog, showLocumRequestDialog, selectedDepartment, selectedDepartmentFilter, selectedServiceArea, selectedApplicantType]);

  const getReFetchMetaData = (value) => {
    setReFetchMetaData(value);
  };

  const getDepartmentList = async () => {
    const { data: department } = await GET(
      `entity-service/department`
    );
    setDepartmentList(department);
  }

  const getApplicantType = async () => {
    const { data: applicant } = await GET(
      `entity-service/applicantType`
    );
    setApplicantTypeFilter(applicant);
    // if (applicant?.filter(data => data?.applicantType === "Physician")?.length !== 0) {
    //   setSelectedApplicantType(applicant?.filter(data => data?.applicantType === "Physician")?.[0]?.id);
    // } else {
    //   setSelectedApplicantType(applicant?.[0]?.id);
    // }
  }


  console.log("searchTermForTable", searchTermForTable)

  const getSelectedPage = (value) => {
    setPage(value);
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const onClickExtensiverequestRequiredLocumDialog = (data) => {
    getLocumExtensiveDialog(true, "REQUESTED");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickExtensiverequestNotRequiredLocumDialog = (data) => {
    getLocumExtensiveDialog(true, "NOT_REQUESTED");
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickRequestLocumDialog = (data) => {
    getLocumRequestDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickSummaryDialog = (data) => {
    getSummaryDialog(true);
  };

  const onClickExtensiveRequestLocumDialog = (data) => {
    getLocumExtensiveRequestDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickNotesDialog = (data) => {
    getNotesDialog(true);
    sessionStorage.setItem("applicationId", data?.onGoingApplication?.id);
  };

  const reappointmentApplication = async (id) => {
    await POST(`application-management-service/staff/${id}/reappoint`)
      .then((response) => {
        SuccessToaster("Reappointment Application Sent Successfully");
        console.log(response?.data);
        getActiveUserData();
        setReFetchMetaData(true);
        getTitleCounts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log("tabbbbbbbbbbbbbbb", selectedTab, totalCount)

  useEffect(() => {
    // setSelectedDepartment(userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.id);
    // setSelectedSpeciality(formDetails?.basicDetailReferences?.specialty?.id);
    getActiveUserDataActiveCount();
    getActiveUserDataExpireCount();
    getTempPrivilegeUserDataCount();
    getRequestUserDataCount();
    // getTitleCountsStaff();
    // getActiveUserDataSearch();
    console.log("setSelectedDepartment", selectedDepartment)
  }, [selectedDepartment, searchTermForTable, showLocumRequestDialog, selectedDepartmentFilter, selectedServiceArea, selectedApplicantType]);

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

    return [departmentEntry, ...serviceAreaEntries];
  }) || [];

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    const [departmentId, serviceAreaId] = selectedValue.split("|");

    setSelectedDepartmentFilter(departmentId || "");
    setSelectedServiceArea(serviceAreaId || "");

    console.log("selectedDept", selectedValue)
  }

  // useEffect(() => {
  //   getActiveUserDataActiveCount();
  //   getActiveUserDataExpireCount();
  // }, [selectedDepartment]);

  const getTitleCountsStaff = async () => {
    const requestBody = [
      selectedDepartmentFilter, selectedServiceArea]

    await POST('application-management-service/staff/meta', JSON.stringify(requestBody))
      .then(response => {
        setTotalCount(response?.data?.ACTIVE_LOCUM);
        setTotalExpireCount(response?.data?.EXPIRED_LOCUM);
        setTotalTempPrivilegeCount(response?.data?.PROVISIONAL_LOCUM);
        console.log("Response Data:", response?.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const getActiveUserDataActiveCount = async () => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments?.[0]?.id;
      const tab = selectedTab === "ACTIVELOCUM" ? "ACTIVE_LOCUM" : selectedTab === "TEMPORARYPRIVILEGEDLOCUM" ? "PROVISIONAL_LOCUM" : "EXPIRED_LOCUM"
      const departmentParam =
        selectedDepartmentFilter || selectedServiceArea
          ? `&departmentSpecialties=${selectedDepartmentFilter}%23${selectedServiceArea}`
          : "";
      const applicantType = selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : "";

      let apiUrl = `application-management-service/staff?searchText=${searchTermForTable}&tab=ACTIVE_LOCUM${applicantType}`;

      if (userDepartmentListData && workModeType === "Department Head") {
        apiUrl += `&departmentSpecialties=${userDepartmentListData}`;
      }

      if (workModeType !== "Department Head" && departmentParam !== "") {
        apiUrl += `${departmentParam}`;
      }

      const response = await GET(apiUrl);

      console.log("Application data", response?.data?.staffs);
      setTotalCount(response?.data?.numberOfElements);
      console.log("setTotalCount", response?.data?.numberOfElements)
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getRequestUserDataCount = async () => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments?.[0]?.id;

      let apiUrl = `application-management-service/application/request?requestType=LOCUM_RENEWAL_REQUEST&status=PENDING&role=${workModeType}`;

      if (userDepartmentListData && workModeType === "Department Head") {
        apiUrl += `&departmentSpecialties=${userDepartmentListData}`;
      }

      const response = await GET(apiUrl);

      console.log("Application data", response?.data?.staffs);
      setTotalRequestCount(response?.data?.numberOfElements);
      console.log("setTotalCount", response?.data?.numberOfElements)
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getActiveUserDataExpireCount = async () => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments?.[0]?.id;
      const tab = selectedTab === "ACTIVELOCUM" ? "ACTIVE_LOCUM" : selectedTab === "TEMPORARYPRIVILEGEDLOCUM" ? "PROVISIONAL_LOCUM" : "EXPIRED_LOCUM"
      const departmentParam =
        selectedDepartmentFilter || selectedServiceArea
          ? `&departmentSpecialties=${selectedDepartmentFilter}%23${selectedServiceArea}`
          : "";
      const applicantType = selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : "";

      let apiUrl = `application-management-service/staff?searchText=${searchTermForTable}${applicantType}&tab=EXPIRED_LOCUM`;

      if (userDepartmentListData && workModeType === "Department Head") {
        apiUrl += `&departmentSpecialties=${userDepartmentListData}`;
      }

      if (workModeType !== "Department Head" && departmentParam !== "") {
        apiUrl += `${departmentParam}`;
      }

      const response = await GET(apiUrl);

      console.log("Application data", response?.data?.staffs);
      setTotalExpireCount(response?.data?.numberOfElements);
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getTempPrivilegeUserDataCount = async () => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments?.[0]?.id;
      const tab = selectedTab === "ACTIVELOCUM" ? "ACTIVE_LOCUM" : selectedTab === "TEMPORARYPRIVILEGEDLOCUM" ? "PROVISIONAL_LOCUM" : "EXPIRED_LOCUM"
      const departmentParam =
        selectedDepartmentFilter || selectedServiceArea
          ? `&departmentSpecialties=${selectedDepartmentFilter}%23${selectedServiceArea}`
          : "";
      const applicantType = selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : "";

      let apiUrl = `application-management-service/staff?searchText=${searchTermForTable}${applicantType}&tab=PROVISIONAL_LOCUM`;

      if (userDepartmentListData && workModeType === "Department Head") {
        apiUrl += `&departmentSpecialties=${userDepartmentListData}`;
      }

      if (workModeType !== "Department Head" && departmentParam !== "") {
        apiUrl += `${departmentParam}`;
      }

      const response = await GET(apiUrl);

      console.log("Application data", response?.data?.staffs);
      setTotalTempPrivilegeCount(response?.data?.numberOfElements);
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getActiveUserDataSearch = async (signal) => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments?.[0]?.id;
      const tab = selectedTab === "ACTIVELOCUM" ? "ACTIVE_LOCUM" : selectedTab === "TEMPORARYPRIVILEGEDLOCUM" ? "PROVISIONAL_LOCUM" : "EXPIRED_LOCUM"

      let apiUrl = `application-management-service/staff?searchText=${searchTerm}&tab=${tab}`;

      if (selectedDepartment && workModeType === "Department Head") {
        apiUrl += `&departmentSpecialties=${selectedDepartment}`;
      }

      const response = await GET(apiUrl, { signal });

      console.log("Application data", response?.data?.staffs);
      // setTableData(response?.data?.staffs);
      // setSearchCount(response?.data?.numberOfElements)
      setSearchData(response?.data?.staffs.map(item => ({
        id: item.id,
        name: `${formatFirstNameLastName(item?.applicant?.name?.firstName, item?.applicant?.name?.lastName)}` || " ",
        desc: `${item?.basicDetailReferences?.department?.name} | ${item?.basicDetailReferences?.applicantType?.serviceProviderType}`
      })));
      // setTotalCount(response?.data?.numberOfElements);
      return response?.data?.staffs || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getActiveUserData = async (signal) => {
    try {
      setIsLoadingImage(true);

      let apiUrl = "";

      if (selectedTab === "REQUEST") {
        apiUrl = `application-management-service/application/request?requestType=LOCUM_RENEWAL_REQUEST&status=PENDING&role=${workModeType}`;
        if (selectedDepartment && workModeType !== "Chief Of Staff") {
          apiUrl += `&departmentSpecialties=${selectedDepartment}`;
        }
      } else {
        const isExpired = (selectedTab === "ACTIVELOCUM" || selectedTab === "TEMPORARYPRIVILEGEDLOCUM") ? false : true;
        const tab = selectedTab === "ACTIVELOCUM" ? "ACTIVE_LOCUM" : selectedTab === "TEMPORARYPRIVILEGEDLOCUM" ? "PROVISIONAL_LOCUM" : "EXPIRED_LOCUM"
        const isProvisional = selectedTab === "TEMPORARYPRIVILEGEDLOCUM" ? true : false;
        const isPaginationRequired = limit === 9999 ? false : true;
        const departmentParam =
          selectedDepartmentFilter || selectedServiceArea
            ? `&departmentSpecialties=${selectedDepartmentFilter}%23${selectedServiceArea}`
            : "";
        const applicantType = selectedApplicantType ? `&applicantTypeId=${selectedApplicantType}` : "";
        const userDepartmentListData =
          userDetailsFetchOption?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id;
        apiUrl = `application-management-service/staff?searchText=${searchTermForTable}&isPaginationRequired=${isPaginationRequired}&limit=${limit}&offset=${page - 1}&sortBy=${sortValue}&sortByField=${sortField}&tab=${tab}${departmentParam}${applicantType}`;

        if (selectedDepartment && workModeType === "Department Head") {
          apiUrl += `&departmentSpecialties=${selectedDepartment}`;
        }
      }

      const response = await GET(apiUrl, { signal });

      if (selectedTab === "REQUEST") {
        setTableData(response?.data?.requests || []);
        setSearchCount(response?.data?.numberOfElements || 0);
      } else {
        setTableData(response?.data?.staffs || []);
        setSearchCount(response?.data?.numberOfElements || 0);
      }

      setIsLoadingImage(false);
      console.log("tableData1234567890", tableData)
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      setIsLoadingImage(false);
      return [];
    }
  };


  const getHandleSort = (value, sortBy) => {
    if (sortBy === "ASCENDING") {
      setSortField(value);
      setSortValue("DESCENDING");
    } else if (sortBy === "DESCENDING") {
      setSortField("DEFAULT");
      setSortValue("ASCENDING");
    } else if (sortBy === "NONE") {
      setSortField(value);
      setSortValue("ASCENDING");
    }
  };

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
        setSentCompletion(response?.data.totalApplicationsSent || 0);
      })
      .catch((error) => {
        console.error("Error fetching request appointment count:", error);
      });
  };

  const getRequestAppointmentCount = async () => {
    await GET("application-management-service/preApplication")
      .then((response) => {
        setRequestAppointment(response?.data.numberOfElements || 0);
      })
      .catch((error) => {
        console.error("Error fetching request appointment count:", error);
      });
  };

  const getRejectionCounts = async () => {
    await GET(`application-management-service/application/rejected/meta?applicationCreationType=${applicationType === "LOCUM" ? "REAPPOINTMENT" : applicationType}&positionType=${applicationType === "LOCUM" ? "LOCUM" : "PERMANENT"}`)
      .then((response) => {
        setApplicationRejected(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching rejection counts:", error);
      });
  };

  const handleShowForSearch = () => {
    console.log('search', searchTerm)
    setSearchTermForTable(searchTerm)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  const onClickDepttrackerDialog = (data) => {
    getDeptTrackerDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  let dot = [];
  let dotTooltipValues = [];
  let lastUpdated = [];
  let action = [];
  let applicantName = [];
  let applicantNameHoverText = [];
  let applicantId = [];
  let applicantStatus = [];
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
  let taskListStatus = [];
  let taskListDotColor = [];
  let cr = [];
  let cos = [];
  let cc = [];
  let ccdate = [];
  let ccapproval = [];
  let cosapproval = [];
  let ExpiredDays = [];
  let startDate = [];
  let endDate = [];
  let iconStatus = [];
  let reappointDate = [];
  let requestBy = [];
  let WarningIcon = [];
  let WarningText = [];
  let applicantDept = [];
  let deptSpecialty = [];
  let overRideDate = [];
  let overRideBy = [];

  const getLocumActiveValues = () => {
    dot = [];
    applicantName = [];
    applicantNameHoverText = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
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
    ExpiredDays = [];
    startDate = [];
    endDate = [];
    iconStatus = [];
    reappointDate = [];
    WarningIcon = [];
    WarningText = [];
    applicantDept = [];
    deptSpecialty = [];

    tableData?.map((data) => {
      const startDateFormat = data?.tenure?.from
        ? new Date(data?.tenure?.from).toISOString().split('T')[0] + 'T00:00'
        : null;
      const endDateFormat = data?.tenure?.to
        ? new Date(data?.tenure?.to).toISOString().split('T')[0] + 'T00:00'
        : null;
      console.log(data, 'dataCheck', `${startDateFormat ? format(new Date(startDateFormat), dateFormat) : "-"} - ${endDateFormat ? format(new Date(endDateFormat), dateFormat) : ''}`)

      const expiredDays = differenceInDays(new Date(data?.tenure?.to), new Date());
      let reappointValue = "";
      let sentOutStatus = "";
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantName.push(
      //   <div
      //     key={data?.id}
      //     className={`${style.justifyCenter} ${style.cursorPointer}`}
      //     onClick={() => onClickViewAndVerifyFunction(data?.id)}
      //   >
      // {formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}
      //   </div>
      // );
      applicantNameHoverText.push(
        <div>
          <div>
            Active Locum <strong>{`${startDateFormat ? format(new Date(startDateFormat), dateFormat) : "-"} - ${endDateFormat ? format(new Date(endDateFormat), dateFormat) : ''}`}</strong>
          </div>
          {data?.onGoingApplication?.cyclePeriod?.from && (
            <div>
              Current Period Extension Applied For - <strong>{`${format(new Date(data?.onGoingApplication?.cyclePeriod?.from), dateFormat)} - ${format(new Date(data?.onGoingApplication?.cyclePeriod?.to), dateFormat)}`}</strong>
            </div>
          )}
          <div>
            Days to Expiration - <strong>{expiredDays.toString()}</strong>
          </div>
          <div className={style.customStyle}>
            Click To View Details
          </div>
        </div>
      )
      applicantDept.push([data?.basicDetailReferences?.department?.name ? data?.basicDetailReferences?.department?.name : "-"]);
      department.push(
        `${data?.basicDetailReferences?.department?.name || "-"}`
      );
      deptSpecialty.push(
        data?.basicDetailReferences?.specialty?.name ?? "-"
      );
      // if (workModeType === "Staff Manager") {
      if (data?.extensionRequestStatus === "REQUESTED") {
        if (data?.reAppointmentInitiated === false && expiredDays < 2) {
          iconStatus.push(
            <img src={RequestSendApplicationDelay} alt="RequestSendApplicationDelay Icon" style={{ width: 20, height: 20 }} />
          );
        } else if (data?.reAppointmentInitiated === false) {
          iconStatus.push(
            <img src={RequestSend} alt="RequestSend Icon" style={{ width: 20, height: 20 }} />
          );
        } else if (data?.reAppointmentInitiated === true) {
          iconStatus.push(
            <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
          );
        }
      }
      else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
        iconStatus.push(
          <img src={NotRenewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
        );
      }
      else {
        if (data?.reAppointmentInitiated === true) {
          iconStatus.push(
            <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
          );
        }
        else if (expiredDays <= 30) {
          iconStatus.push(<WarningAmberOutlinedIcon style={{ fontSize: 20, color: '#EBB433' }} />);
        }
        {
          iconStatus.push("");
        }

      }

      if (data?.extensionRequestStatus === "REQUESTED") {
        if (data?.reAppointmentInitiated === false && expiredDays < 2) {
          sentOutStatus = "Extension Request Not Acted Upon By Dept Head";
        } else if (data?.reAppointmentInitiated === false) {
          const requests = data?.requests;
          if (requests && requests?.length > 0) {
            const lastRequest = requests[requests?.length - 1];
            const role = lastRequest?.requestedTo?.[0]?.role || "Unknown Role";
            const createdDate = lastRequest?.createdDate
              ? format(new Date(lastRequest?.createdDate), `${dateFormat}, HH:mm a`)
              : "-";
            sentOutStatus = `Extension Request Sent By Staff Manager To ${role} On ${createdDate}`;
            // sentOutStatus = `Locum period extended to ${createdDate} Extension application sent to Locum Staff On ${createdDate}`;
          } else {
            sentOutStatus = "Locum Extension Request Sent";
          }
        } else if (data?.reAppointmentInitiated === true) {
          const createdDateReappoint = `${format(
            new Date(data?.reAppointmentSentDate),
            dateFormat
          )}`
          const extendDateReappoint = data?.onGoingApplication?.cyclePeriod?.to ? `${format(
            new Date(data?.onGoingApplication?.cyclePeriod?.to),
            dateFormat
          )}` : ''
          sentOutStatus = (
            <div>
              Locum period extended to {extendDateReappoint !== '' ? format(new Date(extendDateReappoint), dateFormat) : ''}
              <br />
              Extension application sent to Locum Staff On {createdDateReappoint}
            </div>
          );
          // sentOutStatus = `Locum period extended to ${format(new Date(endDateFormat), dateFormat)} Extension application sent to Locum Staff On ${createdDateReappoint}`;
          // sentOutStatus = `Extension Application Sent By Dept Head on ${format(
          //   new Date(data?.reAppointmentSentDate),
          //   dateFormat
          // )}`;
        }
      }
      //    else {
      //     reappointDate.push([""]);
      //   }
      // } 
      else {
        if (data?.reAppointmentInitiated === true) {
          sentOutStatus = `Extension Application Sent By Dept Head on ${format(
            new Date(data?.reAppointmentSentDate),
            dateFormat
          )}`;
        } else if (expiredDays <= 30) {
          sentOutStatus = "Extension Application Not Yet Sent By Dept Head";
        } else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
          sentOutStatus = "Locum Staff Period Extension is Not Required"
        } else {
          sentOutStatus = "";
        }
      }
      // reappointDate.push([sentOutStatus]);

      if (Array.isArray(data?.onGoingApplication?.completedWorkflows) && data?.onGoingApplication?.completedWorkflows?.length > 0) {
        let lastApproval = data?.onGoingApplication?.completedWorkflows
          .filter(item => item?.approvalType !== null)
          .pop();

        if (lastApproval) {
          const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
          reappointValue = `${lastApproval?.role}, ${formattedApprovalType}`;
        } else {
          if (data?.onGoingApplication?.status === "DECLINED") {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
          } else if (
            data?.onGoingApplication?.completionPercentage === 100 &&
            data?.onGoingApplication?.status === "CREATED"
          ) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
          } else if (data?.onGoingApplication?.completionPercentage < 100) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
          } else {
            reappointValue = "MSO Verification Not Started";
          }
        }
      } else {
        if (data?.onGoingApplication?.status === "DECLINED") {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
        } else if (
          data?.onGoingApplication?.completionPercentage === 0 &&
          data?.onGoingApplication?.status === "CREATED"
        ) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Yet Started`;
        } else if (
          data?.onGoingApplication?.completionPercentage === 100 &&
          data?.onGoingApplication?.status === "CREATED"
        ) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
        } else if (data?.onGoingApplication?.completionPercentage < 100 && data?.onGoingApplication?.status === "CREATED") {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
        } else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
          reappointValue = ""
        }
        // else {
        //   reappointValue = `${applicationType === "LOCUM" ? '' : ''}""`;
        // }
      }

      // reappointDate.push([reappointValue]);
      reappointDate.push([sentOutStatus, reappointValue]);

      //   if (workModeType === "Staff Manager") {
      //  reappointDate.push([
      //     data?.extensionRequested
      //       ? "Locum extension Request Sent"
      //       : "Locum extension Not Sent",
      //   ]);
      // } else {
      //   reappointDate.push([
      //     data?.reAppointmentInitiated
      //       ? `Locum Renewal Request Sent on ${format(new Date(data?.reAppointmentSentDate), "dd/MM/yyyy")}`
      //       : "Locum Renewal Not Sent",
      //   ]);
      // }
      applicantId.push(data?.staffId || "123");

      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      // docs.push(data?.documents?.length + "/" + data?.documents?.length || "");
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }} />
      // );
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      if (data?.documents?.length === 0) {
        docs.push("-");
        docsIcon.push("");
        docsHoverText.push("");
      } else {
        docs.push(data?.documents?.length + "/" + data?.documents?.length);

        docsIcon.push(
          <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }} />
        );

        const documentDetails = data?.documents || [];

        const docHoverTextArray = documentDetails.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />;

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
        });

        docsHoverText.push(docHoverTextArray);
      }
      startDate.push(
        startDateFormat ? format(new Date(startDateFormat), dateFormat) : "-"
      );
      endDate.push(
        endDateFormat ? format(new Date(endDateFormat), dateFormat) : "-"
      );
      lastUpdatedBy.push(["-"]);

      if (data?.tenure?.to) {
        ExpiredDays.push(expiredDays.toString());
      } else {
        ExpiredDays.push("-");
      }

      if (expiredDays < 7 && data?.extensionRequestStatus !== "NOT_REQUESTED") {
        WarningIcon.push(
          <WarningAmberOutlinedIcon style={{ fontSize: 20, color: '#FF6562' }} />
        );
      }
      //  else if (expiredDays >= 7 && expiredDays <= 30) {
      //   WarningIcon.push(
      //     <WarningAmberOutlinedIcon style={{ fontSize: 20, color: '#EBB433' }} />
      //   );
      else if (expiredDays > 7) {
        WarningIcon.push("");
      }

      if (expiredDays < 7) {
        WarningText.push(
          ["This Locum Staff Will Expire In Less Than 7 Days"]
        );
      } else if (expiredDays >= 7 && expiredDays <= 30) {
        WarningText.push(
          ["This Locum Staff Will Expire In Less Than 30 Days"]
        );
      } else if (expiredDays > 30) {
        WarningText.push([""]);
      }


      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      // { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName, tooltipValueText: applicantNameHoverText, onClickFunction: (data, index) => onClickViewAndVerifyFunction(data.id) },
      {
        type: "iconWithCount",
        icon: iconStatus,
        // value: reappointValue,
        hoverText: reappointDate,
        isShowHoverText: true,
      },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department, tooltipValueText: deptSpecialty },
      workModeType !== "Department Head"
        ? { type: "text", value: department, tooltipValueText: deptSpecialty }
        : { type: "text", value: deptSpecialty },
      // {
      //   type: "iconWithCount",
      //   value: notes,
      //   // hoverText: notesHoverText,
      //   // isShowHoverText: true,
      //   icon: notesIcon,
      // },
      {
        type: "iconWithCount",
        value: docs,
        hoverText: docsHoverText,
        isShowHoverText: true,
        icon: docsIcon,
      },
      {
        type: "iconWithCount",
        value: startDate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        value: endDate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      {
        type: "iconWithNumberCount",
        value: ExpiredDays,
        icon: WarningIcon,
        hoverText: WarningText,
        isShowHoverText: true
      },
      { type: "action", value: action },
    ];
  };

  const getExpiredLocumValues = () => {
    dot = [];
    dot = [];
    applicantName = [];
    applicantNameHoverText = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
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
    endDate = [];
    ExpiredDays = [];
    iconStatus = [];
    reappointDate = [];
    deptSpecialty = [];

    tableData?.map((data) => {
      const startDateFormat = data?.tenure?.from
        ? new Date(data?.tenure?.from).toISOString().split('T')[0] + 'T00:00'
        : null;
      const endDateFormat = data?.tenure?.to
        ? new Date(data?.tenure?.to).toISOString().split('T')[0] + 'T00:00'
        : null;
      let reappointValue = "";
      let sentOutStatus = "";
      dot.push(
        data?.status === "REVIEW_INPROGRESS"
          ? "yellow"
          : data?.status === "APPROVED"
            ? "green"
            : "grey"
      );
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantName.push(
      //   <div
      //     key={data.id}
      //     className={`${style.justifyCenter} ${style.cursorPointer}`}
      //     onClick={() => onClickViewAndVerifyFunction(data.id)}
      //   >
      //     {formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName) || " "}
      //   </div>
      // );
      applicantNameHoverText.push(
        <div>
          <div>
            Expired Locum <strong>{`${startDateFormat ? format(new Date(startDateFormat), dateFormat) : "-"} - ${endDateFormat ? format(new Date(endDateFormat), dateFormat) : ''}`}</strong>
          </div>
          {data?.onGoingApplication?.cyclePeriod?.from && (
            <div>
              Current Period Renewal Applied For - <strong>{`${format(new Date(data?.onGoingApplication?.cyclePeriod?.from), dateFormat)} - ${format(new Date(data?.onGoingApplication?.cyclePeriod?.to), dateFormat)}`}</strong>
            </div>
          )}
          <div className={style.customStyle}>
            Click To View Details
          </div>
        </div>
      )
      applicantDept.push([data?.basicDetailReferences?.department?.name ? data?.basicDetailReferences?.department?.name : "-"]);
      // applicantType.push(data?.providerType.serviceProviderType);
      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      department.push(
        `${data?.basicDetailReferences?.department?.name || "-"}`
      );
      deptSpecialty.push(
        data?.basicDetailReferences?.specialty?.name ?? "-"
      );
      // applicantId.push(data?.displayId);
      // if (workModeType === "Staff Manager") {
      if (data?.extensionRequestStatus === "REQUESTED") {
        if (data?.reAppointmentInitiated === false) {
          iconStatus.push(
            <img src={RequestSend} alt="RequestSend Icon" style={{ width: 20, height: 20 }} />
          );
        } else if (data?.reAppointmentInitiated === true) {
          iconStatus.push(
            <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
          );
        }
      }
      else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
        iconStatus.push(
          <img src={NotRenewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
        );
      }
      else {
        if (data?.reAppointmentInitiated === true) {
          iconStatus.push(
            <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
          );
        } else {
          iconStatus.push(<WarningAmberOutlinedIcon style={{ fontSize: 20, color: '#FF6562' }} />);
        }
      }

      //  if (workModeType === "Staff Manager") {
      if (data?.extensionRequestStatus === "REQUESTED") {
        if (data?.reAppointmentInitiated === false) {
          const requests = data?.requests;
          if (requests && requests?.length > 0) {
            const lastRequest = requests[requests?.length - 1];
            const role = lastRequest?.requestedTo?.[0]?.role || "Unknown Role";
            const createdDate = lastRequest?.createdDate
              ? format(new Date(lastRequest?.createdDate), `${dateFormat}, HH:mm a`)
              : "-";
            // reappointDate.push([`Locum Renewal Request Sent To ${role} On ${createdDate}`]);
            sentOutStatus = `Locum Renewal Request Sent To ${role} On ${createdDate}`
          } else {
            // reappointDate.push(["Locum Renewal Request Sent"]);
            sentOutStatus = "Locum Renewal Request Sent"
          }
        } else if (data?.reAppointmentInitiated === true) {
          // reappointDate.push(
          //   [`Renewal Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), 'MMM dd, yyyy')}`]
          // );
          // sentOutStatus = `Renewal Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), dateFormat)}`
          const createdDateReappoint = data?.reAppointmentSentDate ? `${format(
            new Date(data?.reAppointmentSentDate),
            dateFormat
          )}` : ''
          const extendDateReappoint = data?.onGoingApplication?.cyclePeriod?.to ? `${format(
            new Date(data?.onGoingApplication?.cyclePeriod?.to),
            dateFormat
          )}` : ''
          sentOutStatus = (
            <div>
              Locum period extended to {extendDateReappoint !== '' ? format(new Date(extendDateReappoint), dateFormat) : ''}
              <br />
              Extension application sent to Locum Staff On {createdDateReappoint}
            </div>
          );
        }
      }
      //    else {
      //     reappointDate.push([""]);
      //   }
      // }
      else {
        if (data?.reAppointmentInitiated === true) {
          // reappointDate.push(
          //   [`Renewal Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), 'MMM dd, yyyy')}`]
          // );
          sentOutStatus = `Renewal Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), dateFormat)}`
        } else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
          sentOutStatus = "Locum Staff Period Extension is Not Required"
        }
        else {
          // reappointDate.push(["Extension Application Not Yet Sent By Dept Head"]);
          sentOutStatus = "Extension Application Not Yet Sent By Dept Head"
        }
      }

      if (Array.isArray(data?.onGoingApplication?.completedWorkflows) && data?.onGoingApplication?.completedWorkflows?.length > 0) {
        let lastApproval = data?.onGoingApplication?.completedWorkflows
          .filter(item => item?.approvalType !== null)
          .pop();

        if (lastApproval) {
          const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
          reappointValue = `${lastApproval?.role}, ${formattedApprovalType}`;
        } else {
          if (data?.onGoingApplication?.status === "DECLINED") {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
          } else if (
            data?.onGoingApplication?.completionPercentage === 100 &&
            data?.onGoingApplication?.status === "CREATED"
          ) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
          } else if (
            data?.onGoingApplication?.completionPercentage === 0 &&
            data?.onGoingApplication?.status === "CREATED"
          ) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Yet Started`;
          } else if (data?.onGoingApplication?.completionPercentage < 100) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
          } else {
            reappointValue = "MSO Verification Not Started";
          }
        }
      } else {
        if (data?.onGoingApplication?.status === "DECLINED") {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
        } else if (
          data?.onGoingApplication?.completionPercentage === 100 &&
          data?.onGoingApplication?.status === "CREATED"
        ) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
        } else if (data?.onGoingApplication?.completionPercentage < 100 && data?.onGoingApplication?.status === "CREATED") {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
        } else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
          reappointValue = ""
        }
        // else {
        //   reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Started`;
        // }
      }

      reappointDate.push([sentOutStatus, reappointValue]);
      applicantId.push(data?.staffId || "123");
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      if (data?.documents?.length === 0) {
        docs.push("-");
        docsIcon.push("");
        docsHoverText.push("");
      } else {
        docs.push(data?.documents?.length + "/" + data?.documents?.length);

        docsIcon.push(
          <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }} />
        );

        const documentDetails = data?.documents || [];

        const docHoverTextArray = documentDetails.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />;

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
        });

        docsHoverText.push(docHoverTextArray);
      }
      cr.push("-");

      cos.push("grey");
      cc.push("grey");

      const expiredDays = differenceInDays(new Date(data?.tenure?.to), new Date());
      ExpiredDays.push(Math.abs(expiredDays).toString());
      endDate.push(
        data?.tenure?.to ? format(new Date(endDateFormat), dateFormat) : "-"
      );
      // lastUpdatedBy.push([data?.updatedBy || "-"]);
      action.push(true);
    });

    return [
      // { type: "dot", value: dot },
      { type: "text", value: applicantName, tooltipValueText: applicantNameHoverText, onClickFunction: (data, index) => onClickViewAndVerifyFunction(data.id) },
      {
        type: "iconWithCount",
        icon: iconStatus,
        // value: reappointValue,
        hoverText: reappointDate,
        isShowHoverText: true,
      },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department, tooltipValueText: deptSpecialty },
      workModeType !== "Department Head"
        ? { type: "text", value: department, tooltipValueText: deptSpecialty }
        : { type: "text", value: deptSpecialty },
      // {
      //   type: "iconWithCount",
      //   value: notes,
      //   // hoverText: notesHoverText,
      //   // isShowHoverText: true,
      //   icon: notesIcon,
      // },
      {
        type: "iconWithCount",
        value: docs,
        hoverText: docsHoverText,
        isShowHoverText: true,
        icon: docsIcon,
      },
      {
        type: "iconWithCount",
        value: endDate,
      },
      {
        type: "iconWithNumberCount",
        value: ExpiredDays,
      },
      { type: "action", value: action },
    ];
  };

  const getLocumTempPrivilegesValues = () => {
    dot = [];
    applicantName = [];
    applicantNameHoverText = [];
    applicantId = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
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
    ExpiredDays = [];
    startDate = [];
    endDate = [];
    iconStatus = [];
    reappointDate = [];
    WarningIcon = [];
    WarningText = [];
    applicantDept = [];
    deptSpecialty = [];
    overRideDate = [];
    overRideBy = [];

    tableData?.map((data) => {
      const startDateFormat = data?.tenure?.from
        ? new Date(data?.tenure?.from).toISOString().split('T')[0] + 'T00:00'
        : null;
      const endDateFormat = data?.tenure?.to
        ? new Date(data?.tenure?.to).toISOString().split('T')[0] + 'T00:00'
        : null;
      let reappointValue = "";
      let sentOutStatus = "";
      console.log(data, 'dataCheck', `${startDateFormat ? format(new Date(startDateFormat), dateFormat) : "-"} - ${endDateFormat ? format(new Date(endDateFormat), dateFormat) : ''}`)

      const expiredDays = differenceInDays(new Date(data?.tenure?.to), new Date());
      let overRideApprovedDate = "-";
      let overRideApprovedBy = "-";
      const OnGoingApplicationId = data?.onGoingApplication?.id
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantName.push(
      //   <div
      //     key={data.id}
      //     className={`${style.justifyCenter} ${style.cursorPointer}`}
      //     onClick={() => onClickViewAndVerifyFunction(data.id)}
      //   >
      //     {formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName) || " "}
      //   </div>
      // );
      applicantNameHoverText.push(
        <div>
          <div>
            Active Locum <strong>{`${startDateFormat ? format(new Date(startDateFormat), dateFormat) : "-"} - ${endDateFormat ? format(new Date(endDateFormat), dateFormat) : ''}`}</strong>
          </div>
          {data?.onGoingApplication?.cyclePeriod?.from && (
            <div>
              Current Period Extension Applied For - <strong>{`${format(new Date(data?.onGoingApplication?.cyclePeriod?.from), dateFormat)} - ${format(new Date(data?.onGoingApplication?.cyclePeriod?.to), dateFormat)}`}</strong>
            </div>
          )}
          <div>
            Days to Expiration - <strong>{expiredDays.toString()}</strong>
          </div>
          <div className={style.customStyle}>
            Click To View Details
          </div>
        </div>
      )
      applicantDept.push([data?.basicDetailReferences?.department?.name ? data?.basicDetailReferences?.department?.name : "-"]);
      department.push(
        `${data?.basicDetailReferences?.department?.name || "-"}`
      );
      deptSpecialty.push(
        data?.basicDetailReferences?.specialty?.name ?? "-"
      );
      // if (workModeType === "Staff Manager") {
      if (data?.extensionRequestStatus === "REQUESTED") {
        if (data?.reAppointmentInitiated === false && expiredDays < 2) {
          iconStatus.push(
            <img src={RequestSendApplicationDelay} alt="RequestSendApplicationDelay Icon" style={{ width: 20, height: 20 }} />
          );
        } else if (data?.reAppointmentInitiated === false) {
          iconStatus.push(
            <img src={RequestSend} alt="RequestSend Icon" style={{ width: 20, height: 20 }} />
          );
        } else if (data?.reAppointmentInitiated === true) {
          iconStatus.push(
            <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
          );
        }
      }
      else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
        iconStatus.push(
          <img src={NotRenewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
        );
      }
      else {
        if (data?.reAppointmentInitiated === true) {
          iconStatus.push(
            <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
          );
        } else {
          iconStatus.push("");
        }
      }

      //  if (workModeType === "Staff Manager") {
      if (data?.extensionRequestStatus === "REQUESTED") {
        if (data?.reAppointmentInitiated === false && expiredDays < 2) {
          // reappointDate.push(
          //   ["Extension Request Not Acted Upon By Dept Head"]
          // );
          sentOutStatus = "Extension Request Not Acted Upon By Dept Head"
        } else if (data?.reAppointmentInitiated === false) {
          const requests = data?.requests;
          if (requests && requests?.length > 0) {
            const lastRequest = requests[requests?.length - 1];
            const role = lastRequest?.requestedTo?.[0]?.role || "Unknown Role";
            const createdDate = lastRequest?.createdDate
              ? format(new Date(lastRequest?.createdDate), `${dateFormat}, HH:mm a`)
              : "-";
            // reappointDate.push([`Extension Request Sent By Staff Manager To ${role} On ${createdDate}`]);
            sentOutStatus = `Extension Request Sent By Staff Manager To ${role} On ${createdDate}`
          } else {
            // reappointDate.push(["Locum Extension Request Sent"]);
            sentOutStatus = "Locum Extension Request Sent"
          }
        } else if (data?.reAppointmentInitiated === true) {
          // reappointDate.push(
          //   [`Extension Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), 'MMM dd, yyyy')}`]
          // );
          // sentOutStatus = `Extension Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), dateFormat)}`
          const createdDateReappoint = data?.reAppointmentSentDate ? `${format(
            new Date(data?.reAppointmentSentDate),
            dateFormat
          )}` : ''
          const extendDateReappoint = data?.onGoingApplication?.cyclePeriod?.to ? `${format(
            new Date(data?.onGoingApplication?.cyclePeriod?.to),
            dateFormat
          )}` : ''
          sentOutStatus = (
            <div>
              Locum period extended to {extendDateReappoint !== '' ? format(new Date(extendDateReappoint), dateFormat) : ''}
              <br />
              Extension application sent to Locum Staff On {createdDateReappoint}
            </div>
          );
        }
      }
      //    else {
      //     reappointDate.push([""]);
      //   }
      // } 
      else {
        if (data?.reAppointmentInitiated === true) {
          // reappointDate.push(
          //   [`Extension Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), 'MMM dd, yyyy')}`]
          // );
          sentOutStatus = `Extension Application Sent By Dept Head on ${format(new Date(data?.reAppointmentSentDate), dateFormat)}`
        } else {
          // reappointDate.push("");
          sentOutStatus = "";
        }
      }

      if (Array.isArray(data?.onGoingApplication?.completedWorkflows) && data?.onGoingApplication?.completedWorkflows?.length > 0) {
        let lastApproval = data?.onGoingApplication?.completedWorkflows
          .filter(item => item?.approvalType !== null)
          .pop();

        if (lastApproval) {
          const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
          reappointValue = `${lastApproval?.role}, ${formattedApprovalType}`;
        } else {
          if (data?.onGoingApplication?.status === "DECLINED") {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
          } else if (
            data?.onGoingApplication?.completionPercentage === 100 &&
            data?.onGoingApplication?.status === "CREATED"
          ) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
          } else if (
            data?.onGoingApplication?.completionPercentage === 0 &&
            data?.onGoingApplication?.status === "CREATED"
          ) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Yet Started`;
          } else if (data?.onGoingApplication?.completionPercentage < 100 && data?.onGoingApplication?.status === "CREATED") {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
          } else {
            reappointValue = "MSO Verification Not Started";
          }
        }
      } else {
        if (data?.onGoingApplication?.status === "DECLINED") {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
        } else if (
          data?.onGoingApplication?.completionPercentage === 100 &&
          data?.onGoingApplication?.status === "CREATED"
        ) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
        } else if (data?.onGoingApplication?.completionPercentage < 100) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
        }
        // else {
        //   reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Started`;
        // }
      }

      reappointDate.push([sentOutStatus, reappointValue]);
      //   if (workModeType === "Staff Manager") {
      //  reappointDate.push([
      //     data?.extensionRequested
      //       ? "Locum extension Request Sent"
      //       : "Locum extension Not Sent",
      //   ]);
      // } else {
      //   reappointDate.push([
      //     data?.reAppointmentInitiated
      //       ? `Locum Renewal Request Sent on ${format(new Date(data?.reAppointmentSentDate), "dd/MM/yyyy")}`
      //       : "Locum Renewal Not Sent",
      //   ]);
      // }
      applicantId.push(data?.staffId || "123");

      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      // docs.push(data?.documents?.length + "/" + data?.documents?.length || "");
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }} />
      // );
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      if (data?.documents?.length === 0) {
        docs.push("-");
        docsIcon.push("");
        docsHoverText.push("");
      } else {
        docs.push(data?.documents?.length + "/" + data?.documents?.length);

        docsIcon.push(
          <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#00C07F` }} />
        );

        const documentDetails = data?.documents || [];

        const docHoverTextArray = documentDetails.map((doc, index) => {
          const verifiedIndicator = doc?.documentStatus
            ? <CircleIcon style={{ color: '#8ED12B', fontSize: '12px', marginRight: '5px' }} />
            : <CircleIcon style={{ color: '#FFCA27', fontSize: '12px', marginRight: '5px' }} />;

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
        });

        docsHoverText.push(docHoverTextArray);
      }
      startDate.push(
        startDateFormat ? format(new Date(startDateFormat), dateFormat) : "-"
      );
      endDate.push(
        endDateFormat ? format(new Date(endDateFormat), dateFormat) : "-"
      );
      lastUpdatedBy.push(["-"]);

      if (data?.tenure?.to) {
        ExpiredDays.push(expiredDays.toString());
      } else {
        ExpiredDays.push("-");
      }

      if (expiredDays < 7) {
        WarningIcon.push(
          <WarningAmberOutlinedIcon style={{ fontSize: 20, color: '#FF6562' }} />
        );
      } else if (expiredDays >= 7 && expiredDays <= 14) {
        WarningIcon.push(
          <WarningAmberOutlinedIcon style={{ fontSize: 20, color: '#EBB433' }} />
        );
      } else if (expiredDays > 14) {
        WarningIcon.push("");
      }

      if (expiredDays < 7) {
        WarningText.push(
          ["This Locum Staff Will Expire In Less Than 7 Days"]
        );
      } else if (expiredDays >= 7 && expiredDays <= 14) {
        WarningText.push(
          ["This Locum Staff Will Expire In Less Than 14 Days"]
        );
      } else if (expiredDays > 14) {
        WarningText.push([""]);
      }
      data?.requests?.forEach(request => {
        if (request?.id === OnGoingApplicationId && request?.requestType === "OVERRIDE_REQUEST") {
          request?.requestLogs?.forEach(log => {
            if (log?.actionType === "APPROVED" && log?.actionDate) {
              overRideApprovedDate = format(new Date(log?.actionDate), dateFormat);
              overRideApprovedBy = log?.actionBy?.name?.firstName
            }
          });
        }
      });
      overRideDate.push(overRideApprovedDate);
      overRideBy.push(overRideApprovedBy);
      //  if (data?.requests?.requestType === "OVERRIDE_REQUEST") {
      // data?.requests?.requestLogs?.forEach((log) => {
      //   if (log?.actionType === "APPROVED") {
      //     overRideDate.push(log?.actionDate);
      //   }
      // })};
      console.log("tabledata" + tableData);
    });

    return [
      // { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName, tooltipValueText: applicantNameHoverText, onClickFunction: (data, index) => onClickViewAndVerifyFunction(data.id) },
      {
        type: "iconWithCount",
        icon: iconStatus,
        // value: reappointValue,
        hoverText: reappointDate,
        isShowHoverText: true,
      },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department, tooltipValueText: deptSpecialty },
      workModeType !== "Department Head"
        ? { type: "text", value: department, tooltipValueText: deptSpecialty }
        : { type: "text", value: deptSpecialty },
      // {
      //   type: "iconWithCount",
      //   value: notes,
      //   // hoverText: notesHoverText,
      //   // isShowHoverText: true,
      //   icon: notesIcon,
      // },
      // {
      //   type: "iconWithCount",
      //   value: docs,
      //   hoverText: docsHoverText,
      //   isShowHoverText: true,
      //   icon: docsIcon,
      // },
      {
        type: "iconWithCount",
        value: startDate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        value: endDate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        value: overRideDate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      {
        type: "iconWithCount",
        value: overRideBy,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      // {
      //   type: "iconWithCount",
      //   value: ExpiredDays,
      //   icon: WarningIcon,
      //   hoverText: WarningText,
      //   isShowHoverText: true
      // }
    ];
  };

  const getLocumRequestValues = () => {
    dot = [];
    applicantName = [];
    applicantStatus = [];
    applicantType = [];
    department = [];
    docs = [];
    docsHoverText = [];
    docsIcon = [];
    dataStatus = [];
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
    ExpiredDays = [];
    startDate = [];
    endDate = [];
    iconStatus = [];
    reappointDate = [];
    requestBy = [];
    deptSpecialty = [];

    tableData?.map((data, uniqueKey) => {
      // applicantName.push(
      //   `${formatFirstNameLastName(data?.staff?.applicant?.name?.firstName, data?.staff?.applicant?.name?.lastName)}` || " "
      // );
      let reappointValue = "";
      let sentOutStatus = "";
      applicantName.push(
        `${formatFirstNameLastName(data?.staff?.applicant?.name?.firstName, data?.staff?.applicant?.name?.lastName)}` || " "
      );
      // applicantName.push(
      //   <div
      //     key={data.id}
      //     className={`${style.justifyCenter} ${style.cursorPointer}`}
      //     onClick={() => onClickViewAndVerifyFunction(data.id)}
      //   >
      //     {formatFirstNameLastName(data?.staff?.applicant?.name?.firstName, data?.staff?.applicant?.name?.lastName) || " "}
      //   </div>
      // );
      applicantDept.push([data?.staff?.basicDetailReferences?.department?.name ? data?.staff?.basicDetailReferences?.department?.name : "-"]);
      if (data?.staff?.reAppointmentInitiated === true) {
        iconStatus.push(
          <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
        );
      } else {
        iconStatus.push("");
      }

      sentOutStatus =
        data?.staff?.reAppointmentInitiated
          ? `Locum ${data?.locumRenewalDetails?.reappointmentType === "EXTENSION"
            ? "Extension"
            : "Renewal"
          } Request Sent on ${format(new Date(data?.createdDate), dateFormat)}`
          : data?.extensionRequestStatus === "NOT_REQUESTED" ? "Locum Staff Period Extension is Not Required"
            : "Locum Extension Not Sent";

      if (Array.isArray(data?.onGoingApplication?.completedWorkflows) && data?.onGoingApplication?.completedWorkflows?.length > 0) {
        let lastApproval = data?.onGoingApplication?.completedWorkflows
          .filter(item => item?.approvalType !== null)
          .pop();

        if (lastApproval) {
          const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
          reappointValue = `${lastApproval?.role}, ${formattedApprovalType}`;
        } else {
          if (data?.onGoingApplication?.status === "DECLINED") {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
          } else if (
            data?.onGoingApplication?.completionPercentage === 100 &&
            data?.onGoingApplication?.status === "CREATED"
          ) {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
          } else if (data?.onGoingApplication?.completionPercentage < 100 && data?.onGoingApplication?.status === "CREATED") {
            reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
          } else {
            reappointValue = "MSO Verification Not Started";
          }
        }
      } else {
        if (data?.onGoingApplication?.status === "DECLINED") {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Declined`;
        } else if (
          data?.onGoingApplication?.completionPercentage === 100 &&
          data?.onGoingApplication?.status === "CREATED"
        ) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Submitted`;
        } else if (
          data?.onGoingApplication?.completionPercentage === 0 &&
          data?.onGoingApplication?.status === "CREATED"
        ) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Yet Started`;
        } else if (data?.onGoingApplication?.completionPercentage < 100) {
          reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application In-Progress`;
        } else if (data?.extensionRequestStatus === "NOT_REQUESTED") {
          reappointValue = ""
        }
        // else {
        //   reappointValue = `${applicationType === "LOCUM" ? '' : 'Reappointment '}Application Not Started`;
        // }
      }

      reappointDate.push([sentOutStatus, reappointValue]);
      applicantId.push(data?.staff?.status === "ACTIVE" ? "Active" : "Expired" || "");

      applicantType.push(data?.staff?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      department.push(
        `${data?.staff?.basicDetailReferences?.department?.name || "-"}`
      );
      deptSpecialty.push(
        data?.staff?.basicDetailReferences?.specialty?.name ?? "-"
      );
      // docs.push("0/3");
      // docsIcon.push(
      //   <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#b0a6a6` }} />
      // );
      // crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      requestBy.push(
        <div key={uniqueKey}>
          {data?.requestedBy?.name?.firstName || "-"}
          <br />
          {format(new Date(data?.createdDate), dateFormat)}
        </div>
      );
      // notesHoverText.push([
      //   "June 13 00:00, Nina Grealy",
      //   "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      // ]);
      // startDate.push(
      //   data?.tenure?.from
      //     ? format(new Date(data?.tenure?.from), "MMM dd, yyyy")
      //     : "-"
      // );
      const endDateFormat = data?.staff?.tenure?.to
        ? new Date(data?.staff?.tenure?.to).toISOString().split('T')[0] + 'T00:00'
        : null;
      endDate.push(
        endDateFormat ? format(new Date(endDateFormat), dateFormat) : "-"
      );
      // lastUpdatedBy.push(["-"]);

      if (data?.staff?.tenure?.to) {
        const expiredDays = differenceInDays(new Date(data?.staff?.tenure?.to), new Date());
        ExpiredDays.push(Math.abs(expiredDays).toString());
      } else {
        ExpiredDays.push("-");
      }

      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      // { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName, onClickFunction: (data, index) => onClickViewAndVerifyFunction(data?.staff?.id) },
      {
        type: "iconWithCount",
        icon: iconStatus,
        // value: reappointValue,
        hoverText: reappointDate,
        isShowHoverText: true,
      },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department, tooltipValueText: deptSpecialty },
      workModeType !== "Department Head"
        ? { type: "text", value: department, tooltipValueText: deptSpecialty }
        : { type: "text", value: deptSpecialty },
      // {
      //   type: "iconWithCount",
      //   value: notes,
      //   // hoverText: notesHoverText,
      //   // isShowHoverText: true,
      //   icon: notesIcon,
      // },
      { type: "text", value: requestBy },
      // {
      //   type: "iconWithCount",
      //   value: docs,
      //   // hoverText: docsHoverText,
      //   // isShowHoverText: true,
      //   icon: docsIcon,
      // },
      // {
      //   type: "iconWithCount",
      //   value: startDate,
      //   // hoverText: lastUpdatedBy,
      //   // isShowHoverText: true,
      // },
      {
        type: "iconWithCount",
        value: endDate,
        // hoverText: lastUpdatedBy,
        // isShowHoverText: true,
      },
      { type: "text", value: ExpiredDays },
      { type: "action", value: action },
    ];
  };

  const activeLocumActionsData = [
    {
      data: "Extend?",
      requiredValue: "boolean",
      onClick: onClickExtensiverequestRequiredLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "NA" && data?.reAppointmentInitiated === false && ((new Date(data?.tenure?.to) - new Date()) / (1000 * 60 * 60 * 24)) <= 30`,
    },
    {
      data: "Extension Not Required?",
      requiredValue: "boolean",
      onClick: onClickExtensiverequestNotRequiredLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "NA" && data?.reAppointmentInitiated === false && ((new Date(data?.tenure?.to) - new Date()) / (1000 * 60 * 60 * 24)) <= 30`,
    },
    {
      data: "Review?",
      requiredValue: "boolean",
      onClick: onClickRequestLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "REQUESTED" && data?.reAppointmentInitiated === false && data?.requests?.[data?.requests?.length - 1]?.requestedTo?.[0]?.role === workModeType`,
    },
    // {
    //   data: "Create Note",
    //   requiredValue: "boolean",
    //   onClick: onClickNotesDialog,
    //   conditionToShow: `data?.reAppointmentInitiated === true`,
    // },
  ];

  const activeLocumActionsSMData = [
    {
      data: "Request Extension",
      requiredValue: "boolean",
      onClick: onClickExtensiveRequestLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "NA" && data?.reAppointmentInitiated === false && ((new Date(data?.tenure?.to) - new Date()) / (1000 * 60 * 60 * 24)) <= 30`,
    },
    // {
    //   data: "Create Note",
    //   requiredValue: "boolean",
    //   onClick: onClickNotesDialog,
    // },
  ];

  const expiredLocumActionsData = [
    {
      data: "Renew?",
      requiredValue: "boolean",
      onClick: onClickExtensiverequestRequiredLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "NA" && data?.reAppointmentInitiated === false`,
    },
    {
      data: "Renewal Not Required?",
      requiredValue: "boolean",
      onClick: onClickExtensiverequestNotRequiredLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "NA" && data?.reAppointmentInitiated === false`,
    },
    {
      data: "Review?",
      requiredValue: "boolean",
      onClick: onClickRequestLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "REQUESTED" && data?.reAppointmentInitiated === false && data?.requests?.[data?.requests?.length - 1]?.requestedTo?.[0]?.role === workModeType`,
    },
    // {
    //   data: "Create Note",
    //   requiredValue: "boolean",
    //   onClick: onClickNotesDialog,
    //   conditionToShow: `data?.reAppointmentInitiated === true`,
    // },

  ];

  const expiredLocumActionsSMData = [
    {
      data: "Request Renew",
      requiredValue: "boolean",
      onClick: onClickExtensiveRequestLocumDialog,
      conditionToShow: `data?.extensionRequestStatus === "NA" && data?.reAppointmentInitiated === false`,
    },
    // {
    //   data: "Send Reminder",
    //   requiredValue: "boolean",
    //   onClick: "",
    // },
    // {
    //   data: "Create Note",
    //   requiredValue: "boolean",
    //   onClick: onClickNotesDialog,
    // },

  ];

  const requestLocumActionsData = [
    // {
    //   data: "Review to Extend",
    //   requiredValue: "boolean",
    //   onClick: onClickRequestLocumDialog,
    //   // conditionToShow: `data?.reAppointmentInitiated === false`,
    // },
    {
      data: "Review",
      requiredValue: "boolean",
      onClick: onClickRequestLocumDialog,
    },
    // {
    //   data: "Create Note",
    //   requiredValue: "boolean",
    //   onClick: onClickNotesDialog,
    //   conditionToShow: `data?.reAppointmentInitiated === true`,
    // },
  ];
  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  let tableHeaderValues =
    selectedTab === "ACTIVELOCUM"
      ? activeLocumHeaderValues
      : selectedTab === "EXPIREDLOCUM"
        ? expiredLocumHeaderValues
        : selectedTab === "TEMPORARYPRIVILEGEDLOCUM"
          ? tempPrivilegedLocumHeaderValues
          : selectedTab === "REQUEST"
            ? requestLocumHeaderValues
            : activeLocumHeaderValues
  let tableSortValues =
    selectedTab === "ACTIVELOCUM"
      ? activeLocumColSortValues
      : selectedTab === "EXPIREDLOCUM"
        ? expiredLocumColSortValues
        : selectedTab === "TEMPORARYPRIVILEGEDLOCUM"
          ? tempPrivilegedLocumColSortValues
          : selectedTab === "REQUEST"
            ? requestLocumColSortValues
            : activeLocumColSortValues
  // let tableDataValues = selectedTab !== 'applicantsToProcess' ? getApplicantValues() : selectedTab === 'level-1' ? getApplicationValues() : selectedTab === 'level-1' ? getApplicationValues() : getApplicationValues();
  let tableDataValues =
    selectedTab === "ACTIVELOCUM"
      ? getLocumActiveValues()
      : selectedTab === "EXPIREDLOCUM"
        ? getExpiredLocumValues()
        : selectedTab === "TEMPORARYPRIVILEGEDLOCUM"
          ? getLocumTempPrivilegesValues()
          : selectedTab === "REQUEST"
            ? getLocumRequestValues()
            : getLocumActiveValues()

  let tableTotalValues =
    selectedTab === "ACTIVELOCUM"
      ? totalCount
      : selectedTab === "EXPIREDLOCUM"
        ? totalExpireCount
        : selectedTab === "TEMPORARYPRIVILEGEDLOCUM"
          ? totalTempPrivilegeCount
          : selectedTab === "REQUEST"
            ? totalRequestCount
            : totalCount
  let actions =
    selectedTab === "ACTIVELOCUM" && (workModeType === "Department Head" || workModeType === "Chief Of Staff")
      ? activeLocumActionsData
      : selectedTab === "ACTIVELOCUM"
        ? activeLocumActionsSMData
        : selectedTab === "EXPIREDLOCUM" && (workModeType === "Department Head" || workModeType === "Chief Of Staff")
          ? expiredLocumActionsData
          : selectedTab === "EXPIREDLOCUM"
            ? expiredLocumActionsSMData
            : selectedTab === "REQUEST"
              ? requestLocumActionsData
              : activeLocumActionsData
  let gridStyle =
    selectedTab === "ACTIVELOCUM"
      ? style.activeLocumStaffGrid
      : selectedTab === "EXPIREDLOCUM"
        ? style.expiredLocumStaffGrid
        : selectedTab === "TEMPORARYPRIVILEGEDLOCUM"
          ? style.tempPrivilegesLocumStaffGrid
          : selectedTab === "REQUEST"
            ? style.requestLocumStaffGrid
            : style.activeLocumStaffGrid

  return (
    <div className={style.margin20}>
      {isLoadingImage && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
        <div>
          <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
            <div className={style.searchFieldAlignment}>
              <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={true} placeholder={'Search By Locum Staff'} />
            </div>
            <div className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}>
              <div className={`${style.spaceBetween} ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Locum Extension / Renewal Status Tracker
                </div>
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
                <Tooltip title={'Click to View Current Status'} arrow >
                  <div className={`${style.viewCurrentStatusText} ${style.marginTop10} ${style.cursorPointer}`} onClick={() => onClickDepttrackerDialog()}>VIEW CURRENT STATUS</div></Tooltip>
              </div>
            </div>
            <div
              className={`${style.staffLeftCardStyle} ${style.bigCalendarLeftCardWidth} ${style.marginTop20}`}
            >
              <div className={`${style.spaceBetween}  ${style.marginLeftRight10}`}>
                <div className={`${style.leftCardHeadingNameStyle} ${style.alignCenter}`}>
                  Rejected / Declined / Expired{" "}({applicationRejected?.totalRejections})
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
                    // onClick={() => {
                    //   handleClick();
                    // }}
                    >
                      {/* Staff Rejected ({applicationRejected?.appointmentRequestsDenied}) */}
                      Requested But Declined ({applicationRejected?.applicationsApprovedButDenied})
                    </div>
                    <div
                      className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                    // onClick={() => {
                    //   setShowApplicationApprovedDeclineDialog(true);
                    // }}
                    >
                      Locum Staff Rejected ({applicationRejected?.applicationsRejected})
                      {/* Approved But Declined ({applicationRejected?.applicationsRejected}) */}
                    </div>
                    <div
                      className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                    // onClick={() => {
                    //   handleClick();
                    // }}
                    >
                      {/* Staff Rejected ({applicationRejected?.appointmentRequestsDenied}) */}
                      Locum Staff Expired ({applicationRejected?.appointmentRequestsDenied})
                    </div>
                  </>
                )
              }
            </div >
          </SideBar>
        </div>
        <div>
          <div className={`${style.displayInRow} ${style.spaceBetween} ${style.headingForStaffs} ${style.bottomTextStyle}`}>
            {`PRIVILEGED STAFF > LOCUM STAFF`}
          </div>
          <div
            className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} ${style.alignItemsCenter} `}
          >
            <div>
              <LocumStaffTiles
                getSelectedTab={getSelectedTab}
                selectedTab={selectedTab}
                reFetchMetaData={reFetchMetaData}
                getReFetchMetadata={getReFetchMetaData}
                locumCount={totalCount}
                locumexpireCount={totalExpireCount}
                locumTempPrivilegeCount={totalTempPrivilegeCount}
                totalRequestCount={totalRequestCount}
              />
            </div>
            {selectedApplicantType && (
              <div className={`${style.filterBackground} ${style.displayInRow} ${style.marginLeft5}`}>
                <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedApplicantTypeName}</div>
                <Tooltip title="Remove" arrow>
                  <CancelOutlinedIcon
                    sx={{
                      fontSize: 15,
                      color: "#06617A",
                    }}
                    className={style.cursorPointer}
                    onClick={() => setSelectedApplicantType("")}
                  />
                </Tooltip>
              </div>
            )}
            {selectedDepartmentFilter && (
              <div className={`${style.filterBackground} ${style.displayInRow} ${style.marginLeft5}`}>
                <div className={`${style.filtertextStyle} ${style.marginRight5}`}>Filter by {selectedDepartmentName}</div>
                <Tooltip title="Remove Filter" arrow>
                  <CancelOutlinedIcon
                    sx={{
                      fontSize: 15,
                      color: "#06617A",
                    }}
                    className={style.cursorPointer}
                    onClick={() => { setSelectedDepartmentFilter(''); setSelectedServiceArea('') }}
                  />
                </Tooltip>
              </div>
            )}
            {/* {
             workModeType === "Staff Manager" ? ( */}
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
            {/* //   ) : ""
          // } */}
          </div>
          {
            showFilter && (
              <div className={style.filterContainer}>
                {workModeType !== "Department Head" && (
                  <div>
                    <CommonSelectField
                      // value={
                      //   selectedServiceArea 
                      //     ? `${selectedDepartment}|${selectedServiceArea}` 
                      //     : selectedDepartment
                      // }  
                      value={selectedDepartmentFilter}
                      onChange={handleChange}
                      className={style.fullWidth}
                      firstOptionLabel={'All'}
                      firstOptionValue={""}
                      valueList={transformedOptions.map(option => option?.value)}
                      labelList={transformedOptions.map(option => option?.label)}
                      disabledList={transformedOptions.map(() => false)}
                      label={'Dept / Division & Specialty'}
                      required={false}
                    />
                  </div>
                )}
                <div>
                  <CommonSelectField
                    value={selectedApplicantType}
                    onChange={(e) => setSelectedApplicantType(e.target.value)}
                    className={style.fullWidth}
                    firstOptionLabel={'All'}
                    firstOptionValue={''}
                    valueList={applicantTypeFilter?.map(data => data?.id)}
                    labelList={applicantTypeFilter?.map(data => data?.applicantType)}
                    disabledList={applicantType?.map(data => false)}
                    label={'Staff Type'}
                    required={false}
                  />
                </div>
              </div>
            )
          }
          {/* <PeopleOutlinedIcon
          sx={{
            fontSize: 25,
            color: "#06617A",
          }}
          onClick={() => onClickSummaryDialog()} // Pass `data` if needed
        /> */}

          <div className={`${style.bigCardStyle}`}>
            {isLoading ? (
              <div
                className={`${style.verticalAlignCenter} ${style.justifyCenter}`}
              >
                <CircularProgress sx={{ color: "#06617A" }} />
              </div>
            ) : (
              <div ref={componentRef}>
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
                    heading={"There are no Records for you to manage"}
                    onClickFunction={() => { }}
                    getHandleSort={getHandleSort}
                    sortValue={{ sortBy: sortValue, sortByField: sortField }}
                    getSelectedPage={getSelectedPage}
                    totalCount={tableTotalValues}
                    page={page}
                    searchTermForTable={searchTermForTable}
                    searchCount={searchCount}
                    setSearchTermForTable={setSearchTermForTable}
                    onLimitChange={handleLimitChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={style.spaceBetween}>
        <div className={`${style.displayInRow}`}>

          <img
            src={HapiCare}
            alt="footer"
            className={`${style.footerIconStyle} ${style.marginLeft10}`}
          />
        </div>
        <p className={style.poweredBy}>© {new Date().getFullYear()} HapiCare</p>
      </div>
    </div>
  );
};

export default LocumStaffList;
