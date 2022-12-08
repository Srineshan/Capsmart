import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';

const AddNewDepartments = ({ getAddEntityDialog }) => {

    return (
        <Dialog isOpen={getAddEntityDialog} onClose={() => getAddEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>New Departments / Services Area For Hospital / Acute Care Facility (ACF)</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddEntityDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Department Name*</div>
                        <div className={style.twoCol}>
                            <InputGroup value="Surgical Services" className={style.fullWidth} />
                            <RadioGroup
                                inline={true}
                                className={` ${style.marginLeft20} ${style.marginTop}`}
                                selectedValue={"ADD SERVICES"}
                            >
                                <Radio label="ADD SERVICES" value="ADD SERVICES" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Service Area*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Cardiothoracic Surgery" className={style.fullWidth} />
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
                        <button className={style.outlinedButton}>SAVE & ADD MORE</button>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`} onClick={() => getAddEntityDialog(false)}>SAVE & CLOSE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddNewDepartments;
