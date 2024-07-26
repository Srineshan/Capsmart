import React from 'react'
import style from './index.module.scss'

const ProgressCard = ({ step, dataType, title, timeNumber, timeText, progressStyle }) => {
    return (
        <div className={style.progressCard}>
            <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                    <div className={style.stepTextStyle}>{step}</div>
                    <div className={`${style.dataTypeCollectionsTextStyle}  ${style.marginLeft}`}>{dataType}</div>
                </div>
                <div className={style.timeSpentText}>Time spent</div>
            </div>
            <div className={`${style.spaceBetween} ${style.marginTop10}`}>
                <div className={style.titleTextStyle}>{title}</div>
                <div className={`${style.displayInRow} ${style.flex}`}><span className={style.hourNumberStyle}>{timeNumber} </span><span className={`${style.hourTextStyle} ${style.textAlignBottom} ${style.marginLeft5}`}> {timeText}</span></div>
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