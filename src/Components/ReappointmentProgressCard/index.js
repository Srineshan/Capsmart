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
                    {basicForm?.forms?.map((data, index) => (
                        <Tooltip title={data?.title} arrow>
                            <div className={data?.acknowledged ? style.dotStyle : (index < basicForm?.forms?.reduce((maxIndex, step, index) => (step?.acknowledged ? index : maxIndex), -1)) ? `${style.disabledDotStyle} ${style.cursorPointer}` : `${style.disabledDotStyle} ${style.disabled}`} onClick={(data?.acknowledged || index < basicForm?.forms?.reduce((maxIndex, step, index) => (step?.acknowledged ? index : maxIndex), -1)) ? () => navigate(`/reappointmentApplicationForm/${applicationId}/${data?.formCategory}/${btoa(data?.schemaCategory)}`) : () => { }}></div>
                        </Tooltip>
                    ))}
                </div>
                {/* <div className={style.sectionSplit}></div> */}
            </div>
        </div >
    )
}

export default ReappointmentProgressCard;