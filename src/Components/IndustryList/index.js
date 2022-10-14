import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const IndustryList = ({onChangeFunc, value, className}) => {
  const [industry, setIndustry] = useState([]);

  useEffect(()=>{
    getIndustryList();
  },[])

  const onSelectHandle = (id) => {
    onChangeFunc(id,industry?.filter(data=>data?.id === id)?.map(data=>data?.industry)[0]);
  }

  console.log('value',value,'inside industry list');

  const getIndustryList  = async() => {
   await GET('entity-service/industryMaster')
   .then(response=>{
     setIndustry(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Type" valueList={industry?.map(data=>data?.id)} dataList={industry} displayList={industry?.map(data=>data?.industry)} onChangeFunc={onSelectHandle}/>
  )
}


export default IndustryList;
