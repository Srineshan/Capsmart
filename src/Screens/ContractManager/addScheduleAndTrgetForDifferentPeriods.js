import React from 'react';
import { Dialog, Classes, Icon, Intent, EditableText, Checkbox } from '@blueprintjs/core';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { format } from 'date-fns';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import style from './index.module.scss';

const AddScheduleAndTargetForDifferentPeriods = ({ getAddScheduleAndTargetForDifferentPeriods }) => {

    return (
        <div>
            <Dialog isOpen={getAddScheduleAndTargetForDifferentPeriods} onClose={() => { getAddScheduleAndTargetForDifferentPeriods(false) }} className={`${style.ScheduleDialog} ${style.addManagerDialogBackground}`}>
                <div className={`${Classes.DIALOG_BODY} `}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Add Schedules & Target For Different Periods</p>
                        <div className={style.displayInRow}>
                            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddScheduleAndTargetForDifferentPeriods(false)} />
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
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Regular Clinic Schedule*</div>
                                <div className={style.displayInRow}>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                        <div className={style.textElement}>MIN</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                        <div className={style.textElement}>MAX</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                                    </div>
                                    <Select
                                        displayEmpty
                                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                        className={`${style.fullWidth} ${style.marginLeft20}`}
                                    >
                                        <MenuItem value={''}>Select Frequecy</MenuItem>
                                        <MenuItem value={'WEEK'} >Per Week</MenuItem>
                                        <MenuItem value={'MONTH'} >Per Month</MenuItem>
                                    </Select>
                                </div>
                            </div>
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Patients Seen Target*</div>
                                <div className={style.withNurseGrid}>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITH NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITHOUT NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                                    </div>
                                    <Checkbox label="No Target Applicable" className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} />
                                </div>
                            </div>

                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Scheduled Patient Target*</div>
                                <div className={`${style.withNurseGrid} ${style.fullWidth}`}>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITH NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                                    </div>
                                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                        <div className={style.textElement}>WITHOUT NURSE</div>
                                        <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                                    </div>
                                    <Checkbox label="No Target Applicable" className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} />
                                </div>
                            </div>
                        </>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} `}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20} `} >ADD MORE</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20} `} >SAVE & EXIT</button>
                    </div>
                </div>
            </Dialog>

        </div>
    )
}

export default AddScheduleAndTargetForDifferentPeriods;
