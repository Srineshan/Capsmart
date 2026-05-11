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

  const COLS = [
    { head: "DEPARTMENT",          key: "departmentLabel"   },
    { head: "SERVICE AREA",        key: "serviceAreaLabel"  },
    { head: "PRIVILEGE SET TITLE", key: "privilegeSetTitle" },
    { head: "CORE",                key: "coreCount"         },
    { head: "RESTRICTED",          key: "restrictedCount"   },
    { head: "NON-CORE",            key: "nonCoreCount"      },
    { head: "LAST BOD APPROVAL",   key: "bodApprovalDate"   },
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
        if (dept?.id)
          map[dept.id] = dept?.departmentName?.name || dept?.name || dept?.departmentName || "";
      });
      setDepartmentMap(map);
    } catch (e) { console.warn("[SP] departmentMap:", e?.message); }
  };

  const getSites = async () => {
    try {
      const res  = await GET("entity-service/sites");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      setSiteList(Array.isArray(raw) ? raw : []);
    } catch (e) { console.error("[SP] sites:", e?.message); }
  };

  const getPrivileges = async (siteId) => {
    if (!siteId) return;
    setIsLoading(true);
    let list = [];

    // FIX: Try site-specific endpoint first
    try {
      const res = await GET(`entity-service/staffPrivilege/site/${siteId}`);
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      list = Array.isArray(raw) ? raw : [];
    } catch (e) { console.warn("[SP] site endpoint:", e?.message); }

    // FIX: Always also try global endpoint and merge — ensures newly saved records
    // (which may take time to index under a site) always appear.
    // De-duplicate by id.
    try {
      const res = await GET("entity-service/staffPrivilege");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const global = Array.isArray(raw) ? raw : [];

      // Merge: prefer site-specific records; add any global records not already present
      const existingIds = new Set(list.map(r => r.id));
      const merged = [
        ...list,
        ...global.filter(r => !existingIds.has(r.id)),
      ];
      list = merged.length > 0 ? merged : list;
    } catch (e) { console.warn("[SP] global endpoint:", e?.message); }

    // Refresh department map to resolve names for newly added records
    let freshDeptMap = { ...departmentMap };
    try {
      const dr  = await GET("entity-service/department");
      const raw = dr?.data?.content || dr?.data?.data || dr?.data ||
        dr?.content || (Array.isArray(dr) ? dr : []);
      (Array.isArray(raw) ? raw : []).forEach(d => {
        if (d?.id)
          freshDeptMap[d.id] = d?.departmentName?.name || d?.name || "";
      });
    } catch (_) {}

    setPrivilegeSets(list.map(row => normalizeRow(row, freshDeptMap)));
    setIsLoading(false);
  };

  // ── Normalize ─────────────────────────────────────────────────────────────────
  const normalizeRow = (row, deptMap) => {
    const map    = deptMap || departmentMap;
    const deptId = row?.department?.id || "";

    const deptName =
      row?.department?.departmentName?.name ||
      row?.department?.name ||
      (deptId && map[deptId]) || "-";

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
    if (!window.confirm("Are you sure you want to delete this privilege set?")) return;
    try {
      await DELETE(`entity-service/staffPrivilege/${id}`);
      SuccessToaster("Deleted successfully");
      setRefetchTrigger(n => n + 1);
    } catch (e) {
      ErrorToaster("Delete failed");
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
            onCloseLevel2={() => handleCloseDialog(false)}
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

              <div className={style.applicantTableContainer}>
                {isLoading ? (
                  <div style={{ padding:40, textAlign:"center", color:"#888", fontSize:14 }}>
                    Loading privilege sets...
                  </div>
                ) : (
                  <table className={style.applicantTable}>
                    <thead>
                      <tr className={style.applicantHeader}>
                        {COLS.map((col, i) => (
                          <th key={i}
                            className={i === 0 ? style.firstColumn : style.centerAligned}>
                            {col.head}
                          </th>
                        ))}
                        <th />
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
                                }>
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
                            <td className={style.actions}>
                              <img src={EditHcFolder} alt="Edit"
                                className={style.actionIcon}
                                onClick={() => handleOpenEdit(row)} />
                              <img src={DeleteHcFolder} alt="Delete"
                                className={style.actionIcon}
                                onClick={() => handleDelete(row.id)} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div style={{ display:"flex", justifyContent:"flex-end", gap:12, marginTop:20 }}>
                <button onClick={handleSaveInProgress}
                  style={{ backgroundColor:"#fff", color:"#06617A",
                    border:"1px solid #06617A", borderRadius:6,
                    padding:"10px 24px", fontSize:14, fontWeight:600,
                    cursor:"pointer", letterSpacing:"0.5px" }}>
                  SAVE IN-PROGRESS
                </button>
                <button onClick={handleMarkAsDone}
                  style={{ backgroundColor:"#06617A", color:"#fff",
                    border:"none", borderRadius:6,
                    padding:"10px 24px", fontSize:14, fontWeight:600,
                    cursor:"pointer", letterSpacing:"0.5px" }}>
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
          departmentMap={departmentMap}
        />
      )}
    </Fragment>
  );
};

export default StaffPrivileges;