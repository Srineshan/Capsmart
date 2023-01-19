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

const BoardCertification = ({
  getAddEntityDialog,
  showAddEntityDialog,
  isEdit,
  setIsEdit,
  sendLastDate,
  rotate,
}) => {
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

  const moment = require("moment-timezone");

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
    let allDates = [];
    allEntries.forEach((e) => {
      e.entities.forEach((d) => {
        let dates = d.terminationType.map(
          (row) => new Date(row.lastModifiedDate)
        );
        allDates.push(...dates);
      });
    });
    let sorted = allDates.sort((a, b) => a - b).reverse();
    let lastModifiedDate = sorted[0].toString().split("+")[0];
    sendLastDate(
      moment
        .tz(lastModifiedDate, "America/New_York")
        .format("MMM D, YYYY hh:mm z")
    );
    localStorage.setItem(
      "terminationReason",
      moment(lastModifiedDate).format("MMMM YYYY").toUpperCase()
    );

    var showList = JSON.parse(localStorage.getItem("showList") || "[]");
    if (showList.indexOf(lastModifiedDate) == -1) {
      showList.push(lastModifiedDate);
      localStorage.setItem("showList", JSON.stringify(showList));
    }
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

  useEffect(() => {
    if (rotate) {
      getAllData();
    }
  }, [rotate]);

  return (
    <Fragment>
      <div className={style.departmentCardColumnsGrid}>
        <div>
          {!rotate &&
            allData?.map((data, index) => {
              return data?.entities.length !== 0 ? (
                <>
                  <div
                    className={`${style.boardCertificationSideRows} ${style.displayInRow}`}
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
                            ? `${style.boardCertificationInnerFolderRows} ${style.boardCertificationBackground1} ${style.displayInRow} `
                            : `${style.boardCertificationInnerFolderRows} ${style.displayInRow} `
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
          <div className={style.tableHeaderIndustriesEntity}>
            <p
              className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
            >
              TERMINATION REASONS
            </p>
            <p className={style.tableHeaderIndustriesFontStyle}>
              NOTICE PERIOD
            </p>
            <p className={style.tableHeaderIndustriesFontStyle}>CURE PERIOD</p>
          </div>

          {/* Contrator */}
          {!rotate &&
          terminationData?.filter((data) => data.terminationBy === "CONTRACTOR")
            .length !== 0 ? (
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

          {!rotate &&
            terminationData
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
                      {data?.secondary_reasons?.map((secondary, idx) => {
                        return (
                          <>
                            <div
                              className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                            >
                              <p></p>
                              <p className={style.tableDataFontStyle}>
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
                      })}
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

          {/* Entity */}
          {!rotate &&
          terminationData?.filter((data) => data.terminationBy === "ENTITY")
            .length !== 0 ? (
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

          {!rotate &&
            terminationData
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
                      {data?.secondary_reasons?.map((secondary, idx) => {
                        return (
                          <>
                            <div
                              className={`${style.terminationInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                            >
                              <p></p>
                              <p className={style.tableDataFontStyle}>
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
                      })}
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
