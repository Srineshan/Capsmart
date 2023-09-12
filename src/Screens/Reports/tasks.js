import React, { useState, useRef, useEffect } from "react";
import { Checkbox, Icon } from "@blueprintjs/core";
import DoctorAnime from "./../../images/doctorAnime.png";
import Cookie from "universal-cookie";
import jwt from "jwt-decode";
import ChevronRight from "./../../images/chevronRight.png";
import Envelope from "./../../images/envelope-report.png";
import Reject from "./../../images/reject-report.png";
import Request from "./../../images/request-report.png";
import ToDoReport from "./../../images/todo-report.png";
import { GET } from "../dataSaver";
import { format } from "date-fns";
import style from "./index.module.scss";
import { formatInTimeZone } from "date-fns-tz";

const Tasks = () => {
  let cookie = new Cookie();
  let userDetails = cookie.get("user");
  const user = jwt(userDetails);
  const [currentUserDetails, setCurrentUserDetails] = useState();
  const [userId, setUserId] = useState(user?.id);

  useEffect(() => {
    setUserId(user?.id);
    setUserDetails();
  }, []);

  const setUserDetails = async () => {
    const { data: user } = await GET(`user-management-service/user/${userId}`);
    setCurrentUserDetails(user);
  };
  return (
    <div className={style.margin20}>
      <div className={style.bigCardGrid}>
        <div>
          <div className={style.cardStyle}>
            <div className={`${style.spaceBetween} ${style.alignCenter}`}>
              <div className={style.displayInRow}>
                <img src={DoctorAnime} className={style.userLogo} />
                <div className={`${style.marginLeft10} ${style.marginTop}`}>
                  <div className={style.userNameStyle}>
                    Hi, {user?.userName}
                  </div>
                  <div className={style.loginStatus}>
                    last login{" "}
                    {formatInTimeZone(
                      new Date(currentUserDetails?.lastLogin || new Date()),
                      "America/New_York",
                      "MMM d,yy h:mm a"
                    )}
                  </div>
                </div>
              </div>
              <img src={ChevronRight} className={style.roundChevronForUser} />
            </div>
          </div>
          <div>
            <h5 className={style.statisticsHeading}>February 23, 2022</h5>
          </div>
          <div className={`${style.taskCardStyle}`}>
            <Checkbox label="Task Status & Filters" checked />
            <div className={style.scrollStyle}>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <Checkbox label="New" checked />
                <div className={style.taskCountStyle}>20</div>
              </div>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <Checkbox label="In-Progress" checked />
                <div className={style.taskCountStyle}>20</div>
              </div>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <Checkbox label="Due in 48 hours" checked />
                <div className={style.taskCountStyle}>20</div>
              </div>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <Checkbox label="Past Dues" checked />
                <div className={style.taskCountStyle}>20</div>
              </div>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <Checkbox label="On Hold" checked />
                <div className={style.taskCountStyle}>20</div>
              </div>
              <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                <Checkbox label="New Messages" checked />
                <div className={style.taskCountStyle}>20</div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.bigCardStyle}>
          <div className={style.paginationCol}>
            <div></div>
            <div className={`${style.spaceBetween} ${style.margin20}`}>
              <div className={style.displayInRow}>
                <p className={style.paginationStyle}>
                  1 - 10 of 200
                  <span
                    className={`${style.marginLeft20} ${style.leftChevronColor}`}
                  >
                    &lt;
                  </span>{" "}
                </p>
                <img src={ChevronRight} className={style.roundChevron} />
              </div>
              <select name="sort" id="sort" className={style.selectFieldWidth}>
                <option value="Sort By">Sort By</option>
              </select>
              <select
                name="action"
                id="action"
                className={style.selectFieldWidth}
              >
                <option value="Action">Action</option>
              </select>
            </div>
          </div>
          <div
            className={`${style.margin20} ${style.spaceBetween} ${style.borderBottomStyle}`}
          >
            <div className={`${style.taskTabWidth} ${style.selectedTab}`}>
              <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                  <img
                    src={ToDoReport}
                    alt="todo"
                    className={style.iconStyle}
                  />
                  <p className={style.taskFontStyle}>To-Do Tasks</p>
                </div>
                <div className={style.taskCountStyle}>20</div>
              </div>
            </div>
            <div className={`${style.taskTabWidth} `}>
              <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                  <img src={Reject} alt="reject" className={style.iconStyle} />
                  <p className={style.taskFontStyle}>Rejected</p>
                </div>
                <div className={style.taskCountStyle}>20</div>
              </div>
            </div>
            <div className={`${style.taskTabWidth}`}>
              <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                  <img
                    src={Request}
                    alt="req"
                    className={style.iconRequestStyle}
                  />
                </div>
                <div className={style.taskCountStyle}>20</div>
              </div>
            </div>
            <div className={`${style.taskTabWidth}`}>
              <div className={style.spaceBetween}>
                <div className={style.displayInRow}>
                  <img
                    src={Envelope}
                    alt="envelope"
                    className={style.iconStyle}
                  />
                  <p className={style.taskFontStyle}>Messages</p>
                </div>
                <div className={style.taskCountStyle}>20</div>
              </div>
            </div>
          </div>
          <p className={`${style.taskFontStyle} ${style.marginLeft40}`}>
            Today
          </p>
          <div className={style.borderStyle}></div>
          <div className={style.marginLeft20}>
            <div className={style.taskTableGrid}>
              <div className={style.displayInRow}>
                <p className={style.headingStyle}>Status</p>
                <Icon
                  icon="info-sign"
                  color="#8A8C8D"
                  className={`${style.marginLeft10} ${style.marginTop3}`}
                  size={12}
                />
              </div>
              <div className={style.displayInRow}>
                <p className={style.headingStyle}>Contractor</p>
                <Icon
                  icon="info-sign"
                  color="#8A8C8D"
                  className={`${style.marginLeft10} ${style.marginTop3}`}
                  size={12}
                />
              </div>
              <div className={style.displayInRow}>
                <p className={style.headingStyle}>Timesheet Name</p>
                <Icon
                  icon="info-sign"
                  color="#8A8C8D"
                  className={`${style.marginLeft10} ${style.marginTop3}`}
                  size={12}
                />
              </div>
              <div className={style.displayInRow}>
                <p className={style.headingStyle}>Timesheet Period</p>
                <Icon
                  icon="info-sign"
                  color="#8A8C8D"
                  className={`${style.marginLeft10} ${style.marginTop3}`}
                  size={12}
                />
              </div>
              <div className={style.displayInRow}>
                <p className={style.headingStyle}>Prior Task Status</p>
                <Icon
                  icon="info-sign"
                  color="#8A8C8D"
                  className={`${style.marginLeft10} ${style.marginTop3}`}
                  size={12}
                />
              </div>
            </div>
            <div className={style.scrollStyle}>
              <div className={`${style.taskTableGrid} ${style.marginTop20}`}>
                <div className={`${style.statusStyle} ${style.redCard}`}>
                  Past Due
                </div>
                <div className={style.tableDataFontStyle}>Abhi Gholap, DO</div>
                <div className={style.tableDataFontStyle}>
                  PAMF Provider Timesheet
                </div>
                <div className={style.tableDataFontStyle}>Jan 1 - Jan 31</div>
                <div className={style.tableDataFontStyle}>
                  Timesheet Submitted
                </div>
                <div>
                  <img src={Envelope} alt="print" className={style.icons} />
                  <div className={style.notificationIcon}></div>
                  <div className={style.notificationCount}>1</div>
                </div>
                <div className={`${style.reviewStyle} ${style.blueCard}`}>
                  Review
                </div>
                <div className={style.tableDataFontStyle}>18:30</div>
              </div>
              <div className={style.borderStyleWithOutMargin}></div>
              <div className={`${style.taskTableGrid} ${style.marginTop20}`}>
                <div className={`${style.statusStyle} ${style.blueCard}`}>
                  Past Due
                </div>
                <div className={style.tableDataFontStyle}>
                  Martin Tindale, MD
                </div>
                <div className={style.tableDataFontStyle}>
                  PAMF Provider Timesheet
                </div>
                <div className={style.tableDataFontStyle}>Jan 1 - Jan 31</div>
                <div className={style.tableDataFontStyle}>
                  Timesheet Submitted
                </div>
                <div>
                  <img src={Envelope} alt="print" className={style.icons} />
                  <div className={style.notificationIcon}></div>
                  <div className={style.notificationCount}>1</div>
                </div>
                <div className={`${style.reviewStyle} ${style.blueCard}`}>
                  Review
                </div>
                <div className={style.tableDataFontStyle}>18:30</div>
              </div>
              <div className={style.borderStyleWithOutMargin}></div>
              <div className={`${style.taskTableGrid} ${style.marginTop20}`}>
                <div className={`${style.statusStyle} ${style.redCard}`}>
                  Past Due
                </div>
                <div className={style.tableDataFontStyle}>Jane Doe, MD</div>
                <div className={style.tableDataFontStyle}>
                  PAMF Provider Timesheet
                </div>
                <div className={style.tableDataFontStyle}>Jan 1 - Jan 31</div>
                <div className={style.tableDataFontStyle}>
                  Timesheet Submitted
                </div>
                <div>
                  <img src={Envelope} alt="print" className={style.icons} />
                  <div className={style.notificationIcon}></div>
                  <div className={style.notificationCount}>1</div>
                </div>
                <div className={`${style.reviewStyle} ${style.yellowCard}`}>
                  Review
                </div>
                <div className={style.tableDataFontStyle}>18:30</div>
              </div>
              <div className={style.borderStyleWithOutMargin}></div>
              <div className={`${style.taskTableGrid} ${style.marginTop20}`}>
                <div className={`${style.statusStyle} ${style.yellowCard}`}>
                  Past Due
                </div>
                <div className={style.tableDataFontStyle}>Marry Jones, PA</div>
                <div className={style.tableDataFontStyle}>
                  PAMF Provider Timesheet
                </div>
                <div className={style.tableDataFontStyle}>Jan 1 - Jan 31</div>
                <div className={style.tableDataFontStyle}>
                  Timesheet Submitted
                </div>
                <div>
                  <img src={Envelope} alt="print" className={style.icons} />
                  <div className={style.notificationIcon}></div>
                  <div className={style.notificationCount}>1</div>
                </div>
                <div className={`${style.reviewStyle} ${style.blueCard}`}>
                  Review
                </div>
                <div className={style.tableDataFontStyle}>18:30</div>
              </div>
            </div>
            <div className={style.borderStyleWithOutMargin}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
