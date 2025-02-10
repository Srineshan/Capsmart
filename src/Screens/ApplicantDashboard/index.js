import {React, useState} from "react";
import style from "./index.module.scss";
import AddIcon from '@mui/icons-material/Add';
import HapiCare from "../../images/cambridgeHospital.png"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ApplicantHeader from "../../Components/ApplicantHeader";
import { symbol } from "d3";

const tasks = [
  {
    type: 'DOCUMENT VALIDATION',
    title: 'You required to upload (document type) again for your application verification',
    assignedBy: 'Mark K, Medical Staff Administrative Associate',
    date: 'March 21, 2025',
    status: 'past-due',
    description:'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.',
    timeLeft: '30 Days to go',
    interactions: { comments: 1, shares: 0 }
  },
  {
    type: 'REAPPOINTMENT APPLICATION',
    title: 'Credentialing & Privileging Reappointment Application for (CMH)',
    assignedBy: 'Mark K, Medical Staff Administrative Associate',
    date: 'March 21, 2025',
    status: 'ongoing',
    description:'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy.',
    timeLeft: '30 Days to go',
    interactions: { comments: 0, shares: 0 }
  }
];

const sidebarItems = [
  { title: 'My Tasks', key: "tasks", count: 5, active: true },
  { title: 'Current Applications', key: "Current", count: 1 },
  { title: 'Privileged Staff Appointments', key: "Privileged", count: 1 },
];

const ApplicantDashboard = () => {
  const [activeSection, setActiveSection] = useState("tasks");
  return (
    <div className={`${style.backgroundDashboard}`}>
      <ApplicantHeader />
    <div className={`${style.flex}`}>
      {/* <div className={`${style.sidebar}`}>
        <div className={style.greeting}>Good Morning <span className={style.userName}>Jenny!</span>
        </div>
      </div> */}
      <div className={style.mainContent}>
        <div className={`${style.flex}`}>
        <div className={style.greeting}>Good Morning <span className={style.userName}>Jenny!</span></div>
          <div className={style.header}>
            <div>
              <KeyboardArrowUpOutlinedIcon sx={{ fontSize: 18, color: "#06617A"}} />
            </div>
            <div className={`${style.spaceBetween} ${style.padding10}`}>
              <div className={style.flex}>
              <div className={style.notificationNumber}>1/3</div>
              <div className={style.notificationText}>You have a Request for Clarification for your reappointment that requires your attention!</div>
              </div>
              <div className={style.viewButton}>View</div>
          </div>
          <div>
              <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 18, color: "#06617A"}} />
            </div>
          </div>
        </div>
        <div className={`${style.flex}`}>
        <div className={`${style.backgroundSideBar} ${style.marginTop20}`}>
          <div 
            className={`${style.sidebarItem} ${activeSection === "tasks" ? style.active : style.backgroundSideBarCard}  ${activeSection === "tasks" ? style.padding3side : style.padding}`}
            onClick={() => setActiveSection("tasks")}
          >
            <div className={`${style.spaceBetween} ${style.alignItem}`}>
            <div className={` ${activeSection === "tasks" ? style.titleStyleActive : style.titleStyle}`}>My Tasks</div>
            <div className={`${style.count} ${activeSection === "tasks" ? style.marginRight10 : ""}`}>5</div>
            </div>
          </div>

          <div 
            className={`${style.sidebarItem} ${activeSection === "Current" ? style.active : style.backgroundSideBarCard}`}
            onClick={() => setActiveSection("Current")}
          >
            <div className={`${style.spaceBetween} ${style.alignItem}`}>
            <div className={`${activeSection === "Current" ? style.titleStyleActive : style.titleStyle}`}>Current Applications</div>
            <div className={`${style.count} ${activeSection === "Current" ? style.marginRight10 : ""}`}>1</div>
            </div>
            <div className={`${style.spaceBetween} ${style.alignItem}`}>
              <div className={`${style.sidebarWidgetText}`}>Open RFC</div>
              <div className={`${style.sidebarWidgetNumber} ${activeSection === "Current" ? style.marginRight10 : ""}`}>1</div>
            </div>
            <div className={`${style.spaceBetween} ${style.alignItem}`}>
              <div className={`${style.sidebarWidgetText}`}>Document Followups</div>
              <div className={`${style.sidebarWidgetNumber} ${activeSection === "Current" ? style.marginRight10 : ""}`}>1</div>
            </div>
          </div>

          <div 
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
          </div>
        </div>

          {activeSection === "tasks" ? (
          <div className={style.taskBoardShadow}>
          <div className={style.taskBoard}>
         {/* <div className={`${style.addTask} ${style.alignItem}`}><AddIcon  sx={{ fontSize: 20, color: "#06617A", cursor: "pointer" }} /> Add New Task</div> */}
         <div className={`${style.flexGap} ${style.marginTop2}`}>
          <div className={`${style.padding5} ${style.pastDue}`}>
            <div className={`${style.flex} ${style.alignItem} ${style.marginBottom10}`}>
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
            <div className={`${style.flex} ${style.alignItem} ${style.marginBottom10}`}>
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
            <div className={`${style.flex} ${style.alignItem} ${style.marginBottom10}`}>
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
            <div className={`${style.spaceBetween} ${style.alignItem} ${style.marginBottom10}`}>
              <div className={`${style.flex} ${style.alignItem}`}>
                <div className={`${style.greenDotStyle}`}></div>
                <div className={style.columnTitleCompleted}>Completed</div>
              </div>
              <div className={`${style.flex} ${style.alignItem}`}>
              <div className={style.weekTextStyle}>This Week</div>
                <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 18, color: "#06617A"}} />
              </div>
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
        </div>
        </div>
        ) : activeSection === "Current" ? (
          <div className={style.taskBoardShadow}>
          <div className={style.taskBoard}>
            <div className={style.backgroundCurrent}>
              <div className={`${style.backgroundWhite} ${style.gridCol4}`}>
                {/* <div className={`${style.spaceBetween}`}> */}
                <img src={HapiCare} alt="HapiCare Logo" className={`${style.logo}`} />
                <div>
                  <div className={style.taskTitle}>Credentialing & Privileging Reappointment Application</div>
                    <div className={`${style.flexGap10} ${style.marginTop20} ${style.alignItem}`}>
                      <div className={`${style.applicantType}`}>Physician</div>
                      <div className={`${style.applicantType}`}>Active</div>
                      <div className={`${style.departmentType}`}>Surgery - ENT</div>
                    </div>
                </div>
                {/* </div> */}
                {/* <div className={`${style.spaceBetween}`}> */}
                <div>
                  <div className={style.assignedBy}>MSO VERIFICATION IN PROGRESS</div>
                  <div  className={style.trackApplication1}>TRACK MY APPLICATION</div>
                </div>
                  <div className={style.approvedDate}>LAST UPDATED: JAN 16, 2025</div>
                {/* </div> */}
              </div>
              <div className={`${style.backgroundWhite1}`}>
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
              </div>
              <div className={`${style.backgroundWhite1}`}>
                <div className={`${style.gridCol1} ${style.alignItem}`}>
                  <div className={`${style.DashboardTitle}`}>
                 Payment
                  </div>
                  <div>
                  <div className={`${style.DashboardDescription}`}>
                 Amount - Confirmation Code
                  </div>
                  </div>
                  <div>
                  <div className={`${style.trackApplication}`}>
                  View Reciept
                  </div>
                  </div>   
                </div>
              </div>
            </div>
          </div>
          </div>
        ) : activeSection === "Privileged" ? (
          <div className={style.taskBoardShadow}>
          <div className={style.taskBoard}>
          <div className={style.backgroundCurrent}>
            <div className={`${style.backgroundWhite} ${style.gridCol3}`}>
              {/* <div className={`${style.flex}`}> */}
              <img src={HapiCare} alt="HapiCare Logo" className={`${style.logo}`} />
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
        ):("")}
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
    </div>
  );
};

export default ApplicantDashboard;
