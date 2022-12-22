import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';

const Alert = ({getShowAlertDialog, header, content, redirectTo}) => {
  const navigate = useNavigate();
  const submit = () => {
    getShowAlertDialog(false, 'ok');
    navigate(`/${redirectTo}`);
  }

    return(
      <>
        <Dialog isOpen={getShowAlertDialog} onClose={() => getShowAlertDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
          <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>{header}</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getShowAlertDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
            {content}
            {
              // <span className={`${style.blueColor} ${style.marginLeft20}`}>
              // quis nostrud xercitation ullamco laboris nisi
              // ut aliquip ex ea commodo consequat
              // </span>
            }
            </p>
            <div className={`${style.positionCenter} ${style.marginTop20}`}>
                <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={submit}>OK</button>
            </div>
          </div>
        </Dialog>
      </>
    )
}

export default Alert;
