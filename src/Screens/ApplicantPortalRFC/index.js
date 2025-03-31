import React, { useState, useEffect } from 'react';
import { TextArea } from '@blueprintjs/core';
import { format } from 'date-fns';
import { TextField } from '@mui/material';
import { DELETE, GET, POST, PUT } from '../../Screens/dataSaver';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import ApplicationHeader from "../../Components/ApplicationHeader";
import { useNavigate, useParams } from "react-router-dom";
import TableTwo from "../../Components/TableDesignTwo";
import style from './index.module.scss';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from "@mui/icons-material/Menu";
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonDivider from '../../Components/CommonFields/CommonDivider';
import CommonDropZone from '../../Components/CommonFields/CommonDropZone';
import Close from './../../images/close.png';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import { SuccessToaster, ErrorToaster, SuccessToaster2 } from '../../utils/toaster';
import { Tooltip } from '@mui/material';
import PDFDocs from './../../images/PDFDocs.png';
import imgDocs from './../../images/imgDocs.png';
import HapiCare from "./../../images/PoweredHapiCare.png";
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteIcon from './../../images/deleteHcRow.png';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonPhoneField from '../../Components/CommonFields/CommonPhoneField';
import CommonDateField from '../../Components/CommonFields/CommonDateField';
import { dataLoadingGIF, fileLoadingURL } from '../../utils/formatting';
import DescriptionIcon from '@mui/icons-material/Description';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import FileWithFields from '../../Components/FileWithFields';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import { useDescope } from "@descope/react-sdk";
import Cookies from "universal-cookie";
import ApplicationFieldCard from '../../Components/ApplicationFieldCard';
import ESignature from '../../Components/ESignature';
import VerifiedImage from "./../../images/verifiedImage.png";
import FileDisplayDialog from '../../Components/fileDisplayDialog';


const ApplicantPortalRFC = () => {
    const navigate = useNavigate();
    //   const [applicationId, setApplicationId] = useState(
    //       sessionStorage.getItem("applicationId")
    //     );
    const { clarificationId } = useParams()
    const applicationId = '67b8140e3d08146b499af66c'
    const [form, setForm] = useState();
    const [userNotes, setUserNotes] = useState('');
    const [files, setFiles] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const [formSchema, setFormSchema] = useState();
    let tempValue = form?.forms?.[formIndex]?.data === null ? { setUpYourSignature: {}, table: [] } : form?.forms?.[formIndex]?.data;
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    const [showFileWithFields, setShowFileWithFields] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteData, setDeleteData] = useState();
    const [fields, setFields] = useState([]);
    const [fileMetadata, setFileMetadata] = useState();
    const [file, setFile] = useState();
    const [fieldsReference, setFieldsReference] = useState([]);
    const [fileReference, setFileReference] = useState();
    const [hospitalPrivilegeSet, setHospitalPrivilegeSet] = useState([])
    const [privilegeChangeYesOrNo, setPrivilegeChangeYesOrNo] = useState("");
    const [privilegeSetChangeYesOrNo, setPrivilegeSetChangeYesOrNo] = useState("");
    const [additionalPrivilegeChangeYesOrNo, setAdditionalPrivilegeChangeYesOrNo] = useState("");
    const [privilegeAtOtherHospitalYesOrNo, setPrivilegeAtOtherHospitalYesOrNo] = useState("");
    const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] = useState([]);
    const [selectedAdditionalPrivilegeForDisplay, setSelectedAdditionalPrivilegeForDisplay] = useState([]);
    const [applicationDocumentId, setApplicationDocumentId] = useState('');
    const [changedData, setChangedData] = useState({})
    const [calendarStart, setCalendarStart] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [clarificationSubject, setClarificationSubject] = useState("");
    const [clarificationDescription, setClarificationDescription] = useState("");
    const [clarificationType, setClarificationType] = useState("");
    const [respondentName, setRespondentName] = useState("");
    const [selectedCommunicationMethod, setSelectedCommunicationMethod] = useState('');
    const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
    const [uploadFileData, setUploadFileData] = useState([]);
    const [documentDesc, setDocumentDesc] = useState("");
    const [documentTitle, setDocumentTitle] = useState("");
    const [taskId, setTaskId] = useState("");
    const [taskById, setTaskById] = useState({});
    const [renderSchemaIndex, setRenderSchemaIndex] = useState();
    const [collapseOpen, setCollapseOpen] = useState(false);
    const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
    const [selectedFile, setselectedFile] = useState(false);
    const [currentDate, setCurrentDate] = useState();
    const canadaData =
        sessionStorage.getItem("canadaData") !== "undefined"
            ? JSON.parse(sessionStorage.getItem("canadaData"))
            : {};
    const { logout } = useDescope();
    let cookie = new Cookies();
    const handleLogout = () => {
        cookie.remove("user", { path: "/" });
        cookie.remove("entityId", { path: "/" });
        cookie.remove("authorization", { path: "/" });
        logout();
    }

    useEffect(() => {
        if (taskById?.details?.application?.application?.id !== undefined) {
            getPreApplication();
            getDocumentReference(taskById?.details?.application?.formDetails?.rowId)
        }
    }, [taskById?.details?.application?.application?.id]);

    useEffect(() => {
        if (form !== undefined) {
            setRenderSchemaIndex(form?.forms?.findIndex(data => data?.id === taskById?.details?.application?.formDetails?.formId))
            console.log(form?.forms?.findIndex(data => data?.id === taskById?.details?.application?.formDetails?.formId), 'formId', taskById?.details?.application?.formDetails?.formId, form?.forms)
            getFormSchema(taskById?.details?.application?.formDetails?.formId)
        }
    }, [form, taskById?.details?.application?.formDetails?.formId])

    useEffect(() => {
        getTaskInfoByParams()
    }, [clarificationId])

    useEffect(() => {
        setFormIndex(form?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc"))
    }, [form])

    useEffect(() => {
        if (canadaData) {
            setCurrentDate(
                format(new Date(), canadaData?.dateFormat || "dd/MM/yyyy")
            );
        }
    }, [canadaData]);

    const getIsShowFileDialog = (value) => {
        setShowFileDisplayDialog(value);
    }

    const getFormSchema = async (formId) => {
        // if (form?.forms?.[form?.forms?.findIndex(data => data?.id === formId)]?.schemaId !== undefined) {
        const { data: formlevel } = await GET(
            `application-management-service/formSchema/${form?.forms?.[form?.forms?.findIndex(data => data?.id === formId)]?.schemaId}`
        );
        setFormSchema(formlevel)
        // }
    }

    const getTaskInfoByParams = async () => {
        const query = new URLSearchParams(window.location.search);
        const applicationIdFromParam = query.get("app");
        const formIdFromParam = query.get("form");
        if (clarificationId !== undefined) {
            const { data: task } = await GET(`task-management-service/task/byParams?taskCategory=REQUEST_FOR_CLARIFICATION&applicationId=${applicationIdFromParam}&formId=${formIdFromParam}&clarificationId=${clarificationId}`)
            setTaskById(task);
        }
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const isEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const handleDelete = async () => {
        setUploadFileData(uploadFileData?.filter(obj => !isEqual(obj, deleteData)))
        await DELETE(`application-management-service/application/${applicationId}/deleteFiles?applicationDocumentIds=${[deleteData?.rowId]}`, [deleteData])
            .then((response) => {
                SuccessToaster("File Deleted Successfully");
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Deleting File");
            });
    }

    const getDeleteConfirmation = (value) => {
        if (value) {
            handleDelete()
        }
    }

    const getPreApplication = async () => {
        setIsLoading(true)
        const query = new URLSearchParams(window.location.search);
        const applicationIdFromParam = query.get("app");
        const formIdFromParam = query.get("form");
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationIdFromParam}`
        );
        setForm(basicForm);
        setSelectedPrivilegeForDisplay(form?.privileges?.obligatedPrivileges);
        setSelectedAdditionalPrivilegeForDisplay(
            form?.privileges?.additionalPrivileges
        );
        setPrivilegeChangeYesOrNo(form?.forms[form?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection")]?.data?.privilegeChangeYesOrNo);
        setPrivilegeSetChangeYesOrNo(form?.forms[form?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection")]?.data?.privilegeSetChangeYesOrNo);
        setAdditionalPrivilegeChangeYesOrNo(form?.forms[form?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection")]?.data?.additionalPrivilegeChangeYesOrNo)
        setPrivilegeAtOtherHospitalYesOrNo(form?.forms[form?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection")]?.data?.privilegeAtOtherHospitalYesOrNo)
        setClarificationSubject(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationRequest?.clarificationTitle)
        setClarificationDescription(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationRequest?.clarificationDescription)
        setClarificationType(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationRequest?.clarificationRequestType)
        if (basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse !== null) {
            if (basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse?.clarificationResponseType === "REPLACE_ORIGINAL_DOCUMENT") {
                setUploadFileData(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse?.documents)
            } else {
                setUploadFileData(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse?.attachedDocuments)
            }
            setUserNotes(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse?.clarificationDescription)
            setDocumentTitle(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse?.attachedDocuments?.map(data => data?.title))
            setDocumentDesc(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse?.attachedDocuments?.map(data => data?.description))
        }
        setIsLoading(false)
    }

    // const getTaskInfo = async () => {
    //     if (taskId !== undefined) {
    //         const { data: task } = await GET(`task-management-service/task/${taskId}`)
    //         setTaskById(task);
    //     }
    // }

    const getIsOpenFileWithFields = (value) => {
        setShowFileWithFields(value);
    }

    const getIsDocRequired = (shortName) => {
        let documentData = form?.documentsRequired?.filter(data => data?.document?.shortName === shortName)?.[0]
        if (!documentData?.departmentSpecific) {
            return documentData?.documentType?.shortName === "Profile Picture" ? "Optional" : documentData?.required ? 'Required' : 'Recommended';
        } else {
            if (documentData?.document?.shortName === "Profile Picture") {
                return "Optional";
            } else {
                let isDepartmentMatching = documentData?.departments?.map(deptData => deptData?.department?.id)?.includes(form?.basicDetailReferences?.department?.id)
                if (isDepartmentMatching) {
                    if (documentData?.departments?.filter(deptData => deptData?.department?.id === form?.basicDetailReferences?.department?.id)?.[0]?.specialitySpecific) {
                        let isSpecialtyMatching = documentData?.departments?.filter(deptData => deptData?.department?.id === form?.basicDetailReferences?.department?.id)?.[0]?.specialities?.map(specialtyData => specialtyData?.specialty?.id)?.includes(form?.basicDetailReferences?.specialty?.id);
                        if (isSpecialtyMatching) {
                            return documentData?.departments?.filter(deptData => deptData?.department?.id === form?.basicDetailReferences?.department?.id)?.[0]?.specialities?.filter(specialtyData => specialtyData?.specialty?.id === form?.basicDetailReferences?.specialty?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        } else {
                            return documentData?.departments?.filter(deptData => deptData?.department?.id === form?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        }
                    } else {
                        return documentData?.departments?.filter(deptData => deptData?.department?.id === form?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                    }
                } else {
                    return documentData?.required ? 'Required' : 'Recommended';
                }
            }
        }
    }

    const getDropDownValues = (type) => {
        let value = [];
        form?.documentsRequired?.map(data => {
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

    const handleSubmitApplicationReq = async (tableData) => {
        tempValue.table = tableData;
        console.log(tableData)
        let temp = {
            schemaId: form?.forms?.[formIndex]?.schemaId,
            data: tempValue
        }
        await PUT(`application-management-service/application/${applicationId}/form/${form?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                setForm(response?.data)
                getPreApplication();
                SuccessToaster("Application Updated Successfully");
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
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
        await PUT(`application-management-service/application/${applicationId}/form/updateData?documentType=${value}&applicationDocumentId=${temp[index]?.rowId}`, temp[index])
            .then(response => {
                console.log(response)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
            });
        // handleSubmitApplicationReq(temp)
    }

    const getDocument = async (id) => {
        const { data: response } = await GET(
            `document-management-service/document/${id}`
        );
        console.log(response);
        setFields(response?.fields);
        setFile(response?.file);
        setFileMetadata(response?.metaData);
        setApplicationDocumentId(response?.id);
        setIsLoadingDocs(false);
        console.log("fields", fields)
    }

    const getDocumentReference = async (id) => {
        const { data: response } = await GET(
            `document-management-service/document/${id}`
        );
        console.log(response);
        setFieldsReference(response?.fields);
        setFileReference(response?.file);
        setChangedData(response?.metaData);
        setApplicationDocumentId(response?.id);
        setIsLoadingDocs(false);
        console.log("fields", fields)
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

        try {
            setIsLoadingImageDocs(true);
            const response = await POST(`application-management-service/application/${taskById?.details?.application?.application?.id}/files/bulk?isLLMRequired=${true}`, formData);
            console.log("API Response:", response);
            SuccessToaster('File Uploaded Successfully');
            console.log("Response data:", response?.data);
            setUploadFileData(prevData => {
                // Merge previous data with new data
                return [...(prevData || []), ...(response?.data || [])];
            });
            setIsLoadingImageDocs(false);
            console.log("Responseupload:", uploadFileData);
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error("Error:", error);
            return null;
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleCloseClick = () => {
        // navigate("/applicantDashboard");
        handleLogout();
    };

    const getApplicantValues = (array) => {
        let temp = [];
        console.log(array, 'array')
        temp.push({
            "type": "icon", "icon": array?.map(innerData => {
                const rowId = innerData?.id; return innerData?.file?.fileType === 'application/pdf' ?
                    (<Tooltip title="Click to Open" arrow>
                        <img src={PDFDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId) }} /> </Tooltip>
                    ) : innerData?.file?.fileType?.startsWith("image/") ?
                        (<Tooltip title="Click to Open" arrow>
                            <img src={imgDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId) }} /> </Tooltip>) : (<TextSnippetOutlinedIcon style={{ fontSize: 20 }} onClick={() => { window.open(innerData?.file?.fileURL, '_blank'); }} />)
            }), 'isShowHoverText': false
        });
        temp.push({
            "type": "text", "value": array?.map(innerData => innerData?.file?.fileName)
        })
        temp.push({
            "type": "text", "value": array?.map(innerData => innerData?.documentType?.shortName)
        })
        temp.push({ "type": "icon", "icon": array?.map(innerData => innerData?.documentType?.shortName === 'Profile Picture' ? <RemoveIcon style={{ fontSize: 20, marginLeft: 13 }} /> : innerData['verified'] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 13 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 13 }} />), 'isShowHoverText': false });
        temp.push({ "type": "icon", "icon": array?.map(innerData => innerData?.documentType?.shortName === 'Profile Picture' ? <RemoveIcon style={{ fontSize: 20, marginLeft: 13 }} /> : innerData['valid'] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 13 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 13 }} />), 'isShowHoverText': false });
        temp.push({
            "type": "icon", "icon": array?.map(innerData =>
                <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { setDeleteData(innerData); setShowDeleteConfirmation(true) }} />
            ), 'isShowHoverText': false
        });
        temp.push({
            type: "icon", icon: array?.map(innerData => {
                const rowId = innerData?.id;
                return (
                    <Tooltip title="Click to Edit" arrow>
                        <ModeEditOutlinedIcon alt="" className={style.docTypeEditImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId); }} />
                    </Tooltip>
                );
            }),
            isShowHoverText: false
        });
        console.log(temp, array, form?.documentsRequired?.map(data => data?.document?.shortName))
        return temp;
    }

    console.log(uploadFileData, 'uploadFileData')

    const getClarificationResponse = async (saveInProgress) => {
        setIsLoading(true)
        const query = new URLSearchParams(window.location.search);
        const applicationIdFromParam = query.get("app");
        const formIdFromParam = query.get("form");
        const files = (uploadFileData || []).map((item, index) => ({
            filePath: item?.file?.filePath ?? uploadFileData?.[index]?.filePath,
            fileName: item?.file?.fileName ?? uploadFileData?.[index]?.fileName,
            fileURL: item?.file?.fileURL ?? uploadFileData?.[index]?.fileURL,
            fileType: item?.file?.fileType ?? uploadFileData?.[index]?.fileType,
            classification: item?.file?.classification ?? uploadFileData?.[index]?.classification,
            verified: item?.file?.verified ?? uploadFileData?.[index]?.verified,
            valid: item?.file?.valid ?? uploadFileData?.[index]?.valid,
            title: item?.file?.title ?? uploadFileData?.[index]?.title,
            description: item?.file?.description ?? uploadFileData?.[index]?.description,
        }));

        let temp = {
            clarificationResponseBy: "APPLICANT",
            responseMethod: '',
            title: respondentName,
            clarificationDescription: userNotes,
            attachedDocuments: files,
        };
        if (clarificationType !== undefined && clarificationType !== "" && clarificationType !== null) {
            temp["clarificationResponseType"] = "REPLACE_ORIGINAL_DOCUMENT";
            temp["documents"] = uploadFileData;
        }

        console.log(taskById, 'taskById')

        if (saveInProgress) {
            if (taskById?.status === "NOT_STARTED") {
                await PUT(`task-management-service/task/${taskById?.id}/updateStatus?status=ON_GOING`)
            }
        } else {
            await PUT(`task-management-service/task/${taskById?.id}/updateStatus?status=COMPLETED`)
        }

        await PUT(`application-management-service/application/${applicationIdFromParam}/form/${formIdFromParam}/clarification/${clarificationId}/response`, temp)
            .then(response => {
                console.log('successfull notes added');
                SuccessToaster2('Clarification Response Submitted Successfully!')
                getPreApplication();
                handleCloseClick();
            })
            .catch((error) => {
                console.log(error);
            });
        setIsLoading(false)
    };

    console.log('clarificationType', clarificationType)

    const getMedicalDirectiveTable = (array) => {
        if (!array || !Array.isArray(array)) {
            console.error("Array is undefined or not an array:", array);
            return [];
        }
        let schema = formSchema?.schema
        let temp = [];

        Object.keys(schema?.properties?.medicalDirectives?.tableHeaders || {})?.map((data, index) => {
            if (data === "file") {
                temp.push({
                    "type": "icon",
                    "icon": array?.map(innerData =>
                        <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData?.file) }} />),
                    'isShowHoverText': false
                });
            } else {
                if (data === "valid") {
                    temp.push({
                        "type": "icon",
                        "icon": array?.map(innerData => innerData[data] ?
                            <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} />
                            : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562` }} />),
                        'isShowHoverText': false
                    });
                }
                else {
                    temp.push({
                        "type": "text",
                        "value": array.map(innerData =>
                            <div className={style.cursorPointer} onClick={() => { setShowFileDisplayDialog(true); setselectedFile(innerData); }}>
                                {innerData[data]}
                            </div>
                        )
                    });
                }
            }
        })
        return temp;
    }

    const renderFields = (field, index) => {
        console.log('field', field)
        switch (field.fieldType) {
            case "textbox":
                return (
                    <div key={index}>
                        <CommonTextField
                            value={changedData?.[field?.name]}
                            className={style.fullWidth}
                            onChange={(e) => setChangedData({ ...changedData, [field.name]: (field.name === "creditOrHours" || field.name === "credits") ? e.target.value !== "" ? parseFloat(e.target.value) : 0 : e.target.value })}
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
                            onChange={(e) => setChangedData({ ...changedData, [field.name]: e.target.value })}
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
                        onChange={(e) => setChangedData({ ...changedData, [field.name]: e.target.value })}
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
                            setChangedData({ ...changedData, [field.name]: format(new Date(newValue), "yyyy-MM-dd'T'00:00") })
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
                            onChange={(e) => setChangedData({ ...changedData, [field.name]: (field.name === "creditOrHours" || field.name === "credits") ? e.target.value !== "" ? parseFloat(e.target.value) : 0 : e.target.value })}
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

    const renderFieldsBasedOnStepReappointment = (data, index) => {
        console.log('renderCheck', data, formSchema)
        let formIndex = form?.forms?.findIndex(formData => formData?.schemaCategory === data?.schemaCategory);
        switch (data?.schemaCategory) {
            case "UploadYourDoc":
                return (
                    <>
                        <div>
                            <div className={style.marginTop20}>
                                {fileReference?.fileType === 'application/pdf' ? (
                                    <iframe src={`${fileReference?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>
                                ) : file?.fileType?.startsWith("image/") ? (
                                    <img src={fileReference?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
                                ) : <iframe src={`${fileReference?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>}
                            </div>
                            <div className={`${style.twoCol} ${style.marginTop20}`}>
                                {fieldsReference?.map((field, index) => (
                                    <div>
                                        <div className={`${style.lableStyle} ${style.marginTop10}`}>{field?.label}</div>
                                        <div className={style.dividerStyle}></div>
                                        <div className={`${style.notesAlignment} ${style.marginTop10} ${style.lableStyle}`}>
                                            {changedData !== null ? changedData[field?.name] !== undefined ? field?.fieldType === "datepicker" ? format(new Date(changedData[field?.name]), 'dd/MM/yyyy') : changedData[field?.name] : "" : ""}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
            case "CME":
                return (
                    <>
                        <>
                            {form?.forms?.[formIndex]?.data?.cmeTranscripts?.length !== 0 && form?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName !== undefined && (
                                <div className={`${style.fileDisplayGrid} ${style.fileDisplayCME} ${style.marginTop} ${style.verticalAlignCenter}`}>
                                    <div><strong>CME / CEU Transcript</strong></div>
                                    <div className={style.leftAlign}>{form?.forms?.[formIndex]?.data?.cmeTranscripts?.file?.fileName}</div>
                                    <img
                                        src={VerifiedImage}
                                        alt=""
                                        className={`${style.imgIcon} ${style.cursorPointer}`}
                                        onClick={() => {
                                            setShowFileDisplayDialog(true); setselectedFile(form?.forms?.[formIndex]?.data?.cmeTranscripts?.file);
                                        }
                                        }
                                    />
                                </div>
                            )}
                            <div className={`${style.cmeCreditsGrid} ${style.marginTop}`}>
                                <div>
                                    <div className={style.cmeCard}>
                                        <div className={style.creditsHeading}>CME CREDITS / HOURS</div>
                                        <div className={`${style.twoCol} ${style.marginTop}`}>

                                            <div className={`${style.cmeHourCard} `}
                                            >
                                                <div className={style.totalText}>Your Total</div>
                                                <div className={style.hourText}>{form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours}</div>
                                                <div className={style.totalText}>Credits / Hours</div>
                                                {(25 - form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours) > 0 && (
                                                    <div className={style.hourRemainingText}>{25 - form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours} more needed</div>
                                                )}
                                            </div>
                                            <div className={style.cmeHourCard}>
                                                <div className={style.totalText}>Required</div>
                                                <div className={style.hourText}>25</div>
                                                <div className={style.totalText}>Credits / Hours</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? (
                                    <div>
                                        <div className={style.lableStyle}>Indicate why you were not able to complete the required number of Credits / Hours*</div>
                                        <div className={style.marginTop10}>
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={form?.forms?.[formIndex]?.data?.notes !== undefined ? form?.forms?.[formIndex]?.data?.notes : ''}
                                                // onChange={(event, editor) => {
                                                //   const data = editor.getData();
                                                //   setNotes(data);
                                                // }}
                                                onReady={(editor) => {
                                                    editor.editing.view.change((writer) => {
                                                        writer.setStyle(
                                                            "height",
                                                            "150px",
                                                            editor.editing.view.document.getRoot()
                                                        );
                                                    });
                                                }}
                                                disabled
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
                                    <div className={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? style.disabled : ''}>
                                        <div className={`${style.checkGrid}`}>
                                            {formSchema?.disclaimer?.content !== undefined && (
                                                <span>
                                                    <CommonCheckBox checked={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? false : form?.forms?.[formIndex]?.acknowledged}
                                                        // onChange={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? () => { } : (e) => handleIsChecked(e.target.checked)} 
                                                        bigCheckbox={true} />
                                                </span>
                                            )}
                                            <div
                                                className={`${style.leftAlign} ${style.marginTop10}`}
                                                dangerouslySetInnerHTML={{ __html: formSchema?.disclaimer?.content }}
                                            />
                                        </div>
                                        {form?.forms?.[formIndex]?.esign?.name !== undefined && (
                                            <div className={style.eSignGrid}>
                                                <div
                                                >
                                                    <ESignature
                                                        userName={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? '' : form?.forms?.[formIndex]?.esign?.name !== undefined ? form?.forms?.[formIndex]?.esign?.name : ""}
                                                        encData={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? "" : form?.forms?.[formIndex]?.esign?.esign !== undefined ? form?.forms?.[formIndex]?.esign?.esign : ""}
                                                        showData={form?.forms?.[formIndex]?.data?.cmeTranscripts?.creditOrHours < 25 ? false : form?.forms?.[formIndex]?.esign?.esign !== undefined}
                                                        showDatais={true}
                                                    />
                                                </div>
                                                <div className={style.verticalAlignCenter}>
                                                    <div className={style.displayInRow}>
                                                        <div className={style.dateTitle}>Date: </div>
                                                        <div className={`${style.date} ${style.marginLeft}`}>{form?.forms?.[formIndex]?.esign?.signedDate ? (form?.forms?.[formIndex]?.esign?.signedDate !== '' && form?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? form?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </>
                        {/* <CommonDivider /> */}
                        {formSchema?.schema?.properties !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            'cmeCertificates' in formSchema?.schema?.properties && (
                                <ApplicationFieldCard object={formSchema?.schema?.properties?.cmeCertificates} baseKey={'cmeCertificates'} basicForm={form} setBasicForm={setForm} addMoreType={true} formId={form?.forms?.[formIndex]?.id} applicationId={applicationId} tableGrid={style.tableGridCME} isPOD={true}
                                    heading={'No Documents Uploaded.'}
                                // subHeading={'For this application you are required to provide information on the CME certificates.'}
                                // subHeading2={'You will not be able to submit your application if this is not provided.'} 
                                />
                            )}
                    </>
                );
            case "MEDICAL_DIRECTIVES":
                return (
                    <>
                        <div className={`${style.totalText} ${style.leftAlign}`}>
                            All Medical Directives that required Attestation for this reappointment period for this Medical Staff have been attested.
                        </div>
                        <div className={style.marginTop}>
                            <TableTwo
                                tableHeaderValues={[
                                    "",
                                    "Title",
                                    "MD ID",
                                    "Type",
                                    "Attestation Date",
                                    "",
                                ]}
                                tableDataValues={getMedicalDirectiveTable(form?.forms?.[formIndex]?.data?.table)}
                                tableData={form?.forms?.[formIndex]?.data?.table || []}
                                gridStyle={style.medicalDirectivesGridStyle}
                                actions={[]}
                                // scrollStyle={style.contractScrollStyle}
                                tableSortValues={[]}
                                heading={"There are no Record for you to manage"}
                                onClickFunction={() => { }}
                                hidePagination={true}
                            />
                        </div>
                    </>
                );
            case "MISCELLANEOUS_QUESTIONS":
                return (
                    <>
                        <div>
                            <div>
                                <div className={style.cardTitle}>
                                    {formSchema?.schema?.properties?.isModulesForReAppointmentCompleted?.properties?.response?.label}
                                </div>
                                {form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response !== undefined && (
                                    <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={(form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === 'Yes' || form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === true) ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === true ? 'Yes' : form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response === false ? "No" : form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.response}</span></strong> on {(form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date !== '' && form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date !== undefined) ? format(new Date(form?.forms?.[formIndex]?.data?.isModulesForReAppointmentCompleted?.date), "MMM dd, yyyy") : ''}</div>
                                )}
                            </div>
                            <div className={`${style.marginTop20}`}>
                                <div className={style.cardTitle}>
                                    {formSchema?.schema?.properties?.doYouPrescribeSuboxone?.properties?.response?.label}
                                </div>
                                {form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response !== undefined && (
                                    <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={(form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === 'Yes' || form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === true) ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === true ? 'Yes' : form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response === false ? "No" : form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.response}</span></strong> on {(form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date !== '' && form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date !== undefined) ? format(new Date(form?.forms?.[formIndex]?.data?.doYouPrescribeSuboxone?.date), "MMM dd, yyyy") : ''}</div>
                                )}
                            </div>
                            {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Pediatrics') && (
                                <div className={`${style.marginTop20}`}>
                                    <div className={style.cardTitle}>
                                        {formSchema?.schema?.properties?.wishToBeMRP?.properties?.response?.label}
                                    </div>
                                    {form?.forms?.[formIndex]?.data?.wishToBeMRP?.response !== undefined && (
                                        <div className={`${style.markedAsText} ${style.marginTop20}`}><strong>Marked as <span className={(form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === true || form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === 'Yes') ? style.yesText : style.noText}>{form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === true ? "Yes" : form?.forms?.[formIndex]?.data?.wishToBeMRP?.response === false ? 'No' : form?.forms?.[formIndex]?.data?.wishToBeMRP?.response}</span></strong> on {(form?.forms?.[formIndex]?.data?.wishToBeMRP?.date !== '' && form?.forms?.[formIndex]?.data?.wishToBeMRP?.date !== undefined) ? format(new Date(form?.forms?.[formIndex]?.data?.wishToBeMRP?.date), "MMM dd, yyyy") : ''}</div>
                                    )}
                                </div>
                            )}
                            <div className={`${style.warningCard} ${style.marginTop20}`}>
                                <div className={style.cardTitle}>24 hours coverage of hospital patients, including those in the ER, is a requirement of Professional Staff responsibilities. The physician must provide an acceptable method to respond to hospital calls.</div>
                            </div>
                            <div className={style.marginTop20}>
                                <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.coverageDetails?.providerType !== undefined ? form?.coverageDetails?.providerType : ''} : {form?.coverageDetails?.providerType !== "Department / Specialty Group" ? form?.coverageDetails?.providerDetails?.length !== 0 ? form?.coverageDetails?.providerDetails?.map(data => data?.name)?.join(', ') : '' : `${form?.basicDetails?.departmentSpecialty?.department} ${(form?.basicDetails?.departmentSpecialty?.specialty !== null && form?.basicDetails?.departmentSpecialty?.specialty !== undefined) ? `- ${form?.basicDetails?.departmentSpecialty?.specialty}` : ''}`}</strong></div>
                            </div>
                            {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Obstetrics & Gynecology') && (
                                <div className={style.marginTop20}>
                                    <div className={`${style.cardTitle}`}>
                                        {`If you are practicing obstetrics, who covers your patients when you are not available?*`}
                                    </div>
                                    <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.coverageDetails?.obstetricsProviderType !== undefined ? form?.coverageDetails?.obstetricsProviderType : ''} : {form?.coverageDetails?.obstetricsProviderType !== "Department / Specialty Group" ? form?.coverageDetails?.obstetricsProviderDetails?.length !== 0 ? form?.coverageDetails?.obstetricsProviderDetails?.map(data => data?.name)?.join(', ') : '' : `${form?.basicDetails?.departmentSpecialty?.department} ${(form?.basicDetails?.departmentSpecialty?.specialty !== null && form?.basicDetails?.departmentSpecialty?.specialty !== undefined) ? `- ${form?.basicDetails?.departmentSpecialty?.specialty}` : ''}`}</strong></div>
                                </div>
                            )}
                        </div>
                    </>
                );
            case "HOSPITAL_COVERAGE":
                return (
                    <>
                        <div className={`${style.warningCard} ${style.marginTop10}`}>
                            <div className={style.cardTitle}>24 hours coverage of hospital patients, including those in the ER, is a requirement of Professional Staff responsibilities. The physician must provide an acceptable method to respond to hospital calls.</div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.forms?.[formIndex]?.data?.specificProviderGroup !== undefined ? form?.forms?.[formIndex]?.data?.specificProviderGroup : ''} : {form?.forms?.[formIndex]?.data?.whoCovers !== undefined ? form?.forms?.[formIndex]?.data?.whoCovers : ''}</strong></div>
                        </div>
                        {(form?.basicDetails?.departmentSpecialty?.department === 'Women & Children' && form?.basicDetails?.departmentSpecialty?.specialty === 'Obstetrics & Gynecology') && (
                            <div className={style.marginTop20}>
                                <div className={`${style.cardTitle}`}>
                                    {`If you are practicing obstetrics, who covers your patients when you are not available?*`}
                                </div>
                                <div className={style.lableReadOnlyStyleInPOD}><strong>{form?.forms?.[formIndex]?.data?.whoCoversObstetrics !== undefined ? form?.forms?.[formIndex]?.data?.whoCoversObstetrics : ''}</strong></div>
                            </div>
                        )}
                    </>
                );
            case "DemographicData":
                return (
                    <>
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined && 'applicant' in formSchema?.schema?.properties && (
                                <ApplicationFieldCard object={formSchema?.schema?.properties?.applicant} gridStyle={style.applicantGrid} baseKey={'applicant'} basicForm={form} setBasicForm={setForm} isBasicPath={true} isPOD={true} />
                            )}
                        <CommonDivider />
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "contactAddress1" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.contactAddress1}
                                    basicForm={form}
                                    setBasicForm={setForm}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.homeMailingAddressGrid}
                                    baseKey={"contactAddress1"}
                                    isPOD={true}
                                />
                            )}
                        <CommonDivider />
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "contactAddress3" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.contactAddress3}
                                    basicForm={form}
                                    setBasicForm={setForm}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.businessMailingAddressGrid}
                                    baseKey={"contactAddress3"}
                                    isPOD={true}
                                />
                            )}
                        <CommonDivider />
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "contactAddress2" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.contactAddress2}
                                    basicForm={form}
                                    setBasicForm={setForm}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.mailingAddressGrid}
                                    baseKey={"contactAddress2"}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "ApplicantAcknowledgement":
                const fileURL = form?.forms?.[formIndex]?.uploadedFiles?.[
                    form?.forms?.[formIndex]?.uploadedFiles?.length - 1
                ]?.fileURL;
                return fileURL ? (
                    <>
                        <iframe
                            src={`${form?.forms?.[formIndex]?.uploadedFiles[
                                form?.forms?.[formIndex]?.uploadedFiles?.length - 1
                            ]?.fileURL}#toolbar=0&view=FitH`
                            }
                            width="100%"
                            height="600px"
                        ></iframe>
                    </>
                ) : (
                    <div className={style.acknowledgmentErrorTextStyle}>No Data To Show</div>
                );
            case "ScheduleA":
                const fileURLScheduleA = form?.forms?.[formIndex]?.uploadedFiles?.[
                    form?.forms?.[formIndex]?.uploadedFiles?.length - 1
                ]?.fileURL;
                return fileURLScheduleA ? (
                    <>
                        <iframe
                            src={`${form?.forms?.[formIndex]?.uploadedFiles[
                                form?.forms?.[formIndex]?.uploadedFiles?.length - 1
                            ]?.fileURL}#toolbar=0&view=FitH`
                            }
                            width="100%"
                            height="600px"
                        ></iframe>
                    </>
                ) : (
                    <div className={style.acknowledgmentErrorTextStyle}>No Data To Show</div>
                );
            case "ScheduleB":
                const fileURLScheduleB = form?.forms?.[formIndex]?.uploadedFiles?.[
                    form?.forms?.[formIndex]?.uploadedFiles?.length - 1
                ]?.fileURL;
                return fileURLScheduleB ? (
                    <>
                        <iframe
                            src={`${form?.forms?.[formIndex]?.uploadedFiles[
                                form?.forms?.[formIndex]?.uploadedFiles?.length - 1
                            ]?.fileURL}#toolbar=0&view=FitH`
                            }
                            width="100%"
                            height="600px"
                        ></iframe>
                    </>
                ) : (
                    <div className={style.acknowledgmentErrorTextStyle}>No Data To Show</div>
                );
            case "ProfessionalConduct":
                return (
                    <>
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "disclosures" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.disclosures}
                                    basicForm={form}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.conductGrid}
                                    baseKey={"disclosures"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "CriminalHistory":
                return (
                    <>
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "disclosures" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.disclosures}
                                    basicForm={form}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.conductGrid}
                                    baseKey={"disclosures"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "MedicalHistory":
                return (
                    <>
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "disclosures" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.disclosures}
                                    basicForm={form}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.medicalHistoryGrid}
                                    baseKey={"disclosures"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "PRIVILEGE_STATUS_AT_HOSPITAL":
                return (
                    <>
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "disclosures" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.disclosures}
                                    basicForm={form}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.conductGrid}
                                    baseKey={"disclosures"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "PATIENT_CONCERN_DISCLOSURE":
                return (
                    <>
                        {formSchema?.schema !== undefined &&
                            formSchema?.schema?.properties !== null &&
                            formSchema?.schema?.properties !== undefined &&
                            "disclosures" in formSchema?.schema?.properties && (
                                <ApplicationFieldCard
                                    object={formSchema?.schema?.properties?.disclosures}
                                    basicForm={form}
                                    stepPath={`forms[${formIndex}].data`}
                                    gridStyle={style.conductGrid}
                                    baseKey={"disclosures"}
                                    collapsableQuestionCard={true}
                                    isPOD={true}
                                />
                            )}
                    </>
                );
            case "PrivilegeSelection":
                return (
                    <>
                        <div className={`${style.applicationCardStyleReappointment} ${style.marginTop10}`}>
                            <div className={`${style.privilegeCard} ${style.marginTop10}`}>
                                <div>
                                    <div className={style.privilegeHeading}>
                                        <strong>Privilege Category</strong>
                                    </div>
                                    <div className={style.twoCol}>
                                        <div
                                            className={`${style.privilegeContentCard} ${style.marginTop10}`}
                                        >
                                            <div className={style.privilegeHeadingCurrent}>Current</div>
                                            <div className={style.privilegeHeading}>
                                                {(form?.basicDetails?.priorPrivilegeCategory !== null && form?.basicDetails?.priorPrivilegeCategory?.name !== null)
                                                    ? form?.basicDetails?.priorPrivilegeCategory
                                                        ?.name
                                                    : form?.basicDetails
                                                        ?.credentialingPrivilegeCategory
                                                        ?.credentialingCategory}
                                            </div>
                                        </div>
                                        {form?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.privilegeChangeYesOrNo !== undefined && (
                                            <div
                                                className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                                            >
                                                <div className={style.privilegeHeadingReappointment}>
                                                    Change for Reappointment
                                                </div>
                                                <div className={style.privilegeHeading}>
                                                    {privilegeChangeYesOrNo === "Yes" ? (
                                                        <div className={style.privilegeHeading}>
                                                            Same as Before
                                                        </div>
                                                    ) : (
                                                        <div className={style.privilegeHeading}>
                                                            {
                                                                form?.basicDetails
                                                                    ?.credentialingPrivilegeCategory
                                                                    ?.credentialingCategory
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                                        <strong>Department</strong>
                                    </div>
                                    <div className={style.twoCol}>
                                        <div
                                            className={`${style.privilegeContentCard} ${style.marginTop10}`}
                                        >
                                            <div className={style.privilegeHeadingCurrent}>Current</div>
                                            <div className={style.privilegeHeading}>
                                                {(form?.basicDetails?.priorDepartmentSpecialty !== null && form?.basicDetails?.priorDepartmentSpecialty?.department !== null) ? form?.basicDetails?.priorDepartmentSpecialty?.department : (form?.basicDetails?.departmentSpecialty !== null && form?.basicDetails?.departmentSpecialty?.department !== null) ? form?.basicDetails?.departmentSpecialty?.department : 'None'}
                                            </div>
                                        </div>
                                        {form?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.departmentChangeYesOrNo !== undefined && (
                                            <div
                                                className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                                            >
                                                <div className={style.privilegeHeadingReappointment}>
                                                    Change for Reappointment
                                                </div>
                                                <div className={style.privilegeHeading}>
                                                    {form?.forms?.[formIndex]?.data?.departmentChangeYesOrNo === "No" ? (
                                                        <div className={style.privilegeHeading}>
                                                            {form?.basicDetails?.departmentSpecialty?.department}
                                                        </div>
                                                    ) : (
                                                        <div className={style.privilegeHeading}>
                                                            {form?.basicDetails?.priorDepartmentSpecialty?.department !== null ? form?.basicDetails?.priorDepartmentSpecialty?.department === form?.basicDetails?.departmentSpecialty?.department ? 'Same as Before' : form?.basicDetails?.departmentSpecialty?.department : form?.basicDetails?.departmentSpecialty?.department}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {(form?.privileges?.priorObligatedPrivileges?.length !== 0 || form?.privileges?.obligatedPrivileges?.length !== 0) && (
                                        <>
                                            <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                                                <strong>Privilege Sets</strong>
                                            </div>
                                            <div className={style.twoCol}>
                                                <div
                                                    className={`${style.privilegeContentCard} ${style.marginTop10}`}
                                                >
                                                    <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                                                    {form?.privileges?.priorObligatedPrivileges?.length === 0 ?
                                                        (
                                                            <div className={style.privilegeHeading}>None</div>
                                                        )
                                                        : (
                                                            <>
                                                                {form?.privileges?.priorObligatedPrivileges?.map(
                                                                    (data) => (
                                                                        <div className={style.privilegeHeading} >
                                                                            {data?.privilegeSetTitle}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                </div>
                                                {form?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.privilegeSetChangeYesOrNo !== undefined && (
                                                    <div
                                                        className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                                                    >
                                                        <div className={`${style.privilegeHeadingReappointment}`}>
                                                            Change for Reappointment
                                                        </div>
                                                        {privilegeSetChangeYesOrNo === "Yes" ? (
                                                            <>
                                                                <div className={style.privilegeHeading}>
                                                                    Same Privileges Requested
                                                                </div>
                                                                {form?.privileges?.obligatedPrivileges?.map(
                                                                    (data) => (
                                                                        <div
                                                                            className={`${style.privilegeHeading} `}
                                                                        >
                                                                            {data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {form?.privileges?.obligatedPrivileges?.map(
                                                                    (data) => (
                                                                        <div
                                                                            className={`${style.privilegeHeading} `}
                                                                        >
                                                                            {data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {(form?.privileges?.priorAdditionalPrivileges?.length !== 0 || form?.privileges?.additionalPrivileges?.length !== 0) && (
                                        <div>
                                            <div className={`${style.privilegeHeading} ${style.marginTop10}`}><strong>Additional Privileges</strong></div>
                                            <div className={style.twoCol}>
                                                <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                                                    <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                                                    {form?.privileges?.priorAdditionalPrivileges?.length === 0 ? (
                                                        <>
                                                            {form?.privileges?.additionalPrivileges?.length === 0 ? (
                                                                <div className={style.privilegeHeading}>None</div>
                                                            ) : (
                                                                <>
                                                                    {form?.privileges?.additionalPrivileges?.map(data => (
                                                                        <div
                                                                            className={`${style.privilegeHeading} `}
                                                                        // onClick={() => { setShowCurrentPrivileges(true); handleChangeAdditional(data?.id); setCurrentPrivilegesCategory('Additional') }}
                                                                        >{data?.privilegeSetTitle}</div>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {form?.privileges?.priorAdditionalPrivileges?.map(data => (
                                                                <div
                                                                    className={`${style.privilegeHeading} `}
                                                                >{data?.privilegeSetTitle}</div>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                                {form?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== '' && form?.forms?.[formIndex]?.data?.additionalPrivilegeChangeYesOrNo !== undefined && (
                                                    <div className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}>
                                                        <div className={`${style.privilegeHeadingReappointment}`}>{additionalPrivilegeChangeYesOrNo === 'No' ? 'Privileges Requested' : 'Change for Reappointment'}</div>
                                                        {additionalPrivilegeChangeYesOrNo === 'No' ? (
                                                            <div className={`${style.privilegeHeading}`}>None</div>
                                                        ) : (
                                                            <>
                                                                <div className={style.privilegeHeading}>
                                                                    Additional Privilege Requested
                                                                </div>
                                                                {form?.privileges?.additionalPrivileges?.map(data => (
                                                                    <div
                                                                        className={`${style.privilegeHeading}`}
                                                                    >{data?.privilegeSetTitle} {data?.privilegeDetails?.corePrivileges?.esign?.signedDate !== undefined && (<span className={style.signedOnText}>signed on {data?.privilegeDetails?.corePrivileges?.esign?.signedDate}</span>)}</div>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {((form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges !== null) && (form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.length !== 0)) && (
                                        <>
                                            <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                                                <strong>Privileges at Other Hospitals</strong>
                                            </div>
                                            <div className={style.twoCol}>
                                                <div
                                                    className={`${style.privilegeContentCard} ${style.marginTop10}`}
                                                >
                                                    <div className={style.privilegeHeadingCurrent}>Current</div>
                                                    <div className={style.privilegeHeading}>
                                                        {(form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.length !== 0)
                                                            ? form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.map(data => (
                                                                <div>{data?.privileges}</div>
                                                            )) : (form?.basicDetails?.existingCredentialingPrivilegeCategory !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges !== null && form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.length !== 0)
                                                                ? form?.basicDetails?.existingCredentialingPrivilegeCategory?.hospitalPrivileges?.map(data => (
                                                                    <div>{data?.privileges}</div>
                                                                ))
                                                                : 'None'}
                                                    </div>
                                                </div>
                                                {form?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== '' && form?.forms?.[formIndex]?.data?.privilegeAtOtherHospitalYesOrNo !== undefined && (
                                                    <div
                                                        className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                                                    >
                                                        <div className={style.privilegeHeadingReappointment}>
                                                            Change for Reappointment
                                                        </div>
                                                        <div className={style.privilegeHeading}>
                                                            <div>
                                                                {privilegeAtOtherHospitalYesOrNo === 'No' ? (
                                                                    <div className={style.privilegeHeading}>None</div>
                                                                ) : (
                                                                    <div>
                                                                        {hospitalPrivilegeSet?.map(data => (
                                                                            <div className={style.privilegeHeading}>{`${form?.basicDetails?.existingCredentialingPrivilegeCategory?.priorHospitalPrivileges?.map(priorData => priorData?.privileges)?.includes(data?.privileges) ? 'Existing: ' : 'New: '} ${data?.hospitalName} - ${data?.privileges}`}</div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`${style.cardTitle} ${style.marginTop30}`}>
                            Do you want to keep your current Privilege Category?
                        </div>
                        <div className={`${style.borderStyleTiles}`}></div>
                        {privilegeChangeYesOrNo !== '' && (
                            <div
                                className={`${style.marginTop10} ${style.marginLeft30}`}
                            >
                                <div className={style.privilegeHeading}>
                                    {privilegeChangeYesOrNo === "Yes" ? (
                                        <div className={`${style.fontSize}`}>
                                            {`Same as Before - ${form?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}`}
                                        </div>
                                    ) : (
                                        <div className={`${style.privilegeHeading} ${style.marginTop10} ${style.fontSize}`}>
                                            Changed From {(form?.basicDetails?.priorPrivilegeCategory !== null && form?.basicDetails?.priorPrivilegeCategory?.name !== null)
                                                ? form?.basicDetails?.priorPrivilegeCategory
                                                    ?.name
                                                : form?.basicDetails
                                                    ?.credentialingPrivilegeCategory
                                                    ?.credentialingCategory} To {" "}
                                            {
                                                form?.basicDetails
                                                    ?.credentialingPrivilegeCategory
                                                    ?.credentialingCategory
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {(selectedPrivilegeForDisplay?.length > 0 ||
                            selectedPrivilegeForDisplay?.privilegeDetails?.corePrivileges) && (
                                <>
                                    <div className={`${style.cardTitle} ${style.marginTop30}`}>
                                        Requested Privilege Sets for Reappointment
                                    </div>
                                    <div className={`${style.borderStyleTiles}`}></div>
                                </>
                            )}

                        {selectedPrivilegeForDisplay?.map((data, dataIndex) => (
                            <div key={dataIndex}>
                                <div
                                    className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                                >
                                    {data?.privilegeSetTitle}
                                </div>
                                {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, catIndex) => (
                                    <div key={catIndex} >
                                        <div className={`${style.flex}`}>
                                            <div className={style.itemLeft}>
                                                <strong>{categories?.category || ""}</strong>
                                            </div>
                                        </div>
                                        {categories?.privileges?.map((privilege, privIndex) => (
                                            <div key={privIndex} className={style.privilegeCodeGrid}>
                                                <div className={style.itemLeft}>
                                                    <strong>{privilege?.privilegeId || ""}</strong>
                                                </div>
                                                <div className={style.itemLeft}>{privilege?.title || ""}</div>
                                            </div>
                                        ))}

                                    </div>
                                ))}
                                <div className={style.twoCol}>
                                    {selectedPrivilegeForDisplay?.[0] && (
                                        <>
                                            <div>
                                                <ESignature
                                                    userName={
                                                        selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.name || ""
                                                    }
                                                    encData={
                                                        selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.esign || ""
                                                    }
                                                    showData={!!selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign}
                                                    showDatais={true}
                                                />
                                            </div>
                                            <div className={style.verticalAlignCenter}>
                                                <div className={style.displayInRow}>
                                                    <div className={style.dateTitle}>Date:</div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>
                                                        {
                                                            selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate ||
                                                            ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {(data?.privilegeDetails
                                    ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                                    ?.length !== 0 &&
                                    data?.privilegeDetails
                                        ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                                        ?.length !== undefined) && (
                                        <div>
                                            <div className={`${style.cardTitle} ${style.advanceBoxStyle} ${style.marginTop30}`}>
                                                Advanced Privileges
                                            </div>
                                            <div key={dataIndex}>
                                                <div
                                                    className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                                                >
                                                    {data?.privilegeSetTitle}
                                                </div>
                                                {data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories) => {
                                                    return (
                                                        <div>
                                                            <div className={style.flex}>
                                                                <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                                                            </div>
                                                            <>{
                                                                categories?.privileges?.map(privileges => (
                                                                    <div className={style.privilegeCodeGrid}>
                                                                        <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                                                        <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                                                    </div>

                                                                ))
                                                            }
                                                            </>
                                                        </div>
                                                    )
                                                })}
                                                <div className={style.twoCol}>
                                                    <>
                                                        <div>
                                                            <ESignature
                                                                userName={
                                                                    data?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign !== null
                                                                        ? data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign?.name
                                                                        : ""
                                                                }
                                                                encData={
                                                                    data?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign !== null
                                                                        ? data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign?.esign
                                                                        : ""
                                                                }
                                                                showData={
                                                                    data?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign !== null &&
                                                                        data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign !== undefined
                                                                        ? true
                                                                        : false
                                                                }
                                                                showDatais={true}
                                                            />
                                                        </div>
                                                        <div className={style.verticalAlignCenter}>
                                                            <div className={style.displayInRow}>
                                                                <div className={style.dateTitle}>Date: </div>
                                                                <div className={`${style.date} ${style.marginLeft}`}>
                                                                    {data?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign !== null
                                                                        ? data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign?.signedDate
                                                                        : ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {dataIndex !== selectedPrivilegeForDisplay.length - 1 && (
                                    <div className={`${style.borderStyleTiles} ${style.marginTop10}`}></div>
                                )}
                            </div>
                        ))}
                        <>
                            {(selectedAdditionalPrivilegeForDisplay?.length > 0 ||
                                selectedAdditionalPrivilegeForDisplay?.privilegeDetails?.corePrivileges) && (
                                    <>
                                        <div className={`${style.cardTitle} ${style.marginTop30}`}>
                                            Requested Additional Privilege Sets for Reappointment
                                        </div>
                                        <div className={`${style.borderStyleTiles}`}></div>
                                    </>
                                )}

                            {selectedAdditionalPrivilegeForDisplay?.map((data, dataIndex) => (
                                <div key={dataIndex}>
                                    <div
                                        className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                                    >
                                        {data?.privilegeSetTitle}
                                    </div>
                                    {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, catIndex) => (
                                        <div key={catIndex} >
                                            <div className={`${style.flex}`}>
                                                <div className={style.itemLeft}>
                                                    <strong>{categories?.category || ""}</strong>
                                                </div>
                                            </div>
                                            {categories?.privileges?.map((privilege, privIndex) => (
                                                <div key={privIndex} className={style.privilegeCodeGrid}>
                                                    <div className={style.itemLeft}>
                                                        <strong>{privilege?.privilegeId || ""}</strong>
                                                    </div>
                                                    <div className={style.itemLeft}>{privilege?.title || ""}</div>
                                                </div>
                                            ))}

                                        </div>
                                    ))}
                                    <div className={style.twoCol}>
                                        {data && (
                                            <>
                                                <div>
                                                    <ESignature
                                                        userName={
                                                            data?.privilegeDetails?.corePrivileges?.esign?.name || ""
                                                        }
                                                        encData={
                                                            data?.privilegeDetails?.corePrivileges?.esign?.esign || ""
                                                        }
                                                        showData={!!data?.privilegeDetails?.corePrivileges?.esign}
                                                        showDatais={true}
                                                    />
                                                </div>
                                                <div className={style.verticalAlignCenter}>
                                                    <div className={style.displayInRow}>
                                                        <div className={style.dateTitle}>Date:</div>
                                                        <div className={`${style.date} ${style.marginLeft}`}>
                                                            {
                                                                data?.privilegeDetails?.corePrivileges?.esign?.signedDate ||
                                                                ""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {(data?.privilegeDetails
                                        ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                                        ?.length !== 0 &&
                                        data?.privilegeDetails
                                            ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                                            ?.length !== undefined) && (
                                            <div>
                                                <div className={`${style.cardTitle} ${style.advanceBoxStyle} ${style.marginTop30}`}>
                                                    Advanced Privileges
                                                </div>
                                                <div key={dataIndex}>
                                                    <div
                                                        className={`${style.privilegeHeading1} ${style.marginTop10} ${style.marginLeft30} ${style.marginBottom20}`}
                                                    >
                                                        {data?.privilegeSetTitle}
                                                    </div>
                                                    {data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories) => {
                                                        return (
                                                            <div>
                                                                <div className={style.flex}>
                                                                    <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                                                                </div>
                                                                <>{
                                                                    categories?.privileges?.map(privileges => (
                                                                        <div className={style.privilegeCodeGrid}>
                                                                            <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                                                            <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                                                        </div>

                                                                    ))
                                                                }
                                                                </>
                                                            </div>
                                                        )
                                                    })}
                                                    <div className={style.twoCol}>
                                                        <>
                                                            <div>
                                                                <ESignature
                                                                    userName={
                                                                        data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign !== null
                                                                            ? data?.privilegeDetails
                                                                                ?.restrictedPrivileges?.esign?.name
                                                                            : ""
                                                                    }
                                                                    encData={
                                                                        data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign !== null
                                                                            ? data?.privilegeDetails
                                                                                ?.restrictedPrivileges?.esign?.esign
                                                                            : ""
                                                                    }
                                                                    showData={
                                                                        data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign !== null &&
                                                                            data?.privilegeDetails
                                                                                ?.restrictedPrivileges?.esign !== undefined
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    showDatais={true}
                                                                />
                                                            </div>
                                                            <div className={style.verticalAlignCenter}>
                                                                <div className={style.displayInRow}>
                                                                    <div className={style.dateTitle}>Date: </div>
                                                                    <div className={`${style.date} ${style.marginLeft}`}>
                                                                        {data?.privilegeDetails
                                                                            ?.restrictedPrivileges?.esign !== null
                                                                            ? data?.privilegeDetails
                                                                                ?.restrictedPrivileges?.esign?.signedDate
                                                                            : ""}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    {dataIndex !== selectedAdditionalPrivilegeForDisplay?.length - 1 && (
                                        <div className={`${style.borderStyleTiles} ${style.marginTop10}`}></div>
                                    )}
                                </div>
                            ))}
                        </>
                    </>
                );
            default:
                return <></>;
        }
    };

    return (
        <div>
            {isLoadingImageDocs && (
                <div
                    className={`${style.loadingOverlay}`}
                >
                    <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={dataLoadingGIF} alt="" className={style.dataLoadingStyle} />
                </div>
            )}
            <ApplicationHeader
                title={`${form?.creationType === "NEW" ? "Clarification Required For New Application For" : "Clarification Required For Reappointment Application For"}   ${form?.basicDetails?.applicant?.name?.firstName !== undefined
                    ? form?.basicDetails?.applicant?.name?.firstName
                    : "{First Name}"
                    } ${form?.basicDetails?.applicant?.name?.lastName !== undefined
                        ? form?.basicDetails?.applicant?.name?.lastName.toLowerCase()
                        : "{Last Name}"
                    }, ${form?.basicDetails?.applicant?.applicantType !== undefined
                        ? form?.basicDetails?.applicant?.applicantType
                        : "{Applicant Type}"
                    }`}
                close={true}
                closeClick={handleCloseClick}
            />
            <div className={` ${style.screenPadding}`}>
                {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
                <div className={` ${style.applicationScreenGrid}  ${showInfo ? "blurredBackground" : ""}`}>
                    <div>
                        <div className={`${style.applicationCardStyle} ${style.headingTextStyle}`}>
                            {clarificationSubject}
                        </div>
                        <div className={`${style.applicationCardStyle} ${style.headingTextStyle} ${style.marginTop20}`}>
                            <div className={style.spaceBetween}>
                                <div>
                                    Prior Reference
                                </div>
                                {collapseOpen ? (
                                    <div onClick={() => setCollapseOpen(false)} className={style.cursorPointer}>
                                        <RemoveIcon sx={{ fontSize: '25px' }} />
                                    </div>
                                ) : (
                                    <div onClick={() => setCollapseOpen(true)} className={style.cursorPointer}>
                                        <AddIcon sx={{ fontSize: '25px' }} />
                                    </div>
                                )}
                            </div>
                            {collapseOpen && (
                                <div className={style.marginTop}>
                                    {/* <div className={style.marginTop20}>
                                        {fileReference?.fileType === 'application/pdf' ? (
                                            <iframe src={`${fileReference?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>
                                        ) : file?.fileType?.startsWith("image/") ? (
                                            <img src={fileReference?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
                                        ) : <iframe src={`${fileReference?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>}
                                    </div>
                                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                                        {fieldsReference?.map((field, index) => (
                                            <div>
                                                <div className={`${style.lableStyle} ${style.marginTop10}`}>{field?.label}</div>
                                                <div className={style.dividerStyle}></div>
                                                <div className={`${style.notesAlignment} ${style.marginTop10} ${style.lableStyle}`}>
                                                    {changedData !== null ? changedData[field?.name] !== undefined ? field?.fieldType === "datepicker" ? format(new Date(changedData[field?.name]), 'dd/MM/yyyy') : changedData[field?.name] : "" : ""}
                                                </div>
                                            </div>
                                        ))}
                                    </div> */}
                                    {renderFieldsBasedOnStepReappointment(form?.formSchemas?.[renderSchemaIndex])}
                                </div>
                            )}
                        </div>
                        <div className={`${style.applicationCardStyle} ${style.marginTop20}`}>
                            <div className={style.headingTextStyle}>Request For Clarification</div>
                            <CommonDivider />
                            <div
                                className={`${style.textStyle} ${style.marginTop20} `}
                                dangerouslySetInnerHTML={{ __html: clarificationDescription }}
                            />
                            <div className={`${style.headingTextStyle} ${style.marginTop20}`}>Respond To Request Below</div>
                            <div className={`${style.commentHeadingTextStyle} ${style.marginTop20}`}>Clarification Response*</div>
                            <div className={`${style.marginTop10}`}>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={userNotes}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setUserNotes(data);
                                    }}
                                    // onChange={(event, editor) => handleTextChange(editor)}
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
                                        // disableNativeSpellChecker: false,        
                                        // extraPlugins: [WProofreader],
                                        // wproofreader: {
                                        //   // serviceId: 'your-service-id', // Replace with your service ID
                                        //   srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js',
                                        // },
                                    }}
                                    onReady={(editor) => {
                                        const editorElement = editor.editing.view.document.getRoot();
                                        editor.editing.view.change(writer => {
                                            writer.setStyle(
                                                'min-height',
                                                '100px',
                                                editorElement
                                            );
                                        });
                                    }}

                                />
                            </div>
                            <div className={` ${style.marginTop10}`}>
                                <CommonDropZone
                                    title={"Upload Your Document"}
                                    description={
                                        "Upload your file or drag & drop from your document cabinet"
                                    }
                                    changeHandler={changeHandler}
                                    files={files}
                                />
                                {/* <CommonDropZone
                                    title={"Upload A Photo"}
                                    description={
                                        "Take a picture with your Camera or Upload from Gallery."
                                    }
                                    changeHandler={changeHandler}
                                    files={files}
                                    accept="image/*"
                                /> */}
                            </div>
                            {!(clarificationType !== undefined && clarificationType !== "" && clarificationType !== null) ? (
                                <>
                                    {uploadFileData?.length > 0 && (
                                        <div>
                                            {uploadFileData?.map((file, index) => (
                                                <div key={index} className={`${style.alignItem} ${style.marginTop10}`}>
                                                    <div className={`${style.threeColumnGrid}`}>
                                                        <div className={`${style.displayInRow} ${style.referenceCardStyle} ${style.verticalAlignCenter}`}>
                                                            <DescriptionIcon className={style.docsIcon} />
                                                            <div className={style.marginLeft20}>{file?.file?.fileName || file?.fileName}</div>
                                                        </div>
                                                        <div>
                                                            <CommonInputField
                                                                value={documentTitle[index] || ""}
                                                                onChange={(e) => {
                                                                    const newDocumentTitle = [...documentTitle];
                                                                    newDocumentTitle[index] = e.target.value;
                                                                    setDocumentTitle(newDocumentTitle);
                                                                }}
                                                                type="text"
                                                                placeholder="Title*"
                                                                className={style.referenceCardStyleDescription}
                                                            />
                                                        </div>
                                                        <div>
                                                            <CommonInputField
                                                                value={documentDesc[index] || ""}
                                                                onChange={(e) => {
                                                                    const newDocumentDesc = [...documentDesc];
                                                                    newDocumentDesc[index] = e.target.value;
                                                                    setDocumentDesc(newDocumentDesc);
                                                                }}
                                                                type="text"
                                                                placeholder="Description (Optional)"
                                                                className={style.referenceCardStyleDescription}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={style.tableContainer}>
                                    {tempValue?.table?.length !== 0 && tempValue?.table !== undefined && (
                                        <TableTwo
                                            tableHeaderValues={[
                                                "",
                                                "File Uploaded",
                                                "Document Type",
                                                "Verified",
                                                "Valid",
                                                "",
                                            ]}
                                            tableDataValues={getApplicantValues(uploadFileData)}
                                            tableData={uploadFileData || []}
                                            gridStyle={style.gridStyle}
                                            // actions={actions}
                                            // scrollStyle={style.contractScrollStyle}
                                            tableSortValues={[]}
                                            heading={"You have not yet uploaded any documents."}
                                            onClickFunction={() => { }}
                                        />
                                    )}
                                </div>
                            )}
                            {/* 
                            <div>
                                <CommonCheckBox
                                    className={`${style.marginTop20} ${style.textAlignLeft}`}
                                    label={("I certify that the information i provieded consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.")}
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                            </div>
                            <div className={`${style.headingTextStyle} ${style.marginTop20}`}>For Your Reference</div>
                            <div className={style.spaceBetween}>
                                <div className={style.heading}>{file?.fileUploaded !== undefined ? `${file?.documentType} ${file?.fileUploaded}` : file?.fileName !== undefined ? ` ${file?.fileName}` : ''}</div>
                            </div>
                            <div className={style.marginTop20}>
                                {file?.fileType === 'application/pdf' ? (
                                    <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>
                                ) : file?.fileType?.startsWith("image/") ? (
                                    <img src={file?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
                                ) : <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>}
                            </div>
                            <div className={`${style.twoCol} ${style.marginTop20}`}>
                                {fields?.map((field, index) => renderFields(field, index))}
                            </div> */}
                        </div>
                    </div>
                    <div>
                        {!showInfo && (
                            <div>
                                <div className={`${style.toggleButton}`} onClick={() => setShowInfo(!showInfo)}>
                                    <MenuIcon className={style.toggleIcon} />
                                </div>
                                <div className={`${style.headerData}`}>
                                    <span style={{ marginLeft: '20px' }}>Required Clarification for the Documents</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
                                <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
                                {/* <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} /> */}
                                <div >
                                    <ApplicationAssistanceCard
                                        user={"Neena Greenly"}
                                        designation={"{Designation}"}
                                        contactNumber={"{Contact Number}"}
                                        email={"{Email}"}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`${style.stickyContainer}`}>
                            <div className={`${style.saveInProgress} ${style.marginTop20}`}
                                onClick={() => getClarificationResponse(true)}
                            >
                                SAVE IN PROGRESS
                            </div>
                            <div className={`${style.continue} ${style.marginTop10}`}
                                onClick={() => getClarificationResponse()}
                            >CONTINUE</div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.footerContainer}`}>
                    <img
                        src={HapiCare}
                        alt="footer"
                        className={style.footerIconStyle}
                    />
                    <p className={style.poweredBy}>
                        © {new Date().getFullYear()} HapiCare, Inc
                    </p>
                </div>

            </div>
            {showFileWithFields && (
                <FileWithFields getIsOpen={getIsOpenFileWithFields} fields={fields} metadata={fileMetadata} file={file} schemaId={form?.forms?.[formIndex]?.schemaId} applicationDocumentId={applicationDocumentId} getPreApplication={getPreApplication} />
            )}
            {
                showDeleteConfirmation && (
                    <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation}
                        getDeleteConfirmation={getDeleteConfirmation}
                        confirmationText="Do you want to delete this document?" />
                )
            }
            {
                showFileDisplayDialog && (
                    <FileDisplayDialog
                        getIsOpen={getIsShowFileDialog}
                        file={selectedFile}
                    />
                )
            }
        </div>
    )
}

export default ApplicantPortalRFC;