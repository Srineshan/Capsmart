import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import SaveInProgressDialog from './SaveInProgressDialog';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET, POST } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { format } from 'date-fns';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';


import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import ESignature from '../../../Components/ESignature';

const Step8 = ({ basicForm, setBasicForm, applicationId }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [selectedprivilegeList, setSelectedPrivilegeList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    let name = '';
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [isChecked, setIsChecked] = useState(false);
    const [collapsibleIndexes, setCollapsibleIndexes] = useState([]);
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    const [currentDate, setCurrentDate] = useState(format(new Date(), 'dd-MM-yyyy'));
    const [applicationData, setApplicationData] = useState();
    const [openIndex, setOpenIndex] = useState();
    const [selectedPrivilegeData, setSelectedprivilegeData] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        getStaffPrivilege();
        getApplication();
    }, [])

    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getSelectedPrivilegeList = (value) => {
        let temp = selectedprivilegeList;
        temp.push(value)
        setSelectedPrivilegeList(temp);
    }

    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[6]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[6]?.id}`
            );
            setFormSchema(form?.schema)
        }
    }

    const getStaffPrivilege = async () => {
        const { data: privilege } = await GET(
            `entity-service/staffPrivilege`
        );
        setStaffPrivilege(privilege);

    }

    const getApplication = async () => {
        const { data: form } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setApplicationData(form);
    }

    console.log('application data', applicationData)

    const handleContinue = async () => {
        let temp = selectedprivilegeList;
        temp.push(selectedPrivilege);
        let tempData = [];
        staffPrivilege?.filter(data => temp.includes(data?.id))?.map(data => {
            tempData.push({
                'id': data?.id,
                'privilegeSetTitle': data?.privilegeSetTitle,
                'privilegeDetails': data?.privilegeDetails
            })


        });
        console.log('data', tempData)
        await POST(`application-management-service//application/${applicationId}/privileges`, tempData)
            .then((response) => {
                SuccessToaster("Application Updated Successfully");
                // SuccessToaster('Error Logged Successfully');
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Updating Application");
            });
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        }
        else {
            navigate('/applicationForm/section1/step10')

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

    console.log('collapsibleIndexes', openIndex)

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 6'} title={'Details of request for privileges'} dataType={'Step 7'} timeNumber={20} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={style.padding}>
                            <div className={style.cardTitle}>{`Indicate the Privileges you are seeking as a(n) ${applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : ''} for the ${applicationData?.basicDetails?.departmentSpecialty?.department || ''} / ${applicationData?.basicDetails?.departmentSpecialty?.specialty || ''}`}</div>

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
                    </div>
                    <div className={`${style.applicationCardStyle} ${style.marginTop}`} >
                        <div className={style.padding}>
                            <div className={style.cardTitle}>{`CAMBRIDGE MEMORIAL HOSPITAL ${staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeSetTitle)[0]?.toUpperCase()}`}</div>

                            {
                                staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map((data) => data?.privilegeDetails?.corePrivilegeDetails?.corePrivilegesByCategories?.map((categories, index) => (
                                    <div>
                                        <div className={style.categoryGrid}>
                                            <div className={style.itemLeft}>{categories?.category === null ? 'GENERAL' : categories?.category}</div>
                                            <div className={style.itemLeft}> {openIndex !== `primary${index}` ? <Icon icon="chevron-down" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex(`primary${index}`)} /> : <Icon icon="chevron-up" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex()} />}
                                            </div></div>
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

                            {/* <div className={style.twoCol}>
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
                            </div> */}

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
                                staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeDetails?.restrictedPrivilegeDetails?.restrictedPrivilegesByCategory?.map((categories, index) => (
                                    <div>
                                        <div className={style.categoryGrid}>
                                            {/* <div className={style.itemLeft}>{categories?.category === null ? 'GENERAL' : categories?.category}</div> */}
                                            {/* <div className={style.itemLeft}> {openIndex !== `restricited${index}` ? <Icon icon="chevron-down" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex(`restricited${index}`)} /> : <Icon icon="chevron-up" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex()} />}
                                            </div> */}
                                        </div><>{
                                            categories?.privileges?.map(privileges => (
                                                <div className={style.twoColGrid}><div className={style.itemLeft}>{privileges?.privilegeId || ''}</div><div className={style.itemLeft}>{privileges?.title || ''}</div></div>

                                            ))
                                        }</>
                                    </div>
                                )

                                )

                                )
                            }
                            {/* <div className={style.twoCol}>
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
                            </div> */}

                        </div> </div>

                    <div className={`${style.marginTop} `}>
                        <div className={`${style.alignCenter}`} onClick={() => setIsOpen(true)}>
                            <div className={`${style.bigButtonStyle} `}>
                                <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>REQUEST ADDITIONAL PRIVILEGES</div>
                            </div>
                        </div>
                    </div>


                    <div className={`${style.applicationCardStyle} ${style.marginTop40}`} >
                        <div className={style.padding}>
                            <div className={style.cardDescription}>{'For specialties recognized by the Royal College of Physicians and Surgeons of Canada please attach a copy of a Royal College Certificate or a College Certificate of Registration permitting the practice of that sub-specialty.'}</div>

                            <div className={style.marginTop}>
                                <CKEditor
                                    editor={ClassicEditor}
                                // data={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                                // onChange={(event, editor) => {
                                //     const data = editor.getData();
                                //     handleChange(fieldKey, data, baseKey);
                                // }}
                                />
                            </div>
                            <div>
                                <div className={`${style.uploadButton}`}>
                                    <div className={style.uploadGrid}>
                                        <label for={`file-upload-dynamic-additional`} className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>
                                            Upload any supporting documents for evidence of qualification and competence
                                            <div className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>Click to upload</div>
                                        </label>
                                        <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />

                                        {/* <div className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>{(isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))) ? 'Required' : 'Recommended'}</div> */}
                                    </div>
                                </div>
                                <input id={`file-upload-dynamic-additional`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                // onChange={(e) => { handleChange(fieldKey, e.target.files[0], baseKey) }}
                                />
                            </div>
                        </div>

                    </div>


                </div>
                {isOpen && <SaveInProgressDialog getIsOpen={getIsOpen} primaryPrivilege={selectedPrivilege} getSelectedPrivilegeList={getSelectedPrivilegeList} />}
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