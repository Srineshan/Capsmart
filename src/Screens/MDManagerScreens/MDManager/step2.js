import React, { useState, useRef } from 'react';
import style from './index.module.scss';
import { PUT } from '../../dataSaver';
import CommonPdfViewer from '../../../Components/CommonPdfViewer';
import { ErrorToaster2, SuccessToaster2 } from '../../../utils/toaster';

const MDManagerStep2 = ({ setStep1, setStep2, setStep3, mdValue, getMD, setMdValue, setSelectedMdId }) => {
    const fileInputRef = useRef(null);
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

        await PUT(`medical-directive-service/medicalDirectives/${mdValue?.id}`, formData)
            .then(response => {
                SuccessToaster2('MD Uploaded Successfully');
                console.log(response?.data)
                setStep3(false)
                getMD(response?.data);
            })
            .catch(error => {
                ErrorToaster2('MD Upload Failed');
            })

    }
    const handleClose = () => {
        setMdValue();
        setSelectedMdId('');
    }
    console.log(mdValue)
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 2</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Review Medical Directive</div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUploadFile}
                    style={{ display: "none" }} // Hide the actual file input
                />
                <div className={style.displayInRow}>
                    <div className={`${style.spaceBetween}`}>
                        <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep1(true); setStep2(false) }} >BACK</button>
                        <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => handleReplaceCopy()} >REPLACE DOCUMENT</button>
                        <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setStep2(false); handleClose() }} >SAVE IN PROGRESS</button>
                        <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep2(false); setStep3(true) }} >CONTINUE</button>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Medical Directive Meta Data</div>
                </div>
                <div className={style.marginTop20}>
                    <iframe src={`${mdValue?.file?.fileURL}#toolbar=1&view=fitH`}
                        style={{ height: "calc(100vh - 200px)", width: "100%", border: "none" }}></iframe>
                    {/* <CommonPdfViewer pdfurl={mdValue?.file?.fileURL} /> */}
                </div>
            </div>
        </div>
    )
}

export default MDManagerStep2;