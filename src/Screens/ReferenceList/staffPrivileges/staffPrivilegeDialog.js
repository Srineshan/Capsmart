import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { Radio, Switch, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import { Box } from "@mui/material";
import { POST, GET, PUT } from "./../../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import Editor from "../common/Editor";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";

// ─────────────────────────────────────────────────────────────────────────────
// StaffPrivilegeDialog
//
// Connection to PrivilegeListManager:
//   Loads /privilegeMaster (split by CORE / RESTRICTED / NON_CORE type enum)
//   so users can type-ahead select privileges by ID or Title rather than typing
//   freehand. PrivilegeListManager must be set up first for this to work.
//
// Payload field mapping (confirmed from network responses):
//   department    → { id }
//   serviceArea   → [{ id, name }]   ← the "service area" dropdown selection
//   sites         → [{ id }]         ← the actual site (Cambridge Memorial etc.)
//   applicantType → [{ id, applicantType }]
//   privilegeSpecificationType → "DISCRETE" | "DESCRIPTIVEDOCUMENT"
//   privilegeSetStatus         → "IN_USE" | "NOT_IN_USE"
// ─────────────────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":       { color: "#06617A" },
    "& .MuiSwitch-track":  { backgroundColor: "#06617A !important" },
  },
});

const StaffPrivilegeDialog = ({
  open,
  handleClose,
  currentSiteId,
  isEdit,
  selectedApplicant,
}) => {
  const classes = useStyles();

  // ── Reference data ──────────────────────────────────────────────────────────
  const [applicantTypes,       setApplicantTypes]       = useState([]);
  const [departments,          setDepartments]          = useState([]);
  const [serviceAreaOptions,   setServiceAreaOptions]   = useState([]);
  const [privilegeMasterCore,  setPrivilegeMasterCore]  = useState([]);
  const [privilegeMasterRest,  setPrivilegeMasterRest]  = useState([]);
  const [privilegeMasterNC,    setPrivilegeMasterNC]    = useState([]);

  // ── Form fields ─────────────────────────────────────────────────────────────
  const [departmentId,         setDepartmentId]         = useState("");
  const [selectedServiceAreas, setSelectedServiceAreas] = useState([]); // [{ id, name }]
  const [applicantTypeId,      setApplicantTypeId]      = useState("");
  const [bodDate,              setBodDate]              = useState("");
  const [privilegeSetStatus,   setPrivilegeSetStatus]   = useState("In Use");
  const [privilegeSetTitle,    setPrivilegeSetTitle]    = useState("");
  const [specType,             setSpecType]             = useState("DISCRETE");
  const [restrictedReq,        setRestrictedReq]        = useState(false);
  const [nonCoreReq,           setNonCoreReq]           = useState(false);
  const [proofDocReq,          setProofDocReq]          = useState(false);
  const [advancedReq,          setAdvancedReq]          = useState(false);
  const [generalInstruction,   setGeneralInstruction]   = useState("");
  const [evidenceReq,          setEvidenceReq]          = useState(false);
  const [competencyReq,        setCompetencyReq]        = useState(false);

  // ── Privilege rows — multi-row arrays ───────────────────────────────────────
  const [coreRows,    setCoreRows]    = useState([{ privilegeId: "", title: "", description: "", category: "" }]);
  const [restRows,    setRestRows]    = useState([{ privilegeId: "", title: "", description: "" }]);
  const [ncRows,      setNcRows]      = useState([{ privilegeId: "", title: "", description: "" }]);

  // ── Boot ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    if (open && isEdit && selectedApplicant) {
      populateEditFields(selectedApplicant);
    } else if (open && !isEdit) {
      resetFields();
    }
  }, [open, isEdit, selectedApplicant]);

  // ── Load all reference data in parallel ──────────────────────────────────────
  const loadReferenceData = async () => {
    await Promise.all([
      loadApplicantTypes(),
      loadDepartments(),
      loadServiceAreas(),
      loadPrivilegeMaster(),
    ]);
  };

  const loadApplicantTypes = async () => {
    try {
      const res = await GET("entity-service/applicantType");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = (Array.isArray(raw) ? raw : []).map(item => ({
        id:   item.id,
        name: typeof item.applicantType === "string"
          ? item.applicantType
          : Array.isArray(item.applicantType)
          ? item.applicantType[0] || ""
          : item?.name || "",
      }));
      setApplicantTypes(list);
    } catch (e) { console.warn("[Dialog] applicantTypes:", e?.message); }
  };

  const loadDepartments = async () => {
    try {
      const res = await GET("entity-service/department");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = (Array.isArray(raw) ? raw : []).map(item => ({
        id:   item.id,
        name: item?.departmentName?.name || item?.name || "",
        serviceAreas: item?.serviceAreas || [],
      }));
      setDepartments(list);
    } catch (e) { console.warn("[Dialog] departments:", e?.message); }
  };

  // Service areas — from staffPrivilege/departmentAndServiceArea or from department
  const loadServiceAreas = async () => {
    let areas = [];
    try {
      const res = await GET("entity-service/staffPrivilege/departmentAndServiceArea");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      if (Array.isArray(raw) && raw.length > 0) {
        const seen = new Set();
        raw.forEach(item => {
          const sas = item?.serviceAreas || item?.serviceArea || [];
          (Array.isArray(sas) ? sas : [sas]).forEach(sa => {
            if (sa?.id && !seen.has(sa.id)) {
              seen.add(sa.id);
              areas.push({ id: sa.id, name: sa.name || sa.serviceName || "" });
            }
          });
        });
      }
    } catch (e) { console.warn("[Dialog] departmentAndServiceArea:", e?.message); }

    // Fallback: pull from department serviceAreas
    if (areas.length === 0) {
      try {
        const res = await GET("entity-service/department");
        const raw = res?.data?.content || res?.data?.data || res?.data ||
          res?.content || (Array.isArray(res) ? res : []);
        const seen = new Set();
        (Array.isArray(raw) ? raw : []).forEach(dept => {
          (dept?.serviceAreas || []).forEach(sa => {
            if (sa?.id && !seen.has(sa.id)) {
              seen.add(sa.id);
              areas.push({ id: sa.id, name: sa.name || "" });
            }
          });
        });
      } catch (e) { console.warn("[Dialog] dept serviceAreas fallback:", e?.message); }
    }
    setServiceAreaOptions(areas);
  };

  // Load from PrivilegeListManager's /privilegeMaster — split by type enum
  const loadPrivilegeMaster = async () => {
    try {
      const res = await GET("entity-service/privilegeMaster");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];
      setPrivilegeMasterCore(list.filter(p => (p?.type || "").toUpperCase() === "CORE"));
      setPrivilegeMasterRest(list.filter(p => (p?.type || "").toUpperCase() === "RESTRICTED"));
      setPrivilegeMasterNC(list.filter(p => (p?.type || "").toUpperCase() === "NON_CORE"));
      console.log("[Dialog] privilegeMaster:", list.length, "total");
    } catch (e) { console.warn("[Dialog] privilegeMaster:", e?.message); }
  };

  // ── Populate fields from existing record (edit mode) ─────────────────────────
  const populateEditFields = (rec) => {
    setDepartmentId(rec?.department?.id || "");

    // Service areas stored as [{ id, name }] in API response
    const sas = Array.isArray(rec?.serviceArea) ? rec.serviceArea : [];
    setSelectedServiceAreas(sas.map(s => ({ id: s.id, name: s.name || "" })));

    // Applicant type stored as [{ id, applicantType }]
    const apt = Array.isArray(rec?.applicantType)
      ? rec.applicantType[0]
      : rec?.applicantType;
    setApplicantTypeId(apt?.id || "");

    setBodDate(rec?.bodApprovalDate || "");
    setPrivilegeSetStatus(rec?.privilegeSetStatus === "NOT_IN_USE" ? "Not In Use" : "In Use");
    setPrivilegeSetTitle(rec?.privilegeSetTitle || "");

    const st = rec?.privilegeSpecificationType || "DISCRETE";
    setSpecType(
      st === "DiscreteItemList"    ? "DISCRETE" :
      st === "DescriptiveDocument" ? "DESCRIPTIVEDOCUMENT" : st
    );

    setRestrictedReq(rec?.restrictedPrivilegesRequired || false);
    setNonCoreReq(rec?.nonCorePrivilegesRequired || false);
    setProofDocReq(rec?.proofOfDocumentationRequired || false);
    setGeneralInstruction(rec?.generalInstructionText || "");

    // Core privilege rows from privilegeDetails
    const coreCategories = rec?.privilegeDetails?.corePrivileges?.privilegesByCategories || [];
    const cRows = coreCategories.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId: p?.privilegeId || "",
        title:       p?.title || "",
        description: p?.description || "",
        category:    cat?.category || "",
      }))
    );
    if (cRows.length > 0) setCoreRows(cRows);

    // Restricted privilege rows
    const restCategories = rec?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories || [];
    const rRows = restCategories.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId: p?.privilegeId || "",
        title:       p?.title || "",
        description: p?.description || "",
      }))
    );
    if (rRows.length > 0) setRestRows(rRows);

    // Non-core privilege rows
    const ncCategories = rec?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories || [];
    const nRows = ncCategories.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId: p?.privilegeId || "",
        title:       p?.title || "",
        description: p?.description || "",
      }))
    );
    if (nRows.length > 0) setNcRows(nRows);
  };

  const resetFields = () => {
    setDepartmentId("");
    setSelectedServiceAreas([]);
    setApplicantTypeId("");
    setBodDate("");
    setPrivilegeSetStatus("In Use");
    setPrivilegeSetTitle("");
    setSpecType("DISCRETE");
    setRestrictedReq(false);
    setNonCoreReq(false);
    setProofDocReq(false);
    setAdvancedReq(false);
    setGeneralInstruction("");
    setEvidenceReq(false);
    setCompetencyReq(false);
    setCoreRows([{ privilegeId: "", title: "", description: "", category: "" }]);
    setRestRows([{ privilegeId: "", title: "", description: "" }]);
    setNcRows([{ privilegeId: "", title: "", description: "" }]);
  };

  // ── Service area select change ────────────────────────────────────────────────
  const handleServiceAreaChange = (e) => {
    const ids = typeof e.target.value === "string"
      ? e.target.value.split(",")
      : e.target.value;
    setSelectedServiceAreas(
      ids.map(id => {
        const found = serviceAreaOptions.find(s => s.id === id);
        return { id, name: found?.name || "" };
      })
    );
  };

  // ── Privilege row builders ───────────────────────────────────────────────────
  const buildPrivilegeCategories = (rows) => {
    const valid = rows.filter(r => r.privilegeId?.trim());
    if (!valid.length) return [];
    const groups = {};
    valid.forEach(r => {
      const cat = r.category || "";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({
        privilegeId: r.privilegeId,
        title:       r.title || "",
        description: r.description || "",
      });
    });
    return Object.entries(groups).map(([cat, privs]) => ({
      hasCategory: !!cat,
      category: cat,
      privileges: privs,
      subCategories: [],
    }));
  };

  const buildRestrictedCategories = (rows) => {
    const valid = rows.filter(r => r.privilegeId?.trim());
    if (!valid.length) return [];
    return [{
      hasCategory: false,
      category: "",
      privileges: valid.map(r => ({
        privilegeId:                    r.privilegeId,
        title:                          r.title || "",
        description:                    r.description || "",
        isevidenceRequired:             evidenceReq,
        iscompetencyDisclosureRequired: competencyReq,
      })),
      subCategories: [],
    }];
  };

  // ── Save handler ─────────────────────────────────────────────────────────────
  const handleSave = async (isSaveAndExit) => {
    if (!privilegeSetTitle.trim()) {
      ErrorToaster("Privilege Set Title is required.");
      return;
    }
    if (!departmentId) {
      ErrorToaster("Department is required.");
      return;
    }

    // Get applicantType full object for payload
    const apt = applicantTypes.find(a => a.id === applicantTypeId);

    const payload = {
      // Department — API expects { id } only (departmentName resolved server-side)
      department:    { id: departmentId },
      // Service area — [{ id, name }] — confirmed from response
      serviceArea:   selectedServiceAreas,
      // Sites — actual hospital site from parent page
      sites:         currentSiteId ? [{ id: currentSiteId }] : [],
      // Applicant type — [{ id, applicantType }]
      applicantType: apt ? [{ id: apt.id, applicantType: apt.name }] : [],
      bodApprovalDate:              bodDate,
      privilegeSetStatus:           privilegeSetStatus === "Not In Use" ? "NOT_IN_USE" : "IN_USE",
      privilegeSetTitle:            privilegeSetTitle.trim(),
      privilegeSpecificationType:   specType,  // "DISCRETE" | "DESCRIPTIVEDOCUMENT"
      proofOfDocumentationRequired: proofDocReq,
      restrictedPrivilegesRequired: restrictedReq,
      nonCorePrivilegesRequired:    nonCoreReq,
      generalInstructionText:       generalInstruction || "",
      // categoriesList — send non-empty category names from core rows
      categoriesList: coreRows.map(r => r.category || "").filter(c => c.trim()),
      privilegeDetails: {
        corePrivileges: {
          generalInstructionText: generalInstruction || "",
          privilegesByCategories: buildPrivilegeCategories(coreRows),
        },
        restrictedPrivileges: {
          generalInstructionText: "",
          privilegesByCategories: restrictedReq
            ? buildRestrictedCategories(restRows)
            : [],
        },
        nonCorePrivileges: {
          generalInstructionText: "",
          privilegesByCategories: nonCoreReq
            ? buildPrivilegeCategories(ncRows)
            : [],
        },
      },
    };

    console.log("[Dialog] payload:", JSON.stringify(payload));

    try {
      if (!isEdit) {
        await POST("entity-service/staffPrivilege", JSON.stringify(payload));
        SuccessToaster("Staff Privilege Added Successfully");
        resetFields();
        if (isSaveAndExit) {
          handleClose(true);   // close + refresh
        } else {
          handleClose(false);  // keep dialog open, refresh list
        }
      } else {
        await PUT(
          `entity-service/staffPrivilege/${selectedApplicant?.id}`,
          JSON.stringify(payload)
        );
        SuccessToaster("Staff Privilege Updated Successfully");
        resetFields();
        handleClose(true);
      }
    } catch (e) {
      console.error("[Dialog] save error:", e);
      ErrorToaster(e?.response?.data?.message || e?.message || "Save failed. Please try again.");
    }
  };

  // ── Privilege ID/Title row component ─────────────────────────────────────────
  const PrivilegeRow = ({ row, idx, masterList, rows, setRows, idListId, titleListId }) => (
    <div style={{
      display: "grid", gridTemplateColumns: "200px 1fr auto",
      gap: 10, marginTop: 8, alignItems: "flex-end",
    }}>
      {/* Privilege ID dropdown */}
      <div>
        <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>PRIVILEGE ID *</div>
        <div style={{ position: "relative" }}>
          <input
            list={idListId}
            value={row.privilegeId}
            placeholder="Type or select ID..."
            onChange={e => {
              const val = e.target.value;
              const found = masterList.find(p => p.privilegeId === val);
              const updated = [...rows];
              updated[idx] = {
                ...updated[idx],
                privilegeId: val,
                title:       found ? (found.title || "") : updated[idx].title,
                description: found ? (found.description || "") : updated[idx].description,
              };
              setRows(updated);
            }}
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1px solid #dee2e6", borderRadius: 4,
              padding: "8px 32px 8px 10px", fontSize: 14,
            }}
          />
          <span style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            fontSize: 10, color: "#888", pointerEvents: "none",
          }}>▼</span>
          <datalist id={idListId}>
            {masterList.map(p => (
              <option key={p.id} value={p.privilegeId}>
                {p.privilegeId} — {p.title}
              </option>
            ))}
          </datalist>
        </div>
      </div>

      {/* Privilege Title */}
      <div>
        <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>PRIVILEGE TITLE *</div>
        <input
          list={titleListId}
          value={row.title}
          placeholder="Type or select title..."
          onChange={e => {
            const val = e.target.value;
            const found = masterList.find(p => p.title === val);
            const updated = [...rows];
            updated[idx] = {
              ...updated[idx],
              title: val,
              privilegeId: found ? (found.privilegeId || updated[idx].privilegeId) : updated[idx].privilegeId,
            };
            setRows(updated);
          }}
          style={{
            width: "100%", boxSizing: "border-box",
            border: "1px solid #dee2e6", borderRadius: 4,
            padding: "8px 10px", fontSize: 14,
          }}
        />
        <datalist id={titleListId}>
          {masterList.map(p => (
            <option key={p.id} value={p.title}>
              {p.privilegeId} — {p.title}
            </option>
          ))}
        </datalist>
      </div>

      {/* Remove row */}
      {rows.length > 1 && (
        <button
          onClick={() => setRows(prev => prev.filter((_, i) => i !== idx))}
          style={{
            background: "none", border: "1px solid #e53935", color: "#e53935",
            borderRadius: 4, padding: "6px 10px", cursor: "pointer",
            fontSize: 12, alignSelf: "center",
          }}
        >✕ Remove</button>
      )}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <Dialog
      isOpen={open}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* Header */}
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit
              ? "Edit Department / Service Area Specific Privileges Set"
              : "Create Department / Service Area Specific Privileges Sets"}
          </p>
          <div className={style.displayInRow}>
            <div style={{ marginRight: 40 }}>
              <img src={WritingFile} className={style.dialogCrossStyle} alt="doc" />
            </div>
            <Icon
              icon="cross" size={30} intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={() => { resetFields(); handleClose(); }}
            />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* Row 1: Department + Service Area */}
          <Box display="flex" gap={2} className={style.marginTop20}>
            <Box width="50%">
              <div className={style.entityLableStyle}>DEPARTMENT / SERVICE AREA *</div>
              <FormControl fullWidth size="small">
                <Select
                  value={departmentId}
                  onChange={e => setDepartmentId(e.target.value)}
                  displayEmpty
                  renderValue={v => !v
                    ? <span style={{ color: "#9e9e9e" }}>Select Department</span>
                    : departments.find(d => d.id === v)?.name || v
                  }
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                >
                  {departments.map((d, i) => (
                    <MenuItem key={i} value={d.id}>{d.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box width="50%">
              <div className={style.entityLableStyle}>SERVICE AREA *</div>
              <FormControl fullWidth size="small">
                <Select
                  multiple
                  value={selectedServiceAreas.map(s => s.id)}
                  onChange={handleServiceAreaChange}
                  displayEmpty
                  renderValue={sel => !sel?.length
                    ? <span style={{ color: "#9e9e9e" }}>Select service area</span>
                    : serviceAreaOptions
                        .filter(s => sel.includes(s.id))
                        .map(s => s.name)
                        .join(", ")
                  }
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                >
                  {serviceAreaOptions.map((s, i) => (
                    <MenuItem key={i} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Row 2: Applicant Type + BOD Approval Date */}
          <Box display="flex" gap={2} className={style.marginTop20}>
            <Box width="50%">
              <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
              <FormControl fullWidth size="small">
                <Select
                  value={applicantTypeId}
                  onChange={e => setApplicantTypeId(e.target.value)}
                  displayEmpty
                  renderValue={v => !v
                    ? <span style={{ color: "#9e9e9e" }}>Select Applicant</span>
                    : applicantTypes.find(a => a.id === v)?.name || v
                  }
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                >
                  {applicantTypes.map((a, i) => (
                    <MenuItem key={i} value={a.id}>{a.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box width="50%">
              <div className={style.entityLableStyle}>BOD APPROVAL DATE *</div>
              <CommonInputField
                type="date"
                value={bodDate}
                onChange={e => setBodDate(e.target.value)}
                className={style.inputField}
                fullWidth
              />
            </Box>
          </Box>

          {/* Privilege Set Status */}
          <div className={`${style.marginTop20} ${style.validation}`}>
            <div className={style.entityLableStyle}>PRIVILEGE SET STATUS *</div>
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              {["In Use", "Not In Use"].map(status => (
                <FormControlLabel
                  key={status}
                  control={
                    <Radio
                      checked={privilegeSetStatus === status}
                      onChange={() => setPrivilegeSetStatus(status)}
                      value={status}
                      style={{ color: "#06617A" }}
                    />
                  }
                  label={status}
                />
              ))}
            </div>
          </div>

          {/* Privilege Set Title */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DEPARTMENT SPECIFIC PRIVILEGE SET TITLE *</div>
            <CommonInputField
              value={privilegeSetTitle}
              onChange={e => setPrivilegeSetTitle(e.target.value)}
              placeholder="Add Privilege set Title"
              className={style.inputField}
              fullWidth
            />
          </div>

          {/* Privilege Specification Type */}
          <div className={`${style.marginTop20} ${style.validation}`}>
            <div className={style.entityLableStyle}>PRIVILEGE SPECIFICATION TYPE *</div>
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              {[
                { value: "DESCRIPTIVEDOCUMENT", label: "Descriptive Document" },
                { value: "DISCRETE",            label: "Discreet Item List"   },
              ].map(item => (
                <FormControlLabel
                  key={item.value}
                  control={
                    <Radio
                      checked={specType === item.value}
                      onChange={() => { setSpecType(item.value); setProofDocReq(false); }}
                      value={item.value}
                      style={{ color: "#06617A" }}
                    />
                  }
                  label={item.label}
                />
              ))}
            </div>
          </div>

          {/* Restricted + Non-Core toggles */}
          <div style={{ display: "flex", gap: 40, marginTop: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={style.entityLableStyle}>RESTRICTED PRIVILEGES REQUIRED?</span>
              <FormControlLabel
                control={
                  <Switch
                    checked={restrictedReq}
                    onChange={e => setRestrictedReq(e.target.checked)}
                    className={classes.switch}
                  />
                }
                label={restrictedReq ? "Yes" : "No"}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={style.entityLableStyle}>NON-CORE PRIVILEGES REQUIRED?</span>
              <FormControlLabel
                control={
                  <Switch
                    checked={nonCoreReq}
                    onChange={e => setNonCoreReq(e.target.checked)}
                    className={classes.switch}
                  />
                }
                label={nonCoreReq ? "Yes" : "No"}
              />
            </div>
          </div>

          {/* General Instruction Text */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>GENERAL INSTRUCTION TEXT</div>
            <Editor
              value={generalInstruction}
              onChange={setGeneralInstruction}
              placeholder="Enter GENERAL INSTRUCTION Here"
            />
          </div>

          {/* Advanced Privileges toggle */}
          <div className={style.marginTop20} style={{ borderBottom: "2px solid #06617A", paddingBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={style.entityLableStyle}>ADVANCED PRIVILEGES REQUIRED?</span>
              <FormControlLabel
                control={
                  <Switch
                    checked={advancedReq}
                    onChange={e => setAdvancedReq(e.target.checked)}
                    className={classes.switch}
                  />
                }
                label={advancedReq ? "Yes" : "No"}
              />
            </div>
          </div>

          <div className={`${style.Borderthick}`} />

          {/* ── APPLICABLE CORE PRIVILEGES ──────────────────────────────────── */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>APPLICABLE CORE PRIVILEGES</div>
            {coreRows.map((row, idx) => (
              <PrivilegeRow
                key={idx}
                row={row} idx={idx}
                masterList={privilegeMasterCore}
                rows={coreRows} setRows={setCoreRows}
                idListId={`core-id-${idx}`}
                titleListId={`core-title-${idx}`}
              />
            ))}
            <button
              onClick={() => setCoreRows(prev => [
                ...prev, { privilegeId: "", title: "", description: "", category: "" },
              ])}
              className={`${style.outlinedButton} ${style.borderRadius10}`}
              style={{ marginTop: 10 }}
            >
              + ADD MORE
            </button>
          </div>

          <div className={`${style.Borderthick} ${style.marginTop20}`} />

          {/* ── RESTRICTED PRIVILEGES (conditional) ─────────────────────────── */}
          {restrictedReq && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>RESTRICTED PRIVILEGES</div>
              {restRows.map((row, idx) => (
                <PrivilegeRow
                  key={idx}
                  row={row} idx={idx}
                  masterList={privilegeMasterRest}
                  rows={restRows} setRows={setRestRows}
                  idListId={`rest-id-${idx}`}
                  titleListId={`rest-title-${idx}`}
                />
              ))}
              <button
                onClick={() => setRestRows(prev => [
                  ...prev, { privilegeId: "", title: "", description: "" },
                ])}
                className={`${style.outlinedButton} ${style.borderRadius10}`}
                style={{ marginTop: 10 }}
              >
                + ADD MORE
              </button>

              {/* Evidence + Competency toggles */}
              <div style={{ display: "flex", gap: 32, marginTop: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={style.entityLableStyle}>EVIDENCE OF QUALIFICATION AND COMPETENCY</span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={evidenceReq}
                        onChange={e => setEvidenceReq(e.target.checked)}
                        className={classes.switch}
                      />
                    }
                    label={evidenceReq ? "Yes" : "No"}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={style.entityLableStyle}>COMPETENCY DISCLOSURE NOTES</span>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={competencyReq}
                        onChange={e => setCompetencyReq(e.target.checked)}
                        className={classes.switch}
                      />
                    }
                    label={competencyReq ? "Yes" : "No"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── NON-CORE PRIVILEGES (conditional) ───────────────────────────── */}
          {nonCoreReq && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>NON-CORE PRIVILEGES</div>
              {ncRows.map((row, idx) => (
                <PrivilegeRow
                  key={idx}
                  row={row} idx={idx}
                  masterList={privilegeMasterNC}
                  rows={ncRows} setRows={setNcRows}
                  idListId={`nc-id-${idx}`}
                  titleListId={`nc-title-${idx}`}
                />
              ))}
              <button
                onClick={() => setNcRows(prev => [
                  ...prev, { privilegeId: "", title: "", description: "" },
                ])}
                className={`${style.outlinedButton} ${style.borderRadius10}`}
                style={{ marginTop: 10 }}
              >
                + ADD MORE
              </button>
            </div>
          )}

        </div>{/* end addHealthCareBoxStyle */}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button className={`${style.outlinedButton} ${style.borderRadius10}`}>
              BULK UPLOAD
            </button>
            <button className={`${style.outlinedButton} ${style.borderRadius10}`}>
              PREVIEW
            </button>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className={`${style.outlinedButton} ${style.borderRadius10}`}
              onClick={() => handleSave(true)}
            >
              SAVE & EXIT
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20} ${style.borderRadius10}`}
              onClick={() => handleSave(false)}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>

      </div>{/* end extensionDialogBackground */}
    </Dialog>
  );
};

export default StaffPrivilegeDialog;