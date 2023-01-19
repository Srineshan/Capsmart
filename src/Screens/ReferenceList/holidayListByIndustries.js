import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import AddCompanyHoliday from "./addCompanyHoliday";
import { format } from "date-fns";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import AddNewEntity from "./../../images/addEntity.png";
import AddRefresh from "./../../images/refreshEntity.png";
import OpenFolder from "./../../images/openFolder.png";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import BlueFolder from "./../../images/blueFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import TransparentFolder from "./../../images/transparentFolder.png";
import ArrowDown from "./../../images/arrowDown.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE } from "./../dataSaver";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

import style from "./index.module.scss";

const BoardCertification = ({
  getAddEntityDialog,
  showAddEntityDialog,
  rotate,
  sendLastDate,
}) => {
  const [showAddCompanyHolidayDialog, setShowAddCompanyHolidayDialog] =
    useState(false);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState({});
  const [holidayData, setHolidayData] = useState([]);
  const [country, setCountry] = useState("USA");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState({});
  const [holidayId, setHolidayId] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const moment = require("moment-timezone");

  const getAddCompanyHolidayDialog = (value) => {
    setShowAddCompanyHolidayDialog(value);
  };

  const getIndustryData = async () => {
    const { data: data } = await GET(`entity-service/industryMaster`);
    setSelectedIndustry(
      data
        ?.filter((data) => data?.industry === "HEALTHCARE")
        ?.map((data) => data)
    );
  };

  const getHolidayData = async () => {
    const { data: holidayData } = await GET(
      `entity-service/holidayMaster?industryId=${selectedIndustry[0].id}&country=${country}`
    );
    setHolidayData(
      holidayData
        ?.filter((data) => data?.country === "USA")
        ?.map((data) => data)
    );
    let lastModifiedDate = "Fri Dec 30 2022 17:22:23 GMT";
    sendLastDate(
      moment
        .tz(lastModifiedDate, "America/New_York")
        .format("MMM D, YYYY hh:mm z")
    );
    localStorage.setItem(
      "holidayMaster",
      moment(lastModifiedDate).format("MMMM YYYY").toUpperCase()
    );

    var showList = JSON.parse(localStorage.getItem("showList") || "[]");
    if (showList.indexOf(lastModifiedDate) == -1) {
      showList.push(lastModifiedDate);
      localStorage.setItem("showList", JSON.stringify(showList));
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
  };

  const getDeleteConfirmation = (value) => {
    if (value) {
      deleteHoliday(holidayId);
    }
  };

  const deleteHoliday = async (id) => {
    await DELETE(`entity-service/holidayMaster/${id}`)
      .then((response) => {
        SuccessToaster("Holiday Deleted Successfully");
      })
      .catch((error) => {
        ErrorToaster(error);
      });
    getHolidayData();
  };

  useEffect(() => {
    getHolidayData();
  }, [selectedIndustry, showAddCompanyHolidayDialog]);

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    if (rotate) {
      getHolidayData();
    }
  }, [rotate]);

  return (
    <Fragment>
      <div className={style.departmentCardColumnsGrid}>
        <div>
          <div
            className={`${style.boardCertificationSideRows} ${style.displayInRow}`}
          >
            <img
              src={BlackBorderFolder}
              alt="HealthCareFolder"
              className={`${style.colorFileStyle} ${style.marginLeft5}`}
            />
            <p
              className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}
            >
              HEALTHCARE
            </p>
            <p
              className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
            >
              -
            </p>
          </div>
          <div
            className={`${style.boardCertificationInnerFolderRows} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
          >
            <img
              src={TransparentFolder}
              className={`${style.colorFileStyle2} ${style.marginLeft15}`}
              alt=""
            />
            <p
              className={`${style.healthCareHeaderTextStyle} ${style.textColorBlue} `}
            >
              YEAR - 2021
            </p>
            <img
              src={ArrowDown}
              className={`${style.colorFileStyle3}`}
              alt=""
            />
            <p></p>
          </div>
          <div
            className={`${style.boardCertificationInnerFolderRows} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
          >
            <img
              src={TransparentFolder}
              className={`${style.colorFileStyle2} ${style.marginLeft15}`}
              alt=""
            />
            <p className={style.healthCareHeaderTextStyle2}>COUNTRY</p>
            <img
              src={ArrowDown}
              className={`${style.colorFileStyle3}`}
              alt=""
            />
            <p></p>
          </div>
          <div
            className={`${style.boardCertificationSideRows} ${style.displayInRow}`}
          >
            <img
              src={BlackBorderFolder}
              alt="FinanceFolder"
              className={`${style.colorFileStyle} ${style.marginLeft5}`}
            />
            <p
              className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}
            >
              FINANCE
            </p>
            <img
              src={OpenFolder}
              alt="OpenFolder"
              className={`${style.colorFileStyle} ${style.reduce10Left}`}
            />
          </div>
          <div
            className={`${style.boardCertificationSideRows} ${style.displayInRow}`}
          >
            <img
              src={BlackBorderFolder}
              alt="GovernmentFolder"
              className={`${style.colorFileStyle} ${style.marginLeft5}`}
            />
            <p
              className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}
            >
              GOVERNMENT
            </p>
            <img
              src={OpenFolder}
              alt="OpenFolder"
              className={`${style.colorFileStyle} ${style.reduce10Left}`}
            />
          </div>
        </div>
        <div className={style.industriesEntityCardStyle}>
          <div className={style.tableHeaderTwoColumnsfrontRear}>
            <p
              className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
            >
              HOLIDAY SCHEDULE BY HEALTHCARE
            </p>
            <img
              src={AddNewEntity}
              onClick={() => getAddEntityDialog(true)}
              className={`${style.colorFileStyle}`}
              alt=""
            />
          </div>
          <div className={style.holidayFolderHeader}>
            <img
              src={IndustriesEntityFolder}
              alt="IndustriesEntityFolder"
              className={`${style.colorFileStyle} ${style.marginLeft5}`}
            />
            <p className={style.tableHeaderIndustriesFontStyle5}>USA 2022</p>
          </div>
          {!rotate &&
            holidayData?.map((data, index) => (
              <div
                className={`${style.holidayScheduleTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                key={index}
              >
                <p></p>
                <p className={style.tableDataFontStyle}>{data?.eventName}</p>
                <p className={style.tableDataFontStyle}>
                  {format(new Date(data?.eventDate), "MMMM d, yyyy")}
                </p>
                <p className={style.tableDataFontStyle}>
                  {format(new Date(data?.eventDate), "EEEE")}
                </p>
                <p className={style.tableDataFontStyle}>{data?.eventType}</p>
                <p className={style.tableDataFontStyle}>{data?.stateName}</p>
                <img
                  src={EditHcRow}
                  className={style.colorFileStyle}
                  onClick={() => {
                    setIsEdit(true);
                    setSelectedHoliday(data);
                    setShowAddCompanyHolidayDialog(true);
                  }}
                  alt=""
                />
                <img
                  src={DeleteHcRow}
                  className={style.colorFileStyle}
                  onClick={() => {
                    handleDelete();
                    setHolidayId(data?.id);
                  }}
                  alt=""
                />
              </div>
            ))}
        </div>
      </div>
      {showAddEntityDialog && (
        <AddCompanyHoliday
          getAddEntityDialog={getAddEntityDialog}
          selectedIndustry={selectedIndustry}
          isEdit={isEdit}
          selectedHoliday={selectedHoliday}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this holiday?"
        />
      )}
    </Fragment>
  );
};

export default BoardCertification;
