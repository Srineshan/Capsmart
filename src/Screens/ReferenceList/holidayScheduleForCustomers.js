import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import AddNewEntity from "./../../images/addEntity.png";
import SelectArrow from "./../../images/selectArrow.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import CrossPink from "./../../images/crossPink.png";
import AddCompanyHolidayForCustomer from "./addCompanyHolidayForCustomer";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

import style from "./index.module.scss";

const HolidayScheduleForCustomers = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);
  const [holidayData, setHolidayData] = useState([]);
  const [holidayCustomerData, setHolidayCustomerData] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState({});
  const [country, setCountry] = useState("USA");
  const [years, setYears] = useState([]);
  const [isOpenLeftFolder, setIsOpenLeftFolder] = useState(false);
  const [leftFolderOpenIndex, setLeftFolderOpenIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [holidayId, setHolidayId] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedHolidayList, setSelectedHolidayList] = useState([]);

  const getAddCompanyHolidayDialog = (value) => {
    setShowAddCompanyDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    if (selectedIndustry !== undefined) {
      getIndustryData();
      getYearMasterData();
      getHolidayData();
    }
  }, [selectedIndustry]);

  const getIndustryData = async () => {
    const { data: Industry } = await GET(`entity-service/entity/${TenantID}`);
    setSelectedIndustry(Industry?.industryId?.id);
  };

  const getYearMasterData = async () => {
    const { data: yearsData } = await GET(
      `entity-service/yearMaster?industryId=${selectedIndustry}`
    );
    setYears(yearsData);
    setSelectedYear(yearsData?.[0]?.year);
  };

  const getHolidayMasterData = async (selectedYear) => {
    const { data: holidayData } = await GET(
      `entity-service/holidayMaster?industryId=${selectedIndustry}&country=${country}&year=${selectedYear}`
    );
    setHolidayData(holidayData);
  };

  const getHolidayData = async () => {
    const { data: holidayData } = await GET(
      `entity-service/holiday?country=${country}&&year=${selectedYear}`
    );
    setHolidayCustomerData(holidayData);
  };

  const handleDelete = (id) => {
    setHolidayId(id);
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
    await DELETE(`entity-service/holiday/${id}`)
      .then((response) => {
        SuccessToaster("Holiday Deleted Successfully");
      })
      .catch((error) => {
        ErrorToaster(error);
      });
    getHolidayData();
  };

  useEffect(() => {
    getHolidayMasterData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    getHolidayData();
  }, [selectedIndustry, selectedYear]);

  const handleSelectHolidays = (innerData) => {
    if (
      !selectedHolidayList
        ?.map((innerData) => innerData?.eventName)
        ?.includes(innerData?.eventName)
    ) {
      let temp = selectedHolidayList;
      temp.push({
        eventType: innerData?.eventType,
        stateName: innerData?.stateName,
        eventName: innerData?.eventName,
        eventDate: innerData?.eventDate,
        country: innerData?.country,
        year: innerData?.year,
        entityId: {
          id: TenantID,
        },
        customized: true,
      });
      setSelectedHolidayList(temp);
    }
  };

  const handleSave = async () => {
    await POST("entity-service/holiday", JSON.stringify(selectedHolidayList))
      .then((response) => {
        SuccessToaster("Holiday Added Successfully");
        getHolidayData();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };

  return (
    <Fragment>
      <div>
        <Navbar />
        <div className={style.margin20}>
          <div
            className={`${
              isExpanded ? style.bigCardGrid : style.smallCardGrid
            }`}
          >
            <div>
              <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                <div></div>
              </SideBar>
            </div>
            <div>
              <div className={`${style.displayInRow} ${style.marginTop10}`}>
                <div
                  className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
                >
                  HOLIDAY SCHEDULE FOR HEALTHCARE
                </div>
                <div></div>
                <div
                  className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}
                >
                  UPDATED ON FEB 16, 2022 16:45 EST
                </div>
                <div className={style.crossStyle}>
                  <Link
                    to="/Screens/ReferenceList/customerAdminDashboard"
                    className={style.linkStyle}
                  >
                    {" "}
                    <img
                      src={CrossPink}
                      className={`${style.colorFileStyle2} ${style.marginLeft20}`}
                      alt=""
                    />
                  </Link>
                </div>
              </div>
              <div className={style.marginTop35}>
                <div className={style.centreCardStyle}>
                  <div className={style.margin20}>
                    <div className={style.customersAdminColumngrid1}>
                      <div>
                        <div className={style.holidayScheduleHeader1}>
                          <p
                            className={`${style.holidayScheduleHeadertextStyle1} ${style.marginLeft20}`}
                          >
                            STANDARD LIST IN USE- DEFAULT
                          </p>
                        </div>
                        <div className={style.customersAdminCardStyle1}>
                          {years?.map((data, index) => (
                            <>
                              <div
                                className={`${style.boardCertificationSideRows} ${style.displayInRow}`}
                              >
                                <img
                                  src={IndustriesEntityFolder}
                                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                  alt=""
                                />
                                <p
                                  className={`${style.boardCertificationTextStyle2} ${style.marginLeft10} ${style.marginTop10}`}
                                >
                                  {data.year}
                                </p>
                                <img
                                  src={
                                    isOpenLeftFolder &&
                                    leftFolderOpenIndex === index
                                      ? CloseFolderBlue
                                      : OpenFolderBlue
                                  }
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle2} `}
                                  onClick={() => {
                                    setIsOpenLeftFolder(!isOpenLeftFolder);
                                    setLeftFolderOpenIndex(index);
                                    setSelectedYear(data.year);
                                  }}
                                />
                              </div>

                              {isOpenLeftFolder &&
                                leftFolderOpenIndex === index &&
                                holidayData
                                  ?.filter(
                                    (data) =>
                                      !holidayCustomerData
                                        ?.map((event) => event?.eventName)
                                        ?.includes(data?.eventName)
                                  )
                                  ?.map((data) => (
                                    <div
                                      className={`${style.holidayInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}  ${style.customersAdminBackground2} `}
                                    >
                                      <Checkbox
                                        onChange={() =>
                                          handleSelectHolidays(data)
                                        }
                                      />
                                      <div className={style.spaceBetween}>
                                        <p
                                          className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft10}`}
                                        >
                                          {data?.eventName}
                                        </p>
                                        <p
                                          className={`${style.holidayScheduleLeftCardTextStyle1} ${style.marginLeft5}`}
                                        >
                                          {format(
                                            new Date(data?.eventDate),
                                            "MMMM d, yyyy"
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                            </>
                          ))}
                        </div>
                      </div>
                      <div
                        className={style.customersAdminCardStyle2}
                        onClick={() => handleSave()}
                      >
                        <p
                          className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                        >
                          Select
                        </p>
                        <img
                          src={SelectArrow}
                          alt=""
                          className={`${style.colorFileStyle4}`}
                        />
                      </div>
                      <div>
                        {isSelected ? (
                          ""
                        ) : (
                          <div className={`${style.holidayScheduleHeader2}`}>
                            <p></p>
                            <p
                              className={`${style.holidayScheduleHeadertextStyle1}`}
                            >
                              MY CUSTOM LIST TO USE
                            </p>
                            <img
                              src={AddNewEntity}
                              alt=""
                              className={`${style.colorFileStyle} ${style.marginLeft150} `}
                              onClick={() => getAddCompanyHolidayDialog(true)}
                            ></img>
                          </div>
                        )}
                        <div>
                          {holidayCustomerData?.length !== 0 ? (
                            <div>
                              <div className={style.holidayRightCardStyle}>
                                <div
                                  className={
                                    style.tableHeaderTwoColumnsfrontRear
                                  }
                                >
                                  <p
                                    className={
                                      style.tableHeaderIndustriesFontStyle2
                                    }
                                  >
                                    HOLIDAY SCHEDULE BY HEALTHCARE
                                  </p>
                                </div>
                                {holidayCustomerData?.map((data, index) => (
                                  <>
                                    <div
                                      className={`${style.holidayFolderHeader} ${style.marginTop2}`}
                                    >
                                      <img
                                        src={IndustriesEntityFolder}
                                        alt="IndustriesEntityFolder"
                                        className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                      />
                                      <p
                                        className={`${style.tableHeaderIndustriesFontStyle3}  ${style.marginLeft20}`}
                                      >
                                        {" "}
                                        {data}
                                      </p>
                                      <p></p>
                                      <img
                                        src={AddNewEntity}
                                        alt=""
                                        className={`${style.colorFileStyle}`}
                                        onClick={() =>
                                          getAddCompanyHolidayDialog(true)
                                        }
                                      />
                                    </div>
                                    {holidayCustomerData?.map(
                                      (innerData) =>
                                        format(
                                          new Date(innerData?.eventDate),
                                          "yyyy"
                                        ) === data && (
                                          <div
                                            className={`${style.holidayScheduleTableData1} ${style.customersAdminBackground2} ${style.displayInRow}`}
                                          >
                                            <p
                                              className={
                                                style.tableDataFontStyle
                                              }
                                            >
                                              {format(
                                                new Date(innerData?.eventDate),
                                                "MMMM d"
                                              )}{" "}
                                            </p>
                                            <p
                                              className={
                                                style.tableDataFontStyle
                                              }
                                            >
                                              {innerData?.eventName}
                                            </p>
                                            <p
                                              className={
                                                style.tableDataFontStyle
                                              }
                                            >
                                              {innerData?.stateName}
                                            </p>
                                            <p
                                              className={
                                                style.tableDataFontStyle
                                              }
                                            >
                                              {innerData?.eventType}
                                            </p>
                                            <img
                                              src={EditHcRow}
                                              alt=""
                                              className={style.colorFileStyle}
                                              onClick={() => {
                                                setIsEdit(true);
                                                setSelectedHoliday(innerData);
                                                setShowAddCompanyDialog(true);
                                              }}
                                            />
                                            <img
                                              src={DeleteHcRow}
                                              alt=""
                                              className={style.colorFileStyle}
                                              onClick={() => {
                                                handleDelete(innerData?.id);
                                              }}
                                            />
                                          </div>
                                        )
                                    )}
                                  </>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className={style.customersAdminCardStyle3}>
                              <p
                                className={style.holidayScheduleCardtextStyle1}
                              >
                                if you would like to setup your custom list for
                                your site(s) you can select from the default
                                list on the left, edit to change labels as
                                needed, and also add new departments/ service
                                area by clicking on the add icon
                              </p>
                            </div>
                          )}
                        </div>
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
      </div>

      {showAddCompanyDialog && (
        <AddCompanyHolidayForCustomer
          getAddCompanyHolidayDialog={getAddCompanyHolidayDialog}
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

export default HolidayScheduleForCustomers;
