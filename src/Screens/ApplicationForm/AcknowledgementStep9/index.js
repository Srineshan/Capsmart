import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import logo from "../../../images/cambridgeHospital.png";
import { GET, PUT } from '../../dataSaver';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ESign from '../../../Components/ESign';
import CommonTextField from '../../../Components/CommonFields/CommonTextField';
import CommonPhoneField from '../../../Components/CommonFields/CommonPhoneField';
import { FormatPhoneNumber } from '../../../utils/formatting';

const ApplicationAcknowledgementStep9 = ({ basicForm, setBasicForm, applicationId }) => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [applicantProfile, setApplicantProfile] = useState();
    const [jobTitle, setJobTitle] = useState();
    const [managerName, setManagerName] = useState();
    // const [applicantProfile, setApplicantProfile] = useState();
    // const [applicantProfile, setApplicantProfile] = useState();
    const TEXTFIELDLEN50 = 50;
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    useEffect(() => {
        setJobTitle(applicantProfile?.jobTitle);
        setManagerName(applicantProfile?.managerName)
    }, [applicantProfile])

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[12]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        console.log(profile, 'profile')
        setApplicantProfile(profile)
    }

    const handleChange = () => {

    }

    const handleSubmitApplicationReq = async () => {
        // if (isEdited) {
        //     let temp = {
        //         schemaId: basicForm?.forms?.[12]?.schemaId,
        //         data: basicForm?.forms?.[12]?.data
        //     }
        //     await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[12]?.id}`, temp)
        //         .then(response => {
        //             console.log(response)
        //             setBasicForm(response?.data)
        //             SuccessToaster("Application Updated Successfully");
        //             navigate('/applicationForm/section1/acknowledgementStep10')
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //             ErrorToaster("Unexpected Error Updating Application");
        //         });
        // } else {
        //     navigate('/applicationForm/section1/acknowledgementStep10')
        // }
        let addressData = applicantProfile;
        addressData.jobTitle = jobTitle
        addressData.managerName = managerName
        await PUT(`application-management-service/application/${applicationId}/profile`, addressData)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                const handleContinue = () => {
                    if (sessionStorage.getItem('fromSummary') === 'true') {
                        navigate(-1);
                    } else {
                        navigate('/applicationForm/section1/acknowledgementStep10')
                    }
                }
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 9'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={39} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {/* {formSchema !== undefined && 'accessAgreementFormPACSRequest' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.accessAgreementFormPACSRequest?.properties?.accessAgreementFormPACSRequest} gridStyle={style.pacsRequestGrid} baseKey={'accessAgreementFormPACSRequest'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[12].data`} setIsEdited={getIsEdited} />
                        )} */}
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{'PACS Request - Access Agreement Form'}</div>

                        <div className={`${style.twoCol} ${style.marginTop}`}>
                            <CommonTextField
                                value={applicantProfile?.name?.firstName}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'First Name'}
                                required={true}
                                type={'text'}
                                readOnly={true}
                            />
                            <CommonTextField
                                value={applicantProfile?.name?.lastName}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Last Name'}
                                required={true}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.department}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Department / Nursing Unit'}
                                required={true}
                                type={'text'}
                            />
                            <CommonTextField
                                value={jobTitle}
                                className={style.fullWidth}
                                onChange={(e) => setJobTitle(e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Job Title'}
                                required={false}
                                type={'text'}
                            />
                            <CommonTextField
                                value={managerName}
                                className={style.fullWidth}
                                onChange={(e) => setManagerName(e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Manager Name'}
                                required={false}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.email.officialEmail}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Email Address'}
                                required={true}
                                type={'text'}
                            />
                            <CommonPhoneField
                                value={applicantProfile?.mobileNumber}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                placeholder={''}
                                label={'Cell Phone'}
                                required={false}
                            />
                        </div>
                        {/* {formSchema !== undefined && 'agreeToComplyWithHospitalPolicy' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.agreeToComplyWithHospitalPolicy?.properties?.agreeToComplyWithHospitalPolicy} gridStyle={style.pacsRequestGrid} baseKey={'agreeToComplyWithHospitalPolicy'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[12].data`} setIsEdited={getIsEdited} />
                        )} */}
                        <div className={`${style.boldNote} ${style.marginTop}`}>Your User ID and Password will be assigned to you and the PACS administrator will contact you with the information. Please read the below statement and Sign.</div>
                        <div className={style.marginTop}>
                            <CommonCheckBox checked={true} onChange={(e) => { }} label="I understand the necessity of confidentiality of my password and agree to comply with Hospital Policy regarding the confidentiality of patient data." />
                        </div>
                        <ESign />
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => { handleSubmitApplicationReq() }} >CONTINUE</div>
                    </div>
                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep9;