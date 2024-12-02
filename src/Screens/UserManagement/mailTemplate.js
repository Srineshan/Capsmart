import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox, Divider, TextArea } from '@blueprintjs/core';
import style from './index.module.scss';

const MailTemplate = ({ getMailTemplate }) => {
  const leftElement = (text, icon) => {
    return (
      <div className={`${style.displayInRow} ${style.mailLeftElement} `}>
        {icon ?
          <>
            <Icon icon="envelope" color="#2C2C2C" />
            <p className={style.marginLeft20}>{text}</p>
          </> :
          <p>{text}</p>
        }
      </div>
    )
  }


  return (
    <Dialog isOpen={getMailTemplate} onClose={() => getMailTemplate(false)} className={`${style.addManagerDialogBackground} ${style.mailTemplate}`}>
      <div className={`${Classes.DIALOG_BODY} `}>
        <div className={style.spaceBetween}>
          <p className={style.extensionStyle}>Email To Registered User</p>
          <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getMailTemplate(false)} />
        </div>
        <div className={style.extensionBorder}></div>

        <div className={`${style.marginTop20}`}>
          <InputGroup leftElement={leftElement('To:', true)} value="drsanjaya64@gmail.com, eduardo.semiari@peexel.com" />
        </div>

        <div className={`${style.marginTop20}`}>
          <InputGroup leftElement={leftElement('Cc:', true)} />
        </div>

        <Divider className={style.marginTop20} />

        <div className={`${style.marginTop20}`}>
          <InputGroup leftElement={leftElement('Subject:', false)} />
        </div>

        <div className={`${style.marginTop20}`}>
          <TextArea
            fill={true}
            growVertically={true}
            large={true}
            intent={Intent.PRIMARY}
            rows={10}
            value="Hello Mr ..... Praesent vehicula sem non vestibulum suscipit. Donec lectus enim, condimentum sit amet nisl et, posuere venenatis dui. Morbi tincidunt cursus odio nec gravida. Duis congue, tellus quis condimentum ornare, leo velit consectetur metus, a auctor felis enim quis odio. Nullam sit amet sem vitae magna commodo euismod ac nec mauris. Vestibulum suscipit dictum lacus, vel facilisis urna ornare semper. Sed ultricies, metus non tristique porttitor, augue justo posuere turpis, eget suscipit mi enim et neque. Phasellus euismod tortor eu facilisis finibus. Donec sapien sem, egestas sed tellus sit amet, malesuada congue est. Suspendisse leo eros, auctor vitae libero placerat, suscipit ultrices sem. Quisque ac eleifend sem, sit amet pulvinar justo. Interdum et malesuada fames ac ante ipsum primis in faucibus."
          />
        </div>
        <div className={`${style.marginTop20}`}>
          <Checkbox checked={true} label="File Attatchment" />
        </div>


        <div className={` ${style.marginTop20}`}>
          <button className={`${style.outlinedButton}`} >RESET</button>
          <button className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight}`} >SEND NOTIFICATION</button>
          <button className={`${style.outlinedButton} ${style.marginLeft20} ${style.floatRight}`} >CANCEL</button>
        </div>
      </div>
    </Dialog>
  )
}

export default MailTemplate;
