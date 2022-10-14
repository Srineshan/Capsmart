import React,{useState} from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';

const Alert = ({getShowAlertDialog, isMultipleContract, contractId}) => {

    return(
      <>
        <Dialog isOpen={getShowAlertDialog} onClose={() => getShowAlertDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>ALERT</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getShowAlertDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore,
            <span className={`${style.blueColor} ${style.marginLeft20}`}>
            quis nostrud xercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat
            </span>
            </p>
            <div className={`${style.positionCenter} ${style.marginTop20}`}>
                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}>OK</button>
            </div>
          </div>
        </Dialog>
      </>
    )
}

export default Alert;
