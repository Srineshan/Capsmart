import React, { Fragment, useState, useEffect } from "react";
import ReferenceListNavbar from "./../../Components/ReferenceListNavbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddFunctionalTitles from "./addFunctionalTitles";
import AddNewEntity from "./../../images/addEntity.png";
import AddRefresh from "./../../images/refreshEntity.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import TransparentFolder from "./../../images/transparentFolder.png";
import ArrowDown from "./../../images/arrowDown.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditHcRow from "./../../images/editHcRow.png";
import Titlebar from "../../Components/titlemenu";
import { GET, DELETE } from "./../dataSaver";
import { ErrorToaster, SuccessToaster } from "./../../utils/toaster";


const FunctionalTitles = () => {
  const [showAddFunctionalTitlesDialog, setAddFunctionalTitlesDialog] =
    useState(false);
  const [allData, setAllData] = useState([]);

  const getAddFunctionalTitlesDialog = (value) => {
    setAddFunctionalTitlesDialog(value);
  };

  const getAllData = async () => {
    const { data: data } = await GET(`/industryMaster`)
    console.log(data)
    setAllData([]);
    data.forEach(async (industry) => {
      const { data: entities } = await GET(`/entityTypeMaster?industryId=${industry.id}`)
      console.log(entities)
      entities.forEach(async (siteTypeId) => {
        const { data: CSPType } = await GET(`/contractedServiceProviderMaster?siteTypeId=${siteTypeId.id}`)
        console.log("Ok", CSPType)
        setAllData((prev) => [...prev, { industry, entities, CSPType }]);
        console.log("all", allData)
      })
    });

  }

  const getFuntionalTitileData = async (contractPID) => {
    const { data: data } = await GET(
      `/functionalTitlesForCSPTypeMaster?contractedServiceProviderTypeId=${contractPID}`
    );
    console.log(data);
  };


  const handleFileDeletion = async (id) => {
    await DELETE(`/functionalTitlesForCSPTypeMaster/${id}`)
      .then((response) => {
        SuccessToaster("Document Deleted Successfully");
      })
      .then((error) => {
        ErrorToaster("Unexpected Error occured deleting document");
      });
  };

  useEffect(() => {
    getAllData()
    // getFuntionalTitileData();
    // handleFileDeletion();
  }, []);

  return (
    <Fragment>
      <ReferenceListNavbar />
      <div className={style.margin20}>
        <div className={style.bigCardGrid}>
          <SideBar />
          <div>
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS
              </div>
              <div
                className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}
              >
                UPDATED ON FEB 16, 2022 16:45 EST
              </div>
              <div className={style.crossStyle}>
                <Icon icon="cross" size={25} intent={Intent.DANGER} />
              </div>
            </div>
            <div className={style.addAndRefreshCardStyle}>
              <img
                src={AddRefresh}
                className={`${style.colorFileStyle} ${style.marginLeft20}`}
              />
              <img
                src={AddNewEntity}
                onClick={() => getAddFunctionalTitlesDialog(true)}
                className={`${style.colorFileStyle} ${style.marginLeft20}`}
              />
            </div>
            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  <div className={style.departmentCardColumnsGrid}>
                    <div>
                      {allData.map((industryType) => (
                        <>
                          <div
                            className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
                          >
                            <img
                              src={TransparentFolder}
                              className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                            />
                            <p
                              className={`${style.healthCareHeaderTextStyle} ${style.textColorBlue} `}
                            >
                              {industryType.industry.industry}
                            </p>
                            <img
                              src={ArrowDown}
                              className={`${style.colorFileStyle3} ${style.marginRight}`}
                            />
                          </div>
                          {
                            industryType.entities.map((entityType) => (
                              <>
                                <div
                                  className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
                                >
                                  <img
                                    src={TransparentFolder}
                                    className={`${style.colorFileStyle2} ${style.marginLeft15}`}
                                  />
                                  <p className={style.healthCareHeaderTextStyle2}>
                                    HOSPITAL/ACUTE CARE FACILITY
                                  </p>
                                  <img
                                    src={ArrowDown}
                                    className={`${style.colorFileStyle3} ${style.marginRight}`}
                                  />
                                </div>
                              </>
                            ))
                          }
                        </>
                      ))}


                      <div
                        className={`${style.healthCareListCardStyle}  ${style.marginTop15} ${style.HealthCareListBackground2} ${style.spaceBetween}`}
                      >
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          Physician / Doctor
                        </p>
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          5
                        </p>
                      </div>
                      <div
                        className={`${style.healthCareListCardStyle} ${style.spaceBetween} ${style.marginTop}`}
                      >
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          Dental Professional
                        </p>
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          0
                        </p>
                      </div>
                      <div
                        className={`${style.healthCareListCardStyle} ${style.spaceBetween} ${style.marginTop}`}
                      >
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          Allied Health Professionals
                        </p>
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          0
                        </p>
                      </div>
                      <div
                        className={`${style.healthCareListCardStyle} ${style.spaceBetween} ${style.marginTop}`}
                      >
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          Administration Staff
                        </p>
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          0
                        </p>
                      </div>
                      <div
                        className={`${style.healthCareListCardStyle} ${style.spaceBetween} ${style.marginTop}`}
                      >
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          Advanced Care Staff
                        </p>
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          0
                        </p>
                      </div>
                      <div
                        className={`${style.healthCareListCardStyle} ${style.spaceBetween} ${style.marginTop}`}
                      >
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          Nursing Professional
                        </p>
                        <p
                          className={`${style.healthCareHeaderTextStyle2} ${style.marginTop20}`}
                        >
                          0
                        </p>
                      </div>
                    </div>
                    <div className={style.DepartmentEntityCardStyle}>
                      <div className={style.tableHeaderFuntionalTitles}>
                        <p></p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          HOSPITAL / ACUTE CARE FACILITY
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          ALIAS 1
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          ALIAS 2
                        </p>
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          LAST UPDATED
                        </p>
                        <p></p>
                      </div>
                      <div className={style.healthCareIndustriesHeader}>
                        <img
                          src={IndustriesEntityFolder}
                          alt="IndustriesEntityFolder"
                          className={`${style.colorFileStyle} ${style.marginLeft5}`}
                        />
                        <p className={style.tableHeaderIndustriesFontStyle}>
                          Hospital/Acute Care Facility (ACF)
                        </p>
                        <img
                          src={EditHcFolder}
                          onClick={() => getAddFunctionalTitlesDialog(true)}
                          className={style.colorFileStyle}
                        />
                        <img
                          src={DeleteHcFolder}
                          className={style.colorFileStyle}
                        />
                      </div>
                      <div
                        className={`${style.FuntionalTitlesTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                      >
                        <p></p>
                        <p className={style.tableDataFontStyle}>
                          Anesthesiologist
                        </p>
                        <p></p>
                        <p></p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} />
                        <img
                          src={DeleteHcRow}
                          className={style.colorFileStyle}
                        />
                      </div>
                      <div
                        className={`${style.FuntionalTitlesTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                      >
                        <p></p>
                        <p className={style.tableDataFontStyle}>Cardiologist</p>
                        <p></p>
                        <p></p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} />
                        <img
                          src={DeleteHcRow}
                          className={style.colorFileStyle}
                        />
                      </div>
                      <div
                        className={`${style.FuntionalTitlesTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                      >
                        <p></p>
                        <p className={style.tableDataFontStyle}>
                          Chief Medical Information Officer
                        </p>
                        <p className={style.tableDataFontStyle}>
                          Chief Medical Informatics Officer
                        </p>
                        <p className={style.tableDataFontStyle}>
                          Clinical Informatics Officer
                        </p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} />
                        <img
                          src={DeleteHcRow}
                          className={style.colorFileStyle}
                        />
                      </div>
                      <div
                        className={`${style.FuntionalTitlesTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}
                      >
                        <p></p>
                        <p className={style.tableDataFontStyle}>
                          Chief Medical Officer
                        </p>
                        <p></p>
                        <p></p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img src={EditHcRow} className={style.colorFileStyle} />
                        <img
                          src={DeleteHcRow}
                          className={style.colorFileStyle}
                        />
                      </div>
                      <div
                        className={`${style.FuntionalTitlesTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}
                      >
                        <p></p>
                        <p className={style.tableDataFontStyle}>
                          Chief of Staff
                        </p>
                        <p></p>
                        <p></p>
                        <p className={style.tableDataFontStyle}>03-29-2022</p>
                        <img
                          src={EditHcFolder}
                          className={style.colorFileStyle}
                        />
                        <img
                          src={DeleteHcRow}
                          className={style.colorFileStyle}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
          <p className={style.poweredBy}>© TimeSmart.AI</p>
        </div>
      </div>
      {showAddFunctionalTitlesDialog && (
        <AddFunctionalTitles
          getAddFunctionalTitlesDialog={getAddFunctionalTitlesDialog}
        />
      )}
    </Fragment>
  );
};

export default FunctionalTitles;
