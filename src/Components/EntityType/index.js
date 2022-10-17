import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const EntityTypeList = ({onChangeFunc, value, className}) => {
  const [entityTypeList, setEntityTypeList] = useState([]);
  const industryId = "62ec0da4b188025da38b9d5e";

  useEffect(()=>{
    getEntityTypeList();
  },[])

  const getEntityTypeList  = async() => {
   await GET(`entity-service/entityTypeMaster?industryId=${industryId}`)
   .then(response=>{
     setEntityTypeList(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

 const onSelectHandle = (id) => {
   onChangeFunc(id,entityTypeList?.filter(data=>data?.id === id)?.map(data=>data?.type)[0]);
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Type" valueList={entityTypeList?.map(data=>data?.id)} dataList={entityTypeList} displayList={entityTypeList?.map(data=>data?.type)} onChangeFunc={onSelectHandle}/>
  )
}


export default EntityTypeList;
