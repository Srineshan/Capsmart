import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddNewDepartments from "./addNewDepartments";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import TransparentFolder from "./../../images/transparentFolder.png";
import ArrowDown from "./../../images/arrowDown.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import Warning from "./../../images/warning.png";
import { GET, DELETE } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import { format } from "date-fns";
import Navbar from "../../Components/Navbar";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import SideBar from "../../Components/Sidebar";

const DepartmentsByEntityTypes = () => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [allData, setAllData] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState({});
  const [selectedTitle, setSelectedTitle] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepart, setSelectedDepart] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [isService, setIsService] = useState(false);
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
    const departmentAllData = await Promise.all(entities.map(DepartmentData));
    return await { ...industry, entities: departmentAllData };
  };

  const DepartmentData = async (department) => {
    const { data: departmentData } = await GET(
      `entity-service/departmentMaster?siteTypeId=${department?.id}`
    );
    return await { ...department, departmentData };
  };

  const getEntityData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    let allEntries = await Promise.all(industryData.map(entityAllData));
    setAllData(allEntries);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.departments?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getDepartmentData = async () => {
    const { data: departData } = await GET(
      `entity-service/departmentMaster/refListView?siteTypeId=${selectedEntity?.id}`
    );
    setDepartmentList(departData);
  };

  const handleToggle = (index, data) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setSelectedTitle(data?.entities?.[0].type);
    setSelectedEntity(data.entities[0]);
    setClicked(index);
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
    getEntityData();
  };

  const deleteEntity = async (id) => {
    await DELETE(`entity-service/departmentMaster/${id}`)
      .then((response) => {
        SuccessToaster("Department Deleted Successfully");
        getDepartmentData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  const EntityDefaultSet = (Data) => {
    let updatedData = [...Data];
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
    getEntityData();
  }, []);

  useEffect(() => {
    getDepartmentData();
  }, [selectedEntity]);

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
              heading={`DEPARTMENTS / SERVICE AREAS BY ENTITY TYPES`}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/superAdminDashboard"}
              callingFrom={"Super Admin"}
              needHeader={true}
              getAddEntityDialog={getAddEntityDialog}
              Title={"ADD DEPARTMENT"}
            />

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.departmentCardColumnsGrid}>
                    <div>
                      {allData?.map((data, index) => {
                        return data.entities.length !== 0 ? (
                          <>
                            <div
                              className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
                              key={index}
                              onClick={() => handleToggle(index, data)}
                            >
                              <img
                                src={TransparentFolder}
                                className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                alt=""
                              />
                              <p className={style.healthCareHeaderTextStyle}>
                                {data.industry}
                              </p>
                              <img
                                src={ArrowDown}
                                className={
                                  clicked === index
                                    ? `${style.colorFileStyle2} ${style.ArrowUp} ${style.marginRight}`
                                    : `${style.colorFileStyle2} ${style.marginRight}`
                                }
                                alt=""
                              />
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
                                      ? `${style.healthCareListCardStyle}  ${style.HealthCareListBackground2} ${style.marginTop}`
                                      : `${style.healthCareListCardStyle} ${style.marginTop}`
                                  }
                                  onClick={() => {
                                    setSelectedTitle(entity.type);
                                    setIsEdit(false);
                                    setSelectedEntity(entity);
                                  }}
                                >
                                  <div
                                    className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop}`}
                                  >
                                    <p
                                      className={
                                        entity?.type === selectedTitle
                                          ? style.healthCareHeaderTextStyle7
                                          : style.healthCareLeftCardFontStyle
                                      }
                                    >
                                      {entity.type}
                                    </p>
                                    <p
                                      className={
                                        entity?.type === selectedTitle
                                          ? style.healthCareHeaderTextStyle7
                                          : style.healthCareLeftCardFontStyle
                                      }
                                    >
                                      {entity.departmentData.length}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <></>
                        );
                      })}
                    </div>

                    {departmentList?.length === 0 ? (
                      <>
                        <div className={style.emptyCradStyle}>
                          <div className={style.displayInCol}>
                            <div className={style.justifyCenter}>
                              <img
                                src={Warning}
                                alt="warning"
                                className={style.warningImage}
                              />
                            </div>
                            <div className={style.warningFontContainer}>
                              <p className={style.warningFont}>
                                Departments / Services Area reference list by
                                entity needs to be created and setup in order to
                                be made available as a default list for customer
                                accounts that are created.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className={style.DepartmentEntityCardStyle}>
                        <div className={style.tableHeaderDepartment}>
                          <p
                            className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
                          >
                            DEPARTMENT / SERVICES AREA
                          </p>
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            {/* CREATED DATE */}
                          </p>
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
                            <p
                              className={style.tableHeaderIndustriesFontStyle5}
                            >
                              {selectedEntity.type}
                            </p>
                          </div>
                        }
                        {departmentList?.map((data, index) => {
                          if (data?.serviceAreas.length !== 0) {
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
                                    {data?.departmentName.name}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {/* {data.createdDate
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")} */}
                                  </p>
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
                                      setIsService(false);
                                      setSelectedDepart(data);
                                    }}
                                    className={style.colorFileStyle}
                                    alt=""
                                  />
                                  <img
                                    src={DeleteHcFolder}
                                    className={style.colorFileStyle}
                                    alt=""
                                  // onClick={() => {
                                  //   deleteHandler(data);
                                  // }}
                                  />
                                </div>
                                {data?.serviceAreas.map((service, idx) => {
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
                                        {service?.name}
                                      </p>
                                      <p className={style.tableDataFontStyle}>
                                        {/* {data.createdDate
                              .split("T")[0]
                              .split("-")
                              .reverse()
                              .join("-")} */}
                                      </p>
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
                                          setIsService(true);
                                          getAddEntityDialog(true);
                                          setSelectedDepart(data);
                                        }}
                                        alt=""
                                      />
                                      <img
                                        src={DeleteHcRow}
                                        className={style.colorFileStyle}
                                        alt=""
                                      // onClick={() => {
                                      //   DeleteSecondaryBoardHandler(
                                      //     data?.id,
                                      //     secondary?.name
                                      //   );
                                      // }}
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
                                      ? `${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                      : `${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                  }
                                >
                                  <p></p>
                                  <p className={style.tableDataFontStyle}>
                                    {data?.departmentName?.name}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {/* {data.createdDate
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")} */}
                                  </p>
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
                                      setSelectedDepart(data);
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
                    )}
                  </div>
                  {departmentList?.length === 0 && (
                    <div className={`${style.floatRight} ${style.marginTop20}`}>
                      <button
                        className={`${style.buttonStyle} ${style.marginLeft20}`}
                        onClick={() => getAddEntityDialog(true)}
                      >
                        CLICK TO SETUP
                      </button>
                    </div>
                  )}
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
        <AddNewDepartments
          getAddEntityDialog={getAddEntityDialog}
          selectedEntity={selectedEntity}
          isEdit={isEdit}
          getEntityData={getDepartmentData}
          selectedDepart={selectedDepart}
          departmentList={departmentList}
          selectedTitle={selectedTitle}
          isService={isService}
          callingFrom={"Super Admin"}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Department / Services Area ?"
        />
      )}
    </Fragment>
  );
};

export default DepartmentsByEntityTypes;
