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
} from "@blueprintjs/core";
import ArrowDown from "./../../../images/arrowDown.png";
import style from "./../index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../../utils/toaster";
import { POST, GET, PUT, TenantID } from "./../../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, makeStyles } from "@material-ui/core";
import WritingFile from "./../../../images/writing-file.svg";
import Editor from "../common/Editor";

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

const ConsentsDialog = ({
  getAddEntityDialog,
  selectedTermination,
  isSecondary,
  isEdit,
  getTerminationReasonData,
  siteTypeId,
  handleClose,
  open,
  selectedApplicant,
}) => {
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [consentTitle, setConsentTitle] = useState("CONTRACTOR");
  const [consentConsents, setconsentConsents] = useState();
  const [currentApplicantType, setCurrentApplicantType] = useState(
    selectedTermination?.entityId?.id ? selectedTermination?.entityId?.id : ""
  );
  const [alertNote, setAlertNote] = useState(true);
  const [alertNotice, setAlertNotice] = useState("");
  const [signature, setSignature] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    getEntityData();
  }, []);

  const getEntityData = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypes(types);
  };

  const handleEditorChange = (content) => {
    setconsentConsents(content);
  };

  const SaveSubmitHandler = async () => {
    console.log("Current Entity Type:", currentApplicantType);
    console.log("Consent Title:", consentTitle);
    console.log("Consent Contents:", consentConsents);
    console.log("Alert Note Required:", alertNote);
    console.log("Alert Notice:", alertNote);
    console.log("Applicant e-Signature Required:", signature);
    handleClose();
  };

  return (
    <Dialog
      // isOpen={getAddEntityDialog}
      // onClose={() => getAddEntityDialog(false)}
      isOpen={open}
      onClose={handleClose}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>{`Setup your Consent Forms`}</p>
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
                // onClick={() => {
                //   getAddEntityDialog(false);
                //   getTerminationReasonData();
                // }}
                onClick={handleClose}
              />
            </div>
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
            <select
              value={currentApplicantType}
              className={style.fullWidth}
              // rightElement={arrowDown()}
              onChange={(obj) => {
                setCurrentApplicantType(obj.target.value);
              }}
            >
              <option value="">Select Applicant Type</option>
              {applicantTypes.map((type) => (
                <option value={type.applicantType}>{type.applicantType}</option>
              ))}
            </select>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>

          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>CONSENT TITLE*</div>
            <select
              value={consentTitle}
              defaultValue={consentTitle}
              className={style.fullWidth}
              // rightElement={arrowDown()}
              onChange={(obj) => {
                setConsentTitle(obj.target.value);
              }}
            >
              <option value="CONTRACTOR">For Cause By Contractor</option>
              <option value="ENTITY">For Cause By Entity</option>
            </select>
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>CONSENT CONTENTS*</div>
            <Editor
              editorHtml={consentConsents}
              onChange={handleEditorChange}
            />
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Alert Note Required
            </div>
            <div className={style.displayInRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={alertNote}
                    onChange={(e) => setAlertNote(e.target.checked)}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={alertNote ? "YES" : "NO"}
              />
              {alertNote && (
                <div
                  className={`${style.displayInRow} ${style.inputBoxStyle} ${style.fullWidth}`}
                >
                  <InputGroup
                    onChange={(e) => setAlertNotice(e.target.value)}
                    value={alertNotice}
                    className={style.fullWidth}
                    placeholder="Enter Alert Notice Here"
                  ></InputGroup>
                </div>
              )}
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Applicant e-Signature Required
            </div>
            <div
              className={`${style.displayInRow} ${style.displayTerminationPeriod}`}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={signature}
                    onChange={(e) => setSignature(e.target.checked)}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={signature ? "YES" : "NO"}
              />
            </div>
          </div>
        </div>
        <div className={style.marginTop20}>
          <div>
            <div className={style.floatLeft}>
              <button
                className={style.outlinedButton}
                onClick={() => {
                  handleClose();
                  // getAddEntityDialog(false);
                  // getTerminationReasonData();
                }}
              >
                BULK UPLOAD
              </button>
            </div>
            <div className={style.floatRight}>
              <button
                className={style.outlinedButton}
                onClick={() => {
                  handleClose();
                  // getTerminationReasonData();
                }}
              >
                CANCEL
              </button>
              <button
                onClick={() => SaveSubmitHandler("Save & Exit")}
                className={`${style.buttonStyle} ${style.marginLeft20}`}
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ConsentsDialog;
