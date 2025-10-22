import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';
import Envelope from './../../../images/envelope_color.png';

const MailTemplateNotification = ({ getSendEmail }) => {

  return (
    <>
      <Dialog isOpen={getSendEmail} onClose={() => getSendEmail(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={`${style.extensionStyle1} ${style.marginTop} ${style.bold}`}>{`{Application Email Template Name} Sent`}</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getSendEmail(false)} />
          </div>
          <div className={style.extensionBorder}></div>
          <div className={style.displayInRow}>
            <div className={`${style.spaceBetween} ${style.alignCenter}`} >
              <img src={Envelope} alt="Envelope" className={`${style.envelopeImageStyle} ${style.marginTop20}`} />
              <div className={`${style.marginLeft20} ${style.rejectionTextStyle}`}>{`Email Notifcation has been sent successfully to {supervisor}`}</div>
            </div>
          </div>
          <div>
            <div className={`${style.displayInRow} ${style.alignCenter} ${style.marginTop5} ${style.padding20}`}>
              <button className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer}`} onClick={() => getSendEmail(false)}>OKAY</button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default MailTemplateNotification;
