import React, { Fragment, useState, useEffect, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, PUT, DELETE } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster } from "../../../utils/toaster";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import ReferenceListCommonTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import Typography from "@mui/material/Typography";
import AcknowledgmentDialog from "./AcknowledgmentDialog";

const Acknowledge = () => {
  const [entityId, setEntityId]                         = useState("");
  const [lastUpdatedDate, setLastUpdatedDate]           = useState("");
  const [applicantTypeList, setApplicantTypeList]       = useState([]);
  const [siteList, setSiteList]                         = useState([]);
  const [selectedSiteName, setSelectedSiteName]         = useState("");
  const [acknowledgementForms, setAcknowledgementForms] = useState([]);
  const [isDialogOpen, setIsDialogOpen]                 = useState(false);
  const [isEdit, setIsEdit]                             = useState(false);
  const [editData, setEditData]                         = useState(null);
  const [isDone, setIsDone]                             = useState(false);
  const [applicantId, setApplicantId]                   = useState("");

  // Ref wrapping LevelTwoHeader — intercepts its internal "+ Add New" click
  const headerRef = useRef(null);

  const tableHeadKeys = ["ACKNOWLEDGEMENT TITLE", "DISCLAIMER", "SIGNATURE", "LAST UPDATED"];
  const tableDataKeys = ["title", "disclaimer", "esignatureRequiredOnEachPage", "lastModifiedDate"];

  // ── Boot ─────────────────────────────────────────────────
  useEffect(() => {
    getEntity();
    getSites();
    getApplicantTypes();
    getAcknowledgement();
  }, []);

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

  // ── Intercept LevelTwoHeader's "+ Add New" in capture phase ─
  // LevelTwoHeader renders its own internal dialog for tileType="Acknowedgement".
  // Capturing the click before it reaches LevelTwoHeader's handler lets us
  // open our AcknowledgmentDialog instead.
  useEffect(() => {
    const wrapper = headerRef.current;
    if (!wrapper) return;

    const intercept = (e) => {
      const btn = e.target.closest("button, [role='button'], a");
      if (!btn) return;
      const text = btn.textContent?.trim().toLowerCase() || "";
      if (text.includes("add new") || text.includes("add")) {
        e.stopPropagation();
        e.preventDefault();
        openAddDialog();
      }
    };

    wrapper.addEventListener("click", intercept, true); // capture phase
    return () => wrapper.removeEventListener("click", intercept, true);
  }, []);

  // ── Display helpers ───────────────────────────────────────
  const getSiteDisplayName = (site) => {
    const raw = site?.siteName?.siteName || site?.siteName?.name || site?.siteName || site?.name || "";
    return typeof raw === "string" ? raw : String(raw);
  };

  const getSiteTypeName = (site) => {
    const raw = site?.siteType?.siteTypeName || site?.siteType?.name || site?.siteType || site?.siteTypeName || "";
    return typeof raw === "string" ? raw : "";
  };

  const normalizeRow = (row) => ({
    ...row,
    title:                        row?.title || row?.name || "",
    disclaimer:                   row?.disclaimer,
    esignatureRequiredOnEachPage: row?.esignatureRequiredOnEachPage ?? row?.signatureRequired ?? false,
    lastModifiedDate:
      row?.lastModifiedDate || row?.lastModified ||
      row?.updatedAt        || row?.modifiedDate || null,
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
      const ts = data?.acknowledgementForms?.lastModified || data?.departments?.lastModified;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) { console.error("lastModified:", e); }
  };

  const getAcknowledgement = async () => {
    try {
      const { data } = await GET("entity-service/acknowledgementForm");
      setAcknowledgementForms((data || []).map(normalizeRow));
    } catch (e) { console.error("acknowledgementForm:", e); }
  };

  // ── Dialog handlers ───────────────────────────────────────
  const openAddDialog = () => {
    setEditData(null);
    setIsEdit(false);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (data) => {
    setEditData(data);
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) getAcknowledgement();
  };

  // DELETE /acknowledgementForm/{id}
  const handleDeleteAcknowledgement = async (row) => {
    if (!row?.id) return;
    try {
      await DELETE(`entity-service/acknowledgementForm/${row.id}`);
      SuccessToaster("Acknowledgement Form deleted successfully.");
      getAcknowledgement();
    } catch (e) {
      console.error("delete acknowledgementForm:", e);
    }
  };

  // ── Sidebar handlers ──────────────────────────────────────
  const handleTileSelect = () => {
    setIsDone(false);
    getAcknowledgement();
  };

  const handleSiteClick = (siteName) => {
    setSelectedSiteName(typeof siteName === "string" ? siteName : String(siteName || ""));
    getAcknowledgement();
  };

  // ── Footer buttons ────────────────────────────────────────
  const handleSaveInProgress = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({ acknowledgementForms: { status: "IN_PROGRESS", lastModified: new Date().toISOString() } })
      );
    } catch (e) { console.warn("saveInProgress:", e); }
    finally {
      SuccessToaster("Saved as in progress.");
      getAcknowledgement();
      setIsDone(true);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({ acknowledgementForms: { status: "DONE", lastModified: new Date().toISOString() } })
      );
    } catch (e) { console.warn("markAsDone:", e); }
    finally {
      setIsDone(true);
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── Derived ───────────────────────────────────────────────
  const hasRows = acknowledgementForms.length > 0;

  const enrichedSideBarList = siteList.map((s) => ({
    ...s,
    count: acknowledgementForms.length,
  }));

  // ── Render ────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          {/* Wrapper intercepts "+ Add New" click before LevelTwoHeader handles it */}
          <div ref={headerRef}>
            <LevelTwoHeader
              heading={"Acknowledgement Forms by Industries"}
              updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
              path={"/referencelist"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"Acknowedgement"}
              handleOpenDialog={openAddDialog}
              onAddClick={openAddDialog}
              onCloseLevel2={() => { window.location.href = "/referencelist"; }}
              handleClose={() => { window.location.href = "/referencelist"; }}
            />
          </div>

          <div className={style.bigCardGrid}>

            <ApplicantSideBar
              applicantType={siteList.map(getSiteDisplayName)}
              siteType={siteList.map(getSiteTypeName)}
              selectedTile={handleTileSelect}
              onSelectSite={handleSiteClick}
              tileType={"Acknowedgement"}
              sideBarList={enrichedSideBarList}
              siteDropdown={false}
            />

            <div className={style.applicantList}>

              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {selectedSiteName || "All Sites"}
                </Typography>
                <Typography className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Acknowledgement Forms
                </Typography>
              </div>

              {hasRows ? (
                <ReferenceListCommonTable
                  applicantTypes={acknowledgementForms}
                  applicantNotice="Acknowledgement forms are ordered as they will appear."
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"Acknowedgement"}
                  groupFirstTwoColumn={true}
                  onEditClick={handleOpenEditDialog}
                  onDeleteClick={handleDeleteAcknowledgement}
                  applicantId={applicantId}
                  refetchStaffPrivileges={getAcknowledgement}
                />
              ) : (
                <div className={style.emptyStateContainer}>
                  <div className={style.emptyStateIcon}>▲</div>
                  <p className={style.emptyStateText}>
                    Acknowledgement forms need to be created and setup in order to be
                    made available as a default list for accounts that are created.
                  </p>
                </div>
              )}


            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <AcknowledgmentDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedAcknowledgement={editData}
          isEdit={isEdit}
          applicantTypeList={applicantTypeList}
        />
      )}
    </Fragment>
  );
};

export default Acknowledge;