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

const Step11 = ({ basicForm, setBasicForm, applicationId }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[9]?.id}`
        );
        setFormSchema(form)
    }

    const handleSubmitApplicationReq = async () => {
        let temp = {
            schemaId: basicForm?.forms?.[9]?.schemaId,
            data: basicForm?.forms?.[9]?.data
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[9]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
                navigate('/applicationForm/section1/step12')
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 11'} dataType={'Documents and Data'} title={formSchema?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'conductDisclosure1' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.conductDisclosure1} gridStyle={style.conductGrid} baseKey={'conductDisclosure1'} basicForm={basicForm} setBasicForm={setBasicForm} collapsableQuestionCard={true} stepPath={`forms[9].data`} />
                        )}
                        {formSchema !== undefined && 'conductDisclosure2' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.conductDisclosure2} gridStyle={style.conductGrid} baseKey={'conductDisclosure2'} basicForm={basicForm} setBasicForm={setBasicForm} collapsableQuestionCard={true} stepPath={`forms[9].data`} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => { handleSubmitApplicationReq() }}>CONTINUE</div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step11;