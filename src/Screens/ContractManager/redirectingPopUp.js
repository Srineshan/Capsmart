import React, {useState} from 'react';
import {Dialog, Classes} from '@blueprintjs/core';
import style from './index.module.scss';

const RedirectingPopUp = ({getCurrentPage, tabName, title, description, buttonText}) => {
  return(
    <>
      <div className={style.cloneBlockStyle}></div>
      <Dialog isOpen={true} className={`${style.cloneDialog}`} canOutsideClickClose={false}>
        <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle}>{title}</p>
          </div>
          <div className={style.extensionBorder}></div>
          <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
          {description}
          </p>
          <div className={`${style.positionCenter} ${style.marginTop20}`}>
            <button className={`${style.newContractButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={() => getCurrentPage(tabName)}>{buttonText}</button>
          </div>
          <br />
        </div>
      </Dialog>
    </>
  )
}

export default RedirectingPopUp;
