import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import { GET, POST, PUT, DELETE } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import VerifiedImage from "./../../../../images/verifiedImage.png";
import NotVerifiedImage from "./../../../../images/notVerifiedImage.png";
import ValidationDialog from '../../../../Components/validationDialog';
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import { Dialog, Classes } from '@blueprintjs/core';
import { fileLoadingURL } from '../../../../utils/formatting';
import CommonDropZone from '../../../../Components/CommonFields/CommonDropZone';
import CrossPink from "./../../../../images/crossPink.png";
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import NoDataBox from '../../../../Components/ReusableSmallComponents/noDataBox';
import ESignature from '../../../../Components/ESignature';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import { format } from 'date-fns';
import ReappointmentProgressCard from '../../../../Components/ReappointmentProgressCard';
import WelcomeCard from '../../../../Components/WelcomeCard';
import FileWithFields from '../../../../Components/FileWithFields';
import FileDisplayDialog from '../../../../Components/fileDisplayDialog';
import DeleteIcon from './../../../../images/deleteHcRow.png';
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Close from './../../../../images/close.png';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CmeFileConfirmation from '../../../../Components/CmeFileConfirmationDiaog';

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
    const [checkingCondition, setCheckingCondition] = useState([]);
    const [showCmeConfirmationDialog, setShowCmeConfirmationDialog] = useState(false);

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
        if (basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 && basicForm?.basicDetails?.applicant?.applicantType !== "Midwife" && basicForm?.basicDetails?.applicant?.applicantType !== "Dentist") {
            setIsChecked(false)
            setIsSigned(false);
        }
        if (basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 90 && basicForm?.basicDetails?.applicant?.applicantType !== "Midwife" && basicForm?.basicDetails?.applicant?.applicantType === "Dentist") {
            setIsChecked(false)
            setIsSigned(false);
        }
    }, [basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours])

    useEffect(() => {
        let tempData = basicForm?.forms?.[formIndex]?.data ?? {};
        tempData.yesOrNoCMETranscript = yesOrNoCMETranscript;

        const fileData = tempData?.cmeTranscripts?.file;
        const creditOrHours = tempData?.cmeTranscripts?.creditOrHours;
        const isSigned = basicForm?.forms?.[formIndex]?.esign;
        const applicantType = basicForm?.basicDetails?.applicant?.applicantType;

        if (tempData.yesOrNoCMETranscript === 'No' && notes) {
            setCheckingCondition(['Completed']);
            return;
        }

        if (applicantType === "Midwife") {
            if (!tempData.yesOrNoCMETranscript || fileData == null) {
                setCheckingCondition(['notYetStarted']);
            } else if (fileData && isSigned) {
                setCheckingCondition(['Completed']);
            } else if (notes) {
                setCheckingCondition(['Completed']);
            } else if (!notes) {
                setCheckingCondition(['notYetStarted']);
            } else {
                setCheckingCondition(['inProgress']);
            }
        }
        else if (applicantType === "Dentist") {
            if (!tempData.yesOrNoCMETranscript || fileData == null) {
                setCheckingCondition(['notYetStarted']);
            } else if (fileData && creditOrHours >= 90 && isSigned) {
                setCheckingCondition(['Completed']);
            } else if (fileData && creditOrHours < 90 && notes) {
                setCheckingCondition(['Completed']);
            } else if (fileData && creditOrHours < 90) {
                setCheckingCondition(['notYetStarted']);
            } else {
                setCheckingCondition(['inProgress']);
            }
        }
        else {
            if (!tempData.yesOrNoCMETranscript || fileData == null) {
                setCheckingCondition(['notYetStarted']);
            } else if (fileData && creditOrHours >= 25 && isSigned) {
                setCheckingCondition(['Completed']);
            } else if (fileData && creditOrHours < 25 && notes) {
                setCheckingCondition(['Completed']);
            } else if (fileData && creditOrHours < 25) {
                setCheckingCondition(['notYetStarted']);
            } else {
                setCheckingCondition(['inProgress']);
            }
        }

        console.log('Checking Condition:', checkingCondition);
    }, [basicForm, formIndex, yesOrNoCMETranscript, isSigned, notes]);

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

    const getIsSaveInProgressOpen = async (value) => {
        if (value) {
            await handleContinue("save");
            setIsSaveInProgressOpen(value);
        }
    };

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
        if (basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName) {
            handleCMETranscriptDelete()
        }
        // let table = tempValue.table !== undefined ? tempValue.table : []

        const formData = new FormData();
        let fileNameArray = [];
        // event?.forEach(file => {
        //     fileNameArray.push({ "fileName": file?.name });
        //     formData.append('documents', file); // Append each file individually
        // });
        let fileName = { "fileName": event?.[0]?.name }
        formData.append('documents', event?.[0]);
        formData.append('files', new Blob([JSON.stringify(fileName)], {
            type: "application/json"
        }));
        console.log(fileNameArray)
        try {
            // const response = await POST(`application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${true}`, formData);
            const response = await POST(`application-management-service/application/${applicationId}/files?isLLMRequired=${true}&schemaId=${formSchemaWholeObject?.id}`, formData);
            SuccessToaster('File Uploaded Successfully');
            console.log(response?.data);
            setFields(response?.data?.fields);
            setFile(response?.data?.file);
            setFileMetadata(response?.data?.metaData);
            setApplicationDocumentId(response?.data?.id)
            // for (let triggerIndex = 0; triggerIndex < event.length; triggerIndex++) {
            try {
                if (response?.data?.documentType !== null) {
                    await PUT(`application-management-service/application/${applicationId}/form/updateData?documentType=${response?.data?.documentType?.name}&applicationDocumentId=${response?.data?.id}`, { documentType: response?.data?.documentType !== null ? response?.data?.documentType?.name : '', fileSize: `${(event[0]?.size / (1024 * 1024)).toFixed(2)} Mb`, fileURL: response?.data?.file?.fileURL, fileType: response?.data?.file?.fileType, fileUploaded: event[0]?.name, requirement: response?.data?.documentType !== null ? basicForm?.documentsRequired?.filter(data => data?.document?.name === response?.data?.documentType?.name)?.[0]?.required ? 'Required' : 'Recommended' : '', valid: response?.data?.valid, verified: response?.data?.verified, rowId: response?.data?.id });
                }
                console.log(response);
            } catch (error) {
                console.log(error);
            }
            // }
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

    const handleContinue = async (actionType) => {
        let tempData = basicForm?.forms?.[formIndex]?.data !== null ? basicForm?.forms?.[formIndex]?.data : {};
        if (yesOrNoCMETranscript === "No") {
            setYesOrNoCME("No");

            if (tempData?.cmeTranscripts?.file?.fileName) {
                try {
                    await DELETE(
                        `application-management-service/application/${applicationId}/deleteFiles?applicationDocumentIds=${[tempData?.cmeTranscripts?.rowId]}`,
                        [tempData?.cmeTranscripts]
                    );
                    SuccessToaster("Transcript File Deleted Successfully");
                } catch (error) {
                    ErrorToaster("Unexpected Error Deleting Transcript File");
                }
            }

            delete tempData.cmeTranscripts;
            delete tempData.esign;
        }

        tempData.yesOrNoCME = yesOrNoCME;
        tempData.yesOrNoCMETranscript = yesOrNoCMETranscript;
        tempData.notes = notes;
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: tempData,
            unFilledFields: checkingCondition,
            acknowledged: true,
            ...(yesOrNoCMETranscript === "Yes"
                ? {
                    esign:
                        actionType === "skip" || actionType === "save"
                            ? { esign: '', name: '', signedDate: '' }
                            : {
                                esign: isSigned ? encryptedText : '',
                                name: isSigned ? name : '',
                                signedDate: isSigned ? currentDate : ''
                            }
                }
                : {})
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication(); // only fetch data again if not "save"
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            })
        if (actionType === "continue" || actionType === "skip") {
            if (sessionStorage.getItem('fromSummary') === "true") {
                navigate(-1);
            }
            else {
                navigate(navigateURL)

            }
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
                        <WelcomeCard title={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.label }} />}
                            description={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.description }} />} />
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
                                    <Tooltip title={"Click to mark as Yes"} arrow>
                                        <div
                                            className={`${style.reappointmentButtonOutlined}`}
                                            onClick={() => { setSelectedUpload('transcript'); setYesOrNoCMETranscript('Yes'); setUpdatedDateCMETranscript(format(new Date(), "yyyy-MM-dd'T'00:00")); setShowUploadDialog(true) }}
                                        >
                                            YES
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={"Click to mark as No"} arrow>
                                        <div
                                            className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                            onClick={() => { setYesOrNoCMETranscript('No'); setUpdatedDateCMETranscript(format(new Date(), "yyyy-MM-dd'T'00:00")) }}
                                        >
                                            NO
                                        </div>
                                    </Tooltip>
                                </div>
                            ) : (
                                <>
                                    <div className={`${style.markedAsText} ${style.marginTop10}`}><strong>Marked as <span className={yesOrNoCMETranscript === 'Yes' ? style.yesText : style.noText}>{yesOrNoCMETranscript}</span></strong> on {format(new Date(updatedDateCMETranscript), "MMM dd, yyyy")}</div>
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                    >
                                        <Tooltip title={"Click to View & Modify"} arrow>
                                            <div
                                                className={`${style.reappointmentButtonEdit}`}
                                                onClick={() => {
                                                    const matchedForm = basicForm?.forms?.find(
                                                        form =>
                                                            form?.schemaCategory === 'UploadYourDoc' &&
                                                            form?.data?.table?.some(doc => doc?.documentType === 'CME Credit Summary')
                                                    );

                                                    if (
                                                        basicForm?.forms?.[formIndex]?.data?.yesOrNoCMETranscript === 'Yes' &&
                                                        matchedForm
                                                    ) {
                                                        setShowCmeConfirmationDialog(true);
                                                    } else {
                                                        setYesOrNoCMETranscript('');
                                                    }
                                                }}

                                            >
                                                VIEW TO MODIFY
                                            </div>
                                        </Tooltip>
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
                                        <Tooltip title={basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.valid ? "Valid Transcript" : "Not Valid"} arrow>
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
                                        <Tooltip title={"Click to Delete Transcript"} arrow>
                                            <img src={DeleteIcon} alt="" className={`${style.imgIcon} ${style.cursorPointer}`} onClick={() => { handleCMETranscriptDelete() }} />
                                        </Tooltip>
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
                                ) : basicForm?.basicDetails?.applicant?.applicantType === "Dentist" ? (
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
                                                            {(90 - basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours) > 0 && (
                                                                <div className={style.hourRemainingText}>{90 - basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours} more needed</div>
                                                            )}
                                                        </div>
                                                    </Tooltip>
                                                    <div className={style.cmeHourCard}>
                                                        <div className={style.totalText}>Required</div>
                                                        <div className={style.hourText}>90</div>
                                                        <div className={style.totalText}>Credits / Hours</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 90 ? (
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
                                            <div className={basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 90 ? style.disabled : ''}>
                                                <div className={`${style.checkGrid}`}>
                                                    {formContent?.disclaimer?.content !== null && (
                                                        <span>
                                                            <CommonCheckBox checked={isChecked} onChange={basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 90 ? () => { } : (e) => handleIsChecked(e.target.checked)} bigCheckbox={true} />
                                                        </span>
                                                    )}
                                                    <div
                                                        className={`${style.leftAlign} ${style.marginTop10}`}
                                                        dangerouslySetInnerHTML={{ __html: "<p>I certify that I have completed the CME / CEU requirements of 90 hours of college approved education hours in the past 12 months.</p>" }}
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
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => handleContinue("skip")}>SKIP FOR NOW</div></Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div></Tooltip>
                        <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                            <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleBackClick()}>BACK</div></Tooltip>
                        <Tooltip title={isContinueEnabled ? "Click to Proceed to the Next Step" : ""} arrow>
                            <div className={`${style.continue} ${style.marginTop} ${isContinueEnabled ? '' : style.disabledButton}`} onClick={isContinueEnabled ? () => handleContinue("continue") : () => { }}>CONTINUE</div></Tooltip>
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
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => handleContinue("skip")}>SKIP FOR NOW</div></Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div></Tooltip>
                        <div className={style.twoColForButton}>
                            <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                                <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleBackClick()}>BACK</div></Tooltip>
                            <Tooltip title={isContinueEnabled ? "Click to Proceed to the Next Step" : ""} arrow>
                                <div className={`${style.continue} ${style.marginTop10} ${isContinueEnabled ? '' : style.disabledButton}`} onClick={isContinueEnabled ? () => handleContinue("continue") : () => { }}>CONTINUE</div></Tooltip>
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
                                maxFiles={1}
                            />
                            <CommonDropZone
                                title={"Upload A Photo"}
                                description={
                                    "Take a picture with your Camera or Upload from Gallery."
                                }
                                changeHandler={changeHandler}
                                files={files}
                                accept="image/*"
                                maxFiles={1}
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
            {showCmeConfirmationDialog && (
                <CmeFileConfirmation
                    getShowCmeFileConfirmation={setShowCmeConfirmationDialog}
                    getCmeFileConfirmation={(confirmed) => {
                        if (confirmed) {
                            if (basicForm?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName) {
                                handleCMETranscriptDelete();
                            }
                            setYesOrNoCMETranscript('');
                        }
                    }}
                    confirmationText="You already have a CME Credit Summary document uploaded. Are you sure you want to change your CME Credit Summary Document?"
                />
            )}
        </div>
    )
}

export default CME;
