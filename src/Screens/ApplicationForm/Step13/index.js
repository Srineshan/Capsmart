import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';

import style from './index.module.scss';

const Step13 = ({ basicForm, setBasicForm, applicationId }) => {
    const [formSchema, setFormSchema] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[11]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const handleSubmitApplicationReq = async () => {
        if (isEdited) {
            let temp = {
                schemaId: basicForm?.forms?.[11]?.schemaId,
                data: basicForm?.forms?.[11]?.data
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[11]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Application Updated Successfully");
                    // navigate('/applicationForm/section1/acknowledgementStep1')
                    navigate('/applicationForm/podcheck')

                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
        } else {
            // navigate('/applicationForm/section1/acknowledgementStep1')
            navigate('/applicationForm/podcheck')
        }
    }

    const getIsEdited = (value) => {
        setIsEdited(value)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 13'} dataType={''} title={formSchema?.title} timeNumber={26} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'impactingPractice' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.impactingPractice} gridStyle={style.criminalHistoryGrid} baseKey={'impactingPractice'} basicForm={basicForm} setBasicForm={setBasicForm} collapsableQuestionCard={true} stepPath={`forms[11].data`} setIsEdited={getIsEdited} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => { handleSubmitApplicationReq() }} >CONTINUE</div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step13;