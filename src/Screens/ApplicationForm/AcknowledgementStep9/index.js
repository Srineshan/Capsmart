import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import logo from "../../../images/cambridgeHospital.png";
import { GET, PUT } from '../../dataSaver';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ESign from '../../../Components/ESign';

const ApplicationAcknowledgementStep9 = ({ basicForm, setBasicForm, applicationId }) => {
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

    const handleSubmitApplicationReq = async () => {
        let temp = {
            schemaId: basicForm?.forms?.[12]?.schemaId,
            data: basicForm?.forms?.[12]?.data
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[12]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
                navigate('/applicationForm/section1/acknowledgementStep10')
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
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
                            <ApplicationFieldCard object={formSchema?.properties?.accessAgreementFormPACSRequest?.properties?.accessAgreementFormPACSRequest} gridStyle={style.pacsRequestGrid} baseKey={'accessAgreementFormPACSRequest'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[12].data`} />
                        )}
                        {formSchema !== undefined && 'agreeToComplyWithHospitalPolicy' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.agreeToComplyWithHospitalPolicy?.properties?.agreeToComplyWithHospitalPolicy} gridStyle={style.pacsRequestGrid} baseKey={'agreeToComplyWithHospitalPolicy'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[12].data`} />
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
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => { handleSubmitApplicationReq() }} >CONTINUE</div>

                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep9;