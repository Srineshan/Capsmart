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
          <div className={`${style.flagBoxContainer} ${style.marginBottom10}`}>
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
          <div className={`${style.flexDisplay} ${style.alignItemsCenter}`}>
            <div
              className={`${style.entityLableStyle} ${style.whiteSpaceNowrap} ${style.marginRight15}`}
            >
              APPLICANT TYPE*
            </div>

            <select
              value={currentEntityType}
              className={`${style.fullWidth} ${style.entityLableStyle}`}
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
            className={`${style.marginTop20} ${style.flexDisplay} ${style.alignItemsCenter} ${style.gap15} ${style.fullWidth}`}
          >
            <div
              className={`${style.flexDisplay} ${style.flexRatio} ${style.width80}`}
            >
              <div
                className={`${style.entityLableStyle} ${style.whiteSpaceWrap} ${style.marginRight5}`}
              >
                DISCLOSURE CATEGORY:
              </div>
              <input
                className={`${style.fullWidth} ${style.padding5} ${style.borderRadius5} ${style.boderColor}`}
                value="PROFESSIONAL LICENSING, PRIVILEGE AND MEMBERSHIP HISTORY"
              />
            </div>
            <div className={`${style.width20} ${style.actions}`}>
              <div className={style.width50}>
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
                  className={`${style.entityLableStyle}`}
                  label={writtenNotice ? "YES" : "NO"}
                />
              </div>
            </div>
          </div>

          <div className={`${style.marginTop20}`}>
            <div
              className={`${style.entityLableStyle} ${style.whiteSpaceWrap}`}
            >
              INSTRUCTIONAL TEXT//HELP GUIDE
            </div>
            <TextArea
              className={`${style.fullWidth} ${style.marginRight210}`}
              placeholder="Enter Text Here"
              rows={3}
            />
          </div>

          <Divider
            className={`${style.height1} ${style.dividerBackground} ${
              style.margin20 - 0
            }`}
          />
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>DISCLOSURE TEXT</div>
            <TextArea
              className={`${style.fullWidth} ${style.entityLableStyle}`}
              placeholder="Enter Text Here"
              rows={3}
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

            <div
              className={`${style.flexDisplay} ${style.alignItemsCenter} ${style.gap313} ${style.entityLableStyle}`}
            >
              <label className={` ${style.entityLableStyle}`}>
                Supporting Documentation:
              </label>
              <FormControlLabel
                control={
                  <Switch
                    checked={supportingDocumentation}
                    onChange={(e) =>
                      setSupportingDocumentation(e.target.checked)
                    }
                    className={classes.switch}
                  />
                }
                className={` ${style.entityLableStyle}`}
                label={writtenNotice ? "YES" : "NO"}
              />
            </div>

            <div
              className={`${style.flexDisplay} ${style.alignItemsCenter} ${style.gap284}`}
            >
              <label className={style.entityLableStyle}>
                Requires Disclosures Verification:
              </label>
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
                className={`${style.entityLableStyle}`}
                label={writtenNotice ? "YES" : "NO"}
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
                    <option value="current-employer">current employer</option>
                    <option value="former-employer">former employer</option>
                  </select>
                </div>
              )}
            </div>

            {/* <div className={style.formGroup}>
              <label className={style.entityLableStyle}>REQUIRED FROM:</label>
              <select className={`${style.select} ${style.entityLableStyle}`}>
                <option value="practising-physician">
                  practising physician
                </option>
                <option value="current-employer">current employer</option>
                <option value="former-employer">former employer</option>
              </select>
            </div> */}

            <div
              className={`${style.flexDisplay} ${style.alignItemsCenter} ${style.gap60}`}
            >
              <label className={style.entityLableStyle}>
                Release of Information Autheorization and Consent Form Required:
              </label>
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
                className={`${style.entityLableStyle}`}
                label={writtenNotice ? "YES" : "NO"}
              />
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
