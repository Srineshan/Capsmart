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

  // ── CORE FIX: loadCustomList uses NAME-based whitelist ─────────────────────
  const loadCustomList = async () => {
    setIsCustomLoading(true);
    try {
      const whitelist = whitelistRef.current;

      if (whitelist.size === 0) {
        setCustomList([]);
        return;
      }

      let data = [];

      // Primary: refListView (returns standard + selected departments)
      try {
        const res = await GET(`entity-service/department/refListView?siteTypeId=${siteTypeId}&searchText=`);
        const raw = res?.data;
        if (Array.isArray(raw) && raw.length > 0) data = raw;
        else if (Array.isArray(raw?.content) && raw.content.length > 0) data = raw.content;
      } catch (e) { console.warn("[Dept] refListView failed:", e?.message); }

      // Also fetch ALL departments directly — catches dialog-created items
      // that may not appear in refListView
      let allData = [];
      try {
        const res2 = await GET("entity-service/department");
        const raw2 = res2?.data;
        if (Array.isArray(raw2) && raw2.length > 0) allData = raw2;
        else if (Array.isArray(raw2?.content) && raw2.content.length > 0) allData = raw2.content;
      } catch (e) { console.warn("[Dept] /department fetch failed:", e?.message); }

      // Merge: prefer refListView items, supplement with allData for any missing
      const merged = [...data];
      const mergedNorms = new Set(data.map(normaliseName).filter(Boolean));
      for (const item of allData) {
        const n = normaliseName(item);
        if (n && !mergedNorms.has(n)) {
          merged.push(item);
          mergedNorms.add(n);
        }
      }

      // Fallback: siteId-scoped if still empty
      if (merged.length === 0 && siteId) {
        try {
          const res = await GET(`entity-service/department/${siteId}`);
          const raw = res?.data;
          if (Array.isArray(raw) && raw.length > 0) merged.push(...raw);
        } catch (e) { console.warn("[Dept] siteId fallback failed:", e?.message); }
      }

      if (merged.length === 0) {
        console.warn("[Dept] All endpoints returned 0 items — keeping local state.");
        return;
      }

      console.log("[Dept] whitelist size:", whitelist.size, "| merged data:", merged.length);

      // Filter by NAME (not ID) — picks one representative per whitelisted name
      const seenNames = new Set();
      const result = [];
      for (const item of merged) {
        const norm = normaliseName(item);
        if (!norm) continue;
        if (whitelist.has(norm) && !seenNames.has(norm)) {
          seenNames.add(norm);
          result.push(item);
        }
      }

      console.log("[Dept] Filtered by whitelist:", result.length, "| whitelist:", [...whitelist]);
      setCustomList(result);
    } finally {
      setIsCustomLoading(false);
    }
  };

  // ── SELECT ─────────────────────────────────────────────────────────────────
  const handleSelect = async () => {
    if (selectedStandardItems.length === 0) return;

    const existingNames = new Set(customList.map(normaliseName));
    const toAdd = selectedStandardItems.filter(
      (item) => !existingNames.has(normaliseName(item))
    );

    if (toAdd.length === 0) {
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
        siteTypeId: siteTypeId ? { id: siteTypeId } : undefined,
      }));

      await POST("entity-service/department", JSON.stringify(payload));
      SuccessToaster(`${toAdd.length} department(s) saved successfully.`);

      // Add normalised names to whitelist and persist
      toAdd.forEach((item) => {
        const norm = normaliseName(item);
        if (norm) whitelistRef.current.add(norm);
      });
      saveWhitelist(siteTypeId, whitelistRef.current);

      // Refresh custom list from API (now whitelist includes new names)
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

    // Attempt backend delete via PUT with deleted flag
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
      console.log("[Dept] PUT deleted=true success for id:", id);
      SuccessToaster("Department removed.");
    } catch (putErr) {
      console.warn("[Dept] PUT delete failed:", putErr?.message);
      // Restore whitelist and UI on failure
      if (norm) {
        whitelistRef.current.add(norm);
        saveWhitelist(siteTypeId, whitelistRef.current);
      }
      setCustomList((prev) => [...prev, item]);
      ErrorToaster("Could not delete department. Please try again.");
    }
  };

  // ── Dialog close handler ───────────────────────────────────────────────────
  const handleDialogClose = async (needRefetch, newItem) => {
    setIsDialogOpen(false);
    setIsEdit(false);

    if (needRefetch) {
      if (newItem) {
        // Newly added via dialog:
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

        // 2. Wait briefly then call loadCustomList which now fetches BOTH
        //    refListView AND entity-service/department — so dialog-created items
        //    that only appear in the direct endpoint will be found correctly.
        await new Promise((r) => setTimeout(r, 600));
        try {
          await loadCustomList();
          // If item still not in list (API stale), keep optimistic version
          setCustomList((prev) => {
            const foundNew = prev.some((r) => normaliseName(r) === norm);
            if (!foundNew) return [...prev, { ...newItem }];
            return prev;
          });
        } catch (e) {
          console.warn("[Dept] post-dialog refresh failed:", e?.message);
          // Optimistic state already set above — good enough
        }
      } else {
        // Edited — refresh full list from API
        await loadCustomList();
      }
    }
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

  const customNames      = new Set(customList.map(normaliseName));
  const filteredStandard = standardList.filter((item) => !customNames.has(normaliseName(item)));

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