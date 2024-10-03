import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Cookies from "universal-cookie";
import style from './index.module.scss'
import { PUT } from '../../Screens/dataSaver';
import { ErrorToaster } from '../../utils/toaster';

const ApplicationSubmitDialog = ({ getIsOpen }) => {
    const logout = async () => {
        const cookies = new Cookies();
        await PUT(`logout`, null)
            .then((response) => {
                const logouturi = response.headers["location"] || "";
                cookies.remove("user", { path: "/" });
                cookies.remove("entityId", { path: "/" });
                if (logouturi) {
                    window.location.href = logouturi;
                }
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error");
            });
    };
    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Application Submitted!</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>Please note that the entire application process for full board approval may take up to 3 months to complete. The completed file will be forwarded to the credentials committee and medical advisory committee for review before being forwarded to the board of Cambridge Memorial Hospital for final consideration.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { logout(); }}>OKAY</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default ApplicationSubmitDialog;