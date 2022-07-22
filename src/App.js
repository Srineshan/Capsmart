import React from 'react';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import ActiveContracts from './Screens/ContractManager';
import Welcome from './Screens/SuperAdminDashboard/welcome';
import Login from './Screens/SuperAdminDashboard/login';
import ForgotPassword from './Screens/SuperAdminDashboard/forgotPassword';
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
import Contracts from './Screens/UserManagement';
import ReportsHome from './Screens/Reports';
import TimeSheetReportsBase from './Screens/Reports/reports';
import ChartPage from './Screens/Reports/chart';
import HelpHome from './Screens/HelpManagement';
import TasksAndAlerts from './Screens/SuperAdminDashboard/tasksAndAlerts';

const App = ({props}) => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route  path="/" element={<Login />} {...props}/>
          <Route  path="/contracts" element={<ActiveContracts />}/>
          <Route  path="/user" element={<Contracts />}/>
          <Route  path="/pages" element={<EntryPage />}/>
          <Route  path="/forgotPassword" element={<ForgotPassword />}/>
          <Route  path="/welcome" element={<Welcome />}/>
          <Route  path="/entitySetup" element={<EntitySetup />}/>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
