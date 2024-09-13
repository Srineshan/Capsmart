import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET, PUT } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';

import style from './index.module.scss';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import NoDataBox from '../../../Components/ReusableSmallComponents/noDataBox';

const Step6 = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
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
        setFormSchema(form?.schema)
    }

    const getIsSubmitClicked = (value, data) => {
        if (value) {
            handleSubmitApplicationReq(data)
        }
    }

    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: data?.forms?.[4]?.schemaId,
            data: data?.forms?.[4]?.data
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[4]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication()
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }

    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        }
        else {
            navigate('/applicationForm/section1/step7')

        }
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 4'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={8} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'graduation' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.graduation} gridStyle={style.EducationGrid} baseKey={'graduation'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} formId={basicForm?.forms?.[4]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid}
                                heading={'Information Requirement Alert'}
                                subHeading={'For this application you are required to provide information on all of the different undergraduate / graduate qualifications you have.'}
                                subHeading2={'You will not be able to submit your application if this is not provided.'} />
                        )}
                        {/* <CommonDivider />
                        {formSchema !== undefined && 'postGraduate' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.postGraduate} gridStyle={style.EducationGrid} baseKey={'postGraduate'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} formId={basicForm?.forms?.[4]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} />
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

export default Step6;