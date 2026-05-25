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

const PaymentListDialog = ({
  open,
  handleClose,
  isEdit,
  editData,
  selectedPrivilegeCategory,
  // FIX 1: Accept privilegeCategories as prop from parent
  // Old: fetched independently via GET /privilege on every dialog open (duplicate call)
  // New: parent passes it — no extra API call needed
  privilegeCategories: privilegeCategoriesProp = [],
}) => {
  const [applicantTypes, setApplicantTypes]         = useState([]);
  const [privilegeCategories, setPrivilegeCategories] = useState([]);
  const [currencyTypes, setCurrencyTypes]           = useState([]);
  const [selectedCurrency, setSelectedCurrency]     = useState({ id: "", currencyType: "" });

  const [saveData, setSaveData] = useState(
    editData || {
      privilegeCategory:       selectedPrivilegeCategory || {},
      applicantType:           {},
      applicationCreationType: "",
      fee:                     "",
      currencyType:            "",
    }
  );

  // FIX 2: Add LOCUM_RENEWAL to match Swagger enum
  // Swagger PaymentDetail.applicationCreationType Enum: [ NEW, REAPPOINTMENT, LOCUM_RENEWAL ]
  // Old: only had NEW and REAPPOINTMENT — users couldn't create LOCUM_RENEWAL entries
  const applicationCreationTypes = [
    { id: "NEW",           type: "Initial Appointment" },
    { id: "REAPPOINTMENT", type: "Reappointment"       },
    { id: "LOCUM_RENEWAL", type: "Locum Renewal"       }, // ✅ FIXED: was missing
  ];

  // Use prop categories — set them directly, no extra API call
  useEffect(() => {
    if (privilegeCategoriesProp.length > 0) {
      // Put selectedPrivilegeCategory first in the list
      const ordered = selectedPrivilegeCategory
        ? [
            selectedPrivilegeCategory,
            ...privilegeCategoriesProp.filter(
              (item) => item.id !== selectedPrivilegeCategory.id
            ),
          ]
        : privilegeCategoriesProp;
      setPrivilegeCategories(ordered);
    }
  }, [privilegeCategoriesProp, selectedPrivilegeCategory]);

  // Auto-set privilegeCategory when categories load
  useEffect(() => {
    if (privilegeCategories.length && !saveData.privilegeCategory?.id) {
      const defaultCategory = selectedPrivilegeCategory || privilegeCategories[0];
      setSaveData((prev) => ({ ...prev, privilegeCategory: defaultCategory }));
    }
  }, [privilegeCategories]);

  // On open: fetch applicant types + currency. Set editData or defaults.
  useEffect(() => {
    fetchApplicantTypes();
    fetchCurrencyTypes();

    if (editData) {
      setSaveData(editData);
    } else if (!editData && selectedPrivilegeCategory) {
      setSaveData((prev) => ({
        ...prev,
        privilegeCategory: selectedPrivilegeCategory,
      }));
    }
  }, [editData, selectedPrivilegeCategory]);

  // FIX 3: Removed fetchPrivilegeCategories() — duplicate GET /privilege call
  // Old: called GET /privilege independently inside the dialog
  // New: uses privilegeCategories prop passed from paymentList.js

  const fetchCurrencyTypes = async () => {
    try {
      const response = await GET("entity-service/country");
      const currencyData = response.data.map((item) => ({
        id:           item.id,
        currencyType: item.currencyType,
      }));

      if (currencyData?.length > 0) {
        setCurrencyTypes(currencyData);
        // If only one currencyType, set it automatically
        if (currencyData.length === 1) {
          setSelectedCurrency(currencyData[0]);
          setSaveData((prev) => ({
            ...prev,
            currencyType: currencyData[0].currencyType,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching currency types:", error);
    }
  };

  const handleCountrySelectionChange = (event) => {
    const selectedId = event?.target?.value || selectedCurrency.id;
    const selectedCurrencyData = currencyTypes.find((data) => data.id === selectedId);
    if (selectedCurrencyData) {
      setSelectedCurrency({ id: selectedCurrencyData.id, currencyType: selectedCurrencyData.currencyType });
      setSaveData((prev) => ({ ...prev, currencyType: selectedCurrencyData.currencyType }));
    }
  };

  const fetchApplicantTypes = async () => {
    try {
      const response = await GET("entity-service/applicantType");
      const types = response.data.map((item) => ({
        id:   item.id,
        type: item.applicantType,
      }));
      setApplicantTypes(types);
    } catch (error) {
      ErrorToaster("Error fetching applicant types.");
    }
  };

  const handleapplicationCreationTypeChange = (e) => {
    setSaveData((prev) => ({ ...prev, applicationCreationType: e.target.value }));
  };

  const handleFieldChange = (field, value) => {
    setSaveData((prev) => ({ ...prev, [field]: value }));
  };

  // FIX 4: preparePayload — removed type:"PERMANENT" (not in Swagger PaymentDetail schema)
  // FIX 5: Added currencyType to payload (PaymentDetail schema has currencyType: string)
  const preparePayload = () => ({
    privilegeCategory: {
      id:       saveData.privilegeCategory?.id       || "",
      category: saveData.privilegeCategory?.category || "",
      // FIX 4: Removed type: "PERMANENT" — not in Swagger PaymentDetail schema
    },
    applicantType: {
      id:            saveData.applicantType?.id   || "",
      applicantType: saveData.applicantType?.type || "",
    },
    applicationCreationType: saveData.applicationCreationType || "",
    // FIX 5: Include currencyType in payload — it's in the Swagger schema
    // Old: currencyType was set in state but never sent to API
    currencyType: saveData.currencyType || selectedCurrency.currencyType || "",
    fee: parseFloat(saveData.fee) || 0,
  });

  const handleAdd = async () => {
    const payload = preparePayload();
    try {
      await POST("entity-service/paymentAndFeeDetails", payload);
      SuccessToaster("Payment and Fee Details added successfully.");
      resetDialogFields();
      handleClose(true);
    } catch (error) {
      ErrorToaster("Failed to add Payment and Fee Details.");
    }
  };

  const handleAddMore = async () => {
    const payload = preparePayload();
    try {
      await POST("entity-service/paymentAndFeeDetails", payload);
      SuccessToaster("Saved! You can add another entry.");
      resetDialogFields();
      handleClose(true, true);
    } catch (error) {
      ErrorToaster("Failed to add Payment and Fee Details.");
    }
  };

  const handleUpdate = async () => {
    const payload = preparePayload();
    try {
      const id = editData?.id;
      await PUT(`entity-service/paymentAndFeeDetails/${id}`, payload);
      SuccessToaster("Payment and Fee Details updated successfully.");
      resetDialogFields();
      handleClose(true);
    } catch (error) {
      ErrorToaster("Failed to update Payment and Fee Details.");
    }
  };

  const resetDialogFields = () => {
    setSaveData({
      privilegeCategory:       {},
      applicantType:           {},
      applicationCreationType: "",
      fee:                     "",
      currencyType:            "",
    });
    setSelectedCurrency({ id: "", currencyType: "" });
  };

  return (
    <Dialog
      isOpen={open}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit ? "Edit Payment and Fee Details" : "Add New Payment and Fee Details"}
          </p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img src={WritingFile} className={style.dialogCrossStyle} alt="Writing File" />
            <Icon
              icon="cross"
              size={30}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={() => { resetDialogFields(); handleClose(); }}
            />
          </div>
        </div>

        <div className={style.ReferenceListEntityBorder}></div>

        <div className={style.addHealthCareBoxStyle}>

          {/* Applicant Type Dropdown */}
          <div className={style.fieldContainer}>
            <div className={style.entityLableStyle}>Applicant Type *</div>
            <FormControl fullWidth size="small">
              <Select
                value={saveData.applicantType?.id || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "applicantType",
                    applicantTypes.find((item) => item.id === e.target.value)
                  )
                }
                displayEmpty
                renderValue={(value) => {
                  if (!value) return <span style={{ color: "#9e9e9e" }}>Select Applicant Type</span>;
                  return applicantTypes.find((a) => a.id === value)?.type || value;
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {applicantTypes.map((data) => (
                  <MenuItem value={data.id} key={data.id}>{data.type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Privilege Category Dropdown */}
          <div className={style.fieldContainer}>
            <div className={style.entityLableStyle}>Privilege Category *</div>
            <FormControl fullWidth size="small">
              <Select
                value={saveData.privilegeCategory?.id || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "privilegeCategory",
                    privilegeCategories.find((item) => item.id === e.target.value)
                  )
                }
                disabled={!privilegeCategories.length}
                displayEmpty
                renderValue={(value) => {
                  if (!value) return <span style={{ color: "#9e9e9e" }}>Select Privilege Category</span>;
                  return privilegeCategories.find((c) => c.id === value)?.category || value;
                }}
              >
                {privilegeCategories.map((data) => (
                  <MenuItem value={data.id} key={data.id}>{data.category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Application Creation Type Dropdown */}
          {/* FIX 2: Now includes LOCUM_RENEWAL from Swagger enum */}
          <div className={style.fieldContainer}>
            <div className={style.entityLableStyle}>Application Type *</div>
            <FormControl fullWidth size="small">
              <Select
                value={saveData.applicationCreationType || ""}
                onChange={handleapplicationCreationTypeChange}
                displayEmpty
                renderValue={(value) => {
                  if (!value) return <span style={{ color: "#9e9e9e" }}>Select Application Type</span>;
                  return applicationCreationTypes.find((a) => a.id === value)?.type || value;
                }}
                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
              >
                {applicationCreationTypes.map((data) => (
                  <MenuItem value={data.id} key={data.id}>{data.type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Fee Input */}
          <div className={style.fieldContainer}>
            <div className={style.entityLableStyle}>Fee *</div>
            <div className={style.flexRow}>
              <FormControl fullWidth size="small">
                <div className={style.feeContainer}>
                  {currencyTypes.length === 1 ? (
                    <span className={style.currencyLabel}>
                      {currencyTypes[0].currencyType}
                    </span>
                  ) : currencyTypes.length > 1 ? (
                    <Select
                      value={selectedCurrency.id}
                      onChange={handleCountrySelectionChange}
                      size="small"
                      SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                    >
                      {currencyTypes.map((data) => (
                        <MenuItem value={data.id} key={data.id}>{data.currencyType}</MenuItem>
                      ))}
                    </Select>
                  ) : null}
                  <CommonInputField
                    value={saveData.fee}
                    onChange={(e) => handleFieldChange("fee", e.target.value)}
                    placeholder="Enter fee"
                    required={false}
                  />
                </div>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Save Buttons */}
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={isEdit ? handleUpdate : handleAdd}
            >
              Save &amp; Exit
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={isEdit ? handleUpdate : handleAddMore}
            >
              Save &amp; Add More
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentListDialog;