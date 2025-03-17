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
import Tooltip from "@mui/material/Tooltip";
import CommonTextField from '../CommonFields/CommonTextField';
import CommonSelectField from '../CommonFields/CommonSelectField';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonDropZone from '../CommonFields/CommonDropZone';

const FileVerifyDialog = ({ getIsOpen, file, fileArray, setFileArray, selectedFileIndex, setSelectedFileIndex, selectedRowTableName, selectedFormId, setForm, handleStepsVerify, setHasVerificationAttempted }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const [applicationId, setApplicationId] = useState(sessionStorage.getItem("applicationId"));
    const [isLoading, setIsLoading] = useState(false);
    const [fields, setFields] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [documentStatus, setDocumentStatus] = useState('')
    const [reasonForReplacingDocument, setReasonForReplacingDocument] = useState('')
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

    useEffect(() => {
        getDocument();
    }, [file]);

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


    const getDocument = async () => {
        const { data: response } = await GET(
            `document-management-service/document/${file?.rowId}`
        );
        console.log(response);
        setFields(response?.fields);
        setMetaData(response?.metaData)
    }


    const getPreApplication = async () => {
        const { data: basicForm } = await GET(`application-management-service/application/${applicationId}`);
        setForm(basicForm);
    };

    const changeHandler = async (event) => {
        setIsLoading(true);
        console.log(event, 'Test');

        const formData = new FormData();
        let fileNameArray = [];
        event?.forEach(file => {
            fileNameArray.push({ "fileName": file?.name });
            formData.append('documents', file); // Append each file individually
        });

        formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
            type: "application/json"
        }));
        console.log(fileNameArray)
        try {
            const response = await POST(`application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${true}`, formData);
            setIsLoading(false);
            return response?.data;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            return null;
        }
    };

    const handleDocVerify = async () => {
        let verificationStatus = file?.isVerified ? "UNVERIFIED" : "VERIFIED";

        let temp = {
            formId: selectedFormId,
            contentToVerify: "DATA",
            tableName: selectedRowTableName,
            rowId: file?.rowId,
        };

        await PUT(`application-management-service/application/${applicationId}/verifyForm?verificationStatus=${verificationStatus}`, temp)
            .then((response) => {
                console.log("success");

                // Update the fileArray with the correct verified status
                const updatedFileArray = fileArray.map((record, index) => {
                    if (index === selectedFileIndex) {
                        return { ...record, isVerified: !file?.isVerified };
                    }
                    return record;
                });

                setFileArray(updatedFileArray);

                const allVerified = updatedFileArray.every(file => file.isVerified);

                if (allVerified) {
                    console.log("All files are verified, calling handleStepsVerify...");
                    handleStepsVerify(selectedFormId);
                }

                setHasVerificationAttempted(true)
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
                        <div className={`${style.textStyle}`}>Your required to verify the {fileArray.length} associated Documents that are part of this application </div>
                        <div className={` ${style.spaceBetween} ${style.centerALign} ${style.titleBackgroundColorStyle} ${style.marginTop}`}>
                            <div className={`${style.heading}`}>{file?.documentType}</div>
                            <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                                <div className={style.reduceMargin}>
                                    <CommonSelectField
                                        value={documentStatus}
                                        onChange={(e) => setDocumentStatus(e.target.value)}
                                        className={style.documentStatusWidth}
                                        firstOptionLabel={"Select Document Status"}
                                        firstOptionValue={""}
                                        valueList={['Accept Alternate Document Provided', 'Reject Alternate Document Provided', 'Reject and replace Document Provided']}
                                        labelList={['Accept Alternate Document Provided', 'Reject Alternate Document Provided', 'Reject and replace Document Provided']}
                                        disabledList={['Accept Alternate Document Provided', 'Reject Alternate Document Provided', 'Reject and replace Document Provided']?.map(data => false)}
                                    />
                                </div>
                                <div className={`${style.heading} ${style.marginLeft}`}>Document {selectedFileIndex + 1} of {fileArray.length}</div>
                            </div>
                        </div>
                        {documentStatus === "Reject and replace Document Provided" && (
                            <div className={style.marginTop10}>
                                <div className={style.lableStyle}>Reason for Replacing Document that could not be identified (Mandatory)</div>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={reasonForReplacingDocument}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setReasonForReplacingDocument(data);
                                    }}
                                    onReady={(editor) => {
                                        editor.editing.view.change(
                                            (writer) => {
                                                writer.setStyle(
                                                    "height",
                                                    "80px",
                                                    editor.editing.view.document.getRoot()
                                                );
                                            }
                                        );
                                    }}
                                    config={{
                                        placeholder:
                                            "Insert any privilege competency and qualification information...",
                                        toolbar: {
                                            shouldNotGroupWhenFull: true,
                                            sticky: true,
                                            items: [
                                                'undo', 'redo',
                                                '|',
                                                'heading',
                                                '|',
                                                'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                '|',
                                                'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                                '|',
                                                'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                            ],
                                        },
                                        autoGrow: false,
                                    }}
                                />
                                <div className={`${style.marginTop10} `}>
                                    <Tooltip arrow title="Add the reason to enable document replace" followCursor
                                        {...(reasonForReplacingDocument !== "" && { open: false })}>
                                        <CommonDropZone
                                            title={"Replace This Document"}
                                            description={
                                                "Upload your files or drag & drop from your document cabinet"
                                            }
                                            changeHandler={changeHandler}
                                            files={[]}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                        {/* {!isLoading && (
                    <div className={style.marginTop}>
                        {file?.fileType === 'application/pdf' ? (
                            <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="300px" onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }}></iframe>
                        ) : file?.fileType?.startsWith("image/") ? (
                            <img src={file?.fileURL} alt="" width="100%" height="300px" className={style.objectFitContain} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} />
                        ) :  <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="300px" onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }}></iframe>}
                    </div>
                        )}
                    <div className={`${style.spaceBetween} ${style.marginTop}`}>
                        <div className={`${style.CloseButton} ${style.cursorPointer}`} onClick={() => { getIsOpen(false); }}>
                                <div className={`${style.closeTextStyle} ${style.alignCenter}`}>
                                CLOSE
                                </div>
                            </div>
                        {file?.isVerified ? (
                            <div className={`${style.displayInRow} ${style.cursorPointer}`}>
                                <Tooltip title="Click To Revert Verification">
                                <div 
                                    className={`${style.greenButtonVerify} ${style.buttonGreyTextStyle} ${style.alignCenter}`} 
                                    onClick={handleDocVerify}
                                >
                                    VERIFIED
                                </div>
                                </Tooltip>
                                <div 
                                    className={`${style.purpleButton} ${selectedFileIndex === fileArray.length - 1 ? style.disabledButton : style.cursorPointer}`} 
                                    onClick={handleNext}
                                >
                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        NEXT
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`${style.displayInRow} ${style.cursorPointer}`}>
                                <Tooltip title="Click To Verify">
                                <div 
                                    className={`${style.purpleButtonVerify} ${style.buttonGreyTextStyle} ${style.alignCenter}`}
                                    onClick={handleDocVerify}
                                >
                                    VERIFY
                                </div>
                                </Tooltip>
                                <div 
                                    className={`${style.purpleButton} ${selectedFileIndex === fileArray.length - 1 ? style.disabledButton : style.cursorPointer}`} 
                                    onClick={handleNext}
                                >
                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        NEXT
                                    </div>
                                </div>
                            </div>
                        )}
                        </div> */}
                        <div className={style.gridContainer}>
                            <div className={style.fileColumn}>
                                {!isLoading && (
                                    <div className={style.height}>
                                        {file?.fileType === 'application/pdf' ? (
                                            <iframe src={`${file?.fileURL}#toolbar=0`} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} className={style.filePreview}></iframe>
                                        ) : file?.fileType?.startsWith("image/") ? (
                                            <img src={file?.fileURL} alt="" className={style.filePreview} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} />
                                        ) : <iframe src={`${file?.fileURL}#toolbar=0`} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} className={style.filePreview}></iframe>}
                                    </div>
                                )}
                            </div>
                            <div className={`${style.detailsColumn} ${fields?.length > 6 ? style.expanded : ""}`}>
                                <div className={style.extractedFields}>
                                    <div className={`${style.twoCol}`}>
                                        {fields?.map((field, index) => (
                                            <CommonTextField
                                                key={index}
                                                value={metaData !== null ? metaData[field?.name] !== undefined ? metaData[field?.name] : "" : ""}
                                                className={style.fullWidth}
                                                maxLength={50}
                                                readOnly={true}
                                                label={field.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className={style.buttonContainer}>
                                    <div className={`${style.purpleButton} ${selectedFileIndex === 0 ? style.disabledButton : style.cursorPointer} ${selectedFileIndex === 0 ? 'not-allowed' : ''}`} onClick={handlePrevious}>
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                            PREVIOUS
                                        </div>
                                    </div>
                                    <div
                                        className={`${style.purpleButton} ${selectedFileIndex === fileArray?.length - 1 ? style.disabledButton : style.cursorPointer}`}
                                        onClick={handleNext}
                                    >
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                            NEXT
                                        </div>
                                    </div>
                                    {file?.isVerified ? (
                                        <Tooltip title="Click To Revert Verification">
                                            <div
                                                className={`${style.greenButtonVerify}`}
                                                onClick={handleDocVerify}
                                            >
                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                    VERIFIED
                                                </div>
                                            </div>
                                        </Tooltip>) : (
                                        <Tooltip title="Click To Verify">
                                            <div
                                                className={`${style.purpleButtonVerify}`}
                                                onClick={() => {
                                                    handleDocVerify();
                                                    if (selectedFileIndex === fileArray?.length - 1) {
                                                        setTimeout(() => getIsOpen(false), 500);
                                                    } else {
                                                        handleNext();
                                                    }
                                                }}
                                            >
                                                <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                    VERIFY
                                                </div>
                                            </div>
                                        </Tooltip>)}
                                    <div className={`${style.CloseButton} ${style.cursorPointer}`} onClick={() => { getIsOpen(false); }}>
                                        <div className={`${style.closeTextStyle} ${style.alignCenter}`}>
                                            CLOSE
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default FileVerifyDialog;