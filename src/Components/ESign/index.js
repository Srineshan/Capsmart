import React, { useState } from 'react';
import ESignImg from "./../../images/eSign.png";
import ESignEmptyImg from "./../../images/eSignEmpty.png";
import style from './index.module.scss'

const ESign = () => {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <div className={style.marginTop}>
            <img src={isClicked ? ESignImg : ESignEmptyImg} alt="" className={style.esign} onClick={() => setIsClicked(!isClicked)} />
        </div>
        // <div className={style.signatureContainer}>
        //     <div className={style.signatureBorder}>
        //         <div className={style.signatureDetails}>
        //             <p className={style.signedBy}>Electronically Signed by</p>
        //             <p className={style.signatureName}>B. Martins</p>
        //             <p className={style.signatureId}>03778#873709gch5439009vsdj</p>
        //         </div>
        //     </div>
        //     <div className={style.signatureDate}>01-04-2023</div>
        // </div>
    )
}

export default ESign;