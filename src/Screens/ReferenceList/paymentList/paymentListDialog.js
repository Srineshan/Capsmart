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
}) => {
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [privilegeCategories, setPrivilegeCategories] = useState([]);
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState({
    id: "",
    currencyType: "",
  });
  const [saveData, setSaveData] = useState(
    editData || {
      privilegeCategory: selectedPrivilegeCategory || {},
      applicantType: {},
      applicationCreationType: "",
      fee: "",
    }
  );

  const applicationCreationTypes = [
    { id: "NEW", type: "Initial Appointment" },
    { id: "REAPPOINTMENT", type: "Reappointment" },
  ];

  useEffect(() => {
    console.log("Privilege Categories:", privilegeCategories);
    console.log("Save Data Privilege Category:", saveData.privilegeCategory);
  }, [privilegeCategories, saveData]);

  useEffect(() => {
    if (
      privilegeCategories.length &&
      saveData.privilegeCategory.id === undefined
    ) {
      const defaultCategory =
        selectedPrivilegeCategory || privilegeCategories[0];
      setSaveData((prev) => ({
        ...prev,
        privilegeCategory: defaultCategory,
      }));
    }
  }, [privilegeCategories, saveData.privilegeCategory.id]);

  useEffect(() => {
    fetchApplicantTypes();
    fetchPrivilegeCategories();
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

  const fetchPrivilegeCategories = async () => {
    try {
      const response = await GET("entity-service/privilege");
      const privilegeCategoriesData = response.data.map((item) => ({
        id: item.id,
        category: item.category,
      }));

      const updatedPrivilegeCategories = selectedPrivilegeCategory
        ? [
            selectedPrivilegeCategory,
            ...privilegeCategoriesData.filter(
              (item) => item.id !== selectedPrivilegeCategory.id
            ),
          ]
        : privilegeCategoriesData;

      setPrivilegeCategories(updatedPrivilegeCategories);

      if (!editData && selectedPrivilegeCategory) {
        setSaveData((prev) => ({
          ...prev,
          privilegeCategory: selectedPrivilegeCategory,
        }));
      }
    } catch (error) {
      ErrorToaster("Error fetching privilege categories.");
    }
  };

  const fetchCurrencyTypes = async () => {
    try {
      const response = await GET("entity-service/country");
      const currencyData = response.data.map((item) => ({
        id: item.id,
        currencyType: item.currencyType,
      }));

      if (currencyData && currencyData.length > 0) {
        setCurrencyTypes(currencyData);

        // If only one currencyType, set it as selectedCurrency
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
    const selectedId = event?.target?.value || selectedCurrency.id; // Use fallback if event is undefined
    const selectedCurrencyData = currencyTypes.find(
      (data) => data.id === selectedId
    );

    if (selectedCurrencyData) {
      setSelectedCurrency({
        id: selectedCurrencyData.id,
        currencyType: selectedCurrencyData.currencyType,
      });

      setSaveData((prev) => ({
        ...prev,
        currencyType: selectedCurrencyData.currencyType,
      }));
    }
  };

  const fetchApplicantTypes = async () => {
    try {
      const response = await GET("entity-service/applicantType");
      const applicantTypes = response.data.map((item) => ({
        id: item.id,
        type: item.applicantType,
      }));
      setApplicantTypes(applicantTypes);
    } catch (error) {
      ErrorToaster("Error fetching applicant types.");
    }
  };

  const handleapplicationCreationTypeChange = (e) => {
    setSaveData((prev) => ({
      ...prev,
      applicationCreationType: e.target.value,
    }));
  };

  const handleFieldChange = (field, value) => {
    setSaveData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  // Save & Add More — saves then resets form fields but keeps dialog open
  const handleAddMore = async () => {
    const payload = preparePayload();
    try {
      await POST("entity-service/paymentAndFeeDetails", payload);
      SuccessToaster("Saved! You can add another entry.");
      resetDialogFields();
      handleClose(true, true); // needRefetch=true, keepOpen=true
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
      // window.location.reload();
    } catch (error) {
      ErrorToaster("Failed to update Payment and Fee Details.");
    }
  };

  const preparePayload = () => ({
    privilegeCategory: {
      id: saveData.privilegeCategory?.id || "",
      category: saveData.privilegeCategory?.category || "",
      type: "PERMANENT",
    },
    applicantType: {
      id: saveData.applicantType?.id || "",
      applicantType: saveData.applicantType?.type || "",
    },
    applicationCreationType: saveData.applicationCreationType || "",
    // fee: `${selectedCurrency.currencyType} ${saveData.fee}`.trim(),
    fee: parseFloat(saveData.fee) || 0,
  });

  const resetDialogFields = () => {
    setSaveData({
      privilegeCategory: {},
      applicantType: {},
      applicationCreationType: "",
      fee: "",
    });
    setSelectedCurrency({ id: "", currencyType: "" });
  };

  return (
    <Dialog
      isOpen={open}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            {isEdit
              ? "Edit Payment and Fee Details"
              : "Add New Payment and Fee Details"}
          </p>
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
              onClick={() => {
                resetDialogFields();
                handleClose();
              }}
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
                value={saveData.applicantType?.id}
                onChange={(e) =>
                  handleFieldChange(
                    "applicantType",
                    applicantTypes.find((item) => item.id === e.target.value)
                  )
                }
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {applicantTypes.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Privilege Category Dropdown */}
          <div className={style.fieldContainer}>
            <div className={style.entityLableStyle}>Privilege Category *</div>
            <FormControl fullWidth size="small">
              <Select
                value={saveData.privilegeCategory?.id || selectedPrivilegeCategory}
                onChange={(e) =>
                  handleFieldChange(
                    "privilegeCategory",
                    privilegeCategories.find(
                      (item) => item.id === e.target.value
                    )
                  )
                }
                disabled={!privilegeCategories.length}
              >
                {privilegeCategories.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Application Creation Type Dropdown */}
          <div className={style.fieldContainer}>
            <div className={style.entityLableStyle}>Application Type *</div>
            <FormControl fullWidth size="small">
              <Select
                value={saveData.applicationCreationType}
                onChange={handleapplicationCreationTypeChange}
                SelectDisplayProps={{
                  style: {
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontSize: 15,
                  },
                }}
              >
                {applicationCreationTypes.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Fee Input */}

          {/* Fee Input */}
          <div className={style.fieldContainer}>
            <div className={style.entityLableStyle}>Fee *</div>
            <div className={style.flexRow}>
              <FormControl fullWidth size="small">
                <div className={style.feeContainer}>
                  {
                    currencyTypes.length === 1 ? (
                      // Display as a label when there's only one currencyType
                      <span className={style.currencyLabel}>
                        {currencyTypes[0].currencyType}
                      </span>
                    ) : null
                    // Display dropdown when there are multiple currencyTypes
                    // <Select
                    //   value={selectedCurrency.id}
                    //   onChange={handleCountrySelectionChange}
                    //   SelectDisplayProps={{
                    //     style: {
                    //       paddingTop: 5,
                    //       paddingBottom: 5,
                    //       fontSize: 15,
                    //     },
                    //   }}
                    // >
                    //   {currencyTypes.map((data) => (
                    //     <MenuItem value={data.id} key={data.id}>
                    //       {data.currencyType}
                    //     </MenuItem>
                    //   ))}
                    // </Select>
                  }
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
              Save & Exit
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20}`}
              onClick={isEdit ? handleUpdate : handleAddMore}
            >
              Save & Add More
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentListDialog;