import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import { POST, GET, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import LoadingScreen from '../../Components/LoadingScreen';
import RedirectingPopUp from './redirectingPopUp';
import { EmailValidator, FormatPhoneNumber, EmptyStringCheck, PhoneValidator } from './../../utils/formatting';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonLabel from '../../Components/CommonFields/CommonLabel';

import style from './index.module.scss';

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
  const [ssoId, setSsoId] = useState('');
  const [contractorEntityTaxId, setContractorEntityTaxId] = useState({
    taxId: "",
    missing: false,
    notApplicable: false,
  });
  const [businessEntity, setBusinessEntity] = useState({
    name: '',
    notApplicable: false,
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
  const [continueLoading, setContinueLoading] = useState(false);

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
        setContractUser(userData?.filter(data => !data?.roles?.map(role => role?.roleName)?.includes('Contract Business Entity Manager'))?.map(data => data)[0])
      }
      let entityManager = userData?.filter(data => data?.roles?.map(role => role?.roleName)?.includes('Contract Business Entity Manager'))?.map(data => data)
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
    if ((!businessEntity?.notApplicable && EmptyStringCheck(businessEntity?.name, 'Business Entity Name is Mandatory')) ||
      ((!contractorNPIN?.notApplicable && !contractorNPIN?.missing) && EmptyStringCheck(contractorNPIN?.npin, 'NPIN is Mandatory')) ||
      ((!contractorEntityTaxId?.missing && !contractorEntityTaxId?.notApplicable) && EmptyStringCheck(contractorEntityTaxId?.taxId, 'Tax Id is Mandatory')) ||
      EmptyStringCheck(businessEntityUser?.name?.firstName, 'First Name is Mandatory') ||
      EmptyStringCheck(businessEntityUser?.name?.lastName, 'Last Name is Mandatory') ||
      EmailValidator(businessEntityUser?.email?.officialEmail) ||
      (!businessEntityUser?.contactNumber?.missing && PhoneValidator(businessEntityUser?.contactNumber?.number))) {
      return;
    }
    if (!continueLoading) {
      setContinueLoading(true);

      if (allowBEM || allowAggregator) {
        if (businessEntityUser?.email?.officialEmail === contractUser?.email?.officialEmail) {
          ErrorToaster('Enter Different Email to register with App User Role');
          return;
        }
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
            "roles": roles?.filter(data => data?.roleName === 'Contract Business Entity Manager' || data?.roleName === 'Aggregator')?.map(data => data),
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
          "roles": roles?.filter(data => data?.roleName === 'Contract Business Entity Manager' || data?.roleName === 'Aggregator')?.map(data => data),
          "tenant": {
            "tenantId": TenantID
          },
          // "ssoId": { "id": ssoId }
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

      const data = {
        contractorNPIN: contractorNPIN,
        contractorEntityTaxId: contractorEntityTaxId,
        businessEntity: businessEntity,
        businessEntityUser: businessEntityUser,
        roles: roles?.filter(data => data?.id === 'Contract Business Entity Manager')?.map(data => data),
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
      setContinueLoading(false);

      if (buttonType === 'Continue') {
        getViewPage5(true);
        getCurrentPage('Contracted Services Specification');
      } else {
        getShowAlert(true);
      }
      getTabDataStatus();
    }
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
  }, [contractId])

  useEffect(() => {
    setBusinessEntityData();
  }, [contractorBusinessEntity])

  // useEffect(() => {
  //   setSsoId(contractUser?.ssoId?.id);
  // }, [contractUser])

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
          missing: contractUser?.communication?.mobileNumberNotApplicable,
        }
      });
      setSsoId(contractUser?.ssoId?.id)
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
    setContractorNPIN({ ...contractorNPIN, missing: false, notApplicable: false });
    setContractorEntityTaxId({ ...contractorEntityTaxId, missing: false, notApplicable: false });
    setSameAsContractor(value);
    getContractorData(value);
  }

  console.log(ssoId, contractUser?.ssoId?.id)

  if (isLoading) {
    return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Details']} />
  }

  return (
    <>
      <Dialog isOpen={showAlert} className={`${style.cloneDialog}`} canOutsideClickClose={false}>
        <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle}>Data Entry Alert</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowAlert(false)} />
          </div>
          <div className={style.extensionBorder}></div>
          <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
            {sameAsContractor ? 'The data entry within the form will be reset if you continue' : 'The contractor Service Provider data from previous tab will automatically entered in the below field. Review and enter additional detail required.'}
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
                  <CommonLabel value='Contractor Business Contact Same As Contractor*' />
                  <CommonSwitch checked={sameAsContractor} className={`${style.textAlignLeft} ${style.switchFontStyle}`} onChange={() => setShowAlert(true)} label={sameAsContractor ? 'YES' : 'NO'} />
                </div>
              )}
              <div className={`${style.extentionGrid} ${selectContractInfo === "INDIVIDUAL" && style.marginTop20}`}
                onFocus={() => { checkFieldAndPopAlert(contractorNPIN?.npin, 'Contractor NPIN') }}>
                <CommonLabel value='Vendor NPIN*' />
                <div className={style.twoCol}>
                  <CommonInputField className={style.fullWidth}
                    placeholder="Enter Vendor NPIN"
                    type="number"
                    disabled={contractorNPIN?.missing || contractorNPIN?.notApplicable}
                    value={contractorNPIN?.npin}
                    onChange={(e) => e.target.value >= 0 && setContractorNPIN({ ...contractorNPIN, npin: e.target.value?.slice(0, 10), missing: false, notApplicable: false })} />
                  <div className={`${style.displayInRow}`}>
                    <CommonCheckBox value="Missing" checked={contractorNPIN?.missing} onChange={(e) => setContractorNPIN({ ...contractorNPIN, missing: e.target.checked, notApplicable: false, npin: '' })} label="Missing" />
                    <CommonCheckBox value="NA" checked={contractorNPIN?.notApplicable} onChange={(e) => setContractorNPIN({ ...contractorNPIN, notApplicable: e.target.checked, missing: false, npin: '' })} label="NA" />
                  </div>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}
                onFocus={() => { checkFieldAndPopAlert(contractorEntityTaxId?.taxId, 'Contractor Entity Tax ID') }}>
                <CommonLabel value='Vendor Tax ID*' />
                <div className={style.twoCol}>
                  <CommonInputField className={style.fullWidth} disabled={contractorEntityTaxId?.missing || contractorEntityTaxId?.notApplicable} value={contractorEntityTaxId?.taxId} placeholder="Enter Vendor Tax ID"
                    onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, taxId: e.target.value, missing: false, notApplicable: false })} />
                  <div className={`${style.displayInRow}`}>
                    <CommonCheckBox value="Missing" checked={contractorEntityTaxId?.missing} onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, missing: e.target.checked, notApplicable: false, taxId: '' })} label="Missing" />
                    <CommonCheckBox value="NA" checked={contractorEntityTaxId?.notApplicable} onChange={(e) => setContractorEntityTaxId({ ...contractorEntityTaxId, notApplicable: e.target.checked, missing: false, taxId: '' })} label="NA" />
                  </div>
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <CommonLabel value='Business Entity Name*' />
                <div className={style.twoCol}>
                  <CommonInputField className={style.fullWidth}
                    value={businessEntity?.name}
                    disabled={businessEntity?.notApplicable}
                    onFocus={() => { checkFieldAndPopAlert(businessEntity?.name, 'Business Entity Name') }}
                    placeholder="Enter Business Entity Name"
                    onChange={(e) => setBusinessEntity({ ...businessEntity, name: e.target.value })} />
                  <CommonCheckBox value="NA"
                    checked={businessEntity?.notApplicable}
                    onChange={(e) => setBusinessEntity({ ...businessEntity, notApplicable: e.target.checked, name: '' })}
                    label="Not Applicable" />
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <CommonLabel value='Business Point of Contact*' />
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
                <CommonLabel value='Business Contact Email Address*' />
                <CommonInputField className={style.fullWidth} value={businessEntityUser?.email?.officialEmail} placeholder="Enter Email"
                  onFocus={() => { checkFieldAndPopAlert(businessEntityUser?.email?.officialEmail, 'Business Contact Email Address') }}
                  onChange={(e) => {
                    setBusinessEntityUser({ ...businessEntityUser, email: { officialEmail: e.target.value } });
                    setIsUserUpdated(true);
                  }}
                />
              </div>
              {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <CommonLabel value='SSO ID*' />
                <CommonInputField className={style.fullWidth} value={ssoId} placeholder="Enter SSO ID"
                  onChange={(e) => {
                    setSsoId(e.target.value);
                    setIsUserUpdated(true);
                  }}
                />
              </div> */}
              <div className={`${style.extentionGrid} ${style.marginTop20}`}
                onFocus={() => { checkFieldAndPopAlert(businessEntityUser?.contactNumber?.number, 'Cell Phone') }}
              >
                <CommonLabel value='Cell Phone*' />
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
                  <CommonCheckBox value="NA"
                    checked={businessEntityUser?.contactNumber?.missing}
                    onChange={(e) => handleNumberMissing(e.target.checked)}
                    label="Not Available" />
                </div>
              </div>
              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <CommonLabel value='Mailing Address*' />
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
                <CommonLabel value='Register Business POC with App User Role*' />
                <div className={style.displayInRow}>
                  <div>
                    <CommonSwitch className={`${style.switchFontStyle} ${style.textAlignLeft}`} checked={allowBEM} onChange={(e) => onAllowBEMChange(!allowBEM)} label={allowBEM ? 'YES' : 'NO'} />
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
                    <CommonLabel value='Allow user as Aggregator*' />
                    <CommonSwitch checked={allowAggregator} className={`${style.switchFontStyle} ${style.textAlignLeft}`} onChange={() => onAllowAggregatorChange(!allowAggregator)} label={allowAggregator ? 'YES' : 'NO'} />
                  </div>
                )
              }

              {
                selectContractInfo !== 'INDIVIDUAL' &&
                (
                  <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <CommonLabel value='Keep Contract Payment Data Confidential*' />
                    <CommonSwitch checked={keepConfidential} className={`${style.switchFontStyle} ${style.textAlignLeft}`} onChange={() => setKeepConfidential(!keepConfidential)} label={keepConfidential ? 'YES' : 'NO'} />
                  </div>
                )
              }
            </div>
            {isEditable &&
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <button className={`${style.newContractButtonStyle}  ${style.cursorPointer}`} onClick={() => { getCurrentPage('Contracted Services Provider(s)') }}>BACK</button>
                <div>
                  <button className={`${style.newContractOutlinedButton}  ${style.cursorPointer} ${continueLoading ? style.disabled : ''}`} onClick={() => handleContinue('Save In Progress')}>SAVE IN-PROGRESS</button>
                  <button className={`${style.newContractButtonStyle} ${style.cursorPointer}  ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`}
                    onClick={() => { handleContinue('Continue') }}
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
