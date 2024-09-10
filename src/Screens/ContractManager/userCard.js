import React, { useEffect, useState } from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { GET } from '../dataSaver';
import { formatInTimeZone } from 'date-fns-tz'
import { Link } from 'react-router-dom';
import { siteTimeZone, timeZoneAbbreviation } from '../../utils/formatting';

import style from './index.module.scss';

const UserCard = ({ getIsExpanded, updateProfileData }) => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(user?.id);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log('in user card', user?.id);
    useEffect(() => {
        console.log('inside func call useEffect 1', user?.id)
        setUserId(user?.id);
        setUserDetails();
    }, [])

    useEffect(() => {
        console.log('inside the func call useeffect', user?.id);
        setUserDetails();
    }, [userId])

    const setUserDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
        console.log('users', user)
    }

    console.log('currentUserDetails', currentUserDetails, currentUserDetails?.lastLogin);

    return (
        <div className={`${style.cardStyle} ${style.bigCalendarLeftCardWidth}`}>
            <div className={`${style.displayInRow} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                    <Link to={'/profile'} className={style.noFontStyle}>
                        <label for="file-upload">
                            <img src={updateProfileData ? updateProfileData?.profilePic?.file?.fileURL : currentUserDetails?.profilePic?.file?.fileURL ? currentUserDetails?.profilePic?.file?.fileURL : DoctorAnime} className={`${style.userLogo} ${style.cursorPointer}`} />
                        </label>

                        <input id="file-upload" type="file" />
                    </Link>
                    <Link to={'/profile'} className={style.noFontStyle}>

                        <div className={style.marginLeft20}>
                            <div className={style.userNameStyle}>
                                Hi, {updateProfileData ? `${updateProfileData?.name?.firstName} ${updateProfileData?.name?.lastName}` : `${currentUserDetails?.name?.firstName} ${currentUserDetails?.name?.lastName}`}
                            </div>
                            <div className={style.loginStatus}>
                                Last Login {currentUserDetails && formatInTimeZone(new Date(currentUserDetails?.lastLogin) || new Date(), siteTimeZone(), 'MMM d, yy H:mm')} {timeZoneAbbreviation()}
                            </div>
                        </div>
                    </Link>

                </div>
                <img src={ChevronRight} className={style.chevronRightStyle} onClick={() => getIsExpanded(false)} />
            </div>
        </div>
    )
}

export default UserCard;
