import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import AdditionalPrivilegesDialog from './AdditionalPrivilegesDialog';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { DELETE, GET, POST } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { format } from 'date-fns';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import PdfDoc from './../../../images/pdfDoc.png';
import WordDoc from './../../../images/wordDoc.png';
import ImgDoc from './../../../images/imgDoc.png';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import DeleteIcon from './../../../images/deleteHcRow.png';

import VerifiedImage from "./../../../images/verifiedImage.png";
import ToBeVerifiedImage from "./../../../images/toBeVerifiedImage.png";
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import ESignature from '../../../Components/ESignature';
import CommonRadio from '../../../Components/CommonFields/CommonRadio';
import AlertDialog from '../../../Components/AlertDialog';

const Step8 = ({ basicForm, setBasicForm, applicationId }) => {
    const [isSigned, setIsSigned] = useState(false);
    const [isRestrictedSigned, setIsRestrictedSigned] = useState(false);
    const [isAdditionalSigned, setIsAdditionalSigned] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] = useState([]);
    const [selectedAdditionalPrivilegeForDisplay, setSelectedAdditionalPrivilegeForDisplay] = useState([]);
    const [selectedAdditionalPrivilegeForEdit, setSelectedAdditionalPrivilegeForEdit] = useState()
    const [selectedprivilegeList, setSelectedPrivilegeList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
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
        if (basicForm?.privileges?.obligatedPrivileges?.[0]?.id) {
            setSelectedPrivilege(basicForm?.privileges?.obligatedPrivileges?.[0]?.id)
        }
        setSelectedAdditionalPrivilegeForDisplay(basicForm?.privileges?.additionalPrivileges)
        setSelectedPrivilegeForDisplay(basicForm?.privileges?.obligatedPrivileges)
    }, [basicForm])

    const getSelectedPrivilegeList = (value) => {
        let temp = selectedAdditionalPrivilegeForDisplay;
        if (selectedAdditionalPrivilegeForEdit?.id !== undefined) {
            let index = selectedAdditionalPrivilegeForDisplay?.findIndex(data => data?.id === selectedAdditionalPrivilegeForEdit?.id)
            temp[index] = value[0];
            setSelectedAdditionalPrivilegeForDisplay(temp);
        } else {
            temp.push(value[0])
            setSelectedAdditionalPrivilegeForDisplay(temp);
        }
        setSelectedAdditionalPrivilegeForEdit({})
    }

    console.log(selectedAdditionalPrivilegeForDisplay)

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
            // const { data: privilege } = await GET(
            //     `entity-service/staffPrivilege`
            // );
            setStaffPrivilege(privilege);
        }
    }

    const getApplication = async () => {
        const { data: form } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setApplicationData(form);
    }

    const startsWithVowel = (str) => /^[aeiouAEIOU]/.test(str);

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

    const handleContinue = async (navigation) => {
        // let temp = selectedprivilegeList;
        // temp.push(selectedPrivilege);
        // let tempData = [];
        // staffPrivilege?.filter(data => temp.includes(data?.id))?.map(data => {
        //     tempData.push({
        //         'id': data?.id,
        //         'privilegeSetTitle': data?.privilegeSetTitle,
        //         'privilegeDetails': data?.privilegeDetails
        //     })


        // });
        let temp = {
            obligatedPrivileges: selectedPrivilegeForDisplay,
            additionalPrivileges: selectedAdditionalPrivilegeForDisplay
        }
        console.log('data', temp)
        await POST(`application-management-service/application/${applicationId}/privileges`, temp)
            .then((response) => {
                SuccessToaster("Application Updated Successfully");
                // SuccessToaster('Error Logged Successfully');
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Updating Application");
            });
        if (navigation) {
            if (sessionStorage.getItem('fromSummary') === "true") {
                navigate(-1);
            }
            else {
                navigate('/applicationForm/section1/step10')

            }
        }
    }

    const handleDeleteFile = async (files) => {

        await DELETE(`application-management-service/application/${applicationId}/files`, files)
            .then((response) => {
                SuccessToaster("File Deleted Successfully");
                handleContinue(false)
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Deleting File");
            });
    }

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    const getIsAlertOpen = (value, string) => {
        if (string === 'OKAY') {
            setIsAlertOpen(value);
            setIsOpen(true);
        } else {
            setIsAlertOpen(value);
        }
    }


    const handleChange = (privilegeId) => {
        setSelectedPrivilege(privilegeId);
        setSelectedPrivilegeForDisplay(staffPrivilege?.filter(data => data?.id === privilegeId))
    }

    const handleRestrictedFileSelection = async (index, categoriesIndex, privilegesIndex, value) => {
        let file = await addNewDocument(value);
        handleRestrictedSelection(index, categoriesIndex, privilegesIndex, file, 'file')
    }

    const handleAdditionalRestrictedFileSelection = async (index, categoriesIndex, privilegesIndex, value) => {
        let file = await addNewDocument(value);
        handleAdditionalRestrictedSelection(index, categoriesIndex, privilegesIndex, file, 'file')
    }

    const handleRestrictedSelection = (index, categoriesIndex, privilegesIndex, value, key) => {
        console.log(index, categoriesIndex, privilegesIndex, value, key, 'onChange')
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
            } else if (key === 'removeFile') {
                handleDeleteFile([temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].file])
                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].file = value;
                console.log(index, categoriesIndex, privilegesIndex, value, key)
            } else if (key === 'response') {
                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].response = value;
            } else if (key === 'notes') {
                if (temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].notes === undefined || temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                        .privileges[privilegesIndex].notes === null) {
                    temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                        .privileges[privilegesIndex].notes = {}
                }
                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].notes.notes = value;
            }

            return temp;
        });
        getFields();
    }

    const handleSign = (type, basicOrAdditional, index) => {
        if (basicOrAdditional === 'Basic') {
            setSelectedPrivilegeForDisplay((prevData) => {
                const temp = [...prevData];
                if (type === 'Core' && (temp[0].privilegeDetails.corePrivileges.esign === null || temp[0].privilegeDetails.corePrivileges.esign === undefined)) {
                    temp[0].privilegeDetails.corePrivileges.esign = {
                        esign: CryptoJS.AES.encrypt(name + new Date().toISOString(), publicKey).toString(),
                        name: name,
                        signedDate: currentDate
                    };
                } else if (type === 'Restricted' && (temp[0].privilegeDetails.restrictedPrivileges.esign === null || temp[0].privilegeDetails.restrictedPrivileges.esign === undefined)) {
                    temp[0].privilegeDetails.restrictedPrivileges.esign = {
                        esign: CryptoJS.AES.encrypt(name + new Date().toISOString(), publicKey).toString(),
                        name: name,
                        signedDate: currentDate
                    };
                }

                return temp;
            });
        } else {
            setSelectedAdditionalPrivilegeForDisplay((prevData) => {
                const temp = [...prevData];
                if (type === 'Core' && (temp[index].privilegeDetails.corePrivileges.esign === null || temp[index].privilegeDetails.corePrivileges.esign === undefined)) {
                    temp[index].privilegeDetails.corePrivileges.esign = {
                        esign: CryptoJS.AES.encrypt(name + new Date().toISOString(), publicKey).toString(),
                        name: name,
                        signedDate: currentDate
                    };
                } else if (type === 'Restricted' && (temp[index].privilegeDetails.restrictedPrivileges.esign === null || temp[index].privilegeDetails.restrictedPrivileges.esign === undefined)) {
                    temp[index].privilegeDetails.restrictedPrivileges.esign = {
                        esign: CryptoJS.AES.encrypt(name + new Date().toISOString(), publicKey).toString(),
                        name: name,
                        signedDate: currentDate
                    };
                }

                return temp;
            });
        }
    }

    const handleAdditionalRestrictedSelection = (index, categoriesIndex, privilegesIndex, value, key) => {
        console.log(index, categoriesIndex, privilegesIndex, value, key)
        setSelectedAdditionalPrivilegeForDisplay((prevData) => {
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
            } else if (key === 'removeFile') {
                handleDeleteFile([temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[categoriesIndex]
                    .privileges[privilegesIndex].file])
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
            console.log(selectedPrivilegeForDisplay, selectedAdditionalPrivilegeForDisplay, 'entered', selectedPrivilege, staffPrivilege?.filter(data => data?.id === selectedPrivilege), staffPrivilege)
            return (
                <>
                    <div className={style.padding}>
                        <div className={style.cardTitle}>{`CAMBRIDGE MEMORIAL HOSPITAL ${staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeSetTitle)[0] !== undefined ? staffPrivilege?.filter(data => data?.id === selectedPrivilege)?.map(data => data?.privilegeSetTitle)[0]?.toUpperCase() : ''}`}</div>

                        {
                            selectedPrivilegeForDisplay?.map((data) => data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, index) => (
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
                        {selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== 0 && (
                            <div className={style.twoCol}>
                                <div
                                    onClick={() => handleSign('Core', 'Basic')}
                                >
                                    <ESignature
                                        userName={selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign !== null ? selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.name : ""}
                                        encData={selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign !== null ? selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.esign : ""}
                                        showData={(selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign !== null && selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) ? true : false}
                                        showDatais={true}
                                    />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.displayInRow}>
                                        <div className={style.dateTitle}>Date: </div>
                                        <div className={`${style.date} ${style.marginLeft}`}>{selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign !== null ? selectedPrivilegeForDisplay[0]?.privilegeDetails?.corePrivileges?.esign?.signedDate : ""}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* {formSchema !== undefined && 'privilegeCategories' in formSchema?.properties && (
            <ApplicationFieldCard object={formSchema?.properties?.privilegeCategories} gridStyle={style.privilegeGrid} baseKey={'privilegeCategories'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
        )}
        {formSchema !== undefined && 'additionalInformationAndSupportingDocuments' in formSchema?.properties && (
            <ApplicationFieldCard object={formSchema?.properties?.additionalInformationAndSupportingDocuments} gridStyle={style.privilegeGrid} baseKey={'additionalInformationAndSupportingDocuments'} basicForm={basicForm} setBasicForm={setBasicForm} />
        )} */}
                    {selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== 0 && (
                        <div className={style.padding}>
                            <div className={style.cardDescription}>{'The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below.'}</div>

                            {
                                selectedPrivilegeForDisplay?.map((data, index) => data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories, categoriesIndex) => (
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
                                                                onChange={(e) => handleRestrictedSelection(index, categoriesIndex, privilegesIndex, e.target.value, 'response')}
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
                                                                            handleRestrictedSelection(index, categoriesIndex, privilegesIndex, data, 'notes');
                                                                        }}
                                                                        onReady={(editor) => {
                                                                            editor.editing.view.change((writer) => {
                                                                                writer.setStyle(
                                                                                    "height",
                                                                                    "150px",
                                                                                    editor.editing.view.document.getRoot()
                                                                                );
                                                                            });
                                                                        }}
                                                                        config={{
                                                                            placeholder: 'Insert any privilege competency and qualification information...',
                                                                        }}
                                                                    />
                                                                </div>
                                                                {/* <div className={style.marginTop10}>
                                                                    <div className={`${style.uploadButton}`}>
                                                                        <div className={style.uploadGrid}>
                                                                            <label for={`file-upload-dynamic-basic${privilegesIndex}`} className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>
                                                                                Upload any supporting documents for evidence of qualification and competence
                                                                            </label>
                                                                            <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />

                                                                        </div>
                                                                    </div>
                                                                    <input id={`file-upload-dynamic-basic${privilegesIndex}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                                                        onChange={(e) => { handleRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }}
                                                                    />
                                                                </div> */}
                                                                <div className={style.marginTop10}>
                                                                    <div className={`${style.uploadButton}`}>
                                                                        <div className={style.uploadGrid}>
                                                                            {privileges?.file !== undefined ? (
                                                                                <img src={VerifiedImage} alt="" className={`${style.imgIcon} `} />
                                                                            ) : (
                                                                                <img src={ToBeVerifiedImage} alt="" className={style.imgIcon} />
                                                                            )}
                                                                            <div className={`${style.uploadText} ${style.verticalAlignCenter}`}>
                                                                                Upload any supporting documents for evidence of qualification and competence
                                                                            </div>
                                                                            <div>
                                                                                <label for={`file-upload-dynamic-basic${privilegesIndex}`} className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}>Click to upload</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input id={`file-upload-dynamic-basic${privilegesIndex}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }} />
                                                                </div>
                                                                {privileges?.file !== null && privileges?.file?.fileName !== undefined && (
                                                                    <div className={`${style.fileDisplay} ${style.fileDisplayText} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                                                        <div className={style.displayInRow}>
                                                                            <div onClick={() => { window.open(privileges?.file?.fileURL, '_blank'); }}>
                                                                                {privileges?.file?.fileType === 'application/pdf' ?
                                                                                    <img src={PdfDoc} alt="" className={style.docTypeImgStyle} />
                                                                                    : privileges?.file?.fileType?.startsWith("image/") ?
                                                                                        <img src={ImgDoc} alt="" className={style.docTypeImgStyle} /> : <TextSnippetOutlinedIcon style={{ fontSize: 20, color: `${data?.subStatus}` }} />}
                                                                            </div>
                                                                            <div className={style.marginLeft}>{privileges?.file?.fileName}</div>
                                                                        </div>
                                                                        <div>
                                                                            <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { handleRestrictedSelection(index, categoriesIndex, privilegesIndex, null, 'removeFile') }} />
                                                                        </div>
                                                                    </div>
                                                                )}
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
                                    onClick={() => { handleSign('Restricted', 'Basic') }}
                                >
                                    <ESignature
                                        userName={selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null ? selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign?.name : ""}
                                        encData={selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null ? selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign?.esign : ""}
                                        showData={(selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null && selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) ? true : false}
                                        showDatais={true}
                                    />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.displayInRow}>
                                        <div className={style.dateTitle}>Date: </div>
                                        <div className={`${style.date} ${style.marginLeft}`}>{selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null ? selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.esign?.signedDate : ""}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )
        }
    }

    const getItems = (data) => {
        let temp = [];
        data?.map(privilegedata => {
            temp.push({ id: privilegedata?.id, value: privilegedata?.privilegeSetTitle })
        })
        return temp;
    }

    console.log('collapsibleIndexes', openIndex, selectedPrivilegeForDisplay, selectedPrivilege)

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
                            <div className={style.cardTitle}>{`Indicate the Privileges you are seeking as ${startsWithVowel(applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : '') ? 'an' : 'a'} ${applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : ''} for ${applicationData?.basicDetails?.departmentSpecialty?.department || ''} ${applicationData?.basicDetails?.departmentSpecialty?.specialty ? '/' : ''} ${applicationData?.basicDetails?.departmentSpecialty?.specialty || ''}`}</div>
                            <div className={style.marginTop}>
                                {/* <CommonSelectField
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
                                /> */}
                                <DatalistInput
                                    items={getItems(staffPrivilege) || []}
                                    onSelect={(item) => handleChange(item.id)}
                                    className={`${style.fullWidth} ${style.marginTop10} ${style.leftAlign}`}
                                    onChange={(e) => { handleChange(e.target.value) }}
                                    placeholder={'Start typing the title or select from the dropdown of privilege set'}
                                    value={staffPrivilege?.filter(data => data?.id === selectedPrivilege)[0]?.privilegeSetTitle || ''}
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
                    {selectedAdditionalPrivilegeForDisplay?.length !== 0 && (
                        <div className={style.marginTop40}>
                            <div className={style.applicationCardStyle}>
                                <div className={style.padding}>
                                    <div className={style.cardTitle}>{`Additional Privileges you are requesting as ${startsWithVowel(applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : '') ? 'an' : 'a'} ${applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory ? applicationData?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : ''} for ${applicationData?.basicDetails?.departmentSpecialty?.department || ''} ${applicationData?.basicDetails?.departmentSpecialty?.specialty ? '/' : ''} ${applicationData?.basicDetails?.departmentSpecialty?.specialty || ''}`}</div>
                                    <div className={style.marginTop}>
                                        {selectedAdditionalPrivilegeForDisplay?.map((data, index) =>
                                            <>
                                                {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map((categories, categoryIndex) => (
                                                    <div>
                                                        {categoryIndex === 0 && (
                                                            <div className={`${style.spaceBetween} ${style.marginTop}`}>
                                                                <div className={style.cardTitle}>{data?.privilegeSetTitle}</div>
                                                                <div className={`${style.changePrivilegeText} ${style.cursorPointer}`} onClick={() => { setSelectedAdditionalPrivilegeForEdit(data); setIsAlertOpen(true) }}>Change Privilege Set</div>
                                                            </div>
                                                        )}
                                                        <div className={style.categoryGrid}>
                                                            <div className={style.itemLeft}><strong>{categories?.category === null ? '' : categories?.category}</strong></div>
                                                        </div>
                                                        {
                                                            categories?.privileges?.map(privileges => (
                                                                <div className={style.privilegeCodeGrid}>
                                                                    <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                                                    <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                                                </div>

                                                            ))
                                                        }
                                                    </div>
                                                ))}
                                                {data?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== 0 && (
                                                    <div className={style.twoCol}>
                                                        <div
                                                            onClick={() => { handleSign('Core', 'Additional', index) }}
                                                        >
                                                            <ESignature
                                                                userName={data?.privilegeDetails?.corePrivileges?.esign !== null ? data?.privilegeDetails?.corePrivileges?.esign?.name : ''}
                                                                encData={data?.privilegeDetails?.corePrivileges?.esign !== null ? data?.privilegeDetails?.corePrivileges?.esign?.esign : ''}
                                                                showData={(data?.privilegeDetails?.corePrivileges?.esign !== null && data?.privilegeDetails?.corePrivileges?.esign !== undefined) ? true : false}
                                                                showDatais={true}
                                                            />
                                                        </div>
                                                        <div className={style.verticalAlignCenter}>
                                                            <div className={style.displayInRow}>
                                                                <div className={style.dateTitle}>Date: </div>
                                                                <div className={`${style.date} ${style.marginLeft}`}>{data?.privilegeDetails?.corePrivileges?.esign !== null ? data?.privilegeDetails?.corePrivileges?.esign?.signedDate : ""}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== 0 && (
                                                    <>
                                                        <div className={`${style.cardDescription} ${style.marginTop}`}>{'The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below.'}</div>
                                                        {data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories, categoriesIndex) => (
                                                            <div key={`${index}${categoriesIndex}`}>
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
                                                                                                onReady={(editor) => {
                                                                                                    editor.editing.view.change((writer) => {
                                                                                                        writer.setStyle(
                                                                                                            "height",
                                                                                                            "150px",
                                                                                                            editor.editing.view.document.getRoot()
                                                                                                        );
                                                                                                    });
                                                                                                }}
                                                                                                config={{
                                                                                                    placeholder: 'Insert any privilege competency and qualification information...',
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                        {/* <div className={style.marginTop10}>
                                                                                            <div className={`${style.uploadButton}`}>
                                                                                                <div className={style.uploadGrid}>
                                                                                                    <label for={`file-upload-dynamic-additional${privilegesIndex}`} className={`${style.uploadText} ${style.cursorPointer} ${style.verticalAlignCenter}`}>
                                                                                                        Upload any supporting documents for evidence of qualification and competence
                                                                                                    </label>
                                                                                                    <DescriptionOutlinedIcon sx={{ color: '#787f87' }} />

                                                                                                </div>
                                                                                            </div>
                                                                                            <input id={`file-upload-dynamic-additional${privilegesIndex}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                                                                                onChange={(e) => { handleAdditionalRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }}
                                                                                            />
                                                                                        </div> */}
                                                                                        <div className={style.marginTop10}>
                                                                                            <div className={`${style.uploadButton}`}>
                                                                                                <div className={style.uploadGrid}>
                                                                                                    {privileges?.file !== undefined ? (
                                                                                                        <img src={VerifiedImage} alt="" className={`${style.imgIcon}`} />
                                                                                                    ) : (
                                                                                                        <img src={ToBeVerifiedImage} alt="" className={style.imgIcon} />
                                                                                                    )}
                                                                                                    <div className={`${style.uploadText} ${style.verticalAlignCenter}`}>
                                                                                                        Upload any supporting documents for evidence of qualification and competence
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <label for={`file-upload-dynamic-additional${privilegesIndex}`} className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}>Click to upload</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <input id={`file-upload-dynamic-additional${privilegesIndex}`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { handleAdditionalRestrictedFileSelection(index, categoriesIndex, privilegesIndex, e.target.files[0], 'file') }} />
                                                                                        </div>
                                                                                        {privileges?.file !== null && privileges?.file?.fileName !== undefined && (
                                                                                            <div className={`${style.fileDisplay} ${style.fileDisplayText} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                                                                                <div className={`${style.displayInRow} ${style.marginTop10}`}>
                                                                                                    <div onClick={() => { window.open(privileges?.file?.fileURL, '_blank'); }}>
                                                                                                        {privileges?.file?.fileType === 'application/pdf' ?
                                                                                                            <img src={PdfDoc} alt="" className={style.docTypeImgStyle} />
                                                                                                            : privileges?.file?.fileType?.startsWith("image/") ?
                                                                                                                <img src={ImgDoc} alt="" className={style.docTypeImgStyle} /> : <img src={PdfDoc} alt="" className={style.docTypeImgStyle} />}
                                                                                                    </div>
                                                                                                    <div className={style.marginLeft}>{privileges?.file?.fileName}</div>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <img src={DeleteIcon} alt="" className={style.docTypeImgStyle} onClick={() => { handleAdditionalRestrictedSelection(index, categoriesIndex, privilegesIndex, null, 'removeFile') }} />
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                        <br />
                                                                                    </>
                                                                                )}
                                                                            </div>

                                                                        ))
                                                                    }
                                                                </>
                                                            </div>
                                                        )

                                                        )}
                                                        <div className={style.twoCol}>
                                                            <div
                                                                onClick={() => { handleSign('Restricted', 'Additional', index) }}
                                                            >
                                                                <ESignature
                                                                    userName={data?.privilegeDetails?.restrictedPrivileges?.esign !== null ? data?.privilegeDetails?.restrictedPrivileges?.esign?.name : ""}
                                                                    encData={data?.privilegeDetails?.restrictedPrivileges?.esign !== null ? data?.privilegeDetails?.restrictedPrivileges?.esign?.esign : ''}
                                                                    showData={(data?.privilegeDetails?.restrictedPrivileges?.esign !== null && data?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) ? true : false}
                                                                    showDatais={true}
                                                                />
                                                            </div>
                                                            <div className={style.verticalAlignCenter}>
                                                                <div className={style.displayInRow}>
                                                                    <div className={style.dateTitle}>Date: </div>
                                                                    <div className={`${style.date} ${style.marginLeft}`}>{data?.privilegeDetails?.restrictedPrivileges?.esign !== null ? data?.privilegeDetails?.restrictedPrivileges?.esign?.signedDate : ""}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )
                                        }
                                    </div>
                                    {/* <div className={style.marginTop}>
                                        <div>
                                            <div className={style.cardDescription}>{'The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking  and sign below.'}</div>

                                            {
                                                selectedAdditionalPrivilegeForDisplay?.map((data, index) => data?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map((categories, categoriesIndex) => (
                                                    <div key={`${index}${categoriesIndex}`}>
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
                                                                        {privileges?.response === 'Yes' && privileges?.isevidenceRequired && (
                                                                            <>
                                                                                <div className={style.marginTop}>
                                                                                    <CKEditor
                                                                                        editor={ClassicEditor}
                                                                                        data={privileges?.notes?.notes || null}
                                                                                        onChange={(event, editor) => {
                                                                                            const data = editor.getData();
                                                                                            handleAdditionalRestrictedSelection(index, categoriesIndex, privilegesIndex, data, 'notes');
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className={style.marginTop10}>
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
                                    </div> */}
                                </div>
                            </div>

                        </div>
                    )}
                    {selectedPrivilege !== "" && (
                        <>
                            <div className={`${style.marginTop} `}>
                                <div className={`${style.alignCenter}`} onClick={() => setIsOpen(true)}>
                                    <div className={`${style.bigButtonStyle} ${style.cursorPointer}`}>
                                        <div className={`${style.bigButtonTextStyle} ${style.alignCenter}`}>REQUEST ADDITIONAL PRIVILEGES</div>
                                    </div>
                                </div>
                            </div>


                            <div className={`${style.applicationCardStyle} ${style.marginTop40}`} >
                                <div className={style.padding}>
                                    <div className={style.cardDescription}>{'For specialties recognized by the Royal College of Physicians and Surgeons of Canada please attach a copy of a Royal College Certificate or a College Certificate of Registration permitting the practice of that sub-specialty.'}</div>
                                    <div className={style.marginTop10}>
                                        <div className={`${style.uploadButton}`}>
                                            <div className={style.uploadGrid}>
                                                {/* {privileges?.file !== undefined ? (
                                                    <img src={VerifiedImage} alt="" className={`${style.imgIcon} ${style.cursorPointer}`} onClick={window.open(privileges?.file?.fileURL, '_blank')} />
                                                ) : ( */}
                                                <img src={ToBeVerifiedImage} alt="" className={style.imgIcon} />
                                                {/* )} */}
                                                <div className={`${style.uploadText} ${style.verticalAlignCenter}`}>
                                                    Upload any supporting documents for evidence of qualification and competence
                                                </div>
                                                <div>
                                                    <label for={`file-upload-dynamic-additional`} className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}>Click to upload</label>
                                                </div>
                                            </div>
                                        </div>
                                        <input id={`file-upload-dynamic-additional`} type="file" accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx" onChange={(e) => { }} />
                                    </div>
                                </div>

                            </div>
                        </>
                    )}


                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue(true)}>CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
            {isAlertOpen && <AlertDialog isOpen={isAlertOpen} getIsOpen={getIsAlertOpen} title={'Are you sure?'} description={'Do you want to really change the privilege set?'} />}
            {isOpen && <AdditionalPrivilegesDialog getIsOpen={getIsOpen} primaryPrivilege={selectedPrivilege} getSelectedPrivilegeList={getSelectedPrivilegeList} basicForm={basicForm} selectedAdditionalPrivilegeForEdit={selectedAdditionalPrivilegeForEdit} applicationId={applicationId} />}
        </div >
    )
}

export default Step8;