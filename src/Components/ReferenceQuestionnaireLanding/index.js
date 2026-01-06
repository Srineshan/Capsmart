import React, { useEffect, useState } from "react";
import { Dialog } from "@blueprintjs/core";
import style from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { GET } from "../../Screens/dataSaver";
import Cookies from "universal-cookie";

const ReferenceQuestionnaireLanding = ({ getIsOpen, days, applicantName, formId, referenceSchemaCategory }) => {
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
  const { applicationId, referenceId } = useParams();
  const [logo, setLogo] = useState(null);
  let cookie = new Cookies();
  const title = sessionStorage.getItem('title')
  useEffect(() => {
    const getLogo = async () => {
      try {
        const { data } = await GET(`entity-service/entity/${cookie.get('entityId')}`);
        if (data && data.logo?.file?.fileURL) {
          setLogo(data.logo.file.fileURL);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    if (cookie.get('entityId')) {
      getLogo();
    }
  }, [cookie.get('entityId')]);

  return !isContinue ? (
    <Dialog
      isOpen={true}
      onClose={() => getIsOpen(false)}
      className={`${style.welcomeDialog} ${style.loginDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={style.whiteBackground}>
          <div className={style.spaceBetween}>
            <img src={logo} alt="Hospital Logo" className={`${style.logo}`} />
            <img src={'https://capmanager-dev.s3.us-east-1.amazonaws.com/CAP_Manager.png'} alt="CAPManager Logo" className={`${style.CAPSmartLogo}`} />
          </div>
          <div className={style.welcomeText}>Welcome to {title ? title : ''}!</div>
          <div className={`${style.welcomeSubText} ${style.marginTop10}`}>
            {`You have a Professional Reference Questionnaire to complete for ${applicantName}`}
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            Your name and contact was provided by the applicant that is applying for a staff position at  {title ? title : ''}.
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {title ? title : ''} uses an automated credentialing & privileging software that digitizes the reference questionnaire completion workflow. This questionnaire should take you just a few minutes to complete.
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            We would greatly appreciate if you could complete the reference check for the applicant.
          </div>
          <div className={style.alignCenter}>
            <div
              className={`${style.continue} ${style.marginTop}`}
              onClick={() => {
                navigate(`${formId}/${btoa(referenceSchemaCategory)}`)
              }}
            >
              CONTINUE
            </div>
          </div>
        </div>
        <div
          className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
        >
          <div className={`${style.verticalAlignCenter} ${style.alignCenter}`}>
            <div className={style.textStyle}>{"YOU HAVE"}</div>
            <div className={style.daysCountStyle}>{days || 30}</div>
            <div className={`${style.textStyle}`}>{"DAYS TO COMPLETE"}</div>
          </div>
        </div>
      </div>
    </Dialog>
  ) : ('')
};

export default ReferenceQuestionnaireLanding;
