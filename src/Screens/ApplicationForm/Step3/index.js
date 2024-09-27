import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET, PUT } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';

import style from './index.module.scss';

const Step3 = ({ basicForm, setBasicForm, applicationId }) => {
    const [formSchema, setFormSchema] = useState();
    const [applicantProfile, setApplicantProfile] = useState();
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm?.formSchemas?.[1]?.id])

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        console.log(profile, 'profile')
        setApplicantProfile(profile)
    }

    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[1]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[1]?.id}`
            );
            setFormSchema(form?.schema)
        }
    }
    const handleSubmitApplicationReq = async () => {
        if (isEdited) {
            let temp = {
                schemaId: basicForm?.forms?.[1]?.schemaId,
                data: basicForm?.forms?.[1]?.data
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[1]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Application Updated Successfully");
                    if (sessionStorage.getItem('fromSummary') === "true") {
                        navigate(-1);
                    }
                    else {
                        navigate('/applicationForm/section1/step4')

                    }
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
            let addressData = applicantProfile;
            addressData.contactAddress2 = basicForm?.forms?.[1]?.data.contactAddress2 !== undefined ? basicForm?.forms?.[1]?.data.contactAddress2 : null
            addressData.contactAddress3 = basicForm?.forms?.[1]?.data.contactAddress3 !== undefined ? basicForm?.forms?.[1]?.data.contactAddress3 : null
            await PUT(`application-management-service/application/${applicationId}/profile`, addressData)
                .then(response => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                });
        } else {
            if (sessionStorage.getItem('fromSummary') === "true") {
                navigate(-1);
            }
            else {
                navigate('/applicationForm/section1/step4')

            }
        }
    }

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 1'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={1} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {/* <CommonMailingAddress label={'Business Mailing Address*'} onChangeAddressLine1={() => { }} placeholderAddressLine1={'123 Street'} maxLengthAddressLine1={25} valueAddressLine1={''}
                            onChangeAddressLine2={() => { }} placeholderAddressLine2={'Apartment 5'} maxLengthAddressLine2={25} valueAddressLine2={''} onChangeCity={() => { }} placeholderCity={'City'} maxLengthCity={25}
                            valueCity={''} onChangeState={() => { }} placeholderState={'Province'} maxLengthState={25} valueState={''} onChangeZipcode={() => { }} placeholderZipcode={'Zipcode'} maxLengthZipcode={15} valueZipcode={''} /> */}
                        {formSchema !== undefined && 'contactAddress1' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress1} gridStyle={style.homeMailingAddressGrid} baseKey={'contactAddress1'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[1].data`} setIsEdited={getIsEdited} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'contactAddress2' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress2} gridStyle={style.mailingAddressGrid} baseKey={'contactAddress2'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[1].data`} setIsEdited={getIsEdited} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'contactAddress3' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress3} gridStyle={style.businessMailingAddressGrid} baseKey={'contactAddress3'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[1].data`} setIsEdited={getIsEdited} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => { handleSubmitApplicationReq() }}>CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step3;