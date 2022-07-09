import React, {useState} from 'react'
import {Auth} from './../../utils/auth'
import axios from "axios";

export const saveEntity = async(department={},entity={},address={},billingDetails={}) => {
//   const accessToken = Auth();
//   let departments = [];
//   department?.map(data=>{
//     departments.push({"departmentName":{"name":data},"departmentHead":{"id":''}})
//   })
//   console.log('in data saveer',accessToken);
  const entityValue = {
  "id":"6242845f95690b3822cb96a5",
  "entityName": {
    "entityName": "Hospital1"
  },
  "entityType": {
    "type": "Doctor Office"
  },
  "websiteURL":"",
  "canPrimarySiteToUseApp":false,
  "multiSiteEntity":false,
  "customerType": "HEALTHCARE",
  "sites": [
    {
      "siteName": {
        "siteName": ""
      },
      "siteAdmin": {
        "id": ""
      },
      "siteType": {
        "type": ""
      },
      // "departmentList": {
      //   "departments": departments
      // },
      // "address": {
      //   "addressLine": address.addressLine,
      //   "city": address.city,
      //   "state": address.state,
      //   "zipcode": address.zipcode,
      //   "country": address.country,
      // }
    }
  ],
  "subscriptionPlan": {
    "planName": "BASIC",
    "allowableRegisteredUsers": {
      "allowableRegisteredUsers": 0
    },
    "subscriptionFees": {
      "fees": ""
    },
    "subscriptionStatus": "ACTIVE",
    "billingFrequency": "MONTHLY",
    "discount": {
      "discount": 0
    },
    "plannedToGoLive": {
      "date": ""
    },
    "poaNumber": {
      "poaNumber": ""
    }
  },
  "billingDetails": {
    "name": {
      "firstName": "",
      "lastName": ""
    },
    "email": {
      "emailId": ""
    },
    "contactNumber": {
      "contactNumber": 0
    }
  },
  "trailDetails": {
    "trialPeriod": {
      "period": ""
    },
    "contactName": {
      "name": ""
    },
    "trialPeriodDates": {
      "startDate": "",
      "endDate": ""
    },
    "name": {
      "firstName": "",
      "lastName": ""
    },
    "email": {
      "emailId": ""
    },
    "contactNumber": {
      "contactNumber": 0
    }
  },
  "accountManager": {
    "id": ""
  }
}
const response = await fetch('http://ec2-54-210-154-191.compute-1.amazonaws.com/entity-service/entity', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',
               'X-tenantID' : '6242845f95690b3822cb96a5',
               'Authorization': `Bearer ${accessToken}`,
               'Access-Control-Allow-Origin' : '*',
             },

    body: JSON.stringify(entityValue)
  });
  if(response){
    console.log('Success');
  }else{
    console.log('failed');
  }
}

//
const accessToken = Auth()
const baseUrl = 'http://ec2-54-210-154-191.compute-1.amazonaws.com/entity-service'
const headers = {
  'Content-Type': 'application/json',
  'X-tenantID' : '6242845f95690b3822cb96a5',
  'Authorization': `Bearer ${accessToken}`
}



export const GET = (url) => {
  return axios(`${baseUrl}/${url}`,{
    method: 'GET',
    headers: headers,
  });
}

export const PUT = (url,data) => {
  return axios(`${baseUrl}/${url}`,{
    method: 'PUT',
    headers: headers,
    data,
  })
}

// export const getEntityData = async() => {
//   const accessToken = Auth();
//   let entityData = {};
//   const entity = {
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json',
//               'X-tenantID' : '6242845f95690b3822cb96a5',
//               'Authorization': `Bearer ${accessToken}`}
//     };
//   let responseData = await fetch('http://ec2-54-210-154-191.compute-1.amazonaws.com:8000/entity-service/entity', entity)
//     .then(response => response.json())
//     .then(data => {
//         if(data?.filter(data=>data.id === '6242845f95690b3822cb96a5')?.map(data=>{
//           console.log('data in func',data);
//           entityData = data;
//           }))
//       return entityData;
//     }
//    )
//    return entityData;
// }
