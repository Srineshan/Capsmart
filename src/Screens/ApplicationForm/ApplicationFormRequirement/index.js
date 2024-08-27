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
import LoginDialog from '../../../Components/LoginDialog';
import RequiredDocumentCard from '../../../Components/RequiredDocumentCard';
import { GET } from '../../dataSaver';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';

const ApplicationFormRequirement = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [basicForm, setBasicForm] = useState({})
    const [applicantTypeForm, setApplicantTypeForm] = useState()
    const applicationId = '66bf43f0b51f2f3485e6e47d';
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
            `application-management-service/preApplication/basicForm`
        );
        if (basicForm) {
            const { data: form1 } = await GET(
                `application-management-service/formSchema/${basicForm?.generalSchemas?.[0]?.id}`
            );
            setApplicantTypeForm(form1)
        }
    }

    console.log(applicantTypeForm)

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'New Physician / Doctor Application For Jane DOE, MD'} />
            <div className={style.screenPadding}>
                <div className={style.applicationScreenGrid}>
                    <WelcomeCard title={'Welcome to Cambridge Memorial Hospitals Automated Credentialing & Privileging Portal!'} description={'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.'} >
                        {applicantTypeForm !== undefined && 'privilegePortal' in applicantTypeForm?.properties && (
                            <ApplicationFieldCard object={applicantTypeForm?.properties?.privilegePortal} gridStyle={style.twoCol} baseKey={'privilegePortal'} basicForm={basicForm} setBasicForm={setBasicForm} isBasicPath={true} />
                        )}
                    </WelcomeCard>
                    <ApplicationUserCard user={'Guest User'} applyingFor={'Contact'} />
                </div>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        <div className={style.applicationCardStyle}>
                            <div className={style.titleTextStyle}>Recommended & Required List of Documents to have Readily Available for this Application</div>
                            <div className={style.marginTop}>
                                <RequiredDocumentCard array={requiredDocument} />
                            </div>
                        </div>
                        <div className={style.marginTop}>
                            <WelcomeCard title={'Immunization History'} description={'For the type of position you are applying for you are to provide your current immunization status for specific communication diseases. Including proof of vaccination and attestation by your primary care physician.'} />
                        </div>
                        <div className={style.marginTop}>
                            <WelcomeCard title={'N95 Face Mask Respirator Fit Test'} description={'For the type of position you are applying for you are to provide your current immunization status for specific communication diseases. Including proof of vaccination and attestation by your primary care physician.'} />
                        </div>
                    </div>
                    <div>
                        <DaysToComplete days={7} />
                        <div className={style.marginTop10}>
                            <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                        </div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`}>NOT READY TO START</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step1')}>READY TO START MY APPLICATION</div>
                    </div>
                </div>
            </div>
            {/* {isOpen && (
                <LoginDialog getIsOpen={getIsOpen} />
            )} */}
        </div>
    )
}

export default ApplicationFormRequirement;