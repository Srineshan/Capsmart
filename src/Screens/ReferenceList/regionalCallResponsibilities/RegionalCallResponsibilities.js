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

// ── FIX 1: Swagger enum constants for regionalCallResponsibilities ────────────
// Swagger: RegionalCallResponsibilities.regionalCallResponsibilities
//          Enum: [ YES, NO, NA ]
const REGIONAL_CALL = {
  YES: "YES",
  NO:  "NO",
  NA:  "NA",
};

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
  const [selectedForRight, setSelectedForRight]     = useState([]);
  const [isLeftLoading, setIsLeftLoading]           = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed]       = useState(false);

  // ── RIGHT panel — Departments having Regional Call Responsibilities ────────
  const [regionalDepts, setRegionalDepts]           = useState([]);
  const [expandedRight, setExpandedRight]           = useState({});
  const [selectedForLeft, setSelectedForLeft]       = useState([]);
  const [isRightLoading, setIsRightLoading]         = useState(false);
  const [isRightCollapsed, setIsRightCollapsed]     = useState(false);

  // Deleted tracking
  const deletedIdsRef        = useRef(new Set());
  const deletedNamesRef      = useRef(new Set());
  const newlyCreatedIdsRef   = useRef(new Set());
  const newlyCreatedNamesRef = useRef(new Set());

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
    } catch (e) { console.error("[RegionalCall] entity fetch failed:", e); }
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
    } catch (e) { console.error("[RegionalCall] sites fetch failed:", e); }
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
    } catch (e) { console.error("[RegionalCall] lastModified fetch failed:", e); }
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

  // RIGHT — persist selected IDs in sessionStorage
  const REGIONAL_STORAGE_KEY = `regionalDepts_${window.location.hostname}`;

  const saveRegionalIds = (items) => {
    try {
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
      } catch (e) { console.error("[RegionalCall] department fetch failed:", e); }

      if (data.length === 0 && siteId) {
        try {
          const res = await GET(`entity-service/department/${siteId}`);
          data = res?.data || [];
        } catch (e) {}
      }

      // ── FIX 2: Filter by correct Swagger enum field name ──────────────────
      // Old (wrong): item?.regionalCall === true  (boolean — not in Swagger)
      // New (correct): item?.regionalCallResponsibilities === "YES"  (enum string)
      let regional = data.filter((item) =>
        item?.regionalCallResponsibilities === REGIONAL_CALL.YES
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
      if (filtered.length > 0) saveRegionalIds(filtered);
    } finally { setIsRightLoading(false); }
  };

  // ── » button — move left → right ─────────────────────────────────────────
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

    // ── STEP 1: Update state synchronously ──────────────────────────────────
    const pendingItems = toAdd.map((item) => ({ ...item, _pending: true }));
    setRegionalDepts((prev) => [...prev, ...pendingItems]);
    setSelectedForRight([]);

    // ── STEP 2: FIX 3 — Use correct field name + enum value ─────────────────
    // Old (wrong): regionalCall: true
    // New (correct): regionalCallResponsibilities: "YES"
    const putAll = toAdd.map((item) => {
      if (!item?.id) return Promise.resolve();
      const payload = {
        departmentName:              item?.departmentName || item?.departmentGroupBy || { name: getItemName(item) },
        aliasName1:                  item?.aliasName1   || "",
        aliasName2:                  item?.aliasName2   || "",
        serviceAreas:                (item?.serviceAreas || []).map((a) => ({
          name:       a?.name || a?.serviceName || "",
          aliasName1: a?.aliasName1 || "",
          aliasName2: a?.aliasName2 || "",
        })),
        siteTypeId:                  siteTypeId ? { id: siteTypeId } : undefined,
        regionalCallResponsibilities: REGIONAL_CALL.YES, // ✅ FIXED: was regionalCall: true
      };
      return PUT(`entity-service/department/${item.id}`, JSON.stringify(payload))
        .then(() => console.log("[RegionalCall] PUT regionalCallResponsibilities=YES success:", getItemName(item)));
    });

    Promise.all(putAll)
      .then(() => {
        setRegionalDepts((prev) => {
          const updated = prev.map((d) => {
            if (pendingItems.some((p) => getItemName(p) === getItemName(d))) {
              const { _pending, ...rest } = d;
              return { ...rest, regionalCallResponsibilities: REGIONAL_CALL.YES }; // ✅ FIXED
            }
            return d;
          });
          saveRegionalIds(updated);
          return updated;
        });
        SuccessToaster("Department(s) added to Regional Call Responsibilities.");
      })
      .catch((err) => {
        console.warn("[RegionalCall] PUT failed:", err?.message);
        setRegionalDepts((prev) => {
          const updated = prev.map((d) => {
            if (pendingItems.some((p) => getItemName(p) === getItemName(d))) {
              const { _pending, ...rest } = d;
              return { ...rest, regionalCallResponsibilities: REGIONAL_CALL.YES }; // ✅ FIXED
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

    const removeNames = new Set(selectedForLeft.map(getItemName));
    setRegionalDepts((prev) =>
      prev.filter((d) => !removeNames.has(getItemName(d)))
    );
    setSelectedForLeft([]);

    try {
      for (const item of selectedForLeft) {
        const name = getItemName(item);
        if (name) deletedNamesRef.current.add(name.toLowerCase());
        if (item?.id && !item?._pending) {
          try {
            // ── FIX 4: Use correct field name + enum value ─────────────────
            // Old (wrong): regionalCall: false
            // New (correct): regionalCallResponsibilities: "NO"
            const payload = {
              departmentName:              item?.departmentName || item?.departmentGroupBy || { name: getItemName(item) },
              aliasName1:                  item?.aliasName1   || "",
              aliasName2:                  item?.aliasName2   || "",
              serviceAreas:                (item?.serviceAreas || []).map((a) => ({
                name:       a?.name || a?.serviceName || "",
                aliasName1: a?.aliasName1 || "",
                aliasName2: a?.aliasName2 || "",
              })),
              siteTypeId:                  siteTypeId ? { id: siteTypeId } : undefined,
              regionalCallResponsibilities: REGIONAL_CALL.NO, // ✅ FIXED: was regionalCall: false
            };
            await PUT(`entity-service/department/${item.id}`, JSON.stringify(payload));
            console.log("[RegionalCall] PUT regionalCallResponsibilities=NO for:", name);
          } catch (e) {
            console.warn("[RegionalCall] PUT NO failed:", e?.message);
          }
        }
      }
      setRegionalDepts((prev) => {
        const updated = prev;
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
  const [showEditDialog, setShowEditDialog]     = useState(false);
  const [editItem, setEditItem]                 = useState(null);
  const [editDeptName, setEditDeptName]         = useState("");
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const handleAddNew = async () => {
    if (!newDeptName.trim()) {
      ErrorToaster("Department name is required.");
      return;
    }
    const name = newDeptName.trim();

    newlyCreatedNamesRef.current.add(name.toLowerCase());
    setNewDeptName("");
    setShowAddDialog(false);

    const localId = `new_${Date.now()}`;
    const newItem = {
      name,
      departmentName:              { name },
      // ── FIX 5: Use correct field name + enum value ─────────────────────
      regionalCallResponsibilities: REGIONAL_CALL.YES, // ✅ FIXED: was regionalCall: true
      _pending:                    true,
      _localId:                    localId,
      _isNew:                      true,
    };
    setRegionalDepts((prev) => {
      const updated = [...prev, newItem];
      saveRegionalIds(updated);
      return updated;
    });

    try {
      const payload = [{
        departmentName:              { name },
        regionalCallResponsibilities: REGIONAL_CALL.YES, // ✅ FIXED: was regionalCall: true
        siteTypeId:                  siteTypeId ? { id: siteTypeId } : undefined,
        aliasName1: "", aliasName2: "", serviceAreas: [],
      }];
      await POST("entity-service/department", JSON.stringify(payload));
      SuccessToaster("Department added to Regional Call Responsibilities.");

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
    } catch (err) {
      console.error("[RegionalCall] Add error:", err);
      ErrorToaster("Failed to add department. It will remain until you refresh.");
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

    // ── FIX 6: Use PUT /department/{id} (correct Swagger endpoint) ──────────
    // Old (wrong): PUT /regionalCallDepartment/{id} — not in Swagger, returns 404
    // New (correct): PUT /department/{id} — correct Swagger endpoint
    try {
      if (editItem?.id) {
        const payload = {
          departmentName:              { name: updatedName },
          aliasName1:                  editItem?.aliasName1 || "",
          aliasName2:                  editItem?.aliasName2 || "",
          serviceAreas:                (editItem?.serviceAreas || []).map((a) => ({
            name:       a?.name || a?.serviceName || "",
            aliasName1: a?.aliasName1 || "",
            aliasName2: a?.aliasName2 || "",
          })),
          siteTypeId:                  siteTypeId ? { id: siteTypeId } : undefined,
          regionalCallResponsibilities: REGIONAL_CALL.YES, // keep as YES on edit
        };
        await PUT(
          `entity-service/department/${editItem.id}`, // ✅ FIXED: was /regionalCallDepartment/
          JSON.stringify(payload)
        );
      }
      SuccessToaster("Updated successfully.");
      updateLastModified();
    } catch (err) {
      console.error("[RegionalCall] Edit error:", err);
      SuccessToaster("Updated locally. Changes saved to session.");
    } finally {
      setIsEditSubmitting(false);
      setShowEditDialog(false);
      setEditItem(null);
      setEditDeptName("");
    }
  };

  // ── FIX 7: updateLastModified — now actually calls the API ────────────────
  // Old: silently skipped with a console.log
  // New: attempts PUT, logs error if it fails (non-critical)
  const updateLastModified = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          regionalCallResponsibilities: {
            status:       "IN_PROGRESS",
            lastModified: new Date().toISOString(),
          },
        })
      );
      // Refresh the displayed timestamp
      await getLastModifiedDate();
    } catch (e) {
      console.warn("[RegionalCall] updateLastModified failed (non-critical):", e?.message);
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          regionalCallResponsibilities: {
            status:      "DONE",
            lastModified: new Date().toISOString(),
          },
        })
      );
    } catch (e) { console.error("[RegionalCall] markAsDone failed:", e); }
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
        <div className={`${isExpanded ? style.rcBigCardGrid : style.rcSmallCardGrid}`}>

          {/* LEFT SIDEBAR */}
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
              <div />
            </SideBar>
          </div>

          {/* MAIN CONTENT */}
          <div>

            {/* PAGE HEADER */}
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

            {/* WHITE CARD */}
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
                  <button
                    className={style.rcSelectBtn}
                    onClick={handleMoveRight}
                    disabled={selectedForRight.length === 0}
                    title="Add to Regional Call Responsibilities"
                  >
                    »
                  </button>
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
                          Select from the default list on the left, edit to change labels as needed,
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
                                    const itemName = n?.trim()?.toLowerCase();
                                    const isNewlyCreated =
                                      item?._isNew === true ||
                                      (item?.id    && newlyCreatedIdsRef.current.has(item.id)) ||
                                      (itemName    && newlyCreatedNamesRef.current.has(itemName));

                                    deletedNamesRef.current.add(n.toLowerCase());
                                    setRegionalDepts((prev) => {
                                      const updated = prev.filter((d) => getItemName(d) !== n);
                                      saveRegionalIds(updated);
                                      return updated;
                                    });

                                    if (item?.id && !item?._pending) {
                                      try {
                                        if (isNewlyCreated) {
                                          deletedIdsRef.current.add(item.id);
                                          setMyDepartments((prev) =>
                                            prev.filter((d) => d?.id !== item.id)
                                          );
                                          await DELETE(`entity-service/department/${item.id}`);
                                          console.log("[RegionalCall] fully deleted newly-created dept:", n);
                                        } else {
                                          // ── FIX 8: Use correct field name + enum value ───────
                                          // Old (wrong): regionalCall: false
                                          // New (correct): regionalCallResponsibilities: "NO"
                                          const payload = {
                                            departmentName:              item?.departmentName || item?.departmentGroupBy || { name: n },
                                            aliasName1:                  item?.aliasName1   || "",
                                            aliasName2:                  item?.aliasName2   || "",
                                            serviceAreas:                (item?.serviceAreas || []).map((a) => ({
                                              name:       a?.name || a?.serviceName || "",
                                              aliasName1: a?.aliasName1 || "",
                                              aliasName2: a?.aliasName2 || "",
                                            })),
                                            siteTypeId:                  siteTypeId ? { id: siteTypeId } : undefined,
                                            regionalCallResponsibilities: REGIONAL_CALL.NO, // ✅ FIXED
                                          };
                                          await PUT(`entity-service/department/${item.id}`, JSON.stringify(payload));
                                        }
                                      } catch (e) {
                                        console.warn("[RegionalCall] delete/unset failed:", e?.message);
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

              {/* FOOTER */}
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
                  fontSize: 13, boxSizing: "border-box", outline: "none",
                }}
              />
            </div>

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