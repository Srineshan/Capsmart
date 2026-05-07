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

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":     { color: "#06617A" },
    "& .MuiSwitch-track": { backgroundColor: "#06617A !important" },
  },
});

// ── Country list with emoji flags — no CDN required, works everywhere ─────────
const COUNTRY_LIST = [
  { flag: "🇺🇸", code: "US", name: "USA",          label: "United States"        },
  { flag: "🇬🇧", code: "GB", name: "UK",           label: "United Kingdom"       },
  { flag: "🇨🇦", code: "CA", name: "Canada",       label: "Canada"               },
  { flag: "🇦🇺", code: "AU", name: "Australia",    label: "Australia"            },
  { flag: "🇮🇳", code: "IN", name: "India",        label: "India"                },
  { flag: "🇩🇪", code: "DE", name: "Germany",      label: "Germany"              },
  { flag: "🇫🇷", code: "FR", name: "France",       label: "France"               },
  { flag: "🇸🇬", code: "SG", name: "Singapore",    label: "Singapore"            },
  { flag: "🇦🇪", code: "AE", name: "UAE",          label: "United Arab Emirates" },
  { flag: "🇳🇿", code: "NZ", name: "New Zealand",  label: "New Zealand"          },
  { flag: "🇿🇦", code: "ZA", name: "South Africa", label: "South Africa"         },
  { flag: "🇯🇵", code: "JP", name: "Japan",        label: "Japan"                },
  { flag: "🇧🇷", code: "BR", name: "Brazil",       label: "Brazil"               },
  { flag: "🇲🇽", code: "MX", name: "Mexico",       label: "Mexico"               },
  { flag: "🇵🇭", code: "PH", name: "Philippines",  label: "Philippines"          },
  { flag: "🇳🇬", code: "NG", name: "Nigeria",      label: "Nigeria"              },
  { flag: "🇮🇪", code: "IE", name: "Ireland",      label: "Ireland"              },
  { flag: "🇰🇪", code: "KE", name: "Kenya",        label: "Kenya"                },
  { flag: "🇿🇼", code: "ZW", name: "Zimbabwe",     label: "Zimbabwe"             },
  { flag: "🇬🇭", code: "GH", name: "Ghana",        label: "Ghana"                },
];

const fmtSize = (b) => {
  if (b < 1024)        return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

const DisclosureByIndustriesDialog = ({
  open,
  handleClose,
  isEdit,
  selectedDisclosure,
  applicantTypeList: propApplicantTypeList,
}) => {
  const classes      = useStyles();
  const fileInputRef = useRef(null);

  // ── Country selector ──────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry]         = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // ── Dropdown data ─────────────────────────────────────────────────────────
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [siteTypeList, setSiteTypeList]           = useState([]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [selectedSiteIds, setSelectedSiteIds]           = useState([]);
  const [selectedApplicantTypeIds, setSelectedApplicantTypeIds] = useState([]);
  const [disclosureCategory, setDisclosureCategory]     = useState("");
  const [addSubCategory, setAddSubCategory]             = useState(false);
  const [subCategoryText, setSubCategoryText]           = useState("");
  const [instructionalText, setInstructionalText]       = useState("");
  const [disclosureText, setDisclosureText]             = useState("");
  const [responseOption, setResponseOption]             = useState("yes-no");
  const [guidanceText, setGuidanceText]                 = useState("");
  const [supportingDocument, setSupportingDocument]     = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationRequiredFrom, setVerificationRequiredFrom] = useState("");
  const [releaseOfInfo, setReleaseOfInfo]               = useState(false);

  // ── File upload ───────────────────────────────────────────────────────────
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading]     = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Load dropdown data ────────────────────────────────────────────────────
  useEffect(() => {
    if (propApplicantTypeList?.length > 0) {
      setApplicantTypeList(propApplicantTypeList);
    } else {
      fetchApplicantTypes();
    }
    fetchSiteTypes();
  }, [propApplicantTypeList]);

  const fetchApplicantTypes = async () => {
    try {
      const { data } = await GET("entity-service/applicantType");
      const seenNames = new Set();
      const unique = (data || []).filter((item) => {
        const label = getApplicantLabel(item)?.trim()?.toLowerCase();
        if (!label || seenNames.has(label)) return false;
        seenNames.add(label);
        return true;
      });
      setApplicantTypeList(unique);
    } catch (e) { console.error("applicantType:", e); }
  };

  const fetchSiteTypes = async () => {
    try {
      const { data } = await GET("entity-service/sites");
      setSiteTypeList(data || []);
    } catch (e) { console.error("sites:", e); }
  };

  // ── Populate / reset on open ──────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedDisclosure) {
      const siteIds = (selectedDisclosure?.siteTypes || selectedDisclosure?.sites || [])
        .map((s) => s?.id).filter(Boolean);
      setSelectedSiteIds(siteIds);

      const aptIds = (selectedDisclosure?.applicantTypes || [])
        .map((a) => typeof a === "object" ? a?.id : a)
        .filter(Boolean);
      setSelectedApplicantTypeIds(aptIds);

      setDisclosureCategory(
        typeof selectedDisclosure?.category === "object"
          ? selectedDisclosure.category?.category || ""
          : selectedDisclosure?.category || selectedDisclosure?.disclosureCategory || ""
      );
      setAddSubCategory(selectedDisclosure?.hasSubCategory || false);
      setSubCategoryText(selectedDisclosure?.subCategory || "");
      setInstructionalText(selectedDisclosure?.instructionalText || "");
      setDisclosureText(selectedDisclosure?.disclosureText || "");
      setResponseOption(selectedDisclosure?.responseOption || "yes-no");
      setGuidanceText(
        selectedDisclosure?.applicantGuidanceText ||
        selectedDisclosure?.guidanceText || ""
      );
      setSupportingDocument(selectedDisclosure?.supportingDocumentRequired === true);
      setRequiresVerification(selectedDisclosure?.verificationRequired === true);
      setVerificationRequiredFrom(selectedDisclosure?.verificationRequiredFrom || "");
      setReleaseOfInfo(selectedDisclosure?.releaseOfInfoRequired === true);
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
    setResponseOption("yes-no");
    setGuidanceText("");
    setSupportingDocument(false);
    setRequiresVerification(false);
    setVerificationRequiredFrom("");
    setReleaseOfInfo(false);
    setUploadedFiles([]);
    setSelectedCountry(COUNTRY_LIST[0]);
    setCountryDropdownOpen(false);
  };

  // ── Label helpers ─────────────────────────────────────────────────────────
  const getApplicantLabel = (item) => {
    const raw = item?.applicantType;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw))      return raw[0] || "";
    if (typeof raw === "object" && raw) return raw?.type || raw?.name || "";
    return item?.name || "";
  };

  const getSiteName = (site) => {
    if (!site) return "";
    const raw = site?.siteName;
    if (typeof raw === "string" && raw) return raw;
    if (typeof raw === "object" && raw) return raw?.siteName || raw?.name || "";
    return site?.name || site?.siteTypeName || "";
  };

  // ── File upload ───────────────────────────────────────────────────────────
  const handleBulkUploadClick = () => fileInputRef.current?.click();

  const handleFileInputChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const startIdx  = uploadedFiles.length;
    const newItems  = Array.from(files).map((f) => ({
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

  // ── Save ──────────────────────────────────────────────────────────────────
  // IMPORTANT: The original getAddEntityTypes called POST(url, data) with a
  // plain JS object — NOT JSON.stringify(). That is what we do here.
  // If your dataSaver.POST internally calls JSON.stringify, pass plain object.
  // If it sends raw body, wrap in JSON.stringify. Both are handled below:
  // we pass plain object first, which is what the original code did.
  const handleSave = async (isSaveAndExit) => {
    if (!disclosureCategory.trim()) {
      ErrorToaster("Disclosure Category is required.");
      return;
    }

    setIsSubmitting(true);

    // Build payload matching exactly what the GET endpoint returns —
    // so the backend round-trips cleanly
    const payload = {
      applicantTypes:             selectedApplicantTypeIds.map((id) => ({ id })),
      siteTypes:                  selectedSiteIds.map((id) => ({ id })),
      category:                   disclosureCategory.trim(),
      hasSubCategory:             addSubCategory,
      subCategory:                addSubCategory ? subCategoryText.trim() : "",
      instructionalText:          instructionalText.trim(),
      disclosureText:             disclosureText.trim(),
      responseOption:             responseOption,
      applicantGuidanceText:      guidanceText.trim(),
      supportingDocumentRequired: supportingDocument,
      verificationRequired:       requiresVerification,
      verificationRequiredFrom:   requiresVerification ? verificationRequiredFrom : "",
      releaseOfInfoRequired:      releaseOfInfo,
    };

    try {
      if (!isEdit) {
        await POST(
          `entity-service/disclosure/?${TenantID}`,
          JSON.stringify(payload)
        );
        SuccessToaster("Disclosure Added Successfully");
        if (isSaveAndExit) {
          handleClose(true);
        } else {
          resetFields(); // SAVE & ADD MORE — stay open, clear fields
        }
      } else {
        await PUT(
          `entity-service/disclosure/${selectedDisclosure?.id}`,
          JSON.stringify(payload)
        );
        SuccessToaster("Disclosure Updated Successfully");
        resetFields();
        if (isSaveAndExit) handleClose(true);
      }
    } catch (err) {
      // Log full error so we can see exactly what the backend rejected
      console.error("[DisclosureDialog] Error:", err);
      console.error("[DisclosureDialog] Error body:", err?.response?.data ?? err?.data ?? err?.message);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error   ||
        err?.data?.message           ||
        err?.message                 ||
        "Something went wrong — check browser console for details.";
      ErrorToaster(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    resetFields();
    handleClose(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog
      isOpen={open}
      onClose={handleDialogClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* ── Header ── */}
        <div className={style.spaceBetween}>

          {/* Country dropdown — emoji flags, no CDN needed */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCountryDropdownOpen((p) => !p)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#f5f5f5", border: "1px solid #ccc",
                borderRadius: 4, padding: "4px 10px", cursor: "pointer",
                fontSize: 13, color: "#333", minWidth: 90,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{selectedCountry.flag}</span>
              <span style={{ fontWeight: 600 }}>{selectedCountry.name}</span>
              <span style={{ fontSize: 10, marginLeft: 2, color: "#666" }}>▾</span>
            </button>

            {countryDropdownOpen && (
              <div style={{
                position: "absolute", top: "110%", left: 0, zIndex: 9999,
                background: "#fff", border: "1px solid #ddd", borderRadius: 6,
                boxShadow: "0 6px 20px rgba(0,0,0,.15)", minWidth: 220,
                maxHeight: 280, overflowY: "auto",
              }}>
                {COUNTRY_LIST.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => { setSelectedCountry(c); setCountryDropdownOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 14px", cursor: "pointer", fontSize: 13,
                      backgroundColor:
                        c.code === selectedCountry.code ? "#e8f4f7" : "transparent",
                      fontWeight: c.code === selectedCountry.code ? 600 : 400,
                    }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{c.flag}</span>
                    <span>{c.label}</span>
                    <span style={{ marginLeft: "auto", color: "#999", fontSize: 11 }}>
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className={style.extensionStyle}>Setup your Disclosures</p>

          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img src={WritingFile} className={style.dialogCrossStyle} alt="Writing File" />
            <Icon
              icon="cross" size={30} intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={handleDialogClose}
            />
          </div>
        </div>

        {/* Backdrop to close country dropdown */}
        {countryDropdownOpen && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={() => setCountryDropdownOpen(false)}
          />
        )}

        <div className={style.ReferenceListEntityBorder} />

        {/* ── Form body ── */}
        <div className={style.addHealthCareBoxStyle}>

          {/* SITE TYPE* — multiselect */}
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
                renderValue={(sel) =>
                  !sel?.length
                    ? <span style={{ color: "#9e9e9e" }}>Select Site - Multiselect</span>
                    : siteTypeList
                        .filter((s) => sel.includes(s?.id))
                        .map(getSiteName)
                        .join(", ")
                }
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {siteTypeList.length === 0 && (
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

          {/* APPLICANT TYPE* — multiselect */}
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
                renderValue={(sel) =>
                  !sel?.length
                    ? <span style={{ color: "#9e9e9e" }}>Select Applicant Type - Multiselect</span>
                    : applicantTypeList
                        .filter((a) => sel.includes(a?.id))
                        .map(getApplicantLabel)
                        .join(", ")
                }
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {applicantTypeList.length === 0 && (
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

          {/* DISCLOSURE CATEGORY* + ADD SUB-CATEGORY */}
          <div className={style.marginTop20}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 5,
            }}>
              <div className={style.entityLableStyle} style={{ marginBottom: 0 }}>
                DISCLOSURE CATEGORY *
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#52575d", textTransform: "uppercase" }}>
                  Add Sub-Category?
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
                    <span style={{ fontSize: 12 }}>
                      {addSubCategory ? "Yes" : "No"}
                    </span>
                  }
                  labelPlacement="end"
                  style={{ margin: 0 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
              placeholder="Enter Text Here"
              value={instructionalText}
              onChange={(e) => setInstructionalText(e.target.value)}
            />
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* DISCLOSURE TEXT — purple border per XD */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DISCLOSURE TEXT</div>
            <TextField
              multiline minRows={4} fullWidth size="small" variant="outlined"
              placeholder="Enter Text Here"
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
                { value: "yes-no",    label: "Yes / No"                  },
                { value: "yes-no-na", label: "Yes / No / Not Applicable" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}
                >
                  <input
                    type="radio" name="resp-opts" value={value}
                    checked={responseOption === value}
                    onChange={() => setResponseOption(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* APPLICANT GUIDANCE TEXT FOR 'YES' RESPONSES */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              APPLICANT GUIDANCE TEXT FOR &apos;YES&apos; RESPONSES
            </div>
            <TextField
              multiline minRows={3} fullWidth size="small" variant="outlined"
              placeholder="Enter Applicant Guidance Text Here"
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

          {/* Requires Disclosures Verification + Required From */}
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
                    renderValue={(v) =>
                      v || <span style={{ color: "#9e9e9e" }}>Select Required From</span>
                    }
                  >
                    <MenuItem value="practising physician">Practising Physician</MenuItem>
                    <MenuItem value="current employer">Current Employer</MenuItem>
                    <MenuItem value="former employer">Former Employer</MenuItem>
                  </Select>
                </FormControl>
              )}
            </div>
          </div>

          {/* Release Of Information Authorization */}
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
                <span>
                  <strong>{uploadedFiles.length}</strong> file{uploadedFiles.length !== 1 ? "s" : ""} selected
                </span>
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
                    <span style={{
                      fontSize: 14, color: statusColor(f.status),
                      minWidth: 18, textAlign: "center", fontWeight: "bold",
                    }}>
                      {statusIcon(f.status)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, color: "#333",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {f.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {fmtSize(f.size)}
                        {f.status === "uploading" && " — uploading..."}
                        {f.status === "error" && (
                          <span style={{ color: "#d32f2f" }}> — {f.error || "failed"}</span>
                        )}
                      </div>
                    </div>
                    {f.status !== "uploading" && (
                      <button
                        onClick={() => removeFile(idx)}
                        style={{
                          background: "none", border: "none", color: "#d32f2f",
                          cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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

export default DisclosureByIndustriesDialog;