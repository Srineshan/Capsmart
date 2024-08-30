import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { GET, DELETE, POST, TenantID } from "../../dataSaver";
import AddNewDepartments from "../addNewDepartments";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import { format } from "date-fns";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import CommonCheckBox from "../../../Components/CommonFields/CommonCheckBox";
import CommonPurpleCheckBox from "../../../Components/CommonFields/CommonPurpleCheckBox";
import SearchBar from "../../../Components/SearchBar";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ApplicantTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

const ProofOfDocumentByIndustries = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);

  const [entityDetails, setEntityDetails] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [siteTypeId, setSiteTypeId] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [entityTypes, setEntityTypes] = useState([]);
  const [departmentServiceMaster, setDepartmentServiceMaster] = useState([]);
  const [departmentService, setDepartmentService] = useState([]);
  const [selectedDepartmentServiceArea, setSelectedDepartmentServiceArea] =
    useState([]);
  const [selectedDepartmentService, setSelectedDepartmentService] = useState(
    {}
  );
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [selectAllList, setSelectAllList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [selectedApplicantType, setSelectedApplicantType] = useState("");

  const sites = [
    {
      id: 1,
      name: "(SITE NAME)",
      type: "Hospital / Acute Care Facility (ACF) site type",
      count: 7,
    },
    {
      id: 2,
      name: "(SITE NAME)",
      type: "Hospital / Acute Care Facility (ACF) site type",
      count: 7,
    },
    {
      id: 3,
      name: "(SITE NAME)",
      type: "Hospital / Acute Care Facility (ACF) site type",
      count: 7,
    },
    {
      id: 4,
      name: "(SITE NAME)",
      type: "Hospital / Acute Care Facility (ACF) site type",
      count: 7,
    },
  ];

  const applicantTypes = [
    {
      name: "Blood Bank",
      type: "Proof of Qualification",
      requirment: "Optional",
      lastUpdated: "Aug 16, 2024",
    },
    {
      name: "Blood Bank",
      type: "Proof of Qualification",
      requirment: "Optional",
      lastUpdated: "Aug 16, 2024",
    },
    {
      name: "Blood Bank",
      type: "Proof of Qualification",
      requirment: "Optional",
      lastUpdated: "Aug 16, 2024",
    },
    {
      name: "Blood Bank",
      type: "Proof of Qualification",
      requirment: "Optional",
      lastUpdated: "Aug 16, 2024",
    },
  ];

  const tableHeadKeys = ["NAME", "", "TYPE", "REQUIRMENT", "LAST UPDATED"];
  const tableDataKeys = ["name", "", "type", "requirment", "lastUpdated"];

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityDetails(entity);
    setEntityId(entity?.[0]?.id);
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

  const getEntityTypes = async () => {
    const { data: entityType } = await GET(`entity-service/entity/${TenantID}`);
    // console.log(entityType?.sites)
    if (entityType?.sites?.length !== 0) {
      setSiteTypeId(entityType?.sites?.[0]?.siteType?.id);
      setSelectedEntityType(entityType?.sites?.[0]?.siteType?.type);
      setEntityTypes(entityType?.sites);
    }
  };

  const getDepartmentServiceMaster = async () => {
    const { data: departmentServiceMaster } = await GET(
      `entity-service/departmentMaster/refListView?siteTypeId=${siteTypeId}`
    );
    setDepartmentServiceMaster(departmentServiceMaster);
  };

  const getDepartmentService = async () => {
    const { data: departmentService } = await GET(
      `entity-service/department/refListView?X-tenantID=${TenantID}&siteTypeId=${siteTypeId}&searchText=${searchKey}`
    );
    setDepartmentService(departmentService);
  };

  useEffect(() => {
    if (entityTypes.length > 0) {
      setSelectedApplicantType(entityTypes[0]?.siteType?.type);
    }
  }, [entityTypes]);

  useEffect(() => {
    let tempDepartmentService = departmentServiceMaster
      ?.filter(
        (data) =>
          !departmentService.some(
            (customerData) =>
              customerData?.departmentGroupBy.name ===
              data?.departmentGroupBy.name
          )
      )
      ?.map((data) => {
        return { ...data };
      });

    setSelectAllList(tempDepartmentService);

    let allChecked = true;

    if (tempDepartmentService.length > selectedDepartmentServiceArea.length) {
      allChecked = false;
    }

    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [selectedDepartmentServiceArea]);

  useEffect(() => {
    getEntity();
    getEntityTypes();
  }, []);

  useEffect(() => {
    if (siteTypeId !== "" && siteTypeId !== undefined) {
      getDepartmentServiceMaster();
      getDepartmentService();
    }
  }, [siteTypeId, entityDetails, searchKey]);

  const handleSiteClick = (siteName) => {
    setSelectedApplicantType(siteName);
  };

  return (
    <Fragment>
      <Navbar />
      <div className={` ${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <div>
            <LevelTwoHeader
              getAddEntityDialog={getAddEntityDialog}
              heading={"Proof of Documentation By Industries"}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"ProofOfDocument"}
            />
          </div>
          <div
            className={`${
              isExpanded ? style.bigCardGrid : style.smallCardGrid
            }`}
          >
            <ApplicantSideBar
              sites={entityTypes}
              siteTitle={"All Applicant Type"}
              onSelectSite={handleSiteClick}
            />
            <div className={style.applicantList}>
              <div className={`${style.Tabletitle} `}>
                <Typography className={style.tableTitleContent}>
                  {`{${selectedApplicantType}}`}
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}
                >
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Documents
                </Typography>
              </div>
              <ApplicantTable
                applicantTypes={applicantTypes}
                applicantNotice={
                  "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
                }
                tableDataKeys={tableDataKeys}
                tableHeadKeys={tableHeadKeys}
                groupFirstTwoColumn={true}
              />
              <ReferenceListActionButton
                button1={"Save In-Progress"}
                button2={" Mark as Done"}
              />
            </div>
          </div>
        </div>

        {showAddEntityDialog && (
          <AddNewDepartments
            getAddEntityDialog={getAddEntityDialog}
            callingFrom={"Customer Admin"}
            isEdit={isEdit}
            getEntityData={getDepartmentService}
            selectedDepart={selectedDepartmentService}
            selectedTitle={selectedEntityType}
            siteTypeId={siteTypeId}
            departmentList={departmentService}
          />
        )}
        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
        </div>
      </div>
    </Fragment>
  );
};

export default ProofOfDocumentByIndustries;
