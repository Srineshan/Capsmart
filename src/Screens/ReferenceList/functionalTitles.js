import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddFunctionalTitles from "./addFunctionalTitles";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import TransparentFolder from "./../../images/transparentFolder.png";
import ArrowDown from "./../../images/arrowDown.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

const FunctionalTitles = ({
  getAddEntityDialog,
  showAddEntityDialog,
  isEdit,
  setIsEdit,
  sendLastDate,
}) => {
  const [allData, setAllData] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [isClicked, setIsClicked] = useState(0);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedEntity, setSelectedEntity] = useState({});
  const [selectedFunctional, setSelectedFunctional] = useState({});
  const [getEntityDataList, setGetEntityDataList] = useState([]);
  const [industryData, setIndustryData] = useState({});
  const [entityData, setEntityData] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");

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
    const functionalData = await Promise.all(CSPType.map(getFunctionalData));
    return await { ...siteTypeId, CSP: functionalData };
  };

  const getFunctionalData = async (contractPID) => {
    const { data: functionalData } = await GET(
      `entity-service/functionalTitlesForCSPTypeMaster?contractedServiceProviderTypeId=${contractPID.id}`
    );
    return await { ...contractPID, functionalData: functionalData };
  };

  const getAllData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    let allEntries = await Promise.all(industryData.map(entityAllData));
    setAllData(allEntries);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.functionalTitles.lastModified);

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
    setSelectedTitle(data?.CSP?.[0].contractedServiceProviderType);
    setSelectedEntity(data.CSP[0]);
    setEntityData(data);
  };

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

  const getFuntionalTitleData = async () => {
    const { data: functionalData } = await GET(
      `entity-service/functionalTitlesForCSPTypeMaster?contractedServiceProviderTypeId=${selectedEntity.id}`
    );
    setGetEntityDataList(functionalData);
    // getAllData();
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
    await DELETE(`entity-service/functionalTitlesForCSPTypeMaster/${id}`)
      .then((response) => {
        SuccessToaster("FunctionlTitle Deleted Successfully");
        getFuntionalTitleData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    EntityDefaultSet(allData);
  }, [allData]);

  useEffect(() => {
    getFuntionalTitleData();
  }, [selectedEntity]);

  useEffect(() => {
    let updateTableData = [];
    getEntityDataList.map((data) => {
      updateTableData.push({ ...data, functionalData: data });
    });
    let updatedSideMenu = [];
    allData.forEach((i) => {
      i.entities.forEach((e) => {
        e.CSP.forEach((s) => {
          if (s.id === selectedEntity.id) {
            updatedSideMenu.push({ ...s, functionalData: updateTableData });
          } else {
            updatedSideMenu.push({ ...s });
          }
        });
      });
    });
    // console.log(allData);
    // console.log(getEntityDataList);
    // console.log(updateTableData);
  }, [getEntityDataList]);

  return (
    <Fragment>
      <div className={style.departmentCardColumnsGrid}>
        <div>
          {allData?.map((data, index) => {
            return data?.entities.length !== 0 ? (
              <>
                <div
                  className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween} ${style.marginTop10}`}
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
                    className={`${style.colorFileStyle2} ${style.marginRight}`}
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
                  {data?.entities?.map((entity, indx) => {
                    return entity.CSP.length !== 0 ? (
                      <>
                        <div
                          className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween} ${style.marginTop10}`}
                          onClick={() => handleToggleCsp(indx, entity)}
                        >
                          <img
                            src={TransparentFolder}
                            className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                            alt=""
                          />
                          <p className={style.healthCareHeaderTextStyle3}>
                            {" "}
                            {entity.type}
                          </p>
                          <img
                            src={ArrowDown}
                            className={`${style.colorFileStyle2} ${style.marginRight}`}
                            alt=""
                          />
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
                                    ? `${style.healthCareListCardStyle}  ${style.marginTop10} ${style.HealthCareListBackground2} ${style.spaceBetween}`
                                    : `${style.healthCareListCardStyle}  ${style.marginTop10}  ${style.spaceBetween}`
                                }
                                onClick={() => {
                                  setSelectedTitle(
                                    siteType.contractedServiceProviderType
                                  );
                                  setIsEdit(false);
                                  setSelectedEntity(siteType);
                                }}
                              >
                                <p
                                  className={`${style.healthCareHeaderTextStyle2} ${style.marginTop10}`}
                                >
                                  {siteType.contractedServiceProviderType}
                                </p>
                                <p
                                  className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                                >
                                  {siteType?.functionalData.length}
                                </p>
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
          <div className={style.tableHeaderFuntionalTitles}>
            <p></p>
            <p className={style.tableHeaderIndustriesFontStyle}>ENTITY NAME</p>
            <p className={style.tableHeaderIndustriesFontStyle}>ALIAS 1</p>
            <p className={style.tableHeaderIndustriesFontStyle}>ALIAS 2</p>
            <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
            <p></p>
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
              <img
                src={EditHcFolder}
                onClick={() => {
                  getAddEntityDialog(true);
                  setIsEdit(false);
                }}
                className={style.colorFileStyle}
                alt=""
              />
              <img
                src={DeleteHcFolder}
                className={style.colorFileStyle}
                alt=""
              />
            </div>
          }

          {getEntityDataList?.map((data, index) => {
            return (
              <>
                <div
                  className={
                    index % 2 === 0
                      ? `${style.FuntionalTitlesTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                      : `${style.FuntionalTitlesTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                  }
                  key={index}
                >
                  <p></p>
                  <p className={style.tableDataFontStyle}>{data?.title}</p>
                  <p className={style.tableDataFontStyle}>{data?.alias1}</p>
                  <p className={style.tableDataFontStyle}>{data?.alias2}</p>
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
                    alt=""
                    onClick={() => {
                      setIsEdit(true);
                      getAddEntityDialog(true);
                      setSelectedFunctional(data);
                    }}
                  />
                  <img
                    src={DeleteHcRow}
                    className={style.colorFileStyle}
                    alt=""
                    onClick={() => {
                      deleteHandler(data);
                    }}
                  />
                </div>
              </>
            );
          })}
        </div>
      </div>

      {showAddEntityDialog && (
        <AddFunctionalTitles
          getAddEntityDialog={getAddEntityDialog}
          getFuntionalTitleData={getFuntionalTitleData}
          selectedEntity={selectedEntity}
          isEdit={isEdit}
          selectedFunctional={selectedFunctional}
          IndustryData={industryData}
          EntityData={entityData}
          getEntityDataList={getEntityDataList}
          selectedTitle={selectedTitle}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Functional Title?"
        />
      )}
    </Fragment>
  );
};

export default FunctionalTitles;
