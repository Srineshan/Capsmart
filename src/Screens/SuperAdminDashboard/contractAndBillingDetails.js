import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TextArea, Checkbox, EditableText } from '@blueprintjs/core';
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
import InputAdornment from '@mui/material/InputAdornment';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import { Auth } from './../../utils/auth'
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import SaveInProgress from './saveInProgressAlert';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import { FormatPhoneNumber } from '../../utils/formatting';
import Table from '../../Components/TableDesign';


const TEXTFIELDLEN = 100;
const DESCLEN = 250;

const ContractAndBillingDetails = ({ getActiveStep }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [entityData, setEntityData] = useState();
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [selectedContract, setSelectedContract] = useState('Select...');
    const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
    const [fullyExecutedContractData, setFullyExecutedContractData] = useState([]);
    const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('AUTORENEWAL');
    const [isSetupComplete, setIsCompleteSetup] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [renewalReminder, setRenewalreminder] = useState([{ 'days': 0 }]);
    const [reminderFields, setReminderFields] = useState([]);
    const tableHeaderValues = ['DOCUMENT NAME', 'DOCUMENT TYPE', 'DOCUMENT DESCRIPTION', 'VIEW', 'DELETE'];
    const [fileFieldData, setFileFieldData] = useState({ id: '', type: '', name: '', desc: '', fileName: '', file: null, filePath: '' });

    const [plan, setPlan] = useState({
        planName: 'SILVER', allowableRegisteredUsers: 0, fees: "", subscriptionStatus: "ACTIVE", billingFrequency: "MONTHLY", discount: 0,
        poaNumber: ""
    });
    const [billingData, setBillingData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [autoRenewal, setAutoRenewal] = useState({ renewalTerm: '0', allowableRenewalTerm: '0', calendar: 'WEEKS' });
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
    const Fields = { planName: 'Subscription Plan', allowableRegisteredUsers: 'Allowable Registered Users', fees: 'Monthly Subscription Fees', billingFrequency: 'Billing Frequency', discount: 'Discount', poaNumber: 'POA Number', firstName: 'First Name', lastName: 'Last Name', email: 'Email', phone: 'Cell Phone', contractName: 'Contract / Agreement Name', contractID: 'Contract ID', startDate: 'Contract Start Date', endDate: 'Contract End Date', date: 'Contract Effective Date', contractContinuationPolicy: 'Contract Continuation Policy' };
    const [showSaveInProgress, setShowSaveInProgress] = useState(false);
    const [unassignedKeys, setUnassignedKeys] = useState([]);


    const role = '';
    const accessToken = Auth();

    useEffect(() => {
        if (id !== 'new') {
            getEntityData();
        }
    }, []);

    useEffect(() => {
        getReminder();
    }, [renewalReminder])

    const getEntityData = async () => {
        const { data: data } = await GET(`entity-service/entity/${id}`);
        let subscription = data?.subscriptionPlan;
        let contractData = data?.contractDetails;
        setEntityData(data);
        setBillingData({ firstName: data?.billingDetails?.contactname?.firstName, lastName: data?.billingDetails?.contactname?.lastName, email: data?.billingDetails?.email?.officialEmail, phone: data?.billingDetails?.contactNumber?.contactNumber });
        setPlan({
            planName: subscription?.planName, allowableRegisteredUsers: subscription?.allowableRegisteredUsers?.allowableRegisteredUsers, fees: subscription?.subscriptionFees?.fees, subscriptionStatus: subscription?.subscriptionStatus, billingFrequency: subscription?.billingFrequency, discount: subscription?.discount?.discount || '0',
            poaNumber: data?.contractDetails?.poaNumber?.poaNumber
        });
        handleContract('contractContinuationPolicy', data?.contractDetails?.contractContinuationPolicy?.contractPolicyType)
        setAutoRenewal({
            renewalTerm: data?.contractDetails?.contractContinuationPolicy?.autoRenewalPeriod?.autoRenewalTerm,
            allowableRenewalTerm: data?.contractDetails?.contractContinuationPolicy?.autoRenewalPeriod?.allowableAutoRenewalTerm,
            calendar: data?.contractDetails?.contractContinuationPolicy?.autoRenewalPeriod?.autoRenewalCalender
        })
        setRenewalreminder(data?.contractDetails?.contractContinuationPolicy?.reminderList?.renewalReminderList)
        setFullyExecutedContract(data?.contractDetails?.fullyExecutedContractOnFile);
        if (contractData !== null) {
            setContract({
                contractName: contractData?.contractName,
                contractID: contractData?.contractID,
                missing: false,
                startDate: contractData?.contractTermPeriod?.startDate !== null ? new Date(contractData?.contractTermPeriod?.startDate) : null,
                endDate: contractData?.contractTermPeriod?.endDate !== null ? new Date(contractData?.contractTermPeriod?.endDate) : null,
                date: contractData?.plannedGoLive?.date !== null ? new Date(contractData?.plannedGoLive?.date) : null,
                contractContinuationPolicy: contractData?.contractContinuationPolicy?.contractPolicyType !== null ? contractData?.contractContinuationPolicy?.contractPolicyType : "",
            })
        }
    }

    console.log(contract)



    const getReminder = () => {
        let temp = [];
        for (let i = 0; i < renewalReminder?.length; i++) {
            temp[i] = (
                <div className={`${style.renewalRemainderBoxGrid} ${style.marginBottom}`} key={`reminder${i}-${renewalReminder?.[i]?.days}`}>
                    <div className={style.verticalAlignCenter}>
                        Set Renewal Reminder*
                    </div>
                    {/* <div className={style.displayInRow}>
                <EditableText className={style.inputRenewalRemainderStyle} defaultValue={renewalReminder?.[i]?.days} placeholder="" onChange={(e) => handleReminder(e, i)} key={`days${i}${renewalReminder?.[i]?.days}`} />
                <div className={`${style.marginTop10} ${style.marginLeft20}`}>Days</div>
              </div> */}
                    <div className={style.renewalWidth}>
                        <CommonTextField
                            InputProps={{
                                endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                            }}
                            onChange={(e) => handleReminder(e, i)}
                            key={`days${i}${renewalReminder?.[i]?.days}`}
                            defaultValue={renewalReminder?.[i]?.days}
                        />
                    </div>
                    <div className={style.verticalAlignCenter}>
                        {renewalReminder?.length !== 1 && (
                            <Icon icon="cross" color="#a0a5ab" onClick={() => removeReminder(i)} />
                        )}
                    </div>
                </div>
            )
        }
        setReminderFields(temp);
    }

    const addReminder = () => {
        let temp = renewalReminder;
        temp.push({ 'days': 0 });
        setRenewalreminder(temp);
        getReminder();
    }

    const removeReminder = (index) => {
        setRenewalreminder(renewalReminder?.filter((data, indexValue) => index !== indexValue)?.map(data => data));
    }

    const handleReminder = (e, i) => {
        let temp = renewalReminder;
        temp[i] = { 'days': parseInt(e.target.value) };
        setRenewalreminder(temp);
    }

    const handleFileChange = (e, name) => {
        setFileFieldData({ ...fileFieldData, [name]: e.target.value });
    }

    const addNewDocumentField = () => {
        let temp = fullyExecutedContractData;
        temp.push(fileFieldData);
        // setFileFields(temp);
        setFullyExecutedContractData(temp);
        updateBilling('addDoc');
        setFileFieldData({ id: '', type: '', name: '', desc: '', fileName: '', file: null, filePath: '' });
    }

    console.log(fileFieldData, fullyExecutedContractData)

    const leftElement = () => {
        return (
            <div>
                <label for="file-upload" className={style.customFileUpload}>
                    Choose File
                </label>
                <input id="file-upload" type="file" accept="image/*, .pdf" onChange={(e) => handleFileUpload(e)} />
            </div>
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

    const changeContractFile = (value) => {
        if (fullyExecutedContractData?.length === 0 || value) {
            setFullyExecutedContract(value);
        }
    }

    const updateBilling = async (type, id) => {
        if (contract?.contractName === '') {
            ErrorToaster('Contract / Agreement Name Is Mandatory');
            return;
        }
        if (contract?.contractID === '') {
            ErrorToaster('Contract ID ( CID ) Is Mandatory');
            return;
        }
        if (billingData?.email === '') {
            ErrorToaster('Email Is Mandatory');
            return;
        }
        if (!billingData?.email?.includes('@') || !billingData?.email?.includes('.')) {
            ErrorToaster('Enter a Valid Email');
            return;
        }
        if (contract?.startDate === null || contract?.endDate === null) {
            ErrorToaster('Contract Term Period Is Mandatory ');
            return;
        }
        if (contract?.contractContinuationPolicy === '') {
            ErrorToaster('Continuation Policy Is Mandatory ');
            return;
        }
        let contractFiles = [];
        // if (type === 'addDoc') {
        contractFiles = entityData?.contractDetails !== null ? entityData?.contractDetails?.entityContractDocuments : [];
        // }
        if (type === 'removeDoc') {
            contractFiles = entityData?.contractDetails !== null ? entityData?.contractDetails?.entityContractDocuments?.filter(docData => id !== docData?.id)?.map(data => data) : [];
        }
        fullyExecutedContract && fullyExecutedContractData?.filter(data => data?.file !== null)?.map(data => {
            contractFiles?.push({
                documentType: data.type,
                documentDescription: data.desc,
                documentName: data.name,
                file: {
                    fileName: data.fileName,
                }
            })
        })
        let data = {
            "id": entityData?.id,
            "entityName": entityData?.entityName,
            "entityType": entityData?.entityType,
            "entityDisplayId": entityData?.entityDisplayId,
            "entityAbbrevation": entityData?.entityAbbrevation,
            "partnerId": entityData?.partnerId,
            "partner": entityData?.partner,
            "npin": entityData?.npin,
            "mailingAddress": entityData?.mailingAddress,
            "officialEmailDomain": entityData?.officialEmailDomain,
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
                "planName": entityData?.subscriptionPlan?.planName,
                "subscriptionFees": {
                    "fees": entityData?.subscriptionPlan?.subscriptionFees?.fees,
                },
                "subscriptionStatus": entityData?.subscriptionPlan?.subscriptionStatus,
                "billingFrequency": entityData?.subscriptionPlan?.billingFrequency,
                "discount": {
                    "discount": entityData?.subscriptionPlan?.discount?.discount
                },
                "plannedToGoLive": { date: contract?.date ? format(contract?.date, 'yyyy-MM-dd').toString() : null },
                "allowableSites": entityData?.subscriptionPlan?.allowableSites,
                "noOfSites": entityData?.subscriptionPlan?.noOfSites,
                "allowableRegisteredUsers": entityData?.subscriptionPlan?.allowableRegisteredUsers,
                "maximumNumberOfUsers": entityData?.subscriptionPlan?.maximumNumberOfUsers,
                "feedbackSupports": entityData?.subscriptionPlan?.feedbackSupports,
                "subscriptionFeeCriteria": entityData?.subscriptionPlan?.subscriptionFeeCriteria,
                "subscriptionDate": contract?.date ? format(contract?.date, 'yyyy-MM-dd').toString() : null
            },
            "billingDetails": {
                "contactname": {
                    "firstName": billingData?.firstName,
                    "lastName": billingData?.lastName,
                },
                "email": {
                    "officialEmail": billingData?.email
                },
                "contactNumber": {
                    "contactNumber": billingData?.phone
                }
            },
            "contractDetails": {
                "contractName": contract?.contractName,
                "contractID": contract?.contractID,
                "poaNumber": {
                    "poaNumber": plan?.poaNumber
                },
                "contractTermPeriod": {
                    "startDate": contract?.startDate ? format(contract?.startDate, 'yyyy-MM-dd').toString() : null,
                    "endDate": contract?.endDate ? format(contract?.endDate, 'yyyy-MM-dd').toString() : null,
                },
                "plannedGoLive": {
                    "date": contract?.date ? format(contract?.date, 'yyyy-MM-dd').toString() : null,
                },
                "contractContinuationPolicy": {
                    "contractPolicyType": contract?.contractContinuationPolicy,
                    "autoRenewalPeriod": {
                        ...(parseInt(autoRenewal.renewalTerm) && {
                            "autoRenewalTerm": contract?.contractContinuationPolicy === 'AUTORENEWAL' ? parseInt(autoRenewal.renewalTerm) : 0,
                        }),
                        ...(parseInt(autoRenewal.allowableRenewalTerm) && {
                            "allowableAutoRenewalTerm": contract?.contractContinuationPolicy === 'AUTORENEWAL' ? parseInt(autoRenewal.allowableRenewalTerm) : 0,
                        }),
                        ...(autoRenewal.calendar !== '' &&
                        {
                            "autoRenewalCalender": contract?.contractContinuationPolicy === 'AUTORENEWAL' ? autoRenewal.calendar : 'WEEKS'
                        })
                    },
                    "reminderList": {
                        "renewalReminderList": renewalReminder
                    }
                },
                "contractIdMissing": contract.missing,
                "entityContractDocuments": contractFiles,
                "fullyExecutedContractOnFile": fullyExecutedContract,
            },
            "logo": entityData?.logo,
            "logoThumbnail": entityData?.logoThumbnail,
            "accountType": "CONTRACTED",
            "hideWelcomeScreen": true,
        }

        const formData = new FormData();
        let file = fullyExecutedContractData?.map(data => data.file);
        formData.append('entity', new Blob([JSON.stringify(data)], {
            type: "application/json"
        }));
        file?.filter(data => data !== null)?.map(data => {
            formData.append('entitycontractFiles', data);
        })
        console.log(formData, data)
        await PUT('entity-service/entity', formData)
            .then(response => {
                SuccessToaster('Entity Billing Updated Successfully');
                setFullyExecutedContractData([]);
            }).catch(error => {
                ErrorToaster('Unexpected Error Updating Entity Billing');
                setFullyExecutedContractData([]);
            });
        if (type === 'addDoc' || type === 'removeDoc') {
            getEntityData();
            return;
        }
        if (type === 'Continue') {
            getActiveStep('entitySetup');
        } else {
            navigate('/user');
        }
    }

    const onClickFunction = (data) => {
        console.log(data);
        window.open(data?.file?.fileURL, "_blank");
    }

    const onClickDeleteFunction = (data) => {
        updateBilling('removeDoc', data?.id);
    }
    console.log(entityData)

    let documentName = [];
    let documentType = [];
    let documentDescription = [];
    let viewValue = [];
    let deleteValue = [];

    const getServiceProviderValues = () => {
        documentName = [];
        documentType = [];
        documentDescription = [];
        viewValue = [];
        deleteValue = [];

        entityData?.contractDetails?.entityContractDocuments?.map((data, index) => {
            documentName.push(data?.documentName || '-');
            documentType.push(data?.documentType || '-');
            documentDescription.push(data?.documentDescription || '-');
            viewValue.push('View');
            deleteValue.push('Delete');
        })

        return [
            { "type": "text", "value": documentName, "onClickFunction": () => { } },
            { "type": "text", "value": documentType, "onClickFunction": () => { } },
            { "type": "text", "value": documentDescription, "onClickFunction": () => { } },
            { "type": "text", "value": viewValue, "onClickFunction": onClickFunction },
            { "type": "text", "value": deleteValue, "onClickFunction": onClickDeleteFunction },
        ];
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

    const handleFileUpload = (e) => {
        setFileFieldData({ ...fileFieldData, file: e.target.files[0], fileName: e.target.files?.[0]?.name });
    }
    console.log(renewalReminder)
    return (
        <>
            {/* {isSetupComplete ? <SetupComplete data={plan?.planName === 'TRIAL' ? 'Trial' : 'Customer'} setCompleteValue={getCompleteValue} operation={isSuperAdminAccess ? 'Created' : 'Updated'} /> : */}
            <div className={style.entitySetupBackground}>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => isSuperAdminAccess ? navigate('/activeCustomers') : window.history.go(-1)} />
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
                        <div onClick={() => entityData?.multiSiteEntity && getActiveStep('siteInformation')} className={!entityData?.multiSiteEntity && style.disabledView}>
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
                    <div className={isSuperAdminAccess ? style.stepperDivider2 : style.stepperDivider2grid4}></div>
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
                                        <InputGroup className={style.fourFieldWidth} value={contract?.contractID} disabled={!isSuperAdminAccess || contract.missing} placeholder="Contract Id"
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
                                    <CommonInputField placeholder="Numeric" value={billingData?.phone} maxLength={15}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>+1</InputAdornment>,
                                            style: { fontSize: 15 }
                                        }}
                                        onChange={(e) => { handleBillingData('phone', FormatPhoneNumber(e.target.value)) }} className={`${style.twoFieldWidth}`} />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <CommonLabel value='Contract Documents On File*' />
                                    <div >
                                        <div className={`${style.spaceBetween}`}>
                                            <CommonSwitch checked={fullyExecutedContract} className={`${style.switchFontStyle} ${style.flexLeft}`}
                                                label={fullyExecutedContract ? 'YES' : "NO"}
                                                onChange={() => changeContractFile(entityData?.contractDetails?.entityContractDocuments?.length !== 0 ? true : !fullyExecutedContract)}
                                            />
                                        </div>
                                        {fullyExecutedContract && (
                                            <div>
                                                <div>
                                                    <CommonSelectField value={fileFieldData?.type || 'Select...'} onChange={(e) => handleFileChange(e, 'type')}
                                                        className={`${style.fullWidth}`} firstOptionLabel={'Select...'} firstOptionValue={'Select...'}
                                                        valueList={['AGREEMENTDRAFT', 'EXECUTEDDRAFT', 'APPENDIXADDENDUM', 'SCHEDULE', 'ATTACHMENT']}
                                                        labelList={['Agreement Draft', 'Executed Agreement', 'Appendix Addendum', 'Schedule', 'Attachment']}
                                                        disabledList={[false, false]} />
                                                </div>
                                                <CommonInputField className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name"
                                                    value={fileFieldData?.name}
                                                    maxLength={TEXTFIELDLEN}
                                                    onChange={(e) => handleFileChange(e, 'name')} />
                                                <TextArea rows={4} placeholder="Document Description" value={fileFieldData?.desc}
                                                    maxLength={DESCLEN} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileChange(e, 'desc')} />
                                                <div>
                                                    <CommonInputField value={fileFieldData?.fileName !== '' ? fileFieldData?.fileName : ''} leftElement={leftElement()} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileUpload(e)} />
                                                </div>
                                            </div>
                                        )}
                                        <div className={`${style.spaceBetween} ${style.marginTop}`}>
                                            <div></div>
                                            {fullyExecutedContract && (
                                                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${(fileFieldData?.type === '' || fileFieldData?.name === '' || fileFieldData?.file === null) && style.disabledUploadButton}`} disabled={fileFieldData?.type === '' || fileFieldData?.name === '' || fileFieldData?.file === null} onClick={() => { addNewDocumentField() }}>UPLOAD</button>
                                            )}
                                        </div>
                                        {entityData?.contractDetails?.entityContractDocuments?.length !== 0 && (
                                            <Table
                                                tableHeaderValues={tableHeaderValues}
                                                tableDataValues={getServiceProviderValues()}
                                                tableData={entityData?.contractDetails?.entityContractDocuments}
                                                gridStyle={style.documentTableGrid}
                                            />
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
                                                value={contract?.contractContinuationPolicy ? contract?.contractContinuationPolicy : ''}
                                                onChange={(e) => handleContract('contractContinuationPolicy', e.target.value)}
                                                firstOptionLabel={'Select Value'} firstOptionValue={''}
                                                valueList={['AUTORENEWAL', "WRITTENCONTRACTEXTENSIONFORFIXEDTERM", "NEWCONTRACTONEXPIRATION", "ONETIMECONTRACTTERMINATEONEXPIRATION"]}
                                                labelList={['Auto Renewal', "Written Contract Extension For Fixed Term", "New Contract On Expiration", "One Time Contract - Terminate On Expiration"]}
                                                disabledList={[false, false, false, false]}
                                                disabledSelect={!isSuperAdminAccess} />
                                        </div>

                                        {contract?.contractContinuationPolicy === "AUTORENEWAL" && (
                                            <div className={`${style.renewalBoxStyle}`}>
                                                <div className={`${style.renewalBoxGrid}`} >
                                                    <div className={style.marginTop}>Auto Renewal Term*</div>
                                                    <EditableText className={`${style.inputRenewalStyle}`} placeholder="" value={autoRenewal.renewalTerm} onChange={(e) => (e <= 52 && setAutoRenewal({ ...autoRenewal, renewalTerm: e, calendar: '' }))} type="tel" />
                                                    <CommonSelectField value={autoRenewal.calendar}
                                                        onChange={(e) => setAutoRenewal({ ...autoRenewal, calendar: e.target.value })}
                                                        className={`${style.marginLeft20} ${style.weekSelectStyle}`} firstOptionLabel={'Select Frequecy'} firstOptionValue={''}
                                                        valueList={['WEEKS', 'MONTHS']}
                                                        labelList={['Weeks', 'Months']}
                                                        disabledList={[false, autoRenewal?.renewalTerm > 12]} />
                                                </div>
                                                <div className={`${style.renewalBoxGrid}`}>
                                                    <div className={style.marginTop10}>Allowable Auto Renewal Terms*</div>
                                                    <EditableText className={`${style.inputRenewalStyle} ${style.marginTop10}`} placeholder="" value={autoRenewal.allowableRenewalTerm} onChange={(e) => (e <= 12 && setAutoRenewal({ ...autoRenewal, allowableRenewalTerm: e }))} type="tel" />
                                                </div>
                                            </div>
                                        )}
                                        {(contract?.contractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM"
                                            || contract?.contractContinuationPolicy === "NEWCONTRACTONEXPIRATION"
                                            || contract?.contractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION") && (
                                                <div className={`${style.renewalRemainderBoxStyle}`}>
                                                    {reminderFields}
                                                    <div className={`${style.renewalBoxGrid}`}>
                                                        {renewalReminder?.length <= 2 && (
                                                            <button className={`${style.addMoreButton} ${style.selectedColor} ${style.cursorPointer}`} onClick={addReminder}>ADD MORE</button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                    </div>
                                </div>
                            </div>
                            <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                                <button className={style.outlinedButton} onClick={() => saveInProgressCheck()}>SAVE IN-PROGRESS</button>
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => updateBilling('Continue')}>CONTINUE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* } */}
            <SaveInProgress alert={showSaveInProgress} getSaveInProgressAlert={getSaveInProgressAlert} fieldData={unassignedKeys?.join(', ')} saveInProgressFunction={saveInProgressFunction} />
        </>
    )
}

export default ContractAndBillingDetails;
