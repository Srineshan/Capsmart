import React, { useEffect, useState } from 'react'
import { useUser } from '@descope/react-sdk';

import style from './index.module.scss';
import { GET } from '../../Screens/dataSaver';

const ApplicationUserCard = ({ user, applyingFor }) => {
    const userDetails = useUser();
    console.log(userDetails)
    const [basicForm, setBasicForm] = useState({})
    const applicationId = sessionStorage.getItem('applicationId')
    useEffect(() => {
        getPreApplication()
    }, [])

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }
    return (
        <div className={`${style.applicationUserCard} ${style.profileGrid}`}>
            <div className={style.profileImage}>
                <div className={`${style.photoText} ${style.verticalAlignCenter}`}>Photo</div>
            </div>
            <div
            // className={style.verticalSpaceBetween}
            >
                <div className={`${style.nameStyle}`}>{`${basicForm?.applicant?.name?.firstName} ${basicForm?.applicant?.name?.lastName}`}</div>
                <div className={`${style.applyingFor} ${style.marginTop10}`}>{`${basicForm?.basicDetailReferences?.applicantType?.category} Applying As ${basicForm?.basicDetailReferences?.applicantType?.serviceProviderType}`}</div>
                {/* <div className={`${style.connectToLinkedIn} ${style.marginTop10}`}>Connect To LinkedIn</div> */}
            </div>
        </div>
    )
}

export default ApplicationUserCard;