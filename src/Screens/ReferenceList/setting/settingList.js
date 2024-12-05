import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../../Components/Navbar";
import SideBar from "../../../Components/Sidebar";
import style from "./../index.module.scss";
import LevelTwoHeader from "../../../Components/LevelTwoHeader";
import { TenantID, POST, GET } from "../../dataSaver";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../../utils/formatting";

const SettingList = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [applicationValidity, setApplicationValidity] = useState("NORMAL_CALENDAR_YEAR"); 
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getEntity();
  }, []);

  useEffect(() => {
    if (entityId) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const handleInputChange = (e) => {
    setApplicationValidity(e.target.value); 
  };

  const handleSubmit = async () => {
    if (!applicationValidity) {
      alert("Please select a valid option for application validity.");
      return;
    }

    setIsSubmitting(true);
    try {
      await POST(
        "entity-service/entitySetting",
        {
          applicationValidity, 
        },
        {
          headers: {
            "X-tenantID": TenantID,
            "Content-Type": "application/json",
          },
        }
      );
      setResponseMessage("Setting saved successfully!");
      // Hide the response message after 2 seconds
      setTimeout(() => {
        setResponseMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error saving setting:", error);
      setResponseMessage("Failed to save setting.");
      setTimeout(() => {
        setResponseMessage("");
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEntity = async () => {
    const { data: entity } = await GET(`entity-service/entity`);
    setEntityId(entity?.[0]?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.departments?.lastModified);
    setLastUpdatedDate(
      `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
    );
  };

  return (
    <Fragment>
      <Navbar />
      <div className={style.margin20}>
        <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid}`}>
          <div>
            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
              <div></div>
            </SideBar>
          </div>
          <div>
            <LevelTwoHeader
              heading="Setting List"
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path="/Screens/ReferenceList/customerAdminDashboard"
              callingFrom="Customer Admin"
              needHeader={true}
              tileType="Applicant"
            />
            <div className={style.marginTop55}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.fieldContainer}>
                    <label htmlFor="applicationValidity" className={style.entityLabelStyle}>
                      Application Validity
                    </label>
                    <select
                      id="applicationValidity"
                      value={applicationValidity}
                      onChange={handleInputChange}
                      className={style.inputField}
                    >
                      <option value="NORMAL_CALENDAR_YEAR">Normal Calendar Year</option>
                      <option value="APPLICATION_CALENDAR_YEAR">Application Calendar Year</option>
                    </select>
                    <div className={style.actionButtonContainer}>
                      <button
                        onClick={handleSubmit}
                        className={style.submitButton}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Save Setting"}
                      </button>
                    </div>
                    {responseMessage && (
                      <div className={style.responseMessage}>
                        {responseMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SettingList;
