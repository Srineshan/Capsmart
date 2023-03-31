import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput } from '@blueprintjs/core';
import { Link, useNavigate } from 'react-router-dom';
import Step1 from './../../images/step34.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step33.png';
import Step4 from './../../images/step3.png';
import Step5 from './../../images/step55.png';
import DatalistInput from 'react-datalist-input';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useParams } from 'react-router-dom';
import UploadImg from './../../images/uploadImg.png';
import { Auth } from './../../utils/auth';
import { saveEntity, GET, PUT, POST, role, TenantID, isSuperAdminAccess } from './../dataSaver';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';
import SiteInformation from './siteInformation';
import SiteUsers from './siteUsers';
import axios from "axios";
import AppSubscription from './appSubscription';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import EntitySystemAdmin from './entitySystemAdmin';
import IndustryList from './../../Components/IndustryList';
import EntityTypeList from './../../Components/EntityType';
import DepartmentList from './../../Components/DepartmentList';
import SaveInProgress from './saveInProgressAlert';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import ContractAndBillingDetails from './contractAndBillingDetails';
import Welcome from './welcome';
import CommonInputField from '../../Components/CommonFields/CommonInputField';

const EntitySetup = () => {
  let { id, page } = useParams();
  let navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [departmentSpecific, setDepartmentSpecific] = useState(false);
  const [departmentValue, setDepartmentValue] = useState('');
  const [item, setItem] = useState();
  const [multiSiteEntity, setMultiSiteEntity] = useState(false);
  const [department, setDepartment] = useState([]);
  const [allSites, setAllSites] = useState([]);
  const [activeStep, setActiveStep] = useState('');
  const [billing, setBilling] = useState();
  const [trial, setTrial] = useState();
  const [subscription, setSubscription] = useState();
  const [accountManager, setAccountManager] = useState();
  const [entityDepartments, setEntityDepartments] = useState([]);
  const [selectDepartments, setSelectDepartments] = useState([]);
  const [entityData, setEntityData] = useState();
  const [showSaveInProgress, setShowSaveInProgress] = useState(false);
  const [logo, setLogo] = useState({ name: '', url: '', file: null });
  const [thumbnail, setThumbnail] = useState({ name: '', url: '', file: null });
  const [entity, setEntity] = useState({ id: '', customerType: '', npin: '', npinNA: false, name: '', type: { type: '', id: '' }, subdomain: '', multiSiteEntity: false, primarySiteToUseApp: false, canSetupDepartment: false, officialEmailDomain: '' });
  const [address, setAddress] = useState({ addressLine: '', city: '', state: '', country: '', zipcode: '' });
  const [isUpdated, setIsUpdated] = useState(false);
  const [unassignedKeys, setUnassignedKeys] = useState([]);
  const Fields = { customerType: 'Customer Type', npin: 'NPIN', name: 'Entity Name', type: 'Entity Type', addressLine: 'Address Line', city: 'City', state: 'State', country: 'Country', zipcode: 'Zipcode', subdomain: 'Subdomain' };
  const role = '';
  const accessToken = Auth();

  useEffect(() => {
    getEntityData();
    getDepartmentData();
  }, []);

  useEffect(() => {
    getDepartmentData();
  }, [departmentSpecific])

  // useEffect(()=>{
  //   if(entity.npin?.length === 10){
  //     getNPIData();
  //   }
  // },[entity.npin])
  //
  // const getNPIData = () => {
  //   fetch(`https://npiregistry.cms.hhs.gov/api/?number=${entity?.npin}&enumeration_type=NPI-2&version=2.1`,{
  //       method: 'GET',
  //       mode: 'cors',
  //       headers:{"Access-Control-Allow-Origin" : "*",
  //                "Access-Control-Allow-Headers" : "X-Requested-With",
  //               }
  //   })
  //   .then(response=>{
  //     console.log('response',response);
  //   })
  //   .catch(error=>{
  //     console.log('error',error);
  //   })
  // }

  const getActiveStep = (value) => {
    setActiveStep(value)
  }

  const getSaveInProgressAlert = (value) => {
    setShowSaveInProgress(value);
  }

  const getIsContinue = (value) => {
    console.log('entered')
    if (value) {
      console.log('entered')
      getEntityData();
    }
  }

  const getEntityData = async () => {
    const { data: data } = await GET(`entity-service/entity/${id}`);
    setEntityData(data);
    let siteData = data?.sites?.filter(data => data.primarySite === true)?.map(data => data)[0];
    setEntity({ id: '', customerType: data?.industryId?.id, name: data?.entityName?.entityName, type: { type: data?.entityType?.type, id: data?.entityType?.id }, subdomain: data?.subdomain, multiSiteEntity: data?.multiSiteEntity, primarySiteToUseApp: data.canPrimarySiteToUseApp, npin: data?.npin?.id, npinNA: data?.npin?.notApplicable, officialEmailDomain: data?.officialEmailDomain?.officialEmail });
    setAddress({ city: siteData?.address?.city, state: siteData?.address?.state, zipcode: siteData?.address?.zipcode, addressLine: siteData?.address?.addressLine, country: siteData?.address?.country });
    setSelectDepartments(siteData?.departmentList?.departments);
    setDepartmentSpecific(siteData?.canSetupDepartment);
    setLogo({ ...logo, url: data?.logo?.file?.fileURL || '' });
    setThumbnail({ ...thumbnail, url: data?.logoThumbnail?.file?.fileURL || '' });
    console.log('entered', entityData)
  }

  console.log(entityData)


  const getDepartmentData = async () => {
    await GET(`entity-service/department?siteTypeId=${entity?.type?.id}`)
      .then(response => {
        setEntityDepartments(response?.data);
        console.log('data', response)
      })
      .catch(error => {
        console.log('error', error);
      })
  }

  const inputGroupElement = (value) => {
    return (
      <div className={style.subdomainElementStyle}>
        <p className={value === 'https://' ? `${style.marginTop7} ${style.marginLeft10}` : `${style.marginTop7}`}>{value}</p>
      </div>
    )
  }

  const handleTagsAdd = async (values) => {
    let temp = selectDepartments;
    temp.push({
      "departmentName": {
        "name": values
      },
      "departmentHead": {
        "id": ""
      }
    })
    setSelectDepartments(temp);
    setIsUpdated(true);
  };

  const onSelect = (selectedItem) => {
    if (!selectDepartments?.map(data => data?.id)?.includes(selectedItem?.id)) {
      setItem(selectedItem);
      let temp = selectDepartments;
      temp.push(selectedItem);
      setSelectDepartments(temp);
      setIsUpdated(true);
    }
  }

  const handleTagsRemove = (tags, index) => {
    setSelectDepartments(selectDepartments?.filter((data, indexValue) => indexValue !== index)?.map(data => data));
    setIsUpdated(true);
  };

  const handleEntity = (name, value) => {
    setEntity({ ...entity, [name]: value });
    setIsUpdated(true);
  }

  const handleAddress = (name, value) => {
    setAddress({ ...address, [name]: value });
    setIsUpdated(true);
  }

  const nextStep = multiSiteEntity === true ? "siteInformation" : "siteUsers"

  const items = useMemo(
    () =>
      entityDepartments?.map((option) => ({
        id: option?.id,
        value: option.departmentName.name,
        ...option,
      })),
    [entityDepartments],
  );


  const mandatoryFieldCheck = (buttonType) => {
    if (entity?.customerType === '' || entity?.customerType === null) {
      ErrorToaster('Customer Type Is Mandatory');
      return;
    }
    if ((!entity?.npinNA && entity?.npin === '') || (!entity?.npinNA && entity?.npin === null)) {
      ErrorToaster('NPIN is Mandatory if not NA');
      return;
    }
    if (entity?.type?.type === '' || entity?.type?.type === null) {
      ErrorToaster('Entity Type Is Mandatory');
      return;
    }
    if (entity.subdomain === '' || entity?.subdomain === null) {
      ErrorToaster('Subdomain Is Mandatory');
      return;
    }
    if (entity?.officialEmailDomain === '' || entity?.officialEmailDomain === null) {
      ErrorToaster('Official Email Domain Is Mandatory');
      return;
    }
    if (buttonType === 'SaveInProgress') {
      saveInProgressCheck();
    }
    else {
      updateEntity('Continue');
    }
  }

  console.log(entity)

  const saveInProgressCheck = () => {
    var keys = Object.keys(entity)?.filter(key => entity[key] === '' && key !== 'id' || entity[key] === null)?.map(data => Fields[data]);
    var addressKeys = Object.keys(address)?.filter(key => address[key] === '')?.map(data => Fields[data]);
    if (logo === null) {
      keys.push('Logo');
    }
    if (thumbnail === null) {
      keys.push('Logo Thumbnail');
    }
    keys.push(...addressKeys);
    setUnassignedKeys(keys);
    if (keys?.length !== 0) {
      setShowSaveInProgress(true);
    } else {
      updateEntity('SaveInProgress');
    }
  }

  const saveInProgressFunction = () => {
    updateEntity('SaveInProgress');
  }

  console.log('entity depts', entityDepartments);


  const updateEntity = async (type) => {
    console.log('entity depts', entityDepartments);
    if (isUpdated) {
      let filteredValue = entityData?.sites?.filter(data => data.primarySite !== true)?.map(data => data) || [];
      let primarySiteValue = entityData?.sites?.filter(data => data.primarySite === true)?.map(data => data)[0];
      let temp = {
        ...(entityData?.sites?.filter(data => data.primarySite === true)?.map(data => data)?.length !== 0 && { 'id': primarySiteValue?.id }),
        "siteName": {
          "siteName": entity?.name,
        },
        "siteAdmin": {
          "id": ""
        },
        "siteDisplayId": {
          "id": primarySiteValue?.siteDisplayId?.id,
        },
        "siteType": {
          "type": entity?.type?.type,
          "id": entity?.type?.id,
        },
        "npin": {
          "id": entity?.npin,
          "notApplicable": entity?.npinNA,
        },
        "canSetupDepartment": departmentSpecific,
        "departmentList": {
          "departments": departmentSpecific ? selectDepartments : entityDepartments,
        },
        "address": {
          "addressLine": address.addressLine,
          "city": address.city,
          "state": address.state,
          "zipcode": address.zipcode,
          "country": address.country,
        },
        "primarySite": true
      }
      filteredValue.push(temp);
      const updatedValue =
      {
        "id": entityData?.id,
        "entityName": entityData?.entityName,
        "entityType": {
          "id": entity?.type?.id,
          "type": entity?.type?.type,
        },
        "multiSiteEntity": entity?.multiSiteEntity,
        "entityDisplayId": entityData?.entityDisplayId,
        "entityAbbrevation": entityData?.entityAbbrevation,
        "partner": entityData?.partner,
        "industryId": {
          "id": entity?.customerType,
        },
        "npin": {
          "id": entity?.npin,
          "notApplicable": entity?.npinNA,
        },
        "mailingAddress": {
          "addressLine": address.addressLine,
          "city": address.city,
          "state": address.state,
          "zipcode": address.zipcode,
          "country": address.country,
        },
        "officialEmailDomain": {
          "officialEmail": entity?.officialEmailDomain
        },
        "subdomain": entity?.subdomain,
        "canPrimarySiteToUseApp": entity?.primarySiteToUseApp,
        "sites": filteredValue,
        "subscriptionPlan": entityData?.subscriptionPlan,
        "billingDetails": entityData?.billingDetails,
        "contractDetails": entityData?.contractDetails,
        "accountManager": entityData?.accountManager,
        "appUserRoles": entityData?.appUserRoles,
        "logo": entityData?.logo,
        "logoThumbnail": entityData?.logoThumbnail,
      }

      const formData = new FormData();
      formData.append('entity', new Blob([JSON.stringify(updatedValue)], {
        type: "application/json"
      }));

      await PUT('entity-service/entity', formData)
        .then(response => {
          SuccessToaster('Entity Updated Successfully');
          id = response?.data?.id;
          if (logo?.name !== '') {
            handleLogoUpload(response?.data?.id);
          }
          if (thumbnail?.name !== '') {
            handleThumbnailUplaod(response?.data?.id);
          }
        }).catch(error => {
          console.log('error', error);
          ErrorToaster('Unexpected Error Updating Entity');
        });
      setIsUpdated(false);
    }
    setUnassignedKeys([]);
    if (id === TenantID) {
      sessionStorage.setItem('logo', entityData?.logo?.file?.fileURL);
      sessionStorage.setItem('thumbnail', entityData?.logoThumbnail?.file?.fileURL);
      sessionStorage.setItem('entityTypeId', entity?.typeId);
      sessionStorage.setItem('entityTypeValue', entity?.type);
      sessionStorage.setItem('industry', entity?.customerType);
      sessionStorage.setItem('title', entity?.name);
    }
    if (type === 'Continue') {
      navigate(entity.multiSiteEntity === true ? `/entitySetup/${TenantID}/siteInformation` : isSuperAdminAccess ? `/entitySetup/${TenantID}/entitySystemAdmin` : `/entitySetup/${TenantID}/siteUsers`);
    } else {
      navigate('/user');
    }
  }

  const handleDeptChange = (value) => {
    if (value !== '') {
      setDepartmentValue(value);
    }
  }

  const handleLogoFile = (e) => {
    setIsUpdated(true);
    setLogo({ ...logo, url: URL.createObjectURL(e.target.files[0]) || '', name: e.target?.files?.[0]?.name || '', file: e.target.files[0] });
  }

  const handleLogoUpload = async (entityId) => {
    const formData = new FormData();
    let data = {
      "file": {
        "fileName": logo?.name
      }
    }
    if (logo === null) {
      formData.append('logo', new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));
      formData.append('logoFile', logo?.file);

      await POST(`entity-service/entity/${entityId}/logo`, formData)
        .then(response => {
          SuccessToaster('Company Logo Updated Successfully');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error Occured');
        })
    } else {
      data.id = entityData?.logo?.id;
      formData.append('logo', new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));
      formData.append('logoFile', logo?.file);

      await PUT(`entity-service/entity/${entityId}/logo`, formData)
        .then(response => {
          SuccessToaster('Company Logo Updated Successfully');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error Occured');
        })
    }

  }

  const handleThumbnailFile = (e) => {
    setIsUpdated(true);
    setThumbnail({ ...thumbnail, url: URL.createObjectURL(e.target.files[0]) || '', name: e.target?.files?.[0]?.name || '', file: e.target.files[0] });
  }

  const handleThumbnailUplaod = async (entityId) => {
    const formData = new FormData();
    let data = {
      "file": {
        "fileName": thumbnail?.name
      }
    }
    if (thumbnail?.url === '') {
      formData.append('logoThumbnail', new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));
      formData.append('logoThumbnailFile', thumbnail?.file);

      await POST(`entity-service/entity/${entityId}/logoThumbnail`, formData)
        .then(response => {
          SuccessToaster('Logo Thumbnail Updated Successfully');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error Occured');
        })
    } else {
      data.id = entityData?.logoThumbnail?.id;
      formData.append('logoThumbnail', new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));
      formData.append('logoThumbnailFile', thumbnail?.file);

      await PUT(`entity-service/entity/${entityId}/logoThumbnail`, formData)
        .then(response => {
          SuccessToaster('Logo Thumbnail Updated Successfully');
        })
        .catch(error => {
          ErrorToaster('Unexpected Error Occured');
        })
    }
  }

  const handleEntityTypeChange = (id, value) => {
    let type = { id: id, type: value };
    setEntity({ ...entity, type: type });
    setIsUpdated(true);
  }

  return (

    (!entityData?.hideWelcomeScreen && !isSuperAdminAccess) ? (
      <Welcome getIsContinue={getIsContinue} />
    ) : (
      <>
        {page === "entitySetup" ? (
          <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} onClick={() => isSuperAdminAccess ? navigate('/activeCustomers') : navigate('/entitySitePortal')} />
            <div className={style.stepperMargin}>
              <div className={isSuperAdminAccess ? style.stepperGrid : style.stepperGrid4}>
                <div onClick={() => navigate(`/entitySetup/${TenantID}/appSubscription`)}>
                  <div className={style.justifyCenter}>
                    <div className={`${style.stepperImgBackground} ${style.completedStepperStyle} `}>
                      <img src={Step5} alt="Step1" className={style.stepperImgStyle} />
                    </div>
                  </div>
                  <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SUBSCRIPTION PLAN</p>
                </div>
                <div onClick={() => navigate(`/entitySetup/${TenantID}/contractAndBilling`)}>
                  <div className={style.justifyCenter}>
                    <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                      <img src={Step1} alt="Step2" className={style.stepperImgStyle} />
                    </div>
                  </div>
                  <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>CONTRACT & BILLING</p>
                </div>
                <div onClick={() => navigate(`/entitySetup/${TenantID}/entitySetup`)}>
                  <div className={style.justifyCenter}>
                    <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                      <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                    </div>
                  </div>
                  <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                </div>
                <div onClick={() => entityData?.multiSiteEntity && navigate(`/entitySetup/${TenantID}/siteInformation`)} className={!entityData?.multiSiteEntity && style.disabledView}>
                  <div className={style.justifyCenter}>
                    <div className={`${style.stepperImgBackground}`}>
                      <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                    </div>
                  </div>
                  <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                </div>
                {
                  isSuperAdminAccess && (
                    <div onClick={() => navigate(`/entitySetup/${TenantID}/entitySystemAdmin`)}>
                      <div className={style.justifyCenter}>
                        <div className={`${style.stepperImgBackground}`}>
                          <img src={Step2} alt="Step5" className={style.stepperImgStyle} />
                        </div>
                      </div>
                      <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SYSTEM ADMIN</p>
                    </div >
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
              </div >
              <div className={isSuperAdminAccess ? style.stepperDivider3 : style.stepperDivider4grid4}></div>
            </div >
            <div className={style.entitySetupCardStyle}>
              <p className={style.heading}>Entity Setup</p>
              <div className={style.greyBorder}></div>
              <div className={style.entityDescription}>
                In this step provide the necessary information required to setup the primary entity for use of the application, as well as any sub-sites (if applicable). In this step you can also provide the required information for setting up Single Sign-on. All data fields marked with an "*" are mandatory.
                If you do not have all of the information, you can save this customer's entity information as an In-progress account.
              </div>
              <div>
                <div className={style.cloneBlockStyle}>
                  <div className={`${style.newContractFromCloneBoxStyle}`}>
                    <div className={style.spaceBetween}>
                      <div className={style.displayInRow}>

                        <label for="logo-upload">
                          <div className={style.displayInRow}>
                            <img src={logo?.url || UploadImg} alt="Upload" className={`${style.companyLogoUpload} ${style.cursor}`} />

                            <input id="logo-upload" type="file" onChange={handleLogoFile} className={style.hidden} />
                            <p className={style.uploadText}>Click To Upload Company Logo</p>
                          </div>
                        </label>

                        <label for="thumbnail-upload">
                          <div className={style.displayInRow}>
                            <img src={thumbnail?.url || UploadImg} alt="Upload" className={`${style.logoThumbnailUpload} ${style.cursor}`} />

                            <input id="thumbnail-upload" type="file" onChange={handleThumbnailFile} className={style.hidden} />
                            <p className={style.uploadText}>Click To Upload Logo Thumbnail</p>
                          </div>
                        </label>
                      </div>
                      {entityData?.entityDisplayId?.id ? <div>
                        <button className={style.entityIDButton}><span>ENTITY ID:</span>{entityData?.entityDisplayId.id}</button>
                      </div> : ''}
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                      <div className={style.extentionLableStyle}>Customer Type*</div>
                      <div className={`${style.leftAlign} `}>
                        <IndustryList value={entity?.customerType} onChangeFunc={(value) => handleEntity('customerType', value)} className={[style.twoFieldWidth]} />
                      </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>NPIN*</div>
                      <div className={style.displayInRow}>
                        <CommonInputField className={style.fourFieldWidth}
                          placeholder="NPIN"
                          value={entity?.npin}
                          type="tel"
                          maxLength={10}
                          disabled={entity?.npinNA}
                          onChange={(e) => e.target.value >= 0 && handleEntity('npin', e.target.value)} />
                        <CommonCheckBox value="NA" className={style.marginLeft20}
                          checked={entity?.npinNA} onChange={(e) => { handleEntity('npinNA', e.target.checked) }}
                          label="NA" />
                      </div>
                    </div>
                    {/* <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Entity Name*</div>
                      <InputGroup className={`${style.twoFieldWidth}`} value={entity?.name} onChange={(e) => handleEntity('name', e.target.value)} />
                    </div> */}
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Entity Type*</div>
                      <div className={`${style.leftAlign} `}>
                        <EntityTypeList value={entity?.type?.id} onChangeFunc={(id, value) => handleEntityTypeChange(id, value)} className={[style.twoFieldWidth]} industryId={entity?.customerType} />
                      </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Mailing Address*</div>
                      <div>
                        <InputGroup value={address.addressLine} className={`${style.fullWidth}`} onChange={(e) => handleAddress('addressLine', e.target.value)} />
                        <div className={`${style.marginTop20} ${style.displayInRow}`}>
                          <InputGroup placeholder="City" className={`${style.fourFieldWidth}`} value={address.city} onChange={(e) => handleAddress('city', e.target.value)} />
                          <InputGroup placeholder="State" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.state} onChange={(e) => handleAddress('state', e.target.value)} />
                          <InputGroup placeholder="Country" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.country} onChange={(e) => handleAddress('country', e.target.value)} />
                          <InputGroup placeholder="Zipcode" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.zipcode} onChange={(e) => handleAddress('zipcode', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Subdomain*</div>
                      <InputGroup value={entity.subdomain} leftElement={inputGroupElement('https://')} rightElement={inputGroupElement('.timesmartai.com')} placeholder="Subdomain Name" className={style.subdomainFieldWidth} onChange={(e) => handleEntity('subdomain', e.target.value)} />
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Official Email Domain*</div>
                      <InputGroup value={entity.officialEmailDomain} placeholder="xxxxxx" className={style.subdomainFieldWidth} onChange={(e) => handleEntity('officialEmailDomain', e.target.value)} />
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                      <div className={style.extentionLableStyle}>Multi-site Entity*</div>
                      <div>
                        <div className={style.displayInRow}>
                          <FormControlLabel
                            control={
                              <Switch checked={entity.multiSiteEntity} className={` ${style.textAlignLeft}`} value={entity.multiSiteEntity} onChange={(e) => { handleEntity('multiSiteEntity', e.target.checked) }} />
                            }
                            className={style.switchFontStyle}
                            label={entity?.multiSiteEntity ? 'YES' : 'NO'}
                          />
                          {entity.multiSiteEntity && (
                            <>
                              <div className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Primary Site To Use App*</div>
                              <FormControlLabel
                                control={
                                  <Switch checked={entity.primarySiteToUseApp} onChange={(e) => handleEntity('primarySiteToUseApp', e.target.checked)} className={` ${style.textAlignLeft} ${style.marginLeft20}`} />
                                }
                                className={style.switchFontStyle}
                                label={entity?.primarySiteToUseApp ? 'YES' : 'NO'}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {!isSuperAdminAccess && (
                      <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Setup Department*</div>
                        <div>
                          <div className={style.displayInRow}>
                            <FormControlLabel
                              control={
                                <Switch checked={departmentSpecific} className={`${style.textAlignLeft}`} onChange={() => { setDepartmentSpecific(!departmentSpecific); setIsUpdated(true); }} />
                              }
                              className={style.switchFontStyle}
                              label={departmentSpecific ? 'YES' : "NO"}
                            />
                            {departmentSpecific &&
                              (
                                <DepartmentList value={item?.id} onChangeFunc={(selectedItem) => onSelect(selectedItem)} className={[style.fullWidth, style.textAlignLeft]} entityTypeId={entity?.type?.id} />
                              )
                            }
                          </div>
                          {departmentSpecific && (
                            <TagInput
                              placeholder="Selected Department list"
                              values={selectDepartments?.map(data => data?.departmentName?.name) || []}
                              key={`tags${tags}`}
                              className={`${style.marginTop20} ${style.tagInputStyle}`}
                              onAdd={handleTagsAdd}
                              onRemove={handleTagsRemove}
                              separator={/[\s,]/}
                              addOnBlur={true}
                              addOnPaste={true}
                            />
                          )}
                        </div>
                      </div>

                    )}
                  </div>
                  <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton} onClick={() => { mandatoryFieldCheck('SaveInProgress'); }}>SAVE IN-PROGRESS</button>
                    {/* <Link to={`/${nextStep}`}> */}
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => { mandatoryFieldCheck('Continue'); }}>CONTINUE</button>
                    {/* </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div >
        ) : page === "siteInformation" ? (
          <SiteInformation getActiveStep={getActiveStep} />
        ) : page === "entitySystemAdmin" ? (
          <EntitySystemAdmin getActiveStep={getActiveStep} />
        ) : page === "siteUsers" ? (
          <SiteUsers getActiveStep={getActiveStep} />
        ) : page === "contractAndBilling" ? (
          <ContractAndBillingDetails getActiveStep={getActiveStep} />
        ) : (
          <AppSubscription getActiveStep={getActiveStep} />
        )}
        <SaveInProgress alert={showSaveInProgress} getSaveInProgressAlert={getSaveInProgressAlert} fieldData={unassignedKeys?.join(', ')} saveInProgressFunction={saveInProgressFunction} />
      </>
    )
  )
}

export default EntitySetup;
