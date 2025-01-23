import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'

const UserCreatedSuccessfullyDialog = ({ isOpen, getIsOpen, user }) => {

    return (
        <Dialog isOpen={isOpen} onClose={() => getIsOpen(false, 'CANCEL')} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Registered User Created Successfully.</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false, 'CANCEL') }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>User will need to setup their access credentials to activate their User Account. Would you like to send this user their notification to activate their account.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false, 'CANCEL'); }}>SEND LATER</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false, 'OKAY'); }}>SEND NOW</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default UserCreatedSuccessfullyDialog;