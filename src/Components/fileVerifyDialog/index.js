import React, { useState, useCallback, useRef, createRef, useEffect } from 'react';
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import style from './index.module.scss';
import LoadingScreen from "../LoadingScreen";

const FileVerifyDialog = ({ getIsOpen, file, fileArray, setFileArray, selectedFileIndex, setSelectedFileIndex, selectedRowTableName, selectedFormId, setForm }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const [applicationId, setApplicationId] = useState(sessionStorage.getItem("applicationId"));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (file?.fileURL) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [file?.fileURL]);

    useEffect(() => {
        console.log("filesssssssssssssssss", file);
        console.log("filesssssssssssssssss1", fileArray);
        console.log("filesssssssssssssssss2", selectedFileIndex);
        console.log("filesssssssssssssssss3", setSelectedFileIndex);
        console.log("filesssssssssssssssss5", selectedRowTableName);
        console.log("filesssssssssssssssss6", selectedFormId);
        console.log("filesssssssssssssssss7", setForm);
    }, []);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    //Looping Condition

    // const handlePrevious = () => {
    //     if (selectedFileIndex > 0) {
    //         setSelectedFileIndex(selectedFileIndex - 1);
    //     } else {
    //         setSelectedFileIndex(fileArray.length - 1);
    //     }
    // };

    // const handleNext = () => {
    //     if (selectedFileIndex < fileArray.length - 1) {
    //         setSelectedFileIndex(selectedFileIndex + 1);
    //     } else {
    //         setSelectedFileIndex(0);
    //     }
    // };

    const handlePrevious = () => {
        if (selectedFileIndex > 0) {
            setIsLoading(true); 
            setSelectedFileIndex(selectedFileIndex - 1);
            setIsLoading(false); 
        }
    };

    const handleNext = () => {
        if (selectedFileIndex < fileArray.length - 1) {
            setIsLoading(true); 
            setSelectedFileIndex(selectedFileIndex + 1);
            setIsLoading(false); 
        }
    };

    // useEffect(() => {
    //     console.log("1234567:", file);

    //     if (typeof file === "function") {
    //         file();
    //         console.log("123456789:", file);
    //     }
    // }, [file]);

    // const reactToPrintContent = useCallback(() => {
    //     return componentRef.current;
    // }, [componentRef.current]);

    // const handlePrintClick = useReactToPrint({
    //     content: reactToPrintContent,
    //     documentTitle: "Staff Application",
    //     removeAfterPrint: true,
    // });

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(`application-management-service/application/${applicationId}`);
        setForm(basicForm);
    };

    const handleDocVerify = async () => {
        let temp = {
            formId: selectedFormId,
            contentToVerify: "DATA",
            tableName: selectedRowTableName,
            rowId: file?.rowId,
        };
        await PUT(`application-management-service/application/${applicationId}/verifyForm`, temp)
            .then((response) => {
                console.log("success");
                // Update the fileArray with the verified status
                const updatedFileArray = fileArray.map((record, index) => {
                    if (index === selectedFileIndex) {
                        return { ...record, isVerified: true };
                    }
                    return record;
                });
                setFileArray(updatedFileArray);
            })
            .catch((error) => {
                console.log(error);
            });
        getPreApplication();
    };

    return (
        <>
         {isLoading && (
            <div className={style.loadingOverlay}>
                <LoadingScreen />
            </div>
        )}
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog}  ${isExpanded ? style.eSignDialogBackground1 : style.eSignDialogBackground} ${isExpanded ? style.expandedDialog : ''}`} canOutsideClickClose={false} canEscapeKeyClose={false} ref={PDFRef}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Verification of Data & Documents</div>
                        <div className={style.displayInRow}>
                            {/* <div
                                className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight}`}
                            >
                                <PrintOutlinedIcon
                                    sx={{
                                        fontSize: isPrintClicked ? 20 : 25,
                                        color: isPrintClicked ? "#fff" : "#06617A",
                                    }}
                                    onClick={handlePrintClick}
                                />
                            </div> */}
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer}`}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <div className={`${style.textStyle}`}>Verification of this section requires you to verify the associated Data & Documents ({fileArray.length})</div>
                    <div className={`${style.spaceBetween} ${style.marginTop}`}>
                        <div className={`${style.purpleButton} ${selectedFileIndex === 0 ? style.disabledButton : style.cursorPointer} ${selectedFileIndex === 0 ? 'not-allowed' : ''}`} onClick={handlePrevious}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                PREVIOUS
                            </div>
                        </div>
                        <div className={`${style.purpleButton} ${selectedFileIndex === fileArray.length - 1 ? style.disabledButton : style.cursorPointer}`} onClick={handleNext}>
                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                NEXT
                            </div>
                        </div>
                    </div>
                    <div className={` ${style.spaceBetween} ${style.centerALign} ${style.titleBackgroundColorStyle} ${style.marginTop}`}>
                        <div className={`${style.heading}`}>{file?.documentType}</div>
                        <div className={`${style.heading}`}>Document {selectedFileIndex + 1} of {fileArray.length}</div>
                    </div>
                        {!isLoading && (
                    <div className={style.marginTop}>
                        {file?.fileType === 'application/pdf' ? (
                            <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="600px" onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }}></iframe>
                        ) : file?.fileType?.startsWith("image/") ? (
                            <img src={file?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} />
                        ) :  <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="600px" onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }}></iframe>}
                    </div>
                        )}
                    <div className={`${style.spaceBetween} ${style.marginTop}`}>
                        <div className={`${style.CloseButton} ${style.cursorPointer}`} onClick={() => { getIsOpen(false); }}>
                                <div className={`${style.closeTextStyle} ${style.alignCenter}`}>
                                CLOSE
                                </div>
                            </div>
                    {file?.isVerified === true ? (
                            <div className={`${style.greenButtonVerify} ${style.cursorPointer}`}>
                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                    VERIFIED
                                </div>
                            </div>
                        ) : (
                            <div className={`${style.purpleButtonVerify} ${style.cursorPointer}`} onClick={handleDocVerify}>
                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                    VERIFY
                                </div>
                            </div>
                        )}
                        </div>
                </div>
            </div>
        </Dialog>
        </>
    );
};

export default FileVerifyDialog;