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
import LevelTwoHeader from "../../Components/LevelTwoHeader";

const HolidayScheduleForCustomers = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddCompanyDialog, setShowAddCompanyDialog] = useState(false);

  const [holidayDataMaster, setHolidayDataMaster] = useState([]);
  const [holidayCustomerData, setHolidayCustomerData] = useState([]);

  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [country, setCountry] = useState("USA");
  const [years, setYears] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [holidayId, setHolidayId] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedHolidayMaster, setSelectedHolidayMaster] = useState({});
  const [selectedHolidayItems, setSelectedHolidayItems] = useState([]);
  const [entityId, setEntityId] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const getAddCompanyHolidayDialog = (value) => {
    setShowAddCompanyDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    if (selectedIndustry !== undefined) {
      getIndustryData();
      getYearMasterData();
    }
  }, [selectedIndustry]);

  useEffect(() => {
    if (entityId !== "" && entityId !== undefined) {
      getLastModifiedDate();
    }
  }, [entityId]);

  const getIndustryData = async () => {
    const { data: entity } = await GET(`entity-service/entity/${TenantID}`);
    setSelectedIndustry(entity?.industryId?.id);
    setEntityId(entity?.id);
  };

  const getLastModifiedDate = async () => {
    const { data: lastModifiedDate } = await GET(
      `entity-service/referenceList/entity/${entityId}`
    );
    const date = new Date(lastModifiedDate.holidayList?.lastModified);
    setLastUpdatedDate(format(date, "MMM d, yyyy HH:mm"));
  };

  const getYearMasterData = async () => {
    const { data: yearsData } = await GET(
      `entity-service/yearMaster?industryId=${selectedIndustry}`
    );
    setYears(yearsData);
    setSelectedYear(yearsData?.[0]?.year);
  };

  const getHolidayMasterData = async () => {
    const { data: holidayDataMaster } = await GET(
      `entity-service/holidayMaster?industryId=${selectedIndustry}&country=${country}&year=${selectedYear}`
    );
    setHolidayDataMaster(holidayDataMaster);
  };

  const getHolidayData = async () => {
    const { data: holidayData } = await GET(
      `entity-service/holiday?country=${country}&year=${selectedYear}`
    );
    setHolidayCustomerData(holidayData);
  };

  const handleSelectHolidayMaster = (e, innerData) => {
    if (e.target.checked) {
      setSelectedHolidayItems([...selectedHolidayItems, innerData]);
    } else {
      setSelectedHolidayItems(
        selectedHolidayItems
          ?.filter((data) => data?.id !== innerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const handlePostHoliday = async () => {
    setIsSelected(true);

    let data = selectedHolidayItems?.map((data) => ({
      ...data,
      customized: true,
      entityId: { id: TenantID },
    }));
    if (selectedHolidayItems?.length !== 0) {
      await POST("entity-service/holiday", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("Holiday Added Successfully");
          getHolidayData();
          setSelectedHolidayItems([]);
          getLastModifiedDate();
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some Holiday from Standard List to add in My Custom List"
      );
    }
  };

  const handleDeleteHoliday = async (id) => {
    await DELETE(`entity-service/holiday/${id}`)
      .then((response) => {
        SuccessToaster("Holiday Deleted Successfully");
        getHolidayData();
        getLastModifiedDate();
      })
      .catch((error) => {
        ErrorToaster(error);
      });
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
      // deleteHoliday(holidayId);
    }
  };

  useEffect(() => {
    if (selectedYear !== undefined) {
      getHolidayMasterData();
      getHolidayData();
    }
  }, [selectedYear]);

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
              <LevelTwoHeader
                heading={"HOLIDAY SCHEDULE FOR HEALTHCARE"}
                updatedTime={`UPDATED ON ${lastUpdatedDate.toUpperCase()} EST`}
                path={"/Screens/ReferenceList/customerAdminDashboard"}
                callingFrom={"Customer Admin"}
                needHeader={true}
              />

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
                                className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}
                                key={index}
                              >
                                <img
                                  src={IndustriesEntityFolder}
                                  alt=""
                                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                />
                                <p
                                  className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                                >
                                  {data?.year}
                                </p>
                                <img
                                  src={
                                    selectedIndex === index
                                      ? CloseFolderBlue
                                      : OpenFolderBlue
                                  }
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                                  onClick={() => {
                                    setSelectedIndex(index);
                                    setSelectedYear(data?.year);
                                  }}
                                />
                              </div>
                              {selectedIndex === index &&
                                holidayDataMaster
                                  ?.filter(
                                    (data) =>
                                      !holidayCustomerData.some(
                                        (customerData) =>
                                          customerData?.eventName ===
                                          data?.eventName
                                      )
                                  )
                                  ?.map((data, index) => (
                                    <div
                                      className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                      key={index}
                                    >
                                      <Checkbox
                                        checked={
                                          selectedHolidayItems?.filter(
                                            (innerData) =>
                                              innerData?.id === data?.id
                                          )?.length !== 0
                                        }
                                        onChange={(e) =>
                                          handleSelectHolidayMaster(e, data)
                                        }
                                      />
                                      <p
                                        className={`${style.TextStyle4} ${style.marginLeft5}`}
                                      >
                                        {data?.eventName}
                                      </p>
                                      <p
                                        className={`${style.TextStyle4} ${style.marginLeft5}`}
                                      >
                                        {format(
                                          new Date(data?.eventDate),
                                          "MMMM d, yyyy"
                                        )}
                                      </p>
                                    </div>
                                  ))}
                            </>
                          ))}
                        </div>
                      </div>
                      <div
                        className={style.customersAdminCardStyle2}
                        onClick={() => {
                          handlePostHoliday();
                        }}
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
                              onClick={() => {
                                getAddCompanyHolidayDialog(true);
                                setIsEdit(false);
                              }}
                            ></img>
                          </div>
                        )}

                        <div className={style.customersAdminCardStyle3}>
                          {holidayCustomerData?.length !== 0 ? (
                            years?.map((data, index) => {
                              return (
                                <>
                                  <div>
                                    <div
                                      className={`${style.ContractedServiceProviderHeaderInsideContainer} ${style.displayInRow}`}
                                    >
                                      <img
                                        src={IndustriesEntityFolder}
                                        alt=""
                                        className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                      />
                                      <p
                                        className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                                      >
                                        {data?.year}
                                      </p>
                                      <img
                                        src={
                                          selectedIndex === index
                                            ? CloseFolderBlue
                                            : OpenFolderBlue
                                        }
                                        alt="OpenFolder"
                                        className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                                        onClick={() => {
                                          setSelectedIndex(index);
                                        }}
                                      />
                                    </div>
                                    {selectedIndex === index &&
                                      holidayCustomerData?.map(
                                        (data, index) => {
                                          return (
                                            <div
                                              className={`${style.contractedServiceProviderCard} ${style.healthCareTableDataColor1} ${style.spaceBetween}`}
                                              key={index}
                                            >
                                              <p
                                                className={
                                                  style.tableDataFontStyle
                                                }
                                              >
                                                {format(
                                                  new Date(data?.eventDate),
                                                  "MMMM d"
                                                )}{" "}
                                              </p>
                                              <p
                                                className={
                                                  style.tableDataFontStyle
                                                }
                                              >
                                                {data?.eventName}
                                              </p>
                                              <p
                                                className={
                                                  style.tableDataFontStyle
                                                }
                                              >
                                                {data?.stateName}
                                              </p>
                                              <p
                                                className={
                                                  style.tableDataFontStyle
                                                }
                                              >
                                                {data?.eventType}
                                              </p>

                                              <div
                                                className={style.displayInRow}
                                              >
                                                <img
                                                  src={EditHcRow}
                                                  alt=""
                                                  className={
                                                    style.colorFileStyle
                                                  }
                                                  onClick={() => {
                                                    setIsEdit(true);
                                                    getAddCompanyHolidayDialog(
                                                      true
                                                    );
                                                    setSelectedHolidayMaster(
                                                      data
                                                    );
                                                  }}
                                                />
                                                <img
                                                  src={DeleteHcRow}
                                                  alt=""
                                                  className={`${style.colorFileStyle} ${style.marginLeft20}`}
                                                  onClick={() =>
                                                    handleDeleteHoliday(
                                                      data?.id
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                  </div>
                                </>
                              );
                            })
                          ) : (
                            <p className={style.holidayScheduleCardtextStyle1}>
                              if you would like to setup your custom list for
                              your site(s) you can select from the default list
                              on the left, edit to change labels as needed, and
                              also add new departments/ service area by clicking
                              on the add icon
                            </p>
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
          selectedHoliday={selectedHolidayMaster}
          selectedYear={selectedYear}
          getHolidayData={getHolidayData}
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
