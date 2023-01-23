import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddNewDepartments from "./addNewDepartments";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import TransparentFolder from "./../../images/transparentFolder.png";
import ArrowDown from "./../../images/arrowDown.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import Warning from "./../../images/warning.png";
import { GET, DELETE } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

const DepartmentsByEntityTypes = ({
  getAddEntityDialog,
  showAddEntityDialog,
  isEdit,
  setIsEdit,
  sendLastDate,
}) => {
  const [allData, setAllData] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState({});
  const [selectedTitle, setSelectedTitle] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepart, setSelectedDepart] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");

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
    let allDates = [];
    allEntries.forEach((e) => {
      e.entities.forEach((d) => {
        let dates = d.departmentData.map(
          (row) => new Date(row.lastModifiedDate)
        );
        allDates.push(...dates);
      });
    });
    let sorted = allDates.sort((a, b) => a - b).reverse();
    let lastModifiedDate = sorted[0].toString().split("+")[0];

    const date = new Date(lastModifiedDate);

    sendLastDate(
      date
        .toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "short",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
          year: "numeric",
          timeZoneName: "short",
          hour12: false,
        })
        .toUpperCase()
    );

    localStorage.setItem(
      "department",
      date
        .toLocaleString("en-US", {
          timeZone: "America/New_York",
          year: "numeric",
          month: "long",
        })
        .toUpperCase()
    );

    var showList = JSON.parse(localStorage.getItem("showList") || "[]");
    if (showList.indexOf(lastModifiedDate) == -1) {
      showList.push(lastModifiedDate);
      localStorage.setItem("showList", JSON.stringify(showList));
    }
  };

  const getDepartmentData = async () => {
    const { data: departData } = await GET(
      `entity-service/departmentMaster?siteTypeId=${selectedEntity?.id}`
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
                    Departments / Services Area reference list by entity needs
                    to be created and setup in order to be made available as a
                    default list for customer accounts that are created.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={style.DepartmentEntityCardStyle}>
            <div className={style.tableHeaderIndustriesEntity}>
              <p
                className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
              >
                DEPARTMENT / SERVICES AREA
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}>
                CREATED DATE
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
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  {selectedEntity.type}
                </p>
              </div>
            }
            {departmentList?.map((data, index) => (
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
                    {data.createdDate
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
                  </p>
                  <p className={style.tableDataFontStyle}>
                    {data.lastModifiedDate
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("-")}
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
            ))}
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
      {/* <div className={style.marginTop35}>
        <div className={style.centreCardStyle}>
          <div className={style.margin20}>
            <div className={style.departmentCardColumnsGrid}>
              <div>
                <div
                  className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
                >
                  <img
                    src={TransparentFolder}
                    className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                  />
                  <p className={style.healthCareHeaderTextStyle}>HEALTHCARE</p>
                  <img
                    src={ArrowDown}
                    className={`${style.colorFileStyle2} ${style.marginRight}`}
                  />
                </div>
                {menuItem?.map((data) => (
                  <div
                    className={
                      data?.title === selectedTitle
                        ? `${style.healthCareListCardStyle}  ${style.HealthCareListBackground2} ${style.marginTop}`
                        : `${style.healthCareListCardStyle} ${style.marginTop}`
                    }
                    onClick={() => setSelectedTitle(data.title)}
                  >
                    <div
                      className={`${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop}`}
                    >
                      <p className={style.healthCareLeftCardFontStyle}>
                        {data.title}
                      </p>
                      <p className={style.healthCareLeftCardFontStyle}>
                        {data.count}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {departments?.length === 0 ? (
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
                        Departments / Services Area reference list by entity
                        needs to be created and setup in order to be made
                        available as a default list for customer accounts that
                        are created.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={style.DepartmentEntityCardStyle}>
                  <div className={style.tableHeaderIndustriesEntity}>
                    <p className={style.tableHeaderIndustriesFontStyle}>
                      DEPARTMENTS / SERVICE AREAS
                    </p>
                    <p className={style.tableHeaderIndustriesFontStyle}>
                      CREATED DATE
                    </p>
                    <p className={style.tableHeaderIndustriesFontStyle}>
                      LAST UPDATED
                    </p>
                  </div>
                  <div className={style.healthCareIndustriesHeader}>
                    <img
                      src={IndustriesEntityFolder}
                      alt="IndustriesEntityFolder"
                      className={`${style.colorFileStyle} ${style.marginLeft5}`}
                    />
                    <p className={style.tableHeaderIndustriesFontStyle}>
                      Hospital/Acute Care Facility (ACF)
                    </p>
                  </div>
                  {departments?.map((data, index) => (
                    <>
                      {!data?.folder ? (
                        <div
                          className={
                            index % 2 === 0
                              ? `${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                              : `${style.departmentTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                          }
                        >
                          <p></p>
                          <p className={style.tableDataFontStyle}>
                            {data?.title}
                          </p>
                          <p className={style.tableDataFontStyle}>
                            {data?.created_date}
                          </p>
                          <p className={style.tableDataFontStyle}>
                            {data?.last_updated}
                          </p>
                          <img
                            src={EditHcRow}
                            className={style.colorFileStyle}
                          />
                          <img
                            src={DeleteHcRow}
                            className={style.colorFileStyle}
                          />
                        </div>
                      ) : (
                        <div>
                          <div
                            className={`${style.departmentTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                          >
                            <img
                              src={SemiTransparentFolder}
                              alt="SemiTransparentFolder"
                              className={`${style.colorFileStyle} ${style.marginLeft10}`}
                            />
                            <p className={style.tableDataFontStyle}>
                              {data?.title}
                            </p>
                            <p className={style.tableDataFontStyle}>
                              {data?.created_date}
                            </p>
                            <p className={style.tableDataFontStyle}>
                              {data?.last_updated}
                            </p>
                            <img
                              src={EditHcFolder}
                              className={style.colorFileStyle}
                            />
                            <img
                              src={DeleteHcFolder}
                              className={style.colorFileStyle}
                            />
                          </div>
                          <div>
                            {data?.folderValue?.map(
                              (folderData, innerIndex) => (
                                <div
                                  className={
                                    innerIndex % 2 !== 0
                                      ? `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                      : `${style.departmentTableInnerFolderData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                  }
                                >
                                  <p></p>
                                  <p className={style.tableDataFontStyle}>
                                    {folderData?.title}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {folderData?.created}
                                  </p>
                                  <p className={style.tableDataFontStyle}>
                                    {folderData?.updated}
                                  </p>
                                  <img
                                    src={EditHcRow}
                                    className={style.colorFileStyle}
                                  />
                                  <img
                                    src={DeleteHcRow}
                                    className={style.colorFileStyle}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              )}
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
              <button
                className={`${style.buttonStyle} ${style.marginLeft20}`}
                onClick={() => getAddDeptEntityDialog(true)}
              >
                CLICK TO SETUP
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {showAddEntityDialog && (
        <AddNewDepartments
          getAddEntityDialog={getAddEntityDialog}
          selectedEntity={selectedEntity}
          isEdit={isEdit}
          getEntityData={getDepartmentData}
          selectedDepart={selectedDepart}
          departmentList={departmentList}
          selectedTitle={selectedTitle}
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
