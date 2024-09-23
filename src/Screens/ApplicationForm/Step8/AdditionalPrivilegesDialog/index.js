import React, { useState, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../../../images/crossPink.png";
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';

import { GET } from '../../../dataSaver';
import { Icon } from '@blueprintjs/core';
import CryptoJS from 'crypto-js';
import ESignature from '../../../../Components/ESignature';
import style from './index.module.scss'
import { format } from 'date-fns';

const AdditionalPrivileges = ({ getIsOpen, primaryPrivilege, getSelectedPrivilegeList, basicForm, selectedAdditionalPrivilegeForEdit }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [collapsibleIndexes, setCollapsibleIndexes] = useState([]);
    const [isAdditionalSigned, setIsAdditionalSigned] = useState(false);
    const [openIndex, setOpenIndex] = useState();
    const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] = useState([]);
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    let name = `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `;
    const [currentDate, setCurrentDate] = useState(format(new Date(), 'dd-MM-yyyy'));
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    console.log('staffPrivilege', staffPrivilege)

    useEffect(() => {
        getStaffPrivilege();
    }, [])

    useEffect(() => {
        if (selectedAdditionalPrivilegeForEdit?.id) {
            setSelectedPrivilege(selectedAdditionalPrivilegeForEdit?.id)
            setSelectedPrivilegeForDisplay([selectedAdditionalPrivilegeForEdit])
        }
    }, [selectedAdditionalPrivilegeForEdit])

    const getStaffPrivilege = async () => {
        const { data: privilege } = await GET(
            `entity-service/staffPrivilege`
        );
        setStaffPrivilege(privilege);
    }

    const handleChange = (privilegeId) => {
        setSelectedPrivilege(privilegeId);
        setSelectedPrivilegeForDisplay(staffPrivilege?.filter(data => data?.id === privilegeId))
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
                        value={selectedPrivilege}
                        onChange={(e) => handleChange(e.target.value)}
                        className={style.fullWidth}
                        firstOptionLabel={'Select the privilege set you would like to request'}
                        firstOptionValue={''}
                        valueList={staffPrivilege?.filter(data => !primaryPrivilege.includes(data?.id))?.map(data => data?.id) || []}
                        labelList={staffPrivilege?.filter(data => !primaryPrivilege.includes(data?.id))?.map(data => data?.privilegeSetTitle) || []}
                        disabledList={[].map(data => false)}
                        label={''}
                    // required={false}
                    // warning={warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                    />

                    {
                        staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map((data) => data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, index) => (
                            <div className={style.marginTop}>
                                <div className={`${style.categoryGrid} `}>
                                    {/* <div className={`${style.itemLeft} ${style.marginTop10}`}><CommonCheckBox
                                    // checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                                    // onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} label={`${fieldData.label}${(isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))) && '*'}`}
                                    /></div> */}
                                    <div className={`${style.itemLeft} `}>{categories?.category === null ? 'GENERAL' : categories?.category}</div>
                                </div>
                                <>
                                    {
                                        categories?.privileges?.map(privileges => (
                                            <div className={style.twoColGrid}>
                                                <div className={style.itemLeft}>{privileges?.privilegeId || ''}</div>
                                                <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                            </div>

                                        ))
                                    }
                                </>
                            </div>
                        )

                        )

                        )
                    }
                    {/* {selectedPrivilege !== '' && (
                        <div className={style.eSignGrid}>
                            <div
                                onClick={() => setIsAdditionalSigned(!isAdditionalSigned)}
                            >
                                <ESignature
                                    userName={isAdditionalSigned ? name : ""}
                                    encData={isAdditionalSigned ? encryptedText : ''}
                                    showData={isAdditionalSigned}
                                    showDatais={true}
                                />
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <div className={style.displayInRow}>
                                    <div className={style.dateTitle}>Date: </div>
                                    <div className={`${style.date} ${style.marginLeft}`}>{isAdditionalSigned ? currentDate : ""}</div>
                                </div>
                            </div>
                        </div>
                    )} */}

                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getSelectedPrivilegeList(selectedPrivilegeForDisplay); getIsOpen(false); }}>ADD</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default AdditionalPrivileges;