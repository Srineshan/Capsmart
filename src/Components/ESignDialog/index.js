import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Classes, Icon, Intent, EditableText } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Pencil from "../../images/pencil.png";
import SignatureCanvas from 'react-signature-canvas';
import { POST, PUT } from '../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';

import style from './index.module.scss'
import CommonSelectField from '../CommonFields/CommonSelectField';

const ESignDialog = ({ children, getIsOpen, tempValue, baseKey, applicationId, basicForm, setBasicForm }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [selectedESignFormat, setSelectedESignFormat] = useState('DRAW');
    const [selectedESignTypeStyle, setSelectedESignTypeStyle] = useState('calgary-script-ot');
    const [isShowDrawCanvas, setIsShowDrawCanvas] = useState(false);
    const [eSignType, setESignType] = useState('');
    const [isShowType, setIsShowType] = useState(false);
    const sigCanvas = useRef({});
    const [match, setMatch] = useState([]);
    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    // useEffect(() => {
    //     console.log(tempValue)
    // }, tempValue)

    const base64ToUint8Array = (base64) => {
        var binaryString = atob(base64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    const getImgBlob = async (dataURL) => {
        return base64ToUint8Array(dataURL.replace(/^data:image\/\w+;base64,/, ''));
    };

    const saveSignature = async () => {
        if (selectedESignFormat === 'DRAW') {
            const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
            console.log(dataURL, dataURL.match(/^data:image\/(\w+);base64,/));
            setMatch(dataURL.match(/^data:image\/(\w+);base64,/))
            let blobFormat = getImgBlob(dataURL);
            let fileName = {
                "fileName": `signature.${match[1]}`
            };
            const blob = new Blob([blobFormat], { type: `image/${match[1]}` });
            const formData = new FormData();

            formData.append('files', new Blob([JSON.stringify(fileName)], {
                type: "application/json"
            }));
            formData.append('documents', blob, fileName?.fileName);
            try {
                const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
                SuccessToaster('File Uploaded Successfully');
                console.log(response?.data);
                let temp = tempValue;
                temp[baseKey].file = response?.data;
                handleSubmitApplicationReq(temp)
            } catch (error) {
                ErrorToaster('File Upload Failed');
                console.error(error);
                return null;
            }
        } else {
            let temp = tempValue;
            if (temp[baseKey].type === undefined) {
                temp[baseKey].type = {}
            }
            temp[baseKey].type.text = eSignType;
            temp[baseKey].type.style = selectedESignTypeStyle;
            handleSubmitApplicationReq(temp)
        }
    };

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
                        <div className={style.heading}>Adopt Your Electronic Signature</div>
                        <div className={style.displayInRow}>
                            <p className={`${style.dateAndTimeTextStyle} ${style.marginLeft}`}>Mm/Dd/Yyyy</p>
                            <p className={`${style.dateAndTimeTextStyle} ${style.marginLeft}`}>00:00</p>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>

                    <p className={`${style.description} ${style.marginTop}`}>Cap Smart uses Electronic Signatures to for you to sign off on your required forms. Draw or type your signature below.</p>
                    <div className={`${style.displayInRow} ${style.marginTop}`}>
                        <div>
                            <div className={`${style.drawOrTypeTextStyle}`} onClick={() => { setSelectedESignFormat('DRAW') }}> DRAW</div>
                            <div className={selectedESignFormat === 'DRAW' ? style.drawOrTypeUnderline : ''}></div>
                        </div>
                        <div>
                            <div className={`${style.drawOrTypeTextStyle} ${style.marginLeft}`} onClick={() => { setSelectedESignFormat('TYPE') }}> TYPE</div>
                            <div className={`${selectedESignFormat === 'TYPE' ? style.drawOrTypeUnderline : ''} ${style.marginLeft}`}></div>
                        </div>
                    </div>
                    {selectedESignFormat === 'DRAW' ? (
                        <div className={`${style.eSignBox} ${style.marginTop} ${style.cursorPointer}`} onClick={!isShowDrawCanvas ? () => setIsShowDrawCanvas(true) : () => { }}>
                            {!isShowDrawCanvas ? (
                                <div className={style.verticalAlignCenter}>
                                    <div>
                                        <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter}`} />
                                        <div className={style.signBottomBorder}></div>
                                    </div>
                                </div>
                            ) : (
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    penColor='black'
                                    canvasProps={{
                                        // width: 500,
                                        // height: 200,
                                        className: style.signatureCanvas
                                    }}
                                />

                            )}
                        </div>
                    ) : (
                        <div className={`${style.eSignBox} ${style.marginTop}`} onClick={!isShowType ? () => setIsShowType(true) : () => { }}>
                            {/* {!isShowType ? (
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.cursorPointer}>
                                        <div className={`${style.italicStyle} ${style.justifyCenter}`}>I</div>
                                        <div className={style.signBottomBorder}></div>
                                    </div>
                                </div>
                            ) : ( */}
                            <div>
                                <div className={`${style.justifyCenter} ${style.verticalAlignCenter} ${style.editableTextHeight}`}>
                                    <EditableText value={eSignType} placeholder='I' className={`${style.typeInputStyle} ${style.typeTextStyle}`} style={{ fontFamily: `${selectedESignTypeStyle}` }} onChange={(e) => setESignType(e)} />
                                </div>
                                <div className={style.typeFieldStyle}>
                                    <CommonSelectField
                                        value={selectedESignTypeStyle}
                                        onChange={(e) => { setSelectedESignTypeStyle(e.target.value); }}
                                        className={`${style.fullWidth}`}
                                        firstOptionLabel={
                                            "Change Style"
                                        }
                                        firstOptionValue={""}
                                        valueList={['calgary-script-ot', 'miss-fitzpatrick', 'mr-sandsfort', 'fave-script-pro']}
                                        labelList={['Calgary-Script-Ot', 'Miss-Fitzpatrick', 'Mr-Sandsfort', 'Fave-Script-Pro']}
                                        disabledList={['calgary-script-ot', 'miss-fitzpatrick', 'mr-sandsfort', 'fave-script-pro']?.map((data) => false)}
                                    />
                                </div>
                            </div>
                            {/* )} */}
                        </div>
                    )}
                    <div className={style.marginTop}>{children}</div>
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { setIsContinue(true); clearSignature() }}>CANCEL</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { setIsContinue(true); saveSignature() }}>ADOPT FOR e-SIGN</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default ESignDialog;