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
import { Typography } from "@material-ui/core";

const StaffPrivileges = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [tableData, setTableData] = useState();
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
  const [sites, setSites] = useState([]);
  const applicantTypes = [
    {
      id: "021",
      title: "Bood Bank",
      category: "Needle Puncture",
      type: "No",
      pod: "Yes",
      lastUpdated: "Aug 16, 2024",
    },
    {
      id: "021",
      title: "Bood Bank",
      category: "Needle Puncture",
      type: "No",
      pod: "Yes",

      lastUpdated: "Aug 16, 2024",
    },
    {
      id: "021",
      title: "Bood Bank",
      category: "Needle Puncture",
      type: "No",
      pod: "Yes",
      lastUpdated: "Aug 16, 2024",
    },
    {
      id: "021",
      title: "Bood Bank",
      category: "Needle Puncture",
      type: "No",
      pod: "Yes",
      lastUpdated: "Aug 16, 2024",
    },
  ];

  const tableHeadKeys = [
    // "ID",
    // "TITLE",
    "CATEGORY",
    // "TYPE",
    // "POD",
    "LAST UPDATED",
  ];
  const tableDataKeys = ["applicantType", "lastModifiedDate"];
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

  const getAddEntityTypes = async (data) => {
    await POST(`entity-service/document/?${TenantID}`, data);
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
    const { data: entityType } = await GET(`entity-service/staffPrivilege`);

    if (entityType) {
      const allSites = entityType.flatMap((entity) => entity.sites || []);
      setEntityTypes(allSites);
      setTableData(entityType);
    }
  };
  console.log(entityTypes);

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

  useEffect(() => {
    if (entityTypes.length > 0) {
      setSelectedApplicantType(entityTypes[0]?.siteName?.siteName);
    }
  }, [entityTypes]);

  const handleSiteClick = (siteName) => {
    setSelectedApplicantType(siteName);
  };
  console.log(tableData);

  return (
    <Fragment>
      <Navbar />
      <div className={` ${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <div>
            <LevelTwoHeader
              heading={
                "Staff Privileges for department & service areas by applicant types"
              }
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"StaffPrivileges"}
            />
          </div>
          <div
            className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid
              }`}
          >
            <ApplicantSideBar
              applicantType={
                entityTypes?.map((item) => item.siteName.siteName) || []
              }
              siteTitle={"Cambride Memorial Hospitals"}
              onSelectSite={handleSiteClick}
              siteDropdown={true}
            />
            <div className={style.applicantList}>
              <div className={`${style.Tabletitle} `}>
                <Typography className={style.tableTitleContent}>
                  Cambride Memorial Hospitals
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}
                >
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  {`${selectedApplicantType}`}
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}
                >
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Applicant Types
                </Typography>
              </div>
              {tableData && (
                <ApplicantTable
                  applicantTypes={
                    tableData && tableData.length > 0 && tableData
                  }
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                />
              )}
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

export default StaffPrivileges;
