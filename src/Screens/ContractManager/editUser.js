import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, } from '@blueprintjs/core';
import style from './index.module.scss';

const EditUser = ({getEditUserDialog}) => {
    return(
        <Dialog isOpen={getEditUserDialog} onClose={() => getEditUserDialog(false)} className={`${style.addManagerDialogBackground} ${style.addProofDialog}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Edit User</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getEditUserDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
            <div className={style.proofBorder}>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Customer Type*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                    <select
                        name="class"
                        id="Class"
                        className={`${style.fullWidth} ${style.marginLeft20} `}>

                            <option value="Select Customer Type" >
                              Select Customer Type
                            </option>
                    </select>
                  </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20} ${style.displayInRow}`}>
              <div className={style.extentionLableStyle}>Customer Name*</div>
              <div className={style.displayInRow}>
              <InputGroup value="John" className = {style.fieldWidth2InARow} />
              <InputGroup value="Doe" className = {`${style.fieldWidth2InARow} ${style.marginLeft20}`} />
              </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Email Address*</div>
              <InputGroup placeholder="email@gmail.com" />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Department*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                    <select
                        name="class"
                        id="Class"
                        className={`${style.fullWidth} ${style.marginLeft20} `}>

                            <option value="Select Department" >
                              Select Department
                            </option>
                    </select>
                  </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Role*</div>
                <div className={`${style.reduce10Left} ${style.marginRight}`}>
                    <select
                        name="class"
                        id="Class"
                        className={`${style.fullWidth} ${style.marginLeft20} `}>
                            <option value="Select Role-multi select" >
                              Select Role-multi select
                            </option>
                    </select>
                  </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
              <div className={style.extentionLableStyle}>Title*</div>
              <InputGroup value="Title" />
            </div>

        </div>

            <div className={` ${style.marginTop20}`}>
            <button className={`${style.outlinedButton} ${style.marginLeft20}`} >BLOCK</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20}`} >DEACTIVATE</button>
            <button className={`${style.buttonStyle} ${style.marginLeft20} ${style.floatRight}`} >ADD</button>
            </div>
        </div>
        </Dialog>
    )
}

export default EditUser;
