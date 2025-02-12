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
                    let dotClass = style.dotStyle;

                   // Find the form with schemaCategory === 'UploadYourDoc'
                    const uploadDocForm = (basicForm?.forms ?? []).find(form => 
                        form?.schemaCategory === 'UploadYourDoc'
                    );
                    const professionalConductDisclosure = (basicForm?.forms ?? []).find(form => 
                        form?.schemaCategory === 'ProfessionalConduct'
                    );
                    const criminalHistoryDisclosure = (basicForm?.forms ?? []).find(form => 
                        form?.schemaCategory === 'CriminalHistory'
                    );
                    const medicalHistorDisclosure = (basicForm?.forms ?? []).find(form => 
                        form?.schemaCategory === 'MedicalHistory'
                    );
                    const patientConcernDisclosure = (basicForm?.forms ?? []).find(form => 
                        form?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE'
                    );

                    // Get unFilledFields from that form or default to an empty array
                    const unFilledFields = uploadDocForm?.unFilledFields ?? [];
                    const professionalConductUnfilledFields = professionalConductDisclosure?.unFilledFields ?? [];
                    const criminalHistoryUnfilledFields = criminalHistoryDisclosure?.unFilledFields ?? [];
                    const medicalHistoryUnfilledFields = medicalHistorDisclosure?.unFilledFields ?? [];
                    const patientConernUnfilledFields = patientConcernDisclosure?.unFilledFields ?? [];
                    const documentsRequired = basicForm?.documentsRequired ?? [];

                    if (data?.schemaCategory === 'UploadYourDoc') {
                        const requiredDocNames = documentsRequired
                            .filter(doc => doc?.required)
                            .map(doc => doc?.document?.shortName);
                        const missingRequiredDocs = requiredDocNames.some(name => unFilledFields.includes(name));
                        console.log("missing",unFilledFields)

                        // Check if any optional (not required) document is missing
                        const unfilledOptionalDocs = unFilledFields.filter(name =>
                            documentsRequired.some(doc => doc.document?.shortName === name && !doc?.required)
                        );
                        console.log("missing11",unfilledOptionalDocs)

                        if (missingRequiredDocs) {
                            dotClass = style.reddotStyle;
                        } else if (unfilledOptionalDocs.length > 0) {
                            dotClass = style.yellowdotStyle;
                        } else {
                            dotClass = style.dotStyle;
                        }
                    }  else if (data?.schemaCategory === 'ProfessionalConduct') {
                        let hasMandatoryTrue = false;
                        let hasMandatoryFalse = false;
                    
                        professionalConductUnfilledFields.forEach(field => {
                            try {
                                const fieldData = JSON.parse(field);
                                if (fieldData?.label?.mandatory === true) {
                                    hasMandatoryTrue = true;
                                } else {
                                    hasMandatoryFalse = true;
                                }
                            } catch (e) {
                                console.error('Error parsing unfilled field:', e);
                            }
                        });
                    
                        if (hasMandatoryTrue) {
                            dotClass = style.reddotStyle; 
                        } else if (hasMandatoryFalse) {
                            dotClass = style.yellowdotStyle; 
                        }
                    }  else if (data?.schemaCategory === 'CriminalHistory') {
                        let hasMandatoryTrue = false;
                        let hasMandatoryFalse = false;
                    
                        criminalHistoryUnfilledFields.forEach(field => {
                            try {
                                const fieldData = JSON.parse(field);
                                if (fieldData?.label?.mandatory === true) {
                                    hasMandatoryTrue = true;
                                } else {
                                    hasMandatoryFalse = true;
                                }
                            } catch (e) {
                                console.error('Error parsing unfilled field:', e);
                            }
                        });
                    
                        if (hasMandatoryTrue) {
                            dotClass = style.reddotStyle; 
                        } else if (hasMandatoryFalse) {
                            dotClass = style.yellowdotStyle; 
                        }
                    }  else if (data?.schemaCategory === 'MedicalHistory') {
                        let hasMandatoryTrue = false;
                        let hasMandatoryFalse = false;
                    
                        medicalHistoryUnfilledFields.forEach(field => {
                            try {
                                const fieldData = JSON.parse(field);
                                if (fieldData?.label?.mandatory === true) {
                                    hasMandatoryTrue = true;
                                } else {
                                    hasMandatoryFalse = true;
                                }
                            } catch (e) {
                                console.error('Error parsing unfilled field:', e);
                            }
                        });
                    
                        if (hasMandatoryTrue) {
                            dotClass = style.reddotStyle; 
                        } else if (hasMandatoryFalse) {
                            dotClass = style.yellowdotStyle; 
                        }
                    } else if (data?.schemaCategory === 'PATIENT_CONCERN_DISCLOSURE') {
                        let hasMandatoryTrue = false;
                        let hasMandatoryFalse = false;
                      
                        patientConernUnfilledFields.forEach(field => {
                          const fieldData = JSON.parse(field); // Assuming field is always a valid JSON string
                          console.log("ggggggggg",fieldData)
                          if (fieldData?.label?.mandatory === true) {
                            hasMandatoryTrue = true;
                          } else {
                            hasMandatoryFalse = true;
                          }
                        });
                      
                        if (hasMandatoryTrue) {
                          dotClass = style.reddotStyle; // At least one field is mandatory
                        } else if (hasMandatoryFalse) {
                          dotClass = style.yellowdotStyle; // All fields are non-mandatory
                        }
                      }  else {
                        const lastAcknowledgedIndex = (basicForm?.forms ?? []).reduce(
                            (maxIndex, step, idx) => (step?.acknowledged ? idx : maxIndex),
                            -1
                        );

                        dotClass = data?.acknowledged
                            ? style.dotStyle
                            : index < lastAcknowledgedIndex
                            ? `${style.disabledDotStyle} ${style.cursorPointer}`
                            : `${style.disabledDotStyle} ${style.disabled}`;
                    }

                    return (
                        <Tooltip title={data?.title} arrow key={index}>
                            <div
                                className={dotClass}
                                onClick={
                                    data?.acknowledged || index < (basicForm?.forms ?? []).reduce(
                                        (maxIndex, step, idx) => (step?.acknowledged ? idx : maxIndex),
                                        -1
                                    )
                                        ? () => navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`)
                                        : () => {}
                                }
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