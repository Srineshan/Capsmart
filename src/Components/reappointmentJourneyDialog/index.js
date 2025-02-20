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
    const ScheduleA = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleA');
    const ScheduleB = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleB');
    const unFilledFields = uploadDocForm?.unFilledFields ?? [];
    const ScheduleAUpdate = ScheduleA?.unFilledFields ?? [];
    const ScheduleBUpdate = ScheduleB?.unFilledFields ?? [];
    const documentsRequired = basicForm?.documentsRequired ?? [];
    const requiredDocNames = documentsRequired?.filter(doc => getIsDocRequired(doc?.document?.shortName) === "Required")?.map(doc => doc?.document?.shortName);
    const missingRequiredDocs = requiredDocNames?.filter(name => unFilledFields?.includes(name));
    const hasMissingScheduleA = ScheduleAUpdate?.includes("skipped");
    const hasMissingScheduleB = ScheduleBUpdate?.includes("skipped");

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
                                                        <div className={`${(!data?.acknowledged || errorSchema === data?.schemaCategory || (data?.schemaCategory === 'UploadYourDoc' && missingRequiredDocs?.length !== 0) || (data?.schemaCategory === 'ScheduleA' && hasMissingScheduleA) || (data?.schemaCategory === 'ScheduleB' && hasMissingScheduleB)) ? style.completedItemsTextRed : style.completedItemsText} ${disclosureList?.includes(data?.schemaCategory) ? style.marginLeft : ''}`} onClick={() => { sessionStorage.setItem('fromSummary', true); navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`); getIsOpen(false) }}>{data?.title}</div>
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
                                                <div>{(!data?.acknowledged || errorSchema === data?.schemaCategory || (data?.schemaCategory === 'UploadYourDoc' && missingRequiredDocs?.length !== 0) || (data?.schemaCategory === 'ScheduleA' && hasMissingScheduleA) || (data?.schemaCategory === 'ScheduleB' && hasMissingScheduleB)) ? <WarningIcon style={{ fontSize: 20, color: `#FFAA00` }} /> : <CheckCircleRoundedIcon style={{ fontSize: 20, color: `#25BF6A` }} />}</div>
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
                                                <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); }}>SAVE IN PROGRESS</div>
                                                <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); continueClick() }}>CONTINUE</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={` ${style.displayInRow} ${style.marginTop}`}>
                                            <div className={`${style.saveInProgress}`} onClick={() => { getIsOpen(false); handleLogout() }}>LOGOUT</div>
                                            <Tooltip
                                                title="To submit you have to correct all errors and issues identified."
                                                arrow
                                                {...(missingRequiredDocs?.length === 0 && { open: false })}
                                            >
                                                <div className={`${style.continue} ${style.marginLeft} ${missingRequiredDocs?.length !== 0 ? style.disabledButton : ''}`} onClick={missingRequiredDocs?.length !== 0 ? () => { } : () => { continueClick(); handleSubmitApplication() }}>SUBMIT</div>
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