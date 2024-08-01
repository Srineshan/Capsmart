import React, { useEffect, useState } from 'react';
import CommonPhoneField from '../../Components/CommonFields/CommonPhoneField';
import CommonInputField from '../CommonFields/CommonInputField';
import CommonSelectField from '../CommonFields/CommonSelectField';
import CommonDateField from '../CommonFields/CommonDateField';
import { TextField } from '@mui/material';
import { add, format, sub } from 'date-fns';
import { FormatPhoneNumber } from '../../utils/formatting';
import CommonRadio from '../CommonFields/CommonRadio';
import CommonSwitch from '../CommonFields/CommonSwitch';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckIcon from '@mui/icons-material/Check';
import style from './index.module.scss';
import CommonCheckBox from '../CommonFields/CommonCheckBox';

const TEXTFIELDLEN50 = 50;

const ApplicationFieldCard = ({ object, gridStyle, baseKey, basicForm, setBasicForm, showAdd, addMoreType }) => {
    const [calendarStart, setCalendarStart] = useState(false);
    const [isAddMore, setIsAddMore] = useState(false);
    const basicpath = 'basicDetails'

    useEffect(() => {
        renderObjectFields(object)
    }, [basicForm]);

    const setNestedValue = (obj, path, value) => {
        console.log(obj, path, value, 'Test')
        const keys = path.split('.');
        let current = obj;
        console.log(current)
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
    };

    console.log(basicForm, 'Test')

    const handleChange = (path, value, basePath, basePath2, basePath3) => {
        console.log(path, value, basePath, baseKey, 'Check')
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
                    return (
                        <CommonSelectField
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)}
                            onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                            className={style.fullWidth}
                            firstOptionLabel={fieldData.label}
                            firstOptionValue={fieldData.label}
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
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)}
                            className={style.fullWidth}
                            onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                            maxLength={TEXTFIELDLEN50}
                            placeholder={fieldData.label}
                            label={fieldData.label}
                            required={fieldData.required?.includes(fieldKey)}
                        />
                    );
                case 'cellNumber':
                    return (
                        <CommonPhoneField
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)}
                            className={style.fullWidth}
                            onChange={(e) => handleChange(fieldKey, FormatPhoneNumber(e.target.value), baseKey)}
                            placeholder={fieldData.label}
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
                            minDate={sub(new Date(), { years: 3 })}
                            maxDate={add(new Date(), { months: 6 })}
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)}
                            onChange={(newValue) => handleChange(fieldKey, format(new Date(newValue), 'yyyy-MM-dd'), baseKey)}
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
                        <CommonRadio
                            className={style.leftAlign}
                            value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)}
                            onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                            radioValue={fieldData.enum}
                            label={fieldData.enum}
                        />
                    );
                case 'switchbutton':
                    return (
                        <CommonSwitch label={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === true ? 'YES' : 'NO'} checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)} onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} labelName={fieldData.label} />
                    );
                case 'checkbox':
                    return (
                        <CommonCheckBox
                            checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)}
                            onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} label={fieldData.label}
                        />
                    );
                case 'sitecheckbox':
                    return (
                        <div className={`${style.siteDisplayCard} ${style.siteDisplayGrid} ${style.verticalAlignCenter}`}>
                            <CommonCheckBox
                                checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`)}
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
                                <label for={`file-upload-dynamic-${fieldKey}`} className={`${style.uploadText} `}>
                                    {fieldData.label}
                                </label>
                            </div>
                            <input id={`file-upload-dynamic-${fieldKey}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleChange(fieldKey, e.target.files[0], baseKey) }} />
                        </div>
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
                        return Object.entries(data.properties).map(([innerKey, innerData]) => {
                            return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                        });
                    }
                    else if (object?.if !== null && getValueByPath(basicForm, `${baseKey}.${Object.entries(object?.if?.properties)?.map(([key, data]) => key)}`) === Object.entries(object?.if?.properties)?.map(([key, data]) => data)[0]?.const) {
                        console.log(getValueByPath(basicForm, `${baseKey}.${Object.entries(object?.if?.properties)?.map(([key, data]) => key)}`), 'value if', Object.entries(object?.if?.properties)?.map(([key, data]) => data)[0]?.const, 'data', data)
                        return Object.entries(data.properties).map(([innerKey, innerData]) => {
                            console.log(innerData)
                            if (innerData.type === 'object') {
                                console.log('entered', innerData)
                                return Object.entries(innerData.properties).map(([innerKey2, innerData2]) => {
                                    return renderField(innerKey2, innerData2, `${baseKey}.${key}.${innerKey}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                                });
                            } else if (innerData.type === 'array') {
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
                } else if (data.type === 'array' && data.items?.properties) {
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


    const getValueByPath = (obj, path) => {
        console.log(path, path.split('.').reduce((acc, part) => acc && acc[part], basicForm))
        return path.split('.').reduce((acc, part) => acc && acc[part], basicForm);
    };

    // console.log(object, Object.entries(object?.properties)?.map(([data, details]) => data), Object.entries(object?.properties)?.map(([data, details]) => details?.properties !== null && details?.properties !== undefined && Object.entries(details?.properties)?.map(([innerKey, innerData]) => innerData?.label)),
    //     getValueByPath(basicForm, `${'applicant'}.${"name"}.${'firstName'}`))
    console.log(basicForm, object)
    return (
        <div className={`${window.location.pathname.includes('applicationForm') ? '' : style.backgroundCard} ${style.marginTop}`}>
            <div className={style.cardTitle}>{object?.label}</div>
            {addMoreType ? (
                <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                    {isAddMore ? (
                        <div className={style.padding20}>
                            <div className={style.addMoreText}>{object?.items?.label}</div>
                            <div className={`${gridStyle} ${style.marginTop}`}>
                                {object?.type === "object" ? renderObjectFields(object, object?.properties) : object?.type === "array" ? renderObjectFields(object, object?.items?.properties) : renderObjectFields(object, object?.properties)}
                            </div>
                            <div className={`${style.displayInRowRev} ${style.marginTop}`}>
                                <div className={style.marginLeft}>
                                    <div className={`${style.addMoreButton}`} onClick={() => setIsAddMore(false)}>SAVE & CLOSE</div>
                                </div>
                                <div>
                                    <div className={`${style.addMoreButtonOutlined}`} onClick={() => setIsAddMore(true)}>SAVE & ADD MORE</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.padding10}`}>
                            <div className={style.addMoreText}>{object?.items?.label}</div>
                            <div className={`${style.addMoreButton}`} onClick={() => setIsAddMore(true)}>ADD MORE</div>
                        </div>
                    )}
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