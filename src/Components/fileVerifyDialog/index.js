import React, { useState, useCallback, useRef, createRef, useEffect } from 'react';
import { GET, PUT, POST, TenantID } from "../../Screens/dataSaver";
import { Dialog, Classes, TextArea } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import ArrowDefaultLeft from "../../images/arrowDefaultLeft.png";
import ArrowDefaultRight from "../../images/arrowDefaultRight.png";
import ArrowDisabledLeft from "../../images/arrowDisabledLeft.png";
import ArrowDisabledRight from "../../images/arrowDisabledRight.png";
import ArrowHoverLeft from "../../images/arrowHoverLeft.png";
import ArrowHoverRight from "../../images/arrowHoverRight.png";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
import CommonPhoneField from '../CommonFields/CommonPhoneField';
import CommonDateField from '../CommonFields/CommonDateField';
import { TextField } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useParams } from 'react-router-dom';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import CommonDivider from '../CommonFields/CommonDivider';
import { format } from 'date-fns';
import Cookies from 'universal-cookie';
import jwt from 'jwt-decode';
import FileWithFields from '../FileWithFields';
import { SuccessToaster2 } from '../../utils/toaster';
import { corsUrl } from "../../utils/formatting";
import { Download } from "@mui/icons-material";

const FileVerifyDialog = ({ getIsOpen, file, fileArray, setFileArray, selectedFileIndex, setSelectedFileIndex, selectedRowTableName, selectedFormId, form, setForm, handleStepsVerify, setHasVerificationAttempted, getPreApplicationForReplace,showViewOnly }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    let cookie = new Cookies();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const [applicationId, setApplicationId] = useState(sessionStorage.getItem("applicationId"));
    const [isLoading, setIsLoading] = useState(false);
    const [replaceRowId, setReplaceRowId] = useState('')
    const [fileToDisplay, setFileToDisplay] = useState([]);
    const [fields, setFields] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [fileToDisplayAlternative, setFileToDisplayAlternative] = useState([]);
    const [fieldsAlternative, setFieldsAlternative] = useState([]);
    const [metaDataAlternative, setMetaDataAlternative] = useState({});
    const [documentStatus, setDocumentStatus] = useState('ACCEPT_DOCUMENT');
    const [rejectClarificationType, setRejectClarificationType] = useState('ACCEPT_DOCUMENT');
    const [reasonForReplacingDocument, setReasonForReplacingDocument] = useState('')
    const [calendarStart, setCalendarStart] = useState(false);
    const [changedData, setChangedData] = useState({})
    const [isEdited, setIsEdited] = useState(false);
    const [arrowLeftOnHover, setArrowLeftOnHover] = useState(false);
    const [arrowRightOnHover, setArrowRightOnHover] = useState(false);
    const [rejectSubject, setRejectSubject] = useState('');
    const [rejectClarification, setRejectClarification] = useState('');
    const [showFileWithFields, setShowFileWithFields] = useState(false);
    const pdfUrl = file?.fileURL ? encodeURI(file?.fileURL) : "";
    const pdfAppointmentUrl = file?.file?.fileURL ? encodeURI(file?.file?.fileURL) : "";
    console.log("URLLLLLLLLLLLLLLLLLLL", pdfUrl, file?.documentType);

    const availableDocumentStatus = {
        'ACCEPT_DOCUMENT': 'Accept Document Provided', 'REJECT_DOCUMENT': 'Reject Alternate Document Provided', 'REJECT_AND_REPLACE_DOCUMENT': 'Reject and replace Document Provided'
    }
    useEffect(() => {
        if (file?.fileURL) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [file?.fileURL]);

    console.log("fileVerifyyyyyy", fileArray, selectedFileIndex, selectedRowTableName, selectedFormId, form)

    useEffect(() => {
        setChangedData(metaData);
    }, [metaData])

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

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
        getDocumentAlternative();
    }, [file, showFileWithFields]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };


    // Fetch the new file data when selectedFileIndex changes
    useEffect(() => {
        if (fileArray.length > 0 && selectedFileIndex >= 0 && selectedFileIndex < fileArray.length) {
            getDocument();
        }
    }, [selectedFileIndex, fileArray]);


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

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        sessionStorage.setItem('user', JSON.stringify(userData))
    }

    const getIsOpenFileWithFields = (value) => {
        setShowFileWithFields(value);
    }

    const handlePrevious = () => {
        setReasonForReplacingDocument('')
        setDocumentStatus('')
        setReplaceRowId('')
        setFileToDisplayAlternative([]);
        setFieldsAlternative([]);
        setMetaDataAlternative({});
        if (selectedFileIndex > 0) {
            setIsLoading(true);
            setSelectedFileIndex(prevIndex => prevIndex - 1);
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        setReasonForReplacingDocument('')
        setDocumentStatus('')
        setReplaceRowId('')
        setFileToDisplayAlternative([]);
        setFieldsAlternative([]);
        setMetaDataAlternative({});
        if (selectedFileIndex < fileArray.length - 1) {
            setIsLoading(true);
            setSelectedFileIndex(prevIndex => prevIndex + 1);
            setIsLoading(false);
        }
    };

    const handlePrint = async (url) => {
        if (!url) {
            console.error("No URL provided for printing");
            return;
        }

        try {
            const response = await fetch(corsUrl + encodeURIComponent(url)); // Use the proxy
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);

            // Create a hidden iframe
            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "0px";
            iframe.style.height = "0px";
            iframe.style.border = "none";
            iframe.src = pdfUrl;

            document.body.appendChild(iframe);

            // Wait for the PDF to load, then print
            iframe.onload = () => {
                iframe.contentWindow.print();
            };

            // Cleanup after printing
            setTimeout(() => {
                URL.revokeObjectURL(pdfUrl);
                document.body.removeChild(iframe);
            }, 30000);
        } catch (error) {
            console.error("Error printing the PDF:", error);
        }
    };

    const downloadPDF = async (url, filename) => {
        try {
            const response = await fetch(corsUrl + encodeURIComponent(url));
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Error downloading the PDF:", error);
        }
    };


    const handleDownload = (url, fileName) => {
        if (!url) {
            console.error("No URL provided for download");
            return;
        }
        downloadPDF(url, fileName);
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

    const renderFields = (field, index) => {
        console.log('field', field)
        switch (field.fieldType) {
            case "textbox":
                return (
                    <div key={index}>
                        <CommonTextField
                            value={changedData?.[field?.name]}
                            className={style.fullWidth}
                            onChange={(e) => { setChangedData({ ...changedData, [field.name]: (field.name === "creditOrHours" || field.name === "credits") ? e.target.value !== "" ? parseFloat(e.target.value) : 0 : e.target.value }); setIsEdited(true) }}
                            maxLength={50}
                            placeholder={''}
                            label={field.label}
                            required={false}
                            // type={fieldData.type}
                            warning={false}

                        />
                    </div>
                );
            case "textArea":
                return (
                    <div>
                        <div className={`${style.lableStyle}`}>
                            {field.label}
                        </div>
                        <TextArea
                            value={changedData?.[field?.name]}
                            className={`${style.fullWidth} ${style.marginTop10}`}
                            onChange={(e) => { setChangedData({ ...changedData, [field.name]: e.target.value }); setIsEdited(true) }}
                            maxLength={50}
                            placeholder={''}
                            rows={4}
                        />
                    </div>
                );
            case "cellNumber":
                return (
                    <CommonPhoneField
                        value={changedData?.[field?.name]}
                        className={style.fullWidth}
                        onChange={(e) => { setChangedData({ ...changedData, [field.name]: e.target.value }); setIsEdited(true) }}
                        placeholder={''}
                        label={field.label}
                        required={false}
                        warning={false}
                    />
                );
            case "datepicker":
                return (
                    <CommonDateField
                        className={style.fullWidth}
                        open={calendarStart}
                        onOpen={() => setCalendarStart(true)}
                        onClose={() => setCalendarStart(false)}
                        value={changedData?.[field?.name]}
                        onChange={(newValue) => {
                            setChangedData({ ...changedData, [field.name]: format(new Date(newValue), "yyyy-MM-dd'T'00:00") });
                            setIsEdited(true)
                        }}
                        InputProps={{
                            style: {
                                fontSize: 14,
                                height: 30,
                            },
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: '',
                                }}
                                color={""}
                                fullWidth
                            />
                        )}
                        label={field.label}
                        required={false}
                    />
                );
            default:
                console.log('field', field)
                return (
                    <div key={index}>
                        <CommonTextField
                            value={changedData?.[field?.name]}
                            className={style.fullWidth}
                            onChange={(e) => { setChangedData({ ...changedData, [field.name]: (field.name === "creditOrHours" || field.name === "credits") ? e.target.value !== "" ? parseFloat(e.target.value) : 0 : e.target.value }); setIsEdited(true) }}
                            maxLength={50}
                            placeholder={''}
                            label={field.label}
                            required={false}
                            // type={fieldData.type}
                            warning={false}

                        />
                    </div>
                );
        }
    }


    const getDocument = async () => {
        if (fileArray.length > 0 && selectedFileIndex >= 0 && selectedFileIndex < fileArray.length) {
            const currentFile = fileArray[selectedFileIndex];
            const { data: response } = await GET(
                `document-management-service/document/${currentFile?.rowId}`
            );
            console.log(response);
            setFileToDisplay(response?.file);
            setFields(response?.fields);
            setMetaData(response?.metaData)
        }
    }

    const getDocumentAlternative = async () => {
        if (fileArray.length > 0 && selectedFileIndex >= 0 && selectedFileIndex < fileArray.length) {
            const currentFile = fileArray[selectedFileIndex];
            if (form?.documents?.alternateDocuments[form?.documents?.alternateDocuments?.findIndex(data => data?.replacedByRowId === currentFile?.rowId)]?.rowId !== undefined) {
                const { data: response } = await GET(
                    `document-management-service/document/${form?.documents?.alternateDocuments[form?.documents?.alternateDocuments?.findIndex(data => data?.replacedByRowId === currentFile?.rowId)]?.rowId}`
                );
                console.log(response);
                setFileToDisplayAlternative(response?.file);
                setFieldsAlternative(response?.fields);
                setMetaDataAlternative(response?.metaData)
            }
        }
    }

    const getDocumentFromReplace = async (id) => {
        const { data: response } = await GET(
            `document-management-service/document/${id}`
        );
        console.log(response);
        const updatedFileArray = fileArray.map((fileItem, index) => {
            if (index === selectedFileIndex) {
                return {
                    ...fileItem,
                    rowId: response.id,
                    fileURL: response.fileURL,
                    fileType: response.fileType,
                };
            }
            return fileItem;
        });

        setFileArray(updatedFileArray)
        setReplaceRowId(response?.id)
        setFileToDisplay(response?.file);
        setFields(response?.fields);
        setMetaData(response?.metaData)
    }


    const getPreApplication = async () => {
        const { data: basicForm } = await GET(`application-management-service/application/${applicationId}`);
        setForm(basicForm);
    };

    const handleSubmitRequestForClarification = async () => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        let clarificationRequiredForTitle = form?.forms?.[form?.forms?.findIndex(data => data?.id === selectedFormId)]?.[0]?.title
        console.log(form?.forms?.[form?.forms?.findIndex(data => data?.id === selectedFormId)]?.[0]?.title, form?.forms?.findIndex(data => data?.id === selectedFormId), selectedFormId)
        let temp = {
            clarificationRequiredFor: clarificationRequiredForTitle,
            clarificationTitle: rejectSubject,
            clarificationDescription: rejectClarification,
            clarificationRequiredFrom: "APPLICANT",
            clarificationRequestType: rejectClarificationType,
            clarificationRequestedBy: {
                id: user?.id,
                name: {
                    firstName: user?.name?.firstName,
                    lastName: user?.name?.lastName,
                    middleName: user?.name?.middleName
                },
                email: {
                    officialEmail: user?.email?.officialEmail
                },
                title: {
                    title: user?.title?.title
                }
            },
            attachReferenceDocuments: true,
            formTable: {
                tableName: "table",
                rowId: file?.rowId
            },
        }
        await POST(`application-management-service/application/${applicationId}/form/${selectedFormId}/clarificationRequest`, temp)
            .then(response => {
                console.log("onetwo", response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const changeHandler = async (event) => {
        setIsLoading(true);
        console.log(event, 'Test');

        const formData = new FormData();
        let fileNameArray = [];
        event?.forEach(file => {
            // fileNameArray.push({ "fileName": file?.name });
            formData.append('documents', file); // Append each file individually
        });

        formData.append('files', new Blob([JSON.stringify({ "fileName": event?.[0]?.name })], {
            type: "application/json"
        }));

        formData.append('notes', new Blob([JSON.stringify({ notes: reasonForReplacingDocument })], {
            type: "application/json"
        }));
        console.log(fileNameArray)
        try {
            const response = await POST(`application-management-service/application/${applicationId}/replaceDocument?isLLMRequired=${true}&documentStatus=${documentStatus}&oldDocumentId=${file?.rowId}&documentType=${file?.documentType}`, formData);
            setIsLoading(false);
            await getDocumentFromReplace(response?.data?.id);
            return response?.data;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            return null;
        }
    };

    const handleDocVerify = async () => {
        if ((isEdited || changedData === null) && documentStatus === "REJECT_AND_REPLACE_DOCUMENT") {
            let updateData = {
                data: changedData,
                notes: {
                    notes: ""
                }
            }
            let baseUrl = `application-management-service/application/${applicationId}/updateDocumentData?applicationDocumentId=${replaceRowId}&manuallyUpdated=${true}`;
            await PUT(baseUrl, changedData !== null ? updateData : {})
                .then(response => {
                    console.log(response)
                    getPreApplication()
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        if (documentStatus === "REJECT_DOCUMENT") {
            await handleSubmitRequestForClarification();
        }
        let verificationStatus = file?.isVerified ? "UNVERIFIED" : "VERIFIED";

        let temp = {
            formId: selectedFormId,
            contentToVerify: "DATA",
            tableName: documentStatus === "REJECT_DOCUMENT" ? 'table' : selectedRowTableName,
            rowId: documentStatus === "REJECT_AND_REPLACE_DOCUMENT" ? replaceRowId : file?.rowId,
        };

        await PUT(`application-management-service/application/${applicationId}/verifyForm?verificationStatus=${documentStatus !== "REJECT_DOCUMENT" ? verificationStatus : "UNVERIFIED"}&documentStatus=${documentStatus}`, temp)
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

                // if (documentStatus === "REJECT_AND_REPLACE_DOCUMENT") {
                //     getPreApplicationForReplace(true);
                // }

                const allVerified = updatedFileArray.every(file => file.isVerified);

                if (allVerified) {
                    console.log("All files are verified, calling handleStepsVerify...");
                    handleStepsVerify(selectedFormId);
                }

                setHasVerificationAttempted(true)
               // Determine toaster message
               if (file?.isVerified) {
                SuccessToaster2(`${file?.documentType} Document Verification Reverted Successfully`);
            } else {
                SuccessToaster2(
                    documentStatus === "REJECT_AND_REPLACE_DOCUMENT"
                        ? `${file?.documentType} Document Rejected & Replaced Successfully`
                        : documentStatus === "REJECT_DOCUMENT"
                        ? `${file?.documentType} Document Rejected Successfully`
                        : `${file?.documentType} Document Accepted Successfully`
                );
            }
            

            })
            .catch((error) => {
                console.log(error);
            });

        getPreApplication();
    };

    console.log(fileToDisplay, file)



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
                            <div className={style.heading}>{showViewOnly === true ? 'Data & Documents Verified' : 'Verification of Data & Documents'}</div>
                            <div className={style.displayInRow}>
                                <Tooltip title="Click to Download Document" arrow >
                                    <Download
                                        sx={{
                                            fontSize: 25,
                                            color: "#06617A",
                                        }}
                                        className={style.cursorPointer}
                                        onClick={() => handleDownload(showViewOnly === true ? pdfAppointmentUrl : pdfUrl, file?.documentType)}
                                    />
                                </Tooltip>
                                <div
                                    className={`${isPrintClicked && style.addStyle} ${style.alignCenter} ${style.cursorPointer} ${style.marginRight}`}
                                ><Tooltip title="Click to Print Document" arrow >
                                        <PrintOutlinedIcon
                                            sx={{
                                                fontSize: isPrintClicked ? 20 : 25,
                                                color: isPrintClicked ? "#fff" : "#06617A",
                                            }}
                                            onClick={() => handlePrint(showViewOnly === true ? pdfAppointmentUrl : pdfUrl)}
                                        />
                                    </Tooltip>
                                </div>
                                <Tooltip title="Click to Close" arrow >
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer}`}
                                    onClick={() => { getIsOpen(false) }}
                                />
                                </Tooltip>
                            </div>
                        </div>
                        {showViewOnly !== true && (
                            <div className={`${style.textStyle}`}>You are required to verify the {fileArray?.length} associated Documents that are part of this application </div>
                        )}
                        <div className={` ${style.spaceBetween} ${style.centerALign} ${style.titleBackgroundColorStyle} ${style.marginTop}`}>
                            <div className={`${style.heading}`}>{file?.documentType}</div>
                            <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                                {/* {file?.isVerified ? (
                                    <div></div>
                                ) : (
                                    <div className={style.reduceMargin}>
                                        <CommonSelectField
                                            value={documentStatus}
                                            onChange={(e) => setDocumentStatus(e.target.value)}
                                            className={style.documentStatusWidth}
                                            firstOptionLabel={"Select Document Status"}
                                            firstOptionValue={""}
                                            valueList={['ACCEPT_DOCUMENT', 'REJECT_AND_REPLACE_DOCUMENT']}
                                            labelList={['Accept Document Provided', 'Reject & Replace Document Provided']}
                                            disabledList={['Accept Document Provided', 'Reject & Replace Document Provided']?.map(data => false)}
                                        />
                                    </div>
                                )} */}
                                <div className={` ${selectedFileIndex === 0 ? style.cursorNotAllowed : style.cursorPointer} ${selectedFileIndex === 0 ? 'not-allowed' : ''}`} onClick={handlePrevious}>
                                    <div className={`${style.alignCenter}`} onFocus={() => setArrowLeftOnHover(true)} onBlur={() => setArrowLeftOnHover(false)}>
                                        <Tooltip title={"Go to Previous Document"} arrow>
                                            {/* <NavigateBeforeIcon sx={{ font: '16px' }} className={`${style.marginTopBottom} `} /> */}
                                            <img src={arrowLeftOnHover ? ArrowHoverLeft : selectedFileIndex === 0 ? ArrowDisabledLeft : ArrowHoverLeft} className={style.icon} />
                                        </Tooltip>
                                        {/* <img src={selectedFileIndex === 0 ? ArrowDisabledLeft : ArrowHoverLeft} className={`${style.icon} ${style.hoverImg}`} />
                                        <img src={selectedFileIndex === 0 ? ArrowDisabledLeft : ArrowDefaultLeft} className={`${style.icon} ${style.defaultImg}`} /> */}
                                    </div>
                                </div>
                                <div className={`${style.heading} ${style.marginLeft10}`}>Document {selectedFileIndex + 1} of {fileArray.length}</div>
                                <div
                                    className={` ${selectedFileIndex === fileArray?.length - 1 ? style.cursorNotAllowed : style.cursorPointer} ${style.marginLeft10}`}
                                    onClick={handleNext}
                                >
                                    <div className={`${style.alignCenter}`} onFocus={() => setArrowRightOnHover(true)} onBlur={() => setArrowRightOnHover(false)}>
                                        {/* <NavigateNextIcon sx={{ font: '16px' }} className={`${style.marginTopBottom} `} /> */}
                                        <Tooltip title={"Go to Next Document"} arrow>
                                            <img src={arrowRightOnHover ? ArrowHoverRight : selectedFileIndex === fileArray?.length - 1 ? ArrowDisabledRight : ArrowHoverRight} className={style.icon} />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                            <iframe src={`${fileToDisplay?.fileURL}#toolbar=1&view=fitV`} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} className={style.filePreview}></iframe>
                                        ) : fileToDisplay?.fileType?.startsWith("image/") ? (
                                            <img src={fileToDisplay?.fileURL} alt="" className={style.filePreviewImage} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} />
                                        ) : <iframe src={`${fileToDisplay?.fileURL}#toolbar=1&view=fitV`} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} className={style.filePreview}></iframe>}
                                    </div>
                                )}
                            </div>
                            <div className={`${style.detailsColumn} ${fields?.length > 6 ? style.expanded : ""}`}>
                                <div className={style.extractedFields}>
                                    <div className={style.spaceBetween}>
                                        <div className={`${style.heading} ${style.marginBottom}`}>Current Document</div>
                                        {showViewOnly !== true && (
                                        <Tooltip title="Click to Modify Details" arrow>
                                            <ModeEditOutlinedIcon sx={{ color: "#06617A" }} className={style.cursorPointer} onClick={() => setShowFileWithFields(true)} />
                                        </Tooltip>
                                        )}
                                    </div>
                                    {(form?.documents?.documentDetails?.filter(data => data?.rowId === file?.rowId)?.[0]?.notesDetails?.length !== 0 && form?.documents?.documentDetails?.filter(data => data?.rowId === file?.rowId)?.[0]?.notesDetails?.map(item => item.notes?.notes)?.filter(note => note)?.length !== 0) && form?.documents?.documentDetails?.filter(data => data?.rowId === file?.rowId)?.[0]?.notesDetails !== undefined && (
                                        <div>
                                            <div className={`${style.lableStyle} ${style.marginTop10}`}>Reason for Replacing / Editing Document by MSO</div>
                                            <div className={style.dividerStyle}></div>
                                            {form?.documents?.documentDetails?.filter(data => data?.rowId === file?.rowId)?.[0]?.notesDetails?.filter(item => item.notes?.notes)?.map(item => ({
                                                note: item.notes.notes,
                                                time: new Date(item.createdDate).toLocaleString()
                                            }))?.map(data => (
                                                <div>
                                                    <div className={`${style.notesAlignment} ${style.marginTop10} ${style.lableStyle}`}>{`${data?.time}`}</div>
                                                    <div
                                                        className={`${style.notesAlignment} ${style.marginTop10} ${style.lableStyle}`}
                                                        dangerouslySetInnerHTML={{ __html: data?.note }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {documentStatus === "REJECT_AND_REPLACE_DOCUMENT" ? (
                                        <div className={`${style.twoCol} ${style.marginTop}`}>
                                            {fields?.map((field, index) => renderFields(field, index))}
                                        </div>
                                    ) : (
                                        <div className={`${style.twoCol}`}>
                                            {fields?.map((field, index) => (
                                                <div>
                                                    <div className={`${style.lableStyle} ${style.marginTop10}`}>{field.label}</div>
                                                    <div className={style.dividerStyle}></div>
                                                    <div className={`${style.notesAlignment} ${style.marginTop10} ${style.lableStyle}`}>
                                                        {metaData !== null ? metaData[field?.name] !== undefined ? field?.fieldType === "datepicker" ? format(new Date(metaData[field?.name]), 'dd/MM/yyyy') : metaData[field?.name] : "" : ""}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {documentStatus !== "REJECT_DOCUMENT" && documentStatus !== "REJECT_AND_REPLACE_DOCUMENT" && showViewOnly !== true && (
                                        <div className={`${style.displayInRow} ${style.marginTop}`}>
                                            {/* <div className={`${style.CloseButton} ${style.cursorPointer}`} onClick={() => { getIsOpen(false); }}>
                                        <div className={`${style.closeTextStyle} ${style.alignCenter}`}>
                                            CLOSE
                                        </div>
                                    </div> */}
                                            {!file?.isVerified && (
                                                <Tooltip arrow title="Reject and Replace Document">
                                                    <div
                                                        className={`${style.purpleButtonVerify}`}
                                                        onClick={() => {
                                                            setDocumentStatus('REJECT_AND_REPLACE_DOCUMENT')
                                                        }}
                                                    >
                                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                            Reject & Replace
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            )}
                                            {
                                                !file?.isVerified && (
                                                    <Tooltip arrow title="Reject Document">
                                                        <div
                                                            className={`${style.purpleButtonVerify}`}
                                                            onClick={() => {
                                                                setDocumentStatus('REJECT_DOCUMENT')
                                                            }}
                                                        >
                                                            <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                                Reject
                                                            </div>
                                                        </div>
                                                    </Tooltip>
                                                )
                                            }

                                            {file?.isVerified ? (
                                                <Tooltip arrow title="Revert Verification">
                                                    <div
                                                        className={`${style.greenButtonVerify}`}
                                                        onClick={() => {
                                                            setDocumentStatus("");
                                                            handleDocVerify();
                                                        }}
                                                    >
                                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                            VERIFIED
                                                        </div>
                                                    </div>
                                                </Tooltip>) : (
                                                <Tooltip arrow title={"Accept Document"}>
                                                    <div
                                                        className={`${style.purpleButtonVerify}`}
                                                            onClick={() => {
                                                            setDocumentStatus("ACCEPT_DOCUMENT");
                                                            handleDocVerify();
                                                            if (selectedFileIndex === fileArray?.length - 1) {
                                                                setTimeout(() => getIsOpen(false), 500);
                                                            } else {
                                                                if (documentStatus === "REJECT_AND_REPLACE_DOCUMENT") {
                                                                    setTimeout(() => getIsOpen(false), 500);
                                                                } else {
                                                                    handleNext();
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                            Accept Document
                                                        </div>
                                                    </div>
                                                </Tooltip>)}
                                        </div>
                                    )}
                                    {showViewOnly === true && (
                                        <div
                                            className={`${style.greenButtonVerify} ${style.marginTop30}`}
                                        >
                                        <div className={`${style.buttonGreyTextStyle} ${style.alignCenter}`}>
                                        <LockOutlinedIcon sx={{
                                            fontSize: 20,
                                            color: "#ffffff",
                                            marginRight: "10px",
                                            }} />  VERIFIED 
                                        </div>
                                        </div>
                                    )}
                                    {documentStatus === "REJECT_DOCUMENT" && (
                                        <>
                                            <div className={style.marginTop}>
                                                <div className={style.heading}>Request For Required Document</div>
                                                <div className={` ${style.marginTop10}`}>
                                                    <CommonSelectField
                                                        value={rejectClarificationType}
                                                        onChange={(e) => setRejectClarificationType(e.target.value)}
                                                        className={style.documentStatusWidth}
                                                        // firstOptionLabel={"Select Clarification Type"}
                                                        // firstOptionValue={""}
                                                        label={'Clarification Type*'}
                                                        valueList={['REQUEST_ORIGINAL_DOCUMENT', 'REQUEST_UPDATED_DOCUMENT']}
                                                        labelList={['Request Original Document', 'Request Updated Document']}
                                                        disabledList={['Request Original Document', 'Request Updated Document']?.map(data => false)}
                                                    />
                                                </div>
                                                <div className={style.marginTop10}>
                                                    <CommonTextField
                                                        className={`${style.commentsNotesFontStyle} ${style.notesBorderStyle} ${style.fullWidth}`}
                                                        value={rejectSubject}
                                                        onChange={(e) => setRejectSubject(e.target.value)}
                                                        placeholder="Enter Clarification Subject Here"
                                                        label={"Clarification Required Subject*"}
                                                    />
                                                </div>

                                            </div>
                                            <div className={style.marginTop10}>
                                                <div className={style.lableStyle}>Specify the reason why this document is being rejected*</div>
                                                <div className={style.marginTop10}>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={rejectClarification}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setRejectClarification(data);
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
                                                                "Insert here...",
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
                                                </div>
                                            </div>
                                            <Tooltip arrow title={(rejectClarificationType === "" || rejectSubject === "" || rejectClarification === "") ? "Please fill all clarification details to continue" : "Save & Proceed to Next Document"}>
                                                <div
                                                    className={`${style.purpleButtonVerify} ${style.marginTop} ${(rejectClarificationType === "" || rejectSubject === "" || rejectClarification === "") ? style.disabledButton : style.cursorPointer}`}
                                                    onClick={async () => {
                                                        await handleDocVerify(); 
                                                        
                                                        if (selectedFileIndex === fileArray?.length - 1) {
                                                            setTimeout(() => getIsOpen(false), 500);
                                                        } else {
                                                            setTimeout(() => handleNext(), 1000);
                                                        }
                                                    }}
                                                >
                                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                        SAVE & CONTINUE
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        </>
                                    )}
                                    {documentStatus === "REJECT_AND_REPLACE_DOCUMENT" && (
                                        <>
                                            <div className={style.marginTop}>
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
                                                            "Insert here...",
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
                                                {reasonForReplacingDocument !== "" && (
                                                    <div className={`${style.marginTop10} `}>
                                                        <Tooltip arrow title="Add the reason to enable document replace" followCursor
                                                            {...(reasonForReplacingDocument !== "" && { open: false })}>
                                                            <CommonDropZone
                                                                title={`Replace ${file?.documentType} Document`}
                                                                description={
                                                                    "Upload your files or drag & drop from your document cabinet"
                                                                }
                                                                changeHandler={changeHandler}
                                                                files={[]}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                )}
                                            </div>
                                            <Tooltip arrow title={replaceRowId === "" ? "Document replacement is pending. Please verify" : "Click to Verify document and continue"}>
                                                <div
                                                    className={`${style.purpleButtonVerify} ${style.marginTop} ${replaceRowId === "" ? style.disabledButton : style.cursorPointer}`}
                                                    onClick={async () => {
                                                        if (replaceRowId !== "") {
                                                           await handleDocVerify();
                                                            if (selectedFileIndex === fileArray?.length - 1) {
                                                                setTimeout(() => getIsOpen(false), 500);
                                                            } else {
                                                                if (documentStatus === "REJECT_AND_REPLACE_DOCUMENT") {
                                                                    setTimeout(() => getIsOpen(false), 500);
                                                                } else {
                                                                    setTimeout(() => handleNext(), 1000);
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div className={`${style.buttonGreyTextStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                                        SAVE & CONTINUE
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {
                            fileToDisplayAlternative?.length !== 0 && (
                                <>
                                    <CommonDivider />
                                    <div className={style.gridContainer}>
                                        <div className={style.fileColumn}>
                                            {!isLoading && (
                                                <div className={style.height}>
                                                    {file?.fileType === 'application/pdf' ? (
                                                        <iframe src={`${fileToDisplayAlternative?.fileURL}#toolbar=1&view=fitV`} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} className={style.filePreview}></iframe>
                                                    ) : fileToDisplayAlternative?.fileType?.startsWith("image/") ? (
                                                        <img src={fileToDisplayAlternative?.fileURL} alt="" className={style.filePreviewImage} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} />
                                                    ) : <iframe src={`${fileToDisplayAlternative?.fileURL}#toolbar=1&view=fitV`} onLoad={() => setIsLoading(false)} style={{ display: isLoading ? 'none' : 'block' }} className={style.filePreview}></iframe>}
                                                </div>
                                            )}
                                        </div>
                                        <div className={`${style.detailsColumn} ${fields?.length > 6 ? style.expanded : ""}`}>
                                            <div className={style.extractedFields}>
                                                <div className={`${style.heading} ${style.marginBottom}`}>Prior Document</div>
                                                <div className={`${style.twoCol}`}>
                                                    {fieldsAlternative?.map((field, index) => (
                                                        <div>
                                                            <div className={`${style.lableStyle} ${style.marginTop10}`}>{field.label}</div>
                                                            <div className={style.dividerStyle}></div>
                                                            <div className={`${style.notesAlignment} ${style.marginTop10} ${style.lableStyle}`}>
                                                                {metaDataAlternative !== null ? metaDataAlternative[field?.name] !== undefined ? field?.fieldType === "datepicker" ? format(new Date(metaDataAlternative[field?.name]), 'dd/MM/yyyy') : metaDataAlternative[field?.name] : "" : ""}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div >
                </div >
                {showFileWithFields && (
                    <FileWithFields getIsOpen={getIsOpenFileWithFields} fields={fields} metadata={metaData} file={fileToDisplay} applicationDocumentId={file?.rowId} getPreApplication={getPreApplication} applicationIdFromEdit={applicationId} />
                )}
            </Dialog >
        </>
    );
};

export default FileVerifyDialog;