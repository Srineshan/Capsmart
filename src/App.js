import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import history from "./routes/history";
import Loader from "./Components/LoadingScreen";
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
import MileageRateForCustomers from "./Screens/ReferenceList/mileageRateForCustomers";
import GeneralConfigurationForCustomers from "./Screens/ReferenceList/generalConfigurationForCustomers";
import LoginDialog from "./Components/LoginDialog";
import Departments from "./Screens/ReferenceList/department/Department";
import ApplicantTypesByEntity from "./Screens/ReferenceList/applicantTypeByEntity/applicantTypesByEntity";
import Speciality from "./Screens/ReferenceList/speciality/Speciality";



const ReportType = React.lazy(() => import("./Screens/Reports/reportType"));
const ReportTypeOverview = React.lazy(() =>
  import("./Screens/Reports/reportTypeOverview")
);
const Home = React.lazy(() => import("./Screens/CustomerSystemAdmin"));

const FunctionalTitleForCustomer = React.lazy(() =>
  import("./Screens/ReferenceList/functionalTitleForCustomer")
);
const ActiveContracts = React.lazy(() => import("./Screens/ContractManager"));
const StaffManager = React.lazy(() => import("./Screens/StaffManager"));
const Applicant = React.lazy(() => import("./Screens/Applicant"));
const StaffApplication = React.lazy(() => import("./Screens/StaffApplication"));
const ActiveStaff = React.lazy(() => import("./Screens/ActiveStaff"));
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
  import("./Screens/ApplicationForm/ApplicationSummary"));
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
const ApplicationFormRequirement = React.lazy(() =>
  import("./Screens/ApplicationForm/ApplicationFormRequirement")
);
const ReappointmentApplicationFormRequirement = React.lazy(() =>
  import("./Screens/ReappointmentApplicationForm/ReappointmentApplicationFormRequirement")
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

const ApplicationSetup = React.lazy(() =>
  import("./Screens/ApplicationSetup/ApplicationConfiguration")
);
const App = ({ props }) => {
  const [accessToken, setAccessToken] = useState(Auth());
  const [tenantId, setTenantId] = useState(GetEntityDetails());
  const [logo, setLogo] = useState(null);
  const [title, setTitle] = useState("CAPSmart");
  const [entityId, setEntityId] = useState("");
  const [currentUserDetails, setCurrentUserDetails] = useState();
  const [entityDetails, setEntityDetails] = useState();
  var cookie = new Cookie();
  const loggedInUser = currentUser();

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (cookie.get('entityId') === undefined || cookie.get('entityId') === null) {
  //     getEntityId();
  //   }
  // }, [])

  // useEffect(() => {
  //   if(!cookie.get("user")){
  //     login();
  //   }
  // }, [entityId])

  useEffect(() => {
    const reloadCount = sessionStorage.getItem("reloadCount");
    if (reloadCount < 1) {
      sessionStorage.setItem("reloadCount", String(reloadCount + 1));
      window.location.reload();
    } else {
      sessionStorage.removeItem("reloadCount");
    }
  }, []);

  useEffect(() => {
    setUserDetails();
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
      // logError(error);
      console.log("response error", error);
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
    if (
      interceptorsInfo !==
      `${error?.response?.data?.error} ${error?.response?.data?.path}`
    ) {
      await POST(`feedback-management-service/ticket`, formData)
        .then((response) => {
          sessionStorage.setItem(
            "interceptorsInfo",
            `${error?.response?.data?.error} ${error?.response?.data?.path}`
          );
          // SuccessToaster('Error Logged Successfully');
        })
        .catch((error) => {
          // ErrorToaster('Unexpected Error Occured');
        });
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
    let requestHeader = hostname.includes('acme-hospital') ? {
      method: "GET",
      headers: { "X-subdomain": "acme-hospital" },
    } : { method: 'GET' }
    await axios(
      `${baseUrl()}/entity-service/entityID`,
      requestHeader
    )
      .then((response) => {
        cookie.set("entityId", response?.data?.id, { path: '/' });
        setEntityId(response?.data?.id);
        if (cookie.get('user') === undefined || cookie.get('user') === null) {
          login(response?.data?.id);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const login = (id) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-tenantID": id,
      },
    };
    fetch(
      `${baseUrl()}/user-management-service/auth/login`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        cookie.set("user", data?.accessToken, { path: '/' });
      });
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
    changeFavicon();
  }, [logo, title]);

  useEffect(() => {
    changeFavicon();
    getLogo();
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
    favicon.href = logo;
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
    let roles = jwt(Auth())?.roles?.split(",");
    let isAppUser =
      roles.includes("Approver") ||
      roles.includes("Reviewer") ||
      roles.includes("Activity Logger");
    let isContractManager = roles.includes("Contract Manager");
    let isEntityLevelAdmin =
      roles.includes("Super Sys Admin") ||
      roles.includes("Entity Sys Admin") ||
      roles.includes("Entity Sys User") ||
      roles.includes("Distributor Admin");
    let isStaffManager = roles.includes("Staff Manager");
    let isApplicant = roles.includes("Applicant");

    if (isAppUser) {
      window.location.href = "/";
      return <Login />;
    } else if (isContractManager) {

      window.location.pathname = "/app/contracts";
      // navigate("/contracts");
      // window.location.reload();
      return <ActiveContracts />;
    } else if (isEntityLevelAdmin) {
      window.location.pathname = "/app/entitySitePortal";
      // navigate("/entitySitePortal");
      // window.location.reload();
      return <Home />;
    } else if (isStaffManager) {
      window.location.pathname = "/app/staffs"
    } else if (isApplicant) {
      window.location.pathname = "/app/applicant"
    } else {
      window.location.pathname = "/app/entitySitePortal";
      // navigate("/entitySitePortal");
      // window.location.reload();
      return <Home />;
    }
  };

  return (
    <BrowserRouter basename="/app">
      <Suspense fallback={<Loader />}>
        {accessToken !== undefined && accessToken !== false && (
          <IdleTimer></IdleTimer>
        )}
        <div className="App">
          {/* {(accessToken !== false && accessToken !== undefined) ? ( */}
          <>
            <Routes>
              <Route path="/" element={<LoginRoute />} />
              <Route path="/contracts" element={<ActiveContracts />} />
              <Route path="/staffs" element={<StaffManager />} />
              <Route path="/applications" element={<StaffApplication />} />
              <Route path="/activeStaff" element={<ActiveStaff />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifyUser" element={<Notify />} />
              <Route path="/applicant" element={<Applicant />} />
              <Route
                path="/trackContracts/:trackType"
                element={<TrackYourContracts />}
              />
              <Route path="/contracts/moveToDraft" element={<MoveToDraft />} />
              <Route
                path="/remindContractors"
                element={<RemindContractors />}
              />
              <Route path="notifyEntityUser" element={<NotifyEntityUser />} />
              {/* <Route path="/user" element={<Users />} /> */}
              <Route path="/pages" element={<EntryPage />} />
              <Route path="/user/ssoId/:userId" element={<GetSSOId />} />
              <Route path="/setPassword/:randomId" element={<SetPassword />} />
              <Route
                path="/activateAccess/:randomId"
                element={<ActivateAccess />}
              />
              <Route
                path="/setPassword"
                element={<SetPasswordWithoutEmail />}
              />
              <Route
                path="/applicationForm/applicationSummary"
                element={<ApplicationSummary />}
              />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/entitySetup/:id/:page" element={<EntitySetup />} />
              <Route
                path="/entitySystemAdmin"
                element={<EntitySystemAdmin />}
              />
              <Route path="/siteInformation" element={<SiteInformation />} />
              <Route path="/siteUsers" element={<SiteUsers />} />
              <Route path="/appSubscription" element={<AppSubscription />} />
              <Route path="/setupComplete" element={<SetupComplete />} />
              <Route path="/otpPage" element={<OTPPage />} />
              <Route
                path="/welcomeToDashboard"
                element={<WelcomeToDashboard />}
              />
              <Route path="/tasks" element={<ReportsHome />} />
              <Route
                path="/reports/:reportType"
                element={<TimeSheetReportsBase />}
              />
              <Route path="/chart" element={<ChartPage />} />
              <Route path="/help" element={<HelpHome />} />
              <Route path="/partnerPortal" element={<TasksAndAlerts />} />
              <Route path="/activeCustomers" element={<CustomerManagement />} />
              <Route path="/customerSetup" element={<CustomerSetup />} />
              <Route path="/referenceList" element={<ReferenceList />} />
              <Route path="/applicationSetup" element={<ApplicationSetup />} />
              <Route
                path="/Screens/ReferenceList/superAdminDashboard"
                element={<SuperAdminDashboard />}
              />
              <Route
                path="/Screens/ReferenceList/customerAdminDashboard"
                element={<ClientAdminDashboard />}
              />
              <Route
                path="/referenceList/industriesWithEntityTypes"
                element={<IndustriesWithEntityTypes />}
              />
              <Route
                path="/referenceList/departmentsByEntityTypes"
                element={<DepartmentsByEntityTypes />}
              />
              {/* <Route
                path="/referenceList/acknowledgementForms"
                element={<AcknowledgementForm />}
              /> */}
              <Route
                path="/referenceList/functionalTitles"
                element={<FunctionalTitles />}
              />
              <Route
                path="/referenceList/boardCertification"
                element={<BoardCertification />}
              />
              <Route
                path="/referenceList/holidayListByIndustries"
                element={<HolidayListByIndustries />}
              />
              <Route
                path="/referenceList/terminationReasons"
                element={<TerminationReasons />}
              />
              <Route
                path="/referenceList/absenseReasonsByIndustries"
                element={<AbsenseReasonsByIndustries />}
              />
              <Route
                path="/referenceList/suffixByIndustries"
                element={<SuffixByIndustries />}
              />
              <Route
                path="/referenceList/contractByIndustries"
                element={<ContractByIndustries />}
              />
              <Route
                path="/referenceList/disclosureByIndustries/disclosureIndustries"
                element={<DisclosureIndustries />}
              />

              <Route
                path="/referenceList/contractedServiceProviderByIndustries"
                element={<ContractedServiceProvidedByIndustries />}
              />
              <Route
                path="/referenceList/proofOfDocumentByEntity"
                element={<ProofOfDocumentationByEntity />}
              />
              <Route
                path="/referenceList/ProofOfDocumentByApplicantType"
                element={<ProofOfDocumentByIndustries />}
              />
              <Route
                path="/referenceList/contractDoumentTypeForUpload"
                element={<ContractDocumentTypeForUpload />}
              />
              <Route
                path="/referenceList/holidayScheduleForCustomers"
                element={<HolidayScheduleForCustomers />}
              />
              <Route
                path="/referenceList/countriesSupportedWithStates"
                element={<CountriesSupportedWithStates />}
              />
              <Route
                path="/referenceList/countryWithStatesEntity"
                element={<CountriesWithStatesEntity />}
              />
              {/* <Route
                path="/referenceList/countryWithStatesEntity"
                element={<CountryWithStatesEntity />}
              /> */}
              <Route
                path="/referenceList/applicantTypesByEntity/applicantTypesByEntity"
                element={<ApplicantTypesByEntity />}
              />
              {/* <Route
                path="/referenceList/departmentsForCustomers"
                element={<DepartmentsForCustomers />}
              /> */}

              <Route
                path="/referenceList/departmentsForCustomerMultiSite"
                element={<DepartmentsForCustomersMultiSite />}
              />
              <Route
                path="/referenceList/absenceReasonsForCustomer"
                element={<AbsenceReasonsForCustomer />}
              />
              <Route
                path="/referenceList/suffixByCustomer"
                element={<SuffixByCustomer />}
              />
              <Route
                path="/referenceList/contractDocumentTypeUploadForCustomer"
                element={<ContractDocumentUploadForCustomer />}
              />
              <Route
                path="/referenceList/contractedServicesByEntityType"
                element={<ContractServicesByEntityType />}
              />
              <Route
                path="/referenceList/contractTypeForCustomer"
                element={<ContractTypeForCustomer />}
              />
              <Route
                path="/referenceList/contractServiceProviderBySiteType"
                element={<ContractServiceProviderBySiteType />}
              />
              <Route
                path="/referenceList/contractServiceProviderMultiSite"
                element={<ContractServiceProviderForMultiSite />}
              />
              <Route
                path="/referenceList/functionalTitleForCustomer"
                element={<FunctionalTitleForCustomer />}
              />
              <Route
                path="/referenceList/functionalTitleMultiSitesForCustomer"
                element={<FunctionalTitleMultiSitesForCustomer />}
              />
              <Route
                path="/referenceList/contractTerminationReasonForCustomer"
                element={<TerminationReasonForCustomer />}
              />
              <Route
                path="/referenceList/holidayScheduleForCustomers"
                element={<HolidayScheduleForCustomers />}
              />
              <Route
                path="/referenceList/organizationCostCenters"
                element={<CostCenterAndLocations />}
              />
              <Route
                path="/referenceList/departmentsForCustomers"
                element={<DepartmentsForCustomers />}
              />
              <Route
                path="/referenceList/department/department"
                element={<Departments />}
              />

              <Route
                path="/referenceList/staffPrivilegesByDepartment"
                element={<StaffPrivilegesByDepartment />}
              />
              <Route
                path="/referenceList/speciality/Speciality"
                element={<Speciality />}
              />
              <Route
                path="/referenceList/acknowledgementForms"
                element={<AcknowledgementForm />}
              />
              <Route path="/referenceList/consents" element={<Consent />} />
              <Route
                path="/referenceList/mileageRateForCustomers"
                element={<MileageRateForCustomers />}
              />
              <Route
                path="/referenceList/generalConfigurationForCustomers"
                element={<GeneralConfigurationForCustomers />}
              />
              <Route path="/entitySitePortal" element={<Home />} />
              <Route path="/thankyou" element={<Thankyou />} />
              <Route path="/reportType" element={<ReportType />} />
              <Route
                path="/reportTypeOverview/:reportType"
                element={<ReportTypeOverview />}
              />
              <Route
                path="/myReport/:reportType"
                element={<ReportTypeOverview />}
              />
              <Route
                path="/applicationForm/:section/:step"
                element={<ApplicationForm />}
              />
              <Route
                path="/reappointmentApplicationForm/:applicationId/:section/:step"
                element={<ReappointmentApplicationForm />}
              />
              <Route
                path="/applicationForm/:applicationId"
                element={<ApplicationFormRequirement />}
              />
              <Route
                path="/reappointmentApplicationForm/:applicationId"
                element={<ReappointmentApplicationFormRequirement />}
              />
              <Route
                path="/applicationRequest"
                element={<ApplicationRequest />}
              />
              <Route
                path="/completeApplicationRequest"
                element={<CompleteApplicationRequest />}
              />
              <Route
                path="/createStaffMemberApplication"
                element={<CreateStaffMemberApplication />}
              />
              <Route path="/loginPage" element={<LoginDialog />} />
            </Routes>
          </>
          {/* ) : (
            <Routes>
              <Route path="*" element={<Login />} {...props} exact={true} />
            </Routes>
          )} */}
        </div>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
