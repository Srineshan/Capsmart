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

const useStyles = makeStyles({
  switch: {
    "& .Mui-checked": {
      color: "#0e5197",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#0e5197 !important",
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

  // useEffect(() => {
  //   if (isEdit) {
  //     setCurrentEntityType(siteTypeId);
  //     setTerminationId(selectedTermination?.id);
  //     setTerminationBy(selectedTermination?.terminationBy);
  //     setPrimaryReason(selectedTermination?.primary_reason);
  //     setCreatedDate(selectedTermination?.createdDate);
  //     setNoticePeriod(selectedTermination?.noticePeriodInDays);
  //     setCurePeriod(selectedTermination?.curePeriodInDays);
  //     setWrittenNotice(selectedTermination?.writtenNoticeServed);
  //     setSecondaryReasonList(selectedTermination?.secondary_reasons);
  //     setAddSubReasons(
  //       selectedTermination?.secondary_reasons?.length > 0 ? true : false
  //     );
  //     if (isSecondary) {
  //       setSecondaryReason(selectedTermination?.secondary_reasons[0]);
  //     }
  //   }
  // }, [selectedTermination]);

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

  // useEffect(() => {
  //   getSubReasons();
  // }, [secondaryReasonList]);

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

  // const handleSubReasonValue = (i, value) => {
  //   let temp = secondaryReasonList;
  //   temp[i] = value;
  //   setSecondaryReasonList(temp);
  //   setSecondaryReason(value);
  //   // getSubReasons();
  //   // console.log(temp, value, secondaryReasonList);
  // };

  // const getSubReasons = () => {
  //   // console.log('entered', secondaryReasonList)
  //   let temp = [];
  //   for (let i = 0; i < secondaryReasonList?.length; i++) {
  //     // console.log(i);
  //     temp[i] = (
  //       <div
  //         className={`${style.editHealthCareGrid2}`}
  //         key={`${i}${secondaryReasonList[i]}`}
  //       >
  //         <div className={style.entityLableStyle}>
  //           Sub-Reason For Termination {i + 1}*
  //         </div>
  //         <div className={style.displayInRow}>
  //           <InputGroup
  //             defaultValue={secondaryReasonList[i]}
  //             className={style.fullWidth}
  //             onChange={(e) => handleSubReasonValue(i, e.target.value)}
  //           />
  //         </div>
  //       </div>
  //     );
  //   }
  //   setSubReasonFields(temp);
  // };

  // const SaveSubmitHandler = async (type) => {
  //   // let SecondaryReasonData = [];
  //   // if (selectedTermination?.secondary_reasons) {
  //   //     SecondaryReasonData = [...selectedTermination.secondary_reasons];
  //   // } else {
  //   //     SecondaryReasonData = [];
  //   // }
  //   // if (secondaryReason !== "") {
  //   //     SecondaryReasonData.push(secondaryReason);
  //   // }

  //   if (currentEntityType === "") {
  //     ErrorToaster("Enter All Mandatory Data");
  //     return;
  //   }

  //   const data = {
  //     ...(isEdit && { id: terminationId }),
  //     ...(isEdit && { createdDate: createdDate }),
  //     ...(isEdit && { lastModifiedDate: new Date() }),
  //     terminationBy: terminationBy,
  //     primary_reason: primaryReason,
  //     secondary_reasons:
  //       secondaryReasonList[secondaryReasonList.length - 1] === ""
  //         ? secondaryReasonList.splice(0, secondaryReasonList.length - 1)
  //         : secondaryReasonList,
  //     siteTypeId: {
  //       id: currentEntityType,
  //     },
  //     entityId: {
  //       id: TenantID,
  //     },
  //     noticePeriodInDays: noticePeriod,
  //     curePeriodInDays: curePeriod,
  //     customized: true,
  //     writtenNoticeServed: writtenNotice,
  //   };

  //   // console.log(data);

  //   if (!isEdit) {
  //     await POST("entity-service/terminationReason", JSON.stringify([data]))
  //       .then((response) => {
  //         SuccessToaster("Termination Added Successfully");
  //         getTerminationReasonData();
  //         getAddEntityDialog(false);
  //       })
  //       .catch((error) => {
  //         ErrorToaster(error);
  //       });
  //   } else {
  //     await PUT(
  //       `entity-service/terminationReason/${terminationId}`,
  //       JSON.stringify(data)
  //     )
  //       .then((response) => {
  //         SuccessToaster("Termination Updated Successfully");
  //         getTerminationReasonData();
  //         getAddEntityDialog(false);
  //       })
  //       .catch((error) => {
  //         ErrorToaster(error);
  //       });
  //   }

  //   // if (type !== "Add More") {
  //   //   getAddEntityDialog(false);
  //   // } else {
  //   //   setPrimaryReason("");
  //   //   setSecondaryReason("");
  //   //   document.getElementById("primaryReasonEl").focus();
  //   // }
  // };

  const handleSaveConsentForm = async () => {
    console.log(currentApplicantType);

    // var temp = applicantTypeList
    //   .filter((data) => {
    //     data.id === currentApplicantType;
    //   })
    //   ?.map((data) => data)[0];

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

    // {
    //   applicantTypes: selectedApplicantType,
    //   title: title,
    //   content: {
    //     content: content,
    //   },
    //   file: file,
    //   contentType: "Text",
    //   disclaimer: {
    //     content: disclaimer,
    //   },
    //   einitialRequiredOnEachPage: eInitialRequired,
    //   esignatureRequiredOnEachPage: signatureRequired,
    // };

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

  // const handleAddMore = () => {
  //   let temp = secondaryReasonList;
  //   temp.push("");
  //   // console.log(temp);
  //   setSecondaryReasonList(temp);
  //   getSubReasons();
  // };

  const handleEditorChange = (content) => {
    setConsent(content);
  };

  // const SaveSubmitHandler = async () => {
  //   console.log("Current Entity Type:", currentApplicantType);
  //   console.log("Consent Title:", consentTitle);
  //   console.log("Consent Contents:", consentConsents);
  //   console.log("Alert Note Required:", alertNote);
  //   console.log("Alert Notice:", alertNote);
  //   console.log("Applicant e-Signature Required:", signature);
  //   handleClose();
  // };

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
            </select>
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
