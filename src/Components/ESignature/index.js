import React, { useState, useEffect } from "react";
import style from "./index.module.scss";
import { corsUrl, getValueByPath } from "../../utils/formatting";
import { GET } from "../../Screens/dataSaver";
import { useParams } from "react-router-dom";

const ESignature = ({ userName, currentDate, encData, showData, showDatais = true, isInitial, removePadding, basicForm, alternateSignature, alternateDrawSignature }) => {
  const [formIndex, setFormIndex] = useState();
  const [applicationId, setApplicationId] = useState(
    sessionStorage.getItem("applicationId")
  );
  const [form, setForm] = useState();
  const { section, step } = useParams()


  useEffect(() => {
    setFormIndex(form?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc"))
    // getPreApplication();
  }, [form])

  useEffect(() => {
    // setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc"))
    getPreApplication();
  }, [])

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
    );
    setForm(basicForm);
  }

  // let eSignImg = getValueByPath(
  //   basicForm,
  //   `forms[${formIndex}].data.setUpYourSignature.file`
  // );

  let eSignImg = form?.forms?.[formIndex]?.data?.setUpYourSignature?.file
  // let eSignTypeContent = getValueByPath(
  //   basicForm,
  //   `forms[${formIndex}].data.setUpYourSignature.type.text`
  // );
  let eSignTypeContent = form?.forms?.[formIndex]?.data?.setUpYourSignature?.type?.text
  let eSignTypeContentStyle = getValueByPath(
    basicForm,
    `forms[${formIndex}].data.setUpYourSignature.type.style`
  );
  console.log("stylesign", eSignTypeContentStyle);
  console.log("textsign", eSignTypeContent);
  console.log("Esign", eSignImg);
  console.log("formIndex", form)
  return (
    <>
      <div className={removePadding ? style.signatureWithoutPadding : style.signature}>
        <div className={style.text}>
          <span>
            {isInitial
              ? "Electronically Initialed by y"
              : "eSign by"}
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
            ) : (eSignImg && !alternateSignature) ? (
              <img
                src={`${corsUrl}/${eSignImg?.fileURL}`}
                alt="Signature"
                className={style.eSignImg}
              />
            ) : (alternateDrawSignature?.file) ? (
              <img
                src={`${corsUrl}/${alternateDrawSignature?.file?.fileURL}`}
                alt="Signature"
                className={style.eSignImg}
              />
            ) : (
              <span style={{ fontFamily: eSignTypeContentStyle }} className={style.userName}>
                {(alternateSignature && alternateSignature !== 'undefined') ? alternateSignature : eSignTypeContent || ""}
              </span>
            )}
            {/* {!showData ? (
              <span>
                {isInitial
                  ? "Click To Electronically Initial"
                  : "Click To Electronically Sign"}
              </span>
            ) : eSignTypeContent ? (
              <span style={{ fontFamily: eSignTypeContentStyle }} className={style.userName}>
                {eSignTypeContent || ""}
              </span>
            )  : eSignImg ? (
              <img
                src={eSignImg?.fileURL}
                alt="Signature"
                className={style.eSignImg}
              />  
            ): null} */}
          </div>
        </div>
        <div className={style.signatureData}>
          {showData && encData && encData.length > 0
            ? ` ${encData.substring(0, 15)}.....`
            : ""}
        </div>
      </div>
    </>
  );
  // return (
  //   <>
  //     <div className={style.signature}>
  //       <div className={style.text}>
  //         <span>{isInitial ? 'Electronically Initialed by' : 'Electronically Signed by'}</span>
  //       </div >
  //       <div className={`${style.boxContainer} ${style.border}`} >
  //         <div className={style.userDetails} >
  //           {!showData ? (
  //             <span> {isInitial ? 'Click To Electronically Initial' : 'Click To Electronically Sign'}</span>
  //           ) : (
  //             <span className={style.userName}>{userName}</span>
  //           )}
  //         </div >
  //       </div >
  //       <div className={style.signatureData}>
  //         {showData
  //           ? encData && encData.length > 0
  //             ? `${encData.substring(0, 25)}.....`
  //             : ""
  //           : ""}
  //       </div>
  //     </div >
  //   </>
  // )

};


export default ESignature;
