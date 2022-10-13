import React, { useState, useEffect } from 'react';
import { GET } from './../dataSaver';
import Tile from '../../Components/Tile';
import Table from '../../Components/TableDesign';

import style from './index.module.scss';
import SearchBar from '../../Components/SearchBar';
import LevelTwoHeader from '../../Components/LevelTwoHeader';

const RegisteredUsers = ({getSelectedOption}) => {
    const [viewRegistered, setViewRegistered] = useState(true);
    const [selectedOption, setSelectedOption] = useState('ENTITY REGISTERED USERS');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const entityTableHeaderValues = ["", "USER NAME", "TITLE", "PROXY", "SURROGATE", "LAST LOGIN DATE/TIME", "AVG LOGIN PER DAY", "AVG DURATION PER LOGIN (MIN)", "ACTION"];
    const deactivatedTableHeaderValues = ["", "USER NAME", "TITLE", "SITE NAME", "DEPARTMENT", "LAST LOGIN DATE/TIME", "DEACTIVATED DATE/TIME", "DEACTIVATED BY", "ACTION"];
    const invitedTableHeaderValues = ["", "USER NAME", "USER AFFILIATION", "TITLE", "SITE NAME", "DEPARTMENT", "INVITED DATE/TIME", "INVITED BY", "ACTION"];

    const tableHeaderValues = (selectedOption === 'ENTITY REGISTERED USERS' || selectedOption === "CONTRACTED SERVICE PROVIDER USERS")
    ? entityTableHeaderValues : selectedOption === "DEACTIVATED USERS" ? deactivatedTableHeaderValues 
    : invitedTableHeaderValues;

    const valuesToUse = viewRegistered ? registeredUsers : blockedUsers;

    useEffect(()=>{
        getUser();
    },[])
  
    const getUser = async() => {
        const {data: user} = await GET('user-management-service/user');
        setRegisteredUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
        setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
    };

    const togglePin = () => {

    }

    const getSelectedOptionLevelTwo = (value) => {
        setSelectedOption(value)
    }

    const onCloseLevel2 = () => {
        getSelectedOption('');
    }

    let dot = [];
    let userName = [];
    let title = [];
    let proxy = [];
    let surrogate = [];
    let lastLoginDateOrTime = [];
    let avgLoginPerDay = [];
    let angDurationPerLogin = [];
    let action = [];

    const getValues = () => {
         dot = [];
         userName = [];
         title = [];
         proxy = [];
         surrogate = [];
         lastLoginDateOrTime = [];
         avgLoginPerDay = [];
         angDurationPerLogin = [];
         action = [];

         valuesToUse?.map(data=> 
        {
            dot.push('dot');
            userName.push(`${data?.name?.firstName} ${data?.name?.lastName}`);
            title.push(data?.title?.title);
            proxy.push('2');
            surrogate.push('-');
            lastLoginDateOrTime.push('07/19/2019 00:23 AM EST');
            avgLoginPerDay.push('0.32');
            angDurationPerLogin.push('3');
            action.push(true);
        })

        return [
            {"type": "dot", "value": dot},
            {"type": "text", "value": userName},
            {"type": "text", "value": title},
            {"type": "countWithHover", "value": proxy},
            {"type": "textWithHover", "value": surrogate},
            {"type": "text", "value": lastLoginDateOrTime},
            {"type": "text", "value": avgLoginPerDay},
            {"type": "text", "value": angDurationPerLogin},
            {"type": "action", "value": action},
        ];
    }

    const actionsData = [{'data': 'Modify', 'onClick': togglePin, 'requiredValue': 'boolean'},
                        {'data': 'Deactivate', 'onClick': togglePin, 'requiredValue': 'boolean'},
                        {'data': 'Block', 'onClick': togglePin, 'requiredValue': 'boolean'},
                        {'data': 'Assign Proxy', 'onClick': togglePin, 'requiredValue': 'boolean'},
                        {'data': 'Assign Surrogate', 'onClick': togglePin, 'requiredValue': 'boolean'}
    ]

    return(
        <div>  
            <LevelTwoHeader heading={'REGISTERED USER MANAGEMENT'} updatedTime={''} onCloseLevel2={onCloseLevel2} />
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="ENTITY REGISTERED USERS" bigNumber={55} smallNum1={5} smallNum2={5} smallText1="NEW" smallText2="BLOCKED" currentTile="ENTITY REGISTERED USERS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="CONTRACTED SERVICE PROVIDER USERS" bigNumber={21} smallNum1={5} smallNum2={5} smallText1="NEW" smallText2="BLOCKED" currentTile="CONTRACTED SERVICE PROVIDER USERS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="DEACTIVATED USERS" bigNumber={2} smallNum1="" smallNum2={1} smallText2="LAST 7 DAYS" currentTile="DEACTIVATED USERS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="INVITED USERS" bigNumber={1} smallNum1="" smallNum2={1} smallText2="PAST DUE" currentTile="INVITED USERS" topText='' />
            </div>
            <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                {/* <div className={style.spaceBetween}> */}
                    <div className={style.buttonGroupUsers}>
                        <button className={viewRegistered && style.activeButton} onClick={() => setViewRegistered(true)}>Registered ( {registeredUsers?.length} )</button>
                        <button className={!viewRegistered ? style.activeButton : style.red} onClick={() => setViewRegistered(false)}>Blocked ( {blockedUsers?.length} )</button>
                    </div>
                    {/* <SearchBar /> */}
                {/* </div> */}
                <Table
                    tableHeaderValues={tableHeaderValues} 
                    tableDataValues={getValues()}
                    tableData={valuesToUse}
                    gridStyle={style.registeredUsersGrid}
                    actions={actionsData}
                />
            </div>
        </div>
    )
}

export default RegisteredUsers;