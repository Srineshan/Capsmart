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
import CommonSelectField from "../CommonFields/CommonSelectField";

const WorkModeDialog = ({ getIsOpen }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get("user");
  const users = jwt(userDetails);
  const [userRoleToDisplay, setUserRoleToDisplay] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [userMDRole, setUserMDRole] = useState([]);
  const [selectedWorkSpace, setSelectedWorkSpace] = useState('');
  const [workModeType, setWorkModeType] = useState(() =>
    sessionStorage.getItem("workModeType") || ''
  );
  const [hoveredRole, setHoveredRole] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    setUserDetails();
  }, []);

  useEffect(() => {
    if ((userRole?.length >= 1 && userMDRole?.length >= 1) && selectedWorkSpace !== '') {
      setUserRoleToDisplay(selectedWorkSpace === 'CAP_MANAGER' ? userRole : userMDRole);
      const initialRoute = localStorage.getItem("initialRoute");
      if (selectedWorkSpace === 'CAP_MANAGER') {
        if (userRole?.length === 1 && localStorage?.getItem('initialRoute') !== undefined && localStorage?.getItem('initialRoute') !== 'undefined' && localStorage?.getItem('initialRoute') !== null) {
          sessionStorage.setItem("workModeType", userRole?.[0]);
          window.location.href = `${initialRoute}`;
          localStorage?.removeItem('initialRoute')
        } else if (userRole?.length === 1) {
          window.location.pathname = "/applications";
        }
      } else if (selectedWorkSpace === 'MD_MANAGER') {
        if (userMDRole?.length === 1 && localStorage?.getItem('initialRoute') !== undefined && localStorage?.getItem('initialRoute') !== 'undefined' && localStorage?.getItem('initialRoute') !== null) {
          sessionStorage.setItem("workModeType", userMDRole?.[0]);
          window.location.href = `${initialRoute}`;
          localStorage?.removeItem('initialRoute')
        } else if (userMDRole?.length === 1) {
          window.location.pathname = "/mdManager";
        }
      }
    } else {
      setUserRoleToDisplay(userRole);
    }
  }, [selectedWorkSpace]);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUserRole(userData?.roles?.map((data) => data?.roleName) || []);
    setUserMDRole(userData?.mdRoles?.map((data) => data?.roleName) || [])
    console.log("userRoletimes", userRole)
  };

  const handleWorkModeSelection = (role) => {
    setWorkModeType(role);
    sessionStorage.setItem("workModeType", role);
    const initialRoute = localStorage.getItem("initialRoute");
    if (initialRoute && initialRoute !== undefined && initialRoute !== 'undefined' && initialRoute !== null) {
      console.log("pathnameee", initialRoute)
      window.location.href = `${initialRoute}`;
      localStorage?.removeItem('initialRoute')
    } else {
      if (selectedWorkSpace === "MD_MANAGER") {
        window.location.pathname = "/mdManager";
      } else {
        window.location.pathname = "/applications";
      }
    }
    localStorage?.removeItem('initialRoute');
  };

  // const handleWorkModeSelectionAuthor = (role) => {
  //   setWorkModeType(role);
  //   sessionStorage.setItem("workModeType", role);
  //   window.location.pathname = "/mdManager/manageAttestationGroups"
  // };


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
        {((userRole?.length >= 1 && userMDRole?.length >= 1) && selectedWorkSpace === '') ? (
          <div className={`${style.fullHeight} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
            <div>
              <div className={style.workSpaceCard}>
                <div className={style.workSpaceTitle}>Workspace Selection</div>
                <div className={style.marginTop}>
                  <CommonSelectField
                    value={selectedWorkSpace}
                    onChange={(e) => setSelectedWorkSpace(e.target.value)}
                    className={style.fullWidth1}
                    valueList={["CAP_MANAGER", "MD_MANAGER"]}
                    labelList={["Staff Manager", "Medical Directive Manager"]}
                    disabledList={false}
                    required={true}
                    label={"Select User Workspace"}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
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
                ${userRoleToDisplay?.length % 2 === 0 ? style.twoColumnGrid :
                  style.threeColumnGrid
                } 
                ${style.padding2} ${style.placeCenter}
              `}
            >
              {userRoleToDisplay?.includes("MD Manager") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelection("MD Manager")}
                  onMouseEnter={() => setHoveredRole("MD Manager")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "MD Manager" ? SMimgHover : SMimg}
                    alt="MD Manager"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "MD Manager" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>MD Manager</p>
                </div>
              )}
              {userRoleToDisplay?.includes("Author") && (
                <div
                  className={`${style.justifyItem} ${style.backgroundRoleColor} ${style.cursorPointer}`}
                  onClick={() => handleWorkModeSelection("Author")}
                  onMouseEnter={() => setHoveredRole("Author")}
                  onMouseLeave={() => setHoveredRole(null)}
                >
                  <img
                    src={hoveredRole === "Author" ? SAimgHover : SAimg}
                    alt="Author"
                    className={`${style.crossStyle} ${style.cursorPointer}`}
                  />
                  <p className={`${hoveredRole === "Author" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Author</p>
                </div>
              )}
              {userRoleToDisplay?.includes("Staff Manager") && (
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
              {userRoleToDisplay?.includes("Department Head") && (
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
              {userRoleToDisplay?.includes("Credentialing Committee") && (
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
              {userRoleToDisplay?.includes("Credentialing Committee User") && (
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
              {userRoleToDisplay?.includes("Chief Of Staff") && (
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
              {userRoleToDisplay?.includes("Entity Sys Admin") && (
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
        )}
      </div >
      {/* </Dialog> */}
    </>
  );
};

export default WorkModeDialog;
