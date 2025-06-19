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
import { ErrorToaster, ErrorToaster2, SuccessToaster } from '../../../utils/toaster';
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
import { fileLoadingURL, getValueByPath, dataLoadingGIF } from '../../../utils/formatting';
import FileDisplayDialog from '../../../Components/fileDisplayDialog';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';
import ESignConfirmationDialog from '../../../Components/ESignConfirmation';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import { loadStripe } from "@stripe/stripe-js";
import ESignature from '../../../Components/ESignature';
import MenuIcon from "@mui/icons-material/Menu";
import EditIcon from '@mui/icons-material/Edit';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import Close from './../../../images/close.png';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { Tooltip } from '@mui/material';
import FileWithFields from '../../../Components/FileWithFields';
import DeleteConfirmation from '../../../Components/DeleteConfirmation';
import LocumProgressCard from '../../../Components/LocumProgressCard';

const stripePromise = loadStripe("your-publishable-key");

const UploadYourDoc = ({ basicForm, setBasicForm, applicationId, getPreApplication, dateFormat, name }) => {
    const { section, step } = useParams()
    const [sessionDetails, setSessionDetails] = useState(null);
    const [formSchema, setFormSchema] = useState();
    const fileInputRef = useRef(null);
    const tableRef = useRef(null);
    const [isEdited, setIsEdited] = useState(false);
    const [openCategoryIndex, setOpenCategoryIndex] = useState(-1);
    const [applicantProfile, setApplicantProfile] = useState();
    const [isShowESignDialog, setIsShowESignDialog] = useState(false);
    const [isShowESignConfirmationDialog, setIsShowESignConfirmationDialog] = useState(false);
    const [files, setFiles] = useState([]);
    const [isCollapsableCard, setIsCollapsableCard] = useState(true);
    const [replaceFileIndex, setReplaceFileIndex] = useState(-1);
    const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
    const [showFileWithFields, setShowFileWithFields] = useState(false);
    const [fields, setFields] = useState([]);
    const [fileMetadata, setFileMetadata] = useState();
    const [file, setFile] = useState();
    const [applicationDocumentId, setApplicationDocumentId] = useState('');
    const [selectedFile, setselectedFile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
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
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(eSignTypeContent + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState(format(new Date(), dateFormat));
    const [showInfo, setShowInfo] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteData, setDeleteData] = useState();
    const [refetchRefDoc, setRefetchRefDoc] = useState(false);
    useEffect(() => {
        if (basicForm) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex + 1]?.schemaCategory)}`);
            setNavigateBackURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    useEffect(() => {
        if (fileMetadata) {
            setShowFileWithFields(true)
        }
        console.log(fileMetadata, file, fields, 'fieldsssss')
    }, [fileMetadata])

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
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
        }
    }

    const getIsOpen = (value) => {
        setIsShowESignDialog(value);
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getDeleteConfirmation = (value) => {
        if (value) {
            handleDelete()
        }
    }

    const getResetRefetch = () => {
        setRefetchRefDoc(false);
    }

    const getIsOpenESignConfirmation = (value) => {
        setIsShowESignConfirmationDialog(value);
    }

    const getIsOpenFileWithFields = (value) => {
        setShowFileWithFields(value);
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
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documentName'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.shortName
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['mandatory'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.required
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'] = [{ file: file, fileName: e.target.files[0]?.name, documentName: tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.shortName, dateUploaded: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"), valid: true, verified: true }]
        } else {
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documentName'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.shortName
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['mandatory'] = tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.required
            tempValue.requiredDocuments.filter(data => data?.document?.id === id)[0]['documents'].push({ file: file, fileName: e.target.files[0]?.name, documentName: tempValue?.requiredDocuments?.filter(data => data?.document?.id === id)[0]?.document?.shortName, dateUploaded: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"), valid: true, verified: true })
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
                setRefetchRefDoc(true);
                console.log(response)
                setBasicForm(response?.data)
                getPreApplication();
                SuccessToaster("Application Updated Successfully");
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }
    console.log(formSchema, basicForm, tempValue)

    useEffect(() => {
        if (tempValue?.table?.length > 0) {
            tableRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [tempValue?.table]);

    const getIsDocRequired = (shortName) => {
        let documentData = basicForm?.documentsRequired?.filter(data => data?.document?.shortName === shortName)?.[0]
        if (!documentData?.departmentSpecific) {
            return documentData?.documentType?.shortName === "Profile Picture" ? "Optional" : documentData?.required ? 'Required' : 'Recommended';
        } else {
            if (documentData?.document?.shortName === "Profile Picture") {
                return "Optional";
            } else {
                let isDepartmentMatching = documentData?.departments?.map(deptData => deptData?.department?.id)?.includes(basicForm?.basicDetailReferences?.department?.id)
                if (isDepartmentMatching) {
                    if (documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialitySpecific) {
                        let isSpecialtyMatching = documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.map(specialtyData => specialtyData?.specialty?.id)?.includes(basicForm?.basicDetailReferences?.specialty?.id);
                        if (isSpecialtyMatching) {
                            return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.filter(specialtyData => specialtyData?.specialty?.id === basicForm?.basicDetailReferences?.specialty?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        } else {
                            return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        }
                    } else {
                        return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                    }
                } else {
                    return documentData?.required ? 'Required' : 'Recommended';
                }
            }
        }
    }

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
                table.push({ documentType: response?.data[index]?.documentType !== null ? response?.data[index]?.documentType?.shortName : '', fileURL: response?.data[index]?.file?.fileURL, fileType: response?.data[index]?.file?.fileType, fileUploaded: data?.name, requirement: response?.data[index]?.documentType !== null ? response?.data[index]?.documentType?.shortName === "Profile Picture" ? 'Optional' : getIsDocRequired(response?.data[index]?.documentType?.shortName) : '', valid: response?.data[index]?.valid, verified: response?.data[index]?.verified, rowId: response?.data[index]?.id })
            })
            for (let triggerIndex = 0; triggerIndex < event.length; triggerIndex++) {
                try {
                    if (response?.data[triggerIndex]?.documentType !== null) {
                        await PUT(`application-management-service/application/${applicationId}/form/updateData?documentType=${response?.data[triggerIndex]?.documentType?.shortName}&applicationDocumentId=${response?.data[triggerIndex]?.id}`, { documentType: response?.data[triggerIndex]?.documentType !== null ? response?.data[triggerIndex]?.documentType?.shortName : '', fileSize: `${(event[triggerIndex]?.size / (1024 * 1024)).toFixed(2)} Mb`, fileURL: response?.data[triggerIndex]?.file?.fileURL, fileType: response?.data[triggerIndex]?.file?.fileType, fileUploaded: event[triggerIndex]?.name, requirement: response?.data[triggerIndex]?.documentType !== null ? response?.data[triggerIndex]?.documentType?.shortName === "Profile Picture" ? 'Optional' : getIsDocRequired(response?.data[triggerIndex]?.documentType?.shortName) : '', valid: response?.data[triggerIndex]?.valid, verified: response?.data[triggerIndex]?.verified, rowId: response?.data[triggerIndex]?.id });
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

    const getDocument = async (rowId) => {
        const { data: response } = await GET(
            `document-management-service/document/${rowId}`
        );
        console.log(response);
        setFields(response?.fields);
        setFile(response?.file);
        setFileMetadata(response?.metaData);
        setApplicationDocumentId(response?.id);
        setIsLoadingDocs(false);
        console.log("fields", fields)
    }

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
            temp[index].requirement = value === 'Profile Picture' ? 'Optional' : getIsDocRequired(value);
        }
        console.log(temp)
        await PUT(`application-management-service/application/${applicationId}/form/updateData?documentType=${value}&applicationDocumentId=${temp[index]?.rowId}&manuallyClassified=${true}`, temp[index])
            .then(response => {
                console.log(response)
                temp[index].valid = response?.data?.valid;
                temp[index].verified = response?.data?.verified
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
                console.log(data?.document?.shortName)
                value.push(data?.document?.shortName)
            } else if (type === data?.document?.shortName) {
                value.push(data?.document?.shortName)
            } else {
                if (tempValue?.table?.filter(singleFileData => singleFileData?.documentType === data?.document?.shortName)?.length === 0) {
                    value.push(data?.document?.shortName)
                    console.log(data?.document?.shortName, tempValue?.table, data)
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
                    "type": "icon", "icon": array?.map(innerData => {
                        const rowId = innerData?.rowId; return innerData?.fileType === 'application/pdf' ?
                            (<Tooltip title="Click to Open" arrow>
                                <img src={PDFDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId) }} /> </Tooltip>
                            ) : innerData?.fileType?.startsWith("image/") ?
                                (<Tooltip title="Click to Open" arrow>
                                    <img src={imgDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId) }} /> </Tooltip>) : (<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.fileURL, '_blank'); }} />)
                    }), 'isShowHoverText': false
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
                    temp.push({ "type": "icon", "icon": array?.map(innerData => innerData?.documentType === 'Profile Picture' ? <RemoveIcon style={{ fontSize: 20, marginLeft: 13 }} /> : innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 13 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 13 }} />), 'isShowHoverText': false });
                } else if (data === "verified") {
                    temp.push({ "type": "icon", "icon": array?.map(innerData => innerData?.documentType === 'Profile Picture' ? <RemoveIcon style={{ fontSize: 20, marginLeft: 20 }} /> : innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 20 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 20 }} />), 'isShowHoverText': false });
                } else {
                    temp.push({
                        "type": "text",
                        "value": array?.map(innerData => {
                            const rowId = innerData?.rowId;
                            return innerData[data] && (
                                <Tooltip title="Click to Open" arrow>
                                    <span
                                        onClick={() => {
                                            setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId)
                                        }}
                                    >
                                        {innerData[data]}
                                    </span>
                                </Tooltip>
                            );
                        })
                    });
                }
            }
            if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
                // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
                temp.push({
                    "type": "icon", "icon": array?.map(innerData =>
                        <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { setDeleteData(innerData); setShowDeleteConfirmation(true) }} />
                    ), 'isShowHoverText': false
                });
            }
            if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
                // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
                temp.push({
                    type: "icon", icon: array?.map(innerData => {
                        const rowId = innerData?.rowId;
                        return (
                            <Tooltip title="Click to Edit" arrow>
                                <ModeEditOutlinedIcon alt="" className={style.docTypeEditImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId); }} />
                            </Tooltip>
                        );
                    }),
                    isShowHoverText: false
                });
            }
        })
        console.log(temp, array, basicForm?.documentsRequired?.map(data => data?.document?.shortName))
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

    const handleDelete = async () => {
        let temp = tempValue?.table;
        temp = temp.filter(obj => !isEqual(obj, deleteData))
        console.log(temp, deleteData)
        await DELETE(`application-management-service/application/${applicationId}/deleteFiles?applicationDocumentIds=${[deleteData?.rowId]}`, [deleteData])
            .then((response) => {
                SuccessToaster("File Deleted Successfully");
                handleSubmitApplicationReq(temp)
                getPreApplication();
                setRefetchRefDoc(true);
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Deleting File");
            });
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
            ErrorToaster2('Please select the missing document type for the uploaded documents')
        }
        else {
            setIsLoading(true);
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: basicForm?.forms?.[formIndex]?.data,
                unFilledFields: getMissingDocs()?.map(data => data?.document?.shortName),
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

    const handleBackClick = async () => {
        navigate(navigateBackURL)
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
            if ((((tempValue?.table || [])?.filter(tableData => tableData?.documentType === data?.document?.shortName)?.length === 0 || !(tempValue?.table?.filter((tableData) => tableData?.documentType === data?.document?.shortName)?.[0]?.verified && tempValue?.table?.filter((tableData) => tableData?.documentType === data?.document?.shortName)?.[0]?.valid)))) {
                temp.push(data)
            }
        })
        return temp;
    }

    console.log(tempValue?.table?.filter(tableData => !tableData?.documentType?.includes(basicForm?.documentsRequired?.filter(data => data?.required)?.map(data => data?.document?.shortName))), 'checkconsole', tempValue?.table, basicForm?.documentsRequired?.filter(data => data?.required)?.map(data => data?.document?.shortName), getMissingDocs())

    return (
        <div>
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <div className={style.uploadContainer}>
                        <div className={style.fileImportingMsg}>We are importing your documents and extracting the required data.</div>
                        <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
                        <div className={style.fileImportingMsg}>Please wait! Do not close your browser window.</div>
                        {/* <div className={style.rotating_text}>
                            {['text', 'text 2', 'text 3', 'text 4']?.map((message) => (
                                <span key={message}>{message}</span>
                            ))}
                        </div> */}
                    </div>
                </div>
            )}
            {isLoadingDocs && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyleCapLogo} />
                </div>
            )}
            {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
            <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
                <div>
                    <LocumProgressCard
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
                                            (tempValue?.table?.filter(
                                                (tableData) =>
                                                    tableData?.documentType ===
                                                    data?.document?.shortName
                                            )?.length === 0 || !(tempValue?.table?.filter((tableData) => tableData?.documentType === data?.document?.shortName)?.[0]?.verified && tempValue?.table?.filter((tableData) => tableData?.documentType === data?.document?.shortName)?.[0]?.valid)) &&
                                            getIsDocRequired(data?.document?.shortName) === "Required"
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
                                            {data?.document?.shortName}
                                        </div>
                                        {/* <InfoOutlinedIcon
                                            sx={{ fontSize: 14, marginLeft: "10px" }}
                                            className={style.info}
                                        /> */}
                                    </div>
                                    <div
                                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                                    >
                                        {data?.document?.shortName === 'Profile Picture' ? 'Optional' : getIsDocRequired(data?.document?.shortName)}
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
                        <div ref={tableRef} className={style.tableContainer}>
                            {tempValue?.table?.length !== 0 && tempValue?.table !== undefined && (
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
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: "none" }} // Hide the actual file input
                        />
                        {/* {((basicForm?.forms?.[formIndex]?.data !== null &&
                            !showRedBorderForESign) || basicForm?.applicant?.signature?.updated) ? (
                            <>
                                <div
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
                                </div>
                                <div className={`${style.eSignatureOnFileCard} ${style.marginTop10}`}>
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
                                </div>
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
                        )} */}
                    </div>
                    <div className={style.threeColForButton}>
                        <div></div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        {/* <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleBackClick()}>BACK</div> */}
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleContinue()}>CONTINUE</div>
                    </div>
                </div>

                <div>
                    {!showInfo && (
                        <div>
                            <div className={`${style.toggleButton} ${isSaveInProgressOpen || isShowESignDialog || showJourneyDialog || isShowUploadValidation
                                || showFileDisplayDialog || isShowESignConfirmationDialog ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                                <MenuIcon className={style.toggleIcon} />
                            </div>
                            <div className={`${style.headerData} ${isSaveInProgressOpen || isShowESignDialog || showJourneyDialog || isShowUploadValidation
                                || showFileDisplayDialog || isShowESignConfirmationDialog ? style.hidden : ""}`}>
                                <span style={{ marginLeft: '20px' }}>Confirm Your Required Documents</span>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
                            <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
                            <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                            <div className={style.marginTop}>
                                <ApplicationAssistanceCard
                                    user={"Neena Greenly"}
                                    designation={"{Designation}"}
                                    contactNumber={"{Contact Number}"}
                                    email={"{Email}"}
                                />
                            </div>
                            <div className={style.marginTop}>
                                <ApplicationReferenceDocuments refetchRefDoc={refetchRefDoc} getResetRefetch={getResetRefetch} />
                            </div>
                        </div>

                    </div>

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
                        {/* <div className={style.twoColForButton}> */}
                        {/* <div
                                className={`${style.continue} ${style.marginTop10}`}
                                onClick={() => handleBackClick()}
                            >
                                BACK
                            </div> */}
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
                        {/* </div> */}
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
            {showFileWithFields && (
                <FileWithFields getIsOpen={getIsOpenFileWithFields} fields={fields} metadata={fileMetadata} file={file} schemaId={basicForm?.forms?.[formIndex]?.schemaId} applicationDocumentId={applicationDocumentId} getPreApplication={getPreApplication} />
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
                                            {data?.document?.shortName}
                                        </div>
                                        <InfoOutlinedIcon
                                            sx={{ fontSize: 14, marginLeft: "10px" }}
                                            className={style.info}
                                        />
                                    </div>
                                    <div
                                        className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}
                                    >
                                        {data?.document?.shortName === 'Profile Picture' ? 'Optional' : getIsDocRequired(data?.document?.shortName)}
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
            {
                showDeleteConfirmation && (
                    <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation}
                        getDeleteConfirmation={getDeleteConfirmation}
                        confirmationText="Do you want to delete this Uploaded document?" />
                )
            }
        </div>
    );
}

export default UploadYourDoc;