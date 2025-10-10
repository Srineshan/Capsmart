import React, { useEffect, useState } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import { GET, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorToaster, SuccessToaster, SuccessToaster2 } from '../../../../utils/toaster';
import JourneyStep2 from './../../../../images/journeyStep2.png';
import style from './index.module.scss';
import AIAssistantDialog from '../../../../Components/AIAssistantDialog';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../../Components/validationDialog';
import ReappointmentProgressCard from '../../../../Components/ReappointmentProgressCard';
import ReappointmentJourneyDialog from '../../../../Components/reappointmentJourneyDialog';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import MenuIcon from "@mui/icons-material/Menu";
import Close from './../../../../images/close.png';
import { Tooltip } from '@mui/material';

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
    const [allWarningFields, setAllWarningFields] = useState([]);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [showDemographicInfo, setShowDemographicInfo] = useState(true);
    const [showContactInfo, setShowContactInfo] = useState(true);
    const [viewDemographicInfo, setViewDemographicInfo] = useState(false);
    const [viewContactInfo, setViewContactInfo] = useState(false);
    const [isDemographicInfoEdited, setIsDemographicInfoEdited] = useState(false);
    const [isContactInfoEdited, setIsContactInfoEdited] = useState(false);
    const [formIndex, setFormIndex] = useState();
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [showJourneyDialog, setShowJourneyDialog] = useState(false);
    const [updateFrom, setUpdateFrom] = useState('');
    const [yesOrNoDemographic, setYesOrNoDemographic] = useState('YES');
    const [yesOrNoAddress, setYesOrNoAddress] = useState('YES');
    const [showInfo, setShowInfo] = useState(false);
    const [applicantProfile, setApplicantProfile] = useState();
    const [isContinueEnabled, setIsContinueEnabled] = useState(true);
    let allMissingFields = [];
    useEffect(() => {
        if (basicForm && !formSchema) {
            getBasicForm()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            getMissingFieldsContact();
            setNavigateURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex + 1]?.schemaCategory)}`);
            setNavigateBackURL(`/reappointmentApplicationForm/${applicationId}/${basicForm?.forms?.[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms?.[formIndex - 1]?.schemaCategory)}`);
        }


    }, [basicForm, formIndex])

    useEffect(() => {
        if (applicationId) { getApplicantProfile() }
    }, [applicationId])

    // useEffect(() => {
    //     if (formIndex !== undefined) {
    //         if (basicForm?.forms?.[formIndex]?.data?.contactAddress1 === undefined && basicForm?.forms?.[formIndex]?.data?.contactAddress2 === undefined && basicForm?.forms?.[formIndex]?.data?.contactAddress3 === undefined) {
    //             setShowContactInfo(true)
    //         }
    //         setYesOrNoAddress((basicForm?.forms?.[formIndex]?.data?.contactAddress1 === undefined && basicForm?.forms?.[formIndex]?.data?.contactAddress2 === undefined && basicForm?.forms?.[formIndex]?.data?.contactAddress3 === undefined) ? 'Yes' : (basicForm?.forms?.[formIndex]?.data?.yesOrNoData !== undefined && basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoAddress !== undefined) ? basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoAddress : '');
    //         setYesOrNoDemographic((basicForm?.forms?.[formIndex]?.data?.yesOrNoData !== undefined && basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoDemographic !== undefined) ? basicForm?.forms?.[formIndex]?.data?.yesOrNoData?.yesOrNoDemographic : '');
    //     }
    // }, [formIndex])

    useEffect(() => {
        if (basicForm) {
            setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)));
        }
    }, [basicForm, step]);


    useEffect(() => {
        if (!formSchema || !basicForm || formIndex === undefined) return;

        const updatedSchema = { ...formSchema };
        const contactAddress2 = updatedSchema?.properties?.contactAddress2;
        const mailingAddressEnum = contactAddress2?.properties?.isMailingAddressSameAsHomeAddress?.enum;

        if (mailingAddressEnum) {
            const isBusinessRegistered = getValueByPath(
                basicForm,
                `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`
            );

            const newEnum = isBusinessRegistered
                ? [...new Set([...mailingAddressEnum, "Same as Business Address"])]
                : mailingAddressEnum.filter((option) => option !== "Same as Business Address");

            if (JSON.stringify(mailingAddressEnum) !== JSON.stringify(newEnum)) {
                contactAddress2.properties.isMailingAddressSameAsHomeAddress.enum = newEnum;
                setFormSchema(updatedSchema);
            }
        }
    }, [basicForm, formIndex]);


    useEffect(() => {
        if (isDemographicInfoEdited || isContactInfoEdited) {
            setIsContinueEnabled(false);
        } else {
            setIsContinueEnabled(true);
        }

        console.log("ContinueButton", isContinueEnabled);

    }, [isDemographicInfoEdited || isContactInfoEdited]);


    // useEffect(() => {
    //     setFormSchema((prevSchema) => {
    //         if (!prevSchema) return prevSchema;

    //         const updatedSchema = { ...prevSchema };
    //         const contactAddress2 = updatedSchema?.properties?.contactAddress2;
    //         const mailingAddressEnum =
    //             contactAddress2?.properties?.isMailingAddressSameAsHomeAddress?.enum;

    //         if (mailingAddressEnum) {
    //             const isBusinessAddressRegistered = getValueByPath(
    //                 basicForm,
    //                 `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`
    //             );

    //             const newEnum = isBusinessAddressRegistered
    //                 ? mailingAddressEnum
    //                 : mailingAddressEnum.filter((option) => option !== "Same as Business Address");

    //             if (JSON.stringify(mailingAddressEnum) !== JSON.stringify(newEnum)) {
    //                 contactAddress2.properties.isMailingAddressSameAsHomeAddress.enum = newEnum;
    //                 return updatedSchema;
    //             }
    //         }
    //         return prevSchema;
    //     });
    // }, [basicForm, formIndex]);



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
        if (tempLabels?.filter(innerData => data?.path === innerData?.path)?.length === 0) {
            console.log(tempLabels, data, 'MetadataLabel')
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

    const getApplicantProfile = async () => {
        const { data: profile } = await GET(
            `application-management-service/application/${applicationId}/profile`
        );
        setApplicantProfile(profile)
    }

    const getAllLabelsContactAddress = (data) => {
        let tempLabels = addObjectIfNotPresent(uniqueLabels, data);
        if (tempLabels?.filter(innerData => data?.path === innerData?.path)?.length === 0) {
            console.log(tempLabels, data, 'Metadata9999')
            tempLabels.push(data);
        }
        setUniqueLabels(tempLabels)
        console.log("tempLabelsssss", tempLabels, uniqueLabels, data)
    }
    const getMissingFieldsContact = () => {
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
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0
            ) {
                missingKeys.push(data)
            }
        })
        if (!getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== undefined && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== null) {
            let registeredBusinessAddressKeys = [`forms[${formIndex}].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress`, `forms[${formIndex}].data.contactAddress3.business.b`, `forms[${formIndex}].data.contactAddress3.business.businessName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.streetName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.pinCode`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.city`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.province`, `forms[${formIndex}].data.contactAddress3.business.businessPhone`, `forms[${formIndex}].data.contactAddress3.business.businessWebsite`]
            let temp = missingKeys?.filter(data => !registeredBusinessAddressKeys?.includes(data?.key));
            missingKeys = temp;
        }
        setWarningFieldsContact(missingKeys)
        console.log(keyValuePair, 'MetadataContact', missingKeys, getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`))
    }


    const getMissingFieldsBasicInfo = () => {
        setUpdateFrom('')
        let missingKeys = [];
        let keyValuePair = [];
        let hasMandatoryMissingFields = [];
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
                data?.value === 0
            ) {
                // if (
                //     data.key === "basicDetails.applicant.email.officialEmail" &&
                //     !emailRegex.test(data.value)
                // ) {
                //     setBasicForm((prevForm) => ({
                //         ...prevForm,
                //         basicDetails: {
                //             ...prevForm.basicDetails,
                //             applicant: {
                //                 ...prevForm.basicDetails.applicant,
                //                 email: {
                //                     ...prevForm.basicDetails.applicant.email,
                //                     officialEmail: "",
                //                 },
                //             },
                //         },
                //     }));
                // }
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
        const emailPath = `basicDetails.applicant.email.officialEmail`;
        const emailValue = getValueByPath(basicForm, emailPath);
        console.log("Email", emailValue);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue && emailValue !== "" && !emailRegex.test(emailValue)) {
            missingKeys.push({
                key: emailPath, label: {
                    label: "Email (Invalid email Format)",
                    mandatory: true,
                    path: emailPath
                },
                value: emailValue
            });
        }

        setWarningFields(missingKeys);
        hasMandatoryMissingFields = missingKeys?.find(field => field?.label?.mandatory === true);

        if (hasMandatoryMissingFields) {
            setShowValidationDialog(true);
        } else {
            handleSubmitApplicationReq();
        }
        console.log(missingKeys, 'MetadataAddress', updateFrom, hasMandatoryMissingFields, warningFields)
        // setWarningFields(missingKeys);
    };

    const getIsSaveInProgressOpen = (value) => {
        if (value) {
            handleSubmitApplicationReq("save")
                .then(() => getAllMissingFields("save"))
                .catch((error) => console.error("Error processing skip action:", error));
        }
        setUpdateFrom('');
        setIsSaveInProgressOpen(value);
    }

    const getBasicForm = async () => {
        // const { data: basicForm } = await GET(
        //     `application-management-service/application/basicForm`
        // );
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: formSchema } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
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
            handleSubmitApplicationReq("skipped")
                .then(() => getAllMissingFields("skipped"))
                .catch((error) => console.error("Error processing skip action:", error));
        }
        setUpdateFrom('');
    };

    const getSkipClicked1 = (value) => {
        if (value) {
            // handleSubmitApplicationReq("skipped")
            navigate(navigateURL);
        }
    }

    const getContactSkipClicked = async (value, data, skip) => {
        if (value) {
            try {
                await Promise.resolve(getAllMissingFields("skipped")); // Ensuring it behaves like a Promise
                navigate(navigateURL);
            } catch (error) {
                console.error("Error processing skip action:", error);
            }
        }
        setUpdateFrom('');
    };

    const getMissingFields = (data) => {
        setUpdateFrom('')
        let missingKeys = [];
        let keyValuePair = [];
        let hasMandatoryMissingFields = [];
        metadata?.map((data, index) => {
            let label = uniqueLabels?.find(labelData => labelData?.path === data) || {}
            if (data === `forms[${formIndex}].data.contactAddress2.isMailingAddressSameAsHomeAddress`) {
                label = {
                    ...label,
                    mandatory: true,
                    label: "Mailing address: Home or different?"
                };
            }

            if (data === `forms[${formIndex}].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress`) {
                label = {
                    ...label,
                    mandatory: true,
                    label: "Business address: Home or Mailing or Different?"
                };
            }
            keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: label })
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
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0
                // || (data?.key === `forms[${formIndex}].data.contactAddress3.business.businessPhone` &&
                //     !validateBusinessPhone(data?.value)) ||
                // (data?.key ===
                //     `forms[${formIndex}].data.contactAddress3.business.businessWebsite` &&
                //     !validateBusinessWebsite(data?.value))
            ) {
                // if (
                //     data?.key ===
                //     `forms[${formIndex}].data.contactAddress3.business.businessPhone` &&
                //     !validateBusinessPhone(data?.value)
                // ) {
                //     setBasicForm((prevForm) => ({
                //         ...prevForm,
                //         forms: prevForm.forms.map((form) => {
                //             if (form.schemaId === basicForm.forms[formIndex].schemaId) {
                //                 return {
                //                     ...form,
                //                     data: {
                //                         ...form.data,
                //                         contactAddress3: {
                //                             ...form.data.contactAddress3,
                //                             business: {
                //                                 ...form.data.contactAddress3.business,
                //                                 businessPhone: "",
                //                             },
                //                         },
                //                     },
                //                 };
                //             }
                //             return form;
                //         }),
                //     }));
                // }
                // if (
                //     data?.key ===
                //     `forms[${formIndex}].data.contactAddress3.business.businessWebsite` &&
                //     !validateBusinessWebsite(data?.value)
                // ) {
                //     setBasicForm((prevForm) => ({
                //         ...prevForm,
                //         forms: prevForm.forms.map((form) => {
                //             if (form.schemaId === basicForm.forms[formIndex].schemaId) {
                //                 return {
                //                     ...form,
                //                     data: {
                //                         ...form.data,
                //                         contactAddress3: {
                //                             ...form.data.contactAddress3,
                //                             business: {
                //                                 ...form.data.contactAddress3.business,
                //                                 businessWebsite: "",
                //                             },
                //                         },
                //                     },
                //                 };
                //             }
                //             return form;
                //         }),
                //     }));
                // }
                missingKeys.push(data)
            }
        })
        if (!getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== undefined && getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`) !== null) {
            let registeredBusinessAddressKeys = [`forms[${formIndex}].data.contactAddress3.business.b`, `forms[${formIndex}].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress`, `forms[${formIndex}].data.contactAddress3.business.businessName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.streetName`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.pinCode`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.city`, `forms[${formIndex}].data.contactAddress3.business.businessAddress.province`, `forms[${formIndex}].data.contactAddress3.business.businessPhone`, `forms[${formIndex}].data.contactAddress3.business.businessWebsite`]
            let temp = missingKeys?.filter(data => !registeredBusinessAddressKeys?.includes(data?.key));
            missingKeys = temp;
        }

        const phonePath = `forms[${formIndex}].data.contactAddress3.business.businessPhone`;
        const phoneValue = getValueByPath(basicForm, phonePath);
        const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        if (phoneValue && phoneValue !== "" && !phoneRegex.test(phoneValue)) {
            missingKeys.push({
                key: phonePath, label: {
                    label: "Business Phone (Invalid Canadian Format)",
                    mandatory: true,
                    path: phonePath
                },
                value: phoneValue
            });
        }

        setWarningFieldsContact(missingKeys)
        allMissingFields = missingKeys;
        hasMandatoryMissingFields = missingKeys?.find(field => field?.label?.mandatory === true);

        if (data === "skipped") {
            handleContactAddressSubmit();
        }

        if (data !== "skipped") {
            if (hasMandatoryMissingFields) {
                setShowValidationDialog(true)
            } else {
                // setShowContactInfo(false);
                getIsSubmitClickedForContact(true);
            }
        }
        console.log(keyValuePair, 'Metadata77777', allMissingFields, missingKeys, getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`))
    }

    const handleSubmitApplicationReq = async () => {
        // const errors = validateSchema(formSchema, basicForm?.basicDetails);
        // console.log(errors)
        let data = basicForm;
        console.log(data, "dataaaaa123")
        await PUT(`application-management-service/application/${applicationId}`, data)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster2("Updated Successfully");
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
            unFilledFields: allMissingFields?.map(field => JSON.stringify(field)),
            acknowledged: true
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                setBasicForm(response?.data)
                SuccessToaster2("Updated Successfully");
                getPreApplication()
                updateProfileAddress();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }

    const updateProfileAddress = async () => {
        let addressData = applicantProfile;
        addressData.contactAddress1 = basicForm?.forms?.[formIndex]?.data.contactAddress1 !== undefined ? basicForm?.forms?.[formIndex]?.data.contactAddress1 : null
        addressData.contactAddress2 = basicForm?.forms?.[formIndex]?.data.contactAddress2 !== undefined ? basicForm?.forms?.[formIndex]?.data.contactAddress2 : null
        addressData.contactAddress3 = basicForm?.forms?.[formIndex]?.data.contactAddress3 !== undefined ? basicForm?.forms?.[formIndex]?.data.contactAddress3 : null
        await PUT(`application-management-service/application/${applicationId}/profile`, addressData)
            .then(response => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            });
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

    const handleBackClick = async () => {
        navigate(navigateBackURL)
    }

    // const handleContinue = () => {
    //     handleYesOrNo()
    //     if (sessionStorage.getItem('fromSummary') === "true") {
    //         navigate(-1);
    //     } else {
    //         navigate(navigateURL)
    //     }
    // }

    const getAllMissingFields = (data) => {
        setUpdateFrom("Continue"); // Track the source of the action

        let allMissingKeys = [];
        let keyValuePair = [];
        let hasMandatoryMissingFields = [];

        metadata?.forEach((data, index) => {
            let label = labels[index] || uniqueLabels?.find(labelData => labelData?.path === data);

            // Force mandatory true for the two specific paths
            if (data === `forms[${formIndex}].data.contactAddress2.isMailingAddressSameAsHomeAddress`) {
                label = {
                    ...label,
                    mandatory: true,
                    label: "Mailing address: Home or different?"
                };
            }

            if (data === `forms[${formIndex}].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress`) {
                label = {
                    ...label,
                    mandatory: true,
                    label: "Business address: Home or Mailing or Different?"
                };
            }
            keyValuePair.push({
                key: data,
                value: getValueByPath(basicForm, data),
                // Assign correct label from either Basic Info or Contact Info labels
                label: label
            });
        });

        // Validation rules
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
        const validateBusinessPhone = (phone) => /^[0-9]{10}$/.test(phone);
        const validateBusinessWebsite = (website) => /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([\/\w .-]*)*\/?$/.test(website);

        // Identify missing or invalid fields
        keyValuePair.forEach((data) => {
            if (
                data?.value === "" ||
                data?.value === null ||
                data?.value === undefined ||
                data?.value === 0
            ) {
                allMissingKeys.push(data);
            }
        });

        // Business Address validations
        const businessAddressKeys = [
            `forms[${formIndex}].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress`,
            `forms[${formIndex}].data.contactAddress3.business.b`,
            `forms[${formIndex}].data.contactAddress3.business.businessName`,
            `forms[${formIndex}].data.contactAddress3.business.businessAddress.streetName`,
            `forms[${formIndex}].data.contactAddress3.business.businessAddress.pinCode`,
            `forms[${formIndex}].data.contactAddress3.business.businessAddress.city`,
            `forms[${formIndex}].data.contactAddress3.business.businessAddress.province`,
            `forms[${formIndex}].data.contactAddress3.business.businessPhone`,
            `forms[${formIndex}].data.contactAddress3.business.businessWebsite`,
        ];

        if (
            !getValueByPath(basicForm, `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`)
        ) {
            allMissingKeys = allMissingKeys.filter(data => !businessAddressKeys.includes(data?.key));
        }

        // Validate business phone format
        const phonePath = `forms[${formIndex}].data.contactAddress3.business.businessPhone`;
        const phoneValue = getValueByPath(basicForm, phonePath);
        if (phoneValue && !phoneRegex.test(phoneValue)) {
            allMissingKeys.push({
                key: phonePath, label: {
                    label: "Business Phone (Invalid Canadian Format)",
                    mandatory: true,
                    path: phonePath
                },
                value: phoneValue
            });
        }
        const emailPath = `basicDetails.applicant.email.officialEmail`;
        const emailValue = getValueByPath(basicForm, emailPath);
        if (emailValue && emailValue !== "" && !emailRegex.test(emailValue)) {
            allMissingKeys.push({
                key: emailPath, label: {
                    label: "Email Address (Invalid Email Format)",
                    mandatory: true,
                    path: emailPath
                },
                value: emailValue
            });
        }
        //     const isBusinessAddressSameAsHomeAddressOrMailingAddressPath = `forms[${formIndex}].data.contactAddress3.isBusinessAddressSameAsHomeAddressOrMailingAddress`;
        //     const RegisteredBusinessPath = `forms[${formIndex}].data.contactAddress3.registeredBusinessAddress`
        //     const RegisteredBusinessAddressValue = getValueByPath(basicForm,RegisteredBusinessPath)
        //     const isBusinessAddressSameAsHomeAddressOrMailingAddressValue = getValueByPath(basicForm, isBusinessAddressSameAsHomeAddressOrMailingAddressPath);
        //     if (RegisteredBusinessAddressValue === false) {
        //       if (!isBusinessAddressSameAsHomeAddressOrMailingAddressValue) {
        //         allMissingKeys.push({ key: isBusinessAddressSameAsHomeAddressOrMailingAddressPath, label: {
        //             label:"isBusinessAddressSameAsHomeAddressOrMailingAddress",
        //             mandatory:true,
        //             path:isBusinessAddressSameAsHomeAddressOrMailingAddressPath
        //         },
        //     value:isBusinessAddressSameAsHomeAddressOrMailingAddressValue });
        //     }
        // }
        //     const isMailingAddressSameAsHomeAddressPath = `forms[${formIndex}].data.contactAddress2.isMailingAddressSameAsHomeAddress`;
        //     const isMailingAddressSameAsHomeAddressValue = getValueByPath(basicForm, isMailingAddressSameAsHomeAddressPath);
        //       if (!isMailingAddressSameAsHomeAddressValue) {
        //         allMissingKeys.push({ key: isMailingAddressSameAsHomeAddressPath, label: {
        //             label:"isMailingAddressSameAsHomeAddress",
        //             mandatory:true,
        //             path:isMailingAddressSameAsHomeAddressPath
        //         },
        //     value:isMailingAddressSameAsHomeAddressValue });
        //     }
        // Validate specialty selection based on department
        if (
            !formSchemaWholeObject?.schema?.properties?.departmentSpecialty?.dependencies?.department?.oneOf
                ?.map((data) => data?.properties?.department?.enum[0])
                ?.includes(getValueByPath(basicForm, "basicDetails.departmentSpecialty.department"))
        ) {
            allMissingKeys = allMissingKeys.filter(data => data?.key !== "basicDetails.departmentSpecialty.specialty");
        }

        console.log("All Missing Keys:", allMissingKeys);

        setAllWarningFields(allMissingKeys);
        allMissingFields = allMissingKeys;
        hasMandatoryMissingFields = allMissingKeys?.find(field => field?.label?.mandatory === true);

        if (data === "skipped" || data === "save") {
            handleContactAddressSubmit();
            if (data === "skipped") {
                if (sessionStorage.getItem('fromSummary') === "true") {
                    navigate(-1);
                } else {
                    navigate(navigateURL)
                }
            }
        }
        else {
            if (hasMandatoryMissingFields) {
                setShowValidationDialog(true);
            } else {
                handleContactAddressSubmit();
                if (sessionStorage.getItem('fromSummary') === "true") {
                    navigate(-1);
                } else {
                    navigate(navigateURL)
                }
            }
        }
        console.log("fix", allMissingFields)
    };


    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

    console.log(getValueByPath(basicForm, 'basicDetails.departmentSpecialty.department'), fieldPaths)
    console.log('Metadata', metadata);
    return (
        <div>
            {showInfo && <div className={style.bgdrop} onClick={() => setShowInfo(false)}></div>}
            <div className={`${style.applicationScreenGrid} ${showInfo ? "blurredBackground" : ""}`}>
                <div>
                    <ReappointmentProgressCard
                        step={""}
                        dataType={formSchema?.description}
                        title={formSchema?.title}
                        timeNumber={1}
                        timeText={"Min"}
                        progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
                        basicForm={basicForm}
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
                                warningFields={warningFields?.filter(field => field?.label?.mandatory === true)}
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
                        <div className={`${style.cardTitle} ${style.marginTop10}`}>{formSchema?.properties?.isAddressChanged?.label}</div>
                        {showContactInfo ? (
                            <div className={`${style.reappointmentCard} ${style.padding20} ${style.marginTop}`}>
                                {/* <div
                                    className={style.addMoreText}
                                    dangerouslySetInnerHTML={{ __html: object?.items?.label }}
                                /> */}
                                {formSchema !== undefined && "contactAddress1" in formSchema?.properties && (
                                    <div >
                                        {/* <div className={`${style.applicationCardStyle} `}> */}
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
                                                warningFields={warningFieldsContact?.filter(field => field?.label?.mandatory === true)}
                                                formSchema={formSchemaWholeObject}
                                            />

                                        </div>
                                        <CommonDivider />
                                        {/* </div>
                                        <div className={`${style.applicationCardStyle} ${style.marginTop} `}> */}
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
                                                warningFields={warningFieldsContact?.filter(field => field?.label?.mandatory === true)}
                                                formSchema={formSchemaWholeObject}
                                            />
                                        </div>
                                        {/* </div> */}
                                        <CommonDivider />
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
                                                warningFields={warningFieldsContact?.filter(field => field?.label?.mandatory === true)}
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
                                            <Tooltip title={isContactInfoEdited ? "Click to Update Contact Address" : ""} arrow>
                                                <button
                                                    className={`${style.reappointmentButton} ${isContactInfoEdited ? '' : style.disabledButtonLook}`}
                                                    onClick={isContactInfoEdited ? () => {
                                                        // setShowContactInfo(false);
                                                        getMissingFields()
                                                        setUpdateFrom('contact')
                                                        setIsContactInfoEdited(false);
                                                    } : () => { }}
                                                    disabled={!isContactInfoEdited}
                                                >
                                                    UPDATE
                                                </button>
                                            </Tooltip>
                                        </div>
                                        {/* <div>
                                            <div
                                                className={`${style.reappointmentButtonOutlined}`}
                                                onClick={() => {
                                                    setShowContactInfo(false)
                                                }}
                                            >
                                                CANCEL
                                            </div>
                                        </div> */}
                                    </div>
                                ) : (
                                    <div
                                        className={`${style.displayInRowRev} ${style.marginTop}`}
                                    >
                                        <div>
                                            <Tooltip title={"Click to Close"} arrow>
                                                <div
                                                    className={`${style.reappointmentButton}`}
                                                    onClick={() => {
                                                        setShowContactInfo(false); setViewContactInfo(false);
                                                    }}
                                                >
                                                    CLOSE
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* <div className={`${style.viewMyInfoText} ${style.cursorPointer} ${style.marginTop}`} onClick={() => { setShowContactInfo(true); setViewContactInfo(true) }}>View my information on file</div> */}
                                <div
                                    className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}
                                >
                                    <Tooltip title={"Click to mark as Yes"} arrow>
                                        <div
                                            className={`${yesOrNoAddress === 'Yes' ? style.reappointmentButton : style.reappointmentButtonOutlined}`}
                                            onClick={() => { setShowContactInfo(true); setYesOrNoAddress('Yes') }}
                                        >
                                            YES
                                        </div>
                                    </Tooltip>
                                    <Tooltip title={"Click to mark as No"} arrow>
                                        <div
                                            className={`${yesOrNoAddress === 'No' ? style.reappointmentButton : style.reappointmentButtonOutlined} ${style.marginLeft}`}
                                            onClick={() => { setShowContactInfo(false); setYesOrNoAddress('No') }}
                                        >
                                            NO
                                        </div>
                                    </Tooltip>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={style.threeColForButton}>
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div></Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                            <div className={`${style.saveInProgress} ${style.marginTop}${!isContinueEnabled ? style.disabledButtonLook : ''}`} onClick={() => {
                                if (isContinueEnabled) {
                                    getIsSaveInProgressOpen(true)
                                }
                            }}>SAVE IN PROGRESS</div></Tooltip>
                        <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                            <div className={`${style.continue} ${style.marginTop}`} onClick={() => handleBackClick()}>BACK</div></Tooltip>
                        <Tooltip title={"Click to Proceed to the Next Step"} arrow>
                            <div className={`${style.continue} ${style.marginTop} ${!isContinueEnabled ? style.disabledButtonLook : ''}`} onClick={() => {
                                if (isContinueEnabled) {
                                    getAllMissingFields();
                                }
                            }}>CONTINUE</div></Tooltip>
                    </div>
                </div>

                <div>

                    {!showInfo && (
                        <div>
                            <div className={`${style.toggleButton} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hidden : ""}`} onClick={() => setShowInfo(!showInfo)}>
                                <MenuIcon className={style.toggleIcon} />
                            </div>
                            <div className={`${style.headerData}${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hidden : ""}`}>
                                <span style={{ marginLeft: '20px' }}>Confirm Your Demographic Data</span>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className={`${style.infoContainer} ${showInfo ? style.show : ""}`}>
                            <img src={Close} alt="Close" className={style.closeIcon} onClick={() => setShowInfo(false)} />
                            <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                            <div className={style.marginTop}>
                                <ApplicationAssistanceCard
                                    user={"Neena Greenly"}
                                    designation={"{Designation}"}
                                    contactNumber={"{Contact Number}"}
                                    email={"{Email}"}
                                />
                            </div>
                            <div className={style.marginTop}>
                                <ApplicationReferenceDocuments />
                            </div>
                        </div>

                    </div>
                    {/* <div className={style.twoColForButton}>
                        <div
                            className={`${style.saveInProgress} ${style.marginTop}`}
                            onClick={() => getIsSaveInProgressOpen(true)}
                        >
                            SKIP FOR NOW
                        </div> */}
                    <div className={`${style.stickyContainer} ${isSaveInProgressOpen || showValidationDialog || showJourneyDialog ? style.hiddenStickyContainer : ""}`}>
                        <Tooltip title={"Click to Skip This Step and Continue Later"} arrow> <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getSkipClicked(true)}>SKIP FOR NOW</div></Tooltip>
                        <Tooltip title={"Click to Save your Progress and Continue later"} arrow>
                            <div
                                className={`${style.saveInProgress} ${style.marginTop} ${!isContinueEnabled && yesOrNoAddress === '' && yesOrNoDemographic === ''
                                        ? style.disabledButtonLook
                                        : ''
                                    }`}
                                onClick={() => {
                                    if (isContinueEnabled && yesOrNoAddress !== '' && yesOrNoDemographic !== '') {
                                        getIsSaveInProgressOpen(true)
                                    }
                                }}
                            >
                                SAVE IN PROGRESS
                            </div>
                        </Tooltip>

                        <div className={style.twoColForButton}>
                            <Tooltip title={"Click to Go Back to the Previous Step"} arrow>
                                <div
                                    className={`${style.continue} ${style.marginTop10}`}
                                    onClick={() => handleBackClick()}
                                >
                                    BACK
                                </div>
                            </Tooltip>
                            {/* <div
                            className={`${style.continue} ${style.marginTop10}`}
                            onClick={() => setShowJourneyDialog(true)}
                        >
                            CONTINUE
                        </div> */}
                            <Tooltip title={"Click to Proceed to the Next Step"} arrow>
                                <div className={` ${style.continue} ${style.marginTop10}  ${!isContinueEnabled && yesOrNoAddress === '' && yesOrNoDemographic === ''
                                        ? style.disabledButtonLook
                                        : ''
                                    }`} onClick={() => {
                                        if (isContinueEnabled && yesOrNoAddress !== '' && yesOrNoDemographic !== '') {
                                            getAllMissingFields();
                                        }
                                    }}>CONTINUE</div></Tooltip>
                        </div>

                    </div>
                    {/* <div className={`${style.infoContainer} ${showInfo ? style.show : ""} ${style.marginTop}`}>
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
                    labelList={updateFrom === "Continue"
                        ? allWarningFields?.filter(field => field?.label?.mandatory !== false && Object.keys(field?.label).length !== 0)
                        : updateFrom === "contact"
                            ? warningFieldsContact?.filter(field => field?.label?.mandatory !== false && Object.keys(field?.label).length !== 0)
                            : warningFields?.filter(field => field?.label?.mandatory !== false && field?.label !== undefined)
                    }
                    getSkipClicked={updateFrom === "Continue"
                        ? getContactSkipClicked
                        : updateFrom === "contact"
                            ? getContactSkipClicked
                            : getSkipClicked
                    }
                />
            )}

            {showJourneyDialog && (
                <ReappointmentJourneyDialog getIsOpen={getIsShowReappointmentJourneyDialog} title={`Great Start! You're On Your Way.`} img={JourneyStep2} formIndex={formIndex} basicForm={basicForm} continueClick={getAllMissingFields} />
            )}
        </div>
    );
}

export default DemographicData;
