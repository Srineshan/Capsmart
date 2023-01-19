import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import { GET, POST, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import CrossPink from './../../images/crossPink.png';

const AddContractedServiceProvider = ({ getAddContractedServiceDialog, isEdit, selectedService }) => {
    const [siteTypeId, setSiteTypeId] = useState('');
    const [contractedServiceProviderType, setContractedServiceProviderType] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState({});
    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }

    const addMore = () => {
        setServiceId('')
        setContractedServiceProviderType('')
    }

    useEffect(()=> {
        if(isEdit){
            setContractedServiceProviderType(selectedService?.contractedServiceProviderType)
            setSiteTypeId(selectedService?.siteTypeId)
            setServiceId(selectedService?.id)
        }
    }, [isEdit, selectedService])
    
    // const getEntityData = async () => {
    //      const { data: data } = await GET(`entity-service/entityTypeMaster?industryId=${industryId}`);
    // };

    const handleSave = async () => {
        if(isEdit) {
            let data = {
                "contractedServiceProviderType": contractedServiceProviderType,
                "siteTypeId": {
                  "id": siteTypeId
                },
                "industryId": {
                    "id": selectedIndustry[0]['id']
                },
                "entityId": {
                  "id": TenantID
                }
              }
        
            await PUT(`entity-service/contractedServiceProvider/${serviceId}`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Service Updated Successfully');
                getAddContractedServiceDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        } else {
            let data = [{
                "contractedServiceProviderType": contractedServiceProviderType,
                "siteTypeId": {
                  "id": siteTypeId
                },
                "industryId": {
                    "id": selectedIndustry[0]['id']
                },
                "entityId": {
                  "id": TenantID
                }
              }];

            await POST(`entity-service/contractedServiceProvider`, JSON.stringify(data))
            .then(response => {
                SuccessToaster('Service Added Successfully');
                getAddContractedServiceDialog(false)
            })
            .catch(error => {
                ErrorToaster(error);
            })
        }
    }

    // useEffect(()=>{
    //     getEntityData();
    // },[]);

    return (
        <Dialog isOpen={getAddContractedServiceDialog} onClose={() => getAddContractedServiceDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>{isEdit ? 'Add/Edit Contracted Service' : 'New Contracted Service Providers For Healthcare'}</p>
                    <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} onClick={() => getAddContractedServiceDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Entity / Site Type*</div>
                        <div className={style.displayInRow}>
                            <select
                                name="class"
                                id="Class"
                                className={`${style.width75Percent}`}>
                                <option value="Hospital / Acute Care Facility (ACF)">
                                Hospital / Acute Care Facility (ACF)
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.absenseCareGrid2}`}>
                            <div className={style.entityLableStyle}>Contracted Service Provider Type*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={siteTypeId} onChange={(e)=> setSiteTypeId(e.target.value)} className={style.fullWidth} />
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
                        <button className={style.outlinedButton} onClick={() => getAddContractedServiceDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave()}>SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddContractedServiceProvider;
