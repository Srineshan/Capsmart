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

export const disCosureDialog = ({
    handleClose,
    open,
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
                // rightElement={arrowDown()}
                onChange={(obj) => {
                  setCurrentEntityType(obj.target.value);
                }}
              >
                <option value="">MultiSelect</option>
                {entityTypes.map((type) => (
                  <option value={type.siteTypeId}>{type.siteTypeName}</option>
                ))}
              </select>
            </div>
            <div className={`${style.marginTop20}`}>
              <div className={style.entityLableStyle}>DOCUMENT TYPE</div>
              <select
                value={terminationBy}
                defaultValue={terminationBy}
                className={style.fullWidth}
                // rightElement={arrowDown()}
                onChange={(obj) => {
                  setTerminationBy(obj.target.value);
                }}
              >
                <option value="CONTRACTOR">For Cause By Contractor</option>
                <option value="ENTITY">For Cause By Entity</option>
              </select>
            </div>
            <div className={`${style.marginTop20}`}>
              <div className={style.entityLableStyle}>DOCUMENT TYPE</div>
              <CommonInputField
                className={style.fullWidth}
                placeholder="PassPort Picture"
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
              <div className={style.entityLableStyle}>VERIFICATION CHECK</div>
              <div className={style.flex}>
                <div className={`${style.marginLeft10} ${style.flex}`}>
                  <input
                    type="checkbox"
                    checked={checks.documentFormat}
                    onChange={handleCheckboxChange}
                  />
                  <label className={style.marginLeft10}>
                    Document Format Check
                  </label>
                </div>
                <div className={`${style.marginLeft10} ${style.flex}`}>
                  <input
                    type="checkbox"
                    checked={checks.documentType}
                    onChange={handleCheckboxChange}
                  />
                  <label className={style.marginLeft10}>Document Type</label>
                </div>
                <div className={`${style.marginLeft10} ${style.flex}`}>
                  <input
                    type="checkbox"
                    checked={checks.nameVerification}
                    onChange={handleCheckboxChange}
                  />
                  <label className={style.marginLeft10}>Name Verification</label>
                </div>
              </div>
            </div>
            <div className={`${style.marginTop20}`}>
              <div className={style.entityLableStyle}>VALIDATION CHECK</div>
              <div className={style.validation}>
                <div className={`${style.marginLeft10} ${style.flex}`}>
                  <input
                    type="checkbox"
                    checked={checks.documentFormat}
                    onChange={handleCheckboxChange}
                  />
                  <label className={style.marginLeft10}>
                    Document Expiration
                  </label>
                </div>
                <div className={`${style.marginLeft10} ${style.flex}`}>
                  <input
                    type="checkbox"
                    checked={checks.documentType}
                    onChange={handleCheckboxChange}
                  />
                  <label className={style.marginLeft10}>Document Expiry in</label>
                </div>
                <select
                  value={3}
                  className={style.marginLeft10}
                  style={{ borderRadius: "0", width: "70px" }} // Adjust the width as needed
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
                <select
                  value={3}
                  className={style.marginLeft10}
                  style={{ borderRadius: "0", width: "90px" }} // Adjust the width as needed
                >
                  <option value={1}>Month</option>
                  <option value={2}>Day</option>
                </select>
              </div>
              <div className={`${style.marginTop20}`}>
                <div className={style.entityLableStyle}>Requirement</div>
                <div className={style.flex}>
                  <div className={`${style.marginLeft40} ${style.flex}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedOption === "mandatory"}
                          onChange={handleChange}
                          value="mandatory"
                          sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                        />
                      }
                    />
                    <label>Mandatory</label>
                  </div>
                  <div className={`${style.marginLeft40} ${style.flex}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedOption === "recommended"}
                          onChange={handleChange}
                          value="recommended"
                          sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                        />
                      }
                    />
                    <label>Recommened</label>
                  </div>
                  <div className={`${style.marginLeft40} ${style.flex}`}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedOption === "optional"}
                          onChange={handleChange}
                          value="optional"
                          sx={{ "& .MuiSvgIcon-root": { borderRadius: "50%" } }}
                        />
                      }
                    />
                    <label>Optional</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.flex}>
              <div>
                <div className={style.entityLableStyle}>ALLOWED FORMAT</div>
                <select
                  value={currentEntityType}
                  rightElement={arrowDown()}
                  style={{ borderRadius: "0", width: "250px" }}
                >
                  <option value="">PNG/jpeg</option>
                </select>
              </div>
              <div className={style.marginLeft10}>
                <div className={style.entityLableStyle}>MAX SIZE ALLOWED:</div>
                <select
                  value={currentEntityType}
                  rightElement={arrowDown()}
                  style={{ borderRadius: "0", width: "250px" }}
                >
                  <option value="">5 MB</option>
                </select>
              </div>
            </div>
  
            <div></div>
          </div>
          <div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
              <button
                className={style.dialogOutlinedButton}
              >
                SAVE & EXIT
              </button>
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
  