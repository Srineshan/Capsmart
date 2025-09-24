import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import { GET, POST, PUT } from '../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import style from './index.module.scss'
import CommonSelectField from '../CommonFields/CommonSelectField';
import { getValueByPath } from '../../utils/formatting';
import { Tooltip } from '@mui/material';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';

const ESignConfirmationUserDialog = ({ getIsOpen, basicForm, updateFunc, confirmFunc, hideCross }) => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const [userData, setUserData] = useState();
    let eSignImg = userData?.esignature?.file;
    let eSignTypeContent = userData?.esignature?.type ? userData?.esignature?.type?.text : '';
    let eSignTypeContentStyle = userData?.esignature?.type ? userData?.esignature?.type?.style : '';
    let eSignInitial = userData?.esignature?.initial;
    let eSignTitle = userData?.esignature?.title;
    const [eSignType, setESignType] = useState(eSignTypeContent !== undefined ? eSignTypeContent : '');
    console.log(eSignTypeContent, eSignType)

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        console.log("userdataaaa" + JSON.stringify(userData))
        setUserData(userData)
    }

    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: basicForm?.forms?.[0]?.schemaId,
            data: data
        }
        console.log(temp, data)
        // await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[0]?.id}`, temp)
        //     .then(response => {
        //         console.log(response)
        //         setBasicForm(response?.data)
        //         SuccessToaster("Application Updated Successfully");
        //         getIsOpen(false)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         ErrorToaster("Unexpected Error Updating Application");
        //     });
    }
    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Confirm Your Electronic Signature</div>
                        <div className={style.displayInRow}>
                            {/* <p className={`${style.dateAndTimeTextStyle} ${style.marginLeft}`}>Mm/Dd/Yyyy</p>
                            <p className={`${style.dateAndTimeTextStyle} ${style.marginLeft}`}>00:00</p> */}
                            {!hideCross && (
                                <Tooltip title={"Click to Close"} arrow>
                                    <img
                                        src={CrossPink}
                                        alt="cross"
                                        className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                        onClick={() => { getIsOpen(false) }}
                                    />
                                </Tooltip>
                            )}
                        </div>
                    </div>

                    <p className={`${style.description} ${style.marginTop}`}>{window.location.pathname.includes('pnpManager') ? 'PNP Manager' : 'MD Manager'} uses Electronic Signatures for you to sign off on the required Medical Directives.</p>
                    <div className={style.eSignConfirmationCard}>
                        <div className={style.confimationHeading}>Your e-Signature on file</div>
                        <div><img src={eSignImg?.fileURL} alt="" className={style.eSignImg} /></div>
                        <div className={style.confimationHeading}>Title</div>
                        <div><strong>{eSignTitle}</strong></div>
                        <div className={style.twoCol}>
                            <div>
                                <div className={style.confimationHeading}>Initials</div>
                                <div><strong>{eSignInitial}</strong></div>
                            </div>
                            <div>
                                <div style={{
                                    fontFamily: eSignTypeContentStyle,
                                    padding: "20px",
                                    marginTop: "10px",
                                    fontSize: "24px",
                                    textAlign: 'left'
                                }} >{eSignTypeContent}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip title={"Click to Update Your E-sign"} arrow>
                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); updateFunc() }}>UPDATE</div></Tooltip>
                        <Tooltip title={"Click to Keep Your E-sign as Is"} arrow>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); confirmFunc() }}>KEEP AS IS</div></Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default ESignConfirmationUserDialog;