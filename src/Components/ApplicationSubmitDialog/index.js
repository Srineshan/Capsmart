import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Cookie from "universal-cookie";
import style from './index.module.scss'
import { PUT } from '../../Screens/dataSaver';
import { ErrorToaster } from '../../utils/toaster';
import { useDescope } from '@descope/react-sdk';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
// import { Logout } from '../../utils/auth';

const ApplicationSubmitDialog = ({ getIsOpen, title, description }) => {
    const { logout } = useDescope();
    const navigate = useNavigate()
    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/", domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname });
        logout()
        navigate('/')
    }

    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>{title}</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>{description}</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip title={"Click Okay to Logout"} arrow>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { handleLogout(); }}>OKAY</div></Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default ApplicationSubmitDialog;