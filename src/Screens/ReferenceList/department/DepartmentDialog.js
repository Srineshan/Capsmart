import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import { TextField, Switch, FormControlLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import { GET, POST, PUT } from "../../dataSaver";

const DepartmentDialog = ({
  open,
  handleClose,   // (needRefetch: bool, newItem?: object) => void
  isEdit,
  selectedApplicant,
  currentSiteTypeId,
}) => {
  const [sites, setSites]                   = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [departName, setDepartName]         = useState("");
  const [aliasName1, setAliasName1]         = useState("");
  const [aliasName2, setAliasName2]         = useState("");

  // Department-level regional call responsibility
  const [regionalCallApplicable, setRegionalCallApplicable] = useState(false);

  // Each service area: { name, aliasName1, aliasName2, regionalCallApplicable }
  const [serviceAreas, setServiceAreas] = useState([
    { name: "", aliasName1: "", aliasName2: "", regionalCallApplicable: false },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load sites on mount
  useEffect(() => { fetchSites(); }, []);

  const fetchSites = async () => {
    try {
      const { data } = await GET("entity-service/sites");
      const list = data || [];
      setSites(list);
      if (list.length > 0) setSelectedSiteId(list[0].id);
    } catch (err) { console.error("Failed to fetch sites:", err); }
  };

  // Populate fields in edit mode
  useEffect(() => {
    if (!open) return;
    if (isEdit && selectedApplicant) {
      setDepartName(
        selectedApplicant?.departmentName?.name ||
        selectedApplicant?.departmentGroupBy?.name ||
        selectedApplicant?.name || ""
      );
      setAliasName1(selectedApplicant?.aliasName1 || "");
      setAliasName2(selectedApplicant?.aliasName2 || "");
      setRegionalCallApplicable(
        selectedApplicant?.regionalCallResponsibilitiesApplicable === true
      );

      const areas = selectedApplicant?.serviceAreas?.length > 0
        ? selectedApplicant.serviceAreas.map((a) => ({
            name:                     a?.name || a?.serviceName || "",
            aliasName1:               a?.aliasName1 || "",
            aliasName2:               a?.aliasName2 || "",
            regionalCallApplicable:   a?.regionalCallResponsibilitiesApplicable === true,
          }))
        : [{ name: "", aliasName1: "", aliasName2: "", regionalCallApplicable: false }];
      setServiceAreas(areas);

      const sid =
        selectedApplicant?.siteTypeId?.id ||
        selectedApplicant?.siteId?.id     ||
        selectedApplicant?.siteTypeId     ||
        selectedApplicant?.siteId         || "";
      if (sid) setSelectedSiteId(sid);
    } else {
      resetFormFields();
    }
  }, [open, isEdit, selectedApplicant]);

  const resetFormFields = () => {
    setDepartName("");
    setAliasName1("");
    setAliasName2("");
    setRegionalCallApplicable(false);
    setServiceAreas([{ name: "", aliasName1: "", aliasName2: "", regionalCallApplicable: false }]);
  };

  const handleDialogClose = () => {
    resetFormFields();
    handleClose(false, null);
  };

  const handleAddMore = () => {
    setServiceAreas((prev) => [
      ...prev,
      { name: "", aliasName1: "", aliasName2: "", regionalCallApplicable: false },
    ]);
  };

  const removeServiceArea = (index) => {
    if (serviceAreas.length === 1) return;
    setServiceAreas((prev) => prev.filter((_, i) => i !== index));
  };

  const updateServiceArea = (index, field, value) => {
    setServiceAreas((prev) =>
      prev.map((area, i) => (i === index ? { ...area, [field]: value } : area))
    );
  };

  const getSiteName = (site) => {
    if (!site) return "";
    const raw = site?.siteName;
    if (typeof raw === "string" && raw) return raw;
    if (typeof raw === "object" && raw) return raw?.siteName || raw?.name || raw?.type || "";
    return site?.name || site?.type || site?.siteTypeName || "";
  };

  // Build payload matching POST /department schema exactly
  const buildPayload = () => ({
    departmentName: { name: departName.trim() },
    aliasName1:     aliasName1.trim(),
    aliasName2:     aliasName2.trim(),
    // Department-level regional call responsibilities (boolean per schema)
    regionalCallResponsibilitiesApplicable: regionalCallApplicable,
    serviceAreas: serviceAreas
      .filter((a) => a.name.trim())
      .map((a) => ({
        name:       a.name.trim(),
        aliasName1: a.aliasName1.trim(),
        aliasName2: a.aliasName2.trim(),
        // Service area level regional call responsibilities (boolean per schema)
        regionalCallResponsibilitiesApplicable: a.regionalCallApplicable,
      })),
    siteTypeId: selectedSiteId ? { id: selectedSiteId } : undefined,
    customized:  true,
    active:      true,
  });

  // isSaveAndExit = true  → SAVE & CLOSE
  // isSaveAndExit = false → SAVE & ADD MORE (stay open, clear fields)
  const SaveSubmitHandler = async (isSaveAndExit) => {
    if (!departName.trim()) {
      ErrorToaster("Department Name is required.");
      return;
    }

    setIsSubmitting(true);
    const payload = buildPayload();

    try {
      if (!isEdit) {
        await POST("entity-service/department", JSON.stringify([payload]));
        SuccessToaster("Department added successfully.");

        if (isSaveAndExit) {
          const newItem = {
            name:                                  departName.trim(),
            departmentName:                        { name: departName.trim() },
            aliasName1:                            aliasName1.trim(),
            aliasName2:                            aliasName2.trim(),
            regionalCallResponsibilitiesApplicable: regionalCallApplicable,
            serviceAreas:                          payload.serviceAreas,
            customized:                            true,
          };
          handleClose(true, newItem);
        } else {
          resetFormFields();
        }
      } else {
        const id = selectedApplicant?.id;
        if (!id) { ErrorToaster("Cannot update: missing department ID."); return; }
        await PUT(`entity-service/department/${id}`, JSON.stringify([payload]));
        SuccessToaster("Department updated successfully.");
        if (isSaveAndExit) {
          const updatedItem = {
            ...selectedApplicant,
            name:                                  departName.trim(),
            departmentName:                        { name: departName.trim() },
            aliasName1:                            aliasName1.trim(),
            aliasName2:                            aliasName2.trim(),
            regionalCallResponsibilitiesApplicable: regionalCallApplicable,
            serviceAreas:                          payload.serviceAreas,
          };
          handleClose(true, updatedItem);
        } else {
          resetFormFields();
        }
      }
    } catch (err) {
      console.error("[DepartmentDialog] Save error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.data?.message           ||
        err?.message                 ||
        "Something went wrong. Check console for details.";
      ErrorToaster(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={handleDialogClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* Header */}
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit ? "Edit Department / Service Area" : "Add Department / Service Area"}
          </p>
          <Icon
            icon="cross"
            size={30}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={handleDialogClose}
          />
        </div>

        <div className={`${style.addHealthCareBoxStyle} ${style.marginTop20}`}>

          {/* Site dropdown */}
          <div className={style.extentionGrid}>
            <div className={style.entityLableStyle}>Site *</div>
            <FormControl fullWidth size="small">
              <Select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                displayEmpty
                renderValue={(value) => {
                  if (!value) return <span style={{ color: "#9e9e9e" }}>Select Site</span>;
                  const site = sites.find((s) => s.id === value);
                  return site ? getSiteName(site) : value;
                }}
              >
                {sites.length === 0 && <MenuItem disabled value="">No sites available</MenuItem>}
                {sites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>{getSiteName(site)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Department Name */}
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Department Name *</div>
            <TextField
              placeholder="Department Name"
              value={departName}
              onChange={(e) => setDepartName(e.target.value)}
              fullWidth size="small"
            />
          </div>

          {/* Alias Names */}
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Alias Name</div>
            <div style={{ display: "flex", gap: 12 }}>
              <TextField
                placeholder="Alias Name 1" value={aliasName1}
                onChange={(e) => setAliasName1(e.target.value)} fullWidth size="small"
              />
              <TextField
                placeholder="Alias Name 2" value={aliasName2}
                onChange={(e) => setAliasName2(e.target.value)} fullWidth size="small"
              />
            </div>
          </div>

          {/* Regional Call Responsibilities — department level */}
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Regional Call Responsibilities</div>
            <FormControlLabel
              control={
                <Switch
                  checked={regionalCallApplicable}
                  onChange={(e) => setRegionalCallApplicable(e.target.checked)}
                  color="primary"
                  size="small"
                />
              }
              label={
                <span style={{ fontSize: 13, color: regionalCallApplicable ? "#00695c" : "#757575" }}>
                  {regionalCallApplicable ? "Applicable" : "Not Applicable"}
                </span>
              }
            />
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* Service Areas */}
          {serviceAreas.map((area, index) => (
            <div
              key={index}
              className={`${style.marginTop20} ${style.addHealthCareBoxStyle}`}
              style={{ position: "relative" }}
            >
              {serviceAreas.length > 1 && (
                <button
                  onClick={() => removeServiceArea(index)}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "none", border: "none",
                    color: "#d32f2f", cursor: "pointer", fontSize: 16,
                  }}
                  title="Remove"
                >×</button>
              )}

              {/* Service Area Name */}
              <div className={style.extentionGrid}>
                <div className={style.entityLableStyle}>
                  Service Area Name {serviceAreas.length > 1 ? index + 1 : ""}
                </div>
                <TextField
                  placeholder="Service Name" value={area.name}
                  onChange={(e) => updateServiceArea(index, "name", e.target.value)}
                  fullWidth size="small"
                />
              </div>

              {/* Service Area Alias Names */}
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.entityLableStyle}>Alias Name</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <TextField
                    placeholder="Alias Name 1" value={area.aliasName1}
                    onChange={(e) => updateServiceArea(index, "aliasName1", e.target.value)}
                    fullWidth size="small"
                  />
                  <TextField
                    placeholder="Alias Name 2" value={area.aliasName2}
                    onChange={(e) => updateServiceArea(index, "aliasName2", e.target.value)}
                    fullWidth size="small"
                  />
                </div>
              </div>

              {/* Service Area Regional Call Responsibilities */}
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.entityLableStyle}>Regional Call Responsibilities</div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={area.regionalCallApplicable}
                      onChange={(e) =>
                        updateServiceArea(index, "regionalCallApplicable", e.target.checked)
                      }
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <span style={{ fontSize: 13, color: area.regionalCallApplicable ? "#00695c" : "#757575" }}>
                      {area.regionalCallApplicable ? "Applicable" : "Not Applicable"}
                    </span>
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Add More Service Area */}
        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
          <div />
          <button className={style.outlinedButton} onClick={handleAddMore} disabled={isSubmitting}>
            ADD MORE SERVICE AREA
          </button>
        </div>

        {/* Save buttons */}
        <div className={`${style.floatRight} ${style.marginTop20}`}>
          <button
            className={style.outlinedButton}
            onClick={() => SaveSubmitHandler(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SAVING…" : "SAVE & ADD MORE"}
          </button>
          <button
            className={`${style.buttonStyle} ${style.marginLeft20}`}
            onClick={() => SaveSubmitHandler(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "SAVING…" : "SAVE & CLOSE"}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default DepartmentDialog;