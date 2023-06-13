"use client";

import { StrictMode } from 'react';
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

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const logError = (error, info) => {
  // Do something with the error, e.g. log to an external API
  console.log(error)
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
