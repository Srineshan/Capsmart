import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup } from '@blueprintjs/core';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import { POST, PUT } from '../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';
import { useEffect } from 'react';

const AddSuffixEntity = ({ getAddHcEntityDialog, selectedTitle, IndustryId, seletedEntity, isEdit, getEntityData }) => {

    const [entityId, setEntityId] = useState('')
    const [entityName, setEntityName] = useState('')

    const saveSubmitHandler = async () => {
        const data = {
            ...(isEdit && { 'id': entityId }),
            "suffix": entityName,
            "industryId": {
                "id": IndustryId
            }
        }

        if (!isEdit ?
            await POST('entity-service/nameSuffixMaster', JSON.stringify(data))
                .then(response => {
                    SuccessToaster('Event Added Successfully');
                    getAddHcEntityDialog(false)
                    getEntityData()
                })
                .catch(error => {
                    ErrorToaster(error);
                })
            :
            await PUT(`entity-service/nameSuffixMaster/${entityId}`, JSON.stringify(data))
                .then(response => {
                    SuccessToaster('Event Updated Successfully');
                    getAddHcEntityDialog(false)
                    getEntityData()
                })
                .catch(error => {
                    ErrorToaster(error);
                })
        )

            getAddHcEntityDialog(false)

    }

    useEffect(() => {
        if (isEdit) {
            setEntityName(seletedEntity?.suffix)
            setEntityId(seletedEntity?.id)
        }
    }, [isEdit, seletedEntity])

    return (
        <Dialog isOpen={getAddHcEntityDialog} onClose={() => getAddHcEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add/Edit Entity Types For Healthcare</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddHcEntityDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.editHealthCareGrid1} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Industry Name*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value={selectedTitle} className={style.halfWidth} />
                            <img src={AddHealthcareGroup} className={`${style.colorFileStyle} ${style.marginLeft20}`} alt="" />
                            <p className={`${style.marginTop} ${style.marginLeft5}`}>ADD ENTITY</p>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>Entity Name*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={entityName} className={style.fullWidth} onChange={(e) => setEntityName(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    {!isEdit &&
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <div>
                            </div>
                            <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}>ADD MORE</div>
                        </div>
                    }
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton} onClick={() => getAddHcEntityDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={saveSubmitHandler} >SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddSuffixEntity;
