"use client";
import React, { useState, useEffect, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import { ErrorBoundary } from "react-error-boundary";
import Error404 from './Components/ErrorPage/404';
import { POST, TenantID, GET } from './Screens/dataSaver';
import { currentUser } from './utils/auth';
import { SuccessToaster, ErrorToaster } from './utils/toaster';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
const loggedInUser = currentUser();
// const [users, setUsers] = useState([]);
// const [currentUserData, setCurrentUserData] = useState(users?.filter(data => data?.id === loggedInUser?.id)?.map(data => data)[0]);

// useEffect(() => {
//   setCurrentUserData(users?.filter(data => data?.id === loggedInUser?.id)?.map(data => data)[0])
// }, [users, loggedInUser?.id]);

// useEffect(() => {
//   getUser();
// }, []);

// const getUser = async () => {
//   const { data: user } = await GET('user-management-service/user');
//   setUsers(user);
// };

console.log(loggedInUser)
const logError = async (error, info) => {
  // Do something with the error, e.g. log to an external API
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
      // ...(isEdit &&
      //     { 'id': ticketDetails?.ticketFile?.id }),
      // ...(isEdit &&
      //     { 'filePath': ticketDetails?.ticketFile?.filePath }),
      // ...(isEdit &&
      //     { 'fileURL': ticketDetails?.ticketFile?.fileURL }),
    },
    "dueDate": "2022-10-06",
    "screenCaptured": false,
    "externalBugTrackingSystem": true
  }

  const formData = new FormData();

  formData.append('ticketDetail', new Blob([JSON.stringify(data)], {
    type: "application/json"
  }));
  // if (screenCaptured && !isEdit) {
  //     const file = new File([blobFormat], fileName);
  //     formData.append('ticketFile', file);
  // }
  // await POST(`feedback-management-service/ticket`, formData)
  //   .then(response => {
  //     SuccessToaster('Error Logged Successfully');
  //     // sessionStorage.removeItem('screenCapture');
  //     // sessionStorage.removeItem('fromUpload');
  //     // getShowFeedbackTicketResolution(false);
  //   })
  //   .catch(error => {
  //     ErrorToaster('Unexpected Error Occured');
  //   })
  console.log(error.message, data, info?.componentStack.toString())
};

const rootElement = document.getElementById("root");
if (window.self === window.top) {
  ReactDOM.render(
    <ErrorBoundary FallbackComponent={Error404} onError={logError}>
      <App />
    </ErrorBoundary>
    , rootElement);
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
