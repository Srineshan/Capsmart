import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';

import style from './index.module.scss';

const Step3 = ({ basicForm, setBasicForm }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[1]?.id}`
        );
        setFormSchema(form)
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 3'} dataType={'Forms'} title={'Your Contact Address(es)'} timeNumber={1} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {/* <CommonMailingAddress label={'Business Mailing Address*'} onChangeAddressLine1={() => { }} placeholderAddressLine1={'123 Street'} maxLengthAddressLine1={25} valueAddressLine1={''}
                            onChangeAddressLine2={() => { }} placeholderAddressLine2={'Apartment 5'} maxLengthAddressLine2={25} valueAddressLine2={''} onChangeCity={() => { }} placeholderCity={'City'} maxLengthCity={25}
                            valueCity={''} onChangeState={() => { }} placeholderState={'Province'} maxLengthState={25} valueState={''} onChangeZipcode={() => { }} placeholderZipcode={'Zipcode'} maxLengthZipcode={15} valueZipcode={''} /> */}
                        {formSchema !== undefined && 'contactAddress1' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress1} gridStyle={style.homeMailingAddressGrid} baseKey={'contactAddress1'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'contactAddress2' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress2} gridStyle={style.businessMailingAddressGrid} baseKey={'contactAddress2'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`}
                        onClick={() => navigate('/applicationForm/section1/step4')}
                    >CONTINUE</div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step3;