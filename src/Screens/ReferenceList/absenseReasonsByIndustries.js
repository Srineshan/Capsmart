import React, { Fragment, useEffect, useState } from "react";
import style from "./index.module.scss";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditBlue from "./../../images/editBlue.png";
import AddAbsenseReasonsForHealthcare from "./addAbsenseReasonsForHealthcare";
import { GET, DELETE } from "./../dataSaver";
import { SuccessToaster, ErrorToaster } from "../../utils/toaster";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

const AbsenseReasonsByIndustries = ({
  getAddEntityDialog,
  showAddEntityDialog,
  isEdit,
  setIsEdit,
  sendLastDate,
  rotate,
}) => {
  const [sideMenu, setSideMenu] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(`${sideMenu?.[0]?.id}`);
  const [industryId, setIndustryId] = useState("");
  const [tableEntityData, setTableEntityData] = useState([]);
  const [deleteEntityId, setDeleteEntityId] = useState("");
  const [selectedAbsence, setSelectedAbsence] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const moment = require("moment-timezone");

  const entityAllData = async (industry) => {
    const { data: entities } = await GET(
      `entity-service/entityTypeMaster?industryId=${industry.id}`
    );
    const { data: absenceReason } = await GET(
      `entity-service/absenceReasonMaster?industryId=${industry.id}`
    );
    return await { ...industry, entities, absenceReason };
  };

  const getIndustryData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    setSideMenu([]);
    let allEntries = await Promise.all(industryData.map(entityAllData));
    setSideMenu(allEntries);
    let allDates = [];
    allEntries.forEach((e) => {
      let dates = e.absenceReason.map((row) => new Date(row.lastModifiedDate));
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
      "absenceReason",
      moment(lastModifiedDate).format("MMMM YYYY").toUpperCase()
    );

    var showList = JSON.parse(localStorage.getItem("showList") || "[]");
    if (showList.indexOf(lastModifiedDate) == -1) {
      showList.push(lastModifiedDate);
      localStorage.setItem("showList", JSON.stringify(showList));
    }
  };

  const getEntityData = async () => {
    const { data: entities } = await GET(
      `entity-service/absenceReasonMaster?industryId=${industryId}`
    );
    setTableEntityData(entities);
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
    await DELETE(`entity-service/absenceReasonMaster/${id}`)
      .then((response) => {
        SuccessToaster("Absence Deleted Successfully");
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
            sideMenu?.map((data) => {
              return (
                <div
                  className={
                    data?.industry === selectedTitle
                      ? `${style.industriesCardStyle} ${style.selectedIndustriesBackground} ${style.marginTop10}`
                      : `${style.industriesCardStyle} ${style.marginTop10}`
                  }
                  onClick={() => {
                    SelectedHandler(data);
                  }}
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
              );
            })}
        </div>

        <div className={style.industriesEntityCardStyle}>
          <div className={style.tableHeaderIndustriesEntity}>
            <p
              className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
            >
              ABSENCE REASONS FOR HEALTHCARE
            </p>
          </div>
          {!rotate &&
          tableEntityData?.filter((data) => data.absenceType === "PLANNED")
            .length !== 0 ? (
            <div className={style.terminationHeader}>
              <img
                src={IndustriesEntityFolder}
                alt="IndustriesEntityFolder"
                className={`${style.colorFileStyle} ${style.marginLeft5}`}
              />
              <p className={style.tableHeaderIndustriesFontStyle}>PLANNED</p>
            </div>
          ) : (
            <></>
          )}

          {!rotate &&
            tableEntityData
              ?.filter((data) => data.absenceType === "PLANNED")
              .map((data, innerIndex) => {
                return (
                  <>
                    <div
                      className={
                        innerIndex % 2 !== 0
                          ? `${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                          : `${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                      }
                    >
                      <p></p>
                      <p className={style.tableDataFontStyle}>
                        {data.absenceReason}
                      </p>
                      <p className={style.tableDataFontStyle}>
                        {`${data.notificationPeriod.numberOfDays}`} Days Prior
                      </p>
                      <img
                        src={EditBlue}
                        onClick={() => {
                          getAddEntityDialog(true);
                          setIsEdit(true);
                          setSelectedAbsence(data);
                        }}
                        className={style.colorFileStyle}
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
              })}

          {!rotate &&
          tableEntityData?.filter((data) => data.absenceType === "UNPLANNED")
            .length !== 0 ? (
            <div className={style.terminationHeader}>
              <img
                src={IndustriesEntityFolder}
                alt="IndustriesEntityFolder"
                className={`${style.colorFileStyle} ${style.marginLeft5}`}
              />
              <p className={style.tableHeaderIndustriesFontStyle}>UNPLANNED</p>
            </div>
          ) : (
            <></>
          )}

          {!rotate &&
            tableEntityData
              ?.filter((data) => data.absenceType === "UNPLANNED")
              .map((data, innerIndex) => {
                return (
                  <>
                    <div
                      className={
                        innerIndex % 2 !== 0
                          ? `${style.absenseLayer3Card} ${style.healthCareTableDataColor1} ${style.displayInRow}`
                          : `${style.absenseLayer3Card} ${style.healthCareTableDataColor2} ${style.displayInRow}`
                      }
                    >
                      <p></p>
                      <p className={style.tableDataFontStyle}>
                        {data.absenceReason}
                      </p>
                      <p className={style.tableDataFontStyle}>
                        {`${data.notificationPeriod.numberOfDays}`} Days Prior
                      </p>
                      <img
                        src={EditBlue}
                        onClick={() => {
                          getAddEntityDialog(true);
                          setIsEdit(true);
                          setSelectedAbsence(data);
                        }}
                        className={style.colorFileStyle}
                        alt=""
                      />
                      <img
                        src={DeleteHcRow}
                        className={style.colorFileStyle}
                        onClick={() => {
                          deleteHandler(data);
                        }}
                        alt=""
                      />{" "}
                    </div>
                  </>
                );
              })}
        </div>
      </div>

      {showAddEntityDialog && (
        <AddAbsenseReasonsForHealthcare
          getAddEntityDialog={getAddEntityDialog}
          IndustryId={industryId}
          isEdit={isEdit}
          selectedAbsence={selectedAbsence}
          getEntityData={getEntityData}
          tableEntityData={tableEntityData}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Absense Reasons?"
        />
      )}
    </Fragment>
  );
};

export default AbsenseReasonsByIndustries;
