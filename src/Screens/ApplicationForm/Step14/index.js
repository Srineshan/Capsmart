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
import NoDataBox from '../../../Components/ReusableSmallComponents/noDataBox';

const Step14 = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[16]?.id}`
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
            schemaId: data?.forms?.[16]?.schemaId,
            data: data?.forms?.[16]?.data
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[16]?.id}`, temp)
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
                <ProgressCard step={'STEP 9'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={2} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'respiratoryFitTesting' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.respiratoryFitTesting} gridStyle={style.licenseGrid} baseKey={'respiratoryFitTesting'} basicForm={basicForm} setBasicForm={setBasicForm} addMoreType={true} formId={basicForm?.forms?.[16]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} />
                        )}
                        {/* <NoDataBox
                            heading={'Information Requirement Alert'}
                            subHeading={'For this application you are required to provide information on all of the different Professional licenses & Board certification you have.'}
                            subHeading2={'You will not be able to submit your application if this is not provided.'}
                        /> */}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate('/applicationForm/section1/step10')} >CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step14;