import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import { POST, GET, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import { EmailValidator, FormatPhoneNumber, EmptyStringCheck, PhoneValidator } from './../../utils/formatting';
import CommonInputField from '../../Components/CommonFields/CommonInputField';

import style from './index.module.scss';

const switchTheme = createTheme({
  palette: {
    primary: {
      main: '#7165E3',
    },
  },
});


const ContractorBusinessEntity = ({ getViewPage5, getCurrentPage, selectContractInfo, contractId, contractName, checkFieldAndPopAlert, getShowAlert, isEditable, getTabDataStatus }) => {
  const [isUserUpdated, setIsUserUpdated] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sameAsContractor, setSameAsContractor] = useState(false);
  const [contractUser, setContractUser] = useState();
  const [allowBEM, setAllowBEM] = useState(false);
  const [keepConfidential, setKeepConfidential] = useState(false);
  const [contractorNPIN, setContractorNPIN] = useState({
    notApplicable: false,
    npin: "",
    missing: false
  });
  const [contractorEntityTaxId, setContractorEntityTaxId] = useState({
    taxId: "",
    missing: false,
    notApplicable: false,
  });
  const [businessEntity, setBusinessEntity] = useState({
    name: ''
  });
  const [businessEntityUser, setBusinessEntityUser] = useState({
    name: {
      firstName: "",
      lastName: "",
      suffix: {}
    },
    email: {
      officialEmail: ""
    },
    contactNumber: {
      number: 0,
      missing: false
    }
  });
  const [roles, setRoles] = useState([]);
  const [mailingAddress, setMailingAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    zipcode: ""
  });
  const [appRoleRequired, setAppRoleRequired] = useState(true);
  const [contractorBusinessEntity, setContractorBusinessEntity] = useState({});
  const [userId, setUserId] = useState('0');
  const [showAlert, setShowAlert] = useState(false);
  const [allowAggregator, setAllowAggregator] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    getUserData();
  }, [])

  // useEffect(() => {
  //   getContractorData();
  // }, [sameAsContractor])

  const getUserData = async () => {
    setIsLoading(true);
    if (contractId !== '' && contractId !== undefined) {
      const { data: userData } = await GET(`user-management-service/user?contractID=${contractId}`);
      setUserCount(userData?.length || 0);
      if (selectContractInfo === 'INDIVIDUAL') {
        setContractUser(userData?.filter(data => !data?.roles?.map(role => role?.id)?.includes('6344d59a45ca246bd12dd77b'))?.map(data => data)[0])
      }
      let entityManager = userData?.filter(data => data?.roles?.map(role => role?.id)?.includes('6344d59a45ca246bd12dd77b'))?.map(data => data)
      if (entityManager?.length !== 0) {
        setUserId(entityManager?.[0]?.id);
      }
    }
    setIsLoading(false);
  }


  const onAllowBEMChange = (value) => {
    let temp = selectedRoles;
    if (value) {
      temp.push(roles?.filter(role => role?.roleName === 'Contract Business Entity Manager')?.map(data => data)[0]);
      setAllowBEM(value);
    } else {
      setAllowBEM([])
    }
    setSelectedRoles(temp);
  }

  const onAllowAggregatorChange = (value) => {
    let temp = selectedRoles;
    if (value) {
      temp.push(roles?.filter(role => role?.roleName === 'Aggregator')?.map(data => data)[0]);
      setAllowAggregator(value);
    } else {
      temp = selectedRoles?.filter(role => role?.roleName === 'Aggregator')?.map(data => data);
      setAllowAggregator(value)
    }
    setSelectedRoles(temp);
  }

  const handleContinue = async (buttonType) => {
    if (EmptyStringCheck(businessEntity?.name, 'Business Entity Name is Mandatory') ||
      !contractorNPIN?.notApplicable && !contractorNPIN?.missing && EmptyStringCheck(contractorNPIN?.npin, 'NPIN is Mandatory') ||
      !contractorEntityTaxId?.missing && !contractorEntityTaxId?.notApplicable && EmptyStringCheck(contractorEntityTaxId?.taxId, 'Tax Id is Mandatory') ||
      EmptyStringCheck(businessEntityUser?.name?.firstName, 'First Name is Mandatory') ||
      EmptyStringCheck(businessEntityUser?.name?.lastName, 'Last Name is Mandatory') ||
      EmailValidator(businessEntityUser?.email?.officialEmail) ||
      !businessEntityUser?.contactNumber?.missing && PhoneValidator(businessEntityUser?.contactNumber?.number)) {
      return;
    }

    const data = {
      contractorNPIN: contractorNPIN,
      contractorEntityTaxId: contractorEntityTaxId,
      businessEntity: businessEntity,
      businessEntityUser: businessEntityUser,
      roles: roles?.filter(data => data?.id === '6344d59a45ca246bd12dd77b')?.map(data => data),
      mailingAddress: mailingAddress,
      contractorContact: sameAsContractor,
      appRoleRequired: appRoleRequired,
      accessAllowedForBusinessEntityUser: allowBEM,
      paymentDataConfidential: keepConfidential,
    }
    const response = await PUT(`contract-managment-service/contracts/${contractId}/contractorBusinessEntity`, JSON.stringify(data));
    if (response) {
      SuccessToaster('Business Entity Updated Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }


    if (allowBEM || allowAggregator) {
      const userData = {
        ...(userId !== '0' && { 'id': userId }),
        "name": {
          "firstName": businessEntityUser?.name?.firstName,
          "lastName": businessEntityUser?.name?.lastName,
          "suffix": {}
        },
        "userType": "REGISTERED_USER",
        "contracts": [{
          "id": contractId,
          "contractName": {
            "contractName": contractName
          },
          "roles": roles?.filter(data => data?.id === '6344d59a45ca246bd12dd77b')?.map(data => data),
          "sites": {
            "sites": []
          },
          "siteLevelResponsible": true,
          "departmentLevelResponsible": true,
        }],
        "email": {
          "officialEmail": businessEntityUser?.email?.officialEmail
        },
        ...((userId === undefined || userId === '0') && {
          "password": {
            "password": "admin123"
          }
        }),
        "communication": {
          "personalEmail": businessEntityUser?.email?.officialEmail,
          "mobileNumber": businessEntityUser?.contactNumber?.number,
          "landlineNumber": ""
        },
        "roles": roles?.filter(data => data?.id === '6344d59a45ca246bd12dd77b')?.map(data => data),
        "tenant": {
          "tenantId": TenantID
        },
      }

      if (userId === '0') {
        await POST('user-management-service/user/register', JSON.stringify(userData))
          .then(response => {
            SuccessToaster('Business Entity Manager Added Successfully');
          })
          .catch(error => {
            ErrorToaster('Unexpected Error');
          })
      }
      else {
        await PUT('user-management-service/user', JSON.stringify(userData))
          .then(response => {
            SuccessToaster('Business Entity Manager Updated Successfully');
          })
          .catch(error => {
            ErrorToaster('Unexpected Error');
          });
      }
    }
    if (buttonType === 'Continue') {
      getViewPage5(true);
      getCurrentPage('Contracted Services Specification');
    } else {
      getShowAlert(true);
    }
    getTabDataStatus();
  }

  const getRoles = async () => {
    const { data: roles } = await GET('user-management-service/roles');
    setRoles(roles);
  };

  const getContractorBusinessEntity = async () => {
    const { data: contractorBusinessEntity } = await GET(`contract-managment-service/contracts/${contractId}/contractorBusinessEntity`);
    setContractorBusinessEntity(contractorBusinessEntity);
  };

  const setBusinessEntityData = () => {
    setSameAsContractor(contractorBusinessEntity?.contractorContact);
    setBusinessEntity(contractorBusinessEntity?.businessEntity || {});
    setContractorNPIN(contractorBusinessEntity?.contractorNPIN || {});
    setContractorEntityTaxId(contractorBusinessEntity?.contractorEntityTaxId || {});
    setBusinessEntityUser(contractorBusinessEntity?.businessEntityUser || {});
    setAppRoleRequired(contractorBusinessEntity?.appRoleRequired);
    setSelectedRoles(contractorBusinessEntity?.roles || []);
    setMailingAddress(contractorBusinessEntity?.mailingAddress || {});
    setAllowBEM(contractorBusinessEntity?.accessAllowedForBusinessEntityUser);
    setKeepConfidential(contractorBusinessEntity?.paymentDataConfidential);
  }


  useEffect(() => {
    getRoles();
    getContractorBusinessEntity();
    setBusinessEntityData();
  }, [])

  useEffect(() => {
    setBusinessEntityData();
  }, [contractorBusinessEntity])


  const handleInput = (e) => {
    const formattedPhoneNumber = FormatPhoneNumber(e.target.value);
    setBusinessEntityUser({ ...businessEntityUser, contactNumber: { number: formattedPhoneNumber, missing: businessEntityUser?.contactNumber?.missing } });
  };

  const getContractorData = (value) => {
    if (value && selectContractInfo === 'INDIVIDUAL') {
      setBusinessEntityUser({
        name: contractUser?.name,
        email: contractUser?.email,
        contactNumber: {
          number: contractUser?.communication?.mobileNumber,
          missing: contractUser?.communication?.missing,
        }
      });
      setMailingAddress({
        addressLine: contractUser?.address?.addressLine,
        city: contractUser?.address?.city,
        state: contractUser?.address?.state,
        zipcode: contractUser?.address?.zipcode
      });
      setContractorNPIN({
        notApplicable: contractUser?.npin?.notApplicable,
        npin: contractUser?.npin?.npin || '',
        missing: contractUser?.npin?.missing,
      });
    } else {
      setBusinessEntityUser({
        name: {
          firstName: '',
          lastName: '',
          middleName: '',
          suffix: {},
        },
        email: { officialEmail: '' },
        contactNumber: {
          number: '',
          missing: false
        }
      });
      setMailingAddress({
        addressLine: '',
        city: '',
        state: '',
        zipcode: ''
      });
      setContractorNPIN({
        notApplicable: '',
        npin: '',
        missing: false,
      });
    }
  }

  const updatePhone = (e) => {
    if (e.target.value?.length < 15) {
      let number = FormatPhoneNumber(e.target.value)
      setBusinessEntityUser({ ...businessEntityUser, contactNumber: { number: number, missing: false } });
      setIsUserUpdated(true);
    }
  }

  const handleNumberMissing = (value) => {
    setBusinessEntityUser({ ...businessEntityUser, contactNumber: { number: '', missing: value } });
  }

  const handleSameContact = (value) => {
    setSameAsContractor(value);
    getContractorData(value);
  }

  if (isLoading) {
    return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
  }

  console.log('roles', selectedRoles);

  console.log('name', contractorNPIN);

  return (
    <>
      <Dialog isOpen={showAlert} className={`${style.cloneDialog}`} canOutsideClickClose={false}>
        <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle}>Alert</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowAlert(false)} />
          </div>
          <div className={style.extensionBorder}></div>
          <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
            Business Contact Change Alert
          </p>
          <div className={`${style.positionCenter} ${style.marginTop20}`}>
            <button className={`${style.newContractButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => { setShowAlert(false); handleSameContact(!sameAsContractor); }}>OK</button>
          </div>
          <br />
        </div>
      </Dialog>
      {
        userCount !== 0 ?
          <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
              {selectContractInfo === "INDIVIDUAL" && (
                <div className={`${style.extentionGrid}`}
                  onFocus={() => { checkFieldAndPopAlert(true, 'Contractor Business Contact Same As Contractor') }}>
                  <div className={style.extentionLableStyle}>Contractor Business Contact Same As Contractor*</div>
                  <ThemeProvider theme={switchTheme}>
                    <FormControlLabel
                      control={
                        <Switch checked={sameAsContractor} className={`${style.textAlignLeft}`} onChange={() => setShowAlert(true)} />
                      }
                      color='primary'
                      className={`${style.switchFontStyle} ${style.marginTop}`}
                      label={sameAsContractor ? 'YES' : 'NO'}
                    />
                  </ThemeProvider>
                </div>
              )}
              <div className={`${style.extentionGrid} ${selectContractInfo === "INDIVIDUAL" && style.marginTop20}`}
                onFocus={() => { checkFieldAndPopAlert(contractorNPIN?.npin, 'Contractor NPIN') }}>
                <div className={style.extentionLableStyle}>Vendor NPIN*</div>
                <div className={style.twoCol}>
                  <CommonInputField className={style.fullWidth}
                    type="tel"
                    maxLength={10}
                    disabled={contractorNPIN?.missing || contractorNPIN?.notApplicable}
                    value={contractorNPIN?.npin} placeholder="Enter Vendor NPIN"
                    onChange={(e) => e.target.value >= 0 && setContractorNPIN({ ...contractorNPIN, npin: e.target.value, missing: false, notApplicable: false })} />
                  <div className={`${style.displayInRow}`}>
                    <FormGroup className={style.marginLeft20}>
                      <FormControlLabel control={<Checkbox value="Missing" checked={contractorNPIN?.missing} onChange={(e) => setContractorNPIN({ ...contractorNPIN, missing: e.target.checked, notApplicable: false, npin: '' })} />} label={<Typography variant="body2" color="textSecondary">Missing</Typography>} />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox value="NA" checked={contractorNPIN?.notApplicable} onChange={(e) => setContractorNPIN({ ...contractorNPIN, notApplicable: e.target.checked, missing: false, npin: '' })} />} label={<Typography variant="body2" color="textSecondary">NA</Typography>} />
                    </FormGroup>

                  </div>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}
                onFocus={() => { checkFieldAndPopAlert(contractorEntityTaxId?.taxId, 'Contractor Entity Tax ID') }}>
                <div className={style.extentionLableStyle}>Vendor Tax ID*</div>
                <div className={style.twoCol}>
                  <CommonInputField className={style.fullWidth} disabled={contractorEntityTaxId?.missing || contractorEntityTaxId?.notApplicable} value={contractorEntityTaxId?.taxId} placeholder="Enter Vendor Tax ID"
                    onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, taxId: e.target.value, missing: false, notApplicable: false })} />
                  <div className={`${style.displayInRow}`}>
                    <FormGroup className={style.marginLeft20}>
                      <FormControlLabel control={<Checkbox value="Missing" checked={contractorEntityTaxId?.missing} onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, missing: e.target.checked, notApplicable: false, taxId: '' })} />} label={<Typography variant="body2" color="textSecondary">Missing</Typography>} />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox value="NA" checked={contractorEntityTaxId?.notApplicable} onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, notApplicable: e.target.checked, missing: false, taxId: '' })} />} label={<Typography variant="body2" color="textSecondary">NA</Typography>} />
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Business Entity Name*</div>
                <CommonInputField className={style.fullWidth}
                  value={businessEntity?.name}
                  onFocus={() => { checkFieldAndPopAlert(businessEntity?.name, 'Business Entity Name') }}
                  placeholder="Enter Business Entity Name"
                  onChange={(e) => setBusinessEntity({ ...businessEntity, name: e.target.value })} />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Business Point of Contact*</div>
                <div className={style.twoCol}>
                  <CommonInputField className={style.fullWidth}
                    onFocus={() => { checkFieldAndPopAlert(businessEntityUser?.name?.firstName, 'Contractor Business Contact First Name') }}
                    value={businessEntityUser?.name?.firstName} placeholder="Enter First Name"
                    onChange={(e) => {
                      setBusinessEntityUser({ ...businessEntityUser, name: { firstName: e.target.value, lastName: businessEntityUser?.name?.lastName, suffix: {} } });
                      setIsUserUpdated(true);
                    }} />
                  <CommonInputField className={style.fullWidth}
                    onFocus={() => { checkFieldAndPopAlert(businessEntityUser?.name?.lastName, 'Contractor Business Contact Last Name') }}
                    value={businessEntityUser?.name?.lastName} placeholder="Enter Last Name"
                    onChange={(e) => {
                      setBusinessEntityUser({ ...businessEntityUser, name: { lastName: e.target.value, firstName: businessEntityUser?.name?.firstName, suffix: {} } });
                      setIsUserUpdated(true);
                    }} />
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Business Contact Email Address*</div>
                <CommonInputField className={style.fullWidth} value={businessEntityUser?.email?.officialEmail} placeholder="Enter Email"
                  onFocus={() => { checkFieldAndPopAlert(businessEntityUser?.email?.officialEmail, 'Business Contact Email Address') }}
                  onChange={(e) => {
                    setBusinessEntityUser({ ...businessEntityUser, email: { officialEmail: e.target.value } });
                    setIsUserUpdated(true);
                  }}
                />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}
                onFocus={() => { checkFieldAndPopAlert(businessEntityUser?.contactNumber?.number, 'Cell Phone') }}
              >
                <div className={style.extentionLableStyle}>Cell Phone*</div>
                <div className={style.twoCol}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                    <div className={`${style.plusOneText} ${style.marginRight}`}>+1</div>
                    <CommonInputField placeholder="Numeric"
                      value={businessEntityUser?.contactNumber?.number}
                      disabled={businessEntityUser?.contactNumber?.missing}
                      onChange={(e) => {
                        handleInput(e);
                        setIsUserUpdated(true);
                      }}
                      className={`${style.fullWidth}`} />
                  </div>
                  <FormGroup className={style.marginLeft20}>
                    <FormControlLabel control={<Checkbox value="NA"
                      checked={businessEntityUser?.contactNumber?.missing}
                      onChange={(e) => handleNumberMissing(e.target.checked)}
                    />} label={<Typography variant="body2" color="textSecondary">Not Available</Typography>} />
                  </FormGroup>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Mailing Address*</div>
                <div>
                  <CommonInputField className={style.fullWidth} value={mailingAddress?.addressLine} placeholder="Enter Street"
                    onFocus={() => { checkFieldAndPopAlert(mailingAddress?.addressLine, 'Mailing Address Street') }}
                    onChange={(e) => setMailingAddress({ ...mailingAddress, addressLine: e.target.value })} />
                  <div className={`${style.grid3} ${style.marginTop10}`}>
                    <CommonInputField className={style.fullWidth} value={mailingAddress?.city} placeholder="Enter City"
                      onFocus={() => { checkFieldAndPopAlert(mailingAddress?.city, 'Address City') }}
                      onChange={(e) => setMailingAddress({ ...mailingAddress, city: e.target.value })} />
                    <CommonInputField className={style.fullWidth} value={mailingAddress?.state} placeholder="Enter State"
                      onFocus={() => { checkFieldAndPopAlert(mailingAddress?.state, 'Address State') }}
                      onChange={(e) => setMailingAddress({ ...mailingAddress, state: e.target.value })} />
                    <CommonInputField className={style.fullWidth} value={mailingAddress?.zipcode} placeholder="Enter Zipcode"
                      onFocus={() => { checkFieldAndPopAlert(mailingAddress?.zipcode, 'Address Zip Code') }}
                      onChange={(e) => setMailingAddress({ ...mailingAddress, zipcode: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Register Business POC with App User Role*</div>
                <div className={style.displayInRow}>
                  <div>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch className={`${style.textAlignLeft}`} checked={allowBEM} onChange={(e) => onAllowBEMChange(!allowBEM)} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.marginTop}`}
                        label={allowBEM ? 'YES' : 'NO'}
                      />
                    </ThemeProvider>
                  </div>
                  {allowBEM &&
                    <div>
                      <CommonInputField value="Business Contract Manager" className={style.fullWidth} readOnly={true} />
                      <div className={`${style.businessContractManagerRoleInfo} ${style.marginTop10}`}>
                        The Business Contract Manager role allows the registered user to access
                        contract related information and reports only for the contract associated
                        with their business entity.
                      </div>
                    </div>
                  }




                </div>
              </div>

              {
                selectContractInfo !== 'INDIVIDUAL' &&
                (
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Allow user as Aggregator*</div>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch checked={allowAggregator} className={`${style.textAlignLeft}`} onChange={() => onAllowAggregatorChange(!allowAggregator)} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.marginTop}`}
                        label={allowAggregator ? 'YES' : 'NO'}
                      />
                    </ThemeProvider>
                  </div>
                )
              }

              {
                selectContractInfo !== 'INDIVIDUAL' &&
                (
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Keep Contract Payment Data Confidential*</div>
                    <ThemeProvider theme={switchTheme}>
                      <FormControlLabel
                        control={
                          <Switch checked={keepConfidential} className={`${style.textAlignLeft}`} onChange={() => setKeepConfidential(!keepConfidential)} />
                        }
                        color='primary'
                        className={`${style.switchFontStyle} ${style.marginTop}`}
                        label={keepConfidential ? 'YES' : 'NO'}
                      />
                    </ThemeProvider>
                  </div>
                )
              }
            </div>
            {isEditable &&
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Contracted Services Provider(s)') }}>BACK</button>
                <div>
                  <button className={style.newContractOutlinedButton} onClick={() => handleContinue('Save In Progress')}>SAVE IN-PROGRESS</button>
                  <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                    onClick={() => { handleContinue('Continue'); }}
                  >CONTINUE</button>
                </div>
              </div>
            }

          </div>
          :
          (
            <RedirectingPopUp getCurrentPage={getCurrentPage} tabName={'Contracted Services Provider(s)'} title={'NO USERS FOUND'} description={'No Contracted Service Provider Is Found.'} buttonText={'ADD CONTRACTOR'} />
          )
      }
    </>
  )
}

export default ContractorBusinessEntity;
