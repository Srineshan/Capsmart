import React, { useEffect, useRef, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CryptoJS from 'crypto-js';
import { GET, PUT, POST, DELETE } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import PDFDocs from './../../../images/PDFDocs.png';
import WordDoc from './../../../images/wordDoc.png';
import imgDocs from './../../../images/imgDocs.png';
import JourneyStep2 from './../../../images/journeyStep2.png';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "./../../../images/crossPink.png";
import DeleteIcon from './../../../images/deleteHcRow.png';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import style from './index.module.scss';
import DoneIcon from '@mui/icons-material/Done';
import { format } from 'date-fns';
import CommonDropZone from '../../../Components/CommonFields/CommonDropZone';
import ESignDialog from '../../../Components/ESignDialog';
import TableTwo from '../../../Components/TableDesignTwo';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import { fileLoadingURL, getValueByPath } from '../../../utils/formatting';
import FileDisplayDialog from '../../../Components/fileDisplayDialog';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';
import ESignConfirmationDialog from '../../../Components/ESignConfirmation';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import { loadStripe } from "@stripe/stripe-js";
import ESignature from '../../../Components/ESignature';

const stripePromise = loadStripe("your-publishable-key");

const UploadYourDoc = ({ basicForm, setBasicForm, applicationId, getPreApplication, dateFormat, name }) => {
    const { section, step } = useParams()
    const [sessionDetails, setSessionDetails] = useState(null);
    const [formSchema, setFormSchema] = useState();
    const fileInputRef = useRef(null);
    const [isEdited, setIsEdited] = useState(false);
    const [openCategoryIndex, setOpenCategoryIndex] = useState(-1);
    const [applicantProfile, setApplicantProfile] = useState();
    const [isShowESignDialog, setIsShowESignDialog] = useState(false);
    const [isShowESignConfirmationDialog, setIsShowESignConfirmationDialog] = useState(false);
    const [files, setFiles] = useState([]);
    const [isCollapsableCard, setIsCollapsableCard] = useState(true);
    const [replaceFileIndex, setReplaceFileIndex] = useState(-1);
    const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
    const [selectedFile, setselectedFile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowUploadValidation, setIsShowUploadValidation] = useState(false);
    const [formIndex, setFormIndex] = useState();
    let eSignTitle = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.title`);
    let eSignInitial = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.initial`)
    let eSignImg = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.file`);
    let eSignTypeContent = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.type.text`);
    let eSignTypeContentStyle = getValueByPath(basicForm, `forms[${formIndex}].data.setUpYourSignature.type.style`);
    let showRedBorderForESign = ((eSignTitle === '' || eSignTitle === undefined) || (eSignInitial === '' || eSignInitial === undefined))
    let tempValue = basicForm?.forms?.[formIndex]?.data === null ? { setUpYourSignature: {}, table: [] } : basicForm?.forms?.[formIndex]?.data;
    const navigate = useNavigate()
    const [navigateURL, setNavigateURL] = useState();
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(eSignTypeContent + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState(format(new Date(), dateFormat));
    useEffect(() => {
        if (basicForm) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form' || 'Disclosure')?.length === (formIndex + 1)) ? `/reappointmentApplicationForm/${applicationId}/Form/${btoa(`PODCheck`)}` : `/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const query = new URLSearchParams(window.location.search);
            const sessionId = query.get("session_id");
            console.log(sessionId, 'sessionDetails');
            if (!sessionId) {
                console.error("No session_id found in URL");
                return;
            }

            const stripe = await stripePromise;

            // try {
            // const session = await stripe.retrieveSession(sessionId);
            const session = await stripe?.checkout?.session(sessionId);
            console.log(session, 'sessionDetails');
            setSessionDetails(session);
            // } catch (error) {
            //     console.error("Error fetching session details:", error.message);
            // }
        };

        fetchSessionDetails();
    }, []);

    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        setApplicantProfile(profile)
    }


    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const getIsOpen = (value) => {
        setIsShowESignDialog(value);
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getIsOpenESignConfirmation = (value) => {
        setIsShowESignConfirmationDialog(value);
    }

    const updateFunc = () => {
        setIsShowESignDialog(true);
    }

    const confirmESign = async () => {
        let data = applicantProfile;
        data.signature.updated = true
        console.log(data)
        await PUT(`application-management-service/application/${applicationId}/profile`, data)
            .then(response => {
                console.log(response)
                SuccessToaster("Staff Member Application Updated Successfully");
                getPreApplication();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Staff Member Application");
            });
    }

    const getIsShowFileDialog = (value) => {
        setShowFileDisplayDialog(value);
    }

    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
    }

    const generateRandomId = () => {
        return `id-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    };

    const handleFileUpload = async (e, id) => {
        setIsEdited(true);
        let file = await addNewDocument(e.target.files[0]);
        if (tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'] === undefined) {
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documentName'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['mandatory'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.required
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'] = [{ file: file, fileName: e.target.files[0]?.name, documentName: tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name, dateUploaded: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"), valid: true, verified: true }]
        } else {
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documentName'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['mandatory'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.required
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'].push({ file: file, fileName: e.target.files[0]?.name, documentName: tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.name, dateUploaded: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"), valid: true, verified: true })
        }
        console.log(tempValue, e.target.files[0])
    }

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": file?.name
        };
        const formData = new FormData();

        if (file !== null) {
            formData.append('files', new Blob([JSON.stringify(fileName)], {
                type: "application/json"
            }));
            formData.append('documents', file);
            try {
                const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
                SuccessToaster('File Uploaded Successfully');
                console.log(response?.data);
                return response?.data;
            } catch (error) {
                ErrorToaster('File Upload Failed');
                console.error(error);
                return null;
            }
        }
    }

    const handleSubmitApplicationReq = async (tableData) => {
        tempValue.table = tableData;
        console.log(tableData)
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: tempValue
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }
    console.log(formSchema, basicForm, tempValue)

    const changeHandler = async (event) => {
        setIsLoading(true);
        setFiles(event);
        console.log(event, 'Test');
        let table = tempValue.table !== undefined ? tempValue.table : []

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
            event.map((data, index) => {
                table.push({ documentType: response?.data[index]?.documentType !== null ? response?.data[index]?.documentType?.name : '', fileURL: response?.data[index]?.file?.fileURL, fileType: response?.data[index]?.file?.fileType, fileUploaded: data?.name, requirement: response?.data[index]?.documentType !== null ? basicForm?.documentsRequired?.filter(data => data?.document?.name === response?.data[index]?.documentType?.name)?.[0]?.required ? 'Required' : 'Recommended' : '', valid: response?.data[index]?.valid, verified: response?.data[index]?.verified, rowId: response?.data[index]?.id })
            })
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
            handleSubmitApplicationReq(table)
            setIsLoading(false);
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error(error);
            setIsLoading(false);
            return null;
        }
    };

    const handleChange = async (value, index) => {
        setIsLoading(true)
        console.log(tempValue?.table, value, index, '142')
        let temp = tempValue?.table;
        let tempDocumentData = {
            file: {
                fileURL: temp[index]?.fileURL,
                fileName: temp[index]?.fileUploaded
            },
            verified: temp[index]?.verified !== "" ? temp[index]?.verified : false,
            valid: temp[index]?.valid !== "" ? temp[index]?.valid : false,
            documentType: value,
            required: temp[index]?.requirement === 'Mandatory' ? 'Required' : 'ToBeDecided',
        };

        // let documentData = {
        //     uploadedDocument: tempDocumentData
        // }
        // await PUT(`application-management-service/application/${applicationId}/addUploadedDocuments`, documentData)
        //     .then(response => {
        //         console.log(response)
        //         temp[index].verified = response?.data?.verified;
        //         temp[index].valid = response?.data?.valid;
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });
        temp[index].documentType = value;
        if (value !== null || value !== "") {
            temp[index].requirement = basicForm?.documentsRequired?.filter(data => data?.document?.name === value)?.[0]?.required ? 'Required' : 'Recommended';
        }
        console.log(temp)
        await PUT(`application-management-service/application/${applicationId}/form/updateData?documentType=${value}&applicationDocumentId=${temp[index]?.rowId}`, temp[index])
            .then(response => {
                console.log(response)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
            });
        handleSubmitApplicationReq(temp)
    }

    const getDropDownValues = (type) => {
        let value = [];
        basicForm?.documentsRequired?.map(data => {
            if (data?.multiFile) {
                console.log(data?.document?.name)
                value.push(data?.document?.name)
            } else if (type === data?.document?.name) {
                value.push(data?.document?.name)
            } else {
                if (tempValue?.table?.filter(singleFileData => singleFileData?.documentType === data?.document?.name)?.length === 0) {
                    value.push(data?.document?.name)
                    console.log(data?.document?.name, tempValue?.table, data)
                }
            }
        })
        console.log(tempValue?.table?.filter(singleFileData => singleFileData?.documentType === 'Current Curriculam Vitae'))
        return value;
    }


    const getApplicantValues = (array) => {
        let temp = [];
        console.log(array, 'array')
        Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.map((data, index) => {
            if (data === "file") {
                temp.push({
                    "type": "icon", "icon": array?.map(innerData => innerData?.fileType === 'application/pdf' ?
                        <img src={PDFDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} />
                        : innerData?.fileType?.startsWith("image/") ?
                            <img src={imgDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData) }} /> : <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.fileURL, '_blank'); }} />), 'isShowHoverText': false
                });
            } else {
                if (data === "documentType") {
                    temp.push({
                        "type": "field", "field": array?.map((innerData, innerIndex) => <CommonSelectField
                            value={innerData[data]}
                            onChange={(e) => handleChange(e.target.value, innerIndex)}
                            className={style.fullWidth}
                            // firstOptionLabel={fieldData.label}
                            // firstOptionValue={fieldData.label}
                            valueList={getDropDownValues(innerData[data]) || []}
                            labelList={getDropDownValues(innerData[data]) || []}
                            disabledList={getDropDownValues(innerData[data])?.map(data => false)}
                        />)
                    });
                } else if (data === "valid") {
                    temp.push({ "type": "icon", "icon": array?.map(innerData => innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 13 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 13 }} />), 'isShowHoverText': false });
                } else if (data === "verified") {
                    temp.push({ "type": "icon", "icon": array?.map(innerData => innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 20 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 20 }} />), 'isShowHoverText': false });
                } else {
                    temp.push({
                        "type": "text",
                        "value": array?.map(innerData =>
                            innerData[data] && (
                                <span
                                    onClick={() => {
                                        setShowFileDisplayDialog(true);
                                        setselectedFile(innerData);
                                    }}
                                >
                                    {innerData[data]}
                                </span>
                            )
                        )
                    });
                    ;
                }
            }
            if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
                // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
                temp.push({
                    "type": "icon", "icon": array?.map(innerData =>
                        <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { handleDelete(innerData) }} />
                    ), 'isShowHoverText': false
                });
            }
        })
        console.log(temp, array, basicForm?.documentsRequired?.map(data => data?.document?.name))
        return temp;
    }

    const handleReplace = (data) => {
        let index = tempValue?.table?.findIndex(fileData => fileData?.documentType === data?.documentType);
        setReplaceFileIndex(index);
        console.log(data)
        fileInputRef.current.click();
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        let temp = tempValue.table;
        if (file) {
            console.log('Selected file:', file);
            let fileObj = await addNewDocument(file);
            if (replaceFileIndex !== -1) {
                temp[replaceFileIndex].fileURL = fileObj?.fileURL
                temp[replaceFileIndex].fileUploaded = file?.name
            }
        }
        handleSubmitApplicationReq(temp)
    };

    const handleDelete = async (data) => {
        let temp = tempValue?.table;
        temp = temp.filter(obj => !isEqual(obj, data))
        console.log(temp, data)
        await DELETE(`application-management-service/application/${applicationId}/deleteFiles?applicationDocumentIds=${[data?.rowId]}`, [data])
            .then((response) => {
                SuccessToaster("File Deleted Successfully");
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Deleting File");
            });
        handleSubmitApplicationReq(temp)
    }

    const isEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const actions = [
        { 'data': 'Replace', 'requiredValue': 'boolean', "onClick": handleReplace },
        { 'data': 'Delete', 'requiredValue': 'boolean', "onClick": handleDelete },
    ]

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    console.log(showRedBorderForESign, eSignInitial, eSignTitle)

    const handleContinue = async (skip) => {
        if (tempValue?.table?.filter(data => data?.documentType === "")?.length !== 0 && tempValue?.table !== undefined) {
            ErrorToaster('Please select the missing document type for the uploaded documents')
        }
        else {
            setIsLoading(true);
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: basicForm?.forms?.[formIndex]?.data,
                unFilledFields: getMissingDocs()?.map(data => data?.document?.name),
                acknowledged: skip === "skipped" ? false : true
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    getPreApplication()
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
            if (tempValue?.table !== undefined) {
                await PUT(`application-management-service/application/${applicationId}/addUploadedDocuments`, tempValue?.table)
                    .then(response => {
                        console.log(response)
                        getPreApplication();
                        setIsLoading(false);
                        // temp[index].verified = response?.data?.verified;
                        // temp[index].valid = response?.data?.valid;
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            }
            if (sessionStorage.getItem('fromSummary') === "true") {
                navigate(-1);
            } else {
                navigate(navigateURL)
            }
            setIsLoading(false);
        }
    }

    // if (isLoading) {
    //     return (
    //         <div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>
    //             <img src={FileLoading} alt="" className={style.fileLoadingStyle} />
    //         </div>
    //     )
    // }

    const getMissingDocs = () => {
        let temp = []
        basicForm?.documentsRequired?.map((data, index) => {
            if ((basicForm?.forms?.[formIndex]?.data !== null && tempValue?.table?.filter(tableData => tableData?.documentType === data?.document?.name)?.length === 0 && data?.required)) {
                temp.push(data)
            }
        })
        return temp;
    }

    console.log(tempValue?.table?.filter(tableData => !tableData?.documentType?.includes(basicForm?.documentsRequired?.filter(data => data?.required)?.map(data => data?.document?.name))), 'checkconsole', tempValue?.table, basicForm?.documentsRequired?.filter(data => data?.required)?.map(data => data?.document?.name), getMissingDocs())

    return (
        <div>
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            <div className={`${style.applicationScreenGrid}`}>
                <div>
                    <ReappointmentProgressCard
                        step={""}
                        dataType={formSchema?.description}
                        title={formSchema?.title}
                        timeNumber={1}
                        timeText={"Min"}
                        progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
                        basicForm={basicForm}
                    />
                    <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                        {/* <div className={style.titleText}>{formSchema?.description}</div>
                    <div className={`${style.descriptionText} ${style.marginTop10}`}>Ensure your documents are in the following formats: pdf, jpg, (add icons here) </div> */}
                        {/* <div className={`${style.dragAndDropBox} ${style.marginTop}`}>
                        <div className={style.dragAndDropText}>Drag And Drop All Your File Here</div>
                        <div className={style.dragAndDropDescriptionText}>Let Charlie our AI Credentialing assistant Organize, classify and extract data for your application</div>
                    </div> */}
                        {formSchema !== undefined &&
                            "uploadTheDocument" in formSchema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.properties?.uploadTheDocument}
                                    gridStyle={style.twoCol}
                                    baseKey={"uploadTheDocument"}
                                    basicForm={basicForm}
                                    setBasicForm={setBasicForm}
                                    stepPath={`forms[${formIndex}].data`}
                                />
                            )}
                        {/* <div className={`${style.addMoreBorder}`}>
                            <div className={style.padding20}>
                                <div className={style.spaceBetween}>
                                    <div className={style.collapsableCardText}>
                                        To optimize your time for completing this application upload or provide the following documents.
                                    </div>
                                    {isCollapsableCard ? (
                                        <div onClick={() => setIsCollapsableCard(false)}>
                                            <KeyboardArrowUpIcon sx={{ color: "#c4bef3" }} />
                                        </div>
                                    ) : (
                                        <div onClick={() => setIsCollapsableCard(true)}>
                                            <KeyboardArrowDownIcon sx={{ color: "#c4bef3" }} />
                                        </div>
                                    )}
                                </div> */}
                        {/* {isCollapsableCard && (
                                    <>
                                        <CommonDivider /> */}
                        {/* <div
                            className={`${style.tableHeader} ${style.tableGrid} ${style.marginTop}`}
                        >
                            <div
                                className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}
                            >
                                Documents you will require
                            </div>
                            
                            <div
                                className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}
                            ></div>
                        </div> */}
                        {basicForm?.documentsRequired?.map((data, index) => (
                            <div>
                                <div
                                    className={`${style.requiredDocumentCard} ${style.tableGrid
                                        } ${basicForm?.forms?.[formIndex]?.data !== null &&
                                            tempValue?.table?.filter(
                                                (tableData) =>
                                                    tableData?.documentType ===
                                                    data?.document?.name
                                            )?.length === 0 &&
                                            data?.required
                                            ? style.redBorder
                                            : ""
                                        } ${index % 2 === 0
                                            ? style.requiredDocumentCardAlternativeColor
                                            : ""
                                        }  ${style.marginTop2}`}
                                >
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                    >
                                        <div
                                            className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                                        >
                                            {data?.document?.name}
                                        </div>
                                        {/* <InfoOutlinedIcon
                                            sx={{ fontSize: 14, marginLeft: "10px" }}
                                            className={style.info}
                                        /> */}
                                    </div>
                                    <div
                                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                                    >
                                        {data?.required ? "Required" : "Recommended"}
                                    </div>
                                    <div
                                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                                    >
                                        {data?.instruction}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* </>
                                )} */}
                        {/* </div>
                        </div> */}
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
                        {tempValue?.table?.length !== 0 && tempValue?.table !== undefined && (
                            <div className={style.tableContainer}>
                            <TableTwo
                                tableHeaderValues={[
                                    "",
                                    "File Uploaded",
                                    "Document Type",
                                    "",
                                    "Verified",
                                    "Valid",
                                    "",
                                ]}
                                tableDataValues={getApplicantValues(tempValue?.table)}
                                tableData={tempValue?.table || []}
                                gridStyle={style.gridStyle}
                                actions={actions}
                                // scrollStyle={style.contractScrollStyle}
                                tableSortValues={[]}
                                heading={"You have not yet uploaded any documents."}
                                onClickFunction={() => { }}
                            />
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }} // Hide the actual file input
                        />
                         {((basicForm?.forms?.[formIndex]?.data !== null &&
                            !showRedBorderForESign) || basicForm?.applicant?.signature?.updated) ? (
                            <>
                                {/* <div
                                    className={`${style.setupCompleteCard} ${style.setupCompleteGrid}  ${style.marginTop}`}

                                >
                                    <div></div>
                                    <div
                                        className={`${style.displayInRow} ${style.justifyCenter}`}
                                    >
                                        <DoneIcon sx={{ color: "#06617A", fontSize: 25 }} />
                                        <div
                                            className={`${style.setupCompletedText} ${style.marginLeft10}`}
                                        >
                                            eSignature Available on File
                                        </div>
                                    </div>
                                    <div className={`${style.editOrUpdateESign} ${style.cursorPointer}`} onClick={() => setIsShowESignDialog(true)}>Edit / Update</div>
                                </div>
                                <div className={`${style.marginTop} ${style.gridContainer}`}>
                                    <div ><img src={eSignImg?.fileURL} alt="" height={30} width={100} /></div>
                                    <div><strong>{eSignTitle}</strong></div>
                                    <div><strong>{eSignInitial}</strong></div>
                                    <div style={{
                                        fontFamily: eSignTypeContentStyle,
                                        fontSize: "24px",
                                    }}>{eSignTypeContent}</div>
                                </div> */}
                                {/* <div className={`${style.eSignatureOnFileCard} ${style.marginTop10}`}>
                                    <div className={style.eSignatureOnFileTitle}>Your eSignature On File</div>
                                    <div>
                                        <div className={style.eSignGrid}>
                                            <ESignature
                                                userName={name}
                                                encData={encryptedText}
                                                showData={true}
                                                showDatais={true}
                                            />
                                            <div className={style.verticalAlignCenter}>
                                                <div className={style.displayInRow}>
                                                    <div className={style.dateTitle}>Date: </div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>{currentDate}</div>
                                                </div>
                                            </div>
                                            <div className={style.verticalAlignCenter}>
                                                <div className={style.dateTitle}>{eSignTitle}</div>
                                            </div>
                                        </div>
                                        <div className={style.eSignatureOnFileButton}>
                                            <div className={`${style.continue} ${style.eSignatureOnFileButtonPadding}`} onClick={() => setIsShowESignDialog(true)}>CLICK TO UPDATE</div>
                                        </div>
                                    </div>
                                </div> */}
                            </>
                        ) : (
                            <div
                                className={style.marginTop}
                                onClick={() => setIsShowESignConfirmationDialog(true)}
                            >
                                <div
                                    className={`${style.uploadBorderStyle} ${basicForm?.forms?.[formIndex]?.data !== null &&
                                        showRedBorderForESign
                                        ? style.redBorder
                                        : ""
                                        }`}
                                >
                                    <p className={style.uploadTextStyle}>
                                        {"Confirm Your eSignature"}
                                    </p>

                                    <p className={style.uploadDescriptionText}>
                                        {
                                            "Our paperless automated application submission uses electronic signatures with digital fingerprinting.Set up your electronic signature"
                                        }
                                    </p>

                                </div>
                            </div>
                        )}
                    </div>
                    <div className={style.threeColForButton}>
                        {/* <div className={`${style.continue} ${style.marginTop}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleContinue()}>CONTINUE</div> */}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard
                        user={"Neena Greenly"}
                        designation={"{Designation}"}
                        contactNumber={"{Contact Number}"}
                        email={"{Email}"}
                    />
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen || isShowESignDialog || showJourneyDialog || isShowUploadValidation
                        || showFileDisplayDialog || isShowESignConfirmationDialog ? style.hiddenStickyContainer : ""}`}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>
                            SAVE IN PROGRESS
                        </div>
                        {/* <div
                        className={`${style.saveInProgress} ${style.marginTop10} ${basicForm?.forms?.[formIndex]?.data !== null &&
                            getMissingDocs()?.length === 0
                            ? style.disabledButton
                            : ""
                            }`}
                        onClick={
                            basicForm?.forms?.[formIndex]?.data !== null &&
                                getMissingDocs()?.length === 0
                                ? () => { }
                                : () => setIsShowUploadValidation(true)
                        }
                    >
                        SKIP FOR NOW
                    </div> */}
                        <div className={style.twoColForButton}>
                            <div
                                className={`${style.continue} ${style.marginTop10}`}
                                onClick={() => navigate(-1)}
                            >
                                BACK
                            </div>
                            {/* <div
                            className={`${style.continue} ${style.marginTop10}`}
                            onClick={
                                // (basicForm?.forms?.[formIndex]?.data !== null &&
                                //     showRedBorderForESign) ||
                                //     (basicForm?.forms?.[formIndex]?.data !== null &&
                                //         getMissingDocs()?.length !== 0)
                                //     ? () => { }
                                //     : 
                                () => setShowJourneyDialog(true)
                            }
                        >
                            CONTINUE
                        </div> */}
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                        </div>
                    </div>
                    {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                </div>
            </div>
            {isShowESignDialog && (
                <ESignDialog
                    getIsOpen={getIsOpen}
                    tempValue={tempValue}
                    baseKey={"setUpYourSignature"}
                    applicationId={applicationId}
                    basicForm={basicForm}
                    setBasicForm={setBasicForm}
                    getPreApplication={getPreApplication}
                >
                    {formSchema !== undefined &&
                        "setUpYourSignature" in formSchema?.properties && (
                            <ApplicationFieldCard
                                object={formSchema?.properties?.setUpYourSignature}
                                gridStyle={style.twoCol}
                                baseKey={"setUpYourSignature"}
                                basicForm={basicForm}
                                setBasicForm={setBasicForm}
                                stepPath={`forms[${formIndex}].data`}
                                setIsEdited={getIsEdited}
                            />
                        )}
                </ESignDialog>
            )}
            {isShowESignConfirmationDialog && (
                <ESignConfirmationDialog
                    getIsOpen={getIsOpenESignConfirmation}
                    tempValue={tempValue}
                    baseKey={"setUpYourSignature"}
                    applicationId={applicationId}
                    basicForm={basicForm}
                    setBasicForm={setBasicForm}
                    updateFunc={updateFunc}
                    confirmFunc={confirmESign}
                />
            )}
            {showFileDisplayDialog && (
                <FileDisplayDialog
                    getIsOpen={getIsShowFileDialog}
                    file={selectedFile}
                />
            )}
            {showJourneyDialog && (
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Leveling Up! Keep Up The Good Work.`} img={JourneyStep2} formIndex={formIndex} basicForm={basicForm} continueClick={handleContinue} />
            )}
            <Dialog
                isOpen={isShowUploadValidation}
                onClose={() => setIsShowUploadValidation(false)}
                className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                canOutsideClickClose={false}
                canEscapeKeyClose={false}
            >
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>
                                You are missing some required documents
                            </div>
                            <div className={style.displayInRow}>
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                    onClick={() => {
                                        setIsShowUploadValidation(false);
                                    }}
                                />
                            </div>
                        </div>
                        <p className={`${style.description} ${style.marginTop}`}>
                            You are missing documents that are required to proceed with this
                            application. To ensure a complete & successful submission
                            provide all of the required documents.
                        </p>
                        <div
                            className={`${style.tableHeader} ${style.tableGridValidation} ${style.marginTop}`}
                        >
                            <div
                                className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}
                            >
                                Document Type
                            </div>
                            <div
                                className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}
                            >
                                Requirements
                            </div>
                        </div>
                        {getMissingDocs()?.map((data, index) => (
                            <div>
                                <div
                                    className={`${style.requiredDocumentCard} ${style.tableGridValidation
                                        }  ${index % 2 === 0
                                            ? style.requiredDocumentCardAlternativeColor
                                            : ""
                                        }  ${style.marginTop5}`}
                                >
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter}`}
                                    >
                                        <div
                                            className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                                        >
                                            {data?.document?.name}
                                        </div>
                                        <InfoOutlinedIcon
                                            sx={{ fontSize: 14, marginLeft: "10px" }}
                                            className={style.info}
                                        />
                                    </div>
                                    <div
                                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                                    >
                                        {data?.required ? "Required" : "Recommended"}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                            <div
                                className={`${style.saveInProgressValidation}`}
                                onClick={() => {
                                    setIsShowUploadValidation(false);
                                    handleContinue("skipped");
                                }}
                            >
                                SKIP FOR NOW
                            </div>
                            <div
                                className={`${style.continueValidation} ${style.marginLeft}`}
                                onClick={() => {
                                    setIsShowUploadValidation(false);
                                }}
                            >
                                CONTINUE UPLOADING
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
        </div>
    );
}

export default UploadYourDoc;