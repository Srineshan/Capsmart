import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Classes, Icon, Intent, EditableText } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Pencil from "../../images/pencil.png";
import SignatureCanvas from 'react-signature-canvas';
import { POST, PUT, GET } from '../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import style from './index.module.scss'
import CommonSelectField from '../CommonFields/CommonSelectField';
import { getValueByPath } from '../../utils/formatting';
import { useParams } from 'react-router-dom';

const ESignDialog = ({ children, getIsOpen, tempValue, baseKey, applicationId, basicForm, setBasicForm, getPreApplication }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [selectedESignFormat, setSelectedESignFormat] = useState('DRAW');
    const [isShowDrawCanvas, setIsShowDrawCanvas] = useState(false);
    const [isShowType, setIsShowType] = useState(false);
    const sigCanvas = useRef({});
    const contentRef = useRef(null);
    const [applicantProfile, setApplicantProfile] = useState();
    const [formIndex, setFormIndex] = useState();
    const { section, step } = useParams()
    let eSignImg = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.file`);
    let eSignTypeContent = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.type.text`);
    let eSignTypeContentStyle = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.type.style`);
    const [selectedESignTypeStyle, setSelectedESignTypeStyle] = useState(eSignTypeContentStyle !== undefined ? eSignTypeContentStyle : 'calgary-script-ot');
    const [eSignType, setESignType] = useState(eSignTypeContent !== undefined ? eSignTypeContent : '');
    const [eSignImgState, setESignImgState] = useState(eSignImg !== undefined ? eSignImg : '');
    const [signatureData, setSignatureData] = useState(null);


    console.log(eSignTypeContent, eSignType)
    const clearSignature = () => {
        if (isShowDrawCanvas) {
            sigCanvas.current.clear();
        }
    };

    useEffect(() => {
        setESignType(eSignTypeContent !== undefined ? eSignTypeContent : '')
    }, [eSignTypeContent])

    useEffect(() => {
        setESignImgState(eSignImg !== undefined ? eSignImg : '')
    }, [eSignImg])

    useEffect(() => {
        if (contentRef.current && contentRef.current.innerHTML !== eSignType && eSignType !== null) {
            contentRef.current.innerHTML = eSignType;
        }
    }, [eSignType, selectedESignFormat]);

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])


    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        setApplicantProfile(profile)
    }

    // useEffect(() => {
    //     console.log(tempValue)
    // }, tempValue)

    const dataURLToBlob = (dataURL) => {
        const [header, data] = dataURL.split(',');
        const mime = header.split(':')[1].split(';')[0];
        const binary = atob(data);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mime });
    }


    const handleContentChange = () => {
        console.log(contentRef.current.innerHTML)
        if (contentRef.current) {
            setESignType(contentRef.current.innerHTML);
        }
    };

    const saveSignature = async () => {
        if (selectedESignFormat === 'DRAW' && isShowDrawCanvas) {
            const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
            let blobFormat = dataURLToBlob(dataURL)
            let fileName = {
                "fileName": `signature.png`
            };
            const blob = new Blob([blobFormat], { type: `image/png` });
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
        let data = applicantProfile;
        data.signature.updated = true;
        await PUT(`application-management-service/application/${applicationId}/profile`, data)
            .then(response => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            });
    };

    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: data
        }
        console.log(temp, data)
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                getPreApplication()
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

                    <p className={`${style.description} ${style.marginTop}`}>CAPSmart uses Electronic Signatures for you to sign off on the required forms and documents that are part of this application. Draw or type your signature below to set it up for use:</p>
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
                            {(eSignImgState !== undefined && !isShowDrawCanvas && basicForm?.forms?.[formIndex]?.data !== null) ? (
                                <div>
                                    <img src={eSignImgState?.fileURL} alt="ESign" className={style.eSignImg} />
                                </div>
                            ) : !isShowDrawCanvas ? (
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
                                {/* <div className={`${style.justifyCenter} ${style.verticalAlignCenter} ${style.editableTextHeight}`}>
                                    <EditableText value={eSignType} placeholder='I' className={`${style.typeInputStyle} ${style.typeTextStyle}`}
                                        style={{
                                            fontFamily: selectedESignTypeStyle,
                                            padding: "20px",
                                            marginTop: "10px",
                                            fontSize: "44px",
                                            textAlign: 'center'
                                        }} onChange={(e) => setESignType(e)} />
                                </div> */}
                                <div
                                    contentEditable
                                    onInput={handleContentChange}
                                    // placeholder='Enter Here'
                                    ref={contentRef}
                                    style={{
                                        fontFamily: selectedESignTypeStyle,
                                        padding: "20px",
                                        marginTop: "10px",
                                        fontSize: "44px",
                                        textAlign: 'center'
                                    }}
                                >
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
                        <div className={`${style.saveInProgress}`} onClick={() => { setIsContinue(true); getIsOpen(false) }}>CANCEL</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { setIsContinue(true); saveSignature() }}>ADOPT FOR e-SIGN</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default ESignDialog;