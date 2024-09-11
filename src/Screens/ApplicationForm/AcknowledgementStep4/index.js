import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import pdf from "../../../images/CodeofConduct.png";
import pdf2 from "../../../images/CodeofConduct2.png";
import pdf3 from "../../../images/CodeofConduct3.png";
import pdf4 from "../../../images/CodeofConduct4.png";
import pdf5 from "../../../images/CodeofConduct5.png";
import pdf6 from "../../../images/CodeofConduct6.png";
import pdf7 from "../../../images/CodeofConduct7.png";
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../Components/ESign';
import PdfViewer from '../pdfViewer';

const ApplicationAcknowledgementStep4 = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 4'} dataType={'Forms'} title={'Code of Conduct'} timeNumber={34} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
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
                        <img src={pdf3} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf4} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf5} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf6} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf7} alt="" className={style.pdfStyle} />
                        <ESign />
                        {/* <PdfViewer pdfurl={"https://dev-application-management-service.s3.amazonaws.com/64246d491b70b07241d37aa1/66dede8fdf5e683573132ec1/Pixl_Chatbot_Flyer.pdf"} /> */}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/acknowledgementStep5')} >CONTINUE</div>

                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}

                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep4;