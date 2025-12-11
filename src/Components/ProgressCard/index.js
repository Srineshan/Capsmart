import React, { useState, useEffect, useRef, useMemo } from 'react'
import style from './index.module.scss'
import { useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const ProgressCard = ({ dataType, title, timeNumber, timeText, progressStyle, basicForm }) => {
    const [startTime, setStartTime] = useState(0);
    const navigate = useNavigate()
    const [displayTime, setDisplayTime] = useState(0);
    const [formIndex, setFormIndex] = useState(0)
    const { applicationId, section, step } = useParams();
    // Memoize storageKey to prevent unnecessary re-renders
    const storageKey = useMemo(() => {
        return applicationId ? `totalTime_${applicationId}` : 'totalTime';
    }, [applicationId]);

    const [totalTime, setTotalTime] = useState(() => {
        // Retrieve stored time from localStorage or initialize it to 0
        const key = applicationId ? `totalTime_${applicationId}` : 'totalTime';
        const savedTime = localStorage.getItem(key);
        return savedTime ? parseFloat(savedTime) : 0;
    });

    // Use refs to avoid stale closures in intervals
    const startTimeRef = useRef(0);
    const totalTimeRef = useRef(totalTime);
    const storageKeyRef = useRef(storageKey);

    // Update storageKey ref when it changes
    useEffect(() => {
        if (basicForm !== undefined) {
            setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)));
        }
    }, [step, basicForm])

    useEffect(() => {
        storageKeyRef.current = storageKey;
    }, [storageKey]);

    // Handle applicationId changes - reload time from new storage key
    useEffect(() => {
        const key = applicationId ? `totalTime_${applicationId}` : 'totalTime';
        const savedTime = localStorage.getItem(key);
        if (savedTime !== null) {
            const savedTimeValue = parseFloat(savedTime);
            setTotalTime(savedTimeValue);
            totalTimeRef.current = savedTimeValue;
            // Initialize displayTime only once when applicationId changes
            // The display interval will handle updates during active tracking
            setDisplayTime(savedTimeValue);
        } else {
            // Reset to 0 if no saved time for new applicationId
            setTotalTime(0);
            totalTimeRef.current = 0;
            setDisplayTime(0);
        }
    }, [applicationId]);

    // Sync refs with state (only update refs, don't trigger state updates)
    // This prevents stale closures in intervals
    useEffect(() => {
        startTimeRef.current = startTime;
    }, [startTime]);

    useEffect(() => {
        totalTimeRef.current = totalTime;
        // Don't update displayTime here - let the display interval handle it
        // This prevents infinite loops
    }, [totalTime]);

    // Initialize timer on mount if tab is visible
    useEffect(() => {
        if (document.visibilityState === 'visible') {
            const initialStartTime = performance.now();
            setStartTime(initialStartTime);
            startTimeRef.current = initialStartTime;
        }
    }, []);

    // Handle visibility changes (tab focus/blur)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Tab has become visible, start the timer
                const currentStartTime = performance.now();
                setStartTime(currentStartTime);
                startTimeRef.current = currentStartTime;
            } else {
                // Tab is out of focus, accumulate time spent in focus
                if (startTimeRef.current > 0) {
                    const elapsed = performance.now() - startTimeRef.current;
                    const newTotalTime = totalTimeRef.current + elapsed;
                    setTotalTime(newTotalTime);
                    totalTimeRef.current = newTotalTime;
                    localStorage.setItem(storageKeyRef.current, newTotalTime.toString());
                    setStartTime(0);
                    startTimeRef.current = 0;
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [storageKey]);

    // Update display time more frequently for dynamic display (every second)
    useEffect(() => {
        const displayInterval = setInterval(() => {
            if (document.visibilityState === 'visible' && startTimeRef.current > 0) {
                const currentTime = performance.now();
                const elapsed = currentTime - startTimeRef.current;
                const currentTotalTime = totalTimeRef.current + elapsed;
                setDisplayTime(currentTotalTime);
            } else {
                setDisplayTime(totalTimeRef.current);
            }
        }, 1000); // Update every second for dynamic display

        return () => clearInterval(displayInterval);
    }, []);

    // Save to localStorage periodically (every 30 seconds)
    useEffect(() => {
        const saveInterval = setInterval(() => {
            if (document.visibilityState === 'visible' && startTimeRef.current > 0) {
                const currentTime = performance.now();
                const elapsed = currentTime - startTimeRef.current;
                const newTotalTime = totalTimeRef.current + elapsed;
                setTotalTime(newTotalTime);
                totalTimeRef.current = newTotalTime;
                localStorage.setItem(storageKeyRef.current, newTotalTime.toString());
                setStartTime(currentTime);
                startTimeRef.current = currentTime;
            }
        }, 30000); // Save every 30 seconds

        return () => clearInterval(saveInterval);
    }, [storageKey]);

    // Save time on component unmount
    useEffect(() => {
        return () => {
            if (startTimeRef.current > 0) {
                const elapsed = performance.now() - startTimeRef.current;
                const newTotalTime = totalTimeRef.current + elapsed;
                localStorage.setItem(storageKeyRef.current, newTotalTime.toString());
            }
        };
    }, [storageKey]);

    // Save time on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (startTimeRef.current > 0) {
                const elapsed = performance.now() - startTimeRef.current;
                const newTotalTime = totalTimeRef.current + elapsed;
                localStorage.setItem(storageKeyRef.current, newTotalTime.toString());
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [storageKey]);

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

    return (
        <div className={style.progressCard}>
            <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                    <div className={style.stepTextStyle}>{dataType}</div>
                    {/* <div className={`${style.dataTypeCollectionsTextStyle}  ${step !== '' ? style.marginLeft : ''}`}>{dataType}</div> */}
                </div>
                <div className={style.timeSpentText}>Time spent</div>
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop10}`}>
                <div className={style.titleTextStyle}>{title}</div>
                <div className={`${style.displayInRow} ${style.flex}`}><span className={style.hourNumberStyle}>{Math.floor(displayTime / 60000)} </span><span className={`${style.hourTextStyle} ${style.textAlignBottom} ${style.marginLeft5}`}> {timeText}</span></div>
            </div>
            <div>
                {/* <div className={`${progressStyle} ${style.marginTop10}`} ></div>
                <div className={style.sectionSplitGrid}>
                    <div className={style.sectionSplit}></div>
                    <div className={style.sectionSplit}></div>
                    <div className={style.sectionSplit}></div>
                </div> */}
                <div className={`${style.progressStyle} ${style.marginTop10}  ${style.spaceBetween}`}
                    style={{ background: `transparent linear-gradient(90deg, #06617A 0%, #06617A ${(formIndex / (basicForm?.forms?.length - 1)) * 100}%, #E9E9F0 ${((formIndex / (basicForm?.forms?.length)) * 100) + (100 / basicForm?.forms?.length)}%, #E9E9F0 100%) 0% 0% no-repeat padding-box` }}
                >

                    {(basicForm?.forms ?? []).map((data, index) => {
                        let dotClass = `${style.disabledDotStyle} ${style.disabled}`;
                        if (data?.acknowledged) {
                            const uploadDocForm = basicForm?.forms?.find(form => form?.schemaCategory === 'UploadYourDoc');
                            const contactAddress = basicForm?.forms?.find(form => form?.schemaCategory === 'ContactAddress');
                            const qualification = basicForm?.forms?.find(form => form?.schemaCategory === 'Qualification');
                            const malpracticeInfo = basicForm?.forms?.find(form => form?.schemaCategory === 'MalpracticeInfo');
                            const education = basicForm?.forms?.find(form => form?.schemaCategory === 'Education');
                            const workExperience = basicForm?.forms?.find(form => form?.schemaCategory === 'WorkExperience');
                            const privilegeSelection = basicForm?.forms?.find(form => form?.schemaCategory === 'PrivilegeSelection');
                            const references = basicForm?.forms?.find(form => form?.schemaCategory === 'References');
                            const professionalConduct = basicForm?.forms?.find(form => form?.schemaCategory === 'ProfessionalConduct');
                            const criminalHistory = basicForm?.forms?.find(form => form?.schemaCategory === 'CriminalHistory');
                            const medicalHistory = basicForm?.forms?.find(form => form?.schemaCategory === 'MedicalHistory');
                            const miscellaneousQuestion = basicForm?.forms?.find(form => form?.schemaCategory === 'MISCELLANEOUS_QUESTIONS');
                            const applicantAcknowledgement = basicForm?.forms?.find(form => form?.schemaCategory === 'ApplicantAcknowledgement');
                            const scheduleA = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleA');
                            const scheduleB = basicForm?.forms?.find(form => form?.schemaCategory === 'ScheduleB');
                            const immunization = basicForm?.forms?.find(form => form?.schemaCategory === 'Immunization');
                            const policeVulnerableCheck = basicForm?.forms?.find(form => form?.schemaCategory === 'PoliceVulnerableCheck');
                            const codeOfConduct = basicForm?.forms?.find(form => form?.schemaCategory === 'CodeOfConduct');
                            const confidentialityAgreement = basicForm?.forms?.find(form => form?.schemaCategory === 'ConfidentialityAgreement');
                            const conflictOfInterest = basicForm?.forms?.find(form => form?.schemaCategory === 'ConflictOfInterest');
                            const offenceDeclaration = basicForm?.forms?.find(form => form?.schemaCategory === 'OffenceDeclaration');
                            const disabilitiesAct = basicForm?.forms?.find(form => form?.schemaCategory === 'DisabilitiesAct');
                            const pharmacySignature = basicForm?.forms?.find(form => form?.schemaCategory === 'PharmacySignature');
                            const pacsRequest = basicForm?.forms?.find(form => form?.schemaCategory === 'PACS_Request');

                            const unFilledFields = uploadDocForm?.unFilledFields ?? [];
                            const documentsRequired = basicForm?.documentsRequired ?? [];
                            const contactAddressUnfilledFields = contactAddress?.unFilledFields ?? [];
                            const qualificationUnfilledFields = qualification?.unFilledFields ?? [];
                            const malpracticeInfoUnfilledFields = malpracticeInfo?.unFilledFields ?? [];
                            const educationUnfilledFields = education?.unFilledFields ?? [];
                            const workExperienceUnfilledFields = workExperience?.unFilledFields ?? [];
                            const privilegeSelectionUnfilledFields = privilegeSelection?.unFilledFields ?? [];
                            const referencesUnfilledFields = references?.unFilledFields ?? [];
                            const professionalConductUnfilledFields = professionalConduct?.unFilledFields ?? [];
                            const criminalHistoryUnfilledFields = criminalHistory?.unFilledFields ?? [];
                            const medicalHistoryUnfilledFields = medicalHistory?.unFilledFields ?? [];
                            const miscellaneousQuestionUnfilledFields = miscellaneousQuestion?.unFilledFields ?? [];
                            const applicantAcknowledgementUpdate = applicantAcknowledgement?.acknowledged ?? "";
                            const scheduleAUpdate = scheduleA?.unFilledFields ?? [];
                            const scheduleBUpdate = scheduleB?.unFilledFields ?? [];
                            const immunizationUpdate = immunization?.unFilledFields ?? [];
                            const policeVulnerableCheckUpdate = policeVulnerableCheck?.unFilledFields ?? [];
                            const codeOfConductUpdate = codeOfConduct?.unFilledFields ?? [];
                            const confidentialityAgreementUpdate = confidentialityAgreement?.unFilledFields ?? [];
                            const conflictOfInterestUpdate = conflictOfInterest?.unFilledFields ?? [];
                            const offenceDeclarationUpdate = offenceDeclaration?.unFilledFields ?? [];
                            const disabilitiesActUpdate = disabilitiesAct?.unFilledFields ?? [];
                            const pharmacySignatureUpdate = pharmacySignature?.unFilledFields ?? [];
                            const pacsRequestUpdate = pacsRequest?.unFilledFields ?? [];


                            dotClass = style.dotStyle;

                            if (data?.schemaCategory === 'UploadYourDoc') {
                                // const requiredDocNames = documentsRequired?.filter(doc => doc?.required).map(doc => doc?.document?.shortName);
                                const requiredDocNames = documentsRequired?.filter(doc => getIsDocRequired(doc?.document?.shortName) === "Required")?.map(doc => doc?.document?.shortName);
                                const missingRequiredDocs = requiredDocNames?.some(name => unFilledFields?.includes(name));
                                const unfilledOptionalDocs = unFilledFields?.filter(name => documentsRequired?.some(doc => doc?.document?.shortName === name && !doc?.required));

                                // const missingRequiredDocs = requiredDocNames?.filter(name => unFilledFields?.includes(name));

                                dotClass = missingRequiredDocs ? style.reddotStyle : unfilledOptionalDocs?.length > 0 ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'ContactAddress') {
                                let hasMandatoryTrue = contactAddressUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = contactAddressUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'Qualification') {
                                let hasMandatoryTrue = qualificationUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = qualificationUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'MalpracticeInfo') {
                                let hasMandatoryTrue = malpracticeInfoUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = malpracticeInfoUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'Education') {
                                let hasMandatoryTrue = educationUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = educationUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'WorkExperience') {
                                let hasMandatoryTrue = workExperienceUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = workExperienceUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'PrivilegeSelection') {
                                let hasMandatoryTrue = privilegeSelectionUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = privilegeSelectionUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'References') {
                                let hasMandatoryTrue = referencesUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = referencesUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'ProfessionalConduct') {
                                let hasMandatoryTrue = professionalConductUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = professionalConductUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'CriminalHistory') {
                                let hasMandatoryTrue = criminalHistoryUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = criminalHistoryUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'MedicalHistory') {
                                let hasMandatoryTrue = medicalHistoryUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = medicalHistoryUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'MISCELLANEOUS_QUESTIONS') {
                                let hasMandatoryTrue = miscellaneousQuestionUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory === true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });
                                let hasMandatoryFalse = miscellaneousQuestionUnfilledFields?.some(field => {
                                    try {
                                        const parsed = JSON.parse(field);
                                        return parsed?.label?.mandatory !== true;
                                    } catch (e) {
                                        // field is just a plain string or invalid JSON → ignore it
                                        return false;
                                    }
                                });

                                dotClass = hasMandatoryTrue ? style.reddotStyle : hasMandatoryFalse ? style.yellowdotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'ScheduleA') {
                                let hasMandatoryTrue = scheduleAUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'ScheduleB') {
                                let hasMandatoryTrue = scheduleBUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'Immunization') {
                                let hasMandatoryTrue = immunizationUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'PoliceVulnerableCheck') {
                                let hasMandatoryTrue = policeVulnerableCheckUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'CodeOfConduct') {
                                let hasMandatoryTrue = codeOfConductUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'ConfidentialityAgreement') {
                                let hasMandatoryTrue = confidentialityAgreementUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'ConflictOfInterest') {
                                let hasMandatoryTrue = conflictOfInterestUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'OffenceDeclaration') {
                                let hasMandatoryTrue = offenceDeclarationUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'DisabilitiesAct') {
                                let hasMandatoryTrue = disabilitiesActUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'PharmacySignature') {
                                let hasMandatoryTrue = pharmacySignatureUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'PACS_Request') {
                                let hasMandatoryTrue = pacsRequestUpdate?.includes("skipped");

                                dotClass = hasMandatoryTrue ? style.reddotStyle : style.dotStyle;
                            } else if (data?.schemaCategory === 'ApplicantAcknowledgement') {
                                dotClass = applicantAcknowledgementUpdate === true ? style.dotStyle : style.reddotStyle;
                            }
                        }

                        const handleClick = () => {
                            if (data?.acknowledged) {
                                navigate(`/applicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`);
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
            </div>
        </div>
    )
}

export default ProgressCard;