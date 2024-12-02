import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import style from "./index.module.scss";
import { GET } from "../../Screens/dataSaver";

const ApplicationReferenceDocuments = () => {
  const [basicForm, setBasicForm] = useState({});
  const applicationId = sessionStorage.getItem("applicationId");
  const [formIndex, setFormIndex] = useState();

  // Fetch application data
  useEffect(() => {
    const fetchApplicationData = async () => {
      const { data: newBasicForm } = await GET(
        `application-management-service/application/${applicationId}`
      );
      setBasicForm({ ...newBasicForm });
    };
    fetchApplicationData();
  }, [applicationId]);

  // Find the index of the form with schemaCategory "UploadYourDoc"
  useEffect(() => {
    if (basicForm?.forms) {
      setFormIndex(
        basicForm.forms.findIndex(
          (data) => data?.schemaCategory === "UploadYourDoc"
        )
      );
    }
  }, [basicForm]);

  const tableData = basicForm?.forms?.[formIndex]?.data?.table;

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={style.referenceDocumentParentCard}>
      <div className={style.referenceDocumentTitle}>Your Reference Documents</div>
      {tableData?.length > 0 ? (
        tableData.map((document, index) => (
          <div
            className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}
            key={index}
          >
            <div className={style.fullWidth}>
              <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                  <FilePresentRoundedIcon
                    sx={{ fontSize: 16, color: "#2C2C2C" }}
                    onClick={() => window.open(document?.fileURL, "_blank")}
                  />
                  <div className={style.documentNameStyle}>{document?.documentType}</div>
                </div>
                <div
                  className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                >
                  <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={style.noDocumentsMessage}>No documents available.</div>
      )}
    </div>
  );  
};

export default ApplicationReferenceDocuments;