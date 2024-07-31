import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';

import style from './index.module.scss';

const Step7 = ({ basicForm, setBasicForm }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[5]?.id}`
        );
        setFormSchema(form)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 7'} dataType={'Documents and Data'} title={formSchema?.title} timeNumber={16} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'trainingAndWorkingExperience' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.trainingAndWorkingExperience} gridStyle={style.trainingGrid} baseKey={'trainingAndWorkingExperience'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'healthcareFacilityAppointments' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.healthcareFacilityAppointments} gridStyle={style.healthCareGrid} baseKey={'healthcareFacilityAppointments'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`}
                    // onClick={() => navigate('/applicationForm/section1/step8')}
                    >CONTINUE</div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step7;