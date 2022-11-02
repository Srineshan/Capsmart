import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import ArrowDown from './../../images/arrowDown.png';
import style from './index.module.scss';
import { Link } from 'react-router-dom';

const AddFunctionalTitlesForCustomer = ({ getAddFunctionalTitlesDialog }) => {
    const arrowDown = () => {
        return (
            <img src={ArrowDown} className={`${style.colorFileStyle3} ${style.marginRight}`} />
        )
    }
    return (
        <Dialog isOpen={getAddFunctionalTitlesDialog} onClose={() => getAddFunctionalTitlesDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Add/Edit Functional Titles For Contracted Service Providers</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddFunctionalTitlesDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.editHealthCareGrid2}`}>
                        <div className={style.entityLableStyle}>Industry Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Healthcare" className={`${style.width150} ${style.entityLableStyle1}`} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Entity / Site Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Hospital / Acute Care Facility (ACF)" className={`${style.width150} ${style.entityLableStyle1}`} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.editHealthCareGrid2} ${style.marginTop20}`}>
                        <div className={style.entityLableStyle}>Contracted Service Provide Type*</div> 
                        <div className={style.displayInRow}>
                            <InputGroup value="Dental Professional" className={style.width150} rightElement={arrowDown()} />
                        </div>
                    </div>
                    <div className={`${style.ReferenceListEntityBorder} ${style.marginTop10}`}></div>
                    <div className={`${style.addHealthCareBoxStyle}`}>
                        <div className={`${style.editHealthCareGrid2}`}>
                            <div className={style.entityLableStyle}>Functional Title*</div>
                            <InputGroup value="Dentist" className={`${style.fullWidth} ${style.entityLableStyle1}`} />
                        </div>
                        <div className={`${style.editFunctionalTitlesGrid} ${style.marginTop20}`}>
                            <div className={style.entityLableStyle}>ALias Name</div>
                            <InputGroup value="Alias 1" className={`${style.fullWidth} ${style.entityLableStyle1}`} />
                            <InputGroup value="Alias 2" className={`${style.fullWidth} ${style.entityLableStyle1}`} />
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
                        <Link to='/referenceList/functionalTitleMultiSitesForCustomer'><button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE & CLOSE</button></Link>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AddFunctionalTitlesForCustomer;