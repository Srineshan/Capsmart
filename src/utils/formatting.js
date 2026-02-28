import axios from "axios";
import { ErrorToaster } from './toaster';
import Payment from "payment";
import dataLoadinglogo from '../images/loaderCommon.gif';

const LMS_SSO_API_URL = process.env.REACT_APP_LMS_SSO_API_URL;
const LMS_SSO_SECRET_KEY = process.env.REACT_APP_LMS_SSO_SECRET_KEY;

/**
 * Fetches the LMS redirect URL from the external SSO API.
 * @param {string} ssoToken - SSO token from cookie (e.g. cookie.get("user"))
 * @returns {Promise<string>} - Resolves to redirect_url, rejects on error
 */
export const getLMSRedirectUrl = async (ssoToken) => {
  if (!ssoToken) {
    ErrorToaster('SSO token is required to access LMS');
    throw new Error('SSO token is required');
  }
  if (!LMS_SSO_API_URL || !LMS_SSO_SECRET_KEY) {
    ErrorToaster('LMS SSO configuration is missing. Please check REACT_APP_LMS_SSO_API_URL and REACT_APP_LMS_SSO_SECRET_KEY in .env');
    throw new Error('LMS SSO configuration is missing');
  }
  try {
    const { data } = await axios.post(LMS_SSO_API_URL, {
      secret_key: LMS_SSO_SECRET_KEY,
      sso_token: ssoToken,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (data?.status !== '200' || !data?.data?.redirect_url) {
      ErrorToaster(data?.message || 'Failed to get LMS redirect URL');
      throw new Error(data?.message || 'Invalid response from LMS SSO API');
    }
    return data?.data?.redirect_url;
  } catch (err) {
    if (err?.response?.data?.message) {
      ErrorToaster(err.response.data.message);
    }
    throw err;
  }
};

export const FormatPhoneNumber = (value) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  // if (/^(\d)\1{9}$/.test(phoneNumber)) {
  //   return ""; // Invalid phone number with all digits the same
  // }
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  const areaCode = phoneNumber.slice(0, 3);
  // if (!/^[2-9]\d{2}$/.test(areaCode)) {
  //   return ""; // Invalid area code
  // }

  if (phoneNumberLength < 7) {
    return `(${areaCode}) ${phoneNumber.slice(3)}`;
  }

  return `(${areaCode}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}

export const FormatPostalCode = (value) => {
  let cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  if (cleaned.length > 3) {
    cleaned = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  }

  return cleaned;
};

export const EmailValidator = (value) => {
  if (!value?.includes('@') || !value?.includes('.')) {
    ErrorToaster('Enter valid Email');
    return true;
  }
}

export const PhoneValidator = (value) => {
  if (value?.length !== 14) {
    ErrorToaster('Enter a valid Phone Number');
    return true;
  }
}

export const EmptyStringCheck = (value, message) => {
  if (value === '' || value === undefined || value === null) {
    ErrorToaster(message);
    return true;
  }
}

export const getValueByPath = (obj, path) => {
  const keys = path.split(/[\.\[\]]+/).filter(Boolean);
  return keys.reduce((acc, key) => acc && acc[isNaN(key) ? key : Number(key)], obj);
};

export const extractNumbersFromString = (inputString) => {
  const regex = /\d+/g;
  const numbersArray = inputString.match(regex);
  return numbersArray ? numbersArray.map(Number) : [];
};

export const formatFirstNameLastName = (firstName, lastName) => {
  const formattedFirstName = firstName?.charAt(0)?.toUpperCase() + firstName?.slice(1)?.toLowerCase();
  const formattedLastName = lastName?.charAt(0)?.toUpperCase() + lastName?.slice(1)?.toLowerCase();

  return `${formattedLastName}, ${formattedFirstName}`;
};

export const GetDateFromHours = (time) => {
  time = time?.split(':') || [];
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}

export const preventNegativeValues = (e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()

export const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const siteTimeZone = () => { return sessionStorage.getItem('siteTimeZone') !== 'undefined' ? sessionStorage.getItem('siteTimeZone') : Intl.DateTimeFormat().resolvedOptions().timeZone }

export const timeZoneAbbreviation = () => {
  let timezoneName = sessionStorage.getItem('timeZoneAbbreviation');
  return (timezoneName === 'null' || timezoneName === 'undefined') ? '' : sessionStorage.getItem('timeZoneAbbreviation');
}

console.log(timeZoneAbbreviation, siteTimeZone)
// export const corsUrl = 'https://app.mytimesmart.com/cors/'

export const corsUrl = 'https://app.timesmartai.com/cors/'

export const fileLoadingURL = 'https://capmanager-dev.s3.us-east-1.amazonaws.com/File_Upload_Loading.gif';

export const dataLoadingGIF = dataLoadinglogo

const clearNumber = (value = "") => {
  return value.replace(/\D+/g, "");
}

export function formatCreditCardNumber(value) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case "amex":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`;
      break;
    case "dinersclub":
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
}

export function formatCVC(value, prevValue, allValues = {}) {
  const clearValue = clearNumber(value);
  let maxLength = 4;

  if (allValues.number) {
    const issuer = Payment.fns.cardType(allValues.number);
    maxLength = issuer === "amex" ? 4 : 3;
  }

  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value) {
  const clearValue = clearNumber(value);

  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}

export function formatFormData(data) {
  return Object.keys(data).map(d => `${d}: ${data[d]}`);
}
