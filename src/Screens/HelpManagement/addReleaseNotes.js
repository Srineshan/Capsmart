import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import style from './index.module.scss';

const AddReleaseNotes = ({getAddReleaseNotesDialog}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const leftElement = () => {
        return(
            <button className={style.uploadButtonStyle} >UPLOAD</button>
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    return(
        <Dialog isOpen={getAddReleaseNotesDialog} onClose={() => getAddReleaseNotesDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add Release Note</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddReleaseNotesDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>01-20-2022 14:03 IST</p>
                <p className={style.extensionOptionsStyle}>PERSON NAME</p>
                <div className={style.extensionOptionsStyle}>
                </div>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.extentionBoxStyle}`}>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Title*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Lorem Ipsum" className={style.fullWidth} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Keyword</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Lorem Ipsum" className={style.fullWidth} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Description*</div>
                    <div>
                        <TextArea
                            growVertically={true}
                            large={true}
                            value="Lorem Ipsum"
                            className={style.fullWidth}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Owner</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Lorem Ipsum" className={style.textFieldWidth} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={`${style.extentionLableStyle}`}>Contractor Name*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            className={`${style.fullWidth} ${style.marginLeft20}`}>
                                <option value="Select Value">
                                Select Value
                                </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.uploadGrid} ${style.marginTop20}`}>
                    <InputGroup  leftElement={leftElement()} value="Choose File" />
                    <InputGroup value="Enter Link" className={style.fullWidth} />
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

export default AddReleaseNotes;