import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";

import style from './index.module.scss'

const ValidationDialog = ({ getIsOpen, labelList, getSkipClicked }) => {
  console.log(labelList, 'Metadatarrrr')
  return (
    <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
      <div>
        <div className={Classes.DIALOG_BODY}>
          <div className={style.spaceBetween}>
            <div className={style.heading}>Mandatory Fields Alert!</div>
            {/* <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div> */}
          </div>
          <p className={`${style.description} ${style.marginTop}`}>The below fields are mandatory. </p>
          {labelList?.map((data, index) => (
            <div>
              {(data?.key?.split('.')[2] === 'contactAddress1' || data?.key?.split('.')[2] === 'contactAddress2' || data?.key?.split('.')[2] === 'contactAddress3') && labelList[index - 1]?.key?.split('.')[2] !== labelList[index]?.key?.split('.')[2] && (
                <p className={`${style.description} ${style.marginTop10} `}><strong>{data?.key?.split('.')[2] === 'contactAddress1' ? 'Home Address' : data?.key?.split('.')[2] === 'contactAddress2' ? 'Mailing Address' : 'Business Address'}</strong></p>
              )}
              <div className={style.serialNumberGrid}>
                <p className={`${style.description} ${style.marginTop10} ${style.marginLeft}`}>{`${index + 1}.`}</p>
                <div
                  className={`${style.description} ${style.marginTop10} ${style.marginLeft}`}
                  dangerouslySetInnerHTML={{
                    __html: window.location.pathname.includes("reappointmentApplicationForm")
                    ? data?.label?.label
                    : data?.label
                  }}
                />
              </div>
              {data?.error && (
                <p
                  className={`${style.description} ${style.marginTop10} ${style.marginLeft}`}
                >
                  {data.error}
                </p>
              )}

            </div>
          ))}
          <p className={`${style.description} ${style.marginTop}`}>Do you want to skip or continue your data entry?</p>
          <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>CONTINUE</div>
            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); getSkipClicked(true); }}>SKIP</div>
          </div>
        </div>

      </div>
    </Dialog >
  )
}

export default ValidationDialog;
