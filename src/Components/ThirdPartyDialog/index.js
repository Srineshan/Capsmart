import React, { useRef, useState } from "react";
import { Dialog, Classes } from "@blueprintjs/core";
import Cards from 'react-credit-cards-2';
import axios from "axios";
import html2pdf from "html2pdf.js";
import style from "./index.module.scss";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { TextField } from "@mui/material";
import { formatCreditCardNumber, formatCVC, formatExpirationDate } from "../../utils/formatting";
import { PUT, POST } from "../../Screens/dataSaver";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const ThirdPartyDialog = ({ getIsOpen, continueClick, paymentListData }) => {
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  const { applicationId, section, step } = useParams()
  const merchantId = "383612842";
  const apiPasscode = "c3c57e781e63444fB66d87caDeC54AC5";
  const base64ApiKey = btoa(`${merchantId}:${apiPasscode}`);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
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
    const API_URL = "https://api.na.bambora.com/v1/payments";
    const API_KEY = base64ApiKey; // Replace with your Base64-encoded API key

    const paymentData = {
      amount: paymentListData?.[0]?.fee?.toFixed(2), // Replace with the amount you want to charge
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
        `Payment Failed! Error: ${error.response?.data?.message || error.message
        }`
      );
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
      "currency": paymentListData?.[0]?.currencyType,
      "quantity": 1,
      "product": "Reappointment Application Fee",
      "paidDateTime": format(new Date(data?.created), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      "paymentMethod": data?.payment_method,
      "cardNumber": data?.card?.last_four,
      "receiptId": data?.order_number,
      "paymentApplicable": true,
      "paymentCompleted": true
    };
    try {
      await PUT(`application-management-service/application/${applicationId}/payment`, temp);
    } catch (error) {
      console.log(error);
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
      handleDownload(response.data)
    } catch (error) {
      setPaymentStatus(
        `Payment Failed! Error: ${error.response?.data?.message || error.message
        }`
      );
    }

  };

  const addNewDocument = async (file, data) => {
    console.log(file, file?.name, 'Test')
    let fileName = {
      "fileName": 'acknowledgement.pdf'
    };
    const formData = new FormData();

    if (file !== null) {
      const blob = new Blob([file], { type: `application/pdf` });
      formData.append('files', new Blob([JSON.stringify(fileName)], {
        type: "application/json"
      }));
      formData.append('documents', blob, fileName?.fileName);

      let uploadedFile = {};
      try {
        const response = await POST(`application-management-service/application/${applicationId}/files`, formData);
        console.log(response?.data);
        handleSavePDF(response?.data, data)
        uploadedFile = response?.data;
      } catch (error) {
        console.error(error);
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
      "currency": paymentListData?.[0]?.currencyType,
      "quantity": 1,
      "product": "Reappointment Application Fee",
      "paidDateTime": format(new Date(data?.created || new Date()), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      "paymentMethod": data?.payment_method,
      "cardNumber": data?.card?.last_four,
      "receiptId": data?.order_number,
      "paymentApplicable": true,
      "paymentCompleted": true,
      "invoice": file?.file
    }

    try {
      await PUT(`application-management-service/application/${applicationId}/payment`, temp);
    } catch (error) {
      console.log(error);
    }
    continueClick();
  }

  const handleDownload = (data) => {
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

  return (


    <Dialog
      isOpen={getIsOpen}
      onClose={() => getIsOpen(false)}
      className={`${style.eSignDialog} ${style.eSignDialogBackground}`}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
    >
      <div>
        <div className={`${style.container} ${style.displayInCol}`}>
          {/* <div></div>
          <div className={style.text}>
            Third Party Payment Gateway
          </div> */}
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
          {/* <form> */}
          {/* <input
              type="number"
              name="number"
              placeholder="Card Number"
              value={state.number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            /> */}
          <div className={`${style.marginTop} ${style.fullWidth}`}>
            <TextField
              type="tel"
              name="number"
              placeholder="Card Number"
              value={state.number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={`${style.marginTop} ${style.fullWidth}`}
              inputProps={{
                pattern: "[\\d| ]{16,22}",
              }}
            />
          </div>
          <div className={`${style.marginTop} ${style.fullWidth}`}>
            <TextField
              type="text"
              name="amount"
              placeholder="Amount"
              value={`${paymentListData?.[0]?.currencyType}${paymentListData?.[0]?.fee}`}
              // onChange={handleInputChange}
              disabled={true}
              onFocus={handleInputFocus}
              className={`${style.marginTop} ${style.fullWidth}`}
            />
          </div>
          <div className={`${style.marginTop} ${style.fullWidth}`}>
            <TextField
              type="text"
              name="name"
              placeholder="Name on card"
              value={state.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={`${style.marginTop} ${style.fullWidth}`}
            />
          </div>
          <div className={`${style.cvvGrid} ${style.marginTop} ${style.fullWidth}`}>
            <TextField
              type="tel"
              name="expiry"
              placeholder="Valid Thru"
              value={state.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className={style.marginTop}
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
              className={style.marginTop}
              inputProps={{
                pattern: "\d{3,4}",
              }}
            />
          </div>
          {paymentStatus && <p>{paymentStatus}</p>}
          {showReceipt && (
            <div className={`${style.receiptContainer}`} ref={targetRef}>
              {/* Header */}
              <div className={style.receiptHeader}>
                <h2>Payment Receipt</h2>
              </div>

              {/* Receipt Details */}
              <div className={style.receiptDetails}>
                <h3>Transaction Details</h3>
                <p>
                  <strong>Description:</strong> Reappointment Application Fee
                </p>
                <p>
                  <strong>Transaction ID:</strong> {paymentInfo?.order_number}
                </p>
                <p>
                  <strong>Date Paid:</strong> {format(new Date(paymentInfo?.created || new Date()), "MMM dd, yyyy HH:mm:ss")}
                </p>
                <p>
                  <strong>Amount Paid:</strong> {paymentInfo?.amount}
                </p>
                <p>
                  <strong>Card Number:</strong>{" "}
                  <span
                  >
                    {paymentInfo?.card?.last_four}
                  </span>
                </p>
              </div>
            </div>
          )}
          {/* </form> */}
          <div className={`${style.continue} ${style.marginLeft} ${style.marginTop}`} onClick={() => { submitPayment(); }} >PAY</div>
        </div>
      </div>
    </Dialog>

  );
};

export default ThirdPartyDialog;
