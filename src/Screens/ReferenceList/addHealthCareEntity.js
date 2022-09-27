import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';

const AddHealthCareEntity = ({ getAddHcEntityDialog }) => {

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
                            <InputGroup value="Healthcare" className={style.halfWidth} />
                            <img src={AddHealthcareGroup} className={`${style.colorFileStyle} ${style.marginLeft20}`} />
                            <p className={`${style.marginTop} ${style.marginLeft5}`}>ADD ENTITY</p>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>Entity Name*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Veterinary Clinic" className={style.fullWidth} />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                        <div>
                        </div>
                        <div className={`${style.addMoreCardStyle} ${style.addMoreTextStyle}`}>ADD MORE</div>
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

export default AddHealthCareEntity;