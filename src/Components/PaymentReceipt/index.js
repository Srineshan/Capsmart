import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import style from "./index.module.scss";
import { GET } from "../../Screens/dataSaver";
import FileDisplayDialog from "../fileDisplayDialog";
import PDFDocs from './../../images/PDFDocs.png';
import imgDocs from './../../images/imgDocs.png';
import { Tooltip } from "@mui/material";

const PaymentReceipt = ({ basicForm }) => {
  const applicationId = sessionStorage.getItem("applicationId");
  const applicationCreationType = sessionStorage.getItem("applicationCreationType");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const openDialog = (file) => {
    setSelectedFile(file);
    setIsDialogOpen(true);
  };

  return (
    <div className={style.referenceDocumentParentCard}>
      <div className={style.referenceDocumentTitle}>Your {basicForm?.privilegeCategoryType === "LOCUM" ? `Locum ${basicForm?.reappointmentType === "EXTENSION" ? 'Extension' : basicForm?.creationType === "NEW" ? "" : 'Renewal'}` : basicForm?.creationType === "NEW" ? "" : 'Reappointment'} Documents</div>
      {(basicForm?.payment?.invoice?.fileURL !== undefined) ? (
        <>
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

export default PaymentReceipt;