import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'

const ValidationDialog = ({ getIsOpen, labelList, getSkipClicked }) => {
    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Mandatory Fields Alert!</div>
                        {/* <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div> */}
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>The below fields are mandatory. </p>
                    {labelList?.map((data, index) => (
                        <p className={`${style.description} ${style.marginTop10} ${style.marginLeft}`}>{`${index + 1}. ${data?.label}`}</p>
                    ))}
                    <p className={`${style.description} ${style.marginTop}`}>Do you want to skip or continue your data entry?</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CONTINUE</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); getSkipClicked(true); }}>SKIP</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default ValidationDialog;