import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { InputGroup, Icon, Intent, TagInput, Dialog, Classes, Spinner } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatalistInput from 'react-datalist-input';
import {Link} from 'react-router-dom';
import {GET,PUT,POST,TenantID} from './../dataSaver';
import Step1 from './../../images/step12.png';
import Step2 from './../../images/step2.png';
import Step3 from './../../images/step33.png';
import Step4 from './../../images/step4.png';
import Step5 from './../../images/step5.png';
import UploadImg from './../../images/uploadImg.png';
import style from './index.module.scss';
import {Auth} from './../../utils/auth';
import 'react-datalist-input/dist/styles.css';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';

// const VALUES = ['Department 1', "Department 2"];

const SiteInformation = ({getActiveStep}) => {
    const [tags, setTags] = useState([]);
    const [departmentSpecific, setDepartmentSpecific] = useState(true);
    const [siteList,setSiteList] = useState([]);
    const [showSiteTable, setShowSiteTable] = useState(true);
    const [selectDepartment, setSelectDepartment] = useState('');
    const [siteID, setSiteID] = useState('3578689');
    const [alertDialog, setAlertDialog] = useState(false);
    const [item, setItem] = useState();
    const [departmentValue,setDepartmentValue] = useState([]);
    const [entityData,setEntityData] = useState();
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [loading,setLoading] = useState(false);
    const [address,setAddress] = useState({
      city:'',state:'',zipcode:'',country:''
    })
    const [site,setSite] = useState({name:'',type:'',canSetupDepartment:true,npin:''});
    let options = [];
    const accessToken = Auth();
    const role = '';

    useEffect(()=>{
      getDepartmentData();
      getEntityData();
    },[]);

    const getEntityData = async() => {
      const {data: data} = await GET(`entity-service/entity/${TenantID}`);
      setEntityData(data);
      if(data?.canPrimarySiteToUseApp){
        setSiteList(data?.sites);
      }else{
        let sites = data?.sites;
        setSiteList(sites?.filter(data=>data.primarySite === false)?.map(data=>data));
      }
      setShowSiteTable(data?.sites?.length !== 0 ? true : false)
    }

    const updateEntitySite = async(buttonText) => {
      if(site.name === '' || site.type === '' || site.npin === '' || address.city === '' || address.state === '' || address.zipcode === '' || address.country === ''){
        ErrorToaster('All Fields are mandatory');
        return;
      }
      let temp = entityData?.sites;
      temp.push({
        "siteName": {
          "siteName": site.name
        },
        "siteAdmin": {
          "id": ""
        },
        "siteDisplayId": {
            "id": ""
        },
        "siteType": {
          "type": site.type
        },
        "npin": {
          "id": site.npin
        },
        "canSetupDepartment": site.canSetupDepartment,
        "departmentList": {
          "departments":departmentSpecific?selectedDepartment:departmentValue,
        },
        "address": {
          "addressLine": "",
          "city": address.city,
          "state": address.state,
          "zipcode": address.zipcode,
          "country": address.country,
        },
        "primarySite": false
      });
      const updatedValue =
      {
      "id": entityData.id,
      "entityName": entityData?.entityName,
      "entityType": entityData?.entityType,
      "entityDisplayId": entityData?.entityDisplayId,
      "customerType": "HEALTHCARE",
      "sites": temp,
      "subscriptionPlan": entityData.subscriptionPlan,
      "billingDetails": entityData.billingDetails,
      "contractDetails": entityData.contractDetails,
      "accountManager":entityData.accountManager,
      "appUserRoles": entityData.appUserRoles,
    }
    await PUT('entity-service/entity',updatedValue)
    .then(response=>{
    SuccessToaster('Site Created Successfully');
    }).catch(error=>{
      ErrorToaster('Unexpected Error Creating Site');
    });
    if(buttonText === 'Continue'){
      getActiveStep('siteUsers');
      resetSiteValues();
    }else if(buttonText === 'Saveinprogress'){
      setShowSiteTable(true);
      resetSiteValues();
    }else{
      resetSiteValues();
    }
  }

  const getDepartmentData = async() => {
    const {data: department} = await GET('entity-service/department');
    if(department){
      setDepartmentValue(department)
      setShowSiteTable(siteList?.filter(data=>data.primarySite !== true)?.map(data=>data)?.length !== 0 ? false:true);
    }else{
      console.log('error');
    }
  }


    const onSelect = (selectedItem) => {
      setItem(selectedItem);
      let temp = selectedDepartment;
      temp.push(selectedItem);
      setSelectedDepartment(temp);
      setSelectDepartment('');
    }

    const handleTagsAdd = values => {
      setItem(values);
      let temp = selectedDepartment;
      temp.push({
          "departmentName": {
            "name": values
          },
          "departmentHead": {
            "id": ""
          }
        })
      setSelectedDepartment(temp);
      setSelectDepartment('');
    };

    const handleTagsRemove = (tags, index) => {
      setSelectedDepartment(selectedDepartment?.filter((data,indexValue)=>indexValue!==index)?.map(data=>data));
    };

      const items = useMemo(
        () =>
          departmentValue.map((option) => ({
            id: option?.id,
            value: option?.departmentName.name,
            ...option,
          })),
        [departmentValue],
      );

    const handleSite = (name,value) => {
      setSite({...site,[name]:value});
    }

    const handleAddress = (name,value) => {
      setAddress({...address, [name]:value});
    }

    if(loading){
      <Spinner intent={Intent.PRIMARY} />
    }

    const resetSiteValues = () => {
      setAddress({
        city:'',state:'',zipcode:'',country:''
      });
      setSite({name:'',type:'',canSetupDepartment:true,npin:''});
    }


    return(
        <div className={style.entitySetupBackground}>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.floatRight}`} />
            <div className={style.stepperMargin}>
                <div className={role !== "" ? style.stepperGrid : style.stepperGrid4}>
                    <div onClick={() => getActiveStep('entitySetup')}>
                        <div className={`${style.stepperImgBackground} ${style.completedStepperStyle}`}>
                            <img src={Step1} alt="Step1" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${role !== "" ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>ENTITY SETUP</p>
                    </div>
                    <div onClick={() => getActiveStep('siteInformation')}>
                        <div className={`${style.stepperImgBackground} ${style.activeStepperStyle} `}>
                            <img src={Step3} alt="Step2" className={style.stepperImgStyle} />
                        </div>
                        <p className={`${role !== "" ? style.entityTextColor : style.entityTextColor4grid} ${style.activeEntityTextColor}`}>SITES FOR APP USE</p>
                    </div>
                    {role !== "" && (
                      <div onClick={() => getActiveStep('entitySystemAdmin')}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step2} alt="Step3" className={style.stepperImgStyle} />
                        </div>
                        <p className={role !== "" ? style.entityTextColor : style.entityTextColor4grid}>ENTITY SYSTEM ADMIN</p>
                      </div>
                    )}
                    <div onClick={() => getActiveStep('siteUsers')}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step4} alt="Step4" className={style.stepperImgStyle} />
                        </div>
                        <p className={role !== "" ? style.entityTextColor : style.entityTextColor4grid}>SITE USERS</p>
                    </div>
                    <div onClick={() => getActiveStep('appSubscription')}>
                        <div className={style.stepperImgBackground}>
                            <img src={Step5} alt="Step5" className={style.stepperImgStyle} />
                        </div>
                        <p className={role !== "" ? style.entityTextColor : style.entityTextColor4grid}>APP SUBSCRIPTION</p>
                    </div>
                </div>
                <div className={role !=="" ? style.stepperDivider2 : style.stepperDivider2grid4}></div>
            </div>
            {!showSiteTable ? (
                <div className={style.entitySetupCardStyle}>
                    <p className={style.heading}>Add Site Information</p>
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
                                <div className={`${style.extentionGrid}`}>
                                    <div className={style.extentionLableStyle}>NPIN*</div>
                                    <div className={style.spaceBetween}>
                                        <InputGroup className={style.fourFieldWidth} value={site?.npin} onChange={(e)=>handleSite('npin',e.target.value)}/>
                                        {
                                          // <button className={style.entityIDButton} onClick={()=> setShowSiteTable(true)}>
                                          //     <span>{siteID !== 'XX689- 64768' ? 'ENTITY ID:' : 'SITE ID:'}</span>{siteID}
                                          // </button>
                                        }
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Site Name*</div>
                                    <InputGroup className={style.threeFieldWidth} placeholder="Site Name" value={site.name} onChange={(e)=>handleSite('name',e.target.value)} />
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Site Type*</div>
                                    <div className={`${style.leftAlign} `}>
                                        <select
                                            name="class"
                                            id="Class"
                                            className={style.fullWidth}
                                            value={site.type}
                                            onChange={(e)=>handleSite('type',e.target.value)}>
                                                <option value="" >
                                                Select Site Type
                                                </option>
                                                <option value="Hospital/Nursing home etc" >
                                                Hospital/Nursing home etc
                                                </option>
                                        </select>
                                    </div>
                                </div>
                                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                                    <div className={style.extentionLableStyle}>Address*</div>
                                    <div className={`${style.displayInRow}`}>
                                        <InputGroup value={address.zipcode} placeholder="zipcode" className={`${style.fourFieldWidth}`} onChange={(e)=>handleAddress('zipcode',e.target.value)}/>
                                        <InputGroup value={address.state} placeholder="state" className={`${style.fourFieldWidth} ${style.marginLeft20}`} onChange={(e)=>handleAddress('state',e.target.value)}/>
                                        <InputGroup value={address.country} placeholder="country" className={`${style.fourFieldWidth} ${style.marginLeft20}`} onChange={(e)=>handleAddress('country',e.target.value)}/>
                                        <InputGroup value={address.city} placeholder="city" className={`${style.fourFieldWidth} ${style.marginLeft20}`} onChange={(e)=>handleAddress('city',e.target.value)}/>
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
                                                    <DatalistInput items={items} placeholder="Enter Departments" onSelect={onSelect} value={selectDepartment} onChange={(e) => {setSelectDepartment(e.target.value); setSiteID('XX689- 64768')} } className={`${style.fullWidth} ${style.marginLeft20} ${style.textAlignLeft}`} />
                                                    <div className={`${style.addSymbolStyle} ${style.marginLeft20}`}><span className={style.plusSymbolPosition} onClick={(e)=>handleTagsAdd(selectDepartment)}>+</span></div>
                                                </>
                                            )}
                                        </div>
                                        {selectDepartment.length !== 0 && !departmentValue?.map(data=>data.departmentName?.name).includes(selectDepartment) &&(
                                          <div className={`${style.reqDeptCard} ${style.marginTop}`}>
                                              <div className={style.addBoxDescription}>
                                              The Department you are trying to add is not on the list.
                                              To add a new department enter the exact name below and click
                                              on the "REQUEST & ADD" button.
                                              </div>
                                              <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                                  <InputGroup value={selectDepartment} className={style.threeFieldWidth} onChange={(e)=>setSelectDepartment(e.target.value)}/>
                                                  <button className={`${style.reqButton} ${style.marginLeft20}`} onClick={() => {handleTagsAdd(selectDepartment)}}>REQUEST & ADD</button>
                                              </div>
                                          </div>
                                      )}
                                        {departmentSpecific && (
                                            <TagInput
                                                placeholder="Enter tags/keywords relative to the post"
                                                values={selectedDepartment?.map(data=>data?.departmentName?.name)}
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
                            <div className={style.spaceBetween}>
                                <div className={`${style.marginTop20} ${style.buttonPositionLeft}`}>
                                    <button className={style.outlinedButton}>BULK UPLOAD</button>
                                </div>
                                <div className={`${style.buttonPosition} ${style.floatRight} ${style.marginTop20}`}>
                                    <button className={style.outlinedButton} onClick={()=>{updateEntitySite('Saveinprogress');}}>SAVE IN-PROGRESS</button>
                                    <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={()=>{updateEntitySite('Addmore');}}>SAVE & ADD MORE</button>
                                    {/* <Link to={'/siteUsers'}> */}
                                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => {updateEntitySite('Continue');}}>CONTINUE</button>
                                    {/* </Link> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={style.entitySetupCardStyle}>
                    <p className={style.heading}>App Use Sites for Entity</p>
                    <div className={`${style.floatRight} ${style.siteButtonPosition}`}>
                        <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} onClick={()=>setShowSiteTable(false)}>ADD SITES</button>
                        <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer}`} >BULK UPLOAD</button>
                    </div>
                    <div className={style.greyBorder}></div>
                    <div className={style.tableHeight}>
                        <div className={`${style.tableHeader} ${style.marginTop20}`}>
                            <p className={style.tableHeaderFontStyle}>SITE NAME</p>
                            <p className={style.tableHeaderFontStyle}>SITE TYPE</p>
                            <p className={style.tableHeaderFontStyle}>CITY</p>
                            <p className={style.tableHeaderFontStyle}>STATE</p>
                            <p className={style.tableHeaderFontStyle}>CREATED DATE</p>
                            <p className={style.tableHeaderFontStyle}>CREATED BY</p>
                            <p className={style.tableHeaderFontStyle}>SOURCE</p>
                        </div>
                        <div className={`${style.tableData} ${style.displayInCol}`}>
                        {
                          siteList?.map(data=>(
                            <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                <p className={style.tableDataFontStyle}>{data?.siteName?.siteName}</p>
                                <p className={style.tableDataFontStyle}>{data?.siteType?.type}</p>
                                <p className={style.tableDataFontStyle}>{data.address.city}</p>
                                <p className={style.tableDataFontStyle}>{data.address.state}</p>
                                <p className={style.tableDataFontStyle}>-</p>
                                <p className={style.tableDataFontStyle}>-</p>
                                <p className={style.tableDataFontStyle}>-</p>
                            </div>
                          ))
                        }
                        </div>
                    </div>
                    <div className={` ${style.floatRight} ${style.marginTop20} ${style.marginRightForPositionButton}`}>
                        <button className={style.outlinedButton}>SAVE IN-PROGRESS</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => setAlertDialog(true)}>CONTINUE</button>
                    </div>
                </div>
            )}
            <Dialog isOpen={alertDialog} onClose={() => setAlertDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.cloneDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>SETUP ALERT</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => setAlertDialog(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <p className={`${style.cloneContent} ${style.marginTop20}`}>Do you want to setup registered users for the different sites at this time?</p>
                    <div>
                        <div className={`${style.positionCenter} ${style.marginTop20}`}>
                            <button className={`${style.cloneOutlinedButton} ${style.cursorPointer} ${style.paddingTop5}`} onClick={() => setAlertDialog(false)}>NO</button>
                            {/* <Link to={'/siteUsers'}> */}
                                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} ${style.paddingTop5}`} onClick={() => getActiveStep(role !=="" ? 'entitySystemAdmin' : 'siteUsers')}>YES</button>
                            {/* </Link> */}
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SiteInformation;
