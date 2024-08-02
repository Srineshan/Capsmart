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

const ApplicationAcknowledgementStep10 = ({ basicForm, setBasicForm }) => {
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
            `application-management-service/formSchema/${basicForm?.formSchemas?.[13]?.id}`
        );
        setFormSchema(form)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 10'} dataType={'Disclosure'} title={'Pharmacy Signature Template'} timeNumber={40} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {formSchema !== undefined && 'pharmacySignatureTemplate' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.pharmacySignatureTemplate?.properties?.pharmacySignatureTemplate} gridStyle={style.pharmacySignatureAddressGrid} baseKey={'pharmacySignatureTemplate'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )}
                        <div className={style.displayInRowRev}>
                            <div className={`${style.continue} ${style.marginTop10} ${style.createButtonStyle}`} >CREATE</div>
                        </div>
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/acknowledgementStep11')} >CONTINUE</div>

                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep10;