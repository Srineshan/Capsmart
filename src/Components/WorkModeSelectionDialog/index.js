import React, { useState, useEffect } from "react";
import { GET, TenantID } from "../../Screens/dataSaver";
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
import CAPManager from "../../images/CAPManagerSmallLogo.png";
import MDManager from "../../images/MDManager.png";
import Cookie from "universal-cookie";
import jwt from "jwt-decode";
import style from "./index.module.scss";
import CrossPink from "../../images/crossPink.png";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonDivider from "../CommonFields/CommonDivider";

const WorkModeDialog = ({ getIsOpen }) => {
  let cookie = new Cookie();
  let userDetails = cookie.get("user");
  let entityId = cookie.get("entityId");
  const users = jwt(userDetails);
  const [userRoleToDisplay, setUserRoleToDisplay] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [userMDRole, setUserMDRole] = useState([]);
  const [selectedWorkSpace, setSelectedWorkSpace] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [showEntitySelection, setShowEntitySelection] = useState(false);
  const [selectedSite, setSelectedSite] = useState('')
  const [workModeType, setWorkModeType] = useState(() =>
    sessionStorage.getItem("workModeType") || ''
  );
  const isMasterEntity = sessionStorage.getItem('masterEntity') ? sessionStorage.getItem('masterEntity') === "true" ? true : false : ''
  const [hoveredRole, setHoveredRole] = useState(null);
  const [userData, setUserData] = useState();
  const [entitySiteList, setEntitySiteList] = useState([]);
  const isHapicareUser = isMasterEntity;

  useEffect(() => {
    sessionStorage.setItem("fromSummary", false);
    setUserDetails();
  }, []);

  useEffect(() => {
    if (userData && isHapicareUser !== undefined)
      getEntitySites()
    console.log(userData, isHapicareUser, entityId, 'check')
  }, [userData, isHapicareUser, entityId])

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
          sessionStorage.setItem("workModeType", userRole?.[0]);
          if (isHapicareUser) {
            window.location.pathname = "/applicant";
          } else {
            window.location.pathname = "/applications";
          }
        }
      } else if (selectedWorkSpace === 'MD_MANAGER') {
        if (userMDRole?.length === 1 && localStorage?.getItem('initialRoute') !== undefined && localStorage?.getItem('initialRoute') !== 'undefined' && localStorage?.getItem('initialRoute') !== null) {
          sessionStorage.setItem("workModeType", userMDRole?.[0]);
          window.location.href = `${initialRoute}`;
          localStorage?.removeItem('initialRoute')
        } else if (userMDRole?.length === 1) {
          sessionStorage.setItem("workModeType", userMDRole?.[0]);
          if (isHapicareUser) {
            window.location.pathname = "/mdManager/manageAttestation";
          } else {
            if (userMDRole?.[0] === "Acknowledger") {
              window.location.pathname = "/mdManager/manageAcknowledgement";
            } else if (userMDRole?.[0] === "Reviewer / Approver") {
              window.location.pathname = "/mdManager/manageSignOff";
            } else {
              window.location.pathname = "/mdManager";
            }
          }
        }
      }
    } else {
      setUserRoleToDisplay(userRole);
    }
  }, [selectedWorkSpace]);

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    setUserData(userData)
    sessionStorage.setItem("user", JSON.stringify(userData));
    // if (userData?.organizations?.length > 1 && selectedEntity === '') {
    //   setShowEntitySelection(true)
    // } else {
    setUserRole(!isHapicareUser ? userData?.roles?.map((data) => data?.roleName) || [] : userData?.organizations?.[0]?.roles?.map((data) => data?.roleName) || []);
    setUserMDRole(!isHapicareUser ? userData?.mdRoles?.map((data) => data?.roleName) || [] : userData?.organizations?.[0]?.mdRoles?.map((data) => data?.roleName) || [])
    // }
    console.log("userRoletimes", userRole)
  };

  const handleWorkModeSelection = (role) => {
    setWorkModeType(role);
    sessionStorage.setItem("workModeType", role);
    const initialRoute = localStorage.getItem("initialRoute");
    if (initialRoute && initialRoute !== undefined && initialRoute !== 'undefined' && initialRoute !== null) {
      console.log("pathnameee", initialRoute)
      window.location.href = `${initialRoute}`;
      console.log("initialRoute", initialRoute)
      localStorage?.removeItem('initialRoute')
    } else {
      if (selectedWorkSpace === "MD_MANAGER") {
        if (role === "Acknowledger") {
          window.location.pathname = "/mdManager/manageAcknowledgement";
        } else if (role === "Reviewer / Approver") {
          window.location.pathname = "/mdManager/manageSignOff";
        } else {
          window.location.pathname = "/mdManager";
        }
      } else {
        window.location.pathname = "/applications";
        sessionStorage.setItem("applicationCreationType", "REAPPOINTMENT");
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

  const handleSelectedEntity = (value) => {
    cookie.remove('entityId', { path: '/' })
    cookie.set('entityId', value, { path: '/' });
    setSelectedEntity(value);
    setShowEntitySelection(false);
    setUserRole(userData?.organizations?.filter(data => data?.tenant?.tenantId === value)?.[0]?.roles?.map((data) => data?.roleName) || []);
    setUserMDRole(userData?.organizations?.filter(data => data?.tenant?.tenantId === value)?.[0]?.mdRoles?.map((data) => data?.roleName) || [])
  }

  const getEntitySites = async () => {
    const { data: entitySites } = await GET(
      `entity-service/entity/ListOfIds?entityIds=${isHapicareUser ? userData?.organizations?.map(data => data?.tenant?.tenantId) : entityId}`
    );
    setEntitySiteList(entitySites);
    if ((entitySites?.length === 1 && entitySites?.[0]?.sites?.length === 1)) {
      sessionStorage.setItem('selectedSite', entitySites?.[0]?.sites?.[0]?.id)
    }
  }

  const handleSelectedSite = (id) => {
    setSelectedSite(id);
    sessionStorage.setItem('selectedSite', id)
  }

  const handleMDLSelect = () => {
    sessionStorage.setItem("workModeType", userMDRole?.[0]);
    window.location.pathname = `/mdManager/libraries/${entityId}/${entitySiteList?.[0]?.sites?.[0]?.departmentList?.departments?.[0]?.id}`;
  }

  return (
    <>
      {/* <Dialog
        isOpen={getIsOpen}
        onClose={() => getIsOpen(false)}
        className={`${style.eSignDialog} ${style.eSignDialogBackground} ${style.marginDialog} ${style.backGroundStyle}`}
        canOutsideClickClose={false}
        canEscapeKeyClose={false}
      > */}
      <div className={`${style.backGroundStyle} ${style.fullHeight} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
        <div className={`${style.workSpaceCard}`}>
          {/* {showEntitySelection && (
            <div className={`${style.fullHeight} ${style.verticalAlignCenter} ${style.justifyCenter}`}>
              <div>
                <div className={style.workSpaceCard}>
                  <div className={style.workSpaceTitle}>Entity Selection</div>
                  <div className={style.marginTop}>
                    <CommonSelectField
                      value={selectedEntity}
                      onChange={(e) => handleSelectedEntity(e.target.value)}
                      className={style.fullWidth1}
                      valueList={userData?.organizations?.map(data => data?.tenant?.tenantId)}
                      labelList={userData?.organizations?.map(data => data?.entityName?.entityName)}
                      disabledList={userData?.organizations?.map(data => false)}
                      required={true}
                      label={"Select Entity"}
                    />
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <div>
            <div className={`${style.heading}  ${style.padding}`}>Your user account Login: {userData?.email?.officialEmail}</div>
            <CommonDivider className={style.dividerMargin} />
          </div>
          {((entitySiteList?.length >= 1 || entitySiteList?.[0]?.sites?.length > 1)) && (
            <div>
              <div className={`${style.heading}  ${style.padding} ${selectedSite !== '' ? style.disabledView : ''}`}>{selectedSite === '' ? 'Select Site' : 'Selected Site'}</div>
              <div className={`${style.workSpaceDesc}  ${selectedSite !== '' ? style.disabledView : ''}`}>Your user account is associated with multiple sites:</div>
              <div className={`${style.threeCol} ${style.padding}`}>
                {entitySiteList?.map(entity => entity?.sites?.map(site => (
                  <div className={`${style.applicationSelectionCard} ${selectedSite === site?.id ? style.selectedApplicationCard : ''} ${style.justifyCenter} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`} onClick={!isHapicareUser ? () => { handleSelectedSite(site?.id) } : () => { handleSelectedSite(site?.id); handleSelectedEntity(entity?.id) }}>
                    <img src={entity?.logo?.file?.fileURL} alt="" className={style.applicationImage} />
                    <div className={style.marginLeft10}><div className={style.siteNamePrimary}>{site?.siteName?.siteName}</div></div>
                  </div>
                )))}
              </div>
              <CommonDivider className={style.dividerMargin} />
            </div>
          )}
          {((userRole?.length >= 1 && userMDRole?.length >= 1)) && (
            <div>
              <div className={`${style.heading}  ${style.padding} ${selectedWorkSpace !== '' ? style.disabledView : ''}`}>{selectedWorkSpace === '' ? 'Select Application' : 'Selected Application'}</div>
              <div className={`${style.workSpaceDesc}  ${selectedWorkSpace !== '' ? style.disabledView : ''}`}>Select the application you want to work in:</div>
              <div className={`${style.threeCol} ${style.padding}`}>
                {["CAP_MANAGER", "MD_MANAGER"]?.map(data => (
                  <div className={`${style.applicationSelectionCard} ${selectedWorkSpace === data ? style.selectedApplicationCard : ''} ${style.justifyCenter} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`} onClick={() => setSelectedWorkSpace(data)}>
                    <img src={data === 'CAP_MANAGER' ? CAPManager : MDManager} alt="" className={style.applicationImage} />
                    <div className={style.marginLeft10}>{data === 'CAP_MANAGER' ? <div className={style.applicationName}>CAP<span className={style.applicationNamePrimary}>Manager</span></div> : <div className={style.applicationName}>MD<span className={style.applicationNamePrimary}>Manager</span></div>}</div>
                  </div>
                ))}
              </div>
              <CommonDivider className={style.dividerMargin} />
            </div>
          )}
          {selectedWorkSpace !== "" && (
            <div>
              <div>
                <div className={`${style.heading}  ${style.padding}`}>Select {selectedWorkSpace === "CAP_MANAGER" ? 'CAP Manager' : 'MD Manager'} Workspace</div>
                <div className={`${style.workSpaceDesc} `}>Your user role allows you to access multiple workspaces, select the workspace you want to work in:</div>
              </div>
              <div className={`${style.threeCol} ${style.padding2}`}>
                {userRoleToDisplay?.includes("MD Librarian") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("MD Librarian")}
                    onMouseEnter={() => setHoveredRole("MD Librarian")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "MD Librarian" ? SMimgHover : SMimg}
                      alt="MD Librarian"
                      className={` ${style.cursorPointer} ${style.applicationImage} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "MD Librarian" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>MD Librarian</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Acknowledger") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Acknowledger")}
                    onMouseEnter={() => setHoveredRole("Acknowledger")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Acknowledger" ? SMimgHover : SMimg}
                      alt="Acknowledger"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Acknowledger" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Acknowledger</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Reviewer / Approver") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Reviewer / Approver")}
                    onMouseEnter={() => setHoveredRole("Reviewer / Approver")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Reviewer / Approver" ? SMimgHover : SMimg}
                      alt="Reviewer / Approver"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Reviewer / Approver" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Reviewer / Approver</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Author / Owner") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Author / Owner")}
                    onMouseEnter={() => setHoveredRole("Author / Owner")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Author / Owner" ? SAimgHover : SAimg}
                      alt="Author / Owner"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Author / Owner" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Author / Owner</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Staff Manager") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Staff Manager")}
                    onMouseEnter={() => setHoveredRole("Staff Manager")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Staff Manager" ? SMimgHover : SMimg}
                      alt="Staff Manager"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Staff Manager" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Staff Manager</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Department Head") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Department Head")}
                    onMouseEnter={() => setHoveredRole("Department Head")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Department Head" ? HODimgHover : HODimg}
                      alt="Department Head"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Department Head" ? style.roleTitleHover : style.roleTitle}  ${style.marginTop10}`}>Department Head</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Credentialing Committee") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Credentialing Committee")}
                    onMouseEnter={() => setHoveredRole("Credentialing Committee")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Credentialing Committee" ? CCimgHover : CCimg}
                      alt="Credentialing Committee"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Credentialing Committee" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Credentialing Committee</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Credentialing Committee User") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Credentialing Committee User")}
                    onMouseEnter={() => setHoveredRole("Credentialing Committee User")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Credentialing Committee User" ? CCimgHover : CCimg}
                      alt="Credentialing Committee User"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Credentialing Committee User" ? style.roleTitleHover : style.roleTitle}  ${style.marginTop10}`}>Staff Manager's Credentialing Committee Workspace</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Chief Of Staff") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelection("Chief Of Staff")}
                    onMouseEnter={() => setHoveredRole("Chief Of Staff")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Chief Of Staff" ? COSimgHover : COSimg}
                      alt="Chief Of Staff"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Chief Of Staff" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>Chief Of Staff</p>
                  </div>
                )}
                {userRoleToDisplay?.includes("Entity Sys Admin") && (
                  <div
                    className={`${style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                    onClick={() => handleWorkModeSelectionSys("Entity Sys Admin")}
                    onMouseEnter={() => setHoveredRole("Entity Sys Admin")}
                    onMouseLeave={() => setHoveredRole(null)}
                  >
                    <img
                      src={hoveredRole === "Entity Sys Admin" ? SAimgHover : SAimg}
                      alt="Entity Sys Admin"
                      className={` ${style.applicationImage} ${style.cursorPointer} ${style.marginRight}`}
                    />
                    <p className={`${hoveredRole === "Entity Sys Admin" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>System Administrator</p>
                  </div>
                )}
              </div>
              {/* {selectedWorkSpace === "MD_MANAGER" && (
                <div className={style.padding}>
                  <div className={`${style.applicationSelectionCard} ${style.justifyCenter} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`} onClick={() => handleMDLSelect()}>
                    <img src={MDManager} alt="" className={style.applicationImage} />
                    <div className={style.marginLeft10}>{<div className={style.applicationNamePrimary}>Medical Directives Library</div>}</div>
                  </div>
                </div>
              )} */}
              <div>
                <p className={`${style.poweredBy}`}>© {new Date().getFullYear()} HapiCare,Inc. - All Rights Reserved</p>
              </div>
            </div>
          )}
        </div>
      </div >
      {/* </Dialog> */}
    </>
  );
};

export default WorkModeDialog;
