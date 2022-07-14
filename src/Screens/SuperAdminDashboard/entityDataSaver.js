import React, {useState} from 'react'
import {Auth} from './../../utils/auth'
import axios from "axios";



const accessToken = Auth();
// export const role = 'SUPER-SYS-ADMIN';
export const role = 'SYS-ADMIN';
export const tenantID = '6242845f95690b3822cb96a5'
const baseUrl = 'http://ec2-54-210-154-191.compute-1.amazonaws.com'
const headers = {
  'Content-Type': 'application/json',
  'X-tenantID' : tenantID,
  'Authorization': `Bearer ${accessToken}`
}

const entityPost = {

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
