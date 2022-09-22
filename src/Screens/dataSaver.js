import React, {useEffect} from 'react';
import {Auth, GetEntityDetails, GetRoles} from './../utils/auth';
import Cookie from 'universal-cookie';
import axios from "axios";
import jwt from 'jwt-decode';

// const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTk1ODMyNzgsImV4cCI6MTY1OTY2OTY3OH0.3_IAH9tO0ckKJdUyh37H0PkvsiovaHEJI21zVuzZhBVBS8nzOHYaWaV3f1OkDb-pOdzxtvFzhDwnGUPnWD7Cfw';
export const TenantID = GetEntityDetails();
// export const role = 'DISTRIBUTED-SYS-ADMIN';
// export const role = 'SUPER-SYS-USER';
// export const role = 'SUPER-SYS-ADMIN';
// export const role = 'SYS-ADMIN';
// export const role = 'SYS-USER';

// const token = jwt(accessToken);

// export const Auth = () => {
//   let cookie = new Cookie();
//   let accessToken = cookie.get('user');
//   if(accessToken){
//     return accessToken;
//   }else{
//     return false;
//   }
//   }

const accessToken = Auth();
const roles = GetRoles();
export const isSuperAdminAccess = roles.includes('Super Sys Admin') || roles.includes('Distributor Admin') ? true : false;
const baseUrl = 'https://rest.timesmart.live';
let cookie = new Cookie();
let tenantId = cookie.get('entityId');
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

export const DELETE = (url) => {
    return axios(`${baseUrl}/${url}`,{
        method: 'DELETE',
        headers: headers,
    })
}
