import React from 'react'
import style from './index.module.scss'

const WelcomeCard = ({ children, title, description }) => {
    return (
        <div className={style.progressCard}>
            <div className={style.titleTextStyle}>{title}</div>
            <div className={`${style.descriptionTextStyle} ${style.marginTop}`}>{description}</div>
            {children !== undefined && (
                <div>{children}</div>
            )}
        </div>
    )
}

export default WelcomeCard;