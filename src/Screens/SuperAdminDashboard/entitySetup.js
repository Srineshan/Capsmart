import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput } from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import Step1 from './../../images/step1.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step3.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import DatalistInput from 'react-datalist-input';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import UploadImg from './../../images/uploadImg.png';
import EntityStepper from './entityStepper';
import {Auth} from './../../utils/auth'
import {saveEntity,GET,PUT,POST,role,tenantID} from './entityDataSaver';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';
import SiteInformation from './siteInformation';
import SiteUsers from './siteUsers';
import axios from "axios";
import AppSubscription from './appSubscription';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

const EntitySetup = () => {
    const [tags, setTags] = useState([]);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [departmentValue, setDepartmentValue] = useState('');
    const [item, setItem] = useState();
    const [websiteUrl,setWebsiteUrl] = useState('');
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
    const [entity,setEntity] = useState({id:'',customerType:"HEALTHCARE",name:'',type:'',websiteURL:'',multiSiteEntity:false,primarySiteToUseApp:false,npin:'',canSetupDepartment:true});
    const [address,setAddress] = useState({city:'',state:'',zipcode:'',addressLine:'',country:''});
    const [isUpdated,setIsUpdated] = useState(false);

    const accessToken = Auth();

    useEffect(()=>{
      getEntityData();
      getDepartmentData();
      },[]);

    const getActiveStep = (value) => {
      setActiveStep(value)
    }

    const getEntityData = async() => {
      const {data: data} = await GET(`entity-service/entity/${tenantID}`);
      setEntityData(data);
      let siteData = data?.sites?.filter(data=>data.primarySite === true)?.map(data=>data)[0];
      setEntity({id:'',customerType:"HEALTHCARE",name:data?.entityName?.entityName,type:data?.entityType?.type,websiteURL:data?.websiteURL,multiSiteEntity:data?.sites?.length > 1,primarySiteToUseApp:data.canPrimarySiteToUseApp,npin:siteData?.npin?.id});
      setAddress({city:siteData?.address?.city,state:siteData?.address?.state,zipcode:siteData?.address?.zipcode,addressLine:siteData?.address?.addressLine,country:siteData?.address?.country});
      setSelectDepartments(siteData?.departmentList?.departments);
    }

    console.log('depts',selectDepartments);

    console.log(selectDepartments);

    const getDepartmentData = async() => {
      const {data: department} = await GET('entity-service/department');
      if(department){
        setEntityDepartments(department)
      }else{
        console.log('error');
      }
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

    console.log('websiteURL',entity);

    const updateEntity = async() => {
      let filteredValue = entityData?.sites?.filter(data=>data.primarySite !== true)?.map(data=>data);
      let primarySiteValue = entityData?.sites?.filter(data=>data.primarySite === true)?.map(data=>data)[0];
      if(entity?.name === '' || entity?.type === '' || entity?.npin === '' || address?.addressLine === '' || address?.city === '' || address?.state === '' || address?.country === '' || address?.zipcode === '' || address?.addressLine === null || address?.city === null || address?.state === null || address?.country === null || address?.zipcode === null || entity?.websiteURL === null){
        ErrorToaster('All Fields are Mandatory');
        return;
      }
      if((!entity?.websiteURL?.includes('https://') && !entity?.websiteURL?.includes('http://')) || !entity?.websiteURL?.includes('.')){
        ErrorToaster('Enter a valid Website URL');
        return;
      }
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
        "canSetupDepartment": entity?.canSetupDepartment,
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
          "entityDisplayId": entityData?.entityDisplayId,
          "customerType": "HEALTHCARE",
          "websiteURL":entity?.websiteURL,
          "canPrimarySiteToUseApp":entity?.primarySiteToUseApp,
          "sites": filteredValue,
          "subscriptionPlan": entityData?.subscriptionPlan,
          "billingDetails": entityData?.billingDetails,
        }
      if(isUpdated){
        await PUT('entity-service/entity',updatedValue)
          .then(response=>{
          SuccessToaster('Entity Updated Successfully');
          }).catch(error=>{
            console.log('error',error);
            ErrorToaster('Unexpected Error Updating Entity');
          });
        setIsUpdated(false);
      }
    }

    const handleDeptChange = (value) => {
      if(value !== ''){
        setDepartmentValue(value);
      }
    }

    return(
      <>
        {activeStep === "entitySetup" ? (
        <div className={style.entitySetupBackground}>
          <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
          <div className={style.stepperMargin}>
              <div className={style.stepperGrid}>
                  <div onClick={() => getActiveStep('entitySetup')}>
                      <div className={`${style.stepperImgBackground} ${style.activeStepperStyle}`}>
                          <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
                      </div>
                      <p className={`${style.entityTextColor} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                  </div>
                  {/* <div>
                      <div className={style.stepperImgBackground}>
                          <img src={Step2} alt="Step2" className={style.stepperImgStyle} />
                      </div>
                      <p className={style.entityTextColor}>ENTITY SYSTEM ADMIN</p>
                  </div> */}
                  <div onClick={() => getActiveStep('siteInformation')}>
                      <div className={style.stepperImgBackground}>
                          <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                      </div>
                      <p className={style.entityTextColor}>SITES FOR APP USE</p>
                  </div>
                  <div onClick={() => getActiveStep('siteUsers')}>
                      <div className={style.stepperImgBackground}>
                          <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                      </div>
                      <p className={style.entityTextColor}>APP USERS</p>
                  </div>
                  <div onClick={() => getActiveStep('appSubscription')}>
                      <div className={style.stepperImgBackground}>
                          <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                      </div>
                      <p className={style.entityTextColor}>APP SUBSCRIPTION</p>
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
                                      <img src={UploadImg} alt="Upload" className={style.companyLogoUpload} />
                                      <p className={style.uploadText}>Click To Upload Company Logo</p>
                                      <img src={UploadImg} alt="Upload" className={style.logoThumbnailUpload} />
                                      <p className={style.uploadText}>Click To Upload Logo Thumbnail</p>
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
                                              <option value="HealthCare" >
                                              HealthCare
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
                                      </select>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Mailing Address*</div>
                                  <div>
                                      <InputGroup placeholder="Street 8 Block 7" value={address.addressLine} className={`${style.fullWidth}`} onChange={(e)=>handleAddress('addressLine',e.target.value)}/>
                                      <div className={`${style.marginTop20} ${style.displayInRow}`}>
                                          <InputGroup placeholder="Pincode Value" className={`${style.fourFieldWidth}`} value={address.zipcode} onChange={(e)=>handleAddress('zipcode',e.target.value)}/>
                                          <InputGroup placeholder="City Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.city} onChange={(e)=>handleAddress('city',e.target.value)}/>
                                          <InputGroup placeholder="State Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.state} onChange={(e)=>handleAddress('state',e.target.value)}/>
                                          <InputGroup placeholder="Country Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={address.country} onChange={(e)=>handleAddress('country',e.target.value)}/>
                                      </div>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Website URL*</div>
                                  <InputGroup value={entity.websiteURL} className={`${style.fullWidth}`} value={entity.websiteURL} onChange={(e)=>handleEntity('websiteURL',e.target.value)}/>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Multi-site Entity*</div>
                                  <div>
                                      <div className={style.displayInRow}>
                                          <FormControlLabel
                                              control={
                                                  <Switch checked={entity.multiSiteEntity} className={` ${style.textAlignLeft}`}  value={entity.multiSiteEntity} onChange={(e)=>handleEntity('multiSiteEntity',e.target.checked)}/>
                                              }
                                              className={style.switchFontStyle}
                                              label={'YES'}
                                          />
                                          <div className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Primary Site To Use App*</div>
                                          <FormControlLabel
                                              control={
                                                  <Switch checked={entity.primarySiteToUseApp} onChange={(e)=>handleEntity('primarySiteToUseApp',e.target.checked)} className={` ${style.textAlignLeft} ${style.marginLeft20}`}  />
                                              }
                                              className={style.switchFontStyle}
                                              label={'YES'}
                                          />
                                      </div>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Setup Department*</div>
                                  <div>
                                      <div className={style.displayInRow}>
                                          <FormControlLabel
                                              control={
                                                  <Switch checked={departmentSpecific} className={`${style.textAlignLeft}`} onChange={() => {setDepartmentSpecific(!departmentSpecific)}}  />
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
                                            placeholder="Enter tags/keywords relative to the post"
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
                          </div>
                          <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                              <button className={style.outlinedButton} onClick={()=>{updateEntity()}}>SAVE IN-PROGRESS</button>
                              {/* <Link to={`/${nextStep}`}> */}
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {updateEntity();setActiveStep(entity.multiSiteEntity === true ?"siteInformation":"siteUsers")}}>CONTINUE</button>
                              {/* </Link> */}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          ) : activeStep === "siteInformation" ? (
              <SiteInformation getActiveStep={getActiveStep} />
          ) : activeStep === "siteUsers" ? (
            <SiteUsers getActiveStep={getActiveStep} />
          ) : (
            <AppSubscription getActiveStep={getActiveStep} />
          )}
        </>
    )
}

export default EntitySetup;
