import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import PdfPage from "./pdfPageView";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const CommonPdfViewer = ({ pdfurl, setIsScrolledToBottom }) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPdf = async () => {
            try {
                setLoading(true);
                setError(null);

                // Remove the proxy to test with direct URL
                // const proxyUrl = "https://api.allorigins.win/raw?url=";
                // const pdfUrlWithProxy = `${proxyUrl}${encodeURIComponent(pdfurl)}`;

                const loadingTask = pdfjsLib.getDocument(`${pdfurl}`);

                console.log("Loading PDF from:", pdfurl);
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
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadPdf();
    }, [pdfurl]);

    return (
        <div>
            {loading ? (
                <p>Loading PDF...</p>
            )
                // : error ? (
                //     <p>Error: {error} Try refreshing your browser</p>
                // ) 
                : (
                    pages.map((page, index) => (
                        <PdfPage key={index} page={page} index={index} totalPages={pages.length} setIsScrolledToBottom={setIsScrolledToBottom} />
                    ))
                )}
        </div>
    );
};

export default CommonPdfViewer;