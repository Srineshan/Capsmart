import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
// import CurrencyInput from 'react-currency-input-field';
import CurrencyFormat from 'react-currency-format';
import { GET, PUT } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonRadio from '../../Components/CommonFields/CommonRadio';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import { valueCheck } from "./../../utils/valueCheck";

import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import MissedMandatoryFieldAlert from "./missedMandatoryFieldAlert";

const PaymentAndCompensation = ({ selectContractInfo, getViewPage8, getCurrentPage, contractId, checkFieldAndPopAlert, getShowAlert, isEditable, getTabDataStatus }) => {
    const [compensation, setCompensation] = useState('RVUBASED');
    const [paymentAndCompensation, setPaymentAndCompensation] = useState({});
    const [rvuQuantity, setRvuQuantity] = useState({
        quantity: 0
    })
    const [frequency, setFrequency] = useState('NA')
    const [fteEquivalent, setFteEquivalent] = useState({
        value: parseFloat(0)
    })
    const [rvuReferenceUsed, setRvuReferenceUsed] = useState({
        value: ''
    })
    const [rvuQuantityVariance, setRvuQuantityVariance] = useState({
        value: 0
    })
    const [rvuQuantityPeriod, setRvuQuantityPeriod] = useState({
        days: 0
    })
    const [dollarRate, setDollarRate] = useState({
        hour: parseFloat(0),
        notApplicable: false,
    })
    const [dollarValue, setDollarValue] = useState({
        perTimesheetSubmission: 0,
        perContractedPeriod: 0
    })
    const [compensationOffsetCriteria, setCompensationOffsetCriteria] = useState({
        reducedNumberOfServices: '',
        providingAdditionalServices: ''
    });
    const [compensationPolicy, setCompensationPolicy] = useState('');
    const [timesheetPayments, setTimesheetPayments] = useState([]);
    const [paymentFields, setPaymentFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSheetTabs, setTimeSheetTabs] = useState([]);
    const [continueLoading, setContinueLoading] = useState(false);
    const [contractPeriod, setContractPeriod] = useState({ start: null, end: null });
    const limit3 = 3;
    const limit4 = 4;
    const limit5 = 5;
    const limit7 = 7;
    const limit9 = 9;
    const limit10 = 10;
    const [unassignedKeys, setUnassignedKeys] = useState([]);
    const [showSaveInProgress, setShowSaveInProgress] = useState(false);
    const [buttonName, setButtonName] = useState("");

    const getContractDetail = async () => {
        const { data: contractData } = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
        setContractPeriod({ ...contractPeriod, start: contractData?.contractDetail?.contractTerm?.effectiveDate, end: contractData?.contractDetail?.contractTerm?.endDate })
        setCompensationPolicy(contractData?.contractDetail?.compensationPolicy);
    }

    const mandatoryFieldCheck = (buttonType) => {
        setContinueLoading(true);
        if (buttonType === "SaveInProgress" || buttonType === "Continue") {
            saveInProgresscheck(buttonType);
            setButtonName(buttonType)
        }
    };

    const saveInProgresscheck = (buttonType) => {
        var keys = [];

        if (compensation === "RVUBASED" && valueCheck(rvuQuantity?.quantity)) {
            keys.push("RVU Quantity");
        }
        if (compensation === "RVUBASED" && valueCheck(fteEquivalent?.value)) {
            keys.push("FTE Equivalent");
        }
        if (compensation === "RVUBASED" && valueCheck(rvuReferenceUsed?.value)) {
            keys.push("RVU Reference Used");
        }
        if (compensation === "RVUBASED" && valueCheck(rvuQuantityVariance?.value)) {
            keys.push("RVU Quantity Variance (+/-)");
        }
        if (compensation === "RVUBASED" && valueCheck(rvuQuantityPeriod?.days)) {
            keys.push("RVU Quantity Period");
        }
        if (!dollarRate?.notApplicable && valueCheck(dollarRate?.hour)) {
            keys.push("Dollar Hourly Rate");
        }

        timesheetPayments?.forEach((value, index) => {
            if (valueCheck(value?.maxPaymentPerContract)) {
                keys.push(`Max. Compensation Value For Contract Period ${index + 1}`);
            }
        });

        setUnassignedKeys(keys);
        if (keys?.length !== 0) {
            setShowSaveInProgress(true);
            setContinueLoading(true)
        } else {
            handleContinue(buttonType);
        }
    };

    const saveInProgressFunction = (type) => {
        handleContinue(type);
        setShowSaveInProgress(false)
    };

    const getSaveInProgressAlert = (value) => {
        setShowSaveInProgress(value);
        setContinueLoading(value)
    };

    const handleContinue = async (buttonType) => {
        setContinueLoading(true);
        const data = {
            compensationBasis: compensation,
            rvuQuantity: rvuQuantity,
            frequency: frequency,
            fteEquivalent: fteEquivalent,
            rvuReferenceUsed: rvuReferenceUsed,
            rvuQuantityVariance: rvuQuantityVariance,
            rvuQuantityPeriod: rvuQuantityPeriod,
            compensationOffsetCriteria: compensationOffsetCriteria,
            dollarRate: dollarRate,
            dollarValue: dollarValue,
            timesheetPayments: timesheetPayments,
        }
        const response = await PUT(`contract-managment-service/contracts/${contractId}/paymentAndCompensation`, JSON.stringify(data));
        if (response) {
            SuccessToaster('Payment And Compensation Updated Successfully');
        }
        else {
            ErrorToaster('Unexpected Error');
        }
        setContinueLoading(false);
        if (buttonType !== 'Continue') {
            getShowAlert(true);
        } else {
            getViewPage8(true);
            getCurrentPage('Timesheet Processing Workflow')
        }
        getTabDataStatus();

    }

    const getPaymentAndCompensation = async () => {
        const { data: paymentAndCompensation } = await GET(`contract-managment-service/contracts/${contractId}/paymentAndCompensation`);
        setPaymentAndCompensation(paymentAndCompensation);
    };

    useEffect(() => {
        setCompensation(paymentAndCompensation?.compensationBasis || 'RVUBASED');
        setRvuQuantity(paymentAndCompensation?.rvuQuantity);
        setFrequency(paymentAndCompensation?.frequency || 'NA');
        setFteEquivalent(paymentAndCompensation?.fteEquivalent);
        setRvuReferenceUsed(paymentAndCompensation?.rvuReferenceUsed);
        setRvuQuantityPeriod(paymentAndCompensation?.rvuQuantityPeriod);
        setRvuQuantityVariance(paymentAndCompensation?.rvuQuantityVariance);
        setDollarRate({ ...dollarRate, hour: paymentAndCompensation?.dollarRate?.hour, notApplicable: paymentAndCompensation?.dollarRate?.notApplicable });
        setDollarValue(paymentAndCompensation?.dollarValue);
        setCompensationOffsetCriteria(paymentAndCompensation?.compensationOffsetCriteria);
        setTimesheetPayments(paymentAndCompensation?.timesheetPayments || []);
    }, [paymentAndCompensation])

    useEffect(() => {
        if (timeSheetTabs?.length > 0) {
            setTimesheetPaymentsValue()
        }
    }, [compensationPolicy, timeSheetTabs])

    const monthDiff = (date1, date2) => {
        let months;
        months = (date2.getFullYear() - date1.getFullYear()) * 12;
        months -= date1.getMonth();
        months += date2.getMonth();
        return months <= 0 ? 0 : months + 1;
    }


    const setTimesheetPaymentsValue = () => {
        // if (timeSheetTabs?.length !== timesheetPayments?.length) {
        let temp = [];
        timeSheetTabs?.map((data, index) => {
            let reducedNumberOfServices = (compensationPolicy === 'ACTIVITY_BASED' || compensationPolicy === 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET') ? 'NA' : timesheetPayments?.[index]?.reducedNumberOfServices || 'NA';
            let maxPaymentPerTimesheetSubmission = compensationPolicy === 'ACTIVITY_BASED' ? parseFloat(0) : timesheetPayments?.[index]?.maxPaymentPerTimesheetSubmission || parseFloat(0);
            let providingAdditionalServices = (compensationPolicy === 'ACTIVITY_BASED' || compensationPolicy === 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET') ? 'NA' : timesheetPayments?.[index]?.providingAdditionalServices || 'NA';
            temp.push({
                timesheetLabel: {
                    label: timeSheetTabs?.[index]?.timesheetLabel?.label
                },
                paymentFrequency: data?.servicePeriod?.value,
                maxPaymentPerTimesheetSubmission: parseFloat(maxPaymentPerTimesheetSubmission),
                maxPaymentPerContract: parseFloat(timesheetPayments?.[index]?.maxPaymentPerContract) || parseFloat(0),
                reducedNumberOfServices: reducedNumberOfServices,
                providingAdditionalServices: providingAdditionalServices,
                paymentBasedonFixedHoursVsActual: timesheetPayments?.[index]?.paymentBasedonFixedHoursVsActual || true
            });
        });
        setTimesheetPayments(temp);
        // getPaymentFields();
        // }
    }

    useEffect(() => {
        getPaymentFields();
    }, [timesheetPayments]);

    useEffect(() => {
        getPaymentAndCompensation();
        getTimeSheetValues();
        getContractDetail();
    }, [])

    useEffect(() => {
        getTimeSheetValues();
    }, [contractId])

    const updateTimesheetPayment = (value, name, index) => {
        console.log(value, name, index)
        let temp = timesheetPayments;
        temp?.filter((data, indexVal) => index === indexVal)?.map(data => {
            if (name === 'maxPaymentPerContract') {
                data[name] = parseFloat(value);
            }
            else {
                data[name] = value;
            }
            if (name === 'paymentBasedonFixedHoursVsActual' && !value) {
                data['maxPaymentPerTimesheetSubmission'] = parseFloat(0);
                data['maxPaymentPerContract'] = parseFloat(0);
            }
        });
        setTimesheetPayments(temp);
        getPaymentFields();
    }

    const fixedCompensationValue = (value, name, index) => {
        let temp = timesheetPayments;
        temp?.filter((data, indexVal) => index === indexVal)?.map(data => {
            data[name] = parseFloat(value);
            // if (name === 'paymentBasedonFixedHoursVsActual' && !value) {
            //     data['maxPaymentPerTimesheetSubmission'] = parseFloat(0);
            //     data['maxPaymentPerContract'] = parseFloat(0);
            // }
        });
        setTimesheetPayments(temp);
        getPaymentFields();
    }
    const dataCheck = (value) => {
        if (paymentAndCompensation) {
            return valueCheck(value);
        } else {
            return false;
        }
    };

    const getPaymentFields = () => {
        let temp = [];
        for (let i = 0; i < timesheetPayments?.length; i++) {
            temp[i] = (
                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                    <div className={`${style.extentionGrid}`}>
                        <CommonLabel value='Timesheet Name*' />
                        <CommonInputField className={style.fullWidth} value={timeSheetTabs?.[i]?.timesheetLabel?.label || ''} readOnly={true} />
                    </div>
                    {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
  };
  
  const getPaymentFields = () => {
    let temp = [];
    for (let i = 0; i < timesheetPayments?.length; i++) {
      temp[i] = (
        <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
          <div className={`${style.extentionGrid}`}>
            <CommonLabel value="Timesheet Name*" 
              className={dataCheck(timeSheetTabs?.[i]?.timesheetLabel?.label) ? style.redLable : ""}
            />
            <CommonInputField
              className={style.fullWidth}
              value={timeSheetTabs?.[i]?.timesheetLabel?.label || ""}
              readOnly={true}
            />
          </div>
          {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Payment Processing Criteria*' /> */}
                    {/* <FormControl size="small">
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                value={timesheetPayments?.[i]?.paymentFrequency || ''}
                            // value={timesheetPayments?.[i]?.paymentFrequency}
                            // onChange={(e) => updateTimesheetPayment(e.target.value, 'paymentFrequency', i)}
                            >
                                <MenuItem value={'ENDOFMONTH'}>End of the month</MenuItem>
                                <MenuItem value={'ENDOFEVERYWEEK'}>End of Every Week</MenuItem>
                                <MenuItem value={'EVERY2WEEKS'}>Every 2 Weeks</MenuItem>
                                <MenuItem value={'EVERY4WEEKS'}>Every 4 Weeks</MenuItem>
                                <MenuItem value={'ONDAYOFSERVICE'}>On Day of Service</MenuItem>
                                <MenuItem value={''}>Select Payment Frequency</MenuItem>
                                <MenuItem value={'WEEK'}>Per Week</MenuItem>
                                <MenuItem value={'MONTH'}>Per Month</MenuItem>
                                <MenuItem value={'YEAR'}>Per Year</MenuItem> 
                            </Select>
                        </FormControl> */}
                    {/* <CommonSelectField
                            value={timesheetPayments?.[i]?.paymentFrequency || ''}
                            // onChange={(e) => updateTimesheetPayment(e.target.value, 'paymentFrequency', i)}
                            firstOptionLabel={''} firstOptionValue={''}
                            valueList={['ENDOFMONTH', 'ENDOFEVERYWEEK', 'EVERY2WEEKS', 'EVERY4WEEKS', 'ONDAYOFSERVICE']}
                            labelList={['End of the month', 'End of Every Week', 'Every 2 Weeks', 'Every 4 Weeks', 'On Day of Service']}
                            disabledList={[false, false, false, false, false]} />
                    </div> */}
                    {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Payment Based On Fixed Hours Vs Actual *' />
                        <div className={`${style.displayInRow}  ${style.verticalAlignCenter}`}>
                            <CommonSwitch label={timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.textAlignLeft}`} checked={timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual} onChange={(e) => updateTimesheetPayment(e.target.checked, 'paymentBasedonFixedHoursVsActual', i)} />
                            {
                                //   timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual &&
                                //   <div className={`${style.twoFieldWidth} ${style.marginLeft20}`}>
                                //     <div className={style.helperTextPayment}>Max. Compensation Value Per Timesheet Submission*</div>
                                //     <TextField
                                //         type="number"
                                //         min="0"
                                //         size="small"
                                //         InputProps={{
                                //             startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                //         }}
                                //         onChange={(e)=>updateTimesheetPayment(parseFloat(e.target.value), 'maxPaymentPerTimesheetSubmission', i)}
                                //         value={timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission}
                                //         inputProps={{
                                //             style: {
                                //                 height: 15,
                                //             },
                                //         }}
                                //     />
                                // </div>
                            }
                        </div>
                    </div> */}
                    {timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual &&
                        <>
                            {compensationPolicy !== 'ACTIVITY_BASED' && (
                                <>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <CommonLabel value='Fixed Compensation Value Per Timesheet Submission*' />
                                        <CommonTextField
                                            className={style.twoFieldWidth}
                                            // type="number"
                                            min="0"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                            }}
                                            onChange={(e) => fixedCompensationValue(e.target.value.slice(0, limit9).replace(/,/g, ""), 'maxPaymentPerTimesheetSubmission', i)}
                                            value={Number(timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission || 0)?.toLocaleString()}
                                        />
                                        {/* <div>
                                            <CurrencyFormat thousandSeparator={true} prefix={'$'} value={timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission || 0} maxLength={13}
                                                decimalScale={2} fixedDecimalScale={true} className={`${style.currencyFormatInput} ${style.twoFieldWidth}`} inputmode="numeric" onValueChange={(values) => fixedCompensationValue(values?.floatValue, 'maxPaymentPerTimesheetSubmission', i)} />
                                        </div> */}
                                    </div>
                                    {compensationPolicy !== 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET' &&
                                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                            <CommonLabel value='Compensation Offset Criteria For Reduced Number Of Agreed To Services*' />
                                            <CommonSelectField
                                                value={timesheetPayments?.[i]?.reducedNumberOfServices}
                                                onChange={(e) => updateTimesheetPayment(e.target.value, 'reducedNumberOfServices', i)}
                                                firstOptionLabel={''} firstOptionValue={''}
                                                valueList={['TIMESHEET', 'CONTRACT_END']}
                                                labelList={['Per Timesheet Period', 'On Last Invoice For Contract Year']}
                                                disabledList={[false, false]} />
                                        </div>}
                                </>)}
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <CommonLabel value='Max. Compensation Value for Contract Period*'
                                    className={dataCheck(timesheetPayments?.[i]?.maxPaymentPerContract)
                                        ? style.redLable
                                        : ""} />
                                <div className={style.displayInRow}>
                                    <CommonTextField
                                        className={style.twoFieldWidth}
                                        // type="number"
                                        min="0"
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                        }}
                                        onChange={(e) => updateTimesheetPayment(e.target.value.slice(0, limit10).replace(/,/g, ""), 'maxPaymentPerContract', i)}
                                        value={(timesheetPayments?.[i]?.maxPaymentPerContract || 0)?.toLocaleString()}
                                    // onChange={(e) => updateTimesheetPayment(e.target.value.slice(0, limit9).replace(/,/g, ""), 'maxPaymentPerContract', i)}
                                    // value={Number(timesheetPayments?.[i]?.maxPaymentPerContract)?.toLocaleString()}

                                    />
                                    {/* <CurrencyInput
                                        key={i}
                                        name="input-name"
                                        placeholder="Please enter a number"
                                        defaultValue={timesheetPayments?.[i]?.maxPaymentPerContract || 0}
                                        value={timesheetPayments?.[i]?.maxPaymentPerContract || 0}
                                        decimalsLimit={2}
                                        prefix="$"
                                        maxLength={12}
                                        onValueChange={(value, name, values) => { updateTimesheetPayment(value, 'maxPaymentPerContract', i); console.log(value, name, values) }}
                                    /> */}
                                    {/* <div>
                                        <CurrencyFormat thousandSeparator={true} prefix={'$'} value={timesheetPayments?.[i]?.maxPaymentPerContract || 0} maxLength={13}
                                            decimalScale={2} fixedDecimalScale={true} className={`${style.currencyFormatInput} ${style.twoFieldWidth}`} inputmode="numeric" onValueChange={(values) => updateTimesheetPayment(values?.floatValue, 'maxPaymentPerContract', i)} />
                                    </div> */}
                                    <CommonLabel className={`${style.marginLeft20} ${style.twoFieldWidth}`} value={`$ ${(timesheetPayments?.[i]?.maxPaymentPerContract / ((monthDiff(new Date(contractPeriod?.start), new Date(contractPeriod?.end))) / 12) || 0)?.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} Per Contract Year`} />
                                </div>
                            </div>
                            {compensationPolicy !== 'ACTIVITY_BASED' && compensationPolicy !== 'FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET' && (
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <CommonLabel value='Compensation Offset Criteria For Providing Additional Services To The Agreed To Services*' />
                                    <CommonSelectField
                                        value={timesheetPayments?.[i]?.providingAdditionalServices}
                                        onChange={(e) => updateTimesheetPayment(e.target.value, 'providingAdditionalServices', i)}
                                        firstOptionLabel={''} firstOptionValue={''}
                                        valueList={['TIMESHEET', 'CONTRACT_END']}
                                        labelList={['Per Timesheet Period', 'On Last Invoice For Contract Year']}
                                        disabledList={[false, false]} />
                                </div>
                            )}

                            {
                                ////// Do NOT REMOVE TO BE REMOVED AFTER CONFIRMATION //////
                                //     <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                //     <div className={style.extentionLableStyle}>Compensation Offset Criteria For Over/ Under Payment *</div>
                                //     <FormControl size="small">
                                //         <Select
                                //             labelId="demo-select-small"
                                //             id="demo-select-small"
                                //             value={timesheetPayments?.[i]?.overUnderPayment}
                                //             onChange={(e)=> updateTimesheetPayment(e.target.value, 'overUnderPayment', i)}
                                //             SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                //         >
                                //             <MenuItem value={'TIMESHEET'}>Per Timesheet</MenuItem>
                                //             <MenuItem value={'CONTRACT_END'}>Contract Year End</MenuItem>
                                //         </Select>
                                //     </FormControl>
                                // </div>

                            }


                        </>
                    }

                </div>
            )
        }
        setPaymentFields(temp);
    }

    const getTimeSheetValues = async () => {
        setIsLoading(true);
        const { data: timesheetSubmissionTerms } = await GET(`contract-managment-service/contracts/${contractId}/timesheetSubmissionTerms`);
        setTimeSheetTabs(timesheetSubmissionTerms?.timesheetActivitiesPeriods?.map(data => data) || []);
        setIsLoading(false);
    }

    const leftElement = () => {
        return (
            <button className={`${style.dollarLeftElement}`} >$</button>
        )
    }

    const onCompensationUpdate = (value) => {
        setCompensation(value);
        if (value !== 'RVUBASED') {
            setRvuQuantity(null);
            setFteEquivalent(null);
            setRvuReferenceUsed(null);
            setRvuQuantityPeriod(null);
            setRvuQuantityVariance(null);
        }
    }

    if (isLoading) {
        return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
    }

    return (
        <>
            {
                timeSheetTabs?.length !== 0 ?
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}>
                            <div className={`${style.extentionGrid} ${selectContractInfo === "Individual Contractor" && style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(compensation, 'Compensation Basis') }}>
                                <CommonLabel value='Compensation Basis*' />
                                {/* <div>
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.leftAlign}`}
                            selectedValue={compensation}
                            onChange={(e) => setCompensation(e.target.value)}
                        >
                            <Radio label="RVU Based" value="RVUBASED" />
                            <Radio label="Dollar Based Rate" value="DOLLARBASEDRATE" />
                        </RadioGroup>
                    </div> */}
                                <CommonRadio
                                    className={`${style.leftAlign}`}
                                    value={compensation ? compensation : 'RVUBASED'}
                                    onChange={(e) => onCompensationUpdate(e.target.value)}
                                    radioValue={['RVUBASED', 'DOLLARBASEDRATE']}
                                    label={['RVU Based', 'Dollar Based Rate']}
                                />
                            </div>
                            {compensation === "RVUBASED" && (
                                <div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuQuantity?.quantity, 'RVU Quantity') }}>
                                        <CommonLabel value='RVU Quantity*' className={dataCheck(rvuQuantity?.quantity) ? style.redLable : ""} />
                                        <div className={style.displayInRow}>
                                            <CommonInputField className={style.fourFieldWidth} value={rvuQuantity?.quantity} placeholder="0"
                                                type='number'
                                                min="0"
                                                onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                                    ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                                })} />
                                            <CommonSelectField
                                                className={`${style.twoFieldWidth} ${style.marginLeft} ${style.reduceTop}`}
                                                defaultValue={frequency}
                                                value={frequency}
                                                onChange={(e) => setFrequency(e.target.value)}
                                                firstOptionLabel={''} firstOptionValue={''}
                                                valueList={['WEEK', 'MONTH', 'YEAR']}
                                                labelList={['Per Week', 'Per Month', 'Per Contract Year']}
                                                disabledList={[false, false, false]} />
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(fteEquivalent?.value, 'FTE Equivalent') }} >
                                        <CommonLabel value='FTE Equivalent' className={dataCheck(fteEquivalent?.value) ? style.redLable : ""} />
                                        <CommonInputField className={style.twoFieldWidth} value={fteEquivalent?.value} placeholder="0" type="number"
                                            min="0"
                                            onChange={(e) => setFteEquivalent({
                                                ...fteEquivalent, value: parseFloat(e.target.value.slice(0, limit4))
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuReferenceUsed?.value, 'RVU Reference Used') }}>
                                        <CommonLabel value='RVU Reference Used' className={dataCheck(rvuReferenceUsed?.value) ? style.redLable : ""} />
                                        <CommonInputField className={style.fullWidth} value={rvuReferenceUsed?.value} placeholder="Enter RVU Reference Used"
                                            min="0"
                                            onChange={(e) => setRvuReferenceUsed({
                                                ...rvuReferenceUsed, value: e.target.value
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuQuantityVariance?.value, 'RVU Quantity Variance (+/-)') }}>
                                        <CommonLabel value='RVU Quantity Variance (+/-)' className={dataCheck(rvuQuantityVariance?.value) ? style.redLable : ""} />
                                        <CommonInputField className={style.twoFieldWidth} value={rvuQuantityVariance?.value} placeholder="0" type='number'
                                            min="0" onChange={(e) => setRvuQuantityVariance({
                                                ...rvuQuantityVariance, value: e.target.value.slice(0, limit3)
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <CommonLabel value='RVU Quantity Period' className={dataCheck(rvuQuantityPeriod?.days) ? style.redLable : ""} />
                                        <CommonTextField
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                                            }}
                                            onChange={(e) => setRvuQuantityPeriod({
                                                ...rvuQuantityPeriod, days: e.target.value.slice(0, limit4)
                                            })}
                                            className={style.renewalWidth}
                                            value={rvuQuantityPeriod?.days}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <CommonLabel value='Dollar Hourly Rate*' className={!dollarRate?.notApplicable && dataCheck(dollarRate?.hour) ? style.redLable : ""} />
                                <div className={style.twoCol}>
                                    <CommonTextField
                                        // type="text"
                                        // min="0"
                                        // onBlur={(e) => setDollarRate({
                                        //     ...dollarRate, hour: parseFloat(e.target.value.slice(0, limit7))?.toLocaleString('en-gb'), notApplicable: false
                                        // })}
                                        disabled={dollarRate?.notApplicable}
                                        value={dollarRate?.hour?.toLocaleString() ?? null}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                        }}
                                        onChange={(e) => setDollarRate({
                                            ...dollarRate, hour: (e.target.value.slice(0, limit9)), notApplicable: false
                                        })}
                                    />
                                    <CommonCheckBox value="NA" checked={dollarRate?.notApplicable} onChange={(e) => setDollarRate({ ...dollarRate, notApplicable: e.target.checked, hour: '0' })} label="NA" />
                                </div>
                            </div>

                            <div className={`${style.paymentTimesheetDetailsHeading} ${style.marginTop20}`}>
                                INDIVIDUAL TIMESHEET DETAILS
                            </div>
                            {paymentFields}
                        </div>
                        {isEditable &&
                            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                                <button className={`${style.newContractButtonStyle}  ${style.cursorPointer}`} onClick={() => { getCurrentPage('Timesheet Submission Terms') }}>BACK</button>
                                <div>
                                    <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                                        onClick={!continueLoading ? () => mandatoryFieldCheck('SaveInProgress') : {}}
                                    >SAVE IN PROGRESS</button>
                                    <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                                        onClick={!continueLoading ? () => { mandatoryFieldCheck('Continue') } : {}}
                                    >CONTINUE</button>
                                </div>
                            </div>
                        }

                        <MissedMandatoryFieldAlert
                            alert={showSaveInProgress}
                            getSaveInProgressAlert={getSaveInProgressAlert}
                            fieldData={unassignedKeys}
                            saveInProgressFunction={saveInProgressFunction}
                            setContinueLoading={setContinueLoading}
                            buttonName={buttonName}
                        />
                    </div> :
                    <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Timesheet Submission Terms'} title={'NO TIMESHEET FOUND'} description={'No Timesheet Is Found.'} buttonText={'ADD TIMESHEET'} />
            }
        </>
    )
}

export default PaymentAndCompensation;

