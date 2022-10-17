import React, { useState, useEffect } from 'react';
import { Icon, Intent, Dialog, Classes, TextArea, InputGroup } from "@blueprintjs/core";
import { GET, TenantID, POST, PUT } from './../../Screens/dataSaver';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import {format} from 'date-fns';
import Select from '@mui/material/Select';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import UserLogo from './../../images/userLogo.jpg';

import style from './index.module.scss';

const FeedbackTicketResolution = ({ getShowFeedbackTicketResolution, ticketId, isEdit }) => {

    const [ticketStatus, setTicketStatus] = useState('NEW');
    const [screenCapture, setScreenCapture] = useState('');
    const [screenCaptured, setScreenCaptured] = useState(true);
    const [type, setType] = useState('APPLICATION');
    const [impact, setImpact] = useState('HIGH');
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [assignTo, setAssignTo] = useState({});
    const [assignToId, setAssignToId] = useState();
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [ticketDetails, setTicketDetails] = useState();
    const [ticketName, setTicketName] = useState('');
    const [fileName, setFileName] = useState(`${currentUser?.[0]?.id}${new Date().getTime().toString()}.png`);
    const [dateAndTime, setDateAndTime] = useState(format(new Date(), 'MM-dd-yyyy HH:mm'));
    const [blobFormat, setBlobFormat] = useState();
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState();
    const [allMessages, setAllMessages] = useState();
    var cookie = new Cookie();
    let authValue = cookie.get('user');
    const loggedUser = jwt(authValue);
    let screenCaptureImg = sessionStorage.getItem('screenCapture');

    useEffect(() => {
        setScreenCapture(screenCaptureImg);
    }, [screenCaptureImg]);

    useEffect(() => {
        setCurrentUser(users?.filter(data => data?.id === loggedUser?.id)?.map(data => data))
    }, [users]);

    useEffect(() => {
        getImgBlob();
    }, [screenCapture]);

    useEffect(()=>{
        getUser();
        if(isEdit){
            getTicketById();
            getComments();
            getCommentMessages();
        }
    },[isEdit]);

    useEffect(()=>{
        if(isEdit && currentUser){
            getCommentMessages();
        }
    },[currentUser])

    useEffect(() => {
        if(ticketDetails){
            setTicketName(ticketDetails?.ticketId);
            setDateAndTime(format(new Date(ticketDetails?.createdDateTime), 'MM-dd-yyyy HH:mm'));
            setSubject(ticketDetails?.subject);
            setDescription(ticketDetails?.description);
            setType(ticketDetails?.type);
            setImpact(ticketDetails?.impact);
            setScreenCaptured(ticketDetails?.screenCaptured)
            setAssignToId(ticketDetails?.assignedTo?.id);
            handleAssignTo(ticketDetails?.assignedTo?.id);
            setTicketStatus(ticketDetails?.status);
            setFileName(ticketDetails?.ticketFile?.fileName);
            setScreenCapture(ticketDetails?.ticketFile?.fileURL);
        }
    }, [ticketDetails])
  
    const getUser = async() => {
        const {data: user} = await GET('user-management-service/user');
        setUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
        setCurrentUser(users?.filter(data => data?.id === loggedUser?.id)?.map(data => data))
    };

    const getTicketById = async () => {
        const { data: ticket } = await GET(`feedback-management-service/ticket/${ticketId}`);
        setTicketDetails(ticket)
    };

    const getComments = async() => {
        const {data:comments} = await GET(`feedback-management-service/ticket_comment?ticketId=${ticketId}`);
        setAllComments(comments);
    }

    const getCommentMessages = async() => {
        const {data:messages} = await GET(`feedback-management-service/ticket_comment/message?userId=${currentUser?.[0]?.id}`);
        setAllMessages(messages);
    }

    const getImgBlob = async() => {
        setBlobFormat(await fetch(screenCapture).then((res) => res.blob())); 
    };

    const handleAssignTo = (id) => {
        setAssignTo(users?.filter(data => data?.id === id)?.map(data => data))
    }

    const handleSave = async() => {
        let data = {
            ...( isEdit &&
            {'id':ticketId}),
            "subject": subject,
            "description": description,
            "createdBy": {
              "id": currentUser?.[0]?.id,
              "name": currentUser?.[0]?.name,
              "email": currentUser?.[0]?.email,
              "communication": currentUser?.[0]?.communication
            },
            "assignedTo": {
              "id": assignTo?.[0]?.id,
              "name": assignTo?.[0]?.name,
              "email": assignTo?.[0]?.email,
              "communication": assignTo?.[0]?.communication
            },
            "type": type,
            "impact": impact,
            "status": ticketStatus,
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
              ...( isEdit &&
                {'id':ticketDetails?.ticketFile?.id}),
                ...( isEdit &&
                {'filePath':ticketDetails?.ticketFile?.filePath}),
                ...( isEdit &&
                {'fileURL':ticketDetails?.ticketFile?.fileURL}),
            },
            "dueDate": "2022-10-06",
            "screenCaptured": screenCaptured,
            "externalBugTrackingSystem": true
        }

        const formData = new FormData();

        formData.append('ticketDetail', new Blob([JSON.stringify(data)], {
            type: "application/json"
        }));
        if(screenCaptured){
            const file = new File([blobFormat], fileName);
            formData.append('ticketFile',file);
        }
        if(!isEdit){
            await POST(`feedback-management-service/ticket`, formData)
            .then(response=>{
                SuccessToaster('Feedback Added Successfully');
                sessionStorage.removeItem('screenCapture');
                getShowFeedbackTicketResolution(false);
            })
            .catch(error=>{
                ErrorToaster('Unexpected Error Occured');
            })
        } else {
            await PUT(`feedback-management-service/ticket/${ticketId}`, formData)
            .then(response=>{
                SuccessToaster('Feedback Updated Successfully');
                sessionStorage.removeItem('screenCapture');
                getShowFeedbackTicketResolution(false);
            })
            .catch(error=>{
                ErrorToaster('Unexpected Error Occured');
            })
        }
    }

    const handleComment = async() => {
        let data = {
            "commentedBy": {
                "id": currentUser?.[0]?.id,
                "name": currentUser?.[0]?.name,
                "email": currentUser?.[0]?.email,
                "communication": currentUser?.[0]?.communication
            },
            "comment": comment,
            "ticketId": {
              "id": ticketId
            }
        }
        await POST(`feedback-management-service/ticket_comment`, data)
        .then(response=>{
            SuccessToaster('Comment Added Successfully');
            setComment('');
            getComments();
        })
        .catch(error=>{
            ErrorToaster('Unexpected Error Occured');
        })
    }

    const handleClose = () => {
        getShowFeedbackTicketResolution(false);
        sessionStorage.removeItem('screenCapture');
    }

    return (
        <Dialog isOpen={getShowFeedbackTicketResolution} onClose={() => handleClose()} className={`${style.addManagerDialogBackground} ${style.feedbackDialog}`}>
            <div className={`${Classes.DIALOG_BODY} `}>
                <div className={style.spaceBetween}>
                    <p className={style.extensionStyle}>Feedback Ticket Resolution Progress</p>
                    <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.marginLeft20}`} onClick={() => handleClose()} />
                </div>
                <div className={style.extensionBorder}></div>
                <div className={style.feedbackGrid}>
                    <div>
                        <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                            {isEdit && (
                                <div>
                                    <p className={style.extentionLableStyle}>Ticket ID</p>
                                    <p className={style.feedbackFontStyle}>{ticketName}</p>
                                </div>
                            )}
                            <div>
                                <p className={style.extentionLableStyle}>Date & Time</p>
                                <p className={style.feedbackFontStyle}>{dateAndTime}</p>
                            </div>
                            <div>
                                <p className={style.extentionLableStyle}>User Name</p>
                                <p className={style.feedbackFontStyle}>{loggedUser?.userName}</p>
                            </div>
                            <div>
                                <p className={style.extentionLableStyle}>Customer</p>
                                <p className={style.feedbackFontStyle}>ACME corp</p>
                            </div>
                            <div>
                                <p className={style.extentionLableStyle}>Feedback SUBJECT</p>
                                <InputGroup value={subject} onChange={(e)=> setSubject(e.target.value)} placeholder="Subject"/>
                            </div>
                            <div>
                                <p className={style.extentionLableStyle}>FEEDBACK DESCRIPTION</p>
                                <TextArea value={description} onChange={(e)=> setDescription(e.target.value)} placeholder="Description" rows={3} className={`${style.fullWidth} ${style.marginRight20}`} />
                            </div>
                        </div>
                        <div className={`${style.extensionBorder} ${style.marginTop20}`}></div>
                        <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                            <div>
                                <p className={style.extentionLableStyle}>Feedback TYPE</p>
                                <FormControl sx={{ maxWidth: 180 }} className={style.reduceMarginTop} size="small">
                                    <Select
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
                                    <FormControl sx={{ maxWidth: 180}} className={style.reduceMarginTop} size="small">
                                        <Select
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
                                            <Switch checked={screenCaptured} size="small" onChange={(e) => setScreenCaptured(e.target.checked)} />
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
                                {screenCapture === '' ? (
                                    <div className={style.imageNameStyle}>IMAGE.PNG</div>
                                    ) : (
                                    <img src={screenCapture} alt='Screen shot' className={style.screenCaptureImgStyle} />
                                )}
                            </div>
                        </div>
                        {isEdit && (
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
                                                {/* <div className={style.leftBorder}></div> */}
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
                        )}
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
                                            <p className={style.feedbackFontStyle}>Updated On 01-06-2022 23:34</p>
                                            <Icon icon="chevron-up" color='#7165E3' className={style.marginLeft20} />
                                        </div>
                                    </div>
                                    <div className={style.collapseBody}>
                                        <div className={`${style.extentionGrid}`}>
                                            <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Assign To</div>
                                            <div className={style.displayInRow}>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={assignToId}
                                                    onChange={(e)=> {setAssignToId(e.target.value);handleAssignTo(e.target.value)}}
                                                    className={`${style.fieldWidth2InARow} ${style.transparentBackground}`}>
                                                        <option value="" >
                                                            Select Assignee
                                                        </option>
                                                        {users?.map((data, index) => (
                                                            <option value={data?.id} >
                                                                {`${data?.name?.firstName} ${data?.name?.lastName}`}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        {ticketStatus !== 'In-Progress' && (
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
                                        <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                            <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Status</div>
                                            <div className={style.displayInRow}>
                                                <select
                                                    name="class"
                                                    id="Class"
                                                    value={ticketStatus}
                                                    onChange={(e) => setTicketStatus(e.target.value)}
                                                    className={`${style.fieldWidth2InARow} ${style.transparentBackground}`}>
                                                    <option value="NEW" >
                                                        New
                                                    </option>
                                                    <option value="INPROGRESS" >
                                                        In-Progress
                                                    </option>
                                                    <option value="ESCALATE" >
                                                        Escalate
                                                    </option>
                                                    <option value="RESOLVED" >
                                                        Resolved
                                                    </option>
                                                    <option value="CLOSED" >
                                                        Closed
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        {ticketStatus === 'INPROGRESS' && (
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
                                        )}
                                        <div className={`${style.resolutionProgressCard} ${style.spaceBetween} ${style.verticalAligCenter} ${style.marginTop20}`}>
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
                                                        {(index === 0 || allComments[index - 1]?.commentedBy?.id !== data?.commentedBy?.id) && (
                                                            <div className={style.displayInRow}>
                                                                <img src={UserLogo} alt="logo" className={style.userLogo} />
                                                                <div className={style.marginLeft20}>
                                                                    <div className={`${style.displayInRow} ${style.marginTop10}`}>{data?.commentedBy?.name?.firstName} {data?.commentedBy?.name?.lastName}<span className={`${style.blue} ${style.marginLeft20}`}> MD</span> <span className={`${style.greyText} ${style.marginLeft20}`}>3 days ago</span> </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className={`${style.marginTop10} ${style.marginLeft55}`}>{data?.comment}</div>
                                                    </div>
                                                ))}
                                                <TextArea placeholder='reply here...' value={comment} onChange={(e)=> setComment(e.target.value)} rows={4} className={`${style.fullWidth} ${style.marginTop10}`} />
                                                <div className={`${style.alignRight} ${style.marginTop10}`}>
                                                    <button className={style.sendButton} onClick={()=> handleComment()}>{ticketStatus !== 'In-Progress' ? 'SEND' : 'REPLY'}</button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <div className={`${style.alignRight} ${style.marginTop20}`}>
                            <button className={style.doneButton} onClick={()=> handleSave()}>Done</button>
                        </div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default FeedbackTicketResolution;