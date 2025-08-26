import React, { useEffect, useState, useRef, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import history from "./routes/history";
import Loader from "./Components/LoadingScreen";
import WorkModeDialog from "./Components/WorkModeSelectionDialog";
import IdleTimer from "./Components/IdleTimer";
import Cookie from "universal-cookie";
import { Auth, GetEntityDetails, currentUser, baseUrl } from "./utils/auth";
import { TenantID, GET, POST } from "./Screens/dataSaver";
import {
  browserName,
  browserVersion,
  osName,
  osVersion,
  isMobile,
  isDesktop,
  isTablet,
} from "react-device-detect";
import { SuccessToaster, ErrorToaster } from "./utils/toaster";
import axios from "axios";
import jwt from "jwt-decode";
import { isSessionTokenExpired, useSession, getSessionToken, useDescope } from '@descope/react-sdk';
import MileageRateForCustomers from "./Screens/ReferenceList/mileageRateForCustomers";
import GeneralConfigurationForCustomers from "./Screens/ReferenceList/generalConfigurationForCustomers";
import LoginDialog from "./Components/LoginDialog";
import Departments from "./Screens/ReferenceList/department/Department";
import ApplicantTypesByEntity from "./Screens/ReferenceList/applicantTypeByEntity/applicantTypesByEntity";
import Speciality from "./Screens/ReferenceList/speciality/Speciality";
import AcknowledgementReview from "./Screens/ApplicationForm/AcknowledgementReview";
import ApplicantProcessingCheckList from "./Screens/ReferenceList/applicantCheckList/ApplicantProcessingCheckList";
import { PrivilegeListManager } from "./Screens/ReferenceList/privilegeListManager/PrivilegeListManager";
import PaymentList from "./Screens/ReferenceList/paymentList/paymentList";
import SettingList from "./Screens/ReferenceList/setting/settingList";

const ReportType = React.lazy(() => import("./Screens/Reports/reportType"));
const ReportTypeOverview = React.lazy(() =>
  import("./Screens/Reports/reportTypeOverview")
);
const Home = React.lazy(() => import("./Screens/CustomerSystemAdmin"));
const RetireMDManager = React.lazy(() => import("./Screens/MDManagerScreens/MDManager/retireMedicalDirectives"));
const MDManager = React.lazy(() => import("./Screens/MDManagerScreens/MDManager"));
const ManageAttestation = React.lazy(() => import("./Screens/MDManagerScreens/MDAttestations/ManageAttestations"));
const ManageAcknowledgement = React.lazy(() => import("./Screens/MDManagerScreens/MDAttestations/ManageAcknowledgements"));
const ManageSignOff = React.lazy(() => import("./Screens/MDManagerScreens/MDAttestations/ManageSignOff"));
const ManageAttestationGroups = React.lazy(() => import("./Screens/MDManagerScreens/MDAttestations/ManageAttestationGroups"));
const MDLibrary = React.lazy(() => import("./Screens/MDManagerScreens/MDLibrary"));
const MDManagerStep1 = React.lazy(() => import("./Screens/MDManagerScreens/MDManager/step1"));
const HistoricalData = React.lazy(() => import("./Screens/StaffApplication/fillHistoricalData"));
const ApplicationSubmitted = React.lazy(() => import("./Components/ApplicationSubmitted"));
const FunctionalTitleForCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/functionalTitleForCustomer")
);
const ActiveContracts = React.lazy(() => import("./Screens/ContractManager"));
const StaffManager = React.lazy(() => import("./Screens/StaffManager"));
const Applicant = React.lazy(() => import("./Screens/Applicant"));
const StaffApplication = React.lazy(() => import("./Screens/StaffApplication"));
const ActiveStaff = React.lazy(() => import("./Screens/ActiveStaff"));
const LocumStaff = React.lazy(() => import("./Screens/LocumStaff"));
const DescopeLoginDialog = React.lazy(() => import("./Components/DescopeLogin"));
const Welcome = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/welcome")
);
const Login = React.lazy(() => import("./Screens/SuperAdminDashboard/login"));
const Notify = React.lazy(() => import("./Screens/SuperAdminDashboard/notify"));
const MoveToDraft = React.lazy(() =>
  import("./Screens/ContractManager/moveToDraft")
);
const RemindContractors = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/remindContractors")
);
const TrackYourContracts = React.lazy(() =>
  import("./Screens/ContractManager/trackYourContracts")
);
const NotifyEntityUser = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/notifyEntityUser")
);
const SetPassword = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/setPassword")
);
const ActivateAccess = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/activateAccess")
);
const SetPasswordWithoutEmail = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/setPasswordWithoutEmail")
);
const GetSSOId = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/getSSOId")
);
const EntitySetup = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/entitySetup")
);
const EntitySystemAdmin = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/entitySystemAdmin")
);
const SiteInformation = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/siteInformation")
);
const SiteUsers = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/siteUsers")
);
const AppSubscription = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/appSubscription")
);
const SetupComplete = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/setupComplete")
);
const OTPPage = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/otpPage")
);
const WelcomeToDashboard = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/welcomeToDashboard")
);
const EntryPage = React.lazy(() => import("./Screens"));
const Profile = React.lazy(() => import("./Components/Profile"));
const Users = React.lazy(() => import("./Screens/UserManagement"));
const ReportsHome = React.lazy(() => import("./Screens/Reports"));
const TimeSheetReportsBase = React.lazy(() =>
  import("./Screens/Reports/reports")
);
const ChartPage = React.lazy(() => import("./Screens/Reports/chart"));
const HelpHome = React.lazy(() => import("./Screens/HelpManagement"));
const TasksAndAlerts = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/tasksAndAlerts")
);
const ReferenceList = React.lazy(() => import("./Screens/ReferenceList"));

const IndustriesWithEntityTypes = React.lazy(() =>
  import("./Screens/ReferenceList/industriesWithEntityTypes")
);

const DepartmentsByEntityTypes = React.lazy(() =>
  import("./Screens/ReferenceList/departmentsByEntityTypes")
);
const AcknowledgementForm = React.lazy(() =>
  import("./Screens/ReferenceList/acknowledgment/Acknowledge")
);

const ContractedServiceProvidedByIndustries = React.lazy(() =>
  import("./Screens/ReferenceList/contractedServiceProvider")
);
const DisclosureIndustries = React.lazy(() =>
  import("./Screens/ReferenceList/disclosureByIndustries/DisclosureIndustries")
);
const PrivilegeListMaster = React.lazy(() =>
  import("./Screens/ReferenceList/privilegeListMaster/PrivilegeListMaster")
);
const FunctionalTitles = React.lazy(() =>
  import("./Screens/ReferenceList/functionalTitles")
);
const BoardCertification = React.lazy(() =>
  import("./Screens/ReferenceList/boardCertification")
);
const AbsenseReasonsByIndustries = React.lazy(() =>
  import("./Screens/ReferenceList/absenseReasonsByIndustries")
);
const SuffixByIndustries = React.lazy(() =>
  import("./Screens/ReferenceList/suffixByIndustries")
);
const ContractByIndustries = React.lazy(() =>
  import("./Screens/ReferenceList/contractByIndustries")
);
const TerminationReasons = React.lazy(() =>
  import("./Screens/ReferenceList/terminationReasons")
);
const HolidayListByIndustries = React.lazy(() =>
  import("./Screens/ReferenceList/holidayListByIndustries")
);
const CountriesSupportedWithStates = React.lazy(() =>
  import("./Screens/ReferenceList/countriesSupportedWithStates")
);
const CountriesWithStatesEntity = React.lazy(() =>
  import("./Screens/ReferenceList/countriesWithStatesEntity")
);
// const CountryWithStatesEntity = React.lazy(() =>
//   import("./Screens/ReferenceList/countryWithStatesEntity")
// );
const ProofOfDocumentationByEntity = React.lazy(() =>
  import("./Screens/ReferenceList/proofOfDocumentationByEntity")
);

const ProofOfDocumentByIndustries = React.lazy(() =>
  import("./Screens/ReferenceList/proofOfDocument/ProofOfDocumentByIndustries")
);

const ContractDocumentTypeForUpload = React.lazy(() =>
  import("./Screens/ReferenceList/contractDoumentTypeForUpload")
);

const HolidayScheduleForCustomers = React.lazy(() =>
  import("./Screens/ReferenceList/holidayScheduleForCustomers")
);
const CostCenterAndLocations = React.lazy(() =>
  import("./Screens/ReferenceList/costCenterAndLocations")
);
const DepartmentsForCustomers = React.lazy(() =>
  import("./Screens/ReferenceList/departmentsForCustomers")
);

// const DepartmentsService = React.lazy(() =>
//   import("./Screens/ReferenceList/department/DepartmentService")
// );
const StaffPrivilegesByDepartment = React.lazy(() =>
  import("./Screens/ReferenceList/staffPrivileges/StaffPrivileges")
);

const Consent = React.lazy(() =>
  import("./Screens/ReferenceList/consents/Consents")
);

const CustomerManagement = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/customerManagement")
);
const CustomerSetup = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/customerSetup")
);
const DepartmentsForCustomersMultiSite = React.lazy(() =>
  import("./Screens/ReferenceList/absenceReasonsForCustomer")
);
const AbsenceReasonsForCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/absenceReasonsForCustomer")
);
const SuffixByCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/suffixByCustomer")
);
const ContractDocumentUploadForCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/contractDocumentTypeUploadForCustomer")
);
const ContractServicesByEntityType = React.lazy(() =>
  import("./Screens/ReferenceList/contractedServicesByEntityType")
);
const ContractTypeForCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/contractTypeForCustomer")
);
const ContractServiceProviderBySiteType = React.lazy(() =>
  import("./Screens/ReferenceList/contractServiceProviderBySiteType")
);
const ContractServiceProviderForMultiSite = React.lazy(() =>
  import("./Screens/ReferenceList/contractServiceProviderMultiSite")
);
const FunctionalTitleMultiSitesForCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/functionalTitleMultiSitesForCustomer")
);
const TerminationReasonForCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/contractTerminationReasonForCustomer")
);
const SuperAdminDashboard = React.lazy(() =>
  import("./Screens/ReferenceList/superAdminDashboard")
);
const ClientAdminDashboard = React.lazy(() =>
  import("./Screens/ReferenceList/customerAdminDashboard")
);
const ApplicationSummary = React.lazy(() =>
  import("./Screens/ApplicationForm/ApplicationSummary")
);
const ApplicationAcknowledgement = React.lazy(() =>
  import("./Screens/ApplicationForm/ApplicationAcknowledgement")
);
const PODCheck = React.lazy(() => import("./Screens/ApplicationForm/PODCheck"));
// const ApplicantTypesByEntity = React.lazy(() =>
//   import("./Screens/ReferenceList//referenceList/contractServiceProviderBySiteType")
// );

// const ApplicantTypesByEntity = React.lazy(() =>
//   import("./Screens/ReferenceList/contractServiceProviderBySiteType")
// );

const Thankyou = React.lazy(() =>
  import("./Screens/SuperAdminDashboard/thankyou")
);
const ApplicationForm = React.lazy(() => import("./Screens/ApplicationForm"));
const ReappointmentApplicationForm = React.lazy(() => import("./Screens/ReappointmentApplicationForm"));
const LocumApplicationForm = React.lazy(() => import("./Screens/LocumApplicationForm"));
const MedicalDirectivesAttest = React.lazy(() => import("./Screens/ReappointmentApplicationForm/MedicalDirectives/MedicalDirectivesAttest"));
const LocumMedicalDirectivesAttest = React.lazy(() => import("./Screens/LocumApplicationForm/MedicalDirectives/MedicalDirectivesAttest"));
const ApplicationFormRequirement = React.lazy(() =>
  import("./Screens/ApplicationForm/ApplicationFormRequirement")
);
const ReappointmentApplicationFormRequirement = React.lazy(() =>
  import("./Screens/ReappointmentApplicationForm/ReappointmentApplicationFormRequirement")
);
const LocumApplicationFormRequirement = React.lazy(() =>
  import("./Screens/LocumApplicationForm/LocumApplicationFormRequirement")
);
const ApplicationRequest = React.lazy(() =>
  import("./Screens/ApplicationRequest")
);
const CompleteApplicationRequest = React.lazy(() =>
  import("./Screens/ApplicationRequest/CompleteApplicationRequest")
);
const CreateStaffMemberApplication = React.lazy(() =>
  import("./Screens/CreateStaffMemberApplication")
);

const CreateStaffReapplication = React.lazy(() =>
  import("./Screens/CreateStaffReapplication")
);

const ApplicantPortalRFC = React.lazy(() =>
  import("./Screens/ApplicantPortalRFC")
);


const ApplicantPortalDashboard = React.lazy(() =>
  import("./Screens/ApplicantDashboard")
);

const ApplicationSetup = React.lazy(() =>
  import("./Screens/ApplicationSetup/ApplicationConfiguration")
);

const MedicalDirectivesAttestRFC = React.lazy(() =>
  import("./Screens/MedicalDirectiveAttestRFC")
);

const MedicalDirectivesAttestDisplay = React.lazy(() =>
  import("./Screens/MedicalDirectivesAttestDisplay")
);

const MDRequestAttest = React.lazy(() =>
  import("./Screens/MDRequestAttest")
);
const MDAttest = React.lazy(() => import("./Screens/MDRequestAttest/MedicalDirectivesAttest"));
const MDAttestStatus = React.lazy(() => import("./Screens/MDManagerScreens/MDManager/MedicalDirectivesAttestStatus"));
const ManageMDAttest = React.lazy(() => import("./Screens/MDManagerScreens/MDAttestations/ManageAttestations/MedicalDirectivesAttest"));
const ManageMDAcknowledgement = React.lazy(() => import("./Screens/MDManagerScreens/MDAttestations/ManageAcknowledgements/MedicalDirectivesAcknowledge"));
const ManageMDSignOff = React.lazy(() => import("./Screens/MDManagerScreens/MDAttestations/ManageSignOff/MedicalDirectivesSignOff"));
const MedicalDirectivesMECApproval = React.lazy(() => import("./Screens/MDManagerScreens/MDManager/MedicalDirectivesMECApproval"));
let isHapicareUser;
let organizations;
const App = ({ props }) => {
  const [accessToken, setAccessToken] = useState(Auth());
  const { isAuthenticated, isSessionLoading } = useSession();
  const { refreshSession, setSession, logout, refresh } = useDescope();
  const sessionToken = getSessionToken();
  const [tenantId, setTenantId] = useState(GetEntityDetails());
  const [logo, setLogo] = useState(null);
  const [title, setTitle] = useState("CAPManager");
  const [entityId, setEntityId] = useState("");
  const [currentUserDetails, setCurrentUserDetails] = useState();
  const [entityDetails, setEntityDetails] = useState();
  var cookie = new Cookie();
  const [loggedInUser, setLoggedInUser] = useState();
  const [visibilityState, setVisibilityState] = useState(document.visibilityState);
  let authorization = cookie.get("authorization");
  let userFromCookie = cookie.get("user");
  let entityIdFromCookie = cookie.get('entityId');
  let errorInfo = sessionStorage.getItem('errorInfo');
  console.log(authorization, 'authorization', TenantID, isAuthenticated, loggedInUser?.id, entityIdFromCookie, document.cookie, cookie.get("authorization") === 'undefined', cookie.get("authorization") !== undefined)
  const [showDialog, setShowDialog] = useState(false);
  const refreshTimeoutRef = useRef(null);
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     setVisibilityState(document.visibilityState); // Update state on visibility change
  //   };

  //   // Add event listener
  //   document.addEventListener("visibilitychange", handleVisibilityChange);

  //   // Cleanup listener on unmount
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  useEffect(() => {
    console.log('entered', (cookie.get("authorization") !== undefined && isAuthenticated), cookie.get("authorization") !== undefined, isAuthenticated)
    if (((cookie.get("authorization") !== undefined && isAuthenticated) || (authorization !== undefined && isAuthenticated && (errorInfo === 'Invalid token specified'))) && (cookie.get('entityId') === undefined || cookie.get('entityId') === 'undefined' || cookie.get('entityId') === '' || cookie.get('entityId') === null)) {
      console.log('entered')
      getEntityId();
    }
  }, [cookie.get("authorization"), isAuthenticated, errorInfo, isSessionLoading])

  useEffect(() => {
    if ((entityId !== undefined && entityId !== '' && cookie.get("authorization") !== undefined && isAuthenticated) || (entityId !== undefined && entityId !== '' && cookie.get("authorization") !== undefined && isAuthenticated && errorInfo === 'Invalid token specified')) {
      login(entityId);
    }
    console.log(isAuthenticated, 'isAuthenticated')
  }, [entityId, cookie.get("authorization"), isAuthenticated, errorInfo])

  useEffect(() => {
    if (userFromCookie) {
      setLoggedInUser(currentUser());
    }
  }, [userFromCookie])

  // useEffect(() => {
  //   if (sessionToken !== undefined) {
  //     cookie.set('authorization', sessionToken, {
  //       path: '/'
  //     });
  //   }
  // }, [sessionToken])

  useEffect(() => {
    if (cookie.get("authorization") === 'undefined') {
      cookie.remove("authorization", { path: "/" });
      cookie.remove("user", { path: "/" });
      cookie.remove("entityId", { path: "/" });
      logout()
    }
    if (cookie.get("authorization") !== undefined) {
      let token = cookie.get("authorization")
      if (typeof token !== 'string') {
        // If the token is not a string, make sure to convert it into a string
        token = JSON.stringify(token);
      }
      if (isSessionTokenExpired(cookie.get("authorization"))) {
        cookie.remove("authorization", { path: "/" });
        cookie.remove("user", { path: "/" });
        cookie.remove("entityId", { path: "/" });
        logout()
      }
      console.log('sessionToken', token, typeof token, JSON.stringify(token), isSessionTokenExpired(cookie.get("authorization")), isSessionTokenExpired(cookie.get("authorization")), JSON.parse(atob(cookie.get("authorization").split('.')[1])))
      const decodedToken = jwt(cookie.get("authorization"));
      console.log('sessionToken', Date.now() > decodedToken.exp * 1000, Date.now(), decodedToken.exp * 1000, cookie.get("authorization"))
      if (Date.now() > decodedToken.exp * 1000) {
        console.log('sessionToken', Date.now() > decodedToken.exp * 1000, Date.now(), decodedToken.exp * 1000)
        cookie.remove("authorization", { path: "/" });
        cookie.remove("user", { path: "/" });
        cookie.remove("entityId", { path: "/" });
        logout()
      }
    }
  }, [cookie.get("authorization")])

  // useEffect(() => {
  //   startTokenRefreshInterval();
  // }, []);

  // useEffect(() => {
  //   console.log(sessionToken, sessionToken.split('.')[1], JSON.parse(atob(sessionToken.split('.')[1])), 'session check')
  //   const interval = setInterval(() => {
  //     scheduleTokenRefresh(JSON.parse(atob(sessionToken.split('.')[1])))
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (entityIdFromCookie !== undefined) {
      setEntityId(entityIdFromCookie)
    }
  }, [entityIdFromCookie]);

  // useEffect(() => {
  //   const reloadCount = sessionStorage.getItem("reloadCount");
  //   if (reloadCount < 1) {
  //     sessionStorage.setItem("reloadCount", String(reloadCount + 1));
  //     window.location.reload();
  //   } else {
  //     sessionStorage.removeItem("reloadCount");
  //   }
  // }, []);

  useEffect(() => {
    if (loggedInUser?.id !== undefined) {
      setUserDetails();
    }
  }, [loggedInUser?.id]);

  useEffect(() => {
    sessionStorage.setItem(
      "timeZoneAbbreviation",
      entityDetails?.sites
        ?.filter(
          (data) => data?.id === currentUserDetails?.sites?.sites?.[0]?.id
        )
        ?.map((data) => data)?.[0]?.timeZone?.abbrevation
    );
    sessionStorage.setItem(
      "siteTimeZone",
      entityDetails?.sites
        ?.filter(
          (data) => data?.id === currentUserDetails?.sites?.sites?.[0]?.id
        )
        ?.map((data) => data)?.[0]?.timeZone?.id
    );
  }, [entityDetails, currentUserDetails]);

  useEffect(() => {
    if (isAuthenticated && cookie.get("authorization") && cookie.get("authorization") !== 'undefined') {
      scheduleTokenRefresh(JSON.parse(atob(cookie.get("authorization").split('.')[1])))
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current); // Cleanup on unmount
      }
    };
  }, [isAuthenticated, cookie.get("authorization")]);

  axios.interceptors.request.use(
    (request) => {
      return request;
    },
    (error) => {
      console.log("request error", error);
      return error;
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      logError(error);
      console.log("response error", error, error.status);
      return error;
    }
  );

  const logError = async (error) => {
    let browser =
      browserName === "Chrome"
        ? "CHROME"
        : browserName === "Firefox"
          ? "FIREFOX"
          : browserName === "Safari"
            ? "SAFARI"
            : browserName === "Opera"
              ? "OPERA"
              : browserName === "Edge"
                ? "EDGE"
                : browserName === "Internet Explorer"
                  ? "INTERNETEXPLORER"
                  : browserName === "Chromium"
                    ? "CHROMIUM"
                    : browserName === "Yandex"
                      ? "YANDEX"
                      : browserName === "IE"
                        ? "IE"
                        : browserName === "Mobile Safari"
                          ? "MOBILESAFARI"
                          : browserName === "Edge Chromium"
                            ? "EDGECHROMIUM"
                            : browserName === "MIUI Browser"
                              ? "MIUIBROWSER"
                              : browserName === "Samsung Browser"
                                ? "SAMSUNGBROWSER"
                                : "";

    let os =
      osName === "Windows"
        ? "WINDOWS"
        : osName === "Linux"
          ? "LINUX"
          : osName === "Mac OS"
            ? "MAC"
            : osName === "iOS"
              ? "IOS"
              : osName === "Android"
                ? "ANDROID"
                : osName === "Windows Phone"
                  ? "WINDOWSPHONE"
                  : "";

    let deviceType = isDesktop
      ? "DESKTOP"
      : isMobile
        ? "MOBILE"
        : isTablet
          ? "TABLET"
          : "";
    let interceptorsInfo = sessionStorage.getItem("interceptorsInfo");

    let data = {
      subject: "Auto Ticket",
      description: `${error?.response?.data?.error} ${error?.response?.data?.path}`,
      createdBy: {
        id: loggedInUser?.id,
        name: {
          firstName: loggedInUser?.firstName,
          lastName: loggedInUser?.lastName,
          middleName: "",
          suffix: {
            id: "",
            suffix: "",
          },
        },
        email: { officialEmail: loggedInUser?.email },
        communication: {
          personalEmail: loggedInUser?.email,
          mobileNumber: "",
          landlineNumber: "",
          mobileNumberNotApplicable: false,
        },
      },
      assignedTo: {
        id: "",
        name: {
          firstName: "",
          lastName: "",
          middleName: "",
          suffix: {
            id: "",
            suffix: "",
          },
        },
        email: { officialEmail: "" },
        communication: {
          personalEmail: "",
          mobileNumber: "",
          landlineNumber: "",
          mobileNumberNotApplicable: false,
        },
      },
      type: "APPLICATION",
      impact: "HIGH",
      status: "NEW",
      generationMode: "SYSTEM",
      bugTrackingId: "string",
      site: {
        id: "string",
        siteName: {
          siteName: "string",
        },
      },
      tenant: {
        tenantId: TenantID,
      },
      ticketFile: {
        fileName: "",
        // ...(isEdit &&
        //     { 'id': ticketDetails?.ticketFile?.id }),
        // ...(isEdit &&
        //     { 'filePath': ticketDetails?.ticketFile?.filePath }),
        // ...(isEdit &&
        //     { 'fileURL': ticketDetails?.ticketFile?.fileURL }),
      },
      deviceDetails: {
        browser: browser,
        browserVersion: browserVersion,
        os: os,
        osVersion: osVersion,
        componentInfo: `${error?.response?.data?.error} ${error?.response?.data?.path}`,
        deviceType: deviceType,
        screenResolution: `width: ${window.innerWidth}, height: ${window.innerHeight}`,
      },
      dueDate: "2022-10-06",
      screenCaptured: false,
      externalBugTrackingSystem: true,
    };

    const formData = new FormData();

    formData.append(
      "ticketDetail",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      })
    );
    console.log(error)
    sessionStorage.setItem('errorInfo', error.message)
    // if (
    //   interceptorsInfo !==
    //   `${error?.response?.data?.error} ${error?.response?.data?.path}`
    // ) {
    //   await POST(`feedback-management-service/ticket`, formData)
    //     .then((response) => {
    //       sessionStorage.setItem(
    //         "interceptorsInfo",
    //         `${error?.response?.data?.error} ${error?.response?.data?.path}`
    //       );
    //       // SuccessToaster('Error Logged Successfully');
    //     })
    //     .catch((error) => {
    //       // ErrorToaster('Unexpected Error Occured');
    //     });
    // }
  };

  // const refreshTokens = async () => {
  //   try {
  //     const response = await refresh(); // Refresh the tokens
  //     const { sessionJwt, refreshJwt } = response;

  //     console.log("Session Token:", sessionJwt);
  //     console.log("Refresh Token:", refreshJwt);
  //     if (isSessionTokenExpired()) {
  //       cookie.set('authorization', sessionJwt, { path: '/' });
  //     }
  //     // Optionally, store tokens in cookies/localStorage for use
  //   } catch (error) {
  //     console.error("Failed to refresh tokens:", error);

  //     // Handle token refresh failure (e.g., logout the user)
  //   }
  // };

  // const startTokenRefreshInterval = () => {
  //   const interval = 5 * 60 * 1000; // 5 minutes (adjust based on token expiry time)

  //   setInterval(async () => {
  //     try {
  //       if (isSessionTokenExpired()) {
  //         await refreshTokens();
  //       }
  //     } catch (error) {
  //       console.error("Token refresh failed:", error);
  //     }
  //   }, interval);
  // };

  const refreshToken = async () => {
    if (isAuthenticated) {
      // try {
      refresh()
        .then((refreshedSession) => {
          console.log(refreshedSession, 'refreshed session')
          if (refreshedSession) {
            cookie.set('authorization', refreshedSession?.data?.sessionJwt, {
              path: '/'
            });
            console.log('Session refreshed and cookie updated!', refreshedSession);
          }
        })
        .catch((error) => {
          console.error('Failed to refresh token:', error);
          cookie.remove("authorization", { path: "/" });
          cookie.remove("user", { path: "/" });
          cookie.remove("entityId", { path: "/" });
          logout();
        });
      // const { data } = refresh();
      // setSession(data?.sessionJwt); // Update the session with the new token
      // cookie.set('authorization', data?.sessionJwt, {
      //   path: '/',
      // });
      // console.log('Token refreshed successfully!', data?.sessionJwt);
      // } catch (error) {
      //   console.error('Failed to refresh token:', error);
      //   cookie.remove("user", { path: "/" });
      //   cookie.remove("entityId", { path: "/" });
      //   logout();
      //   // window.location.href = '/';
      // }
    } else {
      cookie.remove("authorization", { path: "/" });
      cookie.remove("user", { path: "/" });
      cookie.remove("entityId", { path: "/" });
      logout();
    }
  };

  const scheduleTokenRefresh = (decodedToken) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    console.log('Token refresh scheduled...')
    const currentTime = Date.now() / 1000; // Current time in seconds
    const timeToExpiry = decodedToken.exp - currentTime; // Time left in seconds
    console.log(`Token expires in: ${timeToExpiry} seconds (Expiry: ${decodedToken.exp}, Now: ${currentTime})`)

    // setTimeout(() => {
    //   refreshToken();
    // }, (timeToExpiry - 60) * 1000);
    if (((timeToExpiry - 60) * 1000) > 60) {
      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          await refreshToken(); // Refresh token
          if (cookie.get("authorization") && cookie.get("authorization") !== 'undefined') {
            scheduleTokenRefresh(JSON.parse(atob(cookie.get("authorization").split('.')[1]))); // Re-run after successful refresh
          }
        } catch (err) {
          console.error("Token refresh failed", err);
        }
      }, ((timeToExpiry - 60) * 1000));
    }
  };

  const setUserDetails = async () => {
    const { data: user } = await GET(
      `user-management-service/user/${loggedInUser?.id}`
    );
    setCurrentUserDetails(user);
  };

  const getEntityId = async () => {
    let hostname = window.location.hostname;
    let requestHeader = hostname?.split('.')?.length === 3
      ? {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authorization}`,
          "X-subdomain": hostname?.split('.')?.[0],
        },
      }
      : {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authorization}`,
          "X-subdomain": 'master',
        },
      };
    console.log(requestHeader, 'requestHeader')
    await axios(`${baseUrl()}/entity-service/entityID`, requestHeader)
      .then((response) => {
        if (response?.data?.id) {
          console.log(response?.data, 'login route')
          isHapicareUser = response?.data?.masterEntity;
          sessionStorage.setItem('masterEntity', response?.data?.masterEntity)
          cookie.set("entityId", response?.data?.id, {
            path: "/",
            // domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.slice(-2)?.join('.') : window.location.hostname,
            // secure: true,
            // sameSite: 'none',
          });
          setEntityId(response?.data?.id);
          // if ((userFromCookie === undefined || userFromCookie === null) && authorization !== undefined) {
          login(response?.data?.id);
          // }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const login = (id) => {
    let hostname = window.location.hostname;
    const requestOptions = hostname?.split('.')?.length === 3 ? {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-tenantID": id,
        "Authorization": `Bearer ${authorization}`,
        "X-subdomain": hostname?.split('.')?.[0]
      },
    } : {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-tenantID": id,
        "Authorization": `Bearer ${authorization}`,
        "X-subdomain": 'master',
      },
    }
    fetch(`${baseUrl()}/user-management-service/auth/login`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        cookie.set("user", data?.accessToken, {
          path: "/",
          // domain: window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.slice(-2)?.join('.') : window.location.hostname,
          // secure: true,
          // sameSite: 'none',
        });
        organizations = data?.organizations || [];
        sessionStorage.setItem('organizations', JSON.stringify(data?.organizations))
      });
    console.log('entered')
    if (cookie.get("authorization") && cookie.get("authorization") !== 'undefined') {
      scheduleTokenRefresh(JSON.parse(atob(cookie.get("authorization").split('.')[1])))
    }
    return true;
  };

  // useEffect(() => {
  //   if (accessToken === false) {
  //     let authValue = cookie.get("user");
  //     setAccessToken(authValue);
  //   }
  //   if (
  //     accessToken === false &&
  //     window.location.pathname !== "/app" &&
  //     !window.location.pathname.includes("/app/setPassword")
  //   ) {
  //     window.location.pathname = "/app";
  //   }
  // }, [window.location.pathname]);

  useEffect(() => {
    // changeFavicon();
  }, [logo, title]);

  useEffect(() => {
    // changeFavicon();
    if (TenantID !== undefined && TenantID !== '' && TenantID) {
      getLogo();
    }
  }, []);

  const getLogo = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setEntityDetails(data);
    setLogo(data?.logoThumbnail?.file?.fileURL);
    setTitle(data?.entityName?.entityName);
    sessionStorage.setItem("entityTypeId", data?.entityType?.id);
    sessionStorage.setItem("entityTypeValue", data?.entityType?.type);
    sessionStorage.setItem("industry", data?.customerType);
    sessionStorage.setItem("logo", data?.logo?.file?.fileURL);
    sessionStorage.setItem("thumbnail", data?.logoThumbnail?.file?.fileURL);
    sessionStorage.setItem("title", data?.entityName?.entityName);
    sessionStorage.setItem(
      "isEmployeeContractNeeded",
      data?.isEmployeeContractIncluded
    );
    sessionStorage.setItem("isMultiSiteEntity", data?.multiSiteEntity);
  };

  const changeFavicon = () => {
    const favicon = document.getElementById("favicon");
    if (logo !== null) {
      favicon.href = logo;
    }
    document.title = title;
  };

  // if (
  //   accessToken === false &&
  //   window.location.pathname !== "/app" &&
  //   !window.location.pathname.includes("/app/setPassword")
  // ) {
  //   window.location.pathname = "/app";
  //   history.push("/app");
  // }

  const LoginRoute = () => {
    console.log('login route', Auth())
    // const navigate = useNavigate();
    const fetchData = () => {
      console.log('login route', Auth())
      const initialRoute = localStorage.getItem("initialRoute");
      isHapicareUser = isHapicareUser !== undefined ? isHapicareUser : sessionStorage.getItem('masterEntity') === 'true' ? true : sessionStorage.getItem('masterEntity') === 'false' ? false : undefined;
      organizations = organizations ? organizations : sessionStorage.getItem('organizations') ? JSON.parse(sessionStorage.getItem('organizations')) : []
      if (Auth() && isHapicareUser !== undefined) {
        console.log('login route', isHapicareUser, organizations, jwt(Auth())?.id)
        sessionStorage.setItem('userId', jwt(Auth())?.id)
        if (isHapicareUser && organizations?.length > 1) {
          setShowDialog(true);
        } else if (isHapicareUser) {
          // if (cookie.get("authorization") !== undefined && cookie.get("authorization") !== 'undefined' && !isSessionTokenExpired(cookie.get("authorization"))) {
          cookie.remove('entityId', { path: '/' })
          cookie.set('entityId', organizations?.[0]?.tenant?.tenantId, { path: '/' });
          // }
        }
        console.log('login route', isHapicareUser, organizations)
        const roles = !isHapicareUser ? jwt(Auth())?.roles?.split(",")?.filter(s => s.trim() !== '') : organizations?.[0]?.roles?.map(data => data?.roleName);
        const mdRoles = !isHapicareUser ? jwt(Auth())?.mdRoles?.split(",")?.filter(s => s.trim() !== '') : organizations?.[0]?.mdRoles?.map(data => data?.roleName);
        console.log("LoginRole", roles, mdRoles, isHapicareUser, organizations)
        if (roles?.length > 1 || (roles?.length >= 1 && mdRoles?.length >= 1)) {
          console.log("LoginRole1111", roles)
          console.log('login route', isHapicareUser, organizations)
          // return(
          //   <WorkModeDialog getIsOpen={true} />
          // ) 
          if (roles?.length > 1 && (localStorage?.getItem('initialRoute') !== undefined && localStorage?.getItem('initialRoute') !== 'undefined' && localStorage?.getItem('initialRoute') !== null && localStorage?.getItem('initialRoute')?.includes('/applicationById/REAPPOINTMENT') && localStorage?.getItem('initialRoute')?.includes('/applicationById/LOCUM'))) {
            sessionStorage.setItem("workModeType", roles[0]);
            window.location.pathname = localStorage?.getItem('initialRoute');
          } else {
            setShowDialog(true);
          }
        } else if ((roles?.length === 1 || mdRoles?.length === 1) && localStorage?.getItem('initialRoute') !== undefined && localStorage?.getItem('initialRoute') !== 'undefined' && localStorage?.getItem('initialRoute') !== null) {
          sessionStorage.setItem("workModeType", mdRoles?.length === 1 ? mdRoles[0] : roles[0]);
          window.location.href = `${initialRoute}`;
          console.log("initialRoute", initialRoute)
          localStorage?.removeItem('initialRoute')
        }
        else if (roles?.length === 1 || mdRoles?.length === 1) {
          if (mdRoles?.length === 1) {
            console.log("LoginRole", roles, mdRoles[0])
            sessionStorage.setItem("workModeType", mdRoles[0]);
            window.location.pathname = "/mdManager";
          } else {
            sessionStorage.setItem("workModeType", roles[0]);
            let isAppUser =
              roles?.includes("Approver") ||
              roles?.includes("Reviewer") ||
              roles?.includes("Activity Logger");
            let isContractManager = roles?.includes("Contract Manager");
            let isEntityLevelAdmin =
              roles?.includes("Super Sys Admin") ||
              roles?.includes("Entity Sys Admin") ||
              roles?.includes("Entity Sys User") ||
              roles?.includes("Distributor Admin");
            let isStaffManager = roles?.includes("Staff Manager");
            let isAttester = roles?.includes("Attester");
            let isDepartmentHead = roles?.includes("Department Head");
            let isCredentialingCommittee = roles?.includes("Credentialing Committee");
            let isChiefOfStaff = roles?.includes("Chief Of Staff");
            let isApplicant = roles?.includes("Applicant");
            console.log('login route', roles)
            if (isAppUser) {
              window.location.href = "/";
              // navigate("/");
              return <Login />;
            } else if (isContractManager) {
              window.location.pathname = "/contracts";
              // navigate("/contracts");
              // window.location.reload();
              return <ActiveContracts />;
            }
            else if (isEntityLevelAdmin) {
              window.location.pathname = "/entitySitePortal";
              // navigate("/entitySitePortal");
              // window.location.reload();
              return <Home />;
            }
            else if (isStaffManager) {
              console.log('login route', roles, isStaffManager)
              window.location.pathname = "/applications";
              // navigate("/applications");
            } else if (isDepartmentHead) {
              console.log('login route', roles, isDepartmentHead)
              window.location.pathname = "/applications";
              // navigate("/applications");
            } else if (isCredentialingCommittee) {
              console.log('login route', roles, isCredentialingCommittee)
              window.location.pathname = "/applications";
              // navigate("/applications");
            } else if (isChiefOfStaff) {
              console.log('login route', roles, isChiefOfStaff)
              window.location.pathname = "/applications";
              // navigate("/applications");
            } else if (isAttester) {
              console.log('login route', roles, isAttester)
              window.location.pathname = "/tenant/64246d491b70b07241d37aa1/medicalDirectives";
              // navigate("/applications");
            } else if (isApplicant) {
              window.location.pathname = "/applicant";
              // navigate("/applicant");
            }
            // else {
            //   window.location.pathname = "/entitySitePortal";
            //   // navigate("/entitySitePortal");
            //   // window.location.reload();
            //   return <Home />;
            // }
          }
        }
      } else {
        window.location.pathname = "/loginPage";
      }
    }
    if (!Auth() || isHapicareUser === undefined) {
      setTimeout(() => {
        fetchData();
      }, 2000);
    } else {
      fetchData();
    }
  };

  const ProtectedRoute = ({ children }) => {
    if (!(cookie.get("authorization") !== undefined && cookie.get("authorization") !== 'undefined' && !isSessionTokenExpired(cookie.get("authorization")))) {
      localStorage.setItem('initialRoute', window.location.pathname + (window.location.search ? window.location.search : ''))
    }
    return (cookie.get("authorization") !== undefined && cookie.get("authorization") !== 'undefined' && !isSessionTokenExpired(cookie.get("authorization"))) ? children : <Navigate to="/loginPage" />;
  };

  const IsLoggedIn = ({ children }) => {
    return (isAuthenticated && cookie.get("authorization") !== undefined && cookie.get("authorization") !== 'undefined') ? <Navigate to="/" /> : children;
  };

  if (isSessionLoading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter basename="/">
        <Suspense fallback={<Loader />}>
          {/* {accessToken !== undefined && accessToken !== false && ( */}
          {isAuthenticated && (
            <IdleTimer></IdleTimer>
          )}
          <div className="App">
            {/* {(accessToken !== false && accessToken !== undefined) ? ( */}
            {/* {isAuthenticated ? ( */}
            <>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginRoute />} />
                <Route path="/loginPage" element={<IsLoggedIn><DescopeLoginDialog /></IsLoggedIn>} />
                <Route path="/medicalDirectiveAttest" element={<MedicalDirectivesAttestRFC />} />
                {/* <Route path="/loginPage" element={<DescopeLoginDialog />} /> */}

                {/* Private Routes */}
                <Route path="/contracts" element={<ProtectedRoute><ActiveContracts /></ProtectedRoute>} />
                <Route path="/staffs" element={<ProtectedRoute><StaffManager /></ProtectedRoute>} />
                <Route path="/applications" element={<ProtectedRoute><StaffApplication /></ProtectedRoute>} />
                <Route path="/applicationById/:applicationTypeFromUrl/:applicationId" element={<ProtectedRoute><StaffApplication /></ProtectedRoute>} />
                <Route path="/activeStaff" element={<ProtectedRoute><ActiveStaff /></ProtectedRoute>} />
                <Route path="/locumStaff" element={<ProtectedRoute><LocumStaff /></ProtectedRoute>} />
                {/* <Route
                path="/privilegeListManager"
                element={<PrivilegeListMaster />}
              /> */}
                <Route
                  path="/referenceList/privilegeListMaster"
                  element={<ProtectedRoute><PrivilegeListMaster /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/privilegeListManager"
                  element={<ProtectedRoute><PrivilegeListManager /></ProtectedRoute>}
                />

                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/notifyUser" element={<ProtectedRoute><Notify /></ProtectedRoute>} />
                <Route path="/applicant" element={<ProtectedRoute><Applicant /></ProtectedRoute>} />
                <Route
                  path="/trackContracts/:trackType"
                  element={<ProtectedRoute><TrackYourContracts /></ProtectedRoute>}
                />
                <Route path="/contracts/moveToDraft" element={<ProtectedRoute><MoveToDraft /></ProtectedRoute>} />
                <Route
                  path="/remindContractors"
                  element={<ProtectedRoute><RemindContractors /></ProtectedRoute>}
                />
                <Route path="notifyEntityUser" element={<ProtectedRoute><NotifyEntityUser /></ProtectedRoute>} />
                {/* <Route path="/user" element={<Users />} /> */}
                <Route path="/pages" element={<ProtectedRoute><EntryPage /></ProtectedRoute>} />
                <Route path="/user/ssoId/:userId" element={<ProtectedRoute><GetSSOId /></ProtectedRoute>} />
                <Route path="/setPassword/:randomId" element={<ProtectedRoute><SetPassword /></ProtectedRoute>} />
                <Route
                  path="/activateAccess/:randomId"
                  element={<ProtectedRoute><ActivateAccess /></ProtectedRoute>}
                />
                <Route
                  path="/setPassword"
                  element={<ProtectedRoute><SetPasswordWithoutEmail /></ProtectedRoute>}
                />
                <Route
                  path="/applicationForm/applicationSummary"
                  element={<ProtectedRoute><ApplicationSummary /></ProtectedRoute>}
                />
                <Route path="/historicalData"
                  element={<ProtectedRoute><HistoricalData /></ProtectedRoute>
                  } />
                <Route path="/applicationSubmitted"
                  element={<ProtectedRoute><ApplicationSubmitted /></ProtectedRoute>
                  } />
                <Route
                  path="/applicationForm/applicationAcknowledgement"
                  element={<ProtectedRoute><ApplicationAcknowledgement /></ProtectedRoute>}
                />
                <Route
                  path="/applicationForm/acknowledgementReview"
                  element={<ProtectedRoute><AcknowledgementReview /></ProtectedRoute>}
                />
                <Route path="/applicationForm/podcheck" element={<ProtectedRoute><PODCheck /></ProtectedRoute>} />
                <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
                <Route path="/entitySetup/:id/:page" element={<ProtectedRoute><EntitySetup /></ProtectedRoute>} />
                <Route
                  path="/entitySystemAdmin"
                  element={<ProtectedRoute><EntitySystemAdmin /></ProtectedRoute>}
                />
                <Route path="/siteInformation" element={<ProtectedRoute><SiteInformation /></ProtectedRoute>} />
                <Route path="/siteUsers" element={<ProtectedRoute><SiteUsers /></ProtectedRoute>} />
                <Route path="/appSubscription" element={<ProtectedRoute><AppSubscription /></ProtectedRoute>} />
                <Route path="/setupComplete" element={<ProtectedRoute><SetupComplete /></ProtectedRoute>} />
                <Route path="/otpPage" element={<ProtectedRoute><OTPPage /></ProtectedRoute>} />
                <Route
                  path="/welcomeToDashboard"
                  element={<ProtectedRoute><WelcomeToDashboard /></ProtectedRoute>}
                />
                <Route path="/tasks" element={<ProtectedRoute><ReportsHome /></ProtectedRoute>} />
                <Route
                  path="/reports/:reportType"
                  element={<ProtectedRoute><TimeSheetReportsBase /></ProtectedRoute>}
                />
                <Route path="/chart" element={<ProtectedRoute><ChartPage /></ProtectedRoute>} />
                <Route path="/help" element={<ProtectedRoute><HelpHome /></ProtectedRoute>} />
                <Route path="/partnerPortal" element={<ProtectedRoute><TasksAndAlerts /></ProtectedRoute>} />
                <Route path="/activeCustomers" element={<ProtectedRoute><CustomerManagement /></ProtectedRoute>} />
                <Route path="/customerSetup" element={<ProtectedRoute><CustomerSetup /></ProtectedRoute>} />
                <Route path="/referenceList" element={<ProtectedRoute><ReferenceList /></ProtectedRoute>} />
                <Route path="/applicationSetup" element={<ProtectedRoute><ApplicationSetup /></ProtectedRoute>} />
                <Route
                  path="/Screens/ReferenceList/superAdminDashboard"
                  element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>}
                />
                <Route
                  path="/Screens/ReferenceList/customerAdminDashboard"
                  element={<ProtectedRoute><ClientAdminDashboard /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/industriesWithEntityTypes"
                  element={<ProtectedRoute><IndustriesWithEntityTypes /></ProtectedRoute>}
                />

                <Route
                  path="/referenceList/departmentsByEntityTypes"
                  element={<ProtectedRoute><DepartmentsByEntityTypes /></ProtectedRoute>}
                />
                {/* <Route
                path="/referenceList/acknowledgementForms"
                element={<AcknowledgementForm />}
              /> */}
                <Route
                  path="/referenceList/functionalTitles"
                  element={<ProtectedRoute><FunctionalTitles /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/boardCertification"
                  element={<ProtectedRoute><BoardCertification /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/holidayListByIndustries"
                  element={<ProtectedRoute><HolidayListByIndustries /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/terminationReasons"
                  element={<ProtectedRoute><TerminationReasons /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/absenseReasonsByIndustries"
                  element={<ProtectedRoute><AbsenseReasonsByIndustries /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/suffixByIndustries"
                  element={<ProtectedRoute><SuffixByIndustries /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractByIndustries"
                  element={<ProtectedRoute><ContractByIndustries /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/disclosureByIndustries/disclosureIndustries"
                  element={<ProtectedRoute><DisclosureIndustries /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractedServiceProviderByIndustries"
                  element={<ProtectedRoute><ContractedServiceProvidedByIndustries /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/proofOfDocumentByEntity"
                  element={<ProtectedRoute><ProofOfDocumentationByEntity /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/ProofOfDocumentByApplicantType"
                  element={<ProtectedRoute><ProofOfDocumentByIndustries /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractDoumentTypeForUpload"
                  element={<ProtectedRoute><ContractDocumentTypeForUpload /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/holidayScheduleForCustomers"
                  element={<ProtectedRoute><HolidayScheduleForCustomers /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/countriesSupportedWithStates"
                  element={<ProtectedRoute><CountriesSupportedWithStates /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/countryWithStatesEntity"
                  element={<ProtectedRoute><CountriesWithStatesEntity /></ProtectedRoute>}
                />
                {/* <Route
                path="/referenceList/countryWithStatesEntity"
                element={<CountryWithStatesEntity />}
              /> */}
                <Route
                  path="/referenceList/applicantTypesByEntity/applicantTypesByEntity"
                  element={<ProtectedRoute><ApplicantTypesByEntity /></ProtectedRoute>}
                />
                {/* <Route
                path="/referenceList/departmentsForCustomers"
                element={<DepartmentsForCustomers />}
              /> */}
                <Route
                  path="/referenceList/departmentsForCustomerMultiSite"
                  element={<ProtectedRoute><DepartmentsForCustomersMultiSite /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/absenceReasonsForCustomer"
                  element={<ProtectedRoute><AbsenceReasonsForCustomer /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/suffixByCustomer"
                  element={<ProtectedRoute><SuffixByCustomer /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractDocumentTypeUploadForCustomer"
                  element={<ProtectedRoute><ContractDocumentUploadForCustomer /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractedServicesByEntityType"
                  element={<ProtectedRoute><ContractServicesByEntityType /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractTypeForCustomer"
                  element={<ProtectedRoute><ContractTypeForCustomer /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractServiceProviderBySiteType"
                  element={<ProtectedRoute><ContractServiceProviderBySiteType /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractServiceProviderMultiSite"
                  element={<ProtectedRoute><ContractServiceProviderForMultiSite /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/functionalTitleForCustomer"
                  element={<ProtectedRoute><FunctionalTitleForCustomer /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/functionalTitleMultiSitesForCustomer"
                  element={<ProtectedRoute><FunctionalTitleMultiSitesForCustomer /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/contractTerminationReasonForCustomer"
                  element={<ProtectedRoute><TerminationReasonForCustomer /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/holidayScheduleForCustomers"
                  element={<ProtectedRoute><HolidayScheduleForCustomers /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/organizationCostCenters"
                  element={<ProtectedRoute><CostCenterAndLocations /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/departmentsForCustomers"
                  element={<ProtectedRoute><DepartmentsForCustomers /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/department/department"
                  element={<ProtectedRoute><Departments /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/staffPrivilegesByDepartment"
                  element={<ProtectedRoute><StaffPrivilegesByDepartment /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/applicantCheckList/applicantProcessingCheckList"
                  element={<ProtectedRoute><ApplicantProcessingCheckList /></ProtectedRoute>}
                />

                <Route
                  path="/referenceList/speciality/Speciality"
                  element={<ProtectedRoute><Speciality /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/acknowledgementForms"
                  element={<ProtectedRoute><AcknowledgementForm /></ProtectedRoute>}
                />
                <Route path="/referenceList/consents" element={<ProtectedRoute><Consent /></ProtectedRoute>} />
                <Route
                  path="/referenceList/mileageRateForCustomers"
                  element={<ProtectedRoute><MileageRateForCustomers /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/generalConfigurationForCustomers"
                  element={<ProtectedRoute><GeneralConfigurationForCustomers /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/paymentList"
                  element={<ProtectedRoute><PaymentList /></ProtectedRoute>}
                />
                <Route
                  path="/referenceList/settingList"
                  element={<ProtectedRoute><SettingList /></ProtectedRoute>}
                />
                <Route path="/entitySitePortal" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/mdManager/retired" element={<ProtectedRoute><RetireMDManager /></ProtectedRoute>} />
                <Route path="/mdManager" element={<ProtectedRoute><MDManager /></ProtectedRoute>} />
                <Route path="/mdManager/manageAttestation" element={<ProtectedRoute><ManageAttestation /></ProtectedRoute>} />
                <Route path="/mdManager/manageAcknowledgement" element={<ProtectedRoute><ManageAcknowledgement /></ProtectedRoute>} />
                <Route path="/mdManager/manageSignOff" element={<ProtectedRoute><ManageSignOff /></ProtectedRoute>} />
                <Route path="/mdManager/manageAttestationGroups" element={<ProtectedRoute><ManageAttestationGroups /></ProtectedRoute>} />
                <Route path="/mdManager/libraries/:entityId/:departmentId" element={<MDLibrary />} />
                <Route path="/mdManager/step1" element={<ProtectedRoute><MDManagerStep1 /></ProtectedRoute>} />
                <Route path="/thankyou" element={<ProtectedRoute><Thankyou /></ProtectedRoute>} />
                <Route path="/reportType" element={<ProtectedRoute><ReportType /></ProtectedRoute>} />
                <Route
                  path="/reportTypeOverview/:reportType"
                  element={<ProtectedRoute><ReportTypeOverview /></ProtectedRoute>}
                />
                <Route
                  path="/myReport/:reportType"
                  element={<ProtectedRoute><ReportTypeOverview /></ProtectedRoute>}
                />
                <Route
                  path="/myReport/:reportType/:myReportIdFromUrl"
                  element={<ProtectedRoute><ReportTypeOverview /></ProtectedRoute>}
                />
                <Route
                  path="/applicationForm/:applicationId/:section/:step"
                  element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>}
                />
                <Route
                  path="/reappointmentApplicationForm/:applicationId/:section/:step"
                  element={<ProtectedRoute><ReappointmentApplicationForm /></ProtectedRoute>}
                />
                <Route
                  path="/reappointmentApplicationForm/:applicationId/:section/:step/:medicalDirectivesId"
                  element={<ProtectedRoute><MedicalDirectivesAttest /></ProtectedRoute>}
                />
                <Route
                  path="/medicalDirective/:applicationId/:medicalDirectivesId"
                  element={<ProtectedRoute><MedicalDirectivesAttestDisplay /></ProtectedRoute>}
                />
                <Route
                  path="/tenant/:entityId/medicalDirectives"
                  element={<ProtectedRoute><MDRequestAttest /></ProtectedRoute>}
                />
                <Route
                  path="/medicalDirectiveAttest/:entityId/:medicalDirectivesId"
                  element={<ProtectedRoute><MDAttest /></ProtectedRoute>}
                />
                <Route
                  path="/mdManager/manageAttestation/:entityId/:medicalDirectivesId"
                  element={<ProtectedRoute><ManageMDAttest /></ProtectedRoute>}
                />
                <Route
                  path="/mdManager/manageAcknowledgement/:entityId/:medicalDirectivesId"
                  element={<ProtectedRoute><ManageMDAcknowledgement /></ProtectedRoute>}
                />
                <Route
                  path="/mdManager/manageSignOff/:entityId/:medicalDirectivesId"
                  element={<ProtectedRoute><ManageMDSignOff /></ProtectedRoute>}
                />
                <Route
                  path="/mdManager/manageMECApproval/:entityId/:medicalDirectivesId"
                  element={<ProtectedRoute><MedicalDirectivesMECApproval /></ProtectedRoute>}
                />
                <Route
                  path="/mdManager/mdAttestStatus/:entityId/:medicalDirectivesId"
                  element={<ProtectedRoute><MDAttestStatus /></ProtectedRoute>}
                />
                <Route
                  path="/locumApplicationForm/:applicationId/:section/:step"
                  element={<ProtectedRoute><LocumApplicationForm /></ProtectedRoute>}
                />
                <Route
                  path="/locumApplicationForm/:applicationId/:section/:step/:medicalDirectivesId"
                  element={<ProtectedRoute><LocumMedicalDirectivesAttest /></ProtectedRoute>}
                />
                <Route
                  path="/applicationForm/:applicationId"
                  element={<ProtectedRoute><ApplicationFormRequirement /></ProtectedRoute>}
                />
                <Route
                  path="/reappointmentApplicationForm/:applicationId"
                  element={<ProtectedRoute><ReappointmentApplicationFormRequirement /></ProtectedRoute>}
                />
                <Route
                  path="/locumApplicationForm/:applicationId"
                  element={<ProtectedRoute><LocumApplicationFormRequirement /></ProtectedRoute>}
                />
                <Route
                  path="/applicationRequest"
                  element={<ProtectedRoute><ApplicationRequest /></ProtectedRoute>}
                />
                <Route
                  path="/completeApplicationRequest"
                  element={<ProtectedRoute><CompleteApplicationRequest /></ProtectedRoute>}
                />
                <Route
                  path="/createStaffMemberApplication"
                  element={<ProtectedRoute><CreateStaffMemberApplication /></ProtectedRoute>}
                />
                <Route
                  path="/createStaffReapplication"
                  element={<ProtectedRoute><CreateStaffReapplication /></ProtectedRoute>}
                />
                <Route
                  path="/RFC/:clarificationId"
                  element={<ProtectedRoute><ApplicantPortalRFC /></ProtectedRoute>}
                />
                <Route
                  path="/ApplicantDashboard"
                  element={<ProtectedRoute><ApplicantPortalDashboard /></ProtectedRoute>}
                />
                <Route path="*" element={<DescopeLoginDialog />} {...props} exact={true} />

              </Routes >
            </>
            {/* ) : (
            <Routes>
               <Route path="*" element={<DescopeLoginDialog />} {...props} exact={true} />
             </Routes>
           )} */}
          </div >
        </Suspense >
      </BrowserRouter >
      {showDialog && <WorkModeDialog getIsOpen={true} />}
    </>
  );
};

export default App;
