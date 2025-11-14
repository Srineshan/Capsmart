import React, { useState, useCallback, useRef, createRef, useEffect } from 'react';
import { Dialog, Classes, TextArea } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import style from './index.module.scss'
import CommonTextField from '../CommonFields/CommonTextField';
import CommonPhoneField from '../CommonFields/CommonPhoneField';
import CommonDateField from '../CommonFields/CommonDateField';
import { TextField, Tooltip } from '@mui/material';
import { PUT, GET } from '../../Screens/dataSaver';
import { useParams } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { ErrorToaster2 } from '../../utils/toaster';

const FileWithFieldsForStaff = ({ getIsOpen, schemaId, getPreApplication, applicationIdFromEdit, rowId, staffId }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const { applicationId, section, step } = useParams()
    const [calendarStart, setCalendarStart] = useState(false);
    const [changedData, setChangedData] = useState({})
    const [isEdited, setIsEdited] = useState(false);
    const [editNotes, setEditNotes] = useState('');
    const [documentDetails, setDocumentDetails] = useState();
    const [fields, setFields] = useState();
    const [file, setFile] = useState();
    const [applicationDocumentId, setApplicationDocumentId] = useState();
    const [metadata, setMetadata] = useState();
    const [isLoadingDocs, setIsLoadingDocs] = useState(false);
    useEffect(() => {
        console.log("filesssssssssssssssss", file);
        // getPreApplicationTask();
    }, []);

    useEffect(() => {
        setChangedData(metadata);
    }, [metadata])

    useEffect(() => {
        if (rowId)
            getDocument()
    }, [rowId])

    const getDocument = async () => {
        const { data: response } = await GET(
            `document-management-service/document/${rowId}`
        );
        console.log(response);
        setFields(response?.fields);
        setFile(response?.file);
        setMetadata(response?.metaData);
        setApplicationDocumentId(response?.id);
        setIsLoadingDocs(false);
        console.log("fields", fields)
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrintClick = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Staff Application",
        removeAfterPrint: true,
    });
    const getDocumentDetails = async () => {
        try {
            const { data: documentData } = await GET(`application-management-service/staff/${applicationDocumentId}/documents`);
            setDocumentDetails(documentData);
        } catch (error) {
            console.error('Error fetching application:', error);
        }
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
                const minDate =
                    field.name === "expiry_date" && changedData?.test_date
                        ? new Date(changedData.test_date)
                        : null;

                const dateValue = changedData?.[field?.name]
                    ? parseISO(changedData[field.name])
                    : null;
                return (
                    <CommonDateField
                        className={style.fullWidth}
                        open={calendarStart}
                        onOpen={() => setCalendarStart(true)}
                        onClose={() => setCalendarStart(false)}
                        value={dateValue}
                        onChange={(newValue) => {
                            if (newValue && isValid(newValue)) {
                                // Format to backend-compatible string (yyyy-MM-dd'T'00:00)
                                const backendFormattedDate = format(newValue, "yyyy-MM-dd'T'00:00");
                                setChangedData({
                                    ...changedData,
                                    [field.name]: backendFormattedDate
                                });
                            } else {
                                // Clear the field if invalid
                                setChangedData({
                                    ...changedData,
                                    [field.name]: null
                                });
                            }
                            setIsEdited(true);
                        }}
                        minDate={minDate}
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
                                    placeholder: 'DD/MM/YYYY',
                                }}
                                color={""}
                                fullWidth
                                error={changedData?.[field.name] && !isValid(parseISO(changedData[field.name]))}
                                helperText={
                                    changedData?.[field.name] && !isValid(parseISO(changedData[field.name]))
                                        ? "Invalid date"
                                        : ""
                                }
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

    const handleChange = (value, name) => {
        let temp = changedData;
        temp[name] = value;
        setChangedData(temp);
        console.log(temp, 'field')
    }

    const handleContinue = async () => {
        if (editNotes === "") {
            ErrorToaster2("Enter Edit Notes.")
            return
        }
        if (isEdited || changedData === null || window.location.pathname.includes('Q01F')) {
            let updateData = {
                data: changedData,
                notes: {
                    notes: editNotes
                }
            }
            let url = `application-management-service/staff/${applicationIdFromEdit}/documents/${rowId}/data`;
            await PUT(url, changedData !== null ? updateData : {})
                .then(response => {
                    console.log(response)
                    getPreApplication()
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getIsOpen(false)
    }

    console.log(changedData, 'field', fields, metadata, file)
    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog}  ${isExpanded ? style.eSignDialogBackground1 : style.eSignDialogBackground} ${isExpanded ? style.expandedDialog : ''}`} canOutsideClickClose={false} canEscapeKeyClose={false} ref={PDFRef}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    {/* <div className={` ${isExpanded ? style.dialog :Classes.DIALOG_BODY}`}> */}
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>{file?.fileUploaded !== undefined ? `${file?.documentType} ${file?.fileUploaded}` : file?.fileName !== undefined ? ` ${file?.fileName}` : ''}</div>
                        <div className={style.displayInRow}>
                            {/* <div
                                className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                                    } ${style.cursorPointer} ${style.marginRight}`}
                            >
                                <PrintOutlinedIcon
                                    sx={{
                                        fontSize: isPrintClicked ? 20 : 25,
                                        color: isPrintClicked ? "#fff" : "#06617A",
                                    }}
                                    onClick={handlePrintClick}
                                />
                            </div> */}
                            {!isExpanded ? (
                                <Tooltip title={"Click to Expand"} arrow>
                                    <FullscreenSharpIcon
                                        className={`${style.iconStyle} ${style.cursorPointer} `}
                                        onClick={toggleExpand}
                                        sx={{ color: '#06617A' }}
                                    />
                                </Tooltip>) : (
                                <Tooltip title={"Click to Minimize"} arrow>
                                    <FullscreenExitIcon
                                        className={`${style.iconStyle} ${style.cursorPointer} `}
                                        onClick={toggleExpand}
                                        sx={{ color: '#06617A' }}
                                    />
                                </Tooltip>
                            )
                            }
                            {/* <FullscreenSharpIcon
                                className={`${style.iconStyle} ${style.cursorPointer} `}
                                onClick={toggleExpand}
                                sx={{ color: '#06617A' }} 
                            /> */}
                            <Tooltip title={"Click to Close"} arrow>
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} `}
                                    onClick={() => { getIsOpen(false) }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        {file?.fileType === 'application/pdf' ? (
                            <iframe src={`${file?.fileURL}#toolbar=1&view=fitV`} width="100%" height="600px"></iframe>
                        ) : file?.fileType?.startsWith("image/") ? (
                            <img src={file?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
                        ) : <iframe src={`${file?.fileURL}#toolbar=1&view=fitV`} width="100%" height="600px"></iframe>}
                    </div>
                    <div className={style.marginTop}>
                        {(!window.location.pathname.includes("reappointmentApplicationForm") && !window.location.pathname.includes("locumApplicationForm")) && (
                            <div className={style.marginTop10}>
                                <div className={style.lableStyle}>Reason for Editing Document Details by MSO *</div>
                                <div className={style.marginTop10}>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={editNotes}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setEditNotes(data);
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
                        )}
                        <div className={`${style.twoCol} ${style.marginTop}`}>
                            {fields?.map((field, index) => renderFields(field, index))}
                        </div>
                    </div>
                    {/* <div className={`${style.twoCol} ${style.marginTop}`}>
                        {fields?.map(data => (
                            <CommonTextField
                                value={changedData?.[data?.name]}
                                className={style.fullWidth}
                                onChange={(e) => setChangedData({ ...changedData, [data.name]: (data.name === "creditOrHours" || data.name === "credits") ? e.target.value !== "" ? parseFloat(e.target.value) : 0 : e.target.value })}
                                maxLength={50}
                                placeholder={''}
                                label={data.label}
                                required={false}
                                // type={fieldData.type}
                                warning={false}

                            />
                        ))}
                    </div> */}
                    <div className={`${style.justifyRight} ${style.displayInRow} ${style.marginTop}`}>
                        <Tooltip title={"Click to Continue"} arrow>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { handleContinue(); }}>CONTINUE</div>
                        </Tooltip>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default FileWithFieldsForStaff;