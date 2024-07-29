import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';
import DeclineMailTemplate from './declineMailTemplate';

const ApplicationDecline = ({ getApplicationDeclineDialog }) => {
  const [showDeclineMailDialog, setShowDeclineMailDialog] = useState(false);

  const getDeclineMailDialog = (value) => {
    setShowDeclineMailDialog(value);
    getApplicationDeclineDialog(false)
  }

  return (
    <div>
      <Dialog isOpen={getApplicationDeclineDialog} onClose={() => getApplicationDeclineDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
        <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
          <div className={style.spaceBetween}>
            <p className={style.extensionStyle1}>{"Decline Application For {Name} {Doctor}"}</p>
            <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getApplicationDeclineDialog(false)} />
          </div>
          <div>
            <div className={`${style.rejectionBorderStyle} ${style.declineBorderStyle}`}>
              <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
                <div className={style.displayInRow}>
                  <span className={style.rejectionHeadingTextStyle}>LAST, First MI</span>
                  <span className={`${style.rejectionSubHeadingTextStyle} ${style.marginLeft20} ${style.alignCenter}`}>7837428</span>
                </div>
              </div>
              <div className={`${style.rejectionTextStyle} ${style.marginLeft20} ${style.marginTop5}`}>{"{Doctor}"}</div>
              <div className={style.marginTop10}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Department:</span>
                    <span className={`${style.rejectionTextStyle}`}>{"{Department}"}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Staff Manager:</span>
                    <span className={`${style.rejectionTextStyle}`}>{"{Staff Manager Name}"}</span>
                  </div>
                </div>
              </div>
              <div className={style.marginTop5}>
                <div className={`${style.twoColumnGrid} ${style.marginLeftRight20} ${style.marginBottom10}`}>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Speciality:</span>
                    <span className={`${style.rejectionTextStyle}`}>{"{Speciality}"}</span>
                  </div>
                  <div className={`${style.twoColumnGridInner}`}>
                    <span className={`${style.rejectionTextStyle}`}>Site Name:</span>
                    <span className={`${style.rejectionTextStyle}`}>{"Only If Multisite"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.marginTop20} ${style.rejectionTextStyle}`}>Reasons For Declining Applicant*
              <div className={`${style.rejectionBorderStyle} ${style.marginTop10}`}>
                <div className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop10}`}>
                  <div className={style.displayInRow} style={{ height: "90px" }}>
                    <div className={`${style.rejectionTextStyle}`}>Text</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${style.displayInRow} ${style.alignCenter} ${style.marginTop10}`}>
              <button className={`${style.buttonStyle} ${style.sendNotificationsButtonWidth} ${style.marginLeft20} ${style.floatRight} ${style.cursorPointer}`} onClick={() => setShowDeclineMailDialog(true)}>DECLINE APPLICATION</button>
            </div>
          </div>
        </div>
      </Dialog>
      {
        showDeclineMailDialog && (
          <DeclineMailTemplate getDeclineMailDialog={getDeclineMailDialog} />
        )
      }
    </div>
  )
}

export default ApplicationDecline;
