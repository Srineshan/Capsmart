import React, { useState, useEffect } from 'react'

import style from './index.module.scss'
import ApplicationHeader from '../../../Components/ApplicationHeader';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import CommonMailingAddress from '../../../Components/CommonFields/CommonMailingAddress';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WelcomeCard from '../../../Components/WelcomeCard';
import DaysToComplete from '../../../Components/DaysToCompleteCard';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@descope/react-sdk';
import LoginDialog from '../../../Components/LoginDialog';
import RequiredDocumentCard from '../../../Components/RequiredDocumentCard';
import { GET } from '../../dataSaver';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';

const ApplicationFormRequirement = () => {
    const { isAuthenticated, isSessionLoading } = useSession();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [basicForm, setBasicForm] = useState({})
    const [applicantTypeForm, setApplicantTypeForm] = useState()
    const applicationId = '66d1cae19354e9022ad82027';
    const requiredDocument = [{ title: 'Passport Size Photo' }, { title: 'Curriculum Vitae' }, { title: 'Professional Liability Insurance Coverage' }, { title: 'Education / College Diplomas, Degrees & Certificate' }, { title: 'Vulnerable Sector Police Check' }
    ]

    useEffect(() => {
        getBasicForm()
        getPreApplication()
        console.log('entered')
    }, [])

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    const getPreApplication = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/${applicationId}`
        );
        setBasicForm(basicForm)
    }

    const getBasicForm = async () => {
        const { data: basicForm } = await GET(
            `application-management-service/application/basicForm`
        );
        if (basicForm) {
            const { data: form1 } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[0]?.id}`
            );
            setApplicantTypeForm(form1?.schema)
        }
    }

    console.log(applicantTypeForm)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'New Physician / Doctor Application For Jane DOE, MD'} />
            <div className={style.screenPadding}>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        <WelcomeCard title={''} description={''} >
                            {applicantTypeForm !== undefined && 'privilegePortal' in applicantTypeForm?.properties && (
                                <ApplicationFieldCard object={applicantTypeForm?.properties?.privilegePortal} gridStyle={style.twoCol} baseKey={'privilegePortal'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                            )}
                        </WelcomeCard>
                        <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                            <div className={style.titleTextStyle}>Recommended & Required List of Documents to have Readily Available for this Application</div>
                            <div className={style.marginTop}>
                                <RequiredDocumentCard array={requiredDocument} />
                            </div>
                        </div>
                        <div className={style.marginTop}>
                            <WelcomeCard title={''} description={''} >
                                {applicantTypeForm !== undefined && 'immunizationHistory' in applicantTypeForm?.properties && (
                                    <ApplicationFieldCard object={applicantTypeForm?.properties?.immunizationHistory} gridStyle={style.twoCol} baseKey={'immunizationHistory'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                                )}
                            </WelcomeCard>
                        </div>
                        <div className={style.marginTop}>
                            <WelcomeCard title={''} description={''} >
                                {applicantTypeForm !== undefined && 'fitTest' in applicantTypeForm?.properties && (
                                    <ApplicationFieldCard object={applicantTypeForm?.properties?.fitTest} gridStyle={style.twoCol} baseKey={'fitTest'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                                )}
                            </WelcomeCard>
                        </div>
                    </div>
                    <div>
                        <ApplicationUserCard user={'Guest User'} applyingFor={'Contact'} />
                        <div className={style.marginTop}>
                            <DaysToComplete days={7} />
                        </div>
                        <div className={style.marginTop10}>
                            <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                        </div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`}>NOT READY TO START</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step1')}>READY TO START MY APPLICATION</div>
                    </div>
                </div>
            </div>
            {!isAuthenticated && !isSessionLoading && (
                <LoginDialog getIsOpen={getIsOpen} />
            )}
        </div>
    )
}

export default ApplicationFormRequirement;