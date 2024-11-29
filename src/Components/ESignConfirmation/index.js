import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import { POST, PUT } from '../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import style from './index.module.scss'
import CommonSelectField from '../CommonFields/CommonSelectField';
import { getValueByPath } from '../../utils/formatting';

const ESignConfirmationDialog = ({ getIsOpen, tempValue, baseKey, applicationId, basicForm, setBasicForm, updateFunc, confirmFunc }) => {
    let eSignImg = getValueByPath(basicForm, 'forms[0].data.setUpYourSignature.file');
    let eSignTypeContent = getValueByPath(basicForm, 'forms[0].data.setUpYourSignature.type.text');
    let eSignTypeContentStyle = getValueByPath(basicForm, 'forms[0].data.setUpYourSignature.type.style');
    let eSignInitial = getValueByPath(basicForm, 'forms[0].data.setUpYourSignature.initial');
    let eSignTitle = getValueByPath(basicForm, 'forms[0].data.setUpYourSignature.title');
    const [eSignType, setESignType] = useState(eSignTypeContent !== undefined ? eSignTypeContent : '');
    console.log(eSignTypeContent, eSignType)


    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: basicForm?.forms?.[0]?.schemaId,
            data: data
        }
        console.log(temp, data)
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[0]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
                getIsOpen(false)
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
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
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>

                    <p className={`${style.description} ${style.marginTop}`}>CAPManager uses Electronic Signatures for you to sign off on the required forms and documents.</p>
                    <div className={style.eSignConfirmationCard}>
                        <div className={style.confimationHeading}>Your e-Signature on file</div>
                        <div><img src={eSignImg?.fileURL} alt="" /></div>
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
                        <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); updateFunc() }}>UPDATE</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); confirmFunc() }}>KEEP AS IS</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default ESignConfirmationDialog;