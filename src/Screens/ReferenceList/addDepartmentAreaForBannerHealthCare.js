import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import style from './index.module.scss';
import { GET,POST, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import CrossPink from './../../images/crossPink.png';


const AddDepartmentAreaForBannerHealthcare = ({ getAddDepartmentforHealthcareDialog, isEdit, selectedDepartment }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [departmentHead,setDepartmentHead] = useState('');
    const [siteTypeId, setSiteTypeId] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [departmentId, setDepartmentId] = useState('')
    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }

    const addMore = () => {
        setDepartmentId('')
        setDepartmentName('')
    }

    useEffect(()=> {
        if(isEdit){
            setDepartmentName(selectedDepartment?.departmentName)
            setDepartmentHead(selectedDepartment?.departmentHead)
            setSiteTypeId(selectedDepartment?.siteTypeId)
            setDepartmentId(selectedDepartment?.id)
        }
    }, [isEdit, selectedDepartment])

    // const getIndustryData = async() => {
    //     const {data : data} = await GET (`entity-service/industryMaster`);
    //     setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    // }

    const handleSave = async () => {
        if(isEdit) {
            let data = {
                "departmentName": {"name" : departmentName},
                "siteTypeId": {"id" : siteTypeId},
                "departmentHead": {
                    "id" : departmentHead
                },
                "entityId": {
                  "id": TenantID
                }
              }
        
            await PUT(`entity-service/department/${departmentId}`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Department Updated Successfully');
                getAddDepartmentforHealthcareDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        } else {
            let data = [{
                "departmentName": {"name" : departmentName},
                "siteTypeId": {"id" : siteTypeId},
                "departmentHead": {
                    "id" : departmentHead
                },
                "entityId": {
                  "id": TenantID
                }
              }];

            await POST(`entity-service/department`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Department Added Successfully');
                getAddDepartmentforHealthcareDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        }
    }

    // useEffect(()=>{
    //     getIndustryData();
    // },[]);

    return (
        <Dialog isOpen={getAddDepartmentforHealthcareDialog} onClose={() => getAddDepartmentforHealthcareDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add / Edit Department / Service area for Banner Healthcare System </p>
                    <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`}  onClick={() => getAddDepartmentforHealthcareDialog(false)}/>
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid} `}>
                        <div className={style.entityLableStyle}>Site*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Arizona Metropolitan hospital" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Department Name*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Surgical Services" className={style.halfWidth} />
                            <img src={AddHealthcareGroup} alt="OpenFolder" className={`${style.colorFileStyle} ${style.marginLeft20} ${style.marginTop}`} />
                            <p className={`${style.marginTop7} ${style.marginLeft5} ${style.fontStyle}`}>ADD SERVICES</p>
                        </div>
                    </div>

                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Alias Name </div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Alias 1" className={`${style.width34} ${style.marginRight} ${style.entityLableStyle1}`} />
                            <InputGroup value="Alias 2" className={`${style.width34} ${style.entityLableStyle1}`} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle1}`}>
                        <div className={`${style.extentionGrid}`}>
                            <div className={style.entityLableStyle}>Service Name*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Cardiothoracic Surgery" className={style.fullWidth} />
                            </div>
                        </div>

                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>Alias Name </div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Alias 1" className={`${style.width50} ${style.marginRight} ${style.entityLableStyle1}`} />
                                <InputGroup value="Alias 2" className={`${style.width50} ${style.entityLableStyle1}`} />
                            </div>
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
                        <button className={style.outlinedButton}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave()}>SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>

    )
}

export default AddDepartmentAreaForBannerHealthcare;