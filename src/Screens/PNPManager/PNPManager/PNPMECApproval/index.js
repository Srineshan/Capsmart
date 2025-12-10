import React, { useEffect, useRef, useState } from 'react';
import { Classes, Dialog } from '@blueprintjs/core';
import style from './index.module.scss';
import ApplicationHeader from '../../../../Components/ApplicationHeaders';
import { GET, POST, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import CrossPink from "../../../../images/crossPink.png";
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import ESignature from '../../../../Components/ESignature';
import { format } from 'date-fns';
import Cookie from 'universal-cookie';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import jwt from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
// import PdfViewer from '../../../../ReappointmentApplicationForm/pdfViewer';
import CommonPdfViewer from '../../../../Components/CommonPdfViewer';
import Dropzone from 'react-dropzone';
import { ErrorToaster2, SuccessToaster2 } from '../../../../utils/toaster';
import CommonDateField from '../../../../Components/CommonFields/CommonDateField';

const dropzoneStyle = {
    width: "100%",
    height: "auto",
    borderWidth: 2,
    borderColor: "rgb(102, 102, 102)",
    borderStyle: "dashed",
    borderRadius: 5,
};

const PNPMECApproval = () => {
    const { entityId, medicalDirectivesId } = useParams();
    const [policyAndProcedures, setPolicyAndProcedures] = useState()
    const [medicalDirectivesAttestationLog, setMedicalDirectivesAttestationLog] = useState()
    const iframeRef = useRef(null);
    const [selectedMACDate, setSelectedMACDate] = useState(null);
    const [calendarStart, setCalendarStart] = useState(false);
    const navigate = useNavigate()
    const [numPages, setNumPages] = useState(0);
    const pdfContainerRef = useRef(null);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [basicForm, setBasicForm] = useState({})
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const [currentDate, setCurrentDate] = useState(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'));
    const [showSendToDialog, setShowSendToDialog] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const [isApproveEnabled, setIsApproveEnabled] = useState(true);
    const [medicalDirectivesAttestation, setMedicalDirectivesAttestation] = useState(false);
    const [reviewRequired, setReviewRequired] = useState(false);
    const [notes, setNotes] = useState();
    const [userData, setUserData] = useState();
    const [files, setFiles] = useState([]);
    const [approvalStatus, setApprovalStatus] = useState('');
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(users?.userName + dateTime, publicKey).toString());

    useEffect(() => {
        getMedicalDirectives()
    }, [medicalDirectivesId])

    useEffect(() => {
        getAttestationLog()
    }, [])

    // useEffect(() => {
    //     setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    // }, [basicForm, step])

    useEffect(() => {
        setCurrentDate(format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy'))
    }, [canadaData?.dateFormat])

    useEffect(() => {
        if (medicalDirectivesAttestation) {
            setIsScrolledToBottom(true)
        }
    }, [medicalDirectivesAttestation])

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        setUserData(userData)
    }

    // useEffect(() => {
    //     const iframe = iframeRef.current;

    //     const setIframeHeight = () => {
    //         if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
    //             const contentHeight = iframe.contentWindow.document.body.scrollHeight;
    //             iframe.style.height = `${contentHeight}px`;
    //         }
    //     };

    //     const onLoad = () => {
    //         if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
    //             setIframeHeight();
    //             iframe.contentWindow.addEventListener('resize', setIframeHeight);
    //         }
    //     };

    //     if (iframe) {
    //         iframe.addEventListener('load', onLoad);
    //     }

    //     // Cleanup function
    //     return () => {
    //         if (iframe) {
    //             iframe.removeEventListener('load', onLoad);
    //             if (iframe.contentWindow) {
    //                 iframe.contentWindow.removeEventListener('resize', setIframeHeight);
    //             }
    //         }
    //     };
    // }, []);

    console.log(isScrolledToBottom, 'scroll')

    const getMedicalDirectives = async () => {
        if (medicalDirectivesId !== undefined) {
            const { data: policyAndProcedures } = await GET(
                `policy-and-procedure-management-service/policyAndProcedures/${medicalDirectivesId}`
            );
            setPolicyAndProcedures(policyAndProcedures);
            console.log(policyAndProcedures, 'policyAndProcedures')
        }
    }

    const getAttestationLog = async () => {
        if (medicalDirectivesId !== undefined) {
            const { data: medicalDirectivesAttestationLog } = await GET(
                `policy-and-procedure-management-service/attestationLog?policyAndProcedureId=${medicalDirectivesId}&userId=${users?.id}`
            );
            setMedicalDirectivesAttestationLog(medicalDirectivesAttestationLog)
            console.log(medicalDirectivesAttestationLog, 'medicalDirectivesAttestationLog')
            if ((medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== undefined)) {
                setMedicalDirectivesAttestation((medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== undefined) ? true : false);
                setEncryptedText(medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign)
                setCurrentDate(medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.signedDate);
                setIsSigned((medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== '' && medicalDirectivesAttestationLog?.[medicalDirectivesAttestationLog?.length - 1]?.esign?.esign !== undefined) ? true : false);
            }
        }
    }

    const changeHandler = async (event) => {
        console.log("Event received:", event);
        const filesArray = Array.from(event);
        console.log("Converted files array:", filesArray);
        setFiles(filesArray);

        const formData = new FormData();
        let fileNameArray = [];

        filesArray.forEach(file => {
            const fileInfo = {
                "filePath": file.path || '',
                "fileName": file.name,
                "fileURL": "",
                "fileType": file.type,
                "classification": "",
                "verified": true,
                "valid": true,
            };
            fileNameArray.push(fileInfo);
            formData.append('documents', file);
        });

        const blob = new Blob([JSON.stringify(fileNameArray)], {
            type: "application/json"
        });
        formData.append('files', blob);

        // try {
        //     const response = await POST(`application-management-service/application/${id}/files/bulk?isLLMRequired=${false}`, formData);
        // } catch (error) {

        // }
    };

    const handleSubmitAttest = async () => {
        let temp = {
            user: {
                id: userData?.id,
                name: userData?.name,
                email: userData?.email
            },
            esign: {
                esign: isSigned ? encryptedText : '',
                name: isSigned ? users?.userName : '',
                signedDate: isSigned ? format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy') : ''
            }
        }
        await POST(`policy-and-procedure-management-service/policyAndProcedures/${medicalDirectivesId}/attest`, temp)
            .then(response => {
                navigate(`/pnpManager`);
                getAttestationLog();
                console.log(response, response?.response?.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleReviewRequired = (isRequired) => {
        setReviewRequired(isRequired)
        setShowSendToDialog(true)
    }

    const handleApprovalStatus = async (isReviewRequired) => {
        const formData = new FormData();
        let fileNameArray = [];

        files.forEach(file => {
            const fileInfo = {
                "fileName": file.name,
            };
            fileNameArray.push(fileInfo);
            formData.append('documents', file);
        });
        let data = {
            role: sessionStorage.getItem('workModeType'),
            notes: {
                notes: ''
            },
            files: fileNameArray,
            esign: {
                esign: isSigned ? encryptedText : '',
                name: isSigned ? users?.userName : '',
                signedDate: isSigned ? format(new Date(), canadaData?.dateFormat || 'dd/MM/yyyy') : '',
                file: userData?.esignature?.file,
            },
            approvedDate: format(new Date(selectedMACDate), 'yyyy-MM-dd'),
        }
        const blob = new Blob([JSON.stringify(data)], {
            type: "application/json"
        });
        formData.append('workFlowActionDetailsDTO', blob);
        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${medicalDirectivesId}/workflowAction/${isReviewRequired ? 'REJECTED' : 'APPROVED'}`, formData)
            .then(response => {
                SuccessToaster2('Approval Updated Successfully');
            })
            .catch(error => {
                ErrorToaster2('Unexpected Error Occured');
            })
        navigate(`/pnpManager`);
    }

    const handleSend = async () => {
        let data = {
            "role": sessionStorage.getItem('workModeType'),
            "notes": {
                "notes": notes
            },
            "approvedDate": format(new Date(), 'yyyy-MM-dd')
        }
        await PUT(`policy-and-procedure-management-service/policyAndProcedures/${medicalDirectivesId}/workflowAction/${reviewRequired ? 'REJECTED' : 'APPROVED'}`, data)
        setShowSendToDialog(false);
        handleClose();
    }

    const handleClose = () => {
        navigate(`/pnpManager`);
    }
    return (
        <div className={style.screenBackground}>
            <div className={style.welcomeText}>
                <ApplicationHeader title={`${policyAndProcedures?.mdID}: ${policyAndProcedures?.title}`} close={true} closeClick={handleClose} isNotLogout={true} />
            </div>
            <div className={style.headerData}>
                <span style={{ marginLeft: '20px' }}>Ordering Of Laboratory Investigations - IPAC</span>
                <span className={style.verticalAlignCenter}>
                    <CloseIcon sx={{ fontSize: 30, color: '#FFFFFF', cursor: 'pointer', marginLeft: '270px' }} onClick={handleClose} />
                </span>
            </div>
            <div className={style.screenPadding}>
                {/* <div>
                    <div className={style.breadcrumbStyle}>{`REAPPOINTMENT APPLICATION > MEDICAL DIRECTIVES STATUS >> ${policyAndProcedures?.title}`}</div>
                </div> */}
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        {/* <div className={style.medicalDirectivesCard}>
                            <div className={style.title}>{`${policyAndProcedures?.title}`} <span className={style.mdIDStyle}>{policyAndProcedures?.mdID}</span></div>
                            {(!isScrolledToBottom) && (
                                <div className={`${style.marginTop10} ${style.description} ${style.attestationRequiredText}`}>You need to scroll to the end of the document before you can certify that it has been viewed by you.</div>
                            )}
                        </div> */}
                        <div className={`${style.medicalDirectivesCard}`}>
                            <CommonPdfViewer pdfurl={policyAndProcedures?.file?.fileURL} setIsScrolledToBottom={setIsScrolledToBottom} />

                            {/* <iframe src={`${policyAndProcedures?.file?.fileURL}`} className={style.pdfDisplay} ref={iframeRef} /> */}
                        </div>
                    </div>
                    <div className={`${style.medicalDirectivesCard} ${style.stickyContainer}`}>
                        <div className={style.dialogTitle}>{`MAC Approval`}</div>
                        <CommonDateField
                            className={style.dateWidth}
                            onChange={(date) => setSelectedMACDate(format(new Date(date), "yyyy-MM-dd'T'00:00"))}
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}
                            value={selectedMACDate}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: 'Enter MAC Approval Date To Continue',
                                        readOnly: true
                                    }}
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                />
                            )}
                        />
                        <Tooltip title={!selectedMACDate ? "Select Approval Date to Continue" : "Click to Continue"} arrow>
                            <div className={`${style.outlinedButton} ${style.marginTop10}`} onClick={() => { handleApprovalStatus(true) }}>REJECTED BY MAC</div>
                        </Tooltip>
                        <Tooltip title={!selectedMACDate ? "Select Approval Date to Continue" : "Click to Continue"} arrow>
                            <div className={`${style.continue} ${style.marginTop10} ${!selectedMACDate ? style.disabledView : ''}`} onClick={!selectedMACDate ? () => { } : () => { handleApprovalStatus(false) }}>APPROVED BY MAC</div>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <Dialog
                isOpen={showSendToDialog}
                onClose={() => setShowSendToDialog(false)}
                className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
            >
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        <div className={style.spaceBetween}>
                            <div className={`${style.heading}`}>
                                {reviewRequired ? "Flag This P&P For Review Required" : "Send for Sign Off"}
                            </div>
                            <div className={style.displayInRow}>
                                <Tooltip title="Click to Close" arrow>
                                    <img
                                        src={CrossPink}
                                        alt="cross"
                                        className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                                        onClick={() => {
                                            setShowSendToDialog(false);
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className={`${style.pagebreak}`}>
                            <div className={style.medicalDirectivesCard}>
                                <div className={style.title}>{`${policyAndProcedures?.title}`} <span className={style.mdIDStyle}>{policyAndProcedures?.mdID}</span></div>
                            </div>
                            <div className={`${style.marginTop10}`}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={notes}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setNotes(data);
                                    }}
                                    config={{
                                        placeholder: "Enter comments / notes",
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
                                    onReady={(editor) => {
                                        editor.editing.view.change((writer) => {
                                            writer.setStyle(
                                                "height",
                                                "150px",
                                                editor.editing.view.document.getRoot()
                                            );
                                        });
                                    }}
                                />
                            </div>
                            {/* <div className={`${style.marginTop} ${style.cursorPointer}`}>

                                <>

                                    <Dropzone
                                        style={dropzoneStyle}
                                        onDrop={(acceptedFiles) => changeHandler(acceptedFiles)}
                                        accept={{
                                            'image/jpeg': [],
                                            'image/png': [],
                                            'image/jpg': [],
                                            'application/pdf': []
                                        }}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <section>
                                                <div {...getRootProps()}>
                                                    <input {...getInputProps()} />
                                                    <div className={style.uploadBorderStyle}>
                                                        <div className={`${style.spaceBetween} ${style.displayInRowCenter}`}>
                                                            <div className={style.uploadTextStyle}>
                                                                Upload any supporting documents
                                                            </div>
                                                            <div className={`${style.marginLeftRight20}`}>
                                                                Click To Upload
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                </>

                            </div> */}

                            <div className={`${style.marginTop}  ${style.reviewButtonContainer}`}>
                                <div
                                    className={`${style.reviewButtonStyle} ${isApproveEnabled ? style.cursorPointer : undefined} ${style.marginLeft}`}
                                    onClick={handleSend}
                                    style={{
                                        pointerEvents: isApproveEnabled ? 'auto' : 'none',
                                        opacity: isApproveEnabled ? 1 : 0.5
                                    }}
                                >
                                    <Tooltip title={isApproveEnabled ? "Click to Send Application for Review" : ""} arrow>
                                        <div className={style.reviewButton}>SUBMIT</div>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default PNPMECApproval;