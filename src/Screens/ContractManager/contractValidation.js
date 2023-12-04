import React from 'react';
import { GET } from './../dataSaver';
import { CLINIC, SURGERY, SUPPLEMENTAL, ADDON, ADMINISTRATIVE, PROCEDUREREADING, ONCALL, HIT, ONCALLSERVICE } from '../../Constants';

export const validateContractIDTermLimit = (contract) => {
  let fieldData = [
    { field: "Contract Name", value: contract?.contractName?.contractName },
    { field: "Contract Id", value: contract?.contractDetail?.contractId?.id },
    {
      field: "Contract Manager",
      value: contract?.contractDetail?.contractManager?.userID,
    },
    { field: "Contract Files", value: contract?.contractDetail?.contractFiles },
    {
      field: "contract Start date",
      value: contract?.contractDetail?.contractTerm?.startDate,
    },
    {
      field: "contract End date",
      value: contract?.contractDetail?.contractTerm?.endDate,
    },
    {
      field: "contract Effective date",
      value: contract?.contractDetail?.contractTerm?.effectiveDate,
    },
    {
      field: "Time Commitment - value",
      value: contract?.contractDetail?.timeCommitment?.value,
    },
    {
      field: "Time Commitment - frequency",
      value: contract?.contractDetail?.timeCommitment?.frequency,
    },
    {
      field: "Contract Continuation Policy",
      value: contract?.contractDetail?.continuationPolicy?.contractPolicyType,
    },
    {
      field: "Contract Compensation Policy",
      value: contract?.contractDetail?.compensationPolicy,
    },
  ];
  let temp = fieldData;
  temp
    ?.filter((data) => data?.field === "Contract Continuation Policy")
    ?.map((data) => {
      if (data.value === "AUTORENEWAL") {
        temp.push({
          field: "Auto Renewal Term",
          value:
            contract?.contractDetail?.continuationPolicy?.autoRenewalPeriod
              ?.autoRenewalTerm?.term,
        });
        temp.push({
          field: "Allowable Auto Renewal Terms",
          value:
            contract?.contractDetail?.continuationPolicy?.autoRenewalPeriod
              ?.allowableAutoRenewalTerm?.term,
        });
      } else {
        temp.push({
          field: "Renewal Reminder List",
          value:
            contract?.contractDetail?.continuationPolicy?.reminderList?.renewalReminderList
              ?.filter((data) => data?.days !== 0)
              ?.map((data) => data)?.length,
        });
      }
    });
  const emptyFields = fieldData
    ?.filter(
      (data) =>
        data?.value === null ||
        data?.value === "" ||
        data?.value === undefined ||
        data?.value === 0
    )
    ?.map((data) => data?.field);
  return emptyFields;
};

export const validateContractProvider = async (contract) => {
  const contractId = contract?.id;
  let providers = [];
  let emptyFields = [];
  if (contractId !== "" && contractId !== undefined) {
    const { data: userData } = await GET(
      `user-management-service/user?contractID=${contractId}`
    );
    providers = userData
      ?.filter((data) =>
        data?.contracts?.map((contract) =>
          contract?.roles
            ?.map((role) => role?.roleName)
            ?.includes("Activity Logger")
        )
      )
      ?.map((data) => data);
  }
  if (!providers?.length > 0) {
    emptyFields[0] = [
      "Service Provider",
      "NPIN",
      "Contract Provider First Name",
      "Contract Provider Last Name",
      "Suffix",
      "Contract Provider Email",
      "Mobile Number",
      "Address",
      "City",
      "State",
      "Zipcode",
    ];
  }
  providers?.map((user, index) => {
    let fieldData = [
      { field: "Service Provider", value: user?.serviceProviderType?.id },
      { field: "NPIN", value: user?.npin?.npin },
      { field: "Contract Provider First Name", value: user?.name?.firstName },
      { field: "Contract Provider Last Name", value: user?.name?.lastName },
      { field: "Suffix", value: user?.name?.suffix?.id },
      { field: "Contract Provider Email", value: user?.email?.officialEmail },
      { field: "Mobile Number", value: user?.communication?.mobileNumber },
      { field: "Address", value: user?.address?.addressLine },
    ];
    let temp = [];
    temp.push(user?.name?.firstName);
    temp.push(
      fieldData
        ?.filter(
          (data) =>
            data?.value === null ||
            data?.value === "" ||
            data?.value === undefined ||
            data?.value === 0
        )
        ?.map((data) => data?.field)
    );
    emptyFields[index] = temp;
  });
  return emptyFields;
};

export const validateBusinessEntity = (contract) => {
  let businessEntity = contract?.contractorBusinessEntity;
  let fieldData = [
    { field: "NPIN", value: businessEntity?.contractorNPIN?.npin },
    { field: "Tax Id", value: businessEntity?.contractorEntityTaxId?.taxId },
    {
      field: "Business Entity Name",
      value: businessEntity?.businessEntity?.name,
    },
    {
      field: "Point Of Contact - First Name",
      value: businessEntity?.businessEntityUser?.name?.firstName,
    },
    {
      field: "Point Of Contact - Last Name",
      value: businessEntity?.businessEntityUser?.name?.lastName,
    },
    {
      field: "Business Contact Email Address",
      value: businessEntity?.businessEntityUser?.email?.officialEmail,
    },
    {
      field: "Mobile Number",
      value: businessEntity?.businessEntityUser?.contactNumber?.number,
    },
    {
      field: "Address Line",
      value: businessEntity?.mailingAddress?.addressLine,
    },
    { field: "City", value: businessEntity?.mailingAddress?.city },
    { field: "State", value: businessEntity?.mailingAddress?.state },
    { field: "Zipcode", value: businessEntity?.mailingAddress?.zipcode },
  ];
  const emptyFields = fieldData
    ?.filter(
      (data) =>
        data?.value === null ||
        data?.value === "" ||
        data?.value === undefined ||
        data?.value === 0
    )
    ?.map((data) => data?.field);
  return emptyFields;
};

export const validateServices = (contract) => {
  console.log("contract Data", contract);
  let services = contract?.contractedServices;
  let emptyFields = [];
  console.log('services data', services)
  services?.map((service, index) => {
    let fieldData = [{ field: 'sites', value: service?.sites?.length },
    { field: 'Service Days', value: (service?.serviceDays !== undefined && service?.serviceDays !== null) ? Object.keys(service?.serviceDays || {})?.filter(data => service?.serviceDays[data] === true)?.map(data => data)?.length : service?.activityType?.activityType === ADDON ? 'ADD ON' : '' },
    { field: 'Working Hours - From', value: service?.workingPeriod?.from },
    { field: 'Working Hours - To', value: service?.workingPeriod?.to }
    ];
    if (service?.additionalSchedule?.scheduleRequired) {
      fieldData.push(...[{ field: 'Additional Schedule Value', value: service?.additionalSchedule?.value }, { field: 'Additional Schedule Frequency', value: service?.additionalSchedule?.frequency }]);
    }
    if (service?.billableService && !service?.customizedSchedule && service?.activityType?.activityType !== SUPPLEMENTAL && service?.activityType?.activityType !== ONCALLSERVICE) {
      fieldData.push(...[{ field: 'Payment Amount', value: service?.payableAmount?.value }]);
    }
    if (service?.activityApprovalWFRequired && service?.activityType?.activityType === ADDON) {
      fieldData.push(...[{ field: 'Approval Workflow', value: service?.workFlow !== null ? service?.workFlow?.id : '' }]);
    }
    if (service?.activityType?.activityType === ADDON) {
      if (!Object.keys(service?.activityResponse?.dataMap)?.includes('selectedActivityId')) {
        fieldData.push({ field: 'Duration', value: service?.duration?.hours });
        fieldData.push({ field: 'Additional details', value: service?.activityResponse?.dataMap?.additionalDetails?.length });
        fieldData.push({ field: 'Allowable Add-On Working Hours', value: Object.values(service?.workingHours)?.filter(data => data === true)?.map(data => data)?.length });
        if (service?.locationSpecified) {
          fieldData.push({ field: 'Specify Service Facility / Location', value: service?.serviceLocations?.length });
        }
      }
    }
    if (
      service?.activityType?.activityType === SUPPLEMENTAL ||
      service?.activityType?.activityType === ADMINISTRATIVE
    ) {
      if (!service?.dedicatedHoursSpecified) {
        fieldData.push({ field: 'Dedicated Hours Borrowed From', value: service?.hoursBorrowed?.activityType?.activityType });
      }
    }
    if (service?.activityType?.activityType === SUPPLEMENTAL) {
      fieldData.push({ field: 'Supplement Services To Perform', value: service?.performingActivity?.activity });
      if (service?.baseServiceAvailable) {
        fieldData.push({ field: 'Supplement Service Type', value: service?.baseServices?.length });
      }
      if (service?.dedicatedHoursSpecified) {
        if (service?.billableService) {
          fieldData.push({ field: 'Supplemental Service Payment Amount', value: service?.payableAmount?.value });
        }
        if (service?.totalSessions?.frequency !== 'NA') {
          fieldData.push({ field: 'Supplemental Service Separate Service Hours Specified', value: service?.totalSessions?.value });
          fieldData.push({ field: 'Supplemental Service Separate Service Hours Specified Frequency', value: service?.totalSessions?.frequency });
        }
      } else {
        fieldData.push({ field: 'Hours Borrowed from', value: service?.hoursBorrowed?.activityType?.activityType });
      }
    }
    if (service?.activityType?.activityType !== SUPPLEMENTAL && !service?.customizedSchedule && service?.activityType?.activityType !== HIT
      && service?.activityType?.activityType !== ONCALLSERVICE && service?.activityType?.activityType !== ADMINISTRATIVE && service?.activityType?.activityType !== ADDON) {
      fieldData.push({ field: 'Duration', value: service?.duration?.hours });
      fieldData.push({ field: 'Total Sessions', value: service?.totalSessions?.value });
    }
    if (service?.activityType?.activityType === CLINIC || service?.activityType?.activityType === SURGERY || service?.activityType?.activityType === PROCEDUREREADING) {
      service?.contractedSchedules?.map(schedule => {
        if (schedule?.frequency !== "NA") {
          fieldData.push(...[{ field: 'Service Schedule', value: schedule?.minimum?.value },
          { field: 'Service Schedule Frequency', value: schedule?.frequency }])
        }
      })
      service?.patientsSeenTargets?.map(schedule => {
        if (!schedule?.noTargetApplicable) {
          fieldData.push(...[{ field: 'Patients Seen Target - With Nurse', value: schedule?.withNurse?.value },
          { field: 'Patients Seen Target - Without Nurse', value: schedule?.withoutNurse?.value },
          ])
        }
      });
      if (service?.activityType?.activityType !== SURGERY) {
        service?.scheduledPatientsTargets?.map((schedule) => {
          if (!schedule?.noTargetApplicable) {
            fieldData.push(...[{ field: 'Scheduled Patients Target - With Nurse', value: schedule?.withNurse?.value },
            { field: 'Scheduled Patients Target - Without Nurse', value: schedule?.withoutNurse?.value },
            ])
          }
        });
      }
    }
    if (service?.activityType?.activityType === HIT) {
      fieldData.push({ field: 'Allowable Clinical Informatics / HIT Duties & Function To Perform', value: service?.activities?.length });
      fieldData.push({ field: 'HIT Effective Date Start Date', value: service?.contractedSchedules?.[0]?.startDate });
      fieldData.push({ field: 'HIT Effective Date End Date', value: service?.contractedSchedules?.[0]?.endDate });
      if (service?.dedicatedHoursSpecified) {
        if (service?.totalSessions?.frequency !== 'NA') {
          fieldData.push({ field: 'Separate Clinical Informatics / HIT Hours Specified Value', value: service?.totalSessions?.value });
          fieldData.push({ field: 'Separate Clinical Informatics / HIT Hours Specified Value Frequency', value: service?.totalSessions?.frequency });
        }
        fieldData.push({ field: 'Total Agreed To Compensation', value: service?.payableAmount?.value });
      } else {
        fieldData.push({ field: 'Hours Borrowed Activity Type', value: service?.hoursBorrowed?.activityType?.activityType });
      }
      if (service?.serviceAgreementOnFile) {
        fieldData.push({ field: 'serviceAgreementOnFile', value: service?.contractedServiceFiles?.length });
      }
    }
    if (service?.activityType?.activityType === ADMINISTRATIVE) {
      fieldData.push({ field: 'Allowable Administrative Duties & Function To Perform', value: service?.activities?.length });
      if (service?.activityApprovalWFRequired) {
        fieldData.push({ field: 'Designate Request Approver', value: service?.workFlow !== null ? service?.workFlow?.id : '' });
      }
      if (service?.dedicatedHoursSpecified) {
        if (service?.totalSessions?.frequency !== 'NA') {
          fieldData.push({ field: 'Separate Administrative Hours Specified Value', value: service?.totalSessions?.value });
          fieldData.push({ field: 'Separate Administrative Hours Specified Frequency', value: service?.totalSessions?.frequency });
        }
        fieldData.push({ field: 'Administrative Services Payment Amount', value: service?.payableAmount?.value });
      }
    }
    if (service?.activityType?.activityType === ONCALLSERVICE) {
      if (service?.dedicatedHoursSpecified) {
        if (service?.totalSessions?.frequency !== 'NA') {
          fieldData.push({ field: 'Separate Administrative Hours Specified Value', value: service?.totalSessions?.value });
          fieldData.push({ field: 'Separate Administrative Hours Specified Frequency', value: service?.totalSessions?.frequency });
        }
        if (service?.billableService) {
          fieldData.push({ field: 'Administrative Services Payment Amount', value: service?.payableAmount?.value });
        }
      } else {
        fieldData.push({ field: 'Hours Borrowed Activity Type', value: service?.hoursBorrowed?.activityType?.activityType });
      }
    }
    if (service?.activityType?.activityType === ONCALL) {
      fieldData.push(...[{ field: 'On Call Coverage For', value: service?.activityResponse?.dataMap?.onCallCoverageFor?.length !== 0 ? service?.activityResponse?.dataMap?.onCallCoverageFor : null },
      ])
      service?.contractedSchedules?.map(data => {
        if (data?.frequency !== 'NA') {
          fieldData.push(...[{ field: 'Numer of On Call Duty Days Min', value: data?.minimum?.value }]);
        }
      })
      if (service?.customizedSchedule) {
        if (service?.customschedule?.weekdayDay?.activity?.activity !== '') {
          fieldData.push(...[{ field: 'Custom Schedule Weekday Day Service days', value: Object.values(service?.customschedule?.weekdayDay?.serviceWeekDays)?.filter(data => data === true)?.map(data => data)?.length }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Day From', value: service?.customschedule?.weekdayDay?.from }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Day To', value: service?.customschedule?.weekdayDay?.to }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Day Duration', value: service?.customschedule?.weekdayDay?.duration?.hours }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Day Min', value: service?.customschedule?.weekdayDay?.target?.minimum?.value }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Day Frequency', value: service?.customschedule?.weekdayDay?.target?.frequency }]);
          if (!service?.customschedule?.weekdayDay?.paymentNotApplicable) {
            fieldData.push(...[{ field: 'Custom Schedule Weekday Day Payment Amount', value: service?.customschedule?.weekdayDay?.payableAmount?.value }]);
          }
        }
        if (service?.customschedule?.weekdayNight?.activity?.activity !== '') {
          fieldData.push(...[{ field: 'Custom Schedule Weekday Night Service days', value: Object.values(service?.customschedule?.weekdayNight?.serviceWeekDays)?.filter(data => data === true)?.map(data => data)?.length }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Night From', value: service?.customschedule?.weekdayNight?.from }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Night To', value: service?.customschedule?.weekdayNight?.to }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Night Duration', value: service?.customschedule?.weekdayNight?.duration?.hours }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Night Min', value: service?.customschedule?.weekdayNight?.target?.minimum?.value }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekday Night Frequency', value: service?.customschedule?.weekdayNight?.target?.frequency }]);
          if (!service?.customschedule?.weekdayNight?.paymentNotApplicable) {
            fieldData.push(...[{ field: 'Custom Schedule Weekday Night Payment Amount', value: service?.customschedule?.weekdayNight?.payableAmount?.value }]);
          }
        }
        if (service?.customschedule?.weekend?.activity?.activity !== '') {
          fieldData.push(...[{ field: 'Custom Schedule Weekend Start Day', value: service?.customschedule?.weekend?.startDay }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekend End Day', value: service?.customschedule?.weekend?.endDay }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekend From', value: service?.customschedule?.weekend?.from }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekend To', value: service?.customschedule?.weekend?.to }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekend Duration', value: service?.customschedule?.weekend?.duration?.hours }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekend Min', value: service?.customschedule?.weekend?.target?.minimum?.value }]);
          fieldData.push(...[{ field: 'Custom Schedule Weekend Frequency', value: service?.customschedule?.weekend?.target?.frequency }]);
          if (!service?.customschedule?.weekend?.paymentNotApplicable) {
            fieldData.push(...[{ field: 'Custom Schedule Weekend Payment Amount', value: service?.customschedule?.weekend?.payableAmount?.value }]);
          }
        }
        if (service?.customschedule?.holiday?.activity?.activity !== '') {
          fieldData.push(...[{ field: 'Custom Schedule Holiday Term', value: service?.customschedule?.holiday?.holidayTerm }]);
          fieldData.push(...[{ field: 'Custom Schedule Holiday From', value: service?.customschedule?.holiday?.from }]);
          fieldData.push(...[{ field: 'Custom Schedule Holiday To', value: service?.customschedule?.holiday?.to }]);
          fieldData.push(...[{ field: 'Custom Schedule Holiday Duration', value: service?.customschedule?.holiday?.duration?.hours }]);
          fieldData.push(...[{ field: 'Custom Schedule Holiday Min', value: service?.customschedule?.holiday?.target?.minimum?.value }]);
          fieldData.push(...[{ field: 'Custom Schedule Holiday Frequency', value: service?.customschedule?.holiday?.target?.frequency }]);
          if (!service?.customschedule?.holiday?.paymentNotApplicable) {
            fieldData.push(...[{ field: 'Custom Schedule Holiday Payment Amount', value: service?.customschedule?.holiday?.payableAmount?.value }]);
          }
        }
      }
      if (service?.dependantServiceIncluded) {
        service?.dependentService?.additionalServices?.map(data => {
          fieldData.push(...[{ field: 'Dependent Service Activity Name', value: data?.activity?.activity }]);
          fieldData.push(...[{ field: 'Dependent Service Weekday Hours From', value: data?.weekday?.from }]);
          fieldData.push(...[{ field: 'Dependent Service Weekday Hours To', value: data?.weekday?.to }]);
          fieldData.push(...[{ field: 'Dependent Service Weekend Hours From', value: data?.weekend?.from }]);
          fieldData.push(...[{ field: 'Dependent Service Weekend Hours To', value: data?.weekend?.to }]);
          fieldData.push(...[{ field: 'Dependent Service Holiday Hours From', value: data?.holiday?.from }]);
          fieldData.push(...[{ field: 'Dependent Service Holiday Hours To', value: data?.holiday?.to }]);

          if (service?.dependentService?.billableService) {
            fieldData.push(...[{ field: 'Additional Activity - Payable Amount', value: service?.dependentService?.payableAmount?.value }]);
            fieldData.push(...[{ field: 'Additional Activity - Payable Amount Frequency', value: service?.dependentService?.frequency }]);
          }
          if (service?.dependentService?.paymentApprovalRequired) {
            fieldData.push(...[{ field: 'Additional Activity - Payment Approver', value: service?.dependentService?.workFlow }]);
          }
        })
      }
    }
    let temp = fieldData?.filter(data => data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0 || data?.value === '00:00:00')?.map(data => data?.field);
    emptyFields[index] = temp;
    console.log('field Data-', fieldData, 'empty fields-', emptyFields);
  });
  return emptyFields;
};

export const validatePaymentsAndCompensation = (contract) => {
  let payments = contract?.paymentAndCompensation;
  let isEmptyField = [];
  let fieldData = [];
  if (payments?.compensationBasis === null) {
    isEmptyField = [
      "Compensation Basis",
      "RVU Quantity",
      "FTE Equivalent",
      "RVU Reference Used",
      "RVU Quantity variance (+/-)",
      "RVU Quantity Period",
      "Dollar Hourly Rate",
      "Individual Timesheet Details",
    ];
  }

  fieldData = [
    { field: "Compensation Basis", value: payments?.compensationBasis },
  ];
  if (!payments?.dollarRate?.notApplicable) {
    fieldData.push({ field: `Dollar Rate`, value: payments?.dollarRate?.hour });
  }
  if (payments?.compensationBasis === "RVUBASED") {
    fieldData.push(
      ...[
        { field: "RVU Quantity", value: payments?.rvuQuantity?.quantity },
        { field: "Frequency", value: payments?.frequency },
        { field: "FTE Equivalent", value: payments?.fteEquivalent?.value },
        {
          field: "RVU Reference Used",
          value: payments?.rvuQuantityVariance?.value,
        },
        {
          field: "RVU Quantity Variance",
          value: payments?.rvuQuantityVariance?.value,
        },
        {
          field: "RVU Quantity Period",
          value: payments?.rvuQuantityPeriod?.days,
        },
      ]
    );
  }
  payments?.timesheetPayments?.map((data, index) => {
    fieldData?.push(
      ...[
        {
          field: `Timesheet Label ${index + 1}`,
          value: data?.timesheetLabel?.label,
        },
        {
          field: `Max Payment Per Contract ${index + 1}`,
          value: data?.maxPaymentPerContract,
        },
        {
          field: `Providing Additional Services ${index + 1}`,
          value: data?.providingAdditionalServices,
        },
        // { field: `OverUnderPayment ${index + 1}`, value: data?.overUnderPayment },
        {
          field: `Payment Based on Fixed Hours Vs Actual ${index + 1}`,
          value: data?.paymentBasedonFixedHoursVsActual,
        },
      ]
    );
    if (
      contract?.contractDetail?.continuationPolicy?.contractPolicyType !==
      "FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET" &&
      contract?.contractDetail?.continuationPolicy?.contractPolicyType !==
      "ACTIVITY_BASED" &&
      contract?.contractDetail?.continuationPolicy?.contractPolicyType !==
      "AUTORENEWAL"
    ) {
      fieldData.push(
        ...[
          {
            field: `Max Payment Per Timesheet Submission ${index + 1}`,
            value: data?.maxPaymentPerTimesheetSubmission,
          },
          {
            field: `Reduced Number Of Services ${index + 1}`,
            value: data?.reducedNumberOfServices,
          },
        ]
      );
    }
    else if (
      contract?.contractDetail?.continuationPolicy?.contractPolicyType ===
      "FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET"
    ) {
      fieldData.push(
        ...[
          {
            field: `Max Payment Per Timesheet Submission ${index + 1}`,
            value: data?.maxPaymentPerTimesheetSubmission,
          },
        ]
      );
    } else {
    }
  });

  let temp = fieldData
    ?.filter(
      (data) =>
        data?.value === null ||
        data?.value === "" ||
        data?.value === undefined ||
        data?.value === 0
    )
    ?.map((data) => data?.field);
  isEmptyField = temp;
  return isEmptyField;
};

export const validateTimesheetSubmission = (contract) => {
  let timesheets = contract?.timesheetSubmissionTerms;
  let isEmptyField = [];
  let fieldData = [];
  if (
    timesheets === null ||
    timesheets?.timesheetSubmissionServicesCount?.count === 0
  ) {
    isEmptyField = [
      "Number Of Timesheet",
      "Timesheet Label",
      "Payment Source",
      "Service Log Period For Timesheet Submission",
      "Contracted Activity To Include",
      "Day Limit For Submission Of Timesheet Based On Activity Service Date",
      "Day Limit For Submission Of Timesheet Based On Contract End Date",
      "Invoice Processing Days",
      "Planned Absence Limit",
      "Maximum Absence Allowed",
      "Invoice Processing Goal",
      "Invoice Processing Threshold",
    ];
  }
  timesheets?.timesheetActivitiesPeriods?.map((data, index) => {
    let fieldData = [
      {
        field: "Number Of Timesheet",
        value: timesheets?.timesheetSubmissionServicesCount?.count,
      },
      {
        field: `Timesheet Label ${index + 1}`,
        value: data?.timesheetLabel?.label,
      },
      { field: `Payment Source ${index + 1}`, value: data?.paymentSource },
      {
        field: `Service Log Period For Timesheet Submission ${index + 1}`,
        value: data?.servicePeriod?.value,
      },
      {
        field: `Contracted Activity To Include ${index + 1}`,
        value: data?.activities?.length,
      },
      {
        field:
          "Day Limit For Submission Of Timesheet Based On Activity Service Date",
        value: timesheets?.dayLimit?.activityServiceDate?.days,
      },
      {
        field:
          "Day Limit For Submission Of Timesheet Based On Contract End Date",
        value: timesheets?.dayLimit?.contractEndDate?.days,
      },
      {
        field: "Maximum Absence Allowed",
        value: timesheets?.maximumAbsenceAllowed?.days,
      },
      {
        field: "Planned Absence Limit",
        value: timesheets?.plannedAbsenceLimit?.days,
      },
      {
        field: "Invoice Processing Days",
        value: timesheets?.invoiceProcessing?.days,
      },
      {
        field: "Invoice Processing Goal",
        value: timesheets?.invoiceProcessing?.goal,
      },
      {
        field: "Invoice Processing Threshold",
        value: timesheets?.invoiceProcessing?.threshold,
      },
    ];
    let temp = fieldData
      ?.filter(
        (data) =>
          data?.value === null ||
          data?.value === "" ||
          data?.value === undefined ||
          data?.value === 0
      )
      ?.map((data) => data?.field);
    isEmptyField.push(...temp);
  });
  return isEmptyField;
};

export const validateTimesheetProcessingWorkflow = (contract) => {
  let isValid = false;
  if (
    contract?.workFlowDetails?.length ===
    contract?.timesheetSubmissionTerms?.timesheetActivitiesPeriods?.length
  ) {
    isValid = true;
  }
  return isValid;
};

export const validateTabs = async (contractId) => {
  const { data: data } = await GET(
    `contract-managment-service/contracts/${contractId}`
  );
  let contract = data;
  let tab1 = validateContractIDTermLimit(contract);
  let tab2 = validateContractProvider(contract);
  let tab3 = validateBusinessEntity(contract);
  let tab4 = validateServices(contract);
  let tab5 = validateTimesheetSubmission(contract);
  let tab6 = validatePaymentsAndCompensation(contract);
  let tab7 = validateTimesheetProcessingWorkflow(contract);
  let isTabsValid = {
    tab1: tab1?.length === 0,
    value1: tab1,
    tab2: tab2?.length === 0,
    value2: tab2,
    tab3: tab3?.length === 0,
    value3: tab3,
    tab4:
      tab4?.length !== 0 &&
        tab4?.filter((data) => data?.length !== 0)?.map((data) => data)
          ?.length === 0
        ? true
        : false,
    value4: tab4,
    tab5: tab5?.length === 0,
    value5: tab5,
    tab6: tab6?.length === 0,
    value6: tab6,
    tab7: tab7,
    value7: tab7,
  };
  console.log("tab validation values", isTabsValid);
  return isTabsValid;
};
