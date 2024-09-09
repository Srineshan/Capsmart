import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent, InputGroup } from "@blueprintjs/core";
import ArrowDown from "./../../../images/arrowDown.png";
import style from "./../index.module.scss";
import { Radio, Switch, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import { Box } from "@mui/material";
import { POST, GET, PUT, TenantID } from "./../../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import Editor from "../common/Editor";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MarkdownEditor from "../../../Components/MarkdownEditor";

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked": {
      color: "#7165e3",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#7165e3 !important",
    },
  },
});

const StaffPrivilegeDialog = ({
  open,
  handleClose,
  isEdit,
  selectedApplicant,
  isSecondary,
  siteTypeId,
}) => {
  const [isPrivilagesRequired, setPrivilagesRequired] = useState(false);
  const [applicantTypes, setApplicantTypesState] = useState([]);
  const [sites, setSitesState] = useState([]);
  const [departments, setDepartmentsState] = useState([]);
  const [generalInstructionContent, setGeneralInstructionContent] = useState();
  const [advancePrivilegeContent, setAdvancePrivilegeContent] = useState();
  const [privilegeSpecificationType, setPrivilegeSpecificationType] =
    useState("");
  const [saveData, setSaveData] = useState({});
  const [isProofOfDocumentRequired, setIsProofOfDocumentRequired] =
    useState(false);

  const PrivilegeSpecificationType1 = "DescriptiveDocument";
  const PrivilegeSpecificationType2 = "DiscreteItemList";

  const privilegeSpecifications = [
    {
      id: "Descriptive_Document",
      value: PrivilegeSpecificationType1,
      label: "Descriptive Document",
    },
    {
      id: "Discreet_Item_List",
      value: PrivilegeSpecificationType2,
      label: "Discreet Item List",
    },
  ];

  const classes = useStyles();

  const updateSaveData = (property, data) => {
    setSaveData((prev) => ({ ...prev, [property]: data }));
  };

  const handlePrivilegeSpecificationChange = (event) => {
    setPrivilegeSpecificationType(event.target.value);
    setIsProofOfDocumentRequired(false);
  };

  useEffect(() => {
    if (selectedApplicant) {
      setSaveData({ ...selectedApplicant });
      setPrivilegeSpecificationType(
        selectedApplicant.privilegeSpecificationType
      );
      setIsProofOfDocumentRequired(
        selectedApplicant.proofOfDocumentationRequired
      );
      setPrivilagesRequired(selectedApplicant.advancedPrivilegesRequired);
      setGeneralInstructionContent(selectedApplicant.generalInstructionText);
      setAdvancePrivilegeContent(selectedApplicant.advancedInstructionText);
    }
  }, [selectedApplicant]);

  useEffect(() => {
    fetchApplicantTypes();
    fetchSpecificSites();
    fetchDepartments();
  }, []);

  const fetchApplicantTypes = async () => {
    try {
      const response = await GET("entity-service/applicantType");
      const applicantTypes = response.data.map((item) => ({
        id: item.id,
        type: item.applicantType,
      }));

      if (applicantTypes && applicantTypes.length > 0) {
        setApplicantTypesState(applicantTypes);
      }
    } catch (error) {
      console.error("Error fetching applicant types:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await GET("entity-service/department");
      const departmentNames = response.data.map((item) => ({
        id: item.id,
        name: item.departmentName.name,
      }));
      if (departmentNames && departmentNames.length) {
        setDepartmentsState(departmentNames);
      }
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
          name: site.siteName ? site.siteName.siteName : "Unknown", // Safely access nested properties
        }));

        setSitesState(specificSites);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching specific sites:", error);
    }
  };

  const handleDepartmentChange = (e) => {
    var departmentData = {
      id: e.target.value,
      departmentName: {
        name: departments.find((item) => item.id == e.target.value).name,
      },
    };
    setSaveData((prev) => ({
      ...prev,
      department: departmentData,
    }));
  };

  const handleApplicantTypeChange = (e) => {
    var applicantData = {
      id: e.target.value,
      applicantType: applicantTypes.find((item) => item.id == e.target.value)
        .type,
    };
    setSaveData((prev) => ({
      ...prev,
      applicantType: applicantData,
    }));
  };

  const handleSelectSiteChange = (e) => {
    var selectedIds = e.target.value;
    if (selectedIds) {
      setSaveData((prev) => ({
        ...prev,
        sites: selectedIds.map((item) => {
          return {
            id: item,
          };
        }),
      }));
    }
  };

  const SaveSubmitHandler = async () => {
    var newStaffPrivileges = {
      ...saveData,
      proofOfDocumentationRequired: isProofOfDocumentRequired,
      advancedPrivilegesRequired: isPrivilagesRequired,
      privilegeSpecificationType: privilegeSpecificationType,
    };

    if (!isEdit) {
      await POST(
        "entity-service/staffPrivilege",
        JSON.stringify(newStaffPrivileges)
      )
        .then((response) => {
          SuccessToaster("Staff Privilege Added Successfully");
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      var id = "";
      await PUT(
        `entity-service/staffPrivilege/${id}`,
        JSON.stringify(newStaffPrivileges)
      )
        .then((response) => {
          SuccessToaster("Staff Privilege Updated Successfully");
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
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
              onClick={() => {
                setSaveData({});
                handleClose();
              }}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <Box display={"flex"} gap={3}>
            <Box width={"50%"} key={"department-service"}>
              <div className={style.entityLableStyle}>DEPARTMENT/SERVICE *</div>
              <FormControl fullWidth size="small">
                <Select
                  labelId="department-service-select"
                  id="department-service-select"
                  value={saveData.department ? saveData.department.id : ""}
                  onChange={handleDepartmentChange}
                  SelectDisplayProps={{
                    style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                  }}
                >
                  {departments.map((data, index) => (
                    <MenuItem value={data?.id} key={index}>
                      {data?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box width={"50%"}>
              <div className={style.entityLableStyle}>SPECIFIC SITE*</div>
              <FormControl fullWidth size="small">
                <Select
                  labelId="specific-site-checkbox"
                  id="specific-site-checkbox"
                  value={
                    saveData.sites ? saveData.sites.map((item) => item.id) : []
                  }
                  multiple
                  onChange={handleSelectSiteChange}
                  SelectDisplayProps={{
                    style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                  }}
                >
                  {sites.map((data, index) => (
                    <MenuItem value={data?.id} key={index}>
                      {data?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box width={"50%"}>
              <div className={style.entityLableStyle}>APPLICATION TYPE*</div>
              <FormControl fullWidth size="small">
                <Select
                  labelId="application-type-checkbox"
                  id="application-type-checkbox"
                  value={
                    saveData.applicantType ? saveData.applicantType.id : ""
                  }
                  onChange={handleApplicantTypeChange}
                  SelectDisplayProps={{
                    style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                  }}
                >
                  {applicantTypes?.map((data, index) => (
                    <MenuItem value={data?.id} key={index}>
                      {data?.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <div className={`${style.marginTop20} ${style.validation}`}>
            <div className={style.entityLableStyle}>
              PRIVELEGE SPECIFICATION TYPE REQUIRED*
            </div>
            {privilegeSpecifications.map((item) => (
              <div className={`${style.marginLeft40} ${style.validation}`}>
                <FormControlLabel
                  control={
                    <Radio
                      id={item.id}
                      checked={item.value == privilegeSpecificationType}
                      onChange={handlePrivilegeSpecificationChange}
                      value={item.value}
                    />
                  }
                />
                <label>{item.label}</label>
              </div>
            ))}
          </div>

          {privilegeSpecificationType == PrivilegeSpecificationType1 && (
            <div className={`${style.validation} ${style.marginTop20}`}>
              <div className={style.entityLableStyle}>
                PROOF OF DOCUMENTATION REQUIRED?
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isProofOfDocumentRequired}
                      onChange={(e) => {
                        setIsProofOfDocumentRequired(e.target.checked);
                      }}
                      className={classes.switch}
                    />
                  }
                  className={`${style.switchFontStyle}`}
                  label={isProofOfDocumentRequired ? "Yes" : "No"}
                  labelPlacement="start"
                />
              </div>
            </div>
          )}
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              GENERAL INSTRUCTION TEXT
            </div>
            <MarkdownEditor
              editorHtml={generalInstructionContent}
              onChange={(data) =>
                updateSaveData("generalInstructionText", data)
              }
              placeholder={"Enter GENERAL INSTRUCTION Here"}
            />
          </div>
          <div className={`${style.marginTop20} ${style.verticalAlignCenter}`}>
            <div className={style.entityLableStyle}>
              ADVANCED PRIVILEGES REQUIRED?
            </div>
            <div className={style.marginLeft10}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPrivilagesRequired}
                    onChange={(e) => {
                      setPrivilagesRequired(e.target.checked);
                    }}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={isPrivilagesRequired ? "Yes" : "No"}
                labelPlacement="start"
              />
            </div>
            <div></div>
          </div>
          {isPrivilagesRequired && (
            <div className={style.marginTop20}>
              <div className={style.entityLableStyle}>
                ADVANCED PRIVILEGES SECTION INSTRUCTION TEXT
              </div>
              <Editor
                editorHtml={advancePrivilegeContent}
                onChange={(data) =>
                  updateSaveData("advancedInstructionText", data)
                }
                placeholder={
                  "Enter ADVANCED PRIVILEGES SECTION INSTRUCTION Here"
                }
              />
            </div>
          )}
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
