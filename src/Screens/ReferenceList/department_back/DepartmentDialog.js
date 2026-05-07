import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import { GET, POST, PUT } from "../../dataSaver";

const useStyles = makeStyles({ switch: { color: "primary" } });

const DepartmentDialog = ({ open, handleClose, isEdit, selectedApplicant, currentSiteTypeId }) => {
  const classes = useStyles();

  // Site dropdown
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");

  // Department fields
  const [departName, setDepartName] = useState("");
  const [aliasName1, setAliasName1] = useState("");
  const [aliasName2, setAliasName2] = useState("");

  // Service areas — supports multiple via ADD MORE
  const [serviceAreas, setServiceAreas] = useState([
    { name: "", aliasName1: "", aliasName2: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch sites for dropdown ──────────────────────────────
  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const { data } = await GET("entity-service/sites");
      const siteList = data || [];
      setSites(siteList);
      // Always auto-select using site.id (the site record id, not siteTypeId)
      if (siteList.length > 0) {
        setSelectedSiteId(siteList[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch sites:", err);
    }
  };

  // ── Populate fields in edit mode ──────────────────────────
  useEffect(() => {
    if (open) {
      if (isEdit && selectedApplicant) {
        setDepartName(selectedApplicant.departmentName?.name || "");
        setAliasName1(selectedApplicant.aliasName1 || "");
        setAliasName2(selectedApplicant.aliasName2 || "");
        const areas = selectedApplicant.serviceAreas?.length > 0
          ? selectedApplicant.serviceAreas.map((a) => ({
              name: a.name || "",
              aliasName1: a.aliasName1 || "",
              aliasName2: a.aliasName2 || "",
            }))
          : [{ name: "", aliasName1: "", aliasName2: "" }];
        setServiceAreas(areas);
        if (selectedApplicant.siteTypeId?.id) {
          setSelectedSiteId(selectedApplicant.siteTypeId.id);
        }
      } else {
        resetFormFields();
      }
    }
  }, [open, isEdit, selectedApplicant]);

  const resetFormFields = () => {
    setDepartName("");
    setAliasName1("");
    setAliasName2("");
    setServiceAreas([{ name: "", aliasName1: "", aliasName2: "" }]);
  };

  const handleDialogClose = () => {
    resetFormFields();
    handleClose(false);
  };

  // ── ADD MORE — adds another service area row ──────────────
  const handleAddMore = () => {
    setServiceAreas((prev) => [
      ...prev,
      { name: "", aliasName1: "", aliasName2: "" },
    ]);
  };

  // ── Update a specific service area field ──────────────────
  const updateServiceArea = (index, field, value) => {
    setServiceAreas((prev) =>
      prev.map((area, i) => (i === index ? { ...area, [field]: value } : area))
    );
  };

  // ── Get site name for display ─────────────────────────────
  const getSiteName = (site) => {
    if (!site) return "";
    const raw = site?.siteName;
    // siteName can be: string, { siteName: "..." }, { name: "..." }, or object
    if (typeof raw === "string" && raw) return raw;
    if (typeof raw === "object" && raw !== null) {
      return raw?.siteName || raw?.name || raw?.type || "";
    }
    return site?.name || site?.type || site?.siteTypeName || "";
  };

  // ── SAVE handler ──────────────────────────────────────────
  // isSaveAndExit = true  → SAVE & CLOSE
  // isSaveAndExit = false → SAVE & ADD More (keep dialog open)
  const SaveSubmitHandler = async (isSaveAndExit) => {
    if (!departName.trim()) {
      ErrorToaster("Department Name is required.");
      return;
    }

    setIsSubmitting(true);

    const formattedData = {
      departmentName: { name: departName.trim() },
      aliasName1: aliasName1.trim(),
      aliasName2: aliasName2.trim(),
      serviceAreas: serviceAreas
        .filter((a) => a.name.trim())
        .map((a) => ({
          name: a.name.trim(),
          aliasName1: a.aliasName1.trim(),
          aliasName2: a.aliasName2.trim(),
        })),
      siteTypeId: selectedSiteId ? { id: selectedSiteId } : undefined,
    };

    try {
      if (!isEdit) {
        await POST(
          "entity-service/department",
          JSON.stringify([formattedData])
        );
        SuccessToaster("Department added successfully.");
        resetFormFields();
        if (isSaveAndExit) {
          // Pass new item back so parent can append to list without API reload
          const newItem = {
            departmentName: { name: formattedData.departmentName.name },
            departmentGroupBy: { name: formattedData.departmentName.name },
            serviceAreas: formattedData.serviceAreas,
            name: formattedData.departmentName.name,
          };
          handleClose(true, newItem);
        }
        // SAVE & ADD More: stay open with cleared fields
      } else {
        const id = selectedApplicant.id;
        await PUT(
          `entity-service/department/${id}`,
          JSON.stringify([formattedData])
        );
        SuccessToaster("Department updated successfully.");
        resetFormFields();
        if (isSaveAndExit) {
          handleClose(true, null);
        }
      }
    } catch (err) {
      ErrorToaster(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────

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
            {isEdit
              ? "Edit Department / Service Area"
              : "Add Department / Service Area"}
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
                {sites.length === 0 && (
                  <MenuItem disabled value="">No sites available</MenuItem>
                )}
                {sites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {getSiteName(site)}
                  </MenuItem>
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
              fullWidth
              size="small"
            />
          </div>

          {/* Alias Name */}
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Alias Name</div>
            <div style={{ display: "flex", gap: "12px" }}>
              <TextField
                placeholder="Alias Name 1"
                value={aliasName1}
                onChange={(e) => setAliasName1(e.target.value)}
                fullWidth
                size="small"
              />
              <TextField
                placeholder="Alias Name 2"
                value={aliasName2}
                onChange={(e) => setAliasName2(e.target.value)}
                fullWidth
                size="small"
              />
            </div>
          </div>

          <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`} />

          {/* Service Areas — one per ADD MORE click */}
          {serviceAreas.map((area, index) => (
            <div
              key={index}
              className={`${style.marginTop20} ${style.addHealthCareBoxStyle}`}
            >
              <div className={style.extentionGrid}>
                <div className={style.entityLableStyle}>Service Name *</div>
                <TextField
                  placeholder="Service Name"
                  value={area.name}
                  onChange={(e) => updateServiceArea(index, "name", e.target.value)}
                  fullWidth
                  size="small"
                />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.entityLableStyle}>Alias Name</div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <TextField
                    placeholder="Alias Name 1"
                    value={area.aliasName1}
                    onChange={(e) => updateServiceArea(index, "aliasName1", e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    placeholder="Alias Name 2"
                    value={area.aliasName2}
                    onChange={(e) => updateServiceArea(index, "aliasName2", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD MORE button */}
        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
          <div />
          <button
            className={style.outlinedButton}
            onClick={handleAddMore}
          >
            ADD MORE
          </button>
        </div>

        {/* Action buttons */}
        <div className={`${style.floatRight} ${style.marginTop20}`}>
          <button
            className={style.outlinedButton}
            onClick={() => SaveSubmitHandler(false)}
            disabled={isSubmitting}
          >
            SAVE &amp; ADD More
          </button>
          <button
            className={`${style.buttonStyle} ${style.marginLeft20}`}
            onClick={() => SaveSubmitHandler(true)}
            disabled={isSubmitting}
          >
            SAVE &amp; CLOSE
          </button>
        </div>

      </div>
    </Dialog>
  );
};

export default DepartmentDialog;