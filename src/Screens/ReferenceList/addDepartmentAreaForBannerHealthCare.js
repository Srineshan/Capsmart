import React from "react";
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import AddHealthcareGroup from './../../images/addGroupBlue.png';
import style from './index.module.scss';


const AddDepartmentAreaForBannerHealthcare = ({ getAddDepartmentforHealthcareDialog }) => {
    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddDepartmentforHealthcareDialog} onClose={() => getAddDepartmentforHealthcareDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add / Edit Department / Service area for Banner Healthcare System </p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle}  />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid} `}>
                        <div className={style.entityLableStyle}>Site*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Arizona Metripolitian hospital" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Department Name*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Surgical Services" className={style.halfWidth} />
                            <img src={AddHealthcareGroup} alt="OpenFolder" className={`${style.colorFileStyle} ${style.marginLeft20} ${style.marginTop}`} />
                            <p className={`${style.marginTop7} ${style.marginLeft5} ${style.fontStyle}`}>ADD SERVICES</p>
                        </div>
                    </div>

                    <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Alias Name </div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Alias 1" className={`${style.width34} ${style.marginRight} ${style.entityLableStyle1}`} />
                            <InputGroup value="Alias 2" className={`${style.width34} ${style.entityLableStyle1}`} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle1}`}>
                        <div className={`${style.extentionGrid}`}>
                            <div className={style.entityLableStyle}>Service Name*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Cardiothoracic Surgery" className={style.fullWidth} />
                            </div>
                        </div>

                        <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>Alias Name </div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Alias 1" className={`${style.width50} ${style.marginRight} ${style.entityLableStyle1}`} />
                                <InputGroup value="Alias 2" className={`${style.width50} ${style.entityLableStyle1}`} />
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
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & CLOSE</button>
                    </div>
                </div>
            </div>
        </Dialog>

    )
}

export default AddDepartmentAreaForBannerHealthcare;