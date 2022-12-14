import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import {Link} from 'react-router-dom';

const AddContractedServiceForHospital = ({ getAddContractedServiceDialog}) => {
    const arrowDown = () => {
        return(
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    
    return (
        <Dialog isOpen={getAddContractedServiceDialog} onClose={() => getAddContractedServiceDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add/Edit Contracted Service Providers For Hospital / Acute Care Facility (Acf)</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddContractedServiceDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Entity / Site Type*</div>
                        <div className={style.displayInRow}>
                        <InputGroup value="Hospital / Acute Care Facility (ACF)" className={style.fullWidth} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop20}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.absenseCareGrid2}`}>
                            <div className={style.entityLableStyle}>Contracted Service Provider Type*</div>
                            <div className={style.displayInRow}>
                                <InputGroup value={'Nursing Professional'} className={style.fullWidth} />
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
                        <button  onClick={() => getAddContractedServiceDialog(false)}  className={style.outlinedButton}>CANCEL</button>
                        <Link to={'/referenceList/contractServiceProviderMultiSite'} className={style.linkStyle}><button onClick={() => getAddContractedServiceDialog(false)} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button></Link>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddContractedServiceForHospital;