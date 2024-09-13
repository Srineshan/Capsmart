import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

const PdfPage = ({ page, index }) => {
    const canvasRef = useRef(null);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
        if (!inView) return;

        const render = async () => {
            const viewport = page.getViewport({ scale: 1.5 });
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
    }, [inView, page, index]);

    return (
        <div ref={ref} style={{ marginBottom: "20px" }}>
            <canvas ref={canvasRef}></canvas>
            <p>Sign below</p>
        </div>
    );
};

export default PdfPage;
