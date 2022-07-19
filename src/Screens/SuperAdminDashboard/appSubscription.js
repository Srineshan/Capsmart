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
import {Auth} from './../../utils/auth'


const VALUES = ['Department 1', "Department 2", "Department 3"];

const AppSubscription = ({getActiveStep}) => {
    const [tags, setTags] = useState(VALUES);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('Select Value');
    const [item, setItem] = useState();
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
    const [billing,setBilling] = useState({contactname: {firstName: '', lastName: ''}, email: {emailId: ''}, contactNumber: {contactNumber: 0}});
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

    const getEntityData = () => {
      const entity = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                  'X-tenantID' : '6242845f95690b3822cb96a5',
                  'Authorization': `Bearer ${accessToken}`}
        };
        fetch('http://ec2-184-72-207-241.compute-1.amazonaws.com:8000/entity-service/entity', entity)
        .then(response => response.json())
        .then(data => {
            if(data?.filter(data=>data.id === '6242845f95690b3822cb96a5')?.map(data=>{
                let subPlan = data.subscriptionPlan;
                let billingDetails = data.billingDetails;
                let contractDetails = data.contractDetails;
                // setPlan({...plan, name:subPlan?.planName,allowableUsers:subPlan?.allowableRegisteredUsers?.allowableRegisteredUsers,fees:subPlan?.subscriptionFees.fees,status:subPlan?.subscriptionStatus,freq:subPlan?.billingFrequency,discount:subPlan?.discount?.discount,liveData:subPlan?.plannedToGoLive?.date,poa:subPlan?.poaNumber.poaNumber});
                // setBilling({...billing, firstName:billingDetails?.contactname.firstName,lastName:billingDetails?.contactname?.lastName,email:billingDetails?.email.emailId,phone:billingDetails?.contactNumber?.contactNumber});
                // setContract({...contract, name:contractDetails?.contractName,id:contractDetails?.contractID,doc:contractDetails?.contractDocuments,start:contractDetails?.contractTermPeriod?.startDate,end:contractDetails?.contractTermPeriod?.endDate,live:contractDetails?.plannedGoLive,continuationPolicy:contractDetails?.contractContinuationPolicy,fullyExecutedContract:contractDetails?.fullyExecutedContractOnFile})
          }))
          return true;
        }
       )
    }

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
                                <InputGroup className={style.fourFieldWidth} value={plan?.allowableRegisteredUsers?.allowableRegisteredUsers}
                                onChange={(e) => setPlan({...plan, allowableRegisteredUsers: {allowableRegisteredUsers: e.target.value}})} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Monthly Subscription Fees*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={`${style.textFieldWidth} ${style.fourFieldWidth}`} value={`$ ${plan?.subscriptionFees?.fees}`} onChange={(e) => setPlan({...plan, subscriptionFees: {fees: e.target.value}})} />
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
                                <InputGroup className={style.fourFieldWidth} value={`${plan?.discount?.discount} %`}
                                onChange={(e) => setPlan({...plan, discount:{discount: e.target.value}})}
                                 />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>POA Number</div>
                                <InputGroup className={style.fourFieldWidth} value={plan?.poaNumber?.poaNumber}
                                 onChange={(e) => setPlan({...plan, poaNumber:{poaNumber: e.target.value}})} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Billing Contact Name</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.fourFieldWidth} value={billing?.contactname?.firstName} onChange={(e) => setBilling({...billing, contactname: {firstName: e.target.value}})} />
                                    <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={billing?.contactname?.lastName}
                                     onChange={(e) => setBilling({...billing, contactname: {lastName: e.target.value}})} />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Email*</div>
                                <InputGroup className={style.twoFieldWidth} value={billing?.email?.emailId}
                                 onChange={(e) => setBilling({...billing, email: {emailId: e.target.value}})} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Cell Phone</div>
                                <InputGroup className={style.twoFieldWidth} value={billing?.contactNumber?.contactNumber} 
                                 onChange={(e) => setBilling({...billing, contactNumber: {contactNumber: e.target.value}})} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                                <InputGroup className={style.fullWidth} value={contract?.contractName}
                                 onChange={(e) => setContract({...contract, contractName: e.target.value})} />
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Contract ID ( CID )*</div>
                                <div className={style.displayInRow}>
                                    <InputGroup className={style.fourFieldWidth} value={contract?.contractID}
                                    onChange={(e) => setContract({...contract, contractID: e.target.value})}  />
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
                                                <Switch checked={contract?.fullyExecutedContractOnFile} className={` ${style.textAlignLeft}`} onChange={() => setContract({...contract, fullyExecutedContractOnFile: !contract?.fullyExecutedContractOnFile})}  />
                                            }
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
                                    onChange={(e) => setContract({...contract, contractTermPeriod: {startDate: e.target.value}})} />
                                <p className={style.toStyle}>To</p>
                                    <InputGroup value={contract?.contractTermPeriod?.endDate} rightElement={calendarIcon()}
                                    onChange={(e) => setContract({...contract, contractTermPeriod:{endDate: e.target.value}})}  />
                                </div>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Planned Go Live</div>
                                <div className={style.displayInRow}>
                                    <InputGroup value={contract?.plannedGoLive?.date} rightElement={calendarIcon()}
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
