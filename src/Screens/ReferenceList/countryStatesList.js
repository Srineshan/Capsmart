import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import SideBar from "../../Components/Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import style from "./index.module.scss";
import AddNewEntity from "./../../images/addEntity.png";
import AddRefresh from "./../../images/refreshEntity.png";
import DeleteHcFolder from "./../../images/deleteHcFolder.png";
import DeleteHcRow from "./../../images/deleteHcRow.png";
import EditBlue from "./../../images/editBlue.png";
import EditHcRow from "./../../images/editHcRow.png";
import EditHcFolder from "./../../images/editHcFolder.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import AddContractDocumentTypeForUpload from "./addContractDocumentTypeForUpload";
import Titlebar from "../../Components/titlemenu";
import LevelTwoHeader from "../../Components/LevelTwoHeader";
import ArrowDown from "./../../images/arrowDown.png";

const CountryStatesList = ({ getAddStateList, countryDataList }) => {
  const [showContractDocumentDialod, setShowContractDocumentDialod] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const getAddContractDocumentDialog = (value) => {
    setShowContractDocumentDialod(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  return (
    <Fragment>
      <div className={style.margin20}>
        <div className={style.countryDisplayTable}>
          {/* //Table */}
          <div className={style.countryCardStyle}>
            <div className={style.tableHeaderCountryList}>
              <p
                className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft20}`}
              >
                COUNTRY / STATES / PPROVINCE / TERRITORY
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}>
                ABBREVIATION
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}>
                DATE FORMAT
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}>
                CURRENCY TYPE
              </p>
              <p className={style.tableHeaderIndustriesFontStyle}></p>
            </div>


            {
              <div className={style.stateListHeader}>
                <img
                  src={IndustriesEntityFolder}
                  alt=""
                  className={`${style.colorFileStyle} ${style.marginLeft5}`}
                />
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  United States
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  USA
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  MM/DD/YYYY
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}>
                  $
                </p>
                <p className={style.tableHeaderIndustriesFontStyle5}></p>
                <img
                  src={EditHcFolder}
                  className={style.colorFileStyle}
                  alt=""
                />
                <img
                  src={DeleteHcFolder}
                  className={style.colorFileStyle}
                  alt=""
                />
              </div>
            }

            <div className={`${style.countryTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
              <p className={style.tableDataFontStyle}>Alabama</p>
              <p className={style.tableDataFontStyle}>AL</p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <img
                src={EditHcRow}
                className={style.colorFileStyle}
                alt=""
              />
              <img
                src={DeleteHcRow}
                className={style.colorFileStyle}
                alt=""
              />
            </div>
            <div className={`${style.countryTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
              <p className={style.tableDataFontStyle}>Alaska</p>
              <p className={style.tableDataFontStyle}>AK</p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <img
                src={EditHcRow}
                className={style.colorFileStyle}
                alt=""
              />
              <img
                src={DeleteHcRow}
                className={style.colorFileStyle}
                alt=""
              />
            </div>
            <div className={`${style.countryTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
              <p className={style.tableDataFontStyle}>Arizona</p>
              <p className={style.tableDataFontStyle}>AZ</p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <img
                src={EditHcRow}
                className={style.colorFileStyle}
                alt=""
              />
              <img
                src={DeleteHcRow}
                className={style.colorFileStyle}
                alt=""
              />
            </div>
            <div className={`${style.countryTableData} ${style.healthCareTableDataColor2} ${style.displayInRow}`}>
              <p className={style.tableDataFontStyle}>Arkansas</p>
              <p className={style.tableDataFontStyle}>AR</p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <img
                src={EditHcRow}
                className={style.colorFileStyle}
                alt=""
              />
              <img
                src={DeleteHcRow}
                className={style.colorFileStyle}
                alt=""
              />
            </div>
            <div className={`${style.countryTableData} ${style.healthCareTableDataColor1} ${style.displayInRow}`}>
              <p className={style.tableDataFontStyle}>California</p>
              <p className={style.tableDataFontStyle}>CA</p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <p className={style.tableDataFontStyle}></p>
              <img
                src={EditHcRow}
                className={style.colorFileStyle}
                alt=""
              />
              <img
                src={DeleteHcRow}
                className={style.colorFileStyle}
                alt=""
              />
            </div>
            <div className={style.marginBottom20}></div>
          </div>
        </div>
      </div>

      {
        showContractDocumentDialod && (
          <AddContractDocumentTypeForUpload
            getAddContractDocumentDialog={getAddContractDocumentDialog}
          />
        )
      }
    </Fragment >
  );
};

export default CountryStatesList;
