import React, { useState, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../../../images/crossPink.png";
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';

import { GET } from '../../../dataSaver';
import { Icon } from '@blueprintjs/core';

import style from './index.module.scss'

const SaveInProgressDialog = ({ getIsOpen, primaryPrivilege, getSelectedPrivilegeList }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [collapsibleIndexes, setCollapsibleIndexes] = useState([]);
    const [openIndex, setOpenIndex] = useState();

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
                    <div>
                        <div className={style.cardTitle}>{'Indicate the Privileges you are seeking as a(n) {Associate} for the {department anesthesiology / speciality}'}</div>
                    </div>
                    <CommonSelectField
                        value={staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeSetTitle)[0]}
                        onChange={(e) => handleChange(e.target.value)}
                        className={style.fullWidth}
                        valueList={staffPrivilege?.filter(data => !primaryPrivilege.includes(data?.id))?.map(data => data?.id) || []}
                        labelList={staffPrivilege?.filter(data => !primaryPrivilege.includes(data?.id))?.map(data => data?.privilegeSetTitle) || []}
                        disabledList={[].map(data => false)}
                        label={'Privilege Category'}
                    // required={false}
                    // warning={warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                    />

                    {
                        staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map((data) => data?.privilegeDetails?.corePrivilegeDetails?.corePrivilegesByCategories?.map((categories, index) => (
                            <div className={style.marginTop}>
                                <div className={`${style.categoryGrid} `}>
                                    {/* <div className={`${style.itemLeft} ${style.marginTop10}`}><CommonCheckBox
                                    // checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                                    // onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} label={`${fieldData.label}${(isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))) && '*'}`}
                                    /></div> */}
                                    <div className={`${style.itemLeft} `}>{categories?.category === null ? 'GENERAL' : categories?.category}</div>
                                    <div className={`${style.itemLeft} `}> {openIndex !== `primary${index}` ? <Icon icon="chevron-down" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex(`primary${index}`)} /> : <Icon icon="chevron-up" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex()} />}
                                    </div>
                                </div>
                                {openIndex === `primary${index}` && <>{
                                    categories?.privileges?.map(privileges => (
                                        <div className={style.twoColGrid}>
                                            <div className={style.itemLeft}>{privileges?.privilegeId || ''}</div>
                                            <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                        </div>

                                    ))
                                }</>}
                            </div>
                        )

                        )

                        )
                    }

                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getSelectedPrivilegeList(selectedPrivilege); getIsOpen(false); }}>ADD</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default SaveInProgressDialog;