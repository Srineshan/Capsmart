import React, { useState } from 'react'

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

const ApplicationFormRequirement = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const requiredDocument = [{ title: 'Passport Size Photo' }, { title: 'Curriculum Vitae' }
        // , { title: 'Professional Liability Insurance Coverage' }, { title: 'Education / College Diplomas, Degrees & Certificate' }, { title: 'Vulnerable Sector Police Check' }
    ]
    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'New {Doctor} {Full Time} Application For {First Last Name}'} />
            <div className={style.screenPadding}>
                <div className={style.applicationScreenGrid}>
                    <WelcomeCard title={'Welcome to Cambridge Memorial Hospitals Automated Credentialing & Privileging Portal!'} description={'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.'} />
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