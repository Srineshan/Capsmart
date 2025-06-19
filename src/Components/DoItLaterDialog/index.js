import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Cookie from 'universal-cookie';

import style from './index.module.scss'
import { useDescope } from '@descope/react-sdk';
import { Tooltip } from '@mui/material';

const DoItLaterDialog = ({ getIsOpen }) => {
    const [isContinue, setIsContinue] = useState(false);
    const { logout } = useDescope();
    // const handleLogout = () => {
    //     var cookies = new Cookie();
    //     // cookies.remove("user", { path: "/" });
    //     cookies.remove("entityId", { path: "/" });
    //     // cookies.remove("authorization", { path: "/" });
    //     logout()
    // }
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
                    <p className={`${style.description} ${style.marginTop}`}>No problem! You can start your application anytime you're ready by clicking the link in the original email you received.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip arrow title={"Click to Close"}>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div></Tooltip>
                        <Tooltip title="Click to Confirm and Logout" arrow>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { logout(); }}>CONFIRM</div></Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default DoItLaterDialog;