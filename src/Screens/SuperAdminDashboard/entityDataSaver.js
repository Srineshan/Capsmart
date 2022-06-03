export const saveEntity = async(department={},entity={},address={},billingDetails={}) => {
  let departments = [];
  department?.map(data=>{
    departments.push({"departmentName":{"name":data.name},"departmentHead":{"id":''}})
  })
  const entityValue = {
  "entityName": {
    "entityName": entity.name
  },
  "entityType": {
    "type": entity.type
  },
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
        "city": address.city,
        "state": address.state,
        "zipcode": address.zipcode,
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
const response = await fetch('https://ec2-44-202-85-195.compute-1.amazonaws.com:8000/entity-service/entity', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',
               'Access-Control-Allow-Methods': "GET, POST, PUT, DELETE, OPTIONS",
               'X-tenantID' : '6242845f95690b3822cb96a5',
               'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTM4MDExMjksImV4cCI6MTY1Mzg4NzUyOX0.Rjo98o0UCIdUTpz3H0YdQDdES3mdffmoBdd64jAa1hpwaM2KS8JOwV-9iGikv6mg_kdH550RI6p_7kcSZg6eWw`},
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
  console.log('department name',name)
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
