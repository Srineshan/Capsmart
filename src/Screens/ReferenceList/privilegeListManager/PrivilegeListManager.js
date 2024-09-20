import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./index.module.scss";
import { GET, POST, TenantID } from "../../dataSaver";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ReferenceListCommonTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import { Typography } from "@material-ui/core";
import ActivePrivilegesList from "./ActivePrivilegesList";
import PrivilegeListDialog from "./PrivilegesListDialog";

export const PrivilegeListManager = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [selectedApplicantType, setSelectedApplicantType] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [applicantId, setApplicantId] = useState("");
  const [staffPrivilegesForm, setStaffPrivilegesForm] = useState([]);
  const [editData, setEditData] = useState();
  const [isRefetch, setIsRefetch] = useState(false);

  const tableDataKeys = ["applicantType", "lastModifiedDate"];
  const [selectedTab, setSelectedTab] = useState("permanentStaff");
  const [isLoading, setIsLoading] = useState(false);

  const getSelectedTab = (value) => {
    setSelectedTab(value);
  };

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
    if (id) {
      const { data: staffPrivilegesForm } = await GET(
        `entity-service/privilegeMaster?applicantTypeId=${id}`
      );
      setIsRefetch(false);
      setStaffPrivilegesForm(staffPrivilegesForm);
    }
  };

  const getSelectedTile = (applicantId) => {
    if (applicantId && applicantId != "") {
      setApplicantId(applicantId);
      getStaffPrivileges(applicantId);
    }
  };

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/sites");
    setApplicantTypeList(types);
  };

  const handleSiteClick = (siteName) => {
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
          {/* <div>
            <LevelTwoHeader
              heading={"Staff Privileges List Manager"}
              updatedTime={UPDATED ON ${lastUpdatedDate}}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"StaffPrivileges"}
              onAddClick={() => setIsDialogOpen(true)}
              onCloseLevel2={() => setIsDialogOpen(false)}
            />
          </div> */}
          <div className={style.bigCardGrid}>
            <ApplicantSideBar
              applicantType={applicantTypeList?.map(
                (data) => data?.siteName?.siteName
              )}
              siteType={applicantTypeList?.map((data) => data?.siteType)}
              selectedTile={getSelectedTile}
              onSelectSite={handleSiteClick}
              tileType={"StaffPrivileges"}
              sideBarList={applicantTypeList}
              siteDropdown={true}
            />
            <div className={style.applicantList}>
              <ActivePrivilegesList
                isLoading={isLoading}
                getSelectedTab={getSelectedTab}
                selectedTab={selectedTab}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
