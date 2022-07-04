import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput } from '@blueprintjs/core';
import {Link} from 'react-router-dom';
import DatalistInput from 'react-datalist-input';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Step1 from './../../images/step1.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step3.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import UploadImg from './../../images/uploadImg.png';
import {Auth} from './../../utils/auth'
import {saveEntity,departmentSave} from './entityDataSaver';
import style from './index.module.scss';
import 'react-datalist-input/dist/styles.css';

const EntitySetup = () => {
    const [tags, setTags] = useState([]);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [departmentValue, setDepartmentValue] = useState('');
    const [item, setItem] = useState();
    const [entity,setEntity] = useState({id:'',name:'',type:'',websiteURL:'',primarySite:false,multiSiteEntity:false});
    const [address,setAddress] = useState({city:'',state:'',zipcode:'',addressLine:'',country:''});
    const [websiteUrl,setWebsiteUrl] = useState('');
    const [multiSiteEntity,setMultiSiteEntity] = useState(false);
    const [primarySite,setPrimarySite] = useState(false);
    const [department,setDepartment] = useState([]);
    const accessToken = Auth();

    useEffect(()=>{
      getEntityData();
      getDepartmentData();
    },[]);

    console.log('access',accessToken)

    console.log('tags',tags);

    const getEntityData = () => {
      const entity = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                  'X-tenantID' : '6242845f95690b3822cb96a5',
                  'Authorization': `Bearer ${accessToken}`}
        };
        fetch('http://ec2-184-72-207-241.compute-1.amazonaws.com:8000/entity-service/entity', entity)
        .then(response => response.json())
        .then(data => {
            if(data?.filter(data=>data.id === '6242845f95690b3822cb96a5')?.map(data=>{
              setEntity({...entity,id:data.id,name:data.entityName.entityName,type:data.entityType.type,websiteURL:data.websiteURL,multiSiteEntity:data.multiSiteEntity,primarySite:data.canPrimarySiteToUseApp});
              setAddress({...address,addressLine:data.addressLine,city:data.city,state:data.state,zipcode:data.zipcode,country:data.country});
            }))
          return true;
        }
       )
    }

    const getDepartmentData = () => {
      let  temp = []
      const entity = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                  'X-tenantID' : '6242845f95690b3822cb96a5',
                  'Authorization': `Bearer ${accessToken}`}
        };
        fetch('http://ec2-184-72-207-241.compute-1.amazonaws.com:8000/entity-service/department', entity)
        .then(response => response.json())
        .then(data => {
            console.log('dept',data)
            data
            // ?.filter(data=>data.id === '6242845f95690b3822cb96a5')
            ?.map(data=>{
              temp.push(data?.departmentName?.name)

            })
          return true;
        }
       )
       setDepartment(temp);
       setTags(temp);
    }


    console.log('entity',entity);
    console.log('department',department,tags);

    const onSaveInProgress = () => {
      department.map(data=>{
        departmentSave(data.name)
      })
      saveEntity(department,entity,address);
    }

    const saveToStorage = () => {
      sessionStorage.setItem('entity',entity);
      sessionStorage.setItem('department',department);
      sessionStorage.setItem('address',address);
    }

    const handleTagsAdd = values => {
        setDepartment([...department,values])
        setTags([...tags, values]);
    };

    const handleTagsRemove = (tags, index) => {
        setDepartment(department?.filter((data,indexValue)=>index!==indexValue)?.map(data=>data))
        const updatedTags = [tags];
        updatedTags.splice(index, 1);
        tags = updatedTags;
        setTags(tags);
      };

      const handleEntity = (name,value) =>{
        setEntity({...entity,[name]:value});
      }
      const handleAddress = (name,value) =>{
        setAddress({...address,[name]:value});
      }
      const handleDepartment = (name,value) =>{
        setAddress({...department,[name]:value});
      }

    return(
        <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={style.stepperGrid}>
                    <div>
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
                    <div>
                        <div className={style.stepperImgBackground}>
                            <img src={Step3} alt="Step3" className={style.stepperImgStyle} />
                        </div>
                        <p className={style.entityTextColor}>SITES FOR APP USE</p>
                    </div>
                    <div>
                        <div className={style.stepperImgBackground}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                        </div>
                        <p className={style.entityTextColor}>APP USERS</p>
                    </div>
                    <div>
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
                                <div>
                                    <button className={style.entityIDButton}><span>ENTITY ID:</span>3578689</button>
                                </div>
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
                                <InputGroup className={style.fourFieldWidth} value="Alphanumeric" />
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
                                    <InputGroup value="Street 8 Block 7" className={`${style.fullWidth}`} value={address.addressLine} onChange={(e)=>handleAddress('addressLine',e.target.value)}/>
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
                                <InputGroup value="http://regington.net" className={`${style.fullWidth}`} value={entity.websiteURL} onChange={(e)=>handleEntity('websiteURL',e.target.value)}/>
                            </div>
                            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Multi-site Entity*</div>
                                <div>
                                    <div className={style.displayInRow}>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={true} className={` ${style.textAlignLeft}`}  />
                                            }
                                            className={style.switchFontStyle}
                                            label={'YES'}
                                        />
                                        <div className={`${style.extentionLableStyle} ${style.marginLeft20}`}>Primary Site To Use App*</div>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={true} className={` ${style.textAlignLeft} ${style.marginLeft20}`}  />
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
                                                <Switch checked={departmentSpecific} className={` ${style.textAlignLeft}`} onChange={() => setDepartmentSpecific(!departmentSpecific)}  />
                                            }
                                            className={style.switchFontStyle}
                                            label={departmentSpecific ? 'YES' : "NO"}
                                        />
                                        {departmentSpecific && (
                                            <>
                                                <InputGroup placeholder="Enter Department"  onChange={(e) => setDepartmentValue(e.target.value) } className={`${style.fullWidth} ${style.marginLeft20}`} value={departmentValue}/>
                                                <div className={`${style.addSymbolStyle} ${style.marginLeft20}`}><span className={style.plusSymbolPosition} onClick={()=>{handleTagsAdd(departmentValue);setDepartmentValue('');}}>+</span></div>
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
                            <button className={style.outlinedButton} onClick={onSaveInProgress}>SAVE IN-PROGRESS</button>
                            <Link to={'/siteInformation'}>
                                <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={saveToStorage}>CONTINUE</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EntitySetup;
