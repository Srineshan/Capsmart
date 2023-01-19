import React, { Fragment, useState, useEffect } from "react";
import style from "./index.module.scss";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import EditHcFolder from "../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "../../images/editHcRow.png";
import AddIndustryTypeEntity from "./addIndustryTypeEntity";
import AddSuffixEntity from "./addSuffixEntity";
import { GET, DELETE } from "../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

const SuffixByIndustries = ({
  getAddEntityDialog,
  showAddEntityDialog,
  sendLastDate,
  rotate,
}) => {
  const [showAddHcEntityDialog, setShowAddHcEntityDialog] = useState(false);
  const [sideMenu, setSideMenu] = useState([]);
  const [seletedEntity, setSelectedEntity] = useState({});
  const [selectedTitle, setSelectedTitle] = useState(`${sideMenu?.[0]?.id}`);
  const [industryId, setIndustryId] = useState("");
  const [tableEntityData, setTableEntityData] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const moment = require("moment-timezone");

  const getAddHcEntityDialog = (value) => {
    setShowAddHcEntityDialog(value);
    if (!value) {
      getIndustryData();
    }
  };

  const entityAllData = async (industry) => {
    const { data: entities } = await GET(
      `entity-service/entityTypeMaster?industryId=${industry.id}`
    );
    const { data: nameSuffix } = await GET(
      `entity-service/nameSuffixMaster?industryId=${industry.id}`
    );
    return await { ...industry, entities, nameSuffix };
  };

  const getIndustryData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    setSideMenu([]);
    let allEntries = await Promise.all(industryData.map(entityAllData));
    setSideMenu(allEntries);
    let allDates = [];
    allEntries.forEach((e) => {
      let dates = e.nameSuffix.map((row) => new Date(row.lastModifiedDate));
      allDates.push(...dates);
    });
    let sorted = allDates.sort((a, b) => a - b).reverse();
    let lastModifiedDate = sorted[0].toString().split("+")[0];
    sendLastDate(
      moment
        .tz(lastModifiedDate, "America/New_York")
        .format("MMM D, YYYY hh:mm z")
    );
    localStorage.setItem(
      "nameSuffix",
      moment(lastModifiedDate).format("MMMM YYYY").toUpperCase()
    );

    var showList = JSON.parse(localStorage.getItem("showList") || "[]");
    if (showList.indexOf(lastModifiedDate) == -1) {
      showList.push(lastModifiedDate);
      localStorage.setItem("showList", JSON.stringify(showList));
    }
  };

  const getEntityData = async () => {
    const { data: data } = await GET(
      `entity-service/nameSuffixMaster?industryId=${industryId}`
    );
    setTableEntityData(data);
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
    await DELETE(`entity-service/nameSuffixMaster/${id}`)
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
  }, [selectedTitle]);

  useEffect(() => {
    setSelectedTitle(sideMenu?.[0]?.industry);
    setIndustryId(sideMenu?.[0]?.id);
  }, [sideMenu]);

  useEffect(() => {
    if (rotate) {
      getIndustryData();
    }
  }, [rotate]);

  return (
    <Fragment>
      <div className={style.departmentCardColumnsGrid}>
        <div className={style.displayInCol}>
          {!rotate &&
            sideMenu?.map((data, index) => (
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
                    {data.entities.length}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className={style.industriesEntityCardStyle}>
          <div className={style.tableHeaderIndustriesEntity}>
            <p
              className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
            >
              SUFFIX FOR HEALTHCARE
            </p>
          </div>
          {!rotate && (
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
          )}
          {!rotate &&
            tableEntityData?.map((data, innerIndex) => {
              return (
                <div
                  className={
                    innerIndex % 2 !== 0
                      ? `${style.healthCareTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                      : `${style.healthCareTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                  }
                >
                  <p className={style.tableDataFontStyle}>{data.suffix}</p>
                  <p className={style.tableDataFontStyle}></p>
                  <p className={style.tableDataFontStyle}></p>
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

      {showAddEntityDialog && (
        <AddIndustryTypeEntity
          getAddEntityDialog={getAddEntityDialog}
          getIndustryData={getIndustryData}
        />
      )}

      {showAddHcEntityDialog && (
        <AddSuffixEntity
          getAddHcEntityDialog={getAddHcEntityDialog}
          IndustryId={industryId}
          isEdit={isEdit}
          seletedEntity={seletedEntity}
          selectedTitle={selectedTitle}
          getEntityData={getEntityData}
          tableEntityData={tableEntityData}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this hoiday?"
        />
      )}
    </Fragment>
  );
};

export default SuffixByIndustries;
