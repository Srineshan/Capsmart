import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'

const UploadDocumentValidationDialog = ({ getIsOpen, labelList, getSkipClicked }) => {
    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Mandatory Fields Alert!</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>You are missing some required documents </p>
                    <p className={`${style.description} ${style.marginTop}`}>You are missing documents that are required to proceed with this application. To ensure a complete & successful submission provide all of the required documents.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CONTINUE</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); getSkipClicked(true); }}>SKIP</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default UploadDocumentValidationDialog;