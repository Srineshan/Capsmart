import React, { useEffect, useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';

import style from './index.module.scss'
import { GET, PUT } from '../../Screens/dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster } from '../../utils/toaster';
import { useDescope } from '@descope/react-sdk';
import { Tooltip } from '@mui/material';

const LogoutConfirmation = ({ getIsOpen }) => {
    const navigate = useNavigate();
    const { logout } = useDescope();

    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/" });
        logout()
        navigate('/');
    }

    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Do you want to log out?</div>
                        <div className={style.displayInRow}>
                            <Tooltip title={"Click to Close"} arrow>
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                    onClick={() => { getIsOpen(false) }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>You will be logged out of your account. Click Confirm to proceed.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip title={"Click to Cancel"} arrow>
                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div></Tooltip>
                        <Tooltip title={"Click to Confirm"} arrow>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { handleLogout(); }}>CONFIRM</div>
                        </Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default LogoutConfirmation;