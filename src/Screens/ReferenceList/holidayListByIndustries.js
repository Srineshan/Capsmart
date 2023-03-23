import React, { Fragment, useEffect, useState } from "react";
import AddCompanyHoliday from "./addCompanyHoliday";
import AddHolidayType from "./addHolidayType";
import { format } from "date-fns";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";
import AddNewEntity from "./../../images/addEntity.png";
import OpenFolder from "./../../images/openFolder.png";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import TransparentFolder from "./../../images/transparentFolder.png";
import ArrowDown from "./../../images/arrowDown.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import { GET, DELETE } from "./../dataSaver";
import DeleteConfirmation from "../../Components/DeleteConfirmation";

import style from "./index.module.scss";
import { index } from "d3";
import Navbar from "../../Components/Navbar";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import SideBar from "../../Components/Sidebar";

const BoardCertification = () => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [showAddCompanyHolidayDialog, setShowAddCompanyHolidayDialog] =
    useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [holidayData, setHolidayData] = useState([]);
  const [country, setCountry] = useState("USA");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState({});
  const [holidayId, setHolidayId] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [allData, setAllData] = useState([]);
  const [clicked, setClicked] = useState(0);
  const [industryData, setIndustryData] = useState({});
  const [industryId, setIndustryId] = useState("");
  const [collapse, setCollapse] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [industryList, setIndustryList] = useState([]);

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getAddHolidayDialog = (value) => {
    setShowAddCompanyHolidayDialog(value);
  };

  const YearAllData = async (industry) => {
    const { data: year } = await GET(
      `entity-service/yearMaster?industryId=${industry.id}`
    );
    return await { ...industry, year };
  };

  const getIndustryData = async () => {
    const { data: industryData } = await GET(`entity-service/industryMaster`);
    setIndustryList(industryData);
    let AllEntries = await Promise.all(industryData.map(YearAllData));
    setAllData(AllEntries);
  };

  const getHolidayData = async () => {
    const { data: holidayData } = await GET(
      `entity-service/holidayMaster?industryId=${industryId}&country=${country}&year=${selectedYear}`
    );
    setHolidayData(holidayData);

    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/master`
    );

    const date = new Date(lastModifiedDate.holidayList?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const handleToggle = (index, data) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
    setIndustryData(data);
    setSelectedIndustry(data.industry);
    setIndustryId(data.id);
  };

  const SelectedYearHandler = (data) => {
    setSelectedYear(data.year);
    setCollapse(!collapse);
  };

  const handleToggleYear = () => {
    setCollapse(!collapse);
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
  }, [selectedYear, selectedIndustry]);

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    setIndustryId(allData?.[0]?.id);
    setSelectedIndustry(allData?.[0]?.industry);
    // setSelectedYear(allData?.[0]?.year?.[0].year);
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
              heading={`HOLIDAY SCHEDULE BY INDUSTRIES`}
              updatedTime={`UPDATED ON ${lastUpdatedDate}`}
              path={"/Screens/ReferenceList/superAdminDashboard"}
              callingFrom={"Super Admin"}
              needHeader={true}
              getAddEntityDialog={getAddEntityDialog}
              Title={"ADD HOLIDAY"}
            />

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.centreCardColumnsGrid}>
                    <div className={style.displayInCol}>
                      {allData?.map((data, index) => {
                        return (
                          <>
                            <div
                              className={`${style.boardCertificationSideRows} ${style.displayInRow}`}
                              key={index}
                              onClick={() => handleToggle(index, data)}
                            >
                              <img
                                src={BlackBorderFolder}
                                alt="HealthCareFolder"
                                className={`${style.colorFileStyle} ${style.marginLeft5}`}
                              />
                              <p
                                className={`${style.boardCertificationTextStyle1} ${style.marginLeft20}`}
                              >
                                {data?.industry}
                              </p>
                              {clicked === index ? (
                                <p
                                  className={`${style.boardCertificationTextStyle1} ${style.marginRight20}`}
                                >
                                  -
                                </p>
                              ) : (
                                <img
                                  src={OpenFolder}
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle} ${style.reduce10Left}`}
                                />
                              )}
                            </div>

                            <div
                              className={
                                clicked === index
                                  ? `${style.listWrapper} ${style.open}`
                                  : `${style.listWrapper}`
                              }
                            >
                              <div
                                className={`${style.boardCertificationInnerFolderRows} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
                                onClick={() => handleToggleYear()}
                              >
                                <img
                                  src={TransparentFolder}
                                  className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                  alt=""
                                />
                                <p
                                  className={`${style.healthCareHeaderTextStyle} ${style.textColorBlue} `}
                                >
                                  YEAR - {selectedYear}
                                </p>
                                <img
                                  src={ArrowDown}
                                  className={`${style.colorFileStyle3}`}
                                  alt=""
                                />
                                <p></p>
                              </div>
                              {collapse &&
                                data?.year.map((year, indx) => {
                                  return (
                                    <>
                                      <div
                                        className={`${style.boardCertificationInnerFolderRows} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
                                        key={indx}
                                        onClick={() =>
                                          SelectedYearHandler(year)
                                        }
                                      >
                                        <img
                                          src={TransparentFolder}
                                          className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                          alt=""
                                        />
                                        <p
                                          className={
                                            year?.year === selectedYear
                                              ? `${style.healthCareHeaderTextStyle} ${style.textColorBlue} `
                                              : `${style.healthCareHeaderTextStyle}`
                                          }
                                        >
                                          {`YEAR - ${year.year}`}
                                        </p>
                                        <p></p>
                                      </div>
                                    </>
                                  );
                                })}

                              <div
                                className={`${style.boardCertificationInnerFolderRows} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
                              >
                                <img
                                  src={TransparentFolder}
                                  className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                  alt=""
                                />
                                <p className={style.healthCareHeaderTextStyle2}>
                                  USA
                                </p>
                                <img
                                  src={ArrowDown}
                                  className={`${style.colorFileStyle3}`}
                                  alt=""
                                />
                                <p></p>
                              </div>
                            </div>
                          </>
                        );
                      })}
                      {/* {industryList?.map((data, index) => {
            console.log(data);
          })} */}
                    </div>

                    <div className={style.industriesEntityCardStyle}>
                      <div className={style.tableHeaderTwoColumnsfrontRear}>
                        <p
                          className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft40}`}
                        >
                          HOLIDAY SCHEDULE BY {selectedIndustry}
                        </p>
                        <img
                          src={AddNewEntity}
                          onClick={() => {
                            setIsEdit(false);
                            getAddHolidayDialog(true);
                          }}
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
                        <p className={style.tableHeaderIndustriesFontStyle5}>
                          USA {selectedYear}
                        </p>
                      </div>
                      {holidayData?.map((data, index) => (
                        <div
                          className={
                            index % 2 !== 0
                              ? `${style.holidayScheduleTableData} ${style.holidayTableDataColor1} ${style.displayInRow}`
                              : `${style.holidayScheduleTableData} ${style.holidayTableDataColor2} ${style.displayInRow}`
                          }
                          key={index}
                        >
                          <p></p>
                          <p className={style.tableDataFontStyle}>
                            {data?.eventName}
                          </p>
                          <p className={style.tableDataFontStyle}>
                            {format(new Date(data?.eventDate), "MMMM d, yyyy")}
                          </p>
                          <p className={style.tableDataFontStyle}>
                            {format(new Date(data?.eventDate), "EEEE")}
                          </p>
                          <p
                            className={`${style.tableDataFontStyle} ${style.textCapitalize}`}
                          >
                            {(data?.eventType).toLowerCase()}
                          </p>
                          <p className={style.tableDataFontStyle}>
                            {data?.stateName}
                          </p>
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
        <AddHolidayType getAddEntityDialog={getAddEntityDialog} />
      )}

      {showAddCompanyHolidayDialog && (
        <AddCompanyHoliday
          getAddHolidayDialog={getAddHolidayDialog}
          selectedIndustry={selectedIndustry}
          isEdit={isEdit}
          selectedHoliday={selectedHoliday}
          holidayData={holidayData}
          IndustryId={industryId}
          getHolidayData={getHolidayData}
          selectedYear={selectedYear}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          getShowDeleteConfirmation={getShowDeleteConfirmation}
          getDeleteConfirmation={getDeleteConfirmation}
          confirmationText="Do you want to delete this Holiday ?"
        />
      )}
    </Fragment>
  );
};

export default BoardCertification;
