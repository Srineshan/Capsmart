import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput } from '@blueprintjs/core';
import {Link, useNavigate} from 'react-router-dom';
import Step1 from './../../images/step1.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step3.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import DatalistInput from 'react-datalist-input';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useParams } from 'react-router-dom';
import UploadImg from './../../images/uploadImg.png';
import EntityStepper from './entityStepper';
import {Auth} from './../../utils/auth';
import {saveEntity,GET,PUT,POST,role,TenantID,isSuperAdminAccess} from './../dataSaver';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';
import SiteInformation from './siteInformation';
import SiteUsers from './siteUsers';
import axios from "axios";
import AppSubscription from './appSubscription';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import EntitySystemAdmin from './entitySystemAdmin';
import SaveInProgress from './saveInProgressAlert';

const EntitySetup = () => {
    let {id} = useParams();
    let navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [departmentSpecific, setDepartmentSpecific] = useState(false);
    const [departmentValue, setDepartmentValue] = useState('');
    const [item, setItem] = useState();
    const [multiSiteEntity,setMultiSiteEntity] = useState(false);
    const [department,setDepartment] = useState([]);
    const [allSites,setAllSites] = useState([]);
    const [activeStep, setActiveStep] = useState('entitySetup');
    const [billing,setBilling] = useState();
    const [trial,setTrial] = useState();
    const [subscription,setSubscription] = useState();
    const [accountManager,setAccountManager] = useState();
    const [entityDepartments,setEntityDepartments] = useState([]);
    const [selectDepartments, setSelectDepartments] = useState([]);
    const [entityData,setEntityData] = useState();
    const [showSaveInProgress,setShowSaveInProgress] = useState(false);
    const [logo,setLogo] = useState(null);
    const [thumbnail,setThumbnail] = useState(null);
    const [entity,setEntity] = useState({id:'',customerType:"HEALTHCARE",npin:'',name:'',type:'',subdomain:'',multiSiteEntity:false,primarySiteToUseApp:false,canSetupDepartment:false});
    const [address,setAddress] = useState({addressLine:'',city:'',state:'',country:'',zipcode:''});
    const [isUpdated,setIsUpdated] = useState(false);
    const [unassignedKeys,setUnassignedKeys] = useState([]);
    const Fields = {customerType: 'Customer Type', npin:'NPIN', name:'Entity Name', type:'Entity Type', addressLine:'Address Line', city:'City', state:'State', country:'Country', zipcode:'Zipcode', subdomain:'Subdomain'};
    const role = '';
    const accessToken = Auth();

    useEffect(()=>{
      if(id !== 'new'){
        getEntityData();
        getDepartmentData();
      }
      },[]);

    const getActiveStep = (value) => {
      setActiveStep(value)
    }

    const getSaveInProgressAlert = (value) => {
      setShowSaveInProgress(value);
    }

    const getEntityData = async() => {
      const {data: data} = await GET(`entity-service/entity/${id}`);
      setEntityData(data);
      let siteData = data?.sites?.filter(data=>data.primarySite === true)?.map(data=>data)[0];
      setEntity({id:'',customerType:"HEALTHCARE",name:data?.entityName?.entityName,type:data?.entityType?.type,subdomain:data?.subdomain,multiSiteEntity:data?.multiSiteEntity,primarySiteToUseApp:data.canPrimarySiteToUseApp,npin:siteData?.npin?.id});
      setAddress({city:siteData?.address?.city,state:siteData?.address?.state,zipcode:siteData?.address?.zipcode,addressLine:siteData?.address?.addressLine,country:siteData?.address?.country});
      setSelectDepartments(siteData?.departmentList?.departments);
      setDepartmentSpecific(siteData?.canSetupDepartment);
      setLogo(data?.logo?.file?.fileURL || null);
      setThumbnail(data?.logoThumbnail?.file?.fileURL || null);
    }

    const getDepartmentData = async() => {
      const {data: department} = await GET('entity-service/department');
      if(department){
        setEntityDepartments(department)
      }else{
        console.log('error');
      }
    }

    const inputGroupElement = (value) => {
        return(
          <div className={style.subdomainElementStyle}>
            <p className={value === 'https://' ? `${style.marginTop7} ${style.marginLeft10}` : `${style.marginTop7}`}>{value}</p>
          </div>
        )
    }

    const handleTagsAdd = async(values) => {
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
      setItem(selectedItem);
      let temp = selectDepartments;
      temp.push(selectedItem);
      setSelectDepartments(temp);
      setIsUpdated(true);
    }

      const handleTagsRemove = (tags, index) => {
        setSelectDepartments(selectDepartments?.filter((data,indexValue)=>indexValue!==index)?.map(data=>data));
        setIsUpdated(true);
      };

      const handleEntity = (name,value) => {
        setEntity({...entity,[name]:value});
        setIsUpdated(true);
      }

      const handleAddress = (name,value) => {
        setAddress({...address, [name]:value});
        setIsUpdated(true);
      }

    const nextStep = multiSiteEntity === true ?"siteInformation":"siteUsers"

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
      if(entity?.name === ''){
        ErrorToaster('Entity Name is Mandatory');
        return;
      }
      if(entity?.type === ''){
        ErrorToaster('Entity Type is Mandatory');
        return;
      }
      if(entity?.subdomain === null){
        ErrorToaster('Subdomain is Mandatory');
        return;
      }
      if(buttonType === 'SaveInProgress'){
        saveInProgressCheck();
      }
      else{
        updateEntity('Continue');
      }
    }

    const saveInProgressCheck = () => {
      var keys = Object.keys(entity)?.filter(key=> entity[key] === '' && key !== 'id')?.map(data=>Fields[data]);
      var addressKeys = Object.keys(address)?.filter(key => address[key] === '')?.map(data=>Fields[data]);
      if(logo === null){
        keys.push('Logo');
      }
      if(thumbnail === null){
        keys.push('Logo Thumbnail');
      }
      keys.push(...addressKeys);
      setUnassignedKeys(keys);
      if(keys?.length !== 0){
        setShowSaveInProgress(true);
      }else{
        updateEntity('SaveInProgress');
      }
    }

    const saveInProgressFunction = () => {
      updateEntity('SaveInProgress');
    }


  const updateEntity = async(type) => {
    if(isUpdated){
      let filteredValue = entityData?.sites?.filter(data=>data.primarySite !== true)?.map(data=>data) || [];
      let primarySiteValue = entityData?.sites?.filter(data=>data.primarySite === true)?.map(data=>data)[0];
      let temp = {
          ...( entityData?.sites?.filter(data=>data.primarySite === true)?.map(data=>data)?.length !== 0 && {'id':primarySiteValue?.id}),
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
          "type": entity?.type,
        },
        "npin": {
          "id": entity?.npin
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
          "entityName": {
            "entityName": entity?.name,
          },
          "entityType": {
            "type": entity?.type,
          },
          "multiSiteEntity":entity?.multiSiteEntity,
          "entityDisplayId": entityData?.entityDisplayId,
          "customerType": entity?.customerType,
          "subdomain":entity?.subdomain,
          "canPrimarySiteToUseApp":entity?.primarySiteToUseApp,
          "sites": filteredValue,
          "subscriptionPlan": entityData?.subscriptionPlan,
          "billingDetails": entityData?.billingDetails,
          "contractDetails":entityData?.contractDetails,
          "accountManager":entityData?.accountManager,
          "appUserRoles":entityData?.appUserRoles
        }
        if(id !== 'new'){
          await PUT('entity-service/entity',updatedValue)
            .then(response=>{
            SuccessToaster('Entity Updated Successfully');
            }).catch(error=>{
              console.log('error',error);
              ErrorToaster('Unexpected Error Updating Entity');
            });
        }else{
          await POST('entity-service/entity',updatedValue)
            .then(response=>{
              console.log('response',response);
            let newEntityId = response?.data?.id;
            if(type==='Continue'){
              window.location = `/app/entitySetup/${newEntityId}`
            }
            SuccessToaster('Entity Updated Successfully');
            }).catch(error=>{
              console.log('error',error);
              ErrorToaster('Unexpected Error Updating Entity');
            });
        }
        setIsUpdated(false);
      }
      setUnassignedKeys([]);
    if(type === 'Continue'){
      setActiveStep(entity.multiSiteEntity === true ?"siteInformation":isSuperAdminAccess?"entitySystemAdmin":"siteUsers");
    }else {
      navigate('/user');
    }
    }

    const handleDeptChange = (value) => {
      if(value !== ''){
        setDepartmentValue(value);
      }
    }

    const handleLogoUpload = async(e) => {
      setLogo(URL.createObjectURL(e.target.files[0]));
      const formData = new FormData();
      let data = {
        "file":{
          "fileName":e.target?.files?.[0]?.name || ''
        }
      }
      if(logo === null){
        data.id = entityData?.logo?.id;
        formData.append('logo', new Blob([JSON.stringify(data)], {
         type: "application/json"
         }));
         formData.append('logoFile',e.target.files[0]);

         await POST(`entity-service/entity/${TenantID}/logo`, formData)
         .then(response=>{
           SuccessToaster('Company Logo Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error Occured');
         })
      }else{
        formData.append('logo', new Blob([JSON.stringify(data)], {
         type: "application/json"
         }));
         formData.append('logoFile',e.target.files[0]);

         await PUT(`entity-service/entity/${TenantID}/logo`, formData)
         .then(response=>{
           SuccessToaster('Company Logo Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error Occured');
         })
      }

    }

    const handleThumbnailUplaod = async(e) => {
      setThumbnail(URL.createObjectURL(e.target.files[0]));
      const formData = new FormData();
      let data = {
        "file":{
          "fileName":e.target?.files?.[0]?.name || ''
        }
      }
      if(thumbnail === null){
        data.id = entityData?.logoThumbnail?.id;
        formData.append('logoThumbnail', new Blob([JSON.stringify(data)], {
         type: "application/json"
         }));
         formData.append('logoThumbnailFile',e.target.files[0]);

         await POST(`entity-service/entity/${TenantID}/logoThumbnail`, formData)
         .then(response=>{
           SuccessToaster('Logo Thumbnail Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error Occured');
         })
      }else{
        formData.append('logoThumbnail', new Blob([JSON.stringify(data)], {
         type: "application/json"
         }));
         formData.append('logoThumbnailFile',e.target.files[0]);

         await PUT(`entity-service/entity/${TenantID}/logoThumbnail`, formData)
         .then(response=>{
           SuccessToaster('Logo Thumbnail Updated Successfully');
         })
         .catch(error=>{
           ErrorToaster('Unexpected Error Occured');
         })
      }

    }

    return(
      <>
        {activeStep === "entitySetup" ? (
        <div className={style.entitySetupBackground}>
          <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
          <div className={style.stepperMargin}>
              <div className={isSuperAdminAccess ? style.stepperGrid : style.stepperGrid4}>
                  <div onClick={() => getActiveStep('entitySetup')}>
                      <div className={style.justifyCenter}>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
                        </div>
                      </div>
                      <p className={`${isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                  </div>
                  <div onClick={() => getActiveStep('siteInformation')}>
                      <div className={style.justifyCenter}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step3} alt="Step2" className={style.stepperImgStyle} />
                        </div>
                      </div>
                      <p className={isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid}>SITES FOR APP USE</p>
                  </div>
                  {isSuperAdminAccess && (
                  <div onClick={() => getActiveStep('entitySystemAdmin')}>
                      <div className={style.justifyCenter}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step2} alt="Step3" className={style.stepperImgStyle} />
                        </div>
                      </div>
                      <p className={isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid}>ENTITY SYSTEM ADMIN</p>
                  </div>
                  )}
                  <div onClick={() => getActiveStep('siteUsers')}>
                      <div className={style.justifyCenter}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                        </div>
                      </div>
                      <p className={isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid}>APP USERS</p>
                  </div>
                  <div onClick={() => getActiveStep('appSubscription')}>
                      <div className={style.justifyCenter}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                        </div>
                      </div>
                      <p className={isSuperAdminAccess ? style.entityTextColor : style.entityTextColor4grid}>APP SUBSCRIPTION</p>
                  </div>
              </div>
              <div className={style.stepperDivider}></div>
          </div>
              <div className={style.entitySetupCardStyle}>
                  <p className={style.heading}>Entity Setup</p>
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
                              <div className={style.spaceBetween}>
                                  <div className={style.displayInRow}>

                                  <label for="logo-upload">
                                  <div className={style.displayInRow}>
                                      <img src={logo||UploadImg} alt="Upload" className={`${style.companyLogoUpload} ${style.cursor}`} />

                                    <input id="logo-upload" type="file" onChange={handleLogoUpload}/>
                                      <p className={style.uploadText}>Click To Upload Company Logo</p>
                                  </div>
                                    </label>
                                    <label for="thumbnail-upload">
                                    <div className={style.displayInRow}>
                                      <img src={thumbnail||UploadImg} alt="Upload" className={`${style.logoThumbnailUpload} ${style.cursor}`} />

                                    <input id="thumbnail-upload" type="file" onChange={handleThumbnailUplaod}/>
                                      <p className={style.uploadText}>Click To Upload Logo Thumbnail</p>
                                      </div>
                                    </label>
                                  </div>
                                {entityData?.entityDisplayId?.id ?  <div>
                                      <button className={style.entityIDButton}><span>ENTITY ID:</span>{entityData?.entityDisplayId.id}</button>
                                  </div>:''}
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                  <div className={style.extentionLableStyle}>Customer Type*</div>
                                  <div className={`${style.leftAlign} `}>
                                      <select
                                          name="class"
                                          id="Class"
                                          value={entityData?.type}
                                          className={style.twoFieldWidth}>
                                              <option value="HEALTHCARE" >
                                              Healthcare
                                              </option>
                                      </select>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>NPIN*</div>
                                  <InputGroup className={style.fourFieldWidth} value={entity?.npin} onChange={(e)=>handleEntity('npin',e.target.value)} />
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Entity Name*</div>
                                  <InputGroup className={`${style.twoFieldWidth}`} value={entity?.name} onChange={(e)=>handleEntity('name',e.target.value)}/>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                  <div className={style.extentionLableStyle}>Entity Type*</div>
                                  <div className={`${style.leftAlign} `}>
                                      <select
                                          name="class"
                                          id="Class"
                                          value={entity?.type}
                                          onChange={(e)=>handleEntity('type',e.target.value)}
                                          className={style.twoFieldWidth}>
                                          <option value="" >
                                            Select Entity Type
                                          </option>
                                              <option value="Doctor Office" >
                                                Doctor Office
                                              </option>
                                              <option value="Nursing Home" >
                                                Nursing Home
                                              </option>
                                              <option value="Hospital" >
                                                Hospital
                                              </option>
                                              <option value="Integrated Delivery Network" >
                                                Integrated Delivery Network
                                              </option>
                                      </select>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Mailing Address*</div>
                                  <div>
                                      <InputGroup value={address.addressLine} className={`${style.fullWidth}`} onChange={(e)=>handleAddress('addressLine',e.target.value)}/>
                                      <div className={`${style.marginTop20} ${style.displayInRow}`}>
                                        <InputGroup placeholder="City Value" className={`${style.fourFieldWidth}`} value={address.city} onChange={(e)=>handleAddress('city',e.target.value)}/>
                                        <InputGroup placeholder="State Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.state} onChange={(e)=>handleAddress('state',e.target.value)}/>
                                        <InputGroup placeholder="Country Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.country} onChange={(e)=>handleAddress('country',e.target.value)}/>
                                        <InputGroup placeholder="Pincode Value" className={`${style.fourFieldWidth}`} value={address.zipcode} onChange={(e)=>handleAddress('zipcode',e.target.value)}/>
                                      </div>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Subdomain*</div>
                                  <InputGroup value={entity.subdomain} leftElement={inputGroupElement('https://')} rightElement={inputGroupElement('.timesmartai.com')} placeholder="Subdomain Name"  className={style.subdomainFieldWidth} onChange={(e)=>handleEntity('subdomain',e.target.value)}/>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Multi-site Entity*</div>
                                  <div>
                                      <div className={style.displayInRow}>
                                          <FormControlLabel
                                              control={
                                                  <Switch checked={entity.multiSiteEntity} className={` ${style.textAlignLeft}`}  value={entity.multiSiteEntity} onChange={(e)=>{ handleEntity('multiSiteEntity',e.target.checked) }}/>
                                              }
                                              className={style.switchFontStyle}
                                              label={entity?.multiSiteEntity?'YES':'NO'}
                                          />
                                          <div className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Primary Site To Use App*</div>
                                          <FormControlLabel
                                              control={
                                                  <Switch checked={entity.primarySiteToUseApp} onChange={(e)=>handleEntity('primarySiteToUseApp',e.target.checked)} className={` ${style.textAlignLeft} ${style.marginLeft20}`}  />
                                              }
                                              className={style.switchFontStyle}
                                              label={entity?.primarySiteToUseApp?'YES':'NO'}
                                          />
                                      </div>
                                  </div>
                              </div>
                              {
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Setup Department*</div>
                                    <div>
                                        <div className={style.displayInRow}>
                                            <FormControlLabel
                                                control={
                                                    <Switch checked={departmentSpecific} className={`${style.textAlignLeft}`} onChange={() => {setDepartmentSpecific(!departmentSpecific);setIsUpdated(true);}}  />
                                                }
                                                className={style.switchFontStyle}
                                                label={departmentSpecific ? 'YES' : "NO"}
                                            />
                                            {departmentSpecific && (
                                                <>
                                                  <>
                                                      <DatalistInput items={items} placeholder="Select Departments" onSelect={onSelect} onChange={(e) => {handleDeptChange(e.target.value)} } className={`${style.fullWidth} ${style.marginLeft20} ${style.textAlignLeft}`} />
                                                      <div className={`${style.addSymbolStyle} ${style.marginLeft20} ${style.cursor}`}><span className={style.plusSymbolPosition} onClick={()=>{handleTagsAdd(departmentValue);setDepartmentValue('');}}>+</span></div>
                                                  </>
                                                </>
                                            )}
                                        </div>
                                        {departmentSpecific && (
                                          <TagInput
                                              placeholder="Selected Department list"
                                              values={selectDepartments?.map(data=>data?.departmentName?.name) || []}
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

                              }
                            </div>
                          <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                              <button className={style.outlinedButton} onClick={()=>{mandatoryFieldCheck('SaveInProgress');}}>SAVE IN-PROGRESS</button>
                              {/* <Link to={`/${nextStep}`}> */}
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {mandatoryFieldCheck('Continue');}}>CONTINUE</button>
                              {/* </Link> */}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          ) : activeStep === "siteInformation" ? (
            <SiteInformation getActiveStep={getActiveStep} />
          ) : activeStep === "entitySystemAdmin" ? (
            <EntitySystemAdmin getActiveStep={getActiveStep} />
          ) : activeStep === "siteUsers" ? (
            <SiteUsers getActiveStep={getActiveStep} />
          ) : (
            <AppSubscription getActiveStep={getActiveStep} />
          )}
          <SaveInProgress alert={showSaveInProgress} getSaveInProgressAlert={getSaveInProgressAlert} fieldData={unassignedKeys?.join(', ')} saveInProgressFunction={saveInProgressFunction}/>
        </>
    )
}

export default EntitySetup;
