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
import UploadYourDoc from './UploadYourDoc';
import { logout } from '../../utils/auth';
import MedicalHistory from './MedicalHistory';
import CriminalHistory from './CriminalHistory';
import LMSModules from './LMSModules';
import HospitalCoverage from './HospitalCoverage';
import MRP from './MRP';
import PrescribeSuboxone from './PrescribeSuboxone';
import ApplicantAcknowledgement from './ApplicantAcknowledgement';
import CME from './CME';
import MedicalDirectives from './MedicalDirectives';
import MiscellaneousQuestions from './MiscellaneousQuestions';

const LocumApplicationForm = () => {
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

    useEffect(() => {
        sessionStorage.setItem('applicationId', applicationId)
    }, [applicationId])

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
        console.log(atob(step), 'btoastring', step)
        switch (atob(step)) {
            case 'DemographicData':
                return <DemographicData basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'PrivilegeSelection':
                return <PrivilegeSelection basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            // case 'AdditionalPrivilegeSelection':
            //     return <AdditionalPrivilegeSelection basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'ProfessionalConduct':
                return <ProfessionalConduct basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'MedicalHistory':
                return <MedicalHistory basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'CriminalHistory':
                return <CriminalHistory basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'UploadYourDoc':
                return <UploadYourDoc basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'MEDICAL_DIRECTIVES':
                return <MedicalDirectives basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} />
            case 'CME':
                return <CME basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} />
            case 'LMS':
                return <LMSModules basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />
            case 'MRP':
                return <MRP basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />
            case 'HOSPITAL_COVERAGE':
                return <HospitalCoverage basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />
            case 'SUBOXONE':
                return <PrescribeSuboxone basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />
            case 'MISCELLANEOUS_QUESTIONS':
                return <MiscellaneousQuestions basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />
            case 'ApplicantAcknowledgement':
                return <ApplicantAcknowledgement dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            default:
                // return <LMSModules basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />
                return <div>Step not found</div>;
        }
    };

    console.log(section, step)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`Locum Staff Renewal Application For ${basicForm?.basicDetails?.applicant?.name?.firstName !== undefined ? basicForm?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${basicForm?.basicDetails?.applicant?.name?.lastName !== undefined ? basicForm?.basicDetails?.applicant?.name?.lastName : '{Last Name}'}, ${(basicForm?.basicDetails?.applicant?.applicantType !== null) ? basicForm?.basicDetails?.applicant?.applicantType : ''}`} close={true} closeClick={logout} />
            <div className={style.screenPadding}>
                {StepDisplay()}
            </div>
        </div>
    )
}

export default LocumApplicationForm;