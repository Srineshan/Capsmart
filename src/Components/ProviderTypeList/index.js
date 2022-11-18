import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const ProviderTypeList = ({onChangeFunc, value, className}) => {
  const [provider, setProvider] = useState([]);
  // const siteTypeId = sessionStorage.getItem('entityTypeId');
  const siteTypeId = '6335e452bb13e2088b208b99';

  useEffect(()=>{
    getProvidertypeList();
  },[])

  const onSelectHandle = (id) => {
    onChangeFunc(id,provider?.filter(data=>data?.id === id)?.map(data=>data?.contractedServiceProviderType)[0]);
  }

  const getProvidertypeList  = async() => {
   await GET(`entity-service/contractedServiceProvider?siteTypeId=${siteTypeId}`)
   .then(response=>{
     setProvider(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }
 console.log('providerType',provider);
  return(
    <SelectField className={className} value={value} selectLabel="Select Provider Type" valueList={provider?.map(data=>data?.id)} dataList={provider} displayList={provider?.map(data=>data?.contractedServiceProviderType)} onChangeFunc={onSelectHandle}/>
  )
}


export default ProviderTypeList;
