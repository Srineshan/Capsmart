import React, { useState, useCallback, useRef, createRef, useEffect } from 'react';
import { Dialog, Classes, TextArea } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReactToPrint, { useReactToPrint } from "react-to-print";

import style from './index.module.scss'
import CommonTextField from '../CommonFields/CommonTextField';
import CommonPhoneField from '../CommonFields/CommonPhoneField';
import CommonDateField from '../CommonFields/CommonDateField';
import { TextField } from '@mui/material';
import { PUT } from '../../Screens/dataSaver';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const FileWithFields = ({ fields, metadata, file, getIsOpen, schemaId, applicationDocumentId, getPreApplication }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const { applicationId, section, step } = useParams()
    const [calendarStart, setCalendarStart] = useState(false);
    const [changedData, setChangedData] = useState({})
    const [isEdited, setIsEdited] = useState(false);
    useEffect(() => {
        console.log("filesssssssssssssssss", file);
        // getPreApplicationTask();
    }, []);

    useEffect(() => {
        setChangedData(metadata);
    }, [metadata])

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

    const handleChange = (value, name) => {
        let temp = changedData;
        temp[name] = value;
        setChangedData(temp);
        console.log(temp, 'field')
    }

    const handleContinue = async () => {
        if (isEdited || changedData === null) {
            let baseUrl = `application-management-service/application/${applicationId}/updateDocumentData?applicationDocumentId=${applicationDocumentId}&manuallyUpdated=${true}`;
            let url = window.location.pathname.includes("reappointmentApplicationForm") ? atob(step) !== "UploadYourDoc" ? `${baseUrl}&schemaId=${schemaId}` : baseUrl : baseUrl;
            await PUT(url, changedData !== null ? changedData : {})
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
                                <FullscreenSharpIcon
                                    className={`${style.iconStyle} ${style.cursorPointer} `}
                                    onClick={toggleExpand}
                                    sx={{ color: '#06617A' }}
                                />) : (
                                <FullscreenExitIcon
                                    className={`${style.iconStyle} ${style.cursorPointer} `}
                                    onClick={toggleExpand}
                                    sx={{ color: '#06617A' }}
                                />
                            )
                            }
                            {/* <FullscreenSharpIcon
                                className={`${style.iconStyle} ${style.cursorPointer} `}
                                onClick={toggleExpand}
                                sx={{ color: '#06617A' }} 
                            /> */}
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <div className={style.marginTop}>
                        {file?.fileType === 'application/pdf' ? (
                            <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>
                        ) : file?.fileType?.startsWith("image/") ? (
                            <img src={file?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
                        ) : <iframe src={`${file?.fileURL}#toolbar=0`} width="100%" height="600px"></iframe>}
                    </div>
                    <div className={`${style.twoCol} ${style.marginTop}`}>
                        {fields?.map((field, index) => renderFields(field, index))}
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
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { handleContinue(); }}>CONTINUE</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default FileWithFields;