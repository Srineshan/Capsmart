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

const SaveInProgressDialog = ({ getIsOpen }) => {
    const navigate = useNavigate();
    const [isContinue, setIsContinue] = useState(false);
    const [taskDetails, setTaskDetails] = useState(false);
    const { applicationId, section, step } = useParams()
    const { logout } = useDescope();
    let taskId = sessionStorage.getItem('taskId')

    useEffect(() => {
        if (taskId !== undefined && taskId !== 'undefined' && taskId !== null) {
            getTaskById()
        }
    }, [taskId])

    const getTaskById = async () => {
        const { data: content } = await GET(
            `task-management-service/task/${taskId}`
        );
        setTaskDetails(content);
    }
    console.log(taskId, 'taskId')

    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/", domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname });
        logout()
        navigate('/');
    }

    console.log(localStorage.getItem(`totalTime_${applicationId}`), 'totalTime', Math.floor(parseFloat(localStorage.getItem(`totalTime_${applicationId}`)) / 60000))

    const handleSubmit = async () => {
        if (taskId !== undefined && taskId !== 'undefined' && taskId !== null) {
            let tempTask = taskDetails;
            tempTask.details.application.lastSavedSection = `${section}/${step}`;
            await PUT(`task-management-service/task/${taskId}`, tempTask);
        }
        let timeData = {
            "value": Math.floor(parseFloat(localStorage.getItem(`totalTime_${applicationId}`)) / 60000),
            "unit": "MINUTES"
        }
        await PUT(`application-management-service/application/${applicationId}/completionDuration`, timeData)
        await PUT(
            `application-management-service/application/${applicationId}/saveInprogress`,
            `${section}/${step}`
        )
            .then((response) => {
                console.log(response);
                handleLogout()
            })
            .catch((error) => {
                console.log(error);
                ErrorToaster("Save In Progress Failed");
            });
    }

    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Save In Progress!</div>
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
                    <p className={`${style.description} ${style.marginTop}`}>Your progress has been saved. You can continue from where you left off when you log in again! By clicking Confirm, you will be logged out.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip title={"Click to Cancel"} arrow>
                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div></Tooltip>
                        <Tooltip title={"Click to Confirm"} arrow>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { handleSubmit(); }}>CONFIRM</div>
                        </Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default SaveInProgressDialog;