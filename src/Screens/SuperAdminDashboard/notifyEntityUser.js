import React, { useState } from "react";
import { InputGroup, Icon } from "@blueprintjs/core";
import axios from "axios";
import { Auth } from "./../../utils/auth";
import { TenantID, GET } from "./../dataSaver";

import style from "./index.module.scss";

const NotifyEntityUser = () => {
  const [userId, setUserId] = useState("");

    const notifyFunction = async () => {
        await axios(`http://ec2-34-230-167-131.compute-1.amazonaws.com:8010/user-management-service/user/${userId}/notifyEntityUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-tenantID': TenantID,
                'X-Authorization': `Bearer ${Auth()}`,
                'userId': userId
            },
        }).then(response => {
            console.log('Notified Successfully')
        }).catch(error => {
            console.log('error', error);
        })
    }

  return (
    <div>
      <InputGroup
        type="text"
        placeholder="Enter User Id"
        value={userId}
        className={`${style.marginLeft50} ${style.marginTop10} ${style.twoFieldWidth}`}
        onChange={(e) => {
          setUserId(e.target.value);
        }}
      />
      <button
        className={`${style.loginButton} ${style.marginTop30} ${style.twoFieldWidth}`}
        onClick={notifyFunction}
      >
        Notify User
      </button>
    </div>
  );
};
export default NotifyEntityUser;
