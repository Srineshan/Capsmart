import React, {useState} from 'react'
import {Auth} from './../../utils/auth'
import axios from "axios";



const accessToken = Auth();
// const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTg1NTc1NDgsImV4cCI6MTY1ODY0Mzk0OH0.q2oxjcRriiLTCpxfQBSePWzNMLozO4ektlJw0x6ZzFrhKsWKh170bN3UIDBbPqo3Y2tyDFCZ81gztAMDX4U1fw';
// export const role = 'SUPER-SYS-ADMIN';
export const role = 'SYS-ADMIN';
export const tenantID = '6242845f95690b3822cb96a5'
const baseUrl = 'https://ec2-54-210-154-191.compute-1.amazonaws.com'
const headers = {
  'Content-Type': 'application/json',
  'X-tenantID' : tenantID,
  'Authorization': `Bearer ${accessToken}`
}

const entityPost = (entity,address,site) => {
  let entityValue = {
    "entityName": {
      "entityName": entity.name,
    },
    "entityType": {
      "type": entity.type,
    },
    "customerType": "HEALTHCARE",
    "sites": [
      {
        "siteName": {
          "siteName": entity.name,
        },
        "siteAdmin": {
          "id": ""
        },
        "siteType": {
          "type": entity.type,
        },
        "npin": {
          "id": entity.npin,
        },
        "canSetupDepartment": site.canSetupDepartment,
        "departmentList": {
          "departments": [
            {
              "id": "string",
              "departmentName": {
                "name": "string"
              },
              "departmentHead": {
                "id": "string"
              }
            }
          ]
        },
        "address": {
          "addressLine": address.addressLine,
          "city": address.city,
          "state": address.state,
          "zipcode": address.zipcode,
          "country": address.country,
        },
        "primarySite": site.primarySite,
      }
    ],
    "subscriptionPlan": {
      "planName": "BASIC",
      "allowableRegisteredUsers": {
        "allowableRegisteredUsers": 0
      },
      "subscriptionFees": {
        "fees": "string"
      },
      "subscriptionStatus": "ACTIVE",
      "billingFrequency": "MONTHLY",
      "discount": {
        "discount": 0
      },
      "plannedToGoLive": {
        "date": "2022-07-15"
      },
      "poaNumber": {
        "poaNumber": "string"
      }
    },
    "billingDetails": {
      "contactname": {
        "firstName": "string",
        "lastName": "string"
      },
      "email": {
        "emailId": "string"
      },
      "contactNumber": {
        "contactNumber": 0
      }
    },
    "contractDetails": {
      "contractName": "string",
      "contractID": "string",
      "contractDocuments": [
        {
          "name": "string",
          "description": "string",
          "contractDocType": "AGREEMENTDRAFT",
          "contractDocPath": "string"
        }
      ],
      "contractTermPeriod": {
        "startDate": "2022-07-15",
        "endDate": "2022-07-15"
      },
      "plannedGoLive": {
        "date": "2022-07-15"
      },
      "contractContinuationPolicy": "AUTORENEWAL",
      "fullyExecutedContractOnFile": true
    },
    "accountManager": {
      "id": "string"
    },
    "appUserRoles": [
      {
        "id": "string",
        "roleName": "string"
      }
    ]
  }
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
    data: JSON.stringify(data),
  })
}

export const POST = (url,data) => {
  return axios(`${baseUrl}/${url}`,{
    method: 'POST',
    headers: headers,
    data,
  })
}
