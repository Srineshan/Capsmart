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
import CountryStatesList from "./countryStatesList";
import AddCountryType from "./addCountryType";

const CountriesSupportedWithStates = () => {
  const [showCountryDialog, setShowCountryDialog] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [stateList, setStateList] = useState(false);

  const getAddCountryDialog = (value) => {
    setShowCountryDialog(value);
  };

  const getAddStateList = () => {
    setStateList(true);
  };

  const getIsExpanded = (value) => {
    setIsExpanded(value);
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
                  onClick={() => stateList ? getAddCountryDialog(true) : ""}
                >
                  {`ADD COUNTRY`}
                </button>
                {
                  !stateList && (
                    <>
                      <Link to={"/Screens/ReferenceList/superAdminDashboard"}><Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} /></Link>
                    </>
                  )
                }
                {
                  stateList && (
                    <>
                      <Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5} ${style.crossColor}`} onClick={() => { setStateList(false) }} />
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
                      <div className={style.countryGridCol} onClick={() => { setStateList(true) }}>
                        <div
                          className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}
                        >
                          AUSTRALIA
                        </div>
                        <div className={style.countryDollerTextStyle}>AU $</div>
                        <div
                          className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}
                        >
                          STATES 7
                        </div>
                        <img
                          className={style.countryImgStyle}
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/125px-Flag_of_Australia_%28converted%29.svg.png"
                          alt=""
                        />
                      </div>
                      <div className={style.countryGridCol}>
                        <p
                          className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}
                        >
                          CANADA
                        </p>
                        <p className={style.countryDollerTextStyle}>CAN $</p>
                        <p
                          className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}
                        >
                          STATES 7
                        </p>
                        <img
                          className={style.countryImgStyle}
                          src="https://cdn.pixabay.com/photo/2013/07/13/14/14/canada-162259__340.png"
                          alt=""
                        />
                      </div>
                      <div className={style.countryGridCol}>
                        <h5
                          className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}
                        >
                          NEW ZEALAND{" "}
                        </h5>
                        <p className={style.countryDollerTextStyle}> $</p>
                        <p
                          className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}
                        >
                          STATES 7
                        </p>
                        <img
                          className={style.countryImgStyle}
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flag_of_New_Zealand.svg/255px-Flag_of_New_Zealand.svg.png"
                          alt=""
                        />
                      </div>
                      <div className={style.countryGridCol}>
                        <p
                          className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}
                        >
                          UNITED KINGDOM <br /> (UK){" "}
                        </p>
                        <p className={style.countryDollerTextStyle}>£</p>
                        <p
                          className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}
                        >
                          STATES 7
                        </p>
                        <img
                          className={style.countryImgStyle}
                          src="https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Flag_of_the_United_Kingdom.svg/255px-Flag_of_the_United_Kingdom.svg.png"
                          alt=""
                        />
                      </div>
                      <div className={style.countryGridCol}>
                        <p
                          className={`${style.industriesCardTextStyle1} ${style.positionAbsolute}`}
                        >
                          UNITED STATES <br /> (USA){" "}
                        </p>
                        <p className={style.countryDollerTextStyle}>£</p>
                        <p
                          className={`${style.industriesCardTextStyle1} ${style.stateTextStyle}`}
                        >
                          STATES 6
                        </p>
                        <img
                          className={style.countryImgStyle}
                          src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/255px-Flag_of_the_United_States.svg.png"
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                  {
                    stateList && (
                      <CountryStatesList
                        getAddStateList={getAddStateList}
                      />
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.spaceBetween}>
          <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
          <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
        </div>
      </div>

      {showCountryDialog && <AddCountryType getAddCountryDialog={getAddCountryDialog} />}

    </Fragment >
  );
};

export default CountriesSupportedWithStates;
