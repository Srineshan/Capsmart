import React, { useEffect, useState } from "react";
import { Dialog, Classes, Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import { GET, PUT, POST, TenantID } from "./../dataSaver";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import InputAdornment from "@mui/material/InputAdornment";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import CommonTextField from "../../Components/CommonFields/CommonTextField";
import CommonInputField from "../../Components/CommonFields/CommonInputField";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { addDays, format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const PreImplementationDataDialog = ({
  showPreImplementationDialog,
  getPreImplementationDialogBoolean,
  contractId,
  selectedContractPreImplementationData,
}) => {
  const [totalCompensation, setTotalCompensation] = useState({
    value: 0,
    na: false,
  });
  const [absenseDays, setAbsenseDays] = useState({ value: 0, na: false });
  const [activitiesCompleted, setActivitiesCompleted] = useState(false);
  const [obligatedActivities, setObligatedActivities] = useState([]);
  const [obligatedFields, setObligatedFields] = useState([]);
  const [contractPayments, setContractPayments] = useState([]);
  const [contractPaymentFields, setContractPaymentFields] = useState([]);
  const [preImplementationDataId, setPreImplementationDataId] = useState("");
  const [datePeriod, setDatePeriod] = useState({ startDate: "", endDate: "" });
  const [goLiveDate, setGoLiveDate] = useState("");
  const [goLiveDateNotSet, setGoLiveDateNotSet] = useState(false);

  useEffect(() => {
    if (showPreImplementationDialog) {
      getPreImplementationValue();
    }
  }, [showPreImplementationDialog]);

  useEffect(() => {
    getObligatedActivities();
  }, [obligatedActivities]);

  useEffect(() => {
    getContractPayments();
  }, [contractPayments]);

  const getPreImplementationValue = async () => {
    await GET(
      `timesheet-management-service/timesheet/preImplementationData/${contractId}`
    ).then((response) => {
      setObligatedActivities(response?.data?.obligatedActivities);
      setContractPayments(response?.data?.contractYearPayments);
      setAbsenseDays({
        ...absenseDays,
        value: response?.data?.noOfDaysAbsent,
        na: response?.data?.absentDaysUpToDate,
      });
      setTotalCompensation({
        ...totalCompensation,
        value: response?.data?.totalCompensationPaid?.value,
        na: response?.data?.totalCompensationPaid?.upToDate,
      });
      setDatePeriod({
        ...datePeriod,
        startDate: response?.data?.dataPeriod?.startDate,
        endDate: response?.data?.dataPeriod?.endDate,
      });
      setActivitiesCompleted(response?.data?.activitiesUpToDate);
      setGoLiveDate(response?.data?.goLiveDate);
      setPreImplementationDataId(response?.data?.id);
      setGoLiveDateNotSet(
        response?.response?.data === "Go Live Date is not set" ? true : false
      );
    });
  };

  const addPreImplementationData = async (buttonType) => {
    if (
      !activitiesCompleted &&
      obligatedActivities?.map((data) => data?.completed)?.includes(0)
    ) {
      ErrorToaster("Obligated Activities Data Are Mandatory If Not NA");
      return;
    }
    if (
      contractPayments?.filter(
        (data) =>
          data?.amount?.upToDate === false &&
          (data?.amount?.value === "0" ||
            data?.amount?.value === "" ||
            data?.amount?.value === 0)
      )?.length > 0
    ) {
      ErrorToaster(
        "Payments Made For Elapsed Contract Year Are Mandatory If Not NA"
      );
      return;
    }
    if (!totalCompensation?.na && totalCompensation?.value === 0) {
      ErrorToaster(
        "Total Compensation Paid For Elapsed Contract Year Is Mandatory If Not NA"
      );
      return;
    }
    if (!absenseDays?.na && absenseDays?.value === 0) {
      ErrorToaster(
        "Absence Days Taken During Elapsed Contract Year Is Mandatory If Not NA"
      );
      return;
    }
    let data = {
      id: preImplementationDataId,
      dataPeriod: {
        startDate: datePeriod?.startDate,
        endDate: datePeriod?.endDate,
      },
      obligatedActivities: obligatedActivities,
      activitiesUpToDate: activitiesCompleted,
      noOfDaysAbsent: absenseDays?.value,
      absentDaysUpToDate: absenseDays?.na,
      contractYearPayments: contractPayments,
      totalCompensationPaid: {
        value: totalCompensation?.value,
        upToDate: totalCompensation?.na,
      },
    };

    await PUT(
      "timesheet-management-service/timesheet/preImplementationData",
      data
    )
      .then((response) => {
        SuccessToaster("Pre Implementation Data Saved Successfully");
        reset();
        getPreImplementationDialogBoolean(false);
      })
      .catch((error) => {
        ErrorToaster("Unexpected Error Creating Pre Implementation Data");
      });
  };

  const handleObligatedActivities = (e, i) => {
    if (parseInt(e) <= 999) {
      let temp = obligatedActivities;
      temp[i].completed = parseInt(e);
      setObligatedActivities(temp);
      getObligatedActivities();
    }
  };

  const handleContractPayments = (e, i, na, src) => {
    let temp = contractPayments;
    if (src === "input") {
      temp[i].amount.value = e.replace(/,/g, "");
    }
    temp[i].amount.upToDate = na;
    setContractPayments(temp);
    getContractPayments();
  };

  const getObligatedActivities = () => {
    let temp = [];
    for (let i = 0; i < obligatedActivities?.length; i++) {
      temp[i] = (
        <div className={`${style.marginTop20}`} key={i}>
          <CommonLabel
            value={`${obligatedActivities?.[i]?.activityType?.activityType} ${
              obligatedActivities?.[i]?.activityTypeTemplate
                ?.activityTypeTemplate !==
              "Administrative / Miscellaneous Service"
                ? `(${obligatedActivities?.[i]?.performingActivity?.activity})`
                : ""
            }`}
          />
          <CommonInputField
            className={style.fullWidth}
            key={i}
            type="number"
            value={obligatedActivities?.[i]?.completed}
            onChange={(e) => handleObligatedActivities(e.target.value, i)}
          />
        </div>
      );
    }
    setObligatedFields(temp);
  };

  const getContractPayments = () => {
    let tempPayment = [];
    for (let i = 0; i < contractPayments?.length; i++) {
      tempPayment[i] = (
        <div className={`${style.marginTop20}`} key={i}>
          <CommonLabel value={`${contractPayments?.[i]?.label?.label}`} />
          <div className={style.displayInRow}>
            <CommonTextField
              className={style.fullWidth}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ fontSize: 10 }}>
                    $
                  </InputAdornment>
                ),
              }}
              key={i}
              value={
                contractPayments?.[i]?.amount?.value
                  ? Number(
                      contractPayments?.[i]?.amount?.value
                    )?.toLocaleString()
                  : null
              }
              onChange={(e) =>
                handleContractPayments(
                  e.target.value.slice(0, 9),
                  i,
                  false,
                  "input"
                )
              }
            />
            <CommonCheckBox
              className={style.marginLeft20}
              checked={contractPayments?.[i]?.amount?.upToDate}
              onChange={(e) =>
                handleContractPayments(
                  contractPayments?.[i]?.amount?.value,
                  i,
                  !contractPayments?.[i]?.amount?.upToDate,
                  "check"
                )
              }
              label="NA"
              key={"contractPayments" + contractPayments?.[i]?.amount?.upToDate}
            />
          </div>
        </div>
      );
    }
    setContractPaymentFields(tempPayment);
  };

  const reset = () => {
    setObligatedActivities([]);
    setContractPayments([]);
    setAbsenseDays({ ...absenseDays, value: 0, na: false });
    setTotalCompensation({ ...totalCompensation, value: 0, na: false });
    setDatePeriod({ ...datePeriod, startDate: "", endDate: "" });
    setActivitiesCompleted(false);
    setPreImplementationDataId("");
    setGoLiveDate("");
  };

  return (
    <Dialog
      isOpen={showPreImplementationDialog}
      onClose={() => {
        getPreImplementationDialogBoolean(false);
        reset();
      }}
      className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}
    >
      <div
        className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}
      >
        {!goLiveDateNotSet ? (
          <>
            <div className={style.spaceBetween}>
              <div>
                <p className={`${style.popUpPreImplementationHeading}`}>
                  Obligated activities Completed & Payments in this contract
                  year prior to{" "}
                  <span className={style.purpleText}>
                    {formatInTimeZone(
                      new Date(goLiveDate || new Date()),
                      "America/New_York",
                      "MMM d, yyyy"
                    )}
                  </span>
                </p>
                <p className={`${style.popUpPreImplementationSubHeading}`}>
                  For The Period -{" "}
                  {formatInTimeZone(
                    new Date(datePeriod?.startDate || new Date()),
                    "America/New_York",
                    "MMM d, yyyy"
                  )}{" "}
                  -{" "}
                  {formatInTimeZone(
                    new Date(datePeriod?.endDate || new Date()),
                    "America/New_York",
                    "MMM d, yyyy"
                  )}
                </p>
              </div>
              <Icon
                icon="cross"
                size={20}
                intent={Intent.DANGER}
                className={style.crossStyle}
                onClick={() => {
                  getPreImplementationDialogBoolean(false);
                  reset();
                }}
              />
            </div>
            <div className={style.extensionBorder}></div>
            <div
              className={`${style.preImplementationGrid} ${style.marginTop20}`}
            >
              <div className={style.preImplementationPadding}>
                <div>
                  <div
                    className={`${style.spaceBetween} ${style.verticalAlignCenter}`}
                  >
                    <div className={style.popUpPreImplementationTitle}>
                      Obligated Activities Completed
                    </div>
                    <CommonCheckBox
                      checked={activitiesCompleted}
                      onChange={(e) =>
                        setActivitiesCompleted(!activitiesCompleted)
                      }
                      label="NA"
                    />
                  </div>
                  {obligatedFields}
                </div>
              </div>
              <div
                className={`${style.leftBorder} ${style.preImplementationPadding}`}
              >
                <div className={style.popUpPreImplementationTitle}>
                  Payments Made For Elapsed Contract Year
                </div>
                {contractPaymentFields}
                <div className={`${style.marginTop20}`}>
                  <CommonLabel value="Total Compensation Paid for Elapsed Contract Year" />
                  <div className={style.displayInRow}>
                    <CommonTextField
                      className={style.fullWidth}
                      min="0"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ fontSize: 10 }}
                          >
                            $
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) =>
                        setTotalCompensation({
                          ...totalCompensation,
                          value: e.target.value.slice(0, 9).replace(/,/g, ""),
                        })
                      }
                      value={
                        totalCompensation?.value
                          ? Number(totalCompensation?.value)?.toLocaleString()
                          : null
                      }
                    />
                    <CommonCheckBox
                      className={style.marginLeft20}
                      checked={totalCompensation?.na}
                      onChange={(e) =>
                        setTotalCompensation({
                          ...totalCompensation,
                          na: !totalCompensation?.na,
                          value: 0,
                        })
                      }
                      label="NA"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`${style.leftBorder} ${style.preImplementationPadding}`}
              >
                <div className={style.popUpPreImplementationTitle}>
                  Absence Days Taken During Elapsed Contract Year
                </div>
                <div className={`${style.marginTop20}`}>
                  <CommonLabel value="Days" />
                  <div className={style.displayInRow}>
                    <CommonInputField
                      className={style.fullWidth}
                      value={absenseDays?.value}
                      type="number"
                      onChange={(e) =>
                        e.target.value >= 0 &&
                        setAbsenseDays({
                          ...absenseDays,
                          value: e.target.value,
                        })
                      }
                    />
                    <CommonCheckBox
                      className={style.marginLeft20}
                      checked={absenseDays?.na}
                      onChange={(e) =>
                        setAbsenseDays({
                          ...absenseDays,
                          na: !absenseDays?.na,
                          value: 0,
                        })
                      }
                      label="NA"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button
                  className={`${style.buttonStyle} `}
                  onClick={() => {
                    getPreImplementationDialogBoolean(false);
                    reset();
                  }}
                >
                  CANCEL
                </button>
                <button
                  className={`${style.buttonStyle} ${style.marginLeft20}`}
                  onClick={() => addPreImplementationData()}
                >
                  SAVE AS DONE
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={`${style.dateNotSet} ${style.alignCenter}`}>
            Go Live Date Is Not Set By The Contracted Service Provider
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default PreImplementationDataDialog;
