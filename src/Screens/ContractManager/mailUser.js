import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup } from '@blueprintjs/core';
import Search from './../../images/search.png';
import UserLogo2 from './../../images/userLogo2.png';
import UserLogo1 from './../../images/userLogo.jpg';
import style from './index.module.scss';
import MailTemplate from './mailTemplate';

const SendEmailUserList = ({ getSendEmailNotification }) => {
  const [showMailTemplate, setShowMailTemplate] = useState(false);

  const getShowMailTemplate = (value) => {
    setShowMailTemplate(value)
  }

  return (
    <>
      <Dialog isOpen={getSendEmailNotification} onClose={() => getSendEmailNotification(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>SEND EMAIL NOTIFICATION</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getSendEmailNotification(false)} />
          </div>
          <div className={style.extensionBorder}></div>
          <div className={style.padding10}>
            <div className={`${style.reduce10Left} ${style.marginTop10}`}>
              <select
                name="class"
                id="Class"
                className={`${style.fullWidth} ${style.marginLeft20} `}>
                <option value="Blocked UserNotification Template 1" >
                  Blocked UserNotification Template 1
                </option>
              </select>
            </div>
            <p className={`${style.blackText} ${style.marginTop20}`}>BLOCKED USER RECIPIENTS</p>
            <div className={`${style.searchBarStyle} ${style.displayInRow} ${style.fullWidth}`}>
              <img src={Search} className={style.searchIcon} />
              <p>Search by name or email…</p>
            </div>
            <div className={style.padding10}>
              <div className={`${style.userMailListGrid} ${style.padding10}`}>
                <div className={`${style.marginTop10}`}></div>
                <img src={UserLogo1} alt={'User Logo 1'} className={style.userLogoMailStyle} />
                <p className={`${style.marginTop10} ${style.mailIdTextColor}`}>Zakary98@gmail.com</p>
                <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
              </div>
              <div className={`${style.userMailListGrid} ${style.padding10}`}>
                <div className={` ${style.marginTop10}`}></div>
                <img src={UserLogo2} alt={'User Logo 1'} className={style.userLogoMailStyle} />
                <p className={`${style.marginTop10} ${style.mailIdTextColor}`}>Percy3@gmail.com</p>
                <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
              </div>
              <div className={`${style.userMailListGrid} ${style.padding10}`}>
                <div className={`${style.marginTop10}`}></div>
                <img src={UserLogo1} alt={'User Logo 1'} className={style.userLogoMailStyle} />
                <p className={`${style.marginTop10} ${style.mailIdTextColor}`}>Marianna_Romaguera@hotmail.com</p>
                <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
              </div>
            </div>
            <div>
              <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`}>CANCEL</button>
                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `} onClick={() => setShowMailTemplate(true)}>NEXT</button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      {
        showMailTemplate && (
          <MailTemplate getShowMailTemplate={getShowMailTemplate} />
        )
      }
    </>
  )
}

export default SendEmailUserList;
