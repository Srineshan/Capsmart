import { ErrorToaster } from './toaster';
import Payment from "payment";
import dataLoadinglogo from '../images/loaderCommon.gif';

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
