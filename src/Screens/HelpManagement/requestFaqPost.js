import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button } from '@blueprintjs/core';
import style from './index.module.scss';

const RequestFAQPost = ({getRequestFAQPostDialog}) => {
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
        <Dialog isOpen={getRequestFAQPostDialog} onClose={() => getRequestFAQPostDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Request To Post FAQ</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getRequestFAQPostDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.grid3}>
                <div>
                    <p className={`${style.extensionOptionsStyle}`}>01-20-2022 14:03 IST</p>
                </div>
                <div>
                    <p className={style.extensionOptionsStyle}>Person Name</p>
                </div>
                <div>
                    <p></p>
                </div>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.faqBoxStyle}`}>
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Full Name*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Lorem Ipsum" className={style.fullWidth} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Email Address*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Lorem Ipsum" className={style.fullWidth} />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Frequently asked questions*</div>
                    <div>
                        <TextArea
                            large={true}
                            value="Lorem Ipsum"
                            rows={5}
                            className={style.fullWidth}
                        />
                    </div>
                </div>
                <div className={`${style.extentionGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Reason To Post Request*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Reason" className={style.fullWidth} />
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SEND FAQ REQUEST</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default RequestFAQPost;