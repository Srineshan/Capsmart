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
import CustomerManagement from './Screens/SuperAdminDashboard/customerManagement';
import Cookie from 'universal-cookie';
import CustomerSetup from './Screens/SuperAdminDashboard/customerSetup';
import {Auth} from './utils/auth'

const App = ({props}) => {
  const [accessToken,setAccessToken] = useState(Auth());

  useEffect(()=>{
    if(accessToken === false){
      let cookie = new Cookie();
      let authValue = cookie.get('user');
      setAccessToken(authValue);
    }
    if(accessToken === false && window.location.pathname !== '/'){
      window.location.pathname = '/';
    }
  },[window.location.pathname])
  if(accessToken === false && window.location.pathname !=='/'){
    window.location.pathname = '/';
    history.push('/');
  }


  return (
    <Router>
      <div className="App">
        {
          accessToken !== false ?
        (
          <Routes>
          <Route  path="/" element={<Login />} {...props}/>
          <Route  path="/contracts" element={<ActiveContracts />}/>
          <Route  path="/user" element={<Users />}/>
          <Route  path="/pages" element={<EntryPage />}/>
          <Route  path="/setPassword" element={<SetPassword />}/>
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
          <Route path="/customerSetup" element={<CustomerSetup />} />
          <Route path="/referenceList" element={<ReferenceList />} />
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
