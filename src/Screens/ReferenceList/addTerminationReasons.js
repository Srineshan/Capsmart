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
import ArrowDown from "./../../images/arrowDown.png";
import style from "./index.module.scss";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { POST, GET, PUT } from "./../dataSaver";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Switch, makeStyles } from "@material-ui/core";

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

const AddTerminationReasons = ({
  getAddEntityDialog,
  selectedEntity,
  IndustryData,
  selectedTermination,
  isSecondary,
  isEdit,
  getTerminationReasonData,
  selectedTitle,
}) => {
  const [currentindustryType, setCurrentIndustryType] = useState(
    IndustryData?.id ? IndustryData.id : ""
  );
  const [terminationId, setTerminationId] = useState("");
  const [terminationBy, setTerminationBy] = useState("CONTRACTOR");
  const [primaryReason, setPrimaryReason] = useState("");
  const [secondaryReason, setSecondaryReason] = useState("");
  const [currentEntityType, setCurrentEntityType] = useState(
    selectedEntity?.id ? selectedEntity.id : ""
  );
  const [industryTypes, setIndustryTypes] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [createdDate, setCreatedDate] = useState("");
  const [addSubReasons, setAddSubReasons] = useState(true);
  const [noticePeriod, setNoticePeriod] = useState("0");
  const [curePeriod, setCurePeriod] = useState("0");
  const [writtenNotice, setWrittenNotice] = useState(true);

  const classes = useStyles();

  const getAllIndustries = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    setIndustryTypes(industryData);
  };

  const getEntityData = async (industryId) => {
    const { data: types } = await GET(
      `entity-service/entityTypeMaster?industryId=${industryId}`
    );
    setEntityTypes(types);
  };

  const SaveSubmitHandler = async (type) => {
    let SecondaryReasonData = [];
    if (selectedTermination?.secondary_reasons) {
      SecondaryReasonData = [...selectedTermination.secondary_reasons];
    } else {
      SecondaryReasonData = [];
    }
    if (secondaryReason !== "") {
      SecondaryReasonData.push(secondaryReason);
    }

    if (!primaryReason && primaryReason === "") {
      document.getElementById("primaryReasonEl").focus();
      return false;
    }

    const data = {
      ...(isEdit && { id: terminationId }),
      ...(isEdit && { createdDate: createdDate }),
      terminationBy: terminationBy,
      primary_reason: primaryReason,
      secondary_reasons: SecondaryReasonData,
      siteTypeId: {
        id: currentEntityType,
      },
      industryId: {
        id: currentindustryType,
      },
      noticePeriodInDays: noticePeriod,
      curePeriodInDays: curePeriod,
      writtenNoticeServed: writtenNotice,
    };

    if (!isEdit) {
      await POST("entity-service/terminationReasonMaster", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Termination Added Successfully");
          getTerminationReasonData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      await PUT(
        `entity-service/terminationReasonMaster/${terminationId}`,
        JSON.stringify(data)
      )
        .then((response) => {
          SuccessToaster("Termination Updated Successfully");
          getTerminationReasonData();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    }

    if (type !== "Add More") {
      getAddEntityDialog(false);
    } else {
      setPrimaryReason("");
      setSecondaryReason("");
      document.getElementById("primaryReasonEl").focus();
    }
  };

  useEffect(() => {
    getAllIndustries();
  }, []);

  useEffect(() => {
    if (IndustryData?.id) {
      getEntityData(IndustryData?.id);
    }
  }, [IndustryData]);

  // console.log(selectedTermination);
  useEffect(() => {
    if (isEdit) {
      setCurrentIndustryType(IndustryData?.id);
      setEntityTypes([{ ...selectedEntity }]);
      setTerminationId(selectedTermination?.id);
      setTerminationBy(selectedTermination?.terminationBy);
      setPrimaryReason(selectedTermination?.primary_reason);
      setCreatedDate(selectedTermination?.createdDate);
      setNoticePeriod(selectedTermination?.noticePeriodInDays);
      setCurePeriod(selectedTermination?.curePeriodInDays);
      setWrittenNotice(selectedTermination?.writtenNoticeServed);
      if (isSecondary) {
        setSecondaryReason(selectedTermination?.secondary_reasons[0]);
      }
    }
  }, [selectedTermination]);

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
      isOpen={getAddEntityDialog}
      onClose={() => getAddEntityDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p
            className={style.extensionStyle}
          >{`Add / Edit Termination Reasons For ${selectedTitle}`}</p>
          <div className={`${style.displayInRow}`}>
            <div className={`${style.displayInRow} ${style.marginRight20}`}>
              <img
                src={
                  "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
                }
                alt="refresh"
                className={`${style.headerFlag} ${style.marginRight15}`}
              />
              <span
                className={`${style.headerCountryName} ${style.marginLeft10}`}
              >
                USA
              </span>
              <img
                src={ArrowDown}
                className={`${style.colorFileStyle2} ${style.marginLeft10}  ${style.marginTop10}`}
                alt=""
              />
            </div>
            <Icon
              icon="cross"
              size={20}
              intent={Intent.DANGER}
              className={style.dialogCrossStyle}
              onClick={() => getAddEntityDialog(false)}
            />
          </div>
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid}`}>
            <div className={style.entityLableStyle}>Industry Type*</div>
            <div className={style.displayInRow}>
              <select
                value={currentindustryType}
                className={style.fullWidth}
                rightElement={arrowDown()}
                onChange={(obj) => {
                  setCurrentIndustryType(obj.target.value);
                  getEntityData(obj.target.value);
                }}
              >
                {industryTypes.map((type) => (
                  <option value={type.id}>{type.industry}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>Entity Type*</div>
            <div className={style.displayInRow}>
              <select
                value={currentEntityType}
                className={style.fullWidth}
                rightElement={arrowDown()}
                onChange={(obj) => {
                  setCurrentEntityType(obj.target.value);
                }}
              >
                {entityTypes.map((type) => (
                  <option value={type.id}>{type.type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              For Cause Terminating Party*
            </div>
            <div className={style.displayInRow}>
              <select
                value={terminationBy}
                defaultValue={terminationBy}
                className={style.fullWidth}
                rightElement={arrowDown()}
                onChange={(obj) => {
                  setTerminationBy(obj.target.value);
                }}
              >
                <option value="CONTRACTOR">For Cause By Contractor</option>
                <option value="ENTITY">For Cause By Entity</option>
              </select>
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
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
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
                onChange={(e) => setAddSubReasons(e.target.checked)}
                className={` ${style.marginLeft20} ${style.marginTop}`}
                label="ADD SUB-REASONS"
              />
            </div>
          </div>

          {addSubReasons && (
            <div className={`${style.addHealthCareBoxStyle}`}>
              <div className={`${style.editHealthCareGrid2}`}>
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
              </div>
            </div>
          )}

          <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div></div>
            {!isEdit && (
              <>
                {primaryReason.length > 0 || secondaryReason.length > 0 ? (
                  <div
                    className={`${style.buttonStyle3} ${style.addMoreCardStyle}`}
                    onClick={() => SaveSubmitHandler("Add More")}
                  >
                    ADD MORE
                  </div>
                ) : (
                  <div
                    className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}
                    onClick={() => SaveSubmitHandler("Add More")}
                  >
                    ADD MORE
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button
              className={style.outlinedButton}
              onClick={() => getAddEntityDialog(false)}
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
    </Dialog>
  );
};

export default AddTerminationReasons;
