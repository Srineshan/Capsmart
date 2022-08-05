import React, { useState, useEffect } from 'react';
import { InputGroup, TagInput, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import style from './index.module.scss';

const VALUES4 = ['Activity 1', 'Activity 2', 'Activity 3'];
const VALUES3 = ['Activity Reviewer'];

const TimeSheetSubmissionTerms = ({getViewPage8, getCurrentPage}) => {
    const contractId = window.location.hash.substr(1);
    const [timeSheetCount, setTimeSheetCount] = useState(0);
    const [contractedTimeCommitment, setContractedTimeCommitment] = useState(false);
    const [activityTags, setActivityTags] = useState(VALUES3);
    const [contractedActivityTags, setContractedActivityTags] = useState(VALUES4);
    const [timeSheetLabelOne, setTimeSheetLabelOne] = useState('');
    const [servicePeriod, setServicePeriod] = useState('');
    const [contractedTimeCommitmentHour, setContractedTimeCommitmentHour] = useState('');
    const [contractedTimeCommitmentFrequency, setContractedTimeCommitmentFrequency] = useState('WEEK');
    const [plannedAbsence, setPlannedAbsence] = useState(0);
    const [maxUnplannedAbsence, setMaxUnplannedAbsence] = useState(0);
    const [invoiceProcessingDay, setInvoiceProcessingDay] = useState(0);
    const [invoiceProcessingDayThreshold, setInvoiceProcessingDayThreshold] = useState(0);
    const [invoiceProcessingDayGoal, setInvoiceProcessingDayGoal] = useState(0);
    const [dayLimitForSubmissionBasedOnActivityServiceDate, setDayLimitForSubmissionBasedOnActivityServiceDate] = useState(0);
    const [dayLimitForSubmissionBasedOnContractEndDate, setDayLimitForSubmissionBasedOnContractEndDate] = useState(0);
    const [timesheetSubmissionTerms, setTimesheetSubmissionTerms] = useState({});
    const [timesheetFields, setTimesheetFields] = useState([]);
    const [timesheetValues, setTimesheetValues] = useState([{
        "timesheetLabel": {
            "label": ""
          },
          "activities": [
            {
              "activityType": {
                "activityType": ""
              },
              "performingActivity": {
                "activity": ""
              }
            }
          ],
          "servicePeriod": {
            "value": ""
          }
    }]);
    const [timesheetValuesToUse, setTimesheetValuesToUse] = useState([]);
    const [timesheetActivity, setTimesheetActivity] = useState([{
        activityType: '', performingActivity: ''
    }]);

    const handleContractedActivityTagsAdd = values => {
        setContractedActivityTags([...activityTags, values]);
    };

    const handleContractedActivityTagsRemove = (tags, index) => {
        const updatedTags4 = [tags];
        updatedTags4.splice(index, 1);
        tags = updatedTags4;
        setContractedActivityTags(tags);
      };

      const getTagProps = (_v, index) => ({
        minimal: true,
    });

    const handleTimesheetValue = (i, name, value) => {
        console.log(i, name, value)
        let temp = timesheetValues;
        if(name === 'label'){
            temp[i] = {
                timesheetLabel: {label: value},
                servicePeriod: temp[i]?.servicePeriod,
                activities: temp[i]?.activities
            }
        }
        if(name === 'period'){
            temp[i] = {
                timesheetLabel: temp[i]?.timesheetLabel,
                servicePeriod: {value: value},
                activities: temp[i]?.activities
            }
        }
        setTimesheetValues(temp)
    }

    const getTimesheetFields = () => {
        let tempValues = [];
        for(let i=timesheetValues?.length; i<timeSheetCount;i++){
            tempValues.push({
                "timesheetLabel": {
                    "label": ""
                },
                "activities": [
                {
                    "activityType": {
                    "activityType": ""
                    },
                    "performingActivity": {
                    "activity": ""
                    }
                }
                ],
                "servicePeriod": {
                "value": ""
                }
            })
        }
        let temp = [];
        for(let i=0;i<timeSheetCount;i++){
          temp[i] = (
            <div key={`${i}temp${timeSheetCount + 1}`} className={`${timeSheetCount > 1 && style.contractedBorderStyle} ${style.marginTop20}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>{`Timesheets lable ${i+1} for processing`}</div>
                    <InputGroup className={style.fullWidth} value={timesheetValues?.[i]?.timesheetLabel?.label} onChange={(e) => handleTimesheetValue(i, 'label', e.target.value)} />
                </div>
                {timeSheetCount > 1 && (
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                        <TagInput
                            placeholder="Contracted Activity to include for timesheet 1*"
                            values={contractedActivityTags}
                            onAdd={handleContractedActivityTagsAdd}
                            onRemove={handleContractedActivityTagsRemove}
                            separator={/[\s,]/}
                            addOnBlur={true}
                            addOnPaste={true}
                            tagProps={getTagProps}
                        />
                    </div>
                )}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Service log Period for timesheet submission*</div>
                    <div className={style.displayInRow}>
                        <select
                            name="class"
                            id="Class"
                            value={timesheetValues?.[i]?.servicePeriod?.value}
                            onChange={(e) => handleTimesheetValue(i, 'period', e.target.value)}
                            className={`${style.fullWidth}`}>
                            <option value="End of the month" >
                                End of the month
                            </option>
                            <option value="End of Every Week" >
                                End of Every Week
                            </option>
                            <option value="Every 2 Weeks" >
                                Every 2 Weeks
                            </option>
                            <option value="Every 4 Weeks" >
                                Every 4 Weeks
                            </option>
                            <option value="On Day of Service" >
                                On Day of Service
                            </option>
                        </select>
                        <p className={style.threeFieldWidth}></p>
                    </div>
                </div>
            </div>
          )
        }
        setTimesheetFields(temp);
        setTimesheetValuesToUse(timesheetValues);
        setTimesheetValues(tempValues);
      }

    const getTimeSheetSubmissionTerms = async() => {
        const {data: timesheetSubmissionTerms} = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
        setTimesheetSubmissionTerms(timesheetSubmissionTerms);
    };

    const handleContinue = async() => {
        let data = {
            "timesheetSubmissionServicesCount": {
              "count": timeSheetCount
            },
            "timesheetActivitiesPeriods": timesheetValues,
            "contractorBusinessContact": {
              "hours": contractedTimeCommitmentHour,
              "frequency": contractedTimeCommitmentFrequency,
              "contractedTimeCommitment": contractedTimeCommitment
            },
            "plannedAbsenceLimit": {
              "days": plannedAbsence
            },
            "maximumAbsenceAllowed": {
              "days": maxUnplannedAbsence
            },
            "invoiceProcessing": {
              "days": invoiceProcessingDay,
              "threshold": invoiceProcessingDayThreshold,
              "goal": invoiceProcessingDayGoal
            },
            "dayLimit": {
              "activityServiceDate": {
                "days": dayLimitForSubmissionBasedOnActivityServiceDate
              },
              "contractEndDate": {
                "days": dayLimitForSubmissionBasedOnContractEndDate
              }
            }
        }

        const response = await PUT(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`, JSON.stringify(data));
        if(response){
            SuccessToaster('Timesheet Submission Terms Updated Successfully');
        }
        else {
            ErrorToaster('Unexpected Error');
        }
        console.log(data)
    }

    console.log(timesheetValues, timesheetValuesToUse)

    useEffect(()=>{
        setTimeSheetCount(timesheetSubmissionTerms?.timesheetSubmissionServicesCount?.count);
        setContractedTimeCommitment(timesheetSubmissionTerms?.contractorBusinessContact?.contractedTimeCommitment);
        setContractedTimeCommitmentHour(timesheetSubmissionTerms?.contractorBusinessContact?.hours);
        setContractedTimeCommitmentFrequency(timesheetSubmissionTerms?.contractorBusinessContact?.frequency);
        setPlannedAbsence(timesheetSubmissionTerms?.plannedAbsenceLimit?.days);
        setMaxUnplannedAbsence(timesheetSubmissionTerms?.maximumAbsenceAllowed?.days);
        setInvoiceProcessingDay(timesheetSubmissionTerms?.invoiceProcessing?.days);
        setInvoiceProcessingDayThreshold(timesheetSubmissionTerms?.invoiceProcessing?.threshold);
        setInvoiceProcessingDayGoal(timesheetSubmissionTerms?.invoiceProcessing?.goal);
        setDayLimitForSubmissionBasedOnActivityServiceDate(timesheetSubmissionTerms?.dayLimit?.activityServiceDate?.days);
        setDayLimitForSubmissionBasedOnContractEndDate(timesheetSubmissionTerms?.dayLimit?.contractEndDate?.days);
        setTimesheetValues(timesheetSubmissionTerms?.timesheetActivitiesPeriods);
    },[timesheetSubmissionTerms]);

    useEffect(()=>{
        getTimeSheetSubmissionTerms();
    },[])

    useEffect(()=>{
        getTimesheetFields();
    },[timeSheetCount])

    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Number of Timesheets to Submit for Services Performed</div>
                    <InputGroup className={style.fourFieldWidth} type="number" value={timeSheetCount} onChange={(e) => setTimeSheetCount(parseInt(e.target.value))} />
                </div>
                <div>
                    {timesheetFields}
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contracted Time Commitment*</div>
                    <div className={`${style.displayInRow}  `}>
                        <FormControlLabel
                            control={
                                <Switch checked={contractedTimeCommitment} className={`${style.textAlignLeft}`} onChange={() => setContractedTimeCommitment(!contractedTimeCommitment)} />
                            }
                            className={`${style.switchFontStyle}`}
                            label={'YES'}
                        />
                        {timeSheetCount === 1 && (
                            <div className={style.displayInRow}>
                                <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20} ${style.marginTop15}`}  placeholder="HH" maxLength={2}
                                value={contractedTimeCommitmentHour} onChange={(e) => setContractedTimeCommitmentHour(e.target.value)} />
                                <select
                                    name="class"
                                    id="Class"
                                    value={contractedTimeCommitmentFrequency}
                                    onChange={(e) => setContractedTimeCommitmentFrequency(e.target.value)}
                                    className={`${style.threeFieldWidth} ${style.marginLeft20} ${style.marginTop} `}>
                                    <option value="WEEK" >
                                        Week
                                    </option>
                                    <option value="MONTH" >
                                        Month
                                    </option>
                                    <option value="YEAR" >
                                        Year
                                    </option>
                                </select>
                            </div>
                        )}
                        {timeSheetCount === 2 && (
                            <div className={style.displayInRow}>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} ${style.marginTop10}`}>
                                    <EditableText  placeholder="HH" maxLength={2} className={style.editableTextSpecifiedStyle}
                                    value={contractedTimeCommitmentHour} onChange={(e) => setContractedTimeCommitmentHour(e)} />
                                    <div className={style.textElementWithNurse}>Specified: 160</div>
                                </div>
                                <select
                                    name="class"
                                    id="Class"
                                    value={contractedTimeCommitmentFrequency}
                                    onChange={(e) => setContractedTimeCommitmentFrequency(e.target.value)}
                                    className={`${style.threeFieldWidth} ${style.marginLeft20} ${style.marginTop10} `}>
                                    <option value="WEEK" >
                                        Week
                                    </option>
                                    <option value="MONTH" >
                                        Month
                                    </option>
                                    <option value="YEAR" >
                                        Year
                                    </option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Planned Absence Notification Days limit*</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={plannedAbsence}  placeholder="0" maxLength={2} onChange={(e) => setPlannedAbsence(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Maximum Unplanned Absence Days Allowed *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={maxUnplannedAbsence}  placeholder="0" maxLength={2} onChange={(e) => setMaxUnplannedAbsence(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Invoice Processing Day Range Goal*</div>
                    <div className={style.displayInRow}>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                            <EditableText value={invoiceProcessingDay}  placeholder="0" maxLength={2} onChange={(e) => setInvoiceProcessingDay(e)} className={style.editableTextStyleDays} />
                            <div className={style.textElementWithoutBackgroundDays}>Days</div>
                        </div>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} `}>
                            <div className={style.textElementWithNurse}>Threshold</div>
                            <EditableText value={invoiceProcessingDayThreshold}  placeholder="0" maxLength={2} onChange={(e) => setInvoiceProcessingDayThreshold(e)} className={style.editableTextThresholdStyle} />
                        </div>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder}`}>
                            <div className={style.textElementWithNurse}>Goal</div>
                            <EditableText value={invoiceProcessingDayGoal}  placeholder="0" maxLength={2} onChange={(e) => setInvoiceProcessingDayGoal(e)} className={style.editableTextThresholdStyle} />
                        </div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on activity service date *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnActivityServiceDate}  placeholder="0" maxLength={2} onChange={(e) => setDayLimitForSubmissionBasedOnActivityServiceDate(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on contract end date</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnContractEndDate}  placeholder="0" maxLength={2} onChange={(e) => setDayLimitForSubmissionBasedOnContractEndDate(e)} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Payment & Compensation')}}>BACK</button>
                <div>
                    <button className={style.newContractOutlinedButton} onClick={() => handleContinue()}>SAVE IN-PROGRESS</button>
                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { getViewPage8(true); getCurrentPage('Timesheet Processing Workflow') }}>CONTINUE</button>
                </div>
            </div>
        </div>
    )
}

export default TimeSheetSubmissionTerms;
