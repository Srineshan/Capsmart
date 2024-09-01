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
  getAddEntityDialog,
  selectedTermination,
  isSecondary,
  isEdit,
  getTerminationReasonData,
  siteTypeId,
  handleClose,
  open,
}) => {
  const [terminationId, setTerminationId] = useState(
    selectedTermination?.id ? selectedTermination?.id : ""
  );
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

  // console.log(selectedTermination);
  useEffect(() => {
    if (isEdit) {
      setCurrentEntityType(siteTypeId);
      setTerminationId(selectedTermination?.id);
      setTerminationBy(selectedTermination?.terminationBy);
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

  const SaveSubmitHandler = async (type) => {
    // let SecondaryReasonData = [];
    // if (selectedTermination?.secondary_reasons) {
    //     SecondaryReasonData = [...selectedTermination.secondary_reasons];
    // } else {
    //     SecondaryReasonData = [];
    // }
    // if (secondaryReason !== "") {
    //     SecondaryReasonData.push(secondaryReason);
    // }

    if (currentEntityType === "") {
      ErrorToaster("Enter All Mandatory Data");
      return;
    }

    const data = {
      ...(isEdit && { id: terminationId }),
      ...(isEdit && { createdDate: createdDate }),
      ...(isEdit && { lastModifiedDate: new Date() }),
      terminationBy: terminationBy,
      primary_reason: primaryReason,
      secondary_reasons:
        secondaryReasonList[secondaryReasonList.length - 1] === ""
          ? secondaryReasonList.splice(0, secondaryReasonList.length - 1)
          : secondaryReasonList,
      siteTypeId: {
        id: currentEntityType,
      },
      entityId: {
        id: TenantID,
      },
      noticePeriodInDays: noticePeriod,
      curePeriodInDays: curePeriod,
      customized: true,
      writtenNoticeServed: writtenNotice,
    };

    // console.log(data);

    if (!isEdit) {
      await POST("entity-service/terminationReason", JSON.stringify([data]))
        .then((response) => {
          SuccessToaster("Termination Added Successfully");
          getTerminationReasonData();
          getAddEntityDialog(false);
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/terminationReason/${terminationId}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Termination Updated Successfully");
          getTerminationReasonData();
          getAddEntityDialog(false);
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }

    // if (type !== "Add More") {
    //   getAddEntityDialog(false);
    // } else {
    //   setPrimaryReason("");
    //   setSecondaryReason("");
    //   document.getElementById("primaryReasonEl").focus();
    // }
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
      //   isOpen={getAddEntityDialog}
      //   onClose={() => getAddEntityDialog(false)}
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

          {/* <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div> */}
          <div></div>
          {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              Primary Termination Reason*
            </div>
            <div className={style.displayInRow}>
              <InputGroup
                value={primaryReason}
                id="primaryReasonEl"
                className={style.halfWidth}
                onChange={(obj) => setPrimaryReason(obj.target.value)}
              />
              <Checkbox
                value="ADD SUB-REASONS"
                checked={addSubReasons}
                onChange={(e) => handleAddSubReasons(e.target.checked)}
                className={` ${style.marginLeft20} ${style.marginTop}`}
                label="ADD SUB-REASONS"
              />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Written Notice Served
            </div>
            <div
              className={`${style.displayInRow} ${style.displayTerminationPeriod}`}
            >
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
              {writtenNotice && (
                <div className={`${style.displayInRow} ${style.inputBoxStyle}`}>
                  <div
                    className={`${style.displayInCol} ${style.inputBoxStyle}`}
                  >
                    <label
                      htmlFor="notice"
                      className={`${style.labelTextAlignCenter} ${style.labelTextAlignColor}`}
                    >
                      Notice Period
                    </label>
                    <InputGroup
                      type="number"
                      value={noticePeriod}
                      className={`${style.width100} ${style.inputGroupText}`}
                      onChange={(e) => setNoticePeriod(e.target.value)}
                      rightElement={
                        <span className={`${style.rightElementText} `}>
                          Days
                        </span>
                      }
                    />
                  </div>
                  <div
                    className={`${style.displayInCol} ${style.inputBoxStyle}`}
                  >
                    <label
                      htmlFor="cure"
                      className={`${style.labelTextAlignCenter} ${style.labelTextAlignColor}`}
                    >
                      Cure Period
                    </label>
                    <InputGroup
                      type="number"
                      value={curePeriod}
                      className={`${style.width100} ${style.inputGroupText}`}
                      onChange={(e) => setCurePeriod(e.target.value)}
                      rightElement={
                        <span className={`${style.rightElementText}`}>
                          Days
                        </span>
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div> */}

          {addSubReasons && (
            <>
              <div className={`${style.addHealthCareBoxStyle}`}>
                {/* <div className={`${style.editHealthCareGrid2}`}>
                                    <div className={style.entityLableStyle}>
                                        Sub-Reason For Termination*
                                    </div>
                                    <div className={style.displayInRow}>
                                        <InputGroup
                                            value={secondaryReason}
                                            className={style.fullWidth}
                                            onChange={(obj) => setSecondaryReason(obj.target.value)}
                                        />
                                    </div>
                                </div> */}
                {subReasonFields}
              </div>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <div></div>
                {secondaryReasonList[secondaryReasonList.length - 1] !== "" ? (
                  <div
                    className={`${style.buttonStyle3} ${style.addMoreCardStyle}  ${style.borderRadius10}`}
                    onClick={() => handleAddMore()}
                  >
                    ADD MORE
                  </div>
                ) : (
                  <div
                    className={`${style.addMoreTextStyle} ${style.addMoreCardStyle}  ${style.borderRadius10}`}
                  >
                    ADD MORE
                  </div>
                )}
                {/* <div
                  className={`${style.buttonStyle3} ${style.addMoreCardStyle}`}
                  onClick={() => handleAddMore()}
                >
                  ADD MORE
                </div> */}
              </div>
            </>
          )}
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={`${style.dialogOutlinedButton}  ${style.borderRadius10}`}
              onClick={() => {
                getAddEntityDialog(false);
                getTerminationReasonData();
              }}
            >
              SAVE & EXIT
            </button>
            <button
              onClick={() => SaveSubmitHandler("Save & Exit")}
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
