import React, { useState, useEffect } from "react";
import { GET } from "../../Screens/dataSaver";
import { Dialog, Classes } from "@blueprintjs/core";
import UserLogo2 from "../../images/userLogo2.png";
import HODimg from "../../images/HeadofDepartment.svg";
import HODimgHover from "../../images/HeadofDepartmentHover.svg";
import CCimg from "../../images/CredentialingCommittee.svg";
import CCimgHover from "../../images/CredentialingCommitteeHover.svg";
import SMimg from "../../images/StaffManager.svg";
import SMimgHover from "../../images/StaffManagerHover.svg";
import COSimg from "../../images/ChiefofStaff.svg";
import COSimgHover from "../../images/ChiefofStaffHover.svg";
import SAimg from "../../images/SystemAdmin.svg";
import SAimgHover from "../../images/SystemAdminHover.svg";
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
  const [hoveredRole, setHoveredRole] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    setUserDetails();
  }, []);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
    console.log("userRoletimes",userRole )
  };

  const handleWorkModeSelection = (role) => {
    setWorkModeType(role);
    sessionStorage.setItem("workModeType", role);
    window.location.pathname = "/applications"
  };

  const handleWorkModeSelectionSys = (role) => {
    setWorkModeType(role);
    sessionStorage.setItem("workModeType", role);
    window.location.pathname = "/entitySitePortal"
  };

  return (
    <>
      {/* <Dialog
        isOpen={getIsOpen}
        onClose={() => getIsOpen(false)}
        className={`${style.eSignDialog} ${style.eSignDialogBackground} ${style.marginDialog} ${style.backGroundStyle}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      > */}
        <div className={`${style.backGroundStyle}`}>
          <div className={`${style.displayInCol}`}>
            <div className={`${style.heading}  ${style.padding}`}>Select The Workspace You Would Like To Work In</div>
            {/* <img
              src={CrossPink}
              alt="cross"
              className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft}`}
              onClick={() => getIsOpen(false)}
            /> */}
            <div
              className={`
                ${
                  userRole?.length % 2 === 0 ? style.twoColumnGrid :
                  style.threeColumnGrid
                } 
                ${style.padding} ${style.placeCenter}
              `}
             >
              {userRole?.includes("Staff Manager") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelection("Staff Manager")}
                  onMouseEnter={() => setHoveredRole("Staff Manager")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "Staff Manager" ? SMimgHover : SMimg}
                    alt="Staff Manager"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "Staff Manager" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Staff Manager</p>
                </div>
              )}
              {userRole?.includes("Department Head") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelection("Department Head")}
                  onMouseEnter={() => setHoveredRole("Department Head")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "Department Head" ? HODimgHover : HODimg}
                    alt="Department Head"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "Department Head" ? style.roleTitleHover : style.roleTitle}  ${style.marginTop10}`}>Department Head</p>
                </div>
              )}
              {userRole?.includes("Credentialing Committee") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelection("Credentialing Committee")}
                  onMouseEnter={() => setHoveredRole("Credentialing Committee")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "Credentialing Committee" ? CCimgHover : CCimg}
                    alt="Credentialing Committee"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "Credentialing Committee" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Credentialing Committee</p>
                </div>
              )}
              {userRole?.includes("Credentialing Committee User") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelection("Credentialing Committee User")}
                  onMouseEnter={() => setHoveredRole("Credentialing Committee User")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "Credentialing Committee User" ? CCimgHover : CCimg}
                    alt="Credentialing Committee User"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "Credentialing Committee User" ? style.roleTitleHover : style.roleTitle}  ${style.marginTop10}`}>Staff Manager's Credentialing Committee Workspace</p>
                </div>
              )}
              {userRole?.includes("Chief Of Staff") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelection("Chief Of Staff")}
                  onMouseEnter={() => setHoveredRole("Chief Of Staff")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "Chief Of Staff" ? COSimgHover : COSimg}
                    alt="Chief Of Staff"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "Chief Of Staff" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Chief Of Staff</p>
                </div>
              )}
                 {userRole?.includes("Entity Sys Admin") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelectionSys("Entity Sys Admin")}
                  onMouseEnter={() => setHoveredRole("Entity Sys Admin")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "Entity Sys Admin" ? SAimgHover : SAimg}
                    alt="Entity Sys Admin"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "Entity Sys Admin" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>System Administrator</p>
                </div>
              )}
            </div>
            <div>
              <p className={`${style.poweredBy}`}>© {new Date().getFullYear()} HapiCare,Inc. - All Rights Reserved</p>
            </div>
          </div>
        </div>
      {/* </Dialog> */}
    </>
  );
};

export default WorkModeDialog;
