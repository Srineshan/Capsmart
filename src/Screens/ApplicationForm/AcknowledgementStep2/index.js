import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import logo from "../../../images/cambridgeHospital.png";
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../Components/ESign';

const ApplicationAcknowledgementStep2 = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()

    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === 'true') {
            navigate(-1);
        } else {
            navigate('/applicationForm/section1/acknowledgementStep3')
        }
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 2'} dataType={'Forms'} title={'Authorization And Consent To The Release Of Information From Treating Physician'} timeNumber={32} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <div className={`${style.checkGrid} ${style.marginTop}`}>
                            <CommonCheckBox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                            <div className={`${style.descriptionStyle} ${style.marginTop10}`}>{`I {applicant name}, herby authorize any Physician/Dentist/Midwife, Hospital, University/ College, Clinic or medical/dental association group who have full knowledge referable to my practice, to give full particulars to the Credentials Committee of the Cambridge Memorial Hospital.`}</div>
                        </div>
                        <div className={`${style.checkGrid} ${style.marginTop}`}>
                            <WarningAmberIcon sx={{ color: '#F94848' }} />
                            <div className={`${style.descriptionStyleBolder}`}>Your application cannot be processed without your authorization for the release of your information.</div>
                        </div>
                        <CommonDivider />
                        <ESign />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()} >CONTINUE</div>

                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep2;