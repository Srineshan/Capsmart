import React, { useEffect, useState, useRef } from "react";
import ProgressCard from "../../../../Components/ProgressCard";
import ApplicationUserCard from "../../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../../Components/ApplicationAssistanceCard";
import logo from "../../../../images/cambridgeHospital.png";
import CommonDivider from "../../../../Components/CommonFields/CommonDivider";
import { GET, PUT, POST } from "../../../dataSaver";
import { ErrorToaster, SuccessToaster } from "../../../../utils/toaster";
import { useNavigate, useParams } from "react-router-dom";
import style from "./index.module.scss";
import { PDFDocument } from "pdf-lib";
import CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import CommonCheckBox from "../../../../Components/CommonFields/CommonCheckBox";
import CommonInputField from "../../../../Components/CommonFields/CommonInputField";
import SaveInProgressDialog from "../../../../Components/SaveInProgressDialog";

const PACSRequest = ({
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
  const [accessType, setAccessType] = useState([]);
  const [otherAccessType, setOtherAccessType] = useState("")
  const [isSaveInProgressOpen, setIsSaveInProgressOpen] = useState(false);
  console.log(initialArray)
  const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const fixedPdfUrl = formSchema?.file?.fileURL;

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
    setAccessType(basicForm?.forms?.[formIndex]?.data && basicForm?.forms?.[formIndex]?.data?.accessType ? basicForm?.forms?.[formIndex]?.data?.accessType : [])
    setOtherAccessType(basicForm?.forms?.[formIndex]?.data && basicForm?.forms?.[formIndex]?.data?.otherAccessType ? basicForm?.forms?.[formIndex]?.data?.otherAccessType : "")
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
    console.log(basicForm?.forms?.findIndex(data => data?.schemaCategory === atob(step)), 'indexCheck')
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

  useEffect(() => {
    populatePdfWithProfileData(applicantProfile);
  }, [applicantProfile])

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
    console.log('indexCheck')
    try {
      console.log('indexCheck')
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

      const sigField = form.getButton("eSignature");

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
      // Fill text fields with profile data
      // form.getTextField("Text35").setText(formattedFullName);
      // form.getTextField("Text73").setText(profileData.department || "");
      // form.getTextField("Text107").setText(profileData.jobTitle || "");
      // form.getTextField("Text108").setText(profileData.managerName || "");
      // form.getTextField("Text109").setText(profileData.email?.officialEmail || "")
      // form.getTextField("Text110").setText(profileData.extension || "");

      form.getTextField("First Name / Last Name").setText(formattedFullName);
      form.getTextField("Department / Nursing Unit").setText(profileData.department?.name || "");
      form.getTextField("Job Title / Position").setText(profileData.jobTitle || "");
      form.getTextField("Manager's Name").setText(profileData.managerName || "");
      form.getTextField("Email").setText(profileData.email?.officialEmail || "")
      form.getTextField("Extension").setText(profileData.extension || "");


      // Fill checkboxes
      // form.getCheckBox("Check Box131").check();
      // if (accessType?.includes('Radiologist')) {
      //   form.getCheckBox("Check Box132").check();
      // } else {
      //   form.getCheckBox("Check Box132").uncheck();
      // }
      // if (accessType?.includes('Physician')) {
      //   form.getCheckBox("Check Box133").check();
      // } else {
      //   form.getCheckBox("Check Box133").uncheck();
      // }
      // if (accessType?.includes('ER Physician')) {
      //   form.getCheckBox("Check Box134").check();
      // } else {
      //   form.getCheckBox("Check Box134").uncheck();
      // }
      // if (accessType?.includes('DI Technologist')) {
      //   form.getCheckBox("Check Box135").check();
      // } else {
      //   form.getCheckBox("Check Box135").uncheck();
      // }
      // if (accessType?.includes('Orthopedic Surgeon')) {
      //   form.getCheckBox("Check Box136").check();
      // } else {
      //   form.getCheckBox("Check Box136").uncheck();
      // }
      // if (accessType?.includes('Super User')) {
      //   form.getCheckBox("Check Box137").check();
      // } else {
      //   form.getCheckBox("Check Box137").uncheck();
      // }
      // if (accessType?.includes('Cleirical')) {
      //   form.getCheckBox("Check Box138").check();
      // } else {
      //   form.getCheckBox("Check Box138").uncheck();
      // }
      // if (accessType?.includes('Other')) {
      //   form.getCheckBox("Check Box139").check();
      // } else {
      //   form.getCheckBox("Check Box139").uncheck();
      // }

      // form.getCheckBox("Check Box25").check();

      if (accessType?.includes('Radiologist')) {
        form.getCheckBox("Radiologist").check();
      } else {
        form.getCheckBox("Radiologist").uncheck();
      }
      if (accessType?.includes('Physician')) {
        form.getCheckBox("Physician").check();
      } else {
        form.getCheckBox("Physician").uncheck();
      }
      if (accessType?.includes('ER Physician')) {
        form.getCheckBox("ER Physician").check();
      } else {
        form.getCheckBox("ER Physician").uncheck();
      }
      if (accessType?.includes('DI Technologist')) {
        form.getCheckBox("DI Technologist").check();
      } else {
        form.getCheckBox("DI Technologist").uncheck();
      }
      if (accessType?.includes('Cleirical')) {
        form.getCheckBox("Clerical").check();
      } else {
        form.getCheckBox("Clerical").uncheck();
      }
      if (accessType?.includes('Super User')) {
        form.getCheckBox("Super User").check();
      } else {
        form.getCheckBox("Super User").uncheck();
      }
      if (accessType?.includes('Orthopedic Surgeon')) {
        form.getCheckBox("Orthopedic Surgeon").check();
      } else {
        form.getCheckBox("Orthopedic Surgeon").uncheck();
      }


      if (accessType?.includes('Other')) {
        form.getCheckBox("Other").check();
      } else {
        form.getCheckBox("Other").uncheck();
      }

      // form.getTextField("Text140").setText(otherAccessType);
      form.getTextField("Other Text").setText(otherAccessType);
      const formattedDate = format(new Date(), 'MMM dd, yyyy');
      // form.getTextField("Text144").setText(formattedDate || "");
      // form.getTextField("Text150").setText(formattedDate || "");
      form.getTextField("Date").setText(formattedDate || "");


      // Signature field on the first page
      const esignText = basicForm?.forms?.[formIndex]?.esign?.esign || "";

      // Signature field on the first page
      // const signatureField1 = form.getField("Signature141");
      // if (esignText) {
      //   const { x: x1, y: y1, width: width1, height: height1 } =
      //     signatureField1.getWidgets()[0].getRectangle();

      //   pages[0].drawText(esignText, {
      //     x: x1,
      //     y: y1 - 15,
      //     size: 12,
      //   });
      // } else {

      // }

      // const signatureField2 = form.getField("Signature151");
      // if (esignText) {
      //   const { x: x2, y: y2, width: width2, height: height2 } =
      //     signatureField2.getWidgets()[0].getRectangle();

      //   pages[1].drawText(esignText, {
      //     x: x2,
      //     y: y2 - 15, 
      //     size: 12,
      //   });
      // } else {

      // }

      // Save and display updated PDF
      form.getFields().forEach(field => {
        if (field.constructor.name === 'PDFCheckBox') {
          field.updateAppearances();  // fixes display
        }
      });
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
    let fileName = { fileName: 'PACS.pdf' };
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
      data: {
        initials: initialArray,
        accessType: accessType,
        otherAccessType: otherAccessType
      },
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
    // }
    // else {
    //   if (sessionStorage.getItem('fromSummary') === 'true') {
    //     navigate(-1);
    //   } else {
    //     navigate(navigateURL)
    //   }
    // }
  }

  const handleAccessType = (data, checked) => {
    if (checked) {
      setAccessType(prev => [...prev, data]);
    } else {
      setAccessType(prev => prev.filter(innerData => innerData !== data));
    }
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

  const handleBackClick = () => {
    navigate(navigateBackURL)
  }

  return (
    <div>
      <div className={style.applicationScreenGrid}>
        <ProgressCard step={'STEP 9'} dataType={formSchema?.description} title={formSchema?.title} timeNumber={30} timeText={'Min'} applicationId={applicationId} basicForm={basicForm} />
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
            <div className={`${style.cardTitle} ${style.marginTop}  ${style.justifyCenter}`}>Access Type Required (Select to show on the form below)</div>
            <div className={style.threeCol}>
              <CommonCheckBox
                value="Radiologist"
                className={style.marginLeft20}
                checked={accessType?.includes('Radiologist')}
                onChange={(e) => {
                  handleAccessType("Radiologist", e.target.checked);
                }}
                label="Radiologist"
              />
              <CommonCheckBox
                value="Orthopedic Surgeon"
                className={style.marginLeft20}
                checked={accessType?.includes('Orthopedic Surgeon')}
                onChange={(e) => {
                  handleAccessType("Orthopedic Surgeon", e.target.checked);
                }}
                label="Orthopedic Surgeon"
              />
              <CommonCheckBox
                value="Physician"
                className={style.marginLeft20}
                checked={accessType?.includes('Physician')}
                onChange={(e) => {
                  handleAccessType("Physician", e.target.checked);
                }}
                label="Physician"
              />
              <CommonCheckBox
                value="Super User"
                className={style.marginLeft20}
                checked={accessType?.includes('Super User')}
                onChange={(e) => {
                  handleAccessType("Super User", e.target.checked);
                }}
                label="Super User"
              />
              <CommonCheckBox
                value="ER Physician"
                className={style.marginLeft20}
                checked={accessType?.includes('ER Physician')}
                onChange={(e) => {
                  handleAccessType("ER Physician", e.target.checked);
                }}
                label="ER Physician"
              />
              <CommonCheckBox
                value="Cleirical"
                className={style.marginLeft20}
                checked={accessType?.includes('Cleirical')}
                onChange={(e) => {
                  handleAccessType("Cleirical", e.target.checked);
                }}
                label="Cleirical"
              />
              <CommonCheckBox
                value="DI Technologist"
                className={style.marginLeft20}
                checked={accessType?.includes('DI Technologist')}
                onChange={(e) => {
                  handleAccessType("DI Technologist", e.target.checked);
                }}
                label="DI Technologist"
              />
              <div className={style.displayInRow}>
                <CommonCheckBox
                  value="Other"
                  className={style.marginLeft20}
                  checked={accessType?.includes('Other')}
                  onChange={(e) => {
                    handleAccessType("Other", e.target.checked);
                  }}
                  label="Other"
                />
                {accessType?.includes('Other') && (
                  <CommonInputField
                    className={style.fourFieldWidth}
                    placeholder={'Enter Access Type'}
                    value={otherAccessType}
                    onChange={(e) => setOtherAccessType(e.target.value)}
                  />
                )}
              </div>

            </div>
            <div>
              <div className={`${style.continue} ${style.marginTop10}`} onClick={() => populatePdfWithProfileData(applicantProfile)} >UPDATE</div>
            </div>
            <div className={style.marginTop10}>
              {renderPdfContent()}
            </div>

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
    </div >
  );
};

export default PACSRequest;
