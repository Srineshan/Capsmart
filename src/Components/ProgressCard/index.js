import React, { useState, useEffect, useRef, useMemo } from 'react'
import style from './index.module.scss'

const ProgressCard = ({ step, dataType, title, timeNumber, timeText, progressStyle, applicationId }) => {
    const [startTime, setStartTime] = useState(0);
    const [displayTime, setDisplayTime] = useState(0);
    
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