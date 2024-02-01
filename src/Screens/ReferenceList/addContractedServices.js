import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';
import { POST, PUT, TenantID, GET } from '../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';
import MultiSelectDisplay from "../../Components/ReusableSmallComponents/multiSelectDisplay";

const AddContractedServices = ({ getAddContractedServicesDialog, selectedContractedService, getContractedServiceType, isEdit }) => {
    const [serviceName, setServiceName] = useState(isEdit ? selectedContractedService?.serviceType : '')
    const [serviceType, setServiceType] = useState(isEdit ? selectedContractedService?.serviceTypeTemplate : '');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [selectedContractTypes, setSelectedContractTypes] = useState([]);

    useEffect(() => {
        getServiceTypes();
        getContractTypes();
    }, []);

    const getContractTypes = async () => {
        const { data: types } = await GET(`entity-service/contractType`);
        if (isEdit) {
            let temp = [];
            types?.filter(data => selectedContractedService?.contractTypeId?.includes(data?.id))?.map(data => {
                temp.push({ id: data?.id, value: data?.contractType })
            })
            setSelectedContractTypes(temp);
            let typesTemp = [];
            types?.filter(data => !selectedContractedService?.contractTypeId?.includes(data?.id))?.map(data => {
                typesTemp.push(data);
            })
            setContractTypes(typesTemp);
        } else {
            setContractTypes(types);
        }
    }

    const getServiceTypes = async () => {
        const { data: types } = await GET(`entity-service/contractedServiceTypeTemplateMaster`);
        setServiceTypes(types);
    };

    const removeContractType = (index) => {
        let typesTemp = contractTypes;
        selectedContractTypes?.filter((data, indexValue) => index === indexValue)?.map(data => {
            typesTemp.push({ id: data?.id, contractType: data?.value });
        });
        setContractTypes(typesTemp);
        let temp = selectedContractTypes?.filter((data, indexValue) => index !== indexValue)?.map(data => data);
        setSelectedContractTypes(temp);
    }

    const handlePostContractedServiceType = async () => {
        if (serviceType === '' || serviceName === '') {
            ErrorToaster('Enter Madatory Data');
            return;
        }
        let data = {
            serviceType: serviceName,
            serviceTypeTemplate: serviceType,
            entityId: {
                id: TenantID
            },
            contractTypeId: selectedContractTypes?.map(data => data?.id),
        };
        if (serviceName !== '') {
            if (!isEdit) {
                await POST("entity-service/contractedServiceType", JSON.stringify([data]))
                    .then((response) => {
                        SuccessToaster("Contracted Services Added Successfully");
                        getContractedServiceType();
                        getAddContractedServicesDialog(false);
                    })
                    .catch((error) => {
                        ErrorToaster(error);
                    });
            } else {
                await PUT(`entity-service/contractedServiceType/${selectedContractedService?.id}`, JSON.stringify(data))
                    .then((response) => {
                        SuccessToaster("Contracted Services Updated Successfully");
                        getContractedServiceType();
                        getAddContractedServicesDialog(false);
                    })
                    .catch((error) => {
                        ErrorToaster(error);
                    });
            }
        } else {
            ErrorToaster('Enter Service Name');
        }
    }

    const handleContractTypeSelection = (value) => {
        let temp = selectedContractTypes;
        if (!temp?.includes(value)) {
            temp.push({ id: value, value: contractTypes?.filter(data => data?.id === value)?.map(data => data?.contractType)?.[0] });
        }
        let filteredTemp = contractTypes?.filter(data => data?.id !== value)?.map(data => data);
        setContractTypes(filteredTemp);
        setSelectedContractTypes(temp);
    }


    return (
        <Dialog isOpen={getAddContractedServicesDialog} onClose={() => getAddContractedServicesDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add/Edit Contracted Service</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddContractedServicesDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>

                <div className={`${style.addIndustryBoxStyle} ${style.marginTop20}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Contract Type*</div>
                        <div className={style.displayInRow}>
                            <select
                                value={contractTypes}
                                className={style.fullWidth}
                                onChange={(e) => {
                                    handleContractTypeSelection(e.target.value);
                                }}
                            >
                                <option value="">Select Contract Type</option>
                                {contractTypes.map((type) => (
                                    <option value={type.id}>{type.contractType}</option>
                                ))}
                            </select>
                        </div>
                        {selectedContractTypes?.length !== 0 && (<MultiSelectDisplay
                            values={selectedContractTypes?.map(data => data?.value)}
                            removeItem={removeContractType}
                        />)}
                    </div>

                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Service Name*</div>
                        <div>
                            <InputGroup value={serviceName} className={style.fullWidth} onChange={(e) => setServiceName(e.target.value)} placeholder="Enter Service Name" />
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Service Type Template*</div>
                        <div className={style.displayInRow}>
                            <select
                                value={serviceType}
                                className={style.fullWidth}
                                // rightElement={arrowDown()}
                                onChange={(e) => {
                                    setServiceType(e.target.value);
                                }}
                            >
                                <option value="">Select Service Type</option>
                                {serviceTypes.map((type) => (
                                    <option value={type.serviceTypeTemplate}>{type.serviceTypeTemplate}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton} onClick={() => getAddContractedServicesDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handlePostContractedServiceType()} >SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog >
    )
}

export default AddContractedServices;