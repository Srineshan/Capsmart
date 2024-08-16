import React, { useState, useEffect } from 'react'
import style from './index.module.scss'

const ProgressCard = ({ step, dataType, title, timeNumber, timeText, progressStyle }) => {
    const [startTime, setStartTime] = useState(0);
    const [totalTime, setTotalTime] = useState(() => {
        // Retrieve stored time from localStorage or initialize it to 0
        const savedTime = localStorage.getItem('totalTime');
        return savedTime ? parseInt(savedTime, 10) : 0;
    });

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

    console.log(Math.floor(totalTime / 60000), totalTime)
    return (
        <div className={style.progressCard}>
            <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                    <div className={style.stepTextStyle}>{step}</div>
                    {/* <div className={`${style.dataTypeCollectionsTextStyle}  ${style.marginLeft}`}>{dataType}</div> */}
                </div>
                <div className={style.timeSpentText}>Time spent</div>
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop10}`}>
                <div className={style.titleTextStyle}>{title}</div>
                <div className={`${style.displayInRow} ${style.flex}`}><span className={style.hourNumberStyle}>{Math.floor(totalTime / 60000)} </span><span className={`${style.hourTextStyle} ${style.textAlignBottom} ${style.marginLeft5}`}> {timeText}</span></div>
            </div>
            <div>
                <div className={`${progressStyle} ${style.marginTop10}`} ></div>
                <div className={style.sectionSplitGrid}>
                    <div className={style.sectionSplit}></div>
                    <div className={style.sectionSplit}></div>
                    <div className={style.sectionSplit}></div>
                </div>
            </div>
        </div>
    )
}

export default ProgressCard;