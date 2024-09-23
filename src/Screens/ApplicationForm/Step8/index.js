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
import CommonRadio from '../../../Components/CommonFields/CommonRadio';

const Step8 = ({ basicForm, setBasicForm, applicationId }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [isRestrictedSigned, setIsRestrictedSigned] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] = useState('');
    const [selectedprivilegeList, setSelectedPrivilegeList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    let name = `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `;
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [collapsibleIndexes, setCollapsibleIndexes] = useState([]);
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    const [currentDate, setCurrentDate] = useState(format(new Date(), 'dd-MM-yyyy'));
    const [applicationData, setApplicationData] = useState();
    const [openIndex, setOpenIndex] = useState();
    const [selectedPrivilegeData, setSelectedprivilegeData] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        getApplication();
    }, [])

    useEffect(() => {
        getFields()
    }, [selectedPrivilegeForDisplay])

    useEffect(() => {
        getStaffPrivilege();
    }, [applicationData])

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
        if (applicationData) {
            const { data: privilege } = await GET(
                `entity-service/staffPrivilege?department=${applicationData?.basicDetailReferences?.department?.id}`
            );
            setStaffPrivilege(privilege);
        }
    }

    const getApplication = async () => {
        const { data: form } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setApplicationData(form);
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
        setSelectedPrivilegeForDisplay(staffPrivilege?.filter(data => data?.id === privilegeId))
    }

    const handleRestrictedSelection = (index, categoriesIndex, privilegesIndex, value, key) => {
        setSelectedPrivilegeForDisplay(async (prevData) => {
            const temp = [...prevData];

            temp[index] = {
                ...temp[index],
                privilegeDetails: {
                    ...temp[index].privilegeDetails,
                    restrictedPrivilegeDetails: {
                        ...temp[index].privilegeDetails.restrictedPrivilegeDetails,
                        restrictedPrivilegesByCategory: [
                            ...temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory
                        ]
                    }
                }
            };

            temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex] = {
                ...temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex],
                privileges: [
                    ...temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex].privileges
                ]
            };
            if (key === 'file') {
                let file;
                file = await addNewDocument(value);
                temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex]
                    .privileges[privilegesIndex].file = file;
            } else if (key === 'response') {
                temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex]
                    .privileges[privilegesIndex].response = value;
            } else if (key === 'notes') {
                if (temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex]
                    .privileges[privilegesIndex].notes === undefined) {
                    temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex]
                        .privileges[privilegesIndex].notes = {}
                }
                temp[index].privilegeDetails.restrictedPrivilegeDetails.restrictedPrivilegesByCategory[categoriesIndex]
                    .privileges[privilegesIndex].notes.notes = value;
            }

            return temp;
        });
        getFields();
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

    const getFields = () => {
        if (selectedPrivilege !== "") {
            console.log(selectedPrivilegeForDisplay, 'entered')
            return (
                <>
                    <div className={style.padding}>
                        <div className={style.cardTitle}>{`CAMBRIDGE MEMORIAL HOSPITAL ${staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeSetTitle)[0]?.toUpperCase()}`}</div>

                        {
                            selectedPrivilegeForDisplay?.map((data) => data?.privilegeDetails?.corePrivilegeDetails?.corePrivilegesByCategories?.map((categories, index) => (
                                <div>
                                    <div className={style.categoryGrid}>
                                        <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                                        {/* <div className={style.itemLeft}> 
                                        {openIndex !== `primary${index}` ? <Icon icon="chevron-down" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex(`primary${index}`)} /> : <Icon icon="chevron-up" className={`${style.margin} ${style.cursor} ${style.border} ${style.marginRight}`} onClick={() => setOpenIndex()} />}
                                    </div> */}
                                    </div>
                                    {/* {openIndex === `primary${index}` &&  */}
                                    <>{
                                        categories?.privileges?.map(privileges => (
                                            <div className={style.privilegeCodeGrid}>
                                                <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                                <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                            </div>

                                        ))
                                    }
                                    </>
                                    {/* } */}
                                </div>
                            )

                            )

                            )
                        }

                        <div className={style.twoCol}>
                            <div
                                onClick={() => setIsSigned(!isSigned)}
                            >
                                <ESignature
                                    userName={isSigned ? name : ""}
                                    encData={isSigned ? encryptedText : ''}
                                    showData={isSigned}
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

                    <div className={style.padding}>
                        <div className={style.cardDescription}>{'The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and X opposite and sign below.'}</div>

                        {
                            selectedPrivilegeForDisplay?.map((data, index) => data?.privilegeDetails?.restrictedPrivilegeDetails?.restrictedPrivilegesByCategory?.map((categories, categoriesIndex) => (
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
                                                    <div className={style.itemLeft}>{privileges?.privilegeId || ''}</div>
                                                    <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                                    <div className={style.floatRight}>
                                                        <CommonRadio
                                                            value={privileges?.response || ''}
                                                            onChange={(e) => handleRestrictedSelection(index, categoriesIndex, privilegesIndex, e.target.value, 'response')}
                                                            radioValue={['No', 'Yes']}
                                                            label={['No', 'Yes']}
                                                        />
                                                    </div>
                                                    {privileges?.response === 'Yes' && privileges?.isevidenceRequired && (
                                                        <>
                                                            <div className={style.marginTop}>
                                                                <CKEditor
                                                                    editor={ClassicEditor}
                                                                    data={privileges?.notes?.notes || null}
                                                                    onChange={(event, editor) => {
                                                                        const data = editor.getData();
                                                                        handleRestrictedSelection(index, categoriesIndex, privilegesIndex, data, 'notes');
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className={style.marginTop10}>
                                                                <div className={`${style.uploadButton}`}>
                                                                    <div className={style.uploadGrid}>
                                                                        <label for={`file-upload-dynamic-additional`} className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>
                                                                            Upload any supporting documents for evidence of qualification and competence
                                                                            {/* <div className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>Click to upload</div> */}
                                                                        </label>
                                                                        <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />

                                                                    </div>
                                                                </div>
                                                                <input id={`file-upload-dynamic-additional`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                                                    onChange={(e) => { handleRestrictedSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }}
                                                                />
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
                        <div className={style.twoCol}>
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
                        </div>

                    </div>
                </>
            )
        }
    }

    console.log('collapsibleIndexes', openIndex, selectedPrivilegeForDisplay)

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
                            <div className={style.marginTop}>
                                <CommonSelectField
                                    value={selectedPrivilege}
                                    onChange={(e) => handleChange(e.target.value)}
                                    className={style.fullWidth}
                                    firstOptionLabel={'Select the privilege set you would like to request'}
                                    firstOptionValue={''}
                                    valueList={staffPrivilege?.map(data => data?.id)}
                                    labelList={staffPrivilege?.map(data => data?.privilegeSetTitle)}
                                    disabledList={[].map(data => false)}
                                    label={''}
                                    required={false}
                                // warning={warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                                />
                            </div>
                            {/* {formSchema !== undefined && 'privilegeCategories' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.privilegeCategories} gridStyle={style.privilegeGrid} baseKey={'privilegeCategories'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                        {formSchema !== undefined && 'additionalInformationAndSupportingDocuments' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.additionalInformationAndSupportingDocuments} gridStyle={style.privilegeGrid} baseKey={'additionalInformationAndSupportingDocuments'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )} */}
                        </div>
                        {getFields()}
                    </div>
                    {selectedPrivilege !== "" && (
                        <>
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
                        </>
                    )}


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