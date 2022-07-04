import React from 'react'
import {Auth} from './../../utils/auth'

export const saveEntity = async(department={},entity={},address={},billingDetails={}) => {
  const accessToken = Auth();
  let departments = [];
  department?.map(data=>{
    departments.push({"departmentName":{"name":data},"departmentHead":{"id":''}})
  })
  console.log('in data saveer',accessToken);
  const entityValue = {
  "id":entity.id,
  "entityName": {
    "entityName": entity.name
  },
  "entityType": {
    "type": entity.type
  },
  "websiteURL":entity.websiteURL,
  "canPrimarySiteToUseApp":entity.primarySite,
  "multiSiteEntity":entity.multiSiteEntity,
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
      "departmentList": {
        "departments": departments
      },
      "address": {
        "addressLine": address.addressLine,
        "city": address.city,
        "state": address.state,
        "zipcode": address.zipcode,
        "country": address.country,
      }
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
const response = await fetch('http://ec2-184-72-207-241.compute-1.amazonaws.com:8000/entity-service/entity', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',
               'X-tenantID' : '6242845f95690b3822cb96a5',
               'Authorization': `Bearer ${accessToken}`},
    body: JSON.stringify(entityValue)
  });
  if(response){
    console.log('Success');
  }else{
    console.log('failed');
  }
  return;
}

export const departmentSave = async(name) => {
  const department = {
    "departmentName":{
      "name":name
    },
    "departmentHead" : {
      "id":''
    }
  }
  const response = await fetch('http://ec2-44-202-85-195.compute-1.amazonaws.com:8000/entity-service/department', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
                'X-tenantID' : '6242845f95690b3822cb96a5',
                'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTM3NjAxMTQsImV4cCI6MTY1Mzg0NjUxNH0.eTiXgF1A1FheMgB4L8VbMeZMs7pxc0wiNhFTbt9WkO4HcVwiNKhgIQR1sBMaDp-D3Ez4Cm_VJi3jai35RrywOg`},
      body: JSON.stringify(department)
    });
    if(response){
      console.log('Success');
    }else{
      console.log('failed');
    }
}
