import React, { useState, useEffect, useRef } from 'react';
import { Icon, Intent, Dialog, Classes, TextArea, InputGroup } from "@blueprintjs/core";
import { GET, TenantID, POST, PUT } from './../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { browserName, browserVersion, osName, osVersion, isMobile, isDesktop, isTablet } from "react-device-detect";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import CommonSelectField from "../../Components/CommonFields/CommonSelectField";
import DoctorAnime from './../../images/doctorAnime.png';
import Select from '@mui/material/Select';
import UserLogo from './../../images/userLogo.jpg';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import history from "../../routes/history";

import style from './index.module.scss';
import { getDaysAgo } from '../../utils/getDaysAgo';
import { currentUser } from './../../utils/auth';
import FeedbackTicketResolutionLog from './feedbackTicketResolutionLog';
import { formatInTimeZone } from 'date-fns-tz';

const FeedbackTicketResolution = ({ getShowFeedbackTicketResolution, ticketId, isEdit }) => {

    const loggedInUser = currentUser();
    const [ticketStatus, setTicketStatus] = useState(!isEdit ? 'New' : '');
    const [screenCapture, setScreenCapture] = useState('');
    const [screenCaptured, setScreenCaptured] = useState(false);
    const [type, setType] = useState('APPLICATION');
    const [impact, setImpact] = useState('HIGH');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [assignTo, setAssignTo] = useState({});
    const [assignToId, setAssignToId] = useState('');
    const [users, setUsers] = useState([]);
    const [entityAndSiteLevelUsers, setEntityAndSiteLevelUsers] = useState([]);
    const [currentUserData, setCurrentUserData] = useState([]);
    const [ticketDetails, setTicketDetails] = useState();
    const [workflowActions, setWorkflowActions] = useState();
    const [ticketName, setTicketName] = useState('');
    const [fileName, setFileName] = useState(`${currentUserData?.[0]?.id}${new Date().getTime().toString()}.png`);
    const [dateAndTime, setDateAndTime] = useState(formatInTimeZone(new Date(), 'America/New_York', 'MM-dd-yyyy HH:mm zzz'));
    const [modifiedDateAndTime, setModifiedDateAndTime] = useState(formatInTimeZone(new Date(), 'America/New_York', 'MM-dd-yyyy HH:mm zzz'));
    const [showFeedbackTicketResolutionLog, setShowFeedbackTicketResolutionLog] = useState(false);
    const [blobFormat, setBlobFormat] = useState();
    const [comment, setComment] = useState('');
    const [notes, setNotes] = useState('');
    const [allComments, setAllComments] = useState();
    const [allMessages, setAllMessages] = useState();
    const [userIdList, setUserIdList] = useState([]);
    let screenCaptureImg = sessionStorage.getItem('screenCapture');
    let fromUpload = sessionStorage.getItem('fromUpload');
    let customerName = sessionStorage.getItem('title');
    const [screenCaptureFromUpload, setScreenCaptureFromUpload] = useState('');
    const statusAvailableValues = {
        NEW: 'New',
        INPROGRESS: 'In-Progress',
        ESCALATED: 'Escalated',
        FIXINPROGRESS: 'Fix In-Progress',
        FIXINDEVELOPMENT: 'Fix In-Developement',
        ONHOLD: 'On-Hold',
        FUTURERELEASE: 'Future Release',
        FEATUREENHANCEMENT: 'Feature Enhancement',
        FIXINQA: 'Fix In QA',
        APPUPDATED: 'App Updated',
        FIXCONFIRMATION: 'Fix Confirmation',
        RESOLVED: 'resolved',
        CLOSED: 'Closed'
    };
    const workflowActionAvailableValues = {
        ASSIGNE: 'Assigne',
        ESCALATE: 'Escalate',
        ONHOLD: 'On-Hold',
        ANALYSISINPROGRESS: 'Analysis In-Progress',
        DEVINPROGRESS: 'Dev In-Progress',
        INFUTURERELEASE: 'In Future Release',
        NEWFEATURE: 'New Feature',
        TESTINGINPROGRESS: 'Testing In-Progress',
        QAAPPROVED: 'QA Approved',
        DEPLOYMENTCONFIRMED: 'Deployment Confirmed',
        DONE: 'Done'
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        setScreenCapture(screenCaptureImg);
        if (screenCaptureImg !== '' && screenCaptureImg !== null) {
            setScreenCaptured(true);
        }
    }, [screenCaptureImg]);

    useEffect(() => {
        setCurrentUserData(users?.filter(data => data?.id === loggedInUser?.id)?.map(data => data))
    }, [users]);

    useEffect(() => {
        getUserIdList();
    }, [allComments])

    useEffect(() => {
        setFileName(`${currentUserData?.[0]?.id}${new Date().getTime().toString()}.png`);
    }, [currentUserData]);

    useEffect(() => {
        getImgBlob();
    }, [screenCapture]);

    useEffect(() => {

        if (isEdit) {
            getTicketById();
            getComments();
            getCommentMessages();
        }
    }, [isEdit]);

    useEffect(() => {
        getUser();
    }, [userIdList])

    useEffect(() => {
        if (isEdit && currentUserData) {
            getCommentMessages();
        }
    }, [currentUserData])

    useEffect(() => {
        if (ticketDetails) {
            setTicketName(ticketDetails?.ticketId);
            setDateAndTime(formatInTimeZone(new Date(ticketDetails?.createdDateTime), 'America/New_York', 'MM-dd-yyyy HH:mm zzz'));
            setModifiedDateAndTime(formatInTimeZone(new Date(ticketDetails?.modifiedDateTime), 'America/New_York', 'MM-dd-yyyy HH:mm zzz'));
            setSubject(ticketDetails?.subject);
            setDescription(ticketDetails?.description);
            setType(ticketDetails?.type);
            setImpact(ticketDetails?.impact);
            setScreenCaptured(ticketDetails?.screenCaptured)
            setAssignToId(ticketDetails?.assignedTo?.id !== null ? ticketDetails?.assignedTo?.id : "");
            handleAssignTo(ticketDetails?.assignedTo?.id !== null ? ticketDetails?.assignedTo?.id : "");
            // setTicketStatus(ticketDetails?.status);
            setFileName(ticketDetails?.ticketFile?.fileName);
            setScreenCapture(ticketDetails?.ticketFile?.fileURL);
            getWorkflowActions();
        }
    }, [ticketDetails])

    const getUser = async () => {
        const { data: user } = await GET(`user-management-service/user/ListOfId?userIds=${userIdList}`);
        const { data: entityUsers } = await GET(`user-management-service/user/role?role=Entity Sys User&role=Entity Sys Admin`);
        if (user?.length !== 0) {
            setUsers(user);
        }
        setEntityAndSiteLevelUsers(entityUsers)
    };

    console.log('users', users);

    const getTicketById = async () => {
        const { data: ticket } = await GET(`feedback-management-service/ticket/${ticketId}`);
        setTicketDetails(ticket)
    };

    const getWorkflowActions = async () => {
        const { data: workflowActions } = await GET(`feedback-management-service/ticket/${ticketDetails?.status}/workFlowActions`);
        setWorkflowActions(workflowActions)
    };

    const getComments = async () => {
        const { data: comments } = await GET(`feedback-management-service/ticket_comment?ticketId=${ticketId}`);
        setAllComments(comments);
    }

    const getUserIdList = () => {
        let userId = [loggedInUser?.id];
        allComments?.map(data => {
            if (!userId?.includes(data?.commentedBy?.id)) {
                userId.push(data?.commentedBy?.id);
            }
        });
        setUserIdList(userId);
    }

    console.log('userId', userIdList);

    const getCommentMessages = async () => {
        const { data: messages } = await GET(`feedback-management-service/ticket_comment/message?userId=${currentUserData?.[0]?.id}`);
        setAllMessages(messages);
    }
    console.log('Messages', allMessages);
    const getImgBlob = async () => {
        setBlobFormat(await fetch(screenCapture).then((res) => res.blob()));
    };

    const getShowFeedbackTicketResolutionLog = (value) => {
        setShowFeedbackTicketResolutionLog(value);
    }

    const handleAssignTo = (id) => {
        setAssignTo(entityAndSiteLevelUsers?.filter(data => data?.id === id)?.map(data => data))
    }

    const handleWorkflowUpdate = async () => {
        if (notes !== '') {
            let data = { 'notes': notes };
            await PUT(`feedback-management-service/ticket/${ticketId}/${ticketStatus}`, data)
                .then(response => {
                    SuccessToaster('Workflow Updated Successfully');
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error Occured');
                })
        } else {
            ErrorToaster("Action Notes is Mandatory")
        }
    }

    const handleMandatoryFields = () => {
        if (subject === '') {
            ErrorToaster('Subject is Mandatory')
            return
        }
        if (subject === '') {
            ErrorToaster('Subject is Mandatory')
            return
        }
    }

    const handleSave = async () => {
        if (isEdit && ticketStatus !== '') {
            handleWorkflowUpdate();
        }
        let browser = browserName === 'Chrome' ? 'CHROME' :
            browserName === 'Firefox' ? 'FIREFOX' :
                browserName === 'Safari' ? 'SAFARI' :
                    browserName === 'Opera' ? 'OPERA' :
                        browserName === 'Edge' ? 'EDGE' :
                            browserName === 'Internet Explorer' ? 'INTERNETEXPLORER' :
                                browserName === 'Chromium' ? 'CHROMIUM' :
                                    browserName === 'Yandex' ? 'YANDEX' :
                                        browserName === 'IE' ? 'IE' :
                                            browserName === 'Mobile Safari' ? 'MOBILESAFARI' :
                                                browserName === 'Edge Chromium' ? 'EDGECHROMIUM' :
                                                    browserName === 'MIUI Browser' ? 'MIUIBROWSER' :
                                                        browserName === 'Samsung Browser' ? 'SAMSUNGBROWSER' : '';

        let os = osName === 'Windows' ? 'WINDOWS' :
            osName === 'Linux' ? 'LINUX' :
                osName === 'Mac OS' ? 'MAC' :
                    osName === 'iOS' ? 'IOS' :
                        osName === 'Android' ? 'ANDROID' :
                            osName === 'Windows Phone' ? 'WINDOWSPHONE' : '';

        let deviceType = isDesktop ? 'DESKTOP' : isMobile ? 'MOBILE' : isTablet ? 'TABLET' : '';
        let data = {
            ...(isEdit &&
                { 'id': ticketId }),
            "subject": subject,
            "description": description,
            "createdBy": !isEdit ? {
                "id": currentUserData?.[0]?.id,
                "name": currentUserData?.[0]?.name,
                "email": currentUserData?.[0]?.email,
                "communication": currentUserData?.[0]?.communication
            } : ticketDetails?.createdBy,
            "contractorName": isEdit ? ticketDetails?.contractorName : `${currentUserData?.[0]?.name?.firstName} ${currentUserData?.[0]?.name?.lastName}`,
            "assignedTo": {
                "id": assignTo?.[0]?.id,
                "name": assignTo?.[0]?.name,
                "email": assignTo?.[0]?.email,
                "communication": assignTo?.[0]?.communication
            },
            "type": type,
            "impact": impact,
            ...(!isEdit &&
                { "status": 'NEW' }),
            ...(isEdit &&
                { "messageCount": ticketDetails?.messageCount }),
            "bugTrackingId": "string",
            "site": {
                "id": "string",
                "siteName": {
                    "siteName": "string"
                }
            },
            "tenant": {
                "tenantId": TenantID
            },
            "ticketFile": {
                "fileName": fileName,
                ...(isEdit &&
                    { 'id': ticketDetails?.ticketFile?.id }),
                ...(isEdit &&
                    { 'filePath': ticketDetails?.ticketFile?.filePath }),
                ...(isEdit &&
                    { 'fileURL': ticketDetails?.ticketFile?.fileURL }),
            },
            "deviceDetails": {
                "browser": browser,
                "browserVersion": browserVersion,
                "os": os,
                "osVersion": osVersion,
                "componentInfo": '',
                "deviceType": deviceType,
                "screenResolution": `width: ${window.innerWidth}, height: ${window.innerHeight}`,
            },
            "generationMode": "MANUAL",
            "dueDate": "2022-10-06",
            "screenCaptured": screenCaptured,
            "externalBugTrackingSystem": true
        }

        const formData = new FormData();

        formData.append('ticketDetail', new Blob([JSON.stringify(data)], {
            type: "application/json"
        }));
        if (screenCaptured && !isEdit && screenCapture !== null && screenCapture !== '') {
            const file = new File([blobFormat], fileName);
            formData.append('ticketFile', file);
        }
        if (!isEdit) {
            await POST(`feedback-management-service/ticket`, formData)
                .then(response => {
                    SuccessToaster('Feedback Added Successfully');
                    sessionStorage.removeItem('screenCapture');
                    sessionStorage.removeItem('fromUpload');
                    getShowFeedbackTicketResolution(false);
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error Occured');
                })
        } else {
            await PUT(`feedback-management-service/ticket/${ticketId}`, formData)
                .then(response => {
                    SuccessToaster('Feedback Updated Successfully');
                    sessionStorage.removeItem('screenCapture');
                    sessionStorage.removeItem('fromUpload');
                    getShowFeedbackTicketResolution(false);
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error Occured');
                })
        }
    }

    const handleComment = async () => {
        let message = comment;
        setComment('');
        if (message !== '') {
            let data = {
                "commentedBy": {
                    "id": currentUserData?.[0]?.id,
                    "name": currentUserData?.[0]?.name,
                    "email": currentUserData?.[0]?.email,
                    "communication": currentUserData?.[0]?.communication
                },
                "comment": message,
                "ticketId": {
                    "id": ticketId
                }
            }
            await POST(`feedback-management-service/ticket_comment`, data)
                .then(response => {
                    SuccessToaster('Comment Added Successfully');
                    setComment('');
                    getComments();
                })
                .catch(error => {
                    ErrorToaster('Unexpected Error Occured');
                })
        }
    }

    const handleClose = () => {
        getShowFeedbackTicketResolution(false);
        // history.back();
        sessionStorage.removeItem('screenCapture');
        sessionStorage.removeItem('selectedOption');
        sessionStorage.removeItem('fromUpload');
    }

    const getBase64 = (file) => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL = "";
            let reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                console.log("Called", reader);
                baseURL = reader.result;
                console.log(baseURL);
                resolve(baseURL);
            };
            console.log(fileInfo);
        });
    };

    const handleFileUpload = (e) => {
        getBase64(e.target.files[0])
            .then(result => {
                console.log(result)
                setScreenCapture(result);
            })
        setScreenCaptureFromUpload(URL.createObjectURL(e.target.files[0]) || '');
        setFileName(e.target.files[0]?.name);
    }

    console.log('users', users?.map(data => data?.profilePic?.file?.fileURL));

    return (
        <>
            <Dialog isOpen={getShowFeedbackTicketResolution} onClose={() => handleClose()} className={`${style.addManagerDialogBackground} ${style.feedbackDialog}`} ref={componentRef}>
                <div className={`${Classes.DIALOG_BODY} `}>
                    <div className={style.alignRight}>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle}`} onClick={() => handleClose()} />
                    </div>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Feedback Ticket Resolution Progress</p>
                        <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} onClick={handlePrint} />

                        {/* <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.printStyle}`} onClick={() => handleClose()} /> */}
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={isEdit ? style.feedbackGrid : ''}>
                        <div>
                            <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                                <div>
                                    <p className={style.extentionLableStyle}>Ticket ID</p>
                                    <p className={style.feedbackFontStyle}>{isEdit ? ticketName : '-'}</p>
                                </div>
                                <div className={style.marginLeft}>
                                    <p className={style.extentionLableStyle}>Date & Time</p>
                                    <p className={style.feedbackFontStyle}>{dateAndTime}</p>
                                </div>
                                <div>
                                    <p className={style.extentionLableStyle}>User Name</p>
                                    <p className={style.feedbackFontStyle}>{`${loggedInUser?.firstName} ${loggedInUser?.lastName}`}</p>
                                </div>
                                <div className={style.marginLeft}>
                                    <p className={style.extentionLableStyle}>Customer</p>
                                    <p className={style.feedbackFontStyle}>{customerName}</p>
                                </div>
                                <div>
                                    <p className={style.extentionLableStyle}>Feedback SUBJECT*</p>
                                    <InputGroup value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" readOnly={ticketDetails?.generationMode === 'SYSTEM'} />
                                </div>
                                <div className={style.marginLeft}>
                                    <p className={style.extentionLableStyle}>FEEDBACK DESCRIPTION</p>
                                    <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3} className={`${style.fullWidth}`} readOnly={ticketDetails?.generationMode === 'SYSTEM'} />
                                </div>
                                {
                                    isEdit && ticketDetails?.generationMode === 'SYSTEM' && (
                                        <>
                                            <div>
                                                <p className={style.extentionLableStyle}>Feedback Trace</p>
                                                <TextArea value={ticketDetails?.exceptionDetails?.trace} onChange={(e) => setDescription(e.target.value)} placeholder="Trace" rows={3} className={`${style.fullWidth}`} readOnly={ticketDetails?.generationMode === 'SYSTEM'} />
                                            </div>
                                            <div className={style.marginLeft}>
                                                <p className={style.extentionLableStyle}>Feedback Message</p>
                                                <TextArea value={ticketDetails?.exceptionDetails?.message} onChange={(e) => setDescription(e.target.value)} placeholder="Message" rows={3} className={`${style.fullWidth}`} readOnly={ticketDetails?.generationMode === 'SYSTEM'} />
                                            </div>
                                        </>
                                    )
                                }

                            </div>
                            <div className={`${style.extensionBorder} ${style.marginTop20}`}></div>
                            <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                                <div>
                                    <p className={style.extentionLableStyle}>Feedback TYPE</p>
                                    <FormControl sx={{ maxWidth: 180 }} className={style.reduceMarginTop} size="small">
                                        <Select
                                            readOnly={ticketDetails?.generationMode === 'SYSTEM'}
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={type}
                                            className={style.selectFontStyle}
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                            <MenuItem value={'APPLICATION'}>Application</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className={style.twoCol}>
                                    <div>
                                        <p className={style.extentionLableStyle}>Work impact</p>
                                        <FormControl sx={{ maxWidth: 180 }} className={style.reduceMarginTop} size="small">
                                            <Select
                                                // readOnly={ticketDetails?.generationMode === 'SYSTEM'}
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={impact}
                                                className={style.selectFontStyle}
                                                onChange={(e) => setImpact(e.target.value)}
                                            >
                                                <MenuItem value={'HIGH'}>High</MenuItem>
                                                <MenuItem value={'MEDIUM'}>Medium</MenuItem>
                                                <MenuItem value={'LOW'}>Low</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <p className={style.extentionLableStyle}>SCREEN CAPTURE</p>
                                        <FormControlLabel
                                            control={
                                                <Switch checked={screenCaptured} size="small" onChange={(e) => { ticketDetails?.generationMode !== 'SYSTEM' && setScreenCaptured(e.target.checked) }} disabled={(screenCaptureImg !== '' && screenCaptureImg !== null) ? false : true} />
                                            }
                                            className={`${style.switchFontStyle}`}
                                            label={screenCaptured ? 'YES' : 'NO'}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.extensionBorder} ${style.marginTop20}`}></div>
                            <div className={style.marginTop20}>
                                <p className={style.extentionLableStyle}>SCREEN CAPTURE</p>
                            </div>
                            <div className={style.dashedBorder}>
                                <div className={`${style.imageDisplayStyle} ${style.alignCenter}`}>
                                    {!screenCaptured ? (
                                        <>
                                            <label htmlFor="file-upload-help" className={`${style.uploadButton} ${style.alignCenter}`}>
                                                UPLOAD
                                            </label>
                                            <input id="file-upload-help" type="file" onChange={(e) => handleFileUpload(e)} />
                                        </>
                                    ) : (screenCapture !== null) ? (
                                        <img src={!fromUpload ? screenCapture : screenCaptureFromUpload} alt='Screen shot' className={style.screenCaptureImgStyle} />
                                    ) : (
                                        <>
                                            <label htmlFor="file-upload-help" className={`${style.uploadButton} ${style.alignCenter}`}>
                                                UPLOAD
                                            </label>
                                            <input id="file-upload-help" type="file" onChange={(e) => handleFileUpload(e)} />
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* {isEdit && (
                                <>
                                    <div className={`${style.collapseHeader} ${style.marginTop20} ${style.spaceBetween}`}>
                                        <p className={style.collapseHeaderText}>Log File Reference</p>
                                        <div className={style.reduceTop10}>
                                            <Icon icon={ticketStatus !== "Resolved" ? "chevron-up" : "chevron-down"} color='#7165E3' className={style.marginLeft20} />
                                        </div>
                                    </div>
                                    {ticketStatus !== "Resolved" && (
                                        <div className={style.collapseBody2}>
                                            <div className={style.spaceBetween}>
                                                <div className={`${style.displayInRow}`}>
                                                    <div className={style.logFileBlueDot}></div>
                                                    <div className={style.marginLeft20}>
                                                        <div>Login</div>
                                                        <div>userId sia@sureshield.com</div>
                                                    </div>
                                                </div>
                                                <div className={style.extentionLableStyle}>JAN 12, 2022<br />07:35 PST</div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )} */}
                        </div>
                        <div className={style.spaceBetweenColumn}>
                            <div>
                                {isEdit && (
                                    <>
                                        <div className={`${style.collapseHeader} ${style.marginTop20} ${style.spaceBetween}`}>
                                            <div className={style.displayInRow}>
                                                <p className={style.collapseHeaderText}>Ticket Status</p>
                                                <div className={`${ticketStatus !== 'In-Progress' ? style.greenDotFeedbackStyle : style.orageDotFeedbackStyle} ${style.marginLeft20}`}></div>
                                            </div>
                                            <div className={style.displayInRow}>
                                                <p className={style.feedbackFontStyle}>Updated On {modifiedDateAndTime}</p>
                                                <Icon icon="chevron-up" color='#7165E3' className={style.marginLeft20} />
                                            </div>
                                        </div>
                                        <div className={style.collapseBody}>
                                            <div className={`${style.extentionGrid}`}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Assign To</div>
                                                <div className={style.displayInRow}>
                                                    {/* <select
                                                        name="class"
                                                        id="Class"
                                                        value={assignToId}
                                                        onChange={(e) => { setAssignToId(e.target.value); handleAssignTo(e.target.value) }}
                                                        className={`${style.fieldWidth2InARow} ${style.transparentBackground}`}>
                                                        <option value="" >
                                                            Select Assignee
                                                        </option>
                                                        {entityAndSiteLevelUsers?.map((data, index) => (
                                                            <option value={data?.id} >
                                                                {`${data?.name?.firstName} ${data?.name?.lastName}`}
                                                            </option>
                                                        ))}
                                                    </select> */}
                                                    <CommonSelectField
                                                        value={assignToId}
                                                        onChange={(e) => { setAssignToId(e.target.value); handleAssignTo(e.target.value) }}
                                                        className={`${style.fieldWidth2InARow}`}
                                                        firstOptionLabel={
                                                            "Select Assignee"
                                                        }
                                                        firstOptionValue={""}
                                                        valueList={entityAndSiteLevelUsers?.map((data) => data?.id)}
                                                        labelList={entityAndSiteLevelUsers?.map((data) => `${data?.name?.firstName} ${data?.name?.lastName}`)}
                                                        disabledList={entityAndSiteLevelUsers?.map((data) => false)}
                                                    />
                                                </div>
                                            </div>
                                            <>
                                                {(assignToId !== '' && assignToId !== null) && (
                                                    <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                        <div></div>
                                                        <div>{entityAndSiteLevelUsers?.filter(data => data?.id === assignToId)[0]?.email?.officialEmail}  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span> {entityAndSiteLevelUsers?.filter(data => data?.id === assignToId)[0]?.communication?.mobileNumber !== '' ? entityAndSiteLevelUsers?.filter(data => data?.id === assignToId)[0]?.communication?.mobileNumber : '-'}</div>
                                                    </div>
                                                )}
                                                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                    <div className={`${style.extentionLableStyle}`}>Contractor</div>
                                                    <div>
                                                        <div>{`${currentUserData?.[0]?.name?.firstName} ${currentUserData?.[0]?.name?.lastName}`}</div>
                                                        <div>{currentUserData?.[0]?.email?.officialEmail}  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span>  {currentUserData?.[0]?.communication?.mobileNumber !== '' ? currentUserData?.[0]?.communication?.mobileNumber : '-'}</div>
                                                    </div>
                                                </div>
                                                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                    <div className={`${style.extentionLableStyle}`}>Status</div>
                                                    <div>
                                                        <div>{statusAvailableValues[ticketDetails?.status]}</div>
                                                    </div>
                                                </div>
                                            </>
                                            <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Action</div>
                                                <div className={style.displayInRow}>
                                                    {/* <select
                                                        name="class"
                                                        id="Class"
                                                        value={ticketStatus}
                                                        onChange={(e) => setTicketStatus(e.target.value)}
                                                        className={`${style.fieldWidth2InARow} ${style.transparentBackground}`}>
                                                        {ticketDetails?.status === 'NEW' && (
                                                            <option value="NEW" >
                                                                New
                                                            </option>
                                                        )}
                                                        {(ticketDetails?.status === 'NEW' || ticketDetails?.status === 'INPROGRESS') && (
                                                            <option value="INPROGRESS" >
                                                                In-Progress
                                                            </option>
                                                        )}
                                                        {(ticketDetails?.status === 'NEW' || ticketDetails?.status === 'INPROGRESS' || ticketDetails?.status === 'ESCALATE') && (
                                                            <option value="ESCALATE" >
                                                                Escalate
                                                            </option>
                                                        )}
                                                        {(ticketDetails?.status === 'NEW' || ticketDetails?.status === 'INPROGRESS' || ticketDetails?.status === 'ESCALATE' || ticketDetails?.status === 'RESOLVED' || ticketDetails?.status === 'CLOSED') && (
                                                            <option value="RESOLVED" >
                                                                Resolved
                                                            </option>
                                                        )}
                                                        {(ticketDetails?.status === 'NEW' || ticketDetails?.status === 'INPROGRESS' || ticketDetails?.status === 'ESCALATE' || ticketDetails?.status === 'RESOLVED' || ticketDetails?.status === 'CLOSED') && (
                                                            <option value="CLOSED" >
                                                                Closed
                                                            </option>
                                                        )}
                                                    </select> */}
                                                    <CommonSelectField
                                                        value={ticketStatus}
                                                        onChange={(e) => setTicketStatus(e.target.value)}
                                                        className={`${style.fieldWidth2InARow}`}
                                                        firstOptionLabel={
                                                            "Select Status"
                                                        }
                                                        firstOptionValue={""}
                                                        valueList={workflowActions}
                                                        labelList={workflowActions?.map((data) => workflowActionAvailableValues[data])}
                                                        disabledList={workflowActions?.map((data) => false)}
                                                    />
                                                </div>
                                            </div>
                                            <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Action Notes</div>
                                                <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Action Notes" rows={3} className={`${style.fullWidth} ${style.transparentBackground} ${style.transparentNotesBorder}`} />
                                            </div>
                                            {/* {ticketStatus === 'INPROGRESS' && (
                                            <>
                                                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                    <div></div>
                                                    <div>sanjaya@timesmart.ai  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span> 987 8767646</div>
                                                </div>
                                                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                    <div className={`${style.extentionLableStyle}`}>Contractor</div>
                                                    <div>
                                                        <div>Philipp Stevens</div>
                                                        <div>pstev_msp@metropoli.ai  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span>  987 8767646</div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {ticketStatus === 'RESOLVED' && (
                                            <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                                <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Status Resolve Note*</div>
                                                <TextArea placeholder='add status change note...' rows="4" className={style.statusResolvedTextarea} />
                                            </div>
                                        )}
                                        {ticketStatus !== 'INPROGRESS' && (
                                            <div className={`${style.twoCol} ${style.marginTop10}`}>
                                                <div className={`${style.extentionGrid}`}>
                                                    <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Jira Ticket</div>
                                                    <div className={style.displayInRow}>
                                                        <FormControlLabel
                                                            control={
                                                                <Switch checked={true} size="small" />
                                                            }
                                                            className={`${style.switchFontStyle}`}
                                                            label={'YES'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={`${style.extentionGrid}`}>
                                                    <div className={`${style.extentionLableStyle} ${style.marginTop20}`}>Jira Id</div>
                                                    <div className={style.displayInRow}>
                                                        <div className={`${style.feedbackFontStyle} ${style.marginTop15}`}>JTKT00023</div>
                                                        <div className={`${style.orageDotFeedbackStyle} ${style.marginLeft20} ${style.marginTop20}`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )} */}
                                            <div className={`${style.resolutionProgressCard} ${style.spaceBetween} ${style.verticalAlignCenter} ${style.marginTop20} ${style.cursorPointer}`} onClick={() => setShowFeedbackTicketResolutionLog(true)}>
                                                <div className={`${style.resolutionProgressTextStyle} ${style.marginLeft20}`}>Track Resolution Progress</div>

                                            </div>
                                        </div>
                                        {isEdit && (
                                            <>
                                                <div className={`${style.collapseHeader} ${style.marginTop20} ${style.spaceBetween}`}>
                                                    {ticketStatus !== 'INPROGRESS' ? (
                                                        <>
                                                            <p className={style.collapseHeaderText}>Comments</p>
                                                            <div className={style.reduceTop10}>
                                                                <Icon icon="chevron-up" color='#7165E3' className={style.marginLeft20} />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className={style.collapseHeaderText}>Resolution Comments</p>
                                                            <div className={style.displayInRow}>
                                                                <p className={style.collapseHeaderText}>1 Unread</p>
                                                                <Icon icon="chevron-up" color='#7165E3' className={style.marginLeft20} />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className={style.collapseBody}>
                                                    {allComments?.map((data, index) => (
                                                        <div>
                                                            <div className={style.commentGrid}>
                                                                <div>
                                                                    {(index === 0 || allComments[index - 1]?.commentedBy?.id !== data?.commentedBy?.id) && (
                                                                        <img src={users?.filter(user => user?.id === data?.commentedBy?.id)?.map(user => user?.profilePic?.file?.fileURL)[0] || DoctorAnime} alt="logo" className={style.userLogo} />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    {(index === 0 || allComments[index - 1]?.commentedBy?.id !== data?.commentedBy?.id) && (
                                                                        <div className={style.marginLeft20}>
                                                                            <div className={`${style.displayInRow} ${style.marginTop10} ${style.commentTextStyle}`}>{data?.commentedBy?.name?.firstName} {data?.commentedBy?.name?.lastName}<span className={`${style.blue} ${style.marginLeft20}`}> {data?.commentedBy?.name?.suffix?.suffix}</span> <span className={`${style.greyText} ${style.marginLeft20}`}>{getDaysAgo(new Date(data?.createdDateTime))}</span> </div>
                                                                        </div>
                                                                    )}
                                                                    <div className={`${style.marginTop10} ${style.marginLeft20} ${style.commentTextStyle}`}>{data?.comment}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <TextArea placeholder='reply here...' value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className={`${style.fullWidth} ${style.marginTop10}`} />
                                                    <div className={`${style.alignRight} ${style.marginTop10}`}>
                                                        <button className={`${style.sendButton} ${comment === '' ? style.disabledView : ''}`} onClick={() => comment !== '' ? handleComment() : {}}>{ticketStatus !== 'In-Progress' ? 'SEND' : 'REPLY'}</button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className={`${style.alignRight} ${style.marginTop20}`}>
                                <button className={style.doneButton} onClick={() => handleSave()}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {showFeedbackTicketResolutionLog && (
                <FeedbackTicketResolutionLog getShowFeedbackTicketResolutionLog={getShowFeedbackTicketResolutionLog} ticketId={ticketDetails?.id} />
            )}
        </>
    )
}

export default FeedbackTicketResolution;