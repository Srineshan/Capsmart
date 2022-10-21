import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const FunctionalTitleList = ({onChangeFunc, value, className, providerId}) => {
  const [functionalTitle, setFunctionalTitle] = useState([]);
  const defaultProviderId = "6335e77dbb13e2088b208bb0";
  const selectedProvider = providerId !== '' ? providerId : defaultProviderId;

  useEffect(()=>{
    getFunctionalTitle();
  },[providerId])

  const getFunctionalTitle  = async() => {
   await GET(`entity-service/functionalTitlesForCSPType?contractedServiceProviderTypeId=${selectedProvider}`)
   .then(response=>{
     setFunctionalTitle(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

 const onSelectHandle = (id) => {
   onChangeFunc(id,functionalTitle?.filter(data=>data?.id === id)?.map(data=>data?.title)[0]);
 }

  return(
    <SelectField className={className} value={value} selectLabel="Select Title" valueList={functionalTitle?.map(data=>data?.id)} dataList={functionalTitle} displayList={functionalTitle?.map(data=>data?.title)} onChangeFunc={onSelectHandle}/>
  )
}


export default FunctionalTitleList;
