import React, {useState, useEffect} from 'react';
import {GET, PUT, POST, TenantID} from './../dataSaver';
import EditServiceProvider from './editServiceProviderDialog';
import style from './index.module.scss';

const ContractedServicesProviderMultiple = ({getNewServiceProviderDialog, getViewPage1, getViewPage2, getViewPage3, getCurrentPage, contractId, contractName}) => {
  const contractID = contractId;
    const [users,setUsers] = useState([]);
    const [editServiceProviderDialog, setEditServiceProviderDialog] = useState(false);
    const [userProviderData, setUserProviderData] = useState({});

    useEffect(()=>{
      getUserData();
    },[editServiceProviderDialog])

    const getUserData = async() => {
      if(contractId !== ''){
        const {data: userData} = await GET(`user-management-service/user?contractID=${contractID}`);
        if(userData){
          setUsers(userData);
        }
      }
    }

    const getEditServiceDialog = (value) => {
      setEditServiceProviderDialog(value)
    }

    return(
        <div className={style.cloneBlockStyle}>
            <div className={style.tableHeight}>
                <div className={style.spaceBetween}>
                    <div className={`${style.extentionLableStyle} ${style.marginTop20} ${style.marginLeft20}`}>Contracted Service Providers:<strong className={`${style.blackText} ${style.bold} ${style.marginLeft20}`}>{users?.length || 0}</strong></div>
                    <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} `}
                    onClick={() => getNewServiceProviderDialog(true)} >ADD CONTRACTED PROVIDER</button>
                </div>
                <div className={`${style.tableHeader} ${style.marginTop10}`}>
                    <p className={style.multipleContractorTextWidth}>DATA STATUS</p>
                    <p className={style.multipleContractorTextWidth}>CONTRACT NAME</p>
                    <p className={style.multipleContractorTextWidth}>CONTRACTOR TYPE</p>
                    <p className={style.multipleContractorTextWidth}>SITE LEVEL</p>
                    <p className={style.multipleContractorTextWidth}>DEPT LEVEL</p>
                </div>
                <>
                {
                  users?.length !== 0 ? users?.map(data=>(
                    <div className={`${style.tableData} ${style.displayInRow}`} onClick={() => {setUserProviderData(data);setEditServiceProviderDialog(true)}}>
                        <div className={`${style.multipleDataTextWidth}`}></div>
                        <p className={style.multipleDataTextWidth}>{`${data?.name?.firstName} ${data?.name?.lastName} - ${data?.name?.suffix}`}</p>
                        <p className={style.multipleDataTextWidth}>{data?.serviceProviderType} </p>
                        <p className={style.multipleDataTextWidth}>Chief Medical Officer</p>
                        <p className={style.multipleDataTextWidth}>-</p>
                    </div>
                  ))
                  :<p>No Service Provider Found</p>
                }
                </>
            </div>
            <div className={`${style.floatRight} ${style.marginTop20}`}>
                <button className={style.newContractOutlinedButton}>SAVE IN-PROGRESS</button>
                <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={()=> {{getViewPage2 ? getViewPage3(true) : getViewPage2(true)};getViewPage1(false);getCurrentPage('Contracted Services Provider(s)')}}>CONTINUE</button>
            </div>
            {editServiceProviderDialog && (
              <EditServiceProvider getEditServiceDialog={getEditServiceDialog} userProviderData={userProviderData} contractId={contractId}/>
            )}
        </div>
    )
}

export default ContractedServicesProviderMultiple;
