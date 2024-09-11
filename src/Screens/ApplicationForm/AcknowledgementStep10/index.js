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
import CommonTextField from '../../../Components/CommonFields/CommonTextField';
import CommonPhoneField from '../../../Components/CommonFields/CommonPhoneField';
import { FormatPhoneNumber } from '../../../utils/formatting';

const ApplicationAcknowledgementStep10 = ({ basicForm, setBasicForm, applicationId }) => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [applicantProfile, setApplicantProfile] = useState();
    const TEXTFIELDLEN50 = 50;
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[13]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const handleChange = () => {

    }

    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        setApplicantProfile(profile)
    }

    const handleSubmitApplicationReq = async () => {
        if (isEdited) {
            let temp = {
                schemaId: basicForm?.forms?.[13]?.schemaId,
                data: basicForm?.forms?.[13]?.data
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[13]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Application Updated Successfully");
                    navigate('/applicationForm/section1/acknowledgementStep11')
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
        } else {
            navigate('/applicationForm/section1/acknowledgementStep11')
        }
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 10'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={40} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {/* {formSchema !== undefined && 'pharmacySignatureTemplate' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.pharmacySignatureTemplate?.properties?.pharmacySignatureTemplate} gridStyle={style.pharmacySignatureAddressGrid} baseKey={'pharmacySignatureTemplate'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[13].data`} setIsEdited={getIsEdited} />
                        )} */}
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{'Pharmacy Signature Template'}</div>
                        <div className={`${style.pharmacySignatureAddressGrid2} ${style.marginTop}`}>
                            <CommonTextField
                                value={`${applicantProfile?.name?.lastName}, ${applicantProfile?.name.firstName}`}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Surname'}
                                required={true}
                                type={'text'}
                            />
                            <CommonTextField
                                value={''}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('initials', e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Initials'}
                                required={true}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.contactAddress3?.business?.businessAddress?.streetName}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Office Address'}
                                required={true}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.contactAddress3?.business?.businessAddress?.city}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={'Enter City'}
                                label={''}
                                required={false}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.contactAddress3?.business?.businessAddress?.province}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={'Enter Province'}
                                label={''}
                                required={false}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.contactAddress3?.business?.businessAddress?.pinCode}
                                className={style.fullWidth}
                                onChange={(e) => { }}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={'Enter Zipcode'}
                                label={''}
                                required={false}
                                type={'text'}
                            />
                            <CommonPhoneField
                                value={applicantProfile?.mobileNumber}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('cellphone', FormatPhoneNumber(e.target.value))}
                                placeholder={''}
                                label={'Cell Phone'}
                                required={false}
                            />
                            <CommonTextField
                                value={''}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('signature', e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={'Enter Signature'}
                                label={''}
                                required={false}
                                type={'text'}
                            />
                        </div>
                        <div className={style.displayInRowRev}>
                            <div className={`${style.continue} ${style.marginTop10} ${style.createButtonStyle}`} >CREATE</div>
                        </div>
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
                    <div className={`${style.continue} ${style.marginTop10}`} onClick={() => { handleSubmitApplicationReq() }} >CONTINUE</div>

                    {/* <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default ApplicationAcknowledgementStep10;