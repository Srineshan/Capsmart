import React, { useEffect, useState } from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { GET } from '../dataSaver';
import { formatInTimeZone } from 'date-fns-tz'

import style from './index.module.scss';

const UserCard = ({ getIsExpanded }) => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(user?.id);

    useEffect(() => {
        setUserId(user?.id);
        setUserDetails();
    }, [])

    const setUserDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
    }
    return (
        <div className={`${style.cardStyle} ${style.bigCalendarLeftCardWidth}`}>
            <div className={`${style.displayInRow} ${style.alignCenter}`}>
                <label for="file-upload">
                    <img src={DoctorAnime} className={`${style.userLogo} ${style.cursorPointer}`} />
                </label>
                <input id="file-upload" type="file" />
                <div className={style.marginLeft20}>
                    <div className={style.userNameStyle}>
                        Hi, {user?.userName}
                    </div>
                    <div className={style.loginStatus}>
                        last login {formatInTimeZone(new Date(currentUserDetails?.lastLogin || new Date()), 'America/New_York', 'MMM d, yy h:mm zzz')}
                    </div>
                </div>
                <img src={ChevronRight} className={style.chevronRightStyle} onClick={() => getIsExpanded(false)} />
            </div>
        </div>
    )
}

export default UserCard;
