import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';

import style from './index.module.scss';
import NoDataBox from '../../../Components/ReusableSmallComponents/noDataBox';

const Step4 = ({ basicForm, setBasicForm }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[2]?.id}`
        );
        setFormSchema(form)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 4'} dataType={'Forms'} title={formSchema?.title} timeNumber={2} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'certifications' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.certifications} gridStyle={style.licenseGrid} baseKey={'certifications'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                        <NoDataBox
                            heading={'Information Requirement Alert'}
                            subHeading={'For this application you are required to provide information on all of the different Professional licenses & Board certification you have.'}
                            subHeading2={'You will not be able to submit your application if this is not provided.'}
                        />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step5')} >CONTINUE</div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step4;