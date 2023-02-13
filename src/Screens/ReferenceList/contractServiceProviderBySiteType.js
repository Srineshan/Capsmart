import React, { Fragment, useState } from "react";
import Navbar from "../../Components/Navbar";
import SideBar from "./../../Components/Sidebar";
import { Icon, Intent, Checkbox } from "@blueprintjs/core";
import style from "./index.module.scss";
import SubNavbar from "../../Components/SubNavbar";
import CrossPink from "./../../images/crossPink.png";
import OpenFolderBlue from "./../../images/openFolderBlue.png";
import IndustriesEntityFolder from "./../../images/industriesEntityFolder.png";
import SelectArrow from "./../../images/selectArrow.png";
import AddNewEntity from "./../../images/addEntity.png";
import AddContractedServiceForHospital from "./addContractServiceProviderForHospital";
import { Link } from "react-router-dom";

const ContractServiceProviderBySite = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [showAddContractedServiceDialog, setAddContractedServiceDialog] =
    useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getAddContractedServiceDialog = (value) => {
    setAddContractedServiceDialog(value);
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
            {/* <SubNavbar/> */}
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              <div
                className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
              >
                CONTRACTED SERVICE PROVIDERS BY ENTITY / SITE TYPES
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
                          {" "}
                          STANDARD LIST IN USE- DEFAULT{" "}
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
                            HOSPITAL / ACUTE CARE FACILITY (ACF)
                          </p>
                          <img
                            src={OpenFolderBlue}
                            alt="OpenFolder"
                            className={`${style.colorFileStyle2} ${style.marginLeft5}`}
                          />
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                        >
                          <Checkbox />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            Physician / Doctor
                          </p>
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                        >
                          <Checkbox checked />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            {" "}
                            Dental Professional
                          </p>
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                        >
                          <Checkbox />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            {" "}
                            Allied Health Professionals
                          </p>
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                        >
                          <Checkbox />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            {" "}
                            Administration Staff
                          </p>
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                        >
                          <Checkbox />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            {" "}
                            Advance Care Staff
                          </p>
                        </div>
                        <div
                          className={`${style.customersAdminInnerRowsStyle1} ${style.customersAdminBackground1} ${style.displayInRow}`}
                        >
                          <Checkbox />
                          <p
                            className={`${style.TextStyle4} ${style.marginLeft5}`}
                          >
                            Nursing Professional
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={style.customersAdminCardStyle2}
                      onClick={() => {
                        setIsSelected(true);
                        getAddContractedServiceDialog(true);
                      }}
                    >
                      <p
                        className={`${style.holidayScheduleHeadertextStyle1} ${style.colorWhite} ${style.marginTop3}`}
                      >
                        Select
                      </p>
                      <img
                        src={SelectArrow}
                        className={`${style.colorFileStyle4}`}
                        alt="SelectArrow"
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
                          onClick={() => getAddContractedServiceDialog(true)}
                        ></img>
                      </div>
                      <div
                        className={style.customersAdminCardStyle3}
                        onClick={() => getAddContractedServiceDialog(true)}
                      >
                        <p className={style.holidayScheduleCardtextStyle1}>
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
      {showAddContractedServiceDialog && (
        <AddContractedServiceForHospital
          getAddContractedServiceDialog={getAddContractedServiceDialog}
        />
      )}
    </Fragment>
  );
};

export default ContractServiceProviderBySite;
