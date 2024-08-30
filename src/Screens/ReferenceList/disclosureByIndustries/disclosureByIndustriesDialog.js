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
import { Switch, makeStyles } from "@material-ui/core";
import CommonInputField from "../../../Components/CommonFields/CommonInputField";
import WritingFile from "./../../../images/writing-file.svg";
import { BorderAllRounded } from "@material-ui/icons";
import Divider from "@mui/material/Divider";

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
const DisclosureByIndustriesDialog = ({
  handleClose,
  open,
  selectedTermination,
}) => {
  const [terminationBy, setTerminationBy] = useState("Passport Picture");
  const [primaryReason, setPrimaryReason] = useState("");
  const [secondaryReason, setSecondaryReason] = useState("");
  const [currentEntityType, setCurrentEntityType] = useState(
    selectedTermination?.entityId?.id ? selectedTermination?.entityId?.id : ""
  );
  const [entityTypes, setEntityTypes] = useState([]);
  const [createdDate, setCreatedDate] = useState("");
  const [secondaryReasonList, setSecondaryReasonList] = useState([]);
  const [addSubReasons, setAddSubReasons] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("0");
  const [curePeriod, setCurePeriod] = useState("0");
  const [writtenNotice, setWrittenNotice] = useState(true);
  const [subReasonFields, setSubReasonFields] = useState([]);
  const classes = useStyles();
  const [checks, setChecks] = useState({
    documentFormat: true,
    documentType: true,
    nameVerification: true,
  });
  const [selectedOption, setSelectedOption] = useState("mandatory");

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
        <div className={style.spaceBetween}>
          <div
            className={`${style.flagBoxContainer}`}
            style={{ marginBottom: "10px" }}
          >
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
              }
              alt="refresh"
              className={`${style.departmentFlag} ${style.marginRight15}  `}
            />
            <span
              className={`${style.departmentCountryName} ${style.marginLeft10}`}
            >
              USA
            </span>
            <img
              src={ArrowDown}
              className={`${style.colorFileStyle2} ${style.ArrowDown} ${style.marginRight15}`}
              alt=""
            />
          </div>
          <div>
            <p className={style.extensionStyle}>{`Setup your New PoD`}</p>
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className={style.entityLableStyle}
              style={{ whiteSpace: "nowrap", marginRight: "15px" }} // Adjust margin as needed
            >
              APPLICANT TYPE*
            </div>

            <select
              value={currentEntityType}
              className={style.fullWidth}
              rightElement={arrowDown()}
              // onChange={(obj) => {
              //   setCurrentEntityType(obj.target.value);
              // }}
            >
              <option value="">MultiSelect</option>
              {entityTypes.map((type) => (
                <option value={type.siteTypeId}>{type.siteTypeName}</option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "15px",
            }}
            className={style.marginTop20}
          >
            <div style={{ flex: "0 0 auto", width: "80%", display: "flex" }}>
              <div
                style={{
                  whiteSpace: "wrap",
                  marginRight: "5px",
                }}
                className={style.entityLableStyle}
              >
                DISCLOSURE CATEGORY:
              </div>
              <input
                style={{
                  border: "1px solid #dae0dc",
                  borderRadius: "5px",
                  padding: "5px",
                }}
                className={`${style.fullWidth}`}
                value="PROFESSIONAL LICENSING, PRIVILEGE AND MEMBERSHIP HISTORY"
              />
            </div>
            <div
              style={{
                display: "flex",
                width: "20%",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div style={{ width: "50%" }}>
                <div
                  className={`${style.entityLableStyle} ${style.marginTop15}`}
                >
                  ADD SUB CATEGORY
                </div>
              </div>
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={writtenNotice}
                      onChange={(e) => setWrittenNotice(e.target.checked)}
                      className={classes.switch}
                    />
                  }
                  className={`${style.switchFontStyle}`}
                  label={writtenNotice ? "YES" : "NO"}
                />
              </div>
            </div>
          </div>

          <div className={`${style.marginTop20}`}>
            <div
              style={{
                whiteSpace: "wrap",
              }}
              className={style.entityLableStyle}
            >
              INSTRUCTIONAL TEXT//HELP GUIDE
            </div>
            <TextArea
              style={{
                marginRight: "210px",
              }}
              className={style.fullWidth}
              placeholder="Enter Text Here"
              rows={3}
            />
          </div>

          <Divider
            style={{
              margin: "20px 0",
              backgroundColor: "#b3b8bd",
              height: "1px",
            }}
          />
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>DISCLOSURE TEXT</div>
            <TextArea
              className={style.fullWidth}
              placeholder="Enter Text Here"
              rows={3}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                textAlign: "left",
                gap: "30px",
                paddingBottom: "10px",
              }}
            >
              <label>RESPONSE OPTIONS:</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <div
                  className={style.radioLabel}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <input type="radio" name="response-options" value="yes-no" />
                  Yes / No
                </div>
                <div
                  className={style.radioLabel}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
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

            <div
              style={{ display: "flex", gap: "340px", alignItems: "center" }}
            >
              <label className={style.switchLabel}>
                SUPPORTING DOCUMENTATION:
              </label>
              <FormControlLabel
                control={
                  <Switch
                    checked={writtenNotice}
                    onChange={(e) => setWrittenNotice(e.target.checked)}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={writtenNotice ? "YES" : "NO"}
              />
            </div>

            <div
              style={{ display: "flex", gap: "300px", alignItems: "center" }}
            >
              <label className={style.switchLabel}>
                REQUIRES DISCLOSURES VERIFICATION:
              </label>
              <FormControlLabel
                control={
                  <Switch
                    checked={writtenNotice}
                    onChange={(e) => setWrittenNotice(e.target.checked)}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={writtenNotice ? "YES" : "NO"}
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>REQUIRED FROM:</label>
              <select className={style.select}>
                <option value="practising-physician">
                  practising physician
                </option>
                <option value="current-employer">current employer</option>
                <option value="former-employer">former employer</option>
              </select>
            </div>

            <div
              style={{ display: "flex", gap: "102px", alignItems: "center" }}
            >
              <label className={style.switchLabel}>
                RELEASE OF INFORMATION AUTHORIZATION AND CONSENT FORM REQUIRED:
              </label>
              <FormControlLabel
                control={
                  <Switch
                    checked={writtenNotice}
                    onChange={(e) => setWrittenNotice(e.target.checked)}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={writtenNotice ? "YES" : "NO"}
              />
            </div>
          </div>

          <div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "400px" }}>
          <button
            style={{ borderRadius: "10px" }}
            className={`${style.dialogOutlinedButton} ${style.marginTop10}`}
          >
            BULK UPLOAD
          </button>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              style={{ borderRadius: "10px" }}
              className={style.dialogOutlinedButton}
            >
              SAVE & EXIT
            </button>
            <button
              style={{ borderRadius: "10px" }}
              className={`${style.dialogButtonStyle} ${style.marginLeft20}`}
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
