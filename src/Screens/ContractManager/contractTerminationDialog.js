import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio, Switch } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import style from './index.module.scss';

const ContractTermination = ({getTerminationDialog}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration')
    const leftElement = () => {
        return(
            <Button text="Upload" intent={Intent.PRIMARY} />
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    return(
        <Dialog isOpen={getTerminationDialog} onClose={() => getTerminationDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Contract Termination</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getTerminationDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>PAMF CONTRACT (0043245)</p>
                <p className={style.extensionOptionsStyle}>MULTIPLE CONTRACTORS (34)</p>
                <p className={style.extensionOptionsStyle}>EXPIRING IN 20 DAYS</p>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.extentionBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Termination Trigger*</div>
                    <RadioGroup
                        inline={true}
                        onChange={(e) => setTerminationTrigger(e.target.value)}
                        selectedValue={terminationTrigger}
                    >
                        <Radio label="Contract Expiration" value="Contract Expiration" checked />
                        <Radio label="For Cause By Contractor" value="For Cause By Contractor" />
                        <Radio label="For Cause By Entity" value="For Cause By Entity" />
                    </RadioGroup>
                </div>
                {terminationTrigger === "Contract Expiration" ? (
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>New Contract To Replace Expired Contract*</div>
                        <div className={style.displayInRow}>
                            <Switch checked={true} label="YES" className={style.marginTop}  />
                            <p className={style.contractId}>Contract Id</p>
                            <InputGroup value="35876989" />
                        </div>
                    </div>
                ) : (
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Termination Reason*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            value={selectedContract || 'Select...'}
                            onChange={(e) => setSelectedContract(e.target.value)}
                            className={`${style.fullWidth} ${style.marginLeft20} `}>
                                <option value="violation of contract terms" >
                                violation of contract terms
                                </option>
                                <option value="Integrity screening match" >
                                Integrity screening match
                                </option>
                                <option value="Other Termination Reason:: Allow Them To Add New Reason">
                                Other Termination Reason:: Allow Them To Add New Reason
                                </option>
                        </select>
                    </div>
                </div>
                )}
                {terminationTrigger !== "Contract Expiration" && (
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Termination Notes*</div>
                        <div>
                            <TextArea
                                growVertically={true}
                                large={true}
                                value="text area"
                                className={style.fullWidth}
                            />
                        </div>
                    </div>
                )}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Termination Date*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="03-16-2022" rightElement={calendarIcon()} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Termination By*</div>
                    <InputGroup className={style.terminationFieldWidth}/>
                </div>
                {terminationTrigger === "Contract Expiration" && (
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Termination Notes*</div>
                        <div>
                            <TextArea
                                growVertically={true}
                                large={true}
                                value="text area"
                                className={style.fullWidth}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton}>CANCEL</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default ContractTermination;