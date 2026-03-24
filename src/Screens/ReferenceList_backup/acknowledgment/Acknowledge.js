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
import ReferenceListCommonTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

const Acknowledge = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [applicantTypeList, setApplicantTypeList] = useState([]);

  const [entityDetails, setEntityDetails] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [siteTypeId, setSiteTypeId] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [entityTypes, setEntityTypes] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [departmentServiceMaster, setDepartmentServiceMaster] = useState([]);
  const [departmentService, setDepartmentService] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDepartmentServiceArea, setSelectedDepartmentServiceArea] =
    useState([]);
  const [selectedDepartmentService, setSelectedDepartmentService] = useState(
    {}
  );
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [selectAllList, setSelectAllList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [acknowledgementForms, setAcknowledgementForms] = useState([]);

  const sites = ["SITE NAME", "SITE NAME"];

  const applicantType = [
    {
      name: "Acknowledge Title",
      type: "Yes",
      requirment: "Required",
      lastUpdated: "Aug 16, 2024",
    },
    {
      name: "Acknowledge Title",
      type: "No",
      requirment: "NA",
      lastUpdated: "Aug 16, 2024",
    },
    {
      name: "Acknowledge Title",
      type: "Yes",
      requirment: "Required",
      lastUpdated: "Aug 16, 2024",
    },
    {
      name: "Acknowledge Title",
      type: "No",
      requirment: "NA",
      lastUpdated: "Aug 16, 2024",
    },
  ];

  const tableHeadKeys = [
    "ACKNOWLEDGE TITLE",
    "DISCLAIMAR",
    "SIGNATURE",
    "LAST UPDATED",
  ];
  const tableDataKeys = [
    "title",
    "disclaimer",
    "esignatureRequiredOnEachPage",
    "lastModifiedDate",
  ];

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  useEffect(() => {
    getApplicantType();
  }, []);

  useEffect(() => {
    getAcknowledgement(applicantId);
  }, [applicantId]);

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };

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

  const getAcknowledgement = async (id) => {
    if (id !== "") {
      const { data: acknowledgementForm } = await GET(
        `entity-service/acknowledgementForm?applicantTypeId=${id}`
      );
      setAcknowledgementForms(acknowledgementForm);
    }
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

  const getAddEntityTypes = async (data) => {
    await POST(`entity-service/document/?${TenantID}`, data);
  };

  const getEntityTypes = async () => {
    console.log("TenantID", TenantID);

    const { data: entityType } = await GET(
      `entity-service/document/?${TenantID}`
    );

    setDocuments(entityType);
    const allApplicantTypes = entityType.flatMap(
      (entity) => entity.applicantTypes || []
    );

    setApplicantTypes(allApplicantTypes);

    // // console.log(entityType?.sites)
    // if (entityType?.sites?.length !== 0) {
    //   setSiteTypeId(entityType?.sites?.[0]?.siteType?.id);
    //   setSelectedEntityType(entityType?.sites?.[0]?.siteType?.type);
    //   setEntityTypes(entityType?.sites);
    // }
    console.log(applicantTypes);
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
    if (applicantTypeList.length > 0) {
      setSelectedApplicantType(
        applicantTypeList?.filter((data) => data?.id === applicantId)[0]
          ?.applicantType
      );
    }
  }, [applicantTypeList, applicantId]);

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

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const getSelectedTile = (data) => {
    setApplicantId(data);
    getAcknowledgement(data);
  };

  return (
    <Fragment>
      <Navbar />
      <div className={` ${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <div>
            <LevelTwoHeader
              getAddEntityDialog={getAddEntityDialog}
              heading={"Acknowledgement Forms by Industries"}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"Acknowedgement"}
              documents={acknowledgementForms}
              getEntityTypes={getEntityTypes}
              getAddEntityTypes={getAddEntityTypes}
              handleOpenDialog={handleOpenDialog}
              handleClose={handleCloseDialog}
            />
          </div>
          <div
            className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid
              }`}
          >
            <ApplicantSideBar
              applicantType={applicantTypeList?.map(
                (data) => data?.applicantType
              )}
              siteType={applicantTypeList?.map((data) => data?.siteType)}
              siteTitle={"All Applicant Type"}
              onSelectSite={handleSiteClick}
              tileType={"Acknowedgement"}
              selectedTile={getSelectedTile}
              sideBarList={applicantTypeList}
            />
            <div className={style.applicantList}>
              <div className={`${style.Tabletitle} `}>
                <Typography className={style.tableTitleContent}>
                  {`${selectedApplicantType}`}
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}
                >
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Acknowledgement Forms
                </Typography>
              </div>
              <ReferenceListCommonTable
                applicantTypes={acknowledgementForms}
                applicantNotice={
                  "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
                }
                tableDataKeys={tableDataKeys}
                tableHeadKeys={tableHeadKeys}
                groupFirstTwoColumn={true}
                tileType={"Acknowedgement"}
                documents={acknowledgementForms}
                getAddEntityTypes={getAddEntityTypes}
                handleClose={handleCloseDialog}
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
          <p className={style.poweredBy}>Powered by - HapiCare</p>
          <p className={style.poweredBy}>© HapiCare</p>
        </div>
      </div>
    </Fragment>
  );
};

export default Acknowledge;
