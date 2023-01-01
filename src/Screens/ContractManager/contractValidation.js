import React from 'react';
import { GET } from './../dataSaver';

export const validateContractIDTermLimit = (contract) => {
  console.log('contract id', contract?.contractDetail?.contractFiles);
  let fieldData = [{field:'Contract Name', value:contract?.contractName?.contractName},
                  {field: 'Contract Id', value: contract?.contractDetail?.contractId?.id},
                  {field: 'Contract Manager', value:contract?.contractDetail?.contractManager?.userID},
                  {field: 'Contract Files', value:contract?.contractDetail?.contractFiles},
                  {field: 'contract Start date', value:contract?.contractDetail?.contractTerm?.startDate},
                  {field: 'contract End date', value:contract?.contractDetail?.contractTerm?.endDate},
                  {field: 'contract Effective date', value:contract?.contractDetail?.contractTerm?.effectiveDate},
                  {field: 'Time Commitment - value', value:contract?.contractDetail?.timeCommitment?.value},
                  {field: 'Time Commitment - frequency', value:contract?.contractDetail?.timeCommitment?.frequency},
                  {field: 'contract Effective date', value:contract?.contractDetail?.contractTerm?.effectiveDate},
                ];
  const emptyFields = fieldData?.filter(data=>data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data=> data?.field);
  return emptyFields;
}


export const validateContractProvider = async(contract) => {
  const contractId = contract?.id;
  let providers = [];
  let emptyFields = [];
  if (contractId !== '' && contractId !== undefined) {
    const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
    providers = userData?.filter(data=>data?.contracts?.map(contract=>contract?.roles?.map(role=>role?.roleName)?.includes('Activity Logger')))?.map(data=>data);
  }
  providers?.map((user, index)=> {
    let fieldData = [{field:'Service Provider', value:user?.serviceProviderType?.id},
                    {field: 'NPIN', value: user?.npin?.npin},
                    {field: 'Contract Provider First Name', value:user?.name?.firstName},
                    {field: 'Contract Provider Last Name', value:user?.name?.lastName},
                    {field: 'Suffix', value:user?.name?.suffix?.id},
                    {field: 'Contract Provider Email', value:user?.email?.officialEmail},
                    {field: 'Mobile Number', value:user?.communication?.mobileNumber},
                    {field: 'Address Line', value:user?.address?.addressLine},
                    {field: 'City', value:user?.address?.city},
                    {field: 'State', value:user?.address?.state},
                    {field: 'Zipcode', value:user?.address?.zipcode}
                  ];
  let temp = [];
  temp.push(user?.name?.firstName);
  temp.push(fieldData?.filter(data=>data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data=> data?.field));
  emptyFields[index] = temp;
  })
  return emptyFields;
}

export const validateBusinessEntity = (contract) => {
  let businessEntity = contract?.contractorBusinessEntity;
  let fieldData = [{field:'NPIN', value:businessEntity?.contractorNPIN?.npin},
                  {field: 'Tax Id', value: businessEntity?.contractorEntityTaxId?.taxId},
                  {field: 'Business Entity Name', value:businessEntity?.businessEntity?.name},
                  {field: 'Point Of Contact - First Name', value:businessEntity?.businessEntityUser?.name?.firstName},
                  {field: 'Point Of Contact - Last Name', value:businessEntity?.businessEntityUser?.name?.lastName},
                  {field: 'Business Contact Email Address', value:businessEntity?.businessEntityUser?.email?.officialEmail},
                  {field: 'Mobile Number', value:businessEntity?.businessEntityUser?.contactNumber?.number},
                  {field: 'Address Line', value:businessEntity?.mailingAddress?.addressLine},
                  {field: 'City', value:businessEntity?.mailingAddress?.city},
                  {field: 'State', value:businessEntity?.mailingAddress?.state},
                  {field: 'Zipcode', value:businessEntity?.mailingAddress?.zipcode},
                ];
  const emptyFields = fieldData?.filter(data=>data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data=> data?.field);
  return emptyFields;
}

export const validateServices = (contract) => {
  let services = contract?.contractedServices;
  let emptyFields = [];
  services?.map((service,index)=>{
    if(service?.activityType?.activityType !== 'Administrative / Miscellaneous Services'){
      let fieldData = [{field:'sites', value:service?.sites?.length},
                      {field: 'Activities', value: service?.activities?.length},
                      {field: 'Service Schedule', value:service?.contractedSchedule?.minimum?.value},
                      {field: 'Duration', value:service?.duration?.hours},
                      {field: 'Service Days', value:service?.serviceDays},
                      {field: 'Total Sessions', value:service?.totalSessions?.value},
                      {field: 'Working Hours - From', value:service?.workingPeriod?.from},
                      {field: 'Working Hours - To', value:service?.workingPeriod?.to}
                    ];
      let temp = fieldData?.filter(data=>data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data=> data?.field);
      emptyFields[index] = temp;
    }
  } );
  console.log('check check', contract?.contractName?.contractName, emptyFields);
  return emptyFields;
}

export const validateTimesheetSubmission = (contract) => {
  let timesheets = contract?.timesheetSubmissionTerms;
  let isEmptyField = [];
  let fieldData = [];
  if(timesheets === null || timesheets?.timesheetSubmissionServicesCount?.count === 0){
    isEmptyField = ['Number Of Timesheet',
    'Timesheet Label',
    'Payment Source',
    'Service Log Period For Timesheet Submission',
    'Contracted Activity To Include',
    'Day Limit For Submission Of Timesheet Based On Activity Service Date',
    'Day Limit For Submission Of Timesheet Based On Contract End Date',
    'Invoice Processing Days', 'Invoice Processing Goal',
    'Invoice Processing Threshold'];
  }
  timesheets?.timesheetActivitiesPeriods?.map((data,index)=>{
    let fieldData = [{field:'Number Of Timesheet', value:timesheets?.timesheetSubmissionServicesCount?.count},
                    {field: `Timesheet Label ${index+1}`, value: data?.timesheetLabel?.label},
                    {field: `Payment Source ${index+1}`, value:data?.paymentSource},
                    {field: `Service Log Period For Timesheet Submission ${index+1}`, value:data?.servicePeriod?.value},
                    {field: `Contracted Activity To Include ${index+1}`, value:data?.activities?.length},
                    {field: 'Day Limit For Submission Of Timesheet Based On Activity Service Date', value:timesheets?.dayLimit?.activityServiceDate?.days},
                    {field: 'Day Limit For Submission Of Timesheet Based On Contract End Date', value:timesheets?.dayLimit?.contractEndDate?.days},
                    {field: 'Maximum Absence Allowed', value:timesheets?.maximumAbsenceAllowed?.days},
                    {field: 'Planned Absence Limit', value:timesheets?.plannedAbsenceLimit?.days},
                    {field: 'Invoice Processing Days', value:timesheets?.invoiceProcessing?.days},
                    {field: 'Invoice Processing Goal', value:timesheets?.invoiceProcessing?.goal},
                    {field: 'Invoice Processing Threshold', value:timesheets?.invoiceProcessing?.threshold},
                    ];
    let temp = fieldData?.filter(data=>data?.value === null || data?.value === '' || data?.value === undefined || data?.value === 0)?.map(data=> data?.field);
    isEmptyField.push(...temp);
  })
console.log('ssdfsdf',contract?.contractName?.contractName,isEmptyField);
return isEmptyField;
}


export const validateTimesheetProcessingWorkflow = (contract) => {
  let isValid = false;
  if(contract?.workFlowDetails?.length !== 0){
    isValid = true;
  };
  return isValid;
}

export const validateRequestProcessingWorkflow = (contract) => {
  let emptyFields = [];
  if(contract?.addOnRequestWorkFlow === null){
    emptyFields.push('Add-On Request Workflow');
  }
  if(contract?.absenceRequestWorkFlow === null){
    emptyFields.push('Absence Request Wokflow');
  }
  return emptyFields;
}

export const validateTabs = async(contractId) => {
  const { data: data } = await GET(`contract-managment-service/contracts/${contractId}`);
  let contract = data;
  let tab1 = validateContractIDTermLimit(contract);
  let tab2 = validateContractProvider(contract);
  let tab3 = validateBusinessEntity(contract);
  let tab4 = validateServices(contract);
  let tab5 = validateTimesheetSubmission(contract);
  let tab7 = validateTimesheetProcessingWorkflow(contract);
  let tab8 = validateRequestProcessingWorkflow(contract);
  let isTabsValid = {
    tab1: tab1?.length === 0, value1:tab1,
    tab2: tab2?.length === 0, value2: tab2,
    tab3: tab3?.length === 0, value3: tab3,
    tab4: tab4?.length === 0, value4: tab4,
    tab5: tab5?.length === 0, value5: tab5,
    tab7: tab7, value7: tab7,
    tab8: tab8?.length === 0, value8: tab8,
  };
  return isTabsValid;
}
