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
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import LoadingScreen from "../../Components/LoadingScreen";

const LocumStaffList = ({
  isLoading,
  getSelectedTab,
  selectedTab,
  getTitleCounts,
  getActiveApplicationView,
  getStaffView,
  getDeptTrackerDialog,
  getLocumExtensiveDialog,
  getLocumExtensiveRequestDialog,
  getLocumRequestDialog,
  getNotesDialog,
  showLocumExtensiveDialog

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

  const [applicationRejected, setApplicationRejected] = useState({
    totalRejections: 0,
    appointmentRequestsDenied: 0,
    applicationsRejected: 0,
    applicationsApprovedButDenied: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [rejectionListData, setRejectionListData] = useState([]);
  const [sortField, setSortField] = useState("DEFAULT");
  const [sortValue, setSortValue] = useState("DESCENDING");
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
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [limit, setLimit] = useState(9999);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  // let userDepartmentList;
  let userSpecialty;

  const activeLocumHeaderValues = ["Locum Staff", "", "Locum Type", "Notes", "Docs", "Start Date", "End Date", "Days to Expiration", "Action"];
  const expiredLocumHeaderValues = ["Locum Staff", "", "Locum Type", "Notes", "Docs", "Last End Date", "Days Since Expired", "Action"];
  const requestLocumHeaderValues = ["Locum Staff", "", "Staff Status","Locum Type", "Notes", "Request By", "End Date", "Days to Expiration", ""];


  const activeLocumColSortValues = [false, false, false, false, false, , false, false, false, false];
  const expiredLocumColSortValues = [false, false, false, false, false, false, false, false, false, false];
  const requestLocumColSortValues = [false, false, false, false, false, false, false, false, false, false];

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] =
    useState(false);
  const [reFetchMetaData, setReFetchMetaData] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalExpireCount, setTotalExpireCount] = useState(0);
  const [totalRequestCount, setTotalRequestCount] = useState(0);

  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected");
  };

  useEffect(() => {
    // setUserDepartmentList (userDetailsFetchOption?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id);
    userSpecialty = userDetailsFetchOption?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.serviceAreas?.[0]?.id;
    console.log("userSpecialty", userDepartmentList, userSpecialty)
    console.log("userDetailsFetchOption", userDetailsFetchOption);

  }, [])

  useEffect(() => {
    sessionStorage.setItem('applicationCreationType', 'LOCUM')
    getRequestUserDataCount();
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
  }, [users?.id])

  useEffect(() => {
    setPage(1);
  }, [selectedTab,selectedDepartment]);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    console.log("userdataaaa" + JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUserDepartmentList(userData?.sites?.sites?.[0]?.departmentList?.departments?.[0]?.id)
    setSelectedDepartment(userData?.sites?.sites[0]?.departmentList?.departments[0]?.id);
    console.log("setUserDetails", userDepartmentList)
  }

  const onClickViewAndVerifyFunction = (data) => {
    getActiveApplicationView(true);
    sessionStorage.setItem("applicationId", data?.currentApplication?.id);
    console.log("id", data?.currentApplication?.id)
    getStaffView(true);
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

  useEffect(() => {
    getActiveUserData(selectedTab);
  }, [selectedTab, sortField, sortValue, page, totalCount, showLocumExtensiveDialog, searchTermForTable, limit]);

  const getReFetchMetaData = (value) => {
    setReFetchMetaData(value);
  };

  console.log("searchTermForTable", searchTermForTable)

  const getSelectedPage = (value) => {
    setPage(value);
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const onClickExtensiveLocumDialog = (data) => {
    getLocumExtensiveDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
  };

  const onClickRequestLocumDialog = (data) => {
    getLocumRequestDialog(true);
    sessionStorage.setItem("applicationId", data?.id);
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
    getRequestUserDataCount();
    // getActiveUserDataSearch();
    console.log("setSelectedDepartment", selectedDepartment)
  }, [selectedDepartment, searchTermForTable]);

  // useEffect(() => {
  //   getActiveUserDataActiveCount();
  //   getActiveUserDataExpireCount();
  // }, [selectedDepartment]);

  const getActiveUserDataActiveCount = async () => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.id;

      let apiUrl = `application-management-service/staff?status=ACTIVE&type=LOCUM&noOfDays=30&isExpired=false&searchText=${searchTermForTable}`;

      if (userDepartmentListData) {
        apiUrl += `&departmentSpecialties=${userDepartmentListData}`;
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
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.id;

      let apiUrl = `application-management-service/application/request?requestType=LOCUM_RENEWAL_REQUEST&status=PENDING`;

      if (userDepartmentListData) {
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
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.id;

      let apiUrl = `application-management-service/staff?status=ACTIVE&type=LOCUM&noOfDays=30&isExpired=true&searchText=${searchTermForTable}`;

      if (userDepartmentListData) {
        apiUrl += `&departmentSpecialties=${userDepartmentListData}`;
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

  const getActiveUserDataSearch = async (signal) => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments[0]?.id;

      let apiUrl = `application-management-service/staff?status=ACTIVE&type=LOCUM&noOfDays=30&isExpired=${selectedTab === "ACTIVELOCUM" ? false : true}&searchText=${searchTerm}`;

      if (selectedDepartment) {
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

      const getActiveUserData = async () => {
        try {
          setIsLoadingImage(true);
      
          let apiUrl = "";
      
          if (selectedTab === "REQUEST") {
            apiUrl = `application-management-service/application/request?requestType=LOCUM_RENEWAL_REQUEST&status=PENDING`;
            if (selectedDepartment) {
              apiUrl += `&departmentSpecialties=${selectedDepartment}`;
            }
          } else {
            const isExpired = selectedTab === "ACTIVELOCUM" ? false : true;
            const isPaginationRequired = limit === 9999 ? false : true;
      
            apiUrl = `application-management-service/staff?status=ACTIVE&type=LOCUM&noOfDays=30&isExpired=${isExpired}&searchText=${searchTermForTable}&isPaginationRequired=${isPaginationRequired}&limit=${limit}&offset=${page - 1}`;
      
            if (selectedDepartment) {
              apiUrl += `&departmentSpecialties=${selectedDepartment}`;
            }
          }
      
          const response = await GET(apiUrl);
      
          if (selectedTab === "REQUEST") {
            setTableData(response?.data?.requests || []);
            setSearchCount(response?.data?.numberOfElements || 0);
          } else {
            setTableData(response?.data?.staffs || []);
            setSearchCount(response?.data?.numberOfElements || 0);
          }
      
          setIsLoadingImage(false);
          console.log("tableData1234567890",tableData)
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

  const getLocumActiveValues = () => {
    dot = [];
    applicantName = [];
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

    tableData?.map((data) => {
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      if (data?.reAppointmentInitiated === true) {
        iconStatus.push(
          <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
        );
      } else {
        iconStatus.push("");
      }

      reappointDate.push([
        data?.reAppointmentInitiated
          ? ` Locum Extension Request Sent on ${format(new Date(data?.reAppointmentSentDate), "dd/MM/yyyy")}`
          : "Locum Extension Not Sent",
      ]);
      applicantId.push(data?.staffId || "123");

      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      docs.push("0/3");
      docsIcon.push(
        <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#b0a6a6` }} />
      );
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      notesHoverText.push([
        "June 13 00:00, Nina Grealy",
        "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      ]);
      startDate.push(
        data?.tenure?.from
          ? format(new Date(data?.tenure?.from), "MMM dd, yyyy")
          : "-"
      );
      endDate.push(
        data?.tenure?.to ? format(new Date(data?.tenure?.to), "MMM dd, yyyy") : "-"
      );
      lastUpdatedBy.push(["-"]);

      if (data?.tenure?.to) {
        const expiredDays = differenceInDays(new Date(data?.tenure?.to), new Date());
        ExpiredDays.push(expiredDays.toString());
      } else {
        ExpiredDays.push("-");
      }

      action.push(true);

      console.log("tabledata" + tableData);
    });

    return [
      // { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      {
        type: "iconWithCount",
        icon: iconStatus,
        // value: reappointValue,
        hoverText: reappointDate,
        isShowHoverText: true,
      },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // { type: "text", value: department },
      {
        type: "iconWithCount",
        value: notes,
        // hoverText: notesHoverText,
        // isShowHoverText: true,
        icon: notesIcon,
      },
      {
        type: "iconWithCount",
        value: docs,
        // hoverText: docsHoverText,
        // isShowHoverText: true,
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
      { type: "text", value: ExpiredDays },
      { type: "action", value: action },
    ];
  };

  const getExpiredLocumValues = () => {
    dot = [];
    dot = [];
    applicantName = [];
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

    tableData?.map((data) => {
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
      // applicantType.push(data?.providerType.serviceProviderType);
      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      // applicantId.push(data?.displayId);
      if (data?.reAppointmentInitiated === true) {
        iconStatus.push(
          <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
        );
      } else {
        iconStatus.push("");
      }

      reappointDate.push([
        data?.reAppointmentInitiated
          ? ` Locum Renewal Request Sent on ${format(new Date(data?.reAppointmentSentDate), "dd/MM/yyyy")}`
          : "Locum Renewal Not Sent",
      ]);
      applicantId.push(data?.staffId || "123");
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      docs.push("0/3");
      docsIcon.push(
        <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `#b0a6a6` }} />
      );
      cr.push("-");

      cos.push("grey");
      cc.push("grey");

      const expiredDays = differenceInDays(new Date(data?.tenure?.to), new Date());
      ExpiredDays.push(Math.abs(expiredDays).toString());
      endDate.push(
        data?.tenure?.to ? format(new Date(data?.tenure?.to), "MMM dd, yyyy") : "-"
      );
      // lastUpdatedBy.push([data?.updatedBy || "-"]);
      action.push(true);
    });

    return [
      // { type: "dot", value: dot },
      { type: "text", value: applicantName },
      {
        type: "iconWithCount",
        icon: iconStatus,
        // value: reappointValue,
        hoverText: reappointDate,
        isShowHoverText: true,
      },
      // { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      {
        type: "iconWithCount",
        value: notes,
        // hoverText: notesHoverText,
        // isShowHoverText: true,
        icon: notesIcon,
      },
      {
        type: "iconWithCount",
        value: docs,
        icon: docsIcon,
      },
      {
        type: "iconWithCount",
        value: endDate,
      },
      {
        type: "iconWithCount",
        value: ExpiredDays,
      },
      { type: "action", value: action },
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

    tableData?.map((data,uniqueKey) => {
      applicantName.push(
        `${formatFirstNameLastName(data?.staff?.applicant?.name?.firstName, data?.staff?.applicant?.name?.lastName)}` || " "
      );
      if (data?.staff?.reAppointmentInitiated === true) {
        iconStatus.push(
          <img src={Renewed} alt="Renewed Icon" style={{ width: 20, height: 20 }} />
        );
      } else {
        iconStatus.push("");
      }

      reappointDate.push([
        data?.staff?.reAppointmentInitiated
          ? `Locum ${
              data?.locumRenewalDetails?.reappointmentType === "EXTENSION"
                ? "Extension"
                : "Renewal"
            } Request Sent on ${format(new Date(data?.staff?.reAppointmentSentDate), "dd/MM/yyyy")}`
          : "Locum Extension Not Sent",
      ]);
      applicantId.push(data?.staff?.status === "ACTIVE" ? "Active" : "Expired" || "");

      applicantType.push(data?.staff?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
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
          {format(new Date(data?.createdDate), 'MMM dd, yyyy')}
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
      endDate.push(
        data?.staff?.tenure?.to ? format(new Date(data?.staff?.tenure?.to), "MMM dd, yyyy") : "-"
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
      { type: "text", value: applicantName },
      {
        type: "iconWithCount",
        icon: iconStatus,
        // value: reappointValue,
        hoverText: reappointDate,
        isShowHoverText: true,
      },
      { type: "text", value: applicantId },
      { type: "text", value: applicantType },
      // // { type: "text", value: department },
      {
        type: "iconWithCount",
        value: notes,
        // hoverText: notesHoverText,
        // isShowHoverText: true,
        icon: notesIcon,
      },
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
      data: "Extend",
      requiredValue: "boolean",
      onClick: onClickExtensiveLocumDialog,
      conditionToShow: `data?.reAppointmentInitiated === false`,
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
      data: "Request For Locum Extension",
      requiredValue: "boolean",
      onClick: onClickExtensiveRequestLocumDialog,
      // conditionToShow: `data?.reAppointmentInitiated === false`,
    },
    // {
    //   data: "Create Note",
    //   requiredValue: "boolean",
    //   onClick: onClickNotesDialog,
    // },
  ];

  const expiredLocumActionsData = [
    {
      data: "Reactivate",
      requiredValue: "boolean",
      onClick: onClickExtensiveLocumDialog,
      conditionToShow: `data?.reAppointmentInitiated === false`,
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
      data: "Request For Locum Reactivation",
      requiredValue: "boolean",
      onClick: onClickExtensiveRequestLocumDialog,
      // conditionToShow: `data?.reAppointmentInitiated === false`,
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
      data: `${tableData?.locumRenewalDetails?.reappointmentType === "EXTENSION" ? "Review to Extend" : "Review to Renew"}`,
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
        : selectedTab === "REQUEST"
        ? requestLocumHeaderValues
        : activeLocumHeaderValues
  let tableSortValues =
    selectedTab === "ACTIVELOCUM"
      ? activeLocumColSortValues
      : selectedTab === "EXPIREDLOCUM"
        ? expiredLocumColSortValues
        : selectedTab === "REQUEST"
        ? requestLocumColSortValues
        : activeLocumColSortValues
  // let tableDataValues = selectedTab !== 'applicantsToProcess' ? getApplicantValues() : selectedTab === 'level-1' ? getApplicationValues() : selectedTab === 'level-1' ? getApplicationValues() : getApplicationValues();
  let tableDataValues =
    selectedTab === "ACTIVELOCUM"
      ? getLocumActiveValues()
      : selectedTab === "EXPIREDLOCUM"
        ? getExpiredLocumValues()
        : selectedTab === "REQUEST"
        ? getLocumRequestValues()
        : getLocumActiveValues()
  let actions =
    selectedTab === "ACTIVELOCUM" && workModeType === "Staff Manager"
      ? activeLocumActionsSMData
      : selectedTab === "ACTIVELOCUM" && workModeType === "Department Head"
        ? activeLocumActionsData
        : selectedTab === "EXPIREDLOCUM" && workModeType === "Department Head"
          ? expiredLocumActionsData
          : selectedTab === "EXPIREDLOCUM" && workModeType === "Staff Manager"
            ? expiredLocumActionsSMData
            : selectedTab === "REQUEST"
            ? requestLocumActionsData
            : activeLocumActionsData
  let gridStyle =
    selectedTab === "ACTIVELOCUM"
      ? style.activeLocumStaffGrid
      : selectedTab === "EXPIREDLOCUM"
        ? style.expiredLocumStaffGrid
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
                  Locum Renewal Status Tracker
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
                <div className={`${style.viewCurrentStatusText} ${style.marginTop10} ${style.cursorPointer}`} onClick={() => onClickDepttrackerDialog()}>VIEW CURRENT STATUS</div>
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
                      Requested But Declined ({applicationRejected?.applicationsRejected})
                    </div>
                    <div
                      className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                    // onClick={() => {
                    //   setShowApplicationApprovedDeclineDialog(true);
                    // }}
                    >
                      Locum Staff Rejected ({applicationRejected?.appointmentRequestsDenied})
                      {/* Approved But Declined ({applicationRejected?.applicationsRejected}) */}
                    </div>
                    <div
                      className={`${style.borderStyle} ${style.marginTop} ${style.textStyle}`}
                    // onClick={() => {
                    //   handleClick();
                    // }}
                    >
                      {/* Staff Rejected ({applicationRejected?.appointmentRequestsDenied}) */}
                      Locum Staff Expired ({applicationRejected?.applicationsRejected})
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
            className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} `}
          >
            <LocumStaffTiles
              getSelectedTab={getSelectedTab}
              selectedTab={selectedTab}
              reFetchMetaData={reFetchMetaData}
              getReFetchMetadata={getReFetchMetaData}
              locumCount={totalCount}
              locumexpireCount={totalExpireCount}
              totalRequestCount={totalRequestCount}
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
                    heading={"There are no Record for you to manage"}
                    onClickFunction={() => { }}
                    getHandleSort={getHandleSort}
                    sortValue={{ sortBy: sortValue, sortByField: sortField }}
                    getSelectedPage={getSelectedPage}
                    totalCount={totalCount}
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
