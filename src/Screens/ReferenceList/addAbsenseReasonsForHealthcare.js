import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';

const AddAbsenseReasonsForHealthcare = ({ getAddAbsenseReasonsDialog, isEdit}) => {
    const [absenseType, setAbsenseType] = useState('Planned');
    const arrowDown = () => {
        return(
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddAbsenseReasonsDialog} onClose={() => getAddAbsenseReasonsDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>{isEdit ? 'Add/Edit Absence Reasons' : 'New Absence Reason For Healthcare'}</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddAbsenseReasonsDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Absence Type*</div>
                        <div className={style.displayInRow}>
                            <select
                                name="class"
                                id="Class"
                                value={absenseType}
                                onChange={(e) => setAbsenseType(e.target.value)}
                                className={`${style.width75Percent}`}>
                                <option value="Planned" >
                                    Planned
                                </option>
                                <option value="Unplanned" >
                                    Unplanned
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.absenseCareGrid2}`}>
                            <div className={style.entityLableStyle}>Absense Reason*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={absenseType === "Planned" ? "Religious Holiday" : ''} placeholder='Reason' className={style.fullWidth} />
                            </div>
                        </div>
                        <div className={`${style.absenseCareGrid2} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>{absenseType === "Planned" ? "Request Notification Period*" : "Notification Period"}</div>
                            <div className={style.displayInRow}>
                                <div className={style.entityLableStyle}>Not more than</div>
                                <InputGroup value={absenseType === "Planned" ? "14" : "7"} type="number" className={style.marginLeft20} />
                                <div className={`${style.entityLableStyle} ${style.marginLeft20}`}>Days</div>
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
                        <button onClick={() => getAddAbsenseReasonsDialog(false)} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
                    </div>
                </div>
            </div>
        </Dialog>



    )

    
}

export default AddAbsenseReasonsForHealthcare;