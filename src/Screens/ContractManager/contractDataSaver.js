import React from 'react';
import {Auth} from './../../utils/auth'
import axios from "axios";

// const accessToken = Auth();
const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTkwOTc2MTIsImV4cCI6MTY1OTE4NDAxMn0.BjXflaIIZUcjlV-bv4kLtJdW4o__IJQr1D2CItIdIArH--Qzz-m8aC8g5VoxdUUvahrM266u7XOMPAR-MZYwKQ';
export const TenantID = '6242845f95690b3822cb96a5';
const baseUrl = 'http://ec2-54-210-154-191.compute-1.amazonaws.com'
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
