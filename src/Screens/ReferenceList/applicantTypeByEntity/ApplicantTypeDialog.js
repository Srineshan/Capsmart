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
      // Parent already extracted categories from applicantTypeList — merge, don't replace
      // (preserves any category already injected by the edit-open effect above)
      setApplicantCategories((prev) => {
        const seen = new Set(categoryList.map((c) => c.id));
        const extra = prev.filter((c) => !seen.has(c.id)); // keep injected entries not in parent list
        return [...categoryList, ...extra];
      });
    } else {
      // Parent had no categories yet — fetch independently
      fetchApplicantCategory();
    }
  }, [categoryList]);

  // Populate fields when dialog opens — matches DepartmentDialog pattern
  useEffect(() => {
    if (open) {
      if (isEdit && selectedApplicant) {
        // ── Normalise category from both `category` and `siteType` fields ──
        // Some records store category as { id, category } and others as siteType { id, type }
        const rawCat  = selectedApplicant.category || selectedApplicant.siteType;
        let normCategory = null;
        if (rawCat) {
          if (typeof rawCat === "string") {
            normCategory = { id: rawCat, category: rawCat };
          } else if (typeof rawCat === "object") {
            const id    = rawCat.id || rawCat.category || rawCat.type || "";
            const label = rawCat.category || rawCat.name || rawCat.type || rawCat.categoryName || "";
            if (id && label) normCategory = { id, category: label };
          }
        }

        setSaveData({ ...selectedApplicant, category: normCategory });

        // applicantType was normalised to array in parent — unwrap for input
        const typeValue = Array.isArray(selectedApplicant.applicantType)
          ? selectedApplicant.applicantType[0] || ""
          : selectedApplicant.applicantType || "";
        setEnterApplicant(typeValue);
        setDescription(selectedApplicant.description || "");

        // Ensure the current category is in the dropdown even if parent list is missing it
        if (normCategory?.id) {
          setApplicantCategories((prev) => {
            const already = prev.some((c) => c.id === normCategory.id);
            if (already) return prev;
            return [...prev, { id: normCategory.id, type: normCategory.category }];
          });
        }
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
        const seen = new Set();
        list.forEach((item) => {
          // Try category field first, then siteType field
          const cat = item?.category || item?.siteType;
          if (!cat) return;
          const id = typeof cat === "object" ? cat?.id || cat?.category || cat?.type : cat;
          const label = typeof cat === "object"
            ? cat?.category || cat?.name || cat?.type || ""
            : cat;
          // Filter out junk "string" test values
          if (id && label && label.toLowerCase() !== "string" && !seen.has(id)) {
            seen.add(id);
            mapped.push({ id, type: label });
          }
        });
      } else {
        // Direct category records — filter junk
        mapped = list
          .map((item) => ({
            id: item.id,
            type:
              (typeof item.category === "string" ? item.category : null) ||
              (typeof item.categoryName === "string" ? item.categoryName : null) ||
              (typeof item.name === "string" ? item.name : null) ||
              (typeof item.type === "string" ? item.type : null) ||
              "",
          }))
          .filter((item) => item.type && item.type.toLowerCase() !== "string");
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
          // ✅ Pass newItem back so parent appends it directly (no API reload)
          const newItem = {
            applicantType:    enterApplicant.trim(),
            description:      description.trim(),
            category:         saveData.category || null,
            lastModifiedDate: new Date().toISOString(),
            _justAdded:       true,
          };
          handleClose(true, newItem);
        }
      } else {
        await PUT(
          `entity-service/applicantType/${selectedApplicant.id}`,
          JSON.stringify(applicantType)
        );
        SuccessToaster("Applicant Type Updated Successfully");
        // Build the updated item so parent can update the row in-place with fresh data
        const updatedItem = {
          ...selectedApplicant,
          applicantType: enterApplicant.trim(),
          description:   description.trim(),
          category:      saveData.category || selectedApplicant.category || null,
          lastModifiedDate: new Date().toISOString(),
        };
        resetDialogFields();
        if (isSaveAndExit) {
          handleClose(true, updatedItem); // pass updatedItem so parent can patch the row
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
                {applicantCategories
                  .filter((item) => item.type && item.type.toLowerCase() !== "string")
                  .map((item) => (
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