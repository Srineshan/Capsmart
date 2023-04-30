import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Classes, Icon, Intent, Tag, Button, TagInput } from '@blueprintjs/core';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import { GET, PUT, POST, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import SuffixList from './../../Components/SuffixList';
import ProviderTypeList from './../../Components/ProviderTypeList';
import FunctionalTitleList from './../../Components/FunctionalTitleList';
import { FormatPhoneNumber } from './../../utils/formatting';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonLabel from '../../Components/CommonFields/CommonLabel';

import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const NewServiceProvider = ({ getNewServiceProviderDialog, contractId, contractType }) => {
  const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
  const [startDate, setStartDate] = useState(new Date);
  const [user, setUsers] = useState([]);
  const [selectContractManager, setSelectContractManager] = useState('');
  const [userName, setUserName] = useState('');
  const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration');
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [nPin, setNpin] = useState({ npin: '', missing: false, na: false });
  const [userDetails, setUserDetails] = useState({ firstName: '', middleName: '', lastName: '', suffix: { suffix: '', id: '' }, email: '', phone: '', ssoId: { id: '' } });
  const [providerType, setProviderType] = useState({ contractedServiceProviderType: '', id: '' });
  const [address, setAddress] = useState({ addressLine: '', city: '', state: '', zipcode: '' });
  const [siteLevel, setSiteLevel] = useState(false);
  const [departmentLevel, setDepartmentLevel] = useState(false);
  const [siteList, setSiteList] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedSitesDept, setSelectedSitesDepartment] = useState([]);
  const [siteLevelTitle, setSiteLevelTitle] = useState({ id: '', title: '' });
  const [departmentLevelDepartment, setDepartmentLevelDepartment] = useState('');
  const [departmentLevelTitle, setDepartmentLevelTitle] = useState({ id: '', title: '' });
  const [siteLevelSite, setSiteLevelSite] = useState({ id: '', name: '' });
  const [departmentLevelSite, setDepartmentLevelSite] = useState({ id: '', name: '' });
  const [siteTitleValues, setSiteTitleValues] = useState([]);
  const [departmentTitleValues, setDepartmentTitleValues] = useState([]);
  const [contractName, setContractName] = useState('');
  const [contracts, setContracts] = useState([]);
  const [allowPersonalMail, setAllowPersonalMail] = useState(false);
  const [phoneNA, setPhoneNA] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);

  const leftElement = () => {
    return (
      <Button text="Upload" intent={Intent.PRIMARY} />
    )
  }

  const calendarIcon = () => {
    return (
      <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
    )
  }

  useEffect(() => {
    getRolesData();
    getUsersData();
    getContractDetail();
  }, [])

  useEffect(() => {
    getTitleData();
  }, [siteList])


  useEffect(() => {
    if (siteList?.length === 0) {
      getContractDetail();
    }
  }, [siteLevel, departmentLevel])

  useEffect(() => {
    let depts = sites?.filter(data => data?.id === departmentLevelSite?.id)?.map(data => data.department)[0];
    setSelectedSitesDepartment(depts);
  }, [departmentLevelSite])

  const getTitleData = () => {
    let temp = [];
    let siteValue = siteTitleValues;
    let deptValue = departmentTitleValues;
    siteList?.map(data => {
      let dept = [];
      data?.departmentList?.departments?.map(deptData => {
        dept.push({ id: deptData?.id, name: deptData?.departmentName?.name, title: deptData?.departmentResponsibility?.title || '', title_id: deptData?.departmentResponsibility?.id || '' });
        if (deptData?.departmentResponsibility?.title !== '' && deptData?.departmentResponsibility?.title !== undefined) {
          let valueString = `${data?.siteName?.siteName} - ${deptData?.departmentName?.name} - ${deptData?.departmentResponsibility?.title}`
          if (!deptValue.includes(valueString)) {
            deptValue.push(valueString);
          }
        }
      })
      temp.push({ id: data?.id, name: data?.siteName?.siteName, title: data?.siteResponsibility?.title || '', title_id: data?.siteResponsibility?.id || '', department: dept });
      if (data?.siteResponsibility?.title !== '' && data?.siteResponsibility?.title !== undefined) {
        let valueString = `${data?.siteName?.siteName} - ${data?.siteResponsibility?.title}`;
        if (!siteValue.includes(valueString)) {
          siteValue.push(valueString);
        }
      }
    })
    setSites(temp);
    setSiteTitleValues(siteValue);
    setDepartmentTitleValues(deptValue);
  }

  const handleRoles = (value) => {
    if (value !== '0') {
      const selectedValue = roles.filter(data => data?.roleName === value).map(data => data)[0];
      if (!selectedRoles.map(data => data?.roleName).includes(value)) {
        setSelectedRoles([...selectedRoles, selectedValue]);
      }
    }
  }

  const rolesTags = selectedRoles
    ?.filter(data => roles.map(role => role).includes(data))
    ?.map((tag, index) => {
      const onRemove = () => {
        setSelectedRoles(selectedRoles.filter((t) => t?.roleName !== tag?.roleName));
      };
      return (
        <Tag key={index} onRemove={onRemove} large={true} className={style.tagStyle}>
          {tag?.roleName}
        </Tag>
      );
    });

  const getRolesData = async () => {
    const { data: roles } = await GET(`user-management-service/roles?roleType=APP&roleType=APP_SYSTEM`);
    if (roles) {
      setRoles(roles);
    }
    let temp = selectedRoles;
    if (!selectedRoles?.map(data => data?.roleName)?.includes('Activity Logger')) {
      temp.push(roles?.filter(role => role?.roleName === 'Activity Logger')?.map(data => data)[0]);
      setSelectedRoles(temp);
    }
  }

  const getContractDetail = async () => {
    const { data: contractData } = await GET(`contract-managment-service/contracts/${contractId}/contractDetail`);
    if (contractData) {
      setContractName(contractData?.contractName?.contractName);
      setSiteList(contractData?.contractDetail?.site?.sites);
    }
  }

  const handleUserData = (name, value) => {
    setUserDetails({ ...userDetails, [name]: value });
  }

  const handleAddress = (name, value) => {
    setAddress({ ...address, [name]: value });
  }

  selectedRoles?.map(data => {
    if (!roles?.map(role => role?.id).includes(data?.id)) {
      roles.push(data);
    }
  });

  const handleSave = async (type) => {
    setContinueLoading(true);
    let contractData = [];
    contractData.push({
      "id": contractId,
      "contractName": {
        "contractName": contractName
      },
      "roles": selectedRoles,
      "sites": {
        "sites": getSiteData()
      },
      "departmentLevelResponsible": departmentLevel,
      "siteLevelResponsible": siteLevel,
    });

    let sites = userDetails?.sites?.sites || [];
    let selectedSite = getSiteData();
    selectedSite?.map(data => {
      if (!sites?.map(site => site?.id).includes(data?.id)) {
        sites.push(data);
      }
    });
    if (userDetails?.firstName === '') {
      ErrorToaster('First Name is Mandatory');
      setContinueLoading(false);
      return;
    }
    if (userDetails?.lastName === '') {
      ErrorToaster('Last Name is Mandatory');
      setContinueLoading(false);
      return;
    }
    if (!nPin?.missing && !nPin?.na && nPin.npin === '') {
      ErrorToaster('NPIN is Mandatory if not Missing/NA');
      setContinueLoading(false);
      return;
    }
    if (!userDetails?.email?.includes('@') || !userDetails?.email?.includes('.')) {
      ErrorToaster('Enter a Valid Email');
      setContinueLoading(false);
      return;
    }
    if (!phoneNA && userDetails?.phone?.length !== 14) {
      ErrorToaster('Enter Valid Phone Number');
      setContinueLoading(false);
      return;
    }
    if (roles?.length === 0) {
      ErrorToaster('Select User Role');
      setContinueLoading(false);
      return;
    }

    const data = {
      "name": {
        "firstName": userDetails?.firstName,
        "middleName": userDetails?.middleName,
        "lastName": userDetails?.lastName,
        "suffix": userDetails?.suffix
      },
      "userType": "CONTRACTED_SERVICE_PROVIDER_USER",
      "contracts": contractData,
      "title": {
        "title": '',
        "id": ''
      },
      "email": {
        "officialEmail": userDetails?.email
      },
      "ssoId": userDetails?.ssoId,
      "password": {
        "password": ''
      },
      "communication": {
        "personalEmail": userDetails?.email,
        "mobileNumber": userDetails?.phone,
        "landlineNumber": "string",
        "mobileNumberNotApplicable": phoneNA
      },
      "roles": selectedRoles,
      "address": address,
      "tenant": {
        "tenantId": TenantID
      },
      "sites": {
        "sites": sites,
      },
      "serviceProviderType": providerType,
      "activated": false,
      "blocked": false,
      "npin": {
        "missing": nPin?.missing,
        "notApplicable": nPin?.na,
        "npin": nPin?.npin
      }
    }
    await POST(`user-management-service/user/register`, JSON.stringify(data))
      .then(response => {
        SuccessToaster('User Added Successfully');
      })
      .catch(error => {
        ErrorToaster('Unexpected Error');
      })
    setContinueLoading(false);
    setUserDetails({ firstName: '', middleName: '', lastName: '', suffix: { suffix: '', id: '' }, email: '', phone: '', ssoId: { id: '' } });
    setProviderType({});
    setAddress({ city: '', state: '', zipcode: '' });
    setSiteLevel(false);
    setDepartmentLevel(false);
    setSelectedRoles([]);
    setDepartmentTitleValues([]);
    setSiteTitleValues([]);
    setNpin({ npin: '', missing: false, na: false });
    if (type !== 'Add More') {
      getNewServiceProviderDialog(false);
    }
  }
  const getUsersData = async () => {
    const { data: user } = await GET('user-management-service/user');
    if (user) {
      setUsers(user);
    }
  }

  const onSelectDepartment = (deptId) => {
    let selectedSite = sites?.filter(data => data?.id === departmentLevelSite?.id)?.map(data => data)[0];
    let selectedDepartment = selectedSite?.department?.filter(data => data?.id === deptId)?.map(data => data?.name)[0];
    setDepartmentLevelDepartment({ id: deptId, name: selectedDepartment });
  }

  const handleSiteLevelValues = () => {
    if (siteLevelSite?.name === '' || siteLevelTitle?.title === '') {
      ErrorToaster('Selecting all the fields is mandatory');
      return;
    }
    setSiteTitleValues([...siteTitleValues, `${siteLevelSite?.name} - ${siteLevelTitle?.title}`]);
    let temp = sites;
    temp?.filter(data => data?.id === siteLevelSite?.id)?.map(data => {
      data.title = siteLevelTitle?.title;
      data.title_id = siteLevelTitle?.id;
    })
    setSites(temp);
    setSiteLevelSite({ id: '', name: '' });
    setSiteLevelTitle({ id: '', title: '' });
  }

  const handleDepartmentLevelValues = () => {
    if (departmentLevelSite?.name === '' || departmentLevelDepartment?.name === '' || departmentLevelTitle?.title === '') {
      ErrorToaster('Selecting all the fields is mandatory');
      return;
    }
    let valueString = `${departmentLevelSite?.name} - ${departmentLevelDepartment?.name} - ${departmentLevelTitle?.title}`
    setDepartmentTitleValues([...departmentTitleValues, valueString]);
    let temp = sites;
    let siteDepartment = sites?.filter(data => data?.id === departmentLevelSite?.id)?.map(data => data?.department)[0];
    siteDepartment?.filter(dept => dept?.id === departmentLevelDepartment?.id)?.map(dept => {
      dept.title = departmentLevelTitle?.title;
      dept.title_id = departmentLevelTitle?.id;
    })
    temp?.filter(data => data?.id === departmentLevelSite?.id)?.map(data => {
      data.department = siteDepartment;
    })
    setSites(temp);
    setDepartmentLevelSite({ id: '', name: '' });
    setDepartmentLevelDepartment({ id: '', name: '' });
    setDepartmentLevelTitle({ id: '', title: '' });
  }

  const handleSelectedDepartmentSite = (id) => {
    setDepartmentLevelSite({ id: id, name: sites?.filter(data => data?.id === id)?.map(data => data?.name)[0] });
  }

  const handleDeptRemove = (values, index) => {
    let data = values?.split(' - ');
    let site = data?.[0];
    let dept = data?.[1];
    let title = data?.[2];
    let temp = sites;
    let siteDepartment = sites?.filter(data => data?.name === site)?.map(data => data?.department)[0];
    siteDepartment?.filter(data => data?.name === dept && data?.title === title)?.map(data => {
      data.title = '';
      data.title_id = '';
    });
    temp?.filter(data => data?.name === site && data?.title)?.map(data => {
      data.department = siteDepartment;
    });
    setSites(temp);
    setDepartmentTitleValues(departmentTitleValues?.filter((data, indexVal) => index !== indexVal)?.map(data => data));
  }

  const handleSiteRemove = (values, index) => {
    let data = values?.split(' - ');
    let site = data?.[0];
    let title = data?.[1];
    let temp = sites;
    temp?.filter(data => data?.name === site && data?.title === title)?.map(data => {
      data.title = '';
      data.title_id = '';
    })
    setSites(temp);
    setSiteTitleValues(siteTitleValues?.filter((data, indexVal) => index !== indexVal)?.map(data => data));
  }

  const resetSiteLevel = (value) => {
    if (!value) {
      getTitleData();
    }
  }

  const resetDeptvalue = (value) => {
    if (!value) {
      getTitleData();
    }
  }

  const handleSuffixChange = (id, value) => {
    let suffix = { id: id, suffix: value }
    setUserDetails({ ...userDetails, suffix: suffix });
  }

  const getSiteData = () => {
    let siteData = [];
    sites?.map(data => {
      let deptData = [];
      data?.department?.map(dept => {
        deptData.push({
          "id": dept?.id,
          "departmentName": {
            "name": dept?.name
          },
          "departmentHead": {
            "id": ""
          },
          "departmentResponsibility": {
            "title": dept?.title,
            "id": dept?.title_id
          }
        })
      })
      siteData.push({
        id: data?.id,
        "siteName": {
          "siteName": data?.name
        },
        "departmentList": {
          "departments": deptData
        },
        "siteResponsibility": {
          "title": data?.title,
          "id": data?.title_id
        }
      })
    })
    return siteData;
  }

  console.log(userDetails);

  return (
    <Dialog isOpen={getNewServiceProviderDialog} onClose={() => getNewServiceProviderDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
      <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>New Service Provider</p>
          <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getNewServiceProviderDialog(false)} />
        </div>
        <div className={style.extensionBorder}></div>
        <div className={`${style.serviceBoxStyle}`}>
          <div className={`${style.extentionGrid}`}>
            <CommonLabel value='Contractor Name*' />
            <div className={style.grid3}>
              <CommonInputField className={style.fullWidth} value={userDetails?.firstName} placeholder="First" onChange={(e) => handleUserData('firstName', e.target.value)} />
              <CommonInputField className={style.fullWidth} value={userDetails?.middleName} placeholder="Middle" onChange={(e) => handleUserData('middleName', e.target.value)} />
              <CommonInputField className={style.fullWidth} value={userDetails?.lastName} placeholder="Last" onChange={(e) => handleUserData('lastName', e.target.value)} />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Service Provider Type*' />
            <div className={style.grid3}>
              <ProviderTypeList value={providerType?.id} onChangeFunc={(id, value) => setProviderType({ id: id, contractedServiceProviderType: value })} className={[style.fullWidth]} />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='NPIN*' />
            <div className={`${style.grid3} ${style.verticalAlignCenter}`}>
              <CommonInputField type="tel" maxLength={10} className={style.fullWidth}
                disabled={nPin?.missing || nPin?.na} value={nPin?.npin} onChange={(e) => e.target.value >= 0 && setNpin({ ...nPin, npin: e.target.value, na: false, missing: false })} />
              <CommonCheckBox value={nPin?.missing} checked={nPin?.missing} onChange={(e) => setNpin({ ...nPin, npin: '', missing: e.target.checked, na: false })} label="Missing" />
              <CommonCheckBox value={nPin?.na} checked={nPin?.na} onChange={(e) => setNpin({ ...nPin, npin: '', missing: false, na: e.target.checked })} label="Not Applicable" />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Suffix*' />
            <div className={style.grid3}>
              <SuffixList value={userDetails?.suffix?.id} onChangeFunc={(id, value) => handleSuffixChange(id, value)} className={[style.fullWidth]} />
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Allow Use of Alternate/ Personal Email Address' />
            <div className={style.displayInRow}>
              <CommonSwitch className={`${style.flexLeft} ${style.switchFontStyle}`} label={allowPersonalMail ? 'YES' : 'NO'} checked={allowPersonalMail} onChange={(e) => setAllowPersonalMail(!allowPersonalMail)} />
              {
                allowPersonalMail &&
                <div className={`${style.fullWidth} ${style.verticalAlignCenter}`}>
                  <CommonInputField placeholder="Enter Personal email" className={`${style.fullWidth}`} value={userDetails?.email} onChange={(e) => handleUserData('email', e.target.value)} />
                </div>
              }

            </div>
          </div>
          {!allowPersonalMail &&
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
              <CommonLabel value='Contract Entity Email*' />
              <div className={style.displayInRow}>
                <CommonInputField placeholder="Enter contract entity email" value={userDetails?.email} className={`${style.entityFieldWidth}`} onChange={(e) => handleUserData('email', e.target.value)} />
              </div>
            </div>
          }

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='SSO ID*' />
            <div className={style.displayInRow}>
              <CommonInputField placeholder="Enter SSO Id" value={userDetails?.ssoId?.id} className={`${style.entityFieldWidth}`} onChange={(e) => setUserDetails({ ...userDetails, ssoId: { id: e.target.value } })} />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Cell Phone*' />
            <div className={style.twoCol}>
              <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                <div className={`${style.plusOneText} ${style.marginRight}`}>+1</div>
                <CommonInputField placeholder="Numeric" maxLength={15} disabled={phoneNA} value={userDetails?.phone}
                  onChange={(e) => { handleUserData('phone', FormatPhoneNumber(e.target.value)); }} className={`${style.fullWidth}`} />
              </div>
              <CommonCheckBox value="NA" checked={phoneNA} onChange={(e) => { setPhoneNA(e.target.checked); if (e.target.checked) { handleUserData('phone', ''); } }} label="NA" />
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Address' />
            <div>
              <CommonInputField className={style.fullWidth} placeholder="Street"
                value={address?.addressLine}
                onChange={(e) => setAddress({ ...address, addressLine: e.target.value })} />
              <div className={`${style.grid3} ${style.marginTop20}`}>
                <CommonInputField className={style.fullWidth} placeholder="City" value={address.city} onChange={(e) => handleAddress('city', e.target.value)} />
                <CommonInputField className={style.fullWidth} placeholder="State" value={address.state} onChange={(e) => handleAddress('state', e.target.value)} />
                <CommonInputField className={style.fullWidth} placeholder="Zipcode" value={address.zipcode} onChange={(e) => handleAddress('zipcode', e.target.value)} />
              </div>
            </div>
          </div>

          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Site Level Responsibility*' />
            <div>
              <div className={style.flexLeft}>
                <CommonSwitch checked={siteLevel} className={`${style.flexLeft} ${style.switchFontStyle}`} onChange={() => { setSiteLevel(!siteLevel); resetSiteLevel(!siteLevel); }} label={siteLevel ? 'YES' : "NO"} />
              </div>
              {siteLevel && (
                <div className={`${style.siteLevelBoxStyle}`}>
                  <div className={`${style.siteLevelGrid}`}>
                    <div className={style.marginTop}>Site*</div>
                    <CommonSelectField value={siteLevelSite?.id || ''}
                      onChange={(e) => setSiteLevelSite({ id: e.target.value, name: sites?.filter(data => data?.id === e.target.value)?.map(data => data?.name)[0] })}
                      className={`${style.marginLeft20} ${style.weekSelectStyle}`}
                      firstOptionLabel={'Select Site'} firstOptionValue={''}
                      valueList={sites?.map(data => data?.id)}
                      labelList={sites?.map(data => data?.name)}
                      disabledList={sites?.map(data => data?.title !== '' ? true : false)} />
                  </div>
                  {/* )} */}
                  <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                    <div className={style.marginTop}>Title*</div>
                    <FunctionalTitleList value={siteLevelTitle?.id} onChangeFunc={(id, value) => setSiteLevelTitle({ id: id, title: value })} className={[style.marginLeft20, style.weekSelectStyle]} providerId={providerType?.id} />
                  </div>
                  <div className={`${style.addButtonPosition} ${style.marginTop20}`}>
                    <Button variant="outlined" onClick={() => handleSiteLevelValues()}>Add</Button>
                  </div>
                  <TagInput
                    // placeholder="Enter tags/keywords relative to the post"
                    values={siteTitleValues}
                    className={`${style.marginTop20}`}
                    onRemove={handleSiteRemove}
                    separator={/[\s,]/}
                    addOnBlur={true}
                    addOnPaste={true}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Department Level Responsibility*' />
            <div>
              <div className={style.flexLeft}>
                <CommonSwitch checked={departmentLevel} className={`${style.flexLeft} ${style.switchFontStyle}`} onChange={() => { setDepartmentLevel(!departmentLevel); resetDeptvalue(!departmentLevel) }} label={departmentLevel ? 'YES' : "NO"} />
              </div>
              <div>
                {departmentLevel && (
                  <div className={`${style.departmentLevelBoxStyle}`}>
                    <div className={`${style.siteLevelGrid}`}>
                      <div className={style.marginTop}>Site*</div>
                      <CommonSelectField value={departmentLevelSite?.id || ''}
                        onChange={(e) => handleSelectedDepartmentSite(e.target.value)}
                        className={`${style.marginLeft20} ${style.weekSelectStyle}`}
                        firstOptionLabel={'Select Site'} firstOptionValue={''}
                        valueList={sites?.map(data => data?.id)}
                        labelList={sites?.map(data => data?.name)}
                        disabledList={sites?.map(data => false)} />
                    </div>
                    <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                      <div className={style.marginTop}>Department*</div>
                      <CommonSelectField value={departmentLevelDepartment?.id || ''}
                        onChange={(e) => onSelectDepartment(e.target.value)}
                        className={`${style.marginLeft20} ${style.weekSelectStyle}`}
                        firstOptionLabel={'Select Department'} firstOptionValue={''}
                        valueList={selectedSitesDept?.map(data => data?.id)}
                        labelList={selectedSitesDept?.map(data => data?.name)}
                        disabledList={selectedSitesDept?.map(data => data?.title !== '' ? true : false)} />
                    </div>
                    <div className={`${style.siteLevelGrid} ${style.marginTop10}`}>
                      <div className={style.marginTop}>Title*</div>
                      <FunctionalTitleList value={departmentLevelTitle?.id} onChangeFunc={(id, value) => setDepartmentLevelTitle({ id: id, title: value })} className={[style.marginLeft20, style.weekSelectStyle]} providerId={providerType?.id} />
                    </div>
                    <div className={`${style.addButtonPosition} ${style.marginTop20}`}>
                      <Button variant="outlined" onClick={() => handleDepartmentLevelValues()}>Add</Button>
                    </div>
                    <TagInput
                      values={departmentTitleValues}
                      className={`${style.marginTop20}`}
                      onRemove={handleDeptRemove}
                      separator={/[\s,]/}
                      addOnBlur={true}
                      addOnPaste={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`${style.extentionGrid} ${style.marginTop20}`}>
            <CommonLabel value='Assign Contractor With App User Role*' />
            <div>
              <CommonSelectField onChange={(e) => handleRoles(e.target.value)}
                className={`${style.fullWidth}`}
                firstOptionLabel={'Select Role-multi select'} firstOptionValue={'0'}
                valueList={roles?.map(data => data?.roleName)}
                labelList={roles?.map(data => data?.roleName)}
                disabledList={roles?.map(data => false)} />
              <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                {rolesTags}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={`${style.floatRight} ${style.marginTop20}`}>
            <button className={`${style.buttonStyle}  ${style.cursorPointer} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => handleSave('Add More') : {}}>ADD MORE</button>
            <button className={`${style.buttonStyle}  ${style.cursorPointer} ${style.marginLeft20} ${continueLoading ? style.disabled : ''}`} onClick={!continueLoading ? () => handleSave('Save & Exit') : {}}>SAVE & EXIT</button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default NewServiceProvider;
