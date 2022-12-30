import React, { useState, useEffect, useRef } from 'react';
import { InputGroup, TagInput, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import ArrowDown from './../../images/arrowDown.png';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SiteDepartmentField from '../../Components/ReusableSmallComponents/siteDepartmentField';
import Typography from '@mui/material/Typography';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import style from './index.module.scss';

const TimeSheetSubmissionTerms = ({getViewPage7, getCurrentPage, contractId, isMultiSiteEntity, getShowAlert, isEditable}) => {
    const [timeSheetCount, setTimeSheetCount] = useState(0);
    const [showSelectBox, setShowSelectBox] = useState(false);
    const [selectBoxIndex, setSelectBoxIndex] = useState(-1);
    const [contractedTimeCommitment, setContractedTimeCommitment] = useState(false);
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
    const [activityTypes, setActivityTypes] = useState([]);
    const [selectedItems, setSelectedItems] = useState();
    const limit = 3;
    const [timeSheetLabelData,setTimeSheetLabelData] = useState([]);
    const [timesheetValues, setTimesheetValues] = useState([]);
    const [timesheetActivity, setTimesheetActivity] = useState([{
        activityType: '', performingActivity: ''
    }]);
    const [sites, setSites] = useState([]);
    const [selectedSites, setSelectedSites] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState();
    const [paymentSource, setPaymentSource] = useState();

    const menuRef = useRef(null);
    useOptionsHide(menuRef);

    const getContractedServices = async () => {
        const { data: contractedServices } = await GET(`contract-managment-service/contracts/${contractId}/ContractedService`);
        setContractedServices(contractedServices?.contractedServices);
        setActivityTypes(Array.from(new Set(contractedServices?.contractedServices?.map(data=>data?.activityType?.activityType))));
    }

    const getContractSites = async() => {
      const { data: contractData } = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
      setSites(contractData?.contractDetail?.site?.sites);
    }

    useEffect(()=>{
        getContractedServices();
        getTimeSheetSubmissionTerms();
        getTimesheetFields();
        getContractSites();
    },[])

    useEffect(()=>{
        getTimesheetFields();
        setContractedActivityTags([]);
        setTimeSheetLabelData([]);
    },[timeSheetCount])

    useEffect(()=>{
      formatActivities();
      getTimesheetFields();
    },[contractedActivityTags?.length, timeSheetLabelData, contractedServices, showSelectBox, sites])

    useEffect(()=>{
      if(selectedIndex !== undefined){
        let temp = paymentSource;
        temp[selectedIndex] = selectedSites;
        setPaymentSource(temp);
        formatActivities();
      }
    },[selectedSites])

    function useOptionsHide(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setShowSelectBox(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }


    const handleContractedActivityTagsAdd = (type, values, i) => {
      if(values === 'all' && type === 'all'){
        let temp = [];
        contractedServices?.map(data=>{
          temp?.push({index: i, type: data?.activityType?.activityType, activity: data?.performingActivity?.activity});
        });
        setContractedActivityTags(temp);
      }else if(values==='all'){
        let temp = contractedActivityTags?.filter(data=>data?.type !== type)?.map(data=>data);
        contractedServices?.filter(data=>data?.activityType?.activityType === type)?.map(data=>{
          temp?.push({index: i, type: type, activity: data?.performingActivity?.activity});
        });
        setContractedActivityTags(temp);
      }else{
        let temp = contractedActivityTags;
        setSelectedItems(values);
        temp.push({index: i,type: type, activity: values});
        setContractedActivityTags(temp);
      }
    };

    console.log('check check check', contractedActivityTags);

    const handleClick = (index) => {
        setSelectBoxIndex(index);
        setShowSelectBox(!showSelectBox);
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
                    "paymentSource" : {
                      "site":{}
                    },
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
            let value = Array.isArray(paymentSource?.[index]) ? paymentSource?.[index]?.[0] : paymentSource?.[index];
            let site = value !== null ? { "site" : value} : undefined;
            if(timeSheetCount > 1){
                data.activities = temp;
                data.paymentSource = site;
                data.timesheetLabel = timeSheetLabelData?.[index]?.label;
                data.servicePeriod = timeSheetLabelData?.[index]?.value;
            } else {
                data.activities = tempFor1TimeSheet;
                data.paymentSource = site;
                data.timesheetLabel = timeSheetLabelData?.[index]?.label;
                data.servicePeriod = timeSheetLabelData?.[index]?.value;
            }
        })
        setTimesheetValues(timeSheetValueData);
    }

    const handleTimesheetValue = (i, name, value) => {
      let temp = timeSheetLabelData;
      if(name === 'label'){
        temp[i] = {label:value, value:temp[i]?.value}
      }else{
        temp[i] = {label: temp[i]?.label, value:value}
      }
      setTimeSheetLabelData(temp);
      formatActivities();
      getTimesheetFields();
    }

    const handleContractedActivityTagsRemove = (index) => {
      setContractedActivityTags(contractedActivityTags?.filter((data,indexValue)=>index !== indexValue)?.map(data=>data));
    }

    const isGroupChecked = (type) => {
      let originalArrayLength = contractedServices?.filter(service=>service?.activityType?.activityType === type)?.map(data=>data)?.length;
      let selectedArrayLength = contractedActivityTags?.filter(data=>data?.type === type)?.map(data=>data)?.length;
      if(originalArrayLength === selectedArrayLength){
        return true;
      }else{
        return false;
            }
    }

    const onSelectSite = (value) => {
      setSelectedSites(value);

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
                        <div className={style.extentionLableStyle}>{`Contracted Activity to include for timesheet ${i+1}*`}</div>
                        <div>
                        {
                          // <select
                          //     name="class"
                          //     id="Class"
                          //     onChange={(e) => {handleContractedActivityTagsAdd(e.target.value, i)}}
                          //     className={`${style.fullWidth} `}>
                          //     <option value="0" >
                          //         Select Contracted Services Provided
                          //     </option>
                          //     {contractedServices?.map((data, index) => (
                          //         <option value={data?.performingActivity?.activity} key={index}
                          //         disabled={contractedActivityTags?.map(data => data?.activity)?.includes(data?.performingActivity?.activity)} >
                          //             {`${data?.activityType?.activityType} - ${data?.performingActivity?.activity}`}
                          //         </option>
                          //     ))}
                          // </select>
                        }
                            <div className={`${style.selectBoxStyle} ${style.fullWidth} ${style.verticalAlignCenter} ${style.spaceBetween}`}
                             onClick={() => handleClick(i)}>
                                <div></div>
                                <img src={ArrowDown} className={`${style.marginRight} ${style.arrowDownStyle}`} />
                            </div>
                            {(showSelectBox && i === selectBoxIndex) && (
                                <div className={style.selectOptionsBox} ref={menuRef}>
                                    <div className={`${style.selectOptionsMenuStyle}`}>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox disabled={contractedServices?.length  === contractedActivityTags?.length} checked={contractedServices?.length  === contractedActivityTags?.length} onChange={()=>handleContractedActivityTagsAdd('all', 'all', i)}/>}  label={<Typography variant="body2">All Activities</Typography>} />
                                        </FormGroup>
                                    </div>
                                    {activityTypes?.map(data=>(
                                      <>
                                      <div className={`${style.selectOptionsMenuStyle} ${style.selectedOptionstyle}`}>
                                          <FormGroup>
                                              <FormControlLabel control={<Checkbox onChange={()=>handleContractedActivityTagsAdd(data, 'all', i)} disabled={isGroupChecked(data)} checked={isGroupChecked(data)}/>}  label={<Typography variant="body2" color="#7165E3">{data}</Typography>} />
                                          </FormGroup>
                                      </div>
                                      {
                                        contractedServices?.filter(service=>service?.activityType?.activityType === data)?.map(service=>(
                                          <div className={`${style.selectOptionsMenuStyle} ${style.marginLeft30}`}>
                                              <FormGroup>
                                                  <FormControlLabel control={<Checkbox onChange={()=>handleContractedActivityTagsAdd(data, service?.performingActivity?.activity, i)} disabled={contractedActivityTags?.map(data=>data?.activity)?.includes(service?.performingActivity?.activity)} checked={contractedActivityTags?.map(data=>data?.activity)?.includes(service?.performingActivity?.activity)} />}  label={<Typography variant="body2" className={style.disabledView}>{service?.performingActivity?.activity}</Typography>} />
                                              </FormGroup>
                                          </div>
                                        ))
                                      }
                                      </>
                                    ))
                                    }
                                </div>
                            )}
                            {contractedActivityTags?.filter((data, index) => data?.index === i)?.map(data=>data)?.length !== 0 &&
                              <div className={`${style.siteDeptFieldCard} ${style.marginTop10}`}>
                            {
                              contractedActivityTags?.filter((data, index) => data?.index === i)?.map((data, index) => (
                                  <div className={`${style.deptCard} ${style.displayInRow} ${style.verticalAlignCenter} ${style.marginRight5}`}>
                                    <div className={`${style.siteDeptTextStyle} ${style.marginLeft10}`}>{data?.type}-{data?.activity}</div>
                                    <CloseIcon fontSize="20px" className={`${style.siteDeptCrossStyle} ${style.marginLeft10} ${style.cursorPointer}`} onClick={() => handleContractedActivityTagsRemove(index)} />
                                  </div>
                              ))
                            }
                            </div>
                          }
                        </div>
                    </div>
                )}
              <div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Payment Source*</div>
                      <SiteDepartmentField sites={sites} getSelectedSites={onSelectSite} selectedSites={paymentSource?.[i] ? new Array(1).fill(paymentSource?.[i]) : []} isMultiSiteEntity={isMultiSiteEntity} />
                    </div>
                </div>

                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Service log Period for timesheet submission*</div>
                    <FormControl size="small">
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            key={`timesheetlabeldata ${timeSheetLabelData?.[i]?.value}`}
                            value={timeSheetLabelData?.[i]?.value}
                            onChange={(e)=> handleTimesheetValue(i, 'value', e.target.value)}
                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        >
                          <MenuItem value={'ENDOFMONTH'}>End of the month</MenuItem>
                          <MenuItem value={'ENDOFEVERYWEEK'}>End of Every Week</MenuItem>
                          <MenuItem value={'EVERY2WEEKS'}>End of Every Week</MenuItem>
                          <MenuItem value={'EVERY4WEEKS'}>End of Every Week</MenuItem>
                          <MenuItem value={'ONDAYOFSERVICE'}>On Day of Service</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
          )
        }
        setTimesheetFields(temp);
      }

    console.log('data', timeSheetLabelData?.[0]?.value);

    const getTimeSheetSubmissionTerms = async() => {
        const {data: timesheetSubmissionTerms} = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
        if(timesheetSubmissionTerms){
          setTimesheetSubmissionTerms(timesheetSubmissionTerms);
          let labelTemp = [];
          let temp = [];
          let paymentSourceTemp = [];
          timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map((data,index)=>{
            labelTemp.push({label:data?.timesheetLabel?.label, value:data?.servicePeriod?.value});
            data?.activities?.map(activityData=>{
              temp.push({index:index,type:activityData?.activityType?.activityType,activity:activityData?.performingActivity?.activity});
            })
            paymentSourceTemp?.push(data?.paymentSource?.site !== null ? data?.paymentSource?.site : undefined);
          });
          setTimeSheetLabelData(labelTemp);
          setContractedActivityTags(temp);
          setPaymentSource(paymentSourceTemp);
        }
    };

    const handleContinue = async(buttonType) => {
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
      if(buttonType !== 'Continue'){
        getShowAlert(true);
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
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Number of Timesheets to Submit for Services Performed</div>
                    <InputGroup className={style.fourFieldWidth} type="number" min="0" value={timeSheetCount} onChange={(e) => setTimeSheetCount(parseInt(e.target.value))} />
                </div>
                <div>
                    {timesheetFields}
                </div>
                {timeSheetCount <= 1 &&
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Contracted Activity to include for timesheet*</div>
                      <InputGroup placeholder="All Activities" className={style.fullWidth} readOnly />
                  </div>
                }

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on activity service date *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnActivityServiceDate}  placeholder="0" type='number' min="0" onChange={(e) => setDayLimitForSubmissionBasedOnActivityServiceDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Day limit for submission of timesheet based on contract end date *</div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                        <EditableText value={dayLimitForSubmissionBasedOnContractEndDate}  placeholder="0" type='number' min="0" onChange={(e) => setDayLimitForSubmissionBasedOnContractEndDate(e.slice(0, limit))} className={style.editableTextStyleDays} />
                        <div className={style.textElementWithoutBackgroundDays}>Days</div>
                    </div>
                </div>
            </div>
            {isEditable &&
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                  <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Contracted Services Specification')}}>BACK</button>
                  <div>
                      <button className={style.newContractOutlinedButton} onClick={() => handleContinue('Save In Progress')}>SAVE IN-PROGRESS</button>
                      <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { handleContinue('Continue'); getViewPage7(true); getCurrentPage('Payment & Compensation') }}>CONTINUE</button>
                  </div>
              </div>
            }
        </div>
    )
}

export default TimeSheetSubmissionTerms;
