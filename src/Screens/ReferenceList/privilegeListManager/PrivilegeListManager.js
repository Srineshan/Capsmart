import React, { useState, useEffect, Fragment } from "react";
import { GET, PUT, DELETE } from "../../dataSaver";
import Navbar from "../../../Components/Navbar";
import style from "./index.module.scss";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import PrivilegeListManagerDialog from "./PrivilegeListManagerDialog";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";

// ── Table column headers (matches Image 2 design) ─────────────────────────────
const TABLE_HEAD = [
  "PRIVILEGE ID",
  "PRIVILEGE TYPE",
  "PRIVILEGE TITLE",
  "DEPARTMENT / SERVICE AREA",
  "APPLICANT TYPE",
  "LAST UPDATED",
  "",
];

// Backend enums: CORE | RESTRICTED | NON_CORE  (uppercase)
const PRIVILEGE_TYPE_LABELS = {
  CORE:        "Core",
  RESTRICTED:  "Restricted",
  NON_CORE:    "Non-Core",
  "NON-CORE":  "Non-Core",
  // display fallbacks (sentence-case from old data)
  Core:        "Core",
  Restricted:  "Restricted",
  "Non-Core":  "Non-Core",
};

// ── Component ──────────────────────────────────────────────────────────────────
export const PrivilegeListManager = () => {

  // ── State ──────────────────────────────────────────────────────────────────
  const [entityId,         setEntityId]         = useState("");
  const [siteId,           setSiteId]           = useState("");
  const [lastUpdatedDate,  setLastUpdatedDate]  = useState("");

  // Main tabs
  const [activeTab,        setActiveTab]        = useState("active");    // "active" | "retired"
  const [activeCount,      setActiveCount]      = useState(0);
  const [retiredCount,     setRetiredCount]     = useState(0);

  // Sub-tabs
  const [subTab,           setSubTab]           = useState("discreet");  // "discreet" | "descriptive"
  const [discreetCount,    setDiscreetCount]    = useState(0);
  const [descriptiveCount, setDescriptiveCount] = useState(0);

  // Data
  const [privileges,       setPrivileges]       = useState([]);
  const [displayRows,      setDisplayRows]      = useState([]);
  const [applicantTypes,   setApplicantTypes]   = useState([]);
  const [departments,      setDepartments]      = useState([]);

  // Filters
  const [filterDept,       setFilterDept]       = useState("");
  const [filterApplicant,  setFilterApplicant]  = useState("");
  const [showAllDepts,     setShowAllDepts]     = useState(false);
  const [showAllApplicants,setShowAllApplicants]= useState(false);

  // Dialog
  const [isDialogOpen,     setIsDialogOpen]     = useState(false);
  const [isEdit,           setIsEdit]           = useState(false);
  const [editData,         setEditData]         = useState(null);

  const [isLoading,        setIsLoading]        = useState(false);
  const [showSearch,       setShowSearch]       = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [currentPage,      setCurrentPage]      = useState(1);
  const [isBulkUploading,  setIsBulkUploading] = useState(false);
  const [openMenuId,       setOpenMenuId]       = useState(null);
  const ROWS_PER_PAGE = 50;
  const bulkInputRef = React.useRef(null);

  // ── Boot ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchEntity();
    fetchSite();
    fetchApplicantTypes();
    fetchDepartments();
    fetchPrivileges();
  }, []);

  useEffect(() => {
    if (entityId) fetchLastModified(entityId);
  }, [entityId]);

  // Re-fetch departments once siteId is resolved so we use the scoped endpoint
  useEffect(() => {
    if (siteId) fetchDepartments(siteId);
  }, [siteId]);

  useEffect(() => {
    setCurrentPage(1);
    applyFilters();
  }, [privileges, activeTab, subTab, filterDept, filterApplicant, searchQuery]);

  // ── API ──────────────────────────────────────────────────────────────────────
  const fetchEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]) setEntityId(data[0].id);
    } catch (e) { console.error("entity:", e); }
  };

  const fetchSite = async () => {
    try {
      const { data } = await GET("entity-service/sites");
      const first = Array.isArray(data) ? data[0] : null;
      if (first?.id) setSiteId(first.id);
    } catch (e) { console.error("sites:", e); }
  };

  const fetchLastModified = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      const ts   = data?.privilegeMaster?.lastModified || data?.departments?.lastModified;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) { console.error("lastModified:", e); }
  };

  const fetchApplicantTypes = async () => {
    try {
      const res = await GET("entity-service/applicantType");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];
      // Deduplicate by name
      const seen = new Set();
      const unique = list.filter(item => {
        const label = (typeof item?.applicantType === "string"
          ? item.applicantType
          : Array.isArray(item?.applicantType) ? item.applicantType[0] : item?.name || "")
          .trim().toLowerCase();
        if (!label || seen.has(label)) return false;
        seen.add(label);
        return true;
      });
      setApplicantTypes(unique);
    } catch (e) { console.error("applicantTypes:", e); }
  };

  // Uses GET /department/{siteId} — scoped to this site (per manager instruction)
  // Called initially with no arg (returns empty — siteId not yet known)
  // Re-called via useEffect once siteId resolves
  const fetchDepartments = async (resolvedSiteId) => {
    if (!resolvedSiteId) return;
    try {
      const res = await GET(`entity-service/department/${resolvedSiteId}`);
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];
      // Deduplicate by id first, then by name
      const seenIds   = new Set();
      const seenNames = new Set();
      const unique = list
        .map(d => ({ id: d.id, name: d?.departmentName?.name || d?.name || "" }))
        .filter(d => {
          const nameKey = d.name.trim().toLowerCase();
          if (!d.id || seenIds.has(d.id)) return false;
          if (nameKey && seenNames.has(nameKey)) return false;
          seenIds.add(d.id);
          if (nameKey) seenNames.add(nameKey);
          return true;
        });
      setDepartments(unique);
    } catch (e) { console.error("departments:", e); }
  };

  // Uses GET /privilegeMaster (privilege-master-controller) — correct per Swagger Image 5
  const fetchPrivileges = async () => {
    try {
      setIsLoading(true);
      const res = await GET("entity-service/privilegeMaster");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];
      setPrivileges(list);

      // null status = treat as ACTIVE (new records may have null)
      const active  = list.filter(r => (r?.status || "ACTIVE").toUpperCase() !== "RETIRED");
      const retired = list.filter(r => (r?.status || "ACTIVE").toUpperCase() === "RETIRED");
      setActiveCount(active.length);
      setRetiredCount(retired.length);
    } catch (e) { console.error("privilegeMaster:", e); }
    finally { setIsLoading(false); }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────
  // API status enum: ACTIVE | RETIRED (uppercase) — status null treated as active
  const normalizeStatus   = (r) => (r?.status || r?.privilegeStatus || "ACTIVE").toUpperCase();
  const normalizeCategory = (r) => (r?.category || r?.privilegeCategory || "").toUpperCase(); // API: "category"

  const applyFilters = () => {
    // Active / Retired filter
    let rows = privileges.filter(r =>
      activeTab === "active" ? normalizeStatus(r) !== "RETIRED" : normalizeStatus(r) === "RETIRED"
    );

    // Update sub-tab counts based on active/retired rows
    setDiscreetCount(rows.filter(r => normalizeCategory(r) !== "DESCRIPTIVE").length);
    setDescriptiveCount(rows.filter(r => normalizeCategory(r) === "DESCRIPTIVE").length);

    // Discreet / Descriptive sub-tab
    rows = rows.filter(r =>
      subTab === "discreet"
        ? normalizeCategory(r) !== "DESCRIPTIVE"
        : normalizeCategory(r) === "DESCRIPTIVE"
    );

    // Sidebar filters
    if (filterDept)      rows = rows.filter(r => r.department?.id === filterDept || r.departmentId === filterDept);
    if (filterApplicant) rows = rows.filter(r => (r.applicantType || r.applicantTypes || []).some(a => a?.id === filterApplicant));

    // Search by privilege ID or title
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      rows = rows.filter(r =>
        String(r?.privilegeId || r?.id || "").toLowerCase().includes(q) ||
        (r?.title || r?.privilegeTitle || "").toLowerCase().includes(q)
      );
    }

    setDisplayRows(rows);
  };

  const formatPrivilegeType = (row) => {
    // API returns "type" field (not "privilegeType")
    const raw = (row?.type || row?.privilegeType || "").toUpperCase().replace(/-| /g, "_");
    return PRIVILEGE_TYPE_LABELS[raw] || row?.type || row?.privilegeType || "—";
  };

  const formatDeptCount = (row) => {
    // API fields: departmentServiceAreas or departments
    const depts = row?.departmentServiceAreas || row?.departments || [];
    if (Array.isArray(depts) && depts.length > 0) return depts.length;
    return "—";
  };

  const formatApplicantCount = (row) => {
    // API field: "applicantType" (array) — not "applicantTypes"
    const types = row?.applicantType || row?.applicantTypes || [];
    return Array.isArray(types) && types.length > 0 ? types.length : "—";
  };

  const formatDate = (row) => {
    // API confirmed field: "lastModifiedDate"
    const raw = row?.lastModifiedDate || row?.lastUpdated || row?.updatedAt || row?.createdDate;
    if (!raw) return "—";
    try { return format(new Date(raw), "MM/dd/yyyy"); }
    catch { return "—"; }
  };

  // ── Dialog ───────────────────────────────────────────────────────────────────
  const openAdd = () => { setEditData(null); setIsEdit(false); setIsDialogOpen(true); };
  const openEdit = (row) => { setEditData(row); setIsEdit(true); setIsDialogOpen(true); };
  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) fetchPrivileges();
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({ privilegeMaster: { status: "DONE", lastModified: new Date().toISOString() } })
      );
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    } catch (e) { console.warn("markAsDone:", e); }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground} style={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column", overflow: "hidden" }}
        onClick={() => setOpenMenuId(null)}>
        <div className={style.padding20} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>

          {/* ── TWO-PANEL LAYOUT matching demo design ── */}
          <div className={style.bigCardGrid} style={{ marginTop: 16, alignItems: "stretch", flex: 1, minHeight: 0 }}>

            {/* ══════════════════════════════════════════════════════════════
                LEFT SIDEBAR — TWO separate boxes: Filters + Privilege Sets
            ══════════════════════════════════════════════════════════════ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 0, overflow: "hidden" }}>

              {/* ── BOX 1: Filters — compact, flexShrink:0 ── */}
              <div style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flexShrink: 0,
              }}>

              {/* Filters heading + Clear All */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 12, color: "#333" }}>Filters</span>
                <span
                  style={{ fontSize: 11, color: "#06617A", cursor: "pointer", fontWeight: 500 }}
                  onClick={() => { setFilterDept(""); setFilterApplicant(""); }}
                >Clear All</span>
              </div>

              {/* By Departments */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#52575d", marginBottom: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>By Departments</span>
                  <span style={{ fontSize: 10, color: "#06617A", cursor: "pointer" }}
                    onClick={() => setShowAllDepts(p => !p)}>
                    {showAllDepts ? "▲" : "▼"}
                  </span>
                </div>
                {(showAllDepts ? departments : departments.slice(0, 3)).map(dept => (
                  <label key={dept.id} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "2px 0", cursor: "pointer", fontSize: 12, color: "#333",
                  }}>
                    <input type="checkbox"
                      checked={filterDept === dept.id}
                      onChange={() => setFilterDept(filterDept === dept.id ? "" : dept.id)}
                      style={{ accentColor: "#06617A", width: 13, height: 13, flexShrink: 0 }} />
                    {dept?.name || "—"}
                  </label>
                ))}
                {departments.length > 3 && (
                  <span
                    style={{ fontSize: 11, color: "#06617A", cursor: "pointer", marginTop: 2, display: "block" }}
                    onClick={() => setShowAllDepts(p => !p)}
                  >
                    {showAllDepts ? "See Less" : "See More"}
                  </span>
                )}
              </div>

              {/* Search Applicants */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#52575d", marginBottom: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Search Applicants</span>
                  <span style={{ fontSize: 10, color: "#06617A", cursor: "pointer" }}
                    onClick={() => setShowAllApplicants(p => !p)}>
                    {showAllApplicants ? "▲" : "▼"}
                  </span>
                </div>
                {(showAllApplicants ? applicantTypes : applicantTypes.slice(0, 3)).map(at => {
                  const label = typeof at?.applicantType === "string" ? at.applicantType
                    : Array.isArray(at?.applicantType) ? at.applicantType[0]
                    : at?.name || "—";
                  return (
                    <label key={at.id} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "2px 0", cursor: "pointer", fontSize: 12, color: "#333",
                    }}>
                      <input type="checkbox"
                        checked={filterApplicant === at.id}
                        onChange={() => setFilterApplicant(filterApplicant === at.id ? "" : at.id)}
                        style={{ accentColor: "#06617A", width: 13, height: 13, flexShrink: 0 }} />
                      {label}
                    </label>
                  );
                })}
                {applicantTypes.length > 3 && (
                  <span
                    style={{ fontSize: 11, color: "#06617A", cursor: "pointer", marginTop: 2, display: "block" }}
                    onClick={() => setShowAllApplicants(p => !p)}
                  >
                    {showAllApplicants ? "See Less" : "See More"}
                  </span>
                )}
              </div>

              {/* By Last Updated On — heading left, compact date inputs */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#52575d", marginBottom: 3, textAlign: "left" }}>
                  By Last Updated On
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <input type="date" style={{
                    fontSize: 10, border: "1px solid #dee2e6", borderRadius: 4,
                    padding: "2px 3px", flex: 1, minWidth: 0, color: "#555",
                  }} />
                  <span style={{ fontSize: 10, color: "#888", flexShrink: 0 }}>To</span>
                  <input type="date" style={{
                    fontSize: 10, border: "1px solid #dee2e6", borderRadius: 4,
                    padding: "2px 3px", flex: 1, minWidth: 0, color: "#555",
                  }} />
                </div>
              </div>

              </div>{/* end BOX 1: Filters */}

              {/* ── BOX 2: Privilege Sets — flex:1, list scrolls internally ── */}
              <div style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                overflow: "hidden",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}>
                <div style={{ padding: "10px 14px", borderBottom: "1px solid #dee2e6" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>
                    Privilege Sets ({privileges.length})
                  </div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                    By Department - Service Area
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {departments.length === 0 ? (
                    <div style={{ padding: "9px 14px", fontSize: 12, color: "#888" }}>
                      No departments found
                    </div>
                  ) : departments.map((dept, idx) => {
                    const count = privileges.filter(p => {
                      const depts = p?.departmentServiceAreas || p?.departments || [];
                      return depts.some(d => (d?.id || d?.department?.id) === dept.id);
                    }).length;
                    return (
                      <div key={dept.id}
                        onClick={() => setFilterDept(filterDept === dept.id ? "" : dept.id)}
                        style={{
                          padding: "8px 14px",
                          background: filterDept === dept.id ? "#e8f4f7" : idx % 2 === 0 ? "#fff" : "#fafafa",
                          borderBottom: "1px solid #f0f0f0",
                          fontSize: 12, cursor: "pointer", display: "flex",
                          justifyContent: "space-between", alignItems: "center",
                          color: filterDept === dept.id ? "#06617A" : "#333",
                          fontWeight: filterDept === dept.id ? 600 : 400,
                        }}
                      >
                        <span>{dept?.name || "—"}</span>
                        {count > 0 && (
                          <span style={{ fontSize: 11, color: "#06617A", background: "#e8f4f7",
                            borderRadius: 10, padding: "1px 6px" }}>{count}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>{/* end BOX 2: Privilege Sets */}

            </div>{/* end left sidebar column */}
            {/* ══════════════════════════════════════════════════════════════
                RIGHT MAIN CONTENT
            ══════════════════════════════════════════════════════════════ */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1, minHeight: 0, overflow: "hidden" }}>

              {/* Breadcrumb — left-aligned inside right column, above Active Privileges, like demo */}
              <div style={{ fontSize: 12, color: "#52575d", letterSpacing: 1, marginBottom: 8, textAlign: "left" }}>
                SET UP TOOLS &nbsp;&gt;&nbsp; PRIVILEGE LIST MANAGER
              </div>

              {/* ── ROW 1: Active/Retired tabs (left) + BULK UPLOAD / ADD NEW (right) — same line ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 0 }}>

                {/* Active / Retired tabs */}
                <div style={{ display: "flex" }}>
                  {[
                    { key: "active",  label: "Active Privileges",  count: activeCount  },
                    { key: "retired", label: "Retired Privileges", count: retiredCount },
                  ].map(({ key, label, count }) => (
                    <button key={key} onClick={() => setActiveTab(key)}
                      style={{
                        padding: "8px 18px", border: "none", background: "none",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        color: activeTab === key ? "#06617A" : "#888",
                        borderBottom: activeTab === key ? "3px solid #06617A" : "3px solid transparent",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      {label}
                      <span style={{
                        background: activeTab === key ? "#06617A" : "#e0e0e0",
                        color: activeTab === key ? "#fff" : "#555",
                        borderRadius: 12, padding: "1px 8px", fontSize: 12, fontWeight: 600,
                      }}>{count}</span>
                    </button>
                  ))}
                </div>

                {/* BULK UPLOAD + ADD NEW */}
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    onClick={() => bulkInputRef.current?.click()}
                    disabled={isBulkUploading}
                    style={{
                      background: "#fff", border: "2px solid #06617A", color: "#06617A",
                      borderRadius: 6, padding: "7px 18px", fontSize: 13, fontWeight: 700,
                      cursor: isBulkUploading ? "not-allowed" : "pointer",
                      letterSpacing: "0.5px", opacity: isBulkUploading ? 0.7 : 1,
                    }}
                  >{isBulkUploading ? "UPLOADING..." : "BULK UPLOAD"}</button>
                  <input
                    ref={bulkInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsBulkUploading(true);
                      try {
                        const fd = new FormData();
                        fd.append("file", file);
                        const res = await fetch(
                          `${process.env.REACT_APP_BASE_URL || ""}/entity-service/privilegeMaster/bulk`,
                          { method: "POST", body: fd,
                            headers: { Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token") || ""}` }
                          }
                        );
                        if (res.ok) {
                          SuccessToaster("Bulk upload successful! Refreshing...");
                          setTimeout(() => fetchPrivileges(), 1500);
                        } else {
                          const err = await res.json().catch(() => ({}));
                          ErrorToaster(err?.message || `Upload failed (${res.status}). Check file format.`);
                        }
                      } catch (err) {
                        ErrorToaster(err?.message || "Upload failed. Please try again.");
                      } finally {
                        setIsBulkUploading(false);
                        e.target.value = "";
                      }
                    }}
                  />
                  <button
                    onClick={openAdd}
                    style={{
                      background: "#06617A", border: "none", color: "#fff",
                      borderRadius: 6, padding: "7px 18px", fontSize: 13, fontWeight: 700,
                      cursor: "pointer", letterSpacing: "0.5px",
                    }}
                  >ADD NEW</button>
                </div>
              </div>

              {/* ── ROW 2: Discreet / Descriptive sub-tabs + SVG Search + Print icons ── */}
              <div style={{ display: "flex", alignItems: "center", padding: "10px 0 8px 0", borderTop: "2px solid #dee2e6" }}>
                {[
                  { key: "discreet",    label: "Discreet Privilege Type",    count: discreetCount    },
                  { key: "descriptive", label: "Descriptive Privilege Type", count: descriptiveCount },
                ].map(({ key, label, count }) => (
                  <button key={key} onClick={() => setSubTab(key)}
                    style={{
                      padding: "5px 14px", border: "none", borderRadius: 4, marginRight: 8,
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: subTab === key ? "#06617A" : "#f0f0f0",
                      color:      subTab === key ? "#fff"    : "#555",
                      display: "flex", alignItems: "center", gap: 6,
                    }}
                  >
                    {label}
                    <span style={{
                      background: subTab === key ? "rgba(255,255,255,0.25)" : "#ddd",
                      borderRadius: 10, padding: "1px 6px", fontSize: 11,
                    }}>{count}</span>
                  </button>
                ))}

                {/* SVG icons — dark grey, no blue, exactly like demo */}
                <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
                  {showSearch && (
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search by ID or title..."
                      style={{
                        border: "1px solid #ccc", borderRadius: 4,
                        padding: "4px 10px", fontSize: 12, width: 200, outline: "none",
                      }}
                      onKeyDown={e => { if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); }}}
                    />
                  )}
                  {/* Search SVG */}
                  <span
                    title={showSearch ? "Close search" : "Search privileges"}
                    onClick={() => { setShowSearch(p => !p); if (showSearch) setSearchQuery(""); }}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </span>
                  {/* Print SVG */}
                  <span
                    title="Print table"
                    onClick={() => window.print()}
                    style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 6 2 18 2 18 9"/>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                      <rect x="6" y="14" width="12" height="8"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* ── THE WHITE BOX: flex:1, table scrolls internally ── */}
              <div style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                padding: "0 0 16px 0",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
              }}>
              {/* ── Table wrapper — scrolls internally ── */}
              <div style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "auto",
                minHeight: 0,
                scrollbarWidth: "thin",
                scrollbarColor: "#06617A #f0f0f0",
              }}>

                {/* Pagination row — sticky at top of scroll area */}
                {(() => {
                  const totalPages = Math.max(1, Math.ceil(displayRows.length / ROWS_PER_PAGE));
                  const startRow = (currentPage - 1) * ROWS_PER_PAGE + 1;
                  const endRow = Math.min(currentPage * ROWS_PER_PAGE, displayRows.length);
                  return (
                    <div style={{
                      display: "flex", justifyContent: "flex-end", alignItems: "center",
                      padding: "5px 12px", background: "#fafafa",
                      borderBottom: "1px solid #dee2e6",
                      fontSize: 11, color: "#888", gap: 16,
                      position: "sticky", top: 0, zIndex: 2,
                    }}>
                      <span>Page {displayRows.length === 0 ? 0 : startRow}-{endRow} of {displayRows.length}</span>
                      <span>Display All ▼&nbsp;Rows</span>
                      <span
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        style={{ cursor: currentPage > 1 ? "pointer" : "default", padding: "0 4px",
                          color: currentPage > 1 ? "#06617A" : "#ccc", fontWeight: 700 }}
                      >&lt;</span>
                      <span
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        style={{ cursor: currentPage < totalPages ? "pointer" : "default", padding: "0 4px",
                          color: currentPage < totalPages ? "#06617A" : "#ccc", fontWeight: 700 }}
                      >&gt;</span>
                    </div>
                  );
                })()}

                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr style={{ background: "#f5f6fa" }}>
                      {TABLE_HEAD.map((h, i) => (
                        <th key={i} style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          fontSize: 11, fontWeight: 700, color: "#52575d",
                          borderBottom: "1px solid #dee2e6", whiteSpace: "nowrap",
                          position: "sticky", top: 37, background: "#f5f6fa", zIndex: 1,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={TABLE_HEAD.length}
                          style={{ padding: 40, textAlign: "center", color: "#888", fontSize: 14 }}>
                          Loading...
                        </td>
                      </tr>
                    ) : displayRows.length === 0 ? (
                      <tr>
                        <td colSpan={TABLE_HEAD.length}
                          style={{ padding: 40, textAlign: "center", color: "#888", fontSize: 14 }}>
                          No privileges found. Click <strong>ADD NEW</strong> to create one.
                        </td>
                      </tr>
                    ) : displayRows
                      .slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)
                      .map((row, idx) => (
                      <tr key={row.id || idx}
                        style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f0f9fb"}
                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa"}
                      >
                        <td style={tdStyle}>{row?.privilegeId || "—"}</td>
                        <td style={tdStyle}>{formatPrivilegeType(row)}</td>
                        <td style={tdStyle}>{row?.title || row?.privilegeTitle || "—"}</td>
                        <td style={tdStyle}>{formatDeptCount(row)}</td>
                        <td style={tdStyle}>{formatApplicantCount(row)}</td>
                        <td style={tdStyle}>{formatDate(row)}</td>
                        {/* 3-dots — dropdown with Edit / Delete */}
                        <td style={{ ...tdStyle, position: "relative" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === (row.id || idx) ? null : (row.id || idx));
                            }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 18, padding: "0 4px", lineHeight: 1 }}
                          >•••</button>
                          {openMenuId === (row.id || idx) && (
                            <div style={{
                              position: "absolute", right: 8, top: "100%", zIndex: 100,
                              background: "#fff", border: "1px solid #dee2e6", borderRadius: 6,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.12)", minWidth: 120, overflow: "hidden",
                            }}>
                              <div
                                onClick={() => { openEdit(row); setOpenMenuId(null); }}
                                style={{ padding: "9px 16px", fontSize: 13, cursor: "pointer", color: "#333", display: "flex", alignItems: "center", gap: 8 }}
                                onMouseEnter={e => e.currentTarget.style.background = "#f5f6fa"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Edit
                              </div>
                              <div
                                onClick={async () => {
                                  setOpenMenuId(null);
                                  try {
                                    await DELETE(`entity-service/privilegeMaster/${row.id}`);
                                    SuccessToaster("Privilege deleted successfully.");
                                    fetchPrivileges();
                                  } catch (e) {
                                    ErrorToaster(e?.message || "Delete failed. Please try again.");
                                  }
                                }}
                                style={{ padding: "9px 16px", fontSize: 13, cursor: "pointer", color: "#d32f2f", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #f0f0f0" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                  <path d="M10 11v6"/><path d="M14 11v6"/>
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                                Delete
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              </div>
            </div>{/* end right column */}
          </div>{/* end bigCardGrid */}
        </div>
      </div>

      {isDialogOpen && (
        <PrivilegeListManagerDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          isEdit={isEdit}
          selectedPrivilege={editData}
          applicantTypeList={applicantTypes}
          departmentList={departments}
        />
      )}
    </Fragment>
  );
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: 13,
  color: "#333",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "middle",
  textAlign: "left",
};

export default PrivilegeListManager;