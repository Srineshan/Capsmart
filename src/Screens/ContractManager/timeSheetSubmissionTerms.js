import React, { useState, useEffect } from 'react';
import { InputGroup, TagInput, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import style from './index.module.scss';

const VALUES3 = ['Activity Reviewer'];

const TimeSheetSubmissionTerms = ({getViewPage8, getCurrentPage, contractId}) => {
    const [timeSheetCount, setTimeSheetCount] = useState(0);
    const [contractedTimeCommitment, setContractedTimeCommitment] = useState(false);
    const [activityTags, setActivityTags] = useState(VALUES3);
    const [contractedActivityTags, setContractedActivityTags] = useState([]);
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
    const [contractedServices, setContractedServices] = useState([]);
    const [selectedItems, setSelectedItems] = useState();
    const limit = 3;
    const [timeSheetLabelData,setTimeSheetLabelData] = useState([]);
    const [timesheetValues, setTimesheetValues] = useState([]);
    const [timesheetActivity, setTimesheetActivity] = useState([{
        activityType: '', performingActivity: ''
    }]);

    const getContractedServices = async () => {
        const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
        setContractedServices(contractedServices?.contractedServices)
    }

    useEffect(()=>{
        getContractedServices();
        getTimeSheetSubmissionTerms();
        getTimesheetFields();
    },[])

    useEffect(()=>{
        getTimesheetFields();
        setContractedActivityTags([]);
        setTimeSheetLabelData([]);
    },[timeSheetCount])

    useEffect(()=>{
      formatActivities();
      getTimesheetFields();
    },[contractedActivityTags?.length, timeSheetLabelData, contractedServices])


    const handleContractedActivityTagsAdd = (values, i) => {
        setSelectedItems(values);
        let temp = contractedActivityTags;
        temp.push({index: i,type: contractedServices?.filter(data => data?.performingActivity?.activity === values)?.map(data => data?.activityType?.activityType)[0], activity: values});
        setContractedActivityTags(temp);

    };


    const formatActivities = () => {
        let timeSheetValueData = [];
        for(let i=0; i<timeSheetCount;i++){
          timeSheetValueData[i] = {
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
              }
        }
        timeSheetValueData?.map((data, index) => {
            let temp = [];
            contractedActivityTags?.filter(innerData => innerData?.index === index)?.map((activityData) => {
                temp.push({
                    activityType: {
                        activityType: activityData?.type
                    }, performingActivity: {
                        activity: activityData?.activity
                    }
                })
            })
            let tempFor1TimeSheet = [];
            contractedServices?.map((data) => {
                tempFor1TimeSheet.push({
                    activityType: {
                        activityType: data?.activityType?.activityType
                    }, performingActivity: {
                        activity: data?.performingActivity?.activity
                    }
                })
            })
            if(timeSheetCount > 1){
                data.activities = temp;
                data.timesheetLabel = timeSheetLabelData?.[index]?.label;
                data.servicePeriod = timeSheetLabelData?.[index]?.value;
            } else {
                data.activities = tempFor1TimeSheet;
                data.timesheetLabel = timeSheetLabelData?.[index]?.label;
                data.servicePeriod = timeSheetLabelData?.[index]?.value;
            }
        })
        setTimesheetValues(timeSheetValueData);
    }

      const getTagProps = (_v, index) => ({
        minimal: true,
    });

    const handleTimesheetValue = (i, name, value) => {
      let temp = timeSheetLabelData;
      if(name === 'label'){
        temp[i] = {label:value, value:temp[i]?.value}
      }else{
        temp[i] = {label: temp[i]?.label, value:value}
      }
      console.log('entered', temp)
      setTimeSheetLabelData(temp);
      formatActivities();
    }

    console.log(timeSheetLabelData)

    const handleContractedActivityTagsRemove = (tags,index) => {
      setContractedActivityTags(contractedActivityTags?.filter((data,indexValue)=>index !== indexValue)?.map(data=>data));
    }

    const getTimesheetFields = () => {
        let temp = [];
        for(let i=0;i<timeSheetCount;i++){
          temp[i] = (
            <div key={`${i}temp${timeSheetCount + 1}`} className={`${timeSheetCount > 1 && style.contractedBorderStyle} ${style.marginTop20}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>{`Timesheets label ${i+1} for processing`}</div>
                    <InputGroup className={style.fullWidth} value={timeSheetLabelData?.[i]?.label} onChange={(e) => handleTimesheetValue(i, 'label', e.target.value)} />
                </div>
                {timeSheetCount > 1 && (
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Site Specific Contract*</div>
                        <div>
                            <select
                                name="class"
                                id="Class"
                                onChange={(e) => {handleContractedActivityTagsAdd(e.target.value, i)}}
                                className={`${style.fullWidth} `}>
                                <option value="0" >
                                    Select Contracted Services Provided
                                </option>
                                {contractedServices?.map((data, index) => (
                                    <option value={data?.performingActivity?.activity} key={index}
                                    disabled={contractedActivityTags?.map(data => data?.activity)?.includes(data?.performingActivity?.activity)} >
                                        {`${data?.activityType?.activityType} - ${data?.performingActivity?.activity}`}
                                    </option>
                                ))}
                            </select>
                            <TagInput
                                placeholder="Contracted Activity to include for timesheet 1*"
                                values={contractedActivityTags?.filter((data,index)=>data?.index === i)?.map(data=>`${data?.type}-${data?.activity}`) || []}
                                onRemove={handleContractedActivityTagsRemove}
                                separator={/[\s,]/}
                                addOnBlur={true}
                                addOnPaste={true}
                                tagProps={getTagProps}
                                className={style.marginTop20}
                            />
                        </div>
                    </div>
                )}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Service log Period for timesheet submission*</div>
                    <div className={style.displayInRow}>
                        <select
                            name="class"
                            id="Class"
                            value={timeSheetLabelData?.[i]?.value}
                            onChange={(e) => handleTimesheetValue(i, 'value', e.target.value)}
                            className={`${style.fullWidth}`}>
                            <option value="0" >
                                Select Service Log Period...
                            </option>
                            <option value="ENDOFMONTH" >
                                End of the month
                            </option>
                            <option value="ENDOFEVERYWEEK" >
                                End of Every Week
                            </option>
                            <option value="EVERY2WEEKS" >
                                Every 2 Weeks
                            </option>
                            <option value="EVERY4WEEKS" >
                                Every 4 Weeks
                            </option>
                            <option value="ONDAYOFSERVICE" >
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
      }

    const getTimeSheetSubmissionTerms = async() => {
        const {data: timesheetSubmissionTerms} = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
        if(timesheetSubmissionTerms){
          setTimesheetSubmissionTerms(timesheetSubmissionTerms);
          let labelTemp = [];
          let temp = [];
          timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map((data,index)=>{
            labelTemp.push({label:data?.timesheetLabel?.label, value:data?.servicePeriod?.value});
            data?.activities?.map(activityData=>{
              temp.push({index:index,type:activityData?.activityType?.activityType,activity:activityData?.performingActivity?.activity});
            })
          });
          setTimeSheetLabelData(labelTemp);
          setContractedActivityTags(temp);
        }
    };

    console.log(timesheetValues)

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
    }


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
                                <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20} ${style.marginTop15}`}  placeholder="HH" type='number'
                                value={contractedTimeCommitmentHour} onChange={(e) => setContractedTimeCommitmentHour(e.target.value.slice(0, limit))} />
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
                        {timeSheetCount > 1 && (
                            <div className={style.displayInRow}>
                                <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} ${style.marginTop10}`}>
                                    <EditableText  placeholder="HH" type='number' className={style.editableTextSpecifiedStyle}
                                    value={contractedTimeCommitmentHour} onChange={(e) => setContractedTimeCommitmentHour(e.slice(0, limit))} />
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
                        <EditableText value={plannedAbsence}  placeholder="0" type='number' onChange={(e) => setPlannedAbsence(e.slice(0, limit))} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Maximum Unplanned Absence Days Allowed *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={maxUnplannedAbsence}  placeholder="0" type='number' onChange={(e) => setMaxUnplannedAbsence(e.slice(0, limit))} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Invoice Processing Day Range Goal*</div>
                    <div className={style.displayInRow}>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                            <EditableText value={invoiceProcessingDay}  placeholder="0" type='number' onChange={(e) => setInvoiceProcessingDay(e.slice(0, limit))} className={style.editableTextStyleDays} />
                            <div className={style.textElementWithoutBackgroundDays}>Days</div>
                        </div>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder}  ${style.marginLeft20} `}>
                            <div className={style.textElementWithNurse}>Threshold</div>
                            <EditableText value={invoiceProcessingDayThreshold}  placeholder="0" type='number' onChange={(e) => setInvoiceProcessingDayThreshold(e.slice(0, limit))} className={style.editableTextThresholdStyle} />
                        </div>
                        <div className={`${style.displayInRow} ${style.editableTextOuterBorder}`}>
                            <div className={style.textElementWithNurse}>Goal</div>
                            <EditableText value={invoiceProcessingDayGoal}  placeholder="0" type='number' onChange={(e) => setInvoiceProcessingDayGoal(e.slice(0, limit))} className={style.editableTextThresholdStyle} />
                        </div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on activity service date *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnActivityServiceDate}  placeholder="0" type='number' onChange={(e) => setDayLimitForSubmissionBasedOnActivityServiceDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on contract end date</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnContractEndDate}  placeholder="0" type='number' onChange={(e) => setDayLimitForSubmissionBasedOnContractEndDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Payment & Compensation')}}>BACK</button>
                <div>
                    <button className={style.newContractOutlinedButton} onClick={() => handleContinue()}>SAVE IN-PROGRESS</button>
                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { handleContinue(); getViewPage8(true); getCurrentPage('Timesheet Processing Workflow') }}>CONTINUE</button>
                </div>
            </div>
        </div>
    )
}

export default TimeSheetSubmissionTerms;
