import React, { useEffect, useState } from 'react';
import CommonPhoneField from '../../Components/CommonFields/CommonPhoneField';
import CommonInputField from '../CommonFields/CommonInputField';
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonDateField from '../CommonFields/CommonDateField';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import { TextField } from '@mui/material';
import { add, format, sub } from 'date-fns';
import { FormatPhoneNumber } from '../../utils/formatting';
import CommonRadio from '../CommonFields/CommonRadio';
import CommonSwitch from '../CommonFields/CommonSwitch';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckIcon from '@mui/icons-material/Check';
import style from './index.module.scss';
import CommonCheckBox from '../CommonFields/CommonCheckBox';
import { TextArea } from '@blueprintjs/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CommonDivider from '../CommonFields/CommonDivider';
import { POST } from '../../Screens/dataSaver';
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';
import TableTwo from '../TableDesignTwo';
import CommonDropZone from '../CommonFields/CommonDropZone';

const TEXTFIELDLEN50 = 50;

const ApplicationFieldCard = ({ object, gridStyle, baseKey, basicForm, setBasicForm, showAdd, addMoreType, addMoreOpenBydefault, collapsableQuestionCard, isBasicPath, stepPath, formId, getIsSubmitClicked, applicationId, tableGrid, setIsEdited }) => {
    const [calendarStart, setCalendarStart] = useState(false);
    const [isAddMore, setIsAddMore] = useState(addMoreOpenBydefault ? true : false);
    const [isCollapsableCard, setIsCollapsableCard] = useState(true);
    const basicpath = isBasicPath ? 'basicDetails' : stepPath;
    const [isTableEdit, setIsTableEdit] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        renderObjectFields(object)
        console.log('entered')
    }, [basicForm]);

    // const setNestedValue = (obj, path, value) => {
    //     console.log(obj, path, value, 'Test')
    //     const keys = path.split('.');
    //     let current = obj;
    //     console.log(current)
    //     for (let i = 0; i < keys.length - 1; i++) {
    //         if (!current[keys[i]]) current[keys[i]] = {};
    //         current = current[keys[i]];
    //     }

    //     current[keys[keys.length - 1]] = value;
    // };

    const isFileObject = (value) => {
        if (value instanceof File) {
            return true;
        }

        if (Array.isArray(value)) {
            return value.every(item => item instanceof File);
        }

        return false;
    };

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

            // await POST(`application-management-service/application/${applicationId}/files`, formData)
            //     .then(response => {
            //         SuccessToaster('File Uploaded Successfully');
            //         console.log(response?.data)
            //         return response?.data;
            //     })
            //     .catch(error => {
            //         ErrorToaster('File Upload Failed');
            //     })
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

    const changeHandler = async (event) => {
        console.log(event)
        setFiles(event);
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
            const response = await POST(`application-management-service/application/${applicationId}/files/bulk`, formData);
            SuccessToaster('File Uploaded Successfully');
            console.log(response?.data);
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error(error);
            return null;
        }
    };

    const setNestedValue = async (obj, path, value) => {
        console.log(obj, path, value, 'Test');

        // Split the path into keys, handling both dot and bracket notation
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);

        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            // Convert to a number if the key is an integer, to handle array indices correctly
            const key = isNaN(keys[i]) ? keys[i] : Number(keys[i]);

            if (!current[key]) {
                // Check if the next key is a number to decide whether to create an array or an object
                current[key] = isNaN(keys[i + 1]) ? {} : [];
            }
            current = current[key];
        }

        const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : Number(keys[keys.length - 1]);
        console.log(value)
        if (isFileObject(value)) {
            let file;
            if (Array.isArray(value)) {
                file = await changeHandler(value);
            } else {
                file = await addNewDocument(value);
            }
            console.log(file)
            current[lastKey] = file;
        } else {
            current[lastKey] = value;
        }
    };

    console.log(basicForm, 'Test')

    const handleChange = (path, value, basePath, basePath2, basePath3) => {
        console.log(path, value, basePath, baseKey, 'Check')
        if (stepPath !== undefined) {
            setIsEdited(true);
        }
        setBasicForm((prevData) => {
            const newData = { ...prevData };
            if (basePath3 && basePath2 && basePath && path) {
                setNestedValue(newData, `${basePath}.${basePath2}.${basePath3}.${path}`, value);
                setNestedValue(newData, `${basicpath}.${basePath}.${path}`, value);
            } else if (basePath2 && basePath && path) {
                setNestedValue(newData, `${basePath}.${basePath2}.${path}`, value);
                setNestedValue(newData, `${basicpath}.${basePath}.${path}`, value);
            } else if (basePath && path) {
                setNestedValue(newData, `${basePath}.${path}`, value);
                setNestedValue(newData, `${basicpath}.${basePath}.${path}`, value);
            } else if (path) {
                setNestedValue(newData, `${path}`, value);
                setNestedValue(newData, `${basicpath}.${path}`, value);
            } else {
                setNestedValue(newData, baseKey, value);
                setNestedValue(newData, `${basicpath}.${baseKey}`, value);
            }

            return newData;
        });
    }

    // const handleChange = (path, value, basePath, basePath2, basePath3) => {
    //     console.log(basePath, basePath2, basePath3, path, value)
    //     setBasicForm((prevData) => {
    //         const newData = { ...prevData };
    //         const fullPath = basePath;
    //         const basicPath = `basicDetails.${fullPath}`;

    //         setNestedValue(newData, fullPath, value);
    //         setNestedValue(newData, basicPath, value);

    //         return newData;
    //     });
    // };

    // const setNestedValue = (obj, path, value) => {
    //     const keys = path.split('.');
    //     let current = obj;
    //     for (let i = 0; i < keys.length - 1; i++) {
    //         if (typeof current[keys[i]] !== 'object' || current[keys[i]] === null) {
    //             current[keys[i]] = {};
    //         }
    //         current = current[keys[i]];
    //     }
    //     current[keys[keys.length - 1]] = value;
    // };

    const renderField = (fieldKey, fieldData, baseKey, handleChange, getValueByPath, style, calendarStart, setCalendarStart) => {
        if ((!object?.then?.required?.includes(fieldKey) || getValueByPath(basicForm, `${baseKey}.${Object.entries(object?.if?.properties)?.map(([key, data]) => key)}`) === Object.entries(object?.if?.properties)?.map(([key, data]) => data)[0]?.const) && fieldData.fieldType) {
            switch (fieldData.fieldType) {
                case 'dropdown':
                    console.log(getValueByPath(basicForm, 'forms[1]'), `${basicpath}.${baseKey}.${fieldKey}`, 'dropdown', basicForm)
                    return (
                        <CommonSelectField
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                            onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                            className={style.fullWidth}
                            // firstOptionLabel={fieldData.label}
                            // firstOptionValue={fieldData.label}
                            valueList={fieldData.enum}
                            labelList={fieldData.enum}
                            disabledList={fieldData.enum.map(data => false)}
                            label={fieldData.label}
                            required={fieldData.required?.includes(fieldKey)}
                        />
                    );
                case 'textbox':
                    return (
                        <CommonInputField
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || ''}
                            className={style.fullWidth}
                            onChange={(e) => handleChange(fieldKey, fieldData.type === "number" ? parseInt(e.target.value <= fieldData.maximum ? e.target.value : fieldData.maximum) : e.target.value, baseKey)}
                            maxLength={TEXTFIELDLEN50}
                            placeholder={fieldData.label !== null ? `Enter ${fieldData.label}` : null}
                            label={fieldData.label}
                            required={fieldData.required?.includes(fieldKey)}
                            type={fieldData.type}
                            min={fieldData.minimum}
                        />
                    );
                case 'textArea':
                    return (
                        <div>
                            <div className={`${style.lableStyle}`}>{fieldData.label}{fieldData.required?.includes(fieldKey) && '*'}</div>
                            <TextArea
                                value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                                className={`${style.fullWidth} ${style.marginTop10}`}
                                onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={fieldData.label !== null ? `Enter ${fieldData.label}` : null}
                                rows={4}
                            />
                        </div>
                    );
                case 'cellNumber':
                    return (
                        <CommonPhoneField
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                            className={style.fullWidth}
                            onChange={(e) => handleChange(fieldKey, FormatPhoneNumber(e.target.value), baseKey)}
                            placeholder={fieldData.label !== null ? `Enter ${fieldData.label}` : null}
                            label={fieldData.label}
                            required={fieldData.required?.includes(fieldKey)}
                        />
                    );
                case 'datepicker':
                    return (
                        <CommonDateField
                            className={style.fullWidth}
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}
                            // minDate={sub(new Date(), { years: 3 })}
                            // maxDate={add(new Date(), { months: 6 })}
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                            onChange={(newValue) => handleChange(fieldKey, fieldData.format === "date-time" ? format(new Date(newValue), "yyyy-MM-dd'T'HH:mm:ss'Z'") : format(new Date(newValue), 'yyyy-MM-dd'), baseKey)}
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
                                        placeholder: fieldData.label,
                                    }}
                                    fullWidth
                                />
                            )}
                            label={fieldData.label}
                            required={fieldData.required?.includes(fieldKey)}
                        />
                    );
                case 'radiobutton':
                    return (
                        <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
                            <div className={`${style.lableRadioStyle} ${fieldData.label !== null ? style.marginRight : ''}`}>{fieldData.label}{fieldData.required?.includes(fieldKey) && '*'}</div>
                            <CommonRadio
                                className={style.leftAlign}
                                value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                                onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                                radioValue={fieldData.enum}
                                label={fieldData.enum}
                            />
                        </div>
                    );
                case 'switchbutton':
                    return (
                        <CommonSwitch label={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === true ? 'YES' : 'NO'} checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null} onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} labelName={fieldData.label} />
                    );
                case 'checkbox':
                    return (
                        <CommonCheckBox
                            checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                            onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} label={fieldData.label}
                        />
                    );
                case 'sitecheckbox':
                    return (
                        <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.verticalAlignCenter}`}>
                            <CommonCheckBox
                                checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                                onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)}
                            />
                            <div>
                                <div className={style.siteDisplaySiteTextStyle}>Cambridge Memorial Hospital </div>
                                <div className={style.siteDisplayDepartmentTextStyle}>Department of Surgery (Cardiothoracic Surgery)</div>
                            </div>
                        </div>
                    );
                case 'addMoreFileupload':
                    console.log(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`))
                    return (
                        <div className={style.addMoreUpload}>
                            <div>
                                <label for={`file-upload-dynamic-${fieldKey}`} className={`${style.displayInRow} ${style.cursorPointer} `}>
                                    {getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) !== undefined && (
                                        <div className={style.checkedCircleIcon}>
                                            <CheckIcon sx={{ color: '#fff', fontSize: '17px' }} />
                                        </div>
                                    )}
                                    <DescriptionOutlinedIcon sx={{ color: '#787f87', fontSize: '30px' }} />
                                </label>
                            </div>
                            <input id={`file-upload-dynamic-${fieldKey}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleChange(fieldKey, e.target.files[0], baseKey) }} />
                        </div>
                    );
                case 'fileupload':
                    return (
                        <div>
                            <div className={`${style.uploadButton} ${style.uploadGrid} ${style.verticalAlignCenter}`}>
                                <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />
                                <label for={`file-upload-dynamic-${fieldKey}`} className={`${style.uploadText} ${style.cursorPointer}`}>
                                    {fieldData.label}
                                </label>
                            </div>
                            <input id={`file-upload-dynamic-${fieldKey}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleChange(fieldKey, e.target.files[0], baseKey) }} />
                        </div>
                    );
                case 'bulkFileupload':
                    return (
                        <CommonDropZone title={fieldData.label} description={fieldData.description} changeHandler={(acceptedFiles) => { handleChange(fieldKey, acceptedFiles, baseKey) }} />
                    );
                default:
                    return <div key={fieldKey}>{fieldData}</div>;
            }
        }
    };

    const renderObjectFields = (object, properties) => {
        if (properties) {
            console.log('entered', properties)
            return Object.entries(properties).map(([key, data]) => {
                if (data.type === 'object' && data.properties && data.fieldType === null) {
                    console.log('entered', data?.properties)
                    // console.log(getValueByPath(basicForm, `${baseKey}.${Object.entries(object?.if?.properties)?.map(([key, data]) => key)}`), 'value if', Object.entries(object?.if?.properties)?.map(([key, data]) => data)[0]?.const)
                    if (object?.if === null) {
                        console.log('entered', data?.properties)
                        return Object.entries(data.properties).map(([innerKey, innerData]) => {
                            if (innerData.type === 'object' && innerData.properties && innerData.fieldType === null) {
                                console.log('entered', innerData)
                                return Object.entries(innerData.properties).map(([innerKey2, innerData2]) => {
                                    return renderField(innerKey2, innerData2, `${baseKey}.${key}.${innerKey}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                                });
                            } else if (innerData.type === 'array' && innerData.items?.properties && innerData.fieldType === null) {
                                console.log('entered', innerData)
                                return Object.entries(innerData.items.properties).map(([innerKey2, innerData2]) => {
                                    return renderField(innerKey2, innerData2, `${baseKey}.${key}.${innerKey}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                                });
                            } else if (innerData.type === 'object' && innerData.properties && innerData.fieldType !== null) {
                                return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                            } else {
                                return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                            }
                            // return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                        });
                    }
                    else if (object?.if !== null && getValueByPath(basicForm, `${baseKey}.${Object.entries(object?.if?.properties)?.map(([key, data]) => key)}`) === Object.entries(object?.if?.properties)?.map(([key, data]) => data)[0]?.const) {
                        console.log(getValueByPath(basicForm, `${baseKey}.${Object.entries(object?.if?.properties)?.map(([key, data]) => key)}`), 'value if', Object.entries(object?.if?.properties)?.map(([key, data]) => data)[0]?.const, 'data', data)
                        return Object.entries(data.properties).map(([innerKey, innerData]) => {
                            console.log(innerData)
                            if (innerData.type === 'object' && innerData.properties && innerData.fieldType === null) {
                                console.log('entered', innerData)
                                return Object.entries(innerData.properties).map(([innerKey2, innerData2]) => {
                                    return renderField(innerKey2, innerData2, `${baseKey}.${key}.${innerKey}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                                });
                            } else if (innerData.type === 'array' && innerData.items?.properties) {
                                console.log('entered', innerData)
                                return Object.entries(innerData.items.properties).map(([innerKey2, innerData2]) => {
                                    return renderField(innerKey2, innerData2, `${baseKey}.${key}.${innerKey}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                                });
                            } else {
                                return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                            }
                        });
                    }
                    else {
                        console.log('entered', data)
                        return Object.keys(data.properties)?.filter(data => data !== data?.then?.required).map(([innerKey, innerData]) => {
                            return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                        });
                    }
                } else if (data.type === 'array' && data.items?.properties && data.fieldType === null) {
                    return Object.entries(data.items.properties).map(([innerKey, innerData]) => {
                        return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                    });
                } else if (data.type === 'object' && data.properties && data.fieldType !== null) {
                    return renderField(key, data, baseKey, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                } else {
                    return renderField(key, data, baseKey, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                }
            });
        }
        return null;
    };



    // const renderObjectFields = (object, properties) => {
    //     const renderFields = (data, path, parentObject) => {
    //         if (data.type === 'object' && data.properties && data.fieldType === null) {
    //             // Check for conditions
    //             console.log('entered', data, path)
    //             if (data.if && getValueByPath(basicForm, `${path}.${Object.keys(parentObject.if.properties)[0]}`) !== parentObject.if.properties[Object.keys(parentObject.if.properties)[0]].const) {
    //                 console.log('entered', data, path, getValueByPath(basicForm, `${path}.${Object.keys(parentObject.if.properties)[0]}`), parentObject.if.properties[Object.keys(parentObject.if.properties)[0]].const)
    //                 return null;
    //             } else {
    //                 console.log('entered', data, path)
    //                 return Object.entries(data.properties).map(([key, value]) => renderFields(value, `${path}.${key}`, data));
    //             }
    //         } else if (data.type === 'array' && data.items?.properties) {
    //             console.log('entered', data, path)
    //             return Object.entries(data.items.properties).map(([key, value]) => renderFields(value, `${path}.${key}`, data));
    //         } else if (data.type === 'object' && data.properties && data.fieldType !== null) {
    //             return renderField(path.split('.').pop(), data, path, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
    //         } else {
    //             console.log('entered', data, path, path.split('.').pop())
    //             return renderField(path.split('.').pop(), data, path, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
    //         }
    //     };
    //     return properties ? Object.entries(properties).map(([key, data]) => renderFields(data, `${baseKey}.${key}`, object)) : null;
    // };


    // const getValueByPath = (obj, path) => {
    //     console.log(path, path.split('.').reduce((acc, part) => acc && acc[part], basicForm), basicForm)
    //     return path.split('.').reduce((acc, part) => acc && acc[part], basicForm);
    // };

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm)
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    const handleAddMore = () => {
        let index = basicForm?.forms?.findIndex(data => data?.id === formId);
        let temp = basicForm;
        if (!isTableEdit) {
            if (temp.forms[index].data === null) {
                temp.forms[index].data = {};
                temp.forms[index].data[baseKey] = [basicForm[baseKey]];
            } else if (temp.forms[index].data[baseKey] === undefined) {
                temp.forms[index].data[baseKey] = [];
                temp.forms[index].data[baseKey].push(basicForm[baseKey])
            } else {
                temp.forms[index].data[baseKey].push(basicForm[baseKey])
            }
        }
        delete basicForm[baseKey];
        delete basicForm.undefined;
        setBasicForm(temp);
        getIsSubmitClicked(true, temp);
        console.log(basicForm?.forms?.filter(data => data?.id === formId), basicForm[baseKey], 'addMore', index, basicForm, basicForm.baseKey)
    }

    const getApplicantValues = (array) => {
        let temp = [];
        if (object?.tableHeaders !== null && basicForm?.forms?.filter(data => data?.id === formId)[0]?.data !== null) {
            Object.keys(object?.tableHeaders)?.map((data, index) => {
                if (data !== "file") {
                    temp.push({ "type": "text", "value": array?.map(innerData => innerData[data]) });
                } else {
                    temp.push({ "type": "icon", "icon": array?.map(innerData => <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} onClick={() => { window.open(innerData?.file?.fileURL, '_blank'); }} />), 'isShowHoverText': false });
                }
                if (index === Object.keys(object?.tableHeaders)?.length - 1) {
                    temp.push({ "type": "action", "value": array?.map(innerData => actions) })
                }
            })
        }
        console.log(temp, array)
        return temp;
    }

    const handleEdit = (data) => {
        setIsTableEdit(true);
        console.log(stepPath, basicForm)
        setIsAddMore(true);
        setBasicForm(prevData => {
            const temp = { ...prevData };
            temp[stepPath] = {};
            temp[stepPath][baseKey] = data;
            return temp;
        });
    }

    const handleDelete = (data) => {
        let index = basicForm?.forms?.findIndex(data => data?.id === formId);
        console.log(stepPath, basicForm)
        let temp = basicForm;
        temp.forms[index].data[baseKey] = temp.forms[index].data[baseKey].filter(obj => !isEqual(obj, data))
        console.log(temp)
        getIsSubmitClicked(true, temp);
    }

    const isEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const actions = [
        { 'data': 'Edit', 'requiredValue': 'boolean', "onClick": handleEdit },
        { 'data': 'Delete', 'requiredValue': 'boolean', "onClick": handleDelete },
    ]

    // console.log(object, Object.entries(object?.properties)?.map(([data, details]) => data), Object.entries(object?.properties)?.map(([data, details]) => details?.properties !== null && details?.properties !== undefined && Object.entries(details?.properties)?.map(([innerKey, innerData]) => innerData?.label)),
    //     getValueByPath(basicForm, `${'applicant'}.${"name"}.${'firstName'}`))
    console.log(basicForm, object)
    return (
        <div className={`${window.location.pathname.includes('applicationForm') ? '' : style.backgroundCard} ${style.marginTop}`}>
            <div className={style.cardTitle}>{object?.label}</div>
            {object?.description !== null && (
                <div className={style.addMoreDescriptionText}>{object?.description}</div>
            )}
            {(addMoreType && !collapsableQuestionCard) ? (
                <div>
                    <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                        {isAddMore ? (
                            <div className={style.padding20}>
                                <div className={style.addMoreText}>{object?.items?.label}</div>
                                <div className={`${gridStyle} ${style.marginTop}`}>
                                    {object?.type === "object" ? renderObjectFields(object, object?.properties) : object?.type === "array" ? renderObjectFields(object, object?.items?.properties) : renderObjectFields(object, object?.properties)}
                                </div>
                                <div className={`${style.displayInRowRev} ${style.marginTop}`}>
                                    <div className={style.marginLeft}>
                                        <div className={`${style.addMoreButton}`} onClick={() => { setIsAddMore(false); handleAddMore() }}>SAVE & CLOSE</div>
                                    </div>
                                    <div>
                                        <div className={`${style.addMoreButtonOutlined}`} onClick={() => { handleAddMore() }}>SAVE & ADD MORE</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.padding10}`}>
                                <div className={style.addMoreText}>{object?.items?.label}</div>
                                <div className={`${style.addMoreButton} ${style.marginLeft}`} onClick={() => setIsAddMore(true)}>ADD</div>
                            </div>
                        )}
                    </div>
                    {object?.tableHeaders !== null && basicForm?.forms?.filter(data => data?.id === formId)[0]?.data !== null && (
                        <TableTwo
                            tableHeaderValues={Object.values(object?.tableHeaders)}
                            tableDataValues={getApplicantValues(basicForm?.forms?.filter(data => data?.id === formId)[0]?.data[baseKey])}
                            tableData={basicForm?.forms?.filter(data => data?.id === formId)[0]?.data[baseKey]}
                            gridStyle={tableGrid}
                            actions={actions}
                            scrollStyle={style.contractScrollStyle}
                            tableSortValues={[]}
                            heading={'There are no Record for you to manage'}
                            onClickFunction={() => { }}
                        />
                    )}
                </div>
            ) : (!addMoreType && collapsableQuestionCard) ? (
                <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                    <div className={style.padding20}>
                        <div className={style.spaceBetween}>
                            <div className={style.collapsableCardText}>{Object.entries(object?.properties)?.map(([key, data]) => data)[0]?.label}</div>
                            {isCollapsableCard ? (
                                <div onClick={() => setIsCollapsableCard(false)}>
                                    <KeyboardArrowUpIcon sx={{ color: '#c4bef3' }} />
                                </div>
                            ) : (
                                <div onClick={() => setIsCollapsableCard(true)}>
                                    <KeyboardArrowDownIcon sx={{ color: '#c4bef3' }} />
                                </div>
                            )}
                        </div>
                        {isCollapsableCard && (
                            <>
                                <CommonDivider />
                                <div className={`${gridStyle} ${style.marginTop}`}>
                                    {object?.type === "object" ? renderObjectFields(object, object?.properties) : object?.type === "array" ? renderObjectFields(object, object?.items?.properties) : renderObjectFields(object, object?.properties)}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className={`${gridStyle} ${object?.label !== null ? style.marginTop : ''}`}>
                    {object?.type === "object" ? renderObjectFields(object, object?.properties) : object?.type === "array" ? renderObjectFields(object, object?.items?.properties) : renderObjectFields(object, object?.properties)}
                </div>
            )}
            {showAdd && (
                <div className={`${style.spaceBetween} ${style.marginTop}`}>
                    <div></div>
                    <div className={`${style.addButton}`}>ADD</div>
                </div>
            )}
        </div>
    )
}

export default ApplicationFieldCard;