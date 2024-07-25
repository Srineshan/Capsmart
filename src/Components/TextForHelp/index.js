import React from 'react'
import style from './index.module.scss'

const TextForHelp = ({ title, description }) => {
    return (
        <div className={style.helpCard}>
            <div className={style.titleTextStyle}>{title}</div>
            <div className={`${style.descriptionTextStyle} ${style.marginTop}`}>{description}</div>
        </div>
    )
}

export default TextForHelp;