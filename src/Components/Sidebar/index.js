import React, { useState, useEffect } from 'react';
import DoctorAnime from './../../images/doctorAnime.png';
import ChevronRight from './../../images/chevronRight.png';
import PageFooterIcon from './../../images/pageFooterIcon.png';
import { currentUser } from './../../utils/auth';
import UserCard from '../../Screens/ContractManager/userCard';
import { GET } from '../../Screens/dataSaver';

import style from './index.module.scss';
import { useForkRef } from '@material-ui/core';

const SideBar = ({ children, isExpanded, getIsExpanded, refetchUserValues, updateProfileData }) => {
    const currentUserData = currentUser();
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(currentUserData?.id);

    useEffect(() => {
        setUserId(currentUserData?.id);
        setUserDetails();
        console.log('entered')
    }, [window.location, updateProfileData]);

    const setUserDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
        // console.log(user)
    }

    // console.log(currentUserDetails, updateProfileData)

    return (
        !isExpanded ? (
            <div>
                <div className={style.chevronCardStyle}>
                    <div className={`${style.alignCenter}`}>
                        <img src={ChevronRight} className={style.chevronRightStyle2} onClick={() => getIsExpanded(true)} />
                    </div>
                </div>
                <div className={`${style.cardStyle} ${style.marginTop20}`}>
                    <div className={`${style.displayInCol} ${style.alignCenter}`}>
                        <div className={`${style.userNameStyle} `}>
                            {updateProfileData ? `${updateProfileData?.name?.firstName} ${updateProfileData?.name?.lastName}` : `${currentUserDetails?.name?.firstName} ${currentUserDetails?.name?.lastName}`}
                        </div>
                        <img src={updateProfileData ? updateProfileData?.profilePic?.file?.fileURL : (currentUserDetails?.profilePic?.file?.fileURL ? currentUserDetails?.profilePic?.file?.fileURL : DoctorAnime)} className={style.userLogo} />
                    </div>
                </div>
                <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                    <div className={style.openCardStyle}>
                        <img src={PageFooterIcon} alt="footer" className={style.footerIconStyle} />
                    </div>
                </div>
            </div>
        ) : (
            <>
                <UserCard getIsExpanded={getIsExpanded} updateProfileData={updateProfileData} />
                <div className={style.marginTop20}>{children}</div>
            </>
        )
    )
}

export default SideBar;