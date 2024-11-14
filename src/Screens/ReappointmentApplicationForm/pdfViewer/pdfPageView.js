import React, { useEffect, useRef } from "react";

const PdfPage = ({ page, index, totalPages, setIsScrolledToBottom }) => {
    const canvasRef = useRef(null);
    const lastDivRef = useRef(null);
    useEffect(() => {
        // if (!inView) return;

        const render = async () => {
            const viewport = page.getViewport({ scale: 1.2 });
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport,
            };

            try {
                await page.render(renderContext).promise;
                console.log(`Page ${index + 1} rendered`);
            } catch (error) {
                console.error(`Error rendering page ${index + 1}:`, error);
            }
        };

        render();
    }, [page, index]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsScrolledToBottom(true);
                }
            },
            { threshold: 1.0 } // Trigger when 100% of the last div is visible
        );

        if (lastDivRef.current) {
            observer.observe(lastDivRef.current);
        }

        return () => {
            if (lastDivRef.current) {
                observer.unobserve(lastDivRef.current);
            }
        };
    }, []);

    return (
        <div style={{ marginBottom: "20px" }}>
            <canvas ref={canvasRef}></canvas>
            {index === totalPages - 1 ? (
                <div ref={lastDivRef}></div>
            ) : (
                <div >

                </div>
            )}
        </div>
    );
};

export default PdfPage;
