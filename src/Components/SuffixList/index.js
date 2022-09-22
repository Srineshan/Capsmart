import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const SuffixList = ({onChangeFunc, value, className}) => {
  const [suffixList, setSuffixList] = useState([]);

  useEffect(()=>{
    getSuffix();
  },[])

  const getSuffix  = async() => {
   await GET('entity-service/nameSuffix')
   .then(response=>{
     setSuffixList(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Suffix" valueList={suffixList?.map(data=>data?.id)} dataList={suffixList} displayList={suffixList?.map(data=>data?.suffix)} onChangeFunc={onChangeFunc}/>
  )
}


export default SuffixList;
