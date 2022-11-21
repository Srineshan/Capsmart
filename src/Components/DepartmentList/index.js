import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const DepartmentList = ({onChangeFunc, value, className, entityTypeId}) => {
  const [departmentList, setDepartmentList] = useState([]);
  const siteTypeId = entityTypeId || sessionStorage.getItem('entityTypeId') || '6335e452bb13e2088b208b99'

  useEffect(()=>{
    getDepartmentList();
  },[entityTypeId])

  useEffect(()=>{
    getDepartmentList();
  },[])

  const getDepartmentList  = async() => {
   await GET(siteTypeId !== undefined ? `entity-service/department?siteTypeId=${siteTypeId}` : `entity-service/department`)
   .then(response=>{
     setDepartmentList(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

 const onSelectHandle = (id) => {
   onChangeFunc(departmentList?.filter(data=>data?.id === id)?.map(data=>data)[0]);
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Department" valueList={departmentList?.map(data=>data?.id)} dataList={departmentList} displayList={departmentList?.map(data=>data?.departmentName?.name)} onChangeFunc={onSelectHandle}/>
  )
}


export default DepartmentList;
