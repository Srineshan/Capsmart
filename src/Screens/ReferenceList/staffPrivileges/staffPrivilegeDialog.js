import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import { POST, GET, PUT } from "../../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, makeStyles, Radio } from "@material-ui/core";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import WritingFile from "./../../../images/writing-file.svg";
import Editor from "../common/Editor";

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":     { color: "#06617A" },
    "& .MuiSwitch-track": { backgroundColor: "#06617A !important" },
  },
});

const StaffPrivilegeDialog = ({
  open,
  handleClose,
  isEdit,
  selectedApplicant,
  currentSiteId,
  departmentMap,
}) => {
  const classes = useStyles();

  const [departments,         setDepartments]         = useState([]);
  const [serviceAreaOptions,  setServiceAreaOptions]  = useState([]);
  const [applicantTypes,      setApplicantTypes]      = useState([]);
  const [privilegeMasterCore, setPrivilegeMasterCore] = useState([]);
  const [privilegeMasterRest, setPrivilegeMasterRest] = useState([]);
  const [privilegeMasterNC,   setPrivilegeMasterNC]   = useState([]);
  const [isFetchingSA,        setIsFetchingSA]        = useState(false);
  // Stores the full raw dept API object keyed by id — used to extract service areas
  const [deptRawMap,          setDeptRawMap]          = useState({});

  const [departmentId,       setDepartmentId]       = useState("");
  const [serviceAreas,       setServiceAreas]       = useState([]);
  const [applicantTypeId,    setApplicantTypeId]    = useState("");
  const [bodDate,            setBodDate]            = useState("");
  const [privilegeSetStatus, setPrivilegeSetStatus] = useState("IN_USE");
  const [privilegeSetTitle,  setPrivilegeSetTitle]  = useState("");
  const [specType,           setSpecType]           = useState("DISCRETE");
  const [restrictedReq,      setRestrictedReq]      = useState(false);
  const [nonCoreReq,         setNonCoreReq]         = useState(false);
  const [proofDocReq,        setProofDocReq]        = useState(false);
  const [generalInstruction, setGeneralInstruction] = useState("");
  const [descriptiveContent, setDescriptiveContent] = useState("");
  const [evidenceReq,        setEvidenceReq]        = useState(false);
  const [competencyReq,      setCompetencyReq]      = useState(false);

  const [coreRows, setCoreRows] = useState([
    { privilegeId: "", title: "", description: "", category: "" },
  ]);
  const [restRows, setRestRows] = useState([
    { privilegeId: "", title: "", description: "", responseType: "YES_OR_NO" },
  ]);
  const [ncRows, setNcRows] = useState([
    { privilegeId: "", title: "", description: "", type: "YES_OR_NO" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewOpen,  setPreviewOpen]  = useState(false);

  // ── Boot ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchApplicantTypes();
    fetchDepartments();
    fetchPrivilegeMaster();
  }, []);

  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedApplicant) populateFields(selectedApplicant);
    else resetFields();
  }, [open, isEdit, selectedApplicant]);

  // FIX: trigger service area fetch ONLY when department changes, not on every render
  useEffect(() => {
    if (departmentId) {
      setServiceAreas([]);
      setServiceAreaOptions([]);
      fetchServiceAreasForDept(departmentId);
    } else {
      setServiceAreaOptions([]);
    }
  }, [departmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── API fetches ───────────────────────────────────────────────────────────────

  const fetchApplicantTypes = async () => {
    try {
      const res  = await GET("entity-service/applicantType");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      setApplicantTypes((Array.isArray(raw) ? raw : []).map(item => ({
        id:   item.id,
        name: typeof item.applicantType === "string" ? item.applicantType
            : Array.isArray(item.applicantType) ? (item.applicantType[0] || "")
            : item?.name || "",
      })));
    } catch (e) { console.warn("[Dialog] applicantTypes:", e?.message); }
  };

  const fetchDepartments = async () => {
    try {
      const res  = await GET("entity-service/department");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const items = Array.isArray(raw) ? raw : [];

      // Log the first item so we can see ALL available keys
      if (items.length > 0) {
        console.log("[Dept] First dept raw keys:", Object.keys(items[0]),
          "serviceLocations count:", items[0]?.serviceLocations?.length ?? "n/a");
      }

      // Build id → full raw object map so SA lookup has access to everything
      const rawMap = {};
      items.forEach(item => { if (item?.id) rawMap[item.id] = item; });
      setDeptRawMap(rawMap);

      // FIX: Deduplicate by BOTH id and name
      // API returns one row per site×applicantType combo → many duplicates
      const seenIds   = new Set();
      const seenNames = new Set();
      const uniqueDepts = [];
      items.forEach(item => {
        if (!item?.id) return;
        const dn = item?.departmentName;
        const name =
          (typeof dn === "object" && dn !== null ? dn?.name || "" : "") ||
          (typeof dn === "string" ? dn : "") ||
          (typeof item?.name === "string" ? item.name : "") ||
          "";
        const key = String(name).trim().toLowerCase();
        if (seenIds.has(item.id) || seenNames.has(key)) return;
        seenIds.add(item.id);
        if (key) seenNames.add(key);
        if (name) uniqueDepts.push({ id: item.id, name: String(name) });
      });
      setDepartments(uniqueDepts);
    } catch (e) { console.warn("[Dialog] departments:", e?.message); }
  };

  // ── Service area fetch ──────────────────────────────────────────────────────
  // Normalizes any SA object to { id, name } regardless of field name
  const normSA = (sa) => {
    const name =
      (typeof sa?.name              === "string" ? sa.name              : "") ||
      (typeof sa?.serviceName       === "string" ? sa.serviceName       : "") ||
      (typeof sa?.serviceAreaName   === "string" ? sa.serviceAreaName   : "") ||
      (typeof sa?.serviceArea?.name === "string" ? sa.serviceArea.name  : "") ||
      (typeof sa?.area?.name        === "string" ? sa.area.name         : "") ||
      (typeof sa?.title             === "string" ? sa.title             : "") ||
      "";
    return { id: String(sa?.id || sa?._id || ""), name: String(name) };
  };

  // Scans every field on a raw dept object to find service area arrays
  const extractSAsFromDeptObj = (obj) => {
    if (!obj || typeof obj !== "object") return [];
    console.log("[SA] Scanning dept obj keys:", Object.keys(obj));

    // Check known field names first
    const knownKeys = [
      "serviceAreas", "serviceArea", "serviceLocations", "services", "areas",
      "departmentAreas", "deptServiceAreas", "serviceAreaList",
      "serviceAreaDetails", "subDepartments", "divisions", "locations",
    ];
    for (const key of knownKeys) {
      const val = obj[key];
      if (Array.isArray(val) && val.length > 0) {
        const sas = val.map(normSA).filter(s => s.id && s.name);
        if (sas.length > 0) {
          console.log("[SA] Found under key '" + key + "':", sas.length, "items, sample:", sas[0]);
          return sas;
        }
      }
    }

    // Scan ALL array-valued keys as a last resort
    for (const key of Object.keys(obj)) {
      if (knownKeys.includes(key)) continue;
      const val = obj[key];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
        const sas = val.map(normSA).filter(s => s.id && s.name);
        if (sas.length > 0) {
          console.log("[SA] Found under dynamic key '" + key + "':", sas.length, "items, sample:", sas[0]);
          return sas;
        }
      }
    }

    console.log("[SA] No SA arrays found in dept obj. Full obj:", JSON.stringify(obj));
    return [];
  };

  const fetchServiceAreasForDept = async (deptId) => {
    if (!deptId) return;
    setIsFetchingSA(true);

    // ── Primary: raw dept object stored during fetchDepartments ──────────────
    const rawDept = deptRawMap[deptId];
    if (rawDept) {
      const sas = extractSAsFromDeptObj(rawDept);
      if (sas.length > 0) {
        setServiceAreaOptions(sas);
        setIsFetchingSA(false);
        return;
      }
    }

    // ── Fallback 1: Re-fetch /department list and find this dept ─────────────
    try {
      const res   = await GET("entity-service/department");
      const raw   = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const items = Array.isArray(raw) ? raw : [];

      // Rebuild raw map in case deptRawMap was empty (race condition on boot)
      const updatedMap = { ...deptRawMap };
      items.forEach(d => { if (d?.id) updatedMap[d.id] = d; });
      setDeptRawMap(updatedMap);

      const found = items.find(d => d?.id === deptId);
      if (found) {
        console.log("[SA] Found dept in /department list, keys:", Object.keys(found));
        const sas = extractSAsFromDeptObj(found);
        if (sas.length > 0) {
          setServiceAreaOptions(sas);
          setIsFetchingSA(false);
          return;
        }
      }
    } catch (e) { console.warn("[SA] /department list:", e?.message); }

    // ── Fallback 2: GET /department/{id} ─────────────────────────────────────
    try {
      const res = await GET(`entity-service/department/${deptId}`);
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const obj = Array.isArray(raw) ? raw[0] : raw;
      if (obj && typeof obj === "object") {
        console.log("[SA] /department/{id} keys:", Object.keys(obj));
        const sas = extractSAsFromDeptObj(obj);
        if (sas.length > 0) {
          setServiceAreaOptions(sas);
          setIsFetchingSA(false);
          return;
        }
      }
    } catch (e) { console.warn("[SA] /department/{id}:", e?.message); }

    // ── Fallback 3: GET /staffPrivilege/departmentAndServiceArea ─────────────
    try {
      const res  = await GET("entity-service/staffPrivilege/departmentAndServiceArea");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];
      console.log("[SA] /departmentAndServiceArea count:", list.length,
        list.length ? "sample keys:" + Object.keys(list[0]) : "");
      const entry = list.find(
        r => r?.department?.id === deptId || r?.departmentId === deptId
      );
      if (entry) {
        const sas = extractSAsFromDeptObj(entry);
        if (sas.length > 0) {
          setServiceAreaOptions(sas);
          setIsFetchingSA(false);
          return;
        }
      }
    } catch (e) { console.warn("[SA] /departmentAndServiceArea:", e?.message); }

    console.warn("[SA] All strategies exhausted for dept:", deptId);
    setIsFetchingSA(false);
  };

  const fetchPrivilegeMaster = async () => {
    try {
      const res  = await GET("entity-service/privilegeMaster");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = (Array.isArray(raw) ? raw : [])
        .filter(p => (p?.status || "ACTIVE").toUpperCase() !== "RETIRED");
      const norm = (t) => (t || "").toUpperCase().replace(/[- ]/g, "_");
      setPrivilegeMasterCore(list.filter(p => norm(p.type) === "CORE"));
      setPrivilegeMasterRest(list.filter(p => norm(p.type) === "RESTRICTED"));
      setPrivilegeMasterNC(list.filter(p => norm(p.type) === "NON_CORE"));
    } catch (e) { console.warn("[Dialog] privilegeMaster:", e?.message); }
  };

  // ── Populate / reset ──────────────────────────────────────────────────────────
  const populateFields = (rec) => {
    setDepartmentId(rec?.department?.id || "");
    const sas = Array.isArray(rec?.serviceArea) ? rec.serviceArea : [];
    setServiceAreas(sas.map(s => ({ id: s.id || "", name: s.name || "" })));
    const apt = Array.isArray(rec?.applicantType)
      ? rec.applicantType[0] : rec?.applicantType;
    setApplicantTypeId(apt?.id || "");
    setBodDate(rec?.bodApprovalDate || "");
    setPrivilegeSetStatus(rec?.privilegeSetStatus === "NOT_IN_USE" ? "NOT_IN_USE" : "IN_USE");
    setPrivilegeSetTitle(rec?.privilegeSetTitle || "");
    setSpecType(rec?.privilegeSpecificationType || "DISCRETE");
    setRestrictedReq(rec?.restrictedPrivilegesRequired || false);
    setNonCoreReq(rec?.nonCorePrivilegesRequired || false);
    setProofDocReq(rec?.proofOfDocumentationRequired || false);
    setGeneralInstruction(rec?.generalInstructionText || "");
    setDescriptiveContent(rec?.descriptiveContent?.content || "");

    const flatRows = (cats) =>
      (cats || []).flatMap(cat =>
        (cat?.privileges || []).map(p => ({
          privilegeId: p?.privilegeId || "",
          title:       p?.title       || "",
          description: p?.description || "",
          category:    cat?.category  || "",
        }))
      );

    const cRows = flatRows(rec?.privilegeDetails?.corePrivileges?.privilegesByCategories);
    if (cRows.length) setCoreRows(cRows);

    const rCats = rec?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories || [];
    const rRows = rCats.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId:  p?.privilegeId  || "",
        title:        p?.title        || "",
        description:  p?.description  || "",
        // FIX: restore responseType enum per DTO
        responseType: p?.responseType || "YES_OR_NO",
      }))
    );
    if (rRows.length) {
      setRestRows(rRows);
      const fp = rCats[0]?.privileges?.[0];
      if (fp) {
        setEvidenceReq(fp?.isevidenceRequired || false);
        setCompetencyReq(fp?.iscompetencyDisclosureRequired || false);
      }
    }

    const nRawCats = rec?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories || [];
    const nRows = nRawCats.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId: p?.privilegeId || "",
        title:       p?.title       || "",
        description: p?.description || "",
        type:        p?.type        || "YES_OR_NO",
      }))
    );
    if (nRows.length) setNcRows(nRows);
  };

  const resetFields = () => {
    setDepartmentId("");
    setServiceAreas([]);
    setServiceAreaOptions([]);
    setApplicantTypeId("");
    setBodDate("");
    setPrivilegeSetStatus("IN_USE");
    setPrivilegeSetTitle("");
    setSpecType("DISCRETE");
    setRestrictedReq(false);
    setNonCoreReq(false);
    setProofDocReq(false);
    setGeneralInstruction("");
    setDescriptiveContent("");
    setEvidenceReq(false);
    setCompetencyReq(false);
    setCoreRows([{ privilegeId: "", title: "", description: "", category: "" }]);
    setRestRows([{ privilegeId: "", title: "", description: "", responseType: "YES_OR_NO" }]);
    setNcRows([{ privilegeId: "", title: "", description: "", type: "YES_OR_NO" }]);
  };

  // ── Payload builders ──────────────────────────────────────────────────────────
  const buildPrivCategories = (rows) => {
    const valid = rows.filter(r => r.privilegeId?.trim());
    if (!valid.length) return [];
    const groups = {};
    valid.forEach(r => {
      const cat = r.category || "";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ privilegeId: r.privilegeId, title: r.title || "", description: r.description || "" });
    });
    return Object.entries(groups).map(([cat, privs]) => ({
      hasCategory: !!cat, category: cat, privileges: privs, subCategories: [],
    }));
  };

  const buildRestCategories = (rows) => {
    const valid = rows.filter(r => r.privilegeId?.trim());
    if (!valid.length) return [];
    return [{
      hasCategory: false, category: "", subCategories: [],
      privileges: valid.map(r => ({
        // FIX: responseType enum — YES_OR_NO | PRIVILEGEREQUIRED_OR_PRIVILEGEREQUESTED
        responseType:                   r.responseType || "YES_OR_NO",
        privilegeId:                    r.privilegeId,
        title:                          r.title       || "",
        description:                    r.description || "",
        isevidenceRequired:             evidenceReq,
        iscompetencyDisclosureRequired: competencyReq,
      })),
    }];
  };

  // buildNcCategories — same as core but includes 'type' enum per NonCorePrivileges DTO
  const buildNcCategories = (rows) => {
    const valid = rows.filter(r => r.privilegeId?.trim());
    if (!valid.length) return [];
    return [{
      hasCategory: false, category: "", subCategories: [],
      privileges: valid.map(r => ({
        privilegeId: r.privilegeId,
        title:       r.title       || "",
        description: r.description || "",
        // type: YES_OR_NO | PRIVILEGEREQUIRED_OR_PRIVILEGEREQUESTED
        type:        r.type        || "YES_OR_NO",
        isevidenceRequired:             false,
        iscompetencyDisclosureRequired: false,
      })),
    }];
  };

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = async (isSaveAndExit) => {
    if (!privilegeSetTitle.trim()) { ErrorToaster("Privilege Set Title is required."); return; }
    if (!departmentId)             { ErrorToaster("Department is required.");           return; }

    setIsSubmitting(true);
    const apt = applicantTypes.find(a => a.id === applicantTypeId);

    const payload = {
      department:                   { id: departmentId },
      serviceArea:                  serviceAreas,
      sites:                        currentSiteId ? [{ id: currentSiteId }] : [],
      applicantType:                apt ? [{ id: apt.id, applicantType: apt.name }] : [],
      bodApprovalDate:              bodDate,
      privilegeSetStatus,           // already "IN_USE" or "NOT_IN_USE"
      privilegeSetTitle:            privilegeSetTitle.trim(),
      privilegeSpecificationType:   specType,
      proofOfDocumentationRequired: proofDocReq,
      restrictedPrivilegesRequired: restrictedReq,
      nonCorePrivilegesRequired:    nonCoreReq,
      generalInstructionText:       generalInstruction || "",
      categoriesList: [...new Set(coreRows.map(r => r.category || "").filter(c => c.trim()))],
      privilegeDetails: {
        corePrivileges: {
          generalInstructionText: generalInstruction || "",
          privilegesByCategories: buildPrivCategories(coreRows),
        },
        restrictedPrivileges: {
          generalInstructionText: "",
          privilegesByCategories: restrictedReq ? buildRestCategories(restRows) : [],
        },
        nonCorePrivileges: {
          generalInstructionText: "",
          // NonCorePrivileges has a 'type' enum field per DTO (images 4-5)
          privilegesByCategories: nonCoreReq ? buildNcCategories(ncRows) : [],
        },
      },
      ...(specType === "DESCRIPTIVEDOCUMENT"
        ? { descriptiveContent: { content: descriptiveContent } } : {}),
    };

    try {
      if (!isEdit) {
        await POST("entity-service/staffPrivilege", JSON.stringify(payload));
        SuccessToaster("Staff Privilege Set Added Successfully");
        resetFields();
        if (isSaveAndExit) {
          // FIX: close AND refetch
          handleClose(true);
        } else {
          // FIX: Save & Add More — stay open, but tell parent to refetch immediately
          // "refetch-only" string is handled in StaffPrivileges.handleCloseDialog
          handleClose("refetch-only");
        }
      } else {
        await PUT(
          `entity-service/staffPrivilege/${selectedApplicant?.id}`,
          JSON.stringify(payload)
        );
        SuccessToaster("Staff Privilege Set Updated Successfully");
        resetFields();
        handleClose(true);
      }
    } catch (e) {
      console.error("[Dialog] save error:", e);
      ErrorToaster(e?.response?.data?.message || e?.message || "Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => { resetFields(); handleClose(false); };

  // ── Privilege row ─────────────────────────────────────────────────────────────
  const PrivRow = ({ row, idx, master, rows, setRows, listId, showCategory = false }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: showCategory ? "160px 1fr 1fr auto" : "160px 1fr auto",
      gap: 10, marginTop: 10, alignItems: "flex-end",
    }}>
      <div>
        <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>PRIVILEGE ID *</div>
        <input
          list={`${listId}-id`} value={row.privilegeId} placeholder="Type ID..."
          onChange={e => {
            const val = e.target.value;
            const found = master.find(p => p.privilegeId === val);
            const next = [...rows];
            next[idx] = { ...next[idx], privilegeId: val,
              title:       found ? (found.title       || "") : next[idx].title,
              description: found ? (found.description || "") : next[idx].description,
            };
            setRows(next);
          }}
          style={{ width:"100%", boxSizing:"border-box", border:"1px solid #dee2e6",
            borderRadius:4, padding:"8px 10px", fontSize:14 }}
        />
        <datalist id={`${listId}-id`}>
          {master.map(p => <option key={p.id} value={p.privilegeId}>{p.privilegeId} — {p.title}</option>)}
        </datalist>
      </div>

      <div>
        <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>PRIVILEGE TITLE *</div>
        <input
          list={`${listId}-title`} value={row.title} placeholder="Type or select title..."
          onChange={e => {
            const val = e.target.value;
            const found = master.find(p => p.title === val);
            const next = [...rows];
            next[idx] = { ...next[idx], title: val,
              privilegeId: found ? (found.privilegeId || next[idx].privilegeId) : next[idx].privilegeId,
              description: found ? (found.description || next[idx].description)  : next[idx].description,
            };
            setRows(next);
          }}
          style={{ width:"100%", boxSizing:"border-box", border:"1px solid #dee2e6",
            borderRadius:4, padding:"8px 10px", fontSize:14 }}
        />
        <datalist id={`${listId}-title`}>
          {master.map(p => <option key={p.id} value={p.title}>{p.privilegeId} — {p.title}</option>)}
        </datalist>
      </div>

      {showCategory && (
        <div>
          <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>CATEGORY</div>
          <input value={row.category} placeholder="e.g. General Surgery"
            onChange={e => {
              const next = [...rows];
              next[idx] = { ...next[idx], category: e.target.value };
              setRows(next);
            }}
            style={{ width:"100%", boxSizing:"border-box", border:"1px solid #dee2e6",
              borderRadius:4, padding:"8px 10px", fontSize:14 }}
          />
        </div>
      )}

      {rows.length > 1 && (
        <button onClick={() => setRows(prev => prev.filter((_, i) => i !== idx))}
          style={{ background:"none", border:"1px solid #e53935", color:"#e53935",
            borderRadius:4, padding:"6px 10px", cursor:"pointer", fontSize:12, alignSelf:"center" }}>
          ✕
        </button>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Dialog isOpen={open} onClose={handleCancel}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit
              ? "Edit Department / Service Area Specific Privileges Set"
              : "Create Department / Service Area Specific Privileges Sets"}
          </p>
          <div className={style.displayInRow}>
            <img src={WritingFile} className={style.dialogCrossStyle} alt="doc"
              style={{ marginRight: 40 }} />
            <Icon icon="cross" size={30} intent={Intent.DANGER}
              className={style.dialogCrossStyle} onClick={handleCancel} />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* Department + Service Area */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}
            className={style.marginTop20}>
            <div>
              <div className={style.entityLableStyle}>DEPARTMENT / SERVICE AREA *</div>
              <FormControl fullWidth size="small">
                <Select value={departmentId} onChange={e => setDepartmentId(e.target.value)}
                  displayEmpty
                  renderValue={v => !v
                    ? <span style={{ color:"#9e9e9e" }}>Select Department</span>
                    : departments.find(d => d.id === v)?.name || v}
                  SelectDisplayProps={{ style:{ paddingTop:5, paddingBottom:5, fontSize:14 } }}>
                  {departments.length === 0
                    ? <MenuItem disabled value="">Loading departments...</MenuItem>
                    : departments.map((d, i) => (
                        <MenuItem key={d.id || i} value={d.id}>{d.name}</MenuItem>
                      ))}
                </Select>
              </FormControl>
            </div>

            <div>
              <div className={style.entityLableStyle}>SERVICE AREA</div>
              <FormControl fullWidth size="small">
                <Select multiple
                  value={serviceAreas.map(s => s.id)}
                  onChange={e => {
                    const ids = typeof e.target.value === "string"
                      ? e.target.value.split(",") : e.target.value;
                    setServiceAreas(ids.map(id => {
                      const f = serviceAreaOptions.find(s => s.id === id);
                      return { id, name: f?.name || "" };
                    }));
                  }}
                  displayEmpty
                  renderValue={sel =>
                    !sel?.length
                      ? <span style={{ color:"#9e9e9e" }}>
                          {isFetchingSA ? "Loading..." :
                           !departmentId ? "Select a department first" :
                           serviceAreaOptions.length === 0 ? "No service areas found" :
                           "Select service area"}
                        </span>
                      : serviceAreaOptions.filter(s => sel.includes(s.id))
                          .map(s => s.name).join(", ")
                  }
                  disabled={!departmentId || isFetchingSA}
                  SelectDisplayProps={{ style:{ paddingTop:5, paddingBottom:5, fontSize:14 } }}>
                  {isFetchingSA ? (
                    <MenuItem disabled>Loading service areas...</MenuItem>
                  ) : serviceAreaOptions.length === 0 ? (
                    <MenuItem disabled value="">
                      {!departmentId
                        ? "Select a department first"
                        : "No service areas configured for this department"}
                    </MenuItem>
                  ) : serviceAreaOptions.map((s, i) => (
                    <MenuItem key={s.id || i} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Applicant Type — FULL WIDTH per design (demo image) */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
            <FormControl fullWidth size="small">
              <Select value={applicantTypeId} onChange={e => setApplicantTypeId(e.target.value)}
                displayEmpty
                renderValue={v => !v
                  ? <span style={{ color:"#9e9e9e" }}>Select Applicant</span>
                  : applicantTypes.find(a => a.id === v)?.name || v}
                SelectDisplayProps={{ style:{ paddingTop:5, paddingBottom:5, fontSize:14 } }}>
                {applicantTypes.map((a, i) => (
                  <MenuItem key={a.id || i} value={a.id}>{a.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Privilege Set Status (left) + BOD Approval Date (right) — same row per design */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}
            className={style.marginTop20}>
            <div>
              <div className={style.entityLableStyle}>PRIVILEGE SET STATUS *</div>
              <div style={{ display:"flex", gap:24, marginTop:8 }}>
                {[{ label:"In Use", value:"IN_USE" }, { label:"Not In Use", value:"NOT_IN_USE" }]
                  .map(s => (
                    <label key={s.value} style={{ display:"flex", alignItems:"center",
                      gap:6, cursor:"pointer", fontSize:14 }}>
                      <Radio checked={privilegeSetStatus === s.value}
                        onChange={() => setPrivilegeSetStatus(s.value)}
                        value={s.value} style={{ color:"#06617A" }} />
                      {s.label}
                    </label>
                  ))}
              </div>
            </div>
            <div>
              <div className={style.entityLableStyle}>BOD APPROVAL DATE *</div>
              <input type="date" value={bodDate} onChange={e => setBodDate(e.target.value)}
                style={{ width:"100%", boxSizing:"border-box", border:"1px solid #dee2e6",
                  borderRadius:4, padding:"8px 10px", fontSize:14 }} />
            </div>
          </div>

          {/* Department Specific Privilege Set Title */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              DEPARTMENT SPECIFIC PRIVILEGE SET TITLE *
            </div>
            <input value={privilegeSetTitle} onChange={e => setPrivilegeSetTitle(e.target.value)}
              placeholder="Add Privilege set Title"
              style={{ width:"100%", boxSizing:"border-box", border:"1px solid #dee2e6",
                borderRadius:4, padding:"8px 10px", fontSize:14 }} />
          </div>

          {/* Privilege Specification Type */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>PRIVILEGE SPECIFICATION TYPE *</div>
            <div style={{ display:"flex", gap:24, marginTop:8 }}>
              {[{ value:"DESCRIPTIVEDOCUMENT", label:"Descriptive Document" },
                { value:"DISCRETE",            label:"Discreet Item List"   }]
                .map(item => (
                  <label key={item.value} style={{ display:"flex", alignItems:"center",
                    gap:6, cursor:"pointer", fontSize:14 }}>
                    <Radio checked={specType === item.value}
                      onChange={() => setSpecType(item.value)}
                      value={item.value} style={{ color:"#06617A" }} />
                    {item.label}
                  </label>
                ))}
            </div>
          </div>

          {/* General Instruction Text — ABOVE restricted/non-core toggles per XD demo */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>GENERAL INSTRUCTION TEXT</div>
            <Editor value={generalInstruction} onChange={setGeneralInstruction}
              placeholder="Enter General Instruction Here" />
          </div>

          {/* Restricted + Non-Core toggles — BELOW general instruction per XD demo */}
          <div style={{ display:"flex", gap:40, marginTop:20, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span className={style.entityLableStyle}>RESTRICTED PRIVILEGES REQUIRED?</span>
              <FormControlLabel
                control={<Switch checked={restrictedReq}
                  onChange={e => setRestrictedReq(e.target.checked)}
                  className={classes.switch} />}
                label={restrictedReq ? "Yes" : "No"} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span className={style.entityLableStyle}>NON-CORE PRIVILEGES REQUIRED?</span>
              <FormControlLabel
                control={<Switch checked={nonCoreReq}
                  onChange={e => setNonCoreReq(e.target.checked)}
                  className={classes.switch} />}
                label={nonCoreReq ? "Yes" : "No"} />
            </div>
          </div>

          <div className={`${style.Borderthick} ${style.marginTop20}`} />

          {/* Descriptive Content — DESCRIPTIVEDOCUMENT only */}
          {specType === "DESCRIPTIVEDOCUMENT" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>DESCRIPTIVE CONTENT</div>
              <Editor value={descriptiveContent} onChange={setDescriptiveContent}
                placeholder="Enter descriptive content here" />
            </div>
          )}

          {/* Core Privileges — DISCRETE only */}
          {specType === "DISCRETE" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle} style={{ marginBottom:12 }}>
                APPLICABLE CORE PRIVILEGES
              </div>
              {coreRows.map((row, idx) => (
                <div key={idx} style={{ marginBottom:12 }}>
                  {/* Category — toggle switch like XD demo:
                      "Category? None [toggle]" → when toggled on show text input */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:4 }}>
                      <span className={style.entityLableStyle}>CATEGORY?</span>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!row.category}
                            onChange={e => {
                              const next = [...coreRows];
                              next[idx] = {
                                ...next[idx],
                                category: e.target.checked ? " " : "",
                              };
                              setCoreRows(next);
                            }}
                            className={classes.switch}
                          />
                        }
                        label={
                          <span style={{ fontSize:13, color:"#555" }}>
                            {row.category ? "Yes" : "None"}
                          </span>
                        }
                        style={{ margin:0 }}
                      />
                    </div>
                    {/* Text input appears only when toggle is ON */}
                    {!!row.category && (
                      <input
                        value={row.category.trim()}
                        placeholder="e.g. General Surgery"
                        onChange={e => {
                          const next = [...coreRows];
                          next[idx] = { ...next[idx], category: e.target.value };
                          setCoreRows(next);
                        }}
                        style={{
                          width:"100%", boxSizing:"border-box",
                          border:"1px solid #dee2e6", borderRadius:4,
                          padding:"8px 10px", fontSize:14, marginTop:4,
                        }}
                      />
                    )}
                  </div>
                  {/* Privilege ID + Title on same row */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:10, alignItems:"flex-end" }}>
                    <div>
                      <div className={style.entityLableStyle} style={{ marginBottom:4 }}>PRIVILEGE ID *</div>
                      <input
                        list={`core-id-${idx}`}
                        value={row.privilegeId}
                        placeholder="Type ID..."
                        onChange={e => {
                          const val   = e.target.value;
                          const found = privilegeMasterCore.find(p => p.privilegeId === val);
                          const next  = [...coreRows];
                          next[idx]   = { ...next[idx], privilegeId: val,
                            title:       found ? (found.title       || "") : next[idx].title,
                            description: found ? (found.description || "") : next[idx].description,
                          };
                          setCoreRows(next);
                        }}
                        style={{ width:"100%", boxSizing:"border-box",
                          border:"1px solid #dee2e6", borderRadius:4,
                          padding:"8px 10px", fontSize:14 }}
                      />
                      <datalist id={`core-id-${idx}`}>
                        {privilegeMasterCore.map(p =>
                          <option key={p.id} value={p.privilegeId}>{p.privilegeId} — {p.title}</option>
                        )}
                      </datalist>
                    </div>
                    <div>
                      <div className={style.entityLableStyle} style={{ marginBottom:4 }}>PRIVILEGE TITLE *</div>
                      <input
                        list={`core-title-${idx}`}
                        value={row.title}
                        placeholder="Type or select title..."
                        onChange={e => {
                          const val   = e.target.value;
                          const found = privilegeMasterCore.find(p => p.title === val);
                          const next  = [...coreRows];
                          next[idx]   = { ...next[idx], title: val,
                            privilegeId: found ? (found.privilegeId || next[idx].privilegeId) : next[idx].privilegeId,
                            description: found ? (found.description || next[idx].description)  : next[idx].description,
                          };
                          setCoreRows(next);
                        }}
                        style={{ width:"100%", boxSizing:"border-box",
                          border:"1px solid #dee2e6", borderRadius:4,
                          padding:"8px 10px", fontSize:14 }}
                      />
                      <datalist id={`core-title-${idx}`}>
                        {privilegeMasterCore.map(p =>
                          <option key={p.id} value={p.title}>{p.privilegeId} — {p.title}</option>
                        )}
                      </datalist>
                    </div>
                    {coreRows.length > 1 && (
                      <button
                        onClick={() => setCoreRows(prev => prev.filter((_, i) => i !== idx))}
                        style={{ background:"none", border:"1px solid #e53935", color:"#e53935",
                          borderRadius:4, padding:"6px 10px", cursor:"pointer",
                          fontSize:12, alignSelf:"center" }}>
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={() => setCoreRows(prev => [
                  ...prev, { privilegeId:"", title:"", description:"", category:"" }])}
                className={`${style.outlinedButton} ${style.borderRadius10}`}
                style={{ marginTop:4 }}>
                + ADD MORE
              </button>
            </div>
          )}

          {/* Restricted Privileges */}
          {restrictedReq && specType === "DISCRETE" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>RESTRICTED PRIVILEGES</div>
              {restRows.map((row, idx) => (
                <PrivRow key={idx} row={row} idx={idx}
                  master={privilegeMasterRest} rows={restRows} setRows={setRestRows}
                  listId={`rest-${idx}`} />
              ))}
              <button onClick={() => setRestRows(prev => [
                  ...prev, { privilegeId:"", title:"", description:"", responseType:"YES_OR_NO" }])}
                className={`${style.outlinedButton} ${style.borderRadius10}`}
                style={{ marginTop:10 }}>
                + ADD MORE
              </button>
              <div style={{ display:"flex", gap:24, marginTop:16, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span className={style.entityLableStyle}>
                    EVIDENCE OF QUALIFICATION AND COMPETENCY
                  </span>
                  <FormControlLabel
                    control={<Switch checked={evidenceReq}
                      onChange={e => setEvidenceReq(e.target.checked)}
                      className={classes.switch} />}
                    label={evidenceReq ? "Yes" : "No"} />
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span className={style.entityLableStyle}>COMPETENCY DISCLOSURE NOTES</span>
                  <FormControlLabel
                    control={<Switch checked={competencyReq}
                      onChange={e => setCompetencyReq(e.target.checked)}
                      className={classes.switch} />}
                    label={competencyReq ? "Yes" : "No"} />
                </div>
              </div>
            </div>
          )}

          {/* Non-Core Privileges */}
          {nonCoreReq && specType === "DISCRETE" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>NON-CORE PRIVILEGES</div>
              {ncRows.map((row, idx) => (
                <PrivRow key={idx} row={row} idx={idx}
                  master={privilegeMasterNC} rows={ncRows} setRows={setNcRows}
                  listId={`nc-${idx}`} />
              ))}
              <button onClick={() => setNcRows(prev => [
                  ...prev, { privilegeId:"", title:"", description:"", type:"YES_OR_NO" }])}
                className={`${style.outlinedButton} ${style.borderRadius10}`}
                style={{ marginTop:10 }}>
                + ADD MORE
              </button>
            </div>
          )}

        </div>{/* end addHealthCareBoxStyle */}

        {/* Footer — PREVIEW left, Save buttons right per design */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:20 }}>
          <button
            className={`${style.outlinedButton} ${style.borderRadius10}`}
            onClick={() => setPreviewOpen(true)}>
            PREVIEW
          </button>
          <div style={{ display:"flex", gap:10 }}>
            <button className={`${style.outlinedButton} ${style.borderRadius10}`}
              onClick={() => handleSave(true)} disabled={isSubmitting}>
              {isSubmitting ? "SAVING..." : "SAVE & EXIT"}
            </button>
            <button className={`${style.buttonStyle} ${style.borderRadius10}`}
              onClick={() => handleSave(false)} disabled={isSubmitting}>
              {isSubmitting ? "SAVING..." : "SAVE & ADD MORE"}
            </button>
          </div>
        </div>

      </div>

      {/* ── Preview Panel ── */}
      {previewOpen && (
        <Dialog
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
          style={{ maxWidth: 700, width: "90%" }}
        >
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween} style={{ marginBottom:16 }}>
              <p className={style.extensionStyle} style={{ margin:0 }}>
                Preview — Privilege Set
              </p>
              <Icon icon="cross" size={24} intent={Intent.DANGER}
                className={style.dialogCrossStyle}
                onClick={() => setPreviewOpen(false)} />
            </div>
            <div className={style.ReferenceListEntityBorder} style={{ marginBottom:16 }} />

            {/* Summary of entered values */}
            {[
              { label:"Department",           value: departments.find(d=>d.id===departmentId)?.name || "-" },
              { label:"Service Area",         value: serviceAreas.map(s=>s.name).join(", ") || "-" },
              { label:"Applicant Type",       value: applicantTypes.find(a=>a.id===applicantTypeId)?.name || "-" },
              { label:"BOD Approval Date",    value: bodDate || "-" },
              { label:"Privilege Set Status", value: privilegeSetStatus === "IN_USE" ? "In Use" : "Not In Use" },
              { label:"Set Title",            value: privilegeSetTitle || "-" },
              { label:"Spec Type",            value: specType === "DISCRETE" ? "Discreet Item List" : "Descriptive Document" },
              { label:"Restricted Required",  value: restrictedReq ? "Yes" : "No" },
              { label:"Non-Core Required",    value: nonCoreReq ? "Yes" : "No" },
            ].map(({label, value}) => (
              <div key={label} style={{ display:"flex", gap:16, marginBottom:8, fontSize:14 }}>
                <span style={{ minWidth:180, fontWeight:600, color:"#555" }}>{label}:</span>
                <span style={{ color:"#222" }}>{value}</span>
              </div>
            ))}

            {/* Core Privileges preview */}
            {specType === "DISCRETE" && coreRows.some(r => r.privilegeId) && (
              <div style={{ marginTop:16 }}>
                <div className={style.entityLableStyle} style={{ marginBottom:8 }}>
                  APPLICABLE CORE PRIVILEGES
                </div>
                {coreRows.filter(r=>r.privilegeId).map((r,i) => (
                  <div key={i} style={{
                    background:"#f8f9fa", borderRadius:4, padding:"8px 12px",
                    marginBottom:6, fontSize:13,
                  }}>
                    {r.category && <span style={{ color:"#06617A", fontWeight:600, marginRight:8 }}>
                      [{r.category}]
                    </span>}
                    <strong>{r.privilegeId}</strong> — {r.title || "(no title)"}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:24 }}>
              <button
                className={style.outlinedButton}
                onClick={() => setPreviewOpen(false)}>
                CLOSE
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </Dialog>
  );
};

export default StaffPrivilegeDialog;