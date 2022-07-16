import React from 'react';
import {Auth} from './../../utils/auth'
import axios from "axios";

const accessToken = Auth()
const baseUrl = 'http://ec2-54-210-154-191.compute-1.amazonaws.com'
const headers = {
'Content-Type': 'application/json',
'X-tenantID' : '6242845f95690b3822cb96a5',
'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTc5NjA2MDgsImV4cCI6MTY1ODA0NzAwOH0.vsKDkeFT0ducETdXUtX5efndKpBI5V9eKtMBklDduef2O50YPj5PNDwcQBj1SY1sDV6IL0SQt3txs59P6dAWfA`
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