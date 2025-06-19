import React, { useState } from 'react';
import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonRadio from '../../Components/CommonFields/CommonRadio';

const MDManagerStep3 = ({ setStep3 }) => {
    const [autoTriggerRevision, setAutoTriggerRevision] = useState('');
    const [autoTriggerForApprovedStaff, setAutoTriggerForApprovedStaff] = useState('');
    const [autoTriggerForStaffReappointment, setAutoTriggerForStaffReappointment] = useState('');
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 3</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Set Up Staff Review & Attestation Rules</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setStep3(false) }} >SAVE IN PROGRESS</button>
                        <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep3(false) }} >CONTINUE</button>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Attestation Rules to apply</div>
                </div>
                <div className={`${style.padding20} ${style.marginTop20}`}>
                    <CommonSelectField
                        //   value={selectedCategory}
                        //   onChange={(e) => setSelectedCategory(e.target.value)}
                        className={style.fullWidth1}
                        //   firstOptionLabel={'Select Category'}
                        //   firstOptionValue={''}
                        valueList={["Every 1 Year", "Every 2 Year"]}
                        labelList={["Every 1 Year", "Every 2 Year"]}
                        disabledList={false}
                        required={false}
                        label={"Frequency of Review for Attestation (if none within the period selected)"}
                    />
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Auto trigger reviews and attestations on revision / update of Medical Directive</div>
                        <CommonSwitch label={autoTriggerRevision ? 'YES' : 'NO'} checked={autoTriggerRevision} onChange={(e) => setAutoTriggerRevision(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Target Staff for Medical Directive review and attestation</div>
                        <CommonRadio
                            // value={privileges?.response || ""}
                            radioValue={["All Staff Members", "Selected Groups"]}
                            label={["All Staff Members", "Selected Groups"]}
                        />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for approved new staff applicant</div>
                        <CommonSwitch label={autoTriggerForApprovedStaff ? 'YES' : 'NO'} checked={autoTriggerForApprovedStaff} onChange={(e) => setAutoTriggerForApprovedStaff(e.target.checked)} labelName={''} />
                    </div>
                    <div className={`${style.marginTop20} ${style.twoCol}`}>
                        <div className={style.labelStyle}>Auto trigger review and attestations for staff reappointment</div>
                        <CommonSwitch label={autoTriggerForStaffReappointment ? 'YES' : 'NO'} checked={autoTriggerForStaffReappointment} onChange={(e) => setAutoTriggerForStaffReappointment(e.target.checked)} labelName={''} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MDManagerStep3;