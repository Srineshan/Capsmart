import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddTerminationReasons from "./addTerminationReasons";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import { format } from "date-fns";
import Navbar from "../../Components/Navbar";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import SideBar from "../../Components/Sidebar";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../utils/formatting";

const BoardCertification = () => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [allData, setAllData] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [industryData, setIndustryData] = useState({});
  const [selectedEntity, setSelectedEntity] = useState({});
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isSecondary, setIsSecondary] = useState(false);
  const [selectedTermination, setSelectedTermination] = useState({});
  const [terminationData, setTerminationData] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const entityAllData = async (industry) => {
    const { data: entities } = await GET(
      `entity-service/entityTypeMaster?industryId=${industry.id}`
    );

    const reconstructedEntities = await Promise.all(
      entities.map(terminationAllData)
    );
    return await { ...industry, entities: reconstructedEntities };
  };

  const terminationAllData = async (siteTypeId) => {
    const { data: terminationType } = await GET(
      `entity-service/terminationReasonMaster?siteTypeId=${siteTypeId.id}`
    );
    return await { ...siteTypeId, terminationType };
  };

  const getAllData = async () => {
    const { data: Entitydata } = await GET(`entity-service/industryMaster`);
    let allEntries = await Promise.all(Entitydata.map(entityAllData));
    setAllData(allEntries);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.terminationReason?.lastModified);
    setLastUpdatedDate(
      `${formatInTimeZone(date, siteTimeZone(), "MMM d, yyyy HH:mm")} ${timeZoneAbbreviation()}`
    );
  };

  const handleToggle = (index, data) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setSelectedTitle(data?.entities?.[0].type);
    setSelectedEntity(data.entities[0]);
    setClicked(index);
    setIndustryData(data);
  };

  const getTerminationReasonData = async () => {
    const { data: reasonData } = await GET(
      `entity-service/terminationReasonMaster?siteTypeId=${selectedEntity?.id}`
    );
    setTerminationData(reasonData);
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
    await DELETE(`entity-service/terminationReasonMaster/${id}`)
      .then((response) => {
        SuccessToaster("Termination Deleted Successfully");
        getTerminationReasonData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const EntityDefaultSet = (Data) => {
    let updatedData = [...Data];
    setIndustryData(updatedData?.[0]);
    updatedData.some((list, index) => {
      if (list.entities.length > 0) {
        setClicked(index);
        setSelectedTitle(list.entities[0]?.type);
        setSelectedEntity(list.entities[0]);
        return true;
      }
    });
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    EntityDefaultSet(allData);
  }, [allData]);

  useEffect(() => {
    getTerminationReasonData();
  }, [selectedTitle]);

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
              heading={`TERMINATION REASONS BY ENTITY`}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/superAdminDashboard"}
              callingFrom={"Super Admin"}
              needHeader={true}
              getAddEntityDialog={getAddEntityDialog}
              Title={"ADD TERMINATION"}
              setIsEdit={setIsEdit}
            />

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.departmentCardColumnsGrid}>
                    <div className={style.displayInCol}>
                      {allData?.map((data, index) => {
                        return data?.entities.length !== 0 ? (
                          <>
                            <div
                              className={`${style.terminationReasonSideRows} ${style.displayInRow}`}
                              key={index}
                              onClick={() => handleToggle(index, data)}
                            >
                              <img
                                src={BlackBorderFolder}
                                alt="HealthCareFolder"
                                className={`${style.colorFileStyle} ${style.marginLeft5}`}
                              />
                              <p
                                className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}
                              >
                                {data.industry}
                              </p>
                              <p
                                className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                              >
                                {clicked === index ? "—" : "+"}
                              </p>
                            </div>
                            <div
                              className={
                                clicked === index
                                  ? `${style.listWrapper} ${style.open}`
                                  : `${style.listWrapper}`
                              }
                            >
                              {data?.entities?.map((entity) => (
                                <div
                                  className={
                                    entity?.type === selectedTitle
                                      ? `${style.terminationInnerFolderRows} ${style.terminationReasonBackground1} ${style.displayInRow} `
                                      : `${style.terminationInnerFolderRows} ${style.terminationReasonBackground2} ${style.displayInRow} `
                                  }
                                  onClick={() => {
                                    setSelectedTitle(entity.type);
                                    setIsEdit(false);
                                    setSelectedEntity(entity);
                                  }}
                                >
                                  <img
                                    src={IndustriesEntityFolder}
                                    alt="IndustriesEntityFolder"
                                    className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                  />
                                  <p
                                    className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft20}`}
                                  >
                                    {entity.type}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <></>
                        );
                      })}
                    </div>

                    <div className={style.industriesEntityCardStyle}>
                      <div className={style.tableHeaderTerminationReasons}>
                        <p
                          className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
                        >
                          TERMINATION REASONS
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          NOTICE PERIOD
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          CURE PERIOD
                        </p>
                      </div>

                      {/* Contrator */}
                      {terminationData?.filter(
                        (data) => data.terminationBy === "CONTRACTOR"
                      ).length !== 0 ? (
                        <div className={style.terminationHeader}>
                          <img
                            src={IndustriesEntityFolder}
                            alt="IndustriesEntityFolder"
                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                          />
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            For Cause By Contractor
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}

                      {terminationData
                        ?.filter((data) => data.terminationBy === "CONTRACTOR")
                        .map((data, innerIndex) => {
                          if (data?.secondary_reasons.length !== 0) {
                            return (
                              <>
                                <div
                                  className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                                >
                                  <img
                                    src={SemiTransparentFolder}
                                    alt="SemiTransparentFolder"
                                    className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                  />
                                  <p className={style.tableDataFontStyle}>
                                    {data.primary_reason}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {data.noticePeriodInDays}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {data.curePeriodInDays}
                                  </p>{" "}
                                  <img
                                    src={EditHcFolder}
                                    alt="EditHcFolder"
                                    onClick={() => {
                                      getAddEntityDialog(true);
                                      setIsEdit(true);
                                      setIsSecondary(false);
                                      setSelectedTermination(data);
                                    }}
                                    className={style.colorFileStyle}
                                  />
                                  <img
                                    src={DeleteHcFolder}
                                    alt="DeleteHcFolder"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      deleteHandler(data);
                                    }}
                                  />
                                </div>
                                {data?.secondary_reasons?.map(
                                  (secondary, idx) => {
                                    return (
                                      <>
                                        <div
                                          className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                                        >
                                          <p></p>
                                          <p
                                            className={style.tableDataFontStyle}
                                          >
                                            {secondary}
                                          </p>
                                          <p
                                            className={style.tableDataFontStyle}
                                          >
                                            {data.noticePeriodInDays}
                                          </p>
                                          <p
                                            className={style.tableDataFontStyle}
                                          >
                                            {data.curePeriodInDays}
                                          </p>{" "}
                                          <img
                                            src={EditHcRow}
                                            alt="EditHcRow"
                                            className={style.colorFileStyle}
                                            onClick={() => {
                                              getAddEntityDialog(true);
                                              setIsEdit(true);
                                              setIsSecondary(true);
                                              setSelectedTermination(data);
                                            }}
                                          />
                                          <img
                                            src={DeleteHcRow}
                                            alt="DeleteHcRow"
                                            className={style.colorFileStyle}
                                            onClick={() => {
                                              deleteHandler(data);
                                            }}
                                          />
                                        </div>
                                      </>
                                    );
                                  }
                                )}
                              </>
                            );
                          } else {
                            return (
                              <>
                                <div
                                  className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                                >
                                  <p></p>
                                  <p className={style.tableDataFontStyle}>
                                    {data.primary_reason}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {data.noticePeriodInDays}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {data.curePeriodInDays}
                                  </p>
                                  <img
                                    src={EditHcRow}
                                    alt="EditHcRow"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      setIsEdit(true);
                                      getAddEntityDialog(true);
                                      setSelectedTermination(data);
                                    }}
                                  />
                                  <img
                                    src={DeleteHcRow}
                                    alt="DeleteHcRow"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      deleteHandler(data);
                                    }}
                                  />
                                </div>
                              </>
                            );
                          }
                        })}

                      {/* Entity */}
                      {terminationData?.filter(
                        (data) => data.terminationBy === "ENTITY"
                      ).length !== 0 ? (
                        <div className={style.terminationHeader}>
                          <img
                            src={IndustriesEntityFolder}
                            alt="IndustriesEntityFolder"
                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                          />
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            For Cause By Entity
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}

                      {terminationData
                        ?.filter((data) => data.terminationBy === "ENTITY")
                        .map((data, innerIndex) => {
                          if (data?.secondary_reasons.length !== 0) {
                            return (
                              <>
                                <div
                                  className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                                >
                                  <img
                                    src={SemiTransparentFolder}
                                    alt="SemiTransparentFolder"
                                    className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                  />
                                  <p className={style.tableDataFontStyle}>
                                    {data.primary_reason}
                                  </p>
                                  <p></p>
                                  <p></p>
                                  <img
                                    src={EditHcFolder}
                                    alt="EditHcFolder"
                                    onClick={() => {
                                      getAddEntityDialog(true);
                                      setIsEdit(true);
                                      setIsSecondary(false);
                                      setSelectedTermination(data);
                                    }}
                                    className={style.colorFileStyle}
                                  />
                                  <img
                                    src={DeleteHcFolder}
                                    alt="DeleteHcFolder"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      deleteHandler(data);
                                    }}
                                  />
                                </div>
                                {data?.secondary_reasons?.map(
                                  (secondary, idx) => {
                                    return (
                                      <>
                                        <div
                                          className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                                        >
                                          <p></p>
                                          <p
                                            className={style.tableDataFontStyle}
                                          >
                                            {secondary}
                                          </p>
                                          <p></p>
                                          <p></p>
                                          <img
                                            src={EditHcRow}
                                            alt="EditHcRow"
                                            className={style.colorFileStyle}
                                            onClick={() => {
                                              getAddEntityDialog(true);
                                              setIsEdit(true);
                                              setIsSecondary(true);
                                              setSelectedTermination(data);
                                            }}
                                          />
                                          <img
                                            src={DeleteHcRow}
                                            alt="DeleteHcRow"
                                            className={style.colorFileStyle}
                                            onClick={() => {
                                              deleteHandler(data);
                                            }}
                                          />
                                        </div>
                                      </>
                                    );
                                  }
                                )}
                              </>
                            );
                          } else {
                            return (
                              <>
                                <div
                                  className={`${style.terminationLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                                >
                                  <p></p>
                                  <p className={style.tableDataFontStyle}>
                                    {data.primary_reason}
                                  </p>
                                  <p></p>
                                  <p></p>
                                  <img
                                    src={EditHcRow}
                                    alt="EditHcRow"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      setIsEdit(true);
                                      getAddEntityDialog(true);
                                      setSelectedTermination(data);
                                    }}
                                  />
                                  <img
                                    src={DeleteHcRow}
                                    alt="DeleteHcRow"
                                    className={style.colorFileStyle}
                                    onClick={() => {
                                      deleteHandler(data);
                                    }}
                                  />
                                </div>
                              </>
                            );
                          }
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - CAPSmart</p>
          <p className={style.poweredBy}>© CAPSmart</p>
        </div>
      </div>

      {showAddEntityDialog && (
        <AddTerminationReasons
          getAddEntityDialog={getAddEntityDialog}
          selectedEntity={selectedEntity}
          isEdit={isEdit}
          IndustryData={industryData}
          selectedTermination={selectedTermination}
          isSecondary={isSecondary}
          terminationData={terminationData}
          getTerminationReasonData={getTerminationReasonData}
          selectedTitle={selectedTitle}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Termination?"
        />
      )}
    </Fragment>
  );
};

export default BoardCertification;
