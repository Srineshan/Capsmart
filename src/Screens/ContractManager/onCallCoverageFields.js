import React, { useState, useEffect } from "react";
import { EditableText } from "@blueprintjs/core";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from "./../../utils/formatting";
import { GET } from "../../Screens/dataSaver.js";
import ServiceDays from "../../Components/ReusableSmallComponents/serviceDays";
import CommonInputField from "../../Components/CommonFields/CommonInputField";
import CommonCheckBox from "../../Components/CommonFields/CommonCheckBox";
import CommonSwitch from "../../Components/CommonFields/CommonSwitch";
import CommonTextField from "../../Components/CommonFields/CommonTextField";
import CommonLabel from "../../Components/CommonFields/CommonLabel";
import { SpecifiedCountCalculator } from "./specifiedCountCalculator";

import style from "./index.module.scss";
import EditableTable from "./editableTable";
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";

const OnCallCoverageFields = ({
  getMetaData,
  serviceSelected,
  timeCommitment,
  isReset,
  getIsReset,
  sites,
  contractId,
}) => {
  const [timesheetWorkFlow, setTimesheetWorkflow] = useState([]);
  const contractStatus = sessionStorage.getItem("Selected Contract Status");
  const [metadata, setMetadata] = useState({
    min: 0,
    max: 99999999,
    frequency: "NA",
    onCallCoverageFor: [],
    additionalScheduleValue: "0",
    additionalScheduleFrequency: "NA",
    additionalScheduleRequired: false,
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
      isholidays: false,
    },
    serviceWeekDaysDay: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
    },
    serviceWeekDaysNight: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
    },
    serviceDaysArray: [],
    weekdaysCount: "0",
    weekendsCount: "0",
    dependantServiceIncluded: false,
    additionalActivity: [
      {
        activity: "",
        weekdayFrom: null,
        weekdayTo: null,
        weekendFrom: null,
        weekendTo: null,
        holidayFrom: null,
        holidayTo: null,
        patientMRNRequired: false,
        attendingDocRequired: false,
      },
    ],
    additionalActivityBillable: false,
    additionalActivityPaymentApprovalRequired: false,
    dependencyPayableAmount: "0",
    dependencyFrequency: "PER_DAY",
    patientMRNRequired: false,
    attendingDocRequired: false,
    customizedSchedule: false,
    weekdayFrom: null,
    weekdayTo: null,
    weekdayDuration: 0,
    weekdayMin: 0,
    weekdayMax: 99999999,
    weekdayActivity: "",
    weekdayPayment: 0,
    weekdayPaymentNa: false,
    weekdayFrequency: "WEEK",
    weekdayStartDate: new Date(),
    weekdayEndDate: new Date(),
    weekdayNightsFrom: null,
    weekdayNightsTo: null,
    weekdayNightsDuration: 0,
    weekdayNightsMin: 0,
    weekdayNightsMax: 99999999,
    weekdayNightActivity: "",
    weekdayNightsPayment: 0,
    weekdayNightsPaymentNa: false,
    weekdayNightsFrequency: "WEEK",
    weekdayNightsStartDate: new Date(),
    weekdayNightsEndDate: new Date(),
    weekendFrom: null,
    weekendTo: null,
    weekendStartday: "",
    weekendEndday: "",
    weekendDuration: 0,
    weekendMin: 0,
    weekendMax: 99999999,
    weekendActivity: "",
    weekendPayment: 0,
    weekendPaymentNa: false,
    weekendFrequency: "WEEK",
    weekendStartDate: new Date(),
    weekendEndDate: new Date(),
    holidayFrom: null,
    holidayTo: null,
    holidayFrequency: "WEEK",
    holidayTerm: "PRIOR_DAY",
    holidayDuration: 0,
    holidayMin: 0,
    holidayMax: 99999999,
    holidayActivity: "",
    holidayPayment: 0,
    holidayPaymentNa: false,
    professionalServiceRequired: false,
  });

  useEffect(() => {
    if (isReset) {
      resetMetadata();
      getIsReset(false);
    }
  }, [isReset]);

  const resetMetadata = () => {
    setMetadata({
      min: 0,
      max: 99999999,
      frequency: "NA",
      onCallCoverageFor: [],
      additionalScheduleValue: "0",
      additionalScheduleFrequency: "NA",
      additionalScheduleRequired: false,
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
        isholidays: false,
      },
      serviceWeekDaysDay: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
      },
      serviceWeekDaysNight: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
      },
      serviceDaysArray: [],
      weekdaysCount: "0",
      weekendsCount: "0",
      dependantServiceIncluded: false,
      additionalActivity: [
        {
          activity: "",
          weekdayFrom: null,
          weekdayTo: null,
          weekendFrom: null,
          weekendTo: null,
          holidayFrom: null,
          holidayTo: null,
          patientMRNRequired: false,
          attendingDocRequired: false,
        },
      ],
      additionalActivityBillable: false,
      additionalActivityPaymentApprovalRequired: false,
      dependencyPayableAmount: "0",
      dependencyFrequency: "PER_DAY",
      patientMRNRequired: false,
      attendingDocRequired: false,
      customizedSchedule: false,
      weekdayFrom: null,
      weekdayTo: null,
      weekdayDuration: 0,
      weekdayMin: 0,
      weekdayMax: 99999999,
      weekdayActivity: "",
      weekdayPayment: 0,
      weekdayPaymentNa: false,
      weekdayFrequency: "WEEK",
      weekdayStartDate: new Date(),
      weekdayEndDate: new Date(),
      weekdayNightsFrom: null,
      weekdayNightsTo: null,
      weekdayNightsDuration: 0,
      weekdayNightsMin: 0,
      weekdayNightsMax: 99999999,
      weekdayNightActivity: "",
      weekdayNightsPayment: 0,
      weekdayNightsPaymentNa: false,
      weekdayNightsFrequency: "WEEK",
      weekdayNightsStartDate: new Date(),
      weekdayNightsEndDate: new Date(),
      weekendFrom: null,
      weekendTo: null,
      weekendStartday: "",
      weekendEndday: "",
      weekendDuration: 0,
      weekendMin: 0,
      weekendMax: 99999999,
      weekendActivity: "",
      weekendPayment: 0,
      weekendPaymentNa: false,
      weekendFrequency: "WEEK",
      weekendStartDate: new Date(),
      weekendEndDate: new Date(),
      holidayFrom: null,
      holidayTo: null,
      holidayFrequency: "WEEK",
      holidayTerm: "PRIOR_DAY",
      holidayDuration: 0,
      holidayMin: 0,
      holidayMax: 99999999,
      holidayActivity: "",
      holidayPayment: 0,
      holidayPaymentNa: false,
      professionalServiceRequired: false,
    });
  };

  const onCustomizeFieldOptionChange = (value) => {
    if (value) {
      setMetadata({
        ...metadata,
        billableService: true,
        rateType: "HOURLY",
        sessionDuration: "0",
        sessionAmount: "0",
        customizedSchedule: value,
        weekdayFrom: null,
        weekdayTo: null,
        weekdayDuration: 0,
        weekdayMin: 0,
        weekdayMax: 99999999,
        weekdayActivity: "",
        weekdayPayment: 0,
        weekdayPaymentNa: false,
        weekdayFrequency: "WEEK",
        weekdayStartDate: new Date(),
        weekdayEndDate: new Date(),
        weekdayNightsFrom: null,
        weekdayNightsTo: null,
        weekdayNightsDuration: 0,
        weekdayNightsMin: 0,
        weekdayNightsMax: 99999999,
        weekdayNightActivity: "",
        weekdayNightsPayment: 0,
        weekdayNightsPaymentNa: false,
        weekdayFrequency: "WEEK",
        weekdayStartDate: new Date(),
        weekdayEndDate: new Date(),
        weekendFrom: null,
        weekendTo: null,
        weekendStartday: "",
        weekendEndday: "",
        weekendDuration: 0,
        weekendMin: 0,
        weekendMax: 99999999,
        weekendActivity: "",
        weekendPayment: 0,
        weekendPaymentNa: false,
        weekendFrequency: "WEEK",
        weekendStartDate: new Date(),
        weekendEndDate: new Date(),
        holidayFrom: null,
        holidayTo: null,
        holidayFrequency: "WEEK",
        holidayTerm: "PRIOR_DAY",
        holidayDuration: 0,
        holidayPayment: 0,
        holidayPaymentNa: false,
        holidayMin: 0,
        holidayMax: 99999999,
        serviceWeekDaysDay: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
        },
        serviceWeekDaysNight: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
        },
        holidayActivity: "",
        patientMRNRequired: false,
        attendingDocRequired: false,
      });
    } else {
      setMetadata({ ...metadata, customizedSchedule: value });
    }
  };

  const [user, setUsers] = useState([]);
  const [addOnWorkFlow, setAddOnWorkFlow] = useState([]);
  const [specified, setSpecified] = useState(0);
  const [title, setTitle] = useState([]);

  const getTimeSheetWorkFlow = async () => {
    const { data: timesheetWorkFlow } = await GET(
      "timesheet-management-service/workflow"
    );
    if (timesheetWorkFlow) {
      setAddOnWorkFlow(timesheetWorkFlow);
    }
  };

  const getAdditionalActivityData = (value) => {
    setMetadata({ ...metadata, additionalActivity: value });
  };

  useEffect(() => {
    if (!metadata?.customizedSchedule) {
      let contractedSchedules = [
        {
          minimum: { value: metadata?.min },
          maximum: { value: metadata?.max },
          frequency: metadata?.frequency,
        },
      ];

      setSpecified(
        SpecifiedCountCalculator(
          contractedSchedules,
          timeCommitment,
          metadata?.additionalScheduleFrequency,
          metadata?.additionalScheduleValue
        )
      );
    } else {
      let contractedSchedules = [
        {
          minimum: { value: metadata?.weekdayMin },
          maximum: { value: metadata?.weekdayMax },
          frequency: metadata?.weekdayFrequency,
        },
        {
          minimum: { value: metadata?.weekendMin },
          maximum: { value: metadata?.weekendMax },
          frequency: metadata?.weekendFrequency,
        },
        {
          minimum: { value: metadata?.holidayMin },
          maximum: { value: metadata?.holidayMax },
          frequency: metadata?.holidayFrequency,
        },
      ];
      setSpecified(
        SpecifiedCountCalculator(
          contractedSchedules,
          timeCommitment,
          metadata?.additionalScheduleFrequency,
          metadata?.additionalScheduleValue
        )
      );
    }
  }, [
    metadata?.frequency,
    metadata?.min,
    metadata?.additionalScheduleValue,
    metadata?.additionalScheduleFrequency,
    timeCommitment?.value,
    metadata?.weekdayMin,
    metadata?.weekdayFrequency,
    metadata?.weekendMin,
    metadata?.weekendFrequency,
    metadata?.holidayMin,
    metadata?.holidayFrequency,
    metadata?.customizedSchedule,
  ]);

  useEffect(() => {
    setSelectedValues();
  }, [serviceSelected, addOnWorkFlow, user]);

  const setSelectedValues = () => {
    let dependentActivities = [];
    serviceSelected?.dependentService?.additionalServices?.map((data) => {
      dependentActivities.push({
        activity: data?.activity?.activity,
        weekdayFrom: GetDateFromHours(data?.weekday?.from?.toString() || ""),
        weekdayTo: GetDateFromHours(data?.weekday?.to?.toString() || ""),
        weekendFrom: GetDateFromHours(data?.weekend?.from?.toString() || ""),
        weekendTo: GetDateFromHours(data?.weekend?.to?.toString() || ""),
        holidayFrom: GetDateFromHours(data?.holiday?.from?.toString() || ""),
        holidayTo: GetDateFromHours(data?.holiday?.to?.toString() || ""),
        patientMRNRequired: data?.patientMRNRequired,
        attendingDocRequired: data?.attendingDocRequired,
      });
    });

    let workflowData =
      addOnWorkFlow
        ?.filter(
          (data) => data?.id === serviceSelected?.dependentService?.workFlow?.id
        )
        ?.map((data) => data?.workFlowMap?.workflow)[0] || {};
    let workFlowValues = Object?.values(workflowData);
    let approver = user
      ?.filter((data) => data?.id === workFlowValues?.[0]?.workFlowUser?.id)
      ?.map((data) => data)[0];

    if (Object.keys(serviceSelected)?.length !== 0) {
      setMetadata({
        ...metadata,
        refId: serviceSelected?.refId,
        min: serviceSelected?.contractedSchedules?.[0]?.minimum?.value,
        max: serviceSelected?.contractedSchedules?.[0]?.maximum?.value,
        frequency: serviceSelected?.contractedSchedules?.[0]?.frequency,
        onCallCoverageFor:
          serviceSelected?.activityResponse?.dataMap?.onCallCoverageFor,
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
        serviceWeekDaysDay:
          serviceSelected?.customschedule?.weekdayDay?.serviceWeekDays,
        serviceWeekDaysNight:
          serviceSelected?.customschedule?.weekdayNight?.serviceWeekDays,
        additionalActivity: dependentActivities,
        additionalActivityBillable:
          serviceSelected?.dependentService?.billableService,
        additionalActivityPaymentApprovalRequired:
          serviceSelected?.dependentService?.paymentApprovalRequired,
        dependencyPayableAmount:
          serviceSelected?.dependentService?.payableAmount?.value,
        dependencyFrequency: serviceSelected?.dependentService?.frequency,
        dependantServiceIncluded: serviceSelected?.dependantServiceIncluded,
        weekdayFrom: GetDateFromHours(
          serviceSelected?.customschedule?.weekdayDay?.from?.toString() || ""
        ),
        weekdayTo: GetDateFromHours(
          serviceSelected?.customschedule?.weekdayDay?.to?.toString() || ""
        ),
        weekdayDuration:
          serviceSelected?.customschedule?.weekdayDay?.duration?.hours,
        weekdayMin:
          serviceSelected?.customschedule?.weekdayDay?.target?.minimum?.value,
        weekdayMax:
          serviceSelected?.customschedule?.weekdayDay?.target?.maximum?.value,
        weekdayActivity:
          serviceSelected?.customschedule?.weekdayDay?.activity?.activity,
        weekdayPayment:
          serviceSelected?.customschedule?.weekdayDay?.payableAmount?.value,
        weekdayPaymentNa:
          serviceSelected?.customschedule?.weekdayDay?.paymentNotApplicable,
        weekdayFrequency:
          serviceSelected?.customschedule?.weekdayDay?.target?.frequency,
        weekdayNightsFrom: GetDateFromHours(
          serviceSelected?.customschedule?.weekdayNight?.from?.toString() || ""
        ),
        weekdayNightsTo: GetDateFromHours(
          serviceSelected?.customschedule?.weekdayNight?.to?.toString() || ""
        ),
        weekdayNightsDuration:
          serviceSelected?.customschedule?.weekdayNight?.duration?.hours,
        weekdayNightsMin:
          serviceSelected?.customschedule?.weekdayNight?.target?.minimum?.value,
        weekdayNightsMax:
          serviceSelected?.customschedule?.weekdayNight?.target?.maximum?.value,
        weekdayNightActivity:
          serviceSelected?.customschedule?.weekdayNight?.activity?.activity,
        weekdayNightsPayment:
          serviceSelected?.customschedule?.weekdayNight?.payableAmount?.value,
        weekdayNightsPaymentNa:
          serviceSelected?.customschedule?.weekdayNight?.paymentNotApplicable,
        weekdayNightsFrequency:
          serviceSelected?.customschedule?.weekdayNight?.target?.frequency,
        weekendFrom: GetDateFromHours(
          serviceSelected?.customschedule?.weekend?.from?.toString() || ""
        ),
        weekendTo: GetDateFromHours(
          serviceSelected?.customschedule?.weekend?.to?.toString() || ""
        ),
        weekendStartday: serviceSelected?.customschedule?.weekend?.startDay,
        weekendEndday: serviceSelected?.customschedule?.weekend?.endDay,
        weekendDuration:
          serviceSelected?.customschedule?.weekend?.duration?.hours,
        weekendMin:
          serviceSelected?.customschedule?.weekend?.target?.minimum?.value,
        weekendMax:
          serviceSelected?.customschedule?.weekend?.target?.maximum?.value,
        weekendActivity:
          serviceSelected?.customschedule?.weekend?.activity?.activity,
        weekendPayment:
          serviceSelected?.customschedule?.weekend?.payableAmount?.value,
        weekendPaymentNa:
          serviceSelected?.customschedule?.weekend?.paymentNotApplicable,
        weekendFrequency:
          serviceSelected?.customschedule?.weekend?.target?.frequency,
        holidayFrom: GetDateFromHours(
          serviceSelected?.customschedule?.holiday?.from?.toString() || ""
        ),
        holidayTo: GetDateFromHours(
          serviceSelected?.customschedule?.holiday?.to?.toString() || ""
        ),
        holidayFrequency:
          serviceSelected?.customschedule?.holiday?.target?.frequency,
        holidayTerm: serviceSelected?.customschedule?.holiday?.holidayTerm,
        holidayDuration:
          serviceSelected?.customschedule?.holiday?.duration?.hours,
        holidayMin:
          serviceSelected?.customschedule?.holiday?.target?.minimum?.value,
        holidayMax:
          serviceSelected?.customschedule?.holiday?.target?.maximum?.value,
        holidayActivity:
          serviceSelected?.customschedule?.holiday?.activity?.activity,
        holidayPayment:
          serviceSelected?.customschedule?.holiday?.payableAmount?.value,
        holidayPaymentNa:
          serviceSelected?.customschedule?.holiday?.paymentNotApplicable,
        patientMRNRequired: serviceSelected?.patientMRNRequired,
        attendingDocRequired: serviceSelected?.attendingDocRequired,
        customizedSchedule: serviceSelected?.customizedSchedule,
        approver: approver,
        workflowId: serviceSelected?.dependentService?.workFlow?.id,
        workflowName:
          serviceSelected?.dependentService?.workFlow?.workFlowName?.name,
        professionalServiceRequired:
          serviceSelected?.professionalServiceRequired,
      });
    }
  };
  const limit5 = 5;

  useEffect(() => {
    getMetaData(metadata);
  }, [metadata]);

  useEffect(() => {
    getTimeSheetWorkFlow();
    getUserData();
  }, []);

  const handleValueChange = (name, value) => {
    if (name === "frequency" && (value === "NA" || value === "")) {
      setMetadata({ ...metadata, [name]: "NA", min: 0, max: 99999999 });
    } else {
      setMetadata({ ...metadata, [name]: value });
    }
  };

  const getUserData = async () => {
    let siteId = sites?.map((data) => data?.id);
    let deptId = [];
    sites?.map((data) =>
      data?.departmentList?.departments?.map((dept) => {
        deptId.push(`${data?.id}#${dept?.id}`);
      })
    );
    let encodedDept = encodeURIComponent(deptId);
    let uri = `user-management-service/user/workFlowUser?sites=${siteId}&sitedepartments=${encodedDept}&contractIdToIgnore=${contractId}`;
    const { data: userList } = await GET(uri);
    if (userList) {
      setUsers(userList);
      let temp = [];
      userList?.map((data) =>
        data?.sites?.sites?.map((site) => {
          if (
            data?.name?.firstName &&
            site?.siteName?.siteName &&
            site?.siteResponsibility?.title
          ) {
            if (
              site?.siteResponsibility?.title !== "" &&
              site?.siteResponsibility?.title !== undefined &&
              site?.siteResponsibility?.title !== null
            ) {
              temp.push({
                fname: data?.name?.firstName,
                lname: data?.name?.lastName,
                suffix: data?.name?.suffix?.suffix || "",
                site: site?.siteName?.siteName,
                title: site?.siteResponsibility?.title,
                id: data?.id,
                approver:
                  data?.roles
                    ?.filter((role) => role?.roleName === "Approver")
                    ?.map((data) => data)?.length !== 0
                    ? true
                    : false,
                reviewer:
                  data?.roles
                    ?.filter((role) => role?.roleName === "Reviewer")
                    ?.map((data) => data)?.length !== 0
                    ? true
                    : false,
              });
            }

            site?.departmentList?.departments?.map((dept) => {
              if (
                dept?.departmentResponsibility?.title !== "" &&
                dept?.departmentResponsibility?.title !== undefined &&
                dept?.departmentResponsibility?.title !== null
              ) {
                temp.push({
                  fname: data?.name?.firstName,
                  lname: data?.name?.lastName,
                  suffix: data?.name?.suffix?.suffix || "",
                  site: dept?.departmentName?.name,
                  title: dept?.departmentResponsibility?.title,
                  id: data?.id,
                  approver:
                    data?.roles
                      ?.filter((role) => role?.roleName === "Approver")
                      ?.map((data) => data)?.length !== 0
                      ? true
                      : false,
                  reviewer:
                    data?.roles
                      ?.filter((role) => role?.roleName === "Reviewer")
                      ?.map((data) => data)?.length !== 0
                      ? true
                      : false,
                });
              }
            });
          }
        })
      );
      setTitle(temp);
    }
  };

  const getServiceDaysMetadata = (serviceDays) => {
    let temp = [];
    if (
      !temp.includes("Weekdays") &&
      (serviceDays?.weekdaysSpecific ||
        serviceDays?.monday ||
        serviceDays?.tuesday ||
        serviceDays?.wednesday ||
        serviceDays?.thursday ||
        serviceDays?.friday)
    ) {
      temp.push("Weekdays");
    }

    if (
      !temp.includes("Weekends") &&
      (serviceDays?.weekendsSpecific ||
        serviceDays?.saturday ||
        serviceDays?.sunday)
    ) {
      temp.push("Weekends");
    }

    if (!temp.includes("Holidays") && serviceDays?.isholidays) {
      temp.push("Holidays");
    }
    setMetadata({
      ...metadata,
      serviceDays: serviceDays,
      serviceDaysArray: temp,
    });
  };

  const handleOnCallCoverageFor = (value, e) => {
    if (e.target.checked) {
      let temp = metadata?.onCallCoverageFor || [];
      temp.push(value);
      setMetadata({ ...metadata, onCallCoverageFor: temp });
    } else {
      let temp =
        metadata?.onCallCoverageFor
          ?.filter((data) => data !== value)
          ?.map((data) => data) || [];
      setMetadata({ ...metadata, onCallCoverageFor: temp });
    }
  };

  const onTotalSessionChange = (e) => {
    if (e >= 0) {
      let value = e.slice(0, 5);
      handleValueChange("totalSession", value);
    }
  };

  const updateWorkingPeriod = (e) => {
    setMetadata({ ...metadata, workingTimeFrom: e });
  };

  const addAdditionalEntry = () => {
    let temp = metadata?.additionalActivity;
    temp.push({
      activity: "",
      weekdayFrom: null,
      weekdayTo: null,
      weekendFrom: null,
      weekendTo: null,
      holidayFrom: null,
      holidayTo: null,
      patientMRNRequired: false,
      attendingDocRequired: false,
    });
    setMetadata({ ...metadata, aditionalActivity: temp });
  };

  const onCustomizeFieldChange = (value, name) => {
    if (
      [
        "holidayFrequency",
        "weekdayFrequency",
        "weekdayNightsFrequency",
        "weekendFrequency",
      ].includes(name) &&
      value === "NA"
    ) {
      if (name === "weekdayFrequency") {
        setMetadata({
          ...metadata,
          [name]: value,
          weekdayMin: 0,
          weekdayMax: 99999999,
        });
      }
      if (name === "weekdayNightsFrequency") {
        setMetadata({
          ...metadata,
          [name]: value,
          weekdayNightsMin: 0,
          weekdayNightsMax: 99999999,
        });
      }
      if (name === "weekendFrequency") {
        setMetadata({
          ...metadata,
          [name]: value,
          weekendMin: 0,
          weekendMax: 99999999,
        });
      }
      if (name === "holidayFrequency") {
        setMetadata({
          ...metadata,
          [name]: value,
          holidayMin: 0,
          holidayMax: 99999999,
        });
      }
    } else {
      setMetadata({ ...metadata, [name]: value });
    }
  };

  return (
    <div>
      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="On Call Coverage For *" />
        <div className={style.spaceBetween}>
          <CommonCheckBox
            checked={metadata?.onCallCoverageFor?.includes("InPatient")}
            className={`${style.fourFieldWidth}`}
            onChange={(e) => handleOnCallCoverageFor("InPatient", e)}
            label="Inpatient"
          />
          <CommonCheckBox
            checked={metadata?.onCallCoverageFor?.includes("Ambulatory")}
            className={`${style.marginLeft10} ${style.fourFieldWidth}`}
            onChange={(e) => handleOnCallCoverageFor("Ambulatory", e)}
            label="Ambulatory"
          />
          <CommonCheckBox
            checked={metadata?.onCallCoverageFor?.includes("L & D")}
            className={`${style.marginLeft10} ${style.fourFieldWidth}`}
            onChange={(e) => handleOnCallCoverageFor("L & D", e)}
            label="L & D"
          />
          <CommonCheckBox
            checked={metadata?.onCallCoverageFor?.includes("ED")}
            className={`${style.marginLeft10} ${style.fourFieldWidth}`}
            onChange={(e) => handleOnCallCoverageFor("ED", e)}
            label="ED"
          />
        </div>
      </div>
      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Professional Consult Required" />
        <div className={style.onCallBillableGrid}>
          <CommonSwitch
            checked={metadata?.professionalServiceRequired}
            label={metadata?.professionalServiceRequired ? "YES" : "NO"}
            className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
            onChange={(e) =>
              setMetadata({
                ...metadata,
                professionalServiceRequired:
                  !metadata?.professionalServiceRequired,
              })
            }
          />
        </div>
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Allowable Service Days*" />
        <ServiceDays
          setMetaData={getServiceDaysMetadata}
          selectedService={serviceSelected}
          isReset={isReset}
          setIsReset={getIsReset}
        />
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Same On Call Schedule For All Days" />
        <div className={style.onCallBillableGrid}>
          <CommonSwitch
            checked={!metadata?.customizedSchedule}
            label={!metadata?.customizedSchedule ? "YES" : "NO"}
            className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
            onChange={(e) =>
              onCustomizeFieldOptionChange(!metadata?.customizedSchedule)
            }
          />
        </div>
      </div>
      {metadata?.customizedSchedule && (
        <div className={`${style.addonAddBox} ${style.marginTop20}`}>
          <div className={`${style.addManagerGrid}`}>
            <CommonLabel value="Weekday Days" />
            <div>
              <div className={style.displayInRow}>
                <div className={style.displayInRow}>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysDay?.monday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysDay: {
                                ...prevState.serviceWeekDaysDay,
                                monday: !metadata?.serviceWeekDaysDay?.monday,
                              },
                            }))
                    }
                  >
                    M
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysDay?.tuesday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysDay: {
                                ...prevState.serviceWeekDaysDay,
                                tuesday: !metadata?.serviceWeekDaysDay?.tuesday,
                              },
                            }))
                    }
                  >
                    T
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysDay?.wednesday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysDay: {
                                ...prevState.serviceWeekDaysDay,
                                wednesday:
                                  !metadata?.serviceWeekDaysDay?.wednesday,
                              },
                            }))
                    }
                  >
                    W
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysDay?.thursday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysDay: {
                                ...prevState.serviceWeekDaysDay,
                                thursday:
                                  !metadata?.serviceWeekDaysDay?.thursday,
                              },
                            }))
                    }
                  >
                    T
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysDay?.friday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysDay: {
                                ...prevState.serviceWeekDaysDay,
                                friday: !metadata?.serviceWeekDaysDay?.friday,
                              },
                            }))
                    }
                  >
                    F
                  </div>
                </div>
              </div>
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.displayInRow}>
                  <TimePicker
                    useAmPm={false}
                    onChange={(e) => {
                      onCustomizeFieldChange(e, "weekdayFrom");
                    }}
                    disabled={contractStatus === "ACTIVE" ? true : false}
                    value={
                      metadata?.weekdayFrom === null
                        ? null
                        : new Date(metadata?.weekdayFrom)
                    }
                  />
                  <p
                    className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}
                  >
                    To
                  </p>
                  <TimePicker
                    useAmPm={false}
                    onChange={(e) => {
                      onCustomizeFieldChange(e, "weekdayTo");
                    }}
                    disabled={contractStatus === "ACTIVE" ? true : false}
                    value={
                      metadata?.weekdayTo === null
                        ? null
                        : new Date(metadata?.weekdayTo)
                    }
                  />
                  <div
                    className={` ${style.marginLeft20} ${style.durationWidth}`}
                  >
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
                      value={metadata?.weekdayDuration}
                      onChange={(e) =>
                        e.target.value >= 0 &&
                        onCustomizeFieldChange(
                          e.target.value,
                          "weekdayDuration"
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Activity" />
            </div>
            <div className={style.displayInRow}>
              <CommonTextField
                className={style.twoCol}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "weekdayActivity")
                }
                value={metadata?.weekdayActivity}
                type="text"
              />
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Number of On Call Duty Days*" />
            </div>
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays} value={metadata?.weekdayMin} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "weekdayMin"
                  )
                }
                value={metadata?.weekdayMin === 0 ? "" : metadata?.weekdayMin}
                type="number"
                disabled={metadata?.weekdayFrequency === "NA"}
              />
              {/* <CommonTextField
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                                }}
                                className={style.serviceProvidedEditableTextStyle}
                                onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')}
                                defaultValue={metadata?.weekdayMin}
                            /> */}
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays} value={metadata?.weekdayMax} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMax')} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "weekdayMax"
                  )
                }
                value={
                  metadata?.weekdayMax === 0 ||
                  metadata?.weekdayMax === 99999999
                    ? ""
                    : metadata?.weekdayMax
                }
                type="number"
                disabled={metadata?.weekdayFrequency === "NA"}
              />
              <CommonSelectField
                className={`${style.fullWidth} ${style.marginLeft20}`}
                value={metadata?.weekdayFrequency || ""}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "weekdayFrequency")
                }
                firstOptionLabel={"Select Frequency"}
                firstOptionValue={""}
                valueList={[
                  "NA",
                  "WEEK",
                  "MONTH",
                  "CONTRACT_YEAR",
                  "EVERY_OTHER_WEEK",
                ]}
                labelList={[
                  "As Needed",
                  "Per Week",
                  "Per Month",
                  "Per Year",
                  "Every Other Week",
                ]}
                disabledList={[false, false, false]}
              />
            </div>
          </div>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Payment Amount*" />
            </div>
            <div className={style.displayInRow}>
              <div className={`${style.threeFieldWidth}`}>
                <CommonTextField
                  type="number"
                  min="0"
                  disabled={metadata?.weekdayPaymentNa}
                  value={metadata?.weekdayPayment}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ fontSize: 10 }}>
                        $
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      weekdayPayment: parseFloat(e.target.value),
                      weekdayPaymentNa: false,
                    })
                  }
                />
              </div>
              {/* <div className={style.verticalAlignCenter}> */}
              <CommonLabel
                className={`${style.marginLeft20} ${style.threeFieldWidth}`}
                value={`Per Weekday Days`}
              />
              {/* </div> */}
              <CommonCheckBox
                value="NA"
                className={`${style.marginLeft20} ${style.fullWidth}`}
                label="NA"
                checked={metadata?.weekdayPaymentNa}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    weekdayPayment: 0,
                    weekdayPaymentNa: e.target.checked,
                  })
                }
              />
            </div>
          </div>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <CommonLabel value="Weekday Nights" />
            <div>
              <div className={style.displayInRow}>
                <div className={style.displayInRow}>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysNight?.monday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysNight: {
                                ...prevState.serviceWeekDaysNight,
                                monday: !metadata?.serviceWeekDaysNight?.monday,
                              },
                            }))
                    }
                  >
                    M
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysNight?.tuesday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysNight: {
                                ...prevState.serviceWeekDaysNight,
                                tuesday:
                                  !metadata?.serviceWeekDaysNight?.tuesday,
                              },
                            }))
                    }
                  >
                    T
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysNight?.wednesday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysNight: {
                                ...prevState.serviceWeekDaysNight,
                                wednesday:
                                  !metadata?.serviceWeekDaysNight?.wednesday,
                              },
                            }))
                    }
                  >
                    W
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysNight?.thursday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysNight: {
                                ...prevState.serviceWeekDaysNight,
                                thursday:
                                  !metadata?.serviceWeekDaysNight?.thursday,
                              },
                            }))
                    }
                  >
                    T
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.serviceWeekDaysNight?.friday
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            setMetadata((prevState) => ({
                              ...metadata,
                              serviceWeekDaysNight: {
                                ...prevState.serviceWeekDaysNight,
                                friday: !metadata?.serviceWeekDaysNight?.friday,
                              },
                            }))
                    }
                  >
                    F
                  </div>
                </div>
              </div>

              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.displayInRow}>
                  <TimePicker
                    useAmPm={false}
                    onChange={(e) => {
                      onCustomizeFieldChange(e, "weekdayNightsFrom");
                    }}
                    disabled={contractStatus === "ACTIVE" ? true : false}
                    value={
                      metadata?.weekdayNightsFrom === null
                        ? null
                        : new Date(metadata?.weekdayNightsFrom)
                    }
                  />
                  <p
                    className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}
                  >
                    To
                  </p>
                  <TimePicker
                    useAmPm={false}
                    onChange={(e) => {
                      onCustomizeFieldChange(e, "weekdayNightsTo");
                    }}
                    disabled={contractStatus === "ACTIVE" ? true : false}
                    value={
                      metadata?.weekdayNightsTo === null
                        ? null
                        : new Date(metadata?.weekdayNightsTo)
                    }
                  />
                  <div
                    className={` ${style.marginLeft20} ${style.durationWidth}`}
                  >
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
                      value={metadata?.weekdayNightsDuration}
                      onChange={(e) =>
                        e.target.value >= 0 &&
                        onCustomizeFieldChange(
                          e.target.value,
                          "weekdayNightsDuration"
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Activity" />
            </div>
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElement}>MIN</div>
                                    <EditableText disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays} value={metadata?.weekdayMin} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
                                </div> */}
              <CommonTextField
                className={style.twoCol}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "weekdayNightActivity")
                }
                value={metadata?.weekdayNightActivity}
                type="text"
                // disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays}
              />
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Number of On Call Duty Days*" />
            </div>
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays} value={metadata?.weekdayMin} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "weekdayNightsMin"
                  )
                }
                value={
                  metadata?.weekdayNightsMin === 0
                    ? ""
                    : metadata?.weekdayNightsMin
                }
                type="number"
                disabled={metadata?.weekdayNightsFrequency === "NA"}
              />
              {/* <CommonTextField
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                                }}
                                className={style.serviceProvidedEditableTextStyle}
                                onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')}
                                defaultValue={metadata?.weekdayMin}
                            /> */}
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays} value={metadata?.weekdayMax} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMax')} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "weekdayNightsMax"
                  )
                }
                value={
                  metadata?.weekdayNightsMax === 0 ||
                  metadata?.weekdayNightsMax === 99999999
                    ? ""
                    : metadata?.weekdayNightsMax
                }
                type="number"
                disabled={metadata?.weekdayNightsFrequency === "NA"}
              />
              <CommonSelectField
                className={`${style.fullWidth} ${style.marginLeft20}`}
                value={metadata?.weekdayNightsFrequency || ""}
                onChange={(e) =>
                  onCustomizeFieldChange(
                    e.target.value,
                    "weekdayNightsFrequency"
                  )
                }
                firstOptionLabel={"Select Frequency"}
                firstOptionValue={""}
                valueList={[
                  "NA",
                  "WEEK",
                  "MONTH",
                  "CONTRACT_YEAR",
                  "EVERY_OTHER_WEEK",
                ]}
                labelList={[
                  "As Needed",
                  "Per Week",
                  "Per Month",
                  "Per Year",
                  "Every Other Week",
                ]}
                disabledList={[false, false, false]}
              />
            </div>
          </div>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Payment Amount*" />
            </div>
            <div className={style.displayInRow}>
              <div className={style.threeFieldWidth}>
                <CommonTextField
                  type="number"
                  min="0"
                  disabled={metadata?.weekdayNightsPaymentNa}
                  value={metadata?.weekdayNightsPayment}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ fontSize: 10 }}>
                        $
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      weekdayNightsPayment: parseFloat(e.target.value),
                      weekdayNightsPaymentNa: false,
                    })
                  }
                />
              </div>
              {/* <div className={style.verticalAlignCenter}> */}
              <CommonLabel
                className={`${style.marginLeft20} ${style.threeFieldWidth}`}
                value={`Per Weekday Nights`}
              />
              {/* </div> */}
              <CommonCheckBox
                className={`${style.marginLeft20} ${style.fullWidth}`}
                value="NA"
                label="NA"
                checked={metadata?.weekdayNightsPaymentNa}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    weekdayNightsPayment: 0,
                    weekdayNightsPaymentNa: e.target.checked,
                  })
                }
              />
            </div>
          </div>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <CommonLabel value="Weekend" />
            <div>
              <div className={style.displayInRow}>
                <div className={style.displayInRow}>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendStartday === "FRIDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange("FRIDAY", "weekendStartday")
                    }
                  >
                    F
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendStartday === "SATURDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange(
                              "SATURDAY",
                              "weekendStartday"
                            )
                    }
                  >
                    S
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendStartday === "SUNDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange("SUNDAY", "weekendStartday")
                    }
                  >
                    S
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendStartday === "MONDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange("MONDAY", "weekendStartday")
                    }
                  >
                    M
                  </div>
                </div>
                <div className={style.alignCenter}>
                  <p
                    className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop10} ${style.marginRight}`}
                  >
                    To
                  </p>
                </div>
                <div className={`${style.displayInRow} ${style.marginLeft20}`}>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendEndday === "FRIDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange("FRIDAY", "weekendEndday")
                    }
                  >
                    F
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendEndday === "SATURDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange("SATURDAY", "weekendEndday")
                    }
                  >
                    S
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendEndday === "SUNDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange("SUNDAY", "weekendEndday")
                    }
                  >
                    S
                  </div>
                  <div
                    className={`${style.dayStyle} ${style.alignCenter} ${
                      style.cursorPointer
                    } ${
                      metadata?.weekendEndday === "MONDAY"
                        ? style.selectedDay
                        : ""
                    }`}
                    onClick={
                      contractStatus === "ACTIVE"
                        ? () => {}
                        : () =>
                            onCustomizeFieldChange("MONDAY", "weekendEndday")
                    }
                  >
                    M
                  </div>
                </div>
              </div>

              <div className={`${style.displayInRow} ${style.marginTop20}`}>
                <TimePicker
                  useAmPm={false}
                  onChange={(e) => {
                    onCustomizeFieldChange(e, "weekendFrom");
                  }}
                  disabled={contractStatus === "ACTIVE" ? true : false}
                  value={
                    metadata?.weekendFrom === null
                      ? null
                      : new Date(metadata?.weekendFrom)
                  }
                />
                <p
                  className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}
                >
                  To
                </p>
                <TimePicker
                  useAmPm={false}
                  onChange={(e) => {
                    onCustomizeFieldChange(e, "weekendTo");
                  }}
                  disabled={contractStatus === "ACTIVE" ? true : false}
                  value={
                    metadata?.weekendTo === null
                      ? null
                      : new Date(metadata?.weekendTo)
                  }
                />
                <div
                  className={` ${style.marginLeft20} ${style.durationWidth}`}
                >
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
                    value={metadata?.weekendDuration}
                    onChange={(e) =>
                      e.target.value >= 0 &&
                      onCustomizeFieldChange(e.target.value, "weekendDuration")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Activity" />
            </div>
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElement}>MIN</div>
                                    <EditableText disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays} value={metadata?.weekdayMin} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
                                </div> */}
              <CommonTextField
                className={style.twoCol}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "weekendActivity")
                }
                value={metadata?.weekendActivity}
                type="text"
                // disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays}
              />
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Number of On Call Weekends*" />
            </div>
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText disabled={metadata?.weekendFrequency === 'NA' || !metadata?.serviceDays?.weekEnds} value={metadata?.weekendMin} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekendMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "weekendMin"
                  )
                }
                value={metadata?.weekendMin === 0 ? "" : metadata?.weekendMin}
                type="number"
                disabled={metadata?.weekendFrequency === "NA"}
              />
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText disabled={metadata?.weekendFrequency === 'NA' || !metadata?.serviceDays?.weekEnds} value={metadata?.weekendMax} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekendMax')} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "weekendMax"
                  )
                }
                value={
                  metadata?.weekendMax === 0 ||
                  metadata?.weekendMax === 99999999
                    ? ""
                    : metadata?.weekendMax
                }
                type="number"
                disabled={metadata?.weekendFrequency === "NA"}
              />
              <CommonSelectField
                className={`${style.fullWidth} ${style.marginLeft20}`}
                value={metadata?.weekendFrequency || ""}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "weekendFrequency")
                }
                firstOptionLabel={"Select Frequency"}
                firstOptionValue={""}
                valueList={[
                  "NA",
                  "WEEK",
                  "MONTH",
                  "CONTRACT_YEAR",
                  "EVERY_OTHER_WEEK",
                ]}
                labelList={[
                  "As Needed",
                  "Per Week",
                  "Per Month",
                  "Per Year",
                  "Every Other Week",
                ]}
                disabledList={[false, false, false]}
              />
            </div>
          </div>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Payment Amount*" />
            </div>
            <div className={style.displayInRow}>
              <div className={style.threeFieldWidth}>
                <CommonTextField
                  type="number"
                  min="0"
                  disabled={metadata?.weekendPaymentNa}
                  value={metadata?.weekendPayment}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ fontSize: 10 }}>
                        $
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      weekendPayment: parseFloat(e.target.value),
                      weekendPaymentNa: false,
                    })
                  }
                />
              </div>
              {/* <div className={style.verticalAlignCenter}> */}
              <CommonLabel
                className={`${style.marginLeft20} ${style.threeFieldWidth}`}
                value={`Per Weekend`}
              />
              {/* </div> */}
              <CommonCheckBox
                className={`${style.marginLeft20} ${style.fullWidth}`}
                value="NA"
                label="NA"
                checked={metadata?.weekendPaymentNa}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    weekendPayment: 0,
                    weekendPaymentNa: e.target.checked,
                  })
                }
              />
            </div>
          </div>
          {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Prior To Holiday</div>
                    <div className={style.displayInRow}>
                        <TimePicker
                            useAmPm={false}
                        />
                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                        <TimePicker
                            useAmPm={false}
                        />
                        <div className={` ${style.marginLeft20} ${style.durationWidth}`}>
                            <TextField
                                size="small"
                                type="tel"
                                maxLength="3"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                }}
                                inputProps={{
                                    style: {
                                        height: 15,
                                    },
                                }}
                            // value={metadata?.sessionDuration}
                            // onChange={(e) => e.target.value >= 0 && setMetadata({ ...metadata, sessionDuration: e.target.value, sessionAmount: '0' })}
                            />
                        </div>
                    </div>
                </div> */}
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <CommonLabel value="Holiday" />
            <div>
              <CommonSelectField
                className={`${style.threeFieldWidth}`}
                value={metadata?.holidayTerm || ""}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "holidayTerm")
                }
                firstOptionLabel={"Select Holiday"}
                firstOptionValue={""}
                valueList={["PRIOR_DAY", "ON_DAY", "NEXT_DAY"]}
                labelList={[
                  "Prior to Holiday",
                  "On Holiday",
                  "Next to Holiday",
                ]}
                disabledList={[false, false]}
              />
              <div className={`${style.displayInRow} ${style.marginTop20}`}>
                <TimePicker
                  useAmPm={false}
                  onChange={(e) => {
                    onCustomizeFieldChange(e, "holidayFrom");
                  }}
                  value={
                    metadata?.holidayFrom === null
                      ? null
                      : new Date(metadata?.holidayFrom)
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
                  onChange={(e) => {
                    onCustomizeFieldChange(e, "holidayTo");
                  }}
                  value={
                    metadata?.holidayTo === null
                      ? null
                      : new Date(metadata?.holidayTo)
                  }
                  disabled={contractStatus === "ACTIVE" ? true : false}
                />
                <div className={`${style.marginLeft20} ${style.durationWidth}`}>
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
                    value={metadata?.holidayDuration}
                    onChange={(e) =>
                      e.target.value >= 0 &&
                      onCustomizeFieldChange(e.target.value, "holidayDuration")
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Activity" />
            </div>
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                    <div className={style.textElement}>MIN</div>
                                    <EditableText disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays} value={metadata?.weekdayMin} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
                                </div> */}
              <CommonTextField
                className={style.twoCol}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "holidayActivity")
                }
                value={metadata?.holidayActivity}
                type="text"
                // disabled={metadata?.weekdayFrequency === 'NA' || !metadata?.serviceDays?.weekDays}
              />
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Number of On Call Holiday Days*" />
            </div>
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText disabled={metadata?.holidayFrequency === 'NA' || !metadata?.serviceDays?.isholidays} value={metadata?.holidayMin} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'holidayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "holidayMin"
                  )
                }
                value={metadata?.holidayMin === 0 ? "" : metadata?.holidayMin}
                type="number"
                disabled={metadata?.holidayFrequency === "NA"}
              />
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText disabled={metadata?.holidayFrequency === 'NA' || !metadata?.serviceDays?.isholidays} value={metadata?.holidayMax} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'holidayMax')} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  onCustomizeFieldChange(
                    parseFloat(e.target.value.slice(0, 5)),
                    "holidayMax"
                  )
                }
                value={
                  metadata?.holidayMax === 0 ||
                  metadata?.holidayMax === 99999999
                    ? ""
                    : metadata?.holidayMax
                }
                type="number"
                disabled={metadata?.holidayFrequency === "NA"}
              />
              <CommonSelectField
                className={`${style.fullWidth} ${style.marginLeft20}`}
                value={metadata?.holidayFrequency || ""}
                onChange={(e) =>
                  onCustomizeFieldChange(e.target.value, "holidayFrequency")
                }
                firstOptionLabel={"Select Frequency"}
                firstOptionValue={""}
                valueList={["NA", "WEEK", "MONTH", "CONTRACT_YEAR"]}
                labelList={["As Needed", "Per Week", "Per Month", "Per Year"]}
                disabledList={[false, false, false, false]}
              />
            </div>
          </div>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <div className={style.marginLeft30}>
              <CommonLabel value="Payment Amount*" />
            </div>
            <div className={style.displayInRow}>
              <div className={style.threeFieldWidth}>
                <CommonTextField
                  type="number"
                  min="0"
                  disabled={metadata?.holidayPaymentNa}
                  value={metadata?.holidayPayment}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ fontSize: 10 }}>
                        $
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      holidayPayment: parseFloat(e.target.value),
                      holidayPaymentNa: false,
                    })
                  }
                />
              </div>
              {/* <div className={style.verticalAlignCenter}> */}
              <CommonLabel
                className={`${style.marginLeft20} ${style.threeFieldWidth}`}
                value={`Per Holiday`}
              />
              {/* </div> */}
              <CommonCheckBox
                value="NA"
                label="NA"
                checked={metadata?.holidayPaymentNa}
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    holidayPayment: 0,
                    holidayPaymentNa: e.target.checked,
                  })
                }
                className={`${style.marginLeft20} ${style.fullWidth}`}
              />
            </div>
          </div>
          {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Require Patient MRN' />
                        <div className={style.onCallBillableGrid}>
                            <CommonSwitch className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
                                checked={metadata?.patientMRNRequired}
                                label={metadata?.patientMRNRequired ? 'YES' : 'NO'} onChange={() => setMetadata({ ...metadata, 'patientMRNRequired': !metadata?.patientMRNRequired })} />
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Require Patient Doc' />
                        <div className={style.onCallBillableGrid}>
                            <CommonSwitch className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} label={metadata?.attendingDocRequired ? 'YES' : 'NO'} checked={metadata?.attendingDocRequired} onChange={() => setMetadata({ ...metadata, 'attendingDocRequired': !metadata?.attendingDocRequired })} />
                        </div>
                    </div> */}
        </div>
      )}
      {!metadata?.customizedSchedule && (
        <>
          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <CommonLabel value="Number of On Call Duty Days*" />
            <div className={style.displayInRow}>
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText value={metadata?.min} placeholder='' onChange={(e) => e >= 0 && handleValueChange('min', e)} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  handleValueChange(
                    "min",
                    parseFloat(e.target.value.slice(0, 5))
                  )
                }
                value={metadata?.min === 0 ? "" : metadata?.min}
                type="number"
                disabled={metadata?.frequency === "NA"}
              />
              {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText value={metadata?.max} placeholder='' onChange={(e) => e >= 0 && handleValueChange('max', e)} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
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
                  e.target.value >= 0 &&
                  handleValueChange(
                    "max",
                    parseFloat(e.target.value.slice(0, 5))
                  )
                }
                value={
                  metadata?.max === 0 || metadata?.max === 99999999
                    ? ""
                    : metadata?.max
                }
                type="number"
                disabled={metadata?.frequency === "NA"}
              />
              <CommonSelectField
                className={`${style.fullWidth}`}
                value={metadata?.frequency}
                onChange={(e) => handleValueChange("frequency", e.target.value)}
                firstOptionLabel={"Select Frequecy"}
                firstOptionValue={""}
                valueList={["NA", "WEEK", "MONTH", "CONTRACT_YEAR"]}
                labelList={["As Needed", "Per Week", "Per Month", "Per Year"]}
                disabledList={[false, false]}
              />
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <CommonLabel value="Billable Service*" />
            <div className={style.displayInRow}>
              <div className={`${style.threeFieldWidth}`}>
                <CommonSwitch
                  checked={metadata?.billableService}
                  label={metadata?.billableService ? "YES" : "NO"}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      billableService: !metadata?.billableService,
                      sessionAmount: "0",
                    })
                  }
                  className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
                />
              </div>
              {
                // metadata?.billableService &&
                // <Select
                //     displayEmpty
                //     SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                //     className={`${style.threeFieldWidth}`}
                //     value={metadata?.rateType}
                //     onChange={(e)=>handleValueChange('rateType',e.target.value)}
                // >
                //     <MenuItem value="">Select Frequency</MenuItem>
                //     <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                // </Select>
              }
            </div>
          </div>

          <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
            <CommonLabel value="On Call Duty Duration" />
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
                value={metadata?.sessionDuration}
                onChange={(e) =>
                  e.target.value >= 0 &&
                  setMetadata({
                    ...metadata,
                    sessionDuration: e.target.value,
                    sessionAmount: "0",
                  })
                }
              />
            </div>
          </div>
          {metadata?.billableService && (
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <CommonLabel value="On Call Payment Amount*" />
              <div className={`${style.displayInRow}`}>
                <div className={`${style.threeFieldWidth}`}>
                  <CommonTextField
                    type="number"
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
                    value={metadata?.sessionAmount}
                    onChange={(e) =>
                      e.target.value >= 0 &&
                      handleValueChange(
                        "sessionAmount",
                        e.target.value.slice(0, 7)
                      )
                    }
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
            <CommonLabel value="Allowable Working Day Hours For Service*" />
            <div className={style.displayInRow}>
              <TimePicker
                useAmPm={false}
                onChange={(e) => {
                  updateWorkingPeriod(e);
                }}
                disabled={contractStatus === "ACTIVE" ? true : false}
                value={
                  metadata?.workingTimeFrom === null
                    ? null
                    : new Date(metadata?.workingTimeFrom)
                }
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
                    : new Date(metadata?.workingTimeTo)
                }
                disabled={contractStatus === "ACTIVE" ? true : false}
                // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
              />
            </div>
          </div>
        </>
      )}
      {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Require Patient MRN' />
                <div className={style.onCallBillableGrid}>
                    <CommonSwitch checked={metadata?.patientMRNRequired} label={metadata?.patientMRNRequired ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} onChange={() => handleValueChange('patientMRNRequired', !metadata?.patientMRNRequired)} />
                </div>
            </div> */}
      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Attending Doc Required" />
        <div className={style.onCallBillableGrid}>
          <CommonSwitch
            checked={metadata?.attendingDocRequired}
            className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
            label={metadata?.attendingDocRequired ? "YES" : "NO"}
            onChange={() =>
              handleValueChange(
                "attendingDocRequired",
                !metadata?.attendingDocRequired
              )
            }
          />
        </div>
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Additional Schedule*" />
        <div className={style.grid3}>
          <div className={`${style.fullWidth}`}>
            <CommonSwitch
              checked={metadata?.additionalScheduleRequired}
              className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
              onChange={(e) =>
                setMetadata({
                  ...metadata,
                  additionalScheduleRequired:
                    !metadata?.additionalScheduleRequired,
                  additionalScheduleValue: "0",
                  additionalScheduleFrequency: "NA",
                })
              }
              label={metadata?.additionalScheduleRequired ? "YES" : "NO"}
            />
          </div>
          {metadata?.additionalScheduleRequired && (
            <>
              <CommonInputField
                value={metadata?.additionalScheduleValue}
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
                value={metadata?.additionalScheduleFrequency || ""}
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
        <CommonLabel value="Total Contracted Service Sessions*" />
        <div className={style.twoCol}>
          <div
            className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}
          >
            <EditableText
              placeholder=""
              value={metadata?.totalSession}
              type="tel"
              maxLength="5"
              className={style.editableSessionTextStyle}
              onChange={(e) => onTotalSessionChange(e)}
              disabled={contractStatus === "ACTIVE" ? true : false}
            />
            <div
              className={`${style.textElement} ${
                parseFloat(metadata?.totalSession) === parseFloat(specified)
                  ? style.greenBase
                  : style.redBase
              }`}
            >
              {specified} Minimum Specified
            </div>
          </div>
          <div className={style.verticalAlignCenter}>
            <CommonLabel
              value={`For ${timeCommitment?.value} ${
                timeCommitment?.frequency === "WEEK" ? "Weeks" : "Months"
              } Per Contract Year`}
            />
          </div>
        </div>
      </div>

      <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
        <CommonLabel value="Any Additional On Call Services Specified" />
        <div className={style.onCallBillableGrid}>
          <CommonSwitch
            checked={metadata?.dependantServiceIncluded}
            className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
            label={metadata?.dependantServiceIncluded ? "YES" : "NO"}
            onChange={(e) =>
              handleValueChange(
                "dependantServiceIncluded",
                !metadata?.dependantServiceIncluded
              )
            }
          />
        </div>
      </div>
      {metadata?.dependantServiceIncluded && (
        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
          <CommonLabel value="Billable Service" />
          <div
            className={
              metadata?.additionalActivityBillable
                ? style.onCallBillableGrid
                : style.spaceBetween
            }
          >
            <CommonSwitch
              checked={metadata?.additionalActivityBillable}
              label={metadata?.additionalActivityBillable ? "YES" : "NO"}
              className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
              onChange={() =>
                setMetadata({
                  ...metadata,
                  additionalActivityBillable:
                    !metadata?.additionalActivityBillable,
                })
              }
            />
            {metadata?.additionalActivityBillable && (
              <>
                <div className={`${style.fullWidth}`}>
                  <CommonTextField
                    value={metadata?.dependencyPayableAmount}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        dependencyPayableAmount: e.target.value,
                      })
                    }
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ fontSize: 10 }}>
                          $
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <CommonSelectField
                  className={`${style.fullWidth}`}
                  value={metadata?.dependencyFrequency}
                  onChange={(e) =>
                    setMetadata({
                      ...metadata,
                      dependencyFrequency: e.target.value,
                    })
                  }
                  firstOptionLabel={"Select Payment Basis"}
                  firstOptionValue={""}
                  valueList={["PER_DAY", "PER_SERVICE"]}
                  labelList={["Per On Call Day", "Per Service Performed"]}
                  disabledList={[false, false]}
                />
              </>
            )}

            <div
              className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}
            >
              <AddIcon
                sx={{ fontSize: 25, color: "white" }}
                onClick={() => addAdditionalEntry()}
              />
            </div>
          </div>
        </div>
      )}
      {metadata?.dependantServiceIncluded && (
        <>
          <EditableTable
            additionalActivityData={metadata?.additionalActivity}
            getAdditionalActivityData={getAdditionalActivityData}
            serviceDays={metadata?.serviceDays}
          />
          <>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <CommonLabel value="Require Approval For Payment" />
              <CommonSwitch
                checked={metadata?.additionalActivityPaymentApprovalRequired}
                label={
                  metadata?.additionalActivityPaymentApprovalRequired
                    ? "YES"
                    : "NO"
                }
                onChange={(e) =>
                  setMetadata({
                    ...metadata,
                    additionalActivityPaymentApprovalRequired:
                      !metadata?.additionalActivityPaymentApprovalRequired,
                    approver: undefined,
                  })
                }
                className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
              />
            </div>
            {metadata?.additionalActivityPaymentApprovalRequired && (
              <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value="Designate Request Approver*" />
                <CommonSelectField
                  className={`${style.fullWidth} `}
                  defaultValue={metadata?.approver}
                  value={metadata?.approver ? metadata?.approver?.id : "0"}
                  onChange={(e) => {
                    setMetadata({
                      ...metadata,
                      approver: user
                        .filter((data) => data?.id === e.target.value)
                        ?.map((data) => data)[0],
                      approverTitle: title
                        ?.filter((titleData) => titleData?.approver === true)
                        ?.map((data) => data)[0],
                    });
                  }}
                  firstOptionLabel={"Select Payment Approver"}
                  firstOptionValue={"0"}
                  valueList={title
                    ?.filter((titleData) => titleData?.approver === true)
                    ?.map((data) => data?.id)}
                  labelList={title
                    ?.filter((titleData) => titleData?.approver === true)
                    ?.map(
                      (titleData) =>
                        `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`
                    )}
                  disabledList={title?.map((data) => false)}
                />
              </div>
            )}
          </>
        </>
      )}
    </div>
  );
};

export default OnCallCoverageFields;
