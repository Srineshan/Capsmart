import React, { useEffect, useState } from 'react';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import { GET, POST, PUT } from '../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import { Dialog, Classes } from '@blueprintjs/core';
import SaveInProgressDialog from '../../Components/SaveInProgressDialog';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WelcomeCard from '../../Components/WelcomeCard';
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import CommonDivider from '../../Components/CommonFields/CommonDivider';
import ESignature from '../../Components/ESignature';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import { format } from 'date-fns';
import TableTwo from '../../Components/TableDesignTwo';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { Tooltip } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import Close from '../../images/close.png';
import BlueSign from "../../images/blueSign.png";
import HapiCare from "../../images/PoweredHapiCare.png";
import PhoneIcon from "../../images/phoneIcon.png";
import MailIcon from "../../images/mailIcon.png";
import journeyImg from "../../images/MDJourney.png";
import DefaultUserAvatar from "../../images/defaultUserLogo.jpg";
import FileDisplayDialog from '../../Components/fileDisplayDialog';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationHeader from '../../Components/ApplicationHeader';
import { useDescope } from '@descope/react-sdk';

const MDRequestAttest = ({ name }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const [showMedicalDirectives, setShowMedicalDirectives] = useState(false)
    const [medicalDirectivesStatus, setMedicalDirectivesStatus] = useState('')
    const [medicalDirectives, setMedicalDirectives] = useState([])
    const [allMedicalDirectives, setAllMedicalDirectives] = useState([])
    const { entityId } = useParams()
    const [formIndex, setFormIndex] = useState();
    const [selectedFile, setselectedFile] = useState(false);
    const navigate = useNavigate()
    const { logout } = useDescope();
    const [isChecked, setIsChecked] = useState(false);
    const [basicForm, setBasicForm] = useState({})
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [formContent, setFormContent] = useState();
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState(format(new Date(), 'MMM dd, yyyy'));
    const [userData, setUserData] = useState();
    const [selectedMedicalDirectiveList, setSelectedMedicalDirectiveList] = useState();
    const [selectedIds, setSelectedIds] = useState([]);
    const [attestClicked, setAttestClicked] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
    const title = sessionStorage.getItem('title')
    const [isShowCompletedDialog, setIsShowCompletedDialog] = useState(false);
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(users?.userName + dateTime, publicKey).toString());

    console.log(users, 'users')

    useEffect(() => {
        if (entityId)
            cookie.set("entityId", entityId, { path: "/", });
    }, [entityId])

    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }

        setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
        setIsChecked(basicForm?.forms?.[formIndex]?.acknowledged);
    }, [basicForm, formIndex])

    useEffect(() => {
        getRenderedContent()
    }, [formSchema])

    useEffect(() => {
        getMedicalDirectives()
    }, [entityId, basicForm])

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

    // useEffect(() => {
    //     if (medicalDirectives && allMedicalDirectives) {
    //         if (medicalDirectives?.length === allMedicalDirectives?.completed?.length) {
    //             setShowMedicalDirectives(true)
    //             setMedicalDirectivesStatus('completed')
    //             setSelectedMedicalDirectiveList(allMedicalDirectives?.completed)
    //         }
    //     }
    // }, [])

    const handleView = (data) => {
        setselectedFile(data?.medicalDirective?.file)
        setShowFileDisplayDialog(true);
    }

    const handleSign = (data) => {
        handleEdit(data);
    }

    const actions = [
        { 'data': 'View', 'requiredValue': 'boolean', "onClick": handleView },
        { 'data': 'Review & Sign', 'requiredValue': 'boolean', "onClick": handleSign },
    ]

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
        setUserData(userData)
    }



    const getIsValidationDialogOpen = (value) => {
        setShowValidationDialog(value);
    }

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, 'Metadata')
            temp.push(data);
        }
        setMetadata(temp);
    }

    const getAllLabels = (data) => {
        let tempLabels = labels;
        if (!tempLabels?.includes(data)) {
            console.log(tempLabels, data, 'Metadata')
            tempLabels.push(data);
        }
        setLabels(tempLabels);
    }

    // const getPreApplication = async () => {
    //     const { data: basicForm } = await GET(
    //         `application-management-service/application/${applicationId}`
    //     );
    //     setBasicForm(basicForm)
    // }

    const getRenderedContent = async () => {
        const { data: content } = await GET(
            `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}/render`
        );
        setFormContent(content)
    }

    const getIsShowFileDialog = (value) => {
        setShowFileDisplayDialog(value);
    }

    const handleIsChecked = (value) => {
        setIsEdited(true)
        setIsChecked(value)
        if (!value) {
            setIsSigned(false)
        }
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const getMedicalDirectives = async () => {
        if (entityId !== undefined) {
            const { data: medicalDirectives } = await GET(
                `medical-directive-service/medicalDirectives/byUser`
            );
            setAllMedicalDirectives(medicalDirectives)
            let temp = [...medicalDirectives?.completed, ...medicalDirectives?.pending, ...medicalDirectives?.reviewInprogress, ...medicalDirectives?.pastDue]
            setMedicalDirectives(temp)
            console.log(medicalDirectives, 'medicalDirectives')
            console.log(allMedicalDirectives, 'medicalDirectives123')
            console.log(...medicalDirectives?.completed, 'medicalDirectivesssss')
        } else {
            console.warn("Get Medical Directives Error");
        }
    }

    const handleSubmitAttestBulk = async () => {
        let temp = {
            user: {
                id: userData?.id,
                name: userData?.name,
                email: userData?.email
            },
            // application: {
            //     id: applicationId
            // },
            medicalDirectiveIds: selectedIds,
            esign: {
                esign: encryptedText,
                name: `${users?.userName}`,
                signedDate: currentDate
            }
        }
        await POST(`medical-directive-service/medicalDirectives/attest/bulk`, temp)
            .then(response => {
                getMedicalDirectives();
                console.log(response, response?.response?.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const getIsSubmitClicked = (value, data, skip) => {
        if (value) {
            handleSubmitApplicationReq(data, skip)
        }
    }

    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/" });
        logout()
        navigate('/')
    }

    const removeEmptyStrings = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "string" && obj[key].trim() === "") {
                delete obj[key];
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                removeEmptyStrings(obj[key]);
            }
        });
        return obj;
    };

    const generateRandomId = () => {
        return `id-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    };

    const handleSubmitApplicationReq = async (data, skip) => {
        // let missingFields = []
        // let emptyStringCheckedObject = removeEmptyStrings(data?.forms?.[formIndex]?.data);
        // let tempValidation = {
        //     schemaId: data?.forms?.[formIndex]?.schemaId,
        //     data: emptyStringCheckedObject,
        // }
        // await POST(`application-management-service/application/validateForm`, tempValidation)
        //     .then(response => {
        //         console.log(response, response?.response?.data, 'missingFields')
        //         missingFields = (response?.data !== undefined && response?.data === true) ? [] : response?.response?.data;
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        // let temp = {
        //     schemaId: data?.forms?.[formIndex]?.schemaId,
        //     data: data?.forms?.[formIndex]?.data,
        //     unFilledFields: missingFields,
        //     acknowledged: missingFields?.length !== 0 ? false : true
        // }
        // await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
        //     .then(response => {
        //         console.log(response)
        //         SuccessToaster("Application Updated Successfully");
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //         ErrorToaster("Unexpected Error Updating Application");
        //     })
    }

    useEffect(() => {
        console.log("1111111111", allMedicalDirectives?.completed?.medicalDirective?.title)
    }, [])


    const handleContinue = async () => {
        // if (isSigned) {
        console.log(medicalDirectives)
        const totalCount = (allMedicalDirectives?.completed?.length || 0) +
            (allMedicalDirectives?.pastDue?.length || 0) +
            (allMedicalDirectives?.pending?.length || 0) +
            (allMedicalDirectives?.reviewInprogress?.length || 0);

        const completedCount = allMedicalDirectives?.completed?.length || 0;
        let payload = medicalDirectives?.filter(data => data?.status === "COMPLETED")?.map((innerData, index) => ({
            // attestationDueDate: format(new Date(innerData?.dueDate), 'dd/MM/yyyy'),
            attestationDueDate: basicForm?.forms?.[formIndex]?.esign?.signedDate || currentDate,
            mdId: innerData?.medicalDirective?.mdID,
            title: innerData?.medicalDirective?.title,
            type: innerData?.medicalDirective?.creationType,
            rowId: generateRandomId(),
            fileURL: innerData?.medicalDirective?.file?.fileURL,
        }));
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: {
                table: payload,
            },
            unFilledFields: completedCount === totalCount ? ["Completed"] : completedCount === 0 ? ["notYetStarted"] : ["inProgress"],
            acknowledged: true,
            esign: { esign: isSigned ? encryptedText : '', name: isSigned ? users?.userName : '', signedDate: isSigned ? currentDate : '' }
        }
        await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                if (sessionStorage.getItem('fromSummary') === "true") {
                    sessionStorage.removeItem('fromSummary')
                    navigate(-1);
                }
                else {
                    navigate(navigateURL)

                }
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
        // }
        // else {
        //     if (sessionStorage.getItem('fromSummary') === "true") {
        //         sessionStorage.removeItem('fromSummary')
        //         navigate(-1);
        //     }
        //     else {
        //         navigate(navigateURL)

        //     }
        // }
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    const handleEdit = (data) => {
        navigate(`/medicalDirectiveAttest/${entityId}/${data?.medicalDirective?.id}`)
    }

    const handleCheckboxClick = (id, innerData) => {
        console.log(innerData?.medicalDirective?.id, 'selectedIds')
        setSelectedIds(prevCheckedIds => {
            // Toggle the ID in the array
            return prevCheckedIds?.map(data => data?.id)?.includes(innerData?.medicalDirective?.id)
                ? prevCheckedIds.filter(checkedId => checkedId?.id !== innerData?.medicalDirective?.id)
                : [...prevCheckedIds, { id: innerData?.medicalDirective?.id }];
        });
        getMedicalDirectiveTable()
        // console.log("Idschecked" + checkedIds)
    };

    const handleBackClick = async () => {
        navigate(navigateBackURL)
    }

    console.log(selectedIds, 'selectedIds', selectedMedicalDirectiveList, selectedMedicalDirectiveList?.map(innerData => selectedIds?.map(data => data?.id).includes(innerData?.medicalDirective?.id)))

    const getMedicalDirectiveTable = () => {
        let temp = [];
        if (medicalDirectivesStatus !== 'completed') {
            temp.push({
                "type": "checkbox", "value": selectedMedicalDirectiveList?.map((innerData, innerIndex) =>
                    <CommonCheckBox
                        size="medium"
                        checked={true}
                        onChange={() => handleCheckboxClick(innerData?.medicalDirective?.id)}
                        key={`${innerData?.medicalDirective?.id}${innerIndex}`}
                    />)
            });
        }
        if (medicalDirectivesStatus === 'completed') {
            temp.push({
                "type": "icon", "icon": selectedMedicalDirectiveList?.map(innerData =>
                    <div className={`${innerData?.status === 'COMPLETED' ? style.iconBackgroundColorGreen : innerData?.status === 'INPROGRESS' ? style.iconBackgroundColorYellow : style.iconBackgroundColorRed} 
                ${style.verticalAlignCenter} ${style.justifyCenter}`}>
                        {innerData?.status === 'COMPLETED' ? (
                            <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                        ) : (
                            <WarningAmberIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                        )}
                    </div>
                    // <img src={BlueSign} alt="" className={style.blueSignImgStyle} onClick={() => { }} />
                ), 'isShowHoverText': false
            });
        }
        temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => innerData?.medicalDirective?.title), 'onClickFunction': handleEdit });
        temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => innerData?.medicalDirective?.mdID), 'onClickFunction': handleEdit });
        if (medicalDirectivesStatus === 'completed') {
            temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => innerData?.medicalDirective?.creationType), 'onClickFunction': handleEdit });
        }
        temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => format(new Date(innerData?.dueDate), 'dd/MM/yyyy')), 'onClickFunction': handleEdit });
        if (medicalDirectivesStatus !== 'completed') {
            // temp.push({
            //     "type": "icon", "icon": selectedMedicalDirectiveList?.map(innerData =>
            //         // <div className={`${style.sign} ${medicalDirectivesStatus === 'completed' ? style.disabled : ''}`} onClick={() => handleEdit(innerData)}>View, Review and Sign</div>
            //         <img src={BlueSign} alt="" className={`${style.blueSignImgStyle} ${style.disabled}`} onClick={() => handleEdit(innerData)} />
            //     ),
            //     // 'isShowHoverText': medicalDirectivesStatus === 'completed' ? false : true, 'hoverText': selectedMedicalDirectiveList?.map(innerData => 'Click to attest')
            // });
            temp.push({ type: "action", value: actions })
        }
        console.log(temp, selectedMedicalDirectiveList)
        return temp;
    }

    // const getIsEdited = (value) => {
    //     setIsEdited(value)
    // }
    console.log(medicalDirectives?.length === allMedicalDirectives?.completed?.length, medicalDirectives?.length, allMedicalDirectives?.completed)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`Medical Directives To Attest For ${users?.userName ? users?.userName : '{First Name Last Name}'}`} close={true} closeClick={() => handleLogout()} />

            <div className={style.screenPadding}>
                {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
                <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
                    <div>
                        <div>
                            <WelcomeCard title={<div dangerouslySetInnerHTML={{ __html: `<strong> Listed below are Medical Directives approved for use at the ${title} that you need to Review and Attest to.</strong> ` }} />}
                                description={<div dangerouslySetInnerHTML={{ __html: `` }} />} />
                        </div>
                        <div className={`${style.applicationCardStyle} ${style.marginTop} `}>
                            {!showMedicalDirectives ? allMedicalDirectives?.completed?.length !== undefined && (
                                <>
                                    {/* <div className={`${style.cardTitle} ${style.marginTop} `}>{allMedicalDirectives?.completed?.length !== 0 ? 'All Medical Directives applicable to me have been reviewed and Signed off.' : 'Medical Directives Review'}</div> */}
                                    {/* <CommonDivider /> */}
                                    {/* {allMedicalDirectives?.pending?.length !== 0 && ( */}
                                    {/* <div className={`${ style.pendingCard } ${ style.marginTop } ${ style.displayInRow } ${ style.cursorPointer } `} onClick={() => setShowMedicalDirectives(true)}>
                                    <div className={`${ style.iconBackgroundPending } ${ style.verticalAlignCenter } ${ style.justifyCenter } `}><WarningAmberIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                    <div className={style.marginLeft}>{allMedicalDirectives?.pending?.length} Pending</div>
                                </div> */}
                                    {/* )} */}
                                    {allMedicalDirectives?.pending?.length !== 0 && (
                                        <Tooltip title="Click to View and Attest Pending Medical Directives" arrow>
                                            <div className={`${style.pastDueCard} ${style.marginTop} ${style.displayInRow} ${style.cursorPointer} `} onClick={() => { setShowMedicalDirectives(true); setMedicalDirectivesStatus('pending'); setSelectedMedicalDirectiveList(allMedicalDirectives?.pending) }}>
                                                <div className={`${style.iconBackgroundPastDue} ${style.verticalAlignCenter} ${style.justifyCenter} `}><WarningAmberIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                                <div className={`${style.marginLeft} ${style.textTransform} `}>{allMedicalDirectives?.pending?.length} Pending For Attestation</div>
                                            </div>
                                        </Tooltip>
                                    )}
                                    {allMedicalDirectives?.reviewInprogress?.length !== 0 && (
                                        <Tooltip title="Click to View and Attest Review In Progress Medical Directives" arrow>
                                            <div className={`${style.reviewInProgressCard} ${style.marginTop} ${style.displayInRow} ${style.cursorPointer} `} onClick={() => { setShowMedicalDirectives(true); setMedicalDirectivesStatus('inprogress'); setSelectedMedicalDirectiveList(allMedicalDirectives?.reviewInprogress) }}>
                                                <div className={`${style.iconBackgroundReviewInProgress} ${style.verticalAlignCenter} ${style.justifyCenter} `}><WarningAmberIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                                <div className={`${style.marginLeft} ${style.textTransform} `}>{allMedicalDirectives?.reviewInprogress?.length} Review In- Progress</div>
                                            </div>
                                        </Tooltip>
                                    )}
                                    {allMedicalDirectives?.completed?.length !== 0 && (
                                        <div className={`${style.completedCard} ${style.marginTop} ${style.displayInRow} ${style.cursorPointer} `} onClick={() => { setShowMedicalDirectives(true); setMedicalDirectivesStatus('completed'); setSelectedMedicalDirectiveList(allMedicalDirectives?.completed) }}>
                                            <div className={`${style.iconBackgroundCompleted} ${style.verticalAlignCenter} ${style.justifyCenter} `}><CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                            <div className={`${style.marginLeft} ${style.textTransform} `}> {medicalDirectives?.length === allMedicalDirectives?.completed?.length ? 'All Medical Directives Attestation Completed & Up-To-Date' : `${allMedicalDirectives?.completed?.length} Completed`}</div>
                                        </div>
                                    )}
                                    {medicalDirectives?.length === allMedicalDirectives?.completed?.length && (
                                        <div className={`${style.description} ${style.marginTop} `}>You have no Medical Directives that requires your review and attestation at this time.</div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className={style.spaceBetween}>
                                        <div className={`${style.medicalDirectivesText} ${style.marginTop10} `}>{medicalDirectivesStatus === 'completed' ? 'Attested Medical Directives' : 'Medical Directives Requiring Your Attestation'}</div>
                                        {/* <div className={`${ style.attestButton } ${ style.displayInRow } ${ style.verticalAlignCenter } ${ style.justifyCenter }
                                         ${ selectedIds?.length !== 0 ? '' : style.disabledButton } `} onClick={selectedIds?.length !== 0 ? () => { setAttestClicked(true) } : () => { }}
                                    >
                                        <img src={WhiteSign} alt="" className={`${ style.whiteSignIcon } ${ style.marginRight } `} />Attest To All
                                    </div> */}
                                    </div>
                                    <div>
                                        {medicalDirectivesStatus === 'completed' ? (
                                            <TableTwo
                                                tableHeaderValues={[
                                                    "",
                                                    "Title",
                                                    "MD ID",
                                                    "Type",
                                                    "Attestation Date",
                                                    "",
                                                ]}
                                                tableDataValues={getMedicalDirectiveTable()}
                                                tableData={selectedMedicalDirectiveList}
                                                gridStyle={style.gridStyle}
                                                actions={[]}
                                                // scrollStyle={style.contractScrollStyle}
                                                tableSortValues={[]}
                                                heading={"There are no Record for you to manage"}
                                                onClickFunction={() => { }}
                                            />
                                        ) : (
                                            <TableTwo
                                                tableHeaderValues={[
                                                    <div className={`${style.sign} ${medicalDirectivesStatus === 'completed' ? style.disabled : ''} `} onClick={(e) => setSelectedIds(medicalDirectives?.length === selectedIds.length ? [] : selectedMedicalDirectiveList?.map(innerData => ({ id: innerData?.medicalDirective?.id })))}><Tooltip title={medicalDirectives?.length === selectedIds.length ? "Click to Remove All" : "Click to Select All"} arrow>{medicalDirectives?.length === selectedIds.length ? 'Reset' : 'Select All'}</Tooltip></div>,
                                                    // <CommonCheckBox
                                                    //     size="medium"
                                                    //     checked={selectedIds.length === selectedMedicalDirectiveList.length && selectedIds.length !== 0}
                                                    //     onChange={(e) => e.target.checked ? setSelectedIds(selectedMedicalDirectiveList?.map(innerData => ({ id: innerData?.medicalDirective?.id }))) : setSelectedIds([])}
                                                    // />,
                                                    "Title",
                                                    "MD ID",
                                                    // "Type",
                                                    "Attestation Due Date",
                                                    "Action",
                                                ]}
                                                tableDataValues={getMedicalDirectiveTable()}
                                                tableData={selectedMedicalDirectiveList}
                                                gridStyle={style.gridStyleWithCheckbox}
                                                actions={actions}
                                                // scrollStyle={style.contractScrollStyle}
                                                tableSortValues={[]}
                                                heading={"There are no Record for you to manage"}
                                                onClickFunction={() => { }}
                                                checkedIds={selectedIds?.map(data => data?.id)}
                                                handleCheckboxClick={handleCheckboxClick}
                                            />
                                        )}
                                    </div>
                                    {/* <div className={`${ style.spaceBetween } ${ style.marginTop } `}>
                                    <div className={`${ style.medicalDirectivesText } ${ style.marginTop10 } `}></div>
                                    <div className={`${ style.attestButton } ${ style.displayInRow } ${ style.verticalAlignCenter } ${ style.justifyCenter }
                                         ${ selectedIds?.length !== 0 ? '' : style.disabledButton } `} onClick={selectedIds?.length !== 0 ? () => { setAttestClicked(true) } : () => { }}
                                    >
                                        <img src={WhiteSign} alt="" className={`${ style.whiteSignIcon } ${ style.marginRight } `} />Attest To All
                                    </div>
                                </div> */}
                                    {(selectedIds.length !== 0) && (
                                        <div className={`${style.marginTop10} `}>
                                            <div>
                                                <div className={`${style.checkGrid} `}>
                                                    {formContent?.disclaimer?.content !== null && (
                                                        <CommonCheckBox checked={isChecked} onChange={(e) => { handleIsChecked(e.target.checked) }} bigCheckbox={true} />
                                                    )}
                                                    <div className={`${style.leftAlign} ${style.marginTop} `}>
                                                        {`I hereby confirm that by signing, I agree to the delegation and implementation of the Medical Directives and Delegated Acts used within the ${title} `}
                                                    </div>
                                                </div>
                                                {isChecked && (
                                                    <div className={style.twoCol}>
                                                        <div onClick={(isChecked) ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }}
                                                        >
                                                            <ESignature
                                                                userName={isSigned ? name : ""}
                                                                encData={isSigned ? encryptedText : ''}
                                                                showData={isSigned}
                                                                showDatais={true}
                                                                alternateSignature={users?.userName}
                                                            />
                                                        </div>
                                                        <div className={style.verticalAlignCenter}>
                                                            <div className={style.displayInRow}>
                                                                <div className={style.dateTitle}>Date: </div>
                                                                <div className={`${style.date} ${style.marginLeft} `}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className={style.threeColForButton}>
                            <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                                <div className={`${style.saveInProgress} ${style.marginTop} `} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div></Tooltip>
                            <Tooltip title={"Click to Continue"} arrow>
                                <div className={`${style.continue} ${style.marginTop} ${showMedicalDirectives ? isSigned ? '' : style.disabledButton : ''} `} onClick={showMedicalDirectives ? isSigned ? () => { handleSubmitAttestBulk(); setShowMedicalDirectives(false); } : () => { } : () => handleContinue()}>CONTINUE</div></Tooltip>
                        </div>
                    </div>
                    <div>
                        {!showInfo && (
                            <div>
                                <div className={`${style.toggleButton} ${isSaveInProgressOpen ? style.hidden : ""} `} onClick={() => setShowInfo(!showInfo)}>
                                    <MenuIcon className={style.toggleIcon} />
                                </div>
                                <div className={`${style.headerData} ${isSaveInProgressOpen ? style.hidden : ""} `}>
                                    <span style={{ marginLeft: '20px' }}>Confirm Your Medical Directives</span>
                                </div>
                            </div>
                        )}
                        <div>
                            <div className={`${style.infoContainer} ${showInfo ? style.show : ""} `}>
                                <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />

                                <div className={`${style.applicationUserCard} ${style.profileGrid} ${style.rowSpaceBetween}`}>
                                    {userData?.name?.firstName !== undefined && (
                                        <>
                                            <div >
                                                <img
                                                    src={DefaultUserAvatar}
                                                    alt="Profile Pic"
                                                    className={style.profilePic}
                                                />
                                            </div>
                                            <div
                                            >
                                                <div
                                                    className={`${style.nameStyle}`}
                                                >{`${userData?.name?.firstName} ${userData?.name?.lastName}`}</div>
                                                <div className={`${style.displayInRow} ${style.marginTop5} ${style.cursorPointer}`} onClick={() => window.location.href = `mailto:${userData?.email?.officialEmail}`}><img src={MailIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft10} ${style.purpleText}`}> {userData?.email?.officialEmail}</span> </div>
                                                <div className={`${style.displayInRow} ${style.marginTop5}`}><img src={PhoneIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft10}`}> {userData?.communication?.mobileNumber}</span> </div>
                                            </div>
                                        </>
                                    )
                                    }
                                </div >
                                <div className={style.marginTop}>
                                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                                </div>
                            </div>
                        </div>
                        <div className={`${style.stickyContainer} ${isSaveInProgressOpen ? style.hiddenStickyContainer : ""} `}>
                            {!showMedicalDirectives ? (
                                <>
                                    {/* <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                                        <div className={`${style.saveInProgress} ${style.marginTop10} `} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div></Tooltip> */}
                                    {medicalDirectives?.length === allMedicalDirectives?.completed?.length && (
                                        <Tooltip title={"Click to Continue"} arrow>
                                            <div className={`${style.continue} ${style.marginTop10} `} onClick={() => setIsShowCompletedDialog(true)}>CONTINUE</div></Tooltip>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Tooltip title={"Click to go back"} arrow>
                                        <div className={`${style.saveInProgress} ${style.marginTop10} `} onClick={() => setShowMedicalDirectives(false)}>BACK</div></Tooltip>
                                    {medicalDirectivesStatus !== 'completed' && (
                                        <Tooltip title={showMedicalDirectives ? isSigned ? "Click to Continue" : "" : ""} arrow>
                                            <div className={`${style.continue} ${style.marginTop10} ${showMedicalDirectives ? isSigned ? '' : style.disabledButton : ''} `} onClick={showMedicalDirectives ? isSigned ? () => { handleSubmitAttestBulk(); setShowMedicalDirectives(false); } : () => { } : () => { }}>CONTINUE</div></Tooltip>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                </div>
                {
                    isSaveInProgressOpen && (
                        <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                    )
                }
                {showFileDisplayDialog && (
                    <FileDisplayDialog
                        getIsOpen={getIsShowFileDialog}
                        file={selectedFile}
                    />
                )}
                <Dialog
                    isOpen={isShowCompletedDialog}
                    onClose={() => setIsShowCompletedDialog(false)}
                    className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                    canOutsideClickClose={false}
                    canEscapeKeyClose={false}
                >
                    <div>
                        <div className={Classes.DIALOG_BODY}>
                            <div className={style.spaceBetween}>
                                <div className={style.heading}>
                                    Great Job! You Are Done With Medical Directives For Now!
                                </div>
                            </div>

                            <div>
                                <img src={journeyImg} alt="" className={style.journeyImgStyle} />
                            </div>
                            <div className={style.justifyCenter}>
                                <div
                                    className={`${style.continueValidation}`}
                                    onClick={() => {
                                        handleLogout(false);
                                    }}
                                >
                                    OKAY
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
            <div>
                <div className={`${style.footerContainer} `}>
                    <img
                        src={HapiCare}
                        alt="footer"
                        className={style.footerIconStyle}
                    />
                    <p className={style.poweredBy}>
                        © {new Date().getFullYear()} HapiCare, Inc
                    </p>
                </div>

            </div>
        </div>
    )
}

export default MDRequestAttest;
