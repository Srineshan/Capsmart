import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const FunctionalTitleList = ({onChangeFunc, value, className}) => {
  const [funtionalTitle, setFunctionalTitle] = useState([]);

  useEffect(()=>{
    getFunctionalTitle();
  },[])

  const getFunctionalTitle  = async() => {
   await GET('entity-service/functionalTitlesForCSPType')
   .then(response=>{
     setFunctionalTitle(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Title" valueList={funtionalTitle?.map(data=>data?.id)} dataList={funtionalTitle} displayList={funtionalTitle?.map(data=>data?.functionalTitle)} onChangeFunc={onChangeFunc}/>
  )
}


export default FunctionalTitleList;
