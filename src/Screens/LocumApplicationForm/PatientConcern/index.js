import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';
import { GET, PUT } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';
import MenuIcon from "@mui/icons-material/Menu";
import Close from './../../../images/close.png';
import style from './index.module.scss';
import WelcomeCard from '../../../Components/WelcomeCard';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import LocumProgressCard from '../../../Components/LocumProgressCard';
import { Tooltip } from '@mui/material';

const PatientConcern = ({ basicForm, setBasicForm, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const navigate = useNavigate()
    const [isEdited, setIsEdited] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const { applicationId, section, step } = useParams();
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [priorData, setPriorData] = useState();
    let allMissingFields = [];
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex + 1]?.schemaCategory)}`);
            setNavigateBackURL(`/locumApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
        }


    }, [basicForm, formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
        console.log(formIndex);

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
        console.log("level6", data)
    }

    const getAllLabels = (data) => {
        let tempLabels = labels;
        if (tempLabels?.filter(innerData => data?.path === innerData?.path)?.length === 0) {
            console.log(tempLabels, data, 'Metadata9999')
            tempLabels.push(data);
        }
        setLabels(tempLabels);
        console.log();
    }

      const getIsSaveInProgressOpen = (value) => {
        getMissingFields("save");
        setIsSaveInProgressOpen(value);
    }


    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
    }


    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            getMissingFields("skipped");
        }
    };

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };


    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    const handleBackClick = async () => {
        navigate(navigateBackURL)
    }

 
    const PatientDisclosureValue = getValueByPath(
    basicForm,
    `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcerns`
    );

    const PatientDisclosureValueText = getValueByPath(
    basicForm,
    `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcernsText`
    );

    const PatientDisclosureValueFile = getValueByPath(
    basicForm,
    `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcernsFile`
    );

    const isSkipForNowDisabled = 
    PatientDisclosureValue === "No" || 
    (PatientDisclosureValue === "Yes" && PatientDisclosureValueText && PatientDisclosureValueFile);

    console.log('haveSubjectedToPatientConcerns value:', PatientDisclosureValue,PatientDisclosureValueText,PatientDisclosureValueFile);

    const getMissingFields = (data) => {
        let missingKeys = [];
        let keyValuePair = [];
        let hasMandatoryMissingFields = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index] })
        })
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        if (getValueByPath(basicForm, `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcerns`) === 'No' || getValueByPath(basicForm, `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcerns`) === undefined) {
            let filterKeys = [
                `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcernsText`
                , `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcernsFile`
                , `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcernsResponse`
            ];
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }
        if (getValueByPath(basicForm, `forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcerns`) === 'Yes') {
            let filterKeys = [`forms[${formIndex}].data.disclosures.patientConcernDisclosure.haveSubjectedToPatientConcernsResponse`];
            let temp = missingKeys?.filter(data => !filterKeys?.includes(data?.key));
            missingKeys = temp;
        }

        setWarningFields(missingKeys);
        allMissingFields = missingKeys;
        hasMandatoryMissingFields = missingKeys?.find(field => field?.label?.mandatory === true);

         if (data === "skipped" || data === "save") {
            handleSubmitApplicationReq(data);
        }

        // if (data !== "skipped") {
        else {
            if (hasMandatoryMissingFields) {
                setShowValidationDialog(true);
            } else {
                handleSubmitApplicationReq(data);
            }
        }
    // }
        console.log(keyValuePair, 'patientConcrenMetadata', missingKeys, hasMandatoryMissingFields, allMissingFields)
    }

    const handleSubmitApplicationReq = async (actionType) => {
        // if (isEdited) {
        console.log("missingpatientConcren", allMissingFields)
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: basicForm?.forms?.[formIndex]?.data,
            unFilledFields: allMissingFields?.map(field => JSON.stringify(field)),
            // unFilledFields: Array.isArray(warningFields) 
            // ? warningFields.map(field => JSON.stringify(field))
            // : [],
            acknowledged: true
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
                if (actionType !== "save") {
                if (sessionStorage.getItem('fromSummary') === "true") {
                    navigate(-1);
                }
                else {
                    navigate(navigateURL)

                }
            }
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
        // } else {
        //     if (sessionStorage.getItem('fromSummary') === "true") {
        //         navigate(-1);
        //     }
        //     else {
        //         navigate(navigateURL)

        //     }
        // }
    }



    return (
        <div>
            {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
            <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
                <div>
                    <LocumProgressCard step={'STEP 11'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={22} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} basicForm={basicForm} />
                    <div className={style.marginTop}>
                        <WelcomeCard title={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.label }} />}
                            description={<div dangerouslySetInnerHTML={{ __html: formSchema?.properties?.instruction?.description }} />} />
                    </div>
                    <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                        {formSchema !== undefined && 'disclosures' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.disclosures} gridStyle={style.criminalHistoryGrid} baseKey={'disclosures'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} collapsableQuestionCard={true} stepPath={`forms[${formIndex}].data`} applicationId={applicationId} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} formIndex={formIndex} />
                        )}
                    </div>
                    <div className={style.threeColForButton}>
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
                        <div className={`${style.saveInProgress} ${style.marginTop} ${isSkipForNowDisabled ? style.disabledButton : ""}`} onClick={() => { if (!isSkipForNowDisabled) {getSkipClicked(true)}}}>SKIP FOR NOW</div>
                        </Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        </Tooltip>
                        <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleBackClick()}>BACK</div>
                        </Tooltip>
                        <Tooltip title={"Click to Proceed to the Next Step"} arrow>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => getMissingFields("continue")}>CONTINUE</div>
                        </Tooltip>
                    </div>
                </div>
                <div>
                    {!showInfo && (
                        <div>
                            <div className={`${style.toggleButton} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                                <MenuIcon className={style.toggleIcon} />
                            </div>
                            <div className={`${style.headerData} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hidden : ""}`}>
                                <span style={{ marginLeft: '20px' }}>Confirm Your Patient Concern Disclosure</span>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
                            <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
                            <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                            <div className={style.marginTop}>
                                <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                            </div>
                            <div className={style.marginTop}>
                                <ApplicationReferenceDocuments />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hiddenStickyContainer : ""}`}>
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
                        <div className={`${style.saveInProgress} ${style.marginTop} ${isSkipForNowDisabled ? style.disabledButton : ""}`} onClick={() => { if (!isSkipForNowDisabled) {getSkipClicked(true)}}}>SKIP FOR NOW</div>
                        </Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                        <div className={`${style.saveInProgress} ${style.marginTop10}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        </Tooltip>
                        <div className={style.twoColForButton}>
                            <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleBackClick()}>BACK</div>
                            </Tooltip>
                            {/* <div className={`${style.continue} ${style.marginTop10}`} onClick={() => setShowJourneyDialog(true)}>CONTINUE</div> */}
                             <Tooltip title={"Click to Proceed to the Next Step"} arrow>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => getMissingFields("continue")}>CONTINUE</div>
                            </Tooltip>
                        </div>
                    </div>

                </div>
            </div>
            {
                isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )
            }
            {showValidationDialog && (
                <ValidationDialog getIsOpen={getIsValidationDialogOpen}
                    labelList={warningFields?.filter(field => field?.label?.mandatory !== false)}
                    getSkipClicked={getSkipClicked} />
            )}
            {/* {showJourneyDialog && (
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Great Job So Far! You're On The Right Track.`} img={JourneyStep3} formIndex={formIndex} basicForm={basicForm} continueClick={getMissingFields} />
            )} */}
        </div>
    )
}

export default PatientConcern;