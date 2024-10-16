import React, { useEffect, useState, useRef } from 'react';
import ProgressCard from '../../../Components/ProgressCard';
import ApplicationUserCard from '../../../Components/ApplicationUserCard';
import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
import CommonDivider from '../../../Components/CommonFields/CommonDivider';
import logo from "../../../images/cambridgeHospital.png";
import { GET, PUT, POST } from '../../dataSaver';
import { useNavigate } from 'react-router-dom';
import html2pdf from "html2pdf.js";
import CryptoJS from 'crypto-js';
import style from './index.module.scss';
import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../Components/ESign';
import { format } from 'date-fns';
import { TextField } from "@mui/material";
import { SuccessToaster, ErrorToaster } from '../../../utils/toaster';
import ESignature from '../../../Components/ESignature';

const OffenceDeclaration = ({ acknowledgementForm, dateFormat, name, basicForm, getPreApplication, applicationId }) => {
    const [isChecked, setIsChecked] = useState(false);
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
    useEffect(() => {
        if (dateFormat) {
            setCurrentDate(format(new Date(), dateFormat))
        }
    }, [dateFormat])

    console.log(tableData)

    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        setIsChecked(basicForm?.forms?.[18]?.acknowledged);
        // setEncryptedText(basicForm?.forms?.[18]?.esign?.esign)
        setSignText(basicForm?.forms?.[18]?.acknowledged ? basicForm?.forms?.[18]?.esign?.esign : '');
        setIsSigned((basicForm?.forms?.[18]?.esign?.esign !== undefined && basicForm?.forms?.[18]?.acknowledged) ? true : false);
        setTableData(basicForm?.forms?.[18]?.data !== null ? basicForm?.forms?.[18]?.data?.tableData : initialData)
        setCheckedDisclaimer(basicForm?.forms?.[18]?.data !== null ? basicForm?.forms?.[18]?.data?.checkedDisclaimer : checkedDisclaimer)
        // setDecryptedText(CryptoJS.AES.decrypt(basicForm?.forms?.[18]?.esign?.esign, publicKey).toString(CryptoJS.enc.Utf8))
    }, [basicForm])

    useEffect(() => {
        if (basicForm?.forms?.[18]?.id !== undefined) {
            getRenderedContent()
        }
    }, [basicForm?.forms?.[18]?.id])

    const getFormSchema = async () => {
        if (basicForm?.formSchemas?.[18]?.id !== undefined) {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[18]?.id}`
            );
            setFormSchema(form)
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
            `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[18]?.id}/render`
        );
        setFormContent(content)
    }

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
                uploadedFile = response?.data;
            } catch (error) {
                console.error(error);
                return null;
            }

            try {
                const response = await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[18]?.id}/addFileToForm`, uploadedFile);
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

    const handleIsChecked = (value) => {
        setIsEdited(true)
        setIsChecked(value)
        if (!value) {
            setIsSigned(false)
        }
    }

    const handleSubmitApplicationReq = async () => {
        if (isSigned) {
            let temp = {
                schemaId: basicForm?.forms?.[18]?.schemaId,
                data: !isEdited ? basicForm?.forms?.[18]?.data : { esignDate: isChecked ? name + " " + currentDate : '', checkedDisclaimer: checkedDisclaimer, tableData: tableData },
                acknowledged: isChecked,
                esign: { esign: isChecked ? encryptedText : '', name: isChecked ? name : '', signedDate: isChecked ? currentDate : '' }
            }
            await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[18]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    getPreApplication()
                    SuccessToaster("Application Updated Successfully");
                    handleDownload();
                    getFormSchema();
                    if (sessionStorage.getItem('fromSummary') === 'true') {
                        navigate(-1);
                    }
                    else {
                        navigate('/applicationForm/section1/acknowledgementStep12')
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
            } else {
                navigate('/applicationForm/section1/acknowledgementStep12')
            }
        }
    }
    const handleContinue = () => {
        if (sessionStorage.getItem('fromSummary') === 'true') {
            navigate(-1);
        } else {
            navigate('/applicationForm/section1/section1/acknowledgementStep12')
        }
    }

    console.log(formContent)

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 8'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={38} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={`${style.applicationCardStyle} ${style.applicationCardScrollStyle}`} ref={targetRef}>
                        <div className={`${style.marginTop} ${style.justifyCenter}`}>
                            <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                        </div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}  ${style.justifyCenter}`}>{formSchema?.title}</div>
                        <CommonDivider />
                        {formSchema?.content?.title !== null && (
                            <div className={`${style.cardTitle} ${style.marginTop}`}>{formSchema?.content?.title}</div>
                        )}
                        <div
                            className={`${style.leftAlign} ${style.marginTop} ${style.descriptionStyle}`}
                            dangerouslySetInnerHTML={{ __html: formContent?.content?.content }}
                        />
                        {formSchema?.disclaimer?.title !== null && (
                            <div className={style.cardTitle}>{formSchema?.disclaimer?.title}</div>
                        )}
                        {formContent?.disclaimer !== null && formContent?.disclaimer?.content !== null && (
                            <div className={`${style.checkGrid} ${style.marginTop}`}>
                                <CommonCheckBox checked={isChecked && checkedDisclaimer === 'disclaimer'} onChange={(e) => { handleIsChecked(e.target.checked); setCheckedDisclaimer('disclaimer') }} bigCheckbox={true} />
                                <div
                                    className={`${style.leftAlign} ${style.marginTop10} ${style.descriptionStyle}`}
                                    dangerouslySetInnerHTML={{ __html: formContent?.disclaimer?.content }}
                                />
                            </div>
                        )}

                        <div className={`${style.descriptionStyle} ${style.justifyCenter} ${style.marginTop}`}>OR</div>

                        {formSchema?.disclaimer1 !== null && formSchema?.disclaimer1?.content !== null && (
                            <div className={`${style.checkGrid} ${style.marginTop}`}>
                                <CommonCheckBox checked={isChecked && checkedDisclaimer === 'disclaimer1'} onChange={(e) => { handleIsChecked(e.target.checked); setCheckedDisclaimer('disclaimer1') }} bigCheckbox={true} />
                                <div
                                    className={`${style.leftAlign} ${style.marginTop10} ${style.descriptionStyle}`}
                                    dangerouslySetInnerHTML={{ __html: formSchema?.disclaimer1?.content }}
                                />
                            </div>
                        )}
                        <div className={style.justifyCenter}>
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
                        </div>
                        {formSchema?.esignatureRequired && (
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
                                        <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? (basicForm?.forms?.[18]?.esign?.signedDate !== '' && basicForm?.forms?.[18]?.esign?.signedDate !== undefined) ? basicForm?.forms?.[18]?.esign?.signedDate : currentDate : ""}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`} onClick={() => handleDownload()}>SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()} >CONTINUE</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OffenceDeclaration;