import React from 'react';
import {Auth} from './../../utils/auth'
import axios from "axios";

// const accessToken = Auth();
const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTg0MTEzOTgsImV4cCI6MTY1ODQ5Nzc5OH0.kxCWpdr2dyclEVs_BuD84_aZNa-Gpmwv9SmjrbwWJ_2y14GtG5we2GyL23d7aI5VN1MihHjGo6B2KYy8YLE2Bg'
export const TenantID = '6242845f95690b3822cb96a5';
const baseUrl = 'http://ec2-54-210-154-191.compute-1.amazonaws.com'
const headers = {
'Content-Type': 'application/json',
'X-tenantID' : TenantID,
'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6IjYyNDI4NTJlOTMzN2NkNTUzN2I4ODcxNSIsInVzZXJOYW1lIjoiSG9zcGl0YWwgMSIsInN1YiI6Imhvc3BpdGFsMUB0aW1lc21hcnRhaS5jb20iLCJpYXQiOjE2NTgzMjQyMzQsImV4cCI6MTY1ODQxMDYzNH0.kqsmBLz8BGwtnq6-9GDNv8XQvgEA3nTKoiow4LFZGaYM0b2day-4JHor4Pm2EqWd8peqkFqwObJakLqr7GTo_A`
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
