import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import style from "./index.module.scss";
import { GET } from "../../Screens/dataSaver";
import FileDisplayDialog from "../fileDisplayDialog";
import PDFDocs from './../../images/PDFDocs.png';
import imgDocs from './../../images/imgDocs.png';
import { Tooltip } from "@mui/material";

const ApplicationReferenceDocuments = ({ refetchRefDoc, getResetRefetch }) => {
  const [basicForm, setBasicForm] = useState({});
  const applicationId = sessionStorage.getItem("applicationId");
  const applicationCreationType = sessionStorage.getItem("applicationCreationType");
  const [formIndex, setFormIndex] = useState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch application data
  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  useEffect(() => {
    if (refetchRefDoc) {
      console.log('Delete Refetch')
      fetchApplicationData();
      getResetRefetch();
    }
  }, [refetchRefDoc]);

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

  const fetchApplicationData = async () => {
    const { data: newBasicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setBasicForm(newBasicForm);
  };

  const openDialog = (file) => {
    setSelectedFile(file);
    setIsDialogOpen(true);
  };

  const tableData = basicForm?.forms?.[formIndex]?.data?.table;



  return (
    <div className={style.referenceDocumentParentCard}>
      <div className={style.referenceDocumentTitle}>Your {applicationCreationType === "LOCUM" ? `Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : 'Renewal'}` : 'Reappointment'} Documents</div>
      {(tableData?.length > 0 || basicForm?.payment?.invoice?.fileURL !== undefined) ? (
        <>
          {tableData?.map((document, index) => {
            console.log(document); // Log the document object for debugging

            // Determine the icon to show based on file type
            const docIcon =
              document?.fileType === "application/pdf"
                ? PDFDocs
                : document?.fileType?.startsWith("image/")
                  ? imgDocs
                  : null;

            return (
              <div
                className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}
                key={index}
              >
                <div className={style.fullWidth}>
                  <Tooltip title="Click to Open File" arrow>
                    <div className={`${style.documentsGrid} ${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => openDialog(document)}>
                      <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                        {docIcon && (
                          <img
                            src={docIcon}
                            alt="Document Type Icon"
                            className={`${style.docTypeImgStyle} ${style.cursorPointer}`}
                          />
                        )}
                        <div
                          className={style.documentNameStyle}
                        >
                          {document?.documentType}
                        </div>
                      </div>
                      {/* <div
                      className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                    >
                      <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
                    </div> */}
                    </div>
                  </Tooltip>
                </div>
              </div>
            );
          })}
          {basicForm?.payment?.invoice?.fileURL !== undefined && (
            <div
              className={`${style.referenceDocumentCard} ${style.verticalAlignCenter} ${style.marginTop10}`}
            >

              <div className={style.fullWidth}>
                <Tooltip title="Click to Open File" arrow>
                  <div className={`${style.documentsGrid} ${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => openDialog(basicForm?.payment?.invoice)}>
                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                      <img
                        src={PDFDocs}
                        alt="Document Type Icon"
                        className={`${style.docTypeImgStyle} ${style.cursorPointer}`}
                      />
                      <div
                        className={style.documentNameStyle}
                      >
                        Payment Receipt
                      </div>
                    </div>
                    {/* <div
                      className={`${style.checkBackground} ${style.verticalAlignCenter} ${style.justifyCenter}`}
                    >
                      <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />
                    </div> */}
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={style.noDocumentsMessage}>No documents uploaded.</div>
      )}
      {isDialogOpen && (
        <FileDisplayDialog getIsOpen={setIsDialogOpen} file={selectedFile} />
      )}
    </div>
  );
};

export default ApplicationReferenceDocuments;