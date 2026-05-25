import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, PUT, DELETE } from "../../dataSaver";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { Typography } from "@material-ui/core";
import StaffPrivilegeDialog from "./staffPrivilegeDialog";
import EditHcFolder from "./../../../images/editHcRow.png";
import DeleteHcFolder from "./../../../images/deleteHcFolder.png";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";

const StaffPrivileges = () => {

  const [entityId,       setEntityId]       = useState("");
  const [lastUpdatedDate,setLastUpdatedDate] = useState("");
  const [siteList,       setSiteList]       = useState([]);
  const [activeSiteId,   setActiveSiteId]   = useState("");
  const [activeSiteName, setActiveSiteName] = useState("");
  const [privilegeSets,  setPrivilegeSets]  = useState([]);
  const [departmentMap,  setDepartmentMap]  = useState({});
  const [activeIndex,    setActiveIndex]    = useState(0);
  const [isLoading,      setIsLoading]      = useState(false);
  const [isDialogOpen,   setIsDialogOpen]   = useState(false);
  const [isEdit,         setIsEdit]         = useState(false);
  const [editData,       setEditData]       = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [openMenuId,     setOpenMenuId]     = useState(null);

  const COLS = [
    { head: "DEPARTMENT",          key: "departmentLabel",   width: "20%" },
    { head: "SERVICE AREA",        key: "serviceAreaLabel",  width: "14%" },
    { head: "PRIVILEGE SET TITLE", key: "privilegeSetTitle", width: "16%" },
    { head: "CORE",                key: "coreCount",         width: "7%"  },
    { head: "RESTRICTED",          key: "restrictedCount",   width: "9%"  },
    { head: "NON-CORE",            key: "nonCoreCount",      width: "8%"  },
    { head: "LAST BOD\nAPPROVAL",  key: "bodApprovalDate",   width: "11%" },
  ];

  // ── Boot ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    getEntity();
    buildDepartmentMap();
    getSites();
  }, []);

  useEffect(() => {
    if (siteList.length > 0 && !activeSiteId) {
      const first = siteList[0];
      setActiveSiteId(first?.id || "");
      setActiveSiteName(getSiteDisplayName(first));
      setActiveIndex(0);
    }
  }, [siteList]);

  useEffect(() => {
    if (activeSiteId) getPrivileges(activeSiteId);
  }, [activeSiteId, refetchTrigger]);

  useEffect(() => {
    if (entityId) getLastModifiedDate(entityId);
  }, [entityId]);

  // ── API calls ─────────────────────────────────────────────────────────────────

  const getEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]?.id) setEntityId(data[0].id);
    } catch (e) { console.error("[SP] entity:", e?.message); }
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      const ts = data?.staffPrivileges?.lastModified || data?.departments?.lastModified;
      if (!ts) return;
      const d = new Date(ts);
      if (!isNaN(d))
        setLastUpdatedDate(
          `${formatInTimeZone(d, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) { console.error("[SP] lastModified:", e?.message); }
  };

  const buildDepartmentMap = async () => {
    try {
      const res = await GET("entity-service/department");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const map = {};
      (Array.isArray(raw) ? raw : []).forEach(dept => {
        if (!dept?.id) return;
        const dn = dept?.departmentName;
        const dname =
          (typeof dn === "object" && dn !== null ? dn?.name || "" : "") ||
          (typeof dn === "string" ? dn : "") ||
          (typeof dept?.name === "string" ? dept.name : "") ||
          "";
        map[dept.id] = String(dname);
      });
      setDepartmentMap(map);
    } catch (e) { console.warn("[SP] departmentMap:", e?.message); }
  };

  const getSites = async () => {
    try {
      const res  = await GET("entity-service/sites");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      // Deduplicate sites by id
      const seen = new Set();
      const unique = (Array.isArray(raw) ? raw : []).filter(s => {
        if (!s?.id || seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });
      setSiteList(unique);
    } catch (e) { console.error("[SP] sites:", e?.message); }
  };

  // Fetches ALL pages from a paginated endpoint
  const fetchAllPages = async (baseUrl) => {
    const all = [];
    let page = 0;
    const size = 100; // fetch 100 per page
    while (true) {
      try {
        const sep = baseUrl.includes("?") ? "&" : "?";
        const res = await GET(`${baseUrl}${sep}page=${page}&size=${size}`);
        const data = res?.data;

        // Spring Boot paginated response shape: { content: [], totalPages, totalElements }
        const items = data?.content || data?.data?.content || data?.data || res?.content ||
          (Array.isArray(data) ? data : []);
        const arr = Array.isArray(items) ? items : [];

        if (arr.length === 0) break;
        all.push(...arr);

        // Check if there are more pages
        const totalPages = data?.totalPages ?? data?.data?.totalPages ?? null;
        const totalElements = data?.totalElements ?? data?.data?.totalElements ?? null;
        if (totalPages !== null && page + 1 >= totalPages) break;
        if (totalElements !== null && all.length >= totalElements) break;
        if (arr.length < size) break; // got fewer than requested — last page
        page++;
      } catch (e) {
        console.warn(`[SP] fetchAllPages page ${page}:`, e?.message);
        break;
      }
    }
    return all;
  };

  const getPrivileges = async (siteId) => {
    if (!siteId) return;
    setIsLoading(true);
    let list = [];

    // Step 1: Fetch ALL records from the global endpoint (handles pagination)
    // This ensures we get all 80+ records, not just the first page
    try {
      list = await fetchAllPages("entity-service/staffPrivilege");
      console.log("[SP] global total fetched:", list.length);
    } catch (e) { console.warn("[SP] global fetch:", e?.message); }

    // Step 2: Also fetch site-specific records and merge
    // (catches records that index correctly under the site)
    try {
      const siteList = await fetchAllPages(`entity-service/staffPrivilege/site/${siteId}`);
      console.log("[SP] site total fetched:", siteList.length);
      if (siteList.length > 0) {
        const existingIds = new Set(list.map(r => r.id));
        const newOnes = siteList.filter(r => r.id && !existingIds.has(r.id));
        list = [...list, ...newOnes];
      }
    } catch (e) { console.warn("[SP] site fetch:", e?.message); }

    console.log("[SP] total after merge:", list.length);

    // Refresh department map to resolve names for newly added records
    let freshDeptMap = { ...departmentMap };
    try {
      const dr  = await GET("entity-service/department");
      const raw = dr?.data?.content || dr?.data?.data || dr?.data ||
        dr?.content || (Array.isArray(dr) ? dr : []);
      (Array.isArray(raw) ? raw : []).forEach(d => {
        if (!d?.id) return;
        const dn2 = d?.departmentName;
        freshDeptMap[d.id] = String(
          (typeof dn2 === "object" && dn2 !== null ? dn2?.name : "") ||
          (typeof dn2 === "string" ? dn2 : "") ||
          (typeof d?.name === "string" ? d.name : "") || ""
        );
      });
    } catch (_) {}

    setPrivilegeSets(list.map(row => normalizeRow(row, freshDeptMap)));
    setIsLoading(false);
  };

  // ── Normalize ─────────────────────────────────────────────────────────────────
  const normalizeRow = (row, deptMap) => {
    const map    = deptMap || departmentMap;
    const deptId = row?.department?.id || "";

    const rawDN = row?.department?.departmentName;
    const deptName = String(
      (typeof rawDN === "object" && rawDN !== null ? rawDN?.name : "") ||
      (typeof rawDN === "string" ? rawDN : "") ||
      (typeof row?.department?.name === "string" ? row.department.name : "") ||
      (deptId && typeof map[deptId] === "string" ? map[deptId] : "") ||
      "-"
    );

    const sa = row?.serviceArea || row?.serviceAreas || [];
    const serviceAreaName = Array.isArray(sa) && sa.length > 0
      ? sa.map(s => s?.name || "").filter(Boolean).join(", ")
      : (sa?.name || (typeof sa === "string" && sa ? sa : "-"));

    const countP = (d) =>
      (d?.privilegesByCategories || []).flatMap(c => c?.privileges || []).length;
    const core       = countP(row?.privilegeDetails?.corePrivileges);
    const restricted = countP(row?.privilegeDetails?.restrictedPrivileges);
    const nonCore    = countP(row?.privilegeDetails?.nonCorePrivileges);

    const bod        = row?.bodApprovalDate || row?.lastBodApprovalDate || "";
    const bodDisplay = bod
      ? (() => {
          try {
            return new Date(bod).toLocaleDateString("en-US", {
              year: "numeric", month: "short", day: "2-digit",
            });
          } catch { return bod; }
        })()
      : "-";

    const rawTitle  = row?.privilegeSetTitle || row?.title || "";
    const isSetupOnly =
      !rawTitle && core === 0 && restricted === 0 && nonCore === 0;

    return {
      ...row,
      departmentLabel:   deptName,
      serviceAreaLabel:  serviceAreaName || "-",
      privilegeSetTitle: rawTitle || (isSetupOnly ? "Set up" : "-"),
      isSetupOnly,
      coreCount:         core       > 0 ? String(core)       : "-",
      restrictedCount:   restricted > 0 ? String(restricted) : "-",
      nonCoreCount:      nonCore    > 0 ? String(nonCore)    : "-",
      bodApprovalDate:   bodDisplay,
      lastModifiedDate:  row?.lastModifiedDate || row?.createdDate || null,
    };
  };

  // ── Helpers ───────────────────────────────────────────────────────────────────
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

  // ── Sidebar ───────────────────────────────────────────────────────────────────
  const handleSiteClick = (index) => {
    const site = siteList[index];
    if (!site || site?.id === activeSiteId) return;
    setActiveIndex(index);
    setActiveSiteId(site?.id || "");
    setActiveSiteName(getSiteDisplayName(site));
  };

  // ── Dialog ────────────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditData(null);
    setIsEdit(false);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (data) => {
    setEditData(data);
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  // FIX: "refetch-only" — keep dialog open but refresh the list in the background
  const handleCloseDialog = (needRefetch = false) => {
    if (needRefetch === "refetch-only") {
      // Save & Add More: stay open, just refetch the list
      setRefetchTrigger(n => n + 1);
      if (entityId) getLastModifiedDate(entityId);
      return;
    }
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) {
      setRefetchTrigger(n => n + 1);
      if (entityId) getLastModifiedDate(entityId);
    }
  };

  const handleDelete = async (id) => {
    if (!id) { ErrorToaster("Invalid record — cannot delete."); return; }
    try {
      await DELETE(`entity-service/staffPrivilege/${id}`);
      SuccessToaster("Deleted successfully");
      // FIX: Remove from local list immediately so UI updates without waiting for refetch
      setPrivilegeSets(prev => prev.filter(r => r.id !== id));
      // Then trigger a full refetch to sync with backend
      setRefetchTrigger(n => n + 1);
    } catch (e) {
      ErrorToaster("Delete failed — " + (e?.response?.data?.message || e?.message || "please try again"));
      console.error("[SP] delete:", e?.message);
    }
  };

  // ── Footer ────────────────────────────────────────────────────────────────────
  const handleSaveInProgress = async () => {
    try {
      await PUT(`entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          staffPrivileges: { status: "IN_PROGRESS", lastModified: new Date().toISOString() },
        })
      );
      SuccessToaster("Saved as in progress");
    } catch (e) { console.warn("[SP] saveInProgress:", e); }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(`entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          staffPrivileges: { status: "DONE", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("[SP] markAsDone:", e); }
    window.location.href = "/referencelist";
  };

  // ── Render ────────────────────────────────────────────────────────────────────
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
            onAddClick={handleOpenAdd}
            // FIX: X button navigates back to the reference list dashboard
            onCloseLevel2={() => { window.location.href = "/referencelist"; }}
          />

          <div className={style.bigCardGrid}>

            {/* Sidebar */}
            <div className={style.sideBar}>
              <p className={style.sideBarHeaderLabel}>All Sites</p>
              {siteList.map((site, index) => (
                <div key={site?.id || index}
                  className={`${style.sidebarContent} ${
                    index === activeIndex
                      ? style.sideActiveBackground
                      : style.sideNonActiveBackground
                  }`}
                  onClick={() => handleSiteClick(index)}>
                  <div className={style.siteDetails}>
                    <p className={style.siteName}>{getSiteDisplayName(site)}</p>
                    <div className={style.siteCount}>
                      {index === activeIndex ? privilegeSets.length : 0}
                    </div>
                  </div>
                  {getSiteTypeName(site) && (
                    <p className={style.siteType}>{getSiteTypeName(site)}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className={style.applicantList}>

              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {activeSiteName || "All Sites"}
                </Typography>
                <Typography
                  className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Privilege Sets
                </Typography>
              </div>

              <div className={style.applicantTableContainer}
                onClick={() => setOpenMenuId(null)}>
                {isLoading ? (
                  <div style={{ padding:40, textAlign:"center", color:"#888", fontSize:14 }}>
                    Loading privilege sets...
                  </div>
                ) : (
                  <table className={style.applicantTable}
                    style={{ tableLayout:"fixed", width:"100%" }}>
                    <thead>
                      <tr className={style.applicantHeader}>
                        {COLS.map((col, i) => (
                          <th key={i}
                            className={i === 0 ? style.firstColumn : style.centerAligned}
                            style={{
                              width: col.width || "auto",
                              padding: "8px 6px",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "0.3px",
                              lineHeight: "1.3",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              verticalAlign: "bottom",
                            }}>
                            {col.head.split("\n").map((line, li) => (
                              <span key={li} style={{ display:"block" }}>{line}</span>
                            ))}
                          </th>
                        ))}
                        <th style={{ width:"6%", padding:"8px 6px" }} />
                      </tr>
                    </thead>
                    <tbody>
                      {privilegeSets.length === 0 ? (
                        <tr>
                          <td colSpan={COLS.length + 1}
                            style={{ padding:40, textAlign:"center", color:"#888", fontSize:14 }}>
                            No privilege sets found. Click <strong>+ Add New</strong> to create one.
                          </td>
                        </tr>
                      ) : (
                        privilegeSets.map((row, idx) => (
                          <tr key={row.id || idx}
                            className={`${style.applicantItem} ${
                              idx % 2 !== 0 ? style.sideNonActiveBackground : ""
                            }`}>
                            {COLS.map((col, ci) => (
                              <td key={ci}
                                className={
                                  ci === 0
                                    ? `${style.leftAligned} ${style.firstColumn}`
                                    : style.centerAligned
                                }
                                style={{
                                  padding: "10px 6px",
                                  fontSize: 13,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: ci === 0 ? "normal" : "nowrap",
                                  wordBreak: ci === 0 ? "break-word" : "normal",
                                }}>
                                {/* "Set up" badge for rows with no title/privileges yet */}
                                {col.key === "privilegeSetTitle" && row.isSetupOnly ? (
                                  <span
                                    onClick={() => handleOpenEdit(row)}
                                    style={{
                                      display: "inline-block",
                                      border: "1px solid #06617A",
                                      color: "#06617A",
                                      borderRadius: 4,
                                      padding: "2px 10px",
                                      fontSize: 12,
                                      fontWeight: 600,
                                      cursor: "pointer",
                                    }}>
                                    Set up
                                  </span>
                                ) : (
                                  row[col.key] ?? "-"
                                )}
                              </td>
                            ))}
                            <td style={{ width:"6%", textAlign:"center", padding:"6px", position:"relative" }}>
                              {/* Three-dot menu like XD demo */}
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === row.id ? null : row.id);
                                }}
                                style={{
                                  background: "none", border: "none",
                                  cursor: "pointer", fontSize: 20,
                                  color: "#555", padding: "2px 6px",
                                  borderRadius: 4, lineHeight: 1,
                                }}
                                title="Options"
                              >
                                ···
                              </button>
                              {openMenuId === row.id && (
                                <div
                                  style={{
                                    position: "absolute", right: 0, top: 32,
                                    background: "#fff", border: "1px solid #dee2e6",
                                    borderRadius: 6, zIndex: 999,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                    minWidth: 130, overflow: "hidden",
                                  }}
                                  onClick={e => e.stopPropagation()}
                                >
                                  <div
                                    onClick={() => { setOpenMenuId(null); handleOpenEdit(row); }}
                                    style={{
                                      padding: "10px 16px", cursor: "pointer",
                                      fontSize: 13, color: "#333",
                                      display: "flex", alignItems: "center", gap: 8,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f0f4f8"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                  >
                                    ✏️ Edit
                                  </div>
                                  <div style={{ height: 1, background: "#eee", margin: "0 8px" }} />
                                  <div
                                    onClick={() => { setOpenMenuId(null); handleDelete(row.id); }}
                                    style={{
                                      padding: "10px 16px", cursor: "pointer",
                                      fontSize: 13, color: "#e53935",
                                      display: "flex", alignItems: "center", gap: 8,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#fdecea"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                  >
                                    🗑️ Delete
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer — buttons removed per request; navigation handled by LevelTwoHeader X */}
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
          departmentMap={departmentMap}
        />
      )}
    </Fragment>
  );
};

export default StaffPrivileges;