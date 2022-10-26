import React, { useState } from 'react';
import { InputGroup, EditableText, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const AdministrativeFields = () => {

    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);

    const limit5 = 5;

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Dedicated Hours For Administrative Services*</div>
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
                        className={`${style.fullWidth} ${style.marginLeft20}`}
                    >
                        <MenuItem value={'Clinic Block (Fracture, Orthopaedic clinic)'}>Clinic Block (Fracture, Orthopaedic clinic)</MenuItem>
                        <MenuItem value={'Clinic Block (Fracture,)'}>Clinic Block (Fracture,)</MenuItem>
                        <MenuItem value={'On Cal Duty Days( On Call Service)'}>On Cal Duty Days( On Call Service)</MenuItem>
                        <MenuItem value={'Surgery Session(Orthopaedic Session)'}>Surgery Session(Orthopaedic Session)</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Administrative Duties & Function To Perform</div>
                <div>
                    <div className={style.displayInRow}>
                        <FormGroup className={`${style.marginLeft10}`}>
                            <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">During Normal Working Hours</Typography>} />
                        </FormGroup>
                        <div className={style.redChip}>Monthly</div>
                        <div className={style.blueChip}>Billable</div>
                        <div className={style.greenChip}>POD</div>
                    </div>
                    <FormGroup className={`${style.marginLeft10}`}>
                        <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">After Working Hours</Typography>} />
                    </FormGroup>
                </div>
            </div>

            <div className={`${style.addonAddBox} ${style.marginTop20}`}>
                <div className={`${style.addManagerGrid}`}>
                    <div className={style.extentionLableStyle}>Additional Administrative Services Name</div>
                    <InputGroup placeholder='Add-On Service Name' className={style.fullWidth} />
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Classify As Billable Activity</div>
                    <div className={`${style.threeFieldWidth} `}>
                        <FormControlLabel
                            control={
                                <Switch className={`${style.textAlignLeft}`} />
                            }
                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                            label={'YES'}
                        />
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Proof Of Completion / Documentation Required</div>
                    <div className={style.twoCol}>
                        <div className={`${style.threeFieldWidth} `}>
                            <FormControlLabel
                                control={
                                    <Switch className={`${style.textAlignLeft}`} />
                                }
                                className={`${style.switchFontStyle} ${style.flexLeft} `}
                                label={'YES'}
                            />
                        </div>
                        <div>
                            <div className={style.extentionLableStyle}>Contracted Schedule*</div>
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
                </div>

                <div>
                    <div className={`${style.twoCol} ${style.marginTop20}`}>
                        <button className={`${style.outlinedButton} ${style.fullWidth}`} >CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.fullWidth}`} >SAVE</button>
                    </div>
                    <br />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Administrative Duties & Function To Perform</div>
                <div className={`${style.addGrid} ${style.fullWidth}`}>
                    <InputGroup className={style.fullWidth} />
                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                        <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Separate Administrative Hours Specified*</div>
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
                <div className={style.extentionLableStyle}>Service Days*</div>
                <ServiceDays />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Administrative Services Workdays*</div>
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

export default AdministrativeFields;
