import React, { useState } from 'react'

import style from './index.module.scss'
import ProgressCard from '../../Components/ProgressCard';
import ApplicationHeader from '../../Components/ApplicationHeader';
import ApplicationUserCard from '../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../Components/ApplicationAssistanceCard';
import ApplicationReferenceDocuments from '../../Components/ApplicationReferenceDocuments';
import CommonMailingAddress from '../../Components/CommonFields/CommonMailingAddress';
import CommonDivider from '../../Components/CommonFields/CommonDivider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WelcomeCard from '../../Components/WelcomeCard';
import DaysToComplete from '../../Components/DaysToCompleteCard';
import { useNavigate } from 'react-router-dom';
import LoginDialog from '../../Components/LoginDialog';
import RequiredDocumentCard from '../../Components/RequiredDocumentCard';

const ApplicationRequest = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const requiredDocument = [{ title: 'Letter On Interest' }, { title: 'Curriculum Vitae' }]

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    return (
        <div className={style.screenBackground}>
            <ApplicationHeader title={'New {Doctor} {Full Time} Application For {First Last Name}'} />
            <div className={style.screenPadding}>
                <div className={style.applicationScreenGrid}>
                    <WelcomeCard title={'Welcome To Cambridge Memorial Hospitals Automated Credentialing & Privileging Portal!'} description={'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.'} />
                    <ApplicationUserCard user={'Guest User'} applyingFor={'Contact'} />
                </div>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        <div className={style.applicationCardStyle}>
                            <div className={style.titleTextStyle}>Recommended And Required List Of Documents To Have Readily Available For This Application</div>
                            <div className={style.marginTop}>
                                {/* <div className={style.requiredDocumentCard}>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                        <div className={style.documentTextStyle}>Letter On Interest</div>
                                        <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                                    </div>
                                </div>
                                <div className={`${style.requiredDocumentCard} ${style.marginTop5}`}>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                        <div className={style.documentTextStyle}>Curriculum Vitae</div>
                                        <InfoOutlinedIcon sx={{ fontSize: 14, marginLeft: '10px' }} className={style.info} />
                                    </div>
                                </div> */}
                                <RequiredDocumentCard array={requiredDocument} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <DaysToComplete days={7} />
                        <div className={style.marginTop10}>
                            <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                        </div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`}>NOT READY TO START</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/completeApplicationRequest')}>COMPLETE APPLICATION REQUST</div>
                    </div>
                </div>
            </div>
            {/* {isOpen && (
                <LoginDialog getIsOpen={getIsOpen} />
            )} */}
        </div>
    )
}

export default ApplicationRequest;