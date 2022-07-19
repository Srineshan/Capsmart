import React, {useState} from 'react';
import { InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';

import style from './index.module.scss';

function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
  const names = [
    'Activity Logger',
    'Reviewer',
    'Approver',
    'Accounts Payable',
    'Contracts manager',
    'Report viewer',
  ];
  

const ContractedServicesProviderIndividual = ({getViewPage3, getCurrentPage}) => {
    const [siteLevel, setSiteLevel] = useState(false);
    const [departmentLevel, setDepartmentLevel] = useState(false);
    const [selectedContract, setSelectedContract] = useState('Select...');
    const theme = useTheme();
    const [personName, setPersonName] = useState([]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };
    return(
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
            <div className={`${style.extentionGrid}`}>
                <div className={style.extentionLableStyle}>Service Provider Type*</div>
                    <div className={style.grid3}>
                        <select
                            name="class"
                            id="Class"
                            className={style.fullWidth}>
                                <option value="Text" >
                                Text
                                </option>
                                <option value="Physician" >
                                Physician
                                </option>
                                <option value="Nurse" >
                                Nurse
                                </option>
                                <option value="Admin Staff" >
                                Admin Staff
                                </option>
                                <option value="Other" >
                                Other
                                </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>NPIN*</div>
                    <div className={style.grid3}>
                    <InputGroup className={style.fullWidth}/>
                    <RadioGroup
                        inline={true}
                        className={`${style.marginTop}`}
                        selectedValue={"Missing"}
                    >
                        <Radio label="Missing" value="Missing" checked />
                    </RadioGroup>
                    <RadioGroup
                        inline={true}
                        className={`${style.marginTop} ${style.reduce30Left}`}
                    >
                        <Radio label="NA" value="Not Available" />
                    </RadioGroup>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contractor Name*</div>
                    <div className={style.grid3}>
                    <InputGroup className={style.fullWidth} value="First" />
                    <InputGroup className={style.fullWidth} value="Middle"/>
                    <InputGroup className={style.fullWidth} value="Last"/>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Suffix*</div>
                    <div className={style.grid3}>
                        <select
                            name="class"
                            id="Class"
                            className={style.fullWidth}>
                                <option value="Text" >
                                Text
                                </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Email Contractor id*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Enter entity specific email" className={`${style.entityFieldWidth} ${style.alertValidationInputStyle}`}/>
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.marginLeft20}`}
                        >
                            <Radio label="NA" value="Not Available" />
                        </RadioGroup>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell Phone*</div>
                    <div className={style.grid2}>
                    <InputGroup value="Numeric" className={style.fullWidth}/>
                    <RadioGroup
                        inline={true}
                        className={`${style.marginTop} ${style.leftAlign}`}
                        selectedValue={"Missing"}
                    >
                        <Radio label="NA" value="Not Available" />
                    </RadioGroup>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contractor Name*</div>
                    <div className={style.grid3}>
                    <InputGroup className={style.fullWidth} value="City" />
                    <InputGroup className={style.fullWidth} value="State"/>
                    <InputGroup className={style.fullWidth} value="Zipcode"/>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Site Level Responsibility*</div>
                    <div>
                        <div className={style.flexLeft}>
                            <FormControlLabel
                                control={
                                    <Switch checked={siteLevel} className={`${style.flexLeft}`} onChange={() => setSiteLevel(!siteLevel)}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop}`}
                                label={siteLevel ? 'YES' : "NO"}
                            />
                        </div>
                        {siteLevel && (
                            <div className={`${style.siteLevelBoxStyle}`}>
                                <div className={`${style.siteLevelGrid}`}>
                                    <div className={style.marginTop}>Title*</div>
                                    <select
                                        name="class"
                                        id="Class"
                                        // value={selectedContractContinuationPolicy || 'Select...'}
                                        // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                        className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                            <option value="type or select" >
                                            type or select
                                            </option>
                                    </select>
                                </div>
                                {selectedContract === "Multiple Contractor" && (
                                    <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                        <div className={style.marginTop}>Site*</div>
                                        <select
                                            name="class"
                                            id="Class"
                                            // value={selectedContractContinuationPolicy || 'Select...'}
                                            // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="type or select" >
                                                type or select
                                                </option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Department Level Responsibility*</div>
                    <div>
                        <div className={style.flexLeft}>
                            <FormControlLabel
                                control={
                                    <Switch checked={departmentLevel} className={`${style.flexLeft}`} onChange={() => setDepartmentLevel(!departmentLevel)}  />
                                }
                                className={`${style.switchFontStyle} ${style.marginTop}`}
                                label={departmentLevel ? 'YES' : "NO"}
                            />
                        </div>
                        <div>
                            {departmentLevel && (
                                <div className={`${style.departmentLevelBoxStyle}`}>
                                    <div className={`${style.siteLevelGrid}`}>
                                        <div className={style.marginTop}>Department*</div>
                                        <select
                                            name="class"
                                            id="Class"
                                            // value={selectedContractContinuationPolicy || 'Select...'}
                                            // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="Department" >
                                                Department
                                                </option>
                                        </select>
                                    </div>
                                    <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                        <div className={style.marginTop}>Title*</div>
                                        <select
                                            name="class"
                                            id="Class"
                                            // value={selectedContractContinuationPolicy || 'Select...'}
                                            // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                            className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                <option value="type or select" >
                                                type or select
                                                </option>
                                        </select>
                                    </div>
                                    {selectedContract === "Multiple Contractor" && (
                                        <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                                            <div className={style.marginTop}>Site*</div>
                                            <select
                                                name="class"
                                                id="Class"
                                                // value={selectedContractContinuationPolicy || 'Select...'}
                                                // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                    <option value="type or select" >
                                                    type or select
                                                    </option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                    <div>
                        {/* <TagInput
                            values={activityTags}
                            onAdd={handleActivityTagsAdd}
                            onRemove={handleActivityTagsRemove}
                            separator={/[\s,]/}
                            addOnBlur={true}
                            addOnPaste={true}
                            tagProps={getTagProps}
                            rightElement={rightIconElement}
                        /> */}
                        <FormControl sx={{ m: 1, width: '100%' }}>
                            <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            >
                            {names.map((name) => (
                                <MenuItem
                                key={name}
                                value={name}
                                style={getStyles(name, personName, theme)}
                                >
                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {getViewPage3(true);getCurrentPage('Contractor Business Entity')}}>CONTINUE</button>
            </div>
        </div>
    )
}

export default ContractedServicesProviderIndividual;