import React, { useState } from 'react';
import { Dialog, Classes, Icon, Intent, InputGroup, Checkbox } from '@blueprintjs/core';
import style from './index.module.scss';

const AddNewContractManager = ({getAddNewManagerDialog}) => {
    const [selectedRole, setSelectedRole] = useState('Contract Manager');

    return(
        <Dialog isOpen={getAddNewManagerDialog} onClose={() => getAddNewManagerDialog(false)} className={`${style.addManagerDialogStyle} ${style.addManagerDialogBackground}`}>
          <div className={`${Classes.DIALOG_BODY} `}>
            <div className={style.spaceBetween}>
                <p className={style.extensionStyle}>Add New User As Contract Manager</p>
                <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getAddNewManagerDialog(false)}  />
            </div>
            <div className={style.extensionBorder}></div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Name*</div>
                    <div className={style.displayInRow}>
                        <InputGroup value="Sanjaya" />
                        <InputGroup value="Kumara" className={style.marginLeft20} />
                    </div>
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Email*</div>
                    <InputGroup value="skumara@gmail.com" />
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Cell</div>
                    <InputGroup value="556546357" />
                </div>
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Role*</div>
                    <div className={style.reduce10Left}>
                        <select
                            name="class"
                            id="Class"
                            value={selectedRole || 'Select...'}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className={`${style.fullWidth} ${style.marginLeft20} `}>
                                <option value="Contract Manager" >
                                Contract Manager
                                </option>
                                <option value="User" >
                                User
                                </option>
                        </select>
                    </div>
                </div>
                <div>
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                        <button className={`${style.buttonStyle} ${style.marginLeft20}`}>SAVE</button>
                    </div>
                </div>
            </div>
            {selectedRole === "User" && (
            <div className={`${style.roleBoxStyle} ${style.marginLeft20} ${style.floatRight}`}>
                <Checkbox label="Activity Logger" checked />
                <Checkbox label="Reviewer" checked />
                <Checkbox label="Approver" />
                <Checkbox label="Accounts Payable" />
                <Checkbox label="Contracts manager" />
                <Checkbox label="Report viewer" />
            </div>
            )}
            
        </Dialog>
    )
}

export default AddNewContractManager;