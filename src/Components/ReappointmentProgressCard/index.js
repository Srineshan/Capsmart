import React, { useState, useEffect } from 'react'
import style from './index.module.scss'
import { Tooltip } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const ReappointmentProgressCard = ({ dataType, title, timeNumber, timeText, progressStyle, basicForm }) => {
    const [startTime, setStartTime] = useState(0);
    const [totalTime, setTotalTime] = useState(() => {
        // Retrieve stored time from localStorage or initialize it to 0
        const savedTime = localStorage.getItem('totalTime');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });
    const [formIndex, setFormIndex] = useState(0)
    const { applicationId, section, step } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        console.log(Math.floor(totalTime / 60000), totalTime)
    }, [totalTime])

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Tab has become visible, start the timer
                setStartTime(performance.now());
            } else {
                // Tab is out of focus, accumulate time spent in focus
                if (startTime) {
                    const newTotalTime = totalTime + (performance.now() - startTime);
                    setTotalTime(newTotalTime);
                    localStorage.setItem('totalTime', newTotalTime); // Save to localStorage
                    setStartTime(0);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            // Cleanup event listener on component unmount
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [startTime, totalTime]);

    useEffect(() => {
        const updateInterval = setInterval(() => {
            if (document.visibilityState === 'visible' && startTime) {
                const currentTime = performance.now();
                const newTotalTime = totalTime + (currentTime - startTime);
                setTotalTime(newTotalTime);
                setStartTime(currentTime); // Reset startTime to current time
            }
        }, 60000); // Update every minute

        return () => clearInterval(updateInterval); // Cleanup interval on unmount
    }, [startTime, totalTime]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (startTime) {
                const newTotalTime = totalTime + (performance.now() - startTime);
                localStorage.setItem('totalTime', newTotalTime); // Save to localStorage
                setTotalTime(newTotalTime);
            }
            console.log('Total time spent in focus:', Math.floor(totalTime / 60000), 'minutes');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [startTime, totalTime]);

    useEffect(() => {
        if (basicForm !== undefined) {
            setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)));
        }
    }, [step, basicForm])

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


    console.log(Math.floor(totalTime / 60000), totalTime, (formIndex / (basicForm?.forms?.length - 1)) * 100, 'progress', formIndex, basicForm?.forms?.length - 1, basicForm?.forms?.reduce(
        (maxIndex, step, index) => (step?.acknowledged ? index : maxIndex),
        -1
    ))
    return (
        <div className={style.progressCard}>
            <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                    <div className={style.stepTextStyle}>{`${formIndex + 1}/${basicForm?.forms?.length}`}</div>
                    <div className={`${style.titleTextStyle} ${style.marginLeft}`}>{title}</div>
                    {/* <div className={`${style.dataTypeCollectionsTextStyle}  ${step !== '' ? style.marginLeft : ''}`}>{dataType}</div> */}
                </div>
                {/* <div className={style.timeSpentText}>Time spent</div> */}
            </div>
            {/* <div className={`${style.spaceBetween} ${style.marginTop10}`}>
                <div className={`${style.displayInRow} ${style.flex}`}><span className={style.hourNumberStyle}>{Math.floor(totalTime / 60000)} </span><span className={`${style.hourTextStyle} ${style.textAlignBottom} ${style.marginLeft5}`}> {timeText}</span></div>
            </div> */}
            <div>
                <div className={`${style.progressStyle} ${style.marginTop10}  ${style.spaceBetween}`}
                    style={{ background: `transparent linear-gradient(90deg, #06617A 0%, #06617A ${(formIndex / (basicForm?.forms?.length - 1)) * 100}%, #E9E9F0 ${((formIndex / (basicForm?.forms?.length)) * 100) + (100 / basicForm?.forms?.length)}%, #E9E9F0 100%) 0% 0% no-repeat padding-box` }}
                >
                 
                {(basicForm?.forms ?? []).map((data, index) => {
                    let dotClass = `${style.disabledDotStyle} ${style.disabled}`;
                    
                    if (data?.acknowledged) {
                        const uploadDocForm = basicForm?.forms?.find(form => form?.schemaCategory === 'UploadYourDoc');
                        const demographicData = basicForm?.forms?.find(form => form?.schemaCategory === 'DemographicData');
                        const professionalConductDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'ProfessionalConduct');
                        const criminalHistoryDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'CriminalHistory');
                        const medicalHistoryDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'MedicalHistory');
                        const privilegeAtOtherHosiptalDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'PRIVILEGE_STATUS_AT_HOSPITAL');
                        const patientConcernDisclosure = basicForm?.forms?.find(form => form?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE');
                        const medicalDirectives = basicForm?.forms?.find(form => form?.schemaCategory === 'MEDICAL_DIRECTIVES');
                        const CMETranscripts = basicForm?.forms?.find(form => form?.schemaCategory === 'CME');
                        const MiscellaneousQuestion = basicForm?.forms?.find(form => form?.schemaCategory === 'MISCELLANEOUS_QUESTIONS');
                        const ScheduleA = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleA');
                        const ScheduleB = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleB');
                        const acknowledgment = basicForm?.forms?.find(form => form?.schemaCategory === 'ApplicantAcknowledgement');

                        const unFilledFields = uploadDocForm?.unFilledFields ?? [];
                        const documentsRequired = basicForm?.documentsRequired ?? [];
                        const demographicDataUnfilledFields = demographicData?.unFilledFields ?? [];
                        const professionalConductUnfilledFields = professionalConductDisclosure?.unFilledFields ?? [];
                        const criminalHistoryUnfilledFields = criminalHistoryDisclosure?.unFilledFields ?? [];
                        const medicalHistoryUnfilledFields = medicalHistoryDisclosure?.unFilledFields ?? [];
                        const privilegeAtOtherHosiptalUnfilledFields = privilegeAtOtherHosiptalDisclosure?.unFilledFields ?? [];
                        const patientConernUnfilledFields = patientConcernDisclosure?.unFilledFields ?? [];
                        const medicalDirectivesUnfilledFields = medicalDirectives?.unFilledFields ?? [];
                        const CMEUnfilledFields = CMETranscripts?.unFilledFields ?? [];
                        const MiscellaneousQuestionUnfilledFields = MiscellaneousQuestion?.unFilledFields ?? [];
                        const ScheduleAUpdate = ScheduleA?.unFilledFields ?? [];
                        const ScheduleBUpdate = ScheduleB?.unFilledFields ?? [];
                        const acknowledgmentUpdate = acknowledgment?.acknowledged ?? "";

                        dotClass = style.dotStyle;

                        if (data?.schemaCategory === 'UploadYourDoc') {
                            // const requiredDocNames = documentsRequired?.filter(doc => doc?.required).map(doc => doc?.document?.shortName);
                            const requiredDocNames = documentsRequired?.filter(doc => getIsDocRequired(doc?.document?.shortName) === "Required")?.map(doc => doc?.document?.shortName);
                            const missingRequiredDocs = requiredDocNames?.some(name => unFilledFields?.includes(name));
                            const unfilledOptionalDocs = unFilledFields?.filter(name => documentsRequired?.some(doc => doc?.document?.shortName === name && !doc?.required));
                            
                            // const missingRequiredDocs = requiredDocNames?.filter(name => unFilledFields?.includes(name));
                            
                            dotClass = missingRequiredDocs ? style.reddotStyle : unfilledOptionalDocs?.length > 0 ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'DemographicData') {
                            let hasMandatoryTrue = demographicDataUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory === true);
                            let hasMandatoryFalse = demographicDataUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'ProfessionalConduct') {
                            let hasMandatoryTrue = professionalConductUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory === true);
                            let hasMandatoryFalse = professionalConductUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'CriminalHistory') {
                            let hasMandatoryTrue = criminalHistoryUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory === true);
                            let hasMandatoryFalse = criminalHistoryUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'MedicalHistory') {
                            let hasMandatoryTrue = medicalHistoryUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory === true);
                            let hasMandatoryFalse = medicalHistoryUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'PRIVILEGE_STATUS_AT_HOSPITAL') {
                            let hasMandatoryTrue = privilegeAtOtherHosiptalUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory === true);
                            let hasMandatoryFalse = privilegeAtOtherHosiptalUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE') {
                            let hasMandatoryTrue = patientConernUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory === true);
                            let hasMandatoryFalse = patientConernUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'MEDICAL_DIRECTIVES') {
                            let hasMandatoryTrue = medicalDirectivesUnfilledFields?.includes("notYetStarted");
                            let hasMandatoryFalse = medicalDirectivesUnfilledFields?.includes("inProgress");
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'CME') {
                            let hasMandatoryTrue = CMEUnfilledFields?.includes("notYetStarted");
                            let hasMandatoryFalse = CMEUnfilledFields?.includes("inProgress");
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS') {
                            let hasMandatoryTrue = MiscellaneousQuestionUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory === true);
                            let hasMandatoryFalse = MiscellaneousQuestionUnfilledFields?.some(field => JSON.parse(field)?.label?.mandatory !== true);
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'ScheduleA') {
                            let hasMandatoryTrue = ScheduleAUpdate?.includes("skipped");
                            
                            dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'ScheduleB') {
                            let hasMandatoryTrue = ScheduleBUpdate?.includes("skipped");

                            dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                        } else if (data?.schemaCategory === 'ApplicantAcknowledgement') {
                            dotClass = acknowledgmentUpdate === true ? style.dotStyle : style.reddotStyle;
                        }
                    }

                    const handleClick = () => {
                        if (data?.acknowledged) {
                            navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`);
                        }
                    };

                    return (
                        <Tooltip title={data?.title} arrow key={index}>
                            <div
                                className={dotClass}
                                onClick={handleClick}
                            ></div>
                        </Tooltip>
                    );
                })}
                {/* {basicForm?.forms?.map((data, index) => (
                        <Tooltip title={data?.title} arrow>
                            <div className={data?.acknowledged ? style.dotStyle : (index < basicForm?.forms?.reduce((maxIndex, step, index) => (step?.acknowledged ? index : maxIndex), -1)) ? `${style.disabledDotStyle} ${style.cursorPointer}` : `${style.disabledDotStyle} ${style.disabled}`} onClick={(data?.acknowledged || index < basicForm?.forms?.reduce((maxIndex, step, index) => (step?.acknowledged ? index : maxIndex), -1)) ? () => navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`) : () => { }}></div>
                        </Tooltip>
                    ))} */}
             
                </div>
                {/* <div className={style.sectionSplit}></div> */}
            </div>
        </div >
    )
}

export default ReappointmentProgressCard;