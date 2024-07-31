import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';

import style from './index.module.scss';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';

const Step6 = ({ basicForm, setBasicForm }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[4]?.id}`
        );
        setFormSchema(form)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 6'} dataType={'Forms'} title={formSchema?.title} timeNumber={8} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'underGraduate' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.underGraduate} gridStyle={style.EducationGrid} baseKey={'underGraduate'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'postGraduate' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.postGraduate} gridStyle={style.EducationGrid} baseKey={'postGraduate'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step7')}>CONTINUE</div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step6;