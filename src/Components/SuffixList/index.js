import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const SuffixList = ({onChangeFunc, value, className}) => {
  const [suffixList, setSuffixList] = useState([]);
  const industryId = "63ab2b92bc9089d77c9232a9";

  useEffect(()=>{
    getSuffix();
  },[])

  const onSelectHandle = (id) => {
    onChangeFunc(id,suffixList?.filter(data=>data?.id === id)?.map(data=>data?.suffix)[0]);
  }

  const getSuffix  = async() => {
   await GET(`entity-service/nameSuffix?industryId=${industryId}`)
   .then(response=>{
     setSuffixList(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Suffix" valueList={suffixList?.map(data=>data?.id)} dataList={suffixList} displayList={suffixList?.map(data=>data?.suffix)} onChangeFunc={onSelectHandle}/>
  )
}


export default SuffixList;
