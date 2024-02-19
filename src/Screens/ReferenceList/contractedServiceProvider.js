import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditBlue from "./../../images/editBlue.png";
import EditHcRow from "../../images/editHcRow.png";
import AddContractedServiceForHealthcare from "./addContractedServiceProvider";
import { GET, DELETE } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
import format from "date-fns/format";
import Navbar from "../../Components/Navbar";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import SideBar from "../../Components/Sidebar";
import { formatInTimeZone } from "date-fns-tz";

const ContractedServiceProvidedByIndustries = () => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [sideMenu, setSideMenu] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [siteTypeData, setSiteTypeData] = useState([]);
  const [siteTypeTableData, setSiteTypeTableData] = useState([]);
  const [seletedEntity, setSelectedEntity] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const siteTypeAllData = async (siteTypeId) => {
    const { data: CSPType } = await GET(
      `entity-service/contractedServiceProviderMaster?siteTypeId=${siteTypeId.id}`
    );
    return await { ...siteTypeId, CSPType };
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

  const entityCountHandler = (entity) => {
    let length = 0;
    entity.entities.map((data) => {
      length += data.CSPType.length;
    });
    return length;
  };

  const getIndustryData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    setSideMenu([]);
    let allEntries = await Promise.all(industryData.map(entityAllData));

    setIndustryId(allEntries[0].id);
    setSelectedTitle(allEntries[0].industry);
    setSideMenu(allEntries);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(
      lastModifiedDate.contractedServiceProviders?.lastModified
    );
    setLastUpdatedDate(
      formatInTimeZone(date, "America/New_York", "MMM d, yyyy HH:mm zzz")
    );
  };

  const getEntityData = async () => {
    const { data: entities } = await GET(
      `entity-service/entityTypeMaster?industryId=${industryId}`
    );
    setSiteTypeData(entities);
    setSiteTypeTableData([]);
    entities.forEach(async (d) => {
      const val = await GET(
        `entity-service/contractedServiceProviderMaster?siteTypeId=${d.id}`
      );
      let inter = { ...d, items: val.data };
      setSiteTypeTableData((p) => [inter, ...p]);
    });
  };

  const SelectedHandler = (data) => {
    setSelectedTitle(data.industry);
    setIndustryId(data.id);
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
    await DELETE(`entity-service/contractedServiceProviderMaster/${id}`)
      .then((response) => {
        SuccessToaster("Contracted Service Provider Deleted Successfully");
        getEntityData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    getEntityData();
  }, [selectedTitle]);

  useEffect(() => {
    let updateTableData = [];
    siteTypeTableData.map((data) => {
      updateTableData.push({
        ...data,
        CSPType: data.items,
      });
    });
    let updatedSideMenu = [];
    sideMenu.forEach((data) => {
      if (data.id === industryId) {
        updatedSideMenu.push({ ...data, entities: updateTableData });
      } else {
        updatedSideMenu.push({ ...data });
      }
    });
    setSideMenu(updatedSideMenu);
  }, [siteTypeTableData]);

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
              heading={`CONTRACTED SERVICE PROVIDERS BY INDUSTRY & ENTITY TYPES`}
              updatedTime={`UPDATED ON ${lastUpdatedDate} `}
              path={"/Screens/ReferenceList/superAdminDashboard"}
              callingFrom={"Super Admin"}
              needHeader={true}
              getAddEntityDialog={getAddEntityDialog}
              Title={"ADD CSP"}
            />

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.centreCardColumnsGrid}>
                    <div className={style.displayInCol}>
                      {sideMenu?.map((data, index) => (
                        <div
                          className={
                            data?.industry === selectedTitle
                              ? `${style.industriesCardStyle} ${style.selectedIndustriesBackground} ${style.marginTop10}`
                              : `${style.industriesCardStyle} ${style.marginTop10}`
                          }
                          onClick={() => SelectedHandler(data)}
                        >
                          <div className={style.spaceBetween}>
                            <p className={style.industriesCardTextStyle1}>
                              {data.industry}
                            </p>
                            <p className={style.industriesCardTextStyle1}>
                              {entityCountHandler(data)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={style.industriesEntityCardStyle}>
                      <div className={style.contractedServiceHeader}>
                        <p></p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          ENTITY TYPE
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          LAST UPDATED
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          {/* LAST UPDATED */}
                        </p>
                      </div>
                      {siteTypeTableData?.map((data) =>
                        data.items.length !== 0 ? (
                          <>
                            <div
                              className={style.contractedServiceProvidersHeader}
                            >
                              <img
                                src={IndustriesEntityFolder}
                                alt="IndustriesEntityFolder"
                                className={`${style.colorFileStyle} ${style.marginLeft5}`}
                              />
                              <p
                                className={
                                  style.tableSubHeaderIndustriesFontStyle
                                }
                              >
                                {data.type}
                              </p>
                              <img
                                src={EditHcFolder}
                                className={style.colorFileStyle}
                                onClick={() => {
                                  getAddEntityDialog(true);
                                  setIsEdit(false);
                                  setSelectedEntity(data);
                                }}
                                alt=""
                              />
                              <img
                                src={DeleteHcFolder}
                                className={style.colorFileStyle}
                                alt=""
                              />
                            </div>
                            {data?.items?.map((i, innerIndex) => (
                              <div
                                className={
                                  innerIndex % 2 !== 0
                                    ? `${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                                    : `${style.contractedServiceLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                }
                              >
                                <p className={style.tableDataFontStyle}>
                                  {i.contractedServiceProviderType}
                                </p>
                                <p className={style.tableDataFontStyle}>
                                  {/* {i.createdDate
                          .split("T")[0]
                          .split("-")
                          .reverse()
                          .join("-")} */}
                                </p>
                                <p className={style.tableDataFontStyle}>
                                  {formatInTimeZone(
                                    new Date(`${i.lastModifiedDate}`),
                                    "America/New_York",
                                    "MM-dd-yyyy"
                                  )}
                                </p>
                                <img
                                  src={EditHcRow}
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    setIsEdit(true);
                                    setSelectedEntity(i);
                                    getAddEntityDialog(true);
                                  }}
                                  alt=""
                                />
                                <img
                                  src={DeleteHcRow}
                                  className={style.colorFileStyle}
                                  onClick={() => {
                                    deleteHandler(i);
                                  }}
                                  alt=""
                                />
                              </div>
                            ))}
                          </>
                        ) : (
                          <></>
                        )
                      )}
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
        <AddContractedServiceForHealthcare
          getAddEntityDialog={getAddEntityDialog}
          siteTypeData={siteTypeData}
          getEntityData={getEntityData}
          seletedEntity={seletedEntity}
          isEdit={isEdit}
          siteTypeTableData={siteTypeTableData}
          selectedTitle={selectedTitle}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Contracted Service Provider?"
        />
      )}
    </Fragment>
  );
};

export default ContractedServiceProvidedByIndustries;
