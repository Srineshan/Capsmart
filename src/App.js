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
import EntryPage from './Screens';
import Contracts from './Screens/UserManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route  path="/" element={<EntryPage />}/>
          <Route  path="/activeContracts" element={<ActiveContracts />}/>
          <Route  path="/contracts" element={<Contracts />}/>
          <Route  path="/login" element={<Login />}/>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
