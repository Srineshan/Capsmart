import React, { useState, useEffect } from 'react';
import { GET, PUT } from './../dataSaver';
import Tile from '../../Components/Tile';
import Table from '../../Components/TableDesign';
import {format, startOfWeek, endOfWeek} from 'date-fns';
// import SearchBar from '../../Components/SearchBar';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import LevelTwoHeader from '../../Components/LevelTwoHeader';

import style from './index.module.scss';

const RegisteredUsers = ({getSelectedOption}) => {
    const [viewRegistered, setViewRegistered] = useState(true);
    const [selectedOption, setSelectedOption] = useState('ENTITY REGISTERED USERS');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [contractedServiceProviderUsers, setContractedServiceProviderUsers] = useState([]);
    const [deactivatedUsers, setDeactivatedUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [from, setFrom] = useState(startOfWeek(new Date()));
    const [to, setTo] = useState(endOfWeek(new Date()));
    const entityTableHeaderValues = ["", "USER NAME", "TITLE", "PROXY", "SURROGATE", "LAST LOGIN DATE/TIME", "AVG LOGIN PER DAY", "AVG DURATION PER LOGIN (MIN)", "ACTION"];
    const deactivatedTableHeaderValues = ["", "USER NAME", "TITLE", "SITE NAME", "DEPARTMENT", "LAST LOGIN DATE/TIME", "DEACTIVATED DATE/TIME", "DEACTIVATED BY", "ACTION"];
    const invitedTableHeaderValues = ["", "USER NAME", "USER AFFILIATION", "TITLE", "SITE NAME", "DEPARTMENT", "INVITED DATE/TIME", "INVITED BY", "ACTION"];

    const tableHeaderValues = (selectedOption === 'ENTITY REGISTERED USERS' || selectedOption === "CONTRACTED SERVICE PROVIDER USERS")
    ? entityTableHeaderValues : selectedOption === "DEACTIVATED USERS" ? deactivatedTableHeaderValues 
    : invitedTableHeaderValues;

    const valuesToUse = viewRegistered ? (selectedOption === 'ENTITY REGISTERED USERS' ? registeredUsers :  selectedOption === 'CONTRACTED SERVICE PROVIDER USERS' ? contractedServiceProviderUsers :  selectedOption === 'DEACTIVATED USERS' ? deactivatedUsers  : invitedUsers)  : blockedUsers;

    useEffect(()=>{
        getUser();
    },[selectedOption]);

    useEffect(() => {
        userTileValues();
    }, [from, to]);
  
    const getUser = async() => {
        if(selectedOption === 'ENTITY REGISTERED USERS'){
            const {data: user} = await GET(`user-management-service/user?userType=REGISTERED_USER`);
            setRegisteredUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if(selectedOption === 'CONTRACTED SERVICE PROVIDER USERS'){
            const {data: user} = await GET(`user-management-service/user?userType=CONTRACTED_SERVICE_PROVIDER_USER`);
            setContractedServiceProviderUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if(selectedOption === 'DEACTIVATED USERS'){
            const {data: user} = await GET(`user-management-service/user?activated=false`);
            setDeactivatedUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if(selectedOption === 'INVITED USERS'){
            const {data: user} = await GET(`user-management-service/user?invited=true`);
            console.log(user)
            setInvitedUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
    };

    const userTileValues = async() => {
        const {data: user} = await GET(`user-management-service/user/metadata?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}`);
        setUserMetadata(user);
    }

    const togglePin = () => {

    }

    const getSelectedOptionLevelTwo = (value) => {
        setSelectedOption(value)
    }

    const onCloseLevel2 = () => {
        getSelectedOption('');
    }

    const getFrom = (value) => {
        setFrom(value);
    }

    const getTo = (value) => {
        setTo(value);
    }

    const handleBlock = async(data) => {
        await PUT(`user/${data?.id}/BLOCK`)
        .then(response=>{
            SuccessToaster('User Blocked Successfully');
        })
        .catch(error=>{
            ErrorToaster('Unexpected Error Occured');
        })
    }

    const handleDeactivate = async(data) => {
        await PUT(`user/${data?.id}/DEACTIVATE`)
        .then(response=>{
            SuccessToaster('User Deactivated Successfully');
        })
        .catch(error=>{
            ErrorToaster('Unexpected Error Occured');
        })
    }

    const handleReactivate = async(data) => {
        await PUT(`user/${data?.id}/REACTIVATE`)
        .then(response=>{
            SuccessToaster('User Reactivated Successfully');
        })
        .catch(error=>{
            ErrorToaster('Unexpected Error Occured');
        })
    }

    const handleUnBlock = async(data) => {
        await PUT(`user/${data?.id}/UNBLOCK`)
        .then(response=>{
            SuccessToaster('User UnBlocked Successfully');
        })
        .catch(error=>{
            ErrorToaster('Unexpected Error Occured');
        })
    }

    let dot = [];
    let userName = [];
    let title = [];
    let proxy = [];
    let siteName = [];
    let department = [];
    let surrogate = [];
    let lastLoginDateOrTime = [];
    let avgLoginPerDay = [];
    let angDurationPerLogin = [];
    let deactivatedDateOrTime = [];
    let deactivatedBy = [];
    let action = [];

    const getValues = () => {
         dot = [];
         userName = [];
         title = [];
         proxy = [];
         siteName = [];
         department = [];
         surrogate = [];
         lastLoginDateOrTime = [];
         avgLoginPerDay = [];
         angDurationPerLogin = [];
         deactivatedDateOrTime = [];
         deactivatedBy = [];
         action = [];

         valuesToUse?.map(data=> 
        {
            dot.push('dot');
            userName.push(`${data?.name?.firstName} ${data?.name?.lastName}`);
            title.push(data?.title?.title);
            proxy.push('-');
            surrogate.push('-');
            lastLoginDateOrTime.push(data?.lastLogin !== null ? format(new Date(data?.lastLogin), 'MM-dd-yyyy HH:mm') : '-');
            avgLoginPerDay.push(data?.avgLoginCount);
            angDurationPerLogin.push(data?.avgLoginSession?.milliseconds);
            deactivatedDateOrTime.push(data?.userBlockedOrDeactivatedDate !== null ? format(new Date(data?.userBlockedOrDeactivatedDate), 'MM-dd-yyyy HH:mm') : '-');
            deactivatedBy.push('-');
            action.push(true);
        })

        return (selectedOption === 'ENTITY REGISTERED USERS' || selectedOption === 'CONTRACTED SERVICE PROVIDER USERS') ? [
            {"type": "dot", "value": dot},
            {"type": "text", "value": userName},
            {"type": "text", "value": title},
            {"type": "countWithHover", "value": proxy},
            {"type": "textWithHover", "value": surrogate},
            {"type": "text", "value": lastLoginDateOrTime},
            {"type": "text", "value": avgLoginPerDay},
            {"type": "text", "value": angDurationPerLogin},
            {"type": "action", "value": action},
        ] : selectedOption === 'DEACTIVATED USERS' ?
        [
            {"type": "dot", "value": dot},
            {"type": "text", "value": userName},
            {"type": "text", "value": title},
            {"type": "countWithHover", "value": proxy},
            {"type": "textWithHover", "value": surrogate},
            {"type": "text", "value": lastLoginDateOrTime},
            {"type": "text", "value": deactivatedDateOrTime},
            {"type": "text", "value": deactivatedBy},
            {"type": "action", "value": action},
        ] : [
            {"type": "dot", "value": dot},
            {"type": "text", "value": userName},
            {"type": "text", "value": title},
            {"type": "countWithHover", "value": proxy},
            {"type": "textWithHover", "value": surrogate},
            {"type": "text", "value": lastLoginDateOrTime},
            {"type": "text", "value": avgLoginPerDay},
            {"type": "text", "value": angDurationPerLogin},
            {"type": "action", "value": action},
        ]
    }

    const registeredActionsData = [{'data': 'Modify', 'onClick': togglePin},
                        {'data': 'Deactivate', 'onClick': handleDeactivate},
                        {'data': 'Block', 'onClick': handleBlock},
                        {'data': 'Assign Proxy', 'onClick': togglePin},
                        {'data': 'Assign Surrogate', 'onClick': togglePin}
    ]

    const blockedActionsData = [{'data': 'Deactivate', 'onClick': handleDeactivate},
            {'data': 'UnBlock user', 'onClick': handleUnBlock}
        ]

    const deactivatedActionsData = [{'data': 'Reactivate', 'onClick': handleReactivate}]
    
    const inviteActionsData = [{'data': 'Delete', 'onClick': togglePin},
            {'data': 'Reminder', 'onClick': togglePin}
        ]

    const actionsData = ((selectedOption === 'ENTITY REGISTERED USERS' || selectedOption === 'CONTRACTED SERVICE PROVIDER USERS')) ? (!viewRegistered ? blockedActionsData : registeredActionsData) :
    selectedOption === 'DEACTIVATED USERS' ? deactivatedActionsData : inviteActionsData;
    return(
        <div>  
            <LevelTwoHeader heading={'REGISTERED USER MANAGEMENT'} updatedTime={''} onCloseLevel2={onCloseLevel2} needDateFilter={true} getFrom={getFrom} getTo={getTo} />
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="ENTITY REGISTERED USERS" bigNumber={userMetadata?.registeredUsers?.registeredUsersCount} smallNum1={userMetadata?.registeredUsers?.newRegisteredUsersCount} smallNum2={userMetadata?.registeredUsers?.blockedRegisteredUserCount} smallText1="NEW" smallText2="BLOCKED" currentTile="ENTITY REGISTERED USERS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="CONTRACTED SERVICE PROVIDER USERS" bigNumber={userMetadata?.contractedServiceProviderUsers?.contractedServiceProviderUsersCount} smallNum1={userMetadata?.contractedServiceProviderUsers?.newContractedServiceProviderUsersCount} smallNum2={userMetadata?.contractedServiceProviderUsers?.blockedContractedServiceProviderUsersCount} smallText1="NEW" smallText2="BLOCKED" currentTile="CONTRACTED SERVICE PROVIDER USERS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="DEACTIVATED USERS" bigNumber={userMetadata?.deactivatedUsers?.deactivatedUsersCount} smallNum1="" smallNum2="" currentTile="DEACTIVATED USERS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="INVITED USERS" bigNumber={userMetadata?.invitedUsers?.invitedUsers} smallNum1="" smallNum2={userMetadata?.invitedUsers?.pastDueUsers} smallText2="PAST DUE" currentTile="INVITED USERS" topText='' />
            </div>
            <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
            {(selectedOption === 'ENTITY REGISTERED USERS') ? (
                    <div className={style.buttonGroupUsers}>
                        <button className={viewRegistered && style.activeButton} onClick={() => setViewRegistered(true)}>Registered ( {registeredUsers?.length} )</button>
                        <button className={!viewRegistered ? style.activeButton : style.red} onClick={() => setViewRegistered(false)}>Blocked ( {blockedUsers?.length} )</button>
                    </div>
                ) : (selectedOption === 'CONTRACTED SERVICE PROVIDER USERS') ? (
                    <div className={style.buttonGroupUsers}>
                        <button className={viewRegistered && style.activeButton} onClick={() => setViewRegistered(true)}>Registered ( {contractedServiceProviderUsers?.length} )</button>
                        <button className={!viewRegistered ? style.activeButton : style.red} onClick={() => setViewRegistered(false)}>Blocked ( {blockedUsers?.length} )</button>
                    </div>
                ) : selectedOption === 'DEACTIVATED USERS' ?  (
                    <div className={style.buttonGroupUsers}>
                        <button className={style.activeButton} >Deactivated Users ( {deactivatedUsers?.length} )</button>
                    </div> 
                ) : (
                    <div className={style.buttonGroupUsers}>
                        <button className={style.activeButton}>Invited Users ( {invitedUsers?.length} )</button>
                    </div> 
                )}
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