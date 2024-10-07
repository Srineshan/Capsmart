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
import Step1 from './Step1';
import { useParams } from 'react-router-dom';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import Step8 from './Step8';
import Step9 from './Step9';
import Step10 from './Step10';
import Step11 from './Step11';
import Step12 from './Step12';
import Step13 from './Step13';
import Step14 from './Step14';
import Step15 from './Step15';
import ApplicationAcknowledgementStep1 from './AcknowledgementStep1';
import ApplicationAcknowledgementStep2 from './AcknowledgementStep2';
import ApplicationAcknowledgementStep3 from './AcknowledgementStep3';
import ApplicationAcknowledgementStep4 from './AcknowledgementStep4';
import ApplicationAcknowledgementStep8 from './AcknowledgementStep8';
import ApplicationAcknowledgementStep7 from './AcknowledgementStep7';
import ApplicationAcknowledgementStep6 from './AcknowledgementStep6';
import ApplicationAcknowledgementStep5 from './AcknowledgementStep5';
import ApplicationAcknowledgementStep9 from './AcknowledgementStep9';
import ApplicationAcknowledgementStep10 from './AcknowledgementStep10';
import ApplicationAcknowledgementStep11 from './AcknowledgementStep11';
import ApplicationAcknowledgementStep12 from './AcknowledgementStep12';
import PACSAdminStep1 from './PACSAdminStep1';
import PACSAdminStep6 from './PACSAdminStep6';
import LoginDialog from '../../Components/LoginDialog';


const ApplicationForm = () => {
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const user = jwt(userDetails);
    const { section, step } = useParams();
    const [basicForm, setBasicForm] = useState({})
    const applicationId = sessionStorage.getItem('applicationId')
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
            case 'step1':
                return <Step1 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'step2':
                return <Step2 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step3':
                return <Step3 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step4':
                return <Step4 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step5':
                return <Step5 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step6':
                return <Step6 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step7':
                return <Step7 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step8':
                return <Step8 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'step9':
                return <Step9 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'step10':
                return <Step10 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} getPreApplication={getPreApplication} />;
            case 'step11':
                return <Step11 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'step12':
                return <Step12 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'step13':
                return <Step13 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'step14':
                return <Step14 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'step15':
                return <Step15 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'acknowledgementStep1':
                return <ApplicationAcknowledgementStep1 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep2':
                return <ApplicationAcknowledgementStep2 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep3':
                return <ApplicationAcknowledgementStep3 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep4':
                return <ApplicationAcknowledgementStep4 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep5':
                return <ApplicationAcknowledgementStep5 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep6':
                return <ApplicationAcknowledgementStep6 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep7':
                return <ApplicationAcknowledgementStep7 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep8':
                return <ApplicationAcknowledgementStep8 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
            case 'acknowledgementStep9':
                return <ApplicationAcknowledgementStep9 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'acknowledgementStep10':
                return <ApplicationAcknowledgementStep10 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'acknowledgementStep11':
                return <ApplicationAcknowledgementStep11 basicForm={basicForm} setBasicForm={setBasicForm} applicationId={applicationId} />;
            case 'acknowledgementStep12':
                return <ApplicationAcknowledgementStep12 acknowledgementForm={acknowledgementForms[0]} dateFormat={canadaData?.dateFormat || 'dd/MM/yyyy'} name={`${basicForm?.basicDetails?.applicant?.name?.firstName} ${basicForm?.basicDetails?.applicant?.name?.lastName} `} basicForm={basicForm} getPreApplication={getPreApplication} applicationId={applicationId} />;
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
            default:
                return <div>Step not found</div>;
        }
    };

    console.log(section, step)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={`New ${basicForm?.basicDetails?.applicant?.applicantType !== undefined ? basicForm?.basicDetails?.applicant?.applicantType : '{Applicant Type}'} Application For ${basicForm?.basicDetails?.applicant?.name?.firstName !== undefined ? basicForm?.basicDetails?.applicant?.name?.firstName : '{First Name}'} ${basicForm?.basicDetails?.applicant?.name?.lastName !== undefined ? basicForm?.basicDetails?.applicant?.name?.lastName : '{Last Name}'} ${(basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory !== null && basicForm?.basicDetails?.credentialingPrivilegeCategory !== null) ? basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory : ''}`} />
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