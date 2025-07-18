import React from 'react';
import { Icon, Intent, Dialog, Classes } from '@blueprintjs/core';

import style from './index.module.scss';
import { Tooltip } from '@mui/material';

const CmeFileConfirmation = ({getShowCmeFileConfirmation, getCmeFileConfirmation, confirmationText}) => {
    return(
        <Dialog isOpen={getShowCmeFileConfirmation} onClose={() => getShowCmeFileConfirmation(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.deleteDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Delete Confirmation</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getShowCmeFileConfirmation(false)}  />
                </div>
                <div className={style.extensionBorder}></div>
                <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                {confirmationText}
                </p>
                <div className={`${style.positionCenter} ${style.marginTop20}`}>
                <Tooltip title={"Click to Select No"} arrow>
                    <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`} onClick={()=>getShowCmeFileConfirmation(false)}>NO</button></Tooltip>
                    <Tooltip title={"Click to Select Yes"} arrow>
                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => {getCmeFileConfirmation(true);getShowCmeFileConfirmation(false)}}>YES</button></Tooltip>
                </div>
            </div>
        </Dialog>
    )
}

export default CmeFileConfirmation;