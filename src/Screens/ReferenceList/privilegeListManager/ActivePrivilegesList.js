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

import { formatInTimeZone } from "date-fns-tz";
import DiscreetPrivilegesTiles from "./DiscreetPrivilegesTiles";
import ActivePrivilegesTiles from "./ActivePrivilegesTiles";
import PrivilegeListDialog from "./PrivilegesListDialog";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ApplicantTable from "../common/Table";
import ReferenceListCommonTable from "../common/Table";

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
  console.log(selectedTab);

  const [rejectionTab, setRejectionTab] = useState("rejected");
  const [requestAppointment, setRequestAppointment] = useState(null);
  const [sentCompletion, setSentCompletion] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showCardAppointment, setShowCardAppointment] = useState(false);
  const [showCardCompletion, setShowCardCompletion] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [applicationRejected, setApplicationRejected] = useState({
    totalRejections: 0,
    appointmentRequestsDenied: 0,
    applicationsRejected: 0,
    applicationsApprovedButDenied: 0,
  });
  const [entityDetails, setEntityDetails] = useState({});
  const [tableData, setTableData] = useState([]);
  const [rejectionListData, setRejectionListData] = useState([]);
  const [staffPrivilegesForm, setStaffPrivilegesForm] = useState([]);

  const applicantHeaderValues = [
    "Privilege ID",
    "Privilege Type",
    "Privilege Title",
    "Department/Service Area",
    "Applicant Type",
    "Last Updated",
  ];

  const tableDataKeys1 = [
    "privilegeId",
    "privilegeType",
    "privilegeTitle",
    "department",
    "applicantType",
    "lastUpdated",
  ];
  const tableDataKeys2 = [
    "privilegeId",
    "privilegeType",
    "privilegeTitle",
    "department",
    "applicantType",
    "lastUpdated",
  ];
  const approvedHeaderValues = [
    "Applicant Name",
    "Applicant Type",
    "Department",
    "Department/Service Area",
    "Data & Disclosures",
    "Last Updated",
    "Reappointment Date",
  ];
  const locumHeaderValues = [
    "",
    "Applicant Name",
    "Applicant Type",
    "Department",
    "Department/Service Area",
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
  const [entityId, setEntityId] = useState("");
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showApplicationRejectionDialog, setShowApplicationRejectionDialog] =
    useState(false);
  const [tableDataValues, setTableDataValues] = useState([]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);
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
  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityDetails(entity);
    setEntityId(entity?.[0]?.id);
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
  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.departments?.lastModified);
    setLastUpdatedDate(
      `${formatInTimeZone(
        date,
        siteTimeZone(),
        "MMM d, yyyy HH:mm"
      )} ${timeZoneAbbreviation()}`
    );
  };
  useEffect(() => {
    const fetchEntityData = async () => {
      const { data: entity } = await GET("entity-service/entity");
      if (entity && entity.length) {
        setEntityId(entity[0].id);
        await getTableData(entity[0].id);
      }
    };

    fetchEntityData();
  }, []);
  const getTableData = async (id) => {
    if (id) {
      try {
        const { data: staffPrivilegesForm } = await GET(
          `entity-service/privilegeMaster?applicantTypeId=${id}`
        );

        setTableData(staffPrivilegesForm || []);
      } catch (error) {
        console.error("Error fetching privileges data:", error);
      }
    }
  };

  const getTableDataValues = () => {
    if (selectedTab === "permanentStaff") {
      return tableData.map((data) => ({
        id: data.id,
        privilegeId: data.privilegeId,
        privilegeType: data.type,
        privilegeTitle: data.title,
        department: data.department || "N/A",
        applicantType:
          data.applicantType.length > 0
            ? data.applicantType[0]?.applicantType
            : "N/A",
        lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
      }));
    } else if (selectedTab === "provisionalStaff") {
      return tableData.map((data) => ({
        id: data.id,
        privilegeId: data.privilegeId,
        privilegeType: data.type,
        privilegeTitle: data.title,
        department: data.department || "N/A",
        applicantType:
          data.applicantType.length > 0
            ? data.applicantType[0]?.applicantType
            : "N/A",
        lastUpdated: format(new Date(data.lastModifiedDate), "MMM dd, yyyy"),
      }));
    }
    return [];
  };

  const getTableHeaderValues = () => {
    return selectedTab === "permanentStaff"
      ? applicantHeaderValues
      : approvedHeaderValues;
  };

  const getTableDataKeys = () => {
    return selectedTab === "permanentStaff" ? tableDataKeys1 : tableDataKeys2;
  };

  useEffect(() => {
    var tableDataValue = getTableDataValues();
    setTableDataValues(tableDataValue);
  }, [selectedTab, tableData]);
  console.log(tableDataValues);

  const getAddEntityTypes = async (data) => {
    await POST(`entity-service/document/?${TenantID}`, data);
  };
  console.log(selectedTab);

  return (
    <div className={style.margin20}>
      <div>
        <LevelTwoHeader
          heading={"Privileges List Manager"}
          updatedTime={`UPDATED ON ${lastUpdatedDate}`}
          path={"/Screens/ReferenceList/department/department"}
          callingFrom={"Customer Admin"}
          needHeader={false}
          tileType={"Privileges List Manager"}
          onAddClick={() => setIsDialogOpen(true)}
          onCloseLevel2={() => setIsDialogOpen(false)}
        />
      </div>
      <div>
        <div
          className={`${style.displayInRow}  ${style.bottomTextStyle} ${style.marginTop10}`}
        >
          Privileges List Manager {`>`} APPLICATIONS
        </div>

        <div className={style.marginTop10}>
          <ActivePrivilegesTiles
            getSelectedTab={getSelectedTab}
            selectedTab={selectedTab}
          />
          <div
            className={`${style.Borderthick}  ${style.padding4} ${style.marginTop1}`}
          />
        </div>

        <div className={`${style.spaceBetween} ${style.marginTop3}  `}>
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

        {/* <div className={`${style.bigCardStyle}`}>
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
              > */}
        <ReferenceListCommonTable
          applicantTypes={tableDataValues}
          applicantNotice={
            "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
          }
          tableDataKeys={getTableDataKeys()}
          tableHeadKeys={getTableHeaderValues()}
          groupFirstTwoColumn={true}
          tileType={"PrivilegeListManager"}
          documents={staffPrivilegesForm}
          getAddEntityTypes={getAddEntityTypes}
          handleClose={handleCloseDialog}
        />
        {/* </div>
            </div>
          )}
        </div> */}
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
