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
import format from "date-fns/format";

const SuffixByIndustries = ({
  getAddEntityDialog,
  showAddEntityDialog,
  sendLastDate,
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

  const getAddHcEntityDialog = (value) => {
    setShowAddHcEntityDialog(value);
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

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.nameSuffix.lastModified);

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

  const getEntityData = async () => {
    const { data: nameSuffixData } = await GET(
      `entity-service/nameSuffixMaster?industryId=${industryId}`
    );
    setTableEntityData(nameSuffixData);
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
      getIndustryData();
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

  return (
    <Fragment>
      <div className={style.departmentCardColumnsGrid}>
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
                  {data?.nameSuffix.length}
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
              {`SUFFIX FOR ${selectedTitle}`}
            </p>
            <p className={style.tableHeaderIndustriesFontStyle}>LAST UPDATED</p>
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
                  getAddEntityDialog(true);
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
                <p className={style.tableDataFontStyle}>{data.suffix}</p>
                <p className={style.tableDataFontStyle}>
                  {format(new Date(`${data.lastModifiedDate}`), "MM-dd-yyyy")}
                </p>
                <p className={style.tableDataFontStyle}></p>
                <img
                  src={EditHcRow}
                  className={style.colorFileStyle}
                  onClick={() => {
                    setIsEdit(true);
                    setSelectedEntity(data);
                    getAddEntityDialog(true);
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
        <AddSuffixEntity
          getAddEntityDialog={getAddEntityDialog}
          IndustryId={industryId}
          isEdit={isEdit}
          seletedEntity={seletedEntity}
          selectedTitle={selectedTitle}
          getEntityData={getEntityData}
          tableEntityData={tableEntityData}
          getIndustryData={getIndustryData}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Suffix?"
        />
      )}
    </Fragment>
  );
};

export default SuffixByIndustries;
