import React, { useEffect, useState, useRef } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';
import { GET, POST, PUT } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import ApplicationReferenceDocuments from '../../../../Components/ApplicationReferenceDocuments';
import { ErrorToaster, ErrorToaster2, SuccessToaster } from '../../../../utils/toaster';
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import NoDataBox from '../../../../Components/ReusableSmallComponents/noDataBox';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import CommonDropZone from '../../../../Components/CommonFields/CommonDropZone';
import CommonTextField from '../../../../Components/CommonFields/CommonTextField';
import CommonSelectField from '../../../../Components/CommonFields/CommonSelectField';
import CommonDateField from '../../../../Components/CommonFields/CommonDateField';
import { TextField } from '@mui/material';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import CommonPhoneField from '../../../../Components/CommonFields/CommonPhoneField';
import ESignature from '../../../../Components/ESignature';
import { format } from 'date-fns';
import DeleteIcon from './../../../../images/deleteHcRow.png';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import html2pdf from "html2pdf.js";
import TableTwo from '../../../../Components/TableDesignTwo';
import { fileLoadingURL } from '../../../../utils/formatting';

const Immunization = ({ basicForm, setBasicForm, applicationId, getPreApplication, dateFormat, name }) => {
    const [formSchema, setFormSchema] = useState();
    const targetRef = useRef();
    const tableRef = useRef(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState(format(new Date(), dateFormat));
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [calendarStart, setCalendarStart] = useState(false);
    const [immunization, setImmunization] = useState('');
    const [from, setFrom] = useState(null);
    const [result, setResult] = useState('');
    const [induration, setInduration] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [applicationImmunization, setApplicationImmunization] = useState();
    const [immunizationCategory, setImmunizationCategory] = useState('');
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const navigate = useNavigate()
    const immunizationCategoryValues = {
        "Tuberculosis": 'TUBERCULIN', "Measles, Mumps & Rubella (MMR)": 'MEASLES_MUMPS_RUBELLA', "Hepatitis B Vaccination": 'HEPATITIS_B', "Varicella": 'VARICELLA', "Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)": 'TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA', "Influenza": 'INFLUENZA', "Covid": 'COVID'
    }

    const immunizationValues = {
        "2 Step Test ": 'TWO_STEP_TEST', "1 Step Test": 'ONE_STEP_TEST', "Chest X Ray": 'CHEST_X_RAY', 'MMR 1': 'MMR1', 'MMR 2': 'MMR2', "Laboratory Evidence Of Immunity": 'LABORATORY_EVIDENCE_OF_IMMUNITY', "HEP B 3": 'HEP_B_3', "HEP B 2": 'HEP_B_2', "HEP B 1": 'HEP_B_1', "Varicella 1": 'VARICELLA_1', "Varicella 2": 'VARICELLA_2', "Laboratory Confirmation Of Disease": 'LABORATORY_CONFIRMATION_OF_DISEASE', "Influenza Vaccine": 'INFLUENZA_VACCINE', "Covid Vaccine": 'COVID_VACCINE', "Booster": 'BOOSTER', "TD Immunization": 'TD_IMMUNIZATION', "TDAP Immunization": 'TDAP_IMMUNIZATION', "HEP B Booster": 'HEP_B_BOOSTER', "Pertusis Asult Dose": 'PERTUSIS_ADULT_DOSE'
    }

    const resultValues = {
        "Positive": 'POSITIVE', "Negative": 'NEGATIVE'
    }

    const immunizationCategoryLabels = Object.fromEntries(
        Object.entries(immunizationCategoryValues).map(([label, value]) => [value, label])
    );

    const immunizationLabels = Object.fromEntries(
        Object.entries(immunizationValues).map(([label, value]) => [value, label])
    );

    const resultLabels = Object.fromEntries(
        Object.entries(resultValues).map(([label, value]) => [value, label])
    );

    const immunizationKeys = [
        "2 Step Test ",
        "1 Step Test",
        "Chest X Ray",
        "MMR 1",
        "MMR 2",
        "Laboratory Evidence Of Immunity",
        "HEP B 3",
        "HEP B 2",
        "HEP B 1",
        "Varicella 1",
        "Varicella 2",
        "Laboratory Confirmation Of Disease",
        "Influenza Vaccine",
        "Covid Vaccine",
        "Booster",
        "TD Immunization",
        "TDAP Immunization",
        "HEP B Booster",
        "Pertusis Asult Dose"
    ];

    const tableHeader = ['Test / Immunization', 'Result', 'Last Test Date', 'Valid', '']

    useEffect(() => {
        if (applicationId)
            getApplicationImmunization()
    }, [applicationId])

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

    useEffect(() => {
        if (uploadedFiles?.length > 0) {
            tableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [uploadedFiles]);

    const getApplicationImmunization = async () => {
        const { data: immunization } = await GET(
            `application-management-service/application/${applicationId}/immunization`
        );
        setApplicationImmunization(immunization)
        setIsSigned((immunization?.esign?.esign && immunization?.esign) ? true : false);
    }

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
        );
        setFormSchema(form?.schema)
    }

    const getIsSubmitClicked = (value, data) => {
        if (value) {
            handleSubmitApplicationReq(data)
        }
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    };

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": 'immunization.pdf'
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

            try {
                const response = await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}/addFileToForm`, uploadedFile);
                console.log(response?.data);
                return response?.data;
            } catch (error) {
                console.error(error);
                return null;
            }
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

    const handleSubmitApplicationReq = async (data) => {
        let temp = {
            schemaId: data?.forms?.[formIndex]?.schemaId,
            data: data?.forms?.[formIndex]?.data
        }
        await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getPreApplication();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }

    const changeHandler = async (event) => {
        setIsLoading(true);
        setFiles(event);
        console.log(event, 'Test');

        const formData = new FormData();
        let fileNameArray = [];
        event?.forEach(file => {
            fileNameArray.push({ "fileName": file?.name });
            formData.append('documents', file); // Append each file individually
        });

        formData.append('files', new Blob([JSON.stringify(fileNameArray)], {
            type: "application/json"
        }));
        console.log(fileNameArray)
        try {
            const response = await POST(`application-management-service/application/${applicationId}/files/bulk?isLLMRequired=${true}`, formData);
            SuccessToaster('File Uploaded Successfully');
            console.log(response?.data);
            setUploadedFiles(response?.data)
            setIsLoading(false);
            return response?.data;
        } catch (error) {
            ErrorToaster('File Upload Failed');
            console.error(error);
            setIsLoading(false);
            return null;
        }
    };

    const handleAddMore = async (close) => {
        if (immunizationCategory === "") {
            ErrorToaster2("Test / Immunization Category is Mandatory")
            return;
        }
        if (immunization === "") {
            ErrorToaster2("Test / Immunization is Mandatory")
            return;
        }
        if (!from) {
            ErrorToaster2("From Date is Mandatory")
            return;
        }
        if (result === "") {
            ErrorToaster2("Result is Mandatory")
            return;
        }
        if (induration === "") {
            ErrorToaster2("Induration is Mandatory")
            return;
        }
        let temp = []

        setApplicationImmunization((prev) => {

            const categoryEnum = immunizationCategoryValues[immunizationCategory];
            const immunizationEnum = immunizationValues[immunization];
            const resultEnum = resultValues[result];

            if (!categoryEnum || !immunizationEnum) {
                console.warn("Invalid category or immunization mapping.");
                return prev;
            }

            const newTestDetail = {
                immunization: immunizationEnum,
                testDate: from || "",
                result: resultEnum || "",
                induration: induration || "",
                files: uploadedFiles
            };

            const updated = { ...prev };

            updated.esign = updated.esign || null;

            updated.immunizationDetails = updated.immunizationDetails || [];

            const categoryIndex = updated.immunizationDetails.findIndex(
                (item) => item.immunizationCategory === categoryEnum
            );

            if (categoryIndex === -1) {
                updated.immunizationDetails.push({
                    immunizationCategory: categoryEnum,
                    testDetails: [newTestDetail]
                });
            } else {
                updated.immunizationDetails[categoryIndex].testDetails.push(newTestDetail);
            }
            console.log(updated, 'updated')
            temp = updated;

            return updated;
        });
        await PUT(`application-management-service/application/${applicationId}/immunization`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                handleClear();
                getApplicationImmunization();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    };

    const handleContinue = async (close) => {
        if (isEdited) {
            let temp = []

            setApplicationImmunization((prev) => {

                const updated = { ...prev };

                updated.esign = updated.esign?.esign ? updated.esign : {
                    esign: isSigned ? encryptedText : '',
                    name: isSigned ? name : '',
                    signedDate: isSigned ? currentDate : ''
                };

                console.log(updated, 'updated')
                temp = updated;

                return updated;
            });
            await PUT(`application-management-service/application/${applicationId}/immunization`, temp)
                .then(response => {
                    console.log(response)
                    SuccessToaster("Application Updated Successfully");
                    handleClear();
                    handleDownload()
                    getApplicationImmunization();
                    navigate(navigateURL)
                })
                .catch((error) => {
                    console.log(error)
                    ErrorToaster("Unexpected Error Updating Application");
                });
        } else {
            handleDownload()
            navigate(navigateURL)
        }
    };

    const handleDeleteTestDetail = async (categoryEnum, testDetailToDelete) => {
        let temp = []
        setApplicationImmunization((prev) => {
            const updated = { ...prev };

            if (!updated.immunizationDetails) return prev;

            updated.immunizationDetails = updated.immunizationDetails
                .map((cat) => {
                    if (cat.immunizationCategory !== categoryEnum) return cat;

                    // Filter out the testDetail to delete
                    const filteredTests = cat.testDetails.filter(
                        (td) => td !== testDetailToDelete
                    );

                    return {
                        ...cat,
                        testDetails: filteredTests
                    };
                })
                // Optionally remove categories that become empty
                .filter((cat) => cat.testDetails.length > 0);
            temp = updated;
            return updated;
        });
        await PUT(`application-management-service/application/${applicationId}/immunization`, temp)
            .then(response => {
                console.log(response)
                SuccessToaster("Application Updated Successfully");
                getApplicationImmunization();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    };

    const handleClear = () => {
        setImmunization('');
        setImmunizationCategory('');
        setFrom(null);
        setResult('');
        setInduration('');
    }

    const handleDelete = () => {

    }

    let test = [];
    let pos = [];
    let lastTestDate = [];
    let valid = [];
    let deleteIcon = [];

    const getTableValues = (data, category) => {
        test = [];
        pos = [];
        lastTestDate = [];
        valid = [];
        deleteIcon = [];
        data?.map(innerData => {
            test.push(immunizationLabels[innerData?.immunization])
            pos.push(resultLabels[innerData?.result] !== "Neg" ? 'Positive' : 'Negative')
            lastTestDate.push(innerData?.testDate ? format(new Date(innerData?.testDate), 'MMM dd, yyyy') : '')
            valid.push(innerData?.files?.[0]?.valid ? <CheckIcon sx={{ color: '#06617A' }} /> : <ClearIcon sx={{ color: '#06617A' }} />)
            deleteIcon.push(<img src={DeleteIcon} alt="" className={`${style.docTypeImgStyle} ${style.cursorPointer}`} onClick={() => { handleDeleteTestDetail(category, innerData) }} />)
        })

        return [
            { type: "text", value: test },
            { type: "text", value: pos },
            { type: "text", value: lastTestDate },
            { type: "icon", icon: valid },
            { type: "icon", icon: deleteIcon },
        ];
    }

    const getIsEdited = (value) => {
        setIsEdited(value)
    }

    const handleBackClick = () => {
        navigate(navigateBackURL)
    }

    return (
        <>
            {isLoading && (
                <div className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}>
                    <div className={style.uploadContainer}>
                        <div className={style.fileImportingMsg}>
                            We are importing your documents and extracting the required data.
                        </div>
                        <img src={fileLoadingURL} alt="" className={style.fileLoadingStyle} />
                        <div className={style.fileImportingMsg}>
                            Please wait! Do not close your browser window.
                        </div>
                    </div>
                </div>
            )}
            <div>
                <div className={style.applicationScreenGrid}>
                    <ProgressCard step={'STEP 15'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={2} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
                    <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
                </div>
                <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                    <div>
                        <div className={style.applicationCardStyle}>
                            <div className={`${style.cardTitle} ${style.marginTop}`}>Professional Staff Immunization & Surveillance Policy Information Sheet</div>
                            <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.description}</div>
                            <CommonDivider />
                            <div className={`${style.twoCol} ${style.marginTop}`}>
                                <CommonDropZone
                                    title={"Upload Your Documents"}
                                    description={
                                        "Upload your files or drag & drop from your file cabinet (Computer / Online Drive)"
                                    }
                                    changeHandler={changeHandler}
                                    files={files}
                                />
                                <CommonDropZone
                                    title={"Upload A Photo"}
                                    description={
                                        "Click a picture of the document with your camera and Upload or Upload from your photo gallery."
                                    }
                                    changeHandler={changeHandler}
                                    files={files}
                                    accept="image/*"
                                />
                            </div>
                            <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                                <div className={style.padding20} ref={tableRef}>
                                    <div
                                        className={style.cardTitle}>
                                        {formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.label}
                                    </div>
                                    <div className={`${style.ImmunizationGrid} ${style.marginTop}`}>
                                        <CommonSelectField
                                            value={immunizationCategory}
                                            onChange={(e) => setImmunizationCategory(e.target.value)}
                                            className={style.fullWidth}
                                            // firstOptionLabel={fieldData.label}
                                            // firstOptionValue={fieldData.label}
                                            valueList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/ImmunizationCategory']?.enum}
                                            labelList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/ImmunizationCategory']?.enum}
                                            disabledList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/ImmunizationCategory']?.enum?.map(data => false)}
                                            label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/ImmunizationCategory']?.label}
                                            required={true}
                                        />
                                        <CommonSelectField
                                            value={immunization}
                                            onChange={(e) => setImmunization(e.target.value)}
                                            className={style.fullWidth}
                                            // firstOptionLabel={fieldData.label}
                                            // firstOptionValue={fieldData.label}
                                            // valueList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/Immunization']?.enum}
                                            // labelList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/Immunization']?.enum}
                                            // disabledList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/Immunization']?.enum?.map(data => false)}
                                            valueList={immunizationKeys}
                                            labelList={immunizationKeys}
                                            disabledList={immunizationKeys?.map(data => false)}
                                            label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['test/Immunization']?.label}
                                            required={true}
                                        />
                                        <CommonDateField
                                            className={style.fullWidth}
                                            open={calendarStart}
                                            onOpen={() => setCalendarStart(true)}
                                            onClose={() => setCalendarStart(false)}
                                            // minDate={sub(new Date(), { years: 3 })}
                                            // maxDate={add(new Date(), { months: 6 })}
                                            value={from || null}
                                            onChange={(newValue) => setFrom(newValue)}
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
                                                        placeholder: `DD-MM-YYYY`,
                                                        readOnly: true
                                                    }}
                                                    // color={
                                                    //     warningFields
                                                    //         ?.map((data) => data?.key)
                                                    //         ?.includes(`${basicpath}.${baseKey}.${fieldKey}`) &&
                                                    //         (getValueByPath(
                                                    //             basicForm,
                                                    //             `${basicpath}.${baseKey}.${fieldKey}`
                                                    //         ) === null ||
                                                    //             getValueByPath(
                                                    //                 basicForm,
                                                    //                 `${basicpath}.${baseKey}.${fieldKey}`
                                                    //             ) === "")
                                                    //         ? "error"
                                                    //         : ""
                                                    // }
                                                    fullWidth
                                                // focused={
                                                //     warningFields
                                                //         ?.map((data) => data?.key)
                                                //         ?.includes(`${basicpath}.${baseKey}.${fieldKey}`) &&
                                                //         (getValueByPath(
                                                //             basicForm,
                                                //             `${basicpath}.${baseKey}.${fieldKey}`
                                                //         ) === null ||
                                                //             getValueByPath(
                                                //                 basicForm,
                                                //                 `${basicpath}.${baseKey}.${fieldKey}`
                                                //             ) === "")
                                                //         ? true
                                                //         : false
                                                // }
                                                />
                                            )}
                                            label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['from']?.label}
                                            required={true}
                                        />
                                        <CommonSelectField
                                            value={result}
                                            onChange={(e) => setResult(e.target.value)}
                                            className={style.fullWidth}
                                            // firstOptionLabel={fieldData.label}
                                            // firstOptionValue={fieldData.label}
                                            valueList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['result']?.enum}
                                            labelList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['result']?.enum}
                                            disabledList={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['result']?.enum?.map(data => false)}
                                            label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['result']?.label}
                                            required={true}
                                        />
                                        <CommonTextField
                                            value={induration}
                                            className={style.fullWidth}
                                            onChange={(e) => setInduration(e.target.value)}
                                            placeholder={''}
                                            label={formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['enterTest/ImmunizationInformation']?.properties['induration']?.label}
                                            required={true}
                                        />
                                    </div>
                                    <div className={style.marginTop}>
                                        {uploadedFiles?.map((data, index) => (
                                            <div className={style.uploadButton2}>
                                                <span
                                                    className={`${style.uploadText2} ${style.verticalAlignCenter}`}
                                                >
                                                    {data?.file?.fileName}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        className={`${style.displayInRowRev} ${style.marginTop}`}
                                    >
                                        <div className={style.marginLeft}>
                                            <div
                                                className={`${style.addMoreButton}`}
                                                onClick={() => {
                                                    handleAddMore('close');
                                                }}
                                            >
                                                SAVE
                                            </div>
                                        </div>
                                        {/* <div>
                                            <div
                                                className={`${style.addMoreButtonOutlined}`}
                                                onClick={() => {
                                                    handleAddMore('');
                                                }}
                                            >
                                                SAVE & ADD MORE
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div ref={targetRef}>
                                <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tuberculosis(TB)']?.label}</div>
                                <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tuberculosis(TB)']?.description}</div>
                                {applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TUBERCULIN")?.length !== 0 && (
                                    <TableTwo
                                        tableHeaderValues={tableHeader}
                                        tableDataValues={getTableValues(applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TUBERCULIN")?.[0]?.testDetails, 'TUBERCULIN')}
                                        tableData={applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TUBERCULIN")?.[0]?.testDetails}
                                        gridStyle={style.testGrid}
                                        tableSortValues={[]}
                                        heading={"There are no records to display"}
                                        className={`${style.tableRow} ${style.reportSection}`}
                                        hidePagination={true}
                                    />
                                )}
                                <CommonDivider />
                                <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Measles, Mumps & Rubella (MMR)']?.label}</div>
                                <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Measles, Mumps & Rubella (MMR)']?.description}</div>
                                {applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "MEASLES_MUMPS_RUBELLA")?.length !== 0 && (
                                    <TableTwo
                                        tableHeaderValues={tableHeader}
                                        tableDataValues={getTableValues(applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "MEASLES_MUMPS_RUBELLA")?.[0]?.testDetails, "MEASLES_MUMPS_RUBELLA")}
                                        tableData={applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "MEASLES_MUMPS_RUBELLA")?.[0]?.testDetails}
                                        gridStyle={style.testGrid}
                                        tableSortValues={[]}
                                        heading={"There are no records to display"}
                                        className={`${style.tableRow} ${style.reportSection}`}
                                        hidePagination={true}
                                    />
                                )}
                                <CommonDivider />
                                <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Hepatitis B Vaccination']?.label}</div>
                                <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Hepatitis B Vaccination']?.description}</div>
                                {applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "HEPATITIS_B")?.length !== 0 && (
                                    <TableTwo
                                        tableHeaderValues={tableHeader}
                                        tableDataValues={getTableValues(applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "HEPATITIS_B")?.[0]?.testDetails, "HEPATITIS_B")}
                                        tableData={applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "HEPATITIS_B")}
                                        gridStyle={style.testGrid}
                                        tableSortValues={[]}
                                        heading={"There are no records to display"}
                                        className={`${style.tableRow} ${style.reportSection}`}
                                        hidePagination={true}
                                    />
                                )}
                                <CommonDivider />
                                <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Varicella']?.label}</div>
                                <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Varicella']?.description}</div>
                                {applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "VARICELLA")?.length !== 0 && (
                                    <TableTwo
                                        tableHeaderValues={tableHeader}
                                        tableDataValues={getTableValues(applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "VARICELLA")?.[0]?.testDetails, "VARICELLA")}
                                        tableData={applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "VARICELLA")?.[0]?.testDetails}
                                        gridStyle={style.testGrid}
                                        tableSortValues={[]}
                                        heading={"There are no records to display"}
                                        className={`${style.tableRow} ${style.reportSection}`}
                                        hidePagination={true}
                                    />
                                )}
                                <CommonDivider />
                                <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)']?.label}</div>
                                <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Tetnues/Diptheriea/Pertussis(Tdap) and Tetatnus/Diphtheria(Td)']?.description}</div>
                                {applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")?.length !== 0 && (
                                    <TableTwo
                                        tableHeaderValues={tableHeader}
                                        tableDataValues={getTableValues(applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")?.[0]?.testDetails, "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")}
                                        tableData={applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "TETANUS_DIPHTHERIA_PERTUSSIS_OR_TETANUS_DIPHTHERIA")?.[0]?.testDetails}
                                        gridStyle={style.testGrid}
                                        tableSortValues={[]}
                                        heading={"There are no records to display"}
                                        className={`${style.tableRow} ${style.reportSection}`}
                                        hidePagination={true}
                                    />
                                )}
                                <CommonDivider />
                                <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Influenza']?.label}</div>
                                <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.professionalStaffImmunizationAndSurveillancePolicyInformationSheet?.properties['test/ImmunizationCategoryTables']?.properties['Influenza']?.description}</div>
                                {applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "INFLUENZA")?.length !== 0 && (
                                    <TableTwo
                                        tableHeaderValues={tableHeader}
                                        tableDataValues={getTableValues(applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "INFLUENZA")?.[0]?.testDetails, "INFLUENZA")}
                                        tableData={applicationImmunization?.immunizationDetails?.filter(data => data?.immunizationCategory === "INFLUENZA")?.[0]?.testDetails}
                                        gridStyle={style.testGrid}
                                        tableSortValues={[]}
                                        heading={"There are no records to display"}
                                        className={`${style.tableRow} ${style.reportSection}`}
                                        hidePagination={true}
                                    />
                                )}
                            </div>
                            {/* <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.label}</div>
                        <div className={`${style.descriptionText} ${style.marginTop}`}>{formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.description}</div>
                        <div className={`${style.addMoreBorder} ${style.marginTop}`}>
                            <div className={style.padding20}>
                                <div className={`${style.ImmunizationGrid} `}>
                                    <CommonTextField
                                        className={style.fullWidth}
                                        placeholder={''}
                                        label={formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.properties['primaryPhysicianName']?.label}
                                        required={true}
                                    />
                                    <CommonTextField
                                        
                                        className={style.fullWidth}
                                        
                                        placeholder={''}
                                        label={formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.properties['medicalCentricClinicName']?.label}
                                        required={true}
                                    />
                                </div>
                                <div className={`${style.ImmunizationGrid} ${style.marginTop}`}>
                                    <CommonTextField
                                        
                                        className={style.fullWidth}
                                        
                                        placeholder={''}
                                        label={formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.properties['emailId']?.label}
                                        required={true}
                                    />
                                    <CommonPhoneField
                                        
                                        className={style.fullWidth}

                                        placeholder={''}
                                        label={formSchema?.properties?.primaryCarePhysicianForVerificationOfImmunizationHistory?.properties['contactNumber']?.label}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </div> */}
                            <div className={style.twoCol}>
                                <div onClick={!isSigned ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }}>
                                    <ESignature
                                        userName={isSigned ? name : ""}
                                        encData={isSigned ? encryptedText : ''}
                                        showData={isSigned}
                                        showDatais={true}
                                    />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.displayInRow}>
                                        <div className={style.dateTitle}>Date: </div>
                                        <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (applicationImmunization?.esign?.signedDate !== '' && applicationImmunization?.esign?.signedDate !== undefined) ? applicationImmunization?.esign?.signedDate : currentDate : ""}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                        <div className={style.stickyContainer}>
                            <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                            <div className={style.twoColForButton}>
                                <div className={`${style.continue} ${style.marginTop10}`} onClick={handleBackClick}>BACK</div>
                                <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleContinue()} >CONTINUE</div>
                            </div>
                        </div>
                        <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div>
                    </div>
                </div>
                {isSaveInProgressOpen && (
                    <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
                )}
            </div>
        </>
    )
}

export default Immunization;