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
import ActionStaffTiles from "./activeStaffTiles";
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
import { useNavigate } from "react-router-dom";
import { GET, PUT, POST, TenantID } from "../dataSaver";
import CircleIcon from "@mui/icons-material/Circle";
import { SuccessToaster } from "../../utils/toaster";
import { ErrorToaster } from "../../utils/toaster";
import Tooltip from "@mui/material/Tooltip";
import { formatFirstNameLastName } from "../../utils/formatting";
import CommonSearchField from "../../Components/CommonFields/CommonSearchField";
import LoadingScreen from "../../Components/LoadingScreen";

const ActiveStaffList = ({
  isLoading,
  getSelectedTab,
  selectedTab,
  getTitleCounts,
  getActiveApplicationView,
  getStaffView

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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState([]);
  const [searchTermForTable, setSearchTermForTable] = useState('');
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
  const [searchCount, setSearchCount] = useState(0);
  const [limit, setLimit] = useState(9999);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const workModeType = sessionStorage.getItem("workModeType")
  const userDetailsFetchOption = (sessionStorage.getItem('user') !== "undefined" && sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : {};
  const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
  const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
  const permanentHeaderValues = ["", "Staff Name", "Staff ID", "Staff Type", "Docs", "Notes", "Last Updated", "Action"];
  const locumHeaderValues = ["", "Staff Name", "Staff ID", "Staff Type", "CR", "COS", "CC", "CC Date", "Last Updated", "Action"];
  const temporaryStaffHeaderValues = ["Staff Name", "Staff ID", "Staff Type", "CC Approval", "COS Approval", "Last Updated"];
  const approvedHeaderValues = ["", "Staff Name", "Type", "Notes", "Last Updated On", ""];


  const permanentColSortValues = [false, true, false, true, false, false, true, false];
  const locumColSortValues = [false, true, false, true, false, false, false, false, true, false];
  const temporaryStaffColSortValues = [false, false, false, false, false, false];
  const approvedColSortValues = [false, false, false, false, false, false, false, false, false];

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] =
    useState(false);
  const [reFetchMetaData, setReFetchMetaData] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected");
  };

  // const onClickViewAndVerifyFunction = (data) => {
  //   getActiveApplicationView(true);
  // }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const onClickViewAndVerifyFunction = (data) => {
    getActiveApplicationView(true);
    sessionStorage.setItem('applicationCreationType', 'REAPPOINTMENT');
    sessionStorage.setItem("applicationId", data?.currentApplication?.id);
    console.log("id", data?.currentApplication?.id)
    getStaffView(true);
  };

  const onClickReappointmentFunction = (data) => {
    reappointmentApplication(data?.id);
    sessionStorage.setItem("applicationId", data?.id);
  };

  useEffect(() => {
    getSentConfirmationCount();
    getRequestAppointmentCount();
    getRejectionCounts();
  }, []);

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
    getActiveUserData(selectedTab);
  }, [selectedTab, sortField, sortValue, page, totalCount, searchTermForTable, limit]);

  const getReFetchMetaData = (value) => {
    setReFetchMetaData(value);
  };

  const getSelectedPage = (value) => {
    setPage(value);
  }

  const handleShowForSearch = () => {
    console.log('search', searchTerm)
    setSearchTermForTable(searchTerm)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

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

  const getActiveUserDataSearch = async (signal) => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments?.[0]?.id;
      let apiUrl = `application-management-service/staff?status=ACTIVE&searchText=${searchTerm}`;
      if (userDepartmentListData && workModeType === "Department Head") {
        apiUrl += `&departmentId=${userDepartmentListData}`;
      }
      const response = await GET(apiUrl, { signal });

      console.log("Application data", response?.data?.staffs);
      setSearchData(response?.data?.staffs.map(item => ({
        id: item.id,
        name: `${formatFirstNameLastName(item?.applicant?.name?.firstName, item?.applicant?.name?.lastName)}` || " ",
        desc: `${item?.basicDetailReferences?.department?.name} | ${item?.basicDetailReferences?.applicantType?.serviceProviderType}`
      })));
      return response?.data?.staffs || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
  };

  const getActiveUserData = async () => {
    try {
      const userDepartmentListData =
        userDetailsFetchOption?.sites?.sites[0]?.departmentList?.departments?.[0]?.id;
      let apiUrl = `application-management-service/staff?type=${selectedTab}&status=ACTIVE&limit=${limit}&offset=${page - 1}&searchText=${searchTermForTable}&sortBy=${sortValue}&sortByField=${sortField}`
      if (userDepartmentListData && workModeType === "Department Head") {
        apiUrl += `&departmentId=${userDepartmentListData}`;
      }
      setIsLoadingImage(true)
      const response = await GET(
        // `application-management-service/application/workflowUser?tab=${selectedTab}`
        //  `application-management-service/application/workflowUser?tab=${selectedTab}&sortBy=${sortValue}&sortByField=${sortField}&applicationCreationType=REAPPOINTMENT`
        apiUrl
      );
      console.log("Application data", response?.data?.staffs);
      setTableData(response?.data?.staffs);
      setTotalCount(response?.data?.numberOfElements);
      setSearchCount(response?.data?.numberOfElements || 0);
      setIsLoadingImage(false)
      return response?.data || [];
    } catch (error) {
      console.error("Error fetching applications:", error);
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
    await GET("application-management-service/application/rejected/meta")
      .then((response) => {
        setApplicationRejected(response?.data);
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
  let taskListStatus = [];
  let taskListDotColor = [];
  let cr = [];
  let cos = [];
  let cc = [];
  let ccdate = [];
  let ccapproval = [];
  let cosapproval = [];

  // const getApplicantValues = () => {
  //   dot = [];
  //   applicantName = [];
  //   applicantId = [];
  //   applicantType = [];
  //   department = [];
  //   docs = [];
  //   docsHoverText = [];
  //   docsIcon = [];
  //   dataStatus = [];
  //   disclosures = [];
  //   crs = [];
  //   crsHoverText = [];
  //   notes = [];
  //   notesHoverText = [];
  //   notesIcon = [];
  //   lastUpdated = [];
  //   lastUpdatedBy = [];
  //   capManager = [];
  //   action = [];

  //   tableData?.map(data => {
  //     dot.push(data?.subStatus === 'REVIEW_INPROGRESS' ? 'yellow' : data?.subStatus === 'COMPLETED ' ? 'green' : 'grey');
  //     applicantName.push(`${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` || '');
  //     applicantId.push(data?.Id);
  //     applicantType.push(data?.providerType.serviceProviderType);
  //     department.push(data?.department);
  //     docs.push(data?.docs || '2/8');
  //     docsHoverText.push(["Immunization History Verification From PCP pending"])
  //     docsIcon.push(<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} />);
  //     dataStatus.push(data?.dataStatus || 'yellow');
  //     disclosures.push(data?.disclosures || '7/9');
  //     crs.push(data?.crs || '0');
  //     crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"])
  //     notes.push(data?.notes || '1');
  //     notesIcon.push(<NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />);
  //     notesHoverText.push(["June 13 00:00, Nina Grealy", "Lorem ipsum dolor sit amet, consetetur sadipscing."])
  //     lastUpdated.push(format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy'))
  //     lastUpdatedBy.push('-')
  //     // const lastUpdatedDate = new Date(data?.lastModifiedDate);
  //     // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
  //     capManager.push(data?.capManager || 'keerthana ');
  //     action.push(true);
  //   })

  //   return [
  //     { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
  //     { "type": "text", "value": applicantName },
  //     { "type": "text", "value": applicantType },
  //     { "type": "text", "value": department },
  //     { "type": "iconWithCount", "value": docs, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
  //     { "type": "dot", "value": dataStatus },
  //     { "type": "iconWithCount", "value": disclosures, "hoverText": docsHoverText, 'isShowHoverText': true, "icon": docsIcon },
  //     { "type": "countWithHover", "value": crs, "hoverText": crsHoverText },
  //     { "type": "iconWithCount", "value": notes, "hoverText": notesHoverText, 'isShowHoverText': true, "icon": notesIcon },
  //     { "type": "text", "value": lastUpdated },
  //     { "type": "text", "value": lastUpdatedBy },
  //     { "type": "text", "value": capManager },
  //     { "type": "action", "value": action },
  //   ];
  // }

  const getPermanentValues = () => {
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
      dot.push(
        data?.status === "SUBMITTED"
          ? "yellow"
          : data?.status === "APPROVED"
            ? "green"
            : "grey"
      );
      applicantName.push(
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantId.push(data?.displayId || "123");
      applicantId.push(data?.staffId || "123");
      // applicantType.push(data?.providerType?.serviceProviderType || "Doctor");
      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      if (data?.documents?.length === 0) {
        docs.push("-");
        docsIcon.push("");
        docsHoverText.push("");
      } else {
        docs.push(data?.documents?.filter(data => data?.documentStatus)?.length + "/" + data?.documents?.length);

        docsIcon.push(
          <TextSnippetOutlinedIcon style={{ fontSize: 20, color: data?.documents?.filter(data => data?.documentStatus)?.length === data?.documents?.length ? `#00C07F` : '#FFCA27' }} />
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
      // dataStatus.push(data?.dataStatus || "green");
      // dataStatus.push(data?.dataStatus === "REVIEW_INPROGRESS"
      //   ? "yellow"
      //   : data?.status === "APPROVED"
      //   ? "green"
      //   : "grey");
      // disclosures.push(data?.disclosures || '7/9');
      // crs.push(data?.clarificationRequiredFor || "-");
      // crs.push("-");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      // notes.push(data?.notes.length || "0");
      notes.push("0");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#2C2C2C` }} />
      );
      // const notesDetails = data?.notes || [];
      // const notesHoverTextArray = notesDetails.length > 0 ? notesDetails.map(note => note.notes) : ["-"];
      notesHoverText.push([]);
      // notesHoverText.push(notesHoverTextArray);

      // if (data?.tasks?.completedCount === data?.tasks?.totalCount) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#14B15A` }}/>);
      // } else if (data?.tasks?.completedCount === 0) {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#94979A` }}/>);
      // } else {
      //   taskListDotColor.push(<CircleIcon style={{ fontSize: 14, color: `#FFCA27` }}/>);
      // }

      // taskListStatus.push(data?.tasks.completedCount + "/" + data?.tasks.totalCount);
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), dateFormat)
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
      // {
      //   type: "countWithHover",
      //   value: crs,
      //   hoverText: crsHoverText,
      //   isShowHoverText: true,
      // },
      {
        type: "iconWithCount",
        value: notes,
        hoverText: notesHoverText,
        isShowHoverText: false,
        icon: notesIcon,
      },
      // { type: "iconWithCount",
      //    value: taskListStatus ,
      //    icon: taskListDotColor },
      // { type: "dot", value: taskListDotColor, tooltipValue: dotTooltipValues },
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
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      // applicantType.push(data?.providerType.serviceProviderType);
      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      // applicantId.push(data?.displayId);
      applicantId.push(data?.staffId || "123");
      // department.push(
      //   data?.basicDetails?.departmentSpecialty?.department || "-"
      // );
      // commiteeStatus.push(data?.commiteeStatus || "yellow");
      // boardStatus.push(data?.boardStatus || "green");
      // ceoStatus.push(data?.ceoStatus || "grey");
      // cr.push(data?.clarificationRequiredFor || "-");
      cr.push("-");
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
      cos.push("grey");
      cc.push("grey");
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
      // if (data?.logs[data.logs.length - 2]?.role === "Credentialing Committee") {
      //   ccdate.push(
      //     format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
      //   )
      // } else { ccdate.push("-") }
      ccdate.push("-")
      lastUpdatedOn.push(
        format(new Date(data?.lastModifiedDate), dateFormat)
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


  const getTemporaryStaffValues = () => {
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
        `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
      );
      applicantId.push(data?.staffId || "123");
      applicantType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType || "Doctor");
      ccapproval.push(data?.ccapproval || "05/05/2024");
      // ccapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 1]?.role === "Credentialing Committee") {
      //   ccapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      //   )
      // } else { ccapproval.push("-") }
      cosapproval.push(data?.cosapproval || "05/05/2024");
      // cosapproval.push(
      //   format(new Date(data?.logs[data.logs.length - 1].createdDate), "MMM dd, yyyy")
      // );
      // if (data?.logs[data.logs.length - 2]?.role === "Chief Of Staff") {
      //   cosapproval.push(
      //     format(new Date(data?.logs[data.logs.length - 2].createdDate), "MMM dd, yyyy")
      //   )
      // } else { cosapproval.push("-") }
      // taskListStatus.push("2/3");
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), dateFormat)
      );
      // lastUpdatedBy.push(["-"]);
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
      // { type: "text", value: taskListStatus },
      {
        type: "iconWithCount",
        value: lastUpdated,
        hoverText: lastUpdatedBy,
        isShowHoverText: true,
      },
      // { type: "action", value: action },
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
        format(new Date(data?.lastModifiedDate), dateFormat)
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

  const permanentActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyFunction,
    },
    // { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ];

  const approvedActionsData = [
    {
      data: "Add as active staff",
      requiredValue: "boolean",
      // onClick: onClickReappointmentFunction,
    },
    {
      data: "Send follow up disclosures",
      requiredValue: "boolean",
      onClick: "",
    },
  ];

  const locumActionsData = [
    {
      data: "View",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyFunction,
    },
    // { 'data': 'Send for Committee Review', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Send Reminder for Required Documents', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'Request for Clarification', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Applicant', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Internal Approver', 'requiredValue': 'boolean', "onClick": '' },
    // { 'data': 'From Institution', 'requiredValue': 'boolean', "onClick": '' },
  ];
  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  let tableHeaderValues =
    selectedTab === "PERMANENT"
      ? permanentHeaderValues
      : selectedTab === "LOCUM"
        ? locumHeaderValues
        : selectedTab === "PROVISIONAL"
          ? temporaryStaffHeaderValues
          : approvedHeaderValues;
  let tableSortValues =
    selectedTab === "PERMANENT"
      ? permanentColSortValues
      : selectedTab === "LOCUM"
        ? locumColSortValues
        : selectedTab === "PROVISIONAL"
          ? temporaryStaffColSortValues
          : approvedColSortValues;
  // let tableDataValues = selectedTab !== 'applicantsToProcess' ? getApplicantValues() : selectedTab === 'level-1' ? getApplicationValues() : selectedTab === 'level-1' ? getApplicationValues() : getApplicationValues();
  let tableDataValues =
    selectedTab === "PERMANENT"
      ? getPermanentValues()
      : selectedTab === "LOCUM"
        ? getLocumValues()
        : selectedTab === "PROVISIONAL"
          ? getTemporaryStaffValues()
          : // :[];

          // : getApprovedValues();
          getPermanentValues();
  let actions =
    selectedTab === "PERMANENT"
      ? permanentActionsData
      : selectedTab === "LOCUM"
        ? locumActionsData
        : selectedTab === "PROVISIONAL"
          ? locumActionsData
          : approvedActionsData;
  let gridStyle =
    selectedTab === "PERMANENT"
      ? style.permanentStaffGrid
      : selectedTab === "LOCUM"
        ? style.locumStaffGrid
        : selectedTab === "PROVISIONAL"
          ? style.temporaryStaffGrid
          : style.approvedStaffGrid;

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
              <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={handleShowForSearch} isOnClickAvailable={false} placeholder={'Search By Staff Name'} />
            </div>
          </SideBar>
        </div>
        <div>
          <div className={`${style.displayInRow} ${style.spaceBetween} ${style.headingForStaffs} ${style.bottomTextStyle}`}>
            {`PRIVILEGED STAFF > PERMANENT STAFF`}
          </div>

          <div
            className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} `}
          >
            <ActionStaffTiles
              getSelectedTab={getSelectedTab}
              selectedTab={selectedTab}
              reFetchMetaData={reFetchMetaData}
              totalCount={totalCount}
              getReFetchMetadata={getReFetchMetaData}
            />

            <div className={`${style.spaceBetween} ${style.marginLeft} `}>
              {/* <div
                className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                  } ${style.cursorPointer} ${style.marginRight20}`}
              >
                <SearchOutlinedIcon
                  sx={{
                    fontSize: isPrintClicked ? 20 : 25,
                    color: isPrintClicked ? "#fff" : "#06617A",
                  }}
                />
              </div> */}
              <Tooltip title="Fill Historical Data" arrow>
                <div
                  className={`${style.alignCenter
                    } ${style.cursorPointer} ${style.marginRight20}`}
                  onClick={() => navigate("/historicalData")}
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 25, color: '#06617A' }} />
                </div>
              </Tooltip>
              {/* <Tooltip title="Print" arrow>
                <div
                  className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                    } ${style.cursorPointer} ${style.marginRight}`}
                >
                  <PrintOutlinedIcon
                    sx={{
                      fontSize: isPrintClicked ? 20 : 25,
                      color: isPrintClicked ? "#fff" : "#06617A",
                    }}
                  />
                </div>
              </Tooltip> */}
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
    </div>
  );
};

export default ActiveStaffList;
