import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';

const AddTerminationReasons = ({ getAddTerminationReasonsDialog }) => {
    const arrowDown = () => {
        return(
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddTerminationReasonsDialog} onClose={() => getAddTerminationReasonsDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add / Edit Termination Reasons</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddTerminationReasonsDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Industry Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Healthcare" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Entity Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Hospital / Acute Care Facility (ACF)r" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>For Cause Terminating Party*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="For Cause By Entity" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Primary Termination Reason*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="American Board of Anesthesiology" className={style.fullWidth} />
                            <RadioGroup
                                inline={true}
                                className={` ${style.marginLeft20} ${style.marginTop}`}
                                selectedValue={"ADD SUB-REASONS"}
                            >
                                <Radio label="ADD SUB-REASONS" value="ADD SUB-REASONS" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Sub-Reason For Termination*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Anesthetist" className={style.fullWidth} />
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
                        <button className={style.outlinedButton}>SAVE & ADDMORE</button>
                        <button onClick={() => getAddTerminationReasonsDialog(false)} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & CLOSE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddTerminationReasons;