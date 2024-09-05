import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import ArrowDown from "./../../../images/arrowDown.png";
import style from "./../index.module.scss";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Radio, Switch } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import { Box } from "@mui/material";
import { POST, GET, PUT, TenantID } from "./../../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import Editor from "../common/Editor";

const StaffPrivilegeDialog = ({
  open,
  handleClose,
  isEdit,
  selectedTermination,
  selectedApplicant,
  isSecondary,
  siteTypeId,
}) => {
  const [selectedType, setSelectedType] = useState("basic");
  const [proofRequired, setProofRequired] = useState(true);
  const [toggleState, setToggleState] = useState(false);
  const [industryTypes, setIndustryType] = useState("");
  const [instructionText, setInstructionText] = useState("");
  const [privileges, setPrivileges] = useState({
    privilegeId: "Surgical Services",
    privilegeTitle: "",
    privilegeDescrition: "",
  });
  const [applicantState, setApplicantState] = useState({
    currentEntityType: "",
    applicantTypes: [],
  });
  const [siteState, setSiteState] = useState({
    currentSiteType: "",
    specificSites: [],
  });
  const [currentEntityType, setCurrentEntityType] = useState(
    selectedTermination?.entityId?.id ? selectedTermination?.entityId?.id : ""
  );

  const [departmentNames, setDepartmentNames] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [editDepartmentNames, setEditDepartmentNames] = useState([]);
  const [terminationId, setTerminationId] = useState(
    selectedTermination?.id ? selectedTermination?.id : ""
  );
  const [createdDate, setCreatedDate] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
  };

  useEffect(() => {
    console.log("staffPrivilegeApplicant", selectedApplicant);
  }, []);

  useEffect(() => {
    fetchApplicantTypes();
    fetchSpecificSites();
    // fetchSpecificDepartment();
  }, []);

  const fetchApplicantTypes = async () => {
    try {
      const response = await GET("entity-service/applicantType");
      const applicantTypes = response.data.map((item) => ({
        id: item.id,
        type: item.applicantType,
      }));
      setApplicantState((prevState) => ({
        ...prevState,
        applicantTypes: applicantTypes,
      }));
    } catch (error) {
      console.error("Error fetching applicant types:", error);
    }
  };

  const fetchSpecificSites = async () => {
    try {
      const response = await GET("entity-service/sites");
      // Ensure that response.data is an array and handle any potential issues
      if (Array.isArray(response.data)) {
        const specificSites = response.data.map((site) => ({
          id: site.id,
          type: site.siteName ? site.siteName.siteName : "Unknown", // Safely access nested properties
        }));

        setSiteState((prevState) => ({
          ...prevState,
          specificSites: specificSites,
        }));
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching specific sites:", error);
    }
  };

  // const fetchSpecificDepartment = async () => {
  //   try {
  //     const response = await GET("entity-service/department");
  //     if (Array.isArray(response)) {
  //       const names = response.map((department) => department.name);
  //       setDepartmentNames(names);
  //     } else {
  //       console.error("Unexpected response format:", response);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching specific departments:", error);
  //   }
  // };
  const handleSelectChange = (e) => {
    setApplicantState((prevState) => ({
      ...prevState,
      currentEntityType: e.target.value,
    }));
  };
  useEffect(() => {
    if (isEdit) {
      setCurrentEntityType(siteTypeId);
      setTerminationId(selectedTermination?.id);
      setCreatedDate(selectedTermination?.createdDate);
    }
  }, [selectedTermination]);

  useEffect(() => {
    if (isEdit && selectedApplicant) {
      setSelectedType(selectedApplicant.selectedType || "basic");
      setProofRequired(selectedApplicant.proofRequired || false);
      setToggleState(selectedApplicant.toggleState || false);
      setInstructionText(selectedApplicant.instructionText || "");
      setEditDepartmentNames(selectedApplicant.departmentNames || []);
    }
  }, [isEdit, selectedApplicant]);

  const SaveSubmitHandler = async () => {
    // if (
    //   !applicantState.applicantTypes ||
    //   applicantState.applicantTypes.length === 0
    // ) {
    //   ErrorToaster("Applicant Type is required.");
    //   return;
    // }

    // if (!siteState.specificSites || siteState.specificSites.length === 0) {
    //   ErrorToaster("Site is required.");
    //   return;
    // }

    // if (!departmentNames || departmentNames.length === 0) {
    //   ErrorToaster("Department Name is required.");
    //   return;
    // }

    if (!selectedOption) {
      ErrorToaster("Privilege Specification Type is required.");
      return;
    }
    const formattedOption =
      selectedOption === "Descriptive Document"
        ? "DescriptiveDocument"
        : selectedOption;

    const data = {
      ...(isEdit && { id: terminationId }),
      ...(isEdit && { createdDate: createdDate }),
      ...(isEdit && { lastModifiedDate: new Date() }),

      tenant: {
        id: TenantID,
      },
      applicantTypes: [
        {
          applicantType: currentEntityType,
        },
      ],
      sites: [
        {
          siteName: {
            siteName: siteState.specificSites,
          },
        },
      ],
      departments: [
        {
          departmentName: {
            name: departmentNames,
          },
        },
      ],
      advancedPrivilegesRequired: toggleState,
      privilegeSpecificationType: formattedOption,
    };

    try {
      if (isEdit) {
        console.log("terminationIdterminationId", terminationId);
        await PUT(
          `entity-service/staffPrivilege/?${terminationId}`,
          JSON.stringify(data)
        );
        SuccessToaster("Document updated successfully");
      } else {
        console.log("staff post data", data);
        await POST(
          `entity-service/staffPrivilege/?${terminationId}`,
          JSON.stringify(data)
        );
        SuccessToaster("Document saved successfully");
      }
      handleClose();
    } catch (error) {
      ErrorToaster(error.message);
    }
  };

  const handleDepartmentChange = (event) => {
    setDepartmentNames(event.target.value);
  };

  return (
    <Dialog
      isOpen={open}
      onClose={handleClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>
            Setup and maintain your Staff Privileges
          </p>
          <div className={`${style.displayInRow}`}>
            <div style={{ marginRight: "40px" }}>
              <img
                src={WritingFile}
                className={style.dialogCrossStyle}
                alt="Writing File"
              />
            </div>
            <Icon
              icon="cross"
              size={30}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={handleClose}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div className={style.entityLableStyle}>DEPARTMENT/SERVICE *</div>
              <div className={style.displayInRow}>
                <select
                  value={
                    isEdit ? selectedApplicant.departmentName : departmentNames
                  }
                  className={`${style.fullWidth} ${style.customSelect}`}
                  rightElement={arrowDown()}
                  onChange={handleDepartmentChange}
                >
                  {departmentNames.map((name) => (
                    <option>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginLeft: "30px" }}>
              <div className={style.entityLableStyle}>SPECIFIC SITE*</div>
              <div className={style.displayInRow}>
                <select
                  value={
                    isEdit && selectedApplicant
                      ? selectedApplicant.siteType
                      : siteState.currentSiteType
                  }
                  className={`${style.fullWidth} ${style.customSelect}`}
                  rightElement={arrowDown()}
                  onChange={handleSelectChange}
                >
                  {siteState.specificSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginLeft: "30px" }}>
              <div className={style.entityLableStyle}>APPLICATION TYPE*</div>
              <div className={style.displayInRow}>
                <select
                  value={
                    isEdit && selectedApplicant
                      ? selectedApplicant.entityType
                      : currentEntityType
                  }
                  className={`${style.fullWidth} ${style.customSelect}`}
                  rightElement={arrowDown()}
                  onChange={(obj) => {
                    setCurrentEntityType(obj.target.value);
                  }}
                >
                  {applicantState.applicantTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={`${style.marginTop20}${style.validation}`}>
            <div className={style.entityLableStyle}>
              PRIVELEGE SPECIFICATION TYPE REQUIRED
            </div>
            <div className={`${style.marginLeft40} ${style.validation}`}>
              <FormControlLabel
                control={
                  <Radio
                    checked={selectedOption === "Discreet Item List"}
                    onChange={handleChange}
                    value="Discreet Item List"
                    sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                  />
                }
              />
              <label>Discreet Item List</label>
            </div>
            <div className={`${style.marginLeft40} ${style.validation}`}>
              <FormControlLabel
                control={
                  <Radio
                    checked={selectedOption === "Descriptive Document"}
                    onChange={handleChange}
                    value="Descriptive Document"
                    sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                  />
                }
              />
              <label>Descriptive Document</label>
            </div>
          </div>

          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              GENERAL INSTRUCTION TEXT*
            </div>
            <Editor />
          </div>
          <div
            className={`${style.marginTop20}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className={style.entityLableStyle}>
              ADVANCED PRIVILEGES REQUIRED?
            </div>
            <div style={{ marginLeft: "10px" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={toggleState}
                    onChange={(e) => setToggleState(e.target.checked)}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={toggleState ? "YES" : "NO"}
              />
            </div>
            <div></div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={`${style.marginTop20} `} style={{ float: "left" }}>
            <button
              className={`${style.outlinedButton} ${style.borderRadius10}`}
              //   onClick={() => getAddEntityDialog(false)}
            >
              BULK UPLOAD
            </button>
          </div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={`${style.outlinedButton} ${style.borderRadius10}`}
              onClick={SaveSubmitHandler}
            >
              SAVE & EXIT
            </button>
            <button
              onClick={SaveSubmitHandler}
              className={`${style.buttonStyle} ${style.marginLeft20} ${style.borderRadius10}`}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default StaffPrivilegeDialog;
