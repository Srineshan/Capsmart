import React, { useState } from 'react';
import { InputGroup, RadioGroup, Radio, EditableText } from '@blueprintjs/core';

import style from './index.module.scss';

const PaymentAndCompensation = ({selectContractInfo, getViewPage7, getCurrentPage}) => {
    const [compensation, setCompensation] = useState('RVU Based');

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
                            <Radio label="RVU Based" value="RVU Based" />
                            <Radio label="Dollar Based Rate" value="Dollar Based Rate" />
                        </RadioGroup>
                    </div>
                </div>
                {compensation === "RVU Based" && (
                    <div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Quantity*</div>
                            <div className={style.displayInRow}>
                                <InputGroup className={style.fourFieldWidth} value="" />
                                <select
                                    name="class"
                                    id="Class"
                                    // value={selectedContractContinuationPolicy || 'Select...'}
                                    // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                    className={`${style.twoFieldWidth} ${style.marginLeft20} ${style.reduceTop}`}>
                                    <option value="Per Week/Month" >
                                        Per Week/Month
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>FTE Equivalent</div>
                            <InputGroup className={style.twoFieldWidth} />
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Reference Used</div>
                            <InputGroup className={style.fullWidth} />
                        </div>
                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Quantity Variance (+/-)</div>
                            <InputGroup className={style.twoFieldWidth} />
                        </div>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>RVU Quantity Period</div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorderSmall} ${style.fourFieldWidth} ${style.reduce25Left}`}>
                                <EditableText value="3" className={style.editableTextStyleDays} />
                                <div className={style.textElementWithoutBackgroundDays}>Days</div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Dollar Hourly Rate*</div>
                    <InputGroup className={style.fourFieldWidth} value="120" />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Dollar Value per Timesheet Submission*</div>
                    <InputGroup className={style.fourFieldWidth} value="40" />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Dollar Value for per Contracted Year/Period*</div>
                    <InputGroup className={style.fourFieldWidth} value="120" />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Compensation Offset Criteria for Reduced Number of Agreed to Services*</div>
                    <select
                        name="class"
                        id="Class"
                        // value={selectedContractContinuationPolicy || 'Select...'}
                        // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
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
                        // value={selectedContractContinuationPolicy || 'Select...'}
                        // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                        className={`${style.fullWidth}`}>
                        <option value="Per Contract Period" >
                            Per Contract Period
                        </option>
                    </select>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { getViewPage7(true); getCurrentPage('Timesheet Submission Terms') }}>CONTINUE</button>
            </div>
        </div>
    )
}

export default PaymentAndCompensation;