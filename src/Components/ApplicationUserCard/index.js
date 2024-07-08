import React from 'react'

import style from './index.module.scss';

const ApplicationUserCard = ({ user, applyingFor }) => {
    return (
        <div className={`${style.applicationUserCard} ${style.profileGrid}`}>
            <div className={style.profileImage}>
                <div className={`${style.photoText} ${style.verticalAlignCenter}`}>Photo</div>
            </div>
            <div className={style.verticalSpaceBetween}>
                <div className={`${style.nameStyle}`}>{user}</div>
                <div className={`${style.applyingFor} ${style.marginTop10}`}>{applyingFor}</div>
                <div className={`${style.connectToLinkedIn} ${style.marginTop10}`}>Connect To LinkedIn</div>
            </div>
        </div>
    )
}

export default ApplicationUserCard;