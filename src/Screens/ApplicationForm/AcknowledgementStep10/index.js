// import React, { useEffect, useState } from 'react';
// import ProgressCard from '../../../Components/ProgressCard';
// import ApplicationUserCard from '../../../Components/ApplicationUserCard';
// import ApplicationAssistanceCard from '../../../Components/ApplicationAssistanceCard';
// import CommonDivider from '../../../Components/CommonFields/CommonDivider';
// import logo from "../../../images/cambridgeHospital.png";
// import { GET, PUT } from '../../dataSaver';
// import { ErrorToaster, SuccessToaster } from '../../../utils/toaster';

// import { useNavigate } from 'react-router-dom';
// import WarningAmberIcon from '@mui/icons-material/WarningAmber';
// import style from './index.module.scss';
// import CommonCheckBox from '../../../Components/CommonFields/CommonCheckBox';
// import ApplicationFieldCard from '../../../Components/ApplicationFieldCard';
// import CommonTextField from '../../../Components/CommonFields/CommonTextField';
// import CommonPhoneField from '../../../Components/CommonFields/CommonPhoneField';
// import { FormatPhoneNumber } from '../../../utils/formatting';

// const ApplicationAcknowledgementStep10 = ({ basicForm, setBasicForm, applicationId }) => {
//     const [isChecked, setIsChecked] = useState(false);
//     const navigate = useNavigate()
//     const [isEdited, setIsEdited] = useState(false);
//     const [formSchema, setFormSchema] = useState();
//     const [applicantProfile, setApplicantProfile] = useState();
//     const TEXTFIELDLEN50 = 50;
//     useEffect(() => {
//         if (basicForm && !formSchema) {
//             getFormSchema()
//         }
//     }, [basicForm])

//     useEffect(() => {
//         getApplicantProfile()
//     }, [applicationId])

//     const getIsEdited = (value) => {
//         setIsEdited(value)
//     }

//     const getFormSchema = async () => {
//         const { data: form } = await GET(
//             `application-management-service/formSchema/${basicForm?.formSchemas?.[13]?.id}`
//         );
//         setFormSchema(form?.schema)
//     }

//     const handleChange = () => {

//     }

//     const getApplicantProfile = async () => {
//         const { data: profile } = await GET(
//             `application-management-service/application/${applicationId}/profile`
//         );
//         setApplicantProfile(profile)
//     }

//     const handleSubmitApplicationReq = async () => {
//         if (isEdited) {
//             let temp = {
//                 schemaId: basicForm?.forms?.[13]?.schemaId,
//                 data: basicForm?.forms?.[13]?.data
//             }
//             await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[13]?.id}`, temp)
//                 .then(response => {
//                     console.log(response)
//                     setBasicForm(response?.data)
//                     SuccessToaster("Application Updated Successfully");
//                     const handleContinue = () => {
//                         if (sessionStorage.getItem('fromSummary') === 'true') {
//                             navigate(-1);
//                         } else {
//                             navigate('/applicationForm/section1/acknowledgementStep11')
//                         }
//                     }
//                 })
//                 .catch((error) => {
//                     console.log(error)
//                     ErrorToaster("Unexpected Error Updating Application");
//                 });
//         } else {
//             const handleContinue = () => {
//                 if (sessionStorage.getItem('fromSummary') === 'true') {
//                     navigate(-1);
//                 } else {
//                     navigate('/applicationForm/section1/acknowledgementStep11')
//                 }
//             }
//         }
//     }
//     return (
//         <div>
//             <div className={style.applicationScreenGrid}>
//                 <ProgressCard step={'STEP 10'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={40} timeText={'Min'} progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`} />
//                 <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
//             </div>
//             <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
//                 <div>
//                     <div className={style.applicationCardStyle}>
//                         <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
//                         <CommonDivider />
//                         {/* {formSchema !== undefined && 'pharmacySignatureTemplate' in formSchema?.properties && (
//                             <ApplicationFieldCard object={formSchema?.properties?.pharmacySignatureTemplate?.properties?.pharmacySignatureTemplate} gridStyle={style.pharmacySignatureAddressGrid} baseKey={'pharmacySignatureTemplate'} basicForm={basicForm} setBasicForm={setBasicForm} stepPath={`forms[13].data`} setIsEdited={getIsEdited} />
//                         )} */}
//                         <div className={`${style.cardTitle} ${style.marginTop}`}>{'Pharmacy Signature Template'}</div>
//                         <div className={`${style.pharmacySignatureAddressGrid2} ${style.marginTop}`}>
//                             <CommonTextField
//                                 value={`${applicantProfile?.name?.lastName}, ${applicantProfile?.name.firstName}`}
//                                 className={style.fullWidth}
//                                 onChange={(e) => { }}
//                                 maxLength={TEXTFIELDLEN50}
//                                 placeholder={''}
//                                 label={'Surname'}
//                                 required={true}
//                                 type={'text'}
//                             />
//                             <CommonTextField
//                                 value={''}
//                                 className={style.fullWidth}
//                                 onChange={(e) => handleChange('initials', e.target.value)}
//                                 maxLength={TEXTFIELDLEN50}
//                                 placeholder={''}
//                                 label={'Initials'}
//                                 required={true}
//                                 type={'text'}
//                             />
//                             <CommonTextField
//                                 value={applicantProfile?.contactAddress3?.business?.businessAddress?.streetName}
//                                 className={style.fullWidth}
//                                 onChange={(e) => { }}
//                                 maxLength={TEXTFIELDLEN50}
//                                 placeholder={''}
//                                 label={'Office Address'}
//                                 required={true}
//                                 type={'text'}
//                             />
//                             <CommonTextField
//                                 value={applicantProfile?.contactAddress3?.business?.businessAddress?.city}
//                                 className={style.fullWidth}
//                                 onChange={(e) => { }}
//                                 maxLength={TEXTFIELDLEN50}
//                                 placeholder={'Enter City'}
//                                 label={''}
//                                 required={false}
//                                 type={'text'}
//                             />
//                             <CommonTextField
//                                 value={applicantProfile?.contactAddress3?.business?.businessAddress?.province}
//                                 className={style.fullWidth}
//                                 onChange={(e) => { }}
//                                 maxLength={TEXTFIELDLEN50}
//                                 placeholder={'Enter Province'}
//                                 label={''}
//                                 required={false}
//                                 type={'text'}
//                             />
//                             <CommonTextField
//                                 value={applicantProfile?.contactAddress3?.business?.businessAddress?.pinCode}
//                                 className={style.fullWidth}
//                                 onChange={(e) => { }}
//                                 maxLength={TEXTFIELDLEN50}
//                                 placeholder={'Enter Zipcode'}
//                                 label={''}
//                                 required={false}
//                                 type={'text'}
//                             />
//                             <CommonPhoneField
//                                 value={applicantProfile?.mobileNumber}
//                                 className={style.fullWidth}
//                                 onChange={(e) => handleChange('cellphone', FormatPhoneNumber(e.target.value))}
//                                 placeholder={''}
//                                 label={'Cell Phone'}
//                                 required={false}
//                             />
//                             <CommonTextField
//                                 value={''}
//                                 className={style.fullWidth}
//                                 onChange={(e) => handleChange('signature', e.target.value)}
//                                 maxLength={TEXTFIELDLEN50}
//                                 placeholder={'Enter Signature'}
//                                 label={''}
//                                 required={false}
//                                 type={'text'}
//                             />
//                         </div>
//                         <div className={style.displayInRowRev}>
//                             <div className={`${style.continue} ${style.marginTop10} ${style.createButtonStyle}`} >CREATE</div>
//                         </div>
//                     </div>
//                 </div>
//                 <div>
//                     <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
//                     <div className={`${style.saveInProgress} ${style.marginTop}`}>SAVE IN PROGRESS</div>
//                     <div className={style.twoColForButton}>
//                         <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
//                         <div className={`${style.continue} ${style.marginTop10}`} onClick={() => { handleSubmitApplicationReq() }} >CONTINUE</div>
//                     </div>
//                     {/* <div className={style.marginTop}>
//                         <ApplicationReferenceDocuments />
//                     </div> */}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ApplicationAcknowledgementStep10;


import React, { useEffect, useState,useRef } from "react";
import ProgressCard from "../../../Components/ProgressCard";
import ApplicationUserCard from "../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../Components/ApplicationAssistanceCard";
import logo from "../../../images/cambridgeHospital.png";
import CommonDivider from "../../../Components/CommonFields/CommonDivider";
import { GET, PUT,POST } from "../../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../../utils/toaster";
import { useNavigate,useParams } from "react-router-dom";
import style from "./index.module.scss";
import { PDFDocument } from "pdf-lib";
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';

const ApplicationAcknowledgementStep9 = ({
  basicForm,
  getPreApplication,
  applicationId,
  dateFormat,
  name
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);
  const navigate = useNavigate();
  const { section, step } = useParams()
  const targetRef = useRef();
  const [currentDate, setCurrentDate] = useState();
    const [formSchema, setFormSchema] = useState();
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [formContent, setFormContent] = useState();
    const [navigateURL, setNavigateURL] = useState();
    const [formIndex, setFormIndex] = useState();
    const [initialArray, setInitialArray] = useState([])
    const [encryptedText, setEncryptedText] = useState("");
    const [signText, setSignText] = useState("")
    const [isSigned, setIsSigned] = useState(false);
    console.log(initialArray)
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const fixedPdfUrl =
    "https://development-application-mgmt-service.s3.us-east-1.amazonaws.com/PACS_Req_Fillable.pdf";

 const proxyUrl = "https://app.timesmartai.com/cors/"

 useEffect(() => {
    if (dateFormat) {
        setCurrentDate(format(new Date(), dateFormat))
    }
}, [dateFormat]);

useEffect(() => {
    if (name && currentDate) {
      const dateTime = new Date().toISOString();
      setEncryptedText(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());
      setSignText(`${name} ${currentDate}`);
    }
  }, [name, currentDate]);

useEffect(() => {
    if (basicForm && !formSchema) {
        getFormSchema()
    }
    setInitialArray(basicForm?.forms?.[formIndex]?.data ? basicForm?.forms?.[formIndex]?.data?.initials : []);
    setSignText(basicForm?.forms?.[formIndex]?.acknowledged ? basicForm?.forms?.[formIndex]?.esign?.esign : '');
    setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
    if (basicForm !== undefined && formIndex !== undefined) {
        setNavigateURL((basicForm?.forms?.length === (formIndex + 1)) ? `/applicationForm/${applicationId}/Acknowledgement/AcknowledgementCheck` : `/applicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${basicForm?.forms[formIndex + 1]?.schemaCategory}`)
    }
}, [basicForm, formIndex]);

useEffect(() => {
    setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
}, [basicForm, step]);

useEffect(() => {
    if (basicForm?.forms?.[formIndex]?.id !== undefined) {
        getRenderedContent();
    }
}, [basicForm?.forms?.[formIndex]?.id]);


const getRenderedContent = async () => {
    const { data: content } = await GET(
        `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}/render`
    );
    setFormContent(content);
};
  useEffect(() => {
    getApplicantProfile();
  }, [applicationId]);

  const getFormSchema = async () => {
            const { data: form } = await GET(
                `application-management-service/formSchema/${basicForm?.formSchemas?.[formIndex]?.id}`
            );
            setFormSchema(form)
        }

  const getApplicantProfile = async () => {
    try {
      const { data: profile } = await GET(
        `application-management-service/application/${applicationId}/profile`
      );
      setApplicantProfile(profile);
      populatePdfWithProfileData(profile);
    } catch (error) {
      console.error("Error fetching applicant profile:", error);
    }
  };

  const populatePdfWithProfileData = async (profileData) => {
    try {
      const existingPdfBytes = await fetch(`${proxyUrl}${fixedPdfUrl}`).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const pages = pdfDoc.getPages();

      // Extract and log fields for debugging
      const fields = form.getFields();
      fields.forEach((field) => {
        console.log(`Field Name: ${field.getName()}`);
      });

      const formatNameWithSpacing = (name) =>
        name?.split("").join(" ") || ""; // Single space between letters
      const formattedFullName = `${formatNameWithSpacing(profileData?.name?.lastName || "")}  ${formatNameWithSpacing(profileData?.name?.firstName || "")}`;
      // Fill text fields with profile data
      form.getTextField("Text35").setText(formattedFullName);
      form.getTextField("Text73").setText(profileData.department || "");
      form.getTextField("Text107").setText(profileData.jobTitle || "");
      form.getTextField("Text108").setText(profileData.managerName || "");
      form.getTextField("Text109").setText(profileData.email?.officialEmail || "")
      form.getTextField("Text110").setText(profileData.extension || "");

      
      // Fill checkboxes
      form.getCheckBox("Check Box131").check(profileData.option1 || false);
      form.getCheckBox("Check Box132").check(profileData.option2 || false);
      form.getCheckBox("Check Box133").check(profileData.option3 || false);
      form.getCheckBox("Check Box134").check(profileData.option4 || false);
      form.getCheckBox("Check Box135").check(profileData.option5 || false);
      form.getCheckBox("Check Box136").check(profileData.option6 || false);
      form.getCheckBox("Check Box137").check(profileData.option7 || false);
      form.getCheckBox("Check Box138").check(profileData.option8 || false);
      form.getCheckBox("Check Box139").check(profileData.option9 || false);

      // Fill additional fields
      form.getTextField("Text140").setText(profileData.other || "");
      const formattedDate = format(new Date(), 'dd/MM/yyyy');
    form.getTextField("Text144").setText(formattedDate || "");
    form.getTextField("Text150").setText(formattedDate || "");

   

    // Signature field on the first page
    const esignText = basicForm?.forms?.[formIndex]?.esign?.esign || "";

    // Signature field on the first page
    const signatureField1 = form.getField("Signature141");
    if (esignText) {
      const { x: x1, y: y1, width: width1, height: height1 } =
        signatureField1.getWidgets()[0].getRectangle();

      // Draw the text (esign)
      pages[0].drawText(esignText, {
        x: x1,
        y: y1 - 15, // Adjust positioning slightly below the field rectangle
        size: 12,
      });
    } else {

    }

    // Signature field on the second page
    const signatureField2 = form.getField("Signature151");
    if (esignText) {
      const { x: x2, y: y2, width: width2, height: height2 } =
        signatureField2.getWidgets()[0].getRectangle();

      // Draw the text (esign)
      pages[1].drawText(esignText, {
        x: x2,
        y: y2 - 15, // Adjust positioning slightly below the field rectangle
        size: 12,
      });
    } else {

    }

      // Save and display updated PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      await addNewDocument(blob);
    } catch (error) {
      console.error("Error populating PDF:", error);
      ErrorToaster("Failed to populate PDF");
    }
  };

  const addNewDocument = async (file) => {
    let fileName = { fileName: 'AcknowledgementStep9.pdf' };
    const formData = new FormData();
    if (file !== null) {
        const blob = new Blob([file], { type: `application/pdf` });
        formData.append('files', new Blob([JSON.stringify(fileName)], { type: "application/json" }));
        formData.append('documents', blob, fileName.fileName);

        let uploadedFile = {};
        try {
            const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
            uploadedFile = response?.data;
            console.log(response?.data)
            setPdfUrl(uploadedFile.fileURL)
        } catch (error) {
            console.error(error);
            return null;
        }

        try {
            const response = await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}/addFileToForm`, uploadedFile);
            return response?.data;
            console.log(response?.data)
        } catch (error) {
            console.error(error);
            return null;
        }
    }
};
  

  

const handleSubmitApplicationReq = async () => {
    if (isSigned) {
        let temp = {
            schemaId: basicForm?.forms?.[formIndex]?.schemaId,
            data: { initials: initialArray },
            acknowledged: isSigned,
            esign: { esign: isSigned ? encryptedText : '', name: isSigned ? name : '', signedDate: isSigned ? currentDate : '' }
        }
        await PUT(`application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[formIndex]?.id}`, temp)
            .then(response => {
                console.log(response)
                getPreApplication()
                SuccessToaster("Application Updated Successfully");
                if (sessionStorage.getItem('fromSummary') === 'true') {
                    navigate(-1);
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
        } else {
            navigate(navigateURL)
        }
    }
}

  const renderPdfContent = () => {
    return (
      <div>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="1600px"  
            title="PDF Viewer"
            style={{ border: 'none', overflow: 'hidden' }}
          />
        ) : (
          <p>Loading PDF...</p>
        )}
      </div>
    );
  };

  return (
    <div>
            <div className={style.applicationScreenGrid}>
                <ProgressCard step={'STEP 9'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={30} timeText={'Min'} />
                <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
            </div>
            <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
                <div>
                    <div className={style.applicationCardStyle} ref={targetRef} style={
                        {height:"2000px"}
                    }>
                        <div className={`${style.marginTop} ${style.justifyCenter}`}>
                            <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
                        </div>
                        <CommonDivider />
                        <div className={`${style.cardTitle} ${style.marginTop}  ${style.justifyCenter}`}>{formSchema?.title}</div>
                        <CommonDivider />
                        <div className={`${style.labelText} ${style.marginTop}`}>My making of this application and signature below indicate my understanding of and consent to the following (please note that references to Public Hospitals Act are not applicable to Homewood):</div>
                        <CommonDivider />
                        {renderPdfContent()}
                        
                    </div>
                </div>
                <div>
                    <ApplicationAssistanceCard user={'Neena Greenly'} designation={'{Designation}'} contactNumber={'{Contact Number}'} email={'{Email}'} />
                    <div className={`${style.saveInProgress} ${style.marginTop}`} >SAVE IN PROGRESS</div>
                    <div className={style.twoColForButton}>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => navigate(-1)}>BACK</div>
                        <div className={`${style.continue} ${style.marginTop10}`} onClick={() => handleSubmitApplicationReq()} >CONTINUE</div>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default ApplicationAcknowledgementStep9;