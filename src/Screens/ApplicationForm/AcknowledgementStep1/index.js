import React, { useEffect, useState, useRef } from "react";
import ProgressCard from "../../../Components/ProgressCard";
import ApplicationUserCard from "../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../Components/ApplicationAssistanceCard";
import CommonDivider from "../../../Components/CommonFields/CommonDivider";
import logo from "../../../images/cambridgeHospital.png";
import { GET, PUT, POST } from "../../dataSaver";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import CryptoJS from "crypto-js";
import style from "./index.module.scss";
import CommonCheckBox from "../../../Components/CommonFields/CommonCheckBox";
import ESign from "../../../Components/ESign";
import { format } from "date-fns";
import { SuccessToaster, ErrorToaster } from "../../../utils/toaster";
import ESignature from "../../../Components/ESignature";

const ApplicationAcknowledgementStep1 = ({
  acknowledgementForm,
  dateFormat,
  name,
  basicForm,
  getPreApplication,
  applicationId,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const targetRef = useRef();
  const [isSigned, setIsSigned] = useState(false);
  const publicKey =
    "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
  const [dateTime, setDateTime] = useState(new Date().toISOString());
  const [encryptedText, setEncryptedText] = useState(
    CryptoJS.AES.encrypt(name + dateTime, publicKey).toString()
  );
  // const [decryptedText, setDecryptedText] = useState(CryptoJS.AES.decrypt(encryptedText, publicKey).toString(CryptoJS.enc.Utf8));
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), dateFormat)
  );
  const [isEdited, setIsEdited] = useState(false);
  const [formSchema, setFormSchema] = useState();
  const [formContent, setFormContent] = useState();
  const [signText, setSignText] = useState(name + " " + currentDate);
  useEffect(() => {
    if (basicForm && !formSchema) {
      getFormSchema();
    }
    setIsChecked(basicForm?.forms?.[11]?.acknowledged);
    // setEncryptedText(basicForm?.forms?.[11]?.esign?.esign)
    setSignText(
      basicForm?.forms?.[11]?.acknowledged
        ? basicForm?.forms?.[11]?.esign?.esign
        : ""
    );
    setIsSigned(
      basicForm?.forms?.[11]?.esign?.esign !== undefined &&
        basicForm?.forms?.[11]?.acknowledged
        ? true
        : false
    );
    // setDecryptedText(CryptoJS.AES.decrypt(basicForm?.forms?.[11]?.esign?.esign, publicKey).toString(CryptoJS.enc.Utf8))
  }, [basicForm]);

  useEffect(() => {
    getRenderedContent();
  }, [formSchema]);

  const getFormSchema = async () => {
    if (basicForm?.formSchemas?.[11]?.id !== undefined) {
      const { data: form } = await GET(
        `application-management-service/formSchema/${basicForm?.formSchemas?.[11]?.id}`
      );
      setFormSchema(form);
    }
  };

  const getRenderedContent = async () => {
    const { data: content } = await GET(
      `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[11]?.id}/render`
    );
    setFormContent(content);
  };

  const addNewDocument = async (file) => {
    console.log(file, file?.name, "Test");
    let fileName = {
      fileName: "acknowledgement.pdf",
    };
    const formData = new FormData();

    if (file !== null) {
      const blob = new Blob([file], { type: `application/pdf` });
      formData.append(
        "files",
        new Blob([JSON.stringify(fileName)], {
          type: "application/json",
        })
      );
      formData.append("documents", blob, fileName?.fileName);

      let uploadedFile = {};
      try {
        const response = await POST(
          `application-management-service/application/${applicationId}/files`,
          formData
        );
        console.log(response?.data);
        uploadedFile = response?.data;
      } catch (error) {
        console.error(error);
        return null;
      }

      try {
        const response = await PUT(
          `application-management-service/application/${applicationId}/form/${basicForm?.forms?.[11]?.id}/addFileToForm`,
          uploadedFile
        );
        console.log(response?.data);
        return response?.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };

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
    const nestedElements = element.querySelectorAll(
      ".applicationCardScrollStyle"
    );
    nestedElements.forEach((_element) => {
      _element.classList.remove("applicationCardScrollStyle");
    });
    html2pdf()
      .set(opt)
      .from(element)
      .outputPdf("blob")
      .then((pdfBlob) => {
        addNewDocument(pdfBlob);
      });
  };

  const handleIsChecked = (value) => {
    setIsEdited(true);
    setIsChecked(value);
    if (!value) {
      setIsSigned(false);
    }
  };

  const handleSubmitApplicationReq = async () => {
    if (isSigned) {
      let temp = {
        schemaId: basicForm?.forms?.[11]?.schemaId,
        data: !isEdited
          ? basicForm?.forms?.[11]?.data
          : { esignDate: isChecked ? name + " " + currentDate : "" },
        acknowledged: isChecked,
        esign: {
          esign: isChecked ? encryptedText : "",
          name: isChecked ? name : "",
          signedDate: isChecked ? currentDate : "",
        },
      };
      await PUT(
        `application-management-service/application/${basicForm?.id}/form/${basicForm?.forms?.[11]?.id}`,
        temp
      )
        .then((response) => {
          console.log(response);
          getPreApplication();
          SuccessToaster("Application Updated Successfully");
          handleDownload();
          getFormSchema();
          if (sessionStorage.getItem("fromSummary") === "true") {
            navigate(-1);
          } else {
            navigate("/applicationForm/section1/acknowledgementStep2");
          }
        })
        .catch((error) => {
          console.log(error);
          ErrorToaster("Unexpected Error Updating Application");
        });
    } else {
      if (sessionStorage.getItem("fromSummary") === "true") {
        navigate(-1);
      } else {
        navigate("/applicationForm/section1/acknowledgementStep2");
      }
    }
  };
  return (
    <div>
      <div className={style.applicationScreenGrid}>
        <ProgressCard
          step={"STEP 1"}
          dataType={formSchema?.description}
          title={formSchema?.title}
          timeNumber={32}
          timeText={"Min"}
          progressStyle={`${style.progressStyle} ${style.progressStyleBackground}`}
        />
        <ApplicationUserCard
          user={"First Mi Last"}
          applyingFor={"{Doctor} Applying As {Associate}"}
        />
      </div>
      <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
        <div>
          <div
            className={`${style.applicationCardStyle} ${style.applicationCardScrollStyle}`}
            ref={targetRef}
          >
            <div className={`${style.marginTop} ${style.justifyCenter}`}>
              <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
            </div>
            <CommonDivider />
            {formSchema?.content?.title !== null && (
              <div className={style.cardTitle}>
                {formSchema?.content?.title}
              </div>
            )}
            <div
              className={`${style.leftAlign} ${style.marginTop} ${style.descriptionStyle}`}
              dangerouslySetInnerHTML={{
                __html: formContent?.content?.content,
              }}
            />
            {formSchema?.disclaimer?.title !== null && (
              <div className={style.cardTitle}>
                {formSchema?.disclaimer?.title}
              </div>
            )}
            <div className={`${style.checkGrid} ${style.marginTop}`}>
              {formContent?.disclaimer?.content !== null && (
                <CommonCheckBox
                  checked={isChecked}
                  onChange={(e) => handleIsChecked(e.target.checked)}
                />
              )}
              <div
                className={`${style.leftAlign} ${style.marginTop10}`}
                dangerouslySetInnerHTML={{
                  __html: formContent?.disclaimer?.content,
                }}
              />
            </div>
            {formSchema?.esignatureRequired && (
              <div className={style.twoCol}>
                <div
                  onClick={
                    isChecked
                      ? () => {
                          setIsSigned(!isSigned);
                          setIsEdited(true);
                        }
                      : () => {}
                  }
                  className={!isChecked ? style.disabled : ""}
                >
                  <ESignature
                    encData={isSigned ? encryptedText : ""}
                    showData={true}
                    showDatais={true}
                    // basicForm={basicForm}
                  />
                </div>
                <div className={style.verticalAlignCenter}>
                  <div className={style.displayInRow}>
                    <div className={style.dateTitle}>Date: </div>
                    <div className={`${style.date} ${style.marginLeft}`}>
                      {isSigned ? currentDate : ""}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <ApplicationAssistanceCard
            user={"Neena Greenly"}
            designation={"{Designation}"}
            contactNumber={"{Contact Number}"}
            email={"{Email}"}
          />
          <div
            className={`${style.saveInProgress} ${style.marginTop}`}
            onClick={() => handleDownload()}
          >
            SAVE IN PROGRESS
          </div>
          <div className={style.twoColForButton}>
            <div
              className={`${style.continue} ${style.marginTop10}`}
              onClick={() => navigate(-1)}
            >
              BACK
            </div>
            <div
              className={`${style.continue} ${style.marginTop10}`}
              onClick={() => handleSubmitApplicationReq()}
            >
              CONTINUE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationAcknowledgementStep1;
