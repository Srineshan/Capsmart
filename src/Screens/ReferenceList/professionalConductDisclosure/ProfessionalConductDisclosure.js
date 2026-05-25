import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import style from "./../index.module.scss";
import { GET, PUT, DELETE } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";
import ApplicantTable from "../common/Table";
import ApplicantSideBar from "../common/SideBar";
import Typography from "@mui/material/Typography";
import ProfessionalConductDisclosureDialog from "./ProfessionalConductDisclosureDialog";

const ProfessionalConductDisclosure = () => {
  const [entityId,        setEntityId]        = useState("");
  const [lastUpdatedDate, setLastUpdatedDate]  = useState("");

  // Sidebar
  const [applicantTypeList,  setApplicantTypeList]  = useState([]);
  const [selectedSiteName,   setSelectedSiteName]   = useState("");
  const [applicantId,        setApplicantId]         = useState("");

  // Table
  const [disclosures,    setDisclosures]    = useState([]);
  const [allDisclosures, setAllDisclosures] = useState([]);

  // Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEdit,       setIsEdit]       = useState(false);
  const [editData,     setEditData]     = useState(null);

  // Collapsible sub-category rows — tracks which parent row IDs are expanded
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (rowId) => {
    setExpandedRows((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
  };

  const tableHeadKeys = [
    "DISCLOSURE CATEGORY",
    "SUPPORTING DOCUMENTATION",
    "VERIFICATION",
    "LAST UPDATED",
  ];
  const tableDataKeys = [
    "category",
    "supportingDocumentRequired",
    "verificationRequired",
    "lastModifiedDate",
  ];

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Set fallback date immediately so it always shows on mount
    try {
      const now = new Date();
      setLastUpdatedDate(
        `${formatInTimeZone(now, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
      );
    } catch (e) {
      const now = new Date();
      setLastUpdatedDate(now.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }));
    }
    getEntity();
    getApplicantTypes();
    getDisclosures(undefined);
  }, []);

  useEffect(() => {
    if (entityId) getLastModifiedDate(entityId);
  }, [entityId]);

  // Auto-select first sidebar item on load
  useEffect(() => {
    if (applicantTypeList.length > 0 && !applicantId) {
      setApplicantId(applicantTypeList[0]?.id || "");
      setSelectedSiteName(getApplicantLabel(applicantTypeList[0]));
    }
  }, [applicantTypeList]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getApplicantLabel = (item) => {
    const raw = item?.applicantType;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw))      return raw[0] || "";
    return item?.name || "";
  };

  const normalizeRow = (row) => {
    // Convert Java enum → display label
    const formatVerifFrom = (val) => {
      if (!val) return "NA";
      const map = {
        PractisingPhysician: "Practising Physician",
        CurrentEmployer:     "Current Employer",
        FormerEmployer:      "Former Employer",
      };
      return map[val] || val;
    };

    const verifDisplay = row?.verificationRequired === true
      ? formatVerifFrom(row?.verificationRequiredFrom)
      : "NA";

    const mainCat = typeof row?.category === "object"
      ? row.category?.category || row.category?.name || ""
      : row?.category || "";

    const subCat = row?.subCategory || "";
    // Show sub-category row if:
    // - hasSubCategory flag is true, OR
    // - subCategory field has a non-empty value (backend may not set the flag)
    const hasSubCat = (row?.hasSubCategory === true || subCat.trim().length > 0) && subCat.trim().length > 0;

    // Main row — keep ALL raw API fields so edit dialog can read them correctly.
    // Table display uses the overridden keys; edit dialog uses raw values via _raw prefix.
    const mainRow = {
      ...row,                              // raw API fields preserved for edit
      category:              mainCat,      // clean display name
      _hasSubCategory:       !!hasSubCat,
      // Table display values (these overwrite raw booleans for display only)
      supportingDocumentRequired:
        row?.supportingDocumentRequired === true  ? "YES"
        : row?.supportingDocumentRequired === false ? "NO"
        : String(row?.supportingDocumentRequired || "NO"),
      verificationRequired:  verifDisplay,
      lastModifiedDate:
        row?.lastModifiedDate || row?.lastModified || row?.updatedAt || null,
      // Raw API values preserved for edit dialog — use exact schema field names
      _rawSupportingDocumentRequired: row?.supportingDocumentRequired,
      _rawVerificationRequired:       row?.verificationRequired,
      _rawVerificationRequiredFrom:   row?.verificationRequiredFrom,
      // Schema: consentFormRequired (boolean), responseOptionText (string)
      consentFormRequired:            row?.consentFormRequired ?? false,
      responseOptionText:             row?.responseOptionText || row?.applicantGuidanceText || "",
      // Schema: siteType is singular EntityType {id, type} — preserve as-is
      siteType:                       row?.siteType || null,
    };

    if (!hasSubCat) return [mainRow];

    // Sub-category row — clean name, the render layer handles the − indicator
    const subRow = {
      ...mainRow,
      id:              `${row.id}_sub`,
      category:        subCat.trim(),   // clean sub-category name
      _isSubRow:       true,
      _hasSubCategory: false,           // sub-rows don't have their own children
    };

    return [mainRow, subRow];
  };

  // Flatten rows (each normalizeRow returns 1 or 2 rows)
  const flattenRows = (rows) => rows.flatMap((r) => normalizeRow(r));

  // ── API ───────────────────────────────────────────────────────────────────
  const getEntity = async () => {
    try {
      const { data } = await GET("entity-service/entity");
      if (data?.[0]) setEntityId(data[0].id);
    } catch (e) { console.error("getEntity:", e); }
  };

  const getApplicantTypes = async () => {
    try {
      const { data } = await GET("entity-service/applicantType");
      const raw = Array.isArray(data) ? data : data?.content || [];
      const seen   = new Set();
      const unique = raw.filter((item) => {
        const label = getApplicantLabel(item)?.trim()?.toLowerCase();
        if (!label || seen.has(label)) return false;
        seen.add(label);
        return true;
      });
      setApplicantTypeList(unique);
    } catch (e) { console.error("getApplicantTypes:", e); }
  };

  const getLastModifiedDate = async (id) => {
    try {
      const { data } = await GET(`entity-service/referenceList/entity/${id}`);
      // referenceList response keys from Image 3 network tab
      const ts =
        data?.departments?.lastModified ||           // fallback — always present
        data?.disclosures?.lastModified ||
        data?.professionalConductDisclosure?.lastModified ||
        data?.functionalTitles?.lastModified;
      if (!ts) return;
      const date = new Date(ts);
      if (!isNaN(date))
        setLastUpdatedDate(
          `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
        );
    } catch (e) { console.error("getLastModifiedDate:", e); }
  };

  /**
   * getDisclosures — loads ALL from API, stores in allDisclosures for counts,
   * then filters for table by filterApplicantId (or shows all if undefined).
   */
  const getDisclosures = async (filterApplicantId) => {
    try {
      const res = await GET("entity-service/disclosure");
      const raw = Array.isArray(res?.data?.content)
        ? res.data.content
        : Array.isArray(res?.data) ? res.data : [];

      // Store raw (one item per disclosure) for sidebar counts — avoid double-counting sub-rows
      setAllDisclosures(raw);

      // Flatten: each row with hasSubCategory=true becomes 2 rows (+ main, − sub)
      const flattened = flattenRows(raw);

      if (filterApplicantId) {
        // Filter on original applicantTypes (kept in each row via spread)
        const filtered = flattened.filter((row) =>
          (row?.applicantTypes || []).some(
            (t) => (typeof t === "object" ? t?.id : t) === filterApplicantId
          )
        );
        setDisclosures(filtered);
      } else {
        setDisclosures(flattened);
      }
    } catch (e) {
      console.error("getDisclosures:", e);
      setDisclosures([]);
    }
  };

  // ── Sidebar handlers ──────────────────────────────────────────────────────
  const handleTileSelect = (id) => {
    setApplicantId(id || "");
    getDisclosures(id || undefined);
  };

  const handleSiteClick = (name) => {
    setSelectedSiteName(typeof name === "string" ? name : String(name || ""));
  };

  // ── Dialog handlers ───────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditData(null);
    setIsEdit(false);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (data) => {
    // Sub-rows share the parent's data (id ends with _sub) — strip suffix and use parent id
    const realId = data?._isSubRow
      ? String(data.id || "").replace("_sub", "")
      : data?.id;
    setEditData({ ...data, id: realId });
    setIsEdit(true);
    setIsDialogOpen(true);
  };

  /**
   * handleCloseDialog
   *   needRefetch = false → user cancelled, do nothing
   *   needRefetch = true  → user saved, reload table + header date
   */
  const handleCloseDialog = (needRefetch = false) => {
    setIsDialogOpen(false);
    setIsEdit(false);
    setEditData(null);
    if (needRefetch) {
      getDisclosures(undefined);
      if (entityId) getLastModifiedDate(entityId);
    }
  };

  const handleDelete = async (row) => {
    // Sub-rows have synthetic id "xxx_sub" — resolve to real parent id
    const realId = row?._isSubRow
      ? String(row.id || "").replace("_sub", "")
      : row?.id;
    if (!realId) {
      ErrorToaster("Cannot delete: missing disclosure ID.");
      return;
    }
    try {
      await DELETE(`entity-service/disclosure/${realId}`);
      SuccessToaster("Disclosure deleted.");
      getDisclosures(undefined);
    } catch (err) {
      ErrorToaster(err?.message || "Failed to delete disclosure.");
    }
  };

  const handleMarkAsDone = async () => {
    try {
      await PUT(
        `entity-service/referenceList/entity/${entityId}`,
        JSON.stringify({
          disclosures: { status: "DONE", lastModified: new Date().toISOString() },
        })
      );
    } catch (e) { console.warn("markAsDone:", e); }
    finally {
      SuccessToaster("Marked as done.");
      window.location.href = "/referencelist";
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const hasRows = disclosures.length > 0;

  const countForApplicant = (apt) =>
    allDisclosures.filter((row) =>
      (row?.applicantTypes || []).some(
        (t) => (typeof t === "object" ? t?.id : t) === apt?.id
      )
    ).length;

  const enrichedSideBarList = applicantTypeList.map((item) => ({
    ...item,
    count: countForApplicant(item),
  }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Fragment>
      <Navbar />
      <div className={style.applicantTypeBackground}>
        <div className={style.padding20}>

          {/* PAGE HEADER */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{
                fontWeight: 700, fontSize: 14,
                textTransform: "uppercase", letterSpacing: "0.4px", color: "#1a1a1a",
              }}>
                Disclosures by Industries
              </span>
              <span style={{ fontSize: 11, color: "#9e9e9e" }}>
                UPDATED ON {lastUpdatedDate || `${formatInTimeZone(new Date(), siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={handleOpenAdd}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--primary-color)", color: "#fff",
                  border: "none", borderRadius: 5, padding: "8px 18px",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
              >
                + Add New
              </button>
              <button
                onClick={() => { window.location.href = "/referencelist"; }}
                style={{
                  background: "none", border: "none", fontSize: 24,
                  lineHeight: 1, color: "#52575d", cursor: "pointer",
                }}
                title="Close"
              >×</button>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className={style.bigCardGrid} style={{ alignItems: "stretch" }}>

            {/* LEFT SIDEBAR */}
            <ApplicantSideBar
              applicantType={applicantTypeList.map(getApplicantLabel)}
              siteType={applicantTypeList.map(() => "")}
              siteTitle={"All Sites"}
              onSelectSite={handleSiteClick}
              tileType={"Disclosure"}
              selectedTile={handleTileSelect}
              sideBarList={enrichedSideBarList}
              siteDropdown={false}
            />

            {/* RIGHT PANEL */}
            <div
              className={style.applicantList}
              style={{ display: "flex", flexDirection: "column", minHeight: 500 }}
            >
              {/* Breadcrumb */}
              <div className={style.Tabletitle}>
                <Typography className={style.tableTitleContent}>
                  {selectedSiteName || "All Applicant Types"}
                </Typography>
                <Typography className={`${style.tableTitleContentArrow} ${style.tableTitleContent}`}>
                  {">"}
                </Typography>
                <Typography className={style.tableTitleContent}>
                  All Functional Titles
                </Typography>
              </div>

              {/* Content — custom table with collapsible sub-category rows */}
              <div style={{ flex: 1 }}>
                {hasRows ? (
                  <div>
                    {/* Table header — padding matches data rows exactly */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 200px 200px 130px 70px",
                      background: "#f8f9fa",
                      borderBottom: "2px solid #dee2e6",
                      paddingTop: 10,
                      paddingBottom: 10,
                      paddingLeft: 12,
                      paddingRight: 12,
                      gap: 8,
                    }}>
                      {["DISCLOSURE", "SUPPORTING DOCUMENTATION", "VERIFICATION", "LAST UPDATED", ""].map((h) => (
                        <div key={h} style={{
                          fontSize: 11, fontWeight: 700, color: "#52575d",
                          textTransform: "uppercase", letterSpacing: "0.4px",
                          textAlign: "left",
                        }}>
                          {h}
                        </div>
                      ))}
                    </div>

                    {/* Table rows */}
                    {disclosures
                      .filter((row) => {
                        // Always show parent rows; only show sub-rows if parent is expanded
                        if (!row._isSubRow) return true;
                        // Find the parent ID (sub row id is "parentId_sub")
                        const parentId = String(row.id || "").replace("_sub", "");
                        return !!expandedRows[parentId];
                      })
                      .map((row, idx) => {
                        const isSubRow    = row._isSubRow === true;
                        const hasChildren = row._hasSubCategory || (row.category || "").startsWith("+ ");
                        const parentId    = row.id;
                        const isExpanded  = !!expandedRows[parentId];

                        // Format date
                        const rawDate = row.lastModifiedDate;
                        let dateDisplay = "";
                        if (rawDate) {
                          try {
                            const d = new Date(rawDate);
                            if (!isNaN(d)) dateDisplay = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                          } catch (_) {}
                        }

                        // Category display — strip +/- prefix, show toggle button instead
                        const catRaw    = row.category || "";
                        const catClean  = catRaw.replace(/^[+\-−]\s*/, "").trim();

                        return (
                          <div
                            key={row.id || idx}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 200px 200px 130px 70px",
                              borderBottom: "1px solid #f0f0f0",
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingRight: 12,
                              paddingLeft: isSubRow ? 36 : 12,
                              gap: 8,
                              alignItems: "center",
                              background: isSubRow ? "#f9fafb" : "#fff",
                            }}
                          >
                            {/* DISCLOSURE CATEGORY cell with toggle */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {hasChildren && !isSubRow ? (
                                <button
                                  onClick={() => toggleExpand(parentId)}
                                  style={{
                                    width: 20, height: 20,
                                    border: "1.5px solid #06617A",
                                    borderRadius: 3,
                                    background: "#fff",
                                    color: "#06617A",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    lineHeight: 1,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    padding: 0,
                                  }}
                                  title={isExpanded ? "Collapse sub-category" : "Expand sub-category"}
                                >
                                  {isExpanded ? "−" : "+"}
                                </button>
                              ) : isSubRow ? (
                                <span style={{ color: "#9e9e9e", fontSize: 13, minWidth: 20, textAlign: "center" }}>−</span>
                              ) : null}
                              <span style={{ fontSize: 13, color: isSubRow ? "#666" : "#333" }}>
                                {catClean}
                              </span>
                            </div>

                            {/* SUPPORTING DOCUMENTATION */}
                            <div style={{ fontSize: 13, color: "#333", textAlign: "left" }}>
                              {row.supportingDocumentRequired || "NO"}
                            </div>

                            {/* VERIFICATION */}
                            <div style={{ fontSize: 13, color: "#333", textAlign: "left" }}>
                              {row.verificationRequired || "NA"}
                            </div>

                            {/* LAST UPDATED */}
                            <div style={{ fontSize: 12, color: "#888", textAlign: "left" }}>
                              {dateDisplay}
                            </div>

                            {/* ACTIONS — only on parent rows */}
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              {!isSubRow && (
                                <>
                                  <button
                                    onClick={() => handleOpenEdit(row)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                                    title="Edit"
                                  >
                                    <img src={require("./../../../images/editHcRow.png")} alt="edit" style={{ width: 16, height: 16 }} onError={(e) => { e.target.style.display="none"; }} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(row)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
                                    title="Delete"
                                  >
                                    <img src={require("./../../../images/deleteHcFolder.png")} alt="delete" style={{ width: 16, height: 16 }} onError={(e) => { e.target.style.display="none"; }} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className={style.emptyStateContainer}>
                    <div className={style.emptyStateIcon}>▲</div>
                    <p className={style.emptyStateText}>
                      Professional Conduct Disclosures need to be created and setup in order
                      to be made available as a default list for accounts that are created.
                    </p>
                  </div>
                )}
              </div>


            </div>

          </div>
        </div>

        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - HapiCare</p>
          <p className={style.poweredBy}>© HapiCare</p>
        </div>
      </div>

      {isDialogOpen && (
        <ProfessionalConductDisclosureDialog
          open={isDialogOpen}
          handleClose={handleCloseDialog}
          isEdit={isEdit}
          selectedDisclosure={editData}
          applicantTypeList={applicantTypeList}
        />
      )}
    </Fragment>
  );
};

export default ProfessionalConductDisclosure;