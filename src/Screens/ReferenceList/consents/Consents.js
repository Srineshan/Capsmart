import React, { Fragment, useState, useEffect, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, PUT } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster } from "../../../utils/toaster";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import ApplicantTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import Typography from "@mui/material/Typography";
import ConsentsDialog from "./consentsDialog";

const Consents = () => {
  const [entityId, setEntityId]                   = useState("");
  const [lastUpdatedDate, setLastUpdatedDate]     = useState("");
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [siteList, setSiteList]                   = useState([]);
  const [selectedSiteName, setSelectedSiteName]   = useState("");
  const [consentForms, setConsentForms]           = useState([]);
  const [isDialogOpen, setIsDialogOpen]           = useState(false);
  const [isEdit, setIsEdit]                       = useState(false);
  const [editData, setEditData]                   = useState(null);
  const [isDone, setIsDone]                       = useState(false);
  const [applicantId, setApplicantId]             = useState("");

  // Ref to the LevelTwoHeader wrapper — used to intercept the Add New click
  const headerRef = useRef(null);

  const tableHeadKeys = ["CONSENT FORM", "ALERT NOTE", "SIGNATURE", "LAST UPDATED"];
  const tableDataKeys = ["title", "alertNote", "esignatureRequired", "lastModifiedData"];

  // ── Boot ─────────────────────────────────────────────────
  useEffect(() => {
    getEntity();
    getSites();
    getApplicantTypes();
    getConsentForms();
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

  // ── Intercept LevelTwoHeader's internal "+ Add New" click ─
  // LevelTwoHeader renders its own dialog for Consent tileType.
  // We capture the click on the "+ Add New" button before it reaches
  // LevelTwoHeader's handler, stop propagation, and open our ConsentsDialog.
  useEffect(() => {
    const wrapper = headerRef.current;
    if (!wrapper) return;

    const interceptAddNew = (e) => {
      // Find if the clicked element is the "+ Add New" button
      const btn = e.target.closest("button, [role='button'], a");
      if (!btn) return;
      const text = btn.textContent?.trim().toLowerCase() || "";
      const isAddNew =
        text.includes("add new") ||
        text.includes("add") ||
        btn.classList.toString().toLowerCase().includes("add");
      if (isAddNew) {
        e.stopPropagation();
        e.preventDefault();
        openAddDialog();
      }
    };

    // Use capture phase so we intercept before LevelTwoHeader's handler
    wrapper.addEventListener("click", interceptAddNew, true);
    return () => wrapper.removeEventListener("click", interceptAddNew, true);
  }, []);

  // ── Display helpers ───────────────────────────────────────
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

  const normalizeRow = (row) => {
    const alertNote = (() => {
      const val = row?.alertNote;
      if (!val) return "";
      if (typeof val === "string") return val;
      if (typeof val === "object") return val?.note || val?.text || val?.value || "";
      return String(val);
    })();

    return {
      ...row,
      title:              row?.title || row?.name || "",
      alertNote,
      esignatureRequired: row?.esignatureRequired ?? row?.signatureRequired ?? false,
      lastModifiedData:
        row?.lastModifiedDate ||
        row?.lastModified     ||
        row?.updatedAt        ||
        row?.modifiedDate     ||
        row?.createdDate      || null,
    };
  };

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
      const ts = data?.consentForms?.lastModified || data?.departments?.lastModified;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) { console.error("lastModified:", e); }
  };

  const getConsentForms = async () => {
    try {
      const { data } = await GET("entity-service/consentForm");
      setConsentForms((data || []).map(normalizeRow));
    } catch (e) { console.error("consentForm:", e); }
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
    if (needRefetch) getConsentForms();
  };

  // Passed to LevelTwoHeader — it calls this but we also intercept via DOM
  const handleOpenDialog = () => openAddDialog();
  const handleCloseLevel2 = () => handleCloseDialog(false);

  // ── Sidebar handlers ──────────────────────────────────────
  const handleTileSelect = (_siteId) => {
    setIsDone(false);
    getConsentForms();
  };

  const handleSiteClick = (siteName) => {
    setSelectedSiteName(typeof siteName === "string" ? siteName : String(siteName || ""));
    getConsentForms();
  };

  // ── Footer buttons ────────────────────────────────────────
  const handleSaveInProgress = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          consentForms: { status: "IN_PROGRESS", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("saveInProgress:", e); }
    finally {
      SuccessToaster("Saved as in progress.");
      getConsentForms();
      setIsDone(true);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          consentForms: { status: "DONE", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("markAsDone:", e); }
    finally {
      setIsDone(true);
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── Derived ───────────────────────────────────────────────
  const hasRows = consentForms.length > 0;

  const enrichedSideBarList = siteList.map((s) => ({
    ...s,
    count: consentForms.length,
  }));

  // ── Render ────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          {/*
            Wrapper div with ref — captures click events in capture phase.
            Any click on "+ Add New" is intercepted here BEFORE LevelTwoHeader
            handles it, so our ConsentsDialog opens instead of the internal one.
          */}
          <div ref={headerRef}>
            <LevelTwoHeader
              heading={"Consent Forms by Industries"}
              updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
              path={"/Screens/ReferenceList/customerAdminDashboard"}
              callingFrom={"Customer Admin"}
              needHeader={false}
              tileType={"Consent"}
              handleOpenDialog={handleOpenDialog}
              onAddClick={handleOpenDialog}
              onCloseLevel2={handleCloseLevel2}
              handleClose={handleCloseLevel2}
            />
          </div>

          <div className={style.bigCardGrid}>

            <ApplicantSideBar
              applicantType={siteList.map(getSiteDisplayName)}
              siteType={siteList.map(getSiteTypeName)}
              selectedTile={handleTileSelect}
              onSelectSite={handleSiteClick}
              tileType={"Consent"}
              sideBarList={enrichedSideBarList}
              siteDropdown={false}
            />

            <div className={style.applicantList}>

              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {selectedSiteName || "All Sites"}
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}
                >
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Consent Forms
                </Typography>
              </div>

              {hasRows ? (
                <ApplicantTable
                  applicantTypes={consentForms}
                  applicantNotice="Consent forms are ordered as they will appear. To change the order, click and drag."
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  tileType={"Consent"}
                  groupFirstTwoColumn={true}
                  onEditClick={handleOpenEditDialog}
                  applicantId={applicantId}
                  refetchStaffPrivileges={getConsentForms}
                />
              ) : (
                <div className={style.emptyStateContainer}>
                  <div className={style.emptyStateIcon}>▲</div>
                  <p className={style.emptyStateText}>
                    Consent forms need to be created and setup in order to be
                    made available as a default list for accounts that are created.
                  </p>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                <button
                  onClick={handleMarkAsDone}
                  disabled={!(isDone || hasRows)}
                  style={{
                    backgroundColor: "#06617A",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: (isDone || hasRows) ? "pointer" : "not-allowed",
                    opacity: (isDone || hasRows) ? 1 : 0.6,
                    letterSpacing: "0.5px",
                  }}
                >
                  MARK AS DONE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our ConsentsDialog — the single source of truth for add/edit */}
      {isDialogOpen && (
        <ConsentsDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          selectedConsent={editData}
          isEdit={isEdit}
          applicantTypeList={applicantTypeList}
        />
      )}
    </Fragment>
  );
};

export default Consents;