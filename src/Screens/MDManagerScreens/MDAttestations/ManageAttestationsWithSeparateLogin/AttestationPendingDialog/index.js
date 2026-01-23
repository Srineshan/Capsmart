import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "./../../../../../images/crossPink.png";
import Cookie from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import style from './index.module.scss'
import { useDescope } from '@descope/react-sdk';
import { Tooltip } from '@mui/material';

const AttestationPendingDialog = ({ getIsOpen, title }) => {
    const [isContinue, setIsContinue] = useState(false);
    const { logout } = useDescope();
    const navigate = useNavigate()
    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/", domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname });
        logout();
        navigate('/')
    }
    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>{title}</div>
                        {/* <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div> */}
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>Are you sure you want to leave without completing your outstanding Medical Directive attestations?</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip arrow title={"Click to Logout"}>
                            <div className={`${style.saveInProgress}`} onClick={() => { handleLogout(); }}>YES, I WILL CONTINUE LATER</div></Tooltip>
                        <Tooltip title="Click to Continue" arrow>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); }}>CONTINUE ATTESTING</div></Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default AttestationPendingDialog;