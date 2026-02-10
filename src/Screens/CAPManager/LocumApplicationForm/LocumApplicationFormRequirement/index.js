import React, { useState, useEffect } from 'react'

import style from './index.module.scss'
import ApplicationHeader from '../../../../Components/ApplicationHeader';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import CommonMailingAddress from '../../../../Components/CommonFields/CommonMailingAddress';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WelcomeCard from '../../../../Components/WelcomeCard';
import DaysToComplete from '../../../../Components/DaysToCompleteCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useDescope, useSession } from '@descope/react-sdk';
import LoginDialog from '../../../../Components/LoginDialog';
import RequiredDocumentCard from '../../../../Components/RequiredDocumentCard';
import { GET, POST, PUT, DELETE } from '../../../dataSaver';
import jwt from 'jwt-decode';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import { fileLoadingURL } from "../../../../utils/formatting";
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import Cookie from "universal-cookie";
import { differenceInDays, format } from 'date-fns';
import { Dialog, Classes } from "@blueprintjs/core";
import ESignature from "../../../../Components/ESignature";
import CryptoJS from "crypto-js";
import ReappointmentLandingDialog from '../../../../Components/ReappointmentLandingDialog';
import DoItLaterDialog from '../../../../Components/DoItLaterDialog';
import LocumLandingDialog from '../../../../Components/LocumLandingDialog';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PdfDoc from "./../../../../images/pdfDoc.png";
import WordDoc from "./../../../../images/wordDoc.png";
import CrossPink from "./../../../../images/crossPink.png";
import ImgDoc from "./../../../../images/imgDoc.png";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import DeleteIcon from "./../../../../images/deleteHcRow.png";
import VerifiedImage from "./../../../../images/verifiedImage.png";
import ToBeVerifiedImage from "./../../../../images/toBeVerifiedImage.png";
import CommonRadio from "../../../../Components/CommonFields/CommonRadio";
import ESignDialog from '../../../../Components/ESignDialog';
import ESignConfirmationDialog from '../../../../Components/ESignConfirmation';
import { dataLoadingGIF } from '../../../../utils/formatting';
import { Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LocumApplicationFormRequirement = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const { applicationId } = useParams();
    const { logout } = useDescope();
    const { isAuthenticated, isSessionLoading } = useSession();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [basicForm, setBasicForm] = useState()
    const [applicantTypeForm, setApplicantTypeForm] = useState()
    const [isDoItLaterOpen, setIsDoItLaterOpen] = useState(false);
    const [showPrivilegesForSign, setShowPrivilegesForSign] = useState(false);
    const [isShowESignConfirmationDialog, setIsShowESignConfirmationDialog] = useState(false);
    const [isShowESignDialog, setIsShowESignDialog] = useState(false);
    const [applicantProfile, setApplicantProfile] = useState();
    const [uploadFormSchema, setUploadFormSchema] = useState();
    const [selectedPrivilegeForDisplay, setSelectedPrivilegeForDisplay] =
        useState([]);
    const [isLoadingImageDocs, setIsLoadingImageDocs] = useState(false);

    const [privilegeSetChangeYesOrNo, setPrivilegeSetChangeYesOrNo] = useState("");
    const [additionalPrivilegeChangeYesOrNo, setAdditionalPrivilegeChangeYesOrNo] = useState("No");
    const [
        selectedAdditionalPrivilegeForDisplay,
        setSelectedAdditionalPrivilegeForDisplay,
    ] = useState([]);
    const [showAdditionalPrivileges, setShowAdditionalPrivileges] = useState(false);
    let name = `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `;
    const publicKey =
        "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [currentDate, setCurrentDate] = useState(
        format(new Date(), "MMM dd, yyyy")
    );
    const [indexForSign, setIndexForSign] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const title = sessionStorage.getItem('title')
    // const applicationId = '66d1cae19354e9022ad82027';
    sessionStorage.setItem('applicationId', applicationId)

    console.log(basicForm)

    useEffect(() => {
        if (cookie.get('entityId') !== "63ab2ec1bc9089d77c9232ad" && cookie.get('entityId') !== "undefined" && cookie.get('entityId') !== undefined) {
            handleGetEntityId()
            console.log(cookie.get('entityId'), 'refreshCheck')
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }

        if (sessionStorage.getItem('title') !== "HapiCare" && sessionStorage.getItem('title') !== "undefined" && sessionStorage.getItem('title') !== undefined) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [cookie.get('entityId')]);

    useEffect(() => {
        getPreApplication()
        console.log('entered')
    }, [])

    useEffect(() => {
        getApplicantProfile();
        console.log('entered')
    }, [])

    useEffect(() => {
        getBasicForm();
    }, [cookie.get('entityId')])

    useEffect(() => {
        const data = basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection")]?.data;
        setPrivilegeSetChangeYesOrNo(data ? data.privilegeSetChangeYesOrNo : "");
        setAdditionalPrivilegeChangeYesOrNo(data ? data.additionalPrivilegeChangeYesOrNo : "");
    }, [basicForm]);

    useEffect(() => {
        if (basicForm && selectedPrivilegeForDisplay) {
            if (selectedPrivilegeForDisplay?.length === 0) {
                if (selectedAdditionalPrivilegeForDisplay?.length !== 0) {
                    setShowAdditionalPrivileges(true)
                } else {
                    navigate(`/locumApplicationForm/${applicationId}/${basicForm?.forms[1]?.formCategory}/${btoa(basicForm?.forms[1]?.schemaCategory)}`)
                }
            }
        }
    }, [selectedPrivilegeForDisplay])

    const addNewDocument = async (file) => {
        console.log(file, file?.name, "Test");
        let fileName = {
            fileName: file?.name,
        };
        const formData = new FormData();

        if (file !== null) {
            formData.append(
                "files",
                new Blob([JSON.stringify(fileName)], {
                    type: "application/json",
                })
            );
            formData.append("documents", file);
            try {
                setIsLoadingImageDocs(true)
                const response = await POST(
                    `application-management-service/application/${applicationId}/files?isLLMRequired=false`,
                    formData
                );
                console.log("response123", response)
                setIsLoadingImageDocs(false)
                SuccessToaster("File Uploaded Successfully");
                try {
                    if (
                        response?.data?.file?.classification !== null
                    ) {
                        await PUT(
                            `application-management-service/application/${applicationId}/form/updateData`,
                            {
                                documentType:
                                    response?.data?.classification !== null
                                        ? response?.data?.classification
                                        : "",
                                fileSize: `${(file?.size / (1024 * 1024)).toFixed(2)} Mb`,
                                fileURL: response?.data?.fileURL,
                                fileType: response?.data?.fileType,
                                fileUploaded: file?.name,
                                requirement:
                                    response?.data?.classification !== null
                                        ? basicForm?.documentsRequired?.filter(
                                            (data) =>
                                                data?.document?.name ===
                                                response?.data?.classification
                                        )?.[0]?.required
                                            ? "Required"
                                            : "Recommended"
                                        : "",
                                valid: response?.data?.valid,
                                verified: response?.data?.verified,
                            }
                        );
                    }
                    console.log(response);
                } catch (error) {
                    console.log(error);
                }
                console.log(response?.data);
                return response?.data;
            } catch (error) {
                ErrorToaster("File Upload Failed");
                console.error(error);
                return null;
            }
        }
    };

    const handleRestrictedFileSelection = async (
        index,
        categoriesIndex,
        privilegesIndex,
        value,
        type,
        basicOrAdditional
    ) => {
        let file = await addNewDocument(value);
        handleRestrictedSelection(
            index,
            categoriesIndex,
            privilegesIndex,
            file,
            type,
            basicOrAdditional
        );
    };

    const getIsOpen = (value) => {
        setIsOpen(value);
        console.log('processReappointment', value)
    }

    useEffect(() => {
        setUserDetails();
    }, [user?.id])

    useEffect(() => {
        setSelectedAdditionalPrivilegeForDisplay(
            basicForm?.privileges?.additionalPrivileges
        );
        setSelectedPrivilegeForDisplay(basicForm?.privileges?.obligatedPrivileges);
        if (basicForm !== undefined) {
            console.log('esignCheck', basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL === undefined, basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text === undefined, basicForm)
            if ((basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.file?.fileURL === undefined && basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data?.setUpYourSignature?.type?.text === undefined)) {
                setIsShowESignDialog(true)
            } else {
                setIsShowESignConfirmationDialog(true)
            }
        }
        getUploadFormSchema()
    }, [basicForm])

    const handleGetEntityId = async () => {
        setIsLoading(true);
        const { data: response } = await GET(`entity-service/entity/${cookie.get('entityId')}`)
        sessionStorage.setItem('title', response?.entityName?.entityName)
        setIsLoading(false);
    }

    const handleLogout = () => {
        cookie.remove("user", { path: "/" });
        cookie.remove("entityId", { path: "/" });
        cookie.remove("authorization", {
            path: "/",
            domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname
        });
        logout()
        navigate('/')
    }

    const setUserDetails = async () => {
        const { data: userDetails } = await GET(`user-management-service/user/${user?.id}`);
        console.log(userDetails)
        sessionStorage.setItem('user', JSON.stringify(userDetails))
    }

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/basicForm`
        );
        if (basicForm) {
            const { data: form1 } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[0]?.id}`
            );
            setApplicantTypeForm(form1?.schema)
        }
    }

    const getIsDoItLaterOpen = (value) => {
        setIsDoItLaterOpen(value);
    }

    const getIsOpenESignConfirmation = (value) => {
        setIsShowESignConfirmationDialog(value);
    }

    const getIsOpenESignDialog = (value) => {
        setIsShowESignDialog(value);
    }

    const updateFunc = () => {
        setIsShowESignDialog(true);
    }

    const confirmESign = async () => {
        let data = applicantProfile;
        data.signature.updated = true
        console.log(data)
        await PUT(`application-management-service/application/${applicationId}/profile`, data)
            .then(response => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        setApplicantProfile(profile)
    }

    const getUploadFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.id}`
        );
        setUploadFormSchema(form?.schema)
    }

    const handleDeleteFile = async (files) => {
        await DELETE(
            `application-management-service/application/${applicationId}/files`,
            files
        )
            .then((response) => {
                SuccessToaster("File Deleted Successfully");
                handleSubmit();
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Deleting File");
            });
    };


    const handleSubmitApplicationReq = async (data) => {
        // await PUT(`application-management-service/application/${applicationId}`, basicForm)
        //     .then(response => {
        //         console.log(response)
        //         navigate('/applicationForm/section1/step1')
        //         SuccessToaster("Application Updated Successfully");
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         ErrorToaster("Unexpected Error Updating Application");
        //     });
        navigate(`/locumApplicationForm/${applicationId}/${basicForm?.forms[1]?.formCategory}/${btoa(basicForm?.forms[1]?.schemaCategory)}`)
    }

    // const calculateRemainingDays = (createdDate, totalDays) => {
    //     const currentDate = new Date();
    //     const startDate = new Date(createdDate);
    //     const timeDiff = currentDate - startDate;
    //     const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    //     const remainingDays = totalDays - daysPassed;
    //     return remainingDays > 0 ? remainingDays : 0;
    // }

    const getIsRestrictedValuesFilled = (set) => {
        console.log(set, 'enteredCheck')
        const allHaveResponse = set?.every(
            item => {
                const hasValidResponse = typeof item?.response === 'string' && item?.response?.trim() !== '' && item?.response !== null;
                const isResponseYes = item?.response === 'YES';
                const hasAdditionalData = isResponseYes ? item?.notes?.notes && item?.notes?.notes?.trim() !== '' && item?.notes?.notes !== null : true;
                return hasValidResponse && hasAdditionalData;
            }
        );
        return (set?.length === 0 || set === undefined) ? true : allHaveResponse;
    }

    const getIsAdditionalRestrictedValuesFilled = (set) => {
        console.log(set, 'enteredCheck')
        const allAdditionalHaveResponse = set?.every(
            item => {
                const hasValidResponse = typeof item?.response === 'string' && item?.response?.trim() !== '' && item?.response !== null;
                const isResponseYes = item?.response === 'YES';
                const hasAdditionalData = isResponseYes ? item?.notes?.notes && item?.notes?.notes?.trim() !== '' && item?.notes?.notes !== null : true;
                return hasValidResponse && hasAdditionalData;
            }
        );
        return (set?.length === 0 || set === undefined) ? true : allAdditionalHaveResponse;
    }

    const handleRestrictedSelection = (
        index,
        categoriesIndex,
        privilegesIndex,
        value,
        key,
        basicOrAdditional
    ) => {
        console.log(
            index,
            categoriesIndex,
            privilegesIndex,
            value,
            key,
            "onChange",
            basicOrAdditional
        );
        if (basicOrAdditional === 'Additional') {
            setSelectedAdditionalPrivilegeForDisplay((prevData) => {
                const temp = [...prevData];

                temp[index] = {
                    ...temp[index],
                    privilegeDetails: {
                        ...temp[index].privilegeDetails,
                        restrictedPrivileges: {
                            ...temp[index].privilegeDetails.restrictedPrivileges,
                            privilegesByCategories: [
                                ...temp[index].privilegeDetails.restrictedPrivileges
                                    .privilegesByCategories,
                            ],
                        },
                    },
                };

                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                    categoriesIndex
                ] = {
                    ...temp[index].privilegeDetails.restrictedPrivileges
                        .privilegesByCategories[categoriesIndex],
                    privileges: [
                        ...temp[index].privilegeDetails.restrictedPrivileges
                            .privilegesByCategories[categoriesIndex].privileges,
                    ],
                };
                if (key === "file") {
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].file = value;
                    console.log(index, categoriesIndex, privilegesIndex, value, key);
                } else if (key === "removeFile") {
                    handleDeleteFile([
                        temp[index].privilegeDetails.restrictedPrivileges
                            .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
                            .file,
                    ]);
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].file = value;
                    console.log(index, categoriesIndex, privilegesIndex, value, key);
                } else if (key === "response") {
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].response = value;
                } else if (key === "notes") {
                    if (
                        temp[index].privilegeDetails.restrictedPrivileges
                            .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
                            .notes === undefined ||
                        temp[index].privilegeDetails.restrictedPrivileges
                            .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
                            .notes === null
                    ) {
                        temp[
                            index
                        ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                            categoriesIndex
                        ].privileges[privilegesIndex].notes = {};
                    }
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].notes.notes = value;
                }

                return temp;
            });
            // getFieldsAdditional();
        } else {
            setSelectedPrivilegeForDisplay((prevData) => {
                const temp = [...prevData];

                temp[index] = {
                    ...temp[index],
                    privilegeDetails: {
                        ...temp[index]?.privilegeDetails,
                        restrictedPrivileges: {
                            ...temp[index]?.privilegeDetails?.restrictedPrivileges,
                            privilegesByCategories: [
                                ...temp[index]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories,
                            ],
                        },
                    },
                };

                temp[index].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                    categoriesIndex
                ] = {
                    ...temp?.[index]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[categoriesIndex],
                    privileges: [
                        ...(temp?.[index]?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.[categoriesIndex]?.privileges || []),
                    ],
                };
                if (key === "file") {
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].file = value;
                    console.log(index, categoriesIndex, privilegesIndex, value, key);
                } else if (key === "removeFile") {
                    handleDeleteFile([
                        temp[index].privilegeDetails.restrictedPrivileges
                            .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
                            .file,
                    ]);
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].file = value;
                    console.log(index, categoriesIndex, privilegesIndex, value, key);
                } else if (key === "response") {
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].response = value;
                } else if (key === "notes") {
                    if (
                        temp[index].privilegeDetails.restrictedPrivileges
                            .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
                            .notes === undefined ||
                        temp[index].privilegeDetails.restrictedPrivileges
                            .privilegesByCategories[categoriesIndex].privileges[privilegesIndex]
                            .notes === null
                    ) {
                        temp[
                            index
                        ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                            categoriesIndex
                        ].privileges[privilegesIndex].notes = {};
                    }
                    temp[
                        index
                    ].privilegeDetails.restrictedPrivileges.privilegesByCategories[
                        categoriesIndex
                    ].privileges[privilegesIndex].notes.notes = value;
                }

                return temp;
            });
            // getFields();
        }
    };

    const handleSign = (type, basicOrAdditional, index, isPrivilegeSpecificationType) => {
        console.log('handleSignCheck', type, basicOrAdditional, index, isPrivilegeSpecificationType, indexForSign, selectedPrivilegeForDisplay)
        if (isPrivilegeSpecificationType) {
            if (basicOrAdditional === "Basic") {
                setSelectedPrivilegeForDisplay((prevData) => {
                    const temp = [...prevData];
                    console.log(temp?.[index], 'handleSignCheck', selectedPrivilegeForDisplay)
                    if ((temp?.[index]?.descriptiveContent === null || temp?.[index]?.descriptiveContent?.esign === null ||
                        temp?.[index]?.descriptiveContent?.esign === undefined)
                    ) {
                        temp[index].descriptiveContent.esign = {
                            esign: CryptoJS.AES.encrypt(
                                name + new Date().toISOString(),
                                publicKey
                            ).toString(),
                            name: name,
                            signedDate: currentDate,
                        };
                    }
                    return temp;
                });
            } else {
                setSelectedAdditionalPrivilegeForDisplay((prevData) => {
                    const temp = [...prevData];
                    console.log(temp?.[index], 'handleSignCheck', selectedPrivilegeForDisplay)
                    if ((temp?.[index]?.descriptiveContent === null || temp?.[index]?.descriptiveContent?.esign === null ||
                        temp?.[index]?.descriptiveContent?.esign === undefined)
                    ) {
                        temp[index].descriptiveContent.esign = {
                            esign: CryptoJS.AES.encrypt(
                                name + new Date().toISOString(),
                                publicKey
                            ).toString(),
                            name: name,
                            signedDate: currentDate,
                        };
                    }
                    return temp;
                });
            }
        } else {
            if (basicOrAdditional === "Basic") {
                setSelectedPrivilegeForDisplay((prevData) => {
                    const temp = [...prevData];
                    if (
                        type === "Core" &&
                        (temp[index].privilegeDetails.corePrivileges.esign === null ||
                            temp[index].privilegeDetails.corePrivileges.esign === undefined)
                    ) {
                        temp[index].privilegeDetails.corePrivileges.esign = {
                            esign: CryptoJS.AES.encrypt(
                                name + new Date().toISOString(),
                                publicKey
                            ).toString(),
                            name: name,
                            signedDate: currentDate,
                        };
                    } else if (
                        type === "Restricted" &&
                        (temp[index].privilegeDetails.restrictedPrivileges.esign === null ||
                            temp[index].privilegeDetails.restrictedPrivileges.esign === undefined)
                    ) {
                        temp[index].privilegeDetails.restrictedPrivileges.esign = {
                            esign: CryptoJS.AES.encrypt(
                                name + new Date().toISOString(),
                                publicKey
                            ).toString(),
                            name: name,
                            signedDate: currentDate,
                        };
                    }

                    return temp;
                });
            } else {
                setSelectedAdditionalPrivilegeForDisplay((prevData) => {
                    const temp = [...prevData];
                    if (
                        type === "Core" &&
                        (temp[index].privilegeDetails.corePrivileges.esign === null ||
                            temp[index].privilegeDetails.corePrivileges.esign === undefined)
                    ) {
                        temp[index].privilegeDetails.corePrivileges.esign = {
                            esign: CryptoJS.AES.encrypt(
                                name + new Date().toISOString(),
                                publicKey
                            ).toString(),
                            name: name,
                            signedDate: currentDate,
                        };
                    } else if (
                        type === "Restricted" &&
                        (temp[index].privilegeDetails.restrictedPrivileges.esign === null ||
                            temp[index].privilegeDetails.restrictedPrivileges.esign ===
                            undefined)
                    ) {
                        temp[index].privilegeDetails.restrictedPrivileges.esign = {
                            esign: CryptoJS.AES.encrypt(
                                name + new Date().toISOString(),
                                publicKey
                            ).toString(),
                            name: name,
                            signedDate: currentDate,
                        };
                    }

                    return temp;
                });
            }
        }
    };

    const getFieldsForSign = (id, privilegeSetIndex, privilegeData, isBasicOrAdditional) => {
        if (id !== "") {
            console.log(
                isBasicOrAdditional,
                "entered",
                privilegeData,
            );
            return (
                <>
                    <div className={style.marginTop}>
                        <div className={style.cardTitle}>{`${title !== 'HapiCare' ? title : ''} ${privilegeData?.privilegeSetTitle?.toUpperCase()}`}</div>

                        {privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ?
                            (
                                <div
                                    className={` ${style.marginTop} ${style.descriptionStyle}`}
                                    dangerouslySetInnerHTML={{ __html: privilegeData?.descriptiveContent?.content }}
                                />
                            )
                            : privilegeData?.privilegeDetails?.corePrivileges?.privilegesByCategories?.map(
                                (categories, index) => (
                                    <>
                                        <div>
                                            <div className={style.categoryGrid}>
                                                <div className={style.itemLeft}>
                                                    <strong>
                                                        {categories?.category === null
                                                            ? ""
                                                            : categories?.category}
                                                    </strong>
                                                </div>
                                            </div>
                                            <>
                                                {categories?.privileges?.map((privileges) => (
                                                    <div className={style.privilegeCodeGrid}>
                                                        <div className={style.itemLeft}>
                                                            <strong>{privileges?.privilegeId || ""}</strong>
                                                        </div>
                                                        <div className={style.itemLeft}>
                                                            {privileges?.title || ""}
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        </div>
                                        {categories?.subCategories?.map((subCategory, subIndex) => (
                                            <div className={style.marginLeft20}>
                                                <div className={style.categoryGrid}>
                                                    <div className={style.itemLeft}><strong>{subCategory?.subCategory === null ? '' : subCategory?.subCategory}</strong></div>
                                                </div>
                                                <>{
                                                    subCategory?.privileges?.map(privileges => (
                                                        <div className={style.privilegeCodeGrid}>
                                                            <div className={style.itemLeft}><strong>{privileges?.privilegeId || ''}</strong></div>
                                                            <div className={style.itemLeft}>{privileges?.title || ''}</div>
                                                        </div>

                                                    ))
                                                }
                                                </>
                                            </div>
                                        ))}
                                    </>
                                )
                            )}
                        {((privilegeData?.privilegeDetails?.corePrivileges
                            ?.privilegesByCategories?.[0]?.privileges?.length !== 0 &&
                            privilegeData?.privilegeDetails?.corePrivileges
                                ?.privilegesByCategories?.[0]?.privileges?.length !==
                            undefined) || (privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" && privilegeData?.descriptiveContent?.content)) && (
                                <div className={style.twoCol}>
                                    <div onClick={() => handleSign("Core", isBasicOrAdditional, privilegeSetIndex, privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT")}>
                                        <ESignature
                                            userName={privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? privilegeData?.descriptiveContent?.esign !== null ? privilegeData?.descriptiveContent?.esign?.name : "" :
                                                privilegeData?.privilegeDetails
                                                    ?.corePrivileges?.esign !== null
                                                    ? privilegeData?.privilegeDetails
                                                        ?.corePrivileges?.esign?.name
                                                    : ""
                                            }
                                            encData={
                                                privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? privilegeData?.descriptiveContent?.esign !== null ? privilegeData?.descriptiveContent?.esign?.esign : "" :
                                                    privilegeData?.privilegeDetails
                                                        ?.corePrivileges?.esign !== null
                                                        ? privilegeData?.privilegeDetails
                                                            ?.corePrivileges?.esign?.esign
                                                        : ""
                                            }
                                            showData={
                                                privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? privilegeData?.descriptiveContent?.esign ? true : false :
                                                    privilegeData?.privilegeDetails
                                                        ?.corePrivileges?.esign !== null &&
                                                        privilegeData?.privilegeDetails
                                                            ?.corePrivileges?.esign !== undefined
                                                        ? true
                                                        : false
                                            }
                                            showDatais={true}
                                        />
                                    </div>
                                    <div className={style.verticalAlignCenter}>
                                        <div className={style.displayInRow}>
                                            <div className={style.dateTitle}>Date: </div>
                                            <div className={`${style.date} ${style.marginLeft}`}>
                                                {privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT" ? privilegeData?.descriptiveContent?.esign ? privilegeData?.descriptiveContent?.esign?.signedDate : "" :
                                                    privilegeData?.privilegeDetails
                                                        ?.corePrivileges?.esign !== null
                                                        ? privilegeData?.privilegeDetails
                                                            ?.corePrivileges?.esign?.signedDate
                                                        : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>

                    {privilegeData?.privilegeDetails
                        ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                        ?.length !== 0 &&
                        privilegeData?.privilegeDetails
                            ?.restrictedPrivileges?.privilegesByCategories?.[0]?.privileges
                            ?.length !== undefined && (
                            <div className={style.padding}>
                                <div className={style.cardDescription}>
                                    {
                                        "The following privileges are restricted and require evidence of qualification and competence. Continued competence would be evaluated as that being acceptable to the Medical Consultant of the Program. Please signify your intention regarding each privilege by marking and sign below."
                                    }
                                </div>

                                {privilegeData?.privilegeDetails?.restrictedPrivileges?.privilegesByCategories?.map(
                                    (categories, categoriesIndex) => (
                                        <div key={`${privilegeSetIndex}${categoriesIndex}`}>
                                            <div className={style.categoryGrid}></div>
                                            <>
                                                {categories?.privileges?.map(
                                                    (privileges, privilegesIndex) => (
                                                        <div
                                                            className={`${style.restrictedPrivilegeGrid} ${privilegesIndex === 0 ? style.marginTop : ""
                                                                }`}
                                                            key={`${privilegeSetIndex}${privilegesIndex}`}
                                                        >
                                                            <div className={style.itemLeft}>
                                                                <strong>
                                                                    {privileges?.privilegeId || ""}
                                                                </strong>
                                                            </div>
                                                            <div className={style.itemLeft}>
                                                                {privileges?.title || ""}
                                                            </div>
                                                            <div className={style.floatRight}>
                                                                <CommonRadio
                                                                    value={privileges?.response || ""}
                                                                    onChange={(e) =>
                                                                        handleRestrictedSelection(
                                                                            privilegeSetIndex,
                                                                            categoriesIndex,
                                                                            privilegesIndex,
                                                                            e.target.value,
                                                                            "response",
                                                                            isBasicOrAdditional
                                                                        )
                                                                    }
                                                                    radioValue={["NO", "YES"]}
                                                                    label={["No", "Yes"]}
                                                                />
                                                            </div>
                                                            {privileges?.response === "YES" &&
                                                                (privileges?.isevidenceRequired ||
                                                                    privileges?.isevidenceRequired ===
                                                                    undefined) && (
                                                                    <>
                                                                        <div className={style.marginTop}>
                                                                            <CKEditor
                                                                                editor={ClassicEditor}
                                                                                data={privileges?.notes?.notes || ""}
                                                                                onChange={(event, editor) => {
                                                                                    const data = editor.getData();
                                                                                    handleRestrictedSelection(
                                                                                        privilegeSetIndex,
                                                                                        categoriesIndex,
                                                                                        privilegesIndex,
                                                                                        data,
                                                                                        "notes",
                                                                                        isBasicOrAdditional
                                                                                    );
                                                                                }}
                                                                                onReady={(editor) => {
                                                                                    editor.editing.view.change(
                                                                                        (writer) => {
                                                                                            writer.setStyle(
                                                                                                "height",
                                                                                                "150px",
                                                                                                editor.editing.view.document.getRoot()
                                                                                            );
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                config={{
                                                                                    placeholder:
                                                                                        "Insert any privilege competency and qualification information...",
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

                                                                        <div className={style.marginTop10}>
                                                                            <div
                                                                                className={`${style.uploadButton}`}
                                                                            >
                                                                                <div className={style.uploadGrid}>
                                                                                    {privileges?.file !== undefined &&
                                                                                        privileges?.file !== null ? (
                                                                                        <img
                                                                                            src={VerifiedImage}
                                                                                            alt=""
                                                                                            className={`${style.imgIcon} `}
                                                                                        />
                                                                                    ) : (
                                                                                        <img
                                                                                            src={ToBeVerifiedImage}
                                                                                            alt=""
                                                                                            className={style.imgIcon}
                                                                                        />
                                                                                    )}
                                                                                    <div
                                                                                        className={`${style.uploadText} ${style.verticalAlignCenter}`}
                                                                                    >
                                                                                        Upload any supporting documents
                                                                                        for evidence of qualification and
                                                                                        competence(Optional)
                                                                                    </div>
                                                                                    <div>
                                                                                        <label
                                                                                            for={`locum-file-upload-dynamic-basic${privilegesIndex}`}
                                                                                            className={` ${style.uploadTextButton} ${style.cursorPointer} ${style.verticalAlignCenter}`}
                                                                                        >
                                                                                            Click to upload
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <input
                                                                                id={`locum-file-upload-dynamic-basic${privilegesIndex}`}
                                                                                type="file"
                                                                                accept=".pdf,.doc,.png,.xls,.xlsx,.jpeg,.gif,.docx"
                                                                                onChange={(e) => {
                                                                                    handleRestrictedFileSelection(
                                                                                        privilegeSetIndex,
                                                                                        categoriesIndex,
                                                                                        privilegesIndex,
                                                                                        e.target.files[0],
                                                                                        "file",
                                                                                        isBasicOrAdditional
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        {privileges?.file !== null &&
                                                                            privileges?.file?.fileName !==
                                                                            undefined && (
                                                                                <div
                                                                                    className={`${style.fileDisplay} ${style.fileDisplayText} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                                                                >
                                                                                    <div className={style.displayInRow}>
                                                                                        <div
                                                                                            onClick={() => {
                                                                                                window.open(
                                                                                                    privileges?.file?.fileURL,
                                                                                                    "_blank"
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            {privileges?.file?.fileType ===
                                                                                                "application/pdf" ? (
                                                                                                <img
                                                                                                    src={PdfDoc}
                                                                                                    alt=""
                                                                                                    className={
                                                                                                        style.docTypeImgStyle
                                                                                                    }
                                                                                                />
                                                                                            ) : privileges?.file?.fileType?.startsWith(
                                                                                                "image/"
                                                                                            ) ? (
                                                                                                <img
                                                                                                    src={ImgDoc}
                                                                                                    alt=""
                                                                                                    className={
                                                                                                        style.docTypeImgStyle
                                                                                                    }
                                                                                                />
                                                                                            ) : (
                                                                                                <TextSnippetOutlinedIcon
                                                                                                    style={{
                                                                                                        fontSize: 20,
                                                                                                        color: `${privilegeData?.subStatus}`,
                                                                                                    }}
                                                                                                />
                                                                                            )}
                                                                                        </div>
                                                                                        <div className={style.marginLeft}>
                                                                                            {privileges?.file?.fileName}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <img
                                                                                            src={DeleteIcon}
                                                                                            alt=""
                                                                                            className={
                                                                                                style.docTypeImgStyle
                                                                                            }
                                                                                            onClick={() => {
                                                                                                handleRestrictedSelection(
                                                                                                    privilegeSetIndex,
                                                                                                    categoriesIndex,
                                                                                                    privilegesIndex,
                                                                                                    null,
                                                                                                    "removeFile",
                                                                                                    isBasicOrAdditional
                                                                                                );
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        <br />
                                                                    </>
                                                                )}
                                                        </div>
                                                    )
                                                )}
                                            </>
                                        </div>
                                    )
                                )}
                                <div className={style.twoCol}>
                                    <div
                                        onClick={getIsRestrictedValuesFilled(privilegeData?.privilegeDetails
                                            ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                            ?.privileges) ? () => {
                                                handleSign("Restricted", isBasicOrAdditional, privilegeSetIndex, privilegeData?.privilegeSpecificationType === "DESCRIPTIVEDOCUMENT");
                                            } : () => { }
                                        }
                                    >
                                        <ESignature
                                            userName={
                                                privilegeData?.privilegeDetails
                                                    ?.restrictedPrivileges?.esign !== null
                                                    ? privilegeData?.privilegeDetails
                                                        ?.restrictedPrivileges?.esign?.name
                                                    : ""
                                            }
                                            encData={
                                                privilegeData?.privilegeDetails
                                                    ?.restrictedPrivileges?.esign !== null
                                                    ? privilegeData?.privilegeDetails
                                                        ?.restrictedPrivileges?.esign?.esign
                                                    : ""
                                            }
                                            showData={
                                                privilegeData?.privilegeDetails
                                                    ?.restrictedPrivileges?.esign !== null &&
                                                    privilegeData?.privilegeDetails
                                                        ?.restrictedPrivileges?.esign !== undefined
                                                    ? true
                                                    : false
                                            }
                                            showDatais={true}
                                        />
                                    </div>
                                    <div className={style.verticalAlignCenter}>
                                        <div className={style.displayInRow}>
                                            <div className={style.dateTitle}>Date: </div>
                                            <div className={`${style.date} ${style.marginLeft}`}>
                                                {privilegeData?.privilegeDetails
                                                    ?.restrictedPrivileges?.esign !== null
                                                    ? privilegeData?.privilegeDetails
                                                        ?.restrictedPrivileges?.esign?.signedDate
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </>
            );
        }
    };

    const uploadFormIndex = basicForm?.forms?.findIndex((f) => f?.schemaCategory === 'UploadYourDoc') ?? -1;
    const uploadTable = (uploadFormIndex >= 0 && basicForm?.forms?.[uploadFormIndex]?.data?.table) ? basicForm.forms[uploadFormIndex].data.table : [];

    const documentsToShow = (basicForm?.documentsRequired || []).filter((data) => {
        const matchingRows = (uploadTable || []).filter(
            (row) => row?.documentType === data?.document?.shortName
        );
        const hasValidVerified = matchingRows.some((row) => row?.verified && row?.valid);
        return !hasValidVerified;
    });

    const documentsValidAndVerified = (uploadTable || []).filter((row) => row?.valid && row?.verified);

    const getIsDocRequired = (data) => {
        if (!data?.departmentSpecific) {
            return data?.document?.shortName === "Profile Picture" ? "Optional" : data?.required ? 'Required' : 'Recommended';
        } else {
            if (data?.document?.shortName === "Profile Picture") {
                return "Optional";
            } else {
                let isDepartmentMatching = data?.departments?.map(deptData => deptData?.department?.id)?.includes(basicForm?.basicDetailReferences?.department?.id)
                if (isDepartmentMatching) {
                    if (data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialitySpecific) {
                        let isSpecialtyMatching = data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.map(specialtyData => specialtyData?.specialty?.id)?.includes(basicForm?.basicDetailReferences?.specialty?.id);
                        if (isSpecialtyMatching) {
                            return data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.filter(specialtyData => specialtyData?.specialty?.id === basicForm?.basicDetailReferences?.specialty?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        } else {
                            return data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        }
                    } else {
                        return data?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                    }
                } else {
                    return data?.required ? 'Required' : 'Recommended';
                }
            }
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        let temp = {
            obligatedPrivileges: selectedPrivilegeForDisplay,
            additionalPrivileges: selectedAdditionalPrivilegeForDisplay,
            priorAdditionalPrivileges: basicForm?.privileges?.priorAdditionalPrivileges,
            priorObligatedPrivileges: basicForm?.privileges?.priorObligatedPrivileges,
        };
        console.log("data", temp);
        await POST(
            `application-management-service/application/${applicationId}/privileges`,
            temp
        )
            .then((response) => {
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
                handleSubmitApplicationReq()
            })
            .catch((error) => {
                ErrorToaster("Unexpected Error Updating Application");
            });
        setIsLoading(false)
    };

    console.log(basicForm, 'processReappointment', isOpen)

    return (
        <div>
            {isLoadingImageDocs && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle1} />
                </div>
            )}
            {isLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            {isOpen ? (
                <LocumLandingDialog getIsOpen={getIsOpen} days={basicForm?.expiryDate !== null ? differenceInDays(new Date(basicForm?.expiryDate), new Date(format(new Date(), 'yyyy-MM-dd'))) : 0} />
            ) : (
                <>
                    <div className={style.screenBackground}>
                        <ApplicationHeader title={`Locum Staff ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Application For ${basicForm?.basicDetails?.applicant?.name?.firstName !== undefined ? basicForm?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${basicForm?.basicDetails?.applicant?.name?.lastName !== undefined ? basicForm?.basicDetails?.applicant?.name?.lastName : '{Last Name}'}, ${(basicForm?.basicDetails?.applicant?.applicantType !== null) ? basicForm?.basicDetails?.applicant?.applicantType : ''}`} close={true} closeClick={handleLogout} />
                        <div className={style.screenPadding}>
                            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                                <div>
                                    <div className={`${style.applicationCardStyle}`}>
                                        <div className={`${style.privilegeTitleStyle} ${style.marginLeft}`}>Privileges for {basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'}</div>
                                        <div className={`${style.privilegeCard}`}>
                                            <div>
                                                {/* <div className={style.privilegeHeading}>
                                                    <strong>Privilege Category</strong>
                                                </div>
                                                <div className={style.twoCol}>
                                                    <div
                                                        className={`${style.privilegeContentCard} ${style.marginTop10}`}
                                                    >
                                                        <div className={style.privilegeHeading}>Current</div>
                                                        <div className={style.privilegeHeading}>
                                                            <strong>
                                                                {(basicForm?.basicDetails?.priorPrivilegeCategory !== null && basicForm?.basicDetails?.priorPrivilegeCategory?.name !== null)
                                                                    ? basicForm?.basicDetails?.priorPrivilegeCategory
                                                                        ?.name
                                                                    : basicForm?.basicDetails
                                                                        ?.credentialingPrivilegeCategory
                                                                        ?.credentialingCategory}
                                                            </strong>
                                                        </div>
                                                    </div>
                                                    {basicForm?.basicDetails?.priorPrivilegeCategory !== null && (
                                                        <div
                                                            className={`${style.privilegeContentCard} ${style.marginTop10}`}
                                                        >
                                                            <div className={style.privilegeHeadingReappointment}>
                                                                Change for {` ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'}`}
                                                            </div>
                                                            <div className={style.privilegeHeading}>
                                                                <strong>
                                                                    {
                                                                        basicForm?.basicDetails
                                                                            ?.credentialingPrivilegeCategory
                                                                            ?.credentialingCategory
                                                                    }
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div> */}
                                                {(basicForm?.privileges?.priorObligatedPrivileges?.length !== 0 || basicForm?.privileges?.obligatedPrivileges?.length !== 0) && (
                                                    <>
                                                        <div className={`${style.privilegeHeading} ${style.marginTop10}`}>
                                                            <strong>Privilege Sets</strong>
                                                        </div>
                                                        <div className={style.twoCol}>
                                                            <div
                                                                className={`${style.privilegeContentCard} ${style.marginTop10}`}
                                                            >
                                                                <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                                                                {basicForm?.privileges?.priorObligatedPrivileges?.length === 0 ?
                                                                    (
                                                                        <div className={style.privilegeHeading}>Not Available</div>
                                                                    ) : (
                                                                        <>
                                                                            {basicForm?.privileges?.priorObligatedPrivileges?.map(
                                                                                (data) => (
                                                                                    <div className={style.privilegeHeading}
                                                                                    >
                                                                                        {data?.privilegeSetTitle}
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </>
                                                                    )}
                                                            </div>
                                                            {privilegeSetChangeYesOrNo !== "" && (
                                                                <div
                                                                    className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}
                                                                >
                                                                    <div className={`${style.privilegeHeadingReappointment}`}>
                                                                        Change for Locum {basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'}
                                                                    </div>
                                                                    {privilegeSetChangeYesOrNo === "Yes" ? (
                                                                        <>
                                                                            <div className={style.privilegeHeading}>
                                                                                Same Privileges Requested
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {basicForm?.privileges?.obligatedPrivileges?.map(
                                                                                (data) => (
                                                                                    <div
                                                                                        className={`${style.privilegeHeading}`}
                                                                                    >
                                                                                        {data?.privilegeSetTitle}
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                                {(basicForm?.privileges?.priorAdditionalPrivileges?.length !== 0 || basicForm?.privileges?.additionalPrivileges?.length !== 0) && (
                                                    <div>
                                                        <div className={`${style.privilegeHeading} ${style.marginTop10}`}><strong>Additional Privileges</strong></div>
                                                        <div className={style.twoCol}>
                                                            <div className={`${style.privilegeContentCard} ${style.marginTop10}`}>
                                                                <div className={`${style.privilegeHeadingCurrent}`}>Current</div>
                                                                {basicForm?.privileges?.priorAdditionalPrivileges?.length === 0 ? (
                                                                    <>
                                                                        {basicForm?.privileges?.priorAdditionalPrivileges?.length === 0 ? (
                                                                            <div className={style.privilegeHeading}>None</div>
                                                                        ) : (
                                                                            <>
                                                                                {basicForm?.privileges?.additionalPrivileges?.map(data => (
                                                                                    <div
                                                                                        className={`${style.privilegeHeading} `}
                                                                                    >{data?.privilegeSetTitle}</div>
                                                                                ))}
                                                                            </>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {basicForm?.privileges?.priorAdditionalPrivileges?.map(data => (
                                                                            <div
                                                                                className={`${style.privilegeHeading} `}
                                                                            >{data?.privilegeSetTitle}</div>
                                                                        ))}
                                                                    </>
                                                                )}
                                                            </div>
                                                            {basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection")]?.data?.additionalPrivilegeChangeYesOrNo !== '' && basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === "PrivilegeSelection")]?.data?.additionalPrivilegeChangeYesOrNo !== undefined && (
                                                                <div className={`${style.privilegeContentChangeCard} ${style.marginTop10}`}>
                                                                    <div className={`${style.privilegeHeadingReappointment}`}>{additionalPrivilegeChangeYesOrNo === 'No' ? 'Privileges Requested' : `Change for Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'}`}</div>
                                                                    {additionalPrivilegeChangeYesOrNo === 'No' ? (
                                                                        <div className={`${style.privilegeHeading}`}>None</div>
                                                                    ) : (
                                                                        <>
                                                                            <div className={style.privilegeHeading}>
                                                                                Additional Privilege Requested
                                                                            </div>
                                                                            {basicForm?.privileges?.additionalPrivileges?.map(data => (
                                                                                <div
                                                                                    className={`${style.privilegeHeadingWithHover} ${style.cursorPointer}`}
                                                                                >{data?.privilegeSetTitle}</div>
                                                                            ))}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.marginTop}>
                                        <WelcomeCard title={`Before you get started having the documents listed below will expedite the completion of your Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Application. You will be required to Sign Off on your Privileges that are listed for your new Locum Term.`} description={''} />
                                    </div>
                                    <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                                        <div className={style.titleTextStyle}> List of Documents to Complete this Application</div>
                                        {documentsToShow?.length > 0 ? (
                                            <>
                                                <div className={`${style.tableHeader} ${style.tableGrid} ${style.marginTop}`}>
                                                    <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                                                    <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}> </div>
                                                    <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                                                </div>
                                                {documentsToShow?.map((data, index) => (
                                                    <div key={data?.document?.id ?? index}>
                                                        <div className={`${style.requiredDocumentCard} ${style.tableGrid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''}  ${style.marginTop5}`}>
                                                            <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                                                <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.document?.shortName}</div>
                                                            </div>
                                                            <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{getIsDocRequired(data)}</div>
                                                            <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{data?.instruction}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (basicForm?.documentsRequired?.length > 0 ? (
                                            <div className={`${style.allDocumentsCompleteMessage} ${style.marginTop}`}>
                                                All required documents have been uploaded and verified.
                                            </div>
                                        ) : null)}
                                    </div>
                                    {documentsValidAndVerified?.length > 0 && (
                                        <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                                            <div className={style.titleTextStyle}>Documents that are Current and Valid</div>
                                            <div className={`${style.tableHeader} ${style.tableGridValid} ${style.marginTop}`}>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Document Type</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Requirement</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}>Status</div>
                                                <div className={`${style.tableHeaderText} ${style.verticalAlignCenter}`}></div>
                                            </div>
                                            {documentsValidAndVerified.map((row, index) => (
                                                <div key={row?.rowId ?? index}>
                                                    <div className={`${style.requiredDocumentCard} ${style.tableGridValid} ${index % 2 === 0 ? style.requiredDocumentCardAlternativeColor : ''} ${style.marginTop5}`}>
                                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{row?.documentType}</div>
                                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>{row?.requirement ?? ''}</div>
                                                        <div className={`${style.documentTextStyle} ${style.verticalAlignCenter}`}>Current & Valid</div>
                                                        <div className={`${style.verticalAlignCenter} ${style.validCheckIconWrap}`}>
                                                            <CheckCircleIcon className={style.validCheckIcon} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                                <div>
                                    {/* <ApplicationUserCard user={'Guest User'} applyingFor={'Contact'} /> */}
                                    <div>
                                        <DaysToComplete days={basicForm?.expiryDate !== null ? differenceInDays(new Date(basicForm?.expiryDate), new Date(format(new Date(), 'yyyy-MM-dd'))) : 0} />
                                    </div>
                                    <div className={style.marginTop10}>
                                        <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                                    </div>
                                    <div className={`${style.stickyContainer} ${isDoItLaterOpen ? style.hiddenStickyContainer : ""}`}>
                                        <Tooltip title={"Click to Open the Interactive Training Guide"} arrow>
                                            <div className={`${style.userGuideButton} ${style.marginTop}`} onClick={() => window.open(basicForm?.reappointmentType === "EXTENSION" ? 'https://xd.adobe.com/view/bdfc27b0-ef87-4661-b3d1-4a4c28a10e33-e8af/?fullscreen' : 'https://xd.adobe.com/view/45fcfe64-b36e-44d7-9c6e-73b3559e0618-10af/?fullscreen')}>Interactive Step-by-Step Training Guide</div>
                                        </Tooltip>
                                        <Tooltip title={"Click to Download the PDF Training Guidee"} arrow>
                                            <div className={`${style.userGuideButton} ${style.marginTop10}`} onClick={() => window.open(basicForm?.reappointmentType === "EXTENSION" ? 'https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Locum+Extension+application+User+Guide.pdf' : 'https://capm-prod-entity-mgmt-service.s3.ca-central-1.amazonaws.com/Locum+Renewal+application+User+Guide.pdf')}>PDF Step-by-Step Training Guide</div>
                                        </Tooltip>
                                        <Tooltip title={"Click to Save and Do It Later"} arrow>
                                            <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => setIsDoItLaterOpen(true)}>DO IT LATER</div>
                                        </Tooltip>
                                        <Tooltip title={"Click to Start the Application Now"} arrow>
                                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowPrivilegesForSign(true)}>GET STARTED NOW</div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isDoItLaterOpen && (
                            <DoItLaterDialog getIsOpen={getIsDoItLaterOpen} />
                        )}
                        {showPrivilegesForSign && (
                            <Dialog
                                isOpen={showPrivilegesForSign}
                                onClose={() => setShowPrivilegesForSign(false)}
                                className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                                canOutsideClickClose={false}
                                canEscapeKeyClose={false}
                            >
                                <div>
                                    <div className={Classes.DIALOG_BODY}>
                                        <div className={style.spaceBetween}>
                                            <div className={style.heading}>{`Sign Off On The Privileges For Your Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'} Period`}</div>
                                            <div className={style.displayInRow}>
                                                <img
                                                    src={CrossPink}
                                                    alt="cross"
                                                    className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft} `}
                                                    onClick={() => {
                                                        setShowPrivilegesForSign(false);
                                                        setIndexForSign(0);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {!showAdditionalPrivileges ? (
                                            <>
                                                <div>{getFieldsForSign(selectedPrivilegeForDisplay?.[indexForSign]?.id, indexForSign, selectedPrivilegeForDisplay?.[indexForSign], 'Basic')}</div>
                                                <div
                                                    className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                                >
                                                    <Tooltip title={"Click to Continue"} arrow>
                                                        <div
                                                            className={`${style.reappointmentButton} ${style.marginLeft} ${(((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                ?.restrictedPrivileges?.esign !== null &&
                                                                selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== undefined) ||
                                                                selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.privilegesByCategories?.length ===
                                                                0 ||
                                                                (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                    ?.privileges?.length === 0 &&
                                                                    selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                        ?.privileges?.length !== undefined)) &&
                                                                ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.corePrivileges?.esign !== null &&
                                                                    selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.esign !== undefined) ||
                                                                    selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                                                                    (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                                                                        ?.length === 0 &&
                                                                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.privilegesByCategories?.[0]
                                                                            ?.privileges?.length !== undefined)) && getIsRestrictedValuesFilled(selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                                ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                                ?.privileges))
                                                                ? ""
                                                                : style.disabledButton
                                                                }`}
                                                            onClick={
                                                                (((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== null &&
                                                                    selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign !== undefined) ||
                                                                    selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.privilegesByCategories?.length ===
                                                                    0 ||
                                                                    (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                        ?.privileges?.length === 0 &&
                                                                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                            ?.privileges?.length !== undefined)) &&
                                                                    ((selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.esign !== null &&
                                                                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.esign !== undefined) ||
                                                                        selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                                                                        (selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                                                                            ?.length === 0 &&
                                                                            selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                                ?.corePrivileges?.privilegesByCategories?.[0]
                                                                                ?.privileges?.length !== undefined)) && getIsRestrictedValuesFilled(selectedPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                                    ?.privileges))
                                                                    ? (selectedPrivilegeForDisplay?.length + selectedAdditionalPrivilegeForDisplay?.length) === indexForSign + 1 ? () => {
                                                                        setShowPrivilegesForSign(false);
                                                                        // handleSelectedPrivilegesForDisplayMultiple(
                                                                        //   selectedPrivilegeForDisplay[indexForSign]
                                                                        // );
                                                                        handleSubmit();
                                                                        setIndexForSign(0)
                                                                    } : () => {
                                                                        if (selectedPrivilegeForDisplay?.length === indexForSign + 1) {
                                                                            setIndexForSign(0)
                                                                            setShowAdditionalPrivileges(true)
                                                                        } else {
                                                                            setIndexForSign(indexForSign + 1)
                                                                        }
                                                                    }
                                                                    : () => { }
                                                            }
                                                        >
                                                            {(selectedPrivilegeForDisplay?.length + selectedAdditionalPrivilegeForDisplay?.length) === indexForSign + 1 ? `CONTINUE` : 'NEXT'}
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>{getFieldsForSign(selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.id, indexForSign, selectedAdditionalPrivilegeForDisplay?.[indexForSign], 'Additional')}</div>
                                                <div
                                                    className={`${style.displayInRowRev} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                                >
                                                    <Tooltip title={"Click to Continue"} arrow>
                                                        <div
                                                            className={`${style.reappointmentButton} ${style.marginLeft} ${(((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                ?.restrictedPrivileges?.esign !== null &&
                                                                selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== undefined) ||
                                                                selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.privilegesByCategories?.length ===
                                                                0 ||
                                                                (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                    ?.privileges?.length === 0 &&
                                                                    selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                        ?.privileges?.length !== undefined)) &&
                                                                ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.corePrivileges?.esign !== null &&
                                                                    selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.esign !== undefined) ||
                                                                    selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                                                                    (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                                                                        ?.length === 0 &&
                                                                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.privilegesByCategories?.[0]
                                                                            ?.privileges?.length !== undefined)) && getIsAdditionalRestrictedValuesFilled(selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                                                                                ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                                ?.privileges))
                                                                ? ""
                                                                : style.disabledButton
                                                                }`}
                                                            onClick={
                                                                (((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                    ?.restrictedPrivileges?.esign !== null &&
                                                                    selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.esign !== undefined) ||
                                                                    selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.privilegesByCategories?.length ===
                                                                    0 ||
                                                                    (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                        ?.privileges?.length === 0 &&
                                                                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                            ?.privileges?.length !== undefined)) &&
                                                                    ((selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                        ?.corePrivileges?.esign !== null &&
                                                                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.esign !== undefined) ||
                                                                        selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.privilegesByCategories?.length === 0 ||
                                                                        (selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                            ?.corePrivileges?.privilegesByCategories?.[0]?.privileges
                                                                            ?.length === 0 &&
                                                                            selectedAdditionalPrivilegeForDisplay?.[0]?.privilegeDetails
                                                                                ?.corePrivileges?.privilegesByCategories?.[0]
                                                                                ?.privileges?.length !== undefined)) && getIsAdditionalRestrictedValuesFilled(selectedAdditionalPrivilegeForDisplay?.[indexForSign]?.privilegeDetails
                                                                                    ?.restrictedPrivileges?.privilegesByCategories?.[0]
                                                                                    ?.privileges))
                                                                    ? selectedAdditionalPrivilegeForDisplay?.length === indexForSign + 1 ? () => {
                                                                        setShowPrivilegesForSign(false);
                                                                        // handleSelectedPrivilegesForDisplayMultiple(
                                                                        //   selectedPrivilegeForDisplay[indexForSign]
                                                                        // );
                                                                        handleSubmit();
                                                                        setIndexForSign(0)
                                                                    } : () => {
                                                                        setIndexForSign(indexForSign + 1)
                                                                    }
                                                                    : () => { }
                                                            }
                                                        >
                                                            {selectedAdditionalPrivilegeForDisplay?.length === indexForSign + 1 ? `CONTINUE` : 'NEXT'}
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Dialog>
                        )}
                        {
                            isShowESignConfirmationDialog && (
                                <ESignConfirmationDialog
                                    getIsOpen={getIsOpenESignConfirmation}
                                    tempValue={basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data === null ? { setUpYourSignature: {}, table: [] } : basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data}
                                    baseKey={"setUpYourSignature"}
                                    applicationId={applicationId}
                                    basicForm={basicForm}
                                    setBasicForm={setBasicForm}
                                    updateFunc={updateFunc}
                                    confirmFunc={confirmESign}
                                    hideCross={true}
                                />
                            )
                        }
                        {
                            isShowESignDialog && (
                                <ESignDialog
                                    getIsOpen={getIsOpenESignDialog}
                                    tempValue={basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data === null ? { setUpYourSignature: {}, table: [] } : basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')]?.data}
                                    baseKey={"setUpYourSignature"}
                                    applicationId={applicationId}
                                    basicForm={basicForm}
                                    setBasicForm={setBasicForm}
                                    getPreApplication={getPreApplication}
                                    hideCross={true}
                                >
                                    {uploadFormSchema !== undefined &&
                                        "setUpYourSignature" in uploadFormSchema?.properties && (
                                            <ApplicationFieldCard
                                                object={uploadFormSchema?.properties?.setUpYourSignature}
                                                gridStyle={style.twoCol}
                                                baseKey={"setUpYourSignature"}
                                                basicForm={basicForm}
                                                setBasicForm={setBasicForm}
                                                stepPath={`forms[${basicForm?.forms?.findIndex(data => data?.schemaCategory === 'UploadYourDoc')}].data`}
                                                setIsEdited={() => { }}
                                            />
                                        )}
                                </ESignDialog>
                            )
                        }
                    </div >
                </>
            )}
        </div>
    )
}

export default LocumApplicationFormRequirement;
