import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';

const AddIndustryTypeEntity = ({getAddEntityDialog}) => {

    return(
        <Dialog isOpen={getAddEntityDialog} onClose={() => getAddEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add New Industry Type / Entity Types</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddEntityDialog(false)}  />
            </div>
            <div className={style.ReferenceListEntityBorder}></div>
            <div className={`${style.addIndustryBoxStyle} ${style.marginTop20}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.entityLableStyle}>Industry Name*</div>
                    <div className={style.twoCol}>
                        <InputGroup value="Defence" className={style.fullWidth} />
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
                    <button className={style.outlinedButton}>CANCEL</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default AddIndustryTypeEntity;