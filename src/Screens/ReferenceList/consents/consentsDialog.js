import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../../utils/toaster";
import { POST, GET, PUT } from "./../../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import Editor from "../common/Editor";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// ── Flag icon CDN (flag-icons) ────────────────────────────
// Loaded once via a <link> injected into <head> if not already present
const injectFlagIconsCSS = () => {
  if (document.getElementById("flag-icons-css")) return;
  const link = document.createElement("link");
  link.id   = "flag-icons-css";
  link.rel  = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/css/flag-icons.min.css";
  document.head.appendChild(link);
};

// ── Known country list (ISO 3166-1 alpha-2 + display name) ─
// Covers all common healthcare markets. Extend as needed.
const COUNTRY_LIST = [
  { code: "us", name: "USA",        label: "United States"   },
  { code: "gb", name: "UK",         label: "United Kingdom"  },
  { code: "ca", name: "Canada",     label: "Canada"          },
  { code: "au", name: "Australia",  label: "Australia"       },
  { code: "in", name: "India",      label: "India"           },
  { code: "de", name: "Germany",    label: "Germany"         },
  { code: "fr", name: "France",     label: "France"          },
  { code: "sg", name: "Singapore",  label: "Singapore"       },
  { code: "ae", name: "UAE",        label: "United Arab Emirates" },
  { code: "nz", name: "NZ",         label: "New Zealand"     },
];

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":     { color: "#06617A" },
    "& .MuiSwitch-track": { backgroundColor: "#06617A !important" },
  },
});

// Per-file entry shape
const makeFileEntry = (file) => ({
  name: file.name, size: file.size,
  status: "pending", data: null, error: null,
});

const ConsentsDialog = ({
  open,
  handleClose,
  isEdit,
  selectedConsent,
  applicantTypeList: propApplicantTypeList,
}) => {
  const classes = useStyles();

  // ── Country selector state ────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_LIST[0]); // default USA
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // ── Form fields ───────────────────────────────────────────
  const [applicantTypeList, setApplicantTypeList]             = useState([]);
  const [selectedApplicantTypeId, setSelectedApplicantTypeId] = useState("");
  const [consentTitle, setConsentTitle]                       = useState("");
  const [consentContent, setConsentContent]                   = useState("");
  const [alertNoteRequired, setAlertNoteRequired]             = useState(true);
  const [alertNoteText, setAlertNoteText]                     = useState("");
  const [signatureRequired, setSignatureRequired]             = useState(false);
  const [isSubmitting, setIsSubmitting]                       = useState(false);
  const [titleError, setTitleError]                           = useState(false);

  // Multi-file upload state
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading]     = useState(false);

  // ── Inject flag CSS once ──────────────────────────────────
  useEffect(() => { injectFlagIconsCSS(); }, []);

  // ── Load applicant type list ──────────────────────────────
  useEffect(() => {
    if (propApplicantTypeList?.length > 0) {
      // Deduplicate the parent-provided list by name too
      const seenNames = new Set();
      const unique = propApplicantTypeList.filter((item) => {
        const label = getApplicantLabel(item)?.trim()?.toLowerCase();
        if (!label || seenNames.has(label)) return false;
        seenNames.add(label);
        return true;
      });
      setApplicantTypeList(unique);
    } else {
      fetchApplicantTypes();
    }
  }, [propApplicantTypeList]);

  const fetchApplicantTypes = async () => {
    try {
      const res = await GET("entity-service/applicantType");
      // Robust unwrap — handles all response shapes from the API
      const raw =
        res?.data?.content ||
        res?.data?.data    ||
        res?.data          ||
        res?.content       ||
        (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];
      // Deduplicate by name
      const seenNames = new Set();
      const unique = list.filter((item) => {
        const label = getApplicantLabel(item)?.trim()?.toLowerCase();
        if (!label || seenNames.has(label)) return false;
        seenNames.add(label);
        return true;
      });
      console.log("[ConsentsDialog] applicantTypes:", list.length, "deduped:", unique.length);
      setApplicantTypeList(unique);
    } catch (e) { console.error("applicantType:", e); }
  };

  // ── Populate / reset when dialog opens ───────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedConsent) {
      const typeId =
        selectedConsent?.applicantType?.id ||
        selectedConsent?.applicantTypes?.[0]?.id || "";
      setSelectedApplicantTypeId(typeId);
      setConsentTitle(selectedConsent?.title || "");
      const rawContent = selectedConsent?.content;
      setConsentContent(typeof rawContent === "string" ? rawContent : rawContent?.content || "");
      setAlertNoteRequired(selectedConsent?.alertNoteRequired ?? true);
      const rawAlert = selectedConsent?.alertNote;
      setAlertNoteText(typeof rawAlert === "string" ? rawAlert : rawAlert?.note || rawAlert?.text || "");
      setSignatureRequired(selectedConsent?.esignatureRequired || false);
      setUploadedFiles([]);
      // Restore country if saved
      if (selectedConsent?.country) {
        const saved = COUNTRY_LIST.find(
          (c) => c.code === selectedConsent.country?.code || c.name === selectedConsent.country?.name
        );
        if (saved) setSelectedCountry(saved);
      }
    } else {
      resetFields();
    }
    setTitleError(false);
  }, [open, isEdit, selectedConsent]);

  const resetFields = () => {
    setSelectedApplicantTypeId("");
    setConsentTitle("");
    setConsentContent("");
    setAlertNoteRequired(true);
    setAlertNoteText("");
    setSignatureRequired(false);
    setUploadedFiles([]);
    setTitleError(false);
    setSelectedCountry(COUNTRY_LIST[0]);
    setCountryDropdownOpen(false);
  };

  const getApplicantLabel = (item) => {
    const raw = item?.applicantType;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw))      return raw[0] || "";
    if (typeof raw === "object") return raw?.type || raw?.name || "";
    return "";
  };

  const formatSize = (bytes) => {
    if (bytes < 1024)        return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Upload single file ────────────────────────────────────
  const uploadSingleFile = async (file, index) => {
    setUploadedFiles((prev) =>
      prev.map((f, i) => i === index ? { ...f, status: "uploading" } : f)
    );
    try {
      const formData = new FormData();
      formData.append(
        "fileDTO",
        new Blob([JSON.stringify({ fileName: file.name })], { type: "application/json" })
      );
      formData.append("file", file);
      const response = await POST("entity-service/consentForm/file", formData);
      const fileData = response?.data || { fileName: file.name };
      setUploadedFiles((prev) =>
        prev.map((f, i) => i === index ? { ...f, status: "done", data: fileData } : f)
      );
      return { success: true, data: fileData };
    } catch (e) {
      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: "error", error: e?.message || "Upload failed" } : f
        )
      );
      return { success: false };
    }
  };

  // ── Bulk upload — all files in parallel ───────────────────
  const handleBulkUpload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const startIndex = uploadedFiles.length;
    setUploadedFiles((prev) => [...prev, ...files.map(makeFileEntry)]);
    setIsUploading(true);
    const results = await Promise.all(
      files.map((file, i) => uploadSingleFile(file, startIndex + i))
    );
    const successCount = results.filter((r) => r.success).length;
    const failCount    = results.length - successCount;
    if (successCount > 0 && failCount === 0)      SuccessToaster(`${successCount} file${successCount > 1 ? "s" : ""} uploaded successfully.`);
    else if (successCount > 0 && failCount > 0)   SuccessToaster(`${successCount} uploaded, ${failCount} failed.`);
    else                                           ErrorToaster("All file uploads failed. Please try again.");
    setIsUploading(false);
  };

  const removeFile = (index) => setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    if (!consentTitle.trim()) {
      setTitleError(true);
      ErrorToaster("Consent Title is required.");
      return false;
    }
    setTitleError(false);
    return true;
  };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async (isSaveAndExit) => {
    if (!validate()) return;
    setIsSubmitting(true);

    const selectedType = applicantTypeList.find((t) => t.id === selectedApplicantTypeId);
    const successfulFiles = uploadedFiles.filter((f) => f.status === "done").map((f) => f.data);

    const payload = {
      applicantType: selectedType
        ? { id: selectedType.id, applicantType: getApplicantLabel(selectedType) }
        : undefined,
      title:              consentTitle.trim(),
      content:            consentContent,
      alertNote:          alertNoteText,
      alertNoteRequired:  alertNoteRequired,
      esignatureRequired: signatureRequired,
      // Country saved with the form
      country: { code: selectedCountry.code, name: selectedCountry.name, label: selectedCountry.label },
      ...(successfulFiles.length > 1  ? { files: successfulFiles }      : {}),
      ...(successfulFiles.length === 1 ? { file: successfulFiles[0] }   : {}),
    };

    try {
      if (!isEdit) {
        await POST("entity-service/consentForm", JSON.stringify(payload));
        SuccessToaster("Consent Form added successfully.");
      } else {
        await PUT(`entity-service/consentForm/${selectedConsent?.id}`, JSON.stringify(payload));
        SuccessToaster("Consent Form updated successfully.");
      }
      resetFields();
      if (isSaveAndExit) handleClose(true);
    } catch (e) {
      console.error("[ConsentsDialog] Save error:", e);
      ErrorToaster(e?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => { resetFields(); handleClose(false); };

  // ── Status helpers ────────────────────────────────────────
  const statusIcon  = (s) => s === "uploading" ? "⏳" : s === "done" ? "✓" : s === "error" ? "✗" : "•";
  const statusColor = (s) => s === "done" ? "#06617A" : s === "error" ? "#d32f2f" : s === "uploading" ? "#f59e0b" : "#888";
  const uploadingCount = uploadedFiles.filter((f) => f.status === "uploading").length;
  const doneCount      = uploadedFiles.filter((f) => f.status === "done").length;
  const errorCount     = uploadedFiles.filter((f) => f.status === "error").length;

  // ── Render ────────────────────────────────────────────────
  return (
    <Dialog
      isOpen={open}
      onClose={handleCancel}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* ── Dialog Header Row ── */}
        <div className={style.spaceBetween} style={{ alignItems: "center" }}>

          {/* LEFT: Country / locale selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCountryDropdownOpen((prev) => !prev)}
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            6,
                background:     "#f5f6fa",
                border:         "1px solid #dee2e6",
                borderRadius:   6,
                padding:        "5px 10px",
                cursor:         "pointer",
                fontSize:       13,
                color:          "#333",
                fontWeight:     500,
              }}
            >
              {/* Flag icon using flag-icons CDN */}
              <span
                className={`fi fi-${selectedCountry.code}`}
                style={{ width: 20, height: 14, borderRadius: 2, display: "inline-block" }}
              />
              <span>{selectedCountry.name}</span>
              {/* Chevron */}
              <span style={{ fontSize: 10, color: "#888", marginLeft: 2 }}>▼</span>
            </button>

            {/* Dropdown panel */}
            {countryDropdownOpen && (
              <div style={{
                position:     "absolute",
                top:          "calc(100% + 4px)",
                left:         0,
                zIndex:       9999,
                background:   "#fff",
                border:       "1px solid #dee2e6",
                borderRadius: 8,
                boxShadow:    "0 4px 16px rgba(0,0,0,0.12)",
                minWidth:     180,
                overflow:     "hidden",
              }}>
                {COUNTRY_LIST.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setCountryDropdownOpen(false);
                    }}
                    style={{
                      display:         "flex",
                      alignItems:      "center",
                      gap:             10,
                      padding:         "9px 14px",
                      cursor:          "pointer",
                      fontSize:        13,
                      color:           "#333",
                      backgroundColor: selectedCountry.code === country.code ? "#f0f9fb" : "transparent",
                      fontWeight:      selectedCountry.code === country.code ? 600 : 400,
                      transition:      "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (selectedCountry.code !== country.code) e.currentTarget.style.backgroundColor = "#f5f6fa"; }}
                    onMouseLeave={(e) => { if (selectedCountry.code !== country.code) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <span
                      className={`fi fi-${country.code}`}
                      style={{ width: 20, height: 14, borderRadius: 2, display: "inline-block", flexShrink: 0 }}
                    />
                    <span>{country.label}</span>
                    {selectedCountry.code === country.code && (
                      <span style={{ marginLeft: "auto", color: "#06617A", fontSize: 14 }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: Dialog title */}
          <p className={style.extensionStyle} style={{ margin: 0, flex: 1, textAlign: "center" }}>
            {isEdit ? "Edit Consent Form" : "Setup your Consent Forms"}
          </p>

          {/* RIGHT: Writing icon + close */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={WritingFile} className={style.dialogCrossStyle} alt="Writing File" />
            <Icon
              icon="cross" size={30} intent={Intent.DANGER}
              className={style.dialogCrossStyle} onClick={handleCancel}
            />
          </div>
        </div>

        {/* Close dropdown when clicking outside */}
        {countryDropdownOpen && (
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={() => setCountryDropdownOpen(false)}
          />
        )}

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* APPLICANT TYPE */}
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
            <FormControl fullWidth size="small">
              <Select
                value={selectedApplicantTypeId}
                onChange={(e) => setSelectedApplicantTypeId(e.target.value)}
                displayEmpty
                renderValue={(value) => {
                  if (!value) return <span style={{ color: "#9e9e9e" }}>Select Applicant Type</span>;
                  const found = applicantTypeList.find((t) => t.id === value);
                  return found ? getApplicantLabel(found) : value;
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {applicantTypeList.length === 0 && <MenuItem disabled value="">No applicant types found</MenuItem>}
                {applicantTypeList.map((type, idx) => (
                  <MenuItem key={type?.id || idx} value={type?.id}>{getApplicantLabel(type)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* CONSENT TITLE */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>CONSENT TITLE *</div>
            <CommonInputField
              value={consentTitle}
              className={style.fullWidth}
              placeholder="e.g. HIPAA Patient Consent Form"
              onChange={(e) => {
                setConsentTitle(e.target.value);
                if (e.target.value.trim()) setTitleError(false);
              }}
            />
            {titleError && (
              <span style={{ color: "#d32f2f", fontSize: 12, marginTop: 4, display: "block" }}>
                Consent Title is required
              </span>
            )}
          </div>

          {/* CONSENT CONTENTS — overflow:hidden keeps toolbar inside box */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>CONSENT CONTENTS *</div>
            <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}>
              <Editor
                editorHtml={consentContent}
                onChange={(val) => setConsentContent(val)}
                placeholder="e.g. I hereby consent to the use and disclosure of my health information..."
              />
            </div>
          </div>

          {/* Alert Note Required */}
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>Alert Note Required</div>
            <div className={style.displayInRow}>
              <FormControlLabel
                control={
                  <Switch checked={alertNoteRequired} onChange={(e) => setAlertNoteRequired(e.target.checked)} className={classes.switch} />
                }
                className={style.switchFontStyle}
                label={alertNoteRequired ? "YES" : "NO"}
              />
              {alertNoteRequired && (
                <div className={`${style.displayInRow} ${style.inputBoxStyle} ${style.fullWidth}`}>
                  <InputGroup
                    value={alertNoteText}
                    onChange={(e) => setAlertNoteText(e.target.value)}
                    className={style.fullWidth}
                    placeholder="e.g. Please read carefully before signing"
                  />
                </div>
              )}
            </div>
          </div>

          {/* e-Signature toggle */}
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>Applicant e-Signature Required</div>
            <div className={`${style.displayInRow} ${style.displayTerminationPeriod}`}>
              <FormControlLabel
                control={
                  <Switch checked={signatureRequired} onChange={(e) => setSignatureRequired(e.target.checked)} className={classes.switch} />
                }
                className={style.switchFontStyle}
                label={signatureRequired ? "YES" : "NO"}
              />
            </div>
          </div>

          {/* Uploaded files list */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "#52575d", marginBottom: 8, display: "flex", gap: 12 }}>
                <span><strong>{uploadedFiles.length}</strong> file{uploadedFiles.length > 1 ? "s" : ""} selected</span>
                {doneCount      > 0 && <span style={{ color: "#06617A" }}>✓ {doneCount} uploaded</span>}
                {uploadingCount > 0 && <span style={{ color: "#f59e0b" }}>⏳ {uploadingCount} uploading</span>}
                {errorCount     > 0 && <span style={{ color: "#d32f2f" }}>✗ {errorCount} failed</span>}
              </div>
              <div style={{ border: "1px solid #dee2e6", borderRadius: 6, overflow: "hidden" }}>
                {uploadedFiles.map((f, idx) => (
                  <div key={idx} style={{
                    display: "flex", alignItems: "center", padding: "8px 12px", gap: 8,
                    borderBottom: idx < uploadedFiles.length - 1 ? "1px solid #f0f0f0" : "none",
                    backgroundColor: idx % 2 === 0 ? "#fff" : "#fafafa",
                  }}>
                    <span style={{ fontSize: 14, color: statusColor(f.status), minWidth: 18, textAlign: "center", fontWeight: "bold" }}>
                      {statusIcon(f.status)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {formatSize(f.size)}
                        {f.status === "uploading" && " — uploading..."}
                        {f.status === "error" && <span style={{ color: "#d32f2f" }}> — {f.error || "failed"}</span>}
                      </div>
                    </div>
                    {f.status !== "uploading" && (
                      <button onClick={() => removeFile(idx)} style={{
                        background: "none", border: "none", color: "#d32f2f",
                        cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 4px",
                      }} title="Remove file">×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={style.marginTop20}>
          <div className={style.floatLeft}>
            <input
              type="file" id="consent-bulk-upload" multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.txt"
              style={{ display: "none" }}
              onChange={(e) => { handleBulkUpload(e.target.files); e.target.value = ""; }}
            />
            <button
              className={style.outlinedButton}
              onClick={() => document.getElementById("consent-bulk-upload").click()}
              disabled={isSubmitting || isUploading}
            >
              {isUploading ? `UPLOADING (${uploadingCount})...`
                : uploadedFiles.length > 0 ? `ADD MORE FILES (${doneCount} done)`
                : "BULK UPLOAD"}
            </button>
          </div>
          <div className={style.floatRight}>
            <button className={style.outlinedButton} onClick={() => handleSave(true)} disabled={isSubmitting || isUploading}>
              {isSubmitting ? "SAVING..." : "SAVE & EXIT"}
            </button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave(false)} disabled={isSubmitting || isUploading}>
              {isSubmitting ? "SAVING..." : "SAVE & ADD MORE"}
            </button>
          </div>
        </div>

      </div>
    </Dialog>
  );
};

export default ConsentsDialog;