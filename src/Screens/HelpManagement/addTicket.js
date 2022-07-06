import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';

const AddTicket = ({getAddTicketDialog}) => {
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
        <Dialog isOpen={getAddTicketDialog} onClose={() => getAddTicketDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>New Faq Post</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddTicketDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <div>
                    <p className={style.extentionLableStyle}>Date & Time</p>
                    <p className={`${style.extensionOptionsStyle} ${style.reduceTop10}`}>01-20-2022 14:03 IST</p>
                </div>
                <div>
                    <p className={style.extentionLableStyle}>User Name</p>
                    <p className={`${style.extensionOptionsStyle} ${style.reduceTop10}`}>PERSON NAME</p>
                </div>
                <div>
                    <p className={style.extentionLableStyle}>Entity Name</p>
                    <p className={`${style.extensionOptionsStyle} ${style.reduceTop10}`}>ST MATHEW HOSPITAL</p>
                </div>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.faqBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={`${style.extentionLableStyle}`}>Feedback Type*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            className={`${style.fieldWidth2InARow} ${style.marginLeft20}`}>
                                <option value="Lorem Ipsum">
                                Lorem Ipsum
                                </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Feedback Subject*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Lorem Ipsum" className={style.fullWidth} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Feedback Description*</div>
                    <div>
                        <TextArea
                            large={true}
                            value="Lorem Ipsum"
                            rows={3}
                            className={style.fullWidth}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={`${style.extentionLableStyle}`}>Work Impact*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            className={`${style.tutorialFieldWidth} ${style.marginLeft20}`}>
                                <option value="High">
                                High
                                </option>
                        </select>
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Include Screen Capture*</div>
                    <div className={style.displayInRow}>
                        <FormControlLabel
                            control={
                                <Switch checked={true}  size="small" />
                            }
                            className={`${style.switchFontStyle}`}
                            label={'YES'}                        
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton}>SAVE AS DRAFT</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SUBMIT TICKET</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default AddTicket;