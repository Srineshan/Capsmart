import React, { useEffect, useState } from 'react'
import ProgressCard from '../../Components/ProgressCard';
import ApplicationHeader from '../../Components/ApplicationHeader';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../Components/ApplicationReferenceDocuments';
import CommonMailingAddress from '../../Components/CommonFields/CommonMailingAddress';
import CommonDivider from '../../Components/CommonFields/CommonDivider';
import { GET } from '../dataSaver';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import style from './index.module.scss'
import BasicInformation from './BasicInformation';
import { useParams } from 'react-router-dom';
import UploadYourDoc from './UploadYourDoc';
import ContactAddress from './ContactAddress';
import Qualification from './Qualification';
import MalpracticeInfo from './MalpracticeInfo';
import Education from './Education';
import WorkExperience from './WorkExperience';
import PrivilegeSelection from './PrivilegeSelection';
import Step9 from './Step9';
import References from './References';
import ProfessionalConduct from './ProfessionalConduct';
import CriminalHistory from './CriminalHistory';
import MedicalHistory from './MedicalHistory';
import Step14 from './Step14';
import Immunization from './Immunization';
import ApplicantAcknowledgement from './ApplicantAcknowledgement';
import ScheduleA from './ScheduleA';
import ScheduleB from './ScheduleB';
import CodeOfConduct from './CodeOfConduct';
import OffenceDeclaration from './OffenceDeclaration';
import ConflictOfInterest from './ConflictOfInterest';
import ConfidentialityAgreement from './ConfidentialityAgreement';
import PoliceVulnerableCheck from './PoliceVulnerableCheck';
import ApplicationAcknowledgementStep9 from './AcknowledgementStep9';
import ApplicationAcknowledgementStep10 from './AcknowledgementStep10';
import ApplicationAcknowledgementStep11 from './AcknowledgementStep11';
import DisabilitiesAct from './DisabilitiesAct';
import PACSAdminStep1 from './PACSAdminStep1';
import PACSAdminStep6 from './PACSAdminStep6';
import LoginDialog from '../../Components/LoginDialog';
import PODCheck from './PODCheck';
import AcknowledgementCheck from './AcknowledgementCheck';
import { logout } from '../../utils/auth';


const ApplicationForm = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const { applicationId, section, step } = useParams();
    const [basicForm, setBasicForm] = useState({})
    // const applicationId = sessionStorage.getItem('applicationId')
    const [isOpen, setIsOpen] = useState(true);
    const [acknowledgementForms, setAcknowledgementForms] = useState([]);
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const getIsOpen = (value) => {
        setIsOpen(value);
    }
    useEffect(() => {
        getPreApplication()
        getCountryList()
    }, [])

    useEffect(() => {
        if (basicForm && acknowledgementForms?.length === 0) {
            getAcknowledgement(basicForm?.providerType?.id)
        }
    }, [basicForm])

    useEffect(() => {
        setUserDetails();
    }, [user?.id])

    const setUserDetails = async () => {
        const { data: userData } = await GET(`user-management-service/user/${user?.id}`);
        console.log(userData)
        sessionStorage.setItem('user', JSON.stringify(userData))
    }

    const getAcknowledgement = async (id) => {
        if (id !== "") {
            const { data: acknowledgementForm } = await GET(
                `entity-service/acknowledgementForm?applicantTypeId=${id}`
            );
            setAcknowledgementForms(acknowledgementForm);
        }
    };

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
            case 'BasicInformation':
                return <BasicInformation basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'UploadYourDoc':
                return <UploadYourDoc basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'ContactAddress':
                return <ContactAddress basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'Qualification':
                return <Qualification basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'MalpracticeInfo':
                return <MalpracticeInfo basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'Education':
                return <Education basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'WorkExperience':
                return <WorkExperience basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'PrivilegeSelection':
                return <PrivilegeSelection basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step9':
                return <Step9 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'References':
                return <References basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'ProfessionalConduct':
                return <ProfessionalConduct basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'CriminalHistory':
                return <CriminalHistory basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'MedicalHistory':
                return <MedicalHistory basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step14':
                return <Step14 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'Immunization':
                return <Immunization basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'ApplicantAcknowledgement':
                return <ApplicantAcknowledgement acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'ScheduleA':
                return <ScheduleA acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'ScheduleB':
                return <ScheduleB acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'CodeOfConduct':
                return <CodeOfConduct acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'PoliceVulnerableCheck':
                return <PoliceVulnerableCheck acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'ConfidentialityAgreement':
                return <ConfidentialityAgreement acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'ConflictOfInterest':
                return <ConflictOfInterest acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'OffenceDeclaration':
                return <OffenceDeclaration acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep9':
                return <ApplicationAcknowledgementStep9 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'acknowledgementStep10':
                return <ApplicationAcknowledgementStep10 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'acknowledgementStep11':
                return <ApplicationAcknowledgementStep11 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'DisabilitiesAct':
                return <DisabilitiesAct acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'pacsAdminStep1':
                return <PACSAdminStep1 />;
            // case 'pacsAdminStep2':
            //     return <PACSAdminStep2 basicForm={basicForm} setBasicForm={setBasicForm} />;
            // case 'pacsAdminStep3':
            //     return <PACSAdminStep3 basicForm={basicForm} setBasicForm={setBasicForm} />;
            // case 'pacsAdminStep4':
            //     return <PACSAdminStep4 />;
            // case 'pacsAdminStep5':
            //     return <PACSAdminStep5 />;
            case 'pacsAdminStep6':
                return <PACSAdminStep6 />;
            case 'PODCheck':
                return <PODCheck basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'AcknowledgementCheck':
                return <AcknowledgementCheck basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            default:
                return <div>Step not found</div>;
        }
    };

    console.log(section, step)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`New ${basicForm?.basicDetails?.applicant?.applicantType !== undefined ? basicForm?.basicDetails?.applicant?.applicantType : '{Applicant Type}'} Application For ${basicForm?.basicDetails?.applicant?.name?.firstName !== undefined ? basicForm?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${basicForm?.basicDetails?.applicant?.name?.lastName !== undefined ? basicForm?.basicDetails?.applicant?.name?.lastName : '{Last Name}'}, ${(basicForm?.basicDetails?.applicant?.applicantType !== null) ? basicForm?.basicDetails?.applicant?.applicantType : ''}`} close={true} closeClick={logout} />
            <div className={style.screenPadding}>
                {/* <div className={style.applicationScreenGrid}> */}
                {StepDisplay()}
                {/* <div>
                        <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                        <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/acknowledgementStep1')} >CONTINUE</div>
                        <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div>
                    </div>
                </div> */}
            </div>
            {/* <LoginDialog getIsOpen={getIsOpen} days={15} /> */}
        </div>
    )
}

export default ApplicationForm;