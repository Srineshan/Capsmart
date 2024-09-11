import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import PdfPage from "./pdfPageView";

// Configures PDF.js to use the specified worker script for processing.
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfViewer = ({ pdfurl }) => {
    const [pages, setPages] = useState([]);
    console.log(pages)
    useEffect(() => {
        const loadPdf = async () => {
            try {
                const proxyUrl = "https://api.allorigins.win/raw?url=";
                const pdfUrlWithProxy = `${proxyUrl}${encodeURIComponent(pdfurl)}`;
                const loadingTask = pdfjsLib.getDocument(pdfUrlWithProxy);

                console.log("Loading PDF from:", pdfUrlWithProxy);
                const pdf = await loadingTask.promise;

                console.log("PDF loaded, total pages:", pdf.numPages);

                const loadedPages = [];
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    loadedPages.push(page);
                }
                setPages(loadedPages);
            } catch (error) {
                console.error("Error loading PDF:", error);
            }
        };

        loadPdf();
    }, [pdfurl]);

    return (
        <div>
            {pages.length > 0 ? (
                pages.map((page, index) => (
                    <PdfPage key={index} page={page} index={index} />
                ))
            ) : (
                <p>Loading PDF...</p>
            )}
        </div>
    );
};

export default PdfViewer;