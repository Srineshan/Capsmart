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
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ESign from '../../../Components/ESign';

const ApplicationAcknowledgementStep9 = ({ basicForm, setBasicForm }) => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    const [formSchema, setFormSchema] = useState();
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[12]?.id}`
        );
        setFormSchema(form)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 9'} dataType={'Disclosure'} title={'PACS Request'} timeNumber={39} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {formSchema !== undefined && 'accessAgreementFormPACSRequest' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.accessAgreementFormPACSRequest?.properties?.accessAgreementFormPACSRequest} gridStyle={style.pacsRequestGrid} baseKey={'accessAgreementFormPACSRequest'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )}
                        <div className={`${style.boldNote} ${style.marginTop}`}>Your User ID and Password will be assigned to you and the PACS administrator will contact you with the information. Please read the below statement and Sign.</div>
                        <div className={style.marginTop}>
                            <CommonCheckBox checked={true} onChange={(e) => { }} label="I understand the necessity of confidentiality of my password and agree to comply with Hospital Policy regarding the confidentiality of patient data." />
                        </div>
                        <ESign />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/acknowledgementStep10')} >CONTINUE</div>

                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep9;