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
}) => {
  const [terminationId, setTerminationId] = useState(
    selectedTermination?.id ? selectedTermination?.id : ""
  );
  const [terminationBy, setTerminationBy] = useState("CONTRACTOR");
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
      isOpen={getAddEntityDialog}
      onClose={() => getAddEntityDialog(false)}
      className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>{`Setup your Consent Forms`}</p>
          <Icon
            icon="cross"
            size={20}
            intent={Intent.DANGER}
            className={style.dialogCrossStyle}
            onClick={() => {
              getAddEntityDialog(false);
              getTerminationReasonData();
            }}
          />
        </div>
        <div className={style.ReferenceListEntityBorder}></div>
        <div className={`${style.addHealthCareBoxStyle}`}>
          <div className={`${style.extentionGrid}`}>
            <div className={style.entityLableStyle}>Entity Type*</div>
            <div className={style.displayInRow}>
              <select
                value={currentEntityType}
                className={style.fullWidth}
                // rightElement={arrowDown()}
                onChange={(obj) => {
                  setCurrentEntityType(obj.target.value);
                }}
              >
                <option value="">Select Entity Type</option>
                {entityTypes.map((type) => (
                  <option value={type.siteTypeId}>{type.siteTypeName}</option>
                ))}
              </select>
            </div>
          </div>
          {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={style.entityLableStyle}>
              For Cause Terminating Party*
            </div>
            <div className={style.displayInRow}>
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
          </div> */}
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
          </div>

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
                    className={`${style.buttonStyle3} ${style.addMoreCardStyle}`}
                    onClick={() => handleAddMore()}
                  >
                    ADD MORE
                  </div>
                ) : (
                  <div
                    className={`${style.addMoreTextStyle} ${style.addMoreCardStyle}`}
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
              className={style.outlinedButton}
              onClick={() => {
                getAddEntityDialog(false);
                getTerminationReasonData();
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
    </Dialog>
  );
};

export default ConsentsDialog;
