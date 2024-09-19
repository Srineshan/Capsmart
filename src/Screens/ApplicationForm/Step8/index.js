import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import SaveInProgressDialog from './SaveInProgressDialog';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { format } from 'date-fns';

import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import ESignature from '../../../Components/ESignature';

const Step8 = ({ basicForm, setBasicForm }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    let name = 'keerthana';
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [isChecked, setIsChecked] = useState(false);
    const [collapsibleIndexes, setCollapsibleIndexes] = useState([]);
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    const [currentDate, setCurrentDate] = useState(format(new Date(), 'dd-MM-yyyy'));

    // const [collapse]
    const navigate = useNavigate()

    useEffect(() => {
        getStaffPrivilege();
    }, [])

    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[6]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const getStaffPrivilege = async () => {
        const { data: privilege } = await GET(
            `entity-service/staffPrivilege`
        );
        setStaffPrivilege(privilege);

    }

    console.log('staffPrivilege', staffPrivilege)

    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        }
        else {
            navigate('/applicationForm/section1/step9')

        }
    }

    const getIsOpen = (value) => {
        setIsOpen(value);
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

    console.log('collapsibleIndexes', collapsibleIndexes)

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 6'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={20} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={style.padding}>
                            <div className={style.cardTitle}>{'Indicate the Privileges you are seeking as a(n) {Associate} for the {department anesthesiology / speciality}'}</div>
                        </div>
                        <CommonSelectField
                            // value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                            onChange={(e) => handleChange(e.target.value)}
                            className={style.fullWidth}
                            // firstOptionLabel={fieldData.label}
                            // firstOptionValue={fieldData.label}
                            valueList={staffPrivilege?.map(data => data?.id)}
                            labelList={staffPrivilege?.map(data => data?.privilegeSetTitle)}
                            disabledList={[].map(data => false)}
                            label={'Privilege Category'}
                            required={false}
                        // warning={warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                        />
                        {/* {formSchema !== undefined && 'privilegeCategories' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.privilegeCategories} gridStyle={style.privilegeGrid} baseKey={'privilegeCategories'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                        {formSchema !== undefined && 'additionalInformationAndSupportingDocuments' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.additionalInformationAndSupportingDocuments} gridStyle={style.privilegeGrid} baseKey={'additionalInformationAndSupportingDocuments'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )} */}
                    </div>
                    <div className={`${style.applicationCardStyle} ${style.marginTop}`} >
                        <div className={style.padding}>
                            <div className={style.cardTitle}>{'CAMBRIDGE MEMORIAL HOSPITAL GENERAL SURGERY PRIVILEGES'}</div>

                            {
                                staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map((data, index) => data?.privilegeDetails?.corePrivilegeDetails?.corePrivilegesByCategories?.map(categories => (
                                    <div>
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
                            <div className={style.twoCol}>
                                <div
                                    onClick={() => setIsSigned(!isSigned)}
                                    className={!isChecked ? style.disabled : ''}
                                >
                                    <ESignature
                                        userName={isSigned ? name : ""}
                                        encData={isSigned ? encryptedText : ''}
                                        showData={true}
                                        showDatais={true}
                                    />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.displayInRow}>
                                        <div className={style.dateTitle}>Date: </div>
                                        <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? currentDate : ""}</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* {formSchema !== undefined && 'privilegeCategories' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.privilegeCategories} gridStyle={style.privilegeGrid} baseKey={'privilegeCategories'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                        {formSchema !== undefined && 'additionalInformationAndSupportingDocuments' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.additionalInformationAndSupportingDocuments} gridStyle={style.privilegeGrid} baseKey={'additionalInformationAndSupportingDocuments'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )} */}
                    </div>

                    <div className={`${style.applicationCardStyle} ${style.marginTop}`} >
                        <div className={style.padding}>
                            <div className={style.cardDescription}>{'The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and X opposite and sign below.'}</div>

                            {
                                staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeDetails?.restrictedPrivilegeDetails?.restrictedPrivilegesByCategory?.map(categories => (
                                    <div>
                                        <div>{categories?.category === null ? '' : categories?.category}</div>
                                        <div> <Icon icon="chevron-down" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} />
                                        </div>{
                                            categories?.privileges?.map(privileges => (
                                                <div className={style.twoColGrid}><div className={style.itemLeft}>{privileges?.privilegeId || ''}</div><div className={style.itemLeft}>{privileges?.title || ''}</div></div>

                                            ))
                                        }
                                    </div>
                                )

                                )

                                )
                            }
                            <div className={style.twoCol}>
                                <div
                                    onClick={isChecked ? () => { setIsSigned(!isSigned); setIsChecked(true) } : () => { }}
                                    className={!isChecked ? style.disabled : ''}
                                >
                                    <ESignature
                                        userName={isSigned ? name : ""}
                                        encData={isSigned ? encryptedText : ''}
                                        showData={true}
                                        showDatais={true}
                                    />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.displayInRow}>
                                        <div className={style.dateTitle}>Date: </div>
                                        <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? currentDate : ""}</div>
                                    </div>
                                </div>
                            </div>

                        </div> </div>

                    <div className={`${style.marginTop} `}>
                        <div className={`${style.alignCenter}`} onClick={() => setIsOpen(true)}>
                            <div className={`${style.bigButtonStyle} `}>
                                <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>REQUEST ADDITIONAL PRIVILEGES</div>
                            </div>
                        </div>
                    </div>


                    <div className={`${style.applicationCardStyle} ${style.marginTop}`} >
                        <div className={style.padding}>
                            <div className={style.cardDescription}>{'For specialties recognized by the Royal College of Physicians and Surgeons of Canada please attach a copy of a Royal College Certificate or a College Certificate of Registration permitting the practice of that sub-specialty.'}</div>
                        </div>


                    </div>


                </div>
                {isOpen && <SaveInProgressDialog getIsOpen={getIsOpen} staffPrivilege={staffPrivilege} />}
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Step8;