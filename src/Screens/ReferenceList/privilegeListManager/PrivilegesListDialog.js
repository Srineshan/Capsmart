import React, { useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./../index.module.scss";
import { Radio, Switch, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import { Box, Divider } from "@mui/material";
import { POST, GET, PUT } from "./../../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import CommonInputField from "../../../Components/CommonFields/CommonInputField";

const useStyles = makeStyles({
  radio: {
    "&.Mui-checked": {
      color: "#7165e3",
    },
  },
  switch: {
    "& .Mui-checked": {
      color: "#7165e3",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#7165e3 !important",
    },
  },
});

const PrivilegeListDialog = ({
  open,
  handleClose,
  isEdit,
  selectedAcknowledgement,

  tileType,
}) => {
  console.log(isEdit, tileType);

  const [selectedApplicantType, setSelectedApplicantType] = useState([]);
  const [isPrivilagesRequired, setPrivilagesRequired] = useState(false);
  const [applicantTypes, setApplicantTypesState] = useState([]);
  const [sites, setSitesState] = useState([]);
  const [departments, setDepartmentsState] = useState([]);
  const [generalInstructionContent, setGeneralInstructionContent] =
    useState("");
  const [advancePrivilegeContent, setAdvancePrivilegeContent] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const [saveData, setSaveData] = useState({});
  const [isProofOfDocumentRequired, setIsProofOfDocumentRequired] =
    useState(false);
  const [aliasName1, setAliasName1] = useState("");
  const [aliasName2, setAliasName2] = useState("");
  const [writtenNotice, setWrittenNotice] = useState(false);
  const [advancedSwitch, setAdvancedSwitch] = useState(false);
  const [evidenceRequired, setEvidenceRequired] = useState(false);
  const [competencyRequired, setCompetencyRequired] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [applicantType, setApplicantType] = useState([]);
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");

  const [descripition, setDescripition] = useState("");
  const [applicantTypeList, setApplicantTypeList] = useState([]);

  const [privilegeSpecificationType, setPrivilegeSpecificationType] = useState(
    "DescriptiveDocument"
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [privilegeTypeOption, setPrivilegeTypeOption] = useState("Core");
  const [privilegeStatusOption, setPrivilegeStatusOption] = useState("Active");

  const handlePrivilegeTypeChange = (event) => {
    setPrivilegeTypeOption(event.target.value);
  };
  useEffect(() => {
    fetchApplicantTypes();
  }, []);
  const handlePrivilegeStatusChange = (event) => {
    setPrivilegeStatusOption(event.target.value);
  };
  const classes = useStyles();

  const updateSaveData = (property, data) => {
    setSaveData((prev) => ({ ...prev, [property]: data }));
  };

  const handlePrivilegeSpecificationChange = (event) => {
    setPrivilegeSpecificationType(event.target.value);

    setIsProofOfDocumentRequired(false);
  };

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };

  useEffect(() => {
    fetchApplicantTypes();
    fetchSpecificSites();
    fetchDepartments();
  }, []);
  console.log(selectedAcknowledgement);

  console.log(selectedData);
  useEffect(() => {
    if (isEdit && selectedAcknowledgement?.id) {
      console.log(selectedAcknowledgement);

      const fetchData = async () => {
        try {
          const { data: staffPrivilegesForm } = await GET(
            `entity-service/privilegeMaster/${selectedAcknowledgement.id}`
          );
          setSelectedData(staffPrivilegesForm || {});
          setApplicantType({
            id: staffPrivilegesForm.applicantType.id,
            applicantType: staffPrivilegesForm.applicantType.type,
          });
          setTitle(staffPrivilegesForm.title || "");
          setId(staffPrivilegesForm.privilegeId || "");
          setDescripition(staffPrivilegesForm.description || "");
          setPrivilegeTypeOption(
            staffPrivilegesForm.type === "CORE"
              ? "Core"
              : staffPrivilegesForm.type === "RESTRICTED"
              ? "Restricted"
              : "Non-Core"
          );
          setPrivilegeStatusOption(
            staffPrivilegesForm.status === "ACTIVE" ? "Active" : "Retired"
          );
          setEvidenceRequired(staffPrivilegesForm.isevidenceRequired || false);
          setCompetencyRequired(
            staffPrivilegesForm.iscompetencyDisclosureRequired || false
          );
        } catch (error) {
          console.error("Error fetching privileges data:", error);
        }
      };
      fetchData();
    }
  }, [isEdit, selectedAcknowledgement?.id]);
  // const fetchApplicantTypes = async () => {
  //   try {
  //     const response = await GET("entity-service/applicantType");
  //     const applicantTypes = response.data;

  //     if (applicantTypes && applicantTypes.length > 0) {
  //       setApplicantTypesState(applicantTypes);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching applicant types:", error);
  //   }
  // };
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
      console.error("Error fetching departments:", error);
    }
  };

  const fetchSpecificSites = async () => {
    try {
      const response = await GET("entity-service/sites");
      if (Array.isArray(response.data)) {
        const specificSites = response.data.map((site) => ({
          id: site.id,
          name: site.siteName ? site.siteName.siteName : "Unknown",
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
    if (Array.isArray(applicantType) && applicantType.length > 0) {
      let temp = [];
      applicantType.map((data) => {
        temp.push(
          applicantTypeList
            .filter((applicantData) => applicantData?.id === data)
            .map((innerData) => innerData)?.[0]
        );
      });
      console.log(temp);
      setSelectedApplicantType(temp);
    }
  }, [applicantType, applicantTypeList]);

  const resetDialogFields = () => {
    setSaveData({});
    setPrivilegeSpecificationType("DescriptiveDocument");
    setIsProofOfDocumentRequired(false);
    setPrivilagesRequired(false);
    setGeneralInstructionContent("");
    setAdvancePrivilegeContent("");
  };

  const handleAddMoreClick = () => {
    setShowCard(true);
  };

  // const handleApplicantTypeChange = (event) => {
  //   const selected_applicantType = event.target.value;
  //   console.log("selected_applicantType", selected_applicantType);

  //   const selectedType = applicantTypes.find(
  //     (data) => data.applicantType === selected_applicantType
  //   );

  //   if (selectedType) {
  //     console.log(selectedType);

  //     setSelectedApplicantType({
  //       id: selectedType.id,
  //       applicantType: selectedType.type,
  //     });

  //     // Update the saveData state to ensure the correct applicantType is saved
  //     setSaveData((prev) => ({
  //       ...prev,
  //       applicantType: {
  //         id: selectedType.id,
  //         applicantType: selectedType.type,
  //       },
  //     }));
  //   }
  // };
  const handleApplicantTypeChange = (e) => {
    const applicantData = {
      id: e.target.value,
      applicantType: applicantTypes.find((item) => item.id == e.target.value)
        .type,
    };
    setSelectedApplicantType([applicantData]);
    setSaveData((prev) => ({
      ...prev,
      applicantType: [applicantData],
    }));
  };

  const handleSaveAcknowledgementForm = async () => {
    const privilegeTypeMap = {
      Core: "CORE",
      Restricted: "RESTRICTED",
      "Non-Core": "NON_CORE",
    };

    const privilegeStatusMap = {
      Active: "ACTIVE",
      Retired: "RETIRED",
    };

    const data = {
      type: privilegeTypeMap[privilegeTypeOption] || "CORE",
      applicantType: selectedApplicantType,
      status: privilegeStatusMap[privilegeStatusOption] || "ACTIVE",
      privilegeId: id,
      title: title,
      isevidenceRequired: evidenceRequired,
      iscompetencyDisclosureRequired: competencyRequired,
      description: descripition,
    };

    console.log(data);
    if (!isEdit) {
      await POST("entity-service/privilegeMaster", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Acknowledgement Form Added Successfully");
          handleClose(true);
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/privilegeMaster/${selectedAcknowledgement?.id}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Acknowledgement Form Updated Successfully");
          handleClose(true);
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
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
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
            }
            alt="refresh"
            className={`${style.headerFlag}   `}
          />

          <p className={`${style.extensionStyle} ${style.alignItemsCenter}`}>
            Add Staff Privileges
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
                resetDialogFields();
                handleClose();
              }}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={` ${style.validation}`}>
            <div
              className={`${style.entityLableStyle} ${style.marginRight100}`}
            >
              PRIVELEGE TYPE *
            </div>

            <div className={style.flex}>
              <div
                className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
              >
                <FormControlLabel
                  control={
                    <Radio
                      checked={privilegeTypeOption === "Core"}
                      onChange={handlePrivilegeTypeChange}
                      value="Core"
                      sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                      className={classes.radio}
                    />
                  }
                />
                <label>Core</label>
              </div>
              <div
                className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
              >
                <FormControlLabel
                  control={
                    <Radio
                      checked={privilegeTypeOption === "Restricted"}
                      onChange={handlePrivilegeTypeChange}
                      value="Restricted"
                      sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                      className={classes.radio}
                    />
                  }
                />
                <label>Restricted</label>
              </div>
              <div
                className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
              >
                <FormControlLabel
                  control={
                    <Radio
                      checked={privilegeTypeOption === "Non-Core"}
                      onChange={handlePrivilegeTypeChange}
                      value="Non-Core"
                      sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                      className={classes.radio}
                    />
                  }
                />
                <label>Non-Core</label>
              </div>
            </div>
          </div>
          <Box width={"100%"}>
            <div className={style.entityLableStyle}>APPLICATION TYPE*</div>
            {/* <FormControl fullWidth>
              <Select
                labelId="application-type-checkbox"
                id="application-type-checkbox"
                value={selectedAcknowledgement?.applicantType || ""}
                onChange={handleApplicantTypeChange}
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {applicantTypes?.map((data, index) => {
                  console.log("Applicant Type Data:", data); // Log the data here
                  return (
                    <MenuItem value={data?.applicantType} key={index}>
                      {data?.applicantType}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl> */}
            <FormControl fullWidth size="small">
              <Select
                labelId="application-type-checkbox"
                id="application-type-checkbox"
                value={saveData.applicantType ? saveData.applicantType.id : ""}
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

          <div
            className={`${style.Borderthick}  ${style.padding4} ${style.marginTop10}`}
          />
          {privilegeTypeOption === "Core" && (
            <div className={style.marginTop190}>
              <div className={style.entityLableStyle}> CORE PRIVILEGE</div>

              <div>
                <div className={`  ${style.verticalAlignCenter}`}>
                  <div
                    className={`${style.displayInRow}  ${style.entityLableStyle} ${style.marginRight100}`}
                  >
                    PRIVILEGES STATUS*
                  </div>

                  <div className={style.flex}>
                    <div
                      className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={privilegeStatusOption === "Active"}
                            onChange={handlePrivilegeStatusChange}
                            value="Active"
                            sx={{
                              "& .MuiSvgIcon-root": { borderRadius: "50%" },
                            }}
                            className={classes.radio}
                          />
                        }
                      />
                      <label>Active</label>
                    </div>
                    <div
                      className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            checked={privilegeStatusOption === "Retired"}
                            onChange={handlePrivilegeStatusChange}
                            value="Retired"
                            sx={{
                              "& .MuiSvgIcon-root": { borderRadius: "50%" },
                            }}
                            className={classes.radio}
                          />
                        }
                      />
                      <label>Retired</label>
                    </div>
                  </div>
                </div>

                <div className={style.displayIn}>
                  <div className={style.columnLayout}>
                    <div className={style.entityLabelStyle}>PRIVILEGE ID *</div>
                    <CommonInputField
                      placeholder="00"
                      className={style.inputField}
                      fullWidth
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </div>

                  <div className={style.columnLayout}>
                    <div className={style.entityLabelStyle}>
                      PRIVILEGE TITLE *
                    </div>
                    <CommonInputField
                      placeholder="Add Privilege Title"
                      className={style.inputField}
                      fullWidth
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className={style.entityLableStyle}>
                  PRIVILEGE DESCRIPITION
                </div>
                <CommonInputField
                  value={descripition}
                  onChange={(e) => setDescripition(e.target.value)}
                  className={`${style.inputField} `}
                  fullWidth
                />
              </div>
            </div>
          )}
          {privilegeTypeOption === "Restricted" && (
            <div>
              <div className={style.marginTop190}>
                <div className={style.entityLableStyle}>
                  RESTRICTED PRIVILEGE
                </div>

                <div>
                  <div className={`  ${style.verticalAlignCenter}`}>
                    <div className={` ${style.verticalAlignCenter}`}>
                      <div
                        className={`${style.displayInRow}  ${style.entityLableStyle} ${style.marginRight100}`}
                      >
                        PRIVILEGES STATUS*
                      </div>
                      <div className={style.flex}>
                        <div
                          className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={privilegeStatusOption === "Active"}
                                onChange={handlePrivilegeStatusChange}
                                value="Active"
                                sx={{
                                  "& .MuiSvgIcon-root": { borderRadius: "50%" },
                                }}
                                className={classes.radio}
                              />
                            }
                          />
                          <label>Active</label>
                        </div>
                        <div
                          className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={privilegeStatusOption === "Retired"}
                                onChange={handlePrivilegeStatusChange}
                                value="Retired"
                                sx={{
                                  "& .MuiSvgIcon-root": { borderRadius: "50%" },
                                }}
                                className={classes.radio}
                              />
                            }
                          />
                          <label>Retired</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={style.displayIn}>
                    <div className={style.columnLayout}>
                      <div className={style.entityLabelStyle}>
                        PRIVILEGE ID *
                      </div>
                      <CommonInputField
                        placeholder="00"
                        className={style.inputField}
                        fullWidth
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                      />
                    </div>

                    <div className={style.columnLayout}>
                      <div className={style.entityLabelStyle}>
                        PRIVILEGE TITLE *
                      </div>
                      <CommonInputField
                        placeholder="Add Privilege Title"
                        className={style.inputField}
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={style.entityLableStyle}>
                    PRIVILEGE DESCRIPITION
                  </div>
                  <CommonInputField
                    value={descripition}
                    // onChange={(e) => setAliasName2(e.target.value)}
                    className={`${style.inputField} `}
                    fullWidth
                    onChange={(e) => setDescripition(e.target.value)}
                  />
                </div>
              </div>
              <div
                className={`${style.marginTop20} ${style.verticalAlignCenter}`}
              >
                <div className={style.entityLableStyle}>
                  EVIDENCE OF QUALIFICATION AND COMPETENCY
                </div>
                <div className={style.marginLeft10}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={evidenceRequired}
                        onChange={(e) => {
                          setEvidenceRequired(e.target.checked);
                        }}
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                    label={evidenceRequired ? "Yes" : "No"}
                    labelPlacement="start"
                  />
                </div>
              </div>
              <div
                className={`${style.marginTop20} ${style.verticalAlignCenter}`}
              >
                <div className={style.entityLableStyle}>
                  COMPETENCY DISCLOSURE NOTES
                </div>
                <div className={style.marginLeft10}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={competencyRequired}
                        onChange={(e) => {
                          setCompetencyRequired(e.target.checked);
                        }}
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                    label={competencyRequired ? "Yes" : "No"}
                    labelPlacement="start"
                  />
                </div>
                <div></div>
              </div>
            </div>
          )}
          {privilegeTypeOption === "Non-Core" && (
            <div>
              <div className={style.marginTop190}>
                <div className={style.entityLableStyle}>NON CORE PRIVILEGE</div>

                <div>
                  <div className={`  ${style.verticalAlignCenter}`}>
                    <div className={`  ${style.verticalAlignCenter}`}>
                      <div
                        className={`${style.displayInRow}  ${style.entityLableStyle} ${style.marginRight100}`}
                      >
                        PRIVILEGES STATUS*
                      </div>

                      <div className={style.flex}>
                        <div
                          className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={privilegeStatusOption === "Active"}
                                onChange={handlePrivilegeStatusChange}
                                value="Active"
                                sx={{
                                  "& .MuiSvgIcon-root": { borderRadius: "50%" },
                                }}
                                className={classes.radio}
                              />
                            }
                          />
                          <label>Active</label>
                        </div>
                        <div
                          className={`${style.marginLeft40} ${style.flex} ${style.alignItemsCenter}`}
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                checked={privilegeStatusOption === "Retired"}
                                onChange={handlePrivilegeStatusChange}
                                value="Retired"
                                sx={{
                                  "& .MuiSvgIcon-root": { borderRadius: "50%" },
                                }}
                                className={classes.radio}
                              />
                            }
                          />
                          <label>Retired</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={style.displayIn}>
                    <div className={style.columnLayout}>
                      <div className={style.entityLabelStyle}>
                        PRIVILEGE ID *
                      </div>
                      <CommonInputField
                        placeholder="00"
                        className={style.inputField}
                        fullWidth
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                      />
                    </div>

                    <div className={style.columnLayout}>
                      <div className={style.entityLabelStyle}>
                        PRIVILEGE TITLE *
                      </div>
                      <CommonInputField
                        placeholder="Add Privilege Title"
                        className={style.inputField}
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={style.entityLableStyle}>
                    PRIVILEGE DESCRIPITION *
                  </div>
                  <CommonInputField
                    value={descripition}
                    // onChange={(e) => setAliasName2(e.target.value)}
                    className={`${style.inputField} `}
                    fullWidth
                    onChange={(e) => setDescripition(e.target.value)}
                  />
                </div>
              </div>
              <div
                className={`${style.marginTop20} ${style.verticalAlignCenter}`}
              >
                <div className={style.entityLableStyle}>
                  EVIDENCE OF QUALIFICATION AND COMPETENCY
                </div>
                <div className={style.marginLeft10}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={evidenceRequired}
                        onChange={(e) => {
                          setEvidenceRequired(e.target.checked);
                        }}
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                    label={evidenceRequired ? "Yes" : "No"}
                    labelPlacement="start"
                  />
                </div>
              </div>
              <div
                className={`${style.marginTop20} ${style.verticalAlignCenter}`}
              >
                <div className={style.entityLableStyle}>
                  COMPETENCY DISCLOSURE NOTES
                </div>
                <div className={style.marginLeft10}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={competencyRequired}
                        onChange={(e) => {
                          setCompetencyRequired(e.target.checked);
                        }}
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                    label={competencyRequired ? "Yes" : "No"}
                    labelPlacement="start"
                  />
                </div>
                <div></div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`${style.flexDisplay} ${style.alignItemsCenter} ${style.gap400}`}
        >
          <button
            className={`${style.dialogOutlinedButton} ${style.marginTop10} ${style.borderRadius10} `}
          >
            BULK UPLOAD
          </button>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={`${style.dialogOutlinedButton} ${style.borderRadius10}`}
              onClick={() => handleSaveAcknowledgementForm()}
            >
              SAVE & EXIT
            </button>
            <button
              className={`${style.dialogButtonStyle} ${style.marginLeft20} ${style.borderRadius10}`}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PrivilegeListDialog;
