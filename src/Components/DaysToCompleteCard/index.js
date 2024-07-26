import React from 'react'
import style from './index.module.scss'

const DaysToComplete = ({ days }) => {
    return (
        <div className={style.daysToCompleteCard}>
            <div className={style.textStyle}>{'YOU HAVE'}</div>
            <div className={style.daysCountStyle}>{days}</div>
            <div className={`${style.textStyle}`}>{'DAYS TO COMPLETE'}</div>
        </div>
    )
}

export default DaysToComplete;