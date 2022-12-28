import React, { useState, useEffect } from 'react';
import { InputGroup, Tag, Dialog, Classes } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { POST, GET, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import { EmailValidator, FormatPhoneNumber, EmptyStringCheck, PhoneValidator } from './../../utils/formatting';

import style from './index.module.scss';

const switchTheme = createTheme({
  palette: {
    primary: {
      main: '#7165E3',
    },
  },
});


const ContractorBusinessEntity = ({ getViewPage5, getCurrentPage, selectContractInfo, contractId, contractName, getSelectedField, getShowAlert }) => {
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
    na: false,
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
  const [roles, setRoles] = useState([])
  const [selectedRoles, setSelectedRoles] = useState([])
  const [mailingAddress, setMailingAddress] = useState({
    addressLine: "",
    city: "",
    state: "",
    zipcode: ""
  });
  const [appRoleRequired, setAppRoleRequired] = useState(true);
  const [contractorBusinessEntity, setContractorBusinessEntity] = useState({});
  const [userId, setUserId] = useState('0');

  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {
    getContractorData();
  }, [sameAsContractor])

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

  const handleContinue = async (buttonType) => {
    if (EmptyStringCheck(businessEntity?.name, 'Business Entity Name is Mandatory') ||
      !contractorNPIN?.notApplicable && !contractorNPIN?.missing && EmptyStringCheck(contractorNPIN?.npin, 'NPIN is Mandatory') ||
      !contractorEntityTaxId?.missing && EmptyStringCheck(contractorEntityTaxId?.taxId, 'Tax Id is Mandatory') ||
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
      appRoleRequired: appRoleRequired
    }
    const response = await PUT(`contract-managment-service/contracts/${contractId}/contractorBusinessEntity`, JSON.stringify(data));
    if (response) {
      SuccessToaster('Business Entity Updated Successfully');
    }
    else {
      ErrorToaster('Unexpected Error');
    }

    if (allowBEM) {
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
    }else{
      getShowAlert(true);
    }
  }

  const handleRoles = (value) => {
    if (value !== '0') {
      const selectedValue = roles?.filter(data => data?.roleName === value)?.map(data => data)[0];

      if (!selectedRoles?.map(data => data?.roleName)?.includes(value)) {
        setSelectedRoles([...selectedRoles, selectedValue]);
      }
    }
  }

  const rolesTags = selectedRoles
    ?.filter(data => roles?.map(role => role.id === data?.id))
    .map((tag, index) => {
      const onRemove = () => {
        setSelectedRoles(selectedRoles.filter((t) => t?.roleName !== tag?.roleName)?.map(data => data));
      };
      return (
        <Tag key={index} onRemove={onRemove} large={true} className={style.tagStyle}>
          {tag?.roleName}
        </Tag>
      );
    });

  const getRoles = async () => {
    const { data: roles } = await GET('user-management-service/roles');
    setRoles(roles);
  };

  const getContractorBusinessEntity = async () => {
    const { data: contractorBusinessEntity } = await GET(`contract-managment-service/contracts/${contractId}/contractorBusinessEntity`);
    setContractorBusinessEntity(contractorBusinessEntity);
  };

  useEffect(() => {
    setSameAsContractor(contractorBusinessEntity?.contractorContact);
    setBusinessEntity(contractorBusinessEntity?.businessEntity || {});
    setContractorNPIN(contractorBusinessEntity?.contractorNPIN || {});
    setContractorEntityTaxId(contractorBusinessEntity?.contractorEntityTaxId || {});
    setBusinessEntityUser(contractorBusinessEntity?.businessEntityUser || {});
    setAppRoleRequired(contractorBusinessEntity?.appRoleRequired);
    setSelectedRoles(contractorBusinessEntity?.roles || []);
    setMailingAddress(contractorBusinessEntity?.mailingAddress || {});
  }, [contractorBusinessEntity])

  useEffect(() => {
    getRoles();
    getContractorBusinessEntity();
  }, [])

  const handleInput = (e) => {
    const formattedPhoneNumber = FormatPhoneNumber(e.target.value);
    setBusinessEntityUser({ ...businessEntityUser, contactNumber: { number: formattedPhoneNumber, missing: businessEntityUser?.contactNumber?.missing } });
  };

  const getContractorData = () => {
    if (sameAsContractor && selectContractInfo === 'INDIVIDUAL') {
      setBusinessEntityUser({
        name: contractUser?.name,
        email: contractUser?.email,
        contactNumber: {
          number: contractUser?.communication?.mobileNumber,
          missing: false
        }
      });
      setMailingAddress({
        addressLine: "",
        city: contractUser?.address?.city,
        state: contractUser?.address?.state,
        zipcode: contractUser?.address?.zipcode
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

  const handleSameContact = () => {
    setSameAsContractor(!sameAsContractor);
    getContractorData();
  }

  if (isLoading) {
    return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
  }

  return (
    <>
      {
        userCount !== 0 ?
          <div className={style.cloneBlockStyle}>
            <div className={`${style.newContractFromCloneBoxStyle}`}>
              {selectContractInfo === "INDIVIDUAL" && (
                <div className={`${style.extentionGrid}`}
                  onFocus={() => { getSelectedField('Contractor Business Contact Same As Contractor') }}>
                  <div className={style.extentionLableStyle}>Contractor Business Contact Same As Contractor*</div>
                  <ThemeProvider theme={switchTheme}>
                    <FormControlLabel
                      control={
                        <Switch checked={sameAsContractor} className={`${style.textAlignLeft}`} onChange={() => handleSameContact()} />
                      }
                      color='primary'
                      className={`${style.switchFontStyle} ${style.marginTop}`}
                      label={sameAsContractor ? 'YES' : 'NO'}
                    />
                  </ThemeProvider>
                </div>
              )}
              <div className={`${style.extentionGrid} ${style.marginTop20}`}
                onFocus={() => { getSelectedField('Contractor NPIN') }}>
                <div className={style.extentionLableStyle}>Vendor NPIN*</div>
                <div className={style.twoCol}>
                  <InputGroup className={style.fullWidth}
                    type="tel"
                    maxLength={10}
                    disabled={contractorNPIN?.missing || contractorNPIN?.notApplicable}
                    value={contractorNPIN?.npin} placeholder="Enter Vendor NPIN"
                    onChange={(e) =>e.target.value >= 0 && setContractorNPIN({ ...contractorNPIN, npin: e.target.value })} />
                  <div className={`${style.displayInRow}`}>
                    <FormGroup className={style.marginLeft20}>
                      <FormControlLabel control={<Checkbox value="Missing" checked={contractorNPIN?.missing} onChange={(e) => setContractorNPIN({ ...contractorNPIN, missing: e.target.checked, notApplicable: false, npin:'' })} />} label={<Typography variant="body2" color="textSecondary">Missing</Typography>} />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox value="NA" checked={contractorNPIN?.notApplicable} onChange={(e) => setContractorNPIN({ ...contractorNPIN, notApplicable: e.target.checked, missing:false, npin:'' })} />} label={<Typography variant="body2" color="textSecondary">NA</Typography>} />
                    </FormGroup>

                  </div>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}
                onFocus={() => { getSelectedField('Contractor Entity Tax ID') }}>
                <div className={style.extentionLableStyle}>Vendor Tax ID*</div>
                <div className={style.twoCol}>
                  <InputGroup className={style.fullWidth} disabled={contractorEntityTaxId?.missing || contractorEntityTaxId?.na} value={contractorEntityTaxId?.taxId} placeholder="Enter Vendor Tax ID"
                    onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, taxId: e.target.value, missing: false, na: false })} />
                  <div className={`${style.displayInRow}`}>
                    <FormGroup className={style.marginLeft20}>
                      <FormControlLabel control={<Checkbox value="Missing" checked={contractorEntityTaxId?.missing} onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, missing: e.target.checked, na:false, taxId: ''  })} />} label={<Typography variant="body2" color="textSecondary">Missing</Typography>} />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox value="NA" checked={contractorEntityTaxId?.na} onChange={(e)=>setContractorEntityTaxId({ ...contractorEntityTaxId, na: e.target.checked, missing:false, taxId: ''  })}/>} label={<Typography variant="body2" color="textSecondary">NA</Typography>} />
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Business Entity Name*</div>
                <InputGroup className={style.fullWidth}
                  value={businessEntity?.name}
                  onFocus={() => { getSelectedField('Business Entity Name') }}
                  placeholder="Enter Business Entity Name"
                  onChange={(e) => setBusinessEntity({ ...businessEntity, name: e.target.value })} />
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Business Point of Contact*</div>
                <div className={style.twoCol}>
                  <InputGroup className={style.fullWidth}
                    onFocus={() => { getSelectedField('Contractor Business Contact First Name') }}
                    value={businessEntityUser?.name?.firstName} placeholder="Enter First Name"
                    onChange={(e) => {
                      setBusinessEntityUser({ ...businessEntityUser, name: { firstName: e.target.value, lastName: businessEntityUser?.name?.lastName, suffix: {} } });
                      setIsUserUpdated(true);
                    }} />
                  <InputGroup className={style.fullWidth}
                    onFocus={() => { getSelectedField('Contractor Business Contact Last Name') }}
                    value={businessEntityUser?.name?.lastName} placeholder="Enter Last Name"
                    onChange={(e) => {
                      setBusinessEntityUser({ ...businessEntityUser, name: { lastName: e.target.value, firstName: businessEntityUser?.name?.firstName, suffix: {} } });
                      setIsUserUpdated(true);
                    }} />
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Business Contact Email Address*</div>
                <div className={style.twoCol}>
                  <InputGroup className={style.fullWidth} value={businessEntityUser?.email?.officialEmail} placeholder="Enter Email"
                    onFocus={() => { getSelectedField('Business Contact Email Address') }}
                    onChange={(e) => {
                      setBusinessEntityUser({ ...businessEntityUser, email: { officialEmail: e.target.value } });
                      setIsUserUpdated(true);
                    }}
                  />
                  <FormGroup className={style.marginLeft20}>
                    <FormControlLabel control={<Checkbox value="Missing"
                    />} label={<Typography variant="body2" color="textSecondary">Missing</Typography>} />
                  </FormGroup>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}
                onFocus={() => { getSelectedField('Cell Phone') }}
              >
                <div className={style.extentionLableStyle}>Cell Phone*</div>
                <div className={style.twoCol}>
                  <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                    <div className={`${style.plusOneText} ${style.marginRight}`}>+1</div>
                    <InputGroup placeholder="Numeric"
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
                    onChange={(e)=>handleNumberMissing(e.target.checked)}
                    />} label={<Typography variant="body2" color="textSecondary">Not Available</Typography>} />
                  </FormGroup>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Mailing Address*</div>
                <div>
                  <InputGroup className={style.fullWidth} value={mailingAddress?.addressLine} placeholder="Enter Street"
                    onFocus={() => { getSelectedField('Mailing Address Street') }}
                    onChange={(e) => setMailingAddress({ ...mailingAddress, addressLine: e.target.value })} />
                  <div className={`${style.grid3} ${style.marginTop10}`}>
                    <InputGroup className={style.fullWidth} value={mailingAddress?.city} placeholder="Enter City"
                      onFocus={() => { getSelectedField('Address City') }}
                      onChange={(e) => setMailingAddress({ ...mailingAddress, city: e.target.value })} />
                    <InputGroup className={style.fullWidth} value={mailingAddress?.state} placeholder="Enter State"
                      onFocus={() => { getSelectedField('Address State') }}
                      onChange={(e) => setMailingAddress({ ...mailingAddress, state: e.target.value })} />
                    <InputGroup className={style.fullWidth} value={mailingAddress?.zipcode} placeholder="Enter Zipcode"
                      onFocus={() => { getSelectedField('Address Zip Code') }}
                      onChange={(e) => setMailingAddress({ ...mailingAddress, zipcode: e.target.value })} />
                  </div>
                </div>
              </div>
              {
                // <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //   <div className={style.extentionLableStyle}>Register Business POC with App User Role*</div>
                //   <div className={style.displayInRow}>
                //     <div>
                //       <ThemeProvider theme={switchTheme}>
                //         <FormControlLabel
                //           control={
                //             <Switch className={`${style.textAlignLeft}`} />
                //           }
                //           color='primary'
                //           className={`${style.switchFontStyle} ${style.marginTop}`}
                //           label={'YES'}
                //         />
                //       </ThemeProvider>
                //     </div>
                //     <div>
                //       <InputGroup value="Business Contract Manager" className={style.fullWidth} />
                //       <div className={`${style.businessContractManagerRoleInfo} ${style.marginTop10}`}>
                //         The Business Contract Manager role allows the registered user to access
                //         contract related information and reports only for the contract associated
                //         with their business entity.
                //       </div>
                //     </div>
                //   </div>
                // </div>
              }


              {
                // selectContractInfo !== 'INDIVIDUAL' &&
                // (
                //   <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                //     <div className={style.extentionLableStyle}>Keep Contract Payment Data Confidential*</div>
                //     <ThemeProvider theme={switchTheme}>
                //       <FormControlLabel
                //         control={
                //           <Switch checked={keepConfidential} className={`${style.textAlignLeft}`} onChange={() => setKeepConfidential(!keepConfidential)} />
                //         }
                //         color='primary'
                //         className={`${style.switchFontStyle} ${style.marginTop}`}
                //         label={keepConfidential ? 'YES' : 'NO'}
                //       />
                //     </ThemeProvider>
                //   </div>
                // )
              }
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop20}`}>
              <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Contracted Services Provider(s)') }}>BACK</button>
              <div>
                <button className={style.newContractOutlinedButton} onClick={() => handleContinue('Save In Progress')}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`}
                  onClick={() => { handleContinue('Continue'); }}
                >CONTINUE</button>
              </div>
            </div>
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
