import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import pdf from "../../../../images/PhysicianPaymentOrder.png";
import { GET, PUT } from '../../../dataSaver';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import style from './index.module.scss';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../../Components/ESign';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import NoDataBox from '../../../../Components/ReusableSmallComponents/noDataBox';
import CommonTextField from '../../../../Components/CommonFields/CommonTextField';
import CommonPhoneField from '../../../../Components/CommonFields/CommonPhoneField';
import { FormatPhoneNumber } from '../../../../utils/formatting';
import CommonDateField from '../../../../Components/CommonFields/CommonDateField';
import { TextField } from '@mui/material';
import { format } from 'date-fns';
import CommonSwitch from '../../../../Components/CommonFields/CommonSwitch';
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';

const ApplicationAcknowledgementStep11 = ({ basicForm, setBasicForm, applicationId }) => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [applicantProfile, setApplicantProfile] = useState();
    const [calendarStart, setCalendarStart] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [incorporated, setIncorporated] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [areYouACorporate, setAreYouACorporate] = useState(false);
    const [socialInsuranceNumber, setSocialInsuranceNumber] = useState('');
    const [sex, setSex] = useState('');
    const TEXTFIELDLEN50 = 50;
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

    useEffect(() => {
        setSex(applicantProfile?.sex);
        setDateOfBirth(applicantProfile?.dateOfBirth)
    }, [applicantProfile])

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        setApplicantProfile(profile)
    }

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[14]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const handleChange = () => {

    }

    const handleSubmitApplicationReq = async () => {
        if (isEdited) {
            let temp = {
                schemaId: basicForm?.forms?.[14]?.schemaId,
                data: basicForm?.forms?.[14]?.data
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[14]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Application Updated Successfully");
                    navigate('/applicationForm/ApplicationAcknowledgement')
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
        } else {
            navigate('/applicationForm/ApplicationAcknowledgement')
        }
        let addressData = applicantProfile;
        addressData.sex = sex
        addressData.dateOfBirth = dateOfBirth
        await PUT(`application-management-service/application/${applicationId}/profile`, addressData)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                navigate('/applicationForm/section1/acknowledgementStep10')
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }
    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={41} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {/* {formSchema !== undefined && 'physicianPaymentOrder' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.physicianPaymentOrder} gridStyle={style.physicianPaymentOrderGrid} baseKey={'physicianPaymentOrder'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[14].data`} setIsEdited={getIsEdited} />
                        )} */}
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{'Physician Payment Order'}</div>
                        <div className={`${style.twoCol} ${style.marginTop}`}>
                            <CommonTextField
                                value={applicantProfile?.name?.lastName}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Last Name'}
                                required={true}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.name?.firstName}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'First name'}
                                required={true}
                                type={'text'}
                            />
                            <CommonTextField
                                value={applicantProfile?.email?.officialEmail}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('email', e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Email Address'}
                                required={true}
                                type={'text'}
                            />
                        </div>
                        <div className={`${style.twoCol} ${style.marginTop}`}>
                            <CommonSwitch label={areYouACorporate ? 'YES' : 'NO'} checked={areYouACorporate} onChange={(e) => setAreYouACorporate(e.target.checked)} labelName={'Are you a Corporation'} required={true} />
                        </div>
                        {areYouACorporate ? (
                            <div className={`${style.address1Grid} ${style.marginTop}`}>
                                <CommonTextField
                                    value={applicantProfile?.contactAddress3?.business?.businessName}
                                    className={style.fullWidth}
                                    onChange={(e) => handleChange('corporationName', e.target.value)}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={''}
                                    label={'Corporation Name'}
                                    required={false}
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
                                    value={phoneNumber}
                                    className={style.fullWidth}
                                    onChange={(e) => { }}
                                    placeholder={''}
                                    label={'Phone Number'}
                                    required={false}
                                />
                                <CommonDateField
                                    className={style.fullWidth}
                                    open={calendarStart}
                                    onOpen={() => setCalendarStart(true)}
                                    onClose={() => setCalendarStart(false)}
                                    // minDate={sub(new Date(), { years: 3 })}
                                    // maxDate={add(new Date(), { months: 6 })}
                                    value={incorporated}
                                    onChange={(newValue) => setIncorporated(format(new Date(newValue), 'yyyy-MM-dd'))}
                                    InputProps={{
                                        style: {
                                            fontSize: 14,
                                            height: 30,
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                // placeholder: `Enter Date Of Birth`,
                                            }}
                                            // color={(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === null || getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === '') ? (isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))) ? 'error' : 'warning' : ''}
                                            fullWidth
                                        // focused={(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === null || getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === '') ? true : false}
                                        />
                                    )}
                                    label={"Incorporated"}
                                    required={true}
                                />
                                <CommonPhoneField
                                    value={applicantProfile?.contactAddress3?.business?.businessPhone}
                                    className={style.fullWidth}
                                    onChange={(e) => { }}
                                    placeholder={''}
                                    label={'Business Phone'}
                                    required={false}
                                />
                            </div>
                        ) : (
                            <div className={`${style.address2Grid} ${style.marginTop}`}>
                                <CommonTextField
                                    value={applicantProfile?.contactAddress2?.mailingAddress?.streetName}
                                    className={style.fullWidth}
                                    onChange={(e) => { }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={''}
                                    label={'Home Address'}
                                    required={true}
                                    type={'text'}
                                />
                                <CommonTextField
                                    value={applicantProfile?.contactAddress2?.mailingAddress?.city}
                                    className={style.fullWidth}
                                    onChange={(e) => { }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={'Enter City'}
                                    label={''}
                                    required={false}
                                    type={'text'}
                                />
                                <CommonTextField
                                    value={applicantProfile?.contactAddress2?.mailingAddress?.province}
                                    className={style.fullWidth}
                                    onChange={(e) => { }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={'Enter Province'}
                                    label={''}
                                    required={false}
                                    type={'text'}
                                />
                                <CommonTextField
                                    value={applicantProfile?.contactAddress2?.mailingAddress?.pinCode}
                                    className={style.fullWidth}
                                    onChange={(e) => { }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={'Enter Zipcode'}
                                    label={''}
                                    required={false}
                                    type={'text'}
                                />
                                <CommonDateField
                                    className={style.fullWidth}
                                    open={calendarStart}
                                    onOpen={() => setCalendarStart(true)}
                                    onClose={() => setCalendarStart(false)}
                                    // minDate={sub(new Date(), { years: 3 })}
                                    // maxDate={add(new Date(), { months: 6 })}
                                    value={dateOfBirth}
                                    onChange={(newValue) => setDateOfBirth(format(new Date(newValue), 'yyyy-MM-dd'))}
                                    InputProps={{
                                        style: {
                                            fontSize: 14,
                                            height: 30,
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            inputProps={{
                                                ...params.inputProps,
                                                // placeholder: `Enter Date Of Birth`,
                                            }}
                                            // color={(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === null || getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === '') ? (isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))) ? 'error' : 'warning' : ''}
                                            fullWidth
                                        // focused={(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === null || getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === '') ? true : false}
                                        />
                                    )}
                                    label={"Date Of Birth"}
                                    required={true}
                                />
                                <CommonSelectField
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                    className={style.fullWidth}
                                    // firstOptionLabel={fieldData.label}
                                    // firstOptionValue={fieldData.label}
                                    valueList={['MALE', 'FEMALE', 'OTHERS']}
                                    labelList={['Male', 'Female', 'Others']}
                                    disabledList={['Male', 'Female', 'Others'].map(data => false)}
                                    label={'Sex'}
                                    required={true}
                                />
                                <CommonPhoneField
                                    value={phoneNumber}
                                    className={style.fullWidth}
                                    onChange={(e) => { }}
                                    placeholder={''}
                                    label={'Phone Number'}
                                    required={false}
                                />
                                <CommonTextField
                                    value={socialInsuranceNumber}
                                    className={style.fullWidth}
                                    onChange={(e) => { setSocialInsuranceNumber(e.target.value) }}
                                    maxLength={TEXTFIELDLEN50}
                                    placeholder={''}
                                    label={'Social Insurance Number'}
                                    required={false}
                                    type={'text'}
                                />
                            </div>
                        )}
                        {/* <div className={`${style.twoCol} ${style.marginTop}`}>
                            <CommonDateField
                                className={style.fullWidth}
                                open={calendarStart}
                                onOpen={() => setCalendarStart(true)}
                                onClose={() => setCalendarStart(false)}
                                // minDate={sub(new Date(), { years: 3 })}
                                // maxDate={add(new Date(), { months: 6 })}
                                value={dateOfBirth}
                                onChange={(newValue) => setDateOfBirth(format(new Date(newValue), 'yyyy-MM-dd'))}
                                InputProps={{
                                    style: {
                                        fontSize: 14,
                                        height: 30,
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        inputProps={{
                                            ...params.inputProps,
                                            // placeholder: `Enter Date Of Birth`,
                                        }}
                                        // color={(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === null || getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === '') ? (isLableEmpty(fieldData.label) ? false : (object.required?.includes(fieldKey) || (parentData !== null ? parentData.required?.includes(fieldKey) : false))) ? 'error' : 'warning' : ''}
                                        fullWidth
                                    // focused={(getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === null || getValueByPath(basicForm, `${basicpath}.${baseKey}.${fieldKey}`) === '') ? true : false}
                                    />
                                )}
                                label={"Date Of Birth"}
                                required={true}
                            />
                            <CommonTextField
                                value={''}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('address', e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={''}
                                label={'Address'}
                                required={false}
                                type={'text'}
                            />
                            <CommonTextField
                                value={''}
                                className={style.fullWidth}
                                onChange={(e) => handleChange('zipcode', e.target.value)}
                                maxLength={TEXTFIELDLEN50}
                                placeholder={'Enter Zipcode'}
                                label={''}
                                required={false}
                                type={'text'}
                            />
                            <CommonPhoneField
                                value={''}
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
                        </div>*/}
                        {/* <NoDataBox
                            heading={'Information Requirement Alert'}
                            subHeading={'For this application you are required to provide a void cheque.'}
                            subHeading2={'You will not be able to submit your application if this is not provided.'}
                        /> */}
                        {/* <img src={pdf} alt="" className={style.pdfStyle} />*/}
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

export default ApplicationAcknowledgementStep11;