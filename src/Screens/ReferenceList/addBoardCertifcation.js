import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import AddHealthcareGroup from './../../images/addGroupBlue.png';

const AddBoardCertifcation = ({ getAddBoardCertificationDialog }) => {
    const arrowDown = () => {
        return(
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddBoardCertificationDialog} onClose={() => getAddBoardCertificationDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>ADD / Edit Board Certification Specialties</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddBoardCertificationDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid} `}>
                        <div className={style.entityLableStyle}>Industry Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Healthcare" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Contracted Service Provide Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Physician / Doctor" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Primary Specialty Board*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="American Board of Anesthesiology" className={style.fullWidth} />
                            <RadioGroup
                                inline={true}
                                className={` ${style.marginLeft20} ${style.marginTop}`}
                                selectedValue={"ADD SUB-SPECIALTY"}
                            >
                                <Radio label="ADD SUB-SPECIALTY" value="ADD SUB-SPECIALTY" />
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={style.extentionGrid}>
                        <p></p>
                        <InputGroup value="Url link" className={`${style.entityLableStyle}`} />
                    </div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.extentionGrid}`}>
                            <div className={style.entityLableStyle}>Sub- Specialty Board*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Anesthetist" className={style.fullWidth} />
                            </div>
                        </div>
                        <div className={style.extentionGrid}>
                            <p></p>
                            <InputGroup value="Url link" className={`${style.entityLableStyle}`} />
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
                        <button onClick={() => getAddBoardCertificationDialog(false)} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & CLOSE</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddBoardCertifcation;