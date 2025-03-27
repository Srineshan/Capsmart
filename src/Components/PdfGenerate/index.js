import React, { useState, useEffect } from "react";
import { GET } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import jsPDF from "jspdf";
import CrossPink from "../../images/crossPink.png";
import style from "./index.module.scss";
import LoadingScreen from "../LoadingScreen";

const PdfGenerateBox = ({ getIsOpen }) => {
    const [name, setName] = useState();
    const id = sessionStorage.getItem("applicationId");
    const [formDetails, setFormDetails] = useState([]);
    const [privilege, setPrivilege] = useState('');
    const [isLoadingImage, setIsLoadingImage] = useState(false);
    const [pdfBase64, setPdfBase64] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                await getApplication();
            }
        };
    
        fetchData();
    }, [id]); 
    
    useEffect(() => {
        if (formDetails?.basicDetails?.applicant?.name) {
            const { firstName, lastName } = formDetails.basicDetails.applicant.name;
            const formattedName = `${lastName?.charAt(0).toUpperCase() + lastName?.slice(1).toLowerCase()}, ${
                firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase() : ""
            }`;
    
            setName(formattedName);
            setPrivilege(formDetails?.basicDetails?.applicant?.applicantType || "-");
    
        }
    }, [formDetails]);
    
    useEffect(() => {
        if (name && privilege) {
            generatePDF();
        }
    }, [name, privilege]);

    const getApplication = async () => {
        try {
            setIsLoadingImage(true);
            const { data: basicForm } = await GET(`application-management-service/application/${id}`);
            setFormDetails(basicForm);
            setIsLoadingImage(false);
        } catch (error) {
            console.error('Error fetching application:', error);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("User Information", 20, 20);
        doc.text(`Name: ${name}`, 20, 40);
        doc.text(`Type: ${privilege}`, 20, 60);
        doc.text("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 20, 80);
        doc.text("Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", 20, 100);
        doc.text("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.", 20, 120);
        
        // Generate PDF as base64 string
        const pdfBase64 = doc.output('datauristring');
        setPdfBase64(pdfBase64);

        console.log("Base64",pdfBase64)
    };

    return (
        <>
            {isLoadingImage && (
                <div className={style.loadingOverlay}>
                    <LoadingScreen/>
                </div>
            )}
            {!isLoadingImage && (
                <Dialog
                    isOpen={getIsOpen}
                    onClose={() => getIsOpen(false)}
                    className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
                    canOutsideClickClose={false}
                    canEscapeKeyClose={false}
                >
                    <div>
                        <div className={Classes.DIALOG_BODY}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.heading}`}>
                                    Create PDF
                                </div>
                                <div className={style.displayInRow}>
                                    <img
                                        src={CrossPink}
                                        alt="cross"
                                        className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
                                        onClick={() => {
                                            getIsOpen(false);
                                        }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={name}
                                        readOnly
                                        placeholder="Enter Name"
                                    />
                                    <input
                                        type="text"
                                        value={privilege}
                                        readOnly
                                        placeholder="Enter privilege"
                                    />
                                    <button onClick={generatePDF}>Generate PDF</button>
                                    
                                    {/* Display the base64 PDF URL if available */}
                                    {pdfBase64 && (
                                        <div style={{ marginTop: '20px', wordBreak: 'break-all' }}>
                                            <p>PDF generated successfully!</p>
                                            <p>Base64 URL (first 100 characters):</p>
                                            <p>{pdfBase64.substring(0, 100)}...</p>
                                            <a href={pdfBase64} target="_blank" rel="noopener noreferrer">
                                                Open PDF in new tab
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
};

export default PdfGenerateBox;