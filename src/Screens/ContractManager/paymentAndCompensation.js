import React, { useState, useEffect } from 'react';
import { InputGroup, RadioGroup, Radio, EditableText } from '@blueprintjs/core';
import {POST, GET, PUT, TenantID} from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

import style from './index.module.scss';

const PaymentAndCompensation = ({selectContractInfo, getViewPage7, getCurrentPage, contractId}) => {
    const [compensation, setCompensation] = useState('RVUBASED');
    const [paymentAndCompensation, setPaymentAndCompensation] = useState({});
    const [rvuQuantity, setRvuQuantity] =useState({
        quantity: 0
    })
    const [frequency, setFrequency] = useState('')
    const [fteEquivalent, setFteEquivalent] = useState({
        value: 0
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
        hour: 0
    })
    const [dollarValue, setDollarValue] = useState({
        perTimesheetSubmission: 0,
        perContractedPeriod: 0
    })
    const [compensationOffsetCriteria, setCompensationOffsetCriteria] = useState({
        reducedNumberOfServices: '',
        providingAdditionalServices: ''
    })

    const handleContinue = async() => {
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
          }
          const response = await PUT(`contract-managment-service/contracts/${contractId}/paymentAndCompensation`, JSON.stringify(data));
            if(response){
                SuccessToaster('Payment And Compensation Updated Successfully');
            }
            else {
                ErrorToaster('Unexpected Error');
            }
        console.log(data)
    }

    const getPaymentAndCompensation = async() => {
        const {data: paymentAndCompensation} = await GET(`contract-managment-service/contracts/${contractId}/paymentAndCompensation`);
        setPaymentAndCompensation(paymentAndCompensation);
    };

    useEffect(() => {
        setCompensation(paymentAndCompensation?.compensationBasis);
        setRvuQuantity(paymentAndCompensation?.rvuQuantity);
        setFrequency(paymentAndCompensation?.frequency);
        setFteEquivalent(paymentAndCompensation?.fteEquivalent);
        setRvuReferenceUsed(paymentAndCompensation?.rvuReferenceUsed);
        setRvuQuantityPeriod(paymentAndCompensation?.rvuQuantityPeriod);
        setRvuQuantityVariance(paymentAndCompensation?.rvuQuantityVariance);
        setDollarRate(paymentAndCompensation?.dollarRate);
        setDollarValue(paymentAndCompensation?.dollarValue);
        setCompensationOffsetCriteria(paymentAndCompensation?.compensationOffsetCriteria);
    },[paymentAndCompensation])

    useEffect(()=>{
        getPaymentAndCompensation();
    },[])

    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
                <div className={`${style.extentionGrid} ${selectContractInfo === "Individual Contractor" && style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Compensation Basis*</div>
                    <div>
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.leftAlign}`}
                            selectedValue={compensation}
                            onChange={(e) => setCompensation(e.target.value)}
                        >
                            <Radio label="RVU Based" value="RVUBASED" />
                            <Radio label="Dollar Based Rate" value="DOLLARBASEDRATE" />
                        </RadioGroup>
                    </div>
                </div>
                {compensation === "RVUBASED" && (
                    <div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Quantity*</div>
                            <div className={style.displayInRow}>
                                <InputGroup className={style.fourFieldWidth} value={rvuQuantity?.quantity} placeholder="0" maxLength={2}
                                onChange={(e) => setRvuQuantity({
                                    ...rvuQuantity, quantity: e.target.value
                                })} />
                                <select
                                    name="class"
                                    id="Class"
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    className={`${style.twoFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                    <option value="WEEK" >
                                        Per Week
                                    </option>
                                    <option value="MONTH" >
                                        Per Month
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>FTE Equivalent</div>
                            <InputGroup className={style.twoFieldWidth} value={fteEquivalent?.value} placeholder="0" maxLength={2}
                            onChange={(e) => setFteEquivalent({
                                ...fteEquivalent, value: e.target.value
                            })} />
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Reference Used</div>
                            <InputGroup className={style.fullWidth} value={rvuReferenceUsed?.value} placeholder="Enter RVU Reference Used"
                            onChange={(e) => setRvuReferenceUsed({
                                ...rvuReferenceUsed, value: e.target.value
                            })} />
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Quantity Variance (+/-)</div>
                            <InputGroup className={style.twoFieldWidth} value={rvuQuantityVariance?.value} placeholder="0" maxLength={2}
                            onChange={(e) => setRvuQuantityVariance({
                                ...rvuQuantityVariance, value: e.target.value
                            })} />
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Quantity Period</div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                <EditableText className={style.editableTextStyleDays} value={rvuQuantityPeriod?.days} placeholder="0" maxLength={2}
                                onChange={(e) => setRvuQuantityPeriod({
                                    ...rvuQuantityPeriod, days: e
                                })} />
                                <div className={style.textElementWithoutBackgroundDays}>Days</div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Dollar Hourly Rate*</div>
                    <InputGroup className={style.fourFieldWidth} value={dollarRate?.hour} placeholder="0" maxLength={2}
                        onChange={(e) => setDollarRate({
                            ...dollarRate, hour: e.target.value
                        })} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Dollar Value per Timesheet Submission*</div>
                    <InputGroup className={style.fourFieldWidth} value={dollarValue?.perTimesheetSubmission} placeholder="0" maxLength={2}
                    onChange={(e) => setDollarValue({
                        ...dollarValue, perTimesheetSubmission: e.target.value, perContractedPeriod: dollarValue?.perContractedPeriod
                    })} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Dollar Value for per Contracted Year/Period*</div>
                    <InputGroup className={style.fourFieldWidth} value={dollarValue?.perContractedPeriod} placeholder="0" maxLength={2}
                    onChange={(e) => setDollarValue({
                        ...dollarValue, perContractedPeriod: e.target.value, perTimesheetSubmission: dollarValue?.perTimesheetSubmission
                    })} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Compensation Offset Criteria for Reduced Number of Agreed to Services*</div>
                    <select
                        name="class"
                        id="Class"
                        value={compensationOffsetCriteria?.reducedNumberOfServices}
                        onChange={(e) => setCompensationOffsetCriteria({
                            ...compensationOffsetCriteria, reducedNumberOfServices: e.target.value, providingAdditionalServices: compensationOffsetCriteria?.providingAdditionalServices
                        })}
                        className={`${style.fullWidth}`}>
                        <option value="Per Timesheet Period" >
                            Per Timesheet Period
                        </option>
                    </select>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Compensation Offset Criteria for Providing Additional Services to the Agreed to Services*</div>
                    <select
                        name="class"
                        id="Class"
                        value={compensationOffsetCriteria?.providingAdditionalServices}
                        onChange={(e) => setCompensationOffsetCriteria({
                            ...compensationOffsetCriteria, providingAdditionalServices: e.target.value, reducedNumberOfServices: compensationOffsetCriteria?.reducedNumberOfServices
                        })}
                        className={`${style.fullWidth}`}>
                        <option value="Per Contract Period" >
                            Per Contract Period
                        </option>
                    </select>
                </div>
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={()=> {getCurrentPage('Contracted Services Specification')}}>BACK</button>
                <div>
                    <button className={style.newContractOutlinedButton} onClick={() => handleContinue()}>SAVE IN-PROGRESS</button>
                    <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                    onClick={() => { getViewPage7(true); getCurrentPage('Timesheet Submission Terms') }}
                    // onClick={() => { handleContinue() }}
                    >CONTINUE</button>
                </div>
            </div>
        </div>
    )
}

export default PaymentAndCompensation;
