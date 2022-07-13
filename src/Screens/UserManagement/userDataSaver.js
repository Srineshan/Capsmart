import React from 'react';
import {Auth} from './../../utils/auth'
import axios from "axios";

const accessToken = Auth()
const baseUrl = 'http://ec2-54-210-154-191.compute-1.amazonaws.com/user-management-service'
const headers = {
'Content-Type': 'application/json',
'X-tenantID' : '6242845f95690b3822cb96a5',
'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTc2ODkyOTgsImV4cCI6MTY1Nzc3NTY5OH0.rceEtxLZTS7KSJsWy84aZi3YToxI5ieZZQLhhAWnEDw_QgiF4GYWhwl1XLDwZRq5jU4-bmpPxPCgALsU2wvg-Q`
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

export const TenantID = '6242845f95690b3822cb96a5';