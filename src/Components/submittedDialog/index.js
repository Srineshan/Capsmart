import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'

const SubmittedDialog = ({ getIsOpen }) => {
    const [isContinue, setIsContinue] = useState(false);

    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Save In Progress Alert!</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>Save In Progress Description goes here</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        {/* <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div> */}
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); }}>OKAY</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default SubmittedDialog;