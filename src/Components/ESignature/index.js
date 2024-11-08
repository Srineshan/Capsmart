import React, { useState, useEffect } from "react";
import style from "./index.module.scss";
import { getValueByPath } from "../../utils/formatting";
import { useParams } from "react-router-dom";

const ESignature = ({ userName, currentDate, encData, showData, showDatais = true, isInitial, removePadding, basicForm }) => {
  const [formIndex, setFormIndex] = useState();
  const { section, step } = useParams()

  useEffect(() => {
    setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === step))
  }, [basicForm, step])

  let eSignImg = getValueByPath(
    basicForm,
    `forms[${formIndex}].data.setUpYourSignature.file`
  );
  let eSignTypeContent = getValueByPath(
    basicForm,
    `forms[${formIndex}].data.setUpYourSignature.type.text`
  );
  let eSignTypeContentStyle = getValueByPath(
    basicForm,
    `forms[${formIndex}].data.setUpYourSignature.type.style`
  );
  console.log("style", eSignTypeContentStyle);
  console.log("text", eSignTypeContent);
  return (
    <>
      <div className={removePadding ? style.signatureWithoutPadding : style.signature}>
        <div className={style.text}>
          <span>
            {isInitial
              ? "Electronically Initialed by y"
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
            ) : (
              <span style={{ fontFamily: eSignTypeContentStyle }}>
                {eSignTypeContent || ""}
              </span>
            )}
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
