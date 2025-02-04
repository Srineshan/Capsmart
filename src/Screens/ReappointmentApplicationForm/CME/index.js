import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET, POST, PUT, DELETE } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import VerifiedImage from "./../../../images/verifiedImage.png";
import NotVerifiedImage from "./../../../images/notVerifiedImage.png";
import ValidationDialog from '../../../Components/validationDialog';
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import { Dialog, Classes } from '@blueprintjs/core';
import { fileLoadingURL } from '../../../utils/formatting';
import CommonDropZone from '../../../Components/CommonFields/CommonDropZone';
import CrossPink from "./../../../images/crossPink.png";
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import NoDataBox from '../../../Components/ReusableSmallComponents/noDataBox';
import ESignature from '../../../Components/ESignature';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import { format } from 'date-fns';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import WelcomeCard from '../../../Components/WelcomeCard';
import FileWithFields from '../../../Components/FileWithFields';
import FileDisplayDialog from '../../../Components/fileDisplayDialog';
import DeleteIcon from './../../../images/deleteHcRow.png';
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Close from './../../../images/close.png';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const CME = ({ basicForm, setBasicForm, applicationId, getPreApplication, dateFormat, name }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const [isAddMore, setIsAddMore] = useState(false)
    const [isAddMore2, setIsAddMore2] = useState(false)
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false);
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [formContent, setFormContent] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [yesOrNoCMETranscript, setYesOrNoCMETranscript] = useState('');
    const [files, setFiles] = useState([]);
    const [updatedDateCMETranscript, setUpdatedDateCMETranscript] = useState(format(new Date(), "yyyy-MM-dd'T'00:00"));
    const [yesOrNoCME, setYesOrNoCME] = useState('');
    const [updatedDateCME, setUpdatedDateCME] = useState(format(new Date(), "yyyy-MM-dd'T'00:00"));
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState(format(new Date(), dateFormat));
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showFileWithFields, setShowFileWithFields] = useState(false);
    const [fields, setFields] = useState([]);
    const [fileMetadata, setFileMetadata] = useState();
    const [file, setFile] = useState();
    const [applicationDocumentId, setApplicationDocumentId] = useState('');
    const [isContinueEnabled, setIsContinueEnabled] = useState(false);
    const [selectedUpload, setSelectedUpload] = useState('');
    const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
    const [selectedFile, setselectedFile] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [notes, setNotes] = useState('');
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex + 1]?.schemaCategory)}`);
            setNavigateBackURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
            if (basicForm?.forms[formIndex]?.data !== null) {
                setYesOrNoCME(basicForm?.forms[formIndex]?.data?.yesOrNoCME !== undefined ? basicForm?.forms[formIndex]?.data?.yesOrNoCME : (basicForm?.forms?.[formIndex]?.data?.cmeCertificates?.length !== 0 && basicForm?.forms?.[formIndex]?.data?.cmeCertificates?.length !== undefined) ? 'Yes' : 'No');
            }
            if (basicForm?.forms[formIndex]?.data !== null) {
                setYesOrNoCMETranscript(basicForm?.forms?.[formIndex]?.data?.cmeTranscripts !== undefined ? 'Yes' : basicForm?.forms[formIndex]?.data?.yesOrNoCMETranscript !== undefined ? basicForm?.forms[formIndex]?.data?.yesOrNoCMETranscript : 'No');
            }
        }
        setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
        setIsChecked(basicForm?.forms?.[formIndex]?.acknowledged);
        setNotes(basicForm?.forms?.[formIndex]?.data?.notes !== undefined ? basicForm?.forms?.[formIndex]?.data?.notes : '')
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    useEffect(() => {
        getRenderedContent()
    }, [formSchema])

    useEffect(() => {
        if (yesOrNoCMETranscript !== '') {
            setIsContinueEnabled(true);
        } else {
            setIsContinueEnabled(false);
        }
    }, [yesOrNoCMETranscript])

    useEffect(() => {
        if (fileMetadata) {
            setShowFileWithFields(true)
        }
        console.log(fileMetadata, file, fields, 'fields')
    }, [fileMetadata])

    useEffect(() => {
        if (basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 && basicForm?.basicDetails?.applicant?.applicantType !== "Midwife") {
            setIsChecked(false)
            setIsSigned(false);
        }
    }, [basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours])

    const getIsValidationDialogOpen = (value) => {
        setShowValidationDialog(value);
    }

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, 'Metadata')
            temp.push(data);
        }
        setMetadata(temp);
    }

    const getAllLabels = (data) => {
        let tempLabels = labels;
        if (!tempLabels?.includes(data)) {
            console.log(tempLabels, data, 'Metadata')
            tempLabels.push(data);
        }
        setLabels(tempLabels);
    }

    const getRenderedContent = async () => {
        const { data: content } = await GET(
            `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}/render`
        );
        setFormContent(content)
    }

    const handleIsChecked = (value) => {
        setIsEdited(true)
        setIsChecked(value)
        if (!value) {
            setIsSigned(false)
        }
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getIsOpenFileWithFields = (value) => {
        setShowFileWithFields(value);
    }

    const getIsShowFileDialog = (value) => {
        setShowFileDisplayDialog(value);
    }

    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const getIsSubmitClicked = (value, data, skip) => {
        if (value) {
            handleSubmitApplicationReq(data, skip)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            // handleSubmitApplicationReq("skipped")
            navigate(navigateURL);
        }
    }

    const getMissingFields = () => {
        let missingKeys = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index] })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        // if (missingKeys?.length !== 0) {
        //     setShowValidationDialog(true)
        // }
        // else {
        //     handleSubmitApplicationReq()
        // }
        setWarningFields(missingKeys)
        console.log(keyValuePair, 'Metadata', missingKeys)
        return missingKeys;
    }

    const removeEmptyStrings = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "string" && obj[key].trim() === "") {
                delete obj[key];
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                removeEmptyStrings(obj[key]);
            }
        });
        return obj;
    };


    const handleSubmitApplicationReq = async (data) => {
        // if(isEdited){
        let missingFields = []
        let emptyStringCheckedObject = removeEmptyStrings(data?.forms?.[formIndex]?.data);
        let tempValidation = {
            schemaId: data?.forms?.[formIndex]?.schemaId,
            data: emptyStringCheckedObject,
        }
        await POST(`application-management-service/application/validateForm`, tempValidation)
            .then(response => {
                console.log(response, response?.response?.data, 'missingFields')
                missingFields = (response?.data !== undefined && response?.data === true) ? [] : response?.response?.data;
            })
            .catch((error) => {
                console.log(error)
            })
        let temp = {
            schemaId: data?.forms?.[formIndex]?.schemaId,
            data: data?.forms?.[formIndex]?.data,
            unFilledFields: missingFields,
            acknowledged: missingFields?.length !== 0 ? false : true
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication()
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            })
        // } 
    }

    const handleCMETranscriptDelete = async () => {
        await DELETE(`application-management-service/application/${applicationId}/deleteFiles?applicationDocumentIds=${[basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.rowId]}`, [basicForm?.forms?.[formIndex]?.data?.cmeTranscripts])
            .then((response) => {
                SuccessToaster("File Deleted Successfully");
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Deleting File");
            });
        let tempData = basicForm?.forms?.[formIndex]?.data;
        delete tempData.cmeTranscripts;
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: tempData,
            unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
            acknowledged: basicForm?.forms?.[formIndex]?.acknowledged
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                getPreApplication()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const changeHandler = async (event) => {
        setIsLoading(true);
        setFiles(event);
        console.log(event, 'Test');
        // let table = tempValue.table !== undefined ? tempValue.table : []

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
            SuccessToaster('File Uploaded Successfully');
            console.log(response?.data);
            // setFields(response?.data?.[0]?.fields);
            // setFile(response?.data?.[0]?.file);
            // setFileMetadata(response?.data?.[0]?.metaData);
            // setApplicationDocumentId(response?.data?.[0]?.id)
            for (let triggerIndex = 0; triggerIndex < event.length; triggerIndex++) {
                try {
                    if (response?.data[triggerIndex]?.documentType !== null) {
                        await PUT(`application-management-service/application/${applicationId}/form/updateData?documentType=${response?.data[triggerIndex]?.documentType?.name}&applicationDocumentId=${response?.data[triggerIndex]?.id}`, { documentType: response?.data[triggerIndex]?.documentType !== null ? response?.data[triggerIndex]?.documentType?.name : '', fileSize: `${(event[triggerIndex]?.size / (1024 * 1024)).toFixed(2)} Mb`, fileURL: response?.data[triggerIndex]?.file?.fileURL, fileType: response?.data[triggerIndex]?.file?.fileType, fileUploaded: event[triggerIndex]?.name, requirement: response?.data[triggerIndex]?.documentType !== null ? basicForm?.documentsRequired?.filter(data => data?.document?.name === response?.data[triggerIndex]?.documentType?.name)?.[0]?.required ? 'Required' : 'Recommended' : '', valid: response?.data[triggerIndex]?.valid, verified: response?.data[triggerIndex]?.verified, rowId: response?.data[triggerIndex]?.id });
                    }
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
            }
            // handleSubmitApplicationReq(table)
            setIsLoading(false);
            setShowUploadDialog(false);
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error(error);
            setIsLoading(false);
            return null;
        }
    };


    const getDocument = async (rowId) => {
        const { data: response } = await GET(
            `document-management-service/document/${rowId}`
        );
        console.log(response);
        setFields(response?.fields);
        setFile(response?.file);
        setFileMetadata(response?.metaData);
        setApplicationDocumentId(response?.id);
        console.log("fffffff", fields)
    }


    const handleContinue = async () => {
        let tempData = basicForm?.forms?.[formIndex]?.data !== null ? basicForm?.forms?.[formIndex]?.data : {};
        tempData.yesOrNoCME = yesOrNoCME;
        tempData.yesOrNoCMETranscript = yesOrNoCMETranscript;
        tempData.notes = notes;
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: tempData,
            unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
            acknowledged: true,
            esign: { esign: isSigned ? encryptedText : '', name: isSigned ? name : '', signedDate: isSigned ? currentDate : '' }
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication()
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            })
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        }
        else {
            navigate(navigateURL)

        }
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    const handleBackClick = async () => {
        navigate(navigateBackURL)
    }

    // const getIsEdited = (value) => {
    //     setIsEdited(value)
    // }

    return (
        <div>
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
            <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
                <div>
                    <ReappointmentProgressCard step={'STEP 4'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={8} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />
                    <div className={style.marginTop}>
                        <WelcomeCard title={<strong>For Professional Staff, the CME requirement by CMH is to have the required qualified hours of their respective college approved education hours or credits.</strong>}
                            description={'You can submit a print out of your current continuing education credit summary or other valid college documents from the past 12 months, including any peer review / evaluations you have had.'} />
                    </div>
                    <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                        {/* {formSchema !== undefined && 'cmeTranscripts' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.cmeTranscripts} gridStyle={style.EducationGrid} baseKey={'cmeTranscripts'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} addMoreType={true} formId={basicForm?.forms?.[formIndex]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} warningFields={warningFields} getMissingFields={getMissingFields} showValidationDialog={showValidationDialog} setShowValidationDialog={setShowValidationDialog} isAddMore={isAddMore2} setIsAddMore={setIsAddMore2} formSchema={formSchemaWholeObject}
                                heading={'Information Requirement Alert'}
                                subHeading={'For this application you are required to provide information on Continuing Medical Education.'}
                                subHeading2={'You will not be able to submit your application if this is not provided.'} />
                        )} */}
                        <div>
                            <div className={style.cardTitle}>
                                Do you have any CME / CEU Credit Summary document from your Professional College or Membership Organization?
                            </div>
                            {yesOrNoCMETranscript === '' ? (
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                >
                                    <div
                                        className={`${style.reappointmentButtonOutlined}`}
                                        onClick={() => { setSelectedUpload('transcript'); setYesOrNoCMETranscript('Yes'); setUpdatedDateCMETranscript(format(new Date(), "yyyy-MM-dd'T'00:00")); setShowUploadDialog(true) }}
                                    >
                                        YES
                                    </div>
                                    <div
                                        className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                        onClick={() => { setYesOrNoCMETranscript('No'); setUpdatedDateCMETranscript(format(new Date(), "yyyy-MM-dd'T'00:00")) }}
                                    >
                                        NO
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={`${style.markedAsText} ${style.marginTop10}`}><strong>Marked as <span className={yesOrNoCMETranscript === 'Yes' ? style.yesText : style.noText}>{yesOrNoCMETranscript}</span></strong> on {format(new Date(updatedDateCMETranscript), "MMM dd, yyyy")}</div>
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                    >
                                        <div
                                            className={`${style.reappointmentButtonEdit}`}
                                            onClick={() => setYesOrNoCMETranscript('')}
                                        >
                                            VIEW TO MODIFY
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {basicForm?.forms?.[formIndex]?.data?.cmeTranscripts !== undefined && yesOrNoCMETranscript !== 'No' && (
                            <>
                                {basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName !== undefined && (
                                    <div className={`${style.fileDisplayGrid} ${style.fileDisplay} ${style.marginTop} ${style.verticalAlignCenter}`}>
                                        <div><strong>{basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.classification}</strong></div>
                                        <div className={style.leftAlign}>{basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName}</div>
                                        <Tooltip title={basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.valid ? "Valid File" : "Not Valid"} arrow>
                                            <img
                                                src={basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.valid ? VerifiedImage : NotVerifiedImage}
                                                alt=""
                                                className={`${style.imgIcon} ${style.cursorPointer}`}
                                                onClick={() => {
                                                    setShowFileDisplayDialog(true); setselectedFile(basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file);
                                                }
                                                }
                                            />
                                        </Tooltip>
                                        <img src={DeleteIcon} alt="" className={`${style.imgIcon} ${style.cursorPointer}`} onClick={() => { handleCMETranscriptDelete() }} />
                                    </div>
                                )}
                                {basicForm?.basicDetails?.applicant?.applicantType === "Midwife" ? (
                                    <div className={` ${style.marginTop}`}>
                                        {basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName === undefined ? (
                                            <div>
                                                <div className={style.lableStyle}>Indicate why you were not able to provide the CME / CEU Credit Summary document*</div>
                                                <div className={style.marginTop10}>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={notes}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setNotes(data);
                                                        }}
                                                        onReady={(editor) => {
                                                            editor.editing.view.change((writer) => {
                                                                writer.setStyle(
                                                                    "height",
                                                                    "110px",
                                                                    editor.editing.view.document.getRoot()
                                                                );
                                                            });
                                                        }}
                                                        config={{
                                                            placeholder: "Type your content here...",
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
                                        ) : (
                                            <div>
                                                <div className={`${style.checkGridMidwife}`}>
                                                    {formContent?.disclaimer?.content !== null && (
                                                        <span>
                                                            <CommonCheckBox checked={isChecked} onChange={(e) => handleIsChecked(e.target.checked)} bigCheckbox={true} />
                                                        </span>
                                                    )}
                                                    <div
                                                        className={`${style.leftAlign} ${style.marginTop10}`}
                                                        dangerouslySetInnerHTML={{ __html: '<p>I certify that I have completed the CME / CEU requirements of college approved education hours in the past 12 months.</p>' }}
                                                    />
                                                </div>
                                                {formSchemaWholeObject?.esignatureRequired && (
                                                    <div className={style.eSignGrid}>
                                                        <div onClick={isChecked ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }}
                                                        >
                                                            <ESignature
                                                                userName={isSigned ? name : ""}
                                                                encData={isSigned ? encryptedText : ''}
                                                                showData={isSigned}
                                                                showDatais={true}
                                                            />
                                                        </div>
                                                        <div className={style.verticalAlignCenter}>
                                                            <div className={style.displayInRow}>
                                                                <div className={style.dateTitle}>Date: </div>
                                                                <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`${style.cmeCreditsGrid} ${style.marginTop}`}>
                                        <div>
                                            <div className={style.cmeCard}>
                                                <div className={style.creditsHeading}>CME CREDITS / HOURS</div>
                                                <div className={`${style.twoCol} ${style.marginTop}`}>
                                                    <Tooltip
                                                        title="Click Here to Edit"
                                                        arrow
                                                        {...(!basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file && { open: false })}
                                                    >
                                                        <div className={`${style.cmeHourCard} ${style.cursorPointer} `} onClick={() => {
                                                            const fileData = basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file;
                                                            const rowId = basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.rowId;
                                                            if (!fileData) {
                                                                setShowFileWithFields(false);
                                                            } else {
                                                                setShowFileWithFields(true);
                                                                getDocument(rowId);
                                                            }
                                                        }}>
                                                            <div className={style.totalText}>Your Total</div>
                                                            <div className={`${style.displayInRow} ${style.justifyCenter}`}>
                                                                <div className={style.hourText}>{basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours}</div>
                                                                {basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours !== undefined && (
                                                                    <div className={`${style.marginLeft} ${style.verticalAlignCenter}`}>
                                                                        <EditOutlinedIcon sx={{ fontSize: 28, color: "#06617A" }} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className={style.totalText}>Credits / Hours</div>
                                                            {(25 - basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours) > 0 && (
                                                                <div className={style.hourRemainingText}>{25 - basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours} more needed</div>
                                                            )}
                                                        </div>
                                                    </Tooltip>
                                                    <div className={style.cmeHourCard}>
                                                        <div className={style.totalText}>Required</div>
                                                        <div className={style.hourText}>25</div>
                                                        <div className={style.totalText}>Credits / Hours</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? (
                                            <div>
                                                <div className={style.lableStyle}>Indicate why you were not able to complete the required number of Credits / Hours*</div>
                                                <div className={style.marginTop10}>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={notes}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            setNotes(data);
                                                        }}
                                                        onReady={(editor) => {
                                                            editor.editing.view.change((writer) => {
                                                                writer.setStyle(
                                                                    "height",
                                                                    "110px",
                                                                    editor.editing.view.document.getRoot()
                                                                );
                                                            });
                                                        }}
                                                        config={{
                                                            placeholder: "Type your content here...",
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
                                        ) : (
                                            <div className={basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? style.disabled : ''}>
                                                <div className={`${style.checkGrid}`}>
                                                    {formContent?.disclaimer?.content !== null && (
                                                        <span>
                                                            <CommonCheckBox checked={isChecked} onChange={basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? () => { } : (e) => handleIsChecked(e.target.checked)} bigCheckbox={true} />
                                                        </span>
                                                    )}
                                                    <div
                                                        className={`${style.leftAlign} ${style.marginTop10}`}
                                                        dangerouslySetInnerHTML={{ __html: formContent?.disclaimer?.content }}
                                                    />
                                                </div>
                                                {formSchemaWholeObject?.esignatureRequired && (
                                                    <div className={style.eSignGrid}>
                                                        <div onClick={isChecked ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }}
                                                        >
                                                            <ESignature
                                                                userName={isSigned ? name : ""}
                                                                encData={isSigned ? encryptedText : ''}
                                                                showData={isSigned}
                                                                showDatais={true}
                                                            />
                                                        </div>
                                                        <div className={style.verticalAlignCenter}>
                                                            <div className={style.displayInRow}>
                                                                <div className={style.dateTitle}>Date: </div>
                                                                <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                        {yesOrNoCMETranscript === 'No' && (
                            <div>
                                <div className={style.lableStyle}>Indicate why you were not able to complete the required number of Credits / Hours*</div>
                                <div className={style.marginTop10}>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={notes}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setNotes(data);
                                        }}
                                        onReady={(editor) => {
                                            editor.editing.view.change((writer) => {
                                                writer.setStyle(
                                                    "height",
                                                    "110px",
                                                    editor.editing.view.document.getRoot()
                                                );
                                            });
                                        }}
                                        config={{
                                            placeholder: "Type your content here...",
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
                        )}
                    </div>
                    {/* <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                        <div>
                            <div className={style.cardTitle}>
                                Do you have any other CME / CEU Certificates you have obtained in the past year?
                            </div>
                            {yesOrNoCME === '' ? (
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                >
                                    <div
                                        className={`${style.reappointmentButtonOutlined}`}
                                        onClick={() => { setSelectedUpload('certificate'); setYesOrNoCME('Yes'); setUpdatedDateCME(format(new Date(), "yyyy-MM-dd'T'00:00")); setShowUploadDialog(true) }}
                                    >
                                        YES
                                    </div>
                                    <div
                                        className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                        onClick={() => { setYesOrNoCME('No'); setUpdatedDateCME(format(new Date(), "yyyy-MM-dd'T'00:00")) }}
                                    >
                                        NO
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={`${style.markedAsText} ${style.marginTop10}`}><strong>Marked as <span className={yesOrNoCME === 'Yes' ? style.yesText : style.noText}>{yesOrNoCME}</span></strong> on {format(new Date(updatedDateCME), "MMM dd, yyyy")}</div>
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                    >
                                        <div
                                            className={`${style.reappointmentButtonEdit}`}
                                            onClick={() => setYesOrNoCME('')}
                                        >
                                            VIEW TO MODIFY
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {basicForm?.forms?.[formIndex]?.data?.cmeCertificates !== undefined && yesOrNoCME !== 'No' && (
                            <>
                                {formSchema !== undefined && 'cmeCertificates' in formSchema?.properties && (
                                    <ApplicationFieldCard object={formSchema?.properties?.cmeCertificates} gridStyle={style.EducationGrid} baseKey={'cmeCertificates'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} addMoreType={true} formId={basicForm?.forms?.[formIndex]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} warningFields={warningFields} getMissingFields={getMissingFields} showValidationDialog={showValidationDialog} setShowValidationDialog={setShowValidationDialog} isAddMore={isAddMore} setIsAddMore={setIsAddMore} formSchema={formSchemaWholeObject}
                                    // heading={'Information Requirement Alert'}
                                    // subHeading={'For this application you are required to provide information on Continuing Medical Education.'}
                                    // subHeading2={'You will not be able to submit your application if this is not provided.'} 
                                    />
                                )}
                            </>
                        )}
                    </div> */}
                    <div className={style.threeColForButton}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleBackClick()}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop} ${isContinueEnabled ? '' : style.disabledButton}`} onClick={isContinueEnabled ? () => handleContinue() : () => { }}>CONTINUE</div>
                    </div>
                </div>
                <div>
                    {!showInfo && (
                        <div>
                            <div className={`${style.toggleButton} ${isSaveInProgressOpen || showValidationDialog ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                                <MenuIcon className={style.toggleIcon} />
                            </div>
                            <div className={`${style.headerData} ${isSaveInProgressOpen || showValidationDialog ? style.hidden : ""}`}>
                                <span style={{ marginLeft: '20px' }}>Confirm Your Continuing Medical Education</span>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
                            <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
                            <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                            <div className={style.marginTop}>
                                <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                            </div>
                            <div className={style.marginTop}>
                                <ApplicationReferenceDocuments />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog ? style.hiddenStickyContainer : ""}`}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
                        <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={style.twoColForButton}>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleBackClick()}>BACK</div>
                            <div className={`${style.continue} ${style.marginTop10} ${isContinueEnabled ? '' : style.disabledButton}`} onClick={isContinueEnabled ? () => handleContinue() : () => { }}>CONTINUE</div>
                        </div>
                    </div>

                </div>
            </div>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
            <Dialog
                isOpen={showUploadDialog}
                onClose={() => setShowUploadDialog(false)}
                className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
            >
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>
                                {selectedUpload === 'transcript' ? 'CME / CEU Transcript' : 'CME / CEU Cerificates'}
                            </div>
                            <div>
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                    onClick={() => {
                                        if (selectedUpload === 'transcript') {
                                            setYesOrNoCMETranscript('');
                                        } else {
                                            setYesOrNoCME('');
                                        }
                                        setShowUploadDialog(false);
                                    }}
                                />
                            </div>
                        </div>
                        <div className={`${style.twoCol} ${style.marginTop10}`}>
                            <CommonDropZone
                                title={"Upload Your Documents"}
                                description={
                                    "Upload your files or drag & drop from your document cabinet"
                                }
                                changeHandler={changeHandler}
                                files={files}
                            />
                            <CommonDropZone
                                title={"Upload A Photo"}
                                description={
                                    "Take a picture with your Camera or Upload from Gallery."
                                }
                                changeHandler={changeHandler}
                                files={files}
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
            {showFileWithFields && (
                <FileWithFields getIsOpen={getIsOpenFileWithFields} fields={fields} metadata={fileMetadata} file={file} schemaId={basicForm?.forms?.[formIndex]?.schemaId} applicationDocumentId={applicationDocumentId} getPreApplication={getPreApplication} />
            )}
            {/* {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
            )} */}
            {showFileDisplayDialog && (
                <FileDisplayDialog
                    getIsOpen={getIsShowFileDialog}
                    file={selectedFile}
                />
            )}
        </div>
    )
}

export default CME;
