import React from "react";
import style from "./index.module.scss";
import { getValueByPath } from "../../utils/formatting";

const ESignature = ({
  currentDate,
  encData,
  showData,
  showDatais = true,
  isInitial,
  basicForm,
  selectedESignTypeStyle,
  eSignType,
}) => {
  let eSignImg = getValueByPath(
    basicForm,
    "forms[0].data.setUpYourSignature.file"
  );
  let eSignTypeContent = getValueByPath(
    basicForm,
    "forms[0].data.setUpYourSignature.type.text"
  );
  let eSignTypeContentStyle = getValueByPath(
    basicForm,
    "forms[0].data.setUpYourSignature.type.style"
  );
  console.log("awsedrfgth", selectedESignTypeStyle);
  console.log("text", eSignType);
  return (
    <>
      <div className={style.signature}>
        <div className={style.text}>
          <span>
            {isInitial
              ? "Electronically Initialed by"
              : "Electronically Signed by"}
          </span>
        </div>
        <div
          className={`${style.boxContainer} ${showDatais ? style.border : ""}`}
        >
          <div className={style.userDetails}>
            {!showData ? (
              <span>
                {isInitial
                  ? "Click To Electronically Initial"
                  : "Click To Electronically Sign"}
              </span>
            ) : eSignImg ? (
              <img
                src={eSignImg?.fileURL}
                alt="Signature"
                className={style.eSignImg}
              />
            ) : eSignTypeContent ? (
              <span
                // className={style.userName}
                style={{ fontFamily: eSignTypeContentStyle }}
              >
                {eSignType}
              </span>
            ) : null}
          </div>
        </div>
        <div className={style.signatureData}>
          {showData && encData && encData.length > 0
            ? ` ${encData.substring(0, 35)}.....`
            : ""}
        </div>
      </div>
    </>
  );
};

export default ESignature;
