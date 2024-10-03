import React, { useState, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../../../images/crossPink.png";
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonRadio from '../../../../Components/CommonFields/CommonRadio';
import { GET, POST } from '../../../dataSaver';
import { Icon } from '@blueprintjs/core';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CryptoJS from 'crypto-js';

import VerifiedImage from "./../../../../images/verifiedImage.png";
import ToBeVerifiedImage from "./../../../../images/toBeVerifiedImage.png";
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import ESignature from '../../../../Components/ESignature';
import style from './index.module.scss'
import { format } from 'date-fns';

const AdditionalPrivileges = ({ getIsOpen, primaryPrivilege, getSelectedPrivilegeList, basicForm, selectedAdditionalPrivilegeForEdit, applicationId }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isRestrictedSigned, setIsRestrictedSigned] = useState(false);
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

    const startsWithVowel = (str) => /^[aeiouAEIOU]/.test(str);

    const handleChange = (privilegeId) => {
        setSelectedPrivilege(privilegeId);
        setSelectedPrivilegeForDisplay(staffPrivilege?.filter(data => data?.id === privilegeId))
    }

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": file?.name
        };
        const formData = new FormData();

        if (file !== null) {

            formData.append('files', new Blob([JSON.stringify(fileName)], {
                type: "application/json"
            }));
            formData.append('documents', file);
            try {
                const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
                SuccessToaster('File Uploaded Successfully');
                console.log(response?.data);
                return response?.data;
            } catch (error) {
                ErrorToaster('File Upload Failed');
                console.error(error);
                return null;
            }
        }
    }

    const handleAdditionalRestrictedFileSelection = async (index, categoriesIndex, privilegesIndex, value) => {
        let file = await addNewDocument(value);
        handleAdditionalRestrictedSelection(index, categoriesIndex, privilegesIndex, file, 'file')
    }

    const handleAdditionalRestrictedSelection = (index, categoriesIndex, privilegesIndex, value, key) => {
        console.log(index, categoriesIndex, privilegesIndex, value, key)
        setSelectedPrivilegeForDisplay((prevData) => {
            const temp = [...prevData];

            temp[index] = {
                ...temp[index],
                privilegeDetails: {
                    ...temp[index].privilegeDetails,
                    restrictedPrivileges: {
                        ...temp[index].privilegeDetails.restrictedPrivileges,
                        privilegesByCategories: [
                            ...temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories
                        ]
                    }
                }
            };

            temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex] = {
                ...temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex],
                privileges: [
                    ...temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex].privileges
                ]
            };
            if (key === 'file') {
                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].file = value;
                console.log(index, categoriesIndex, privilegesIndex, value, key)
            } else if (key === 'response') {
                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].response = value;
            } else if (key === 'notes') {
                if (temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].notes === undefined) {
                    temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                        .privileges[privilegesIndex].notes = {}
                }
                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].notes.notes = value;
            }

            return temp;
        });
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

    const getItems = (data) => {
        let temp = [];
        data?.map(privilegedata => {
            temp.push({ id: privilegedata?.id, value: privilegedata?.privilegeSetTitle })
        })
        return temp;
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
                        <div className={style.cardTitle}>{`Indicate the Privileges you are seeking as ${startsWithVowel(basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : '') ? 'an' : 'a'} ${basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : ''} for ${basicForm?.basicDetails?.departmentSpecialty?.department || ''} ${basicForm?.basicDetails?.departmentSpecialty?.specialty ? '/' : ''} ${basicForm?.basicDetails?.departmentSpecialty?.specialty || ''}`}</div>
                    </div>
                    {/* <CommonSelectField
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
                    /> */}
                    <DatalistInput
                        items={getItems(staffPrivilege?.filter(data => !primaryPrivilege.includes(data?.id))) || []}
                        onSelect={(item) => handleChange(item.id)}
                        className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                        onChange={(e) => { handleChange(e.target.value) }}
                        placeholder={'Start typing the title or select from the dropdown of privilege set'}
                        value={staffPrivilege?.filter(data => data?.id === selectedPrivilege)[0]?.privilegeSetTitle || ''}
                    />

                    {
                        staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map((data) => data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, index) => (
                            <div className={style.marginTop}>
                                <div className={`${style.categoryGrid} `}>
                                    {/* <div className={`${style.itemLeft} ${style.marginTop10}`}><CommonCheckBox
                                    // checked={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                                    // onChange={(e) => handleChange(fieldKey, e.target.checked, baseKey)} label={`${fieldData.label}${(isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))) && '*'}`}
                                    /></div> */}
                                    <div className={`${style.itemLeft} `}>{categories?.category === null ? '' : categories?.category}</div>
                                </div>
                                <>
                                    {
                                        categories?.privileges?.map(privileges => (
                                            <div className={style.twoColGrid}>
                                                <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
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
                    {staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.length !== 0 && staffPrivilege?.filter(data => data?.id === selectedPrivilege)[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length !== 0 && (
                        <div className={style.marginTop40}>
                            <div className={style.applicationCardStyle}>
                                <div className={style.marginTop}>
                                    {/* {selectedAdditionalPrivilegeForDisplay?.map((data) => data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length !== 0 && ( */}
                                    <div>
                                        <div className={style.cardDescription}>{'The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below.'}</div>

                                        {
                                            staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map((data, index) => data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories, categoriesIndex) => (
                                                <div key={`${index}${categoriesIndex}`}>
                                                    <div className={style.categoryGrid}>
                                                        {/* <div className={style.itemLeft}>{categories?.category === null ? 'GENERAL' : categories?.category}</div> */}
                                                        {/* <div className={style.itemLeft}> {openIndex !== `restricited${index}` ? <Icon icon="chevron-down" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex(`restricited${index}`)} /> : <Icon icon="chevron-up" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex()} />}
                            </div> */}
                                                    </div>
                                                    <>
                                                        {
                                                            categories?.privileges?.map((privileges, privilegesIndex) => (
                                                                <div className={`${style.restrictedPrivilegeGrid} ${privilegesIndex === 0 ? style.marginTop : ''}`} key={`${index}${privilegesIndex}`}>
                                                                    <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                                                    <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                                                    <div className={style.floatRight}>
                                                                        <CommonRadio
                                                                            value={privileges?.response || ''}
                                                                            onChange={(e) => handleAdditionalRestrictedSelection(index, categoriesIndex, privilegesIndex, e.target.value, 'response')}
                                                                            radioValue={['NO', 'YES']}
                                                                            label={['No', 'Yes']}
                                                                        />
                                                                    </div>
                                                                    {privileges?.response === 'YES' && (privileges?.isevidenceRequired || privileges?.isevidenceRequired === undefined) && (
                                                                        <>
                                                                            <div className={style.marginTop}>
                                                                                <CKEditor
                                                                                    editor={ClassicEditor}
                                                                                    data={privileges?.notes?.notes || null}
                                                                                    onChange={(event, editor) => {
                                                                                        const data = editor.getData();
                                                                                        handleAdditionalRestrictedSelection(index, categoriesIndex, privilegesIndex, data, 'notes');
                                                                                    }}
                                                                                    placeholder="Insert any privilege competency and qualification information"
                                                                                />
                                                                            </div>
                                                                            {/* <div className={style.marginTop10}>
                                                                                <div className={`${style.uploadButton}`}>
                                                                                    <div className={style.uploadGrid}>
                                                                                        <label for={`file-upload-dynamic-additional`} className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>
                                                                                            Upload any supporting documents for evidence of qualification and competence
                                                                                        </label>
                                                                                        <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />

                                                                                    </div>
                                                                                </div>
                                                                                <input id={`file-upload-dynamic-additional`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                                                                    onChange={(e) => { handleAdditionalRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }}
                                                                                />
                                                                            </div> */}
                                                                            <div className={style.marginTop10}>
                                                                                <div className={`${style.uploadButton}`}>
                                                                                    <div className={style.uploadGrid}>
                                                                                        {privileges?.file !== undefined ? (
                                                                                            <img src={VerifiedImage} alt="" className={`${style.imgIcon} ${style.cursorPointer}`} />
                                                                                        ) : (
                                                                                            <img src={ToBeVerifiedImage} alt="" className={style.imgIcon} />
                                                                                        )}
                                                                                        <div className={`${style.uploadText} ${style.verticalAlignCenter}`}>
                                                                                            Upload any supporting documents for evidence of qualification and competence
                                                                                        </div>
                                                                                        <div>
                                                                                            <label for={`file-upload-dynamic-additional-add${privilegesIndex}`} className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}>Click to upload</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <input id={`file-upload-dynamic-additional-add${privilegesIndex}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleAdditionalRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }} />
                                                                            </div>
                                                                            <br />
                                                                        </>
                                                                    )}
                                                                </div>

                                                            ))
                                                        }
                                                    </>
                                                </div>
                                            )

                                            )

                                            )
                                        }
                                        {/* <div className={style.eSignGrid}>
                                            <div
                                                onClick={() => { setIsRestrictedSigned(!isRestrictedSigned) }}
                                            >
                                                <ESignature
                                                    userName={isRestrictedSigned ? name : ""}
                                                    encData={isRestrictedSigned ? encryptedText : ''}
                                                    showData={isRestrictedSigned}
                                                    showDatais={true}
                                                />
                                            </div>
                                            <div className={style.verticalAlignCenter}>
                                                <div className={style.displayInRow}>
                                                    <div className={style.dateTitle}>Date: </div>
                                                    <div className={`${style.date} ${style.marginLeft}`}>{isRestrictedSigned ? currentDate : ""}</div>
                                                </div>
                                            </div>
                                        </div> */}

                                    </div>
                                    {/* ))} */}
                                </div>

                                {/* <div className={style.twoCol}>
                                    <div
                                        onClick={() => { setIsAdditionalSigned(!isAdditionalSigned) }}
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
                                </div> */}
                            </div>

                        </div>
                    )}

                    <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                        <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getSelectedPrivilegeList(selectedPrivilegeForDisplay); getIsOpen(false); }}>ADD</div>
                    </div>
                </div>

            </div>
        </Dialog >
    )
}

export default AdditionalPrivileges;