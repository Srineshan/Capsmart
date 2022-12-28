import React, {useState, useEffect} from 'react';
import {GET} from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const FunctionalTitleList = ({onChangeFunc, value, className, providerId}) => {
  const [functionalTitle, setFunctionalTitle] = useState([]);
  const [provider, setProvider] = useState([]);
  const defaultProviderId = provider?.filter(data=>data?.contractedServiceProviderType === 'Physician / Doctor')?.map(data=>data?.id)[0] || '';
  const selectedProvider = providerId !== '' ? providerId : defaultProviderId;
  const siteTypeId = sessionStorage.getItem('entityTypeId') || '63ab2c90bc9089d77c9232ac'

  useEffect(()=>{
    getFunctionalTitle();
  },[selectedProvider])

  useEffect(()=>{
    getProvidertypeList();
  },[])

  const getProvidertypeList  = async() => {
   await GET(`entity-service/contractedServiceProvider?siteTypeId=${siteTypeId}`)
   .then(response=>{
     setProvider(response?.data);
   })
   .catch(error=>{
     console.log('error',error);
   })
 }

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
