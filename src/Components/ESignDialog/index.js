import React, { useRef, useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import Pencil from "../../images/pencil.png";
import SignatureCanvas from 'react-signature-canvas';
import style from './index.module.scss'

const ESignDialog = ({ getIsOpen }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [selectedESignFormat, setSelectedESignFormat] = useState('DRAW');
    const [isShowDrawCanvas, setIsShowDrawCanvas] = useState(false);
    const sigCanvas = useRef({});

    const clearSignature = () => {
        sigCanvas.current.clear();
    };

    const saveSignature = () => {
        const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
        console.log(dataURL); // This is the signature image URL
        // You can also set it to state or send it to a server
    };
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
                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.saveInProgress}`} onClick={() => { setIsContinue(true); clearSignature() }}>CANCEL</div>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { setIsContinue(true); saveSignature() }}>ADOPT FOR e-SIGN</div>
                    </div>
                </div>

            </div>
        </Dialog>
    )
}

export default ESignDialog;