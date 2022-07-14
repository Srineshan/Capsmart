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
import AppSubscription from './appSubscription';

const EntitySetup = () => {
    const [tags, setTags] = useState([]);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [departmentValue, setDepartmentValue] = useState('');
    const [item, setItem] = useState();
    const [entity,setEntity] = useState({id:'',customerType:"HEALTHCARE",name:'',type:'',websiteURL:'',multiSiteEntity:false,primarySiteToUseApp:false});
    const [address,setAddress] = useState({city:'',state:'',zipcode:'',addressLine:'',country:''});
    const [websiteUrl,setWebsiteUrl] = useState('');
    const [multiSiteEntity,setMultiSiteEntity] = useState(false);
    const [siteData,setSiteData] = useState({canSetupDepartment:false,departments:[],addressLine:'',city:'',state:'',country:'',zipcode:'',npin:'',name:'',siteAdmin:'',type:''});
    const [department,setDepartment] = useState([]);
    const [allSites,setAllSites] = useState([]);
    const [activeStep, setActiveStep] = useState('entitySetup');
    const [billing,setBilling] = useState();
    const [trial,setTrial] = useState();
    const [subscription,setSubscription] = useState();
    const [accountManager,setAccountManager] = useState();
    const [departmentList,setDepartmentList] = useState([]);
    const [entityDepartments,setEntityDepartments] = useState([]);
    const accessToken = Auth();

    useEffect(()=>{
      getEntityData();
      getDepartmentData();
      getSiteData();
    },[]);

    const getActiveStep = (value) => {
      setActiveStep(value)
    }

    const getEntityData = async() => {
      const {data: entityData} = await GET(`entity-service/entity/${tenantID}`);
      if(entityData){
        console.log(entityData);
        entityData?.filter(data=>data.id === '6242845f95690b3822cb96a5')?.map(data=>{
          setEntity({id:data.id,customerType:data.customerType,name:data.entityName.entityName,type:data.entityType.type,npin:'',websiteURL:data.websiteURL,multiSiteEntity:data.multiSiteEntity})
          setSubscription(data.subscriptionPlan);
          setAccountManager(data.accountManager);
          setBilling(data.billingDetails);
          setTrial(data.trialDetails);
        })
      }else{
        console.log('error');
      }
    }

    console.log('Entity',entity);

    const createEntity = async() => {
      let sites = [{

      }]
      let entityValue = {
          "entityName": {
            "entityName": entity.name
          },
          "entityType": {
            "type": entity.type
          },
          "customerType": entity.customerType,
          "sites": [
            {
              "id": "string",
              "siteName": {
                "siteName": "string"
              },
              "siteAdmin": {
                "id": "string"
              },
              "siteType": {
                "type": "string"
              },
              "npin": {
                "id": "string"
              },
              "canSetupDepartment": true,
              "departmentList": {
                "departments": [
                  {
                    "id": "string",
                    "departmentName": {
                      "name": "string"
                    },
                    "departmentHead": {
                      "id": "string"
                    }
                  }
                ]
              },
              "address": {
                "addressLine": "string",
                "city": "string",
                "state": "string",
                "zipcode": "string",
                "country": "string"
              },
              "primarySite": true
            }
          ],
          "subscriptionPlan": {
            "planName": "BASIC",
            "allowableRegisteredUsers": {
              "allowableRegisteredUsers": 0
            },
            "subscriptionFees": {
              "fees": "string"
            },
            "subscriptionStatus": "ACTIVE",
            "billingFrequency": "MONTHLY",
            "discount": {
              "discount": 0
            },
            "plannedToGoLive": {
              "date": "2022-07-13"
            },
            "poaNumber": {
              "poaNumber": "string"
            }
          },
          "billingDetails": {
            "contactname": {
              "firstName": "string",
              "lastName": "string"
            },
            "email": {
              "emailId": "string"
            },
            "contactNumber": {
              "contactNumber": 0
            }
          },
          "contractDetails": {
            "contractName": "string",
            "contractID": "string",
            "contractDocuments": [
              {
                "name": "string",
                "description": "string",
                "contractDocType": "AGREEMENTDRAFT",
                "contractDocPath": "string"
              }
            ],
            "contractTermPeriod": {
              "startDate": "2022-07-13",
              "endDate": "2022-07-13"
            },
            "plannedGoLive": {
              "date": "2022-07-13"
            },
            "contractContinuationPolicy": "AUTORENEWAL",
            "fullyExecutedContractOnFile": true
          },
          "accountManager": {
            "id": "string"
          },
          "appUserRoles": [
            {
              "id": "string",
              "roleName": "string"
            }
          ]
        }
    }

    const getSiteData = async() => {
      const{data:sites} = await GET('entity-service/sites');
      setAllSites(sites);
      if(sites){
        sites?.filter(data=>data.primarySite === true)?.map(data=>{
          setDepartmentList(data.departmentList.departments)
          setDepartment(data.departmentList.departments?.map(data=>data.departmentName.name));
          setSiteData({primarySite:data.primarySite,name:data.siteName.siteName,type:data.siteType.type,npin:data.npin,canSetupDepartment:data.canSetupDepartment,departments:departmentList,addressLine:data.address.addressLine, city:data.address.city, state: data.address.state, country: data.address.country, zipcode: data.address.zipcode, siteAdmin: data.siteAdmin.id})
        })
      }else{
        console.log('error');
      }
    }

    const getDepartmentData = async() => {
      const {data: department} = await GET('entity-service/department');
      if(department){
        setEntityDepartments(department)
      }else{
        console.log('error');
      }
    }

    const saveEntityData = async() => {

    }

    const handleTagsAdd = async(values) => {
        setDepartment([...department,values])
        await POST('entity-service/department',JSON.stringify({
          "departmentName":{
            "name":values
          }
        }))
        getDepartmentData();
        setTags([...tags, values]);
    };

    const handleTagsRemove = (tags, index) => {
        setDepartment(department?.filter((data,indexValue)=>index!==indexValue)?.map(data=>data));
        setDepartmentList(departmentList?.filter((data,indexValue)=>index!==indexValue)?.map(data=>data))
        const updatedTags = [tags];
        updatedTags.splice(index, 1);
        tags = updatedTags;
        setTags(tags);
      };

      const handleEntity = (name,value) =>{
        setEntity({...entity,[name]:value});
      }
      const handleSite = (name,value) =>{
        setSiteData({...siteData,[name]:value});
      }

    const nextStep = multiSiteEntity === true ?"siteInformation":"siteUsers"

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
                                { tenantID !== "" ?  <div>
                                      <button className={style.entityIDButton}><span>ENTITY ID:</span>{entity.id}</button>
                                  </div>:''}
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                  <div className={style.extentionLableStyle}>Customer Type*</div>
                                  <div className={`${style.leftAlign} `}>
                                      <select
                                          name="class"
                                          id="Class"
                                          className={style.twoFieldWidth}>
                                              <option value="HealthCare" >
                                              HealthCare
                                              </option>
                                      </select>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>NPIN*</div>
                                  <InputGroup className={style.fourFieldWidth} value={entity.npin} onChange={(e)=>handleEntity('npin',e.target.value)} />
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Entity Name*</div>
                                  <InputGroup className={`${style.twoFieldWidth}`} value={entity.name || 'hospital'} onChange={(e)=>handleEntity('name',e.target.value)}/>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop30}`}>
                                  <div className={style.extentionLableStyle}>Entity Type*</div>
                                  <div className={`${style.leftAlign} `}>
                                      <select
                                          name="class"
                                          id="Class"
                                          value={entity.type}
                                          onChange={(e)=>handleEntity('type',e.target.value)}
                                          className={style.twoFieldWidth}>
                                              <option value="Doctor Office" >
                                                Doctor Office
                                              </option>
                                      </select>
                                  </div>
                              </div>
                              <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                  <div className={style.extentionLableStyle}>Mailing Address*</div>
                                  <div>
                                      <InputGroup value="Street 8 Block 7" className={`${style.fullWidth}`} value={siteData.addressLine} onChange={(e)=>handleSite('addressLine',e.target.value)}/>
                                      <div className={`${style.marginTop20} ${style.displayInRow}`}>
                                          <InputGroup placeholder="Pincode Value" className={`${style.fourFieldWidth}`} value={siteData.zipcode} onChange={(e)=>handleSite('zipcode',e.target.value)}/>
                                          <InputGroup placeholder="City Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={siteData.city} onChange={(e)=>handleSite('city',e.target.value)}/>
                                          <InputGroup placeholder="State Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={siteData.state} onChange={(e)=>handleSite('state',e.target.value)}/>
                                          <InputGroup placeholder="Country Value" className={`${style.fourFieldWidth} ${style.marginLeft20}`} value={siteData.country} onChange={(e)=>handleSite('country',e.target.value)}/>
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
                                                  <Switch checked={entity.multiSiteEntity} className={` ${style.textAlignLeft}`}  onChange={(e)=>handleEntity('multiSiteEntity',e.target.checked)}/>
                                              }
                                              className={style.switchFontStyle}
                                              label={'YES'}
                                          />
                                          <div className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Primary Site To Use App*</div>
                                          <FormControlLabel
                                              control={
                                                  <Switch checked={entity.primarySiteToUseApp} onChange={(e)=>handleSite('primarySiteToUseApp',e.target.checked)} className={` ${style.textAlignLeft} ${style.marginLeft20}`}  />
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
                                                  <Switch checked={departmentSpecific} className={` ${style.textAlignLeft}`} onChange={() => {setDepartmentSpecific(!departmentSpecific)}}  />
                                              }
                                              className={style.switchFontStyle}
                                              label={departmentSpecific ? 'YES' : "NO"}
                                          />
                                          {departmentSpecific && (
                                              <>
                                                  <InputGroup placeholder="Enter Department"  onChange={(e) => setDepartmentValue(e.target.value) } className={`${style.fullWidth} ${style.marginLeft20}`} value={departmentValue}/>
                                                  <div className={`${style.addSymbolStyle} ${style.marginLeft20} ${style.cursor}`}><span className={style.plusSymbolPosition} onClick={()=>{handleTagsAdd(departmentValue);setDepartmentValue('');}}>+</span></div>
                                              </>
                                          )}
                                      </div>
                                      {departmentSpecific && (
                                          <TagInput
                                              placeholder="Enter tags/keywords relative to the post"
                                              values={tags}
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
                              <button className={style.outlinedButton} onClick={()=>{saveEntityData()}}>SAVE IN-PROGRESS</button>
                              {/* <Link to={`/${nextStep}`}> */}
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => setActiveStep(entity.multiSiteEntity === true ?"siteInformation":"siteUsers")}>CONTINUE</button>
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
