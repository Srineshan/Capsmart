import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import style from './index.module.scss';

const ContractExtension = ({getExtensionDialog}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const leftElement = () => {
        return(
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    return(
        <Dialog isOpen={getExtensionDialog} onClose={() => getExtensionDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Contract Extension</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getExtensionDialog(false)}  />
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
                    <div className={style.extentionLableStyle}>Contract Extension*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="03-16-2022" rightElement={calendarIcon()} />
                    <p className={style.toStyle}>To</p>
                        <InputGroup value="03-16-2022" rightElement={calendarIcon()} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contract Extension Notes*</div>
                    <div>
                        <TextArea
                            growVertically={true}
                            large={true}
                            value="text area"
                            className={style.fullWidth}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Executed extension document on File*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Document Name" className={style.textFieldWidth} />
                        <InputGroup  leftElement={leftElement()} className={style.marginLeft20} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                    <div className={`${style.extentionLableStyle}`}>Extension Continuation Policy*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            value={selectedContract || 'Select...'}
                            onChange={(e) => setSelectedContract(e.target.value)}
                            className={`${style.fullWidth} ${style.marginLeft20}`}>
                                <option value="Written Contract Extension For Fixed Term">
                                Written Contract Extension For Fixed Term
                                </option>
                                <option value="New Contract On Expiration" >
                                New Contract On Expiration
                                </option>
                                <option value="One Time Extension - Terminate On Expiration">
                                One Time Extension - Terminate On Expiration
                                </option>
                        </select>
                    </div>
                </div>
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

export default ContractExtension;