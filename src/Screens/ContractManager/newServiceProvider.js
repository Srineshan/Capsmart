import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio, Switch } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import style from './index.module.scss';

const NewServiceProvider = ({getNewServiceProviderDialog}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration')
    const leftElement = () => {
        return(
            <Button text="Upload" intent={Intent.PRIMARY} />
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    return(
        <Dialog isOpen={getNewServiceProviderDialog} onClose={() => getNewServiceProviderDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>New Service Provider</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getNewServiceProviderDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.serviceBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
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
                        <Radio label="Not Available" value="Not Available" />
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
                    <div className={style.extentionLableStyle}>Email Contractor id*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Enter entity specific email" className={`${style.entityFieldWidth}`}/>
                        <RadioGroup
                            inline={true}
                            className={`${style.marginTop} ${style.marginLeft20}`}
                        >
                            <Radio label="Not Available" value="Not Available" />
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
                        <Radio label="Not Available" value="Not Available" />
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
                        <Switch label={"NO"} className={`${style.marginTop} ${style.textAlignLeft}`} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Department Level Responsibility*</div>
                    <div>
                        <Switch label={"NO"} className={`${style.marginTop} ${style.textAlignLeft}`}  />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Assign Contractor With App User Role*</div>
                    <select
                        name="class"
                        id="Class"
                        className={style.fullWidth}>
                            <option value="Activity Logger" >
                            Activity Logger
                            </option>
                    </select>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.buttonStyle}`}>ADD MORE</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & EXIT</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default NewServiceProvider;