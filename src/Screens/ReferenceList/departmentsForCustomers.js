import React, { Fragment, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Checkbox, Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddBoardCertifcation from "./addBoardCertifcation";
import AddNewEntity from "./../../images/addEntity.png";
import SelectArrow from "./../../images/selectArrow.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import CloseFolderBlue from "./../../images/closeFolderBlue.png";
import AddRefresh from "./../../images/refreshEntity.png";
import BlackBorderFolder from "./../../images/blackBorderFolder.png";
import CrossPink from "./../../images/crossPink.png";
import BlueFolder from "./../../images/blueFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SemiTransparentFolder from "./../../images/semiTransparentFolder.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import GreenPage from "./../../images/greenPage.png";
import { Link } from "react-router-dom";
import { GET, DELETE, POST, TenantID } from "./../dataSaver";
import { index } from "d3";
import AddNewDepartments from "./addNewDepartments";

const DepartmentsForCustomers = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isIconClick, setIsIconclick] = useState(false);
  const [showIconDiv, setShowIconDiv] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);

  const [industryData, setIndustryData] = useState([]);
  const [entityData, setEntityData] = useState([]);
  const [siteTypeData, setSiteTypeData] = useState([]);
  const [clicked, setClicked] = useState(0);

  const [tableData, setTableData] = useState([]);
  const [checkedSite, setCheckedSite] = useState([]);
  const [unCheckedSite, SetUnCheckedSite] = useState([]);
  const [selectedSiteType, setSelectedSiteType] = useState({});

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  const getIndustryData = async () => {
    const { data: Industries } = await GET(`entity-service/industryMaster`);
    setIndustryData(Industries);
  };

  const entityAllData = () => {
    let entityArray = [];
    industryData.forEach(async (industry) => {
      const { data: entity } = await GET(
        `entity-service/entityTypeMaster?industryId=${industry.id}`
      );
      entityArray = [...entityArray, ...entity];
      setEntityData(entityArray);
    });
  };

  const getSelectedSiteTypeData = async () => {
    const { data: departmentList } = await GET(
      `entity-service/departmentMaster?X-tenantID=${TenantID}&siteTypeId=${selectedSiteType.id}`
    );
    console.log(departmentList);
  };

  const siteTypeAllData = async () => {
    let siteTypeArray = await Promise.all(entityData.map(EntityAllData));
    setSiteTypeData(siteTypeArray);
    SetUnCheckedSite(siteTypeArray);
  };

  const EntityAllData = async (entity) => {
    const { data: department } = await GET(
      `entity-service/departmentMaster?siteTypeId=${entity.id}`
    );
    return await { ...entity, department };
  };

  const handleIconClick = () => {
    setIsIconclick(true);
    setShowIconDiv(true);
  };

  const handleToggle = (index, data) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
    setSelectedSiteType(data);
  };

  const handleClickCheck = (id, checked) => {
    if (checked === true) {
      setTableData([...tableData, id]);
    } else {
      setTableData([...tableData.filter((data) => data !== id)]);
    }
  };

  const selectSaveHandler = () => {
    setIsSelected(true);
    let checkedSiteType = [],
      unCheckedSiteType = [];

    siteTypeData.forEach((siteType) => {
      let checkedDepartment = [],
        unCheckedDepartment = [];

      siteType.department.forEach((depart) => {
        if (tableData.includes(depart.id)) {
          checkedDepartment = [...checkedDepartment, depart];
        } else {
          unCheckedDepartment = [...unCheckedDepartment, depart];
        }
      });

      if (checkedDepartment.length > 0) {
        checkedSiteType = [
          ...checkedSiteType,
          { ...siteType, department: checkedDepartment },
        ];
      }

      unCheckedSiteType = [
        ...unCheckedSiteType,
        { ...siteType, department: unCheckedDepartment },
      ];
    });
    setCheckedSite(checkedSiteType);
    SetUnCheckedSite(unCheckedSiteType);
    setTableData([]);
  };

  useEffect(() => {
    getIndustryData();
  }, []);

  useEffect(() => {
    entityAllData();
  }, [industryData]);

  useEffect(() => {
    siteTypeAllData();
  }, [entityData]);

  useEffect(() => {
    getSelectedSiteTypeData();
  }, [selectedSiteType]);

  // console.log(checkedSite);
  // console.log(unCheckedSite);
  console.log(selectedSiteType);

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
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                DEPARTMENTS / SERVICE AREAS FOR CUSTOMER SITE
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
                  <img
                    src={CrossPink}
                    alt="OpenFolder"
                    className={`${style.colorFileStyle2} ${style.marginLeft5}`}
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
                        {unCheckedSite?.map((siteType, index) => {
                          return (
                            <>
                              <div
                                className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}
                                key={index}
                                onClick={() => handleToggle(index, siteType)}
                              >
                                <img
                                  src={IndustriesEntityFolder}
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                                />
                                <p
                                  className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                                >
                                  {siteType.type.toUpperCase()}
                                </p>
                                <img
                                  src={
                                    clicked === index
                                      ? CloseFolderBlue
                                      : OpenFolderBlue
                                  }
                                  alt="OpenFolder"
                                  className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                                />
                              </div>
                              <div
                                className={
                                  clicked === index
                                    ? `${style.listWrapper} ${style.open}`
                                    : `${style.listWrapper}`
                                }
                              >
                                {siteType.department.map((depart) => {
                                  return (
                                    <>
                                      <div
                                        className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                                      >
                                        <Checkbox
                                          checked={tableData.includes(
                                            depart.id
                                          )}
                                          onChange={(e) => {
                                            handleClickCheck(
                                              depart.id,
                                              e.target.checked
                                            );
                                          }}
                                        />
                                        <p
                                          className={`${style.boardCertificationTextStyle2} ${style.marginLeft5}`}
                                        >
                                          {depart.departmentName.name}
                                        </p>
                                      </div>
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className={`${style.customersAdminCardStyle4} ${style.marginAuto}`}
                      // onClick={() => setIsSelected(true)}
                      onClick={() => selectSaveHandler()}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        alt="OpenFolder"
                        className={`${style.colorFileStyle4}`}
                      />
                    </div>
                    <div>
                      <div className={`${style.holidayScheduleHeader2}`}>
                        <p></p>
                        <p
                          className={`${style.holidayScheduleHeadertextStyle1}`}
                        >
                          {isSelected
                            ? "MY CUSTOM LIST"
                            : "MY CUSTOM LIST TO USE"}{" "}
                        </p>
                        <img
                          src={AddNewEntity}
                          alt="OpenFolder"
                          className={`${style.colorFileStyle} ${style.marginLeft150} `}
                          onClick={() => {
                            getAddEntityDialog(true);
                          }}
                        ></img>
                      </div>

                      <div className={style.customersAdminCardStyle3}>
                        {checkedSite.map((data) => {
                          return (
                            <>
                              <div className={style.customerAdminEntityHeader}>
                                <img
                                  src={IndustriesEntityFolder}
                                  alt="IndustriesEntityFolder"
                                  className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                />
                                <p
                                  className={
                                    style.tableHeaderIndustriesFontStyle
                                  }
                                >
                                  {data.type.toUpperCase()}
                                </p>
                              </div>
                              {data.department.map((depart) => {
                                return (
                                  <>
                                    <div
                                      className={
                                        style.customerAdminTableHeader2
                                      }
                                    >
                                      <p></p>
                                      <p
                                        className={
                                          style.customersAdminTableFontStyle
                                        }
                                      >
                                        {depart.departmentName.name}
                                      </p>
                                      <img
                                        src={EditHcFolder}
                                        alt="OpenFolder"
                                        className={style.colorFileStyle}
                                      />
                                      <img
                                        src={DeleteHcRow}
                                        alt="OpenFolder"
                                        className={style.colorFileStyle}
                                      />
                                    </div>
                                  </>
                                );
                              })}
                            </>
                          );
                        })}

                        {/* {isSelected ? (
                          <div>
                            <div>
                              <div className={style.customerAdminEntityHeader}>
                                <img
                                  src={IndustriesEntityFolder}
                                  alt="IndustriesEntityFolder"
                                  className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                />
                                <p
                                  className={
                                    style.tableHeaderIndustriesFontStyle
                                  }
                                >
                                  METROPOLITAN HOSPITAL (ACUTE CARE FACILITY)
                                </p>
                              </div>
                              <div className={style.customerAdminTableHeader2}>
                                <p></p>
                                <p
                                  className={style.customersAdminTableFontStyle}
                                >
                                  Blood Bank
                                </p>
                                <img
                                  src={EditHcFolder}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                              </div>
                              <div className={style.customerAdminTableHeader2}>
                                <img
                                  src={IndustriesEntityFolder}
                                  alt="IndustriesEntityFolder"
                                  className={`${style.colorFileStyle} ${style.marginLeft10}`}
                                />
                                <p
                                  className={`${style.customersAdminTableFontStyle1} ${style.marginLeft20}`}
                                >
                                  Laboratory & Testing
                                </p>
                                <img
                                  src={EditHcFolder}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                              </div>
                              <div
                                className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                              >
                                <p></p>
                                <p className={style.tableDataFontStyle}>
                                  Bacteriologyy
                                </p>
                                <p></p>
                                <p></p>
                                <img
                                  src={EditHcRow}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                              </div>
                              <div
                                className={`${style.customerAdminTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                              >
                                <p></p>
                                <p className={style.tableDataFontStyle}>
                                  Hematology
                                </p>
                                <p></p>
                                <p></p>
                                <img
                                  src={EditHcRow}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                              </div>
                              <div className={style.customerAdminTableHeader2}>
                                <p></p>
                                <p
                                  className={style.customersAdminTableFontStyle}
                                >
                                  Nursing
                                </p>
                                <img
                                  src={EditHcFolder}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                                <img
                                  src={DeleteHcRow}
                                  alt="OpenFolder"
                                  className={style.colorFileStyle}
                                />
                              </div>
                              {isClick ? (
                                <div>
                                  <div
                                    className={style.customerAdminTableHeader2}
                                  >
                                    <p></p>
                                    <p
                                      className={
                                        style.customersAdminTableFontStyle
                                      }
                                    >
                                      {isIconClick ? "Nursing Test" : "Other"}
                                    </p>
                                    <img
                                      src={EditHcFolder}
                                      alt="OpenFolder"
                                      className={style.colorFileStyle}
                                    />
                                    <img
                                      src={DeleteHcRow}
                                      alt="OpenFolder"
                                      className={style.colorFileStyle}
                                    />
                                  </div>
                                  {showIconDiv ? (
                                    ""
                                  ) : (
                                    <div
                                      className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                                    >
                                      <p></p>
                                      <p
                                        className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}
                                      >
                                        {" "}
                                        Nursing Test{" "}
                                      </p>
                                      <p></p>
                                      <p></p>
                                      <p></p>
                                      <img
                                        src={GreenPage}
                                        alt="OpenFolder"
                                        className={`${style.colorFileStyle} ${style.marginRight20}`}
                                        onClick={handleIconClick}
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <div
                                    className={style.customerAdminTableHeader2}
                                  >
                                    <p></p>
                                    <p
                                      className={
                                        style.customersAdminTableFontStyle
                                      }
                                    >
                                      Other Department / Service Area
                                    </p>
                                    <img
                                      src={EditHcFolder}
                                      alt="OpenFolder"
                                      className={style.colorFileStyle}
                                    />
                                    <img
                                      src={DeleteHcRow}
                                      alt="OpenFolder"
                                      className={style.colorFileStyle}
                                    />
                                  </div>
                                  <div
                                    className={`${style.customerAdminTableData} ${style.healthCareTableDataColor2} ${style.displayInRow} ${style.marginLeft35}`}
                                  >
                                    <p></p>
                                    <p
                                      className={`${style.tableDataFontStyle} ${style.specifyOtherBox}`}
                                      onClick={() => setIsClick(true)}
                                    >
                                      {" "}
                                      Specify Other
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new departments/ service area by clicking on the add
                            icon
                          </p>
                        )} */}

                        {!isSelected && (
                          <p className={style.holidayScheduleCardtextStyle1}>
                            if you would like to setup your custom list for your
                            site(s) you can select from the default list on the
                            left, edit to change labels as needed, and also add
                            new departments/ service area by clicking on the add
                            icon
                          </p>
                        )}
                      </div>

                      {/* {isSelected ? (
                        <div className={`${style.floatRight}`}>
                          <Link
                            to={
                              "/referenceList/departmentsForCustomerMultiSite"
                            }
                          >
                            <button
                              className={`${style.buttonStyle2} ${style.marginLeft10}`}
                              onClick={() => setIsSelected(false)}
                            >
                              SAVE
                            </button>
                          </Link>
                        </div>
                      ) : (
                        ""
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddEntityDialog && (
          <AddNewDepartments getAddEntityDialog={getAddEntityDialog} />
        )}

        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - TimeSmartAI LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI</p>
        </div>
      </div>
    </Fragment>
  );
};

export default DepartmentsForCustomers;
