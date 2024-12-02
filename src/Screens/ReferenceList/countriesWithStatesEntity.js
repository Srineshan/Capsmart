import React, { Fragment, useState, useEffect } from "react";
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
import CountryStatesList from "./countryStatesList";
import AddCountryType from "./addCountryType";
import { DELETE, GET, POST, PUT, TenantID } from "../dataSaver";

const CountriesWithStatesEntity = () => {
  const [showCountryDialog, setShowCountryDialog] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [stateList, setStateList] = useState(false);
  const [countryDataList, setCountryDataList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [isCountryEdit, setIsCountryEdit] = useState(false);

  useEffect(() => {
    getCountryList();
  }, []);

  const getAddCountryDialog = (value) => {
    setShowCountryDialog(value);
  };

  const getAddStateList = (value) => {
    setStateList(value);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
  };

  const getCountryList = async () => {
    const { data: countryData } = await GET(`entity-service/countryMaster`);
    // console.log("countryData", countryData)
    setCountryDataList(countryData)
  };

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
                    setIsCountryEdit(stateList ? true : false);
                    getAddCountryDialog(true)
                  }}
                >
                  {stateList ? `EDIT COUNTRY` : `ADD COUNTRY`}
                </button>
                {
                  !stateList && (
                    <>
                      <Link to={"/Screens/ReferenceList/customerAdminDashboard"}><Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /></Link>
                    </>
                  )
                }
                {
                  stateList && (
                    <>
                      <Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} onClick={() => { setStateList(false); getCountryList() }} />
                    </>
                  )
                }
              </div>
            </div>

            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  {!stateList && (
                    <div className={style.countryGridStyle}>
                      {countryDataList.map((data => {
                        return (
                          <>
                            <div className={style.countryGridCol}
                              onClick={() => {
                                setStateList(true);
                                setSelectedCountry(data);
                              }}>
                              <p
                                className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}
                              >
                                {data?.country}
                              </p>
                              <p className={style.countryDollerTextStyle}>{data?.currencyType}</p>
                              <p
                                className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}
                              >
                                STATES ({data?.numberOfStates})
                              </p>
                              <img
                                className={style.countryImgStyle}
                                src={data?.flag?.fileURL}
                                alt=""
                              />
                            </div>
                          </>
                        )
                      }))}
                    </div>
                  )}
                  {
                    stateList && (
                      <CountryStatesList
                        getAddStateList={getAddStateList}
                        getCountryList={getCountryList}
                        selectedCountry={selectedCountry}
                      />
                    )
                  }
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

      {showCountryDialog && <AddCountryType getAddCountryDialog={getAddCountryDialog} getCountryList={getCountryList} isCountryEdit={isCountryEdit} selectedCountry={selectedCountry} getAddStateList={getAddStateList} />}

    </Fragment >
  );
};

export default CountriesWithStatesEntity;
