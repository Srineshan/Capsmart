import React, { useEffect, useState } from 'react';
import { GET } from '../dataSaver';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from './index.module.scss';
import { useParams } from 'react-router-dom';
import ApplicationHeader from '../../Components/ApplicationHeader';
import DemographicData from './DemographicData';
import PrivilegeSelection from './PrivilegeSelection';
import ProfessionalConduct from './ProfessionalConduct';

const ReappointmentApplicationForm = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const { applicationId, section, step } = useParams();
    const [basicForm, setBasicForm] = useState({})
    // const applicationId = sessionStorage.getItem('applicationId')
    const [isOpen, setIsOpen] = useState(true);
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const getIsOpen = (value) => {
        setIsOpen(value);
    }
    useEffect(() => {
        getPreApplication()
        getCountryList()
    }, [])

    useEffect(() => {
        setUserDetails();
    }, [user?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
        console.log(userData)
        sessionStorage.setItem('user', JSON.stringify(userData))
    }

    const getCountryList = async () => {
        const { data: countryData } = await GET(`entity-service/countryMaster`);
        sessionStorage.setItem('canadaData', JSON.stringify(countryData?.filter(data => data?.abbreviation === 'CN')[0]));
    };

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }

    const StepDisplay = () => {
        switch (step) {
            case 'DemographicData':
                return <DemographicData basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'PrivilegeSelection':
                return <PrivilegeSelection basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'ProfessionalConduct':
                return <ProfessionalConduct basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            default:
                return <div>Step not found</div>;
        }
    };

    console.log(section, step)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`Reappointment Application For ${basicForm?.basicDetails?.applicant?.name?.firstName !== undefined ? basicForm?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${basicForm?.basicDetails?.applicant?.name?.lastName !== undefined ? basicForm?.basicDetails?.applicant?.name?.lastName : '{Last Name}'} ${(basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory !== null && basicForm?.basicDetails?.credentialingPrivilegeCategory !== null) ? basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : ''}`} />
            <div className={style.screenPadding}>
                {StepDisplay()}
            </div>
        </div>
    )
}

export default ReappointmentApplicationForm;