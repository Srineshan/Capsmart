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
import CheckListDialog from "./CheckListDialog";

const ApplicantProcessingCheckList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [applicantId, setApplicantId] = useState("");
  const [applicantTypeEntityForm, setApplicantTypeEntityForm] = useState([]);
  const [editData, setEditData] = useState();
  const [isRefetch, setIsRefetch] = useState(false);

  const tableHeadKeys = [
    "ACTION REQUIRED",
    "TASK/ACTIVTY TITLE",
    "LAST UPDATED",
  ];
  const tableDataKeys = ["taskAction", "taskName", "lastModifiedDate"];

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

    if (applicantId && applicantId != "") getStaffPrivileges(applicantId);
  }, [applicantId]);

  useEffect(() => {
    if (isRefetch) {
      getStaffPrivileges(applicantId);
    }
  }, [isRefetch]);

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
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

  const getStaffPrivileges = async (id) => {
    if (id !== "") {
      const { data: applicantTypeForm } = await GET(
        `entity-service/checklist?applicantTypeId=${id}`
      );
      setIsRefetch(false);
      console.log("applicantTypeForm", applicantTypeForm);
      setApplicantTypeEntityForm(applicantTypeForm);
    }
  };

  const getSelectedTile = (applicantId) => {
    if (applicantId && applicantId != "") {
      setApplicantId(applicantId);
      getStaffPrivileges(applicantId);
    }
  };

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };

  const handleSiteClick = (siteName) => {
    setSelectedApplicantType(siteName);
  };

  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsRefetch(needRefetch);
  };

  const onAddClick = () => {
    setIsEdit(false); // Set to false for adding a new entry
    setEditData(null); // Reset editData for new entry
    setIsDialogOpen(true);
  };

  return (
    <Fragment>
      <Navbar />
      <div className={` ${style.applicantTypeBackground}`}>
        <div className={style.padding20}>
          <div>
            <LevelTwoHeader
              heading={"Application Processing Checklist by applicant"}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"CheckList"}
              onAddClick={onAddClick} // Use the updated function here
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
              tileType={"CheckList"}
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
                  All Applicant Form
                </Typography>
              </div>
              <ApplicantTable
                applicantTypes={applicantTypeEntityForm}
                applicantNotice={
                  "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
                }
                tableDataKeys={tableDataKeys}
                tableHeadKeys={tableHeadKeys}
                tileType={"CheckList"}
                groupFirstTwoColumn={true}
                onEditClick={(data) => {
                  setIsEdit(true);
                  setIsDialogOpen(true);
                  setEditData(data);
                }}
                applicantId={applicantId}
                refetchStaffPrivileges={getStaffPrivileges} // Pass the fetch function as a prop
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
        <CheckListDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedApplicant={editData}
          isEdit={isEdit}
        />
      )}
    </Fragment>
  );
};

export default ApplicantProcessingCheckList;
