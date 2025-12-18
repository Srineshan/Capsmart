import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../../Components/validationDialog';

import style from './index.module.scss';
import NoDataBox from '../../../../Components/ReusableSmallComponents/noDataBox';

const CriminalHistory = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const [isEdited, setIsEdited] = useState(false);
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const navigate = useNavigate()
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form' || data?.formCategory === 'Disclosure')?.length === (formIndex + 1)) ? `/applicationForm/${applicationId}/Form/${btoa('PODCheck')}` : `/applicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
            if (formIndex > 0) {
                setNavigateBackURL(`/applicationForm/${applicationId}/${basicForm?.forms[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms[formIndex - 1]?.schemaCategory)}`)
            } else {
                setNavigateBackURL(`/applicationForm/${applicationId}/${basicForm?.forms[0]?.formCategory}/${btoa(basicForm?.forms[0]?.schemaCategory)}`)
            }
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    }, [basicForm, step])

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
    }

    const getAllLabels = (data) => {
        setLabels(prev => {
            const exists = prev.some(item => JSON.stringify(item) === JSON.stringify(data));
            return exists ? prev : [...prev, data];
        });
    };

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }


    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[formIndex]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
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
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index]?.label })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrested`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrested`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedText`, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedFile`, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPractice`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPractice`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeText`, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeFile`, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrested`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPractice`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeResponse`]
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleSubmitApplicationReq()
        }
        setWarningFields(missingKeys)
        console.log(keyValuePair, 'Metadata', missingKeys)
    }

    const getDataStatus = () => {
        let missingItems = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index]?.label, mandatory: labels[index]?.mandatory })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingItems.push(data)
            }
        })
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrested`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrested`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedText`, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedFile`, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPractice`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPractice`) === undefined) {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeText`, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeFile`, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrested`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.haveYouBeenArrestedResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.criminalData1.criminalHistory.medicalPractice`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.criminalData1.criminalHistory.medicalPracticeResponse`]
            let temp = missingItems?.filter(data => !filterKeys?.includes(data?.key));
            missingItems = temp;
        }
        return missingItems;
    }

    const handleSubmitApplicationReq = async (data) => {
        if (isEdited || data) {
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: basicForm?.forms?.[formIndex]?.data,
                unFilledFields: warningFields?.map(data => data?.label),
                acknowledged: true,
                dataStatus: getDataStatus()?.filter(data => data?.mandatory)?.length > 0 ? 'SKIPPED_MANDATORY_FIELD' : getDataStatus()?.length > 0 ? 'SKIPPED_NON_MANDATORY_FIELD' : 'COMPLETED'
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    setBasicForm(response?.data)
                    SuccessToaster("Application Updated Successfully");
                    getPreApplication()
                    if (sessionStorage.getItem('fromSummary') === "true") {
                        navigate(-1);
                        sessionStorage.setItem('fromSummary', false)
                    }
                    else {
                        navigate(navigateURL)

                    }
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
        } else {
            if (sessionStorage.getItem('fromSummary') === "true") {
                navigate(-1);
                sessionStorage.setItem('fromSummary', false)
            }
            else {
                navigate(navigateURL)

            }
        }
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    const handleBackClick = () => {
        navigate(navigateBackURL)
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 12'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={24} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'criminalData1' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.criminalData1} gridStyle={style.criminalHistoryGrid} baseKey={'criminalData1'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} collapsableQuestionCard={true} stepPath={`forms[${formIndex}].data`} applicationId={applicationId} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} />
                        )}
                        {formSchema !== undefined && 'criminalData2' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.criminalData2} gridStyle={style.criminalHistoryGrid} baseKey={'criminalData2'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} collapsableQuestionCard={true} stepPath={`forms[${formIndex}].data`} applicationId={applicationId} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} />
                        )}
                        {/* <NoDataBox
                            heading={'Information Requirement Alert'}
                            subHeading={'For this application you are required to provide a valid police vulnerable check certificate .'}
                            subHeading2={'You will not be able to submit your application if this is not provided.'}
                        /> */}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={style.stickyContainer}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.saveInProgress} ${style.marginTop10} `} onClick={() => getSkipClicked(true)} > SKIP FOR NOW </div>
                        <div className={style.twoColForButton}>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={handleBackClick}>BACK</div>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => getMissingFields()}>CONTINUE</div>
                        </div>
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

export default CriminalHistory;