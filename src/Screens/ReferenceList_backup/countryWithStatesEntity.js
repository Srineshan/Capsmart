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
import ArrowDown from "./../../images/arrowDown.png";

import style from "./index.module.scss";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import CommonPurpleCheckBox from "../../Components/CommonFields/CommonPurpleCheckBox";
import { formatInTimeZone } from "date-fns-tz";
import { siteTimeZone, timeZoneAbbreviation } from "../../utils/formatting";
import AddStatesEntity from "./addStatesEntity";

const CountryWithStatesEntity = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddStateDialog, setShowAddStateDialog] = useState(false);

  const [countryDataMaster, setCountryDataMaster] = useState([]);
  const [stateMasterData, setStateMasterData] = useState([]);
  const [stateEntityData, setStateEntityData] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedStateMaster, setSelectedStateMaster] = useState({});
  const [selectedStateEntity, setSelectedStateEntity] = useState([]);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [selectAllList, setSelectAllList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);


  const getAddStateDialog = (value) => {
    setShowAddStateDialog(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  useEffect(() => {
    getCountryMasterData();
  }, []);

  useEffect(() => {
    if (selectedCountry !== "" && selectedCountry !== undefined) {
      getStateMasterData()
      getStateEntityData()
    }
  }, [selectedCountry]);

  const getCountryMasterData = async () => {
    const { data: countryDataMaster } = await GET(`entity-service/countryMaster`);
    setCountryDataMaster(countryDataMaster);
  };

  const getStateMasterData = async () => {
    const { data: stateMasterData } = await GET(`entity-service/stateMaster?countryId=${selectedCountry}`);
    setStateMasterData(stateMasterData);
  };

  const getStateEntityData = async () => {
    const { data: stateData } = await GET(
      `entity-service/state?X-tenantID=${TenantID}&countryId=${selectedCountry}`
    );
    setStateEntityData(stateData);
  };

  const handleClickSelected = (index, data) => {
    if (selectedIndex === index) {
      return setSelectedIndex("0");
    }
    setSelectedIndex(index);
    setSelectedCountry(data?.id);
  };

  const handleSelectStateMaster = (e, innerData) => {
    if (e.target.checked) {
      setSelectedStateEntity([...selectedStateEntity, innerData]);
    } else {
      setSelectedStateEntity(
        selectedStateEntity
          ?.filter((data) => data?.id !== innerData?.id)
          ?.map((data) => data)
      );
    }
  };

  const selectAll = (value) => {
    if (value) {
      let tempStates = stateMasterData
        ?.filter(
          (data) =>
            !stateEntityData.some(
              (customerData) => customerData?.state === data?.state
            )
        )
        ?.map((data) => {
          return { ...data };
        });
      setSelectedStateEntity(tempStates);
    } else {
      setSelectedStateEntity([]);
    }
    setCheckedAll(value);
  };

  useEffect(() => {
    let tempStates = stateMasterData
      ?.filter(
        (data) =>
          !stateEntityData.some(
            (customerData) => customerData?.state === data?.state
          )
      )
      ?.map((data) => {
        return { ...data };
      });

    setSelectAllList(tempStates);

    let allChecked = true;

    if (tempStates.length > selectedStateEntity.length) {
      allChecked = false;
    }

    if (allChecked) {
      setCheckedAll(true);
    } else {
      setCheckedAll(false);
    }
  }, [selectedStateEntity]);

  const handlePostStates = async () => {
    setIsSelected(true);

    let data = selectedStateEntity?.map((data) => {
      let revisedData = { ...data }
      delete revisedData.id;
      return {
        ...revisedData,
        "entityId": { "id": TenantID },
        "countryId": { "id": selectedCountry },
      }
    });

    // console.log("PostData", data)
    if (selectedStateEntity?.length !== 0) {
      await POST("entity-service/state", JSON.stringify(data))
        .then((response) => {
          SuccessToaster("State Added Successfully");
          setSelectedStateEntity([]);
          getStateEntityData()
        })
        .catch((error) => {
          ErrorToaster(error);
        });
    } else {
      ErrorToaster(
        "Select some State from Standard List to add in My Custom List"
      );
    }
  };

  const handleDeleteState = async (id) => {
    await DELETE(`entity-service/state/${id}`)
      .then((response) => {
        SuccessToaster("State Deleted Successfully");
        getStateEntityData()
      })
      .catch((error) => {
        ErrorToaster(error);
      });
  };


  const getShowDeleteConfirmation = (value) => {
    setShowDeleteConfirmation(value);
  };

  const getDeleteConfirmation = (value) => {
    if (value) {
      // deleteHoliday(holidayId);
    }
  };

  return (
    <Fragment>
      <div>
        <Navbar />
        <div className={style.margin20}>
          <div
            className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid
              }`}
          >
            <div>
              <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                <div></div>
              </SideBar>
            </div>
            <div>
              <div className={`${style.displayInRow} ${style.marginTop10}`}>
                <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                  COUNTRY
                </div>
                <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                  UPDATED ON FEB 16, 2022 16:45 EST
                </div>
                <div className={`${style.crossStyle} ${style.displayInRow}`}>
                  <img
                    src={
                      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/125px-Flag_of_the_United_States.svg.png"
                    }
                    alt="refresh"
                    className={`${style.headerFlag}`}
                  />
                  <span className={`${style.headerCountryName} ${style.marginLeft10}`}>USA</span>
                  <img
                    src={ArrowDown}
                    className={`${style.colorFileStyle2} ${style.headerArrow} ${style.marginLeft20}  ${style.marginTop10}`}
                    alt=""
                  />
                  <button
                    className={`${style.buttonStyle} ${style.marginLeft20}`}
                    onClick={() => {
                      // getAddCountryDialog(true)
                    }}
                  >
                    {`ADD COUNTRY`}
                  </button>

                  <Link to={"/Screens/ReferenceList/customerAdminDashboard"}><Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /></Link>

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
                          {countryDataMaster?.map((data, index) => (
                            <>
                              <div
                                className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}
                                key={index}
                                onClick={() => handleClickSelected(index, data)}
                              >
                                <img
                                  src={IndustriesEntityFolder}
                                  alt=""
                                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                />
                                <p
                                  className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10} ${style.textUppercase}`}
                                >
                                  {data?.country}
                                </p>
                                <img
                                  src={
                                    selectedIndex === index
                                      ? CloseFolderBlue
                                      : OpenFolderBlue
                                  }
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                                />
                              </div>

                              <div
                                className={
                                  selectedIndex === index
                                    ? `${style.listWrapper} ${style.open}`
                                    : `${style.listWrapper}`
                                }
                              >
                                {stateMasterData?.filter(
                                  (data) =>
                                    !stateEntityData.some(
                                      (customerData) =>
                                        customerData?.state ===
                                        data?.state
                                    )
                                )?.length > 1 ? (
                                  <>
                                    <div
                                      className={`${style.customersAdminInnerRowsStyle1}  ${style.customersAdminBackground3} ${style.displayInRow}`}
                                    >
                                      <CommonPurpleCheckBox
                                        name="allSelect"
                                        onChange={(event) =>
                                          selectAll(event.target.checked)
                                        }
                                        checked={
                                          selectAllList.length !== 0
                                            ? checkedAll
                                            : false
                                        }
                                      />
                                      <p
                                        className={`${style.TextStyle4} ${style.marginLeft10}`}
                                      >
                                        SELECT ALL
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}

                                {stateMasterData
                                  ?.filter(
                                    (data) =>
                                      !stateEntityData.some(
                                        (customerData) =>
                                          customerData?.state ===
                                          data?.state
                                      )
                                  )
                                  ?.map((data, index) => (
                                    <div className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`} key={index}>
                                      <CommonPurpleCheckBox
                                        checked={
                                          selectedStateEntity?.filter(
                                            (innerData) =>
                                              innerData?.id === data?.id
                                          )?.length !== 0
                                        }
                                        onChange={(e) =>
                                          handleSelectStateMaster(e, data)
                                        }
                                      />
                                      <p
                                        className={`${style.TextStyle4} ${style.marginLeft5}`}
                                      >
                                        {data?.state}
                                      </p>
                                      <p
                                        className={`${style.TextStyle4} ${style.marginLeft5}`}
                                      >
                                        {/* {format(new Date(`${data?.eventDate}T00:00`), "MMMM d, yyyy")} */}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                      <div
                        className={style.customersAdminCardStyle2}
                        onClick={() => {
                          handlePostStates();
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
                              className={`${style.colorFileStyle} ${style.marginLeft70} `}
                              onClick={() => {
                                getAddStateDialog(true);
                                setIsEdit(false);
                              }}
                            ></img>
                          </div>
                        )}

                        <div className={style.customersAdminCardStyle3}>
                          {stateEntityData?.length !== 0 ? (
                            countryDataMaster?.map((data, index) => (
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
                                      className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10} ${style.textUppercase}`}
                                    >
                                      {data?.country}
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
                                        setSelectedCountry(data?.id);
                                      }}
                                    />
                                  </div>

                                  {selectedIndex === index &&
                                    stateEntityData?.map((data, index) => {
                                      return (
                                        <div className={
                                          index % 2 !== 0
                                            ? `${style.holidayScheduleTableData1} ${style.customersAdminBackground1} ${style.spaceBetween}`
                                            : `${style.holidayScheduleTableData1} ${style.customersAdminBackground2} ${style.spaceBetween}`
                                        } key={index}>
                                          <p
                                            className={`${style.tableDataFontStyle} ${style.textCapitalize}`}
                                          >
                                            {data?.state}
                                          </p>
                                          <p
                                            className={style.tableDataFontStyle}
                                          >
                                            {data?.stateName}
                                          </p>
                                          <p
                                            className={`${style.tableDataFontStyle} ${style.textCapitalize}`}
                                          >
                                          </p>
                                          <p
                                            className={`${style.tableDataFontStyle} ${style.textCapitalize}`}
                                          >
                                          </p>

                                          <div className={style.displayInRow}>
                                            <img
                                              src={EditHcRow}
                                              alt=""
                                              className={style.colorFileStyle}
                                              onClick={() => {
                                                setIsEdit(true);
                                                getAddStateDialog(true);
                                                setSelectedStateMaster(data);
                                              }}
                                            />
                                            <img
                                              src={DeleteHcRow}
                                              alt=""
                                              className={`${style.colorFileStyle}`}
                                              onClick={() =>
                                                handleDeleteState(data?.id)
                                              }
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </>
                            ))
                          ) : (
                            <p className={style.holidayScheduleCardtextStyle1}>
                              if you would like to setup your custom list for
                              your site(s) you can select from the default list
                              on the left, edit to change labels as needed, and
                              also add new Country with States Entity by
                              clicking on the add icon
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
            <p className={style.poweredBy}>Powered by - HapiCare</p>
            <p className={style.poweredBy}>© HapiCare</p>
          </div>
        </div>
      </div>

      {showAddStateDialog && (
        <AddStatesEntity
          getAddStateDialog={getAddStateDialog}
          isStateEdit={isEdit}
          countryId={selectedCountry}
          selectedState={selectedStateMaster}
          getStateEntityData={getStateEntityData}
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

export default CountryWithStatesEntity;

