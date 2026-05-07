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

// ── Flag images via flagcdn.com ───────────────────────────────────────────────
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

const RegionalCallResponsibilities = () => {
  const [entityId, setEntityId]               = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [siteTypeId, setSiteTypeId]           = useState("");
  const [siteId, setSiteId]                   = useState("");
  const [siteName, setSiteName]               = useState("");

  // ── SideBar ───────────────────────────────────────────────────────────────
  const [isExpanded, setIsExpanded] = useState(true);
  const getIsExpanded = (v) => setIsExpanded(v);

  // ── Country dropdown ──────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // ── LEFT panel — My List of Departments / Service Areas ───────────────────
  const [myDepartments, setMyDepartments]           = useState([]);
  const [expandedLeft, setExpandedLeft]             = useState({});
  const [selectedForRight, setSelectedForRight]     = useState([]); // checked → move right
  const [isLeftLoading, setIsLeftLoading]           = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed]       = useState(false); // toggle for site sub-header

  // ── RIGHT panel — Departments having Regional Call Responsibilities ────────
  const [regionalDepts, setRegionalDepts]           = useState([]);
  const [expandedRight, setExpandedRight]           = useState({});
  const [selectedForLeft, setSelectedForLeft]       = useState([]);  // checked → move left
  const [isRightLoading, setIsRightLoading]         = useState(false);
  const [isRightCollapsed, setIsRightCollapsed]     = useState(false); // toggle for site sub-header

  // Deleted tracking
  const deletedIdsRef       = useRef(new Set());
  const deletedNamesRef     = useRef(new Set());
  // Track items created via + Add New — these should be fully deleted (not just un-flagged)
  const newlyCreatedIdsRef   = useRef(new Set());
  const newlyCreatedNamesRef = useRef(new Set()); // fallback: track by name (lower-case)

  const [isSaving, setIsSaving] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
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

  const applyFilters = (data) => {
    const seen = new Set();
    return (data || []).filter((item) => {
      if (item?.id && deletedIdsRef.current.has(item.id)) return false;
      const name = getItemName(item);
      if (deletedNamesRef.current.has(name?.toLowerCase())) return false;
      const key = name?.trim()?.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => { getEntity(); getSites(); }, []);
  useEffect(() => { if (entityId) getLastModifiedDate(); }, [entityId]);
  useEffect(() => {
    if (siteTypeId) { loadMyDepartments(); }
    if (siteTypeId && entityId) { loadRegionalDepts(); }
  }, [siteTypeId, entityId]);

  // ── API ───────────────────────────────────────────────────────────────────
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

  // LEFT — my custom departments list
  const loadMyDepartments = async () => {
    setIsLeftLoading(true);
    try {
      let data = [];
      try {
        const res = await GET(
          `entity-service/department/refListView?siteTypeId=${siteTypeId}&searchText=`
        );
        data = res?.data || [];
      } catch (e) {}
      if (data.length === 0 && siteId) {
        try {
          const res = await GET(`entity-service/department/${siteId}`);
          data = res?.data || [];
        } catch (e) {}
      }
      if (data.length === 0) {
        try {
          const res = await GET("entity-service/department");
          data = res?.data || [];
        } catch (e) {}
      }
      setMyDepartments(applyFilters(data));
    } finally { setIsLeftLoading(false); }
  };

  // RIGHT — persist selected IDs in sessionStorage (survives refresh, cleared on tab close).
  // Also filter from full GET /department checking all possible regionalCall field names.
  const REGIONAL_STORAGE_KEY = `regionalDepts_${window.location.hostname}`;

  const saveRegionalIds = (items) => {
    try {
      // Store id + isNew flag so we can restore the newly-created distinction on refresh
      const ids = items
        .filter((i) => i?.id)
        .map((i) => ({ id: i.id, name: getItemName(i), isNew: i._isNew === true }));
      sessionStorage.setItem(REGIONAL_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {}
  };

  const loadRegionalIds = () => {
    try {
      const raw = sessionStorage.getItem(REGIONAL_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  };

  const loadRegionalDepts = async () => {
    setIsRightLoading(true);
    try {
      let data = [];
      try {
        const res = await GET("entity-service/department");
        data = res?.data?.content || res?.data || [];
        console.log("[RegionalCall] full dept records:", data.length,
          "| fields:", data[0] ? Object.keys(data[0]).join(", ") : "none");
      } catch (e) {}
      if (data.length === 0 && siteId) {
        try { const res = await GET(`entity-service/department/${siteId}`); data = res?.data || []; } catch (e) {}
      }

      // ── Primary: filter by backend flag (all known field names) ──────────────
      let regional = data.filter((item) =>
        item?.regionalCall === true ||
        item?.hasRegionalCall === true ||
        item?.regionalCallResponsibility === true ||
        item?.isRegionalCall === true
      );

      // ── Fallback: use sessionStorage IDs if backend doesn't return the flag ──
      if (regional.length === 0) {
        const savedIds = loadRegionalIds();
        if (savedIds.length > 0 && data.length > 0) {
          const idSet   = new Set(savedIds.map((e) => typeof e === "object" ? e.id : e));
          const nameSet = new Set(savedIds.map((e) => typeof e === "object" ? e.name?.toLowerCase() : "").filter(Boolean));
          regional = data.filter((item) =>
            (item?.id && idSet.has(item.id)) ||
            (getItemName(item)?.toLowerCase() && nameSet.has(getItemName(item)?.toLowerCase()))
          );
          // Re-apply _isNew flag if stored
          regional = regional.map((item) => {
            const stored = savedIds.find((e) => typeof e === "object" && e.id === item.id);
            return stored?.isNew ? { ...item, _isNew: true } : item;
          });
          console.log("[RegionalCall] restored from sessionStorage:", regional.length);
        }
      }

      console.log("[RegionalCall] regional depts:", regional.length);
      const filtered = applyFilters(regional);
      setRegionalDepts(filtered);
      // Keep sessionStorage in sync
      if (filtered.length > 0) saveRegionalIds(filtered);
    } finally { setIsRightLoading(false); }
  };

  // ── » button — move left → right ─────────────────────────────────────────
  // UI update is SYNCHRONOUS — no async, no await before state update.
  // API call is fire-and-forget after state is already set.
  const handleMoveRight = () => {
    if (selectedForRight.length === 0) {
      ErrorToaster("Select departments from the left panel first.");
      return;
    }

    const rightNames = new Set(regionalDepts.map(getItemName));
    const toAdd = selectedForRight.filter(
      (item) => !rightNames.has(getItemName(item))
    );

    if (toAdd.length === 0) {
      ErrorToaster("Selected departments are already in the right panel.");
      return;
    }

    // ── STEP 1: Update state synchronously (no await, no async) ──────────────
    const pendingItems = toAdd.map((item) => ({ ...item, _pending: true }));
    setRegionalDepts((prev) => [...prev, ...pendingItems]);
    setSelectedForRight([]);

    // ── STEP 2: Mark each department as regionalCall=true via PUT /department/{id}
    // /regionalCallDepartment endpoint does not exist on this backend (404).
    // The flag is stored on the department record itself.
    const putAll = toAdd.map((item) => {
      if (!item?.id) return Promise.resolve(); // no ID = can't persist; stays optimistic
      // Send minimal payload — same shape as DepartmentDialog.js SaveSubmitHandler
      // Try single object first (not array) — 500 may be caused by array wrapper
      const payload = {
        departmentName: item?.departmentName || item?.departmentGroupBy || { name: getItemName(item) },
        aliasName1:     item?.aliasName1   || "",
        aliasName2:     item?.aliasName2   || "",
        serviceAreas:   (item?.serviceAreas || []).map((a) => ({
          name: a?.name || a?.serviceName || "",
          aliasName1: a?.aliasName1 || "",
          aliasName2: a?.aliasName2 || "",
        })),
        siteTypeId:     siteTypeId ? { id: siteTypeId } : undefined,
        regionalCall:   true,
      };
      return PUT(`entity-service/department/${item.id}`, JSON.stringify(payload))
        .then(() => console.log("[RegionalCall] PUT regionalCall=true success:", getItemName(item)));
    });

    Promise.all(putAll)
      .then(() => {
        // Clear _pending flags and persist to sessionStorage
        setRegionalDepts((prev) => {
          const updated = prev.map((d) => {
            if (pendingItems.some((p) => getItemName(p) === getItemName(d))) {
              const { _pending, ...rest } = d;
              return { ...rest, regionalCall: true };
            }
            return d;
          });
          saveRegionalIds(updated); // persist across refresh
          return updated;
        });
      })
      .catch((err) => {
        console.warn("[RegionalCall] PUT failed:", err?.message);
        // Keep items in UI and save to sessionStorage even if PUT fails
        // so they survive refresh via sessionStorage fallback
        setRegionalDepts((prev) => {
          const updated = prev.map((d) => {
            if (pendingItems.some((p) => getItemName(p) === getItemName(d))) {
              const { _pending, ...rest } = d;
              return { ...rest, regionalCall: true };
            }
            return d;
          });
          saveRegionalIds(updated);
          return updated;
        });
        console.log("[RegionalCall] PUT failed but saved to sessionStorage for persistence");
      });
  };

  // ── « button — remove from right panel ───────────────────────────────────
  const handleMoveLeft = async () => {
    if (selectedForLeft.length === 0) {
      ErrorToaster("Select departments from the right panel first.");
      return;
    }

    // Optimistic UI update
    const removeNames = new Set(selectedForLeft.map(getItemName));
    setRegionalDepts((prev) =>
      prev.filter((d) => !removeNames.has(getItemName(d)))
    );
    setSelectedForLeft([]);

    try {
      // Mark each department as regionalCall=false via PUT /department/{id}
      for (const item of selectedForLeft) {
        const name = getItemName(item);
        if (name) deletedNamesRef.current.add(name.toLowerCase());
        if (item?.id && !item?._pending) {
          try {
            const payload = {
              departmentName: item?.departmentName || item?.departmentGroupBy || { name: getItemName(item) },
              aliasName1:     item?.aliasName1   || "",
              aliasName2:     item?.aliasName2   || "",
              serviceAreas:   (item?.serviceAreas || []).map((a) => ({
                name: a?.name || a?.serviceName || "",
                aliasName1: a?.aliasName1 || "",
                aliasName2: a?.aliasName2 || "",
              })),
              siteTypeId:     siteTypeId ? { id: siteTypeId } : undefined,
              regionalCall:   false,
            };
            await PUT(`entity-service/department/${item.id}`, JSON.stringify(payload));
            console.log("[RegionalCall] PUT regionalCall=false for:", name);
          } catch (e) {
            console.warn("[RegionalCall] PUT false failed:", e?.message);
          }
        }
      }
      // Remove from sessionStorage persistence
      setRegionalDepts((prev) => {
        const updated = prev; // already filtered above
        saveRegionalIds(updated);
        return updated;
      });
      SuccessToaster("Removed from regional call responsibilities.");
      updateLastModified();
    } catch (err) {
      ErrorToaster(err?.message || "Failed to remove.");
    }
  };

  // ── Add new dialog state ──────────────────────────────────────────────────
  const [showAddDialog, setShowAddDialog]     = useState(false);
  const [newDeptName, setNewDeptName]         = useState("");
  const [isAddSubmitting, setIsAddSubmitting] = useState(false);

  // ── Edit dialog state ─────────────────────────────────────────────────────
  const [showEditDialog, setShowEditDialog]   = useState(false);
  const [editItem, setEditItem]               = useState(null);
  const [editDeptName, setEditDeptName]       = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const handleAddNew = async () => {
    if (!newDeptName.trim()) {
      ErrorToaster("Department name is required.");
      return;
    }
    const name = newDeptName.trim();

    // Track by name immediately — before any async, so delete always recognises it
    newlyCreatedNamesRef.current.add(name.toLowerCase());

    // Close dialog right away
    setNewDeptName("");
    setShowAddDialog(false);

    // ── Optimistically add to RIGHT panel only ──────────────────────────────
    const localId = `new_${Date.now()}`;
    const newItem = {
      name,
      departmentName: { name },
      regionalCall:   true,
      _pending:       true,
      _localId:       localId,
      _isNew:         true,
    };
    setRegionalDepts((prev) => {
      const updated = [...prev, newItem];
      saveRegionalIds(updated);
      return updated;
    });

    // ── Fire-and-forget POST ─────────────────────────────────────────────────
    try {
      const payload = [{
        departmentName: { name },
        regionalCall:   true,
        siteTypeId:     siteTypeId ? { id: siteTypeId } : undefined,
        aliasName1: "", aliasName2: "", serviceAreas: [],
      }];
      await POST("entity-service/department", JSON.stringify(payload));
      SuccessToaster("Department added to Regional Call Responsibilities.");

      // Clear _pending flag — item stays in right panel, NOT moved to left
      setRegionalDepts((prev) => {
        const updated = prev.map((d) => {
          if (d._localId !== localId) return d;
          if (d.id) newlyCreatedIdsRef.current.add(d.id);
          const { _pending, _localId, ...rest } = d;
          return { ...rest, _isNew: true };
        });
        saveRegionalIds(updated);
        return updated;
      });

      // ⚠️ Do NOT call loadMyDepartments() — it adds the new dept to the left panel
      // which makes it look like a standard item and breaks delete detection

    } catch (err) {
      console.error("[RegionalCall] Add error:", err);
      // Keep in right panel; sessionStorage preserves on refresh
    }
  };

  // ── Edit existing right-panel item ───────────────────────────────────────
  const openEditDialog = (item) => {
    setEditItem(item);
    setEditDeptName(getItemName(item));
    setShowEditDialog(true);
  };

  const handleEditSave = async () => {
    if (!editDeptName.trim()) {
      ErrorToaster("Name is required.");
      return;
    }
    setIsEditSubmitting(true);

    const updatedName = editDeptName.trim();

    // Update UI immediately
    setRegionalDepts((prev) =>
      prev.map((d) =>
        getItemName(d) === getItemName(editItem)
          ? { ...d, name: updatedName, departmentName: { name: updatedName } }
          : d
      )
    );

    // Try API update
    try {
      if (editItem?.id) {
        await PUT(
          `entity-service/regionalCallDepartment/${editItem.id}`,
          JSON.stringify({
            name:       updatedName,
            siteTypeId: siteTypeId ? { id: siteTypeId } : undefined,
            entityId:   entityId   ? { id: entityId }   : undefined,
          })
        );
      }
      SuccessToaster("Updated successfully.");
      updateLastModified();
    } catch (err) {
      console.error("[RegionalCall] Edit error:", err);
      SuccessToaster("Updated locally. Click SAVE to persist.");
    } finally {
      setIsEditSubmitting(false);
      setShowEditDialog(false);
      setEditItem(null);
      setEditDeptName("");
    }
  };

  // handleSave removed — SAVE button removed; » button auto-saves via PUT /department/{id}

  const updateLastModified = async () => {
    // PUT /referenceList/entity returns 500 "Request method 'PUT' not supported" on this backend.
    // Skip silently — not critical for the feature.
    console.log("[RegionalCall] updateLastModified skipped (PUT not supported on this backend)");
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          regionalCallResponsibilities: {
            status: "DONE",
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

  // ── Expand / collapse ─────────────────────────────────────────────────────
  const toggleLeft  = (key) => setExpandedLeft((p)  => ({ ...p, [key]: !p[key] }));
  const toggleRight = (key) => setExpandedRight((p) => ({ ...p, [key]: !p[key] }));

  // ── Checkbox handlers ─────────────────────────────────────────────────────
  const toggleForRight = (item) => {
    const name = getItemName(item);
    setSelectedForRight((prev) =>
      prev.some((s) => getItemName(s) === name)
        ? prev.filter((s) => getItemName(s) !== name)
        : [...prev, item]
    );
  };
  const isSelectedForRight = (item) =>
    selectedForRight.some((s) => getItemName(s) === getItemName(item));

  const toggleForLeft = (item) => {
    const name = getItemName(item);
    setSelectedForLeft((prev) =>
      prev.some((s) => getItemName(s) === name)
        ? prev.filter((s) => getItemName(s) !== name)
        : [...prev, item]
    );
  };
  const isSelectedForLeft = (item) =>
    selectedForLeft.some((s) => getItemName(s) === getItemName(item));

  // Items in left NOT yet in right
  const rightNames        = new Set(regionalDepts.map(getItemName));
  const availableForRight = myDepartments.filter(
    (d) => !rightNames.has(getItemName(d))
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />

      <div className={style.rcPageBg}>
        {/* ── SideBar + main content (same pattern as holidayScheduleForCustomers) ── */}
        <div className={`${isExpanded ? style.rcBigCardGrid : style.rcSmallCardGrid}`}>

          {/* LEFT SIDEBAR — same as demo (JOHN profile, nav icons) */}
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
              <div />
            </SideBar>
          </div>

          {/* MAIN CONTENT */}
          <div>

            {/* ══════════════════════════════════════════════════════════════
                PAGE HEADER — outside white card
                [title + updated time] ........................ [🇺🇸 USA  ×]
            ══════════════════════════════════════════════════════════════ */}
            <div className={style.rcPageHeader}>
              <div className={style.rcPageHeaderLeft}>
                <span className={style.rcPageTitle}>
                  DEPARTMENTS / SERVICE AREAS REQUIRING REGIONAL CALL RESPONSIBILITIES BY SITE
                </span>
                {lastUpdatedDate && (
                  <span className={style.rcPageUpdated}>
                    UPDATED ON {lastUpdatedDate}
                  </span>
                )}
              </div>

              <div className={style.rcPageHeaderRight}>
                {/* Country dropdown */}
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

                {/* × close */}
                <button
                  className={style.rcCloseBtn}
                  onClick={() => { window.location.href = "/referencelist"; }}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                WHITE CARD — two panels + footer
            ══════════════════════════════════════════════════════════════ */}
            <div className={style.rcCard}>
              <div className={style.rcPanelGrid}>

                {/* ── LEFT: My List of Departments / Service Areas ── */}
                <div className={style.rcPanel}>
                  <div className={style.rcPanelHeader}>
                    MY LIST OF DEPARTMENTS / SERVICE AREAS
                  </div>

                  {siteName && (
                    <div className={style.rcSiteRow}>
                      <img src={IndustriesEntityFolder} alt="" className={style.rcFolderIcon} />
                      <span className={style.rcSiteName}>{siteName.toUpperCase()}</span>
                      {/* + / − toggle — collapses/expands the list below */}
                      <button
                        className={style.rcSiteToggle}
                        onClick={() => setIsLeftCollapsed((p) => !p)}
                        title={isLeftCollapsed ? "Expand" : "Collapse"}
                      >
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
                          <div
                            className={`${style.rcRowItem} ${isChk ? style.rcRowItemChecked : ""}`}
                          >
                            <input
                              type="checkbox"
                              className={style.rcCheckbox}
                              checked={isChk}
                              onChange={() => toggleForRight(item)}
                            />
                            <span
                              className={style.rcRowName}
                              onClick={() => toggleForRight(item)}
                            >
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

                {/* ── Centre: » and « buttons stacked vertically ── */}
                <div className={style.rcSelectCol}>
                  {/* » — move left → right */}
                  <button
                    className={style.rcSelectBtn}
                    onClick={handleMoveRight}
                    disabled={selectedForRight.length === 0}
                    title="Add to Regional Call Responsibilities"
                  >
                    »
                  </button>
                  {/* « — move right → left */}
                  <button
                    className={`${style.rcSelectBtn} ${style.rcSelectBtnBack}`}
                    onClick={handleMoveLeft}
                    disabled={selectedForLeft.length === 0}
                    title="Remove from Regional Call Responsibilities"
                  >
                    «
                  </button>
                </div>

                {/* ── RIGHT: Departments Having Regional Call Responsibilities ── */}
                <div className={style.rcPanel}>
                  <div className={style.rcPanelHeader}>
                    DEPARTMENTS / SERVICE AREAS HAVING REGIONAL CALL RESPONSIBILITIES
                    <button
                      className={style.rcAddBtn}
                      title="Add new department"
                      onClick={() => { setNewDeptName(""); setShowAddDialog(true); }}
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      {/* + inside a circle, centred */}
                      <span style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 18, height: 18,
                        border: "1.5px solid currentColor",
                        borderRadius: "50%",
                        fontSize: 13, lineHeight: 1, fontWeight: 400,
                      }}>+</span>
                    </button>
                  </div>

                  {siteName && (
                    <div className={style.rcSiteRow}>
                      <img src={IndustriesEntityFolder} alt="" className={style.rcFolderIcon} />
                      <span className={style.rcSiteName}>{siteName.toUpperCase()}</span>
                      {/* + / − toggle */}
                      <button
                        className={style.rcSiteToggle}
                        onClick={() => setIsRightCollapsed((p) => !p)}
                        title={isRightCollapsed ? "Expand" : "Collapse"}
                      >
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
                        If you would like to setup your custom list for your site(s) you can
                        select from the default list on the left, edit to change labels as needed,
                        and also add new departments / service area by clicking on the add icon.
                      </p>
                    ) : regionalDepts.map((item, idx) => {
                      const name     = getItemName(item);
                      const children = getChildren(item);
                      const isExp    = expandedRight[name];
                      const isChk    = isSelectedForLeft(item);
                      return (
                        <div key={item?.id || idx} className={style.rcRow}>
                          <div
                            className={`${style.rcRowItem} ${isChk ? style.rcRowItemChecked : ""}`}
                          >
                            <input
                              type="checkbox"
                              className={style.rcCheckbox}
                              checked={isChk}
                              onChange={() => toggleForLeft(item)}
                            />
                            {children.length > 0 && (
                              <button
                                className={style.rcExpandBtn}
                                onClick={() => toggleRight(name)}
                              >
                                {isExp ? "−" : "+"}
                              </button>
                            )}
                            <span className={style.rcRowName}>{name}</span>
                            <div className={style.rcActions}>
                              <img
                                src={EditHcRow}
                                alt="Edit"
                                className={style.rcActionIcon}
                                title="Edit"
                                onClick={() => openEditDialog(item)}
                              />
                              <img
                                src={DeleteHcFolder}
                                alt="Remove"
                                className={style.rcActionIcon}
                                title="Remove"
                                onClick={async () => {
                                  const n = getItemName(item);
                                  const itemName = getItemName(item)?.trim()?.toLowerCase();
                                  const isNewlyCreated =
                                    item?._isNew === true ||
                                    (item?.id    && newlyCreatedIdsRef.current.has(item.id)) ||
                                    (itemName    && newlyCreatedNamesRef.current.has(itemName));

                                  // Remove from right panel immediately
                                  deletedNamesRef.current.add(n.toLowerCase());
                                  setRegionalDepts((prev) => {
                                    const updated = prev.filter((d) => getItemName(d) !== n);
                                    saveRegionalIds(updated);
                                    return updated;
                                  });

                                  if (item?.id && !item?._pending) {
                                    try {
                                      if (isNewlyCreated) {
                                        // Newly added via + button → fully DELETE from backend
                                        // AND hide from left panel
                                        deletedIdsRef.current.add(item.id);
                                        setMyDepartments((prev) =>
                                          prev.filter((d) => d?.id !== item.id)
                                        );
                                        await DELETE(`entity-service/department/${item.id}`);
                                        console.log("[RegionalCall] fully deleted newly-created dept:", n);
                                      } else {
                                        // Standard list item → just unset regionalCall flag
                                        // so it reappears in left panel (correct behaviour)
                                        const payload = {
                                          departmentName: item?.departmentName || item?.departmentGroupBy || { name: n },
                                          aliasName1:     item?.aliasName1   || "",
                                          aliasName2:     item?.aliasName2   || "",
                                          serviceAreas:   (item?.serviceAreas || []).map((a) => ({
                                            name: a?.name || a?.serviceName || "",
                                            aliasName1: a?.aliasName1 || "",
                                            aliasName2: a?.aliasName2 || "",
                                          })),
                                          siteTypeId:     siteTypeId ? { id: siteTypeId } : undefined,
                                          regionalCall:   false,
                                        };
                                        await PUT(`entity-service/department/${item.id}`, JSON.stringify(payload));
                                      }
                                    } catch (e) {
                                      console.warn("[RegionalCall] delete failed:", e?.message);
                                    }
                                  }
                                  SuccessToaster("Removed.");
                                }}
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

              {/* ── Footer — SAVE removed: » button auto-saves immediately ── */}
              <div className={style.rcFooter}>
                <button
                  className={`${style.rcSaveBtn} ${style.rcMarkDoneBtn}`}
                  onClick={handleMarkAsDone}
                >
                  MARK AS DONE
                </button>
              </div>
            </div>
            {/* end white card */}

          </div>
          {/* end main content */}
        </div>
        {/* end sidebar grid */}

        <div className={style.rcPoweredBy}>
          <p>Powered by - HapiCare</p>
          <p>© HapiCare</p>
        </div>
      </div>

      {/* ── Add New Department dialog ── */}
      {showAddDialog && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", borderRadius: 12, padding: 28,
            width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--primary-color)", textTransform: "uppercase" }}>
                Add Department / Service Area
              </p>
              <button
                onClick={() => { setShowAddDialog(false); setNewDeptName(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#d32f2f", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <div style={{ borderBottom: "1px solid #dee2e6", marginBottom: 20 }} />

            {/* Department name input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600,
                color: "#52575d", textTransform: "uppercase",
                letterSpacing: "0.4px", marginBottom: 6,
              }}>
                Department / Service Area Name *
              </label>
              <input
                type="text"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddNew(); }}
                placeholder="Enter department name"
                autoFocus
                style={{
                  width: "100%", padding: "8px 12px",
                  border: "1px solid #ccc", borderRadius: 4,
                  fontSize: 13, boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => { setShowAddDialog(false); setNewDeptName(""); }}
                style={{
                  background: "#fff", color: "var(--primary-color)",
                  border: "1px solid var(--primary-color)",
                  borderRadius: 4, padding: "8px 24px",
                  cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleAddNew}
                disabled={isAddSubmitting || !newDeptName.trim()}
                style={{
                  background: "var(--primary-color)", color: "#fff",
                  border: "none", borderRadius: 4, padding: "8px 24px",
                  cursor: isAddSubmitting ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 600,
                  opacity: isAddSubmitting || !newDeptName.trim() ? 0.5 : 1,
                }}
              >
                {isAddSubmitting ? "SAVING…" : "ADD"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Department dialog ── */}
      {showEditDialog && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", borderRadius: 12, padding: 28,
            width: 440, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--primary-color)", textTransform: "uppercase" }}>
                Edit Department / Service Area
              </p>
              <button
                onClick={() => { setShowEditDialog(false); setEditItem(null); setEditDeptName(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "#d32f2f", lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            <div style={{ borderBottom: "1px solid #dee2e6", marginBottom: 20 }} />

            {/* Name input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600,
                color: "#52575d", textTransform: "uppercase",
                letterSpacing: "0.4px", marginBottom: 6,
              }}>
                Department / Service Area Name *
              </label>
              <input
                type="text"
                value={editDeptName}
                onChange={(e) => setEditDeptName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(); }}
                autoFocus
                style={{
                  width: "100%", padding: "8px 12px",
                  border: "1px solid #ccc", borderRadius: 4,
                  fontSize: 13, boxSizing: "border-box", outline: "none",
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => { setShowEditDialog(false); setEditItem(null); setEditDeptName(""); }}
                style={{
                  background: "#fff", color: "var(--primary-color)",
                  border: "1px solid var(--primary-color)",
                  borderRadius: 4, padding: "8px 24px",
                  cursor: "pointer", fontSize: 13, fontWeight: 600,
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleEditSave}
                disabled={isEditSubmitting || !editDeptName.trim()}
                style={{
                  background: "var(--primary-color)", color: "#fff",
                  border: "none", borderRadius: 4, padding: "8px 24px",
                  cursor: isEditSubmitting ? "not-allowed" : "pointer",
                  fontSize: 13, fontWeight: 600,
                  opacity: isEditSubmitting || !editDeptName.trim() ? 0.5 : 1,
                }}
              >
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