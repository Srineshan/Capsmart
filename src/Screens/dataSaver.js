import React from 'react';
import {Auth} from './../utils/auth'
import axios from "axios";

// const accessToken = Auth();
const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTk2NzAzNjMsImV4cCI6MTY1OTc1Njc2M30.IkR_f5L8IiJzGmKec0uO2iDOfwh12ofaO4J9YfZjrMLbPkcK33T8pma1WZtWJuhzntVzYR9oF-ljjznbSUGnIg';
export const TenantID = '6242845f95690b3822cb96a5';
// export const role = 'DISTRIBUTED-SYS-USER';
export const role = 'DISTRIBUTED-SYS-ADMIN';
// export const role = 'SUPER-SYS-USER';
// export const role = 'SUPER-SYS-ADMIN';
// export const role = 'SYS-ADMIN';
// export const role = 'SYS-USER';
export const isSuperAdminAccess = ['DISTRIBUTED-SYS-ADMIN','DISTRIBUTED-SYS-USER','SUPER-SYS-ADMIN','SUPER-SYS-USER']?.includes(role) ? true : false
const baseUrl = 'http://ec2-54-210-154-191.compute-1.amazonaws.com';

const headers = {
'Content-Type': 'application/json',
'X-tenantID' : TenantID,
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

export const POST = (url,data) => {
    return axios(`${baseUrl}/${url}`,{
        method: 'POST',
        headers: headers,
        data,
    })
}
