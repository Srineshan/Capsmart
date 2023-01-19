import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import { Link } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { POST, GET, PUT, TenantID } from './../dataSaver'

const AddFunctionalTitlesForCustomer = ({ getAddFunctionalTitlesDialog, isEdit}) => {
    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }

    const [title , setTitle] = useState('');
    const [alias1 , setalias1] = useState('');
    const [alias2 , setalias2] = useState('');
    const [currentindustryType, setCurrentIndustryType] = useState("");
    const [currentEntityType, setCurrentEntityType] = useState("");
    const [currentCSPType , setCurrentCSPType] = useState("");
    const [industryTypes,setIndustryTypes] = useState([]);
    const [entityTypes,setEntityTypes] = useState([]);
    const [contractedServiceProviderType , setContractedServiceProviderType] = useState([]);
    const [cspId,setCspId] = useState([]);
    const [selectedIndustry, setSelectedIndustry] = useState({});


    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setIndustryTypes(data);
        console.log("data" , data)
    }

  const addMore = () => {
        setCspId('')
        setCurrentCSPType('')
    }

  const getEntityData = async(industryId) =>{
      const {data : types} = await GET (`entity-service/entityTypeMaster?industryId=${industryId}`);
      setEntityTypes(types)
      console.log("ok",types)
    }

  const getContractedServiceProviderData = async(cspId) =>{
    const {data : csptypes} = await GET (`entity-service/contractedServiceProviderMaster?siteTypeId=${cspId}`);
    console.log("csp", csptypes)
    setContractedServiceProviderType(csptypes)
    }

const handleSave = async () => {
    if(isEdit) {
        let data = {
            "title": title,
            "alias1": alias1,
            "alias2": alias2,
            "contractedServiceProviderTypeId": {
              "id": currentCSPType
            },
            "industryId": {
              "id": selectedIndustry[0]['id']
            },
            "entityId": {
              "id": TenantID
            }
          }
    
        await PUT(`entity-service/functionalTitlesForCSPType/${cspId}`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('User Updated Successfully');
            getAddFunctionalTitlesDialog(false)
        })
        .catch(error => {
            ErrorToaster(error);
        })
    } else {
        let data = [{
            "title": title,
            "alias1": alias1,
            "alias2": alias2,
            "contractedServiceProviderTypeId": {
              "id": currentCSPType
            },
            "industryId": {
              "id": selectedIndustry[0]['id']
            },
            "entityId": {
              "id": TenantID
            }
          }];

        await POST(`entity-service/functionalTitlesForCSPType`, JSON.stringify(data))
        .then(response => {
            SuccessToaster('User Added Successfully');
            getAddFunctionalTitlesDialog(false)
        })
        .catch(error => {
            ErrorToaster(error);
        })
    }
}

useEffect(()=>{
    getIndustryData();
},[]);

    // const AddFunctionalTitlesData = async() =>{
    //     const TitleInput = {
    //         "title": title,
    //         "alias1": alias1,
    //         "alias2": alias2,
    //         "contractedServiceProviderTypeId": {
    //           "id": currentCSPType
    //         }
    //     }

    //     await POST('entity-service/functionalTitlesForCSPTypeMaster', JSON.stringify(TitleInput))
    //         .then(response => {
    //             console.log(response)
    //             SuccessToaster('User Added Successfully');

    //         })
    //         .catch(error => {
    //             ErrorToaster(error);
    //         })
    //         getAddFunctionalTitlesDialog(false)
    // }

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
                                        contractedServiceProviderType.map(type=>(<option value={type.id}>{type.contractedServiceProviderType}</option>))
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
                            <div className={style.entityLableStyle}>Alias Name</div>
                            <InputGroup value={alias1} className={style.fullWidth} onChange={e=>setalias1(e.target.value)}/>
                            <InputGroup value={alias2} className={`${style.fullWidth}`} onChange={e=>setalias2(e.target.value)}/>
                        </div>
                    </div>
                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                        <div>
                        </div>
                        <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`} onClick={() => addMore()}>ADD MORE</div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton} onClick={() => getAddFunctionalTitlesDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave()}>SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>      
    )
}

export default AddFunctionalTitlesForCustomer;


// <Dialog isOpen={getAddFunctionalTitlesDialog} onClose={() => getAddFunctionalTitlesDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
        //     <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
        //         <div className={style.spaceBetween}>
        //             <p className={style.extensionStyle}>Add/Edit Functional Titles For Contracted Service Providers</p>
        //             <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddFunctionalTitlesDialog(false)} />
        //         </div>
        //         <div className={style.ReferenceListEntityBorder}></div>
        //         <div className={`${style.addHealthCareBoxStyle}`}>
        //             <div className={`${style.editHealthCareGrid2}`}>
        //                 <div className={style.entityLableStyle}>Industry Type*</div>
        //                 <div className={style.displayInRow}>
        //                     <InputGroup value="Healthcare" className={`${style.width150} ${style.entityLableStyle1}`} rightElement={arrowDown()} />
        //                 </div>
        //             </div>
        //             <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
        //                 <div className={style.entityLableStyle}>Entity / Site Type*</div>
        //                 <div className={style.displayInRow}>
        //                     <InputGroup value="Hospital / Acute Care Facility (ACF)" className={`${style.width150} ${style.entityLableStyle1}`} rightElement={arrowDown()} />
        //                 </div>
        //             </div>
        //             <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
        //                 <div className={style.entityLableStyle}>Contracted Service Provide Type*</div> 
        //                 <div className={style.displayInRow}>
        //                     <InputGroup value="Dental Professional" className={style.width150} rightElement={arrowDown()} />
        //                 </div>
        //             </div>
        //             <div className={`${style.ReferenceListEntityBorder} ${style.marginTop10}`}></div>
        //             <div className={`${style.addHealthCareBoxStyle}`}>
        //                 <div className={`${style.editHealthCareGrid2}`}>
        //                     <div className={style.entityLableStyle}>Functional Title*</div>
        //                     <InputGroup value="Dentist" className={`${style.fullWidth} ${style.entityLableStyle1}`} />
        //                 </div>
        //                 <div className={`${style.editFunctionalTitlesGrid} ${style.marginTop20}`}>
        //                     <div className={style.entityLableStyle}>Alias Name</div>
        //                     <InputGroup value="Alias 1" className={`${style.fullWidth} ${style.entityLableStyle1}`} />
        //                     <InputGroup value="Alias 2" className={`${style.fullWidth} ${style.entityLableStyle1}`} />
        //                 </div>
        //             </div>
        //             <div className={`${style.spaceBetween} ${style.marginTop20}`}>
        //                 <div>
        //                 </div>
        //                 <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}>ADD MORE</div>
        //             </div>
        //         </div>
        //         <div>
        //             <div className={`${style.floatRight} ${style.marginTop20}`}>
        //                 <button className={style.outlinedButton}>CANCEL</button>
        //                 <Link to='/referenceList/functionalTitleMultiSitesForCustomer'><button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button></Link>
        //             </div>
        //         </div>
        //     </div>
        // </Dialog>