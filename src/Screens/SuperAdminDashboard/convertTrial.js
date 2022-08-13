import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio, Switch } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import FormControlLabel from '@mui/material/FormControlLabel';

import style from './index.module.scss';

const VALUES = ['Department 1', "Department 2", "Department 3"];

const ConvertTrial = ({getConvertTrialDialog}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration')
    const [tags, setTags] = useState(VALUES);
    const [entityData,setEntityData] = useState();
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
    const [isUpdated, setIsUpdated] = useState(false);
    const [plan,setPlan] = useState({planName: '',allowableRegisteredUsers: {allowableRegisteredUsers: 0}, subscriptionFees: {fees: ""}, subscriptionStatus: "ACTIVE", billingFrequency: "",
        discount: {
            discount: 0
        },
        plannedToGoLive: {
            date: "2022-07-18"
        },
        poaNumber: {
            poaNumber: ""
        }});
    const [poaNumber,setPoaNumber] = useState('');
    const [billing,setBilling] = useState({contactname: {firstName: '', lastName: ''}, email: {emailId: ''}, contactNumber: {contactNumber: 0}});
    const [billingData,setBillingData] = useState({firstName:'',lastName:'',email:'',phone:''});
    const [contract,setContract] = useState(
        {
            contractName: "",
            contractID: "",
            contractDocuments: [
              {
                name: "",
                description: "",
                contractDocType: "AGREEMENTDRAFT",
                contractDocPath: ""
              }
            ],
            contractTermPeriod: {
              startDate: "2022-07-18",
              endDate: "2022-07-18"
            },
            plannedGoLive: {
              date: "2022-07-18"
            },
            contractContinuationPolicy: "AUTORENEWAL",
            fullyExecutedContractOnFile: true
        },
    );

    const handleBillingData = (name,value) => {
        setBillingData({...billingData, [name]:value});
        setIsUpdated(true);
      }
  
      const handlePoaNumber = (value) => {
        setPoaNumber(value);
        setIsUpdated(true);
      }

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

    console.log('entered', getConvertTrialDialog)

    return(
        <Dialog isOpen={getConvertTrialDialog} onClose={() => getConvertTrialDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Convert Trial</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle2} onClick={() => getConvertTrialDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>CUSTOMER NAME (0043245)</p>
                <p className={style.extensionOptionsStyle}>TRIAL SUBCCRIPTION</p>
                <p className={style.extensionOptionsStyle}>EXPIRING IN 2 DAYS</p>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Subscription Plan *</div>
                <div className={`${style.leftAlign} ${style.displayInRow}`}>
                    <select
                        name="class"
                        id="Class"
                        // value={plan?.planName}
                        // disabled
                        // onChange={(e) => setPlan({...plan, planName: e.target.value})}
                        className={style.fullWidth}>
                            <option value="BASIC" >
                                Basic
                            </option>
                            <option value="SILVER">
                                Silver
                            </option>
                            <option value="BRONZE">
                                Bronze
                            </option>
                            <option value="GOLD">
                                Gold
                            </option>
                            <option value="CUSTOM">
                                Custom
                            </option>

                    </select>
                    <button className={`${style.pricingButton} ${style.selectedColor} ${style.cursorPointer}`} >PRICING REVIEW</button>
                </div>
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Registered Users *</div>
                <InputGroup className={style.fourFieldWidth}
                value="289"
                // disabled
                // value={plan?.allowableRegisteredUsers?.allowableRegisteredUsers}
                // onChange={(e) => setPlan({...plan, allowableRegisteredUsers: {allowableRegisteredUsers: e.target.value}})} 
                />
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Monthly Subscription Fees*</div>
                <div className={style.displayInRow}>
                    <InputGroup className={`${style.textFieldWidth} ${style.fourFieldWidth}`}
                    value={`$ 6`}
                    // disabled
                    // onChange={(e) => setPlan({...plan, subscriptionFees: {fees: e.target.value}})} 
                    />
                    <div className={`${style.extentionLableStyle} ${style.fourFieldWidth} ${style.marginLeft20}`}>Per User</div>
                </div>
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Billing Frequency *</div>
                <div className={`${style.leftAlign} `}>
                    <select
                        name="class"
                        id="Class"
                        // value={plan?.billingFrequency}
                        // disabled
                        // onChange={(e) => setPlan({...plan, billingFrequency: e.target.value})}
                        className={style.fourFieldWidth}>
                            <option value="Monthly" >
                            Monthly
                            </option>
                    </select>
                </div>
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Discount*</div>
                <InputGroup className={style.fourFieldWidth} 
                // value={`${plan?.discount?.discount} %`} disabled
                // onChange={(e) => setPlan({...plan, discount:{discount: e.target.value}})}
                    />
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>POA Number</div>
                <InputGroup className={style.fourFieldWidth} placeholder="POA Number" 
                    // value={poaNumber}
                    // onChange={(e) => handlePoaNumber(e.target.value)} 
                    />
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Billing Contact Name</div>
                <div className={style.displayInRow}>
                    <InputGroup className={style.fourFieldWidth} 
                    // value={billingData?.firstName} 
                    placeholder="First Name" 
                    // onChange={(e) => handleBillingData('firstName',e.target.value)} 
                    />
                    <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20}`} placeholder="Last Name" 
                        // value={billingData?.lastName}
                        // onChange={(e) => handleBillingData('lastName',e.target.value)} 
                        />
                </div>
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Email*</div>
                <InputGroup className={style.twoFieldWidth}
                    // value={billingData?.email} 
                    placeholder="example@gmail.com"
                    // onChange={(e) => handleBillingData('email',e.target.value)} 
                    />
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Cell Phone</div>
                <InputGroup className={style.twoFieldWidth} 
                    // value={billingData?.phone} 
                    placeholder="+1(342)444-5505"
                    // onChange={(e) => handleBillingData('phone',e.target.value)}
                     />
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                <InputGroup className={style.fullWidth}
                    //  value={contract?.contractName} 
                     placeholder="Text" 
                    //  disabled
                    // onChange={(e) => setContract({...contract, contractName: e.target.value})} 
                    />
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Contract ID ( CID )*</div>
                <div className={style.displayInRow}>
                    <InputGroup className={style.fourFieldWidth} 
                    // value={contract?.contractID} disabled 
                    placeholder="Contract Id"
                    // onChange={(e) => setContract({...contract, contractID: e.target.value})}  
                    />
                    <RadioGroup
                        inline={true}
                        className={`${style.marginTop} ${style.marginLeft20}`}
                        disabeld
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
                                <Switch 
                                // checked={contract?.fullyExecutedContractOnFile} 
                                className={` ${style.marginLeft20}`} 
                                // onChange={() => setContract({...contract, fullyExecutedContractOnFile: !contract?.fullyExecutedContractOnFile})}  
                                />
                            }
                            // disabled
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            // label={contract?.fullyExecutedContractOnFile ? 'YES' : "NO"}
                            label={'NO'}
                        />
                        {/* {contract?.fullyExecutedContractOnFile && ( */}
                            {/* <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button> */}
                        {/* )} */}
                    </div>
                    {fullyExecutedContract && (
                        <div>
                            <div>
                                <select
                                    name="class"
                                    id="Class"
                                    value={contract?.contractDocuments?.contractDocType || 'Select...'}
                                    onChange={(e) => setContract({...contract, contractDocuments: {contractDocType: e.target.value}})}
                                    className={`${style.fullWidth}`}>
                                        <option value="" >
                                        Select Type of Document
                                        </option>
                                </select>
                            </div>
                            <InputGroup className={`${style.fullWidth} ${style.marginTop10}`}
                            // value={contract?.contractDocuments?.name}
                            // onChange={(e) => setContract({...contract, contractDocuments: {name: e.target.value}})}
                                />
                            <TextArea rows={4}
                            //  value={contract?.contractDocuments?.description}
                              className={`${style.fullWidth} ${style.marginTop10}`}
                            // onChange={(e) => setContract({...contract, contractDocuments: {description: e.target.value}})} 
                            />
                            <div className={`${style.displayInRow} ${style.marginTop10} ${style.twoFieldWidth} ${style.floatRight}`}>
                                <InputGroup  rightElement={leftElement()} className={`${style.marginLeft20} ${style.fullWidth}`} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Contract Term Period*</div>
                <div className={style.displayInRow}>
                    <InputGroup 
                    // value={contract?.contractTermPeriod?.startDate} 
                    rightElement={calendarIcon()}
                    // disabled
                    // onChange={(e) => setContract({...contract, contractTermPeriod: {startDate: e.target.value}})}
                     />
                <p className={style.toStyle}>To</p>
                    <InputGroup 
                    // value={contract?.contractTermPeriod?.endDate} 
                    rightElement={calendarIcon()}
                    // disabled
                    // onChange={(e) => setContract({...contract, contractTermPeriod:{endDate: e.target.value}})} 
                     />
                </div>
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Planned Go Live</div>
                <div className={style.displayInRow}>
                    <InputGroup 
                    // value={contract?.plannedGoLive?.date} 
                    rightElement={calendarIcon()} 
                    // disabled
                    // onChange={(e) => setContract({...contract, plannedGoLive: {date: e.target.value}})}
                     />
                </div>
            </div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Contract Continuation Policy*</div>
                <div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            // disabled
                            // value={contract?.contractContinuationPolicy}
                            // onChange={(e) => setContract({...contract, contractContinuationPolicy: e.target.value})}
                            className={`${style.fullWidth} ${style.marginLeft20}`}>
                                <option value="Select Value" >
                                Select Value
                                </option>
                                <option value="Auto Renewal" >
                                Auto Renewal
                                </option>
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
                </div>
            </div>
            <div className={`${style.extentionBoxStyle}`}> 
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Termination Notes*</div>
                    <div>
                        <TextArea
                            growVertically={true}
                            large={true}
                            value="text area"
                            className={style.fullWidth}
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton}>CANCEL</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>CONVERT TRIAL</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default ConvertTrial;