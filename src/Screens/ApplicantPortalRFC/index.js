import React, { useState, useEffect } from 'react';
import { TextArea } from '@blueprintjs/core';
import { format } from 'date-fns';
import { TextField } from '@mui/material';
import { GET, POST, PUT } from '../../Screens/dataSaver';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import ApplicationHeader from "../../Components/ApplicationHeader";
import { useNavigate, useParams } from "react-router-dom";
import TableTwo from "../../Components/TableDesignTwo";
import style from './index.module.scss';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MenuIcon from "@mui/icons-material/Menu";
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonDivider from '../../Components/CommonFields/CommonDivider';
import CommonDropZone from '../../Components/CommonFields/CommonDropZone';
import Close from './../../images/close.png';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';
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
    const [applicationDocumentId, setApplicationDocumentId] = useState('');
    const [changedData, setChangedData] = useState({})
    const [calendarStart, setCalendarStart] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [clarificationSubject, setClarificationSubject] = useState("");
    const [clarificationDescription, setClarificationDescription] = useState("");
    const [respondentName, setRespondentName] = useState("");
    const [selectedCommunicationMethod, setSelectedCommunicationMethod] = useState('');
    const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);
    const [uploadFileData, setUploadFileData] = useState([]);
    const [documentDesc, setDocumentDesc] = useState("");
    const [documentTitle, setDocumentTitle] = useState("");
    const [taskId, setTaskId] = useState("");
    const [taskById, setTaskById] = useState({});

    useEffect(() => {
        if (taskById?.details?.application?.application?.id !== undefined) {
            getPreApplication();
        }
    }, [taskById?.details?.application?.application?.id]);

    // useEffect(() => {
    //     getTaskInfo()
    // }, [taskId])

    useEffect(() => {
        getTaskInfoByParams()
    }, [clarificationId])

    useEffect(() => {
        setFormIndex(form?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc"))
    }, [form])

    const getFormSchema = async () => {
        if (form?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: formlevel } = await GET(
                `application-management-service/formSchema/${form?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(formlevel?.schema)
        }
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

    const getPreApplication = async () => {
        setIsLoading(true)
        const query = new URLSearchParams(window.location.search);
        const applicationIdFromParam = query.get("app");
        const formIdFromParam = query.get("form");
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationIdFromParam}`
        );
        setForm(basicForm);
        setClarificationSubject(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationRequest?.clarificationTitle)
        setClarificationDescription(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationRequest?.clarificationDescription)
        if (basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse !== null) {
            setUploadFileData(basicForm?.forms?.filter(data => data?.id === formIdFromParam)?.[0]?.clarifications?.filter(clarificationData => clarificationData?.id === clarificationId)?.[0]?.clarificationResponse?.attachedDocuments)
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

    const getDocument = async () => {
        const { data: response } = await GET(
            `document-management-service/document/67b81938783ada4864899ff8`
        );
        console.log(response);
        setFields(response?.fields);
        setFile(response?.file);
        setFileMetadata(response?.metaData);
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
        navigate("/applicantDashboard");
    };

    // const getApplicantValues = (array) => {
    //     let temp = [];
    //     console.log(array, 'array')
    //     Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.map((data, index) => {
    //         if (data === "file") {
    //             temp.push({
    //                 "type": "icon", "icon": array?.map(innerData => {
    //                     const rowId = innerData?.rowId; return innerData?.fileType === 'application/pdf' ?
    //                         (<Tooltip title="Click to Open" arrow>
    //                             <img src={PDFDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId) }} /> </Tooltip>
    //                         ) : innerData?.fileType?.startsWith("image/") ?
    //                             (<Tooltip title="Click to Open" arrow>
    //                                 <img src={imgDocs} alt="" className={style.docTypeImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId) }} /> </Tooltip>) : (<TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.fileURL, '_blank'); }} />)
    //                 }), 'isShowHoverText': false
    //             });
    //         } else {
    //             if (data === "documentType") {
    //                 temp.push({
    //                     "type": "field", "field": array?.map((innerData, innerIndex) => <CommonSelectField
    //                         value={innerData[data]}
    //                         onChange={(e) => handleChange(e.target.value, innerIndex)}
    //                         className={style.fullWidth}
    //                         // firstOptionLabel={fieldData.label}
    //                         // firstOptionValue={fieldData.label}
    //                         valueList={getDropDownValues(innerData[data]) || []}
    //                         labelList={getDropDownValues(innerData[data]) || []}
    //                         disabledList={getDropDownValues(innerData[data])?.map(data => false)}
    //                     />)
    //                 });
    //             } else if (data === "valid") {
    //                 temp.push({ "type": "icon", "icon": array?.map(innerData => innerData?.documentType === 'Profile Picture' ? <RemoveIcon style={{ fontSize: 20, marginLeft: 13 }} /> : innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 13 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 13 }} />), 'isShowHoverText': false });
    //             } else if (data === "verified") {
    //                 temp.push({ "type": "icon", "icon": array?.map(innerData => innerData?.documentType === 'Profile Picture' ? <RemoveIcon style={{ fontSize: 20, marginLeft: 20 }} /> : innerData[data] ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A`, marginLeft: 20 }} /> : <WarningAmberRoundedIcon style={{ fontSize: 20, color: `#FF6562`, marginLeft: 20 }} />), 'isShowHoverText': false });
    //             } else {
    //                 temp.push({
    //                     "type": "text",
    //                     "value": array?.map(innerData => {
    //                         const rowId = innerData?.rowId;
    //                         return innerData[data] && (
    //                             <Tooltip title="Click to Open" arrow>
    //                                 <span
    //                                     onClick={() => {
    //                                         setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId)
    //                                     }}
    //                                 >
    //                                     {innerData[data]}
    //                                 </span>
    //                             </Tooltip>
    //                         );
    //                     })
    //                 });
    //             }
    //         }
    //         if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
    //             // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
    //             temp.push({
    //                 "type": "icon", "icon": array?.map(innerData =>
    //                     <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { setDeleteData(innerData); setShowDeleteConfirmation(true) }} />
    //                 ), 'isShowHoverText': false
    //             });
    //         }
    //         if (index === Object.keys(formSchema?.properties?.table?.tableHeaders || {})?.length - 1) {
    //             // temp.push({ "type": "action", "value": array?.map(innerData => actions) })
    //             temp.push({
    //                 type: "icon", icon: array?.map(innerData => {
    //                     const rowId = innerData?.rowId;
    //                     return (
    //                         <Tooltip title="Click to Edit" arrow>
    //                             <ModeEditOutlinedIcon alt="" className={style.docTypeEditImgStyle} onClick={() => { setIsLoadingDocs(true); setShowFileWithFields(true); getDocument(rowId); }} />
    //                         </Tooltip>
    //                     );
    //                 }),
    //                 isShowHoverText: false
    //             });
    //         }
    //     })
    //     console.log(temp, array, form?.documentsRequired?.map(data => data?.document?.shortName))
    //     return temp;
    // }

    const getClarificationResponse = async (saveInProgress) => {
        const query = new URLSearchParams(window.location.search);
        const applicationIdFromParam = query.get("app");
        const formIdFromParam = query.get("form");
        const files = (uploadFileData || []).map((item, index) => ({
            ...item.file || item,
            description: documentDesc[index] || "",
            title: documentTitle[index] || "",
        }));

        let temp = {
            clarificationResponseBy: "APPLICANT",
            responseMethod: '',
            title: respondentName,
            clarificationDescription: userNotes,
            attachedDocuments: files
        };

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
                getPreApplication();
                handleCloseClick();
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
                        <div className={`${style.applicationCardStyle} ${style.textStyle}`}>
                            {clarificationSubject}
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
                            {/* <div className={style.tableContainer}>
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
        </div>
    )
}

export default ApplicantPortalRFC;