import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';
import { POST } from '../dataSaver'
import { SuccessToaster, ErrorToaster } from '../../utils/toaster';

const AddIndustryTypeEntity = ({ getAddEntityDialog, getIndustryData }) => {

    const [industryName, setIndustryName] = useState("")

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!industryName && industryName === "") {
            document.getElementById("industryEl").focus();
            return false;
        }
        let data = {
            "industry": industryName
        };

        await POST('entity-service/industryMaster', JSON.stringify(data))
            .then(response => {
                SuccessToaster('Industry Added Successfully');
                getAddEntityDialog(false)
                getIndustryData()
            })
            .catch(error => {
                ErrorToaster(error);
            })
    }

    return (
        <Dialog isOpen={getAddEntityDialog} onClose={() => getAddEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add New Industry Type / Entity Types</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddEntityDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addIndustryBoxStyle} ${style.marginTop20}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Industry Name*</div>
                        <div className={style.twoCol}>
                            <InputGroup value={industryName} id="industryEl" className={style.fullWidth} onChange={(e) => setIndustryName(e.target.value)} placeholder="Enter Name" />
                            <RadioGroup
                                inline={true}
                                className={` ${style.marginLeft20} ${style.marginTop}`}
                                selectedValue={"ADD ENTITY"}
                            >
                                <Radio label="ADD ENTITY" value="ADD ENTITY" />
                            </RadioGroup>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={style.outlinedButton} onClick={() => getAddEntityDialog(false)}>CANCEL</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={onSubmitHandler} >SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog >
    )
}

export default AddIndustryTypeEntity;