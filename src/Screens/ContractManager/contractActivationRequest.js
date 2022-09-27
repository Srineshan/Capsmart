import React from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';

const ContractActivationRequest = ({getContractActivationDialog}) => {
    return(
        <Dialog isOpen={getContractActivationDialog} onClose={() => getContractActivationDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Contract Activation Request</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getContractActivationDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>PAMF CONTRACT (0043245)</p>
                <p className={style.extensionOptionsStyle}>MULTIPLE CONTRACTORS (34)</p>
                <p className={style.extensionOptionsStyle}>EXPIRING IN 20 DAYS</p>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.deleteDraftBoxStyle} ${style.marginTop20}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Reason For Activating Contract*</div>
                    <TextArea value="text area" rows="4" />
                </div>
            </div>
            <div className={style.marginTop20}>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton}>CANCEL</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>REQUEST</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default ContractActivationRequest;