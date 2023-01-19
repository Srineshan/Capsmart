import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
<<<<<<< HEAD
import { POST, PUT } from '../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';

const AddContractedServiceForHealthcare = ({ getAddEntityDialog, siteTypeData, getEntityData, seletedEntity, isEdit, siteTypeTableData }) => {

    const [entityType, setEntityType] = useState('')
    const [csProviderTypeId, setCsProviderTypeId] = useState('')
    const [csProviderType, setCsProviderType] = useState('')
    const [createdDate, setCreatedDate] = useState("")

=======
import { GET, POST, PUT, TenantID } from './../dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import CrossPink from './../../images/crossPink.png';

const AddContractedServiceProvider = ({ getAddContractedServiceDialog, isEdit, selectedService }) => {
    const [siteTypeId, setSiteTypeId] = useState('');
    const [contractedServiceProviderType, setContractedServiceProviderType] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState({});
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }

<<<<<<< HEAD
    const saveSubmitHandler = async () => {
        const isAvailable = siteTypeTableData.filter((e) => e.id === entityType)[0].items.map(i => i.contractedServiceProviderType).includes(csProviderType);
        if (isAvailable) {
            ErrorToaster("Already This CSPType Exists");
            document.getElementById("cspTypeEl").focus();
            getAddEntityDialog(true)
            return false;
        }

        if (!csProviderType && csProviderType === "") {
            document.getElementById("cspTypeEl").focus()
            return false
        }

        const data = {
            ...(isEdit && { 'id': csProviderTypeId }),
            ...(isEdit && { 'createdDate': createdDate }),
            "contractedServiceProviderType": csProviderType,
            "siteTypeId": {
                "id": entityType
            }
        }

        if (!isEdit ?
            await POST("entity-service/contractedServiceProviderMaster", JSON.stringify(data))
                .then((response) => {
                    SuccessToaster("Contracted Service Provider Added Successfully");
                    getAddEntityDialog(false);
                    getEntityData()
                })
                .catch((error) => {
                    ErrorToaster(error);
                })
            :
            await PUT(`entity-service/contractedServiceProviderMaster/${csProviderTypeId}`, JSON.stringify(data))
                .then(response => {
                    SuccessToaster('Contracted Service Provider Updated Successfully');
                    getAddEntityDialog(false)
                    getEntityData()
                })
                .catch(error => {
                    ErrorToaster(error);
                })
        )
            getAddEntityDialog(false)
    }

    useEffect(() => {
        setEntityType(siteTypeData?.[0]?.id);
    }, [siteTypeData]);

    useEffect(() => {
        if (isEdit) {
            setEntityType(seletedEntity?.siteTypeId.id)
            setCsProviderType(seletedEntity?.contractedServiceProviderType)
            setCsProviderTypeId(seletedEntity?.id)
            setCreatedDate(seletedEntity?.createdDate)
        } else {
            setEntityType(seletedEntity?.id)
        }
    }, [isEdit, seletedEntity])
=======
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
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21

    return (
        <Dialog isOpen={getAddEntityDialog} onClose={() => getAddEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
<<<<<<< HEAD
                    <p className={style.extensionStyle}>Add/Edit Contracted Service Providers For Healthcare</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddEntityDialog(false)} />
=======
                    <p className={style.extensionStyle}>{isEdit ? 'Add/Edit Contracted Service' : 'New Contracted Service Providers For Healthcare'}</p>
                    <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} onClick={() => getAddContractedServiceDialog(false)} />
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Entity / Site Type*</div>
                        <div className={style.displayInRow}>
                            <select
                                name="class"
                                id="Class"
                                value={entityType}
                                onChange={(e) => { setEntityType(e.target.value) }}
                                className={`${style.width75Percent}`}>
                                {siteTypeData?.map((data) => {
                                    return (
                                        <option value={data.id}>
                                            {data.type}
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.absenseCareGrid2}`}>
                            <div className={style.entityLableStyle}>Contracted Service Provider Type*</div>
                            <div className={style.displayInRow}>
<<<<<<< HEAD
                                <InputGroup value={csProviderType} id="cspTypeEl" className={style.fullWidth} onChange={(e) => setCsProviderType(e.target.value)} />
=======
                                <InputGroup value={siteTypeId} onChange={(e)=> setSiteTypeId(e.target.value)} className={style.fullWidth} />
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                            </div>
                        </div>
                    </div>
                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                        <div>
                        </div>
<<<<<<< HEAD
                        {
                            !isEdit &&
                            <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}>ADD MORE</div>
                        }
=======
                        <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`} onClick={() => addMore()}>ADD MORE</div>
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
<<<<<<< HEAD
                        <button onClick={() => getAddEntityDialog(false)} className={style.outlinedButton}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={saveSubmitHandler}>SAVE</button>
=======
                        <button className={style.outlinedButton} onClick={() => getAddContractedServiceDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handleSave()}>SAVE</button>
>>>>>>> 01ff1ddd22400e2d6f0257795b0972f06746bb21
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddContractedServiceProvider;
