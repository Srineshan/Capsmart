import React, { useState, useEffect } from "react";
import { EditableText, Checkbox, Icon, Intent } from "@blueprintjs/core";
import { TimePicker } from "@blueprintjs/datetime";
import { format } from "date-fns";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import { GetDateFromHours } from "./../../utils/formatting";
import ServiceDays from "../../Components/ReusableSmallComponents/serviceDays";
import CommonInputField from "../../Components/CommonFields/CommonInputField";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import CommonTextField from "../../Components/CommonFields/CommonTextField";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import { SpecifiedCountCalculator } from "./specifiedCountCalculator";
import { valueCheck } from "../../utils/valueCheck";

import style from "./index.module.scss";
import ScheduleAndTargetSameTable from "./scheduleAndTargetSameTable";
import AddScheduleAndTargetForDifferentPeriods from "./addScheduleAndTrgetForDifferentPeriods";

const ProcedureReading = ({
  getMetaData,
  serviceSelected,
  timeCommitment,
  contractTermPeriod,
  isReset,
  getIsReset,
  editService,
}) => {
  const [schedulesField, setSchedulesField] = useState([]);
  const [differentTargets, setDifferentTargets] = useState(false);
  const contractStatus = sessionStorage.getItem('Selected Contract Status');
  console.log("contrac time", contractTermPeriod);
  // const [contractTermPeriod, setContractDuration] = useState({ start: contractTermPeriod?.start, end: contractTermPeriod?.end })
  const [selectedScheduleRow, setSelectedScheduleRow] = useState();
  const [
    addScheduleAndTargetForDifferentPeriods,
    setAddScheduleAndTargetForDifferentPeriods,
  ] = useState(false);
  const [newClinicRow, setNewClinicRow] = useState({
    startDate: new Date(),
    endDate: new Date(),
    min: 0,
    max: 0,
    frequency: "WEEK",
    seenWithNurse: 0,
    seenWithoutNurse: 0,
    seenNoTarget: false,
    targetWithNurse: 0,
    targetWithoutNurse: 0,
    targetNoTarget: false,
  });
  const [metadata, setMetadata] = useState({
    contractedSchedules: [
      {
        minimum: {
          value: 0,
        },
        maximum: {
          value: 99999999,
        },
        frequency: "NA",
        startDate: contractTermPeriod?.start,
        endDate: contractTermPeriod?.end,
      },
    ],
    patientsSeenTargets: [
      {
        withNurse: {
          value: 0,
        },
        withoutNurse: {
          value: 0,
        },
        startDate: contractTermPeriod?.start,
        endDate: contractTermPeriod?.end,
        noTargetApplicable: false,
      },
    ],
    scheduledPatientsTargets: [
      {
        withNurse: {
          value: 0,
        },
        withoutNurse: {
          value: 0,
        },
        startDate: contractTermPeriod?.start,
        endDate: contractTermPeriod?.end,
        noTargetApplicable: false,
      },
    ],
    min: "0",
    max: "0",
    frequency: "WEEK",
    withNurse: "0",
    withoutNurse: "0",
    noTargetApplicable: false,
    targetWithNurse: "0",
    targetWithoutNurse: "0",
    targetNoTargetApplicable: false,
    additionalScheduleValue: "0",
    additionalScheduleFrequency: "NA",
    additionalScheduleRequired: false,
    scheduleAndTargetSame: true,
    billableService: true,
    rateType: "HOURLY",
    sessionDuration: "0",
    sessionAmount: "0",
    totalSession: "0",
    totalSessionFrequency: "YEAR",
    workingTimeFrom: null,
    workingTimeTo: null,
    serviceDays: {
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      weekDays: false,
      weekEnds: false,
      monday: false,
    },
    weekdaysCount: "0",
    weekendsCount: "0",
  });

  const resetMetadata = () => {
    setMetadata({
      contractedSchedules: [
        {
          minimum: {
            value: 0,
          },
          maximum: {
            value: 99999999,
          },
          frequency: "NA",
          startDate: contractTermPeriod?.start,
          endDate: contractTermPeriod?.end,
        },
      ],
      patientsSeenTargets: [
        {
          withNurse: {
            value: 0,
          },
          withoutNurse: {
            value: 0,
          },
          startDate: contractTermPeriod?.start,
          endDate: contractTermPeriod?.end,
          noTargetApplicable: false,
        },
      ],
      scheduledPatientsTargets: [
        {
          withNurse: {
            value: 0,
          },
          withoutNurse: {
            value: 0,
          },
          startDate: contractTermPeriod?.start,
          endDate: contractTermPeriod?.end,
          noTargetApplicable: false,
        },
      ],
      min: "0",
      max: "0",
      frequency: "WEEK",
      withNurse: "0",
      withoutNurse: "0",
      noTargetApplicable: false,
      targetWithNurse: "0",
      targetWithoutNurse: "0",
      targetNoTargetApplicable: false,
      additionalScheduleValue: "0",
      additionalScheduleFrequency: "NA",
      additionalScheduleRequired: false,
      scheduleAndTargetSame: true,
      billableService: true,
      rateType: "HOURLY",
      sessionDuration: "0",
      sessionAmount: "0",
      totalSession: "0",
      totalSessionFrequency: "YEAR",
      workingTimeFrom: null,
      workingTimeTo: null,
      serviceDays: {
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        weekDays: false,
        weekEnds: false,
        monday: false,
      },
      weekdaysCount: "0",
      weekendsCount: "0",
    });
  };

  useEffect(() => {
    if (isReset) {
      resetMetadata();
      getIsReset(false);
    }
  }, [isReset]);

  useEffect(() => {
    let temp = metadata;
    // let tempPatientsSeenTargets = metada?.patientsSeenTargets;
    // let tempScheduledPatientsTargets = metadata?.scheduledPatientsTargets;

    temp.contractedSchedules?.map((data) => {
      if (data?.startDate === null) {
        data.startDate = contractTermPeriod?.start;
        data.endDate = contractTermPeriod?.end;
      }
    });

    temp?.patientsSeenTargets?.map((data) => {
      if (data?.startDate === null) {
        data.startDate = contractTermPeriod?.start;
        data.endDate = contractTermPeriod?.end;
      }
    });

    temp?.scheduledPatientsTargets?.map((data) => {
      if (data?.startDate === null) {
        data.startDate = contractTermPeriod?.start;
        data.endDate = contractTermPeriod?.end;
      }
    });
    setMetadata(temp);
  }, [contractTermPeriod]);

  const onNewClinicChange = (value, index, type) => {
    let contractedScheduleTemp = metadata?.contractedSchedules;
    contractedScheduleTemp[index] = {
      minimum: {
        value: parseFloat(value?.min),
      },
      maximum: {
        value: parseFloat(value?.max),
      },
      frequency: value?.frequency,
      startDate: format(new Date(value?.startDate), "yyyy-MM-dd").toString(),
      endDate: format(new Date(value?.endDate), "yyyy-MM-dd").toString(),
    };
    let patientSeenTemp = metadata?.patientsSeenTargets;
    patientSeenTemp[index] = {
      withNurse: {
        value: parseInt(value?.seenWithNurse),
      },
      withoutNurse: {
        value: parseInt(value?.seenWithoutNurse),
      },
      startDate: format(new Date(value?.startDate), "yyyy-MM-dd").toString(),
      endDate: format(new Date(value?.endDate), "yyyy-MM-dd").toString(),
      noTargetApplicable: value?.seenNoTarget,
    };
    let targetTemp = metadata?.scheduledPatientsTargets;
    targetTemp[index] = {
      withNurse: {
        value: parseInt(value?.targetWithNurse),
      },
      withoutNurse: {
        value: parseInt(value?.targetWithoutNurse),
      },
      startDate: format(new Date(value?.startDate), "yyyy-MM-dd").toString(),
      endDate: format(new Date(value?.endDate), "yyyy-MM-dd").toString(),
      noTargetApplicable: value?.targetNoTarget,
    };
    setMetadata({
      ...metadata,
      contractedSchedules: contractedScheduleTemp,
      patientsSeenTargets: patientSeenTemp,
      scheduledPatientsTargets: targetTemp,
    });
    setNewClinicRow(value);

    getAddScheduleAndTargetForDifferentPeriods(false);
  };

  console.log("contract Term period", metadata);

  useEffect(() => {
    if (Object.entries(serviceSelected)?.length !== 0) {
      setSelectedValues();
    }
  }, [serviceSelected]);

  useEffect(() => {
    getMetaData(metadata);
  }, [metadata]);

  const getAddScheduleAndTargetForDifferentPeriods = (value) => {
    setAddScheduleAndTargetForDifferentPeriods(value);
  };

  const setSelectedValues = () => {
    let tempContractedSchedules = serviceSelected?.contractedSchedules || [];
    tempContractedSchedules?.map((data) => {
      data.startDate = data?.startDate;
      data.endDate = data?.endDate;
    });
    let tempPatientsSeenTargets = serviceSelected?.patientsSeenTargets || [];
    tempPatientsSeenTargets?.map((data) => {
      data.startDate = data?.startDate;
      data.endDate = data?.endDate;
    });
    let tempScheduledPatientsTargets =
      serviceSelected?.scheduledPatientsTargets || [];
    tempScheduledPatientsTargets?.map((data) => {
      data.startDate = data?.startDate;
      data.endDate = data?.endDate;
    });

    console.log(
      "temp",
      tempContractedSchedules,
      tempPatientsSeenTargets,
      tempScheduledPatientsTargets
    );
    if (Object.keys(serviceSelected)?.length !== 0) {
      setMetadata({
        ...metadata,
        refId: serviceSelected?.refId,
        contractedSchedules: tempContractedSchedules,
        patientsSeenTargets: tempPatientsSeenTargets,
        scheduledPatientsTargets: tempScheduledPatientsTargets,
        scheduleAndTargetSame:
          serviceSelected?.contractedSchedules?.length <= 1 ? true : false,
        min: serviceSelected?.contractedSchedule?.minimum?.value,
        max: serviceSelected?.contractedSchedule?.maximum?.value,
        frequency: serviceSelected?.contractedSchedule?.frequency,
        withNurse: serviceSelected?.patientsSeenTarget?.withNurse?.value,
        withoutNurse: serviceSelected?.patientsSeenTarget?.withoutNurse?.value,
        noTargetApplicable:
          serviceSelected?.patientsSeenTarget?.noTargetApplicable,
        targetWithNurse:
          serviceSelected?.scheduledPatientsTarget?.withNurse?.value,
        targetWithoutNurse:
          serviceSelected?.scheduledPatientsTarget?.withoutNurse?.value,
        targetNoTargetApplicable:
          serviceSelected?.scheduledPatientsTarget?.noTargetApplicable,
        additionalScheduleValue: serviceSelected?.additionalSchedule?.value,
        additionalScheduleFrequency:
          serviceSelected?.additionalSchedule?.frequency,
        additionalScheduleRequired:
          serviceSelected?.additionalSchedule?.scheduleRequired,
        billableService: serviceSelected?.billableService,
        rateType: serviceSelected?.rateType,
        sessionDuration: serviceSelected?.duration?.hours || "0",
        sessionAmount: serviceSelected?.payableAmount?.value,
        totalSession: serviceSelected?.totalSessions?.value,
        totalSessionFrequency: serviceSelected?.totalSessions?.frequency,
        workingTimeFrom: GetDateFromHours(
          serviceSelected?.workingPeriod?.from?.toString() || ""
        ),
        workingTimeTo: GetDateFromHours(
          serviceSelected?.workingPeriod?.to?.toString() || ""
        ),
        serviceDays: serviceSelected?.serviceDays,
      });
    }
  };

  const handleValueChange = (name, value) => {
    setMetadata({ ...metadata, [name]: value });
  };

  const getServiceDaysMetadata = (serviceDays) => {
    setMetadata({ ...metadata, serviceDays: serviceDays });
  };

  const onAdditionalScheduleChange = (value) => {
    if (!value) {
      setMetadata({
        ...metadata,
        additionalScheduleRequired: value,
        additionalScheduleValue: "0",
        additionalScheduleFrequency: "NA",
      });
    } else {
      setMetadata({ ...metadata, additionalScheduleRequired: value });
    }
  };

  const onTotalSessionChange = (e) => {
    if (e >= 0) {
      let value = e.slice(0, 6);
      handleValueChange("totalSession", value);
    }
  };

  const updateWorkingPeriod = (e) => {
    setMetadata({ ...metadata, workingTimeFrom: e });
  };

  const onScheduleContractYearChange = (value) => {
    console.log("in value", value);
    if (value) {
      console.log("in if check");
      setMetadata({
        ...metadata,
        scheduleAndTargetSame: value,
        contractedSchedules: [
          {
            minimum: {
              value: 0,
            },
            maximum: {
              value: 0,
            },
            frequency: "WEEK",
            startDate: contractTermPeriod?.start,
            endDate: contractTermPeriod?.end,
          },
        ],
        patientsSeenTargets: [
          {
            withNurse: {
              value: 0,
            },
            withoutNurse: {
              value: 0,
            },
            startDate: contractTermPeriod?.start,
            endDate: contractTermPeriod?.end,
            noTargetApplicable: false,
          },
        ],
        scheduledPatientsTargets: [
          {
            withNurse: {
              value: 0,
            },
            withoutNurse: {
              value: 0,
            },
            startDate: contractTermPeriod?.start,
            endDate: contractTermPeriod?.end,
            noTargetApplicable: false,
          },
        ],
      });
    } else {
      console.log("in else check");
      setMetadata({
        ...metadata,
        scheduleAndTargetSame: value,
        contractedSchedules: [],
        patientsSeenTargets: [],
        scheduledPatientsTargets: [],
      });
      console.log("after that");
    }
  };

  const onSameTargetChange = (targetName, value, name) => {
    let temp = metadata[targetName];
    if (
      name === "minimum" ||
      name === "maximum" ||
      name === "withNurse" ||
      name === "withoutNurse"
    ) {
      temp[0][name] = {
        value: value || 0,
      };
      console.log("data", temp);
    } else if (name === "noTargetApplicable" && value) {
      temp[0][name] = value;
      temp[0]["withNurse"] = {
        value: 0,
      };
      temp[0]["withoutNurse"] = {
        value: 0,
      };
    } else {
      temp[0][name] = value;
    }
    console.log("temp after value ", temp);
    setMetadata({ ...metadata, [targetName]: temp });
  };

  const deleteRow = (index) => {
    let contractSchedule = metadata?.contractedSchedules
      ?.filter((data, indexVal) => indexVal !== index)
      ?.map((data) => data);
    let patientsSeenTarget = metadata?.patientsSeenTargets
      ?.filter((data, indexVal) => indexVal !== index)
      ?.map((data) => data);
    let scheduledPatientsTargets = metadata?.scheduledPatientsTargets
      ?.filter((data, indexVal) => indexVal !== index)
      ?.map((data) => data);
    setMetadata({
      ...metadata,
      contractedSchedules: contractSchedule,
      patientsSeenTargets: patientsSeenTarget,
      scheduledPatientsTargets: scheduledPatientsTargets,
    });
  };

  const limit5 = 5;

  const dataCheck = (value) => {
    if (editService) {
      return valueCheck(value);
    } else {
      return false;
    }
  };

  return (
    <div>
      {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>

                <div className={style.extentionLableStyle}></div>
                <div className={style.termPeriodWithAddGrid}>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                InputProps={{
                                    style: {
                                        fontSize: 14,
                                        height: 30,
                                    },
                                    onFocus: e => {
                                        // setCalendarStart(true);
                                    },
                                    onBlur: e => {
                                        // setCalendarStart(false);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params}
                                    // onClick={() => setCalendarStart(true)}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: "Start Date"
                                    }} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <p className={`${style.toStyle} ${style.alignCenter}`}></p>
                    <div >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                // open={calendarEnd}
                                // onOpen={() => setCalendarEnd(true)}
                                // onClose={() => setCalendarEnd(false)}
                                // value={contractTermPeriodTo}
                                // onChange={(newValue) => {
                                //     setContractTermPeriodTo(newValue);
                                // }}
                                InputProps={{
                                    style: {
                                        fontSize: 14,
                                        height: 30,
                                    },
                                    onFocus: e => {
                                        // setCalendarEnd(true);
                                    },
                                    onBlur: e => {
                                        // setCalendarEnd(false);
                                    }
                                }}
                                // minDate={contractTermPeriodFrom}
                                // maxDate={add(new Date(), { years: 5 })}
                                renderInput={(params) => <TextField  {...params}
                                    //  onClick={() => setCalendarEnd(true)}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: "End Date"
                                    }} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                        <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={incrementScheduleSet} />
                    </div>
                </div>
            </div> */}
      {/* {
                schedulesField
            } */}

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Schedule And Target Are Same For Full Contract Year" />
        <div className={style.spaceBetween}>
          <div className={`${style.threeFieldWidth}`}>
            <CommonSwitch
              checked={metadata?.scheduleAndTargetSame}
              className={`${style.textAlignLeft} ${style.switchFontStyle} ${style.flexLeft}`}
              label={metadata?.scheduleAndTargetSame ? "YES" : "NO"}
              onChange={(e) =>
                onScheduleContractYearChange(!metadata?.scheduleAndTargetSame)
              }
            />
          </div>
          {!metadata?.scheduleAndTargetSame && (
            <div
              className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}
            >
              <AddIcon
                sx={{ fontSize: 25, color: "white" }}
                onClick={() => {
                  setSelectedScheduleRow(
                    metadata?.contractedSchedules?.length || 0
                  );
                  setAddScheduleAndTargetForDifferentPeriods(true);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {metadata?.scheduleAndTargetSame &&
        metadata?.contractedSchedules?.length === 1 && (
          <>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <CommonLabel
                value="Regular Service Schedule*"
                className={
                  dataCheck(metadata?.contractedSchedules?.[0]?.minimum?.value)
                    ? style.redLable
                    : ""
                }
              />
              <div className={style.displayInRow}>
                {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.contractedSchedules?.[0]?.minimum?.value} onChange={(e) => onSameTargetChange('contractedSchedules', e, 'minimum')} />
                            </div> */}
                <CommonTextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          fontSize: 10,
                          backgroundColor: "#f1f2f3",
                          color: "#fff",
                          height: "35px",
                        }}
                        className={style.textElement}
                      >
                        MIN
                      </InputAdornment>
                    ),
                  }}
                  className={style.threeFieldWidth}
                  onChange={(e) =>
                    onSameTargetChange(
                      "contractedSchedules",
                      parseFloat(e.target.value.slice(0, 5)),
                      "minimum"
                    )
                  }
                  value={
                    metadata?.contractedSchedules?.[0]?.minimum?.value === 0
                      ? ""
                      : metadata?.contractedSchedules?.[0]?.minimum?.value
                  }
                  type="number"
                />
                {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.contractedSchedules?.[0]?.maximum?.value} onChange={(e) => onSameTargetChange('contractedSchedules', e, 'maximum')} />
                            </div> */}
                <CommonTextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          fontSize: 10,
                          backgroundColor: "#f1f2f3",
                          color: "#fff",
                          height: "35px",
                        }}
                        className={style.textElement}
                      >
                        MAX
                      </InputAdornment>
                    ),
                  }}
                  className={style.threeFieldWidth}
                  onChange={(e) =>
                    onSameTargetChange(
                      "contractedSchedules",
                      parseFloat(e.target.value.slice(0, 5)),
                      "maximum"
                    )
                  }
                  value={
                    metadata?.contractedSchedules?.[0]?.maximum?.value === 0 ||
                      metadata?.contractedSchedules?.[0]?.maximum?.value ===
                      99999999
                      ? ""
                      : metadata?.contractedSchedules?.[0]?.maximum?.value
                  }
                  type="number"
                />
                <CommonSelectField
                  className={`${style.fullWidth} ${style.marginLeft20}`}
                  value={metadata?.contractedSchedules?.[0]?.frequency || ""}
                  onChange={(e) =>
                    onSameTargetChange(
                      "contractedSchedules",
                      e.target.value,
                      "frequency"
                    )
                  }
                  firstOptionLabel={"Select Frequency"}
                  firstOptionValue={""}
                  valueList={["WEEK", "MONTH", "YEAR"]}
                  labelList={["Per Week", "Per Month", "Per Year"]}
                  disabledList={[false, false, false]}
                />
              </div>
            </div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <CommonLabel
                value="Patients Seen Target*"
                className={
                  !metadata?.patientsSeenTargets?.[0]?.noTargetApplicable
                    ? dataCheck(
                      metadata?.patientsSeenTargets?.[0]?.withNurse?.value
                    ) ||
                      dataCheck(
                        metadata?.patientsSeenTargets?.[0]?.withoutNurse?.value
                      )
                      ? style.redLable
                      : ""
                    : ""
                }
              />
              <div className={style.withNurseGrid}>
                {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITH NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.patientsSeenTargets?.[0]?.withNurse?.value} onChange={(e) => onSameTargetChange('patientsSeenTargets', e, 'withNurse')} />
                            </div> */}
                <CommonTextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          fontSize: 10,
                          backgroundColor: "#f1f2f3",
                          color: "#fff",
                          height: "35px",
                        }}
                        className={style.textElement}
                      >
                        WITH NURSE
                      </InputAdornment>
                    ),
                  }}
                  className={style.threeFieldWidth}
                  onChange={(e) =>
                    onSameTargetChange(
                      "patientsSeenTargets",
                      e.target.value.slice(0, 2),
                      "withNurse"
                    )
                  }
                  value={
                    metadata?.patientsSeenTargets?.[0]?.withNurse?.value === 0
                      ? ""
                      : metadata?.patientsSeenTargets?.[0]?.withNurse?.value
                  }
                  type="number"
                  disabled={
                    metadata?.patientsSeenTargets?.[0]?.noTargetApplicable
                  }
                />
                {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITHOUT NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.patientsSeenTargets?.[0]?.withoutNurse?.value} onChange={(e) => onSameTargetChange('patientsSeenTargets', e, 'withoutNurse')} />
                            </div> */}
                <CommonTextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          fontSize: 10,
                          backgroundColor: "#f1f2f3",
                          color: "#fff",
                          height: "35px",
                        }}
                        className={style.textElement}
                      >
                        WITHOUT NURSE
                      </InputAdornment>
                    ),
                  }}
                  className={style.threeFieldWidth}
                  onChange={(e) =>
                    onSameTargetChange(
                      "patientsSeenTargets",
                      e.target.value.slice(0, 2),
                      "withoutNurse"
                    )
                  }
                  value={
                    metadata?.patientsSeenTargets?.[0]?.withoutNurse?.value ===
                      0
                      ? ""
                      : metadata?.patientsSeenTargets?.[0]?.withoutNurse?.value
                  }
                  type="number"
                  disabled={
                    metadata?.patientsSeenTargets?.[0]?.noTargetApplicable
                  }
                />
                <CommonCheckBox
                  label="No Target Applicable"
                  className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`}
                  checked={
                    metadata?.patientsSeenTargets?.[0]?.noTargetApplicable
                  }
                  onChange={(e) =>
                    onSameTargetChange(
                      "patientsSeenTargets",
                      e.target.checked,
                      "noTargetApplicable"
                    )
                  }
                />
              </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <CommonLabel
                value="Scheduled Patient Target*"
                className={
                  !metadata?.scheduledPatientsTargets?.[0]?.noTargetApplicable
                    ? dataCheck(
                      metadata?.scheduledPatientsTargets?.[0]?.withNurse
                        ?.value
                    ) ||
                      dataCheck(
                        metadata?.scheduledPatientsTargets?.[0]?.withoutNurse
                          ?.value
                      )
                      ? style.redLable
                      : ""
                    : ""
                }
              />
              <div className={`${style.withNurseGrid} ${style.fullWidth}`}>
                {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITH NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.scheduledPatientsTargets?.[0]?.withNurse?.value} onChange={(e) => onSameTargetChange('scheduledPatientsTargets', e, 'withNurse')} />
                            </div> */}
                <CommonTextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          fontSize: 10,
                          backgroundColor: "#f1f2f3",
                          color: "#fff",
                          height: "35px",
                        }}
                        className={style.textElement}
                      >
                        WITH NURSE
                      </InputAdornment>
                    ),
                  }}
                  className={style.threeFieldWidth}
                  onChange={(e) =>
                    onSameTargetChange(
                      "scheduledPatientsTargets",
                      e.target.value.slice(0, 2),
                      "withNurse"
                    )
                  }
                  value={
                    metadata?.scheduledPatientsTargets?.[0]?.withNurse
                      ?.value === 0
                      ? ""
                      : metadata?.scheduledPatientsTargets?.[0]?.withNurse
                        ?.value
                  }
                  type="number"
                  disabled={
                    metadata?.scheduledPatientsTargets?.[0]?.noTargetApplicable
                  }
                />
                {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITHOUT NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.scheduledPatientsTargets?.[0]?.withoutNurse?.value} onChange={(e) => onSameTargetChange('scheduledPatientsTargets', e, 'withoutNurse')} />
                            </div> */}
                <CommonTextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          fontSize: 10,
                          backgroundColor: "#f1f2f3",
                          color: "#fff",
                          height: "35px",
                        }}
                        className={style.textElement}
                      >
                        WITHOUT NURSE
                      </InputAdornment>
                    ),
                  }}
                  className={style.threeFieldWidth}
                  onChange={(e) =>
                    onSameTargetChange(
                      "scheduledPatientsTargets",
                      e.target.value.slice(0, 2),
                      "withoutNurse"
                    )
                  }
                  value={
                    metadata?.scheduledPatientsTargets?.[0]?.withoutNurse
                      ?.value === 0
                      ? ""
                      : metadata?.scheduledPatientsTargets?.[0]?.withoutNurse
                        ?.value
                  }
                  type="number"
                  disabled={
                    metadata?.scheduledPatientsTargets?.[0]?.noTargetApplicable
                  }
                />
                <CommonCheckBox
                  label="No Target Applicable"
                  className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`}
                  checked={
                    metadata?.scheduledPatientsTargets?.[0]?.noTargetApplicable
                  }
                  onChange={(e) =>
                    onSameTargetChange(
                      "scheduledPatientsTargets",
                      e.target.checked,
                      "noTargetApplicable"
                    )
                  }
                />
              </div>
            </div>
          </>
        )}

      {!metadata?.scheduleAndTargetSame && (
        <div>
          <div className={`${style.tableHeader} ${style.marginTop10}`}>
            <div className={style.scheduleTableGrid1}>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                APPLICABLE PERIOD
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                SCHEDULE
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              ></p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                PATIENT SEEN
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              ></p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                PATIENTS SCHEDULED
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              ></p>
            </div>
            <div className={style.scheduleTableGrid2}>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                FROM - TO
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                MIN
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                MAX
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              ></p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                W / NURSE{" "}
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                WO / NURSE
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              ></p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                W / NURSE{" "}
              </p>
              <p
                className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                WO / NURSE
              </p>
              <p></p>
              {/* <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p> */}
            </div>
          </div>
          {metadata?.contractedSchedules?.map((data, index) => (
            <div
              className={`${style.tableData} ${style.scheduleTableGrid2} ${style.alternativeBackgroundColor}`}
            >
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >{`${format(
                new Date(data?.startDate?.replace("-", "/")),
                "MMMM d, yyyy"
              )} - ${format(
                new Date(data?.endDate?.replace("-", "/")),
                "MMMM d, yyyy"
              )}`}</p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                {data?.minimum?.value || "-"}
              </p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                {data?.maximum?.value || "-"}
              </p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              ></p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                {metadata?.patientsSeenTargets?.[index]?.withNurse?.value ||
                  "-"}
              </p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                {metadata?.patientsSeenTargets?.[index]?.withoutNurse?.value ||
                  "-"}
              </p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              ></p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                {metadata?.scheduledPatientsTargets?.[index]?.withNurse
                  ?.value || "-"}
              </p>
              <p
                className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}
              >
                {metadata?.scheduledPatientsTargets?.[index]?.withoutNurse
                  ?.value || "-"}
              </p>
              <Icon
                icon="cross"
                size={20}
                intent={Intent.DANGER}
                className={`${style.crossStyle} ${style.flexCenter}${style.verticalAlignCenter}  ${style.verticalAlignCenter}`}
                onClick={() => deleteRow(index)}
              />

              {/* <div className={`${style.verticalAlignCenter} ${style.flexCenter} ${style.cursorPointer}`}>
                                    <EditIcon style={{ color: "#7165E3" }} />
                                </div>
                                <div className={`${style.verticalAlignCenter} ${style.flexCenter} ${style.cursorPointer}`}>
                                    <CloseIcon style={{ color: "#FF6562" }} />
                                </div> */}
            </div>
          ))}
        </div>
      )}

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Additional Schedule*" />
        <div className={`${style.grid3}`}>
          <div className={`${style.fullWidth}`}>
            <CommonSwitch
              checked={metadata?.additionalScheduleRequired}
              label={metadata?.additionalScheduleRequired ? "YES" : "NO"}
              className={`${style.textAlignLeft} ${style.switchFontStyle} ${style.flexLeft}`}
              onChange={() =>
                onAdditionalScheduleChange(
                  !metadata?.additionalScheduleRequired
                )
              }
            />
          </div>
          {metadata?.additionalScheduleRequired && (
            <>
              <CommonInputField
                value={metadata?.additionalScheduleValue}
                type="number"
                onChange={(e) =>
                  handleValueChange(
                    "additionalScheduleValue",
                    e.target.value.slice(0, 4)
                  )
                }
                className={` ${style.fullWidth}`}
              />
              <CommonSelectField
                className={`${style.fullWidth}`}
                value={metadata?.additionalScheduleFrequency || "NA"}
                onChange={(e) =>
                  handleValueChange(
                    "additionalScheduleFrequency",
                    e.target.value
                  )
                }
                firstOptionLabel={"Select Frequency"}
                firstOptionValue={""}
                valueList={[
                  "WEEK",
                  "EVERY_OTHER_WEEK",
                  "MONTH",
                  "EVERY_OTHER_MONTH",
                ]}
                labelList={[
                  "Every Week",
                  "Every Other Week",
                  "Every Month",
                  "Every Other Month",
                ]}
                disabledList={[false, false, false, false]}
              />
            </>
          )}
        </div>
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Billable Service*" />
        <div className={style.displayInRow}>
          <div className={`${style.threeFieldWidth}`}>
            <CommonSwitch
              checked={metadata?.billableService}
              onChange={(e) =>
                handleValueChange("billableService", !metadata?.billableService)
              }
              className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
              label={metadata?.billableService ? "YES" : "NO"}
            />
          </div>
          {
            // metadata?.billableService &&
            //   <Select
            //       displayEmpty
            //       SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
            //       className={`${style.threeFieldWidth}`}
            //       value={metadata?.rateType}
            //       onChange={(e)=>handleValueChange('rateType',e.target.value)}
            //   >
            //       <MenuItem value="">Select Frequency</MenuItem>
            //       <MenuItem value={'HOURLY'}>Hourly</MenuItem>
            //   </Select>
          }
        </div>
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel
          value="Service Session Duration"
          className={dataCheck(metadata?.sessionDuration) ? style.redLable : ""}
        />
        <div className={`${style.threeFieldWidth}`}>
          <CommonTextField
            type="tel"
            maxLength="3"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ fontSize: 10 }}>
                  Hours
                </InputAdornment>
              ),
            }}
            onChange={(e) =>
              e.target.value >= 0 &&
              setMetadata({
                ...metadata,
                sessionDuration: e.target.value,
                sessionAmount: "0",
              })
            }
            value={metadata?.sessionDuration}
          />
        </div>
      </div>
      {metadata?.billableService && (
        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
          <CommonLabel
            value="Service Session payment Amount*"
            className={dataCheck(metadata?.sessionAmount) ? style.redLable : ""}
          />
          <div className={`${style.displayInRow}`}>
            <div className={`${style.threeFieldWidth}`}>
              <CommonTextField
                type="tel"
                maxLength="5"
                disabled={
                  metadata?.sessionDuration === "" ||
                  metadata?.sessionDuration === "0" ||
                  metadata?.sessionDuration === undefined
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ fontSize: 10 }}>
                      $
                    </InputAdornment>
                  ),
                }}
                onChange={(e) =>
                  e.target.value >= 0 &&
                  handleValueChange("sessionAmount", e.target.value)
                }
                value={metadata?.sessionAmount}
              />
            </div>
            <div className={style.verticalAlignCenter}>
              <CommonLabel
                className={`${style.marginLeft20}`}
                value={`$ ${(
                  metadata?.sessionAmount / metadata?.sessionDuration || 0
                ).toFixed(2)} per Hour (Pro Rata)`}
              />
            </div>
          </div>
        </div>
      )}
      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel
          value="Total Contracted Service Sessions*"
          className={dataCheck(metadata?.totalSession) ? style.redLable : ""}
        />
        <div className={style.twoCol}>
          <div
            className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}
          >
            <EditableText
              value={metadata?.totalSession}
              placeholder=""
              type="tel"
              onChange={(e) => onTotalSessionChange(e)}
              className={style.editableSessionTextStyle}
              disabled={contractStatus === "ACTIVE" ? true : false}
            />
            <div
              className={`${style.textElement} ${parseFloat(metadata?.totalSession) ===
                parseFloat(
                  SpecifiedCountCalculator(
                    metadata?.contractedSchedules,
                    timeCommitment,
                    metadata?.additionalScheduleFrequency,
                    metadata?.additionalScheduleValue
                  )
                )
                ? style.greenBase
                : style.redBase
                } `}
            >
              {SpecifiedCountCalculator(
                metadata?.contractedSchedules,
                timeCommitment,
                metadata?.additionalScheduleFrequency,
                metadata?.additionalScheduleValue
              )}{" "}
              Minimum Specified
            </div>
          </div>
          <div className={style.verticalAlignCenter}>
            <CommonLabel
              value={`For ${timeCommitment?.value} ${timeCommitment?.frequency === "WEEK" ? "Weeks" : "Months"
                } Per Contract Year`}
            />
          </div>
        </div>
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel
          value="Service Days*"
          className={
            metadata?.serviceDays === null ||
              (metadata?.serviceDays !== undefined &&
                Object?.values(metadata?.serviceDays)?.filter(
                  (data) => data === true
                )?.length === 0)
              ? style.redLable
              : ""
          }
        />
        <ServiceDays
          setMetaData={getServiceDaysMetadata}
          selectedService={serviceSelected}
          isReset={isReset}
          setIsReset={getIsReset}
        />
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel
          value="Allowable Working Day Hours For Service*"
          className={
            format(metadata?.workingTimeTo || new Date(), "H") === "0" &&
              format(metadata?.workingTimeFrom || new Date(), "H") === "0"
              ? style.redLable
              : ""
          }
        />
        <div className={style.displayInRow}>
          <TimePicker
            useAmPm={false}
            onChange={(e) => {
              updateWorkingPeriod(e);
            }}
            value={
              metadata?.workingTimeTo === null
                ? null
                : new Date(metadata?.workingTimeFrom)
            }
            disabled={contractStatus === "ACTIVE" ? true : false}
          />
          <p
            className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}
          >
            To
          </p>
          <TimePicker
            useAmPm={false}
            onChange={(e) => handleValueChange("workingTimeTo", e)}
            value={
              metadata?.workingTimeTo === null
                ? null
                : new Date(metadata?.workingTimeTo) || null
            }
            disabled={contractStatus === "ACTIVE" ? true : false}
          // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
          />
        </div>
      </div>

      {addScheduleAndTargetForDifferentPeriods && (
        <AddScheduleAndTargetForDifferentPeriods
          getAddScheduleAndTargetForDifferentPeriods={
            getAddScheduleAndTargetForDifferentPeriods
          }
          initialValue={newClinicRow}
          onNewClinicChange={onNewClinicChange}
          selectedScheduleRow={selectedScheduleRow}
          metadata={metadata}
          contractTermPeriod={contractTermPeriod}
        />
      )}
    </div>
  );
};

export default ProcedureReading;
