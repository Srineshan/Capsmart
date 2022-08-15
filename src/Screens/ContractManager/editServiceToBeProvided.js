import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, EditableText, RadioGroup, Radio, Checkbox, Tag } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {PUT, GET} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';
import SendEmailUserList from './mailUser';

const EditServiceProvided = ({ getEditServiceDialog, getAddOn, contractId, selectedService, selectContractInfo}) => {
    const [sendEmailNotification, setSendEmailNotification] = useState(false);
    const [activityType, setActivityType] = useState('OutPatient Surgery Clinic Session');
    const [activityContractedFor, setActivityContractedFor] = useState('Clinic Session Blocks');
    const [isDesignatedSpecificContractor, setIsDesignatedSpecificContractor] = useState(true);
    const [addOnService, setAddOnService] = useState('Clinic Session');
    const [outpatientClinicalSessionRate, setOutpatientClinicalSessionRate] = useState(0);
    const [outpatientClinicalSessionDuration, setOutpatientClinicalSessionDuration] = useState(0);
    const [fractureClinicalSessionRate, setFractureClinicalSessionRate] = useState(0);
    const [fractureClinicalSessionDuration, setFractureClinicalSessionDuration] = useState(0);
    const [clinicalSessionExtension, setClinicalSessionExtension] = useState(0);
    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [contractedServiceProvider, setContractedServiceProvider] = useState('');
    const [activityOrServiceType, setActivityOrServiceType] = useState('Medical / Surgical Care Contracted Services');
    const [regularClinicSchedule, setRegularClinicSchedule] = useState(0);
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [regularClinicScheduleFrequency, setRegularClinicScheduleFrequency] = useState('WEEK');
    const [allActivities, setAllActivities] = useState(false);
    const [additionalCompensationTitle, setAdditionalCompensationTitle] = useState('');
    const [additionalCompensationPerMonth, setAdditionalCompensationPerMonth] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [frequency, setFrequency] = useState('WEEK');
    const [duration, setDuration] = useState(0);
    const [payment, setPayment] = useState(0);
    const [withNurse, setWithNurse] = useState(0);
    const [withoutNurse, setWithoutNurse] = useState(0);
    const [noTargetApplicable, setNoTargetApplicable] = useState(false);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);
    const [totalContractedServiceFrequency, setTotalContractedServiceFrequency] = useState('WEEK');
    const [dutyDays, setDutyDays] = useState('');
    const [coverageCallDutyType, setCoverageCallDutyType] = useState('All On Call Service Duty');
    const [contractedServices, setContractedServices] = useState([]);
    const [users,setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const getSendEmailNotification = (value) => {
        setSendEmailNotification(value)
    }
    const leftElementButton = (text) => {
        return (
            <button className={`${style.minMaxLeftElement}`} >{text}</button>
        )
    }

    useEffect(()=> {
        getContractedServices();
        getUserData();
    }, [])

    useEffect(()=> {
        setMin(selectedService?.minimum?.value);
        setMax(selectedService?.maximum?.value);
        setWithNurse(selectedService?.withNurse?.value);
        setWithoutNurse(selectedService?.withoutNurse?.value);
        setAdditionalClinicSchedule(selectedService?.schedule?.value);
        setAdditionalSchedule(selectedService?.schedule?.scheduleRequired);
        setDuration(selectedService?.duration?.hours);
        setPayment(selectedService?.payableAmount?.value);
        setTotalContractedService(selectedService?.totalSessions?.value);
        setTotalContractedServiceFrequency(selectedService?.totalSessions?.frequency);
        setWorkingPeriodFrom(selectedService?.workingPeriod?.from);
        setWorkingPeriodTo(selectedService?.workingPeriod?.to);
        setActivityContractedFor(selectedService?.performingActivity?.activity);
        setNoTargetApplicable(selectedService?.noTargetApplicable);
        setIsDesignatedSpecificContractor(selectedService?.designateSpecificContractor);
        setRegularClinicScheduleFrequency(selectedService?.frequency);
        setFrequency(selectedService?.schedule?.frequency);
        setActivityOrServiceType(selectedService?.activityType?.activityType);
        setContractedServiceProvider(selectedService?.users?.[0]?.id)
        setSelectedUsers(selectedService?.users);
        if(selectedService?.activityType?.activityType === "Medical / Surgical Care Contracted Services" &&  selectedService?.performingActivity?.activity === "On Call Coverage Duty Days" ){
            setDutyDays(selectedService?.activityResponse?.dataMap?.dutyDays);
            setCoverageCallDutyType(selectedService?.activityResponse?.dataMap?.coverageCallDutyType);
        }
        if(selectedService?.activityType?.activityType === "Medical / Surgical Care Contracted Services" &&  selectedService?.performingActivity?.activity === "Department Oversight Role & Responsibility"){
            setAdditionalCompensationTitle(selectedService?.activityResponse?.dataMap?.additionalCompensationTitle);
            setAdditionalCompensationPerMonth(selectedService?.activityResponse?.dataMap?.additionalCompensationPerMonth);
        }

    }, [])

    console.log(contractId, selectedUsers)

    const getContractedServices = async() => {
        const {data: contractedServices} = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
        setContractedServices(contractedServices?.contractedServices)
    }

    const getUserData = async() => {
        const {data: userData} = await GET(`user-management-service/user?contractID=${contractId}`);
        if(userData){
          setUsers(userData);
        }
    }

    console.log(contractedServices?.findIndex(data => data?.performingActivity?.activity === activityContractedFor))


    const handleSave = async() => {
        if(activityOrServiceType === "Medical / Surgical Care Contracted Services" ){
            const data = {

                    "activityType": {
                        "activityType": activityOrServiceType
                    },
                    "users": selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers,
                    "performingActivity": {
                        "activity": activityContractedFor
                    },
                    "activityResponse": {
                        "dataMap": {
                            ...( activityOrServiceType === "Medical / Surgical Care Contracted Services" &&  activityContractedFor === "On Call Coverage Duty Days" && 
                            {'dutyDays':dutyDays}),
                            ...( activityOrServiceType === "Medical / Surgical Care Contracted Services" &&  activityContractedFor === "On Call Coverage Duty Days" &&  
                            {'coverageCallDutyType': coverageCallDutyType}),
                            ...( activityOrServiceType === "Medical / Surgical Care Contracted Services" &&  activityContractedFor === "Department Oversight Role & Responsibility" && 
                            {'additionalCompensationTitle':additionalCompensationTitle}),
                            ...( activityOrServiceType === "Medical / Surgical Care Contracted Services" &&  activityContractedFor === "Department Oversight Role & Responsibility" && 
                            {'additionalCompensationPerMonth': additionalCompensationPerMonth}),
                        }
                    },
                    "minimum": {
                        "value": parseInt(min)
                    },
                    "maximum": {
                        "value": parseInt(max)
                    },
                    "frequency": regularClinicScheduleFrequency,
                    "withNurse": {
                        "value": parseInt(withNurse)
                    },
                    "withoutNurse": {
                        "value": parseInt(withoutNurse)
                    },
                    "schedule": {
                        "value": parseInt(additionalClinicSchedule),
                        "frequency": frequency,
                        "scheduleRequired": additionalSchedule
                    },
                    "duration": {
                        "hours": parseInt(duration)
                    },
                    "payableAmount": {
                        "value": parseInt(payment)
                    },
                    "totalSessions": {
                        "value": parseInt(totalContractedService),
                        "frequency": totalContractedServiceFrequency
                    },
                    "workingPeriod": {
                        "from": workingPeriodFrom,
                        "to": workingPeriodTo
                    },
                    "noTargetApplicable": noTargetApplicable,
                    "designateSpecificContractor": isDesignatedSpecificContractor
                }

            let services = contractedServices;
            let selectedServiceIndex = contractedServices?.findIndex(data => data?.performingActivity?.activity === activityContractedFor);
            services[selectedServiceIndex] = data;
            let formattedData = {
                contractedServices: services
            } 

            const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
            if(response){
                SuccessToaster('Contracted Service Updated Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }
        } else if(activityOrServiceType === "Supplemental Clinical Services" ){
            const data = {
                    "activityType": {
                        "activityType": activityOrServiceType
                    },
                    "users": selectContractInfo === "INDIVIDUAL" ? selectedUser : selectedUsers,
                    "performingActivity": {
                        "activity": activityContractedFor
                    },
                    "activityResponse": {
                        "dataMap": {}
                    },
                    "minimum": {
                        "value": parseInt(min)
                    },
                    "maximum": {
                        "value": parseInt(max)
                    },
                    "frequency": regularClinicScheduleFrequency,
                    "withNurse": {
                        "value": parseInt(withNurse)
                    },
                    "withoutNurse": {
                        "value": parseInt(withoutNurse)
                    },
                    "schedule": {
                        "value": parseInt(additionalClinicSchedule),
                        "frequency": frequency,
                        "scheduleRequired": additionalSchedule
                    },
                    "duration": {
                        "hours": parseInt(duration)
                    },
                    "payableAmount": {
                        "value": parseInt(payment)
                    },
                    "totalSessions": {
                        "value": parseInt(totalContractedService),
                        "frequency": totalContractedServiceFrequency
                    },
                    "workingPeriod": {
                        "from": workingPeriodFrom,
                        "to": workingPeriodTo
                    },
                    "noTargetApplicable": noTargetApplicable,
                    "designateSpecificContractor": isDesignatedSpecificContractor
            }

            let services = contractedServices;
            let selectedServiceIndex = contractedServices?.findIndex(data => data?.performingActivity?.activity === activityContractedFor);
            services[selectedServiceIndex] = data;
            let formattedData = {
                contractedServices: services
            } 

            const response = await PUT(`contract-managment-service/contracts/${contractId}/ContractedService`, JSON.stringify(formattedData));
            if(response){
                SuccessToaster('Contracted Service Updated Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }
        }
    }

    const handleUsers = (value) => {
        if (value !== '0') {
          const selectedValue = users?.filter(data => data?.id === value)?.map(data => data)[0];
          if (!selectedUsers?.map(data => data?.id)?.includes(value)) {
            setSelectedUsers([...selectedUsers, selectedValue]);
          }
          console.log(selectedValue)
        }
    }

    const usersTags = selectedUsers
    ?.filter(data => users?.map(user => user.id === data?.id))
    .map((tag, index) => {
      const onRemove = () => {
        setSelectedUsers(selectedUsers.filter((user) => user?.id !== tag?.id)?.map(data=>data));
      };
      return (
        <Tag key={index} onRemove={onRemove} large={true} className={style.tagStyle}>
          {tag?.name?.firstName} {tag?.name?.lastName}
        </Tag>
      );
    });

    const reset = () => {
        setMin(0);
        setMax(0);
        setWithNurse(0);
        setWithoutNurse(0);
        setAdditionalClinicSchedule(0);
        setAdditionalSchedule(false);
        setDuration(0);
        setPayment(0);
        setTotalContractedService(0);
        setWorkingPeriodFrom('');
        setWorkingPeriodTo('');
        setActivityContractedFor('');
    }

    const inputElementText = (text) => {
        return (
            <button className={`${style.textElement}`} >{text}</button>
        )
    }

    // const handleContinue = async() => {
    //     const data = {
    //         compensationBasis: compensation,
    //         rvuQuantity: rvuQuantity,
    //         frequency: frequency,
    //         fteEquivalent: fteEquivalent,
    //         rvuReferenceUsed: rvuReferenceUsed,
    //         rvuQuantityVariance: rvuQuantityVariance,
    //         rvuQuantityPeriod: rvuQuantityPeriod,
    //         compensationOffsetCriteria: compensationOffsetCriteria,
    //         dollarRate: dollarRate,
    //         dollarValue: dollarValue,
    //       }
    //       const response = await PUT(`contract-managment-service/contracts/${contractId}/paymentAndCompensation`, JSON.stringify(data));
    //         if(response){
    //             SuccessToaster('Payment And Compensation Updated Successfully');
    //         }
    //         else {
    //             ErrorToaster('Unexpected Error');
    //         }
    //     console.log(data)
    // }

    useEffect(() => {
        if (activityContractedFor === "Add-On Services Allowed Upon Request Approval"
            || activityContractedFor === "Department Oversight Role & Responsibility"
            || activityContractedFor === "Administrative / Miscellaneous Services") {
            getAddOn(true);
            console.log('entered')
        } else {
            getAddOn(false);
        }
    }, [activityContractedFor]);

    return (
        <div>
            <Dialog isOpen={getEditServiceDialog} onClose={() => getEditServiceDialog(false)} className={`${style.addProofDialog} ${style.addManagerDialogBackground}`}>
                <div className={`${Classes.DIALOG_BODY} `}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Edit Selected Services To Be Provided As Per Contract</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getEditServiceDialog(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={style.proofBorder}>
                        <div className={`${style.addManagerGrid}`}>
                            <div className={style.extentionLableStyle}>Activity /Service Type*</div>
                            <div>
                                <select
                                    name="class"
                                    id="Class"
                                    disabled
                                    value={activityOrServiceType}
                                    onChange={(e) => {setActivityOrServiceType(e.target.value);reset()}}
                                    className={`${style.fullWidth} ${style.marginRight20}`}>
                                    <option value="Medical / Surgical Care Contracted Services" >
                                        Medical / Surgical Care Contracted Services
                                    </option>
                                    <option value="Supplemental Clinical Services" >
                                        Supplemental Clinical Services
                                    </option>
                                    <option value="Add-On Services Allowed Upon Request Approval" >
                                        Add-On Services Allowed Upon Request Approval
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Designate Specific Contractor*</div>
                            <div>
                                <div className={`${style.displayInRow} `}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={isDesignatedSpecificContractor} disabled={(selectContractInfo === "INDIVIDUAL") && true} className={`${style.textAlignLeft}`} onChange={() => setIsDesignatedSpecificContractor(!isDesignatedSpecificContractor)} />
                                        }
                                        className={`${style.switchFontStyle} ${style.flexLeft} ${style.marginTop10} `}
                                        label={isDesignatedSpecificContractor ? 'YES' : 'NO'}
                                    />
                                    {isDesignatedSpecificContractor && <select
                                        name="class"
                                        id="Class"
                                        disabled={(selectContractInfo === "INDIVIDUAL") && true}
                                        onChange={(e) => handleUsers(e.target.value)}                                    className={`${style.fullWidth} ${style.marginLeft20} `}>
                                        <option value="0" >
                                            Select Contracted Services Provided
                                        </option>
                                        {users?.map((data, index) => (
                                            <option value={data?.id} key={index}>
                                                {data?.name?.firstName} {data?.name?.lastName}
                                            </option>
                                        ))}
                                    </select>}
                                </div>
                                {(selectContractInfo !== "INDIVIDUAL") && (
                                    <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                                        {usersTags}
                                    </div>
                                )}
                            </div>
                        </div>
                        {activityOrServiceType === "Medical / Surgical Care Contracted Services" && (
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Specific Activity Contracted For*</div>
                                <div>
                                    <select
                                        name="class"
                                        id="Class"
                                        disabled
                                        value={activityContractedFor}
                                        onChange={(e) => {setActivityContractedFor(e.target.value);reset()}}
                                        className={`${style.fullWidth} ${style.marginRight20} `}>
                                        <option value="Clinic Session Blocks" >
                                            Clinic Session Blocks
                                        </option>
                                        <option value="On Call Coverage Duty Days" >
                                            On Call Coverage Duty Days
                                        </option>
                                        <option value="Department Oversight Role & Responsibility">
                                            Department Oversight Role & Responsibility
                                        </option>
                                        <option value="Administrative / Miscellaneous Services">
                                            Administrative / Miscellaneous Services
                                        </option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {(activityOrServiceType === "Medical / Surgical Care Contracted Services" && activityContractedFor === 'Administrative / Miscellaneous Services') ?
                            <div>
                                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Regular {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Schedule*</div>
                                    <div className={style.displayInRow}>
                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                            <EditableText value={regularClinicSchedule} onChange={(e) => setRegularClinicSchedule(e)} className={style.editableTextStyle} />
                                            <div className={style.textElementWithoutBackground}>Hours</div>
                                        </div>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={regularClinicScheduleFrequency} 
                                            onChange={(e) => setRegularClinicScheduleFrequency(e.target.value)}
                                            className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                            <option value="WEEK" >
                                                Per Week
                                            </option>
                                            <option value="MONTH" >
                                                Per Month
                                            </option>
                                            <option value="YEAR" >
                                                Per Year
                                            </option>
                                        </select>
                                        <Checkbox checked={allActivities} onChange={(e) => setAllActivities(e.target.checked)} label="All Activities" className={`${style.marginLeft20} ${style.marginTop10}`} />
                                    </div>
                                </div>
                                <div className={style.marginTop20}>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Periodic Productivity Data Review (Monthly)" />
                                        <Checkbox checked={false} label="PA & Non-Physician Staff Supervision" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Administrative & Business Reports Creation" />
                                        <Checkbox checked={false} label="Peer Review Meetings" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Administrative & Business Records Maintenance" />
                                        <Checkbox checked={false} label="Performance of Time Studies" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Credentials Committee Meeting" />
                                        <Checkbox checked={false} label="Performance Improvement Project Meeting" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Corrective Action Plan Participation" />
                                        <Checkbox checked={false} label="Performance Metric Review" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Contractor Clinic ? OR Schedule Maintenance (weekly)" />
                                        <Checkbox checked={false} label="Quality Assurance Meeting" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Contractor On Call Schedule Maintenance (Weekly)" />
                                        <Checkbox checked={false} label="Review of Services Provided by PA & Non-Physician Staff" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Clinic Performance Review" />
                                        <Checkbox checked={false} label="Service Billing & Coding" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Contract Performance Review Meeting" />
                                        <Checkbox checked={false} label="Training & Education Activity" />
                                    </div>
                                    <div className={style.twoCol}>
                                        <Checkbox checked={false} label="Medical Records Maintenance" />
                                        <Checkbox checked={false} label="Utilization Review Meeting" />
                                    </div>
                                </div>
                            </div>
                            : (activityOrServiceType === "Medical / Surgical Care Contracted Services" &&  activityContractedFor === 'Department Oversight Role & Responsibility') ?
                                <div>
                                    <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                        <div className={`${style.addManagerGrid}`}>
                                            <div className={style.extentionLableStyle}>Title*</div>
                                            <select
                                                name="class"
                                                id="Class"
                                                value={additionalCompensationTitle}
                                                onChange={(e) => setAdditionalCompensationTitle(e.target.value)}
                                                className={`${style.fullWidth} ${style.marginRight20} `}>
                                                <option value="Title(fetched from earlier Scenario)" >
                                                    Title(fetched from earlier Scenario)
                                                </option>
                                            </select>
                                        </div>
                                        <div className={` ${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Additional Compensation*</div>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                    <div className={style.textElementWithoutBackground}>$</div>
                                                    <EditableText value={additionalCompensationPerMonth} onChange={(e) => setAdditionalCompensationPerMonth(e)} className={style.editableTextStyleWithoutPadding} />
                                                </div>
                                                <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Month</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : (activityOrServiceType === "Medical / Surgical Care Contracted Services" &&  activityContractedFor === "Clinic Session Blocks") ? (
                                    <div>
                                        {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Specify Activity Type</div>
                            <div>
                                <select
                                    name="class"
                                    id="Class"
                                    value={activityType}
                                    onChange={(e) => setActivityType(e.target.value)}
                                    className={`${style.fullWidth} ${style.marginRight20} `}>
                                        <option value="OutPatient Surgery Clinic Session" >
                                        OutPatient Surgery Clinic Session
                                        </option>
                                        <option value="Fracture Clinic Session" >
                                        Fracture Clinic Session
                                        </option>
                                        <option value="Surgery Session" >
                                        Surgery Session
                                        </option>
                                </select>
                            </div>
                        </div> */}
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Regular {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Schedule*</div>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                    <div className={style.textElement}>MIN</div>
                                                    <EditableText value={min} onChange={(e) => setMin(e)} className={style.editableTextStyle} />
                                                </div>
                                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                    <div className={style.textElement}>MAX</div>
                                                    <EditableText value={max} onChange={(e) => setMax(e)} className={style.editableTextStyle} />
                                                </div>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={regularClinicScheduleFrequency} 
                                                    onChange={(e) => setRegularClinicScheduleFrequency(e.target.value)}
                                                    className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                                    <option value="WEEK" >
                                                        Per Week
                                                    </option>
                                                    <option value="MONTH" >
                                                        Per Month
                                                    </option>
                                                    <option value="YEAR" >
                                                        Per Year
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>{activityType === "Surgery Session" ? 'Surgery Case' : 'Clinic Patient'} Target*</div>
                                            <div className={`${style.displayInRow} `}>
                                                {activityType !== "Surgery Session" ? (
                                                    <div className={`${style.displayInRow} ${style.fullWidth}`}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.twoFieldWidth} `}>
                                                            <div className={style.textElementWithNurse}>WITH NURSE</div>
                                                            <EditableText value={withNurse} onChange={(e) => setWithNurse(e)} className={style.editableTextStyle} />
                                                        </div>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.twoFieldWidth}`}>
                                                            <div className={style.textElementWithNurse}>WITHOUT NURSE</div>
                                                            <EditableText value={withoutNurse} onChange={(e) => setWithoutNurse(e)} className={style.editableTextStyle} />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <InputGroup value="1" className={`${style.marginLeft20} ${style.threeFieldWidth}`} />
                                                )}
                                                <Checkbox checked={noTargetApplicable} onChange={(e) => setNoTargetApplicable(e.target.checked)} label="No Target Applicable" className={`${style.marginLeft20}`} />
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Additional {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Schedule*</div>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.threeFieldWidth}`} >
                                                    <FormControlLabel
                                                        control={
                                                            <Switch checked={additionalSchedule} className={` ${style.textAlignLeft}`} />
                                                        }
                                                        onChange={() => setAdditionalSchedule(!additionalSchedule)}
                                                        className={`${style.switchFontStyle} ${style.flexLeft}`}
                                                        label={'YES'}
                                                    />
                                                </div>
                                                <InputGroup value={additionalClinicSchedule} onChange={(e) => setAdditionalClinicSchedule(e.target.value)} className={`${style.marginLeft20} ${style.threeFieldWidth}`} />
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={frequency} 
                                                    onChange={(e) => setFrequency(e.target.value)}
                                                    className={`${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                                    <option value="WEEK" >
                                                        Every Other Week
                                                    </option>
                                                    <option value="MONTH" >
                                                        Every Other Month
                                                    </option>
                                                    <option value="YEAR" >
                                                        Every Other Year
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>{activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Session Duration</div>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                <EditableText value={duration} onChange={(e) => setDuration(e)} className={style.editableTextStyle} />
                                                <div className={style.textElementWithoutBackground}>Hours</div>
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>{activityType === "Surgery Session" ? 'Surgery' : 'Clinic'} Session Payment Amount*</div>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                <div className={style.textElementWithoutBackground}>$</div>
                                                <EditableText value={payment} onChange={(e) => setPayment(e)} className={style.editableTextStyleWithoutPadding} />
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Total Contracted Service Sessions**</div>
                                            <div className={style.twoCol}>
                                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                                    <EditableText value={totalContractedService} onChange={(e)=> setTotalContractedService(e)} className={style.editableSessionTextStyle} />
                                                    <div className={style.textElement}>120 Specified</div>
                                                </div>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={totalContractedServiceFrequency} 
                                                    onChange={(e)=> setTotalContractedServiceFrequency(e.target.value)}
                                                    className={`${style.fullWidth} ${style.reduceTop} `}>
                                                    <option value="WEEK" >
                                                        Per Contract Week
                                                    </option>
                                                    <option value="MONTH" >
                                                        Per Contract Month
                                                    </option>
                                                    <option value="YEAR" >
                                                        Per Contract Year
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Allowable Working Day Hours For {activityType === "Surgery Session" ? 'Surgery' : 'Clinic'}*</div>
                                            <div className={style.displayInRow}>
                                                <InputGroup 
                                                    value={workingPeriodFrom}
                                                    placeholder="HH:MM"
                                                    onChange={(e)=> setWorkingPeriodFrom(e.target.value) } 
                                                    className={style.threeFieldWidth} 
                                                />                                               
                                                <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p> 
                                                <InputGroup 
                                                    value={workingPeriodTo}
                                                    placeholder="HH:MM"
                                                    onChange={(e)=> setWorkingPeriodTo(e.target.value) }
                                                    className={style.threeFieldWidth}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : activityOrServiceType === "Medical / Surgical Care Contracted Services" && (
                                    <div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>On Call Service Duty Days*</div>
                                            <RadioGroup
                                                inline={true}
                                                className={`${style.marginLeft20} ${activityType === "Surgery Session" && style.marginTop} `}
                                                selectedValue={dutyDays}
                                                onChange={(e) => setDutyDays(e.target.value)}
                                            >
                                                <Radio label="Weekdays" value="Weekdays" />
                                                <Radio label="Weekends" value="Weekends" />
                                                <Radio label="Holidays" value="Holidays" />
                                            </RadioGroup>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Coverage Call Duty Type*</div>
                                            <div>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={coverageCallDutyType}
                                                    onChange={(e) => setCoverageCallDutyType(e.target.value)}
                                                    className={`${style.fullWidth} ${style.marginRight20} `}>
                                                    <option value="All On Call Service Duty" >
                                                        All On Call Service Duty
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                    <div className={style.textElement}>MIN</div>
                                                    <EditableText value={min} onChange={(e) => setMin(e)} className={style.editableTextStyle} />
                                                </div>
                                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                    <div className={style.textElement}>MAX</div>
                                                    <EditableText value={max} onChange={(e) => setMax(e)} className={style.editableTextStyle} />
                                                </div>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={frequency}
                                                    onChange={(e) => setFrequency(e.target.value)}
                                                    className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                                    <option value="WEEK" >
                                                        Per Week
                                                    </option>
                                                    <option value="MONTH" >
                                                        Per Month
                                                    </option>
                                                    <option value="YEAR" >
                                                        Per Year
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>On Call Duty Duration</div>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                <EditableText value={duration} onChange={(e) => setDuration(e)} className={style.editableTextStyle} />
                                                <div className={style.textElementWithoutBackground}>Hours</div>
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>On Call Start</div>
                                            <div className={style.displayInRow}>
                                                <InputGroup 
                                                    value={workingPeriodFrom}
                                                    placeholder="HH:MM"
                                                    onChange={(e)=> setWorkingPeriodFrom(e.target.value) } 
                                                    className={style.threeFieldWidth} 
                                                />                                               
                                                <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p> 
                                                <InputGroup 
                                                    value={workingPeriodTo}
                                                    placeholder="HH:MM"
                                                    onChange={(e)=> setWorkingPeriodTo(e.target.value) }
                                                    className={style.threeFieldWidth}
                                                /> 
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>On Call Coverage Session Unit Value*</div>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                <div className={style.textElementWithoutBackground}>$</div>
                                                <EditableText value={payment} onChange={(e) => setPayment(e)} className={style.editableTextStyleWithoutPadding} />
                                            </div>
                                        </div>
                                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                            <div className={style.extentionLableStyle}>Total Contracted Service Sessions*</div>
                                            <div className={style.twoCol}>
                                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                                    <EditableText value={totalContractedService} onChange={(e)=> setTotalContractedService(e)} className={style.editableSessionTextStyle} />
                                                    <div className={style.textElement}>120 Specified</div>
                                                </div>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={totalContractedServiceFrequency} 
                                                    onChange={(e)=> setTotalContractedServiceFrequency(e.target.value)}
                                                    className={`${style.fullWidth} `}>
                                                    <option value="WEEK" >
                                                        Per Contract Week
                                                    </option>
                                                    <option value="MONTH" >
                                                        Per Contract Month
                                                    </option>
                                                    <option value="YEAR" >
                                                        Per Contract Year
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        {activityOrServiceType === 'Add-On Services Allowed Upon Request Approval' ?
                            <div>
                                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Specify Addon Service*</div>
                                    <div>
                                        <select
                                            name="class"
                                            id="Class"
                                            onChange={(e) => setAddOnService(e.target.value)}
                                            value={addOnService}
                                            disabled
                                            className={`${style.fullWidth} ${style.marginRight20} `}>
                                            <option value="Clinic Session" >
                                                Clinic Session
                                            </option>
                                            <option value="Surgical care activities" >
                                                Surgical care activities
                                            </option>
                                            <option value="On Call Duty Services/activities" >
                                                On Call Duty Services/activities
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                {addOnService === 'On Call Duty Services/activities' ?
                                    <div>
                                        <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                            <div className={`${style.addManagerGrid} `}>
                                                <div className={style.extentionLableStyle}>After Hours Applicable Period*</div>
                                                <div className={style.displayInRow}>
                                                    <InputGroup value="17:01" className={style.threeFieldWidth} />
                                                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                                                    <InputGroup value="07:29" className={style.threeFieldWidth} />
                                                </div>
                                            </div>
                                            <p className={`${style.blue} ${style.marginTop20} ${style.alignCenter}`}> For Case Not Able To Be Done During Regular Hours (Nights, Weekends And Holidays).</p>
                                        </div>
                                        <Checkbox checked={true} label="On Call Duty/Emergency call Day" className={style.marginTop30} />
                                        <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                            <div className={` ${style.addManagerGrid}`}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>On-Call Coverage Rate*</div>
                                                <div className={style.displayInRow}>
                                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                        <div className={style.textElementWithoutBackground}>$</div>
                                                        <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                    </div>
                                                    <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Excess Coverage Day</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Checkbox checked={true} label="Emergency Call Consult" className={style.marginTop30} />
                                        <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                            <div className={` ${style.addManagerGrid} `}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Consult Day Rate*</div>
                                                <div className={style.displayInRow}>
                                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                        <div className={style.textElementWithoutBackground}>$</div>
                                                        <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                    </div>
                                                    <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Surgery Assist Session</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Checkbox checked={true} label="Inpatient Call Consult" className={style.marginTop30} />
                                        <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                            <div className={` ${style.addManagerGrid}`}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Consult Day Rate*</div>
                                                <div className={style.displayInRow}>
                                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                        <div className={style.textElementWithoutBackground}>$</div>
                                                        <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                    </div>
                                                    <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Surgery Assist Session</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Checkbox checked={true} label="Trauma Service/Call on demand" className={style.marginTop30} />
                                        <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                            <div className={` ${style.addManagerGrid}`}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Trauma Service Hourly Rate*</div>
                                                <div className={style.displayInRow}>
                                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                        <div className={style.textElementWithoutBackground}>$</div>
                                                        <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                    </div>
                                                    <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    addOnService === 'Surgical care activities' ?
                                        <div>
                                            <Checkbox checked={true} label="Surgery Session" className={style.marginTop20} />
                                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                <div className={` ${style.addManagerGrid}`}>
                                                    <div className={style.extentionLableStyle}>Surgery Session Rate*</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <div className={style.textElementWithoutBackground}>$</div>
                                                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                        </div>
                                                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Surgery Session</p>
                                                    </div>
                                                </div>
                                                <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                                                    <div className={style.extentionLableStyle}>Surgery Session Duration*</div>
                                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                        <EditableText value="4" className={style.editableTextStyle} />
                                                        <div className={style.textElementWithoutBackground}>Hour</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Checkbox checked={true} label="Surgery Session Extension" className={style.marginTop30} />
                                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                <div className={` ${style.addManagerGrid}`}>
                                                    <div className={style.extentionLableStyle}>Surgery Extension Hourly Rate*</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <div className={style.textElementWithoutBackground}>$</div>
                                                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                        </div>
                                                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Checkbox checked={true} label="Surgery Assist Session" className={style.marginTop30} />
                                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                <div className={` ${style.addManagerGrid}`}>
                                                    <div className={style.extentionLableStyle}>Surgery Session Rate*</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <div className={style.textElementWithoutBackground}>$</div>
                                                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                        </div>
                                                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Surgery Session</p>
                                                    </div>
                                                </div>
                                                <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                                                    <div className={style.extentionLableStyle}>Surgery Assist Session Duration*</div>
                                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                        <EditableText value="4" className={style.editableTextStyle} />
                                                        <div className={style.textElementWithoutBackground}>Hour</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Checkbox checked={true} label="Surgery Assist Session Extension" className={style.marginTop30} />
                                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                <div className={` ${style.addManagerGrid}`}>
                                                    <div className={style.extentionLableStyle}>Surgery Assist Session Hourly Rate*</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <div className={style.textElementWithoutBackground}>$</div>
                                                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                        </div>
                                                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Checkbox checked={true} label="Inpatient Post-Operative Care Services" className={style.marginTop30} />
                                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                <div className={` ${style.addManagerGrid}`}>
                                                    <div className={style.extentionLableStyle}>Inpatient Post-Operative Care Services Hourly Rate**</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <div className={style.textElementWithoutBackground}>$</div>
                                                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                        </div>
                                                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Checkbox checked={true} label="Elective Surgery Case" className={style.marginTop30} />
                                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                <div className={` ${style.addManagerGrid}`}>
                                                    <div className={style.extentionLableStyle}>Elective Surgery Hourly Rate*</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <div className={style.textElementWithoutBackground}>$</div>
                                                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                        </div>
                                                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Checkbox checked={true} label="Emergency / After hours Surgery Case" className={style.marginTop30} />
                                            <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                <div className={` ${style.addManagerGrid} `}>
                                                    <div className={style.extentionLableStyle}>Emergency Surgery Case Hourly Rate*</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <div className={style.textElementWithoutBackground}>$</div>
                                                            <EditableText value="230.00" className={style.editableTextStyleWithoutPadding} />
                                                        </div>
                                                        <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                                                    </div>
                                                </div>
                                                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                                    <div className={style.extentionLableStyle}>After Hours Period*</div>
                                                    <div className={style.displayInRow}>
                                                        <InputGroup value="17:01" className={style.threeFieldWidth} />
                                                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                                                        <InputGroup value="07:29" className={style.threeFieldWidth} />
                                                    </div>
                                                </div>
                                                <p className={`${style.blue} ${style.alignCenter} ${style.marginTop20}`}> For Case Not Able To Be Done During Regular Hours (Nights, Weekends And Holidays).</p>
                                            </div>
                                        </div>

                                        : addOnService === 'Clinic Session' ?
                                            <div>
                                                <Checkbox checked={true} label="Outpatient Clinic Session Block" className={style.marginTop20} />
                                                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                    <div className={` ${style.addManagerGrid} `}>
                                                        <div className={style.extentionLableStyle}>Outpatient Clinic Session Rate*</div>
                                                        <div className={style.displayInRow}>
                                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                                <div className={style.textElementWithoutBackground}>$</div>
                                                                <EditableText value={outpatientClinicalSessionRate} className={style.editableTextStyleWithoutPadding}
                                                                    onChange={(e) => setOutpatientClinicalSessionRate(e)} />
                                                            </div>
                                                            <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Clinic Session</p>
                                                        </div>
                                                    </div>
                                                    <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                                                        <div className={style.extentionLableStyle}>Clinic Session Duration*</div>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <EditableText value={outpatientClinicalSessionDuration} className={style.editableTextStyle}
                                                                onChange={(e) => setOutpatientClinicalSessionDuration(e)} />
                                                            <div className={style.textElementWithoutBackground}>Hour</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Checkbox checked={true} label="Fracture Clinic Session" className={style.marginTop30} />
                                                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                    <div className={` ${style.addManagerGrid}`}>
                                                        <div className={style.extentionLableStyle}>Fracture Session Rate*</div>
                                                        <div className={style.displayInRow}>
                                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                                <div className={style.textElementWithoutBackground}>$</div>
                                                                <EditableText value={payment} className={style.editableTextStyleWithoutPadding}
                                                                    onChange={(e) => setPayment(e)} />
                                                            </div>
                                                            <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Additional Fracture Clinic Session</p>
                                                        </div>
                                                    </div>
                                                    <div className={`  ${style.addManagerGrid} ${style.marginTop20}`}>
                                                        <div className={style.extentionLableStyle}>Fracture Session Duration*</div>
                                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                            <EditableText value={fractureClinicalSessionDuration} className={style.editableTextStyle}
                                                                onChange={(e) => setFractureClinicalSessionDuration(e)} />
                                                            <div className={style.textElementWithoutBackground}>Hour</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Checkbox checked={true} label="Clinic Session Extension" className={style.marginTop30} />
                                                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                                                    <div className={` ${style.addManagerGrid}`}>
                                                        <div className={style.extentionLableStyle}>Clinic Extension Hourly Rate*</div>
                                                        <div className={style.displayInRow}>
                                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                                <div className={style.textElementWithoutBackground}>$</div>
                                                                <EditableText value={clinicalSessionExtension} className={style.editableTextStyleWithoutPadding}
                                                                    onChange={(e) => setClinicalSessionExtension(e)} />
                                                            </div>
                                                            <p className={`${style.extentionLableStyle} ${style.marginLeft20} ${style.marginTop10}`}>Per Hour</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                                    <div className={style.extentionLableStyle}>Allowable Working Day Hours For Clinic Sessions*</div>
                                                    <div className={style.displayInRow}>
                                                        <InputGroup 
                                                            value={workingPeriodFrom}
                                                            placeholder="HH:MM"
                                                            onChange={(e)=> setWorkingPeriodFrom(e.target.value) } 
                                                            className={style.threeFieldWidth} 
                                                        />                                               
                                                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p> 
                                                        <InputGroup 
                                                            value={workingPeriodTo}
                                                            placeholder="HH:MM"
                                                            onChange={(e)=> setWorkingPeriodTo(e.target.value) }
                                                            className={style.threeFieldWidth}
                                                        />
                                                    </div>
                                                </div>
                                            </div> : ''
                                }


                            </div>
                            : activityOrServiceType === 'Supplemental Clinical Services' ?
                                <div>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Applicable Supplemental Clinical Services*</div>
                                        <div>
                                            {/* <Checkbox checked={false} label="Outpatient Clinic Session Block" />
                                            <Checkbox checked={false} label="Clinic Session Extensio" />
                                            <Checkbox checked={false} label="Fracture Clinic Session" />
                                            <Checkbox checked={false} label="Fracture Clinic Extension" />
                                            <Checkbox checked={false} label="Additional Clinical Services Required" />
                                            <Checkbox checked={false} label="Additional Surgical Services Required" /> */}
                                            <select
                                                name="class"
                                                id="Class"
                                                disabled
                                                value={activityContractedFor}
                                                onChange={(e) => setActivityContractedFor(e.target.value)}
                                                className={`${style.fullWidth} ${style.marginRight20}`}>
                                                <option value="0" >
                                                    Choose Applicable Supplemental Clinical Services
                                                </option>
                                                <option value="Outpatient Clinic Session Block" >
                                                Outpatient Clinic Session Block
                                                </option>
                                                <option value="Clinic Session Extension" >
                                                Clinic Session Extension
                                                </option>
                                                <option value="Fracture Clinic Session" >
                                                Fracture Clinic Session
                                                </option>
                                                <option value="Fracture Clinic Extension" >
                                                Fracture Clinic Extension
                                                </option>
                                                <option value="Additional Clinical Services Required" >
                                                Additional Clinical Services Required
                                                </option>
                                                <option value="Additional Surgical Services Required" >
                                                Additional Surgical Services Required
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Contracted Number of Supplemental Hours*</div>
                                        <div className={style.displayInRow}>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                <div className={style.textElement}>MIN</div>
                                                <EditableText value={min} onChange={(e) => setMin(e)} className={style.editableTextStyle} />
                                            </div>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                                <div className={style.textElement}>MAX</div>
                                                <EditableText value={max} onChange={(e) => setMax(e)} className={style.editableTextStyle} />
                                            </div>
                                            <select
                                                name="class"
                                                id="Class"
                                                value={frequency}
                                                onChange={(e) => setFrequency(e.target.value)}
                                                className={` ${style.threeFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                                <option value="WEEK" >
                                                    Per Week
                                                </option>
                                                <option value="MONTH" >
                                                    Per Month
                                                </option>
                                                <option value="YEAR" >
                                                    Per Year
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Supplemental Clinical Service Hour Value*</div>
                                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                            <div className={style.textElementWithoutBackground}>$</div>
                                            <EditableText value={payment} onChange={(e) => setPayment(e)} className={style.editableTextStyleWithoutPadding} />
                                        </div>
                                    </div>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Total Contracted Suplemental Service Sessions*</div>
                                        <div className={style.twoCol}>
                                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                                <EditableText value={totalContractedService} onChange={(e)=> setTotalContractedService(e)} className={style.editableSessionTextStyle} />
                                                <div className={style.textElement}>120 Specified</div>
                                            </div>
                                            <select
                                                name="class"
                                                id="Class"
                                                value={totalContractedServiceFrequency} 
                                                onChange={(e)=> setTotalContractedServiceFrequency(e.target.value)}
                                                className={`${style.fullWidth} ${style.reduceTop} `}>
                                                <option value="WEEK" >
                                                    Per Contract Week
                                                </option>
                                                <option value="MONTH" >
                                                    Per Contract Month
                                                </option>
                                                <option value="YEAR" >
                                                    Per Contract Year
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Allowable Working Day Hours For Supplemental Services*</div>
                                        <div className={style.displayInRow}>
                                            <InputGroup 
                                                value={workingPeriodFrom}
                                                placeholder="HH:MM"
                                                onChange={(e)=> setWorkingPeriodFrom(e.target.value) } 
                                                className={style.threeFieldWidth} 
                                            />                                               
                                            <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p> 
                                            <InputGroup 
                                                value={workingPeriodTo}
                                                placeholder="HH:MM"
                                                onChange={(e)=> setWorkingPeriodTo(e.target.value) }
                                                className={style.threeFieldWidth}
                                            />
                                        </div>
                                    </div>
                                </div> : ''
                        }
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight}`}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {handleSave();getEditServiceDialog(false)}}>UPDATE</button>
                    </div>
                </div>
            </Dialog>
            {sendEmailNotification && (
                <SendEmailUserList getSendEmailNotification={getSendEmailNotification} />
            )}
        </div>
    )
}

export default EditServiceProvided;
