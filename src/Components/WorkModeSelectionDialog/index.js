import React, { useState, useEffect } from "react";
import { GET } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import UserLogo2 from "../../images/userLogo2.png";
import UserLogo3 from "../../images/userLogo3.png";
import UserLogo4 from "../../images/userLogo4.png";
import Cookie from "universal-cookie";
import jwt from "jwt-decode";
import style from "./index.module.scss";
import CrossPink from "../../images/crossPink.png";

const WorkModeDialog = ({ getIsOpen }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get("user");
  const users = jwt(userDetails);

  const [userRole, setUserRole] = useState([]);
  const [workModeType, setWorkModeType] = useState(() =>
    sessionStorage.getItem("workModeType") || ''
  );

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    setUserDetails();
  }, []);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
  };

  const handleWorkModeSelection = (role) => {
    setWorkModeType(role);
    sessionStorage.setItem("workModeType", role);
    window.location.pathname = "/app/applications"
  };

  return (
    <>
      <Dialog
        isOpen={getIsOpen}
        onClose={() => getIsOpen(false)}
        className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      >
        <div>
          <div className={`${Classes.DIALOG_BODY} ${style.displayInCol}`}>
            <div className={`${style.heading}`}>Select Your Work Mode</div>
            {/* <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
              onClick={() => getIsOpen(false)}
            /> */}
            <div className={`${style.displayInRow} ${style.marginTop10}`}>
              {userRole?.includes("Staff Manager") && (
                <div
                  className={`${style.justifyItem}`}
                  onClick={() => handleWorkModeSelection("Staff Manager")}
                >
                  <img
                    src={UserLogo2}
                    alt="Staff Manager"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${style.roleTitle} ${style.marginTop10}`}>Staff Manager</p>
                </div>
              )}
              {userRole?.includes("Department Head") && (
                <div
                  className={`${style.justifyItem}`}
                  onClick={() => handleWorkModeSelection("Department Head")}
                >
                  <img
                    src={UserLogo3}
                    alt="Department Head"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${style.roleTitle}  ${style.marginTop10}`}>Department Head</p>
                </div>
              )}
              {userRole?.includes("Credentialing Committee") && (
                <div
                  className={`${style.justifyItem}`}
                  onClick={() => handleWorkModeSelection("Credentialing Committee")}
                >
                  <img
                    src={UserLogo4}
                    alt="Credentialing Committee"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${style.roleTitle}  ${style.marginTop10}`}>Credentialing Committee</p>
                </div>
              )}
              {/* <div
                  className={`${style.justifyItem}`}
                  onClick={() => handleWorkModeSelection("Credentialing Committee")}
                >
                  <img
                    src={UserLogo4}
                    alt="Credentialing Committee"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${style.roleTitle}`}>Credentialing Committee</p>
                </div>
                <div
                  className={`${style.justifyItem}`}
                  onClick={() => handleWorkModeSelection("Credentialing Committee")}
                >
                  <img
                    src={UserLogo4}
                    alt="Credentialing Committee"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${style.roleTitle}`}>Credentialing Committee</p>
                </div> */}
            </div>
            <div className={`${style.marginTop10}`}>
              <p className={style.poweredBy}>© HapiCare</p>
              <p className={style.alignText}>© {new Date().getFullYear()} HapiCare. All Rights Reserved</p>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default WorkModeDialog;
