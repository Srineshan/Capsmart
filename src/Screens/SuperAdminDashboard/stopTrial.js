import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, InputGroup, Button, RadioGroup, Radio, Switch } from '@blueprintjs/core';
import { DateInput, IDateFormatProps } from "@blueprintjs/datetime";
import style from './index.module.scss';

const StopTrial = ({getStopTrialDialog}) => {
    const [selectedContract, setSelectedContract] = useState('Written Contract Extension For Fixed Term');
    const [startDate, setStartDate] = useState(new Date);
    const [terminationTrigger, setTerminationTrigger] = useState('Contract Expiration')
    const leftElement = () => {
        return(
            <Button text="Upload" intent={Intent.PRIMARY} />
        )
    }

    const calendarIcon = () => {
        return(
            <Icon icon="calendar" intent={Intent.PRIMARY} className={style.calendarStyle} />
        )
    }

    return(
        <Dialog isOpen={getStopTrialDialog} onClose={() => getStopTrialDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Stop Trial</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle2} onClick={() => getStopTrialDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.spaceBetween}>
                <p className={style.extensionOptionsStyle}>CUSTOMER NAME (0043245)</p>
                <p className={style.extensionOptionsStyle}>TRIAL SUBCCRIPTION</p>
                <p className={style.extensionOptionsStyle}>EXPIRING IN 2 DAYS</p>
            </div>
            <div className={style.extensionBorder}></div>
            <div className={`${style.grid2}`}>
                <div className={`${style.grid2} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Subscription Plan *</div>
                    <div className={style.marginTop10} >Trial Plan</div>
                </div>
                <div className={`${style.grid2} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Trial Period *</div>
                    <div className={style.marginTop10} >7 Days</div>
                </div>
            </div>
            <div className={`${style.grid2}`}>
                <div className={`${style.grid2} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Trial Start Date</div>
                    <div className={style.marginTop10} >02-16-2022 - 02-24-2022</div>
                </div>
            </div>
            <div className={`${style.grid2}`}>
                <div className={`${style.grid2} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Trial Contact Name</div>
                    <div className={style.marginTop10} >Swati BHOSLE</div>
                </div>
            </div>
            <div className={`${style.grid2}`}>
                <div className={`${style.grid2} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Email*</div>
                    <div className={style.marginTop10} >swati@timesmart.ai</div>
                </div>
                <div className={`${style.grid2} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell Phone</div>
                    <div className={style.marginTop10} >+1 (342) 444-5505</div>
                </div>
            </div>
            <div className={`${style.extentionBoxStyle}`}> 
                <div className={`${style.extentionGrid}`}>
                    <div className={style.extentionLableStyle}>Stop Trial Comments / Notes*</div>
                    <div>
                        <TextArea
                            growVertically={true}
                            large={true}
                            value="text area"
                            className={style.fullWidth}
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={style.outlinedButton}>CANCEL</button>
                    <button className={`${style.buttonStyle} ${style.marginLeft20}`}>STOP TRIAL</button>
                </div>
            </div>
          </div>
        </Dialog>
    )
}

export default StopTrial;