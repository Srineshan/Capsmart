import React, { useState } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Cookie from 'universal-cookie';
import style from './index.module.scss'
import { POST, PUT } from '../../Screens/dataSaver';
import Pencil from "./../../images/pencil.png";
import { ErrorToaster, SuccessToaster } from '../../utils/toaster';
import WarningIcon from '@mui/icons-material/Warning';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationSubmitDialog from '../../Components/ApplicationSubmitDialog';
import { useDescope } from '@descope/react-sdk';
import { Tooltip } from '@mui/material';

const ReappointmentJourneyDialog = ({ getIsOpen, title, basicForm, formIndex, img, continueClick }) => {
    const [isContinue, setIsContinue] = useState(false);
    const { applicationId, section, step } = useParams();
    const { logout } = useDescope();
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [errorSchema, setErrorSchema] = useState('');
    const entityName = sessionStorage.getItem('title')
    const navigate = useNavigate()
    const [disclosureList, setDisclosureList] = useState(['ProfessionalConduct', 'CriminalHistory', 'MedicalHistory', 'PATIENT_CONCERN_DISCLOSURE', 'PRIVILEGE_STATUS_AT_HOSPITAL'])
    const getIsShowSubmitDialog = (value) => {
        setShowSubmitDialog(value);
    }

    const getIsDocRequired = (shortName) => {
        let documentData = basicForm?.documentsRequired?.filter(data => data?.document?.shortName === shortName)?.[0]
        if (!documentData?.departmentSpecific) {
            return documentData?.documentType?.shortName === "Profile Picture" ? "Optional" : documentData?.required ? 'Required' : 'Recommended';
        } else {
            if (documentData?.document?.shortName === "Profile Picture") {
                return "Optional";
            } else {
                let isDepartmentMatching = documentData?.departments?.map(deptData => deptData?.department?.id)?.includes(basicForm?.basicDetailReferences?.department?.id)
                if (isDepartmentMatching) {
                    if (documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialitySpecific) {
                        let isSpecialtyMatching = documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.map(specialtyData => specialtyData?.specialty?.id)?.includes(basicForm?.basicDetailReferences?.specialty?.id);
                        if (isSpecialtyMatching) {
                            return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.specialities?.filter(specialtyData => specialtyData?.specialty?.id === basicForm?.basicDetailReferences?.specialty?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        } else {
                            return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                        }
                    } else {
                        return documentData?.departments?.filter(deptData => deptData?.department?.id === basicForm?.basicDetailReferences?.department?.id)?.[0]?.required ? 'Required' : 'Recommended';
                    }
                } else {
                    return documentData?.required ? 'Required' : 'Recommended';
                }
            }
        }
    }

    const uploadDocForm = basicForm?.forms?.find(form => form?.schemaCategory === 'UploadYourDoc');
    const demographicData = basicForm?.forms?.find(form => form?.schemaCategory === 'DemographicData');
    const professionalConductDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'ProfessionalConduct');
    const criminalHistoryDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'CriminalHistory');
    const medicalHistoryDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'MedicalHistory');
    const privilegeAtOtherHosiptalDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'PRIVILEGE_STATUS_AT_HOSPITAL');
    const patientConcernDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE');
    const CMETranscripts = basicForm?.forms?.find(form => form?.schemaCategory === 'CME');
    const medicalDirectives = basicForm?.forms?.find(form => form?.schemaCategory === 'MEDICAL_DIRECTIVES');
    const MiscellaneousQuestion = basicForm?.forms?.find(form => form?.schemaCategory === 'MISCELLANEOUS_QUESTIONS');
    const ScheduleA = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleA');
    const ScheduleB = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleB');


    const unFilledFields = uploadDocForm?.unFilledFields ?? [];
    const documentsRequired = basicForm?.documentsRequired ?? [];
    const requiredDocNames = documentsRequired?.filter(doc => getIsDocRequired(doc?.document?.shortName) === "Required")?.map(doc => doc?.document?.shortName);
    const missingRequiredDocs = requiredDocNames?.filter(name => unFilledFields?.includes(name));

    const demographicDataUnfilledFields = demographicData?.unFilledFields ?? [];
    let hasMandatoryTrueDemoGraphicData = demographicDataUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory === true);
    let hasMandatoryFalseDemoGraphicData = demographicDataUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory !== true);


    const professionalConductUnfilledFields = professionalConductDisclosure?.unFilledFields ?? [];
    let hasMandatoryTrueprofessionalConduct = professionalConductUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory === true);
    let hasMandatoryFalseprofessionalConduct = professionalConductUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);


    const criminalHistoryUnfilledFields = criminalHistoryDisclosure?.unFilledFields ?? [];
    let hasMandatoryTruecriminalHistory = criminalHistoryUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory === true);
    let hasMandatoryFalsecriminalHistory = criminalHistoryUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);


    const medicalHistoryUnfilledFields = medicalHistoryDisclosure?.unFilledFields ?? [];
    let hasMandatoryTruemedicalHistory = medicalHistoryUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory === true);
    let hasMandatoryFalsemedicalHistory = medicalHistoryUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);

    const privilegeAtOtherHosiptalUnfilledFields = privilegeAtOtherHosiptalDisclosure?.unFilledFields ?? [];
    let hasMandatoryTrueprivilegeAtOtherHosiptal = privilegeAtOtherHosiptalUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory === true);
    let hasMandatoryFalseprivilegeAtOtherHosiptal = privilegeAtOtherHosiptalUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);


    const patientConernUnfilledFields = patientConcernDisclosure?.unFilledFields ?? [];
    let hasMandatoryTruepatientConern = patientConernUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory === true);
    let hasMandatoryFalsepatientConern = patientConernUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);

    const CMEUnfilledFields = CMETranscripts?.unFilledFields ?? [];
    let hasMandatoryTrueCME = CMEUnfilledFields?.includes("notYetStarted");
    let hasMandatoryFalseCME = CMEUnfilledFields?.includes("inProgress");

    const medicalDirectivesUnfilledFields = medicalDirectives?.unFilledFields ?? [];
    // let hasMandatoryTruemedicalDirectives = medicalDirectivesUnfilledFields?.filter(field => field === "notYetStarted" || field === "inProgress");
    let hasMandatoryTruemedicalDirectives = medicalDirectivesUnfilledFields?.includes("notYetStarted");
    let hasMandatoryFalsemedicalDirectives = medicalDirectivesUnfilledFields?.includes("inProgress");

    const MiscellaneousQuestionUnfilledFields = MiscellaneousQuestion?.unFilledFields ?? [];
    let hasMandatoryTrueMiscellaneousQuestion = MiscellaneousQuestionUnfilledFields?.filter(field => JSON.parse(field)?.label?.mandatory === true);
    let hasMandatoryFalseMiscellaneousQuestion = MiscellaneousQuestionUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);

    const ScheduleAUpdate = ScheduleA?.unFilledFields ?? [];
    const ScheduleBUpdate = ScheduleB?.unFilledFields ?? [];
 
   
    let hasMissingScheduleA = ScheduleAUpdate?.includes("skipped");
    let hasMissingScheduleB = ScheduleBUpdate?.includes("skipped");

    // const isSubmissionBlocked = missingRequiredDocs?.length !== 0 || hasMandatoryTrueDemoGraphicData?.length !== 0 || hasMandatoryTrueprofessionalConduct?.length !== 0 || hasMandatoryTruecriminalHistory?.length !== 0 || hasMandatoryTruemedicalHistory?.length !== 0 || hasMandatoryTrueprivilegeAtOtherHosiptal !== 0 || hasMandatoryTruepatientConern !== 0 || hasMandatoryTrueCME || hasMandatoryTruemedicalDirectives || hasMandatoryTrueMiscellaneousQuestion !== 0
    // const isSubmissionBlocked = missingRequiredDocs?.length !== 0 || hasMandatoryTrueDemoGraphicData?.length !== 0 || hasMandatoryTrueprofessionalConduct?.length !== 0 || hasMandatoryTruecriminalHistory?.length !== 0 || hasMandatoryTruemedicalHistory?.length !== 0 || hasMandatoryTrueprivilegeAtOtherHosiptal !== 0 || hasMandatoryTruepatientConern !== 0
    const isSubmissionBlocked = missingRequiredDocs?.length !== 0 || hasMandatoryTrueDemoGraphicData?.length !== 0 || hasMandatoryTrueprofessionalConduct?.length !== 0 || hasMandatoryTruecriminalHistory?.length !== 0 || hasMandatoryTruemedicalHistory?.length !== 0 || hasMandatoryTrueprivilegeAtOtherHosiptal?.length !== 0 || hasMandatoryTruepatientConern?.length !== 0 || hasMandatoryTrueCME || hasMandatoryTruemedicalDirectives || hasMandatoryTrueMiscellaneousQuestion.length !== 0 || hasMissingScheduleA || hasMissingScheduleB
 
    const handleLogout = () => {
        var cookies = new Cookie();
        cookies.remove("user", { path: "/" });
        cookies.remove("entityId", { path: "/" });
        cookies.remove("authorization", { path: "/" });
        logout()
        navigate('/')
    }


    const handleSubmitApplication = async () => {
        if ((sessionStorage.getItem('taskId') !== undefined && sessionStorage.getItem('taskId') !== 'undefined' && sessionStorage.getItem('taskId') !== null) && (sessionStorage.getItem('taskStatus') !== undefined && sessionStorage.getItem('taskStatus') !== 'undefined' && sessionStorage.getItem('taskStatus') !== null && sessionStorage.getItem('taskStatus') === "ON_GOING")) {
            await PUT(`task-management-service/task/${sessionStorage.getItem('taskId')}/updateStatus?status=COMPLETED`)
        }
        await POST(`application-management-service/application/${applicationId}/submit`)
            .then(response => {
                console.log(response)
                if (response?.response?.status !== 422) {
                    setShowSubmitDialog(true)
                } else {
                    // ErrorToaster("Submission failed! Fill all mandatory values.");
                    setErrorSchema(response?.response?.data)
                }
                // SuccessToaster("Application Submitted Successfully");
            })
            .catch((error) => {
                console.log(error)
                // ErrorToaster("Unexpected Error Submitting Application");
            });
    }

    console.log(basicForm?.forms?.filter((data, index) => data?.schemaCategory === errorSchema)?.[0]?.title, errorSchema)
    return (
        <>
            <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog} ${style.eSignDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>{title}</div>
                            {/* {errorSchema !== '' && (
                                <div className={style.displayInRow}>
                                    <div className={style.completedItemsTextRed} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms?.filter((data, index) => data?.schemaCategory === errorSchema)?.[0]?.formCategory}/${btoa(basicForm?.forms?.filter((data, index) => data?.schemaCategory === errorSchema)?.[0]?.schemaCategory)}`); getIsOpen(false) }}>{basicForm?.forms?.filter((data, index) => data?.schemaCategory === errorSchema)?.[0]?.title}</div>
                                </div>
                            )} */}
                        </div>
                        <div className={`${style.twoCol} ${style.marginTop}`}>
                            <div className={`${style.imageCard} ${style.verticalAlignCenter}`}>
                                <img src={img} alt="step" className={style.journeyImg} />
                            </div>
                            <div className={`${style.contentCard} ${style.verticalSpaceBetween}`}>
                                <div>
                                    {basicForm?.forms?.map((data, index) => (formIndex >= index) && (
                                        <>
                                            {data?.schemaCategory === 'ProfessionalConduct' && (
                                                <>
                                                    <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText}`}>Disclosures</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div>
                                                </>
                                            )}
                                            <div className={style.spaceBetween}>
                                                <div className={style.displayInRow}>
                                                    <div>
                                                        <div className={`${(!data?.acknowledged || errorSchema === data?.schemaCategory || (data?.schemaCategory === 'UploadYourDoc' && missingRequiredDocs?.length !== 0) ||(data?.schemaCategory === 'DemographicData' && hasMandatoryTrueDemoGraphicData?.length !== 0) || (data?.schemaCategory === 'ProfessionalConduct' && hasMandatoryTrueprofessionalConduct?.length !== 0) || (data?.schemaCategory === 'CriminalHistory' && hasMandatoryTruecriminalHistory?.length !== 0) || (data?.schemaCategory === 'MedicalHistory' && hasMandatoryTruemedicalHistory?.length !== 0) || (data?.schemaCategory === 'PRIVILEGE_STATUS_AT_HOSPITAL' && hasMandatoryTrueprivilegeAtOtherHosiptal?.length !== 0) || (data?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE' && hasMandatoryTruepatientConern?.length !== 0) || (data?.schemaCategory === 'MEDICAL_DIRECTIVES' && hasMandatoryTruemedicalDirectives) ||  (data?.schemaCategory === 'CME' && hasMandatoryTrueCME) || (data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS' && hasMandatoryTrueMiscellaneousQuestion?.length !== 0) || (data?.schemaCategory === 'ScheduleA' && hasMissingScheduleA) || (data?.schemaCategory === 'ScheduleB' && hasMissingScheduleB)) ? style.completedItemsTextRed : style.completedItemsText} ${disclosureList?.includes(data?.schemaCategory) ? style.marginLeft : ''}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`); getIsOpen(false) }}>{data?.title}</div>
                                                        {(data?.schemaCategory === 'UploadYourDoc' && missingRequiredDocs?.length !== 0) && (
                                                            data?.unFilledFields?.filter(innerData => missingRequiredDocs?.includes(innerData))?.map((innerData, innerIndex) => (
                                                                <div key={innerIndex} className={`${style.completedItemsTextRed} ${style.marginLeft}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/reappointmentApplicationForm/${applicationId}/Form/${btoa(data?.schemaCategory)}`); getIsOpen(false); }}>
                                                                    {innerData}
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                    {/* <img src={Pencil} alt="" className={`${style.pencilImgStyle} ${style.justifyCenter} ${style.cursorPointer}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`); getIsOpen(false) }} /> */}
                                                </div>
                                                {/* <div>{(!data?.acknowledged || errorSchema === data?.schemaCategory || (data?.schemaCategory === 'UploadYourDoc' && missingRequiredDocs?.length !== 0) || (data?.schemaCategory === 'DemographicData' && hasMandatoryTrueDemoGraphicData?.length !== 0) || (data?.schemaCategory === 'ProfessionalConduct' && hasMandatoryTrueprofessionalConduct?.length !== 0) || (data?.schemaCategory === 'CriminalHistory' && hasMandatoryTruecriminalHistory?.length !== 0) || (data?.schemaCategory === 'MedicalHistory' && hasMandatoryTruemedicalHistory?.length !== 0) || (data?.schemaCategory === 'PRIVILEGE_STATUS_AT_HOSPITAL' && hasMandatoryTrueprivilegeAtOtherHosiptal?.length !== 0) || (data?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE' && hasMandatoryTruepatientConern?.length !== 0) || (data?.schemaCategory === 'CME' && hasMandatoryTrueCME) ||  (data?.schemaCategory === 'MEDICAL_DIRECTIVES' && hasMandatoryTruemedicalDirectives) || (data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS' && hasMandatoryTrueMiscellaneousQuestion?.length !== 0) || (data?.schemaCategory === 'ScheduleA' && hasMissingScheduleA) || (data?.schemaCategory === 'ScheduleB' && hasMissingScheduleB)) ? <WarningIcon style={{ fontSize: 20, color: `#FF6562` }} /> : <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} />}</div> */}
                                                <div>
                                                {(!data?.acknowledged || errorSchema === data?.schemaCategory || 
                                                    (data?.schemaCategory === 'UploadYourDoc' && missingRequiredDocs?.length !== 0) || 
                                                    (data?.schemaCategory === 'DemographicData' && hasMandatoryTrueDemoGraphicData?.length !== 0) || 
                                                    (data?.schemaCategory === 'ProfessionalConduct' && hasMandatoryTrueprofessionalConduct?.length !== 0) || 
                                                    (data?.schemaCategory === 'CriminalHistory' && hasMandatoryTruecriminalHistory?.length !== 0) || 
                                                    (data?.schemaCategory === 'MedicalHistory' && hasMandatoryTruemedicalHistory?.length !== 0) || 
                                                    (data?.schemaCategory === 'PRIVILEGE_STATUS_AT_HOSPITAL' && hasMandatoryTrueprivilegeAtOtherHosiptal?.length !== 0) || 
                                                    (data?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE' && hasMandatoryTruepatientConern?.length !== 0) || 
                                                    (data?.schemaCategory === 'CME' && hasMandatoryTrueCME) ||  
                                                    (data?.schemaCategory === 'MEDICAL_DIRECTIVES' && hasMandatoryTruemedicalDirectives) || 
                                                    (data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS' && hasMandatoryTrueMiscellaneousQuestion?.length !== 0) || 
                                                    (data?.schemaCategory === 'ScheduleA' && hasMissingScheduleA) || 
                                                    (data?.schemaCategory === 'ScheduleB' && hasMissingScheduleB)
                                                ) ? (
                                                    <WarningIcon style={{ fontSize: 20, color: `#FF6562` }} />
                                                ) : (!data?.acknowledged || errorSchema === data?.schemaCategory || 
                                                    (data?.schemaCategory === 'UploadYourDoc' && unFilledFields?.length !== 0) ||
                                                    (data?.schemaCategory === 'DemographicData' && demographicDataUnfilledFields?.length !== 0) ||
                                                    (data?.schemaCategory === 'ProfessionalConduct' && professionalConductUnfilledFields?.length !== 0) ||
                                                    (data?.schemaCategory === 'CriminalHistory' && criminalHistoryUnfilledFields?.length !== 0) ||
                                                    (data?.schemaCategory === 'MedicalHistory' && medicalHistoryUnfilledFields?.length !== 0) ||
                                                    (data?.schemaCategory === 'PRIVILEGE_STATUS_AT_HOSPITAL' && privilegeAtOtherHosiptalUnfilledFields?.length !== 0) ||
                                                    (data?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE' && patientConernUnfilledFields?.length !== 0) ||
                                                    (data?.schemaCategory === 'CME' && hasMandatoryFalseCME) || 
                                                    (data?.schemaCategory === 'MEDICAL_DIRECTIVES' && hasMandatoryFalsemedicalDirectives) ||
                                                    (data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS' && MiscellaneousQuestionUnfilledFields?.length !== 0)
                                                )
                                                     ? (
                                                    <WarningIcon style={{ fontSize: 20, color: `#FFC107` }} />
                                                    ) : (
                                                    <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} />
                                                    )
                                                }
                                                </div>
                                            </div>
                                            {/* {data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS' && (
                                                <>
                                                    <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText} ${style.marginLeft}`}>LMS</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div>
                                                    <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText} ${style.marginLeft}`}>Prescribe Suboxone</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div>
                                                    <div className={style.spaceBetween}>
                                                        <div className={`${style.completedItemsText} ${style.marginLeft}`}>MRP</div>
                                                        <div>{data?.acknowledged ? <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} /> : <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} />}</div>
                                                    </div>
                                                </>
                                            )} */}
                                        </>
                                    ))}
                                </div>
                                <div className={style.marginTop}>
                                    {(formIndex < basicForm?.forms?.length - 1) ? (
                                        <>
                                            <div className={style.completedItemsText}>NEXT</div>
                                            <div className={style.nextItemText}>{basicForm?.forms[formIndex + 1]?.title}</div>
                                            <div className={` ${style.displayInRow} ${style.marginTop}`}>
                                            <Tooltip title={"Click to Save in Progress"} arrow>
                                                <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>SAVE IN PROGRESS</div></Tooltip>
                                                <Tooltip title={"Click to Continue"} arrow>
                                                <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); continueClick() }}>CONTINUE</div></Tooltip>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={` ${style.displayInRow} ${style.marginTop}`}>
                                            <Tooltip title={"Click to Logout"} arrow>
                                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); handleLogout() }}>LOGOUT</div></Tooltip>
                                            <Tooltip
                                                title="To submit you have to correct all errors and issues identified."
                                                arrow
                                                {...(!isSubmissionBlocked && { open: false })}
                                            >
                                                <div className={`${style.continue} ${style.marginLeft} ${isSubmissionBlocked ? style.disabledButton : ''}`} onClick={isSubmissionBlocked ? () => { } : () => { continueClick(); handleSubmitApplication() }}>SUBMIT</div>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </Dialog >

            {showSubmitDialog && (
                <ApplicationSubmitDialog getIsOpen={getIsShowSubmitDialog} title={`Mission Accomplished! You're A Champion`} description={`Please note that the entire application process for full board approval may take up to 3 months to complete.`} />
            )}
        </>
    )
}

export default ReappointmentJourneyDialog;