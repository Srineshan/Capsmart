import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import AddHealthCareEntity from "./addHealthCareEntity";
import AddIndustryTypeEntity from "./addIndustryTypeEntity";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import { GET, DELETE } from "./../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";
// import { format } from "date-fns";
import { format } from "date-fns-tz";
import Navbar from "../../Components/Navbar";
import SideBar from "../../Components/Sidebar";
import LevelTwoHeader from "../../Components/LevelTwoHeader";

const IndustriesWithEntityTypes = () => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [showAddHcEntityDialog, setShowAddHcEntityDialog] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState({});
  const [tableEntityData, setTableEntityData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [seletedEntity, setSelectedEntity] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [allData, setAllData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getAddHcEntityDialog = (value) => {
    setShowAddHcEntityDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const entityAllData = async (industry) => {
    const { data: entities } = await GET(
      `entity-service/entityTypeMaster?industryId=${industry.id}`
    );
    return await { ...industry, entities };
  };

  const getIndustryData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);

    let allEntries = await Promise.all(industryData.map(entityAllData));
    setAllData(allEntries);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.industries?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getEntityData = async () => {
    const { data: entityData } = await GET(
      `entity-service/entityTypeMaster?industryId=${selectedIndustry.id}`
    );
    setTableEntityData(entityData);
  };

  // console.log(selectedIndustry);

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
    await DELETE(`entity-service/entityTypeMaster/${id}`)
      .then((response) => {
        SuccessToaster("Entity Deleted Successfully");
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
  }, [selectedIndustry]);

  const EntityDefaultSet = (Data) => {
    let updatedData = [...Data];
    setSelectedIndustry(updatedData?.[0]);
    setSelectedTitle(updatedData?.[0]?.industry);
    setIndustryId(updatedData?.[0]?.id);
  };

  useEffect(() => {
    EntityDefaultSet(allData);
  }, [allData]);

  useEffect(() => {
    let updateTableData = [];
    tableEntityData.map((data) => {
      updateTableData.push({ ...data, entities: data });
    });
    // console.log(updateTableData);
    let updatedSideMenu = [];
    allData.forEach((i) => {
      // console.log(i.id, selectedIndustry.id);
      if (i.id === selectedIndustry?.id) {
        updatedSideMenu.push({ ...i, entities: updateTableData });
      } else {
        updatedSideMenu.push({ ...i });
      }
    });
    // console.log(updatedSideMenu);
  }, [tableEntityData]);

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
              heading={`INDUSTRIES WITH ENTITY TYPES`}
              updatedTime={`UPDATED ON ${lastUpdatedDate} `}
              path={"/Screens/ReferenceList/superAdminDashboard"}
              callingFrom={"Super Admin"}
              needHeader={true}
              getAddEntityDialog={getAddEntityDialog}
              Title={"ADD INDUSTRY"}
            />

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.centreCardColumnsGrid}>
                    <div className={style.displayInCol}>
                      {allData?.map((data, index) => {
                        return (
                          <div
                            className={
                              data?.industry === selectedTitle
                                ? `${style.industriesCardStyle} ${style.selectedIndustriesBackground} ${style.marginTop10}`
                                : `${style.industriesCardStyle} ${style.marginTop10}`
                            }
                            onClick={() => {
                              setSelectedTitle(data?.industry);
                              setIndustryId(data?.id);
                              setSelectedIndustry(data);
                            }}
                            key={index}
                          >
                            <div className={style.spaceBetween}>
                              <p className={style.industriesCardTextStyle1}>
                                {data.industry}
                              </p>
                              <p className={style.industriesCardTextStyle1}>
                                {data?.entities.length}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* //Table */}
                    <div className={style.industriesEntityCardStyle}>
                      <div className={style.tableHeaderIndustriesEntity}>
                        <p
                          className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
                        >
                          ENTITY NAME
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
                          <p className={style.tableHeaderIndustriesFontStyle}>
                            {selectedTitle}
                          </p>
                          <img
                            src={EditHcFolder}
                            className={style.colorFileStyle}
                            onClick={() => {
                              setIsEdit(false);
                              getAddHcEntityDialog(true);
                            }}
                            alt=""
                          />
                          <img
                            src={DeleteHcFolder}
                            className={style.colorFileStyle}
                            alt=""
                          />
                        </div>
                      }
                      {tableEntityData?.map((data, innerIndex) => {
                        return (
                          <div
                            className={
                              innerIndex % 2 !== 0
                                ? `${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                                : `${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                            }
                          >
                            <p className={style.tableDataFontStyle}>
                              {data.type}
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
                                setSelectedEntity(data);
                                getAddHcEntityDialog(true);
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
          <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI</p>
        </div>
      </div>

      {showAddEntityDialog && (
        <AddIndustryTypeEntity
          getAddEntityDialog={getAddEntityDialog}
          getIndustryData={getEntityData}
        />
      )}

      {showAddHcEntityDialog && (
        <AddHealthCareEntity
          getAddHcEntityDialog={getAddHcEntityDialog}
          IndustryId={industryId}
          isEdit={isEdit}
          seletedEntity={seletedEntity}
          selectedTitle={selectedTitle}
          getEntityData={getEntityData}
          tableEntityData={tableEntityData}
          setTableEntityData={setTableEntityData}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText={`Do you want to delete this Entity For ${selectedTitle} ?`}
        />
      )}
    </Fragment>
  );
};

export default IndustriesWithEntityTypes;
