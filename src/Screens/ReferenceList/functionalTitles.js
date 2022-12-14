import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from '../../Components/Navbar';
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
      <div className={style.departmentCardColumnsGrid}>
        <div>
          {allData.map((industryType) => (
            <>
              <div
                className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}
              >
                <img
                  src={TransparentFolder}
                  className={`${style.colorFileStyle2} ${style.marginLeft15}`} alt=""
                />
                <p
                  className={`${style.healthCareHeaderTextStyle} ${style.textColorBlue} `}
                >
                  {industryType.industry.industry}
                </p>
                <img
                  src={ArrowDown}
                  className={`${style.colorFileStyle3} ${style.marginRight}`} alt=""
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
                        className={`${style.colorFileStyle2} ${style.marginLeft15}`} alt=""
                      />
                      <p className={style.healthCareHeaderTextStyle2}>
                        HOSPITAL/ACUTE CARE FACILITY
                      </p>
                      <img
                        src={ArrowDown}
                        className={`${style.colorFileStyle3} ${style.marginRight}`} alt=""
                      />
                    </div>
                  </>
                ))
              }
            </>
          ))}

          <div className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}>
            <img src={TransparentFolder} className={`${style.colorFileStyle2} ${style.marginLeft15}`} alt="" />
            <p className={style.healthCareHeaderTextStyle}>HEALTHCARE</p>
            <img src={ArrowDown} className={`${style.colorFileStyle2} ${style.marginRight}`} alt="" />
          </div>

          <div className={`${style.healthCareListHeader} ${style.HealthCareListBackground1} ${style.spaceBetween}`}>
            <img src={TransparentFolder} className={`${style.colorFileStyle2} ${style.marginLeft15}`} alt="" />
            <p className={style.healthCareHeaderTextStyle}> HOSPITAL / ACUTE CARE FACILITY</p>
            <img src={ArrowDown} className={`${style.colorFileStyle2} ${style.marginRight}`} alt="" />
          </div>

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
              alt=""
            />
            <img
              src={DeleteHcFolder}
              className={style.colorFileStyle}
              alt=""
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
            <img src={EditHcRow} className={style.colorFileStyle} alt="" />
            <img
              src={DeleteHcRow}
              className={style.colorFileStyle} alt=""
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
            <img src={EditHcRow} className={style.colorFileStyle} alt="" />
            <img
              src={DeleteHcRow}
              className={style.colorFileStyle} alt=""
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
            <img src={EditHcRow} className={style.colorFileStyle} alt="" />
            <img
              src={DeleteHcRow}
              className={style.colorFileStyle} alt=""
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
            <img src={EditHcRow} className={style.colorFileStyle} alt="" />
            <img
              src={DeleteHcRow}
              className={style.colorFileStyle} alt=""
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
              className={style.colorFileStyle} alt=""
            />
            <img
              src={DeleteHcRow}
              className={style.colorFileStyle} alt=""
            />
          </div>
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
