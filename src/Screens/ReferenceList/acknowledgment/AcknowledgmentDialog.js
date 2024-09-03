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
import CommonDropZone from "../../../Components/CommonFields/CommonDropZone";
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

const AcknowledgmentDialog = ({
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
  const [signature, setSignature] = useState(false);

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
          <p
            className={style.extensionStyle}
          >{`Setup your Acknowledgement Forms`}</p>
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
              value={currentEntityType}
              className={style.fullWidth}
              // rightElement={arrowDown()}
              onChange={(obj) => {
                setCurrentEntityType(obj.target.value);
              }}
            >
              <option value="">Select Applicant Type</option>
              {entityTypes.map((type) => (
                <option value={type.siteTypeId}>{type.siteTypeName}</option>
              ))}
            </select>
          </div>
          <div
            className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}
          ></div>

          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>ACKNOWLEDGEMENT TILE*</div>
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
          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>
              ACKNOWLEGEMENT CONTENTS*
            </div>
            <Editor />
          </div>

          <div className={style.acknowledgementListContainer}>
            <div className={style.acknowledgementListEntityBorder}></div>
            <span className={style.acknowledgementText}>OR</span>
          </div>

          {/* <div className={style.marginTop20} style={{display:"flex"}}>
          <div className={style.fileUploadContainer}>
  <label htmlFor="file-upload-help" className={style.fileUploadLabel}>
    Upload Your Document
  </label>
  <span className={style.fileUploadSubLabel}>Upload your files or drag & drop from your cabinet</span>
  <input id="file-upload-help" type="file" className={style.fileUploadInput} />
</div>
<div className={style.fileUploadContainer}>
  <label htmlFor="file-upload-help" className={style.fileUploadLabel}>
    Upload File
  </label>
  <span className={style.fileUploadSubLabel}>Max size: 5MB</span>
  <input id="file-upload-help" type="file" className={style.fileUploadInput} />
</div>

          </div> */}
          <div
            className={`${style.twoCol} ${style.marginTop}`}
            style={{ gap: "20px" }}
          >
            <CommonDropZone
              title={"Upload Your Documents"}
              description={"Upload your files or drag & drop from your cabinet"}
            />
            <CommonDropZone
              title={"Upload A Photo"}
              description={
                "Click a picture with your Camera or upload from Gallery."
              }
            />
          </div>

          <div className={style.marginTop20}>
            <div className={style.entityLableStyle}>DISCLAIMER CONTENTS*</div>
            <Editor />
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <div className={`${style.entityLableStyle} ${style.marginTop15}`}>
              Applicant Signature Required
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <p style={{ marginRight: "10px" }}>
                  {signature ? "YES" : "NO"}
                </p>
                <FormControlLabel
                  control={
                    <Switch
                      checked={signature}
                      onChange={(e) => setSignature(e.target.checked)}
                      className={classes.switch}
                    />
                  }
                  className={`${style.switchFontStyle}`}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={style.marginTop20}>
          <div>
            <div className={style.floatLeft}>
              <button
                className={style.outlinedButton}
                onClick={() => {
                  getAddEntityDialog(false);
                  getTerminationReasonData();
                }}
              >
                BULK UPLOAD
              </button>
            </div>
            <div className={style.floatRight}>
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
      </div>
    </Dialog>
  );
};

export default AcknowledgmentDialog;
