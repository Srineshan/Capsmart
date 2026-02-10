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
import EDUSmart from "../../images/EDUSmart.png"
import MDManager from "../../images/MDManager.png";
import PNPManager from "../../images/PNPManager.png";
import Cookie from "universal-cookie";
import jwt from "jwt-decode";
import style from "./index.module.scss";
import CrossPink from "../../images/crossPink.png";
import CommonSelectField from "../CommonFields/CommonSelectField";
import CommonDivider from "../CommonFields/CommonDivider";
import { useDescope } from "@descope/react-sdk";
import { Tooltip } from "@mui/material";

const WorkModeDialog = ({ getIsOpen }) => {
  let cookie = new Cookie();
  const { logout } = useDescope();
  const workspaceFromSession = sessionStorage.getItem('workspace');
  let userDetails = cookie.get("user");
  let entityId = cookie.get("entityId");
  const users = jwt(userDetails);
  const [userRoleToDisplay, setUserRoleToDisplay] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [userMDRole, setUserMDRole] = useState([]);
  const [userPNPRole, setUserPNPRole] = useState([]);
  const [userLMSRole, setUserLMSRole] = useState([]);
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
  const [applications, setApplications] = useState([]);
  const roles = [userRole, userMDRole, userPNPRole, userLMSRole];
  const activeRoles = roles.filter(role => role?.length >= 1);
  const rolesCheck = [
    { key: 'CAP_MANAGER', value: userRole },
    { key: 'MD_MANAGER', value: userMDRole },
    { key: 'PNP_MANAGER', value: userPNPRole },
    { key: 'LMS_MANAGER', value: userLMSRole }
  ];
  const activeRolesCheck = rolesCheck.filter(role => role.value?.length > 0);
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
    if ((activeRoles?.length >= 2) && selectedWorkSpace !== '') {
      setUserRoleToDisplay(selectedWorkSpace === 'CAP_MANAGER' ? userRole : selectedWorkSpace === 'MD_MANAGER' ? userMDRole : userPNPRole);
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
      } else if (selectedWorkSpace === 'PNP_MANAGER') {
        if (userPNPRole?.length === 1 && localStorage?.getItem('initialRoute') !== undefined && localStorage?.getItem('initialRoute') !== 'undefined' && localStorage?.getItem('initialRoute') !== null) {
          sessionStorage.setItem("workModeType", userPNPRole?.[0]);
          window.location.href = `${initialRoute}`;
          localStorage?.removeItem('initialRoute')
        } else if (userPNPRole?.length === 1) {
          sessionStorage.setItem("workModeType", userPNPRole?.[0]);
          if (isHapicareUser) {
            window.location.pathname = "/pnpManager/manageAttestation";
          } else {
            if (userPNPRole?.[0] === "Acknowledger") {
              window.location.pathname = "/pnpManager/manageAcknowledgement";
            } else if (userPNPRole?.[0] === "Reviewer / Approver") {
              window.location.pathname = "/pnpManager/manageSignOff";
            } else {
              window.location.pathname = "/pnpManager";
            }
          }
        }
      }
    } else {
      setUserRoleToDisplay(userRole);
    }
  }, [selectedWorkSpace]);

  useEffect(() => {
    if (workspaceFromSession && applications?.includes(workspaceFromSession)) {
      setSelectedWorkSpace(workspaceFromSession)
    }
  }, [workspaceFromSession, applications])

  useEffect(() => {
    console.log(activeRolesCheck, 'rolesCheck')
    if (activeRolesCheck?.length === 1) {
      const selected = activeRolesCheck[0].key;
      setSelectedWorkSpace(selected);
      sessionStorage.setItem('selectedApplication', selected);
    }
  }, [userRole, userMDRole, userPNPRole, userLMSRole])

  const setUserDetails = async () => {
    const { data: userData } = await GET(`user-management-service/user/${users?.id}`);
    setUserData(userData)
    sessionStorage.setItem("user", JSON.stringify(userData));
    // if (userData?.organizations?.length > 1 && selectedEntity === '') {
    //   setShowEntitySelection(true)
    // } else {
    let tempUserRole = !isHapicareUser ? userData?.roles?.map((data) => data?.roleName) || [] : userData?.organizations?.[0]?.roles?.map((data) => data?.roleName) || [];
    let tempUserMDRole = !isHapicareUser ? userData?.mdRoles?.map((data) => data?.roleName) || [] : userData?.organizations?.[0]?.mdRoles?.map((data) => data?.roleName) || [];
    let tempUserPNPRole = !isHapicareUser ? userData?.pnpRoles?.map((data) => data?.roleName) || [] : userData?.organizations?.[0]?.pnpRoles?.map((data) => data?.roleName) || [];
    let tempUserLMSRole = !isHapicareUser ? userData?.lmsRoles?.map((data) => data?.roleName) || [] : userData?.organizations?.[0]?.lmsRoles?.map((data) => data?.roleName) || [];
    setUserRole(tempUserRole);
    setUserMDRole(tempUserMDRole)
    setUserPNPRole(tempUserPNPRole)
    setUserLMSRole(tempUserLMSRole)
    // }
    let tempApplications = [];
    if (tempUserRole?.length >= 1) tempApplications.push("CAP_MANAGER");
    if (tempUserMDRole?.length >= 1) tempApplications.push("MD_MANAGER");
    if (tempUserPNPRole?.length >= 1) tempApplications.push("PNP_MANAGER");
    if (tempUserLMSRole?.length >= 1) tempApplications.push("LMS_MANAGER");
    setApplications(tempApplications);
    console.log("userRoletimes", userRole, tempApplications, userData, isHapicareUser)
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
      } else if (selectedWorkSpace === "PNP_MANAGER") {
        if (role === "Acknowledger") {
          window.location.pathname = "/pnpManager/manageAcknowledgement";
        } else if (role === "Reviewer / Approver") {
          window.location.pathname = "/pnpManager/manageSignOff";
        } else {
          window.location.pathname = "/pnpManager";
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
    setUserPNPRole(userData?.organizations?.filter(data => data?.tenant?.tenantId === value)?.[0]?.pnpRoles?.map((data) => data?.roleName) || [])
    setUserLMSRole(userData?.organizations?.filter(data => data?.tenant?.tenantId === value)?.[0]?.lmsRoles?.map((data) => data?.roleName) || [])
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

  const handleLogout = () => {
    cookie.remove("user", { path: "/" });
    cookie.remove("entityId", { path: "/" });
    cookie.remove("authorization", {
      path: "/",
      domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.split('.')?.slice(-2)?.join('.') : window.location.hostname
    });
    sessionStorage.setItem('applicationCreationType', 'REAPPOINTMENT');
    sessionStorage.removeItem('selectedTab');
    logout()
    window.location.pathname = `/`;
  }

  const handleMDLSelect = () => {
    sessionStorage.setItem("workModeType", userMDRole?.[0]);
    window.location.pathname = `/mdManager/libraries/${entityId}/${entitySiteList?.[0]?.sites?.[0]?.departmentList?.departments?.[0]?.id}`;
  }

  const handleLMSRoute = () => {
    window.location.href = `https://lms.indocaribe.com/descope-login/?ssotoken=${cookie.get("authorization")}`;
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
            <div className={style.spaceBetween}>
              <div className={`${style.heading}  ${style.padding}`}>Your user account Login: {userData?.email?.officialEmail}</div>
              <Tooltip arrow title={"Logout"}>
                <img
                  src={CrossPink}
                  alt="cross"
                  className={`${style.crossStyle} ${style.marginRight40} ${style.cursorPointer} ${style.marginTop}`}
                  onClick={() => {
                    handleLogout(false);
                  }}
                />
              </Tooltip>
            </div>
            <CommonDivider className={style.dividerMargin} />
          </div>
          {((entitySiteList?.length > 1 || entitySiteList?.[0]?.sites?.length > 1)) && (
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
          {((entitySiteList?.length > 1 || entitySiteList?.[0]?.sites?.length > 1) ? (activeRoles?.length >= 2 && selectedSite !== '') : (activeRoles?.length >= 2)) && (
            <div>
              <div className={`${style.heading}  ${style.padding} ${selectedWorkSpace !== '' ? style.disabledView : ''}`}>{selectedWorkSpace === '' ? 'Select Application' : 'Selected Application'}</div>
              <div className={`${style.workSpaceDesc}  ${selectedWorkSpace !== '' ? style.disabledView : ''}`}>Select the application you want to work in:</div>
              <div className={`${style.threeCol} ${style.padding}`}>
                {applications?.map(data => (
                  <Tooltip title={`${data === 'CAP_MANAGER' ?
                    'Click to access the Credentialing & Privileging workspace to manage staff, locum workflows, and privilege approvals.'
                    : data === "MD_MANAGER" ?
                      'Click to access the Medical Directives workspace to create, update, and manage MDs, workflows, and attestations.'
                      : data === "LMS_MANAGER" ?
                        'Click to access the EduSmart learning workspace to assign, track, and complete training and competency modules.'
                        :
                        'Click to access the Policies & Procedures workspace to author, review, and manage P&Ps and their attestation cycles.'}`} arrow>
                    <div className={`${data === "PNP_MANAGER" ? style.applicationSelectionPNPCard : style.applicationSelectionCard} ${selectedWorkSpace === data ? data === "PNP_MANAGER" ? style.selectedApplicationPNPCard : style.selectedApplicationCard : ''} ${style.justifyCenter} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`} onClick={data === "LMS_MANAGER" ? () => handleLMSRoute() : () => { setSelectedWorkSpace(data); sessionStorage.setItem('selectedApplication', data) }}>
                      <img src={data === 'CAP_MANAGER' ? CAPManager : data === "MD_MANAGER" ? MDManager : data === "LMS_MANAGER" ? EDUSmart : PNPManager} alt="" className={style.applicationImage} />
                      <div className={style.marginLeft10}>{data === 'CAP_MANAGER' ? <div className={style.applicationName}>CAP<span className={style.applicationNamePrimary}>Manager</span></div> : data === 'MD_MANAGER' ? <div className={style.applicationName}>MD<span className={style.applicationNamePrimary}>Manager</span></div> : data === 'LMS_MANAGER' ? <div className={style.applicationName}>EDU<span className={style.applicationNamePrimary}>Smart</span></div> : <div className={style.applicationPNPName}>P&P<span className={style.pnpNamePrimary}>Manager</span></div>}</div>
                    </div>
                  </Tooltip>
                ))}
              </div>
              <CommonDivider className={style.dividerMargin} />
            </div>
          )}
          {selectedWorkSpace !== "" && (
            <div>
              <div>
                <div className={`${style.heading}  ${style.padding}`}>Select {selectedWorkSpace === "CAP_MANAGER" ? 'CAP Manager' : selectedWorkSpace === "MD_MANAGER" ? 'MD Manager' : 'P&P Manager'} Workspace</div>
                <div className={`${style.workSpaceDesc} `}>Your user role allows you to access multiple workspaces, select the workspace you want to work in:</div>
              </div>
              <div className={`${style.threeCol} ${style.padding2}`}>
                {userRoleToDisplay?.includes("MD Librarian") && (
                  <Tooltip title="Select this workspace to create or update Medical Directives, adjust workflows, and manage attestation groups." arrow>
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Acknowledger") && (
                  <Tooltip title={selectedWorkSpace === 'PNP_MANAGER' ? "Select this workspace to validate P&P content and confirm details before they move to approval." : "Select this workspace to review MDs and confirm they align with your department’s practices."} arrow>
                    <div
                      className={`${selectedWorkSpace === "PNP_MANAGER" ? style.applicationSelectionPNPWorkspaceCard : style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Reviewer / Approver") && (
                  <Tooltip title={selectedWorkSpace === 'PNP_MANAGER' ? "Select this workspace to review policy drafts for accuracy and approve them for publishing." : "Select this workspace to review MDs for accuracy and approve them for publishing and attestation."} arrow>
                    <div
                      className={`${selectedWorkSpace === "PNP_MANAGER" ? style.applicationSelectionPNPWorkspaceCard : style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Author / Owner") && (
                  <Tooltip title={selectedWorkSpace === 'PNP_MANAGER' ? "Select this workspace to draft or update Policy & Procedures and ensure they are accurate and current." : "Select this workspace to draft or update Medical Directives and ensure they are accurate and current."} arrow>
                    <div
                      className={`${selectedWorkSpace === "PNP_MANAGER" ? style.applicationSelectionPNPWorkspaceCard : style.applicationSelectionCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("P&P Manager") && (
                  <Tooltip title="Select this workspace to create and manage policy documents, update workflows, and coordinate reviews." arrow>
                    <div
                      className={`${style.applicationSelectionPNPWorkspaceCard} ${style.verticalAlignCenter} ${style.cursorPointer} ${style.marginRight}`}
                      onClick={() => handleWorkModeSelection("P&P Manager")}
                      onMouseEnter={() => setHoveredRole("P&P Manager")}
                      onMouseLeave={() => setHoveredRole(null)}
                    >
                      <img
                        src={hoveredRole === "P&P Manager" ? SMimgHover : SMimg}
                        alt="P&P Manager"
                        className={` ${style.cursorPointer} ${style.applicationImage} ${style.marginRight}`}
                      />
                      <p className={`${hoveredRole === "P&P Manager" ? style.roleTitleHover : style.roleTitle} ${style.marginTop10}`}>P&P Manager</p>
                    </div>
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Staff Manager") && (
                  <Tooltip title="Select this workspace to manage staff records, send applications, and verify applications & documents." arrow>
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Department Head") && (
                  <Tooltip title="Select this workspace to manage your department's staff including locums and review applicants" arrow>
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Credentialing Committee") && (
                  <Tooltip title="Select this workspace to review staff data on applications, documents and approve applications." arrow>
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Credentialing Committee User") && (
                  <Tooltip title="" arrow>
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Chief Of Staff") && (
                  <Tooltip title="Select this workspace to finalize privileging decisions and override temporary appointments when required." arrow>
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
                  </Tooltip>
                )}
                {userRoleToDisplay?.includes("Entity Sys Admin") && (
                  <Tooltip title="" arrow>
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
                  </Tooltip>
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
