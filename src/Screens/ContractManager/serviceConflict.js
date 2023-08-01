import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import style from './index.module.scss';

const ServiceConflict = ({ updateConflict, conflict }) => {
    const navigate = useNavigate();
    const submit = () => {
        updateConflict(conflict);
    }
    let uniqueType = [];
    conflict?.conflict?.map(data => {
        if (!uniqueType.includes(data?.type)) {
            uniqueType.push(data?.type)
        }
    })

    return (
        <>
            <Dialog isOpen={conflict?.isPresent} onClose={() => updateConflict(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Data Conflicts</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => updateConflict(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>

                    {
                        uniqueType?.map(type => (
                            <>
                                <p className={` ${style.marginTop20}`}>
                                    {type}:
                                </p>
                                <div>
                                    {
                                        conflict?.conflict?.filter(data => data?.type === type)?.map(data => (
                                            <p className={`${style.deleteDescriptionStyle} ${style.marginTop20}`}>
                                                {data?.data} - {data?.missingData}
                                            </p>
                                        ))
                                    }
                                </div>
                            </>

                        ))

                    }

                    <div className={`${style.positionCenter} ${style.marginTop20}`}>
                        <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer}`} onClick={submit}>Update Anyway</button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ServiceConflict;
