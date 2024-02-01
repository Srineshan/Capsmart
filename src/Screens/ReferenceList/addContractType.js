import React, { useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';
import { POST, PUT, TenantID, GET } from '../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';

const AddContractType = ({ getContractTypeDialog, selectedContractType, getContractType, isEdit }) => {
    const [contractType, setContractType] = useState(isEdit ? selectedContractType?.contractType : '')
    const [contractTypeTemplate, setContractTypeTemplate] = useState(isEdit ? selectedContractType?.contractTypeTemplate : '');

    const handlePostContractedServiceType = async () => {
        if (contractTypeTemplate === '' || contractType === '') {
            ErrorToaster('Enter Madatory Data');
            return;
        }
        let data = {
            contractType: contractType,
            contractTypeTemplate: contractTypeTemplate,
            entityId: {
                id: TenantID
            }
        };
        if (contractType !== '') {
            if (!isEdit) {
                await POST("entity-service/contractType", JSON.stringify([data]))
                    .then((response) => {
                        SuccessToaster("Contract Type Added Successfully");
                        getContractType();
                        getContractTypeDialog(false);
                    })
                    .catch((error) => {
                        ErrorToaster(error);
                    });
            } else {
                await PUT(`entity-service/contractType/${selectedContractType?.id}`, JSON.stringify(data))
                    .then((response) => {
                        SuccessToaster("Contract Type Updated Successfully");
                        getContractType();
                        getContractTypeDialog(false);
                    })
                    .catch((error) => {
                        ErrorToaster(error);
                    });
            }
        } else {
            ErrorToaster('Enter Contract Type');
        }
    }

    return (
        <Dialog isOpen={getContractTypeDialog} onClose={() => getContractTypeDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Edit Contract Type</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getContractTypeDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>

                <div className={`${style.addIndustryBoxStyle} ${style.marginTop20}`}>

                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Contract Type*</div>
                        <div>
                            <InputGroup value={contractType} className={style.fullWidth} onChange={(e) => setContractType(e.target.value)} placeholder="Enter Contract Type" />
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton} onClick={() => getContractTypeDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => handlePostContractedServiceType()} >SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog >
    )
}

export default AddContractType;