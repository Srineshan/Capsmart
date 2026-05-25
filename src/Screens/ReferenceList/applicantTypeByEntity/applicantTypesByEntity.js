import React, { Fragment, useState, useEffect, useRef } from "react";
import Navbar from "../../../Components/Navbar";
import SideBar from "../../../Components/Sidebar";
import style from "../department/department.module.scss";
import { GET, POST, DELETE, PUT } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import ApplicantTypeDialog from "./ApplicantTypeDialog";
import IndustriesEntityFolder from "../../../images/industriesEntityFolder.png";
import EditHcRow from "../../../images/editHcRow.png";
import DeleteHcFolder from "../../../images/deleteHcFolder.png";

// ── Country flag dropdown (same as Department.js) ─────────────────────────────
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

// ── Name helpers ──────────────────────────────────────────────────────────────
const getItemName = (item) =>
  item?.applicantType     ||
  item?.applicantTypeName ||
  item?.name              || "";

const getCategory = (item) => {
  // Prefer category over siteType — siteType is a site name, not a staff category
  const cat = item?.category || item?.siteType;
  if (!cat) return "";
  if (typeof cat === "string") return cat;
  if (typeof cat === "object") return cat?.category || cat?.name || cat?.categoryName || cat?.type || "";
  return "";
};

// Unique key per item — use id if available, else name (master records may lack id)
const getItemKey = (item) => item?.id || getItemName(item);

const ApplicantTypesByEntity = () => {
  const [entityId, setEntityId]           = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [siteTypeId, setSiteTypeId]       = useState("");
  const [siteId, setSiteId]               = useState("");
  const [siteName, setSiteName]           = useState("");
  const [isExpanded, setIsExpanded]       = useState(true);

  // Country dropdown
  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // LEFT panel — Standard / Master list (applicantTypeMaster)
  const [standardList, setStandardList]                   = useState([]);
  const [selectedStandardItems, setSelectedStandardItems] = useState([]);
  const [isStandardCollapsed, setIsStandardCollapsed]     = useState(false);
  const [isStandardLoading, setIsStandardLoading]         = useState(false);

  // RIGHT panel — My Custom list (applicantType entity level)
  const [customList, setCustomList]             = useState([]);
  const [isCustomCollapsed, setIsCustomCollapsed] = useState(false);
  const [isCustomLoading, setIsCustomLoading]   = useState(false);

  // Category list for dialog dropdown
  const [categoryList, setCategoryList] = useState([]);

  // Deleted tracking — items never reappear after deletion
  const deletedIdsRef   = useRef(new Set());
  const deletedNamesRef = useRef(new Set());

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit, setIsEdit]             = useState(false);
  const [editData, setEditData]         = useState(null);
  // isSaving removed — SAVE button removed

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getSiteDisplayName = (site) => {
    const raw = site?.siteName;
    if (typeof raw === "string" && raw) return raw;
    if (typeof raw === "object" && raw) return raw?.siteName || raw?.name || "";
    return site?.name || site?.siteTypeName || "";
  };

  // applyFilters for CUSTOM list — only removes truly deleted items by ID.
  // Does NOT deduplicate by name — the same applicant type (e.g. "nurse") can
  // exist multiple times with different categories, which is valid.
  const applyFilters = (data) => {
    return (data || []).filter((item) => {
      if (item?.id && deletedIdsRef.current.has(item.id)) return false;
      const name = getItemName(item);
      if (name && deletedNamesRef.current.has(`${item.id}`)) return false;
      return true;
    });
  };

  // Extract unique categories — filter out junk "string" test values
  const extractCategories = (list) => {
    const seen = new Set();
    const cats = [];
    list.forEach((item) => {
      const cat = item?.category || item?.siteType;
      if (!cat) return;
      const id    = typeof cat === "object" ? cat?.id || cat?.category || cat?.type : cat;
      const label = typeof cat === "object"
        ? cat?.category || cat?.name || cat?.categoryName || cat?.type || ""
        : cat;
      // Filter out "string" junk and blanks
      if (id && label && label.toLowerCase() !== "string" && !seen.has(id)) {
        seen.add(id);
        cats.push({ id, type: label });
      }
    });
    return cats;
  };

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    getEntity();
    getSites();
  }, []);
  useEffect(() => {
    if (entityId) {
      getLastModifiedDate();
      loadCustomList(entityId); // ✅ Load custom list once entityId is ready
    }
  }, [entityId]);
  useEffect(() => {
    // Load standard/master list once siteTypeId is available
    if (siteTypeId) loadStandardList();
  }, [siteTypeId]);

  // ── API ───────────────────────────────────────────────────────────────────
  const getEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]) setEntityId(data[0].id);
    } catch (e) { console.error("entity:", e); }
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
    } catch (e) { console.error("sites:", e); }
  };

  const getLastModifiedDate = async () => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${entityId}`);
      const ts = data?.applicantTypes?.lastModified || data?.departments?.lastModified;
      if (!ts) return;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) {}
  };

  // LEFT — Master / Standard list: GET /applicantTypeMaster?siteTypeId=
  const loadStandardList = async () => {
    setIsStandardLoading(true);
    try {
      let data = [];
      try {
        const res = await GET(`entity-service/applicantTypeMaster?siteTypeId=${siteTypeId}`);
        data = res?.data || [];
      } catch (e) {}
      if (data.length === 0) {
        try {
          const res = await GET("entity-service/applicantTypeMaster");
          data = res?.data || [];
        } catch (e) {}
      }
      // Deduplicate by name, filter out junk test data like "string"
      const seen = new Set();
      const deduped = data.filter((item) => {
        const name = getItemName(item)?.trim();
        if (!name || name.toLowerCase() === "string" || seen.has(name.toLowerCase())) return false;
        seen.add(name.toLowerCase());
        return true;
      });
      setStandardList(deduped);
      const cats = extractCategories(deduped);
      if (cats.length > 0) setCategoryList(cats);
    } finally { setIsStandardLoading(false); }
  };

  // RIGHT — Entity custom list: GET /applicantType?entityId=
  const loadCustomList = async (resolvedEntityId) => {
    setIsCustomLoading(true);
    const eid = resolvedEntityId || entityId;
    try {
      let data = [];
      // ✅ PRIMARY: filter by entityId — ensures we get THIS entity's applicant types
      if (eid) {
        try {
          const res = await GET(`entity-service/applicantType?entityId=${eid}`);
          data = res?.data?.content || res?.data || [];
          console.log("[ApplicantType] by entityId:", data.length, "entityId:", eid);
        } catch (e) { console.warn("[ApplicantType] entityId fetch failed:", e); }
      }
      // Fallback: no filter
      if (data.length === 0) {
        try {
          const res = await GET("entity-service/applicantType");
          data = res?.data?.content || res?.data || [];
          console.log("[ApplicantType] all records (fallback):", data.length);
        } catch (e) {}
      }
      // Only filter out items explicitly deleted by ID — no name dedup
      const filtered = applyFilters(data);
      setCustomList(filtered);
      const cats = extractCategories(filtered);
      if (cats.length > 0) setCategoryList((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...cats.filter((c) => !seen.has(c.id))];
      });
    } finally { setIsCustomLoading(false); }
  };

  // ── SELECT: move checked master items → right panel (optimistic, fire-and-forget) ──
  const handleSelect = () => {
    if (selectedStandardItems.length === 0) return;

    const pendingItems = selectedStandardItems.map((item) => ({
      ...item,
      _pending: true,
      _localId: `local_${Date.now()}_${Math.random()}`,
    }));

    // Update UI immediately
    setCustomList((prev) => [...prev, ...pendingItems]);
    setSelectedStandardItems([]);
    SuccessToaster(`${pendingItems.length} item(s) added successfully.`);

    // Build payload — map siteType → category for the API
    const payload = pendingItems.map((item) => {
      const categoryValue = item?.siteType
        ? { id: item?.siteTypeId?.id || item?.siteType?.id || item?.siteType?.type, category: item?.siteType?.type || "" }
        : item?.category || undefined;
      return {
        applicantType: getItemName(item),
        description:   item?.description || "",
        entityId:      entityId || undefined,
        siteTypeId:    siteTypeId ? { id: siteTypeId } : undefined,
        category:      categoryValue,
        customized:    true,
      };
    });

    POST("entity-service/applicantType", JSON.stringify(payload))
      .then(() => {
        console.log("[ApplicantType] SELECT POST success — reloading list");
        // Reload from API to get real IDs assigned by backend
        loadCustomList(entityId);
      })
      .catch((err) => {
        // POST failed — clear _pending so user sees items are not saved
        console.warn("[ApplicantType] SELECT POST failed:", err?.message);
        setCustomList((prev) =>
          prev.map((d) => {
            if (pendingItems.some((p) => p._localId === d._localId)) {
              const { _pending, _localId, ...rest } = d;
              return { ...rest, _pending: true }; // keep as pending so SAVE button stays active
            }
            return d;
          })
        );
        ErrorToaster("Auto-save failed. Click SAVE to retry.");
      });
  };

  // handleSave removed — SELECT auto-saves immediately via fire-and-forget POST

  // ── DELETE ────────────────────────────────────────────────────────────────
  const handleDelete = async (item) => {
    const id   = item?.id;
    const name = getItemName(item)?.trim()?.toLowerCase();

    // Remove from custom list — customNames filter will auto-restore it to standard list
    setCustomList((prev) => prev.filter((c) => c?.id ? c.id !== id : getItemName(c)?.trim()?.toLowerCase() !== name));
    // Also clear from selectedStandardItems in case it was pre-checked
    setSelectedStandardItems((prev) => prev.filter((s) => getItemName(s)?.trim()?.toLowerCase() !== name));
    SuccessToaster("Applicant type removed.");
    if (id && !item._pending) {
      try { await DELETE(`entity-service/applicantType/${id}`); }
      catch (err) { console.warn("[ApplicantType] DELETE:", err?.message); }
    }
    // Note: deletedIdsRef NOT used here — we WANT deleted items to reappear in standard list
  };

  // ── Mark As Done ──────────────────────────────────────────────────────────
  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          applicantTypes: { status: "DONE", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) {}
    finally {
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── Checkbox — use getItemKey (id or name) since master records may lack id ──
  const toggleStandardItem = (item) => {
    const key = getItemKey(item);
    setSelectedStandardItems((prev) =>
      prev.some((s) => getItemKey(s) === key)
        ? prev.filter((s) => getItemKey(s) !== key)
        : [...prev, item]
    );
  };
  const isSelected = (item) =>
    selectedStandardItems.some((s) => getItemKey(s) === getItemKey(item));

  // Standard list: hide items already in custom list (by name, case-insensitive)
  // When deleted from custom, they reappear here automatically (no extra logic needed
  // because customList state drives this filter reactively)
  const customNames     = new Set(customList.map((i) => getItemName(i)?.trim()?.toLowerCase()));
  const filteredStandard = standardList.filter(
    (item) => !customNames.has(getItemName(item)?.trim()?.toLowerCase())
  );
  // hasPending removed — SAVE button removed; SELECT auto-saves

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />

      {/* Grey page background */}
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

            {/* ── PAGE HEADER — outside white card ── */}
            <div className={style.deptPageHeader}>
              <div className={style.deptPageHeaderLeft}>
                <span className={style.deptPageTitle}>
                  APPLICANT TYPES BY ENTITY / SITES
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
                  className={style.deptCloseBtn}
                  onClick={() => { window.location.href = "/referencelist"; }}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* ── WHITE CARD ── */}
            <div className={style.deptCard}>

              {/* Two-panel grid */}
              <div className={style.deptPanelGrid}>

                {/* ── LEFT: Standard / Master list ── */}
                <div className={style.deptPanel}>
                  <div className={style.deptPanelHeader}>
                    STANDARD LIST IN USE - DEFAULT
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
                        <p className={style.deptEmpty}>
                          No standard applicant types available.
                        </p>
                      ) : filteredStandard.map((item, idx) => {
                        const name  = getItemName(item);
                        const cat   = getCategory(item);
                        const isChk = isSelected(item);
                        return (
                          <div key={getItemKey(item) || idx} className={style.deptRow}>
                            <div className={`${style.deptRowItem} ${isChk ? style.deptRowItemChecked : ""}`}>
                              <input
                                type="checkbox"
                                className={style.deptCheckbox}
                                checked={isChk}
                                onChange={() => toggleStandardItem(item)}
                              />
                              <span
                                className={style.deptRowName}
                                onClick={() => toggleStandardItem(item)}
                              >
                                {name}
                              </span>
                              {cat && (
                                <span style={{
                                  fontSize: 10, color: "#888",
                                  background: "#f0f0f0", borderRadius: 3,
                                  padding: "1px 5px", flexShrink: 0,
                                }}>
                                  {cat}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── SELECT button (centre column) ── */}
                <div className={style.deptSelectCol}>
                  <button
                    className={style.deptSelectBtn}
                    onClick={handleSelect}
                    disabled={selectedStandardItems.length === 0}
                  >
                    SELECT
                    <span className={style.deptSelectArrow}>»</span>
                  </button>
                </div>

                {/* ── RIGHT: My Custom list ── */}
                <div className={style.deptPanel}>
                  <div className={style.deptPanelHeader}>
                    MY CUSTOM LIST
                    <button
                      className={style.deptAddBtn}
                      title="Add new applicant type"
                      onClick={() => { setEditData(null); setIsEdit(false); setIsDialogOpen(true); }}
                      style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      {/* + inside a circle — gap between circle and any surrounding content */}
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
                          Select from the default list on the left, edit to change labels
                          as needed, and also add new applicant types by clicking the + icon.
                        </p>
                      ) : customList.map((item, idx) => {
                        const name         = getItemName(item);
                        const cat          = getCategory(item);
                        const isPending    = item._pending === true;
                        const lastUpdated  = item?.lastModifiedDate || item?.lastModified ||
                                            item?.updatedAt || item?.createdDate || "";
                        const dateLabel    = lastUpdated
                          ? new Date(lastUpdated).toLocaleDateString("en-US", {
                              month: "short", day: "2-digit", year: "numeric",
                            })
                          : "";
                        return (
                          <div key={item?.id || idx} className={style.deptRow}>
                            <div className={style.deptRowItem}>
                              <span className={style.deptRowName}>
                                {name}
                                {isPending && (
                                  <span className={style.deptPendingBadge}>unsaved</span>
                                )}
                              </span>
                              {/* Category tag */}
                              {cat && (
                                <span style={{
                                  fontSize: 10, color: "#666",
                                  background: "#eef0f3", borderRadius: 3,
                                  padding: "2px 6px", flexShrink: 0,
                                  marginRight: 4, whiteSpace: "nowrap",
                                }}>
                                  {cat}
                                </span>
                              )}
                              {/* Last updated date */}
                              {dateLabel && (
                                <span style={{
                                  fontSize: 10, color: "#9e9e9e",
                                  flexShrink: 0, marginRight: 6,
                                  whiteSpace: "nowrap",
                                }}>
                                  {dateLabel}
                                </span>
                              )}
                              <div className={style.deptActions}>
                                <img
                                  src={EditHcRow}
                                  alt="Edit"
                                  className={style.deptActionIcon}
                                  onClick={() => {
                                    setEditData(item);
                                    setIsEdit(true);
                                    setIsDialogOpen(true);
                                  }}
                                />
                                <img
                                  src={DeleteHcFolder}
                                  alt="Delete"
                                  className={style.deptActionIcon}
                                  onClick={() => handleDelete(item)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>


            </div>
            {/* end white card */}

          </div>
          {/* end main content */}

        </div>
      </div>

      {/* ── Dialog ── */}
      {isDialogOpen && (
        <ApplicantTypeDialog
          open={isDialogOpen}
          handleClose={(needRefetch, newItem) => {
            setIsDialogOpen(false);
            setIsEdit(false);
            setEditData(null);
            if (needRefetch) {
              if (newItem) {
                // New item added — append directly to local state, no API reload
                setCustomList((prev) => [...prev, newItem]);
              } else {
                // Edit — update in place
                if (editData) {
                  setCustomList((prev) =>
                    prev.map((c) => c?.id === editData?.id ? { ...c, ...editData } : c)
                  );
                }
              }
            }
          }}
          selectedApplicant={editData}
          isEdit={isEdit}
          entityId={entityId}
          entityName={siteName}
          categoryList={categoryList}
        />
      )}
    </Fragment>
  );
};

export default ApplicantTypesByEntity;