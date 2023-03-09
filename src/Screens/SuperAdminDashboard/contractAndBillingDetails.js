import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TextArea, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import SetupComplete from './setupComplete';
import { format } from 'date-fns';
import { DateInput } from "@blueprintjs/datetime";
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GET, TenantID, PUT, isSuperAdminAccess } from './../dataSaver';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step33.png';
import Step4 from './../../images/step3.png';
import Step5 from './../../images/step55.png';
import style from './index.module.scss';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import 'react-datalist-input/dist/styles.css';
import { Auth } from './../../utils/auth'
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import SaveInProgress from './saveInProgressAlert';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';


const ContractAndBillingDetails = ({ getActiveStep }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entityData, setEntityData] = useState();
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('AUTORENEWAL');
    const [isSetupComplete, setIsCompleteSetup] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [personName, setPersonName] = React.useState([]);
    const [plan, setPlan] = useState({
        planName: 'SILVER', allowableRegisteredUsers: 0, fees: "", subscriptionStatus: "ACTIVE", billingFrequency: "MONTHLY", discount: 0,
        poaNumber: ""
    });
    const [billingData, setBillingData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    // const [autoRenewal,setAutoRenewal] = useState({renewalTerm:'0',allowableRenewalTerm:'0',calendar:'WEEKS'});
    // const [renewalReminder,setRenewalreminder] = useState([{'days':0}]);
    const [contract, setContract] = useState(
        {
            contractName: "",
            contractID: "",
            missing: false,
            startDate: null,
            endDate: null,
            date: null,
            contractContinuationPolicy: "AUTORENEWAL",
        }
    );
    const [trial, setTrial] = useState({
        trialPeriod: 7,
        startDate: null,
        endDate: null
    })
    const [contractFiles, setContractFiles] = useState([{ type: '', name: '', desc: '', file: null, path: '' }])
    const Fields = { planName: 'Subscription Plan', allowableRegisteredUsers: 'Allowable Registered Users', fees: 'Monthly Subscription Fees', billingFrequency: 'Billing Frequency', discount: 'Discount', poaNumber: 'POA Number', firstName: 'First Name', lastName: 'Last Name', email: 'Email', phone: 'Cell Phone', contractName: 'Contract / Agreement Name', contractID: 'Contract ID', startDate: 'Contract Start Date', endDate: 'Contract End Date', date: 'Contract Effective Date', contractContinuationPolicy: 'Contract Continuation Policy' };
    const [showSaveInProgress, setShowSaveInProgress] = useState(false);
    const [unassignedKeys, setUnassignedKeys] = useState([]);


    const role = '';
    const accessToken = Auth();

    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ];

    useEffect(() => {
        if (id !== 'new') {
            getEntityData();
        }
    }, []);

    const getEntityData = async () => {
        const { data: data } = await GET(`entity-service/entity/${id}`);
        let subscription = data?.subscriptionPlan;
        let contractData = data?.contractDetails;
        setEntityData(data);
        setBillingData({ firstName: data?.billingDetails?.contactname?.firstName, lastName: data?.billingDetails?.contactname?.lastName, email: data?.billingDetails?.email?.emailId, phone: data?.billingDetails?.contactNumber?.contactNumber.toString() });
        setPlan({
            planName: subscription?.planName, allowableRegisteredUsers: subscription?.allowableRegisteredUsers?.allowableRegisteredUsers, fees: subscription?.subscriptionFees?.fees, subscriptionStatus: subscription?.subscriptionStatus, billingFrequency: subscription?.billingFrequency, discount: subscription?.discount?.discount || '0',
            poaNumber: subscription?.poaNumber?.poaNumber
        });
        if (contractData !== null) {
            setContract({
                contractName: contractData?.contractName,
                contractID: contractData?.contractID,
                missing: false,
                startDate: contractData?.contractTermPeriod?.startDate !== null ? new Date(contractData?.contractTermPeriod?.startDate) : null,
                endDate: contractData?.contractTermPeriod?.endDate !== null ? new Date(contractData?.contractTermPeriod?.endDate) : null,
                date: contractData?.plannedGoLive?.date !== null ? new Date(contractData?.plannedGoLive?.date) : null,
                contractContinuationPolicy: contractData?.contractContinuationPolicy,
            })
        }
    }

    const leftElement = () => {
        return (
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

    const percentRightElement = () => {
        return (
            <p className={`${style.marginTop7} ${style.marginRight20}`}>%</p>
        )
    }

    const dollarLeftElement = () => {
        return (
            <p className={`${style.marginTop7} ${style.marginLeft20}`}>$</p>
        )
    }

    const calendarIcon = () => {
        return (
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const mandatoryFieldCheck = (buttonType) => {
        if (billingData?.email === '') {
            ErrorToaster('Email is Mandatory');
            return;
        }
        if (!billingData?.email?.includes('@') || !billingData?.email?.includes('.')) {
            ErrorToaster('Enter Valid Email-Id');
            return;
        }
        if (buttonType === 'saveInProgress') {
            saveInProgressCheck();
        } else {
            updateBilling(buttonType);
        }
    }

    const saveInProgressCheck = () => {
        if (isSuperAdminAccess) {
            var keys = Object.keys(plan)?.filter(key => plan[key] === '' || plan[key] === 0 || plan[key] === undefined || plan[key] === null)?.map(data => Fields[data]);
            var billingKeys = Object.keys(billingData)?.filter(key => billingData[key] === '' || billingData[key] === 0 || billingData[key] === undefined || billingData[key] === null)?.map(data => Fields[data]);
            keys.push(...billingKeys);
            var contractKeys = Object.keys(contract)?.filter(key => contract[key] === '' || contract[key] === 0 || contract[key] === undefined || contract[key] === null)?.map(data => Fields[data]);
            keys.push(...contractKeys);
        } else {
            var keys = [];
            if (plan['poaNumber'] === '' || plan['poaNumber'] === undefined || plan['poaNumber'] === null) {
                keys.push('POA Number');
            }
            var billingKeys = Object.keys(billingData)?.filter(key => billingData[key] === '' || billingData[key] === 0 || billingData[key] === undefined || billingData[key] === null)?.map(data => Fields[data]);
            keys.push(...billingKeys);
        }
        setUnassignedKeys(keys);
        if (keys?.length !== 0) {
            setShowSaveInProgress(true);
        } else {
            updateBilling('saveInProgress');
        }
    }

    const saveInProgressFunction = () => {
        updateBilling('saveInProgress');
    }

    const updateBilling = async (type) => {
        let fileData = [];
        contractFiles?.map(data => {
            fileData.push({ "name": data?.name, "description": data?.desc, "contractDocType": data?.type, "contractDocPath": data?.path })
        })
        let data = {
            "id": entityData?.id,
            "entityName": entityData?.entityName,
            "entityType": entityData?.entityType,
            "entityDisplayId": entityData?.entityDisplayId,
            "industryId": entityData?.industryId,
            "sites": entityData?.sites,
            "subdomain": entityData?.subdomain,
            "multiSiteEntity": entityData?.multiSiteEntity,
            "canPrimarySiteToUseApp": entityData?.canPrimarySiteToUseApp,
            "accountManager": entityData?.accountManager,
            "appUserRoles": entityData?.appUserRoles,
            "logo": entityData?.logo,
            "logoThumbnail": entityData?.logoThumbnail,
            "subscriptionPlan": {
                "planName": plan?.planName || 'SILVER',
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
                "poaNumber": {
                    "poaNumber": plan?.poaNumber,
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
                    "startDate": contract?.startDate ? format(contract?.startDate, 'yyyy-MM-dd').toString() : null,
                    "endDate": contract?.endDate ? format(contract?.endDate, 'yyyy-MM-dd').toString() : null,
                },
                "plannedGoLive": {
                    "date": contract?.date ? format(contract?.date, 'yyyy-MM-dd').toString() : null,
                },
                "contractContinuationPolicy": contract?.contractContinuationPolicy,
                "fullyExecutedContractOnFile": fullyExecutedContract,
            }
        }
        await PUT('entity-service/entity', data)
            .then(response => {
                SuccessToaster('Entity Billing Updated Successfully');
            }).catch(error => {
                ErrorToaster('Unexpected Error Updating Entity Billing');
            });

        if (type === 'Continue') {
            setIsCompleteSetup(true);
        } else {
            navigate('/user');
        }
    }

    const handleBillingData = (name, value) => {
        setBillingData({ ...billingData, [name]: value });
        setIsUpdated(true);
    }

    const handleContract = (name, value) => {
        setContract({ ...contract, [name]: value });
        if (name === 'missing' && value === true) {
            setContract({ ...contract, 'contractID': '', 'missing': true });
        }
        if (name === 'contractID' && value !== '') {
            setContract({ ...contract, 'missing': false, 'contractID': value });
        }
        setIsUpdated(true);
    }

    const handleTrial = (name, value) => {
        setTrial({ ...trial, [name]: value });
        setIsUpdated(true);
    }

    const handleContractFiles = (name, value) => {
        setContract({ ...contract, [name]: value });
        setIsUpdated(true);
    }

    const getCompleteValue = (value) => {
        setIsCompleteSetup(value);
    }

    const getSaveInProgressAlert = (value) => {
        setShowSaveInProgress(value);
    }

    return (
        <>
            {isSetupComplete ? <SetupComplete data={plan?.planName === 'TRIAL' ? 'Trial' : 'Customer'} setCompleteValue={getCompleteValue} operation={isSuperAdminAccess ? 'Created' : 'Updated'} /> : <div className={style.entitySetupBackground}>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => navigate('/activeCustomers')} />
                <div className={style.stepperMargin}>
                    <div className={isSuperAdminAccess ? style.stepperGrid : style.stepperGrid4}>
                        <div onClick={() => getActiveStep('appSubscription')}>
                            <div className={style.justifyCenter}>
                                <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                                    <img src={Step5} alt="Step1" className={style.stepperImgStyle} />
                                </div>
                            </div>
                            <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SUBSCRIPTION PLAN</p>
                        </div>
                        <div onClick={() => getActiveStep('contractAndBilling')}>
                            <div className={style.justifyCenter}>
                                <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                                    <img src={Step3} alt="Step2" className={style.stepperImgStyle} />
                                </div>
                            </div>
                            <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>CONTRACT & BILLING</p>
                        </div>
                        <div onClick={() => getActiveStep('entitySetup')}>
                            <div className={style.justifyCenter}>
                                <div className={`${style.stepperImgBackground}`}>
                                    <img src={Step4} alt="Step3" className={style.stepperImgStyle} />
                                </div>
                            </div>
                            <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                        </div>
                        <div onClick={() => getActiveStep('siteInformation')}>
                            <div className={style.justifyCenter}>
                                <div className={`${style.stepperImgBackground}`}>
                                    <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                                </div>
                            </div>
                            <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                        </div>
                        {isSuperAdminAccess && (
                            <div onClick={() => getActiveStep('entitySystemAdmin')}>
                                <div className={style.justifyCenter}>
                                    <div className={`${style.stepperImgBackground}`}>
                                        <img src={Step2} alt="Step5" className={style.stepperImgStyle} />
                                    </div>
                                </div>
                                <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                            </div>
                        )}
                        {/*<div onClick={() => getActiveStep('siteUsers')}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                  <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>APP USERS</p>
            </div>
             <div onClick={() => getActiveStep('appSubscription')}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                  <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>APP SUBSCRIPTION</p>
            </div> */}
                    </div>
                    <div className={isSuperAdminAccess ? style.stepperDivider2 : style.stepperDivider5grid2}></div>
                </div>
                <div className={style.entitySetupCardStyle}>
                    <p className={style.heading}>Contract & Billing Details</p>
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
                                    <div className={style.extentionLableStyle}>Contract / Agreement Name*</div>
                                    <InputGroup className={style.fullWidth} value={contract?.contractName} placeholder="Text" disabled={!isSuperAdminAccess}
                                        onChange={(e) => handleContract('contractName', e.target.value)} />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Contract ID ( CID )*</div>
                                    <div className={style.displayInRow}>
                                        <InputGroup className={style.fourFieldWidth} value={contract?.contractID} disabled={!isSuperAdminAccess} placeholder="Contract Id"
                                            onChange={(e) => handleContract('contractID', e.target.value)} />
                                        <Checkbox label="Missing" checked={contract.missing} disabled={!isSuperAdminAccess} onChange={(e) => handleContract('missing', e.target.checked)} className={`${style.marginTop} ${style.marginLeft20}`} />
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>POA Number</div>
                                    <InputGroup className={style.fourFieldWidth} placeholder="POA Number" value={plan?.poaNumber}
                                        onChange={(e) => setPlan({ ...plan, poaNumber: e.target.value })} />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Billing Contact Name</div>
                                    <div className={style.displayInRow}>
                                        <InputGroup className={style.fourFieldWidth} value={billingData?.firstName} placeholder="First Name" onChange={(e) => handleBillingData('firstName', e.target.value)} />
                                        <InputGroup className={`${style.fourFieldWidth} ${style.marginLeft20}`} placeholder="Last Name" value={billingData?.lastName}
                                            onChange={(e) => handleBillingData('lastName', e.target.value)} />
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Email*</div>
                                    <InputGroup className={style.twoFieldWidth} value={billingData?.email} placeholder="example@gmail.com"
                                        onChange={(e) => handleBillingData('email', e.target.value)} />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Cell Phone</div>
                                    <InputGroup type="number" className={style.twoFieldWidth} value={billingData?.phone} placeholder="+1(342)444-5505"
                                        onChange={(e) => handleBillingData('phone', e.target.value)} />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Fully Executed Contract on File*</div>
                                    <div>
                                        <div className={style.spaceBetween}>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={fullyExecutedContract} className={` ${style.textAlignLeft}`} onChange={(e) => setFullyExecutedContract(!fullyExecutedContract)} />
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
                                                    <CommonSelectField className={`${style.fullWidth} `}
                                                        defaultValue={contractFiles?.type}
                                                        value={contractFiles?.type ? contractFiles?.type : '0'}
                                                        onChange={(e) => handleContractFiles('type', e.target.value)}
                                                        firstOptionLabel={'Select Type of Document'} firstOptionValue={'0'}
                                                        valueList={['Agreement']}
                                                        labelList={['Agreement']}
                                                        disabledList={[false]} />
                                                </div>
                                                <InputGroup className={`${style.fullWidth} ${style.marginTop10}`}
                                                    value={contractFiles?.name}
                                                    onChange={(e) => handleContractFiles('name', e.target.value)}
                                                />
                                                <TextArea rows={4} value={contractFiles?.desc} className={`${style.fullWidth} ${style.marginTop10}`}
                                                    onChange={(e) => handleContractFiles('desc', e.target.value)} />
                                                <div className={`${style.displayInRow} ${style.marginTop10} ${style.twoFieldWidth} ${style.floatRight}`}>
                                                    <InputGroup rightElement={leftElement()} className={`${style.marginLeft20} ${style.fullWidth}`} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Contract Term Period*</div>
                                    <div className={style.displayInRow}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={contract?.startDate}
                                                onChange={(newValue) => {
                                                    handleContract('startDate', newValue);
                                                }}
                                                InputProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        height: 30,
                                                    }
                                                }}
                                                disabled={!isSuperAdminAccess}
                                                renderInput={(params) => <TextField  {...params} />}
                                            />
                                        </LocalizationProvider>
                                        <p className={style.toStyle}>To</p>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={contract?.endDate}
                                                onChange={(newValue) => {
                                                    handleContract('endDate', newValue);
                                                }}
                                                minDate={contract?.startDate}
                                                InputProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        height: 30,
                                                    }
                                                }}
                                                disabled={!isSuperAdminAccess}
                                                renderInput={(params) => <TextField  {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Planned Go Live</div>
                                    <div className={style.displayInRow}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={contract?.date}
                                                onChange={(newValue) => {
                                                    handleContract('date', newValue);
                                                }}
                                                minDate={contract?.startDate}
                                                InputProps={{
                                                    style: {
                                                        fontSize: 14,
                                                        height: 30,
                                                    }
                                                }}
                                                disabled={!isSuperAdminAccess}
                                                renderInput={(params) => <TextField  {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Contract Continuation Policy*</div>
                                    <div>
                                        <div>
                                            <CommonSelectField className={`${style.fullWidth} `}
                                                defaultValue={contract?.contractContinuationPolicy}
                                                value={contract?.contractContinuationPolicy ? contract?.contractContinuationPolicy : '0'}
                                                onChange={(e) => handleContract('contractContinuationPolicy', e.target.value)}
                                                firstOptionLabel={'Select Value'} firstOptionValue={'0'}
                                                valueList={['AUTORENEWAL', "WRITTENCONTRACTEXTENSIONFORFIXEDTERM", "NEWCONTRACTONEXPIRATION", "ONETIMECONTRACTTERMINATEONEXPIRATION"]}
                                                labelList={['Auto Renewal', "Written Contract Extension For Fixed Term", "New Contract On Expiration", "One Time Contract - Terminate On Expiration"]}
                                                disabledList={[false, false, false, false]}
                                                disabledSelect={!isSuperAdminAccess} />
                                        </div>

                                        {contract?.contractContinuationPolicy === "AUTORENEWAL" && (
                                            <div className={`${style.renewalBoxStyle}`}>
                                                <div className={`${style.renewalBoxGrid}`}>
                                                    <div className={`${style.marginTop10} ${style.textAlignRight} ${style.marginRight20}`}>Auto Renewal Term*</div>
                                                    <div className={style.inputRenewalStyle} >4</div>
                                                    <select
                                                        name="class"
                                                        id="Class"
                                                        value={contract?.continuationPolicy || 'Select...'}
                                                        className={`${style.marginLeft20} ${style.weekSelectStyle}`}>
                                                        <option value="Select Value" >
                                                            Select Value
                                                        </option>
                                                        <option value="WEEKS" >
                                                            Weeks
                                                        </option>
                                                        <option value="MONTHS" >
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
                                        {(selectedContractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM"
                                            || selectedContractContinuationPolicy === "NEWCONTRACTONEXPIRATION"
                                            || selectedContractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION") && (
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
                                            )}

                                    </div>
                                </div>
                            </div>
                            <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                                <button className={style.outlinedButton} onClick={() => mandatoryFieldCheck('saveInProgress')}>SAVE IN-PROGRESS</button>
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => mandatoryFieldCheck('Continue')}>CONTINUE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <SaveInProgress alert={showSaveInProgress} getSaveInProgressAlert={getSaveInProgressAlert} fieldData={unassignedKeys?.join(', ')} saveInProgressFunction={saveInProgressFunction} />
        </>
    )
}

export default ContractAndBillingDetails;
