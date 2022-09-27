import React from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, RadioGroup, Radio } from '@blueprintjs/core';
import style from './index.module.scss';

const DeleteDraftContract = ({getDeleteDraftDialog}) => {
    return(
        <Dialog isOpen={getDeleteDraftDialog} onClose={() => getDeleteDraftDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Delete Draft Contract</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getDeleteDraftDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>PAMF CONTRACT (0043245)</p>
                <p className={style.extensionOptionsStyle}>MULTIPLE CONTRACTORS (34)</p>
                <p className={style.extensionOptionsStyle}>EXPIRING IN 20 DAYS</p>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Termination Trigger*</div>
                <RadioGroup
                    inline={true}
                    selectedValue="Yes"
                >
                    <Radio label="No" value="No"  />
                    <Radio label="Yes" value="Yes" checked/>
                </RadioGroup>
            </div>
            <div className={`${style.deleteDraftBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Reason For Deleting Contract*</div>
                    <TextArea value="text area" rows="4" />
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton}>CANCEL</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>DELETE</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default DeleteDraftContract;