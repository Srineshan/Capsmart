import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TextArea, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import {Link, useNavigate, useParams} from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import SetupComplete from './setupComplete';
import {format} from 'date-fns';
import { DateInput } from "@blueprintjs/datetime";
import {GET, TenantID, PUT, isSuperAdminAccess} from './../dataSaver';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step23.png';
import Step3 from './../../images/step34.png';
import Step4 from './../../images/step45.png';
import Step5 from './../../images/step55.png';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';
import {Auth} from './../../utils/auth'
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';


const AppSubscription = ({getActiveStep}) => {
    const {id} = useParams();
    // const id = TenantID;
    const navigate = useNavigate();
    const [entityData,setEntityData] = useState();
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('AUTORENEWAL');
    const [item, setItem] = useState();
    const [isSetupComplete,setIsCompleteSetup] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [plan,setPlan] = useState({planName: 'BASIC',allowableRegisteredUsers: 0,fees: "", subscriptionStatus: "ACTIVE", billingFrequency: "MONTHLY",discount: 0,
       poaNumber: ""});
    const [billingData,setBillingData] = useState({firstName:'',lastName:'',email:'',phone:''});
    // const [autoRenewal,setAutoRenewal] = useState({renewalTerm:'0',allowableRenewalTerm:'0',calendar:'WEEKS'});
    // const [renewalReminder,setRenewalreminder] = useState([{'days':0}]);
    const [contract,setContract] = useState(
        {
            contractName: "",
            contractID: "",
            missing:false,
            startDate: new Date(),
            endDate: new Date(),
            date: new Date(),
            contractContinuationPolicy: "AUTORENEWAL",
        }
    );
    const [trial,setTrial] = useState({
      trialPeriod:7,
      startDate:new Date(),
      endDate: new Date()
    })
    const [contractFiles,setContractFiles] = useState([{type:'',name:'',desc:'',file:null,path:''}])

    const role = '';
    const accessToken = Auth();

    useEffect(()=>{
      if(id !== 'new'){
          getEntityData();
      }
    },[]);

    const getEntityData = async() => {
      const {data: data} = await GET(`entity-service/entity/${id}`);
      let subscription = data?.subscriptionPlan;
      let contractData = data?.contractDetails;
      setEntityData(data);
      setBillingData({firstName:data?.billingDetails?.contactname?.firstName,lastName:data?.billingDetails?.contactname?.lastName,email:data?.billingDetails?.email?.emailId,phone:data?.billingDetails?.contactNumber?.contactNumber.toString()});
      setPlan({planName: subscription?.planName,allowableRegisteredUsers: subscription?.allowableRegisteredUsers?.allowableRegisteredUsers,fees: subscription?.subscriptionFees?.fees, subscriptionStatus: subscription?.subscriptionStatus, billingFrequency: subscription?.billingFrequency,discount: subscription?.discount?.discount || '0',
         poaNumber: subscription?.poaNumber?.poaNumber});
      setContract({
            contractName: contractData?.contractName,
            contractID: contractData?.contractID,
            missing:false,
            startDate: contractData?.contractTermPeriod?.startDate !== undefined? new Date(contractData?.contractTermPeriod?.startDate) : new Date(),
            endDate: contractData?.contractTermPeriod?.endDate !== undefined ? new Date(contractData?.contractTermPeriod?.endDate) : new Date(),
            date: contractData?.plannedGoLive?.date !== undefined ? new Date(contractData?.plannedGoLive?.date) : new Date(),
            contractContinuationPolicy: contractData?.contractContinuationPolicy,
        })
    }

    const onSelect = useCallback((selectedItem) => {
      setItem(selectedItem);
      setSelectDepartment('');
      setItem(true);
    }, []);

    const leftElement = () => {
        return(
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

    const percentRightElement = () => {
        return(
            <p className={`${style.marginTop7} ${style.marginRight20}`}>%</p>
        )
    }

    const dollarLeftElement = () => {
      return(
        <p className={`${style.marginTop7} ${style.marginLeft20}`}>$</p>
      )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    const updateBilling = async(type) => {
      if(billingData?.email === '' && !billingData?.email.includes('@') && !billingData?.email.includes('.')){
        ErrorToaster('Enter a valid E-mail');
        return;
      }
      let fileData = [];
     contractFiles?.map(data=>{
        fileData.push({"name":data?.name,"description":data?.desc,"contractDocType":data?.type,"contractDocPath":data?.path})
      })
      let data = {
        "id": entityData?.id,
        "entityName": entityData?.entityName,
        "entityType": entityData?.entityType,
        "entityDisplayId": entityData?.entityDisplayId,
        "customerType": entityData?.customerType,
        "sites": entityData?.sites,
        "subscriptionPlan": {
          "planName": plan?.planName || 'BASIC',
          "allowableRegisteredUsers": {
            "allowableRegisteredUsers": parseInt(plan?.allowableRegisteredUsers),
          },
          "subscriptionFees": {
            "fees": plan?.fees,
          },
          "subscriptionStatus": plan?.subscriptionStatus || 'ACTIVE',
          "billingFrequency": plan?.billingFrequency || 'MONTHLY',
          "discount": {
            "discount": parseInt(plan?.discount)
          },
          "plannedToGoLive": {
            "date": format(contract?.date, 'yyyy-MM-dd').toString(),
          },
          "poaNumber": {
            "poaNumber": contract?.poaNumber,
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
            "contactNumber": parseInt(billingData?.phone)
          }
        },
        "contractDetails": {
        "contractName": contract?.contractName,
        "contractID": contract?.contractID,
        "contractDocuments": [],
        "contractTermPeriod": {
          "startDate": format(contract?.startDate, 'yyyy-MM-dd').toString(),
          "endDate": format(contract?.endDate, 'yyyy-MM-dd').toString(),
        },
        "plannedGoLive": {
          "date": format(contract?.date, 'yyyy-MM-dd').toString(),
        },
        "contractContinuationPolicy": contract?.contractContinuationPolicy,
        "fullyExecutedContractOnFile": fullyExecutedContract,
      },
      }
      if(isUpdated){
        await PUT('entity-service/entity',data)
          .then(response=>{
          SuccessToaster('Entity Billing Updated Successfully');
          }).catch(error=>{
            ErrorToaster('Unexpected Error Updating Entity Billing');
          });
        }
      if(type === 'Continue'){
        setIsCompleteSetup(true);
      }
    }

    const handleBillingData = (name,value) => {
      setBillingData({...billingData, [name]:value});
      setIsUpdated(true);
    }

    const handleContract = (name, value) => {
      setContract({...contract, [name]:value});
      if(name === 'missing' && value === true){
        setContract({...contract, 'contractID':'', 'missing':true});
      }
      if(name === 'contractID' && value !== ''){
        setContract({...contract, 'missing':false, 'contractID': value});
      }
      setIsUpdated(true);
    }

    const handleTrial = (name,value) => {
      setTrial({...trial, [name]:value});
      setIsUpdated(true);
    }

    const handleContractFiles = (name,value) => {
      setContract({...contract, [name]:value});
      setIsUpdated(true);
    }

    const getCompleteValue = (value) => {
      setIsCompleteSetup(value);
    }

    return(
      <>
        {isSetupComplete? <SetupComplete data={plan?.planName === 'TRIAL'? 'Trial':'Customer'} setCompleteValue={getCompleteValue} operation={isSuperAdminAccess? 'Created' : 'Updated'}/> : <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={isSuperAdminAccess ? style.stepperGrid : style.stepperGrid4}>
                    <div onClick={() => getActiveStep('entitySetup')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                    </div>
                    <div onClick={() => getActiveStep('siteInformation')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                    </div>
                    {isSuperAdminAccess && (
                    <div onClick={() => getActiveStep('entitySystemAdmin')}>
                      <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                          <img src={Step2} alt="Step3" className={style.stepperImgStyle} />
                      </div>
                      <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                    </div>
                    )}
                    <div onClick={() => getActiveStep('siteUsers')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>APP USERS</p>
                    </div>
                    <div onClick={() => getActiveStep('appSubscription')}>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>APP SUBSCRIPTION</p>
                    </div>
                </div>
                <div className={isSuperAdminAccess ? style.stepperDivider5 : style.stepperDivider5grid4}></div>
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
                                        disabled={!isSuperAdminAccess}
                                        value={plan?.planName}
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
                                            <option value="TRIAL">
                                              Trial Plan
                                            </option>
                                    </select>
                                    <button className={`${style.pricingButton} ${style.selectedColor} ${style.cursorPointer}`} >PRICING REVIEW</button>
                                </div>
                            </div>
                            {plan?.planName !== "TRIAL" ? (
                                <>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Allowable Registered Users *</div>
                                        <InputGroup className={style.fourFieldWidth}
                                        type="number"
                                        disabled={!isSuperAdminAccess}
                                        value={plan?.allowableRegisteredUsers}
                                        onChange={(e) => setPlan({...plan, allowableRegisteredUsers: e.target.value})} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Monthly Subscription Fees*</div>
                                        <div className={style.displayInRow}>
                                            <InputGroup className={`${style.textFieldWidth} ${style.fourFieldWidth}`}
                                            value={plan?.fees}
                                            type="number"
                                            leftElement={dollarLeftElement()}
                                            disabled={!isSuperAdminAccess}
                                            onChange={(e) => setPlan({...plan, fees: e.target.value})} />
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
                                                disabled={!isSuperAdminAccess}
                                                onChange={(e) => setPlan({...plan, billingFrequency: e.target.value})}
                                                className={style.fourFieldWidth}>
                                                    <option value="MONTHLY" >
                                                    Monthly
                                                    </option>
                                                    <option value="QUARTERLY" >
                                                    Quarterly
                                                    </option>
                                                    <option value="ANNUALY" >
                                                    Annualy
                                                    </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Discount*</div>
                                        <InputGroup className={style.fourFieldWidth} type="number" value={plan?.discount} rightElement={percentRightElement()} disabled={!isSuperAdminAccess}
                                        onChange={(e) => setPlan({...plan, discount: e.target.value})}
                                        />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>POA Number</div>
                                        <InputGroup className={style.fourFieldWidth} placeholder="POA Number" value={plan?.poaNumber}
                                        onChange={(e) => setPlan({...plan, poaNumber: e.target.value})} />
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
                                        <InputGroup type="number" className={style.twoFieldWidth} value={billingData?.phone} placeholder="+1(342)444-5505"
                                        onChange={(e) => handleBillingData('phone',e.target.value)} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                                        <InputGroup className={style.fullWidth} value={contract?.contractName} placeholder="Text" disabled={!isSuperAdminAccess}
                                        onChange={(e) => handleContract('contractName', e.target.value)} />
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Contract ID ( CID )*</div>
                                        <div className={style.displayInRow}>
                                            <InputGroup className={style.fourFieldWidth} value={contract?.contractID} disabled={!isSuperAdminAccess} placeholder="Contract Id"
                                            onChange={(e) => handleContract('contractID', e.target.value)}  />
                                            <Checkbox label="Missing"  checked={contract.missing} onChange={(e)=>handleContract('missing', e.target.checked)} className={`${style.marginTop} ${style.marginLeft20}`}/>
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Fully Executed Contract on File*</div>
                                        <div>
                                            <div className={style.spaceBetween}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch checked={fullyExecutedContract} className={` ${style.textAlignLeft}`} onChange={(e) => setFullyExecutedContract(!fullyExecutedContract)}  />
                                                    }
                                                    disabled={!isSuperAdminAccess}
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
                                                            value={contractFiles?.type || 'Select...'}
                                                            onChange={(e) => handleContractFiles('type',e.target.value)}
                                                            className={`${style.fullWidth}`}>
                                                                <option value="" >
                                                                Select Type of Document
                                                                </option>
                                                                <option value="Agreement">
                                                                Agreement
                                                                </option>
                                                        </select>
                                                    </div>
                                                    <InputGroup className={`${style.fullWidth} ${style.marginTop10}`}
                                                    value={contractFiles?.name}
                                                    onChange={(e) => handleContractFiles('name',e.target.value)}
                                                    />
                                                    <TextArea rows={4} value={contractFiles?.desc} className={`${style.fullWidth} ${style.marginTop10}`}
                                                    onChange={(e) => handleContractFiles('desc', e.target.value)} />
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
                                        <DateInput
                                            formatDate={date => date.toLocaleDateString()}
                                            parseDate={str => new Date(str)}
                                            placeholder={"MM-DD-YYYY"}
                                            value={contract?.startDate || new Date()}
                                            onChange={(e)=> handleContract('startDate',e)}
                                            rightElement={calendarIcon()}
                                        />
                                        <p className={style.toStyle}>To</p>
                                        <DateInput
                                            formatDate={date => date.toLocaleDateString()}
                                            parseDate={str => new Date(str)}
                                            placeholder={"MM-DD-YYYY"}
                                            value={contract?.endDate || new Date()}
                                            onChange={(e)=> handleContract('endDate', e)}
                                            minDate={contract?.startDate || new Date()}
                                            rightElement={calendarIcon()}
                                        />
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Planned Go Live</div>
                                        <div className={style.displayInRow}>
                                        <DateInput
                                            formatDate={date => date.toLocaleDateString()}
                                            parseDate={str => new Date(str)}
                                            placeholder={"MM-DD-YYYY"}
                                            value={contract?.date}
                                            onChange={(e)=> handleContract('date', e)}
                                            minDate={contract?.startDate || new Date()}
                                            rightElement={calendarIcon()}
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
                                                    disabled={!isSuperAdminAccess}
                                                    value={contract?.contractContinuationPolicy}
                                                    onChange={(e) => handleContract('contractContinuationPolicy', e.target.value)}
                                                    className={`${style.fullWidth} `}>
                                                        <option value="Select Value" >
                                                        Select Value
                                                        </option>
                                                        <option value="AUTORENEWAL" >
                                                        Auto Renewal
                                                        </option>
                                                        <option value="WRITTENCONTRACTEXTENSIONFORFIXEDTERM" >
                                                        Written Contract Extension For Fixed Term
                                                        </option>
                                                        <option value="NEWCONTRACTONEXPIRATION" >
                                                        New Contract On Expiration
                                                        </option>
                                                        <option value="ONETIMECONTRACTTERMINATEONEXPIRATION" >
                                                        One Time Contract - Terminate On Expiration
                                                        </option>
                                                </select>
                                            </div>
                                            {
                                              // {contract?.contractContinuationPolicy === "AUTORENEWAL" && (
                                              //     <div className={`${style.renewalBoxStyle}`}>
                                              //         <div className={`${style.renewalBoxGrid}`}>
                                              //             <div className={`${style.marginTop10} ${style.textAlignRight} ${style.marginRight20}`}>Auto Renewal Term*</div>
                                              //             <div className={style.inputRenewalStyle} >4</div>
                                              //             <select
                                              //                 name="class"
                                              //                 id="Class"
                                              //                 value={contract?.continuationPolicy || 'Select...'}
                                              //                 className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                              //                     <option value="Select Value" >
                                              //                     Select Value
                                              //                     </option>
                                              //                     <option value="WEEKS" >
                                              //                     Weeks
                                              //                     </option>
                                              //                     <option value="MONTHS" >
                                              //                     Months
                                              //                     </option>
                                              //             </select>
                                              //         </div>
                                              //         <div className={`${style.renewalBoxGrid}`}>
                                              //             <div className={`${style.marginTop15} ${style.textAlignRight} ${style.marginRight20}`}>Allowable Auto Renewal Terms*</div>
                                              //             <div className={`${style.inputRenewalStyle} ${style.marginTop10}`} >2</div>
                                              //         </div>
                                              //     </div>
                                              // )}
                                              //  {(selectedContractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM"
                                              // || selectedContractContinuationPolicy === "NEWCONTRACTONEXPIRATION"
                                              // || selectedContractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION") && (
                                              //     <div className={`${style.renewalRemainderBoxStyle}`}>
                                              //         <div className={`${style.renewalRemainderBoxGrid}`}>
                                              //             <div className={style.marginTop}>Set Renewal Reminder*</div>
                                              //             <div className={style.inputRenewalRemainderStyle} >30 Days   </div>
                                              //             <Icon icon="cross" className={style.marginTop10} color="black" />
                                              //         </div>
                                              //         <div className={`${style.renewalBoxGrid}`}>
                                              //             <button className={`${style.addMoreButton} ${style.selectedColor} ${style.cursorPointer}`} >ADD MORE</button>
                                              //         </div>
                                              //     </div>
                                              // )}

                                            }

                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Trial Period *</div>
                                        <div className={style.displayInRow}>
                                            <select
                                                name="class"
                                                id="Class"
                                                className={style.fourFieldWidth}
                                                value={trial?.period}
                                                onChange={(e)=>handleTrial('period',e.target.value)}>
                                                    <option value="7" >
                                                    7
                                                    </option>
                                            </select>
                                            <div className={`${style.extentionLableStyle} ${style.fourFieldWidth} ${style.marginLeft20}`}>Days</div>
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Trial Start Date</div>
                                        <div className={style.displayInRow}>
                                        <DateInput
                                            formatDate={date => date.toLocaleDateString()}
                                            parseDate={str => new Date(str)}
                                            placeholder={"MM-DD-YYYY"}
                                            value={trial?.startDate}
                                            onChange={(e)=> handleTrial('startDate', e)}
                                            rightElement={calendarIcon()}
                                        />
                                        <p className={style.toStyle}>To</p>
                                        <DateInput
                                            formatDate={date => date.toLocaleDateString()}
                                            parseDate={str => new Date(str)}
                                            placeholder={"MM-DD-YYYY"}
                                            value={trial?.endDate}
                                            onChange={(e)=> handleTrial('endDate', e)}
                                            minDate={trial?.startDate}
                                            rightElement={calendarIcon()}
                                        />
                                        </div>
                                    </div>
                                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                        <div className={style.extentionLableStyle}>Trial Contact Name</div>
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
                                </>
                            )}
                        </div>
                        <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                            <button className={style.outlinedButton} onClick={()=>updateBilling('saveInProgress')}>SAVE IN-PROGRESS</button>
                            <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>updateBilling('Continue')}>CONTINUE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
      </>
    )
}

export default AppSubscription;
