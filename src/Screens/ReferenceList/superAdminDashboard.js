import React, { Fragment, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import style from "./index.module.scss";
import { Icon, Intent } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import NewPodTypeForHealthcare from "./newPodTypeForHealthCare";
import { GET } from "../dataSaver";
// import { format } from "date-fns";
import { format } from "date-fns-tz";

const SuperAdminDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState([]);
  const [latestParentDate, setLatestParentDate] = useState("");

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getReferenceList = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );
    setLastUpdatedDate(lastModifiedDate);

    //Parent LastModifiedDate get value
    const mappedDataArray = [];
    for (const key in lastModifiedDate) {
      const mappedData = {
        ...lastModifiedDate[key],
      };
      mappedDataArray.push(mappedData);
    }

    let latestParentModifiedDate = mappedDataArray.reduce((a, b) => {
      return new Date(a.lastModified) > new Date(b.lastModified) ? a : b;
    });

    const date = new Date(latestParentModifiedDate?.lastModified);
    console.log(date.toLocaleString());
    // console.log(format(date, "MMM d, yyyy HH:mm zzzz"));
    setLatestParentDate(format(date, "MMM d, yyyy HH:mm"));
  };

  useEffect(() => {
    getReferenceList();
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div className={style.margin20}>
        <div
          className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid}`}
        >
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
              <div></div>
            </SideBar>
          </div>

          <div>
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                REFERENCE LIST
              </div>
              <div
                className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}
              >
                {/* UPDATED ON FEB 16, 2022 16:45 EST */}
                {`LAST UPDATED ON ${latestParentDate} `}
              </div>
              <div className={style.crossStyle}>
                <Link to={"/partnerPortal"}>
                  <Icon icon="cross" size={25} intent={Intent.DANGER} />
                </Link>
              </div>
            </div>
            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.grid4}>
                    <Link
                      to={"/referenceList/industriesWithEntityTypes"}
                      className={style.linkStyle}
                    >
                      <div className={`${style.dashboardCardStyle}`}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          INDUSTRIES SUPPORTED WITH ENTITY TYPES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(lastUpdatedDate?.industries?.lastModified)
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/departmentsByEntityTypes"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          DEPARTMENTS / SERVICE AREAS BY ENTITY TYPES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(lastUpdatedDate.departments?.lastModified)
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={
                        "/referenceList/contractedServiceProviderByIndustries"
                      }
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          CONTRACTED SERVICE PROVIDERS BY INDUSTRY & ENTITY
                          TYPES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(
                              lastUpdatedDate.contractedServiceProviders?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}{" "}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/functionalTitles"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(
                              lastUpdatedDate.functionalTitles?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}{" "}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/boardCertification"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(
                              lastUpdatedDate.boardCertification?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}{" "}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/absenseReasonsByIndustries"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          ABSENCE REASONS BY INDUSTRY TYPE
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(
                              lastUpdatedDate.absenceResons?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}{" "}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/suffixByIndustries"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          NAME SUFFIX BY INDUSTRY TYPE
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(lastUpdatedDate.nameSuffix?.lastModified)
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/terminationReasons"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          TERMINATION REASONS BY ENTITY TYPE
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(
                              lastUpdatedDate.terminationReason?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}{" "}
                          </span>
                        </div>
                      </div>
                    </Link>
                    {/* <Link
                      to={"/referenceList/proofOfDocumentByEntity"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          PROOF OF DOCUMENTATION BY INDUSTRIES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <div className={`${style.dashboardInsideCardStyle} `}>
                            <span className={style.dashboardCardColorOption4}>
                              DEFAULT LIST SETUP REQUIRED
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link> */}
                    <div className={style.dashboardCardStyle}>
                      <h5 className={`${style.headingForReferenceList}`}>
                        CONTRACTED SERVICES BY INDUSTRIES
                      </h5>
                      <div
                        className={`${style.optionsStyle} ${style.displayInCol}  `}
                      >
                        <div className={`${style.dashboardInsideCardStyle} `}>
                          <span className={style.dashboardCardColorOption4}>
                            DEFAULT LIST SETUP REQUIRED
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={"/referenceList/holidayListByIndustries"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          HOLIDAY LIST BY INDUSTRIES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            DEFAULT LIST IS CREATED
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            LAST UPDATED ON{" "}
                            {new Date(lastUpdatedDate.holidayList?.lastModified)
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}{" "}
                          </span>
                        </div>
                      </div>
                    </Link>
                    {/* <Link
                      to={"/referenceList/contractDoumentTypeForUpload"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          CONTRACT DOCUMENT <br /> TYPE FOR UPLOAD
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <div className={`${style.dashboardInsideCardStyle} `}>
                            <span className={style.dashboardCardColorOption4}>
                              DEFAULT LIST SETUP REQUIRED
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link> */}
                    <Link
                      to={"/referenceList/countriesSupportedWithStates"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          COUNTRIES SUPPORTED WITH <br /> STATES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}  `}
                        >
                          <div className={`${style.dashboardInsideCardStyle} `}>
                            <span className={style.dashboardCardColorOption4}>
                              DEFAULT LIST SETUP REQUIRED
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
        </div>
      </div>
      {/* {showPodTypeForHealthcareDialog && (
                <NewPodTypeForHealthcare getPodTypeForHealthcareDialog={getPodTypeForHealthcareDialog} />
            )} */}
    </Fragment>
  );
};

export default SuperAdminDashboard;
