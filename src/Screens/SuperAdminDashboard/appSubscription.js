import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TextArea, RadioGroup, Radio } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import {GET, tenantID, PUT} from './entityDataSaver';
import {Link} from 'react-router-dom';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step23.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step45.png';
import Step5 from './../../images/step55.png';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';
import {Auth} from './../../utils/auth'
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';


const VALUES = ['Department 1', "Department 2", "Department 3"];

const AppSubscription = ({getActiveStep}) => {
    const [tags, setTags] = useState(VALUES);
    const [entityData,setEntityData] = useState();
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [selectedContract, setSelectedContract] = useState('Select...');
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
    const accessToken = Auth();

    useEffect(()=>{
      getEntityData();
    },[]);

    const getEntityData = async() => {
      const {data: data} = await GET(`entity-service/entity/${tenantID}`);
      setEntityData(data);
      setBillingData({firstName:data?.billingDetails?.contactname?.firstName,lastName:data?.billingDetails?.contactname?.lastName,email:data?.billingDetails?.email?.emailId,phone:data?.billingDetails?.contactNumber?.contactNumber.toString()});
      setPoaNumber(data?.subscriptionPlan?.poaNumber?.poaNumber);
    }

    const options = [
        { name: 'Department 1' },
        { name: 'Department 2' },
        { name: 'Department 3' },
      ];

      const onSelect = useCallback((selectedItem) => {
        setItem(selectedItem)
        console.log('selectedItem', selectedItem);
        setItem(selectedItem);
        setSelectDepartment('');
        setItem(true);
      }, []);

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

      const items = useMemo(
        () =>
          options.map((option) => ({
            id: option.name,
            value: option.name,
            ...option,
          })),
        [item],
      );

    const updateBilling = async() => {
      if(billingData?.email === '' && !billingData?.email.includes('@') && !billingData?.email.includes('.')){
        ErrorToaster('Enter a valid E-mail');
        return;
      }
      let data = {
        "id": entityData?.id,
        "entityName": entityData?.entityName,
        "entityType": entityData?.entityType,
        "entityDisplayId": entityData?.entityDisplayId,
        "customerType": entityData?.customerType,
        "sites": entityData?.sites,
        "subscriptionPlan": {
          "planName": "BASIC",
          "allowableRegisteredUsers": {
            "allowableRegisteredUsers": 0
          },
          "subscriptionFees": {
            "fees": "string"
          },
          "subscriptionStatus": "ACTIVE",
          "billingFrequency": "MONTHLY",
          "discount": {
            "discount": 0
          },
          "plannedToGoLive": {
            "date": "2022-07-23"
          },
          "poaNumber": {
            "poaNumber": poaNumber
          }
        },
        "billingDetails": {
          "contactname": {
            "firstName": billingData?.firstName,
            "lastName": billingData?.lastName,
          },
          "email": {
            "emailId": billingData?.email
          },
          "contactNumber": {
            "contactNumber": billingData?.phone
          }
        },
        "contractDetails": entityData?.contractDetail,
      }
      if(isUpdated){
        await PUT('entity-service/entity',data)
          .then(response=>{
          SuccessToaster('Entity Billing Updated Successfully');
          }).catch(error=>{
            ErrorToaster('Unexpected Error Updating Entity Billing');
          });
        }
    }

    const handleBillingData = (name,value) => {
      setBillingData({...billingData, [name]:value});
      setIsUpdated(true);
    }

    const handlePoaNumber = (value) => {
      setPoaNumber(value);
      setIsUpdated(true);
    }

    return(
        <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={style.stepperGrid}>
                    <div onClick={() => getActiveStep('entitySetup')}>
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
                    <div onClick={() => getActiveStep('siteInformation')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                    </div>
                    <div onClick={() => getActiveStep('siteUsers')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>APP USERS</p>
                    </div>
                    <div onClick={() => getActiveStep('appSubscription')}>
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
                                        value={plan?.planName}
                                        disabled
                                        onChange={(e) => setPlan({...plan, planName: e.target.value})}
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
                                disabled
                                // value={plan?.allowableRegisteredUsers?.allowableRegisteredUsers}
                                onChange={(e) => setPlan({...plan, allowableRegisteredUsers: {allowableRegisteredUsers: e.target.value}})} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Monthly Subscription Fees*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={`${style.textFieldWidth} ${style.fourFieldWidth}`}
                                    // value={`$ ${plan?.subscriptionFees?.fees}`}
                                    value={`$ 6`}
                                    disabled
                                    onChange={(e) => setPlan({...plan, subscriptionFees: {fees: e.target.value}})} />
                                    <div className={`${style.extentionLableStyle} ${style.fourFieldWidth} ${style.marginLeft20}`}>Per User</div>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Billing Frequency *</div>
                                <div className={`${style.leftAlign} `}>
                                    <select
                                        name="class"
                                        id="Class"
                                        value={plan?.billingFrequency}
                                        disabled
                                        onChange={(e) => setPlan({...plan, billingFrequency: e.target.value})}
                                        className={style.fourFieldWidth}>
                                            <option value="Monthly" >
                                            Monthly
                                            </option>
                                    </select>
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Discount*</div>
                                <InputGroup className={style.fourFieldWidth} value={`${plan?.discount?.discount} %`} disabled
                                onChange={(e) => setPlan({...plan, discount:{discount: e.target.value}})}
                                 />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>POA Number</div>
                                <InputGroup className={style.fourFieldWidth} placeholder="POA Number" value={poaNumber}
                                 onChange={(e) => handlePoaNumber(e.target.value)} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Billing Contact Name</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.fourFieldWidth} value={billingData?.firstName} placeholder="First Name" onChange={(e) => handleBillingData('firstName',e.target.value)} />
                                    <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20}`} placeholder="Last Name" value={billingData?.lastName}
                                     onChange={(e) => handleBillingData('lastName',e.target.value)} />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Email*</div>
                                <InputGroup className={style.twoFieldWidth} value={billingData?.email} placeholder="example@gmail.com"
                                 onChange={(e) => handleBillingData('email',e.target.value)} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Cell Phone</div>
                                <InputGroup className={style.twoFieldWidth} value={billingData?.phone} placeholder="+1(342)444-5505"
                                 onChange={(e) => handleBillingData('phone',e.target.value)} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                                <InputGroup className={style.fullWidth} value={contract?.contractName} placeholder="Text" disabled
                                 onChange={(e) => setContract({...contract, contractName: e.target.value})} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract ID ( CID )*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.fourFieldWidth} value={contract?.contractID} disabled placeholder="Contract Id"
                                    onChange={(e) => setContract({...contract, contractID: e.target.value})}  />
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
                                                <Switch checked={contract?.fullyExecutedContractOnFile} className={` ${style.textAlignLeft}`} onChange={() => setContract({...contract, fullyExecutedContractOnFile: !contract?.fullyExecutedContractOnFile})}  />
                                            }
                                            disabled
                                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                                            label={contract?.fullyExecutedContractOnFile ? 'YES' : "NO"}
                                        />
                                        {contract?.fullyExecutedContractOnFile && (
                                            <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button>
                                        )}
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
                                            value={contract?.contractDocuments?.name}
                                            onChange={(e) => setContract({...contract, contractDocuments: {name: e.target.value}})}
                                             />
                                            <TextArea rows={4} value={contract?.contractDocuments?.description} className={`${style.fullWidth} ${style.marginTop10}`}
                                            onChange={(e) => setContract({...contract, contractDocuments: {description: e.target.value}})} />
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
                                    <InputGroup value={contract?.contractTermPeriod?.startDate} rightElement={calendarIcon()}
                                    disabled
                                    onChange={(e) => setContract({...contract, contractTermPeriod: {startDate: e.target.value}})} />
                                <p className={style.toStyle}>To</p>
                                    <InputGroup value={contract?.contractTermPeriod?.endDate} rightElement={calendarIcon()}
                                    disabled
                                    onChange={(e) => setContract({...contract, contractTermPeriod:{endDate: e.target.value}})}  />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Planned Go Live</div>
                                <div className={style.displayInRow}>
                                    <InputGroup value={contract?.plannedGoLive?.date} rightElement={calendarIcon()} disabled
                                    onChange={(e) => setContract({...contract, plannedGoLive: {date: e.target.value}})} />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract Continuation Policy*</div>
                                <div>
                                    <div className={style.reduce10Left}>
                                        <select
                                            name="class"
                                            id="Class"
                                            disabled
                                            // value={selectedContractContinuationPolicy || 'Select...'}
                                            value={contract?.contractContinuationPolicy}
                                            // onChange={(e) => setSelectedContractContinuationPolicy(e.target.value)}
                                            onChange={(e) => setContract({...contract, contractContinuationPolicy: e.target.value})}
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
                            <button className={style.outlinedButton} onClick={updateBilling}>SAVE IN-PROGRESS</button>
                            <Link to={'/setupComplete'}>
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={updateBilling}>CONTINUE</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppSubscription;
