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

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import TableTwo from "../../../Components/TableDesignTwo";
import PublicIcon from "@mui/icons-material/Public";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import style from "./index.module.scss";
import SideBar from "../../../Components/Sidebar";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";
import { GET, PUT, POST, TenantID } from "../../dataSaver";
import ApplicantTable from "../common/Table";

import DiscreetPrivilegesTiles from "./DiscreetPrivilegesTiles";
import ActivePrivilegesTiles from "./ActivePrivilegesTiles";
import PrivilegeListDialog from "./PrivilegesListDialog";

const ActivePrivilegesList = ({
  isLoading,
  getSelectedTab,
  selectedTab,
  getActiveApplicationView,
  onAddClick,
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    "Privilege ID",
    "Privilege Type",
    "Privilege Title",
    "Department/Service Area",
    "Applicant Type",
    "Last Updated",
    "",
  ];
  const approvedHeaderValues = [
    "",
    "Applicant Name",
    "Type",
    "Notes",
    "Last Updated On",
    "",
  ];
  const locumHeaderValues = [
    "",
    "Applicant Name",
    "Applicant Type",
    "Department",
    "Docs",
    "Data & Disclosures",
    "Last Updated",
    "Reappointment Date",
    "",
  ];

  const applicantColSortValues = [false, false, false, false, false, false];
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
  const locumColSortValues = [false, false, false, false, false, false];

  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] =
    useState(false);

  const getApplicationRejectionDialog = (value) => {
    setShowApplicationRejectionDialog(value);
    setRejectionTab("rejected");
  };

  const onClickViewAndVerifyFunction = (data) => {
    getActiveApplicationView(true);
  };

  useEffect(() => {
    getSentConfirmationCount();
    getRequestAppointmentCount();
    getRejectionCounts();
  }, []);

  const handleOpenDialog = () => {
    if (onAddClick) onAddClick();
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
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
    disclosures = [];
    crs = [];
    crsHoverText = [];
    notes = [];
    notesHoverText = [];
    notesIcon = [];
    lastUpdated = [];
    lastUpdatedBy = [];
    capManager = [];
    action = [];

    tableData?.map((data) => {
      dot.push(
        data?.subStatus === "REVIEW_INPROGRESS"
          ? "yellow"
          : data?.subStatus === "COMPLETED "
          ? "green"
          : "grey"
      );
      applicantName.push(
        `${data?.applicant?.name?.lastName},  ${data?.applicant?.name?.firstName}` ||
          ""
      );
      applicantId.push(data?.Id);
      applicantType.push(data?.providerType.serviceProviderType);
      department.push(data?.department);
      docs.push(data?.docs || "2/8");
      docsHoverText.push([
        "Immunization History Verification From PCP pending",
      ]);
      docsIcon.push(
        <TextSnippetOutlinedIcon
          style={{ fontSize: 20, color: `${data?.subStatus}` }}
        />
      );
      dataStatus.push(data?.dataStatus || "yellow");
      disclosures.push(data?.disclosures || "7/9");
      crs.push(data?.crs || "0");
      crsHoverText.push(["Ontario Medical Society", "Ontario Medical Society"]);
      notes.push(data?.notes || "1");
      notesIcon.push(
        <NoteAltOutlinedIcon style={{ fontSize: 20, color: `#52575D` }} />
      );
      notesHoverText.push([
        "June 13 00:00, Nina Grealy",
        "Lorem ipsum dolor sit amet, consetetur sadipscing.",
      ]);
      lastUpdated.push(
        format(new Date(data?.lastModifiedDate), "MMM dd, yyyy")
      );
      lastUpdatedBy.push("-");
      // const lastUpdatedDate = new Date(data?.lastModifiedDate);
      // lastUpdated.push(isNaN(lastUpdatedDate.getTime()) ? 'Invalid Date' : format(lastUpdatedDate, 'MM-dd-yyyy'));
      capManager.push(data?.capManager || "keerthana ");
      action.push(true);
    });

    return [
      { type: "dot", value: dot, tooltipValue: dotTooltipValues },
      { type: "text", value: applicantName },
      { type: "text", value: applicantType },
      { type: "text", value: department },
      {
        type: "iconWithCount",
        value: docs,
        hoverText: docsHoverText,
        isShowHoverText: true,
        icon: docsIcon,
      },
      { type: "dot", value: dataStatus },
      {
        type: "iconWithCount",
        value: disclosures,
        hoverText: docsHoverText,
        isShowHoverText: true,
        icon: docsIcon,
      },
      { type: "countWithHover", value: crs, hoverText: crsHoverText },
      {
        type: "iconWithCount",
        value: notes,
        hoverText: notesHoverText,
        isShowHoverText: true,
        icon: notesIcon,
      },
      { type: "text", value: lastUpdated },
      { type: "text", value: lastUpdatedBy },
      { type: "text", value: capManager },
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
      data: "Send for Committee Review",
      requiredValue: "boolean",
      onClick: "",
    },
    {
      data: "Send Reminder for Required Documents",
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

  const approvedActionsData = [
    { data: "Add as active staff", requiredValue: "boolean", onClick: "" },
    {
      data: "Send follow up disclosures",
      requiredValue: "boolean",
      onClick: "",
    },
  ];

  const locumActionsData = [
    {
      data: "View & Verify",
      requiredValue: "boolean",
      onClick: onClickViewAndVerifyFunction,
    },
    {
      data: "Send for Committee Review",
      requiredValue: "boolean",
      onClick: "",
    },
    {
      data: "Send Reminder for Required Documents",
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
  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  let tableHeaderValues =
    selectedTab === "permanentStaff"
      ? applicantHeaderValues
      : selectedTab === "locumStaff"
      ? locumHeaderValues
      : approvedHeaderValues;
  let tableSortValues =
    selectedTab === "permanentStaff"
      ? applicantColSortValues
      : selectedTab === "locumStaff"
      ? locumColSortValues
      : approvedColSortValues;
  let tableDataValues =
    selectedTab !== "permanentStaff"
      ? getApprovedValues()
      : getApplicantValues();
  let actions =
    selectedTab === "permanentStaff"
      ? applicantActionsData
      : selectedTab === "locumStaff"
      ? locumActionsData
      : approvedActionsData;
  let gridStyle =
    selectedTab === "permanentStaff"
      ? style.applicantStaffGrid
      : selectedTab === "locumStaff"
      ? style.locumStaffGrid
      : style.approvedStaffGrid;

  return (
    <div className={style.margin20}>
      <div>
        <div
          className={`${style.displayInRow} ${style.spaceBetween} ${style.headingForStaffs} ${style.bottomTextStyle}`}
        >
          STAFF MANAGER {`>`} APPLICATIONS
        </div>
        <div className={`${style.displayInRow} `}>
          <ActivePrivilegesTiles />
          <div className={`${style.floatRight} ${style.marginLeft90}`}></div>
          <button className={`${style.outlinedButton}`}>BULK UPLOAD</button>
          <button
            className={`${style.buttonStyle} ${style.marginLeft20}`}
            onClick={handleOpenDialog}
          >
            ADD MORE
          </button>
        </div>

        <div
          className={`${style.spaceBetween} ${style.marginTop20} ${style.marginLeft30} `}
        >
          <DiscreetPrivilegesTiles
            getSelectedTab={getSelectedTab}
            selectedTab={selectedTab}
          />

          <div className={`${style.spaceBetween} ${style.marginLeft} `}>
            <div
              className={`${isPrintClicked && style.addStyle} ${
                style.alignCenter
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
              className={`${isPrintClicked && style.addStyle} ${
                style.alignCenter
              } ${style.cursorPointer} ${style.marginRight}`}
            >
              <PrintOutlinedIcon
                sx={{
                  fontSize: isPrintClicked ? 20 : 25,
                  color: isPrintClicked ? "#fff" : "#857AEF",
                }}
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
            <div ref={componentRef}>
              <div
                className={`${style.reduceMarginTop10} staffApplicationList`}
                ref={PDFRef}
              >
                {/* <TableTwo
                  tableHeaderValues={tableHeaderValues}
                  tableDataValues={tableDataValues}
                  tableData={tableData}
                  gridStyle={gridStyle}
                  actions={actions}
                  scrollStyle={style.contractScrollStyle}
                  tableSortValues={tableSortValues}
                  onClickFunction={() => {}}
                /> */}
              </div>
            </div>
          )}
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
      {isDialogOpen && (
        <PrivilegeListDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default ActivePrivilegesList;
