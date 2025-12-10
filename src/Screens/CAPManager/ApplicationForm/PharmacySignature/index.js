import React, { useEffect, useState, useRef } from "react";
import ProgressCard from "../../../../Components/ProgressCard";
import ApplicationUserCard from "../../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../../Components/ApplicationAssistanceCard";
import logo from "../../../../images/cambridgeHospital.png";
import pdf from "../../../../images/Pharmacy Signature Template.pdf"
import CommonDivider from "../../../../Components/CommonFields/CommonDivider";
import { GET, PUT, POST } from "../../../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../../../utils/toaster";
import { useNavigate, useParams } from "react-router-dom";
import style from "./index.module.scss";
import { PDFDocument } from "pdf-lib";
import CryptoJS from 'crypto-js';
import SaveInProgressDialog from "../../../../Components/SaveInProgressDialog";
import { format } from 'date-fns';

const PharmacySignature = ({
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
  const [navigateBackURL, setNavigateBackURL] = useState();
  const [formIndex, setFormIndex] = useState();
  const [initialArray, setInitialArray] = useState([])
  const [encryptedText, setEncryptedText] = useState("");
  const [signText, setSignText] = useState("")
  const [isSigned, setIsSigned] = useState(false);
  const [isShowESignDialog, setIsShowESignDialog] = useState(false);
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  console.log(initialArray)
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  // const fixedPdfUrl = formSchema?.file?.fileURL;
  const fixedPdfUrl = "https://capm-prod-application-mgmt-service.s3.ca-central-1.amazonaws.com/64246d491b70b07241d37aa1/Pharmacy+Signature+Template.pdf"
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
    if (basicForm && !formSchema && formIndex) {
      getFormSchema()
    }
    setInitialArray(basicForm?.forms?.[formIndex]?.data ? basicForm?.forms?.[formIndex]?.data?.initials : []);
    setSignText(basicForm?.forms?.[formIndex]?.acknowledged ? basicForm?.forms?.[formIndex]?.esign?.esign : '');
    setIsSigned((basicForm?.forms?.[formIndex]?.esign?.esign !== undefined && basicForm?.forms?.[formIndex]?.acknowledged) ? true : false);
    if (basicForm !== undefined && formIndex !== undefined) {
      setNavigateURL((basicForm?.forms?.length === (formIndex + 1)) ? `/applicationForm/${applicationId}/Acknowledgement/${btoa('AcknowledgementCheck')}` : `/applicationForm/${applicationId}/${basicForm?.forms[formIndex + 1]?.formCategory}/${btoa(basicForm?.forms[formIndex + 1]?.schemaCategory)}`)
      if (formIndex > 0) {
        setNavigateBackURL(`/applicationForm/${applicationId}/${basicForm?.forms[formIndex - 1]?.formCategory}/${btoa(basicForm?.forms[formIndex - 1]?.schemaCategory)}`)
      } else {
        setNavigateBackURL(`/applicationForm/${applicationId}/${basicForm?.forms[0]?.formCategory}/${btoa(basicForm?.forms[0]?.schemaCategory)}`)
      }
    }
  }, [basicForm, formIndex]);

  useEffect(() => {
    setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)))
    console.log(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)), 'indexCheck', basicForm)
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
  }, [applicationId, formIndex, basicForm]);

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
      // const existingPdfBytes = await fetch(pdf).then((res) =>
      //   res.arrayBuffer()
      // );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const pages = pdfDoc.getPages();

      const image = `${proxyUrl}${basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc")]?.data?.setUpYourSignature?.file?.fileURL}`;
      let imageBytes
      if (image)
        imageBytes = await fetch(image).then(res => res.arrayBuffer());

      const isPng = image.toLowerCase().endsWith(".png");
      const signatureImg = isPng
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);

      const sigField = form.getButton("eSignature_af_image");

      // Set the image into the image field
      sigField.setImage(signatureImg);

      // Extract and log fields for debugging
      const fields = form.getFields();
      fields.forEach((field) => {
        console.log(`Field Name: ${field.getName()}`);
      });

      const formatNameWithSpacing = (name) =>
        name?.split("").join(" ") || ""; // Single space between letters
      const formattedFullName = `${formatNameWithSpacing(profileData?.name?.lastName || "")}  ${formatNameWithSpacing(profileData?.name?.firstName || "")}`;

      form.getTextField("Surname").setText(formattedFullName);
      form.getTextField("Initials").setText(basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc")]?.data?.setUpYourSignature?.initial || "");
      form.getTextField("Office Address").setText(`${profileData?.contactAddress2?.mailingAddress?.streetName || ""}, ${profileData?.contactAddress2?.mailingAddress?.city || ""}, ${profileData?.contactAddress2?.mailingAddress?.province || ""}, ${profileData?.contactAddress2?.mailingAddress?.pinCode || ""}`);
      form.getTextField("Phone Number").setText(profileData?.mobileNumber || "");



      const formattedDate = format(new Date(), 'MMM dd, yyyy');

      // form.getTextField("Date9_af_date").setText(formattedDate || "");


      form.flatten();
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      console.log('indexCheck')
      await addNewDocument(blob);
    } catch (error) {
      console.log('indexCheck')
      console.error("Error populating PDF:", error);
      ErrorToaster("Failed to populate PDF");
    }
  };

  const addNewDocument = async (file) => {
    let fileName = { fileName: 'PharmacySignature.pdf' };
    const formData = new FormData();
    if (file !== null) {
      const blob = new Blob([file], { type: `application/pdf` });
      formData.append('files', new Blob([JSON.stringify(fileName)], { type: "application/json" }));
      formData.append('documents', blob, fileName.fileName);

      let uploadedFile = {};
      try {
        const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
        uploadedFile = response?.data?.file;
        console.log(response?.data)
        setPdfUrl(uploadedFile?.fileURL)
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

      try {
        console.log(formIndex, 'indexCheck', step, basicForm)
        const response = await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step))]?.id}/addFileToForm`, uploadedFile);
        return response?.data;
        console.log(response?.data)
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };




  const handleSubmitApplicationReq = async () => {
    // if (isSigned) {
    let temp = {
      schemaId: basicForm?.forms?.[formIndex]?.schemaId,
      data: { initials: initialArray },
      acknowledged: true,
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
    // }
    // else {
    //   if (sessionStorage.getItem('fromSummary') === 'true') {
    //     navigate(-1);
    //   } else {
    //     navigate(navigateURL)
    //   }
    // }
  }

  const handleBackClick = () => {
    navigate(navigateBackURL)
  }

  const renderPdfContent = () => {
    return (
      <div>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="1100px"
            title="PDF Viewer"
            style={{ border: 'none', overflow: 'hidden' }}
          />
        ) : (
          <p>Loading PDF...</p>
        )}
      </div>
    );
  };

  const getIsSaveInProgressOpen = (value) => {
    setIsSaveInProgressOpen(value);
  }

  return (
    <div>
      <div className={style.applicationScreenGrid}>
        <ProgressCard step={'STEP 9'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={30} timeText={'Min'} applicationId={applicationId} basicForm={basicForm} />
        <ApplicationUserCard user={'First Mi Last'} applyingFor={'{Doctor} Applying As {Associate}'} />
      </div>
      <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
        <div>
          <div className={style.applicationCardStyle} ref={targetRef} style={
            { height: "1350px" }
          }>
            <div className={`${style.marginTop} ${style.justifyCenter}`}>
              <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
            </div>
            <CommonDivider />
            <div className={`${style.cardTitle} ${style.marginTop}  ${style.justifyCenter}`}>{formSchema?.title}</div>
            <CommonDivider />
            {renderPdfContent()}

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
  );
};

export default PharmacySignature;