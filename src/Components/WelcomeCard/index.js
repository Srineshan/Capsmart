import React from 'react'
import style from './index.module.scss'

const WelcomeCard = ({ title, description }) => {
    return (
        <div className={style.progressCard}>
            <div className={style.titleTextStyle}>{title}</div>
            <div className={`${style.descriptionTextStyle} ${style.marginTop}`}>{description}</div>
        </div>
    )
}

export default WelcomeCard;