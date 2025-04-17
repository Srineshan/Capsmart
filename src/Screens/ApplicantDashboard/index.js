import { React, useEffect, useState } from "react";
import style from "./index.module.scss";
import AddIcon from '@mui/icons-material/Add';
import HapiCare from "../../images/cambridgeHospital.png"
import NotificationLogo from "../../images/notificationMic1.png"
import HourGlass from "../../images/hourglass.png"
import HourGlassComplete from "../../images/hourglassComplete.png"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ApplicantHeader from "../../Components/ApplicantHeader";
import { symbol } from "d3";
import { GET } from "../dataSaver";
import { differenceInCalendarDays, format } from "date-fns";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useNavigate } from "react-router-dom";
import { currentUser } from "../../utils/auth";
import FileDisplayDialog from "../../Components/fileDisplayDialog";
import { Tooltip } from "@mui/material";
import PrivilegeDisplayDialog from "../../Components/PrivilegeDisplayDialog";
import TaskNewDialog from "../../Components/AddTaskFromApplicantDialog";
import TrackApplicationDialog from "../../Components/TrackApplicationDialog";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"; // Dots
import { Stack } from "@mui/material";

const tasks = [
  {
    type: 'DOCUMENT VALIDATION',
    title: 'You required to upload (document type) again for your application verification',
    assignedBy: 'Mark K, Medical Staff Administrative Associate',
    date: 'March 21, 2025',
    status: 'past-due',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.',
    timeLeft: '30 Days to go',
    interactions: { comments: 1, shares: 0 }
  },
  {
    type: 'REAPPOINTMENT APPLICATION',
    title: 'Credentialing & Privileging Reappointment Application for (CMH)',
    assignedBy: 'Mark K, Medical Staff Administrative Associate',
    date: 'March 21, 2025',
    status: 'ongoing',
    description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.',
    timeLeft: '30 Days to go',
    interactions: { comments: 0, shares: 0 }
  }
];

const notifications = [
  "You have a Request for Clarification for your reappointment that requires your attention!",
  "Your appointment has been approved, please review the details!",
  "You have a new message from the HR team regarding your application!",
  "You have a new message from the HR team regarding your application!"
];

const sidebarItems = [
  { title: 'My Tasks', key: "tasks", count: 5, active: true },
  { title: 'Current Applications', key: "Current", count: 1 },
  { title: 'Privileged Staff Appointments', key: "Privileged", count: 1 },
];

const ApplicantDashboard = () => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [dashboardContent, setDashboardContent] = useState();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notStartedTasks, setNotStartedTasks] = useState([]);
  const [onGoingTasks, setOnGoingTasks] = useState([]);
  const [pastDueTasks, setPastDueTasks] = useState([]);
  const [entityList, setEntityList] = useState([]);
  const [applicationForm, setApplicationForms] = useState([]);
  const navigate = useNavigate()
  const currentUserData = currentUser();
  const [currentApplicationIndex, setCurrentApplicationIndex] = useState(0);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPrivilegeDialog, setShowPrivilegeDialog] = useState(false);
  const [showTaskNewDialog, setShowTaskNewDialog] = useState(false);
  const [showTrackApplicationDialog, setShowTrackApplicationDialog] = useState(false);
  const [selectedPrivilegeList, setSelectedPrivilegeList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const availableCategories = {
    REAPPOINTMENT_APPLICATION: 'REAPPOINTMENT APPLICATION',
    MEDICAL_DIRECTIVE_ATTESTATION: 'MEDICAL DIRECTIVE ATTESTATION',
    DOCUMENT_FOLLOW_UP: 'DOCUMENT FOLLOW UP',
    INITIAL_APPLICATION: 'INITIAL APPLICATION',
    REQUEST_FOR_CLARIFICATION: 'REQUEST FOR CLARIFICATION'
  }

  const availableCategoryWarnings = {
    HIGH: style.warningRed,
    LOW: style.warningYellow,
    MEDIUM: style.warningOrange
  }

  const handleNextNotification = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % notifications.length);
  };

  const handlePrevNotification = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + notifications.length) % notifications.length);
  };


  useEffect(() => {
    getEntity();
    getDashboardContent();
    getApplications();
    sessionStorage.removeItem('taskId')
    sessionStorage.removeItem('taskStatus')
  }, [])

  useEffect(() => {
    if (currentUserData?.id !== undefined) {
      getApplications();
    }
  }, [currentUserData?.id])

  const getDashboardContent = async () => {
    const { data: content } = await GET(
      `task-management-service/task/dashboard`
    );
    setDashboardContent(content);
    setCompletedTasks(content?.completedTasks);
    setNotStartedTasks(content?.notStartedTasks);
    setOnGoingTasks(content?.onGoingTasks);
    setPastDueTasks(content?.pastDueTasks);
  }

  const getEntity = async (id) => {
    const { data: data } = await GET(`entity-service/entity`);
    setEntityList(data);
  }

  const getApplications = async () => {
    try {
      const { data: application } = await GET(`application-management-service/application?applicantId=${currentUserData?.id}`);
      setApplicationForms(application?.applications?.filter(filterData => filterData?.status !== "COMPLETED"));
    } catch (error) {
      console.error("Error fetching application data:", error);
    }
  }

  const handleOnCick = (task) => {
    sessionStorage.setItem('taskId', task?.id)
    sessionStorage.setItem('taskStatus', task?.status)
    sessionStorage.setItem('taskInfo', JSON.stringify(task))
    if (task?.category === 'REAPPOINTMENT_APPLICATION') {
      if (task?.details?.application?.lastSavedSection !== null && task?.details?.application?.lastSavedSection !== "") {
        console.log(task?.details?.application?.lastSavedSection)
        navigate(`/reappointmentApplicationForm/${task?.details?.application?.application?.id}/${task?.details?.application?.lastSavedSection}`);
      } else {
        navigate(`/reappointmentApplicationForm/${task?.details?.application?.application?.id}`);
      }
    }
    if (task.category === 'INITIAL_APPLICATION') {
      if (task?.details?.application?.lastSavedSection !== null && task?.details?.application?.lastSavedSection !== "") {
        navigate(`/applicationForm/${task?.details?.application?.application?.id}/${task?.details?.application?.lastSavedSection}`);
      } else {
        navigate(`/applicationForm/${task?.details?.application?.application?.id}`);
      }
    }
    if (task.category === 'REQUEST_FOR_CLARIFICATION') {
      navigate(`/RFC/${task?.details?.application?.clarificationId}?app=${task?.details?.application?.application?.id}&form=${task?.details?.application?.formDetails?.formId}`);
    }
  }

  const handleShowFileDialog = (file) => {
    setSelectedFile(file);
    setShowFileDialog(true);
  };

  const handleShowPrivilegeDialog = (privilegeList) => {
    setSelectedPrivilegeList(privilegeList);
    setShowPrivilegeDialog(true);
  }

  const handleShowTaskNewDialog = () => {
    setShowTaskNewDialog(true);
  }

  const handleShowTrackApplicationDialog = () => {
    setShowTrackApplicationDialog(true);
  }

  return (
    <div>
      <ApplicantHeader />
      <div className={`${style.flex} ${style.backgroundDashboard}`}>
        {/* <div className={`${style.sidebar}`}>
        <div className={style.greeting}>Good Morning <span className={style.userName}>Jenny!</span>
        </div>
      </div> */}
        <div className={`${style.mainContent} ${style.marginTop20}`}>
          {/* <div className={`${style.flex}`}>
            <div className={style.greeting}>Good Morning <span className={style.userName}>Jenny!</span></div>
            <div className={style.header}>
              <div className={`${style.spaceBetween} ${style.padding10}`}>
                <div className={`${style.flex} ${style.alignItem}`}>
                  <img src={NotificationLogo} alt="Notification Logo" className={`${style.logoNotification}`} />
                  <Stack direction="column" spacing={0.3} sx={{ marginLeft: 1 }}>
                    {notifications.map((_, index) => (
                      <FiberManualRecordIcon
                        key={index}
                        sx={{
                          fontSize: 5,
                          color: currentIndex === index ? "#06617A" : "#B0BEC5",
                          transition: "color 0.3s"
                        }}
                      />
                    ))}
                  </Stack>
                  <KeyboardArrowLeftOutlinedIcon sx={{ fontSize: 22, color: "#06617A", cursor: "pointer" }} onClick={handlePrevNotification} />
                  <div className={style.notificationText}>
                    <span className={style.notificationNumber}>{currentIndex + 1}. </span>
                    {notifications[currentIndex]}
                  </div>
                </div>
                <div className={`${style.flex} ${style.alignItem} ${style.gap}`}>
                  <div className={`${style.viewButton} ${style.cursorPointer}`} onClick={() => handleShowTrackApplicationDialog()}>View</div>
                  <KeyboardArrowRightOutlinedIcon sx={{ fontSize: 22, color: "#06617A", cursor: "pointer" }} onClick={handleNextNotification} />
                </div>
              </div>
            </div>
          </div> */}
          <div className={`${style.flex}`}>
            <div className={`${style.backgroundSideBar} ${style.marginTop20}`}>
              <div
                className={`${style.sidebarItem} ${activeSection === "tasks" ? style.active : style.backgroundSideBarCard}  ${activeSection === "tasks" ? style.padding3side : style.padding}`}
                onClick={() => setActiveSection("tasks")}
              >
                <div className={`${style.spaceBetween} ${style.alignItem}`}>
                  <div className={` ${activeSection === "tasks" ? style.titleStyleActive : style.titleStyle}`}>My Tasks</div>
                  <div className={`${style.count} ${activeSection === "tasks" ? style.marginRight10 : ""}`}>{dashboardContent?.totalTasks || 0}</div>
                </div>
              </div>

              <div
                className={`${style.sidebarItem} ${activeSection === "Current" ? style.active : style.backgroundSideBarCard}`}
                onClick={() => setActiveSection("Current")}
              >
                <div className={`${style.spaceBetween} ${style.alignItem}`}>
                  <div className={`${activeSection === "Current" ? style.titleStyleActive : style.titleStyle}`}>Current Applications</div>
                  <div className={`${style.count} ${activeSection === "Current" ? style.marginRight10 : ""}`}>{applicationForm?.length || 0}</div>
                </div>
                {/* <div className={`${style.spaceBetween} ${style.alignItem}`}>
                  <div className={`${style.sidebarWidgetText}`}>Open RFC</div>
                  <div className={`${style.sidebarWidgetNumber} ${activeSection === "Current" ? style.marginRight10 : ""}`}>1</div>
                </div>
                <div className={`${style.spaceBetween} ${style.alignItem}`}>
                  <div className={`${style.sidebarWidgetText}`}>Document Followups</div>
                  <div className={`${style.sidebarWidgetNumber} ${activeSection === "Current" ? style.marginRight10 : ""}`}>1</div>
                </div> */}
              </div>

              {/* <div
                className={`${style.sidebarItem} ${activeSection === "Privileged" ? style.active : style.backgroundSideBarCard}`}
                onClick={() => setActiveSection("Privileged")}
              >
                <div className={`${style.spaceBetween} ${style.alignItem}`}>
                  <div className={`${activeSection === "Privileged" ? style.titleStyleActive : style.titleStyle}`}>Privileged Staff Appointments</div>
                  <div className={`${style.count}  ${activeSection === "Privileged" ? style.marginRight10 : ""}`}>1</div>
                </div>
                <div className={`${style.spaceBetween} ${style.alignItem}`}>
                  <div className={`${style.sidebarWidgetText}`}>Expiring Documents</div>
                  <div className={`${style.sidebarWidgetNumber} ${activeSection === "Privileged" ? style.marginRight10 : ""}`}>1</div>
                </div>
                <div className={`${style.spaceBetween} ${style.alignItem}`}>
                  <div className={`${style.sidebarWidgetText}`}>Open Tasks</div>
                  <div className={`${style.sidebarWidgetNumber} ${activeSection === "Privileged" ? style.marginRight10 : ""}`}>1</div>
                </div>
              </div> */}
            </div>

            {activeSection === "tasks" ? (
              <div className={style.taskBoardShadow}>
                <div className={style.taskBoard}>
                  {/* <div className={`${style.addTask} ${style.alignItem} ${style.cursorPointer}`} onClick={() => handleShowTaskNewDialog()}><AddIcon sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }} /> <span className={style.marginLeft10}>Add New Task</span></div> */}
                  <div className={`${style.flexGap} ${style.marginTop10}`}>
                    <div className={`${style.padding5} ${style.pastDue}`}>
                      <div className={style.pastDueHeader}></div>
                      <div className={`${style.flex} ${style.alignItem} ${style.marginBottom10}`}>
                        {/* <div className={`${style.redDotStyle}`}></div> */}
                        <div className={style.columnTitlePastDue}>Past Due</div>
                      </div>
                      <div className={`${style.taskList} ${style.tasksScroll}`}>
                        {pastDueTasks?.map((task, index) => (
                          <div key={index} className={style.taskCardSingle}>
                            <div className={style.spaceBetween}>
                              <div className={`${style.flex} ${style.verticalAlignCenter}`}>
                                <div className={`${availableCategoryWarnings[task?.priority]} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 10, color: "#FFFFFF" }} /></div>
                                <div className={`${style.taskType} ${style.marginLeft} `}>{availableCategories[task?.category]}</div>
                              </div>
                              <div>
                                {(task?.category === 'REAPPOINTMENT_APPLICATION' || task.category === 'INITIAL_APPLICATION') && (
                                  <img src={entityList?.filter(data => data?.id === task?.details?.application?.tenant?.id)?.[0]?.logo?.file?.fileURL} className={`${style.smallLogo}`} />
                                )}
                              </div>
                            </div>
                            <div className={`${style.taskTitle} ${style.marginTop5}`}>{task?.title}</div>
                            <div className={`${style.assignedBy} ${style.marginTop10}`}>
                              {task?.description}
                            </div>
                            <div className={`${style.assignedBy} ${style.marginTop5}`}>
                              Assigned by: {`${task?.createdBy?.name?.firstName} ${task?.createdBy?.name?.lastName}, ${task?.createdBy?.title?.title}`}
                            </div>

                            <div className={`${style.date} ${style.marginTop5}`}>
                              <div className={style.flex}>
                                <img src={HourGlass} className={style.smallLogo1} alt="" />
                                <span className={style.marginLeft}>{format(new Date(task?.dueDate), 'MMMM dd, yyyy')}</span>
                              </div>
                            </div>

                            <div className={` ${style.marginTop10}`}>
                              <div className={style.interactions}>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                <span className={style.daysToGoStyle}>{`${differenceInCalendarDays(new Date(task?.dueDate), new Date())} Days to go`}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`${style.padding5} ${style.ongoing}`}>
                      <div className={style.ongoingHeader}></div>
                      <div className={`${style.flex} ${style.alignItem} ${style.marginBottom10}`}>
                        {/* <div className={`${style.yellowDotStyle}`}></div> */}
                        <div className={style.columnTitleOngoing}>Ongoing</div>
                      </div>
                      <div className={`${style.taskList} ${style.tasksScroll}`}>
                        {onGoingTasks?.map((task, index) => (
                          <div key={index} className={`${style.taskCardSingle} ${style.cursorPointer}`} onClick={() => handleOnCick(task)}>
                            <div className={style.spaceBetween}>
                              <div className={`${style.flex} ${style.verticalAlignCenter}`}>
                                <div className={`${availableCategoryWarnings[task?.priority]} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 10, color: "#FFFFFF" }} /></div>
                                <div className={`${style.taskType} ${style.marginLeft} `}>{availableCategories[task?.category]}</div>
                              </div>
                              <div>
                                {(task?.category === 'REAPPOINTMENT_APPLICATION' || task.category === 'INITIAL_APPLICATION') && (
                                  <img src={entityList?.filter(data => data?.id === task?.details?.application?.tenant?.id)?.[0]?.logo?.file?.fileURL} className={`${style.smallLogo}`} />
                                )}
                              </div>
                            </div>
                            <div className={`${style.taskTitle} ${style.marginTop5}`}>{task?.title}</div>
                            <div className={`${style.assignedBy} ${style.marginTop10}`}>
                              {task?.description}
                            </div>
                            <div className={`${style.assignedBy} ${style.marginTop5}`}>
                              Assigned by: {`${task?.createdBy?.name?.firstName} ${task?.createdBy?.name?.lastName}, ${task?.createdBy?.title?.title}`}
                            </div>

                            <div className={`${style.date} ${style.marginTop5}`}>
                              <div className={style.flex}>
                                <img src={HourGlass} className={style.smallLogo1} alt="" />
                                <span className={style.marginLeft}>{format(new Date(task?.dueDate), 'MMMM dd, yyyy')}</span>
                              </div>
                            </div>

                            <div className={` ${style.marginTop10}`}>
                              <div className={style.interactions}>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                <span className={style.daysToGoStyle}>{`${differenceInCalendarDays(new Date(task?.dueDate), new Date())} Days to go`}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`${style.padding5} ${style.notStarted}`}>
                      <div className={style.notStartedHeader}></div>
                      <div className={`${style.flex} ${style.alignItem} ${style.marginBottom10}`}>
                        {/* <div className={`${style.greyDotStyle}`}></div> */}
                        <div className={style.columnTitleNotYet}>Not Yet Started</div>
                      </div>
                      <div className={`${style.taskList} ${style.tasksScroll}`}>
                        {notStartedTasks?.map((task, index) => (
                          <div key={index} className={`${style.taskCardSingle} ${style.cursorPointer}`} onClick={() => handleOnCick(task)}>
                            <div className={style.spaceBetween}>
                              <div className={`${style.flex} ${style.verticalAlignCenter}`}>
                                <div className={`${availableCategoryWarnings[task?.priority]} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 10, color: "#FFFFFF" }} /></div>
                                <div className={`${style.taskType} ${style.marginLeft} `}>{availableCategories[task?.category]}</div>
                              </div>
                              <div>
                                {(task?.category === 'REAPPOINTMENT_APPLICATION' || task.category === 'INITIAL_APPLICATION') && (
                                  <img src={entityList?.filter(data => data?.id === task?.details?.application?.tenant?.id)?.[0]?.logo?.file?.fileURL} className={`${style.smallLogo}`} />
                                )}
                              </div>
                            </div>
                            <div className={`${style.taskTitle} ${style.marginTop5}`}>{task?.title}</div>
                            <div className={`${style.assignedBy} ${style.marginTop10}`}>
                              {task?.description}
                            </div>
                            <div className={`${style.assignedBy} ${style.marginTop5}`}>
                              Assigned by: {`${task?.createdBy?.name?.firstName} ${task?.createdBy?.name?.lastName}, ${task?.createdBy?.title?.title}`}
                            </div>

                            <div className={`${style.date} ${style.marginTop5}`}>
                              <div className={style.flex}>
                                <img src={HourGlass} className={style.smallLogo1} alt="" />
                                <span className={style.marginLeft}>{format(new Date(task?.dueDate), 'MMMM dd, yyyy')}</span>
                              </div>
                            </div>

                            <div className={` ${style.marginTop10}`}>
                              <div className={style.interactions}>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                <span className={style.daysToGoStyle}>{`${differenceInCalendarDays(new Date(task?.dueDate), new Date())} Days to go`}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={`${style.padding5} ${style.completed}`}>
                      <div className={style.completedHeader}></div>
                      <div className={`${style.spaceBetween} ${style.alignItem} ${style.marginBottom10}`}>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          {/* <div className={`${style.greenDotStyle}`}></div> */}
                          <div className={style.columnTitleCompleted}>Completed</div>
                        </div>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div className={style.weekTextStyle}>This Week</div>
                          <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 18, color: "#06617A" }} />
                        </div>
                      </div>
                      <div className={`${style.taskList} ${style.tasksScroll}`}>
                        {completedTasks?.map((task, index) => (
                          <div key={index} className={style.taskCardSingle}>
                            <div className={style.spaceBetween}>
                              <div className={`${style.flex} ${style.verticalAlignCenter}`}>
                                {/* <div className={`${availableCategoryWarnings[task?.category]} ${style.verticalAlignCenter} ${style.justifyCenter}`}><WarningAmberIcon sx={{ fontSize: 10, color: "#FFFFFF" }} /></div> */}
                                <div className={`${style.taskType} `}>{availableCategories[task?.category]}</div>
                              </div>
                              <div>
                                {(task?.category === 'REAPPOINTMENT_APPLICATION' || task.category === 'INITIAL_APPLICATION') && (
                                  <img src={entityList?.filter(data => data?.id === task?.details?.application?.tenant?.id)?.[0]?.logo?.file?.fileURL} className={`${style.smallLogo}`} />
                                )}
                              </div>
                            </div>
                            <div className={`${style.taskTitle} ${style.marginTop5}`}>{task?.title}</div>
                            {/* <div className={`${style.assignedBy} ${style.marginTop10}`}>
                              {task?.description}
                            </div>
                            <div className={`${style.assignedBy} ${style.marginTop5}`}>
                              Assigned by: {`${task?.createdBy?.name?.firstName} ${task?.createdBy?.name?.lastName}, ${task?.createdBy?.title?.title}`}
                            </div> */}

                            <div className={`${style.date} ${style.marginTop5}`}>
                              <div className={style.flex}>
                                <img src={HourGlassComplete} className={style.smallLogo1} alt="" />
                                <span className={style.marginLeft}>{format(new Date(task?.dueDate), 'MMMM dd, yyyy')}</span>
                              </div>
                            </div>

                            <div className={` ${style.marginTop10}`}>
                              <div className={style.interactions}>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                <div className={`${style.flex} ${style.alignItem}`}>
                                  <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D" }} /></div>
                                  <div className={style.commentStyle}> {0}</div>
                                </div>
                                {/* <span className={style.daysToGoStyle}>{`${differenceInCalendarDays(new Date(task?.dueDate), new Date())} Days to go`}</span> */}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeSection === "Current" ? (
              <div className={style.taskBoardShadow}>
                <div className={style.taskBoard}>
                  <div className={style.backgroundCurrent}>
                    {applicationForm?.map((task, index) => (
                      <div className={index === 0 ? '' : style.marginTop10}>
                        <div className={`${style.backgroundWhite} ${style.gridCol4} ${style.cursorPointer}`} onClick={() => setCurrentApplicationIndex(index)}>
                          {/* <div className={`${style.spaceBetween}`}> */}
                          <img src={entityList?.filter(data => data?.id === task?.tenant?.id)?.[0]?.logo?.file?.fileURL} alt="" className={`${style.logo}`} />
                          <div>
                            <div className={style.taskTitle}>{task?.creationType === 'REAPPOINTMENT' ? 'Credentialing & Privileging Reappointment Application' : 'Credentialing & Privileging Application'}</div>
                            <div className={`${style.flexGap10} ${style.marginTop20} ${style.alignItem}`}>
                              <div className={`${style.applicantType}`}>{task?.basicDetails?.applicant?.applicantType}</div>
                              <div className={`${style.applicantType}`}>{task?.basicDetails?.credentialingPrivilegeCategory?.credentialingCategory}</div>
                              <div className={`${style.departmentType}`}>{`${task?.basicDetails?.departmentSpecialty?.department} ${(task?.basicDetails?.departmentSpecialty?.specialty !== null && task?.basicDetails?.departmentSpecialty?.specialty !== "") ? ` - ${task?.basicDetails?.departmentSpecialty?.specialty}` : ""}`}</div>
                            </div>
                          </div>
                          {/* </div> */}
                          {/* <div className={`${style.spaceBetween}`}> */}
                          <div>
                            <div className={style.assignedBy}>MSO VERIFICATION IN PROGRESS</div>
                            <div className={style.trackApplication1}>TRACK MY APPLICATION</div>
                          </div>
                          <div className={style.approvedDate}>LAST UPDATED: {format(new Date(task?.lastModifiedDate), 'MMM dd, yyyy')}</div>
                          {/* </div> */}
                        </div>
                        {currentApplicationIndex === index && (
                          <div>
                            {/* <div className={`${style.backgroundWhite1}`}>
                              <div className={`${style.gridCol1} ${style.alignItem}`}>
                                <div className={`${style.DashboardTitle}`}>
                                  Open RFCs
                                </div>
                                <div>
                                  <div className={`${style.DashboardDescription}`}>
                                    RFC Subject ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
                                  </div>
                                  <div className={`${style.DashboardDescription} ${style.marginTop5}`}>
                                    RFC Subject dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
                                  </div>
                                </div>
                                <div>
                                  <div className={`${style.trackApplication}`}>
                                    GO TO RFC
                                  </div>
                                  <div className={`${style.trackApplication} ${style.marginTop5}`}>
                                    GO TO RFC
                                  </div>
                                </div>

                              </div>

                            </div>
                            <div className={`${style.backgroundWhite1}`}>
                              <div className={`${style.gridCol1} ${style.alignItem}`}>
                                <div className={`${style.DashboardTitle}`}>
                                  Document Follow-ups
                                </div>
                                <div>
                                  <div className={`${style.DashboardDescription}`}>
                                    CME Transcript - Document uploaded could not be Verified and / or Validated - Required Original Document will be needed prior to Application Approval.
                                  </div>
                                </div>
                                <div>
                                  <div className={`${style.trackApplication}`}>
                                    UPLOAD
                                  </div>
                                </div>

                              </div>

                            </div>
                            <div className={`${style.backgroundWhite1}`}>
                              <div className={`${style.gridCol1} ${style.alignItem}`}>
                                <div className={`${style.DashboardTitle}`}>
                                  My Query
                                </div>
                                <div>
                                  <div className={`${style.DashboardDescription}`}>
                                    Section Title - Query Comments
                                  </div>
                                </div>
                                <div>
                                  <div className={`${style.trackApplication}`}>
                                    View
                                  </div>
                                </div>
                              </div>
                            </div> */}
                            {task?.payment?.paymentCompleted && (
                              <div className={`${style.backgroundWhite1}`}>
                                <div className={`${style.gridCol1} ${style.alignItem}`}>
                                  <div className={`${style.DashboardTitle}`}>
                                    Payment
                                  </div>
                                  <div>
                                    <div className={`${style.DashboardDescription}`}>
                                      {`Amount: ${task?.payment?.currency} ${task?.payment?.fee} - Confirmation Code: ${task?.payment?.receiptId}`}
                                    </div>
                                  </div>
                                  <div>
                                    <Tooltip title={'Click to View Receipt'} arrow>
                                      <div className={`${style.trackApplication} ${style.cursorPointer}`} onClick={() => handleShowFileDialog(task?.payment?.invoice)}>
                                        View Reciept
                                      </div>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            )}
                            {task?.privileges?.obligatedPrivileges?.length !== 0 && (
                              <div className={`${style.backgroundWhite1}`}>
                                <div className={`${style.gridCol1} ${style.alignItem}`}>
                                  <div className={`${style.DashboardTitle}`}>
                                    Requested Privileges
                                  </div>
                                  <div>
                                    {task?.privileges?.obligatedPrivileges?.map((privilegeData, privilegeIndex) => (
                                      <div className={`${style.DashboardDescription}`}>
                                        <strong>{`${privilegeData?.privilegeSetTitle} - ${privilegeData?.privilegeDetails?.corePrivileges?.esign?.signedDate}`}</strong>
                                      </div>
                                    ))}
                                  </div>
                                  <div>
                                    <Tooltip title={'Click to View Privilege Details'} arrow>
                                      <div className={`${style.trackApplication} ${style.cursorPointer}`} onClick={() => handleShowPrivilegeDialog(task?.privileges?.obligatedPrivileges)}>
                                        View
                                      </div>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeSection === "Privileged" ? (
              <div className={style.taskBoardShadow}>
                <div className={style.taskBoard}>
                  <div className={style.backgroundCurrent}>
                    <div className={`${style.backgroundWhite} ${style.gridCol3}`}>
                      {/* <div className={`${style.flex}`}> */}
                      <img src={HapiCare} alt="" className={`${style.logo}`} />
                      <div>
                        <div className={`${style.flexGap10}`}>
                          <div className={style.taskTitle}>Privileged Staff</div>
                          <div className={style.taskTitle}>July 1, 2025 - June 30, 2026</div>
                        </div>
                        <div className={`${style.flexGap10} ${style.marginTop20} ${style.alignItem}`}>
                          <div className={`${style.applicantType}`}>Physician</div>
                          <div className={`${style.applicantType}`}>Active</div>
                          <div className={`${style.departmentType}`}>Surgery - ENT</div>
                        </div>
                      </div>
                      {/* </div> */}
                      {/* <div className={`${style.spaceBetween}`}> */}
                      <div>
                        <div className={style.approvedDate}>APPROVED DATE: APR 16, 2025</div>
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                          <div className={`${style.recordTextStyle}`}>APPOINTMENT HISTORY</div>
                          <div className={`${style.recordTextStyle}`}>VIEW MY RECORD</div>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                    <div className={`${style.backgroundWhite1}`}>
                      <div className={`${style.gridCol1} ${style.alignItem}`}>
                        <div className={`${style.DashboardTitle}`}>
                          Documents To Update
                        </div>
                        <div>
                          <div className={`${style.DashboardDescription}`}>
                            n95 Fit Test - date of expiry
                          </div>
                          <div className={`${style.DashboardDescription} ${style.marginTop5}`}>
                            document type - date of expiry
                          </div>
                        </div>
                        <div>
                          <div className={`${style.trackApplication}`}>
                            UPLOAD
                          </div>
                          <div className={`${style.trackApplication} ${style.marginTop5}`}>
                            UPLOAD
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`${style.backgroundWhite1}`}>
                      <div className={`${style.gridCol1} ${style.alignItem}`}>
                        <div className={`${style.DashboardTitle}`}>
                          Grand Rounds
                        </div>
                        <div>
                          <div className={`${style.DashboardDescription}`}>
                            Grand Round Title - Location - Date
                          </div>
                        </div>
                        <div>
                          <div className={`${style.trackApplication}`}>
                            VIEW ATTENDANCE LOG
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : ("")}
            {/* <div className={style.greeting}>Good Morning <span className={style.userName}>Jenny!</span></div> */}
          </div>
          {/* <div className={style.taskBoard}>
         <div className={`${style.addTask} ${style.alignItem}`}><AddIcon  sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }} /> Add New Task</div>
         <div className={`${style.flexGap} ${style.marginTop2}`}>
          <div className={`${style.padding5} ${style.pastDue}`}>
            <div className={`${style.flex} ${style.alignItem}`}>
            <div className={`${style.redDotStyle}`}></div>
            <div className={style.columnTitlePastDue}>Past Due</div>
            </div>   
            <div className={style.taskList}>
              {tasks.map((task, index) => (
                <div key={index} className={style.taskCardSingle}>
                  <div className={style.taskType}>{task.type}</div>
                  <div className={`${style.taskTitle} ${style.marginTop5}`}>{task.title}</div>
                  <div className={`${style.assignedBy} ${style.marginTop10}`}>
                   {task.description}
                  </div>
                  <div className={`${style.assignedBy} ${style.marginTop5}`}>
                    Assigned by: {task.assignedBy}
                  </div>
                 
                    <div className={style.date}>
                      <span>{task.date}</span>
                    </div>
                      <div className={`${style.marginTop10}`}>
                      <div className={style.interactions}>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.comments}</div>
                        </div>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.shares}</div>
                        </div>
                        <span className={style.daysToGoStyle}>{task.timeLeft}</span>
                        </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`${style.padding5} ${style.ongoing}`}>
            <div className={`${style.flex} ${style.alignItem}`}>
            <div className={`${style.yellowDotStyle}`}></div>
            <div className={style.columnTitleOngoing}>Ongoing</div>
            </div>
            <div className={style.taskList}>
              {tasks.map((task, index) => (
                <div key={index} className={style.taskCardSingle}>
                  <div className={style.taskType}>{task.type}</div>
                  <div className={`${style.taskTitle} ${style.marginTop5}`}>{task.title}</div>
                  <div className={`${style.assignedBy} ${style.marginTop10}`}>
                   {task.description}
                  </div>
                  <div className={`${style.assignedBy} ${style.marginTop5}`}>
                    Assigned by: {task.assignedBy}
                  </div>
                 
                    <div className={style.date}>
                      <span>{task.date}</span>
                    </div>
                      <div className={`${style.marginTop10}`}>
                      <div className={style.interactions}>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.comments}</div>
                        </div>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.shares}</div>
                        </div>
                        <span className={style.daysToGoStyle}>{task.timeLeft}</span>
                        </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`${style.padding5} ${style.notStarted}`}>
            <div className={`${style.flex} ${style.alignItem}`}>
            <div className={`${style.greyDotStyle}`}></div>
            <div className={style.columnTitleNotYet}>Not Yet Started</div>
            </div>
            <div className={style.taskList}>
              {tasks.map((task, index) => (
                <div key={index} className={style.taskCardSingle}>
                  <div className={style.taskType}>{task.type}</div>
                  <div className={`${style.taskTitle} ${style.marginTop5}`}>{task.title}</div>
                  <div className={`${style.assignedBy} ${style.marginTop10}`}>
                   {task.description}
                  </div>
                  <div className={`${style.assignedBy} ${style.marginTop5}`}>
                    Assigned by: {task.assignedBy}
                  </div>
                 
                    <div className={style.date}>
                      <span>{task.date}</span>
                    </div>
                      <div className={` ${style.marginTop10}`}>
                      <div className={style.interactions}>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.comments}</div>
                        </div>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.shares}</div>
                        </div>
                        <span className={style.daysToGoStyle}>{task.timeLeft}</span>
                        </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`${style.padding5} ${style.completed}`}>
            <div className={`${style.flex} ${style.alignItem}`}>
            <div className={`${style.greenDotStyle}`}></div>
            <div className={style.columnTitleCompleted}>Completed</div>
            </div>
            <div className={style.taskList}>
              {tasks.map((task, index) => (
                <div key={index} className={style.taskCardSingle}>
                  <div className={style.taskType}>{task.type}</div>
                  <div className={`${style.taskTitle} ${style.marginTop5}`}>{task.title}</div>
                  <div className={`${style.assignedBy} ${style.marginTop10}`}>
                   {task.description}
                  </div>
                  <div className={`${style.assignedBy} ${style.marginTop5}`}>
                    Assigned by: {task.assignedBy}
                  </div>
                 
                    <div className={style.date}>
                      <span>{task.date}</span>
                    </div>
                      <div className={`${style.marginTop10}`}>
                      <div className={style.interactions}>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><DescriptionOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.comments}</div>
                        </div>
                        <div className={`${style.flex} ${style.alignItem}`}>
                          <div><CommentOutlinedIcon sx={{ fontSize: 12, color: "#52575D"}}/></div>
                          <div className={style.commentStyle}> {task.interactions.shares}</div>
                        </div>
                        <span className={style.daysToGoStyle}>{task.timeLeft}</span>
                        </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div> */}
        </div>
      </div>
      {showFileDialog && (
        <FileDisplayDialog getIsOpen={setShowFileDialog} file={selectedFile} />
      )}
      {showPrivilegeDialog && (
        <PrivilegeDisplayDialog getIsOpen={setShowPrivilegeDialog} privilegeList={selectedPrivilegeList} />
      )}
      {showTaskNewDialog && (
        <TaskNewDialog getIsOpen={setShowTaskNewDialog} />
      )}
      {showTrackApplicationDialog && (
        <TrackApplicationDialog getIsOpen={setShowTrackApplicationDialog} />
      )}
    </div >
  );
};

export default ApplicantDashboard;
