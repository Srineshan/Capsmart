import { ErrorToaster } from './toaster';

export const FormatPhoneNumber = (value) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}

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

export const GetDateFromHours = (time) => {
  time = time?.split(':') || [];
  let now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
}

export const preventNegativeValues = (e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()

export const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const corsUrl = 'https://app.mytimesmart.com/cors/'

// export const corsUrl = 'https://app.timesmartai.com/cors/'