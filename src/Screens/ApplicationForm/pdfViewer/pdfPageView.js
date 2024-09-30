import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import ESign from "../../../Components/ESign";
import ESignature from "../../../Components/ESignature";
import CryptoJS from 'crypto-js';
import style from './index.module.scss';

const PdfPage = ({ page, index, totalPages, name, currentDate, initialArray, setInitialArray, isSigned, setIsSigned, formData }) => {
    const canvasRef = useRef(null);
    const { ref, inView } = useInView({ triggerOnce: true });
    const publicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHA5SDu30/8uQAqqkQE0NuY4ePBptMGufG6AWnC/88YVLXi4thh7M8VU6kElVJkfXL5DwlfVnwPb08+PK1EcaOWWtp2gdQitkohjZLB9zVE+0OtRrzSc33wItf7Iwisi5dHPggHvfOp5fr+QYWFMa/kKYl3SgNo8fryeLbKKalmdAgMBAAE=-----END PUBLIC KEY-----";
    const [dateTime, setDateTime] = useState(new Date().toISOString());
    const [encryptedText, setEncryptedText] = useState(CryptoJS.AES.encrypt(name + dateTime, publicKey).toString());

    useEffect(() => {
        if (initialArray?.length === 0) {
            let temp = Array.from({ length: totalPages - 1 }, (_, index) => ({
                esign: '',
                name: '',
                signedDate: ''
            }))
            setInitialArray(temp)
        }
    }, [totalPages])
    console.log(initialArray)

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

    const handleSign = (index) => {
        setInitialArray(prevData => {
            let temp = { ...prevData };
            if (temp[index].name === '') {
                temp[index].name = (formData?.forms?.[0]?.data?.setUpYourSignature?.initial !== undefined && formData?.forms?.[0]?.data?.setUpYourSignature?.initial !== '') ? formData?.forms?.[0]?.data?.setUpYourSignature?.initial : name;
                temp[index].signedDate = currentDate;
                temp[index].esign = encryptedText;
            }
            return temp;
        });
    }

    return (
        <div style={{ marginBottom: "20px" }}>
            <canvas ref={canvasRef}></canvas>
            {index === totalPages - 1 ? (
                <div className={style.twoCol}>
                    <div onClick={() => { setIsSigned(!isSigned) }}>
                        <ESignature
                            userName={isSigned ? name : ""}
                            encData={isSigned ? encryptedText : ''}
                            showData={isSigned}
                            showDatais={true}
                        />
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <div className={style.displayInRow}>
                            <div className={style.dateTitle}>Date: </div>
                            <div className={`${style.date} ${style.marginLeft}`}>{isSigned ? formData?.forms?.[15]?.esign?.signedDate ? formData?.forms?.[15]?.esign?.signedDate : currentDate : ""}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div onClick={() => { handleSign(index) }}>
                    <ESignature
                        userName={(initialArray[index] !== undefined && initialArray[index]?.name !== '') ? initialArray[index]?.name : ""}
                        encData={(initialArray[index] !== undefined && initialArray[index]?.name !== '') ? initialArray[index]?.esign : ''}
                        showData={(initialArray[index] !== undefined && initialArray[index]?.name !== '') ? true : false}
                        showDatais={true}
                        isInitial={true}
                    />
                </div>
            )}
        </div>
    );
};

export default PdfPage;
