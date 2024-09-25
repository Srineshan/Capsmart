import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';

import style from './index.module.scss';

const Step7 = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
    }, [basicForm])

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
        let tempLabels = labels;
        if (!tempLabels?.includes(data)) {
            console.log(tempLabels, data, 'Metadata')
            tempLabels.push(data);
        }
        setLabels(tempLabels);
    }
    
    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    }

    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[5]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[5]?.id}`
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
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index] })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleSubmitApplicationReq()
        }
        setWarningFields(missingKeys)
        console.log(keyValuePair, 'Metadata', missingKeys)
    }


    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: data?.forms?.[5]?.schemaId,
            data: data?.forms?.[5]?.data,
            unFilledFields: metadata,
            acknowledged: data === "skipped" ? false : true
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[5]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
                if (sessionStorage.getItem('fromSummary') === "true") {
                    navigate(-1);
                }
                else {
                    navigate('/applicationForm/section1/step8')

                }
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
            navigate('/applicationForm/section1/step8')

        }
    }
    
    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 5'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={16} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'trainingAndWorkingExperience' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.trainingAndWorkingExperience} gridStyle={style.trainingGrid} baseKey={'trainingAndWorkingExperience'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[5].data`} addMoreType={true} formId={basicForm?.forms?.[5]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} warningFields={warningFields} />
                        )}
                        <CommonDivider />
                        {formSchema !== undefined && 'healthcareFacilityAppointments' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.healthcareFacilityAppointments} gridStyle={style.healthCareGrid} baseKey={'healthcareFacilityAppointments'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[5].data`} addMoreType={true} formId={basicForm?.forms?.[5]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} warningFields={warningFields}/>
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

export default Step7;