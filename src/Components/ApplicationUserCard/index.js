import React, { useEffect, useState } from 'react'
import { useUser } from '@descope/react-sdk';
import DefaultUserAvatar from './../../images/defaultUserLogo.jpg'
import style from './index.module.scss';
import { GET } from '../../Screens/dataSaver';

const ApplicationUserCard = ({ user, applyingFor }) => {
    const userDetails = useUser();
    console.log(userDetails)
    const [basicForm, setBasicForm] = useState({});
    const [profilePic, setProfilePic] = useState('');
    const applicationId = sessionStorage.getItem('applicationId')
    useEffect(() => {
        getPreApplication()
    }, [])

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
        let profilePicData = (basicForm?.forms[0]?.data !== null && basicForm !== undefined) ? basicForm?.forms[0]?.data?.table?.filter(fileData => fileData?.documentType === "Passport Size Photo")?.map(data => data) : [];
        setProfilePic((profilePicData !== undefined && profilePicData?.length !== 0) ? profilePicData[0]?.fileURL : '')
        console.log(profilePicData, 'pic')
    }
    return (
        <div className={`${style.applicationUserCard} ${style.profileGrid}`}>
            {basicForm?.applicant?.name?.firstName !== undefined && (
                <>
                    {profilePic !== '' ? (
                        <div>
                            <img src={profilePic} alt="Profile Pic" className={style.profilePic} />
                        </div>
                    ) : (
                        <div>
                            <img src={DefaultUserAvatar} alt="Profile Pic" className={style.profilePic} />
                        </div>
                        // <div className={style.profileImage}>
                        //     <div className={`${style.photoText} ${style.verticalAlignCenter}`}>Photo</div>
                        // </div>
                    )}
                    <div
                    // className={style.verticalSpaceBetween}
                    >
                        <div className={`${style.nameStyle}`}>{`${basicForm?.applicant?.name?.firstName} ${basicForm?.applicant?.name?.lastName}`}</div>
                        <div className={`${style.applyingFor}`}>{`Applying As ${basicForm?.basicDetailReferences?.applicantType?.serviceProviderType}`}</div>
                        <div className={`${style.applyingFor} `}>{`${basicForm?.basicDetails?.applicant?.email?.officialEmail}`}</div>
                        <div className={`${style.applyingFor}`}>{`${basicForm?.basicDetails?.applicant?.cellPhone}`}</div>
                        {/* <div className={`${style.connectToLinkedIn} ${style.marginTop10}`}>Connect To LinkedIn</div> */}
                    </div>
                </>
            )}
        </div>
    )
}

export default ApplicationUserCard;