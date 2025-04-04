import React, { useState, useCallback, useRef, createRef, useEffect } from 'react';
import { Dialog, Classes } from '@blueprintjs/core';
import CrossPink from "../../images/crossPink.png";
import FullscreenSharpIcon from '@mui/icons-material/FullscreenSharp';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import LoadingScreen from "../LoadingScreen";
import { corsUrl } from "../../utils/formatting";
import { Download } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import style from './index.module.scss'

const FileDisplayDialog = ({ getIsOpen, file }) => {
    const [isContinue, setIsContinue] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPrintClicked, setIsPrintClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const pdfUrl = file?.fileURL ? encodeURI(file?.fileURL) : "";
    console.log("URLLLLLLLLLLLLLLLLLLL",pdfUrl, file?.documentType);

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

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrintClick = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Staff Application",
        removeAfterPrint: true,
    });

    const handlePrint = async (url) => {
        if (!url) {
            console.error("No URL provided for printing");
            return;
        }
    
        try {
            const response = await fetch(corsUrl + encodeURIComponent(url)); // Use the proxy
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
    
            // Create a hidden iframe
            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.width = "0px";
            iframe.style.height = "0px";
            iframe.style.border = "none";
            iframe.src = pdfUrl;
            
            document.body.appendChild(iframe);
    
            // Wait for the PDF to load, then print
            iframe.onload = () => {
                iframe.contentWindow.print();
            };
    
            // Cleanup after printing
            setTimeout(() => {
                URL.revokeObjectURL(pdfUrl);
                document.body.removeChild(iframe);
            }, 30000);
        } catch (error) {
            console.error("Error printing the PDF:", error);
        }
    };

    const downloadPDF = async (url, filename) => {
        try {
          const response = await fetch(corsUrl + encodeURIComponent(url));
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error("Error downloading the PDF:", error);
        }
      };
      

      const handleDownload = (url,fileName) => {
        if (!url) {
          console.error("No URL provided for download");
          return;
        }
        downloadPDF(url,fileName );
      };

    return (
        <>
            {isLoading && (
                <div className={style.loadingOverlay}>
                    <LoadingScreen />
                </div>
            )}
            <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.eSignDialog}  ${isExpanded ? style.eSignDialogBackground1 : style.eSignDialogBackground} ${isExpanded ? style.expandedDialog : ''}`} canOutsideClickClose={false} canEscapeKeyClose={false} ref={PDFRef}>
                <div>
                    <div className={Classes.DIALOG_BODY}>
                        {/* <div className={` ${isExpanded ? style.dialog :Classes.DIALOG_BODY}`}> */}
                        <div className={style.spaceBetween}>
                            <div className={style.heading}>{file?.fileUploaded !== undefined ? `${file?.documentType} ${file?.fileUploaded}` : file?.fileName !== undefined ? ` ${file?.fileName}` : ''}</div>
                            <div className={style.displayInRow}>
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
                                        onClick={() => handlePrint(pdfUrl)}
                                    />
                                    </Tooltip>
                                </div>
                                <Tooltip title="Download" arrow >
                                <Download
                                    sx={{
                                        fontSize: 25,
                                        color: "#06617A",
                                    }}
                                    className={style.cursorPointer}
                                    onClick={() => handleDownload(pdfUrl,file?.documentType)}
                                />
                                </Tooltip>
                                {!isExpanded ? (
                                    <Tooltip title="Maximize" arrow >
                                    <FullscreenSharpIcon
                                        className={`${style.iconStyle} ${style.cursorPointer} `}
                                        onClick={toggleExpand}
                                        sx={{ color: '#06617A' }}
                                    /></Tooltip>) : (<Tooltip title="Minimize" arrow >
                                    <FullscreenExitIcon
                                        className={`${style.iconStyle} ${style.cursorPointer} `}
                                        onClick={toggleExpand}
                                        sx={{ color: '#06617A' }}
                                    />
                                    </Tooltip>
                                )
                                }
                                {/* <FullscreenSharpIcon
                                className={`${style.iconStyle} ${style.cursorPointer} `}
                                onClick={toggleExpand}
                                sx={{ color: '#06617A' }} 
                            /> */}
                                <img
                                    src={CrossPink}
                                    alt="cross"
                                    className={`${style.crossStyle} ${style.cursorPointer} `}
                                    onClick={() => { getIsOpen(false) }}
                                />
                            </div>
                        </div>
                        <div ref={componentRef} className={style.marginTop}>
                            {file?.fileType === 'application/pdf' ? (
                                <iframe src={`${file?.fileURL}#toolbar=1&view=fitH`} width="100%" height="600px"></iframe>
                            ) : file?.fileType?.startsWith("image/") ? (
                                <img src={file?.fileURL} alt="" width="100%" height="600px" className={style.objectFitContain} />
                            ) : <iframe src={`${file?.fileURL}#toolbar=1&view=fitH`} width="100%" height="600px"></iframe>}
                        </div>
                        <div className={`${style.justifyCenter} ${style.displayInRow} ${style.marginTop}`}>
                            <div className={`${style.continue} ${style.marginLeft}`} onClick={() => { getIsOpen(false); }}>CLOSE</div>
                        </div>
                    </div>

                </div>
            </Dialog >
        </>
    )
}

export default FileDisplayDialog;
