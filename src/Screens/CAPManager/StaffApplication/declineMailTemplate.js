import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox, Divider, TextArea } from '@blueprintjs/core';
import style from './index.module.scss';
import MailTemplateNotification from './mailTemplateNotification';

const DeclineMailTemplate = ({ getDeclineMailDialog }) => {
  const [sendEmail, setSendEmail] = useState(false);

  const getSendEmail = (value) => {
    setSendEmail(value);
    getDeclineMailDialog(false)
  }

  const leftElement = (text, icon) => {
    return (
      <div className={`${style.displayInRow} ${style.mailLeftElement} `}>
        {icon ?
          <>
            <Icon icon="envelope" />
            <p className={style.marginLeft20}>{text}</p>
          </> :
          <p>{text}</p>
        }
      </div>
    )
  }


  return (
    <div>
      <Dialog isOpen={getDeclineMailDialog} onClose={() => getDeclineMailDialog(false)} className={`${style.addManagerDialogBackground} ${style.mailTemplate}`}>
        <div className={`${Classes.DIALOG_BODY} `}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle1}>{`Decline Application For {Name} {Doctor}`}</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getDeclineMailDialog(false)} />
          </div>
          <div className={style.extensionBorder}></div>

          <div className={`${style.marginTop20}`}>
            <InputGroup leftElement={leftElement('To: ', true)} value="Institution@email.com" />
          </div>

          <div className={`${style.marginTop20}`}>
            <InputGroup leftElement={leftElement('Cc: ', true)} value="Select registered user to Cc…" />
          </div>

          <Divider className={style.marginTop20} />

          <div className={`${style.marginTop20}`}>
            <InputGroup leftElement={leftElement('Subject:  ', false)} value="Decline Application For {Name} {Doctor}" />
          </div>

          <div className={`${style.marginTop20}`}>
            <TextArea
              fill={true}
              growVertically={true}
              large={true}
              intent={Intent.PRIMARY}
              rows={10}
              value="Hi {First name}: Praesent vehicula sem non vestibulum suscipit. Donec lectus enim, condimentum sit amet nisl et, posuere venenatis dui. Morbi tincidunt cursus odio nec gravida. Clarification Required: The completed file will be forwarded to the credentials committee and medical advisory committee for review before being forwarded to the board of Cambridge Memorial Hospital for final consideration. We are looking forward to your response Warm Regards {sender name}"
            />
          </div>

          <div className={` ${style.marginTop20}`}>
            <button className={`${style.outlinedButton} ${style.cursorPointer}`} >RESET</button>
            <button className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer}`} onClick={() => setSendEmail(true)}>NEXT</button>
            <button className={`${style.outlinedButton} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer}`} >CANCEL</button>
          </div>
        </div>
      </Dialog>
      {sendEmail && (
        <MailTemplateNotification getSendEmail={getSendEmail} />
      )}
    </div>
  )
}

export default DeclineMailTemplate;
