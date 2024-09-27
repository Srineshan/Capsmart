import React, { useState } from 'react';
import ESignImg from "./../../images/eSign.png";
import ESignEmptyImg from "./../../images/eSignEmpty.png";
import style from './index.module.scss'

const ESignature = ({ userName, currentDate, encData, showData, showDatais = true, isInitial }) => {
    const [isClicked, setIsClicked] = useState(false);
    return (
        <>
            {/* <div className={style.marginTop}>
                <img src={isClicked ? ESignImg : ESignEmptyImg} alt="" className={style.esign} onClick={() => setIsClicked(!isClicked)} />
            </div> */}
            {/* <div className={style.eSignBox}>
                <div className={`${style.boxContainer} ${showDatais ? style.boxBorder : ''}`}>
                    <div className={style.userName} style={{ fontFamily: "'Shadows Into Light', cursive", fontSize: "22px", color: "black" }}>
                        {showData ? userName : ""}
                    </div>
                </div>

                <div className={style.signedBy}>
                    <span>Electronically Signed By</span>
                </div>

                <div className={style.encData}>
                    {!showData ? "" : (encData && encData.length > 0 ? `${encData.substring(0, 35)}.....` : "")}
                </div>
            </div> */}
            <div className={style.signature}>
                <div className={style.text}>
                    <span>{isInitial ? 'Electronically Initialed by' : 'Electronically Signed by'}</span>
                </div >
                <div className={`${style.boxContainer} ${style.border}`} >
                    <div className={style.userDetails} >
                        {!showData ? (
                            <span> {isInitial ? 'Click To Electronically Initial' : 'Click To Electronically Sign'}</span>
                        ) : (
                            <span className={style.userName}>{userName}</span>
                        )}
                    </div >
                </div >
                <div className={style.signatureData}>
                    {showData
                        ? encData && encData.length > 0
                            ? `${encData.substring(0, 25)}.....`
                            : ""
                        : ""}
                </div>
            </div >
        </>
    )
}

export default ESignature;