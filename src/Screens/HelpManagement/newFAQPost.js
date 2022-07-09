import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import style from './index.module.scss';

const NewFAQPost = ({getNewFAQPostDialog}) => {
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
        <Dialog isOpen={getNewFAQPostDialog} onClose={() => getNewFAQPostDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>New Faq Post</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getNewFAQPostDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <div>
                    <p className={style.extentionLableStyle}>Uploaded Date & Time</p>
                    <p className={`${style.extensionOptionsStyle} ${style.reduceTop10}`}>01-20-2022 14:03 IST</p>
                </div>
                <div>
                    <p className={style.extentionLableStyle}>Posted By</p>
                    <p className={`${style.extensionOptionsStyle} ${style.reduceTop10}`}>LOREM IPSUM</p>
                </div>
                <div>
                    <p className={style.extentionLableStyle}>Requested By</p>
                    <p className={`${style.extensionOptionsStyle} ${style.reduceTop10}`}>LOREM IPSUM</p>
                </div>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.faqBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Question*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Lorem ipsum dolor sit amet, consectetur?" className={style.fullWidth} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Answer*</div>
                    <div>
                        <TextArea
                            large={true}
                            value="Lorem Ipsum"
                            rows={5}
                            className={style.fullWidth}
                        />
                    </div>
                </div>
                <div className={`${style.floatRight} ${style.textAreaIconPositions}`}>
                    <div className={style.displayInRow}>
                        <Icon icon="link" color="#7165E3" size={18} className={style.marginRight20} />
                        <Icon icon="media" color="#7165E3" size={18} className={style.marginRight20} />
                        <Icon icon="paperclip" color="#7165E3" size={18} className={style.marginRight20} />
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>POST FAQ</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default NewFAQPost;