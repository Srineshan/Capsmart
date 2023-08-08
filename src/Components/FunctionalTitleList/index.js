import React, { useState, useEffect } from 'react';
import { GET } from './../../Screens/dataSaver';
import SelectField from './../SelectField';

const FunctionalTitleList = ({ onChangeFunc, value, className, providerId, disable }) => {
  const [functionalTitle, setFunctionalTitle] = useState([]);
  const [provider, setProvider] = useState([]);
  const defaultProviderId = provider?.filter(data => data?.contractedServiceProviderType === 'Physician / Doctor')?.map(data => data?.id)[0] || '';
  const selectedProvider = providerId !== '' ? providerId : defaultProviderId;
  const siteTypeId = sessionStorage.getItem('entityTypeId') || '6335e452bb13e2088b208b99'
  console.log('disabled', disable)
  useEffect(() => {
    getFunctionalTitle();
  }, [selectedProvider])

  useEffect(() => {
    getProvidertypeList();
  }, [])

  const getProvidertypeList = async () => {
    await GET(`entity-service/contractedServiceProvider?siteTypeId=${siteTypeId}`)
      .then(response => {
        setProvider(response?.data);
      })
      .catch(error => {
        console.log('error', error);
      })
  }

  const getFunctionalTitle = async () => {
    await GET(`entity-service/functionalTitlesForCSPType?contractedServiceProviderTypeId=${selectedProvider}`)
      .then(response => {
        setFunctionalTitle(response?.data);
      })
      .catch(error => {
        console.log('error', error);
      })
  }

  const onSelectHandle = (id) => {
    onChangeFunc(id, functionalTitle?.filter(data => data?.id === id)?.map(data => data?.title)[0]);
  }

  return (
    <SelectField className={className} value={value} selectLabel="Select Title" valueList={disable?.length > 0 ? functionalTitle?.filter(data => !disable?.includes(data?.id))?.map(data => data?.id) : functionalTitle?.map(data => data?.id)} dataList={functionalTitle} displayList={disable?.length > 0 ? functionalTitle?.filter(data => !disable?.includes(data?.id))?.map(data => data?.title) : functionalTitle?.map(data => data?.title)} onChangeFunc={onSelectHandle} />
  )
}


export default FunctionalTitleList;
