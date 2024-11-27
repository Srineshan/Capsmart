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
import JourneyStep2 from './../../../images/journeyStep2.png';
import style from './index.module.scss';
import AIAssistantDialog from '../../../Components/AIAssistantDialog';
import SaveInProgressDialog from '../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../Components/validationDialog';
import ReappointmentProgressCard from '../../../Components/ReappointmentProgressCard';
import ReappointmentJourneyDialog from '../../../Components/reappointmentJourneyDialog';
import ApplicationReferenceDocuments from '../../../Components/ApplicationReferenceDocuments';

const DemographicData = ({ basicForm, setBasicForm, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [form2, setForm2] = useState();
    const navigate = useNavigate()
    const [uniqueLabels, setUniqueLabels] = useState([]);
    const { applicationId, section, step } = useParams();
    const [isOpen, setIsOpen] = useState(true);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [fieldPaths, setFieldPaths] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [warningFields, setWarningFields] = useState([]);
    const [warningFieldsContact, setWarningFieldsContact] = useState([]);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [showDemographicInfo, setShowDemographicInfo] = useState(false);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [viewDemographicInfo, setViewDemographicInfo] = useState(false);
    const [viewContactInfo, setViewContactInfo] = useState(false);
    const [isDemographicInfoEdited, setIsDemographicInfoEdited] = useState(false);
    const [isContactInfoEdited, setIsContactInfoEdited] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const [navigateURL, setNavigateURL] = useState();
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    const [updateFrom, setUpdateFrom] = useState('');
    const [yesOrNoDemographic, setYesOrNoDemographic] = useState('');
    const [yesOrNoAddress, setYesOrNoAddress] = useState('');
    useEffect(() => {
        if (basicForm && !formSchema) {
            getBasicForm()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form')?.length === (formIndex + 1)) ? `/reappointmentApplicationForm/${applicationId}/Form/PODCheck` : `/reappointmentApplicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${basicForm?.forms[formIndex + 1]?.schemaCategory}`)
        }
    }, [basicForm, formIndex])

    useEffect(() => {
        if (formIndex !== undefined) {
            setYesOrNoAddress((basicForm?.forms?.[formIndex]?.data?.yesOrNoData !== undefined && basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoAddress !== undefined) ? basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoAddress : '');
            setYesOrNoDemographic((basicForm?.forms?.[formIndex]?.data?.yesOrNoData !== undefined && basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoDemographic !== undefined) ? basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoDemographic : '');
        }
    }, [formIndex])

    useEffect(() => {
        setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
    }, [basicForm, step])

    const getIsOpen = (value) => {
        setIsOpen(value);
    }

    const getIsShowReappointmentJourneyDialog = (value) => {
        setShowJourneyDialog(value);
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

    const addObjectIfNotPresent = (array, newObject) => {
        const objectExists = array.some((obj) =>
            Object.keys(newObject).every((key) => obj[key] === newObject[key])
        );

        if (!objectExists) {
            array.push(newObject);
        }

        return array;
    };

    const getAllLabelsContactAddress = (data) => {
        let tempLabels = addObjectIfNotPresent(uniqueLabels, data);
        setUniqueLabels(tempLabels)
        console.log("tempLabelsssss", tempLabels, uniqueLabels, data)
    }

    const getMissingFieldsBasicInfo = () => {
        setUpdateFrom('')
        let missingKeys = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({
                key: data,
                value: getValueByPath(basicForm, data),
                label: labels[index],
            });
        });
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // Example for formatted phone number

        keyValuePair?.map((data) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (
                data?.value === "" ||
                data?.value === null ||
                data?.value === undefined ||
                data?.value === 0 ||
                (data?.key === "basicDetails.applicant.email.officialEmail" &&
                    !emailRegex.test(data?.value))
            ) {
                if (
                    data.key === "basicDetails.applicant.email.officialEmail" &&
                    !emailRegex.test(data.value)
                ) {
                    setBasicForm((prevForm) => ({
                        ...prevForm,
                        basicDetails: {
                            ...prevForm.basicDetails,
                            applicant: {
                                ...prevForm.basicDetails.applicant,
                                email: {
                                    ...prevForm.basicDetails.applicant.email,
                                    officialEmail: "",
                                },
                            },
                        },
                    }));
                }
                // if (
                //     basicForm.basicDetails.applicant.cellPhone &&
                //     !phoneRegex.test(basicForm.basicDetails.applicant.cellPhone)
                // ) {
                //     missingKeys.push({
                //         key: "basicDetails.applicant.cellPhone",
                //         label: "Cell Phone",
                //         error: "Invalid phone number format",
                //     });
                //     setBasicForm((prevForm) => ({
                //         ...prevForm,
                //         basicDetails: {
                //             ...prevForm.basicDetails,
                //             applicant: {
                //                 ...prevForm.basicDetails.applicant,
                //                 cellPhone: "",
                //             },
                //         },
                //     }));
                // }
                missingKeys.push(data);
            }
        });
        if (
            !formSchemaWholeObject?.schema?.properties?.departmentSpecialty?.dependencies?.department?.oneOf
                ?.map((data) => data?.properties?.department?.enum[0])
                ?.includes(
                    getValueByPath(
                        basicForm,
                        "basicDetails.departmentSpecialty.department"
                    )
                )
        ) {
            let temp = missingKeys?.filter(
                (data) =>
                    !["basicDetails.departmentSpecialty.specialty"]?.includes(data?.key)
            );
            missingKeys = temp;
        }
        if (missingKeys?.length !== 0 && missingKeys?.filter(data => data?.label !== undefined)?.length !== 0) {
            setShowValidationDialog(true);
        } else {
            handleSubmitApplicationReq();
        }
        console.log(missingKeys, 'Metadata', updateFrom)
        setWarningFields(missingKeys);
    };

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
        setUpdateFrom('')
    }

    const getContactSkipClicked = (value, data, skip) => {
        if (value) {
            handleContactAddressSubmit('skipped')
        }
        setUpdateFrom('')
    }

    const getMissingFields = () => {
        setUpdateFrom('')
        let missingKeys = [];
        let keyValuePair = [];
        metadata?.map((data, index) => {
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: uniqueLabels?.filter(labelData => labelData?.path === data)[0]?.label })
        })
        const validateBusinessPhone = (phone) => {
            const phoneRegex = /^[0-9]{10}$/; // Example: validate if phone is a 10-digit number
            return phoneRegex.test(phone);
        };
        const validateBusinessWebsite = (website) => {
            const websiteRegex =
                /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w .-]*)*\/?$/; // Simple URL validation
            return websiteRegex.test(website);
        };

        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0 ||
                (data?.key === `forms[${formIndex}].data.contactAddress3.business.businessPhone` &&
                    !validateBusinessPhone(data?.value)) ||
                (data?.key ===
                    `forms[${formIndex}].data.contactAddress3.business.businessWebsite` &&
                    !validateBusinessWebsite(data?.value))
            ) {
                if (
                    data?.key ===
                    `forms[${formIndex}].data.contactAddress3.business.businessPhone` &&
                    !validateBusinessPhone(data?.value)
                ) {
                    setBasicForm((prevForm) => ({
                        ...prevForm,
                        forms: prevForm.forms.map((form) => {
                            if (form.schemaId === basicForm.forms[formIndex].schemaId) {
                                return {
                                    ...form,
                                    data: {
                                        ...form.data,
                                        contactAddress3: {
                                            ...form.data.contactAddress3,
                                            business: {
                                                ...form.data.contactAddress3.business,
                                                businessPhone: "",
                                            },
                                        },
                                    },
                                };
                            }
                            return form;
                        }),
                    }));
                }
                if (
                    data?.key ===
                    `forms[${formIndex}].data.contactAddress3.business.businessWebsite` &&
                    !validateBusinessWebsite(data?.value)
                ) {
                    setBasicForm((prevForm) => ({
                        ...prevForm,
                        forms: prevForm.forms.map((form) => {
                            if (form.schemaId === basicForm.forms[formIndex].schemaId) {
                                return {
                                    ...form,
                                    data: {
                                        ...form.data,
                                        contactAddress3: {
                                            ...form.data.contactAddress3,
                                            business: {
                                                ...form.data.contactAddress3.business,
                                                businessWebsite: "",
                                            },
                                        },
                                    },
                                };
                            }
                            return form;
                        }),
                    }));
                }
                missingKeys.push(data)
            }
        })
        // if (!getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== undefined && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== null) {
        //     let registeredBusinessAddressKeys = [`forms[${formIndex}].data.contactAddress3.business.businessName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.streetName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.pinCode`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.city`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.province`, `forms[${formIndex}].data.contactAddress3.business.businessPhone`, `forms[${formIndex}].data.contactAddress3.business.businessWebsite`]
        //     let temp = missingKeys?.filter(data => !registeredBusinessAddressKeys?.includes(data?.key));
        //     missingKeys = temp;
        // }
        setWarningFieldsContact(missingKeys)
        if (missingKeys?.length !== 0 && missingKeys?.filter(data => data?.label !== undefined)?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            setShowContactInfo(false);
            getIsSubmitClickedForContact(true);
        }
        console.log(keyValuePair, 'Metadata', missingKeys, getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`))
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

    const handleYesOrNo = async (skip) => {
        let yesOrNoData = basicForm?.forms?.[formIndex]?.data !== null ? basicForm?.forms?.[formIndex]?.data : {};
        yesOrNoData.yesOrNoData = {
            yesOrNoDemographic: yesOrNoDemographic,
            yesOrNoAddress: yesOrNoAddress
        }
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: yesOrNoData,
            unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
            acknowledged: true
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
        handleYesOrNo()
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
        } else {
            navigate(navigateURL)
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
                                getIsSubmitClicked={getMissingFieldsBasicInfo}
                                warningFields={warningFields}
                                formSchema={formSchemaWholeObject}
                                isReappointment={true}
                                dataChangedObject={formSchema?.properties?.isDemographicDataChanged}
                                isChanged={showDemographicInfo}
                                setIsChanged={setShowDemographicInfo}
                                isView={viewDemographicInfo}
                                setIsView={setViewDemographicInfo}
                                yesOrNoDemographic={yesOrNoDemographic}
                                setYesOrNoDemographic={setYesOrNoDemographic}
                            />
                            {/* )}
                            <div className={style.displayInRow}>
                                <div className={`${style.yesButton}`}><div className={`${style.verticalAlignCenter} ${style.justifyCenter}`} onClick={() => setShowDemographicInfo(true)}>YES</div></div>
                                <div className={`${style.noButton} ${style.marginLeft}`}><div className={`${style.verticalAlignCenter} ${style.justifyCenter}`}>NO</div></div>
                            </div> */}
                        </div>
                    )}

                    <div className={`${style.applicationCardStyle} ${style.marginTop}`}>
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.isAddressChanged?.label}</div>
                        {showContactInfo ? (
                            <div className={`${style.reappointmentCard} ${style.padding20} ${style.marginTop}`}>
                                {/* <div
                                    className={style.addMoreText}
                                    dangerouslySetInnerHTML={{ __html: object?.items?.label }}
                                /> */}
                                {formSchema !== undefined && "contactAddress1" in formSchema?.properties && (
                                    <div>
                                        <div className={` ${style.marginTop}`}>
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
                                                getAllLabels={getAllLabelsContactAddress}
                                                getIsSubmitClicked={getIsSubmitClickedForContact}
                                                warningFields={warningFields}
                                                formSchema={formSchemaWholeObject}
                                            />

                                        </div>
                                        <div className={` ${style.marginTop}`}>
                                            {/* {showDemographicInfo && ( */}
                                            <ApplicationFieldCard
                                                object={formSchema?.properties?.contactAddress2}
                                                gridStyle={style.mailingAddressGrid}
                                                baseKey={"contactAddress2"}
                                                basicForm={basicForm}
                                                setBasicForm={setBasicForm}
                                                stepPath={`forms[${formIndex}].data`}
                                                isEdited={isContactInfoEdited}
                                                setIsEdited={setIsContactInfoEdited}
                                                getAllPath={getAllPath}
                                                getAllLabels={getAllLabelsContactAddress}
                                                getIsSubmitClicked={getIsSubmitClickedForContact}
                                                warningFields={warningFields}
                                                formSchema={formSchemaWholeObject}
                                            />

                                        </div>
                                        <div className={` ${style.marginTop}`}>
                                            {/* {showDemographicInfo && ( */}
                                            <ApplicationFieldCard
                                                object={formSchema?.properties?.contactAddress3}
                                                gridStyle={style.businessMailingAddressGrid}
                                                baseKey={"contactAddress3"}
                                                basicForm={basicForm}
                                                setBasicForm={setBasicForm}
                                                stepPath={`forms[${formIndex}].data`}
                                                isEdited={isContactInfoEdited}
                                                setIsEdited={setIsContactInfoEdited}
                                                getAllPath={getAllPath}
                                                getAllLabels={getAllLabelsContactAddress}
                                                getIsSubmitClicked={getIsSubmitClickedForContact}
                                                warningFields={warningFields}
                                                formSchema={formSchemaWholeObject}
                                            />
                                        </div>
                                    </div>
                                )}
                                {!viewContactInfo ? (
                                    <div
                                        className={`${style.displayInRowRev} ${style.marginTop}`}
                                    >
                                        <div className={style.marginLeft}>
                                            <div
                                                className={`${style.reappointmentButton} ${isContactInfoEdited ? '' : style.disabledButtonLook}`}
                                                onClick={isContactInfoEdited ? () => {
                                                    // setShowContactInfo(false);
                                                    getMissingFields()
                                                    setUpdateFrom('contact')
                                                } : () => { }}
                                            >
                                                UPDATE
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                className={`${style.reappointmentButtonOutlined}`}
                                                onClick={() => {
                                                    setShowContactInfo(false)
                                                }}
                                            >
                                                CANCEL
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`${style.displayInRowRev} ${style.marginTop}`}
                                    >
                                        <div>
                                            <div
                                                className={`${style.reappointmentButton}`}
                                                onClick={() => {
                                                    setShowContactInfo(false); setViewContactInfo(false);
                                                }}
                                            >
                                                CLOSE
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className={`${style.viewMyInfoText} ${style.cursorPointer} ${style.marginTop}`} onClick={() => { setShowContactInfo(true); setViewContactInfo(true) }}>View my information on file</div>
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                >
                                    <div
                                        className={`${yesOrNoAddress === 'Yes' ? style.reappointmentButton : style.reappointmentButtonOutlined}`}
                                        onClick={() => { setShowContactInfo(true); setYesOrNoAddress('Yes') }}
                                    >
                                        Yes
                                    </div>
                                    <div
                                        className={`${yesOrNoAddress === 'No' ? style.reappointmentButton : style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                        onClick={() => { setShowContactInfo(false); setYesOrNoAddress('No') }}
                                    >
                                        NO
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={style.threeColForButton}>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleContinue()}>CONTINUE</div>
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard
                        user={"Neena Greenly"}
                        designation={"{Designation}"}
                        contactNumber={"{Contact Number}"}
                        email={"{Email}"}
                    />
                    {/* <div className={style.twoColForButton}>
                        <div
                            className={`${style.saveInProgress} ${style.marginTop}`}
                            onClick={() => getIsSaveInProgressOpen(true)}
                        >
                            SKIP FOR NOW
                        </div> */}
                    <div
                        className={`${style.saveInProgress} ${style.marginTop}`}
                        onClick={() => getIsSaveInProgressOpen(true)}
                    >
                        SAVE IN PROGRESS
                    </div>
                    {/* </div> */}
                    <div className={style.twoColForButton}>
                        <div
                            className={`${style.continue} ${style.marginTop10}`}
                            onClick={() => navigate(-1)}
                        >
                            BACK
                        </div>
                        {/* <div
                            className={`${style.continue} ${style.marginTop10}`}
                            onClick={() => setShowJourneyDialog(true)}
                        >
                            CONTINUE
                        </div> */}
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()}>CONTINUE</div>
                    </div>
                    <div className={style.marginTop}>
                        <ApplicationReferenceDocuments />
                    </div>
                </div>
            </div>
            {/* {isOpen && <AIAssistantDialog getIsOpen={getIsOpen} />} */}
            {isSaveInProgressOpen && (
                <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
            )}
            {showValidationDialog && (
                <ValidationDialog
                    getIsOpen={getIsValidationDialogOpen}
                    labelList={updateFrom === 'contact' ? warningFieldsContact : warningFields}
                    getSkipClicked={updateFrom === 'contact' ? getContactSkipClicked : getSkipClicked}
                />
            )}
            {showJourneyDialog && (
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Great Start! You're On Your Way.`} img={JourneyStep2} formIndex={formIndex} basicForm={basicForm} continueClick={handleContinue} />
            )}
        </div>
    );
}

export default DemographicData;
