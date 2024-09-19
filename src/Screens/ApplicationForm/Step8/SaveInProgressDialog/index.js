import React, { useState, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../../../images/crossPink.png";
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import { GET } from '../../../dataSaver';
import { Icon } from '@blueprintjs/core';

import style from './index.module.scss'

const SaveInProgressDialog = ({ getIsOpen, primaryPrivilege }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [collapsibleIndexes, setCollapsibleIndexes] = useState([]);

    console.log('staffPrivilege', staffPrivilege)

    useEffect(() => {
        getStaffPrivilege();
    }, [])

    const getStaffPrivilege = async () => {
        const { data: privilege } = await GET(
            `entity-service/staffPrivilege`
        );
        setStaffPrivilege(privilege);
    }

    const handleChange = (privilegeId) => {
        setSelectedPrivilege(privilegeId);
    }

    const handleCollapse = (value, index) => {
        console.log('value', value, index)

        let temp = collapsibleIndexes;
        if (value === 'open') {
            console.log('inside if_')
            temp.push(index);
            setCollapsibleIndexes(temp);

        } else {
            setCollapsibleIndexes(temp?.filter(data => data !== index)?.map(data => data));

        }
    }


    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.spaceBetween}>
                        <div className={style.heading}>Requesting Additional Privileges</div>
                        <div className={style.displayInRow}>
                            <img
                                src={CrossPink}
                                alt="cross"
                                className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                onClick={() => { getIsOpen(false) }}
                            />
                        </div>
                    </div>
                    <div >
                        <div className={style.cardTitle}>{'Indicate the Privileges you are seeking as a(n) {Associate} for the {department anesthesiology / speciality}'}</div>
                    </div>
                    <CommonSelectField
                        // value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                        onChange={(e) => handleChange(e.target.value)}
                        className={style.fullWidth}
                        valueList={staffPrivilege?.filter(data => data?.id !== primaryPrivilege)?.map(data => data?.id) || []}
                        labelList={staffPrivilege?.filter(data => data?.id !== primaryPrivilege)?.map(data => data?.privilegeSetTitle) || []}
                        disabledList={[].map(data => false)}
                        label={'Privilege Category'}
                    // required={false}
                    // warning={warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                    />

                    {
                        staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map((data, index) => data?.privilegeDetails?.corePrivilegeDetails?.corePrivilegesByCategories?.map(categories => (
                            <div className={style.marginTop}>
                                <div>{categories?.category === null ? '' : categories?.category}</div>
                                <div> {!collapsibleIndexes?.includes(`core${index}`) ? <Icon icon="chevron-down" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => handleCollapse('open', `core${index}`)} /> : <Icon icon="chevron-up" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => handleCollapse('close', `core${index}`)} />}
                                </div>{
                                    categories?.privileges?.map(privileges => (
                                        <div className={style.twoColGrid}>
                                            <div className={style.itemLeft}>{privileges?.privilegeId || ''}</div>
                                            <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                        </div>

                                    ))
                                }
                            </div>
                        )

                        )

                        )
                    }

                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); }}>ADD</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default SaveInProgressDialog;