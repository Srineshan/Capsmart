import React, { useState, useRef } from 'react';
import style from './index.module.scss';
import { PUT } from '../../dataSaver';
import { Classes, Dialog } from '@blueprintjs/core';
import CommonPdfViewer from '../../../Components/CommonPdfViewer';
import { ErrorToaster2, SuccessToaster2 } from '../../../utils/toaster';
import CancelIcon from '@mui/icons-material/Cancel';
import CommonMultiSelectField from '../../../Components/CommonFields/CommonMultiSelectField';
import { Tooltip } from '@mui/material';

const PNPManagerStep3 = ({ setStep2, setStep3, setStep4, mdValue, getMD, setMdValue, setSelectedMdId }) => {
    const fileInputRef = useRef(null);
    const [isSaveInProgressDialog, setIsSaveInProgressDialog] = useState(false);
    const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState([]);
    const [selectedControlls, setSelectedControlls] = useState([]);
    const [frameworkList, setFrameworkList] = useState([]);
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
                SuccessToaster2('P&P Uploaded Successfully');
                console.log(response?.data)
                setStep4(false)
                getMD(response?.data);
            })
            .catch(error => {
                ErrorToaster2('P&P Upload Failed');
            })

    }
    const handleSaveInProgress = async () => {
        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${mdValue?.id}/saveInprogress`, 'step2')
            .then(response => {
                SuccessToaster2('P&P Saved Successfully');
                console.log(response?.data)
                setStep4(false)
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

    const handleFrameworkSelect = (id) => {
        console.log(id)
        if (Array.isArray(id)) {
            const newIds = id.filter(item => !selectedFramework?.includes(item));
            if (newIds?.length > 0) {
                setSelectedFramework(prev => [...prev, ...newIds]);
            }
        }
    }

    const handleControllsSelect = (id) => {
        console.log(id)
        if (Array.isArray(id)) {
            const newIds = id.filter(item => !selectedControlls?.includes(item));
            if (newIds?.length > 0) {
                setSelectedControlls(prev => [...prev, ...newIds]);
            }
        }
    }
    console.log(mdValue)
    return (
        <div className={style.stepsBackground}>
            <div className={`${style.stepHeader} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.stepNumber} ${style.marginLeft10}`}>Step 3</div>
                    <div className={`${style.stepHeading} ${style.marginLeft20}`}>Link Compliance Framework Controlls</div>
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
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep2(true); setStep3(false) }} >BACK</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Save In-Progress'>
                            <button className={`${style.outlinedButtonMd} ${style.marginRight} `} onClick={() => { setIsSaveInProgressDialog(true) }} >SAVE IN PROGRESS</button>
                        </Tooltip>
                        <Tooltip arrow title='Click to Continue'>
                            <button className={`${style.buttonStyleMd} ${style.marginRight} `} onClick={() => { setStep3(false); setStep4(true) }} >CONTINUE</button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className={style.stepContentCard}>
                <div className={`${style.stepsTitleBar} ${style.verticalAlignCenter}`}>
                    <div className={style.stepsTitleText}>Link Compliance Framework Controlls to your P&P</div>
                </div>
                <div className={`${style.margin20}`}>
                    <div>
                        <div className={style.labelStyle}>Framework*</div>
                        <div className={style.marginTop10}>
                            <CommonMultiSelectField
                                value={selectedFramework}
                                onChange={(e) => handleFrameworkSelect(e.target.value)}
                                className={style.fullWidth}
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={[]}
                                labelList={[]}
                                disabledList={[]}
                                required={true}
                                label={'Department'}
                            />
                        </div>
                        <div>
                            <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                {selectedFramework?.map(data => {
                                    return (
                                        <div className={`${style.chips} ${style.displayInRow}`}>
                                            <div>{frameworkList?.filter(deptData => data === deptData?.id)?.[0]?.departmentName?.name}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                                onClick={() => setSelectedFramework(selectedFramework?.filter(innerData => innerData !== data))}
                                            ><CancelIcon sx={{ color: '#168E0D', fontSize: 20 }} /></div></div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={style.labelStyle}>Controlls*</div>
                        <div className={style.marginTop10}>
                            <CommonMultiSelectField
                                value={selectedControlls}
                                onChange={(e) => handleControllsSelect(e.target.value)}
                                className={style.fullWidth}
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={[]}
                                labelList={[]}
                                disabledList={[]}
                                required={true}
                                label={'Division / Service Area'}
                            />
                        </div>
                        <div>
                            <div className={`${style.chipsContainer} ${style.marginTop10}`}>
                                {selectedControlls?.map(data => {
                                    return (
                                        <div className={`${style.chips} ${style.displayInRow}`}>
                                            <div>{`${selectedControlls?.filter(divisionData => data === divisionData?.id)?.[0]?.department?.departmentName?.name} - ${selectedControlls?.filter(divisionData => data === divisionData?.id)?.[0]?.name}`}</div> <div className={`${style.verticalAlignCenter} ${style.marginLeft10} ${style.cursorPointer}`}
                                                onClick={() => setSelectedControlls(selectedControlls?.filter(innerData => innerData !== data))}
                                            ><CancelIcon sx={{ color: '#168E0D', fontSize: 20 }} /></div></div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
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

export default PNPManagerStep3;