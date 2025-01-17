import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import AdditionalPrivilegesDialog from './AdditionalPrivilegesDialog';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { Dialog, Classes } from '@blueprintjs/core';
import { DELETE, GET, POST, PUT } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@blueprintjs/core';
import { format } from 'date-fns';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import PdfDoc from './../../../images/pdfDoc.png';
import WordDoc from './../../../images/wordDoc.png';
import CrossPink from "./../../../images/crossPink.png";
import BlueSign from "./../../../images/blueSign.png";
import ImgDoc from './../../../images/imgDoc.png';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import DatalistInput, { useComboboxControls } from "react-datalist-input";
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import JourneyStep2 from './../../../images/journeyStep2.png';
import DeleteIcon from './../../../images/deleteHcRow.png';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckBoxOutlineBlankSharpIcon from '@mui/icons-material/CheckBoxOutlineBlankSharp';
import VerifiedImage from "./../../../images/verifiedImage.png";
import ToBeVerifiedImage from "./../../../images/toBeVerifiedImage.png";
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';
import ESignature from '../../../Components/ESignature';
import CommonRadio from '../../../Components/CommonFields/CommonRadio';
import AlertDialog from '../../../Components/AlertDialog';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';

const AdditionalPrivilegeSelection = ({ basicForm, setBasicForm, getPreApplication }) => {
    const [isSigned, setIsSigned] = useState(false);
    const { applicationId, section, step } = useParams();
    const [isRestrictedSigned, setIsRestrictedSigned] = useState(false);
    const [isAdditionalSigned, setIsAdditionalSigned] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [staffPrivilege, setStaffPrivilege] = useState([]);
    const [selectedPrivilege, setSelectedPrivilege] = useState('');
    const [obligatedPrivilege, setObligatedPrivilege] = useState([]);
    const [showCurrentPrivileges, setShowCurrentPrivileges] = useState(false);
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
    const [isAdditionalPrivilegeCategoryChanging, setIsAdditionalPrivilegeCategoryChanging] = useState(false)
    const [privilegeCategories, setPrivilegeCategories] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] = useState('');
    const [isUpdateClicked, setIsUpdateClicked] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const navigate = useNavigate()
    const [formIndex, setFormIndex] = useState();
    const [navigateURL, setNavigateURL] = useState();
    const [showPrivileges, setShowPrivileges] = useState(false);
    const [isEdit, setIsEdit] = useState(true);
    const [selectedPrivilegesForDisplayMultiple, setSelectedPrivilegesForDisplayMultiple] = useState([]);
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    useEffect(() => {
        getApplication();
        getPrivilegeCategory();
        getDepartmentList();
    }, [])

    useEffect(() => {
        getFields()
    }, [selectedPrivilegeForDisplay])

    useEffect(() => {
        getStaffPrivilege();
    }, [applicationData, selectedDepartment])

    useEffect(() => {
        setSelectedDepartment(applicationData?.basicDetailReferences?.department?.id);
    }, [applicationData])

    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm?.privileges?.obligatedPrivileges?.[0]?.id) {
            setSelectedPrivilege(basicForm?.privileges?.obligatedPrivileges?.[0]?.id)
        }
        setSelectedAdditionalPrivilegeForDisplay(basicForm?.privileges?.additionalPrivileges)
        setSelectedPrivilegesForDisplayMultiple(basicForm?.privileges?.additionalPrivileges)
        setSelectedPrivilegeForDisplay(basicForm?.privileges?.obligatedPrivileges)
        setObligatedPrivilege(basicForm?.privileges?.obligatedPrivileges)
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form')?.length === (formIndex + 1)) ? `/reappointmentApplicationForm/${applicationId}/Form/PODCheck` : `/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${basicForm?.forms[formIndex + 1]?.schemaCategory}`)
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])

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
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const getStaffPrivilege = async () => {
        if (applicationData) {
            const { data: privilege } = await GET(
                `entity-service/staffPrivilege?department=${selectedDepartment !== '' ? selectedDepartment : applicationData?.basicDetailReferences?.department?.id}`
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

    const getPrivilegeCategory = async () => {
        const { data: privilege } = await GET(
            `entity-service/privilege`
        );
        setPrivilegeCategories(privilege);
    }

    const getDepartmentList = async () => {
        const { data: department } = await GET(
            `entity-service/department`
        );
        setDepartmentList(department);
    }

    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
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
                const response = await POST(`application-management-service/application/${applicationId}/files?isLLMRequired=${formSchemaWholeObject?.requiredDocuments?.length !== 0 ? true : false}&schemaId=${formSchemaWholeObject?.id}`, formData);
                SuccessToaster('File Uploaded Successfully');
                try {
                    if (response?.data?.classification !== null && formSchemaWholeObject?.requiredDocuments?.length !== 0) {
                        await PUT(`application-management-service/application/${applicationId}/form/updateData`, { documentType: response?.data?.classification !== null ? response?.data?.classification : '', fileSize: `${(file?.size / (1024 * 1024)).toFixed(2)} Mb`, fileURL: response?.data?.fileURL, fileType: response?.data?.fileType, fileUploaded: file?.name, requirement: response?.data?.classification !== null ? basicForm?.documentsRequired?.filter(data => data?.document?.name === response?.data?.classification)?.[0]?.required ? 'Required' : 'Recommended' : '', valid: response?.data?.valid, verified: response?.data?.verified });
                    }
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
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

    const handleSubmit = async () => {
        let temp = {
            obligatedPrivileges: obligatedPrivilege,
            additionalPrivileges: selectedPrivilegesForDisplayMultiple,
            priorAdditionalPrivileges: basicForm?.privileges?.priorAdditionalPrivileges?.length === 0 ? basicForm?.privileges?.additionalPrivileges : basicForm?.privileges?.priorAdditionalPrivileges,
            priorObligatedPrivileges: basicForm?.privileges?.priorObligatedPrivileges?.length === 0 ? basicForm?.privileges?.obligatedPrivileges : basicForm?.privileges?.priorObligatedPrivileges,
        }
        console.log('data', temp)
        await POST(`application-management-service/application/${applicationId}/privileges`, temp)
            .then((response) => {
                SuccessToaster("Application Updated Successfully");
                getPreApplication()
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Updating Application");
            });
        // if (isAdditionalPrivilegeCategoryChanging) {
        //     let data = basicForm;
        //     data.basicDetails.credentialingPrivilegeCategory.credentialingCategory = privilegeCategories?.filter(data => data?.id === selectedPrivilegeCategory)[0]?.category
        //     data.basicDetails.departmentSpecialty.department = departmentList?.filter(data => data?.id === selectedDepartment)[0]?.departmentName?.name
        //     console.log(data)
        //     await PUT(`application-management-service/application/${applicationId}`, data)
        //         .then(response => {
        //             console.log(response)
        //             setBasicForm(response?.data)
        //             SuccessToaster("Staff Member Application Updated Successfully");
        //             getPreApplication();
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //             ErrorToaster("Unexpected Error Updating Staff Member Application");
        //         });
        // }

    }

    const handleContinue = async () => {
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        }
        else {
            navigate(navigateURL)

        }
    }

    const handleDeleteFile = async (files) => {

        await DELETE(`application-management-service/application/${applicationId}/files`, files)
            .then((response) => {
                SuccessToaster("File Deleted Successfully");
                handleSubmit()
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

    const handleDeleteSelectedPrrivilege = (id) => {
        let filteredData = selectedPrivilegesForDisplayMultiple?.filter(data => data?.id !== id)
        setSelectedPrivilegesForDisplayMultiple(filteredData)
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
        if (selectedPrivilege !== "" && selectedPrivilegeForDisplay?.length !== 0) {
            console.log(selectedPrivilegeForDisplay, selectedAdditionalPrivilegeForDisplay, 'entered', selectedPrivilege, staffPrivilege?.filter(data => data?.id === selectedPrivilege), staffPrivilege, selectedPrivilegesForDisplayMultiple)
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
                        {selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== 0 && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined && (
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
                    {selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== 0 && selectedPrivilegeForDisplay[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined && (
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
                                                                        data={privileges?.notes?.notes || ''}
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
                                                                            toolbar: {
                                                                                shouldNotGroupWhenFull: true,
                                                                                sticky: true,
                                                                                items: [
                                                                                    'undo', 'redo',
                                                                                    '|',
                                                                                    'heading',
                                                                                    '|',
                                                                                    'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                                                                                    '|',
                                                                                    'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                                                                                    '|',
                                                                                    'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                                                                                ],
                                                                            },
                                                                            autoGrow: false,
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
                                                                            {(privileges?.file !== undefined && privileges?.file !== null) ? (
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

    const handleSelectedPrivilegesForDisplayMultiple = (data) => {
        let temp = selectedPrivilegesForDisplayMultiple;
        temp.push(data);
        setSelectedPrivilegesForDisplayMultiple(temp);
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
            {/* <div className={style.applicationScreenGrid}>
                <ReappointmentProgressCard step={'STEP 6'} title={formSchema?.title} dataType={formSchema?.description} timeNumber={20} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}> */}
            {/* <div className={`${style.privilegeCard} ${style.marginTop}`}>
                <div className={style.privilegeHeading}><strong>ADDITIONAL PRIVILEGE REQUESTED</strong></div>
                <div className={`${style.privilegeHeading} ${style.marginTop}`}>Department / Division or specialty</div>
                <div className={style.privilegeHeading}><strong>{applicationData?.basicDetails?.departmentSpecialty?.department}</strong></div>
                <div className={`${style.privilegeHeading} ${style.marginTop}`}>Privileges Requested</div>
                {basicForm?.privileges?.additionalPrivileges?.map(data => (
                    <div className={style.privilegeTitleStyle}>{data?.privilegeSetTitle}</div>
                ))}
            </div> */}
            <div className={`${style.privilegeCard} ${style.marginTop}`}>
                <div>
                    <div className={style.privilegeHeading}><strong>ADDITIONAL PRIVILEGES REQUESTED</strong></div>
                    <div className={style.twoCol}>
                        <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                            <div className={style.privilegeHeading}>Department / Division or specialty</div>
                            <div className={style.privilegeHeading}><strong>{applicationData?.basicDetails?.departmentSpecialty?.department}</strong></div>
                        </div>
                        {/* {basicForm?.basicDetails?.priorPrivilegeCategory !== null && (
                            <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                                <div className={style.privilegeHeading}>Change for Reappointment</div>
                                <div className={style.privilegeHeading}><strong>{basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}</strong></div>
                            </div>
                        )} */}
                    </div>
                    <div className={`${style.privilegeHeading} ${style.marginTop}`}><strong>Privileges Requested</strong></div>
                    <div className={style.twoCol}>
                        <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                            <div className={`${style.privilegeHeading}`}>Current</div>
                            {basicForm?.privileges?.priorAdditionalPrivileges?.length === 0 ? (
                                <>
                                    {basicForm?.privileges?.additionalPrivileges?.map(data => (
                                        <div className={`${style.privilegeTitleStyle} ${style.cursorPointer}`} onClick={() => { setShowCurrentPrivileges(true); handleChange(data?.id) }}>{data?.privilegeSetTitle}</div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {basicForm?.privileges?.priorAdditionalPrivileges?.map(data => (
                                        <div className={`${style.privilegeTitleStyle} ${style.cursorPointer}`} onClick={() => { setShowCurrentPrivileges(true); handleChange(data?.id) }}>{data?.privilegeSetTitle}</div>
                                    ))}
                                </>
                            )}
                        </div>
                        {basicForm?.privileges?.priorAdditionalPrivileges?.length !== 0 && (
                            <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                                <div className={`${style.privilegeHeading}`}>Change for Reappointment</div>
                                {basicForm?.privileges?.additionalPrivileges?.map(data => (
                                    <div className={`${style.privilegeTitleStyle} ${style.cursorPointer}`} onClick={() => { setShowCurrentPrivileges(true); handleChange(data?.id) }}>{data?.privilegeSetTitle}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={`${style.cardTitle} ${style.marginTop}`}>
                Do you want to update / change or request your additional privileges?
            </div>
            {!isAdditionalPrivilegeCategoryChanging && (
                <>
                    {isEdit ? (
                        <div
                            className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                        >
                            <div
                                className={`${style.reappointmentButtonOutlined}`}
                                onClick={() => setIsAdditionalPrivilegeCategoryChanging(true)}
                            >
                                Yes
                            </div>
                            <div
                                className={`${style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                onClick={() => setIsEdit(false)}
                            >
                                No
                            </div>
                        </div>
                    ) : (
                        <>
                            {isUpdateClicked ? (
                                <>
                                    <div
                                        className={`${style.markedAsText} ${style.marginTop}`}
                                    >
                                        <strong>
                                            Marked as{" "}
                                            <span className={style.yesText}>Yes</span>
                                        </strong>{" "}
                                    </div>
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                                    >
                                        <div
                                            className={`${style.reappointmentButtonEdit}`}
                                            onClick={() => setIsEdit(true)}
                                        >
                                            Edit
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className={`${style.markedAsText} ${style.marginTop}`}
                                    >
                                        <strong>
                                            Marked as{" "}
                                            <span className={style.noText}>No</span>
                                        </strong>{" "}
                                    </div>
                                    <div
                                        className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop}`}
                                    >
                                        <div
                                            className={`${style.reappointmentButtonEdit}`}
                                            onClick={() => setIsEdit(true)}
                                        >
                                            Edit
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            {isAdditionalPrivilegeCategoryChanging && (
                <div className={`${style.privilegeCard} ${style.marginTop}`}>
                    <>
                        <div className={style.marginTop}>
                            <CommonSelectField
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className={style.fullWidth}
                                // firstOptionLabel={''}
                                // firstOptionValue={''}
                                valueList={departmentList?.map(data => data?.id)}
                                labelList={departmentList?.map(data => data?.departmentName?.name)}
                                disabledList={departmentList?.map(data => false)}
                                label={'Department / Division or Specialty'}
                                required={false}
                            />
                        </div>
                        {staffPrivilege?.map((data, index) => (
                            <>
                                <div className={`${style.privilegeConfirmationGrid} ${style.marginTop}`}>
                                    {selectedPrivilegesForDisplayMultiple?.map(data => data?.id)?.includes(data?.id) ? (
                                        <div className={`${style.iconBackgroundColorSelected} ${style.verticalAlignCenter} ${style.justifyCenter}`}><CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#FFFFFF' }} /></div>
                                    ) : (
                                        <div className={`${style.iconBackgroundColor} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 15, color: '#FFFFFF' }} /></div>
                                    )}
                                    <div className={style.privilegeHeading}>{data?.privilegeSetTitle}</div>
                                    {selectedPrivilegesForDisplayMultiple?.map(data => data?.id)?.includes(data?.id) ? (
                                        <img src={DeleteIcon} alt="" className={`${style.docTypeImgStyle} ${style.marginLeft}`} onClick={() => { handleDeleteSelectedPrrivilege(data?.id) }} />
                                    ) : (
                                        <img src={BlueSign} alt="" className={`${style.docTypeImgStyle} ${style.marginLeft}`} onClick={() => { setShowPrivileges(true); handleChange(data?.id) }} />
                                    )}
                                </div>
                                {(index !== staffPrivilege?.length - 1) && (
                                    <CommonDivider />
                                )}
                            </>
                        ))}
                    </>
                    <div
                        className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop}`}
                    >
                        <div
                            className={`${style.reappointmentButton} ${style.marginLeft}`}
                            onClick={() => { setIsAdditionalPrivilegeCategoryChanging(false); handleSubmit() }}
                        >
                            UPDATE
                        </div>
                        <div
                            className={`${style.reappointmentButtonOutlined}`}
                            onClick={() => setIsAdditionalPrivilegeCategoryChanging(false)}
                        >
                            CANCEL
                        </div>
                    </div>
                </div>
            )}
            {/* </div>

                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.stickyContainer}`}>
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                    </div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div> */}
            <Dialog isOpen={showPrivileges} onClose={() => setShowPrivileges(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>Privilege Set To Request</div>
                            <div className={style.displayInRow}>
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                    onClick={() => { setShowPrivileges(false) }}
                                />
                            </div>
                        </div>
                        <div>{getFields()}</div>
                        <div
                            className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop10}`}
                        >
                            <div
                                className={`${style.reappointmentButton} ${style.marginLeft} ${(((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined)
                                    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length === 0 || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0
                                    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined) && ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== null
                                        && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.length === 0
                                        || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) ? '' : style.disabledButton}`}
                                onClick={(((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length === 0 || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined) && ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== null && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.length === 0 || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) ? () => { setShowPrivileges(false); handleSelectedPrivilegesForDisplayMultiple(selectedPrivilegeForDisplay[0]) } : () => { }}
                            >
                                CONTINUE
                            </div>
                            {/* <button
  className={`${style.reappointmentButton} ${style.marginLeft} ${(((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length === 0 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined) 
    && ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== null 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.length === 0 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) ? '' : style.disabledButton}`}
  onClick={(((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length === 0 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined) 
    && ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== null 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.length === 0 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined)) 
      ? () => { setShowPrivileges(false); handleSelectedPrivilegesForDisplayMultiple(selectedPrivilegeForDisplay[0]); } 
      : undefined}
  disabled={!(((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== null 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.esign !== undefined) 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.length === 0 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined) 
    && ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== null 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.esign !== undefined) 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.length === 0 
    || selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length === 0 
    && selectedPrivilegeForDisplay?.[0]?.privilegeDetails?.corePrivileges?.privilegesByCategories?.[0]?.privileges?.length !== undefined))}
>
  CONTINUE
</button> */}

                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={showCurrentPrivileges} onClose={() => setShowCurrentPrivileges(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>Selected Privilege Set</div>
                            <div className={style.displayInRow}>
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                    onClick={() => { setShowCurrentPrivileges(false) }}
                                />
                            </div>
                        </div>
                        <div>{getFields()}</div>
                    </div>
                </div>
            </Dialog>
            {showJourneyDialog && (
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Leveling Up! Keep Up The Good Work.`} img={JourneyStep2} formIndex={formIndex} basicForm={basicForm} continueClick={handleContinue} />
            )}
            {isAlertOpen && <AlertDialog isOpen={isAlertOpen} getIsOpen={getIsAlertOpen} title={'Are you sure?'} description={'Do you want to really change the privilege set?'} />}
            {isOpen && <AdditionalPrivilegesDialog getIsOpen={getIsOpen} primaryPrivilege={selectedPrivilege} getSelectedPrivilegeList={getSelectedPrivilegeList} basicForm={basicForm} selectedAdditionalPrivilegeForEdit={selectedAdditionalPrivilegeForEdit} applicationId={applicationId} />}
        </div >
    )
}

export default AdditionalPrivilegeSelection;