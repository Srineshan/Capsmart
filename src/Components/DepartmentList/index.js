import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const DepartmentList = ({onChangeFunc, value, className}) => {
  const [departmentList, setDepartmentList] = useState([]);

  useEffect(()=>{
    getDepartmentList();
  },[])

  const getDepartmentList  = async() => {
   await GET('entity-service/department')
   .then(response=>{
     setDepartmentList(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Title" valueList={departmentList?.map(data=>data?.id)} dataList={departmentList} displayList={departmentList?.map(data=>data?.departmentName?.name)} onChangeFunc={onChangeFunc}/>
  )
}


export default DepartmentList;
