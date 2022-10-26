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
import Popover from '@mui/material/Popover';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const AdministrativeFields = () => {

    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
                    <div className={`${style.displayInRow} ${style.marginBottom10}`}>
                        <FormGroup className={`${style.marginLeft10}`}>
                            <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Periodic Productivity Data Review (Monthly)</Typography>} />
                        </FormGroup>
                        <div className={`${style.chipStyle} ${style.redChip}`}>Monthly</div>
                        <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>
                        <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>
                    </div>
                    <div className={`${style.displayInRow} ${style.marginBottom10}`}>
                        <FormGroup className={`${style.marginLeft10}`}>
                            <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Credentials Committee Meeting</Typography>} />
                        </FormGroup>
                        <div className={`${style.chipStyle} ${style.redChip}`}>Monthly</div>
                        <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>
                        <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>
                    </div>
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
                    <div className={style.displayInRow}>
                        <div className={`${style.threeFieldWidth} `}>
                            <FormControlLabel
                                control={
                                    <Switch className={`${style.textAlignLeft}`} />
                                }
                                className={`${style.switchFontStyle} ${style.flexLeft} `}
                                label={'YES'}
                            />
                        </div>
                        <div className={style.threeFieldWidth}>
                            <div className={style.extentionLableStyle}>Contracted Schedule*</div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.fullWidth}`}
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
                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`} >
                        <AddIcon sx={{ fontSize: 25, color: 'white' }}  aria-describedby={id} onClick={(e) => handleClick(e)}/>
                    </div>
                </div>
                {/* <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    >
                    <div className={style.administrativePopoverStyle}>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">All Activities</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter} ${style.selectedAdministrativeCardStyle}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="#7165E3">Administrative & Business Reports Creation</Typography>} />
                            </FormGroup>
                            <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>
                            <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Administrative & Business Records Maintenance</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Credentials Committee Meeting</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter} ${style.selectedAdministrativeCardStyle}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="#7165E3">Corrective Action Plan Participation</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Contractor Clinic / OR Schedule Maintenance (Weekly)</Typography>} />
                            </FormGroup>
                        </div>
                    </div>
                </Popover> */}
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
