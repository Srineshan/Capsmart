import React from 'react';
import { Icon, Intent, Dialog, Classes } from '@blueprintjs/core';

import style from './index.module.scss';

const DeleteConfirmation = ({getShowDeleteConfirmation, getDeleteConfirmation, confirmationText}) => {
    return(
        <Dialog isOpen={getShowDeleteConfirmation} onClose={() => getShowDeleteConfirmation(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.deleteDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Delete Confirmation</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getShowDeleteConfirmation(false)}  />
                </div>
                <div className={style.extensionBorder}></div>
                <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                {confirmationText}
                </p>
                <div className={`${style.positionCenter} ${style.marginTop20}`}>
                    <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`} onClick={()=>getShowDeleteConfirmation(false)}>NO</button>
                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => {getDeleteConfirmation(true);getShowDeleteConfirmation(false)}}>YES</button>
                </div>
            </div>
        </Dialog>
    )
}

export default DeleteConfirmation;