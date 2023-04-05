import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, EditableText, Checkbox } from '@blueprintjs/core';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { format } from 'date-fns';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import InputAdornment from '@mui/material/InputAdornment';

import style from './index.module.scss';

const AddScheduleAndTargetForDifferentPeriods = ({ getAddScheduleAndTargetForDifferentPeriods, initialValue, onNewClinicChange, selectedScheduleRow, metadata, contractTermPeriod }) => {
    const [serviceSchedule, setServiceSchedule] = useState();
    console.log('metadata', metadata);
    useEffect(() => {
        if (selectedScheduleRow < metadata?.contractedSchedules?.length) {
            let contractedTemp = metadata?.contractedSchedules;
            let patientTemp = metadata?.patientsSeenTargets;
            let scheduledPatientsTemp = metadata?.scheduledPatientsTargets;
            setServiceSchedule({
                startDate: new Date(contractedTemp?.startDate), endDate: new Date(contractedTemp?.endDate), min: contractedTemp?.minimum?.value, max: contractedTemp?.maximum?.value, frequency: contractedTemp?.frequency, seenWithNurse: patientTemp?.withNurse?.value, seenWithoutNurse: patientTemp?.withtoutNurse?.value, seenNoTarget: patientTemp?.noTargetApplicable, targetWithNurse: scheduledPatientsTemp?.withNurse?.value, targetWithoutNurse: scheduledPatientsTemp?.withoutNurse, targetNoTarget: scheduledPatientsTemp?.noTargetApplicable
            }
            )
        } else {
            setServiceSchedule({ startDate: new Date(), endDate: new Date(), min: 0, max: 0, frequency: 'WEEK', seenWithNurse: 0, seenWithoutNurse: 0, seenNoTarget: false, targetWithNurse: 0, targetWithoutNurse: 0, targetNoTarget: false })
        }
    }, [metadata])

    console.log('service Schedule', serviceSchedule);

    const onScheduleChange = (name, value) => {
        setServiceSchedule({ ...serviceSchedule, [name]: value });
    }

    return (
        <div>
            <Dialog isOpen={getAddScheduleAndTargetForDifferentPeriods} onClose={() => { getAddScheduleAndTargetForDifferentPeriods(false) }} className={`${style.ScheduleDialog} ${style.addManagerDialogBackground}`}>
                <div className={`${Classes.DIALOG_BODY} `}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Add Schedules & Target For Different Periods</p>
                        <div className={style.displayInRow}>
                            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => { getAddScheduleAndTargetForDifferentPeriods(false) }} />
                        </div>
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={style.proofBorder}>
                        <>
                            <div className={`${style.addManagerGrid}`}>
                                <div className={style.extentionLableStyle}>Applicable Period*</div>
                                <div className={style.termPeriodWithAddGrid}>
                                    <div>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                InputProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        height: 30,
                                                    },
                                                }}
                                                renderInput={(params) => <TextField {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        placeholder: "Start Date"
                                                    }} />}
                                                value={serviceSchedule?.startDate}
                                                minDate={new Date(contractTermPeriod?.start)}
                                                maxDate={new Date(contractTermPeriod?.end)}
                                                onChange={(newValue) => {
                                                    onScheduleChange('startDate', new Date(newValue));
                                                }}

                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <p className={`${style.toStyle} ${style.alignCenter}`}>To</p>
                                    <div >
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                InputProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        height: 30,
                                                    },
                                                }}
                                                renderInput={(params) => <TextField  {...params}
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        placeholder: "End Date"
                                                    }} />}
                                                value={serviceSchedule?.endDate}
                                                minDate={new Date(contractTermPeriod?.start)}
                                                maxDate={new Date(contractTermPeriod?.end)}
                                                onChange={(newValue) => {
                                                    onScheduleChange('endDate', new Date(newValue));
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Regular Clinic Schedule*</div>
                                <div className={style.displayInRow}>
                                    {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                        <div className={style.textElement}>MIN</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={serviceSchedule?.min?.toString()} onChange={(e) => onScheduleChange('min', e)} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                        <div className={style.textElement}>MAX</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={serviceSchedule?.max?.toString()} onChange={(e) => onScheduleChange('max', e)} />
                                    </div> */}
                                    <CommonTextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10, backgroundColor: '#f1f2f3', color: '#fff', height: '35px' }} className={style.textElement}>MIN</InputAdornment>,
                                        }}
                                        className={style.threeFieldWidth}
                                        onChange={(e) => onScheduleChange('min', parseFloat(e.target.value.slice(0, 5)))}
                                        value={serviceSchedule?.min === 0 ? '' : serviceSchedule?.min}
                                        type='number'
                                    />
                                    <CommonTextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10, backgroundColor: '#f1f2f3', color: '#fff', height: '35px' }} className={style.textElement}>MAX</InputAdornment>,
                                        }}
                                        className={style.threeFieldWidth}
                                        onChange={(e) => onScheduleChange('max', parseFloat(e.target.value.slice(0, 5)))}
                                        value={(serviceSchedule?.max === 0 || serviceSchedule?.max === 99999999) ? '' : serviceSchedule?.max}
                                        type='number'
                                    />
                                    <Select
                                        displayEmpty
                                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                        className={`${style.fullWidth} ${style.marginLeft20}`}
                                        value={serviceSchedule?.frequency} onChange={(e) => onScheduleChange('frequency', e.target.value)}
                                    >
                                        <MenuItem value={''}>Select Frequency</MenuItem>
                                        <MenuItem value={'WEEK'} >Per Week</MenuItem>
                                        <MenuItem value={'MONTH'} >Per Month</MenuItem>
                                    </Select>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Patients Seen Target*</div>
                                <div className={style.withNurseGrid}>
                                    {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITH NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={serviceSchedule?.seenWithNurse} onChange={(e) => onScheduleChange('seenWithNurse', e)} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITHOUT NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={serviceSchedule?.seenWithoutNurse} onChange={(e) => onScheduleChange('seenWithoutNurse', e)} />
                                    </div> */}
                                    <CommonTextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10, backgroundColor: '#f1f2f3', color: '#fff', height: '35px' }} className={style.textElement}>WITH NURSE</InputAdornment>,
                                        }}
                                        className={style.threeFieldWidth}
                                        onChange={(e) => onScheduleChange('seenWithNurse', e.target.value.slice(0, 5))}
                                        value={serviceSchedule?.seenWithNurse === 0 ? '' : serviceSchedule?.seenWithNurse}
                                        type='number'
                                        disabled={serviceSchedule?.seenNoTarget}
                                    />
                                    <CommonTextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10, backgroundColor: '#f1f2f3', color: '#fff', height: '35px' }} className={style.textElement}>WITHOUT NURSE</InputAdornment>,
                                        }}
                                        className={style.threeFieldWidth}
                                        onChange={(e) => onScheduleChange('seenWithoutNurse', e.target.value.slice(0, 5))}
                                        value={serviceSchedule?.seenWithoutNurse === 0 ? '' : serviceSchedule?.seenWithoutNurse}
                                        type='number'
                                        disabled={serviceSchedule?.seenNoTarget}
                                    />
                                    <Checkbox label="No Target Applicable" className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} value={serviceSchedule?.seenNoTarget} onChange={(e) => onScheduleChange('seenNoTarget', e.target.checked)} />
                                </div>
                            </div>

                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Scheduled Patient Target*</div>
                                <div className={`${style.withNurseGrid} ${style.fullWidth}`}>
                                    {/* <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITH NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={serviceSchedule?.targetWithNurse} onChange={(e) => onScheduleChange('targetWithNurse', e)} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITHOUT NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={serviceSchedule?.targetWithoutNurse} onChange={(e) => onScheduleChange('targetWithoutNurse', e)} />
                                    </div> */}
                                    <CommonTextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10, backgroundColor: '#f1f2f3', color: '#fff', height: '35px' }} className={style.textElement}>WITHOUT NURSE</InputAdornment>,
                                        }}
                                        className={style.threeFieldWidth}
                                        onChange={(e) => onScheduleChange('targetWithNurse', e.target.value.slice(0, 5))}
                                        value={serviceSchedule?.targetWithNurse === 0 ? '' : serviceSchedule?.targetWithNurse}
                                        type='number'
                                        disabled={serviceSchedule?.targetNoTarget}
                                    />
                                    <CommonTextField
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10, backgroundColor: '#f1f2f3', color: '#fff', height: '35px' }} className={style.textElement}>WITHOUT NURSE</InputAdornment>,
                                        }}
                                        className={style.threeFieldWidth}
                                        onChange={(e) => onScheduleChange('targetWithoutNurse', e.target.value.slice(0, 5))}
                                        value={serviceSchedule?.targetWithoutNurse === 0 ? '' : serviceSchedule?.targetWithoutNurse}
                                        type='number'
                                        disabled={serviceSchedule?.targetNoTarget}
                                    />
                                    <Checkbox label="No Target Applicable" className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} value={serviceSchedule?.targetNoTarget} onChange={(e) => onScheduleChange('targetNoTarget', e.target.checked)} />
                                </div>
                            </div>
                        </>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} `}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20} `} >ADD MORE</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20} `} onClick={() => onNewClinicChange(serviceSchedule, selectedScheduleRow)}>SAVE & EXIT</button>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default AddScheduleAndTargetForDifferentPeriods;
