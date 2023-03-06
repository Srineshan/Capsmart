import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
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

import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const PaymentAndCompensation = ({ selectContractInfo, getViewPage8, getCurrentPage, contractId, checkFieldAndPopAlert, getShowAlert, isEditable, getTabDataStatus }) => {
    const [compensation, setCompensation] = useState('RVUBASED');
    const [paymentAndCompensation, setPaymentAndCompensation] = useState({});
    const [rvuQuantity, setRvuQuantity] = useState({
        quantity: 0
    })
    const [frequency, setFrequency] = useState('')
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
    const [timesheetPayments, setTimesheetPayments] = useState([]);
    const [paymentFields, setPaymentFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [timeSheetTabs, setTimeSheetTabs] = useState([]);
    const [continueLoading, setContinueLoading] = useState(false);
    const limit3 = 3;
    const limit4 = 4;
    const limit5 = 5;
    const limit7 = 7;

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
        setFrequency(paymentAndCompensation?.frequency);
        setFteEquivalent(paymentAndCompensation?.fteEquivalent);
        setRvuReferenceUsed(paymentAndCompensation?.rvuReferenceUsed);
        setRvuQuantityPeriod(paymentAndCompensation?.rvuQuantityPeriod);
        setRvuQuantityVariance(paymentAndCompensation?.rvuQuantityVariance);
        setDollarRate({ ...dollarRate, hour: paymentAndCompensation?.dollarRate?.hour, notApplicable: paymentAndCompensation?.dollarRate?.notApplicable });
        setDollarValue(paymentAndCompensation?.dollarValue);
        setCompensationOffsetCriteria(paymentAndCompensation?.compensationOffsetCriteria);
        setTimesheetPayments(paymentAndCompensation?.timesheetPayments || []);
        if (paymentAndCompensation?.timesheetPayments?.length !== 0) {
            setTimesheetPaymentsValue()
        }
    }, [paymentAndCompensation])

    useEffect(() => {
        setTimesheetPaymentsValue()
    }, [timeSheetTabs?.length, timesheetPayments?.length])

    const setTimesheetPaymentsValue = () => {
        if (timeSheetTabs?.length && timesheetPayments?.length === 0) {
            console.log('init', timesheetPayments)
            let temp = [];
            timeSheetTabs?.map(data => {
                temp.push({
                    timesheetLabel: {
                        label: data?.timesheetLabel?.label
                    },
                    paymentFrequency: data?.servicePeriod?.value,
                    maxPaymentPerTimesheetSubmission: parseFloat(0),
                    maxPaymentPerContract: parseFloat(0),
                    reducedNumberOfServices: "",
                    providingAdditionalServices: "",
                    paymentBasedonFixedHoursVsActual: true
                });
            });
            setTimesheetPayments(temp);
            getPaymentFields();
        }
    }

    useEffect(() => {
        getPaymentAndCompensation();
        setTimesheetPaymentsValue();
        getTimeSheetValues();
    }, [])

    useEffect(() => {
        getTimeSheetValues();
    }, [contractId])

    useEffect(() => {
        getPaymentFields();
    }, [timesheetPayments?.length, timesheetPayments])

    const updateTimesheetPayment = (value, name, index) => {
        let temp = timesheetPayments;
        temp?.filter((data, indexVal) => index === indexVal)?.map(data => {
            data[name] = value;
            if (name === 'paymentBasedonFixedHoursVsActual' && !value) {
                data['maxPaymentPerTimesheetSubmission'] = parseFloat(0);
                data['maxPaymentPerContract'] = parseFloat(0);
            }
        });
        setTimesheetPayments(temp);
        getPaymentFields();
    }

    console.log('timesheet', timesheetPayments);

    const getPaymentFields = () => {
        let temp = [];
        for (let i = 0; i < timesheetPayments?.length; i++) {
            temp[i] = (
                <div className={`${style.contractedBorderStyle} ${style.marginTop20}`}>
                    <div className={`${style.extentionGrid}`}>
                        <CommonLabel value='Timesheet Name*' />
                        <CommonInputField className={style.fullWidth} value={timesheetPayments?.[i]?.timesheetLabel?.label || ''} readOnly={true} />
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
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
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
                    </div>
                    {timesheetPayments?.[i]?.paymentBasedonFixedHoursVsActual &&
                        <>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <CommonLabel value='Max. Compensation Value Per Timesheet Submission*' />
                                <CommonTextField
                                    className={style.twoFieldWidth}
                                    type="number"
                                    min="0"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => updateTimesheetPayment(parseFloat(e.target.value), 'maxPaymentPerTimesheetSubmission', i)}
                                    value={timesheetPayments?.[i]?.maxPaymentPerTimesheetSubmission}
                                />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <CommonLabel value='Compensation Offset Criteria For Reduced Number Of Agreed To Services*' />
                                <CommonSelectField
                                    value={timesheetPayments?.[i]?.reducedNumberOfServices}
                                    onChange={(e) => updateTimesheetPayment(e.target.value, 'reducedNumberOfServices', i)}
                                    firstOptionLabel={''} firstOptionValue={''}
                                    valueList={['TIMESHEET', 'CONTRACT_END']}
                                    labelList={['Per Timesheet Period', 'On Last Invoice For Contract Year']}
                                    disabledList={[false, false]} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <CommonLabel value='Max. Compensation Value for Contract Period*' />
                                <CommonTextField
                                    className={style.twoFieldWidth}
                                    type="number"
                                    min="0"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => updateTimesheetPayment(parseFloat(e.target.value), 'maxPaymentPerContract', i)}
                                    value={timesheetPayments?.[i]?.maxPaymentPerContract}
                                />
                            </div>

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
                                        <CommonLabel value='RVU Quantity*' />
                                        <div className={style.displayInRow}>
                                            <CommonInputField className={style.fourFieldWidth} value={rvuQuantity?.quantity} placeholder="0"
                                                type='number'
                                                min="0"
                                                onChange={(e) => e.target.value >= 0 && setRvuQuantity({
                                                    ...rvuQuantity, quantity: e.target.value.slice(0, limit5)
                                                })} />
                                            <CommonSelectField className={`${style.twoFieldWidth} ${style.marginLeft} ${style.reduceTop}`}
                                                value={frequency}
                                                onChange={(e) => setFrequency(e.target.value)}
                                                firstOptionLabel={''} firstOptionValue={''}
                                                valueList={['WEEK', 'MONTH', 'YEAR']}
                                                labelList={['Per Week', 'Per Month', 'Per Contract Year']}
                                                disabledList={[false, false, false]} />
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(fteEquivalent?.value, 'FTE Equivalent') }} >
                                        <CommonLabel value='FTE Equivalent' />
                                        <CommonInputField className={style.twoFieldWidth} value={fteEquivalent?.value} placeholder="0" type="number"
                                            min="0"
                                            onChange={(e) => setFteEquivalent({
                                                ...fteEquivalent, value: parseFloat(e.target.value.slice(0, limit4))
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuReferenceUsed?.value, 'RVU Reference Used') }}>
                                        <CommonLabel value='RVU Reference Used' />
                                        <CommonInputField className={style.fullWidth} value={rvuReferenceUsed?.value} placeholder="Enter RVU Reference Used"
                                            min="0"
                                            onChange={(e) => setRvuReferenceUsed({
                                                ...rvuReferenceUsed, value: e.target.value
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`} onFocus={() => { checkFieldAndPopAlert(rvuQuantityVariance?.value, 'RVU Quantity Variance (+/-)') }}>
                                        <CommonLabel value='RVU Quantity Variance (+/-)' />
                                        <CommonInputField className={style.twoFieldWidth} value={rvuQuantityVariance?.value} placeholder="0" type='number'
                                            min="0" onChange={(e) => setRvuQuantityVariance({
                                                ...rvuQuantityVariance, value: e.target.value.slice(0, limit3)
                                            })} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <CommonLabel value='RVU Quantity Period' />
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
                                <CommonLabel value='Dollar Hourly Rate*' />
                                <div className={style.twoCol}>
                                    <CommonTextField
                                        type="number"
                                        min="0"
                                        disabled={dollarRate?.notApplicable}
                                        value={dollarRate?.hour}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                        }}
                                        onChange={(e) => setDollarRate({
                                            ...dollarRate, hour: parseFloat(e.target.value.slice(0, limit7)), notApplicable: false
                                        })}
                                    />
                                    <CommonCheckBox value="NA" checked={dollarRate?.notApplicable} onChange={(e) => setDollarRate({ ...dollarRate, notApplicable: e.target.checked, hour: parseFloat(0) })} label="NA" />
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
                                    <button className={`${style.newContractOutlinedButton}  ${style.cursorPointer} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => handleContinue('Save In Progress') : {}}>SAVE IN-PROGRESS</button>
                                    <button className={`${style.newContractButtonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                                        onClick={!continueLoading ? () => { handleContinue('Continue'); getViewPage8(true); getCurrentPage('Timesheet Processing Workflow') } : {}}
                                    >CONTINUE</button>
                                </div>
                            </div>
                        }

                    </div> :
                    <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Timesheet Submission Terms'} title={'NO TIMESHEET FOUND'} description={'No Timesheet Is Found.'} buttonText={'ADD TIMESHEET'} />
            }
        </>
    )
}

export default PaymentAndCompensation;
