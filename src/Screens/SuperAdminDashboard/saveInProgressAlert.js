import React,{useState} from 'react';
import { Icon, Intent, Dialog, Classes } from '@blueprintjs/core';
import {Link, useNavigate} from 'react-router-dom';
import SetupCompleteImg from './../../images/setupCompleteImg.png';
import Alert from './../../images/alert.png';
import style from './index.module.scss';

const SaveInProgressAlert = ({alert, getSaveInProgressAlert, fieldData, saveInProgressFunction}) => {
  return(
    <Dialog isOpen={alert} onClose={() => getSaveInProgressAlert(false)} className={`${style.bulkUploadDialog}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.bulkUploadDialogBackground}`}>
            <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                    <img src={Alert} alt="alert" className={style.alertImgStyle} />
                    <p className={`${style.extensionStyle} ${style.marginTop10} ${style.marginLeft10}`}>SAVE IN-PROGRESS ALERT</p>
                </div>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.alertCrossStyle} onClick={() => getSaveInProgressAlert(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <p className={`${style.descriptionHeading} ${style.marginTop30}`}>Following data are missing</p>
            <p className={`${style.cloneContent} ${style.marginTop20} ${style.alertTextColor}`}>
                {fieldData}
            </p>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={`${style.buttonStyle} ${style.marginLeft20} ${style.marginBottom20}`} onClick={saveInProgressFunction}>SAVE & QUIT</button>
            </div>
        </div>
    </Dialog>
  )
}

export default SaveInProgressAlert;
