import {
    differenceInDays,
    differenceInHours,
    differenceInMinutes,
    differenceInMonths,
    differenceInWeeks,
  } from 'date-fns';
  
  export const getDaysAgo = (date) => {
    return differenceInMinutes(new Date(), new Date(date)) < 60
      ? `${differenceInMinutes(new Date(), new Date(date))} min(s) ago`
      : differenceInMinutes(new Date(), new Date(date)) < 1440
      ? `${differenceInHours(new Date(), new Date(date))} hour(s) ago`
      : differenceInDays(new Date(), new Date(date)) < 7
      ? `${differenceInDays(new Date(), new Date(date))} day(s) ago`
      : differenceInWeeks(new Date(), new Date(date)) < 5
      ? `${differenceInWeeks(new Date(), new Date(date))} week(s) ago`
      : `${differenceInMonths(new Date(), new Date(date))} month(s) ago`;
  };
  