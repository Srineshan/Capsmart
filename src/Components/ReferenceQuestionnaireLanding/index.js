import React, { useEffect, useState } from "react";
import { Dialog } from "@blueprintjs/core";
import style from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { GET } from "../../Screens/dataSaver";
import { isBefore, subDays, differenceInDays, addDays } from 'date-fns';
import Cookies from "universal-cookie";

const ReferenceQuestionnaireLanding = ({ getIsOpen, days, applicantName, formId, referenceSchemaCategory, referenceForm }) => {
  const [isContinue, setIsContinue] = useState(false);
  const navigate = useNavigate();
  const { applicationId, referenceId } = useParams();
  const [logo, setLogo] = useState(null);
  let cookie = new Cookies();
  const title = sessionStorage.getItem('title')
  const sentTimeStamp = referenceForm?.referenceDetails?.notificationLogs[referenceForm?.referenceDetails?.notificationLogs?.length - 1]?.timestamp;
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

  useEffect(() => {
    if (sentTimeStamp)
      hasCrossedDeadline(sentTimeStamp)
  }, [sentTimeStamp])

  const hasCrossedDeadline = (dateValue) => {
    setIsContinue(isBefore(
      new Date(dateValue),
      subDays(new Date(), 7)
    ))
  };

  return referenceForm?.referenceDetails?.responded ? (
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
          <div className={style.welcomeText}>Professional Reference Submitted Successfully</div>
          <div className={`${style.welcomeSubText} ${style.marginTop10}`}>
            {`You have successfully completed the Professional Reference Questionnaire for ${applicantName}.`}
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            Thank you for taking the time to provide your professional reference. No further action is required at this time.
          </div>
          <div className={`${style.authorizationCard} ${style.marginTop} ${style.authorizationText}`}>
            The applicant's <strong> Authorization for Release of Information Form </strong> is available for you to view. <a href={referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.uploadedFiles?.length !== 0 ? referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.[0]?.uploadedFiles?.[referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.[0]?.uploadedFiles?.length - 1]?.fileURL : "#"} target="_blank">(Click here)</a>
          </div>
        </div>
        <div
          className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
        >
          <div className={`${style.verticalAlignCenter} ${style.alignCenter}`}>
          </div>
        </div>
      </div>
    </Dialog>
  ) : !isContinue ? (
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
          <div className={style.welcomeText}>Thank you for your time</div>
          <div className={`${style.welcomeSubText} ${style.marginTop10}`}>
            {`You have been invited to complete a Professional Reference Questionnaire for ${applicantName}.`}
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            Your name and contact was provided by {applicantName}, who is currently applying for a staff position at  {title ? title : ''}.
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            {title ? title : ''} uses CAPManager, an automated credentialing & privileging system, to securely manage a paperless reference verification process.
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            The questionnaire should take only a few minutes to complete. We would greatly appreciate your assistance in providing a professional reference for this applicant.
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
          <div className={`${style.authorizationCard} ${style.marginTop} ${style.authorizationText}`}>
            The applicant's <strong> Authorization for Release of Information Form </strong> is available for you to view. <a href={referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.uploadedFiles?.length !== 0 ? referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.[0]?.uploadedFiles?.[referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.[0]?.uploadedFiles?.length - 1]?.fileURL : "#"} target="_blank">(Click here)</a>
          </div>
        </div>
        <div
          className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
        >
          <div className={`${style.verticalAlignCenter} ${style.alignCenter}`}>
            <div className={style.textStyle}>{"FOR SECURITY PURPOSES THIS LINK WILL EXPIRE IN"}</div>
            <div className={style.daysCountStyle}>{differenceInDays(
              addDays(new Date(sentTimeStamp), 7),
              new Date()
            ) || 7}</div>
            <div className={`${style.textStyle}`}>{"DAYS"}</div>
          </div>
        </div>
      </div>
    </Dialog>
  ) : (
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
          <div className={style.welcomeText}>This Link Has Expired</div>
          <div className={`${style.welcomeSubText} ${style.marginTop10}`}>
            {`The link you used to access the Professional Reference Questionnaire is no longer valid.`}
          </div>
          <div className={`${style.descriptionStyle} ${style.marginTop}`}>
            For security reasons, reference links expire after a limited time.
          </div>
          <div className={`${style.authorizationCard} ${style.marginTop} ${style.authorizationText}`}>
            If you still need to complete the questionnaire, please contact the applicant or the organization that requested the reference to receive a new link.
            {/* <a href={referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.uploadedFiles?.length !== 0 ? referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.[0]?.uploadedFiles?.[referenceForm?.forms?.filter(data => data?.schemaCategory === 'ScheduleB')?.[0]?.uploadedFiles?.length - 1]?.fileURL : "#"} target="_blank">(Click here)</a> */}
          </div>
        </div>
        <div
          className={`${style.daysToCompleteCard} ${style.marginTop} ${style.displayInRow} ${style.alignCenter}`}
        >
          <div className={`${style.verticalAlignCenter} ${style.alignCenter}`}>
          </div>
        </div>
      </div>
    </Dialog>
  )
};

export default ReferenceQuestionnaireLanding;
