import React, { useEffect, useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { POST,GET } from './../dataSaver'

const AddTerminationReasons = ({ getAddTerminationReasonsDialog , terminationReasonData}) => {
    const [currentindustryType, setCurrentIndustryType] = useState("")
    const [terminationBy, setTerminationBy] = useState("")
    const [primaryReason, setPrimaryReason] = useState("")
    const [secondaryReason, setSecondaryReason] = useState("")
    const [currentEntityType, setCurrentEntityType] = useState("")
    const [industryTypes,setIndustryTypes] = useState([])
    const [entityTypes,setEntityTypes] = useState([])
    const [editTermination , setEditTermination] = useState([])
    
      let data = []

      const getAllIndustries = async() => {
          const {data : data} = await GET (`/industryMaster`);
          setIndustryTypes(data);
    }
  

    const getEntityData = async(industryId) =>{
        console.log("ok",data)
        const {data : types} = await GET (`/entityTypeMaster?industryId=${industryId}`);
        setEntityTypes(types)
    }

    useEffect(()=>{
        getAllIndustries()
        if(terminationReasonData!=null){
            setCurrentIndustryType()
            setTerminationBy()
            setPrimaryReason()
            setSecondaryReason()
            setCurrentEntityType()
           
        }
    },[])
 
    const SubmitTerminationReason = async () => {
        const TerminationInput = {
            "id":currentEntityType,
            "terminationBy": terminationBy,
            "primary_reason": primaryReason,
            "secondary_reasons": [
                secondaryReason
            ],
            "siteTypeId": {
                "id": currentEntityType
            }
        }
        await POST('/terminationReasonMaster', JSON.stringify(TerminationInput))
            .then(response => {
                SuccessToaster('User Added Successfully');
            })
            .catch(error => {
                ErrorToaster(error);
            })
        getAddTerminationReasonsDialog(false)
    }




    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddTerminationReasonsDialog} onClose={() => getAddTerminationReasonsDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add / Edit Termination Reasons</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddTerminationReasonsDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Industry Type*</div>
                        <div className={style.displayInRow}>
                            <select value={currentindustryType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj =>{ setCurrentIndustryType(obj.target.value); getEntityData(obj.target.value)}} >
                                    {
                                        industryTypes.map(type=>(<option value={type.id}>{type.industry}</option>))
                                    }        
                                </select>
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Entity Type*</div>
                        <div className={style.displayInRow}>
                            <select value={currentEntityType} className={style.fullWidth} rightElement={arrowDown()} onChange={obj => {setCurrentEntityType(obj.target.value); } }>
                            {
                                        entityTypes.map(type=>(<option value={type.id}>{type.type}</option>))
                                    } 
                                </select>
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>For Cause Terminating Party*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value={terminationBy} className={style.fullWidth} rightElement={arrowDown()} onChange={obj => setTerminationBy(obj.target.value)} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Primary Termination Reason*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value={primaryReason} className={style.fullWidth} onChange={obj => setPrimaryReason(obj.target.value)} />
                            <RadioGroup
                                inline={true}
                                className={` ${style.marginLeft20} ${style.marginTop}`}
                                selectedValue={"ADD SUB-REASONS"}
                            >
                                <Radio label="ADD SUB-REASONS" value="ADD SUB-REASONS" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Sub-Reason For Termination*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={secondaryReason} className={style.fullWidth} onChange={obj => setSecondaryReason(obj.target.value)} />
                            </div>
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
                        <button className={style.outlinedButton}>SAVE & ADDMORE</button>
                        <button onClick={() => SubmitTerminationReason()} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & CLOSE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddTerminationReasons;