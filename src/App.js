import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import ActiveContracts from './Screens/ContractManager';
import Welcome from './Screens/SuperAdminDashboard/welcome';
import Login from './Screens/SuperAdminDashboard/login';
import SetPassword from './Screens/SuperAdminDashboard/setPassword';
import EntitySetup from './Screens/SuperAdminDashboard/entitySetup';
import EntitySystemAdmin from './Screens/SuperAdminDashboard/entitySystemAdmin';
import SiteInformation from './Screens/SuperAdminDashboard/siteInformation';
import SiteUsers from './Screens/SuperAdminDashboard/siteUsers';
import AppSubscription from './Screens/SuperAdminDashboard/appSubscription';
import SetupComplete from './Screens/SuperAdminDashboard/setupComplete';
import OTPPage from './Screens/SuperAdminDashboard/otpPage';
import WelcomeToDashboard from './Screens/SuperAdminDashboard/welcomeToDashboard';
import './App.css'
import history from './routes/history';
import EntryPage from './Screens';
import Users from './Screens/UserManagement';
import ReportsHome from './Screens/Reports';
import TimeSheetReportsBase from './Screens/Reports/reports';
import ChartPage from './Screens/Reports/chart';
import HelpHome from './Screens/HelpManagement';
import TasksAndAlerts from './Screens/SuperAdminDashboard/tasksAndAlerts';
import ReferenceList from './Screens/ReferenceList';
import IndustriesWithEntityTypes from './Screens/ReferenceList/industriesWithEntityTypes';
import DepartmentsByEntityTypes from './Screens/ReferenceList/departmentsByEntityTypes';
import FunctionalTitles from './Screens/ReferenceList/functionalTitles';
import BoardCertification from './Screens/ReferenceList/boardCertification';
import HolidayListByIndustries from './Screens/ReferenceList/holidayListByIndustries';
import TerminationReasons from './Screens/ReferenceList/terminationReasons';
import HolidayScheduleForCustomers from './Screens/ReferenceList/holidayScheduleForCustomers';
import DepartmentsForCustomers from './Screens/ReferenceList/departmentsForCustomers';
import CustomerManagement from './Screens/SuperAdminDashboard/customerManagement';
import Cookie from 'universal-cookie';
import CustomerSetup from './Screens/SuperAdminDashboard/customerSetup';
import AbsenseReasonsByIndustries from './Screens/ReferenceList/absenseReasonsByIndustries';
import SuffixByIndustries from './Screens/ReferenceList/suffixByIndustries';
import ContractedServiceProvidedByIndustries from './Screens/ReferenceList/contractedServiceProvider';
import {Auth} from './utils/auth'
import Thankyou from './Screens/SuperAdminDashboard/thankyou';

const App = ({props}) => {
  const [accessToken,setAccessToken] = useState(Auth());

  useEffect(()=>{
    if(accessToken === false){
      let cookie = new Cookie();
      let authValue = cookie.get('user');
      setAccessToken(authValue);
    }
    if(accessToken === false && (window.location.pathname !== '/app' && !window.location.pathname.includes('/setPassword'))){
      window.location.pathname = '/app';
    }
  },[window.location.pathname])
  if(accessToken === false && (window.location.pathname !=='/app' && !window.location.pathname.includes('/setPassword'))){
    window.location.pathname = '/app';
    history.push('/app');
  }

  return (
    <Router basename="/app">
      <div className="App">
        {
          accessToken !== false ?
        (
          <Routes>
          <Route  path="/" element={<Login />} {...props}/>
          <Route  path="/contracts" element={<ActiveContracts />}/>
          <Route  path="/user" element={<Users />}/>
          <Route  path="/pages" element={<EntryPage />}/>
          <Route  path="/setPassword/:userId" element={<SetPassword />}/>
          <Route  path="/welcome" element={<Welcome />}/>
          <Route  path="/entitySetup/:id" element={<EntitySetup />}/>
          <Route  path="/entitySystemAdmin" element={<EntitySystemAdmin />}/>
          <Route  path="/siteInformation" element={<SiteInformation />}/>
          <Route  path="/siteUsers" element={<SiteUsers />}/>
          <Route  path="/appSubscription" element={<AppSubscription />}/>
          <Route  path="/setupComplete" element={<SetupComplete />}/>
          <Route  path="/otpPage" element={<OTPPage />}/>
          <Route  path="/welcomeToDashboard" element={<WelcomeToDashboard />}/>
          <Route  path="/tasks" element={<ReportsHome />}/>
          <Route  path="/reports" element={<TimeSheetReportsBase />}/>
          <Route  path="/chart" element={<ChartPage />}/>
          <Route  path="/help" element={<HelpHome />}/>
          <Route  path="/tasksAndAlerts" element={<TasksAndAlerts />}/>
          <Route  path="/activeCustomers" element={<CustomerManagement />}/>
          <Route  path="/customerSetup" element={<CustomerSetup />} />
          <Route  path="/referenceList" element={<ReferenceList />} />
          <Route  path="/referenceList/industriesWithEntityTypes" element={<IndustriesWithEntityTypes />} />
          <Route  path="/referenceList/departmentsByEntityTypes" element={<DepartmentsByEntityTypes />} />
          <Route  path="/referenceList/functionalTitles" element={<FunctionalTitles />} />
          <Route  path="/referenceList/boardCertification" element={<BoardCertification />} />
          <Route  path="/referenceList/holidayListByIndustries" element={<HolidayListByIndustries />} />
          <Route  path="/referenceList/terminationReasons" element={<TerminationReasons />} />
          <Route  path="/referenceList/holidayScheduleForCustomers" element={<HolidayScheduleForCustomers />} />
          <Route  path="/referenceList/departmentsForCustomers" element={<DepartmentsForCustomers />} />
          <Route  path="/referenceList/absenseReasonsByIndustries" element={<AbsenseReasonsByIndustries />} />
          <Route  path="/referenceList/suffixByIndustries" element={<SuffixByIndustries />} />
          <Route  path="/referenceList/contractedServiceProviderByIndustries" element={<ContractedServiceProvidedByIndustries />} />
          <Route  path="/thankyou" element={<Thankyou />} />
          </Routes>
        ):(
          <Routes>
          <Route  path="*" element={<Login />} {...props} exact={true}/>
          </Routes>
        )
      }
      </div>
    </Router>
  );
}

export default App;
