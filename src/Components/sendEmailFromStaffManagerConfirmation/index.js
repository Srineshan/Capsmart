import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Mail from "../../images/envelope_color.png";

import style from './index.module.scss'
import { POST } from '../../Screens/dataSaver';
import { useNavigate } from 'react-router-dom';

const SendEmailFromStaffManagerConfirmationDialog = ({ getIsOpen, basicForm }) => {
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();


    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Request to complete an Application</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <div className={`${style.sendMailGrid} ${style.marginTop}`}>
                        <div className={style.verticalAlignCenter}>
                            <img
                                src={Mail}
                                alt="cross"
                                className={`${style.mailEnvelopeStyle} ${style.marginTop10}`}
                            />
                        </div>
                        <p className={`${style.emailSentText} ${style.marginTop}`}>{`Email Notifcation has been sent successfully to ${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName}`}</p>
                    </div>

                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { navigate('/applications') }}>OK</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default SendEmailFromStaffManagerConfirmationDialog;