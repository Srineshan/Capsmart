import React, {useState} from 'react'
import {Auth} from './auth';
import {GET,TenantID} from './../Screens/dataSaver';

export const FunctionalTitle = async() => {
    const [functionalTitle,setFunctionalTitle] = useState([]);
    const {data: title} = await GET('entity-service/functionalTitlesForCSPType');
    if(title){
      setFunctionalTitle(title);
    }
    return functionalTitle;
}

export const DepartmentList  = async() => {
  const [departmentList,setDepartmentList] = useState([]);
  const {data: departments} = await GET('entity-service/departments');
  if(departments){
    setDepartmentList(departments);
  }
  return departmentList;
}

export const Suffix  = async(apiUrl) => {
  let result;
  await GET(apiUrl)
  .then(response=>{
    result = response?.data;
  })
  .catch(error=>{
    console.log('error',error);
  })
  return result;
}
