import React, { useEffect, useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  TextArea,
  InputGroup,
  Button,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import style from "./../index.module.scss";
import { GET, POST, PUT, TenantID } from "../../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import WritingFile from "./../../../images/writing-file.svg";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, makeStyles } from "@material-ui/core";
import { Box } from "@mui/material";
import Chip from "@mui/material/Chip";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PreviewDialog from "./PreviewDialog";

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

const CheckListDialog = ({ open, handleClose, isEdit, selectedApplicant }) => {
  const [isConstraintsRequired, setIsConstraintsRequired] = useState(false);
  const [activityTitle, setActivityTitle] = useState("");
  const [promptLabel, setPromptLabel] = useState("");
  const [applicantTypes, setApplicantTypesState] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [sendAsType, setSendAsType] = useState("");
  const [isProofOfDocumentRequired, setIsProofOfDocumentRequired] =
    useState(false);
  const [isCompletionDependant, setIsCompletionDependant] = useState(false);

  const [selectedValue, setSelectedValue] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const sites = [
    { id: 1, name: "Send notification email" },
    { id: 2, name: "Site B" },
    { id: 3, name: "Site C" },
  ];

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const SendAsType1 = "Secure Email";
  const SendAsType2 = "Standard Email";

  const sendAs = [
    {
      id: "Secure_Email",
      value: SendAsType1,
      label: "Secure Email",
    },
    {
      id: "Standard_Email",
      value: SendAsType2,
      label: "Standard Email",
    },
  ];

  const classes = useStyles();

  useEffect(() => {
    fetchApplicantTypes();
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
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleSendAsTypeChange = (event) => {
    setSendAsType(event.target.value);
    setIsProofOfDocumentRequired(false);
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
          <p className={style.extensionStyle}>{`Add New Applicant Type For`}</p>
          <div className={`${style.floatRight} ${style.imageSpaceAlignment}`}>
            <img
              src={WritingFile}
              className={style.dialogCrossStyle}
              alt="Writing File"
            />
            <div>
              <Icon
                icon="cross"
                size={30}
                intent={Intent.DANGER}
                className={style.dialogCrossStyle}
                onClick={() => {
                  handleClose();
                }}
              />
            </div>
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
            <FormControl fullWidth size="small">
              <Select
                labelId="department-service-select"
                id="department-service-select"
                value={selectedValues}
                onChange={handleChange}
                multiple
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
                renderValue={() => "Select Applicant Type"} // Keep placeholder when nothing selected
              >
                {applicantTypes.map((data, index) => (
                  <MenuItem value={data?.id} key={index}>
                    {data?.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedValues.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedValues.map((value) => (
                  <Chip
                    key={value}
                    label={
                      applicantTypes.find((type) => type.id === value)?.type ||
                      ""
                    }
                    sx={{
                      backgroundColor: "#EDE7F6", // Light purple background
                      color: "#673AB7", // Dark purple text color
                      borderRadius: "4px",
                      fontSize: "13px",
                      padding: "0px 5px",
                    }}
                    onDelete={() => {
                      setSelectedValues(
                        selectedValues.filter((val) => val !== value)
                      );
                    }}
                    deleteIcon={<span style={{ fontSize: "14px" }}>✖</span>}
                  />
                ))}
              </Box>
            )}
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              DEPARTMENT/SERVICE AREA*
            </div>
            <CommonInputField
              value={""}
              className={style.fullWidth}
              multiple
              placeholder={"select Department/Service Area"}
              required={true}
            />
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              ACTION REQUIRED TO COMPLETE TASK
            </div>
            <FormControl fullWidth size="small">
              <Select
                labelId="department-service-select"
                id="department-service-select"
                value={selectedValue}
                onChange={handleSelectChange}
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {sites.map((data) => (
                  <MenuItem value={data.id} key={data.id}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={`${style.validation} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              ARE THERE ANY CONSTRAINTS FOR THIS TASK
            </div>
            <div>
              <FormControlLabel
                control={
                  <Switch
                    checked={isConstraintsRequired}
                    onChange={(e) => {
                      setIsConstraintsRequired(e.target.checked);
                    }}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={isConstraintsRequired ? "Yes" : "No"}
                labelPlacement="start"
              />
            </div>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          {selectedValue === 1 && (
            <>
              <Box display={"flex"} gap={3}>
                <Box width={"50%"} key={"department-service"}>
                  <div className={style.entityLableStyle}>
                    TASK/ACTIVITY TITLE *
                  </div>
                  <CommonInputField
                    value={activityTitle}
                    className={style.fullWidth}
                    onChange={(e) => setActivityTitle(e.target.value)}
                    placeholder={"Send Email To Switchboard"}
                    required={true}
                  />
                </Box>
                <Box width={"50%"}>
                  <div className={style.entityLableStyle}>
                    ACTIVITY EXECUTION PROMPT LABEL*
                  </div>
                  <CommonInputField
                    value={promptLabel}
                    className={style.fullWidth}
                    onChange={(e) => setPromptLabel(e.target.value)}
                    placeholder={"Send To Switchboard"}
                    required={true}
                  />
                </Box>
              </Box>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  SELECT EMAIL ADDRESSES TO SEND TO*
                </div>
                <CommonInputField
                  value={""}
                  className={style.fullWidth}
                  multiple
                  placeholder={"name@gmail.com"}
                  required={true}
                />
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>
                  SELECT EMAIL ADDRESSES TO SEND CC*
                </div>
                <CommonInputField
                  value={""}
                  className={style.fullWidth}
                  multiple
                  placeholder={"Enter email address to cc"}
                  required={true}
                />
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL SUBJECT*</div>
                <Box display={"flex"} gap={3}>
                  <Box width={"50%"}>
                    <CommonInputField
                      value={""}
                      multiple
                      placeholder={"Swichboard Notification"}
                      required={true}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                  <p>FOR[APPLICANT NAME]</p>
                </Box>
              </div>
              <div className={style.marginTop20}>
                <div className={style.entityLableStyle}>EMAIL CONTENTENTS*</div>
                <CKEditor editor={ClassicEditor} />
              </div>
              <div className={`${style.marginTop20} ${style.validation}`}>
                <div className={style.entityLableStyle}>SEND AS*</div>
                {sendAs.map((item) => (
                  <div className={`${style.marginLeft40} ${style.validation}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          id={item.id}
                          checked={item.value == sendAsType}
                          onChange={handleSendAsTypeChange}
                          value={item.value}
                        />
                      }
                    />
                    <label>{item.label}</label>
                  </div>
                ))}
              </div>
              {sendAsType == SendAsType2 && (
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

              <div
                className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
              ></div>
              <div className={style.marginTop20}>
                <p>
                  NOTE: Activity/Task Status Completion will be captured
                  automatically by the system when the user executes the
                  required action.
                </p>
              </div>
              <div className={`${style.validation} ${style.marginTop20}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className={style.entityLableStyle}>
                    Task Completion Dependant Note Capture
                  </div>
                  <div className={style.marginLeft40}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isCompletionDependant}
                          onChange={(e) => {
                            setIsCompletionDependant(e.target.checked);
                          }}
                          className={classes.switch}
                        />
                      }
                      className={`${style.switchFontStyle}`}
                      label={isCompletionDependant ? "Yes" : "No"}
                      labelPlacement="start"
                    />
                  </div>
                  {isCompletionDependant && (
                    <div
                      className={`${style.marginLeft40} ${style.marginTop20}`}
                    >
                      <div className={style.entityLableStyle}>NOTE LABEL</div>
                      <CommonInputField
                        value={""}
                        placeholder={"Outlook ID"}
                        required={true}
                      />
                      <div className={style.entityLableStyle}>
                        DISPLAY OPTION
                      </div>
                      <FormControl fullWidth size="small">
                        <Select
                          labelId="department-service-select"
                          id="department-service-select"
                          value={"In Task/Activity Bar"}
                          SelectDisplayProps={{
                            style: {
                              paddingTop: 5,
                              paddingBottom: 5,
                              fontSize: 15,
                            },
                          }}
                        ></Select>
                      </FormControl>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className={`${style.marginTop20} `} style={{ float: "left" }}>
            <button
              className={`${style.outlinedButton} ${style.borderRadius10}`}
              onClick={() => setPreviewOpen(true)}
            >
              PREVIEW
            </button>
          </div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={`${style.outlinedButton} ${style.borderRadius10}`}
            >
              SAVE & EXIT
            </button>
            <button
              className={`${style.buttonStyle} ${style.marginLeft20} ${style.borderRadius10}`}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
      <PreviewDialog
        open={previewOpen}
        handleClose={() => setPreviewOpen(false)}
      />
    </Dialog>
  );
};

export default CheckListDialog;
