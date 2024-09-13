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
import CommonInputField from "../../../Components/CommonFields/CommonInputField";
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

const ConsentsDialog = ({
  getAddEntityDialog,
  selectedTermination,
  isSecondary,
  isEdit,
  getTerminationReasonData,
  siteTypeId,
  handleClose,
  open,
  selectedConsent,
}) => {
  const [entityTypes, setEntityTypes] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);
  const [consentTitle, setConsentTitle] = useState("");
  const [consent, setConsent] = useState();
  const [currentApplicantType, setCurrentApplicantType] = useState({
    id: "",
    applicantType: "",
  });
  const [selectedApplicantType, setSelectedApplicantType] = useState([]);
  const [applicantType, setApplicantType] = useState([]);
  const [applicantTypeList, setApplicantTypeList] = useState([]);

  const [alertNote, setAlertNote] = useState(true);
  const [alertNotice, setAlertNotice] = useState("");
  const [signatureRequired, setSignatureRequired] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    getEntityData();
    getApplicantType();
  }, []);

  useEffect(() => {
    if (isEdit) {
      let temp = [];
      selectedConsent?.applicantTypes?.map((data) => {
        temp.push(data?.id);
      });
      setApplicantType(temp);
      setSelectedApplicantType(selectedConsent?.applicantTypes);
      setApplicantTypes(selectedConsent?.title);
      setConsent(selectedConsent?.content);
      setAlertNote(selectedConsent?.alertNoteRequired);
      setAlertNotice(selectedConsent?.alertNote);
      setSignatureRequired(selectedConsent?.esignatureRequired);
    }
  }, [selectedConsent]);

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

  const getEntityData = async () => {
    const { data: types } = await GET("entity-service/entity/entityType");
    setEntityTypes(types);
  };

  const getApplicantType = async () => {
    const { data: types } = await GET("entity-service/applicantType");
    setApplicantTypeList(types);
  };

  const getContentValue = (data) => {
    setConsent(data);
    console.log(data);
  };

  const handleSaveConsentForm = async () => {
    console.log(currentApplicantType);

    const data = {
      applicantType: {
        id: currentApplicantType.id,
        applicantType: currentApplicantType.applicantType,
      },
      title: consentTitle,
      content: consent,
      alertNote: alertNotice,
      esignatureRequired: signatureRequired,
      alertNoteRequired: alertNote,
    };

    console.log(data);
    if (!isEdit) {
      await POST("entity-service/consentForm", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Consent Form Added Successfully");
          handleClose(true);
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/consentForm/${selectedConsent?.id}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Consent Form Updated Successfully");
          handleClose(true);
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
  };

  const handleEditorChange = (content) => {
    setConsent(content);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    const selectedType = applicantTypeList.find(
      (type) => type.id === selectedValue
    );
    if (selectedType) {
      setCurrentApplicantType({
        id: selectedType.id,
        applicantType: selectedType.applicantType,
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
                onClick={handleClose}
              />
            </div>
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div>
            <div className={style.entityLableStyle}>APPLICANT TYPE*</div>
            {/* <select
              value={currentApplicantType.id}
              className={style.fullWidth}
              onChange={handleChange}
            >
              <option value="">Select Applicant Type</option>
              {applicantTypeList.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.applicantType}
                </option>
              ))}
            </select> */}
            <FormControl fullWidth size="small">
              <Select
                labelId="consents-type-checkbox"
                id="consents-type-checkbox"
                value={currentApplicantType.id}
                onChange={handleChange}
                SelectDisplayProps={{
                  style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 },
                }}
              >
                {applicantTypeList?.map((type, index) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.applicantType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>

          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>CONSENT TITLE*</div>
            <CommonInputField
              value={consentTitle}
              defaultValue={consentTitle}
              className={style.fullWidth}
              placeholder="Enter Consent Title Here"
              onChange={(obj) => {
                setConsentTitle(obj.target.value);
              }}
            />
          </div>
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>CONSENT CONTENTS*</div>
            <Editor editorHtml={consent} onChange={handleEditorChange} />
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
                    checked={signatureRequired}
                    onChange={(e) => setSignatureRequired(e.target.checked)}
                    className={classes.switch}
                  />
                }
                className={`${style.switchFontStyle}`}
                label={signatureRequired ? "YES" : "NO"}
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
                }}
              >
                CANCEL
              </button>
              <button
                onClick={() => handleSaveConsentForm()}
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
