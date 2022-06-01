import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import style from './index.module.scss';

const CloneAlert = ({getCloneDialog, getNewContract}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const leftElement = () => {
        return(
            <Button text="Upload" intent={Intent.PRIMARY} />
        )
    }

    const handleDateChange = () => {

    }

    return(
        <Dialog isOpen={getCloneDialog} onClose={() => getCloneDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.cloneDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Clone Alert</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getCloneDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <p className={`${style.cloneContent} ${style.marginTop20}`}>You are creating a new contract by cloning the selected active contract?</p>
            <div>
                <div className={`${style.positionCenter} ${style.marginTop20}`}>
                    <button className={`${style.cloneOutlinedButton} ${style.cursorPointer} ${style.paddingTop5}`}>NO</button>
                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} ${style.paddingTop5}`} onClick={() => getNewContract(true)}>YES</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default CloneAlert;