import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import style from "./index.module.scss";
import { Icon, Intent } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import { GET, TenantID } from "../dataSaver";
import { format } from "date-fns";

const ClientAdminDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState([]);
  const [entityId, setEntityId] = useState("");
  const [latestParentDate, setLatestParentDate] = useState("");

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getReferenceListEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity/${TenantID}`);
    setEntityId(entity?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
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
    setLatestParentDate(format(date, "MMM d, yyyy HH:mm"));
  };

  useEffect(() => {
    getReferenceListEntity();
  }, []);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

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
                {`UPDATED ON ${latestParentDate}`}
              </div>
              <Link to={"/entitySitePortal"}>
                <div className={style.crossStyle}>
                  <Icon icon="cross" size={25} intent={Intent.DANGER} />
                </div>
              </Link>
            </div>
            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.grid4}>
                    <Link
                      to={"/referenceList/departmentsForCustomers"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          DEPARTMENTS / SERVICE AREAS BY ENTITY / SITE
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            STANDARD LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.departments?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/absenceReasonsForCustomer"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          ABSENCE REASONS
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span
                            className={`${style.dashboardCardColorOption3}`}
                          >
                            MY CUSTOM LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.absenceResons?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/suffixByCustomer"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          NAME SUFFIX
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            STANDARD LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.nameSuffix?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/referenceList/contractServiceProviderBySiteType"
                      className={style.linkStyle}
                    >
                      {" "}
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          CONTRACTED SERVICE PROVIDERS BY ENTITY / SITE TYPES
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            STANDARD LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.contractedServiceProviders?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className={style.margin20}>
                  <div className={style.grid4}>
                    <Link
                      to={"/referenceList/functionalTitleForCustomer"}
                      className={style.linkStyle}
                    >
                      {" "}
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            STANDARD LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.functionalTitles?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/referenceList/contractTerminationReasonForCustomer"
                      className={style.linkStyle}
                    >
                      {" "}
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          CONTRACT TERMINATION REASONS BY ENTITY TYPE
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            STANDARD LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.terminationReason?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className={style.dashboardCardStyle}>
                      <h5 className={`${style.headingForReferenceList}`}>
                        PROOF OF DOCUMENTATION BY ENTITY TYPE
                      </h5>
                      <div
                        className={`${style.dashboardInsideCardStyle} ${style.marginTop30}`}
                      >
                        <span className={style.dashboardCardColorOption4}>
                          SETUP REQUIRED
                        </span>
                      </div>
                    </div>
                    <Link
                      to={"/referenceList/contractedServicesByEntityType"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          CONTRACTED SERVICES BY ENTITY TYPE
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            STANDARD LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.contractedService?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className={style.margin20}>
                  <div className={style.grid4}>
                    <Link
                      to={"/referenceList/holidayScheduleForCustomers"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          HOLIDAY LIST BY ENTITY TYPE
                        </h5>
                        <div
                          className={`${style.optionsStyle} ${style.displayInCol}`}
                        >
                          <span className={style.dashboardCardColorOption1}>
                            STANDARD LIST IN USE
                          </span>
                          <span className={style.dashboardCardColorOption2}>
                            {`LAST UPDATED ON ${new Date(
                              lastUpdatedDate.holidayList?.lastModified
                            )
                              .toLocaleString("en-US", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "long",
                              })
                              .toUpperCase()}`}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={
                        "/referenceList/contractDocumentTypeUploadForCustomer"
                      }
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          CONTRACT DOCUMENT TYPES FOR UPLOAD BY ENTITY TYPE
                        </h5>
                        <div
                          className={`${style.dashboardInsideCardStyle} ${style.marginTop30}`}
                        >
                          <span className={style.dashboardCardColorOption4}>
                            SETUP REQUIRED
                          </span>
                        </div>
                      </div>
                    </Link>
                    <Link
                      to={"/referenceList/organizationCostCenters"}
                      className={style.linkStyle}
                    >
                      <div className={style.dashboardCardStyle}>
                        <h5 className={`${style.headingForReferenceList}`}>
                          ORGANIZATION COST CENTERS & SERVICE LOCATIONS
                        </h5>
                        <div
                          className={`${style.dashboardInsideCardStyle} ${style.marginTop30}`}
                        >
                          <span className={style.dashboardCardColorOption4}>
                            SETUP REQUIRED
                          </span>
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
          <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI</p>
        </div>
      </div>
    </Fragment>
  );
};

export default ClientAdminDashboard;
