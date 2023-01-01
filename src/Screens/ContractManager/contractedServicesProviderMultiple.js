import React, { useState, useEffect } from 'react';
import { GET, PUT, POST, TenantID } from './../dataSaver';
import EditServiceProvider from './editServiceProviderDialog';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import Table from '../../Components/TableDesign';

import style from './index.module.scss';

const ContractedServicesProviderMultiple = ({ getNewServiceProviderDialog, newServiceProviderDialog, getViewPage1, getViewPage2, getViewPage3, getCurrentPage, contractId, contractName, isEditable }) => {
  const contractID = contractId;
  const [users, setUsers] = useState([]);
  const [editServiceProviderDialog, setEditServiceProviderDialog] = useState(false);
  const [userProviderData, setUserProviderData] = useState(undefined);
  const tableHeaderValues = ['DATA STATUS', 'CONTRACT NAME', 'CONTRACTOR TYPE', 'SITE LEVEL', 'DEPT LEVEL'];

  useEffect(() => {
    if (userProviderData !== {} && userProviderData !== undefined) {
      setEditServiceProviderDialog(true);
    }
  }, [userProviderData])

  useEffect(() => {
    getUserData();
  }, [editServiceProviderDialog, newServiceProviderDialog])

  const getUserData = async () => {
    if (contractId !== '') {
      const { data: userData } = await GET(`user-management-service/user?contractID=${contractID}`);
      if (userData) {
        setUsers(userData);
      }
    }
  }

  const getEditServiceDialog = (value) => {
    setEditServiceProviderDialog(value);
  }

  const onClickFunction = (data) => {
    setUserProviderData(data);
  }

  let dataStatus = [];
  let name = [];
  let contractType = [];
  let siteLevel = [];
  let siteLevelHoverText = [];
  let deptLevel = [];
  let deptLevelHoverText = [];

  const getServiceProviderValues = () => {
    dataStatus = [];
    name = [];
    contractType = [];
    siteLevel = [];
    siteLevelHoverText = [];
    deptLevel = [];
    deptLevelHoverText = [];

    users?.map(data => {
      dataStatus.push(<TaskAltOutlinedIcon style={{ color: "#14B15A" }} />);
      name.push(`${data?.name?.firstName} ${data?.name?.lastName}`);
      contractType.push(data?.serviceProviderType?.contractedServiceProviderType || '-');
      siteLevel.push('-');
      deptLevel.push('-');
      siteLevelHoverText.push('-');
      deptLevelHoverText.push('-');
    })

    return [
      { "type": "icon", "icon": dataStatus },
      { "type": "text", "value": name, "onClickFunction": onClickFunction },
      { "type": "text", "value": contractType, "onClickFunction": onClickFunction },
      { "type": "textWithHover", "value": siteLevel, "hoverText": siteLevelHoverText, "onClickFunction": onClickFunction },
      { "type": "textWithHover", "value": deptLevel, "hoverText": deptLevelHoverText, "onClickFunction": onClickFunction },
    ];
  }

  return (
    <div className={style.cloneBlockStyle}>
      <div className={style.tableHeight}>
        <div className={style.spaceBetween}>
          <div className={`${style.extentionLableStyle} ${style.biggerFont} ${style.marginTop20} ${style.marginLeft20}`}>Contracted Service Providers:<strong className={`${style.blackText} ${style.bold} ${style.marginLeft20}`}>{users?.length || 0}</strong></div>
          {isEditable &&
            <button className={`${style.addCotractorButton} ${style.selectedColor} ${style.cursorPointer} `}
              onClick={() => { getNewServiceProviderDialog(true); getUserData(); }} >ADD CONTRACTED PROVIDER</button>
          }
        </div>
        {/* <div className={`${style.tableHeader} ${style.marginTop10}`}>
          <p className={style.multipleContractorTextWidth}>DATA STATUS</p>
          <p className={style.multipleContractorTextWidth}>CONTRACT NAME</p>
          <p className={style.multipleContractorTextWidth}>CONTRACTOR TYPE</p>
          <p className={style.multipleContractorTextWidth}>SITE LEVEL</p>
          <p className={style.multipleContractorTextWidth}>DEPT LEVEL</p>
        </div>
        <>
          {
            users?.length !== 0 ? users?.map(data => (
              <div className={`${style.tableData} ${style.displayInRow}`} onClick={() => { setUserProviderData(data) }}>
                <div className={`${style.multipleDataTextWidth}`}></div>
                <p className={style.multipleDataTextWidth}>{`${data?.name?.firstName} ${data?.name?.lastName}`}</p>
                <p className={style.multipleDataTextWidth}>{data?.serviceProviderType?.contractedServiceProviderType || '-'} </p>
                <p className={style.multipleDataTextWidth}>-</p>
                <p className={style.multipleDataTextWidth}>-</p>
              </div>
            ))
              : <p>No Service Provider Found</p>
          }
        </> */}
        <Table
          tableHeaderValues={tableHeaderValues}
          tableDataValues={getServiceProviderValues()}
          tableData={users}
          gridStyle={style.multipleServiceProviderGrid}
        />
      </div>
      {isEditable &&
        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
          <button className={`${style.newContractButtonStyle}`} onClick={() => { getCurrentPage('Contract ID & Term Limit') }}>BACK</button>
          <div className={`${style.floatRight}`}>
            <button className={`${style.newContractButtonStyle} ${style.marginLeft20}`} onClick={() => { { getViewPage2(true) }; getViewPage1(false); getCurrentPage('Contractor Business Entity') }}>CONTINUE</button>
          </div>
        </div>
      }
      {editServiceProviderDialog && (
        <EditServiceProvider getEditServiceDialog={getEditServiceDialog} userProviderData={userProviderData} contractId={contractId} isEditable={isEditable} />
      )}
    </div>
  )
}

export default ContractedServicesProviderMultiple;
