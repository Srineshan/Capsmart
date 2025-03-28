import React, { useEffect, useState } from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { GET } from '../dataSaver';
import { formatInTimeZone } from 'date-fns-tz'
import { Link } from 'react-router-dom';
import { siteTimeZone, timeZoneAbbreviation, formatFirstNameLastName } from '../../utils/formatting';

import style from './index.module.scss';
import { Tooltip } from '@mui/material';

const UserCard = ({ getIsExpanded, updateProfileData }) => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const [user, setUser] = useState();
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const workModeType = sessionStorage.getItem('workModeType')

    console.log('in user card', user?.id, user);
    useEffect(() => {
        if (user?.id !== undefined) {
            console.log('inside func call useEffect 1', user?.id)
            setUserId(user?.id);
        }
    }, [user])

    useEffect(() => {
        console.log('inside the func call useeffect', user?.id);
        if (userId !== undefined && userId !== '') {
            setUserDetails();
        }
    }, [userId])

    useEffect(() => {
        if (userDetails !== undefined) {
            setUser(jwt(userDetails));
        }
    }, [userDetails])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(userData);
        console.log('users', userData)
    }

    console.log('currentUserDetails', currentUserDetails, currentUserDetails?.lastLogin);

    const handleWorkModeSelection = () => {
        window.location.pathname = "/"
    };

    return (
        <div className={`${style.userCardStyle} ${style.bigCalendarLeftCardWidth}`}>
            <div className={`${style.displayInRow} ${style.spaceBetween} ${style.verticalAlignCenter}`}>
                <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                    <Link to={'/profile'} className={style.noFontStyle}>
                        <label for="file-upload">
                            <img src={updateProfileData ? updateProfileData?.profilePic?.file?.fileURL : currentUserDetails?.profilePic?.file?.fileURL ? currentUserDetails?.profilePic?.file?.fileURL : DoctorAnime} className={`${style.userLogo} ${style.cursorPointer}`} />
                        </label>

                        <input id="file-upload" type="file" />
                    </Link>
                    <div>
                        <Link to={'/profile'} className={style.noFontStyle}>
                        <Tooltip title={"Click to Go to Profile"} arrow>
                            <div className={style.marginLeft20}>
                                {/* <div className={style.userNameStyle}>
                           Hi, {updateProfileData
                            ? `${updateProfileData?.name?.lastName.charAt(0).toUpperCase() + updateProfileData?.name?.lastName.slice(1).toLowerCase()}, ${updateProfileData?.name?.firstName}`
                            : `${currentUserDetails?.name?.lastName.charAt(0).toUpperCase() + currentUserDetails?.name?.lastName.slice(1).toLowerCase()}, ${currentUserDetails?.name?.firstName}`}
                        </div> */}
                                <div className={style.userNameStyle}>
                                    Hi, {
                                        currentUserDetails?.name?.firstName !== undefined &&
                                            currentUserDetails?.name?.lastName !== undefined
                                            ? formatFirstNameLastName(
                                                currentUserDetails?.name?.firstName,
                                                currentUserDetails?.name?.lastName
                                            )
                                            : "{First Name} {Last Name}"
                                    },{" "}
                                </div>
                                <div className={style.loginStatus}>
                                    Last Login {currentUserDetails && formatInTimeZone(new Date(currentUserDetails?.lastLogin) || new Date(), siteTimeZone(), 'MMM d, yy H:mm')} {timeZoneAbbreviation()}
                                </div>
                            </div>
                            </Tooltip>
                        </Link>
                        
                    </div>
                </div>
                <Tooltip title={"Click to Minimize"} arrow>
                <img src={ChevronRight} className={`${style.chevronRightStyle} ${style.cursorPointer}`} onClick={() => getIsExpanded(false)} />
                </Tooltip>
            </div>
            <div className={`${style.roleSwitchBackgroundStyle} ${currentUserDetails?.roles?.length > 1 ? style.spaceBetween : style.placeCenter
                } ${style.alignCenterText} ${style.marginTop}`}>
                <div className={style.roleType}>
                    <div>{workModeType}</div>
                    <div>Workspace</div>
                </div>
                {currentUserDetails?.roles?.length > 1 && (
                    <Tooltip title={"Click to Switch Workspace"} arrow>
                    <div
                        className={`${style.workSpaceSwitchTextStyle} ${style.marginLeft20} ${style.cursorPointer}`}
                        onClick={handleWorkModeSelection}
                    >
                        Switch Workspace
                    </div>
                    </Tooltip>
                )}
            </div>
        </div>
    )
}

export default UserCard;
