import { useRef, useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { useIdleTimer } from "react-idle-timer";
import { POST, TenantID, PUT } from "./../../Screens/dataSaver";
import axios from 'axios';
import { ErrorToaster } from "./../../utils/toaster";
import Cookies from "universal-cookie";
import style from './index.module.scss';
import { useDescope } from "@descope/react-sdk";
import { useNavigate } from "react-router-dom";
import Cookie from 'universal-cookie';


export default function IdleTimer() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate()
    const { logout } = useDescope();
    const sessionTimeoutRef = useRef(null);
    const cookies = new Cookies();
    let token = cookies.get("user");
    let entityId = cookies.get("entityId");

    const idleTimeRef = useRef(null);
    const onIdle = () => {
        setShowAlert(true);
        sessionTimeoutRef.current = setTimeout(logout, 60000);
    };
    const idleTimer = useIdleTimer({
        crossTab: true,
        ref: idleTimeRef,
        timeout: 15 * 60 * 1000,
        onIdle: onIdle,
    });

    const onContinue = () => {
        setShowAlert(false);
        clearTimeout(sessionTimeoutRef.current);
    }

    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/", domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname });
        logout()
        navigate('/')
    }


    // const logout = async () => {
    //     await PUT(`logout`, null)
    //         .then(response => {
    //             const logouturi = response.headers['location'] || '';
    //             cookies.remove("user", { path: '/' });
    //             cookies.remove("entityId", { path: '/' });
    //             if (logouturi) {
    //                 window.location.href = logouturi;
    //             }
    //         }).catch(error => {
    //             console.log('error msg', error);
    //             ErrorToaster('Unexpected Error');
    //         })
    // };

    return (
        <div>
            <div idleTimer={idleTimer}>
            </div>
            <Dialog isOpen={showAlert} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Session Inactive</p>
                        {/* <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowAlert(false)} /> */}
                    </div>
                    <div className={style.extensionBorder}></div>
                    <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                        You have been Inactive for 15 minutes.
                    </p>
                    <div className={`${style.positionCenter} ${style.marginTop20}`}>
                        <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={onContinue}>Continue</button>
                        <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => handleLogout()}>Logout</button>
                    </div>
                </div>
            </Dialog>
        </div>);
}
