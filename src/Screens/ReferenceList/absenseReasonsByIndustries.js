import React, { Fragment, useEffect, useState } from "react";
import style from "./index.module.scss";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditBlue from "./../../images/editBlue.png";
import EditHcRow from "./../../images/editHcRow.png";
import AddAbsenseReasonsForHealthcare from "./addAbsenseReasonsForHealthcare";
import { GET, DELETE } from "./../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import format from "date-fns/format";
import Navbar from "../../Components/Navbar";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import SideBar from "../../Components/Sidebar";
import { formatInTimeZone } from "date-fns-tz";

const AbsenseReasonsByIndustries = () => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [sideMenu, setSideMenu] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [tableEntityData, setTableEntityData] = useState([]);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [selectedAbsence, setSelectedAbsence] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [absenceDataList, setAbsenceDataList] = useState([]);

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    if (industryId !== "" && industryId !== undefined) {
      getAllAbsenceData();
    }
  }, [industryId]);

  const getIndustryData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    setSelectedTitle(industryData?.[0]?.industry);
    setIndustryId(industryData?.[0]?.id);
    setSideMenu(industryData);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.absenceResons?.lastModified);
    setLastUpdatedDate(
      formatInTimeZone(date, "America/New_York", "MMM d, yyyy HH:mm zzz")
    );
  };

  const getEntityData = async () => {
    const { data: entities } = await GET(
      `entity-service/absenceReasonMaster?industryId=${industryId}`
    );
    setTableEntityData(entities);
  };

  const getAllAbsenceData = async () => {
    const { data: AbsenceData } = await GET(
      `entity-service/absenceReasonMaster`
    );
    setAbsenceDataList(AbsenceData);
  };

  const deleteHandler = (data) => {
    setDeleteEntityId(data?.id);
    setShowDeleteConfirmation(true);
  };

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
  };

  const getDeleteConfirmation = (value) => {
    if (value) {
      deleteEntity(deleteEntityId);
    }
  };

  const deleteEntity = async (id) => {
    await DELETE(`entity-service/absenceReasonMaster/${id}`)
      .then((response) => {
        SuccessToaster("Absence Deleted Successfully");
        // getEntityData();
        getAllAbsenceData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const getCountValue = (id) => {
    let countValue = absenceDataList?.filter(
      (entity) => entity?.industryId?.id === id
    );
    return countValue?.length;
  };

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
            <LevelTwoHeader
              heading={`ABSENCE REASONS BY INDUSTRIES`}
              updatedTime={`UPDATED ON ${lastUpdatedDate} `}
              path={"/Screens/ReferenceList/superAdminDashboard"}
              callingFrom={"Super Admin"}
              needHeader={true}
              getAddEntityDialog={getAddEntityDialog}
              Title={"ADD ABSENSE REASONS"}
            />

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.departmentCardColumnsGrid}>
                    <div className={style.displayInCol}>
                      {sideMenu?.map((data) => {
                        return (
                          <div
                            className={
                              data?.industry === selectedTitle
                                ? `${style.industriesCardStyle} ${style.selectedIndustriesBackground} ${style.marginTop10}`
                                : `${style.industriesCardStyle} ${style.marginTop10}`
                            }
                            onClick={() => {
                              // SelectedHandler(data);
                              setSelectedTitle(data?.industry);
                              setIndustryId(data?.id);
                            }}
                          >
                            <div className={style.spaceBetween}>
                              <p className={style.industriesCardTextStyle1}>
                                {data.industry}
                              </p>
                              <p className={style.industriesCardTextStyle1}>
                                {/* {data.absenceReason.length} */}
                                {getCountValue(data?.id)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={style.industriesEntityCardStyle}>
                      <div className={style.tableHeaderIndustriesEntity}>
                        <p
                          className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
                        >
                          {`ABSENCE REASONS FOR ${selectedTitle}`}
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}></p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          LAST UPDATED
                        </p>
                      </div>
                      {absenceDataList?.filter(
                        (data) =>
                          data?.industryId?.id === industryId &&
                          data.absenceType === "PLANNED"
                      ).length !== 0 ? (
                        <div className={style.terminationHeader}>
                          <img
                            src={IndustriesEntityFolder}
                            alt="IndustriesEntityFolder"
                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                          />
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            PLANNED
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}

                      {absenceDataList
                        ?.filter(
                          (data) =>
                            data?.industryId?.id === industryId &&
                            data.absenceType === "PLANNED"
                        )
                        .map((data, innerIndex) => {
                          return (
                            <>
                              <div
                                className={
                                  innerIndex % 2 !== 0
                                    ? `${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                    : `${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                }
                              >
                                <p className={style.tableDataFontStyle}>
                                  {data.absenceReason}
                                </p>
                                <p className={style.tableDataFontStyle}>
                                  {/* {`${data.notificationPeriod.numberOfDays}`} Days Prior */}
                                </p>
                                <p className={style.tableDataFontStyle}>
                                  {formatInTimeZone(
                                    new Date(`${data.lastModifiedDate}`),
                                    "America/New_York",
                                    "MM-dd-yyyy"
                                  )}
                                </p>
                                <img
                                  src={EditHcRow}
                                  onClick={() => {
                                    getAddEntityDialog(true);
                                    setIsEdit(true);
                                    setSelectedAbsence(data);
                                  }}
                                  className={style.colorFileStyle}
                                  alt=""
                                />
                                <img
                                  src={DeleteHcRow}
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    deleteHandler(data);
                                  }}
                                  alt=""
                                />
                              </div>
                            </>
                          );
                        })}

                      {absenceDataList?.filter(
                        (data) =>
                          data?.industryId?.id === industryId &&
                          data.absenceType === "UNPLANNED"
                      ).length !== 0 ? (
                        <div className={style.terminationHeader}>
                          <img
                            src={IndustriesEntityFolder}
                            alt="IndustriesEntityFolder"
                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                          />
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            UNPLANNED
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}

                      {absenceDataList
                        ?.filter(
                          (data) =>
                            data?.industryId?.id === industryId &&
                            data.absenceType === "UNPLANNED"
                        )
                        .map((data, innerIndex) => {
                          return (
                            <>
                              <div
                                className={
                                  innerIndex % 2 !== 0
                                    ? `${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                    : `${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                }
                              >
                                <p className={style.tableDataFontStyle}>
                                  {data.absenceReason}
                                </p>
                                <p className={style.tableDataFontStyle}>
                                  {/* {`${data.notificationPeriod.numberOfDays}`} Days Prior */}
                                </p>
                                <p className={style.tableDataFontStyle}>
                                  {formatInTimeZone(
                                    new Date(`${data.lastModifiedDate}`),
                                    "America/New_York",
                                    "MM-dd-yyyy"
                                  )}
                                </p>
                                <img
                                  src={EditHcRow}
                                  onClick={() => {
                                    getAddEntityDialog(true);
                                    setIsEdit(true);
                                    setSelectedAbsence(data);
                                  }}
                                  className={style.colorFileStyle}
                                  alt=""
                                />
                                <img
                                  src={DeleteHcRow}
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    deleteHandler(data);
                                  }}
                                  alt=""
                                />{" "}
                              </div>
                            </>
                          );
                        })}
                    </div>
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

      {showAddEntityDialog && (
        <AddAbsenseReasonsForHealthcare
          getAddEntityDialog={getAddEntityDialog}
          IndustryId={industryId}
          isEdit={isEdit}
          selectedAbsence={selectedAbsence}
          getEntityData={getAllAbsenceData}
          tableEntityData={tableEntityData}
          selectedTitle={selectedTitle}
          getIndustryData={getIndustryData}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Absense Reasons ?"
        />
      )}
    </Fragment>
  );
};

export default AbsenseReasonsByIndustries;
