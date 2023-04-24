import { useRef, useState, useEffect } from "react";
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { useIdleTimer } from "react-idle-timer";
import Cookies from "universal-cookie";
import style from './index.module.scss';


export default function IdleTimer() {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
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

    const logout = () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-tenantID": entityId,
                Authorization: `Bearer ${token}`,
            },
        };
        fetch(
            `http://${window.location.hostname}:${window.location.port}/logout`,
            requestOptions
        )
            .then((response) => {
                cookies.remove("user");
                cookies.remove("entityId");
                window.location.href = "/";
            })
            .catch((data) => console.log("Unexpected Error Occured"));
        setShowAlert(false);
        clearTimeout(sessionTimeoutRef.current);
    };

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
                        <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={logout}>Logout</button>
                    </div>
                </div>
            </Dialog>
        </div>);
}
