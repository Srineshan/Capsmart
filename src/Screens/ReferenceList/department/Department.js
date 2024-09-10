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
import DepartmentDialog from "./DepartmentDialog";

const Departments = () => {
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [applicantId, setApplicantId] = useState("");
  const [departmentForms, setDepartmentForms] = useState([]);
  const [editData, setEditData] = useState();

  const tableHeadKeys = [
    // "ID",
    // "TITLE",
    "DEPARTMENT",
    // "TYPE",
    // "POD",
    "CREATED DATE",
    "LAST UPDATED",
  ];
  const tableDataKeys = ["departmentName", "createdDate", "lastModifiedDate"];
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

  useEffect(() => {
    getStaffPrivileges(applicantId);
  }, [applicantId]);

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
    const { data: entityType } = await GET(`entity-service/department`);

    if (entityType) {
      const allSites = entityType.flatMap((entity) => entity.sites || []);
      setEntityTypes(allSites);

      setTableData(entityType);
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
      setSelectedApplicantType(entityTypes[0]?.name);
    }
  }, [entityTypes]);

  const handleSiteClick = (siteName) => {
    setSelectedApplicantType(siteName);
  };
  console.log(tableData);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (applicantTypeList && applicantTypeList.length > 0) {
      setSelectedApplicantType(applicantTypeList[0]?.applicantType || "");
    }
  }, [applicantTypeList]);

  const getStaffPrivileges = async (id) => {
    if (id !== "") {
      const { data: staffPrivilegesForm } = await GET(
        `entity-service/department?applicantTypeId=${id}`
      );
      setDepartmentForms(staffPrivilegesForm);
    }
  };

  const getSelectedTile = (data) => {
    setApplicantId(data);
    getStaffPrivileges(data);
  };

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    console.log("applicantType", types);
    setApplicantTypeList(types);
  };

  useEffect(() => {
    getApplicantType();
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div className={` ${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <div>
            <LevelTwoHeader
              heading={"Department & service areas by applicant types"}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/department/department"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"Departments"}
              onAddClick={() => setIsDialogOpen(true)}
              onCloseLevel2={() => setIsDialogOpen(false)}
            />
          </div>
          <div
            className={`${
              isExpanded ? style.bigCardGrid : style.smallCardGrid
            }`}
          >
            <ApplicantSideBar
              applicantType={applicantTypeList?.map(
                (data) => data?.applicantType
              )}
              siteType={applicantTypeList?.map((data) => data?.siteType)}
              selectedTile={getSelectedTile}
              onSelectSite={handleSiteClick}
              tileType={"Departments"}
              sideBarList={applicantTypeList}
              siteDropdown={true}
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
                  All DEPARTMENT FORM
                </Typography>
              </div>
              {tableData && (
                <ApplicantTable
                  applicantTypes={departmentForms}
                  applicantNotice={
                    "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
                  }
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"Departments"}
                  groupFirstTwoColumn={true}
                  documents={departmentForms}
                  onEditClick={(data) => {
                    console.log(data);
                    setIsEdit(true);
                    setIsDialogOpen(true);
                    setEditData(data);
                  }}
                />
              )}
              <ReferenceListActionButton
                button1={"Save In-Progress"}
                button2={" Mark as Done"}
              />
            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <DepartmentDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedApplicant={editData}
          isEdit={isEdit}
        />
      )}
    </Fragment>
  );
};

export default Departments;
