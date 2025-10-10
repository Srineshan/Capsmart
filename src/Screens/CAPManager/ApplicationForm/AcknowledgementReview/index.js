import React, { useEffect, useState } from "react";
import ProgressCard from "../../../../Components/ProgressCard";
import ApplicationUserCard from "../../../../Components/ApplicationUserCard";
import ApplicationAssistanceCard from "../../../../Components/ApplicationAssistanceCard";
import Pencil from "../../../../images/pencil.png";
import CommonDivider from "../../../../Components/CommonFields/CommonDivider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ApplicationFieldCard from "../../../../Components/ApplicationFieldCard";
import CommonCheckBox from "../../../../Components/CommonFields/CommonCheckBox";
import { GET, PUT, POST } from "../../../dataSaver";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { ErrorToaster, SuccessToaster } from "../../../../utils/toaster";
import WelcomeCard from "../../../../Components/WelcomeCard";
import style from "./index.module.scss";
import AIAssistantDialog from "../../../../Components/AIAssistantDialog";
import ApplicationHeader from "../../../../Components/ApplicationHeader";
import ApplicationSubmitDialog from "../../../../Components/ApplicationSubmitDialog";

const AcknowledgementReview = ({ basicForm, setBasicForm, applicationId }) => {
  const [form, setForm] = useState();
  const [form2, setForm2] = useState();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const id = sessionStorage.getItem("applicationId");

  useEffect(() => {
    getPreApplication();
    sessionStorage.setItem("fromSummary", false);
  }, []);

  const getIsOpen = (value) => {
    setIsOpen(value);
  };

  const getPreApplication = async () => {
    const { data: basicForm } = await GET(
      `application-management-service/application/${id}`
    );
    setForm(basicForm);
  };

  console.log("form", form);

  const handleContinue = () => {
    navigate(`/applicationForm/${applicationId}/section1/acknowledgementStep1`);
  };

  return (
    <div className={style.screenBackground}>
      <ApplicationHeader
        title={`New ${form?.basicDetails?.applicant?.applicantType !== undefined
          ? form?.basicDetails?.applicant?.applicantType
          : "{Applicant Type}"
          } Application For ${form?.basicDetails?.applicant?.name?.firstName !== undefined
            ? form?.basicDetails?.applicant?.name?.firstName
            : "{First Name}"
          } ${form?.basicDetails?.applicant?.name?.lastName !== undefined
            ? form?.basicDetails?.applicant?.name?.lastName
            : "{Last Name}"
          }`}
      />

      <div className={style.screenPadding}>
        <div className={`${style.applicationScreenGrid} ${style.marginTop}`}>
          <div>
            <div className={style.marginTop}>
              <WelcomeCard
                title={
                  "To Proceed with your application you are required to sign off on acknowledement,disclosure & consent forms!"
                }
              ></WelcomeCard>
            </div>

            <div
              className={`${style.applicationCardStyle}  ${style.marginTop10}`}
            >
              <div className={`${style.displayInRow}${style.marginTop20}`}>
                <div
                  className={`${style.spaceBetween} ${style.marginLeftRight20} ${style.marginTop20} ${style.marginBottom20}`}
                >
                  <span className={`${style.tableHeaderHeadingTextStyle}`}>
                    Acknowledgements, Consents & Disclosures
                  </span>
                  {/* <div
                    className={`${
                      form?.forms
                        ?.filter((data) => data?.formCategory !== "Form")
                        ?.every((item) => item.acknowledged === true)
                        ? style.greenDotStyle
                        : style.yellowDotStyle
                    }`}
                  ></div> */}
                </div>
              </div>
              <div
                className={`${style.tableHeaderStyle} ${style.marginTop10} ${style.tableHeaderGridStyle} `}
              >
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div
                    className={`${style.marginLeft30} ${style.tableHeaderTextStyle}`}
                  ></div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div className={`${style.tableHeaderTextStyle}`}>
                    Required Forms for your Applications
                  </div>
                </div>
                <div
                  className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                >
                  <div></div>
                </div>
              </div>
              {form?.formSchemas
                ?.filter((data) => data?.formCategory !== "Form")
                ?.map((data, index) => (
                  <div
                    className={`${index % 2 !== 0
                      ? style.tableDataStyle
                      : style.tableDataStyle1
                      } ${style.marginTop5} ${style.tableValueGridStyle} `}
                  >
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                    >
                      <div
                        className={`${style.marginLeft40} ${style.tableDataFontStyle1}}`}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                    >
                      <div className={`${style.tableDataFontStyle1}`}>
                        {data?.description}
                      </div>
                      {/* <img
                        src={Pencil}
                        alt=""
                        className={`${style.pencilImgStyle} ${style.justifyCenter}`}
                        onClick={() => {
                          sessionStorage.setItem("fromSummary", true);
                          navigate(
                            `/applicationForm/section1/acknowledgementStep${
                              index + 1
                            }`
                          );
                        }}
                      /> */}
                    </div>
                    <div
                      className={`${style.displayInRow} ${style.verticalAlignCenter} `}
                    >
                      {/* <div
                        className={`${
                          form?.forms?.filter(
                            (data) => data?.formCategory !== "Form"
                          )[index]?.acknowledged
                            ? style.greenDotStyle
                            : style.yellowDotStyle
                        } `}
                      ></div> */}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className={style.marginTop}>
            <ApplicationUserCard
              user={"First Mi Last"}
              applyingFor={"{Doctor} Applying As {Associate}"}
            />
            <div className={style.marginTop10}>
              <ApplicationAssistanceCard
                user={"Neena Greenly"}
                designation={"{Designation}"}
                contactNumber={"{Contact Number}"}
                email={"{Email}"}
              />
            </div>
            <div className={`${style.saveInProgress} ${style.marginTop}`}>
              SAVE IN PROGRESS
            </div>
            {/* <div
              className={`${style.continue} ${style.marginTop10}`}
              onClick={() => handleSubmitApplication()}
            >
              SUBMIT APPLICATION
            </div> */}
            <div
              className={`${style.continue} ${style.marginTop10}`}
              onClick={() => handleContinue()}
            >
              REVIEW&SIGN
            </div>
            {/* <div className={style.marginTop}>
                            <ApplicationReferenceDocuments />
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgementReview;
