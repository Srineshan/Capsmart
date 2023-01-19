import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import { GET,POST, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import CrossPink from './../../images/crossPink.png';


const AddAbsenseReasonsForHealthcare = ({ getAddAbsenseReasonsDialog, isEdit, selectedAbsence}) => {
    const [absenceReason, setAbsenceReason] = useState('');
    const [notificationPeriod,setNotificationPeriod] = useState('');
    const [absenceType, setAbsenceType] = useState('PLANNED');
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const [absenceId, setAbsenceId] = useState('');
    const arrowDown = () => {
        return(
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }

    const addMore = () => {
        setAbsenceId('')
        setAbsenceReason('')
    }

    useEffect(()=> {
        if(isEdit){
            setAbsenceType(selectedAbsence?.absenceType)
            setAbsenceReason(selectedAbsence?.absenceReason)
            setNotificationPeriod(selectedAbsence?.notificationPeriod.numberOfDays)
            setAbsenceId(selectedAbsence?.id)
        }
    }, [isEdit, selectedAbsence])

    const getIndustryData = async() => {
        const {data : data} = await GET (`entity-service/industryMaster`);
        setSelectedIndustry(data?.filter(data => data?.industry === 'HEALTHCARE')?.map(data => data));
    }

    const handleSave = async () => {
        if(isEdit) {
            let data = {
                ...( isEdit &&
                {'id': absenceId}),
                "absenceType": absenceType,
                "absenceReason": absenceReason,
                "notificationPeriod": {
                  "numberOfDays": parseInt(notificationPeriod)
                },
                "industryId": {
                  "id": selectedIndustry[0]['id']
                },
                "entityId": {
                  "id": TenantID
                }
              }
        
        //     await PUT(`entity-service/absenceReason/${absenceId}`, JSON.stringify(data))
        //     .then(response => {
        //         SuccessToaster('Absence Updated Successfully');
        //         getAddAbsenseReasonsDialog(false)
        //     })
        //     .catch(error => {
        //         ErrorToaster(error);
        //     })
        // } else {
        //     let data = [{
        //         "absenceType": absenceType,
        //         "absenceReason": absenceReason,
        //         "notificationPeriod": {
        //           "numberOfDays": parseInt(notificationPeriod)
        //         },
        //         "industryId": {
        //           "id": selectedIndustry[0]['id']
        //         },
        //         "entityId": {
        //           "id": TenantID
        //         }
        //       }];
            if(!isEdit ? 
            await POST(`entity-service/absenceReason`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Absence Added Successfully');
                getAddAbsenseReasonsDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
            :
            await PUT(`entity-service/absenceReason/${absenceId}`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Absence Updated Successfully');
                getAddAbsenseReasonsDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        )
        getAddAbsenseReasonsDialog(false)
    }
    }

    useEffect(()=>{
        getIndustryData();
    },[]);

    return (
        <Dialog isOpen={getAddAbsenseReasonsDialog} onClose={() => getAddAbsenseReasonsDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>{isEdit ? 'Add/Edit Absence Reasons' : 'New Absence Reason For Healthcare'}</p>
                    <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} onClick={() => getAddAbsenseReasonsDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Absence Type*</div>
                        <div className={style.displayInRow}>
                            <select
                                name="class"
                                id="Class"
                                value={absenceType}
                                onChange={(e) => {
                                    setAbsenceType(e.target.value);
                                    if(e.target.value == "PLANNED"){        
                                        setNotificationPeriod("14");
                                    }else{
                                        setNotificationPeriod("7");
                                    }
                                }}
                                className={`${style.width75Percent}`}>
                                <option value="PLANNED" >
                                    Planned
                                </option>
                                <option value="UNPLANNED" >
                                    Unplanned
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.absenseCareGrid2}`}>
                            <div className={style.entityLableStyle}>Absence Reason*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={absenceReason} onChange={(e)=> setAbsenceReason(e.target.value)} className={style.fullWidth} />
                            </div>
                        </div>
                        <div className={`${style.absenseCareGrid2} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>{absenceType === "PLANNED" ? "Request Notification Period*" : "Notification Period"}</div>
                            <div className={style.displayInRow}>
                                <div className={style.entityLableStyle}>Not more than</div>
                                <InputGroup value={notificationPeriod} type="number" min={0} className={style.marginLeft20} onChange={(e)=> setNotificationPeriod(e.target.value)} />
                                <div className={`${style.entityLableStyle} ${style.marginLeft20}`}>Days</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                        <div>
                        </div>
                        <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`} onClick={() => addMore()} >ADD MORE</div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton} onClick={() => getAddAbsenseReasonsDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave()}>SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddAbsenseReasonsForHealthcare;
