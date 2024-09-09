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
  selectedTermination,
  selectedApplicant,
  isSecondary,
  siteTypeId,
}) => {
  const [selectedType, setSelectedType] = useState("basic");
  const [proofRequired, setProofRequired] = useState(true);
  const [isPrivilagesRequired, setPrivilagesRequired] = useState(false);
  const [industryTypes, setIndustryType] = useState("");
  const [instructionText, setInstructionText] = useState("");
  const [privileges, setPrivileges] = useState({
    privilegeId: "Surgical Services",
    privilegeTitle: "",
    privilegeDescrition: "",
  });
  const [applicantTypes, setApplicantTypesState] = useState([]);
  const [sites, setSitesState] = useState([]);
  const [departments, setDepartmentsState] = useState([]);

  const [currentEntityType, setCurrentEntityType] = useState(
    selectedTermination?.entityId?.id ? selectedTermination?.entityId?.id : ""
  );

  const [selectedOption, setSelectedOption] = useState("");
  const [terminationId, setTerminationId] = useState(
    selectedTermination?.id ? selectedTermination?.id : ""
  );
  const [createdDate, setCreatedDate] = useState("");

  const [saveData, setSaveData] = useState({});

  const classes = useStyles();

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
      setPrivilagesRequired(selectedApplicant.toggleState || false);
      setInstructionText(selectedApplicant.instructionText || "");
    }
  }, [isEdit, selectedApplicant]);

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
    console.log(saveData);
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
          <Box display={"flex"} gap={3}>
            <Box width={"50%"}>
              <div className={style.entityLableStyle}>DEPARTMENT/SERVICE *</div>
              <FormControl fullWidth size="small">
                <Select
                  labelId="department-service-select"
                  id="department-service-select"
                  value={
                    isEdit
                      ? selectedApplicant.departmentName
                      : saveData.department
                      ? saveData.department.id
                      : ""
                  }
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
                    isEdit && selectedApplicant
                      ? selectedApplicant.siteType
                      : saveData.sites
                      ? saveData.sites.map((item) => item.id)
                      : []
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
                    isEdit && selectedApplicant
                      ? selectedApplicant.entityType
                      : saveData.applicantType
                      ? saveData.applicantType.id
                      : ""
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
            <div className={`${style.marginLeft40} ${style.validation}`}>
              <FormControlLabel
                control={
                  <Radio
                    checked={selectedOption === "Discreet Item List"}
                    onChange={handleChange}
                    value="Discreet Item List"
                    sx={{
                      "& .MuiSvgIcon-root": {
                        borderRadius: "50%",
                        color: "blue",
                      },
                    }}
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
              GENERAL INSTRUCTION TEXT
            </div>
            <Editor />
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
                    onChange={(e) => setPrivilagesRequired(e.target.checked)}
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
              <Editor />
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
