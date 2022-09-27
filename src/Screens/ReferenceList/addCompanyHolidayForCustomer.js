import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import CrossPink from './../../images/crossPink.png';

const AddCompanyHolidayForCustomer = ({ getAddCompanyHolidayDialog }) => {
   
    return (
        <Dialog isOpen={getAddCompanyHolidayDialog} onClose={() => getAddCompanyHolidayDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add Company Holiday</p>
                    <img src={CrossPink} className={`${style.colorFileStyle2} ${style.marginLeft20}`} onClick={() => getAddCompanyHolidayDialog(false)}/>
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.editHealthCareGrid2}`}>
                        <div className={style.entityLableStyle}>Event Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Company Holiday" className={style.halfWidth} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={style.editHealthCareGrid1}>
                        <p></p>
                    </div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Holiday Event Name*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Religious Holiday" className={style.fullWidth} />
                            </div>
                        </div>
                        <div className={`${style.AddCompanyHolidayGrid1} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>Event date*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value="Mm-dd-yyyy" className={style.fullWidth} />
                            </div>
                            <p className={`${style.entityLableStyle2}`}>auto: Display day of the week</p>
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

export default AddCompanyHolidayForCustomer;