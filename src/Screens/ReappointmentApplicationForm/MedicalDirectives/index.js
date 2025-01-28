import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET, POST, PUT } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WelcomeCard from '../../../Components/WelcomeCard';
import CryptoJS from 'crypto-js';
import WhiteSign from "./../../../images/whiteSign.png";
import BlueSign from "./../../../images/blueSign.png";
import style from './index.module.scss';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import NoDataBox from '../../../Components/ReusableSmallComponents/noDataBox';
import ESignature from '../../../Components/ESignature';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import { format } from 'date-fns';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import TableTwo from '../../../Components/TableDesignTwo';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { Tooltip } from '@mui/material';
import MenuIcon from "@mui/icons-material/Menu";
import Close from './../../../images/close.png';

const MedicalDirectives = ({ basicForm, setBasicForm, applicationId, getPreApplication, dateFormat, name }) => {
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
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const navigate = useNavigate()
    const [isChecked, setIsChecked] = useState(false);
    const [navigateURL, setNavigateURL] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [formContent, setFormContent] = useState();
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState(format(new Date(), dateFormat));
    const [userData, setUserData] = useState();
    const [selectedMedicalDirectiveList, setSelectedMedicalDirectiveList] = useState();
    const [selectedIds, setSelectedIds] = useState([]);
    const [attestClicked, setAttestClicked] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const users = jwt(userDetails);
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`);
        }
        setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
        setIsChecked(basicForm?.forms?.[formIndex]?.acknowledged);
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

    useEffect(() => {
        getRenderedContent()
    }, [formSchema])

    useEffect(() => {
        getMedicalDirectives()
    }, [applicationId, basicForm])

    useEffect(() => {
        setUserDetails();
    }, [users?.id])

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

    const getRenderedContent = async () => {
        const { data: content } = await GET(
            `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}/render`
        );
        setFormContent(content)
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
        if (applicationId !== undefined) {
            const { data: medicalDirectives } = await GET(
                `medical-directive-service/medicalDirectives/application/${applicationId}?isNewAppointment=${basicForm?.creationType !== 'REAPPOINTMENT'}&isReAppointment=${basicForm?.creationType === 'REAPPOINTMENT'}&departmentId=${basicForm?.basicDetailReferences?.department !== null ? [basicForm?.basicDetailReferences?.department?.id] : []}&serviceAreaId=${basicForm?.basicDetailReferences?.specialty !== null ? [basicForm?.basicDetailReferences?.specialty?.id] : []}`
            );
            setAllMedicalDirectives(medicalDirectives)
            let temp = [...medicalDirectives?.completed, ...medicalDirectives?.pending, ...medicalDirectives?.reviewInprogress, ...medicalDirectives?.pastDue]
            setMedicalDirectives(temp)
            console.log(medicalDirectives, 'medicalDirectives')
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
            application: {
                id: applicationId
            },
            medicalDirectiveIds: selectedIds,
            esign: {
                esign: encryptedText,
                name: `${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `,
                signedDate: currentDate
            }
        }
        await POST(`medical-directive-service/medicalDirectives/attest/bulk`, temp)
            .then(response => {
                getMedicalDirectives();
                // navigate(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex]?.formCategory}/${basicForm?.forms[formIndex]?.schemaCategory}`)
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

    const getMissingFields = () => {
        let missingKeys = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index] })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        // if (missingKeys?.length !== 0) {
        //     setShowValidationDialog(true)
        // }
        // else {
        //     handleSubmitApplicationReq()
        // }
        setWarningFields(missingKeys)
        console.log(keyValuePair, 'Metadata', missingKeys)
        return missingKeys;
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

    const getSkipClicked = (value) => {
        if (value) {
            // handleSubmitApplicationReq("skipped")
            navigate(navigateURL);
        }
    }

    const generateRandomId = () => {
        return `id-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
    };

    const handleSubmitApplicationReq = async (data, skip) => {
        // if(isEdited){
        let missingFields = []
        let emptyStringCheckedObject = removeEmptyStrings(data?.forms?.[formIndex]?.data);
        let tempValidation = {
            schemaId: data?.forms?.[formIndex]?.schemaId,
            data: emptyStringCheckedObject,
        }
        await POST(`application-management-service/application/validateForm`, tempValidation)
            .then(response => {
                console.log(response, response?.response?.data, 'missingFields')
                missingFields = (response?.data !== undefined && response?.data === true) ? [] : response?.response?.data;
            })
            .catch((error) => {
                console.log(error)
            })
        let temp = {
            schemaId: data?.forms?.[formIndex]?.schemaId,
            data: data?.forms?.[formIndex]?.data,
            unFilledFields: missingFields,
            acknowledged: missingFields?.length !== 0 ? false : true
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication()
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            })
        // } 
    }

    useEffect(() => {
        console.log("1111111111", allMedicalDirectives?.completed?.medicalDirective?.title)
    }, [])


    const handleContinue = async () => {
        // if (isSigned) {
        console.log(medicalDirectives)
        let payload = medicalDirectives?.filter(data => data?.status === "COMPLETED")?.map((innerData, index) => ({
            attestationDueDate: format(new Date(innerData?.dueDate), 'dd/MM/yyyy'),
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
            acknowledged: isSigned,
            esign: { esign: isSigned ? encryptedText : '', name: isSigned ? name : '', signedDate: isSigned ? currentDate : '' }
        }
        await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                getPreApplication()
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
        navigate(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex]?.formCategory}/${btoa(basicForm?.forms[formIndex]?.schemaCategory)}/${data?.medicalDirective?.id}`)
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
        temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => innerData?.medicalDirective?.title), 'onClickFunction': handleEdit });
        temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => innerData?.medicalDirective?.mdID), 'onClickFunction': handleEdit });
        temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => innerData?.medicalDirective?.creationType), 'onClickFunction': handleEdit });
        temp.push({ "type": "text", "value": selectedMedicalDirectiveList?.map(innerData => format(new Date(innerData?.dueDate), 'dd/MM/yyyy')), 'onClickFunction': handleEdit });

        temp.push({
            "type": "icon", "icon": selectedMedicalDirectiveList?.map(innerData =>
                <div className={`${style.continue} ${medicalDirectivesStatus === 'completed' ? style.disabled : ''}`} onClick={() => handleEdit(innerData)}>SIGN</div>
                // <img src={BlueSign} alt="" className={`${style.blueSignImgStyle} ${medicalDirectivesStatus === 'completed' ? style.disabled : ''}`} onClick={() => handleEdit(innerData)} />
            ), 'isShowHoverText': medicalDirectivesStatus === 'completed' ? false : true, 'hoverText': selectedMedicalDirectiveList?.map(innerData => 'Click to attest')
        });
        console.log(temp, selectedMedicalDirectiveList)
        return temp;
    }

    // const getIsEdited = (value) => {
    //     setIsEdited(value)
    // }
    console.log(medicalDirectives?.length === allMedicalDirectives?.completed?.length, medicalDirectives?.length, allMedicalDirectives?.completed)

    return (
        <div>
            {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
            <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
                <div>
                    <ReappointmentProgressCard step={'STEP 4'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={8} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />
                    <div className={style.marginTop}>
                        <WelcomeCard title={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.label }} />}
                            description={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.description }} />} />
                    </div>
                    <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                        {!showMedicalDirectives ? allMedicalDirectives?.completed?.length !== undefined && (
                            <>
                                <div className={`${style.cardTitle} ${style.marginTop}`}>Medical Directives Review</div>
                                <CommonDivider />
                                {/* {allMedicalDirectives?.pending?.length !== 0 && ( */}
                                {/* <div className={`${style.pendingCard} ${style.marginTop} ${style.displayInRow} ${style.cursorPointer}`} onClick={() => setShowMedicalDirectives(true)}>
                                    <div className={`${style.iconBackgroundPending} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                    <div className={style.marginLeft}>{allMedicalDirectives?.pending?.length} Pending</div>
                                </div> */}
                                {/* )} */}
                                {allMedicalDirectives?.pending?.length !== 0 && (
                                    <Tooltip title="Click to attest" arrow>
                                        <div className={`${style.pastDueCard} ${style.marginTop} ${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setShowMedicalDirectives(true); setMedicalDirectivesStatus('pending'); setSelectedMedicalDirectiveList(allMedicalDirectives?.pending) }}>
                                            <div className={`${style.iconBackgroundPastDue} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                            <div className={`${style.marginLeft} ${style.textTransform}`}>{allMedicalDirectives?.pending?.length} Pending / Past Due</div>
                                        </div>
                                    </Tooltip>
                                )}
                                {allMedicalDirectives?.reviewInprogress?.length !== 0 && (
                                    <Tooltip title="Click to attest" arrow>
                                        <div className={`${style.reviewInProgressCard} ${style.marginTop} ${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setShowMedicalDirectives(true); setMedicalDirectivesStatus('inprogress'); setSelectedMedicalDirectiveList(allMedicalDirectives?.reviewInprogress) }}>
                                            <div className={`${style.iconBackgroundReviewInProgress} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                            <div className={`${style.marginLeft} ${style.textTransform}`}>{allMedicalDirectives?.reviewInprogress?.length} Review In- Progress</div>
                                        </div>
                                    </Tooltip>
                                )}
                                {allMedicalDirectives?.completed?.length !== 0 && (
                                    <div className={`${style.completedCard} ${style.marginTop} ${style.displayInRow} ${style.cursorPointer}`} onClick={() => { setShowMedicalDirectives(true); setMedicalDirectivesStatus('completed'); setSelectedMedicalDirectiveList(allMedicalDirectives?.completed) }}>
                                        <div className={`${style.iconBackgroundCompleted} ${style.verticalAlignCenter} ${style.justifyCenter}`}><CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#FFFFFF' }} /></div>
                                        <div className={`${style.marginLeft} ${style.textTransform}`}> {medicalDirectives?.length === allMedicalDirectives?.completed?.length ? 'All Medical Directives Completed & Up-To-Date' : `${allMedicalDirectives?.completed?.length} Completed`}</div>
                                    </div>
                                )}
                                {medicalDirectives?.length === allMedicalDirectives?.completed?.length && (
                                    <div className={`${style.description} ${style.marginTop}`}>You have attested to all of the Medical Directives.</div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className={style.spaceBetween}>
                                    <div className={`${style.medicalDirectivesText} ${style.marginTop10}`}>Medical Directives to Attest</div>
                                    {/* <div className={`${style.attestButton} ${style.displayInRow} ${style.verticalAlignCenter} ${style.justifyCenter}
                                         ${selectedIds?.length !== 0 ? '' : style.disabledButton}`} onClick={selectedIds?.length !== 0 ? () => { setAttestClicked(true) } : () => { }}
                                    >
                                        <img src={WhiteSign} alt="" className={`${style.whiteSignIcon} ${style.marginRight}`} />Attest To All
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
                                                <CommonCheckBox
                                                    size="medium"
                                                    checked={selectedIds.length === selectedMedicalDirectiveList.length && selectedIds.length !== 0}
                                                    onChange={(e) => e.target.checked ? setSelectedIds(selectedMedicalDirectiveList?.map(innerData => ({ id: innerData?.medicalDirective?.id }))) : setSelectedIds([])}
                                                />,
                                                "",
                                                "Title",
                                                "MD ID",
                                                "Type",
                                                "Attestation Due Date",
                                                "",
                                            ]}
                                            tableDataValues={getMedicalDirectiveTable()}
                                            tableData={selectedMedicalDirectiveList}
                                            gridStyle={style.gridStyleWithCheckbox}
                                            actions={[]}
                                            // scrollStyle={style.contractScrollStyle}
                                            tableSortValues={[]}
                                            heading={"There are no Record for you to manage"}
                                            onClickFunction={() => { }}
                                            checkedIds={selectedIds?.map(data => data?.id)}
                                            handleCheckboxClick={handleCheckboxClick}
                                        />
                                    )}
                                </div>
                                {/* <div className={`${style.spaceBetween} ${style.marginTop}`}>
                                    <div className={`${style.medicalDirectivesText} ${style.marginTop10}`}></div>
                                    <div className={`${style.attestButton} ${style.displayInRow} ${style.verticalAlignCenter} ${style.justifyCenter}
                                         ${selectedIds?.length !== 0 ? '' : style.disabledButton}`} onClick={selectedIds?.length !== 0 ? () => { setAttestClicked(true) } : () => { }}
                                    >
                                        <img src={WhiteSign} alt="" className={`${style.whiteSignIcon} ${style.marginRight}`} />Attest To All
                                    </div>
                                </div> */}
                                {(selectedIds.length === selectedMedicalDirectiveList.length || medicalDirectivesStatus === 'completed') && (
                                    <div className={`${style.marginTop10} `}>
                                        <div>
                                            <div className={`${style.checkGrid}`}>
                                                {formContent?.disclaimer?.content !== null && (
                                                    <CommonCheckBox checked={isChecked} onChange={(e) => { handleIsChecked(e.target.checked) }} bigCheckbox={true} />
                                                )}
                                                <div
                                                    className={`${style.leftAlign} ${style.marginTop}`}
                                                    dangerouslySetInnerHTML={{ __html: formContent?.disclaimer?.content }}
                                                />
                                            </div>
                                            {formSchemaWholeObject?.esignatureRequired && (
                                                <div className={style.twoCol}>
                                                    <div onClick={(isChecked) ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }}
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
                                                            <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
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
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop} ${showMedicalDirectives ? isSigned ? '' : style.disabledButton : ''}`} onClick={showMedicalDirectives ? isSigned ? () => { handleSubmitAttestBulk(); setShowMedicalDirectives(false); } : () => { } : () => handleContinue()}>CONTINUE</div>
                    </div>
                </div>
                <div>
                    {!showInfo && (
                        <div>
                            <div className={`${style.toggleButton} ${isSaveInProgressOpen ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                                <MenuIcon className={style.toggleIcon} />
                            </div>
                            <div className={`${style.headerData} ${isSaveInProgressOpen ? style.hidden : ""}`}>
                                <span style={{ marginLeft: '20px' }}>Confirm Your Medical Directives</span>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
                            <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
                            <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                            <div className={style.marginTop}>
                                <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                            </div>
                            <div className={style.marginTop}>
                                <ApplicationReferenceDocuments />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen ? style.hiddenStickyContainer : ""}`}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div>
                        <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={style.twoColForButton}>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                            <div className={`${style.continue} ${style.marginTop10} ${showMedicalDirectives ? isSigned ? '' : style.disabledButton : ''}`} onClick={showMedicalDirectives ? isSigned ? () => { handleSubmitAttestBulk(); setShowMedicalDirectives(false); } : () => { } : () => handleContinue()}>CONTINUE</div>
                        </div>
                    </div>

                </div>
            </div>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
            {/* {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
            )} */}
        </div>
    )
}

export default MedicalDirectives;
