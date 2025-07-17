"use client";
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { ErrorBoundary } from "react-error-boundary";
import { createRoot } from 'react-dom/client';
import { browserName, browserVersion, osName, osVersion, isMobile, isDesktop, isTablet } from "react-device-detect";
import { AuthProvider } from '@descope/react-sdk';
import UnexpectedError from './Components/ErrorPage/unexpectedError';
import { TenantID, POST } from './Screens/dataSaver';
import { currentUser } from './utils/auth';
import { SuccessToaster, ErrorToaster } from './utils/toaster';
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
const loggedInUser = currentUser();

console.log(loggedInUser, browserName, browserVersion, osName, osVersion, isMobile, isDesktop, isTablet)
const logError = async (error, info) => {
  let browser = browserName === 'Chrome' ? 'CHROME' :
    browserName === 'Firefox' ? 'FIREFOX' :
      browserName === 'Safari' ? 'SAFARI' :
        browserName === 'Opera' ? 'OPERA' :
          browserName === 'Edge' ? 'EDGE' :
            browserName === 'Internet Explorer' ? 'INTERNETEXPLORER' :
              browserName === 'Chromium' ? 'CHROMIUM' :
                browserName === 'Yandex' ? 'YANDEX' :
                  browserName === 'IE' ? 'IE' :
                    browserName === 'Mobile Safari' ? 'MOBILESAFARI' :
                      browserName === 'Edge Chromium' ? 'EDGECHROMIUM' :
                        browserName === 'MIUI Browser' ? 'MIUIBROWSER' :
                          browserName === 'Samsung Browser' ? 'SAMSUNGBROWSER' : '';

  let os = osName === 'Windows' ? 'WINDOWS' :
    osName === 'Linux' ? 'LINUX' :
      osName === 'Mac OS' ? 'MAC' :
        osName === 'iOS' ? 'IOS' :
          osName === 'Android' ? 'ANDROID' :
            osName === 'Windows Phone' ? 'WINDOWSPHONE' : '';

  let deviceType = isDesktop ? 'DESKTOP' : isMobile ? 'MOBILE' : isTablet ? 'TABLET' : '';
  let errorInfo = sessionStorage.getItem('errorInfo');

  let data = {
    "subject": 'Auto Ticket',
    "description": error.message,
    "createdBy": {
      "id": loggedInUser?.id,
      "name": {
        firstName: loggedInUser?.firstName,
        lastName: loggedInUser?.lastName,
        middleName: '',
        suffix: {
          id: '',
          suffix: '',
        }
      },
      "email": { officialEmail: loggedInUser?.email },
      "communication": {
        personalEmail: loggedInUser?.email,
        mobileNumber: '',
        landlineNumber: '',
        mobileNumberNotApplicable: false
      }
    },
    "assignedTo": {
      "id": '',
      "name": {
        firstName: '',
        lastName: '',
        middleName: '',
        suffix: {
          id: '',
          suffix: '',
        }
      },
      "email": { officialEmail: '' },
      "communication": {
        personalEmail: '',
        mobileNumber: '',
        landlineNumber: '',
        mobileNumberNotApplicable: false
      }
    },
    "type": 'APPLICATION',
    "impact": 'HIGH',
    "status": 'NEW',
    "generationMode": "SYSTEM",
    "bugTrackingId": "string",
    "site": {
      "id": "string",
      "siteName": {
        "siteName": "string"
      }
    },
    "tenant": {
      "tenantId": TenantID
    },
    "ticketFile": {
      "fileName": '',
    },
    "deviceDetails": {
      "browser": browser,
      "browserVersion": browserVersion,
      "os": os,
      "osVersion": osVersion,
      "componentInfo": info?.componentStack.toString(),
      "deviceType": deviceType,
      "screenResolution": `width: ${window.innerWidth}, height: ${window.innerHeight}`,
    },
    "dueDate": "2022-10-06",
    "screenCaptured": false,
    "externalBugTrackingSystem": true
  }

  const formData = new FormData();

  formData.append('ticketDetail', new Blob([JSON.stringify(data)], {
    type: "application/json"
  }));
  sessionStorage.setItem('errorInfo', error.message)
  // if (errorInfo !== error.message) {
  //   await POST(`feedback-management-service/ticket`, formData)
  //     .then(response => {
  //       sessionStorage.setItem('errorInfo', error.message);
  //       SuccessToaster('Error Logged Successfully');
  //     })
  //     .catch(error => {
  //       ErrorToaster('Unexpected Error Occured');
  //     })
  // }
  console.log(error.message, data, info?.componentStack.toString())
};

// const rootElement = document.getElementById("root");
const root = createRoot(document.getElementById('root'));
if (window.self === window.top) {
  root.render(
    <AuthProvider projectId={'P2fnkZZjj6Q0BlMlbeONkXVIukl3'}
    // persistJwt="cookie"
    // cookieDomain={window.location.hostname?.split('.')?.length >= 3 ? window.location.hostname?.slice(-2)?.join('.') : window.location.hostname} // Set the domain to parent domain
    // cookieSecure={false}
    // cookieSameSite="None"
    >
      <ErrorBoundary FallbackComponent={UnexpectedError} onError={logError}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </AuthProvider >
  );
}
// ReactDOM.render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
//   rootElement
// );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
