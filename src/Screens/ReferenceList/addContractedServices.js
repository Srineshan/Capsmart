import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';
import { POST, PUT, TenantID } from '../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';

const AddContractedServices = ({ getAddContractedServicesDialog, selectedContractedService, getContractedServiceType, isEdit }) => {

    const [serviceName, setServiceName] = useState(isEdit ? selectedContractedService?.service : '')

    const handlePostContractedServiceType = async () => {
        let data = {
            service: serviceName,
            entityId: {
                id: TenantID
            }
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
                        <div className={style.entityLableStyle}>Service Name*</div>
                        <div>
                            <InputGroup value={serviceName} className={style.fullWidth} onChange={(e) => setServiceName(e.target.value)} placeholder="Enter Service Name" />
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