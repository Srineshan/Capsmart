import React from 'react';
import { GET } from './../dataSaver';
import { CLINIC, SURGERY, SUPPLEMENTAL, ADDON, ADMINISTRATIVE } from '../../Constants';

export const validateContractIDTermLimit = (contract) => {
  let fieldData = [{ field: 'Contract Name', value: contract?.contractName?.contractName },
  { field: 'Contract Id', value: contract?.contractDetail?.contractId?.id },
  { field: 'Contract Manager', value: contract?.contractDetail?.contractManager?.userID },
  { field: 'Contract Files', value: contract?.contractDetail?.contractFiles },
  { field: 'contract Start date', value: contract?.contractDetail?.contractTerm?.startDate },
  { field: 'contract End date', value: contract?.contractDetail?.contractTerm?.endDate },
  { field: 'contract Effective date', value: contract?.contractDetail?.contractTerm?.effectiveDate },
  { field: 'Time Commitment - value', value: contract?.contractDetail?.timeCommitment?.value },
  { field: 'Time Commitment - frequency', value: contract?.contractDetail?.timeCommitment?.frequency },
  { field: 'contract Effective date', value: contract?.contractDetail?.contractTerm?.effectiveDate },
  { field: 'Contract Continuation Policy', value: contract?.contractDetail?.continuationPolicy?.contractPolicyType },
  ];
  let temp = fieldData;
  temp?.filter(data => data?.field === 'Contract Continuation Policy')?.map(data => {
    if (data.value === 'AUTORENEWAL') {
      temp.push({ field: 'Auto Renewal Term', value: contract?.contractDetail?.continuationPolicy?.autoRenewalPeriod?.autoRenewalTerm?.term });
      temp.push({ field: 'Allowable Auto Renewal Terms', value: contract?.contractDetail?.continuationPolicy?.autoRenewalPeriod?.allowableAutoRenewalTerm?.term });
    } else {
      temp.push({ field: 'Renewal Reminder List', value: contract?.contractDetail?.continuationPolicy?.reminderList?.renewalReminderList?.filter(data => data?.days === 0)?.map(data => data)?.length });
    }
  })
  const emptyFields = fieldData?.filter(data => data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data => data?.field);
  console.log('tab 1', emptyFields);
  return emptyFields;
}


export const validateContractProvider = async (contract) => {
  const contractId = contract?.id;
  let providers = [];
  let emptyFields = [];
  if (contractId !== '' && contractId !== undefined) {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    providers = userData?.filter(data => data?.contracts?.map(contract => contract?.roles?.map(role => role?.roleName)?.includes('Activity Logger')))?.map(data => data);
  }
  if (!providers?.length > 0) {
    emptyFields[0] = ['Service Provider', 'NPIN', 'Contract Provider First Name', 'Contract Provider Last Name', 'Suffix', 'Contract Provider Email', 'Mobile Number', 'Address', 'City', 'State', 'Zipcode'];
  }
  providers?.map((user, index) => {
    let fieldData = [{ field: 'Service Provider', value: user?.serviceProviderType?.id },
    { field: 'NPIN', value: user?.npin?.npin },
    { field: 'Contract Provider First Name', value: user?.name?.firstName },
    { field: 'Contract Provider Last Name', value: user?.name?.lastName },
    { field: 'Suffix', value: user?.name?.suffix?.id },
    { field: 'Contract Provider Email', value: user?.email?.officialEmail },
    { field: 'Mobile Number', value: user?.communication?.mobileNumber },
    ];
    let temp = [];
    temp.push(user?.name?.firstName);
    temp.push(fieldData?.filter(data => data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data => data?.field));
    emptyFields[index] = temp;
  })
  return emptyFields;
}

export const validateBusinessEntity = (contract) => {
  let businessEntity = contract?.contractorBusinessEntity;
  let fieldData = [{ field: 'NPIN', value: businessEntity?.contractorNPIN?.npin },
  { field: 'Tax Id', value: businessEntity?.contractorEntityTaxId?.taxId },
  { field: 'Business Entity Name', value: businessEntity?.businessEntity?.name },
  { field: 'Point Of Contact - First Name', value: businessEntity?.businessEntityUser?.name?.firstName },
  { field: 'Point Of Contact - Last Name', value: businessEntity?.businessEntityUser?.name?.lastName },
  { field: 'Business Contact Email Address', value: businessEntity?.businessEntityUser?.email?.officialEmail },
  { field: 'Mobile Number', value: businessEntity?.businessEntityUser?.contactNumber?.number },
  { field: 'Address Line', value: businessEntity?.mailingAddress?.addressLine },
  { field: 'City', value: businessEntity?.mailingAddress?.city },
  { field: 'State', value: businessEntity?.mailingAddress?.state },
  { field: 'Zipcode', value: businessEntity?.mailingAddress?.zipcode },
  ];
  const emptyFields = fieldData?.filter(data => data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data => data?.field);
  return emptyFields;
}

export const validateServices = (contract) => {
  let services = contract?.contractedServices;
  let emptyFields = [];
  if (services?.length === 0) {
    emptyFields.push(['Sites', 'Activities', 'Service Schedule', 'Service Schedule Frequecy', 'Duration', 'Service Days', 'Total Session', 'Working Hours - From', 'Working Hours - To']);

  }
  services?.map((service, index) => {
    if (service?.activityType?.activityType !== ADMINISTRATIVE && service?.activityType?.activityType !== ADDON) {
      let fieldData = [{ field: 'sites', value: service?.sites?.length },
      { field: 'Activities', value: service?.activities?.length },

      { field: 'Service Days', value: service?.serviceDays },
      { field: 'Total Sessions', value: service?.totalSessions?.value },
      { field: 'Working Hours - From', value: service?.workingPeriod?.from },
      { field: 'Working Hours - To', value: service?.workingPeriod?.to }
      ];
      if (service?.activityType?.activityType !== SUPPLEMENTAL) {
        fieldData.push({ field: 'Duration', value: service?.duration?.hours });
      }
      if (service?.activityType?.activityType === CLINIC || service?.activityType?.activityType === SURGERY) {
        fieldData.push(...[{ field: 'Service Schedule', value: service?.contractedSchedule?.minimum?.value },
        { field: 'Service Schedule Frequency', value: service?.contractedSchedule?.frequency }])
      }
      let temp = fieldData?.filter(data => data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data => data?.field);
      emptyFields[index] = temp;
    } else {
      emptyFields.push([])
    }
  });
  return emptyFields;
}

export const validatePaymentsAndCompensation = (contract) => {
  let payments = contract?.paymentAndCompensation;
  let isEmptyField = [];
  let fieldData = [];
  if (payments?.compensationBasis === null) {
    isEmptyField = ['Compensation Basis',
      'RVU Quantity',
      'FTE Equivalent',
      'RVU Reference Used',
      'RVU Quantity variance (+/-)',
      'RVU Quantity Period',
      'Dollar Hourly Rate',
      'Individual Timesheet Details'];
  }

  fieldData = [{ field: 'Compensation Basis', value: payments?.compensationBasis },
  { field: `Dollar Rate`, value: payments?.dollarRate?.hour },
  ];
  if (payments?.compensationBasis === 'RVUBASED') {
    fieldData.push(...[
      { field: 'RVU Quantity', value: payments?.rvuQuantity?.quantity },
      { field: 'Frequecy', value: payments?.frequency },
      { field: 'FTE Equivalent', value: payments?.fteEquivalent?.value },
      { field: 'RVU Reference Used', value: payments?.rvuQuantityVariance?.value },
      { field: 'RVU Quantity Variance', value: payments?.rvuQuantityVariance?.value },
      { field: 'RVU Quantity Period', value: payments?.rvuQuantityPeriod?.days },
    ])
  }
  payments?.timesheetPayments?.map((data, index) => {
    fieldData?.push(...[{ field: `Timesheet Label ${index + 1}`, value: data?.timesheetLabel?.label },
    { field: `Payment Frequecy ${index + 1}`, value: data?.paymentFrequency },
    { field: `Max Payment Per Timesheet Submission ${index + 1}`, value: data?.maxPaymentPerTimesheetSubmission },
    { field: `Max Payment Per Contract ${index + 1}`, value: data?.maxPaymentPerContract },
    { field: `Reduced Number Of Services ${index + 1}`, value: data?.reducedNumberOfServices },
    { field: `Providing Additional Services ${index + 1}`, value: data?.providingAdditionalServices },
    // { field: `OverUnderPayment ${index + 1}`, value: data?.overUnderPayment },
    { field: `Payment Based on Fixed Hours Vs Actual ${index + 1}`, value: data?.paymentBasedonFixedHoursVsActual }]
    );
  })

  let temp = fieldData?.filter(data => data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data => data?.field);
  isEmptyField = temp;
  return isEmptyField;
}


export const validateTimesheetSubmission = (contract) => {
  let timesheets = contract?.timesheetSubmissionTerms;
  let isEmptyField = [];
  let fieldData = [];
  if (timesheets === null || timesheets?.timesheetSubmissionServicesCount?.count === 0) {
    isEmptyField = ['Number Of Timesheet',
      'Timesheet Label',
      'Payment Source',
      'Service Log Period For Timesheet Submission',
      'Contracted Activity To Include',
      'Day Limit For Submission Of Timesheet Based On Activity Service Date',
      'Day Limit For Submission Of Timesheet Based On Contract End Date',
      'Invoice Processing Days', 'Planned Absence Limit', 'Maximum Absence Allowed', 'Invoice Processing Goal',
      'Invoice Processing Threshold'];
  }
  timesheets?.timesheetActivitiesPeriods?.map((data, index) => {
    let fieldData = [{ field: 'Number Of Timesheet', value: timesheets?.timesheetSubmissionServicesCount?.count },
    { field: `Timesheet Label ${index + 1}`, value: data?.timesheetLabel?.label },
    { field: `Payment Source ${index + 1}`, value: data?.paymentSource },
    { field: `Service Log Period For Timesheet Submission ${index + 1}`, value: data?.servicePeriod?.value },
    { field: `Contracted Activity To Include ${index + 1}`, value: data?.activities?.length },
    { field: 'Day Limit For Submission Of Timesheet Based On Activity Service Date', value: timesheets?.dayLimit?.activityServiceDate?.days },
    { field: 'Day Limit For Submission Of Timesheet Based On Contract End Date', value: timesheets?.dayLimit?.contractEndDate?.days },
    { field: 'Maximum Absence Allowed', value: timesheets?.maximumAbsenceAllowed?.days },
    { field: 'Planned Absence Limit', value: timesheets?.plannedAbsenceLimit?.days },
    { field: 'Invoice Processing Days', value: timesheets?.invoiceProcessing?.days },
    { field: 'Invoice Processing Goal', value: timesheets?.invoiceProcessing?.goal },
    { field: 'Invoice Processing Threshold', value: timesheets?.invoiceProcessing?.threshold },
    ];
    let temp = fieldData?.filter(data => data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data => data?.field);
    isEmptyField.push(...temp);
  })
  return isEmptyField;
}


export const validateTimesheetProcessingWorkflow = (contract) => {
  let isValid = false;
  if (contract?.workFlowDetails?.length !== 0) {
    isValid = true;
  };
  return isValid;
}

export const validateRequestProcessingWorkflow = (contract) => {
  let emptyFields = [];
  if (contract?.addOnRequestWorkFlow === null) {
    emptyFields.push('Add-On Request Workflow');
  }
  if (contract?.absenceRequestWorkFlow === null) {
    emptyFields.push('Absence Request Wokflow');
  }
  return emptyFields;
}

export const validateTabs = async (contractId) => {
  const { data: data } = await GET(`contract-managment-service/contracts/${contractId}`);
  let contract = data;
  let tab1 = validateContractIDTermLimit(contract);
  let tab2 = validateContractProvider(contract);
  let tab3 = validateBusinessEntity(contract);
  let tab4 = validateServices(contract);
  let tab5 = validateTimesheetSubmission(contract);
  let tab6 = validatePaymentsAndCompensation(contract);
  let tab7 = validateTimesheetProcessingWorkflow(contract);
  let tab8 = validateRequestProcessingWorkflow(contract);
  let isTabsValid = {
    tab1: tab1?.length === 0, value1: tab1,
    tab2: tab2?.length === 0, value2: tab2,
    tab3: tab3?.length === 0, value3: tab3,
    tab4: tab4?.length !== 0 && tab4?.filter(data => data?.length !== 0)?.map(data => data)?.length === 0 ? true : false, value4: tab4,
    tab5: tab5?.length === 0, value5: tab5,
    tab6: tab6?.length === 0, value6: tab6,
    tab7: tab7, value7: tab7,
    tab8: tab8?.length === 0, value8: tab8,
  };
  return isTabsValid;
}
