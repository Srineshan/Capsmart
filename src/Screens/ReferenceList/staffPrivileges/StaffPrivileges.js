import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, POST, TenantID } from "../../dataSaver";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ReferenceListCommonTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import { Typography } from "@material-ui/core";
import StaffPrivilegeDialog from "./staffPrivilegeDialog";

const StaffPrivileges = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [applicantId, setApplicantId] = useState("");
  const [staffPrivilegesForm, setStaffPrivilegesForm] = useState([]);
  const [editData, setEditData] = useState();

  const tableHeadKeys = ["CATEGORY", "LAST UPDATED"];
  const tableDataKeys = ["applicantType", "lastModifiedDate"];

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
    getStaffPrivileges(applicantId);
  }, [applicantId]);

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
      const { data: staffPrivilegesForm } = await GET(
        `entity-service/staffPrivilege?applicantTypeId=${id}`
      );
      setStaffPrivilegesForm(staffPrivilegesForm);
    }
  };

  const getSelectedTile = (applicantId) => {
    setApplicantId(applicantId);
    getStaffPrivileges(applicantId);
  };

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };

  const handleSiteClick = (siteName) => {
    setSelectedApplicantType(siteName);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

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
              tileType={"StaffPrivileges"}
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
                  All StaffPrivileges Form
                </Typography>
              </div>
              {staffPrivilegesForm && (
                <ReferenceListCommonTable
                  applicantTypes={staffPrivilegesForm}
                  applicantNotice={
                    "Applicant types are ordered as they will appear on forms. To change the order, click and drag "
                  }
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"StaffPrivileges"}
                  groupFirstTwoColumn={true}
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
        <StaffPrivilegeDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedApplicant={editData}
          isEdit={isEdit}
        />
      )}
    </Fragment>
  );
};

export default StaffPrivileges;
