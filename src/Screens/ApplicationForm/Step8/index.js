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
import CommonSelectField from '../../../Components/CommonFields/CommonSelectField';

const Step8 = ({ basicForm, setBasicForm }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[6]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        }
        else {
            navigate('/applicationForm/section1/step9')

        }
    }

    const handleChange = () => {

    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 6'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={20} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={style.padding}>
                            <div className={style.cardTitle}>{'Indicate the Privileges you are seeking as a(n) {Associate} for the {department anesthesiology / speciality}'}</div>
                        </div>
                        {/* <CommonSelectField
                            // value={getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) || null}
                            onChange={(e) => handleChange(fieldKey, e.target.value, baseKey)}
                            className={style.fullWidth}
                            // firstOptionLabel={fieldData.label}
                            // firstOptionValue={fieldData.label}
                            valueList={[]}
                            labelList={[]}
                            disabledList={[].map(data => false)}
                            label={'Privilege Category'}
                            required={false}
                            warning={warningFields?.map(data => data?.key)?.includes(`${basicpath}.${baseKey}.${fieldKey}`)}
                        /> */}
                        {/* {formSchema !== undefined && 'privilegeCategories' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.privilegeCategories} gridStyle={style.privilegeGrid} baseKey={'privilegeCategories'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} />
                        )}
                        {formSchema !== undefined && 'additionalInformationAndSupportingDocuments' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.additionalInformationAndSupportingDocuments} gridStyle={style.privilegeGrid} baseKey={'additionalInformationAndSupportingDocuments'} basicForm={basicForm} setBasicForm={setBasicForm} />
                        )} */}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step8;