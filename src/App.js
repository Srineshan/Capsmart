import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ActiveContracts from "./Screens/ContractManager";
import Welcome from "./Screens/SuperAdminDashboard/welcome";
import Login from "./Screens/SuperAdminDashboard/login";
import SetPassword from "./Screens/SuperAdminDashboard/setPassword";
import SetPasswordWithoutEmail from "./Screens/SuperAdminDashboard/setPasswordWithoutEmail";
import EntitySetup from "./Screens/SuperAdminDashboard/entitySetup";
import EntitySystemAdmin from "./Screens/SuperAdminDashboard/entitySystemAdmin";
import SiteInformation from "./Screens/SuperAdminDashboard/siteInformation";
import SiteUsers from "./Screens/SuperAdminDashboard/siteUsers";
import AppSubscription from "./Screens/SuperAdminDashboard/appSubscription";
import SetupComplete from "./Screens/SuperAdminDashboard/setupComplete";
import OTPPage from "./Screens/SuperAdminDashboard/otpPage";
import WelcomeToDashboard from "./Screens/SuperAdminDashboard/welcomeToDashboard";
import "./App.css";
import history from "./routes/history";
import EntryPage from "./Screens";
import Users from "./Screens/UserManagement";
import ReportsHome from "./Screens/Reports";
import TimeSheetReportsBase from "./Screens/Reports/reports";
import ChartPage from "./Screens/Reports/chart";
import HelpHome from "./Screens/HelpManagement";
import TasksAndAlerts from "./Screens/SuperAdminDashboard/tasksAndAlerts";
import ReferenceList from "./Screens/ReferenceList";
import IndustriesWithEntityTypes from "./Screens/ReferenceList/industriesWithEntityTypes";
import DepartmentsByEntityTypes from "./Screens/ReferenceList/departmentsByEntityTypes";
import FunctionalTitles from "./Screens/ReferenceList/functionalTitles";
import BoardCertification from "./Screens/ReferenceList/boardCertification";
import HolidayListByIndustries from "./Screens/ReferenceList/holidayListByIndustries";
import TerminationReasons from "./Screens/ReferenceList/terminationReasons";
import HolidayScheduleForCustomers from "./Screens/ReferenceList/holidayScheduleForCustomers";
import DepartmentsForCustomers from "./Screens/ReferenceList/departmentsForCustomers";
import CustomerManagement from "./Screens/SuperAdminDashboard/customerManagement";
import Cookie from "universal-cookie";
import CustomerSetup from "./Screens/SuperAdminDashboard/customerSetup";
import AbsenseReasonsByIndustries from "./Screens/ReferenceList/absenseReasonsByIndustries";
import SuffixByIndustries from "./Screens/ReferenceList/suffixByIndustries";
import ContractedServiceProvidedByIndustries from "./Screens/ReferenceList/contractedServiceProvider";
import ProofOfDocumentationByEntity from "./Screens/ReferenceList/proofOfDocumentationByEntity";
import ContractDocumentTypeForUpload from "./Screens/ReferenceList/contractDoumentTypeForUpload";
import DepartmentsForCustomersMultiSite from "./Screens/ReferenceList/departmentsForCustomerMultiSite";
import AbsenceReasonsForCustomer from "./Screens/ReferenceList/absenceReasonsForCustomer";
import SuffixByCustomer from "./Screens/ReferenceList/suffixByCustomer";
import ContractDocumentUploadForCustomer from "./Screens/ReferenceList/contractDocumentTypeUploadForCustomer";
import ContractServiceProviderBySite from "./Screens/ReferenceList/contractServiceProviderBySiteType";
import ContractServiceProviderForMultiSite from "./Screens/ReferenceList/contractServiceProviderMultiSite";
import FunctionalTitleForCustomer from "./Screens/ReferenceList/functionalTitleForCustomer";
import FunctionalTitleMultiSitesForCustomer from "./Screens/ReferenceList/functionalTitleMultiSitesForCustomer";
import TerminationReasonForCustomer from "./Screens/ReferenceList/contractTerminationReasonForCustomer";
import SuperAdminDashboard from "./Screens/ReferenceList/superAdminDashboard";
import ClientAdminDashboard from "./Screens/ReferenceList/customerAdminDashboard";
import Thankyou from "./Screens/SuperAdminDashboard/thankyou";
import { Auth, GetEntityDetails } from "./utils/auth";
import { TenantID, GET } from "./Screens/dataSaver";
import ReportType from "./Screens/Reports/reportType";
import ReportTypeOverview from "./Screens/Reports/reportTypeOverview";
import TenetHealthLogo from "./images/Tenet_Health_logo.png";
import Sanmateo from "./images/sanmateo.jpg";
import Home from "./Screens/CustomerSystemAdmin";
import ReferenceListMainPage from "./Screens/ReferenceList/ReferenceListMainPage";
import { path } from "d3";

const App = ({ props }) => {
  const [accessToken, setAccessToken] = useState(Auth());
  const [tenantId, setTenantId] = useState(GetEntityDetails());
  const [logo, setLogo] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (accessToken === false) {
      let cookie = new Cookie();
      let authValue = cookie.get("user");
      setAccessToken(authValue);
    }
    if (
      accessToken === false &&
      window.location.pathname !== "/app" &&
      !window.location.pathname.includes("/app/setPassword")
    ) {
      window.location.pathname = "/app";
    }
  }, [window.location.pathname]);

  useEffect(() => {
    changeFavicon();
  }, [logo, title]);

  useEffect(() => {
    changeFavicon();
    getLogo();
  }, []);

  const getLogo = async () => {
    const { data: data } = await GET(`entity-service/entity/${TenantID}`);
    setLogo(data?.logoThumbnail?.file?.fileURL);
    setTitle(data?.entityName?.entityName);
    sessionStorage.setItem("entityTypeId", data?.entityType?.id);
    sessionStorage.setItem("entityTypeValue", data?.entityType?.type);
    sessionStorage.setItem("industry", data?.customerType);
    sessionStorage.setItem("logo", data?.logo?.file?.fileURL);
    sessionStorage.setItem("thumbnail", data?.logoThumbnail?.file?.fileURL);
    sessionStorage.setItem("title", data?.entityName?.entityName);
  };

  const changeFavicon = () => {
    const favicon = document.getElementById("favicon");
    favicon.href = logo;
    document.title = title;
  };

  if (
    accessToken === false &&
    window.location.pathname !== "/app" &&
    !window.location.pathname.includes("/app/setPassword")
  ) {
    window.location.pathname = "/app";
    history.push("/app");
  }

  return (
    <BrowserRouter basename="/app">
      <div className="App">
        {accessToken !== false ? (
          <Routes>
            <Route path="/" element={<Login />} {...props} />
            <Route path="/contracts" element={<ActiveContracts />} />
            <Route path="/user" element={<Users />} />
            <Route path="/pages" element={<EntryPage />} />
            <Route path="/setPassword/:userId" element={<SetPassword />} />
            <Route path="/setPassword" element={<SetPasswordWithoutEmail />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/entitySetup/:id" element={<EntitySetup />} />
            <Route path="/entitySystemAdmin" element={<EntitySystemAdmin />} />
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
            <Route path="/tasksAndAlerts" element={<TasksAndAlerts />} />
            <Route path="/activeCustomers" element={<CustomerManagement />} />
            <Route path="/customerSetup" element={<CustomerSetup />} />
            <Route path="/referenceList" element={<ReferenceList />} />
            <Route
              path="/Screens/ReferenceList/superAdminDashboard"
              element={<SuperAdminDashboard />}
            />
            <Route
              path="/Screens/ReferenceList/customerAdminDashboard"
              element={<ClientAdminDashboard />}
            />
            {/* <Route path="/referenceList/industriesWithEntityTypes" element={<IndustriesWithEntityTypes />} /> */}
            {[
              "/referenceList/industriesWithEntityTypes",
              "/referenceList/departmentsByEntityTypes",
              "/referenceList/absenseReasonsByIndustries",
              "/referenceList/suffixByIndustries",
              "/referenceList/contractedServiceProviderByIndustries",
              "/referenceList/functionalTitles",
              "/referenceList/boardCertification",
              "/referenceList/terminationReasons",
              "/referenceList/proofOfDocumentByEntity",
              "/referenceList/holidayListByIndustries",
              "/referenceList/contractDoumentTypeForUpload",
            ].map((path) => (
              <Route
                key={path}
                path={path}
                element={<ReferenceListMainPage />}
              />
            ))}
            {/* <Route path="/referenceList/departmentsByEntityTypes" element={<DepartmentsByEntityTypes />} /> */}
            {/* <Route path="/referenceList/functionalTitles" element={<FunctionalTitles />} /> */}
            {/* <Route path="/referenceList/boardCertification" element={<BoardCertification />} /> */}
            {/* <Route path="/referenceList/holidayListByIndustries" element={<HolidayListByIndustries />} /> */}
            {/* <Route path="/referenceList/terminationReasons" element={<TerminationReasons />} /> */}
            {/* <Route
              path="/referenceList/absenseReasonsByIndustries"
              element={<AbsenseReasonsByIndustries />}
            /> */}
            {/* <Route
              path="/referenceList/suffixByIndustries"
              element={<SuffixByIndustries />}
            /> */}
            {/* <Route
              path="/referenceList/contractedServiceProviderByIndustries"
              element={<ContractedServiceProvidedByIndustries />}
            /> */}
            {/* <Route path="/referenceList/proofOfDocumentByEntity" element={<ProofOfDocumentationByEntity />} /> */}
            {/* <Route path="/referenceList/contractDoumentTypeForUpload" element={<ContractDocumentTypeForUpload />} /> */}
            <Route
              path="/referenceList/holidayScheduleForCustomers"
              element={<HolidayScheduleForCustomers />}
            />
            <Route
              path="/referenceList/departmentsForCustomers"
              element={<DepartmentsForCustomers />}
            />
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
              path="/referenceList/contractServiceProviderBySiteType"
              element={<ContractServiceProviderBySite />}
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
              path="/referenceList/departmentsForCustomers"
              element={<DepartmentsForCustomers />}
            />
            {/* <Route path="/referenceList/absenseReasonsByIndustries" element={<AbsenseReasonsByIndustries />} /> */}
            {/* <Route path="/referenceList/suffixByIndustries" element={<SuffixByIndustries />} /> */}
            {/* <Route path="/referenceList/contractedServiceProviderByIndustries" element={<ContractedServiceProvidedByIndustries />} /> */}
            <Route path="/entitySitePortal" element={<Home />} />
            <Route path="/thankyou" element={<Thankyou />} />
            <Route path="/reportType" element={<ReportType />} />
            <Route
              path="/reportTypeOverview/:reportType"
              element={<ReportTypeOverview />}
            />
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<Login />} {...props} exact={true} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
