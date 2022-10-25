import React, { useState } from 'react';
import { InputGroup, EditableText, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const SurgerySessionFields = () => {

    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);

    const limit5 = 5;

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Regular Surgery Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText placeholder="" type='number' className={style.serviceProvidedEditableTextStyle} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText placeholder="" type='number' className={style.serviceProvidedEditableTextStyle} />
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.fullWidth} ${style.marginLeft20}`}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'}>Per Week</MenuItem>
                        <MenuItem value={'MONTH'}>Per Month</MenuItem>
                        <MenuItem value={'YEAR'}>Per Year</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Surgery Cases Target*</div>
                <div className={`${style.fullWidth}`}>
                    <InputGroup  className={` ${style.threeFieldWidth}`} />
                    <Checkbox label="No Target Applicable" className={`${style.marginLeft20} ${style.threeFieldWidth}`} />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <FormControlLabel
                            control={
                                <Switch checked={additionalSchedule} className={` ${style.textAlignLeft}`} />
                            }
                            onChange={() => setAdditionalSchedule(!additionalSchedule)}
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={additionalSchedule ? 'YES' : 'NO'}
                        />
                    </div>
                    <InputGroup value={additionalClinicSchedule} onChange={(e) => setAdditionalClinicSchedule(e.target.value)} className={` ${style.threeFieldWidth}`} />
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'}>Every Other Week</MenuItem>
                        <MenuItem value={'MONTH'}>Every Other Month</MenuItem>
                        <MenuItem value={'YEAR'}>Every Other Year</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Billable Service*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <FormControlLabel
                            control={
                                <Switch checked={additionalSchedule} className={` ${style.textAlignLeft}`} />
                            }
                            onChange={() => setAdditionalSchedule(!additionalSchedule)}
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={additionalSchedule ? 'YES' : 'NO'}
                        />
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.threeFieldWidth}`}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'}>Every Other Week</MenuItem>
                        <MenuItem value={'MONTH'}>Every Other Month</MenuItem>
                        <MenuItem value={'YEAR'}>Every Other Year</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Surgery Session Duration</div>
                <div className={`${style.threeFieldWidth}`}>
                    <TextField
                        size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                    />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Surgery Session payment Amount*</div>
                <div className={`${style.displayInRow}`}>
                    <div className={`${style.threeFieldWidth}`}>
                        <TextField
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                            }}
                        />
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>$ 300 per Hour (Pro Rata)</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Total Contracted Service Sessions*</div>
                <div className={style.twoCol}>
                    <div className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <EditableText value={totalContractedService} placeholder="" type='number' onChange={(e)=> setTotalContractedService(e.slice(0, limit5))} className={style.editableSessionTextStyle} />
                        <div className={`${style.textElement} ${style.greenBase} ${style.redBase}`}>60 Specified</div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle}`}>For 48 Weeks Per Contract Year</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Days*</div>
                <ServiceDays />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Working Day Hours For Surgery*</div>
                <div className={style.displayInRow}>
                    <InputGroup
                        value={workingPeriodFrom}
                        placeholder="HH:MM"
                        onChange={(e)=> setWorkingPeriodFrom(e.target.value) }
                        className={style.threeFieldWidth}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                    <InputGroup
                        value={workingPeriodTo}
                        placeholder="HH:MM"
                        onChange={(e)=> setWorkingPeriodTo(e.target.value) }
                        className={style.threeFieldWidth}
                    />
                </div>
            </div>
        </div>
    )
}

export default SurgerySessionFields;
