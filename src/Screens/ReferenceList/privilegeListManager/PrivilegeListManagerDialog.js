import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../../utils/toaster";
import { POST, PUT, GET } from "./../../dataSaver";

// ── Flag icon CDN ──────────────────────────────────────────────────────────────
const injectFlagIconsCSS = () => {
  if (document.getElementById("flag-icons-css")) return;
  const link = document.createElement("link");
  link.id   = "flag-icons-css";
  link.rel  = "stylesheet";
  link.href = "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/css/flag-icons.min.css";
  document.head.appendChild(link);
};

const COUNTRY_LIST = [
  { code: "us", name: "USA",       label: "United States"  },
  { code: "gb", name: "UK",        label: "United Kingdom" },
  { code: "ca", name: "Canada",    label: "Canada"         },
  { code: "au", name: "Australia", label: "Australia"      },
  { code: "in", name: "India",     label: "India"          },
  { code: "de", name: "Germany",   label: "Germany"        },
  { code: "fr", name: "France",    label: "France"         },
  { code: "sg", name: "Singapore", label: "Singapore"      },
  { code: "ae", name: "UAE",       label: "United Arab Emirates" },
  { code: "nz", name: "NZ",        label: "New Zealand"    },
];

const PRIVILEGE_TYPES = ["Core", "Restricted", "Non-Core"];

// ── Component ──────────────────────────────────────────────────────────────────
const PrivilegeListManagerDialog = ({
  open,
  handleClose,
  isEdit,
  selectedPrivilege,
  applicantTypeList: propApplicantTypeList = [],
  departmentList: propDepartmentList = [],
}) => {

  // ── Country selector ───────────────────────────────────────────────────────
  const [selectedCountry,      setSelectedCountry]      = useState(COUNTRY_LIST[0]);
  const [countryDropdownOpen,  setCountryDropdownOpen]  = useState(false);

  // ── Form fields ────────────────────────────────────────────────────────────
  const [privilegeType,        setPrivilegeType]        = useState("Core");
  const [applicantTypeList,    setApplicantTypeList]    = useState([]);
  const [applicantTypeIds,     setApplicantTypeIds]     = useState([]);
  const [selectedApplicantTypes, setSelectedApplicantTypes] = useState([]);
  const [privilegeStatus,      setPrivilegeStatus]      = useState("Active");
  const [privilegeId,          setPrivilegeId]          = useState("");
  const [privilegeTitle,       setPrivilegeTitle]       = useState("");
  const [privilegeDescription, setPrivilegeDescription] = useState("");

  // ── Extra fields for Restricted & Non-Core (from Swagger RestrictedPrivileges) ──
  const [isevidenceRequired,             setIsevidenceRequired]             = useState(false);          // boolean
  const [iscompetencyDisclosureRequired, setIscompetencyDisclosureRequired] = useState(false);          // boolean
  const [responseType,                   setResponseType]                   = useState("YES_OR_NO");    // Enum: YES_OR_NO | PRIVILEGEREQUIRED_OR_PRIVILEGEREQUESTED

  // ── Validation ─────────────────────────────────────────────────────────────
  const [idError,    setIdError]    = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  const bulkInputRef = React.useRef(null);

  // ── Boot ───────────────────────────────────────────────────────────────────
  useEffect(() => { injectFlagIconsCSS(); }, []);

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

  // ── Populate / reset on open ───────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedPrivilege) {
      const rawType = (selectedPrivilege?.type || selectedPrivilege?.privilegeType || "CORE").toUpperCase();
      setPrivilegeType(
        rawType.includes("RESTRICTED") ? "Restricted" :
        rawType.includes("NON")        ? "Non-Core"   : "Core"
      );

      const rawStatus = (selectedPrivilege?.status || selectedPrivilege?.privilegeStatus || "ACTIVE").toUpperCase();
      setPrivilegeStatus(rawStatus === "RETIRED" ? "Retired" : "Active");

      setPrivilegeId(selectedPrivilege?.privilegeId || "");
      setPrivilegeTitle(selectedPrivilege?.title || selectedPrivilege?.privilegeTitle || "");
      setPrivilegeDescription(selectedPrivilege?.description || selectedPrivilege?.privilegeDescription || "");

      // Populate extra fields from existing record
      setIsevidenceRequired(!!selectedPrivilege?.isevidenceRequired);
      setIscompetencyDisclosureRequired(!!selectedPrivilege?.iscompetencyDisclosureRequired);
      setResponseType(selectedPrivilege?.responseType || "YES_OR_NO");

      const atList = selectedPrivilege?.applicantType || selectedPrivilege?.applicantTypes || [];
      const ids = atList.map(a => a?.id).filter(Boolean);
      setApplicantTypeIds(ids);
      setSelectedApplicantTypes(atList);

      if (selectedPrivilege?.country) {
        const saved = COUNTRY_LIST.find(c => c.code === selectedPrivilege.country?.code);
        if (saved) setSelectedCountry(saved);
      }
    } else {
      resetFields();
    }
    setIdError(false);
    setTitleError(false);
  }, [open, isEdit, selectedPrivilege]);

  useEffect(() => {
    if (applicantTypeIds.length > 0 && applicantTypeList.length > 0) {
      setSelectedApplicantTypes(
        applicantTypeList.filter(a => applicantTypeIds.includes(a?.id))
      );
    }
  }, [applicantTypeIds, applicantTypeList]);

  const resetFields = () => {
    setPrivilegeType("Core");
    setPrivilegeStatus("Active");
    setPrivilegeId("");
    setPrivilegeTitle("");
    setPrivilegeDescription("");
    setIsevidenceRequired(false);
    setIscompetencyDisclosureRequired(false);
    setResponseType("YES_OR_NO");
    setApplicantTypeIds([]);
    setSelectedApplicantTypes([]);
    setSelectedCountry(COUNTRY_LIST[0]);
    setCountryDropdownOpen(false);
    setIdError(false);
    setTitleError(false);
  };

  const getApplicantLabel = (item) => {
    const raw = item?.applicantType;
    if (typeof raw === "string") return raw;
    if (Array.isArray(raw))      return raw[0] || "";
    if (typeof raw === "object") return raw?.type || raw?.name || "";
    return "";
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    let valid = true;
    if (!privilegeId.trim())    { setIdError(true);    valid = false; }
    if (!privilegeTitle.trim()) { setTitleError(true); valid = false; }
    if (!valid) ErrorToaster("Privilege ID and Title are required.");
    return valid;
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async (isSaveAndExit) => {
    if (!validate()) return;
    setIsSubmitting(true);

    const toTypeEnum = (val) => {
      const v = (val || "").toLowerCase();
      if (v.includes("restricted")) return "RESTRICTED";
      if (v.includes("non"))        return "NON_CORE";
      return "CORE";
    };
    const toStatusEnum = (val) => ((val || "").toUpperCase() === "RETIRED" ? "RETIRED" : "ACTIVE");

    const isRestrictedOrNonCore = privilegeType === "Restricted" || privilegeType === "Non-Core";

    const payload = {
      type:          toTypeEnum(privilegeType),
      status:        toStatusEnum(privilegeStatus),
      privilegeId:   privilegeId.trim(),
      title:         privilegeTitle.trim(),
      description:   privilegeDescription.trim(),
      applicantType: selectedApplicantTypes,
      country: {
        code:  selectedCountry.code,
        name:  selectedCountry.name,
        label: selectedCountry.label,
      },
      // Only include for Restricted / Non-Core — matches Swagger schema
      ...(isRestrictedOrNonCore && {
        isevidenceRequired:             isevidenceRequired,
        iscompetencyDisclosureRequired: iscompetencyDisclosureRequired,
        // field name differs per type: responseType (Restricted) vs type (Non-Core)
        ...(privilegeType === "Restricted"
          ? { responseType: responseType }
          : { type: responseType }
        ),
      }),
    };

    try {
      if (!isEdit) {
        await POST("entity-service/privilegeMaster", JSON.stringify(payload));
        SuccessToaster("Privilege added successfully.");
      } else {
        await PUT(
          `entity-service/privilegeMaster/${selectedPrivilege?.id}`,
          JSON.stringify(payload)
        );
        SuccessToaster("Privilege updated successfully.");
      }
      resetFields();
      if (isSaveAndExit) handleClose(true);
      // "Save & Add More" — reset form but keep dialog open
    } catch (e) {
      console.error("[PrivilegeDialog] Save error:", e);
      ErrorToaster(e?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => { resetFields(); handleClose(false); };

  const sectionLabel = () => {
    if (privilegeType === "Restricted") return "Restricted Privilege";
    if (privilegeType === "Non-Core")   return "Non-Core Privilege";
    return "Core Privilege";
  };

  const isRestrictedOrNonCore = privilegeType === "Restricted" || privilegeType === "Non-Core";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Dialog
      isOpen={open}
      onClose={handleCancel}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* ── Dialog Header ── */}
        <div className={style.spaceBetween} style={{ alignItems: "center" }}>

          {/* LEFT: Country selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCountryDropdownOpen(p => !p)}
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
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minWidth: 190, overflow: "hidden",
              }}>
                {COUNTRY_LIST.map(country => (
                  <div key={country.code}
                    onClick={() => { setSelectedCountry(country); setCountryDropdownOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 14px", cursor: "pointer", fontSize: 13, color: "#333",
                      background: selectedCountry.code === country.code ? "#f0f9fb" : "transparent",
                      fontWeight: selectedCountry.code === country.code ? 600 : 400,
                    }}
                    onMouseEnter={e => { if (selectedCountry.code !== country.code) e.currentTarget.style.background = "#f5f6fa"; }}
                    onMouseLeave={e => { if (selectedCountry.code !== country.code) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span className={`fi fi-${country.code}`}
                      style={{ width: 20, height: 14, borderRadius: 2, display: "inline-block", flexShrink: 0 }} />
                    <span>{country.label}</span>
                    {selectedCountry.code === country.code && (
                      <span style={{ marginLeft: "auto", color: "#06617A" }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CENTER: Dialog title */}
          <p className={style.extensionStyle} style={{ margin: 0, flex: 1, textAlign: "center" }}>
            {isEdit ? "Edit Staff Privileges" : "Add Staff Privileges"}
          </p>

          {/* RIGHT: Close icon */}
          <Icon icon="cross" size={28} intent={Intent.DANGER}
            className={style.dialogCrossStyle} onClick={handleCancel} />
        </div>

        {/* Close dropdown backdrop */}
        {countryDropdownOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={() => setCountryDropdownOpen(false)} />
        )}

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* ── PRIVILEGE TYPE: label left, radios right (inline) ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div className={style.entityLableStyle} style={{ margin: 0, whiteSpace: "nowrap" }}>
              PRIVILEGE TYPE *
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {PRIVILEGE_TYPES.map(type => (
                <label key={type}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                  <input
                    type="radio"
                    name="privilegeType"
                    value={type}
                    checked={privilegeType === type}
                    onChange={() => setPrivilegeType(type)}
                    style={{ accentColor: "#06617A", width: 16, height: 16 }}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* ── APPLICANT TYPE ── */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
            <FormControl className={style.fullWidth} size="small">
              <Select
                multiple
                value={applicantTypeIds}
                onChange={e => {
                  const val = e.target.value;
                  setApplicantTypeIds(typeof val === "string" ? val.split(",") : val);
                }}
                displayEmpty
                renderValue={selected => {
                  if (!selected?.length)
                    return <span style={{ color: "#9e9e9e" }}>Select Applicant Type</span>;
                  return applicantTypeList.filter(a => selected.includes(a?.id)).map(getApplicantLabel).join(", ");
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {applicantTypeList.length === 0
                  ? <MenuItem disabled value="">No applicant types found</MenuItem>
                  : applicantTypeList.map((item, idx) => (
                    <MenuItem value={item?.id} key={item?.id || idx}>{getApplicantLabel(item)}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* ── SECTION LABEL (Core Privilege / Restricted Privilege / Non-Core Privilege) ── */}
          <div className={style.marginTop20}
            style={{ fontWeight: 700, fontSize: 14, color: "#06617A" }}>
            {sectionLabel()}
          </div>

          {/* ── PRIVILEGE STATUS: label left, radios right (inline) ── */}
          <div className={style.marginTop20} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div className={style.entityLableStyle} style={{ margin: 0, whiteSpace: "nowrap" }}>
              PRIVILEGE STATUS *
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {["Active", "Retired"].map(status => (
                <label key={status}
                  style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                  <input
                    type="radio"
                    name="privilegeStatus"
                    value={status}
                    checked={privilegeStatus === status}
                    onChange={() => setPrivilegeStatus(status)}
                    style={{ accentColor: "#06617A", width: 16, height: 16 }}
                  />
                  {status}
                </label>
              ))}
            </div>
          </div>

          {/* ── PRIVILEGE ID + TITLE (two-column row) ── */}
          <div className={style.marginTop20}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Privilege ID */}
            <div>
              <div className={style.entityLableStyle}>PRIVILEGE ID *</div>
              <input
                value={privilegeId}
                onChange={e => { setPrivilegeId(e.target.value); if (e.target.value.trim()) setIdError(false); }}
                placeholder="e.g. 0243"
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: `1px solid ${idError ? "#d32f2f" : "#dee2e6"}`,
                  borderRadius: 4, padding: "8px 10px", fontSize: 14, outline: "none",
                }}
              />
              {idError && (
                <span style={{ color: "#d32f2f", fontSize: 11, marginTop: 3, display: "block" }}>
                  Privilege ID is required
                </span>
              )}
            </div>

            {/* Privilege Title */}
            <div>
              <div className={style.entityLableStyle}>PRIVILEGE TITLE *</div>
              <input
                value={privilegeTitle}
                onChange={e => { setPrivilegeTitle(e.target.value); if (e.target.value.trim()) setTitleError(false); }}
                placeholder="e.g. Salivary glands - biopsy of tumours"
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: `1px solid ${titleError ? "#d32f2f" : "#dee2e6"}`,
                  borderRadius: 4, padding: "8px 10px", fontSize: 14, outline: "none",
                }}
              />
              {titleError && (
                <span style={{ color: "#d32f2f", fontSize: 11, marginTop: 3, display: "block" }}>
                  Privilege Title is required
                </span>
              )}
            </div>
          </div>

          {/* ── PRIVILEGE DESCRIPTION ── */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>PRIVILEGE DESCRIPTION</div>
            <textarea
              value={privilegeDescription}
              onChange={e => setPrivilegeDescription(e.target.value)}
              placeholder="Add Description"
              rows={3}
              style={{
                width: "100%", boxSizing: "border-box",
                border: "1px solid #dee2e6", borderRadius: 4,
                padding: "8px 10px", fontSize: 14, resize: "vertical",
                outline: "none", fontFamily: "inherit",
              }}
            />
          </div>

          {/* ── EXTRA FIELDS: Restricted & Non-Core only ── */}
          {isRestrictedOrNonCore && (
            <>
              {/* responseType — Enum: YES_OR_NO | PRIVILEGEREQUIRED_OR_PRIVILEGEREQUESTED */}
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>RESPONSE TYPE</div>
                <div style={{ display: "flex", gap: 24, marginTop: 8, flexWrap: "wrap" }}>
                  {[
                    { value: "YES_OR_NO",                          label: "Yes or No" },
                    { value: "PRIVILEGEREQUIRED_OR_PRIVILEGEREQUESTED", label: "Privilege Required / Requested" },
                  ].map(opt => (
                    <label key={opt.value}
                      style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                      <input
                        type="radio"
                        name="responseType"
                        value={opt.value}
                        checked={responseType === opt.value}
                        onChange={() => setResponseType(opt.value)}
                        style={{ accentColor: "#06617A", width: 16, height: 16 }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* isevidenceRequired — boolean toggle */}
              <div className={style.marginTop20}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#333" }}>Evidence of Qualification and Competency Required</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, color: "#888", minWidth: 24, textAlign: "right" }}>
                    {isevidenceRequired ? "Yes" : "No"}
                  </span>
                  <div
                    onClick={() => setIsevidenceRequired(p => !p)}
                    style={{
                      width: 36, height: 20, borderRadius: 10, cursor: "pointer",
                      background: isevidenceRequired ? "#06617A" : "#ccc",
                      position: "relative", transition: "background 0.2s", flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 2,
                      left: isevidenceRequired ? 18 : 2,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    }} />
                  </div>
                </div>
              </div>

              {/* iscompetencyDisclosureRequired — boolean toggle */}
              <div className={style.marginTop20}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, color: "#333" }}>Competency Disclosure Required</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, color: "#888", minWidth: 24, textAlign: "right" }}>
                    {iscompetencyDisclosureRequired ? "Yes" : "No"}
                  </span>
                  <div
                    onClick={() => setIscompetencyDisclosureRequired(p => !p)}
                    style={{
                      width: 36, height: 20, borderRadius: 10, cursor: "pointer",
                      background: iscompetencyDisclosureRequired ? "#06617A" : "#ccc",
                      position: "relative", transition: "background 0.2s", flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 2,
                      left: iscompetencyDisclosureRequired ? 18 : 2,
                      width: 16, height: 16, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    }} />
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* ── Footer ── */}
        <div className={style.marginTop20}>
          <div className={style.floatLeft}>
            {/* Hidden file input — wired to bulkInputRef */}
            <input
              ref={bulkInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setIsBulkUploading(true);
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  // POST to same endpoint as main page bulk upload
                  // Stored at: entity-service/privilegeMaster/bulk (backend DB, same as individual records)
                  const res = await fetch(
                    `${process.env.REACT_APP_BASE_URL || ""}/entity-service/privilegeMaster/bulk`,
                    {
                      method: "POST",
                      body: fd,
                      headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token") || localStorage.getItem("token") || ""}`,
                      },
                    }
                  );
                  if (res.ok) {
                    SuccessToaster("Bulk upload successful!");
                    handleClose(true); // close dialog and trigger list refresh
                  } else {
                    const err = await res.json().catch(() => ({}));
                    ErrorToaster(err?.message || `Upload failed (${res.status}). Check file format.`);
                  }
                } catch (err) {
                  ErrorToaster(err?.message || "Upload failed. Please try again.");
                } finally {
                  setIsBulkUploading(false);
                  e.target.value = ""; // reset so same file can be re-selected
                }
              }}
            />
            <button
              className={style.outlinedButton}
              onClick={() => bulkInputRef.current?.click()}
              disabled={isSubmitting || isBulkUploading}
            >
              {isBulkUploading ? "UPLOADING..." : "BULK UPLOAD"}
            </button>
          </div>

          <div className={style.floatRight}>
            <button
              className={style.outlinedButton}
              onClick={() => handleSave(true)}
              disabled={isSubmitting || isBulkUploading}
            >
              {isSubmitting ? "SAVING..." : "SAVE & EXIT"}
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => handleSave(false)}
              disabled={isSubmitting || isBulkUploading}
            >
              {isSubmitting ? "SAVING..." : "SAVE & ADD MORE"}
            </button>
          </div>
        </div>

      </div>
    </Dialog>
  );
};

export default PrivilegeListManagerDialog;