import React, { useState } from 'react';
import style from './index.module.scss';
import SuperAdminDashboard from './superAdminDashboard';
import CustomerAdminDashboard from './customerAdminDashboard';

const ReferenceList = () => {
  const [adminType, setAdminType] = useState('');
  return(
    <div className={`${style.backgroundColor}`}>
      { adminType==='' ?
      <div className={style.referenceListCoverPageAlignCenter}>
        <div>
          <div className={`${style.adminRectangleBox}`} onClick={() => setAdminType('Super Admin')} >
              <div className={style.headingStyle}>SUPER ADMIN</div>
          </div>
          <div className={`${style.adminRectangleBox} ${style.marginTop30}`} onClick={() => setAdminType('Customer Admin')}>
            <div className={style.headingStyle}>CUSTOMER ADMIN</div>
          </div>
        </div>
      </div>:
        adminType==='Super Admin' ? <SuperAdminDashboard/> : <CustomerAdminDashboard />
      }

    </div>

  )
}

export default ReferenceList;
