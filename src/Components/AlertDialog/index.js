import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'
import { Tooltip } from '@mui/material';

const AlertDialog = ({ isOpen, getIsOpen, title, description }) => {

    return (
        <Dialog isOpen={isOpen} onClose={() => getIsOpen(false, 'CANCEL')} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>{title}</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false, 'CANCEL') }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>{description}</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                    <Tooltip title={"Click to Cancel and Close"} arrow>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false, 'CANCEL'); }}>CANCEL</div> </Tooltip>
                        <Tooltip title={"Click to Confirm and Proceed"} arrow>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false, 'OKAY'); }}>CONFIRM</div></Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default AlertDialog;