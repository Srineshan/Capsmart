import React, { useState } from 'react';
import { InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';

const ContractorBusinessEntity = ({getViewPage4, getCurrentPage, selectContractInfo}) => {
    const [sameAsContractor, setSameAsContractor] = useState(false);

    return (
        <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
                {selectContractInfo === "Individual Contractor" && (
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.extentionLableStyle}>Contractor Business Contact Same As Contractor*</div>
                        <FormControlLabel
                            control={
                                <Switch checked={sameAsContractor} className={`${style.textAlignLeft}`} onChange={() => setSameAsContractor(!sameAsContractor)} />
                            }
                            className={`${style.switchFontStyle} ${style.marginTop}`}
                            label={sameAsContractor ? 'YES' : 'NO'}
                        />
                    </div>
                )}
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Business Entity Name*</div>
                    <InputGroup className={style.fullWidth} value="Text" />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contractor NPIN*</div>
                    <div className={style.twoCol}>
                        <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Alphanumeric"} />
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.leftAlign}`}
                        >
                            <Radio label="Missing" value="Missing" />
                            <Radio label="NA" value="NA" />
                        </RadioGroup>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contractor Entity Tax ID*</div>
                    <div className={style.twoCol}>
                        <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Alphanumeric"} />
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.leftAlign}`}
                        >
                            <Radio label="Missing" value="Missing" />
                        </RadioGroup>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Contractor Business Contact*</div>
                    <div className={style.twoCol}>
                        <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "First Name"} />
                        <InputGroup className={style.fullWidth} value="Last Name" />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Business Contact Email Address*</div>
                    <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Text"} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell Phone*</div>
                    <div className={style.twoCol}>
                        <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Numeric"} />
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.leftAlign}`}
                        >
                            <Radio label="Missing" value="Missing" />
                        </RadioGroup>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Register Business Contact With App User Role*</div>
                    <div className={style.displayInRow}>
                        <FormControlLabel
                            control={
                                <Switch checked={true} className={`${style.textAlignLeft}`} />
                            }
                            className={`${style.switchFontStyle}`}
                            label={'YES'}
                        />
                        <select
                            name="class"
                            id="Class"
                            // value={selectedContractContinuationPolicy || 'Select...'}
                            // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                            className={`${style.marginLeft20} ${style.fullWidth}`}>
                            <option value="Select Role" >
                                Select Role
                            </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Mailing adress*</div>
                    <div>
                        <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "Text"} />
                        <div className={`${style.grid3} ${style.marginTop10}`}>
                            <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "City"} />
                            <InputGroup className={style.fullWidth} value={sameAsContractor ? "Value" : "State"} />
                            <InputGroup className={style.fullWidth} value="Zipcode" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { getViewPage4(true); getCurrentPage('Documentation Proof Required') }}>CONTINUE</button>
            </div>
        </div>
    )
}

export default ContractorBusinessEntity;