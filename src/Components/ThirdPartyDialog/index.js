import React, { useRef, useState } from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import Cards from 'react-credit-cards-2';
import axios from "axios";
import html2pdf from "html2pdf.js";
import style from "./index.module.scss";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { TextField } from "@mui/material";
import { dataLoadingGIF, formatCreditCardNumber, formatCVC, formatExpirationDate } from "../../utils/formatting";
import { PUT, POST } from "../../Screens/dataSaver";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import CAPManager from './../../images/capSmartTransparent.png';
import CambridgeHospital from './../../images/cambridgeHospital.png';
import PoweredHapiCare from './../../images/PoweredHapiCare.png';

const ThirdPartyDialog = ({ getIsOpen, continueClick, paymentListData, applicantName, basicForm }) => {
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  const { applicationId, section, step } = useParams()
  const merchantId = process.env.REACT_APP_MERCHANT_ID;
  const apiPasscode = process.env.REACT_APP_PASSCODE;
  const base64ApiKey = btoa(`${merchantId}:${apiPasscode}`);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const targetRef = useRef();
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "number") {
      formattedValue = formatCreditCardNumber(value);
    } else if (name === "expiry") {
      formattedValue = formatExpirationDate(value);
    } else if (name === "cvc") {
      formattedValue = formatCVC(value);
    }

    setState((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  }

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  }

  const submitPayment = async () => {
    setIsLoading(true);
    setPaymentStatus('');
    if (state.number.trim() === "") {
      setIsLoading(false);
      setPaymentStatus('Please Enter the Card Number');
      return;
    } else if (state.name.trim() === "") {
      setIsLoading(false);
      setPaymentStatus('Please Enter the Name on Card');
      return;
    } else if (state.expiry.trim() === "") {
      setIsLoading(false);
      setPaymentStatus('Please Enter the Valid Thru');
      return;
    } else if (state.cvc.trim() === "") {
      setIsLoading(false);
      setPaymentStatus('Please Enter the CVC');
      return;
    }
    const API_URL = "https://api.na.bambora.com/v1/payments";
    const API_KEY = base64ApiKey; // Replace with your Base64-encoded API key

    const paymentData = {
      amount: paymentListData?.fee?.toFixed(2), // Replace with the amount you want to charge
      payment_method: "card",
      card: {
        name: state.name,
        number: state.number,
        expiry_month: state?.expiry?.split('/')?.[0],
        expiry_year: state?.expiry?.split('/')?.[1],
        cvd: state.cvc,
      },
    };

    try {
      const response = await axios.post(API_URL, paymentData, {
        headers: {
          Authorization: `Passcode ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      getPaymentTransaction(response.data.id);
      setPaymentStatus(
        `Payment Successful! Transaction ID: ${response.data.id}`
      );
    } catch (error) {
      setPaymentStatus(
        `Payment Failed! Please Check the Card Details and try again.`
      );
      setIsLoading(false);
    }
  };

  const savePaymentInfo = async (data) => {
    let temp = {
      "payee": {
        "name": {
          "firstName": data?.card?.name,
          "lastName": "string",
          "middleName": "string"
        },
        "email": {
          "officialEmail": data?.shipping?.email_address
        },
        "mobileNumber": data?.shipping?.phone_number,
        "address": {
          "streetName": data?.shipping?.address_line1,
          "city": data?.shipping?.city,
          "province": data?.shipping?.province,
          "pinCode": data?.shipping?.postal_code
        }
      },
      "fee": data?.amount,
      "tax": 0,
      "total": data?.amount,
      "currency": paymentListData?.currencyType,
      "quantity": 1,
      "product": "Reappointment Application Fee",
      // "paidDateTime": format(new Date(data?.created), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      "paidDateTime": new Date().toISOString(),
      "paymentMethod": data?.payment_method,
      "cardNumber": data?.card?.last_four,
      "receiptId": data?.order_number,
      "paymentApplicable": true,
      "paymentCompleted": true
    };
    try {
      await PUT(`application-management-service/application/${applicationId}/payment`, temp);
      handleDownload(data)
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const getPaymentTransaction = async (id) => {
    const API_URL = `https://api.na.bambora.com/v1/payments/${id}`;
    const API_KEY = base64ApiKey; // Replace with your Base64-encoded API key

    const paymentData = {
      amount: 100.0, // Replace with the amount you want to charge
      payment_method: "card",
      card: {
        name: state.name,
        number: state.number,
        expiry_month: state?.expiry?.split('/')?.[0],
        expiry_year: state?.expiry?.split('/')?.[1],
        cvd: state.cvd,
      },
    };

    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Passcode ${API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      setShowReceipt(true);
      setPaymentStatus(
        `Payment Successful! Transaction ID: ${response.data.id}`
      );
      setPaymentInfo(response.data)
      savePaymentInfo(response.data)
    } catch (error) {
      setPaymentStatus(
        `Payment Failed! Error: ${error.response?.data?.message || error.message
        }`
      );
      setIsLoading(false);
    }

  };

  const addNewDocument = async (file, data) => {
    console.log('payment')
    console.log(file, file?.name, 'Test')
    let fileName = {
      "fileName": `${applicantName}_ReApp_Payment_Receipt_${format(new Date(), 'MMM_dd_yyyy')}.pdf`
    };
    const formData = new FormData();

    if (file !== null) {
      console.log('payment')
      const blob = new Blob([file], { type: `application/pdf` });
      formData.append('files', new Blob([JSON.stringify(fileName)], {
        type: "application/json"
      }));
      formData.append('documents', blob, fileName?.fileName);

      let uploadedFile = {};
      try {
        const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
        console.log(response?.data);
        console.log('payment')
        handleSavePDF(response?.data, data)
        uploadedFile = response?.data;
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        return null;
      }

      // try {
      //   const response = await PUT(`application-management-service/application/${applicationId}/form/${basicForm?.forms?.[formIndex]?.id}/addFileToForm`, uploadedFile);
      //   console.log(response?.data);
      //   return response?.data;
      // } catch (error) {
      //   console.error(error);
      //   return null;
      // }
    }
  }

  const handleSavePDF = async (file, data) => {
    console.log('payment')
    let temp = {
      "payee": {
        "name": {
          "firstName": data?.card?.name,
          "lastName": "string",
          "middleName": "string"
        },
        "email": {
          "officialEmail": data?.shipping?.email_address
        },
        "mobileNumber": data?.shipping?.phone_number,
        "address": {
          "streetName": data?.shipping?.address_line1,
          "city": data?.shipping?.city,
          "province": data?.shipping?.province,
          "pinCode": data?.shipping?.postal_code
        }
      },
      "fee": data?.amount,
      "tax": 0,
      "total": data?.amount,
      "currency": paymentListData?.currencyType,
      "quantity": 1,
      "product": "Reappointment Application Fee",
      // "paidDateTime": format(new Date(data?.created || new Date()), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      "paidDateTime": new Date().toISOString(),
      "paymentMethod": data?.payment_method,
      "cardNumber": data?.card?.last_four,
      "receiptId": data?.order_number,
      "paymentApplicable": true,
      "paymentCompleted": true,
      "invoice": file?.file
    }

    try {
      await PUT(`application-management-service/application/${applicationId}/payment`, temp)
        .then(response => {
          handleSendReceipt()
          setIsLoading(false);
        })
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    continueClick(true);
  }

  const handleDownload = (data) => {
    console.log('payment')
    const element = targetRef.current;
    const opt = {
      margin: 0.5,
      filename: "page.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: true,
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    // const nestedElements = element.querySelectorAll('.applicationCardScrollStyle');
    // nestedElements.forEach((_element) => {
    //     _element.classList.remove('applicationCardScrollStyle');
    // });
    html2pdf().set(opt).from(element).outputPdf("blob").then((pdfBlob) => {
      addNewDocument(pdfBlob, data);
    });
  };

  const handleSendReceipt = async () => {
    await POST(`application-management-service/application/${applicationId}/sendPaymentReceipt`)
  }

  return (


    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${showReceipt ? style.eSignDialogPDF : style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        {isLoading && (
          <div
            className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
          >
            <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyle} />
          </div>
        )}
        {!showReceipt ? (

          <div className={`${style.container} ${style.displayInCol}`}>
            <div className={style.heading}>Payment Required</div>
            <div className={style.marginTop}>
              <Cards
                number={state.number}
                expiry={state.expiry}
                cvc={state.cvc}
                name={state.name}
                focused={state.focus}
              />
            </div>
            <div className={`${style.marginTop10} ${style.fullWidth}`}>
              <TextField
                type="tel"
                name="number"
                placeholder="Card Number"
                value={state.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={` ${style.fullWidth}`}
                inputProps={{
                  pattern: "[\\d| ]{16,22}",
                }}
              />
            </div>
            <div className={`${style.marginTop10} ${style.fullWidth}`}>
              <TextField
                type="text"
                name="amount"
                placeholder="Amount"
                value={`${paymentListData?.currencyType}${paymentListData?.fee}`}
                // onChange={handleInputChange}
                disabled={true}
                onFocus={handleInputFocus}
                className={` ${style.fullWidth}`}
              />
            </div>
            <div className={`${style.marginTop10} ${style.fullWidth}`}>
              <TextField
                type="text"
                name="name"
                placeholder="Name on card"
                value={state.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className={`${style.fullWidth}`}
              />
            </div>
            <div className={`${style.cvvGrid} ${style.marginTop10} ${style.fullWidth}`}>
              <TextField
                type="tel"
                name="expiry"
                placeholder="Valid Thru"
                value={state.expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                inputProps={{
                  pattern: "\d\d/\d\d",
                }}
              />
              <TextField
                type="number"
                name="cvc"
                placeholder="CVC"
                value={state.cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                inputProps={{
                  pattern: "\d{3,4}",
                }}
              />
            </div>
            {paymentStatus && <p className={paymentStatus?.includes("Successful") ? style.paymentSuccessText : style.paymentFailedText}>{paymentStatus}</p>}
            <div className={`${style.continue} ${style.marginLeft} ${style.marginTop10}`} onClick={() => { submitPayment(); }} >PAY</div>
          </div>
        ) : (
          <div className={`${style.receiptContainer}`} ref={targetRef}>
            <div className={`${style.spaceBetween} ${style.verticalAlignCenter}`}>
              <div><img src={CambridgeHospital} className={style.receiptLogo} alt="" /></div>
              <div><img src={CAPManager} className={style.receiptLogo} alt="" /></div>
            </div>
            <div>
              <div className={style.receiptHeader}>Payment Receipt</div>
              <div className={style.receiptNumber}>Transaction ID: {paymentInfo?.order_number}</div>
              <div className={style.divider}></div>
            </div>

            {/* Receipt Details */}
            <div className={style.receiptDetails}>
              {/* <h3>Transaction Details</h3> */}
              <div className={`${style.receiptDescription} ${style.marginTop10}`}>
                This is confirmation for the Reappointment Application Processing Fee that was charged to {basicForm?.applicant?.name?.firstName} {basicForm?.applicant?.name?.lastName}'s Credit Card. Save this receipt for your finance department records. The receipt will also be available from the Staff Account in CAPManager.
              </div>
              <div className={style.twoCol}>
                <div>
                  <div className={style.marginTop10}>
                    <div className={style.receiptTo}>Fee Charged To</div>
                    <div className={style.applicantName}>{`${basicForm?.applicant?.name?.firstName} ${basicForm?.applicant?.name?.lastName}`}</div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Description:
                    </div>
                    <div className={style.detailsText}>
                      Reappointment Application Processing Fee
                    </div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Period Start To End:
                    </div>
                    <div className={style.detailsText}>
                      July 1, 2025 To June 30, 2026
                    </div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Department / Division:
                    </div>
                    <div className={style.detailsText}>
                      {basicForm?.basicDetails?.departmentSpecialty?.department} {basicForm?.basicDetails?.departmentSpecialty?.specialty !== null ? basicForm?.basicDetails?.departmentSpecialty?.specialty : ''}
                    </div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Staff Type & Privilege Category:
                    </div>
                    <div className={style.detailsText}>
                      {basicForm?.basicDetails?.applicant?.applicantType} - {basicForm?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}
                    </div>
                  </div>
                </div>
                <div>
                  <div className={style.marginTop10}>
                    <div className={style.receiptTo}>Transaction Details</div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Transaction ID:
                    </div>
                    <div className={style.detailsText}>
                      {paymentInfo?.order_number}
                    </div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Payment Date:
                    </div>
                    <div className={style.detailsText}>
                      {format(new Date(), "MMM dd, yyyy HH:mm a")}
                    </div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Card Used:
                    </div>
                    <div className={style.detailsText}>
                      {paymentInfo?.card?.last_four}
                    </div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Payment Gateway:
                    </div>
                    <div className={style.detailsText}>
                      Bambora
                    </div>
                  </div>
                  <div className={style.marginTop10}>
                    <div className={`${style.receiptDescription}`}>
                      Total Amount Charged:
                    </div>
                    <div className={style.detailsText}>
                      {paymentListData?.currencyType} {paymentInfo?.amount}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${style.footer} ${style.marginTop10}`}>
                <div className={style.divider}></div>
                <div className={`${style.spaceBetween} ${style.marginTop}`}>
                  <div><img src={PoweredHapiCare} className={style.receiptLogo} alt="" /></div>
                  <div className={style.copyRight}>Copyright {format(new Date(), 'yyyy')}. All Rights Reserved by HapiCare, Inc.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>

  );
};

export default ThirdPartyDialog;