import React from "react";
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';


const AddContractDocumentTypeForUpload = ({ getAddEntityDialog }) => {
    return (
        <Dialog isOpen={getAddEntityDialog} onClose={() => getAddEntityDialog(false)} className={`${style.healthCareDialogStyle} ${style.dialogPaddingBottom}`}>
            <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}> Add / Edit Contract Document Type Upload</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.dialogCrossStyle} onClick={() => getAddEntityDialog(false)} />
                </div>
                <div className={style.ReferenceListEntityBorder}></div>
                <div className={`${style.addHealthCareBoxStyle}`}>
                    <div className={`${style.extentionGrid}`}>
                        <div className={style.entityLableStyle}>Contract Document Type*</div>
                        <div className={style.displayInRow}>
                            <InputGroup value="Supporting Document" className={style.fullWidth} />
                        </div>
                    </div>

                </div>
                <div className={`${style.floatRight} ${style.marginTop150}`}>
                    <button className={style.outlinedButton} onClick={() => getAddEntityDialog(false)}>CANCEL</button>
                    <button onClick={() => getAddEntityDialog(false)} className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
                </div>
            </div>
        </Dialog>

    )
}

export default AddContractDocumentTypeForUpload;