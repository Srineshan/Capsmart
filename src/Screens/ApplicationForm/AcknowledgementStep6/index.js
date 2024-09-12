import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import pdf from "../../../images/OffenceDeclaration.png";
import pdf2 from "../../../images/OffenceDeclaration2.png";
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../Components/ESign';

const ApplicationAcknowledgementStep6 = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === 'true') {
            navigate(-1);
        } else {
            navigate('/applicationForm/section1/acknowledgementStep7')
        }
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 6'} dataType={'Forms'} title={'Offence Declaration'} timeNumber={36} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        <img src={pdf} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf2} alt="" className={style.pdfStyle} />
                        <ESign />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()} >CONTINUE</div>
                    </div>
                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep6;