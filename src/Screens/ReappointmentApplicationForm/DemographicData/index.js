import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import { GET, PUT } from '../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';

import style from './index.module.scss';
import AIAssistantDialog from '../../../Components/AIAssistantDialog';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';

const DemographicData = ({ basicForm, setBasicForm, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [form2, setForm2] = useState();
    const navigate = useNavigate()
    const { applicationId, section, step } = useParams();
    const [isOpen, setIsOpen] = useState(true);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [fieldPaths, setFieldPaths] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [warningFields, setWarningFields] = useState([]);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [showDemographicInfo, setShowDemographicInfo] = useState(false);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [viewDemographicInfo, setViewDemographicInfo] = useState(false);
    const [viewContactInfo, setViewContactInfo] = useState(false);
    const [isDemographicInfoEdited, setIsDemographicInfoEdited] = useState(false);
    const [isContactInfoEdited, setIsContactInfoEdited] = useState(false);
    const [formIndex, setFormIndex] = useState();
    useEffect(() => {
        getBasicForm()
    }, [formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

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

    const getBasicForm = async () => {
        // const { data: basicForm } = await GET(
        //     `application-management-service/application/basicForm`
        // );
        if (basicForm?.formSchemas?.[formIndex]?.id !== undefined) {
            const { data: formSchema } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
            );
            // let temp = formSchema?.schema;
            // if (temp.properties.applicant.properties !== null) {
            //     delete temp.properties.applicant.properties['applicantType']
            //     delete temp.properties.applicant.properties['startDate']
            // }
            setFormSchema(formSchema?.schema)
            setFormSchemaWholeObject(formSchema)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            handleSubmitApplicationReq()
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
        if (!formSchemaWholeObject?.schema?.properties?.departmentSpecialty?.dependencies?.department?.oneOf?.map(data => data?.properties?.department?.enum[0])?.includes(getValueByPath(basicForm, 'basicDetails.departmentSpecialty.department'))) {
            let temp = missingKeys?.filter(data => !['basicDetails.departmentSpecialty.specialty']?.includes(data?.key));
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

    const handleSubmitApplicationReq = async () => {
        // const errors = validateSchema(formSchema, basicForm?.basicDetails);
        // console.log(errors)
        let data = basicForm;
        console.log(data)
        await PUT(`application-management-service/application/${applicationId}`, data)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster("Staff Member Application Updated Successfully");
                getPreApplication();
                // if (sessionStorage.getItem('fromSummary') === "true") {
                //     navigate(-1);
                // } else {
                //     navigate('/applicationForm/section1/step2')
                // }
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Staff Member Application");
            });
    }

    const handleContactAddressSubmit = async (skip) => {
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
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
        // let addressData = applicantProfile;
        // addressData.contactAddress2 = basicForm?.forms?.[formIndex]?.data.contactAddress2 !== undefined ? basicForm?.forms?.[formIndex]?.data.contactAddress2 : null
        // addressData.contactAddress3 = basicForm?.forms?.[formIndex]?.data.contactAddress3 !== undefined ? basicForm?.forms?.[formIndex]?.data.contactAddress3 : null
        // await PUT(`application-management-service/application/${applicationId}/profile`, addressData)
        //     .then(response => {
        //         console.log(response)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });
    }

    const addPath = (newPath) => {
        setFieldPaths((prevPaths) => {
            // Use spread operator to append new paths to existing array
            const updatedPaths = new Set([...prevPaths, ...newPath]);
            return Array.from(updatedPaths);
        });
    };

    const getIsSubmitClicked = (value, data, skip) => {
        if (value) {
            handleSubmitApplicationReq()
        }
    }

    const getIsSubmitClickedForContact = (value, data, skip) => {
        if (value) {
            handleContactAddressSubmit()
        }
    }

    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        } else {
            navigate(`/reappointmentApplicationForm/${applicationId}/section1/PrivilegeSelection`)
        }
    }

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    console.log(getValueByPath(basicForm, 'basicDetails.departmentSpecialty.department'), fieldPaths)
    console.log('Metadata', metadata);
    return (
        <div>
            <div className={`${style.applicationScreenGrid} `}>
                <div>
                    <ReappointmentProgressCard
                        step={""}
                        dataType={formSchema?.description}
                        title={formSchema?.title}
                        timeNumber={1}
                        timeText={"Min"}
                        progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
                    />

                    {formSchema !== undefined && "applicant" in formSchema?.properties && (
                        <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                            {/* {showDemographicInfo && ( */}
                            <ApplicationFieldCard
                                object={formSchema?.properties?.applicant}
                                gridStyle={style.applicantGrid}
                                baseKey={"applicant"}
                                basicForm={basicForm}
                                setBasicForm={setBasicForm}
                                isBasicPath={true}
                                isEdited={isDemographicInfoEdited}
                                setIsEdited={setIsDemographicInfoEdited}
                                getAllPath={getAllPath}
                                getAllLabels={getAllLabels}
                                getIsSubmitClicked={getIsSubmitClicked}
                                warningFields={warningFields}
                                formSchema={formSchemaWholeObject}
                                isReappointment={true}
                                dataChangedObject={formSchema?.properties?.isDemographicDataChanged}
                                isChanged={showDemographicInfo}
                                setIsChanged={setShowDemographicInfo}
                                isView={viewDemographicInfo}
                                setIsView={setViewDemographicInfo}
                            />
                            {/* )}
                            <div className={style.displayInRow}>
                                <div className={`${style.yesButton}`}><div className={`${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={() => setShowDemographicInfo(true)}>YES</div></div>
                                <div className={`${style.noButton} ${style.marginLeft}`}><div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>NO</div></div>
                            </div> */}
                        </div>
                    )}
                    {formSchema !== undefined && "contactAddress1" in formSchema?.properties && (
                        <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                            {/* {showDemographicInfo && ( */}
                            <ApplicationFieldCard
                                object={formSchema?.properties?.contactAddress1}
                                gridStyle={style.homeMailingAddressGrid}
                                baseKey={"contactAddress1"}
                                basicForm={basicForm}
                                setBasicForm={setBasicForm}
                                stepPath={`forms[${formIndex}].data`}
                                isEdited={isContactInfoEdited}
                                setIsEdited={setIsContactInfoEdited}
                                getAllPath={getAllPath}
                                getAllLabels={getAllLabels}
                                getIsSubmitClicked={getIsSubmitClickedForContact}
                                warningFields={warningFields}
                                formSchema={formSchemaWholeObject}
                                isReappointment={true}
                                dataChangedObject={formSchema?.properties?.isAddressChanged}
                                isChanged={showContactInfo}
                                setIsChanged={setShowContactInfo}
                                isView={viewContactInfo}
                                setIsView={setViewContactInfo}
                            />
                            {/* )}
                            <div className={style.displayInRow}>
                                <div className={`${style.yesButton}`}><div className={`${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={() => setShowDemographicInfo(true)}>YES</div></div>
                                <div className={`${style.noButton} ${style.marginLeft}`}><div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>NO</div></div>
                            </div> */}
                        </div>
                    )}
                </div>
                <div>
                    <ApplicationAssistanceCard
                        user={"Neena Greenly"}
                        designation={"{Designation}"}
                        contactNumber={"{Contact Number}"}
                        email={"{Email}"}
                    />
                    <div className={style.twoColForButton}>
                        <div
                            className={`${style.saveInProgress} ${style.marginTop}`}
                            onClick={() => getIsSaveInProgressOpen(true)}
                        >
                            SKIP FOR NOW
                        </div>
                        <div
                            className={`${style.saveInProgress} ${style.marginTop}`}
                            onClick={() => getIsSaveInProgressOpen(true)}
                        >
                            SAVE IN PROGRESS
                        </div>
                    </div>
                    <div className={style.twoColForButton}>
                        <div
                            className={`${style.continue} ${style.marginTop10}`}
                            onClick={() => navigate(-1)}
                        >
                            BACK
                        </div>
                        <div
                            className={`${style.continue} ${style.marginTop10}`}
                            onClick={() => handleContinue()}
                        >
                            CONTINUE
                        </div>
                    </div>
                    {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
                </div>
            </div>
            {/* {isOpen && <AIAssistantDialog getIsOpen={getIsOpen} />} */}
            {isSaveInProgressOpen && (
                <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
            )}
            {showValidationDialog && (
                <ValidationDialog
                    getIsOpen={getIsValidationDialogOpen}
                    labelList={warningFields}
                    getSkipClicked={getSkipClicked}
                />
            )}
        </div>
    );
}

export default DemographicData;
