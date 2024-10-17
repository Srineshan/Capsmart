import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import { GET, PUT } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';

import style from './index.module.scss';

const ContactAddress = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [applicantProfile, setApplicantProfile] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [uniqueLabels, setUniqueLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const [navigateURL, setNavigateURL] = useState();
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form')?.length === (formIndex + 1)) ? '/applicationForm/Form/PODCheck' : `/applicationForm/${basicForm?.forms[formIndex + 1]?.formCategory}/${basicForm?.forms[formIndex + 1]?.schemaCategory}`)
        }
    }, [basicForm?.formSchemas?.[formIndex]?.id, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])

    useEffect(() => {
        getApplicantProfile()
    }, [applicationId])

    useEffect(() => {
        setLabels(uniqueLabels?.map(data => data?.labels));
    }, [uniqueLabels])

    // const getIsOpen = (value) => {
    //     setIsOpen(value);
    // }

    const getIsValidationDialogOpen = (value) => {
        setShowValidationDialog(value);
    }

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, 'Metadata')
            temp.push(data);
        }
        setMetadata(temp);
        console.log("tempdataaa", metadata)
    }

    const addObjectIfNotPresent = (array, newObject) => {
        const objectExists = array.some((obj) =>
            Object.keys(newObject).every((key) => obj[key] === newObject[key])
        );

        if (!objectExists) {
            array.push(newObject);
        }

        return array;
    };

    const getAllLabels = (data) => {
        let tempLabels = addObjectIfNotPresent(uniqueLabels, data);
        setUniqueLabels(tempLabels)
        console.log("tempLabelsssss", tempLabels, uniqueLabels, data)
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }


    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        console.log(profile, 'profile')
        setApplicantProfile(profile)

        console.log("application-idddddd" + applicationId)
    }

    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[formIndex]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
            );
            setFormSchema(form?.schema)
        }
    }

    const getIsSubmitClicked = (value, data) => {
        if (value) {
            handleSubmitApplicationReq(data)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            handleSubmitApplicationReq("skipped")
        }
    }

    const getMissingFields = () => {
        let missingKeys = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: uniqueLabels?.filter(labelData => labelData?.path === data)[0]?.label })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        if (!getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== undefined && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== null) {
            let registeredBusinessAddressKeys = [`forms[${formIndex}].data.contactAddress3.business.businessName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.streetName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.pinCode`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.city`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.province`, `forms[${formIndex}].data.contactAddress3.business.businessPhone`, `forms[${formIndex}].data.contactAddress3.business.businessWebsite`]
            let temp = missingKeys?.filter(data => !registeredBusinessAddressKeys?.includes(data?.key));
            missingKeys = temp;
        }
        setWarningFields(missingKeys)
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleSubmitApplicationReq()
        }
        console.log(keyValuePair, 'Metadata', missingKeys, getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`))
    }


    const handleSubmitApplicationReq = async (skip) => {
        if (isEdited) {
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: basicForm?.forms?.[formIndex]?.data,
                unFilledFields: warningFields?.map(data => data?.label),
                acknowledged: skip === "skipped" ? false : true
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Application Updated Successfully");
                    getPreApplication()
                    if (sessionStorage.getItem('fromSummary') === "true") {
                        navigate(-1);
                    }
                    else {
                        navigate(navigateURL)

                    }
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
            let addressData = applicantProfile;
            addressData.contactAddress2 = basicForm?.forms?.[formIndex]?.data.contactAddress2 !== undefined ? basicForm?.forms?.[formIndex]?.data.contactAddress2 : null
            addressData.contactAddress3 = basicForm?.forms?.[formIndex]?.data.contactAddress3 !== undefined ? basicForm?.forms?.[formIndex]?.data.contactAddress3 : null
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
                navigate(navigateURL)

            }
        }
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log("path..........." + path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

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
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress1} gridStyle={style.homeMailingAddressGrid} baseKey={'contactAddress1'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[${formIndex}].data`} setIsEdited={getIsEdited} warningFields={warningFields} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'contactAddress2' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress2} gridStyle={style.mailingAddressGrid} baseKey={'contactAddress2'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[${formIndex}].data`} setIsEdited={getIsEdited} warningFields={warningFields} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'contactAddress3' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactAddress3} gridStyle={style.businessMailingAddressGrid} baseKey={'contactAddress3'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[${formIndex}].data`} setIsEdited={getIsEdited} warningFields={warningFields} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => getMissingFields()}>CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
            {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
            )}
        </div>
    )
}

export default ContactAddress;