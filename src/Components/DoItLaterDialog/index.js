import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'
import { logout } from '../../utils/auth';

const DoItLaterDialog = ({ getIsOpen }) => {
    const [isContinue, setIsContinue] = useState(false);

    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Do It Later!</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>No problem! You can start your application anytime when you're ready. By clicking Confirm, you will be logged out.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { logout(); }}>CONFIRM</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default DoItLaterDialog;