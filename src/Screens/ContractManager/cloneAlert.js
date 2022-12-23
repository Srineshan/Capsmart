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
        <Dialog isOpen={getCloneDialog} onClose={() => getCloneDialog(false)} className={`${style.newCloneDialog} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.cloneDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Contract Clone Alert</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getCloneDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.dialogAdditionalDetailBoxStyle}`}>
                <div>
                    <div className={`${style.dialogAdditionalDetailTextStyle}`}>New Contract with No Prior Contract(s) with Entity</div>
                    <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>SITE NAME ONLY IF MULTISITE</div>
                    <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>{`contract manager { name}`}</div>
                </div>
                <div>
                    <div className={`${style.dialogAdditionalDetailTextStyle}`}>PAMF CONTRACT (0043245)</div>
                    <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>MULTIPLE CONTRACTORS (23)</div>
                    <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>DRAFT CREATED ON 23-5-2022</div>
                </div>
            </div>
            <p className={`${style.cloneContent} ${style.marginTop20}`}>You are creating a new contract by cloning the selected active contract?</p>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`}>CANCEL</button>
                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => getNewContract(true)}>CONFIRM</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default CloneAlert;
