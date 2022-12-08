import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import style from "./index.module.scss";
import Navbar from "../Navbar";
import SideBar from "../Sidebar";
import { Icon, Intent } from "@blueprintjs/core";
import AddNewEntity from "../../images/addEntity.png";
import AddRefresh from "../../images/refreshEntity.png";

const ReferenceListMaster = ({ headerName }) => {
  const [showAddEntityDialog, setShowAddEntityDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const getAddEntityDialog = (value) => {
    setShowAddEntityDialog(value);
  };

  return (
    <Fragment>
      <Navbar />
      <div className={style.margin20}>
        <div className={style.bigCardGrid}>
          <SideBar />
          <div>
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              {headerName &&
                headerName.map((data, index) => {
                  return (
                    <div key={index}>
                      <div
                        className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}
                      >
                        {data.name}
                      </div>
                      <div
                        className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}
                      >
                        {data.status}
                      </div>
                    </div>
                  );
                })}

              <div className={style.crossStyle}>
                <img
                  src={AddRefresh}
                  className={`${style.colorFileStyle} ${style.marginLeft20}`}
                  alt=""
                />
                <img
                  src={AddNewEntity}
                  onClick={() => {
                    getAddEntityDialog(true);
                    setIsEdit(false);
                  }}
                  className={`${style.colorFileStyle} ${style.marginLeft20}`}
                  alt=""
                />
                <Link to={"/Screens/ReferenceList/superAdminDashboard"}>
                  {" "}
                  <Icon
                    icon="cross"
                    size={25}
                    intent={Intent.DANGER}
                    className={`${style.marginLeft20} ${style.marginBottom5}`}
                  />{" "}
                </Link>
              </div>
            </div>
            <div className={style.marginTop35}>
              <div className={style.centreCardStyle}>
                <div className={style.margin20}>
                  {headerName.map((data) => {
                    return (
                      <data.tableComponent
                        showAddEntityDialog={showAddEntityDialog}
                        getAddEntityDialog={getAddEntityDialog}
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                      />
                    );
                  })}
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
    </Fragment>
  );
};

export default ReferenceListMaster;
