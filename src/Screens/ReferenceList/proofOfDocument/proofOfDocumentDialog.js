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

const ProofOfDocumentDialog = ({
  selectedTermination,
  isSecondary,
  isEdit,
  handleClose,
  open,
  documents,
  selectedApplicant,
}) => {
  const [documentName, setDocumentName] = useState("");
  const [selectedOption, setSelectedOption] = useState("mandatory");
  const [allowedFormat, setAllowedFormat] = useState("PNG");
  const [maxSizeAllowed, setMaxSizeAllowed] = useState("5 MB");
  const [days, setDays] = useState(3);
  const [timePeriod, setTimePeriod] = useState("Month");

  const [terminationId, setTerminationId] = useState(
    selectedTermination?.id ? selectedTermination?.id : ""
  );
  const [terminationBy, setTerminationBy] = useState("Passport Picture");
  const [primaryReason, setPrimaryReason] = useState("");
  const [secondaryReason, setSecondaryReason] = useState("");
  const [newApplicantType, setNewApplicantType] = useState({
    id: "",
    applicantType: "",
  });
  const [currentEntityType, setCurrentEntityType] = useState(
    selectedTermination?.entityId?.id ? selectedTermination?.entityId?.id : ""
  );
  const [helpText, setHelpText] = useState("");
  const [checks, setChecks] = useState({
    documentFormatCheck: true,
    documentNameValidation: true,
    documentTypeCheck: true,
  });

  const [entityTypes, setEntityTypes] = useState([]);
  const [createdDate, setCreatedDate] = useState("");
  const [secondaryReasonList, setSecondaryReasonList] = useState([]);
  const [addSubReasons, setAddSubReasons] = useState(false);
  const [noticePeriod, setNoticePeriod] = useState("0");
  const [curePeriod, setCurePeriod] = useState("0");
  const [writtenNotice, setWrittenNotice] = useState(true);
  const [subReasonFields, setSubReasonFields] = useState([]);
  const classes = useStyles();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prevChecks) => ({
      ...prevChecks,
      [name]: checked,
    }));
  };

  useEffect(() => {
    getEntityData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      setCurrentEntityType(selectedApplicant.applicantTypes);
      setDocumentName(selectedApplicant.documentName);
      setTerminationBy(selectedTermination?.terminationBy);
      setHelpText(selectedTermination?.helpText);
      setChecks({
        documentFormatCheck:
          selectedApplicant.documentFormatCheck ??
          selectedApplicant.documentFormatCheck,

        documentNameValidation: selectedApplicant.documentNameValidation || "",
        documentTypeCheck:
          selectedApplicant.documentTypeCheck ??
          selectedApplicant.documentTypeCheck,
      });
      setPrimaryReason(selectedTermination?.primary_reason);
      setCreatedDate(selectedTermination?.createdDate);
      setNoticePeriod(selectedTermination?.noticePeriodInDays);
      setCurePeriod(selectedTermination?.curePeriodInDays);
      setWrittenNotice(selectedTermination?.writtenNoticeServed);
      setSecondaryReasonList(selectedTermination?.secondary_reasons);
      setAddSubReasons(
        selectedTermination?.secondary_reasons?.length > 0 ? true : false
      );
      if (isSecondary) {
        setSecondaryReason(selectedTermination?.secondary_reasons[0]);
      }
    }
  }, [selectedTermination]);

  useEffect(() => {
    getSubReasons();
  }, [secondaryReasonList]);

  const getEntityData = async () => {
    const { data: types } = await GET("entity-service/entity/entityType");
    setEntityTypes(types);
  };

  const handleSubReasonValue = (i, value) => {
    let temp = secondaryReasonList;
    temp[i] = value;
    setSecondaryReasonList(temp);
    setSecondaryReason(value);
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

  const SaveSubmitHandler = async (isSaveAndExit) => {
    const sizeValue = parseInt(maxSizeAllowed);
    if (isNaN(sizeValue)) {
      ErrorToaster("Invalid Max Size Allowed");
      return;
    }

    const unit = maxSizeAllowed.includes("MB") ? "MB" : "KB";

    const data = {
      tenant: {
        id: TenantID, // Make sure TenantID is valid
      },
      applicantTypes: [
        {
          id: newApplicantType.id,
          applicantType: newApplicantType.applicantType,
        },
      ],
      documentName: documentName || "Document Name",
      documentType: terminationBy || "Document Type",
      helpText: helpText || "",
      requirementLevel: selectedOption.toUpperCase(),
      documentValidator: {
        documentFormatCheck: checks.documentFormat,
        documentTypeCheck: checks.documentType,
        documentNameValidation: checks.nameVerification,
      },
      validationCheck: {
        documentExpiration: checks.documentExpiration,
        documentExpiry: {
          days: days, // Ensure this is a number
          timePeriod: timePeriod.toUpperCase(), // This should be a valid string like "MONTH" or "YEAR"
        },
      },
      format: allowedFormat || "JPEG", // Format should be a string
      size: {
        size: sizeValue, // This should be a number
        unit: unit, // This should be "MB" or "KB"
      },
    };

    if (!isEdit) {
      await POST("entity-service/document", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("document Added Successfully");
          handleClose();
          if (isSaveAndExit) {
            handleClose(true);
          }
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      var id = selectedApplicant.id;
      await PUT(`entity-service/document/${id}`, JSON.stringify(data))
        .then((response) => {
          SuccessToaster("document Updated Successfully");
          handleClose();
          if (isSaveAndExit) {
            handleClose(true);
          }
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }
  };

  const handleAddMore = () => {
    let temp = secondaryReasonList;
    temp.push("");
    // console.log(temp);
    setSecondaryReasonList(temp);
    getSubReasons();
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

  const handleAddSubReasons = (checked) => {
    setAddSubReasons(checked);
    if (checked && secondaryReasonList?.length === 0) {
      handleAddMore();
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
          <div
            className={`${style.flagBoxContainer}`}
            style={{ marginBottom: "10px" }}
          >
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
              }
              alt="USA Flag"
              className={`${style.departmentFlag} ${style.marginRight15}`}
            />
            <span
              className={`${style.departmentCountryName} ${style.marginLeft10}`}
            >
              USA
            </span>
            <img
              src={ArrowDown}
              className={`${style.colorFileStyle2} ${style.ArrowDown} ${style.marginRight15}`}
              alt="Dropdown Arrow"
            />
          </div>
          <div>
            <p className={style.extensionStyle}>Setup your New PoD</p>
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
              value={newApplicantType.applicantType}
              className={style.fullWidth}
              onChange={(e) => {
                const selectedOption = e.target.options[e.target.selectedIndex];
                if (selectedOption) {
                  const id = selectedOption.getAttribute("data-id");
                  const applicantType = selectedOption.value;
                  setNewApplicantType({ id, applicantType });
                }
              }}
            >
              <option value="">MultiSelect</option>
              {documents.length > 0 &&
                documents.map((document) =>
                  document.applicantTypes.map((applicant) => (
                    <option
                      key={applicant.id}
                      value={
                        selectedApplicant
                          ? selectedApplicant.applicantTypes
                              ?.map((item) => item.applicantType)
                              .join(", ")
                          : applicant.applicantType
                      }
                      data-id={applicant.id}
                    >
                      {applicant.applicantType}
                    </option>
                  ))
                )}
            </select>
          </div>
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>DOCUMENT TYPE</div>
            <select
              value={terminationBy}
              className={style.fullWidth}
              onChange={(e) => setNewApplicantType(e.target.value)}
            >
              {documents.map((document) => (
                <option
                  key={document.documentType}
                  value={document.documentType}
                >
                  {document.documentType}
                </option>
              ))}
            </select>
          </div>
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>DOCUMENT NAME</div>
            <CommonInputField
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className={style.fullWidth}
              placeholder="PassPort Picture"
            />
          </div>
          <div className={`${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              INSTRUCTIONAL TEXT//HELP GUIDE
            </div>
            <TextArea
              value={helpText}
              onChange={(e) => setHelpText(e.target.value)}
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
                  checked={checks.documentFormatCheck}
                  onChange={(e) =>
                    setChecks({
                      ...checks,
                      documentFormatCheck: e.target.checked,
                    })
                  }
                />
                <label className={style.marginLeft10}>
                  Document Format Check
                </label>
              </div>
              <div className={`${style.marginLeft10} ${style.flex}`}>
                <input
                  type="checkbox"
                  checked={checks.documentTypeCheck}
                  onChange={(e) =>
                    setChecks({
                      ...checks,
                      documentTypeCheck: e.target.checked,
                    })
                  }
                />
                <label className={style.marginLeft10}>Document Type</label>
              </div>
              <div className={`${style.marginLeft10} ${style.flex}`}>
                <input
                  type="checkbox"
                  checked={checks.documentNameValidation}
                  onChange={(e) =>
                    setChecks({
                      ...checks,
                      documentNameValidation: e.target.checked,
                    })
                  }
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
                  checked={checks.documentExpiration}
                  onChange={(e) =>
                    setChecks({
                      ...checks,
                      documentExpiration: e.target.checked,
                    })
                  }
                />
                <label className={style.marginLeft10}>
                  Document Expiration
                </label>
              </div>
              <div className={`${style.marginLeft10} ${style.flex}`}>
                <input
                  type="checkbox"
                  checked={checks.documentType}
                  onChange={(e) =>
                    setChecks({ ...checks, documentType: e.target.checked })
                  }
                />
                <label className={style.marginLeft10}>Document Expiry in</label>
              </div>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{ borderRadius: "0", width: "70px" }}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                style={{ borderRadius: "0", width: "90px" }}
              >
                <option value="Month">Month</option>
                <option value="Day">Day</option>
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
                  <label>Recommended</label>
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
                value={allowedFormat}
                onChange={(e) => setAllowedFormat(e.target.value)}
                style={{ borderRadius: "0", width: "250px" }}
              >
                <option value="PNG">PNG</option>
              </select>
            </div>
            <div className={style.marginLeft10}>
              <div className={style.entityLableStyle}>MAX SIZE ALLOWED:</div>
              <select
                value={maxSizeAllowed}
                onChange={(e) => setMaxSizeAllowed(e.target.value)}
                style={{ borderRadius: "0", width: "250px" }}
              >
                <option value="5 MB">5 MB</option>
              </select>
            </div>
          </div>
          {addSubReasons && (
            <>
              <div className={`${style.addHealthCareBoxStyle}`}>
                {subReasonFields}
              </div>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <div></div>
                {secondaryReasonList[secondaryReasonList.length - 1] !== "" ? (
                  <div
                    className={`${style.buttonStyle3} ${style.addMoreCardStyle} ${style.borderRadius10}`}
                    onClick={() => handleAddMore()}
                  >
                    ADD MORE
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={`${style.dialogOutlinedButton} ${style.borderRadius10}`}
              onClick={SaveSubmitHandler(true)}
            >
              SAVE & EXIT
            </button>

            <button
              onClick={SaveSubmitHandler(false)}
              className={`${style.dialogButtonStyle} ${style.marginLeft20}  ${style.borderRadius10}`}
            >
              SAVE & ADD MORE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProofOfDocumentDialog;
