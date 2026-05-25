import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../../utils/toaster";
import { POST, GET, PUT } from "./../../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Switch, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import CommonDropZone from "../../../Components/CommonFields/CommonDropZone";
import Editor from "../common/Editor";
import MarkdownEditor from "../../../Components/MarkdownEditor";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";

// ── Flag icon CDN ─────────────────────────────────────────
const injectFlagIconsCSS = () => {
  if (document.getElementById("flag-icons-css")) return;
  const link = document.createElement("link");
  link.id   = "flag-icons-css";
  link.rel  = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/css/flag-icons.min.css";
  document.head.appendChild(link);
};

const COUNTRY_LIST = [
  { code: "us", name: "USA",        label: "United States"        },
  { code: "gb", name: "UK",         label: "United Kingdom"       },
  { code: "ca", name: "Canada",     label: "Canada"               },
  { code: "au", name: "Australia",  label: "Australia"            },
  { code: "in", name: "India",      label: "India"                },
  { code: "de", name: "Germany",    label: "Germany"              },
  { code: "fr", name: "France",     label: "France"               },
  { code: "sg", name: "Singapore",  label: "Singapore"            },
  { code: "ae", name: "UAE",        label: "United Arab Emirates" },
  { code: "nz", name: "NZ",         label: "New Zealand"          },
];

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":     { color: "#06617A" },
    "& .MuiSwitch-track": { backgroundColor: "#06617A !important" },
  },
});

const makeFileEntry = (file) => ({
  name: file.name, size: file.size,
  status: "pending", data: null, error: null,
});

const AcknowledgmentDialog = ({
  open,
  handleClose,
  isEdit,
  selectedAcknowledgement,
  applicantTypeList: propApplicantTypeList,
}) => {
  const classes = useStyles();

  // ── Country selector ──────────────────────────────────────
  const [selectedCountry, setSelectedCountry]       = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  // ── Form fields ───────────────────────────────────────────
  const [applicantTypeList, setApplicantTypeList]           = useState([]);
  const [applicantTypeIds, setApplicantTypeIds]             = useState([]);
  const [selectedApplicantTypes, setSelectedApplicantTypes] = useState([]);
  const [title, setTitle]                                   = useState("");
  const [content, setContent]                               = useState("");
  const [disclaimer, setDisclaimer]                         = useState("");
  const [eInitialRequired, setEInitialRequired]             = useState(false);
  const [signatureRequired, setSignatureRequired]           = useState(false);
  const [followUpRequired, setFollowUpRequired]             = useState(false);
  const [signatureRequiredFrom, setSignatureRequiredFrom]   = useState("");
  const [isSubmitting, setIsSubmitting]                     = useState(false);
  const [titleError, setTitleError]                         = useState(false);
  // contentType tracks the enum: "Text" | "Document" | "Image"
  const [contentType, setContentType]                       = useState("Text");

  // Multi-file upload
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading]     = useState(false);

  useEffect(() => { injectFlagIconsCSS(); }, []);

  // ── Load applicant type list ──────────────────────────────
  useEffect(() => {
    if (propApplicantTypeList?.length > 0) {
      setApplicantTypeList(propApplicantTypeList);
    } else {
      fetchApplicantTypes();
    }
  }, [propApplicantTypeList]);

  const fetchApplicantTypes = async () => {
    try {
      const { data } = await GET("entity-service/applicantType");
      setApplicantTypeList(data || []);
    } catch (e) { console.error("applicantType:", e); }
  };

  // ── Populate / reset on open ──────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedAcknowledgement) {
      const ids = (selectedAcknowledgement?.applicantTypes || []).map((d) => d?.id).filter(Boolean);
      setApplicantTypeIds(ids);
      setSelectedApplicantTypes(selectedAcknowledgement?.applicantTypes || []);
      setTitle(selectedAcknowledgement?.title || "");
      setContent(selectedAcknowledgement?.content?.content || "");
      setDisclaimer(selectedAcknowledgement?.disclaimer?.content || "");
      setEInitialRequired(selectedAcknowledgement?.einitialRequiredOnEachPage   || false);
      setSignatureRequired(selectedAcknowledgement?.esignatureRequiredOnEachPage || false);
      setFollowUpRequired(selectedAcknowledgement?.followUpTaskRequired              || false);
      setSignatureRequiredFrom(selectedAcknowledgement?.signatureRequiredFrom        || "");

      setUploadedFiles([]);
      setContentType(selectedAcknowledgement?.contentType || "Text");
      if (selectedAcknowledgement?.country) {
        const saved = COUNTRY_LIST.find(
          (c) => c.code === selectedAcknowledgement.country?.code || c.name === selectedAcknowledgement.country?.name
        );
        if (saved) setSelectedCountry(saved);
      }
    } else {
      resetFields();
    }
    setTitleError(false);
  }, [open, isEdit, selectedAcknowledgement]);

  useEffect(() => {
    if (applicantTypeIds.length > 0 && applicantTypeList.length > 0) {
      setSelectedApplicantTypes(
        applicantTypeList.filter((d) => applicantTypeIds.includes(d?.id))
      );
    }
  }, [applicantTypeIds, applicantTypeList]);

  const resetFields = () => {
    setApplicantTypeIds([]);
    setSelectedApplicantTypes([]);
    setTitle("");
    setContent("");
    setDisclaimer("");
    setEInitialRequired(false);
    setSignatureRequired(false);
    setFollowUpRequired(false);
    setSignatureRequiredFrom("");

    setUploadedFiles([]);
    setTitleError(false);
    setContentType("Text");
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

  const handleApplicantTypeChange = (value) => {
    setApplicantTypeIds(typeof value === "string" ? value.split(",") : value);
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
      const response = await POST("entity-service/acknowledgementForm/file", formData);
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
    if (successCount > 0 && failCount === 0)    SuccessToaster(`${successCount} file${successCount > 1 ? "s" : ""} uploaded successfully.`);
    else if (successCount > 0 && failCount > 0) SuccessToaster(`${successCount} uploaded, ${failCount} failed.`);
    else                                         ErrorToaster("All file uploads failed.");
    setIsUploading(false);
  };

  // CommonDropZone feeds into the same multi-file system
  const changeHandler = async (files, uploadedAs = "Document") => {
    const fileObj = Array.isArray(files) ? files[0] : files?.[0];
    if (!fileObj) return;
    setContentType(uploadedAs);
    await handleBulkUpload([fileObj]);
  };

  const removeFile = (index) => setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    if (!title.trim()) {
      setTitleError(true);
      ErrorToaster("Acknowledgement Form Title is required.");
      return false;
    }
    setTitleError(false);
    return true;
  };

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async (isSaveAndExit) => {
    if (!validate()) return;
    setIsSubmitting(true);

    // Determine effective contentType: if files uploaded, prefer their type; else keep state value
    const successfulFiles = uploadedFiles.filter((f) => f.status === "done").map((f) => f.data);
    // Schema has a single `file` field (filePath, fileName, fileURL) — use the first successful upload
    const filePayload = successfulFiles.length > 0 ? successfulFiles[0] : undefined;
    // If a file was uploaded, resolve contentType from upload; if only text entered keep "Text"
    const resolvedContentType = filePayload ? contentType : "Text";

    // Map applicantTypes to API schema shape: [{ id, applicantType }]
    const mappedApplicantTypes = selectedApplicantTypes.map((item) => ({
      id:            item?.id || "",
      applicantType: Array.isArray(item?.applicantType)
        ? item.applicantType[0] || ""
        : typeof item?.applicantType === "string"
          ? item.applicantType
          : "",
    }));

    const payload = {
      applicantTypes:               mappedApplicantTypes,          // [{ id, applicantType }] per schema
      title:                        title.trim(),
      content:                      { content },                   // Content { content: string }
      contentType:                  resolvedContentType,           // Enum: Document | Image | Text
      disclaimer:                   { content: disclaimer },       // Content { content: string }
      einitialRequiredOnEachPage:   eInitialRequired,             // boolean
      esignatureRequiredOnEachPage: signatureRequired,             // boolean
      followUpTaskRequired:         followUpRequired,              // boolean
      ...(followUpRequired && signatureRequiredFrom
        ? { signatureRequiredFrom }                               // CEO | Practitioner | Admin
        : {}),
      ...(filePayload ? { file: filePayload } : {}),              // File { filePath, fileName, fileURL }
    };

    try {
      if (!isEdit) {
        await POST("entity-service/acknowledgementForm", JSON.stringify(payload));
        SuccessToaster("Acknowledgement Form added successfully.");
      } else {
        await PUT(
          `entity-service/acknowledgementForm/${selectedAcknowledgement?.id}`,
          JSON.stringify(payload)
        );
        SuccessToaster("Acknowledgement Form updated successfully.");
      }
      resetFields();
      if (isSaveAndExit) handleClose(true);
    } catch (e) {
      console.error("[AckDialog] Save error:", e);
      ErrorToaster(e?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => { resetFields(); handleClose(false); };

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

          {/* LEFT: Country selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCountryDropdownOpen((prev) => !prev)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#f5f6fa", border: "1px solid #dee2e6", borderRadius: 6,
                padding: "5px 10px", cursor: "pointer", fontSize: 13, color: "#333", fontWeight: 500,
              }}
            >
              <span className={`fi fi-${selectedCountry.code}`}
                style={{ width: 20, height: 14, borderRadius: 2, display: "inline-block" }} />
              <span>{selectedCountry.name}</span>
              <span style={{ fontSize: 10, color: "#888", marginLeft: 2 }}>▼</span>
            </button>

            {countryDropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 9999,
                background: "#fff", border: "1px solid #dee2e6", borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 180, overflow: "hidden",
              }}>
                {COUNTRY_LIST.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => { setSelectedCountry(country); setCountryDropdownOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 14px", cursor: "pointer", fontSize: 13, color: "#333",
                      backgroundColor: selectedCountry.code === country.code ? "#f0f9fb" : "transparent",
                      fontWeight: selectedCountry.code === country.code ? 600 : 400,
                    }}
                    onMouseEnter={(e) => { if (selectedCountry.code !== country.code) e.currentTarget.style.backgroundColor = "#f5f6fa"; }}
                    onMouseLeave={(e) => { if (selectedCountry.code !== country.code) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <span className={`fi fi-${country.code}`}
                      style={{ width: 20, height: 14, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                    <span>{country.label}</span>
                    {selectedCountry.code === country.code && (
                      <span style={{ marginLeft: "auto", color: "#06617A", fontSize: 14 }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: Title */}
          <p className={style.extensionStyle} style={{ margin: 0, flex: 1, textAlign: "center" }}>
            {isEdit ? "Edit Acknowledgement Form" : "Setup Your Acknowledgement Forms"}
          </p>

          {/* RIGHT: Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={WritingFile} className={style.dialogCrossStyle} alt="Writing File" />
            <Icon icon="cross" size={30} intent={Intent.DANGER}
              className={style.dialogCrossStyle} onClick={handleCancel} />
          </div>
        </div>

        {/* Close dropdown on outside click */}
        {countryDropdownOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={() => setCountryDropdownOpen(false)} />
        )}

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* APPLICANT TYPE multiselect */}
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
            <FormControl className={style.fullWidth} size="small">
              <Select
                multiple
                value={applicantTypeIds}
                onChange={(e) => handleApplicantTypeChange(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected?.length)
                    return <span style={{ color: "#9e9e9e" }}>Select Applicant Type - Multiselect</span>;
                  return applicantTypeList.filter((d) => selected.includes(d?.id)).map(getApplicantLabel).join(", ");
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {applicantTypeList.length === 0 && <MenuItem disabled value="">No applicant types found</MenuItem>}
                {applicantTypeList.map((item, idx) => (
                  <MenuItem value={item?.id} key={item?.id || idx}>{getApplicantLabel(item)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* TITLE */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>ACKNOWLEDGEMENT FORM TITLE *</div>
            <CommonInputField
              value={title} className={style.fullWidth}
              onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError(false); }}
              placeholder="Enter Acknowledgement Form Title Here"
            />
            {titleError && (
              <span style={{ color: "#d32f2f", fontSize: 12, marginTop: 4, display: "block" }}>Title is required</span>
            )}
          </div>

          {/* CONTENT — overflow:hidden keeps toolbar inside */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>ACKNOWLEDGEMENT FORM CONTENT *</div>
            <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}>
              <Editor editorHtml={content} onChange={(val) => setContent(val)}
                placeholder="Enter Acknowledgement form Content Here" />
            </div>
          </div>

          {/* OR divider */}
          <div className={style.acknowledgementListContainer}>
            <div className={style.acknowledgementListEntityBorder} />
            <span className={style.acknowledgementText}>OR</span>
          </div>

          {/* Drop zones */}
          <div className={`${style.twoCol} ${style.marginTop20}`}>
            <CommonDropZone
              title={"Upload Your Documents"}
              description={"Upload your files or drag & drop from your cabinet"}
              changeHandler={(files) => changeHandler(files, "Document")}
            />
            <CommonDropZone
              title={"Upload A Photo"}
              description={"Click a picture with your Camera or upload from Gallery."}
              changeHandler={(files) => changeHandler(files, "Image")}
              accept="image/*"
            />
          </div>

          {/* DISCLAIMER — overflow:hidden keeps toolbar inside */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DISCLAIMER CONTENTS *</div>
            <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden", boxSizing: "border-box" }}>
              <MarkdownEditor editorHtml={disclaimer} onChange={(val) => setDisclaimer(val)}
                placeholder="Enter Disclaimer Here" />
            </div>
          </div>

          {/* Toggles */}
          {[
            { label: "Applicant e-Initials required on each page", value: eInitialRequired, setter: setEInitialRequired },
            { label: "Applicant e-Signature With Date Required",    value: signatureRequired, setter: setSignatureRequired },
          ].map(({ label, value, setter }) => (
            <div key={label} className={`${style.signatureGrid} ${style.marginTop20}`}>
              <div className={style.entityLableStyle}>{label}</div>
              <FormControlLabel
                control={<Switch checked={value} onChange={(e) => setter(e.target.checked)} className={classes.switch} />}
                className={style.switchFontStyle} label={value ? "Yes" : "No"} labelPlacement="start"
              />
            </div>
          ))}

          {/* Follow Up Task Required — with inline "Select Signature Required From" dropdown when Yes */}
          <div className={`${style.signatureGrid} ${style.marginTop20}`} style={{ alignItems: "center" }}>
            <div className={style.entityLableStyle}>Follow Up Task Required</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={followUpRequired}
                    onChange={(e) => {
                      setFollowUpRequired(e.target.checked);
                      if (!e.target.checked) setSignatureRequiredFrom("");
                    }}
                    className={classes.switch}
                  />
                }
                className={style.switchFontStyle}
                label={followUpRequired ? "Yes" : "No"}
                labelPlacement="start"
              />
              {followUpRequired && (
                <FormControl size="small" style={{ minWidth: 220 }}>
                  <Select
                    value={signatureRequiredFrom}
                    onChange={(e) => setSignatureRequiredFrom(e.target.value)}
                    displayEmpty
                    renderValue={(v) =>
                      v ? v : <span style={{ color: "#9e9e9e" }}>Select Signature Required From</span>
                    }
                  >
                    <MenuItem value="CEO">CEO</MenuItem>
                    <MenuItem value="Practitioner">Practitioner</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              )}
            </div>
          </div>

          {/* Uploaded files list */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "#52575d", marginBottom: 8, display: "flex", gap: 12 }}>
                <span><strong>{uploadedFiles.length}</strong> file{uploadedFiles.length > 1 ? "s" : ""} selected</span>
                {doneCount > 0      && <span style={{ color: "#06617A" }}>✓ {doneCount} uploaded</span>}
                {uploadingCount > 0 && <span style={{ color: "#f59e0b" }}>⏳ {uploadingCount} uploading</span>}
                {errorCount > 0     && <span style={{ color: "#d32f2f" }}>✗ {errorCount} failed</span>}
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
                      }}>×</button>
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
            <input type="file" id="ack-bulk-upload" multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.txt"
              style={{ display: "none" }}
              onChange={(e) => { handleBulkUpload(e.target.files); e.target.value = ""; }}
            />
            <button className={style.outlinedButton}
              onClick={() => document.getElementById("ack-bulk-upload").click()}
              disabled={isSubmitting || isUploading}>
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

export default AcknowledgmentDialog;