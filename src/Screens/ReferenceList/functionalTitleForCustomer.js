import React, { Fragment, useState } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "../../Components/Sidebar";
import style from "./index.module.scss";
import { Checkbox } from "@blueprintjs/core";
import CrossPink from "./../../images/crossPink.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import SelectArrow from "./../../images/selectArrow.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import AddNewEntity from "./../../images/addEntity.png";
import AddFunctionalTitlesForCustomer from "./addFunctionalTitleForCustomer";
import { Link } from "react-router-dom";

const FunctionalTitleForCustomer = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showFunctionalTitlesDialog, setShowFunctionalTitleDialog] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getAddFunctionalTitlesDialog = (value) => {
    setShowFunctionalTitleDialog(value);
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
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                FUNCTIONAL TITLES FOR CONTRACTED SERVICE PROVIDERS FOR HOSPITAL
                / ACUTE CARE FACILITY (ACF)
              </div>
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
                    className={`${style.colorFileStyle2} ${style.marginLeft20}`}
                    alt="CrossPink"
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
                        <div
                          className={`${style.boardCertificationSideRows1} ${style.displayInRow}`}
                        >
                          <img
                            src={IndustriesEntityFolder}
                            className={`${style.colorFileStyle} ${style.marginLeft5}`}
                          />
                          <p
                            className={`${style.tableHeaderIndustriesFontStyle} ${style.marginLeft10}`}
                          >
                            DENTAL PROFESSIONAL
                          </p>
                          <img
                            src={OpenFolderBlue}
                            alt="OpenFolder"
                            className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                          />
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}
                        >
                          <Checkbox />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            Dentist
                          </p>
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground3} ${style.displayInRow}`}
                        >
                          <Checkbox checked />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            {" "}
                            Orthodontist
                          </p>
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground2} ${style.displayInRow}`}
                        >
                          <Checkbox />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            Other (Specify Other)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={style.customersAdminCardStyle2}
                      onClick={() => setIsSelected(true)}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        className={`${style.colorFileStyle4}`}
                      />
                    </div>
                    <div>
                      <div className={`${style.holidayScheduleHeader2}`}>
                        <p></p>
                        <p
                          className={`${style.holidayScheduleHeadertextStyle1}`}
                        >
                          MY CUSTOM LIST TO USE
                        </p>
                        <img
                          src={AddNewEntity}
                          className={`${style.colorFileStyle} ${style.marginLeft150} `}
                        ></img>
                      </div>
                      <div className={style.customersAdminCardStyle3}>
                        <p
                          className={style.holidayScheduleCardtextStyle1}
                          onClick={() => getAddFunctionalTitlesDialog(true)}
                        >
                          if you would like to setup your custom list for your
                          site(s) you can select from the default list on the
                          left, edit to change labels as needed, and also add
                          new departments/ service area by clicking on the add
                          icon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showFunctionalTitlesDialog && (
        <AddFunctionalTitlesForCustomer
          getAddFunctionalTitlesDialog={getAddFunctionalTitlesDialog}
        />
      )}
    </Fragment>
  );
};

export default FunctionalTitleForCustomer;
