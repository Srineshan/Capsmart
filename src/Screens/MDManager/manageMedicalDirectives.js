import React, { useState, useEffect, createRef, useCallback, useRef } from 'react';
import { Classes, Dialog } from '@blueprintjs/core';
import { GET, PUT } from './../dataSaver';
import Tile from '../../Components/Tile';
import Table from '../../Components/TableDesign';
import { format, startOfWeek, endOfWeek } from 'date-fns';
// import SearchBar from '../../Components/SearchBar';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import LevelTwoHeader from '../../Components/LevelTwoHeader';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { toPDF } from '../../Components/ConvertToPdf';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import { useReactToPrint } from "react-to-print";
import Download from '../../images/download.png'
import AddIcon from "@mui/icons-material/Add";
import style from './index.module.scss';
import DeleteConfirmation from '../../Components/DeleteConfirmation';
import AddUserInCustomerAdmin from './addUser';
import TileApplication from '../../Components/TileApplication';
import MDManagerStep1 from './step1';

const ManageMedicalDirectives = ({ getSelectedOption, setStep1, setMdFile }) => {
    const PDFRef = createRef();
    const componentRef = useRef(null);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);
    const fileInputRef = useRef(null);
    const [viewRegistered, setViewRegistered] = useState(true);
    const [selectedOption, setSelectedOption] = useState('Current Medical Directives');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [contractedServiceProviderUsers, setContractedServiceProviderUsers] = useState([]);
    const [deactivatedUsers, setDeactivatedUsers] = useState([]);
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [from, setFrom] = useState(startOfWeek(new Date()));
    const [to, setTo] = useState(endOfWeek(new Date()));
    const [userId, setUserId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [showAddNewMedicalDirectives, setShowAddNewMedicalDirectives] = useState(false);
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    let isMultiSiteEntity = sessionStorage.getItem('isMultiSiteEntity') === 'true' ? true : false;
    const entityTableHeaderValues = isMultiSiteEntity ? ["", "USER NAME", "TITLE", "SITE NAME", "PROXY", "SURROGATE", "LAST LOGIN DATE/TIME", "AVG LOGIN PER DAY", "AVG DURATION PER LOGIN (MIN)", "ACTION"] : ["", "USER NAME", "TITLE", "PROXY", "SURROGATE", "LAST LOGIN DATE/TIME", "AVG LOGIN PER DAY", "ACTION"];
    const deactivatedTableHeaderValues = ["", "USER NAME", "TITLE", "SITE NAME", "DEPARTMENT", "LAST LOGIN DATE/TIME", "DEACTIVATED DATE/TIME", "DEACTIVATED BY", "ACTION"];
    const invitedTableHeaderValues = ["", "USER NAME", "USER AFFILIATION", "TITLE", "SITE NAME", "DEPARTMENT", "INVITED DATE/TIME", "INVITED BY", "ACTION"];

    const tableHeaderValues = (selectedOption === 'Current Medical Directives' || selectedOption === "Draft Medical Directives")
        ? entityTableHeaderValues : selectedOption === "Medical Directives Revisions" ? deactivatedTableHeaderValues
            : invitedTableHeaderValues;

    const valuesToUse = viewRegistered ? (selectedOption === 'Current Medical Directives' ? registeredUsers : selectedOption === 'Draft Medical Directives' ? contractedServiceProviderUsers : selectedOption === 'Medical Directives Revisions' ? deactivatedUsers : invitedUsers) : blockedUsers;

    useEffect(() => {
        getUser();
    }, [selectedOption, showAddUserDialog]);

    useEffect(() => {
        userTileValues();
    }, [from, to, showAddUserDialog]);

    const getUser = async () => {
        if (selectedOption === 'Current Medical Directives') {
            const { data: user } = await GET(`user-management-service/user?userType=REGISTERED_USER`);
            setRegisteredUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if (selectedOption === 'Draft Medical Directives') {
            const { data: user } = await GET(`user-management-service/user?userType=CONTRACTED_SERVICE_PROVIDER_USER`);
            setContractedServiceProviderUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if (selectedOption === 'Medical Directives Revisions') {
            const { data: user } = await GET(`user-management-service/user?activated=false`);
            setDeactivatedUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
        if (selectedOption === 'Attestations Outstanding') {
            const { data: user } = await GET(`user-management-service/user?invited=true`);
            setInvitedUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
            setBlockedUsers(user?.filter(data => data?.blocked === true)?.map(data => data));
        }
    };

    const userTileValues = async () => {
        const { data: user } = await GET(`user-management-service/user/metadata?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}`);
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

    const getManageUserDialog = (value) => {
        setShowAddUserDialog(value);
        if (!value) {
            setIsEdit(value);
            setUserId('');
        }
    }

    const handleBlock = async (data) => {
        await PUT(`user/${data?.id}/BLOCK`)
            .then(response => {
                SuccessToaster('User Blocked Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
    }

    const handleDeactivate = async (data) => {
        await PUT(`user/${data?.id}/DEACTIVATE`)
            .then(response => {
                SuccessToaster('User Deactivated Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
    }

    const handleReactivate = async (data) => {
        await PUT(`user/${data?.id}/REACTIVATE`)
            .then(response => {
                SuccessToaster('User Reactivated Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
    }

    const handleUnBlock = async (data) => {
        await PUT(`user/${data?.id}/UNBLOCK`)
            .then(response => {
                SuccessToaster('User UnBlocked Successfully');
                getUser();
            })
            .catch(error => {
                ErrorToaster('Unexpected Error Occured');
            })
    }

    const getShowDeleteConfirmation = (value) => {
        setShowDeleteConfirmation(value);
    }

    const getDeleteConfirmation = async (value) => {
        if (value) {
            await PUT(`user/${userId}/DELETE`)
                .then(response => {
                    SuccessToaster('User Deleted Successfully');
                    getUser();
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error Occured');
                })
        }
    }

    const handleDelete = (data) => {
        setUserId(data?.id)
        setShowDeleteConfirmation(true);
    }

    const handleModify = (data) => {
        setUserId(data?.id);
        setIsEdit(true);
        setShowAddUserDialog(true);
    }

    const millisToMinutesAndSeconds = (millis) => {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return (seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
    }

    const getDeptCount = (dept) => {
        let departmentList = [];
        let departmentCountList = [];
        dept?.map(data => {
            data?.map(innerData => {
                innerData?.departmentList?.departments?.map(department => {
                    departmentList.push(department)
                })
            })
            departmentCountList.push(departmentList?.length)
            departmentList = [];
        })
        return departmentCountList;
    }

    const getUserAffiliation = (data) => {
        if (data?.roles?.map(data => data?.roleName)?.includes('Entity Sys User') ||
            data?.roles?.map(data => data?.roleName)?.includes('Entity Sys Admin')) {
            return 'Entity Level';
        } else if (data?.roles?.map(data => data?.roleName)?.includes('Site Sys User') ||
            data?.roles?.map(data => data?.roleName)?.includes('Site Sys Admin')) {
            return 'Site Level';
        } else {
            return 'Contract';
        }
    }

    let dot = [];
    let dotTooltipValues = [];
    let userName = [];
    let userAffiliation = [];
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
    let invitedDateOrTime = [];
    let invitedBy = [];
    let action = [];

    const getValues = () => {
        dot = [];
        dotTooltipValues = [];
        userName = [];
        userAffiliation = [];
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
        invitedDateOrTime = [];
        invitedBy = [];
        action = [];

        valuesToUse?.map(data => {
            dot.push(data?.activated ? 'green' : 'grey');
            dotTooltipValues.push(data?.activated ? 'Activated' : 'Deactivated');
            userName.push(`${data?.name?.firstName} ${data?.name?.lastName}`);
            userAffiliation.push(getUserAffiliation(data));
            title.push(data?.sites !== null ? data?.sites?.sites?.[0]?.siteResponsibility?.title : '-');
            proxy.push('-');
            surrogate.push('-');
            siteName.push(data?.sites?.sites ? data?.sites?.sites : []);
            department.push(data?.sites?.sites ? data?.sites?.sites : []);
            lastLoginDateOrTime.push(data?.lastLogin !== null ? format(new Date(data?.lastLogin), 'MM-dd-yyyy HH:mm') : '-');
            avgLoginPerDay.push(data?.avgLoginCount);
            angDurationPerLogin.push(data?.avgLoginSession !== null ? millisToMinutesAndSeconds(data?.avgLoginSession?.milliseconds) : '0:00');
            deactivatedDateOrTime.push(data?.userBlockedOrDeactivatedDate !== null ? format(new Date(data?.userBlockedOrDeactivatedDate), 'MM-dd-yyyy HH:mm') : '-');
            deactivatedBy.push(data?.deactivatedBy !== null ? data?.deactivatedBy?.name : '-');
            invitedDateOrTime.push(data?.userCreatedDate !== null ? format(new Date(data?.userCreatedDate), 'MM-dd-yyyy HH:mm') : '-');
            invitedBy.push(data?.invitedBy !== null ? data?.invitedBy?.name : '-');
            action.push(true);
        })

        return (selectedOption === 'Current Medical Directives' || selectedOption === 'Draft Medical Directives') ? [
            { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
            { "type": "text", "value": userName },
            { "type": "text", "value": title },
            ...(isMultiSiteEntity ? [{ "type": "site", "value": siteName }] : []),
            { "type": "text", "value": proxy },
            { "type": "text", "value": surrogate },
            { "type": "text", "value": lastLoginDateOrTime },
            { "type": "text", "value": avgLoginPerDay },
            // { "type": "text", "value": angDurationPerLogin },
            { "type": "action", "value": action },
        ] : selectedOption === 'Medical Directives Revisions' ?
            [
                { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
                { "type": "text", "value": userName },
                { "type": "text", "value": title },
                { "type": "site", "value": siteName },
                { "type": "department", "value": department, 'count': getDeptCount(department) },
                { "type": "text", "value": lastLoginDateOrTime },
                { "type": "text", "value": deactivatedDateOrTime },
                { "type": "text", "value": deactivatedBy },
                { "type": "action", "value": action },
            ] : [
                { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
                { "type": "text", "value": userName },
                { "type": "text", "value": userAffiliation },
                { "type": "text", "value": title },
                { "type": "site", "value": siteName },
                { "type": "department", "value": department, 'count': getDeptCount(department) },
                { "type": "text", "value": invitedDateOrTime },
                { "type": "text", "value": invitedBy },
                { "type": "action", "value": action },
            ]
    }

    const registeredActionsData = [{ 'data': 'Modify', 'onClick': handleModify },
    { 'data': 'Deactivate', 'onClick': handleDeactivate },
    { 'data': 'Block', 'onClick': handleBlock },
        // {'data': 'Assign Proxy', 'onClick': togglePin},
        // {'data': 'Assign Surrogate', 'onClick': togglePin}
    ]

    const blockedActionsData = [{ 'data': 'Deactivate', 'onClick': handleDeactivate },
    { 'data': 'Unblock user', 'onClick': handleUnBlock }
    ]

    const deactivatedActionsData = [{ 'data': 'Reactivate', 'onClick': handleReactivate }]

    const inviteActionsData = [{ 'data': 'Delete', 'onClick': handleDelete },
    { 'data': 'Reminder', 'onClick': togglePin }
    ]

    const actionsData = ((selectedOption === 'Current Medical Directives' || selectedOption === 'Draft Medical Directives')) ? (!viewRegistered ? blockedActionsData : registeredActionsData) :
        selectedOption === 'Medical Directives Revisions' ? deactivatedActionsData : inviteActionsData;

    const handleDownloadClicked = () => {
        toPDF(".registeredUsers", `RegisteredUsersList_${format(new Date(), 'MM_dd_yy')}`);
    }

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: `registeredUserList_${format(new Date(), 'MM_dd_yy')}`,
        // onBeforeGetContent: handleOnBeforeGetContent,
        // onBeforePrint: handleBeforePrint,
        // onAfterPrint: handleAfterPrint,
        removeAfterPrint: true
    });

    const handleUploadFile = async (event) => {
        const file = event.target.files[0];
        console.log('Selected file:', file);
        if (file) {
            console.log('Selected file:', file);
            setMdFile(file)
            setShowAddNewMedicalDirectives(false);
            setStep1(true)
            // let fileObj = await addNewDocument(file);
        }
    };

    const handleUploadCopy = () => {
        fileInputRef.current.click();
    }
    return (
        <div>
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Current Medical Directives" bigNumber={userMetadata?.registeredUsers?.registeredUsersCount} smallNum1={userMetadata?.registeredUsers?.newRegisteredUsersCount} smallNum2={userMetadata?.registeredUsers?.blockedRegisteredUserCount} smallText1="New Directives" smallText2="Upcoming For Review" currentTile="Current Medical Directives" topText='' smallNum1Color={style.greenSmallNumber} smallNum2Color={style.yellowSmallNumber} smallNum1SelectedColor={style.greenSmallNumberSelected} smallNum2SelectedColor={style.yellowSmallNumberSelected} />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Medical Directives Revisions" bigNumber={userMetadata?.deactivatedUsers?.usersDeactivatedInSpecifiedTimePeriod} smallNum1="" smallNum2="" currentTile="Medical Directives Revisions" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Attestations Outstanding" bigNumber={userMetadata?.invitedUsers?.invitedUsers} smallNum1={0} smallNum2={userMetadata?.invitedUsers?.pastDueUsers} smallText1="Not Started" smallText2="Past Due" currentTile="Attestations Outstanding" topText='' smallNum1Color={style.redSmallNumber} smallNum1SelectedColor={style.redSmallNumberSelected} smallNum2Color={style.redSmallNumber} smallNum2SelectedColor={style.redSmallNumberSelected} />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOptionLevelTwo} tileLabel="Draft Medical Directives" bigNumber={userMetadata?.contractedServiceProviderUsers?.contractedServiceProviderUsersCount} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="Draft Medical Directives" topText='' smallNum1Color={style.greenSmallNumber} smallNum2Color={style.redSmallNumber} smallNum1SelectedColor={style.greenSmallNumberSelected} smallNum2SelectedColor={style.redSmallNumberSelected} />
            </div>
            <div
                className={`${style.spaceBetween} ${style.marginLeft30} ${style.marginTop20} `}
            >
                <div className={`${style.tabs}`}>
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Current" tileCount={userMetadata?.registeredUsers?.registeredUsersCount} currentTile="Current Medical Directives" />
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Revisions" tileCount={userMetadata?.registeredUsers?.registeredUsersCount} currentTile="Medical Directives Revisions" />
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Attestations Outstanding" tileCount={userMetadata?.registeredUsers?.registeredUsersCount} currentTile="Attestations Outstanding" />
                    <TileApplication selectedTab={selectedOption} getSelectedTab={getSelectedOptionLevelTwo} tileLabel="Draft Medical Directives" tileCount={userMetadata?.registeredUsers?.registeredUsersCount} currentTile="Draft Medical Directives" />
                </div>
                <div>
                    <button
                        className={`${style.borderNone} ${style.backgroundBlue} ${style.borderRadius5}`}
                        onClick={() => setShowAddNewMedicalDirectives(true)} // Open dialog on button click
                    >
                        <div className={` ${style.addNewButton} ${style.textColorWhite}`}>
                            <AddIcon />
                            <span> Add New</span>
                        </div>
                    </button>
                </div>
            </div>
            <div className={`${style.bigCardStyle}`}>
                {/* <div className={style.spaceBetween}>
                    <div>
                        {(selectedOption === 'Current Medical Directives') ? (
                            <div className={style.buttonGroupUsers}>
                                <button className={viewRegistered && style.activeButton} onClick={() => setViewRegistered(true)}>Registered ( {registeredUsers?.length} )</button>
                                <button className={!viewRegistered ? style.activeButton : style.red} onClick={() => setViewRegistered(false)}>Blocked ( {blockedUsers?.length} )</button>
                            </div>
                        ) : (selectedOption === 'Draft Medical Directives') ? (
                            <div className={style.buttonGroupUsers}>
                                <button className={viewRegistered && style.activeButton} onClick={() => setViewRegistered(true)}>Registered ( {contractedServiceProviderUsers?.length} )</button>
                                <button className={!viewRegistered ? style.activeButton : style.red} onClick={() => setViewRegistered(false)}>Blocked ( {blockedUsers?.length} )</button>
                            </div>
                        ) : selectedOption === 'Medical Directives Revisions' ? (
                            <div className={style.buttonGroupUsers}>
                                <button className={style.activeButton} >Deactivated Users ( {deactivatedUsers?.length} )</button>
                            </div>
                        ) : (
                            <div className={style.buttonGroupUsers}>
                                <button className={style.activeButton}>Invited Users ( {invitedUsers?.length} )</button>
                            </div>
                        )}
                    </div>
                    <div className={`${style.displayInRow} ${style.marginTop20} ${style.marginRight30} ${style.cursorPointer}`}>
                        <div className={` ${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => handleDownloadClicked()}>
                            <DownloadIcon sx={{ fontSize: 30, color: '#06617A' }} />
                        </div>
                        <div className={`${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => handlePrint()}>
                            <PrintOutlinedIcon sx={{ fontSize: 30, color: '#06617A' }} />
                        </div>
                        {selectedOption === 'Current Medical Directives' && (
                            <div className={`${style.alignCenter} ${style.cursorPointer} ${style.marginLeft20}`}>
                                <AddCircleOutlineIcon sx={{ fontSize: 30, color: '#06617A' }} onClick={() => setShowAddUserDialog(true)} />
                            </div>
                        )}
                    </div>
                </div> */}
                <div ref={componentRef} className={style.marginTop20}>
                    <div className={`${style.reduceMarginTop10} registeredUsers`} ref={PDFRef}>
                        <Table
                            tableHeaderValues={tableHeaderValues}
                            tableDataValues={getValues()}
                            tableData={valuesToUse}
                            gridStyle={selectedOption === 'Attestations Outstanding' ? style.invitedUsersGrid : isMultiSiteEntity ? (selectedOption === 'Current Medical Directives' || selectedOption === 'Draft Medical Directives') ? style.registeredUsersMultiSiteGrid : style.registeredUsersGrid : style.registeredUsersGrid}
                            actions={actionsData}
                            hidePagination={true}
                        />
                    </div>
                </div>
            </div>
            {showDeleteConfirmation && <DeleteConfirmation getShowDeleteConfirmation={getShowDeleteConfirmation} getDeleteConfirmation={getDeleteConfirmation} confirmationText="Do you want to delete this User?" />}
            {showAddUserDialog && <AddUserInCustomerAdmin getManageUserDialog={getManageUserDialog} isEdit={isEdit} userId={userId} />}
            <Dialog isOpen={showAddNewMedicalDirectives} onClose={() => setShowAddNewMedicalDirectives(false)} className={`${style.addMDDialogBackground} ${style.addNewMDDialog}`}>
                <div className={Classes.DIALOG_BODY}>
                    <div className={style.dialogTitle}>Adding New Medical Directives To Database</div>
                    <div className={`${style.dialogDesc} ${style.marginTop20}`}>Do you have an existing copy of the medical directive that you want to add to the data base?</div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadFile}
                        style={{ display: "none" }} // Hide the actual file input
                    />
                    <div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <button className={`${style.outlinedButton} `} onClick={() => setShowAddNewMedicalDirectives(false)} >NO, AUTHOR NEW</button>
                            <button className={`${style.buttonStyle} `} onClick={() => handleUploadCopy()} >YES, UPLOAD COPY</button>
                        </div>
                    </div>
                </div>
            </Dialog >
        </div>
    )
}

export default ManageMedicalDirectives;