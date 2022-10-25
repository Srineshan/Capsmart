import React, { useState } from 'react';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';

const SupplementalFields = () => {

    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);
    const [isDedicatedHours, setIsDedicatedHours] = useState(false);

    const limit5 = 5;

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Dedicated Hours For Supplemental Services*</div>
                <div className={`${style.displayInRow} `}>
                    <FormControlLabel
                        control={
                            <Switch className={`${style.textAlignLeft}`} checked={isDedicatedHours} onChange={(e) => setIsDedicatedHours(e.target.checked)}  />
                        }
                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                        label={isDedicatedHours ? 'YES' : 'NO'}
                    />
                    {!isDedicatedHours && (
                        <Select
                            displayEmpty
                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                            className={`${style.fullWidth}`}
                        >
                            <MenuItem value="">Select Dedicated Hours</MenuItem>
                            <MenuItem value="Clinic Block (Fracture, Orthopaedic clinic)">Clinic Block (Fracture, Orthopaedic clinic)</MenuItem>
                            <MenuItem value="Clinic Block (Fracture,)">Clinic Block (Fracture,)</MenuItem>
                            <MenuItem value="On Cal Duty Days( On Call Service)">On Cal Duty Days( On Call Service)</MenuItem>
                            <MenuItem value="Surgery Session(Orthopaedic Session)">Surgery Session(Orthopaedic Session)</MenuItem>
                        </Select>
                    )}
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Supplemental Clinical Services To Perform*</div>
                <div>
                    <div className={`${style.fullWidth} ${style.addGrid}`}>
                        <InputGroup className={style.fullWidth} placeholder="Add Supplemental Services specified in contract" />
                        <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                            <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                        </div>
                    </div>
                    <MultiSelectDisplay values={['Patient Consult', 'Clinical Administration', 'Patient Follow-Up', 'Special Clinic', 'On-Call Cross Coverage', 'Other Clinical Matters']} />
                </div>
            </div>
            {isDedicatedHours && (
                <>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Billable Service*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.threeFieldWidth}`} >
                                <FormControlLabel
                                    control={
                                        <Switch checked={additionalSchedule} className={` ${style.textAlignLeft} `} />
                                    }
                                    onChange={() => setAdditionalSchedule(!additionalSchedule)}
                                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                                    label={additionalSchedule ? 'YES' : 'NO'}
                                />
                            </div>
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
                        <div className={style.extentionLableStyle}>Separate Service Hours Specified*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.threeFieldWidth}`}>
                                <TextField
                                    size="small"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                    }}
                                />
                            </div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'MONTH'}>Per Month</MenuItem>
                                <MenuItem value={'YEAR'}>Per Contract Yer</MenuItem>
                            </Select>
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Supplemental Service Payment Amount*</div>
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
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>$ 50 per Hour (Pro Rata)</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Applicable Supplemental Workdays*</div>
                        <ServiceDays />
                    </div>
                </>
            )}
        </div>
    )
}

export default SupplementalFields;
