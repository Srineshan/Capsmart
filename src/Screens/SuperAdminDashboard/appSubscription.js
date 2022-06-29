import React, { useState, useMemo, useCallback } from 'react';
import { InputGroup, Icon, Intent, TextArea, RadioGroup, Radio } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import {Link} from 'react-router-dom';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step23.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step45.png';
import Step5 from './../../images/step55.png';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const VALUES = ['Department 1', "Department 2", "Department 3"];

const AppSubscription = () => {
    const [tags, setTags] = useState(VALUES);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();

    const options = [
        { name: 'Department 1' },
        { name: 'Department 2' },
        { name: 'Department 3' },
      ];

      const onSelect = useCallback((selectedItem) => {
        console.log('selectedItem', selectedItem);
        setItem(selectedItem);
        setSelectDepartment('');
      }, []);

    const handleTagsAdd = values => {
        setTags([...tags, values]);
    };

    const getTagProps = (_v, index) => ({
        minimal: true,
    });

    const leftElement = () => {
        return(
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    const handleTagsRemove = (tags, index) => {
        const updatedTags = [tags];
        updatedTags.splice(index, 1);
        tags = updatedTags;
        setTags(tags);
      };

      const items = useMemo(
        () =>
          options.map((option) => ({
            id: option.name,
            value: option.name,
            ...option,
          })),
        [item],
      );

    return(
        <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={style.stepperGrid}>
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                    </div>
                    {/* <div>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step2} alt="Step2" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                    </div> */}
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step3} alt="Step3" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                    </div>
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>APP USERS</p>
                    </div>
                    <div>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} /> 
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>APP SUBSCRIPTION</p>
                    </div>
                </div>
                <div className={style.stepperDivider5}></div>
            </div>
            <div className={style.entitySetupCardStyle}>
                <p className={style.heading}>App Subscription Information</p>
                <div className={style.greyBorder}></div>
                <div className={style.entityDescription}>
                Help lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus 
                quam nec tellus dictum, vitae ultrices urna porttitor. donec commodo tellus 
                dapibus semper mattis. aenean ut massa vitae tortor consequat tristique. etiam 
                eget condimentum sapien. morbi est ante, sagittis ac rhoncus eget, faucibus ut 
                felis. pellentesque iaculis aliquam massa. lorem ipsum dolor sit amet, consectetur 
                adipiscing elit. sed finibus quam nec tellus dictum.
                </div>
                <div>
                    <div className={style.cloneBlockStyle}>
                        <div className={`${style.newContractFromCloneBoxStyle}`}> 
                            <div className={`${style.extentionGrid}`}>
                                <div className={style.extentionLableStyle}>Subscription Plan *</div>
                                <div className={`${style.leftAlign} ${style.displayInRow}`}>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.fullWidth}>
                                            <option value="Basic/ Silver/ Bronze/ Gold/ custom" >
                                            Basic/ Silver/ Bronze/ Gold/ custom
                                            </option>
                                    </select>
                                    <button className={`${style.pricingButton} ${style.selectedColor} ${style.cursorPointer}`} >PRICING REVIEW</button>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Allowable Registered Users *</div>
                                <InputGroup className={style.fourFieldWidth} value="289" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Monthly Subscription Fees*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={`${style.textFieldWidth} ${style.fourFieldWidth}`} value="$6" />
                                    <div className={`${style.extentionLableStyle} ${style.fourFieldWidth} ${style.marginLeft20}`}>Per User</div>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Billing Frequency *</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        className={style.fourFieldWidth}>
                                            <option value="Monthly" >
                                            Monthly
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Discount*</div>
                                <InputGroup className={style.fourFieldWidth} value="10%" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>POA Number</div>
                                <InputGroup className={style.fourFieldWidth} value="368fcbv3" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Billing Contact Name</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.fourFieldWidth} value="First Name" />
                                    <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20}`} value="Last Name" />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Email*</div>
                                <InputGroup className={style.twoFieldWidth} value="email@lorem.com" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Cell Phone</div>
                                <InputGroup className={style.twoFieldWidth} value="+1 (342) 444-5505" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                                <InputGroup className={style.fullWidth} value="Text" />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract ID ( CID )*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.fourFieldWidth} value="PAMF-1106" />
                                    <RadioGroup
                                        inline={true}
                                        className={`${style.marginTop} ${style.marginLeft20}`}
                                    >
                                        <Radio label="Missing" value="Missing"  />
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Fully Executed Contract on File*</div>
                                <div>
                                    <div className={style.spaceBetween}>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={fullyExecutedContract} className={` ${style.textAlignLeft}`} onChange={() => setFullyExecutedContract(!fullyExecutedContract)}  />
                                            }
                                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                                            label={fullyExecutedContract ? 'YES' : "NO"} 
                                        />
                                        {fullyExecutedContract && (
                                            <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button>
                                        )}
                                    </div>
                                    {fullyExecutedContract && (
                                        <div>
                                            <div>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={selectedContract || 'Select...'}
                                                    onChange={(e) => setSelectedContract(e.target.value)}
                                                    className={`${style.fullWidth}`}>
                                                        <option value="" >
                                                        Select Type of Document
                                                        </option>
                                                </select>
                                            </div>
                                            <InputGroup className={`${style.fullWidth} ${style.marginTop10}`} value="Document Name" />
                                            <TextArea rows={4} value="Document Description" className={`${style.fullWidth} ${style.marginTop10}`} />
                                            <div className={`${style.displayInRow} ${style.marginTop10} ${style.twoFieldWidth} ${style.floatRight}`}>
                                                <InputGroup  rightElement={leftElement()} className={style.marginLeft20} className={style.fullWidth} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract Term Period*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup value="MM-DD-YYYY" rightElement={calendarIcon()}/>
                                <p className={style.toStyle}>To</p>
                                    <InputGroup value="MM-DD-YYYY" rightElement={calendarIcon()} />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Planned Go Live</div>
                                <div className={style.displayInRow}>
                                    <InputGroup value="MM-DD-YYYY" rightElement={calendarIcon()}/>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract Continuation Policy*</div>
                                <div>
                                    <div className={style.reduce10Left}>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={selectedContractContinuationPolicy || 'Select...'}
                                            onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                            className={`${style.fullWidth} `}>
                                                <option value="Select Value" >
                                                Select Value
                                                </option>
                                                <option value="Auto Renewal" >
                                                Auto Renewal
                                                </option>
                                                {/* <option value="Written Contract Extension For Fixed Term" >
                                                Written Contract Extension For Fixed Term
                                                </option>
                                                <option value="New Contract On Expiration" >
                                                New Contract On Expiration
                                                </option>
                                                <option value="One Time Contract - Terminate On Expiration" >
                                                One Time Contract - Terminate On Expiration
                                                </option> */}
                                        </select>
                                    </div>
                                    {selectedContractContinuationPolicy === "Auto Renewal" && (
                                        <div className={`${style.renewalBoxStyle}`}>
                                            <div className={`${style.renewalBoxGrid}`}>
                                                <div className={`${style.marginTop10} ${style.textAlignRight} ${style.marginRight20}`}>Auto Renewal Term*</div>
                                                <div className={style.inputRenewalStyle} >4</div>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    // value={selectedContractContinuationPolicy || 'Select...'}
                                                    // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                                    value={"Weeks"}
                                                    className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                        <option value="Select Value" >
                                                        Select Value
                                                        </option>
                                                        <option value="Weeks" >
                                                        Weeks
                                                        </option>
                                                        <option value="Months" >
                                                        Months
                                                        </option>
                                                </select>
                                            </div>
                                            <div className={`${style.renewalBoxGrid}`}>
                                                <div className={`${style.marginTop15} ${style.textAlignRight} ${style.marginRight20}`}>Allowable Auto Renewal Terms*</div>
                                                <div className={`${style.inputRenewalStyle} ${style.marginTop10}`} >2</div>
                                            </div>
                                        </div>
                                    )}
                                    {/* {(selectedContractContinuationPolicy === "Written Contract Extension For Fixed Term"
                                    || selectedContractContinuationPolicy === "New Contract On Expiration"
                                    || selectedContractContinuationPolicy === "One Time Contract - Terminate On Expiration") && (
                                        <div className={`${style.renewalRemainderBoxStyle}`}>
                                            <div className={`${style.renewalRemainderBoxGrid}`}>
                                                <div className={style.marginTop}>Set Renewal Reminder*</div>
                                                <div className={style.inputRenewalRemainderStyle} >30 Days   </div>
                                                <Icon icon="cross" className={style.marginTop10} color="black" />
                                            </div>
                                            <div className={`${style.renewalBoxGrid}`}>
                                                <button className={`${style.addMoreButton} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button>
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                        <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                            <Link to={'/setupComplete'}>
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`}>CONTINUE</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppSubscription;