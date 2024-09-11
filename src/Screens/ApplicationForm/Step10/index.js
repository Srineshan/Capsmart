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

const Step10 = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[8]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const getIsSubmitClicked = (value, data) => {
        if (value) {
            handleSubmitApplicationReq(data)
        }
    }

    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: data?.forms?.[8]?.schemaId,
            data: data?.forms?.[8]?.data
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[8]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 10'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={20} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'references' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.references} gridStyle={style.twoCol} baseKey={'references'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} formId={basicForm?.forms?.[8]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'privilegeReferences' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.privilegeReferences} gridStyle={style.twoCol} baseKey={'privilegeReferences'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} formId={basicForm?.forms?.[8]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step11')}>CONTINUE</div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step10;