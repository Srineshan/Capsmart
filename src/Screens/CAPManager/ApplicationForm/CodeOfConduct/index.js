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
import { PDFDocument } from "pdf-lib";
import CommonCheckBox from '../../../../Components/CommonFields/CommonCheckBox';
import ESign from '../../../../Components/ESign';
import { format } from 'date-fns';
import { SuccessToaster, ErrorToaster } from '../../../../utils/toaster';
import ESignature from '../../../../Components/ESignature';
import pdf from "../../../../images/CodeofConduct.png";
import pdf2 from "../../../../images/CodeofConduct2.png";
import pdf3 from "../../../../images/CodeofConduct3.png";
import pdf4 from "../../../../images/CodeofConduct4.png";
import pdf5 from "../../../../images/CodeofConduct5.png";
import pdf6 from "../../../../images/CodeofConduct6.png";
import pdf7 from "../../../../images/CodeofConduct7.png";
import PdfViewer from '../pdfViewer';
import SaveInProgressDialog from '../../../../Components/SaveInProgressDialog';


const CodeOfConduct = ({ acknowledgementForm, dateFormat, name, basicForm, getPreApplication, applicationId }) => {
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
    const [navigateURL, setNavigateURL] = useState();
    const [navigateBackURL, setNavigateBackURL] = useState();
    const { section, step } = useParams()
    const [formIndex, setFormIndex] = useState();
    const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
    const [signText, setSignText] = useState(name + " " + currentDate);
    const [initialArray, setInitialArray] = useState([])
    const proxyUrl = "https://app.timesmartai.com/cors/"

    console.log(initialArray)

    useEffect(() => {
        if (dateFormat) {
            setCurrentDate(format(new Date(), dateFormat))
        }
    }, [dateFormat])

    useEffect(() => {
        if (basicForm && !formSchema) {
            getFormSchema()
        }
        setIsChecked(basicForm?.forms?.[formIndex]?.acknowledged);
        // setEncryptedText(basicForm?.forms?.[formIndex]?.esign?.esign)
        setInitialArray(basicForm?.forms?.[formIndex]?.data ? basicForm?.forms?.[formIndex]?.data?.initials : []);
        setSignText(basicForm?.forms?.[formIndex]?.acknowledged ? basicForm?.forms?.[formIndex]?.esign?.esign : '');
        setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
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

    useEffect(() => {
        if (formSchema && !basicForm?.forms?.[formIndex]?.completedFormAsFile?.fileURL) {
            populatePdfWithProfileData()
        }
    }, [formSchema])

    const getFormSchema = async () => {
        const { data: form } = await GET(
            `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
        );
        setFormSchema(form)
    }

    const getRenderedContent = async () => {
        const { data: content } = await GET(
            `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}/render`
        );
        setFormContent(content)
    }

    const getIsSaveInProgressOpen = (value) => {
        setIsSaveInProgressOpen(value);
    };

    const populatePdfWithProfileData = async () => {
        console.log('Field Name')
        try {
            console.log('Field Name')
            const existingPdfBytes = await fetch(`${proxyUrl}${formSchema?.file?.fileURL}`).then((res) =>
                res.arrayBuffer()
            );

            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            const form = pdfDoc.getForm();

            const image = `${proxyUrl}${basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc")]?.data?.setUpYourSignature?.file?.fileURL}`;
            let imageBytes
            if (image)
                imageBytes = await fetch(image).then(res => res.arrayBuffer());

            const isPng = image.toLowerCase().endsWith(".png");
            const signatureImg = isPng
                ? await pdfDoc.embedPng(imageBytes)
                : await pdfDoc.embedJpg(imageBytes);


            const fields = form.getFields();
            fields.forEach((field) => {
                console.log(`Field Name: ${field.getName()}`);
            });

            const sigField = form.getButton("Signature");

            sigField.setImage(signatureImg);

            const formatNameWithSpacing = (name) =>
                name?.split("").join(" ") || "";
            const formattedFullName = `${formatNameWithSpacing(basicForm?.applicant?.name?.lastName || "")}  ${formatNameWithSpacing(basicForm?.applicant?.name?.firstName || "")}`;

            form.getTextField("Print Name").setText(formattedFullName);

            const formattedDate = format(new Date(), 'MMM dd, yyyy');
            form.getTextField("Date").setText(formattedDate || "");


            form.getFields().forEach(field => {
                if (field.constructor.name === 'PDFCheckBox') {
                    field.updateAppearances();  // fixes display
                }
            });
            form.flatten();
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            console.log('indexCheck')
            await addNewDocumentWithFilledValues(blob);
        } catch (error) {
            console.log('indexCheck')
            console.error("Error populating PDF:", error);
            ErrorToaster("Failed to populate PDF");
        }
    };

    const addNewDocumentWithFilledValues = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": 'codeOfConductFilled.pdf'
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
                    })
                    .catch((error) => {
                        console.log(error)
                        ErrorToaster("Unexpected Error Updating Application");
                    });
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }

    const addNewDocument = async (file) => {
        console.log(file, file?.name, 'Test')
        let fileName = {
            "fileName": 'codeOfConduct.pdf'
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

    const handleSubmitApplicationReq = async () => {
        if (isSigned) {
            let temp = {
                schemaId: basicForm?.forms?.[formIndex]?.schemaId,
                data: { initials: initialArray },
                acknowledged: isSigned,
                esign: { esign: isSigned ? encryptedText : '', name: isSigned ? name : '', signedDate: isSigned ? currentDate : '' },
                dataStatus: isSigned ? 'COMPLETED' : 'SKIPPED_MANDATORY_FIELD'
            }
            await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
                .then(response => {
                    console.log(response)
                    getPreApplication()
                    SuccessToaster("Application Updated Successfully");
                    handleDownload();
                    if (sessionStorage.getItem('fromSummary') === 'true') {
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
        else {
            if (sessionStorage.getItem('fromSummary') === 'true') {
                navigate(-1);
                sessionStorage.setItem('fromSummary', false)
            } else {
                navigate(navigateURL)
            }
        }
    }

    const handleBackClick = () => {
        navigate(navigateBackURL)
    }

    return (
        <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 4'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={34} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} applicationId={applicationId} basicForm={basicForm} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle} ref={targetRef}>
                        <div className={`${style.marginTop} ${style.justifyCenter}`}>
                            <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                        </div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}  ${style.justifyCenter}`}>{formSchema?.title}</div>
                        <CommonDivider />
                        {/* <img src={pdf} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf2} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf3} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf4} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf5} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf6} alt="" className={style.pdfStyle} />
                        <ESign />
                        <img src={pdf7} alt="" className={style.pdfStyle} />
                        <ESign /> */}
                        <PdfViewer pdfurl={basicForm?.forms?.[formIndex]?.completedFormAsFile?.fileURL || formSchema?.file?.fileURL} name={name} currentDate={currentDate} initialArray={initialArray} setInitialArray={setInitialArray} isSigned={isSigned} setIsSigned={setIsSigned} formData={basicForm} />
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
            {/* <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={`${style.applicationCardStyle} ${style.applicationCardScrollStyle}`} ref={targetRef}>
                        <div className={`${style.marginTop} ${style.justifyCenter}`}>
                            <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                        </div>
                        <CommonDivider />
                        <div
                            className={`${style.leftAlign} ${style.marginTop} ${style.descriptionStyle}`}
                            dangerouslySetInnerHTML={{ __html: formContent?.content?.content }}
                        />
                        <div className={`${style.checkGrid} ${style.marginTop}`}>
                            {formContent?.disclaimer?.content !== null && (
                                <CommonCheckBox checked={isChecked} onChange={(e) => handleIsChecked(e.target.checked)} />
                            )}
                            <div
                                className={`${style.leftAlign} ${style.marginTop10}`}
                                dangerouslySetInnerHTML={{ __html: formContent?.disclaimer?.content }}
                            />
                        </div>
                        {acknowledgementForm?.esignatureRequiredOnEachPage && (
                            <div className={style.twoCol}>
                                <div onClick={isChecked ? () => { setIsSigned(!isSigned); setIsEdited(true) } : () => { }} className={!isChecked ? style.disabled : ''}>
                                    <ESignature
                                        userName={isSigned ? name : ""}
                                        encData={isSigned ? encryptedText : ''}
                                        showData={true}
                                        showDatais={true}
                                    />
                                </div>
                                <div className={style.verticalAlignCenter}>
                                    <div className={style.displayInRow}>
                                        <div className={style.dateTitle}>Date: </div>
                                        <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? currentDate : ""}</div>
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
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={handleBackClick}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()} >CONTINUE</div>
                    </div>
                </div>
            </div> */}
            {isSaveInProgressOpen && (
                <SaveInProgressDialog getIsOpen={getIsSaveInProgressOpen} />
            )}
        </div>
    )
}

export default CodeOfConduct;