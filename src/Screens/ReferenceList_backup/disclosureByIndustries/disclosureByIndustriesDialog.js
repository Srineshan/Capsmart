import React, { useEffect, useState } from "react";
import {
  Dialog,
  Classes,
  Icon,
  Intent,
  InputGroup,
  RadioGroup,
  Radio,
  Checkbox,
  TextArea,
} from "@blueprintjs/core";
import ArrowDown from "./../../../images/arrowDown.png";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../../utils/toaster";
import { POST, GET, PUT, TenantID } from "./../../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, TextField, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import { BorderAllRounded } from "@material-ui/icons";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked": {
      color: "#06617A",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#06617A !important",
    },
  },
});
const DisclosureByIndustriesDialog = ({
  handleClose,
  open,
  selectedTermination,
  selectedDisclosure,
  isSecondary,
  isEdit,
  getTerminationReasonData,
  siteTypeId,
}) => {
  const TEXTFIELDLEN50 = 50;
  const [terminationBy, setTerminationBy] = useState("Passport Picture");
  const [primaryReason, setPrimaryReason] = useState("");
  const [secondaryReason, setSecondaryReason] = useState("");
  const [currentEntityType, setCurrentEntityType] = useState(
    selectedTermination?.entityId?.id ? selectedTermination?.entityId?.id : ""
  );
  const [terminationId, setTerminationId] = useState(
    selectedTermination?.id ? selectedTermination?.id : ""
  );

  const [entityTypes, setEntityTypes] = useState([]);
  const [createdDate, setCreatedDate] = useState("");
  const [secondaryReasonList, setSecondaryReasonList] = useState([]);
  const [addSubReasons, setAddSubReasons] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("0");
  const [curePeriod, setCurePeriod] = useState("0");
  const [writtenNotice, setWrittenNotice] = useState(true);
  const [supportingDocumentation, setSupportingDocumentation] = useState(true);
  const [requiresDisclosureVerification, setRequiresDisclosureVerification] =
    useState(true);
  const [releaseOfInfoAuthorization, setReleaseOfInfoAuthorization] =
    useState(true);
  const [subReasonFields, setSubReasonFields] = useState([]);
  const classes = useStyles();
  const [checks, setChecks] = useState({
    documentFormat: true,
    documentType: true,
    nameVerification: true,
  });
  const [selectedOption, setSelectedOption] = useState("mandatory");
  const [applicantType, setApplicantType] = useState([]);
  const [siteType, setSiteType] = useState([]);
  const [applicantTypeList, setApplicantTypeList] = useState([]);
  const [siteTypeList, setSiteTypeList] = useState([]);
  const [selectedApplicantType, setSelectedApplicantType] = useState([]);

  const [supportingDocument, setSupportingDocument] = useState(false);
  const [disclosureText, setDisclosureText] = useState("");
  const [instructionalText, setInstructionalText] = useState("");

  useEffect(() => {
    if (isEdit) {
      console.log(selectedDisclosure);
      let temp = [];
      selectedDisclosure?.applicantTypes?.map((data) => {
        temp.push(data?.id);
      });
      setApplicantType(temp);
      setSelectedApplicantType(selectedDisclosure?.applicantTypes);
      setInstructionalText(selectedDisclosure?.instructionalText);
      setDisclosureText(selectedDisclosure?.disclosureText);
      setSupportingDocument(selectedDisclosure?.supportingDocumentRequired);
      setRequiresDisclosureVerification(
        selectedDisclosure.verificationRequired
      );
    }
  }, [selectedDisclosure]);

  useEffect(() => {
    if (applicantType?.length !== 0) {
      let temp = [];
      applicantType?.map((data) => {
        temp.push(
          applicantTypeList
            ?.filter((applicantData) => applicantData?.id === data)
            ?.map((innerData) => innerData)?.[0]
        );
      });
      setSelectedApplicantType(temp);
    }
  }, [applicantType]);

  useEffect(() => {
    getSubReasons();
  }, [secondaryReasonList]);

  const handleSubReasonValue = (i, value) => {
    let temp = secondaryReasonList;
    temp[i] = value;
    setSecondaryReasonList(temp);
    setSecondaryReason(value);
    // getSubReasons();
    // console.log(temp, value, secondaryReasonList);
  };
  const getSubReasons = () => {
    // console.log('entered', secondaryReasonList)
    let temp = [];
    for (let i = 0; i < secondaryReasonList?.length; i++) {
      // console.log(i);
      temp[i] = (
        <div
          className={`${style.editHealthCareGrid2}`}
          key={`${i}${secondaryReasonList[i]}`}
        >
          <div className={style.entityLableStyle}>
            Sub-Reason For Termination {i + 1}*
          </div>
          <div className={style.displayInRow}>
            <InputGroup
              defaultValue={secondaryReasonList[i]}
              className={style.fullWidth}
              onChange={(e) => handleSubReasonValue(i, e.target.value)}
            />
          </div>
        </div>
      );
    }
    setSubReasonFields(temp);
  };

  const handleSaveAcknowledgementForm = async () => {
    // const data = {
    //   applicantTypes: selectedApplicantType,
    //   title: title,
    //   content: {
    //     content: content,
    //   },
    //   file: file,
    //   contentType: "Text",
    //   disclaimer: {
    //     content: disclaimer,
    //   },
    //   einitialRequiredOnEachPage: eInitialRequired,
    //   esignatureRequiredOnEachPage: signatureRequired,
    // };

    // if (!isEdit) {
    //   await POST("entity-service/disclosure", JSON.stringify(data))
    //     .then((response) => {
    //       SuccessToaster("Acknowledgement Form Added Successfully");
    //       handleClose(true);
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // } else {
    //   await PUT(
    //     `entity-service/disclosure/${selectedDisclosure?.id}`,
    //     JSON.stringify(data)
    //   )
    //     .then((response) => {
    //       SuccessToaster("Acknowledgement Form Updated Successfully");
    //       handleClose(true);
    //     })
    //     .catch((error) => {
    //       ErrorToaster(error);
    //     });
    // }
  };

  const handleApplicantTypeChange = (value) => {
    setApplicantType(typeof value === "string" ? value.split(",") : value);
  };
  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };
  const getSiteType = async () => {
    const { data: types } = await GET("entity-service/sites");
    console.log("typestypes", types);
    setSiteTypeList(types);
  };
  const handleSiteTypeChange = (value) => {
    setSiteType(value);
  };

  useEffect(() => {
    getApplicantType();
    getSiteType();
  }, []);

  const arrowDown = () => {
    return (
      <img
        src={ArrowDown}
        className={`${style.colorFileStyle3} ${style.marginRight}`}
        alt=""
      />
    );
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
        <div className={style.spaceBetween} style={{ display: "flex" }}>
          <div>
            <p className={style.extensionStyle}>{`Setup your Disclosure`}</p>
          </div>
          <div>
            <img
              src={WritingFile}
              className={style.dialogCrossStyle}
              alt="Writing File"
            />
          </div>
          <div>
            <Icon
              icon="cross"
              size={30}
              intent={Intent.DANGER}
              className={style.departmentCrossStyle}
              onClick={handleClose}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
            <FormControl className={style.fullWidth} size="small">
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={applicantType}
                onChange={(e) => handleApplicantTypeChange(e.target.value)}
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {applicantTypeList?.map((data, index) => (
                  <MenuItem value={data?.id} key={index}>
                    {data?.applicantType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={`${style.marginTop20}`}>
            <div
              className={style.entityLableStyle}
              style={{ marginRight: "20px" }}
            >
              DISCLOSURE CATEGORY
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "20px" }}>
                <FormControl style={{ width: "300px" }}>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={siteType}
                    onChange={(e) => handleSiteTypeChange(e.target.value)}
                    SelectDisplayProps={{
                      style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                    }}
                  >
                    {siteTypeList.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.siteName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div
                className={`${style.width20} ${style.actions}`}
                style={{ display: "flex" }}
              >
                <div className={style.width50} style={{ marginRight: "40px" }}>
                  <div className={style.entityLableStyle}>ADD SUB CATEGORY</div>
                </div>

                <div style={{ display: "flex" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={writtenNotice}
                        onChange={(e) => setWrittenNotice(e.target.checked)}
                        className={classes.switch}
                      />
                    }
                    className={`${style.entityLableStyle}`}
                    label={writtenNotice ? "YES" : "NO"}
                    style={{ marginRight: "10px" }}
                  />

                  <div
                    style={{
                      marginLeft: "10px",
                      width: writtenNotice ? "150px" : "0",
                      transition: "width 0.3s",
                    }}
                  >
                    {writtenNotice && (
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Enter Sub Category"
                        style={{ width: "150px" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              INSTRUCTIONAL TEXT/HELP GUIDE
            </div>
            <CommonInputField
              value={instructionalText}
              className={style.fullWidth}
              onChange={(e) => setInstructionalText(e.target.value)}
              maxLength={TEXTFIELDLEN50}
              placeholder={"EnterText Here"}
              label={"ACKNOWLEDGEMENT FORM TITLE"}
              required={true}
            />
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>

          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>DISCLOSURE TEXT</div>
            <CommonInputField
              value={disclosureText}
              className={style.fullWidth}
              onChange={(e) => setDisclosureText(e.target.value)}
              maxLength={TEXTFIELDLEN50}
              placeholder={"EnterText Here"}
              label={"ACKNOWLEDGEMENT FORM TITLE"}
              required={true}
            />
          </div>
          <div className={`${style.marginTop20}`}>
            <div
              className={`${style.flexDisplay} ${style.textAlignLeft} ${style.gap30} ${style.paddingBottom10}`}
            >
              <label className={style.entityLableStyle}>
                RESPONSE OPTIONS:
              </label>
              <div
                className={`${style.flexDisplay} ${style.alignItemsCenter} ${style.gap20}`}
              >
                <div
                  className={`${style.radioLabel} ${style.flexDisplay} ${style.alignItemsCenter} ${style.gap8} ${style.entityLableStyle}`}
                >
                  <input type="radio" name="response-options" value="yes-no" />
                  Yes / No
                </div>
                <div
                  className={`${style.radioLabel} ${style.flexDisplay} ${style.alignItemsCenter} ${style.gap8} ${style.entityLableStyle}`}
                >
                  <input
                    type="radio"
                    name="response-option"
                    value="yes-no-na"
                  />
                  Yes / No / Not Applicable
                </div>
              </div>
            </div>

            <div className={`${style.signatureGrid} ${style.marginTop20}`}>
              <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
                Supporting Documentation
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <p style={{ marginRight: "10px" }}>
                    {supportingDocument ? "YES" : "NO"}
                  </p>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={supportingDocument}
                        onChange={(e) =>
                          setSupportingDocument(e.target.checked)
                        }
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                  />
                </div>
              </div>
            </div>
            <div className={`${style.signatureGrid} ${style.marginTop20}`}>
              <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
                Requires Disclosures Verification:
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <p style={{ marginRight: "10px" }}>
                    {requiresDisclosureVerification ? "YES" : "NO"}
                  </p>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={requiresDisclosureVerification}
                        onChange={(e) =>
                          setRequiresDisclosureVerification(e.target.checked)
                        }
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                  />
                  {requiresDisclosureVerification && (
                    <div className={style.formGroup}>
                      <label className={style.entityLableStyle}>
                        REQUIRED FROM:
                      </label>
                      <select
                        className={`${style.select} ${style.entityLableStyle}`}
                      >
                        <option value="practising-physician">
                          practising physician
                        </option>
                        <option value="current-employer">
                          current employer
                        </option>
                        <option value="former-employer">former employer</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`${style.signatureGrid} ${style.marginTop20}`}>
              <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
                Release of Information Autheorization and Consent Form Required:
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <p style={{ marginRight: "10px" }}>
                    {releaseOfInfoAuthorization ? "YES" : "NO"}
                  </p>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={releaseOfInfoAuthorization}
                        onChange={(e) =>
                          setReleaseOfInfoAuthorization(e.target.checked)
                        }
                        className={classes.switch}
                      />
                    }
                    className={`${style.switchFontStyle}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div></div>
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

export default DisclosureByIndustriesDialog;
