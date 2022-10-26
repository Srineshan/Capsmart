import React, { useState } from 'react';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DatalistInput from 'react-datalist-input';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Typography from '@mui/material/Typography'; 
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';

import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const AddonClinicFields = () => {

    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);

    const limit5 = 5;

    return (
        <div>
            <div className={style.marginTop20}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2">Clinic Block ( Fracture Clinic, Orthopaedic Clinic )</Typography>} />
                </FormGroup>
                <div className={`${style.addonBoxStyle}`}>
                    <div className={`${style.addManagerGrid}`}>
                        <div className={style.extentionLableStyle}>Only Allow Upon Request Approval</div>
                        <FormControlLabel
                            control={
                                <Switch className={`${style.textAlignLeft}`} />
                            }
                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                            label={'YES'}
                        />
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                        <div>
                            <div className={`${style.displayInRow} `}>
                                <FormControlLabel
                                    control={
                                        <Switch className={`${style.textAlignLeft}`} />
                                    }
                                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                                    label={'YES'}
                                />
                                <div className={`${style.addGrid} ${style.fullWidth}`}> 
                                    <DatalistInput items={[]} onSelect={() => {}} className={style.fullWidth} />
                                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                        <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                                    </div>
                                </div>
                            </div>
                            <MultiSelectDisplay values={['Location 1']} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.marginTop20}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2">Clinic Block ( Fracture Clinic )</Typography>} />
                </FormGroup>
                <div className={`${style.addonBoxStyle}`}>
                    <div className={`${style.addManagerGrid}`}>
                        <div className={style.extentionLableStyle}>Only Allow Upon Request Approval</div>
                        <FormControlLabel
                            control={
                                <Switch className={`${style.textAlignLeft}`} />
                            }
                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                            label={'YES'}
                        />
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                        <div>
                            <div className={`${style.displayInRow} `}>
                                <FormControlLabel
                                    control={
                                        <Switch className={`${style.textAlignLeft}`} />
                                    }
                                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                                    label={'YES'}
                                />
                                <div className={`${style.addGrid} ${style.fullWidth}`}> 
                                    <DatalistInput items={[]} onSelect={() => {}} className={style.fullWidth} />
                                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                        <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                                    </div>
                                </div>
                            </div>
                            <MultiSelectDisplay values={['Location 1']} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.marginTop20}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2">Surgery Session ( Orthopedic Surgery Session )</Typography>} />
                </FormGroup>
                <div className={`${style.addonBoxStyle}`}>
                    <div className={`${style.addManagerGrid}`}>
                        <div className={style.extentionLableStyle}>Only Allow Upon Request Approval</div>
                        <FormControlLabel
                            control={
                                <Switch className={`${style.textAlignLeft}`} />
                            }
                            className={`${style.switchFontStyle} ${style.flexLeft} `}
                            label={'YES'}
                        />
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                        <div>
                            <div className={`${style.displayInRow} `}>
                                <FormControlLabel
                                    control={
                                        <Switch className={`${style.textAlignLeft}`} />
                                    }
                                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                                    label={'YES'}
                                />
                                <div className={`${style.addGrid} ${style.fullWidth}`}> 
                                    <DatalistInput items={[]} onSelect={() => {}} className={style.fullWidth} />
                                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                        <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                                    </div>
                                </div>
                            </div>
                            <MultiSelectDisplay values={['Location 1']} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={style.marginTop20}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2">Individual Elective Surgery case</Typography>} />
                </FormGroup>
                <div className={`${style.addonBoxStyle}`}>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>ADD-ON Payment Rate*</div>
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <TextField
                                    size="small"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                    }}
                                />
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Per Hour</p>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Allowable Add-On Working Hours*</div>
                        <div className={style.twoCol}>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">During Normal Working Hours</Typography>} />
                            </FormGroup>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">After Working Hours</Typography>} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                        <div>
                            <div className={`${style.displayInRow} `}>
                                <FormControlLabel
                                    control={
                                        <Switch className={`${style.textAlignLeft}`} />
                                    }
                                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                                    label={'YES'}
                                />
                                <div className={`${style.addGrid} ${style.fullWidth}`}> 
                                    <DatalistInput items={[]} onSelect={() => {}} className={style.fullWidth} />
                                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                        <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                                    </div>
                                </div>
                            </div>
                            <MultiSelectDisplay values={['Location 1']} />
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Allowable Add-On Working Hours*</div>
                        <div>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Require patient data</Typography>} />
                            </FormGroup>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Prior Pre-Authorisation Required</Typography>} />
                            </FormGroup>
                            <FormGroup className={`${style.marginLeft10}`}>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Require Reason For Add-On Service</Typography>} />
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${style.marginTop20} ${style.addAddonGrid}`}>
                <InputGroup className={style.fullWidth} placeholder="Enter Add- On Service" />
                <div className={`${style.addAddonServiceButton} ${style.alignCenter}`}>ADD ADD-ON SERVICES</div>
            </div>

            <div className={`${style.addonAddBox} ${style.marginTop20}`}>
                <div className={`${style.addManagerGrid}`}>
                    <div className={style.extentionLableStyle}>Add-On Service Name*</div>
                    <InputGroup placeholder='Add-On Service Name' className={style.fullWidth} />
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>ADD-ON Payment Rate*</div>
                    <div className={`${style.displayInRow}`}>
                        <div className={`${style.threeFieldWidth}`}>
                            <TextField
                                size="small"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                }}
                            />
                        </div>
                        <div className={style.verticalAlignCenter}>
                            <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Per Hour</p>
                        </div>
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Allowable Add-On Working Hours*</div>
                    <div className={style.twoCol}>
                        <FormGroup className={`${style.marginLeft10}`}>
                            <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">During Normal Working Hours</Typography>} />
                        </FormGroup>
                        <FormGroup className={`${style.marginLeft10}`}>
                            <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">After Working Hours</Typography>} />
                        </FormGroup>
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Specify Service Facility / Location</div>
                    <div>
                        <div className={`${style.displayInRow} `}>
                            <FormControlLabel
                                control={
                                    <Switch className={`${style.textAlignLeft}`} />
                                }
                                className={`${style.switchFontStyle} ${style.flexLeft} `}
                                label={'YES'}
                            />
                            <div className={`${style.addGrid} ${style.fullWidth}`}> 
                                <DatalistInput items={[]} onSelect={() => {}} className={style.fullWidth} />
                                <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                    <AddIcon sx={{ fontSize: 25, color: 'white' }} />
                                </div>
                            </div>
                        </div>
                        <MultiSelectDisplay values={['Location 1']} />
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Additional Details*</div>
                    <div >
                        <div className={`${style.additionalDetails} ${style.additionalDetailsSelected} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#7165E3' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Require Patient Data</div>
                        </div>
                        <div className={`${style.additionalDetails} ${style.marginTop10} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#E4E4E4' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Administrative Approval For Payment Required</div>
                        </div>
                        <div className={`${style.additionalDetails} ${style.additionalDetailsSelected} ${style.marginTop10} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#7165E3' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Prior Pre-Authorisation Required</div>
                        </div>
                        <div className={`${style.additionalDetails} ${style.additionalDetailsSelected} ${style.marginTop10} ${style.cursorPointer}`}>
                            <div className={style.alignCenter}>
                                <TaskAltIcon sx={{ color: '#7165E3' }} />
                            </div>
                            <div className={`${style.additionalDetailsTextStyle} ${style.verticalAlignCenter}`}>Require Reason For Add-On Service</div>
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
        </div>
    )
}

export default AddonClinicFields;
