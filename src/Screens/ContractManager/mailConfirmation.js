import React,{useState} from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';
import Envelope from './../../images/envelope_color.png';

const SendEmail = ({getSendEmail}) => {

    return(
      <>
        <Dialog isOpen={getSendEmail} onClose={() => getSendEmail(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>EMAIL NOTIFICATION</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getSendEmail(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.alignCenter} >
                <img src={Envelope} alt="Envelope" className={`${style.envelopeImageStyle} ${style.marginTop20}`} />
            </div>
            <p className={`${style.extensionStyle} ${style.marginTop} ${style.alignCenter}`}>WARNING</p>
            <p className={`${style.sendMailConfirmationStyle} ${style.marginTop20}`}>
            You are about to send email to
            <span className={`${style.blueColor} ${style.marginLeft20} `}>
            4 People.
            </span>
             <span style={style.marginLeft1}>Would You Like To Proceed?</span>
            </p>
            <div>
                <div className={`${style.floatRight} ${style.marginTop20}`}>
                    <button className={`${style.cloneOutlinedButton} ${style.cursorPointer} ${style.paddingTop5}`}>NO</button>
                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} ${style.paddingTop5}`} >YES</button>
                </div>
            </div>
          </div>
        </Dialog>
      </>
    )
}

export default SendEmail;
