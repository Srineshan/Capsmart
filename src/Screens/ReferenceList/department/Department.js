import React, { Fragment, useState, useEffect, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import SideBar from "../../../Components/Sidebar";
import style from "./department.module.scss";
import { GET, POST, PUT } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import DepartmentDialog from "./DepartmentDialog";
import IndustriesEntityFolder from "../../../images/industriesEntityFolder.png";
import EditHcRow from "../../../images/editHcRow.png";
import DeleteHcFolder from "../../../images/deleteHcFolder.png";

// ─── Constants ────────────────────────────────────────────────────────────────
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

// ─── Flag image ───────────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

// ─── localStorage helpers ─────────────────────────────────────────────────────
// Key: siteId — every piece of state is scoped to the actual site instance
const deletedNamesKey = (siteId) => `dept_deleted_names_${siteId || "x"}`;
const loadDeletedNames = (siteId) => {
  try {
    const v = localStorage.getItem(deletedNamesKey(siteId));
    return v ? new Set(JSON.parse(v)) : new Set();
  } catch { return new Set(); }
};
const saveDeletedNames = (siteId, ns) => {
  try { localStorage.setItem(deletedNamesKey(siteId), JSON.stringify([...ns])); } catch (e) {}
};

// Pending items: newly selected departments that POST was accepted for
// but GET /department/{siteId} hasn't returned them yet (backend async delay).
// These survive page refresh so custom list stays populated.
const pendingKey   = (siteId) => `dept_pending_${siteId || "x"}`;
const loadPending  = (siteId) => {
  try { const v = localStorage.getItem(pendingKey(siteId)); return v ? JSON.parse(v) : []; } catch { return []; }
};
const savePending  = (siteId, arr) => {
  try { localStorage.setItem(pendingKey(siteId), JSON.stringify(arr)); } catch (e) {}
};
const removePending = (siteId, norm) => {
  try {
    const existing = loadPending(siteId);
    savePending(siteId, existing.filter((p) => normaliseName(p) !== norm));
  } catch (e) {}
};

// ─── Component ────────────────────────────────────────────────────────────────
const Departments = () => {
  const [entityId, setEntityId]           = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [siteTypeId, setSiteTypeId]       = useState("");
  const [siteId, setSiteId]               = useState("");
  const siteIdRef = useRef("");
  const siteTypeIdRef = useRef("");
  const [siteName, setSiteName]           = useState("");

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

  // deletedNamesRef: names the user deleted this session
  // Filters them out of GET response while backend async delete is processing
  const deletedNamesRef = useRef(new Set());

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  useEffect(() => { getEntity(); getSites(); }, []);
  useEffect(() => { if (entityId) getLastModifiedDate(entityId); }, [entityId]);
  useEffect(() => {
    if (!siteId) return;
    deletedNamesRef.current = loadDeletedNames(siteId);
    loadStandardList();
    loadCustomList();
  }, [siteId]);

  // ── Data fetchers ─────────────────────────────────────────────────────────────
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
        const sid = first?.id || "";
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

  // Standard list: GET /departmentMaster (master/default list shown on LEFT)
  const loadStandardList = async () => {
    setIsStandardLoading(true);
    try {
      let data = [];
      try {
        const res = await GET(`entity-service/departmentMaster/refListView?siteTypeId=${siteTypeIdRef.current}`);
        data = res?.data || [];
      } catch (e) {}
      if (data.length === 0) {
        try {
          const res = await GET("entity-service/departmentMaster");
          data = res?.data || [];
        } catch (e) {}
      }
      setStandardList(data);
    } finally {
      setIsStandardLoading(false);
    }
  };

  // Custom list: GET /department — entity department API (department-controller)
  // Returns 852 records globally — we filter by siteTypeId to get THIS hospital only
  // siteTypeId (63ae...) scopes records to this hospital's type
  const loadCustomList = async () => {
    setIsCustomLoading(true);
    try {
      const res = await GET("entity-service/department");
      const raw = res?.data;
      const all = Array.isArray(raw) ? raw
        : Array.isArray(raw?.content) ? raw.content : [];

      // Filter to THIS hospital: customized:true + siteTypeId matches
      const thisSiteTypeId = siteTypeIdRef.current;
      const filtered = all.filter((item) =>
        item?.customized === true &&
        (!thisSiteTypeId || item?.siteTypeId?.id === thisSiteTypeId)
      );

      // Build API name set for auto-clearing stale deletedNames
      const apiNames = new Set(filtered.map(normaliseName).filter(Boolean));

      // Auto-clear deletedNames confirmed gone from API (deletion processed)
      let changed = false;
      deletedNamesRef.current.forEach((norm) => {
        if (!apiNames.has(norm)) { deletedNamesRef.current.delete(norm); changed = true; }
      });
      if (changed) saveDeletedNames(siteIdRef.current, deletedNamesRef.current);

      const seenNames = new Set();
      const result    = [];
      for (const item of filtered) {
        const norm = normaliseName(item);
        if (!norm || seenNames.has(norm)) continue;
        if (deletedNamesRef.current.has(norm)) continue;
        seenNames.add(norm);
        result.push({ ...item, serviceAreas: item?.serviceAreas || [] });
      }

      // Merge pending: newly POSTed items not yet returned by GET /department
      const pending = loadPending(siteIdRef.current).filter((p) => {
        const norm = normaliseName(p);
        if (!norm || deletedNamesRef.current.has(norm)) return false;
        if (seenNames.has(norm)) { removePending(siteIdRef.current, norm); return false; }
        return true;
      });

      setCustomList([...result, ...pending]);
    } catch (e) {
      console.warn("[Dept] loadCustomList failed:", e?.message);
    } finally {
      setIsCustomLoading(false);
    }
  };

  // ── SELECT: move items from standard list → custom list ───────────────────────
  // Flow:
  //   1. POST /department to save (siteTypeId is correct per backend schema)
  //   2. Optimistically add to UI immediately (no waiting)
  //   3. After 2s, re-fetch GET /department/{siteId} to get real backend IDs
  //      so DELETE works correctly via PUT /department/{realId}
  const handleSelect = async () => {
    if (selectedStandardItems.length === 0) return;

    // Only add items not already in custom list (compare by normalised name)
    const existingNames = new Set(customList.map(normaliseName));
    const toAdd = selectedStandardItems.filter(
      (item) => !existingNames.has(normaliseName(item))
    );

    if (toAdd.length === 0) {
      ErrorToaster("Selected department(s) already exist in your custom list.");
      setSelectedStandardItems([]);
      return;
    }

    setIsSaving(true);
    try {
      // POST payload — siteTypeId is the correct field per Swagger schema
      const payload = toAdd.map((item) => ({
        departmentName: { name: getItemName(item) },
        aliasName1:     item?.aliasName1 || "",
        aliasName2:     item?.aliasName2 || "",
        serviceAreas:   getChildren(item).map((child) => ({
          name:       child?.name || child?.serviceName || "",
          aliasName1: child?.aliasName1 || "",
          aliasName2: child?.aliasName2 || "",
        })),
        siteTypeId: siteTypeIdRef.current ? { id: siteTypeIdRef.current } : undefined,
        customized:  true,
        active:      true,
      }));

      await POST("entity-service/department", JSON.stringify(payload));
      SuccessToaster(`${toAdd.length} department(s) saved successfully.`);

      // Remove these names from deletedNamesRef (user is re-adding after delete)
      const toAddNorms = new Set(toAdd.map(normaliseName));
      toAddNorms.forEach((norm) => {
        deletedNamesRef.current.delete(norm);
      });
      saveDeletedNames(siteIdRef.current, deletedNamesRef.current);

      // Step 1: Optimistically show in UI immediately with id:null (no real ID yet)
      // Use dedup-merge to prevent duplicate if item was already in state somehow
      const optimisticItems = toAdd.map((item) => ({
        id:             null,           // real ID unknown until GET returns
        name:           getItemName(item),
        departmentName: { name: getItemName(item) },
        aliasName1:     item?.aliasName1 || "",
        aliasName2:     item?.aliasName2 || "",
        serviceAreas:   getChildren(item).map((child) => ({
          name:       child?.name || child?.serviceName || "",
          aliasName1: child?.aliasName1 || "",
          aliasName2: child?.aliasName2 || "",
        })),
        customized: true,
        _optimistic: true,             // flag: no real ID yet, skip PUT on delete
      }));

      setCustomList((prev) => [
        ...prev.filter((c) => !toAddNorms.has(normaliseName(c))),
        ...optimisticItems,
      ]);

      // Save to pending localStorage so items survive page refresh
      // Dedup: remove stale pending entries for same names first
      const existingPending = loadPending(siteIdRef.current);
      savePending(siteIdRef.current, [
        ...existingPending.filter((p) => !toAddNorms.has(normaliseName(p))),
        ...optimisticItems.map((i) => ({
          id:             null,
          name:           getItemName(i),
          departmentName: i.departmentName,
          aliasName1:     i.aliasName1 || "",
          aliasName2:     i.aliasName2 || "",
          serviceAreas:   i.serviceAreas || [],
          customized:     true,
          _optimistic:    true,
        })),
      ]);

      // Step 2: After 2s, re-fetch GET /department to get real IDs
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const res = await GET("entity-service/department");
        const raw = res?.data;
        const all = Array.isArray(raw) ? raw
          : Array.isArray(raw?.content) ? raw.content : [];

        // Build a name → real record map — filter by siteTypeId for this hospital
        const thisSiteTypeId = siteTypeIdRef.current;
        const realRecordMap = {};
        all
          .filter((r) => r?.customized === true &&
            (!thisSiteTypeId || r?.siteTypeId?.id === thisSiteTypeId))
          .forEach((r) => {
            const norm = normaliseName(r);
            if (norm) realRecordMap[norm] = r;
          });

        // Update customList: replace optimistic items with real records where available
        setCustomList((prev) => {
          const seenNames = new Set();
          return prev
            .map((item) => {
              const norm = normaliseName(item);
              if (item._optimistic && realRecordMap[norm]) {
                // Got real record — replace optimistic with real (has real ID)
                return { ...realRecordMap[norm], serviceAreas: realRecordMap[norm].serviceAreas || [] };
              }
              return item;
            })
            .filter((item) => {
              // Deduplicate by name (keep first occurrence)
              const norm = normaliseName(item);
              if (seenNames.has(norm)) return false;
              seenNames.add(norm);
              return true;
            })
            .filter((item) => !deletedNamesRef.current.has(normaliseName(item)));
        });
      } catch (e) {
        console.warn("[Dept] post-select GET failed:", e?.message);
        // Optimistic items remain — DELETE will be UI-only for them
      }
    } catch (err) {
      console.error("[Dept] SELECT error:", err);
      ErrorToaster(err?.message || "Failed to save selected departments.");
    } finally {
      setIsSaving(false);
      setSelectedStandardItems([]);
    }
  };

  // ── DELETE ───────────────────────────────────────────────────────────────────
  // Flow:
  //   1. Remove from UI immediately (optimistic)
  //   2. Track name in deletedNamesRef so loadCustomList filters it out
  //   3. If item has a real ID → PUT /department/{id} with deleted:true
  //   4. If item is optimistic (id:null) → UI removal only
  //      (it was never confirmed by GET, so no backend record to delete)
  const handleDelete = async (item) => {
    const id   = item?.id;
    const name = getItemName(item);
    const norm = normaliseName(item);

    // Track deleted name — filters this out of GET response on next load
    if (norm) {
      deletedNamesRef.current.add(norm);
      saveDeletedNames(siteIdRef.current, deletedNamesRef.current);
    }

    // Remove from pending localStorage so re-add doesn't get duplicate
    removePending(siteIdRef.current, norm);

    // Remove from UI immediately by name
    setCustomList((prev) => prev.filter((c) => normaliseName(c) !== norm));

    // If optimistic item (no real ID yet) — UI removal is sufficient
    // The POST was accepted but GET hasn't returned the real ID yet
    // deletedNamesRef will filter it out when GET eventually returns it
    if (!id || item?._optimistic) {
      SuccessToaster("Department removed.");
      return;
    }

    // Has real ID — call PUT /department/{id} with deleted:true
    try {
      const payload = {
        departmentName: item?.departmentName || item?.departmentGroupBy || { name },
        aliasName1:     item?.aliasName1 || "",
        aliasName2:     item?.aliasName2 || "",
        serviceAreas:   (item?.serviceAreas || []).map((a) => ({
          name:       a?.name || a?.serviceName || "",
          aliasName1: a?.aliasName1 || "",
          aliasName2: a?.aliasName2 || "",
        })),
        siteTypeId: siteTypeIdRef.current ? { id: siteTypeIdRef.current } : undefined,
        deleted:    true,
        active:     false,
        customized: false,
      };
      await PUT(`entity-service/department/${id}`, JSON.stringify(payload));
      SuccessToaster("Department removed.");
    } catch (err) {
      console.warn("[Dept] DELETE PUT failed:", err?.message);
      // Rollback
      if (norm) {
        deletedNamesRef.current.delete(norm);
        saveDeletedNames(siteIdRef.current, deletedNamesRef.current);
      }
      setCustomList((prev) => [...prev, item]);
      ErrorToaster("Could not delete department. Please try again.");
    }
  };

  // ── Dialog close (Add / Edit via + button) ────────────────────────────────────
  const handleDialogClose = async (needRefetch, newItem) => {
    setIsDialogOpen(false);

    if (needRefetch) {
      const wasEdit = isEdit && newItem?.id;

      if (wasEdit) {
        // EDIT: update local state immediately with what user typed
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
                  // ✅ FIX: also update regionalCallResponsibilitiesApplicable
                  regionalCallResponsibilitiesApplicable:
                    newItem.regionalCallResponsibilitiesApplicable ?? c.regionalCallResponsibilitiesApplicable,
                  serviceAreas:   newItem.serviceAreas?.length > 0
                    ? newItem.serviceAreas
                    : c.serviceAreas || [],
                }
              : c
          )
        );
      } else if (newItem) {
        // ADD: show optimistically + save to pending localStorage
        // POST /department returns "ACCEPTED" (async) — item may not appear
        // in GET /department immediately. Pending bridges the gap.
        const norm = normaliseName(newItem);
        const alreadyExists = customList.some((c) => normaliseName(c) === norm);
        if (!alreadyExists) {
          const optimisticItem = { ...newItem, id: null, _optimistic: true };
          setCustomList((prev) => [...prev, optimisticItem]);

          // Save to pending so it survives page refresh
          const existingPending = loadPending(siteIdRef.current);
          savePending(siteIdRef.current, [
            ...existingPending.filter((p) => normaliseName(p) !== norm),
            {
              id:             null,
              name:           newItem.departmentName?.name || newItem.name || "",
              departmentName: newItem.departmentName || { name: newItem.name || "" },
              aliasName1:     newItem.aliasName1 || "",
              aliasName2:     newItem.aliasName2 || "",
              regionalCallResponsibilitiesApplicable:
                newItem.regionalCallResponsibilitiesApplicable || false,
              serviceAreas:   newItem.serviceAreas || [],
              customized:     true,
              _optimistic:    true,
            },
          ]);
        }
        // Try to get real ID after delay (backend async indexing)
        await new Promise((r) => setTimeout(r, 2000));
        await loadCustomList();
      }
    }

    setIsEdit(false);
    setEditData(null);
  };

  // ── Mark as done ──────────────────────────────────────────────────────────────
  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({ departments: { status: "DONE", lastModified: new Date().toISOString() } })
      );
    } catch (e) {}
    finally { SuccessToaster("Marked as done."); window.location.href = "/referencelist"; }
  };

  // ── UI helpers ────────────────────────────────────────────────────────────────
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

  // Standard list shows only items NOT already in custom list
  const customNames      = new Set(customList.map(normaliseName));
  const filteredStandard = standardList.filter(
    (item) => !customNames.has(normaliseName(item))
  );

  // ── Render ────────────────────────────────────────────────────────────────────
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