import React from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';

const ContractAccessGranted = ({ getContractAccessGrantedDialog }) => {

    return (
        <Dialog isOpen={getContractAccessGrantedDialog} onClose={() => getContractAccessGrantedDialog(false)} className={`${style.newCloneDialog} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.cloneDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Contract Access Granted</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getContractAccessGrantedDialog(false)} />
                </div>
                <div className={style.extensionBorder}></div>
                <div className={`${style.dialogAdditionalDetailBoxStyle}`}>
                    <div>
                        <div className={`${style.dialogAdditionalDetailTextStyle}`}>New Contract with No Prior Contract(s) with Entity</div>
                        <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>PAMF CONTRACT (0043245)</div>
                        <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>MULTIPLE CONTRACTORS (23)</div>
                    </div>
                    <div>
                        <div className={`${style.dialogAdditionalDetailTextStyle}`}>{`Ranjith T { contract manager }`}</div>
                        <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>SITE NAME ONLY IF MULTISITE</div>
                        <div className={`${style.dialogAdditionalDetailTextStyle} ${style.marginTop10}`}>ACTIVATED ON 10-23-2022</div>
                    </div>
                </div>
                <p className={`${style.cloneContent} ${style.marginTop20}`}>You are accessing a contract that is managed by Mr (manager name).</p>
                <p className={`${style.cloneContent} ${style.marginTop20}`}>Any actions you take on this contract or modifications you make will be logged.</p>
                <p className={`${style.cloneContent} ${style.marginTop20}`}>Are you sure you want to continue ?</p>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`}>CANCEL</button>
                        <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}>CONFIRM</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ContractAccessGranted;
