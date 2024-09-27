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

const Step4 = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[2]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[2]?.id}`
            );
            setFormSchema(form?.schema)
        }
    }

    const getIsSubmitClicked = (value, data) => {
        if (value) {
            handleSubmitApplicationReq(data)
        }
    }

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    const handleSubmitApplicationReq = async () => {
        if (isEdited) {
            console.log(basicForm?.forms?.[2]?.data)
            let temp = {
                schemaId: basicForm?.forms?.[2]?.schemaId,
                data: basicForm?.forms?.[2]?.data
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[2]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    SuccessToaster("Application Updated Successfully");
                    getPreApplication();
                    if (sessionStorage.getItem('fromSummary') === "true") {
                        navigate(-1);
                    }
                    else {
                        navigate('/applicationForm/section1/step5')

                    }
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
            let dataListEntry = (sessionStorage.getItem('dataListEntry') !== undefined && sessionStorage.getItem('dataListEntry') !== null) ? JSON.parse(sessionStorage.getItem('dataListEntry')) : '';
            if (dataListEntry !== '') {
                await PUT(`application-management-service/formSchema/${basicForm?.formSchemas?.[2]?.id}/addValueToDatalist`, dataListEntry)
                    .then(response => {
                        sessionStorage.removeItem('dataListEntry')
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            }
        } else {
            if (sessionStorage.getItem('fromSummary') === "true") {
                navigate(-1);
            }
            else {
                navigate('/applicationForm/section1/step5')

            }
        }
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 2'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={2} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'certifications' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.certifications} gridStyle={style.licenseGrid} baseKey={'certifications'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[2].data`} setIsEdited={getIsEdited}
                            // formId={basicForm?.forms?.[2]?.id}  getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid}
                            //     heading={'Information Requirement Alert'}
                            //     subHeading={'For this application you are required to provide information on all of the different Professional licenses & Board certification you have.'}
                            //     subHeading2={'You will not be able to submit your application if this is not provided.'}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()} >CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step4;