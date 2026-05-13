import React, { Fragment, useState, useEffect, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import SideBar from "../../../Components/Sidebar";
import style from "./department.module.scss";
import { GET, POST, DELETE, PUT } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import DepartmentDialog from "./DepartmentDialog";
import IndustriesEntityFolder from "../../../images/industriesEntityFolder.png";
import EditHcRow from "../../../images/editHcRow.png";
import DeleteHcFolder from "../../../images/deleteHcFolder.png";

const COUNTRY_LIST = [
  { code: "us", name: "USA",         label: "United States"        },
  { code: "gb", name: "UK",          label: "United Kingdom"       },
  { code: "ca", name: "Canada",      label: "Canada"               },
  { code: "au", name: "Australia",   label: "Australia"            },
  { code: "in", name: "India",       label: "India"                },
  { code: "de", name: "Germany",     label: "Germany"              },
  { code: "fr", name: "France",      label: "France"               },
  { code: "sg", name: "Singapore",   label: "Singapore"            },
  { code: "ae", name: "UAE",         label: "United Arab Emirates" },
  { code: "nz", name: "New Zealand", label: "New Zealand"          },
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

// ─────────────────────────────────────────────────────────────────────────────
// KEY FIX: Whitelist is keyed by NORMALISED DEPARTMENT NAME (not by backend ID)
// because the same department (e.g. "Blood Bank") appears in the API response
// with dozens of different IDs across different sites/entities.
// Deleting "Blood Bank" must remove ALL entries with that name, not just one ID.
// ─────────────────────────────────────────────────────────────────────────────

const normaliseName = (item) =>
  (
    item?.departmentGroupBy?.name ||
    item?.departmentName?.name    ||
    item?.name                    ||
    ""
  ).trim().toLowerCase();

const getItemName = (item) =>
  item?.departmentGroupBy?.name ||
  item?.departmentName?.name    ||
  item?.name                    || "";

const getChildren = (item) =>
  item?.serviceAreas || item?.departments || item?.children || [];

const getSiteDisplayName = (site) => {
  const raw = site?.siteName;
  if (typeof raw === "string" && raw) return raw;
  if (typeof raw === "object" && raw) return raw?.siteName || raw?.name || "";
  return site?.name || site?.siteTypeName || "";
};

// ── localStorage helpers (name-keyed whitelist) ───────────────────────────────
const storageKey = (siteTypeId) =>
  `dept_saved_names_${siteTypeId || "default"}`;

const loadWhitelist = (siteTypeId) => {
  try {
    const stored = localStorage.getItem(storageKey(siteTypeId));
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch { return new Set(); }
};

const saveWhitelist = (siteTypeId, nameSet) => {
  try {
    localStorage.setItem(storageKey(siteTypeId), JSON.stringify([...nameSet]));
  } catch (e) { console.warn("[Dept] localStorage write failed:", e); }
};

// ─────────────────────────────────────────────────────────────────────────────

const Departments = () => {
  const [entityId, setEntityId]               = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [siteTypeId, setSiteTypeId]           = useState("");
  const [siteId, setSiteId]                   = useState("");
  const [siteName, setSiteName]               = useState("");

  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const [standardList, setStandardList]                   = useState([]);
  const [expandedStandard, setExpandedStandard]           = useState({});
  const [selectedStandardItems, setSelectedStandardItems] = useState([]);
  const [isStandardCollapsed, setIsStandardCollapsed]     = useState(false);
  const [isStandardLoading, setIsStandardLoading]         = useState(false);

  const [customList, setCustomList]               = useState([]);
  const [expandedCustom, setExpandedCustom]       = useState({});
  const [isCustomCollapsed, setIsCustomCollapsed] = useState(false);
  const [isCustomLoading, setIsCustomLoading]     = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit]             = useState(false);
  const [editData, setEditData]         = useState(null);
  const [isSaving, setIsSaving]         = useState(false);
  const [isExpanded, setIsExpanded]     = useState(true);

  // Name-based whitelist — a Set of normalised department names the user has selected
  const whitelistRef = useRef(new Set());

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  useEffect(() => { getEntity(); getSites(); }, []);
  useEffect(() => { if (entityId) getLastModifiedDate(entityId); }, [entityId]);

  useEffect(() => {
    if (!siteTypeId) return;
    // Load persisted whitelist for this site, then fetch both panels
    whitelistRef.current = loadWhitelist(siteTypeId);
    loadStandardList();
    loadCustomList();
  }, [siteTypeId]);

  // ── Data fetchers ──────────────────────────────────────────────────────────
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
        const first = data[0];
        setSiteId(first?.id || "");
        setSiteName(getSiteDisplayName(first));
        const typeId =
          first?.siteTypeId?.id ||
          first?.siteType?.id   ||
          (typeof first?.siteTypeId === "string" ? first.siteTypeId : "") ||
          first?.id || "";
        setSiteTypeId(typeId);
      }
    } catch (e) {}
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      const ts = data?.departments?.lastModified;
      if (!ts) return;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) {}
  };

  const loadStandardList = async () => {
    setIsStandardLoading(true);
    try {
      let data = [];
      try {
        const res = await GET(`entity-service/departmentMaster/refListView?siteTypeId=${siteTypeId}`);
        data = res?.data || [];
      } catch (e) {}
      if (data.length === 0) {
        try { const res = await GET("entity-service/departmentMaster"); data = res?.data || []; } catch (e) {}
      }
      setStandardList(data);
    } finally { setIsStandardLoading(false); }
  };

  // loadCustomList — shows ALL departments for this site
  // FIX: Removed whitelist filter.
  // GET /department/{siteId} already returns only this hospital's departments.
  // Whitelist was hiding valid records added via backend/old code.
  // Whitelist is now only used to track SELECT flow (prevent duplicates).
  const loadCustomList = async () => {
    setIsCustomLoading(true);
    try {
      let data = [];

      // PRIMARY: GET /department/{siteId} — only this site's depts (~10 records)
      if (siteId) {
        try {
          const res = await GET(`entity-service/department/${siteId}`);
          const raw = res?.data;
          data = Array.isArray(raw) ? raw
            : Array.isArray(raw?.content) ? raw.content : [];
          console.log(`[Dept] /department/${siteId}: ${data.length} records`);
        } catch (e) { console.warn('[Dept] /department/{siteId} failed:', e?.message); }
      }

      // FALLBACK 1: refListView by siteTypeId
      if (data.length === 0) {
        try {
          const res = await GET(`entity-service/department/refListView?siteTypeId=${siteTypeId}&searchText=`);
          const raw = res?.data;
          data = Array.isArray(raw) ? raw
            : Array.isArray(raw?.content) ? raw.content : [];
          console.log(`[Dept] refListView fallback: ${data.length} records`);
        } catch (e) { console.warn('[Dept] refListView failed:', e?.message); }
      }

      // FALLBACK 2: GET /department filtered by siteTypeId
      if (data.length === 0) {
        try {
          const res = await GET('entity-service/department');
          const raw = res?.data;
          const all = Array.isArray(raw) ? raw
            : Array.isArray(raw?.content) ? raw.content : [];
          data = siteTypeId
            ? all.filter((item) => {
                const s = item?.siteTypeId?.id ||
                  (typeof item?.siteTypeId === 'string' ? item.siteTypeId : '');
                return s === siteTypeId;
              })
            : all;
          console.warn(`[Dept] last resort: total=${all.length} filtered=${data.length}`);
        } catch (e) { console.warn('[Dept] fallback failed:', e?.message); }
      }

      if (data.length === 0) {
        console.warn('[Dept] All endpoints returned 0 — keeping local state.');
        return;
      }

      // Deduplicate by name only (API may return same dept with different IDs)
      const seenNames = new Set();
      const result = [];
      for (const item of data) {
        const norm = normaliseName(item);
        if (!norm || seenNames.has(norm)) continue;
        seenNames.add(norm);
        result.push({ ...item, serviceAreas: item?.serviceAreas || [] });
      }

      console.log(`[Dept] showing all ${result.length} site departments`);

      // Sync whitelist so SELECT flow knows what's already in custom list
      result.forEach((item) => {
        const norm = normaliseName(item);
        if (norm) whitelistRef.current.add(norm);
      });
      saveWhitelist(siteTypeId, whitelistRef.current);

      setCustomList(result);
    } finally {
      setIsCustomLoading(false);
    }
  };

  // ── SELECT ─────────────────────────────────────────────────────────────────
  const handleSelect = async () => {
    if (selectedStandardItems.length === 0) return;

    // FIX: Compare by name - standard list IDs differ from custom list IDs
    const existingCustomNames = new Set(customList.map(normaliseName));
    const toAdd = selectedStandardItems.filter(
      (item) => !existingCustomNames.has(normaliseName(item))
    );

    if (toAdd.length === 0) {
      ErrorToaster('Selected department(s) already exist in your custom list.');
      setSelectedStandardItems([]);
      return;
    }

    setIsSaving(true);
    try {
      const payload = toAdd.map((item) => ({
        departmentName: { name: getItemName(item) },
        aliasName1:     item?.aliasName1 || "",
        aliasName2:     item?.aliasName2 || "",
        serviceAreas:   getChildren(item).map((child) => ({
          name:       child?.name || child?.serviceName || "",
          aliasName1: child?.aliasName1 || "",
          aliasName2: child?.aliasName2 || "",
        })),
        // FIX: Use siteId (not siteTypeId) to match GET /department/{siteId}
        // GET uses siteId=66fa... but POST was sending siteTypeId=63ae... (different)
        // Newly added items must be stored under the same siteId used for fetching
        siteTypeId: siteId ? { id: siteId } : undefined,
      }));

      await POST("entity-service/department", JSON.stringify(payload));
      SuccessToaster(`${toAdd.length} department(s) saved successfully.`);

      // Add normalised names to whitelist and persist
      toAdd.forEach((item) => {
        const norm = normaliseName(item);
        if (norm) whitelistRef.current.add(norm);
      });
      saveWhitelist(siteTypeId, whitelistRef.current);

      // FIX 1: Optimistically add to customList immediately
      // Do NOT call loadCustomList() after SELECT because
      // GET /department/{siteId} may not return the newly POSTed item
      // immediately (backend indexing delay or different siteId mapping).
      // The optimistic item stays in the list permanently.
      // On next page load, loadCustomList() will fetch fresh from API.
      const newItems = toAdd.map((item) => ({
        ...item,
        name:         getItemName(item),
        departmentName: { name: getItemName(item) },
        serviceAreas: getChildren(item).map((child) => ({
          name:       child?.name || child?.serviceName || '',
          aliasName1: child?.aliasName1 || '',
          aliasName2: child?.aliasName2 || '',
        })),
        _pending: false,
      }));
      setCustomList((prev) => [...prev, ...newItems]);

      // Now that siteId matches in both POST and GET,
      // refresh from API after short delay to get server-confirmed data
      await new Promise((r) => setTimeout(r, 800));
      await loadCustomList();
    } catch (err) {
      console.error("[Dept] SELECT save error:", err);
      ErrorToaster(err?.message || "Failed to save selected departments.");
    } finally {
      setIsSaving(false);
      setSelectedStandardItems([]);
    }
  };

  // ── DELETE ─────────────────────────────────────────────────────────────────
  const handleDelete = async (item) => {
    const id   = item?.id;
    const name = getItemName(item);
    const norm = normaliseName(item);

    // KEY FIX: Remove the NAME from whitelist — this removes ALL duplicates by name
    if (norm) {
      whitelistRef.current.delete(norm);
      saveWhitelist(siteTypeId, whitelistRef.current);
    }

    // Optimistically remove from UI by name (catches all duplicates in local state too)
    setCustomList((prev) =>
      prev.filter((c) => normaliseName(c) !== norm)
    );

    if (!id) {
      SuccessToaster("Department removed.");
      return;
    }

    // FIX 2: Use DELETE endpoint (Swagger: DELETE /department/{id})
    // not PUT with deleted:true, because soft-delete via PUT means
    // GET /department/{siteId} still returns the item on next load.
    // Hard DELETE removes it permanently so it reappears in standard list.
    try {
      await DELETE(`entity-service/department/${id}`);
      console.log("[Dept] DELETE success for id:", id);
      SuccessToaster("Department removed.");
      // Item already removed from customList optimistically above.
      // filteredStandard will now auto-show it back in standard list
      // because customList no longer contains it.
    } catch (putErr) {
      console.warn("[Dept] DELETE failed, trying PUT soft-delete:", putErr?.message);
      // Fallback: soft delete via PUT
      try {
        const payload = {
          departmentName: { name },
          aliasName1:     item?.aliasName1 || "",
          aliasName2:     item?.aliasName2 || "",
          serviceAreas:   [],
          deleted:        true,
          active:         false,
        };
        await PUT(`entity-service/department/${id}`, JSON.stringify(payload));
        SuccessToaster("Department removed.");
      } catch (err2) {
        console.warn("[Dept] soft-delete also failed:", err2?.message);
        // Restore whitelist and UI on total failure
        if (norm) {
          whitelistRef.current.add(norm);
          saveWhitelist(siteTypeId, whitelistRef.current);
        }
        setCustomList((prev) => [...prev, item]);
        ErrorToaster("Could not delete department. Please try again.");
      }
    }
  };

  // ── Dialog close handler ───────────────────────────────────────────────────
  // DepartmentDialog calls:
  //   ADD  → handleClose(true, newItem)     — new item object
  //   EDIT → handleClose(true, updatedItem) — updated item object (with id)
  //   CANCEL → handleClose(false, null)
  const handleDialogClose = async (needRefetch, newItem) => {
    setIsDialogOpen(false);

    if (needRefetch) {
      const hasId = !!(newItem?.id || editData?.id);
      const wasEdit = isEdit && hasId;

      if (wasEdit) {
        // ── EDIT flow ────────────────────────────────────────────────────
        // ✅ FIX: Use updatedItem from dialog to update local state immediately.
        // Do NOT call loadCustomList() — API loses serviceAreas in response.
        // Old: await loadCustomList() → API had no serviceAreas → empty ❌
        // New: update local state with newItem.serviceAreas directly ✅
        if (newItem) {
          const norm = normaliseName(newItem);
          setCustomList((prev) =>
            prev.map((c) =>
              normaliseName(c) === norm
                ? {
                    ...c,
                    name:           newItem.departmentName?.name || newItem.name || c.name,
                    departmentName: newItem.departmentName || c.departmentName,
                    aliasName1:     newItem.aliasName1 ?? c.aliasName1,
                    aliasName2:     newItem.aliasName2 ?? c.aliasName2,
                    serviceAreas:   newItem.serviceAreas?.length > 0
                      ? newItem.serviceAreas   // ✅ what user just typed
                      : c.serviceAreas || [],
                  }
                : c
            )
          );
        }
      } else if (newItem) {
        // ── ADD flow ──────────────────────────────────────────────────────
        // 1. Optimistically show it in the UI immediately
        const norm = normaliseName(newItem);
        const name = newItem?.departmentName?.name || newItem?.name || "";

        if (norm) {
          whitelistRef.current.add(norm);
          saveWhitelist(siteTypeId, whitelistRef.current);
        }

        const alreadyExists = customList.some((c) => normaliseName(c) === norm);
        if (!alreadyExists && name) {
          setCustomList((prev) => [...prev, { ...newItem }]);
        }

        // 2. Wait briefly then refresh from API
        await new Promise((r) => setTimeout(r, 600));
        try {
          await loadCustomList();
          setCustomList((prev) => {
            const foundNew = prev.some((r) => normaliseName(r) === norm);
            if (!foundNew) return [...prev, { ...newItem }];
            return prev;
          });
        } catch (e) {
          console.warn("[Dept] post-dialog refresh failed:", e?.message);
        }
      }
    }

    setIsEdit(false);
    setEditData(null);
  };

  // ── Mark as done ───────────────────────────────────────────────────────────
  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({ departments: { status: "DONE", lastModified: new Date().toISOString() } })
      );
    } catch (e) {}
    finally { SuccessToaster("Marked as done."); window.location.href = "/referencelist"; }
  };

  // ── UI helpers ─────────────────────────────────────────────────────────────
  const toggleStandard = (key) => setExpandedStandard((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleCustom   = (key) => setExpandedCustom((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleStandardItem = (item) => {
    const norm = normaliseName(item);
    setSelectedStandardItems((prev) =>
      prev.some((s) => normaliseName(s) === norm)
        ? prev.filter((s) => normaliseName(s) !== norm)
        : [...prev, item]
    );
  };
  const isSelected = (item) =>
    selectedStandardItems.some((s) => normaliseName(s) === normaliseName(item));

  // Show standard list items NOT already in custom list (by name match)
  // After delete from custom list -> name removed -> item reappears here
  const customNames      = new Set(customList.map(normaliseName));
  const filteredStandard = standardList.filter(
    (item) => !customNames.has(normaliseName(item))
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.deptPageBg}>
        <div className={`${isExpanded ? style.deptBigCardGrid : style.deptSmallCardGrid}`}>

          {/* Left sidebar */}
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={(v) => setIsExpanded(v)}>
              <div />
            </SideBar>
          </div>

          {/* Main content */}
          <div>

            {/* HEADER */}
            <div className={style.deptPageHeader}>
              <div className={style.deptPageHeaderLeft}>
                <span className={style.deptPageTitle}>
                  DEPARTMENTS / SERVICE AREAS FOR CUSTOMER SITE
                </span>
                {lastUpdatedDate && (
                  <span className={style.deptPageUpdated}>
                    UPDATED ON {lastUpdatedDate}
                  </span>
                )}
              </div>
              <div className={style.deptPageHeaderRight}>
                {/* Country dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    className={style.deptCountryBtn}
                    onClick={() => setCountryDropdownOpen((p) => !p)}
                  >
                    <FlagImg code={selectedCountry.code} size={20} />
                    <span>{selectedCountry.name}</span>
                    <span className={style.deptCountryArrow}>▾</span>
                  </button>
                  {countryDropdownOpen && (
                    <>
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                        onClick={() => setCountryDropdownOpen(false)}
                      />
                      <div className={style.deptCountryDropdown}>
                        {COUNTRY_LIST.map((c) => (
                          <div
                            key={c.code}
                            className={style.deptCountryOption}
                            style={{
                              backgroundColor: c.code === selectedCountry.code ? "#e8f4f7" : "transparent",
                              fontWeight: c.code === selectedCountry.code ? 600 : 400,
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
                {/* × close */}
                <button
                  className={style.deptCloseBtn}
                  onClick={() => { window.location.href = "/referencelist"; }}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* WHITE CARD */}
            <div className={style.deptCard}>

              {/* TWO-PANEL GRID */}
              <div className={style.deptPanelGrid}>

                {/* LEFT: Standard List */}
                <div className={style.deptPanel}>
                  <div className={style.deptPanelHeader}>
                    STANDARD LIST IN USE- DEFAULT
                  </div>

                  {siteName && (
                    <div className={style.deptSiteRow}>
                      <img src={IndustriesEntityFolder} alt="" className={style.deptFolderIcon} />
                      <span className={style.deptSiteName}>{siteName.toUpperCase()}</span>
                      <button
                        className={style.deptSiteToggle}
                        onClick={() => setIsStandardCollapsed((p) => !p)}
                      >
                        {isStandardCollapsed ? "+" : "−"}
                      </button>
                    </div>
                  )}

                  {!isStandardCollapsed && (
                    <div className={style.deptPanelBody}>
                      {isStandardLoading ? (
                        <p className={style.deptEmpty}>Loading…</p>
                      ) : filteredStandard.length === 0 ? (
                        <p className={style.deptEmpty}>No standard departments available.</p>
                      ) : filteredStandard.map((item, idx) => {
                        const name     = getItemName(item);
                        const children = getChildren(item);
                        const isExp    = expandedStandard[name];
                        const isChk    = isSelected(item);
                        return (
                          <div key={item?.id || idx} className={style.deptRow}>
                            <div className={`${style.deptRowItem} ${isChk ? style.deptRowItemChecked : ""}`}>
                              <input
                                type="checkbox"
                                className={style.deptCheckbox}
                                checked={isChk}
                                onChange={() => toggleStandardItem(item)}
                              />
                              <span className={style.deptRowName} onClick={() => toggleStandardItem(item)}>
                                {name}
                              </span>
                              {children.length > 0 && (
                                <button
                                  className={style.deptExpandBtn}
                                  onClick={(e) => { e.stopPropagation(); toggleStandard(name); }}
                                >
                                  {isExp ? "−" : "+"}
                                </button>
                              )}
                            </div>
                            {isExp && children.map((child, ci) => (
                              <div key={ci} className={style.deptChildRow}>
                                <span className={style.deptChildName}>
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

                {/* SELECT button */}
                <div className={style.deptSelectCol}>
                  <button
                    className={style.deptSelectBtn}
                    onClick={handleSelect}
                    disabled={selectedStandardItems.length === 0 || isSaving}
                  >
                    SELECT
                    <span className={style.deptSelectArrow}>»</span>
                  </button>
                </div>

                {/* RIGHT: My Custom List */}
                <div className={style.deptPanel}>
                  <div className={style.deptPanelHeader}>
                    MY CUSTOM LIST
                    <button
                      title="Add new department"
                      onClick={() => { setEditData(null); setIsEdit(false); setIsDialogOpen(true); }}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, flexShrink: 0 }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", border: "2px solid #fff", boxSizing: "border-box", color: "#fff", fontSize: 17, lineHeight: 1, fontWeight: 300 }}>+</span>
                    </button>
                  </div>

                  {siteName && (
                    <div className={style.deptSiteRow}>
                      <img src={IndustriesEntityFolder} alt="" className={style.deptFolderIcon} />
                      <span className={style.deptSiteName}>{siteName.toUpperCase()}</span>
                      <button
                        className={style.deptSiteToggle}
                        onClick={() => setIsCustomCollapsed((p) => !p)}
                      >
                        {isCustomCollapsed ? "+" : "−"}
                      </button>
                    </div>
                  )}

                  {!isCustomCollapsed && (
                    <div className={style.deptPanelBody}>
                      {isCustomLoading ? (
                        <p className={style.deptEmpty}>Loading…</p>
                      ) : customList.length === 0 ? (
                        <p className={style.deptEmpty}>
                          Select from the default list on the left, edit to change labels as
                          needed, and also add new departments by clicking the + icon.
                        </p>
                      ) : customList.map((item, idx) => {
                        const name     = getItemName(item);
                        const children = getChildren(item);
                        const isExp    = expandedCustom[`c_${name}`];
                        return (
                          <div key={item?.id || idx} className={style.deptRow}>
                            <div className={style.deptRowItem}>
                              {children.length > 0 && (
                                <button
                                  className={style.deptExpandBtn}
                                  onClick={() => toggleCustom(`c_${name}`)}
                                >
                                  {isExp ? "−" : "+"}
                                </button>
                              )}
                              <span className={style.deptRowName}>{name}</span>
                              <div className={style.deptActions}>
                                <img
                                  src={EditHcRow} alt="Edit" className={style.deptActionIcon}
                                  onClick={() => { setEditData(item); setIsEdit(true); setIsDialogOpen(true); }}
                                />
                                <img
                                  src={DeleteHcFolder} alt="Delete" className={style.deptActionIcon}
                                  onClick={() => handleDelete(item)}
                                />
                              </div>
                            </div>
                            {isExp && children.map((child, ci) => (
                              <div key={ci} className={style.deptChildRow}>
                                <span className={style.deptChildName}>
                                  {child?.name || child?.serviceName || ""}
                                </span>
                                <div className={style.deptChildActions}>
                                  <img src={EditHcRow} alt="Edit" className={style.deptChildActionIcon} />
                                  <img src={DeleteHcFolder} alt="Delete" className={style.deptChildActionIcon} />
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className={style.deptFooter}>
                <button
                  className={`${style.deptSaveBtn} ${style.deptMarkDoneBtn}`}
                  onClick={handleMarkAsDone}
                  disabled={isSaving}
                >
                  MARK AS DONE
                </button>
              </div>

            </div>
            {/* end white card */}

          </div>
          {/* end main content */}

        </div>
      </div>

      {isDialogOpen && (
        <DepartmentDialog
          open={isDialogOpen}
          handleClose={handleDialogClose}
          selectedApplicant={editData}
          isEdit={isEdit}
          currentSiteTypeId={siteTypeId}
        />
      )}
    </Fragment>
  );
};

export default Departments;