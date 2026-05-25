import React, { useEffect, useState, useRef } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../../utils/toaster";
import { POST, GET, PUT, TenantID } from "./../../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, makeStyles } from "@material-ui/core";
import { TextField } from "@mui/material";
import WritingFile from "./../../../images/writing-file.svg";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";

// ─── Teal switch ─────────────────────────────────────────────────────────────
const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":     { color: "#06617A" },
    "& .MuiSwitch-track": { backgroundColor: "#06617A !important" },
  },
});

// ─── Country list ─────────────────────────────────────────────────────────────
const COUNTRY_LIST = [
  { code: "us", name: "USA",         label: "United States"   },
  { code: "gb", name: "UK",          label: "United Kingdom"  },
  { code: "ca", name: "Canada",      label: "Canada"          },
  { code: "au", name: "Australia",   label: "Australia"       },
  { code: "in", name: "India",       label: "India"           },
  { code: "de", name: "Germany",     label: "Germany"         },
  { code: "fr", name: "France",      label: "France"          },
  { code: "sg", name: "Singapore",   label: "Singapore"       },
  { code: "ae", name: "UAE",         label: "UAE"             },
  { code: "nz", name: "New Zealand", label: "New Zealand"     },
  { code: "za", name: "S. Africa",   label: "South Africa"    },
  { code: "jp", name: "Japan",       label: "Japan"           },
  { code: "ie", name: "Ireland",     label: "Ireland"         },
  { code: "ng", name: "Nigeria",     label: "Nigeria"         },
  { code: "ke", name: "Kenya",       label: "Kenya"           },
  { code: "gh", name: "Ghana",       label: "Ghana"           },
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

const fmtSize = (b) => {
  if (b < 1024)         return `${b} B`;
  if (b < 1024 * 1024)  return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProfessionalConductDisclosureDialog = ({
  open,
  handleClose,
  isEdit,
  selectedDisclosure,
  applicantTypeList: propApplicantTypeList,
}) => {
  const classes      = useStyles();
  const fileInputRef = useRef(null);

  // Country picker
  const [selectedCountry,      setSelectedCountry]      = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen,  setCountryDropdownOpen]  = useState(false);

  // Dropdown lists
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [siteTypeList,      setSiteTypeList]      = useState([]);

  // Loading states for dropdowns
  const [sitesLoading, setSitesLoading] = useState(false);
  const [aptsLoading,  setAptsLoading]  = useState(false);

  // Form state
  const [selectedSiteIds,            setSelectedSiteIds]            = useState([]);
  const [selectedApplicantTypeIds,   setSelectedApplicantTypeIds]   = useState([]);
  const [disclosureCategory,         setDisclosureCategory]         = useState("");
  const [addSubCategory,             setAddSubCategory]             = useState(false);
  const [subCategoryText,            setSubCategoryText]            = useState("");
  const [instructionalText,          setInstructionalText]          = useState("");
  const [disclosureText,             setDisclosureText]             = useState("");
  const [responseOption,             setResponseOption]             = useState("YesNo");
  const [guidanceText,               setGuidanceText]               = useState("");
  const [supportingDocument,        setSupportingDocument]          = useState(false);
  const [requiresVerification,      setRequiresVerification]        = useState(false);
  const [verificationRequiredFrom,  setVerificationRequiredFrom]    = useState("");
  const [releaseOfInfo,             setReleaseOfInfo]               = useState(false);

  // File upload
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading,   setIsUploading]   = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch sites on first open ─────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      fetchSiteTypes();
    }
  }, [open]);

  // ── Applicant types — prefer prop, else fetch ─────────────────────────────
  useEffect(() => {
    if (propApplicantTypeList?.length > 0) {
      setApplicantTypeList(propApplicantTypeList);
    } else if (open) {
      fetchApplicantTypes();
    }
  }, [open, propApplicantTypeList]);

  // ─── API fetchers ─────────────────────────────────────────────────────────
  const fetchSiteTypes = async () => {
    setSitesLoading(true);
    try {
      const res  = await GET("entity-service/sites");
      // Handle: { data: [...] }  OR  { data: { content: [...] } }  OR plain array
      const raw  = res?.data?.content || res?.data || res || [];
      const list = Array.isArray(raw) ? raw : [];
      console.log("[PCD] sites raw:", JSON.stringify(list.slice(0, 2), null, 2));
      setSiteTypeList(list);
    } catch (e) {
      console.error("[PCD] fetchSiteTypes failed:", e);
      setSiteTypeList([]);
    } finally {
      setSitesLoading(false);
    }
  };

  const fetchApplicantTypes = async () => {
    setAptsLoading(true);
    try {
      // Try entity-scoped first, then global fallback
      let list = [];
      try {
        const entityRes = await GET("entity-service/entity");
        const eid = entityRes?.data?.[0]?.id;
        if (eid) {
          const res = await GET(`entity-service/applicantType?entityId=${eid}`);
          list = res?.data?.content || res?.data || [];
        }
      } catch (_) { /* ignore, try fallback */ }

      if (!Array.isArray(list) || list.length === 0) {
        const res = await GET("entity-service/applicantType");
        list = res?.data?.content || res?.data || [];
      }

      if (!Array.isArray(list)) list = [];
      console.log("[PCD] applicantTypes raw:", JSON.stringify(list.slice(0, 2), null, 2));

      // De-duplicate by label
      const seen   = new Set();
      const unique = list.filter((item) => {
        const label = getApplicantLabel(item)?.trim()?.toLowerCase();
        if (!label || seen.has(label)) return false;
        seen.add(label);
        return true;
      });
      setApplicantTypeList(unique);
    } catch (e) {
      console.error("[PCD] fetchApplicantTypes failed:", e);
      setApplicantTypeList([]);
    } finally {
      setAptsLoading(false);
    }
  };

  // ── Populate / reset when dialog opens ───────────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedDisclosure) {
      // Schema: siteType is singular EntityType { id, type }
      // Match against siteTypeList using getSitePayloadId (siteTypeId.id)
      const savedSiteType = selectedDisclosure?.siteType;
      if (savedSiteType?.id) {
        // Find site instance in siteTypeList whose siteTypeId matches savedSiteType.id
        const matched = siteTypeList.find(
          (s) => getSitePayloadId(s) === savedSiteType.id || s?.id === savedSiteType.id
        );
        setSelectedSiteIds(matched ? [matched.id] : [savedSiteType.id]);
      } else {
        setSelectedSiteIds([]);
      }
      setSelectedApplicantTypeIds(
        (selectedDisclosure?.applicantTypes || [])
          .map((a) => (typeof a === "object" ? a?.id : a))
          .filter(Boolean)
      );
      setDisclosureCategory(
        typeof selectedDisclosure?.category === "object"
          ? selectedDisclosure.category?.category || selectedDisclosure.category?.name || ""
          : selectedDisclosure?.category || ""
      );
      // normalizeRow sets _hasSubCategory (underscore prefix); raw API uses hasSubCategory
      // Also treat as has-sub-category if subCategory field has a non-empty value
      const subCatValue = selectedDisclosure?.subCategory || "";
      const hasSubCat   = !!(
        selectedDisclosure?._hasSubCategory ||
        selectedDisclosure?.hasSubCategory  ||
        subCatValue.trim().length > 0
      );
      setAddSubCategory(hasSubCat);
      setSubCategoryText(subCatValue);
      setInstructionalText(selectedDisclosure?.instructionalText || "");
      setDisclosureText(selectedDisclosure?.disclosureText || "");
      // Normalize responseOption — API returns { responseOption: null } when not set
      // Always default to "YesNo" if the value is null/empty
      const rawRO = selectedDisclosure?.responseOption;
      let normalizedRO = "YesNo"; // safe default
      if (rawRO) {
        const roStr = typeof rawRO === "object"
          ? (rawRO?.responseOption || rawRO?.value || "")
          : String(rawRO);
        if (roStr === "YES_NO_NA" || roStr === "YesNoNotApplicable") normalizedRO = "YesNoNotApplicable";
        else if (roStr === "YES_NO" || roStr === "YesNo") normalizedRO = "YesNo";
        // If roStr is empty/null, keep default "YesNo"
      }
      setResponseOption(normalizedRO);
      // Schema field is responseOptionText (not applicantGuidanceText)
      setGuidanceText(
        selectedDisclosure?.responseOptionText    ||
        selectedDisclosure?.applicantGuidanceText ||
        selectedDisclosure?.guidanceText          ||
        selectedDisclosure?.yesGuidanceText       || ""
      );
      // Use _raw values if available (normalizeRow overwrites booleans with display strings)
      const rawSupporting = selectedDisclosure?._rawSupportingDocumentRequired
        ?? selectedDisclosure?.supportingDocumentRequired;
      const rawVerification = selectedDisclosure?._rawVerificationRequired
        ?? selectedDisclosure?.verificationRequired;
      const rawVerifFrom = selectedDisclosure?._rawVerificationRequiredFrom
        ?? selectedDisclosure?.verificationRequiredFrom;
      setSupportingDocument(rawSupporting === true || rawSupporting === "YES" || rawSupporting === "true");
      setRequiresVerification(rawVerification === true || rawVerification === "YES" || rawVerification === "true");
      setVerificationRequiredFrom(rawVerifFrom || "");
      // Schema field is consentFormRequired (boolean)
      setReleaseOfInfo(!!(
        selectedDisclosure?.consentFormRequired               ??
        selectedDisclosure?.releaseOfInfoRequired             ??
        selectedDisclosure?.releaseOfInformationRequired      ??
        false
      ));
      setUploadedFiles([]);
    } else {
      resetFields();
    }
  }, [open, isEdit, selectedDisclosure]);

  const resetFields = () => {
    setSelectedSiteIds([]);
    setSelectedApplicantTypeIds([]);
    setDisclosureCategory("");
    setAddSubCategory(false);
    setSubCategoryText("");
    setInstructionalText("");
    setDisclosureText("");
    setResponseOption("YesNo");
    setGuidanceText("");
    setSupportingDocument(false);
    setRequiresVerification(false);
    setVerificationRequiredFrom("");
    setReleaseOfInfo(false);
    setUploadedFiles([]);
    setSelectedCountry(COUNTRY_LIST[0]);
    setCountryDropdownOpen(false);
  };

  // ─── Label helpers ────────────────────────────────────────────────────────
  const getApplicantLabel = (item) => {
    if (!item) return "";
    const raw = item?.applicantType;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw))      return raw[0] || "";
    if (typeof raw === "object" && raw) return raw?.type || raw?.name || "";
    return item?.name || "";
  };

  const getSiteName = (site) => {
    if (!site) return "";
    // Schema: EntityType { id, type } — primary field is 'type'
    if (site?.type && typeof site.type === "string") return site.type;
    // Fallback for older/different shapes
    const raw = site?.siteName;
    if (typeof raw === "string" && raw) return raw;
    if (typeof raw === "object" && raw) return raw?.siteName || raw?.name || "";
    return site?.name || site?.siteTypeName || site?.id || "";
  };

  const getSitePayloadId = (site) => {
    if (!site) return null;
    return (
      site?.siteTypeId?.id ||
      (typeof site?.siteTypeId === "string" ? site.siteTypeId : null) ||
      site?.siteType?.id ||
      site?.id ||
      null
    );
  };

  // ─── File upload ──────────────────────────────────────────────────────────
  const handleBulkUploadClick = () => fileInputRef.current?.click();

  const handleFileInputChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const startIdx = uploadedFiles.length;
    const newItems = Array.from(files).map((f) => ({
      file: f, name: f.name, size: f.size, status: "pending", error: null,
    }));
    setUploadedFiles((prev) => [...prev, ...newItems]);
    setIsUploading(true);
    for (let i = 0; i < newItems.length; i++) {
      await uploadOne(newItems[i], startIdx + i);
    }
    setIsUploading(false);
    e.target.value = "";
  };

  const uploadOne = async (entry, idx) => {
    setUploadedFiles((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, status: "uploading" } : f))
    );
    try {
      const fd = new FormData();
      fd.append("file", entry.file);
      await POST(`entity-service/disclosure/upload?${TenantID}`, fd);
      setUploadedFiles((prev) =>
        prev.map((f, i) => (i === idx ? { ...f, status: "done" } : f))
      );
    } catch (err) {
      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          i === idx ? { ...f, status: "error", error: err?.message || "Failed" } : f
        )
      );
    }
  };

  const removeFile = (idx) =>
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));

  const statusIcon  = (s) => ({ done: "✓", error: "✗", uploading: "⏳", pending: "○" }[s] ?? "○");
  const statusColor = (s) =>
    ({ done: "#06617A", error: "#d32f2f", uploading: "#f59e0b", pending: "#9e9e9e" }[s] ?? "#9e9e9e");

  const doneCount      = uploadedFiles.filter((f) => f.status === "done").length;
  const uploadingCount = uploadedFiles.filter((f) => f.status === "uploading").length;
  const errorCount     = uploadedFiles.filter((f) => f.status === "error").length;

  // ─── Save ─────────────────────────────────────────────────────────────────
  // Pattern matches ApplicantTypeDialog.js exactly:
  //   POST(url, JSON.stringify(payload))  ← dataSaver sends it as raw JSON body
  //   PUT(url,  JSON.stringify(payload))  ← same for edits
  const handleSave = async (isSaveAndExit) => {
    if (!disclosureCategory.trim()) {
      ErrorToaster("Disclosure Category is required.");
      return;
    }

    setIsSubmitting(true);

    // Schema: siteType is singular EntityType { id, type } — NOT an array
    // Find the selected site and send as single object
    const selectedSite = siteTypeList.find((s) => selectedSiteIds.includes(s?.id));
    const siteTypePayload = selectedSite
      ? {
          id:   getSitePayloadId(selectedSite) || selectedSite?.id || "",
          type: getSiteName(selectedSite) || selectedSite?.type || "",
        }
      : selectedSiteIds.length > 0
        ? { id: selectedSiteIds[0], type: "" }
        : null;

    // ── responseOption fix ───────────────────────────────────────────────────
    // The Java backend type is ResponseOptions (a value object, NOT a plain enum).
    // Jackson cannot deserialize a plain String "YES_NO" into it.
    // It needs one of these object shapes — we try each until one works:
    //   Shape A (most common value object): { "value": "YES_NO" }
    //   Shape B (field-named):              { "responseOption": "YES_NO" }
    //   Shape C (plain string fallback):    "YES_NO"
    const buildPayload = (responseOptionShape) => ({
      applicantTypes:             selectedApplicantTypeIds.map((id) => ({ id })),
      siteType:                   siteTypePayload,        // schema: singular EntityType { id, type }
      category:                   disclosureCategory.trim(),
      hasSubCategory:             addSubCategory,
      subCategory:                addSubCategory ? subCategoryText.trim() : "",
      instructionalText:          instructionalText.trim(),
      disclosureText:             disclosureText.trim(),
      responseOption:             responseOptionShape,
      responseOptionText:         guidanceText.trim(),         // schema: responseOptionText
      supportingDocumentRequired: supportingDocument,           // schema: boolean
      verificationRequired:       requiresVerification,         // schema: boolean
      verificationRequiredFrom:   requiresVerification ? verificationRequiredFrom : "", // schema enum
      consentFormRequired:        releaseOfInfo,                // schema: consentFormRequired boolean
    });

    // Three candidate shapes for responseOption — backend will accept exactly one
    // Swagger enum: YesNo | YesNoNotApplicable (PascalCase)
    const responseOptionShapes = [
      { value: responseOption },            // Shape A: { value: "YesNo" }
      { responseOption: responseOption },   // Shape B: { responseOption: "YesNo" }
      responseOption,                       // Shape C: plain string (fallback)
    ];

    const url     = !isEdit
      ? "entity-service/disclosure"
      : `entity-service/disclosure/${selectedDisclosure?.id}`;
    const method  = !isEdit ? POST : PUT;

    let lastErr   = null;
    let succeeded = false;

    for (const shape of responseOptionShapes) {
      const payload = buildPayload(shape);
      console.log("[PCD] trying responseOption shape:", JSON.stringify(shape));
      console.log("[PCD] full payload:", JSON.stringify(payload, null, 2));
      try {
        const res = await method(url, JSON.stringify(payload));
        console.log("[PCD] ✅ success with shape:", JSON.stringify(shape), res);
        succeeded = true;

        SuccessToaster(isEdit ? "Disclosure updated successfully." : "Disclosure added successfully.");
        if (isSaveAndExit) {
          handleClose(true);
        } else {
          resetFields();
        }
        break; // stop trying shapes once one works
      } catch (err) {
        const msg = err?.response?.data || err?.data || err?.message || "";
        const isResponseOptionError =
          typeof msg === "string" && msg.toLowerCase().includes("responseoption");
        console.warn("[PCD] shape failed:", JSON.stringify(shape), "→", msg);
        lastErr = err;
        if (!isResponseOptionError) {
          // Error is NOT about responseOption — stop trying shapes, show real error
          break;
        }
        // Error IS about responseOption — try next shape
      }
    }

    if (!succeeded) {
      console.error("[PCD] ── ALL SHAPES FAILED ─────────────────────────────");
      console.error(JSON.stringify(lastErr?.response?.data ?? lastErr?.data ?? lastErr?.message ?? lastErr));

      const backendMsg =
        lastErr?.response?.data?.message ||
        lastErr?.response?.data?.error   ||
        (typeof lastErr?.response?.data === "string" ? lastErr.response.data : null) ||
        lastErr?.data?.message           ||
        lastErr?.message                 ||
        "Save failed — open browser console (F12) for the full error.";

      ErrorToaster(typeof backendMsg === "string" ? backendMsg : JSON.stringify(backendMsg));
    }

    setIsSubmitting(false);
  };

  const handleDialogClose = () => {
    resetFields();
    handleClose(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog
      isOpen={open}
      onClose={handleDialogClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* ── Header ── */}
        <div className={style.spaceBetween}>

          {/* Country picker */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCountryDropdownOpen((p) => !p)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#f5f5f5", border: "1px solid #ccc",
                borderRadius: 4, padding: "5px 10px", cursor: "pointer",
                fontWeight: 600, fontSize: 13, color: "#333", minWidth: 80,
              }}
            >
              <FlagImg code={selectedCountry.code} size={20} />
              <span>{selectedCountry.name}</span>
              <span style={{ fontSize: 9, color: "#777", marginLeft: 2 }}>▾</span>
            </button>

            {countryDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 10000 }}
                  onClick={() => setCountryDropdownOpen(false)}
                />
                <div style={{
                  position: "absolute", top: "110%", left: 0, zIndex: 10001,
                  background: "#fff", border: "1px solid #ddd", borderRadius: 6,
                  boxShadow: "0 6px 20px rgba(0,0,0,.15)",
                  minWidth: 220, maxHeight: 280, overflowY: "auto",
                }}>
                  {COUNTRY_LIST.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => { setSelectedCountry(c); setCountryDropdownOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 14px", cursor: "pointer", fontSize: 13,
                        backgroundColor: c.code === selectedCountry.code ? "#e8f4f7" : "transparent",
                        fontWeight: c.code === selectedCountry.code ? 600 : 400,
                      }}
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

          <p className={style.extensionStyle}>Setup Your Professional Conduct Disclosures</p>

          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img src={WritingFile} className={style.dialogCrossStyle} alt="Writing File" />
            <Icon
              icon="cross" size={30} intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={handleDialogClose}
            />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder} />

        {/* ── Form body ── */}
        <div className={style.addHealthCareBoxStyle}>

          {/* SITE TYPE — multiselect */}
          <div>
            <div className={style.entityLableStyle}>SITE TYPE *</div>
            <FormControl className={style.fullWidth} size="small">
              <Select
                multiple
                value={selectedSiteIds}
                onChange={(e) =>
                  setSelectedSiteIds(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                displayEmpty
                renderValue={(sel) => {
                  if (!sel?.length)
                    return (
                      <span style={{ color: "#9e9e9e" }}>
                        {sitesLoading ? "Loading sites..." : "Select Site - Multiselect"}
                      </span>
                    );
                  return siteTypeList
                    .filter((s) => sel.includes(s?.id))
                    .map(getSiteName)
                    .join(", ");
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 14 } }}
              >
                {sitesLoading && <MenuItem disabled value=""><em>Loading...</em></MenuItem>}
                {!sitesLoading && siteTypeList.length === 0 && (
                  <MenuItem disabled value="">No sites available</MenuItem>
                )}
                {siteTypeList.map((site, idx) => (
                  <MenuItem value={site?.id} key={site?.id || idx}>
                    {getSiteName(site)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* APPLICANT TYPE — multiselect */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
            <FormControl className={style.fullWidth} size="small">
              <Select
                multiple
                value={selectedApplicantTypeIds}
                onChange={(e) =>
                  setSelectedApplicantTypeIds(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value
                  )
                }
                displayEmpty
                renderValue={(sel) => {
                  if (!sel?.length)
                    return (
                      <span style={{ color: "#9e9e9e" }}>
                        {aptsLoading ? "Loading applicant types..." : "Select Applicant Type - Multiselect"}
                      </span>
                    );
                  return applicantTypeList
                    .filter((a) => sel.includes(a?.id))
                    .map(getApplicantLabel)
                    .join(", ");
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 14 } }}
              >
                {aptsLoading && <MenuItem disabled value=""><em>Loading...</em></MenuItem>}
                {!aptsLoading && applicantTypeList.length === 0 && (
                  <MenuItem disabled value="">No applicant types found</MenuItem>
                )}
                {applicantTypeList.map((item, idx) => (
                  <MenuItem value={item?.id} key={item?.id || idx}>
                    {getApplicantLabel(item)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* DISCLOSURE CATEGORY + ADD SUB-CATEGORY toggle */}
          <div className={style.marginTop20}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 5,
            }}>
              <div className={style.entityLableStyle} style={{ marginBottom: 0 }}>
                DISCLOSURE CATEGORY *
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 11, color: "#52575d",
                  textTransform: "uppercase", letterSpacing: "0.4px",
                }}>
                  ADD SUB-CATEGORY?
                </span>
                <FormControlLabel
                  control={
                    <Switch
                      checked={addSubCategory}
                      onChange={(e) => setAddSubCategory(e.target.checked)}
                      className={classes.switch}
                      size="small"
                    />
                  }
                  label={
                    <span style={{ fontSize: 12, color: "#555" }}>
                      {addSubCategory ? "Yes" : "No"}
                    </span>
                  }
                  labelPlacement="end"
                  style={{ margin: 0 }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <CommonInputField
                  value={disclosureCategory}
                  className={style.fullWidth}
                  onChange={(e) => setDisclosureCategory(e.target.value)}
                  placeholder="Enter Disclosure Category (e.g. Professional Licencing)"
                />
              </div>
              {addSubCategory && (
                <TextField
                  variant="outlined" size="small"
                  placeholder="Enter Sub Category"
                  value={subCategoryText}
                  onChange={(e) => setSubCategoryText(e.target.value)}
                  style={{ minWidth: 180 }}
                />
              )}
            </div>
          </div>

          {/* INSTRUCTIONAL TEXT / HELP GUIDE */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>INSTRUCTIONAL TEXT / HELP GUIDE</div>
            <TextField
              multiline minRows={3} fullWidth size="small" variant="outlined"
              placeholder="Enter instructional text / help guide for this disclosure..."
              value={instructionalText}
              onChange={(e) => setInstructionalText(e.target.value)}
            />
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* DISCLOSURE TEXT */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DISCLOSURE TEXT</div>
            <TextField
              multiline minRows={4} fullWidth size="small" variant="outlined"
              placeholder="Enter the disclosure question text..."
              value={disclosureText}
              onChange={(e) => setDisclosureText(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset":             { borderColor: "#9b59b6" },
                  "&:hover fieldset":       { borderColor: "#8e44ad" },
                  "&.Mui-focused fieldset": { borderColor: "#8e44ad" },
                },
              }}
            />
          </div>

          {/* RESPONSE OPTIONS */}
          <div className={style.marginTop20}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <label className={style.entityLableStyle} style={{ marginBottom: 0 }}>
                RESPONSE OPTIONS:
              </label>
              {[
                { value: "YesNo",    label: "Yes / No"                  },
                { value: "YesNoNotApplicable", label: "Yes / No / Not Applicable" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}
                >
                  <input
                    type="radio"
                    name="pcd-resp-opt"
                    value={value}
                    checked={responseOption === value}
                    onChange={() => setResponseOption(value)}
                    style={{ accentColor: "#06617A" }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* APPLICANT GUIDANCE TEXT */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              APPLICANT GUIDANCE TEXT FOR &apos;YES&apos; RESPONSES
            </div>
            <TextField
              multiline minRows={3} fullWidth size="small" variant="outlined"
              placeholder="Enter applicant guidance text here..."
              value={guidanceText}
              onChange={(e) => setGuidanceText(e.target.value)}
            />
          </div>

          {/* Supporting Documentation */}
          <div className={`${style.signatureGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Supporting Documentation
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: 10, marginBottom: 0, fontSize: 13, minWidth: 28 }}>
                {supportingDocument ? "Yes" : "No"}
              </p>
              <FormControlLabel
                control={
                  <Switch
                    checked={supportingDocument}
                    onChange={(e) => setSupportingDocument(e.target.checked)}
                    className={classes.switch}
                  />
                }
                label="" style={{ margin: 0 }}
              />
            </div>
          </div>

          {/* Requires Disclosures Verification */}
          <div className={`${style.signatureGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Requires Disclosures Verification
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontSize: 13, minWidth: 28 }}>
                {requiresVerification ? "Yes" : "No"}
              </p>
              <FormControlLabel
                control={
                  <Switch
                    checked={requiresVerification}
                    onChange={(e) => setRequiresVerification(e.target.checked)}
                    className={classes.switch}
                  />
                }
                label="" style={{ margin: 0 }}
              />
              {requiresVerification && (
                <FormControl size="small" style={{ minWidth: 220 }}>
                  <Select
                    value={verificationRequiredFrom}
                    onChange={(e) => setVerificationRequiredFrom(e.target.value)}
                    displayEmpty
                    renderValue={(v) => {
                      const labels = {
                        PractisingPhysician: "Practising Physician",
                        CurrentEmployer:     "Current Employer",
                        FormerEmployer:      "Former Employer",
                      };
                      return v
                        ? (labels[v] || v)
                        : <span style={{ color: "#9e9e9e" }}>Select Required From</span>;
                    }}
                  >
                    <MenuItem value="PractisingPhysician">Practising Physician</MenuItem>
                    <MenuItem value="CurrentEmployer">Current Employer</MenuItem>
                    <MenuItem value="FormerEmployer">Former Employer</MenuItem>
                  </Select>
                </FormControl>
              )}
            </div>
          </div>

          {/* Release Of Information */}
          <div className={`${style.signatureGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Release Of Information Authorization &amp; Consent Form Required
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ marginRight: 10, marginBottom: 0, fontSize: 13, minWidth: 28 }}>
                {releaseOfInfo ? "Yes" : "No"}
              </p>
              <FormControlLabel
                control={
                  <Switch
                    checked={releaseOfInfo}
                    onChange={(e) => setReleaseOfInfo(e.target.checked)}
                    className={classes.switch}
                  />
                }
                label="" style={{ margin: 0 }}
              />
            </div>
          </div>

          {/* Uploaded files list */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: 12, color: "#52575d", marginBottom: 8,
                display: "flex", gap: 12, flexWrap: "wrap",
              }}>
                <span><strong>{uploadedFiles.length}</strong> file{uploadedFiles.length !== 1 ? "s" : ""} selected</span>
                {doneCount      > 0 && <span style={{ color: "#06617A" }}>✓ {doneCount} uploaded</span>}
                {uploadingCount > 0 && <span style={{ color: "#f59e0b" }}>⏳ {uploadingCount} uploading</span>}
                {errorCount     > 0 && <span style={{ color: "#d32f2f" }}>✗ {errorCount} failed</span>}
              </div>
              <div style={{ border: "1px solid #dee2e6", borderRadius: 6, overflow: "hidden" }}>
                {uploadedFiles.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex", alignItems: "center", padding: "8px 12px", gap: 8,
                      borderBottom: idx < uploadedFiles.length - 1 ? "1px solid #f0f0f0" : "none",
                      backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <span style={{ fontSize: 14, color: statusColor(f.status), minWidth: 18, fontWeight: "bold" }}>
                      {statusIcon(f.status)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {fmtSize(f.size)}
                        {f.status === "uploading" && " — uploading..."}
                        {f.status === "error" && <span style={{ color: "#d32f2f" }}> — {f.error || "failed"}</span>}
                      </div>
                    </div>
                    {f.status !== "uploading" && (
                      <button
                        onClick={() => removeFile(idx)}
                        style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}
                      >×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        {/* end form body */}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.txt"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />

        {/* ── Footer ── */}
        <div
          className={style.marginTop20}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <button
            className={style.outlinedButton}
            onClick={handleBulkUploadClick}
            disabled={isSubmitting || isUploading}
          >
            {isUploading
              ? `UPLOADING (${uploadingCount})...`
              : uploadedFiles.length > 0
              ? `ADD MORE FILES (${doneCount} done)`
              : "BULK UPLOAD"}
          </button>

          <div>
            <button
              className={style.outlinedButton}
              onClick={() => handleSave(true)}
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "SAVING..." : "SAVE & EXIT"}
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => handleSave(false)}
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "SAVING..." : "SAVE & ADD MORE"}
            </button>
          </div>
        </div>

      </div>
    </Dialog>
  );
};

export default ProfessionalConductDisclosureDialog;