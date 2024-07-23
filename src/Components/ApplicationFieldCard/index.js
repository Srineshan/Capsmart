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

import style from './index.module.scss';

const TEXTFIELDLEN50 = 50;

const ApplicationFieldCard = ({ object, gridStyle, baseKey, basicForm, setBasicForm, showAdd }) => {
    const [calendarStart, setCalendarStart] = useState(false);

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
            const basicpath = 'basicDetails'
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
        switch (fieldData.fieldType) {
            case 'dropdown':
                return (
                    <CommonSelectField
                        value={getValueByPath(basicForm, `${baseKey}.${fieldKey}`)}
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
                        value={getValueByPath(basicForm, `${baseKey}.${fieldKey}`)}
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
                        value={getValueByPath(basicForm, `${baseKey}.${fieldKey}`)}
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
                        value={getValueByPath(basicForm, `${baseKey}.${fieldKey}`)}
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
                        value={getValueByPath(basicForm, baseKey)}
                        onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                        radioValue={fieldData.enum}
                        label={fieldData.enum}
                    />
                );
            case 'switchbutton':
                return (
                    <CommonSwitch label={getValueByPath(basicForm, `${baseKey}.${fieldKey}`) === true ? 'YES' : 'NO'} checked={getValueByPath(basicForm, `${baseKey}.${fieldKey}`)} onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} labelName={fieldData.label} />
                );
            case 'checkbox':
                return (
                    <CommonSwitch label={getValueByPath(basicForm, `${baseKey}.${fieldKey}`) === true ? 'YES' : 'NO'} checked={getValueByPath(basicForm, `${baseKey}.${fieldKey}`)} onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} labelName={fieldData.label} />
                );
            default:
                return <div key={fieldKey}></div>;
        }
    };

    const renderObjectFields = (object) => {
        if (object?.properties) {
            return Object.entries(object.properties).map(([key, data]) => {
                if (data.type === 'object' && data.properties) {
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
                        return Object.keys(data.properties)?.filter(data => data !== data?.then?.required).map(([innerKey, innerData]) => {
                            return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                        });
                    }
                } else if (data.type === 'array' && data.items?.properties) {
                    return Object.entries(data.items.properties).map(([innerKey, innerData]) => {
                        return renderField(innerKey, innerData, `${baseKey}.${key}`, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                    });
                } else {
                    return renderField(key, data, baseKey, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
                }
            });
        }
        return null;
    };



    // const renderObjectFields = (object) => {
    //     const renderFields = (data, path, parentObject) => {
    //         if (data.type === 'object' && data.properties) {
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
    //         } else {
    //             console.log('entered', data, path, path.split('.').pop())
    //             return renderField(path.split('.').pop(), data, path, handleChange, getValueByPath, style, calendarStart, setCalendarStart);
    //         }
    //     };

    //     return object?.properties ? Object.entries(object.properties).map(([key, data]) => renderFields(data, `${baseKey}.${key}`, object)) : null;
    // };


    const getValueByPath = (obj, path) => {
        console.log(path, path.split('.').reduce((acc, part) => acc && acc[part], basicForm))
        return path.split('.').reduce((acc, part) => acc && acc[part], basicForm);
    };

    console.log(object, Object.entries(object?.properties)?.map(([data, details]) => data), Object.entries(object?.properties)?.map(([data, details]) => details?.properties !== null && details?.properties !== undefined && Object.entries(details?.properties)?.map(([innerKey, innerData]) => innerData?.label)),
        getValueByPath(basicForm, `${'applicant'}.${"name"}.${'firstName'}`))
    console.log(basicForm)
    return (
        <div className={`${style.backgroundCard} ${style.marginTop}`}>
            <div className={style.cardTitle}>{object?.label}</div>
            <div className={`${gridStyle} ${object?.label !== null ? style.marginTop : ''}`}>
                {/* {object?.properties !== undefined && object?.properties !== null && Object.entries(object?.properties)?.map(([key, data]) =>
                    data?.type === 'object' ?
                        data?.properties !== undefined && data?.properties !== null && Object.entries(data?.properties)?.map(([innerKey, innerData]) =>
                            // innerData?.type === 'string' ?
                            innerData?.fieldType !== null && innerData?.fieldType === 'dropdown' ? (
                                <CommonSelectField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    onChange={(e) => {
                                        handleChange(innerKey, e.target.value, key);
                                    }}
                                    className={`${style.fullWidth}`}
                                    firstOptionLabel={`${innerData?.label}`}
                                    firstOptionValue={`${innerData?.label}`}
                                    valueList={innerData?.enum}
                                    labelList={innerData?.enum}
                                    disabledList={innerData?.enum?.map(data => false)}
                                    label={innerData?.label}
                                    required={data?.required?.includes(innerKey)}
                                />
                            ) : innerData?.fieldType !== null && innerData?.fieldType === 'textbox' ? (
                                <CommonInputField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    className={style.fullWidth}
                                    onChange={(e) => {
                                        handleChange(innerKey, e.target.value, key);
                                    }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={innerData?.label}
                                    label={innerData?.label}
                                    required={data?.required?.includes(innerKey)}
                                />
                            ) : innerData?.fieldType !== null && innerData?.fieldType === 'cellNumber' ? (
                                <CommonPhoneField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    className={style.fullWidth}
                                    onChange={(e) => {
                                        handleChange(innerKey, FormatPhoneNumber(e.target.value), key);
                                    }}
                                    placeholder={innerData?.label}
                                    label={innerData?.label}
                                    required={data?.required?.includes(innerKey)}
                                />
                            ) : innerData?.fieldType !== null && innerData?.fieldType === 'datepicker' ? (
                                <CommonDateField
                                    className={style.fullWidth}
                                    open={calendarStart}
                                    onOpen={() => setCalendarStart(true)}
                                    onClose={() => setCalendarStart(false)}
                                    minDate={sub(new Date(), { years: 3 })}
                                    maxDate={add(new Date(), { months: 6 })}
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    onChange={(newValue) => handleChange(innerKey, newValue, key)}
                                    InputProps={{
                                        style: {
                                            fontSize: 14,
                                            height: 30,
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            // onClick={() => setCalendarStart(true)}
                                            inputProps={{
                                                ...params.inputProps,
                                                placeholder: `${innerData?.label}`,
                                            }}
                                            fullWidth
                                        />
                                    )}
                                    label={innerData?.label}
                                    required={innerData?.required?.includes(innerKey)}
                                />
                            ) : (
                                <div></div>
                            )
                            // : (
                            //     <div></div>
                            // )
                        )
                        : data?.type === 'string' ?
                            data?.fieldType !== null && data?.fieldType === 'dropdown' ? (
                                <CommonSelectField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                    onChange={(e) => {
                                        handleChange(key, e.target.value);
                                    }}
                                    className={`${style.fullWidth}`}
                                    firstOptionLabel={`${data?.label}`}
                                    firstOptionValue={`${data?.label}`}
                                    valueList={data?.enum}
                                    labelList={data?.enum}
                                    disabledList={data?.enum?.map(data => false)}
                                    label={data?.label}
                                    required={data?.required?.includes(key)}
                                />
                            ) : data?.fieldType !== null && data?.fieldType === 'textbox' ? (
                                <CommonInputField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                    className={style.fullWidth}
                                    onChange={(e) => {
                                        handleChange(key, e.target.value);
                                    }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={data?.label}
                                    label={data?.label}
                                    required={data?.required?.includes(key)}
                                />
                            ) : data?.fieldType !== null && data?.fieldType === 'cellNumber' ? (
                                <CommonPhoneField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                    className={style.fullWidth}
                                    onChange={(e) => {
                                        handleChange(key, FormatPhoneNumber(e.target.value));
                                    }}
                                    placeholder={data?.label}
                                    label={data?.label}
                                    required={data?.required?.includes(key)}
                                />
                            ) : data?.fieldType !== null && data?.fieldType === 'datepicker' ? (
                                <CommonDateField
                                    className={style.fullWidth}
                                    open={calendarStart}
                                    onOpen={() => setCalendarStart(true)}
                                    onClose={() => setCalendarStart(false)}
                                    minDate={sub(new Date(), { years: 3 })}
                                    maxDate={add(new Date(), { months: 6 })}
                                    // value={contractTermPeriodFrom}
                                    onChange={(newValue) => handleChange(key, newValue)}
                                    InputProps={{
                                        style: {
                                            fontSize: 14,
                                            height: 30,
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            // onClick={() => setCalendarStart(true)}
                                            inputProps={{
                                                ...params.inputProps,
                                                placeholder: `${data?.label}`,
                                            }}
                                            fullWidth
                                        />
                                    )}
                                    label={data?.label}
                                    required={data?.required?.includes(key)}
                                />
                            ) : (
                                <div></div>
                            )
                            : (
                                <></>
                            )
                )} */}
                {/* {object?.properties !== undefined && object?.properties !== null && Object.entries(object?.properties)?.map(([key, data]) =>
                    data?.type === 'object' ?
                        data?.properties !== undefined && data?.properties !== null && Object.entries(data?.properties)?.map(([innerKey, innerData]) =>
                            // innerData?.type === 'string' ?
                            innerData?.fieldType !== null && innerData?.fieldType === 'dropdown' ? (
                                <CommonSelectField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    onChange={(e) => {
                                        handleChange(innerKey, e.target.value, key);
                                    }}
                                    className={`${style.fullWidth}`}
                                    firstOptionLabel={`${innerData?.label}`}
                                    firstOptionValue={`${innerData?.label}`}
                                    valueList={innerData?.enum}
                                    labelList={innerData?.enum}
                                    disabledList={innerData?.enum?.map(data => false)}
                                    label={innerData?.label}
                                    required={data?.required?.includes(innerKey)}
                                />
                            ) : innerData?.fieldType !== null && innerData?.fieldType === 'textbox' ? (
                                <CommonInputField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    className={style.fullWidth}
                                    onChange={(e) => {
                                        handleChange(innerKey, e.target.value, key);
                                    }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={innerData?.label}
                                    label={innerData?.label}
                                    required={data?.required?.includes(innerKey)}
                                />
                            ) : innerData?.fieldType !== null && innerData?.fieldType === 'cellNumber' ? (
                                <CommonPhoneField
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    className={style.fullWidth}
                                    onChange={(e) => {
                                        handleChange(innerKey, FormatPhoneNumber(e.target.value), key);
                                    }}
                                    placeholder={innerData?.label}
                                    label={innerData?.label}
                                    required={data?.required?.includes(innerKey)}
                                />
                            ) : innerData?.fieldType !== null && innerData?.fieldType === 'datepicker' ? (
                                <CommonDateField
                                    className={style.fullWidth}
                                    open={calendarStart}
                                    onOpen={() => setCalendarStart(true)}
                                    onClose={() => setCalendarStart(false)}
                                    minDate={sub(new Date(), { years: 3 })}
                                    maxDate={add(new Date(), { months: 6 })}
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    onChange={(newValue) => handleChange(innerKey, newValue, key)}
                                    InputProps={{
                                        style: {
                                            fontSize: 14,
                                            height: 30,
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            // onClick={() => setCalendarStart(true)}
                                            inputProps={{
                                                ...params.inputProps,
                                                placeholder: `${innerData?.label}`,
                                            }}
                                            fullWidth
                                        />
                                    )}
                                    label={innerData?.label}
                                    required={innerData?.required?.includes(innerKey)}
                                />
                            ) : innerData?.fieldType !== null && innerData?.fieldType === 'radiobutton' ? (
                                <CommonRadio
                                    className={`${style.leftAlign}`}
                                    value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                    onChange={(e) => handleChange(innerKey, e.target.value, key)}
                                    radioValue={innerData?.enum}
                                    label={innerData?.enum}
                                />
                            ) : (
                                <div></div>
                            )
                            // : (
                            //     <div></div>
                            // )
                        ) : data?.type === 'array' ?
                            data?.items !== undefined && data?.items !== null && Object.entries(data?.items?.properties)?.map(([innerKey, innerData]) =>
                                // innerData?.type === 'string' ?
                                innerData?.fieldType !== null && innerData?.fieldType === 'dropdown' ? (
                                    <CommonSelectField
                                        value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                        onChange={(e) => {
                                            handleChange(innerKey, e.target.value, key);
                                        }}
                                        className={`${style.fullWidth}`}
                                        firstOptionLabel={`${innerData?.label}`}
                                        firstOptionValue={`${innerData?.label}`}
                                        valueList={innerData?.enum}
                                        labelList={innerData?.enum}
                                        disabledList={innerData?.enum?.map(data => false)}
                                        label={innerData?.label}
                                        required={data?.required?.includes(innerKey)}
                                    />
                                ) : innerData?.fieldType !== null && innerData?.fieldType === 'textbox' ? (
                                    <CommonInputField
                                        value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                        className={style.fullWidth}
                                        onChange={(e) => {
                                            handleChange(innerKey, e.target.value, key);
                                        }}
                                        maxLength={TEXTFIELDLEN50}
                                        placeholder={innerData?.label}
                                        label={innerData?.label}
                                        required={data?.required?.includes(innerKey)}
                                    />
                                ) : innerData?.fieldType !== null && innerData?.fieldType === 'cellNumber' ? (
                                    <CommonPhoneField
                                        value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                        className={style.fullWidth}
                                        onChange={(e) => {
                                            handleChange(innerKey, FormatPhoneNumber(e.target.value), key);
                                        }}
                                        placeholder={innerData?.label}
                                        label={innerData?.label}
                                        required={data?.required?.includes(innerKey)}
                                    />
                                ) : innerData?.fieldType !== null && innerData?.fieldType === 'datepicker' ? (
                                    <CommonDateField
                                        className={style.fullWidth}
                                        open={calendarStart}
                                        onOpen={() => setCalendarStart(true)}
                                        onClose={() => setCalendarStart(false)}
                                        minDate={sub(new Date(), { years: 3 })}
                                        maxDate={add(new Date(), { months: 6 })}
                                        value={getValueByPath(basicForm, `${baseKey}.${key}.${innerKey}`)}
                                        onChange={(newValue) => handleChange(innerKey, newValue, key)}
                                        InputProps={{
                                            style: {
                                                fontSize: 14,
                                                height: 30,
                                            },
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                // onClick={() => setCalendarStart(true)}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: `${innerData?.label}`,
                                                }}
                                                fullWidth
                                            />
                                        )}
                                        label={innerData?.label}
                                        required={innerData?.required?.includes(innerKey)}
                                    />
                                ) : (
                                    <div></div>
                                )
                                // : (
                                //     <div></div>
                                // )
                            )
                            : data?.type === 'string' ?
                                data?.fieldType !== null && data?.fieldType === 'dropdown' ? (
                                    <CommonSelectField
                                        value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                        onChange={(e) => {
                                            handleChange(key, e.target.value);
                                        }}
                                        className={`${style.fullWidth}`}
                                        firstOptionLabel={`${data?.label}`}
                                        firstOptionValue={`${data?.label}`}
                                        valueList={data?.enum}
                                        labelList={data?.enum}
                                        disabledList={data?.enum?.map(data => false)}
                                        label={data?.label}
                                        required={data?.required?.includes(key)}
                                    />
                                ) : data?.fieldType !== null && data?.fieldType === 'textbox' ? (
                                    <CommonInputField
                                        value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                        className={style.fullWidth}
                                        onChange={(e) => {
                                            handleChange(key, e.target.value);
                                        }}
                                        maxLength={TEXTFIELDLEN50}
                                        placeholder={data?.label}
                                        label={data?.label}
                                        required={data?.required?.includes(key)}
                                    />
                                ) : data?.fieldType !== null && data?.fieldType === 'cellNumber' ? (
                                    <CommonPhoneField
                                        value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                        className={style.fullWidth}
                                        onChange={(e) => {
                                            handleChange(key, FormatPhoneNumber(e.target.value));
                                        }}
                                        placeholder={data?.label}
                                        label={data?.label}
                                        required={data?.required?.includes(key)}
                                    />
                                ) : data?.fieldType !== null && data?.fieldType === 'datepicker' ? (
                                    <CommonDateField
                                        className={style.fullWidth}
                                        open={calendarStart}
                                        onOpen={() => setCalendarStart(true)}
                                        onClose={() => setCalendarStart(false)}
                                        minDate={sub(new Date(), { years: 3 })}
                                        maxDate={add(new Date(), { months: 6 })}
                                        value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                        onChange={(newValue) => handleChange(key, newValue)}
                                        InputProps={{
                                            style: {
                                                fontSize: 14,
                                                height: 30,
                                            },
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                // onClick={() => setCalendarStart(true)}
                                                inputProps={{
                                                    ...params.inputProps,
                                                    placeholder: `${data?.label}`,
                                                }}
                                                fullWidth
                                            />
                                        )}
                                        label={data?.label}
                                        required={data?.required?.includes(key)}
                                    />
                                ) : data?.fieldType !== null && data?.fieldType === 'radiobutton' ? (
                                    <CommonRadio
                                        className={`${style.leftAlign}`}
                                        value={getValueByPath(basicForm, `${baseKey}.${key}`)}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        radioValue={data?.enum}
                                        label={data?.enum}
                                    />
                                ) : (
                                    <div></div>
                                )
                                : (
                                    <></>
                                )
                )} */}
                {renderObjectFields(object)}
            </div>
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