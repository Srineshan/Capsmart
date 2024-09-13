import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { GET, DELETE, POST, TenantID } from "../../dataSaver";
import AddNewDepartments from "../addNewDepartments";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import { format } from "date-fns";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ApplicantTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import Typography from "@mui/material/Typography";
import ProofOfDocumentDialog from "./proofOfDocumentDialog";

const ProofOfDocumentByIndustries = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);

  const [entityDetails, setEntityDetails] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [siteTypeId, setSiteTypeId] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [entityTypes, setEntityTypes] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [departmentServiceMaster, setDepartmentServiceMaster] = useState([]);
  const [selectedDepartmentServiceArea, setSelectedDepartmentServiceArea] =
    useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [selectAllList, setSelectAllList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefetch, setIsRefetch] = useState(false);
  const [applicantId, setApplicantId] = useState("");
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [editData, setEditData] = useState();

  const tableHeadKeys = ["NAME", "", "TYPE", "REQUIRMENT", "LAST UPDATED"];
  const tableDataKeys = [
    "documentName",
    "",
    "documentType",
    "requirementLevel",
    "lastModifiedDate",
  ];

  useEffect(() => {
    getApplicantType();
    getEntity();
  }, []);

  useEffect(() => {
    if (applicantTypeList && applicantTypeList.length > 0) {
      setSelectedApplicantType(applicantTypeList[0]?.applicantType || "");
      setApplicantId(applicantTypeList[0]?.id);
    }
  }, [applicantTypeList]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  useEffect(() => {
    console.log(applicantId);

    if (applicantId && applicantId != "")
      getDepartmentServiceMaster(applicantId);
  }, [applicantId]);

  useEffect(() => {
    if (isRefetch) {
      getDepartmentServiceMaster(applicantId);
    }
  }, [isRefetch]);

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

  const getDepartmentServiceMaster = async (id) => {
    if (id) {
      console.log("idididdi", id);
      const { data: departmentServiceMaster } = await GET(
        `entity-service/document?siteTypeId=${siteTypeId}`
      );
      setIsRefetch(false);
      setDepartmentServiceMaster(departmentServiceMaster);
    }
  };
  const getSelectedTile = (applicantId) => {
    if (applicantId && applicantId != "") {
      setApplicantId(applicantId);
      getDepartmentServiceMaster(applicantId);
    }
  };

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };

  const handleSiteClick = (siteName) => {
    console.log("siteName", siteName);
    setSelectedApplicantType(siteName);
  };

  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsRefetch(needRefetch);
  };

  return (
    <Fragment>
      <Navbar />
      <div className={` ${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <div>
            <LevelTwoHeader
              heading={"Proof of Documentation By Industries"}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"ProofOfDocument"}
              onAddClick={() => setIsDialogOpen(true)}
              onCloseLevel2={() => setIsDialogOpen(false)}
            />
          </div>
          <div className={style.bigCardGrid}>
            <ApplicantSideBar
              applicantType={applicantTypeList?.map(
                (data) => data?.applicantType
              )}
              siteType={applicantTypeList?.map((data) => data?.siteType)}
              selectedTile={getSelectedTile}
              onSelectSite={handleSiteClick}
              tileType={"ProofOfDocument"}
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
                  All Documents
                </Typography>
              </div>
              <ApplicantTable
                applicantTypes={departmentServiceMaster}
                applicantNotice={
                  "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
                }
                tableDataKeys={tableDataKeys}
                tableHeadKeys={tableHeadKeys}
                groupFirstTwoColumn={true}
                tileType={"ProofOfDocument"}
                onEditClick={(data) => {
                  console.log(data);
                  setIsEdit(true);
                  setIsDialogOpen(true);
                  setEditData(data);
                }}
              />

              <ReferenceListActionButton
                button1={"Save In-Progress"}
                button2={" Mark as Done"}
              />
            </div>
          </div>
        </div>
      </div>
      {isDialogOpen && (
        <ProofOfDocumentDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedApplicant={editData}
          isEdit={isEdit}
        />
      )}
    </Fragment>
  );
};

export default ProofOfDocumentByIndustries;
