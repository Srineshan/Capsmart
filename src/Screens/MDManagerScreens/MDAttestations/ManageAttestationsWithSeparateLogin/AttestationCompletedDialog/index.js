import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "./../../../../../images/crossPink.png";
import Cookie from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import style from './index.module.scss'
import { useDescope } from '@descope/react-sdk';
import { Tooltip } from '@mui/material';

const AttestationCompletedDialog = ({ getIsOpen }) => {
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
                        <div className={style.heading}>You are current with all of your Medical Directive Attestations.</div>
                        {/* <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div> */}
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>You have reviewed and attested to all assigned medical directives. No further action is required at this time.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip arrow title={"Click to go back"}>
                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>Go To Attestor Workspace</div></Tooltip>
                        <Tooltip title="Click to Confirm and Logout" arrow>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { handleLogout(); }}>LOGOUT</div></Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default AttestationCompletedDialog;