import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddBoardCertifcation from "./addBoardCertifcation";
import OpenFolder from "./../../images/openFolder.png";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import BlueFolder from "./../../images/blueFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE, PUT } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import format from "date-fns/format";
import Navbar from "../../Components/Navbar";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import SideBar from "../../Components/Sidebar";

const BoardCertification = () => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isSecondary, setIsSecondary] = useState(false);
  const [clicked, setClicked] = useState(0);
  const [isClicked, setIsClicked] = useState(0);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedEntity, setSelectedEntity] = useState({});
  const [industryData, setIndustryData] = useState({});
  const [entityData, setEntityData] = useState({});
  const [boardCerticationTable, setBoardCertificationTable] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [selectedBoard, setSelectedBoard] = useState({});
  const [deleteSecondaryObj, setDeleteSecondaryObj] = useState({});
  const [isEdit, setIsEdit] = useState(false);
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
      entities.map(siteTypeAllData)
    );
    return await { ...industry, entities: reconstructedEntities };
  };

  const siteTypeAllData = async (siteTypeId) => {
    const { data: CSPType } = await GET(
      `entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId.id}`
    );
    return await { ...siteTypeId, CSP: CSPType };
  };

  const getAllData = async () => {
    const { data: Entitydata } = await GET(`entity-service/industryMaster`);
    let allEntries = await Promise.all(Entitydata.map(entityAllData));
    setAllData(allEntries);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.boardCertification?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const handleToggle = (index, data) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
    setIndustryData(data);
  };

  const handleToggleCsp = (index, data) => {
    if (isClicked === index) {
      return setIsClicked("0");
    }
    setIsClicked(index);
    setEntityData(data);
    setSelectedTitle(data?.CSP?.[0].contractedServiceProviderType);
    setSelectedEntity(data.CSP[0]);
  };

  const getBoardCertificationData = async (industryId, contractPID) => {
    const { data: boardData } = await GET(
      `entity-service/boardCertificateSpecialtiesMaster?industry=${industryData.id}&contractedServiceProviderType=${selectedEntity.id}`
    );
    setBoardCertificationTable(boardData);
  };

  const deleteHandler = (data) => {
    setDeleteEntityId(data?.id);
    setShowDeleteConfirmation(true);
  };

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
  };

  const getDeleteConfirmation = (value, payload) => {
    if (!payload) {
      deleteSecondary(deleteEntityId);
    } else if (value) {
      deleteEntity(deleteEntityId);
    }
  };

  const deleteSecondary = async (id) => {
    await PUT(
      `entity-service/boardCertificateSpecialtiesMaster/${id}`,
      JSON.stringify(deleteSecondaryObj)
    )
      .then((response) => {
        SuccessToaster("Board Certification Deleted Successfully");
        getAllData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const deleteEntity = async (id) => {
    await DELETE(`entity-service/boardCertificateSpecialtiesMaster/${id}`)
      .then((response) => {
        SuccessToaster("Board Certification Deleted Successfully");
        getBoardCertificationData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const DeleteSecondaryBoardHandler = async (index, index1) => {
    const out = boardCerticationTable.filter((bc) => bc.id === index)[0];
    const newSecondary = out.secondaryBoards.filter((e) => e.name !== index1);
    out.secondaryBoards = newSecondary;
    setDeleteEntityId(out?.id);
    setDeleteSecondaryObj(out);
    setShowDeleteConfirmation(true);
  };

  useEffect(() => {
    getBoardCertificationData();
  }, [selectedEntity, industryData]);

  useEffect(() => {
    getAllData();
  }, []);

  const EntityDefaultSet = (Data) => {
    let updatedData = [...Data];
    setIndustryData(updatedData?.[0]);
    updatedData?.[0]?.entities.some((list, index) => {
      setEntityData(list);
      if (list.CSP.length > 0) {
        setIsClicked(index);
        setSelectedTitle(list.CSP[0]?.contractedServiceProviderType);
        setSelectedEntity(list.CSP[0]);
        return true;
      }
    });
  };

  useEffect(() => {
    EntityDefaultSet(allData);
  }, [allData]);

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
              heading={`BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES`}
              updatedTime={`UPDATED ON ${lastUpdatedDate.toUpperCase()} EST`}
              path={"/Screens/ReferenceList/superAdminDashboard"}
              callingFrom={"Super Admin"}
              needHeader={true}
              getAddEntityDialog={getAddEntityDialog}
              Title={"ADD BOARD CERTIFICATION"}
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
                              className={`${style.healthCareListHeader} ${style.HealthCareListBackground3} ${style.spaceBetween} ${style.marginTop10}`}
                              key={index}
                              onClick={() => handleToggle(index, data)}
                            >
                              <img
                                src={BlackBorderFolder}
                                className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                alt=""
                              />
                              <p className={style.healthCareHeaderTextStyle4}>
                                {data.industry}
                              </p>
                              {clicked === index ? (
                                <p
                                  className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                                >
                                  -
                                </p>
                              ) : (
                                <img
                                  src={OpenFolder}
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle} ${style.reduce10Left}`}
                                />
                              )}
                            </div>
                            <div
                              className={
                                clicked === index
                                  ? `${style.listWrapper} ${style.open}`
                                  : `${style.listWrapper}`
                              }
                            >
                              {data?.entities?.map((entity, indx) => {
                                return entity.CSP.length !== 0 ? (
                                  <>
                                    <div
                                      className={`${style.healthCareListHeader} ${style.HealthCareListBackground4} ${style.spaceBetween} ${style.marginTop10}`}
                                      onClick={() =>
                                        handleToggleCsp(indx, entity)
                                      }
                                    >
                                      <img
                                        src={BlackBorderFolder}
                                        className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                        alt=""
                                      />
                                      <p
                                        className={
                                          style.healthCareHeaderTextStyle5
                                        }
                                      >
                                        {" "}
                                        {entity.type}
                                      </p>
                                      {isClicked === indx ? (
                                        <p
                                          className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                                        >
                                          -
                                        </p>
                                      ) : (
                                        <img
                                          src={OpenFolder}
                                          alt="OpenFolder"
                                          className={`${style.colorFileStyle} ${style.reduce10Left}`}
                                        />
                                      )}
                                    </div>
                                    <div
                                      className={
                                        isClicked === indx
                                          ? `${style.listWrapper} ${style.open}`
                                          : `${style.listWrapper}`
                                      }
                                    >
                                      {entity?.CSP?.map((siteType) => {
                                        return (
                                          <div
                                            className={
                                              siteType?.contractedServiceProviderType ===
                                              selectedTitle
                                                ? `${style.healthCareListCardStyle}  ${style.marginTop10} ${style.HealthCareListBackground5} ${style.spaceBetween}`
                                                : `${style.healthCareListCardStyle2}  ${style.marginTop10}  ${style.spaceBetween}`
                                            }
                                            onClick={() => {
                                              setSelectedTitle(
                                                siteType.contractedServiceProviderType
                                              );
                                              setIsEdit(false);
                                              setSelectedEntity(siteType);
                                            }}
                                          >
                                            <img
                                              src={
                                                siteType?.contractedServiceProviderType ===
                                                selectedTitle
                                                  ? BlueFolder
                                                  : IndustriesEntityFolder
                                              }
                                              className={`${style.colorFileStyle7} ${style.marginLeft5}`}
                                              alt=""
                                            />
                                            <p
                                              className={`${style.healthCareHeaderTextStyle6} ${style.marginTop10}`}
                                            >
                                              {
                                                siteType.contractedServiceProviderType
                                              }
                                            </p>
                                            {/* <p className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}>
                                            5
                                          </p> */}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <></>
                        );
                      })}
                    </div>

                    <div className={style.DepartmentEntityCardStyle}>
                      <div className={style.tableHeaderIndustriesEntity}>
                        <p
                          className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
                        >
                          BOARD CERTIFICATION SPECIALTIES BY INDUSTRIES
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}></p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          LAST UPDATED
                        </p>
                      </div>
                      {
                        <div className={style.healthCareIndustriesHeader}>
                          <img
                            src={IndustriesEntityFolder}
                            alt="IndustriesEntityFolder"
                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                          />
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            {selectedEntity.contractedServiceProviderType}
                          </p>
                        </div>
                      }

                      {boardCerticationTable?.map((data, index) => {
                        if (data?.secondaryBoards.length !== 0) {
                          return (
                            <>
                              <div
                                className={
                                  index % 2 === 0
                                    ? `${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                    : `${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                }
                              >
                                <img
                                  src={SemiTransparentFolder}
                                  alt="SemiTransparentFolder"
                                  className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                />
                                <p className={style.tableDataFontStyle}>
                                  {data?.primaryBoard.name}
                                </p>
                                <p className={style.tableDataFontStyle}></p>
                                <p className={style.tableDataFontStyle}>
                                  {format(
                                    new Date(`${data.lastModifiedDate}`),
                                    "MM-dd-yyyy"
                                  )}
                                </p>
                                <img
                                  src={EditHcFolder}
                                  onClick={() => {
                                    getAddEntityDialog(true);
                                    setIsEdit(true);
                                    setIsSecondary(false);
                                    setSelectedBoard(data);
                                  }}
                                  className={style.colorFileStyle}
                                  alt=""
                                />
                                <img
                                  src={DeleteHcFolder}
                                  className={style.colorFileStyle}
                                  alt=""
                                  onClick={() => {
                                    deleteHandler(data);
                                  }}
                                />
                              </div>
                              {data?.secondaryBoards?.map((secondary, idx) => {
                                return (
                                  <div
                                    className={
                                      idx % 2 === 0
                                        ? `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                        : `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                    }
                                  >
                                    <p></p>
                                    <p className={style.tableDataFontStyle}>
                                      {secondary?.name}
                                    </p>
                                    <p className={style.tableDataFontStyle}></p>
                                    <p className={style.tableDataFontStyle}>
                                      {format(
                                        new Date(`${data.lastModifiedDate}`),
                                        "MM-dd-yyyy"
                                      )}
                                    </p>
                                    <img
                                      src={EditHcRow}
                                      className={style.colorFileStyle}
                                      onClick={() => {
                                        setIsEdit(true);
                                        setIsSecondary(true);
                                        getAddEntityDialog(true);
                                        setSelectedBoard(data);
                                      }}
                                      alt=""
                                    />
                                    <img
                                      src={DeleteHcRow}
                                      className={style.colorFileStyle}
                                      alt=""
                                      onClick={() => {
                                        DeleteSecondaryBoardHandler(
                                          data?.id,
                                          secondary?.name
                                        );
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </>
                          );
                        } else {
                          return (
                            <>
                              <div
                                className={
                                  index % 2 === 0
                                    ? `${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                    : `${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                }
                              >
                                <p></p>
                                <p className={style.tableDataFontStyle}>
                                  {data?.primaryBoard.name}
                                </p>
                                <p className={style.tableDataFontStyle}></p>
                                <p className={style.tableDataFontStyle}>
                                  {format(
                                    new Date(`${data.lastModifiedDate}`),
                                    "MM-dd-yyyy"
                                  )}
                                </p>
                                <img
                                  src={EditHcRow}
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    setIsEdit(true);
                                    getAddEntityDialog(true);
                                    setSelectedBoard(data);
                                  }}
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
          <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI</p>
        </div>
      </div>

      {showAddEntityDialog && (
        <AddBoardCertifcation
          getAddEntityDialog={getAddEntityDialog}
          selectedEntity={selectedEntity}
          isEdit={isEdit}
          IndustryData={industryData}
          EntityData={entityData}
          selectedBoard={selectedBoard}
          isSecondary={isSecondary}
          getBoardCertificationData={getBoardCertificationData}
          selectedTitle={selectedTitle}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Board Certification?"
        />
      )}
    </Fragment>
  );
};

export default BoardCertification;
