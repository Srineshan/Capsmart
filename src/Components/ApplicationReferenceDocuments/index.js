import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import style from "./index.module.scss";
import { GET } from "../../Screens/dataSaver";
import FileDisplayDialog from "../fileDisplayDialog";
import PDFDocs from './../../images/PDFDocs.png';
import imgDocs from './../../images/imgDocs.png';

const ApplicationReferenceDocuments = () => {
  const [basicForm, setBasicForm] = useState({});
  const applicationId = sessionStorage.getItem("applicationId");
  const [formIndex, setFormIndex] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const openDialog = (file) => {
    setSelectedFile(file);
    setIsDialogOpen(true);
  };

  const tableData = basicForm?.forms?.[formIndex]?.data?.table;

  
  
  return (
    <div className={style.referenceDocumentParentCard}>
      <div className={style.referenceDocumentTitle}>Your ReAppointment Documents</div>
      {tableData?.length > 0 ? (
        tableData.map((document, index) => {
          console.log(document); // Log the document object for debugging

          // Determine the icon to show based on file type
          const docIcon =
            document?.fileType === "application/pdf"
              ? PDFDocs
              : document?.fileType.startsWith("image/")
              ? imgDocs
              : null;

          return (
            <div
              className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}
              key={index}
            >
              <div className={style.fullWidth}>
                <div className={style.spaceBetween}>
                  <div className={style.displayInRow}>
                    {docIcon && (
                      <img
                        src={docIcon}
                        alt="Document Type Icon"
                        className={style.docTypeImgStyle}
                        onClick={() => openDialog(document)}
                      />
                    )}
                    <div
                      className={style.documentNameStyle}
                      onClick={() => openDialog(document)}
                    >
                      {document?.documentType}
                    </div>
                  </div>
                  <div
                    className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                  >
                    <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className={style.noDocumentsMessage}>No documents available.</div>
      )}
      {isDialogOpen && (
        <FileDisplayDialog getIsOpen={setIsDialogOpen} file={selectedFile} />
      )}
    </div>
  );
};

export default ApplicationReferenceDocuments;