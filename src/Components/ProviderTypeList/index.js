import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const ProviderTypeList = ({onChangeFunc, value, className}) => {
  const [provider, setProvider] = useState([]);
  const siteTypeId = sessionStorage.getItem('entityTypeId') || '63ab2c90bc9089d77c9232ac';

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
