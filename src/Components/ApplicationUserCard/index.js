import React, { useEffect, useState } from "react";
import { useUser } from "@descope/react-sdk";
import DefaultUserAvatar from "./../../images/defaultUserLogo.jpg";
import style from "./index.module.scss";
import { GET } from "../../Screens/dataSaver";
import { useParams } from "react-router-dom";
import PhoneIcon from "../../images/phoneIcon.png";
import MailIcon from "../../images/mailIcon.png";

const ApplicationUserCard = ({ user, applyingFor }) => {
  const userDetails = useUser();
  // console.log(userDetails)
  const [basicForm, setBasicForm] = useState({});
  const [profilePic, setProfilePic] = useState("");
  const [formIndex, setFormIndex] = useState();
  const { applicationId, section, step } = useParams()
  useEffect(() => {
    getPreApplication();
  }, []);

  useEffect(() => {
    setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc"))
  }, [basicForm, step])

  useEffect(() => {
    const profilePicData = basicForm?.forms?.[formIndex]?.data?.table?.find(doc => doc?.documentType === 'Profile Picture');
    setProfilePic(
      (profilePicData !== null && profilePicData !== undefined) ? profilePicData?.fileURL : ""
    );
  }, [basicForm, formIndex])

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${applicationId}`
      // `application-management-service/application/67b8140e3d08146b499af66c`
    );
    setBasicForm(basicForm);
    setFormIndex(basicForm?.forms?.findIndex(data => data?.schemaCategory === "UploadYourDoc"))
    // let profilePicData =
    //   basicForm?.forms?.[formIndex]?.data?.table !== null && basicForm !== undefined
    //     ? basicForm?.applicant?.profilePicture
    //     : null;
    // const profilePicData = basicForm?.forms?.[formIndex]?.data?.table?.find(doc => doc?.documentType === 'profile picture');
    // setProfilePic(
    //   (profilePicData !== null && profilePicData !== undefined) ? profilePicData?.fileURL : ""
    // );
    // console.log(profilePicData, "pic");
  };
  return (
    <div className={`${style.applicationUserCard} ${style.profileGrid} ${style.rowSpaceBetween}`}>
      {basicForm?.applicant?.name?.firstName !== undefined && (
        <>
          {(profilePic !== "" && profilePic) ? (
            <div >
              <img
                src={profilePic}
                alt="Profile Pic"
                className={style.profilePic}
              />
            </div>
          ) : (
            <div >
              <img
                src={DefaultUserAvatar}
                alt="Profile Pic"
                className={style.profilePic}
              />
            </div>
            // <div >
            //     <div className={`${style.photoText} ${style.verticalAlignCenter}`}>Photo</div>
            // </div>
          )}
          <div
          // className={style.contentText}
          >
            <div
              className={`${style.nameStyle}`}
            >{`${basicForm?.applicant?.name?.firstName} ${basicForm?.applicant?.name?.lastName}`}</div>
            <div
              className={`${style.applyingFor}`}
            >{`Applying As ${basicForm?.basicDetailReferences?.applicantType?.serviceProviderType}`}</div>
            <div className={`${style.displayInRow} ${style.marginTop5} ${style.cursorPointer}`} onClick={() => window.location.href = `mailto:${basicForm?.basicDetails?.applicant?.email?.officialEmail}`}><img src={MailIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft} ${style.purpleText}`}> {basicForm?.basicDetails?.applicant?.email?.officialEmail}</span> </div>
            <div className={`${style.displayInRow} ${style.marginTop5}`}><img src={PhoneIcon} alt="" className={style.iconStyle} /><span className={`${style.contactStyle} ${style.marginLeft}`}> {basicForm?.basicDetails?.applicant?.cellPhone}</span> </div>
            {/* <div className={`${style.connectToLinkedIn} ${style.marginTop10}`}>Connect To LinkedIn</div> */}
          </div>
        </>
      )
      }
    </div >
  );
};

export default ApplicationUserCard;
