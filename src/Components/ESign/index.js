import React, { useState } from 'react';
import ESignImg from "./../../images/eSign.png";
import ESignEmptyImg from "./../../images/eSignEmpty.png";
import style from './index.module.scss'

const ESign = ({ userName, encData, showData = true, showDatais = true }) => {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <div className={style.marginTop}>
            <img src={isClicked ? ESignImg : ESignEmptyImg} alt="" className={style.esign} onClick={() => setIsClicked(!isClicked)} />
        </div>
        // <div className={style.eSignBox}>
        //     <div className={`${style.boxContainer} ${showDatais ? style.boxBorder : ''}`}>
        //         <div className={style.userName} style={{ fontFamily: "'Shadows Into Light', cursive", fontSize: "22px", color: "black" }}>
        //             {showData ? userName : ""}
        //         </div>
        //     </div>

        //     <div className={style.signedBy}>
        //         <span>Electronically Signed By</span>
        //     </div>

        //     <div className={style.encData}>
        //         {!showData ? "" : (encData && encData.length > 0 ? `${encData.substring(0, 35)}.....` : "")}
        //     </div>
        // </div>
    )
}

export default ESign;