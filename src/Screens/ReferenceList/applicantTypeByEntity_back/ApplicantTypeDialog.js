import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { GET, POST, PUT } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import WritingFile from "./../../../images/writing-file.svg";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";

const ApplicantTypeDialog = ({
  open,
  handleClose,
  isEdit,
  selectedApplicant,
  entityId,
  entityName,
  categoryList, // ✅ passed from parent — extracted from applicantTypeList
}) => {
  const [applicantCategories, setApplicantCategories] = useState([]);
  const [saveData, setSaveData] = useState({});
  const [enterApplicant, setEnterApplicant] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // ── Use parent-provided categories first, fallback to API fetch ──
  useEffect(() => {
    if (categoryList && categoryList.length > 0) {
      // Parent already extracted categories from applicantTypeList — use directly
      console.log("Using categories from parent:", categoryList);
      setApplicantCategories(categoryList);
    } else {
      // Parent had no categories yet — fetch independently
      fetchApplicantCategory();
    }
  }, [categoryList]);

  // Populate fields when dialog opens — matches DepartmentDialog pattern
  useEffect(() => {
    if (open) {
      if (isEdit && selectedApplicant) {
        setSaveData({ ...selectedApplicant });
        // applicantType was normalised to array in parent — unwrap for input
        const typeValue = Array.isArray(selectedApplicant.applicantType)
          ? selectedApplicant.applicantType[0] || ""
          : selectedApplicant.applicantType || "";
        setEnterApplicant(typeValue);
        setDescription(selectedApplicant.description || "");
      } else {
        resetDialogFields();
      }
    }
  }, [open, isEdit, selectedApplicant]);

  // ── Fallback: fetch categories from API if parent didn't provide any ──
  const fetchApplicantCategory = async () => {
    setIsCategoryLoading(true);
    try {
      // Try all known endpoints
      const endpoints = [
        "entity-service/applicantTypeCategory",
        "entity-service/category",
        `entity-service/applicantType?entityId=${entityId}`,
      ];

      let list = [];

      for (const endpoint of endpoints) {
        if (list.length > 0) break;
        try {
          const response = await GET(endpoint);
          console.log(`Trying endpoint ${endpoint}:`, JSON.stringify(response, null, 2));

          const raw =
            response?.data?.content ||
            response?.data?.data ||
            response?.data ||
            response ||
            [];

          if (Array.isArray(raw) && raw.length > 0) {
            list = raw;
          }
        } catch (e) {
          console.warn(`Endpoint ${endpoint} failed:`, e);
        }
      }

      if (list.length === 0) {
        console.warn("All category endpoints returned empty.");
        setIsCategoryLoading(false);
        return;
      }

      // If we got applicantType records, extract unique categories from them
      const isApplicantTypeRecords = list[0]?.applicantType !== undefined;
      let mapped = [];

      if (isApplicantTypeRecords) {
        // Extract unique categories from applicantType records
        const seen = new Set();
        list.forEach((item) => {
          const cat = item?.category;
          if (!cat) return;
          const id = typeof cat === "object" ? cat?.id || cat?.category : cat;
          const label = typeof cat === "object"
            ? cat?.category || cat?.name || ""
            : cat;
          if (id && !seen.has(id)) {
            seen.add(id);
            mapped.push({ id, type: label });
          }
        });
      } else {
        // Direct category records
        mapped = list.map((item) => ({
          id: item.id,
          type:
            (typeof item.category === "string" ? item.category : null) ||
            (typeof item.categoryName === "string" ? item.categoryName : null) ||
            (typeof item.name === "string" ? item.name : null) ||
            (typeof item.type === "string" ? item.type : null) ||
            "",
        }));
      }

      console.log("Fetched and mapped categories:", mapped);
      setApplicantCategories(mapped);
    } catch (error) {
      console.error("Error fetching applicant categories:", error);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  // ── Handlers ───────────────────────────────────────────────

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedItem = applicantCategories.find((item) => item.id === selectedId);
    if (selectedItem) {
      // Store as { id, category } — Table.js reads applicant.category.category
      setSaveData((prev) => ({
        ...prev,
        category: { id: selectedItem.id, category: selectedItem.type },
      }));
    }
  };

  const resetDialogFields = () => {
    setSaveData({});
    setEnterApplicant("");
    setDescription("");
  };

  const handleCancel = () => {
    resetDialogFields();
    handleClose(false);
  };

  // Matches DepartmentDialog.js pattern exactly:
  //   SaveSubmitHandler(true)  → SAVE & EXIT  → handleClose(true) triggers refetch
  //   SaveSubmitHandler(false) → SAVE & ADD MORE → stay open, clear fields
  const SaveSubmitHandler = async (isSaveAndExit) => {
    if (!saveData.category?.id) {
      ErrorToaster("Please select a Staff / Applicant Category.");
      return;
    }
    if (!enterApplicant.trim()) {
      ErrorToaster("Applicant Type is required.");
      return;
    }

    setIsSubmitting(true);

    // Send plain string to API — array wrapping is only for Table.js display
    const applicantType = {
      ...saveData,
      applicantType: enterApplicant.trim(),
      description: description.trim(),
      entityId: entityId,
    };

    try {
      if (!isEdit) {
        await POST(
          "entity-service/applicantType",
          JSON.stringify([applicantType])
        );
        SuccessToaster("Applicant Type Added Successfully");
        resetDialogFields();
        if (isSaveAndExit) {
          handleClose(true); // triggers parent refetch
        }
      } else {
        await PUT(
          `entity-service/applicantType/${selectedApplicant.id}`,
          JSON.stringify(applicantType)
        );
        SuccessToaster("Applicant Type Updated Successfully");
        resetDialogFields();
        if (isSaveAndExit) {
          handleClose(true);
        }
      }
    } catch (error) {
      ErrorToaster(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Title ──────────────────────────────────────────────────

  const displayName =
    typeof entityName === "string" && entityName.trim()
      ? entityName
      : typeof entityId === "string"
      ? entityId
      : "";

  const dialogTitle = isEdit
    ? `Edit Applicant Type`
    : `Add New Applicant Type For ( ${displayName} )`;

  // ── Render ─────────────────────────────────────────────────

  return (
    <Dialog
      isOpen={open}
      onClose={handleCancel}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>

        {/* Header */}
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>{dialogTitle}</p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img
              src={WritingFile}
              className={style.dialogCrossStyle}
              alt="Writing File"
            />
            <Icon
              icon="cross"
              size={30}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={handleCancel}
            />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder} />

        {/* Form */}
        <div className={style.addHealthCareBoxStyle}>

          {/* STAFF / APPLICANT CATEGORY* */}
          <div>
            <div className={style.entityLableStyle}>
              STAFF / APPLICANT CATEGORY *
            </div>
            <FormControl fullWidth size="small">
              <Select
                value={saveData.category?.id || ""}
                onChange={handleCategoryChange}
                displayEmpty
                renderValue={(value) => {
                  if (!value) {
                    return (
                      <span style={{ color: "#9e9e9e" }}>
                        {isCategoryLoading
                          ? "Loading categories..."
                          : "Select Staff / Applicant Category"}
                      </span>
                    );
                  }
                  return (
                    applicantCategories.find((c) => c.id === value)?.type || value
                  );
                }}
              >
                {isCategoryLoading && (
                  <MenuItem disabled value="">Loading...</MenuItem>
                )}
                {!isCategoryLoading && applicantCategories.length === 0 && (
                  <MenuItem disabled value="">No categories available</MenuItem>
                )}
                {applicantCategories.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* APPLICANT TYPE* */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>APPLICANT TYPE *</div>
            <CommonInputField
              value={enterApplicant}
              className={style.fullWidth}
              onChange={(e) => setEnterApplicant(e.target.value)}
              placeholder={"Enter Applicant Type"}
            />
          </div>

          {/* DESCRIPTION */}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DESCRIPTION</div>
            <CommonInputField
              value={description}
              className={style.fullWidth}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={"Enter Description"}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={`${style.floatRight} ${style.marginTop20}`}>
          <button
            className={style.outlinedButton}
            onClick={() => SaveSubmitHandler(true)}
            disabled={isSubmitting}
          >
            SAVE &amp; EXIT
          </button>
          {!isEdit && (
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={() => SaveSubmitHandler(false)}
              disabled={isSubmitting}
            >
              SAVE &amp; ADD MORE
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ApplicantTypeDialog;