import React, { useState, useEffect, Fragment } from "react";
import { GET, PUT } from "../../dataSaver";
import Navbar from "../../../Components/Navbar";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import style from "./index.module.scss";
import { formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import PrivilegeListManagerDialog from "./PrivilegeListManagerDialog";
import { SuccessToaster } from "../../../utils/toaster";

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

  // Dialog
  const [isDialogOpen,     setIsDialogOpen]     = useState(false);
  const [isEdit,           setIsEdit]           = useState(false);
  const [editData,         setEditData]         = useState(null);

  const [isLoading,        setIsLoading]        = useState(false);

  // ── Boot ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchEntity();
    fetchApplicantTypes();
    fetchDepartments();
    fetchPrivileges();
  }, []);

  useEffect(() => {
    if (entityId) fetchLastModified(entityId);
  }, [entityId]);

  useEffect(() => {
    applyFilters();
  }, [privileges, activeTab, subTab, filterDept, filterApplicant]);

  // ── API ──────────────────────────────────────────────────────────────────────
  const fetchEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]) setEntityId(data[0].id);
    } catch (e) { console.error("entity:", e); }
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
      const { data } = await GET("entity-service/applicantType");
      setApplicantTypes(data || []);
    } catch (e) { console.error("applicantTypes:", e); }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await GET("entity-service/department");
      setDepartments(data || []);
    } catch (e) { console.error("departments:", e); }
  };

  // Uses GET /privilegeMaster (privilege-master-controller) — correct per Swagger Image 5
  const fetchPrivileges = async () => {
    try {
      setIsLoading(true);
      const { data } = await GET("entity-service/privilegeMaster");
      const list = data || [];
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
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          <LevelTwoHeader
            heading="Privilege List Manager"
            updatedTime={lastUpdatedDate ? `UPDATED ON ${lastUpdatedDate}` : ""}
            path="/Screens/ReferenceList/customerAdminDashboard"
            callingFrom="Customer Admin"
            needHeader={false}
            tileType="PrivilegeListManager"
            handleOpenDialog={openAdd}
            onAddClick={openAdd}
            onCloseLevel2={() => handleCloseDialog(false)}
            handleClose={() => handleCloseDialog(false)}
          />

          {/* Breadcrumb */}
          <div className={`${style.displayInRow} ${style.bottomTextStyle} ${style.marginTop10}`}
            style={{ fontSize: 12, color: "#52575d", letterSpacing: 1 }}>
            SET UP TOOLS &nbsp;&gt;&nbsp; PRIVILEGE LIST MANAGER
          </div>

          {/* ── TWO-PANEL LAYOUT matching demo design ── */}
          <div className={style.bigCardGrid} style={{ marginTop: 16, alignItems: "flex-start" }}>

            {/* ══════════════════════════════════════════════════════════════
                LEFT SIDEBAR — inside its own card box (matches demo Image 1)
            ══════════════════════════════════════════════════════════════ */}
            <div style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              /* Sidebar scrolls independently if content overflows */
              maxHeight: "calc(100vh - 180px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}>

              {/* Filters heading + Clear All */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>Filters</span>
                <span
                  style={{ fontSize: 12, color: "#06617A", cursor: "pointer", fontWeight: 500 }}
                  onClick={() => { setFilterDept(""); setFilterApplicant(""); }}
                >Clear All</span>
              </div>

              {/* By Departments */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#52575d", marginBottom: 8 }}>
                  By Departments
                </div>
                {departments.slice(0, 3).map(dept => (
                  <label key={dept.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 0", cursor: "pointer", fontSize: 13, color: "#333",
                  }}>
                    <input type="checkbox"
                      checked={filterDept === dept.id}
                      onChange={() => setFilterDept(filterDept === dept.id ? "" : dept.id)}
                      style={{ accentColor: "#06617A", width: 14, height: 14, flexShrink: 0 }} />
                    {dept?.departmentName?.name || dept?.name || "—"}
                  </label>
                ))}
                {departments.length > 3 && (
                  <span style={{ fontSize: 12, color: "#06617A", cursor: "pointer", marginTop: 4, display: "block" }}>
                    See More
                  </span>
                )}
              </div>

              {/* Search Applicants */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#52575d", marginBottom: 8 }}>
                  Search Applicants
                </div>
                {applicantTypes.slice(0, 3).map(at => (
                  <label key={at.id} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "5px 0", cursor: "pointer", fontSize: 13, color: "#333",
                  }}>
                    <input type="checkbox"
                      checked={filterApplicant === at.id}
                      onChange={() => setFilterApplicant(filterApplicant === at.id ? "" : at.id)}
                      style={{ accentColor: "#06617A", width: 14, height: 14, flexShrink: 0 }} />
                    {at?.applicantType || "—"}
                  </label>
                ))}
                {applicantTypes.length > 3 && (
                  <span style={{ fontSize: 12, color: "#06617A", cursor: "pointer", marginTop: 4, display: "block" }}>
                    See More
                  </span>
                )}
              </div>

              {/* By Last Updated On */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#52575d", marginBottom: 8 }}>
                  By Last Updated On
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input type="date" style={{
                    fontSize: 11, border: "1px solid #dee2e6", borderRadius: 4,
                    padding: "3px 5px", flex: 1, minWidth: 0,
                  }} />
                  <span style={{ fontSize: 11, color: "#888", flexShrink: 0 }}>To</span>
                  <input type="date" style={{
                    fontSize: 11, border: "1px solid #dee2e6", borderRadius: 4,
                    padding: "3px 5px", flex: 1, minWidth: 0,
                  }} />
                </div>
              </div>

              {/* Privilege Sets */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#333", marginBottom: 4 }}>
                  Privilege Sets ({privileges.length})
                </div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 10 }}>
                  By Department - Service Area
                </div>
                {departments.map(dept => (
                  <div key={dept.id} style={{
                    padding: "8px 12px",
                    background: "#f5f6fa",
                    borderRadius: 6,
                    marginBottom: 6,
                    fontSize: 13,
                    color: "#333",
                    cursor: "pointer",
                  }}
                    onClick={() => setFilterDept(filterDept === dept.id ? "" : dept.id)}
                  >
                    {dept?.departmentName?.name || dept?.name}
                  </div>
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                RIGHT MAIN CONTENT — inside its own card box (matches demo)
            ══════════════════════════════════════════════════════════════ */}
            <div style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              /* Whole right panel height-bounded so inner table scrolls */
              maxHeight: "calc(100vh - 180px)",
              overflow: "hidden",
            }}>

              {/* ── Top action buttons (BULK UPLOAD / ADD NEW) ── */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 14, flexShrink: 0 }}>
                <button
                  onClick={() => document.getElementById("priv-bulk-input").click()}
                  style={{
                    background: "#fff", border: "2px solid #06617A", color: "#06617A",
                    borderRadius: 6, padding: "7px 18px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", letterSpacing: "0.5px",
                  }}
                >BULK UPLOAD</button>
                <input id="priv-bulk-input" type="file" multiple accept=".csv,.xlsx,.xls"
                  style={{ display: "none" }} onChange={() => {}} />
                <button
                  onClick={openAdd}
                  style={{
                    background: "#06617A", border: "none", color: "#fff",
                    borderRadius: 6, padding: "7px 18px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", letterSpacing: "0.5px",
                  }}
                >ADD NEW</button>
              </div>

              {/* ── Active / Retired tabs ── */}
              <div style={{ display: "flex", borderBottom: "2px solid #dee2e6", flexShrink: 0 }}>
                {[
                  { key: "active",  label: "Active Privileges",  count: activeCount  },
                  { key: "retired", label: "Retired Privileges", count: retiredCount },
                ].map(({ key, label, count }) => (
                  <button key={key} onClick={() => setActiveTab(key)}
                    style={{
                      padding: "10px 20px", border: "none", background: "none",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      color: activeTab === key ? "#06617A" : "#888",
                      borderBottom: activeTab === key ? "3px solid #06617A" : "3px solid transparent",
                      marginBottom: -2, display: "flex", alignItems: "center", gap: 6,
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

              {/* ── Discreet / Descriptive sub-tabs + icons ── */}
              <div style={{ display: "flex", alignItems: "center", margin: "12px 0", flexShrink: 0 }}>
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
                <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ cursor: "pointer", color: "#555", fontSize: 18 }} title="Search">&#128269;</span>
                  <span style={{ cursor: "pointer", color: "#555", fontSize: 18 }} title="Print">&#128438;</span>
                </div>
              </div>

              {/* ── Table wrapper — THIS is the scroll container ── */}
              <div style={{
                flex: 1,                    /* takes remaining height in the flex column */
                overflowY: "auto",          /* only the table scrolls vertically */
                overflowX: "auto",          /* horizontal scroll if table is wide */
                border: "1px solid #dee2e6",
                borderRadius: 6,
                /* Custom scrollbar styling */
                scrollbarWidth: "thin",
                scrollbarColor: "#06617A #f0f0f0",
              }}>

                {/* Pagination row — sticky at top of scroll area */}
                <div style={{
                  display: "flex", justifyContent: "flex-end", alignItems: "center",
                  padding: "5px 12px", background: "#fafafa",
                  borderBottom: "1px solid #dee2e6",
                  fontSize: 11, color: "#888", gap: 16,
                  position: "sticky", top: 0, zIndex: 2,
                }}>
                  <span>Page 1-{Math.max(1, displayRows.length)} of {displayRows.length}</span>
                  <span>Display All ▼&nbsp;Rows</span>
                  <span style={{ cursor: "pointer", padding: "0 4px" }}>&lt;</span>
                  <span style={{ cursor: "pointer", padding: "0 4px" }}>&gt;</span>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr style={{ background: "#f5f6fa" }}>
                      {TABLE_HEAD.map((h, i) => (
                        <th key={i} style={{
                          padding: "10px 12px", textAlign: "left",
                          fontSize: 11, fontWeight: 700, color: "#52575d",
                          borderBottom: "1px solid #dee2e6", whiteSpace: "nowrap",
                          /* Sticky header inside the scroll container */
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
                    ) : displayRows.map((row, idx) => (
                      <tr key={row.id || idx}
                        style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f0f9fb"}
                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#fafafa"}
                      >
                        <td style={tdStyle}>{row?.privilegeId || "—"}</td>
                        <td style={tdStyle}>{formatPrivilegeType(row)}</td>
                        {/* API field: "title" */}
                        <td style={tdStyle}>{row?.title || row?.privilegeTitle || "—"}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>{formatDeptCount(row)}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>{formatApplicantCount(row)}</td>
                        <td style={tdStyle}>{formatDate(row)}</td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => openEdit(row)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: 18 }}
                            title="Edit / Options"
                          >•••</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Key Note badge ── */}
              <div style={{
                marginTop: 10, padding: "7px 14px", flexShrink: 0,
                background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 6,
                fontSize: 12, color: "#856404", display: "inline-flex", gap: 6, alignItems: "center",
                alignSelf: "flex-start",
              }}>
                <strong>Key Note:</strong>&nbsp;Click notice — <em>ID &amp; title are unique</em>
              </div>

              {/* ── Footer: MARK AS DONE ── */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12, flexShrink: 0 }}>
                <button
                  onClick={handleMarkAsDone}
                  disabled={privileges.length === 0}
                  style={{
                    background: privileges.length > 0 ? "#06617A" : "#ccc",
                    color: "#fff", border: "none", borderRadius: 6,
                    padding: "10px 24px", fontSize: 14, fontWeight: 600,
                    cursor: privileges.length > 0 ? "pointer" : "not-allowed",
                    letterSpacing: "0.5px",
                  }}
                >MARK AS DONE</button>
              </div>
            </div>
          </div>
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
};

export default PrivilegeListManager;