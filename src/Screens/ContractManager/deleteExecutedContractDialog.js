import React from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';

const DeleteExecutedContractDialog = ({getDeleteExecutedContractDialog}) => {

  console.log(getDeleteExecutedContractDialog)
    return(
        <Dialog isOpen={getDeleteExecutedContractDialog} onClose={() => getDeleteExecutedContractDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Delete Executed Contract</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getDeleteExecutedContractDialog(false)}  />
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
                <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`}>NO</button>
                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`}>YES</button>
            </div>
          </div>
        </Dialog>
    )
}

export default DeleteExecutedContractDialog;