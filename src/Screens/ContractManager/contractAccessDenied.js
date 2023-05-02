import React from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';

const ContractAccessDenied = ({ getContractAccessDeniedDialog }) => {

    return (
        <Dialog isOpen={getContractAccessDeniedDialog} onClose={() => getContractAccessDeniedDialog(false)} className={`${style.newCloneDialog} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.cloneDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Contract Access Granted</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getContractAccessDeniedDialog(false)} />
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
                <p className={`${style.cloneContent} ${style.marginTop20}`}>The contract that you trying to access is classified as Private.</p>
                <p className={`${style.cloneContent} ${style.marginTop20}`}>Only the listed designated contract manager can access this contract .</p>
                <p className={`${style.cloneContent} ${style.marginTop20}`}>You will need to contact the listed contact Manager for any information on this contract.</p>
                <div className={style.marginTop20}>
                    <div className={style.cloneContent}>RANJITH T</div>
                    <div className={style.cloneContent}>(+123 6578899)</div>
                    <div className={style.cloneContent}>RANJITH@TIMESMART.AI</div>
                </div>
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

export default ContractAccessDenied;
