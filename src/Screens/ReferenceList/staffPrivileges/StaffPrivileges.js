import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, PUT } from "../../dataSaver";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ReferenceListCommonTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import { Typography } from "@material-ui/core";
import StaffPrivilegeDialog from "./staffPrivilegeDialog";

// ─────────────────────────────────────────────────────────────────────────────
// StaffPrivileges — Department / Service Area Specific Privileges tile
//
// Data flow:
//   1. On mount: load departmentMap + entity + sites in sequence
//   2. After sites load: auto-select first site and load its privileges
//   3. normalizeRow uses the departmentMap (stored as module-level var to avoid
//      stale closure issues with React state) to resolve department names
//
// Connection to PrivilegeListManager:
//   The dialog (staffPrivilegeDialog) loads /privilegeMaster to provide
//   type-ahead privilege selection. This tile groups those privileges into
//   sets per department/service area via /staffPrivilege.
// ─────────────────────────────────────────────────────────────────────────────

// Module-level cache — always current, never stale
// (React state is async; this is the simplest correct solution)
let _deptMap = {};

const StaffPrivileges = () => {

  const [entityId,         setEntityId]         = useState("");
  const [lastUpdatedDate,  setLastUpdatedDate]   = useState("");
  const [siteList,         setSiteList]          = useState([]);
  const [activeSiteId,     setActiveSiteId]      = useState("");
  const [activeSiteName,   setActiveSiteName]    = useState("");
  const [tableRows,        setTableRows]         = useState([]);
  const [isDialogOpen,     setIsDialogOpen]      = useState(false);
  const [isEdit,           setIsEdit]            = useState(false);
  const [editData,         setEditData]          = useState(null);
  const [isLoading,        setIsLoading]         = useState(false);

  const tableHeadKeys = [
    "DEPARTMENT", "SERVICE AREA", "PRIVILEGE SET TITLE",
    "CORE", "RESTRICTED", "NON-CORE", "LAST BOD APPROVAL",
  ];
  const tableDataKeys = [
    "departmentLabel", "serviceAreaLabel", "privilegeSetTitle",
    "coreCount", "restrictedCount", "nonCoreCount", "bodApprovalDate",
  ];

  // ── On mount: sequential boot to avoid race conditions ──────────────────────
  useEffect(() => {
    _deptMap = {}; // reset module cache on fresh mount
    (async () => {
      await Promise.all([loadDepartmentMap(), loadEntity()]);
      await loadSites();
    })();
    return () => { _deptMap = {}; }; // cleanup on unmount
  }, []);

  // ── Entity & last modified date ──────────────────────────────────────────────
  const loadEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      const id = data?.[0]?.id || "";
      if (!id) return;
      setEntityId(id);
      try {
        const r2 = await GET(`entity-service/referenceList/entity/${id}`);
        const ts = r2?.data?.staffPrivileges?.lastModified ||
                   r2?.data?.departments?.lastModified;
        const d = new Date(ts);
        if (!isNaN(d)) {
          setLastUpdatedDate(
            `${formatInTimeZone(d, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
          );
        }
      } catch (_) {}
    } catch (e) { console.error("[SP] entity:", e?.message); }
  };

  // ── Department map — stored in module var so normalizeRow always sees it ─────
  const loadDepartmentMap = async () => {
    try {
      const res = await GET("entity-service/department");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const map = {};
      (Array.isArray(raw) ? raw : []).forEach(dept => {
        if (dept?.id) {
          map[dept.id] = dept?.departmentName?.name || dept?.name || "";
        }
      });
      _deptMap = map; // synchronous write — always available immediately
      console.log("[SP] deptMap:", Object.keys(map).length, "entries");
    } catch (e) { console.warn("[SP] deptMap failed:", e?.message); }
  };

  // ── Sites ────────────────────────────────────────────────────────────────────
  const loadSites = async () => {
    try {
      const res = await GET("entity-service/sites");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];
      setSiteList(list);
      console.log("[SP] sites:", list.length);
      if (list.length > 0) {
        const first = list[0];
        const firstId = first?.id || "";
        setActiveSiteId(firstId);
        setActiveSiteName(getSiteDisplayName(first));
        await loadPrivileges(firstId);
      }
    } catch (e) { console.error("[SP] sites:", e?.message); }
  };

  // ── Privileges ───────────────────────────────────────────────────────────────
  const loadPrivileges = async (siteId) => {
    if (!siteId) return;
    setIsLoading(true);
    let list = [];

    // 1. Try site-specific endpoint
    try {
      const res = await GET(`entity-service/staffPrivilege/site/${siteId}`);
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      list = Array.isArray(raw) ? raw : [];
      console.log(`[SP] /site/${siteId} →`, list.length);
    } catch (e) {
      console.warn("[SP] site endpoint failed, trying global:", e?.message);
    }

    // 2. Fallback: global endpoint
    if (list.length === 0) {
      try {
        const res = await GET("entity-service/staffPrivilege");
        const raw = res?.data?.content || res?.data?.data || res?.data ||
          res?.content || (Array.isArray(res) ? res : []);
        list = Array.isArray(raw) ? raw : [];
        console.log("[SP] /staffPrivilege global →", list.length);
      } catch (e) {
        console.warn("[SP] global endpoint failed:", e?.message);
      }
    }

    setTableRows(list.map(normalizeRow));
    setIsLoading(false);
  };

  // ── Normalize row for display ─────────────────────────────────────────────────
  const normalizeRow = (row) => {
    // Department: API always returns departmentName: null — use _deptMap by id
    const deptId = row?.department?.id ||
      (typeof row?.department === "string" ? row.department : "");
    const deptName =
      (deptId && _deptMap[deptId]) ||
      row?.department?.departmentName?.name ||
      row?.department?.name || "";

    // Service area: [{ id, name }]
    const serviceAreaName = Array.isArray(row?.serviceArea)
      ? row.serviceArea.map(s => s?.name || "").filter(Boolean).join(", ")
      : row?.serviceArea?.name ||
        (typeof row?.serviceArea === "string" ? row.serviceArea : "");

    // Privilege counts from nested privilegeDetails
    const countP = (detail) =>
      (detail?.privilegesByCategories || []).flatMap(c => c?.privileges || []).length;
    const core       = countP(row?.privilegeDetails?.corePrivileges);
    const restricted = countP(row?.privilegeDetails?.restrictedPrivileges);
    const nonCore    = countP(row?.privilegeDetails?.nonCorePrivileges);

    // BOD date
    const bod = row?.bodApprovalDate || row?.lastBodApprovalDate;

    return {
      ...row,
      departmentLabel:   deptName || "-",
      serviceAreaLabel:  serviceAreaName || "-",
      privilegeSetTitle: row?.privilegeSetTitle || row?.title || "-",
      coreCount:         core       > 0 ? core       : "-",
      restrictedCount:   restricted > 0 ? restricted : "-",
      nonCoreCount:      nonCore    > 0 ? nonCore    : "-",
      bodApprovalDate:   bod
        ? new Date(bod).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "2-digit",
          })
        : "-",
      privilegeDetails: row?.privilegeDetails,   // preserve for edit dialog
      lastModifiedDate: row?.lastModifiedDate || row?.createdDate || null,
    };
  };

  // ── Sidebar helpers ──────────────────────────────────────────────────────────
  const getSiteDisplayName = (site) => {
    const raw = site?.siteName?.siteName || site?.siteName?.name ||
      site?.siteName || site?.name || "";
    return typeof raw === "string" ? raw : String(raw);
  };

  const getSiteTypeName = (site) => {
    const raw = site?.siteType?.siteTypeName || site?.siteType?.name ||
      site?.siteType || site?.siteTypeName || "";
    return typeof raw === "string" ? raw : "";
  };

  // Sidebar tile selected — switch site
  const handleTileSelect = async (id) => {
    if (!id || id === activeSiteId) return;
    const site = siteList.find(s => s.id === id);
    setActiveSiteId(id);
    if (site) setActiveSiteName(getSiteDisplayName(site));
    await loadPrivileges(id);
  };

  const handleSiteNameClick = (name) => {
    setActiveSiteName(typeof name === "string" ? name : String(name || ""));
  };

  // ── Dialog handlers ──────────────────────────────────────────────────────────
  // needRefetch=true  → SAVE & EXIT: close + refresh
  // needRefetch=false → SAVE & ADD MORE: refresh only, keep dialog open
  const handleCloseDialog = (needRefetch = false) => {
    if (needRefetch) {
      setIsDialogOpen(false);
      setIsEdit(false);
      setEditData(null);
    }
    // Always refresh so the new/updated record appears immediately
    loadPrivileges(activeSiteId);
  };

  const handleForceClose = () => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
  };

  // ── Footer ───────────────────────────────────────────────────────────────────
  const handleSaveInProgress = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          staffPrivileges: { status: "IN_PROGRESS", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("[SP] saveInProgress:", e); }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          staffPrivileges: { status: "DONE", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("[SP] markAsDone:", e); }
    window.location.href = "/referencelist";
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          <LevelTwoHeader
            heading="Department / Service Area Specific Privileges"
            updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
            path="/Screens/ReferenceList/customerAdminDashboard"
            callingFrom="Customer Admin"
            needHeader={false}
            tileType="StaffPrivileges"
            onAddClick={() => {
              setEditData(null);
              setIsEdit(false);
              setIsDialogOpen(true);
            }}
            onCloseLevel2={handleForceClose}
          />

          <div className={style.bigCardGrid}>

            {/* Sidebar */}
            <ApplicantSideBar
              applicantType={siteList.map(getSiteDisplayName)}
              siteType={siteList.map(getSiteTypeName)}
              selectedTile={handleTileSelect}
              onSelectSite={handleSiteNameClick}
              tileType="StaffPrivileges"
              sideBarList={siteList}
              siteDropdown={false}
            />

            {/* Main content */}
            <div className={style.applicantList}>

              {/* Breadcrumb */}
              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {activeSiteName || "All Sites"}
                </Typography>
                <Typography className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Privilege Sets
                </Typography>
              </div>

              {/* Loading state */}
              {isLoading && (
                <div style={{ padding: 20, textAlign: "center", color: "#888" }}>
                  Loading privilege sets...
                </div>
              )}

              {/* Table */}
              {!isLoading && (
                <ReferenceListCommonTable
                  applicantTypes={tableRows}
                  applicantNotice="Privilege sets are ordered as they will appear."
                  tableDataKeys={tableDataKeys}
                  tableHeadKeys={tableHeadKeys}
                  applicantId={activeSiteId}
                  tileType="StaffPrivileges"
                  groupFirstTwoColumn={true}
                  onEditClick={(data) => {
                    setEditData(data);
                    setIsEdit(true);
                    setIsDialogOpen(true);
                  }}
                  refetchStaffPrivileges={() => loadPrivileges(activeSiteId)}
                />
              )}

              {/* Footer buttons */}
              <div style={{
                display: "flex", justifyContent: "flex-end",
                gap: 12, marginTop: 20,
              }}>
                <button
                  onClick={handleSaveInProgress}
                  style={{
                    backgroundColor: "#fff", color: "#06617A",
                    border: "1px solid #06617A", borderRadius: 6,
                    padding: "10px 24px", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", letterSpacing: "0.5px",
                  }}
                >
                  SAVE IN-PROGRESS
                </button>
                <button
                  onClick={handleMarkAsDone}
                  style={{
                    backgroundColor: "#06617A", color: "#fff",
                    border: "none", borderRadius: 6,
                    padding: "10px 24px", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", letterSpacing: "0.5px",
                  }}
                >
                  MARK AS DONE
                </button>
              </div>
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
          currentSiteId={activeSiteId}
        />
      )}
    </Fragment>
  );
};

export default StaffPrivileges;