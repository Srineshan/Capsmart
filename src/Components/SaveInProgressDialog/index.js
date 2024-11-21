import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'
import { PUT } from '../../Screens/dataSaver';
import { useParams } from 'react-router-dom';
import { ErrorToaster } from '../../utils/toaster';
import { useDescope } from '@descope/react-sdk';

const SaveInProgressDialog = ({ getIsOpen }) => {
    const [isContinue, setIsContinue] = useState(false);
    const { applicationId, section, step } = useParams()
    const { logout } = useDescope();


    const handleSubmit = async () => {
        await PUT(
            `application-management-service/application/${applicationId}/saveInprogress`,
            `${section}/${step}`
        )
            .then((response) => {
                console.log(response);
                logout()
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
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <p className={`${style.description} ${style.marginTop}`}>Your progress has been saved. You can continue from where you left off when you log in again! By clicking Confirm, you will be logged out.</p>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CANCEL</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { handleSubmit(); }}>CONFIRM</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default SaveInProgressDialog;