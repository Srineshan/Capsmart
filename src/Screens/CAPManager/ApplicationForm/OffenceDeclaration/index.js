import React, { useEffect, useState, useRef } from 'react';
import ProgressCard from '../../../../Components/ProgressCard';
import ApplicationUserCard from '../../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../../Components/CommonFields/CommonDivider';
import logo from "../../../../images/cambridgeHospital.png";
import { GET, PUT, POST } from '../../../dataSaver';
import { useNavigate, useParams } from 'react-router-dom';
import html2pdf from "html2pdf.js";
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../../Components/ESign';
import { format } from 'date-fns';
import { TextField } from "@mui/material";
import { SuccessToaster, ErrorToaster } from '../../../../utils/toaster';
import ESignature from '../../../../Components/ESignature';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';
import ApplicationFieldCard from '../../../../Components/ApplicationFieldCard';

const OffenceDeclaration = ({ acknowledgementForm, dateFormat, name, basicForm, getPreApplication, applicationId, setBasicForm }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [metadata, setMetadata] = useState([]);
    const [labels, setLabels] = useState([]);
    const [warningFields, setWarningFields] = useState([]);
    const [isAddMore, setIsAddMore] = useState(false)
    const [formSchemaWholeObject, setFormSchemaWholeObject] = useState();
    const [showValidationDialog, setShowValidationDialog] = useState(false);
    const navigate = useNavigate()
    const targetRef = useRef();
    const [isSigned, setIsSigned] = useState(false);
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
    // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
    const [currentDate, setCurrentDate] = useState();
    const [isEdited, setIsEdited] = useState(false);
    const [formSchema, setFormSchema] = useState();
    const [formContent, setFormContent] = useState();
    const [checkedDisclaimer, setCheckedDisclaimer] = useState('');
    const [signText, setSignText] = useState(name + " " + currentDate);
    const initialData = [
        { id: 1, dateOfConviction: "", natureOfOffence: "", panaltyImposed: "" },
        { id: 2, dateOfConviction: "", natureOfOffence: "", panaltyImposed: "" },
        { id: 3, dateOfConviction: "", natureOfOffence: "", panaltyImposed: "" },
        { id: 4, dateOfConviction: "", natureOfOffence: "", panaltyImposed: "" },
        { id: 5, dateOfConviction: "", natureOfOffence: "", panaltyImposed: "" },
    ];
    const [tableData, setTableData] = useState(initialData);
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [entityLogo, setEntityLogo] = useState(sessionStorage.getItem('logo') || null)
    useEffect(() => {
        if (dateFormat) {
            setCurrentDate(format(new Date(), dateFormat))
        }
    }, [dateFormat])

    useEffect(() => {
        if (!isChecked) {
            setTableData(initialData); // Reset table data to initial state when unchecked
        }
    }, [isChecked]);

    useEffect(() => {
        if (basicForm && !formSchemaWholeObject) {
            getFormSchema()
        }
        // setEncryptedText(basicForm?.forms?.[formIndex]?.esign?.esign)
        setSignText(basicForm?.forms?.[formIndex]?.acknowledged ? basicForm?.forms?.[formIndex]?.esign?.esign : '');
        setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
        setTableData(basicForm?.forms?.[formIndex]?.data !== null ? basicForm?.forms?.[formIndex]?.data?.tableData : initialData)
        if (!isEdited) {
            setCheckedDisclaimer(basicForm?.forms?.[formIndex]?.data !== null ? basicForm?.forms?.[formIndex]?.data?.checkedDisclaimer : checkedDisclaimer)
            setIsChecked(basicForm?.forms?.[formIndex]?.acknowledged);
        }
        // setDecryptedText(CryptoJS.AES.decrypt(basicForm?.forms?.[formIndex]?.esign?.esign, publicKey).toString(CryptoJS.enc.Utf8))
        if (basicForm !== undefined && formIndex !== undefined) {
            setNavigateURL((basicForm?.forms?.length === (formIndex + 1)) ? `/applicationForm/${applicationId}/Acknowledgement/${btoa('AcknowledgementCheck')}` : `/applicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
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
        if (basicForm?.forms?.[formIndex]?.id !== undefined) {
            getRenderedContent()
        }
    }, [basicForm?.forms?.[formIndex]?.id])

    const getAllPath = (data) => {
        let temp = metadata;
        if (!temp?.includes(data)) {
            console.log(temp, data, "Metadata");
            temp.push(data);
        }
        setMetadata(temp);
    };

    const getAllLabels = (data) => {
        setLabels(prev => {
            const exists = prev.some(item => JSON.stringify(item) === JSON.stringify(data));
            return exists ? prev : [...prev, data];
        });
    };

    const getFormSchema = async () => {
        if (basicForm?.forms?.[formIndex]?.schemaId !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.forms?.[formIndex]?.schemaId}`
            );
            setFormSchema(form?.schema)
            setFormSchemaWholeObject(form)
        }
    }

    const handleInputChange = (e, rowId, fieldName) => {
        const newValue = e.target.value;
        const updatedData = tableData.map((row) => {
            if (row.id === rowId) {
                return { ...row, [fieldName]: newValue };
            }
            return row;
        });
        setTableData(updatedData);
    };

    const getRenderedContent = async () => {
        const { data: content } = await GET(
            `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}/render`
        );
        setFormContent(content)
    }

    const getIsSaveInProgressOpen = (value) => {
        if (value) {
            handleSubmitApplicationReq(true)
        }
        setIsSaveInProgressOpen(value);
    };

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": 'offenceDeclaration.pdf'
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

    const getValueByPath = (obj, path) => {
        const keys = path.split(/[\.\[\]]+/).filter(Boolean);
        console.log(path, keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm), basicForm, 'if')
        return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], basicForm);
    };

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
        setWarningFields(missingKeys)
        console.log(keyValuePair, 'Metadata', missingKeys)
        return missingKeys;
    }

    const handleIsChecked = (value, disclaimerValue) => {
        setIsEdited(true)
        setIsChecked(value)
        if (!value) {
            setIsSigned(false)
        }
        setCheckedDisclaimer(disclaimerValue)
    }

    const handleSubmitTableData = async (data) => {
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: data?.forms?.[formIndex]?.data,
            acknowledged: isChecked,
            esign: { esign: isChecked ? encryptedText : '', name: isChecked ? name : '', signedDate: isChecked ? currentDate : '' }
        }
        await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                getPreApplication()
                SuccessToaster("Application Updated Successfully");
                getFormSchema();
            })
            .catch((error) => {
                console.log(error)
                ErrorToaster("Unexpected Error Updating Application");
            });
    }

    const handleSubmitApplicationReq = async (save) => {
        if (isSigned || save) {
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: !isEdited ? basicForm?.forms?.[formIndex]?.data : { esignDate: isChecked ? name + " " + currentDate : '', checkedDisclaimer: checkedDisclaimer, tableData: tableData, offenceDeclaration: basicForm?.forms?.[formIndex]?.data?.offenceDeclaration },
                acknowledged: isChecked,
                esign: { esign: isChecked ? encryptedText : '', name: isChecked ? name : '', signedDate: isChecked ? currentDate : '' },
                dataStatus: isSigned ? 'COMPLETED' : 'SKIPPED_MANDATORY_FIELD'
            }
            await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    getPreApplication()
                    SuccessToaster("Application Updated Successfully");
                    handleDownload();
                    getFormSchema();
                    if (!save) {
                        if (sessionStorage.getItem('fromSummary') === 'true') {
                            navigate(-1);
                            sessionStorage.setItem('fromSummary', false)
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
        }
        else {
            if (sessionStorage.getItem('fromSummary') === 'true') {
                navigate(-1);
                sessionStorage.setItem('fromSummary', false)
            } else {
                navigate(navigateURL)
            }
        }
    }
    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === 'true') {
            navigate(-1);
            sessionStorage.setItem('fromSummary', false)
        } else {
            navigate(navigateURL)
        }
    }

    console.log(formContent, isChecked, checkedDisclaimer, (isChecked && checkedDisclaimer === 'disclaimer1'))

    const handleBackClick = () => {
        navigate(navigateBackURL)
    }

    const getIsSubmitClicked = (value, data) => {
        if (value) {
            handleSubmitTableData(data)
        }
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 8'} dataType={formSchemaWholeObject?.description} title={formSchemaWholeObject?.title} timeNumber={38} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={`${style.applicationCardStyle} ${style.applicationCardScrollStyle}`} ref={targetRef}>
                        <div className={`${style.marginTop} ${style.justifyCenter}`}>
                            <img src={entityLogo || logo} alt="Hospital Logo" className={`${style.logo}`} />
                        </div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}  ${style.justifyCenter}`}>{formSchemaWholeObject?.title}</div>
                        <CommonDivider />
                        {formSchemaWholeObject?.content?.title !== null && (
                            <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchemaWholeObject?.content?.title}</div>
                        )}
                        <div
                            className={`${style.leftAlign} ${style.marginTop} ${style.descriptionStyle}`}
                            dangerouslySetInnerHTML={{ __html: formContent?.content?.content }}
                        />
                        {formSchemaWholeObject?.disclaimer?.title !== null && (
                            <div className={style.cardTitle}>{formSchemaWholeObject?.disclaimer?.title}</div>
                        )}
                        {formContent?.disclaimer !== null && formContent?.disclaimer?.content !== null && (
                            <div className={`${style.checkGrid} ${style.marginTop}`}>
                                <CommonCheckBox checked={isChecked && checkedDisclaimer === 'disclaimer'} onChange={(e) => { handleIsChecked(e.target.checked, 'disclaimer') }} bigCheckbox={true} />
                                <div
                                    className={`${style.leftAlign} ${style.marginTop10} ${style.descriptionStyle}`}
                                    dangerouslySetInnerHTML={{ __html: formContent?.disclaimer?.content }}
                                />
                            </div>
                        )}

                        <div className={`${style.descriptionStyle} ${style.justifyCenter} ${style.marginTop}`}>OR</div>

                        {formSchemaWholeObject?.disclaimer1 !== null && formSchemaWholeObject?.disclaimer1?.content !== null && (
                            <div className={`${style.checkGrid} ${style.marginTop}`}>
                                <CommonCheckBox checked={isChecked && checkedDisclaimer === 'disclaimer1'} onChange={(e) => { handleIsChecked(e.target.checked, 'disclaimer1') }} bigCheckbox={true} />
                                <div
                                    className={`${style.leftAlign} ${style.marginTop10} ${style.descriptionStyle}`}
                                    dangerouslySetInnerHTML={{ __html: formSchemaWholeObject?.disclaimer1?.content }}
                                />
                            </div>
                        )}
                        {(isChecked && checkedDisclaimer === 'disclaimer1') && (
                            <>
                                {formSchema !== undefined && 'offenceDeclaration' in formSchema?.properties && (
                                    <ApplicationFieldCard object={formSchema?.properties?.offenceDeclaration} gridStyle={style.twoCol} baseKey={'offenceDeclaration'} basicForm={basicForm} setBasicForm={setBasicForm} getAllPath={getAllPath} getAllLabels={getAllLabels} addMoreType={true} formId={basicForm?.forms?.[formIndex]?.id} getIsSubmitClicked={getIsSubmitClicked} applicationId={applicationId} tableGrid={style.tableGrid} warningFields={warningFields} getMissingFields={getMissingFields} showValidationDialog={showValidationDialog} setShowValidationDialog={setShowValidationDialog} isAddMore={isAddMore} setIsAddMore={setIsAddMore} formSchema={formSchemaWholeObject} />
                                )}
                            </>
                        )}
                        {/* <div className={style.justifyCenter}>
                            <table cellPadding="10" >
                                <thead>
                                    <tr>
                                        <th>Date Of Conviction</th>
                                        <th>Nature Of Offence</th>
                                        <th>Penalty Imposed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData?.map((row) => (
                                        <tr key={row.id}>
                                            <td>
                                                <TextField
                                                    variant="outlined"
                                                    value={row.dateOfConviction}
                                                    onChange={(e) => { handleInputChange(e, row.id, "dateOfConviction"); setIsEdited(true) }}
                                                />
                                            </td>
                                            <td>
                                                <TextField
                                                    variant="outlined"
                                                    value={row.natureOfOffence}
                                                    onChange={(e) => { handleInputChange(e, row.id, "natureOfOffence"); setIsEdited(true) }}
                                                />
                                            </td>
                                            <td>
                                                <TextField
                                                    variant="outlined"
                                                    value={row.panaltyImposed}
                                                    onChange={(e) => { handleInputChange(e, row.id, "panaltyImposed"); setIsEdited(true) }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
                        {formSchemaWholeObject?.esignatureRequired && (
                            <div className={style.twoCol}>
                                <div onClick={isChecked ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }} className={!isChecked ? style.disabled : ''}>
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
                                        <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[formIndex]?.esign?.signedDate !== '' && basicForm?.forms?.[formIndex]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[formIndex]?.esign?.signedDate : currentDate : ""}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={style.stickyContainer}>
                        <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => getIsSaveInProgressOpen(true)}>SAVE IN PROGRESS</div>
                        <div className={style.twoColForButton}>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={handleBackClick}>BACK</div>
                            <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()} >CONTINUE</div>
                        </div>
                    </div>
                </div>
            </div>
            {isSaveInProgressOpen && (
                <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
            )}
        </div>
    )
}

export default OffenceDeclaration;