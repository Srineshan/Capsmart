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
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
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
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>DISCLOSURE CATEGORY:</div>
            <input
              className={style.fullWidth}
              value="PROFESSIONAL LICENSING, PRIVILEGE AND MEMBERSHIP HISTORY"
            ></input>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Written Notice Served
            </div>
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
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              INSTRUCTIONAL TEXT//HELP GUIDE
            </div>
            <TextArea
              className={style.fullWidth}
              placeholder="Enter Text Here"
              rows={3}
            />
          </div>
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>DISCLOSURE TEXT</div>
            <TextArea
              className={style.fullWidth}
              placeholder="Enter Text Here"
              rows={3}
            />
          </div>
          <div className={style.formSection}>
            <div className={style.formGroup}>
              <label className={style.label}>RESPONSE OPTIONS:</label>
              <div className={style.radioGroup}>
                <label className={style.radioLabel}>
                  <input type="radio" name="response-options" value="yes-no" />
                  Yes / No
                </label>
                <label className={style.radioLabel}>
                  <input
                    type="radio"
                    name="response-options"
                    value="yes-no-na"
                  />
                  Yes / No / Not Applicable
                </label>
              </div>
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>SUPPORTING DOCUMENTATION:</label>
              <label className={style.switch}>
                <input type="checkbox" />
                <span className={style.slider}></span>
              </label>
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>
                REQUIRES DISCLOSURES VERIFICATION:
              </label>
              <label className={style.switch}>
                <input type="checkbox" checked />
                <span className={style.slider}></span>
              </label>
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

            <div className={style.formGroup}>
              <label className={style.label}>
                RELEASE OF INFORMATION AUTHORIZATION AND CONSENT FORM REQUIRED:
              </label>
              <label className={style.switch}>
                <input type="checkbox" />
                <span className={style.slider}></span>
              </label>
            </div>
          </div>

          <div></div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button className={style.dialogOutlinedButton}>SAVE & EXIT</button>
            <button
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
