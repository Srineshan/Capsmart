import React, { useEffect, useState, useRef } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import { GET, POST, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, SuccessToaster } from '../../../../utils/toaster';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ValidationDialog from '../../../../Components/validationDialog';
import html2pdf from "html2pdf.js";

import style from './index.module.scss';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import NoDataBox from '../../../../Components/ReusableSmallComponents/noDataBox';

const PaymentOrder = ({ basicForm, setBasicForm, applicationId, getPreApplication }) => {
    const [formSchema, setFormSchema] = useState();
    const targetRef = useRef();
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const [warningFields, setWarningFields] = useState([]);
    const [isAddMore, setIsAddMore] = useState(false)
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const navigate = useNavigate()
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [completedFormAsFile, setCompletedFormAsFile] = useState();
    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.filter(data => data?.formCategory === 'Form')?.length === (formIndex + 1)) ? `/applicationForm/${applicationId}/Form/${btoa('PODCheck')}` : `/applicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
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
        console.log(labels, 'labels', data)
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
            if (form?.preFillRequired) {
                preFillData()
            }
        }
    }

    const preFillData = async () => {
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}/preFillData`)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
            })
    }

    const getIsSubmitClicked = (value, data, skip) => {
        if (value) {
            handleSubmitApplicationReq(data, skip)
        }
    }

    const getSkipClicked = (value) => {
        if (value) {
            handleSubmitApplicationReq("skipped")
        }
    }

    const removeEmptyStrings = (obj) => {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "string" && obj[key].trim() === "") {
                delete obj[key];
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                removeEmptyStrings(obj[key]);
            }
        });
        return obj;
    };


    const getMissingFields = () => {
        let missingKeys = [];
        let keyValuePair = [];
        const cellPhone = getValueByPath(
            basicForm,
            `forms[${formIndex}].data.personalInformation.phone`
        );
        const emailId = getValueByPath(
            basicForm,
            `forms[${formIndex}].data.personalInformation.emailAddress`
        );
        metadata?.map((data, index) => {
            if (labels[index]?.mandatory)
                keyValuePair.push({ key: data, value: getValueByPath(basicForm, data), label: labels[index]?.label })
        })
        const validateBusinessPhone = (phone) => {
            const cleaned = phone?.replace(/\D/g, "");
            const phoneRegex = /^[0-9]{10}$/;
            return phoneRegex.test(cleaned);
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const isCellPhoneInvalid = !validateBusinessPhone(cellPhone);
        const isEmailInvalid = !emailRegex.test(emailId);

        if (isCellPhoneInvalid && cellPhone && cellPhone !== "") {
            missingKeys.push({
                key: "cellPhone",
                value: cellPhone,
                label: "Cell Phone is invalid",
            });
        }

        if (isEmailInvalid && emailId && emailId !== "") {
            missingKeys.push({
                key: "emailId",
                value: emailId,
                label: "Email ID is invalid",
            });
        }
        keyValuePair?.map(data => {
            if (data?.value === "" || data?.value === null || data?.value === undefined || data?.value === 0) {
                missingKeys.push(data)
            }
        })
        if (isCellPhoneInvalid) {
            setBasicForm((prevForm) => ({
                ...prevForm,
                forms: prevForm.forms.map((form) => {
                    if (form.schemaId === basicForm.forms[formIndex].schemaId) {
                        return {
                            ...form,
                            data: {
                                ...form.data,
                                personalInformation: {
                                    ...form.data.personalInformation,
                                    phone: "",
                                },
                            },
                        };
                    }
                    return form;
                }),
            }));
        }

        if (isEmailInvalid) {
            setBasicForm((prevForm) => ({
                ...prevForm,
                forms: prevForm.forms.map((form) => {
                    if (form.schemaId === basicForm.forms[formIndex].schemaId) {
                        return {
                            ...form,
                            data: {
                                ...form.data,
                                personalInformation: {
                                    ...form.data.personalInformation,
                                    emailAddress: "",
                                },
                            },
                        };
                    }
                    return form;
                }),
            }));
        }
        if (missingKeys?.length !== 0) {
            setShowValidationDialog(true)
        } else {
            handleSubmitApplicationReq()
        }
        setWarningFields(missingKeys)
        console.log(keyValuePair, 'Metadata', missingKeys)
    }

    const handleSubmitApplicationReq = async (data) => {
        if (isEdited) {
            console.log(basicForm?.forms?.[formIndex]?.data)
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: basicForm?.forms?.[formIndex]?.data,
                unFilledFields: warningFields?.map(data => data?.label),
                acknowledged: data === "skipped" ? false : true
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    SuccessToaster("Application Updated Successfully");
                    getPreApplication();
                    handleDownload();
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

    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === "true") {
            navigate(-1);
            sessionStorage.setItem('fromSummary', false)
        }
        else {
            navigate(navigateURL)

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

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": 'acknowledgement.pdf'
        };
        const formData = new FormData();

        if (file !== null) {
            const blob = new Blob([file], { type: `application/pdf` });
            formData.append('files', new Blob([JSON.stringify(fileName)], {
                type: "application/json"
            }));
            formData.append('documents', blob, fileName?.fileName);
            let uploadedFile = {};
            try {
                const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
                console.log(response?.data);
                uploadedFile = response?.data?.file;
            } catch (error) {
                console.error(error);
                return null;
            }


            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                completedFormAsFile: uploadedFile,
                data: basicForm?.forms?.[formIndex]?.data,
                unFilledFields: basicForm?.forms?.[formIndex]?.unFilledFields,
                acknowledged: basicForm?.forms?.[formIndex]?.acknowledged
            }
            await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    SuccessToaster("Application Updated Successfully");
                    getPreApplication();
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


        }
    }

    const handleDownload = () => {
        const element = targetRef.current;
        const opt = {
            margin: 0.5,
            filename: "page.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true,
            },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        };
        const nestedElements = element.querySelectorAll('.applicationCardScrollStyle');
        nestedElements.forEach((_element) => {
            _element.classList.remove('applicationCardScrollStyle');
        });
        html2pdf().set(opt).from(element).outputPdf("blob").then((pdfBlob) => {
            addNewDocument(pdfBlob);
        });
    };

    const handleBackClick = () => {
        navigate(navigateBackURL)
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 4'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={8} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`} >
                <div ref={targetRef}>
                    <div className={style.applicationCardStyle}>
                        {formSchema !== undefined && 'personalInformation' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.personalInformation} gridStyle={style.PaymentGrid} baseKey={'personalInformation'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[${formIndex}].data`} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} applicationId={applicationId} />
                        )}
                        {formSchema !== undefined && 'corporateInformation' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.corporateInformation} gridStyle={style.PaymentGrid2} baseKey={'corporateInformation'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[${formIndex}].data`} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} applicationId={applicationId} />
                        )}
                        {formSchema !== undefined && 'contactInformation' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.contactInformation} gridStyle={style.PaymentGrid3} baseKey={'contactInformation'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[${formIndex}].data`} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} applicationId={applicationId} />
                        )}
                        {formSchema !== undefined && 'methodOfPayment' in formSchema?.properties && (
                            <ApplicationFieldCard object={formSchema?.properties?.methodOfPayment} gridStyle={style.PaymentGrid4} baseKey={'methodOfPayment'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} stepPath={`forms[${formIndex}].data`} setIsEdited={getIsEdited} warningFields={warningFields} formSchema={formSchemaWholeObject} applicationId={applicationId} />
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={style.stickyContainer}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={`${style.saveInProgress} ${style.marginTop10} `} onClick={() => handleContinue()} > SKIP FOR NOW </div>
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
            {
                showValidationDialog && (
                    <ValidationDialog getIsOpen={getIsValidationDialogOpen} labelList={warningFields} getSkipClicked={getSkipClicked} />
                )
            }
        </div >
    )
}

export default PaymentOrder;
