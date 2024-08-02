import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import pdf from "../../../images/PhysicianPaymentOrder.png";
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../Components/ESign';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import NoDataBox from '../../../Components/ReusableSmallComponents/noDataBox';

const ApplicationAcknowledgementStep11 = ({ basicForm, setBasicForm }) => {
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
            `application-management-service/formSchema/${basicForm?.formSchemas?.[14]?.id}`
        );
        setFormSchema(form)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 11'} dataType={'Disclosure'} title={'Physician Payment Order'} timeNumber={41} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {formSchema !== undefined && 'physicianPaymentOrder' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.physicianPaymentOrder} gridStyle={style.physicianPaymentOrderGrid} baseKey={'physicianPaymentOrder'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )}
                        <NoDataBox
                            heading={'Information Requirement Alert'}
                            subHeading={'For this application you are required to provide a void cheque.'}
                            subHeading2={'You will not be able to submit your application if this is not provided.'}
                        />
                        {/* <img src={pdf} alt="" className={style.pdfStyle} />*/}
                        <ESign />
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

export default ApplicationAcknowledgementStep11;