import React, { useState, useRef } from 'react';
import style from './index.module.scss';
import { PUT } from '../../dataSaver';
import { Classes, Dialog } from '@blueprintjs/core';
import CommonPdfViewer from '../../../Components/CommonPdfViewer';
import { ErrorToaster2, SuccessToaster2 } from '../../../utils/toaster';
import { Tooltip } from '@mui/material';

const PNPManagerStep2 = ({ setStep1, setStep2, setStep3, mdValue, getMD, setMdValue, setSelectedMdId }) => {
    const fileInputRef = useRef(null);
    const [isSaveInProgressDialog, setIsSaveInProgressDialog] = useState(false);
    const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);
    const handleReplaceCopy = () => {
        fileInputRef.current.click();
    }

    const handleUploadFile = async (event) => {
        const file = event.target.files[0];
        console.log('Selected file:', file);
        if (file) {
            console.log('Selected file:', file);
            handleContinue(file)
        }
    };

    const handleContinue = async (file) => {
        const formData = new FormData();
        console.log(mdValue)
        let data = mdValue;
        data.file = {
            fileName: file?.name,
        }

        formData.append(
            "metaDataDTO",
            new Blob([JSON.stringify(data)], {
                type: "application/json",
            })
        );
        formData.append("file", file);

        console.log(data)

        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}`, formData)
            .then(response => {
                SuccessToaster2('PNP Uploaded Successfully');
                console.log(response?.data)
                setStep3(false)
                getMD(response?.data);
            })
            .catch(error => {
                ErrorToaster2('PNP Upload Failed');
            })

    }
    const handleSaveInProgress = async () => {
        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/saveInprogress`, 'step2')
            .then(response => {
                SuccessToaster2('PNP Saved Successfully');
                console.log(response?.data)
                setStep2(false)
            })
            .catch(error => {
            })
    }
    const handleClose = () => {
        setMdValue();
        setSelectedMdId('');
    }

    const handleConfirmReplace = () => {
        setIsConfirmationDialog(false);
        handleReplaceCopy();
    }
    console.log(mdValue)
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 2</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Review Policy & Procedure</div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadFile}
                    style={{ display: "none" }} // Hide the actual file input
                />
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <Tooltip arrow title='Click to go Back'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep1(true); setStep2(false) }} >BACK</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Replace Document'>
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => setIsConfirmationDialog(true)} >REPLACE DOCUMENT</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Save In-Progress'>
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setIsSaveInProgressDialog(true) }} >SAVE IN PROGRESS</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Continue'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep2(false); setStep3(true) }} >CONTINUE</button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Policy & Procedure Meta Data</div>
                </div>
                <div className={style.marginTop20}>
                    <iframe src={`${mdValue?.file?.fileURL}#toolbar=1&view=fitH`}
                        style={{ height: "calc(100vh - 200px)", width: "100%", border: "none" }}></iframe>
                    {/* <CommonPdfViewer pdfurl={mdValue?.file?.fileURL} /> */}
                </div>
            </div>
            <Dialog isOpen={isConfirmationDialog} onClose={() => setIsConfirmationDialog(false)} className={`${style.addMDDialogBackground} ${style.confirmationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Confirm Document Replacement</div>
                    </div>
                    <div className={`${style.marginTop10} `}>
                        <div className={style.labelStyle}>Are you sure you want to replace the existing Policy & Procedure document by uploading a new one?</div>
                    </div>

                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20} `}>
                            <button className={`${style.outlinedButton} `} onClick={() => setIsConfirmationDialog(false)} >CANCEL</button>
                            <button className={`${style.buttonStyle} ${style.marginLeft10} `} onClick={() => handleConfirmReplace()} >{'YES, UPLOAD'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
            <Dialog isOpen={isSaveInProgressDialog} onClose={() => setIsSaveInProgressDialog(false)} className={`${style.addMDDialogBackground} ${style.confirmationDialog} `}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.attestationDialogHeaderCard}>
                        <div className={`${style.attestationDialogTitle} ${style.padding20} `}>Confirm Save In-Progress</div>
                    </div>
                    <div className={`${style.marginTop10} `}>
                        <div className={style.labelStyle}>Your current progress will be saved. You can return and continue from where you left off.</div>
                    </div>

                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20} `}>
                            <button className={`${style.outlinedButtonWithBiggerWidth} `} onClick={() => setIsSaveInProgressDialog(false)} >CANCEL</button>
                            <button className={`${style.buttonStyleWithBiggerWidth} ${style.marginLeft10} `} onClick={() => { handleSaveInProgress() }} >{'SAVE & CONTINUE LATER'}</button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default PNPManagerStep2;