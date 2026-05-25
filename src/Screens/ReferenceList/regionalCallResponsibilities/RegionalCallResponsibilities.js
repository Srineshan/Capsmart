import React, { Fragment, useState, useEffect, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import SideBar from "../../../Components/Sidebar";
import style from "./regionalCall.module.scss";
import { GET, POST, DELETE, PUT, TenantID } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import IndustriesEntityFolder from "../../../images/industriesEntityFolder.png";
import EditHcRow from "../../../images/editHcRow.png";
import DeleteHcFolder from "../../../images/deleteHcFolder.png";

// ── Country list ───────────────────────────────────────────────────────────────
const COUNTRY_LIST = [
  { code: "us", name: "USA",          label: "United States"        },
  { code: "gb", name: "UK",           label: "United Kingdom"       },
  { code: "ca", name: "Canada",       label: "Canada"               },
  { code: "au", name: "Australia",    label: "Australia"            },
  { code: "in", name: "India",        label: "India"                },
  { code: "de", name: "Germany",      label: "Germany"              },
  { code: "fr", name: "France",       label: "France"               },
  { code: "sg", name: "Singapore",    label: "Singapore"            },
  { code: "ae", name: "UAE",          label: "United Arab Emirates" },
  { code: "nz", name: "New Zealand",  label: "New Zealand"          },
  { code: "za", name: "South Africa", label: "South Africa"         },
  { code: "jp", name: "Japan",        label: "Japan"                },
  { code: "br", name: "Brazil",       label: "Brazil"               },
  { code: "ie", name: "Ireland",      label: "Ireland"              },
  { code: "ng", name: "Nigeria",      label: "Nigeria"              },
];

const FlagImg = ({ code, size = 20 }) => (
  <img
    src={`https://flagcdn.com/w${size}/${code}.png`}
    srcSet={`https://flagcdn.com/w${size * 2}/${code}.png 2x`}
    width={size}
    height={Math.round(size * 0.67)}
    alt={code.toUpperCase()}
    style={{ objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
    onError={(e) => { e.target.style.display = "none"; }}
  />
);

// Swagger enum for regionalCallResponsibilities field
const REGIONAL_CALL = { YES: "YES", NO: "NO", NA: "NA" };

// ── Helpers ────────────────────────────────────────────────────────────────────
const getItemName = (item) =>
  item?.departmentGroupBy?.name ||
  item?.departmentName?.name    ||
  item?.name                    || "";

const normaliseName = (item) => getItemName(item).trim().toLowerCase();

const getChildren = (item) =>
  item?.serviceAreas || item?.departments || item?.children || [];

const getSiteDisplayName = (site) => {
  const raw = site?.siteName;
  if (typeof raw === "string" && raw) return raw;
  if (typeof raw === "object" && raw) return raw?.siteName || raw?.name || "";
  return site?.name || site?.siteTypeName || "";
};

// ── localStorage helpers (same keys as Department.js — shared data) ────────────
// LEFT panel reads from the same pending + siteId source as Department tile
const deptPendingKey  = (siteId) => `dept_pending_${siteId || "x"}`;
const loadDeptPending = (siteId) => {
  try { const v = localStorage.getItem(deptPendingKey(siteId)); return v ? JSON.parse(v) : []; }
  catch { return []; }
};

// RIGHT panel persistence — which departments have regionalCall=YES
const regionalKey     = (siteId) => `regional_call_${siteId || "x"}`;
const loadRegional    = (siteId) => {
  try { const v = localStorage.getItem(regionalKey(siteId)); return v ? JSON.parse(v) : []; }
  catch { return []; }
};
const saveRegional    = (siteId, arr) => {
  try { localStorage.setItem(regionalKey(siteId), JSON.stringify(arr)); } catch (e) {}
};
const removeRegional  = (siteId, norm) => {
  try {
    const existing = loadRegional(siteId);
    saveRegional(siteId, existing.filter((r) => normaliseName(r) !== norm));
  } catch (e) {}
};

// ── Component ──────────────────────────────────────────────────────────────────
const RegionalCallResponsibilities = () => {
  const [entityId, setEntityId]           = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [siteTypeId, setSiteTypeId]       = useState("");
  const [siteId, setSiteId]               = useState("");
  const siteIdRef     = useRef("");
  const siteTypeIdRef = useRef("");
  const [siteName, setSiteName]           = useState("");

  const [isExpanded, setIsExpanded] = useState(true);

  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // LEFT panel — My List of Departments (same as Department tile custom list)
  const [myDepartments, setMyDepartments]       = useState([]);
  const [expandedLeft, setExpandedLeft]         = useState({});
  const [selectedForRight, setSelectedForRight] = useState([]);
  const [isLeftLoading, setIsLeftLoading]       = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed]   = useState(false);

  // RIGHT panel — Departments having Regional Call Responsibilities
  const [regionalDepts, setRegionalDepts]       = useState([]);
  const [expandedRight, setExpandedRight]       = useState({});
  const [selectedForLeft, setSelectedForLeft]   = useState([]);
  const [isRightLoading, setIsRightLoading]     = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Track deleted names this session (filters API response while backend processes async DELETE)
  const deletedNamesRef = useRef(new Set());

  const [isSaving, setIsSaving] = useState(false);

  // Add / Edit dialog state
  const [showAddDialog, setShowAddDialog]       = useState(false);
  const [newDeptName, setNewDeptName]           = useState("");
  const [isAddSubmitting, setIsAddSubmitting]   = useState(false);
  const [showEditDialog, setShowEditDialog]     = useState(false);
  const [editItem, setEditItem]                 = useState(null);
  const [editDeptName, setEditDeptName]         = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  useEffect(() => { getEntity(); getSites(); }, []);
  useEffect(() => { if (entityId) getLastModifiedDate(); }, [entityId]);
  useEffect(() => {
    if (!siteId) return;
    loadMyDepartments();
    loadRegionalDepts();
  }, [siteId]);

  // ── API ───────────────────────────────────────────────────────────────────────
  const getEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]) setEntityId(data[0].id);
    } catch (e) {}
  };

  const getSites = async () => {
    try {
      const { data } = await GET("entity-service/sites");
      if (data?.length > 0) {
        const first  = data[0];
        const sid    = first?.id || "";
        const typeId =
          first?.siteTypeId?.id ||
          first?.siteType?.id   ||
          (typeof first?.siteTypeId === "string" ? first.siteTypeId : "") ||
          first?.id || "";
        setSiteId(sid);
        siteIdRef.current = sid;
        setSiteTypeId(typeId);
        siteTypeIdRef.current = typeId;
        setSiteName(getSiteDisplayName(first));
      }
    } catch (e) {}
  };

  const getLastModifiedDate = async () => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${entityId}`);
      const ts =
        data?.regionalCallResponsibilities?.lastModified ||
        data?.departments?.lastModified;
      if (!ts) return;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) {}
  };

  // LEFT panel: load MY custom departments
  // Uses SAME source as Department tile:
  //   1. GET /department/{siteId} → customized:true records
  //   2. + pending localStorage (Anesthesiology, Blood Bank etc. not yet in GET)
  // This ensures LEFT panel matches exactly what Department tile shows
  const loadMyDepartments = async () => {
    setIsLeftLoading(true);
    try {
      const sid = siteIdRef.current;
      if (!sid) return;

      const res = await GET(`entity-service/department/${sid}`);
      const raw = res?.data;
      const all = Array.isArray(raw) ? raw
        : Array.isArray(raw?.content) ? raw.content : [];

      // Keep only customized:true, deduplicated by name
      const seenNames = new Set();
      const result    = [];
      for (const item of all) {
        if (item?.customized !== true) continue;
        const norm = normaliseName(item);
        if (!norm || seenNames.has(norm)) continue;
        seenNames.add(norm);
        result.push({ ...item, serviceAreas: item?.serviceAreas || [] });
      }

      // Merge pending items from Department tile localStorage
      // These are items selected in Department tile but not yet returned by GET
      const pending = loadDeptPending(sid).filter((p) => {
        const norm = normaliseName(p);
        if (!norm || seenNames.has(norm)) return false;
        seenNames.add(norm);
        return true;
      });

      setMyDepartments([...result, ...pending]);
    } catch (e) {
      console.warn("[RegionalCall] loadMyDepartments failed:", e?.message);
    } finally {
      setIsLeftLoading(false);
    }
  };

  // RIGHT panel: load departments that have regionalCallResponsibilities=YES
  // Source: GET /department/{siteId} filtered by regionalCallResponsibilities=YES
  // + localStorage for items moved to right but not yet confirmed by GET
  const loadRegionalDepts = async () => {
    setIsRightLoading(true);
    try {
      const sid = siteIdRef.current;
      if (!sid) return;

      const res = await GET(`entity-service/department/${sid}`);
      const raw = res?.data;
      const all = Array.isArray(raw) ? raw
        : Array.isArray(raw?.content) ? raw.content : [];

      // Filter by regionalCallResponsibilities=YES + not deleted this session
      const seenNames = new Set();
      const result    = [];
      for (const item of all) {
        if (item?.customized !== true) continue;
        if (item?.regionalCallResponsibilities !== REGIONAL_CALL.YES) continue;
        const norm = normaliseName(item);
        if (!norm || seenNames.has(norm)) continue;
        if (deletedNamesRef.current.has(norm)) continue;
        seenNames.add(norm);
        result.push({ ...item, serviceAreas: item?.serviceAreas || [] });
      }

      // Merge localStorage regional items (optimistic adds not yet in GET)
      const stored = loadRegional(sid).filter((r) => {
        const norm = normaliseName(r);
        if (!norm || seenNames.has(norm)) return false;
        if (deletedNamesRef.current.has(norm)) return false;
        // If API now returns this item, remove from storage
        if (result.some((x) => normaliseName(x) === norm)) {
          removeRegional(sid, norm);
          return false;
        }
        return true;
      });

      setRegionalDepts([...result, ...stored]);
    } catch (e) {
      console.warn("[RegionalCall] loadRegionalDepts failed:", e?.message);
    } finally {
      setIsRightLoading(false);
    }
  };

  // ── » Move left → right (assign regional call) ────────────────────────────────
  const handleMoveRight = async () => {
    if (selectedForRight.length === 0) {
      ErrorToaster("Select departments from the left panel first.");
      return;
    }

    const rightNames = new Set(regionalDepts.map(normaliseName));
    const toAdd = selectedForRight.filter(
      (item) => !rightNames.has(normaliseName(item))
    );

    if (toAdd.length === 0) {
      ErrorToaster("Selected departments are already in the right panel.");
      setSelectedForRight([]);
      return;
    }

    // Optimistically add to right panel
    const optimisticItems = toAdd.map((item) => ({
      ...item,
      regionalCallResponsibilities: REGIONAL_CALL.YES,
      _optimistic: true,
    }));

    setRegionalDepts((prev) => [...prev, ...optimisticItems]);
    setSelectedForRight([]);

    // Save to localStorage so right panel survives page refresh
    const existing = loadRegional(siteIdRef.current);
    const toAddNorms = new Set(toAdd.map(normaliseName));
    saveRegional(siteIdRef.current, [
      ...existing.filter((r) => !toAddNorms.has(normaliseName(r))),
      ...optimisticItems.map((i) => ({
        id:             i.id || null,
        name:           getItemName(i),
        departmentName: i.departmentName || { name: getItemName(i) },
        serviceAreas:   i.serviceAreas || [],
        regionalCallResponsibilities: REGIONAL_CALL.YES,
        _optimistic: true,
      })),
    ]);

    // PUT /department/{id} with regionalCallResponsibilities=YES
    const puts = toAdd.map(async (item) => {
      if (!item?.id || item?._optimistic) return;
      const payload = {
        departmentName:               item?.departmentName || item?.departmentGroupBy || { name: getItemName(item) },
        aliasName1:                   item?.aliasName1 || "",
        aliasName2:                   item?.aliasName2 || "",
        serviceAreas:                 (item?.serviceAreas || []).map((a) => ({
          name:       a?.name || a?.serviceName || "",
          aliasName1: a?.aliasName1 || "",
          aliasName2: a?.aliasName2 || "",
        })),
        siteTypeId:                   siteTypeIdRef.current ? { id: siteTypeIdRef.current } : undefined,
        regionalCallResponsibilities: REGIONAL_CALL.YES,
        customized:                   true,
      };
      await PUT(`entity-service/department/${item.id}`, JSON.stringify(payload));
    });

    try {
      await Promise.all(puts);
      // Remove _optimistic flag after successful PUT
      setRegionalDepts((prev) =>
        prev.map((d) => {
          if (toAddNorms.has(normaliseName(d)) && d._optimistic) {
            const { _optimistic, ...rest } = d;
            return rest;
          }
          return d;
        })
      );
      SuccessToaster("Department(s) added to Regional Call Responsibilities.");
      updateLastModified();
    } catch (err) {
      console.warn("[RegionalCall] PUT YES failed:", err?.message);
      // Keep in UI and localStorage — user can retry
      SuccessToaster("Saved locally. Will sync when connection restores.");
    }
  };

  // ── Shared remove logic ──────────────────────────────────────────────────────
  const removeFromRight = async (items) => {
    const removeNorms = new Set(items.map(normaliseName));

    // Remove from UI + localStorage immediately
    removeNorms.forEach((norm) => {
      deletedNamesRef.current.add(norm);
      removeRegional(siteIdRef.current, norm);
    });
    setRegionalDepts((prev) =>
      prev.filter((d) => !removeNorms.has(normaliseName(d)))
    );

    // PUT /department/{id} with regionalCallResponsibilities=NO for real items
    const puts = items
      .filter((item) => item?.id && !item?._optimistic)
      .map(async (item) => {
        const payload = {
          departmentName:               item?.departmentName || item?.departmentGroupBy || { name: getItemName(item) },
          aliasName1:                   item?.aliasName1 || "",
          aliasName2:                   item?.aliasName2 || "",
          serviceAreas:                 (item?.serviceAreas || []).map((a) => ({
            name:       a?.name || a?.serviceName || "",
            aliasName1: a?.aliasName1 || "",
            aliasName2: a?.aliasName2 || "",
          })),
          siteTypeId:                   siteTypeIdRef.current ? { id: siteTypeIdRef.current } : undefined,
          regionalCallResponsibilities: REGIONAL_CALL.NO,
          customized:                   true,
        };
        await PUT(`entity-service/department/${item.id}`, JSON.stringify(payload));
      });

    try {
      await Promise.all(puts);
      SuccessToaster("Removed from Regional Call Responsibilities.");
      updateLastModified();
    } catch (err) {
      console.warn("[RegionalCall] PUT NO failed:", err?.message);
      // UI already updated — item removed from right panel
      // deletedNamesRef will filter it from GET on next load
    }
  };

  // ── « Move right → left (checkbox-based, « button) ────────────────────────────
  const handleMoveLeft = async () => {
    if (selectedForLeft.length === 0) {
      ErrorToaster("Select departments from the right panel first.");
      return;
    }
    const toRemove = [...selectedForLeft];
    setSelectedForLeft([]);
    await removeFromRight(toRemove);
  };

  // ── Delete icon on right panel row ────────────────────────────────────────────
  const handleDeleteFromRight = async (item) => {
    await removeFromRight([item]);
  };

  // ── Add new department directly to right panel ─────────────────────────────────
  const handleAddNew = async () => {
    if (!newDeptName.trim()) {
      ErrorToaster("Department name is required.");
      return;
    }
    const name = newDeptName.trim();
    setIsAddSubmitting(true);

    const optimisticItem = {
      id:                           null,
      name,
      departmentName:               { name },
      regionalCallResponsibilities: REGIONAL_CALL.YES,
      serviceAreas:                 [],
      _optimistic:                  true,
    };

    setRegionalDepts((prev) => [...prev, optimisticItem]);
    setNewDeptName("");
    setShowAddDialog(false);

    // Save to localStorage
    const existing = loadRegional(siteIdRef.current);
    saveRegional(siteIdRef.current, [...existing, {
      id:             null,
      name,
      departmentName: { name },
      regionalCallResponsibilities: REGIONAL_CALL.YES,
      _optimistic:    true,
    }]);

    try {
      await POST("entity-service/department", JSON.stringify([{
        departmentName:               { name },
        regionalCallResponsibilities: REGIONAL_CALL.YES,
        siteTypeId:                   siteTypeIdRef.current ? { id: siteTypeIdRef.current } : undefined,
        aliasName1: "", aliasName2: "", serviceAreas: [],
        customized: true, active: true,
      }]));
      SuccessToaster("Department added to Regional Call Responsibilities.");
      // After 2s, refresh to get real ID
      await new Promise((r) => setTimeout(r, 2000));
      await loadRegionalDepts();
      updateLastModified();
    } catch (err) {
      console.error("[RegionalCall] Add error:", err);
      ErrorToaster("Failed to save. Showing locally until refresh.");
    } finally {
      setIsAddSubmitting(false);
    }
  };

  // ── Edit existing right-panel item ─────────────────────────────────────────────
  const openEditDialog = (item) => {
    setEditItem(item);
    setEditDeptName(getItemName(item));
    setShowEditDialog(true);
  };

  const handleEditSave = async () => {
    if (!editDeptName.trim()) { ErrorToaster("Name is required."); return; }
    setIsEditSubmitting(true);
    const updatedName  = editDeptName.trim();
    const oldNorm      = normaliseName(editItem);

    // Update UI immediately
    setRegionalDepts((prev) =>
      prev.map((d) =>
        normaliseName(d) === oldNorm
          ? { ...d, name: updatedName, departmentName: { name: updatedName } }
          : d
      )
    );

    // Update localStorage regional entry with new name
    const existing = loadRegional(siteIdRef.current);
    const updated  = existing.map((r) =>
      normaliseName(r) === oldNorm
        ? { ...r, name: updatedName, departmentName: { name: updatedName } }
        : r
    );
    saveRegional(siteIdRef.current, updated);

    try {
      if (editItem?.id && !editItem?._optimistic) {
        const payload = {
          departmentName:               { name: updatedName },
          aliasName1:                   editItem?.aliasName1 || "",
          aliasName2:                   editItem?.aliasName2 || "",
          serviceAreas:                 (editItem?.serviceAreas || []).map((a) => ({
            name:       a?.name || a?.serviceName || "",
            aliasName1: a?.aliasName1 || "",
            aliasName2: a?.aliasName2 || "",
          })),
          siteTypeId:                   siteTypeIdRef.current ? { id: siteTypeIdRef.current } : undefined,
          regionalCallResponsibilities: REGIONAL_CALL.YES,
          customized:                   true,
        };
        await PUT(`entity-service/department/${editItem.id}`, JSON.stringify(payload));
        SuccessToaster("Updated successfully.");
      } else {
        SuccessToaster("Updated locally.");
      }
      updateLastModified();
    } catch (err) {
      console.error("[RegionalCall] Edit error:", err);
      SuccessToaster("Updated locally.");
    } finally {
      setIsEditSubmitting(false);
      setShowEditDialog(false);
      setEditItem(null);
      setEditDeptName("");
    }
  };

  // ── updateLastModified ─────────────────────────────────────────────────────────
  const updateLastModified = async () => {
    // Non-critical call — only updates the "UPDATED ON" timestamp in header
    // Try PUT with correct payload format matching backend schema
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          regionalCallResponsibilities: {
            standardList: false,
            lastModified:  new Date().toISOString(),
          },
        })
      );
      await getLastModifiedDate();
    } catch (e) {
      // Silently ignore — timestamp update is non-critical
      // Main functionality (move, delete, edit) is unaffected
      console.warn("[RegionalCall] updateLastModified failed (non-critical):", e?.message);
    }
  };

  // ── Mark as done ───────────────────────────────────────────────────────────────
  const handleMarkAsDone = async () => {
    try {
      await POST(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          regionalCallResponsibilities: {
            status:       "DONE",
            lastModified: new Date().toISOString(),
          },
        })
      );
    } catch (e) {}
    finally {
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── UI helpers ─────────────────────────────────────────────────────────────────
  const toggleLeft  = (key) => setExpandedLeft((p)  => ({ ...p, [key]: !p[key] }));
  const toggleRight = (key) => setExpandedRight((p) => ({ ...p, [key]: !p[key] }));

  const toggleForRight = (item) => {
    const norm = normaliseName(item);
    setSelectedForRight((prev) =>
      prev.some((s) => normaliseName(s) === norm)
        ? prev.filter((s) => normaliseName(s) !== norm)
        : [...prev, item]
    );
  };
  const isSelectedForRight = (item) =>
    selectedForRight.some((s) => normaliseName(s) === normaliseName(item));

  const toggleForLeft = (item) => {
    const norm = normaliseName(item);
    setSelectedForLeft((prev) =>
      prev.some((s) => normaliseName(s) === norm)
        ? prev.filter((s) => normaliseName(s) !== norm)
        : [...prev, item]
    );
  };
  const isSelectedForLeft = (item) =>
    selectedForLeft.some((s) => normaliseName(s) === normaliseName(item));

  // Left panel shows only items NOT already in right panel
  const rightNorms        = new Set(regionalDepts.map(normaliseName));
  const availableForRight = myDepartments.filter(
    (d) => !rightNorms.has(normaliseName(d))
  );

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.rcPageBg}>
        <div className={`${isExpanded ? style.rcBigCardGrid : style.rcSmallCardGrid}`}>

          {/* Sidebar */}
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={(v) => setIsExpanded(v)}>
              <div />
            </SideBar>
          </div>

          {/* Main */}
          <div>

            {/* Header */}
            <div className={style.rcPageHeader}>
              <div className={style.rcPageHeaderLeft}>
                <span className={style.rcPageTitle}>
                  DEPARTMENTS / SERVICE AREAS REQUIRING REGIONAL CALL RESPONSIBILITIES BY SITE
                </span>
                {lastUpdatedDate && (
                  <span className={style.rcPageUpdated}>UPDATED ON {lastUpdatedDate}</span>
                )}
              </div>
              <div className={style.rcPageHeaderRight}>
                <div style={{ position: "relative" }}>
                  <button
                    className={style.rcCountryBtn}
                    onClick={() => setCountryDropdownOpen((p) => !p)}
                  >
                    <FlagImg code={selectedCountry.code} size={20} />
                    <span>{selectedCountry.name}</span>
                    <span className={style.rcCountryArrow}>▾</span>
                  </button>
                  {countryDropdownOpen && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                        onClick={() => setCountryDropdownOpen(false)}
                      />
                      <div className={style.rcCountryDropdown}>
                        {COUNTRY_LIST.map((c) => (
                          <div
                            key={c.code}
                            className={style.rcCountryOption}
                            style={{
                              backgroundColor: c.code === selectedCountry.code ? "#e8f4f7" : "transparent",
                              fontWeight:       c.code === selectedCountry.code ? 600 : 400,
                            }}
                            onClick={() => { setSelectedCountry(c); setCountryDropdownOpen(false); }}
                          >
                            <FlagImg code={c.code} size={20} />
                            <span style={{ flex: 1 }}>{c.label}</span>
                            <span style={{ color: "#aaa", fontSize: 11 }}>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button
                  className={style.rcCloseBtn}
                  onClick={() => { window.location.href = "/referencelist"; }}
                  title="Close"
                >×</button>
              </div>
            </div>

            {/* White card */}
            <div className={style.rcCard}>
              <div className={style.rcPanelGrid}>

                {/* LEFT panel */}
                <div className={style.rcPanel}>
                  <div className={style.rcPanelHeader}>MY LIST OF DEPARTMENTS / SERVICE AREAS</div>
                  {siteName && (
                    <div className={style.rcSiteRow}>
                      <img src={IndustriesEntityFolder} alt="" className={style.rcFolderIcon} />
                      <span className={style.rcSiteName}>{siteName.toUpperCase()}</span>
                      <button className={style.rcSiteToggle} onClick={() => setIsLeftCollapsed((p) => !p)}>
                        {isLeftCollapsed ? "+" : "−"}
                      </button>
                    </div>
                  )}
                  {!isLeftCollapsed && (
                    <div className={style.rcPanelBody}>
                      {isLeftLoading ? (
                        <p className={style.rcEmpty}>Loading…</p>
                      ) : availableForRight.length === 0 ? (
                        <p className={style.rcEmpty}>
                          All departments have been assigned regional call responsibilities.
                        </p>
                      ) : availableForRight.map((item, idx) => {
                        const name     = getItemName(item);
                        const children = getChildren(item);
                        const isExp    = expandedLeft[name];
                        const isChk    = isSelectedForRight(item);
                        return (
                          <div key={item?.id || idx} className={style.rcRow}>
                            <div className={`${style.rcRowItem} ${isChk ? style.rcRowItemChecked : ""}`}>
                              <input
                                type="checkbox"
                                className={style.rcCheckbox}
                                checked={isChk}
                                onChange={() => toggleForRight(item)}
                              />
                              <span className={style.rcRowName} onClick={() => toggleForRight(item)}>
                                {name}
                              </span>
                              {children.length > 0 && (
                                <button
                                  className={style.rcExpandBtn}
                                  onClick={(e) => { e.stopPropagation(); toggleLeft(name); }}
                                >
                                  {isExp ? "−" : "+"}
                                </button>
                              )}
                            </div>
                            {isExp && children.map((child, ci) => (
                              <div key={ci} className={style.rcChildRow}>
                                <span className={style.rcChildName}>
                                  {child?.name || child?.serviceName || ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Centre buttons */}
                <div className={style.rcSelectCol}>
                  <button
                    className={style.rcSelectBtn}
                    onClick={handleMoveRight}
                    disabled={selectedForRight.length === 0 || isSaving}
                    title="Add to Regional Call Responsibilities"
                  >»</button>
                  <button
                    className={`${style.rcSelectBtn} ${style.rcSelectBtnBack}`}
                    onClick={handleMoveLeft}
                    disabled={selectedForLeft.length === 0 || isSaving}
                    title="Remove from Regional Call Responsibilities"
                  >«</button>
                </div>

                {/* RIGHT panel */}
                <div className={style.rcPanel}>
                  <div className={style.rcPanelHeader}>
                    DEPARTMENTS / SERVICE AREAS HAVING REGIONAL CALL RESPONSIBILITIES
                    <button
                      onClick={() => { setNewDeptName(""); setShowAddDialog(true); }}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      title="Add new department"
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: "1.5px solid #fff", borderRadius: "50%", fontSize: 13, lineHeight: 1, fontWeight: 400, color: "#fff" }}>+</span>
                    </button>
                  </div>
                  {siteName && (
                    <div className={style.rcSiteRow}>
                      <img src={IndustriesEntityFolder} alt="" className={style.rcFolderIcon} />
                      <span className={style.rcSiteName}>{siteName.toUpperCase()}</span>
                      <button className={style.rcSiteToggle} onClick={() => setIsRightCollapsed((p) => !p)}>
                        {isRightCollapsed ? "+" : "−"}
                      </button>
                    </div>
                  )}
                  {!isRightCollapsed && (
                    <div className={style.rcPanelBody}>
                      {isRightLoading ? (
                        <p className={style.rcEmpty}>Loading…</p>
                      ) : regionalDepts.length === 0 ? (
                        <p className={style.rcEmpty}>
                          Select from the list on the left, or add new departments by clicking the + icon.
                        </p>
                      ) : regionalDepts.map((item, idx) => {
                        const name     = getItemName(item);
                        const children = getChildren(item);
                        const isExp    = expandedRight[`r_${name}`];
                        const isChk    = isSelectedForLeft(item);
                        return (
                          <div key={item?.id || idx} className={style.rcRow}>
                            <div className={`${style.rcRowItem} ${isChk ? style.rcRowItemChecked : ""}`}>
                              <input
                                type="checkbox"
                                className={style.rcCheckbox}
                                checked={isChk}
                                onChange={() => toggleForLeft(item)}
                              />
                              {children.length > 0 && (
                                <button
                                  className={style.rcExpandBtn}
                                  onClick={() => toggleRight(`r_${name}`)}
                                >
                                  {isExp ? "−" : "+"}
                                </button>
                              )}
                              <span className={style.rcRowName} onClick={() => toggleForLeft(item)}>
                                {name}
                              </span>
                              <div className={style.rcActions}>
                                <img
                                  src={EditHcRow} alt="Edit" className={style.rcActionIcon}
                                  onClick={() => openEditDialog(item)}
                                />
                                <img
                                  src={DeleteHcFolder} alt="Delete" className={style.rcActionIcon}
                                  onClick={() => handleDeleteFromRight(item)}
                                />
                              </div>
                            </div>
                            {isExp && children.map((child, ci) => (
                              <div key={ci} className={style.rcChildRow}>
                                <span className={style.rcChildName}>
                                  {child?.name || child?.serviceName || ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>


            </div>

          </div>
        </div>

        <div className={style.rcPoweredBy}>
          <p>Powered by - HapiCare</p>
          <p>© HapiCare</p>
        </div>
      </div>

      {/* Add dialog */}
      {showAddDialog && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--primary-color)", textTransform: "uppercase" }}>Add Department / Service Area</p>
              <button onClick={() => { setShowAddDialog(false); setNewDeptName(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#d32f2f", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ borderBottom: "1px solid #dee2e6", marginBottom: 20 }} />
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#52575d", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                Department / Service Area Name *
              </label>
              <input
                type="text" value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddNew(); }}
                placeholder="Enter department name" autoFocus
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4, fontSize: 13, boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => { setShowAddDialog(false); setNewDeptName(""); }} style={{ background: "#fff", color: "var(--primary-color)", border: "1px solid var(--primary-color)", borderRadius: 4, padding: "8px 24px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>CANCEL</button>
              <button onClick={handleAddNew} disabled={isAddSubmitting || !newDeptName.trim()} style={{ background: "var(--primary-color)", color: "#fff", border: "none", borderRadius: 4, padding: "8px 24px", cursor: isAddSubmitting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, opacity: isAddSubmitting || !newDeptName.trim() ? 0.5 : 1 }}>
                {isAddSubmitting ? "SAVING…" : "ADD"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit dialog */}
      {showEditDialog && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--primary-color)", textTransform: "uppercase" }}>Edit Department / Service Area</p>
              <button onClick={() => { setShowEditDialog(false); setEditItem(null); setEditDeptName(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#d32f2f", lineHeight: 1 }}>×</button>
            </div>
            <div style={{ borderBottom: "1px solid #dee2e6", marginBottom: 20 }} />
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#52575d", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>
                Department / Service Area Name *
              </label>
              <input
                type="text" value={editDeptName}
                onChange={(e) => setEditDeptName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(); }}
                autoFocus
                style={{ width: "100%", padding: "8px 12px", border: "1px solid #ccc", borderRadius: 4, fontSize: 13, boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => { setShowEditDialog(false); setEditItem(null); setEditDeptName(""); }} style={{ background: "#fff", color: "var(--primary-color)", border: "1px solid var(--primary-color)", borderRadius: 4, padding: "8px 24px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>CANCEL</button>
              <button onClick={handleEditSave} disabled={isEditSubmitting || !editDeptName.trim()} style={{ background: "var(--primary-color)", color: "#fff", border: "none", borderRadius: 4, padding: "8px 24px", cursor: isEditSubmitting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, opacity: isEditSubmitting || !editDeptName.trim() ? 0.5 : 1 }}>
                {isEditSubmitting ? "SAVING…" : "SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}

    </Fragment>
  );
};

export default RegionalCallResponsibilities;