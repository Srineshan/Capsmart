import React, { Fragment, useState, useEffect, useCallback } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, PUT } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster } from "../../../utils/toaster";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import ApplicantTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { ReferenceListActionButton } from "../common/ReferenceListActionButton";
import Typography from "@mui/material/Typography";
import CheckListDialog from "./CheckListDialog";

const ApplicantProcessingCheckList = () => {
  const [isEdit, setIsEdit]                                   = useState(false);
  const [entityId, setEntityId]                               = useState("");
  const [lastUpdatedDate, setLastUpdatedDate]                 = useState("");
  const [applicantTypeList, setApplicantTypeList]             = useState([]);
  const [siteList, setSiteList]                               = useState([]);
  const [selectedSiteName, setSelectedSiteName]               = useState("");
  const [applicantId, setApplicantId]                         = useState("");
  const [applicantTypeEntityForm, setApplicantTypeEntityForm] = useState([]);
  const [editData, setEditData]                               = useState(null);
  const [isDialogOpen, setIsDialogOpen]                       = useState(false);
  const [isDone, setIsDone]                                   = useState(false);
  // refreshKey forces a re-render and re-fetch after save
  const [refreshKey, setRefreshKey]                           = useState(0);

  const tableHeadKeys = ["ACTION REQUIRED", "TASK/ACTIVTY TITLE", "LAST UPDATED"];
  const tableDataKeys = ["taskAction", "taskName", "lastModifiedDate"];

  // ── Boot ─────────────────────────────────────────────────
  useEffect(() => {
    getEntity();
    getSites();
    getApplicantTypes();
  }, []);

  // Fetch checklists whenever refreshKey changes (triggered after save)
  useEffect(() => {
    getChecklistForms();
  }, [refreshKey]);

  useEffect(() => {
    if (entityId) getLastModifiedDate(entityId);
  }, [entityId]);

  useEffect(() => {
    if (applicantTypeList.length > 0 && !applicantId) {
      setApplicantId(applicantTypeList[0]?.id || "");
    }
  }, [applicantTypeList]);

  useEffect(() => {
    if (siteList.length > 0 && !selectedSiteName) {
      setSelectedSiteName(getSiteDisplayName(siteList[0]));
    }
  }, [siteList]);

  // ── Safe string helpers ───────────────────────────────────
  const getSiteDisplayName = (site) => {
    const raw =
      site?.siteName?.siteName ||
      site?.siteName?.name     ||
      site?.siteName           ||
      site?.name               || "";
    return typeof raw === "string" ? raw : String(raw);
  };

  const getSiteTypeName = (site) => {
    const raw =
      site?.siteType?.siteTypeName ||
      site?.siteType?.name         ||
      site?.siteType               ||
      site?.siteTypeName           || "";
    return typeof raw === "string" ? raw : "";
  };

  const normalizeRow = (row) => ({
    ...row,
    taskName:         row?.taskName         || row?.name   || "",
    taskAction:       row?.taskAction       || row?.action || "",
    lastModifiedDate: row?.lastModifiedDate || row?.lastModified || row?.updatedAt || null,
  });

  // ── API calls ─────────────────────────────────────────────
  const getEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]) setEntityId(data[0].id);
    } catch (e) { console.error("entity:", e); }
  };

  const getSites = async () => {
    try {
      const { data } = await GET("entity-service/sites");
      setSiteList(data || []);
    } catch (e) { console.error("sites:", e); }
  };

  const getApplicantTypes = async () => {
    try {
      const { data } = await GET("entity-service/applicantType");
      setApplicantTypeList(data || []);
    } catch (e) { console.error("applicantType:", e); }
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      const ts = data?.checkList?.lastModified || data?.departments?.lastModified;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) { console.error("lastModified:", e); }
  };

  // ── Core fetch — tries multiple endpoints until data is found ──
  const getChecklistForms = useCallback(async () => {
    console.log("[CheckList] fetching checklists...");

    // Strategy: try endpoints in order until one returns data
    const endpoints = [
      "entity-service/checklist",
      `entity-service/checklist?applicantTypeId=${applicantId}`,
    ];

    for (const url of endpoints) {
      if (!url.includes("undefined") && !url.includes("null") && !url.endsWith("=")) {
        try {
          const { data } = await GET(url);
          console.log(`[CheckList] ${url} → ${data?.length} records`, data);
          if (data && data.length > 0) {
            setApplicantTypeEntityForm(data.map(normalizeRow));
            return; // Stop once we have data
          }
        } catch (e) {
          console.warn(`[CheckList] ${url} failed:`, e);
        }
      }
    }

    // If all endpoints returned empty, still update state to show empty
    console.log("[CheckList] all endpoints returned empty or failed");
    setApplicantTypeEntityForm([]);
  }, [applicantId]);

  // ── Sidebar handlers ──────────────────────────────────────
  const handleTileSelect = (_siteId) => {
    setIsDone(false);
    setRefreshKey((k) => k + 1);
  };

  const handleSiteClick = (siteName) => {
    setSelectedSiteName(typeof siteName === "string" ? siteName : String(siteName || ""));
    setRefreshKey((k) => k + 1);
  };

  // ── Dialog handlers ───────────────────────────────────────
  const onAddClick = () => {
    setIsEdit(false);
    setEditData(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (data) => {
    setIsEdit(true);
    setEditData(data);
    setIsDialogOpen(true);
  };

  // Called by CheckListDialog with needRefetch=true after successful save
  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) {
      // Small delay to allow the API to commit the new record before re-fetching
      setTimeout(() => {
        setRefreshKey((k) => k + 1);
      }, 500);
    }
  };

  // ── Footer buttons ────────────────────────────────────────
  const handleSaveInProgress = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({ checkList: { status: "IN_PROGRESS", lastModified: new Date().toISOString() } })
      );
    } catch (e) { console.warn("saveInProgress:", e); }
    finally {
      SuccessToaster("Saved as in progress.");
      setRefreshKey((k) => k + 1);
      setIsDone(true);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({ checkList: { status: "DONE", lastModified: new Date().toISOString() } })
      );
    } catch (e) { console.warn("markAsDone:", e); }
    finally {
      setIsDone(true);
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── Derived ───────────────────────────────────────────────
  const hasRows = applicantTypeEntityForm.length > 0;

  const enrichedSideBarList = siteList.map((s) => ({
    ...s,
    count: applicantTypeEntityForm.length,
  }));

  // ── Render ────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          <LevelTwoHeader
            heading={"Application Processing Checklist by Applicant"}
            updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
            path={"/Screens/ReferenceList/customerAdminDashboard"}
            callingFrom={"Customer Admin"}
            needHeader={false}
            tileType={"CheckList"}
            onAddClick={onAddClick}
            onCloseLevel2={() => setIsDialogOpen(false)}
          />

          <div className={style.bigCardGrid}>

            <ApplicantSideBar
              applicantType={siteList.map(getSiteDisplayName)}
              siteType={siteList.map(getSiteTypeName)}
              selectedTile={handleTileSelect}
              onSelectSite={handleSiteClick}
              tileType={"CheckList"}
              sideBarList={enrichedSideBarList}
              siteDropdown={false}
            />

            <div className={style.applicantList}>

              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {selectedSiteName || "All Applicant Type"}
                </Typography>
                <Typography className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Application Processing Checklist
                </Typography>
              </div>

              {hasRows ? (
                <ApplicantTable
                  applicantTypes={applicantTypeEntityForm}
                  applicantNotice="Checklist items are ordered as they will appear."
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"CheckList"}
                  groupFirstTwoColumn={true}
                  onEditClick={handleOpenEditDialog}
                  applicantId={applicantId}
                  refetchStaffPrivileges={() => setRefreshKey((k) => k + 1)}
                />
              ) : (
                <div className={style.emptyStateContainer}>
                  <div className={style.emptyStateIcon}>▲</div>
                  <p className={style.emptyStateText}>
                    Application Processing Checklist needs to be created and
                    setup in order to be made available as a default list for
                    accounts that are created.
                  </p>
                </div>
              )}

              <ReferenceListActionButton
                button1={"Save In-Progress"}
                button2={"Mark as Done"}
                onButton1Click={handleSaveInProgress}
                onButton2Click={handleMarkAsDone}
                button2Active={isDone || hasRows}
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