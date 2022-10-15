import React, { useEffect, useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { POST,GET } from './../dataSaver'

const AddFunctionalTitles = ({ getAddFunctionalTitlesDialog }) => {
    const [title , setTitle] = useState('');
    const [alias1 , setalias1] = useState('');
    const [alias2 , setalias2] = useState('');
    const [currentindustryType, setCurrentIndustryType] = useState("")
    const [currentEntityType, setCurrentEntityType] = useState("")
    const [currentCSPType , setCurrentCSPType] = useState("")
    const [industryTypes,setIndustryTypes] = useState([])
    const [entityTypes,setEntityTypes] = useState([])
    const [contarctedServiceProviderType , setContarctedServiceProviderType] = useState([])
   

    const getAllIndustries = async() => {
        const {data : data} = await GET (`/industryMaster`);
        setIndustryTypes(data);
        console.log("data" , data)
  }


  const getEntityData = async(industryId) =>{
      const {data : types} = await GET (`/entityTypeMaster?industryId=${industryId}`);
      setEntityTypes(types)
      console.log("ok",types)
  }

  const getContractedServiceProviderData = async(cspId) =>{
    const {data : csptypes} = await GET (`/contractedServiceProviderMaster?siteTypeId=${cspId}`);
    console.log("csp", csptypes)
    setContarctedServiceProviderType(csptypes)
}

  useEffect(()=>{
    getAllIndustries()
  },[])


    const AddFunctionalTitlesData = async() =>{
        const TitleInput = {
            "title": title,
            "alias1": alias1,
            "alias2": alias2,
            "contractedServiceProviderTypeId": {
              "id": currentCSPType
            }
        }

        await POST('/functionalTitlesForCSPTypeMaster', JSON.stringify(TitleInput))
            .then(response => {
                console.log(response)
                SuccessToaster('User Added Successfully');
                
            })
            .catch(error => {
                ErrorToaster(error);
            })
            getAddFunctionalTitlesDialog(false)
    }


    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddFunctionalTitlesDialog} onClose={() => getAddFunctionalTitlesDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add/Edit Functional Titles For Contracted Service Providers</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddFunctionalTitlesDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.editHealthCareGrid2}`}>
                        <div className={style.entityLableStyle}>Industry Type*</div>
                        <div className={style.displayInRow}>
                            <select value={currentindustryType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj =>{ setCurrentIndustryType(obj.target.value); getEntityData(obj.target.value)}} >
                                    {
                                        industryTypes.map(type=>(<option value={type.id}>{type.industry}</option>))
                                    }        
                                </select>
                        </div>
                    </div>
                    <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Entity / Site Type*</div>
                        <div className={style.displayInRow}>
                            <select value={currentEntityType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj => {setCurrentEntityType(obj.target.value);getContractedServiceProviderData(obj.target.value) } }>
                            {
                                        entityTypes.map(type=>(<option value={type.id}>{type.type}</option>))
                                    } 
                                </select>
                        </div>
                    </div>
                    <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Contracted Service Provide Type*</div> 
                        <div className={style.displayInRow}>
                            <select value={currentCSPType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj => {setCurrentCSPType(obj.target.value); } }>
                            {
                                        contarctedServiceProviderType.map(type=>(<option value={type.id}>{type.contractedServiceProviderType}</option>))
                                    } 
                                </select>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop10}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Functional Title*</div>
                            <InputGroup value={title} className={style.fullWidth} onChange={e=>setTitle(e.target.value)}/>
                        </div>
                        <div className={`${style.editFunctionalTitlesGrid} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>ALias Name</div>
                            <InputGroup value={alias1} className={style.fullWidth} onChange={e=>setalias1(e.target.value)}/>
                            <InputGroup value={alias2} className={`${style.fullWidth}`} onChange={e=>setalias2(e.target.value)}/>
                        </div>
                    </div>
                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                        <div>
                        </div>
                        <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}>ADD MORE</div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton}>SAVE & ADD MORE</button>
                        <button onClick={() => AddFunctionalTitlesData()} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & CLOSE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddFunctionalTitles;