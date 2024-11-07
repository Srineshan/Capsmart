import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import ThirdPartyDialog from '../../Components/ThirdPartyDialog';

import style from './index.module.scss'

const PaymentDialog = ({ getIsOpen, continueClickFunc }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [showThirdPartyDialog, setShowThirdPartyDialog] = useState(false);

    const getIsShowThirdPartyDialog = (value) => {
        setShowThirdPartyDialog(value);
    }


    return (
        <>
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Payment Required</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>For the Privilege category you have selected for your reappointment there is an application processing fee of CAD$ 50.</p>
                    <p className={`${style.description} ${style.marginTop}`}>Payment is required before you can complete the rest of your application.</p>
                    <div className={style.paymentGrid}>
                        <div className={`${style.description} ${style.marginTop}`}>Your Purchase</div>
                        <div className={`${style.description} ${style.marginTop}`}><strong>Reappointment Application Processing Fee</strong></div>
                    </div>
                    <div className={style.paymentGrid}>
                        <div className={`${style.description} ${style.marginTop10}`}>Amount</div>
                        <div className={`${style.description} ${style.marginTop10}`}><strong>CAD $50</strong></div>
                    </div>
                    <div className={`${style.description} ${style.marginTop}`}><strong>NOTE:</strong> Work in progress. Clicking continue button will not take to payment screen.</div>
                    <div className={`${style.spaceBetween} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div>
                        {/* <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); continueClickFunc(); }}>CONTINUE</div> */}
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => {getIsOpen(true); setShowThirdPartyDialog(true)}}>CONTINUE</div>
                    </div>
                </div>

            </div>
        </Dialog >
        {showThirdPartyDialog && (
                <ThirdPartyDialog getIsOpen={getIsShowThirdPartyDialog} continueClick={continueClickFunc} />
            )}
        </>
    )
}

export default PaymentDialog;