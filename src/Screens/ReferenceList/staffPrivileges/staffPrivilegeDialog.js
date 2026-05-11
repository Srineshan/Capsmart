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

// ─── Teal switch/radio ────────────────────────────────────────────────────────
const useStyles = makeStyles({
  switch: {
    "& .Mui-checked":     { color: "#06617A" },
    "& .MuiSwitch-track": { backgroundColor: "#06617A !important" },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// StaffPrivilegeDialog
//
// Connection to PrivilegeListManager:
//   - PrivilegeListManager manages GET/POST/PUT /privilegeMaster
//   - That master list has shape: { id, privilegeId, title, description, type, status, applicantType[] }
//   - type enum from PrivilegeListManager: "CORE" | "RESTRICTED" | "NON_CORE"
//   - This dialog reads /privilegeMaster and splits by type to populate type-ahead
//     so when user types a privilege ID/title in a Core row, only CORE privileges
//     from PrivilegeListManager appear as suggestions (and vice versa for RESTRICTED/NON_CORE)
//
// StaffPrivileges DTO (Swagger images 5–7):
//   department                   → { id }
//   serviceArea                  → [{ id, name }]
//   sites                        → [{ id }]
//   applicantType                → [{ id, applicantType }]
//   privilegeSpecificationType   → "DISCRETE" | "DESCRIPTIVEDOCUMENT"
//   proofOfDocumentationRequired → boolean
//   privilegeSetStatus           → "IN_USE" | "NOT_IN_USE"
//   bodApprovalDate              → string($date)
//   restrictedPrivilegesRequired → boolean
//   nonCorePrivilegesRequired    → boolean
//   generalInstructionText       → string   (top-level per DTO)
//   categoriesList               → [string]
//   privilegeDetails → {
//     corePrivileges: {
//       generalInstructionText: string
//       privilegesByCategories: [{ hasCategory, category, privileges: [{ privilegeId, title, description }], subCategories }]
//     }
//     restrictedPrivileges: {
//       generalInstructionText: string
//       privilegesByCategories: [{ hasCategory, category, privileges: [{ privilegeId, title, description, isevidenceRequired, iscompetencyDisclosureRequired }] }]
//     }
//     nonCorePrivileges: {
//       generalInstructionText: string
//       privilegesByCategories: [{ hasCategory, category, privileges: [{ privilegeId, title, description }] }]
//     }
//   }
//   descriptiveContent → { content: string }
// ─────────────────────────────────────────────────────────────────────────────

const StaffPrivilegeDialog = ({
  open,
  handleClose,
  isEdit,
  selectedApplicant,
  currentSiteId,
  departmentMap,
}) => {
  const classes = useStyles();

  // ── Reference data ──────────────────────────────────────────────────────────
  const [departments,         setDepartments]         = useState([]);
  const [deptServiceAreaMap,  setDeptServiceAreaMap]  = useState({});
  const [serviceAreaOptions,  setServiceAreaOptions]  = useState([]);
  const [applicantTypes,      setApplicantTypes]      = useState([]);

  // Connection to PrivilegeListManager — split by type enum (CORE/RESTRICTED/NON_CORE)
  const [privilegeMasterCore, setPrivilegeMasterCore] = useState([]);
  const [privilegeMasterRest, setPrivilegeMasterRest] = useState([]);
  const [privilegeMasterNC,   setPrivilegeMasterNC]   = useState([]);

  // ── Form fields — exact DTO field names ─────────────────────────────────────
  const [departmentId,        setDepartmentId]        = useState("");
  const [serviceAreas,        setServiceAreas]        = useState([]);      // [{ id, name }]
  const [applicantTypeId,     setApplicantTypeId]     = useState("");
  const [bodDate,             setBodDate]             = useState("");
  // FIX: internal state uses DTO enum values directly ("IN_USE" / "NOT_IN_USE")
  const [privilegeSetStatus,  setPrivilegeSetStatus]  = useState("IN_USE");
  const [privilegeSetTitle,   setPrivilegeSetTitle]   = useState("");
  // privilegeSpecificationType: "DISCRETE" | "DESCRIPTIVEDOCUMENT"
  const [specType,            setSpecType]            = useState("DISCRETE");
  const [restrictedReq,       setRestrictedReq]       = useState(false);
  const [nonCoreReq,          setNonCoreReq]          = useState(false);
  const [proofDocReq,         setProofDocReq]         = useState(false);
  // generalInstructionText — top-level DTO field
  const [generalInstruction,  setGeneralInstruction]  = useState("");
  // descriptiveContent.content — used when specType === "DESCRIPTIVEDOCUMENT"
  const [descriptiveContent,  setDescriptiveContent]  = useState("");

  // Evidence / competency toggles for restricted privileges
  // These map to isevidenceRequired / iscompetencyDisclosureRequired per privilege row
  const [evidenceReq,         setEvidenceReq]         = useState(false);
  const [competencyReq,       setCompetencyReq]       = useState(false);

  // ── Privilege rows — each maps to a CorePrivileges / RestrictedPrivileges / NonCorePrivileges entry
  // Shape mirrors DTO:
  //   privilegeId, title, description (core & non-core)
  //   privilegeId, title, description, isevidenceRequired, iscompetencyDisclosureRequired (restricted)
  //   category (core only — maps to hasCategory/category in privilegesByCategories)
  const [coreRows, setCoreRows] = useState([
    { privilegeId: "", title: "", description: "", category: "" },
  ]);
  const [restRows, setRestRows] = useState([
    { privilegeId: "", title: "", description: "" },
  ]);
  const [ncRows, setNcRows] = useState([
    { privilegeId: "", title: "", description: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Boot ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchApplicantTypes();
    fetchDepartments();
    fetchPrivilegeMaster();
  }, []);

  // ── Populate on open ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedApplicant) {
      populateFields(selectedApplicant);
    } else {
      resetFields();
    }
  }, [open, isEdit, selectedApplicant]);

  // ── Cascade service areas when department changes ─────────────────────────────
  useEffect(() => {
    if (departmentId) fetchServiceAreasForDept(departmentId);
    else setServiceAreaOptions([]);
  }, [departmentId, deptServiceAreaMap]);

  // ── API fetches ───────────────────────────────────────────────────────────────

  const fetchApplicantTypes = async () => {
    try {
      const res  = await GET("entity-service/applicantType");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = (Array.isArray(raw) ? raw : []).map(item => ({
        id:   item.id,
        // applicantType field from DTO: string or array
        name: typeof item.applicantType === "string"
          ? item.applicantType
          : Array.isArray(item.applicantType)
          ? item.applicantType[0] || ""
          : item?.name || "",
      }));
      setApplicantTypes(list);
    } catch (e) { console.warn("[Dialog] applicantTypes:", e?.message); }
  };

  const fetchDepartments = async () => {
    try {
      const res   = await GET("entity-service/department");
      const raw   = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const items = Array.isArray(raw) ? raw : [];

      const list = items.map(item => ({
        id:   item.id,
        name: item?.departmentName?.name || item?.name || "",
      }));
      setDepartments(list);

      // Build deptId → serviceAreas map from department response (if nested)
      const saMap = {};
      items.forEach(item => {
        if (item?.id) {
          const sas = (item?.serviceAreas || item?.serviceArea || [])
            .map(sa => normalizeSA(sa))
            .filter(sa => sa.id && sa.name);
          if (sas.length > 0) saMap[item.id] = sas;
        }
      });

      // Also pre-load from /staffPrivilege/departmentAndServiceArea (primary source)
      // This is the reliable endpoint for dept→serviceArea mapping
      try {
        const dsar = await GET("entity-service/staffPrivilege/departmentAndServiceArea");
        const dsarRaw = dsar?.data?.content || dsar?.data?.data || dsar?.data ||
          dsar?.content || (Array.isArray(dsar) ? dsar : []);
        (Array.isArray(dsarRaw) ? dsarRaw : []).forEach(entry => {
          const dId = entry?.department?.id || entry?.departmentId || entry?.id;
          if (!dId) return;
          const sas = (entry?.serviceAreas || entry?.serviceArea || [])
            .map(sa => normalizeSA(sa))
            .filter(sa => sa.id && sa.name);
          if (sas.length > 0) saMap[dId] = sas;
        });
      } catch (e) { console.warn("[Dialog] deptAndSA pre-load:", e?.message); }

      setDeptServiceAreaMap(saMap);
    } catch (e) { console.warn("[Dialog] departments:", e?.message); }
  };

  // Normalize a raw service area object to { id, name }
  const normalizeSA = (sa) => ({
    id:   sa?.id   || sa?._id  || "",
    name: sa?.name || sa?.serviceName || sa?.serviceAreaName ||
          sa?.serviceArea?.name || sa?.area?.name || "",
  });

  const fetchServiceAreasForDept = async (deptId) => {
    if (!deptId) { setServiceAreaOptions([]); return; }

    // Step 1: Use pre-built map (populated on boot from both /department and /departmentAndServiceArea)
    const cached = deptServiceAreaMap[deptId];
    if (cached && cached.length > 0) {
      setServiceAreaOptions(cached);
      return;
    }

    // Step 2: Fetch /staffPrivilege/departmentAndServiceArea directly —
    // this is the canonical endpoint (Swagger image 4: GET /staffPrivilege/departmentAndServiceArea)
    try {
      const res = await GET("entity-service/staffPrivilege/departmentAndServiceArea");
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = Array.isArray(raw) ? raw : [];

      // The response may be: array of { department: { id }, serviceAreas: [] }
      // Or it may be a flat object keyed by deptId — handle both
      let sas = [];
      const entry = list.find(
        r => r?.department?.id === deptId || r?.departmentId === deptId || r?.id === deptId
      );
      if (entry) {
        sas = (entry?.serviceAreas || entry?.serviceArea || [])
          .map(sa => normalizeSA(sa))
          .filter(sa => sa.id && sa.name);
      } else if (list.length > 0 && list[0]?.id && !list[0]?.department) {
        // Response is a flat list of service area objects filtered to this dept
        sas = list.map(sa => normalizeSA(sa)).filter(sa => sa.id && sa.name);
      }

      if (sas.length > 0) {
        setServiceAreaOptions(sas);
        setDeptServiceAreaMap(prev => ({ ...prev, [deptId]: sas }));
        return;
      }
    } catch (e) { console.warn("[Dialog] deptAndServiceArea:", e?.message); }

    // Step 3: Try GET /serviceArea?departmentId={deptId} — some backends expose this
    try {
      const res = await GET(`entity-service/serviceArea?departmentId=${deptId}`);
      const raw = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const sas = (Array.isArray(raw) ? raw : [])
        .map(sa => normalizeSA(sa))
        .filter(sa => sa.id && sa.name);
      if (sas.length > 0) {
        setServiceAreaOptions(sas);
        setDeptServiceAreaMap(prev => ({ ...prev, [deptId]: sas }));
        return;
      }
    } catch (e) { console.warn("[Dialog] /serviceArea?deptId:", e?.message); }

    // Step 4: Reload /department and look for embedded serviceAreas
    try {
      const res   = await GET("entity-service/department");
      const raw   = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const found = (Array.isArray(raw) ? raw : []).find(d => d?.id === deptId);
      const sas = (found?.serviceAreas || found?.serviceArea || [])
        .map(sa => normalizeSA(sa))
        .filter(sa => sa.id && sa.name);
      if (sas.length > 0) {
        setServiceAreaOptions(sas);
        setDeptServiceAreaMap(prev => ({ ...prev, [deptId]: sas }));
        return;
      }
    } catch (e) { console.warn("[Dialog] dept reload:", e?.message); }

    // Nothing found — show empty (user can still save without a service area)
    setServiceAreaOptions([]);
  };

  // ── Connection to PrivilegeListManager ────────────────────────────────────────
  // Loads GET /privilegeMaster — the same endpoint PrivilegeListManager manages.
  // Splits by "type" field (CORE / RESTRICTED / NON_CORE) to feed type-ahead
  // inputs in each privilege section. This means privileges created in
  // PrivilegeListManager are immediately available for selection here.
  const fetchPrivilegeMaster = async () => {
    try {
      const res  = await GET("entity-service/privilegeMaster");
      const raw  = res?.data?.content || res?.data?.data || res?.data ||
        res?.content || (Array.isArray(res) ? res : []);
      const list = (Array.isArray(raw) ? raw : [])
        // Only show ACTIVE privileges in the type-ahead (per PrivilegeListManager status enum)
        .filter(p => (p?.status || "ACTIVE").toUpperCase() !== "RETIRED");

      // FIX: Match exactly the type enum values that PrivilegeListManager saves:
      //   CORE → core rows
      //   RESTRICTED → restricted rows
      //   NON_CORE → non-core rows
      setPrivilegeMasterCore(
        list.filter(p => (p?.type || "").toUpperCase().replace(/-| /g, "_") === "CORE")
      );
      setPrivilegeMasterRest(
        list.filter(p => (p?.type || "").toUpperCase().replace(/-| /g, "_") === "RESTRICTED")
      );
      setPrivilegeMasterNC(
        list.filter(p => (p?.type || "").toUpperCase().replace(/-| /g, "_") === "NON_CORE")
      );
    } catch (e) { console.warn("[Dialog] privilegeMaster:", e?.message); }
  };

  // ── Populate fields (edit mode) ───────────────────────────────────────────────
  const populateFields = (rec) => {
    setDepartmentId(rec?.department?.id || "");

    // serviceArea: [ServiceArea { id, name }] per DTO
    const sas = Array.isArray(rec?.serviceArea) ? rec.serviceArea : [];
    setServiceAreas(sas.map(s => ({ id: s.id || "", name: s.name || "" })));

    // applicantType: [ApplicantType { id, applicantType }] per DTO
    const apt = Array.isArray(rec?.applicantType)
      ? rec.applicantType[0]
      : rec?.applicantType;
    setApplicantTypeId(apt?.id || "");

    setBodDate(rec?.bodApprovalDate || "");

    // FIX: privilegeSetStatus comes from API as "IN_USE" or "NOT_IN_USE"
    // Store internally as the exact enum string
    setPrivilegeSetStatus(rec?.privilegeSetStatus === "NOT_IN_USE" ? "NOT_IN_USE" : "IN_USE");

    setPrivilegeSetTitle(rec?.privilegeSetTitle || "");

    // privilegeSpecificationType: "DISCRETE" | "DESCRIPTIVEDOCUMENT"
    setSpecType(rec?.privilegeSpecificationType || "DISCRETE");

    setRestrictedReq(rec?.restrictedPrivilegesRequired || false);
    setNonCoreReq(rec?.nonCorePrivilegesRequired || false);
    setProofDocReq(rec?.proofOfDocumentationRequired || false);

    // generalInstructionText — top-level field in DTO
    setGeneralInstruction(rec?.generalInstructionText || "");

    // descriptiveContent.content — for DESCRIPTIVEDOCUMENT type
    setDescriptiveContent(rec?.descriptiveContent?.content || "");

    // ── Core privilege rows ──
    // DTO: corePrivileges.privilegesByCategories[].privileges[{ privilegeId, title, description }]
    const cCats = rec?.privilegeDetails?.corePrivileges?.privilegesByCategories || [];
    const cRows = cCats.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId: p?.privilegeId || "",
        title:       p?.title       || "",
        description: p?.description || "",
        category:    cat?.category  || "",
      }))
    );
    if (cRows.length > 0) setCoreRows(cRows);

    // ── Restricted privilege rows ──
    // DTO: restrictedPrivileges.privilegesByCategories[].privileges[{ privilegeId, title, description, isevidenceRequired, iscompetencyDisclosureRequired }]
    const rCats = rec?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories || [];
    const rRows = rCats.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId: p?.privilegeId || "",
        title:       p?.title       || "",
        description: p?.description || "",
      }))
    );
    if (rRows.length > 0) {
      setRestRows(rRows);
      // Restore evidence/competency flags from the first restricted privilege row
      const firstPriv = rCats[0]?.privileges?.[0];
      if (firstPriv) {
        setEvidenceReq(firstPriv?.isevidenceRequired || false);
        setCompetencyReq(firstPriv?.iscompetencyDisclosureRequired || false);
      }
    }

    // ── Non-core privilege rows ──
    const nCats = rec?.privilegeDetails?.nonCorePrivileges?.privilegesByCategories || [];
    const nRows = nCats.flatMap(cat =>
      (cat?.privileges || []).map(p => ({
        privilegeId: p?.privilegeId || "",
        title:       p?.title       || "",
        description: p?.description || "",
      }))
    );
    if (nRows.length > 0) setNcRows(nRows);
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
    setRestRows([{ privilegeId: "", title: "", description: "" }]);
    setNcRows([{ privilegeId: "", title: "", description: "" }]);
  };

  // ── Privilege payload builders ─────────────────────────────────────────────────
  // Groups core rows by category → privilegesByCategories shape in DTO
  const buildPrivCategories = (rows) => {
    const valid = rows.filter(r => r.privilegeId?.trim());
    if (!valid.length) return [];
    const groups = {};
    valid.forEach(r => {
      const cat = r.category || "";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({
        privilegeId: r.privilegeId,
        title:       r.title       || "",
        description: r.description || "",
      });
    });
    return Object.entries(groups).map(([cat, privs]) => ({
      hasCategory:   !!cat,
      category:      cat,
      privileges:    privs,
      subCategories: [],
    }));
  };

  // Builds restricted privileges — includes isevidenceRequired / iscompetencyDisclosureRequired
  const buildRestCategories = (rows) => {
    const valid = rows.filter(r => r.privilegeId?.trim());
    if (!valid.length) return [];
    return [{
      hasCategory:   false,
      category:      "",
      privileges:    valid.map(r => ({
        privilegeId:                    r.privilegeId,
        title:                          r.title       || "",
        description:                    r.description || "",
        isevidenceRequired:             evidenceReq,
        iscompetencyDisclosureRequired: competencyReq,
      })),
      subCategories: [],
    }];
  };

  // ── Save — builds payload matching StaffPrivileges DTO exactly ───────────────
  const handleSave = async (isSaveAndExit) => {
    if (!privilegeSetTitle.trim()) {
      ErrorToaster("Privilege Set Title is required.");
      return;
    }
    if (!departmentId) {
      ErrorToaster("Department is required.");
      return;
    }

    setIsSubmitting(true);

    const apt = applicantTypes.find(a => a.id === applicantTypeId);

    // FIX: categoriesList — collect unique non-empty category strings from core rows
    const categoriesList = [...new Set(
      coreRows.map(r => r.category || "").filter(c => c.trim())
    )];

    const payload = {
      // department: { id } — DepartmentLite shape from DTO
      department: { id: departmentId },

      // serviceArea: [ServiceArea { id, name }]
      serviceArea: serviceAreas,

      // sites: [Site { id }]
      sites: currentSiteId ? [{ id: currentSiteId }] : [],

      // applicantType: [ApplicantType { id, applicantType }]
      applicantType: apt ? [{ id: apt.id, applicantType: apt.name }] : [],

      // bodApprovalDate: string($date)
      bodApprovalDate: bodDate,

      // privilegeSetStatus: "IN_USE" | "NOT_IN_USE"
      privilegeSetStatus: privilegeSetStatus,   // already stored as enum

      privilegeSetTitle: privilegeSetTitle.trim(),

      // privilegeSpecificationType: "DISCRETE" | "DESCRIPTIVEDOCUMENT"
      privilegeSpecificationType: specType,

      proofOfDocumentationRequired: proofDocReq,
      restrictedPrivilegesRequired: restrictedReq,
      nonCorePrivilegesRequired:    nonCoreReq,

      // generalInstructionText — top-level per DTO
      generalInstructionText: generalInstruction || "",

      // categoriesList — [string]
      categoriesList,

      privilegeDetails: {
        corePrivileges: {
          // generalInstructionText also nested in corePrivileges per DTO
          generalInstructionText: generalInstruction || "",
          privilegesByCategories: buildPrivCategories(coreRows),
        },
        restrictedPrivileges: {
          generalInstructionText: "",
          privilegesByCategories: restrictedReq ? buildRestCategories(restRows) : [],
        },
        nonCorePrivileges: {
          generalInstructionText: "",
          privilegesByCategories: nonCoreReq ? buildPrivCategories(ncRows) : [],
        },
      },

      // descriptiveContent — only for DESCRIPTIVEDOCUMENT type
      ...(specType === "DESCRIPTIVEDOCUMENT"
        ? { descriptiveContent: { content: descriptiveContent } }
        : {}),
    };

    try {
      if (!isEdit) {
        await POST("entity-service/staffPrivilege", JSON.stringify(payload));
        SuccessToaster("Staff Privilege Set Added Successfully");
        if (isSaveAndExit) {
          // Close dialog and tell parent to refetch the list
          resetFields();
          handleClose(true);
        } else {
          // Save & Add More: reset form and stay open.
          // Pass "refetch-only" so parent refetches without closing dialog.
          resetFields();
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
      ErrorToaster(
        e?.response?.data?.message || e?.message || "Save failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetFields();
    handleClose(false);
  };

  // ── Privilege row UI component ─────────────────────────────────────────────────
  // Type-ahead inputs for privilegeId and title — both wired to the privilege master
  // list from PrivilegeListManager (filtered by type: CORE / RESTRICTED / NON_CORE)
  const PrivRow = ({ row, idx, master, rows, setRows, listId, showCategory = false }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: showCategory ? "160px 1fr 1fr auto" : "160px 1fr auto",
      gap: 10, marginTop: 10, alignItems: "flex-end",
    }}>
      {/* PRIVILEGE ID — type-ahead from PrivilegeListManager */}
      <div>
        <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>
          PRIVILEGE ID *
        </div>
        <input
          list={`${listId}-id`}
          value={row.privilegeId}
          placeholder="Type ID..."
          onChange={e => {
            const val   = e.target.value;
            // Auto-fill title/description when ID is matched in master
            const found = master.find(p => p.privilegeId === val);
            const next  = [...rows];
            next[idx] = {
              ...next[idx],
              privilegeId: val,
              title:       found ? (found.title       || "") : next[idx].title,
              description: found ? (found.description || "") : next[idx].description,
            };
            setRows(next);
          }}
          style={{
            width: "100%", boxSizing: "border-box",
            border: "1px solid #dee2e6", borderRadius: 4,
            padding: "8px 10px", fontSize: 14,
          }}
        />
        <datalist id={`${listId}-id`}>
          {master.map(p => (
            <option key={p.id} value={p.privilegeId}>
              {p.privilegeId} — {p.title}
            </option>
          ))}
        </datalist>
      </div>

      {/* PRIVILEGE TITLE — type-ahead from PrivilegeListManager */}
      <div>
        <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>
          PRIVILEGE TITLE *
        </div>
        <input
          list={`${listId}-title`}
          value={row.title}
          placeholder="Type or select title..."
          onChange={e => {
            const val   = e.target.value;
            const found = master.find(p => p.title === val);
            const next  = [...rows];
            next[idx] = {
              ...next[idx],
              title:       val,
              privilegeId: found ? (found.privilegeId || next[idx].privilegeId) : next[idx].privilegeId,
              description: found ? (found.description || next[idx].description) : next[idx].description,
            };
            setRows(next);
          }}
          style={{
            width: "100%", boxSizing: "border-box",
            border: "1px solid #dee2e6", borderRadius: 4,
            padding: "8px 10px", fontSize: 14,
          }}
        />
        <datalist id={`${listId}-title`}>
          {master.map(p => (
            <option key={p.id} value={p.title}>
              {p.privilegeId} — {p.title}
            </option>
          ))}
        </datalist>
      </div>

      {/* CATEGORY — only for core rows (maps to privilegesByCategories grouping) */}
      {showCategory && (
        <div>
          <div className={style.entityLableStyle} style={{ marginBottom: 4 }}>
            CATEGORY
          </div>
          <input
            value={row.category}
            placeholder="e.g. General Surgery"
            onChange={e => {
              const next = [...rows];
              next[idx] = { ...next[idx], category: e.target.value };
              setRows(next);
            }}
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1px solid #dee2e6", borderRadius: 4,
              padding: "8px 10px", fontSize: 14,
            }}
          />
        </div>
      )}

      {/* Remove row button */}
      {rows.length > 1 && (
        <button
          onClick={() => setRows(prev => prev.filter((_, i) => i !== idx))}
          style={{
            background: "none", border: "1px solid #e53935",
            color: "#e53935", borderRadius: 4, padding: "6px 10px",
            cursor: "pointer", fontSize: 12, alignSelf: "center",
          }}
        >
          ✕
        </button>
      )}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Dialog
      isOpen={open}
      onClose={handleCancel}
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
            <img
              src={WritingFile}
              className={style.dialogCrossStyle}
              alt="doc"
              style={{ marginRight: 40 }}
            />
            <Icon
              icon="cross" size={30} intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={handleCancel}
            />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder} />

        <div className={style.addHealthCareBoxStyle}>

          {/* Row 1: Department + Service Area */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            className={style.marginTop20}>
            <div>
              <div className={style.entityLableStyle}>DEPARTMENT / SERVICE AREA *</div>
              <FormControl fullWidth size="small">
                <Select
                  value={departmentId}
                  onChange={e => {
                    setDepartmentId(e.target.value);
                    setServiceAreas([]); // Reset service areas when department changes
                  }}
                  displayEmpty
                  renderValue={v => !v
                    ? <span style={{ color: "#9e9e9e" }}>Select Department</span>
                    : departments.find(d => d.id === v)?.name || v}
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 14 } }}
                >
                  {departments.length === 0
                    ? <MenuItem disabled value="">Loading departments...</MenuItem>
                    : departments.map((d, i) => (
                        <MenuItem key={d.id || i} value={d.id}>{d.name}</MenuItem>
                      ))
                  }
                </Select>
              </FormControl>
            </div>
            <div>
              <div className={style.entityLableStyle}>SERVICE AREA *</div>
              <FormControl fullWidth size="small">
                <Select
                  multiple
                  value={serviceAreas.map(s => s.id)}
                  onChange={e => {
                    const ids = typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value;
                    setServiceAreas(ids.map(id => {
                      const found = serviceAreaOptions.find(s => s.id === id);
                      return { id, name: found?.name || "" };
                    }));
                  }}
                  displayEmpty
                  renderValue={sel => !sel?.length
                    ? <span style={{ color: "#9e9e9e" }}>Select service area</span>
                    : serviceAreaOptions.filter(s => sel.includes(s.id)).map(s => s.name).join(", ")}
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 14 } }}
                >
                  {serviceAreaOptions.length === 0
                    ? <MenuItem disabled value="">
                        {departmentId ? "No service areas found" : "Select a department first"}
                      </MenuItem>
                    : serviceAreaOptions.map((s, i) => (
                        <MenuItem key={s.id || i} value={s.id}>{s.name}</MenuItem>
                      ))
                  }
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Row 2: Applicant Type + BOD Approval Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            className={style.marginTop20}>
            <div>
              <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
              <FormControl fullWidth size="small">
                <Select
                  value={applicantTypeId}
                  onChange={e => setApplicantTypeId(e.target.value)}
                  displayEmpty
                  renderValue={v => !v
                    ? <span style={{ color: "#9e9e9e" }}>Select Applicant</span>
                    : applicantTypes.find(a => a.id === v)?.name || v}
                  SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 14 } }}
                >
                  {applicantTypes.map((a, i) => (
                    <MenuItem key={a.id || i} value={a.id}>{a.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <div className={style.entityLableStyle}>BOD APPROVAL DATE *</div>
              <input
                type="date"
                value={bodDate}
                onChange={e => setBodDate(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: "1px solid #dee2e6", borderRadius: 4,
                  padding: "8px 10px", fontSize: 14,
                }}
              />
            </div>
          </div>

          {/* Privilege Set Status — maps to "IN_USE" | "NOT_IN_USE" enum */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>PRIVILEGE SET STATUS *</div>
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              {[
                { label: "In Use",      value: "IN_USE"      },
                { label: "Not In Use",  value: "NOT_IN_USE"  },
              ].map(s => (
                <label key={s.value} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                  <Radio
                    checked={privilegeSetStatus === s.value}
                    onChange={() => setPrivilegeSetStatus(s.value)}
                    value={s.value}
                    style={{ color: "#06617A" }}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          {/* Department Specific Privilege Set Title */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DEPARTMENT SPECIFIC PRIVILEGE SET TITLE *</div>
            <input
              value={privilegeSetTitle}
              onChange={e => setPrivilegeSetTitle(e.target.value)}
              placeholder="Add Privilege set Title"
              style={{
                width: "100%", boxSizing: "border-box",
                border: "1px solid #dee2e6", borderRadius: 4,
                padding: "8px 10px", fontSize: 14,
              }}
            />
          </div>

          {/* Privilege Specification Type — "DISCRETE" | "DESCRIPTIVEDOCUMENT" */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>PRIVILEGE SPECIFICATION TYPE *</div>
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              {[
                { value: "DESCRIPTIVEDOCUMENT", label: "Descriptive Document" },
                { value: "DISCRETE",            label: "Discreet Item List"   },
              ].map(item => (
                <label key={item.value} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                  <Radio
                    checked={specType === item.value}
                    onChange={() => setSpecType(item.value)}
                    value={item.value}
                    style={{ color: "#06617A" }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Restricted + Non-Core toggles */}
          <div style={{ display: "flex", gap: 40, marginTop: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

          {/* General Instruction Text — top-level DTO field */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>GENERAL INSTRUCTION TEXT</div>
            <Editor
              value={generalInstruction}
              onChange={setGeneralInstruction}
              placeholder="Enter General Instruction Here"
            />
          </div>

          <div className={`${style.Borderthick} ${style.marginTop20}`} />

          {/* ── Descriptive Content (for DESCRIPTIVEDOCUMENT type only) ───── */}
          {specType === "DESCRIPTIVEDOCUMENT" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>DESCRIPTIVE CONTENT</div>
              <Editor
                value={descriptiveContent}
                onChange={setDescriptiveContent}
                placeholder="Enter descriptive content here"
              />
            </div>
          )}

          {/* ── APPLICABLE CORE PRIVILEGES ───────────────────────────────── */}
          {/* Only shown for DISCRETE type — type-ahead from PrivilegeListManager CORE records */}
          {specType === "DISCRETE" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>APPLICABLE CORE PRIVILEGES</div>
              {coreRows.map((row, idx) => (
                <PrivRow
                  key={idx}
                  row={row} idx={idx}
                  master={privilegeMasterCore}
                  rows={coreRows} setRows={setCoreRows}
                  listId={`core-${idx}`}
                  showCategory={true}
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
          )}

          {/* ── RESTRICTED PRIVILEGES (conditional on toggle) ────────────── */}
          {/* Type-ahead from PrivilegeListManager RESTRICTED records */}
          {restrictedReq && specType === "DISCRETE" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>RESTRICTED PRIVILEGES</div>
              {restRows.map((row, idx) => (
                <PrivRow
                  key={idx}
                  row={row} idx={idx}
                  master={privilegeMasterRest}
                  rows={restRows} setRows={setRestRows}
                  listId={`rest-${idx}`}
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
              {/* Evidence / competency toggles — map to isevidenceRequired / iscompetencyDisclosureRequired */}
              <div style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={style.entityLableStyle}>EVIDENCE OF QUALIFICATION AND COMPETENCY</span>
                  <FormControlLabel
                    control={<Switch checked={evidenceReq} onChange={e => setEvidenceReq(e.target.checked)} className={classes.switch} />}
                    label={evidenceReq ? "Yes" : "No"}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={style.entityLableStyle}>COMPETENCY DISCLOSURE NOTES</span>
                  <FormControlLabel
                    control={<Switch checked={competencyReq} onChange={e => setCompetencyReq(e.target.checked)} className={classes.switch} />}
                    label={competencyReq ? "Yes" : "No"}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── NON-CORE PRIVILEGES (conditional on toggle) ─────────────── */}
          {/* Type-ahead from PrivilegeListManager NON_CORE records */}
          {nonCoreReq && specType === "DISCRETE" && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>NON-CORE PRIVILEGES</div>
              {ncRows.map((row, idx) => (
                <PrivRow
                  key={idx}
                  row={row} idx={idx}
                  master={privilegeMasterNC}
                  rows={ncRows} setRows={setNcRows}
                  listId={`nc-${idx}`}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "SAVING..." : "SAVE & EXIT"}
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20} ${style.borderRadius10}`}
              onClick={() => handleSave(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "SAVING..." : "SAVE & ADD MORE"}
            </button>
          </div>
        </div>

      </div>{/* end extensionDialogBackground */}
    </Dialog>
  );
};

export default StaffPrivilegeDialog;