import React, { useState, useCallback, useRef, createRef, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import FullscreenSharpIcon from "@mui/icons-material/FullscreenSharp";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import LoadingScreen from "../LoadingScreen";
import { corsUrl } from "../../utils/formatting";
import { Download } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import style from './index.module.scss'
import jsPDF from "jspdf";

const FileDisplayDialog = ({ getIsOpen, file }) => {
  const [isContinue, setIsContinue] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPrintClicked, setIsPrintClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    console.log("filesssssssssssssssss", file);
    // getPreApplicationTask();
  }, []);

  useEffect(() => {
    if (file?.fileURL) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [file?.fileURL]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDownload = async () => {
    if (file?.fileURL) {
      try {
        // Fetch the file content through the CORS proxy
        const response = await fetch(`${corsUrl}${file?.fileURL}`, {
          method: "GET",
          mode: 'cors'
        });


        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.statusText}`);
        }



        // Create a temporary URL for the Blob
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        console.log("bloburl", blobUrl);

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file?.fileName || "download"; // Use the provided file name or default name
        link.style.display = 'none'; // Hide the link
        document.body.appendChild(link); // Append the link to the DOM
        link.click(); // Trigger the download

        // Clean up by removing the link and revoking the Blob URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Failed to download file:", error);
        alert("Failed to download file. Please try again.");
      }
    } else {
      console.warn("No file URL provided for download.");
    }
  };


  // const handleEmbedPrint = useReactToPrint({
  //   content: () => fileRef.current, 
  //   documentTitle: "Staff Application",
  //   removeAfterPrint: true,
  //   onAfterPrint: () => setIsPrintClicked(false), 
  // });

  const handleEmbedPrint = () => {
    if (file.fileType === "application/pdf") {
      const iframe = fileRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.focus(); // Focus on the iframe
        iframe.contentWindow.print(); // Trigger the print dialog
      } else {
        console.error("Iframe reference is not available.");
      }
    } else {
      alert("Printing is only supported for PDF files.");
    }
  };


  // const handleEmbedPrint = async () => {
  //   if (file.fileType === "application/pdf") {
  //     try {
  //       setIsPrintClicked(true);
  //       const completeFileUrl = `${corsUrl}${file.fileURL}`; // Full URL with CORS
  //       const response = await fetch(completeFileUrl, {method:"GET", mode: "no-cors" }); // Fetch PDF file

  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  //       }

  //       const blob = await response.blob();
  //       const blobUrl = URL.createObjectURL(blob); // Convert to Blob URL

  //       const iframe = document.createElement("iframe"); // Create hidden iframe
  //       iframe.style.display = "none";
  //       iframe.src = blobUrl; // Load PDF

  //       document.body.appendChild(iframe);

  //       iframe.onload = () => {
  //         iframe.contentWindow.focus();
  //         iframe.contentWindow.print(); // Print the PDF
  //         document.body.removeChild(iframe); // Clean up after printing
  //         URL.revokeObjectURL(blobUrl); // Free memory
  //         setIsPrintClicked(false);
  //       };
  //     } catch (error) {
  //       console.error("Error printing PDF:", error);
  //       alert("Failed to print PDF. Please try again.");
  //       setIsPrintClicked(false);
  //     }
  //   } else {
  //     alert("Printing is only supported for PDF files.");
  //   }
  // };




  // Print functionality for images (img element)
  const handleImagePrint = useReactToPrint({
    content: () => fileRef.current, // Access the img element
    documentTitle: "Staff Application",
    removeAfterPrint: true,
    onAfterPrint: () => setIsPrintClicked(false), // Reset print state after printing
  });

  // Conditionally handle print based on file type
  const handlePrintClick = () => {
    setIsPrintClicked(true);
    if (file?.fileType === "application/pdf") {
      handleEmbedPrint(); // Print iframe content for PDFs
    } else if (file?.fileType?.startsWith("image/")) {
      handleImagePrint(); // Print img element for images
    }
  };

  return (
    <>
      {isLoading && (
        <div className={style.loadingOverlay}>
          <LoadingScreen />
        </div>
      )}
      <Dialog
        isOpen={getIsOpen}
        onClose={() => getIsOpen(false)}
        className={`${style.eSignDialog}  ${isExpanded
          ? style.eSignDialogBackground1
          : style.eSignDialogBackground
          } ${isExpanded ? style.expandedDialog : ""}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div>
          <div className={Classes.DIALOG_BODY}>
            {/* <div className={` ${isExpanded ? style.dialog :Classes.DIALOG_BODY}`}> */}
            <div className={style.spaceBetween}>
              <div className={style.heading}>
                {file?.fileUploaded !== undefined
                  ? `${file?.documentType} ${file?.fileUploaded}`
                  : file?.fileName !== undefined
                    ? ` ${file?.fileName}`
                    : ""}
              </div>
              <div className={style.displayInRow}>
                <div className={`${style.alignCenter} ${style.cursorPointer} ${style.marginRight}`}>
                  <Tooltip title="Download" arrow >
                    <Download
                      sx={{
                        fontSize: 25,
                        color: "#06617A",
                      }}
                      onClick={handleDownload}
                    />
                  </Tooltip>
                </div>
                <div
                  className={`${isPrintClicked && style.addStyle} ${style.alignCenter
                    } ${style.cursorPointer} ${style.marginRight}`}
                >
                  <Tooltip title="Print" arrow >
                    <PrintOutlinedIcon
                      sx={{
                        fontSize: isPrintClicked ? 20 : 25,
                        color: isPrintClicked ? "#fff" : "#06617A",
                      }}
                      onClick={handlePrintClick}
                    />
                  </Tooltip>
                </div>
                {!isExpanded ? (
                  <Tooltip title="Click to Expand" arrow >
                    <FullscreenSharpIcon
                      className={`${style.iconStyle} ${style.cursorPointer} `}
                      onClick={toggleExpand}
                      sx={{ color: "#06617A" }}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title="Click to Minimize" arrow >
                    <FullscreenExitIcon
                      className={`${style.iconStyle} ${style.cursorPointer} `}
                      onClick={toggleExpand}
                      sx={{ color: "#06617A" }}
                    />
                  </Tooltip>
                )}
                {/* <FullscreenSharpIcon
                                className={`${style.iconStyle} ${style.cursorPointer} `}
                                onClick={toggleExpand}
                                sx={{ color: '#06617A' }} 
                            /> */}
                <Tooltip title={"Click to Close"} arrow>
                  <img
                    src={CrossPink}
                    alt="cross"
                    className={`${style.crossStyle} ${style.cursorPointer} `}
                    onClick={() => { getIsOpen(false) }}
                  />
                </Tooltip>
              </div>
            </div>
            <div className={style.marginTop}>
              {file?.fileType === 'application/pdf' ? (
                <iframe src={`${file?.fileURL}#toolbar=1&view=fitH`} width="100%" height="600px"></iframe>
              ) : file?.fileType?.startsWith("image/") ? (
                <img src={file?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
              ) : <iframe src={`${file?.fileURL}#toolbar=1&view=fitH`} width="100%" height="600px"></iframe>}
            </div>
            <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
              <Tooltip title={"Click to Close"} arrow>
                <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); }}>CLOSE</div></Tooltip>
            </div>
          </div>

        </div>
      </Dialog >
    </>
  )
}

export default FileDisplayDialog;
