import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TextArea, Checkbox, NumericInput } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import SetupComplete from './setupComplete';
import { format } from 'date-fns';
import { DateInput } from "@blueprintjs/datetime";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GET, TenantID, POST, PUT, isSuperAdminAccess } from './../dataSaver';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step3.png';
import Step4 from './../../images/step45.png';
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
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import InputAdornment from "@mui/material/InputAdornment";


const AppSubscription = ({ getActiveStep }) => {
  const { id, page } = useParams();
  const navigate = useNavigate();
  const [entityData, setEntityData] = useState();
  const [departmentSpecific, setDepartmentSpecific] = useState(true);
  const [selectDepartment, setSelectDepartment] = useState('');
  const [selectedContract, setSelectedContract] = useState('Select...');
  const [fullyExecutedContract, setFullyExecutedContract] = useState(false);
  const [selectedContractContinuationPolicy, setSelectedContractContinuationPolicy] = useState('AUTORENEWAL');
  const [isSetupComplete, setIsCompleteSetup] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [entityName, setEntityName] = useState('');
  const [entityAbbreviation, setEntityAbbreviation] = useState('');
  const [personName, setPersonName] = React.useState([]);
  const [partners, setPartners] = useState([]);
  let selectedPartnerId = sessionStorage.getItem('selectedPartner');
  const [selectedPartner, setSelectedPartner] = useState();
  const [plan, setPlan] = useState({
    planName: 'SILVER', allowableRegisteredUsers: "", maximumNumberOfUsers: 0, allowableSites: "", noOfSites: 0, feedbackSupport: [], fees: "", subscriptionStatus: "ACTIVE", billingFrequency: "MONTHLY", discount: 0,
    subscriptionFeeCriteria: 'PER_ACTIVE_USER_END_OF_MONTH'
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
  const Fields = { planName: 'Subscription Plan', allowableRegisteredUsers: 'Allowable Registered Users', fees: 'Subscription Fees', billingFrequency: 'Billing Frequency', discount: 'Agreed To Discount', maximumNumberOfUsers: 'Maximum Number Of Users', allowableSites: 'Allowable Sites', noOfSites: 'No Of Sites', feedbackSupport: 'Feedback Support', subscriptionFeeCriteria: 'Subscription Fee Criteria', contractName: 'Contract / Agreement Name', contractID: 'Contract ID', startDate: 'Contract Start Date', endDate: 'Contract End Date', date: 'Contract Effective Date', contractContinuationPolicy: 'Contract Continuation Policy' };
  const [showSaveInProgress, setShowSaveInProgress] = useState(false);
  const [unassignedKeys, setUnassignedKeys] = useState([]);
  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const exceptThisSymbolsForString = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "+", "="];

  const role = '';
  const accessToken = Auth();

  const feedbackSupportValues = [
    'EMAIL',
    'LIVE_CHAT'
  ];

  useEffect(() => {
    if (id !== 'new') {
      getEntityData();
    }
    getPartners();
  }, []);

  const getPartners = async () => {
    const { data: partners } = await GET(`entity-service/partners`);
    setPartners(partners);
    setSelectedPartner(partners?.filter(data => data?.partnerId?.id === selectedPartnerId)?.map(data => data)[0]);
    console.log(partners?.filter(data => data?.partnerId?.id === selectedPartnerId)?.map(data => data)[0])
  };

  const getEntityData = async () => {
    const { data: data } = await GET(`entity-service/entity/${id}`);
    let subscription = data?.subscriptionPlan;
    let contractData = data?.contractDetails;
    setEntityData(data);
    setBillingData({ firstName: data?.billingDetails?.contactname?.firstName, lastName: data?.billingDetails?.contactname?.lastName, email: data?.billingDetails?.email?.emailId, phone: data?.billingDetails?.contactNumber?.contactNumber });
    setPlan({
      planName: subscription?.planName, fees: subscription?.subscriptionFees?.fees, subscriptionStatus: subscription?.subscriptionStatus, billingFrequency: subscription?.billingFrequency, discount: subscription?.discount?.discount || '0',
      allowableRegisteredUsers: subscription?.allowableRegisteredUsers, maximumNumberOfUsers: subscription?.maximumNumberOfUsers, allowableSites: subscription?.allowableSites, noOfSites: subscription?.noOfSites, feedbackSupport: subscription?.feedbackSupports || [], subscriptionFeeCriteria: subscription?.subscriptionFeeCriteria
    });
    setEntityName(data?.entityName?.entityName);
    setEntityAbbreviation(data?.entityAbbrevation?.abbreviation);
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
    setPlan({ ...plan, feedbackSupport: typeof value === 'string' ? value.split(',') : value })
  };

  console.log(plan)

  const mandatoryFieldCheck = (buttonType) => {
    if (entityName === '') {
      ErrorToaster('Entity Name is Mandatory');
      return;
    }
    if (entityAbbreviation === '' && buttonType !== 'saveInProgress') {
      ErrorToaster('Entity Abbreviation is Mandatory');
      return;
    }
    if (buttonType === 'saveInProgress') {
      saveInProgressCheck();
    } else {
      updateBilling(buttonType);
    }
  }

  const saveInProgressCheck = () => {
    var keys = Object.keys(plan)?.filter(key => (plan[key] === '' || plan[key] === 0 || plan[key] === '0' || plan[key] === undefined || plan[key] === null) && key !== 'maximumNumberOfUsers' && key !== 'noOfSites')?.map(data => Fields[data]);
    if (entityName === '' || entityName === undefined || entityName === null) {
      keys.push('Entity Name')
    }
    if (entityAbbreviation === '' || entityAbbreviation === undefined || entityAbbreviation === null) {
      keys.push('Entity Abbreviation')
    }
    if ((plan?.allowableSites === 'MULTIPLE') && (plan?.noOfSites === 0 || plan?.noOfSites === '0')) {
      keys.push('Number Of Sites');
    }
    if ((plan?.allowableRegisteredUsers === 'LIMITED') && (plan?.maximumNumberOfUsers === 0 || plan?.maximumNumberOfUsers === '0')) {
      keys.push('Maximum Number Of Users');
    }
    if (plan?.feedbackSupport?.length === 0) {
      keys.push('Feedback Support')
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
    console.log(plan)
    if (type !== 'saveInProgress') {
      if (entityName === '') {
        ErrorToaster('Contracting Entity Name Is Mandatory');
        return;
      }
      if (entityAbbreviation === '') {
        ErrorToaster('Entity Abbreviation Is Mandatory');
        return;
      }
      if (plan?.planName === '' || plan?.allowableSites === '' || plan?.allowableRegisteredUsers === '' || plan?.feedbackSupport?.length === 0) {
        ErrorToaster('Subscription Plan Details Are Mandatory');
        return;
      }
      if ((plan?.allowableSites === 'MULTIPLE') && (plan?.noOfSites === 0 || plan?.noOfSites === '0')) {
        ErrorToaster('Number of Sites Is Mandatory if Multiple');
        return;
      }
      if ((plan?.allowableRegisteredUsers === 'LIMITED') && (plan?.maximumNumberOfUsers === 0 || plan?.maximumNumberOfUsers === '0')) {
        ErrorToaster('Maximum Number Of Users Is Mandatory if Limited');
        return;
      }
      if (plan?.subscriptionFeeCriteria === '') {
        ErrorToaster('Subscription Fee Criteria Is Mandatory');
        return;
      }
      if (plan?.billingFrequency === '') {
        ErrorToaster('Billing Frequency Is Mandatory');
        return;
      }
      if (plan?.fees === '') {
        ErrorToaster('Subscription Fees Is Mandatory');
        return;
      }
    }
    let fileData = [];
    contractFiles?.map(data => {
      fileData.push({ "name": data?.name, "description": data?.desc, "contractDocType": data?.type, "contractDocPath": data?.path })
    })
    let data = {
      ...(id !== 'new' && { 'id': entityData?.id }),
      "entityName": entityName,
      "entityType": entityData?.entityType,
      "entityDisplayId": entityData?.entityDisplayId,
      "entityAbbrevation": entityAbbreviation,
      ...(id !== 'new' && { "partnerId": entityData?.partnerId }),
      ...(id !== 'new' && { "partner": entityData?.partner }),
      ...(id === 'new' && { "partnerId": selectedPartner?.partnerId?.id }),
      ...(id === 'new' && {
        "partner": {
          "partnerId": {
            id: selectedPartner?.partnerId?.id
          },
          "partnerName": selectedPartner?.partnerName
        }
      }),
      "npin": entityData?.npin,
      "mailingAddress": entityData?.mailingAddress,
      "officialEmailDomain": entityData?.officialEmailDomain,
      "industryId": entityData?.industryId,
      "sites": entityData?.sites,
      "subdomain": entityData?.subdomain,
      "multiSiteEntity": plan?.allowableSites === 'MULTIPLE' ? true : false,
      "canPrimarySiteToUseApp": entityData?.canPrimarySiteToUseApp,
      "accountManager": entityData?.accountManager,
      "appUserRoles": entityData?.appUserRoles,
      "logo": entityData?.logo,
      "logoThumbnail": entityData?.logoThumbnail,
      "subscriptionPlan": {
        "planName": plan?.planName || 'SILVER',
        "subscriptionFees": {
          "fees": plan?.fees,
        },
        "subscriptionStatus": plan?.subscriptionStatus || 'ACTIVE',
        "billingFrequency": plan?.billingFrequency || 'MONTHLY',
        "discount": {
          "discount": plan?.discount
        },
        "plannedToGoLive": entityData?.subscriptionPlan?.plannedToGoLive,
        ...(plan?.allowableSites !== '' && { "allowableSites": plan?.allowableSites }),
        "noOfSites": plan?.noOfSites,
        ...(plan?.allowableRegisteredUsers !== '' && { "allowableRegisteredUsers": plan?.allowableRegisteredUsers }),
        "maximumNumberOfUsers": plan?.allowableRegisteredUsers === 'UNLIMITED' ? 0 : plan?.maximumNumberOfUsers,
        "feedbackSupports": plan?.feedbackSupport,
        "subscriptionFeeCriteria": plan?.subscriptionFeeCriteria,
        "subscriptionDate": entityData?.subscriptionPlan?.plannedToGoLive?.date
      },
      "billingDetails": entityData?.billingDetails,
      "contractDetails": entityData?.contractDetails,
      "accountType": "CONTRACTED",
      "hideWelcomeScreen": true,
    }
    const formData = new FormData();
    formData.append('entity', new Blob([JSON.stringify(data)], {
      type: "application/json"
    }));
    if (id !== 'new') {
      await PUT('entity-service/entity', formData)
        .then(response => {
          SuccessToaster('Entity Subscription Updated Successfully');
          if (type === 'Continue') {
            navigate(`/entitySetup/${id}/contractAndBilling`);
          } else {
            navigate(isSuperAdminAccess ? '/activeCustomers' : '/entitySitePortal');
          }
        }).catch(error => {
          ErrorToaster('Unexpected Error Updating Entity Subscription');
        });
    } else {
      await POST('entity-service/entity', formData)
        .then(response => {
          SuccessToaster('Entity Subscription Added Successfully');
          let newEntityId = response?.data?.id;
          if (type === 'Continue') {
            window.location = `/app/entitySetup/${newEntityId}/contractAndBilling`
            navigate(`/entitySetup/${newEntityId}/contractAndBilling`);
          } else {
            navigate(isSuperAdminAccess ? '/activeCustomers' : '/entitySitePortal');
          }
        }).catch(error => {
          ErrorToaster('Unexpected Error Adding Entity Subscription');
        });
    }
    console.log(data)
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

  const handleDecimalsOnValue = (value) => {
    const regex = /([0-9]*[\.|\,]{0,1}[0-9]{0,2})/s;
    return value.match(regex)[0];
  }

  return (
    <>
      {isSetupComplete ? <SetupComplete data={plan?.planName === 'TRIAL' ? 'Trial' : 'Customer'} setCompleteValue={getCompleteValue} operation={isSuperAdminAccess ? 'Created' : 'Updated'} isSuperAdminAccess={isSuperAdminAccess} /> : <div className={style.entitySetupBackground}>
        <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => isSuperAdminAccess ? navigate('/activeCustomers') : navigate('/entitySitePortal')} />
        <div className={style.stepperMargin}>
          <div className={isSuperAdminAccess ? style.stepperGrid : style.stepperGrid4}>
            <div onClick={() => id !== 'new' && navigate(`/entitySetup/${id}/appSubscription`)} className={id === 'new' && style.disabledView}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                  <img src={Step5} alt="Step1" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SUBSCRIPTION PLAN</p>
            </div>
            <div onClick={() => id !== 'new' && navigate(`/entitySetup/${id}/contractAndBilling`)} className={id === 'new' && style.disabledView}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground}`}>
                  <img src={Step3} alt="Step2" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>CONTRACT & BILLING</p>
            </div>
            <div onClick={() => id !== 'new' && navigate(`/entitySetup/${id}/entitySetup`)} className={id === 'new' && style.disabledView}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground}`}>
                  <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
            </div>
            <div onClick={() => (id !== 'new' && entityData?.multiSiteEntity) && navigate(`/entitySetup/${id}/siteInformation`)} className={(!entityData?.multiSiteEntity || id === 'new') && style.disabledView}>
              <div className={style.justifyCenter}>
                <div className={`${style.stepperImgBackground}`}>
                  <img src={Step3} alt="Step4" className={style.stepperImgStyle} />
                </div>
              </div>
              <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
            </div>
            {isSuperAdminAccess && (
              <div onClick={() => id !== 'new' && navigate(`/entitySetup/${id}/entitySystemAdmin`)} className={id === 'new' && style.disabledView}>
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
          <div className={isSuperAdminAccess ? style.stepperDivider : style.stepperDivider}></div>
        </div>
        <div className={style.entitySetupCardStyle}>
          <p className={style.heading}>App Subscription Information</p>
          <div className={style.greyBorder}></div>
          <div className={style.entityDescription}>
            Review the contract with the customer and provide the information indicated below. All data fields marked with an "*" are mandatory.
            If you do not have all of the information, you can save this customer's information as an In-progress account.
          </div>
          <div>
            <div className={style.cloneBlockStyle}>
              <div className={`${style.newContractFromCloneBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                  <div className={style.extentionLableStyle}>Contracting Entity Name*</div>
                  <InputGroup className={style.twoFieldWidth} placeholder="Entity Name" value={entityName}
                    onKeyDown={e => exceptThisSymbolsForString.includes(e.key) && e.preventDefault()}
                    onChange={(e) => setEntityName(e.target.value.slice(0, 50))} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Entity Abbreviation*</div>
                  <InputGroup className={style.twoFieldWidth} placeholder="Entity Abbreviation" value={entityAbbreviation} onChange={(e) => setEntityAbbreviation(e.target.value.slice(0, 10).toUpperCase())} />
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div className={style.extentionLableStyle}>Subscription Plan *</div>
                  <div className={`${style.leftAlign} ${style.displayInRow} ${style.verticalAlignCenter}`}>
                    <CommonSelectField className={`${style.fullWidth} `}
                      defaultValue={plan?.planName}
                      value={plan?.planName ? plan?.planName : ''}
                      onChange={(e) => setPlan({ ...plan, planName: e.target.value })}
                      firstOptionLabel={'Select the account type you want to create'} firstOptionValue={''}
                      valueList={['SILVER', "BRONZE", "GOLD", "CUSTOM"]}
                      labelList={['Silver', "Bronze", "Gold", "Custom"]}
                      disabledList={[false, false, false, false]} />
                    {/* <button className={`${style.pricingButton} ${style.selectedColor} ${style.cursorPointer}`} >PRICING REVIEW</button> */}
                  </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                  <div></div>
                  <div className={`${style.subscriptionRow} ${style.verticalAlignCenter}`}>

                    <div className={style.extentionLableStyle}>Allowable Sites*</div>
                    <CommonSelectField className={`${style.fullWidth} `}
                      defaultValue={plan?.allowableSites}
                      value={plan?.allowableSites ? plan?.allowableSites : ''}
                      onChange={(e) => setPlan({ ...plan, allowableSites: e.target.value, noOfSites: 0 })}
                      firstOptionLabel={'Select Allowable Sites'} firstOptionValue={''}
                      valueList={['SINGLE', "MULTIPLE"]}
                      labelList={['Single', "Multiple"]}
                      disabledList={[false, false]} />
                    <div className={`${style.extentionLableStyle} ${style.marginLeft50}`}>Number Of Sites*</div>
                    <InputGroup className={style.fullWidth} value={(plan?.noOfSites === 0 || plan?.noOfSites === '0') ? '' : plan?.noOfSites} disabled={plan?.allowableSites === 'SINGLE'} onChange={(e) => setPlan({ ...plan, noOfSites: e.target.value.slice(0, 3) })} />
                  </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                  <div></div>
                  <div className={`${style.subscriptionRow} ${style.verticalAlignCenter}`}>

                    <div className={style.extentionLableStyle}>Allowable Registered Users*</div>
                    <CommonSelectField className={`${style.fullWidth} `}
                      defaultValue={plan?.allowableRegisteredUsers}
                      value={plan?.allowableRegisteredUsers ? plan?.allowableRegisteredUsers : ''}
                      onChange={(e) => setPlan({ ...plan, allowableRegisteredUsers: e.target.value, maximumNumberOfUsers: 0 })}
                      firstOptionLabel={'Select Allowable Registered Users'} firstOptionValue={''}
                      valueList={['LIMITED', "UNLIMITED"]}
                      labelList={['Limited', "Unlimited"]}
                      disabledList={[false, false]} />
                    <div className={`${style.extentionLableStyle} ${style.marginLeft50}`}>Maximum Number Of Users*</div>
                    <InputGroup type='number' className={style.fullWidth} disabled={plan?.allowableRegisteredUsers === 'UNLIMITED'} value={(plan?.maximumNumberOfUsers === 0 || plan?.maximumNumberOfUsers === '0') ? '' : plan?.maximumNumberOfUsers} onChange={(e) => setPlan({ ...plan, maximumNumberOfUsers: e.target.value.slice(0, 3) })} />
                  </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                  <div></div>
                  <div className={`${style.feedbackSupport} ${style.verticalAlignCenter}`}>

                    <div className={style.extentionLableStyle}>Feedback Support*</div>
                    <FormControl size="small">
                      <InputLabel id="demo-multiple-chip-label">Select Feedback Support</InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={plan?.feedbackSupport}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Select Feedback Support" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value === 'EMAIL' ? 'Email' : value === 'LIVE_CHAT' ? 'Live Chat' : ''} />
                            ))}
                          </Box>
                        )}
                      >
                        {feedbackSupportValues?.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                          >
                            {name === 'EMAIL' ? 'Email' : name === 'LIVE_CHAT' ? 'Live Chat' : ''}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                {plan?.planName !== "TRIAL" ? (
                  <>
                    {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Allowable Registered Users *</div>
                      <InputGroup className={style.fourFieldWidth}
                        type="number"
                        disabled={!isSuperAdminAccess}
                        value={plan?.allowableRegisteredUsers}
                        onChange={(e) => setPlan({ ...plan, allowableRegisteredUsers: e.target.value })} />
                    </div> */}
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Subscription Fee Criteria*</div>
                      <div className={`${style.leftAlign} `}>
                        <CommonSelectField className={`${style.twoFieldWidth} `}
                          defaultValue={plan?.subscriptionFeeCriteria}
                          value={plan?.subscriptionFeeCriteria ? plan?.subscriptionFeeCriteria : ''}
                          onChange={(e) => setPlan({ ...plan, subscriptionFeeCriteria: e.target.value })}
                          firstOptionLabel={'Select Subscription Fee Criteria'} firstOptionValue={''}
                          valueList={['PER_ACTIVE_USER_END_OF_MONTH', "FIX_MONTHLY_FEE"]}
                          labelList={['Per Active User End Of Month', "Fixed Monthly Fee"]}
                          disabledList={[false, false]} />
                      </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Billing Frequency *</div>
                      <div className={`${style.leftAlign} `}>
                        <CommonSelectField className={`${style.fourFieldWidth} `}
                          defaultValue={plan?.billingFrequency}
                          value={plan?.billingFrequency ? plan?.billingFrequency : ''}
                          onChange={(e) => setPlan({ ...plan, billingFrequency: e.target.value })}
                          firstOptionLabel={'Select Billing Frequency'} firstOptionValue={''}
                          valueList={['MONTHLY', "QUARTERLY", "ANNUALY"]}
                          labelList={['Monthly', "Quarterly", "Annually"]}
                          disabledSelect={!isSuperAdminAccess}
                          disabledList={[false, false, false]} />
                      </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Subscription Fees*</div>
                      <div className={style.displayInRow}>
                        {/* <InputGroup className={`${style.textFieldWidth} ${style.fourFieldWidth}`}
                          value={plan?.fees}
                          type="text"
                          leftElement={dollarLeftElement()}
                          disabled={!isSuperAdminAccess}
                          onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                          onChange={(e) => setPlan({ ...plan, fees: parseFloat(e.target.value.slice(0, 7)) })}
                        /> */}
                        <CommonTextField
                          type="number"
                          InputProps={{
                            startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                          }}
                          value={plan?.fees}
                          disabled={!isSuperAdminAccess}
                          onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                          onChange={(e) => setPlan({ ...plan, fees: handleDecimalsOnValue(e.target.value.slice(0, 7)) })}
                        />
                        < div className={`${style.extentionLableStyle} ${style.fourFieldWidth} ${style.marginLeft20} ${style.verticalAlignCenter}`
                        }>Monthly Per User</div>
                      </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Agreed To Discount*</div>
                      {/* <InputGroup className={style.fourFieldWidth}
                        value={plan?.discount}
                        rightElement={percentRightElement()}
                        onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()} disabled={!isSuperAdminAccess}
                        onChange={(e) => e.target.value >= 0 && e.target.value <= 100 && setPlan({ ...plan, discount: e.target.value })}
                      /> */}
                      <CommonTextField
                        className={style.fourFieldWidth}
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end" sx={{ fontSize: 10 }}>
                              %
                            </InputAdornment>
                          ),
                        }}
                        value={plan?.discount}
                        disabled={!isSuperAdminAccess}
                        onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                        onChange={(e) => e.target.value >= 0 && e.target.value <= 100 && setPlan({ ...plan, discount: handleDecimalsOnValue(e.target.value) })}
                      />
                    </div>
                    {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
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
                    </div> */}
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      {/* <div className={style.extentionLableStyle}>Contract Continuation Policy*</div> */}
                      <div>
                        {/* <div>
                          <CommonSelectField className={`${style.fullWidth} `}
                            defaultValue={contract?.contractContinuationPolicy}
                            value={contract?.contractContinuationPolicy ? contract?.contractContinuationPolicy : '0'}
                            onChange={(e) => handleContract('contractContinuationPolicy', e.target.value)}
                            firstOptionLabel={'Select Value'} firstOptionValue={'0'}
                            valueList={['AUTORENEWAL', "WRITTENCONTRACTEXTENSIONFORFIXEDTERM", "NEWCONTRACTONEXPIRATION", "ONETIMECONTRACTTERMINATEONEXPIRATION"]}
                            labelList={['Auto Renewal', "Written Contract Extension For Fixed Term", "New Contract On Expiration", "One Time Contract - Terminate On Expiration"]}
                            disabledList={[false, false, false, false]}
                            disabledSelect={!isSuperAdminAccess} />
                        </div> */}
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
                          onChange={(e) => handleTrial('period', e.target.value)}>
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
                        {/* <DateInput
                                            formatDate={date => date.toLocaleDateString()}
                                            parseDate={str => new Date(str)}
                                            placeholder={"MM-DD-YYYY"}
                                            value={trial?.startDate}
                                            onChange={(e)=> handleTrial('startDate', e)}
                                            rightElement={calendarIcon()}
                                        /> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={trial?.startDate}
                            onChange={(newValue) => {
                              handleTrial('startDate', newValue);
                            }}
                            InputProps={{
                              style: {
                                fontSize: 14,
                                height: 30,
                              }
                            }}
                            renderInput={(params) => <TextField  {...params} />}
                          />
                        </LocalizationProvider>
                        <p className={style.toStyle}>To</p>
                        {/* <DateInput
                                            formatDate={date => date.toLocaleDateString()}
                                            parseDate={str => new Date(str)}
                                            placeholder={"MM-DD-YYYY"}
                                            value={trial?.endDate}
                                            onChange={(e)=> handleTrial('endDate', e)}
                                            minDate={trial?.startDate}
                                            rightElement={calendarIcon()}
                                        /> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            value={trial?.endDate}
                            onChange={(newValue) => {
                              handleTrial('endDate', newValue);
                            }}
                            minDate={trial?.startDate}
                            InputProps={{
                              style: {
                                fontSize: 14,
                                height: 30,
                              }
                            }}
                            renderInput={(params) => <TextField  {...params} />}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Trial Contact Name</div>
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
                      <InputGroup className={style.twoFieldWidth} value={billingData?.phone} placeholder="+1(342)444-5505"
                        onChange={(e) => handleBillingData('phone', e.target.value)} />
                    </div>
                  </>
                )}
              </div>
              <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                <button className={style.outlinedButton} onClick={() => mandatoryFieldCheck('saveInProgress')}>SAVE IN-PROGRESS</button>
                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => mandatoryFieldCheck('Continue')}>CONTINUE</button>
              </div>
            </div>
          </div>
        </div>
      </div >}
      <SaveInProgress alert={showSaveInProgress} getSaveInProgressAlert={getSaveInProgressAlert} fieldData={unassignedKeys?.join(', ')} saveInProgressFunction={saveInProgressFunction} />
    </>
  )
}

export default AppSubscription;
